module lj.cgcp.game.qdmj_705 {
	export class PlayLogPanel extends ExtGameScorePanel {

		public mainAssets:starlingswf.SwfSprite;

		public scrollView:egret.ScrollView;
		public scrollViewContent:egret.DisplayObjectContainer;

		public constructor() {
			super();
			this.mainAssets = MjGameAsset.mainSwf.createSprite("spr_logs");
			this.addChild(this.mainAssets);

			InterfaceVariablesUtil.initVariables(this,this.mainAssets);
		}

		/**
         * 初始化
         */
		public init(data: any[]): void{
			var thisObj:PlayLogPanel = this;
			egret.setTimeout(function():void{
				thisObj.createItems(data);
			},this,10);
		}

		public createItems(data:any):void{
			this.scrollViewContent = new egret.DisplayObjectContainer();
			this.scrollView = new egret.ScrollView();
			this.scrollView.setContent(this.scrollViewContent);
			this.mainAssets.addChildAt(this.scrollView,2);
			this.scrollView.width = 600;
			this.scrollView.height = 570;
			// this.scrollView.x = 31.05;
			// this.scrollView.y = 93.2;
			this.scrollView.x = 50;
			this.scrollView.y = 104;

			var zhanji:any[] = data.zhanji;
			var len:number = zhanji.length;
			for(var i:number = 0; i < len;i++){
				var dis:egret.DisplayObject = this.createItem(zhanji[i]);
				// dis.y = i * 111.65 + i * 20;//战绩列表的每条数据的高度
				dis.y = i * 148 + i * 10;
				
				this.scrollViewContent.addChild(dis);
			}
		}

		public createItem(data:any):egret.DisplayObject{
			var roomId:string = data.roomId;
			var time:string = data.time;
			var info:any[] = data.info;
			var spr:starlingswf.SwfSprite = MjGameAsset.mainSwf.createSprite("spr_log_item");

			spr.getTextField("roomIdText").text = "房号:" + roomId;
			spr.getTextField("timeText").text = time;

			for(var i:number = 0 ; i < 4 ; i++){
				var infoArray:any[] = info[i];
				var uid:string = infoArray[1];
				var fen:number = parseInt(infoArray[2]);
				spr.getTextField("name" + (i + 1)).text = infoArray[0] + ":";
				spr.getTextField("fen" + (i + 1)).text = "+" + fen.toString();
				if(fen < 0){
					spr.getTextField("fen" + (i + 1)).text = fen.toString();
					spr.getTextField("fen" + (i + 1)).textColor = 0xF46354;
				}
				if(uid == RoleData.getRole().uid){
					if(fen < 0){
						spr.getImage("bty").visible = false;
					}else{
						spr.getImage("bts").visible = false;
					}
				}
			}
			return spr;
		}

		public on_closeBtn(e:egret.Event):void{
			this.parent.removeChild(this);
		}

		public dispose():void{
			InterfaceVariablesUtil.disposeVariables(this);
		}
		
	}
}