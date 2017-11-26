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

    public static function pushMsgToRoom1($senderUid,$data,$threeMj,$allMjList,$room,$pushToSender = false){
        $players = $room->players;
        foreach($players as $index => $uid){
            $senders = array();
            $senderInfo = PlatformDao::getSender($uid);
            if($uid == $senderUid) {
                if($pushToSender) array_push($senders,$senderInfo);
            } else{
                array_push($senders,$senderInfo);
            }
            $data['threeMj'] = $threeMj[$uid];
            $data['mjList'] = $allMjList[$uid];
            ExtGameHelper::senderMessage($senders,$data);
        }
    }




}