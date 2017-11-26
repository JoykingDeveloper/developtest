<?php

class BaseService{

	/* @var $swooleProxy SwooleProxyServer */
	protected $swooleProxy;
	protected $fd;

	protected $apiFuncs = array();

	//请求者的uid
	public $requestUid;
	//请求者账号
	public $requestAccount;
	//请求者渠道
	public $requestCid;
	//请求者VersionCode
	public $requestVersionCode;
	//请求者VersionName
	public $requestVersionName;

	public function initSwooleProxy($proxy,$fd){
		$this->swooleProxy = $proxy;
		$this->fd = $fd;
	}

	//是否有C方法
	public function hasC($c){
		return isset($this->apiFuncs[$c]);
	}

	public function excute($c,$uid,$request){

		$this->requestUid = $uid;
		$this->requestAccount = $this->getRequestValue('account',$request);
		$this->requestCid = abs((int)$this->getRequestValue('cid',$request));
		$this->requestVersionCode = $this->getRequestValue('vCode',$request);
		$this->requestVersionName = $this->getRequestValue('vName',$request);

		if(isset($this->apiFuncs[$c])){
			return $this->$c($request);
		}
		return array('state'=>StateConstant::STATE_C_ERROR);
	}

	/**
	 * 检测参数
	 * */
	public function checkParams($request,$params){
		$count = count($params);
		for ($i=0; $i < $count; $i++) {
			if(!isset($request[$params[$i]])){
				return false;
			}
		}
		return true;
	}

	public function getRequestValue($key,$request){
		return isset($request[$key]) ? $request[$key] : "";
	}
}
?>