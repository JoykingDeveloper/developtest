<?php

/**
 * 七小队
 * User: zmliu1
 * Date: 17/4/3
 * Time: 15:20
 */
class QiXiaoDui extends BaseHu{
    /**
     * 胡牌
     */
    public function hu($mjList,$chiList,$pengList,$gangList,$angangList){
        $len = count($mjList);
        if($len != 14){
            return false;
        }
        $countVals = array_count_values($mjList);
        $duizi = 0;
        foreach($countVals as $mj => $count){
            if($count >= 2){
                $duizi++;
            }
            if($count >= 4){
                $duizi++;
            }
        }
        if($duizi == 7){
            return true;
        }
        return false;
    }

    /**
     * 类型检测
     * @return int 增加的番数
     */
    public function checkType($mjList,$chiList,$pengList,$gangList,$angangList){
        $len = count($mjList);
        if($len != 14){
            return 1;
        }
        $countVals = array_count_values($mjList);
        $duizi = 0;
        $has4 = 0;
        foreach($countVals as $mj => $count){
            if($count >= 2){
                $duizi++;
            }
            if($count >= 4){
                $duizi++;
                $has4 ++;
            }
        }
        if($duizi == 7){
//            if($has4>0){
//                var_dump("暗七对2^($has4+1)*4番");
//                return pow(2,$has4+1)*4;
//            }
            var_dump('七小对2番');
            return 4;
        }
        return 1;
    }
}