module lj.cgcp.game.doudizhu {
	export class GamePanel extends BasePanel {

		public dataParse:GamePanelDataParse;
		public fanghaoText:egret.TextField;
		public fangzhuName:egret.TextField;
		public difenText:egret.TextField;
		public beishuText:egret.TextField;
		public roleHeads:any;
		public lunshuText:egret.TextField;
		public timedown:TimeDown;
		public rulestate:egret.TextField;
		public pokerPanel:PokerPanel;
		//准备按钮
		public inviteBtn:starlingswf.SwfButton;
		public readyBtn:starlingswf.SwfButton;
		//出牌按钮
		public chupaiBtn:starlingswf.SwfButton;
		public buchuBtn:starlingswf.SwfButton;
		public tishiBtn:starlingswf.SwfButton;
		public yaobuqiBtn:starlingswf.SwfButton;
		//加倍按钮
		public jiabeiBtn:starlingswf.SwfButton;
		public bujiabeiBtn:starlingswf.SwfButton;
		//叫地主
		public qiangdizhu1Btn:starlingswf.SwfButton;
		public qiangdizhu2Btn:starlingswf.SwfButton;
		public qiangdizhu3Btn:starlingswf.SwfButton;
		public buqiangBtn:starlingswf.SwfButton;

		public dizhu0:egret.Bitmap;
		public dizhu1:egret.Bitmap;
		public dizhu2:egret.Bitmap;

		public jiesanBtn:starlingswf.SwfButton;
		public backwechatBtn:starlingswf.SwfButton;

		public voiceBtn:starlingswf.SwfButton;
		public chatBtn:starlingswf.SwfButton;
		public selfUid:string;

		public constructor() {
			super();
			this.selfUid = RoleData.getRole().uid;
			this.dataParse = new GamePanelDataParse(this);
			
		}

		public addToStage(e:egret.Event){
			this.initUi();
			ExtGameHelper.setBackGroundColor(0x326089);
			SoundManager.playBgSound("welcome.mp3");
			this.voiceBtn = VoiceButton.createVoiceButton();
			this.voiceBtn.x = DouDiZhuAsset.gameWidth - this.voiceBtn.width*2.3;
			this.voiceBtn.y = DouDiZhuAsset.gameHeight - this.voiceBtn.height*1.1;
			this.mainAsset.addChild(this.voiceBtn);
			this.chatBtn = ChatButton.createChatButton();
			this.chatBtn.x = DouDiZhuAsset.gameWidth - this.chatBtn.width*1.2;
			this.chatBtn.y = DouDiZhuAsset.gameHeight - this.chatBtn.height*1.1;
			this.mainAsset.addChild(this.chatBtn);
		}

		public initUi(){
			var room:Room = RoomData.getCurrentRoom();
			var game:DouDiZhuGame = DouDiZhuGameData.getCurrentGame();
			var uid:string;
			var ruleStr:string = "";
			if(game.ruleType == 1){
				ruleStr = "只能三带一";
			}else{
				ruleStr = "";
			}
			this.rulestate.text = ruleStr;
			this.timedown = new TimeDown(this.mainAsset.getSprite("timedown"));
			if(game.currentState == 0){
				this.timedown.hide();
			}else{
				this.timedown.show();
			}
			for(var i:number = 0;i<3;i++){
				var dizhuPoker:egret.Bitmap = (this["dizhu"+i] as egret.Bitmap);
				dizhuPoker.anchorOffsetX = dizhuPoker.width/3;
				dizhuPoker.anchorOffsetY = dizhuPoker.height/2;
				dizhuPoker.x += 15;
				dizhuPoker.y += 32;
			}
			this.initHeads();
			this.initPokers();
			
			this.fanghaoText.text = room.id.toString();
			uid = room.owner.toString();
			this.fangzhuName.text = DouDiZhuRoleData.getRole(uid).name;
			if(this.selfUid != room.owner){
				//开始按钮变为准备
				var bg:egret.Bitmap = (this.readyBtn.skin as egret.DisplayObjectContainer).getChildAt(0) as egret.Bitmap;
				bg.width = 150;
				var wz:egret.Bitmap = (this.readyBtn.skin as egret.DisplayObjectContainer).getChildAt(1) as egret.Bitmap;
				wz.texture = DouDiZhuAsset.mainSwf().createImage("img_DDZ_WZ20").texture;
				wz.x = this.readyBtn.width/2 - wz.width/2;
				this.readyBtn.x = DouDiZhuAsset.gameWidth/2-this.readyBtn.width/2;
				this.inviteBtn.x = DouDiZhuAsset.gameWidth/2 - this.inviteBtn.width/2;
			}
			
			this.inviteBtn.visible = game.currentState == 0 && game.currentCount == 1;
			if(game.ready != null && game.ready[this.selfUid] || game.currentState != 0){
				this.readyBtn.visible = false;
			}else{
				this.readyBtn.visible = true;
			}
			this.updateLunshuText();
			
		}

