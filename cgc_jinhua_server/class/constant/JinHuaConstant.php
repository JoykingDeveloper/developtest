<?php

/**
 *
 * 金花 constant
 *
 * User: zmliu1
 * Date: 17/1/10
 * Time: 14:55
 */
class JinHuaConstant{
    /* 每一注的配置 */
    public static $useMoneyConfig = array(1=>1,2=>2,3=>3,4=>4,5=>5);

    /**
     * 每一注的配置
     */
    public static function getUseMoney($moneyType){
        return isset(self::$useMoneyConfig[$moneyType]) ? self::$useMoneyConfig[$moneyType] : -1;
    }

    /**
     * 创建游戏
     * @param $room vo_Room
     * @return vo_JinHuaGame
     */
    public static function createGame($id,$jushu,$room){
        $game = new vo_JinHuaGame();
        $game->id = $id;
        $game->isStart = false;
        $game->maxCount = $jushu;
        $game->currentCount = 1;
        $game->needRoomCard = 1;
        return $game;
    }

    /**
     * 获取游戏需要发送到客户端的 数据
     * @param $game vo_JinHuaGame
     * @return array
     */
    public static function getGameSendMsg($game){
        $game2 = clone $game;
        unset($game2->cards);
        return $game2;
    }

    /**
     * 是否所有人都准备好了
     * @param $room vo_Room
     * @param $game vo_JinHuaGame
     * @return bool
     */
    public static function isAllReady($room,$game){
        $players = $room->players;
        if(count($players) < 2){
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
     * @param $game vo_JinHuaGame
     * @param $room vo_Room
     * @return vo_JinHuaGame
     */
    public static function startGame($game,$room){
        if($game->lastWin == null){
            $game->currentUid = RoomConstant::getFirstPlayer($room);
        }else{
            $game->currentUid = $game->lastWin;
        }

        $game->isStart = true;
        $game->lastSee = 1;
        $game->lastMoneyType = 1;
        $game->lastMoney = 1;
        $game->allMoney = count($game->ready);
        $game->cards = self::randCards($game->ready);
        $game->see = null;
        $game->giveup = null;
        $game->operateCount = 0;
        $readys = $game->ready;
        foreach($readys as $uid => $val){
            $game->money[$uid] -= 1;
        }
        foreach($readys as $uid => $val){
            $game->currentMoney[$uid] += 1;
        }

        return  $game;
    }

    /**
     * 开始游戏
     * @param $winUid
     * @param $game vo_JinHuaGame
     * @param $room vo_Room
     * @return vo_JinHuaGame
     */
    public static function stopGame($winUid,$game,$room){
        $allMoney = $game->allMoney;
        $game->money[$winUid] += $allMoney;
        $game->currentMoney = null;
        $game->isStart = false;
        $game->currentUid = null;
        $game->lastSee = 1;
        $game->lastMoneyType = 1;
        $game->lastMoney = 1;
        $game->allMoney = 0;
        $game->cards = null;
        $game->see = null;
        $game->giveup = null;
        $game->ready = null;
        $game->lastWin = $winUid;
        $game->currentCount += 1;
        $game->operateCount = 0;
        return  $game;
    }

    /**
     * 发牌
     * @param $players array
     * @return array
     */
    public static function randCards($players){
        $cards = array();
        $cardsTmp = array();
        foreach($players as $uid => $value){
            $count = 3;
            $array = array();
            while($count > 0){
                $card = CardConstant::randCard();
                $key = $card[0] . "_" . $card[1];
                if(isset($cardsTmp[$key])){
                    continue;
                }
                array_push($array,$card);
                $cardsTmp[$key] = $card;
                $count--;
            }
            $cards[$uid] = CardConstant::sortCards($array);
        }
        return $cards;
    }

    /**
     * 获取下注需要多少钱
     * @param $game vo_JinHuaGame
     * @return int
     */
    public static function getXiazhuMoney($uid,$game,$moneyType){
        $money = JinHuaConstant::getUseMoney($moneyType);
        $lastSee = $game->lastSee;//是否有人没有看过牌
        $selfSee = isset($game->see[$uid]) ? 1 : 0;//自己是否看过牌

        //如果自己看过牌了又有人没看牌，那么自己下注需要翻倍
        if($selfSee == 1 && $lastSee == 0){
            $money *= 2;
        }else if($selfSee == 1 && $money < $game->lastMoney){
            $money = $game->lastMoney;
        }
        return $money;
    }
}