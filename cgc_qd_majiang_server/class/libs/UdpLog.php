<?php
    /**
     * UdpLog
     */
    class UdpLog {
        
        private static $so = null;
        
        private static function createSo(){
            if(self::$so == null){
                self::$so = socket_create(AF_INET, SOCK_DGRAM, SOL_UDP);
            }
            return self::$so;
        }
        
        /**
         * 发送tlog(使用该方法会自动添加一些必要信息)
         * */
        public static function sendArrayMsg($event,$array){
            $msg = 'dn_dota_logs|' . $event;
            $count = count($array);
            for ($i=0; $i < $count; $i++) {
                if($array[$i] === null || $array == ""){
                    $msg .= '|0';
                }else{
                    $msg .= '|' . $array[$i];
                }
            }
            self::sendMsg($msg);
        }
        
        public static function sendMsg($msg){
            $so = self::createSo();
            socket_sendto($so, $msg, strlen($msg), 0, "127.0.0.1", 9601);
        }
        
        public static function closeSo(){
            if(self::$so != null){
                socket_close(self::$so);
            }
            self::$so = null;
        }
        
    }
    
?>