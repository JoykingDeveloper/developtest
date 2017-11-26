module lj.cgcp.game.doudizhu {
	export class GamePanelDataParse {

		private gamePanel:GamePanel;

		public tagEvents:any;

		public constructor(gamePanel:GamePanel) {
			this.gamePanel = gamePanel;
			this.tagEvents = {};
			this.tagEvents['ready'] = this.onReady;
			this.tagEvents['startGame'] = this.onStartGame;
			this.tagEvents['score'] = this.onScore;
			this.tagEvents['jiabei'] = this.onJiaBei;
			this.tagEvents['chupai'] = this.onChuPai;
			this.tagEvents['buchu'] = this.onBuChu;
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
			var roleInfo = DouDiZhuRoleData.getRole(data.uid);
			var game:DouDiZhuGame = DouDiZhuGameData.getCurrentGame();
			if(game == null){
				game = new DouDiZhuGame();
			}
			if(game.ready == null){
				game.ready = {};
			}
			game.ready[data.uid] = 1;
			DouDiZhuGameData.putCurrentGame(game);
		}

		public onStartGame(data:any){
			var game:DouDiZhuGame = data.game;
			if(data.cardsInfo != null){
				game.cardsInfo = data.cardsInfo;
			}
			DouDiZhuGameData.putCurrentGame(game);
			for(var k in game.ready){
				var showIndex:number = this.gamePanel.getRoleIndex(k);
				var head:RoleHead = this.gamePanel.roleHeads[showIndex];
				head.updateMoney();
				head.showOverCards(false);
				head.updateShowOutCard(false);
				head.readyState.visible = false;

				if(k == RoleData.getRole().uid){
					this.gamePanel.showWishPoker();
				}
			}
			this.gamePanel.updatedizhuPoker();
			//请空报警缓存
			DouDiZhuGameData.isWarnned({});
		}

		/**
		 * 收到叫分的推送
		 */
		public onScore(data:any):void{
			var game:DouDiZhuGame = DouDiZhuGameData.getCurrentGame();
			if(data.game != null){
				game = data.game;
			}else{
				game.currentUid = data.currentUid;
				game.perUid = data.sender;
				game.score = data.scoreInfo;
			}
			if(data.cardsInfo != null){
				game.cardsInfo = data.cardsInfo;
			}
			DouDiZhuGameData.putCurrentGame(game);
			this.gamePanel.timedown.show();
			//处理上一个叫分情况
			for(var k in game.ready){
				var showIndex:number = this.gamePanel.getRoleIndex(k);
				var head:RoleHead = this.gamePanel.roleHeads[showIndex];
				head.show();
				head.showScore(data.sender);
			}
			if(game.currentState == 2){
				this.gamePanel.updatedizhuPoker(true);
				this.gamePanel.updateBtns();
				this.gamePanel.updateDifenText();
				this.gamePanel.updateBeishuText();
				this.gamePanel.updateLunshuText();
			}
			if(data.currentUid == this.gamePanel.selfUid){
				this.gamePanel.updatejiaoDizhuBtns(true);
			}
			var roleinfo = DouDiZhuRoleData.getRole(data.sender);
			var soundName = roleinfo.sex +"/"+( game.score[roleinfo.uid] == 0?"buqiang":"qiangdizhu"+game.score[roleinfo.uid])+".mp3";
			SoundManager.playGameSound(soundName,1);
			
		}

		/**
		 * 农民加倍
		 */
		public onJiaBei(data:any){
			
		}

		/**
		 * 收到出牌的推送
		 */
		public onChuPai(data:any){
			var game:DouDiZhuGame = DouDiZhuGameData.getCurrentGame();
			if(data.game != null){
				game = data.game;
			}else{
				game.currentUid = data.currentUid;
				game.perUid = data.sender;
			}
			if(data.cardsInfo != null){
				game.cardsInfo = data.cardsInfo;
			}
			DouDiZhuGameData.putCurrentGame(game);
			DouDiZhuGameData.putAdivcePokers({});
			//游戏结束
			if(data.endData != null){
				SoundManager.stopGameSound("time1.mp3");
				egret.setTimeout(function():void{
					this.onGameOver(data.endData);
				},this,900);
				DouDiZhuGameData.getCurrentGame().currentUid = null;
			}
			this.gamePanel.timedown.show();
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
			
			this.gamePanel.updateDifenText();
			this.gamePanel.updateBeishuText();
			this.gamePanel.updateLunshuText();
			

			var roleinfo = DouDiZhuRoleData.getRole(game.perUid);
			var soundName = "";
			var outcard:any = {};
			outcard = game.outCards[game.perUid];
			var type:number = PokerUtil.getTypeByOutCards(outcard);
			switch(type){
				case 0:
				var num :number = Math.ceil(Math.random()*4) ;
				soundName = roleinfo.sex+"/pass"+num+".mp3";
				break;
				case 1:
				soundName = roleinfo.sex+"/"+outcard[0][1]+".mp3";
				break;
				case 2:
				soundName = roleinfo.sex+"/dui"+outcard[0][1]+".mp3";
				break;
				case 3:
				soundName = roleinfo.sex+"/three"+outcard[0][1]+".mp3";
				break;
				case 4:
				soundName = roleinfo.sex+"/sandaiyi.mp3";
				break;
				case 5:
				soundName = roleinfo.sex+"/sandaiyidui.mp3";
				break;
				case 6:
				soundName = roleinfo.sex+"/shunzi.mp3";
				var mc:starlingswf.SwfMovieClip = DouDiZhuAsset.effSwf().createMovie("mc_shunzi_eff");
				mc.x = DouDiZhuAsset.gameWidth/2;
				mc.y = DouDiZhuAsset.gameHeight*0.35;
				mc.loop = false;
				this.gamePanel.mainAsset.addChild(mc);
				
				egret.setTimeout(function():void{
						this.gamePanel.mainAsset.removeChild(mc);
					},this,2000);
				break;
				case 7:
				soundName = roleinfo.sex+"/liandui.mp3";
				var mc:starlingswf.SwfMovieClip = DouDiZhuAsset.effSwf().createMovie("mc_liandui_eff");
				mc.x = DouDiZhuAsset.gameWidth/2;
				mc.y = DouDiZhuAsset.gameHeight*0.35;
				mc.loop = false;
				this.gamePanel.mainAsset.addChild(mc);
				egret.setTimeout(function():void{
						this.gamePanel.mainAsset.removeChild(mc);
					},this,2000);
				break;
				case 8:
				soundName = roleinfo.sex+"/feiji.mp3";
				SoundManager.playGameSound("feijiyin.mp3",1);
				var mc:starlingswf.SwfMovieClip = DouDiZhuAsset.effSwf().createMovie("mc_doudizhu_feiji_eff");
				mc.x = DouDiZhuAsset.gameWidth/2;
				mc.y = DouDiZhuAsset.gameHeight*0.35;
				mc.loop = false;
				this.gamePanel.mainAsset.addChild(mc);
				
				egret.setTimeout(function():void{
						this.gamePanel.mainAsset.removeChild(mc);
					},this,2000);
				break;
				case 9:
				soundName = roleinfo.sex+"/feiji.mp3";
				SoundManager.playGameSound("feijiyin.mp3",1);
				var mc:starlingswf.SwfMovieClip = DouDiZhuAsset.effSwf().createMovie("mc_doudizhu_feiji_eff");
				mc.x = DouDiZhuAsset.gameWidth/2;
				mc.y = DouDiZhuAsset.gameHeight*0.35;
				mc.loop = false;
				this.gamePanel.mainAsset.addChild(mc);
				egret.setTimeout(function():void{
						this.gamePanel.mainAsset.removeChild(mc);
					},this,2000);
				break;
				case 10:
				soundName = roleinfo.sex+"/feiji.mp3";
				SoundManager.playGameSound("feijiyin.mp3",1);
				var mc:starlingswf.SwfMovieClip = DouDiZhuAsset.effSwf().createMovie("mc_doudizhu_feiji_eff");
				mc.x = DouDiZhuAsset.gameWidth/2;
				mc.y = DouDiZhuAsset.gameHeight*0.35;
				mc.loop = false;
				this.gamePanel.mainAsset.addChild(mc);
				egret.setTimeout(function():void{
						this.gamePanel.mainAsset.removeChild(mc);
					},this,2000);
				break;
				case 11:
				soundName = roleinfo.sex+"/zhadan.mp3";
				SoundManager.playGameSound("boom.mp3",1);
				var mc:starlingswf.SwfMovieClip = DouDiZhuAsset.effSwf().createMovie("mc_doudizhu_zhadan_eff");
				mc.x = DouDiZhuAsset.gameWidth/2;
				mc.y = DouDiZhuAsset.gameHeight*0.35;
				mc.loop = false;
				this.gamePanel.mainAsset.addChild(mc);
				egret.setTimeout(function():void{
						this.gamePanel.mainAsset.removeChild(mc);
					},this,2000);
				break;
				case 12:
				soundName = roleinfo.sex+"/wangzha.mp3";
				SoundManager.playGameSound("boom.mp3",1);
				var mc:starlingswf.SwfMovieClip = DouDiZhuAsset.effSwf().createMovie("mc_doudizhu_zhadan_eff");
				mc.x = DouDiZhuAsset.gameWidth/2;
				mc.y = DouDiZhuAsset.gameHeight*0.35;
				mc.loop = false;
				this.gamePanel.mainAsset.addChild(mc);
				egret.setTimeout(function():void{
						this.gamePanel.mainAsset.removeChild(mc);
					},this,2000);
				break;
				case 13:
				soundName = roleinfo.sex+"/sidaier.mp3";
				break;
			}
			if(type != 0){
				SoundManager.playGameSound("dapai.mp3",1);
			}
			SoundManager.playGameSound(soundName,1);

			var cardcount:number = 0;
			if(game.perUid != RoleData.getRole().uid){
				cardcount = game.cardsInfo[game.perUid];
			}else{
				cardcount = PokerUtil.getCardsCount(game.cardsInfo[game.perUid]);
			}
			if(cardcount == 1){
				var value:any = DouDiZhuGameData.isWarning();
				if(value != null && value[roleinfo.uid+"_1"] != null){
					return;
				}
				if(value == null){
					value = {};
				}
				value[roleinfo.uid+"_1"] = 1;
				DouDiZhuGameData.isWarnned(value);
				soundName = roleinfo.sex+"/saysingle.mp3";
				
			}else if(cardcount == 2){
				var value:any = DouDiZhuGameData.isWarning();
				if(value != null && value[roleinfo.uid+"_2"] != null){
					return;
				}
				if(value == null){
					value = {};
				}
				value[roleinfo.uid+"_2"] = 1;
				DouDiZhuGameData.isWarnned(value);
				soundName = roleinfo.sex+"/saydouble.mp3";
			}else{
				return;
			}
			SoundManager.playGameSound(soundName,1);
		}

		/**
		 * 收到不出牌的推送
		 */
		public onBuChu(data:any){
			var game:DouDiZhuGame = DouDiZhuGameData.getCurrentGame();
			game.currentUid = data.currentUid;
			game.perUid = data.sender;
			if(data.cardsInfo != null){
				game.cardsInfo = data.cardsInfo;
			}
			DouDiZhuGameData.putCurrentGame(game);
			for(var k in game.ready){
				var showIndex:number = this.gamePanel.getRoleIndex(k);
				var head:RoleHead = this.gamePanel.roleHeads[showIndex];
				head.show();
			}
			if(game.currentUid == this.gamePanel.selfUid){
				this.gamePanel.updatechupaiBtns(true);
			}
			
		}
		/**
		 * 收到游戏结束的推送
		 */
		public onGameOver(data:any){
			var oldgame:DouDiZhuGame = DouDiZhuGameData.getCurrentGame();
			var game:DouDiZhuGame = data.game;
			DouDiZhuGameData.putCurrentGame(game);
			
			
			if(game.currentCount <= game.maxCount){
				//继续游戏
				SoundManager.playBgSound("welcome.mp3");
				if(game.isSpring == 1){
					var mc:starlingswf.SwfMovieClip = DouDiZhuAsset.effSwf().createMovie("mc_chuntian_eff");
					mc.x = DouDiZhuAsset.gameWidth/2;
					mc.y = DouDiZhuAsset.gameHeight*0.35;
					mc.loop = false;
					this.gamePanel.mainAsset.addChild(mc);
					egret.setTimeout(function():void{
						this.gamePanel.mainAsset.removeChild(mc);
						this.gamePanel.updateUiByGameOver();
						if(oldgame != null){
							this.gamePanel.addChild(new ResultPanel(game.money[RoleData.getRole().uid] > oldgame.money[RoleData.getRole().uid]));
						}
					},this,2000);
				}else{
					this.gamePanel.updateUiByGameOver();
					if(oldgame != null){
						this.gamePanel.addChild(new ResultPanel(game.money[RoleData.getRole().uid] > oldgame.money[RoleData.getRole().uid]));
					}
				}
			}else{
				if(game.isSpring == 1){
					var mc:starlingswf.SwfMovieClip = DouDiZhuAsset.effSwf().createMovie("mc_chuntian_eff");
					mc.x = DouDiZhuAsset.gameWidth/2;
					mc.y = DouDiZhuAsset.gameHeight*0.35;
					mc.loop = false;
					this.gamePanel.mainAsset.addChild(mc);
					this.gamePanel.updateUiByGameOver();
					egret.setTimeout(function():void{
						this.gamePanel.mainAsset.removeChild(mc);
						//进行结算
						SoundManager.stopGameSound("bgm.mp3");
						lzm.Alert.alert(new EndPanel());
					},this,2000);
				}else{
					//进行结算
					this.gamePanel.updateUiByGameOver();
					egret.setTimeout(function():void{
						//进行结算
						SoundManager.stopGameSound("bgm.mp3");
						lzm.Alert.alert(new EndPanel());
					},this,2000);
				}
				SoundManager.stopGameSound("welcome.mp3");
				SoundManager.stopGameSound("time1.mp3");
			}
			
		}
		public onEndGame(data:any){
			var game:DouDiZhuGame = data.game;
			DouDiZhuGameData.putCurrentGame(game);
			SoundManager.stopGameSound("welcome.mp3");
			SoundManager.stopGameSound("bgm.mp3");
			//进行结算
			lzm.Alert.alert(new EndPanel());
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