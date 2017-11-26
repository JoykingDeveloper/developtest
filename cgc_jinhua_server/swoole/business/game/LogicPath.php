<?php

/**
 * Created by PhpStorm.
 * User: zmliu1
 * Date: 15/8/4
 * Time: 10:16
 */
class LogicPath{

    public function index(SwooleProxyServer $server,$fd,$request){
        $stime=microtime(true); //获取程序开始执行的时间

        if(!isset($request['sessionToken'])){
            $this->sendError($server,$fd,array("state"=>StateConstant::STATE_NOT_LOGING));
            return 0;
        }

        $uid = SessionManager::getValue($request['sessionToken'], 'uid');
        if($uid == null){
            $this->sendError($server,$fd,array("state"=>StateConstant::STATE_NOT_LOGING));
            return 0;
        }

        if(!isset($request['api']) || !isset($request['c']) ){
            $this->sendError($server,$fd,array("state"=>StateConstant::STATE_PARAMS_ERROR));
            return 0;
        }

//        if(isset($request['_res'])){
//            $echo = BaseDao::getLastReqMsg($uid);
//            if($echo != null){
//                $server->sendData($fd,$echo);
//                return 0;
//            }
//        }

        $apiConfig = new ApiConfig();
        $apiStr = $request['api'];
        $cStr = $request['c'];

        /* @var $api BaseService */
        $api = $apiConfig->getApi($apiStr);
        if($api == null){
            $this->sendError($server,$fd,array("state"=>StateConstant::STATE_API_ERROR));
            return 0;
        }
        if(!$api->hasC($cStr)){
            $this->sendError($server,$fd,array("state"=>StateConstant::STATE_C_ERROR));
            return 0;
        }

        echo "$apiStr  $cStr start\n";

        $api->initSwooleProxy($server,$fd);

        $value = $api->excute($cStr,$uid,$request);
        $echo = null;
        if($value != null){
            $value['st'] = time();
            $value = TriggerController::trigger($uid,$value);
            $echo = json_encode($value);
        }
        $etime=microtime(true);//获取程序执行结束的时间
        $performTime = $etime-$stime;//计算接口计算时间
        BaseDao::logPerformTime($apiStr, $cStr, $performTime);//记录计算时间
        BaseDao::logLastReqMsg($uid,$echo);

        echo "$apiStr  $cStr end\n";

        $echo = AES::encode($echo);

        if($echo != null) $server->sendData($fd,$echo);
    }

    public function sendError(SwooleProxyServer $server,$fd,$data){
        $value = json_encode($data);
        $value = AES::encode($value);
        $server->sendData($fd,$value);
    }

}