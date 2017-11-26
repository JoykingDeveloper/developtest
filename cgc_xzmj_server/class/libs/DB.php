<?php //if (!defined('BASEPATH')) exit('403');
	class DB
	{
		/**是否开启log,默认false*/
		public $logEnable;
		/**log所在file*/
		public $logfile;
		protected $db;
		protected $result;

		protected $affectedRows = 0;
		protected $numRows = 0;
		protected $fieldCount = 0;

		function __construct($config,$logEnable=false, $logFile=null){
			$this->logfile = $logFile;
			$this->logEnable = $logEnable;

			$host = $config['host'];
			$user = $config['user'];
			$pwd = $config['pwd'];
			$db = $config['dbname'];

			$arr = explode(':', $host);
			if(count($arr)==2 && is_numeric($arr[1])){
				$this->db =  new mysqli($arr[0], $user, $pwd, $db, $arr[1]);
			}else{
				$this->db =  new mysqli($host, $user, $pwd, $db);
			}
			$errno = $this->db->connect_errno;
			if($errno) {
				$this->log("Database Connect failed:[host=$host,user=$user,pwd=$pwd,db=$db] errno=$errno errmsg=".trim(mysqli_connect_error()));
				$this->db = null;
			}else{
				$this->db->query("set names utf8");
			}
		}
		/**
		* 对$str字符串进行转义
		* */
		public function escape($str){
			return $this->db->real_escape_string($str);
		}
		/**
		 * 是否建立 mysqlli成功
		 * */
		public function isReady(){
			return $this->db!=null;
		}

		function __destruct(){
			if($this->db){
				$this->db->close();
				$this->db = null;
				if($this->result){
					$this->result->close();
					$this->result = null;
				}
			}
		}

		public function close(){
			$this->__destruct();
		}

		/**
		* 执行一条查询语句。返回结果每一列以object放入数组中最终返回
		* 返回结果[{RowValueObject},{RowValueObject},{RowValueObject}...]
		*/
		public function query($sql){
			if(stripos($sql, "insert")!=false || stripos($sql, "update")!=false){
				$this->result = null;
				return $this->execute($sql);
			}
			$this->result = null;
			$result = $this->db->query($sql);
			//echo $sql;
			$this->result = $result;
			if($result){
				$arr = array();
				//while($row = $result->fetch_array(MYSQLI_ASSOC)){
				while($row = $result->fetch_object()){
					$arr[] = $row;
				};
				$this->numRows = $result->num_rows;
				$this->fieldCount = $result->field_count;
				return $arr;
			}else{
				$this->numRows = 0;
				$this->fieldCount = 0;
				$this->log("SQL Query Error:[sql=$sql] err=".$this->db->error);
			}
			return null;
		}

		/**
		* 执行一条查询语句。返回查询结果的第一列数据，并放入一个object中。
		*/
		public function queryFirstRow($sql)
		{
			if(stripos($sql, "insert")!=false || stripos($sql, "update")!=false){
				$this->result = null;
				return $this->execute($sql);
			}
			$this->result = null;
			$result = $this->db->query($sql);
			$this->result = $result;
			if($result){
				$this->numRows = $this->result->num_rows;
				$this->fieldCount = $this->result->field_count;
				return $result->fetch_object();
			}else{
				$this->numRows = 0;
				$this->fieldCount = 0;
				$this->log("SQL Query Error:[sql=$sql] err=".$this->db->error);
			}
			return null;
		}

		/**
		* 执行sql语句，可以执行 INSERT-SQL, UPDATE-SQL, DELETE-SQL 等.
		* 执行后 DB.affected_rows()获得调用影响多少行。
		* 如果是插入语句调用DB.insert_id()得到自增id
		* @return boolean 是否执行成功
		*/
		public function execute($sql)
		{
			$this->numRows = 0;
			$this->fieldCount = 0;
			if($this->db->real_query($sql))
			{
				$this->affectedRows = $this->db->affected_rows;
				return true;
			}else{
				$this->affectedRows = 0;
				$this->log("SQL EXECUTE Error:[sql=$sql] err=".$this->db->error);
				return false;
			}
		}

		/**结果集多少列*/
		public function num_rows()
		{
			return $this->numRows;
		}

		/**影响了多少行*/
		public function affected_rows(){
			return $this->affectedRows;
		}

		/**结果集多少字段*/
		public function field_count(){
			return $this->fieldCount;
		}

		/*数据库插入后产生的自增id*/
		public function insert_id(){
			return $this->db->insert_id;
		}

		/**选择数据库*/
		public function selectDB($name){
			$this->db->select_db($name);
		}
		/**
		* 最近一次数据库调用是否成功
		*/
		public function isSuccess(){
			return $this->db && $this->db->errno==0;
		}
		/**
		* 最近一次数据库调用错误信息
		*/
		public function errorMsg(){
			return $this->db->error;
		}
		/**
		* 设置是否使用事物
		*/
		public function autocommit($mode){
			return $this->db->autocommit($mode);
		}
		/**
		* 回滚当前事物
		*/
		public function rollback(){
			return $this->db->rollback();
		}
		/**
		* 提交当前事物
		*/
		public function commit(){
			return $this->db->commit();
		}
		/**
		 * log 输出
		 * */
		public function log($msg){
			if($this->logEnable){
				if($this->logfile){
					$msg = date("Y-m-d H:i:s")."  $msg\n";
					if(is_resource($this->logfile)){//已经打开的文件
						fwrite($this->logfile,$msg."\n");
					}else{//打开文件，追加log文本
						error_log($msg, 3, $this->logfile);
					}
				}else{
					echo "$msg<br/>";
				}
			}
		}
	}
?>
