<?php
/**
 * Created by PhpStorm.
 * User: zmliu1
 * Date: 15/8/3
 * Time: 20:13
 */

class SwooleSetting{

    public static $host = "0.0.0.0";

    public static $port = 9502;

    /** 默认为多进程模式 */
    public static $server_mode = 3;

    /** 默认为tcp ipv4 socket */
    public static $sock_type = 1;

    public static $setting = array(
//        'process_title'=>'GameServer',

//        'daemonize' => 1,
//        'log_file' => '/Users/zmliu1/Downloads/swoole.log',
        'worker_num' => 2,
        'task_worker_num' => 2,
        'open_length_check'=>true,
        'package_length_type'=>'N',
        'package_length_offset'=>0,
        'package_body_offset'=>4,
//        'package_max_length'=>65536,
        'heartbeat_check_interval' => 60,
        'heartbeat_idle_time' => 3600,
        'task_ipc_mode'=>2,
        'message_queue_key'=>'a'
    );
}
?>