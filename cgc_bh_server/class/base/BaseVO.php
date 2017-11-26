<?php
    class BaseVO {

        /**
         * 获取查询字段
         * */
        public function selectClos(){
            $clos = '';
            foreach ($this as $key => $value) {
                $clos .= '`'.$key .'`,';
            }
            return substr($clos, 0, -1);
        }

        /**
         * 获取数据array(一般用于数据库 更新 或 插入)
         * @param   $needFields 需要的字段
         * */
        public function dataArray($needFields = null){
            $data = array();
            foreach ($this as $key => $value) {
                if($value === null) continue;
                if($needFields != null && array_search($key, $needFields) === false) continue;
                if(is_array($value) || is_object($value)){
                    $data[$key] = json_encode($value);
                }else{
                    $data[$key] = $value;
                }
            }
            return $data;
        }

        /**
         * 转换数据
         * */
		public function parse($data){
			$dataType = is_array($data);
			foreach ($this as $key => $value) {
			    $v = null;
				if($dataType){
				    if(isset($data[$key])){
				        $v = $data[$key];
				    }
				}else if(isset($data->$key)){
					$v = $data->$key;
				}
				if($v === null){
					continue;
				}

				if(is_string($v) && preg_match("/^[-]{0,1}\d{1,12}$/",$v)){
					$this->$key = (float)$v;
				}else if(is_string($v) && preg_match("/^[-]{0,1}\d{1,12}[.]\d{1,12}$/", $v)){
					$this->$key = (float)$v;
				}else if(is_string($v) && (StringUtil::startWith($v, '{') || StringUtil::startWith($v, '['))){
                    $this->$key = json_decode($v,true);
				}else if(is_object($v)){
					$this->$key = ArrayUtil::objectToArray($v);
				}else{
				    $this->$key = $v;
				}
			}
		}
		
		public static function getDataArray($datas,$needFields){
			$data = array();
            foreach ($datas as $key => $value) {
                if($value === null) continue;
                if($needFields != null && array_search($key, $needFields) === false) continue;
                if(is_array($value) || is_object($value)){
                    $data[$key] = json_encode($value);
                }else{
                    $data[$key] = $value;
                }
            }
            return $data;
		}

        public static function getDataArray2($datas,$needFields){
            $data = array();
            foreach ($datas as $key => $value) {
                if($value === null) continue;
                if($needFields != null && array_search($key, $needFields) === false) continue;
                $data[$key] = $value;
            }
            return $data;
        }
    }
?>