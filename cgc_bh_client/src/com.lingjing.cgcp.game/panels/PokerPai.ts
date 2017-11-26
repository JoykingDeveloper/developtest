module lj.cgcp.game.baohuang {
	 export class PokerPai extends egret.DisplayObjectContainer{
		 /**
		  * 花色和点数信息
		 */

		//处理选牌事件

		public carddata:any;
		//牌所在位置
		public index:number = 0;
		public cardImage:egret.Bitmap;
		public dizhuImage:egret.Bitmap;
		public maskImage:egret.Bitmap;
		public ischoose:boolean = false;
		public _ismask:boolean = false;
		public constructor(data:any,index:number){
			super();
			this.index = index;
			this.carddata = data;
			var cardName = "img_BH_PK_"+data[0]+"_"+data[1];
			this.cardImage = BHAsset.paiSwf().createImage(cardName);
			this.addChild(this.cardImage);

			//创建mask
			this.maskImage = BHAsset.paiSwf().createImage("img_BH_PK_CM");
			this.maskImage.width = 103;
			this.maskImage.height = 140;
			this.addChild(this.maskImage);
			this.maskImage.visible = false;
		}
		public setChoose():void{
			this.ischoose = !this.ischoose;
			egret.Tween.get(this.cardImage).to({y:this.ischoose?-28:0},250,egret.Ease.backOut);
			egret.Tween.get(this.maskImage).to({y:this.ischoose?-28:0},250,egret.Ease.backOut);
			if(this.dizhuImage != null){
				egret.Tween.get(this.dizhuImage).to({y:this.ischoose?-28:0},250,egret.Ease.backOut);
			}
		}
		public setMask(ismask:boolean):void{
			this._ismask = ismask;
			this.maskImage.visible = this._ismask;
			this.setChildIndex(this.maskImage,2);
		}
		public refreshCardData(data:any):void{
			this.carddata = data;
			this.removeChild(this.cardImage);
			var cardName = "img_BH_PK_"+data[0]+"_"+data[1];
			this.cardImage = BHAsset.paiSwf().createImage(cardName);
			this.addChild(this.cardImage);
		}
		public showDizhuLogo():void{
			//是否地主
			// this.dizhuImage = BHAsset.mainSwf().createImage("img_DDZ_TB16");
			// this.dizhuImage.x = 54;
			// this.addChild(this.dizhuImage);
		}
		public dispose(){
			
		}
	}
}