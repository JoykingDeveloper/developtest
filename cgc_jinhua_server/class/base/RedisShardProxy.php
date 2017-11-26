<?php

/**
 *
 *
 *
 * User: zmliu1
 * Date: 16/6/20
 * Time: 17:57
 */
class RedisShardProxy{

    private static $rediss = array();

    private static $redis_heart_time = array();//db 心跳时间
    private static $redis_heart_time_interval = 60;//心跳间隔

    /**
     * @return RedisUtil
     */
    private function getRedis($redisConf){
        BaseDao::$redisUseCount++;

        $host = $redisConf['host'];
        $port = $redisConf['port'];
        $dbIndex = $redisConf['dbIndex'];

        $redis_key = "$host --> $port --> $dbIndex";

        /* @var $redis RedisUtil */
        if(isset(self::$rediss[$redis_key])){
            $redis = self::$rediss[$redis_key];

            //心跳检测
            $now = time();
            if(isset(self::$redis_heart_time[$redis_key])){
                $heart_time = self::$redis_heart_time[$redis_key];
                if($now - $heart_time >= self::$redis_heart_time_interval) {
                    $redis->exists("heart_key");
                    self::$redis_heart_time[$redis_key] = $now;
                }
            }else{
                self::$redis_heart_time[$redis_key] = $now;
            }

            if($redis->getLastError() != null){
                $redis->close();
                unset(self::$rediss[$redis_key]);
                unset(self::$redis_heart_time[$redis_key]);
            }else{
                return $redis;
            }
        }

        $redis = new RedisUtil();
        $redis->connect($host,$port);
        if($redisConf['pwd'] != ''){
            $redis->auth($redisConf['pwd']);
        }
        $redis->select($dbIndex);
        if($redis->getLastError() != null || !$redis->isConnect) {
            echo "Redis connect error \n";
            echo $redis->getLastError() . "\n";
            exit(0);
        }
        self::$rediss[$redis_key] = $redis;
        return $redis;
    }

    private function getKeyIndex($key){
        return RedisFlexihashHelper::getIndex($key);
    }

    public function getRedisByKey($key){
        $index = $this->getKeyIndex($key);
        return $this->getRedis(RedisShardProxyConfig::$configs[$index]);
    }

    public function getRedisByIndex($index){
        return $this->getRedis(RedisShardProxyConfig::$configs[$index]);
    }

    /**
     * 设定过期事件
     * @param  string   $key    需要设置过期时间的key
     * @param  int      $expire 过期时间(秒)
     * */
    public function setTimeout($key,$expire){
        $this->getRedisByKey($key)->setTimeout($key,$expire);
    }

    /**
     * 判断某个key是否存在
     * */
    public function exists($key){
        return $this->getRedisByKey($key)->exists($key);
    }

    /**
     * 添加字符串串
     * */
    public function str_Set($key,$values,$timeout=604800){
        $this->getRedisByKey($key)->str_Set($key,$values,$timeout);
    }

    /**
     * 删除字符串
     * */
    public function str_delete($key){
        $this->getRedisByKey($key)->str_delete($key);
    }

    /*
		 * 删除字符串2
		 */
    public function delStr($key){
        $this->getRedisByKey($key)->delStr($key);
    }

    /**
     * 获取字符串
     * */
    public function str_Get($key){
        return $this->getRedisByKey($key)->str_Get($key);
    }

    /**
     * 在list左边头添加元素
     * */
    public function list_lPush($key,$value){
        $this->getRedisByKey($key)->list_lPush($key,$value);
    }

    /**
     * 在list右边头添加元素
     * */
    public function list_rPush($key,$value){
        $this->getRedisByKey($key)->list_rPush($key,$value);
    }

    /**
     * 在list左边头删除元素，并且返回元素
     * */
    public function list_lPop($key){
        return $this->getRedisByKey($key)->list_lPop($key);
    }

    /**
     * 在list右边头删除元素，并且返回元素
     * */
    public function list_rPop($key){
        return $this->getRedisByKey($key)->list_rPop($key);
    }

    /**
     * 获取list长度
     * */
    public function list_lSize($key){
        return $this->getRedisByKey($key)->list_lSize($key);
    }

    /**
     *  设置指定位置的值
     * */
    public function list_lSet($key,$index,$value){
        $this->getRedisByKey($key)->list_lSet($key,$index,$value);
    }

