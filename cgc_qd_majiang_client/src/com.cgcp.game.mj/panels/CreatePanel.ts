module lj.cgcp.game.qdmj_705 {
	export class CreatePanel extends ExtGameCreatePanel {

		public mainAsset:starlingswf.SwfSprite;

		// public ju6Btn:starlingswf.SwfButton;
		public ju8Btn:starlingswf.SwfButton;
		public aaBtn:starlingswf.SwfButton;
		public fangzhuBtn:starlingswf.SwfButton;
		// public fengBtn:starlingswf.SwfButton;
		public fengNotBtn:starlingswf.SwfButton;

		public feng:number;

		public constructor() {
			super();
			this.mainAsset = MjGameAsset.mainSwf.createSprite("spr_create");
			this.addChild(this.mainAsset);
			InterfaceVariablesUtil.initVariables(this,this.mainAsset);

			// (this.ju6Btn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
			(this.fangzhuBtn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
			// (this.fengNotBtn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
			this.cardType = 8;
			this.aa = true;
			this.feng =1;
			this.updateTextFieldtext();
		}
        public updateTextFieldtext():void{
            var skin:egret.DisplayObjectContainer = (this.ju8Btn.skin as egret.DisplayObjectContainer);
            var textField:egret.TextField = (skin.getChildAt(4) as egret.TextField);
            textField.text = "房卡X"+(this.aa?3:12);
        }

		public on_cancelBtn(e:egret.Event){
			this.parent.removeChild(this);
			this.dispose();
		}
		public on_okBtn(e:egret.Event){
			this.create();
		}
		// public on_ju6Btn(e:egret.Event){
		// 	(this.ju8Btn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
		// 	(this.ju6Btn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = true;
		// 	this.cardType = 16;
		// }
		public on_ju8Btn(e:egret.Event){
			(this.ju8Btn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = true;
			// (this.ju6Btn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
			this.cardType = 8;
		}

		public on_aaBtn(e:egret.Event){
			if(this.aa)return;
			(this.aaBtn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = true;
			(this.fangzhuBtn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
			this.aa = true;
			this.updateTextFieldtext();
		}
		public on_fangzhuBtn(e:egret.Event){
			if(!this.aa)return;
			(this.aaBtn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
			(this.fangzhuBtn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = true;
			this.aa = false;
			this.updateTextFieldtext()
		}
		public on_fengBtn(e:egret.Event){
			// (this.fengBtn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = true;
			// (this.fengNotBtn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
			// this.feng = 0;
		}
		public on_fengNotBtn(e:egret.Event){
			// (this.fengBtn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
			// (this.fengNotBtn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = true;
			// this.feng = 1;
		}

		public createData(): any{
			return {"feng":this.feng};
		}

		public dispose(){
			super.dispose();
			InterfaceVariablesUtil.disposeVariables(this);
		}


	}
}