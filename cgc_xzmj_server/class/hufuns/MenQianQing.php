<?php

/**
 * ��ǰ�壨�����޸ܣ�
 * User: Administrator
 * Date: 2017/6/26 0026
 * Time: ���� 11:09
 */
class MenQianQing extends TuiDaoHu
{
    public function checkType($mjList,$chiList,$pengList,$gangList,$angangList){
        if(count($mjList) == 14 && !$pengList && !$gangList && !$angangList){
            var_dump('�����1��');
            return 2;
        }
        return 1;
    }
}