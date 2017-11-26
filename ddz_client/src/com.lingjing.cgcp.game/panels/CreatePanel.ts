module lj.cgcp.game.doudizhu {
	export class CreatePanel extends ExtGameCreatePanel {
		
		public mainAsset:starlingswf.SwfSprite;

		public ju6Btn:starlingswf.SwfButton;
		public ju8Btn:starlingswf.SwfButton;
		public rule1Btn:starlingswf.SwfButton;
		public rule2Btn:starlingswf.SwfButton;
		public aaBtn:starlingswf.SwfButton;
		public fangzhupayBtn:starlingswf.SwfButton;

		public okbtn:starlingswf.SwfButton;
		public cannelbtn:starlingswf.SwfButton;
		
		public des:egret.TextField;
		public ruletype:number;
		public constructor() {
			super();
			this.mainAsset = DouDiZhuAsset.mainSwf().createSprite("spr_create_room");
			this.addChild(this.mainAsset);
			InterfaceVariablesUtil.initVariables(this,this.mainAsset);
			console.log(this);
			(this.ju6Btn.skin as egret.DisplayObjectContainer).getChildAt(4).visible = false;
			(this.fangzhupayBtn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
			(this.rule1Btn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
			this.updateTextFieldtext(3);
			

			this.cardType = 4;
			this.ruletype = 2;
			this.aa = true;
			this.des.lineSpacing = 8;

		}
		public updateTextFieldtext(playerCount:number,type:number = 1):void{
			var skin:egret.DisplayObjectContainer = (this.ju8Btn.skin as egret.DisplayObjectContainer);
			var textField:egret.TextField = (skin.getChildAt(2) as egret.TextField);
			var textArr:string[] = textField.text.split("X");
			var num:number = type == 1?parseInt(textArr[1])/3:parseInt(textArr[1])*3;
			textField.text = textArr[0]+"X"+(num);

			skin= (this.ju6Btn.skin as egret.DisplayObjectContainer);
			textField = (skin.getChildAt(2) as egret.TextField);
			textArr = textField.text.split("X");
			num= type == 1?parseInt(textArr[1])/3:parseInt(textArr[1])*3;
			textField.text = textArr[0]+"X"+(num);
		}
		public on_cancelBtn(e:egret.Event){
			this.parent.removeChild(this);
		}
		public on_okBtn(e:egret.Event){
			this.create();
		}
		public on_rule1Btn(e:egret.Event){
			
			(this.rule1Btn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = true;
			(this.rule2Btn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
			this.ruletype = 1;
		}
		public on_rule2Btn(e:egret.Event){
			
			(this.rule1Btn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
			(this.rule2Btn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = true;
			this.ruletype = 2;
		}
		public on_aaBtn(e:egret.Event){
			if(this.aa)return;
			(this.aaBtn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = true;
			(this.fangzhupayBtn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
			this.updateTextFieldtext(3);
			this.aa = true;
		}
		public on_fangzhupayBtn(e:egret.Event){
			if(!this.aa)return;
			(this.aaBtn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
			(this.fangzhupayBtn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = true;
			this.updateTextFieldtext(3,0);
			this.aa = false;
		}
		public on_ju6Btn(e:egret.Event){
			(this.ju8Btn.skin as egret.DisplayObjectContainer).getChildAt(4).visible = false;
			(this.ju6Btn.skin as egret.DisplayObjectContainer).getChildAt(4).visible = true;
			this.cardType = 8;
		}
		public on_ju8Btn(e:egret.Event){
			(this.ju8Btn.skin as egret.DisplayObjectContainer).getChildAt(4).visible = true;
			(this.ju6Btn.skin as egret.DisplayObjectContainer).getChildAt(4).visible = false;
			this.cardType = 4;
		}

		public createData(){
			var data:any = {};
			data.ruleType = this.ruletype;
			return data;
		}

		public dispose(){
			super.dispose();
			InterfaceVariablesUtil.disposeVariables(this);
		}

	}
}