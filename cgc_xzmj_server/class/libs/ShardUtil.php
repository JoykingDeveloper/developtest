<?php

	class ShardUtil{

		static public function getHashIndexMD5($uid, $num){
			$uid = md5($uid);
			return self::getByteHashIndex($uid, $num);
		}


		static private function getByteHashIndex($uid, $num){
			$len = strlen($uid);
			if($len<4){
				$hKey = ord(substr($uid, 0, 1));
			}else{
				//$bKey = self::getBytes($uid, 4);//下面计算只用4位，所以只取4位
				//$hKey = (($bKey[3]&0xFF) << 24) | (($bKey[2]&0xFF) << 16) | (($bKey[1]&0xFF) << 8) | ($bKey[0]&0xFF);
				$hKey = ((ord($uid[3])&0xFF) << 24) | ((ord($uid[2])&0xFF) << 16) | ((ord($uid[1])&0xFF) << 8) | (ord($uid[0])&0xFF);
			}
			return $hKey%$num;
		}

		/**返回字符串str的byte数组*/
		static private function getBytes($str, $strlen) {
	        $bytes = array();
	        for($i=0;$i<$strlen;$i++) {
			   if(ord($str[$i]) >= 128){
				   $bytes[] = ord($str[$i]) - 256;
			   }else{
				   $bytes[] = ord($str[$i]);
			   }
	        }
	        return $bytes;
	    }
	}

?>
