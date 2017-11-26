module lj.cgcp.game.qdmj_705 {
	export class GamePanel extends BasePanel {

		public roomIdText:egret.TextField;
		public readyBtn:starlingswf.SwfButton;
		public mjCountText:egret.TextField;
		public gameCountText:egret.TextField;
		public yaoqingBtn:starlingswf.SwfButton;
		public fanhuiwxBtn:starlingswf.SwfButton;
		public chupaiTips:starlingswf.SwfSprite;
		public hunMjObj:starlingswf.SwfSprite;
		public leaveBtn:starlingswf.SwfButton;
		public leaveBtn2:starlingswf.SwfButton;
		public settingBtn:starlingswf.SwfButton;

		public timerDown:TimerDown;
		public roleHeads:any;
		public mjListContainers:any;

		// public gangdi51:egret.Bitmap;
		// public gangdi52:egret.Bitmap;

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
			this.updateHunMj();
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

			// this.gangdi51.visible = false;
			// this.gangdi52.visible = false;

			this.updateUi();
		
		}

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
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			var players:any = RoomData.getCurrentRoom().players;
			var uid:string;
			var index:number;
			var mjlistPanel:MjListPanel;
			for(var k in players){
				uid = players[k];
				index = this.getRoleIndex(uid);
				mjlistPanel = this.mjListContainers[index];
				if(mjlistPanel != null){
					mjlistPanel.setUid(uid);
					mjlistPanel.refreshAll(showMjTween);
					if(uid == selfUid && MajiangGameData.needShowOp){
						if(MajiangGameData.isQiangGang){
							mjlistPanel.showQiangGangOption(game.lastGangMj);
							MajiangGameData.isQiangGang = false;
						}else{
							mjlistPanel.showOption(game.lastMj);
						}
						MajiangGameData.needShowOp = false;
					}
					if(uid == game.lastUid){
						mjlistPanel.showCurrentMjTag();
					}
					if(uid == selfUid && game.chupai && game.currentUid == selfUid){
						if(!(game.lOpUid == selfUid && (game.lOpVal == 1 || game.lOpVal == 2))){// || game.lOpUid != selfUid
							if(MajiangConstant.findHu(-1,MajiangGameData.getMjs())){
								mjlistPanel.showZiMo();
							}
							mjlistPanel.showGangSelf();
						}
						mjlistPanel.showNiu();
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
		}

		/**
		 * 更新两个杠底5饼的状态
		 */
		public updateHunMj():void{
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			if(this.hunMjObj == null){
				this.hunMjObj = MjGameAsset.mjSwf.createSprite("spr_mj_3");
			}
			var bit:egret.Bitmap = this.hunMjObj.getChildAt(1) as egret.Bitmap;
			bit.texture = RES.getRes("img_MJ_PX_" + game.hunMj);
			this.hunMjObj.visible = game.hunMj != -1;
			//添加万能logo 并调整万能logo的位置
			var bitmap:egret.Bitmap = MjGameAsset.mjSwf.createImage("img_QDLOGO");
				bitmap.scaleX = 0.5;
				bitmap.scaleY = 0.5;
				bitmap.x = bit.x + 9.5;
				bitmap.y = bit.y + 24;
			this.hunMjObj.addChild(bitmap);
			// 调整混麻将的位置
			this.hunMjObj.scaleX = 1.2;
			this.hunMjObj.scaleY = 1.2;
			this.hunMjObj.x = 160;
			this.hunMjObj.y =26;
			//将混麻将添加到页面上
			this.addChild(this.hunMjObj)
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
			this.updateHunMj();

			if(game.ready != null && game.ready[selfUid]){
				this.readyBtn.visible = false;
			}else{
				this.readyBtn.visible = true;
			}

			this.gameCountText.text = `${game.currentCount}/${game.maxCount}`;
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