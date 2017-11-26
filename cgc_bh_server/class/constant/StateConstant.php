<?php

/**
 * 返回状态常亮
 */
class StateConstant
{

    /**
     * 调用成功
     * */
    const STATE_SUCCESS = 0;

    /**
     * api错误
     * */
    const STATE_API_ERROR = -1;

    /**
     * 方法传递错误
     */
    const STATE_C_ERROR = -2;

    /**
     * 参数不足
     * */
    const STATE_PARAMS_ERROR = -3;

    /**
     * 参数非法
     * */
    const STATE_PARAMS_ERROR2 = -4;

    /**
     * 请先登陆
     * */
    const STATE_NOT_LOGING = -5;
    /**
     * 牌型错误
     * */
    const OUTCARDS_ERROR = -6;

    /**
     * 不是当前操作者
     * */
    const NO_CURRENTUID = -7;

    /**
     * 不是当前状态
     * */
    const NO_CURRENTSTATE = -8;

    /**
     * 叫分不合法
     * */
    const SCORE_IS_ERROR = -9;

}

?>