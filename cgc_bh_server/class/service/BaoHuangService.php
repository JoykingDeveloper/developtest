<?php

/**
 *
 * 保皇相关逻辑
 *
 */
class BaoHuangService extends ExtGameRpcService{

    /**
     * 玩家登陆游戏服务器
     */
    public function loginGame($request){
        PlatformDao::saveSender($this->senderUid,$this->sender);
        PlatformDao::saveRole($this->senderRole);
        $uid = $this->senderUid;
        $game = BaoHuangDao::getGame($this->room->id);
        $cardsInfo = BaoHuangConstant::getCardsInfo($game,$uid);
        $puslMsg = array('tag'=>'initGame','game'=>BaoHuangConstant::getGameSendMsg($game),'cardsInfo'=>$cardsInfo);
        ExtGameHelper::senderMessage(array($this->sender),$puslMsg);
    }

    /**
     * 玩家创建房间
     */
    public function createRoom($request){
        PlatformDao::saveSender($this->senderUid,$this->sender);
        PlatformDao::saveRole($this->senderRole);
        $createData = $request['createData'];
        $ju = $createData['cardType'];
        $ju = $ju == 4?3:6;
        $game_id = $this->room->id;
        $game = BaoHuangDao::getGame($this->room->id);
        if($game == null){
            $game = BaoHuangConstant::createGame($game_id,$ju,$this->room);
        }else{
            echo "游戏已经存在:".DateUtil::makeTime();
        }
        BaoHuangDao::updateGame($game);
        ExtGameHelper::senderMessage(array($this->sender),array('tag'=>'initGame','game'=>BaoHuangConstant::getGameSendMsg($game)));
    }

    /**
     * 玩家加入房间
     */
    public function joinRoom($request){
        PlatformDao::saveSender($this->senderUid,$this->sender);
        PlatformDao::saveRole($this->senderRole);
        $game = BaoHuangDao::getGame($this->room->id);
        ExtGameHelper::senderMessage(array($this->sender),array('tag'=>'initGame','game'=>BaoHuangConstant::getGameSendMsg($game)));
    }

    /**
     * 玩家离开房间
     */
    public function leaveRoom($request){
        $leaveUid = $request["leaveUid"];
        $game = BaoHuangDao::getGame($this->room->id);
        foreach($game->ready as $uid => $ready){
            if($uid == $leaveUid){
                unset($game->ready[$uid]);
            }
        }
        BaoHuangDao::updateGame($game);
    }

    /**
     * 玩家投票 强制结束游戏
     */
    public function endGame($request){
        $room = $this->room;
        $game = BaoHuangDao::getGame($room->id);
        $log = "endGame:" .DateUtil::makeTime(). "\n" . json_encode($game) . "\n";
        LogTool::log($log);
        $game->currentCount = $game->maxCount + 1;

        $msg = array('tag'=>'endGame','game'=>BaoHuangConstant::getGameSendMsg($game),'room'=>$room);
        RoomConstant::pushMsgToRoom(null,$msg,$this->room,true);

        //记录游戏战绩
        $data = array();
        $maxMoney = max($game->money);
        foreach($game->money as $uid => $money){
            $role = PlatformDao::getRole($uid);
            $data["zhanji"][$role->name] = $money;
            if($maxMoney == $money){
                $data["winnerUid"] = $uid;
            }
        }
        $data["fanghao"] = $room->id;
        $data["time"] = date("Y-m-d H:i:s");
        ExtGameHelper::logScore($room->id,$data);

        //通知平台小游戏结束，可以退出房间了
        ExtGameHelper::sendGameOver($room->id);
        BaoHuangDao::delGame($room->id);
    }

    /**
     * 玩家解散房间
     */
    public function disbandRoom($request){
        BaoHuangDao::delGame($this->room->id);
    }

