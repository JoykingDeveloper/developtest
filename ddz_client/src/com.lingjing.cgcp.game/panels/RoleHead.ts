module lj.cgcp.game.doudizhu {

	export class RoleHead {
		public static ONCLICKTIMER:string = "onclicktimer";
		public mainAsset:starlingswf.SwfSprite;
		public uid:string;
		public selfUid:string;

		public headiconbg:egret.DisplayObject;
		public readyState:egret.DisplayObject;
		public isDizhu:egret.DisplayObject;
		public isMan:egret.DisplayObject;
		public isWoman:egret.DisplayObject;
		public warn:egret.DisplayObject;
		public warn_1:egret.DisplayObject;
		public currentState:egret.DisplayObject;

		public pokerbg:egret.DisplayObject;
		public selfCards:egret.DisplayObject;
		public selfCardsText:egret.TextField;
		public nameText:egret.TextField;
		public moneyText:egret.TextField;
		public stateText:egret.Bitmap;
		public headImage:RoleHeadImage;

		public killBtn:starlingswf.SwfButton;

		public currentTime:number = 0;
		public timeAngle:number;
		public timer:egret.Timer;
		public roleInfo:Role;

		public isWarning:boolean = false;
		public leaveState:egret.DisplayObject;
		
		public outCardContanier:egret.DisplayObjectContainer;
		public overCardContanier:egret.DisplayObjectContainer;

		public constructor(mainAsset:starlingswf.SwfSprite) {
			InterfaceVariablesUtil.initVariables(this,mainAsset);
			this.mainAsset = mainAsset;

			this.selfUid = RoleData.getRole().uid;
			this.leaveState.visible = false;
			this.timer = new egret.Timer(1000,0);
			this.timer.addEventListener(egret.TimerEvent.TIMER,this.onTimer,this)
			this.timer.reset();
			this.timer.start();
			this.outCardContanier = new egret.DisplayObjectContainer();
			this.mainAsset.addChild(this.outCardContanier);
			this.overCardContanier = new egret.DisplayObjectContainer();
			this.mainAsset.addChild(this.overCardContanier);
		}
		public onTimer(e:egret.TimerEvent){
			this.currentTime++;
			if(this.currentTime%2==0 && this.mainAsset.visible && this.isDizhu.visible){
				egret.Tween.get(this.isDizhu).to({y:this.isDizhu.y-20},200,egret.Ease.backOut).call(function():void{
					egret.Tween.get(this.isDizhu).to({y:this.isDizhu.y+20},200);
				},this);
			}
			if(this.mainAsset.visible && this.currentState.visible){
				var obj:egret.DisplayObject = (this.currentState as egret.DisplayObjectContainer).getChildAt(1);
				egret.Tween.get(obj).to({y:obj.y+15,scaleX:1.2,scaleY:1.2},300,egret.Ease.backOut).call(function():void{
					egret.Tween.get(obj).to({y:obj.y-15,scaleX:1,scaleY:1},300,egret.Ease.backOut);
				},this);
			}
		}
		public on_killBtn(e:egret.Event){
			 ExtGameHelper.kick(this.uid);
		}
		public initData(uid:string){
			if(this.uid == uid){
				return;
			}
			this.uid = uid;
			this.roleInfo = DouDiZhuRoleData.getRole(this.uid);
			this.nameText.text = this.roleInfo.name;
			this.isMan.visible = this.roleInfo.sex == 1;
			this.isWoman.visible = this.roleInfo.sex == 0;
			if(this.headImage == null){
				this.headImage = new RoleHeadImage(this.roleInfo,true);
				this.mainAsset.addChildAt(this.headImage,3);
			}else{
				this.headImage.reloadByRole(this.roleInfo);
			}
			this.headImage.x = this.headiconbg.x + 5;
			this.headImage.y = this.headiconbg.y + 5;
			this.headImage.width = 78;
			this.headImage.height = 78;
			if(this.uid != this.selfUid){
				this.warn.visible = false;
				this.warn_1.visible = false;
			}
			this.updateShowOutCard(false);
			this.showOverCards(false);
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
			var game:DouDiZhuGame = DouDiZhuGameData.getCurrentGame();
			if(this.uid != this.selfUid ){
				if(this.selfUid == room.owner && game.currentCount == 1 && game.currentState == 0){
					this.killBtn.visible = true;
				}else{
					this.killBtn.visible = false;
				}
			}
			if(this.uid != this.selfUid){
				this.warn.visible = false;
				this.warn_1.visible = false;
				this.pokerbg.visible = !(game.currentState == 0);
				this.selfCards.visible = !(game.currentState == 0);
				this.selfCardsText.visible = !(game.currentState == 0);
			}
			this.updateStateText();
			if(game.currentUid == null){
				this.updateCurrentState(false);
			}else{
				  this.updateCurrentState(this.uid == game.currentUid);
			}
			this.updateMoney();
			if(game.dizhuUid != null){
				this.isDizhu.visible = game.dizhuUid == this.uid;
			}else{
				this.isDizhu.visible = false;
			}
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
			if(this.uid == game.currentUid){
				this.updateCurrentState(true);
			}
			//叫地主
			if(game.currentState != 0){
				if(this.uid != this.selfUid){
					var number:string = game.cardsInfo[this.uid];
					var iswarm:any = DouDiZhuGameData.isWarning();
					if(number=="1" &&(iswarm == null || iswarm[this.uid+"_1"] == null) ){
						this.isWarning = true;
						//播放特效
						var mc:starlingswf.SwfMovieClip = DouDiZhuAsset.effSwf().createMovie("mc_baojing_eff");
						mc.x = this.warn.x + this.warn.width/2;
						mc.y = this.warn.y + this.warn.height/2 + 5;
						this.mainAsset.addChild(mc);
						egret.setTimeout(function():void{
							this.mainAsset.removeChild(mc);
							this.isWarning = false;
							this.warn.visible = true;
							this.warn_1.visible = true;
						},this,1500);
					}else if(number=="2" &&(iswarm == null || iswarm[this.uid+"_2"] == null)){
						this.isWarning = true;
						//播放特效
						var mc:starlingswf.SwfMovieClip = DouDiZhuAsset.effSwf().createMovie("mc_baojing_eff");
						mc.x = this.warn.x + this.warn.width/2;
						mc.y = this.warn.y + this.warn.height/2 + 5;
						this.mainAsset.addChild(mc);
						egret.setTimeout(function():void{
							this.mainAsset.removeChild(mc);
							this.isWarning = false;
							this.warn.visible = true;
							this.warn_1.visible = true;
						},this,1500);
					}else if(!this.isWarning){
						this.warn.visible = number == "1" || number == "2";
						this.warn_1.visible = number == "1" || number == "2";
					}
					this.pokerbg.visible = true;
					this.selfCards.visible = true;
					this.selfCardsText.visible = true;
					this.selfCardsText.text = number;
				}
			}
			//出牌阶段
			if(game.currentState == 2){
				if(this.uid == game.dizhuUid){
					this.isDizhu.visible = true;
				}
				this.updateShowOutCard(false);
				if(game.outCards == null){
					this.stateText.visible = false;
				}else if(game.outCards[this.uid] != null && game.currentUid != this.uid){
					//显示出过的牌
					this.updateShowOutCard(true);
				}
				
				
			}
			

		}

		public hide(){
			this.mainAsset.visible = false;
		}
		public updateCurrentState(isshow:boolean):void{
			this.currentState.visible = isshow;
		}
		public showScore(senderuid:string){
			var game:DouDiZhuGame = DouDiZhuGameData.getCurrentGame();
			if(game.score != null && game.score[this.uid] != null && this.uid == senderuid){
				var image:egret.Bitmap;
				switch(game.score[this.uid]){
					case 0:
					image = DouDiZhuAsset.mainSwf().createImage("img_DDZ_WZ4");
					break;
					case 1:
					image = DouDiZhuAsset.mainSwf().createImage("img_DDZ_WZ7");
					break;
					case 2:
					image = DouDiZhuAsset.mainSwf().createImage("img_DDZ_WZ8");
					break;
					case 3:
					image = DouDiZhuAsset.mainSwf().createImage("img_DDZ_WZ9");
					break;
				}

				image.x = this.stateText.x;
				image.y = this.uid == this.selfUid?this.stateText.y - 20:this.stateText.y;
				image.scaleX = image.scaleY = 0.2;
				this.mainAsset.addChild(image);
				egret.Tween.get(image).to({scaleX:1,scaleY:1},300,egret.Ease.backOut).call(function(target0:egret.DisplayObject):void{
					egret.Tween.get(target0).to({y:image.y - 60},700).call(function(target:egret.TextField):void{
						target.parent.removeChild(target);
					},this,[target0]);
				},this,[image]);
				
			}

		}
		public updateStateText(){
			var game:DouDiZhuGame = DouDiZhuGameData.getCurrentGame();
			this.stateText.visible = false;
			if(game.currentState == 2){
				if(game.outCards == null || game.outCards[game.currentUid]!=null){
					return;
				}
				var perOutUid;
				for(var k in game.outCards){
					perOutUid = k;
				}
				if(perOutUid != this.uid){
					this.stateText.texture = DouDiZhuAsset.mainSwf().createImage("img_DDZ_WZ5").texture;
				}
				if(this.uid == game.perUid){
					if(game.outCards[this.uid] != null){
						this.stateText.visible = false;
					}else{
					this.stateText.texture = DouDiZhuAsset.mainSwf().createImage("img_DDZ_WZ5").texture;
						this.stateText.visible = true;
					}
				}
			}
		}
		/**
		 * 显示出牌信息
		*/
		public updateShowOutCard(isshow:boolean){
			if(!isshow){
				this.outCardContanier.removeChildren();
			}else{
				var game:DouDiZhuGame = DouDiZhuGameData.getCurrentGame();
				var outcards = [];
				outcards = game.outCards[this.uid];
				outcards = PokerUtil.sortCards1(outcards);
				var startX:number = 0;
				var startY:number = 0;
				if(this.mainAsset.y >400){
					startX = this.readyState.x - (outcards.length > 10? 10:outcards.length) *30/2;
					startY = this.readyState.y + (game.perUid == this.uid?120:0);
				}else if(this.mainAsset.x > 200){
					startX = this.selfCards.x - (outcards.length > 10? 10:outcards.length)*23 - this.selfCards.width * 1.6 + (game.perUid == this.uid?120:0) - 18;
					startY = this.selfCards.y - 50;
				}else{
					startX = this. selfCards.x + this.selfCards.width*0.8 -(game.perUid == this.uid?120:0) + 10;
					startY = this.selfCards.y - 50;
				}
				for(var i=0;i<outcards.length;i++){
					var p:PokerPai = new PokerPai(outcards[outcards.length - 1 - i],0);
					if(i == outcards.length -1 && this.uid == DouDiZhuGameData.getCurrentGame().dizhuUid){// && this.selfUid == DouDiZhuGameData.getCurrentGame().dizhuUid
						p.showDizhuLogo();
					}
					p.x = startX+(i>9?i-9:i)*(this.mainAsset.y > 400? 30:23);
					p.y = i>9?startY+60:startY;
					
					p.scaleX = this.mainAsset.y > 400? 0.8:0.6;
					p.scaleY = this.mainAsset.y > 400? 0.8:0.6;
					this.outCardContanier.addChild(p);
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
				this.overCardContanier.removeChildren();
			}else{
				var overcards = [];
				overcards = DouDiZhuGameData.getCurrentGame().cards[this.uid];
				overcards = PokerUtil.sortCards(overcards);
				var startX:number = 0;
				var startY:number = 0;
				if(this.mainAsset.y > 400){
					startX = this.readyState.x - (overcards.length > 10? 10:overcards.length) *20/2;
					startY = this.readyState.y + 100;
				}else if(this.mainAsset.x > 200){
					startX = this.readyState.x - (overcards.length > 10? 10:overcards.length)*23 + this.selfCards.width*0.3;
					startY = this.readyState.y + 160;
				}else{
					startX = 15;
					startY = this.readyState.y + 160;
				}
				for(var i=0;i<overcards.length;i++){
					var p:PokerPai = new PokerPai(overcards[i],0);
					if(i == overcards.length -1 && this.uid == DouDiZhuGameData.getCurrentGame().dizhuUid){
						p.showDizhuLogo();
					}
					p.x = startX+(i>9?i-9:i)*23;
					p.y = i>9?startY:startY-60;
					p.scaleX = 0.6;
					p.scaleY = 0.6;
					this.overCardContanier.addChild(p);
				}
			}
		}
		public updateMoney(){
			var game:DouDiZhuGame = DouDiZhuGameData.getCurrentGame();
			if(game.money != null && game.money[this.uid]){
				this.moneyText.text = game.money[this.uid];
			}else{
				this.moneyText.text = "0";
			}
		}
		
		
		public dispose():void{
			if(this.timer.running){
				this.timer.stop();
			}
			this.timer.removeEventListener(egret.TimerEvent.TIMER,this.onTimer,this);
			
		}

	}

}