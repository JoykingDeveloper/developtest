var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var BaseApi = (function () {
            function BaseApi() {
            }
            /**
             * 初始化baseapi
             */
            BaseApi.init = function (host, port) {
                BaseApi._host = host;
                BaseApi._port = port;
                BaseApi._socketClient = new lzm.JSONWebSocketClient(host, port);
                BaseApi._sendQueue = [];
                BaseApi._callBackQueue = [];
                BaseApi._currentSendObject = null;
                BaseApi._socketClient.onConnectCallBack = BaseApi.onConnect;
                BaseApi._socketClient.onCloseCallBack = BaseApi.onConnectClose;
                BaseApi._socketClient.onIOErrorCallBack = BaseApi.onIOError;
                BaseApi._socketClient.onDataCallBack = BaseApi.onData;
                BaseApi.clearCmd();
                cgcp.BaseApiCmdInit.initCmds();
            };
            BaseApi.onConnect = function () {
                cgcp.Log.log("connect");
                if (BaseApi._currentSendObject == null && BaseApi._sendQueue.length > 0) {
                    BaseApi._currentSendObject = BaseApi._sendQueue.shift();
                }
                if (cgcp.AccountData.getSessionToken() != null) {
                    cgcp.UserApi.resetfd();
                }
                if (BaseApi._currentSendObject != null) {
                    BaseApi.sendObject(BaseApi._currentSendObject);
                }
            };
            BaseApi.onConnectClose = function () {
                cgcp.Log.log("connectClose");
                cgcp.NetWorkError.show();
                BaseApi._isError = true;
            };
            BaseApi.onIOError = function () {
                cgcp.Log.log("onIOError");
                cgcp.NetWorkError.show();
                BaseApi._isError = true;
            };
            BaseApi.onData = function (data) {
                cgcp.Log.log("reponseData:" + JSON.stringify(data));
                if (data.cmd) {
                    BaseApi.dispatchCmd(data.cmd, data);
                }
                else if (BaseApi._callBackQueue.length > 0) {
                    cgcp.NetworkLoading.hide();
                    if (BaseApi._sendQueue.length == 0) {
                        BaseApi._currentSendObject = null;
                    }
                    var callBack = BaseApi._callBackQueue.shift();
                    callBack(data);
                    if (BaseApi._sendQueue.length > 0) {
                        BaseApi._currentSendObject = BaseApi._sendQueue.shift();
                        BaseApi.sendObject(BaseApi._currentSendObject);
                    }
                }
            };
            BaseApi.requestUser = function (pars, callBack, errorCallBack) {
                BaseApi.request("login", pars, callBack, errorCallBack);
            };
            BaseApi.requestLogic = function (pars, callBack, errorCallBack) {
                pars['sessionToken'] = cgcp.AccountData.getSessionToken();
                BaseApi.request("logic", pars, callBack, errorCallBack);
            };
            BaseApi.request = function (path, pars, callBack, errorCallBack) {
                if (BaseApi._isError)
                    return;
                cgcp.NetworkLoading.show();
                var dataObject = { "path": path, "pars": pars };
                if (BaseApi._currentSendObject == null) {
                    BaseApi._currentSendObject = dataObject;
                    BaseApi.sendObject(BaseApi._currentSendObject);
                }
                else {
                    BaseApi._sendQueue.push(dataObject);
                }
                BaseApi._callBackQueue.push(function (data) {
                    if (data.state != 0) {
                        if (errorCallBack != null) {
                            errorCallBack(data);
                        }
                        else {
                            if (data.state == -5) {
                                cgcp.NetWorkError.show();
                            }
                            else {
                                cgcp.ApiState.show(data.state);
                            }
                        }
                    }
                    else {
                        if (callBack != null)
                            callBack(data);
                    }
                });
            };
            /**
             * 发送数据
             */
            BaseApi.sendObject = function (obj) {
                if (!BaseApi._socketClient.isConnect) {
                    BaseApi._socketClient.connect();
                    return;
                }
                cgcp.Log.log("req path:" + obj.path);
                cgcp.Log.log("req data:" + JSON.stringify(obj.pars));
                var sendObj = { "path": obj.path, "reqData": obj.pars };
                BaseApi._socketClient.sendData(sendObj);
            };
            /***
             * 清除所有命令
             */
            BaseApi.clearCmd = function () {
                BaseApi._commands = {};
                BaseApi._commandsThisObjects = {};
            };
            /**
             * 注册命令
             */
            BaseApi.registerCmd = function (cmd, callBack, thisObj, isHead) {
                if (isHead === void 0) { isHead = false; }
                var cmds = BaseApi._commands[cmd];
                // if(cmds != null){
                // 	cmds = BaseApi._commands[cmd];
                // }else{
                // 	cmds = [];
                // }
                if (cmds == null) {
                    cmds = [];
                }
                if (isHead) {
                    cmds.unshift([callBack, thisObj]);
                }
                else {
                    cmds.push([callBack, thisObj]);
                }
                BaseApi._commands[cmd] = cmds;
            };
            /**
             * 移除命令
             */
            BaseApi.removeCmd = function (cmd, callBack, thisObj) {
                var cmds = BaseApi._commands[cmd];
                // if(cmds != null){
                // 	cmds = BaseApi._commands[cmd];
                // }else{
                // 	cmds = [];
                // }
                if (cmds == null) {
                    cmds = [];
                }
                var index = -1;
                var len = cmds.length;
                for (var i = 0; i < len; i++) {
                    if (cmds[i][0] == callBack && cmds[i][1] == thisObj)
                        index = i;
                }
                if (index != -1) {
                    cmds.splice(index, 1);
                }
                BaseApi._commands[cmd] = cmds;
            };
            /**
             * 派发命令消息
             */
            BaseApi.dispatchCmd = function (cmd, data) {
                var cmds = BaseApi._commands[cmd];
                // if(cmds != null){
                // 	cmds = BaseApi._commands[cmd];
                // }else{
                // 	cmds = [];
                // }
                if (cmds == null) {
                    cmds = [];
                }
                var len = cmds.length;
                var thisObj;
                var fun;
                for (var i = 0; i < len; i++) {
                    thisObj = cmds[i][1];
                    fun = cmds[i][0];
                    fun.apply(thisObj, [data]);
                }
            };
            return BaseApi;
        }());
        BaseApi._isError = false;
        cgcp.BaseApi = BaseApi;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var CacheData = (function () {
            function CacheData() {
            }
            CacheData.getRAMData = function (key) {
                return CacheData._ramDatas[key];
            };
            CacheData.saveRAMData = function (key, data) {
                CacheData._ramDatas[key] = data;
            };
            CacheData.removeRAMData = function (key) {
                delete CacheData._ramDatas[key];
            };
            CacheData.clearRAMData = function () {
                CacheData._ramDatas = {};
            };
            return CacheData;
        }());
        CacheData._ramDatas = {};
        cgcp.CacheData = CacheData;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var BasePanel = (function (_super) {
            __extends(BasePanel, _super);
            function BasePanel(setCurrent) {
                if (setCurrent === void 0) { setCurrent = false; }
                var _this = _super.call(this) || this;
                if (setCurrent)
                    BasePanel.currentPanel = _this;
                if (_this.mainAssetName() != null && _this.assetSwf() != null) {
                    _this.mainAsset = _this.assetSwf().createSprite(_this.mainAssetName());
                    _this.addChild(_this.mainAsset);
                    cgcp.InterfaceVariablesUtil.initVariables(_this, _this.mainAsset);
                }
                _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this._addToStage_, _this);
                _this.addEventListener(egret.Event.REMOVED_FROM_STAGE, _this._removeFromStage_, _this);
                _this.init();
                return _this;
            }
            BasePanel.prototype._addToStage_ = function (e) {
                this.layout();
                this.stage.addEventListener(egret.Event.RESIZE, this.onResize, this);
            };
            BasePanel.prototype._removeFromStage_ = function (e) {
                this.stage.removeEventListener(egret.Event.RESIZE, this.onResize, this);
            };
            BasePanel.prototype.onResize = function (e) {
                this.layout();
            };
            BasePanel.prototype.init = function () { };
            BasePanel.prototype.layout = function () { };
            BasePanel.prototype.on_closeBtn = function (e) {
                this.dispose();
            };
            BasePanel.prototype.dispose = function () {
                _super.prototype.dispose.call(this);
                this.removeEventListener(egret.Event.ADDED_TO_STAGE, this._addToStage_, this);
                this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this._removeFromStage_, this);
                cgcp.InterfaceVariablesUtil.disposeVariables(this);
            };
            BasePanel.prototype.mainAssetName = function () {
                return null;
            };
            BasePanel.prototype.assetSwf = function () {
                return cgcp.AssetManager.mainSwf();
            };
            return BasePanel;
        }(lzm.BasePanel));
        cgcp.BasePanel = BasePanel;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        /**
         * 网络图片
         */
        var NetImage = (function (_super) {
            __extends(NetImage, _super);
            function NetImage(url, setNativSize) {
                if (setNativSize === void 0) { setNativSize = false; }
                var _this = _super.call(this) || this;
                _this.image = new egret.Bitmap();
                _this.setNativSize = setNativSize;
                _this.addChild(_this.image);
                _this.reload(url);
                return _this;
            }
            NetImage.prototype.reload = function (url) {
                if (url == null || url == "") {
                    return;
                }
                if (this.loader == null) {
                    this.loader = new egret.ImageLoader();
                    this.loader.addEventListener(egret.Event.COMPLETE, this.loadComplete, this);
                }
                this.loader.load(url);
            };
            NetImage.prototype.loadComplete = function (e) {
                if (this.image.texture != null)
                    this.image.texture.dispose();
                var bitmapData = this.loader.data;
                var texture = new egret.Texture();
                texture._setBitmapData(bitmapData);
                this.image.texture = texture;
                if (this.setNativSize) {
                    this.image.width = this.image.texture.textureWidth;
                    this.image.height = this.image.texture.textureHeight;
                }
            };
            NetImage.prototype.dispose = function () {
                if (this.loader != null) {
                    this.loader.removeEventListener(egret.Event.COMPLETE, this.loadComplete, this);
                }
                if (this.image.texture != null && this.image.texture != RES.getRes("defUser")) {
                    this.image.texture.dispose();
                    this.image.texture = null;
                }
            };
            NetImage.prototype.$setWidth = function (value) {
                this.image.width = value;
                return true;
            };
            NetImage.prototype.$getWidth = function () {
                return this.image.width;
            };
            NetImage.prototype.$setHeight = function (value) {
                this.image.height = value;
                return true;
            };
            NetImage.prototype.$getHeight = function () {
                return this.image.height;
            };
            return NetImage;
        }(egret.DisplayObjectContainer));
        cgcp.NetImage = NetImage;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        /**
         * 代理后台
         */
        var ManagerBase = (function (_super) {
            __extends(ManagerBase, _super);
            function ManagerBase() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            ManagerBase.show = function () {
                if (cgcp.RoleData.getRole().proxy < 1) {
                    cgcp.ApiState.showText("你还不是游戏代理");
                    return;
                }
                if (!RES.isGroupLoaded("manager_res")) {
                    cgcp.NetworkLoading.show(true);
                    cgcp.AssetManager.loadConfig(cgcp.AppConfig.manager_resConfigUrl, cgcp.AppConfig.manager_resUrl, ManagerBase.loadResConfigComplete, ManagerBase);
                }
                else {
                    ManagerBase._show();
                }
            };
            /**
             * 活动资源配置加载成功
             */
            ManagerBase.loadResConfigComplete = function (data) {
                cgcp.AssetManager.loadGroup("manager_res", ManagerBase.loadManagerSwfCallBack, ManagerBase);
            };
            ManagerBase.loadManagerSwfCallBack = function (data) {
                var callBackType = data[0];
                var e = data[1];
                if (callBackType == "onResourceLoadComplete") {
                    cgcp.NetworkLoading.hide();
                    ManagerBase._show();
                }
            };
            ManagerBase._show = function () {
                var clazz = egret.getDefinitionByName(cgcp.AppConfig.manager_mainClass);
                var managerPanel = new clazz();
                lzm.Alert.show(managerPanel);
            };
            return ManagerBase;
        }(cgcp.BasePanel));
        cgcp.ManagerBase = ManagerBase;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var CGCPStarup = (function (_super) {
            __extends(CGCPStarup, _super);
            function CGCPStarup() {
                var _this = _super.call(this) || this;
                _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
                return _this;
            }
            CGCPStarup.prototype.onAddToStage = function (event) {
                cgcp.App.init(this.stage, this);
                cgcp.AssetManager.initWithStart(this.loadResConfigCallBack, this);
            };
            /**
             * 资源配置加载完成
             */
            CGCPStarup.prototype.loadResConfigCallBack = function (data) {
                cgcp.Log.log("初始化配置加载完成");
                cgcp.AssetManager.loadGroup("loading", this.loadResCallBack, this);
            };
            /**
             * 初始化资源组 加载回调
             */
            CGCPStarup.prototype.loadResCallBack = function (data) {
                var callBackType = data[0];
                var e = data[1];
                if (callBackType == "onResourceLoadComplete") {
                    if (e.groupName == "loading") {
                        this.loadingUi = new cgcp.LoadingUI();
                        this.loadingUi.x = cgcp.App.stageWidth / 2;
                        this.loadingUi.y = 320;
                        this.addChild(this.loadingUi);
                        cgcp.AssetManager.loadGroup("preload", this.loadResCallBack, this);
                    }
                    else if (e.groupName == "preload") {
                        cgcp.BaseApi.init(cgcp.AppConfig.server_host, cgcp.AppConfig.server_port);
                        if (cgcp.SettingData.soundVolume() > 0)
                            starlingswf.SwfButton.defSound = RES.getRes("ui_click");
                        if (cgcp.AppConfig.need_wx)
                            cgcp.WxUtils.initWx();
                        this.removeChild(this.loadingUi);
                        this.addChild(new cgcp.LoginPanel());
                    }
                }
                else if (callBackType == "onResourceProgress" && e.groupName == "preload") {
                    this.loadingUi.setProgress(parseInt(((e.itemsLoaded / e.itemsTotal) * 100).toString()));
                }
            };
            return CGCPStarup;
        }(egret.DisplayObjectContainer));
        cgcp.CGCPStarup = CGCPStarup;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var BaseApiCmdInit = (function () {
            function BaseApiCmdInit() {
            }
            BaseApiCmdInit.initCmds = function () {
                cgcp.BaseApi.registerCmd("joinRoom", cgcp.RoomApi.onJoinRoom, cgcp.RoomApi);
                cgcp.BaseApi.registerCmd("returnGame", cgcp.RoomApi.onReturnGame, cgcp.RoomApi);
                cgcp.BaseApi.registerCmd("leaveRoom", cgcp.RoomApi.onLeaveRoom, cgcp.RoomApi);
                cgcp.BaseApi.registerCmd("leaveGame", cgcp.RoomApi.onLeaveGame, cgcp.RoomApi);
                cgcp.BaseApi.registerCmd("disbandRoom", cgcp.RoomApi.onDisbandRoom, cgcp.RoomApi);
                cgcp.BaseApi.registerCmd("roomTimeOver", cgcp.RoomApi.onRoomTimeOver, cgcp.RoomApi);
                cgcp.BaseApi.registerCmd("kick", cgcp.RoomApi.onKick, cgcp.RoomApi);
                cgcp.BaseApi.registerCmd("gameStart", cgcp.GameApi.onGameStart, cgcp.GameApi);
                cgcp.BaseApi.registerCmd("gameOver", cgcp.GameApi.onGameOver, cgcp.GameApi);
                cgcp.BaseApi.registerCmd("syncCard", cgcp.RoleApi.onSyncCard, cgcp.RoleApi);
                cgcp.BaseApi.registerCmd("sendVoice", cgcp.ChatApi.onSendVoice, cgcp.ChatApi);
                cgcp.BaseApi.registerCmd("sendText", cgcp.ChatApi.onSendText, cgcp.ChatApi);
                cgcp.BaseApi.registerCmd("sendImage", cgcp.ChatApi.onSendImage, cgcp.ChatApi);
                cgcp.BaseApi.registerCmd("paoMaDeng", cgcp.AdminApi.onPaoMadeng, cgcp.AdminApi);
            };
            return BaseApiCmdInit;
        }());
        cgcp.BaseApiCmdInit = BaseApiCmdInit;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        /**
         * 聊天接口
         */
        var ChatApi = (function () {
            function ChatApi() {
            }
            /**
             * 发送语音消息
             */
            ChatApi.sendVoice = function (serverId, callBack) {
                var pars = { "api": "chat", "c": "sendVoice" };
                pars["serverId"] = serverId;
                cgcp.BaseApi.requestLogic(pars, function (data) {
                    if (callBack != null)
                        callBack(data);
                }, null);
            };
            /**
             * 发送常用语
             */
            ChatApi.sendText = function (textId) {
                var pars = { "api": "chat", "c": "sendText" };
                pars["textId"] = textId;
                cgcp.BaseApi.requestLogic(pars, function (data) { }, null);
            };
            /**
             * 发送常用表情
             */
            ChatApi.sendImage = function (imageId) {
                var pars = { "api": "chat", "c": "sendImage" };
                pars["imageId"] = imageId;
                cgcp.BaseApi.requestLogic(pars, function (data) { }, null);
            };
            /**
             * 收到语音消息
             */
            ChatApi.onSendVoice = function (data) {
                var serverId = data.serverId;
                cgcp.WxUtils.downloadVoice(serverId, function (localId) {
                    cgcp.WxUtils.playVoice(localId);
                    cgcp.ChatManager.showVoice(data);
                });
            };
            /**
             * 收到常用语
             */
            ChatApi.onSendText = function (data) {
                cgcp.ChatManager.showText(data);
            };
            /**
             * 收到常用语
             */
            ChatApi.onSendImage = function (data) {
                cgcp.ChatManager.showBq(data);
            };
            return ChatApi;
        }());
        cgcp.ChatApi = ChatApi;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var GameApi = (function () {
            function GameApi() {
            }
            /**
             * 获取游戏配置列表
             */
            GameApi.getGameList = function (callBack) {
                if (cgcp.ExtGameConfigData.getGameList() != null) {
                    callBack(null);
                    return;
                }
                lzm.HttpClient.send(cgcp.AppConfig.gameList, null, function (data) {
                    cgcp.ExtGameConfigData.putGameList(JSON.parse(data));
                    if (callBack)
                        callBack(null);
                }, function (data) {
                    GameApi.getGameList(callBack);
                });
            };
            /**
             * 获取返回游戏的相关信息
             */
            GameApi.returnGame = function (callBack) {
                var pars = { "api": "game", "c": "returnGame" };
                cgcp.BaseApi.requestLogic(pars, function (data) {
                    if (data.room != null) {
                        cgcp.RoomData.putCurrentRoom(data.room);
                        cgcp.RoomData.saveRoles(data.roles);
                        var leaveGames = data.leaveGames;
                        var len = leaveGames.length;
                        for (var i = 0; i < len; i++) {
                            cgcp.RoomData.saveCurrentRoomOffline(leaveGames[i]);
                        }
                    }
                    if (callBack != null)
                        callBack(data);
                }, null);
            };
            /**
             * 登录游戏
             */
            GameApi.loginGame = function (callBack) {
                var pars = { "api": "game", "c": "loginGame" };
                cgcp.BaseApi.requestLogic(pars, function (data) {
                    if (callBack != null)
                        callBack(data);
                }, null);
            };
            /**
             * 检测游戏是否创建成功
             */
            GameApi.checkGameCreate = function () {
                var pars = { "api": "game", "c": "checkGameCreate" };
                cgcp.BaseApi.requestLogic(pars, function (data) { }, null);
            };
            /**
             * 收到游戏开始的消息，游戏开始后 玩家就不能退出了，只能投票结束游戏
             */
            GameApi.onGameStart = function (data) {
                cgcp.RoomData.putCurrentRoom(data.room);
            };
            /**
             * 收到游戏结束的消息
             */
            GameApi.onGameOver = function (data) {
                if (data.hasNewPlayer == 1) {
                    cgcp.RoleData.getRole().card = data.card;
                    egret.setTimeout(function () {
                        cgcp.Log.log("获得带新人奖励 房卡4张");
                        cgcp.TipPanel.create("获得带新人奖励 房卡4张", null, null);
                    }, this, 300);
                }
            };
            return GameApi;
        }());
        cgcp.GameApi = GameApi;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var RoleApi = (function (_super) {
            __extends(RoleApi, _super);
            function RoleApi() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            /**
             * 创建角色
             */
            RoleApi.createRole = function (name, callBack) {
                var pars = { "api": "role", "c": "createRole", "name": name };
                cgcp.BaseApi.requestLogic(pars, function (data) {
                    cgcp.RoleData.putRole(data.role);
                    if (callBack != null)
                        callBack(data);
                    cgcp.WxUtils.getLocation(function (res) {
                        RoleApi.syncPos(res.latitude, res.longitude);
                    });
                }, null);
            };
            /**
             * 获取角色信息
             */
            RoleApi.getRoleInfo = function (targetUid, callBack) {
                var pars = { "api": "role", "c": "getRoleInfo", "targetUid": targetUid };
                cgcp.BaseApi.requestLogic(pars, function (data) {
                    if (callBack != null)
                        callBack(data);
                }, null);
            };
            /**
             * 同步位置信息
             */
            RoleApi.syncPos = function (latitude, longitude) {
                var pars = { "api": "role", "c": "syncPos" };
                pars['latitude'] = latitude;
                pars['longitude'] = longitude;
                cgcp.BaseApi.requestLogic(pars, function (data) {
                    cgcp.RoleData.getRole().latitude = latitude;
                    cgcp.RoleData.getRole().longitude = longitude;
                }, null);
            };
            /**
             * 同步错误信息
             */
            RoleApi.syncError = function (error) {
                var pars = { "api": "role", "c": "syncError" };
                pars['error'] = error;
                cgcp.BaseApi.requestLogic(pars, function (data) { }, null);
            };
            /**
             * 同步房卡数量
             */
            RoleApi.syncCard = function (callBack) {
                var pars = { "api": "role", "c": "syncCard" };
                cgcp.BaseApi.requestLogic(pars, function (data) {
                    cgcp.RoleData.getRole().card = data.card;
                    if (callBack != null)
                        callBack(data);
                }, null);
            };
            /**
             * 赠送房卡
             */
            RoleApi.shareCard = function (targetUid, cardNum, callBack) {
                var pars = { "api": "role", "c": "shareCard" };
                pars["targetUid"] = targetUid;
                pars["cardNum"] = cardNum;
                cgcp.BaseApi.requestLogic(pars, function (data) {
                    cgcp.RoleData.getRole().card = data.card;
                    if (callBack != null)
                        callBack(data);
                }, null);
            };
            /**
             * 获取战绩
             */
            RoleApi.getZhanji = function (game_id, callBack) {
                var pars = { "api": "role", "c": "getZhanji" };
                pars["game_id"] = game_id;
                cgcp.BaseApi.requestLogic(pars, function (data) {
                    if (callBack != null)
                        callBack(data);
                }, null);
            };
            /**
             * 收到同步房卡的推送
             */
            RoleApi.onSyncCard = function (data) {
                cgcp.RoleData.getRole().card = data.card;
                if (data.score1) {
                    cgcp.RoleData.getRole().score1 = data.score1;
                }
                if (data.score2) {
                    cgcp.RoleData.getRole().score2 = data.score2;
                }
            };
            return RoleApi;
        }(cgcp.BaseApi));
        cgcp.RoleApi = RoleApi;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var RoomApi = (function (_super) {
            __extends(RoomApi, _super);
            function RoomApi() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            /**
             * 创建房间
             */
            RoomApi.createRoom = function (game_id, createData, callBack, errorCallBack) {
                if (errorCallBack === void 0) { errorCallBack = null; }
                var pars = { "api": "room", "c": "createRoom", "game_id": game_id, "createData": createData };
                cgcp.BaseApi.requestLogic(pars, function (data) {
                    cgcp.RoomData.putCurrentRoom(data.room);
                    var roles = {};
                    roles[cgcp.RoleData.getRole().uid] = cgcp.RoleData.getRole();
                    cgcp.RoomData.saveRoles(roles);
                    if (callBack != null)
                        callBack(data);
                }, errorCallBack);
            };
            /**
             * 加入房间
             */
            RoomApi.joinRoom = function (room_id, callBack) {
                var pars = { "api": "room", "c": "joinRoom", "room_id": room_id };
                cgcp.BaseApi.requestLogic(pars, function (data) {
                    cgcp.RoomData.putCurrentRoom(data.room);
                    cgcp.RoomData.saveRoles(data.roles);
                    var leaveGames = data.leaveGames;
                    var len = leaveGames.length;
                    for (var i = 0; i < len; i++) {
                        cgcp.RoomData.saveCurrentRoomOffline(leaveGames[i]);
                    }
                    if (callBack != null)
                        callBack(data);
                }, null);
            };
            /**
             * 离开房间
             */
            RoomApi.leaveRoom = function (callBack) {
                var pars = { "api": "room", "c": "leaveRoom" };
                cgcp.BaseApi.requestLogic(pars, function (data) {
                    cgcp.RoomData.putCurrentRoom(null);
                    if (callBack != null)
                        callBack(data);
                }, null);
            };
            /**
             * 解散房间
             */
            RoomApi.disbandRoom = function (callBack) {
                var pars = { "api": "room", "c": "disbandRoom" };
                cgcp.BaseApi.requestLogic(pars, function (data) {
                    cgcp.RoomData.putCurrentRoom(null);
                    if (callBack != null)
                        callBack(data);
                }, null);
            };
            /**
             * 投票解散房间
             */
            RoomApi.voteEndGame = function (result) {
                var pars = { "api": "room", "c": "voteEndGame", "result": result };
                cgcp.BaseApi.requestLogic(pars, function (data) { }, null);
            };
            /**
             * 检测投票状态
             */
            RoomApi.checkVoteEndGame = function () {
                var pars = { "api": "room", "c": "checkVoteEndGame" };
                cgcp.BaseApi.requestLogic(pars, function (data) { }, null);
            };
            /**
             * 踢人
             */
            RoomApi.kick = function (targetUid) {
                var pars = { "api": "room", "c": "kick", "targetUid": targetUid };
                cgcp.BaseApi.requestLogic(pars, function (data) { }, null);
            };
            /**
             * 向游戏发送数据
             */
            RoomApi.gameMessage = function (messageData) {
                messageData['api'] = "room";
                messageData['c'] = "gameMessage";
                cgcp.BaseApi.requestLogic(messageData, function (data) { }, null);
            };
            /** 收到加入房间的消息 */
            RoomApi.onJoinRoom = function (data) {
                cgcp.RoomData.delCurrentRoomOffline(data.sender);
                cgcp.RoomData.putCurrentRoom(data.room);
                cgcp.RoomData.saveRoles(data.roles);
                cgcp.ApiState.showText(cgcp.RoomData.getRole(data.sender).name + " \u52A0\u5165\u623F\u95F4!");
            };
            /** 玩家返回游戏 */
            RoomApi.onReturnGame = function (data) {
                cgcp.RoomData.delCurrentRoomOffline(data.sender);
                cgcp.ApiState.showText(cgcp.RoomData.getRole(data.sender).name + " \u56DE\u6765\u4E86!");
                cgcp.SoundManager.playPlatformSound("return_game");
                if (cgcp.RoomData.offLineCount <= 0) {
                    cgcp.WaitingTextTip.hideWait();
                }
            };
            /** 收到离开房间的消息 */
            RoomApi.onLeaveRoom = function (data) {
                cgcp.RoomData.delCurrentRoomOffline(data.sender);
                cgcp.RoomData.putCurrentRoom(data.room);
                cgcp.ApiState.showText(cgcp.RoomData.getRole(data.sender).name + " \u79BB\u5F00\u623F\u95F4!");
            };
            /** 玩家离线 */
            RoomApi.onLeaveGame = function (data) {
                cgcp.RoomData.saveCurrentRoomOffline(data.sender);
                cgcp.ApiState.showText(cgcp.RoomData.getRole(data.sender).name + " \u79BB\u5F00\u4E86!");
                cgcp.SoundManager.playPlatformSound("leave_game");
                egret.setTimeout(function () {
                    if (cgcp.RoomData.offLineCount > 0) {
                        cgcp.WaitingTextTip.showWait("等待其他玩家重新连接...");
                    }
                }, RoomApi, 2500);
            };
            /** 收到解散房间的消息 */
            RoomApi.onDisbandRoom = function (data) {
                cgcp.ExtGameHelper.exitExtGamePanel();
                cgcp.RoomData.putCurrentRoom(null);
            };
            /**
             * 玩家创建超过30分钟游戏没开始 离线回来 游戏房间销毁
             */
            RoomApi.onRoomTimeOver = function (data) {
                cgcp.ExtGameHelper.exitExtGamePanel();
            };
            /**
             * 被踢
             */
            RoomApi.onKick = function (data) {
                cgcp.ExtGameHelper.exitExtGamePanel();
            };
            return RoomApi;
        }(cgcp.BaseApi));
        cgcp.RoomApi = RoomApi;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var UserApi = (function (_super) {
            __extends(UserApi, _super);
            function UserApi() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            UserApi.reg = function (account, callBack) {
                var pars = { "api": "user", "c": "reg", "account": account };
                if (egret.Capabilities.os == "iOS") {
                    pars['plat_id'] = "0";
                }
                else if (egret.Capabilities.os == "Android") {
                    pars['plat_id'] = "1";
                }
                else {
                    pars['plat_id'] = "2";
                }
                var dataStr = decodeURI(egret.getOption("data"));
                if (dataStr != null && dataStr != "") {
                    var dataObj = JSON.parse(dataStr);
                    if (dataObj.state) {
                        var stateObj = JSON.parse(dataObj.state);
                        if (stateObj.recommend) {
                            pars['recommend'] = stateObj.recommend;
                        }
                    }
                }
                cgcp.BaseApi.requestUser(pars, function (data) {
                    cgcp.AccountData.putSessionToken(data.sessionToken);
                    cgcp.AccountData.putUser(data.user);
                    UserApi.initLoginData(data.loginData);
                    if (callBack != null)
                        callBack(data);
                }, null);
            };
            UserApi.resetfd = function () {
                var pars = { "api": "user", "c": "resetfd", "sessionToken": cgcp.AccountData.getSessionToken() };
                cgcp.BaseApi.requestUser(pars, function () { }, null);
            };
            UserApi.initLoginData = function (data) {
                if (data.role == null)
                    return;
                cgcp.RoleData.putRole(data.role);
                cgcp.WxUtils.getLocation(function (res) {
                    cgcp.RoleData.getRole().latitude = res.latitude;
                    cgcp.RoleData.getRole().longitude = res.longitude;
                    cgcp.RoleApi.syncPos(res.latitude, res.longitude);
                });
                var paoMaDeng = data.paoMaDeng;
                if (paoMaDeng != null) {
                    var len = paoMaDeng.length;
                    for (var i = 0; i < paoMaDeng.length; i++) {
                        cgcp.PaoMaDeng.show(paoMaDeng[i][0], paoMaDeng[i][1], paoMaDeng[i][2]);
                    }
                }
            };
            return UserApi;
        }(cgcp.BaseApi));
        cgcp.UserApi = UserApi;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var AssetLoadObject = (function () {
            function AssetLoadObject() {
            }
            /**
             * 配置加载完成
             */
            AssetLoadObject.prototype.loadConfigComplete = function (e) {
                RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.loadConfigComplete, this);
                if (this.callBack != null && this.CallBackThisObj != null) {
                    this.callBack.apply(this.CallBackThisObj, [["loadConfigComplete", e]]);
                }
            };
            /**
             * 资源组加载完成
             */
            AssetLoadObject.prototype.onResourceLoadComplete = function (e) {
                RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
                RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
                RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
                RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
                if (this.callBack != null && this.CallBackThisObj != null) {
                    this.callBack.apply(this.CallBackThisObj, [["onResourceLoadComplete", e]]);
                }
            };
            /**
             * 资源组加载出错
             */
            AssetLoadObject.prototype.onResourceLoadError = function (e) {
                RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
                RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
                RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
                RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
                if (this.callBack != null && this.CallBackThisObj != null) {
                    this.callBack.apply(this.CallBackThisObj, [["onResourceLoadError", e]]);
                }
            };
            /**
             * 资源组加载进度
             */
            AssetLoadObject.prototype.onResourceProgress = function (e) {
                if (this.callBack != null && this.CallBackThisObj != null) {
                    this.callBack.apply(this.CallBackThisObj, [["onResourceProgress", e]]);
                }
            };
            /**
             * 资源组加载出错
             */
            AssetLoadObject.prototype.onItemLoadError = function (e) {
                RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
                RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
                RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
                RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
                if (this.callBack != null && this.CallBackThisObj != null) {
                    this.callBack.apply(this.CallBackThisObj, [["onItemLoadError", e]]);
                }
            };
            return AssetLoadObject;
        }());
        cgcp.AssetLoadObject = AssetLoadObject;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var AssetManager = (function () {
            function AssetManager() {
            }
            /**
             * 游戏启动的时候 初始化一波资源
             */
            AssetManager.initWithStart = function (callBack, callBackThisObj) {
                RES.registerAnalyzer("swf", starlingswf.SwfAnalyzer);
                RES.registerAnalyzer("js", cgcp.JSAnalyzer);
                egret.ImageLoader.crossOrigin = "Anonymous";
                if (AssetManager.is_local) {
                    AssetManager.loadConfig(cgcp.AppConfig.platform_res_config_url, cgcp.AppConfig.platform_res_url, callBack, callBackThisObj, cgcp.AccountData.getUrlData().resVer);
                }
                else {
                    cgcp.AppConfig.platform_res_url = "http://192.168.1.188/cgc_server/resource/";
                    AssetManager.loadConfig("http://192.168.1.188/cgc_server/resource/default.res.json", "http://192.168.1.188/cgc_server/resource/", callBack, callBackThisObj, cgcp.AccountData.getUrlData().resVer);
                }
            };
            /**
             * 加载资源配置
             */
            AssetManager.loadConfig = function (url, resourceRoot, callBack, callBackThisObj, confVersion) {
                if (confVersion === void 0) { confVersion = ""; }
                url += "?v=" + Math.random();
                lzm.HttpClient.send(url, {}, function (data) {
                    var conf = JSON.parse(data);
                    if (confVersion != null && confVersion != "") {
                        var resources = conf.resources;
                        for (var index in resources) {
                            resources[index]["url"] += "?v=" + confVersion;
                        }
                    }
                    RES.parseConfig(conf, resourceRoot);
                    callBack.apply(callBackThisObj, [["loadConfigComplete", conf]]);
                });
            };
            /**
             * 卸载资源配置
             */
            AssetManager.unConfig = function (config) {
                var res = RES;
                var configInstance = res.configInstance;
                var groups = config.groups;
                var resources = config.resources;
                var len = groups.length;
                var obj;
                var subkeys;
                var subkeysLen;
                for (var i = 0; i < len; i++) {
                    obj = groups[i];
                    delete configInstance.groupDic[obj.name];
                }
                len = resources.length;
                for (var i = 0; i < len; i++) {
                    obj = resources[i];
                    subkeys = obj.subkeys;
                    delete configInstance.keyMap[obj.name];
                    if (subkeys == null)
                        continue;
                    subkeysLen = subkeys.length;
                    for (var j = 0; j < subkeysLen; j++) {
                        delete configInstance.keyMap[subkeys[j]];
                    }
                }
            };
            /**
             * 加载资源组
             */
            AssetManager.loadGroup = function (name, callBack, callBackThisObj) {
                var loadObj = new cgcp.AssetLoadObject();
                loadObj.callBack = callBack;
                loadObj.CallBackThisObj = callBackThisObj;
                if (RES.isGroupLoaded(name)) {
                    loadObj.onResourceLoadComplete(null);
                    return;
                }
                RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, loadObj.onResourceLoadComplete, loadObj);
                RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, loadObj.onResourceLoadError, loadObj);
                RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, loadObj.onResourceProgress, loadObj);
                RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, loadObj.onItemLoadError, loadObj);
                RES.loadGroup(name);
            };
            AssetManager.mainSwf = function () {
                return RES.getRes("main_swf");
            };
            AssetManager.managerSwf = function () {
                return RES.getRes("manager_swf");
            };
            AssetManager.chatSwf = function () {
                return RES.getRes("chat_swf");
            };
            AssetManager.mainNewSwf = function () {
                return RES.getRes("main_new_swf");
            };
            return AssetManager;
        }());
        AssetManager.is_local = true;
        cgcp.AssetManager = AssetManager;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var GameAssetLoader = (function () {
            function GameAssetLoader(gameConf, callBack, CallBackThisObj) {
                this.callBack = callBack;
                this.CallBackThisObj = CallBackThisObj;
                if (GameAssetLoader.gameConf != null && GameAssetLoader.gameConf.id != gameConf.id) {
                    RES.destroyRes("game_res_" + GameAssetLoader.gameConf.id);
                    cgcp.AssetManager.unConfig(GameAssetLoader.gameResConfig);
                }
                GameAssetLoader.gameConf = gameConf;
            }
            GameAssetLoader.prototype.startLoad = function () {
                if (!RES.isGroupLoaded("game_res_" + GameAssetLoader.gameConf.id)) {
                    cgcp.NetworkLoading.show(true);
                    cgcp.AssetManager.loadConfig(GameAssetLoader.gameConf.resBaseUrl + GameAssetLoader.gameConf.resVer + "/default.res.json", GameAssetLoader.gameConf.resBaseUrl + GameAssetLoader.gameConf.resVer + "/", this.onLoadAssetConfComplete, this, GameAssetLoader.gameConf.resVer);
                }
                else {
                    this.callBack.apply(this.CallBackThisObj, []);
                }
            };
            GameAssetLoader.prototype.onLoadAssetConfComplete = function (data) {
                GameAssetLoader.gameResConfig = data[1];
                cgcp.AssetManager.loadGroup("game_res_" + GameAssetLoader.gameConf.id, this.onLoadAssetComplete, this);
            };
            GameAssetLoader.prototype.onLoadAssetComplete = function (data) {
                var callBackType = data[0];
                var e = data[1];
                if (callBackType == "onResourceLoadComplete") {
                    cgcp.NetworkLoading.hide();
                    this.callBack.apply(this.CallBackThisObj, []);
                }
                else if (callBackType == "onResourceProgress") {
                    var val = parseInt(((e.itemsLoaded / e.itemsTotal) * 100).toString());
                    cgcp.NetworkLoading.setLoadinText(val + "%");
                }
            };
            return GameAssetLoader;
        }());
        cgcp.GameAssetLoader = GameAssetLoader;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var JSAnalyzer = (function (_super) {
            __extends(JSAnalyzer, _super);
            function JSAnalyzer() {
                var _this = _super.call(this) || this;
                _this._dataFormat = egret.HttpResponseType.TEXT;
                JSAnalyzer.jsDic = {};
                return _this;
            }
            /**
             * 解析并缓存加载成功的数据
             */
            JSAnalyzer.prototype.analyzeData = function (resItem, data) {
                var name = resItem.name;
                if (this.fileDic[name] || !data) {
                    return;
                }
                if (JSAnalyzer.jsDic[name] == 1)
                    return;
                var str = data;
                this.fileDic[name] = str;
                var content = "\n            lj = window.lj;\n            " + str + ";\n            ";
                var func = new Function(content);
                func();
                JSAnalyzer.jsDic[name] = 1;
            };
            return JSAnalyzer;
        }(RES.BinAnalyzer));
        cgcp.JSAnalyzer = JSAnalyzer;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var SoundManager = (function () {
            function SoundManager() {
            }
            SoundManager.setGameConfig = function (gameConfig) {
                if (SoundManager.currentGameConf != null && gameConfig.id != SoundManager.currentGameConf.id) {
                    SoundManager.disposeSounds();
                }
                if (SoundManager.currentGameConf == null) {
                    SoundManager.currentGameSounds = {};
                    SoundManager.currentGameSoundChannels = {};
                    SoundManager.currentGameSoundUrls = {};
                }
                SoundManager.currentGameConf = gameConfig;
            };
            SoundManager.playPlatformSound = function (name) {
                var sound = RES.getRes(name);
                if (sound != null) {
                    var soundChannel = sound.play(0, 1);
                    soundChannel.volume = cgcp.SettingData.soundVolume();
                }
            };
            SoundManager.playGameSound = function (name, loops) {
                if (loops === void 0) { loops = 1; }
                var volume = cgcp.SettingData.soundVolume();
                if (volume > 0) {
                    SoundManager.playSound(name, loops, volume);
                }
            };
            SoundManager.playBgSound = function (name) {
                if (SoundManager.currentBgName)
                    SoundManager.stopGameSound(SoundManager.currentBgName);
                SoundManager.currentBgName = name;
                var volume = cgcp.SettingData.bgSoundVolume();
                if (volume > 0) {
                    SoundManager.playSound(name, 0, volume);
                }
            };
            SoundManager.stopGameSound = function (name) {
                var channel = SoundManager.currentGameSoundChannels[name];
                if (channel != null) {
                    channel.stop();
                }
            };
            SoundManager.playSound = function (name, loops, volume) {
                if (loops === void 0) { loops = 1; }
                if (volume === void 0) { volume = 1; }
                var sound = SoundManager.currentGameSounds[name];
                var channel;
                if (sound != null) {
                    channel = sound.play(0, loops);
                    channel.volume = volume;
                    SoundManager.currentGameSoundChannels[name] = channel;
                }
                else {
                    var loadUrl = SoundManager.currentGameConf.resBaseUrl + SoundManager.currentGameConf.resVer + "/sound/" + name + "?v=" + SoundManager.currentGameConf.resVer;
                    RES.getResByUrl(loadUrl, function (sound) {
                        SoundManager.currentGameSounds[name] = sound;
                        channel = sound.play(0, loops);
                        channel.volume = volume;
                        SoundManager.currentGameSoundChannels[name] = channel;
                        SoundManager.currentGameSoundUrls[name] = loadUrl;
                    }, SoundManager, RES.ResourceItem.TYPE_SOUND);
                }
            };
            SoundManager.disposeSounds = function () {
                var sound;
                var channel;
                for (var k in SoundManager.currentGameSounds) {
                    sound = SoundManager.currentGameSounds[k];
                    channel = SoundManager.currentGameSoundChannels[k];
                    if (channel != null)
                        channel.stop();
                    if (sound != null)
                        sound.close();
                    RES.destroyRes(SoundManager.currentGameSoundUrls[k]);
                }
                SoundManager.currentGameSounds = {};
                SoundManager.currentGameSoundChannels = {};
                SoundManager.currentGameSoundUrls = {};
            };
            /**
             * 播放常用语
             */
            SoundManager.playChangYongYu = function (name) {
                if (SoundManager.changyongSounds == null) {
                    SoundManager.changyongSounds = {};
                    SoundManager.changyongSoundChannels = {};
                }
                var sound = SoundManager.changyongSounds[name];
                var channel;
                if (sound != null) {
                    channel = sound.play(0, 1);
                    channel.volume = cgcp.SettingData.soundVolume();
                    SoundManager.changyongSoundChannels[name] = channel;
                }
                else {
                    var loadUrl = cgcp.AppConfig.platform_res_url + "changyongSound/" + name + "?v=" + SoundManager.currentGameConf.resVer;
                    RES.getResByUrl(loadUrl, function (sound) {
                        SoundManager.changyongSounds[name] = sound;
                        channel = sound.play(0, 1);
                        channel.volume = cgcp.SettingData.soundVolume();
                        SoundManager.changyongSoundChannels[name] = channel;
                    }, SoundManager, RES.ResourceItem.TYPE_SOUND);
                }
            };
            return SoundManager;
        }());
        cgcp.SoundManager = SoundManager;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var App = (function () {
            function App() {
            }
            App.init = function (stage, appRoot) {
                stage.scaleMode = egret.StageScaleMode.FIXED_WIDTH;
                stage.addEventListener(egret.Event.RESIZE, App.onResize, App);
                // stage.dirtyRegionPolicy = egret.DirtyRegionPolicy.OFF;
                App.stage = stage;
                App.appRoot = appRoot;
                App.topContainer = new egret.DisplayObjectContainer();
                App.stageRealWidth = stage.stageWidth;
                App.stageRealHeight = stage.stageHeight;
                App.stageWidth = stage.stageWidth;
                App.stageHeight = stage.stageHeight;
                stage.addChild(App.topContainer);
                var sx = App.stageWidth / App.designWidth;
                var sy = App.stageHeight / App.designHeight;
                if (sx > sy) {
                    App.alertScale = sy;
                }
                else {
                    App.alertScale = sx;
                }
                lzm.Alert.init(App.appRoot, App.stageWidth, App.stageHeight, App.alertScale);
            };
            //根据Y来缩放
            App.scaleByY = function () {
                var scale = App.stageRealHeight / App.designHeight;
                App.appRoot.scaleX = App.appRoot.scaleY = scale;
                App.stageWidth = (1 / scale) * App.stageRealWidth;
                App.stageHeight = App.designHeight;
            };
            //根据X来缩放
            App.scaleByX = function () {
                var scale = App.stageRealWidth / App.designWidth;
                App.appRoot.scaleX = App.appRoot.scaleY = scale;
                App.stageWidth = App.designWidth;
                App.stageHeight = (1 / scale) * App.stageRealHeight;
            };
            //根据XY寻找一个最适合的缩放
            App.scaleByXY = function () {
                var sx = App.stageRealWidth / App.designWidth;
                var sy = App.stageRealHeight / App.designHeight;
                if (sx > sy) {
                    App.stageWidth = App.designHeight * (sx / sy);
                }
                else if (sx < sy) {
                    App.stageHeight = App.designHeight * (sy / sx);
                }
                App.appRoot.scaleX = App.appRoot.scaleY = sx < sy ? sx : sy;
            };
            App.onResize = function (e) {
                App.stageRealWidth = App.stage.stageWidth;
                App.stageRealHeight = App.stage.stageHeight;
                App.stageWidth = App.stage.stageWidth;
                App.stageHeight = App.stage.stageHeight;
                var sx = App.stageWidth / App.designWidth;
                var sy = App.stageHeight / App.designHeight;
                if (sx > sy) {
                    App.alertScale = sy;
                }
                else {
                    App.alertScale = sx;
                }
                lzm.Alert.init(App.appRoot, App.stageWidth, App.stageHeight, App.alertScale);
            };
            Object.defineProperty(App, "isLandscape", {
                get: function () {
                    return App._isLandscape;
                },
                set: function (value) {
                    App._isLandscape = value;
                    if (cgcp.PaoMaDeng.instance)
                        cgcp.PaoMaDeng.instance.layout();
                },
                enumerable: true,
                configurable: true
            });
            App.heart = function () {
                egret.setTimeout(function () {
                    App.heartFun();
                }, App, 60000);
            };
            App.heartFun = function () {
                if (cgcp.RoleData.getRole() != null) {
                    cgcp.RoleApi.syncCard(null);
                }
                App.heart();
            };
            return App;
        }());
        App.stageRealWidth = 640; //舞台实际的宽度
        App.stageRealHeight = 1136; //舞台实际的高度
        App.designWidth = 640; //设计时 使用的宽度
        App.designHeight = 1136; //设计时 使用的高度
        App.stageWidth = 640; //缩放之后舞台的宽度
        App.stageHeight = 1136; //缩放之后舞台的高度
        App._isLandscape = false;
        cgcp.App = App;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var AppConfig = (function () {
            function AppConfig() {
            }
            return AppConfig;
        }());
        /** 游戏列表 */
        AppConfig.gameList = "http://192.168.1.188/cgc_server/gameList.php";
        /** 支付地址 */
        AppConfig.pay_path = "";
        /** 登录地址 */
        AppConfig.login_path = "";
        /** 网络资源路径  */
        AppConfig.web_res_path = "";
        /** 服务器ip */
        AppConfig.server_host = "192.168.1.188";
        /** 服务器端口 */
        AppConfig.server_port = 7501;
        /** 平台资源配置地址 */
        AppConfig.platform_res_config_url = "resource/default.res.json";
        /** 平台资源配加载前缀 */
        AppConfig.platform_res_url = "resource/";
        /** 是否需要微信接入 */
        AppConfig.need_wx = false;
        /** 微信jssdk配置地址 */
        AppConfig.wx_jssdk_config_path = "";
        /** 登录账号 */
        AppConfig.account = "";
        /** 代理后台主类 */
        AppConfig.manager_mainClass = "lj.cgcp.ManagerPanel";
        /** 公众号链接 */
        AppConfig.weichat_account_url = "";
        /** 在代理处自动购卡的连接地址 */
        AppConfig.pay_by_proxy_path = "";
        cgcp.AppConfig = AppConfig;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var ChatManager = (function () {
            function ChatManager() {
            }
            ChatManager.showChatPanel = function () {
                if (cgcp.App.isLandscape) {
                    lzm.Alert.alertLandscape(new cgcp.ChatPanel());
                }
                else {
                    lzm.Alert.alert(new cgcp.ChatPanel());
                }
            };
            ChatManager.showText = function (data) {
                var sender = data.sender;
                var textId = data.textId;
                var head = cgcp.RoleHeadCache.getHead(sender);
                if (head == null || head.parent == null)
                    return;
                var config = RES.getRes("chatConfig")["texts"];
                var text = config[parseInt(textId)][1] == "" ? config[parseInt(textId)][0] : config[parseInt(textId)][1];
                var textSpr = cgcp.AssetManager.chatSwf().createSprite("spr_text");
                textSpr.getChildAt(1).width = 1000;
                textSpr.getChildAt(1).text = text;
                var textSprWidth = textSpr.getChildAt(1).textWidth + 32;
                textSpr.getChildAt(0).width = textSprWidth;
                ChatManager.showSprite(textSpr, head, textSprWidth);
                var sound = config[parseInt(textId)][2];
                if (sound != "") {
                    var role = cgcp.RoomData.getRole(sender);
                    cgcp.SoundManager.playChangYongYu(role.sex + "/" + sound);
                }
            };
            ChatManager.showVoice = function (data) {
                var sender = data.sender;
                var head = cgcp.RoleHeadCache.getHead(sender);
                if (head == null || head.parent == null)
                    return;
                var textSpr = cgcp.AssetManager.chatSwf().createImage("img_TY_D4");
                ChatManager.showSprite(textSpr, head, 50);
            };
            ChatManager.showSprite = function (textSpr, head, textSprWidth) {
                var point = head.localToGlobal(0, 0);
                var w = cgcp.App.stageWidth / 3;
                var h = cgcp.App.stageHeight / 3;
                var posW = parseInt((point.x / w).toString());
                var posH = parseInt((point.y / h).toString());
                if (cgcp.App.isLandscape) {
                    if (posH >= 2) {
                        textSpr.x = point.x;
                        textSpr.y = point.y - textSprWidth;
                    }
                    else if (posH >= 1) {
                        if (point.x > cgcp.App.stageWidth / 2) {
                            textSpr.x = point.x - head.height;
                        }
                        else {
                            textSpr.x = point.x + textSpr.height;
                        }
                        textSpr.y = point.y + (head.width - textSprWidth) / 2;
                    }
                    else {
                        textSpr.x = point.x;
                        textSpr.y = point.y + head.width;
                    }
                    textSpr.rotation = 90;
                }
                else {
                    if (posH >= 1) {
                        if (posW >= 2) {
                            textSpr.x = point.x - textSprWidth;
                            textSpr.y = point.y;
                        }
                        else if (posW >= 1) {
                            textSpr.x = point.x + (head.width - textSprWidth) / 2;
                            textSpr.y = point.y - textSpr.height;
                        }
                        else {
                            textSpr.x = point.x + head.width;
                            textSpr.y = point.y;
                        }
                    }
                    else {
                        if (posW >= 2) {
                            textSpr.x = point.x - textSprWidth;
                            textSpr.y = point.y;
                        }
                        else if (posW >= 1) {
                            textSpr.x = point.x + (head.width - textSprWidth) / 2;
                            textSpr.y = point.y + head.height;
                        }
                        else {
                            textSpr.x = point.x + head.width;
                            textSpr.y = point.y;
                        }
                    }
                }
                textSpr.scaleX = textSpr.scaleY = 0;
                cgcp.App.appRoot.addChild(textSpr);
                egret.Tween.get(textSpr).to({ scaleX: 1, scaleY: 1 }, 300, egret.Ease.backOut);
                egret.setTimeout(function () {
                    cgcp.App.appRoot.removeChild(textSpr);
                }, ChatManager, 3000);
            };
            ChatManager.showBq = function (data) {
                var sender = data.sender;
                var imageId = data.imageId;
                var head = cgcp.RoleHeadCache.getHead(sender);
                if (head == null || head.parent == null)
                    return;
                var point = head.localToGlobal(0, 0);
                var image = cgcp.AssetManager.chatSwf().createImage("img_chat_bq_" + imageId);
                image.anchorOffsetX = image.width / 2;
                image.anchorOffsetY = image.height / 2;
                if (cgcp.App.isLandscape) {
                    image.x = point.x - (head.height / 2);
                    image.y = point.y + (head.width / 2);
                    image.rotation = 90;
                }
                else {
                    image.x = point.x + (head.width / 2);
                    image.y = point.y + (head.height / 2);
                }
                image.scaleX = image.scaleY = 0;
                cgcp.App.appRoot.addChild(image);
                egret.Tween.get(image).to({ scaleX: 1, scaleY: 1 }, 300, egret.Ease.backOut);
                egret.setTimeout(function () {
                    cgcp.App.appRoot.removeChild(image);
                }, ChatManager, 3000);
            };
            return ChatManager;
        }());
        cgcp.ChatManager = ChatManager;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var AccountData = (function () {
            function AccountData() {
            }
            AccountData.getSessionToken = function () {
                return cgcp.CacheData.getRAMData("sessionToken");
            };
            AccountData.putSessionToken = function (token) {
                cgcp.CacheData.saveRAMData("sessionToken", token);
            };
            AccountData.getUser = function () {
                return cgcp.CacheData.getRAMData("user");
            };
            AccountData.putUser = function (user) {
                cgcp.CacheData.saveRAMData("user", user);
            };
            AccountData.getUrlData = function () {
                if (cgcp.AppConfig.urlData == null) {
                    return {};
                }
                return cgcp.AppConfig.urlData;
            };
            return AccountData;
        }());
        cgcp.AccountData = AccountData;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var ActivityBase = (function (_super) {
            __extends(ActivityBase, _super);
            function ActivityBase() {
                return _super.call(this) || this;
            }
            return ActivityBase;
        }(egret.DisplayObjectContainer));
        cgcp.ActivityBase = ActivityBase;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        /**
         * 小游戏配置
         */
        var ExtGameConfig = (function () {
            function ExtGameConfig() {
                this.resVer = "";
            }
            return ExtGameConfig;
        }());
        cgcp.ExtGameConfig = ExtGameConfig;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var ExtGameConfigData = (function () {
            function ExtGameConfigData() {
            }
            ExtGameConfigData.putGameList = function (list) {
                cgcp.CacheData.saveRAMData("extGameconfigData", list);
            };
            ExtGameConfigData.getGameList = function () {
                return cgcp.CacheData.getRAMData("extGameconfigData");
            };
            /**
             * 获取单个游戏配置
             */
            ExtGameConfigData.getGameConfig = function (id) {
                var list = ExtGameConfigData.getGameList();
                var len = list.length;
                for (var i = 0; i < len; i++) {
                    if (list[i].id == id) {
                        return list[i];
                    }
                }
                return null;
            };
            return ExtGameConfigData;
        }());
        cgcp.ExtGameConfigData = ExtGameConfigData;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var Role = (function () {
            function Role() {
            }
            return Role;
        }());
        cgcp.Role = Role;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var RoleData = (function () {
            function RoleData() {
            }
            RoleData.getRole = function () {
                return cgcp.CacheData.getRAMData("role");
            };
            RoleData.putRole = function (role) {
                if (role.payCount == null)
                    role.payCount = 0;
                if (role.score1 == null)
                    role.score1 = 0;
                if (role.score2 == null)
                    role.score2 = 0;
                if (role.turnover == null)
                    role.turnover = 0;
                cgcp.CacheData.saveRAMData("role", role);
            };
            RoleData.getRoleName = function (uid) {
                return cgcp.CacheData.getRAMData("roleNamesCache:" + uid);
            };
            RoleData.putRoleName = function (uid, name) {
                cgcp.CacheData.saveRAMData("roleNamesCache:" + uid, name);
            };
            return RoleData;
        }());
        cgcp.RoleData = RoleData;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        /**
         * 玩家头像缓存，主要用户常用语位置定位
         */
        var RoleHeadCache = (function () {
            function RoleHeadCache() {
            }
            /**
             * 清理缓存
             */
            RoleHeadCache.clear = function () {
                RoleHeadCache.heads = {};
            };
            /**
             * 缓存头像
             */
            RoleHeadCache.addHead = function (uid, head) {
                if (!RoleHeadCache.cache)
                    return;
                if (RoleHeadCache.heads[uid] == null) {
                    RoleHeadCache.heads[uid] = head;
                }
            };
            /**
             * 更换头像所属uid
             */
            RoleHeadCache.replaceHead = function (oldUid, newUid) {
                if (!RoleHeadCache.cache)
                    return;
                var head = RoleHeadCache.getHead(oldUid);
                if (head != null) {
                    delete RoleHeadCache.heads[oldUid];
                    RoleHeadCache.addHead(newUid, head);
                }
            };
            /**
             * 获取头像
             */
            RoleHeadCache.getHead = function (uid) {
                return RoleHeadCache.heads[uid];
            };
            return RoleHeadCache;
        }());
        RoleHeadCache.cache = false;
        RoleHeadCache.heads = {};
        cgcp.RoleHeadCache = RoleHeadCache;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var Room = (function () {
            function Room() {
            }
            return Room;
        }());
        cgcp.Room = Room;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var RoomData = (function (_super) {
            __extends(RoomData, _super);
            function RoomData() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            RoomData.getCurrentRoom = function () {
                return cgcp.CacheData.getRAMData("currentRoom");
            };
            RoomData.putCurrentRoom = function (room) {
                cgcp.CacheData.saveRAMData("currentRoom", room);
                if (room == null) {
                    RoomData.saveRoles(null);
                    cgcp.CacheData.removeRAMData("currentRoomOffline");
                }
            };
            /**
             * 获取当前房间的离线列表
             */
            RoomData.getCurrentRoomOffline = function () {
                var offLineList = cgcp.CacheData.getRAMData("currentRoomOffline");
                if (offLineList == null) {
                    return {};
                }
                return offLineList;
            };
            /**
             * 将玩家标记为离线
             */
            RoomData.saveCurrentRoomOffline = function (uid) {
                var offLineList = cgcp.CacheData.getRAMData("currentRoomOffline");
                if (offLineList == null) {
                    offLineList = {};
                }
                offLineList[uid] = 1;
                cgcp.CacheData.saveRAMData("currentRoomOffline", offLineList);
            };
            /**
             * 将玩家的离线标记移除
             */
            RoomData.delCurrentRoomOffline = function (uid) {
                var offLineList = cgcp.CacheData.getRAMData("currentRoomOffline");
                if (offLineList == null) {
                    return;
                }
                delete offLineList[uid];
                cgcp.CacheData.saveRAMData("currentRoomOffline", offLineList);
            };
            Object.defineProperty(RoomData, "offLineCount", {
                /**
                 * 离线玩家数量
                 */
                get: function () {
                    var offLineList = cgcp.CacheData.getRAMData("currentRoomOffline");
                    if (offLineList == null) {
                        return 0;
                    }
                    var count = 0;
                    for (var uid in offLineList) {
                        count++;
                    }
                    return count;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 获取玩家在房间中的哪个位置
             */
            RoomData.getPlayerIndex = function (uid) {
                var players = RoomData.getCurrentRoom().players;
                for (var k in players) {
                    if (uid == players[k]) {
                        return parseInt(k);
                    }
                }
                return -1;
            };
            /**
             * 保存当前房间中的玩家数据
             */
            RoomData.saveRoles = function (roles) {
                cgcp.ExtGameHelper.saveRAMData("currentRoom_roles", roles);
            };
            /**
             * 获取当前房间中的所有角色
             */
            RoomData.getRoles = function () {
                return cgcp.ExtGameHelper.getRAMData("currentRoom_roles");
            };
            /**
             * 保存一个玩家信息到房间角色列表
             */
            RoomData.saveRole = function (role) {
                var roles = RoomData.getRoles();
                if (roles == null) {
                    roles = {};
                }
                roles[role.uid] = role;
                RoomData.saveRoles(roles);
            };
            /**
             * 获取当前房间的某个角色
             */
            RoomData.getRole = function (uid) {
                var roles = RoomData.getRoles();
                if (roles == null) {
                    return null;
                }
                return roles[uid];
            };
            return RoomData;
        }(cgcp.CacheData));
        cgcp.RoomData = RoomData;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        /**
         * 本地设置数据
         */
        var SettingData = (function () {
            function SettingData() {
            }
            /**
             * 背景音乐大小
             */
            SettingData.bgSoundVolume = function () {
                var val = egret.localStorage.getItem("bgSoundVolume");
                if (val == null) {
                    return 0.1;
                }
                return parseFloat(val);
            };
            /**
             * 背景音乐大小
             */
            SettingData.setBgSoundVolume = function (volume) {
                egret.localStorage.setItem("bgSoundVolume", volume.toString());
            };
            /**
             * 音效大小
             */
            SettingData.soundVolume = function () {
                var val = egret.localStorage.getItem("soundVolume");
                if (val == null) {
                    return 1;
                }
                return parseFloat(val);
            };
            /**
             * 音效大小
             */
            SettingData.setSoundVolume = function (volume) {
                egret.localStorage.setItem("soundVolume", volume.toString());
            };
            return SettingData;
        }());
        cgcp.SettingData = SettingData;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var User = (function () {
            function User() {
            }
            return User;
        }());
        cgcp.User = User;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        /**
         * 游戏主体
         */
        var ExtGame = (function (_super) {
            __extends(ExtGame, _super);
            function ExtGame() {
                return _super.call(this) || this;
            }
            /** 初始化房间 */
            ExtGame.prototype.onInit = function (room, roles) {
                cgcp.Log.log("ExtGame ---> onInit");
            };
            /** 有玩家加入房间 */
            ExtGame.prototype.onJoinRoom = function (data) {
                cgcp.Log.log("ExtGame ---> onJoinRoom");
            };
            /** 玩家返回游戏 */
            ExtGame.prototype.onReturnGame = function (data) {
                cgcp.Log.log("ExtGame ---> onReturnGame");
            };
            /** 有玩家离开房间 */
            ExtGame.prototype.onLeaveRoom = function (data) {
                cgcp.Log.log("ExtGame ---> onLeaveRoom");
            };
            /** 玩家离线 */
            ExtGame.prototype.onLeaveGame = function (data) {
                cgcp.Log.log("ExtGame ---> onLeaveGame");
            };
            /** 解散房间 */
            ExtGame.prototype.onDisbandRoom = function (data) {
                cgcp.Log.log("ExtGame ---> onDisbandRoom");
            };
            /** 收到游戏消息 */
            ExtGame.prototype.onGameMessage = function (data) {
                cgcp.Log.log("ExtGame ---> onGameMessage");
            };
            /** 当界面大小变化 触发重新布局的操作 */
            ExtGame.prototype.layout = function () {
                cgcp.Log.log("ExtGame ---> layout");
            };
            /** 销毁游戏 */
            ExtGame.prototype.dispose = function () {
                cgcp.Log.log("ExtGame ---> dispose");
            };
            return ExtGame;
        }(egret.DisplayObjectContainer));
        cgcp.ExtGame = ExtGame;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        /**
         * 游戏创建面板，需要每个游戏 自己来定义
         */
        var ExtGameCreatePanel = (function (_super) {
            __extends(ExtGameCreatePanel, _super);
            function ExtGameCreatePanel() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.cardType = -1;
                _this.aa = false;
                return _this;
            }
            /**
             * 一般在点击创建按钮时调用
             */
            ExtGameCreatePanel.prototype.create = function () {
                this.dispatchEventWith(ExtGameCreatePanel.onCreate);
            };
            /**
             * 返回创建选项的数据，该方法除了需要返回游戏自己的数据，还需要返回一个固定的cardType项，用于表示消耗多少房卡，cardType会在服务器配置对应的房卡消耗数量
             */
            ExtGameCreatePanel.prototype.createData = function () {
                return {};
            };
            /**
             * 销毁资源，该界面会被缓存，所以dispose方法 自己无须调用，平台会统一调用，只需要在该方法中实现资源销毁逻辑
             */
            ExtGameCreatePanel.prototype.dispose = function () {
            };
            return ExtGameCreatePanel;
        }(egret.DisplayObjectContainer));
        /**
         * 创建事件
         */
        ExtGameCreatePanel.onCreate = "ExtGameCreatePanel.onCreate";
        cgcp.ExtGameCreatePanel = ExtGameCreatePanel;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var ExtGameHelper = (function () {
            function ExtGameHelper() {
            }
            ExtGameHelper.getRAMData = function (key) {
                return ExtGameHelper._ramDatas[key];
            };
            ExtGameHelper.saveRAMData = function (key, data) {
                ExtGameHelper._ramDatas[key] = data;
            };
            ExtGameHelper.removeRAMData = function (key) {
                delete ExtGameHelper._ramDatas[key];
            };
            ExtGameHelper.clearRAMData = function () {
                ExtGameHelper._ramDatas = {};
            };
            /**
             * 获取当前游戏的配置
             */
            ExtGameHelper.currentGameConfig = function () {
                if (ExtGameHelper.extGamePanel == null)
                    return;
                return ExtGameHelper.extGamePanel.gameConfig;
            };
            /**
             * 设置背景颜色
             */
            ExtGameHelper.setBackGroundColor = function (color) {
                if (ExtGameHelper.extGamePanel == null)
                    return;
                ExtGameHelper.extGamePanel.backgroundColor = color;
                ExtGameHelper.extGamePanel.background.graphics.clear();
                ExtGameHelper.extGamePanel.background.graphics.beginFill(color);
                ExtGameHelper.extGamePanel.background.graphics.drawRect(0, 0, cgcp.App.stageWidth, cgcp.App.stageHeight);
                ExtGameHelper.extGamePanel.background.graphics.endFill();
            };
            /**
             * 返回微信
             */
            ExtGameHelper.backToWx = function () {
                cgcp.WxUtils.closeWindow();
            };
            /**
             * 显示分享提示
             */
            ExtGameHelper.showShareTip = function () {
                cgcp.ShareTip.instance.show();
            };
            /**
             * 判断玩家是否离线
             */
            ExtGameHelper.isOffLine = function (uid) {
                var list = cgcp.RoomData.getCurrentRoomOffline();
                if (list[uid] == null) {
                    return false;
                }
                return true;
            };
            /**
             * 退出游戏界面
             */
            ExtGameHelper.exitExtGamePanel = function () {
                lzm.Alert.closeAllAlert();
                cgcp.RoomData.putCurrentRoom(null);
                cgcp.WaitingTextTip.hideWait();
                ExtGameHelper.clearRAMData();
                ExtGameHelper.extGamePanel.gotoPanel(new cgcp.MainPanel());
                ExtGameHelper.extGamePanel = null;
            };
            /**
             * 离开房间
             */
            ExtGameHelper.leaveRoom = function () {
                cgcp.TipPanel.create("您确定要离开房间吗？", ExtGameHelper, ExtGameHelper._leaveRoom);
            };
            /**
             * 解散房间
             */
            ExtGameHelper.disbandRoom = function () {
                cgcp.TipPanel.create("您确定要离开房间吗？", ExtGameHelper, ExtGameHelper._leaveRoom);
            };
            /**
             * 离开房间确认按钮之后调用
             */
            ExtGameHelper._leaveRoom = function () {
                var room = cgcp.RoomData.getCurrentRoom();
                if (room.data.isStart) {
                    cgcp.RoomApi.voteEndGame(1);
                }
                else {
                    if (room.owner == cgcp.RoleData.getRole().uid) {
                        cgcp.RoomApi.disbandRoom(null);
                    }
                    else {
                        cgcp.RoomApi.leaveRoom(null);
                    }
                    ExtGameHelper.exitExtGamePanel();
                }
            };
            /**
             * 向游戏发送数据
             */
            ExtGameHelper.sendGameMessage = function (data) {
                cgcp.RoomApi.gameMessage(data);
            };
            /**
             * 踢人
             */
            ExtGameHelper.kick = function (targetUid) {
                cgcp.RoomApi.kick(targetUid);
            };
            /**
             * 房间是否被标记为游戏开始
             */
            ExtGameHelper.gameIsStart = function () {
                var room = cgcp.RoomData.getCurrentRoom();
                if (room.data["isStart"]) {
                    return true;
                }
                return false;
            };
            /**
             * 显示设置面板
             */
            ExtGameHelper.showSetting = function () {
                if (cgcp.App.isLandscape) {
                    lzm.Alert.alertLandscape(new cgcp.SettingPanel());
                }
                else {
                    lzm.Alert.alert(new cgcp.SettingPanel());
                }
            };
            return ExtGameHelper;
        }());
        ExtGameHelper._ramDatas = {};
        cgcp.ExtGameHelper = ExtGameHelper;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        /**
         * 游戏战绩面板，每个游戏 自己定义
         */
        var ExtGameScorePanel = (function (_super) {
            __extends(ExtGameScorePanel, _super);
            function ExtGameScorePanel() {
                return _super.call(this) || this;
            }
            /**
             * 初始化
             */
            ExtGameScorePanel.prototype.init = function (data) {
            };
            /**
             * 销毁资源，该界面会被缓存，所以dispose方法 自己无须调用，平台会统一调用，只需要在该方法中实现资源销毁逻辑
             */
            ExtGameScorePanel.prototype.dispose = function () {
            };
            return ExtGameScorePanel;
        }(egret.DisplayObjectContainer));
        cgcp.ExtGameScorePanel = ExtGameScorePanel;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var LoadingUI = (function (_super) {
            __extends(LoadingUI, _super);
            function LoadingUI() {
                var _this = _super.call(this) || this;
                _this.mainAsset = RES.getRes("loading_swf").createSprite("spr_loading");
                _this.addChild(_this.mainAsset);
                _this.textField = _this.mainAsset.getTextField("loadingText");
                return _this;
            }
            LoadingUI.prototype.setProgress = function (current) {
                this.textField.text = "Loading..." + current + "%";
            };
            return LoadingUI;
        }(egret.Sprite));
        cgcp.LoadingUI = LoadingUI;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var ActivityApi = (function () {
            function ActivityApi() {
            }
            /**
             * 领取关注奖励
             */
            ActivityApi.getFollowCard = function (callBack) {
                var pars = { "api": "activity", "c": "getFollowCard" };
                cgcp.BaseApi.requestLogic(pars, function (data) {
                    cgcp.RoleData.getRole().card = data.card;
                    if (callBack != null)
                        callBack(data);
                }, null);
            };
            return ActivityApi;
        }());
        cgcp.ActivityApi = ActivityApi;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        /**
         * 在代理处自处购卡
         */
        var BuyCardFromProxy = (function (_super) {
            __extends(BuyCardFromProxy, _super);
            function BuyCardFromProxy() {
                var _this = _super.call(this) || this;
                _this.proxy_id = egret.getOption("proxy_id");
                _this.card_number = 0;
                var thisObj = _this;
                cgcp.RoleApi.getRoleInfo(_this.proxy_id, function (data) {
                    thisObj.roleProxy = data.role;
                    thisObj.initInfos(data.role);
                });
                return _this;
            }
            BuyCardFromProxy.prototype.initInfos = function (roleProxy) {
                this.headImag = new cgcp.RoleHeadImage(roleProxy);
                this.headImag.width = this.headImag.height = 136;
                this.headImag.x = 33;
                this.headImag.y = 153;
                this.addChild(this.headImag);
                this.idText.text = roleProxy.uid;
                this.nameText.text = roleProxy.name;
                this.cardText.text = "库存：" + roleProxy.card;
                // this.shareCardText.type = egret.TextFieldType.INPUT;
                this.shareCardText.addEventListener(egret.Event.FOCUS_OUT, this.onShareCardTextFocusOut, this);
                this.card_number = 30;
                this.shareCardText.text = "30";
            };
            BuyCardFromProxy.prototype.on_jianBtn = function (e) {
                this.card_number -= 10;
                if (this.card_number < 10)
                    this.card_number = 10;
                this.shareCardText.text = this.card_number.toString();
            };
            BuyCardFromProxy.prototype.on_jiaBtn = function (e) {
                this.card_number += 10;
                this.shareCardText.text = this.card_number.toString();
            };
            BuyCardFromProxy.prototype.onShareCardTextFocusOut = function (e) {
                this.card_number = parseInt(this.shareCardText.text);
                if (this.card_number < 1 || isNaN(this.card_number))
                    this.card_number = 1;
                this.shareCardText.text = this.card_number.toString();
            };
            BuyCardFromProxy.prototype.on_buyBtn = function (e) {
                cgcp.NetworkLoading.show(true);
                var thisObj = this;
                var par = {};
                par["openid"] = cgcp.AccountData.getUser().account;
                par["proxy_id"] = this.proxy_id;
                par["card_number"] = this.card_number;
                lzm.HttpClient.send(cgcp.AppConfig.pay_by_proxy_path, par, function (data) {
                    cgcp.NetworkLoading.hide();
                    var jsonObj = JSON.parse(data);
                    if (jsonObj['return_code'] != "SUCCESS") {
                        var tipTexts = {
                            "error1": "参数非法",
                            "error2": "参数非法",
                            "error3": "库存不足，下单失败",
                            "error4": "参数非法",
                            "error5": "自己不能购买自己的卡",
                            "error6": "代理之间不能相互购卡"
                        };
                        cgcp.ApiState.showText(tipTexts[jsonObj['return_code']]);
                    }
                    else {
                        jsonObj["success"] = function (res) {
                            cgcp.RoleApi.syncCard(function (syncCardData) {
                                cgcp.ApiState.showText("购买成功");
                                thisObj.roleProxy.card -= thisObj.card_number;
                                thisObj.cardText.text = thisObj.roleProxy.card.toString();
                            });
                        };
                        wx.chooseWXPay(jsonObj);
                    }
                }, function (data) {
                    cgcp.NetworkLoading.hide();
                    cgcp.ApiState.showText("连接超时");
                });
            };
            BuyCardFromProxy.prototype.dispose = function () {
                _super.prototype.dispose.call(this);
                if (this.headImag != null)
                    this.headImag.dispose();
                this.shareCardText.removeEventListener(egret.Event.FOCUS_OUT, this.onShareCardTextFocusOut, this);
            };
            BuyCardFromProxy.prototype.mainAssetName = function () {
                return "spr_buy_card_from_proxy";
            };
            return BuyCardFromProxy;
        }(cgcp.BasePanel));
        cgcp.BuyCardFromProxy = BuyCardFromProxy;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        /**
         * 聊天面板
         */
        var ChatPanel = (function (_super) {
            __extends(ChatPanel, _super);
            function ChatPanel() {
                var _this = _super.call(this) || this;
                var thisObj = _this;
                egret.setTimeout(function () {
                    thisObj.createTexts();
                    thisObj.createBqs();
                }, _this, 10);
                return _this;
            }
            ChatPanel.prototype.createTexts = function () {
                this.texts = [];
                var scrollViewContent = new egret.DisplayObjectContainer();
                var scrollView = new egret.ScrollView();
                scrollView.setContent(scrollViewContent);
                scrollView.x = 321.6;
                scrollView.y = 89.6;
                scrollView.width = 300.5;
                scrollView.height = 414.1;
                this.addChild(scrollView);
                var config = RES.getRes("chatConfig")["texts"];
                var len = config.length;
                var spr;
                var h = 52;
                for (var i = 0; i < len; i++) {
                    spr = cgcp.AssetManager.chatSwf().createSprite("spr_text");
                    spr.y = i * h;
                    spr.name = i.toString();
                    spr.touchEnabled = true;
                    spr.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickText, this);
                    spr.getChildAt(1).text = config[i][0];
                    scrollViewContent.addChild(spr);
                    this.texts.push(spr);
                }
            };
            /**
             * 创建表情
             */
            ChatPanel.prototype.createBqs = function () {
                this.bqs = [];
                var index = 0;
                var bq = this.mainAsset.getImage("bq" + index);
                while (bq != null) {
                    bq.touchEnabled = true;
                    bq.name = index.toString();
                    bq.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickBq, this);
                    this.bqs.push(bq);
                    index++;
                    bq = this.mainAsset.getImage("bq" + index);
                }
            };
            ChatPanel.prototype.onClickText = function (e) {
                var target = e.currentTarget;
                cgcp.ChatApi.sendText(target.name);
                this.on_closeBtn(null);
            };
            ChatPanel.prototype.onClickBq = function (e) {
                var target = e.currentTarget;
                cgcp.ChatApi.sendImage(target.name);
                this.on_closeBtn(null);
            };
            ChatPanel.prototype.dispose = function () {
                _super.prototype.dispose.call(this);
                var len = this.texts.length;
                var spr;
                var bq;
                for (var i = 0; i < len; i++) {
                    spr = this.texts[i];
                    spr.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickText, this);
                }
                len = this.bqs.length;
                for (var i = 0; i < len; i++) {
                    bq = this.bqs[i];
                    bq.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickBq, this);
                }
            };
            ChatPanel.prototype.mainAssetName = function () {
                return "spr_chat_main";
            };
            ChatPanel.prototype.assetSwf = function () {
                return cgcp.AssetManager.chatSwf();
            };
            return ChatPanel;
        }(cgcp.BasePanel));
        cgcp.ChatPanel = ChatPanel;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var ProxyPanel = (function (_super) {
            __extends(ProxyPanel, _super);
            function ProxyPanel(mainPanel) {
                var _this = _super.call(this) || this;
                _this.mainPanel = mainPanel;
                return _this;
            }
            ProxyPanel.prototype.on_ckBtn = function (e) {
                cgcp.NetworkLoading.show(true);
                var thisObj = this;
                var par = {};
                par["openid"] = cgcp.AccountData.getUser().account;
                par["shop_id"] = "10";
                lzm.HttpClient.send(cgcp.AppConfig.pay_path, par, function (data) {
                    cgcp.NetworkLoading.hide();
                    var jsonObj = JSON.parse(data);
                    if (jsonObj['return_code'] != "SUCCESS") {
                        cgcp.ApiState.showText("下单失败");
                    }
                    else {
                        jsonObj["success"] = function (res) {
                            cgcp.RoleApi.syncCard(function (syncCardData) {
                                thisObj.mainPanel.fkText.text = cgcp.RoleData.getRole().card.toString();
                            });
                        };
                        wx.chooseWXPay(jsonObj);
                    }
                }, function (data) {
                    cgcp.NetworkLoading.hide();
                    cgcp.ApiState.showText("连接超时");
                });
            };
            ProxyPanel.prototype.mainAssetName = function () {
                return "spr_dailizhaomu";
            };
            return ProxyPanel;
        }(cgcp.BasePanel));
        cgcp.ProxyPanel = ProxyPanel;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        /**
         * 小游戏的容器
         */
        var ExtGamePanel = (function (_super) {
            __extends(ExtGamePanel, _super);
            function ExtGamePanel(gameConfig, room, roles, voteEndGames) {
                if (voteEndGames === void 0) { voteEndGames = null; }
                var _this = _super.call(this, true) || this;
                _this.backgroundColor = -1;
                _this.gameCreate = false; //游戏是否已经创建成功
                _this.gameConfig = gameConfig;
                _this.room = room;
                _this.roles = roles;
                _this.voteEndGames = voteEndGames;
                _this.background = new egret.Shape();
                _this.addChildAt(_this.background, 0);
                cgcp.ExtGameHelper.extGamePanel = _this;
                cgcp.App.isLandscape = _this.gameConfig.isLandscape;
                cgcp.SoundManager.setGameConfig(_this.gameConfig);
                cgcp.WxUtils.joinGame(_this.gameConfig);
                cgcp.RoleHeadCache.cache = true;
                var clazz = egret.getDefinitionByName(_this.gameConfig.mainClass);
                _this.game = new clazz();
                cgcp.BaseApi.registerCmd("joinRoom", _this.game.onJoinRoom, _this.game);
                cgcp.BaseApi.registerCmd("returnGame", _this.game.onReturnGame, _this.game);
                cgcp.BaseApi.registerCmd("leaveRoom", _this.game.onLeaveRoom, _this.game, true);
                cgcp.BaseApi.registerCmd("leaveGame", _this.game.onLeaveGame, _this.game);
                cgcp.BaseApi.registerCmd("disbandRoom", _this.game.onDisbandRoom, _this.game, true);
                cgcp.BaseApi.registerCmd("gameMessage", _this.game.onGameMessage, _this.game);
                cgcp.BaseApi.registerCmd("voteEndGame", _this.onVoteEndGame, _this);
                cgcp.BaseApi.registerCmd("gameMessage", _this.onGameMessage, _this);
                _this.gameCreate = false;
                _this.checkGameCreateId = egret.setInterval(_this.checkGameCrate, _this, 3000);
                _this.addChild(_this.game);
                _this.scaleGame();
                _this.game.onInit(_this.room, _this.roles);
                _this.loadChat();
                cgcp.NetworkLoading.show();
                return _this;
            }
            ExtGamePanel.prototype.scaleGame = function () {
                if (this.gameConfig.isLandscape) {
                    this.game.anchorOffsetX = 1136 / 2;
                    this.game.anchorOffsetY = 640 / 2;
                    this.game.rotation = 90;
                }
                else {
                    this.game.anchorOffsetX = 640 / 2;
                    this.game.anchorOffsetY = 1136 / 2;
                }
                var sx = cgcp.App.stageWidth / 640;
                var sy = cgcp.App.stageHeight / 1136;
                if (sx > sy) {
                    this.game.scaleX = this.game.scaleY = sy;
                }
                else {
                    this.game.scaleX = this.game.scaleY = sx;
                }
                this.game.x = cgcp.App.stageWidth / 2;
                this.game.y = cgcp.App.stageHeight / 2;
            };
            ExtGamePanel.prototype.layout = function () {
                if (this.game != null) {
                    this.game.rotation = 0;
                    this.scaleGame();
                }
                if (this.backgroundColor != -1) {
                    cgcp.ExtGameHelper.setBackGroundColor(this.backgroundColor);
                }
            };
            ExtGamePanel.prototype.addToStage = function (e) {
                _super.prototype.addToStage.call(this, e);
                if (this.voteEndGames != null && this.voteEndGames.length > 0) {
                    this.voteEndGamePanel = new cgcp.VoteEndGamePanel();
                    this.voteEndGamePanel.showByDatas(this.voteEndGames);
                    lzm.Alert.alert(this.voteEndGamePanel);
                }
                if (cgcp.RoomData.offLineCount > 0) {
                    cgcp.WaitingTextTip.showWait("等待其他玩家重新连接...");
                }
            };
            /**
             * 收到投票结算游戏的消息，弹出投票面板
             */
            ExtGamePanel.prototype.onVoteEndGame = function (data) {
                if (data.result != 1 || data.allChoose) {
                    if (this.voteEndGamePanel != null)
                        this.voteEndGamePanel.on_closeBtn(null);
                    this.voteEndGamePanel = null;
                    return;
                }
                if (this.voteEndGamePanel == null) {
                    this.voteEndGamePanel = new cgcp.VoteEndGamePanel();
                    var role = cgcp.RoomData.getRole(data.sender);
                    this.voteEndGamePanel.setLeaveName(role.name);
                }
                if (this.voteEndGamePanel.parent == null) {
                    lzm.Alert.alert(this.voteEndGamePanel);
                }
                if (data.sender == cgcp.RoleData.getRole().uid) {
                    this.voteEndGamePanel.setBtnState();
                }
                this.voteEndGamePanel.items[data.sender].setState(1);
            };
            /**
             * 收到游戏消息
             */
            ExtGamePanel.prototype.onGameMessage = function (data) {
                this.gameCreate = true;
                cgcp.BaseApi.removeCmd("gameMessage", this.onGameMessage, this);
                egret.clearInterval(this.checkGameCreateId);
                cgcp.NetworkLoading.hide();
                cgcp.TipWarning.show();
            };
            /**
             * 检测游戏是否创建成功
             */
            ExtGamePanel.prototype.checkGameCrate = function () {
                cgcp.GameApi.checkGameCreate();
            };
            /**
             * 加载聊天相关资源
             */
            ExtGamePanel.prototype.loadChat = function () {
                if (!RES.isGroupLoaded("chat")) {
                    cgcp.NetworkLoading.show(true);
                    cgcp.AssetManager.loadGroup("chat", this.loadChatSwfCallBack, this);
                }
            };
            ExtGamePanel.prototype.loadChatSwfCallBack = function (data) {
                var callBackType = data[0];
                if (callBackType == "onResourceLoadComplete") {
                    cgcp.NetworkLoading.hide();
                }
            };
            ExtGamePanel.prototype.dispose = function () {
                if (this.game != null) {
                    cgcp.BaseApi.removeCmd("joinRoom", this.game.onJoinRoom, this.game);
                    cgcp.BaseApi.removeCmd("returnGame", this.game.onReturnGame, this.game);
                    cgcp.BaseApi.removeCmd("leaveRoom", this.game.onLeaveRoom, this.game);
                    cgcp.BaseApi.removeCmd("leaveGame", this.game.onLeaveGame, this.game);
                    cgcp.BaseApi.removeCmd("disbandRoom", this.game.onDisbandRoom, this.game);
                    cgcp.BaseApi.removeCmd("gameMessage", this.game.onGameMessage, this.game);
                    cgcp.BaseApi.removeCmd("voteEndGame", this.onVoteEndGame, this);
                    this.game.dispose();
                }
                cgcp.ExtGameHelper.extGamePanel = null;
                cgcp.App.isLandscape = false;
                cgcp.RoleHeadCache.cache = false;
                cgcp.RoleHeadCache.clear();
                _super.prototype.dispose.call(this);
            };
            return ExtGamePanel;
        }(cgcp.BasePanel));
        cgcp.ExtGamePanel = ExtGamePanel;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        /**
         * 加入游戏界面
         */
        var JoinGamePanel = (function () {
            function JoinGamePanel(mainPanel, mainAsset) {
                this.mainPanel = mainPanel;
                this.mainAsset = mainAsset;
                cgcp.InterfaceVariablesUtil.initVariables(this, this.mainAsset);
                this.gameNameText = BmTextUtil.replaceTextfield(this.gameNameText, RES.getRes("game_name"));
                this.closeBtn.visible = false;
            }
            JoinGamePanel.prototype.setGameConfig = function (gameConfig) {
                this.gameConf = gameConfig;
                this.gameNameText.text = gameConfig.id;
                this.gameNameText.visible = false;
            };
            JoinGamePanel.prototype.on_createRoomBtn = function (e) {
                if (this.createGamePanel != null) {
                    this.createGamePanel.dispose();
                }
                var clazz = egret.getDefinitionByName(this.gameConf.createClass);
                this.createGamePanel = new clazz();
                this.createGamePanel.addEventListener(cgcp.ExtGameCreatePanel.onCreate, this.onCreatePanelCreate, this);
                lzm.Alert.alert(this.createGamePanel);
            };
            JoinGamePanel.prototype.on_joinRoomBtn = function (e) {
                this.closeBtn.visible = false;
                this.mainPanel.roomNumberInputPanel.setGameConfig(this.gameConf);
                var thisObj = this;
                var display = this.mainPanel.mainContent;
                egret.Tween.get(display).to({ x: -1280 }, 300, egret.Ease.backIn).call(function () {
                    thisObj.mainPanel.roomNumberInputPanel.closeBtn.visible = true;
                });
            };
            JoinGamePanel.prototype.on_zhanjiBtn = function (e) {
                if (this.scorePanel != null) {
                    this.scorePanel.dispose();
                }
                var clazz = egret.getDefinitionByName(this.gameConf.playLogClass);
                if (clazz == null) {
                    cgcp.ApiState.showText("该游戏战绩功能未开放");
                    return;
                }
                var thisObj = this;
                cgcp.RoleApi.getZhanji(this.gameConf.id, function (data) {
                    thisObj.scorePanel = new clazz();
                    thisObj.scorePanel.init(data);
                    lzm.Alert.alert(thisObj.scorePanel);
                });
            };
            JoinGamePanel.prototype.on_closeBtn = function (e) {
                this.closeBtn.visible = false;
                var thisObj = this;
                var display = this.mainPanel.mainContent;
                egret.Tween.get(display).to({ x: 0 }, 300, egret.Ease.backIn).call(function () {
                    thisObj.mainPanel.roleHeadSpr.visible = true;
                });
            };
            /**
             * 收到游戏面板的创建游戏事件
             */
            JoinGamePanel.prototype.onCreatePanelCreate = function (e) {
                var thisObj = this;
                var createData = {};
                createData['cardType'] = this.createGamePanel.cardType;
                createData['aa'] = this.createGamePanel.aa;
                var tmpData = this.createGamePanel.createData();
                for (var k in tmpData) {
                    createData[k] = tmpData[k];
                }
                cgcp.RoomApi.createRoom(this.gameConf.id, createData, function (data) {
                    lzm.Alert.closeAllAlert();
                    var roles = {};
                    roles[cgcp.RoleData.getRole().uid] = cgcp.RoleData.getRole();
                    cgcp.BasePanel.currentPanel.gotoPanel(new cgcp.ExtGamePanel(thisObj.gameConf, data.room, roles));
                }, function (data) {
                    if (data.state == -8) {
                        lzm.Alert.alert(new cgcp.ProxyPanel(thisObj.mainPanel));
                        cgcp.ApiState.showText("房卡不足");
                    }
                });
            };
            JoinGamePanel.prototype.dispose = function () {
                cgcp.InterfaceVariablesUtil.disposeVariables(this);
                if (this.createGamePanel != null) {
                    this.createGamePanel.removeEventListener(cgcp.ExtGameCreatePanel.onCreate, this.onCreatePanelCreate, this);
                    this.createGamePanel.dispose();
                }
                if (this.scorePanel != null) {
                    this.scorePanel.dispose();
                }
            };
            return JoinGamePanel;
        }());
        cgcp.JoinGamePanel = JoinGamePanel;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var RoomNumberInputPanel = (function () {
            function RoomNumberInputPanel(mainPanel, mainAsset) {
                this.numTextNames = ["n21", "n22", "n23", "n24", "n25", "n26"];
                this.numBtnNames = ["n0", "n1", "n2", "n3", "n4", "n5", "n6", "n7", "n8", "n9"];
                this.numBtnVals = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
                this.roomNum = [-1, -1, -1, -1, -1, -1];
                this.mainPanel = mainPanel;
                this.mainAsset = mainAsset;
                cgcp.InterfaceVariablesUtil.initVariables(this, this.mainAsset);
                this.closeBtn.visible = false;
                this['joinBtn'].visible = false;
                this.initNumBtns();
            }
            RoomNumberInputPanel.prototype.setGameConfig = function (gameConfig) {
                this.gameConf = gameConfig;
            };
            RoomNumberInputPanel.prototype.initNumBtns = function () {
                this.numTexts = [];
                for (var k in this.numTextNames) {
                    this.numTexts.push(this.mainAsset.getTextField(this.numTextNames[k]));
                    this.numTexts[k].text = "";
                }
                this.numBtns = [];
                for (var k in this.numBtnNames) {
                    this.numBtns.push(this.mainAsset.getButton(this.numBtnNames[k]));
                    this.numBtns[k].addEventListener(starlingswf.SwfButton.onClick, this.onNumBtn, this);
                }
            };
            RoomNumberInputPanel.prototype.on_delBtn = function (e) {
                var len = this.roomNum.length;
                for (var i = len - 1; i >= 0; i--) {
                    if (this.roomNum[i] != -1) {
                        this.numTexts[i].text = "";
                        this.roomNum[i] = -1;
                        break;
                    }
                }
            };
            RoomNumberInputPanel.prototype.on_resetBtn = function (e) {
                var len = this.roomNum.length;
                for (var i = len - 1; i >= 0; i--) {
                    this.numTexts[i].text = "";
                    this.roomNum[i] = -1;
                }
            };
            RoomNumberInputPanel.prototype.on_joinBtn = function (e) {
                var thisObj = this;
                cgcp.RoomApi.joinRoom(this.getRoomNum(), function (data) {
                    cgcp.BasePanel.currentPanel.gotoPanel(new cgcp.ExtGamePanel(thisObj.gameConf, data.room, data.roles));
                });
            };
            RoomNumberInputPanel.prototype.onNumBtn = function (e) {
                var obj = e.currentTarget;
                var index = this.numBtnNames.indexOf(obj.name);
                var numCount = 0;
                for (var k in this.roomNum) {
                    if (this.roomNum[k] == -1) {
                        this.numTexts[k].text = this.numBtnVals[index].toString();
                        this.roomNum[k] = this.numBtnVals[index];
                        numCount++;
                        break;
                    }
                    numCount++;
                }
                if (numCount == 6) {
                    this.on_joinBtn(e);
                }
            };
            RoomNumberInputPanel.prototype.getRoomNum = function () {
                var len = this.roomNum.length;
                var num = "";
                for (var i = 0; i < len; i++) {
                    if (this.roomNum[i] != -1) {
                        num += this.roomNum[i];
                    }
                }
                return num;
            };
            RoomNumberInputPanel.prototype.on_closeBtn = function (e) {
                this.closeBtn.visible = false;
                var thisObj = this;
                var display = this.mainPanel.mainContent;
                egret.Tween.get(display).to({ x: -640 }, 300, egret.Ease.backIn).call(function () {
                    thisObj.mainPanel.joinGamePanel.closeBtn.visible = true;
                });
            };
            RoomNumberInputPanel.prototype.dispose = function () {
                for (var k in this.numBtns) {
                    this.numBtns[k].removeEventListener(starlingswf.SwfButton.onClick, this.onNumBtn, this);
                }
                cgcp.InterfaceVariablesUtil.disposeVariables(this);
            };
            return RoomNumberInputPanel;
        }());
        cgcp.RoomNumberInputPanel = RoomNumberInputPanel;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        /**
         * 登录界面
         */
        var LoginPanel = (function (_super) {
            __extends(LoginPanel, _super);
            function LoginPanel() {
                return _super.call(this) || this;
            }
            LoginPanel.prototype.init = function () {
                if (cgcp.AppConfig.need_wx) {
                    cgcp.NetworkLoading.show(true);
                    this.mainAsset.visible = false;
                }
                this.accountInput.type = egret.TextFieldType.INPUT;
                var account = egret.localStorage.getItem("account");
                this.accountInput.text = account;
                if (cgcp.AppConfig.account != "") {
                    this.accountInput.text = cgcp.AppConfig.account;
                    this.on_loginBtn(null);
                }
            };
            LoginPanel.prototype.layout = function () {
                var inputBg = this["inputBg"];
                cgcp.LayoutUtil.layout_center_up(inputBg);
                cgcp.LayoutUtil.layout_center_up(this.accountInput);
                cgcp.LayoutUtil.layout_center_up(this.loginBtn);
            };
            LoginPanel.prototype.mainAssetName = function () {
                return "spr_login";
            };
            LoginPanel.prototype.on_loginBtn = function (e) {
                var account = this.accountInput.text;
                if (account == null || account == "") {
                    cgcp.ApiState.showText("账号不能为空");
                    return;
                }
                var thisObj = this;
                cgcp.UserApi.reg(account, function (data) {
                    egret.localStorage.setItem("account", account);
                    if (cgcp.RoleData.getRole() == null) {
                        cgcp.RoleApi.createRole(account, function (data) {
                            thisObj.startGame();
                        });
                    }
                    else {
                        thisObj.startGame();
                    }
                });
            };
            LoginPanel.prototype.startGame = function () {
                if (cgcp.AppConfig.need_wx) {
                    cgcp.NetworkLoading.hide();
                }
                cgcp.App.heart();
                this.gotoPanel(new cgcp.MainPanel());
            };
            return LoginPanel;
        }(cgcp.BasePanel));
        cgcp.LoginPanel = LoginPanel;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        /**
         * 主界面
         */
        var MainPanel = (function (_super) {
            __extends(MainPanel, _super);
            function MainPanel() {
                return _super.call(this, true) || this;
            }
            MainPanel.prototype.init = function () {
                var role = cgcp.RoleData.getRole();
                this.roleHeadSpr.getTextField("nameText").text = role.name;
                this.roleHeadSpr.getTextField("idText").width = 200;
                this.roleHeadSpr.getTextField("idText").text = "ID:" + role.uid;
                this.fkText.text = role.card.toString();
                this.gameListSpr = this.mainContent.getSprite("gameListSpr");
                this.joinGamePanel = new cgcp.JoinGamePanel(this, this.mainContent.getSprite("joinGameSpr"));
                this.roomNumberInputPanel = new cgcp.RoomNumberInputPanel(this, this.mainContent.getSprite("inputRoomNumberSpr"));
                this.scrollViewContent = new egret.DisplayObjectContainer();
                this.scrollView = new egret.ScrollView();
                this.scrollView.setContent(this.scrollViewContent);
                this.gameListSpr.addChild(this.scrollView);
                this.meBtn = this.endSpr.getButton("meBtn");
                this.meBtn.addEventListener(starlingswf.SwfButton.onClick, this.on_meBtn, this);
                this.mainPageBtn = this.endSpr.getButton("mainPageBtn");
                this.mainPageBtn.addEventListener(starlingswf.SwfButton.onClick, this.on_mainPageBtn, this);
                this.bbsBtn = this.endSpr.getButton("bbsBtn");
                this.bbsBtn.addEventListener(starlingswf.SwfButton.onClick, this.on_bbsBtn, this);
                this.addEventListener(egret.Event.ENTER_FRAME, this.onEntreFrame, this);
                this.createRoleHead();
                var thisObj = this;
                cgcp.GameApi.getGameList(function (data) {
                    thisObj.getFollowCard();
                    thisObj.createGameiIconBtns();
                    thisObj.returnGame();
                    thisObj.openBuyCardPanel();
                });
                cgcp.WxUtils.joinPlatform();
            };
            MainPanel.prototype.createGameiIconBtns = function () {
                var data = cgcp.ExtGameConfigData.getGameList();
                var len = data.length;
                var btn;
                var conf;
                var xs = [41, 333.95];
                var h = 158;
                var row = 0;
                var clo = 0;
                this.gameBtns = [];
                for (var i = 0; i < len; i++) {
                    conf = data[i];
                    btn = new cgcp.MainPanelGameBtn(this, conf, new starlingswf.SwfSprite());
                    btn.x = xs[clo];
                    btn.y = row * h;
                    clo++;
                    if (clo == 2) {
                        row++;
                        clo = 0;
                    }
                    this.gameBtns.push(btn);
                    this.scrollViewContent.addChild(btn);
                }
            };
            MainPanel.prototype.createRoleHead = function () {
                this.headImage = new cgcp.RoleHeadImage(cgcp.RoleData.getRole(), true);
                this.headImage.width = this.headImage.height = 84;
                this.headImage.x = this.headImage.y = 15;
                this.roleHeadSpr.addChild(this.headImage);
                var shape = new egret.Shape();
                shape.graphics.beginFill(0x000000);
                shape.graphics.drawCircle(0, 0, 42);
                shape.graphics.endFill();
                shape.x = shape.y = 57;
                this.headImage.mask = shape;
                this.addChild(shape);
            };
            MainPanel.prototype.onEntreFrame = function (e) {
                var role = cgcp.RoleData.getRole();
                this.fkText.text = role.card.toString();
            };
            /**
             * 点击设置按钮
             */
            MainPanel.prototype.on_settingBtn = function (e) {
                lzm.Alert.alert(new cgcp.SettingPanel());
            };
            /**
             * 点击设置按钮
             */
            MainPanel.prototype.on_meBtn = function (e) {
                cgcp.ManagerBase.show();
            };
            /**
             * 点击加房卡按钮
             */
            MainPanel.prototype.on_plusFkBtn = function (e) {
                lzm.Alert.alert(new cgcp.ProxyPanel(this));
            };
            /**
             * 点击客户按钮
             */
            MainPanel.prototype.on_bbsBtn = function (e) {
                if (cgcp.AppConfig.weichat_account_url != "") {
                    location.href = cgcp.AppConfig.weichat_account_url;
                }
            };
            MainPanel.prototype.mainAssetName = function () {
                return "spr_main";
            };
            MainPanel.prototype.layout = function () {
                this["bg"].width = cgcp.App.stageWidth;
                this["bg"].height = cgcp.App.stageHeight;
                cgcp.LayoutUtil.layout_down(this["endSpr"]);
                cgcp.LayoutUtil.layout_down(this["bg1"]);
                this.scrollView.x = 0;
                this.scrollView.y = 0;
                this.scrollView.width = 640;
                this.scrollView.height = cgcp.App.stageHeight - this.gameListSpr.y - this["endSpr"].height;
            };
            MainPanel.prototype.dispose = function () {
                _super.prototype.dispose.call(this);
                var len = this.gameBtns.length;
                for (var i = 0; i < len; i++) {
                    this.gameBtns[i].dispose();
                }
                this.headImage.dispose();
                this.joinGamePanel.dispose();
                this.roomNumberInputPanel.dispose();
                this.meBtn.removeEventListener(starlingswf.SwfButton.onClick, this.on_meBtn, this);
                this.mainPageBtn.removeEventListener(starlingswf.SwfButton.onClick, this.on_mainPageBtn, this);
                this.bbsBtn.removeEventListener(starlingswf.SwfButton.onClick, this.on_bbsBtn, this);
                this.removeEventListener(egret.Event.ENTER_FRAME, this.onEntreFrame, this);
            };
            /**
             * 登录之后 检测是否在游戏中。在游戏中的话 需要返回到游戏中去
             */
            MainPanel.prototype.returnGame = function () {
                var thisObj = this;
                cgcp.GameApi.returnGame(function (data) {
                    if (data.room == null) {
                        thisObj.joinGameByShare();
                    }
                    else {
                        MainPanel.isFirstJoinPlatform = false;
                        var room = data.room;
                        thisObj.returnGameData = data;
                        thisObj.returnGameConf = cgcp.ExtGameConfigData.getGameConfig(room.data.game_id);
                        new cgcp.GameAssetLoader(thisObj.returnGameConf, thisObj.onLoadGameComplete, thisObj).startLoad();
                    }
                });
            };
            MainPanel.prototype.onLoadGameComplete = function () {
                var room = this.returnGameData.room;
                var roles = this.returnGameData.roles;
                var voteEndGames = this.returnGameData.voteEndGames;
                cgcp.BasePanel.currentPanel.gotoPanel(new cgcp.ExtGamePanel(this.returnGameConf, room, roles, voteEndGames));
                cgcp.GameApi.loginGame(null);
            };
            MainPanel.prototype.joinGameByShare = function () {
                if (!MainPanel.isFirstJoinPlatform)
                    return;
                MainPanel.isFirstJoinPlatform = false;
                var urlData = cgcp.AccountData.getUrlData();
                if (urlData.state) {
                    MainPanel.shareGameId = urlData.state.game_id;
                    MainPanel.shareRoomId = urlData.state.room_id;
                    new cgcp.GameAssetLoader(cgcp.ExtGameConfigData.getGameConfig(MainPanel.shareGameId), this.onLoadGameComplete2, this).startLoad();
                }
            };
            MainPanel.prototype.onLoadGameComplete2 = function () {
                var thisObj = this;
                cgcp.RoomApi.joinRoom(MainPanel.shareRoomId, function (data) {
                    cgcp.BasePanel.currentPanel.gotoPanel(new cgcp.ExtGamePanel(cgcp.ExtGameConfigData.getGameConfig(MainPanel.shareGameId), data.room, data.roles));
                });
            };
            //-------- 运营活动相关 --------//
            /**
             * 点击活动按钮
             */
            MainPanel.prototype.on_mainPageBtn = function (e) {
                if (cgcp.AppConfig.activity_mainClass == null || cgcp.AppConfig.activity_mainClass == "") {
                    cgcp.ApiState.showText("暂时没有运营活动");
                    return;
                }
                if (!RES.isGroupLoaded("activity_res")) {
                    cgcp.NetworkLoading.show(true);
                    cgcp.AssetManager.loadConfig(cgcp.AppConfig.activity_resConfigUrl, cgcp.AppConfig.activity_resUrl, this.loadActivityResConfigComplete, this);
                }
                else {
                    this.showActivity();
                }
            };
            /**
             * 活动资源配置加载成功
             */
            MainPanel.prototype.loadActivityResConfigComplete = function (data) {
                cgcp.AssetManager.loadGroup("activity_res", this.loadActivityAssetComplete, this);
            };
            /**
             * 活动资源加载成功
             */
            MainPanel.prototype.loadActivityAssetComplete = function (data) {
                var callBackType = data[0];
                var e = data[1];
                if (callBackType == "onResourceLoadComplete") {
                    cgcp.NetworkLoading.hide();
                    this.showActivity();
                }
                else if (callBackType == "onResourceProgress") {
                    var val = parseInt(((e.itemsLoaded / e.itemsTotal) * 100).toString());
                    cgcp.NetworkLoading.setLoadinText(val + "%");
                }
            };
            /**
             * 显示活动面板
             */
            MainPanel.prototype.showActivity = function () {
                var clazz = egret.getDefinitionByName(cgcp.AppConfig.activity_mainClass);
                var activityPanel = new clazz();
                lzm.Alert.alert(activityPanel);
            };
            /**
             * 领取关注房卡奖励
             */
            MainPanel.prototype.getFollowCard = function () {
                if (egret.getOption("getFollowCard") == "1") {
                    cgcp.ActivityApi.getFollowCard(function (data) {
                        cgcp.ApiState.showText("领取成功");
                    });
                }
            };
            /**
             * 拉起购卡界面
             */
            MainPanel.prototype.openBuyCardPanel = function () {
                if (egret.getOption("buyCard") == "1") {
                    lzm.Alert.alert(new cgcp.BuyCardFromProxy());
                }
            };
            return MainPanel;
        }(cgcp.BasePanel));
        //------------------以下为通过分享的连接进入游戏的逻辑----------------//
        MainPanel.isFirstJoinPlatform = true;
        cgcp.MainPanel = MainPanel;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var MainPanelGameBtn = (function (_super) {
            __extends(MainPanelGameBtn, _super);
            function MainPanelGameBtn(mainPanel, gameConf, skin) {
                var _this = this;
                var image = new cgcp.NetImage(gameConf.icon);
                image.width = 260;
                image.height = 158;
                skin.addChild(image);
                _this = _super.call(this, skin) || this;
                _this.mainPanel = mainPanel;
                _this.gameConf = gameConf;
                _this.image = image;
                _this.addEventListener(starlingswf.SwfButton.onClick, _this.onClicnEvent, _this);
                return _this;
            }
            MainPanelGameBtn.prototype.onClicnEvent = function (e) {
                if (this.gameConf.close) {
                    cgcp.ApiState.showText("游戏暂未开放");
                    return;
                }
                new cgcp.GameAssetLoader(this.gameConf, this.onLoadGameComplete, this).startLoad();
            };
            MainPanelGameBtn.prototype.onLoadGameComplete = function () {
                this.mainPanel.joinGamePanel.setGameConfig(this.gameConf);
                this.mainPanel.roleHeadSpr.visible = false;
                var thisObj = this;
                var display = this.mainPanel.mainContent;
                egret.Tween.get(display).to({ x: -640 }, 300, egret.Ease.backIn).call(function () {
                    thisObj.mainPanel.joinGamePanel.closeBtn.visible = true;
                });
            };
            MainPanelGameBtn.prototype.dispose = function () {
                _super.prototype.dispose.call(this);
                this.removeEventListener(starlingswf.SwfButton.onClick, this.onClicnEvent, this);
                this.image.dispose();
            };
            return MainPanelGameBtn;
        }(starlingswf.SwfButton));
        cgcp.MainPanelGameBtn = MainPanelGameBtn;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var SettingPanel = (function (_super) {
            __extends(SettingPanel, _super);
            function SettingPanel() {
                var _this = _super.call(this) || this;
                _this.control1 = new cgcp.VolumeControl(_this.mainAsset.getSprite("volume1"), 1);
                _this.control2 = new cgcp.VolumeControl(_this.mainAsset.getSprite("volume2"), 2);
                return _this;
            }
            SettingPanel.prototype.mainAssetName = function () {
                return "spr_setting";
            };
            SettingPanel.prototype.dispose = function () {
                _super.prototype.dispose.call(this);
                this.control1.dispose();
                this.control2.dispose();
            };
            return SettingPanel;
        }(cgcp.BasePanel));
        cgcp.SettingPanel = SettingPanel;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var VolumeControl = (function () {
            function VolumeControl(mainAsset, type) {
                cgcp.InterfaceVariablesUtil.initVariables(this, mainAsset);
                this.type = type;
                this.tag.touchEnabled = true;
                if (this.type == 1) {
                    this.tag.x = (300 * cgcp.SettingData.soundVolume()) + 3;
                }
                else {
                    this.tag.x = (300 * cgcp.SettingData.bgSoundVolume()) + 3;
                }
                this.updateWidth();
                this.tag.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.mouseDown, this);
                this.tag.addEventListener(egret.TouchEvent.TOUCH_END, this.mouseUp, this);
                this.tag.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.mouseUp, this);
            }
            VolumeControl.prototype.mouseDown = function (e) {
                this.tag.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.mouseMove, this);
            };
            VolumeControl.prototype.mouseUp = function (e) {
                this.tag.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.mouseMove, this);
                var x = this.tag.x - 3;
                var val = x / 300;
                if (this.type == 1) {
                    cgcp.SettingData.setSoundVolume(val);
                    if (val <= 0)
                        starlingswf.SwfButton.defSound = null;
                    else
                        starlingswf.SwfButton.defSound = RES.getRes("ui_click");
                }
                else {
                    cgcp.SettingData.setBgSoundVolume(val);
                    if (cgcp.SoundManager.currentBgName) {
                        var channel = cgcp.SoundManager.currentGameSoundChannels[cgcp.SoundManager.currentBgName];
                        if (channel != null) {
                            channel.volume = val;
                        }
                    }
                }
            };
            VolumeControl.prototype.mouseMove = function (e) {
                var val = this.tag.parent.globalToLocal(e.stageX, e.stageY).x;
                this.tag.x = val < 3 ? 3 : val > 300 ? 300 : val;
                this.updateWidth();
            };
            VolumeControl.prototype.updateWidth = function () {
                this.val.width = this.tag.x - 3;
            };
            VolumeControl.prototype.dispose = function () {
                this.tag.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.mouseDown, this);
                this.tag.removeEventListener(egret.TouchEvent.TOUCH_END, this.mouseUp, this);
                this.tag.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.mouseUp, this);
            };
            return VolumeControl;
        }());
        cgcp.VolumeControl = VolumeControl;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        /**
         * 投票结束游戏
         */
        var VoteEndGamePanel = (function (_super) {
            __extends(VoteEndGamePanel, _super);
            function VoteEndGamePanel() {
                var _this = _super.call(this) || this;
                _this.items = {};
                var roles = cgcp.RoomData.getRoles();
                var role;
                var item;
                var startX = 89.05;
                var startY = 135;
                var h = 44;
                for (var k in roles) {
                    role = roles[k];
                    item = new cgcp.VoteResultItem();
                    item.setName(role.name);
                    if (cgcp.ExtGameHelper.isOffLine(role.uid)) {
                        item.setState(3);
                    }
                    else {
                        item.setState(2);
                    }
                    item.x = startX;
                    item.y = startY;
                    startY += h;
                    _this.items[k] = item;
                    _this.mainAsset.addChild(item);
                }
                _this.checkState();
                _this.timeVal = 300;
                _this.timeTextTimeoutId = egret.setInterval(_this.updateTimeText, _this, 1000);
                return _this;
            }
            VoteEndGamePanel.prototype.on_agreeBtn = function (e) {
                cgcp.RoomApi.voteEndGame(1);
            };
            VoteEndGamePanel.prototype.on_disagreeBtn = function (e) {
                cgcp.RoomApi.voteEndGame(0);
            };
            /**
             * 设置发起者的名字
             */
            VoteEndGamePanel.prototype.setLeaveName = function (name) {
                this.titleText.text = "\u662F\u5426\u540C\u610F\u73A9\u5BB6 " + name + " \u79BB\u5F00\u6E38\u620F\uFF1F";
            };
            /**
             * 将按钮设置为不可点击状态
             */
            VoteEndGamePanel.prototype.setBtnState = function () {
                this.agreeBtn.setEnable(false);
                this.disagreeBtn.setEnable(false);
            };
            /**
             * 根据投票信息显示数据
             */
            VoteEndGamePanel.prototype.showByDatas = function (voteEndGames) {
                var selfUid = cgcp.RoleData.getRole().uid;
                if (voteEndGames.indexOf(selfUid + "") != -1) {
                    this.setBtnState();
                }
                this.setLeaveName(cgcp.RoomData.getRole(voteEndGames[0]).name);
                var len = voteEndGames.length;
                var uid;
                for (var i = 0; i < len; i++) {
                    uid = voteEndGames[i];
                    this.items[uid].setState(1);
                }
            };
            VoteEndGamePanel.prototype.checkState = function () {
                var thisObj = this;
                this.timeoutId = egret.setTimeout(function () {
                    cgcp.RoomApi.checkVoteEndGame();
                    thisObj.checkState();
                }, this, 10000 + Math.random() * 5000);
            };
            VoteEndGamePanel.prototype.updateTimeText = function () {
                this.timeVal -= 1;
                this.timeText.text = this.timeVal + "\u79D2\u540E\u7CFB\u7EDF\u5C06\u81EA\u52A8\u5224\u5B9A\u4E3A\u540C\u610F";
                if (this.timeVal < 0) {
                    cgcp.RoomApi.checkVoteEndGame();
                }
            };
            VoteEndGamePanel.prototype.dispose = function () {
                _super.prototype.dispose.call(this);
                egret.clearTimeout(this.timeoutId);
                egret.clearInterval(this.timeTextTimeoutId);
            };
            VoteEndGamePanel.prototype.mainAssetName = function () {
                return "spr_vote_EndGame";
            };
            return VoteEndGamePanel;
        }(cgcp.BasePanel));
        cgcp.VoteEndGamePanel = VoteEndGamePanel;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        /**
         * 投票结果
         */
        var VoteResultItem = (function (_super) {
            __extends(VoteResultItem, _super);
            function VoteResultItem() {
                var _this = _super.call(this) || this;
                _this.chooseMC.gotoAndStop(3);
                return _this;
            }
            VoteResultItem.prototype.setName = function (name) {
                this.nameText.text = name;
            };
            VoteResultItem.prototype.setState = function (state) {
                this.chooseMC.gotoAndStop(state);
            };
            VoteResultItem.prototype.mainAssetName = function () {
                return "spr_vote_player_choose";
            };
            return VoteResultItem;
        }(cgcp.BasePanel));
        cgcp.VoteResultItem = VoteResultItem;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var ApiState = (function () {
            function ApiState() {
            }
            ApiState.show = function (state) {
                if (ApiState.stateTxt[state]) {
                    ApiState.showText(ApiState.stateTxt[state]);
                }
                else {
                    ApiState.showText("未知错误");
                }
            };
            ApiState.showText = function (text) {
                var spr = cgcp.AssetManager.mainSwf().createSprite("spr_apiState");
                spr.scaleX = spr.scaleY = 5;
                spr.y = cgcp.App.stageHeight / 2;
                spr.x = cgcp.App.stageWidth / 2;
                if (cgcp.App.isLandscape) {
                    spr.rotation = 90;
                }
                spr.getChildAt(1).text = text;
                lzm.Alert.show(spr);
                egret.Tween.get(spr).to({ scaleX: 1, scaleY: 1 }, 300, egret.Ease.backIn).call(function (obj) {
                    egret.setTimeout(function () {
                        spr.parent.removeChild(spr);
                    }, this, 2000);
                }, this, [spr]);
            };
            return ApiState;
        }());
        ApiState.stateTxt = {
            "-1": "api错误",
            "-2": "方法传递错误",
            "-3": "参数不足",
            "-4": "参数非法",
            "-5": "请先登陆",
            "-6": "用户不存在",
            "-7": "用户名已经存在",
            "-8": "房卡不足",
            "-9": "需要至少一张房卡，才能加入游戏",
            "-10": "房间不存在",
            "-11": "房间已满",
            "-12": "已经在房间中",
            "-13": "角色不存在",
            "-14": "这个玩家不是你的玩家",
            "-15": "这个玩家已经是代理了",
            "-16": "游戏不存在",
            "-17": "游戏已经开始，不能直接退出",
            "-18": "房卡消耗配置错误",
            "-19": "游戏已经开始",
            "-20": "你没有推荐权限",
            "-21": "房卡不足不能成为代理",
            "-22": "你不是房主",
            "-23": "玩家不在房间中",
            "-24": "助理人数已达上限",
            "-25": "下级人数已达上限",
            "-26": "积分不足",
            "-27": "抽奖失败",
            "-28": "房卡更改失败",
            "-29": "抽奖记录保存失败",
            "-30": "已添加业务员",
            "-31": "老代理不能绑定业务员",
            "-32": "已经领取过关注奖励"
        };
        cgcp.ApiState = ApiState;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var ChatButton = (function () {
            function ChatButton() {
            }
            ChatButton.mouseClick = function (evt) {
                cgcp.ChatManager.showChatPanel();
            };
            /**
             * 创建录音按钮
             */
            ChatButton.createChatButton = function () {
                var btn = cgcp.AssetManager.mainSwf().createButton("btn_chat");
                btn.addEventListener(egret.TouchEvent.TOUCH_TAP, ChatButton.mouseClick, ChatButton);
                return btn;
            };
            /**
             * 销毁录音按钮
             */
            ChatButton.destroyChatButton = function (btn) {
                btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, ChatButton.mouseClick, ChatButton);
                if (btn.parent) {
                    btn.parent.removeChild(btn);
                }
            };
            return ChatButton;
        }());
        cgcp.ChatButton = ChatButton;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var AdminApi = (function () {
            function AdminApi() {
            }
            /**
             * 玩家创建超过30分钟游戏没开始 离线回来 游戏房间销毁
             */
            AdminApi.onPaoMadeng = function (data) {
                cgcp.PaoMaDeng.show(data.text, data.gap, data.count);
            };
            return AdminApi;
        }());
        cgcp.AdminApi = AdminApi;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var NetWorkError = (function (_super) {
            __extends(NetWorkError, _super);
            function NetWorkError() {
                var _this = _super.call(this) || this;
                _this.mainAsset = cgcp.AssetManager.mainSwf().createSprite("spr_netword_error");
                _this.addChild(_this.mainAsset);
                _this.mainAsset.getButton("okBtn").addEventListener(starlingswf.SwfButton.onClick, _this.onOkBtn, _this);
                return _this;
            }
            NetWorkError.show = function () {
                var error = new NetWorkError();
                error.y = cgcp.App.stageHeight / 2;
                error.x = cgcp.App.stageWidth / 2;
                if (cgcp.App.isLandscape) {
                    error.rotation = 90;
                }
                lzm.Alert.alert(error, false);
            };
            NetWorkError.prototype.onOkBtn = function (e) {
                location.replace(location.href);
            };
            return NetWorkError;
        }(egret.DisplayObjectContainer));
        cgcp.NetWorkError = NetWorkError;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var NetworkLoading = (function () {
            function NetworkLoading() {
            }
            NetworkLoading.show = function (now) {
                if (now === void 0) { now = false; }
                cgcp.Log.log("NetworkLoading =========== show");
                if (NetworkLoading.loading == null) {
                    NetworkLoading.loading = cgcp.AssetManager.mainSwf().createSprite("spr_net_loading");
                    NetworkLoading.loadingText = NetworkLoading.loading.getTextField("loadingText");
                    NetworkLoading.background = new egret.Shape();
                    NetworkLoading.background.touchEnabled = true;
                    NetworkLoading.showCount = 0;
                }
                if (now) {
                    NetworkLoading.showCount++;
                    NetworkLoading.realyShow();
                }
                else {
                    cgcp.App.appRoot.addChild(NetworkLoading.background);
                    NetworkLoading.background.graphics.clear();
                    NetworkLoading.background.graphics.beginFill(0x000000, 0);
                    NetworkLoading.background.graphics.drawRect(0, 0, cgcp.App.stageWidth, cgcp.App.stageHeight);
                    NetworkLoading.background.graphics.endFill();
                    NetworkLoading.showCount++;
                    egret.setTimeout(function () {
                        if (NetworkLoading.showCount > 0)
                            NetworkLoading.realyShow();
                    }, NetworkLoading, 1000);
                }
            };
            NetworkLoading.realyShow = function () {
                cgcp.App.appRoot.addChild(NetworkLoading.background);
                NetworkLoading.background.graphics.clear();
                NetworkLoading.background.graphics.beginFill(0x000000, 0.7);
                NetworkLoading.background.graphics.drawRect(0, 0, cgcp.App.stageWidth, cgcp.App.stageHeight);
                NetworkLoading.background.graphics.endFill();
                cgcp.App.appRoot.addChild(NetworkLoading.loading);
                NetworkLoading.loading.x = cgcp.App.stageWidth / 2;
                NetworkLoading.loading.y = cgcp.App.stageHeight / 2;
                NetworkLoading.loadingText.text = "loading";
            };
            NetworkLoading.setLoadinText = function (text) {
                NetworkLoading.loadingText.text = text;
            };
            NetworkLoading.hide = function () {
                cgcp.Log.log("NetworkLoading =========== hide");
                NetworkLoading.showCount--;
                if (NetworkLoading.background != null && NetworkLoading.showCount == 0) {
                    if (NetworkLoading.background.parent)
                        NetworkLoading.background.parent.removeChild(NetworkLoading.background);
                    if (NetworkLoading.loading.parent)
                        NetworkLoading.loading.parent.removeChild(NetworkLoading.loading);
                }
            };
            return NetworkLoading;
        }());
        cgcp.NetworkLoading = NetworkLoading;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var PaoMaDeng = (function (_super) {
            __extends(PaoMaDeng, _super);
            function PaoMaDeng() {
                var _this = _super.call(this) || this;
                _this.text.width = 3000;
                _this.text.mask = _this.textMask;
                _this.playing = false;
                return _this;
            }
            /**
             * 显示一段跑马灯
             * @param text 显示文本
             * @param gap 播放间隔
             * @param count 播放次数
             */
            PaoMaDeng.show = function (text, gap, count) {
                if (PaoMaDeng.instance == null) {
                    PaoMaDeng.instance = new PaoMaDeng();
                    PaoMaDeng.tips = [];
                }
                PaoMaDeng.tips.push([text, gap, count]);
                if (PaoMaDeng.tips.length == 1) {
                    egret.setTimeout(function () {
                        PaoMaDeng.instance.start();
                    }, PaoMaDeng, 1000);
                }
            };
            PaoMaDeng.prototype.start = function () {
                var text = PaoMaDeng.tips[0][0];
                this.text.text = text;
                this.textWidth = this.text.textWidth;
                this.text.x = 315;
                this.addEventListener(egret.Event.ENTER_FRAME, this.update, this);
                cgcp.App.topContainer.addChild(this);
            };
            PaoMaDeng.prototype.stop = function () {
                this.removeEventListener(egret.Event.ENTER_FRAME, this.update, this);
                if (this.parent)
                    this.parent.removeChild(this);
                var gap = PaoMaDeng.tips[0][1];
                var count = PaoMaDeng.tips[0][2] - 1;
                if (count > 0) {
                    PaoMaDeng.tips[0][2] = count;
                    egret.setTimeout(function () {
                        PaoMaDeng.instance.start();
                    }, this, gap * 1000);
                }
                else {
                    PaoMaDeng.tips.shift();
                    if (PaoMaDeng.tips.length > 0) {
                        PaoMaDeng.instance.start();
                    }
                }
            };
            PaoMaDeng.prototype.update = function (e) {
                this.text.x -= 2;
                if (this.text.x < (-this.textWidth + -268)) {
                    this.stop();
                }
            };
            PaoMaDeng.prototype.layout = function () {
                if (cgcp.App.isLandscape) {
                    this.x = cgcp.App.stageWidth - 240;
                    this.y = cgcp.App.stageHeight / 2;
                    this.rotation = 90;
                }
                else {
                    this.x = cgcp.App.stageWidth / 2;
                    this.y = 120;
                    this.rotation = 0;
                }
            };
            PaoMaDeng.prototype.mainAssetName = function () {
                return "spr_lb";
            };
            return PaoMaDeng;
        }(cgcp.BasePanel));
        cgcp.PaoMaDeng = PaoMaDeng;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var RoleHeadImage = (function (_super) {
            __extends(RoleHeadImage, _super);
            function RoleHeadImage(role, needClick) {
                if (needClick === void 0) { needClick = false; }
                var _this = _super.call(this, null) || this;
                _this.image.width = 81;
                _this.image.height = 80;
                if (needClick) {
                    _this.touchEnabled = true;
                    _this.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.onClick, _this);
                }
                _this.wrzImage = cgcp.AssetManager.mainNewSwf().createImage("img_WRZ_WZ_AN");
                _this.wrzImage.x = 40.5;
                _this.wrzImage.y = 40;
                _this.addChild(_this.wrzImage);
                _this.reloadByRole(role);
                return _this;
            }
            RoleHeadImage.prototype.reloadByRole = function (role) {
                if (role == null)
                    return;
                if (this.role == null) {
                    cgcp.RoleHeadCache.addHead(role.uid, this);
                }
                else {
                    cgcp.RoleHeadCache.replaceHead(this.role.uid, role.uid);
                }
                this.role = role;
                if (this.role.proxy > 0 || (this.role.cert != null && parseInt(this.role.cert) > 0)) {
                    this.wrzImage.visible = false;
                }
                else {
                    this.wrzImage.visible = true;
                }
                if (this.role.head == null || this.role.head == "") {
                    this.image.texture = RES.getRes("defUser");
                    return;
                }
                if (role.head != null && role.head != "") {
                    var url = role.head;
                    url = url.replace("/0", "/64");
                    this.reload(url);
                }
                else {
                    this.reload(role.head);
                }
            };
            RoleHeadImage.prototype.onClick = function (e) {
                if (cgcp.App.isLandscape) {
                    lzm.Alert.alertLandscape(new cgcp.RoleInfo(this.role, this.image.texture));
                }
                else {
                    lzm.Alert.alert(new cgcp.RoleInfo(this.role, this.image.texture));
                }
            };
            RoleHeadImage.prototype.dispose = function () {
                _super.prototype.dispose.call(this);
                this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
            };
            RoleHeadImage.prototype.$setWidth = function (value) {
                this.wrzImage.x = value / 2;
                return _super.prototype.$setWidth.call(this, value);
            };
            RoleHeadImage.prototype.$setHeight = function (value) {
                this.wrzImage.y = value / 2;
                return _super.prototype.$setHeight.call(this, value);
            };
            return RoleHeadImage;
        }(cgcp.NetImage));
        cgcp.RoleHeadImage = RoleHeadImage;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        /**
         * 玩家详细信息
         */
        var RoleInfo = (function (_super) {
            __extends(RoleInfo, _super);
            function RoleInfo(role, texture) {
                var _this = _super.call(this) || this;
                _this.role = role;
                _this.headImage = new egret.Bitmap();
                _this.headImage.texture = texture;
                _this.headImage.width = _this.headImage.height = 72;
                _this.headImage.x = 125;
                _this.headImage.y = 61;
                _this.mainAsset.addChild(_this.headImage);
                _this.nameText.text = _this.role.name;
                _this.idText.text = "ID:" + _this.role.uid;
                _this.ipText.text = "IP:" + _this.role.ip;
                return _this;
            }
            /**
             * 点击详细位置按钮
             */
            RoleInfo.prototype.on_posBtn = function (e) {
                if (this.role.latitude == 0 && this.role.longitude == 0) {
                    cgcp.ApiState.showText("该玩家没有共享地理位置");
                    return;
                }
                cgcp.WxUtils.openLocation(this.role.latitude, this.role.longitude);
            };
            RoleInfo.prototype.mainAssetName = function () {
                return "spr_role_info";
            };
            return RoleInfo;
        }(cgcp.BasePanel));
        cgcp.RoleInfo = RoleInfo;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var ShareTip = (function (_super) {
            __extends(ShareTip, _super);
            function ShareTip() {
                var _this = _super.call(this) || this;
                _this.arrow = cgcp.AssetManager.mainSwf().createSprite("spr_share");
                _this.addChild(_this.arrow);
                _this.touchEnabled = true;
                _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.addToStage, _this);
                _this.addEventListener(egret.Event.REMOVED_FROM_STAGE, _this.removeFromStage, _this);
                _this.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.onClick, _this);
                return _this;
            }
            Object.defineProperty(ShareTip, "instance", {
                get: function () {
                    if (ShareTip._tip == null) {
                        ShareTip._tip = new ShareTip();
                    }
                    return ShareTip._tip;
                },
                enumerable: true,
                configurable: true
            });
            ShareTip.prototype.show = function () {
                this.graphics.clear();
                this.graphics.beginFill(0x000000, 0.7);
                this.graphics.drawRect(0, 0, cgcp.App.stageWidth, cgcp.App.stageHeight);
                this.graphics.endFill();
                this.arrow.x = cgcp.App.stageWidth;
                if (window.orientation != null && window.orientation == 90) {
                    this.arrow.y = cgcp.App.stageHeight;
                    this.arrow.rotation = 90;
                }
                else {
                    this.arrow.y = 0;
                    this.arrow.rotation = 0;
                }
                if (this.parent == null)
                    cgcp.App.appRoot.addChild(this);
            };
            ShareTip.prototype.hide = function () {
                if (this.parent != null)
                    this.parent.removeChild(this);
            };
            ShareTip.prototype.onClick = function (e) {
                this.hide();
            };
            ShareTip.prototype.addToStage = function (e) {
                this.stage.addEventListener(egret.Event.RESIZE, this.resize, this);
            };
            ShareTip.prototype.removeFromStage = function (e) {
                this.stage.removeEventListener(egret.Event.RESIZE, this.resize, this);
            };
            ShareTip.prototype.resize = function (e) {
                this.show();
            };
            return ShareTip;
        }(egret.Sprite));
        cgcp.ShareTip = ShareTip;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        /**
         * 文字提示面板
         */
        var TipPanel = (function (_super) {
            __extends(TipPanel, _super);
            function TipPanel() {
                return _super.call(this) || this;
            }
            TipPanel.create = function (text, eventThisObj, eventOkFun, eventCancalFun, show) {
                if (eventCancalFun === void 0) { eventCancalFun = null; }
                if (show === void 0) { show = true; }
                var panel = new TipPanel();
                panel.tipText.text = text;
                panel.eventThisObj = eventThisObj;
                panel.eventOkFun = eventOkFun;
                panel.eventCancalFun = eventCancalFun;
                if (show) {
                    if (cgcp.App.isLandscape)
                        lzm.Alert.alertLandscape(panel);
                    else
                        lzm.Alert.alert(panel);
                }
                return panel;
            };
            TipPanel.prototype.on_cancelBtn = function (e) {
                if (this.eventCancalFun != null)
                    this.eventCancalFun.apply(this.eventThisObj, []);
                this.on_closeBtn(null);
            };
            TipPanel.prototype.on_okBtn = function (e) {
                if (this.eventOkFun != null)
                    this.eventOkFun.apply(this.eventThisObj, []);
                this.on_closeBtn(null);
            };
            TipPanel.prototype.mainAssetName = function () {
                return "spr_tip_panel";
            };
            return TipPanel;
        }(cgcp.BasePanel));
        cgcp.TipPanel = TipPanel;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        /**
         * 警告提示
         */
        var TipWarning = (function () {
            function TipWarning() {
            }
            /**
             * 显示警告
             */
            TipWarning.show = function () {
                if (TipWarning.warningDisplay == null) {
                    TipWarning.warningDisplay = cgcp.AssetManager.mainNewSwf().createSprite("spr_jinzhidubo");
                }
                if (cgcp.App.isLandscape) {
                    TipWarning.warningDisplay.rotation = 90;
                    TipWarning.warningDisplay.x = cgcp.App.stageWidth + 48;
                    TipWarning.warningDisplay.y = cgcp.App.stageHeight / 2;
                    egret.setTimeout(function () {
                        egret.Tween.get(TipWarning.warningDisplay).to({ x: cgcp.App.stageWidth }, 300, egret.Ease.backOut);
                    }, TipWarning, 1000);
                }
                else {
                    TipWarning.warningDisplay.x = cgcp.App.stageWidth / 2;
                    TipWarning.warningDisplay.y = -48;
                    egret.setTimeout(function () {
                        egret.Tween.get(TipWarning.warningDisplay).to({ y: 0 }, 300, egret.Ease.backOut);
                    }, TipWarning, 1000);
                }
                cgcp.App.topContainer.addChild(TipWarning.warningDisplay);
                egret.setTimeout(function () {
                    TipWarning.warningDisplay.parent.removeChild(TipWarning.warningDisplay);
                }, TipWarning, 6000);
            };
            return TipWarning;
        }());
        cgcp.TipWarning = TipWarning;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var VoiceButton = (function () {
            function VoiceButton() {
            }
            VoiceButton.mouseDown = function (evt) {
                cgcp.WxUtils.startRecord();
                if (VoiceButton.microphoneImage == null) {
                    VoiceButton.microphoneImage = cgcp.AssetManager.chatSwf().createMovie("mc_voice");
                    VoiceButton.microphoneImage.anchorOffsetX = VoiceButton.microphoneImage.anchorOffsetY = 71;
                }
                VoiceButton.microphoneImage.x = cgcp.App.stageWidth / 2;
                VoiceButton.microphoneImage.y = cgcp.App.stageHeight / 2;
                cgcp.App.appRoot.addChild(VoiceButton.microphoneImage);
                if (cgcp.App.isLandscape) {
                    VoiceButton.microphoneImage.rotation = 90;
                }
                else {
                    VoiceButton.microphoneImage.rotation = 0;
                }
            };
            VoiceButton.mouseUp = function (evt) {
                cgcp.WxUtils.stopRecord(function (localId) {
                    cgcp.WxUtils.uploadVoice(localId, function (serverId) {
                        cgcp.ChatApi.sendVoice(serverId, function (data) {
                            cgcp.WxUtils.playVoice(localId);
                            var sender = cgcp.RoleData.getRole().uid;
                            cgcp.ChatManager.showVoice({ "sender": sender });
                        });
                    });
                });
                if (VoiceButton.microphoneImage != null && VoiceButton.microphoneImage.parent != null) {
                    VoiceButton.microphoneImage.parent.removeChild(VoiceButton.microphoneImage);
                }
            };
            /**
             * 创建录音按钮
             */
            VoiceButton.createVoiceButton = function () {
                var btn = cgcp.AssetManager.mainSwf().createButton("btn_voice");
                btn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, VoiceButton.mouseDown, VoiceButton);
                btn.addEventListener(egret.TouchEvent.TOUCH_END, VoiceButton.mouseUp, VoiceButton);
                btn.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, VoiceButton.mouseUp, VoiceButton);
                return btn;
            };
            /**
             * 销毁录音按钮
             */
            VoiceButton.destroyVocieButton = function (btn) {
                btn.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, VoiceButton.mouseDown, VoiceButton);
                btn.removeEventListener(egret.TouchEvent.TOUCH_END, VoiceButton.mouseUp, VoiceButton);
                btn.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, VoiceButton.mouseUp, VoiceButton);
                if (btn.parent) {
                    btn.parent.removeChild(btn);
                }
            };
            return VoiceButton;
        }());
        cgcp.VoiceButton = VoiceButton;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        /**
         * 等待文字
         */
        var WaitingTextTip = (function () {
            function WaitingTextTip() {
            }
            /**
             * 显示等待文字
             */
            WaitingTextTip.showWait = function (text) {
                if (WaitingTextTip.waitingDisplay == null) {
                    WaitingTextTip.waitingDisplay = cgcp.AssetManager.mainSwf().createSprite("spr_wait_leave_user");
                }
                WaitingTextTip.waitingDisplay.getChildAt(1).text = text;
                WaitingTextTip.waitingDisplay.x = cgcp.App.stageWidth / 2;
                WaitingTextTip.waitingDisplay.y = cgcp.App.stageHeight / 2;
                if (cgcp.App.isLandscape)
                    WaitingTextTip.waitingDisplay.rotation = 90;
                else
                    WaitingTextTip.waitingDisplay.rotation = 0;
                cgcp.App.appRoot.addChild(WaitingTextTip.waitingDisplay);
            };
            /**
             * 隐藏等待文字
             */
            WaitingTextTip.hideWait = function () {
                if (WaitingTextTip.waitingDisplay != null && WaitingTextTip.waitingDisplay.parent != null && WaitingTextTip.waitingDisplay.parent) {
                    WaitingTextTip.waitingDisplay.parent.removeChild(WaitingTextTip.waitingDisplay);
                }
            };
            return WaitingTextTip;
        }());
        cgcp.WaitingTextTip = WaitingTextTip;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var BmTextUtil = (function () {
    function BmTextUtil() {
    }
    BmTextUtil.replaceTextfield = function (textfield, font) {
        var bmText = new egret.BitmapText();
        var tf = textfield;
        bmText.font = font;
        bmText.textAlign = tf.textAlign;
        bmText.text = tf.text;
        bmText.name = tf.name;
        bmText.x = tf.x;
        bmText.y = tf.y;
        bmText.width = tf.width;
        bmText.height = tf.height;
        bmText.anchorOffsetX = tf.anchorOffsetX;
        bmText.anchorOffsetY = tf.anchorOffsetY;
        if (tf.parent != null) {
            var index = tf.parent.getChildIndex(tf);
            tf.parent.addChildAt(bmText, index);
            tf.parent.removeChild(tf);
        }
        return bmText;
    };
    return BmTextUtil;
}());
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var ColorUtil = (function () {
            function ColorUtil() {
            }
            /**
             * 设置对象颜色为灰色
             */
            ColorUtil.setGray = function (display) {
                var colorMatrix = [
                    0.3, 0.6, 0, 0, 0,
                    0.3, 0.6, 0, 0, 0,
                    0.3, 0.6, 0, 0, 0,
                    0, 0, 0, 1, 0
                ];
                var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
                display.filters = [colorFlilter];
            };
            /**
             * 清除颜色
             */
            ColorUtil.clearColor = function (display) {
                display.filters = null;
            };
            return ColorUtil;
        }());
        cgcp.ColorUtil = ColorUtil;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var InterfaceVariablesUtil = (function () {
            function InterfaceVariablesUtil() {
            }
            InterfaceVariablesUtil.initVariables = function (obj, interFace) {
                var hasEventBtns = [];
                var hasEventBtnNames = [];
                var len = interFace.$children.length;
                var name;
                var display;
                var btnClickFunName;
                for (var i = 0; i < len; i++) {
                    display = interFace.$children[i];
                    name = display.name;
                    if (name != null && name != "") {
                        obj[name] = display;
                    }
                    if (display instanceof starlingswf.SwfButton) {
                        btnClickFunName = "on_" + name;
                        if (obj[btnClickFunName]) {
                            display.addEventListener(starlingswf.SwfButton.onClick, obj[btnClickFunName], obj);
                            hasEventBtns.push(display);
                            hasEventBtnNames.push(name);
                        }
                    }
                }
                obj["_hasEventBtns_"] = hasEventBtns;
                obj["_hasEventBtnNames_"] = hasEventBtnNames;
            };
            InterfaceVariablesUtil.disposeVariables = function (obj) {
                var hasEventBtns = obj["_hasEventBtns_"];
                var hasEventBtnNames = obj["_hasEventBtnNames_"];
                if (hasEventBtns == null || hasEventBtnNames == null)
                    return;
                var len = hasEventBtns.length;
                for (var i = 0; i < len; i++) {
                    hasEventBtns[i].removeEventListener(starlingswf.SwfButton.onClick, obj[hasEventBtnNames[i]], obj);
                }
            };
            return InterfaceVariablesUtil;
        }());
        cgcp.InterfaceVariablesUtil = InterfaceVariablesUtil;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var LayoutUtil = (function () {
            function LayoutUtil() {
            }
            /**
             * 靠上对其
             */
            LayoutUtil.layout_up = function (display) { };
            /**
             * 靠下对其
             */
            LayoutUtil.layout_down = function (display) {
                display.y = cgcp.App.stageHeight - (cgcp.App.designHeight - LayoutUtil.getLayoutY(display));
            };
            /**
             * 左对其
             */
            LayoutUtil.layout_left = function (display) { };
            /**
             * 左上
             */
            LayoutUtil.layout_left_up = function (display) {
                LayoutUtil.layout_left(display);
                LayoutUtil.layout_up(display);
            };
            /**
             * 左下
             */
            LayoutUtil.layout_left_down = function (display) {
                LayoutUtil.layout_left(display);
                LayoutUtil.layout_down(display);
            };
            /**
             * 右对齐
             */
            LayoutUtil.layout_right = function (display) {
                display.x = cgcp.App.stageWidth - (cgcp.App.designWidth - LayoutUtil.getLayoutX(display));
            };
            /**
             * 右上
             */
            LayoutUtil.layout_right_up = function (display) {
                LayoutUtil.layout_right(display);
                LayoutUtil.layout_up(display);
            };
            /**
             * 右下
             */
            LayoutUtil.layout_right_down = function (display) {
                LayoutUtil.layout_right(display);
                LayoutUtil.layout_down(display);
            };
            /**
             * X居中
             */
            LayoutUtil.layout_center_x = function (display) {
                display.x = (cgcp.App.stageWidth - display.width) / 2;
            };
            /**
             * Y居中
             */
            LayoutUtil.layout_center_y = function (display) {
                display.y = (cgcp.App.stageHeight - display.height) / 2;
            };
            /**
             * 正中间
             */
            LayoutUtil.layout_center_xy = function (display) {
                LayoutUtil.layout_center_x(display);
                LayoutUtil.layout_center_y(display);
            };
            /**
             * 中上
             */
            LayoutUtil.layout_center_up = function (display) {
                LayoutUtil.layout_center_x(display);
                LayoutUtil.layout_up(display);
            };
            /**
             * 中下
             */
            LayoutUtil.layout_center_down = function (display) {
                LayoutUtil.layout_center_x(display);
                LayoutUtil.layout_down(display);
            };
            /**
             * 填充
             */
            LayoutUtil.layout_fill = function (display) {
                display.width = cgcp.App.stageWidth;
                display.height = cgcp.App.stageHeight;
            };
            LayoutUtil.getLayoutX = function (display) {
                if (display["_layout_x_"]) {
                    return display["_layout_x_"];
                }
                display["_layout_x_"] = display.x;
                return display.x;
            };
            LayoutUtil.getLayoutY = function (display) {
                if (display["_layout_y_"]) {
                    return display["_layout_y_"];
                }
                display["_layout_y_"] = display.y;
                return display.y;
            };
            return LayoutUtil;
        }());
        cgcp.LayoutUtil = LayoutUtil;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var Log = (function () {
            function Log() {
            }
            Log.log = function (data) {
                egret.log(data);
            };
            return Log;
        }());
        cgcp.Log = Log;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
