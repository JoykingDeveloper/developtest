declare module lj.cgcp {
    class BaseApi {
        private static _host;
        private static _port;
        private static _socketClient;
        private static _sendQueue;
        private static _callBackQueue;
        private static _currentSendObject;
        private static _commands;
        private static _commandsThisObjects;
        private static _isError;
        /**
         * 初始化baseapi
         */
        static init(host: string, port: number): void;
        private static onConnect();
        private static onConnectClose();
        private static onIOError();
        private static onData(data);
        static requestUser(pars: any, callBack: Function, errorCallBack: Function): void;
        static requestLogic(pars: any, callBack: Function, errorCallBack: Function): void;
        static request(path: string, pars: any, callBack: Function, errorCallBack: Function): void;
        /**
         * 发送数据
         */
        private static sendObject(obj);
        /***
         * 清除所有命令
         */
        static clearCmd(): void;
        /**
         * 注册命令
         */
        static registerCmd(cmd: string, callBack: Function, thisObj: any, isHead?: boolean): void;
        /**
         * 移除命令
         */
        static removeCmd(cmd: string, callBack: Function, thisObj: any): void;
        /**
         * 派发命令消息
         */
        static dispatchCmd(cmd: string, data: any): void;
    }
}
declare module lj.cgcp {
    class CacheData {
        private static _ramDatas;
        static getRAMData(key: string): any;
        static saveRAMData(key: string, data: any): void;
        static removeRAMData(key: string): void;
        static clearRAMData(): void;
    }
}
declare module lj.cgcp {
    class BasePanel extends lzm.BasePanel {
        static currentPanel: BasePanel;
        mainAsset: starlingswf.SwfSprite;
        closeBtn: starlingswf.SwfButton;
        constructor(setCurrent?: boolean);
        private _addToStage_(e);
        private _removeFromStage_(e);
        private onResize(e);
        init(): void;
        layout(): void;
        on_closeBtn(e: egret.Event): void;
        dispose(): void;
        mainAssetName(): string;
        assetSwf(): starlingswf.Swf;
    }
}
declare module lj.cgcp {
    /**
     * 网络图片
     */
    class NetImage extends egret.DisplayObjectContainer {
        image: egret.Bitmap;
        loader: egret.ImageLoader;
        setNativSize: boolean;
        constructor(url: string, setNativSize?: boolean);
        reload(url: any): void;
        loadComplete(e: egret.Event): void;
        dispose(): void;
        $setWidth(value: number): boolean;
        $getWidth(): number;
        $setHeight(value: number): boolean;
        $getHeight(): number;
    }
}
declare module lj.cgcp {
    /**
     * 代理后台
     */
    class ManagerBase extends BasePanel {
        static show(): void;
        /**
         * 活动资源配置加载成功
         */
        static loadResConfigComplete(data: any): void;
        private static loadManagerSwfCallBack(data);
        private static _show();
    }
}
declare module lj.cgcp {
    class CGCPStarup extends egret.DisplayObjectContainer {
        loadingUi: LoadingUI;
        constructor();
        private onAddToStage(event);
        /**
         * 资源配置加载完成
         */
        private loadResConfigCallBack(data);
        /**
         * 初始化资源组 加载回调
         */
        private loadResCallBack(data);
    }
}
declare module lj.cgcp {
    class BaseApiCmdInit {
        static initCmds(): void;
    }
}
declare module lj.cgcp {
    /**
     * 聊天接口
     */
    class ChatApi {
        /**
         * 发送语音消息
         */
        static sendVoice(serverId: string, callBack: Function): void;
        /**
         * 发送常用语
         */
        static sendText(textId: string): void;
        /**
         * 发送常用表情
         */
        static sendImage(imageId: string): void;
        /**
         * 收到语音消息
         */
        static onSendVoice(data: any): void;
        /**
         * 收到常用语
         */
        static onSendText(data: any): void;
        /**
         * 收到常用语
         */
        static onSendImage(data: any): void;
    }
}
declare module lj.cgcp {
    class GameApi {
        /**
         * 获取游戏配置列表
         */
        static getGameList(callBack: Function): void;
        /**
         * 获取返回游戏的相关信息
         */
        static returnGame(callBack: Function): void;
        /**
         * 登录游戏
         */
        static loginGame(callBack: Function): void;
        /**
         * 检测游戏是否创建成功
         */
        static checkGameCreate(): void;
        /**
         * 收到游戏开始的消息，游戏开始后 玩家就不能退出了，只能投票结束游戏
         */
        static onGameStart(data: any): void;
        /**
         * 收到游戏结束的消息
         */
        static onGameOver(data: any): void;
    }
}
declare module lj.cgcp {
    class RoleApi extends BaseApi {
        /**
         * 创建角色
         */
        static createRole(name: string, callBack: Function): void;
        /**
         * 获取角色信息
         */
        static getRoleInfo(targetUid: string, callBack: Function): void;
        /**
         * 同步位置信息
         */
        static syncPos(latitude: number, longitude: number): void;
        /**
         * 同步错误信息
         */
        static syncError(error: string): void;
        /**
         * 同步房卡数量
         */
        static syncCard(callBack: Function): void;
        /**
         * 赠送房卡
         */
        static shareCard(targetUid: string, cardNum: number, callBack: Function): void;
        /**
         * 获取战绩
         */
        static getZhanji(game_id: string, callBack: Function): void;
        /**
         * 收到同步房卡的推送
         */
        static onSyncCard(data: any): void;
    }
}
declare module lj.cgcp {
    class RoomApi extends BaseApi {
        /**
         * 创建房间
         */
        static createRoom(game_id: string, createData: any, callBack: Function, errorCallBack?: Function): void;
        /**
         * 加入房间
         */
        static joinRoom(room_id: string, callBack: Function): void;
        /**
         * 离开房间
         */
        static leaveRoom(callBack: Function): void;
        /**
         * 解散房间
         */
        static disbandRoom(callBack: Function): void;
        /**
         * 投票解散房间
         */
        static voteEndGame(result: number): void;
        /**
         * 检测投票状态
         */
        static checkVoteEndGame(): void;
        /**
         * 踢人
         */
        static kick(targetUid: string): void;
        /**
         * 向游戏发送数据
         */
        static gameMessage(messageData: any): void;
        /** 收到加入房间的消息 */
        static onJoinRoom(data: any): void;
        /** 玩家返回游戏 */
        static onReturnGame(data: any): void;
        /** 收到离开房间的消息 */
        static onLeaveRoom(data: any): void;
        /** 玩家离线 */
        static onLeaveGame(data: any): void;
        /** 收到解散房间的消息 */
        static onDisbandRoom(data: any): void;
        /**
         * 玩家创建超过30分钟游戏没开始 离线回来 游戏房间销毁
         */
        static onRoomTimeOver(data: any): void;
        /**
         * 被踢
         */
        static onKick(data: any): void;
    }
}
declare module lj.cgcp {
    class UserApi extends BaseApi {
        static reg(account: string, callBack: Function): void;
        static resetfd(): void;
        static initLoginData(data: any): void;
    }
}
declare module lj.cgcp {
    class AssetLoadObject {
        callBack: Function;
        CallBackThisObj: any;
        /**
         * 配置加载完成
         */
        loadConfigComplete(e: RES.ResourceEvent): void;
        /**
         * 资源组加载完成
         */
        onResourceLoadComplete(e: RES.ResourceEvent): void;
        /**
         * 资源组加载出错
         */
        onResourceLoadError(e: RES.ResourceEvent): void;
        /**
         * 资源组加载进度
         */
        onResourceProgress(e: RES.ResourceEvent): void;
        /**
         * 资源组加载出错
         */
        onItemLoadError(e: RES.ResourceEvent): void;
    }
}
declare module lj.cgcp {
    class AssetManager {
        static is_local: boolean;
        /**
         * 游戏启动的时候 初始化一波资源
         */
        static initWithStart(callBack: Function, callBackThisObj: any): void;
        /**
         * 加载资源配置
         */
        static loadConfig(url: string, resourceRoot: string, callBack: Function, callBackThisObj: any, confVersion?: string): void;
        /**
         * 卸载资源配置
         */
        static unConfig(config: any): void;
        /**
         * 加载资源组
         */
        static loadGroup(name: string, callBack: Function, callBackThisObj: any): void;
        static mainSwf(): starlingswf.Swf;
        static managerSwf(): starlingswf.Swf;
        static chatSwf(): starlingswf.Swf;
        static mainNewSwf(): starlingswf.Swf;
    }
}
declare module lj.cgcp {
    class GameAssetLoader {
        static gameConf: ExtGameConfig;
        static gameResConfig: any;
        callBack: Function;
        CallBackThisObj: any;
        constructor(gameConf: ExtGameConfig, callBack: Function, CallBackThisObj: any);
        startLoad(): void;
        onLoadAssetConfComplete(data: any): void;
        onLoadAssetComplete(data: any): void;
    }
}
declare module lj.cgcp {
    class JSAnalyzer extends RES.BinAnalyzer {
        static jsDic: any;
        constructor();
        /**
         * 解析并缓存加载成功的数据
         */
        analyzeData(resItem: RES.ResourceItem, data: any): void;
    }
}
declare module lj.cgcp {
    class SoundManager {
        static currentGameConf: ExtGameConfig;
        static currentGameSounds: any;
        static currentGameSoundChannels: any;
        static currentGameSoundUrls: any;
        static currentBgName: string;
        static changyongSounds: any;
        static changyongSoundChannels: any;
        static setGameConfig(gameConfig: ExtGameConfig): void;
        static playPlatformSound(name: string): void;
        static playGameSound(name: string, loops?: number): void;
        static playBgSound(name: string): void;
        static stopGameSound(name: string): void;
        private static playSound(name, loops?, volume?);
        static disposeSounds(): void;
        /**
         * 播放常用语
         */
        static playChangYongYu(name: string): void;
    }
}
declare module lj.cgcp {
    class App {
        static stageRealWidth: number;
        static stageRealHeight: number;
        static designWidth: number;
        static designHeight: number;
        static stageWidth: number;
        static stageHeight: number;
        static stage: egret.Stage;
        static appRoot: egret.DisplayObjectContainer;
        static topContainer: egret.DisplayObjectContainer;
        static _isLandscape: boolean;
        static alertScale: number;
        static init(stage: egret.Stage, appRoot: egret.DisplayObjectContainer): void;
        static scaleByY(): void;
        static scaleByX(): void;
        static scaleByXY(): void;
        static onResize(e: egret.Event): void;
        static isLandscape: boolean;
        static heart(): void;
        static heartFun(): void;
    }
}
declare module lj.cgcp {
    class AppConfig {
        /** 游戏列表 */
        static gameList: string;
        /** 支付地址 */
        static pay_path: string;
        /** 登录地址 */
        static login_path: string;
        /** 网络资源路径  */
        static web_res_path: string;
        /** 服务器ip */
        static server_host: string;
        /** 服务器端口 */
        static server_port: number;
        /** 平台资源配置地址 */
        static platform_res_config_url: string;
        /** 平台资源配加载前缀 */
        static platform_res_url: string;
        /** 是否需要微信接入 */
        static need_wx: boolean;
        /** 微信jssdk配置地址 */
        static wx_jssdk_config_path: string;
        /** 微信jssdk配置参数 */
        static wx_jssdk_config: any;
        /** 登录账号 */
        static account: string;
        /** urlData */
        static urlData: any;
        /** 运营活动主类 */
        static activity_mainClass: string;
        /** 运营活动资源配置 */
        static activity_resConfigUrl: string;
        /** 运营活动资源加载前缀 */
        static activity_resUrl: string;
        /** 代理后台主类 */
        static manager_mainClass: string;
        /** 代理后台资源配置 */
        static manager_resConfigUrl: string;
        /** 代理后台资源加载前缀 */
        static manager_resUrl: string;
        /** 公众号链接 */
        static weichat_account_url: string;
        /** 在代理处自动购卡的连接地址 */
        static pay_by_proxy_path: string;
    }
}
declare module lj.cgcp {
    class ChatManager {
        static showChatPanel(): void;
        static showText(data: any): void;
        static showVoice(data: any): void;
        static showSprite(textSpr: egret.DisplayObject, head: RoleHeadImage, textSprWidth: number): void;
        static showBq(data: any): void;
    }
}
declare module lj.cgcp {
    class AccountData {
        static getSessionToken(): string;
        static putSessionToken(token: string): void;
        static getUser(): User;
        static putUser(user: User): void;
        static getUrlData(): any;
    }
}
declare module lj.cgcp {
    class ActivityBase extends egret.DisplayObjectContainer {
        constructor();
    }
}
declare module lj.cgcp {
    /**
     * 小游戏配置
     */
    class ExtGameConfig {
        constructor();
        /** 游戏id */
        id: string;
        /** 名字 */
        name: string;
        /** icon */
        icon: string;
        /** 游戏资源配置地址 */
        resConfigUrl: string;
        /** 游戏资源加载路径 */
        resBaseUrl: string;
        /** 游戏启动类 全路径类名 */
        mainClass: string;
        /** 游戏创建面板 全路径名 */
        createClass: string;
        /** 游戏战绩面板 全路径名 */
        playLogClass: string;
        /** 是否是横屏 */
        isLandscape: boolean;
        /** 资源版本号 */
        resVer: string;
        /** 游戏是否关闭 */
        close: boolean;
        /** 跳转地址 */
        jump_url: string;
        /** 比赛面板类 */
        matchClass: string;
        /** 比赛面板类 */
        matchResConfigUrl: string;
        /** 比赛资源地址 */
        matchResUrl: string;
    }
}
declare module lj.cgcp {
    class ExtGameConfigData {
        static putGameList(list: ExtGameConfig[]): void;
        static getGameList(): ExtGameConfig[];
        /**
         * 获取单个游戏配置
         */
        static getGameConfig(id: string): ExtGameConfig;
    }
}
declare module lj.cgcp {
    class Role {
        /** 角色uid */
        uid: string;
        /** 注册时间*/
        gettime: string;
        /** 角色名 */
        name: string;
        /** 头像 */
        head: string;
        /** 性别 */
        sex: number;
        /** 房卡数量 */
        card: number;
        /** 拥有的金币 */
        gold: number;
        /** 是否是代理 */
        proxy: number;
        /** 推荐人 */
        recommend: string;
        /** IP地址 */
        ip: string;
        /** 所在经度 */
        latitude: number;
        /** 所在纬度 */
        longitude: number;
        /** 开房积分 */
        score1: number;
        /** 消耗房卡积分 */
        score2: number;
        /** 推荐业务员 */
        recommend2: string;
        /** 成为代理后，后台充值的次数 */
        payCount: number;
        /** 营业额 */
        turnover: number;
        /** 认证人 */
        cert: string;
    }
}
declare module lj.cgcp {
    class RoleData {
        static getRole(): Role;
        static putRole(role: Role): void;
        static getRoleName(uid: string): string;
        static putRoleName(uid: string, name: string): void;
    }
}
declare module lj.cgcp {
    /**
     * 玩家头像缓存，主要用户常用语位置定位
     */
    class RoleHeadCache {
        static cache: boolean;
        static heads: any;
        /**
         * 清理缓存
         */
        static clear(): void;
        /**
         * 缓存头像
         */
        static addHead(uid: string, head: RoleHeadImage): void;
        /**
         * 更换头像所属uid
         */
        static replaceHead(oldUid: string, newUid: string): void;
        /**
         * 获取头像
         */
        static getHead(uid: string): RoleHeadImage;
    }
}
declare module lj.cgcp {
    class Room {
        /** 房间id */
        id: string;
        /** 房间成员列表 */
        players: any;
        /** 房主 */
        owner: string;
        /** 最大玩家数量 */
        max_player: number;
        /** 房间里面的附加信息 */
        data: any;
        /** 是否AA房卡 */
        aa: boolean;
    }
}
declare module lj.cgcp {
    class RoomData extends CacheData {
        static getCurrentRoom(): Room;
        static putCurrentRoom(room: Room): void;
        /**
         * 获取当前房间的离线列表
         */
        static getCurrentRoomOffline(): any;
        /**
         * 将玩家标记为离线
         */
        static saveCurrentRoomOffline(uid: string): void;
        /**
         * 将玩家的离线标记移除
         */
        static delCurrentRoomOffline(uid: string): void;
        /**
         * 离线玩家数量
         */
        static readonly offLineCount: number;
        /**
         * 获取玩家在房间中的哪个位置
         */
        static getPlayerIndex(uid: string): number;
        /**
         * 保存当前房间中的玩家数据
         */
        static saveRoles(roles: any): void;
        /**
         * 获取当前房间中的所有角色
         */
        static getRoles(): any;
        /**
         * 保存一个玩家信息到房间角色列表
         */
        static saveRole(role: Role): void;
        /**
         * 获取当前房间的某个角色
         */
        static getRole(uid: string): Role;
    }
}
declare module lj.cgcp {
    /**
     * 本地设置数据
     */
    class SettingData {
        /**
         * 背景音乐大小
         */
        static bgSoundVolume(): number;
        /**
         * 背景音乐大小
         */
        static setBgSoundVolume(volume: number): void;
        /**
         * 音效大小
         */
        static soundVolume(): number;
        /**
         * 音效大小
         */
        static setSoundVolume(volume: number): void;
    }
}
declare module lj.cgcp {
    class User {
        account: string;
        uid: string;
        gettime: string;
    }
}
declare module lj.cgcp {
    /**
     * 游戏主体
     */
    class ExtGame extends egret.DisplayObjectContainer {
        constructor();
        /** 初始化房间 */
        onInit(room: Room, roles: any): void;
        /** 有玩家加入房间 */
        onJoinRoom(data: any): void;
        /** 玩家返回游戏 */
        onReturnGame(data: any): void;
        /** 有玩家离开房间 */
        onLeaveRoom(data: any): void;
        /** 玩家离线 */
        onLeaveGame(data: any): void;
        /** 解散房间 */
        onDisbandRoom(data: any): void;
        /** 收到游戏消息 */
        onGameMessage(data: any): void;
        /** 当界面大小变化 触发重新布局的操作 */
        layout(): void;
        /** 销毁游戏 */
        dispose(): void;
    }
}
declare module lj.cgcp {
    /**
     * 游戏创建面板，需要每个游戏 自己来定义
     */
    class ExtGameCreatePanel extends egret.DisplayObjectContainer {
        cardType: number;
        aa: boolean;
        /**
         * 创建事件
         */
        static onCreate: string;
        /**
         * 一般在点击创建按钮时调用
         */
        create(): void;
        /**
         * 返回创建选项的数据，该方法除了需要返回游戏自己的数据，还需要返回一个固定的cardType项，用于表示消耗多少房卡，cardType会在服务器配置对应的房卡消耗数量
         */
        createData(): any;
        /**
         * 销毁资源，该界面会被缓存，所以dispose方法 自己无须调用，平台会统一调用，只需要在该方法中实现资源销毁逻辑
         */
        dispose(): void;
    }
}
declare module lj.cgcp {
    class ExtGameHelper {
        static extGamePanel: ExtGamePanel;
        private static _ramDatas;
        static getRAMData(key: string): any;
        static saveRAMData(key: string, data: any): void;
        static removeRAMData(key: string): void;
        static clearRAMData(): void;
        /**
         * 获取当前游戏的配置
         */
        static currentGameConfig(): ExtGameConfig;
        /**
         * 设置背景颜色
         */
        static setBackGroundColor(color: number): void;
        /**
         * 返回微信
         */
        static backToWx(): void;
        /**
         * 显示分享提示
         */
        static showShareTip(): void;
        /**
         * 判断玩家是否离线
         */
        static isOffLine(uid: string): boolean;
        /**
         * 退出游戏界面
         */
        static exitExtGamePanel(): void;
        /**
         * 离开房间
         */
        static leaveRoom(): void;
        /**
         * 解散房间
         */
        static disbandRoom(): void;
        /**
         * 离开房间确认按钮之后调用
         */
        private static _leaveRoom();
        /**
         * 向游戏发送数据
         */
        static sendGameMessage(data: any): void;
        /**
         * 踢人
         */
        static kick(targetUid: string): void;
        /**
         * 房间是否被标记为游戏开始
         */
        static gameIsStart(): boolean;
        /**
         * 显示设置面板
         */
        static showSetting(): void;
    }
}
declare module lj.cgcp {
    /**
     * 游戏战绩面板，每个游戏 自己定义
     */
    class ExtGameScorePanel extends egret.DisplayObjectContainer {
        constructor();
        /**
         * 初始化
         */
        init(data: any[]): void;
        /**
         * 销毁资源，该界面会被缓存，所以dispose方法 自己无须调用，平台会统一调用，只需要在该方法中实现资源销毁逻辑
         */
        dispose(): void;
    }
}
declare module lj.cgcp {
    class LoadingUI extends egret.Sprite {
        mainAsset: starlingswf.SwfSprite;
        textField: egret.TextField;
        constructor();
        setProgress(current: number): void;
    }
}
declare module lj.cgcp {
    class MatchBase extends egret.DisplayObjectContainer {
        constructor();
    }
}
declare module lj.cgcp {
    class ActivityApi {
        /**
         * 领取关注奖励
         */
        static getFollowCard(callBack: Function): void;
    }
}
declare module lj.cgcp {
    /**
     * 在代理处自处购卡
     */
    class BuyCardFromProxy extends BasePanel {
        idText: egret.TextField;
        nameText: egret.TextField;
        cardText: egret.TextField;
        shareCardText: egret.TextField;
        jianBtn: starlingswf.SwfButton;
        jiaBtn: starlingswf.SwfButton;
        buyBtn: starlingswf.SwfButton;
        headImag: RoleHeadImage;
        proxy_id: string;
        card_number: number;
        roleProxy: Role;
        constructor();
        initInfos(roleProxy: Role): void;
        on_jianBtn(e: egret.Event): void;
        on_jiaBtn(e: egret.Event): void;
        onShareCardTextFocusOut(e: egret.Event): void;
        on_buyBtn(e: egret.Event): void;
        dispose(): void;
        mainAssetName(): string;
    }
}
declare module lj.cgcp {
    /**
     * 聊天面板
     */
    class ChatPanel extends BasePanel {
        private texts;
        private bqs;
        constructor();
        createTexts(): void;
        /**
         * 创建表情
         */
        createBqs(): void;
        onClickText(e: egret.Event): void;
        onClickBq(e: egret.Event): void;
        dispose(): void;
        mainAssetName(): string;
        assetSwf(): starlingswf.Swf;
    }
}
declare module lj.cgcp {
    class ProxyPanel extends BasePanel {
        mainPanel: MainPanel;
        constructor(mainPanel: MainPanel);
        on_ckBtn(e: egret.Event): void;
        mainAssetName(): string;
    }
}
declare module lj.cgcp {
    /**
     * 小游戏的容器
     */
    class ExtGamePanel extends BasePanel {
        gameConfig: ExtGameConfig;
        game: ExtGame;
        room: Room;
        roles: any;
        voteEndGamePanel: VoteEndGamePanel;
        voteEndGames: string[];
        backgroundColor: number;
        background: egret.Shape;
        gameCreate: boolean;
        checkGameCreateId: number;
        constructor(gameConfig: ExtGameConfig, room: Room, roles: any, voteEndGames?: string[]);
        scaleGame(): void;
        layout(): void;
        addToStage(e: egret.Event): void;
        /**
         * 收到投票结算游戏的消息，弹出投票面板
         */
        onVoteEndGame(data: any): void;
        /**
         * 收到游戏消息
         */
        onGameMessage(data: any): void;
        /**
         * 检测游戏是否创建成功
         */
        checkGameCrate(): void;
        /**
         * 加载聊天相关资源
         */
        loadChat(): void;
        loadChatSwfCallBack(data: any): void;
        dispose(): void;
    }
}
declare module lj.cgcp {
    /**
     * 加入游戏界面
     */
    class JoinGamePanel {
        mainPanel: MainPanel;
        gameConf: ExtGameConfig;
        mainAsset: starlingswf.SwfSprite;
        joinRoomBtn: starlingswf.SwfButton;
        createRoomBtn: starlingswf.SwfButton;
        closeBtn: starlingswf.SwfButton;
        gameNameText: egret.BitmapText;
        createGamePanel: ExtGameCreatePanel;
        scorePanel: ExtGameScorePanel;
        constructor(mainPanel: MainPanel, mainAsset: starlingswf.SwfSprite);
        setGameConfig(gameConfig: ExtGameConfig): void;
        on_createRoomBtn(e: egret.Event): void;
        on_joinRoomBtn(e: egret.Event): void;
        on_zhanjiBtn(e: egret.Event): void;
        on_closeBtn(e: egret.Event): void;
        /**
         * 收到游戏面板的创建游戏事件
         */
        onCreatePanelCreate(e: egret.Event): void;
        dispose(): void;
    }
}
declare module lj.cgcp {
    class RoomNumberInputPanel {
        numTextNames: string[];
        numBtnNames: string[];
        numBtnVals: number[];
        numTexts: egret.TextField[];
        numBtns: starlingswf.SwfButton[];
        roomNum: number[];
        closeBtn: starlingswf.SwfButton;
        mainPanel: MainPanel;
        gameConf: ExtGameConfig;
        mainAsset: starlingswf.SwfSprite;
        constructor(mainPanel: MainPanel, mainAsset: starlingswf.SwfSprite);
        setGameConfig(gameConfig: ExtGameConfig): void;
        initNumBtns(): void;
        on_delBtn(e: egret.Event): void;
        on_resetBtn(e: egret.Event): void;
        on_joinBtn(e: egret.Event): void;
        onNumBtn(e: egret.Event): void;
        getRoomNum(): string;
        on_closeBtn(e: egret.Event): void;
        dispose(): void;
    }
}
declare module lj.cgcp {
    /**
     * 登录界面
     */
    class LoginPanel extends BasePanel {
        mainAsset: starlingswf.SwfSprite;
        accountInput: egret.TextField;
        loginBtn: starlingswf.SwfButton;
        constructor();
        init(): void;
        layout(): void;
        mainAssetName(): string;
        on_loginBtn(e: egret.Event): void;
        startGame(): void;
    }
}
declare module lj.cgcp {
    /**
     * 主界面
     */
    class MainPanel extends BasePanel {
        endSpr: starlingswf.SwfSprite;
        roleHeadSpr: starlingswf.SwfSprite;
        mainContent: starlingswf.SwfSprite;
        gameListSpr: starlingswf.SwfSprite;
        fkText: egret.TextField;
        gameBtns: MainPanelGameBtn[];
        headImage: RoleHeadImage;
        scrollView: egret.ScrollView;
        scrollViewContent: egret.DisplayObjectContainer;
        joinGamePanel: JoinGamePanel;
        roomNumberInputPanel: RoomNumberInputPanel;
        meBtn: starlingswf.SwfButton;
        mainPageBtn: starlingswf.SwfButton;
        bbsBtn: starlingswf.SwfButton;
        constructor();
        init(): void;
        createGameiIconBtns(): void;
        createRoleHead(): void;
        onEntreFrame(e: egret.Event): void;
        /**
         * 点击设置按钮
         */
        on_settingBtn(e: egret.Event): void;
        /**
         * 点击设置按钮
         */
        on_meBtn(e: egret.Event): void;
        /**
         * 点击加房卡按钮
         */
        on_plusFkBtn(e: egret.Event): void;
        /**
         * 点击客户按钮
         */
        on_bbsBtn(e: egret.Event): void;
        mainAssetName(): string;
        layout(): void;
        dispose(): void;
        returnGameConf: ExtGameConfig;
        returnGameData: any;
        /**
         * 登录之后 检测是否在游戏中。在游戏中的话 需要返回到游戏中去
         */
        returnGame(): void;
        onLoadGameComplete(): void;
        static isFirstJoinPlatform: boolean;
        static shareGameId: string;
        static shareRoomId: string;
        joinGameByShare(): void;
        onLoadGameComplete2(): void;
        /**
         * 点击活动按钮
         */
        on_mainPageBtn(e: egret.Event): void;
        /**
         * 活动资源配置加载成功
         */
        loadActivityResConfigComplete(data: any): void;
        /**
         * 活动资源加载成功
         */
        loadActivityAssetComplete(data: any): void;
        /**
         * 显示活动面板
         */
        showActivity(): void;
        /**
         * 领取关注房卡奖励
         */
        getFollowCard(): void;
        /**
         * 拉起购卡界面
         */
        openBuyCardPanel(): void;
    }
}
declare module lj.cgcp {
    class MainPanelGameBtn extends starlingswf.SwfButton {
        gameConf: ExtGameConfig;
        image: NetImage;
        mainPanel: MainPanel;
        constructor(mainPanel: MainPanel, gameConf: ExtGameConfig, skin: starlingswf.SwfSprite);
        onClicnEvent(e: egret.Event): void;
        onLoadGameComplete(): void;
        /**
         * 加载比赛资源
         */
        loadMatchAssets(): void;
        /**
         * 比赛资源配置加载成功
         */
        loadMatchResConfigComplete(data: any): void;
        /**
         * 比赛资源加载成功
         */
        loadMatchAssetComplete(data: any): void;
        /**
         * 显示比赛面板
         */
        showMatch(): void;
        dispose(): void;
    }
}
declare module lj.cgcp {
    class SettingPanel extends BasePanel {
        control1: VolumeControl;
        control2: VolumeControl;
        constructor();
        mainAssetName(): string;
        dispose(): void;
    }
}
declare module lj.cgcp {
    class VolumeControl {
        tag: egret.Bitmap;
        val: egret.Bitmap;
        type: number;
        constructor(mainAsset: starlingswf.SwfSprite, type: number);
        mouseDown(e: egret.TouchEvent): void;
        mouseUp(e: egret.TouchEvent): void;
        mouseMove(e: egret.TouchEvent): void;
        updateWidth(): void;
        dispose(): void;
    }
}
declare module lj.cgcp {
    /**
     * 投票结束游戏
     */
    class VoteEndGamePanel extends BasePanel {
        titleText: egret.TextField;
        agreeBtn: starlingswf.SwfButton;
        disagreeBtn: starlingswf.SwfButton;
        timeText: egret.TextField;
        timeVal: number;
        items: any;
        timeoutId: any;
        timeTextTimeoutId: any;
        constructor();
        on_agreeBtn(e: egret.Event): void;
        on_disagreeBtn(e: egret.Event): void;
        /**
         * 设置发起者的名字
         */
        setLeaveName(name: string): void;
        /**
         * 将按钮设置为不可点击状态
         */
        setBtnState(): void;
        /**
         * 根据投票信息显示数据
         */
        showByDatas(voteEndGames: string[]): void;
        checkState(): void;
        updateTimeText(): void;
        dispose(): void;
        mainAssetName(): string;
    }
}
declare module lj.cgcp {
    /**
     * 投票结果
     */
    class VoteResultItem extends BasePanel {
        nameText: egret.TextField;
        chooseMC: starlingswf.SwfMovieClip;
        constructor();
        setName(name: string): void;
        setState(state: number): void;
        mainAssetName(): string;
    }
}
declare module lj.cgcp {
    class ApiState {
        static stateTxt: any;
        static show(state: string): void;
        static showText(text: string): void;
    }
}
declare module lj.cgcp {
    class ChatButton {
        private static mouseClick(evt);
        /**
         * 创建录音按钮
         */
        static createChatButton(): starlingswf.SwfButton;
        /**
         * 销毁录音按钮
         */
        static destroyChatButton(btn: starlingswf.SwfButton): void;
    }
}
declare module lj.cgcp {
    class AdminApi {
        /**
         * 玩家创建超过30分钟游戏没开始 离线回来 游戏房间销毁
         */
        static onPaoMadeng(data: any): void;
    }
}
declare module lj.cgcp {
    class NetWorkError extends egret.DisplayObjectContainer {
        static show(): void;
        mainAsset: starlingswf.SwfSprite;
        constructor();
        onOkBtn(e: egret.Event): void;
    }
}
declare module lj.cgcp {
    class NetworkLoading {
        private static loading;
        private static loadingText;
        private static background;
        private static showCount;
        static show(now?: boolean): void;
        static realyShow(): void;
        static setLoadinText(text: string): void;
        static hide(): void;
    }
}
declare module lj.cgcp {
    class PaoMaDeng extends BasePanel {
        static instance: PaoMaDeng;
        static tips: any[];
        /**
         * 显示一段跑马灯
         * @param text 显示文本
         * @param gap 播放间隔
         * @param count 播放次数
         */
        static show(text: string, gap: number, count: number): void;
        text: egret.TextField;
        textWidth: number;
        textMask: egret.DisplayObject;
        playing: boolean;
        constructor();
        start(): void;
        stop(): void;
        update(e: egret.Event): void;
        layout(): void;
        mainAssetName(): string;
    }
}
declare module lj.cgcp {
    class RoleHeadImage extends NetImage {
        role: Role;
        wrzImage: egret.Bitmap;
        constructor(role: Role, needClick?: boolean);
        reloadByRole(role: Role): void;
        onClick(e: egret.Event): void;
        dispose(): void;
        $setWidth(value: number): boolean;
        $setHeight(value: number): boolean;
    }
}
declare module lj.cgcp {
    /**
     * 玩家详细信息
     */
    class RoleInfo extends BasePanel {
        role: Role;
        headImage: egret.Bitmap;
        nameText: egret.TextField;
        idText: egret.TextField;
        ipText: egret.TextField;
        constructor(role: Role, texture: egret.Texture);
        /**
         * 点击详细位置按钮
         */
        on_posBtn(e: egret.Event): void;
        mainAssetName(): string;
    }
}
declare module lj.cgcp {
    class ShareTip extends egret.Sprite {
        private static _tip;
        static readonly instance: ShareTip;
        arrow: egret.DisplayObject;
        constructor();
        show(): void;
        hide(): void;
        onClick(e: egret.Event): void;
        addToStage(e: egret.Event): void;
        removeFromStage(e: egret.Event): void;
        resize(e: egret.Event): void;
    }
}
declare module lj.cgcp {
    /**
     * 文字提示面板
     */
    class TipPanel extends BasePanel {
        static create(text: string, eventThisObj: any, eventOkFun: Function, eventCancalFun?: Function, show?: boolean): TipPanel;
        cancelBtn: starlingswf.SwfButton;
        okBtn: starlingswf.SwfButton;
        tipText: egret.TextField;
        eventThisObj: any;
        eventOkFun: Function;
        eventCancalFun: Function;
        constructor();
        on_cancelBtn(e: egret.Event): void;
        on_okBtn(e: egret.Event): void;
        mainAssetName(): string;
    }
}
declare module lj.cgcp {
    /**
     * 警告提示
     */
    class TipWarning {
        /**
         * 警告显示对象
         */
        static warningDisplay: starlingswf.SwfSprite;
        /**
         * 显示警告
         */
        static show(): void;
    }
}
declare module lj.cgcp {
    class VoiceButton {
        private static microphoneImage;
        private static mouseDown(evt);
        private static mouseUp(evt);
        /**
         * 创建录音按钮
         */
        static createVoiceButton(): starlingswf.SwfButton;
        /**
         * 销毁录音按钮
         */
        static destroyVocieButton(btn: starlingswf.SwfButton): void;
    }
}
declare module lj.cgcp {
    /**
     * 等待文字
     */
    class WaitingTextTip {
        static waitingDisplay: starlingswf.SwfSprite;
        /**
         * 显示等待文字
         */
        static showWait(text: string): void;
        /**
         * 隐藏等待文字
         */
        static hideWait(): void;
    }
}
declare class BmTextUtil {
    static replaceTextfield(textfield: any, font: egret.BitmapFont): egret.BitmapText;
}
declare module lj.cgcp {
    class ColorUtil {
        /**
         * 设置对象颜色为灰色
         */
        static setGray(display: egret.DisplayObject): void;
        /**
         * 清除颜色
         */
        static clearColor(display: egret.DisplayObject): void;
    }
}
declare module lj.cgcp {
    class InterfaceVariablesUtil {
        static initVariables(obj: any, interFace: egret.DisplayObjectContainer): void;
        static disposeVariables(obj: any): void;
    }
}
declare module lj.cgcp {
    class LayoutUtil {
        /**
         * 靠上对其
         */
        static layout_up(display: egret.DisplayObject): void;
        /**
         * 靠下对其
         */
        static layout_down(display: egret.DisplayObject): void;
        /**
         * 左对其
         */
        static layout_left(display: egret.DisplayObject): void;
        /**
         * 左上
         */
        static layout_left_up(display: egret.DisplayObject): void;
        /**
         * 左下
         */
        static layout_left_down(display: egret.DisplayObject): void;
        /**
         * 右对齐
         */
        static layout_right(display: egret.DisplayObject): void;
        /**
         * 右上
         */
        static layout_right_up(display: egret.DisplayObject): void;
        /**
         * 右下
         */
        static layout_right_down(display: egret.DisplayObject): void;
        /**
         * X居中
         */
        static layout_center_x(display: egret.DisplayObject): void;
        /**
         * Y居中
         */
        static layout_center_y(display: egret.DisplayObject): void;
        /**
         * 正中间
         */
        static layout_center_xy(display: egret.DisplayObject): void;
        /**
         * 中上
         */
        static layout_center_up(display: egret.DisplayObject): void;
        /**
         * 中下
         */
        static layout_center_down(display: egret.DisplayObject): void;
        /**
         * 填充
         */
        static layout_fill(display: egret.DisplayObject): void;
        static getLayoutX(display: egret.DisplayObject): number;
        static getLayoutY(display: egret.DisplayObject): number;
    }
}
declare module lj.cgcp {
    class Log {
        static log(data: any): void;
    }
}
declare module lj.cgcp {
    class WxUtils {
        static playSoundQueue: string[];
        static playSounding: boolean;
        static hasWx(): boolean;
        /**
         * 初始化微信jssdk
         */
        static initWx(): void;
        /**
         * 自定义游戏分享内容，仅小游戏调用
         */
        static customizeShareDesc(title: string, desc: string, shareRoom?: boolean): void;
        /**
         * 进入游戏，单独定制分享内容
         */
        static joinGame(gameConf: ExtGameConfig, title?: string, desc?: string, shareRoom?: boolean): void;
        /**
         * 进入平台
         */
        static joinPlatform(): void;
        /**
         * 分享购卡连接
         */
        static sharePayByProxy(): void;
        /**
         * 开始录音
         */
        static startRecord(): void;
        /**
         * 停止录音
         */
        static stopRecord(suc: Function): void;
        /**
         * 播放声音
         */
        static playVoice(localId: string): void;
        /**
         * 上传声音
         */
        static uploadVoice(localId: string, suc: Function): void;
        /**
         * 下载声音
         */
        static downloadVoice(serverId: string, suc: Function): void;
        /**
         * 获取地理位置
         */
        static getLocation(suc: Function): void;
        /**
         * 打开位置详情
         */
        static openLocation(latitude: number, longitude: number): void;
        /**
         * 关闭当前网页
         */
        static closeWindow(): void;
        /**
         * 获取分享时 玩家显示名字
         */
        static getShareRoleName(name: string): string;
        static filteremoji(emojireg: string): string;
    }
}
