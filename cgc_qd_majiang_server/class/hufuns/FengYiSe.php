<?php

/**
 * 风一色
 * User: zmliu1
 * Date: 17/4/3
 * Time: 15:33
 */
class FengYiSe extends BaseHu{
    /**
     * 胡牌
     */
    public function hu($mjList,$chiList,$pengList,$gangList,$angangList){
        $len = count($mjList);
        for($i = 0; $i < $len ; $i++){
            if($mjList[$i] < 28){
                return false;
            }
        }
        if($chiList != null){
            return false;
        }
        if($pengList != null){
            $len = count($pengList);
            for($i = 0; $i < $len ; $i++){
                if($pengList[$i] < 28){
                    return false;
                }
            }
        }
        if($gangList != null){
           $len = count($gangList);
            for($i = 0; $i < $len ; $i++){
                if($gangList[$i] < 28){
                    return false;
                }
            }
        }
        if($angangList != null){
            $len = count($angangList);
            for($i = 0; $i < $len ; $i++){
                if($angangList[$i] < 28){
                    return false;
                }
            }
        }
        return true;
    }
}