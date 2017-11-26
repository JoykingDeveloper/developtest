module lj.cgcp.game.jinhua {
	export class GamePanel extends BasePanel {
		
		public dataParse:GamePanelDataParse;
		public fanghaoText:egret.TextField;
		public fangzhuName:egret.TextField;
		public roleHeads:any;
		public selfCards:SelfCards;
		public jiazhuPanel:JiaZhuPanel;
		public zongzhuText:egret.TextField;
		public lunshuText:egret.TextField;
		public limitMoneyText:egret.TextField;
		public limitMoney:number;
		public paixingPanel:PaiXingPanel;
		public kaipaiPanel:KaiPaiPanel;
		public qipaiBtn:starlingswf.SwfButton;
		public genzhuBtn:starlingswf.SwfButton;
		public kaiPaiBtn:starlingswf.SwfButton;
		public kanpaiBtn:starlingswf.SwfButton;
		public jiazhuBtn:starlingswf.SwfButton;
		public inviteBtn:starlingswf.SwfButton;
		public readyBtn:starlingswf.SwfButton;
		public startBtn:starlingswf.SwfButton;
		public jiesanBtn:starlingswf.SwfButton;
		public headDk1:egret.DisplayObject;
		public headDk2:egret.DisplayObject;
		public headDk3:egret.DisplayObject;
		public headDk4:egret.DisplayObject;
		public headDk5:egret.DisplayObject;
		public headDk6:egret.DisplayObject;
		public selfUid:string;
		public chouma:egret.DisplayObject[];
		public voiceBtn:starlingswf.SwfButton;
		public chatBtn:starlingswf.SwfButton;
		public constructor() {
			super();
			this.selfUid = RoleData.getRole().uid;
			this.chouma = [];
			this.dataParse = new GamePanelDataParse(this);
			this.selfCards = new SelfCards(this,this.mainAsset.getSprite("selfCards"));
			this.jiazhuPanel = new JiaZhuPanel(this,this.mainAsset.getSprite("jiazhuPanel"));
        	this.kaipaiPanel = new KaiPaiPanel(this);
			this.paixingPanel = new PaiXingPanel(this);
			this.voiceBtn = VoiceButton.createVoiceButton();
			this.voiceBtn.x = 552;
			this.voiceBtn.y = 806;
			this.mainAsset.addChild(this.voiceBtn);

			this.chatBtn = ChatButton.createChatButton();
			this.chatBtn.x = 0;
			this.chatBtn.y = 806;
			this.mainAsset.addChild(this.chatBtn);
		}

		public addToStage(e:egret.Event){
			this.initUi();
		}

		public initUi(){
			var room:Room = RoomData.getCurrentRoom();
			var game:JinHuaGame = JinHuaGameData.getCurrentGame();
			var uid:string;

			this.initHeads();
			this.fanghaoText.text = room.id.toString();
			uid = room.owner.toString();
			this.fangzhuName.text = JinHuaRoleData.getRole(uid).name;
			if(game.ready != null && game.ready[this.selfUid] || game.isStart){
				this.readyBtn.visible = false;
				this.startBtn.visible = false;
				this.inviteBtn.visible = false;
			}
			if(room.owner != this.selfUid){
				this.startBtn.visible = false;
			}else{
				this.readyBtn.visible = false;
			}
			this.selfCards.mainAssets.visible = game.isStart;
			this.jiazhuPanel.mainAssets.visible = false;
			this.updateBtns();
			this.updateZongzhuText();
			this.updateLunshuText();
			this.updateShangXianText();
			
		}

		/**
		 * 初始化头像信息
		 */
		private initHeads(){
			if(this.roleHeads == null){
				this.roleHeads = {};
				var headAsset:starlingswf.SwfSprite;
				var head:RoleHead;
				for(var i:number = 1; i < 7 ; i++){
					headAsset = this.mainAsset.getSprite("head" + i);
					head = new RoleHead(headAsset);
					this.roleHeads[i] = head;
				}
			}
			this.updateHeads();
		}

		public updateHeads(){
			var head:RoleHead;
			for(var i:number = 1; i < 7 ; i++){
				head = this.roleHeads[i];
				head.hide();
			}
			var players = RoomData.getCurrentRoom().players;
			var game:JinHuaGame = JinHuaGameData.getCurrentGame();
			for(var k in players){
				head = this.roleHeads[this.getRoleIndex(players[k])];
				head.initData(players[k]);
				head.show();
				if(game.currentCount > 1){
					head.hideKickBtn();
				}
			}
		}

		public updateBtns():void{
			var room:Room = RoomData.getCurrentRoom();
			var game:JinHuaGame = JinHuaGameData.getCurrentGame();
			var head:RoleHead;
			var players = room.players;
			if(game.currentCount > 1){
				this.inviteBtn.visible = false;
			}
			if(game.isStart){
				this.qipaiBtn.visible= true;
				this.genzhuBtn.visible= true;
				this.kaiPaiBtn.visible= true;
				this.jiazhuBtn.visible= true;
				this.kanpaiBtn.visible= true;
				for(var k in players){
				head = this.roleHeads[this.getRoleIndex(players[k])];
				head.hideKickBtn();
				}
				this.inviteBtn.visible = false;
				var give:boolean = game.giveup != null && game.giveup[this.selfUid];
				if(game.ready[this.selfUid] == null) {
					this.selfCards.mainAssets.visible = false;
					give = true;
				}
				if(give) {
					this.qipaiBtn.setEnable(false);
					this.selfCards.showQiPai();
					this.selfCards.mainAssets.touchEnabled = false;
				}else{
					this.qipaiBtn.setEnable(true);
				}
				if(game.currentUid != this.selfUid || give) {
					this.genzhuBtn.setEnable(false);
				}else{
					this.genzhuBtn.setEnable(true);
				}
				if(game.currentUid != this.selfUid || give || game.operateCount < JinHuaGame.getReadyCount(game)) {
					this.kaiPaiBtn.setEnable(false);
				}else{
					this.kaiPaiBtn.setEnable(true);
				}
				if(game.currentUid != this.selfUid || give) {
					this.jiazhuBtn.setEnable(false);
				}else{
					this.jiazhuBtn.setEnable(true);
				}
				if(JinHuaGameData.getCards() || give){
					this.kanpaiBtn.visible= false;
				}else{
					this.kanpaiBtn.visible= true;
				}
			}else{
				this.qipaiBtn.visible= false;
				this.genzhuBtn.visible= false;
				this.kaiPaiBtn.visible= false;
				this.jiazhuBtn.visible= false;
				this.kanpaiBtn.visible= false;
			}
		}

		public updateZongzhuText(){
			var game:JinHuaGame = JinHuaGameData.getCurrentGame();
			this.zongzhuText.text = game.allMoney.toString();
		}

		public updateLunshuText(){
			var game:JinHuaGame = JinHuaGameData.getCurrentGame();
			this.lunshuText.text = "第 " + game.currentCount + "/" + game.maxCount + " 轮";
		}

		public updateShangXianText(){
			var room:Room = RoomData.getCurrentRoom();
			var count:number = 0;
			for(var k in room.players){
				Log.log(room.players[k]);
				count++;
			}
			this.limitMoney = 50 *count;
			var game:JinHuaGame = JinHuaGameData.getCurrentGame();
			this.limitMoneyText.text = "本局上限: " + this.limitMoney;
		}

		/**
		 * 添加筹码
		 */
		public addChouma(sender:string,game:JinHuaGame){
			var dis:egret.DisplayObject = JinHuaAsset.mainSwf().createSprite("spr_zhu" + game.lastMoneyType);
			var showIndex:number = this.getRoleIndex(sender);
			var head:RoleHead = <RoleHead>this.roleHeads[showIndex];
			dis.x = head.mainAsset.x;
			dis.y = head.mainAsset.y;
			this.addChild(dis);
			var x:number = (Math.random() * 90) + 280;
			var y:number = (Math.random() * 90) + 520;
			egret.Tween.get(dis).to({x:x,y:y}, 200, egret.Ease.sineInOut);
			this.chouma.push(dis);
			SoundManager.playGameSound( "addChouma.mp3");
		}

		public updateUiByGameOver(){
			var room:Room = RoomData.getCurrentRoom();
			this.selfCards.mainAssets.visible = false;
			this.selfCards.hideCards();
			this.chouma = [];
			this.updateHeads();
			this.updateBtns();
			this.updateZongzhuText();
			this.updateLunshuText();
			if(room.owner == this.selfUid){
				this.startBtn.visible = true;
			}else{
				this.readyBtn.visible = true;
			}
		}


		/**
		 * 播放胜利动画
		 */
		public updateWin(game:JinHuaGame){
			var head:RoleHead;
			for(var i:number = 1; i < 7 ; i++){
				head = this.roleHeads[i];
				head.stopTimeDown();
			}
			var win:string = game.lastWin;
			var len:number = this.chouma.length;
			if(len == 0){
				this.updateUiByGameOver();
				return;
			}

			var showIndex:number = this.getRoleIndex(win);
			var head:RoleHead = <RoleHead>this.roleHeads[showIndex];
			var targetX:number = head.mainAsset.x;
			var targetY:number = head.mainAsset.y;
			var compCount = 0;
			var dis:egret.DisplayObject;
			var thisObj:GamePanel = this;
			SoundManager.playGameSound( "getMoney.mp3");
			for(var i:number = 0; i < len ;i++){
				dis = this.chouma[i];
				var endTime:number = (Math.random() * 100) + 600 + (i * 30);
				if(i == (len-1)){
					endTime = 700;
				}
				egret.Tween.get(dis).to({x:targetX,y:targetY}, endTime, egret.Ease.sineInOut).call(function(obj:egret.DisplayObject){
					if(obj.parent) obj.parent.removeChild(obj);
					compCount++;
					if(compCount == len){
						egret.setTimeout(function(){
							if(game.currentCount > game.maxCount){
								lzm.Alert.alert(new EndPanel(thisObj));
							}else{
								thisObj.updateUiByGameOver();
							}
						},thisObj,100);
					}
				},this,[dis]);
			}
		}

		public on_inviteBtn(btn:starlingswf.SwfButton){
			ExtGameHelper.showShareTip();
		}

		public on_readyBtn(btn:starlingswf.SwfButton){
			JinHuaGameApi.ready();
			this.readyBtn.visible = false;
		}

		public on_startBtn(btn:starlingswf.SwfButton){
			var game:JinHuaGame = JinHuaGameData.getCurrentGame();
			var readys = game.ready;
			var room:Room = RoomData.getCurrentRoom();
			var players = room.players;
			var number:number = 0;
			for(var k in players){
				if(players[k] != room.owner){
					if(readys == null || readys[players[k]] == null){
						ApiState.showText("有玩家未准备好");
						return;
					}
				}
				number +=1;
			}
			if(number <= 1){
				ApiState.showText("玩家人数至少要2人");
				return;
			}
			JinHuaGameApi.ready();
			this.startBtn.visible = false;
			
		}

		public on_genzhuBtn(btn:starlingswf.SwfButton){
			var game:JinHuaGame = JinHuaGameData.getCurrentGame();
			if(game.allMoney > this.limitMoney){
				this.genzhuBtn.setEnable(false);
				ApiState.showText("下注已达上限,请比牌");
				return;
			}
			JinHuaGameApi.useMoney(game.lastMoneyType);
		}

		public on_jiazhuBtn(btn:starlingswf.SwfButton){
			var game:JinHuaGame = JinHuaGameData.getCurrentGame();
			if(game.allMoney > this.limitMoney){
				this.jiazhuBtn.setEnable(false);
				ApiState.showText("下注已达上限,请比牌");
				return;
			}
			this.jiazhuPanel.show();
		}

		public on_qipaiBtn(e:egret.Event){
			JinHuaGameApi.qipai();
			this.selfCards.showQiPai();
		}

		public on_kaiPaiBtn(e:egret.Event){
			this.kaipaiPanel.show();
		}

		public on_kanpaiBtn(e:egret.Event){
			var cardMsg:any = JinHuaGameData.getCards();
			if(cardMsg != null) return;
			JinHuaGameApi.seeCard();
		}

		public on_backWeixinBtn(e:egret.Event){
			 ExtGameHelper.backToWx();
		}

		public on_jiesanBtn(e:egret.Event){
			var room:Room = RoomData.getCurrentRoom();
			if(room.owner == RoleData.getRole().uid){
				ExtGameHelper.disbandRoom();
			}else{
				ExtGameHelper.leaveRoom();
			}

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
			var maxSet:number = 6;
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
			return JinHuaAsset.mainSwf();
		}

		public dispose():void{
			super.dispose();
			this.dataParse.dispose();
			this.selfCards.dispose();
			this.jiazhuPanel.dispose();
			this.paixingPanel.dispose();
			this.kaipaiPanel.dispose();
			VoiceButton.destroyVocieButton(this.voiceBtn);
			ChatButton.destroyChatButton(this.chatBtn);
		}
	}
}