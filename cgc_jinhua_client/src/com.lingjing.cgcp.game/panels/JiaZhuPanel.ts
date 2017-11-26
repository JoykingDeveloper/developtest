module lj.cgcp.game.jinhua {
	export class JiaZhuPanel {

		public background:egret.Shape;

		public gamePanel:GamePanel;
		public mainAssets:starlingswf.SwfSprite;
		public names:string[] = ["_1","_2","_3","_4","_5"];
		public btns:starlingswf.SwfButton[];
		public jiazhuBtn:starlingswf.SwfButton;

		public constructor(gamePanel:GamePanel,mainAssets:starlingswf.SwfSprite) {
			this.gamePanel = gamePanel;
			this.mainAssets = mainAssets;
			this.background = new egret.Shape();
			this.background.graphics.beginFill(0x000000);
        	this.background.graphics.drawRect(3,-18, JinHuaAsset.gameWidth, JinHuaAsset.gameHeight);
        	this.background.graphics.endFill();
			this.background.alpha = 0.5;
			this.background.touchEnabled = true;
			this.mainAssets.addChildAt(this.background,0);

			this.btns = [];
			for(var k in this.names){
				this.btns.push(this.mainAssets.getButton(this.names[k]));
				this.mainAssets.getButton(this.names[k]).addEventListener(starlingswf.SwfButton.onClick,this.onZhu,this);
			}
		}

		public onZhu(e:egret.Event){
			this.mainAssets.visible = false;
			var moneyType:number = this.btns.indexOf(e.currentTarget) + 1;
			JinHuaGameApi.useMoney(moneyType);
		}

		public show(){
			var sex = RoleData.getRole().sex;
			if(sex == 1){
				SoundManager.playGameSound( "1/m_add.mp3");
			}else{
				SoundManager.playGameSound( "0/f_add.mp3");
			}
			var moneyType:number = JinHuaGameData.getCurrentGame().lastMoneyType;
			var len:number = this.btns.length;
			for(var i:number = 0; i<len ;i++){
				if((i + 1) < moneyType){
					this.btns[i].setEnable(false);
				}else{
					this.btns[i].setEnable(true);
				}
			}
			this.mainAssets.visible = true;
		}

		public dispose():void{
			for(var k in this.names){
				this.mainAssets.getButton(this.names[k]).removeEventListener(starlingswf.SwfButton.onClick,this.onZhu,this);
			}
		}
		
	}
}