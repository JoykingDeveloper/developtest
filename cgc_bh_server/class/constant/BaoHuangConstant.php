<?php

/**
 *
 * 保皇 constant
 *
 */
class BaoHuangConstant{

    /**
     * 创建游戏
     * @param $room vo_Room
     * @return vo_BaoHuangGame
     */
    public static function createGame($id,$ju,$room){
        $game = new vo_BaoHuangGame();
        $game->id = $id;
        $game->isStart = false;
        $game->maxCount = $ju;
        $game->currentCount = 1;
        $game->needRoomCard = 1;
        return $game;
    }

    /**
     * 获取游戏需要发送到客户端的 数据
     * @param $game vo_BaoHuangGame
     * @return array
     */
    public static function getGameSendMsg($game){
        $game2 = clone $game;
        unset($game2->cards);
        if($game2->isMingBao != 1){
            $game2->guardUid = null;
        }
        return $game2;
    }

    /**
     * 获取玩家卡牌信息和其他玩家卡牌数量
     * @param $game vo_BaoHuangGame
     * @param $uid string
     * @return array
     */
    public static function getCardsInfo($game,$uid){
        $cardsInfo = array();
        if(isset($game->cards[$uid])){
            $cardsInfo[$uid] = $game->cards[$uid];
            foreach($game->cards as $uid1 => $card){
                if($uid1 != $uid){
                    $cardsInfo[$uid1] = count($game->cards[$uid1]);
                }
            }
        }
        return $cardsInfo;
    }




    /**
     * 是否所有人都准备好了
     * @param $room vo_Room
     * @param $game vo_BaoHuangGame
     * @return bool
     */
    public static function isAllReady($room,$game){
        $players = $room->players;
        if(count($players) < 5){
            return false;
        }
        $readys = $game->ready;
        foreach($players as $index => $uid){
            if(!isset($readys[$uid])){
                return false;
            }
        }
        return true;
    }



    /**
     * 开始游戏
     * @param $game vo_BaoHuangGame
     * @param $room vo_Room
     * @return vo_BaoHuangGame
     */
    public static function startGame($game,$room){
        $game->cards = self::randCards($game->ready);
        foreach($game->ready as $uid=>$value){
            if(CardConstant::haveEmperorCard($game->cards[$uid])){
                $game->currentUid = $uid;
                $game->firstUid = $uid;
            }
            if(CardConstant::haveGuardCard($game->cards[$uid])){
                $game->guardUid = $uid;
            }
        }
        if($game->currentCount == 1){
            foreach($game->ready as $uid => $val){
                $game->money[$uid] = 0;
            }
            //消耗房卡
            ExtGameHelper::sendUseCard($room->id);
        }
        $game->currentState = 1;//发牌阶段
        $game->isQiangDu = -1;
        $game->isMingBao = -1;
        $game->times = 1;
        $game->emperorUid = null;
        $game->endQueues = null;
        $game->perUid = null;
        $game->outCards = null;
        return  $game;
    }

