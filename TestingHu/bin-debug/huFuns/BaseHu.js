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
                /**
                 * 胡牌顶级类
                 */
                var BaseHu = (function () {
                    function BaseHu() {
                        /** 将牌集合 */
                        this._258Vals = [2, 5, 8, 11, 14, 17, 20, 23, 26];
                        this._258Len = 9;
                        this.ispao = false;
                    }
                    /**
                     * 胡牌
                     */
                    BaseHu.prototype.hu = function (mjList) {
                        return false;
                    };
                    /**
                     * 是否有258里面的牌
                     */
                    BaseHu.prototype.has258 = function (mjList, continueVal) {
                        if (continueVal === void 0) { continueVal = -1; }
                        return true;
                        // var len:number = mjList.length;
                        // var mjVal:number;
                        // for(var i:number = 0; i < len ; i++){
                        // 	mjVal = mjList[i];
                        // 	if(mjVal == continueVal){
                        // 		continue;
                        // 	}
                        // 	if(this._258Vals.indexOf(mjVal) != -1){
                        // 		return true;
                        // 	}
                        // }
                        // return false;
                    };
                    /**
                     * 是否是258牌
                     */
                    BaseHu.prototype.is258 = function (mjVal) {
                        return true;
                        // return this._258Vals.indexOf(mjVal) != -1;
                    };
                    /**
                     * 检测牌型
                     */
                    BaseHu.prototype.checkType = function (mjList) {
                        return false;
                    };
                    /**
                     * 找听牌
                     */
                    BaseHu.prototype.findTing = function (mjList) {
                        return null;
                    };
                    return BaseHu;
                }());
                qdmj_705.BaseHu = BaseHu;
                __reflect(BaseHu.prototype, "lj.cgcp.game.qdmj_705.BaseHu");
            })(qdmj_705 = game.qdmj_705 || (game.qdmj_705 = {}));
        })(game = cgcp.game || (cgcp.game = {}));
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
//# sourceMappingURL=BaseHu.js.map