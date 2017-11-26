<?php

/**
 *
 * 转发服务器列表配置
 *
 * User: zmliu1
 * Date: 16/3/15
 * Time: 09:31
 */
class ForwardServerConfig{

    /** 中转服务器列表刷新地址 */
    private static $forwardServerListRefreshPath = "http://192.168.2.188/aptana/cgc_platform/forward_serverlist/serverlist.php";
    /** 最后一个刷新的时间戳 */
    private static $lastRefreshTime = 0;
    /** 转发配置刷新地址列表刷新间隔 */
    private static $refreshInterval = 180;

    /** 转发服务器列表 */
    private static $forwardServerList = array();
    /** 转发服务器数量 */
    private static $serverCount = 0;

    /**
     * 刷新服务器列表
     */
    public static function refreshServerList(){
        if(time() - self::$lastRefreshTime <= self::$refreshInterval){
            return;
        }
        self::$forwardServerList = self::reqList();
        self::$serverCount = count(self::$forwardServerList) - 1;
    }

    /**
     * 请求中转服务器列表
     */
    private static function reqList(){
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, self::$forwardServerListRefreshPath);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $output = curl_exec($ch);
        curl_close($ch);
        return json_decode($output,true);
    }

    /**
     * 获取一个转发服务器的配置
     */
    public static function getServer(){
        self::refreshServerList();
        $index = rand(0,self::$serverCount);
        return self::$forwardServerList[$index];
    }

}