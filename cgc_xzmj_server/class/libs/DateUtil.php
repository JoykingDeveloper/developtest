<?php

	class DateUtil{
		/*
		 * 获取一个时间字符串，并且加上相应的数值
		 * $s 需要增加的秒数
		 * $i 需要增加的分钟数
		 * $H 需要增加的小时数
		 * $d 需要增加的天数
		 * $m 需要增加的月数
		 * $Y 需要增加的年数
		 * */
		public static function makeTime($s=0,$i=0,$H=0,$d=0,$m=0,$Y=0){
		    $time = time();
			return date("Y-m-d H:i:s",mktime(date("H", $time) + $H
											,date("i", $time) + $i
											,date("s", $time) + $s
											,date("m", $time) + $m
											,date("d", $time) + $d
											,date("Y", $time) + $Y));
		}


		/**
		 * 获取两个时间之间相差的秒数
		 * */
		public static function minusTime($date1,$date2){
			$s1 = strtotime($date1);
			$s2 = strtotime($date2);
			return $s1 - $s2;

			//echo strtotime("2012-12-13 17:28:23").'<br>';
			//echo date("Y-m-d H:i:s",strtotime("2012-12-13 17:28:23"));
		}

        /**
         * 获取当前年
         * */
        public static function year(){
            return date("Y", time());
        }

        /**
         * 获取当前月
         * */
        public static function month(){
            return date("m", time());
        }

        /**
         * 获取当前日
         * */
        public static function day(){
            return date("d", time());
        }

        /**
         * 获取当前时
         * */
        public static function hour(){
            return date("H", time());
        }

        /**
         * 获取当前分
         * */
        public static function minute(){
            return date("i", time());
        }

        /**
         * 获取当前秒
         * */
        public static function second(){
            return date("s", time());
        }

		/**
		 * 获取当前是世界时间的第几天
		 * @return int
		 */
		public static function currentDay($time = null){
			if($time == null){
				return (int)(time() / 86400);
			}
			return (int)($time / 86400);
		}
        
        /**
         * 获取日期
         * @param $time 时间
         */
        public static function dateTime($time = null){
            if ($time == null) {
                $time = time();
            }
            return date("Y-m-d", mktime(date("H", 0) ,date("i", 0) ,date("s", 0) ,date("m", $time) ,date("d", $time) ,date("Y", $time)));
        }
        
        /**
         * 当前时间增加时间
         * @param $sceonds 变化的秒数
         * @param $timestamp 需要修改的时间戳[default=time()]
         */
        public static function plusSceonds($sceonds, $timestamp = null) {
            if ($timestamp == null) {
                $timestamp = time();
            }
            return date("Y-m-d H:i:s", mktime(date("H", $timestamp), date("i", $timestamp),(date("s", $timestamp) + $sceonds), date("m", $timestamp), date("d", $timestamp), date("Y", $timestamp)));
        }
		
		/**
		 * 是否通过某时间
	     * @param $timeLastRefresh 上一次刷新时间【时间戳】
	     * @param $points 【时间点数组】
	     * @param $time_now 当前时间 【时间戳】
		 * 
		 * 见 -> thiefConstant::logicCheckAndRefresh(...);
		 */
		public static function isThrowTime($timeLastRefresh, $points, $time_now = null) {
			$isCanRefresh = FALSE;
	        if ($timeLastRefresh == null) {
	            $isCanRefresh = TRUE;
	        } else {
	            if ($time_now == null) {
	                $time_now = time();
	            }
	            if ($timeLastRefresh < $time_now) {
	                $pCount = count($points);
	                for ($i = 0; $i < $pCount; $i++) {
	                    $str_time = is_numeric($points[$i]) ? $points[$i] . ':00:00' : $points[$i];
	                    // 跨天
	                    $date_last = DateUtil::dateTime($timeLastRefresh);
	                    if ($date_last != DateUtil::dateTime($time_now)) {
	                        $str_time = $date_last . ' ' . $str_time;
	                    }
	                    $point_time = strtotime($str_time);
	                    if ($timeLastRefresh < $point_time && $time_now >= $point_time) {
	                        $isCanRefresh = TRUE;
	                        break;
	                    }
	                }
	            }
	        }
	        return $isCanRefresh;
		}
		
		/**
		 * 是否在当天某个时间段
		 * @param $points 时间段数组
		 * @param $timestamp 时间 （时间戳）
		 */
		public static function isBetweenTime($points, $timestamp = null) {
			if ($timestamp == null) {
				$timestamp = time();
			}
			$pCount = count($points);
			for ($i=0; $i < $pCount; $i += 2) {
				$tA = is_numeric($points[$i]) ? $points[$i] . ':00:00' : $points[$i];
				$tB = is_numeric($points[$i + 1]) ? $points[$i + 1] . ':00:00' : $points[$i + 1];
				$time_a = strtotime($tA);
				$time_b = strtotime($tB);
				if (($timestamp < $time_a) || ($timestamp > $time_b)) {
					return FALSE;
				}
			}
			return TRUE;
		}
		




	}

?>