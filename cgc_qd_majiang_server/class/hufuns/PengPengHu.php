<?php

/**
 * 碰碰胡
 * User: zmliu1
 * Date: 17/3/30
 * Time: 15:57
 */
class PengPengHu extends TuiDaoHuEx{



    /**
     * 类型检测
     * @return int 增加的番数
     */
    public function checkType($mjList,$chiList,$pengList,$gangList,$angangList){
        $tmpmjList = ArrayUtil::cloneArray($mjList);
        $wncount = MaJiangConstant::getWannengCount($tmpmjList,$this->game,$this->ispao);
        if ($chiList != null) {
            return 1;
        }
        sort($tmpmjList);

        //找出3个 或者4个 相同的 移除掉
        $countVals = array_count_values($tmpmjList);
        foreach($countVals as $mj => $count){
            if($count == 3 || $count == 4){
                $index = ArrayUtil::indexOf($tmpmjList,$mj);
                array_splice($tmpmjList,$index,$count);
            }
        }
        $countVals = array_count_values($tmpmjList);
        $len = count($tmpmjList);
        if($wncount > 0 && $len > 0){
            foreach($countVals as $mj => $count1){
                if(($count1 + $wncount) >= 3){
                    $index = ArrayUtil::indexOf($tmpmjList,$mj);
                    array_splice($tmpmjList,$index,$count1);
                    $wncount -= (3-$count1);
                    $len -= $count1;
                }
            }
        }
        //此时万能做将，多余的万能配合前面移除的3或者4用
        if($len == 0 && $wncount == 2){
            return 2;
        }
        if($len == 1 && ($wncount == 1 || $wncount == 4)){
            return 2;
        }
        if($len == 2 && $tmpmjList[0] == $tmpmjList[1]){
            return 2;
        }
        return 1;
    }

}