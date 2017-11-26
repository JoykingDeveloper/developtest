<?php
/**
 * 游戏解析模型
 *
 * User: zmliu1
 * Date: 16/3/8
 * Time: 17:10
 */
class GameBusiness extends BaseBusiness{

    /**
     * 当服务 启动
     * @param $swProxyServer SwooleProxyServer
     * @param $work_id int
     */
    public function init($swProxyServer,$work_id){
        require_once __DIR__ . "/../../../class/autoloader.php";
        require_once "LoginPath.php";
        require_once "LogicPath.php";
        require_once "ForwardPath.php";
        require_once "AdminPath.php";
        autoloader::init();

        SwProxyInstance::$swooleProxy = $swProxyServer;
        SwProxyInstance::$work_id = $work_id;

        SwooleConnectHandler::onWorkerStart($swProxyServer,$work_id);

        if(SvrConfig::is_battle_server == 1){
            $swProxyServer->server->tick(42,"BattleWorldManager::update");
        }else if($work_id == 0){
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
        $data = json_decode($data,true);
        if(!is_array($data)){
            $this->sendError($swProxyServer,$fd,array("state"=>StateConstant::STATE_PARAMS_ERROR));
            return;
        }

        if(!isset($data["path"]) || !isset($data["reqData"])){
            $this->sendError($swProxyServer,$fd,array("state"=>StateConstant::STATE_PARAMS_ERROR));
            return;
        }

        $path = $data["path"];
        $pathObject = null;
        if($path == "login") $pathObject = new LoginPath();
        else if($path == "logic") $pathObject = new LogicPath();
        else if($path == "forward") $pathObject = new ForwardPath();
        else if($path == "admin") $pathObject = new AdminPath();
        if($pathObject == null){
            $this->sendError($swProxyServer,$fd,array("state"=>StateConstant::STATE_PARAMS_ERROR));
            return;
        }

        if($path == "forward" || $path == "admin"){
            $pathObject->index($swProxyServer,$fd,$this->parseRequest($data["reqData"]));
        }else{
            $reqData = AES::decode($data["reqData"]);
//            $reqData = json_decode($reqData,true);
            if($reqData == null){
                $this->sendError($swProxyServer,$fd,array("state"=>StateConstant::STATE_PARAMS_ERROR));
                return;
            }else{
                $reqData = $this->parseRequest($reqData);
            }
            $pathObject->index($swProxyServer,$fd,$reqData);
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

    /**
     * @param $swProxyServer SwooleProxyServer
     */
    public function onConnect($swProxyServer, $fd, $from_id){
        SwooleConnectHandler::onConnect($swProxyServer,$fd,$from_id);
    }

    /**
     * @param $swProxyServer SwooleProxyServer
     */
    public function onClose($swProxyServer, $fd, $from_id){
        SwooleConnectHandler::onClose($swProxyServer,$fd,$from_id);
    }

    public function sendError(SwooleProxyServer $server,$fd,$data){
        $value = json_encode($data);
        $value = AES::encode($value);
        $server->sendData($fd,$value);
    }

}