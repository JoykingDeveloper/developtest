<?php

/**
 *
 * 麻将
 *
 * User: zmliu1
 * Date: 17/2/23
 * Time: 09:19
 */
class MaJiangConstant{
    /**
     * 1-9          1到9筒
     * 10-18        1条到9条
     * 19-27        1万到9万
     * 每张麻将4张
     */
    public static  $mjArr = array(array(1,9),array(10,18),array(19,27));
    /**
     * 操作类型 0过 1吃 2碰 3杠 4胡 5自摸 6暗杠
     */
    public static $operatingTypes = array(0,1,2,3,4,5,6);

    /**
     * 洗牌
     */
    public static function refreshMajiang(){
        $majiang = array();
        for($i = 1; $i <= 27 ; $i++){
            $count = 4;
            for($j = 0; $j < $count ; $j++){
                array_push($majiang,$i);
            }
        }
        shuffle($majiang);
        return $majiang;
    }

    /**
     * 发麻将
     * @param $room vo_Room
     * @param $game vo_MajiangGame
     * @return array
     */
    public static function faMj($room,$game){
        $zhuang = $game->zhuang;
        $players = $room->players;
        $game->currentMj = 0;
        $totalMoCount = 4;//摸牌次数
        $majiangList = array();
        while($totalMoCount > 0){
            for($i = 1; $i <= 4 ; $i++){
                $uid = $players[$i];
                $playerMaJiang = isset($majiangList[$uid]) ? $majiangList[$uid] : array();
                if($totalMoCount > 1){//前3手每人4张
                    for($j = 0; $j < 4 ; $j++){
                        array_push($playerMaJiang,$game->mjList[$game->currentMj]);
                        $game->currentMj++;
                    }
                }else{//最后一手 庄家2张 闲家1张
                    if($zhuang == $uid){
                        array_push($playerMaJiang,$game->mjList[$game->currentMj]);
                        $game->currentMj++;
                        array_push($playerMaJiang,$game->mjList[$game->currentMj]);
                        $game->currentMj++;
                    }else{
                        array_push($playerMaJiang,$game->mjList[$game->currentMj]);
                        $game->currentMj++;
                    }
                }
                sort($playerMaJiang);
                $majiangList[$uid] = $playerMaJiang;
            }
            $totalMoCount--;
        }

        $game->currentMj2 = 0;
        return array($game,$majiangList);
    }
    /**
     * @param $mjVal
     * @return int
     */
    public static function getBaiDa($mjVal){
        $baida = -1;
        if($mjVal >= 28){
            if($mjVal >= 28 && $mjVal <= 30){
                $baida = $mjVal + 1;
                if($baida > 30){
                    $baida = 28;
                }
            }else if($mjVal >= 31 && $mjVal <= 34){
                $baida = $mjVal + 1;
                if($baida > 34){
                    $baida = 31;
                }
            }
        }else{
            $se = self::findMajiangStartEnd($mjVal);
            $start = $se[0];
            $end = $se[1];
            $baida = $mjVal + 1;
            if($baida > $end){
                $baida = $start;
            }
        }
        return $baida;
    }

    /**
     * 判断操作是否合法
     */
    public static function hasOperating($op){
        return ArrayUtil::contains(self::$operatingTypes,$op);
    }
    /**
     * 换三张
     * mjdata(uid->mj)
     * type:1顺时2对调3逆时
     */
    public static function changeThreeMj($mjdata,$type,$room){
        if(count($mjdata) != 4)return null;
        if($type<1 || $type>3)return null;

        $keys = array_keys($mjdata);
        $values = array_values($mjdata);
        $players = $room->players;
        foreach($players as $index=>$uid){
            $key_index = ArrayUtil::indexOf($keys,$uid);
            if($index != $key_index+1){
                $tmp_key = $keys[$index - 1];
                $tmp_value = $values[$index - 1];
                $keys[$index - 1] = $keys[$key_index];
                $values[$index - 1] = $values[$key_index];
                $keys[$key_index] = $tmp_key;
                $values[$key_index] = $tmp_value;
            }
        }

        $tempValues = array();
        $index = $type;
        for($i = 0;$i<4;$i++){
            $tempValues[$keys[$i]] = $values[$index];
            $index++;
            if($index == 4){
                $index = 0;
            }
        }
        return $tempValues;
    }
    /**
     * 判断是否是缺牌
     */
    public static function isLackMj($mj,$lack){
        if($mj>=MaJiangConstant::$mjArr[$lack-1][0] && $mj<=MaJiangConstant::$mjArr[$lack-1][1]){
            return true;
        }
        return false;
    }
    /**
     * 是否同种类型,个数是否为3
     */
    public static function isSameType($mjList){
        if(count($mjList) != 3){
            var_dump('换三张数量非法');
            return false;
        }
        foreach(MaJiangConstant::$mjArr as $index => $value){
            if($mjList[0] >= $value[0] && $mjList[0] <= $value[1]){
                for($i = 1;$i<count($mjList);$i++){
                    if($mjList[$i] >= $value[0] && $mjList[$i] <= $value[1]){
                        continue;
                    }else{
                        return false;
                    }
                }
                return true;
            }
        }
        var_dump('换三张花色不统一');
        return false;
    }
    /**
     * 杠
     * @param $mj   int 被杠的麻将
     * @param $mjList   array 杠牌的人的麻将列表
     * @param $game vo_MajiangGame
     * @return bool
     */
    public static function gang($mj,$mjList,$game,$lack){
        //没有牌了不能杠
        if(!MjGameConstant::hasMj($game)){
            return false;
        }

        if(MaJiangConstant::isLackMj($mj,$lack)){
            return false;
        }
        $len = count($mjList);
        $count = 0;
        for($i = 0; $i < $len; $i++){
            if($mj == $mjList[$i]){
                $count++;
            }
        }
        if($count == 3 ){
            return true;
        }
        return false;
    }

