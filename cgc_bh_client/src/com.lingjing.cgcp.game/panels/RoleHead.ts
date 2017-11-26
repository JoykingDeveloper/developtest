module lj.cgcp.game.baohuang {

	export class RoleHead {
		public mainAsset:starlingswf.SwfSprite;
		public uid:string;
		public selfUid:string;

		public readyState:egret.DisplayObject;
		public currentState:starlingswf.SwfSprite;
		public timeClick:TimeDown;
		public imgRank:egret.Bitmap;
		public moneyText:egret.TextField;
		// public nameText:egret.TextField;
		public headImage:RoleHeadImage;
		/**侍卫*/
		public jobImage1:egret.DisplayObject;
		/**革命党*/
		public jobImage2:egret.DisplayObject;
		/**皇帝*/
		public jobImage3:egret.DisplayObject;
		//身份不明
		public unknow:egret.DisplayObject;

		public selfcardbg1:egret.DisplayObject;
		public selfcardbg2:egret.DisplayObject;
		public selfcardcount:egret.TextField;

		public isDu:egret.DisplayObject;
		public qianghuangText:egret.DisplayObject;

		public killBtn:starlingswf.SwfButton;

		public roleInfo:Role;

		public leaveState:egret.DisplayObject;

		public outcardsObjs = [];
		public overcardsObjs = [];
		public constructor(mainAsset:starlingswf.SwfSprite) {
			InterfaceVariablesUtil.initVariables(this,mainAsset);
			this.mainAsset = mainAsset;

			this.selfUid = RoleData.getRole().uid;
			this.leaveState.visible = false;
		}
		public on_killBtn(e:egret.Event){
			 ExtGameHelper.kick(this.uid);
		}
		public initData(uid:string){
			if(this.uid == uid){
				return;
			}
			this.uid = uid;
			this.roleInfo = BHRoleData.getRole(this.uid);
			// this.nameText.text = this.roleInfo.name;
			if(this.headImage == null){
				this.headImage = new RoleHeadImage(this.roleInfo,true);
				this.mainAsset.addChildAt(this.headImage,3);
			}else{
				this.headImage.reloadByRole(this.roleInfo);
			}
			this.headImage.x = 4;
			this.headImage.y = 4;
			this.headImage.width = 78;
			this.headImage.height = 78;
			this.updateShowOutCard(false);
			if(this.imgRank == null){
				this.imgRank = BHAsset.mainSwf().createImage("img_BH_TB1");
				this.imgRank.x = this.readyState.x;
				this.imgRank.y = this.readyState.y;
				this.mainAsset.addChild(this.imgRank);
			}
			if(this.timeClick == null){
				this.timeClick = new TimeDown(this.currentState);
			}
			var offLineData = RoomData.getCurrentRoomOffline();
			if(offLineData[uid]){
				this.leaveState.visible = true;
				ColorUtil.setGray(this.mainAsset);
			}
			
		}

		public showReady(){
			this.readyState.visible = true;
			this.showOverCards(false);
			this.updateShowOutCard(false);
		}
			

		public show(){
			this.mainAsset.visible = true;
			var room:Room = RoomData.getCurrentRoom();
			var game:BHGame = BHGameData.getCurrentGame();
			
			this.isDu.visible = false;
			this.qianghuangText.visible = false;
			if(this.uid != this.selfUid ){
				if(this.selfUid == room.owner && game.currentCount == 1 && game.currentState == 0){
					this.killBtn.visible = true;
				}else{
					this.killBtn.visible = false;
				}
				if(game.currentState == 3 && game.cardsInfo[this.uid] <= 10){
					this.selfcardbg1.visible = true;
					this.selfcardbg2.visible = true;
					this.selfcardcount.visible = true;
					var count:number = game.cardsInfo[this.uid];
					this.selfcardcount.text = count.toString();
				}else{
					this.selfcardbg1.visible = false;
					this.selfcardbg2.visible = false;
					this.selfcardcount.visible = false;
				}
			}
			if(game.currentUid == null){
				this.updateCurrentState(false);
			}else{
				if(game.currentState == 1){
					this.updateCurrentState(this.uid != game.currentUid && (game.zaofan == null || game.zaofan[this.uid] == null));
				}else{
					this.updateCurrentState(this.uid == game.currentUid);
				}
			}
			if(game.zaofan != null && game.zaofan[this.uid] != null && game.zaofan[this.uid] == 1 && game.emperorUid == null){
				this.qianghuangText.visible = true;
			}
			this.updateMoney();
			if(game.currentState == 0){
				if(game.cards != null){
					this.showOverCards(true);
					this.updateShowOutCard(false);
				}
				if(game.ready != null && game.ready[this.uid]){
					this.readyState.visible = true;
				}else{
					this.readyState.visible = false;
				}
				this.currentState.visible = false;
			}else{
				this.readyState.visible = false;
			}

			//身份显示
			this.jobImage1.visible = false;//保子
			this.jobImage2.visible = false;//反皇
			this.jobImage3.visible = false;//皇帝
			this.unknow.visible = false;
			if(game.emperorUid != null){
				if(game.emperorUid == this.uid){
					this.jobImage3.visible = true;
				}else{
					if(game.isQiangDu == 1){
						if(game.isMingBao == 1){
							this.jobImage2.visible = true;
						}else{
							this.unknow.visible = true;
						}
					}else{
						if(game.isMingBao == 1){
							if(game.guardUid == this.uid){
								this.jobImage1.visible = true;
							}else{
								this.jobImage2.visible = true;
							}
						}else{
							this.unknow.visible = true;
						}
					}
				}
			}
			// this.jobImage1.visible = game.guardUid!=null && game.isMingBao == 1 && game.guardUid == this.uid && game.isQiangDu != 1;
			// this.jobImage3.visible = game.emperorUid!=null && game.emperorUid == this.uid;
			//出牌阶段
			if(game.currentState == 3){
				this.updateShowOutCard(false);
				if(game.outCards == null){
				}else if(game.outCards[this.uid] != null && game.currentUid != this.uid){
					//显示出过的牌
					this.updateShowOutCard(true);
				}
				if(game.emperorUid == this.uid && game.isQiangDu == 1 && game.isMingBao == 1){//times等于1时是暗独，不用isMingBao来判断是为了，出牌影响isMingBao的值
					this.isDu.visible = true;
				}else{
					this.isDu.visible = false;
				}
				
			}
			//显示走完了的顺序
			this.showEndQueues((game.endQueues != null && game.endQueues[this.uid] != null && game.currentState == 3)?game.endQueues[this.uid]:0);

		}

		public hide(){
			this.mainAsset.visible = false;
		}
		public updateCurrentState(isshow:boolean):void{
			this.currentState.visible = isshow;
			if(isshow){
				this.timeClick.show();
			}else{
				this.timeClick.hide();
			}
		}
		public showEndQueues(index:number = 0):void{
			this.imgRank.visible = index != 0;
			if(index<1 || index>5){
				return;
			}
			this.imgRank.texture = BHAsset.mainSwf().createImage("img_BH_TB"+index).texture;
		}
		public showStateText(resName:string):void{
			var image:egret.Bitmap = BHAsset.mainSwf().createImage(resName);
			if(image == null)return;
			image.x = this.readyState.x;
			image.y = this.readyState.y + image.height - (this.mainAsset.name == "head1"?180:0);
			image.scaleX = image.scaleY = 0.1;
			this.mainAsset.addChild(image);
			egret.Tween.get(image).to({scaleX:1,scaleY:1},250,egret.Ease.backOut).call(function(target:egret.DisplayObject){
				egret.Tween.get(target).to({y:target.y-70},550).call(function(target1:egret.DisplayObject){
					target1.parent.removeChild(target1);
				},this,[target]);
			},this,[image]);
			
		}
		/**
		 * 显示出牌信息
		*/
		public updateShowOutCard(isshow:boolean){
			if(!isshow){
				if(this.outcardsObjs.length > 0){
					//移除
					for(var i=0;i<this.outcardsObjs.length;i++){
						var p:PokerPai = this.outcardsObjs[i];
						this.mainAsset.removeChild(p);
					}
					this.outcardsObjs = [];
				}
			}else{
				var game:BHGame = BHGameData.getCurrentGame();
				var outcards = [];
				outcards = game.outCards[this.uid];
				outcards = PokerUtil.sortCards1(outcards);
				var startX:number = 0;
				var startY:number = 0;
				if(this.mainAsset.name == "head1"){
					startX = this.readyState.x - (outcards.length > 10? 10:outcards.length) *25/2 + this.readyState.width * 0.2;
					startY = this.readyState.y + (game.perUid == this.uid?120:0) - 200;
				}else if(this.mainAsset.name == "head2" || this.mainAsset.name == "head3"){
					startX = this.readyState.x - outcards.length*20  + (game.perUid == this.uid?120:0) + 50;
					startY = this.readyState.y;
				}else{
					startX = this. readyState.x + this.readyState.width*0.8 -(game.perUid == this.uid?120:0) - 64;
					startY = this.readyState.y + 6;
				}
				for(var i=0;i<outcards.length;i++){
					var p:PokerPai = new PokerPai(outcards[outcards.length - 1 - i],0);
					if(i == outcards.length -1 && this.uid == BHGameData.getCurrentGame().emperorUid){// && this.selfUid == DouDiZhuGameData.getCurrentGame().dizhuUid
						p.showDizhuLogo();
					}
					p.x = startX+(i>9?i-9:i)*(this.mainAsset.name == "head1"? 25:20);
					p.y = i>9?startY+60:startY;
					
					p.scaleX = this.mainAsset.name == "head1"? 0.7:0.5;
					p.scaleY = this.mainAsset.name == "head1"? 0.7:0.5;
					this.outcardsObjs.push(p);
					this.mainAsset.addChild(p);
					if(game.perUid == this.uid){
						if(this.mainAsset.y > 400){
							egret.Tween.get(p).to({y:p.y - 120},210,egret.Ease.backOut);
						}else if(this.mainAsset.x>200){
							egret.Tween.get(p).to({x:p.x - 120},210,egret.Ease.backOut);
						}else{
							egret.Tween.get(p).to({x:p.x + 120},210,egret.Ease.backOut);
						}
					}
				}
			}
		}
		/**
		 * 当局结束显示剩余牌
		*/
		public showOverCards(isshow:boolean){
			if(!isshow){
				if(this.overcardsObjs.length > 0){
					//移除
					for(var i=0;i<this.overcardsObjs.length;i++){
						var p:PokerPai = this.overcardsObjs[i];
						this.mainAsset.removeChild(p);
					}
					this.overcardsObjs = [];
				}
			}else{
				var overcards = [];
				overcards = BHGameData.getCurrentGame().cards[this.uid];
				overcards = PokerUtil.sortCards(overcards);
				var startX:number = 0;
				var startY:number = 0;
				if(this.mainAsset.name == "head1"){
					startX = this.readyState.x - (overcards.length > 10? 10:overcards.length) *20/2;
					startY = this.readyState.y -200;
				}else if(this.mainAsset.name == "head2" || this.mainAsset.name == "head3"){
					startX = this.readyState.x - (overcards.length > 10? 10:overcards.length)*20 + this.readyState.width*0.6;
					startY = this.readyState.y + 60;
				}else{
					startX = this.readyState.x;
					startY = this.readyState.y + 66;
				}
				for(var i=0;i<overcards.length;i++){
					var p:PokerPai = new PokerPai(overcards[i],0);
					if(i == overcards.length -1 && this.uid == BHGameData.getCurrentGame().emperorUid){
						p.showDizhuLogo();
					}
					p.x = startX+(i>9?i-9:i)*18;
					p.y = i>9?startY:startY-60;
					p.scaleX = 0.48;
					p.scaleY = 0.48;
					this.overcardsObjs.push(p);
					this.mainAsset.addChild(p);
				}
			}
		}
		public updateMoney(){
			var game:BHGame = BHGameData.getCurrentGame();
			if(game.money != null && game.money[this.uid]){
				this.moneyText.text = game.money[this.uid];
			}else{
				this.moneyText.text = "0";
			}
		}
		
		
		public dispose():void{
		}

	}

}