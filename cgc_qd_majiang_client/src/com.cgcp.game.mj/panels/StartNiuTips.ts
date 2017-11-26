module lj.cgcp.game.qdmj_705 {
	export class StartNiuTips extends egret.Sprite {
		/**
		 * 可以被杠的牌的列表
		 */
		public niuList:number[];
		public tipsBtn:starlingswf.SwfSprite[];
		public mjListPanel:MjListPanel;
		public okBtn:starlingswf.SwfButton;
		public WarningText:egret.TextField;
		public constructor(mjListPanel:MjListPanel,niuList:number[]) {
			super();
			this.niuList = niuList;
			this.mjListPanel = mjListPanel;

			this.graphics.beginFill(0x000000,0);
			this.graphics.drawRect(0,0,App.designWidth,App.designHeight);
			this.graphics.endFill();
			this.touchEnabled = true;
			// this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.dispose,this);
			// ApiState.showText("选择麻将组合进行扭牌");
			// ApiState.showText("选择麻将组合进行扭牌");
			// egret.setTimeout(function():void{
				this.createtips();
			// },this,1800);
			
			
		}

		public createtips():void{
			this.tipsBtn = [];
			var w:number = 70;
			var len:number = this.niuList.length;
			var btn:starlingswf.SwfSprite;
			var mjVal:number;
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			var content:egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
				
			for(var i:number = 0; i < len ; i++ ){
				mjVal = this.niuList[i];
				btn = MjGameAsset.mjSwf.createSprite("spr_niu_tips");
				btn.name = i.toString();
				btn.touchEnabled = true;
				((btn.getChildAt(0) as egret.DisplayObjectContainer).getChildAt(1) as egret.Bitmap).texture = RES.getRes("img_MJ_PX_" + mjVal);
				var logo:egret.Bitmap = btn.getImage("_logo");
				logo.visible = game.hunMj ==mjVal;
				
				btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onChoose,this);
				btn.x = i * (w + 6);
				content.addChild(btn);
				this.tipsBtn.push(btn);
			}

			content.x = (App.designWidth - content.width)/2;
			content.y = (App.designHeight - content.height)/2;
			this.addChild(content);
			this.okBtn = MjGameAsset.mainSwf.createButton("btn_ok");
			this.okBtn.x = (App.designWidth - this.okBtn.width)/2;
			this.okBtn.y = (App.designHeight - this.okBtn.height)*0.7;
			this.WarningText = new egret.TextField();
			this.WarningText.width = 400;
			this.WarningText.text = "选择麻将组合进行扭牌";
			this.WarningText.textAlign = egret.HorizontalAlign.CENTER;
			this.WarningText.x =(App.designWidth - this.WarningText.width) / 2;
			this.WarningText.y = content.y - 44;
			this.WarningText.size = 26;
			this.addChild(this.WarningText);
			this.addChild(this.okBtn);
			this.okBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBtn,this);
		}
		private dataindex:number[] = [];
		public onChoose(e:egret.Event):void{
			var index:number = parseInt(e.currentTarget.name);
			if(this.dataindex.indexOf(index) == -1){
				//选中
				this.dataindex.push(index);
				(e.currentTarget as egret.DisplayObjectContainer).alpha = 0.5;
			}else{
				//取消选中
				this.dataindex.splice(this.dataindex.indexOf(index),1);
				(e.currentTarget as egret.DisplayObjectContainer).alpha = 1;
			}
		}
		public onBtn(e:egret.Event):void{//点击确认按钮后的验证
			var data:number[] = [];
			for(var i=0;i<this.dataindex.length;i++){
				data.push(this.niuList[this.dataindex[i]]);
			}
			if(MajiangConstant.checkStartNiu(data)){
				MjGameApi.niuSelf(data);
				this.mjListPanel.disposeOperatingBtn();
			}else{
				ApiState.showText("无效扭牌");
			}
			this.dispose(null);
		}

		public dispose(e:egret.Event):void{
			this.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.dispose,this);
			var len:number = this.tipsBtn.length;
			for(var i:number = 0; i < len ; i++ ){
				this.tipsBtn[i].removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onChoose,this);
			}
			this.okBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onBtn,this);
			if(this.parent != null){
				this.parent.removeChild(this);
			}
		}
	}
}