<?php

/**
 *
 * 游戏相关逻辑
 *
 * User: zmliu1
 * Date: 17/2/23
 * Time: 14:50
 */
class MjGameConstant{

    /**
     * 创建麻将游戏
     * @param $room vo_Room
     * @return vo_MajiangGame
     */
    public static function createGame($room,$jushu){
        $mjGame = new vo_MajiangGame();
        $mjGame->id = $room->id;
        $mjGame->currentUid = $room->players[1];
        $mjGame->zhuang = $room->players[1];
        $mjGame->currentCount = 1;
        $mjGame->maxCount = $jushu;
        $mjGame->mjList = MaJiangConstant::refreshMajiang();
        $mjGame->totalMj = count($mjGame->mjList);
        return $mjGame;
    }

    /**
     * 是否所有人都准备好了
     * @param $room vo_Room
     * @param $game vo_MajiangGame
     * @return bool
     */
    public static function isAllReady($room,$game){
        $players = $room->players;
        if(count($players) != 4){
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
     * 获取游戏需要发送到客户端的 数据
     * @param $game vo_MajiangGame
     * @return array
     */
    public static function getGameSendMsg($game){
        $game2 = clone $game;
        unset($game2->mjList);
        if(isset($game2->newMj)) unset($game2->newMj);
        return $game2;
    }

    /**
     * 开始游戏
     * @param $room vo_Room
     * @param $game vo_MajiangGame
     * @return array
     */
    public static function startGame($room,$game){
        $game->isStart = true;
        $game->isQiangGangHu = false;
        $game->opting = false;
        $game->canHu = false;
        $game->fanData = null;
        $game->fanInfos = null;
        $game->gangInfos = null;
        $game->angangList = array();
        $game->gangList = array();
        $game->pengList = array();
        $game->diangangpengList = array();
        $game->alreadyHus = array();
        $game->perGang = array();
        $game->nextZhuang = null;
        $game->passHuList = array();
        $game->passPengList = array();
        $game->ischange = false;
        $game->lOpVal = -1;
        $game->lOpUid = null;
        $game->lianGang = 0;
        $game->pao = null;
        $game->isDuoPao = 1;
        $game->lastUid = null;
        $game->newMj = -1;
        $val = MaJiangConstant::faMj($room,$game);
        return $val;
    }

    /**
     * 停止游戏
     * @param $room vo_Room
     * @param $game vo_MajiangGame
     * @return vo_MajiangGame
     */
    public static function stopGame($room,$game){
        $game->ready = array();
        $game->isStart = false;
        $game->lastMj = null;
//        $game->currentMj = 0;
        $game->mjList = MaJiangConstant::refreshMajiang();
        $game->operating = array();
        $game->chupai = false;
        $game->chupaiList = array();
        $game->lackTypes = array();
        $game->mjCount = array();
        $game->currentCount++;

        $game->lastZhuang = $game->zhuang;

        if($game->nextZhuang == null){
            $huUid = $game->zhuang;
            $index = self::getPlayerIndexInRoom($room,$huUid);
            if($index == 4){
                $index = 1;
            }else{
                $index += 1;
            }
            $game->zhuang = $room->players[$index];
        }else{
            $game->zhuang = $game->nextZhuang;
        }
        $game->currentUid = $game->zhuang;

        $totalFan = $game->totalFan;
        if($totalFan == null){
            $totalFan = SuanFanConstant::initFanData($totalFan,$room);
        }
        //结算分数
        $fanData = $game->fanData;
        if($fanData != null){
            foreach($fanData as $uid => $val){
                $totalFan[$uid] += $val;
            }
            $game->totalFan = $totalFan;
        }

        return $game;
    }

    /**
     * @param $room vo_Room
     * @param $uid
     * @param $targetUid
     * @return int
     */
    public static function isShangJia($room,$uid,$targetUid){
        $index1 = self::getPlayerIndexInRoom($room,$uid);
        $index2 = self::getPlayerIndexInRoom($room,$targetUid);
        if($index1 - $index2 == 1){
            return true;
        }
        if($index1 == 1 && $index2 == 4){
            return true;
        }
        return false;
    }

    /**
     * 获取玩家在房间中的哪个位置
     * @param $room vo_Room
     * @param $uid
     * @return int
     */
    public static function getPlayerIndexInRoom($room,$uid){
        $players = $room->players;
        foreach($players as $index => $val){
            if($val == $uid){
                return $index;
            }
        }
        return -1;
    }

    /**
     * 获取下一个出牌的人
     * @param $room vo_Room
     * @param $uid
     * @return string
     */
    public static function getNextPlayer($room,$game,$uid){

        $index = self::getPlayerIndexInRoom($room,$uid);
        if($index != 4){
            $nextUid = $room->players[$index + 1];
        }else{
            $nextUid = $room->players[1];
        }

        if(isset($game->alreadyHus[$nextUid])){
            return MjGameConstant::getNextPlayer($room,$game,$nextUid);
        }else{
            return $nextUid;
        }
    }

    /**
     * 获取相距最近的玩家
     * @param $room vo_Room
     * @return string
     */
    public static function getClosedUid($uid,$uids,$room){
        $index = self::getPlayerIndexInRoom($room,$uid);
        $minIndex = 100;
        $reUid = null;
        foreach($uids as $key => $val){
            $i = self::getPlayerIndexInRoom($room,$val);
            if($i < $index){
                $i += 4;
            }
            if($minIndex > $i){
                $reUid = $val;
                $minIndex = $i;
            }
        }
        return $reUid;
    }

    /**
     * 检测操作是否合法
     * @param $room vo_Room
     * @param $game vo_MajiangGame
     * @param $opVal
     * @param $playerMjList
     * @return bool
     */
    public static function checkOperating($room,$game,$opVal,$playerUid,$playerMjList){
        if($opVal == 2) return MaJiangConstant::peng($game->lastMj,$playerMjList,$game->lackTypes[$playerUid]);
        if($opVal == 3) return MaJiangConstant::gang($game->lastMj,$playerMjList,$game,$game->lackTypes[$playerUid]);
        if($opVal == 4) return MaJiangConstant::hu($game->lastMj,$playerMjList,
            null,
            isset($game->pengList[$playerUid]) ? $game->pengList[$playerUid] : null,
            isset($game->gangList[$playerUid]) ? $game->gangList[$playerUid] : null,
            isset($game->angangList[$playerUid]) ? $game->angangList[$playerUid] : null,
            $game,$game->lackTypes[$playerUid]
        );
        return false;
    }



    /**
     * 是否还有麻将
     * @param $game vo_MajiangGame
     * @return bool
     */
    public static function hasMj($game){
        return ($game->currentMj < ($game->totalMj - $game->currentMj2));
    }
    public static function huangzhuang($game){
        return ($game->currentMj <= ($game->totalMj - $game->currentMj2));
    }
    /**
     * 获取杠底
     * @param $game vo_MajiangGame
     * @return array
     */
    public static function getGangDi($game){
        $arr = array();
        $start = $game->totalMj - 1;
        for($i = 0; $i < 12 ; $i++){
            array_push($arr,$game->mjList[$start]);
            $start--;
        }
        return $arr;
    }


}