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
     * @return vo_MajiangGame
     */
    public static function hu($huUid,$mjList,$game,$room,$hasGang = false){
        $fanData = self::initFanData($game->fanData,$room);
        $fanInfos = self::initFanInfos($game->fanInfos,$room);
        $players = $room->players;
        $countData = null;
        if(!isset($game->countData[$huUid])){
            $countData = array();
        }else{
            $countData = $game->countData[$huUid];
        }

        $score = 1;
        $chiList = $game->chiList[$huUid];
        $pengList = $game->pengList[$huUid];
        $gangList = $game->gangList[$huUid];
        $angangList = $game->angangList[$huUid];
        $huListStr = "";
        //大胡*2
        $dahus = array(new QingYise(),new PengPengHu(),new QiXiaoDui(),new JinGouDiao());
        $huStrs = array("清一色 ","碰碰胡 ","七小对 ","手把一 ");
        $qixiaoduiStrs = array(4=>"豪华七小对 ",8=>"双豪华七小对 ",16=>"三豪华七小对 ");
        /* @var $hu BaseHu */
        foreach($dahus as $index => $hu){
            $hu->game = $game;
            $add = $hu->checkType($mjList,$chiList,$pengList,$gangList,$angangList);
            LogTool::log($index."->".$add."\n");
            $score *= $add;
            if($add > 1){
                if($index == 2 && $add > 2){
                    $huListStr .= $qixiaoduiStrs[$add];
                }else{
                    $huListStr .= $huStrs[$index];
                }
            }
            if($index > 3){
                break;
            }
        }
        //自摸
//        if($game->pao == null){
//            $score *=2;
//            $fancount++;
//        }
        //海底楼
        if($game->currentMj > ($game->totalMj - 12 - 4)){
            $score *= 2;
            $huListStr .= "海底楼 ";
        }
        //杠开
        if($game->lOpUid == $huUid){
            if($game->lOpVal == 3){
                $score += 3;
                if($game->lianGang == 0){
                    $huListStr .= "杠开 ";
                }
            }
//            else if($game->lOpVal == 7){
//                $score += 2;
//                if($game->lianGang == 0){
//                    $huListStr .= "花开 ";
//                }
//            }
        }
        //杠杠开
        if($game->lOpUid == $huUid  && $game->lianGang == 1){
            if($game->lOpVal == 3){
                $score += 3;
                $huListStr .= "连杠开 ";
            }
//            else if($game->lOpVal == 7){
//                $score += 2;
//                $huListStr .= "连花开 ";
//            }
        }





        //每杠+1
//        $score += count($gangList);
//        $score += count($angangList);
        if($score == 0){
            LogTool::log("胡牌分数结算错误！");
        }
        if($game->pao == null){
            foreach($players as $index => $uid){
                if($uid == $huUid){
                    $fanData[$uid] += $score * 3;
                    $fanInfos[$uid][0] = $score * 3;
                }else{
                    $fanData[$uid] -= $score;
                    $fanInfos[$uid][0] = -$score;
                }
            }
        }else{
            $fanData[$huUid] += $score;
            $fanInfos[$huUid][0] = $score;
            $fanData[$game->pao] -= $score;
            $fanInfos[$game->pao][0] = -$score;
        }

        //记录自摸
        if($game->pao == null){
            if(isset($countData["1"])){
                $countData["1"]+= 1;
            }else{
                $countData["1"] = 1;
            }
        }else{
            //记录接炮
            if(isset($countData["2"])){
                $countData["2"]+= 1;
            }else{
                $countData["2"] = 1;
            }
        }
        //记录点炮
        if($game->pao != null){
            $paocountData = null;
            if(!isset($game->countData[$game->pao])){
                $paocountData = array();
            }else{
                $paocountData = $game->countData[$game->pao];
            }
            if(isset($paocountData["3"])){
                $paocountData["3"] += 1;
            }else{
                $paocountData["3"] = 1;
            }
            $game->countData[$game->pao] = $paocountData;
        }
        $game->huListStr = $huListStr;
        $game->fanData = $fanData;
        $game->fanInfos = $fanInfos;
        $game->countData[$huUid] = $countData;
        return $game;
    }

    /**
     * 杠别人的牌
     * @param $game vo_MajiangGame
     * @param $room vo_Room
     * @return vo_MajiangGame
     */
    public static function gangOther($gangUid,$otherUid,$game,$room){
        $fanData = self::initFanData($game->fanData,$room);
        $fanInfos = self::initFanInfos($game->fanInfos,$room);
        $fanData[$gangUid] += 1;
        $fanData[$otherUid] -= 1;
        $fanInfos[$gangUid][1] += 1;
        $fanInfos[$otherUid][1] -= 1;
        $game->fanData = $fanData;
        $game->fanInfos = $fanInfos;
        return $game;
    }

    /**
     * 杠自己的牌
     * @param $game vo_MajiangGame
     * @param $room vo_Room
     * @return vo_MajiangGame
     */
    public static function gangSelf($gangUid,$mjVal,$game,$room){
        $fanData = self::initFanData($game->fanData,$room);
        $fanInfos = self::initFanInfos($game->fanInfos,$room);
        $pengUid = $game->dp[$mjVal];
        $fanData[$gangUid] += 1;
        $fanData[$pengUid] -= 1;
        $fanInfos[$gangUid][1] += 1;
        $fanInfos[$pengUid][1] -= 1;
        $game->fanData = $fanData;
        $game->fanInfos = $fanInfos;
        return $game;
    }

    /**
     * 暗杠
     * @param $game vo_MajiangGame
     * @param $room vo_Room
     * @return vo_MajiangGame
     */
    public static function anGang($gangUid,$game,$room){
        $fanData = self::initFanData($game->fanData,$room);
        $fanInfos = self::initFanInfos($game->fanInfos,$room);
        $players = $room->players;
        foreach ($players as $index=>$uid) {
            if($uid == $gangUid){
                $fanData[$uid] +=3;
                $fanInfos[$uid][1] +=3;
            }else{
                $fanData[$uid] -= 1;
                $fanInfos[$uid][1] -= 1;
            }
        }
        $game->fanData = $fanData;
        $game->fanInfos = $fanInfos;
        return $game;
    }
    /*
     *流局杠分退还
     **/
    public static function tuiGang($game,$room){
        $fanData = self::initFanData($game->fanData,$room);
        $fanInfos = self::initFanInfos($game->fanInfos,$room);
        $players = $room->players;
        foreach ($players as $index=>$uid) {
            $score = $fanInfos[$uid][1];
            $fanData[$uid] -= $score;
            $fanInfos[$uid][1] = 0;
        }
        $game->fanData = $fanData;
        $game->fanInfos = $fanInfos;
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
     * @param $room
     * @return array
     */
    public static function initFanInfos($fanInfos,$room){
        if($fanInfos == null) $fanInfos = array();
        $players = $room->players;
        foreach($players as $index => $uid){
            if(!isset($fanInfos[$uid])) $fanInfos[$uid] = array(0,0);
        }
        return $fanInfos;
    }

}