module lj.cgcp.game.doudizhu {
	export class ResultPanel extends egret.DisplayObjectContainer{
		
		public shape:egret.Shape;
		public constructor(iswin:boolean) {
			super();
			this.shape = new egret.Shape();
			this.shape.graphics.clear();
			this.shape.graphics.beginFill(0x000000, 0.4);
			this.shape.graphics.drawRect(0, 0, DouDiZhuAsset.gameWidth, DouDiZhuAsset.gameHeight);
			this.shape.graphics.endFill();
			this.addChild(this.shape);
			var imgName = iswin?"img_DDZ_JSBX9":"img_DDZ_JSBX8";
			var bitmap:egret.Bitmap = DouDiZhuAsset.mainSwf().createImage(imgName);
			bitmap.x = (DouDiZhuAsset.gameWidth-bitmap.width)/2;
			bitmap.y = -bitmap.height;
			this.addChild(bitmap);
			
			egret.Tween.get(bitmap).to({y:(DouDiZhuAsset.gameHeight - bitmap.height)/2},300,egret.Ease.backInOut);

			this.addEventListener(egret.Event.ADDED_TO_STAGE,this.addToStage,this);
			
		}
		public addToStage(e:egret.Event):void{
			this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTap,this);
		}
		public onTap(e:egret.TouchEvent):void{
			this.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onTap,this);
			this.parent.removeChild(this);
		}
	}
}