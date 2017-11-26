<?php

/**
 *
 * 麻将相关逻辑
 *
 * User: zmliu1
 * Date: 17/2/23
 * Time: 14:06
 */
class MajiangService extends ExtGameRpcService{

    /**
     * 玩家登陆游戏服务器
     */
    public function loginGame($request){
        PlatformDao::saveSender($this->senderUid,$this->sender);
        PlatformDao::saveRole($this->senderRole);

        $uid = $this->senderUid;
        $game = MajiangDao::getMajiangGame($this->room->id);
        $mjList = MajiangDao::getPlayerMajiang($uid);
        $opList = MajiangDao::getOperating($this->room->id);
        $qianggangOpList = MajiangDao::getQiangGangOperating($this->room->id);
        $needShowOp = false;
        $isQiangGang = false;
        if (!$game->chupai && (!isset($opList[$uid]) || !isset($qianggangOpList[$uid]))){
            $needShowOp = true;
            if(count($qianggangOpList) > 0){
                $isQiangGang = true;
            }
        }
        $newMj = -1;
        if($game->chupai && $game->currentUid == $uid){
            $newMj = $game->newMj;
        }
        /* @var $sendGameData vo_MajiangGame */
        $sendGameData = MjGameConstant::getGameSendMsg($game);
        $sendGameData->newMj = $newMj;
        $puslMsg = array('tag'=>'initGame','game'=>$sendGameData,'mjList'=>$mjList,'opList'=>$opList,'needShowOp'=>$needShowOp,'isQiangGang'=>$isQiangGang);
        ExtGameHelper::senderMessage(array($this->sender),$puslMsg);
    }

    /**
     * 玩家创建房间
     */
    public function createRoom($request){
        PlatformDao::saveSender($this->senderUid,$this->sender);
        PlatformDao::saveRole($this->senderRole);

        $createData = $request['createData'];
        $jushu = 8;//isset($createData['cardType']) ? ((int)($createData['cardType'])) : 8;
        $feng = isset($createData['feng']) ? ((int)$createData['feng']) : 0;

        $game = MjGameConstant::createGame($this->room,$jushu,$feng);
        MajiangDao::updateMajiangGame($game);
        ExtGameHelper::senderMessage(array($this->sender),array('tag'=>'initGame','game'=>MjGameConstant::getGameSendMsg($game),'needShowOp'=>false));
        ExtGameHelper::sendGameCreate($this->room->id);
    }

    /**
     * 玩家加入房间
     */
    public function joinRoom($request){
        PlatformDao::saveSender($this->senderUid,$this->sender);
        PlatformDao::saveRole($this->senderRole);

        $game = MajiangDao::getMajiangGame($this->room->id);
        ExtGameHelper::senderMessage(array($this->sender),array('tag'=>'initGame','game'=>MjGameConstant::getGameSendMsg($game)));
    }

    /**
     * 玩家离开房间
     */
    public function leaveRoom($request){}

    /**
     * 玩家投票 强制结束游戏
     */
    public function endGame($request){
        $game = MajiangDao::getMajiangGame($this->room->id);
        $this->checkGameOver($game,true);

        $msg = array('tag'=>'endGame');
        RoomConstant::pushMsgToRoom(null,$msg,$this->room,true);
    }

    /**
     * 玩家解散房间
     */
    public function disbandRoom($request){
        MajiangDao::delMajiangGame($this->room->id);
        MajiangDao::delPlayerMajiangByRoom($this->room);
        MajiangDao::clearOperating($this->room->id);
        MajiangDao::clearQiangGangOperating($this->room->id);
    }

    /**
     * 玩家像游戏房间发送消息
     */
    public function gameMessage($request){
        if(!isset($request['tag'])) return;
        $tag = $request['tag'];
        if(method_exists($this,$tag)){
            $this->$tag($request);
        }
    }

