class Main extends egret.DisplayObjectContainer {

    public constructor() {
        super();
        
        var gameConf:lj.cgcp.ExtGameConfig = new lj.cgcp.ExtGameConfig();
        gameConf.id = "101";
        gameConf.name = "丹丹测试";
        gameConf.mainClass = "lj.cgcp.game.jinhua.JinHuaGameRoot";
        gameConf.createClass = "lj.cgcp.game.jinhua.CreatePanel";
        gameConf.playLogClass = "lj.cgcp.game.jinhua.PlayLogPanel";
        gameConf.resConfigUrl = "resource/default.res.json";
        gameConf.resBaseUrl = "resource/";
        gameConf.icon = "http://192.168.2.188/aptana/cgc_platform/resource/icons/1.png";
        lj.cgcp.ExtGameConfigData.putGameList([gameConf]);
        lj.cgcp.AssetManager.is_local = false;

        this.addChild(new lj.cgcp.CGCPStarup());
    }

}


