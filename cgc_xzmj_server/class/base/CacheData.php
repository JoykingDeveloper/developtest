<?php

/**
 *
 * 一些暂时用来保存在内存中的数据
 *
 * User: zmliu1
 * Date: 16/5/16
 * Time: 15:20
 */
class CacheData{

    private static $cacheDatas = array();

    public static function saveRamData($key,$value){
        self::$cacheDatas[$key] = $value;
    }

    public static function getRamData($key){
        if(isset(self::$cacheDatas[$key])){
            return self::$cacheDatas[$key];
        }
        return null;
    }

    public static function removeRamData($key){
        unset(self::$cacheDatas[$key]);
    }





}