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
        $threeList = MajiangDao::getThreeSelect($this->room->id);
        $opList = MajiangDao::getOperating($this->room->id);
        $needShowOp = false;
        if (!$game->chupai && !isset($opList[$uid])){
            $needShowOp = true;
        }
        $newMj = -1;
        if($game->chupai && $game->currentUid == $uid){
            $newMj = $game->newMj;
        }
        /* @var $sendGameData vo_MajiangGame */
        $sendGameData = MjGameConstant::getGameSendMsg($game);
        $sendGameData->newMj = $newMj;

        $puslMsg = array('tag'=>'initGame','game'=>$sendGameData,'threeSelectList'=>$threeList,'mjList'=>$mjList,'opList'=>$opList,'needShowOp'=>$needShowOp);
        ExtGameHelper::senderMessage(array($this->sender),$puslMsg);
    }

    /**
     * 玩家创建房间
     */
    public function createRoom($request){
        PlatformDao::saveSender($this->senderUid,$this->sender);
        PlatformDao::saveRole($this->senderRole);

        $createData = $request['createData'];
        $jushu = isset($createData['cardType']) ? ((int)($createData['cardType'])) : 8;
        $fanType = isset($createData['fanType']) ? ((int)($createData['fanType'])) : -1;
        $zimoType = isset($createData['zimoType']) ? ((int)($createData['zimoType'])) : 1;
        $gangFlower = isset($createData['gangFlower']) ? ((int)($createData['gangFlower'])) : 1;
        $menqingType = isset($createData['menqingType']) ? ((bool)($createData['menqingType'])) : false;
        $jiangduiType = isset($createData['jiangduiType']) ? ((bool)($createData['jiangduiType'])) : false;
        $hujiaozhuanyi = isset($createData['hujiaozhuanyi']) ? ((bool)($createData['hujiaozhuanyi'])) : false;

        $game = MjGameConstant::createGame($this->room,$jushu);
        $game->maxFan = $fanType;
        $game->zimoType = $zimoType;
        $game->gangFlower = $gangFlower;
        $game->menqingType = $menqingType;
        $game->jiangduiType = $jiangduiType;
        $game->hujiaozhuanyi = $hujiaozhuanyi;

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
        $game->alreadyHus = array();
        $isAllReady = MjGameConstant::isAllReady($room,$game);
        $mjLists = null;
        if($isAllReady){
            MajiangDao::delPlayerMajiangByRoom($this->room);
            MajiangDao::clearOperating($this->room->id);

            if($game->currentCount == 1) {
                ExtGameHelper::sendGameStart($room->id);
                ExtGameHelper::sendUseCard($room->id);
            }

            $result = MjGameConstant::startGame($room,$game);
            $game = $result[0];
            $mjLists = $result[1];
            foreach($mjLists as $uid2 => $list){
                $c = $uid2 == $game->zhuang?14:13;
                if(count($list) > $c){
                    echo "mjList_Init_Error:".DateUtil::makeTime()."uid:".$uid2."mjList:".json_encode($list)."\n";
                    array_splice($list,0,count($list) - $c);
                }
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
     * 换三张
     */
    public function changethree($request){
        if(!$this->checkParams($request, array('threeMj'))) return;
        $changethree = $request['threeMj'];
        $uid = $this->senderUid;
        $room = $this->room;
        $game = MajiangDao::getMajiangGame($this->room->id);

        if(!$game->isStart){
            var_dump('游戏未开始');
            return;
        }
        if(!MaJiangConstant::isSameType($changethree)){
            return;
        }
        $allThree = MajiangDao::getThreeMj($room->id);
        if(MajiangDao::isChooseThreeMj($uid,$room->id)){
            var_dump('已经选择:'.$allThree[$uid]);
            return;//已经选择过了
        }
        MajiangDao::updateThreeMj($changethree,$uid,$room->id);
        //取出最新换三张数据
        $allThree = MajiangDao::getThreeMj($room->id);
        //删除手牌
        $mjList = MajiangDao::getPlayerMajiang($uid);
        foreach($changethree as $key=>$value){
            $mjList = ArrayUtil::removeValue($mjList,$value);
        }
        MajiangDao::updatePlayerMajiang($uid,$mjList);
        $game->mjCount[$uid] = 10;
        if(MajiangDao::getThreeChooseLength($room->id) == 4){
            $game->ischange = true;
            //发送交换后的牌和交换规则给各个玩家
            $changeType = rand(1,3);//如何交换
            $allThree = MaJiangConstant::changeThreeMj($allThree,$changeType,$room);//交换
            $allMjList = array();//交换后更新手牌
            foreach($allThree as $key=>$value){
                $mjList=MajiangDao::getPlayerMajiang($key);
                foreach($value as $key1=>$value1){
                    array_push($mjList,$value1);
                }
                $c = $key == $game->zhuang?14:13;
                if(count($mjList) > $c){
                    $beforeChangeData = MajiangDao::getThreeMj($room->id);
                    echo "mjList_Change_Error:".DateUtil::makeTime()."\nuid:".$key."\nmjList:".json_encode($mjList)."\nbeforeChangeData:".json_encode($beforeChangeData)."\nafterChangeData:".json_encode($allThree)."\n";
                    array_splice($mjList,$c - 1,count($mjList) - $c);
                }
                MajiangDao::updatePlayerMajiang($key,$mjList);
                $game->mjCount[$key] = 13;
                $allMjList[$key] = $mjList;
            }
            MajiangDao::updateMajiangGame($game);
            //将每个人的三张牌和手牌数据，各自发给自己
            $pushMsg = array('tag'=>'changethree','sender'=>$uid,'ischange'=>true,'changetype'=>$changeType);
            RoomConstant::pushMsgToRoom1($uid,$pushMsg,$allThree,$allMjList,$room,true);
            return;
        }else{
            MajiangDao::updateMajiangGame($game);
        }
        //通知选牌
        $pushMsg = array('tag'=>'changethree','sender'=>$uid,'ischange'=>false);
        RoomConstant::pushMsgToRoom($uid,$pushMsg,$room,true);
    }
    /*
     * 定缺
     * **/
    public function lacking($request){
        if(!$this->checkParams($request, array('lackType'))) return;
        $lacktype = (int)$request['lackType'];
        $uid = $this->senderUid;
        $room = $this->room;
        $game = MajiangDao::getMajiangGame($this->room->id);
        if(!$game->isStart) return;
        if(!$game->ischange)return;//换三张后选缺
        if(isset($game->lackTypes[$uid]))return;

        $game->lackTypes[$uid] = $lacktype;
        if(count($game->lackTypes) == 4){
            $game->chupai = true;
        }else{
            $game->chupai = false;
        }
        MajiangDao::updateMajiangGame($game);
        $pushMsg = array('tag'=>'lacking','sender'=>$uid,'lackType'=>$lacktype);
        if($game->chupai){
            $pushMsg['chupai'] = true;
        }
        RoomConstant::pushMsgToRoom($uid,$pushMsg,$room,true);
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

        $mjList = ArrayUtil::removeValue($mjList,$mjVal);
        MajiangDao::updatePlayerMajiang($uid,$mjList);

        $game->lastUid = $uid;
        $game->lastMj = $mjVal;
        $game->chupai = false;
        $game->canHu = true;
        $game->opting = true;
        $chupaiList = isset($game->chupaiList[$uid]) ? $game->chupaiList[$uid] : array();
        array_push($chupaiList,$mjVal);
        $game->chupaiList[$uid] = $chupaiList;
        if(isset($game->passPengList[$uid])){
            unset($game->passPengList[$uid]);
        }

        $game->lianGang = 0;
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
        if(isset($game->alreadyHus[$uid])){
            echo "alreadyHu error 4\n";
            return;
        }
        $mjList = MajiangDao::getPlayerMajiang($uid);
        $hu = MaJiangConstant::hu(-1,$mjList,
            null,
            isset($game->pengList[$uid]) ? $game->pengList[$uid] : null,
            isset($game->gangList[$uid]) ? $game->gangList[$uid] : null,
            isset($game->angangList[$uid]) ? $game->angangList[$uid] : null,
            $game,$game->lackTypes[$uid]
        );
        if(!$hu) {
            echo json_encode($mjList) . "\n";
            echo "zimo error 3\n";
            return;
        }
        $game->pao = null;
        $game = SuanFanConstant::hu($uid,$mjList,$game,$room,1,$game->newMj);
        $allMjs = null;
        $nextPlayerUid = null;
        $getNewMj = false;
        if(count($game->alreadyHus) == 3){

//            SuanFanConstant::checkJiao($game,$room);
//            SuanFanConstant::checkHuaZhu($game,$room);
            $game = MjGameConstant::stopGame($room,$game);
            //游戏结束公开所有手牌
            $allMjs = MajiangDao::getRoomPlayerMajiangs($room);
        }else{
            //出牌标记下一个玩家，如果下一个玩家胡牌了，类推
            $nextPlayerUid = MjGameConstant::getNextPlayer($room,$game,$uid);
            $getNewMj = true;
        }

        MajiangDao::updateMajiangGame($game);

        $gameSendData = MjGameConstant::getGameSendMsg($game);
        $gameSendData->newMj = $game->newMj;
        $pushMsg = array('tag'=>'hupai','sender'=>array($uid),'opVal'=>5,'game'=>$gameSendData,'_158'=>array());
        if($allMjs != null){
            $pushMsg['allMjs'] = $allMjs;
        }
        RoomConstant::pushMsgToRoom($uid,$pushMsg,$room,true);
        $this->checkGameOver($game);

        if(!$getNewMj)return;
        $game->currentUid = $nextPlayerUid;
        $game->chupai = true;
        $newMj = MaJiangConstant::getNewMj($game,5,$uid);

        //向操作者和下一个出牌的人以外的人发送操作消息
        $pushMsg = array('tag'=>'updateCurrentUid','newMj'=>$getNewMj,'opUid'=>$uid,'opVal'=>5,'game'=>MjGameConstant::getGameSendMsg($game));
        $players = $room->players;
        $senders = array();
        foreach($players as $index => $playUid){
            if($playUid == $uid || $playUid == $game->currentUid) continue;
            array_push($senders,PlatformDao::getSender($playUid));
        }
        ExtGameHelper::senderMessage($senders,$pushMsg);

        if($uid != $game->currentUid){
            //操作者需要额外更新他的麻将列表
            $pushMsg['mjList'] = $mjList;
            ExtGameHelper::senderMessage(array(PlatformDao::getSender($uid)),$pushMsg);
        }
        unset($pushMsg['mjList']);
        //黄庄
        if(!MjGameConstant::hasMj($game)){
            if($uid == $game->currentUid){
                $pushMsg['mjList'] = $mjList;
            }
            ExtGameHelper::senderMessage(array(PlatformDao::getSender($game->currentUid)),$pushMsg);
            //查叫，查花猪
            SuanFanConstant::checkJiao($game,$room);
            SuanFanConstant::checkHuaZhu($game,$room);
            //结束游戏
            MjGameConstant::stopGame($room,$game);

            $allMjs = MajiangDao::getRoomPlayerMajiangs($room);
            if($mjList != null){
                $allMjs[$uid] = $mjList;
            }
            $pushMsg = array('tag'=>'huangzhuang','game'=>MjGameConstant::getGameSendMsg($game),'allMjs'=>$allMjs);
            RoomConstant::pushMsgToRoom($uid,$pushMsg,$room,true);
            MajiangDao::updateMajiangGame($game);
            $this->checkGameOver($game);
            return;
        }
        //推送新麻将是什么
        $mjList = MajiangDao::getPlayerMajiang($game->currentUid);
        array_push($mjList,$newMj);
        sort($mjList);
        MajiangDao::updatePlayerMajiang($game->currentUid,$mjList);

        $pushMsg['mjList'] = $mjList;
        $pushMsg['newMjVal'] = $newMj;
        ExtGameHelper::senderMessage(array(PlatformDao::getSender($game->currentUid)),$pushMsg);


        $game->lOpVal = 5;
        $game->lOpUid = $uid;

        MajiangDao::clearOperating($game->id);
        MajiangDao::updateMajiangGame($game);
    }
    /*
     *抢杠胡牌
    */
    public function qiangGangHu($request){
        if(!$this->checkParams($request, array('type'))) return;
        $operatingType = (int)$request['type'];
        $uid = $this->senderUid;
        $room = $this->room;
        $game = MajiangDao::getMajiangGame($room->id);
        //没有这个操作类型
        if(!MaJiangConstant::hasOperating($operatingType)) return;
        $ops = MajiangDao::getOperating($game->id);
        if(isset($ops[$uid])) return;//已经操作过了

        if($operatingType == 1){//过牌无须检测
            $mjList = MajiangDao::getPlayerMajiang($uid);
            if(!MjGameConstant::checkOperating($room,$game,4,$uid,$mjList)){//检测操作是否合法
                return;
            }
        }
        MajiangDao::addOperating($game->id,$uid,$operatingType);
        if(MajiangDao::addOperatingCount($game->id) != (4 - count($game->alreadyHus))){
            RoomConstant::pushMsgToRoom($uid,array('tag'=>'operating','sender'=>$uid),$room,true);//推送一个消息 表示该用户已经响应出牌操作
            return;
        }

        $opUid = null;
        $opVal = 3;
        $sameOpUid = null;
        $operatings = MajiangDao::getOperating($game->id);
        //检测优先操作
        foreach($operatings as $tuid => $val){
            if($val == 0) continue;
            if($val == 1){
                if($sameOpUid){
                    array_push($sameOpUid,$tuid);
                }else{
                    $sameOpUid = array($tuid);
                }
            }
        }
        $nextPlayerUid = $game->currentUid;
        if($sameOpUid){
            //将杠牌改成碰牌
            $pengList = isset($game->pengList[$game->currentUid]) ? $game->pengList[$game->currentUid] : array();
            $gangList = isset($game->gangList[$game->currentUid]) ? $game->gangList[$game->currentUid] : array();
            array_push($pengList,$game->lastMj);
            $gangList = ArrayUtil::removeValue($gangList,$game->lastMj);
            $game->pengList[$game->currentUid] = $pengList;
            $game->gangList[$game->currentUid] = $gangList;

            $opVal = 4;

            //记录一炮多响
            $game->isDuoPao = count($sameOpUid);
            $allMjs = null;
            foreach($sameOpUid as $key=>$value){//一炮多响
                $opUid = $value;
                $mjList = MajiangDao::getPlayerMajiang($opUid);
                array_push($mjList,$game->lastMj);
                sort($mjList);
                MajiangDao::updatePlayerMajiang($opUid,$mjList);
                $game->pao = $game->currentUid;
                $game = SuanFanConstant::hu($opUid,$mjList,$game,$room,0,$game->lastMj,true);

                if(count($game->alreadyHus) == 3){

//                    SuanFanConstant::checkJiao($game,$room);
//                    SuanFanConstant::checkHuaZhu($game,$room);
                    $game = MjGameConstant::stopGame($room,$game);
                    //游戏结束公开所有手牌
                    $allMjs = MajiangDao::getRoomPlayerMajiangs($room);
                }else{
                    //出牌标记下一个玩家，如果下一个玩家胡牌了，类推
                    $nextPlayerUid = MjGameConstant::getNextPlayer($room,$game,$opUid);
                }
                MajiangDao::updateMajiangGame($game);
            }
            $pushMsg = array('tag'=>'hupai','sender'=>$sameOpUid,'opVal'=>4,'game'=>MjGameConstant::getGameSendMsg($game),'_158'=>array());
            if($allMjs != null){
                $pushMsg['allMjs'] = $allMjs;
            }
            RoomConstant::pushMsgToRoom($opUid,$pushMsg,$room,true);
            $this->checkGameOver($game);
            if(count($game->alreadyHus) == 3)return;

            $game->currentUid = $nextPlayerUid;
        }else{
            //无胡算杠分
            $gangUid = $game->currentUid;

            $diangangpengList = $game->diangangpengList[$gangUid];
            if($diangangpengList == null || ArrayUtil::indexOf($diangangpengList,$game->lastMj) == -1){
                $game = SuanFanConstant::gangSelf($gangUid,$game,$room);
            }
        }
        $game->chupai = true;
        $game->isQiangGangHu = false;

        $newMj = MaJiangConstant::getNewMj($game,$opVal,$nextPlayerUid);

        //向操作者和下一个出牌的人以外的人发送操作消息
        $pushMsg = array('tag'=>'updateCurrentUid','newMj'=>true,'opUid'=>$opUid,'opVal'=>$opVal,'game'=>MjGameConstant::getGameSendMsg($game));
        $players = $room->players;
        $senders = array();
        foreach($players as $index => $playUid){
            if($playUid == $game->currentUid || ArrayUtil::indexOf($sameOpUid,$playUid) != -1) continue;
            array_push($senders,PlatformDao::getSender($playUid));
        }
        ExtGameHelper::senderMessage($senders,$pushMsg);
        if($opVal == 4){//有胡牌的，额外更新手牌
            foreach($sameOpUid as $k=>$huUid){
                $mjList = MajiangDao::getPlayerMajiang($huUid);
                //操作者需要额外更新他的麻将列表
                $pushMsg['mjList'] = $mjList;
                ExtGameHelper::senderMessage(array(PlatformDao::getSender($huUid)),$pushMsg);
            }
        }



        unset($pushMsg['mjList']);
        $mjList = MajiangDao::getPlayerMajiang($game->currentUid);
            //黄庄
            if(!MjGameConstant::hasMj($game)){
                if($opUid == $game->currentUid){
                    $pushMsg['mjList'] = $mjList;
                }
                ExtGameHelper::senderMessage(array(PlatformDao::getSender($game->currentUid)),$pushMsg);
                //查叫，查花猪
                SuanFanConstant::checkJiao($game,$room);
                SuanFanConstant::checkHuaZhu($game,$room);
                //结束游戏
                MjGameConstant::stopGame($room,$game);

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
            $mjList = MajiangDao::getPlayerMajiang($game->currentUid);
            array_push($mjList,$newMj);
            sort($mjList);
            MajiangDao::updatePlayerMajiang($game->currentUid,$mjList);

            $pushMsg['mjList'] = $mjList;
            $pushMsg['newMjVal'] = $newMj;
            ExtGameHelper::senderMessage(array(PlatformDao::getSender($game->currentUid)),$pushMsg);


        $game->lOpVal = $opVal;
        $game->lOpUid = $opVal==4?$opUid:$game->currentUid;
        MajiangDao::clearOperating($game->id);
        MajiangDao::updateMajiangGame($game);
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
        //没有牌了不能杠
        if(!MjGameConstant::hasMj($game)){
            return;
        }
        if($game->opting)return;
        //没有碰过牌 不可能杠
        if(!isset($game->pengList[$uid])) return;

        $pengList = $game->pengList[$uid];
        //没有碰这张牌 不能杠
        if(ArrayUtil::indexOf($pengList,$mjVal) == -1) return;

        $mjList = MajiangDao::getPlayerMajiang($uid);
        //没有该手牌 不能杠
        if(ArrayUtil::indexOf($mjList,$mjVal) == -1) return;

        //是否有人可以抢杠胡
        $canHu = null;
        foreach($game->ready as $key=>$value){
            if($key == $uid){
                continue;
            }
            $list_shoupai = MajiangDao::getPlayerMajiang($key);
            $list_peng = $game->pengList[$key];
            $list_gang = $game->gangList[$key];
            $list_angang = $game->angangList[$key];
            if(MaJiangConstant::hu($mjVal,$list_shoupai,null,$list_peng,$list_gang,$list_angang,$game,$game->lackTypes[$key])){
                if(!$canHu){
                    $canHu = array();
                }
                array_push($canHu,$key);
            }
        }


        $mjList = ArrayUtil::removeValue($mjList,$mjVal);
        $pengList = ArrayUtil::removeValue($pengList,$mjVal);
        $game->pengList[$uid] = $pengList;
        $gangList = isset($game->gangList[$uid]) ? $game->gangList[$uid] : array();
        array_push($gangList,$mjVal);
        $game->gangList[$uid] = $gangList;
        $game->currentUid = $uid;

        if(self::checkMjCountError($mjList,$game->pengList[$uid],$gangList,$game->angangList[$uid]) != 13){
            echo DateUtil::makeTime()."uid:".$uid."\nGangSelf_MjCountError:".json_encode($mjList)."\ngame:".json_encode($game)."\n";
        }
        if(!$canHu){

            //没胡在此结算.如果是点杠碰不接算
            $diangangpengList = $game->diangangpengList[$uid];
            if($diangangpengList == null || ArrayUtil::indexOf($diangangpengList,$mjVal) == -1){
                $game = SuanFanConstant::gangSelf($uid,$game,$room);
            }
            //推送新麻将是什么
            $newMj = MaJiangConstant::getNewMj($game,3,$uid);

            //向操作者以外的人发送操作消息
            $pushMsg = array('tag'=>'updateCurrentUid','newMj'=>true,'opUid'=>$uid,'opVal'=>3,'game'=>MjGameConstant::getGameSendMsg($game));
            RoomConstant::pushMsgToRoom($uid,$pushMsg,$room);
//            //黄庄
//            if(!MjGameConstant::hasMj($game)){
//                if($uid == $game->currentUid){
//                    $pushMsg['mjList'] = $mjList;
//                }
//                ExtGameHelper::senderMessage(array(PlatformDao::getSender($game->currentUid)),$pushMsg);
//                //查叫，查花猪
//                SuanFanConstant::checkJiao($game,$room);
//                SuanFanConstant::checkHuaZhu($game,$room);
//                //结束游戏
//                MjGameConstant::stopGame($room,$game);
//
//                $allMjs = MajiangDao::getRoomPlayerMajiangs($room);
//                if($mjList != null){
//                    $allMjs[$uid] = $mjList;
//                }
//                $pushMsg = array('tag'=>'huangzhuang','game'=>MjGameConstant::getGameSendMsg($game),'allMjs'=>$allMjs);
//                RoomConstant::pushMsgToRoom($uid,$pushMsg,$room,true);
//                MajiangDao::updateMajiangGame($game);
//                $this->checkGameOver($game);
//                return;
//            }
            array_push($mjList,$newMj);
            sort($mjList);
            $pushMsg['mjList'] = $mjList;
            $pushMsg['newMjVal'] = $newMj;
            ExtGameHelper::senderMessage(array($this->sender),$pushMsg);
        }else{
            //有胡在qiangganghu接口里面结算
            $game->isQiangGangHu = true;
            $game->chupai = false;
            $game->lastMj = $mjVal;
            //发消息通知抢杠胡
            $pushMsg = array('tag'=>'qiangganghu','sender'=>$uid,'game'=>MjGameConstant::getGameSendMsg($game));
            RoomConstant::pushMsgToRoom($uid,$pushMsg,$room);

            $pushMsg['mjList'] = $mjList;
            ExtGameHelper::senderMessage(array($this->sender),$pushMsg);
        }


        if($game->lOpVal == 3  && $game->lOpUid == $uid){
            $game->lianGang = 1;
        }
        $game->gtype = 2;
        $game->lOpVal = 3;
        $game->lOpUid = $uid;

        MajiangDao::updatePlayerMajiang($uid,$mjList);
        MajiangDao::updateMajiangGame($game);
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
        if(MaJiangConstant::isLackMj($mjVal,$game->lackTypes[$uid])){
            return;
        }
        //没有牌了不能杠
        if(!MjGameConstant::hasMj($game)){
            return;
        }
        if($game->opting)return;
        $checkCount = 4;
        //没有该手牌 不能杠
        $countValus = array_count_values($mjList);
        if(!isset($countValus[$mjVal]) || $countValus[$mjVal] != $checkCount){
            return;
        }
        sort($mjList);
        $mjIndex = ArrayUtil::indexOf($mjList,$mjVal);
        array_splice($mjList,$mjIndex,$checkCount);
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
        if(self::checkMjCountError($mjList,$game->pengList[$uid],$game->gangList[$uid],$angangList) != 13){
            echo DateUtil::makeTime()."uid:".$uid."\nanGang_MjCountError:".json_encode($mjList)."\ngame:".json_encode($game)."\n";
        }
        //向操作者以外的人发送操作消息
        $getNewMj = ($checkCount == 4);
        $newMj = -1;
        if($getNewMj){
            //推送新麻将是什么
            $newMj = MaJiangConstant::getNewMj($game,3,$uid);
        }
        $pushMsg = array('tag'=>'updateCurrentUid','newMj'=>$getNewMj,'opUid'=>$uid,'opVal'=>3,'game'=>MjGameConstant::getGameSendMsg($game));
        RoomConstant::pushMsgToRoom($uid,$pushMsg,$room);

        if($getNewMj){
            array_push($mjList,$newMj);
            sort($mjList);
            $pushMsg['newMjVal'] = $newMj;
        }
        $pushMsg['mjList'] = $mjList;
        ExtGameHelper::senderMessage(array($this->sender),$pushMsg);

        if($game->lOpVal == 3 && $game->lOpUid == $uid){
            $game->lianGang = 1;
        }
        $game->gtype = 3;
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
        $ops = MajiangDao::getOperating($game->id);
        if(isset($ops[$uid])) return;//已经操作过了

        if($operatingType != 0){//过牌无须检测
            $mjList = MajiangDao::getPlayerMajiang($uid);
            if(!MjGameConstant::checkOperating($room,$game,$operatingType,$uid,$mjList)){//检测操作是否合法
                return;
            }
        }else if($game->currentUid != $uid){
            //判断过牌是否放弃胡牌
            $mjList = MajiangDao::getPlayerMajiang($uid);
            if(MjGameConstant::checkOperating($room,$game,4,$uid,$mjList)){
                if(!isset($game->passHuList[$uid])){
                    $game->passHuList[$uid] = MaJiangConstant::getBaseFan($game->lastMj,$mjList,
                        isset($game->pengList[$uid])?$game->pengList[$uid]:null,
                        isset($game->gangList[$uid])?$game->gangList[$uid]:null,
                        isset($game->angangList[$uid])?$game->angangList[$uid]:null,$game);
                }
            }
            //判断过牌是否放弃碰牌
            if(MjGameConstant::checkOperating($room,$game,2,$uid,$mjList)){
                $passPengList = isset($game->passPengList[$uid])?$game->passPengList[$uid]:array();
                array_push($passPengList,$game->lastMj);
                $game->passPengList[$uid] = $passPengList;
            }
        }
        //摸牌了，或者番数增加了，可以胡
        if($operatingType == 4 && isset($game->passHuList[$uid])){
            $mjList = MajiangDao::getPlayerMajiang($uid);
            $currentFan = MaJiangConstant::getBaseFan($game->lastMj,$mjList,
                isset($game->pengList[$uid])?$game->pengList[$uid]:null,
                isset($game->gangList[$uid])?$game->gangList[$uid]:null,
                isset($game->angangList[$uid])?$game->angangList[$uid]:null,$game);
            if($game->lastUid == $game->lOpUid && $game->lOpVal == 3){
                $currentFan++;
            }
            if($currentFan <= $game->passHuList[$uid]){//番数没有增加，不能胡牌
                //一轮内不能胡同一张牌
                $operatingType = 0;
            }
        }
        //过碰的牌不能碰
        if($operatingType == 2){
            if(isset($game->passPengList[$uid]) && ArrayUtil::indexOf($game->passPengList[$uid],$game->lastMj) != -1){
                $operatingType = 0;
            }
        }
        MajiangDao::addOperating($game->id,$uid,$operatingType);
        if(MajiangDao::addOperatingCount($game->id) != (4 - count($game->alreadyHus))){
            //操作未完成，可能对过胡的数据进行修改，这里保存更新一下
            MajiangDao::updateMajiangGame($game);
            RoomConstant::pushMsgToRoom($uid,array('tag'=>'operating','sender'=>$uid),$room,true);//推送一个消息 表示该用户已经响应出牌操作
            return;
        }

        $opUid = null;
        $opVal = -1;
        $sameOpUid = null;
        $operatings = MajiangDao::getOperating($game->id);
        $hasGang = false;
        $gangUid = null;
        //检测优先操作
        foreach($operatings as $tuid => $val){
            if($val == 0) continue;
            if($val == 3) {
                $hasGang = true;
                $gangUid = $tuid;
            }
            if($val > $opVal){
                $opVal = $val;
                $sameOpUid = array($tuid);
            }else if($val == $opVal){
                array_push($sameOpUid,$tuid);
            }
        }

        $nextPlayerUid = MjGameConstant::getNextPlayer($room,$game,$game->currentUid);
        if($nextPlayerUid == $game->currentUid && $opVal != 4){
            echo "连续(1)currentUid:".DateUtil::makeTime()."opVal:".$opVal."\n";
            echo "game:".json_encode($game);
        }
        $getNewMj = true;//是否摸新的牌
        $mjList = null;
        if($opVal != -1){
            //有人发起了相同的操作，找离上家最近的人（相同操作只有一炮多响）
//            if(count($sameOpUid) > 1){
//                $opUid = MjGameConstant::getClosedUid($game->currentUid,$sameOpUid,$room);
//            }else{
//                $opUid = $sameOpUid[0];
//            }
            $opUid = $sameOpUid[0];
            //胡牌玩家不能继续操作
            if(isset($game->alreadyHus[$opUid])){
                return;
            }
            $mjList = MajiangDao::getPlayerMajiang($opUid);
           if($opVal == 2){//碰牌
               sort($mjList);
               $mjList = ArrayUtil::removeValue($mjList,$game->lastMj,2);
                MajiangDao::updatePlayerMajiang($opUid,$mjList);

                $pengList = isset($game->pengList[$opUid]) ? $game->pengList[$opUid] : array();
                array_push($pengList,$game->lastMj);
               if(ArrayUtil::indexOf($mjList,$game->lastMj) != -1){
                   $diangangpengList = isset($game->diangangpengList[$opUid]) ? $game->diangangpengList[$opUid] : array();
                   array_push($diangangpengList,$game->lastMj);
                   $game->diangangpengList[$opUid] = $diangangpengList;
               }

               $game->pengList[$opUid] = $pengList;
                $game->canHu = false;

                $nextPlayerUid = $opUid;
                $getNewMj = false;
               if(self::checkMjCountError($mjList,$pengList,$game->gangList[$opUid],$game->angangList[$opUid]) != 14){
                   echo DateUtil::makeTime()."uid:".$opUid."\nPeng_MjCountError:".json_encode($mjList)."\ngame:".json_encode($game)."\n";
               }
            }else if($opVal == 3){//杠牌
                $checkCount =  3;
                sort($mjList);
                $mjList = ArrayUtil::removeValue($mjList,$game->lastMj,$checkCount);
                MajiangDao::updatePlayerMajiang($opUid,$mjList);

                $gangList = isset($game->gangList[$opUid]) ? $game->gangList[$opUid] : array();
                array_push($gangList,$game->lastMj);
                $game->gangList[$opUid] = $gangList;
                $game->canHu = $checkCount == 3;
                $game = SuanFanConstant::gangOther($opUid,$game->lastUid,$game,$room);
                $nextPlayerUid = $opUid;
                $getNewMj = $checkCount == 3;
               if(self::checkMjCountError($mjList,$game->pengList[$opUid],$gangList,$game->angangList[$opUid]) != 13){
                   echo DateUtil::makeTime()."uid:".$opUid."\nGangOther_MjCountError:".json_encode($mjList)."\ngame:".json_encode($game)."\n";
               }
            }else if($opVal == 4){//胡牌
               //记录一炮多响
               $game->isDuoPao = count($sameOpUid);
               $allMjs = null;
               foreach($sameOpUid as $key=>$value){//一炮多响
                   $opUid = $value;
                   $mjList = MajiangDao::getPlayerMajiang($opUid);
                   array_push($mjList,$game->lastMj);
                   sort($mjList);
                   $game->pao = $game->lastUid;
                   $game = SuanFanConstant::hu($opUid,$mjList,$game,$room,0,$game->lastMj);

                   if(count($game->alreadyHus) == 3){

//                       SuanFanConstant::checkJiao($game,$room);
//                       SuanFanConstant::checkHuaZhu($game,$room);
                       $game = MjGameConstant::stopGame($room,$game);
                       //游戏结束公开所有手牌
                       $allMjs = MajiangDao::getRoomPlayerMajiangs($room);
                   }else{
                       //出牌标记下一个玩家，如果下一个玩家胡牌了，类推
                       $nextPlayerUid = MjGameConstant::getNextPlayer($room,$game,$opUid);
                   }

                   MajiangDao::updateMajiangGame($game);
               }
               $pushMsg = array('tag'=>'hupai','sender'=>$sameOpUid,'opVal'=>4,'game'=>MjGameConstant::getGameSendMsg($game),'_158'=>array());
               if($allMjs != null){
                   $pushMsg['allMjs'] = $allMjs;
               }
               RoomConstant::pushMsgToRoom($opUid,$pushMsg,$room,true);
               $this->checkGameOver($game);
                if(count($game->alreadyHus) == 3)return;
            }
        }

        if($opVal > 0 && $opVal < 5){//杠碰吃胡
            $chupaiList = $game->chupaiList[$game->currentUid];
            $game->chupaiList[$game->currentUid] = ArrayUtil::removeValue($chupaiList,$chupaiList[count($chupaiList) - 1]);
        }
        if($nextPlayerUid == $game->currentUid && $opVal != 4){
            echo "连续(2)currentUid:".DateUtil::makeTime()."opVal:".$opVal."\n";
            echo "game:".json_encode($game);
        }
        $game->currentUid = $nextPlayerUid;
        $game->chupai = true;
        $game->opting = false;
        if($opVal != 4){//胡牌不变
            if(isset($game->mjCount[$opUid])){
                $game->mjCount[$opUid] -= 3;
            }else{
                $game->mjCount[$opUid] = 10;
            }
        }


        $newMj = -1;
        if($getNewMj){
            $newMj = MaJiangConstant::getNewMj($game,$opVal,$nextPlayerUid);
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
            if(!MjGameConstant::huangzhuang($game) && $opVal != 3){
                if($opUid == $game->currentUid){
                    $pushMsg['mjList'] = $mjList;
                }
                ExtGameHelper::senderMessage(array(PlatformDao::getSender($game->currentUid)),$pushMsg);
                //查叫，查花猪
                SuanFanConstant::checkJiao($game,$room);
                SuanFanConstant::checkHuaZhu($game,$room);
                //结束游戏
                MjGameConstant::stopGame($room,$game);

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
        $game->gtype = 1;
        $game->lOpVal = $opVal;
        $game->lOpUid = $opUid;

        MajiangDao::clearOperating($game->id);
        MajiangDao::updateMajiangGame($game);
    }
    /**
     * 检测麻将长度是否正常
     *
     */
    public function checkMjCountError($mjList,$pengList,$gangList,$angangList){
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
        }
    }





}