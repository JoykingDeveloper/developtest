<?php
	header("Content-type: text/html; charset=utf-8");

	define('BASEPATH',1);

	require_once './class/autoloader.php';
	autoloader::init();

	$ip = IP::getClientIp();
	if($ip != '127.0.0.1' && $ip != '10.217.183.94'){
		// echo 'ip error';
		// exit(0);
	}

	$dao = new BaseDao();

	if(isset($_GET['clear'])){
		$keys = $dao -> getRedis() -> keys('*');
		echo "Success";
	}else{
		$keys = $dao -> getRedis() -> keys('cfg:*');
		echo "配置表数据清除完成";
	}
	$count = count($keys);
	for ($i=0; $i < $count; $i++) {
		$dao -> getRedis() -> del($keys[$i]);
}
?>