<?php

require_once 'Flexihash/Flexihash.php';

/**
 *
 * 一致性hash
 *
 * User: zmliu1
 * Date: 16/6/24
 * Time: 14:28
 */
class MySQLFlexihashHelper
{

    private static $flexiHash;
    private static $hashCache = array();


    /**
     * @return Flexihash
     * @throws Exception
     */
    private static function getFlexihash(){
        if(self::$flexiHash == null){
            self::$flexiHash = new Flexihash(new Crc32Hasher(),24);
            for($i = 0 ; $i < MySQLShardProxyConfig::$mysql_count ; $i++){
                self::$flexiHash->addTarget($i);
            }
            self::$hashCache = array();
        }
        return self::$flexiHash;
    }

    public static function getIndex($key){
        if(isset(self::$hashCache[$key])){
            return self::$hashCache[$key];
        }
        $index = self::getFlexihash()->lookup($key);
        self::$hashCache[$key] = $index;
        return $index;
    }





}