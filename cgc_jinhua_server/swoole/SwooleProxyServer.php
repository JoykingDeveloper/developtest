<?php

/**
 * Created by PhpStorm.
 * User: zmliu1
 * Date: 15/8/3
 * Time: 20:30
 *
 * @property SwooleSession session 玩家的FD保存在这里
 */

require_once "SwooleSetting.php";
require_once "timer/SwooleTimerManager.php";
require_once "task/SwooleTaskManager.php";
require_once "client/ForwardClient.php";
require_once "client/ForwardClientPool.php";
require_once "business/BaseBusiness.php";

class SwooleProxyServer{

    /* @var $server swoole_server */
    public $server;

    /* @var $business BaseBusiness */
    public $business;

    /**
     * @param $business BaseBusiness 业务解析模型
     */
    function __construct($business){
        $this->business = $business;
    }

    public function start(){
        register_shutdown_function("SwooleProxyServer::handleFatal");

        $this->setProcessTitle();

        $server = new swoole_server(SwooleSetting::$host,SwooleSetting::$port,SwooleSetting::$server_mode,SwooleSetting::$sock_type);
        $server->set(SwooleSetting::$setting);

        swoole_server_handler($server,"onStart",array($this,"onStart"));
        swoole_server_handler($server,"onWorkerStart",array($this,"onWorkerStart"));
        swoole_server_handler($server,"onConnect",array($this,"onConnect"));
        swoole_server_handler($server,"onReceive",array($this,"onReceive"));
        swoole_server_handler($server,"onClose",array($this,"onClose"));
        swoole_server_handler($server,"onTimer",array($this,"onTimer"));
        swoole_server_handler($server,"onTask",array($this,"onTask"));
        swoole_server_handler($server,"onFinish",array($this,"onFinish"));
        swoole_server_handler($server,"onPipeMessage",array($this,"onPipeMessage"));

        swoole_server_start($server);
    }

    public function onStart(swoole_server $server){
        echo "pid:" . getmypid() . "\n";
        echo "swoole version:" . swoole_version() . "\n";
        $this->setProcessTitle();
    }

    public function onWorkerStart(swoole_server $server,$work_id){
        if($work_id > SwooleSetting::$setting['worker_num']){
            $this->setProcessTitle("task");
        }else{
            $this->setProcessTitle();
        }

        $this->server = $server;

        define('BASEPATH',1);

        date_default_timezone_set("PRC");

        if($work_id == 0) SwooleTimerManager::initTimerManager($this,true);
        else SwooleTimerManager::initTimerManager($this);

        SwooleTaskManager::initManager($server);

        $this->business->init($this,$work_id);
    }

    public function onConnect(swoole_server $server, $fd, $from_id){
        $this->business->onConnect($this,$fd,$from_id);
    }

    public function onReceive(swoole_server $server, $fd, $from_id, $data){
        $data = $this->business->unPackData($data);
        $this->business->index($this,$fd,$data);
    }

    public function onClose(swoole_server $server, $fd, $from_id){
        $this->business->onClose($this,$fd,$from_id);
    }

    public function onTimer($server,$interval){

    }

    public function onTask($server,$task_id,$from_id,$data){
        /* @var $data SwooleTask*/
        $data->execute($this);
        return "suc";
    }

    public function onFinish($server,$task_id,$data){}

    public function onPipeMessage($server, $src_worker_id, $data){
        $data = json_decode($data,true);
        $cmd = $data['cmd'];
        if($cmd == 'timer'){
            $timerType = $data['ty'];
            $timer = unserialize($data['t']);
            if($timerType == 0){
                $timerConfig = $data['tConfig'];
                SwooleTimerManager::addTimer($timerConfig,$timer);
            }else if($timerType == 1){
                $delay = $data['delay'];
                $repeatCount = $data['repeatCount'];
                SwooleTimerManager::addTimeDown($delay,$repeatCount,$timer);
            }
        }else if($cmd == 'rmTimer'){
            $id = $data['id'];
            SwooleTimerManager::removeTimer($id);
        }
    }

    /**
     * 发送数据
     */
    public function sendData($fd,$data){
        if($fd == -1 || $fd == null) return;
        if($this->server->exist($fd)){
            $this->server->send($fd,$this->business->packData($data));
        }
    }

    /***
     * 发送对象数据
     */
    public function sendObjectData($fd,$data){
        if($fd == -1 || $fd == null) return;
        $this->sendData($fd,json_encode($data));
    }

    public function setProcessTitle($prefix = ""){
        if(isset(SwooleSetting::$setting["process_title"])){
            if(function_exists("cli_set_process_title")){
                cli_set_process_title(SwooleSetting::$setting["process_title"]);
            }else if($prefix == ""){
                swoole_set_process_name(SwooleSetting::$setting["process_title"]);
            }else{
                swoole_set_process_name(SwooleSetting::$setting["process_title"] . "_$prefix");
            }
        }
    }

    public static function handleFatal(){
        $error = error_get_last();
        if (isset($error['type'])) {
            switch ($error['type']) {
                case E_ERROR :
                case E_PARSE :
                case E_DEPRECATED:
                case E_CORE_ERROR :
                case E_COMPILE_ERROR :
                    $message = $error['message'];
                    $file = $error['file'];
                    $line = $error['line'];
                    $log = "$message ($file:$line)\nStack trace:\n";
                    $trace = debug_backtrace();
                    foreach ($trace as $i => $t) {
                        if (!isset($t['file'])) {
                            $t['file'] = 'unknown';
                        }
                        if (!isset($t['line'])) {
                            $t['line'] = 0;
                        }
                        if (!isset($t['function'])) {
                            $t['function'] = 'unknown';
                        }
                        $log .= "#$i {$t['file']}({$t['line']}): ";
                        if (isset($t['object']) && is_object($t['object'])) {
                            $log .= get_class($t['object']) . '->';
                        }
                        $log .= "{$t['function']}()\n";
                    }
                    if (isset($_SERVER['REQUEST_URI'])) {
                        $log .= '[QUERY] ' . $_SERVER['REQUEST_URI'];
                    }
                    error_log($log);
            }
        }
    }



}