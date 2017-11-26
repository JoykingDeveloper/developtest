<?php

/**
 * 算番
 * User: zmliu1
 * Date: 17/3/1
 * Time: 16:41
 */
class SuanFanConstant{

    /**
     * 被胡
     * @param   $huUid    string  胡牌的人
     * @param   $mjList array   胡牌人的牌
     * @param   $game  vo_MajiangGame
     * @param   $room   vo_Room
     * @param   $type   int 0-点炮 1-自摸
     * @param   $huMj   int 是哪一张牌导致胡牌
     * @param   $hasGang    bool 是否是抢杠
     * @return vo_MajiangGame
     */
    public static function hu($huUid,$mjList,$game,$room,$type,$huMj,$hasGang = false){
        $fanData = self::initFanData($game->fanData,$room);
        $fanInfos = self::initFanInfos($game->fanInfos,$room);
        $game->alreadyHus[$huUid] = $huMj;
        if(!$game->nextZhuang){
            $game->nextZhuang = $game->isDuoPao > 1?$game->lastUid:$huUid;
        }

        $players = $room->players;
        $countData = null;
        if(!isset($game->countData[$huUid])){
            $countData = array();
        }else{
            $countData = $game->countData[$huUid];
        }
        echo "before_hu:".DateUtil::makeTime()."uid:".$huUid."roomid:".$room->id."\n";
        $score = 0;
        $pengList = $game->pengList[$huUid];
        $gangList = $game->gangList[$huUid];
        $angangList = $game->angangList[$huUid];

        $fancount = 0;
        if($type == 1 && $game->zimoType == 1){//自摸
            var_dump('自摸胡+1番');
            $score += 2;
            $fancount +=1;
        }else{
            $score += 1;
        }
        //枪杠胡：+1  被枪杠的玩家算放冲。翻倍
        if($hasGang){

            var_dump('抢杠胡+1番');
            $score *= 2;
            $fancount +=1;
        }

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
//            $huObj->game = $game;
//            if($huObj->hu($mjList,null,$pengList,$gangList,$angangList)){
                $bei = $huObj->checkType($mjList,null,$pengList,$gangList,$angangList);
                $score *= $bei;
                while($bei>1){
                    $bei /=2;
                    $fancount+=1;
                }
//            }

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
            $score *= pow(2,$geng);
            $fancount += $geng;
        }
        //算杠番
        if($gangList && count($gangList)>0){
            foreach($gangList as $k=>$val){
                $score *= 2;
                $fancount +=1;
            }
            var_dump("算杠".count($gangList)."番");

        }
        if($angangList && count($angangList)>0){
            foreach($angangList as $k=>$val){
                $score *= 2;
                $fancount +=1;
            }
            var_dump("算杠".count($angangList)."番");
        }

        //海底胡牌算自摸，海底捞翻倍

        //杠上花
        if(self::isGangKai($game,$huUid)){
            //杠上花
            var_dump('杠上花1番');
            $score *= 2;
            $fancount +=1;
            $game->perGang = array();
        }
        //杠上炮
        if(self::isGangPao($game) && !$hasGang){//抢杠胡不算杠上炮
            $gangScore = 0;
            if(isset($game->perGang[$game->pao])){
                $gangScore = $game->perGang[$game->pao];
            }
            //杠上炮,杠点给胡家
            if($gangScore != 0){
                if($game->hujiaozhuanyi){
                    //处理多炮情况，平分杠分
                    if($game->isDuoPao > 1){
                        $gangScore /= $game->isDuoPao;
                    }
                    $gangScore = round($gangScore,2);
                    $fanData[$game->pao] -=$gangScore;
                    array_push($fanInfos[$game->pao][1],-$gangScore);
                    $fanData[$huUid] +=$gangScore;
                    array_push($fanInfos[$huUid][1],$gangScore);
                }else{
                    $fanData[$game->pao] -=$gangScore;
                    array_push($fanInfos[$game->pao][1],-$gangScore);
                    //返还被扣的分数
                    $beUids = $game->perGang['beUid'];
                    $beGangScore = $gangScore/count($beUids);
                    foreach ($beUids as $i=>$u) {
                        $fanData[$u] +=$beGangScore;
                        array_push($fanInfos[$u][1],$beGangScore);
                    }
                    $game->perGang = array();
                }
            }
            //杠上炮
            var_dump('杠上炮1番');
            $score *= 2;
            $fancount +=1;
        }
        $hasMj = $game->totalMj - $game->currentMj - $game->currentMj2;
        if($hasMj > 54){
            //最高番数，否则32倍
            var_dump('天地胡上限番');
            if($game->maxFan == -1){
                $score = 64;
                $fancount = 6;
            }else{
                $score = pow(2,$game->maxFan);
                $fancount = $game->maxFan;
            }

        }
        if($hasMj < 1){
            //海底捞
            var_dump('海底胡1番');
            $score *= 2;
            $fancount +=1;
        }
        //限制番
        if($game->maxFan != -1 && $fancount > $game->maxFan){
            $score = pow(2,$game->maxFan);
            $fancount = $game->maxFan;
        }
        //自摸加底
        if($type == 1 && $game->zimoType == 2){
            $score += 1;
        }