    /**
     * 准备
     */
    public function ready($request){
        $uid = $this->senderUid;
        $room = $this->room;
        $game = MajiangDao::getMajiangGame($this->room->id);
        if($game->isStart) return;

        $game->ready[$uid] = 1;
        $isAllReady = MjGameConstant::isAllReady($room,$game);
        $mjLists = null;
        if($isAllReady){
            MajiangDao::delPlayerMajiangByRoom($this->room);
            MajiangDao::clearOperating($this->room->id);
            MajiangDao::clearQiangGangOperating($this->room->id);
            if($game->currentCount == 1) {
                ExtGameHelper::sendGameStart($room->id);
                ExtGameHelper::sendUseCard($room->id);
            }

            $result = MjGameConstant::startGame($room,$game);
            $game = $result[0];
            $mjLists = $result[1];
            foreach($mjLists as $uid2 => $list){
                MajiangDao::updatePlayerMajiang($uid2,$list);
            }
        }
        MajiangDao::updateMajiangGame($game);

        RoomConstant::pushMsgToRoom($uid,array('tag'=>'ready','uid'=>$uid),$room,true);
        if($isAllReady){
            $pushMsg = array('tag'=>'startGame','game'=>MjGameConstant::getGameSendMsg($game));
            foreach($mjLists as $uid2 => $list){
                $pushMsg['mjList'] = $list;
                $senderInfo = PlatformDao::getSender($uid2);
                ExtGameHelper::senderMessage(array($senderInfo),$pushMsg);
            }
        }
    }

    /**
     * 出牌
     */
    public function chupai($request){
        if(!$this->checkParams($request, array('mjVal'))) return;

        $mjVal = (int)$request['mjVal'];
        $uid = $this->senderUid;
        $room = $this->room;
        $game = MajiangDao::getMajiangGame($this->room->id);

        //游戏没开始
        if(!$game->isStart) return;
        //当前不是你出牌
        if($game->currentUid != $uid) return;
        //当前不能出牌
        if(!$game->chupai) return;

        $mjList = MajiangDao::getPlayerMajiang($uid);
        if(!ArrayUtil::contains($mjList,$mjVal)) return;//出了一张没有的牌
        //出牌了就不能扭牌了
        if($game->niuList[$uid][0][0] == -1){
            $game->niuList[$uid][0][0] = 0;
        }
        $mjList = ArrayUtil::removeValue($mjList,$mjVal);
        MajiangDao::updatePlayerMajiang($uid,$mjList);

        $game->lastUid = $uid;
        $game->lastMj = $mjVal;
        $game->chupai = false;
        $game->isniupai = false;
        $game->canHu = true;
        $chupaiList = isset($game->chupaiList[$uid]) ? $game->chupaiList[$uid] : array();
        array_push($chupaiList,$mjVal);
        $game->chupaiList[$uid] = $chupaiList;
        if(isset($game->chupaiCount[$uid]))$game->chupaiCount[$uid] += 1; else $game->chupaiCount[$uid] = 1;
        if(isset($request['ting'])){
            $game->ting[$uid] = $request['ting'];
        }
        $game->lianGang = 0;
        unset($game->guohu[$uid]);
        if($game->niuList[$uid][0][0] == -1){
            $game->niuList[$uid][0][0] = 0;
        }
        MajiangDao::updateMajiangGame($game);

        $pushMsg = array('tag'=>'chupai','sender'=>$uid,'mjVal'=>$mjVal,'game'=>MjGameConstant::getGameSendMsg($game));
        if(isset($request['ting'])){
            $pushMsg['ting'] = $request['ting'];
        }
        RoomConstant::pushMsgToRoom($uid,$pushMsg,$room,true);
    }

