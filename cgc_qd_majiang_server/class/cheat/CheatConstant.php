<?php

/**
 *作弊接口
 */
class CheatConstant{
    
    /**
     * 创建发手牌作弊数据
     * @return vo_Cheat
     */
    public static function createCheat($uid,$card,$isCheat){
        $cheat = new vo_Cheat();
        $cheat->uid = $uid;
        $cheat->card = json_encode($card);
        $cheat->is_cheat = $isCheat;
        return $cheat;
    }
    
    /**
     * 摸牌创建作弊数据
     * @return vo_Cheat
     */
    public static function getNewMjCheat($uid,$faCheatMj,$is_moMj){
        $cheat = new vo_Cheat();
        $cheat->uid = $uid;
        $cheat->faCheatMj = json_encode($faCheatMj);
        $cheat->is_moMj = $is_moMj;
        return $cheat;
    }
    
    /**
     * 发作弊的牌
     * @param $game vo_MajiangGame
     * @return array
     */
    public static function faCheat($players,$game){
        if(!CheatConfig::$_isCheat){ //判断作弊开关是否开启了
            return false;
        }
        $majiangList = array();
        $temp = array(); //保存作弊的牌，完了之后合并到牌堆最前面
        for($i = 1; $i <= 4; $i++){
            $uid = $players[$i]; //依次获取房间内的玩家id
            $userCheatCard = array();
            //开始到数据库去查询玩家id是否有作弊信息
            $cheatData = CheatDao::getCheat(trim($uid));
            if(!$cheatData){
                continue;
            }
            $isCheatSingle = $cheatData->is_cheat; //判断单个用户是否开启作弊
            if(!$isCheatSingle){
                continue;
            }
            $userArr[] = (int)$cheatData->uid;
            //测试数据开始
//            $userArr = array(100022);
//            $userCheatCard = array(9,9,9,9,23,23,23,23);
            //测试数据结束
            if(!in_array($uid, $userArr)){
                continue;
            }
            foreach ($cheatData->card as $v){
                $userCheatCard[] = (int)$v;
            }
            sort($userCheatCard);
            if(empty($userArr) || empty($userCheatCard)){
                continue;
            }
            $length = count($userCheatCard);
            if($length > 13){ //如果作弊的牌设置大于13张牌，暂时不给该玩家发作弊的牌
                continue;
            }
            $playerMaJiang = array();
            for($j = 0; $j <= ($length-1); $j++){
                $key = array_search($userCheatCard[$j], $game->mjList);
                if($key == null || !$key){ //牌堆内没有找到牌，结束开始寻找下一张牌
                    continue;
                }
                array_push($temp, $game->mjList[$key]);
                unset($game->mjList[$key]);
                array_push($playerMaJiang,$userCheatCard[$j]); //给作弊用户依次发作弊的牌
                $game->currentMj++;
            }
//            sort($playerMaJiang);
            $majiangList[$uid] = $playerMaJiang;
            CheatDao::delCheat($uid);
        }
        $game->mjList = array_merge($temp, $game->mjList);
        $game->mjList = array_values($game->mjList);
        return array($game,$majiangList);
    }
    
    /**
     * 获取新麻将时作弊
     */
    public static function getNewCheatMj(&$game, $opVal){
        if(!CheatConfig::$_isCheat){ //判断作弊开关是否开启了
            return false;
        }
        $majiangList = array();
        $temp = array(); //保存作弊的牌，完了之后合并到牌堆最前面
        $uid = (int)$game->currentUid; //获取当前操作人id
        
        $userCheatCard = array();
        //开始到数据库去查询玩家id是否有作弊信息
        $cheatData = CheatDao::getCheat(trim($uid), 'getNewMj');
        if(!$cheatData){
            return false;
        }
        if($uid != $cheatData->uid){ //判断作弊id是否是当前出牌人
            return false;
        }
        $isCheatSingle = $cheatData->is_moMj; //判断单个用户是否开启作弊
        if(!$isCheatSingle){
            return false;
        }
        if(empty($cheatData->faCheatMj) || !isset($cheatData->faCheatMj[0])){
            CheatDao::delCheat(trim($uid), 'getNewMj');
            return false;
        }
        //循环在牌堆查找作弊的麻将是否存在
        $isFindIndex = 1;
        $chushi = 0;
        $index = 0;
        while ($isFindIndex == 1){
            if(isset($cheatData->faCheatMj[0]) && $cheatData->faCheatMj[0] != ''){
                $newMjCheat = (int)$cheatData->faCheatMj[0]; //获取作弊新麻将
                array_splice($cheatData->faCheatMj, 0, 1); //删除已作弊麻将
            }else{
                CheatDao::delCheat(trim($uid), 'getNewMj');
                $isFindIndex = 0;
                return false;
            }
            
            $chushi = 0;
            $index = 0; //未出的作弊牌的位置
            if($opVal == 3){
                $chushi = $game->totalMj - 1 - $game->currentMj2;
            }else{
                $chushi = $game->currentMj;
            }
            if(!$chushi){
                return false;
            }
            for($i = $chushi; $i < count($game->mjList); $i++){
                if($newMjCheat == $game->mjList[$i]){
                    $index = $i;
                    break;
                }
            }
            if($index){
                $isFindIndex = 0;
            }
        }
        CheatDao::updateCheat($cheatData, 'getNewMj'); //更新剩下的作弊麻将
        $game->mjList[$index] = (int)$game->mjList[$chushi]; //吧原来的麻将放在作弊麻将的位置上
        $game->mjList[$chushi] = $newMjCheat;//吧作弊麻将放在出牌的位置上

        return $newMjCheat;
    }


}