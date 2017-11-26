module lj.cgcp.game.scmj_204 {

	/**
	 * 杠牌提示
	 */
	export class GangTips extends egret.Sprite {

		/**
		 * 可以被杠的牌的列表
		 */
		public gangList:number[];
		public tipsBtn:starlingswf.SwfSprite[];
		public mjListPanel:MjListPanel;

		public constructor(mjListPanel:MjListPanel,gangList:number[]) {
			super();
			this.gangList = gangList;
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
			var len:number = this.gangList.length;
			var btn:starlingswf.SwfSprite;
			var mjVal:number;
			var content:egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
			for(var i:number = 0; i < len ; i++ ){
				mjVal = this.gangList[i];
				btn = MjGameAsset.mjSwf.createSprite("spr_gang_tips");
				btn.name = i.toString();
				btn.touchEnabled = true;
				for(var j:number = 0; j < 4 ;j++){
					((btn.getChildAt(j) as egret.DisplayObjectContainer).getChildAt(1) as egret.Bitmap).texture = RES.getRes("img_MJ_PX_" + mjVal);
				}
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
			var mjVal:number = this.gangList[index];
			MjGameApi.callGangApi(mjVal);
			
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