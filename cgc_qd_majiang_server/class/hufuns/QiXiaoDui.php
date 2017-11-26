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
        $tmpmjList = ArrayUtil::cloneArray($mjList);
        sort($tmpmjList);
        $wncount = MaJiangConstant::getWannengCount($tmpmjList,$this->game,$this->ispao);
        $countVals = array_count_values($tmpmjList);
        $duizi = 0;
        foreach($countVals as $mj => $count){
            if($count == 1 || $count == 3){
                if($wncount > 0){
                    $count ++;
                    $wncount--;
                }else{
                    return false;
                }
            }
            if($count >= 2){
                $duizi++;
            }
            if($count >= 4){
                $duizi++;
            }
        }
        if($wncount > 0 && $wncount%2 == 0){
            $duizi+=($wncount/2);
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
        $tmpmjList = ArrayUtil::cloneArray($mjList);
        $wncount = MaJiangConstant::getWannengCount($tmpmjList,$this->game,$this->ispao);
        $countVals = array_count_values($tmpmjList);
        $duizi = 0;
        $has4 = 0;
        foreach($countVals as $mj => $count){
            if($count == 1 || $count == 3){
                if($wncount > 0){
                    $count ++;
                    $wncount--;
                }else{
                    return 1;
                }
            }
            if($count >= 2){
                $duizi++;
            }
            if($count >= 4){
                $duizi++;
                $has4 += 1;
            }
        }
        if($wncount > 0 && $wncount%2 == 0){
            $duizi+=($wncount/2);
            $has4 += 1;
        }
        if($duizi == 7){
            if($has4 > 0){
                return pow(2,$has4 + 1);
            }
            return 2;
        }
        return 1;
    }
}