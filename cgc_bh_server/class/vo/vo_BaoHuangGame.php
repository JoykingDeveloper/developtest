<?php

class vo_BaoHuangGame extends BaseVO{
    /** 游戏id */
    public $id;
    /** 当前阶段 */
    public $currentState = 0; //0:未开始;1:造反;2:正常登基;3:出牌阶段
    /** 当前操作者 */
    public $currentUid;
    /** 上一个出牌者UID */
    public $perUid;
    /** 皇帝 */
    public $emperorUid;
    /** 是否抢独 */
    public $isQiangDu;
    /** 侍卫 */
    public $guardUid;
    /** 是否明保 */
    public $isMingBao;
    /** 明保倍数 */
    public $times;
    /** 走掉的顺序 */
    public $endQueues;
    /** 当前的准备信息 */
    public $ready = array();
    /**造反情况*/
    public $zaofan = array();
    /** 当前玩家的金币信息 */
    public $money = array();
    /** 每个人的卡牌信息 */
    public $cards;
    /** 当前的出牌信息 */
    public $outCards;
    /** 最大局数 */
    public $maxCount;
    /** 当前局数 */
    public $currentCount;
    /** 当局起始Uid */
    public $firstUid;
    /** 需要的房卡数量 */
    public $needRoomCard;

}








