module lj.cgcp.game.qdmj_705 {
	export class MjListPanel extends egret.DisplayObjectContainer {
		/**
		 * 还没有出手牌的容器
		 */
		public mjListContainer:egret.DisplayObjectContainer;
		/**
		 * 吃碰杠的容器
		 */
		public gpcListContainer:egret.DisplayObjectContainer;
		/**
		 * 已经打出去的容器
		 */
		public chupaiListContainer:egret.DisplayObjectContainer;
		/**
		 * 扭牌的容器
		*/
		public niuListContanier:egret.DisplayObjectContainer;
		/**
		 * 当前这个人的uid
		 */
		public uid:string;

		/**
		 * 操作按钮的数据
		 */
		public opEventList:any;
		/**
		 * 操作按钮的编号
		 */
		public opEventNo:number;

		/**
		 * 别人的操作 显示位置
		 */
		public opValMcX:number;
		public opValMcY:number;
		/**
		 * 最新的麻将
		 */
		public currentMjDisplay:egret.DisplayObject;
		/**
		 * 当前出牌的大的显示对象
		 */
		public currentBigMjDisplay:starlingswf.SwfSprite;
		public currentBigMjShowTime:number;
		/**
		 * 当前麻将的标记
		 */
		public static currentMjTag:egret.DisplayObject;
		
		

		public constructor() {
			super();
			this.mjListContainer = new egret.DisplayObjectContainer();
			this.gpcListContainer = new egret.DisplayObjectContainer();
			this.chupaiListContainer = new egret.DisplayObjectContainer();
			this.niuListContanier = new egret.DisplayObjectContainer();
			this.addChild(this.niuListContanier);
			this.addChild(this.chupaiListContainer);
			this.addChild(this.mjListContainer);
			this.addChild(this.gpcListContainer);

			this.currentBigMjDisplay = MjGameAsset.mjSwf.createSprite("spr_mj_1_copy");
			this.currentBigMjShowTime = 0;

			this.initContainerPos();

			if(MjListPanel.currentMjTag == null){
				MjListPanel.currentMjTag = MjGameAsset.mainSwf.createMovie("mc_current_mj");
			}

			this.opEventList = {};
			this.opEventNo = 1;
		}

		public initContainerPos(){
			this.mjListContainer.x = 1029.95;
			this.mjListContainer.y = 520;
			this.gpcListContainer.x = 65.65;
			this.gpcListContainer.y = 573;
			this.chupaiListContainer.x = 333;
			this.chupaiListContainer.y = 454;
			this.niuListContanier.x = 333;
			this.niuListContanier.y = 364;
			this.opValMcX = 577.95;
			this.opValMcY = 442.95;

			this.currentBigMjDisplay.scaleX = this.currentBigMjDisplay.scaleY = 1.2;
			this.currentBigMjDisplay.x = 566.45;
			this.currentBigMjDisplay.y = 436.45;
			
		}

		public setUid(uid:string):void{
			this.uid = uid;
		}

		/**
		 * 刷新所有内容
		 */
		public refreshAll(showMjTween:boolean):void{
			this.clear();
			this.refreshMjList(showMjTween);
			this.refreshChupaiList();//显示出牌列表
			this.refreshNiuList();//显示扭牌换牌列表
			this.refreshGpc();//显示碰吃刚
		}

		/**
		 * 清除所有显示对象
		 */
		public clear():void{
			this.disposeMjClickEvent();
			this.mjListContainer.removeChildren();
			this.gpcListContainer.removeChildren();
			this.chupaiListContainer.removeChildren();
			this.niuListContanier.removeChildren();
		}

		/**
		 * 刷新手牌列表
		 */
		public refreshMjList(showTween:boolean,newMjVal:number = -1):void{
			var mjList:number[] = MajiangGameData.getMjs();
			this.disposeMjClickEvent();
			this.mjListContainer.removeChildren();

			var len:number = mjList.length;
			var mjDisplay:egret.DisplayObject;
			var index:number = 1;
			var w:number = 77;
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			var gameNewMj:number = game.newMj;
			for(var i:number = len - 1; i >= 0 ; i--){
				if(newMjVal == mjList[i]) {
					newMjVal = -1;
					continue;
				}
				mjDisplay = this.createMj(mjList[i]);
				mjDisplay.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClickMj,this);
				mjDisplay.name = mjList[i].toString();
				mjDisplay.touchEnabled = true;
				if(mjList[i] != gameNewMj){
					if(index == 14){
						mjDisplay.x = 24;
					}else{
						mjDisplay.x = -(w * index);
					}
					index++;
				}else{
					gameNewMj = -1;
					mjDisplay.x = 24;
				}
				this.mjListContainer.addChild(mjDisplay);
			}

