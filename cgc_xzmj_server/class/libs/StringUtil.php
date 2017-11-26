<?php
    /**
     * 字符串工具
     */
    class StringUtil {

        public static function startWith($str,$char){
            return strpos($str, $char) === 0;
        }

    }

?>