var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var CKingLib;
(function (CKingLib) {
    var SokectClient = (function () {
        function SokectClient(host, port) {
            this.isconnect = false;
            this.socket = new egret.WebSocket();
            this.host = host;
            this.port = port;
            this.socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onData, this);
            this.socket.addEventListener(egret.Event.CONNECT, this.onSocketConnect, this);
            this.socket.addEventListener(egret.Event.CLOSE, this.onSocketClose, this);
            this.socket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketIOError, this);
            this.socket.connect(host, port);
        }
        SokectClient.prototype.sendData = function (data) {
            if (this.isconnect) {
                this.socket.writeUTF(JSON.stringify(data));
            }
        };
        SokectClient.prototype.onData = function (e) {
            var msg = this.socket.readUTF();
            if (this.onDataCallBack != null) {
                this.onDataCallBack(JSON.parse(msg));
            }
        };
        SokectClient.prototype.onSocketConnect = function (e) {
            this.isconnect = true;
            if (this.onConnectCallBack != null) {
                this.onConnectCallBack();
            }
        };
        SokectClient.prototype.onSocketClose = function (e) {
            this.isconnect = false;
            if (this.onCloseCallBack != null) {
                this.onCloseCallBack();
            }
        };
        SokectClient.prototype.onSocketIOError = function (e) {
            if (this.onIOErrorCallBack != null) {
                this.onIOErrorCallBack();
            }
        };
        SokectClient.prototype.dispose = function () {
            this.socket.close();
            this.socket.removeEventListener(egret.ProgressEvent.SOCKET_DATA, this.onData, this);
            this.socket.removeEventListener(egret.Event.CONNECT, this.onSocketConnect, this);
            this.socket.removeEventListener(egret.Event.CLOSE, this.onSocketClose, this);
            this.socket.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketIOError, this);
            this.onConnectCallBack = null;
            this.onCloseCallBack = null;
            this.onIOErrorCallBack = null;
            this.onDataCallBack = null;
            this.socket = null;
        };
        return SokectClient;
    }());
    CKingLib.SokectClient = SokectClient;
    __reflect(SokectClient.prototype, "CKingLib.SokectClient");
})(CKingLib || (CKingLib = {}));
//# sourceMappingURL=SokectClient.js.map