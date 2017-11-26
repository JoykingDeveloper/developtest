<?php
    /**
     * 脏词过滤
     */
    class WordFilter {

		/* @var array */
		private static $keyWords = null;
        
		/**
		 * 加载脏词
		 * @param	脏词文件
		 * */
		public static function loadKeyWords(){
			if(self::$keyWords != null) return self::$keyWords;
			$path = __DIR__ . "/vocabulary.txt";

			$file_handle = fopen($path, "r");
			$keyWords = array();
	        while (!feof($file_handle)) {
	            $line = explode('    ', trim(fgets($file_handle)));
				if($line[0] == 3){
					array_push($keyWords,$line[1]);
				}
	        }
	        fclose($file_handle);

			self::$keyWords = $keyWords;

	        return $keyWords;
		}
		
		/**
		 * 过滤脏词
		 * @param	$string	需要过滤的字符串
		 * @param	$replaceStr	脏词被替换为什么字符
		 * */
		public static function filter($string,$replaceStr = "*"){
			$keyWords = self::loadKeyWords();
			return strtr($string, array_combine($keyWords, array_fill(0,count($keyWords), $replaceStr)));
		}
		
		
		/**
		 * 是否含有脏词
		 * @param	$string	需要查询的字符串
		 * @param	$keyWords	脏词集合 ------------ array('fuck','cao')
		 * */
		public static function hasBadWords($string){
			$keyWords = self::loadKeyWords();
			$count = count($keyWords);
			$info = null;
			for ($i=0; $i < $count; $i++) { 
				$content = substr_count($string, $keyWords[$i]);
			    if($content > 0){
			        $info = $content;
			        break;
			     }
			}
			if($info > 0){
			   return true;
			}else{
			   return false;
			}
		}
        
    }
    
?>