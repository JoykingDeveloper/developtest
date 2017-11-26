<?php

/**
 * 依赖 mcrypt扩展
 *
 * Created by PhpStorm.
 * User: zmliu1
 * Date: 15/9/1
 * Time: 10:51
 */
class AES{
    /**
     * 算法,另外还有192和256两种长度
     */
    const CIPHER = MCRYPT_RIJNDAEL_128;
    /**
     * 模式
     */
    const MODE = MCRYPT_MODE_ECB;

    public static $key = "rz>xkiG*ebZOv$}nw8{=,#uj9K`FM&'6";

    /**
     * 加密
     * @param string $key   密钥
     * @param string $str   需加密的字符串
     * @return mixed
     */
    public static function encode($str,$base64 = true){
        return $str;
//        $iv = mcrypt_create_iv(mcrypt_get_iv_size(self::CIPHER,self::MODE),MCRYPT_RAND);
//        $value = mcrypt_encrypt(self::CIPHER, self::$key, $str, self::MODE, $iv);
//        if($base64) $value = base64_encode($value);
//        return $value;
    }

    /**
     * 解密
     * @param $key string
     * @param $str string
     * @return mixed
     */
    public static function decode($str,$base64 = true){
        return $str;
//        if($base64) $str = base64_decode($str);
//        $iv = mcrypt_create_iv(mcrypt_get_iv_size(self::CIPHER,self::MODE),MCRYPT_RAND);
//        return trim(mcrypt_decrypt(self::CIPHER, self::$key, $str, self::MODE, $iv));
    }
}