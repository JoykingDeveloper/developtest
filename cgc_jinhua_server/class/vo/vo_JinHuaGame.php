<?php

/**
 *
 * 金花牌局的数据
 *
 * User: zmliu1
 * Date: 17/1/10
 * Time: 16:24
 */
class vo_JinHuaGame extends BaseVO{
    /** 游戏id */
    public $id;
    /** 游戏是否开始 */
    public $isStart = false;
    /** 当前操作者 */
    public $currentUid;
    /* 记录是否有人没有看过牌 */
    public $lastSee;
    /* 最后一次下注的类型 */
    public $lastMoneyType = 1;
    /* 最后一次下注钱 */
    public $lastMoney = 1;
    /** 这一盘所有的钱 */
    public $allMoney = 0;
    /** 每个人的卡牌信息 */
    public $cards;
    /** 当前的看牌信息 */
    public $see;
    /** 放弃信息 */
    public $giveup;
    /** 当前玩家的赌资信息 */
    public $money;
    /** 当前局玩家的赌资信息 */
    public $currentMoney;
    /** 当前的准备信息 */
    public $ready;
    /** 最后一把是谁赢了 */
    public $lastWin;
    /** 最大局数 */
    public $maxCount;
    /** 当前局数 */
    public $currentCount;
    /** 需要的房卡数量 */
    public $needRoomCard;
    /** 操作次数 需要每个人至少操作一次 才能开牌 */
    public $operateCount = 0;
}