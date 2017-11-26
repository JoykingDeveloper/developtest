<?php

/**
 *
 * 签名工具
 *
 * User: zmliu1
 * Date: 17/2/6
 * Time: 13:50
 */
class SignUtils{

    public static function sign($data,$type,$signKey = '',$symbol = '&'){
        ksort($data);
        $string = "";
        $index = 0;
        foreach($data as $key => $val){
            if($index == 0){
                $string .= $key . "=" . $val;
            }else{
                $string .= $symbol . $key . "=" . $val;
            }
            $index++;
        }
        if($signKey != ''){
            $string .= $symbol . "key=$signKey";
        }
        $type = strtoupper($type);
        if($type == 'MD5'){
            return md5($string);
        }else if($type == 'SHA1'){
            return sha1($string);
        }
        return $string;
    }

}