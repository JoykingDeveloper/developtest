<?php

/**
 * 数据转发服务
 * User: zmliu1
 * Date: 16/3/9
 * Time: 09:27
 */
class ForwardBusiness extends BaseBusiness{



    /**
     * 当服务 启动
     * @param $swProxyServer SwooleProxyServer
     * @param $work_id int
     */
    public function init($swProxyServer,$work_id){
        require_once "ForwardConfig.php";
    }

    /**
     * 处理业务
     * @param $swProxyServer SwooleProxyServer
     * @param $fd int 资源描述符
     * @param $data string 数据
     */
    public function index($swProxyServer,$fd,$data){
        echo $data . "\n";
        $data = json_decode($data,true);
        if(!is_array($data) || !isset($data['targets']) || !isset($data['from'])){
            return;
        }

        $targets = $data['targets'];
        $from = $data['from'];
        $reqData = $data['data'];
        $path = 'forward';
        if($targets == null){
            $allSvrConf = ForwardConfig::getAllSvr();
            foreach($allSvrConf as $sid => $svrConf){
                if($from == $sid || !$svrConf[2]) continue;
                ForwardClientPool::forwardData($svrConf[0],$svrConf[1],array('path'=>$path,'reqData'=>array('fds'=>array(-1),'data'=>$reqData)));
            }
        }else{
            foreach($targets as $svrid => $fds){
                $sendData = array('path'=>$path,'reqData'=>array('fds'=>$fds,'data'=>$reqData));
                $svrConf = ForwardConfig::getSvr($svrid);
                ForwardClientPool::forwardData($svrConf[0],$svrConf[1],$sendData);
            }
        }

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
}