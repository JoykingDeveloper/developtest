var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MaJiang = (function (_super) {
    __extends(MaJiang, _super);
    function MaJiang() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mjVal = -1;
        _this.mjName = "";
        return _this;
    }
    MaJiang.prototype.init = function (mjVal, mjStr, color) {
        if (color === void 0) { color = 0x000000; }
        this.mjVal = mjVal;
        this.mjName = mjStr;
        var topMask = new egret.Shape();
        topMask.graphics.beginFill(color, 0.8);
        topMask.graphics.drawRect(0, 0, 50, 70);
        topMask.graphics.endFill();
        this.addChild(topMask);
        this.colorLabel = new egret.TextField();
        this.colorLabel.textColor = 0xffffff;
        this.colorLabel.width = 90;
        this.colorLabel.textAlign = "center";
        this.colorLabel.text = mjStr;
        this.colorLabel.size = 24;
        this.colorLabel.x = (this.width - this.colorLabel.width) / 2;
        this.colorLabel.y = (this.height - this.colorLabel.height) / 2;
        this.addChild(this.colorLabel);
        this.touchEnabled = true;
        this.anchorOffsetX = 25;
        this.anchorOffsetY = 35;
    };
    MaJiang.prototype.updateName = function (name) {
        this.colorLabel.text = name;
    };
    MaJiang.prototype.showTween = function () {
        egret.Tween.get(this).to({ "scaleX": 0.8, "scaleY": 0.8 }, 100, egret.Ease.backOut).call(function (obj) {
            egret.Tween.get(obj).to({ "scaleX": 1, "scaleY": 1 }, 200, egret.Ease.backOut);
        }, this, [this]);
    };
    return MaJiang;
}(egret.Sprite));
__reflect(MaJiang.prototype, "MaJiang");
//# sourceMappingURL=MaJiang.js.map