    /**
     * 获取指定位置的值
     * */
    public function list_lGet($key,$index){
        return $this->getRedisByKey($key)->list_lGet($key,$index);
    }

    /**
     * 截取list
     * */
    public function list_lTrim($key,$start,$end){
        $this->getRedisByKey($key)->list_lTrim($key,$start,$end);
    }

    public function list_lRem($key,$value,$count){
        return $this->getRedisByKey($key)->list_lRem($key,$value,$count);
    }

    public function list_lRange($key,$start,$end){
        return $this->getRedisByKey($key)->list_lRange($key,$start,$end);
    }

    public function list_lIndex($key, $value){
        return $this->getRedisByKey($key)->list_lIndex($key, $value);
    }

    public function hash_hSet($hashName,$key,$value,$expire=604800){
        $this->getRedisByKey($hashName)->hash_hSet($hashName,$key,$value,$expire);
    }

    public function hash_hGet($hashName,$key){
        return $this->getRedisByKey($hashName)->hash_hGet($hashName,$key);
    }

    public function hash_hLen($hashName){
        return $this->getRedisByKey($hashName)->hash_hLen($hashName);
    }

    public function hash_hDel($hashName,$key){
        $this->getRedisByKey($hashName)->hash_hDel($hashName,$key);
    }

    public function hash_hKeys($hashName){
        return $this->getRedisByKey($hashName)->hash_hKeys($hashName);
    }

    public function hash_hVals($hashName){
        return $this->getRedisByKey($hashName)->hash_hVals($hashName);
    }

    public function hash_hGetAll($hashName){
        return $this->getRedisByKey($hashName)->hash_hGetAll($hashName);
    }

    public function hash_hExists($hashName,$key){
        return $this->getRedisByKey($hashName)->hash_hExists($hashName,$key);
    }

    public function hash_hMset($hashName,$values){
        $this->getRedisByKey($hashName)->hash_hMset($hashName,$values);
    }

    public function hash_hMGet($hashName,$keys){
        return $this->getRedisByKey($hashName)->hash_hMGet($hashName,$keys);
    }

    /**
     * 缓存对象
     * */
    public function str_putObject($key,$object,$expire=604800){
        $this->str_Set($key, json_encode($object),$expire);
    }
    /**
     * 获取对象
     * */
    public function str_getObject($key,$class=null,$toArray=false){
        $data = $this->str_Get($key);
        if ($data == null) {
            return null;
        }
        if($class == null){
            return json_decode($data,$toArray);
        }else{
            $data = json_decode($data);
            /* @var $object BaseVO */
            $object = new $class();
            $object->parse($data);
            return $object;
        }
    }

    /**
     * 缓存对象
     * */
    public function hash_putObject($hashName,$key,$value,$expire=604800){
        $this->hash_hSet($hashName, $key, json_encode($value),$expire);
    }

    /**
     * 获取对象
     * */
    public function hash_getObject($hashName,$key,$class=null,$toArray=false){
        $data = $this->hash_hGet($hashName, $key);
        if($data == null){
            return null;
        }
        if($class == null){
            return json_decode($data,$toArray);
        }else{
            $data = json_decode($data);
            /* @var $object BaseVO */
            $object = new $class();
            $object->parse($data);
            return $object;
        }
    }

    /**
     * 获取hashmap中所有的值，并且把值转换为对象
     * */
    public function hash_getAllObjecy($hashName,$class=null,$toArray=false){
        $array = $this->hash_hGetAll($hashName);
        if($array == null){
            return null;
        }
        foreach ($array as $key => $value) {
            if($class == null){
                $array[$key] = json_decode($value,$toArray);
            }else{
                $data = json_decode($value);
                /* @var $object BaseVO */
                $object = new $class();
                $object->parse($data);
                $array[$key] = $object;
            }

        }
        return $array;
    }


    public function sortedSet_zAdd($key,$score,$value){
        $this->getRedisByKey($key)->sortedSet_zAdd($key,$score,$value);
    }

    public function sortedSet_zRem($key,$value){
        $this->getRedisByKey($key)->sortedSet_zRem($key,$value);
    }

    public function sortedSet_zRemRangeByScore($key,$start,$end){
        $this->getRedisByKey($key)->sortedSet_zRemRangeByScore($key,$start,$end);
    }