    /**
     * 发牌
     * @param $players array
     * @return array
     */
    public static function randCards($players){
        $cards = array();
        $randCards = CardConstant::randCards();

        //分别给玩家发17张牌
        $playerCards = array();
//        array_chunk($randCards, count($randCards)/5);
        $index = 0;
        foreach($randCards as $key=>$value){
            if(!isset($playerCards[$index])){
                $playerCards[$index] = array();
            }
            array_push($playerCards[$index],$value);
            $index++;
            if($index == 5){
                $index =0;
            }
        }
        $playersUid = array();
        foreach($players as $uid => $value){
            array_push($playersUid,$uid);
        }
        $count = count($playersUid);
        for($i = 0 ; $i<$count; $i++){
            $cards[$playersUid[$i]] = $playerCards[$i];
        }
        return $cards;
    }
    /*
     * 判断游戏是否结算，一次
     * **/
    public static function isStopGame($game){
        //分派
        $players = array();
        foreach($game->ready as $uid=>$value){
            if($uid == $game->emperorUid){
                $players[$uid] = 1;
            }else if($uid == $game->guardUid && $game->isQiangDu == 0){
                $players[$uid] = 1;
            }else{
                $players[$uid] = 0;
            }
        }
        $emperorWin = true;
        $otherWin = true;
        $otherCount = 0;
       foreach($players as $uid=>$value){
           if($game->isQiangDu == 1){
               if($game->emperorUid == $game->guardUid && $game->times == 1){
                   //暗独（保在皇手上）
                   if($value == 1 && isset($game->endQueues[$uid])){
                       $otherWin = false;
                       $emperorWin = true;
                       break;
                   }else if($value == 0 && isset($game->endQueues[$uid])){
                       //暗独其他走两个算赢
                       $otherCount++;
                       if($otherCount == 2){
                           $emperorWin = false;
                           $otherWin = true;
                           break;
                       }else{
                           $emperorWin = false;
                           $otherWin = false;
                       }
                   }
               }else{
                   //农名跑一个就赢
                   if($value == 1 && isset($game->endQueues[$uid])){
                       $otherWin = false;
                       break;
                   }
                   if($value == 0 && isset($game->endQueues[$uid])){
                       $emperorWin = false;
                       break;
                   }
               }

           }else{

               if($value == 1 && !isset($game->endQueues[$uid])){
                   $emperorWin = false;
               }else if($value == 0 && !isset($game->endQueues[$uid])){
                   $otherWin = false;
               }
           }

       }
        if($emperorWin || $otherWin){
            return true;
        }
        return false;
    }
    /**
     * 停止游戏
     * @param $winUid
     * @param $game vo_BaoHuangGame
     * @return vo_BaoHuangGame
     */
    public static function stopGame($game){
        //分派
        $players = array();
        foreach($game->ready as $uid=>$value){
            if($uid == $game->emperorUid){
                $players[$uid] = 1;
            }else if($uid == $game->guardUid && $game->isQiangDu == 0){
                $players[$uid] = 1;
            }else{
                $players[$uid] = 0;
            }
        }
        //结算分
        $emperorWin = true;
        $otherWin = true;
        $otherCount = 0;
        foreach($players as $uid=>$value){
            if($game->isQiangDu == 1){
                if($game->emperorUid == $game->guardUid && $game->times == 1){
                    //暗独（保在皇手上）
                    if($value == 1 && isset($game->endQueues[$uid])){
                        $otherWin = false;
                        break;
                    }
                    if($value == 0 && isset($game->endQueues[$uid])){
                        //暗独其他走两个算赢
                        $otherCount++;
                        if($otherCount == 2){
                            $emperorWin = false;
                            break;
                        }
                    }
                }else{
                    //农名跑一个就赢
                    if($value == 1 && isset($game->endQueues[$uid])){
                        $otherWin = false;
                        break;
                    }
                    if($value == 0 && isset($game->endQueues[$uid])){
                        $emperorWin = false;
                        break;
                    }
                }

            }else{

                if($value == 1 && !isset($game->endQueues[$uid])){
                    $emperorWin = false;
                }else if($value == 0 && !isset($game->endQueues[$uid])){
                    $otherWin = false;
                }
            }
        }
        $score = 0;
        //抢独
        if($game->isQiangDu == 1){
            if($game->emperorUid == $game->guardUid && $game->times == 1){//暗独
                foreach($game->endQueues as $uid=>$value){
                    if($players[$uid] == 1){
                        $score += $value;
                    }
                }
                $h_score = 12;
                if($emperorWin){
                    if($score == 1){
                        foreach($players as $uid=>$value){
                            if($uid == $game->emperorUid){
                                $game->money[$uid] += $h_score;
                            }else{
                                $game->money[$uid] -= $h_score/4;
                            }
                        }
                    }//跑第二是平
                }else if($otherWin){
                    foreach($players as $uid=>$value){
                        if($uid == $game->emperorUid){
                            $game->money[$uid] -= $h_score;
                        }else{
                            $game->money[$uid] += $h_score/4;
                        }
                    }
                }
            }else{
                $score1 = 6;
                foreach($players as $uid=>$value){
                    if($uid == $game->emperorUid){
                        $game->money[$uid] += ($emperorWin?$score1*4:-$score1*4);
                    }else{
                        $game->money[$uid] += ($emperorWin?-$score1:$score1);
                    }
                }
            }

        }else{
            $h_score = 0;
            $b_score = 0;


            if($emperorWin){
                foreach($game->endQueues as $uid=>$value){
                    if($players[$uid] == 1){
                        $score += $value;
                    }
                }
                if($score == 3){
                    $h_score = 5;
                    $b_score = 4;
                }else if($score == 4){
                    $h_score = 4;
                    $b_score = 2;
                }else if($score == 5){
                    $h_score = 2;
                    $b_score = 1;
                }//当$score为6是平局
                else if($score == 7){
                    //此处判断皇帝输
                    $h_score = -2;
                    $b_score = -1;
                }
                //是否加倍
                $h_score *= $game->times;
                $b_score *= $game->times;
                foreach($players as $uid=>$value){
                    if($uid == $game->emperorUid){
                        $game->money[$uid] += $h_score;
                    }else if($uid == $game->guardUid){
                        $game->money[$uid] += $b_score;
                    }else if(($h_score+$b_score)!=0){
                        $game->money[$uid] -= ($h_score+$b_score)/3;
                    }
                }
            }
            else if($otherWin){
                //革命赢
                foreach($game->endQueues as $uid=>$value){
                    if($players[$uid] == 0){
                        $score += $value;
                    }
                }
                if($score == 6){
                    $h_score = 5;
                    $b_score = 4;
                }else if($score == 7){
                    $h_score = 4;
                    $b_score = 2;
                }else if($score == 8){
                    $h_score = 2;
                    $b_score = 1;
                }//当$score为9是平局
                //是否加倍
                $h_score *= $game->times;
                $b_score *= $game->times;
                //治残
                $h_zhican = !isset($game->endQueues[$game->emperorUid]);
                $b_zhican = $game->times == 2 && !isset($game->endQueues[$game->guardUid]);

                foreach($players as $uid=>$value){
                    if($uid == $game->emperorUid){
                        $game->money[$uid] -= $h_score;
                        if($h_zhican){//皇帝没跑掉，额外减6分
                            $game->money[$uid] -= 6;
                        }
                    }else if($uid == $game->guardUid){
                        $game->money[$uid] -= $b_score;
                        if($b_zhican){//明宝时宝子没跑掉，额外减6分
                            $game->money[$uid] -= 6;
                        }
                    }else {
                        if(($h_score+$b_score)!=0){
                            $game->money[$uid] += ($h_score+$b_score)/3;
                        }
                        if($h_zhican){//皇帝没跑掉，额外得2分
                            $game->money[$uid] += 2;
                        }
                        if($b_zhican){//明宝时宝子没跑掉，额外得2分
                            $game->money[$uid] += 2;
                        }
                    }
                }

            }


        }
        $testScore = 0;
        foreach($game->money as $uid=>$money){
            $testScore += $money;
        }
        if($testScore != 0){
            echo "结算分数错误分析";
            echo json_encode($game);
        }
        $game->currentState = 0;
        $game->ready = array();
        $game->zaofan = array();
        $game->currentUid = null;
        $game->currentCount += 1;
        return  $game;
    }

}