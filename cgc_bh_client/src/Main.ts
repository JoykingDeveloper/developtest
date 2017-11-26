class Main extends egret.DisplayObjectContainer {

    public constructor() {
        super();
        
        var gameConf:lj.cgcp.ExtGameConfig = new lj.cgcp.ExtGameConfig();
        gameConf.id = "5";
        gameConf.name = "保皇测试";
        gameConf.mainClass = "lj.cgcp.game.baohuang.BHGameRoot";
        gameConf.createClass = "lj.cgcp.game.baohuang.CreatePanel";
        gameConf.playLogClass = "lj.cgcp.game.baohuang.FightNote";
        gameConf.resConfigUrl = "resource/default.res.json";
        gameConf.resBaseUrl = "resource/";
        gameConf.isLandscape = true;
        gameConf.icon = "http://192.168.2.188/aptana/cgc_platform/resource/icons/1.png";
        lj.cgcp.ExtGameConfigData.putGameList([gameConf]);
        lj.cgcp.AssetManager.is_local = false;

        this.addChild(new lj.cgcp.CGCPStarup());
        
    }

}


