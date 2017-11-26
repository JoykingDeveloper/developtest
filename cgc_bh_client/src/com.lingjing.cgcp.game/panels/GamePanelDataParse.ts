module lj.cgcp.game.baohuang {
	export class GamePanelDataParse {

		private gamePanel:GamePanel;

		public tagEvents:any;

		public constructor(gamePanel:GamePanel) {
			this.gamePanel = gamePanel;
			this.tagEvents = {};
			this.tagEvents['ready'] = this.onReady;
			this.tagEvents['startGame'] = this.onStartGame;
			this.tagEvents['chupai'] = this.onChuPai;
			this.tagEvents['buchu'] = this.onBuChu;
			this.tagEvents['dengji'] = this.onDengJi;
			this.tagEvents['mingbao'] = this.onMingBao;
			this.tagEvents['qiangdu'] = this.onQiangDu;
			this.tagEvents['zaofan'] = this.onZaoFan;
			this.tagEvents["GameOver"] = this.onGameOver;
			this.tagEvents["endGame"] = this.onEndGame;
		}

		public onJoinRoom(data:any){
			var showIndex:number = this.gamePanel.getRoleIndex(data.sender);
			(<RoleHead>this.gamePanel.roleHeads[showIndex]).initData(data.sender);
			(<RoleHead>this.gamePanel.roleHeads[showIndex]).show();
		}

		public onReady(data:any){
			var showIndex:number = this.gamePanel.getRoleIndex(data.uid);
			(<RoleHead>this.gamePanel.roleHeads[showIndex]).initData(data.uid);
			(<RoleHead>this.gamePanel.roleHeads[showIndex]).showReady();
			var roleInfo = BHRoleData.getRole(data.uid);
			var game:BHGame = BHGameData.getCurrentGame();
			if(game == null){
				game = new BHGame();
			}
			if(game.ready == null){
				game.ready = {};
			}
			game.ready[data.uid] = 1;
			BHGameData.putCurrentGame(game);
		}

		public onStartGame(data:any){
			var game:BHGame = data.game;
			if(data.cardsInfo != null){
				game.cardsInfo = data.cardsInfo;
			}
			BHGameData.putCurrentGame(game);
			
			for(var k in game.ready){
				var showIndex:number = this.gamePanel.getRoleIndex(k);
				var head:RoleHead = this.gamePanel.roleHeads[showIndex];
				head.updateMoney();
				head.readyState.visible = false;
				head.show();
				if(k == RoleData.getRole().uid){
					this.gamePanel.showWishPoker();
				}
			}
		}

		

		/**
		 * 收到出牌的推送
		 */
		public onChuPai(data:any){
			var game:BHGame = BHGameData.getCurrentGame();
			if(data.game != null){
				game = data.game;
			}else{
				game.currentUid = data.currentUid;
				game.perUid = data.sender;
			}
			if(data.cardsInfo != null){
				game.cardsInfo = data.cardsInfo;
			}
			BHGameData.putCurrentGame(game);
			BHGameData.putAdivcePokers({});
			SoundManager.playGameSound("dapai.mp3");
			//游戏结束
			if(data.endData != null){
				egret.setTimeout(function():void{
					this.onGameOver(data.endData);
				},this,900);
				BHGameData.getCurrentGame().currentUid = null;
			}

			for(var k in game.ready){
				var showIndex:number = this.gamePanel.getRoleIndex(k);
				var head:RoleHead = this.gamePanel.roleHeads[showIndex];
				head.show();
			}
			if(game.currentUid == this.gamePanel.selfUid){
				this.gamePanel.updatechupaiBtns(true);
			}
			if(game.perUid == this.gamePanel.selfUid){
				this.gamePanel.pokerPanel.refreshPoker();
			}
			
			this.gamePanel.updateLunshuText();
			

			
		}

		/**
		 * 收到不出牌的推送
		 */
		public onBuChu(data:any){
			var game:BHGame = BHGameData.getCurrentGame();
			game.currentUid = data.currentUid;
			game.perUid = data.sender;
			if(data.clearOutCards != null){
				game.outCards = null;
			}
			BHGameData.putCurrentGame(game);
			for(var k in game.ready){
				var showIndex:number = this.gamePanel.getRoleIndex(k);
				var head:RoleHead = this.gamePanel.roleHeads[showIndex];
				head.show();
				if(k == data.sender){
					head.showStateText("img_BH_WZ3");
				}
			}
			if(game.currentUid == this.gamePanel.selfUid){
				this.gamePanel.updatechupaiBtns(true);
			}
			SoundManager.playGameSound("pass4.mp3");
			
		}
		/**
		 * 登基
		*/
		public onDengJi(data:any){
			var game:BHGame = data.game;
			game.cardsInfo = data.cardsInfo;
			BHGameData.putCurrentGame(game);
			if(game.emperorUid != null){
				SoundManager.playGameSound("dengji.mp3");
				var mc:starlingswf.SwfMovieClip = BHAsset.effSwf().createMovie("mc_dengji_eff");
				mc.x = BHAsset.gameWidth/2;
				mc.y = BHAsset.gameHeight*0.3;
				mc.loop = false;
				this.gamePanel.mainAsset.addChild(mc);
				
				egret.setTimeout(function():void{
						this.gamePanel.mainAsset.removeChild(mc);
					},this,2500);
			}else{
				SoundManager.playGameSound("rangwei.mp3");
			}
			for(var k in game.ready){
				var showIndex:number = this.gamePanel.getRoleIndex(k);
				var head:RoleHead = this.gamePanel.roleHeads[showIndex];
				//如果皇宝一家，登基不提示抢独
				if(game.emperorUid == k && game.isQiangDu == 1 && !data.isanDu){
					head.showStateText("img_BH_WZ4");
				}
				head.show();
			}
			this.gamePanel.updateBtns();
			if(game.currentUid == this.gamePanel.selfUid || data.sender == this.gamePanel.selfUid){
				this.gamePanel.pokerPanel.refreshPoker();
			}
			
		}
		/**
		 * 明保
		*/
		public onMingBao(data:any){
			var game:BHGame = BHGameData.getCurrentGame();
			if(data.isMingBao == 1){
				game.guardUid = data.sender;
			}
			if(data.currentState != null){
				game.currentState = data.currentState;
			}
			game.isMingBao = data.isMingBao;
			BHGameData.putCurrentGame(game);
			for(var k in game.ready){
				var showIndex:number = this.gamePanel.getRoleIndex(k);
				var head:RoleHead = this.gamePanel.roleHeads[showIndex];
				head.show();
			}
			
			if(game.currentState == 3){
				this.gamePanel.updateBtns();
			}
		}
		/**
		 * 抢独
		*/
		public onQiangDu(data:any){
			var game:BHGame = BHGameData.getCurrentGame();
			game.isQiangDu = data.isQiangDu;
			if(data.currentState != null){
				game.currentState = data.currentState;
			}
			if(game.isQiangDu == 1){
				game.isMingBao = 1;
			}
			BHGameData.putCurrentGame(game);
			for(var k in game.ready){
				var showIndex:number = this.gamePanel.getRoleIndex(k);
				var head:RoleHead = this.gamePanel.roleHeads[showIndex];
				head.show();
				if(k == data.sender && game.isQiangDu == 1){
					head.showStateText("img_BH_WZ4");
				}
			}
			if(game.currentState == 3){
				this.gamePanel.updateBtns();
			}
		}
		/**
		 * 造反 
		*/
		public onZaoFan(data:any){
			var game:BHGame = BHGameData.getCurrentGame();
			game.zaofan = data.zaofan;
			if(data.currentState != null){
				game.currentState = data.currentState;
			}
			BHGameData.putCurrentGame(game);
			
			if(PokerUtil.getCount(data.zaofan) == 4){
				this.gamePanel.updateBtns();
				for(var k in game.ready){
					var showIndex:number = this.gamePanel.getRoleIndex(k);
					var head:RoleHead = this.gamePanel.roleHeads[showIndex];
					head.show();
				}
			}else{
				var showIndex:number = this.gamePanel.getRoleIndex(data.sender);
				var head:RoleHead = this.gamePanel.roleHeads[showIndex];
				head.show();
			}
		}
		/**
		 * 收到游戏结束的推送
		 */
		public onGameOver(data:any){
			var oldgame:BHGame = BHGameData.getCurrentGame();
			var game:BHGame = data.game;
			BHGameData.putCurrentGame(game);
			
			
			if(game.currentCount <= game.maxCount){
				//继续游戏
				this.gamePanel.updateUiByGameOver();
				if(oldgame != null){
					egret.setTimeout(function():void{
						lzm.Alert.alertLandscape(new ResultPanel(oldgame,game));
					},this,1000);
				}
			}else{
				this.gamePanel.updateUiByGameOver();
				egret.setTimeout(function():void{
					//进行结算
					lzm.Alert.alertLandscape(new ResultPanel(oldgame,game).setEnd());
				},this,1000);
			}
			
		}
		public onEndGame(data:any){
			var game:BHGame = data.game;
			BHGameData.putCurrentGame(game);
			//进行结算
			lzm.Alert.alertLandscape(new EndPanel());
		}
		public onLeaveRoom(data:any){
			var sender:string = data.sender;
			var showIndex:number = this.gamePanel.getRoleIndex(sender);
			var roleHead:RoleHead = <RoleHead>this.gamePanel.roleHeads[showIndex];
			roleHead.hide();
		}	

		public dispose():void{}

	}
}