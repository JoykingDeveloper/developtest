class Main extends egret.DisplayObjectContainer {

    public constructor() {
        super();
        
        var gameConf:lj.cgcp.ExtGameConfig = new lj.cgcp.ExtGameConfig();
        gameConf.id = "204";
        gameConf.name = "四川麻将";
        gameConf.mainClass = "lj.cgcp.game.scmj_204.MjGameRoot";
        gameConf.createClass = "lj.cgcp.game.scmj_204.CreatePanel";
        gameConf.playLogClass = "lj.cgcp.game.scmj_204.PlayLogPanel";
        gameConf.resConfigUrl = "resource/default.res.json";
        gameConf.resBaseUrl = "resource/";
        gameConf.icon = "http://192.168.2.188/aptana/cgc_platform/resource/icons/4.png";
        gameConf.isLandscape = true;
        lj.cgcp.ExtGameConfigData.putGameList([gameConf]);
        lj.cgcp.AssetManager.is_local = false;

        this.addChild(new lj.cgcp.CGCPStarup());


        // var game:lj.cgcp.game.mjlstdh.MajiangGame = new lj.cgcp.game.mjlstdh.MajiangGame();
        // game.da2 = 23;
        // lj.cgcp.game.mjlstdh.MajiangGameData.putCurrentGame(game);
        // egret.log(lj.cgcp.game.mjlstdh.MajiangConstant.findHu(6,[4,4,5,7]));

    }

}


