module lj.cgcp.game.doudizhu {
	export class EndPanel extends BasePanel {
		public mainAsset:starlingswf.SwfSprite;
		public backBtn:starlingswf.SwfButton;
		public paradeBtn:starlingswf.SwfButton;

		public nameText0:egret.TextField;
		public nameText1:egret.TextField;
		public nameText2:egret.TextField;
		public money0:egret.TextField;
		public money1:egret.TextField;
		public money2:egret.TextField;
		public win0:egret.DisplayObject;
		public win1:egret.DisplayObject;
		public win2:egret.DisplayObject;

		public lose0:egret.DisplayObject;
		public lose1:egret.DisplayObject;
		public lose2:egret.DisplayObject;

		public constructor() {
			super();
		}
		public addToStage(e:egret.Event){
			this.InitUI();
		}
		public InitUI(){
			 var game:DouDiZhuGame = DouDiZhuGameData.getCurrentGame();
			 if(game.money[RoleData.getRole().uid] > 0){
				 SoundManager.playGameSound("win.mp3",1);
			 }else{
				 SoundManager.playGameSound("lose.mp3",1);
			 }
			 if(game != null && game.money != null){
				var moneys:any = game.money;
				var index:number = 0;
				for(var uid in moneys){
					var roleInfo:Role = DouDiZhuRoleData.getRole(uid);
					switch(index){
						case 0:
						this.nameText0.text = roleInfo.name;
						this.money0.text = moneys[uid].toString();
						this.win0.visible = moneys[uid]>0;
						this.lose0.visible = moneys[uid]<=0;
						if(moneys[uid]>0){
							this.nameText0.textColor = 0xffffff;
							this.money0.textColor = 0xfee31a;
						}else{
							this.nameText0.textColor = 0x90c5f3;
							this.money0.textColor = 0x8ec4f3;
						}
						break;
						case 1:
						this.nameText1.text = roleInfo.name;
						this.money1.text = moneys[uid].toString();
						this.win1.visible = moneys[uid]>0;
						this.lose1.visible = moneys[uid]<=0;
						if(moneys[uid]>0){
							this.nameText1.textColor = 0xffffff;
							this.money1.textColor = 0xfee31a;
						}else{
							this.nameText1.textColor = 0x90c5f3;
							this.money1.textColor = 0x8ec4f3;
						}
						break;
						case 2:
						this.nameText2.text = roleInfo.name;
						this.money2.text = moneys[uid].toString();
						this.win2.visible = moneys[uid]>0;
						this.lose2.visible = moneys[uid]<=0;
						if(moneys[uid]>0){
							this.nameText2.textColor = 0xffffff;
							this.money2.textColor = 0xfee31a;
						}else{
							this.nameText2.textColor = 0x90c5f3;
							this.money2.textColor = 0x8ec4f3;
						}
						break;
					}
					index++;
				}
			}
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
			var title = (game.ruleType == 1?"日照模式:":"传统模式:")+room.id+"房大赢家-"+WxUtils.getShareRoleName(RoomData.getRole(maxWinuid).name)+":"+game.money[maxWinuid];
			Log.log(title);
			var des = "";
			var index = 0;
			for(var uid in game.money){
				index++;
				if(uid != maxWinuid){
					des += WxUtils.getShareRoleName(RoomData.getRole(uid).name)+":"+game.money[uid]+"\n";
				}
			}
			Log.log(des);
			WxUtils.customizeShareDesc(title,des);
		}
		public on_backBtn(e:egret.Event){
			SoundManager.stopGameSound("bgm.mp3");
			ExtGameHelper.exitExtGamePanel();
		}
		public on_paradeBtn(e:egret.Event){
			ExtGameHelper.showShareTip();
		}
		public mainAssetName(): string{
			return "spr_end";
		}

		public assetSwf(): starlingswf.Swf{
			return DouDiZhuAsset.mainSwf();
		}
		public dispose(){
			super.dispose();
		}
		
	}
}