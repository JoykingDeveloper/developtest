
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
	"bin-debug/com.lingjing.cgcp.game/panels/GamePanel.js",
	"bin-debug/com.lingjing.cgcp.game/BHAsset.js",
	"bin-debug/com.lingjing.cgcp.game/BHGameRoot.js",
	"bin-debug/com.lingjing.cgcp.game/data/BHGame.js",
	"bin-debug/com.lingjing.cgcp.game/data/BHGameData.js",
	"bin-debug/com.lingjing.cgcp.game/data/BHRoleData.js",
	"bin-debug/com.lingjing.cgcp.game/panels/CreatePanel.js",
	"bin-debug/com.lingjing.cgcp.game/panels/EndPanel.js",
	"bin-debug/com.lingjing.cgcp.game/panels/FightNote.js",
	"bin-debug/com.lingjing.cgcp.game/BHGameApi.js",
	"bin-debug/com.lingjing.cgcp.game/panels/GamePanelDataParse.js",
	"bin-debug/com.lingjing.cgcp.game/panels/PokerPai.js",
	"bin-debug/com.lingjing.cgcp.game/panels/PokerPanel.js",
	"bin-debug/com.lingjing.cgcp.game/panels/ResultPanel.js",
	"bin-debug/com.lingjing.cgcp.game/panels/RoleHead.js",
	"bin-debug/com.lingjing.cgcp.game/panels/TimeDown.js",
	"bin-debug/com.lingjing.cgcp.game/utils/PokerUtil.js",
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
		frameRate: 30,
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