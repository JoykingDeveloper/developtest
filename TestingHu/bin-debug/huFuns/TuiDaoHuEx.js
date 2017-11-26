var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var game;
        (function (game) {
            var qdmj_705;
            (function (qdmj_705) {
                var TuiDaoHuEx = (function (_super) {
                    __extends(TuiDaoHuEx, _super);
                    function TuiDaoHuEx() {
                        var _this = _super !== null && _super.apply(this, arguments) || this;
                        _this.zhaopupaiCount = 0;
                        return _this;
                    }
                    /**
                     * 胡牌
                     */
                    TuiDaoHuEx.prototype.hu = function (mjList) {
                        var mjListModel = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
                        //将一维数组转换成二维
                        var len = mjList.length;
                        for (var i = 0; i < len; i++) {
                            mjListModel[Math.floor(mjList[i] / 9)][0]++;
                            mjListModel[Math.floor(mjList[i] / 9)][mjList[i] % 9]++;
                        }
                        var jiangPos = -1;
                        var yuShu = 0;
                        var jiangExt = false;
                        //有且仅有一组牌能做将，数量余数必须为2
                        for (var i = 0; i < 4; i++) {
                            if (mjListModel[i][0] > 0 && mjListModel[i][0] % 3 == 1) {
                                return false;
                            }
                            if (mjListModel[i][0] > 0 && mjListModel[i][0] % 3 == 2) {
                                if (!jiangExt) {
                                    jiangPos = i;
                                    jiangExt = true;
                                }
                                else {
                                    return false;
                                }
                            }
                        }
                        //没有将牌
                        if (jiangPos == -1) {
                            return false;
                        }
                        for (var i = 0; i < 4; i++) {
                            if (i != jiangPos) {
                                if (!this.zhaoPuPai(mjListModel[i], i == 3)) {
                                    egret.log("zhaoPuPaiCount:" + this.zhaopupaiCount);
                                    return false;
                                }
                            }
                        }
                        var success = false;
                        for (var i = 1; i < 10; i++) {
                            if (mjListModel[jiangPos][i] >= 2) {
                                var _mjlistmodel = qdmj_705.MajiangConstant.clone_array(mjListModel[jiangPos]);
                                _mjlistmodel[i] -= 2;
                                _mjlistmodel[0] -= 2;
                                if (this.zhaoPuPai(_mjlistmodel, jiangPos == 3)) {
                                    success = true;
                                }
                                if (success) {
                                    break;
                                }
                            }
                        }
                        egret.log("zhaoPuPaiCount:" + this.zhaopupaiCount);
                        return success;
                    };
                    TuiDaoHuEx.prototype.zhaoPuPai = function (mjListModel, isWord) {
                        this.zhaopupaiCount++;
                        if (mjListModel[0] == 0) {
                            return true;
                        }
                        var i = 1;
                        for (; i < 10; i++) {
                            if (mjListModel[i] != 0) {
                                break;
                            }
                        }
                        var result = false;
                        if (mjListModel[i] >= 3) {
                            var _mjlistmodel = qdmj_705.MajiangConstant.clone_array(mjListModel);
                            _mjlistmodel[i] -= 3;
                            _mjlistmodel[0] -= 3;
                            result = this.zhaoPuPai(_mjlistmodel, isWord);
                            return result;
                        }
                        if (!isWord && i < 8 && (mjListModel[i + 1] > 0) && (mjListModel[i + 2] > 0)) {
                            var _mjlistmodel = qdmj_705.MajiangConstant.clone_array(mjListModel);
                            _mjlistmodel[i] -= 1;
                            _mjlistmodel[i + 1] -= 1;
                            _mjlistmodel[i + 2] -= 1;
                            _mjlistmodel[0] -= 3;
                            result = this.zhaoPuPai(_mjlistmodel, isWord);
                            return result;
                        }
                        return result;
                    };
                    return TuiDaoHuEx;
                }(qdmj_705.BaseHu));
                qdmj_705.TuiDaoHuEx = TuiDaoHuEx;
                __reflect(TuiDaoHuEx.prototype, "lj.cgcp.game.qdmj_705.TuiDaoHuEx");
            })(qdmj_705 = game.qdmj_705 || (game.qdmj_705 = {}));
        })(game = cgcp.game || (cgcp.game = {}));
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
//# sourceMappingURL=TuiDaoHuEx.js.map