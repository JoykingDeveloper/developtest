module lj.cgcp.game.baohuang {
	export class EndPanel extends BasePanel {
		public mainAsset:starlingswf.SwfSprite;
		public backBtn:starlingswf.SwfButton;
		public paradeBtn:starlingswf.SwfButton;


		public constructor() {
			super();
		}
		public addToStage(e:egret.Event){
			this.InitUI();
		}
		public InitUI(){
			 var game:BHGame = BHGameData.getCurrentGame();
			//  if(game.money[RoleData.getRole().uid] > 0){
			// 	 SoundManager.playGameSound("win.mp3",1);
			//  }else{
			// 	 SoundManager.playGameSound("lose.mp3",1);
			//  }
			var room:Room = RoomData.getCurrentRoom();
			var maxWinuid = "";
			for(var uid in game.money){
				if(maxWinuid == ""){
					maxWinuid = uid;
					continue;
				}
				if(game.money[uid]>game.money[maxWinuid]){
					maxWinuid = uid;
				}
			}
			 if(game != null && game.money != null){
				var moneys:any = game.money;
				var startX:number = 36;
				var startY:number = 63;
				var padingX:number = -3;
				var index:number = 0;
				for(var uid in moneys){
					var roleInfo:Role = BHRoleData.getRole(uid);
					var item:starlingswf.SwfSprite = this.createItem(uid == room.owner,maxWinuid == uid,roleInfo,moneys[uid]);
					item.x = startX+item.width*index+padingX*index;
					item.y = startY;
					this.mainAsset.addChildAt(item,2);
					index++;
				}
			}
			
			var title = room.id+"房大赢家-"+WxUtils.getShareRoleName(RoomData.getRole(maxWinuid).name)+":"+game.money[maxWinuid];
			Log.log(title);
			var des = "";
			var index = 0;
			for(var uid in game.money){
				index++;
				if(uid != maxWinuid){
					des += WxUtils.getShareRoleName(RoomData.getRole(uid).name)+":"+game.money[uid]+"; ";
				}
			}
			Log.log(des);
			WxUtils.customizeShareDesc(title,des);
		}

		public createItem(isower:boolean,ismaxWin:boolean,roleInfo:Role,score:number):starlingswf.SwfSprite{
			
			var item:starlingswf.SwfSprite = BHAsset.mainSwf().createSprite("spr_items");
			var isOwer0:egret.DisplayObject = item.getChildByName("isOwer0");
			var isOwer1:egret.DisplayObject = item.getChildByName("isOwer1");
			isOwer0.visible = isower;
			isOwer1.visible = isower;
			var maxWin:egret.DisplayObject = item.getChildByName("maxWin");
			maxWin.visible = ismaxWin;
			var headbg:egret.DisplayObject = item.getChildByName("headbg");

			var headImage:RoleHeadImage = new RoleHeadImage(roleInfo,true);
			item.addChildAt(headImage,3);
			headImage.x = headbg.x+4;
			headImage.y = headbg.y+4;
			headImage.width = 72;
			headImage.height = 72;
			var nametext:egret.TextField = item.getTextField("nameText");
			nametext.text = roleInfo.name;
			var scoretext:egret.TextField = item.getTextField("scoreText");
			scoretext.textColor = (score>0?0xF6C86C:0xAFB6F4);
			scoretext.text = score.toString();
			// var win:egret.DisplayObject = item.getChildByName("win");
			// win.visible = score>0;
			// var lose:egret.DisplayObject = item.getChildByName("lose");
			// lose.visible = score<=0;
			return item;
		}
		public on_backBtn(e:egret.Event){
			SoundManager.stopGameSound("beijing.mp3");
			ExtGameHelper.exitExtGamePanel();
		}
		public on_paradeBtn(e:egret.Event){
			ExtGameHelper.showShareTip();
		}
		public mainAssetName(): string{
			return "spr_end";
		}

		public assetSwf(): starlingswf.Swf{
			return BHAsset.mainSwf();
		}
		public dispose(){
			super.dispose();
		}
		
	}
}