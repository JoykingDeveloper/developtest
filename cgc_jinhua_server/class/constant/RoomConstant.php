<?php

/**
 *
 * 房间constant
 *
 * User: zmliu1
 * Date: 17/1/10
 * Time: 14:39
 */
class RoomConstant{

    /**
     * 向房间中的玩家推送消息
     * @param $senderUid
     * @param $data
     * @param $room vo_Room
     */
    public static function pushMsgToRoom($senderUid,$data,$room,$pushToSender = false){
        $players = $room->players;
        $senders = array();
        foreach($players as $index => $uid){
            $senderInfo = PlatformDao::getSender($uid);
            if($uid == $senderUid) {
                if($pushToSender) array_push($senders,$senderInfo);
            } else{
                array_push($senders,$senderInfo);
            }
        }
        ExtGameHelper::senderMessage($senders,$data);
    }

    /**
     * 获取第一个玩家
     * @param $room vo_Room
     * @return string
     */
    public static function getFirstPlayer($room){
        $players = $room->players;
        for($i = 1; $i <= $room->max_player; $i++){
            if(!isset($players[$i])) continue;
            return $players[$i];
        }
        return null;
    }

    /**
     * 获取下一个玩家
     * @param $room vo_Room
     * @param $game vo_JinHuaGame
     * @return string
     */
    public static function getNextPlayer($uid,$room,$game){
        $players = $room->players;
        $readys = $game->ready;
        $giveups = $game->giveup;
        $index = 1;
        foreach($players as $key => $player_id){
            if($player_id == $uid){
                $index = $key;
                break;
            }
        }
        $index += 1;
        if($index > $room->max_player){
            $index = 1;
        }
        for($i = $index; $i <= $room->max_player; $i++){
            if(isset($players[$i]) && isset($readys[$players[$i]]) && !isset($giveups[$players[$i]])) return $players[$i];
        }
        for($i = 1; $i <= $room->max_player; $i++){
            if(isset($players[$i]) && isset($readys[$players[$i]]) && !isset($giveups[$players[$i]])) return $players[$i];
        }
        return null;
    }

}