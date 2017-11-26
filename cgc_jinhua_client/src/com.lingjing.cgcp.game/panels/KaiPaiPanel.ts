module lj.cgcp.game.jinhua {
	export class KaiPaiPanel {

		public selfUid:string;

		public background:egret.Shape;
		public mainAsset:starlingswf.SwfSprite;
		public cancelBtn:starlingswf.SwfButton;

		public gamePanel:GamePanel;

		public constructor(gamePanel:GamePanel) {
			this.gamePanel = gamePanel;
			this.selfUid = RoleData.getRole().uid;

			this.background = new egret.Shape();
			this.background.graphics.beginFill(0x000000);
        	this.background.graphics.drawRect(0,0, JinHuaAsset.gameWidth, JinHuaAsset.gameHeight);
        	this.background.graphics.endFill();
			this.background.alpha = 0.5;

			this.mainAsset = JinHuaAsset.mainSwf().createSprite("spr_kaipai");
			this.mainAsset.addChildAt(this.background,0);

			this.cancelBtn = this.mainAsset.getButton("cancelBtn");
			this.cancelBtn.addEventListener(starlingswf.SwfButton.onClick,this.onCancelBtn,this);
		}

		public show(){
			this.gamePanel.addChild(this.mainAsset);
			var sex = RoleData.getRole().sex;
			if(sex == 1){
				SoundManager.playGameSound( "1/m_cmp.mp3");
			}else{
				SoundManager.playGameSound( "0/f_cmp2.mp3");
			}
			var game:JinHuaGame = JinHuaGameData.getCurrentGame();
			var heads:any = this.gamePanel.roleHeads;
			var head:RoleHead;
			for(var k in heads){
				head = <RoleHead>heads[k];
				if(head.uid == this.selfUid) continue;
				if(game.giveup == null || !game.giveup[head.uid]){
					head.mainAsset.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onHeadClick,this);
					head.mainAsset.touchEnabled = true;
					head.shouzhiMc.visible = true;
					this.mainAsset.addChild(head.mainAsset);
				}
			}
		}

		public onCancelBtn(e:egret.Event){
			this.mainAsset.parent.removeChild(this.mainAsset);
			var heads:any = this.gamePanel.roleHeads;
			var head:RoleHead;
			for(var k in heads){
				head = <RoleHead>heads[k];
				if(head.uid == this.selfUid) continue;
				head.mainAsset.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onHeadClick,this);
				head.mainAsset.touchEnabled = false;
				head.shouzhiMc.visible = false;
				this.gamePanel.mainAsset.addChild(head.mainAsset);
			}
		}

		public onHeadClick(e:egret.TouchEvent){
			this.onCancelBtn(null);

			var displayObj:egret.DisplayObject = e.currentTarget;

			var obj:any = {"head2":2,"head3":3,"head4":4,"head5":5,"head6":6};
			var head:RoleHead = this.gamePanel.roleHeads[obj[displayObj.name]];

			JinHuaGameApi.kaipai(head.uid);
		}

		public dispose():void{
			var heads:any = this.gamePanel.roleHeads;
			var head:RoleHead;
			for(var k in heads){
				head = <RoleHead>heads[k];
				head.mainAsset.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onHeadClick,this);
			}
		}
	}
}