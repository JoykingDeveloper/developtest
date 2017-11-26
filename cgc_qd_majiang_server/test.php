<?php
header("Content-type: text/html; charset=utf-8");

define('BASEPATH', 1);

require_once './class/autoloader.php';

date_default_timezone_set("PRC");

autoloader::init();


$mjList = array(5,5,5,11,13);
$game= new vo_MajiangGame();
$game->hunMj = 5;
$hu = new TuiDaoHuEx();
$hu->game = $game;
$hu->ispao = false;
$add = $hu->hu($mjList,null,null,null,null);
var_dump($add);
//$game = MajiangDao::getMajiangGame("239168");
//var_dump($game->mjList[54]);

?>
