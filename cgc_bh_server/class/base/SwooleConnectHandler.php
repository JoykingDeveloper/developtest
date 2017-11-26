<?php

/**
 * Created by PhpStorm.
 * User: zmliu1
 * Date: 15/9/2
 * Time: 08:56
 */
class SwooleConnectHandler {

    /**
     * @param $server   SwooleProxyServer
     * @param $work_id
     */
    public static function onWorkerStart($server,$work_id){
        if($work_id == 0) SwProxyInstance::clearFD();
    }

    /**
     * @param $server   SwooleProxyServer
     * @param $fd
     * @param $from_id
     */
    public static function onConnect($server, $fd, $from_id){

    }

    /**
     * @param $server   SwooleProxyServer
     * @param $fd
     * @param $from_id
     */
    public static function onClose($server, $fd, $from_id){
        $uid = SwProxyInstance::removeFD($fd);
        if($uid == null) return;
    }

}