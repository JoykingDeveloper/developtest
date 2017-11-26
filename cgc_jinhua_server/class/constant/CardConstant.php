<?php

/**
 *
 * 洗牌Constant
 *
 * User: zmliu1
 * Date: 17/1/10
 * Time: 16:10
 */
class CardConstant{

    //所有点数 2-AJinHuaConstant.php
    public static $pointArray = array(2,3,4,5,6,7,8,9,10,11,12,13,14);
    //所有花色 方片 红桃 黑桃 梅花
    public static $color = array(1,2,3,4);

    /**
     * 随机一张牌
     * @return array
     */
    public static function randCard(){
        return array(self::$color[rand(0,3)],self::$pointArray[rand(0,12)]);
    }

    /**
     * 获取牌的类型
     */
    public static function getCardType($cards){
        if(self::isBaozi($cards)){
            return 6;
        }

        $isTonghua = self::isTonghua($cards);
        $isShunzi = self::isShunzi($cards);
        if($isTonghua && $isShunzi){
            return 5;
        }

        if($isTonghua){
            return 4;
        }

        if($isShunzi){
            return 3;
        }

        if(self::isDuizi($cards)){
            return 2;
        }

        return 1;
    }

    /**
     * 获取牌的总点数
     */
    public static function getTotalPoint($cards){
        $totalPoint = 0;
        foreach($cards as $index => $card){
            $totalPoint += $card[1];
        }
        return $totalPoint;
    }

    /**
     * 给一组牌排序
     */
    public static function sortCards($cards){
        $cards = ArrayUtil::sortOn($cards,1,false);
        return $cards;
    }

    /**
     * 是否是豹子
     */
    public static function isBaozi($cards){
        $point = -1;
        foreach($cards as $index => $card){
            if($point == -1) $point = $card[1];
            if($point != $card[1]){
                return false;
            }
        }
        return true;
    }

    /**
     * 是否是同花
     */
    public static function isTonghua($cards){
        $hua = -1;
        foreach($cards as $index => $card){
            if($hua == -1) $hua = $card[0];
            if($hua != $card[0]){
                return false;
            }
        }
        return true;

    }

    /**
     * 是否是顺子
     */
    public static function isShunzi($cards){
        //A23特殊判断
        if($cards[0][1] == 2 && $cards[1][1] == 3 && $cards[2][1] == 14){
            return true;
        }
        $count = count($cards);
        for($i = 0; $i < ($count - 1) ; $i++){
            $card1 = $cards[$i];
            $card2 = $cards[$i + 1];
            if($card1[1] - $card2[1] != -1){
                return false;
            }
        }
        return true;
    }

    /**
     * 是否是对子
     */
    public static function isDuizi($cards){
        $count = count($cards);
        for($i = 0;$i < $count ; $i++){
            $card = $cards[$i];
            $point = $card[1];
            for($j = 0; $j < $count ; $j++){
                if($j == $i) continue;
                $card2 = $cards[$j];
                if($point == $card2[1]){
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 比牌
     * @param $cards1
     * @param $cards2
     * @return int
     */
    public static function bipai($cards1,$cards2){
        $cards1 = self::sortCards($cards1);
        $cards2 = self::sortCards($cards2);
        $cardType1 = CardConstant::getCardType($cards1);
        $cardtype2 = CardConstant::getCardType($cards2);
        if($cardType1 > $cardtype2){
            return 1;
        }else if($cardType1 < $cardtype2){
            return 2;
        }else if($cardType1 == $cardtype2){
            if($cardType1 == 6 || $cardType1 == 5 || $cardType1 == 4){//豹子 同花顺 顺子
                if($cardType1 == 4 || $cardType1 == 5){
                    if( $cards1[0][1] == 2 && $cards1[1][1] == 3 && $cards1[2][1] == 14 ){
                        $cards1[0][1] = 1;
                        $cards1[1][1] = 2;
                        $cards1[2][1] = 3;
                    }
                    if( $cards2[0][1] == 2 && $cards2[1][1] == 3 && $cards2[2][1] == 14 ){
                        $cards2[0][1] = 1;
                        $cards2[1][1] = 2;
                        $cards2[2][1] = 3;
                    }
                }
                if($cards1[2][1] > $cards2[2][1]){
                    return 1;
                }else{
                    return 2;
                }
            }

            if($cardType1 == 3 || $cardType1 == 1){//同花 散牌
                for($cardI = 2; $cardI >= 0 ; $cardI--){
                    if($cards1[$cardI][1] == $cards2[$cardI][1]){
                        continue;
                    }
                    if($cards1[$cardI][1] > $cards2[$cardI][1]){
                        return 1;
                        break;
                    }else{
                        return 2;
                        break;
                    }
                }
            }

            if($cardType1 == 2){
                $point1 = ($cards1[0][1] == $cards1[1][1]) ? $cards1[0][1] : $cards1[2][1];
                $point2 = ($cards2[0][1] == $cards2[1][1]) ? $cards2[0][1] : $cards2[2][1];
                if($point1 > $point2){
                    return 1;
                }else if($point1 < $point2){
                    return 2;
                }else{
                    $point1_1 = ($cards1[0][1] == $cards1[1][1]) ? $cards1[2][1] : $cards1[0][1];
                    $point2_1 = ($cards2[0][1] == $cards2[1][1]) ? $cards2[2][1] : $cards2[0][1];
                    if($point1_1 > $point2_1){
                        return 1;
                    }else{
                        return 2;
                    }
                }

            }
        }
        return 2;
    }

}