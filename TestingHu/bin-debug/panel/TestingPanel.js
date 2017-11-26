var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TestingPanel = (function (_super) {
    __extends(TestingPanel, _super);
    function TestingPanel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mjListData = [];
        _this.mjObjArray = [];
        _this.ziMj = ["中", "发", "白", "东", "南", "西", "北"];
        _this.huaArr = ["万", "条", "筒"];
        _this.wnMj = -1;
        _this.wnSetBtn = null;
        _this.setting = false;
        return _this;
    }
    TestingPanel.prototype.refreshMjBtns = function () {
        var startX = 35;
        var startY = 45;
        var row = 0;
        var col = 0;
        for (var i = 1; i <= 34; i++) {
            var mjStr = "";
            if (i <= 27) {
                mjStr = (row + 1) + this.huaArr[col];
            }
            else {
                mjStr = this.ziMj[i - 28];
            }
            var mdisplay = this.createMj(i, mjStr, 0x000000);
            mdisplay.x = startX + row * 60;
            mdisplay.y = startY + col * 80;
            this.addChild(mdisplay);
            mdisplay.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onMjSelectCallBack, this);
            row++;
            if (row == 9) {
                row = 0;
                col++;
            }
        }
        // this.touchEnabled = true;
        //测试按钮
        var testBtn = this.createMj(0, "测试", 0x0000ff);
        testBtn.x = startX;
        testBtn.y = startY + 5 * 80;
        this.addChild(testBtn);
        testBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTesting, this);
        this.wnSetBtn = this.createMj(0, "无混", 0xff0000);
        this.wnSetBtn.x = startX;
        this.wnSetBtn.y = startY + 6 * 80;
        this.addChild(this.wnSetBtn);
        this.wnSetBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onWnMjSetting, this);
        this.resultTextTips = new egret.TextField();
        this.resultTextTips.textColor = 0xff0000;
        this.resultTextTips.width = 90;
        this.resultTextTips.textAlign = "center";
        this.resultTextTips.text = "";
        this.resultTextTips.size = 30;
        this.resultTextTips.x = testBtn.x + 100;
        this.resultTextTips.y = testBtn.y + 20;
        this.addChild(this.resultTextTips);
    };
    TestingPanel.prototype.onMjSelectCallBack = function (e) {
        var mjobj = e.currentTarget;
        mjobj.showTween();
        if (this.setting) {
            this.wnMj = mjobj.mjVal;
            this.setting = false;
            this.wnSetBtn.updateName(mjobj.mjName);
            return;
        }
        if (ArrayUitl.getElementCount(this.mjListData, mjobj.mjVal) >= 4) {
            return;
        }
        if (this.mjListData.length >= 14) {
            return;
        }
        egret.log("onclick:" + mjobj.mjVal);
        this.mjListData.push(mjobj.mjVal);
        //新增选中麻将
        var startX = 35;
        var startY = 45;
        var row = this.mjListData.length - 1;
        var col = 4;
        var mdisplay = this.createMj(mjobj.mjVal, mjobj.mjName, 0x00ff00);
        mdisplay.x = startX + row * 60;
        mdisplay.y = startY + col * 80;
        this.addChild(mdisplay);
        this.mjObjArray.push(mdisplay);
        mdisplay.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onMjCannelCallBack, this);
    };
    TestingPanel.prototype.onMjCannelCallBack = function (e) {
        var mjobj = e.currentTarget;
        var index1 = this.mjListData.indexOf(mjobj.mjVal);
        var index2 = this.mjObjArray.indexOf(mjobj);
        this.mjListData.splice(index1, 1);
        this.mjObjArray.splice(index2, 1);
        mjobj.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onMjCannelCallBack, this);
        mjobj.parent.removeChild(mjobj);
        this.refreshSelectMjPos();
    };
    TestingPanel.prototype.onWnMjSetting = function (e) {
        this.wnMj = -1;
        this.setting = !this.setting;
        this.wnSetBtn.updateName(this.setting ? "选混" : "无混");
        this.wnSetBtn.showTween();
    };
    TestingPanel.prototype.refreshSelectMjPos = function (startIndex) {
        if (startIndex === void 0) { startIndex = 0; }
        //刷新位置就好了
        for (var k = 0; k < this.mjObjArray.length; k++) {
            this.mjObjArray[k].x = 35 + k * 60;
            this.mjObjArray[k].y = 45 + 4 * 80;
        }
    };
    TestingPanel.prototype.createMj = function (mjVal, mjName, color) {
        var mjStr = "";
        var mdisplay = new MaJiang();
        mdisplay.init(mjVal, mjName, color);
        mdisplay.width = 50;
        mdisplay.height = 70;
        return mdisplay;
    };
    TestingPanel.prototype.onTesting = function (e) {
        var mjobj = e.currentTarget;
        mjobj.showTween();
        if (this.mjListData.length < 1) {
            return;
        }
        var hu = new lj.cgcp.game.qdmj_705.TuiDaoHuEx();
        // hu.wnMj = this.wnMj;
        var timestarm = new Date().getTime();
        var result = hu.hu(this.mjListData);
        timestarm = new Date().getTime() - timestarm;
        egret.log("result:" + result);
        egret.log("usetime:" + timestarm + "ms");
        this.resultTextTips.text = result ? "胡牌" : "不胡";
    };
    return TestingPanel;
}(egret.Sprite));
__reflect(TestingPanel.prototype, "TestingPanel");
//# sourceMappingURL=TestingPanel.js.map