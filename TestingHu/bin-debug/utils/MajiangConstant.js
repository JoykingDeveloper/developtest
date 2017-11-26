var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var game;
        (function (game) {
            var qdmj_705;
            (function (qdmj_705) {
                var MajiangConstant = (function () {
                    function MajiangConstant() {
                    }
                    /**
                     * 获取麻将所处区间
                     */
                    MajiangConstant.findMajiangStartEnd = function (mjVal) {
                        if (mjVal >= 28) {
                            return [-1, -1];
                        }
                        var start = -1;
                        var end = -1;
                        var seArray = [[1, 9], [10, 18], [19, 27]];
                        var val;
                        for (var i = 0; i < 3; i++) {
                            val = seArray[i];
                            if (mjVal >= val[0] && mjVal <= val[1]) {
                                start = val[0];
                                end = val[1];
                                break;
                            }
                        }
                        return [start, end];
                    };
                    /**
                     * 获取麻将类型
                     */
                    MajiangConstant.findMajiangType = function (mjVal) {
                        if (mjVal >= 28) {
                            return 3;
                        }
                        var start = -1;
                        var end = -1;
                        var seArray = [[1, 9], [10, 18], [19, 27]];
                        var val;
                        for (var i = 0; i < 3; i++) {
                            val = seArray[i];
                            if (mjVal >= val[0] && mjVal <= val[1]) {
                                return i;
                            }
                        }
                        return -1;
                    };
                    /**
                     * 找出可以胡的牌
                     */
                    MajiangConstant.findHu = function (mjVal, mjList) {
                        var tmpMjList = MajiangConstant.clone_array(mjList);
                        if (mjVal != -1)
                            tmpMjList.push(mjVal);
                        if (MajiangConstant.huFuns == null) {
                            MajiangConstant.huFuns = [new qdmj_705.TuiDaoHuExWn()];
                        }
                        var huFuns = MajiangConstant.huFuns;
                        var len = huFuns.length;
                        for (var i = 0; i < len; i++) {
                            huFuns[i].ispao = mjVal != -1;
                            if (huFuns[i].hu(tmpMjList)) {
                                return true;
                            }
                        }
                        return false;
                    };
                    /**
                     * 获取万能牌个数
                     */
                    MajiangConstant.getWannengCount = function (mjList, wnmjVal) {
                        MajiangConstant.sortMjList(mjList, 0);
                        var wannengCount = 0;
                        var countVals = MajiangConstant.array_values_count(mjList);
                        if (countVals[wnmjVal]) {
                            wannengCount = countVals[wnmjVal];
                            mjList.splice(mjList.indexOf(wnmjVal), wannengCount);
                        }
                        return wannengCount;
                    };
                    /**
                     * 是否是万能牌
                     */
                    MajiangConstant.isWanneng = function (mjVal) {
                        return mjVal == 0;
                    };
                    /**
                     * 检测连续的元素是否存在
                     */
                    MajiangConstant.getconsecutive = function (arr, n) {
                        var m = 1;
                        var i;
                        var t;
                        for (i = 0, t = arr.length - 1; i < t; i++) {
                            m = arr[i] + 1 == arr[i + 1] ? m + 1 : 1;
                            if (m >= n)
                                return true;
                        }
                        return false;
                    };
                    /**
                     * 找出数组中每个元素的个数
                     */
                    MajiangConstant.array_values_count = function (nums) {
                        var result = {};
                        var len = nums.length;
                        var val;
                        for (var i = 0; i < len; i++) {
                            val = nums[i];
                            if (result[val] != null) {
                                result[val]++;
                            }
                            else {
                                result[val] = 1;
                            }
                        }
                        return result;
                    };
                    /**
                     * 克隆数组
                     */
                    MajiangConstant.clone_array = function (nums) {
                        var nums2 = [];
                        var len = nums.length;
                        for (var i = 0; i < len; i++) {
                            nums2.push(nums[i]);
                        }
                        return nums2;
                    };
                    /**
                     * 克隆数组
                     */
                    MajiangConstant.clone_2darray = function (nums) {
                        var nums2 = [];
                        var len = nums.length;
                        for (var i = 0; i < len; i++) {
                            nums2.push(this.clone_array(nums[i]));
                        }
                        return nums2;
                    };
                    /**
                     * 数组 indexOf 方法
                     */
                    MajiangConstant.indexOfFunc = function (huUid, huVal) {
                        var count = 0;
                        for (var i = 0; i < huUid.length; i++) {
                            var index = huUid[i];
                            if (index == huVal) {
                                count++;
                            }
                            else {
                                continue;
                            }
                        }
                        if (count > 0)
                            return true;
                        else
                            return false;
                    };
                    /**
                     * 排序
                     */
                    MajiangConstant.sortMjList = function (mjList, type) {
                        if (mjList == null || mjList.length == 0)
                            return;
                        if (type == 0) {
                            mjList.sort(function (a, b) {
                                if (a < b)
                                    return -1;
                                else if (a > b)
                                    return 1;
                                return 0;
                            });
                        }
                        else {
                            mjList.sort(function (a, b) {
                                if (a < b)
                                    return 1;
                                else if (a > b)
                                    return -1;
                                return 0;
                            });
                        }
                    };
                    return MajiangConstant;
                }());
                qdmj_705.MajiangConstant = MajiangConstant;
                __reflect(MajiangConstant.prototype, "lj.cgcp.game.qdmj_705.MajiangConstant");
            })(qdmj_705 = game.qdmj_705 || (game.qdmj_705 = {}));
        })(game = cgcp.game || (cgcp.game = {}));
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
//# sourceMappingURL=MajiangConstant.js.map