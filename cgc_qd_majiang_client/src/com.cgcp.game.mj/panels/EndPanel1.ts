module lj.cgcp.game.qdmj_705 {
	export class EndPanel1 extends BasePanel {

		// public titleText:egret.BitmapText;
		public liujuImg:egret.Bitmap;
		public btdImg:egret.Bitmap;

		public huUid:string;
		public allMjs:any;
		public _158:any;
		public gamePanel:GamePanel;

		public constructor(gamePanel:GamePanel,huUid:string,allMjs:any,_158:any) {
			super();
			// this.titleText = BmTextUtil.replaceTextfield(this.titleText,RES.getRes("jushu"));
			this.huUid = huUid;
			this.allMjs = allMjs;
			this._158 = _158;
			this.gamePanel = gamePanel;
			this.init2();
		}

		public init2(): void{
			// if(this.huUid){
			// 	this.liujuImg.visible = false;
			// }else{
			// 	// this.titleText.visible = false;
			// 	this.btdImg.visible = false;
			// }
			var selfRole:Role = RoleData.getRole();
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			var room:Room = RoomData.getCurrentRoom();
			// this.titleText.text = "d" + (game.currentCount - 1) + "/" + game.maxCount + "j";

			var players:any = room.players;
			var itemSpr:starlingswf.SwfSprite;
			var uid:string;
			var role:Role;
			var fenNum:number;
			var fanNum:number;
			var gangNum:number;
			var headImage:RoleHeadImage;
			for(var index in players){
				uid = players[index];
				role = RoomData.getRole(uid);
				fenNum = this.getFenNum(uid,game.fanData);
				fanNum = this.getFanNum(uid,game.fanInfos);
				gangNum = this.getGangNum(uid,game.fanInfos);
				itemSpr = this.mainAsset.getChildByName("item" + index) as starlingswf.SwfSprite;
				itemSpr.getTextField("nameText").text = role.name;
				if(role.name != selfRole.name){
					itemSpr.getTextField("nameText").textColor = 0xffffff;
					itemSpr.getTextField("nameText").stroke = 0;
				}
				var bitmapText:egret.BitmapText = BmTextUtil.replaceTextfield(itemSpr.getTextField("fenText"),RES.getRes("endscore"));
				bitmapText.text = fenNum.toString();
				itemSpr.addChild(bitmapText);
				// itemSpr.getTextField("fenText").text = fenNum.toString();
				// if(fenNum < 0){
				// 	itemSpr.getTextField("fenText").textColor = 0xF46354;
				// }
				itemSpr.getTextField("huText").text = fanNum.toString();
				if(fanNum < 0){
					itemSpr.getTextField("huText").textColor = 0xF46354;
				}
				itemSpr.getTextField("gangText").text = gangNum.toString();
				if(gangNum < 0){
					itemSpr.getTextField("gangText").textColor = 0xF46354;
				}
				var headbg:egret.DisplayObject = itemSpr.getChildByName("headbg");
				headImage = new RoleHeadImage(role);
				headImage.x = headbg.x + 5.55;
				headImage.y = headbg.y + 5.55;
				headImage.width = headImage.height = 70;
				itemSpr.addChildAt(headImage,6);

				itemSpr.getChildByName("ztb").visible = uid == game.lastZhuang;
				itemSpr.getChildByName("htb").visible = false;
				itemSpr.getChildByName("mtb").visible = false;
				itemSpr.getChildByName("ptb").visible = game.pao == uid;

				if(this.huUid == null){
					itemSpr.getTextField("huListStr").text = "";
				}else{
					itemSpr.getTextField("huListStr").text = this.huUid  == uid ? game.huListStr:"";
				}
				
				itemSpr.getTextField("huListStr").textAlign = egret.HorizontalAlign.LEFT;
				
				if(this.huUid == uid){
					if(game.pao == null) itemSpr.getChildByName("mtb").visible = true;
					else itemSpr.getChildByName("htb").visible = true;
				}
				itemSpr.addChild(itemSpr.getChildByName("ztb"));

				this.createMjs(uid,itemSpr,game);
			}
			itemSpr.addChild(itemSpr.getChildByName("ztb"));
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

		public createMjs(uid:string,container:starlingswf.SwfSprite,game:MajiangGame):void{
			var mjList:number[] = this.allMjs[uid];
			var chiList:number[][] = game.chiList[uid];
			var pengList:number[] = game.pengList[uid];
			var gangList:number[] = game.gangList[uid];
			var angangList:number[] = game.angangList[uid];
			var niuList:number[] = game.niuList[uid][0];

			var startX:number =140.95;
			var startY:number = 48;
			var len:number;
			var mjSpr:starlingswf.SwfSprite;
			var lastMj:number = game.newMj;

			if(game.pao != null){
				lastMj = game.lastMj;
			}
			if(mjList != null){
				len = mjList.length;
				for(var i:number = 0; i < len; i++){
					mjSpr = MjGameAsset.mjSwf.createSprite("spr_mj_3");
					mjSpr.getImage("_1").texture = RES.getRes("img_MJ_PX_" + mjList[i]);
					mjSpr.scaleX = mjSpr.scaleY = 0.9;
					mjSpr.x = startX;
					mjSpr.y = startY;
					startX += 36;
					if(mjList[i] == lastMj && uid == this.huUid){
						mjSpr.y -= 6;
						lastMj = -1;
					}
					if(game.hunMj == mjList[i]){
						var bitmap:egret.Bitmap = MjGameAsset.mjSwf.createImage("img_QDLOGO");
						bitmap.scaleX = 0.5;
						bitmap.scaleY = 0.5;
						bitmap.x = 10;
						bitmap.y = 26;
						mjSpr.addChild(bitmap);
					}
					container.addChild(mjSpr);
				}
			}

			if(chiList != null){
				len = chiList.length;
				for(var i:number = 0; i < len; i++){
					mjSpr = MjGameAsset.mjSwf.createSprite("spr_peng_1");
					for(var j:number = 0; j < 3 ;j++){
						mjSpr.getImage("_" + (j+1)).texture = RES.getRes("img_MJ_PX_" + chiList[i][j]);
							var logo:egret.Bitmap = mjSpr.getImage("_logo" + (j+1));
					logo.visible = game.hunMj == chiList[i][j];	
					}
					mjSpr.scaleX = mjSpr.scaleY = 0.9;
					mjSpr.x = startX;
					mjSpr.y = startY;
					startX += 106.55;
					container.addChild(mjSpr);
				}
			}



			if(pengList != null){
				len = pengList.length;
				for(var i:number = 0; i < len; i++){
					mjSpr = MjGameAsset.mjSwf.createSprite("spr_peng_1");
					for(var j:number = 0; j < 3 ;j++){
						mjSpr.getImage("_" + (j+1)).texture = RES.getRes("img_MJ_PX_" + pengList[i]);
							var logo:egret.Bitmap = mjSpr.getImage("_logo" + (j+1));
					logo.visible = game.hunMj == pengList[i];	
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
					mjSpr = MjGameAsset.mjSwf.createSprite("spr_gang_1");
					mjSpr.getImage("_1").texture = RES.getRes("img_MJ_PX_" + gangList[i]);
					mjSpr.scaleX = mjSpr.scaleY = 0.9;
					mjSpr.x = startX;
					mjSpr.y = startY;
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
					startX += 106.85;
					container.addChild(mjSpr);
				}
			}


			
			// if(niuList != null && niuList[0] == 1){
			// 	mjSpr = MjGameAsset.mjSwf.createSprite("spr_peng_1");
			// 	var mj:number = 28;
			// 	for(var j:number = 0; j < 3 ;j++){
			// 		mjSpr.getImage("_" + (j+1)).texture = RES.getRes("img_MJ_PX_" + mj);
			// 		mj++;
			// 	}
			// 	mjSpr.scaleX = mjSpr.scaleY = 0.9;
			// 	mjSpr.x = startX;
			// 	mjSpr.y = startY;
			// 	startX += 106.55;
			// 	container.addChild(mjSpr);
				
			// }
			if(niuList != null && niuList.length > 1){
				var group:number[][] = MajiangConstant.niuGroup(niuList);
				for(var i = 0 ;i<group.length;i++){
					len = group[i].length;
					if(len<= 3){
					var mjSpr:starlingswf.SwfSprite = MjGameAsset.mjSwf.createSprite("spr_peng_1");
					}else{
						var mjSpr:starlingswf.SwfSprite = MjGameAsset.mjSwf.createSprite("spr_niufeng_1");
					}
					for(var j:number = 0; j < len; j++){
						var mjobj:egret.Bitmap = mjSpr.getImage("_" + (j+1));
						mjobj.texture = MjGameAsset.mjSwf.createImage("img_MJ_PX_"+group[i][j]).texture;		
						
						var logo:egret.Bitmap = mjSpr.getImage("_logo" + (j+1));
						logo.visible = game.hunMj == group[i][j];
					}
					mjSpr.scaleX = mjSpr.scaleY = 0.9;
					mjSpr.x = startX;
					mjSpr.y = startY;
					startX += 106.55;
					container.addChild(mjSpr);
				}
			}
		}

		public getFenNum(uid:string,fanData:any):number{
			if(fanData == null || fanData[uid] == null){
				return 0;
			}
			return fanData[uid];
		}

		public getFanNum(uid:string,fanInfos:any):number{
			if(fanInfos == null || fanInfos[uid] == null){
				return 0;
			}
			return fanInfos[uid][0];
		}

		public getGangNum(uid:string,fanInfos:any):number{
			if(fanInfos == null || fanInfos[uid] == null){
				return 0;
			}
			return fanInfos[uid][1];
		}
		public on_cannelBtn(e:egret.Event):void{
			this.on_startGameBtn(null);
		}
		public on_startGameBtn(e:egret.Event):void{
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			if(game.currentCount > game.maxCount){
				lzm.Alert.alertLandscape(new EndPanel2());
			}else{
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