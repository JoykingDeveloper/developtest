<?php

/**
 *
 * 游戏服务器接受消息的载体
 *
 * User: zmliu1
 * Date: 17/2/9
 * Time: 14:19
 */
class ExtGameBusiness extends BaseBusiness {

    /**
     * 当服务 启动
     * @param $swProxyServer SwooleProxyServer
     * @param $work_id int
     */
    public function init($swProxyServer,$work_id){
        require_once __DIR__ . "/../../../class/autoloader.php";
        autoloader::init();

        SwProxyInstance::$swooleProxy = $swProxyServer;
        SwProxyInstance::$work_id = $work_id;

        SwooleConnectHandler::onWorkerStart($swProxyServer,$work_id);

        if($work_id == 0){
            TimerConfig::init();
        }
    }

    /**
     * 处理业务
     * @param $swProxyServer SwooleProxyServer
     * @param $fd int 资源描述符
     * @param $data string 数据
     */
    public function index($swProxyServer,$fd,$data){
        echo $data . "\n";
        $data = json_decode($data,true);
        if(!is_array($data)){
            return;
        }

        $reqData = $this->parseRequest($data);

        $cStr = $reqData['c'];
        $serivceName = ApiConfig::$ExtGameRpcServiceName;
        /* @var $serivce ExtGameRpcService */
        $serivce = new $serivceName();
        $serivce->sender = isset($reqData['sender']) ? $reqData['sender'] : null;
        if($serivce->sender != null){
            $serivce->senderUid = $serivce->sender[0];
        }
        if(isset($reqData['room'])){
            $room = new vo_Room();
            $room->parse($reqData['room']);
            $serivce->room = $room;
        }
        if(isset($reqData['role'])){
            $role = new vo_Role();
            $role->parse($reqData['role']);
            $serivce->senderRole = $role;
        }
        if(method_exists($serivce,$cStr)){
            $serivce->$cStr($reqData);
        }
    }

    /***
     * 处理一次请求数据
     */
    public function parseRequest($request){
        foreach ($request as $key => $value) {
            if(is_string($value) && (StringUtil::startWith($value, '{') || StringUtil::startWith($value, '['))){
                $request[$key] = json_decode($value,true);
            }
        }
        return $request;
    }

}