    /**
     * 自摸
     */
    public function zimo($request){
        $uid = $this->senderUid;
        $room = $this->room;
        $game = MajiangDao::getMajiangGame($this->room->id);

        //游戏没开始
        if(!$game->isStart) {
            echo "zimo error 1\n";
            return;
        }
        //当前不是出牌阶段
        if(!$game->chupai) {
            echo "zimo error 2\n";
            return;
        }
        //当前出牌的人才能自摸
        if($game->currentUid != $uid) {
            echo "zimo error 3\n";
            return;
        }

        $mjList = MajiangDao::getPlayerMajiang($uid);
        /** @var $hu bool*/
        $hu = MaJiangConstant::hu(-1,$mjList,
            isset($game->chiList[$uid]) ? $game->chiList[$uid] : null,
            isset($game->pengList[$uid]) ? $game->pengList[$uid] : null,
            isset($game->gangList[$uid]) ? $game->gangList[$uid] : null,
            isset($game->angangList[$uid]) ? $game->angangList[$uid] : null
        ,$game);
        if(!$hu) {
            echo json_encode($mjList) . "\n";
            echo "zimo error 3\n";
            return;
        }

        $game = SuanFanConstant::hu($uid,$mjList,$game,$room);
        $game = MjGameConstant::stopGame($room,$game,$uid);
        MajiangDao::updateMajiangGame($game);

        $gameSendData = MjGameConstant::getGameSendMsg($game);
        $gameSendData->newMj = $game->newMj;
        $pushMsg = array('tag'=>'hupai','sender'=>$uid,'opVal'=>5,'game'=>$gameSendData,'allMjs'=>MajiangDao::getRoomPlayerMajiangs($room),'_158'=>array());
        RoomConstant::pushMsgToRoom($uid,$pushMsg,$room,true);
        $this->checkGameOver($game);
    }
    /**
     * 扭牌
     */
    public function niuSelf($request){
        if(!$this->checkParams($request, array('mjVals'))) return;

//        $mjVal = (int)$request['mjVal'];
        $mjVals = $request['mjVals'];
        $uid = $this->senderUid;
        $room = $this->room;
        $game = MajiangDao::getMajiangGame($this->room->id);
        //不是当前操作者
        if($uid != $game->currentUid){
            return;
        }

        $mjList = MajiangDao::getPlayerMajiang($uid);
        if($mjVals == null || count($mjVals) < 1){
            return;
        }
        $niuGroupList = $game->niuList[$uid][0];
        $chupaiCount = isset($game->chupaiCount[$uid])?$game->chupaiCount[$uid]:0;
        //摸第一张牌决定是否扭牌(没有出过牌，mjVals长度大于1)
        if($chupaiCount == 0 && count($mjVals) > 1){

            //达不到扭牌条件
            if(!MaJiangConstant::checkStartNiu($game,$mjList,$mjVals))return;
            //已经包含该组合
            if(MaJiangConstant::checkNiuGroupContains($niuGroupList,$mjVals))return;
            //选择是否扭牌
            if(count($niuGroupList) > 1){
                foreach($mjVals as $i=>$mj){
                    array_push($niuGroupList,$mj);
                }
                $game->niuList[$uid][0] = $niuGroupList;
            }else{
                $game->niuList[$uid][0] = $mjVals;
            }

            $getNewMj = false;
            $newMj = -1;
            if($mjVals[0] != 0){
                //删除开始扭牌的麻将组
                $len = count($mjVals);
                for($i = 0 ;$i < $len;$i++){
                    $index = ArrayUtil::indexOf($mjList,$mjVals[$i]);
                    if($index != -1){
                        array_splice($mjList,$index,1);
                    }
                }
                //如果有东南西北需要补一张牌
                if($len%3 != 0){
                    $getNewMj = true;
                    $newMj = MaJiangConstant::getNewMj($game,7);
                    array_push($mjList,$newMj);
                }
                MajiangDao::updatePlayerMajiang($uid,$mjList);
                $mjCount = isset($game->mjCount[$uid])?$game->mjCount[$uid]:13;
                $game->mjCount[$uid] = $mjCount - $len + ($getNewMj?1:0);

            }
            MajiangDao::updateMajiangGame($game);
            //通知前端扭牌情况，更新界面
            $pushMsg = array('tag'=>'chooseNiu','sender'=>$uid,'niuVal'=>$mjVals,'isNewMj'=>$getNewMj,'isGroup'=>true,'game'=>MjGameConstant::getGameSendMsg($game));
            RoomConstant::pushMsgToRoom($uid,$pushMsg,$room);
            if($mjVals[0] != 0){
                $pushMsg["mjList"] = $mjList;
                if($getNewMj)
                    $pushMsg['newMjVal'] = $newMj;
            }
            ExtGameHelper::senderMessage(array($this->sender),$pushMsg);
            return;
        }
        $mjVal = $mjVals[0];
        //没有牌了不能扭牌
        if(!MjGameConstant::hasMj($game)){
            return;
        }
        //不是当前操作者
        if($game->currentUid != $uid)return;
        //没有扭牌资格
        if($niuGroupList[0] == 0)return;
        //不是可扭的牌
        if(!MaJiangConstant::checkNiu($niuGroupList,$mjVal,$game))return;

        $niuList = $game->niuList[$uid];
        //没有该手牌 不能扭
        if(ArrayUtil::indexOf($mjList,$mjVal) == -1) return;
        $game->lastUid = $uid;
        $game->lastMj = $mjVal;
        $game->chupai = false;
        $game->isniupai = true;
        $game->canHu = true;

        $mjList = ArrayUtil::removeValue($mjList,$mjVal);
        array_push($niuList,$mjVal);
        MajiangDao::updatePlayerMajiang($uid,$mjList);
        $game->niuList[$uid] = $niuList;

        if($game->lOpVal == 7 && $game->lOpUid == $uid){
            $game->lianGang = 1;
        }
        $game->lOpUid = $uid;
        $game->lOpVal = 7;
        //消息之前保存数据，防止消息过来了数据不是最新的(如果还是不行，看前端处理opt没有回应，这点需要考虑下)
        MajiangDao::updateMajiangGame($game);
        $pushMsg = array('tag'=>'chooseNiu','sender'=>$uid,'niuVal'=>array($mjVal),'game'=>MjGameConstant::getGameSendMsg($game));
        RoomConstant::pushMsgToRoom($uid,$pushMsg,$room);
        $pushMsg['mjList'] = $mjList;
        ExtGameHelper::senderMessage(array($this->sender),$pushMsg);
    }
    /**
     * 杠自己的牌
     */
    public function gangSelf($request){
        if(!$this->checkParams($request, array('mjVal'))) return;

        $mjVal = (int)$request['mjVal'];
        $uid = $this->senderUid;
        $room = $this->room;
        $game = MajiangDao::getMajiangGame($this->room->id);

        //没有碰过牌 不可能杠
        if(!isset($game->pengList[$uid])) return;

        $pengList = $game->pengList[$uid];
        //没有碰这张牌 不能杠
        if(ArrayUtil::indexOf($pengList,$mjVal) == -1) return;

        $mjList = MajiangDao::getPlayerMajiang($uid);
        //没有该手牌 不能杠
        if(ArrayUtil::indexOf($mjList,$mjVal) == -1) return;

        $mjList = ArrayUtil::removeValue($mjList,$mjVal);
        $pengList = ArrayUtil::removeValue($pengList,$mjVal);
        $game->pengList[$uid] = $pengList;
        $gangList = isset($game->gangList[$uid]) ? $game->gangList[$uid] : array();
        array_push($gangList,$mjVal);
        $game->gangList[$uid] = $gangList;
        $game->lastGangMj = $mjVal;
//        $game = SuanFanConstant::gangSelf($uid,$mjVal,$game,$room);
        $game->currentUid = $uid;
        $game->chupai = false;
        //向操作者以外的人发送操作消息
        $pushMsg = array('tag'=>'updateCurrentUid','newMj'=>true,'opUid'=>$uid,'opVal'=>3,'game'=>MjGameConstant::getGameSendMsg($game),'minggang'=>1,'gangMjVal'=>$mjVal);
        RoomConstant::pushMsgToRoom($uid,$pushMsg,$room);

        //黄庄
        /*if(!MjGameConstant::hasMj($game)){
            //操作者需要额外更新他的麻将列表
            $pushMsg['mjList'] = $mjList;
            ExtGameHelper::senderMessage(array($this->sender),$pushMsg);

            MjGameConstant::stopGame($room,$game,null);

            $allMjs = MajiangDao::getRoomPlayerMajiangs($room);
            $allMjs[$uid] = $mjList;
            $pushMsg = array('tag'=>'huangzhuang','game'=>MjGameConstant::getGameSendMsg($game),'allMjs'=>$allMjs);
            RoomConstant::pushMsgToRoom($uid,$pushMsg,$room,true);
            MajiangDao::updateMajiangGame($game);
            $this->checkGameOver($game);
            return;
        }*/
        //推送新麻将是什么
        $newMj = MaJiangConstant::getNewMj($game,3);

        array_push($mjList,$newMj);
        sort($mjList);
        MajiangDao::updatePlayerMajiang($game->currentUid,$mjList);

        $pushMsg['mjList'] = $mjList;
        $pushMsg['newMjVal'] = $newMj;
        ExtGameHelper::senderMessage(array($this->sender),$pushMsg);

        if($game->lOpVal == 3  && $game->lOpUid == $uid){
            $game->lianGang = 1;
        }
        $game->lOpVal = 3;
        $game->lOpUid = $uid;

        MajiangDao::updatePlayerMajiang($uid,$mjList);
        MajiangDao::updateMajiangGame($game);
    }