			if(showTween) {
				this.showMoveMjs(0);
				SoundManager.playGameSound("fapai.mp3");
			}
		}

		public showMoveMjs(startType:number):void{
			var len:number = this.mjListContainer.$children.length;
			var start:number = len == 14 ? len - 2 : len - 1;
			var end:number = 0;
			var index = 0;
			var mj:egret.DisplayObject;
			var startPoint:egret.Point = this.parent.localToGlobal(1136/2,640/2);
			startPoint = this.mjListContainer.globalToLocal(startPoint.x,startPoint.y);
			if(startType == 0){
				for(var i:number = start; i >= end ;i--){
					mj = this.mjListContainer.getChildAt(i);
					this.moveToTargetPos(mj,startPoint,50 * index);
					index++;
				}
			}else{
				for(var i:number = end; i <= start ;i++){
					mj = this.mjListContainer.getChildAt(i);
					this.moveToTargetPos(mj,startPoint,50 * index);
					index++;
				}
			}
			if(len == 14){
				mj = this.mjListContainer.getChildAt(len - 1);
				this.moveToTargetPos2(mj,startPoint,50 * index);
			}
		}

		public moveToTargetPos(mj:egret.DisplayObject,startPoint:egret.Point,delayTime:number):void{
			var targetXY:number[] = [mj.x,mj.y];
			var targetScaleXY:number[] = [mj.scaleX,mj.scaleY];
			mj.x = startPoint.x;
			mj.y = startPoint.y;
			mj.scaleX = mj.scaleY = 0;
			egret.setTimeout(function():void{
				egret.Tween.get(mj).to({x:targetXY[0],y:targetXY[1],scaleX:targetScaleXY[0],scaleY:targetScaleXY[1]},400);
			},this,delayTime);
		}
		public moveToTargetPos2(mj:egret.DisplayObject,startPoint:egret.Point,delayTime:number):void{
			if(startPoint == null){
				startPoint = this.parent.localToGlobal(759,320);
				startPoint = this.mjListContainer.globalToLocal(startPoint.x,startPoint.y);
			}
			var targetXY:number[] = [mj.x,mj.y];
			var targetScaleXY:number[] = [mj.scaleX,mj.scaleY];
			mj.x = startPoint.x;
			mj.y = startPoint.y;
			mj.scaleX = mj.scaleY = 1.5;
			mj.visible = false;
			egret.setTimeout(function():void{
				mj.visible = true;
				egret.Tween.get(mj).to({x:targetXY[0],y:targetXY[1],scaleX:targetScaleXY[0],scaleY:targetScaleXY[1]},400,egret.Ease.backInOut);
			},this,delayTime);
		}

