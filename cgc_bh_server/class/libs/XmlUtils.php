<?php

/**
 *
 * xml工具
 *
 * User: zmliu1
 * Date: 17/2/6
 * Time: 14:28
 */
class XmlUtils{

    /**
     * 根据数组生成xml字符串
     * @return string
     */
    public static function createXmlStringByArray($array){
        $xml = "<xml>";
        foreach($array as $key => $val){
            $xml .= "<$key>";
            if(is_array($val) || is_object($val)){
                $xml .= "<![CDATA[";
                $xml .= json_encode($val);
                $xml .= "]]>";
            }else{
                $xml .= $val;
            }
            $xml .= "</$key>";
        }
        $xml .= "</xml>";
        return $xml;
    }

    /**
     * 根据xml字符串生成数组
     */
    public static function createArrayByXmlString($xmlStr){
        $xml = simplexml_load_string($xmlStr,'SimpleXMLElement',LIBXML_NOCDATA);
        return json_decode(json_encode($xml),true);
    }

}