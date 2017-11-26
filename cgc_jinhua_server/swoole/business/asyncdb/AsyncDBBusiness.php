<?php

/**
 *
 * 异步sql写入
 *
 * User: zmliu1
 * Date: 16/7/1
 * Time: 15:16
 */
class AsyncDBBusiness extends BaseBusiness {

    private $processCount = 4;

    /**
     * 当服务 启动
     * @param $swProxyServer SwooleProxyServer
     * @param $work_id int
     */
    public function init($swProxyServer,$work_id){
        require_once __DIR__ . "/../../../class/autoloader.php";
        autoloader::init();

        for($i = 0 ;$i < $this->processCount ; $i++){

            $process = new swoole_process(function(swoole_process $process_worker){
                $currentIndex = rand(0,RedisShardProxyConfig::$redis_count - 1);
                while(true){
                    $redis = BaseDao::getRedis()->getRedisByIndex($currentIndex);
                    $json = $redis->list_rPop("asyncSql");
                    if($json != null){
                        $arr = json_decode($json,true);
                        $key = $arr[0];
                        $sql = $arr[1];
                        $mysql = BaseDao::getDB()->getMySqlByKey($key);
                        $mysql->ExecuteSQL($sql);
                        if($mysql->lastError != null){
                            $time = time();
                            echo date("Y-m-d H:i:s",mktime(date("H", $time),date("i", $time),date("s", $time),date("m", $time),date("d", $time),date("Y", $time)));
                            echo "SqlError:" . $sql . "\n";
                            var_dump($mysql->lastError);
                            $mysql->lastError = null;
                        }

                        $currentIndex++;
                        if($currentIndex >= RedisShardProxyConfig::$redis_count){
                            $currentIndex = 0;
                        }

                    }else{
                        sleep(1);
                    }
                }
            });

            if(isset(SwooleSetting::$setting["process_title"])){
                $process->name(SwooleSetting::$setting["process_title"] . "_process_" . $i);
            }

            $process->start();
        }
    }


}