<?php

/**
 * 推倒胡
 * User: zmliu1
 * Date: 17/3/30
 * Time: 16:02
 */
class TuiDaoHu extends BaseHu{

    /**
     * 胡牌
     */
    public function hu($mjList,$chiList,$pengList,$gangList,$angangList){
        $mjListResult = ArrayUtil::cloneArray($mjList);
        sort($mjListResult);
        $mjListResult = $this->zhaoPuPai($mjListResult);
        if(count($mjListResult) == 2 && $mjListResult[0] == $mjListResult[1]){
            return true;
        }

        $mjListResult = ArrayUtil::cloneArray($mjList);
        rsort($mjListResult);
        $mjListResult = $this->zhaoPuPai($mjListResult,false);
        if(count($mjListResult) == 2 && $mjListResult[0] == $mjListResult[1]){
            return true;
        }
        return false;
    }

    /**
     * 找铺牌
     * @param $mjList array
     * @return array
     */
    public function zhaoPuPai($mjList,$posArrow = true,$__3continue = true){
        $_tMjlist = ArrayUtil::cloneArray($mjList);
        // 找出对牌
        $countVals = array_count_values($mjList);
        $hasDuipai = false;//是否有对牌
        $duipaiCount = 0;//获取有几个对子
        $has3pai = false;
        foreach($countVals as $mj => $count){
            if($count == 2 || $count == 3){
                $hasDuipai = true;
                if($count == 2) $duipaiCount++;
                if($count == 3) $has3pai = true;
            }
        }
        //检测麻将是否是3个一连
        $seArr = null;
        $index = 0;
        $whileCount = count($mjList);
        $continueDuipai = $hasDuipai;//对牌是否跳过检测
        $_continue = false;
        $_3continue = $__3continue;
        while($index < $whileCount){
            $num1 = $mjList[$index];
            $num1Count = $countVals[$num1];
            if(($num1Count == 2 || $num1Count == 3) && $continueDuipai){
                $index += $num1Count;
                if($index >= $whileCount){
                    $index = 0;
                    $whileCount = count($mjList);
                    $continueDuipai = false;
                }
                continue;
            }
            //只有一个将牌 需要跳过
//            if($num1Count == 2 && $duipaiCount == 1 && $this->is258($num1)){
//                $index++;
//                continue;
//            }
            $seArr = MaJiangConstant::findMajiangStartEnd($num1);
            if($seArr[0] == -1){
                $index++;
                continue;
            }
            $num2 = $posArrow ? $num1 + 1 : $num1 - 1;
            $num3 = $posArrow ? $num1 + 2 : $num1 - 2;
            $index2 = ArrayUtil::indexOf($mjList,$num2);
            $index3 = ArrayUtil::indexOf($mjList,$num3);
            if($num2 >= $seArr[0]  && $num2 <= $seArr[1] && $num3 >= $seArr[0]  && $num3 <= $seArr[1]){
                $_continue = false;
                if($index2 == -1 || $index3 == -1){
                    $_continue = true;
                }else if($_3continue){
                    $_3continueVal = $this->_3Continue($num1,$num2,$num3,$countVals,$posArrow);
                    if($_3continueVal == -1){
                        $_3continue = false;
                        $index -= 1;
                        continue;
                    }else{
                        $_continue = $_3continueVal == 1;
                    }
                }
                if($_continue){
                    $index++;
                    if($continueDuipai && $index >= $whileCount){
                        $index = 0;
                        $whileCount = count($mjList);
                        if($continueDuipai){
                            $continueDuipai = false;
                        }
                    }
                    continue;
                }
                array_splice($mjList,$index3,1);
                array_splice($mjList,$index2,1);
                array_splice($mjList,$index,1);
                $whileCount -= 3;
                if($countVals[$num3] == 2){
                    $duipaiCount--;
                }
                $countVals[$num3] -= 1;
                if($countVals[$num2] == 2){
                    $duipaiCount--;
                }
                $countVals[$num2] -= 1;
                if($countVals[$num1] == 2){
                    $duipaiCount--;
                }
                $countVals[$num1] -= 1;
                if($continueDuipai && $index >= $whileCount){
                    $index = 0;
                    $whileCount = count($mjList);
                    if($continueDuipai){
                        $continueDuipai = false;
                    }
                }
                continue;
            }
            $index++;
            if($continueDuipai && $index >= $whileCount){
                $index = 0;
                $whileCount = count($mjList);
                if($continueDuipai){
                    $continueDuipai = false;
                }
            }
        }

        //找出3个 或者4个 相同的 移除掉
        $countVals = array_count_values($mjList);
        foreach($countVals as $mj => $count){
            if($count == 3 || $count == 4){
                $index = ArrayUtil::indexOf($mjList,$mj);
                $hasSingleKaoPai = self::hasSingleKaoPai($mjList,$mj,$countVals);
                if($hasSingleKaoPai && $count == 4){
                    array_splice($mjList,$index,3);
                }else if($hasSingleKaoPai && $count == 3){
                    continue;
                }else{
                    array_splice($mjList,$index,$count);
                }

            }
        }

        if($has3pai && $__3continue && (count($mjList) > 2 || (count($mjList) == 2 && $mjList[0] != $mjList[1]))){
            return $this->zhaoPuPai($_tMjlist,$posArrow,false);
        }

        return $mjList;
    }
    /*
     *手上有四张，看有没有靠单牌
     */
    public function hasSingleKaoPai($mjList,$mjVal,$countVals){
        $seArr = MaJiangConstant::findMajiangStartEnd($mjVal);
        if($seArr[0] == -1){
            return false;
        }
        $num = $mjVal+1;
        $kaoNum = 0;
        if(isset($countVals[$num]) && $countVals[$num] == 1 && $num>=$seArr[0]&&$num<=$seArr[1]&&ArrayUtil::indexOf($mjList,$num) != -1){//$countVals[$num] == 1 &&
            if($num < $seArr[1]){
                $num += 1;
                if(ArrayUtil::indexOf($mjList,$num) != -1){
                    $kaoNum++;
                }
            }
            if($num < $seArr[1]){
                $num+=1;
                if(ArrayUtil::indexOf($mjList,$num) != -1){
                    $kaoNum++;
                }
            }
            if($kaoNum == 0){
                return true;
            }
        }
        $num = $mjVal-1;
        if(isset($countVals[$num]) && $countVals[$num] == 1 && $num>=$seArr[0]&&$num<=$seArr[1]&&ArrayUtil::indexOf($mjList,$num) != -1){
            if($num > $seArr[0]){
                $num -= 1;
                if(ArrayUtil::indexOf($mjList,$num) != -1){
                    $kaoNum++;
                }
            }
            if($num > $seArr[0]){
                $num-=1;
                if(ArrayUtil::indexOf($mjList,$num) != -1){
                    $kaoNum++;
                }
            }
            if($kaoNum == 0){
                return true;
            }
        }
        return false;
    }

