module lj.cgcp.game.qdmj_705 {
	export class NiuTips extends egret.Sprite{
		/**
		 * 可以被杠的牌的列表
		 */
		public niuList:number[];
		public tipsBtn:starlingswf.SwfSprite[];
		public mjListPanel:MjListPanel;

		public constructor(mjListPanel:MjListPanel,niuList:number[]) {
			super();
			this.niuList = niuList;
			this.mjListPanel = mjListPanel;

			this.graphics.beginFill(0x000000,0);
			this.graphics.drawRect(0,0,App.designWidth,App.designHeight);
			this.graphics.endFill();
			this.touchEnabled = true;
			this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.dispose,this);
			this.createtips();
		}

		public createtips():void{
			this.tipsBtn = [];
			var h:number = 114;
			var len:number = this.niuList.length;
			var btn:starlingswf.SwfSprite;
			var mjVal:number;
			var content:egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			for(var i:number = 0; i < len ; i++ ){
				mjVal = this.niuList[i];
				btn = MjGameAsset.mjSwf.createSprite("spr_niu_tips");
				btn.name = i.toString();
				btn.touchEnabled = true;
				((btn.getChildAt(0) as egret.DisplayObjectContainer).getChildAt(1) as egret.Bitmap).texture = RES.getRes("img_MJ_PX_" + mjVal);
				var logo:egret.Bitmap = btn.getImage("_logo");
				logo.visible = game.hunMj ==mjVal;
				btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBtn,this);
				btn.y = i * (h + 6);
				content.addChild(btn);
				this.tipsBtn.push(btn);
			}

			content.x = (App.designWidth - content.width)/2;
			content.y = (App.designHeight - content.height)/2;
			this.addChild(content);
		}

		public onBtn(e:egret.Event):void{
			var index:number = parseInt(e.currentTarget.name);
			var mjVal:number = this.niuList[index];
			MjGameApi.niuSelf([mjVal]);
			
			this.mjListPanel.disposeOperatingBtn();
			this.dispose(null);
		}

		public dispose(e:egret.Event):void{
			this.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.dispose,this);
			var len:number = this.tipsBtn.length;
			for(var i:number = 0; i < len ; i++ ){
				this.tipsBtn[i].removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onBtn,this);
			}
			if(this.parent != null){
				this.parent.removeChild(this);
			}
		}
	}
}