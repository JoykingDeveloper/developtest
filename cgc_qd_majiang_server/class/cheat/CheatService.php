<?php
header("Content-type: text/html; charset=utf-8");

define('BASEPATH', 1);

require_once '../autoloader.php';

date_default_timezone_set("PRC");

autoloader::init();

if(!CheatConfig::$_isCheat){ //判断作弊开关是否开启了
    echo '该功能已关闭，请联系管理员！';
    echo '<br/>';
    echo '<br/>';
    echo '<a href="javascript:history.back(-1)" style="color:#95D8FB">返回上一页</a>';
    die;
}
$request = $_POST;
if(empty($request)){
    echo '异常数据';
    echo '<br/>';
    echo '<br/>';
    echo '<a href="javascript:history.back(-1)" style="color:#95D8FB">返回上一页</a>';
    die;
}

$uid = (int)$request['user_id'];
unset($request['user_id']);
$_href = $request['_href'];
unset($request['_href']);
if(!$uid || !$_href){
    echo '玩家ID异常';
    echo '<br/>';
    echo '<br/>';
    echo '<a href="javascript:history.back(-1)" style="color:#95D8FB">返回上一页</a>';
    die;
}
$isCheat = (isset($request['cheat']) && $request['cheat'] == 1) ? true : false;
unset($request['cheat']);
$type = (isset($request['type']) && $request['type'] != '') ? $request['type'] : '';
unset($request['type']);

//判断是那种类型的作弊
switch ($type){
    case 'fapai': //发手牌作弊
        $userCheatCard = array();
        foreach ($request as $v){
            if(count($v) == 2){
                for($i = 0; $i < $v[1]; $i++){
                    array_push($userCheatCard, $v[0]);
                }
            }
        }
        if(count($userCheatCard) > 13){
            echo '选牌不能超过13张牌';
            echo '<br/>';
            echo '<br/>';
            echo '<a href="javascript:history.back(-1)" style="color:#95D8FB">返回上一页</a>';
            die;
        }
        CheatDao::delCheat(trim($uid));
        $cheat = CheatConstant::createCheat(trim($uid), $userCheatCard, $isCheat);
        $aa = CheatDao::updateCheat($cheat);
        echo '数据保存成功';
        echo '<br/>';
        echo '<br/>';
        echo '<a href="javascript:history.back(-1)" style="color:#95D8FB">返回上一页</a>';
        die;
        break;
    case 'mopai': //摸牌出牌时作弊
        $userCheatCard = isset($request['xuan_mj']) ? $request['xuan_mj'] : array();
        if(empty($userCheatCard)){
            echo '没有选择作弊的牌';
            echo '<br/>';
            echo '<br/>';
            echo '<a href="javascript:history.back(-1)" style="color:#95D8FB">返回上一页</a>';
            die;
        }
        $counts = array_count_values($userCheatCard);
        foreach($counts as $mj => $num){
            if($num > 4){
                echo '麻将'.$mj.'张数大于4张，非法！！！';
                echo '<br/>';
                echo '<br/>';
                echo '<a href="javascript:history.back(-1)" style="color:#95D8FB">返回上一页</a>';
                die;
            }
        }
        
        CheatDao::delCheat(trim($uid), 'getNewMj');
        $cheat = CheatConstant::getNewMjCheat(trim($uid), $userCheatCard, $isCheat);
        $aa = CheatDao::updateCheat($cheat, 'getNewMj');
        echo '数据保存成功';
        echo '<br/>';
        echo '<br/>';
        echo '<a href="javascript:history.back(-1)" style="color:#95D8FB">返回上一页</a>';
        die;
        break;
    default :
        echo '异常操作';
        echo '<br/>';
        echo '<br/>';
        echo '<a href="javascript:history.back(-1)" style="color:#95D8FB">返回上一页</a>';
        die;
        break;
}




