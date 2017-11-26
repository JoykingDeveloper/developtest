<?php

/**
 *
 * 血战麻将作弊的数据
 *
 * User: zmliu1
 * Date: 17/1/10
 * Time: 16:24
 */
class vo_Cheat extends BaseVO
{
    /** 当前玩家id */
    public $uid;
    /** 当前作弊(发手牌)，最多13张;一维数组 */
    public $card = array();
    /** 发手牌是否作弊 */
    public $is_cheat = false;
    /** 当前摸牌作弊，一维数组 */
    public $faCheatMj = array();
    /** 摸牌是否允许作弊 */
    public $is_moMj = false;

}