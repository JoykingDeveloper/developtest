<?php

/**
 *
 * 金花牌局的数据
 *
 * User: zmliu1
 * Date: 17/1/10
 * Time: 16:24
 */
class vo_MajiangGame extends BaseVO{
    /** 游戏id */
    public $id;
    /** 当前的准备信息 */
    public $ready = array();
    /** 游戏是否开始 */
    public $isStart = false;
    /** 当前操作者 */
    public $currentUid;
    /** 最后一个出牌的人 */
    public $lastUid;
    /** 当前庄 */
    public $zhuang;
    /** 上一次坐庄的人 */
    public $lastZhuang;
    /** 最后一次打出的麻将 */
    public $lastMj;
    /** 最后一次杠的麻将 */
    public $lastGangMj;
    /** 一共有多少张麻将  */
    public $totalMj;
    /** 当前摸到第几张麻将了 */
    public $currentMj = 0;
    /** 杠牌之后 从后面摸牌的inex */
    public $currentMj2 = 0;
    /** 暗杠信息*/
    public $angangList = array();
    /** 杠牌信息 */
    public $gangList = array();
    /** 碰牌信息 */
    public $pengList = array();
    public $dp = array();
    /**
     * 扭牌信息
     * 第一个元素 -1:未扭牌;0:不扭牌;1:中发白;2:东南幺;3:东南西北;
     */
    public $niuList = array();
    /** 记录玩家出牌次数 */
    public $chupaiCount = array();
    /** 当局万能麻将 */
    public $hunMj = -1;
    /** 吃牌信息 */
    public $chiList = array();
    /** 这一局的麻将 */
    public $mjList;
    /** 当前是否可以出牌 */
    public $chupai = true;
    /** 当前出牌是否正在扭牌 */
    public $isniupai = false;
    /** 出牌列表 */
    public $chupaiList = array();
    /** 每个玩家剩余的手牌 */
    public $mjCount = array();
    /** 番数据 */
    public $fanData;
    /** 番数详细 */
    public $fanInfos;
    /** 总番数 */
    public $totalFan;
    /** 最大局数 */
    public $maxCount;
    /** 当前局数 */
    public $currentCount;
    /** 特殊记录玩家某些操作的次数，比方说胡过多少次*/
    public $countData = array();
    /** 是否可以胡牌 */
    public $canHu = false;
    /** 听牌状态 */
    public $ting = array();
    public $huListStr = null;
    /** 最后一次操作的值 */
    public $lOpVal;
    public $lOpUid;
    /** 最后一次的新牌是什么 */
    public $newMj;
    /** 是否连杠 */
    public $lianGang = 0;

    /** 点炮的人 */
    public $pao = null;
    /** 是否带风 - 默认不带风 */
    public $feng = 0;
    /** 过胡 */
    public $guohu = array();
}