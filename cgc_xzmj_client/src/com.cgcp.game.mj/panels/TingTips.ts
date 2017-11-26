module lj.cgcp.game.scmj_204 {
	export class TingTips extends egret.Sprite {
		/**
		 * 听牌列表
		 */
		public tingList:any[];
		public tipsBtn:starlingswf.SwfSprite[];
		public mjListPanel:MjListPanel;

		public constructor(mjListPanel:MjListPanel,tingList:any[]) {
			super();
			this.tingList = tingList;
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
			var w:number = 78;
			var len:number = this.tingList.length;
			var btn:starlingswf.SwfSprite;
			var tingObj:any[];
			var tingVal:number[];
			var tingTarget:number;
			var remove:number;
			var content:egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
			for(var i:number = 0; i < len ; i++ ){
				tingObj = this.tingList[i];
				remove = tingObj[2];

				btn = MjGameAsset.mjSwf.createSprite("spr_ting_tips");
				btn.name = i.toString();
				btn.touchEnabled = true;

				((btn.getChildByName("remove") as egret.DisplayObjectContainer).getChildAt(1) as egret.Bitmap).texture = RES.getRes("img_MJ_PX_" + remove);

				btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBtn,this);
				btn.x = i * (w + 6);
				content.addChild(btn);
				this.tipsBtn.push(btn);
			}

			content.x = (App.designWidth - content.width)/2;
			content.y = (App.designHeight - content.height)/2;
			this.addChild(content);
		}

		public onBtn(e:egret.Event):void{
			var index:number = parseInt(e.currentTarget.name);
			var tingObj:any[] = this.tingList[index];
			tingObj[0] = MajiangConstant.findTingShowVals(MajiangGameData.getMjs(),tingObj);
			MjGameApi.chupai(tingObj[2],tingObj);
			
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