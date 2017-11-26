<?php
header("Content-type: text/html; charset=utf-8");

define('BASEPATH', 1);

require_once './class/autoloader.php';

date_default_timezone_set("PRC");

autoloader::init();

$cards1 =array(array(2,12),array(1,9), array(1,14));
$cards2 =array( array(1,2),array(3,8),array(1,4));
echo CardConstant::bipai($cards1,$cards2);//2
echo CardConstant::getCardType($cards1);

//echo date("Y-m-d H:i");
?>