    /** 获取集内部数据的总条数 */
    public function sortedSet_zCard($key){
        return $this->getRedisByKey($key)->sortedSet_zCard($key);
    }
    /** 根据分数区间 获取集内部数据的总条数 */
    public function sortedSet_zCount($key,$start,$end){
        return $this->getRedisByKey($key)->sortedSet_zCount($key,$start,$end);
    }

    /** 为某个值 增加/减少 分数 */
    public function sortedSet_zIncrby($key,$score,$value){
        $this->getRedisByKey($key)->sortedSet_zIncrby($key,$score,$value);
    }
    /**
     *
     * @param $params 可选 WITHSCORES 键值对
     */
    public function sortedSet_zRange($key,$start,$end,$params = null){
        return $this->getRedisByKey($key)->sortedSet_zRange($key,$start,$end,$params);
    }

    public function sortedSet_zRevRange($key,$start,$end, $params = null){
        return $this->getRedisByKey($key)->sortedSet_zRevRange($key,$start,$end, $params);
    }

    public function sortedSet_zRangeByScore($key,$start,$end,$params = array()){
        return $this->getRedisByKey($key)->sortedSet_zRangeByScore($key,$start,$end,$params);
    }

    public function sortedSet_zRevRangeByScore($key,$start,$end,$params = array()){
        return $this->getRedisByKey($key)->sortedSet_zRevRangeByScore($key,$start,$end,$params);
    }

    public function sortedSet_zRank($key,$value){
        return $this->getRedisByKey($key)->sortedSet_zRank($key,$value);
    }

    public function sortedSet_zRevRank($key,$value){
        return $this->getRedisByKey($key)->sortedSet_zRevRank($key,$value);
    }

    public function sortedSet_zScore($key,$value){
        return $this->getRedisByKey($key)->sortedSet_zScore($key,$value);
    }

    public function keys($pattern){
        $keys = array();
        foreach(RedisShardProxyConfig::$configs as $index => $conf){
            $keys = array_merge($keys,$this->getRedis($conf)->keys($pattern));
        }
        return $keys;
    }

    /**
     * 删除缓存
     * */
    public function del($key){
        $this->getRedisByKey($key)->del($key);
    }

    /**
     * 获取KEY剩余生存时间
     */
    public function ttl($key) {
        return $this->getRedisByKey($key)->ttl($key);
    }

    /**
     * 返回 key 所储存的值的类型。
     *
     * none(key不存在) int(0)
    string(字符串) int(1)
    list(列表) int(3)
    set(集合) int(2)
    zset(有序集) int(4)
    hash(哈希表) int(5)
     */
    public function type($key) {
        return $this->getRedisByKey($key)->type($key);
    }

    /**
     * 计数器 - 自增
     * */
    public function incr($key,$value = 1,$expire = 604800){
        return $this->getRedisByKey($key)->incr($key,$value,$expire);
    }

    /**
     * 自减
     */
    public function decr($key,$value = 1,$expire = 604800){
        return $this->getRedisByKey($key)->decr($key,$value,$expire);
    }

    /**
     * 一次获取多个key的值
     * */
    public function mget($keys){
        if(count($keys) == 0) return array();

        $redisMap = array();
        $keysMap = array();

        foreach($keys as $index => $key){
            $keyIndex = $this->getKeyIndex($key);
            $redisMap[$keyIndex] = $this->getRedisByIndex($keyIndex);
            $keysArr = (isset($keysMap[$keyIndex])) ? $keysMap[$keyIndex] : array();
            array_push($keysArr,$key);
            $keysMap[$keyIndex] = $keysArr;
        }

        $values = array();
        /* @var $redis RedisUtil */
        foreach($redisMap as $index => $redis){
            $values = array_merge($values,$redis->mget($keysMap[$index]));
        }

        return $values;
    }

    /**
     * 取多个key的值
     * @param $keys
     * @return array
     */
    public function getMultiple($keys){
        $redisMap = array();
        $keysMap = array();

        foreach($keys as $index => $key){
            $keyIndex = $this->getKeyIndex($key);
            $redisMap[$keyIndex] = $this->getRedisByIndex($keyIndex);
            $keysArr = (isset($keysMap[$keyIndex])) ? $keysMap[$keyIndex] : array();
            array_push($keysArr,$key);
            $keysMap[$keyIndex] = $keysArr;
        }

        $values = array();
        /* @var $redis RedisUtil */
        foreach($redisMap as $index => $redis){
            $values = array_merge($values,$redis->getMultiple($keysMap[$index]));
        }

        return $values;
    }





}