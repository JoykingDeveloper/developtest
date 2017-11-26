<?php

/**
 * Created by PhpStorm.
 * User: zmliu1
 * Date: 15/8/24
 * Time: 19:56
 */
class SwProxyInstance {

    /* @var SwooleProxyServer */
    public static $swooleProxy;
    public static $work_id;

    /***
     * 发送对象数据
     */
    public static function sendObjectData($uid,$data){
        if(self::$swooleProxy == null) return;

        $fd = self::getFDbyUID($uid);
        if(!$fd || $fd == null) return;

        $arr = explode(":",$fd);
        $fd = $arr[0];
        $svrId = $arr[1];

        if($svrId == SvrConfig::svr_id){
            $value = json_encode($data);
            $value = AES::encode($value);
            self::$swooleProxy->sendData($fd,$value);
        }else{
            self::forwardData(array($svrId=>array($fd)),$data);
        }
    }

    /**
     * 广播消息
     * @param $data
     */
    public static function broadcast($data,$forward = true){
        if(self::$swooleProxy == null) return;

        $allFD = self::getSvrFDs(SvrConfig::svr_id);
        $value = json_encode($data);
        $value = AES::encode($value);
        foreach($allFD as $index => $fd){
            self::$swooleProxy->sendData($fd,$value);
        }
        if($forward){
            self::forwardData(null,$data);
        }
    }

    /**
     * 广播消息
     * @param $data
     */
    public static function broadcastToList($uids,$data){
        if(self::$swooleProxy == null || count($uids) <= 0) return;

        $allFD = SwProxyInstance::getFDbyUIDS($uids);
        $value = json_encode($data);
        $value = AES::encode($value);
        $forwards = array();
        foreach($allFD as $uid => $fd){
            if(!$fd || $fd == null) continue;

            $arr = explode(":",$fd);
            $fd = $arr[0];
            $svrId = $arr[1];

            if($svrId == SvrConfig::svr_id){
                self::$swooleProxy->sendData($fd,$value);
            }else{
                $fds = null;
                if(isset($forwards[$svrId])){
                    $fds = $forwards[$svrId];
                    array_push($fds,$fd);
                }else{
                    $fds = array();
                    array_push($fds,$fd);
                }
                $forwards[$svrId] = $fds;
            }
        }

        if(count($forwards) > 0) self::forwardData($forwards,$data);
    }

    /**
     * 转发消息
     * @param $targets  array    array(目标服务器编号=>array(fd1,fd2))
     * @param $data
     */
    public static function forwardData($targets,$data){
        $forwardConfig = ForwardServerConfig::getServer();
        $sendData = array('from'=>SvrConfig::svr_id,'targets'=>$targets,'data'=>$data);
        ForwardClientPool::forwardData($forwardConfig[0],$forwardConfig[1],$sendData);
    }

    public static function addFD($uid,$fd){
        if(self::$swooleProxy == null) return;

        $svrid = SvrConfig::svr_id;
        BaseDao::getRedis()->hash_hSet("sw:fd:uid","$fd:$svrid",$uid);
        BaseDao::getRedis()->hash_hSet("sw:uid:fd",$uid,"$fd:$svrid");
        //本服的fd记录到一个统一的位置
        BaseDao::getRedis()->list_lPush("sw:fd:svr:$svrid",$fd);
    }

    public static function removeUID($uid){
        if(self::$swooleProxy == null) return;

        $fd = self::getFDbyUID($uid);
        $svrid = SvrConfig::svr_id;
        if($fd != null) BaseDao::getRedis()->hash_hDel("sw:fd:uid","$fd:$svrid");
        BaseDao::getRedis()->hash_hDel("sw:uid:fd",$uid);

        //移除本服的fd
        BaseDao::getRedis()->list_lRem("sw:fd:svr:$svrid",$fd,1);
    }

    public static function removeFD($fd){
        if(self::$swooleProxy == null) return null;

        $uid = self::getUIDbyFD($fd);
        if($uid != null) BaseDao::getRedis()->hash_hDel("sw:uid:fd",$uid);

        $svrid = SvrConfig::svr_id;
        BaseDao::getRedis()->hash_hDel("sw:fd:uid","$fd:$svrid");

        //移除本服的fd
        BaseDao::getRedis()->list_lRem("sw:fd:svr:$svrid",$fd,1);

        return $uid;
    }

