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

}

?>