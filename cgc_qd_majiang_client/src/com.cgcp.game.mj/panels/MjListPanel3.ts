module lj.cgcp.game.qdmj_705 {
	export class MjListPanel3 extends MjListPanel {
		public constructor() {
			super();
		}

		public initContainerPos(){
			this.mjListContainer.x = 995;
			this.mjListContainer.y = 117;
			this.gpcListContainer.x = 957;
			this.gpcListContainer.y = 499;
			this.chupaiListContainer.x = 902;
			this.chupaiListContainer.y = 411;
			this.niuListContanier.y = 411;
			this.niuListContanier.x = 902 - 48*2;
			this.opValMcX = 889.95;
			this.opValMcY = 289;

			this.currentBigMjDisplay.scaleX = this.currentBigMjDisplay.scaleY = 1.2;
			this.currentBigMjDisplay.x = 870.6;
			this.currentBigMjDisplay.y = 310.6;
		}

		/**
		 * 刷新手牌列表
		 */
		public refreshMjList(showTween:boolean,newMjVal:number = -1):void{
			this.mjListContainer.removeChildren();

			var game:MajiangGame = MajiangGameData.getCurrentGame();
			var len:number = game.mjCount[this.uid] ? game.mjCount[this.uid] : 13;
			var mjDisplay:egret.DisplayObject;
			var index:number = 0;
			var h:number = 24;
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			var tingMjsIndex:number = 0;
			var gangList:number[] = game.gangList[this.uid] == null ? [] : game.gangList[this.uid];
			var angangList:number[] = game.angangList[this.uid] == null ? [] : game.angangList[this.uid];
			for(var i:number = len - 1; i >= 0 ; i--){
				mjDisplay = this.createMj(1);
				mjDisplay.y = (h * index);
				this.mjListContainer.addChild(mjDisplay);
				index++;
			}
			if(showTween) this.showMoveMjs(1);
		}

		/**
		 * 创建手牌麻将
		 */
		public createMj(val:number):egret.DisplayObject{
			var bitmap:egret.Bitmap = MjGameAsset.mjSwf.createImage("img_MJ_PXD7");
			bitmap.scaleX = -1;
			return bitmap;
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
			var w:number = 48;
			var h:number = 29;
			var row:number;
			var mj:egret.DisplayObject;
			var index:number = 0;
			for(var i:number = 0; i < len ; i++){
				startY = -(index * h);
				mj = this.createChupaiMj(chuList[i]);
				mj.x = startX;
				mj.y = startY;
				index++;
				if(index == 10){
					startX -= w;
					startY = 0;
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
			var len:number = chuList.length - 1;
			var mj:egret.DisplayObject = this.createChupaiMj(mjVal);
			mj.x -= parseInt((len / 10) + "") * 48;
			mj.y = -((len % 10) * 29);
			this.currentMjDisplay = mj;
			this.chupaiListContainer.addChildAt(mj,0);
			this.showCurrentMjTag();
		}
		/**
		 * 刷新出过的牌的列表
		 */
		public refreshNiuList():void{
			var niuList:number[] = MajiangGameData.getCurrentGame().niuList[this.uid];

			this.niuListContanier.removeChildren();
			if(niuList == null || niuList.length < 2) return;

			var len:number = niuList.length;
			var startX:number = 0;
			var startY:number = 0;
			var w:number = 48;
			var h:number = 29;
			var row:number;
			var mj:egret.DisplayObject;
			var index:number = 0;
			for(var i:number = 1; i < len ; i++){
				startY = -(index * h);
				mj = this.createNiuMj_up(niuList[i]);
				mj.x = startX;
				mj.y = startY;
				index++;
				if(index == 10){
					startX -= w;
					startY = 0;
					index = 0;
				}
				// this.currentMjDisplay = mj;
				this.niuListContanier.addChildAt(mj,0);
			}
		}

		/**
		 * 添加一张牌到出牌列表
		 */
		public addNiuList(){
			var niuList:number[] = MajiangGameData.getCurrentGame().niuList[this.uid];
			var len:number = niuList.length - 2;
			var mj:egret.DisplayObject = this.createNiuMj_up(niuList[len+1]);
			mj.x -= parseInt((len / 10) + "") * 48;
			mj.y = -((len % 10) * 29);
			// this.currentMjDisplay = mj;
			this.niuListContanier.addChildAt(mj,0);
			// this.showCurrentMjTag();
		}
		/**
		 * 创建出过的麻将
		 */
		public createChupaiMj(val:number):egret.DisplayObject{
			var container:starlingswf.SwfSprite = MjGameAsset.mjSwf.createSprite("spr_mj_4");
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
			var startY:number = -93;
			var w:number = 0;
			var h:number = 90;
			var mjDisplay:egret.DisplayObject;
			if(chiList != null){
				len = chiList.length;
				for(var i:number = 0; i < len ;i++){
					mjDisplay = this.createChiMj(chiList[i]);
					mjDisplay.y = startY;
					startY -= h;
					this.gpcListContainer.addChildAt(mjDisplay,0);
				}
			}
			var pengList:number[] = game.pengList[this.uid];
			if(pengList != null){
				len = pengList.length;
				for(var i:number = 0; i < len ;i++){
					mjDisplay = this.createPengMj(pengList[i]);
					mjDisplay.y = startY;
					startY -= h;
					this.gpcListContainer.addChildAt(mjDisplay,0);
				}
			}
			var gangList:number[] = game.gangList[this.uid];
			if(gangList != null){
				len = gangList.length;
				for(var i:number = 0; i < len ;i++){
					mjDisplay = this.createGangMj(gangList[i]);
					mjDisplay.y = startY;
					startY -= h;
					this.gpcListContainer.addChildAt(mjDisplay,0);
				}
			}
			var angangList:number[] = game.angangList[this.uid];
			if(angangList != null){
				len = angangList.length;
				for(var i:number = 0; i < len ;i++){
					mjDisplay = this.createAnGangMj(angangList[i]);
					mjDisplay.y = startY;
					startY -= h;
					this.gpcListContainer.addChildAt(mjDisplay,0);
				}
			}
			var niuList:number[] = game.niuList[this.uid][0];
			if(niuList != null && niuList.length > 1){
				var group:number[][] = MajiangConstant.niuGroup(niuList);
				for(var i = 0 ;i<group.length;i++){
				mjDisplay = this.createNiuMj_down(group[i]);
				mjDisplay.y = startY;
				startY -= h;
				this.gpcListContainer.addChild(mjDisplay);
			 }
			}
		}
		public createNiuMj_up(val:number):egret.DisplayObject{
			var container:starlingswf.SwfSprite = MjGameAsset.mjSwf.createSprite("spr_mj_4");
			var bit:egret.Bitmap = container.getChildAt(1) as egret.Bitmap;
			bit.texture = RES.getRes("img_MJ_PX_" + val);
			var logo:egret.Bitmap = MjGameAsset.mainSwf.createImage("img_MJ_TB27");
			logo.scaleX = logo.scaleY = 0.7;
			logo.x = container.width - logo.width * 0.6;
			logo.y = container.height - logo.height * 0.4;
			logo.rotation = -90;
			container.addChild(logo);
			return container;
		}
		public createNiuMj_down(vals:number[]):egret.DisplayObject{
				var valsLen = vals.length;
			if(valsLen<= 3){
				var container:starlingswf.SwfSprite = MjGameAsset.mjSwf.createSprite("spr_peng_3");
			}else{
				var container:starlingswf.SwfSprite = MjGameAsset.mjSwf.createSprite("spr_niufeng_3");
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
		 * 创建吃牌麻将
		 */
		public createChiMj(mjs:number[]){
			var game:MajiangGame = MajiangGameData.getCurrentGame();			
			var container:starlingswf.SwfSprite = MjGameAsset.mjSwf.createSprite("spr_peng_3");
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
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			var container:starlingswf.SwfSprite = MjGameAsset.mjSwf.createSprite("spr_peng_3");
			for(var i:number = 0; i < 3 ;i++){
				container.getImage("_" + (i+1)).texture = RES.getRes("img_MJ_PX_" + mjVal);
				var logo:egret.Bitmap = container.getImage("_logo" + (i+1));
				logo.visible = game.hunMj == mjVal;
			}
			return container;
		}

		/**
		 * 创建杠牌麻将
		 */
		public createGangMj(mjVal:number){
			var container:starlingswf.SwfSprite = MjGameAsset.mjSwf.createSprite("spr_gang_3");
			container.getImage("_1").texture = RES.getRes("img_MJ_PX_" + mjVal);
			return container;
		}

		/**
		 * 创建暗杠麻将
		 */
		public createAnGangMj(mjVal:number){
			var container:starlingswf.SwfSprite = MjGameAsset.mjSwf.createSprite("spr_angang_2");
			return container;
		}
	}
}