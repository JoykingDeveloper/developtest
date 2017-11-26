<?php

/**
 *
 * websocket服务器
 *
 * User: zmliu1
 * Date: 17/1/7
 * Time: 16:49
 */

require_once "SwooleProxyServer.php";

class SwooleWebSocketProxyServer extends SwooleProxyServer{

    /* @var $server swoole_websocket_server */
    public $server;

    public function start(){
        register_shutdown_function("SwooleProxyServer::handleFatal");

        $this->setProcessTitle();

        $server = new swoole_websocket_server(SwooleSetting::$host,SwooleSetting::$port);
        $server->set(SwooleSetting::$setting);

        $server->on("start",array($this,"onStart"));
        $server->on("workerStart",array($this,"onWorkerStart"));
        $server->on("open",array($this,"onOpen"));
        $server->on("message",array($this,"onMessage"));
        $server->on("close",array($this,"onClose2"));
        $server->on("timer",array($this,"onTimer"));
        $server->on("task",array($this,"onTask"));
        $server->on("finish",array($this,"onFinish"));
        $server->on("pipeMessage",array($this,"onPipeMessage"));

        $server->start();
    }

    public function onOpen(swoole_websocket_server $server, $request){
//        echo "server: handshake success with fd{$request->fd}\n";
        $this->business->onConnect($this,$request->fd,-1);
    }

    public function onMessage(swoole_websocket_server $server, $frame){
//        echo "receive from {$frame->fd}:{$frame->data},opcode:{$frame->opcode},fin:{$frame->finish}\n";
//        $server->push($frame->fd, json_encode(array("this is server")));
        $this->business->index($this,$frame->fd,$frame->data);
    }

    public function onClose2(swoole_websocket_server $server, $fd){
//        echo "client {$fd} closed\n";
        $this->business->onClose($this,$fd,-1);
    }

    /**
     * 发送数据
     */
    public function sendData($fd,$data){
        if($fd == -1 || $fd == null) return;
        if($this->server->exist($fd)){
            $this->server->push($fd,$data);
        }
    }

    /***
     * 发送对象数据
     */
    public function sendObjectData($fd,$data){
        if($fd == -1 || $fd == null) return;
        $this->sendData($fd,json_encode($data));
    }

}