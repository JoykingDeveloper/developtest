<?php
    /**
     * 
     */
    class DataPaser {
        
        public static function parse($data){
            foreach ($data as $key => $value) {
            if (is_string($value) && preg_match("/^[-]{0,1}\d{1,}$/", $value)) {
                $data[$key] = (int)$value;
            } else if (is_string($value) && preg_match("/^[-]{0,1}\d{1,}[.]\d{1,}$/", $value)) {
                $data[$key] = (float)$value;
            }else if(is_string($value) && (StringUtil::startWith($value, '{') || StringUtil::startWith($value, '['))){
                $data[$key] = json_decode($value,true);
            }else{
                //$data[$key] = mysql_escape_string($value);
            }
        }
        return $data;
        }
    }
    
?>