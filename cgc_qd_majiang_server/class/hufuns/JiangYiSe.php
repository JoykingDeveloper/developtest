<?php

/**
 * 将一色
 * User: zmliu1
 * Date: 17/4/3
 * Time: 15:23
 */
class JiangYiSe extends BaseHu{
    /**
     * 胡牌
     */
    public function hu($mjList,$chiList,$pengList,$gangList,$angangList){
        $len = count($mjList);
        for($i = 0; $i < $len ; $i++){
            if(!$this->is258($mjList[$i])){
                return false;
            }
        }
        if($chiList != null){
            return false;
        }
        if($pengList != null){
            $len = count($pengList);
            for($i = 0; $i < $len ; $i++){
                if(!$this->is258($pengList[$i])){
                    return false;
                }
            }
        }
        if($gangList != null){
            $len = count($gangList);
            for($i = 0; $i < $len ; $i++){
                if(!$this->is258($gangList[$i])){
                    return false;
                }
            }
        }
        if($angangList != null){
            $len = count($angangList);
            for($i = 0; $i < $len ; $i++){
                if(!$this->is258($angangList[$i])){
                    return false;
                }
            }
        }
        return true;
    }
}