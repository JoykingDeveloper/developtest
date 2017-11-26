<?php

/**
 * Created by PhpStorm.
 * User: zmliu1
 * Date: 16/3/8
 * Time: 17:49
 */
class ForwardPath{

    public function index(SwooleProxyServer $server,$fd,$request){
        if(!isset($request['fds']) || !isset($request['data'])) return;

        $fds = $request['fds'];
        $data = $request['data'];
        if($fds[0] == -1){
            SwProxyInstance::broadcast($data,false);
        }else{
            $value = json_encode($data);
            $value = AES::encode($value);
            foreach($fds as $index => $fd){
                $server->sendData($fd,$value);
            }
        }

    }


}
?>