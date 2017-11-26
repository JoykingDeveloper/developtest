<?php

/**
 * 门前清（无碰无杠）
 * User: Administrator
 * Date: 2017/6/26 0026
 * Time: 上午 11:09
 */
class MenQianQing extends TuiDaoHu
{
    public function checkType($mjList,$chiList,$pengList,$gangList,$angangList){
        if(count($mjList) == 14 && !$pengList && !$gangList && !$angangList){
            var_dump('门清胡1番');
            return 2;
        }
        return 1;
    }
}