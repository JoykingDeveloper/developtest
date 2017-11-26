<?php

/**
 * 十三不靠
 * User: zmliu1
 * Date: 17/4/3
 * Time: 15:38
 */
class ShiSanBuKao extends BaseHu{
    /**
     * 胡牌
     */
    public function hu($mjList,$chiList,$pengList,$gangList,$angangList){
        if(count($mjList) != 14){
            return false;
        }
        $countVals = array_count_values($mjList);
        foreach($countVals as $mj => $count){
            if($count > 1){//不能有重复的牌
                return false;
            }
        }
        $tmpMjList = ArrayUtil::cloneArray($mjList);
        sort($tmpMjList);
        for($i = 28; $i <= 34 ; $i++){
            //移除风
            $index = ArrayUtil::indexOf($tmpMjList,$i);
            if($index != -1) array_splice($tmpMjList,$index,1);
        }
        //风不够5张
        if(count($tmpMjList) > 9){
            return false;
        }
        $_147258369 = array(
            array(array(1,4,7),array(2,5,8),array(3,6,9)),
            array(array(10,13,16),array(11,14,17),array(12,15,18)),
            array(array(19,22,25),array(20,23,26),array(21,24,27))
        );
        $_canUse_i = array(0,1,2);
        $_canUse_j = array(0,1,2);
        $_arr = null;
        $_arr1 = null;
        $_findCount = 0;
        for($i = 0; $i < 3 ; $i++){
            if(ArrayUtil::indexOf($_canUse_i,$i) == -1){
                continue;
            }
            $_arr = $_147258369[$i];
            for($j = 0; $j < 3 ; $j++){
                if(ArrayUtil::indexOf($_canUse_j,$j) == -1){
                    continue;
                }
                $_arr1 = $_arr[$j];
                $_removeCount = 0;
                for($k = 0; $k < 3 ; $k++){
                    $mjVal = $_arr1[$k];
                    $index = ArrayUtil::indexOf($tmpMjList,$mjVal);
                    if($index != -1){
                        array_splice($tmpMjList,$index,1);
                        $_removeCount++;
                    }
                }
                if($_removeCount > 0){
                    $index = ArrayUtil::indexOf($_canUse_j,$j);
                    array_splice($_canUse_j,$index,1);
                    $_findCount++;

                    $index = ArrayUtil::indexOf($_canUse_i,$i);
                    array_splice($_canUse_i,$index,1);
                    break;
                }
            }
            if($_findCount == $i){
                break;
            }
        }
        if(count($tmpMjList) == 0){
            return true;
        }
        return false;
    }
}