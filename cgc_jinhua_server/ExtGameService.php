<?php

    require_once "./swoole/SwooleWebSocketProxyServer.php";
    require_once "./swoole/business/extgame/ExtGameBusiness.php";

    SwooleSetting::$port = 7504;

    $proxyServer = new SwooleProxyServer(new ExtGameBusiness());
    $proxyServer->start();


?>
