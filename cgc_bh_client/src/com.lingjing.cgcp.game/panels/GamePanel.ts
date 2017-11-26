module lj.cgcp.game.baohuang {
	export class GamePanel extends BasePanel {

		public dataParse:GamePanelDataParse;
		public roomidText:egret.TextField;
		// public fangzhuText:egret.TextField;

		public roleHeads:any;
		public lunshuText:egret.TextField;
		public noticeText:egret.TextField;

		public pokerPanel:PokerPanel;
		//准备按钮
		public inviteBtn:starlingswf.SwfButton;
		public readyBtn:starlingswf.SwfButton;
		//出牌按钮
		public chupaiBtn:starlingswf.SwfButton;
		public buchuBtn:starlingswf.SwfButton;
		public tishiBtn:starlingswf.SwfButton;
		//登基让位
		public dengjiBtn:starlingswf.SwfButton;
		public rangweiBtn:starlingswf.SwfButton;
		//被抢登基或者让位
		public dengji1Btn:starlingswf.SwfButton;
		public rangwei1Btn:starlingswf.SwfButton;
		//抢独
		public qiangduBtn:starlingswf.SwfButton;
		public buqiangduBtn:starlingswf.SwfButton;
		//明保
		public mingbaoBtn:starlingswf.SwfButton;
		public anbaoBtn:starlingswf.SwfButton;
		//造反
		public zaofanBtn:starlingswf.SwfButton;
		public buzaofanBtn:starlingswf.SwfButton;


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
			ExtGameHelper.setBackGroundColor(0x373750);
			this.voiceBtn = VoiceButton.createVoiceButton();
			this.voiceBtn.x = BHAsset.gameWidth - this.voiceBtn.width*1.35;
			this.voiceBtn.y = BHAsset.gameHeight - this.voiceBtn.height*2.1;
			this.mainAsset.addChild(this.voiceBtn);
			this.chatBtn = ChatButton.createChatButton();
			this.chatBtn.x = BHAsset.gameWidth - this.chatBtn.width*1.35;
			this.chatBtn.y = BHAsset.gameHeight - this.chatBtn.height*1.1;
			this.mainAsset.addChild(this.chatBtn);
			SoundManager.playBgSound("beijing.mp3");
		}

		public initUi(){
			var room:Room = RoomData.getCurrentRoom();
			var game:BHGame = BHGameData.getCurrentGame();
			var uid:string;
		
			this.initHeads();
			this.initPokers();
			
			this.roomidText.text = room.id.toString();
			uid = room.owner.toString();
			// this.fangzhuText.text = BHRoleData.getRole(uid).name;
			if(this.selfUid == room.owner){
				//开始按钮变为准备
				var bg:egret.Bitmap = (this.readyBtn.skin as egret.DisplayObjectContainer).getChildAt(0) as egret.Bitmap;
				bg.width = this.inviteBtn.width;
				var wz:egret.Bitmap = (this.readyBtn.skin as egret.DisplayObjectContainer).getChildAt(1) as egret.Bitmap;
				wz.texture = BHAsset.mainSwf().createImage("img_BH_WZ_AN2_1").texture;
				wz.width *= 1.3;
				wz.height *= 1.3;
				wz.x = this.readyBtn.width/2 - wz.width/2;
				wz.y = this.readyBtn.height/2 - wz.height/2;
				this.readyBtn.x = BHAsset.gameWidth/2-this.readyBtn.width/2;
				this.inviteBtn.x = BHAsset.gameWidth/2 - this.inviteBtn.width/2;
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
				for(var i:number = 1; i < 6 ; i++){
					headAsset = this.mainAsset.getSprite("head" + i);
					headAsset.name = "head"+i;
					head = new RoleHead(headAsset);
					this.roleHeads[i] = head;
				}
			}
			// this.addEventListener(RoleHead.ONCLICKTIMER,this.onclicktimer,this);
			this.updateHeads();
		}
		

		public updateHeads(){
			var head:RoleHead;
			for(var i:number = 1; i < 6 ; i++){
				head = this.roleHeads[i];
				head.hide();
			}
			var players = RoomData.getCurrentRoom().players;
			for(var k in players){
				head = this.roleHeads[this.getRoleIndex(players[k])];
				head.initData(players[k]);
				head.show();
			}
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

		
		public updatechupaiBtns(isshow:boolean){
			var mycards = BHGameData.getMyPokers();
			var outcardsdata = BHGameData.getOutPokers();
			this.chupaiBtn.visible = isshow;
			for(var key in outcardsdata){
				//有大王不能出牌
				if(PokerUtil.haveBigKingCard(outcardsdata[key]) && key != this.selfUid){
					this.chupaiBtn.setEnable(false);
				}else{
					this.chupaiBtn.setEnable(true);
				}
			}
			//如果这个时候上个出牌者还是自己，不能不出
			this.buchuBtn.visible = isshow;
			if(outcardsdata == null || outcardsdata[this.selfUid] != null){
				this.buchuBtn.setEnable(false);
			}else{
				this.buchuBtn.setEnable(true);
			}
			this.tishiBtn.visible = isshow;
		}
		public updatedengjiBtns(isshow:boolean){
			var game:BHGame = BHGameData.getCurrentGame();
			if(game.firstUid != this.selfUid && PokerUtil.haveGuardCard(BHGameData.getMyPokers())){
				this.dengjiBtn.setEnable(false);
			}else{
				this.dengjiBtn.setEnable(true);
			}
			this.dengjiBtn.visible = isshow;
			this.rangweiBtn.visible = isshow;
		}
		public updatedengji1Btns(isshow:boolean){
			this.dengji1Btn.visible = isshow;
			this.rangwei1Btn.visible = isshow;
		}
		public updatemingbaoBtns(isshow:boolean){
			this.mingbaoBtn.visible = isshow;
			this.anbaoBtn.visible = isshow;
		}
		public updateqiangduBtns(isshow:boolean){
			this.qiangduBtn.visible = isshow;
			this.buqiangduBtn.visible = isshow;
		}
		public updatezaofanBtns(isshow:boolean){
			this.zaofanBtn.visible = isshow;
			this.buzaofanBtn.visible = isshow;
		}
		public updateLunshuText(){
			var game:BHGame = BHGameData.getCurrentGame();
			this.lunshuText.text = (game.currentCount>game.maxCount?game.maxCount:game.currentCount) + "/" + game.maxCount ;
		}

		public updateBtns():void{
			var room:Room = RoomData.getCurrentRoom();
			var game:BHGame = BHGameData.getCurrentGame();
			this.updatechupaiBtns(false);
			this.updatedengjiBtns(false);
			this.updatedengji1Btns(false);
			this.updatemingbaoBtns(false);
			this.updateqiangduBtns(false);
			this.updatezaofanBtns(false);
			this.noticeText.visible = false;
			if(game.currentState == 1){//造反
				if(!PokerUtil.haveEmperorCard(game.cardsInfo[this.selfUid])){
					if(game.zaofan == null || game.zaofan[this.selfUid] == null){
						this.updatezaofanBtns(true);
					}
				}
				this.noticeText.visible = true;
			}else if(game.currentState == 2){//登基
				if(!BHGameData.havePlayerZaoFan() && PokerUtil.haveEmperorCard(game.cardsInfo[this.selfUid]) && game.emperorUid == null){
					this.updatedengjiBtns(true);
				}
				if(!BHGameData.havePlayerZaoFan() && PokerUtil.haveEmperorCard(game.cardsInfo[this.selfUid]) && game.isQiangDu == -1){
					this.updateqiangduBtns(true);
				}
				if(!BHGameData.havePlayerZaoFan() && PokerUtil.haveGuardCard(game.cardsInfo[this.selfUid]) && game.isMingBao == -1 && game.emperorUid != null){//选择明保在登基之后
					this.updatemingbaoBtns(true);
				}
				if(BHGameData.havePlayerZaoFan() && PokerUtil.haveEmperorCard(game.cardsInfo[this.selfUid])){
					this.updatedengji1Btns(true);
				}
			}else if(game.currentState == 3 && game.currentUid == this.selfUid){//出牌阶段
				this.updatechupaiBtns(true);
			}
			
		}
		
		/**
		 * just洗牌表现
		*/
		public showWishPoker(){
			this.inviteBtn.visible = false;
			

			this.pokerPanel.InitPoker();
			SoundManager.playGameSound("fapai.mp3");
			this.addEventListener(PokerPanel.POKERWISHCOMPLETE,this.createPokerComplete,this);
			//显示其他玩家的牌
			// var head:RoleHead;
			// for(var i:number = 1; i < 4 ; i++){
			// 	head = this.roleHeads[i];
			// 	head.hide();
			// }
			// var players = RoomData.getCurrentRoom().players;
			// for(var k in players){
			// 	head = this.roleHeads[this.getRoleIndex(players[k])];
			// 	head.show();
			// }
			// egret.setTimeout(function():void{
			// },this,950);
		}
		
		public createPokerComplete():void{
			this.removeEventListener(PokerPanel.POKERWISHCOMPLETE,this.createPokerComplete,this);
			SoundManager.stopGameSound("fapai.mp3");
			// var players = RoomData.getCurrentRoom().players;
			// 	for(var k in players){
			// 		var head:RoleHead = this.roleHeads[this.getRoleIndex(players[k])];
			// 		head.updateCurrentState(players[k] == BHGameData.getCurrentGame().currentUid);
			// 	}
			//显示按钮
			this.updateBtns();

		}
		public updateUiByGameOver(){
			this.updateHeads();
			this.initPokers();
			if(BHGameData.getCurrentGame().currentCount <= BHGameData.getCurrentGame().maxCount){
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
			var game:BHGame = BHGameData.getCurrentGame();
			if(this.selfUid == room.owner){
				if(room.players[5] == null){
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
			BHGameApi.ready();
			this.readyBtn.visible = false;
		}

	

		public on_chupaiBtn(btn:starlingswf.SwfButton){
			//处理出牌逻辑
			var choosecard:any = BHGameData.getChoosePokers();
			if(choosecard == null || PokerUtil.getCount(choosecard) == 0){
				ApiState.showText("未选牌");
				return;
			}
			if(!PokerUtil.isRightOfCards(choosecard)){
				ApiState.showText("无效组合");
				return;
			}
			var myPokers:any = BHGameData.getMyPokers();
			//判断尾牌
			if(PokerUtil.getNumberCountInCards(choosecard,6)>0){
				if(PokerUtil.getCount(myPokers) > PokerUtil.getNumberCountInCards(myPokers,6)){
					ApiState.showText("6只能最后一手牌出");
					return;
				}
			}
			if(PokerUtil.getNumberCountInCards(myPokers,6)==PokerUtil.getCount(myPokers)){
				choosecard = BHGameData.getMyPokers();
			}
			var preOutcard:any = BHGameData.getCurrentGame().outCards;
			if(preOutcard != null){
				for(var key in preOutcard){
					if(key != this.selfUid && !PokerUtil.compare2Cards(choosecard,preOutcard[key])){
						ApiState.showText("无效出牌");
						return;
					}
				}
			}
			BHGameApi.chupai(choosecard);
			this.updatechupaiBtns(false);
			BHGameData.putChoosePokers({});
			BHGameData.putAdivcePokers({});
		}
		public on_buchuBtn(btn:starlingswf.SwfButton){
			//处理不出牌逻辑
			BHGameApi.buchu();
			this.updatechupaiBtns(false);
			this.pokerPanel.chooseAdvicePokers(null);
			BHGameData.putChoosePokers({});
			BHGameData.putAdivcePokers({});
		}
		public on_tishiBtn(btn:starlingswf.SwfButton){
			//处理提示逻辑
			var mycards = BHGameData.getMyPokers();
			var outcardsdata = BHGameData.getOutPokers();
			var outcard:any = {};
			var advicecards:any = {};
			if(outcardsdata != null){
				//自己随意出牌
				for(var k in outcardsdata){
					outcard = outcardsdata[k];
					if(k == this.selfUid){
						advicecards = PokerUtil.checkPokerByNone(mycards);
						BHGameData.putChoosePokers(advicecards);
						this.pokerPanel.chooseAdvicePokers(advicecards);
						return;
					}
				}
			}else{
				advicecards = PokerUtil.checkPokerByNone(mycards);
				BHGameData.putChoosePokers(advicecards);
				this.pokerPanel.chooseAdvicePokers(advicecards);
				return;
			}
			//推荐出牌
			advicecards = BHGameData.getAdivcePokers();
			if(advicecards != null && PokerUtil.getCount(advicecards)>0){
				//当已经有推荐的牌时候，推荐比推荐牌更大的
				advicecards = PokerUtil.CheckBigPokerByCards(advicecards,mycards);
				if(advicecards == null || PokerUtil.getCount(advicecards) < 1){//找到最大牌了，循环一面
					advicecards = PokerUtil.CheckBigPokerByCards(outcard,mycards);
				}
			}else{
				advicecards = PokerUtil.CheckBigPokerByCards(outcard,mycards);
			}
			Log.log(advicecards);
			if(advicecards!=null&&PokerUtil.getCount(advicecards)>0){
				//保存推荐牌
				BHGameData.putChoosePokers(advicecards);
				BHGameData.putAdivcePokers(advicecards);
				this.pokerPanel.chooseAdvicePokers(advicecards);
			}
		}
		public on_dengjiBtn(btn:starlingswf.SwfButton){
			BHGameApi.dengji(1);
			this.updatedengjiBtns(false);
		}
		public on_rangweiBtn(btn:starlingswf.SwfButton){
			BHGameApi.dengji(0);
			this.updatedengjiBtns(false);
			this.updateqiangduBtns(false);
		}
		public on_dengji1Btn(btn:starlingswf.SwfButton){
			BHGameApi.dengji(1);
			this.updatedengji1Btns(false);
		}
		public on_rangwei1Btn(btn:starlingswf.SwfButton){
			BHGameApi.dengji(0);
			this.updatedengji1Btns(false);
		}
		public on_mingbaoBtn(btn:starlingswf.SwfButton){
			BHGameApi.mingbao(1);
			this.updatemingbaoBtns(false);
		}
		public on_anbaoBtn(btn:starlingswf.SwfButton){
			BHGameApi.mingbao(0);
			this.updatemingbaoBtns(false);
		}
		public on_qiangduBtn(btn:starlingswf.SwfButton){
			BHGameApi.qiangdu(1);
			this.updateqiangduBtns(false);
		}
		public on_zaofanBtn(btn:starlingswf.SwfButton){
			BHGameApi.zaofan(1);
			this.updatezaofanBtns(false);
		}
		public on_buzaofanBtn(btn:starlingswf.SwfButton){
			BHGameApi.zaofan(0);
			this.updatezaofanBtns(false);
		}
		public on_buqiangduBtn(btn:starlingswf.SwfButton){
			BHGameApi.qiangdu(0);
			this.updateqiangduBtns(false);
		}
		public on_jiesanBtn(e:egret.Event){
			
			ExtGameHelper.showSetting();

		}
		public on_backwechatBtn(e:egret.Event){
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
			var maxSet:number = 5;
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
			return BHAsset.mainSwf();
		}

		public dispose():void{
			super.dispose();
			SoundManager.playBgSound("beijing.mp3");
			//移除所有事件监听
			this.pokerPanel.dispose();
			this.dataParse.dispose();
			
			for(var index in this.roleHeads){
				(<RoleHead>this.roleHeads[index]).dispose();
			}
			VoiceButton.destroyVocieButton(this.voiceBtn);
			ChatButton.destroyChatButton(this.chatBtn);
			
		}
		
	}
}