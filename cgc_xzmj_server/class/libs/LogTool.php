<?php

/**
 * 日志记录工具
 * User: zmliu1
 * Date: 17/9/18
 * Time: 14:51
 */
class LogTool{

    /**
     * 日志记录
     * @param $log
     */
    public static function log($log){
        $toFile = false;
        if(isset(SwooleSetting::$setting['daemonize']) && SwooleSetting::$setting['daemonize'] == 1){
            $toFile = true;
        }
        $dirName = "/tmp/";
        $toFileName = $dirName . date('Y-m-d');
        if(isset(SwooleSetting::$setting['process_title'])){
            $toFileName = $dirName . SwooleSetting::$setting['process_title'] . "_" . date('Y-m-d');
        }
        if(!is_dir($dirName)){
            mkdir($dirName);
        }

        if(is_array($log) || is_object($log)){
            $log = json_encode($log);
        }

        if($toFile){
            file_put_contents($toFileName, date('Y-m-d H:i:s') . ":" . $log . "\n", FILE_APPEND);
        }else{
            echo date('Y-m-d H:i:s') . ":" . $log . "\n";
        }
    }

}