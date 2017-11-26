<?php
    /**
     * 自定义session
     */
    class SessionManager {

        const CACHE_KEY = "SessionManager";

        const SESSIONTOKEN = "sessionToken";

        /**
         * 设置一个值
         * */
        public static function setValue($sessionToken,$valueKey,$value){
            BaseDao::getRedis()->hash_hSet(SessionManager::CACHE_KEY.':'.$sessionToken, $valueKey, $value);
            BaseDao::getRedis()->setTimeout(SessionManager::CACHE_KEY.':'.$sessionToken, Values::_1DaySeconds);
        }

        /**
         * 获取一个值
         * */
        public static function getValue($sessionToken,$valueKey){
            return BaseDao::getRedis()->hash_hGet(SessionManager::CACHE_KEY.':'.$sessionToken, $valueKey);
        }

        /**
         * 删除一个值
         * */
        public static function delValue($sessionToken,$valueKey){
            BaseDao::getRedis()->hash_hDel(SessionManager::CACHE_KEY.':'.$sessionToken, $valueKey);
        }
        
        public static function clearValues($sessionToken){
            BaseDao::getRedis()->del(SessionManager::CACHE_KEY.':'.$sessionToken);
        }

        /**
         * 生成 sessionToken
         * */
        public static function genSessionToken($uid){
            $sessionToken = BaseDao::getRedis()->str_Get('SESSIONTOKEN:'.$uid);
			if($sessionToken != null){
				self::clearValues($sessionToken);
			}
            $sessionToken = md5(uniqid());
            BaseDao::getRedis()->str_Set('SESSIONTOKEN:'.$uid, $sessionToken,Values::_1DaySeconds);
            return $sessionToken;
        }
		
		/**
         * 剔除玩家下线
         * */
        public static function offLine($uid){
            $sessionToken = self::genSessionToken($uid);
            self::clearValues($sessionToken);
        }

    }

?>