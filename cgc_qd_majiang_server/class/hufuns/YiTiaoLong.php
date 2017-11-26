<?php

/**
 * 一条龙
 * User: zmliu1
 * Date: 17/4/5
 * Time: 13:44
 */
class YiTiaoLong extends TuiDaoHuEx{

    /**
     * 类型检测
     * @return int 增加的番数
     */
    public function checkType($mjList,$chiList,$pengList,$gangList,$angangList){
        $count = count($mjList);
        if($count < 9){
            return 1;
        }
        $ranges = array(array(1,9),array(10,18),array(19,27));
        foreach ($ranges as $index => $arr) {
            $start = $arr[0];
            $end = $arr[1];
            $count = 0;
            for($i=$start; $i<=$end ; $i++){
                if(ArrayUtil::indexOf($mjList,$i) == -1){
                    break;
                }
                $count++;
            }
            if($count == 9) return 2;
        }
        return 1;
    }

}