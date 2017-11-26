<?php

/**
 * Created by PhpStorm.
 * User: zmliu1
 * Date: 15/8/20
 * Time: 11:15
 */
class SwooleTimer {
    public $id;

    function __construct(){
        $this->id = uniqid();
    }

    /**
     * @param $server SwooleProxyServer
     */
    public function onTimer($server){}

    /**
     * @param $server SwooleProxyServer
     */
    public function onTimerOver($server){}

    public function id(){
        return $this->id;
    }


}