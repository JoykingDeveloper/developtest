<?php
header("Content-type: text/html; charset=utf-8");

define('BASEPATH', 1);

require_once './class/autoloader.php';

date_default_timezone_set("PRC");

autoloader::init();

//$cards1 =array(array(2,4),array(1,4),array(3,4),array(4,16),array(4,17),array(4,5));
//$cards = CardConstant::getNumbersInCards($cards1);
//var_dump($cards);
//var_dump(CardConstant::isRightOfCards($cards1));
//var_dump(CardConstant::randCards());
//$cards = CardConstant::sortCards($cards1,false);
////var_dump($cards);
//$cards2 =array(array(-1,16),array(-1,17));
//echo CardConstant::is_3_1($cards1);
////echo CardConstant::bipai($cards2,$cards1);
////$game = null;
//var_dump(CardConstant::randCards()) ;
//$cards1 =array(array(1,14),array(2,13), array(3,12),array(2,11),array(2,10),array(2,9));
//$cards1 = CardConstant::sortCards($cards1,false);
//$cards2 =array( array(3,11),array(3,11),array(3,5));
//echo CardConstant::bipai($cards1,$cards2);//2
//echo CardConstant::getCardType($cards1);


?>
