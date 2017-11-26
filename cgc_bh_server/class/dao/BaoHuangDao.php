<?php


class BaoHuangDao extends BaseDao{

    /**
     * 更新游戏信息
     * @param $game vo_BaoHuangGame
     */
    public static function updateGame($game){
        self::getRedis()->str_putObject("baohuangGame:" . $game->id,$game);
    }

    /**
     * 获取房间
     * @param $id
     * @return vo_BaoHuangGame
     */
    public static function getGame($id){
        return self::getRedis()->str_getObject("baohuangGame:" . $id,'vo_BaoHuangGame');
    }

    public static function delGame($id){
        self::getRedis()->del("baohuangGame:" . $id);
    }

}