module lj.cgcp.game.jinhua {
	export class PaiXingPanel {

		public background:egret.Shape;

		public gamePanel:GamePanel;
		public mainAssets:starlingswf.SwfSprite;

		public constructor(gamePanel:GamePanel) {
			this.gamePanel = gamePanel;

			this.mainAssets = JinHuaAsset.paiSwf().createSprite("spr_paixing");

			this.background = new egret.Shape();
			this.background.graphics.beginFill(0x000000);
        	this.background.graphics.drawRect(0,0, JinHuaAsset.gameWidth, JinHuaAsset.gameHeight);
        	this.background.graphics.endFill();
			this.background.alpha = 0.5;
			this.background.touchEnabled = true;
			this.background.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBackGround,this);
			this.mainAssets.addChildAt(this.background,0);
		}

		public show(){
			this.gamePanel.addChild(this.mainAssets);
		}

		public hide(){
			if(this.mainAssets.parent != null){
				this.mainAssets.parent.removeChild(this.mainAssets);
			}
		}

		public onBackGround(e:egret.TouchEvent){
			this.hide();
		}

		public dispose():void{
			this.background.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onBackGround,this);
		}



	}
}