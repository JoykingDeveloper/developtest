class Main extends egret.DisplayObjectContainer {

    public constructor() {
        super();
        
        var gameConf:lj.cgcp.ExtGameConfig = new lj.cgcp.ExtGameConfig();
        gameConf.id = "705";
        gameConf.name = "青岛扭牌-带风带混";
        gameConf.mainClass = "lj.cgcp.game.qdmj_705.MjGameRoot";
        gameConf.createClass = "lj.cgcp.game.qdmj_705.CreatePanel";
        gameConf.playLogClass = "lj.cgcp.game.qdmj_705.PlayLogPanel";
        gameConf.resConfigUrl = "resource/default.res.json";
        gameConf.resBaseUrl = "resource/";
        gameConf.icon = "http://192.168.2.188/aptana/cgc_platform/resource/icons/4.png";
        gameConf.isLandscape = true;
        lj.cgcp.ExtGameConfigData.putGameList([gameConf]);
        lj.cgcp.AssetManager.is_local = false;

        this.addChild(new lj.cgcp.CGCPStarup());

        // egret.log(lj.cgcp.game.mjlstdh.MajiangConstant.findHu(-1,[1,2,2,3,3,3,4,4,5,6,6,7,8,9]));
        var game:lj.cgcp.game.qdmj_705.MajiangGame = new lj.cgcp.game.qdmj_705.MajiangGame();
        game.hunMj = 2;
        lj.cgcp.game.qdmj_705.MajiangGameData.putCurrentGame(game);
        // var mjList:number[] = [2,3,4,5,6,10,10,25,25,25,30,30,30,9];
        // var mjList:number[] = [2,3,4,5,6];
        var mjList:number[] = [2,3,4,5,6,7,8,8,9,9,10];
        // var hu:lj.cgcp.game.qdmj_705.TuiDaoHuExWn = new lj.cgcp.game.qdmj_705.TuiDaoHuExWn();
        var hu:lj.cgcp.game.qdmj_705.TuiDaoHuEx = new lj.cgcp.game.qdmj_705.TuiDaoHuEx();
        // var hu:lj.cgcp.game.qdmj_705.TuidaoHu = new lj.cgcp.game.qdmj_705.TuidaoHu();
        var timestamp1 = new Date().getTime();
        egret.log("result:"+JSON.stringify(hu.findTing(mjList)));
        var timestamp2 = new Date().getTime();
        egret.log("useTime:"+(timestamp2 - timestamp1)+"ms");
        // egret.log("mjList:"+Math.floor(35/9));

    }

}


