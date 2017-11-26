module lj.cgcp.game.scmj_204 {
	export class EndPanel1 extends BasePanel {

		public titleText:egret.BitmapText;
		public liujuImg:egret.Bitmap;
		public btdImg:egret.Bitmap;

		public allMjs:any;
		public _158:any;
		public gamePanel:GamePanel;

		public detailBtn1:starlingswf.SwfButton;
		public detailBtn2:starlingswf.SwfButton;
		public detailBtn3:starlingswf.SwfButton;
		public detailBtn4:starlingswf.SwfButton;
		public constructor(gamePanel:GamePanel,huUid:string,allMjs:any,_158:any) {
			super();
			this.titleText = BmTextUtil.replaceTextfield(this.titleText,RES.getRes("jushu"));
			this.allMjs = allMjs;
			this._158 = _158;
			this.gamePanel = gamePanel;
			this.init2();
		}
		
		public init2(): void{
            
			var selfRole:Role = RoleData.getRole();
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			var room:Room = RoomData.getCurrentRoom();
			if(MajiangConstant.getAnyCount(game.alreadyHus) > 0){
				this.liujuImg.visible = false;
			}else{
				this.titleText.visible = false;
				this.btdImg.visible = false;
			}
			this.titleText.text = "d" + (game.currentCount - 1) + "/" + game.maxCount + "j";

			var players:any = room.players;
			var itemSpr:starlingswf.SwfSprite;
			var uid:string;
			var role:Role;
			var fenNum:number;
			var huNum:number;
			var fanNum:number;
			var gangNum:number;
			var chajiaoNum:number;
			var huazhuNum:number;
			var headImage:RoleHeadImage;
			for(var index in players){
				uid = players[index];
				role = RoomData.getRole(uid);
				fenNum = this.getFenNum(uid,game.fanData);
				huNum = this.getHuNum(uid,game.fanInfos);
				fanNum = this.getFanNum(uid,game.fanInfos);
				gangNum = this.getGangNum(uid,game.fanInfos);
				chajiaoNum = this.getJiaoNum(uid,game.fanInfos);
				huazhuNum = this.getHuaZhuNum(uid,game.fanInfos);
				itemSpr = this.mainAsset.getChildByName("item" + index) as starlingswf.SwfSprite;
				itemSpr.getTextField("nameText").text = role.name;
				if(role.name != selfRole.name){
					itemSpr.getTextField("nameText").textColor = 0xffffff;
					itemSpr.getTextField("nameText").stroke = 0;
				}
				itemSpr.getTextField("fenText").text = fenNum.toString();
				if(fenNum < 0){
					itemSpr.getTextField("fenText").textColor = 0xF46354;
				}
				itemSpr.getTextField("fanText").text = fanNum.toString();
				if(fanNum < 0){
					itemSpr.getTextField("fanText").textColor = 0xF46354;
				}
				itemSpr.getTextField("huText").text = huNum.toString();
                if(huNum < 0){
                    itemSpr.getTextField("huText").textColor = 0xF46354;
                }
				itemSpr.getTextField("gangText").text = gangNum.toString();
				if(gangNum < 0){
					itemSpr.getTextField("gangText").textColor = 0xF46354;
				}
				itemSpr.getTextField("chajiaoText").text = chajiaoNum.toString();
				if(chajiaoNum < 0){
					itemSpr.getTextField("chajiaoText").textColor = 0xF46354;
				}
				itemSpr.getTextField("huazhuText").text = huazhuNum.toString();
				if(huazhuNum < 0){
					itemSpr.getTextField("huazhuText").textColor = 0xF46354;
				}

				headImage = new RoleHeadImage(role);
				headImage.x = -10.55;
				headImage.y = 10.55;
				headImage.width = headImage.height = 70;
				itemSpr.addChild(headImage);

				itemSpr.getChildByName("ztb").visible = uid == game.lastZhuang;
                itemSpr.getChildByName("htb").visible = game.alreadyHus[uid] != null;
				itemSpr.addChild(itemSpr.getChildByName("ztb"));

				this.createMjs(uid,itemSpr,game);
			}

			if(this._158 != null) {
				var arr:number[] = [1,5,8,10,14,17,19,23,26];
				var len:number = this._158.length;
				var startX:number = 38;
				var startY:number = 498;
				for(var i:number = 0; i < len ;i++){
					var mj:starlingswf.SwfSprite = MjGameAsset.mjSwf.createSprite("spr_mj_3_copy");
					(mj.getChildAt(3) as egret.Bitmap).texture = RES.getRes("img_MJ_PX_" + this._158[i]);
					mj.x = startX + (i * (54 + 6));
					mj.y = startY;
					if(arr.indexOf(this._158[i]) != -1){
						(mj.getChildAt(1) as egret.TextField).text = "+1";
					}
					this.addChild(mj);
				}
			}
		}
		public on_detailBtn1(e:egret.Event){
			var room:Room = RoomData.getCurrentRoom();
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			lzm.Alert.alertLandscape(new EndDetail(game.fanInfos[room.players[1]]));
		}
		public on_detailBtn2(e:egret.Event){
			var room:Room = RoomData.getCurrentRoom();
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			lzm.Alert.alertLandscape(new EndDetail(game.fanInfos[room.players[2]]));
		}
		public on_detailBtn3(e:egret.Event){
			var room:Room = RoomData.getCurrentRoom();
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			lzm.Alert.alertLandscape(new EndDetail(game.fanInfos[room.players[3]]));
		}
		public on_detailBtn4(e:egret.Event){
			var room:Room = RoomData.getCurrentRoom();
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			lzm.Alert.alertLandscape(new EndDetail(game.fanInfos[room.players[4]]));
		}
		public createMjs(uid:string,container:starlingswf.SwfSprite,game:MajiangGame):void{
			var mjList:number[] = this.allMjs[uid];
			var pengList:number[] = game.pengList[uid];
			var gangList:number[] = game.gangList[uid];
			var angangList:number[] = game.angangList[uid];
			
			var startX:number = 67.95;
			var startY:number = 32.3;
			var len:number;
			var mjSpr:starlingswf.SwfSprite;
			var lastMj:number = game.newMj;
			if(mjList != null){
				len = mjList.length;
				for(var i:number = 0; i < len; i++){
					mjSpr = MjGameAsset.mjSwf.createSprite("spr_mj_3");
					mjSpr.getImage("_1").texture = RES.getRes("img_MJ_PX_" + mjList[i]);
					mjSpr.scaleX = mjSpr.scaleY = 0.9;
					mjSpr.x = startX;
					mjSpr.y = startY;
					startX += 35;
					container.addChild(mjSpr);
				}
			}

			if(pengList != null){
				len = pengList.length;
				for(var i:number = 0; i < len; i++){
					mjSpr = MjGameAsset.mjSwf.createSprite("spr_peng_1");
					for(var j:number = 0; j < 3 ;j++){
						mjSpr.getImage("_" + (j+1)).texture = RES.getRes("img_MJ_PX_" + pengList[i]);
					}
					mjSpr.scaleX = mjSpr.scaleY = 0.9;
					mjSpr.x = startX;
					mjSpr.y = startY;
					startX += 106.55;
					container.addChild(mjSpr);
				}
			}

			if(gangList != null){
				len = gangList.length;
				for(var i:number = 0; i < len; i++){
					mjSpr = MjGameAsset.mjSwf.createSprite("spr_mgang_1");
					mjSpr.getImage("_1").texture = RES.getRes("img_MJ_PX_" + gangList[i]);
					mjSpr.getImage("_2").texture = RES.getRes("img_MJ_PX_" + gangList[i]);
					mjSpr.getImage("_3").texture = RES.getRes("img_MJ_PX_" + gangList[i]);
					mjSpr.scaleX = mjSpr.scaleY = 0.9;
					mjSpr.x = startX;
					mjSpr.y = startY;
					// mjSpr.getChildByName("daTag").visible = gangList[i] == game.da2;
					startX += 106.85;
					container.addChild(mjSpr);
				}
			}
			if(angangList != null){
				len = angangList.length;
				for(var i:number = 0; i < len; i++){
					mjSpr = MjGameAsset.mjSwf.createSprite("spr_gang_1");
					mjSpr.getImage("_1").texture = RES.getRes("img_MJ_PX_" + angangList[i]);
					mjSpr.scaleX = mjSpr.scaleY = 0.9;
					mjSpr.x = startX;
					mjSpr.y = startY;
					// mjSpr.getChildByName("daTag").visible = angangList[i] == game.da2;
					startX += 106.85;
					container.addChild(mjSpr);
				}
			}

		}
		/**
		 * 当局总分
		*/
		public getFenNum(uid:string,fanData:any):number{
			if(fanData == null || fanData[uid] == null){
				return 0;
			}
			return fanData[uid];
		}
		/**
		 * 当局番数
		*/
		public getHuNum(uid:string,fanInfos:any):number{
			if(fanInfos == null || fanInfos[uid] == null){
				return 0;
			}
			var score:number = 0;
			var scoreArr:number[][] = fanInfos[uid][0];
			for(var index  in scoreArr){
				score+=scoreArr[index][0];
			}
			return score;
		}
		/**
		 * 当局番数
		*/
		public getFanNum(uid:string,fanInfos:any):number{
			if(fanInfos == null || fanInfos[uid] == null){
				return 0;
			}
			var score:number = 0;
			var scoreArr:number[][] = fanInfos[uid][0];
			for(var index  in scoreArr){
				if(scoreArr[index].length>1){
					score+=scoreArr[index][2];
				}
			}
			return score;
		}
		/**
		 * 当局杠分
		*/
		public getGangNum(uid:string,fanInfos:any):number{
			if(fanInfos == null || fanInfos[uid] == null){
				return 0;
			}
			var score:number = 0;
			var scoreArr:number[] = fanInfos[uid][1];
			for(var index  in scoreArr){
				score+=scoreArr[index];
			}
			return score;
		}
		/**
		 * 当局查轿分
		*/
		public getJiaoNum(uid:string,fanInfos:any):number{
			if(fanInfos == null || fanInfos[uid] == null){
				return 0;
			}
			var score:number = 0;
			var scoreArr:number[] = fanInfos[uid][2];
			for(var index  in scoreArr){
				score+=scoreArr[index];
			}
			return score;
		}
		/**
		 * 当局花猪分
		*/
		public getHuaZhuNum(uid:string,fanInfos:any):number{
			if(fanInfos == null || fanInfos[uid] == null){
				return 0;
			}
			var score:number = 0;
			var scoreArr:number[] = fanInfos[uid][3];
			for(var index  in scoreArr){
				score+=scoreArr[index];
			}
			return score;
		}

		public on_startGameBtn(e:egret.Event):void{
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			if(game.currentCount > game.maxCount){
				lzm.Alert.alertLandscape(new EndPanel2());
			}else{
				game.fanData = null;
				this.gamePanel.updateUi();
				super.on_closeBtn(e);
				var room:Room = RoomData.getCurrentRoom();
				if(room.owner != RoleData.getRole().uid){
					MjGameApi.ready();
				}
			}
		}

		public mainAssetName(): string{
			return "spr_end1";
		}

		public assetSwf(): starlingswf.Swf{
			return MjGameAsset.mainSwf;
		}

		public create158List(_158:number[]):void{
			if(_158 == null || _158.length == 0){
				lzm.Alert.alertLandscape(this);
				return;
			}
			var content:egret.Sprite = new egret.Sprite();
			var len:number = _158.length;
			var xs:number[] = [380.6,501.95,623.3,744.7];
			for(var i:number = 0; i < len ;i++){
				var mj:starlingswf.SwfSprite = MjGameAsset.mjSwf.createSprite("spr_mj_1_copy");
				(mj.getChildAt(1) as egret.Bitmap).texture = RES.getRes("img_MJ_PX_" + _158[i]);
				content.addChild(mj);
				mj.x = xs[i];
				mj.y = 296.65;
				mj.scaleX = mj.scaleY = 0;
				mj.getChildAt(2).visible = false;
				this.scaleMj(mj,60 + (i * 300),_158[i]);
			}

			content.touchEnabled = true;
			content.graphics.beginFill(0x000000,0);
			content.graphics.drawRect(0,0,App.designHeight,App.designWidth);
			content.graphics.endFill();
			content.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClick158List,this);

			lzm.Alert.alertLandscape(content);

			var thisObj:EndPanel1 = this;
			egret.setTimeout(function():void{
				thisObj.close158List(content);
			},this,3000);
		}

		public scaleMj(mj:starlingswf.SwfSprite,time:number,mjval:number):void{
			egret.setTimeout(function():void{
				var arr:number[] = [1,5,8,10,14,17,19,23,26];
				egret.Tween.get(mj).to({scaleX:1,scaleY:1},300,egret.Ease.backInOut);
				if(arr.indexOf(mjval) != -1){
					mj.getChildAt(2).visible = true;
					var eff:starlingswf.SwfMovieClip = MjGameAsset.effSwf.createMovie("mc_MaJiangPai_eff");
					eff.x = mj.x;
					eff.y = mj.y;
					eff.loop = false;
					mj.parent.addChildAt(eff,0);
				}
			},this,time);
		}

		public onClick158List(e:egret.Event):void{
			var content:egret.Sprite = e.currentTarget;
			this.close158List(content);
		}

		public close158List(content:egret.Sprite):void{
			if(content.parent == null) return;
			
			content.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClick158List,this);
			content.parent.removeChild(content);

			lzm.Alert.alertLandscape(this);
		}
	}
}