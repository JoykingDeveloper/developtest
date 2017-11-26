<?php

/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/6/15 0015
 * Time: ???? 5:56
 */
class LongQiDui extends QiXiaoDui
{
    /**
     * ?¨¤???¨¬??
     * @return int ??????¡¤???
     */
    public function checkType($mjList,$chiList,$pengList,$gangList,$angangList){
        $len = count($mjList);
        if($len != 14){
            return 1;
        }
        $countVals = array_count_values($mjList);
        if(count($countVals) != 7){
            return 1;
        }
        $duizi = 0;
        $has4 = 0;
        $temp = -1;
        $islong = true;
        foreach($countVals as $mj => $count){
            if($temp == -1){
                $temp = $mj;
            }else{
                if($mj == $temp + 1){
                    $temp = $mj;
                }else{
                    $islong = false;
                }
            }
            if($count >= 2){
                $duizi++;
            }
            if($count >= 4){
                $duizi++;
                $has4 ++;
            }
        }
        if($has4>0){
            return 1;
        }
        //???????????????¡§??
        $types = array();
        foreach($mjList as $index => $mj){
            if($mj >= 1 && $mj <= 9){
                $types[1] = 1;
            }else if($mj >= 10 && $mj <= 18){
                $types[2] = 1;
            }else if($mj >= 19 && $mj <= 27){
                $types[3] = 1;
            }
        }
        if(count($types) == 1 && $islong){
            var_dump('ÁúÆß¶Ô1·¬');
            return 2;
        }

        return 1;
    }
}