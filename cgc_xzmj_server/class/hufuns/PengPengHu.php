<?php

/**
 * 碰碰胡
 * User: zmliu1
 * Date: 17/3/30
 * Time: 15:57
 */
class PengPengHu extends TuiDaoHu{

    /**
     * 胡牌
     */
//    public function hu($mjList,$chiList,$pengList,$gangList,$angangList){
//        $mjList = ArrayUtil::cloneArray($mjList);
//        sort($mjList);
//
//        //找出3个 或者4个 相同的 移除掉
//        $countVals = array_count_values($mjList);
//        foreach($countVals as $mj => $count){
//            if($count == 3 || $count == 4){
//                $index = ArrayUtil::indexOf($mjList,$mj);
//                array_splice($mjList,$index,$count);
//            }
//        }
//        $len = count($mjList);
//        if($len == 2 && $mjList[0] == $mjList[1] && $this->is258($mjList[0])){
//            return true;
//        }
//        return false;
//    }

    /**
     * 类型检测
     * @return int 增加的番数
     */
    public function checkType($mjList,$chiList,$pengList,$gangList,$angangList){
        $mjList = ArrayUtil::cloneArray($mjList);
        if ($chiList != null) {
            foreach ($chiList as $index => $arr) {
                foreach ($arr as $index2 => $mj) {
                    array_push($mjList, $mj);
                }
            }
        }
        if ($pengList != null){
            foreach ($pengList as $index => $mj) {
                array_push($mjList, $mj);
                array_push($mjList, $mj);
                array_push($mjList, $mj);
            }
        }

        if($gangList != null) {
            foreach($gangList as $index => $mj) {
                array_push($mjList,$mj);
                array_push($mjList,$mj);
                array_push($mjList,$mj);
            }
        }
        if($angangList != null) {
            foreach($angangList as $index => $mj) {
                array_push($mjList,$mj);
                array_push($mjList,$mj);
                array_push($mjList,$mj);
            }
        }
        sort($mjList);

        //找出3个 或者4个 相同的 移除掉
        $countVals = array_count_values($mjList);
        foreach($countVals as $mj => $count){
            if($count == 3 || $count == 4){
                $index = ArrayUtil::indexOf($mjList,$mj);
                array_splice($mjList,$index,$count);
            }
        }
        $len = count($mjList);
        if($len == 2 && $mjList[0] == $mjList[1]){

            var_dump('碰碰胡1番');
            return 2;
        }
        return 1;
    }

}