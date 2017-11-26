module lj.cgcp.game.jinhua {
	export class GamePanelDataParse {

		private gamePanel:GamePanel;

		public tagEvents:any;

		public bipaiing = false;
		public qipaiObjs:any[] = [];

		public constructor(gamePanel:GamePanel) {
			this.gamePanel = gamePanel;
			this.tagEvents = {};
			this.tagEvents['ready'] = this.onReady;
			this.tagEvents['startGame'] = this.onStartGame;
			this.tagEvents['seeCard'] = this.onSeeCard;
			this.tagEvents['useMoney'] = this.onUseMoney;
			this.tagEvents['qipai'] = this.onQiPai;
			this.tagEvents['gameOver'] = this.onGameOver;
			this.tagEvents['kaipaiGameOver'] = this.onKaipaiGameOver;
			this.tagEvents['kaipai'] = this.onKaiPai;
			this.tagEvents['endGame'] = this.onEndGame;
		}

		public onJoinRoom(data:any){
			var showIndex:number = this.gamePanel.getRoleIndex(data.sender);
			(<RoleHead>this.gamePanel.roleHeads[showIndex]).initData(data.sender);
			(<RoleHead>this.gamePanel.roleHeads[showIndex]).show();
			this.gamePanel.updateShangXianText();
		}

		public onReady(data:any){
			if(JinHuaGameData.getCurrentGame().ready != null){
				JinHuaGameData.getCurrentGame().ready[data.uid] = 1;
			}else{
				JinHuaGameData.getCurrentGame().ready = {};
				JinHuaGameData.getCurrentGame().ready[data.uid] = 1;
			}
			var showIndex:number = this.gamePanel.getRoleIndex(data.uid);
			if(this.gamePanel.roleHeads[showIndex]){
				(<RoleHead>this.gamePanel.roleHeads[showIndex]).initData(data.uid);
				(<RoleHead>this.gamePanel.roleHeads[showIndex]).showReady();
			}
			var roleInfo = JinHuaRoleData.getRole(data.uid);
			if(roleInfo.sex == 1){
				SoundManager.playGameSound( "1/m_ready.mp3");
			}else{
				SoundManager.playGameSound( "0/f_ready.mp3");
			}
		}

		public onStartGame(data:any){
			var game:JinHuaGame = data.game;
			JinHuaGameData.putCurrentGame(game);

			this.gamePanel.selfCards.mainAssets.visible = true;
			this.gamePanel.selfCards.mainAssets.touchEnabled = true;
			this.gamePanel.selfCards.hideCards();
			this.gamePanel.updateBtns();
			this.gamePanel.updateZongzhuText();
			
			for(var k in game.ready){
				var showIndex:number = this.gamePanel.getRoleIndex(k);
				var head:RoleHead = this.gamePanel.roleHeads[showIndex];
				if(head == null) continue;
				head.showMorenPai();
				head.updateMoney();
				if(k == game.currentUid){
					head.startTimeDown();
				}
				this.gamePanel.addChouma(k,game);
			}
		}

		/**
		 * 收到看牌的推送
		 */
		public onSeeCard(data:any):void{
			var uid:string = data.sender;
			var roleInfo = JinHuaRoleData.getRole(uid);
			if(roleInfo.sex == 1){
				SoundManager.playGameSound( "1/m_watch.mp3");
			}else{
				SoundManager.playGameSound( "0/f_watch.mp3");
			}
			if(JinHuaGameData.getCurrentGame().see != null){
				JinHuaGameData.getCurrentGame().see[uid] = 1;
			}else{
				JinHuaGameData.getCurrentGame().see = {};
				JinHuaGameData.getCurrentGame().see[uid] = 1;
			}

			var showIndex:number = this.gamePanel.getRoleIndex(uid);
			var head:RoleHead = <RoleHead>this.gamePanel.roleHeads[showIndex];
			head.showYikanpai();

			if(uid == RoleData.getRole().uid){
				JinHuaGameData.putCards(data.cards);
				this.gamePanel.selfCards.showCards();
				this.gamePanel.kanpaiBtn.visible = false;
			}
		}

		public onQiPai(data:any){
			if(this.bipaiing){
				this.qipaiObjs.push(data);
				return;
			}
			var sender:string = data.sender;
			var roleInfo = JinHuaRoleData.getRole(sender);
			if(roleInfo.sex == 1){
				SoundManager.playGameSound( "1/m_giveup2.mp3");
			}else{
				SoundManager.playGameSound( "0/f_giveup.mp3");
			}
			var oldCurrent:string = JinHuaGameData.getCurrentGame().currentUid;
			JinHuaGameData.getCurrentGame().currentUid = data.currentUid;
			JinHuaGameData.getCurrentGame().operateCount++;
			if(JinHuaGameData.getCurrentGame().giveup != null){
				JinHuaGameData.getCurrentGame().giveup[sender] = 1;
			}else{
				JinHuaGameData.getCurrentGame().giveup = {};
				JinHuaGameData.getCurrentGame().giveup[sender] = 1;
			}
			var showIndex:number = this.gamePanel.getRoleIndex(sender);
			var  head:RoleHead = this.gamePanel.roleHeads[showIndex];
			head.showQiPai();
			if(sender == oldCurrent){
				head.stopTimeDown();
			}
			if(oldCurrent != JinHuaGameData.getCurrentGame().currentUid && data.flag == "qipai"){
				showIndex = this.gamePanel.getRoleIndex(data.currentUid);
				head = this.gamePanel.roleHeads[showIndex];
				head.startTimeDown();
			}else if(data.flag == "gameover"){
				var game:JinHuaGame = data.game;
				JinHuaGameData.putCurrentGame(game);
				this.onGameOver();
			}
			this.gamePanel.updateBtns();
		}

		public onUseMoney(data:any){
			var oldMoneyType:number = JinHuaGameData.getCurrentGame().lastMoneyType;
			var game:JinHuaGame = data.game;
			var sender:string = data.sender;
			var roleInfo = JinHuaRoleData.getRole(sender);
			if(roleInfo.sex == 1){
				SoundManager.playGameSound( "1/m_follow.mp3");
			}else{
				SoundManager.playGameSound( "0/f_follow.mp3");
			}
			JinHuaGameData.putCurrentGame(game);

			this.gamePanel.updateBtns();
			this.gamePanel.updateZongzhuText();

			this.gamePanel.addChouma(sender,game);
			var money:number = JinHuaGameData.getMoneyByMoneyType(game.lastMoneyType);
			if(money < game.lastMoney && game.see != null && game.see[sender]){
				this.gamePanel.addChouma(sender,game);
			}

			var showIndex:number = this.gamePanel.getRoleIndex(sender);
			var  head:RoleHead = this.gamePanel.roleHeads[showIndex];
			head.updateMoney();
			head.stopTimeDown();
			head.stateMc.visible = true;
			if(oldMoneyType < game.lastMoneyType){
				head.stateMc.gotoAndStop(2);
			}else{
				head.stateMc.gotoAndStop(1);
			}

			showIndex = this.gamePanel.getRoleIndex(game.currentUid);
			head = this.gamePanel.roleHeads[showIndex];
			head.startTimeDown();
		}

		public onKaiPai(data:any){
			this.bipaiing = true;
			var winUid:string = data.winUid;
			var targetUid:string = data.targetUid;
			var sender:string = data.sender;
			var thisObj:GamePanelDataParse = this;
			var showIndex:number = thisObj.gamePanel.getRoleIndex(sender);
			var roleHead:RoleHead = <RoleHead>thisObj.gamePanel.roleHeads[showIndex];
			roleHead.stopTimeDown();
			this.gamePanel.addChild(new VsPanel(JinHuaRoleData.getRole(sender),JinHuaRoleData.getRole(targetUid),winUid,data,function(){
				var lostUid:string;
				if(winUid == sender){
					lostUid = targetUid;
				}else{
					lostUid = sender;
				}
				var game:JinHuaGame = data.game;
				JinHuaGameData.putCurrentGame(game);

				thisObj.gamePanel.addChouma(sender,game);
				var money:number = JinHuaGameData.getMoneyByMoneyType(game.lastMoneyType);
				if(money < game.lastMoney && game.see != null && game.see[sender]){
					thisObj.gamePanel.addChouma(sender,game);
				}

				var showIndex:number = thisObj.gamePanel.getRoleIndex(lostUid);
				var roleHead:RoleHead = <RoleHead>thisObj.gamePanel.roleHeads[showIndex];
				roleHead.showQiPai();
				showIndex = thisObj.gamePanel.getRoleIndex(sender);
				roleHead = <RoleHead>thisObj.gamePanel.roleHeads[showIndex];
				roleHead.updateMoney();
			
				showIndex = thisObj.gamePanel.getRoleIndex(game.currentUid);
				roleHead = thisObj.gamePanel.roleHeads[showIndex];
				roleHead.startTimeDown();

				thisObj.gamePanel.updateBtns();
				thisObj.gamePanel.updateZongzhuText();

				thisObj.bipaiing = false;
				if(thisObj.qipaiObjs.length > 0){
					var len:number = thisObj.qipaiObjs.length;
					for(var i:number = 0; i < len ;i++){
						thisObj.onQiPai(thisObj.qipaiObjs[i]);
					}
					thisObj.qipaiObjs = [];
				}
			}));
		}

		/**
		 * 开牌之后游戏结束
		 */
		public onKaipaiGameOver(data:any){
			var game:JinHuaGame = data.game;
			JinHuaGameData.putCurrentGame(game);
			var showIndex = this.gamePanel.getRoleIndex(data.sender);
			var roleHead = <RoleHead>this.gamePanel.roleHeads[showIndex];
			roleHead.updateMoney();
			roleHead.stopTimeDown();
			var winUid:string = data.winUid;
			var targetUid:string = data.targetUid;
			var sender:string = data.sender;
			var thisObj:GamePanelDataParse = this;
			this.gamePanel.addChild(new VsPanel(JinHuaRoleData.getRole(sender),JinHuaRoleData.getRole(targetUid),winUid,data,function(){
				thisObj.onGameOver();
			}));
		}

		public onGameOver(){
			JinHuaGameData.putCards(null);
			var game:JinHuaGame = JinHuaGameData.getCurrentGame();
			this.gamePanel.updateWin(game);
		}

		public onEndGame(data:any):void{
			var game:JinHuaGame = data.game;
			JinHuaGameData.putCurrentGame(game);
			if(game['currentUid'] != null){
				var showIndex = this.gamePanel.getRoleIndex(game['currentUid']);
				var roleHead = <RoleHead>this.gamePanel.roleHeads[showIndex];
				roleHead.stopTimeDown();
			}
			lzm.Alert.alert(new EndPanel(this.gamePanel));
		}

		public onLeaveRoom(data:any){
			var sender:string = data.sender;
			var showIndex:number = this.gamePanel.getRoleIndex(sender);
			var roleHead:RoleHead = <RoleHead>this.gamePanel.roleHeads[showIndex];
			roleHead.hide();
			RoomData.putCurrentRoom(data.room);
			this.gamePanel.updateShangXianText();
		}


		public dispose():void{}

	}
}