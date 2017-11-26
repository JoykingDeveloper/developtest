module lj.cgcp.game.jinhua {
	export class EndPanel extends BasePanel {

		public gamePanel:GamePanel;
		public bisaijiesuanMc:starlingswf.SwfMovieClip;
		public dayingjia:egret.DisplayObject;
		public endItemLine:egret.DisplayObject;
		public winner:string;
		public title:string;
		public detail:string;
		
		public constructor(gamePanel:GamePanel) {
			super();
			this.gamePanel = gamePanel;
			this.bisaijiesuanMc.loop = false;
		}

		public init(): void{
			//分享战绩
			var room:Room = RoomData.getCurrentRoom();
			var game = JinHuaGameData.getCurrentGame();
			var room:Room = RoomData.getCurrentRoom();
			var winUid = "";
			for(var uid in game.money){
				if(winUid == ""){
					winUid = uid;
					continue;
				}
				if(game.money[uid]>game.money[winUid]){
					winUid = uid;
				}
			}
			var title = room.id+"房大赢家-"+WxUtils.getShareRoleName(RoomData.getRole(winUid).name)+":"+game.money[winUid];
			var des = "";
			var index = 0;
			for(var uid in game.money){
				index++;
				if(uid != winUid){
					des += WxUtils.getShareRoleName(RoomData.getRole(uid).name)+":"+game.money[uid]+" ";
				}
			}
			WxUtils.customizeShareDesc(title,des);
			Log.log(des);
			//每位玩家的结算信息
			var index:number = 0;
			var xoff:number = 40;
			var yoff:number = 200;
			var roleInfo:Role;
			var headImage:RoleHeadImage;
			for(var uid in game.money){
				var item:starlingswf.SwfSprite = JinHuaAsset.mainSwf().createSprite("spr_end_item");
				InterfaceVariablesUtil.initVariables(this,item);
				item.x = xoff;
				item.y = index * 85 + index * 2 + yoff;
				if(uid == this.winner){
					this.dayingjia.visible = true;
				}else{
					this.dayingjia.visible = false;
				}
				if(index == (length-1)){
					this.endItemLine.visible = false;
				}else{
					this.endItemLine.visible = true;
				}
				this.addChild(item);
			
				roleInfo = JinHuaRoleData.getRole(uid);
				headImage = new RoleHeadImage(roleInfo);
				headImage.width = headImage.height = 64;
				headImage.x = 8;
				headImage.y = 8;
				item.addChild(headImage);

				var m:number = game.money[uid];
				if(JinHuaRoleData.getRole(uid) != null){
					item.getTextField("nameText").text = JinHuaRoleData.getRole(uid).name;
				}
				item.getTextField("moneyText").text = m.toString();
				if(m >= 0){
					item.getTextField("moneyText").textColor = 0xF8C17B;
					item.getTextField("nameText").textColor =0x7DFB56;
				}else{
					item.getTextField("moneyText").textColor = 0x64EBFF;
					item.getTextField("nameText").textColor =0xE5F3F6;
				}
				index++;
			}
		}

		public on_fanhuiBtn(e:egret.Event):void{
			ExtGameHelper.exitExtGamePanel();
		}
		public on_paradeBtn(e:egret.Event):void{
			ExtGameHelper.showShareTip();

		}

        public mainAssetName(): string{
			return "spr_end";
		}
        public assetSwf(): starlingswf.Swf{
			return JinHuaAsset.mainSwf();
		}

	}
}