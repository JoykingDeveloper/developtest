<?php

/**
 *
 * mysql分片代理
 *
 * User: zmliu1
 * Date: 16/6/21
 * Time: 14:40
 */
class MySQLShardProxy{

    public static $logSqlError = true;

    private static $dbs = array();


    /**
     * @return MySQL
     */
    private function getDB($dbConf){
        $database = $dbConf['dbname'];
        $user = $dbConf['user'];
        $pwd = $dbConf['pwd'];
        $host = $dbConf['host'];

        $db_key = "$host --> $database";

        /* @var $db MySQL */
        if(isset(self::$dbs[$db_key])){
            $db = self::$dbs[$db_key];
            return $db;
        }

        $db = new MySQL($database,$user,$pwd,$host);
        if($db->lastError != null) {
            echo "DataBase connect error \n";
            echo $db->lastError . "\n";
            exit(0);
        }
        self::$dbs[$db_key] = $db;
        return $db;
    }

    private function getKeyIndex($key){
        return MySQLFlexihashHelper::getIndex($key);
    }

    public function getMySqlByKey($key){
        $index = $this->getKeyIndex($key);
        return $this->getDB(MySQLShardProxyConfig::$configs[$index]);
    }

    public function getMySqlByIndex($index){
        return $this->getDB(MySQLShardProxyConfig::$configs[$index]);
    }


    private function SecureData($data) {
        $index = rand(0,MySQLShardProxyConfig::$mysql_count - 1);
        if (is_array($data)) {
            foreach ($data as $key => $val) {
                if (!is_array($data[$key])) {
                    $data[$key] = mysql_real_escape_string($data[$key],$this->getMySqlByIndex($index)->databaseLink);
                }
            }
        } else {
            $data = mysql_real_escape_string($data,$this->getMySqlByIndex($index)->databaseLink);
        }
        return $data;
    }

    /**
     * @param string $key
     * @param string $query
     * @param bool|false $isSelect
     * @param bool|false $ArrayResult
     * @return bool|null
     */
    public function ExecuteSQL($key, $query, $isSelect = false, $ArrayResult = false) {
        $db = $this->getMySqlByKey($key);
        $db->lastError = null;
        $result = $db->ExecuteSQL($query,$isSelect,$ArrayResult);
        if($db->lastError != null){
            if(self::$logSqlError){
                $time = time();
                echo date("Y-m-d H:i:s",mktime(date("H", $time),date("i", $time),date("s", $time),date("m", $time),date("d", $time),date("Y", $time)));
                echo "SqlError:" . $query . "\n";
                var_dump($db->lastError);
            }
        }
        return $result;
    }

    public function InsertSql($vars, $table, $exclude = '') {
        // Catch Exclusions
        if ($exclude == '') {
            $exclude = array();
        }

        array_push($exclude, 'MAX_FILE_SIZE');
        // Automatically exclude this one

        // Prepare Variables
        $vars = $this -> SecureData($vars);

        $query = "INSERT IGNORE INTO `{$table}` SET ";
        foreach ($vars as $key => $value) {
            if (in_array($key, $exclude)) {
                continue;
            }
            //$query .= '`' . $key . '` = "' . $value . '", ';
            $query .= "`{$key}` = '{$value}', ";
        }

        $query = substr($query, 0, -2);

        return $query;
    }

    public function Insert($key, $vars, $table, $exclude = '') {
        $db = $this->getMySqlByKey($key);
        return $db->Insert($vars, $table, $exclude);
    }

    /**
     * 获取一个删除语句
     * */
    function DeleteSql($table, $where, $limit = '', $like = false) {
        $query = "DELETE FROM `{$table}` WHERE ";
        if (is_array($where) && $where != '') {
            // Prepare Variables
            $where = $this -> SecureData($where);

            foreach ($where as $key => $value) {
                if ($like) {
                    //$query .= '`' . $key . '` LIKE "%' . $value . '%" AND ';
                    $query .= "`{$key}` LIKE '%{$value}%' AND ";
                } else {
                    //$query .= '`' . $key . '` = "' . $value . '" AND ';
                    $query .= "`{$key}` = '{$value}' AND ";
                }
            }

            $query = substr($query, 0, -5);
        }

        if ($limit != '') {
            $query .= ' LIMIT ' . $limit;
        }
        return $query;
    }

    public function Delete($key, $table, $where, $limit = '', $like = false) {
        $db = $this->getMySqlByKey($key);
        return $db->Delete($table, $where, $limit, $like);
    }

    /**
     * 生成一个查询语句
     * */
    public function SelectSql($from, $cols, $where, $orderBy = '', $limit = '', $like = false, $operand = 'AND') {
        // Catch Exceptions
        if (trim($from) == '') {
            return false;
        }

        $query = "SELECT {$cols} FROM `{$from}` WHERE ";

        if (is_array($where) && $where != '') {
            // Prepare Variables
            $where = $this -> SecureData($where);

            foreach ($where as $key => $value) {
                if ($like) {
                    //$query .= '`' . $key . '` LIKE "%' . $value . '%" ' . $operand . ' ';
                    $query .= "`{$key}` LIKE '%{$value}%' {$operand} ";
                } else {
                    //$query .= '`' . $key . '` = "' . $value . '" ' . $operand . ' ';
                    $query .= "`{$key}` = '{$value}' {$operand} ";
                }
            }

            $query = substr($query, 0, -(strlen($operand) + 2));

        } else {
            $query = substr($query, 0, -6);
        }

        if ($orderBy != '') {
            $query .= ' ORDER BY ' . $orderBy;
        }

        if ($limit != '') {
            $query .= ' LIMIT ' . $limit;
        }

        return $query;
    }

    /**
     * 查询一条数据
     * */
    public function SelectOne($key, $from, $cols, $where, $orderBy = '', $limit = '', $like = false, $operand = 'AND') {
        return $this->Select($key, $from, $cols, $where, $orderBy, $limit, $like, $operand, true);
    }

    public function Select($key, $from, $cols, $where, $orderBy = '', $limit = '', $like = false, $operand = 'AND', $ArrayResult = false) {
        $db = $this->getMySqlByKey($key);
        return $db->Select($from, $cols, $where, $orderBy, $limit, $like, $operand, $ArrayResult);
    }

    /**
     * 获取一条更新语句
     * */
    public function UpdateSql($table, $set, $where, $exclude = '') {
        // Catch Exceptions
        if (trim($table) == '' || !is_array($set) || !is_array($where)) {
            return false;
        }
        if ($exclude == '') {
            $exclude = array();
        }

        array_push($exclude, 'MAX_FILE_SIZE');
        // Automatically exclude this one

        $set = $this -> SecureData($set);
        $where = $this -> SecureData($where);

        // SET

        $query = "UPDATE `{$table}` SET ";

        foreach ($set as $key => $value) {
            if (in_array($key, $exclude)) {
                continue;
            }
            $query .= "`{$key}` = '{$value}', ";
        }

        $query = substr($query, 0, -2);

        // WHERE

        $query .= ' WHERE ';

        foreach ($where as $key => $value) {
            $query .= "`{$key}` = '{$value}' AND ";
        }

        $query = substr($query, 0, -5);

        return $query;
    }

    public function Update($key, $table, $set, $where, $exclude = '') {
        $db = $this->getMySqlByKey($key);
        return $db->Update($table, $set, $where, $exclude);
    }




}