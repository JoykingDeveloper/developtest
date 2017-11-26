<?php

/**
 * 十三幺
 * User: zmliu1
 * Date: 17/4/3
 * Time: 15:51
 */
class ShiSanYao extends BaseHu{
    /**
     * 胡牌
     */
    public function hu($mjList,$chiList,$pengList,$gangList,$angangList){
        if(count($mjList) != 14){
            return false;
        }
        $mjList = ArrayUtil::cloneArray($mjList);
        $removes = array(1,9,10,18,19,27,28,29,30,31,32,33,24);
        $len = count($removes);
        for($i = 0; $i < $len ;$i++){
            $val = $removes[$i];
            $index = ArrayUtil::indexOf($mjList,$val);
            if($index != -1){
                array_splice($mjList,$index,1);
            }
        }

        if(count($mjList) > 1){
            return false;
        }
        if(ArrayUtil::indexOf($removes,$mjList[0]) == -1){
            return false;
        }
        return true;
    }

}