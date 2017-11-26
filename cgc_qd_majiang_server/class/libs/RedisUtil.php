<?php
    /**
     *
     */
    class RedisUtil {

        public $redis;
        
        public $isConnect;

        function __construct(){
            $this->redis = new Redis();
        }

        /**
         * 连接redis
         * @param   $host
         * @param   $port
         * */
        public function connect($host,$port,$persistant=false){
            if($persistant){
                $this->isConnect = $this->redis->pconnect($host,$port);
            }else{
                $this->isConnect = $this->redis->connect($host,$port);
            }
        }
		
		/**
		 * 授权
		 * */
		public function auth($pwd){
			$this->redis->auth($pwd);
		}

        /**
         * 选择数据库
         * @param   $dbIndex
         * */
        public function select($dbIndex){
            $this->redis->select($dbIndex);
        }

        /**
         * 清空当前选择库
         * */
        public function flushDB(){
            $this->redis->flushDB();
        }

        /**
         * 清空所有库
         * */
        public function flushAll(){
            $this->redis->flushAll();
        }

        /**
         * 随机返回key空间的一个key
         * */
        public function randomKey(){
            return $this->redis->randomKey();
        }

        /**
         * 设定过期事件
         * @param  string   $key    需要设置过期时间的key
         * @param  int      $expire 过期时间(秒)
         * */
        public function setTimeout($key,$expire){
            $this->redis->setTimeout($key,$expire);
        }

        /**
         * 判断某个key是否存在
         * */
        public function exists($key){
            return $this->redis->exists($key);
        }

        /**
         * 添加字符串串
         * */
        public function str_Set($key,$values,$timeout=604800){
            if($timeout < 0){
                $this->redis->set($key,$values);
            }else{
                $this->redis->setex($key,$timeout,$values);
            }
        }

        /**
         * 删除字符串
         * */
        public function str_delete($key){
            $this->redis->del($key);
        }
		
		/*
		 * 删除字符串2
		 */
		public function delStr($key){
			 $this->redis->del($key);
		}

        /**
         * 获取字符串
         * */
        public function str_Get($key){
            return $this->redis->get($key);
        }

        /**
         * 在list左边头添加元素
         * */
        public function list_lPush($key,$value){
            $this->redis->lPush($key,$value);
        }

        /**
         * 在list右边头添加元素
         * */
        public function list_rPush($key,$value){
            $this->redis->rPush($key,$value);
        }

        /**
         * 在list左边头删除元素，并且返回元素
         * */
        public function list_lPop($key){
            return $this->redis->lPop($key);
        }

        /**
         * 在list右边头删除元素，并且返回元素
         * */
        public function list_rPop($key){
            return $this->redis->rPop($key);
        }

        /**
         * 获取list长度
         * */
        public function list_lSize($key){
            return $this->redis->lLen($key);
        }

        /**
         *  设置指定位置的值
         * */
        public function list_lSet($key,$index,$value){
            $this->redis->lSet($key,$index,$value);
        }

        /**
         * 获取指定位置的值
         * */
        public function list_lGet($key,$index){
            return $this->redis->lIndex($key,$index);
        }

        /**
         * 截取list
         * */
        public function list_lTrim($key,$start,$end){
            $this->redis->lTrim($key,$start,$end);
        }

        public function list_lRem($key,$value,$count){
            return $this->redis->lRem($key,$value,$count);
        }

        public function list_lRange($key,$start,$end){
            return $this->redis->lRange($key,$start,$end);
        }
		
		public function list_lIndex($key, $value){
			return $this->redis->lIndex($key, $value);
		}


        public function hash_hSet($hashName,$key,$value,$expire=604800){
            $this->redis->hSet($hashName,$key,$value);
            if($expire > 0){
                $this->setTimeout($hashName, $expire);
            }
        }

        public function hash_hGet($hashName,$key){
            return $this->redis->hGet($hashName,$key);
        }

        public function hash_hLen($hashName){
            return $this->redis->hLen($hashName);
        }

        public function hash_hDel($hashName,$key){
            $this->redis->hDel($hashName,$key);
        }

        public function hash_hKeys($hashName){
            return $this->redis->hKeys($hashName);
        }

        public function hash_hVals($hashName){
            return $this->redis->hVals($hashName);
        }

        public function hash_hGetAll($hashName){
        	$array = $this->redis->hGetAll($hashName);
            return $array;
        }

        public function hash_hExists($hashName,$key){
            return $this->redis->hExists($hashName,$key);
        }

        public function hash_hMset($hashName,$values){
            $this->redis->hMset($hashName,$values);
        }

        public function hash_hMGet($hashName,$keys){
            foreach($keys as $index => $value){
                $keys[$index] = (string)$value;
            }
            return $this->redis->hmGet($hashName,$keys);
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
            $this->redis->ZADD($key,$score,$value);
        }
        
        public function sortedSet_zRem($key,$value){
            $this->redis->ZREM($key,$value);
        }

        public function sortedSet_zRemRangeByScore($key,$start,$end){
            $this->redis->zRemRangeByScore($key,$start,$end);
        }
        
        /** 获取集内部数据的总条数 */
        public function sortedSet_zCard($key){
            return $this->redis->ZCARD($key);
        }
        /** 根据分数区间 获取集内部数据的总条数 */
        public function sortedSet_zCount($key,$start,$end){
            return $this->redis->ZCOUNT($key,$start,$end);
        }
        
        /** 为某个值 增加/减少 分数 */
        public function sortedSet_zIncrby($key,$score,$value){
            $this->redis->ZINCRBY($key,$score,$value);
        }
        /**
		 * 
		 * @param $params 可选 WITHSCORES 键值对 
		 */
        public function sortedSet_zRange($key,$start,$end,$params = null){
            return $this->redis->ZRANGE($key,$start,$end,$params);
        }
        
        public function sortedSet_zRevRange($key,$start,$end, $params = null){
            return $this->redis->ZREVRANGE($key,$start,$end, $params);
        }
        
        public function sortedSet_zRangeByScore($key,$start,$end,$params = array()){
            return $this->redis->ZRANGEBYSCORE($key,$start,$end,$params);
        }
        
        public function sortedSet_zRevRangeByScore($key,$start,$end,$params = array()){
            return $this->redis->ZREVRANGEBYSCORE($key,$start,$end,$params);
        }
        
        public function sortedSet_zRank($key,$value){
            return $this->redis->ZRANK($key,$value);
        }
        
        public function sortedSet_zRevRank($key,$value){
            return $this->redis->ZREVRANK($key,$value);
        }
        
        public function sortedSet_zScore($key,$value){
            return $this->redis->ZSCORE($key,$value);
        }
		
		public function keys($pattern){
			return $this->redis->keys($pattern);
		}

        /**
         * 删除缓存
         * */
        public function del($key){
            // $this->str_delete($key);
            $this->redis->del($key);
        }
        
        public function close(){
            $this->redis->close();
        }
        
        /**
         * 获取KEY剩余生存时间
         */
        public function ttl($key) {
            return $this -> redis -> ttl($key);
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
            return $this -> redis -> type($key);
        }
		
		/**
		 * 计数器 - 自增
		 * */
		public function incr($key,$value = 1,$expire = 604800){
			$newValue = $this->redis->incrBy($key,$value);
			if($expire > 0){
				$this->setTimeout($key, $expire);
			}
			return $newValue;
		}
		
		/**
		 * 自减
		 */
		public function decr($key,$value = 1,$expire = 604800){
			$newValue = $this->redis->decrBy($key, $value);
			if($expire > 0){
				$this->setTimeout($key, $expire);
			}
            return $newValue;
		}
		
		/**
		 * 一次获取多个key的值
		 * */
		public function mget($keys){
			return $this->redis->mget($keys);
		}

        /**
         * 取多个key的值
         * @param $keys
         * @return array
         */
        public function getMultiple($keys){
            return $this->redis->getMultiple($keys);
        }

        /**
         * @return string
         */
        public function getLastError(){
            return $this->redis->getLastError();
        }
        














    }

?>