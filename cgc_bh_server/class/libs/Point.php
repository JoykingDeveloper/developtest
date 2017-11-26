<?php
    /**
     * 
     */
    class Point {
        
        public $x;
        public $y;
        
        /**
         * 获取两点间直线距离 
         */     
        public static function distance($x1,$y1,$x2,$y2){
            $a = $x1 - $x2;
            $b = $y2 - $y2;
            return sqrt($a*$a+$b*$b);
        }
        
    }
    
?>