		/**
		 * 初始化头像信息
		 */
		private initHeads(){
			if(this.roleHeads == null){
				this.roleHeads = {};
				var headAsset:starlingswf.SwfSprite;
				var head:RoleHead;
				for(var i:number = 1; i < 4 ; i++){
					headAsset = this.mainAsset.getSprite("head" + i);
					head = new RoleHead(headAsset);
					this.roleHeads[i] = head;
				}
			}
			// this.addEventListener(RoleHead.ONCLICKTIMER,this.onclicktimer,this);
			this.updateHeads();
		}
		private onclicktimer(){
			var game:DouDiZhuGame = DouDiZhuGameData.getCurrentGame();
			//根据游戏阶段判断响应什么处理
			if(game.currentState == 1){
				//不抢地主
				if(game.currentUid == this.selfUid){
					DouDiZhuGameApi.score(0);
					this.updatejiaoDizhuBtns(false);
				}
			}
			if(game.currentState == 2){
				//不出牌
				if(game.currentUid == this.selfUid){
					var outcard = DouDiZhuGameData.getCurrentGame().outCards;
					if(outcard == null || outcard[this.selfUid] != null){
						//必须出牌
						var all = [];
						all = DouDiZhuGameData.getMyPokers();
						all = PokerUtil.sortCards(all);
						var poker = [];
						poker.push( all[all.length-1]);
						DouDiZhuGameApi.chupai(poker);
						this.updatechupaiBtns(false);
					}else{
						DouDiZhuGameApi.buchu();
						this.updatechupaiBtns(false);
					}
				}
			}
		}
		public updateHeads(){
			var head:RoleHead;
			for(var i:number = 1; i < 4 ; i++){
				head = this.roleHeads[i];
				head.hide();
			}
			var players = RoomData.getCurrentRoom().players;
			for(var k in players){
				head = this.roleHeads[this.getRoleIndex(players[k])];
				head.initData(players[k]);
				head.show();
			}
			this.updateDifenText();
			this.updateBeishuText();
			this.updateLunshuText();
			this.updateBtns();
		}
		private initPokers():void{
			if(this.pokerPanel == null){
				this.pokerPanel = new PokerPanel(this);
			}else{
				this.pokerPanel.dispose();
				// this.pokerPanel.refreshPoker();
			}
		}

		public updatejiaoDizhuBtns(isshow:boolean){
			var scores = DouDiZhuGameData.getCurrentGame().score;
			this.qiangdizhu1Btn.visible = isshow;
			this.qiangdizhu2Btn.visible = isshow;
			this.qiangdizhu3Btn.visible = isshow;
			//显示是判断是否可点
			if(scores != null){
				for(var k in scores){
					var s:number = scores[k];
					if(s == 1){
						this.qiangdizhu1Btn.setEnable(false);
					}else if(s == 2){
						this.qiangdizhu2Btn.setEnable(false);
						this.qiangdizhu1Btn.setEnable(false);
						break;
					}
				}
			}else{
				this.qiangdizhu2Btn.setEnable(true);
				this.qiangdizhu1Btn.setEnable(true);
			}
			this.buqiangBtn.visible = isshow;
		}
		public updatejiabeiBtns(isshow:boolean){
			this.jiabeiBtn.visible = isshow;
			this.bujiabeiBtn.visible = isshow;	
		}
		public updatechupaiBtns(isshow:boolean){
			this.yaobuqiBtn.visible = false;
			var mycards = DouDiZhuGameData.getMyPokers();
			var outcardsdata = DouDiZhuGameData.getOutPokers();
			var outcard:any = {};
			var advicecards:any = {};
			if(outcardsdata != null && outcardsdata[this.selfUid] == null){
				for(var k in outcardsdata){
					outcard = outcardsdata[k];
					advicecards = PokerUtil.CheckBigPokerByCards(outcard,mycards);
					if( advicecards == null || PokerUtil.getCardsCount(advicecards) == 0){
						this.yaobuqiBtn.visible = isshow;
						if(isshow){
							return;
						}
					}
				}
			}
			this.chupaiBtn.visible = isshow;
			//如果这个时候上个出牌者还是自己，不能不出
			this.buchuBtn.visible = isshow;
			if(outcardsdata == null || outcardsdata[this.selfUid] != null){
				this.buchuBtn.setEnable(false);
			}else{
				this.buchuBtn.setEnable(true);
			}
			this.tishiBtn.visible = isshow;
		}
		public updateDifenText(){
			var game:DouDiZhuGame = DouDiZhuGameData.getCurrentGame();
			this.difenText.text = game.difen.toString();
		}