    public static function getFDbyUID($uid){
        if(self::$swooleProxy == null) return null;

        $value = BaseDao::getRedis()->hash_hGet("sw:uid:fd",$uid);
        return $value;
    }

    public static function getFDbyUIDS($uids){
        if(self::$swooleProxy == null) return array();

        $fds = BaseDao::getRedis()->hash_hMGet("sw:uid:fd",$uids);
        return $fds;
    }

    public static function getUIDbyFD($fd){
        if(self::$swooleProxy == null) return null;

        $svrid = SvrConfig::svr_id;
        return BaseDao::getRedis()->hash_hGet("sw:fd:uid","$fd:$svrid");
    }

    /**
     * 获取某台服务器的所有fd
     */
    public static function getSvrFDs($svrId){
        return BaseDao::getRedis()->list_lRange("sw:fd:svr:$svrId",0,-1);
    }

    public static function getAllFD(){
        if(self::$swooleProxy == null) return array();

        return BaseDao::getRedis()->hash_hGetAll("sw:uid:fd");
    }

    public static function clearFD(){
        $allFD = self::getAllFD();
        foreach($allFD as $uid => $fd){
            if(!$fd || $fd == null) continue;

            $arr = explode(":",$fd);
            $fd = $arr[0];
            $svrId = $arr[1];

            if($svrId == SvrConfig::svr_id){
                BaseDao::getRedis()->hash_hDel("sw:fd:uid","$fd:$svrId");
                BaseDao::getRedis()->hash_hDel("sw:uid:fd",$uid);
            }
        }
        $svrId = SvrConfig::svr_id;
        BaseDao::getRedis()->del("sw:fd:svr:$svrId");
    }

    /**
     * 判断玩家是否在线
     */
    public static function isOlineByUid($uid){
        if(self::$swooleProxy == null) return false;
        $fd = self::getFDbyUID($uid);
        if($fd == null)
            return false;
        return true;
    }

    /**
     * 判断玩家是否在线
     * @param $fd
     */
    public static function isOline($fd){
        if(self::$swooleProxy == null) return false;
        return self::$swooleProxy->server->exist($fd);
    }

    /**
     * 关闭连接
     */
    public static function closeFD($fd){
        if(self::$swooleProxy == null) return;
        self::$swooleProxy->server->close($fd);
    }

    /**
     * 添加一个任务
     * @param $task SwooleTask
     */
    public static function addTask($task,$dst_worker_id = -1){
        if(self::$swooleProxy == null) return;
        SwooleTaskManager::addTask($task,$dst_worker_id);
    }

    /**
     * 添加一个定时器
     * @param $config   string  执行日期 -> 年 月 日 时 分 秒 星期(* * * * * * *)
     * @param $timer    SwooleTimer
     */
    public static function addTimer($config,$timer){
        if(self::$swooleProxy == null) return;

        SwooleTimerManager::addTimer($config,$timer);
    }

    /**
     * 添加一个定时器
     * @param $delay        int 倒计时间隔
     * @param $repeatCount  int 重复次数
     * @param $timer        SwooleTimer
     */
    public static function addTimerDown($delay,$repeatCount,$timer){
        if(self::$swooleProxy == null) return;

        SwooleTimerManager::addTimeDown($delay,$repeatCount,$timer);
    }

    /**
     * 删除一个定时器
     */
    public static function removeTimer($id){
        if(self::$swooleProxy == null) return;

        SwooleTimerManager::removeTimer($id);
    }

    /**
     * 获取客户端ip
     * @param $fd
     * @return string
     */
    public static function getClientIp($fd){
        if(self::$swooleProxy == null) return "127.0.0.1";

        $fdInfo = self::$swooleProxy->server->connection_info($fd);

        if(isset($fdInfo['remote_ip'])){
            return $fdInfo['remote_ip'];
        }

        return "127.0.0.1";
    }

}