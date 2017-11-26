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
    /** 点杠碰信息(此内碰牌不能再杠) */
    public $diangangpengList = array();
    /** 选择不胡的列表(保存放弃时的番数) */
    public $passHuList = array();
    public $passPengList = array();
    /**
     * 三张牌是否交换
     * （四个人都选了才交换）
     * */
    public $ischange = false;
    /** 缺一门 */
    public $lackTypes = array();
    /** 这一局的麻将 */
    public $mjList;
    /** 当前是否可以出牌;定缺后开始出牌 */
    public $chupai = false;
    /** 出牌列表 */
    public $chupaiList = array();
    /** 每个玩家剩余的手牌 */
    public $mjCount = array();
    /** 番数据 */
    public $fanData;
    /** 番数详细 */
    public $fanInfos;
    /** 记录杠分来源 */
    public $gangInfos;
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
    /** 已经胡牌的人 */
    public $alreadyHus = array();
    /** 第一个胡牌的人 */
    public $nextZhuang = null;
    public $opting = false;
    /** 上次操作是杠,以便杠上炮，杠上花，在下次操作时转移点数
     * {uid:score,beUid:[uid,uid]}
     */
    public $perGang = array();
    /** 最后一次操作的值 */
    public $lOpVal;
    public $lOpUid;
    /** 最后一次的新牌是什么 */
    public $newMj;
    /** 是否连杠 */
    public $lianGang = 0;
    /** 杠的类型 */
    public $gtype = -1;
    /** 点炮的人 */
    public $pao = null;
    /** 一次给多少个人点炮，用于一炮多响判断 */
    public $isDuoPao = 1;

    public $isQiangGangHu = false;
    /** 限制，条件变量 */

    /** 点杠花 (1：自摸；2：点炮) */
    public $gangFlower = 1;
    /** 门清，中张 */
    public $menqingType = false;
    /** 番数限制 （-1：无限制） */
    public $maxFan = -1;
    /** 自摸 (1：加番；2：加底) */
    public $zimoType = 1;
    /** 呼叫转移 */
    public $hujiaozhuanyi = true;
    /** 幺九，将对 */
    public $jiangduiType = false;

}