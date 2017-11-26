<?php

/**
 *
 * 金花相关逻辑
 *
 * User: zmliu1
 * Date: 17/2/14
 * Time: 10:25
 */
class JinHuaService extends ExtGameRpcService{

    /**
     * 玩家登陆游戏服务器
     */
    public function loginGame($request){
        PlatformDao::saveSender($this->senderUid,$this->sender);
        PlatformDao::saveRole($this->senderRole);
        $uid = $this->senderUid;
        $game = JinHuaDao::getGame($this->room->id);
        $puslMsg = array('tag'=>'initGame','game'=>JinHuaConstant::getGameSendMsg($game));
        if(isset($game->see[$uid])){
            $cards = $game->cards;
            foreach($cards as $uid1 => $card){
                if($uid == $uid1){
                    $puslMsg['card'] = $cards[$uid1];
                    break;
                }
            }
        }
        ExtGameHelper::senderMessage(array($this->sender),$puslMsg);
    }

    /**
     * 玩家创建房间
     */
    public function createRoom($request){
        PlatformDao::saveSender($this->senderUid,$this->sender);
        PlatformDao::saveRole($this->senderRole);
        $createData = $request['createData'];
        $jushu = isset($createData['cardType']) ? ((int)($createData['cardType'])) : 6;
        if($jushu == 8){
            $jushu = 6;
        }else if($jushu == 16){
            $jushu = 12;
        }
        $game_id = $this->room->id;
        $game = JinHuaConstant::createGame($game_id,$jushu,$this->room);
        JinHuaDao::updateGame($game);
        ExtGameHelper::senderMessage(array($this->sender),array('tag'=>'initGame','game'=>JinHuaConstant::getGameSendMsg($game)));
        ExtGameHelper::sendGameCreate($this->room->id);
    }

    /**
     * 玩家加入房间
     */
    public function joinRoom($request){
        PlatformDao::saveSender($this->senderUid,$this->sender);
        PlatformDao::saveRole($this->senderRole);
        $game = JinHuaDao::getGame($this->room->id);
        ExtGameHelper::senderMessage(array($this->sender),array('tag'=>'initGame','game'=>JinHuaConstant::getGameSendMsg($game)));
    }

    /**
     * 玩家离开房间
     */
    public function leaveRoom($request){
        $leaveUid = $request["leaveUid"];
        $game =JinHuaDao::getGame($this->room->id);
        foreach($game->ready as $uid => $ready){
            if($uid == $leaveUid){
                unset($game->ready[$uid]);
            }
        }
        JinHuaDao::updateGame($game);
    }

    /**
     * 玩家投票 强制结束游戏
     */
    public function endGame($request){
        $room = $this->room;
        $game = JinHuaDao::getGame($room->id);
        $game->currentCount = $game->maxCount + 1;
        foreach($room->players as $index=>$uid){
            $game->money[$uid] += $game->currentMoney[$uid];
        }
        unset($game->currentMoney);
        $msg = array('tag'=>'endGame','game'=>JinHuaConstant::getGameSendMsg($game),'room'=>$room,'winUid'=>$game->lastWin);
        RoomConstant::pushMsgToRoom(null,$msg,$this->room,true);
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
        //记录游戏战绩
        ExtGameHelper::logScore($room->id,$data);
        //通知平台小游戏结束，可以退出房间了
        ExtGameHelper::sendGameOver($room->id);
        JinHuaDao::delGame($room->id);
    }

