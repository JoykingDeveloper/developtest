<?php

/**
 *
 * 角色信息
 *
 * User: zmliu1
 * Date: 17/1/10
 * Time: 09:46
 */
class vo_Role extends BaseVO{
    /** 角色uid */
    public $uid;
    /** 注册时间*/
    public $gettime;
    /** 角色名 */
    public $name;
    /** 头像地址 */
    public $head;
    /** 房卡数量 */
    public $card = 5;
    /** 金币 */
    public $gold = 100;
    /** 是否是代理 */
    public $proxy = 0;
    /** 推荐人 */
    public $recommend;

}