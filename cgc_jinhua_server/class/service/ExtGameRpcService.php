<?php

/**
 *
 * 游戏RPC接收器
 *
 * User: zmliu1
 * Date: 17/2/9
 * Time: 09:31
 */
class ExtGameRpcService{

    /** 发送消息的玩家UID */
    public $senderUid;
    /** 发送消息玩家的网络信息 */
    public $sender;
    /* @var vo_Role */
    public $senderRole;
    /** @var vo_Room */
    public $room;

    /**
     * 玩家登陆游戏服务器
     */
    public function loginGame($request){}

    /**
     * 玩家离线
     */
    public function leaveGame($request){}

    /**
     * 玩家投票 强制结束游戏
     */
    public function endGame($request){}

    /**
     * 玩家创建房间
     */
    public function createRoom($request){}

    /**
     * 玩家加入房间
     */
    public function joinRoom($request){}

    /**
     * 玩家离开房间
     */
    public function leaveRoom($request){}

    /**
     * 玩家解散房间
     */
    public function disbandRoom($request){}

    /**
     * 玩家像游戏房间发送消息
     */
    public function gameMessage($request){}


    //---------------------------以下为公用方法--------------------------------//

    /**
     * 检测参数
     * */
    public function checkParams($request,$params){
        $count = count($params);
        for ($i=0; $i < $count; $i++) {
            if(!isset($request[$params[$i]])){
                return false;
            }
        }
        return true;
    }

}