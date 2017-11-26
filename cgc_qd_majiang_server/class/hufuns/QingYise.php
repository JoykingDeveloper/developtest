<?php

/**
 *
 * 清一色
 *
 * User: zmliu1
 * Date: 17/4/5
 * Time: 10:53
 */
class QingYise extends BaseHu{
    /**
     * 类型检测
     * @return int 增加的番数
     */
    public function checkType($mjList,$chiList,$pengList,$gangList,$angangList){

        $tmpmjList = ArrayUtil::cloneArray($mjList);
        MaJiangConstant::getWannengCount($tmpmjList,$this->game,$this->ispao);
        if($chiList != null){
            foreach($chiList as $index => $arr){
                foreach($arr as $index2 => $mj){
                    array_push($tmpmjList,$mj);
                }
            }
        }
        if($pengList != null) foreach($pengList as $index => $mj) array_push($tmpmjList,$mj);
        if($gangList != null) foreach($gangList as $index => $mj) array_push($tmpmjList,$mj);
        if($angangList != null) foreach($angangList as $index => $mj) array_push($tmpmjList,$mj);
        $types = array();
        foreach($tmpmjList as $index => $mj){
            if($mj >= 1 && $mj <= 9){
                $types[1] = 1;
            }else if($mj >= 10 && $mj <= 18){
                $types[2] = 1;
            }else if($mj >= 19 && $mj <= 27){
                $types[3] = 1;
            }else if($mj >= 28 && $mj <= 34){
                $types[4] = 1;
            }
        }
        if(count($types) == 1){
            return 2;
        }
        return 1;
    }
}