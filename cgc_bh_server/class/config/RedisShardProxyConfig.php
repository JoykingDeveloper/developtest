<?php

/**
 *
 * redis分片配置
 *
 * User: zmliu1
 * Date: 16/6/20
 * Time: 18:06
 */
class RedisShardProxyConfig{

    public static $redis_count = 1;

    public static $configs = array(
        array(
            'host'=>'192.168.2.40',
            'port'=>6379,
            'dbIndex'=>7,
            'pwd'=>''
        )
    );

}