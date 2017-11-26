<?php
header("Content-type: text/html; charset=utf-8");

define('BASEPATH', 1);

require_once './class/autoloader.php';

date_default_timezone_set("PRC");

autoloader::init();


$hu = new PengPengHu();
var_dump($hu->checkType(array(3,4,5,5,5,),array(),array(31,14),array(23),array()));


?>
