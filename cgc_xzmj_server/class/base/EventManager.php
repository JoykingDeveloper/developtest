<?php
    /**
     * 事件管理中心
     */
    class EventManager {
        private static $events = array();
		private static $isInit = false;
		
		/**
		 * 注册事件
		 * @param	$event string 事件名称
		 * @param	$class string 类名称
		 * @param	$fun string 方法名
		 * */
		public static function addEvent($event,$class,$fun){
			$funList = isset(self::$events[$event]) ? self::$events[$event] : array();
			array_push($funList,array($class,$fun));
			self::$events[$event] = $funList;
		}
		
		/**
		 * 派发事件
		 * @param	$event string 时间名称
		 * @param	$data array 事件携带的数据
		 * */
		public static function dispatchEvent($event,$data){
			if(!self::$isInit){
				EventConfig::initEvents();
				self::$isInit = true;
			}
			if(isset(self::$events[$event])){
				$funList = self::$events[$event];
				$count = count($funList);
				foreach ($funList as $index => $value) {
					$c = new $value[0]();
					$c->$value[1]($event,$data);
				}
			}
			
		}
		
    }
    
?>