    /**
     * 玩家解散房间
     */
    public function disbandRoom($request){
        JinHuaDao::delGame($this->room->id);
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
    public function ready($request){
        $uid = $this->senderUid;
        $room = $this->room;
        $game = JinHuaDao::getGame($this->room->id);
        if($game->isStart) return;

        $game->ready[$uid] = 1;
        $isAllReady = JinHuaConstant::isAllReady($room,$game);
        if($isAllReady){
            $game = JinHuaConstant::startGame($game,$room);
        }
        JinHuaDao::updateGame($game);

        RoomConstant::pushMsgToRoom($uid,array('tag'=>'ready','uid'=>$uid),$room,true);
        if($isAllReady){
            //消耗房卡
            if($game->currentCount == 1){
                ExtGameHelper::sendUseCard($room->id);
            }
            ExtGameHelper::sendGameStart($room->id);
            $pushMsg = array('tag'=>'startGame','game'=>JinHuaConstant::getGameSendMsg($game));
            RoomConstant::pushMsgToRoom($uid,$pushMsg,$room,true);
        }
    }


    /**
     * 看牌
     */
    public function seeCard($request){
        $uid = $this->senderUid;
        $room = $this->room;
        $game = JinHuaDao::getGame($this->room->id);
        if(!$game->isStart) return;

        $cards = $game->cards;
        $reCards = null;
        foreach($cards as $uid1 => $card){
            if($uid == $uid1){
                $reCards = $cards[$uid1];
                break;
            }
        }

        $game->see[$uid] = 1;
        JinHuaDao::updateGame($game);

        $puslMsg = array('tag'=>'seeCard','sender'=>$uid);
        RoomConstant::pushMsgToRoom($uid,$puslMsg,$room);

        $puslMsg['cards'] = $reCards;
        ExtGameHelper::senderMessage(array($this->sender),$puslMsg);
    }

    /**
     * 下注
     * */
    public function useMoney($request){
        if(!$this->checkParams($request, array('moneyType'))) return;

        $uid = $this->senderUid;
        $room = $this->room;
        $game = JinHuaDao::getGame($this->room->id);
        $moneyType = (int)($request['moneyType']);
        $money = JinHuaConstant::getUseMoney($moneyType);

        //投注非法
        if($money == -1) return;
        //游戏没开始
        if(!$game->isStart) return;
        //不在这一盘游戏中
        if(!isset($game->ready[$uid])) return;
        //不是当前操作者
        if($game->currentUid != $uid) return;
        //下注不能小于台面的当前注
        if($moneyType < $game->lastMoneyType) return;
        //一局上限不能超过当前上限
        $limitMoney =count($room->players) * 50;
        if($game->allMoney > $limitMoney) return;

        $money = JinHuaConstant::getXiazhuMoney($uid,$game,$moneyType);
        $selfSee = isset($game->see[$uid]) ? 1 : 0;//自己是否看过牌
        $game->allMoney += $money;
        $game->currentMoney[$uid] += $money;
        $game->money[$uid] -= $money;
        $game->lastMoneyType = $moneyType;
        $game->lastMoney = ($money > $game->lastMoney) ? $money : $game->lastMoney;
        $game->lastSee = $selfSee;
        $game->currentUid = RoomConstant::getNextPlayer($uid,$room,$game);
        $game->operateCount++;
        JinHuaDao::updateGame($game);

        $pushMsg = array(
            'tag'=>'useMoney',
            'game'=>JinHuaConstant::getGameSendMsg($game),
            'sender'=>$uid
        );
        RoomConstant::pushMsgToRoom($uid,$pushMsg,$room,true);
    }

    /**
     * 弃牌
     */
    public function qipai($request){
        $uid = $this->senderUid;
        $room = $this->room;
        $game = JinHuaDao::getGame($this->room->id);

        //游戏没开始
        if(!$game->isStart) return;
        //不在这一盘游戏中
        if(!isset($game->ready[$uid])) return;
        //已经弃牌
        if(isset($game->giveup[$uid])) return;

        $game->giveup[$uid] = 1;
        if($uid == $game->currentUid){
            $game->currentUid = RoomConstant::getNextPlayer($uid,$room,$game);
        }
        $game->operateCount++;
        JinHuaDao::updateGame($game);

        $giveCount = count($game->giveup);
        $playCount = count($game->ready);

        if($playCount - $giveCount == 1){
            //弃牌之后只剩下一个人 那么结束游戏
            $winUid = null;
            $giveups = $game->giveup;
            $readys = $game->ready;
            foreach($readys as $tuid => $val){
                if(!isset($giveups[$tuid])){
                    $winUid = $tuid;
                    break;
                }
            }
            $game = JinHuaConstant::stopGame($winUid,$game,$room);
            JinHuaDao::updateGame($game);
            $msg = array('tag'=>'qipai','sender'=>$uid,'game'=>JinHuaConstant::getGameSendMsg($game),'room'=>$room,'winUid'=>$game->lastWin,'flag'=>'gameover');
            RoomConstant::pushMsgToRoom($uid,$msg,$room,true);
        }else{
            $msg = array('tag'=>'qipai','sender'=>$uid,'currentUid'=>$game->currentUid,'flag'=>'qipai');
            RoomConstant::pushMsgToRoom($uid,$msg,$room,true);
        }
        if($game->maxCount < $game->currentCount){
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
            //记录游戏战绩
            ExtGameHelper::logScore($room->id,$data);
            //通知平台小游戏结束，可以退出房间了
            ExtGameHelper::sendGameOver($room->id);
            JinHuaDao::delGame($room->id);
        }
    }

    /**
     * 开牌
     */
    public function kaipai($request){
        if(!$this->checkParams($request, array('targetUid'))) return;

        $targetUid = $request['targetUid'];
        $uid = $this->senderUid;
        $room = $this->room;
        $game = JinHuaDao::getGame($this->room->id);

        //游戏没开始
        if(!$game->isStart) return;
        //不在这一盘游戏中
        if(!isset($game->ready[$uid])) return;
        //不是当前操作者
        if($game->currentUid != $uid) return;
        if(!isset($game->ready[$targetUid]) || ($game->giveup[$targetUid])) return;

        $selfCards = $game->cards[$uid];
        $targetCards = $game->cards[$targetUid];

        $winUid = null;
        $bipaiJieguo = CardConstant::bipai($selfCards,$targetCards);
        if($bipaiJieguo == 1){
            $winUid = $uid;
        }else{
            $winUid = $targetUid;
        }

        if($winUid == $uid){
            $game->giveup[$targetUid] = 1;
        }else{
            $game->giveup[$uid] = 1;
        }

        $money = JinHuaConstant::getXiazhuMoney($uid,$game,$game->lastMoneyType);
        $selfSee = isset($game->see[$uid]) ? 1 : 0;//自己是否看过牌

        $game->allMoney += $money;
        $game->money[$uid] -= $money;
        $game->currentMoney[$uid] +=$money;
        $game->lastMoney = ($money > $game->lastMoney) ? $money : $game->lastMoney;
        $game->lastSee = $selfSee;
        $game->currentUid = RoomConstant::getNextPlayer($uid,$room,$game);
        $game->operateCount++;

        $giveCount = count($game->giveup);
        $playCount = count($game->ready);
        if($playCount - $giveCount == 1){
            //弃牌之后只剩下一个人 那么结束游戏
            $game = JinHuaConstant::stopGame($winUid,$game,$room);
            JinHuaDao::updateGame($game);
            $msg = array('tag'=>'kaipaiGameOver','game'=>$game,'room'=>$room,'sender'=>$uid,'targetUid'=>$targetUid,'winUid'=>$winUid,'senderCards'=>$selfCards,'targetCards'=>$targetCards);
            RoomConstant::pushMsgToRoom($uid,$msg,$room,true);
        }else{
            JinHuaDao::updateGame($game);
            $msg = array('tag'=>'kaipai','game'=>JinHuaConstant::getGameSendMsg($game),'sender'=>$uid,'targetUid'=>$targetUid,'winUid'=>$winUid);
            RoomConstant::pushMsgToRoom($uid,$msg,$room,true);
        }

        //这一局打完了
        if($game->maxCount < $game->currentCount){
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
            //记录游戏战绩
            ExtGameHelper::logScore($room->id,$data);
            //通知平台小游戏结束，可以退出房间了
            ExtGameHelper::sendGameOver($room->id);
            JinHuaDao::delGame($room->id);
        }
    }

}