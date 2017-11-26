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
     * 根据玩家UID向房间中的玩家推送卡牌消息
     * @param $senderUid
     * @param $game vo_BaoHuangGame
     * @param $room vo_Room
     */
    public static function pushMsgToRoomByUid($senderUid,$pushMsg,$room,$game,$pushToSender = false){
        $players = $room->players;
        foreach($players as $index => $uid){
            $senders = array();
            $senderInfo = PlatformDao::getSender($uid);
            if($uid == $senderUid) {
                if($pushToSender) array_push($senders,$senderInfo);
            } else{
                array_push($senders,$senderInfo);
            }
            //获取每个玩家不同的卡牌信息
            $pushMsg['cardsInfo'] = array();
            if(isset($game->cards[$uid])){
                $pushMsg['cardsInfo'][$uid] = $game->cards[$uid];
                foreach($game->cards as $uid1 => $card){
                    if($uid1 != $uid ){
                        $pushMsg['cardsInfo'][$uid1] = count($game->cards[$uid1]);
                    }
                }
            }
            ExtGameHelper::senderMessage($senders,$pushMsg);
        }
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
     * @param $game vo_BaoHuangGame
     * @return string
     */
    public static function getNextPlayer($uid,$room,$game){
        $players = $room->players;
        $readys = $game->ready;
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
            if(isset($players[$i]) && isset($readys[$players[$i]]) ) return $players[$i];
        }
        for($i = 1; $i <= $room->max_player; $i++){
            if(isset($players[$i]) && isset($readys[$players[$i]]) ) return $players[$i];
        }
        return null;
    }

    /**
     * 获取上一个玩家
     * @param $room vo_Room
     * @param $game vo_BaoHuangGame
     * @return string
     */
    public static function getPerPlayer($uid,$room,$game){
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
        $index -= 1;
        if($index < 1){
            $index = $room->max_player;
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