module lj.cgcp.game.qdmj_705 {
	export class ChiTips extends egret.Sprite {
		
		/**
		 * 吃牌列表
		 */
		public chiList:number[][];
		public tipsBtn:starlingswf.SwfSprite[];
		public mjListPanel:MjListPanel;

		public constructor(mjListPanel:MjListPanel,chiList:number[][]) {
			super();
			this.chiList = chiList;
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
			var len:number = this.chiList.length;
			var btn:starlingswf.SwfSprite;
			var list:number[];
			var lastMj:number = MajiangGameData.getCurrentGame().lastMj;
			var mjList:number[] = MajiangGameData.getMjs();
			var content:egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
			for(var i:number = 0; i < len ; i++ ){
				list = [mjList[this.chiList[i][0]],mjList[this.chiList[i][1]]];
				list.push(lastMj);
				MajiangConstant.sortMjList(list,0);
				btn = MjGameAsset.mjSwf.createSprite("spr_chi_tips");
				btn.name = i.toString();
				btn.touchEnabled = true;
				for(var j:number = 0; j < 3 ;j++){
					((btn.getChildAt(j) as egret.DisplayObjectContainer).getChildAt(1) as egret.Bitmap).texture = RES.getRes("img_MJ_PX_" + list[j]);
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
			var list:number[] = this.chiList[index];
			var mjList:number[] = MajiangGameData.getMjs();
			MjGameApi.operating(1,[mjList[list[0]],mjList[list[1]]]);
			
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