    /**
     * 抢杠胡
     */
    public function minggangCallBack($request){
        if(!$this->checkParams($request, array('operatingType'))) return;
        $operatingType = (int)$request['operatingType'];
        $uid = $this->senderUid;
        $room_id = $this->room->id;
        $room = $this->room;
        $game = MajiangDao::getMajiangGame($this->room->id);
        //游戏没开始
        if(!$game->isStart) return;
        //判断操作是否合法
        if($operatingType != -8 && $operatingType != 8) return;

        $ops = MajiangDao::getQiangGangOperating($game->id);
        if(isset($ops[$uid])) return;//已经操作过了
        MajiangDao::addQiangGangOperating($game->id,$uid,$operatingType);
        if(MajiangDao::addQiangGangOperatingCount($game->id) == 4){
            $opUid = null;
            $opVal = -1;
            $sameOpUid = null;
            $operatings = MajiangDao::getQiangGangOperating($game->id);
            //检测优先操作
            foreach($operatings as $tuid => $val){
                if($val == 0) continue;
                if($val > $opVal){
                    $opVal = $val;
                    $sameOpUid = array($tuid);
                }else if($val == $opVal){
                    array_push($sameOpUid,$tuid);
                }
            }
            if($sameOpUid == null){
                $pushMsg = array('tag'=>'minggangCallBack');
                $players = $room->players;
                $game = SuanFanConstant::gangSelf($game->lOpUid,$game->lastGangMj,$game,$room);
                $game->chupai = true;
                foreach($players as $index => $uid){
                    $pushMsg['sender'] = $uid;
                    ExtGameHelper::senderMessage(array(PlatformDao::getSender($uid)),$pushMsg);
                }
            }else{
                //有人发起了相同的操作，找离上家最近的人
                if(count($sameOpUid) > 1){
                    $opUid = MjGameConstant::getClosedUid($game->currentUid,$sameOpUid,$room);
                }else{
                    $opUid = $sameOpUid[0];
                }
                $game->lastMj = $game->lastGangMj;
                //删除杠
                $gangList = $game->gangList[$game->lOpUid];
                $gangList = ArrayUtil::removeValue($gangList,$game->lastMj);
                $game->gangList[$game->lOpUid] = $gangList;
                //添加碰
                $pengList = isset($game->pengList[$game->lOpUid]) ? $game->pengList[$game->lOpUid] : array();
                array_push($pengList,$game->lastMj);
                $game->pengList[$game->lOpUid] = $pengList;
                //移除杠牌
                $mjList = MajiangDao::getPlayerMajiang($game->lOpUid);
                $mjList = ArrayUtil::removeValue($mjList,$game->newMj);
                $allMjs = MajiangDao::getRoomPlayerMajiangs($room);
                $allMjs[$game->lOpUid] = $mjList;
                //对胡牌玩家进行相应操作
                $mjList = MajiangDao::getPlayerMajiang($opUid);
                array_push($mjList,$game->lastMj);
                sort($mjList);
                $game->pao = $game->lOpUid;
                MajiangDao::updateMajiangGame($game);
                $game = SuanFanConstant::hu($opUid,MajiangDao::getPlayerMajiang($opUid),$game,$room,true);
                $game = MjGameConstant::stopGame($room,$game,$opUid);
                $allMjs[$opUid] = $mjList;
                MajiangDao::updateMajiangGame($game);
                $pushMsg = array('tag'=>'hupai','sender'=>array($opUid),'opVal'=>4,'game'=>MjGameConstant::getGameSendMsg($game),'allMjs'=>$allMjs,'_158'=>array());

                RoomConstant::pushMsgToRoom(null,$pushMsg,$room);
            }
            MajiangDao::clearQiangGangOperating($game->id);
        }
        MajiangDao::updateMajiangGame($game);
        $this->checkGameOver($game);
    }
    /**
     * 暗杠
     */
    public function anGang($request){
        if(!$this->checkParams($request, array('mjVal'))) return;

        $mjVal = (int)$request['mjVal'];
        $uid = $this->senderUid;
        $room = $this->room;
        $game = MajiangDao::getMajiangGame($this->room->id);
        $mjList = MajiangDao::getPlayerMajiang($uid);

        //没有该手牌 不能杠
        $countValus = array_count_values($mjList);
        if(!isset($countValus[$mjVal]) || $countValus[$mjVal] != 4){
            return;
        }
        sort($mjList);
        $mjIndex = ArrayUtil::indexOf($mjList,$mjVal);
        array_splice($mjList,$mjIndex,4);
        $angangList = isset($game->angangList[$uid]) ? $game->angangList[$uid] : array();
        array_push($angangList,$mjVal);
        $game->angangList[$uid] = $angangList;
        $game = SuanFanConstant::anGang($uid,$game,$room);

        if(isset($game->mjCount[$uid])){
            $game->mjCount[$uid] -= 3;
        }else{
            $game->mjCount[$uid] = 10;
        }
        $game->currentUid = $uid;
        //向操作者以外的人发送操作消息
        $pushMsg = array('tag'=>'updateCurrentUid','newMj'=>true,'opUid'=>$uid,'opVal'=>3,'game'=>MjGameConstant::getGameSendMsg($game));
        RoomConstant::pushMsgToRoom($uid,$pushMsg,$room);

        //黄庄
        /*if(!MjGameConstant::hasMj($game)){
            //操作者需要额外更新他的麻将列表
            $pushMsg['mjList'] = $mjList;
            ExtGameHelper::senderMessage(array($this->sender),$pushMsg);

            MjGameConstant::stopGame($room,$game,null);

            $allMjs = MajiangDao::getRoomPlayerMajiangs($room);
            $allMjs[$uid] = $mjList;
            $pushMsg = array('tag'=>'huangzhuang','game'=>MjGameConstant::getGameSendMsg($game),'allMjs'=>$allMjs);
            RoomConstant::pushMsgToRoom($uid,$pushMsg,$room,true);
            MajiangDao::updateMajiangGame($game);
            $this->checkGameOver($game);
            return;
        }*/
        //推送新麻将是什么
        $newMj = MaJiangConstant::getNewMj($game,3);

        array_push($mjList,$newMj);
        sort($mjList);
        MajiangDao::updatePlayerMajiang($game->currentUid,$mjList);

        $pushMsg['mjList'] = $mjList;
        $pushMsg['newMjVal'] = $newMj;
        ExtGameHelper::senderMessage(array($this->sender),$pushMsg);

        if($game->lOpVal == 3 && $game->lOpUid == $uid){
            $game->lianGang = 1;
        }
        $game->lOpVal = 3;
        $game->lOpUid = $uid;

        MajiangDao::updatePlayerMajiang($uid,$mjList);
        MajiangDao::updateMajiangGame($game);
    }