    /**
     * 碰
     * @param $mj   int 被碰的麻将
     * @param $mjList   array 碰牌的人的麻将列表
     * @return bool
     */
    public static function peng($mj,$mjList,$lack){

        if(MaJiangConstant::isLackMj($mj,$lack)){
            return false;
        }
        $len = count($mjList);
        $count = 0;
        for($i = 0; $i < $len; $i++){
            if($mj == $mjList[$i]){
                $count++;
            }
        }
        if($count >= 2){
            return true;
        }
        return false;
    }



    /**
     * @param $mj   int
     * @param $mjList   array
     * @return bool
     */
    public static function hu($mj,$mjList,$chiList,$pengList,$gangList,$angangList,$game,$lack){

        $tmpMjList = ArrayUtil::cloneArray($mjList);
        if($mj != -1) array_push($tmpMjList,$mj);
        foreach($tmpMjList as $index=>$value){
            if(MaJiangConstant::isLackMj($value,$lack)){
                return false;
            }
        }

        $huFuns = array(new TuiDaoHu(),new QiXiaoDui());

        $len = count($huFuns);
        for($i = 0; $i < $len ; $i++){
            /* @var $huObj BaseHu */
            $huObj = $huFuns[$i];
            $huObj->game = $game;
            if($huObj->hu($tmpMjList,$chiList,$pengList,$gangList,$angangList)){
                return true;
            }
        }
        return false;
    }
    /*
    *获取麻将牌型，的基础番数
    */
    public static function getBaseFan($mj,$mjList,$pengList,$gangList,$angangList,$game){
        $mjList = ArrayUtil::cloneArray($mjList);
        if($mj != -1) array_push($mjList,$mj);
        $fancount = 0;
        //判断各大胡法，加倍分数
        $huFuns = array(new QiXiaoDui(),new JinGouDiao(),new PengPengHu(),new QingYise());
        if($game->menqingType){
            array_push($huFuns,new MenQianQing());
            array_push($huFuns,new ZhongZhangHu());
        }
        if($game->jiangduiType){
            array_push($huFuns,new ShiSanYao());
            array_push($huFuns,new JiangYiSe());
        }

        $len = count($huFuns);
        for($i = 0; $i < $len ; $i++){
            /* @var $huObj BaseHu */
            $huObj = $huFuns[$i];
            $bei = $huObj->checkType($mjList,null,$pengList,$gangList,$angangList);
            while($bei>1){
                $bei /=2;
                $fancount+=1;
            }

        }
        //算根番
        $geng = 0;
        $mj_count = array_count_values($mjList);
        foreach($mj_count as $v=>$c){
            if($c == 4){
                $geng++;
            }else if($c == 1 && $pengList != null && ArrayUtil::indexOf($pengList,$v) != -1){
                $geng++;
            }
        }
        if($geng > 0){
            var_dump("算根".$geng."番");
            $fancount += $geng;
        }
        //算杠番
        if($gangList && count($gangList)>0){
            foreach($gangList as $k=>$val){
                $fancount +=1;
            }
            var_dump("算杠".count($gangList)."番");

        }
        if($angangList && count($angangList)>0){
            foreach($angangList as $k=>$val){
                $fancount +=1;
            }
            var_dump("算杠".count($angangList)."番");
        }
        //限制番
        if($game->maxFan != -1 && $fancount > $game->maxFan){
            $fancount = $game->maxFan;
        }
        return $fancount;

    }


    /**
     * 获取麻将所处区间
     * @return array
     */
    public static function findMajiangStartEnd($mjVal){
        if($mjVal >= 28){
            return array(-1,-1);
        }
        $start = -1;
        $end = -1;
        $seArray = array(array(1,9),array(10,18),array(19,27));
        for($i = 0; $i < 3 ; $i++){
            $val = $seArray[$i];
            if($mjVal >= $val[0] && $mjVal <= $val[1]){
                $start = $val[0];
                $end = $val[1];
                break;
            }
        }
        return array($start,$end);
    }

    /**
     * 获取麻将所处区间
     */
    public static function findMajiangStartEnd2($mjVals){
        if($mjVals[0] >= 28 || $mjVals[1] >= 28 || $mjVals[2] >= 28){
            return array(-1,-1);
        }
        $start = -1;
        $end = -1;
        $seArray = array(array(1,9),array(10,18),array(19,27));
        $val = null;
        for($i = 0; $i < 3 ; $i++){
            $val = $seArray[$i];
            if(
                $mjVals[0] >= $val[0] && $mjVals[0] <= $val[1] &&
                $mjVals[1] >= $val[0] && $mjVals[1] <= $val[1] &&
                $mjVals[2] >= $val[0] && $mjVals[2] <= $val[1]
            ){
                $start = $val[0];
                $end = $val[1];
                break;
            }
        }
        return array($start,$end);
    }

    /**
     * 获取一张新的麻将
     * @param $game vo_MajiangGame
     * @param $opVal
     * @return int
     */
    public static function getNewMj(&$game,$opVal,$opUid){
        if($opVal == 3){
            $newMj = $game->mjList[$game->totalMj - 1 - $game->currentMj2];
            $game->currentMj2++;
        }else{
            $newMj = $game->mjList[$game->currentMj];
            $game->currentMj++;
            //非杠抓新牌时，清楚上杠数据
            $game->perGang = array();
        }
        //抓牌是清除
        if(isset($game->passHuList[$opUid])){
            unset($game->passHuList[$opUid]);
        }
        if(isset($game->passPengList[$opUid])){
            unset($game->passPengList[$opUid]);
        }
        $game->newMj = $newMj;
        return $newMj;
    }




}