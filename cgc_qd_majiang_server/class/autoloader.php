<?php	if (!defined('BASEPATH')) exit('404');
    /**
     * 自动加载
     */
    class autoloader {
        public static $includeFiles = array();

		public static $loader;

        private static $directory;

		private static $loaderDirectorys;

		public static function init(){
	        if (self::$loader == null){
	            self::$directory = __DIR__ . "/";

	            self::$loader = new self();
	        }

	        return self::$loader;
	    }

        function __construct() {
			self::$loaderDirectorys = $this->getAllDir(self::$directory,array());
			spl_autoload_register(array($this,'loader'));
        }

		public function loader($class){
			foreach(self::$loaderDirectorys as $dic){
				if($this->load($dic,$class)) break;
			}
		}

		public function load($key,$class){
			$path = "$key/$class.php";
		    if(!isset(self::$includeFiles[$class])){
		        if(file_exists($path)){
		            self::$includeFiles[$class] = 1;
                    include_once $path;
					return true;
                }
				return false;
		    }
			return true;
		}

		public function getAllDir($path,$pathArray){
			$files = scandir($path);
			foreach($files as $index => $file){
				if($file == '.' || $file == '..') continue;
				$p = $path . $file;
				if(is_dir($p)){
					array_push($pathArray,$p);
					$pathArray = $this->getAllDir($p . '/',$pathArray);
				}
			}
			return $pathArray;
		}

    }

?>