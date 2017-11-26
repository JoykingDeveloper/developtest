module lj.cgcp.game.scmj_204 {
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
			this.threeListContainer.x = 820;
			this.threeListContainer.y = 640/2;

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
			var h:number = 23;
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			// var baiDaCount:number = game.das1[this.uid] + game.das2[this.uid];
			for(var i:number = len - 1; i >= 0 ; i--){
				// if(baiDaCount > 0){
				// 	mjDisplay = this.createChupaiMj(game.da2);
				// 	mjDisplay.x = -26;
				// 	((mjDisplay as egret.DisplayObjectContainer).getChildAt(0) as egret.Bitmap).texture = RES.getRes("img_MJ_PXD5_1");
				// 	baiDaCount--;
				// }else
				{
					mjDisplay = this.createMj(1);
				}
				mjDisplay.y = (h * index);
				this.mjListContainer.addChild(mjDisplay);
				index++;
			}
            if(game.alreadyHus[this.uid] != null){
                mjDisplay = this.createHuMj(game.alreadyHus[this.uid]);
                this.mjListContainer.addChildAt(mjDisplay,0);
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
        public createHuMj(val:number):egret.DisplayObject{
            var container:starlingswf.SwfSprite = MjGameAsset.mjSwf.createSprite("spr_mj_4");
            var bit:egret.Bitmap = container.getChildAt(1) as egret.Bitmap;
            bit.texture = RES.getRes("img_MJ_PX_" + val);
            return container;
        }

		public showThreeMj(){
			this.threeListContainer.x = 820;
			this.threeListContainer.y = 640/2;
			this.threeListContainer.rotation = 0;
			var spr:starlingswf.SwfSprite = MjGameAsset.mjSwf.createSprite("spr_three_1");
			spr.rotation = -90;
			this.threeListContainer.addChild(spr);
		}
		public moveThreeMj(type:number){
			var point:egret.Point = new egret.Point();
			var rotate:number = 0;
			switch(type){
				case 1:point = new egret.Point(1136/2,450);rotate = 90;break;
				case 2:point = new egret.Point(316,640/2);break;
				case 3:point = new egret.Point(1136/2,190);rotate = -90;break;
			}
			egret.Tween.get(this.threeListContainer).to({x:point.x,y:point.y},850);
			if(rotate){
				egret.Tween.get(this.threeListContainer).to({rotation:rotate},850);
			}
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
			var w:number = 47;
			var h:number = 28;
			var row:number;
			var mj:egret.DisplayObject;
			var index:number = 0;
			for(var i:number = 0; i < len ; i++){
				startY = -(index * h);
				mj = this.createChupaiMj(chuList[i]);
				mj.name = chuList[i].toString();
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
			mj.name = mjVal.toString();
			mj.x -= parseInt((len / 10) + "") * 47;
			mj.y = -((len % 10) * 28);
			this.currentMjDisplay = mj;
			this.chupaiListContainer.addChildAt(mj,0);
			this.showCurrentMjTag();
		}

		/**
		 * 创建出过的麻将
		 */
		public createChupaiMj(val:number):egret.DisplayObject{
			var container:starlingswf.SwfSprite = MjGameAsset.mjSwf.createSprite("spr_mj_4");
			var bit:egret.Bitmap = container.getChildAt(1) as egret.Bitmap;
			bit.texture = RES.getRes("img_MJ_PX_" + val);
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			// container.getChildByName("daTag").visible = val == game.da2;
			return container;
		}

		/**
		 * 刷新杠碰吃的牌
		 */
		public refreshGpc():void{
			this.gpcListContainer.removeChildren();
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			
			// var chiList:number[][] = game.chiList[this.uid];
			var len:number;
			var startX:number = 0;
			var startY:number = -93;
			var w:number = 0;
			var h:number = 90;
			var mjDisplay:egret.DisplayObject;
			// if(chiList != null){
			// 	len = chiList.length;
			// 	for(var i:number = 0; i < len ;i++){
			// 		mjDisplay = this.createChiMj(chiList[i]);
			// 		mjDisplay.y = startY;
			// 		startY -= h;
			// 		this.gpcListContainer.addChildAt(mjDisplay,0);
			// 	}
			// }
			var pengList:number[] = game.pengList[this.uid];
			if(pengList != null){
				len = pengList.length;
				for(var i:number = 0; i < len ;i++){
					mjDisplay = this.createPengMj(pengList[i]);
					mjDisplay.name = pengList[i].toString();
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
					// mjDisplay = this.createAnGangMj(angangList[i]);
					mjDisplay = this.createAnGangMj(angangList[i]);
					mjDisplay.y = startY;
					startY -= h;
					this.gpcListContainer.addChildAt(mjDisplay,0);
				}
			}
		}

		/**
		 * 创建吃牌麻将
		 */
		public createChiMj(mjs:number[]){
			var container:starlingswf.SwfSprite = MjGameAsset.mjSwf.createSprite("spr_peng_3");
			var len:number = mjs.length;
			for(var i:number = 0; i < len ;i++){
				container.getImage("_" + (i+1)).texture = RES.getRes("img_MJ_PX_" + mjs[i]);
			}
			return container;
		}

		/**
		 * 创建碰牌麻将
		 */
		public createPengMj(mjVal:number){
			// var vi:boolean = mjVal == MajiangGameData.getCurrentGame().da2;
			var container:starlingswf.SwfSprite = MjGameAsset.mjSwf.createSprite("spr_peng_3");
			for(var i:number = 0; i < 3 ;i++){
				container.getImage("_" + (i+1)).texture = RES.getRes("img_MJ_PX_" + mjVal);
				// container.getChildByName("daTag" + (i + 1)).visible = vi;
			}
			return container;
		}

		/**
		 * 创建杠牌麻将
		 */
		public createGangMj(mjVal:number){
			var container:starlingswf.SwfSprite = MjGameAsset.mjSwf.createSprite("spr_mgang_3");
			var texture:egret.Texture = RES.getRes("img_MJ_PX_" + mjVal);
			container.getImage("_1").texture = texture;
			container.getImage("_2").texture = texture;
			container.getImage("_3").texture = texture;
			// container.getChildByName("daTag").visible = mjVal == MajiangGameData.getCurrentGame().da2;
			return container;
		}

		/**
		 * 创建暗杠麻将
		 */
		public createAnGangMj(mjVal:number){
			var container:starlingswf.SwfSprite = MjGameAsset.mjSwf.createSprite("spr_gang_3");
			container.getImage("_1").texture = RES.getRes("img_MJ_PX_" + mjVal);
			// container.getChildByName("daTag").visible = mjVal == MajiangGameData.getCurrentGame().da2;
			return container;
		}
	}
}