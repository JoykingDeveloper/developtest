<?php

/**
 * ���ź�(�������в���1-9)
 * User: Administrator
 * Date: 2017/6/26 0026
 * Time: ���� 11:27
 */
class ZhongZhangHu extends TuiDaoHu
{
    public function checkType($mjList,$chiList,$pengList,$gangList,$angangList){
        $array = [1,9,10,18,19,27];
        if($pengList != null){
            foreach($pengList as $key => $value){
                $index = ArrayUtil::indexOf($array,$value);
                if($index != -1){
                    return 1;
                }
            }
        }
        if($gangList != null){
            foreach($gangList as $key => $value){
                $index = ArrayUtil::indexOf($array,$value);
                if($index != -1){
                    return 1;
                }
            }
        }
        if($angangList != null){
            foreach($angangList as $key => $value){
                $index = ArrayUtil::indexOf($array,$value);
                if($index != -1){
                    return 1;
                }
            }
        }
        if($mjList != null){
            foreach($mjList as $key => $value){
                $index = ArrayUtil::indexOf($array,$value);
                if($index != -1){
                    return 1;
                }
            }
        }
        var_dump('���ź�1��');
        return 2;
    }
}