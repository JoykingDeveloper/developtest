module lj.cgcp.game.jinhua {
	export class CreatePanel extends ExtGameCreatePanel {
		
		public mainAsset:starlingswf.SwfSprite;

		public ju6Btn:starlingswf.SwfButton;
		public ju12Btn:starlingswf.SwfButton;
		public ju6Text:egret.TextField;
		public ju12Text:egret.TextField;
		
		public jushu:number = 8;

		public constructor() {
			super();
			this.mainAsset = JinHuaAsset.mainSwf().createSprite("spr_create_room");
			this.addChild(this.mainAsset);
			InterfaceVariablesUtil.initVariables(this,this.mainAsset);

			(this.ju12Btn.skin as egret.DisplayObjectContainer).getChildAt(4).visible = false;
			this.cardType = 8;
			this.aa = true;
		}

		public on_cancelBtn(e:egret.Event){
			this.parent.removeChild(this);
		}
		public on_okBtn(e:egret.Event){
			this.create();
		}
		public on_ju6Btn(e:egret.Event){
			(this.ju6Btn.skin as egret.DisplayObjectContainer).getChildAt(4).visible = true;
			(this.ju12Btn.skin as egret.DisplayObjectContainer).getChildAt(4).visible = false;
			(this.ju6Btn.skin as starlingswf.SwfSprite).getTextField("ju6Text").textColor = 0xEDDFB0;
			(this.ju12Btn.skin as starlingswf.SwfSprite).getTextField("ju12Text").textColor = 0xF1FFFC;
			this.jushu = 8;
			this.cardType = 8;
		}
		public on_ju12Btn(e:egret.Event){
			(this.ju12Btn.skin as egret.DisplayObjectContainer).getChildAt(4).visible = true;
			(this.ju6Btn.skin as egret.DisplayObjectContainer).getChildAt(4).visible = false;
			(this.ju12Btn.skin as starlingswf.SwfSprite).getTextField("ju12Text").textColor = 0xEDDFB0;
			(this.ju6Btn.skin as starlingswf.SwfSprite).getTextField("ju6Text").textColor = 0xF1FFFC;
			this.jushu = 16;
			this.cardType = 16;
		}

		public dispose(){
			super.dispose();
			InterfaceVariablesUtil.disposeVariables(this);
		}

	}
}