<?php

/**
 * 十三幺
 * User: zmliu1
 * Date: 17/4/3
 * Time: 15:51
 */
class ShiSanYao extends TuiDaoHu{

    /*
     * 满足推倒胡，检测带幺九
     * **/
    public function checkType($mjList,$chiList,$pengList,$gangList,$angangList){

        $mjList = ArrayUtil::cloneArray($mjList);
        $yaojiuMj = array(1,9,10,18,19,27);
        $_456Mj = array(4,5,6,13,14,15,22,23,24);
        $_2Mj = array(2,11,20);
        $_3Mj = array(3,12,21);
        $_7Mj = array(7,16,25);
        $_8Mj = array(8,17,26);
        if($pengList != null) foreach($pengList as $index => $mj)if(!in_array($mj,$yaojiuMj))return 1;
        if($gangList != null) foreach($gangList as $index => $mj)if(!in_array($mj,$yaojiuMj))return 1;
        if($angangList != null) foreach($angangList as $index => $mj)if(!in_array($mj,$yaojiuMj))return 1;
        $count_value = array_count_values($mjList);
        //不能带456
        foreach($mjList as $index => $mj){
            if(in_array($mj,$_456Mj)){
                return 1;
            }
        }
        //找出能做将的1、9
        foreach($count_value as $mj=>$count){
            if(in_array($mj,$yaojiuMj) && $count > 1){
                //此牌可以做将
                $tempMjList = ArrayUtil::cloneArray($mjList);
                sort($tempMjList);
                $tempMjList = ArrayUtil::removeValue($tempMjList,$mj,2);
                $temp_count_value = array_count_values($tempMjList);
                //遍历每一个2378对应配一个1、9
                $is19 = true;
                foreach($temp_count_value as $tempmj=>$tempcount){
                    if(in_array($tempmj,$_2Mj)){
                        if($temp_count_value[$tempmj-1] != $tempcount || $temp_count_value[$tempmj+1] != $tempcount){
                            $is19 = false;
                            break;
                        }
                    }
                    if(in_array($tempmj,$_3Mj)){
                        if($temp_count_value[$tempmj-1] != $tempcount || $temp_count_value[$tempmj-2] != $tempcount){
                            $is19 = false;
                            break;
                        }
                    }
                    if(in_array($tempmj,$_7Mj)){
                        if($temp_count_value[$tempmj+1] != $tempcount || $temp_count_value[$tempmj+2] != $tempcount){
                            $is19 = false;
                            break;
                        }
                    }
                    if(in_array($tempmj,$_8Mj)){
                        if($temp_count_value[$tempmj-1] != $tempcount || $temp_count_value[$tempmj+1] != $tempcount){
                            $is19 = false;
                            break;
                        }
                    }
                }
                if($is19){
                    var_dump('幺九牌2番');
                    return 4;
                }
            }
        }

        return 1;

    }
}