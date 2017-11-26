<?php

/**
 * 胡牌顶级类
 * User: zmliu1
 * Date: 17/3/30
 * Time: 15:56
 */
class BaseHu{

    /** 将牌集合 */
    public $_258Vals = array(2,5,8,11,14,17,20,23,26);
    public $_258Len = 9;
    /* @var vo_MajiangGame */
    public $game;
    public $ispao = false;
    /**
     * 胡牌
     */
    public function hu($mjList,$chiList,$pengList,$gangList,$angangList){
        return false;
    }

    /**
     * 是否有258里面的牌
     */
    public function has258($mjList){
        return true;
//        for($i = 0; $i < $this->_258Len ; $i++){
//            if(ArrayUtil::indexOf($mjList,$this->_258Vals[$i]) != -1){
//                return true;
//            }
//        }
//        return false;
    }

    /**
     * 是否是258牌
     */
    public function is258($mjVal){
        return true;
//        return ArrayUtil::indexOf($this->_258Vals,$mjVal) != -1;
    }

    /**
     * 类型检测
     * @return int 增加的番数
     */
    public function checkType($mjList,$chiList,$pengList,$gangList,$angangList){
        if($this->hu($mjList,$chiList,$pengList,$gangList,$angangList)){
            return 2;
        }
        return 1;
    }

}