		/**
		 * 添加新麻将
		 */
		public addNewMj(mjVal:number):void{
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			var mjDisplay:egret.DisplayObject = this.createMj(mjVal);
			mjDisplay.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClickMj,this);
			mjDisplay.name = mjVal.toString();
			mjDisplay.touchEnabled = true;
			mjDisplay.x = 24;
			this.mjListContainer.addChild(mjDisplay);
			this.moveToTargetPos2(mjDisplay,null,0);
		}

		/**
		 * 创建手牌麻将
		 */
		public createMj(val:number):egret.DisplayObject{
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			var container:starlingswf.SwfSprite = MjGameAsset.mjSwf.createSprite("spr_mj_1");
			var bit:egret.Bitmap = container.getChildAt(1) as egret.Bitmap;
			bit.texture = RES.getRes("img_MJ_PX_" + val);
			if(game.hunMj == val){
				var bitmap:egret.Bitmap = MjGameAsset.mjSwf.createImage("img_QDLOGO");
				bitmap.x = 21;
				bitmap.y = 72;
				container.addChild(bitmap);
			}
			return container;
		}

		/**
		 * 刷新出过的牌的列表
		 */
		public refreshChupaiList():void{
			var chuList:number[] = MajiangGameData.getCurrentGame().chupaiList[this.uid];
			if(chuList == null) return;

			this.chupaiListContainer.removeChildren();

			var len:number = chuList.length;
			var startX:number = 0;
			var startY:number = 0;
			var w:number = 39;
			var h:number = 45;
			var row:number;
			var mj:egret.DisplayObject;
			var index:number = 0;
			for(var i:number = 0; i < len ; i++){
				startX = index * w;
				mj = this.createChupaiMj(chuList[i]);
				mj.x = startX;
				mj.y = startY;
				index++;
				if(index == 10){
					startX = 0;
					startY -= h;
					index = 0;
				}
				this.currentMjDisplay = mj;
				this.chupaiListContainer.addChildAt(mj,0);
			}
		}

		/**
		 * 添加一张牌到出牌列表
		 */
		public addChupaiList(mjVal:number){
			var chuList:number[] = MajiangGameData.getCurrentGame().chupaiList[this.uid];
			var len:number = chuList.length -1;
			var mj:egret.DisplayObject = this.createChupaiMj(mjVal);
			mj.x = (len % 10) * 39;
			mj.y -= parseInt((len / 10) + "") * 45;
			this.currentMjDisplay = mj;
			this.chupaiListContainer.addChildAt(mj,0);
			this.showCurrentMjTag();
		}
		/**
		 * 刷新扭过的牌的列表
		 */
		public refreshNiuList():void{
			var niuList:number[] = MajiangGameData.getCurrentGame().niuList[this.uid];

			this.niuListContanier.removeChildren();

			if(niuList == null || niuList.length < 2) return;
			var len:number = niuList.length;
			var startX:number = 0;
			var startY:number = 0;
			var w:number = 39;
			var h:number = 45;
			var row:number;
			var mj:egret.DisplayObject;
			var index:number = 0;
			for(var i:number = 1; i < len ; i++){
				startX = index * w;
				mj = this.createNiuMj_up(niuList[i]);
				mj.x = startX;
				mj.y = startY;
				index++;
				if(index == 10){
					startX = 0;
					startY -= h;
					index = 0;
				}
				// this.currentMjDisplay = mj;
				this.niuListContanier.addChildAt(mj,0);
			}
		}
		/**
		 * 添加一张牌到扭牌列表
		 */
		public addNiuList(){
			var niuList:number[] = MajiangGameData.getCurrentGame().niuList[this.uid];
			var len:number = niuList.length -2;
			var mj:egret.DisplayObject = this.createNiuMj_up(niuList[len+1]);
			mj.x = (len % 10) * 39;
			mj.y -= parseInt((len / 10) + "") * 45;
			// this.currentMjDisplay = mj;
			this.niuListContanier.addChildAt(mj,0);
			// this.showCurrentMjTag();
		}
		public showCurrentMjTag(){
			if(this.currentMjDisplay == null) return;

			MjListPanel.currentMjTag.x = this.chupaiListContainer.x + this.currentMjDisplay.x + (this.currentMjDisplay.width / 2);
			MjListPanel.currentMjTag.y = this.chupaiListContainer.y + this.currentMjDisplay.y;
			this.addChild(MjListPanel.currentMjTag);
		}

		/**
		 * 出牌之后显示一下大牌
		 */
		public showBigMj(mjVal:number):void{
			var bit:egret.Bitmap = this.currentBigMjDisplay.getChildAt(1) as egret.Bitmap;
			bit.texture = RES.getRes("img_MJ_PX_" + mjVal);

			this.currentBigMjShowTime += 3;
			this.currentBigMjDisplay.scaleX = this.currentBigMjDisplay.scaleY = 1.5;
			this.currentBigMjDisplay.alpha = 0.5;
			this.addChild(this.currentBigMjDisplay);
			egret.Tween.get(this.currentBigMjDisplay).to({scaleX:1.2,scaleY:1.2,alpha:1}, 290, egret.Ease.backInOut);

			var thisObj:MjListPanel = this;
			egret.setTimeout(function():void{
				thisObj.currentBigMjShowTime -= 3;
				if(thisObj.currentBigMjShowTime <= 0 && thisObj.currentBigMjDisplay.parent){
					thisObj.currentBigMjDisplay.parent.removeChild(thisObj.currentBigMjDisplay);
				}
			},thisObj,2000);
		}

		public hideCurrentMjTag():void{
			if(MjListPanel.currentMjTag.parent){
				MjListPanel.currentMjTag.parent.removeChild(MjListPanel.currentMjTag);
			}
		}

		/**
		 * 创建出过的麻将
		 */
		public createChupaiMj(val:number):egret.DisplayObject{
			var container:starlingswf.SwfSprite = MjGameAsset.mjSwf.createSprite("spr_mj_3");
			var bit:egret.Bitmap = container.getChildAt(1) as egret.Bitmap;
			bit.texture = RES.getRes("img_MJ_PX_" + val);
			return container;
		}

		/**
		 * 刷新杠碰吃的牌
		 */
		public refreshGpc():void{
			this.gpcListContainer.removeChildren();
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			
			var chiList:number[][] = game.chiList[this.uid];
			var len:number;
			var startX:number = 0;
			var startY:number = 0;
			var w:number = 124;
			var h:number = 0;
			var mjDisplay:egret.DisplayObject;
			if(chiList != null){
				len = chiList.length;
				for(var i:number = 0; i < len ;i++){
					mjDisplay = this.createChiMj(chiList[i]);
					mjDisplay.x = startX;
					startX += w;
					this.gpcListContainer.addChild(mjDisplay);
				}
			}
			var pengList:number[] = game.pengList[this.uid];
			if(pengList != null){
				len = pengList.length;
				for(var i:number = 0; i < len ;i++){
					mjDisplay = this.createPengMj(pengList[i]);
					mjDisplay.x = startX;
					startX += w;
					this.gpcListContainer.addChild(mjDisplay);
				}
			}
			var gangList:number[] = game.gangList[this.uid];
			if(gangList != null){
				len = gangList.length;
				for(var i:number = 0; i < len ;i++){
					mjDisplay = this.createGangMj(gangList[i]);
					mjDisplay.x = startX;
					startX += w;
					this.gpcListContainer.addChild(mjDisplay);
				}
			}
			var angangList:number[] = game.angangList[this.uid];
			if(angangList != null){
				len = angangList.length;
			for(var i:number = 0; i < len ;i++){
					mjDisplay = this.createAnGangMj(angangList[i]);
					mjDisplay.x = startX;
					startX += w;
					this.gpcListContainer.addChild(mjDisplay);
				}
			}
			var niuStartValsList:number[] = game.niuList[this.uid][0];
			
			if(niuStartValsList != null && niuStartValsList.length > 1){
				var group:number[][] = MajiangConstant.niuGroup(niuStartValsList);
				for(var i = 0 ;i<group.length;i++){
					mjDisplay = this.createNiuMj_down(group[i]);// 小组合
					mjDisplay.x = startX;
					startX += w;
					this.gpcListContainer.addChild(mjDisplay);
				}
				
			}
		}
		
		/**
		 * 创建吃牌麻将
		 */
		public createChiMj(mjs:number[]){
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			var container:starlingswf.SwfSprite = MjGameAsset.mjSwf.createSprite("spr_peng_1");
			var len:number = mjs.length;
			for(var i:number = 0; i < len ;i++){
				container.getImage("_" + (i+1)).texture = RES.getRes("img_MJ_PX_" + mjs[i]);
				var logo:egret.Bitmap = container.getImage("_logo" + (i+1));
				logo.visible = game.hunMj == mjs[i];	
			}
			return container;
		}

		/**
		 * 创建碰牌麻将
		 */
		public createPengMj(mjVal:number){
			var container:starlingswf.SwfSprite = MjGameAsset.mjSwf.createSprite("spr_peng_1");
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			for(var i:number = 0; i < 3 ;i++){
				container.getImage("_" + (i+1)).texture = RES.getRes("img_MJ_PX_" + mjVal);
				var logo:egret.Bitmap = container.getImage("_logo" + (i+1));
				logo.visible = game.hunMj == mjVal;
			}
			return container;
		}
		public createNiuMj_up(val:number):egret.DisplayObject{
			var container:starlingswf.SwfSprite = MjGameAsset.mjSwf.createSprite("spr_mj_3");
			var bit:egret.Bitmap = container.getChildAt(1) as egret.Bitmap;
			bit.texture = RES.getRes("img_MJ_PX_" + val);
			var logo:egret.Bitmap = MjGameAsset.mainSwf.createImage("img_MJ_TB27");
			logo.scaleX = logo.scaleY = 0.7;
			logo.x = container.width - logo.width * 0.7;
			logo.y = container.height - logo.height * 0.8;
			container.addChild(logo);
			return container;
		}
		public createNiuMj_down(vals:number[]):egret.DisplayObject{
			var valsLen = vals.length;
			if(valsLen<= 3){
				var container:starlingswf.SwfSprite = MjGameAsset.mjSwf.createSprite("spr_peng_1");
			}else{
				var container:starlingswf.SwfSprite = MjGameAsset.mjSwf.createSprite("spr_niufeng_1");
			}
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			for(var i:number= 0 ;i<vals.length;i++){
				var mjobj:egret.Bitmap = container.getImage("_" + (i+1));
				mjobj.texture = MjGameAsset.mjSwf.createImage("img_MJ_PX_"+vals[i]).texture;
				var logo:egret.Bitmap = container.getImage("_logo" + (i+1));
				logo.visible = game.hunMj == vals[i];
				
			}
			return container; 
		}
		/**
		 * 创建杠牌麻将
		 */
		public createGangMj(mjVal:number){
			var container:starlingswf.SwfSprite = MjGameAsset.mjSwf.createSprite("spr_gang_1");
			container.getImage("_1").texture = RES.getRes("img_MJ_PX_" + mjVal);
			return container;
		}

		/**
		 * 创建暗杠麻将
		 */
		public createAnGangMj(mjVal:number){
			return this.createGangMj(mjVal);
		}

		/**
		 * 显示别人的操作
		 */
		public showOptVal(opVal:number):void{
			var mc:starlingswf.SwfMovieClip;
			if(opVal == 5){
				var game:MajiangGame = MajiangGameData.getCurrentGame();
				if(game.lOpUid == this.uid && (game.lOpVal == 3)){
					mc = MjGameAsset.effSwf.createMovie("mc_gangkai_eff");
				}else if(MajiangGameData.getMjCount() < 4){
					mc = MjGameAsset.effSwf.createMovie("mc_haidilao_eff");
				}else{
					mc = MjGameAsset.effSwf.createMovie("mc_eff_" + opVal);
				}
			}else{
				mc = MjGameAsset.effSwf.createMovie("mc_eff_" + opVal);
			}
			mc.x = this.opValMcX;
			mc.y = this.opValMcY;
			mc.loop = false;
			this.addChild(mc);
			var thisObj:MjListPanel = this;
			egret.setTimeout(function():void{
				thisObj.removeChild(mc);
			},this,3000);
		}

		/**
		 * 显示别人出来之后 自己的选项(别人对自己牌的操作)
		 */
		public showOption(mjVal:number,zimo:boolean = false){
			if(MajiangGameData.getMjCount() < 4){
				MjGameApi.operating(0);
				return;
			}
			var mjList:number[] = MajiangGameData.getMjs();
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			var isOneWanNeng:boolean = mjList.length == 1 && mjList[0] == MajiangGameData.getCurrentGame().hunMj;
			var hu:boolean = !isOneWanNeng && MajiangConstant.findHu(mjVal,mjList) && (MajiangGameData.getCurrentGame().guohu[this.uid] == null);

			var chiList:number[][] = MajiangConstant.findChi(mjVal,mjList);//他人对自己调牌出来的牌的吃的操作
			//如果他人对调牌后的牌有吃的操作 则会有 chiList

			var pengIndex:number = MajiangConstant.findPeng(mjVal,mjList);
			var gangIndex:number = MajiangConstant.findGang(mjVal,mjList);
			var len:number = chiList.length;
			//扭的牌不能吃
			if(len > 0 && game.lOpVal == 7){
				var niuList:number[] = game.niuList[game.lOpUid];
				if(niuList.length > 1 && niuList[niuList.length - 1] == 10){
					len = 0;
				}
			}
			if(!hu && len == 0 && pengIndex == -1 && gangIndex == -1){
				MjGameApi.operating(0);
				return;
			}
			
			this.showGuo();

			if(hu){
				this.showHu();
			}
			if(len > 0 ){ 
				this.showChi(chiList);          
			}
			if(pengIndex != -1){
				this.showPeng(pengIndex);
			}
			if(gangIndex != -1){
				this.showGang(gangIndex);
			}
		}

		/**
		 * 显示过牌按钮
		 */
		public showGuo():void{
			var btn:starlingswf.SwfButton = this.createOpBtn(0,0);
			this.opEventList[this.opEventNo] = [btn,0];
			this.opEventNo++;
		}
		/**
		 * 显示过牌按钮
		 */
		public showQiangGangGuo():void{
			var btn:starlingswf.SwfButton = this.createOpBtn(-8,1);
			this.opEventList[this.opEventNo] = [btn,-8];
			this.opEventNo++;
		}
		/**
		 * 显示吃牌按钮
		 */
		public showChi(chiList:number[][]):void{
			var btn:starlingswf.SwfButton = this.createOpBtn(1,0);
			this.opEventList[this.opEventNo] = [btn,1,chiList];
			this.opEventNo++;
		}
		/**
		 * 显示碰牌按钮
		 */
		public showPeng(index:number):void{
			var btn:starlingswf.SwfButton = this.createOpBtn(2,index);
			this.opEventList[this.opEventNo] = [btn,2];
			this.opEventNo++;
		}
		/**
		 * 显示杠牌按钮
		 */
		public showGang(index:number):void{
			var btn:starlingswf.SwfButton = this.createOpBtn(3,index);
			this.opEventList[this.opEventNo] = [btn,3];
			this.opEventNo++;
		}

		/**
		 * 显示胡牌按钮
		 */
		public showHu():void{
			var btn:starlingswf.SwfButton = this.createOpBtn(4,0);
			this.opEventList[this.opEventNo] = [btn,4];
			this.opEventList['hasHu'] = 1;
			this.opEventNo++;
		}

		/**
		 * 显示胡牌按钮
		 */
		public showZiMo():void{
			var btn:starlingswf.SwfButton = this.createOpBtn(5,0);
			this.opEventList[this.opEventNo] = [btn,5];
			this.opEventNo++;
		}
		/**
		 * 判断手牌中是否可以扭牌
		 */
		public isStartNiu:boolean = false;

		public showNiu():boolean{ // 判断是否显示扭牌图标
			if(MajiangGameData.getMjCount() <= 0){
				return false;
			}
			//在这里判断是否能扭牌(第一手判断有没有中发白)
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			var mjList:number[] = MajiangGameData.getMjs();
			var uid:string = RoleData.getRole().uid;
			var data:number[] = [];
			var niuGroupList:number[] = game.niuList[uid][0];

			this.isStartNiu = false;// 如果为 true 则开始扭牌 false 则不能扭牌 表示一种状态

			if(game.chupaiList[uid] == null && MajiangConstant.hasStartNiu(mjList) ){ // 是起手牌 且 手牌中还有扭牌组合
				this.isStartNiu = true;//是扭 组合 的 确认

				data = MajiangConstant.findAllNiu(mjList);

				var wncount:number = MajiangConstant.getWannengCount(MajiangConstant.clone_array(mjList));
				var list:number[] = [10,28,29,30,31,32,33,34];
				
				if(list.indexOf(game.hunMj) == -1){ //使用万能牌
					for(var i:number = 0;i<wncount;i++){
						data.push(game.hunMj);
					}
				}
			}else if(niuGroupList[0] == -1){
				MjGameApi.niuSelf([0]);
			}else if(niuGroupList.length > 1){
				data = MajiangConstant.findNiu(mjList);
			}else{
				return false;
			}

			if(data.length > 0){
				var btn:starlingswf.SwfButton = this.createOpBtn(7,0);
				this.opEventList[this.opEventNo] = [btn,7,data];
				this.opEventNo++;
				return true;
			}
			return false;
		}
		/**
		 * 显示杠自己牌的
		 */
		public showGangSelf():boolean{
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			var pengList:number[] = game.pengList[this.uid];
			var data:number[] = [];

			var mjList:number[] = MajiangGameData.getMjs();
			var countVals:any = MajiangConstant.array_values_count(mjList);
			var len:number = mjList.length;
			var mjVal:number;
			for(var i:number = 0; i < len ; i++){
				mjVal = mjList[i];
				if(data.indexOf(mjVal) != -1) continue;
				if(countVals[mjVal] == 4){
					data.push(mjVal);
				}else if(pengList != null && pengList.indexOf(mjVal) != -1){
					data.push(mjVal);
				}
			}

			if(data.length > 0){
				this.opEventList[this.opEventNo] = [this.createOpBtn(-3,0),-3,data];
				this.opEventNo++;
				return true;
			}
			return false;
		}

		/**
		 * 显示听牌按钮
		 */
		public showTing():void{
			var mjList:number[] = MajiangGameData.getMjs();
			var tings:any[] = MajiangConstant.findTing(mjList);
			if(tings.length > 0){
				this.opEventList[this.opEventNo] = [this.createOpBtn(6,0),6,tings];
				this.opEventNo++;
			}
		}
		/**
		 * 别人明杠，显示抢杠选项
		 */
		public showQiangGangOption(mjVal:number){
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			var mjList:number[] = MajiangGameData.getMjs();
			var hu:boolean = MajiangConstant.findHu(mjVal,mjList);
			if(hu){
				this.showQiangGangGuo();
				this.showQiangGang();
			}else{
				MjGameApi.minggangCallBack(-8);
			}
		}

		/**
		 * 显示抢杠按钮
		 */
		public showQiangGang():void{
			var btn:starlingswf.SwfButton = this.createOpBtn(8,0);
			this.opEventList[this.opEventNo] = [btn,8];
			this.opEventNo++;
		}
		/**
		 * 创建选项按钮
		 */
		public createOpBtn(opVal:number,index:number):starlingswf.SwfButton{
			var len:number = MajiangGameData.getMjs().length - 1;
			index = len - index;

			var btn:starlingswf.SwfButton;
			if(opVal == 0 || opVal == -8){
				btn = MjGameAsset.mainSwf.createButton("btn_guo");
				btn.x = -85.1;
				btn.y = -112.55;
			}else if(opVal == 1){
				btn = MjGameAsset.mainSwf.createButton("btn_chi");
				btn.x = -582.05;
				btn.y = -111.55;
			}else if(opVal == 7){
				btn = MjGameAsset.mainSwf.createButton("btn_niu");
				btn.x = -582.05; 
				btn.y = -111.55;
			}else if(opVal == 2){
				btn = MjGameAsset.mainSwf.createButton("btn_peng");
				btn.x = -426.1;
				btn.y = -111.55;
				this.mjListContainer.getChildAt(index - 1).y = -24;
				this.mjListContainer.getChildAt(index).y = -24;
			}else if(opVal == 3 || opVal == -3){
				btn = MjGameAsset.mainSwf.createButton("btn_gang");
				btn.x = -745.05;
				btn.y = -111.55;
				if(opVal == 3){
					this.mjListContainer.getChildAt(index - 1).y = -24;
					this.mjListContainer.getChildAt(index).y = -24;
					this.mjListContainer.getChildAt(index + 1).y = -24;
				}
			}else if(opVal == 4){
				btn = MjGameAsset.mainSwf.createButton("btn_hu");
				btn.x = -265.1;
				btn.y = -111.55;
			}else if(opVal == 5){
				btn = MjGameAsset.mainSwf.createButton("btn_zimo"); 
				btn.x = -307.1;
				btn.y = -114.55;
			}else if(opVal == 6){
				btn = MjGameAsset.mainSwf.createButton("btn_ting");
				btn.x = -901.8;
				btn.y = -114.55;
			}else if(opVal == 8){
				btn = MjGameAsset.mainSwf.createButton("btn_hu");
				btn.x = -265.1;
				btn.y = -111.55;
			}
			btn.name = this.opEventNo.toString();
			btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClickOpBtn,this);
			this.mjListContainer.addChild(btn);

			return btn;
		}








		//-----------------以下为出牌的逻辑---------------------//

		public currentChooseMj:egret.DisplayObject;

		/**
		 * 点击麻将
		 */
		public onClickMj(e:egret.Event):void{
			var mj:egret.DisplayObject = e.currentTarget;
			if(this.currentChooseMj == mj){
				var game:MajiangGame = MajiangGameData.getCurrentGame();
				if(!game.chupai || game.currentUid != RoleData.getRole().uid){
					// ApiState.showText("现在不该你出牌！");
					this.currentChooseMj = null;
					egret.Tween.get(mj).to({y:mj.y + 24},200);
					return;
				}
				MjGameApi.chupai(mj.name);
			}else{
				egret.Tween.get(mj).to({y:- 24},200,egret.Ease.backOut);
				if(this.currentChooseMj != null){
					egret.Tween.get(this.currentChooseMj).to({y:0},200);
				}
				this.currentChooseMj = mj;
			}

			if(starlingswf.SwfButton.defSound != null){
				starlingswf.SwfButton.defSound.play(0,1);
			}
		}

		/**
		 * 点击操作按钮
		 */
		public onClickOpBtn(e:egret.Event):void{
			var opNo:number = parseInt(e.currentTarget.name);
			var opData:any[] = this.opEventList[opNo];
			var opVal:number = opData[1];
			if(opVal == 1){
				var chiList:number[][] = opData[2];
				if(chiList.length > 1){
					lzm.Alert.alertLandscape(new ChiTips(this,chiList));
					return;
				}else{
					var mjList:number[] = MajiangGameData.getMjs();
					var chiIndex:number[] = opData[2][0];
					MjGameApi.operating(opVal,[mjList[chiIndex[0]],mjList[chiIndex[1]]]);
				}
			}else if(opVal == 5){
				MjGameApi.zimo();
			}else if(opVal == -3){
				var data:number[] = opData[2];
				if(data.length > 1){
					lzm.Alert.alertLandscape(new GangTips(this,opData[2]));
					return;
				}else{
					MjGameApi.callGangApi(data[0]);
				}
			}else if(opVal == 6){
				var tings:any[] = opData[2];
				if(tings.length > 1){
					lzm.Alert.alertLandscape(new TingTips(this,tings));
					return;
				}else{
					var tingObj:any[] = tings[0];
					tingObj[0] = MajiangConstant.findTingShowVals(MajiangGameData.getMjs(),tingObj);
					MjGameApi.chupai(tingObj[2],tingObj);
				}
			}else if(opVal == 7){
				var data:number[] = opData[2];
				if(data.length > 1){//当在手牌中找到可以调牌的牌时
					if(this.isStartNiu){
						lzm.Alert.alertLandscape(new StartNiuTips(this,opData[2]));
					}else{
						lzm.Alert.alertLandscape(new NiuTips(this,opData[2]));
					}
					return;
				}else{
					MjGameApi.niuSelf(data);
				}
			}else if(opVal == 8 || opVal == -8){
				MjGameApi.minggangCallBack(opVal);
			}else{
				if(opVal == 0 && this.opEventList['hasHu']){
					MjGameApi.operating(opVal,null,1);
				}else{
					MjGameApi.operating(opVal);
				}
				
			}
			this.disposeOperatingBtn();
		}

		/**
		 * 释放操作按钮
		 */
		public disposeOperatingBtn():void{
			var opData:any[];
			var btn:starlingswf.SwfButton;
			for(var k in this.opEventList){
				if(k == "hasHu") continue;
				opData = this.opEventList[k];
				btn = opData[0];
				btn.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClickOpBtn,this);
				if(btn.parent != null){
					btn.parent.removeChild(btn);
				}
			}
			this.opEventList = {};
			this.opEventNo = 1;
			
			var len:number = this.mjListContainer.$children.length;
			for(var i:number = 0; i < len ;i++){
				this.mjListContainer.getChildAt(i).y = 0;
			}
		}

		/**
		 * 释放麻将的点击事件
		 */
		public disposeMjClickEvent():void{
			this.currentChooseMj = null;
			var len:number = this.mjListContainer.$children.length;
			for(var i:number = 0; i < len ; i++){
				this.mjListContainer.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClickMj,this);
			}
		}

		public dispose():void{
			this.disposeMjClickEvent();
			if(this.opEventList != null){
				var btn:starlingswf.SwfButton;
				var opData:any[]
				for(var k in this.opEventList){
					opData = this.opEventList[k];
					btn = opData[0];
					btn.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClickOpBtn,this);
				}
			}
			MjListPanel.currentMjTag = null;
		}



	}
}