module lj.cgcp.game.jinhua {

	export class RoleHead {

		public mainAsset:starlingswf.SwfSprite;
		public uid:string;
		public selfUid:string;

		public qipai:egret.DisplayObject;
		public morenPai:egret.DisplayObject;
		public yikanpai:egret.DisplayObject;
		public readyState:egret.DisplayObject;
		
		public nameText:egret.TextField;
		public moneyText:egret.TextField;
		public headImage:RoleHeadImage;

		public shouzhiMc:egret.DisplayObject;
		public kickBtn:starlingswf.SwfButton;
		public stateMc:starlingswf.SwfMovieClip;
		public timeDownShape:egret.Shape;
		public currentTime:number = 0;
		public totalTime:number = 30000;
		public timeAngle:number;

		public roleInfo:Role;

		public leaveState:egret.DisplayObject;

		public constructor(mainAsset:starlingswf.SwfSprite) {
			InterfaceVariablesUtil.initVariables(this,mainAsset);
			this.mainAsset = mainAsset;

			this.moneyText.stroke = 1;
			this.moneyText.strokeColor = 0x000000;
			this.selfUid = RoleData.getRole().uid;
			if(this.shouzhiMc != null){
				this.shouzhiMc.visible = false;
			}
			this.stateMc.visible = false;

			this.timeDownShape = new egret.Shape();
			this.timeDownShape.rotation = -90;
			this.mainAsset.addChild(this.timeDownShape);
			this.mainAsset.getChildByName("timeDown").mask = this.timeDownShape;

			this.leaveState.visible = false;
		}

		public initData(uid:string){
			if(this.uid == uid){
				return;
			}
			this.uid = uid;
			this.roleInfo = JinHuaRoleData.getRole(this.uid);
			this.nameText.text = this.roleInfo.name;
			if(this.headImage == null){
				this.headImage = new RoleHeadImage(this.roleInfo,true);
				this.mainAsset.addChildAt(this.headImage,1);
			}else{
				this.headImage.reloadByRole(this.roleInfo);
			}
			this.headImage.x = -31;
			this.headImage.y = -31;
			this.headImage.width = 80;
			this.headImage.height = 80;

			this.leaveState.visible = false;
			var offLineData = RoomData.getCurrentRoomOffline();
			if(offLineData[uid]){
				this.leaveState.visible = true;
			}
		}

		public showQiPai(){
			if(this.uid == this.selfUid) return;
			this.morenPai.visible = false;
			this.qipai.visible = true;
			this.yikanpai.visible = false;
			this.stateMc.visible = true;
			this.stateMc.gotoAndStop(3);
		}

		public showMorenPai(){
			this.readyState.visible = false;

			if(this.uid == this.selfUid) return;
			this.morenPai.visible = true;
			this.qipai.visible = false;
			this.yikanpai.visible = false;
		}

		public showYikanpai(){
			if(this.uid == this.selfUid) return;
			this.morenPai.visible = false;
			this.qipai.visible = false;
			this.yikanpai.visible = true;
			this.stateMc.visible = true;
			this.stateMc.gotoAndStop(0);
		}

		public showReady(){
			this.readyState.visible = true;
		}

		public show(){
			var owner = RoomData.getCurrentRoom().owner;
			this.mainAsset.visible = true;
			this.stateMc.visible = false;
			if(this.uid != this.selfUid && this.uid != owner && this.selfUid == owner){
				this.kickBtn.visible = true;
			}else{
				this.kickBtn.visible = false;
			}
			var game:JinHuaGame = JinHuaGameData.getCurrentGame();
			this.updateMoney();

			if(!game.isStart){
				if(game.ready != null && game.ready[this.uid]){
					this.readyState.visible = true;
				}else{
					this.readyState.visible = false;
				}
			}else{
				this.readyState.visible = false;
				if(this.uid == game.currentUid){
					this.startTimeDown();
				}
			}
			

			if(!game.isStart){
				if(this.uid != this.selfUid){
					this.morenPai.visible = false;
					this.qipai.visible = false;
					this.yikanpai.visible = false;
				}
				
			}else if(game.giveup != null && game.giveup[this.uid]){
				this.showQiPai();
			}else if(game.see != null && game.see[this.uid]){
				this.showYikanpai();
			}else{
				this.showMorenPai();
			}
		}

		public on_kickBtn(e:egret.Event){
			 ExtGameHelper.kick(this.uid);
		}


		public hide(){
			this.mainAsset.visible = false;
		}

		public hideKickBtn(){
			this.kickBtn.visible = false;
		}
		

		public updateMoney(){
			var game:JinHuaGame = JinHuaGameData.getCurrentGame();
			if(game.money != null && game.money[this.uid]){
				this.moneyText.text = game.money[this.uid];
			}else{
				this.moneyText.text = "0";
			}
		}
		
		public startTimeDown(){
			this.stateMc.visible = false;
			this.currentTime = 0;
			egret.Ticker.getInstance().register(this.updateTimeDown,this);
			if(this.uid == this.selfUid){
				SoundManager.playGameSound( "time.mp3",0);
			}
			
		}

		public stopTimeDown(){
			this.timeDownShape.graphics.clear();
			egret.Ticker.getInstance().unregister(this.updateTimeDown,this);
			if(this.uid == this.selfUid){
				SoundManager.stopGameSound( "time.mp3");
			}
			
		}

		public updateTimeDown(timeStamp:number){
			this.currentTime += timeStamp;
			this.timeAngle = (this.currentTime / this.totalTime) * 360;

			this.timeDownShape.graphics.clear();
			this.timeDownShape.graphics.beginFill(0x00ffff, 1);
			this.timeDownShape.graphics.moveTo(0, 0);
			this.timeDownShape.graphics.lineTo(100, 0);
			this.timeDownShape.graphics.drawArc(0, 0, 100, 0, this.timeAngle * Math.PI / 180, false);
			this.timeDownShape.graphics.lineTo(0, 0);
			this.timeDownShape.graphics.endFill();			

			return false;
		}


	}

}