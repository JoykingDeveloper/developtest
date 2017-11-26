<?php

class CheatDao extends BaseDao{
    /**
     * 更新作弊数据
     * @param $cheat vo_Cheat
     */
    public static function updateCheat($cheat, $type = null){
        $type = $type == null ? '' : trim($type); //操作标识
        self::getRedis()->str_putObject("cheat:" . $cheat->uid . $type, $cheat);
    }
    
    /**
     * 获取作弊数据
     * @return vo_Cheat
     */
    public static function getCheat($uid, $type = null){
        $type = $type == null ? '' : trim($type); //操作标识
        return self::getRedis()->str_getObject("cheat:" . $uid . $type,'vo_Cheat');
    }
    
    /**
     * 删除作弊数据
     */
    public static function delCheat($uid, $type = null){
        $type = $type == null ? '' : trim($type); //操作标识
        self::getRedis()->del("cheat:" . $uid . $type);
    }

}