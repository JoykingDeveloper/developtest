<?php

/**
 *
 * 业务解析模型
 *
 * User: zmliu1
 * Date: 16/3/8
 * Time: 17:07
 */
class BaseBusiness {

    /**
     * 当服务 启动
     * @param $swProxyServer SwooleProxyServer
     * @param $work_id int
     */
    public function init($swProxyServer,$work_id){

    }

    /**
     * 处理业务
     * @param $swProxyServer SwooleProxyServer
     * @param $fd int 资源描述符
     * @param $data string 数据
     */
    public function index($swProxyServer,$fd,$data){

    }

    /**
     * @param $swProxyServer SwooleProxyServer
     */
    public function onConnect($swProxyServer, $fd, $from_id){

    }

    /**
     * @param $swProxyServer SwooleProxyServer
     */
    public function onClose($swProxyServer, $fd, $from_id){

    }

    /**
     * 封包
     */
    public function packData($data){
        $data = pack('N',strlen($data)) . $data;
        return $data;
    }

    /**
     * 解包
     */
    public function unPackData($data){
        $data = substr($data, 4,strlen($data));
        return $data;
    }

}