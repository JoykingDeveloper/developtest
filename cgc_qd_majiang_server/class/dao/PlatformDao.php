<?php

/**
 *
 * 角色临时信息保存 dao
 *
 * User: zmliu1
 * Date: 17/2/14
 * Time: 10:22
 */
class PlatformDao extends BaseDao{

    /**
     * 保存发送者的信息
     */
    public static function saveSender($uid,$sender){
        self::getRedis()->str_putObject("r:sender:$uid",$sender);
    }

    /**
     * 获取玩家的 基本信息
     */
    public static function getSender($uid){
        return self::getRedis()->str_getObject("r:sender:$uid",null,true);
    }

    /**
     * 删除玩家的 基本信息
     */
    public static function delSender($uid){
        self::getRedis()->del("r:sender:$uid");
    }

    /**
     * 保存发送者的角色信息
     * @param role vo_Role
     */
    public static function saveRole($role){
        self::getRedis()->str_putObject("r:role:" . $role->uid,$role);
    }

    /**
     * 获取玩家的角色信息
     * @return vo_Role
     */
    public static function getRole($uid){
        return self::getRedis()->str_getObject("r:role:$uid");
    }

    /**
     * 删除玩家的角色信息
     */
    public static function delRole($uid){
        self::getRedis()->del("r:role:$uid");
    }

    /**
     * 保存房间信息
     * @param $room vo_Room
     */
    public static function saveRoom($room){
        self::getRedis()->str_putObject("room:" . $room->id,$room);
    }

    /**
     * 获取房间信息
     */
    public static function getRoom($room_id){
        return self::getRedis()->str_getObject("room:$room_id",'vo_Room');
    }

    /**
     * 删除玩家的角色信息
     */
    public static function delRoom($room_id){
        self::getRedis()->del("room:$room_id");
    }



}