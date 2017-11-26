<?php

/**
 * 管理终端
 *
 * User: zmliu1
 * Date: 16/7/3
 * Time: 11:38
 */
class AdminPath{

    public function index(SwooleProxyServer $server,$fd,$request){
        $stime=microtime(true); //获取程序开始执行的时间

        /* @var $api BaseService */
        $api = new AdminService();
        $cStr = $request["c"];

        if(!$api->hasC($cStr)){
            $this->sendError($server,$fd,array('status'=>AdminConstant::method_not_exist, 'message'=>'method not exist'));
            return 0;
        }

        //检验sign是否正确
        $time = intval($request['time']);
        $server_id = $request['server_id'];
        $consultSign = sha1(AdminConstant::token . $time . $server_id);
        if($request['sign'] != $consultSign){
            $this->sendError($server,$fd,array('status'=>AdminConstant::sign_error, 'message'=>'sign error'));
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
            $server->sendData($fd,$value);
        }
    }

    public function sendError(SwooleProxyServer $server,$fd,$data){
        $value = json_encode($data);
        $server->sendData($fd,$value);
    }

}