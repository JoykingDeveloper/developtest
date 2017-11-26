<?php
    /**
     * 数组工具类
     */
    class ArrayUtil {
        /**
         * 根据key的值排序,从大到小
         * @param   $array array  需要排序的数组
         * @param   $$key string   用什么排序
         * @param   $desc bool   是否倒序
         * @param   $valueIsObject bool  数组值是否是对象
         * */
        public static function sortOn($array,$key,$desc=true,$valueIsObject=false){
            $len = count($array);
            for($i=1;$i<$len;$i++){
                for($j=$len-1;$j>=$i;$j--){
                    $a = 0;
                    $b = 0;
                    if($valueIsObject){
                        $a = $array[$j]->$key;
                        $b = $array[$j-1]->$key;
                    }else{
                        $a = $array[$j][$key];
                        $b = $array[$j-1][$key];
                    }
                    if($desc){
                        if($a > $b) {
                            $temp = $array[$j];
                            $array[$j] = $array[$j-1];
                            $array[$j-1] = $temp;
                        }
                    }else if($a < $b){
                        $temp = $array[$j];
                        $array[$j] = $array[$j-1];
                        $array[$j-1] = $temp;
                    }
                }
            }

            return $array;
        }

        /**
         * 把对象转成数组
         */
        public static function objectToArray($object){
            $result = array();
            $object = is_object($object) ? get_object_vars($object) : $object;
            foreach ($object as $key => $val) {
                $val = (is_object($val) || is_array($val)) ? self::objectToArray($val) : $val;
                $result[$key] = $val;
            }
            return $result;
        }

        /**
         * 从数组中查询出 需要的字段 并返回一个新数组
         * */
        public static function serachFields($array,$needFields){
        	if($array == null){
        		return array();
        	}
            $new_array = array();
            foreach ($array as $key => $value) {
                if(array_search($key, $needFields) === false){
                    continue;
                }
                $new_array[$key] = $value;
            }
            return $new_array;
        }


        /**
         * 是否包含某个值
         * @param array $array
         * @param $value
         * @return bool
         */
        public static function contains($array,$value){
            if(array_search($value,$array) === false)
                return false;
            return true;
        }

        /**
         * 删除某个值(适用于 普通数据[1,2,3,4])
         * @param $array
         * @param $value
         */
        public static function removeValue($array,$value){
            $index = array_search($value,$array);
            if($index === false) return $array;
            array_splice($array, $index, 1);
            return $array;
        }



    }

?>