    /**
     * 操作，一个人打完牌之后 其他几个人需要操作一下
     */
    public function operating($request){
        if(!$this->checkParams($request, array('operatingType'))) return;

        $operatingType = (int)$request['operatingType'];
        $uid = $this->senderUid;
        $room = $this->room;
        $game = MajiangDao::getMajiangGame($this->room->id);

        //游戏没开始
        if(!$game->isStart) return;
        //当前为出牌阶段
        if($game->chupai) return;
        //当前打牌的人不能操作
        if($game->currentUid == $uid) {
            $operatingType = 0;
        }
        //没有这个操作类型
        if(!MaJiangConstant::hasOperating($operatingType)) return;
        if($operatingType != 0){//过牌无须检测
            $mjList = MajiangDao::getPlayerMajiang($uid);
            //吃牌合法需要额外检测
            if($operatingType == 1 && isset($request['chiMjs'])){
                $chiMjs = $request['chiMjs'];
                if(!MjGameConstant::checkChi($room,$game,$uid,$chiMjs)) return;

                MajiangDao::savePlayerChiPaiMsg($uid,$chiMjs);
            }else if(!MjGameConstant::checkOperating($room,$game,$operatingType,$uid,$mjList)){//检测操作是否合法
                return;
            }
        }else{
            if(isset($request['guohu'])){
                $game->guohu[$uid] = 1;
                MajiangDao::updateMajiangGame($game);
            }
        }

        $ops = MajiangDao::getOperating($game->id);
        if(isset($ops[$uid])) return;//已经操作过了

        MajiangDao::addOperating($game->id,$uid,$operatingType);
        if(MajiangDao::addOperatingCount($game->id) != 4){
            RoomConstant::pushMsgToRoom($uid,array('tag'=>'operating','sender'=>$uid),$room,true);//推送一个消息 表示该用户已经响应出牌操作
            return;
        }

        $opUid = null;
        $opVal = -1;
        $sameOpUid = null;
        $operatings = MajiangDao::getOperating($game->id);
        //检测优先操作
        foreach($operatings as $tuid => $val){
            if($val == 0) continue;
            if($val > $opVal){
                $opVal = $val;
                $sameOpUid = array($tuid);
            }else if($val == $opVal){
                array_push($sameOpUid,$tuid);
            }
        }
        //下一位出牌者是谁
        if($game->isniupai){
            $nextPlayerUid = $game->currentUid;
        }else{
            $nextPlayerUid = MjGameConstant::getNextPlayer($room,$game->currentUid);
        }
        $getNewMj = true;//是否摸新的牌
        $mjList = null;
        if($opVal != -1){
            //有人发起了相同的操作，找离上家最近的人
            if(count($sameOpUid) > 1){
                $opUid = MjGameConstant::getClosedUid($game->currentUid,$sameOpUid,$room);
            }else{
                $opUid = $sameOpUid[0];
            }
            $mjList = MajiangDao::getPlayerMajiang($opUid);
            if($opVal == 1){//吃牌
                $chiMjs = MajiangDao::getPlayerChiPaiMsg($opUid);
                $mjList = ArrayUtil::removeValue($mjList,$chiMjs[0]);
                $mjList = ArrayUtil::removeValue($mjList,$chiMjs[1]);
                MajiangDao::updatePlayerMajiang($opUid,$mjList);

                array_push($chiMjs,$game->lastMj);
                sort($chiMjs);
                $chiList = isset($game->chiList[$opUid]) ? $game->chiList[$opUid] : array();
                array_push($chiList,$chiMjs);
                $game->chiList[$opUid] = $chiList;
                $game->canHu = false;

                $nextPlayerUid = $opUid;
                $getNewMj = false;
            }else if($opVal == 2){//碰牌
                sort($mjList);
                $mjList = ArrayUtil::removeValue($mjList,$game->lastMj,2);
                MajiangDao::updatePlayerMajiang($opUid,$mjList);

                $pengList = isset($game->pengList[$opUid]) ? $game->pengList[$opUid] : array();
                array_push($pengList,$game->lastMj);
                $game->pengList[$opUid] = $pengList;
                $game->canHu = false;
                //记录点碰的玩家
                $game->dp[$game->lastMj] = $game->currentUid;
                $nextPlayerUid = $opUid;
                $getNewMj = false;
            }else if($opVal == 3){//杠牌
                sort($mjList);
                $mjList = ArrayUtil::removeValue($mjList,$game->lastMj,3);
                MajiangDao::updatePlayerMajiang($opUid,$mjList);

                $gangList = isset($game->gangList[$opUid]) ? $game->gangList[$opUid] : array();
                array_push($gangList,$game->lastMj);
                $game->gangList[$opUid] = $gangList;
                $game->canHu = true;
                $game = SuanFanConstant::gangOther($opUid,$game->lastUid,$game,$room);

                $nextPlayerUid = $opUid;
                $getNewMj = true;
            }else if($opVal == 4){//胡牌
                array_push($mjList,$game->lastMj);
                sort($mjList);
                $game->pao = $game->lastUid;
                $game = SuanFanConstant::hu($opUid,$mjList,$game,$room);
                $game = MjGameConstant::stopGame($room,$game,$opUid);
                MajiangDao::updateMajiangGame($game);

                $allMjs = MajiangDao::getRoomPlayerMajiangs($room);
                $allMjs[$opUid] = $mjList;
                $pushMsg = array('tag'=>'hupai','sender'=>$opUid,'opVal'=>4,'game'=>MjGameConstant::getGameSendMsg($game),'allMjs'=>$allMjs,'_158'=>array());
                RoomConstant::pushMsgToRoom($opUid,$pushMsg,$room,true);
                $this->checkGameOver($game);
                return;
            }
        }

        if($opVal > 0 && $opVal < 5){//杠碰吃胡
            //如果是扭牌操作，移除的是扭牌列表
            if($game->isniupai){
                $niuList = $game->niuList[$game->currentUid];
                $game->niuList[$game->currentUid] = ArrayUtil::removeValue($niuList,$niuList[count($niuList) - 1]);
            }else{
                $chupaiList = $game->chupaiList[$game->currentUid];
                $game->chupaiList[$game->currentUid] = ArrayUtil::removeValue($chupaiList,$chupaiList[count($chupaiList) - 1]);
            }
        }

        $game->currentUid = $nextPlayerUid;
        $game->chupai = true;
        if(isset($game->mjCount[$opUid])){
            $game->mjCount[$opUid] -= 3;
        }else{
            $game->mjCount[$opUid] = 10;
        }
        //向操作者和下一个出牌的人以外的人发送操作消息
        $pushMsg = array('tag'=>'updateCurrentUid','newMj'=>$getNewMj,'opUid'=>$opUid,'opVal'=>$opVal,'game'=>MjGameConstant::getGameSendMsg($game));
        $players = $room->players;
        $senders = array();
        foreach($players as $index => $playUid){
            if($playUid == $opUid || $playUid == $game->currentUid) continue;
            array_push($senders,PlatformDao::getSender($playUid));
        }
        ExtGameHelper::senderMessage($senders,$pushMsg);

        if($opUid != $game->currentUid){
            //操作者需要额外更新他的麻将列表
            $pushMsg['mjList'] = $mjList;
            ExtGameHelper::senderMessage(array(PlatformDao::getSender($opUid)),$pushMsg);
        }
        unset($pushMsg['mjList']);
        if($getNewMj){
            //黄庄
            if(!MjGameConstant::hasMj($game) && $opVal != 3){
                if($opUid == $game->currentUid){
                    $pushMsg['mjList'] = $mjList;
                }
                ExtGameHelper::senderMessage(array(PlatformDao::getSender($game->currentUid)),$pushMsg);
                SuanFanConstant::tuiGang($game,$room);
                MjGameConstant::stopGame($room,$game,null);

                $allMjs = MajiangDao::getRoomPlayerMajiangs($room);
                if($mjList != null){
                    $allMjs[$opUid] = $mjList;
                }
                $pushMsg = array('tag'=>'huangzhuang','game'=>MjGameConstant::getGameSendMsg($game),'allMjs'=>$allMjs);
                RoomConstant::pushMsgToRoom($opUid,$pushMsg,$room,true);
                MajiangDao::updateMajiangGame($game);
                $this->checkGameOver($game);
                return;
            }
            //推送新麻将是什么
            $newMj = MaJiangConstant::getNewMj($game,$opVal);

            $mjList = MajiangDao::getPlayerMajiang($game->currentUid);
            array_push($mjList,$newMj);
            sort($mjList);
            MajiangDao::updatePlayerMajiang($game->currentUid,$mjList);

            $pushMsg['mjList'] = $mjList;
            $pushMsg['newMjVal'] = $newMj;
            ExtGameHelper::senderMessage(array(PlatformDao::getSender($game->currentUid)),$pushMsg);
        }else{
            if($opUid == $game->currentUid){
                $pushMsg['mjList'] = $mjList;
            }
            ExtGameHelper::senderMessage(array(PlatformDao::getSender($game->currentUid)),$pushMsg);
        }
        if($opVal == 3 && $game->lOpVal == 3 && $game->lOpUid == $uid){
            $game->lianGang = 1;
        }

        //操作结束
        if(!($game->isniupai && $opVal == -1)){
            $game->lOpVal = $opVal;
            $game->lOpUid = $opUid;
        }

        MajiangDao::clearOperating($game->id);
        MajiangDao::updateMajiangGame($game);
    }
    /**
     * 检测麻将长度是否正常
     *  @param $game vo_MajiangGame
     */
    public function checkMjCountError($mjList,$game,$uid){
        $pengList = isset($game->pengList[$uid]) ? $game->pengList[$uid] : null;
        $gangList = isset($game->gangList[$uid]) ? $game->gangList[$uid] : null;
        $angangList = isset($game->angangList[$uid]) ? $game->angangList[$uid] : null;
        $count = 0;
        if($pengList){
            foreach($pengList as $key=>$value){
                $count+=3;
            }
        }
        if($gangList){
            foreach($gangList as $key=>$value){
                $count+=3;
            }
        }
        if($angangList){
            foreach($angangList as $key=>$value){
                $count+=3;
            }
        }
        $count += count($mjList);
        return $count;
    }

    /**
     * 检测游戏是否结束
     * @param $game vo_MajiangGame
     */
    public function checkGameOver($game,$over = false){
        if($game->currentCount > $game->maxCount || $over){
            $log = array();
            $log['roomId'] = $game->id;
            $log['time'] = DateUtil::makeTime();
            $logInfo = array();

            $players = $this->room->players;
            foreach($players as $index => $uid){
                $role = PlatformDao::getRole($uid);
                $fan = 0;
                if($game->totalFan != null && isset($game->totalFan[$uid])){
                    $fan = $game->totalFan[$uid];
                }
                $info = array($role->name,$role->uid,$fan);
                array_push($logInfo,$info);
            }
            $log['info'] = $logInfo;
            ExtGameHelper::logScore($game->id,$log);
            ExtGameHelper::sendGameOver($this->room->id);
            MajiangDao::delMajiangGame($this->room->id);
            MajiangDao::delPlayerMajiangByRoom($this->room);
            MajiangDao::clearOperating($this->room->id);
            MajiangDao::clearQiangGangOperating($this->room->id);
        }
    }





}