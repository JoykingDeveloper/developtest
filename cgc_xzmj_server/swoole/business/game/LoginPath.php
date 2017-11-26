<?php

/**
 * Created by PhpStorm.
 * User: zmliu1
 * Date: 15/8/4
 * Time: 10:15
 */
class LoginPath{

    public function index(SwooleProxyServer $server,$fd,$request){
        $stime=microtime(true); //获取程序开始执行的时间

        if(!isset($request["c"])){
            $this->sendError($server,$fd,array("state"=>StateConstant::STATE_PARAMS_ERROR));
            return 0;
        }

        /* @var $api BaseService */
        $api = new UserService();
        $cStr = $request["c"];

        if(!$api->hasC($cStr)){
            $this->sendError($server,$fd,array("state"=>StateConstant::STATE_C_ERROR));
            return 0;
        }

        $api->initSwooleProxy($server,$fd);

        $value = $api->excute($cStr,null,$request);
        if($value != null){
            $value['st'] = time();
        }
        $etime=microtime(true);//获取程序执行结束的时间
        $performTime = $etime-$stime;//计算接口计算时间
        BaseDao::logPerformTime('login', $cStr, $performTime);//记录计算时间



        if($value != null){
            $value = json_encode($value);
            $value = AES::encode($value);
            $server->sendData($fd,$value);
        }
    }

    public function sendError(SwooleProxyServer $server,$fd,$data){
        $value = json_encode($data);
        $value = AES::encode($value);
        $server->sendData($fd,$value);
    }

}