<?php

/**
 *
 * 房间信息
 *
 * User: zmliu1
 * Date: 17/1/10
 * Time: 14:30
 */
class vo_Room extends BaseVO{
    /** 房间id */
    public $id;
    /** 房间成员列表 */
    public $players;
    /** 房主 */
    public $owner;
    /** 最大玩家数量 */
    public $max_player;
    /** 房间里面的附加信息 */
    public $data;
}