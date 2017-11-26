module lj.cgcp.game.doudizhu {
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
			var cardName = "img_DDZ_PK_"+(data[0] == -1?0:data[0])+"_"+data[1];
			this.cardImage = data[0]<3?DouDiZhuAsset.pai1Swf().createImage(cardName):DouDiZhuAsset.paiSwf().createImage(cardName);
			this.addChild(this.cardImage);

			//创建mask
			this.maskImage = DouDiZhuAsset.paiSwf().createImage("img_DDZ_PK_XW_MB");
			this.maskImage.width = 120;
			this.maskImage.height = 162;
			this.addChild(this.maskImage);
			this.maskImage.visible = false;
		}
		public setChoose():void{
			this.ischoose = !this.ischoose;
			var posY:number = this.index > 9 ? 595:510;
			egret.Tween.get(this).to({y:this.ischoose?posY-35:posY},150,egret.Ease.backOut);
		}
		public setMask(ismask:boolean):void{
			this._ismask = ismask;
			this.maskImage.visible = this._ismask;
			this.setChildIndex(this.maskImage,2);
		}
		public refreshCardData(data:any):void{
			this.carddata = data;
			this.removeChild(this.cardImage);
			var cardName = "img_DDZ_PK_"+(data[0] == -1?0:data[0])+"_"+data[1];
			this.cardImage = data[0]<3?DouDiZhuAsset.pai1Swf().createImage(cardName):DouDiZhuAsset.paiSwf().createImage(cardName);
			this.addChild(this.cardImage);
		}
		public showDizhuLogo():void{
			//是否地主
			this.dizhuImage = DouDiZhuAsset.mainSwf().createImage("img_DDZ_TB16");
			this.dizhuImage.x = 54;
			this.addChild(this.dizhuImage);
		}
		public showTweenDizhuCard():void{
			this.y = this.y - 35;
			egret.setTimeout(function():void{
				egret.Tween.get(this).to({y:this.index > 9 ? 595:510},250,egret.Ease.backOut);
			},this,750);
		}
		public dispose(){
			
		}
	}
}