<?php

/**
 *
 * 提供给小游戏的一些方法
 *
 * User: zmliu1
 * Date: 17/2/16
 * Time: 09:00
 */
class ExtGameHelper{

    const platFormPath = "http://192.168.1.188:7501";

    /**
     * 向玩家推送消息
     * @param $senders array 玩家列表
     * @param $data
     */
    public static function senderMessage($senders,$data){
        $data['cmd'] = 'gameMessage';
        $forwards = array();
        foreach($senders as $index => $sender){
            $fd = $sender[1];
            $svrid = $sender[2];
            $fds = null;
            if(isset($forwards[$svrid])){
                $fds = $forwards[$svrid];
                array_push($fds,$fd);
            }else{
                $fds = array();
                array_push($fds,$fd);
            }
            $forwards[$svrid] = $fds;
        }
        if(count($forwards) > 0) SwProxyInstance::forwardData($forwards,$data);
    }

    /**
     * 向平台发送 游戏创建成功
     */
    public static function sendGameCreate($room_id){
        Requests::register_autoloader();
        $params = array('c'=>'gameCreate','room_id'=>$room_id);
        Requests::post(self::platFormPath,array(),$params);
    }

    /**
     * 向平台发送 游戏开始的消息
     */
    public static function sendGameStart($room_id){
        Requests::register_autoloader();
        $params = array('c'=>'gameStart','room_id'=>$room_id);
        Requests::post(self::platFormPath,array(),$params);
    }

    /**
     * 向平台发送 游戏解散的消息
     */
    public static function sendGameOver($room_id){
        Requests::register_autoloader();
        $params = array('c'=>'gameOver','room_id'=>$room_id);
        Requests::post(self::platFormPath,array(),$params);
    }

    /**
     * 向平台发送 消耗房卡,一般在第一轮游戏完成之后就调用
     */
    public static function sendUseCard($room_id){
        Requests::register_autoloader();
        $params = array('c'=>'useCard','room_id'=>$room_id);
        Requests::post(self::platFormPath,array(),$params);
    }

    /**
     * 保存战绩
     */
    public static function logScore($room_id,$data){
        Requests::register_autoloader();
        $params = array('c'=>'logScore','room_id'=>$room_id,'data'=>$data);
        Requests::post(self::platFormPath,array(),$params);
    }


}