		public updateBeishuText(){
			var game:DouDiZhuGame = DouDiZhuGameData.getCurrentGame();
			this.beishuText.text = game.beishu.toString();
		}

		public updateLunshuText(){
			var game:DouDiZhuGame = DouDiZhuGameData.getCurrentGame();
			this.lunshuText.text = "第 " + (game.currentCount>game.maxCount?game.maxCount:game.currentCount) + "/" + game.maxCount + " 轮";
		}

		public updateBtns():void{
			var room:Room = RoomData.getCurrentRoom();
			var game:DouDiZhuGame = DouDiZhuGameData.getCurrentGame();
			this.updatejiaoDizhuBtns(false);
			this.updatejiabeiBtns(false);
			this.updatechupaiBtns(false);
			if(game.currentState == 1){//发牌阶段
				if(game.currentUid == this.selfUid){//抢地主阶段
					this.updatejiaoDizhuBtns(true);
				}
			}else if(game.currentState == 2 && game.currentUid == this.selfUid){//出牌阶段
				this.updatechupaiBtns(true);
			}
			
		}
		public updatedizhuPoker(showTween:boolean = false){
			var game:DouDiZhuGame = DouDiZhuGameData.getCurrentGame();
			if(game.currentState == 0){//准备阶段
				this.dizhu0.visible = this.dizhu1.visible = this.dizhu2.visible = false;
			}else if(game.currentState == 1 || showTween){
				var bgTexture:egret.Texture = DouDiZhuAsset.paiSwf().createImage("img_DDZ_PK_BM1").texture;
				for(var i:number = 0;i<3;i++){
					var dizhuPoker:egret.Bitmap = (this["dizhu"+i] as egret.Bitmap);
					dizhuPoker.visible = true;
					dizhuPoker.texture = bgTexture;
					dizhuPoker.scaleX = 0.43;
					dizhuPoker.scaleY = 0.44;
				}
			} 

			if(game.currentState == 2){
				var dizhu:number[][] = game.cardsInfo.dizhuCards;
				for(var i:number = 0;i<dizhu.length;i++){
					var pokerName:string = "img_DDZ_PK_"+(dizhu[i][0] == -1?0:dizhu[i][0])+"_"+dizhu[i][1];
					var pokerTexture:egret.Texture = dizhu[i][0]<3?DouDiZhuAsset.pai1Swf().createImage(pokerName).texture:DouDiZhuAsset.paiSwf().createImage(pokerName).texture;
					var dizhuPoker:egret.Bitmap = (this["dizhu"+i] as egret.Bitmap);
					dizhuPoker.scaleX = 0.43;
					dizhuPoker.scaleY = 0.44;
					if(showTween){
						egret.Tween.get(dizhuPoker).to({scaleX:0.01},500).call(function(callObj:egret.Bitmap,callTexture:egret.Texture):void{
							callObj.texture = callTexture;
							egret.Tween.get(callObj).to({scaleX:0.43},500);
						},this,[dizhuPoker,pokerTexture]);
					}else{
						dizhuPoker.texture = pokerTexture;
					}
				}
				if(DouDiZhuGameData.getCurrentGame().dizhuUid == this.selfUid){
					if(showTween){
						egret.setTimeout(function():void{
							this.pokerPanel.refreshPoker(true);
						},this,1000);
					}else{
						this.pokerPanel.refreshPoker();
					}
				}
			}
		}
		private _showWishPoker():void{
			var arr:Array<egret.Bitmap> = new Array<egret.Bitmap>();
			//创建
			for(var i=0;i<45;i++){
				var img = DouDiZhuAsset.paiSwf().createImage("img_DDZ_PK_BM1");
				img.scaleX = img.scaleY = 0.6;
				img.x =20 + DouDiZhuAsset.gameWidth / 4;
				img.y = DouDiZhuAsset.gameHeight / 3.8;
				arr.push(img);
				this.mainAsset.addChild(img);
				
			}
			//展开
			for(var i =0;i<arr.length;i++){
				egret.Tween.get(arr[i]).to({x:(DouDiZhuAsset.gameWidth-arr.length*10)/2 + i*10 -30},i*(300/arr.length));
			}
			//合拢
			egret.setTimeout(function():void{
				for(var i =0;i<arr.length;i++){
					egret.Tween.get(arr[i]).to({x:DouDiZhuAsset.gameWidth/2 - arr[i].width/2},300).call(function(target:egret.Bitmap):void{//,y:arr[i].y+i
						target.parent.removeChild(target);
					},this,[arr[i]]);
				}
			},this,300);
			//发牌飞牌
			egret.setTimeout(function():void{
				var poker = this.createMovePoker(0,0,0.6,0.75,0);
				SoundManager.playGameSound("fapai.mp3");
				var timer:egret.Timer = new egret.Timer(900 / 20,20);
				var index:number = 0;
				timer.addEventListener(egret.TimerEvent.TIMER,function ontimer():void{
					index++;
					this.createMovePoker(DouDiZhuAsset.gameWidth - 80,0,0.5,0.75,Math.random()*50+180);
					this.createMovePoker(90,0,0.5,0.75,Math.random()*50+180);
					this.createMovePoker(0,DouDiZhuAsset.gameHeight*0.68,0.5,0.75,Math.random()*50+180);
					// this.createMovePoker(DouDiZhuAsset.gameWidth - 80,0,0.5,0.65,0);
					// this.createMovePoker(90,0,0.5,0.65,0);
					// this.createMovePoker(0,DouDiZhuAsset.gameHeight*0.68,0.5,0.70,0);
					if(index == 20){
						timer.removeEventListener(egret.TimerEvent.TIMER,ontimer,this);
						timer.stop();
						this.mainAsset.removeChild(poker);
						egret.setTimeout(function() {
							SoundManager.stopGameSound("fapai.mp3");
						},this,200);
					}
				},this);
				timer.start();
			},this,600);
		}
		private createMovePoker(posX:number,posY:number,scale:number,endscale:number,rotation:number):egret.DisplayObject{
			var bitmap = DouDiZhuAsset.paiSwf().createImage("img_DDZ_PK_BM1");
			bitmap.anchorOffsetX = bitmap.width / 2;
			bitmap.anchorOffsetY = bitmap.height / 2;
			bitmap.scaleX = bitmap.scaleY = scale;
			bitmap.x =DouDiZhuAsset.gameWidth/2;
			bitmap.y = DouDiZhuAsset.gameHeight / 3.8 + bitmap.height / 2;
			this.mainAsset.addChild(bitmap);
			if(posX != 0 || posY != 0){
				egret.Tween.get(bitmap).to({x:(posX==0?bitmap.x:posX),y:(posY==0?bitmap.y:posY),scaleX:endscale,scaleY:endscale,rotation:rotation},200).call(function(target:egret.Bitmap):void{
					target.parent.removeChild(target);
				},this,[bitmap]);
			}
			return bitmap;
		}
		/**
		 * just洗牌表现
		*/
		public showWishPoker(){
			this.inviteBtn.visible = false;
			
			this._showWishPoker();

			egret.setTimeout(function():void{
				this.pokerPanel.InitPoker();
				this.addEventListener(PokerPanel.POKERWISHCOMPLETE,this.createPokerComplete,this);
				//显示其他玩家的牌
				var head:RoleHead;
				for(var i:number = 1; i < 4 ; i++){
					head = this.roleHeads[i];
					head.hide();
				}
				var players = RoomData.getCurrentRoom().players;
				for(var k in players){
					head = this.roleHeads[this.getRoleIndex(players[k])];
					head.show();
				}
			},this,600);
			SoundManager.playBgSound("bgm.mp3");
		}
		
