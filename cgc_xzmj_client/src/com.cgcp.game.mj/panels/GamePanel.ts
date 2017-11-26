module lj.cgcp.game.scmj_204 {
	export class GamePanel extends BasePanel {

		public roomIdText:egret.TextField;
		public readyBtn:starlingswf.SwfButton;
		public mjCountText:egret.TextField;
		public gameCountText:egret.TextField;
		public yaoqingBtn:starlingswf.SwfButton;
		public fanhuiwxBtn:starlingswf.SwfButton;
		public chupaiTips:starlingswf.SwfSprite;
        public noticeText:egret.TextField;

		public dingpaiBtn:starlingswf.SwfButton;

		public lacktiaoBtn:starlingswf.SwfButton;
		public lacktongBtn:starlingswf.SwfButton;
		public lackwanBtn:starlingswf.SwfButton;

		public leaveBtn:starlingswf.SwfButton;
		public leaveBtn2:starlingswf.SwfButton;
		public settingBtn:starlingswf.SwfButton;

		public timerDown:TimerDown;
		public roleHeads:any;
		public mjListContainers:any;


		public dataParse:GameDataParse;

		public lastChupaiIndex:number;//上一次被标记为出牌人的位置

		public voiceBtn:starlingswf.SwfButton;
		public chatBtn:starlingswf.SwfButton;

		public constructor() {
			super();
		}

		public init():void{
			this.dataParse = new GameDataParse(this);
			this.lastChupaiIndex = -1;

			var room:Room = RoomData.getCurrentRoom();
			this.roomIdText.text = `${room.id}`;
			this.initHeads();
			this.initMjListContainer();
			this.mjCountText = this.chupaiTips.getTextField("mjCountText");
			this.gameCountText = this.chupaiTips.getTextField("gameCountText");
			this.timerDown = new TimerDown(this.chupaiTips.getChildByName("timerDown") as starlingswf.SwfSprite);
			this.chupaiTips.visible = false;

			this.voiceBtn = VoiceButton.createVoiceButton();
			this.voiceBtn.x = 1018;
			this.voiceBtn.y = 328 + 86;
			this.mainAsset.addChild(this.voiceBtn);

			this.chatBtn = ChatButton.createChatButton();
			this.chatBtn.x = 1018;
			this.chatBtn.y = 328;
			this.mainAsset.addChild(this.chatBtn);

			if(RoomData.getCurrentRoom().owner == RoleData.getRole().uid){
				(this.leaveBtn.skin as starlingswf.SwfSprite).getChildAt(2).visible = false;
				(this.readyBtn.skin as starlingswf.SwfSprite).getChildAt(1).visible = false;
			}else{
				(this.leaveBtn.skin as starlingswf.SwfSprite).getChildAt(1).visible = false;
				(this.readyBtn.skin as starlingswf.SwfSprite).getChildAt(2).visible = false;
			}
            var game:MajiangGame = MajiangGameData.getCurrentGame();
            var str:string = ""+(game.zimoType==1?"自摸加番 ":"自摸加底 ")
                                +(game.maxFan==-1?"不限番 ":(game.maxFan+"番 "))
                                +(game.gangFlower == 1?"点杠花(自摸) ":"点杠花(放炮) ")
                                +(game.hujiaozhuanyi ? "呼叫转移 ":"")
                                +(game.menqingType ? "门清 中张 ":"")
                                +(game.jiangduiType ? "幺九 将对 ":"");
            this.noticeText.text = str;

			this.updateUi();
			
			this.addEventListener("ON_MJCLICK_MASK",this.onMaskMj,this);
        }
        public onMaskMj(e:egret.Event){
            for(var k in this.mjListContainers){
                (<MjListPanel>this.mjListContainers[k]).maskMj(parseInt(e.data.name),e.data.ismask);
            }
        }

		// public test(type:number){
		// 	var game:MajiangGame = MajiangGameData.getCurrentGame();
		// 	for(var k in game.ready){
		// 		var mjlistPanel:MjListPanel = this.getMjListPanel(k);
		// 		mjlistPanel.clearThreeMj();
		// 		mjlistPanel.showThreeMj();
		// 		mjlistPanel.moveThreeMj(type);
		// 	}
		// }
		public initHeads(){
			if(this.roleHeads == null){
				this.roleHeads = {};
				var headAsset:starlingswf.SwfSprite;
				var head:RoleHead;
				for(var i:number = 1; i < 5 ; i++){
					headAsset = this.mainAsset.getSprite("head" + i);
					head = new RoleHead(headAsset);
					this.roleHeads[i] = head;
				}
			}
		}

		/**
		 * 初始化麻将列表
		 */
		public initMjListContainer():void{
			if(this.mjListContainers == null){
				this.mjListContainers = {};
				var mjlistPanel:MjListPanel;
				for(var i:number = 4; i >= 1 ; i--){
					if(i == 1){
						mjlistPanel = new MjListPanel();
					}else if(i == 2){
						mjlistPanel = new MjListPanel3();
					}else if(i == 3){
						mjlistPanel = new MjListPanel2();
					}else if(i == 4){
						mjlistPanel = new MjListPanel1();
					}
					this.addChild(mjlistPanel);
					this.mjListContainers[i] = mjlistPanel;
				}
			}
		}

		public updateHeads(){
			var head:RoleHead;
			for(var i:number = 1; i < 5 ; i++){
				head = this.roleHeads[i];
				head.hide();
			}
			var players = RoomData.getCurrentRoom().players;
			for(var k in players){
				head = this.roleHeads[this.getRoleIndex(players[k])];
				head.init(players[k]);
				head.show();
			}
		}

		public updateMjlistContainer(showMjTween:boolean):void{
			var selfUid:string = RoleData.getRole().uid;
			this._showMjTween = showMjTween;
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			var players:any = RoomData.getCurrentRoom().players;
			var uid:string;
			var index:number;
			var mjlistPanel:MjListPanel;
			var count:number = 0;
			for(var key in game.lackTypes){
				count++;
			}
			for(var k in players){
				uid = players[k];
				index = this.getRoleIndex(uid);
				mjlistPanel = this.mjListContainers[index];
				if(mjlistPanel != null){
					mjlistPanel.setUid(uid);
					mjlistPanel.refreshAll(showMjTween);
					if(!game.ischange && MajiangGameData.isSelectThree(uid)){
						mjlistPanel.showThreeMj();
					}
					//订缺后继续下面操作
					if(count != 4){
						continue;
					}
					if(uid == selfUid && MajiangGameData.needShowOp){
						mjlistPanel.showOption(game.lastMj);
						MajiangGameData.needShowOp = false;
					}
					if(uid == game.lastUid){
						mjlistPanel.showCurrentMjTag();
					}
					if(uid == selfUid && game.chupai && game.currentUid == selfUid){
						if((game.lOpUid == selfUid && game.lOpVal == 3) || game.lOpUid != selfUid){
							if(MajiangConstant.findHu(-1,MajiangGameData.getMjs())){
								mjlistPanel.showZiMo();
							}
							mjlistPanel.showGangSelf();
						}
					}
				}
			}
		}

		/**
		 * 标记当前出牌的人是谁
		 */
		public tagChupai():void{
			var roleHead:RoleHead;
			if(this.lastChupaiIndex != -1){
				roleHead = this.roleHeads[this.lastChupaiIndex];
				roleHead.effkuang.visible = false;
			}
			var uid:string = MajiangGameData.getCurrentGame().currentUid;
			var index:number = this.getRoleIndex(uid);
			this.lastChupaiIndex = index;
			roleHead = this.roleHeads[index];
			roleHead.effkuang.visible = true;

			this.timerDown.arrowMC.gotoAndPlay("f"+index);
			this.timerDown.start();
		}

		/**
		 * 更新麻将剩余张数
		 */
		public updateMjCountText():void{
			this.mjCountText.text = MajiangGameData.getMjCount().toString();
		}

		/**
		 * 清理桌子
		 */
		public clearTable():void{
			var head:RoleHead;
			for(var k in this.roleHeads){
				head = this.roleHeads[k];
				head.effkuang.visible = false;
				head.showReady();
			}
			var mjContainer:MjListPanel;
			for(var k in this.mjListContainers){
				mjContainer = this.mjListContainers[k];
				mjContainer.clear();
				mjContainer.hideCurrentMjTag();
			}
			this.timerDown.stop();
			this.timerDown.arrowMC.gotoAndStop("f0");
			this.timerDown.timeText.text = "25";
		}
		private _showMjTween:boolean = true;
		/**
		 * 刷新一些按钮的状态
		 */
		public updateBtns():void{
			if(ExtGameHelper.gameIsStart()){
				this.leaveBtn.visible = this.yaoqingBtn.visible = this.fanhuiwxBtn.visible = false;
				this.leaveBtn2.visible = this.settingBtn.visible = true;
			}else{
				this.leaveBtn.visible = this.yaoqingBtn.visible = this.fanhuiwxBtn.visible = true;
				this.leaveBtn2.visible = this.settingBtn.visible = false;
			}
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			//选择缺牌
			if(game.lackTypes[RoleData.getRole().uid] == null && game.isStart && game.ischange){
				this.lacktiaoBtn.visible = this.lackwanBtn.visible = this.lacktongBtn.visible = true;
			}else{
				this.lacktiaoBtn.visible = this.lackwanBtn.visible = this.lacktongBtn.visible = false;
			}
			//选择换三张
			if(MajiangGameData.isSelectThree(RoleData.getRole().uid)){
				this.dingpaiBtn.visible = false;
			}else if(game.isStart && !game.ischange){
				if(this._showMjTween){
					egret.setTimeout(function():void{
						this.dingpaiBtn.visible = true;
					},this,1200);
				}else{
					this.dingpaiBtn.visible = true;
				}
			}else{
				this.dingpaiBtn.visible = false;
			}
		}


		public updateUi():void{
			var selfUid:string = RoleData.getRole().uid;
			var game:MajiangGame = MajiangGameData.getCurrentGame();

			this.updateHeads();
			this.updateMjCountText();
			if(game.isStart) {
				this.updateMjlistContainer(false);
				this.tagChupai();
				this.chupaiTips.visible = true;
			}else{
				this.clearTable();
				this.chupaiTips.visible = false;
			}

			this.updateBtns();
			
			//处理在换三张阶段，界面的显示恢复问题


			if(game.ready != null && game.ready[selfUid]){
				this.readyBtn.visible = false;
			}else{
				this.readyBtn.visible = true;
			}

			this.gameCountText.text = `${game.currentCount}/${game.maxCount}`;
		}
		public on_dingpaiBtn(e:egret.Event){
			var mjs:number[] = MajiangGameData.getSelectMj();
			if(mjs == null || mjs.length != 3){
				ApiState.showText("请选择3个麻将");
				return;
			}
			if(!MajiangConstant.isSameType(mjs)){
				ApiState.showText("请选择同种花色的麻将");
				return;
			}
			MjGameApi.changethree(mjs);
			this.dingpaiBtn.visible = false;
		}
		public on_lacktongBtn(e:egret.Event){
			MjGameApi.lacking(1);
			this.lacktiaoBtn.visible = this.lackwanBtn.visible = this.lacktongBtn.visible = false;
			SoundManager.playGameSound("lacking.mp3");
		}
		public on_lacktiaoBtn(e:egret.Event){
			MjGameApi.lacking(2);
			this.lacktiaoBtn.visible = this.lackwanBtn.visible = this.lacktongBtn.visible = false;
			SoundManager.playGameSound("lacking.mp3");
		}
		public on_lackwanBtn(e:egret.Event){
			MjGameApi.lacking(3);
			this.lacktiaoBtn.visible = this.lackwanBtn.visible = this.lacktongBtn.visible = false;
			SoundManager.playGameSound("lacking.mp3");
		}
		public on_leaveBtn(e:egret.Event){
			var room:Room = RoomData.getCurrentRoom();
			if(room.owner == RoleData.getRole().uid){
				ExtGameHelper.disbandRoom();
			}else{
				ExtGameHelper.leaveRoom();
			}
		}

		public on_leaveBtn2(e:egret.Event){
			this.on_leaveBtn(e);
		}

		public on_settingBtn(e:egret.Event):void{
			// this.test(1);
			// egret.setTimeout(function():void{
			// 	this.test(2);
			// },this,1500);
			// egret.setTimeout(function():void{
			// 	this.test(3);
			// },this,2500);
			ExtGameHelper.showSetting();
		}

		public on_readyBtn(e:egret.Event):void{
			var room:Room = RoomData.getCurrentRoom();
			if(room.owner != RoleData.getRole().uid){
				MjGameApi.ready();
			}else{
				var playerCount:number = 0;
				var readyCount:number = 0;
				var players:any = room.players;
				var readys:any = MajiangGameData.getCurrentGame().ready;
				for(var index in players){
					playerCount++;
					if(readys != null && readys[players[index]]){
						readyCount++;
					}
				}
				if(playerCount != 4){
					ApiState.showText("必须4个人才能开始游戏");
					return;
				}
				if(readyCount != 3){
					ApiState.showText("必须所有人准备才能开始游戏");
					return;
				}
				MjGameApi.ready();
			}
		}

		public on_yaoqingBtn(e:egret.Event):void{
			ExtGameHelper.showShareTip();
		}

		public on_fanhuiwxBtn(e:egret.Event):void{
			ExtGameHelper.backToWx();
		}
		
		/**
		 * 获取玩家麻将控制器
		 */
		public getMjListPanel(uid:string):MjListPanel{
			var index:number = this.getRoleIndex(uid);
			return this.mjListContainers[index];
		}

		/**
		 * 获取玩家头像
		 */
		public getRoleHead(uid:string):RoleHead{
			var index:number = this.getRoleIndex(uid);
			return this.roleHeads[index];
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
			var maxSet:number = 4;
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
			return "spr_main";
		}
        public assetSwf(): starlingswf.Swf{
			return MjGameAsset.mainSwf;
		}
		public dispose(){
			super.dispose();
			this.timerDown.dispose();
			this.removeEventListener("ON_MJCLICK_MASK",this.onMaskMj,this);
			for(var k in this.mjListContainers){
				this.mjListContainers[k].dispose();
			}
			for(var k in this.roleHeads){
				this.roleHeads[k].dispose();
			}
			VoiceButton.destroyVocieButton(this.voiceBtn);
			ChatButton.destroyChatButton(this.chatBtn);
		}
	}
}