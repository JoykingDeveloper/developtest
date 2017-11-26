class Main extends egret.DisplayObjectContainer {

    public constructor() {
        super();
        
        var gameConf:lj.cgcp.ExtGameConfig = new lj.cgcp.ExtGameConfig();
        gameConf.id = "502";
        gameConf.name = "斗地主测试";
        gameConf.mainClass = "lj.cgcp.game.doudizhu.DouDiZhuGameRoot";
        gameConf.createClass = "lj.cgcp.game.doudizhu.CreatePanel";
        gameConf.playLogClass = "lj.cgcp.game.doudizhu.FightNote";
        gameConf.resConfigUrl = "resource/default.res.json";
        gameConf.resBaseUrl = "resource/";
        gameConf.icon = "http://192.168.2.188/aptana/cgc_platform/resource/icons/1.png";
        lj.cgcp.ExtGameConfigData.putGameList([gameConf]);
        lj.cgcp.AssetManager.is_local = false;

        this.addChild(new lj.cgcp.CGCPStarup());
    }

}


