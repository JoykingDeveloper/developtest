module lj.cgcp.game.qdmj_705 {
	export class GameDataParse {

		public selfUid:string;
		public gamePanel:GamePanel;
		public tagEvents:any;

		public constructor(gamePanel:GamePanel) {
			this.selfUid = RoleData.getRole().uid;
			this.gamePanel = gamePanel;
			this.tagEvents = {};
			this.tagEvents['ready'] = this.onReady;
			this.tagEvents['startGame'] = this.onStartGame;
			this.tagEvents['chupai'] = this.onChupai;
			this.tagEvents['endGame'] = this.onEndGame;
			this.tagEvents['chooseNiu'] = this.onChooseNiu;
			this.tagEvents['updateCurrentUid'] = this.onUpdateCurrentUid;
			this.tagEvents['minggangCallBack'] = this.minggangCallBack;
			this.tagEvents['hupai'] = this.hupai;
			this.tagEvents['huangzhuang'] = this.huangzhuang;
			this.tagEvents['operating'] = this.onOperating;
		}

		public onJoinRoom(data:any){
			var roleHead:RoleHead = this.gamePanel.getRoleHead(data.sender);
			roleHead.init(data.sender);
			roleHead.show();
		}

		public onLeaveRoom(data:any){
			var sender:string = data.sender;
			var roleHead:RoleHead = this.gamePanel.getRoleHead(sender);
			roleHead.hide();
		}

		public onReady(data:any){
			var uid:string = data.uid;
			var head:RoleHead = this.gamePanel.getRoleHead(uid);
			if(head) head.readyTag.visible = true;
			if(uid == RoleData.getRole().uid){
				this.gamePanel.readyBtn.visible = false;
			}

			var game:MajiangGame = MajiangGameData.getCurrentGame();
			if(game.ready == null){
				game.ready = {};
			}
			game.ready[uid] = true;
		}

		public onStartGame(data:any){
			MajiangGameData.putCurrentGame(data.game);
			MajiangGameData.putMjs(data.mjList);
			// MajiangGameData.setGangDi(data.gangdi);

			this.gamePanel.updateMjlistContainer(true);
			this.gamePanel.tagChupai();
			this.gamePanel.updateMjCountText();
			this.gamePanel.chupaiTips.visible = true;
			this.gamePanel.updateBtns();
			this.gamePanel.updateHunMj();

			var players = RoomData.getCurrentRoom().players;
			var head:RoleHead;
			for(var k in players){
				head = this.gamePanel.getRoleHead(players[k]);
				if(head){
					head.readyTag.visible = false;
					head.kickBtn.visible = false;
					head.updateTing();
				}
			}

			var game:MajiangGame = data.game;
			if(game.currentUid == RoleData.getRole().uid){
				var mjListPanel:MjListPanel = this.gamePanel.mjListContainers[1];
				mjListPanel.showGangSelf();
				// mjListPanel.showNiu();//开局时在GamePanel有提示扭牌
			}
			
		}

		public onChupai(data:any):void{
			MajiangGameData.putCurrentGame(data.game);
			if(data.ting){
				var mjListPanel:MjListPanel = this.gamePanel.getMjListPanel(data.sender);
				mjListPanel.showOptVal(6);

				var roleHead:RoleHead = this.gamePanel.getRoleHead(data.sender);
				roleHead.updateTing();

				var thisObj:GameDataParse = this;
				egret.setTimeout(function():void{
					thisObj._onChupai(data);
				},thisObj,500);

				var role:Role = RoomData.getRole(data.sender);
				SoundManager.playGameSound(`${role.sex}/ting.mp3`);
			}else{
				this._onChupai(data);
			}
		}

		public _onChupai(data:any):void{
			var mjVal:number = parseInt(data.mjVal);
			var sender:string = data.sender;
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			if(sender == this.selfUid){
				MajiangGameData.removeMj(mjVal); //出牌，在手牌容器中删除该牌
			}

			for(var index in this.gamePanel.roleHeads){ // 将当前操作对象的始终倒计时显示出来
				(<RoleHead>this.gamePanel.roleHeads[index]).clockTb.visible = true;
			}

			var mjListPanel:MjListPanel = this.gamePanel.getMjListPanel(sender); //获取当前操作者的手牌面板
			mjListPanel.refreshMjList(false);// 刷新手牌面板
			mjListPanel.addChupaiList(mjVal); //出牌
			mjListPanel.showBigMj(mjVal); // 显示麻将的大图像突出

			if(sender == this.selfUid){
				MjGameApi.operating(0);
			}else{
				mjListPanel = this.gamePanel.mjListContainers[1];
				mjListPanel.showOption(mjVal);
			}

			SoundManager.playGameSound("dapai.mp3");

			var role:Role = RoomData.getRole(sender);
			SoundManager.playGameSound(`${role.sex}/${mjVal}.mp3`);
		}
		public onChooseNiu(data:any):void{//选择扭牌
			var game:MajiangGame = game = data.game;
			var sender:string = data.sender;//玩家uid
			var niuVal:number[] = data.niuVal;
			//决定是否可以扭牌
			if(data.isGroup){
				if(data.mjList != null){
					MajiangGameData.putMjs(data.mjList);
					var mjList:number[] = data.mjList;
					game.newMj = mjList[0];
				}
				MajiangGameData.putCurrentGame(game);
				
				if(niuVal.length > 1){
					var mjListPanel:MjListPanel = this.gamePanel.getMjListPanel(sender);
					if(mjListPanel){
						mjListPanel.refreshMjList(false);//刷新玩家手牌容器
						mjListPanel.refreshGpc(); //刷新杠碰吃的牌
					}
					if(sender == RoleData.getRole().uid){
						mjListPanel.showNiu();
					}
					var role:Role = RoomData.getRole(sender);
					SoundManager.playGameSound(`${role.sex}/niu.mp3`)
				}
				return;
			}
			var _niuVal:number = niuVal[0];
			//扭牌结束
			MajiangGameData.putCurrentGame(game);
			if(data.mjList != null){
				MajiangGameData.putMjs(data.mjList);
			}

			for(var index in this.gamePanel.roleHeads){
				(<RoleHead>this.gamePanel.roleHeads[index]).clockTb.visible = true;
			}
			//刷新扭牌后界面
			var mjListPanel:MjListPanel = this.gamePanel.getMjListPanel(sender);
			mjListPanel.refreshMjList(false);
			mjListPanel.addNiuList();
			mjListPanel.showBigMj(_niuVal);
			//对这张牌，发起操作
			if(sender == this.selfUid){
				MjGameApi.operating(0);
			}else{
				mjListPanel = this.gamePanel.mjListContainers[1];
				mjListPanel.showOption(_niuVal);
			}
			SoundManager.playGameSound("dapai.mp3");

			var role:Role = RoomData.getRole(sender);
			SoundManager.playGameSound(`${role.sex}/${_niuVal}.mp3`);
			SoundManager.playGameSound(`${role.sex}/niu.mp3`)
		}
		public lastUpdateCurrentUidData:any;
		public lastMingGangUid:string;
		public onUpdateCurrentUid(data:any):void{
			this.lastUpdateCurrentUidData = data;
			var game:MajiangGame = data.game;
			MajiangGameData.putCurrentGame(game);
			MajiangGameData.setOpList(null);
			if(data.mjList != null){
				MajiangGameData.putMjs(data.mjList);
			}

			for(var index in this.gamePanel.roleHeads){
				(<RoleHead>this.gamePanel.roleHeads[index]).clockTb.visible = false;
			}

			var opUid:string = data.opUid;
			var opVal:number = data.opVal;
			if(opUid){
				var mjListPanel:MjListPanel = this.gamePanel.getMjListPanel(data.opUid);
				mjListPanel.refreshMjList(false,data.newMjVal);
				mjListPanel.refreshGpc();
				mjListPanel.showOptVal(opVal);
				// if(opVal == 7){
				// 	mjListPanel.addNiuList();
				// }

				if(opVal > 0 && opVal < 4 && MajiangGameData.getCurrentGame().lastUid != null){
					mjListPanel = this.gamePanel.getMjListPanel(MajiangGameData.getCurrentGame().lastUid);
					mjListPanel.refreshChupaiList();
					mjListPanel.refreshNiuList();
					mjListPanel.hideCurrentMjTag();
				}

				var role:Role = RoomData.getRole(opUid);
				if(opVal == 1) SoundManager.playGameSound(`${role.sex}/chi.mp3`);
				else if(opVal == 2) SoundManager.playGameSound(`${role.sex}/peng.mp3`);
				else if(opVal == 3) SoundManager.playGameSound(`${role.sex}/gang.mp3`);
				else if(opVal == 6) SoundManager.playGameSound(`${role.sex}/ting.mp3`);
				if(opVal == 3 && data.minggang == 1){
					this.lastMingGangUid = opUid;
					//显示是否抢杠
					if(opUid != RoleData.getRole().uid){
						var mjListPanelTmp:MjListPanel = this.gamePanel.getMjListPanel(RoleData.getRole().uid);
						mjListPanelTmp.showQiangGangOption(data.gangMjVal);
					}else{
						MjGameApi.minggangCallBack(-8);
					}
					return;
				}
			}
			this._onUpdateCurrentUid(data);
		}
		public _onUpdateCurrentUid(data){ //切换当前用户id
			var game:MajiangGame = data.game;
			this.gamePanel.tagChupai();
			if(data.newMj){
				if(data.opVal == 3){
					MajiangGameData.getCurrentGame().currentMj2++;
				}else{
					MajiangGameData.getCurrentGame().currentMj++;
				}
				this.gamePanel.updateMjCountText();
				// this.gamePanel.updateHunMj();
			}

			var mjListPanel:MjListPanel = this.gamePanel.mjListContainers[1];
			var mjCount:number = MajiangGameData.getMjCount();
			if(data.newMjVal || data.newMjVal == 0){
				mjListPanel.addNewMj(data.newMjVal);
				
				var canHu:boolean = MajiangConstant.findHu(-1,data.mjList);
				if(mjCount < 4 && !canHu){
					egret.setTimeout(function():void{
						MjGameApi.chupai(data.newMjVal);
					},this,500);
				}else{
					if(canHu){
						mjListPanel.showZiMo();
						mjListPanel.showGangSelf();
						mjListPanel.showNiu();
					}else if(mjCount < 4){
						egret.setTimeout(function():void{
							MjGameApi.chupai(data.newMjVal);
						},this,500);
					}else{
						mjListPanel.showGangSelf();
						mjListPanel.showNiu();
					}
				}
			}else if(mjCount>4 && mjListPanel.uid == game.currentUid){//碰和吃后也要提示扭牌
				mjListPanel.showNiu();
			}
		}
		public minggangCallBack(data:any):void{
			var sender:string = data.sender;
			if(sender == this.lastMingGangUid){
				MajiangGameData.getCurrentGame().chupai = true;
				this._onUpdateCurrentUid(this.lastUpdateCurrentUidData);
			}
		}	
		public hupai(data:any):void{
			MajiangGameData.putCurrentGame(data.game);
			var sender:string = data.sender;
			var mjListPanel:MjListPanel = this.gamePanel.getMjListPanel(sender);
			mjListPanel.showOptVal(data.opVal);

			var role:Role = RoomData.getRole(sender);
			SoundManager.playGameSound(`${role.sex}/hu.mp3`);

			var thisObj:GameDataParse = this;
			egret.setTimeout(function():void{
				new EndPanel1(thisObj.gamePanel,data.sender,data.allMjs,data._158).create158List(data._158);
			},this,3000);

			if(MajiangGameData.getCurrentGame().pao != null){
				mjListPanel = this.gamePanel.getMjListPanel(MajiangGameData.getCurrentGame().pao);
				if(mjListPanel != null){
					mjListPanel.showOptVal(100);
				}
			}
		}

		public huangzhuang(data:any):void{
			MajiangGameData.putCurrentGame(data.game);

			var thisObj:GameDataParse = this;
			egret.setTimeout(function():void{
				lzm.Alert.alertLandscape(new EndPanel1(thisObj.gamePanel,null,data.allMjs,null));
				thisObj.gamePanel.updateUi();
			},this,2000);
		}

		public onEndGame(data:any):void{
			lzm.Alert.alertLandscape(new EndPanel2());
		}

		/**
		 * 操作命令
		 */
		public onOperating(data:any):void{
			var head:RoleHead = this.gamePanel.getRoleHead(data.sender);
			head.clockTb.visible = false;
		}
	}
}