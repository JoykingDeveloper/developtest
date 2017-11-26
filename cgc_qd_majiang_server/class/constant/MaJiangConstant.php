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
     * 1-9          1饼到9饼
     * 10-18        1条到9条
     * 19-27        1万到9万
     * 28-30        中发白
     * 31-34        东南西北
     * 每张麻将4张
     */

    /**
     * 操作类型 0过 1吃 2碰 3杠 4胡 5自摸 6暗杠 7扭牌 8抢杠胡
     */
    public static $operatingTypes = array(0,1,2,3,4,5,6,7,8);


    public static $huFuns;

    /**
     * 洗牌
     */
    public static function refreshMajiang($feng){
        $majiang = array();
        $end = ($feng > 0) ? 34 : 30;
        for($i = 1; $i <= $end ; $i++){
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
        $totalMoCount = 4;//摸牌次数
        $majiangList = array();

        //开始作弊
        $cheatData = CheatConstant::faCheat($players, $game);
        if($cheatData){
            $game = $cheatData[0];
            $majiangList = $cheatData[1];
        }

        while($totalMoCount > 0){
            for($i = 1; $i <= 4 ; $i++){
                $uid = $players[$i];
                $playerMaJiang = isset($majiangList[$uid]) ? $majiangList[$uid] : array();
                if($totalMoCount > 1){//前3手每人4张
                    for($j = 0; $j < 4 ; $j++){
                        if(count($playerMaJiang) >= 12){//前3手牌判断玩家作弊牌是否满了12张牌
                            break;
                        }
                        array_push($playerMaJiang,$game->mjList[$game->currentMj]);
                        $game->currentMj++;
                    }
                }else{//最后一手 庄家2张 闲家1张
                    if($uid == $zhuang){
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
//    public static function faMjTest($room,$game){
//        $players = $room->players;
//        $hu = false;
//        $majiangList = array();
//
//        for($i = 1; $i <= 4 ; $i++) {
//            $uid = $players[$i];
//            $playerMaJiang = array();
//            if($game->zhuang == $uid){
//                $playerMaJiang = [2,2,3,4,5,6,7,8,9,10,10,28,29,30];
////                $game->pengList[$uid] = [1];
//            }else{
//                if(!$hu){
//                    $playerMaJiang = [1,1,1,2,3,4,5,6,7,8,9,9,9];
//                    $hu = true;
//                }else{
//                    $playerMaJiang = [2,3,4,5,6,7,8,9,10,10,11,12,13];
//                }
//            }
//            sort($playerMaJiang);
//            $majiangList[$uid] = $playerMaJiang;
//        }
//
//        $game->currentMj2 = 0;
//        $game->currentMj = 50;
//        return array($game,$majiangList);
//    }
    /**
     * 判断操作是否合法
     */
    public static function hasOperating($op){
        return ArrayUtil::contains(self::$operatingTypes,$op);
    }
    /**
     * 开始扭牌
     * @param $game vo_MajiangGame
     * @param $mjList array
     * @param $niumjVals array //所有开始扭的牌
     * @return bool
     */
    public static function checkStartNiu($game,$mjList,$niumjVals){
        $tmpniuVals = ArrayUtil::cloneArray($niumjVals);
        //检测是否有该手牌
        $len = count($tmpniuVals);
        for($i = 0 ;$i<$len;$i++){
            if(ArrayUtil::indexOf($mjList,$tmpniuVals[$i]) == -1){
                return false;
            }
        }
        /** 检测扭牌组合是否合法 */
        $wncount = MaJiangConstant::getWannengCount($tmpniuVals,$game);
        //中发白
        $hascount = 0;
        for($mj = 28;$mj<=30;$mj++){
            $index = ArrayUtil::indexOf($tmpniuVals,$mj);
            if($index != -1){
                $hascount++;
                array_splice($tmpniuVals,$index,1);
            }
        }
        if($hascount > 0){
            if($wncount < (3 - $hascount))return false;else $wncount -= (3 - $hascount);
        }
        //东南西北
        $hascount = 0;
        if((count($tmpniuVals)+$wncount)%3 != 0){
            for($mj = 31;$mj<=34;$mj++){
                $index = ArrayUtil::indexOf($tmpniuVals,$mj);
                if($index != -1){
                    $hascount++;
                    array_splice($tmpniuVals,$index,1);
                }
            }
        }
        if($hascount > 0){
            if($wncount < (4 - $hascount))return false;else $wncount -= (4 - $hascount);
        }
        //东南幺
        $hascount = 0;
        $vals = array(31,32,10);
        if(count($tmpniuVals) > 0){
            foreach($vals as $i=>$mj){
                $index = ArrayUtil::indexOf($tmpniuVals,$mj);
                if($index != -1){
                    $hascount++;
                    array_splice($tmpniuVals,$index,1);
                }
            }
        }
        if($hascount > 0){
            if($wncount < (3 - $hascount))return false;else $wncount -= (3 - $hascount);
        }
        if(count($tmpniuVals) > 0){
            return false;
        }
        if((count($tmpniuVals) + $wncount) == 0){
            return true;
        }
        if($wncount == 3){
            $vals = array(28,29,30,31,32,10);
            if(ArrayUtil::indexOf($vals,$game->hunMj) != -1){
                return true;
            }
        }
        if($wncount == 4){
            $vals = array(31,32,33,34);
            if(ArrayUtil::indexOf($vals,$game->hunMj) != -1){
                return true;
            }
        }
        return false;
    }
    /**
     * 检查是否包含该组合
     * @param $niuList array
     * @param $mjVals array
     * @return bool
     * */
    public static function checkNiuGroupContains($niuList,$mjVals){
        //mjVals全部同时存在于niuList返回false
        if($mjVals == null || count($mjVals) == 0){
            return false;
        }
        if($niuList == null || count($niuList) == 0){
            return false;
        }
        $count = 0;
        foreach($mjVals as $index=>$mj){
            if(in_array($mj,$niuList)){
                $count++;
            }
        }
        return $count == count($mjVals);
    }
    /** 检测扭的某张牌是否合法 */
    public static function checkNiu($canNiuList,$mjVal,$game){
        $niuList = ArrayUtil::cloneArray($canNiuList);
        $wncount = self::getWannengCount($niuList,$game);
        $canNiuVals = array();
        $group_list = array(28,29,30);
        for($i = 0;$i<3;$i++){
            if(ArrayUtil::indexOf($niuList,$group_list[$i]) != -1){
                $niuList = ArrayUtil::removeValue($niuList,$group_list[$i]);
                array_splice($group_list,$i,1);
                $i--;
            }
        }
        if(count($group_list) != 3){
            $wncount -= count($group_list);
            array_push($canNiuVals,28);
            array_push($canNiuVals,29);
            array_push($canNiuVals,30);
        }
        if((count($niuList)+$wncount)%3 != 0){
            $group_list = array(31,32,33,34);
            for($i = 0;$i<4;$i++){
                if(ArrayUtil::indexOf($niuList,$group_list[$i]) != -1){
                    $niuList = ArrayUtil::removeValue($niuList,$group_list[$i]);
                    array_splice($group_list,$i,1);
                    $i--;
                }
            }
            if(count($group_list) != 4){
                $wncount -= count($group_list);
                array_push($canNiuVals,31);
                array_push($canNiuVals,32);
                array_push($canNiuVals,33);
                array_push($canNiuVals,34);
            }
        }
        $group_list = array(31,32,10);
        for($i = 0;$i<3;$i++){
            if(ArrayUtil::indexOf($niuList,$group_list[$i]) != -1){
                $niuList = ArrayUtil::removeValue($niuList,$group_list[$i]);
                array_splice($group_list,$i,1);
                $i--;
            }
        }
        if(count($group_list) != 3){
            $wncount -= count($group_list);
            array_push($canNiuVals,31);
            array_push($canNiuVals,32);
            array_push($canNiuVals,10);
        }
        if($wncount == 3){
            $group_list1 = array(28,29,30);
            $group_list2 = array(31,32,10);
            if(array_search($game->hunMj,$group_list1) != -1){
                array_push($canNiuVals,28);
                array_push($canNiuVals,29);
                array_push($canNiuVals,30);
            }elseif(array_search($game->hunMj,$group_list2) != -1){
                array_push($canNiuVals,31);
                array_push($canNiuVals,32);
                array_push($canNiuVals,10);
            }
        }
        if($wncount == 4){
            array_push($canNiuVals,31);
            array_push($canNiuVals,32);
            array_push($canNiuVals,33);
            array_push($canNiuVals,34);
        }
        return array_search($mjVal,$canNiuVals) != -1;
    }
    /**
     * 杠
     * @param $mj   int 被杠的麻将
     * @param $mjList   array 杠牌的人的麻将列表
     * @return bool
     */
    public static function gang($mj,$mjList){
        $len = count($mjList);
        $count = 0;
        for($i = 0; $i < $len; $i++){
            if($mj == $mjList[$i]){
                $count++;
            }
        }
        if($count == 3){
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
    public static function peng($mj,$mjList){
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
     * 吃
     * @param $mj   int 被吃的麻将
     * @param $mjs   array 使用的是哪两张牌来吃牌
     * @return bool
     */
    public static function chi($mj,$mjs){
        if($mj >= 28 || count($mjs) < 2) return false;

        $chiStart = -1;
        $chiEnd = -1;
        $seArray = array(array(1,9),array(10,18),array(19,27));
        foreach($seArray as $index => $val){
            if($mj >= $val[0] && $mj <= $val[1]){
                $chiStart = $val[0];
                $chiEnd = $val[1];
                break;
            }
        }

        sort($mjs);
        $mj1 = $mjs[0];
        $mj2 = $mjs[1];
        if($mj1 < $chiStart || $mj2 > $chiEnd){
            return false;
        }

        $off = abs($mj1 - $mj2);

        if($off > 2) {
            return false;
        }
        if($off == 2 && ($mj - $mj1) != 1) {
            return false;
        }
        if($off == 1 && (($mj - $mj2 != 1) && ($mj1 - $mj) != 1)) {
            return false;
        }

        return true;
    }

    /**
     * @param $mj   int
     * @param $mjList   array
     * @return bool
     */
    public static function hu($mj,$mjList,$chiList,$pengList,$gangList,$angangList,$game){
        $tmpMjList = ArrayUtil::cloneArray($mjList);
        if($mj != -1) array_push($tmpMjList,$mj);

        if(self::$huFuns == null){
            self::$huFuns = array(new TuiDaoHuEx(),new QiXiaoDui());
        }
        $len = count(self::$huFuns);
        for($i = 0; $i < $len ; $i++){
            /* @var $huObj BaseHu */
            $huObj = self::$huFuns[$i];
            $huObj->game = $game;
            $huObj->ispao = $mj != -1;
            if($huObj->hu($tmpMjList,$chiList,$pengList,$gangList,$angangList)){
                return true;
            }
        }
        return false;
    }

    /**
     * 获取万能牌个数
     * @param $game vo_MajiangGame
     */
    public static function getWannengCount(&$mjList,$game,$ispao = false){
        $wannengCount = 0;
        $countVals = array_count_values($mjList);
        if(isset($countVals[$game->hunMj])){
            $wannengCount = $countVals[$game->hunMj];
            if($ispao && $game->lastMj == $game->hunMj){
                $wannengCount --;
            }
            array_splice($mjList,array_search($game->hunMj,$mjList),$wannengCount);
        }
        return $wannengCount;
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
    public static function getNewMj(&$game,$opVal){
        //开始作弊
        CheatConstant::getNewCheatMj($game, $opVal);

        if($opVal == 3){
            $newMj = $game->mjList[$game->totalMj - 1 - $game->currentMj2];
            $game->currentMj2++;
        }else{
            $newMj = $game->mjList[$game->currentMj];
            $game->currentMj++;
        }
//        $newMj = 15;
        $game->newMj = $newMj;
        return $newMj;
    }




}