<?php


class CardConstant{

    //所有点数 3-A、2、小王、大王
    public static $pointArray = array(6,7,8,9,10,11,12,13,14,15,16,17);
    //所有花色 方片 红桃 黑桃 梅花
    public static $color = array(1,2,3,4);
    /**
     * 随机牌
     * @return array
     */
    public static function randCards(){
        $randCards = array();
        for($j = 6; $j<16; $j++){
            for($i = 1; $i<5; $i++){
                for($n = 1;$n<5;$n++){
                    $card[0]=$i;
                    $card[1]=$j;
                    array_push($randCards,$card);
                }
            }
        }
        for($n = 1;$n<5;$n++){
            $card[0]=$n==1?1:0;
            $card[1]=16;
            array_push($randCards,$card);
            $card[0]=$n==1?1:0;
            $card[1]=17;
            array_push($randCards,$card);
        }

        shuffle($randCards);
        return $randCards;
    }



    /**
     * 给一组牌排序
     */
    public static function sortCards($cards,$desc){
        $cards = ArrayUtil::sortOn($cards,1,$desc);
        return $cards;
    }

    /**
     * 获得出现指定次数的牌值集合
     * @param $cards array
     * @param $count int
     * @return array
     */
    public static function getPointByCount($cards,$count){
        $cardsPoint = array();
        //取出牌值，变一维数组
        foreach($cards as $index => $card){
            array_push($cardsPoint,$card[1]);
        }
        //每个牌值出现的次数
        $pointByCounts = array_count_values($cardsPoint);
        $pointByCount=array();
        if($pointByCounts != null) {
            //取出出现count次的牌值
            foreach ($pointByCounts as $key => $value) {
                if ($value == $count) {
                    array_push($pointByCount, $key);
                }
            }
        }
        return $pointByCount;
    }
    /*
     * 检测是否有皇牌
     * **/
    public static function haveEmperorCard($cards){
        foreach($cards as $index=>$value){
            if($cards[$index][0] == 1 && $cards[$index][1] == 17) {
                return true;
            }
        }
        return false;
    }
    /*
     * 检测是否有保牌
     * **/
    public static function haveGuardCard($cards){
        foreach($cards as $index=>$value){
            if($cards[$index][0] == 1 && $cards[$index][1] == 16) {
                return true;
            }
        }
        return false;
    }
    /**
     *检测是否有万能牌
     */
    public static function isChange($cards){
        if(count($cards) < 2){
            return false;
        }
        foreach($cards as $index =>$value){
            if($value[1] >=16){
                return true;
            }
        }
        return false;
    }
    public static function getNumbersCountInCards($cards,$number){
        $count = 0;
        foreach($cards as $key => $value){
            if($value[1] == $number){
                $count ++;
            }
        }
        return $count;
    }
    /*
    *
     * 得到牌组中所有点的集合
    */
    public static function getNumbersInCards($cards){
        $cardsPoint = array();
        //取出牌值，变一维数组
        foreach($cards as $index => $card){
            array_push($cardsPoint,$card[1]);
        }
        //每个牌值出现的次数
        $pointByCounts = array_count_values($cardsPoint);
        $pointByCount=array();
        if($pointByCounts != null) {
            //取出出现count次的牌值
            foreach ($pointByCounts as $key => $value) {
                array_push($pointByCount, $key);
            }
        }

        return $pointByCount;
    }
    /*
     *判断牌组是否合法
     * */
    public static function isRightOfCards($cards){
        $cardsPoint = array();
        $cardsPoint = self::getNumbersInCards($cards);
        if(count($cardsPoint)>3){
            return false;
        }
        foreach($cardsPoint as $index=>$value){
            if($value >= 16){
                unset($cardsPoint[$index]);
            }
        }
        if(count($cardsPoint) > 1){
            return false;
        }
        return true;
    }
    /**
     * 比牌
     * @param $cards1
     * @param $cards2
     * @return int
     */
    public static function compare2Cards($cards1,$cards2){
        //数量不等出牌不合理
        if(count($cards1) != count($cards2)){
            return false;
        }
        $count = count($cards1);
        for($index=0;$index<$count;$index++){
            if($cards1[$index][1]<=$cards2[$index][1]){
                return false;
            }
        }
       return true;
    }
}