var lj;
(function (lj) {
    var cgcp;
    (function (cgcp) {
        var WxUtils = (function () {
            function WxUtils() {
            }
            WxUtils.hasWx = function () {
                return typeof (wx) != "undefined";
            };
            /**
             * 初始化微信jssdk
             */
            WxUtils.initWx = function () {
                WxUtils.playSoundQueue = [];
                WxUtils.playSounding = false;
                var config = new BodyConfig();
                config.debug = cgcp.AppConfig.wx_jssdk_config.debug;
                config.appId = cgcp.AppConfig.wx_jssdk_config.appId;
                config.timestamp = cgcp.AppConfig.wx_jssdk_config.timestamp;
                config.nonceStr = cgcp.AppConfig.wx_jssdk_config.nonceStr;
                config.signature = cgcp.AppConfig.wx_jssdk_config.signature;
                config.jsApiList = cgcp.AppConfig.wx_jssdk_config.jsApiList;
                wx.config(config);
                wx.ready(function () {
                    wx.hideAllNonBaseMenuItem(null);
                    wx.showMenuItems({ menuList: ["menuItem:share:appMessage", "menuItem:share:timeline", "menuItem:favorite"] });
                    if (cgcp.RoomData.getCurrentRoom() == null) {
                        WxUtils.joinPlatform();
                    }
                    else {
                        WxUtils.joinGame(cgcp.ExtGameHelper.currentGameConfig());
                    }
                });
            };
            /**
             * 自定义游戏分享内容，仅小游戏调用
             */
            WxUtils.customizeShareDesc = function (title, desc, shareRoom) {
                if (shareRoom === void 0) { shareRoom = false; }
                WxUtils.joinGame(cgcp.ExtGameHelper.currentGameConfig(), title, desc, shareRoom);
            };
            /**
             * 进入游戏，单独定制分享内容
             */
            WxUtils.joinGame = function (gameConf, title, desc, shareRoom) {
                if (title === void 0) { title = null; }
                if (desc === void 0) { desc = null; }
                if (shareRoom === void 0) { shareRoom = true; }
                if (!WxUtils.hasWx())
                    return;
                var room = cgcp.RoomData.getCurrentRoom();
                var role = cgcp.RoleData.getRole();
                var body = new BodyMenuShareAppMessage();
                var shareLink = cgcp.AppConfig.login_path;
                var imgUrl = cgcp.AppConfig.web_res_path + "shareIcons/" + gameConf.id + ".png?v=" + cgcp.AccountData.getUrlData().resVer;
                if (title == null) {
                    body.title = "【" + WxUtils.getShareRoleName(role.name) + "】邀请你加入房间:" + room.id + " - 【" + gameConf.name + "】";
                }
                else {
                    body.title = title;
                }
                if (desc == null) {
                    body.desc = "快来加入我的房间吧";
                }
                else {
                    body.desc = desc;
                }
                if (shareRoom) {
                    shareLink += "?room_id=" + room.id + "&game_id=" + gameConf.id;
                }
                body.link = shareLink;
                body.imgUrl = imgUrl;
                body.type = "link";
                body.success = function (res) {
                    cgcp.ShareTip.instance.hide();
                };
                wx.onMenuShareAppMessage(body);
                var body2 = new BodyMenuShareTimeline();
                body2.title = gameConf.name + "，快来加入我的房间吧";
                if (title == null) {
                    body2.title = "【" + role.name + "】邀请你加入房间:" + room.id + " - 【" + gameConf.name + "】";
                }
                else {
                    body2.title = title;
                }
                body2.link = shareLink;
                body2.imgUrl = imgUrl;
                body2.success = function (res) {
                    cgcp.ShareTip.instance.hide();
                };
                wx.onMenuShareTimeline(body2);
            };
            /**
             * 进入平台
             */
            WxUtils.joinPlatform = function () {
                if (!WxUtils.hasWx())
                    return;
                var shareLink = cgcp.AppConfig.login_path;
                var imgUrl = cgcp.AppConfig.web_res_path + "shareIcons/platform.png?v=" + cgcp.AccountData.getUrlData().resVer;
                var body = new BodyMenuShareAppMessage();
                body.title = "休闲竞技游戏平台";
                body.desc = "好玩的游戏噢~";
                body.link = shareLink;
                body.imgUrl = imgUrl;
                body.type = "link";
                body.success = function (res) {
                    cgcp.ShareTip.instance.hide();
                };
                wx.onMenuShareAppMessage(body);
                var body2 = new BodyMenuShareTimeline();
                body2.title = "休闲竞技游戏平台";
                body2.link = shareLink;
                body2.imgUrl = imgUrl;
                body2.success = function (res) {
                    cgcp.ShareTip.instance.hide();
                };
                wx.onMenuShareTimeline(body2);
            };
            /**
             * 分享购卡连接
             */
            WxUtils.sharePayByProxy = function () {
                if (!WxUtils.hasWx())
                    return;
                var role = cgcp.RoleData.getRole();
                var shareLink = cgcp.AppConfig.login_path + "?proxy_id=" + role.uid + "&buyCard=1";
                // var imgUrl:string = AppConfig.web_res_path + "shareIcons/maika.png?v=" + AccountData.getUrlData().resVer;
                var imgUrl = role.head;
                var body = new BodyMenuShareAppMessage();
                body.title = "点我购买房卡";
                body.desc = "在代理【" + WxUtils.filteremoji(role.name) + "(" + role.uid + ")】处购买房卡";
                body.link = shareLink;
                body.imgUrl = imgUrl;
                body.type = "link";
                body.success = function (res) {
                    cgcp.ShareTip.instance.hide();
                };
                wx.onMenuShareAppMessage(body);
                var body2 = new BodyMenuShareTimeline();
                body2.title = "点我购买房卡";
                body2.link = shareLink;
                body2.imgUrl = imgUrl;
                body2.success = function (res) {
                    cgcp.ShareTip.instance.hide();
                };
                wx.onMenuShareTimeline(body2);
            };
            /**
             * 开始录音
             */
            WxUtils.startRecord = function () {
                if (!WxUtils.hasWx())
                    return;
                wx.startRecord(null);
            };
            /**
             * 停止录音
             */
            WxUtils.stopRecord = function (suc) {
                if (!WxUtils.hasWx())
                    return;
                wx.stopRecord({
                    success: function (res) {
                        suc(res.localId);
                    }
                });
            };
            /**
             * 播放声音
             */
            WxUtils.playVoice = function (localId) {
                if (!WxUtils.hasWx())
                    return;
                if (WxUtils.playSounding) {
                    WxUtils.playSoundQueue.push(localId);
                    return;
                }
                WxUtils.playSounding = true;
                wx.playVoice({
                    localId: localId
                });
                wx.onVoicePlayEnd({
                    success: function (res) {
                        if (WxUtils.playSoundQueue.length == 0) {
                            WxUtils.playSounding = false;
                        }
                        else {
                            WxUtils.playVoice(WxUtils.playSoundQueue.shift());
                        }
                    }
                });
            };
            /**
             * 上传声音
             */
            WxUtils.uploadVoice = function (localId, suc) {
                if (!WxUtils.hasWx())
                    return;
                wx.uploadVoice({
                    localId: localId,
                    isShowProgressTips: 0,
                    success: function (res) {
                        suc(res.serverId);
                    }
                });
            };
            /**
             * 下载声音
             */
            WxUtils.downloadVoice = function (serverId, suc) {
                if (!WxUtils.hasWx())
                    return;
                wx.downloadVoice({
                    serverId: serverId,
                    isShowProgressTips: 0,
                    success: function (res) {
                        suc(res.localId);
                    }
                });
            };
            /**
             * 获取地理位置
             */
            WxUtils.getLocation = function (suc) {
                if (!WxUtils.hasWx())
                    return;
                wx.getLocation({
                    type: 'gcj02',
                    success: function (res) {
                        suc(res);
                    }
                });
            };
            /**
             * 打开位置详情
             */
            WxUtils.openLocation = function (latitude, longitude) {
                if (!WxUtils.hasWx())
                    return;
                wx.openLocation({
                    latitude: latitude,
                    longitude: longitude
                });
            };
            /**
             * 关闭当前网页
             */
            WxUtils.closeWindow = function () {
                if (!WxUtils.hasWx())
                    return;
                wx.closeWindow(null);
            };
            /**
             * 获取分享时 玩家显示名字
             */
            WxUtils.getShareRoleName = function (name) {
                name = WxUtils.filteremoji(name);
                var len = name.length;
                if (len > 5) {
                    return name.substr(0, 5);
                }
                return name;
            };
            WxUtils.filteremoji = function (emojireg) {
                return emojireg;
                // var ranges = [
                // 	'\ud83c[\udf00-\udfff]', 
                // 	'\ud83d[\udc00-\ude4f]', 
                // 	'\ud83d[\ude80-\udeff]'
                // ];
                // emojireg = emojireg.replace(new RegExp(ranges.join('|'), 'g'), '');
                // return emojireg;
            };
            return WxUtils;
        }());
        cgcp.WxUtils = WxUtils;
    })(cgcp = lj.cgcp || (lj.cgcp = {}));
})(lj || (lj = {}));
