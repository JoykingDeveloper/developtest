<?php

/**
 * Created by w
 * User: Administrator
 * Date: 2017/11/8 0008
 * Time: ���� 7:12
 */
class TuiDaoHuEx extends BaseHu
{
    public $zhaopupaiCount;
    /** �Ƶ����㷨 */
    public function hu($mjList,$chiList,$pengList,$gangList,$angangList){
        $mjListModel = array(array(0,0,0,0,0,0,0,0,0,0,0)
                            ,array(0,0,0,0,0,0,0,0,0,0,0)
                            ,array(0,0,0,0,0,0,0,0,0,0,0)
                            ,array(0,0,0,0,0,0,0,0,0,0,0));
        $_mjlist = ArrayUtil::cloneArray($mjList);
        if(count($_mjlist)%3 != 2){
            return false;
        }
        $wannengCount = MaJiangConstant::getWannengCount($_mjlist,$this->game,$this->ispao);
        $len = count($_mjlist);
        //������������ֱ�Ӻ���
        if($wannengCount == 2 && $len == 0){
            return true;
        }
        for($i=0;$i<$len;$i++){
            $mjval = $_mjlist[$i];
            $row = ($mjval==9 || $mjval == 18 || $mjval == 27)? 9:$mjval%9;
            $col = ($mjval==9 || $mjval == 18 || $mjval == 27)?floor($mjval/9 - 1):floor($mjval/9);

            $mjListModel[(int)$col][0]++;
            $mjListModel[(int)$col][$row]++;
        }
        //��������
        if($wannengCount > 0){
            for($i=0;$i<4;$i++){
                if($mjListModel[$i][0] > 0 && $this->buWanNeng($i,$mjListModel,$wannengCount)){
                    return true;
                }
            }
        }else{
            //û��������ʡ�Բ���Ҫ�Ľ��Ʊ���
            $jiangPos = -1;
            $jiangExt = false;
            //���ҽ���һ������������������������Ϊ2
            for($i=0;$i<4;$i++){
                if($mjListModel[$i][0]>0 && $mjListModel[$i][0] % 3 == 1){
                    return false;
                }
					if($mjListModel[$i][0]>0 && $mjListModel[$i][0] % 3 == 2){
                    if(!$jiangExt){
                        $jiangPos = $i;
                        $jiangExt = true;
                    }else{
                        return false;
                    }
                }
				}
				//û�н���
				if($jiangPos == -1){
                    return false;
                }
				$result = $this->buWanNeng($jiangPos,$mjListModel,$wannengCount);
				return $result;
			}
        return false;
    }
    /**������*/
    public function buWanNeng($jiangPos,$mjListModel,$_wncount){
        //mjListModel �»���Խ��˵��ѭ������Խ��
        $_mjListModel = ArrayUtil::clone_2darray($mjListModel);
        $wannengCount = $_wncount;
        for($i=0;$i<4;$i++){
        if($i == $jiangPos){
        if($_mjListModel[$i][0]>0 && $_mjListModel[$i][0] % 3 == 1 && $wannengCount > 0){
            //������ 1 ��
            $_mjListModel[$i][10] += 1;
            $_mjListModel[$i][0] += 1;
            $wannengCount--;
        }
        if($_mjListModel[$i][0]>0 && $_mjListModel[$i][0] % 3 == 0 && $wannengCount > 1){
            //������ 2 ��
            $_mjListModel[$i][10] += 2;
            $_mjListModel[$i][0] += 2;
            $wannengCount -= 2;
        }
        }else{
        if($_mjListModel[$i][0]>0 && $_mjListModel[$i][0] % 3 == 2 && $wannengCount > 0){
            //������ 1 ��
            $_mjListModel[$i][10] += 1;
            $_mjListModel[$i][0] += 1;
            $wannengCount--;
        }
        if($_mjListModel[$i][0]>0 && $_mjListModel[$i][0] % 3 == 1 && $wannengCount > 1){
            //������ 1 ��
            $_mjListModel[$i][10] += 2;
						$_mjListModel[$i][0] += 2;
						$wannengCount -= 2;
					}
				}
			}
			$jiangExt = false;
			//���ҽ���һ������������������������Ϊ2(ͨ�����ƺ��ж�)
			for($i=0;$i<4;$i++){
                if($_mjListModel[$i][0]>0 && $_mjListModel[$i][0] % 3 == 1){
                    return false;
                }
                if($_mjListModel[$i][0]>0 && $_mjListModel[$i][0] % 3 == 2){
                    if(!$jiangExt){
                        $jiangExt = true;
                    }else{
                        return false;
                    }
                }
			}
			if(!$jiangExt){
                return false;
            }

			$success = false;
			if($wannengCount >= 3){
                //������ͬ��ɫ����������
                for($i=0;$i<4;$i++){
                    if($_mjListModel[$i][0]>0){
                        $__mjlistmodel = ArrayUtil::clone_2darray($_mjListModel);
						$__mjlistmodel[$i][0] += 3;
						$__mjlistmodel[$i][10] += 3;
						//��ʼ�����Ƶݹ�
						for($j=0;$j<4;$j++){
                            if($j!=$jiangPos){
                                if(!$this->zhaoPuPai($__mjlistmodel[$j],$j==3)){
                                    return false;
                                }
							}
                        }
						$success = false;
						for($j=1;$j<10;$j++){
                            if($_mjListModel[$jiangPos][$j] > 0 && ($__mjlistmodel[$jiangPos][$j] + $__mjlistmodel[$jiangPos][10])>=2){
                                $___mjlistmodel = ArrayUtil::cloneArray($__mjlistmodel[$jiangPos]) ;
								//����������
								$jiangMjCount = $___mjlistmodel[$j]>2?2:$___mjlistmodel[$j];
								$___mjlistmodel[$j] -= $jiangMjCount;
								$___mjlistmodel[10] -= (2-$jiangMjCount);
								$___mjlistmodel[0] -= 2;
								if($this->zhaoPuPai($___mjlistmodel,$jiangPos==3)){
                                    $success = true;
                                }
								if($success){
                                    break;
                                }
							}
						}
					}
				}
			}else{
                //��ʼ�����Ƶݹ�
                for($i=0;$i<4;$i++){
                    if($i!=$jiangPos){
                        if(!$this->zhaoPuPai($_mjListModel[$i],$i==3)){
                            return false;
                        }
					}
                }

				for($i=1;$i<10;$i++){
                    if($_mjListModel[$jiangPos][$i] > 0 && ($_mjListModel[$jiangPos][$i] + $_mjListModel[$jiangPos][10])>=2){
                        $___mjlistmodel = ArrayUtil::cloneArray($_mjListModel[$jiangPos]) ;
						//����������
						$jiangMjCount = $___mjlistmodel[$i]>2?2:$___mjlistmodel[$i];
						$___mjlistmodel[$i] -= $jiangMjCount;
						$___mjlistmodel[10] -= (2-$jiangMjCount);
						$___mjlistmodel[0] -= 2;
						if($this->zhaoPuPai($___mjlistmodel,$jiangPos==3)){
                            $success = true;
                        }
						if($success){
                            break;
                        }
					}
				}
			}
			return $success;
		}

