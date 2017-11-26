module lj.cgcp.game.scmj_204 {
	export class GameDataParse {

		public selfUid:string;
		public gamePanel:GamePanel;
		public tagEvents:any;

		public constructor(gamePanel:GamePanel) {
			this.selfUid = RoleData.getRole().uid;
			this.gamePanel = gamePanel;
			this.tagEvents = {};
			this.tagEvents['ready'] = this.onReady;
			this.tagEvents['changethree'] = this.onChangeThree;
			this.tagEvents['lacking'] = this.onLacking;
			this.tagEvents['startGame'] = this.onStartGame;
			this.tagEvents['chupai'] = this.onChupai;
			this.tagEvents['endGame'] = this.onEndGame;
			this.tagEvents['updateCurrentUid'] = this.onUpdateCurrentUid;
			this.tagEvents['qiangganghu'] = this.onQiangGangHu;
			this.tagEvents['hupai'] = this.hupai;
			this.tagEvents['operating'] = this.onOperating;
			this.tagEvents['huangzhuang'] = this.huangzhuang;
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
			game.alreadyHus = {};//下一局清空胡牌数据
			head.updateHu();
			head.updateLack();
			if(game.ready == null){
				game.ready = {};
			}
			game.ready[uid] = true;
		}

		public onChangeThree(data:any){
			var uid:string = data.sender;
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			game.mjCount[uid] = 10;
			game.ischange = false;
			MajiangGameData.updateThreeSelect(uid);
			MajiangGameData.putCurrentGame(game);

			var head:RoleHead = this.gamePanel.getRoleHead(uid);
			head.clockTb.visible = false;

			var mjListPanel:MjListPanel = this.gamePanel.getMjListPanel(uid);
			if(uid == this.selfUid){
				//移除麻将数据
				var mjs:number[] = MajiangGameData.getSelectMj();
				var mjList:number[] = MajiangGameData.getMjs();
				for(var key in mjs){
					var index:number = mjList.indexOf(mjs[key]);
					if(index != -1){
						mjList.splice(index,1);
					}
				}
				MajiangGameData.putMjs(mjList);
				//清空选中数据
				mjListPanel.currentChooseMjs = [];
				MajiangGameData.putSelectMj([]);
			}
			//摆出三张牌，刷新手牌列表
			mjListPanel.showThreeMj();
			mjListPanel.refreshMjList(false);
			
			if(data.ischange){
				//显示特效
				egret.setTimeout(function():void{
					for(var key in game.ready){
						var mjListPanel:MjListPanel = this.gamePanel.getMjListPanel(key);
						mjListPanel.moveThreeMj(data.changetype);
					}
				},this,500);
				//更新手牌
				egret.setTimeout(function():void{
					var game:MajiangGame = MajiangGameData.getCurrentGame();
					game.ischange = true;
					//他人麻将
					for(var key in game.ready){
						game.mjCount[key] = 13;
					}
					MajiangGameData.putCurrentGame(game);
					//自己麻将
					if(data.mjList){
						MajiangGameData.putMjs(data.mjList);
					}
					for(var key in game.ready){
						var head:RoleHead = this.gamePanel.getRoleHead(key);
						head.clockTb.visible = true;
						var mjListPanel:MjListPanel = this.gamePanel.getMjListPanel(key);
						mjListPanel.clearThreeMj();
						mjListPanel.refreshMjList(false,-1,key == this.selfUid?(data.threeMj):[]);//如果是当前玩家，将刚获得的牌太高显示
					}
					this.gamePanel.updateBtns();
				},this,2000);
			}
		}
		public onLacking(data:any){
			var uid:string = data.sender;
			var lacktype:number = data.lackType;
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			game.lackTypes[uid] = lacktype;
			var chupai:boolean = false;
			if(data.chupai != null){
				chupai = data.chupai;
			}

			if(chupai){
				game.chupai = true;
				var mjlistpanel:MjListPanel = this.gamePanel.getMjListPanel(RoleData.getRole().uid);
				mjlistpanel.refreshMjList(false);
				if(game.currentUid == RoleData.getRole().uid){
					var mjlist:number[] = MajiangGameData.getMjs();
					var canHu:boolean = MajiangConstant.findHu(-1,mjlist);
                    if(canHu){
                        mjlistpanel.showZiMo();
                    }
                    mjlistpanel.showGangSelf();
                }

				
				this.gamePanel.updateMjCountText();
				
				this.gamePanel.tagChupai();
				for(var k in game.ready){
					var head:RoleHead = this.gamePanel.getRoleHead(k);
					head.init(k);
				}
			}else{
				var mjlistpanel:MjListPanel = this.gamePanel.getMjListPanel(RoleData.getRole().uid);
				mjlistpanel.refreshMjList(false);
				var head:RoleHead = this.gamePanel.getRoleHead(uid);
				head.updateLack();
				head.clockTb.visible = false;
			}
			
		}
		public onStartGame(data:any){
			MajiangGameData.putCurrentGame(data.game);
			MajiangGameData.putMjs(data.mjList);
			MajiangGameData.setGangDi(data.gangdi);
			MajiangGameData.setThreeSelect(null);
			this.gamePanel.updateMjlistContainer(true);
			// this.gamePanel.tagChupai();
			this.gamePanel.updateMjCountText();
			this.gamePanel.chupaiTips.visible = true;
			this.gamePanel.updateBtns();

			var players = RoomData.getCurrentRoom().players;
			var head:RoleHead;
			for(var k in players){
				head = this.gamePanel.getRoleHead(players[k]);
				if(head){
					head.readyTag.visible = false;
					head.kickBtn.visible = false;
					head.init(players[k]);
				}
			}

			
			
		}

		public onChupai(data:any):void{
			MajiangGameData.putCurrentGame(data.game);
				this._onChupai(data);
		}

		public _onChupai(data:any):void{
			var mjVal:number = parseInt(data.mjVal);
			var sender:string = data.sender;
			if(sender == this.selfUid){
				MajiangGameData.removeMj(mjVal);
			}

			// for(var index in this.gamePanel.roleHeads){
			// 	(<RoleHead>this.gamePanel.roleHeads[index]).clockTb.visible = true;
            //     (<RoleHead>this.gamePanel.roleHeads[index]).clockTb.alpha = 0;
			// }
            // egret.setTimeout(function():void{
            //     for(var index in this.gamePanel.roleHeads){
            //         (<RoleHead>this.gamePanel.roleHeads[index]).clockTb.alpha = 1;
            //     }
            // },this,1500);

			var mjListPanel:MjListPanel = this.gamePanel.getMjListPanel(sender);
			mjListPanel.refreshMjList(false);
			mjListPanel.addChupaiList(mjVal);
			mjListPanel.showBigMj(mjVal);

				mjListPanel = this.gamePanel.mjListContainers[1];
				mjListPanel.showOption(mjVal);

			SoundManager.playGameSound("dapai.mp3");

			var role:Role = RoomData.getRole(sender);
			SoundConstant.playSound(role.sex,mjVal.toString());
		}
		/**
		 * 操作命令
		 */
		public onOperating(data:any):void{
			var head:RoleHead = this.gamePanel.getRoleHead(data.sender);
			head.clockTb.visible = false;
		}
		public onQiangGangHu(data:any):void{
			var game:MajiangGame = data.game;
			
			MajiangGameData.putCurrentGame(game);
			MajiangGameData.setOpList(null);
			if(data.mjList != null){
				MajiangGameData.putMjs(data.mjList);
			}
			var opUid:string = data.sender;
			for(var index in this.gamePanel.roleHeads){
				(<RoleHead>this.gamePanel.roleHeads[index]).clockTb.visible = false;
			}
			
			if(opUid){
				var mjListPanel:MjListPanel = this.gamePanel.getMjListPanel(opUid);
				mjListPanel.refreshMjList(false);
				mjListPanel.refreshGpc();
				mjListPanel.showOptVal(3);

				var role:Role = RoomData.getRole(opUid);
				SoundConstant.playGangSound(role.sex,3)
			}
			if(game.alreadyHus[this.selfUid] == null){
				//显示胡牌和过牌（这里是抢杠胡的按钮）
				var canHu = MajiangConstant.findHu(game.lastMj,MajiangGameData.getMjs());
				if(canHu && this.selfUid != opUid){
					var mjListPanel:MjListPanel = this.gamePanel.getMjListPanel(this.selfUid);
					mjListPanel.showQiangGangHu();
				}else{
					MjGameApi.qiangganghu(0);
				}
			}
		}
		public onUpdateCurrentUid(data:any):void{
            var game:MajiangGame = MajiangGameData.getCurrentGame();
            var o_fandata:any = game.fanData;
            var n_fandata:any = data.game.fanData;
            game = data.game;
			
			MajiangGameData.putCurrentGame(game);
			MajiangGameData.setOpList(null);
			if(data.mjList != null){
				MajiangGameData.putMjs(data.mjList);
			}

			for(var index in this.gamePanel.roleHeads){
                var rolehead:RoleHead = this.gamePanel.roleHeads[index];
                rolehead.clockTb.visible = false;
                var o_score:number = o_fandata && o_fandata[rolehead.uid]?o_fandata[rolehead.uid]:0;
                var n_score:number = n_fandata && n_fandata[rolehead.uid]?n_fandata[rolehead.uid]:0;
                rolehead.showMoveScore(n_score-o_score);
			}

			var opUid:string = data.opUid;
			var opVal:number = data.opVal;
			if(opUid){
				var mjListPanel:MjListPanel = this.gamePanel.getMjListPanel(data.opUid);
				mjListPanel.refreshMjList(false,data.newMjVal);
				mjListPanel.refreshGpc();
                //胡牌特效在胡牌接口里面显示
                if(opVal < 4 || opVal > 5){
                    mjListPanel.showOptVal(opVal);
                }


				if(opVal > 0 && opVal < 5 && MajiangGameData.getCurrentGame().lastUid != null){
					mjListPanel = this.gamePanel.getMjListPanel(MajiangGameData.getCurrentGame().lastUid);
					mjListPanel.refreshChupaiList();
					mjListPanel.hideCurrentMjTag();
				}

				var role:Role = RoomData.getRole(opUid);
				if(opVal == 1) SoundManager.playGameSound(`${role.sex}/chi.mp3`);
				else if(opVal == 2) SoundConstant.playSound(role.sex,"peng");
				else if(opVal == 3) SoundConstant.playGangSound(role.sex,3);
			}
			this.gamePanel.tagChupai();
			if(data.newMj){
				// if(data.opVal == 3){
				// 	MajiangGameData.getCurrentGame().currentMj2++;
				// }else{
				// 	MajiangGameData.getCurrentGame().currentMj++;
				// }
				this.gamePanel.updateMjCountText();
			}
			if(data.newMjVal || data.newMjVal == 0){
				MajiangGameData.getCurrentGame().newMj = data.newMjVal;
				if(game.passHuList[game.currentUid] != null){
                    game.passHuList[game.currentUid] = null;    
                }

				var mjListPanel:MjListPanel = this.gamePanel.mjListContainers[1];
				mjListPanel.addNewMj(data.newMjVal);
				
				var canHu:boolean = MajiangConstant.findHu(-1,data.mjList);
				var mjCount:number = MajiangGameData.getMjCount();
				if(mjCount < 4){
					if(canHu){
						mjListPanel.showZiMo();
					}else{
						mjListPanel.showGangSelf();
					}
				}else{
					if(canHu){
						mjListPanel.showZiMo();
					}
					mjListPanel.showGangSelf();
				}

				
			}
		}

		public hupai(data:any):void{
			var oldgame:MajiangGame = MajiangGameData.getCurrentGame();
			MajiangGameData.putCurrentGame(data.game);
			var game:MajiangGame = data.game;
			var sender:string[] = data.sender;
			for(var index in this.gamePanel.roleHeads){
                var rolehead:RoleHead = this.gamePanel.roleHeads[index];
                var o_score:number = oldgame.fanData && oldgame.fanData[rolehead.uid]?oldgame.fanData[rolehead.uid]:0;
				var n_score:number = game.fanData && game.fanData[rolehead.uid]?game.fanData[rolehead.uid]:0;
				rolehead.showMoveScore(n_score - o_score);
			}
			for(var i in sender){
				var mjListPanel:MjListPanel = this.gamePanel.getMjListPanel(sender[i]);
				mjListPanel.showOptVal(data.opVal);
				var head:RoleHead = this.gamePanel.getRoleHead(sender[i]);
				if(head){
					head.updateHu();
				}

				var role:Role = RoomData.getRole(sender[i]);
				if(data.opVal == 5){
					if(MajiangConstant.getAnyCount( game.alreadyHus)>1){
						SoundManager.playGameSound(`${role.sex}/hu_zimo_1.mp3`);
					}else{
						SoundManager.playGameSound(`${role.sex}/hu_zimo.mp3`);
					}
				}else{
					SoundConstant.playSound(role.sex,"hu");
				}
				
				var thisObj:GameDataParse = this;

			}
			if(MajiangConstant.getAnyCount(game.alreadyHus) == 3){
				egret.setTimeout(function():void{
					new EndPanel1(thisObj.gamePanel,data.sender,data.allMjs,data._158).create158List(data._158);
					var selfuid:string = RoleData.getRole().uid;
					if(!oldgame.totalFan){
						if(game.totalFan[selfuid] > 0){
							SoundManager.playGameSound("win.mp3");
						}
					}else if(oldgame.totalFan && oldgame.totalFan[selfuid] < game.totalFan[selfuid]){
						SoundManager.playGameSound("win.mp3");
					}
				},this,3000);
			}
			var paoUid = MajiangGameData.getCurrentGame().pao;
			if( paoUid != null){
				mjListPanel = this.gamePanel.getMjListPanel(paoUid);
				if(mjListPanel != null){
					mjListPanel.showOptVal(100);
					mjListPanel.refreshGpc();
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

	}
}