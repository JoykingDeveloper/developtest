<?php

/**
 * �𹳵�
 * User: wangc
 * Date: 2017/5/23 0023
 * Time: ���� 5:35
 */
class JinGouDiao extends TuiDaoHu
{
    public function checkType($mjList,$chiList,$pengList,$gangList,$angangList){
        if(!$this->hu($mjList,$chiList,$pengList,$gangList,$angangList)){
            return 1;
        }
        $mjList = ArrayUtil::cloneArray($mjList);
        $len = count($mjList);
        if($len == 2 && $mjList[0] == $mjList[1]){

            var_dump('�𹳵�1��');
            return 2;
        }
        return 1;
    }
}