    /**
     * 在组连子的时候 遇到其中一个为3个的情况 是否需要跳过
     */
    public function _3Continue($num1,$num2,$num3,$countVals,$posArrow){
        $count1 = $countVals[$num1];
        $count2 = $countVals[$num2];
        $count3 = $countVals[$num3];
        if($count1 != 3 && $count2 != 3 && $count3 != 3){
            return 0;
        }
        if($count1 == 2 && $count2 == 3 && $count3 == 2){//3,4,4,5,5,5,6,6,7
            $tn1 = -1;
            $tn2 = -1;
            if($posArrow){
                $tn1 = $num1 - 1;
                $tn2 = $num3 + 1;
            }else{
                $tn1 = $num3 - 1;
                $tn2 = $num1 + 1;
            }
            $seArr = MajiangConstant::findMajiangStartEnd($num1);
            if($tn1 >= $seArr[0] && $tn2 <= $seArr[1] && $countVals[$tn1] == 1 && $countVals[$tn2] == 1){
                return -1;
            }
        }
        if($count1 == 3 && $count2 == 1 && $count3 == 1){
            return 0;
        }else if($count1 == 3 && $count2 == $count3){
            return 0;
        }else if($count2 == 3 && $count1 == $count3){
            return 0;
        }else if($count3 == 3 && $count1 == $count2){
            return 0;
        }
        return 1;
    }



}