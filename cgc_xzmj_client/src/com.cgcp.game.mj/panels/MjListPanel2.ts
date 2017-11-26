module lj.cgcp.game.scmj_204 {
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
			this.threeListContainer.x = 1136/2;
			this.threeListContainer.y = 190;

			this.opValMcX = 577.95;
			this.opValMcY = 172;

			this.currentBigMjDisplay.scaleX = this.currentBigMjDisplay.scaleY = 1.2;
			this.currentBigMjDisplay.x = 566.45;
			this.currentBigMjDisplay.y = 204.5;
		}
		public showThreeMj(){
			this.threeListContainer.x = 1136/2;
			this.threeListContainer.y = 190;
			this.threeListContainer.rotation = 0;
			var spr:starlingswf.SwfSprite = MjGameAsset.mjSwf.createSprite("spr_three_1");
			spr.rotation = 180;
			this.threeListContainer.addChild(spr);
		}
		public moveThreeMj(type:number){
			var point:egret.Point = new egret.Point();
			var rotate:number = 0;
			switch(type){
				case 1:point = new egret.Point(820,640/2);rotate = 90;break;
				case 2:point = new egret.Point(1136/2,450);break;
				case 3:point = new egret.Point(316,640/2);rotate = -90;break;
			}
			egret.Tween.get(this.threeListContainer).to({x:point.x,y:point.y},850);
			if(rotate){
				egret.Tween.get(this.threeListContainer).to({rotation:rotate},850);
			}
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
			var w:number = 41;
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			// var baiDaCount:number = game.das1[this.uid] + game.das2[this.uid];
			for(var i:number = len - 1; i >= 0 ; i--){
				// if(baiDaCount > 0){
				// 	mjDisplay = this.createChupaiMj(game.da2);
				// 	((mjDisplay as egret.DisplayObjectContainer).getChildAt(0) as egret.Bitmap).texture = RES.getRes("img_MJ_PXD3_1");
				// 	baiDaCount--;
				// }else
				{
					mjDisplay = this.createMj(1);
				}
				mjDisplay.x = (w * index);
				this.mjListContainer.addChildAt(mjDisplay,0);
				index++;
			}
			if(game.alreadyHus[this.uid] != null){
                mjDisplay = this.createHuMj(game.alreadyHus[this.uid]);
                mjDisplay.x = -w;
                this.mjListContainer.addChildAt(mjDisplay,0);
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
        public createHuMj(val:number):egret.DisplayObject{
            var container:starlingswf.SwfSprite = MjGameAsset.mjSwf.createSprite("spr_mj_3");
            var bit:egret.Bitmap = container.getChildAt(1) as egret.Bitmap;
            bit.texture = RES.getRes("img_MJ_PX_" + val);
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
			var w:number = 38;
			var h:number = 44;
			var row:number;
			var mj:egret.DisplayObject;
			var index:number = 0;
			for(var i:number = 0; i < len ; i++){
				startX = -(index * w);
				mj = this.createChupaiMj(chuList[i]);
				mj.name = chuList[i].toString();
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
			mj.name = mjVal.toString();
			mj.x = -((len % 10) * 38);
			mj.y += parseInt((len / 10) + "") * 44;
			this.currentMjDisplay = mj;
			this.chupaiListContainer.addChild(mj);
			this.showCurrentMjTag();
		}

		/**
		 * 创建出过的麻将
		 */
		public createChupaiMj(val:number):egret.DisplayObject{
			var container:starlingswf.SwfSprite = MjGameAsset.mjSwf.createSprite("spr_mj_3");
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
			var startX:number = -118;
			var startY:number = 0;
			var w:number = 124;
			var h:number = 0;
			var mjDisplay:egret.DisplayObject;
			// if(chiList != null){
			// 	len = chiList.length;
			// 	for(var i:number = 0; i < len ;i++){
			// 		mjDisplay = this.createChiMj(chiList[i]);
			// 		mjDisplay.x = startX;
			// 		startX -= w;
			// 		this.gpcListContainer.addChild(mjDisplay);
			// 	}
			// }
			var pengList:number[] = game.pengList[this.uid];
			if(pengList != null){
				len = pengList.length;
				for(var i:number = 0; i < len ;i++){
					mjDisplay = this.createPengMj(pengList[i]);
					mjDisplay.name = pengList[i].toString();
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
					// mjDisplay = this.createAnGangMj(angangList[i]);
					mjDisplay = this.createAnGangMj(angangList[i]);
					mjDisplay.x = startX;
					startX -= w;
					this.gpcListContainer.addChild(mjDisplay);
				}
			}
		}

		/**
		 * 创建杠牌麻将
		 */
		public createGangMj(mjVal:number){
			var container:starlingswf.SwfSprite = MjGameAsset.mjSwf.createSprite("spr_mgang_1");
			var texture:egret.Texture = RES.getRes("img_MJ_PX_" + mjVal);
			container.getImage("_1").texture = texture;
			container.getImage("_2").texture = texture;
			container.getImage("_3").texture = texture;
			// container.getChildByName("daTag").visible = mjVal == MajiangGameData.getCurrentGame().da2;
			return container;
		}
		/**
		 * 创建暗杠牌麻将
		 */
		public createAnGangMj(mjVal:number){
			var container:starlingswf.SwfSprite = MjGameAsset.mjSwf.createSprite("spr_gang_1");
			container.getImage("_1").texture = RES.getRes("img_MJ_PX_" + mjVal);
			// container.getChildByName("daTag").visible = mjVal == MajiangGameData.getCurrentGame().da2;
			return container;
		}
	}
}