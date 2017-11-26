module CKingLib {
	export class SokectClient {
		public socket:egret.WebSocket;
		public host:string;
		public port:number;
		public onConnectCallBack:Function;
		public onCloseCallBack:Function;
		public onIOErrorCallBack:Function;
		public onDataCallBack:Function;
		public isconnect:boolean = false;
		public constructor(host:string,port:number) {
			this.socket = new egret.WebSocket();
			this.host = host;
			this.port = port;
			this.socket.addEventListener(egret.ProgressEvent.SOCKET_DATA,this.onData,this);
			this.socket.addEventListener(egret.Event.CONNECT,this.onSocketConnect,this);
			this.socket.addEventListener(egret.Event.CLOSE,this.onSocketClose,this);
			this.socket.addEventListener(egret.IOErrorEvent.IO_ERROR,this.onSocketIOError,this);
			this.socket.connect(host,port);
		}
		public sendData(data:any){
			if(this.isconnect){
				this.socket.writeUTF(JSON.stringify(data));
			}
		}
		public onData(e:egret.ProgressEvent){
			var msg = this.socket.readUTF();
			if(this.onDataCallBack != null){
				this.onDataCallBack(JSON.parse(msg));
			}
		}
		public onSocketConnect(e:egret.Event){
			this.isconnect = true;
			if(this.onConnectCallBack != null){
				this.onConnectCallBack();
			}
		}
		public onSocketClose(e:egret.Event){
			this.isconnect = false;
			if(this.onCloseCallBack != null){
				this.onCloseCallBack();
			}
		}
		public onSocketIOError(e:egret.IOErrorEvent){
			if(this.onIOErrorCallBack != null){
				this.onIOErrorCallBack();
			}
		}
		public dispose(){
			this.socket.close();
			this.socket.removeEventListener(egret.ProgressEvent.SOCKET_DATA,this.onData,this);
			this.socket.removeEventListener(egret.Event.CONNECT,this.onSocketConnect,this);
			this.socket.removeEventListener(egret.Event.CLOSE,this.onSocketClose,this);
			this.socket.removeEventListener(egret.IOErrorEvent.IO_ERROR,this.onSocketIOError,this);
			this.onConnectCallBack = null;
			this.onCloseCallBack = null;
			this.onIOErrorCallBack = null;
			this.onDataCallBack = null;
			this.socket = null;
		}
	}
}