<?php
/*
 *  Copyright (C) 2012
 *     Ed Rackham (http://github.com/a1phanumeric/PHP-MySQL-Class)
 *  Changes to Version 0.8.1 copyright (C) 2013
 *	Christopher Harms (http://github.com/neurotroph)
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// MySQL Class v0.8.1
class MySQL {

    public static $selectCount = 0;

    // Base variables
    var $lastError;
    // Holds the last error
    var $lastQuery;
    // Holds the last query
    var $result;
    // Holds the MySQL query result
    var $records;
    // Holds the total number of records returned
    var $affected;
    // Holds the total number of records affected
    var $rawResults;
    // Holds raw 'arrayed' results
    var $arrayedResult;
    // Holds an array of the result

    var $hostname;
    // MySQL Hostname
    var $username;
    // MySQL Username
    var $password;
    // MySQL Password
    var $database;
    // MySQL Database

    var $databaseLink;
    // Database Connection Link

    private $persistant = false;

    /* *******************
     * Class Constructor *
     * *******************/

    function __construct($database, $username, $password, $hostname, $persistant = false) {
        $this -> database = $database;
        $this -> username = $username;
        $this -> password = $password;
        $this -> hostname = $hostname;
        $this -> persistant = $persistant;

        $this -> Connect();
    }

    /* *******************
     * Private Functions *
     * *******************/

    // Connects class to database
    // $persistant (boolean) - Use persistant connection?
    private function Connect() {
        $this -> CloseConnection();

        if ($this -> persistant) {
            $this -> databaseLink = mysql_pconnect($this -> hostname, $this -> username, $this -> password);
            if(!mysql_ping($this -> databaseLink)){
                $this -> databaseLink = mysql_pconnect($this -> hostname, $this -> username, $this -> password);
            }
        } else {
            $this -> databaseLink = mysql_connect($this -> hostname, $this -> username, $this -> password, true);
        }

        if (!$this -> databaseLink) {
            $this -> lastError = 'Could not connect to server: ' . mysql_error($this -> databaseLink);
            return false;
        }

        if (!$this -> UseDB()) {
            $this -> lastError = 'Could not connect to database: ' . mysql_error($this -> databaseLink);
            return false;
        }

        mysql_query("set names utf8");

        return true;
    }

    // Select database to use
    private function UseDB() {
        if (!mysql_select_db($this -> database, $this -> databaseLink)) {
            $this -> lastError = 'Cannot select database: ' . mysql_error($this -> databaseLink);
            return false;
        } else {
            return true;
        }
    }

    // Performs a 'mysql_real_escape_string' on the entire array/string
    private function SecureData($data) {
        if (is_array($data)) {
            foreach ($data as $key => $val) {
                if (!is_array($data[$key])) {
                    $data[$key] = mysql_real_escape_string($data[$key], $this -> databaseLink);
                }
            }
        } else {
            $data = mysql_real_escape_string($data, $this -> databaseLink);
        }
        return $data;
    }

    /* ******************
     * Public Functions *
     * ******************/

    // Executes MySQL query
    function ExecuteSQL($query, $isSelect = false, $ArrayResult = false) {
        $this -> lastQuery = $query;
        if ($this -> result = mysql_query($query, $this -> databaseLink)) {
            $this -> records = @mysql_num_rows($this -> result);
            $this -> affected = @mysql_affected_rows($this -> databaseLink);
            if ($this -> records > 0) {
                $this -> ArrayResults($ArrayResult);
                return $this -> arrayedResult;
            } else if ($isSelect) {
                return null;
            } else {
                return true;
            }
        } else {
            $this -> lastError = mysql_error($this -> databaseLink);
            if(strpos($this->lastError,'MySQL server has gone away') !== false){
                if($this->Connect()){
                    return $this->ExecuteSQL($query,$isSelect,$ArrayResult);
                }
            }
            return false;
        }
    }

    function InsertSql($vars, $table, $exclude = '') {
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

    // Adds a record to the database based on the array key names
    function Insert($vars, $table, $exclude = '') {
        $query = $this -> InsertSql($vars, $table, $exclude);
        if ($query) {
            return $this -> ExecuteSQL($query);
        }
        return $query;
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

    // Deletes a record from the database
    function Delete($table, $where, $limit = '', $like = false) {
        $query = $this -> DeleteSql($table, $where, $limit, $like);
        if ($query) {
            return $this -> ExecuteSQL($query);
        }
        return $query;
    }

    /**
     * 生成一个查询语句
     * */
    function SelectSql($from, $cols, $where, $orderBy = '', $limit = '', $like = false, $operand = 'AND') {
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
    function SelectOne($from, $cols, $where, $orderBy = '', $limit = '', $like = false, $operand = 'AND') {
        return $this -> Select($from, $cols, $where, $orderBy, $limit, $like, $operand, true);
    }

    // Gets a single row from $from where $where is true
    function Select($from, $cols, $where, $orderBy = '', $limit = '', $like = false, $operand = 'AND', $ArrayResult = false) {
        self::$selectCount++;
        $query = $this -> SelectSql($from, $cols, $where, $orderBy, $limit, $like, $operand);
        if ($query) {
            return $this -> ExecuteSQL($query, true, $ArrayResult);
        }
        return $query;
    }

    /**
     * 获取一条更新语句
     * */
    function UpdateSql($table, $set, $where, $exclude = '') {
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

    // Updates a record in the database based on WHERE
    function Update($table, $set, $where, $exclude = '') {
        $query = $this -> UpdateSql($table, $set, $where, $exclude);
        if ($query) {
            return $this -> ExecuteSQL($query);
        }
        return $query;
    }

    // 'Arrays' a single result
    function ArrayResult() {
        $this -> arrayedResult = mysql_fetch_assoc($this -> result) or die(mysql_error($this -> databaseLink));
        return $this -> arrayedResult;
    }

    // 'Arrays' multiple result
    function ArrayResults($ArrayResult) {

        // if ($ArrayResult && $this -> records == 1) {
        if ($ArrayResult) {
            return $this -> ArrayResult();
        }

        $this -> arrayedResult = array();
        while ($data = mysql_fetch_assoc($this -> result)) {
            $this -> arrayedResult[] = $data;
        }
        return $this -> arrayedResult;
    }

    // 'Arrays' multiple results with a key
    function ArrayResultsWithKey($key = 'id') {
        if (isset($this -> arrayedResult)) {
            unset($this -> arrayedResult);
        }
        $this -> arrayedResult = array();
        while ($row = mysql_fetch_assoc($this -> result)) {
            foreach ($row as $theKey => $theValue) {
                $this -> arrayedResult[$row[$key]][$theKey] = $theValue;
            }
        }
        return $this -> arrayedResult;
    }

    // Returns last insert ID
    function LastInsertID() {
        return mysql_insert_id();
    }

    // Return number of rows
    function CountRows($from, $where = '') {
        $result = $this -> Select($from, $where, '', '', false, 'AND', 'count(*)');
        return $result["count(*)"];
    }

    // Closes the connections
    function CloseConnection() {
        if ($this -> databaseLink) {
            mysql_close($this -> databaseLink);
        }
    }

}
?>
