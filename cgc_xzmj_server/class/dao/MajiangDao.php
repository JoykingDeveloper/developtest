<?php

/**
 * Created by PhpStorm.
 * User: zmliu1
 * Date: 17/2/23
 * Time: 13:51
 */
class MajiangDao extends BaseDao{

    /**
     * 更新游戏数据
     * @param $mjGame   vo_MajiangGame
     */
    public static function updateMajiangGame($mjGame){
        self::getRedis()->str_putObject('mjGame:' . $mjGame->id,$mjGame);
    }

    /**
     * 获取游戏数据
     * @param $id
     * @return vo_MajiangGame
     */
    public static function getMajiangGame($id){
        return self::getRedis()->str_getObject("mjGame:$id",'vo_MajiangGame');
    }

    /**
     * 删除麻将游戏
     */
    public static function delMajiangGame($id){
        self::getRedis()->del("mjGame:$id");
    }

    /**
     * 更新玩家的麻将列表
     */
    public static function updatePlayerMajiang($uid,$list){
        self::getRedis()->str_putObject("mjList:$uid",$list);
    }

    /**
     * 获取玩家的麻将列表
     * @param $uid
     * @return array
     */
    public static function getPlayerMajiang($uid){
        return self::getRedis()->str_getObject("mjList:$uid",null,true);
    }
    /**
     * 更新换三张麻将
     */
    public static function updateThreeMj($list,$uid,$roomid){
        try{
            self::getRedis()->hash_putObject("threeMj:$roomid",$uid,$list);
        }catch (Exception $e){
            var_dump("换三张麻将缓存失败");
        }
    }
    /*
    *获取几个人选择了换三张牌
    */
    public static function getThreeChooseLength($roomid){
        return self::getRedis()->hash_hLen("threeMj:$roomid");
    }
    /*
    *判断是否已经选择了三张牌
    */
    public static function isChooseThreeMj($uid,$roomid){
        return self::getRedis()->hash_hExists("threeMj:$roomid",$uid);
    }
    /**
     * 获取换三张麻将
     */
    public static function getThreeMj($roomid){
        return self::getRedis()->hash_getAllObjecy("threeMj:$roomid",null,true);
    }
    public static function getThreeSelect($roomid){
        $list = self::getThreeMj($roomid);
        if($list){
            $keys = array_keys($list);
            foreach($keys as $index=>$key){
                $list[$key] = 1;
            }
        }
        return $list;
    }
    /**
     * 删除玩家麻将列表
     */
    public static function delPlayerMajiang($uid){
        self::getRedis()->del("mjList:$uid");
    }

    /**
     * 获取房间中所有人的麻将
     * @param $room vo_Room
     * @return array
     */
    public static function getRoomPlayerMajiangs($room){
        $players = $room->players;
        $majiangs = array();
        foreach($players as $index => $uid){
            $majiangs[$uid] = self::getPlayerMajiang($uid);
        }
        return $majiangs;
    }

    /**
     * 删除房间中玩家的麻将
     * @param $room vo_Room
     */
    public static function delPlayerMajiangByRoom($room){
        $players = $room->players;
        foreach($players as $index => $uid){
            self::delPlayerMajiang($uid);
            self::getRedis()->del("mjChiMsg:$uid");
        }
        $roomid = $room->id;
        self::getRedis()->del("threeMj:$roomid");
    }

    /**
     * 添加操作
     */
    public static function addOperating($game_id,$uid,$op){
        self::getRedis()->list_lPush("mjOperating:$game_id",json_encode(array($uid,$op)));
    }

    /**
     * 增加操作次数，用于防止并发
     * @param $game_id
     * @return int
     */
    public static function addOperatingCount($game_id){
        return self::getRedis()->incr("mjOperatingCount:$game_id");
    }

    /**
     * 获取操作
     */
    public static function getOperating($game_id){
        $vals = self::getRedis()->list_lRange("mjOperating:$game_id",0,-1);
        $reObj = array();
        foreach($vals as $index => $val){
            $val = json_decode($val,true);
            $reObj[$val[0]] = $val[1];
        }
        return $reObj;
    }

    /**
     * 获取操作
     */
    public static function clearOperating($game_id){
        self::getRedis()->del("mjOperating:$game_id");
        self::getRedis()->del("mjOperatingCount:$game_id");
    }

    /**
     * 临时保存一下玩家 用哪两张牌来吃牌
     */
    public static function savePlayerChiPaiMsg($uid,$mjs){
        self::getRedis()->str_putObject("mjChiMsg:$uid",$mjs);
    }

    /**
     * 获取玩家用那两张牌来吃牌
     */
    public static function getPlayerChiPaiMsg($uid){
        return self::getRedis()->str_getObject("mjChiMsg:$uid",null,true);
    }

}