<?php

/**
 *
 * mysql分片配置
 *
 * User: zmliu1
 * Date: 16/6/22
 * Time: 09:24
 */
class MySQLShardProxyConfig{

    public static $mysql_count = 1;

    public static $configs = array(
        array(
            'host'=>'192.168.2.43:3306',
            'user'=>'zhuzhu',
            'pwd'=>'zhuzhu',
            'dbname'=>'cgc_platform'
        )
    );

}