<?php
    /**
     * memcached操作类
     */
    class MemcachedUtil {

		private $cached = null;

		function __construct($host,$port){
			$this->cached = new Memcache;
			$this->cached->connect($host, $port);
		}

		public function set($key,$value,$expire=604800){
			$this->cached->set($key,$value,0,$expire);
		}

		public function get($key){
			$reslut = $this->cached->get($key);
			if($reslut == null || $reslut == '' || $reslut == 'null'){
				return null;
			}
			return $reslut;
		}

		/**
		 * 缓存对象(php数组对象)
		 * */
		public function putObject($key,$object,$expire=604800){
			$this->cached->set($key,json_encode($object),$expire);
		}

		/**
		 * 获取对象
		 * */
		public function getObject($key,$class=null,$toArray=false){
			$json = $this->get($key);
			if ($json == null) {
				return null;
			}

            if($class == null){
                return json_decode($json,$toArray);
            }else{
                $data = json_decode($json);
                $object = new $class();
                $object->parse($data);
                return $object;
            }
		}


		//删除缓存
		public function del($key){
			$this->cached->delete($key);
		}

    }
?>