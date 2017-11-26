<?php

/**
 * 消息转发客户端
 *
 * User: zmliu1
 * Date: 16/3/8
 * Time: 15:34
 */
class ForwardClient{

    /* @var $swClient swoole_client */
    private $swClient;

    /* 发送队列,连接成功前，暂时保存数据 */
    private $sendQueue;
    private $sendQueueCount;

    private $host;
    private $port;
    private $packLen = true;

    /* 是否正在连接中 */
    private $connecting = false;

    /**
     * 是否关闭过
     */
    public $isCloseOff = false;

    /**
     * @param $host string 服务器地址
     * @param $port int 端口
     */
    function __construct($host,$port){
        $this->host = $host;
        $this->port = $port;
        $this->sendQueue = array();
        $this->sendQueueCount = 0;
    }

    /**
     * 连接
     */
    private function connect($packLen){
        $this->packLen = $packLen;
        $this->connecting = true;
        $this->swClient = new swoole_client(1,1);
        if($packLen){
            $this->swClient->set(array(
                'open_length_check'     => 1,
                'package_length_type'   => 'N',
                'package_length_offset' => 0,       //第N个字节是包长度的值
                'package_body_offset'   => 4,       //第几个字节开始计算长度
            ));
        }
        $this->swClient->on('connect',array($this,"onConnect"));
        $this->swClient->on('receive',array($this,"onReceive"));
        $this->swClient->on('error',array($this,"onError"));
        $this->swClient->on('close',array($this,"onClose"));
        $this->swClient->connect($this->host,$this->port,30);

        echo "ForwardClient Start connect host:" . $this->host . " port:" . $this->port . "\n";
    }

    /**
     * 连接成功
     * @param $client swoole_client
     */
    public function onConnect($client){
        echo "ForwardClient onConnect\n";

        $this->connecting = false;
        foreach($this->sendQueue as $index => $data){
            $this->send($data,$this->packLen);
        }
        $this->sendQueue = array();
        $this->sendQueueCount = 0;
    }

    /**
     * 收到消息
     * @param $client swoole_client
     * @param $data
     */
    public function onReceive($client,$data){}

    /**
     * 出错
     * @param $client swoole_client
     */
    public function onError($client){
        echo "ForwardClient onError\n";

        if($this->swClient->isConnected()){
            $this->swClient->close();
        }
        $this->swClient = null;
        $this->connecting = false;
        $this->isCloseOff = true;
    }

    /***
     * 关闭
     * @param $client swoole_client
     */
    public function onClose($client){
        echo "ForwardClient onClose\n";

        $this->swClient = null;
        $this->connecting = false;
        $this->isCloseOff = true;
    }

    /**
     * 发送对象
     * @param $data
     */
    public function sendObject($data,$packLen = true){
        $this->send(json_encode($data),$packLen);
    }

    /**
     * 发送数据
     * @param $data string
     */
    public function send($data,$packLen = true){
        if($this->swClient != null && $this->swClient->isConnected()){
            if($packLen) {
                $data = pack('N',strlen($data)) . $data;
            }
            $this->swClient->send($data);
        }else{
            if($this->sendQueueCount < 10000){
                array_push($this->sendQueue,$data);
                $this->sendQueueCount++;
            }
            if(!$this->connecting){
                $this->connect($packLen);
            }
        }
    }

    /**
     * 发送心跳
     */
    public function sendHeartbeat(){
        if($this->swClient->isConnected()){
            $data = pack('N',9) . "heartbeat";
            $this->swClient->send($data);
        }
    }



}