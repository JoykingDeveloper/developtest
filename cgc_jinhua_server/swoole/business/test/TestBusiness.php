<?php

/**
 * Created by PhpStorm.
 * User: zmliu1
 * Date: 17/1/7
 * Time: 17:56
 */
class TestBusiness extends BaseBusiness{
    /**
     * 当服务 启动
     * @param $swProxyServer SwooleProxyServer
     * @param $work_id int
     */
    public function init($swProxyServer,$work_id){
        echo "server init";
    }

    /**
     * 处理业务
     * @param $swProxyServer SwooleProxyServer
     * @param $fd int 资源描述符
     * @param $data string 数据
     */
    public function index($swProxyServer,$fd,$data){
        echo $data . "\n";
        $swProxyServer->sendData($fd,json_encode(array(1,2,3)));
    }

    /**
     * @param $swProxyServer SwooleProxyServer
     */
    public function onConnect($swProxyServer, $fd, $from_id){
        echo "$fd connect\n";
    }

    /**
     * @param $swProxyServer SwooleProxyServer
     */
    public function onClose($swProxyServer, $fd, $from_id){
        echo "$fd close\n";
    }
}