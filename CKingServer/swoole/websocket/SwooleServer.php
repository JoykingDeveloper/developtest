<?php
/**
 * Created by PhpStorm.
 * User: CKing
 * Date: 2017/10/21 0021
 * Time: ���� 3:38
 */
    require_once "../swoole_websocket_server.c";
    class SwooleServer{
        public $reqs=array(); //���ֿͻ��˵ĳ����������������
        public function start($host,$port){
            $serv = new swoole_websocket_server("192.168.2.189", 9501);
            //���¿������ö�˿ڼ���
            //$server = new swoole_websocket_server("0.0.0.0", 9501, SWOOLE_BASE);
            //$server->addlistener('0.0.0.0', 9502, SWOOLE_SOCK_UDP);
            //$server->set(['worker_num' => 4]);

            $serv->on('Open', function($server, $req) {
                global $reqs;
                $reqs[]=$req->fd;
                echo "connection open: ".$req->fd."\n";
                var_dump(count($reqs));//�����������
                var_dump("reqs:".json_encode($reqs));
            });

            $serv->on('Message', function($server, $frame) {
                global $reqs;
                echo "message: ".$frame->data."\n";
                foreach($reqs as $fd){
                    $server->push($fd, $frame->data);
                }
            });

            $serv->on('Close', function($server, $fd) {
                echo "connection close: ".$fd."\n";
            });

            $serv->start();
        }
    }


?>