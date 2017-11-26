<?php

/**
 * Created by PhpStorm.
 * User: zmliu1
 * Date: 16/3/9
 * Time: 10:18
 */
class ForwardConfig{

    /** 转发配置刷新地址 */
    private static $configsRefreshPath = "http://192.168.2.188/aptana/cgc_platform/platform_svrlist/serverlist.php";
    /** 最后一个刷新的时间戳 */
    private static $lastRefreshTime = 0;
    /** 转发配置刷新地址列表刷新间隔 */
    private static $refreshInterval = 180;

    /** 转发服务器配置 */
    private static $configs = array(
        //游戏服务器物理编号->ip+port
    );

    /**
     * 获取所有服务器配置
     * @return array
     */
    public static function getAllSvr(){
        self::refreshConfigs();
        return self::$configs;
    }

    /**
     * 根据游戏服务器物理编号，获取转发地址+port
     * @param $svrId
     * @return array
     */
    public static function getSvr($svrId){
        self::refreshConfigs();
        if(isset(self::$configs[$svrId])){
            return self::$configs[$svrId];
        }
        return null;
    }

    /** 刷新配置 */
    public static function refreshConfigs(){
        if(time() - self::$lastRefreshTime <= self::$refreshInterval){
            return;
        }
        self::$configs = self::reqList();
    }

    /**
     * 请求中转服务器列表
     */
    private static function reqList(){
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, self::$configsRefreshPath);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $output = curl_exec($ch);
        curl_close($ch);
        return json_decode($output,true);
    }


}