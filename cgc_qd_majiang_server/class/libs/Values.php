<?php
    /**
     * 一些常量
     */
    class Values {

        /**
         * 1分钟的秒数
         * */
        const _1Minute = 60;

        /**
         * 1个小时的秒数
         * */
        const _1HourSeconds = 3600;
        
        /**
         * 15分钟的秒数
         */
        const _15MinuteSeconds = 900;

        /** 3小时的秒数 */
        const _3HourSeconds = 10800;

        /**
         * 1天的秒数
         * */
        const _1DaySeconds = 86400;

        /**
         * 7天的秒数
         * */
        const _7DaySeconds = 604800;
        
        /**
         * 30天的描述
         */
        const _30DaySeconds = 2592000;
        
        /**
         * 随机一个不重复的字符串
         * */
        public static function randomString(){
            return uniqid();
        }

    }

?>