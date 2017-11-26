<?php

    require_once "./swoole/SwooleWebSocketProxyServer.php";
    require_once "./swoole/business/extgame/ExtGameBusiness.php";

    SwooleSetting::$port = 7503;

//    SwooleSetting::$setting["process_title"] = "CgcMajiang";
//    SwooleSetting::$setting["daemonize"] = 1;
//    SwooleSetting::$setting["log_file"] = "./CgcMajiang.log";

    $proxyServer = new SwooleProxyServer(new ExtGameBusiness());
    $proxyServer->start();


?>