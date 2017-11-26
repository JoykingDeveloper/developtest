
var game_file_list = [
    //以下为自动修改，请勿修改
    //----auto game_file_list start----
	"libs/modules/egret/egret.js",
	"libs/modules/egret/egret.native.js",
	"libs/modules/game/game.js",
	"libs/modules/res/res.js",
	"libs/modules/tween/tween.js",
	"libs/modules/socket/socket.js",
	"libs/modules/starlingSwf/starlingSwf.js",
	"libs/modules/cgc_platform_lib/cgc_platform_lib.js",
	"polyfill/promise.js",
	"bin-debug/com.cgcp.game.mj/hufuns/BaseHu.js",
	"bin-debug/com.cgcp.game.mj/hufuns/TuidaoHu.js",
	"bin-debug/com.cgcp.game.mj/panels/MjListPanel.js",
	"bin-debug/com.cgcp.game.mj/panels/ChiTips.js",
	"bin-debug/com.cgcp.game.mj/constant/MajiangConstant.js",
	"bin-debug/com.cgcp.game.mj/hufuns/JiangYiSe.js",
	"bin-debug/com.cgcp.game.mj/hufuns/JinGouDiao.js",
	"bin-debug/com.cgcp.game.mj/hufuns/MenQingHu.js",
	"bin-debug/com.cgcp.game.mj/hufuns/PengPengHu.js",
	"bin-debug/com.cgcp.game.mj/hufuns/QingYiSe.js",
	"bin-debug/com.cgcp.game.mj/hufuns/QiXiaoDui.js",
	"bin-debug/com.cgcp.game.mj/hufuns/ShiSanYao.js",
	"bin-debug/com.cgcp.game.mj/data/MajiangGame.js",
	"bin-debug/com.cgcp.game.mj/hufuns/ZhongZhangHu.js",
	"bin-debug/com.cgcp.game.mj/MjGameApi.js",
	"bin-debug/com.cgcp.game.mj/MjGameAsset.js",
	"bin-debug/com.cgcp.game.mj/MjGameRoot.js",
	"bin-debug/com.cgcp.game.mj/constant/SoundConstant.js",
	"bin-debug/com.cgcp.game.mj/panels/CreatePanel.js",
	"bin-debug/com.cgcp.game.mj/panels/EndDetail.js",
	"bin-debug/com.cgcp.game.mj/panels/EndPanel1.js",
	"bin-debug/com.cgcp.game.mj/panels/EndPanel2.js",
	"bin-debug/com.cgcp.game.mj/panels/GameDataParse.js",
	"bin-debug/com.cgcp.game.mj/panels/GamePanel.js",
	"bin-debug/com.cgcp.game.mj/panels/GangTips.js",
	"bin-debug/com.cgcp.game.mj/data/MajiangGameData.js",
	"bin-debug/com.cgcp.game.mj/panels/MjListPanel1.js",
	"bin-debug/com.cgcp.game.mj/panels/MjListPanel2.js",
	"bin-debug/com.cgcp.game.mj/panels/MjListPanel3.js",
	"bin-debug/com.cgcp.game.mj/panels/PlayLogPanel.js",
	"bin-debug/com.cgcp.game.mj/panels/RoleHead.js",
	"bin-debug/com.cgcp.game.mj/panels/TimerDown.js",
	"bin-debug/com.cgcp.game.mj/panels/TingTips.js",
	"bin-debug/Main.js",
	//----auto game_file_list end----
];

var window = this;

egret_native.setSearchPaths([""]);

egret_native.requireFiles = function () {
    for (var key in game_file_list) {
        var src = game_file_list[key];
        require(src);
    }
};

egret_native.egretInit = function () {
    if(egret_native.featureEnable) {
        //控制一些优化方案是否开启
        var result = egret_native.featureEnable({
            
        });
    }
    egret_native.requireFiles();
    //egret.dom为空实现
    egret.dom = {};
    egret.dom.drawAsCanvas = function () {
    };
};

egret_native.egretStart = function () {
    var option = {
        //以下为自动修改，请勿修改
        //----auto option start----
		entryClassName: "Main",
		frameRate: 60,
		scaleMode: "fixedWidth",
		contentWidth: 640,
		contentHeight: 1136,
		showPaintRect: false,
		showFPS: false,
		fpsStyles: "x:0,y:0,size:12,textColor:0xffffff,bgAlpha:0.9",
		showLog: false,
		logFilter: "",
		maxTouches: 2,
		textureScaleFactor: 1
		//----auto option end----
    };

    egret.native.NativePlayer.option = option;
    egret.runEgret();
    egret_native.Label.createLabel("/system/fonts/DroidSansFallback.ttf", 20, "", 0);
    egret_native.EGTView.preSetOffScreenBufferEnable(true);
};