<?php

/**
 * 将对
 * User: zmliu1
 * Date: 17/4/3
 * Time: 15:23
 */
class JiangYiSe extends TuiDaoHu{
    /**
     * 胡牌
     */
    public function checkType($mjList,$chiList,$pengList,$gangList,$angangList){
        $len = count($mjList);
        for($i = 0; $i < $len ; $i++){
            if(!$this->is258($mjList[$i])){
                return 1;
            }
        }
        if($chiList != null){
            return 1;
        }
        if($pengList != null){
            $len = count($pengList);
            for($i = 0; $i < $len ; $i++){
                if(!$this->is258($pengList[$i])){
                    return 1;
                }
            }
        }
        if($gangList != null){
            $len = count($gangList);
            for($i = 0; $i < $len ; $i++){
                if(!$this->is258($gangList[$i])){
                    return 1;
                }
            }
        }
        if($angangList != null){
            $len = count($angangList);
            for($i = 0; $i < $len ; $i++){
                if(!$this->is258($angangList[$i])){
                    return 1;
                }
            }
        }
        var_dump("将对1番");
        return 2;
    }
}