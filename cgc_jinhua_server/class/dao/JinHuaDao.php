<?php

/**
 * Created by PhpStorm.
 * User: zmliu1
 * Date: 17/1/10
 * Time: 17:18
 */
class JinHuaDao extends BaseDao{

    /**
     * 更新游戏信息
     * @param $game vo_JinHuaGame
     */
    public static function updateGame($game){
        self::getRedis()->str_putObject("jinhuaGame:" . $game->id,$game);
    }

    /**
     * 获取房间
     * @param $id
     * @return vo_JinHuaGame
     */
    public static function getGame($id){
        return self::getRedis()->str_getObject("jinhuaGame:" . $id,'vo_JinHuaGame');
    }

    public static function delGame($id){
        self::getRedis()->del("jinhuaGame:" . $id);
    }

}