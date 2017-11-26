module lj.cgcp.game.scmj_204 {
	export class CreatePanel extends ExtGameCreatePanel {

		public mainAsset:starlingswf.SwfSprite;

		public ju6Btn:starlingswf.SwfButton;
		public ju8Btn:starlingswf.SwfButton;
		
		public aaBtn:starlingswf.SwfButton;
		public fangzhuBtn:starlingswf.SwfButton;

        public fan2Btn:starlingswf.SwfButton;
        public fan4Btn:starlingswf.SwfButton;
        public fan6Btn:starlingswf.SwfButton;
        public wxfanBtn:starlingswf.SwfButton;
		
		public zimofanBtn:starlingswf.SwfButton;
		public zimodiBtn:starlingswf.SwfButton;
        public yaojianghuBtn:starlingswf.SwfButton;
        public hujiaozhuanyiBtn:starlingswf.SwfButton;

		public dianganghua1Btn:starlingswf.SwfButton;//当自摸
		public dianganghua2Btn:starlingswf.SwfButton;//当点炮

		public menzhonghuBtn:starlingswf.SwfButton;

		public paoType:number;
        public fanType:number;
		public zimoType:number;
		public gangFlower:number;
		public menqingType:boolean;
        public jiangduiType:boolean;
        public hujiaozhuanyi:boolean;

		public constructor() {
			super();
			this.mainAsset = MjGameAsset.mainSwf.createSprite("spr_create");
			this.addChild(this.mainAsset);
			InterfaceVariablesUtil.initVariables(this,this.mainAsset);

			(this.ju6Btn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
			(this.fangzhuBtn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
            (this.fan4Btn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
            (this.fan6Btn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
            (this.wxfanBtn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
            (this.zimodiBtn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
            (this.dianganghua2Btn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
            (this.menzhonghuBtn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
            (this.yaojianghuBtn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
            (this.hujiaozhuanyiBtn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
			
			this.cardType = 8;
			this.aa = true;
			this.paoType = 1;
            this.fanType = 2;
			this.zimoType = 1;
			this.gangFlower = 1;
			this.menqingType = false;
            this.jiangduiType = false;
            this.hujiaozhuanyi = false;
			this.updateTextFieldtext();
		}
        public updateTextFieldtext():void{
            var skin:egret.DisplayObjectContainer = (this.ju8Btn.skin as egret.DisplayObjectContainer);
            var textField:egret.TextField = (skin.getChildAt(4) as egret.TextField);
            textField.text = "房卡X"+(this.aa?1:3);

            skin= (this.ju6Btn.skin as egret.DisplayObjectContainer);
            textField = (skin.getChildAt(4) as egret.TextField);
            textField.text = "房卡X"+(this.aa?2:6);
        }

		public on_cancelBtn(e:egret.Event){
			this.parent.removeChild(this);
			this.dispose();
		}
		public on_okBtn(e:egret.Event){
			this.create();
		}
		public on_ju6Btn(e:egret.Event){
			(this.ju8Btn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
			(this.ju6Btn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = true;
			this.cardType = 16;
		}
		public on_ju8Btn(e:egret.Event){
			(this.ju8Btn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = true;
			(this.ju6Btn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
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
			this.updateTextFieldtext();
		}
        public on_fan2Btn(e:egret.Event){
            (this.fan2Btn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = true;
            (this.fan4Btn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
            (this.fan6Btn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
            (this.wxfanBtn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
            this.fanType = 2;
        }
        public on_fan4Btn(e:egret.Event){
            (this.fan2Btn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
            (this.fan4Btn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = true;
            (this.fan6Btn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
            (this.wxfanBtn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
            this.fanType = 4;
        }
        public on_fan6Btn(e:egret.Event){
            (this.fan2Btn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
            (this.fan4Btn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
            (this.fan6Btn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = true;
            (this.wxfanBtn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
            this.fanType = 6;
        }
        public on_wxfanBtn(e:egret.Event){
            (this.fan2Btn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
            (this.fan4Btn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
            (this.fan6Btn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
            (this.wxfanBtn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = true;
            this.fanType = -1;
        }
		public on_zimofanBtn(e:egret.Event){
            (this.zimofanBtn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = true;
            (this.zimodiBtn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
			this.zimoType = 1;
		}
		public on_zimodiBtn(e:egret.Event){
            (this.zimofanBtn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
            (this.zimodiBtn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = true;
			this.zimoType = 2;
		}
		public on_dianganghua1Btn(e:egret.Event){
            (this.dianganghua1Btn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = true;
            (this.dianganghua2Btn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
			this.gangFlower = 1;
		}
		public on_dianganghua2Btn(e:egret.Event){
            (this.dianganghua2Btn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = true;
            (this.dianganghua1Btn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = false;
			this.gangFlower = 2;
		}
		public on_menzhonghuBtn(e:egret.Event){
            (this.menzhonghuBtn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = !this.menqingType;
			this.menqingType = !this.menqingType;
		}
        public on_yaojianghuBtn(e:egret.Event){
            (this.yaojianghuBtn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = !this.jiangduiType;
            this.jiangduiType = !this.jiangduiType;
        } 
        public on_hujiaozhuanyiBtn(e:egret.Event){
            (this.hujiaozhuanyiBtn.skin as egret.DisplayObjectContainer).getChildAt(1).visible = !this.hujiaozhuanyi;
            this.hujiaozhuanyi = !this.hujiaozhuanyi;
        }

		public createData(): any{
            return {"paoType":this.paoType
                    ,"fanType":this.fanType
                    ,"zimoType":this.zimoType
                    ,"gangFlower":this.gangFlower
                    ,"menqingType":this.menqingType
                    ,"jiangduiType":this.jiangduiType
                    ,"hujiaozhuanyi":this.hujiaozhuanyi
                };
		}

		public dispose(){
			super.dispose();
			InterfaceVariablesUtil.disposeVariables(this);
		}


	}
}