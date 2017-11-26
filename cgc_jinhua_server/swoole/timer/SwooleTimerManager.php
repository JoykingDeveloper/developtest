<?php

/**
 *
 * 倒计时管理类,使用改方式的倒计时，调整时间只能往前调整，否则计时器将会失效
 *
 * Created by PhpStorm.
 * User: zmliu1
 * Date: 15/8/20
 * Time: 10:34
 */

require_once "SwooleTimer.php";

class SwooleTimerManager{

    /* @var SwooleProxyServer */
    private static $server;
    /* @var swoole_server */
    private static $swSvr;
    //所有定时器
    private static $timers = array();
    //所有的倒计时
    private static $timeDowns = array();
    //当前时间
    private static $now;
    //清楚定时器
    private static $timer_id;

    /**
     * @param $server SwooleProxyServer
     */
    public static function initTimerManager($server,$initTimers = false){
        self::$server = $server;
        self::$swSvr = $server->server;
        self::$now = time();
        if($initTimers) {
            self::$timer_id = self::$swSvr->tick(1000,"SwooleTimerManager::update");
        }
    }

    /**
     * 添加一个定时器
     * @param $config   string  执行日期 -> 年 月 日 时 分 秒 星期(* * * * * * *)
     * @param $timer    SwooleTimer
     */
    public static function addTimer($config,$timer){
        if(self::$server->server->worker_id != 0){
            $data = array(
                'cmd'=>'timer',
                'ty'=>0,
                't'=>serialize($timer),
                'tConfig'=>$config
            );
            self::$server->server->sendMessage(
                json_encode($data),0
            );
            return;
        }
        $config = explode(" ",$config);
        if(count($config) != 7){
            echo "SwooleTimerManager::addTimer config error!!!\n";
            return;
        }
        self::$timers[$timer->id()] = array($config,$timer);
    }


    /**
     * 添加一个倒计时
     * @param $delay        int 倒计时间隔
     * @param $repeatCount  int 重复次数
     * @param $timer        SwooleTimer
     */
    public static function addTimeDown($delay,$repeatCount,$timer){
        if(self::$server->server->worker_id != 0){
            $data = array(
                'cmd'=>'timer',
                'ty'=>1,
                't'=>serialize($timer),
                'delay'=>$delay,
                'repeatCount'=>$repeatCount
            );
            self::$server->server->sendMessage(
                json_encode($data),0
            );
            return;
        }
        self::$timeDowns[$timer->id()] = array($delay,0,$repeatCount,$timer);
    }

    /**
     * 删除一个时间
     * @param $id
     */
    public static function removeTimer($id){
        if(self::$server->server->worker_id != 0){
            $data = array(
                'cmd'=>'rmTimer',
                'id'=>$id
            );
            self::$server->server->sendMessage(
                json_encode($data),0
            );
            return;
        }
        unset(self::$timers[$id]);
        unset(self::$timeDowns[$id]);
    }

    /**
     * @param $server swoole_server
     * @param $interval int
     */
    public static function update(){
        $now = time();
        $offset = abs($now - self::$now);
        for($i = 0 ; $i < $offset ; $i++){
            self::$now++;
            try{
                self::updateTimeDown();
            }catch (Exception $ex){
                var_dump($ex);
            }
            try{
                self::updateTimer();
            }catch (Exception $ex){
                var_dump($ex);
            }
        }
    }

    /**
     * 更新倒计时
     * @param $server swoole_server
     */
    private static function updateTimeDown(){
        /* @var $timer SwooleTimer */
        foreach(self::$timeDowns as $id => $timerData){
            $delay = $timerData[0];
            $currentDelay = $timerData[1];
            $repeatCount = $timerData[2];
            $timer = $timerData[3];

            $currentDelay++;
            if($currentDelay == $delay){
                $timerData[1] = 0;
                if($repeatCount > 0){
                    $repeatCount--;
                    if($repeatCount <= 0){
                        unset(self::$timeDowns[$id]);
                        $timer->onTimerOver(self::$server);
                        continue;
                    }else{
                        $timerData[2] = $repeatCount;
                        self::$timeDowns[$id] = $timerData;
                    }
                }
                $timer->onTimer(self::$server);
            }else{
                $timerData[1] = $currentDelay;
                self::$timeDowns[$id] = $timerData;
            }
        }
    }

    /**
     * 更新定时器
     * @param $server swoole_server
     */
    private static function updateTimer(){
        $date = self::getDate();
        /* @var $timer SwooleTimer*/
        foreach (self::$timers as $id => $timerData ) {
            $config = $timerData[0];
            $timer = $timerData[1];
            $isExecute = true;
            for($i=0;$i<7;$i++){
                if($config[$i] != "*" && $config[$i] != $date[$i]) {
                    $isExecute = false;
                    break;
                }
            }
            if($isExecute) $timer->onTimer(self::$server);
            self::$timers[$id] = $timerData;
        }
    }

    /**
     * @return array
     */
    private static function getDate(){
        return array(
            date("Y",self::$now),
            date("m",self::$now),
            date("d",self::$now),
            date("H",self::$now),
            date("i",self::$now),
            date("s",self::$now),
            date("w",self::$now)
        );
    }

}