<?php
class BaseDao{
    private static $redisShardProxy;
    private static $mysqlShardProxy;
    private static $asyncSqlIndex = 0;

    public static $asyncSqlCount = 0;
    public static $redisUseCount = 0;

    /**
     * @return MySQLShardProxy
     */
    public static function getDB(){
        if(self::$mysqlShardProxy == null){
            self::$mysqlShardProxy = new MySQLShardProxy();
        }
        return self::$mysqlShardProxy;
    }

    /**
     * @return RedisShardProxy
     */
    public static function getRedis(){
        if(self::$redisShardProxy == null){
            self::$redisShardProxy = new RedisShardProxy();
        }
        return self::$redisShardProxy;
    }

    /**
     * 异步执行sql
     * */
    public static function asynchronizedExecuteSql($key,$sql){
        if($sql == null){ return; }
        self::$asyncSqlCount++;
        if(Config::$asyncSql){
            self::getRedis()->getRedisByIndex(self::$asyncSqlIndex)->list_lPush('asyncSql',json_encode(array($key,$sql)));
            self::$asyncSqlIndex++;
            if(self::$asyncSqlIndex >= RedisShardProxyConfig::$redis_count){
                self::$asyncSqlIndex = 0;
            }
        }else{
            self::getDB()->ExecuteSQL($key,$sql);
        }
    }

    public static function clearCounts(){
        self::$redisUseCount = 0;
        self::$asyncSqlCount = 0;
        MySQL::$selectCount = 0;
    }

    public static function logPerformTime($api,$c,$time){
        $hashName = 'performTime';
        $key = $api.'|'.$c;
        $data = self::getRedis()->hash_getObject($hashName, $key,null,true);
        if($data != null){
            $count = $data['count'];
            $oldTime = $data['time'];

            $oldTime += $time;
            $count += 1;
            $avgTime = $oldTime / $count;

            $redis = self::$redisUseCount + $data['redis'];
            $dbW = self::$asyncSqlCount + $data['dbW'];
            $dbR = MySQL::$selectCount + $data['dbR'];
            $redisAvg = $redis / $count;
            $dbWAvg = $dbW / $count;
            $dbRAvg = $dbR / $count;

            self::getRedis()->hash_putObject($hashName, $key, array('count'=>$count,'time'=>$oldTime,'avgTime'=>$avgTime,'redis'=>$redis,'redisAvg'=>$redisAvg,'dbW'=>$dbW,'dbWAvg'=>$dbWAvg,'dbR'=>$dbR,'dbRAvg'=>$dbRAvg));
        }else{
            self::getRedis()->hash_putObject($hashName, $key, array('count'=>1,'time'=>$time,'redis'=>self::$redisUseCount,'dbW'=>self::$asyncSqlCount,'dbR'=>MySQL::$selectCount));
        }
        self::clearCounts();
    }

    public static function getPerformTime(){
        return self::getRedis()->hash_getAllObjecy('performTime');
    }

    /**
     * 记录玩家最后一次请求的返回值
     * */
    public static function logLastReqMsg($uid,$msg){
        if($uid != null){
            self::getRedis()->str_Set('lastReq:'.$uid, $msg,Values::_1HourSeconds);
        }
    }

    /**
     * 获取玩家最后一次请求的消息
     * */
    public static function getLastReqMsg($uid){
        if($uid != null){
            return self::getRedis()->str_Get('lastReq:'.$uid);
        }
        return null;
    }

    /**
     * 获取玩家最后一次请求的消息
     * */
    public static function getLastReqMsg2($uid){
        return self::getRedis()->str_Get('lastReq:'.$uid);
    }

    /**
     * 根据uid获取最后一次拉取的消息
     * */
    public static function getLastReqMsgByUid($uid){
        return self::getRedis()->str_Get('lastReq:'.$uid);
    }



}


?>