		public createPokerComplete():void{
			var game:DouDiZhuGame = DouDiZhuGameData.getCurrentGame();
			this.timedown.show();
			this.removeEventListener(PokerPanel.POKERWISHCOMPLETE,this.createPokerComplete,this);
			var players = game.ready;
			for(var k in players){
				var head:RoleHead = this.roleHeads[this.getRoleIndex(k)];
				head.updateCurrentState(k == game.currentUid);
			}
			//显示叫地主按钮
			if(this.selfUid == game.currentUid){
				this.updatejiaoDizhuBtns(true);
			}

		}
		public updateUiByGameOver(){
			this.updateHeads();
			this.initPokers();
			this.updatedizhuPoker();
			if(DouDiZhuGameData.getCurrentGame().currentState == 0){
				this.timedown.hide();
			}else{
				this.timedown.show();
			}
			if(DouDiZhuGameData.getCurrentGame().currentCount <= DouDiZhuGameData.getCurrentGame().maxCount){
				this.readyBtn.visible = true;
			}
		}

		/**
		 * 按钮事件响应
		 * */
		public on_inviteBtn(btn:starlingswf.SwfButton){
			ExtGameHelper.showShareTip();
		}	

		public on_readyBtn(btn:starlingswf.SwfButton){
			var room:Room = RoomData.getCurrentRoom();
			var game:DouDiZhuGame = DouDiZhuGameData.getCurrentGame();
			if(this.selfUid == room.owner){
				if(room.players[3] == null){
					ApiState.showText("人数不足");
					return;
				}
				for(var k in room.players){
					if(room.players[k] == this.selfUid){
						continue;
					}
					if(game.ready == null || game.ready[room.players[k]] == null){
						ApiState.showText("有玩家未准备好");
						return;
					}
				}
			}
			DouDiZhuGameApi.ready();
			this.readyBtn.visible = false;
		}

