<?php   if (!defined('BASEPATH')) exit('404');
    class ApiConfig {

		public static $ExtGameRpcServiceName = "BaoHuangService";

		private $config = array();

		public function getApi($key){
			if(isset($this->config[$key])){
				$class = $this->config[$key];
				return new $class();
			}
			return null;
		}
    }
?>