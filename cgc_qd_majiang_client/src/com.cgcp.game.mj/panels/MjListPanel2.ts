module lj.cgcp.game.qdmj_705 {
	export class MjListPanel2 extends MjListPanel {
		public constructor() {
			super();
		}

		public initContainerPos(){
			this.mjListContainer.x = 294;
			this.mjListContainer.y = 31;
			this.gpcListContainer.x = 840;
			this.gpcListContainer.y = 43;
			this.chupaiListContainer.x = 763;
			this.chupaiListContainer.y = 103;
			this.niuListContanier.x = 763;
			this.niuListContanier.y = 193;
			this.setChildIndex(this.niuListContanier,3);
			this.opValMcX = 577.95;
			this.opValMcY = 172;

			this.currentBigMjDisplay.scaleX = this.currentBigMjDisplay.scaleY = 1.2;
			this.currentBigMjDisplay.x = 566.45;
			this.currentBigMjDisplay.y = 204.5;
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
			var w:number = 42;
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			var tingMjsIndex:number = 0;
			var gangList:number[] = game.gangList[this.uid] == null ? [] : game.gangList[this.uid];
			var angangList:number[] = game.angangList[this.uid] == null ? [] : game.angangList[this.uid];
			for(var i:number = len - 1; i >= 0 ; i--){
				mjDisplay = this.createMj(1);
				mjDisplay.x = (w * index);
				this.mjListContainer.addChildAt(mjDisplay,0);
				index++;
			}
			if(showTween) this.showMoveMjs(1);
		}

		/**
		 * 创建手牌麻将
		 */
		public createMj(val:number):egret.DisplayObject{
			var bitmap:egret.Bitmap = MjGameAsset.mjSwf.createImage("img_MJ_PXD2");
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
			var w:number = 39;
			var h:number = 45;
			var row:number;
			var mj:egret.DisplayObject;
			var index:number = 0;
			for(var i:number = 0; i < len ; i++){
				startX = -(index * w);
				mj = this.createChupaiMj(chuList[i]);
				mj.x = startX;
				mj.y = startY;
				index++;
				if(index == 10){
					startX = 0;
					startY += h;
					index = 0;
				}
				this.currentMjDisplay = mj;
				this.chupaiListContainer.addChild(mj);
			}
		}

		/**
		 * 添加一张牌到出牌列表
		 */
		public addChupaiList(mjVal:number){
			var chuList:number[] = MajiangGameData.getCurrentGame().chupaiList[this.uid];
			var len:number = chuList.length - 1;
			var mj:egret.DisplayObject = this.createChupaiMj(mjVal);
			mj.x = -((len % 10) * 39);
			mj.y += parseInt((len / 10) + "") * 45;
			this.currentMjDisplay = mj;
			this.chupaiListContainer.addChild(mj);
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
				startX = -(index * w);
				mj = this.createNiuMj_up(niuList[i]);
				mj.x = startX;
				mj.y = startY;
				index++;
				if(index == 10){
					startX = 0;
					startY += h;
					index = 0;
				}
				// this.currentMjDisplay = mj;
				this.niuListContanier.addChild(mj);
			}
		}

		/**
		 * 添加一张牌到扭牌列表
		 */
		public addNiuList(){
			var niuList:number[] = MajiangGameData.getCurrentGame().niuList[this.uid];
			var len:number = niuList.length - 2;
			var mj:egret.DisplayObject = this.createNiuMj_up(niuList[len + 1]);
			mj.x = -((len % 10) * 39);
			mj.y += parseInt((len / 10) + "") * 45;
			// this.currentMjDisplay = mj;
			this.niuListContanier.addChild(mj);
			// this.showCurrentMjTag();
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
			var startX:number = -118;
			var startY:number = 0;
			var w:number = 124;
			var h:number = 0;
			var mjDisplay:egret.DisplayObject;
			if(chiList != null){
				len = chiList.length;
				for(var i:number = 0; i < len ;i++){
					mjDisplay = this.createChiMj(chiList[i]);
					mjDisplay.x = startX;
					startX -= w;
					this.gpcListContainer.addChild(mjDisplay);
				}
			}
			var pengList:number[] = game.pengList[this.uid];
			if(pengList != null){
				len = pengList.length;
				for(var i:number = 0; i < len ;i++){
					mjDisplay = this.createPengMj(pengList[i]);
					mjDisplay.x = startX;
					startX -= w;
					this.gpcListContainer.addChild(mjDisplay);
				}
			}
			var gangList:number[] = game.gangList[this.uid];
			if(gangList != null){
				len = gangList.length;
				for(var i:number = 0; i < len ;i++){
					mjDisplay = this.createGangMj(gangList[i]);
					mjDisplay.x = startX;
					startX -= w;
					this.gpcListContainer.addChild(mjDisplay);
				}
			}
			var angangList:number[] = game.angangList[this.uid];
			if(angangList != null){
				len = angangList.length;
				for(var i:number = 0; i < len ;i++){
					mjDisplay = this.createAnGangMj(angangList[i]);
					mjDisplay.x = startX;
					startX -= w;
					this.gpcListContainer.addChild(mjDisplay);
				}
			}
			var niuList:number[] = game.niuList[this.uid][0];
			if(niuList != null && niuList.length > 1){
				var group:number[][] = MajiangConstant.niuGroup(niuList);
				for(var i = 0 ;i<group.length;i++){
				mjDisplay = this.createNiuMj_down(group[i]);
				mjDisplay.x = startX;
				startX -= w;
				this.gpcListContainer.addChild(mjDisplay);
			}
		 }
		}

		/**
		 * 创建暗杠麻将
		 */
		public createAnGangMj(mjVal:number){
			var container:starlingswf.SwfSprite = MjGameAsset.mjSwf.createSprite("spr_angang_1");
			return container;
		}
	}
}