		public on_qiangdizhu1Btn(btn:starlingswf.SwfButton){
			//处理抢地主逻辑
			DouDiZhuGameApi.score(1);
			this.updatejiaoDizhuBtns(false);
		}
		public on_qiangdizhu2Btn(btn:starlingswf.SwfButton){
			//处理抢地主逻辑
			DouDiZhuGameApi.score(2);
			this.updatejiaoDizhuBtns(false);
		}
		public on_qiangdizhu3Btn(btn:starlingswf.SwfButton){
			//处理抢地主逻辑
			DouDiZhuGameApi.score(3);
			this.updatejiaoDizhuBtns(false);
		}
		public on_buqiangBtn(btn:starlingswf.SwfButton){
			//处理不抢逻辑
			DouDiZhuGameApi.score(0);
			this.updatejiaoDizhuBtns(false);
		}
		public on_jiabeiBtn(btn:starlingswf.SwfButton){
			//处理加倍逻辑
			DouDiZhuGameApi.jiabei(1);
			this.updatejiabeiBtns(false);
		}
		public on_bujiabeiBtn(btn:starlingswf.SwfButton){
			//处理不加倍逻辑
			DouDiZhuGameApi.jiabei(0);
			this.updatejiabeiBtns(false);
		}

		public on_chupaiBtn(btn:starlingswf.SwfButton){
			//处理出牌逻辑
			var choosecard:any = DouDiZhuGameData.getChoosePokers();
			var choosetype:number = PokerUtil.getTypeByOutCards(choosecard);
			if(choosetype == 0){
				ApiState.showText("无效组合牌");
				return;
			}
			Log.log("出牌类型："+choosetype);
			var peroutcard:any = DouDiZhuGameData.getCurrentGame().outCards;

			if(peroutcard != null){
				var outcard = [];
				for(var k in peroutcard){
					outcard = peroutcard[k];
					if(k != RoleData.getRole().uid){
						var peroutcardtype = PokerUtil.getTypeByOutCards(outcard);
						if(choosetype == peroutcardtype){
							//比大小：选牌小于已出的牌，返回。反之可以出牌
							if(!PokerUtil.compareCards(choosecard,outcard)){
								ApiState.showText("牌太小了，出不了");
								return;
							}
						}else{
							if(!(choosetype == 11 || choosetype == 12)){
								ApiState.showText("牌组类型不同，炸弹才能出牌");
								return;
							}
						}
					}
				}
			}
			DouDiZhuGameApi.chupai(choosecard);
			this.updatechupaiBtns(false);
			DouDiZhuGameData.putChoosePokers({});
			DouDiZhuGameData.putAdivcePokers({});
		}
		public on_buchuBtn(btn:starlingswf.SwfButton){
			//处理不出牌逻辑
			DouDiZhuGameApi.buchu();
			this.updatechupaiBtns(false);
			this.pokerPanel.chooseAdvicePokers(null);
			DouDiZhuGameData.putChoosePokers({});
			DouDiZhuGameData.putAdivcePokers({});
		}
		public on_yaobuqiBtn(btn:starlingswf.SwfButton){
			//处理不出牌逻辑
			DouDiZhuGameApi.buchu();
			this.updatechupaiBtns(false);
			this.pokerPanel.chooseAdvicePokers(null);
			DouDiZhuGameData.putChoosePokers({});
			DouDiZhuGameData.putAdivcePokers({});
		}
		public on_tishiBtn(btn:starlingswf.SwfButton){
			//处理提示逻辑
			var mycards = DouDiZhuGameData.getMyPokers();
			var outcardsdata = DouDiZhuGameData.getOutPokers();
			var outcard:any = {};
			var advicecards:any = {};
			if(outcardsdata != null){
				for(var k in outcardsdata){
					outcard = outcardsdata[k];
					if(k == this.selfUid){
						advicecards = PokerUtil.checkPokerByNone(mycards);
						DouDiZhuGameData.putChoosePokers(advicecards);
						this.pokerPanel.chooseAdvicePokers(advicecards);
						return;
					}
				}
			}else{
				advicecards = PokerUtil.checkPokerByNone(mycards);
				DouDiZhuGameData.putChoosePokers(advicecards);
				this.pokerPanel.chooseAdvicePokers(advicecards);
				return;
			}
			//推荐出牌
			advicecards = DouDiZhuGameData.getAdivcePokers();
			if(advicecards != null && PokerUtil.getCardsCount(advicecards)>0){
				//当已经有推荐的牌时候，推荐比推荐牌更大的
				advicecards = PokerUtil.CheckBigPokerByCards(advicecards,mycards);
				if(advicecards == null || PokerUtil.getCardsCount(advicecards) < 1){//找到最大牌了，循环一面
					advicecards = PokerUtil.CheckBigPokerByCards(outcard,mycards);
				}
			}else{
				advicecards = PokerUtil.CheckBigPokerByCards(outcard,mycards);
			}
			Log.log(advicecards);
			if(advicecards!=null&&PokerUtil.getCardsCount(advicecards)>0){
				//保存推荐牌
				DouDiZhuGameData.putChoosePokers(advicecards);
				DouDiZhuGameData.putAdivcePokers(advicecards);
				this.pokerPanel.chooseAdvicePokers(advicecards);
			}
		}
		public on_jiesanBtn(e:egret.Event){
			var room:Room = RoomData.getCurrentRoom();
			if(room.owner == RoleData.getRole().uid){
				ExtGameHelper.disbandRoom();
			}else{
				ExtGameHelper.leaveRoom();
			}

		}
		public on_backwechatBtn(e:egret.Event){
			// this.pokerPanel.showTween();
			// this._showWishPoker();
			// this.updatedizhuPoker(true);
			ExtGameHelper.backToWx();
		}
		/**
		 * 获取玩家真正显示的位置
		 */
		public getRoleIndex(uid:string):number{
			var selfUid = RoleData.getRole().uid;
			if(uid == selfUid){
				return 1;
			}
			var selfIndex:number = RoomData.getPlayerIndex(selfUid);
			var index:number = RoomData.getPlayerIndex(uid);
			
			//总的位置
			var maxSet:number = 3;
			//自己移动了多少位
			var moveSet:number = 0;
			if(selfIndex == 1) {
				moveSet = 0;
			}else{
				moveSet = (maxSet - selfIndex) + 1;
			}
			var end:number = index + moveSet;
			if(end == maxSet) return maxSet;
			else if(end > maxSet) return (index + moveSet) % maxSet;
			else return end;
		}

		public mainAssetName(): string{
			return "spr_game";
		}

		public assetSwf(): starlingswf.Swf{
			return DouDiZhuAsset.mainSwf();
		}

		public dispose():void{
			super.dispose();
			// this.mainAsset.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,this.pokerPanel.onTouchBegin,this);
			// this.mainAsset.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE,this.pokerPanel.onTouchMove,this);
			// this.mainAsset.stage.removeEventListener(egret.TouchEvent.TOUCH_END,this.pokerPanel.onTouchEnd,this);
			// this.mainAsset.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.pokerPanel.onTouchTap,this);
			// this.mainAsset.removeEventListener(RoleHead.ONCLICKTIMER,this.onclicktimer,this);
			//移除所有事件监听
			this.pokerPanel.dispose();
			this.dataParse.dispose();
			this.timedown.dispose();
			for(var index in this.roleHeads){
				(<RoleHead>this.roleHeads[index]).dispose();
			}
			VoiceButton.destroyVocieButton(this.voiceBtn);
			ChatButton.destroyChatButton(this.chatBtn);
			
		}
		
	}
}