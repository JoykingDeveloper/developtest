module lj.cgcp.game.baohuang {
	export class CreatePanel extends ExtGameCreatePanel {
		
		public mainAsset:starlingswf.SwfSprite;

		public ju6Btn:starlingswf.SwfButton;
		public ju8Btn:starlingswf.SwfButton;
		public aaBtn:starlingswf.SwfButton;
		public fangzhupayBtn:starlingswf.SwfButton;

		public okbtn:starlingswf.SwfButton;
		public cancelbtn:starlingswf.SwfButton;
		
		public des:egret.TextField;

		public constructor() {
			super();
			this.mainAsset = BHAsset.mainSwf().createSprite("spr_create_room");
			this.addChild(this.mainAsset);
			InterfaceVariablesUtil.initVariables(this,this.mainAsset);

			(this.ju6Btn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
			(this.fangzhupayBtn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
			this.cardType = 4;
			this.updateTextFieldtext(5);
			this.aa = true;
			this.des.lineSpacing = 20;

		}
        public updateTextFieldtext(playerCount:number,type:number = 1):void{
            var skin:egret.DisplayObjectContainer = (this.ju8Btn.skin as egret.DisplayObjectContainer);
            var textField:egret.TextField = (skin.getChildAt(4) as egret.TextField);
            var textArr:string[] = textField.text.split("x");
            var num:number = type == 1?parseInt(textArr[1])/playerCount:parseInt(textArr[1])*playerCount;
            textField.text = textArr[0]+"x"+(num);

            skin= (this.ju6Btn.skin as egret.DisplayObjectContainer);
            textField = (skin.getChildAt(4) as egret.TextField);
            textArr = textField.text.split("x");
            num= type == 1?parseInt(textArr[1])/playerCount:parseInt(textArr[1])*playerCount;
            textField.text = textArr[0]+"x"+(num);
        }

		public on_cancelBtn(e:egret.Event){
			this.parent.removeChild(this);
		}
		public on_okBtn(e:egret.Event){
			this.create();
		}

		public on_aaBtn(e:egret.Event){
			if(this.aa)return;
			(this.aaBtn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = true;
			(this.fangzhupayBtn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
			this.updateTextFieldtext(5);
			this.aa = true;
		}
		public on_fangzhupayBtn(e:egret.Event){
			if(!this.aa)return;
			(this.aaBtn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
			(this.fangzhupayBtn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = true;
			this.updateTextFieldtext(5,0);
			this.aa = false;
		}
		public on_ju6Btn(e:egret.Event){
			(this.ju8Btn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
			(this.ju6Btn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = true;
			this.cardType = 8;
		}
		public on_ju8Btn(e:egret.Event){
			(this.ju8Btn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = true;
			(this.ju6Btn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
			this.cardType = 4;
		}

		public createData(){
			var data:any = {};
			return data;
		}

		public dispose(){
			super.dispose();
			InterfaceVariablesUtil.disposeVariables(this);
		}

	}
}