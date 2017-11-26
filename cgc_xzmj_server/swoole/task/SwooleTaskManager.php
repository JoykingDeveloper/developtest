<?php

/**
 * Created by PhpStorm.
 * User: zmliu1
 * Date: 15/8/20
 * Time: 14:47
 */

require_once "SwooleTask.php";

class SwooleTaskManager{

    /* @var $server swoole_server */
    private static $server;

    public static function initManager($server){
        self::$server = $server;
    }

    /**
     * @param $task SwooleTask
     */
    public static function addTask($task,$dst_worker_id = -1){
        self::$server->task($task,$dst_worker_id);
    }


}