    /**
     * 玩家像游戏房间发送消息
     */
    public function gameMessage($request){
        if(!isset($request['tag'])) return;
        $tag = $request['tag'];
        $this->$tag($request);
    }
    /**
     * 准备
     */
    public function ready(){
        $uid = $this->senderUid;
        $room = $this->room;
        $game = BaoHuangDao::getGame($this->room->id);
        if($game->currentState != 0) return;
        $game->ready[$uid] = 1;
        $isAllReady = BaoHuangConstant::isAllReady($room,$game);
        if($isAllReady){
            $game = BaoHuangConstant::startGame($game,$room);
        }
        BaoHuangDao::updateGame($game);
        RoomConstant::pushMsgToRoom($uid,array('tag'=>'ready','uid'=>$uid),$room,true);
        if($isAllReady){
            ExtGameHelper::sendGameStart($room->id);
            //获取玩家卡牌信息和其他玩家卡牌数量
            $pushMsg = array('tag'=>'startGame','game'=>BaoHuangConstant::getGameSendMsg($game));
            RoomConstant::pushMsgToRoomByUid($uid,$pushMsg,$room,$game,true);

        }
    }
    /*
     * 登基
     * **/
    public function dengji($request){
        if(!$this->checkParams($request, array('isdengji'))) return;
        $isdengji = $request["isdengji"];
        $uid = $this->senderUid;
        $room = $this->room;
        $game = BaoHuangDao::getGame($this->room->id);
        //如果有人造反（抢皇帝）
        $qUid = RoomConstant::getPerPlayer($game->currentUid,$this->room,$game);
        for($i=0;$i<4;$i++){
            if($game->zaofan[$qUid] == 1){//造反
                if($isdengji == 1){//登基，我独
                    $game->emperorUid = $uid;
                }else{//让位，他独
                    $game->emperorUid = $qUid;
                    $game->currentUid = $qUid;
                }
                $game->isQiangDu = 1;
                $game->isMingBao = 1;
                $game->times = 2;
                $game->currentState = 3;
                break;
            }else{
                $qUid = RoomConstant::getPerPlayer($qUid,$this->room,$game);
            }
        }
        BaoHuangDao::updateGame($game);
        if($game->currentState == 3){
            $pushMsg = array('tag'=>'dengji','sender'=>$uid,'game'=>BaoHuangConstant::getGameSendMsg($game));
            RoomConstant::pushMsgToRoomByUid($uid,$pushMsg,$room,$game,true);
            return;//直接给抢皇帝的人
        }
        //没人造反，正常让位或者登基
        if($isdengji == 1){
            //如果不是第一个操作者，有保的不能登基
            if($game->guardUid == $uid && $game->firstUid != $uid){
                //这里前端处理，必须让位
                return;
            }
            //登基
            $game->emperorUid = $uid;
            $isAnDu = false;
            if($game->emperorUid == $game->guardUid){
                //此处选择是明独还是暗独，通知
                $game->isQiangDu = 1;
                $isAnDu = true;
            }
            BaoHuangDao::updateGame($game);
            $pushMsg = array('tag'=>'dengji','sender'=>$uid,'game'=>BaoHuangConstant::getGameSendMsg($game),'isanDu'=>$isAnDu);
            RoomConstant::pushMsgToRoomByUid($uid,$pushMsg,$room,$game,true);
        }else{
            //让位
            $perUid = RoomConstant::getPerPlayer($uid,$room,$game);
            //取出皇牌
            foreach($game->cards[$uid] as $key=>$value){
                if($value[0] == 1 && $value[1] == 17){
                    unset($game->cards[$uid][$key]);
                }
            }
            if($game->cards[$uid] != null){
                $game->cards[$uid] = array_values($game->cards[$uid]);
            }
            //皇牌加入到下一位
            array_push($game->cards[$perUid],array(1,17));
            //设置当前操作者
            $game->currentUid = $perUid;
            //轮到一圈了，由第一操作者登基
            if($game->firstUid == $perUid){
                $game->emperorUid = $perUid;
            }
            //让位的皇帝不能废保抢独
            $game->isQiangDu = 0;
            BaoHuangDao::updateGame($game);
            $pushMsg = array('tag'=>'dengji','sender'=>$uid,'game'=>BaoHuangConstant::getGameSendMsg($game));
            RoomConstant::pushMsgToRoomByUid($uid,$pushMsg,$room,$game,true);
        }
    }
    /*
     * 明保
     * **/
    public function mingbao($request){
        if(!$this->checkParams($request, array('ismingbao'))) return;
        $ismingbao = $request["ismingbao"];
        $uid = $this->senderUid;
        $room = $this->room;
        $game = BaoHuangDao::getGame($this->room->id);
        //该玩家没有保牌
        if(!CardConstant::haveGuardCard($game->cards[$uid])){
            return;
        }
        if($game->emperorUid == null){
            //前端处理，没有确定皇帝，不选择是否明保
            return;
        }
        //皇保不一家，选择独必须选择明保
        if($game->isQiangDu == 1 && !CardConstant::haveEmperorCard($game->cards[$uid])){
            $ismingbao = 1;
        }
        $game->isMingBao = $ismingbao;
        $game->times = $ismingbao==1?2:1;
        BaoHuangDao::updateGame($game);
        $pushMsg = array('tag'=>'mingbao','sender'=>$uid,'isMingBao'=>$ismingbao);

        if($game->isMingBao != -1 && $game->isQiangDu !=-1){
            $pushMsg["currentState"] = 3;
            $game->currentState = 3;
            BaoHuangDao::updateGame($game);
        }
        RoomConstant::pushMsgToRoom(null,$pushMsg,$room,true);
    }
    /*
     * 抢独(废保)
     * **/
    public function qiangdu($request){
        if(!$this->checkParams($request, array('isqiangdu'))) return;
        $isqiangdu = $request["isqiangdu"];
        $uid = $this->senderUid;
        $game = BaoHuangDao::getGame($this->room->id);
        $game->isQiangDu = $isqiangdu;
        if($isqiangdu == 1){
            $game->isMingBao = 1;
            $game->times = 2;
        }
        BaoHuangDao::updateGame($game);
        $pushMsg = array('tag'=>'qiangdu','sender'=>$uid,'isQiangDu'=>$isqiangdu);
        if($game->isMingBao != -1 && $game->isQiangDu !=-1){
            $pushMsg["currentState"] = 3;
            $game->currentState = 3;
            BaoHuangDao::updateGame($game);
        }
        RoomConstant::pushMsgToRoom(null,$pushMsg,$this->room,true);
    }
    /*
     * 造反(抢皇帝)
     * **/
    public function zaofan($request){
        if(!$this->checkParams($request, array('iszaofan'))) return;
        $iszaofan = $request["iszaofan"];
        $uid = $this->senderUid;
        $game = BaoHuangDao::getGame($this->room->id);
        if( $game->zaofan != null && isset($game->zaofan[$uid]))return;//已经选择过
        $game->zaofan[$uid] = $iszaofan;
        BaoHuangDao::updateGame($game);
        $pushMsg = array('tag'=>'zaofan','sender'=>$uid,'zaofan'=>$game->zaofan);
        if(count($game->zaofan) == 4){
            $game->currentState = 2;
            BaoHuangDao::updateGame($game);
            $pushMsg["currentState"] = $game->currentState;
        }
        RoomConstant::pushMsgToRoom(null,$pushMsg,$this->room,true);
    }
    /**
     * 出牌
     */
    public function chupai($request){
        if(!$this->checkParams($request, array('outCards'))) return;
        $outCadrs = $request["outCards"];
        //如果出牌为空
        if($outCadrs == null) return;
        $outCadrs = CardConstant::sortCards($outCadrs,false);
        //所出牌型不合理
        if(!CardConstant::isRightOfCards($outCadrs)) return;
        $uid = $this->senderUid;
        $room = $this->room;
        $game = BaoHuangDao::getGame($this->room->id);
        //不是当前操作者
        if($game->currentUid != $uid) return;
        //是否是出牌阶段
        if($game->currentState != 3) return;
        //判断手牌中是否有所出的牌
        if(!ArrayUtil::containsArrayValue($game->cards[$uid],$outCadrs)){
            return;
        }
        //获得上一次出牌信息
        if($game->outCards != null){
            $outCardsUid = array_keys($game->outCards);
            //上一次的出牌者不是自己
            if($uid != $outCardsUid[0]){
                $perOutCards = $game->outCards[$outCardsUid[0]];
                $cards1 = CardConstant::sortCards($outCadrs,false);
                $cards2 = CardConstant::sortCards($perOutCards,false);
                $result = CardConstant::compare2Cards($cards1,$cards2);
                //所出的牌小，或者牌型不合理
                if(!$result)  return;
            }
        }
        $game->perUid = $uid;
        $nextUid = RoomConstant::getNextPlayer($uid,$room,$game);
        for($i = 0;$i<5;$i++){
            if($game->cards[$nextUid] == null){
                $nextUid = RoomConstant::getNextPlayer($nextUid,$room,$game);
            }else{
                break;
            }
        }
        $game->currentUid = $nextUid;
        //替换上一次出牌信息
        if($game ->outCards != null){
            unset($game ->outCards);
        }
        $game ->outCards[$uid] = $outCadrs;
        //打出保牌明保，但是不加倍
        if(CardConstant::haveGuardCard($outCadrs)){
            $game->isMingBao = 1;
        }
        //手牌去除所出的牌
        foreach($outCadrs as $key => $value){
            $index = array_search($value,$game->cards[$uid]);
            if($index === false){
                LogTool::log("DeleteNullElement");
                return;
            }else{
                array_splice($game->cards[$uid],$index,1);
            }
        }

        BaoHuangDao::updateGame($game);
        $pushMsg = array('tag'=>'chupai','sender'=>$uid,'game'=>BaoHuangConstant::getGameSendMsg($game));
       //如果一方出牌之后没有牌了，那么游戏结束
        $pushMsg1 = null;
        if($game->cards[$uid] == null){
            if($game->endQueues == null){
                $game->endQueues = array($uid=>1);
            }else if(!isset($game->endQueues[$uid])){
                $game->endQueues[$uid] = count($game->endQueues)+1;
            }
            if(BaoHuangConstant::isStopGame($game)){
                //非暗独情况下没有明保
                if($game->isQiangDu == 1 && $game->emperorUid != $game->guardUid && $game->isMingBao != 1){
                    echo "Error_Time:".DateUtil::makeTime()."Game:".json_encode($game)."\n";
                }
                $game = BaoHuangConstant::stopGame($game);
                $pushMsg1 = array('tag'=>'GameOver','game'=>$game,'room'=>$room);
            }
            BaoHuangDao::updateGame($game);
        }
        if($pushMsg1 != null){
            $pushMsg['endData'] = $pushMsg1;
        }

        RoomConstant::pushMsgToRoomByUid($uid,$pushMsg,$room,$game,true);
        //这一局打完了
        if($game->maxCount < $game->currentCount){

            //记录游戏战绩
            $data = array();
            $maxMoney = max($game->money);
            foreach($game->money as $uid => $money){
                $role = PlatformDao::getRole($uid);
                $data["zhanji"][$role->name] = $money;
                if($maxMoney == $money){
                    $data["winnerUid"] = $uid;
                }
            }
            $data["fanghao"] = $room->id;
            $data["time"] = date("Y-m-d H:i");
            ExtGameHelper::logScore($room->id,$data);
            //通知平台小游戏结束，可以退出房间了
            ExtGameHelper::sendGameOver($room->id);
            BaoHuangDao::delGame($room->id);
        }
    }

    /**
     * 不出
     */
    public function buchu(){
        $uid = $this->senderUid;
        $room = $this->room;
        $game = BaoHuangDao::getGame($this->room->id);
        //不是当前操作者
        if($game->currentUid != $uid) return;
        $game->perUid = $uid;
        $outCardsUid = null;
        if($game->outCards != null){
            $outCardsUid = array_keys($game->outCards)[0];
        }

        $msg = array('tag'=>'buchu','sender'=>$uid);
        $nextUid = RoomConstant::getNextPlayer($uid,$room,$game);
        for($i = 0;$i<5;$i++){
            if($game->cards[$nextUid] == null){
                if($outCardsUid == $nextUid){
                    $msg["clearOutCards"] = 1;
                    $game->outCards = null;
                }
                $nextUid = RoomConstant::getNextPlayer($nextUid,$room,$game);

            }else{
                break;
            }
        }
        $game->currentUid = $nextUid;
        $msg['currentUid'] = $game->currentUid;
        BaoHuangDao::updateGame($game);
        RoomConstant::pushMsgToRoom($uid,$msg,$room,true);
    }

}