        if($type == 1){
            $tScore = 0;
            foreach($players as $index => $uid){
                if($uid == $huUid){
                    continue;
                }else if(!isset($game->alreadyHus[$uid])){
                    if($game->gangFlower == 2 && self::isGangKai($game,$huUid) && $game->gtype == 1){//点杠花当点炮只收一家(但是自摸算分值)
                        if($uid != $game->lastUid){
                            continue;
                        }
                    }
                    $fanData[$huUid] += $score;
                    $tScore+=$score;
                    $fanData[$uid] -= $score;
                    array_push($fanInfos[$uid][0],[-$score]);
                }
            }
            array_push($fanInfos[$huUid][0],[$tScore,1,$fancount]);
        }else{
            foreach($players as $index => $uid){
                if($uid == $huUid){
                    $fanData[$huUid] += $score;
                    array_push($fanInfos[$huUid][0],[$score,0,$fancount]);
                }else if($uid == $game->pao){
                    $fanData[$uid] -= $score;
                    array_push($fanInfos[$uid][0],[-$score]);
                }
            }
        }
        echo "after_hu!Score:".$score."\n";
        //记录胡牌次数
        if(isset($countData["1"])){
            $countData["1"] += 1;
        }else{
            $countData["1"] = 1;
        }

        $game->fanData = $fanData;
        $game->fanInfos = $fanInfos;
        $game->countData[$huUid] = $countData;
        return $game;
    }

    /**
     * 杠别人的牌（暗杠一家）
     * @param $game vo_MajiangGame
     * @param $room vo_Room
     * @return vo_MajiangGame
     */
    public static function gangOther($gangUid,$otherUid,$game,$room){
        $fanData = self::initFanData($game->fanData,$room);
        $fanInfos = self::initFanInfos($game->fanInfos,$room);
        $gangInfos = self::initGangInfos($game->gangInfos,$room);

        //杠+1   被杠的人扣1
        $fanData[$gangUid] += 2;
        array_push($fanInfos[$gangUid][1],2);
        $fanData[$otherUid] -= 2;
        array_push($fanInfos[$otherUid][1],-2);
        array_push($gangInfos[$gangUid],array(2,$otherUid));
        $game->perGang = array($gangUid=>2,'beUid'=>array($otherUid));
        //记录杠牌次数
        $countData = null;
        if(!isset($game->countData[$gangUid])){
            $countData = array();
        }else{
            $countData = $game->countData[$gangUid];
        }
        if(isset($countData["2"])){
            $countData["2"] += 1;
        }else{
            $countData["2"] = 1;
        }

        $game->fanData = $fanData;
        $game->fanInfos = $fanInfos;
        $game->gangInfos = $gangInfos;
        $game->countData[$gangUid] = $countData;

        return $game;
    }

    /**
     * 杠自己的牌(明杠三家)
     * @param $game vo_MajiangGame
     * @param $room vo_Room
     * @return vo_MajiangGame
     */
    public static function gangSelf($gangUid,$game,$room){
        $fanData = self::initFanData($game->fanData,$room);
        $fanInfos = self::initFanInfos($game->fanInfos,$room);
        $gangInfos = self::initGangInfos($game->gangInfos,$room);

        $players = $room->players;

        //明杠先碰牌然后摸到第四张+3 每家扣1
        foreach($players as $index => $uid){
            if($uid == $gangUid){
                continue;

            }else if(!isset($game->alreadyHus[$uid])){
                if(!isset($game->perGang[$gangUid])){
                    $game->perGang = array($gangUid=>1,'beUid'=>array($uid));
                    array_push($fanInfos[$gangUid][1],1);
                }else{
                    $game->perGang[$gangUid]+=1;
                    array_push($game->perGang['beUid'],$uid);
                    $count = count($fanInfos[$gangUid][1]);
                    $fanInfos[$gangUid][1][$count-1] +=1;
                }
                $fanData[$gangUid] += 1;
                $fanData[$uid] -= 1;
                array_push($fanInfos[$uid][1],-1);
                array_push($gangInfos[$gangUid],array(1,$uid));
            }
        }

        //记录明杠次数
        $countData = null;
        if(!isset($game->countData[$gangUid])){
            $countData = array();
        }else{
            $countData = $game->countData[$gangUid];
        }
        if(isset($countData["3"])){
            $countData["3"] += 1;
        }else{
            $countData["3"] = 1;
        }

        $game->fanData = $fanData;
        $game->fanInfos = $fanInfos;
        $game->gangInfos = $gangInfos;
        $game->countData[$gangUid] = $countData;
        return $game;
    }

    /**
     * 暗杠三家
     * @param $game vo_MajiangGame
     * @param $room vo_Room
     * @return vo_MajiangGame
     */
    public static function anGang($gangUid,$game,$room){
        $fanData = self::initFanData($game->fanData,$room);
        $fanInfos = self::initFanInfos($game->fanInfos,$room);
        $gangInfos = self::initGangInfos($game->gangInfos,$room);
        $players = $room->players;

        //暗杠+6 每家扣2
        foreach($players as $index => $uid){
            if($uid == $gangUid){
                continue;
            }else if(!isset($game->alreadyHus[$uid])){
                if(!isset($game->perGang[$gangUid])){
                    $game->perGang = array($gangUid=>2,'beUid'=>array($uid));
                    array_push($fanInfos[$gangUid][1],2);
                }else{
                    $game->perGang[$gangUid]+=2;
                    array_push($game->perGang['beUid'],$uid);
                    $count = count($fanInfos[$gangUid][1]);
                    $fanInfos[$gangUid][1][$count-1] +=2;
                }
                $fanData[$gangUid] += 2;
                $fanData[$uid] -= 2;
                array_push($fanInfos[$uid][1],-2);
                array_push($gangInfos[$gangUid],array(2,$uid));
            }
        }

        //记录暗杠次数
        $countData = null;
        if(!isset($game->countData[$gangUid])){
            $countData = array();
        }else{
            $countData = $game->countData[$gangUid];
        }
        if(isset($countData["4"])){
            $countData["4"] += 1;
        }else{
            $countData["4"] = 1;
        }

        $game->fanData = $fanData;
        $game->fanInfos = $fanInfos;
        $game->gangInfos = $gangInfos;
        $game->countData[$gangUid] = $countData;
        return $game;
    }

    /**
     * 初始化番数据
     * @param   $room   vo_Room
     * @return array
     */
    public static function initFanData($fanData,$room){
        if($fanData == null) $fanData = array();
        $players = $room->players;
        foreach($players as $index => $uid){
            if(!isset($fanData[$uid])) $fanData[$uid] = 0;
        }
        return $fanData;
    }

    /**
     * 初始化番数详细数据
     * @param $fanInfos
     * $fanInfos[$uid][index] -> index:0胡分 1杠分 2赔轿分 3花猪赔分
     * @param $room
     * @return array
     */
    public static function initFanInfos($fanInfos,$room){
        if($fanInfos == null) $fanInfos = array();
        $players = $room->players;
        foreach($players as $index => $uid){
            if(!isset($fanInfos[$uid])) $fanInfos[$uid] = array(array(),array(),array(),array());
        }
        return $fanInfos;
    }
    /**
     *记录杠金来源
     */
    public static function initGangInfos($gangInfos,$room){
        if($gangInfos == null) $gangInfos = array();
        $players = $room->players;
        foreach($players as $index => $uid){
            if(!isset($gangInfos[$uid])) $gangInfos[$uid] = array();
        }
        return $gangInfos;
    }

    /**
     * 检测脱搭
     * @param $mjList
     * @param $chiList
     * @param $pengList
     * @param $gangList
     * @param $angangList
     * @param $game vo_MajiangGame
     * @return bool
     */
    public static function isTuoDa($mjList,$chiList,$pengList,$gangList,$angangList,$game){
        $index = ArrayUtil::indexOf($mjList,$game->da2);
        if($index == -1){
            return false;
        }
        $baida = $game->da2;
        $game->da2 = 0;
        $val = MaJiangConstant::hu(-1,$mjList,$chiList,$pengList,$gangList,$angangList,$game,-1);
        $game->da2 = $baida;
        return $val;
    }

    /**
     * 检测跑搭
     * @param $mjList
     * @param $chiList
     * @param $pengList
     * @param $gangList
     * @param $angangList
     * @param $game vo_MajiangGame
     * @return bool
     */
    public static function isPaoDa($mjList,$chiList,$pengList,$gangList,$angangList,$game,$huMj){
        $index = ArrayUtil::indexOf($mjList,$game->da2);
        if($index == -1){
            return false;
        }
        $mjList = ArrayUtil::cloneArray($mjList);
        array_splice($mjList,$index,1);
        $index = ArrayUtil::indexOf($mjList,$huMj);
        array_splice($mjList,$index,1);
        $val = MaJiangConstant::hu(-1,$mjList,$chiList,$pengList,$gangList,$angangList,$game,-1);
        return $val;
    }

    /**
     * 检测杠开
     * @param $game vo_MajiangGame
     * @param $huUid
     * @return int
     */
    public static function isGangKai($game,$huUid){
        //杠开
        if($game->lOpUid == $huUid && $game->lOpVal == 3){
            return true;
        }
        return false;
    }
    /**
     * 检测杠炮
     * @param $game vo_MajiangGame
     * @param $huUid
     * @return int
     */
    public static function isGangPao($game){
        //杠上炮
        if($game->lOpUid == $game->pao && $game->lOpVal == 3){
            return true;
        }
        return false;
    }

    /*
     * 查叫
     * */
    public static function checkJiao($game,$room){
        $fanData = self::initFanData($game->fanData,$room);
        $fanInfos = self::initFanInfos($game->fanInfos,$room);
        $gangInfos = self::initGangInfos($game->gangInfos,$room);
        $players = $room->players;
        $jiaoData = array();
        foreach($players as $index=>$uid){
            if(isset($game->alreadyHus[$uid]))continue;//胡牌者不被查叫
            $pengList = $game->pengList[$uid];
            $gangList = $game->gangList[$uid];
            $angangList = $game->angangList[$uid];
            $mjList = MajiangDao::getPlayerMajiang($uid);
            $jiaoData[$uid] = -1;
            for($i=1;$i<=27;$i++){
                if(MaJiangConstant::hu($i,$mjList,null,$pengList,$gangList,$angangList,$game,$game->lackTypes[$uid])){
                    $f = MaJiangConstant::getBaseFan($i,$mjList,$pengList,$gangList,$angangList,$game);
                    if($jiaoData[$uid] < $f){
                        $jiaoData[$uid] = $f;
                    }
                }
            }
        }

        foreach($jiaoData as $uid=>$value){
            if($value != -1){
                continue;
            }else{
                foreach($players as $index=>$uid1){
                    //无叫赔有叫
                    if(isset($jiaoData[$uid1]) && $jiaoData[$uid1] != -1){
                        $score = pow(2,$jiaoData[$uid1]);
                        $fanData[$uid] -= $score;
                        array_push($fanInfos[$uid][2],-$score);
                        $fanData[$uid1] += $score;
                        array_push($fanInfos[$uid1][2],$score);
                    }
                }
                //无叫杠分不得
                if($gangInfos && isset($gangInfos[$uid])){
                    foreach ($gangInfos[$uid] as $index=>$val) {
                        $fanData[$uid] -= $val[0];//扣除所得
                        $fanData[$val[1]] += $val[0];//加回所扣
                        array_push($fanInfos[$uid][1],-$val[0]);
                        array_push($fanInfos[$val[1]][1],$val[0]);
                    }

                }

            }
        }
        $game->fanData = $fanData;
        $game->fanInfos = $fanInfos;
        return $game;
    }
    /*
     * 查花猪
     * */
    public static function checkHuaZhu($game,$room){
        $fanData = self::initFanData($game->fanData,$room);
        $fanInfos = self::initFanInfos($game->fanInfos,$room);
        $players = $room->players;
        $huaZhuData = array();
        foreach($players as $index=>$uid){
            if(isset($game->alreadyHus[$uid]))continue;//胡牌者不被查叫
            $mjList = MajiangDao::getPlayerMajiang($uid);
            $huaZhuData[$uid] = 0;
            foreach($mjList as $index1=>$mjVal){
                if(MaJiangConstant::isLackMj($mjVal,$game->lackTypes[$uid])){
                    $huaZhuData[$uid] = 1;
                    break;
                }
            }
        }
        //最高番数，否则6番
        $score = 1;
        if($game->maxFan == -1){
            $score = 64;
        }else{
            $score = pow(2,$game->maxFan);
        }

        //花猪赔全场
        foreach($huaZhuData as $uid=>$value){
            if($value == 0){
                continue;
            }else{
                foreach($players as $index=>$uid1){
                    if(!isset($huaZhuData[$uid1])||$huaZhuData[$uid1] == 0){
                        //不是花猪都有赔偿
                        $fanData[$uid] -= $score;
                        array_push($fanInfos[$uid][3],-$score);
                        $fanData[$uid1] += $score;
                        array_push($fanInfos[$uid1][3],$score);
                    }
                }
            }
        }
        $game->fanData = $fanData;
        $game->fanInfos = $fanInfos;
        return $game;
    }

}