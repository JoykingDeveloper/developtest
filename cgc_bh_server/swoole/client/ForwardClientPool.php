<?php

/**
 *
 * 转发连接池
 *
 * User: zmliu1
 * Date: 16/3/8
 * Time: 18:00
 */
class ForwardClientPool{

    private static $pool = array();

    /**
     * 转发消息
     * @param $host string 目标服务器地址
     * @param $port int 目标服务器端口
     * @param $data stdClass|array 需要发送的数据
     */
    public static function forwardData($host,$port,$data,$pack = true){
        self::forward($host,$port,json_encode($data),$pack);
    }

    /**
     * 转发消息
     * @param $host
     * @param $port
     * @param $dataStr
     * @param bool|true $pack
     */
    public static function forward($host,$port,$dataStr,$pack = true){
        $key = "$host:$port";

        /* @var $forwardClient ForwardClient */
        $forwardClient = null;
        if(isset(self::$pool[$key])){
            $forwardClient = self::$pool[$key];
        }

        if($forwardClient == null || $forwardClient->isCloseOff){
            $forwardClient = new ForwardClient($host,$port);
            self::$pool[$key] = $forwardClient;
        }

        $forwardClient->send($dataStr,$pack);
    }

}