		public function zhaoPuPai($mjListModel,$isWord){
            $this->zhaopupaiCount ++;
            if($mjListModel[0] == 0){
                return true;
            }
            $i=1;
			for(;$i<10;$i++){
                if($mjListModel[$i] != 0){
                    break;
                }
			}
            $result = false;
			if(($mjListModel[$i] + $mjListModel[10])>=3){
                $_mjlistmodel = ArrayUtil::cloneArray($mjListModel);
				//��ǰʹ������������
                $usewncount = $_mjlistmodel[$i] < 3?(3-$_mjlistmodel[$i]):0;
                $_mjlistmodel[$i] -= (3 - $usewncount);
                $_mjlistmodel[10] -= $usewncount;
                $_mjlistmodel[0] -= 3;
                $result = $this->zhaoPuPai($_mjlistmodel,$isWord);
				if($result){//�����ƶ��ֿ����ԣ����Բ��ڴ˷���false;
                    return $result;
                }
			}
			if(!$isWord){
                $num2Count = 0;
                $num3Count = 0;
                $index2 = -1;
                $index3 = -1;
                if($i < 8){
                    $index2 = $i+1;
                    $index3 = $i+2;
                }else if($i == 8){
                    $index2 = $i-1;
                    $index3 = $i+1;
                }else if($i == 9){
                    $index2 = $i-1;
                    $index3 = $i-2;
                }
                $num2Count = $mjListModel[$index2] > 0?1:0;
				$num3Count = $mjListModel[$index3] > 0?1:0;

				if(($num2Count + $num3Count + $mjListModel[10]) >= 2){
                    $_mjlistmodel = ArrayUtil::cloneArray($mjListModel);
                    $_mjlistmodel[$i] -= 1;
                    $_mjlistmodel[$index2] -= $num2Count;
                    $_mjlistmodel[$index3] -= $num3Count;
                    $_mjlistmodel[10] -= (2 - $num2Count - $num3Count);
                    $_mjlistmodel[0] -= 3;
                    $result = $this->zhaoPuPai($_mjlistmodel,$isWord);
					if($result){//�����ƶ��ֿ����ԣ����Բ��ڴ˷���false;
                        return $result;
                    }
				}

			}
			return $result;//�����ƶ��ֿ����ԣ��ݹ��������false
		}
}