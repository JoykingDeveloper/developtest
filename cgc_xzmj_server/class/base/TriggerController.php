<?php
    /**
     * 触发器 控制器
     */
    class TriggerController {
        
        private static $triggers = array();
        
        /**
         * 添加触发器
         * */
        public static function addTrigger($uid,$tigger){
            $ts = isset(self::$triggers[$uid]) ? self::$triggers[$uid] : array();
            array_push($ts,$tigger);
            self::$triggers[$uid] = $ts;
        }
        
        /**
         * 触发
         * */
        public static function trigger($uid,$echo){
            $ts = isset(self::$triggers[$uid]) ? self::$triggers[$uid] : null;
            if($ts == null) return $echo;

            $count = count($ts);
            for ($i=0; $i < $count; $i++) {
                /* @var $tigger BaseTrigger */
                $tigger = $ts[$i];
                $result = $tigger->trigger($echo);
                if($result != null){
                    $echo[$result[0]] = $result[1];
                }
            }

            unset(self::$triggers[$uid]);

            return $echo;
        }
    }
    
?>