module lj.cgcp.game.jinhua {
	export class SelfCards {

		public cards:egret.Bitmap[];
		public yiqipai:egret.DisplayObject;
		public mainAssets:starlingswf.SwfSprite;
		public gamePanel:GamePanel;

		public constructor(gamePanel:GamePanel,mainAssets:starlingswf.SwfSprite) {
			this.mainAssets = mainAssets;
			this.gamePanel = gamePanel;
			InterfaceVariablesUtil.initVariables(this,this.mainAssets);

			this.yiqipai.visible = false;

			var game:JinHuaGame = JinHuaGameData.getCurrentGame();
			var uid:string = RoleData.getRole().uid;
			if(game.see != null && game.see[uid]){
				this.showCards();
			}
		}

		public showCards(){
			var cardMsg:any = JinHuaGameData.getCards();
			if(this.cards != null){
				for(var k in this.cards){
					if(this.cards[k].parent != null) this.cards[k].parent.removeChild(this.cards[k]);
				}
			}
			this.cards = [];
			var names:string[] = ["_1","_2","_3"]
			for(var k in cardMsg){
				var arr:any = cardMsg[k];
				var bit:egret.Bitmap = JinHuaAsset.paiSwf().createImage("img_pk_" + arr[0] + "_" + arr[1]);
				bit.x = this.mainAssets.getChildByName(names[parseInt(k)]).x;
				bit.y = this.mainAssets.getChildByName(names[parseInt(k)]).y;
				this.cards.push(bit);
			}

			var len:number = this.cards.length;
			for (var i = 0; i < len; i++){
				egret.setTimeout(this.delayAdd(this.cards[i]), this, 200*i);              
			}
		}
  
		public delayAdd(card:egret.DisplayObject):any{
			var thisObj:SelfCards = this;
			return function():void{
				thisObj.mainAssets.addChild(card);
			}
		}

		public showQiPai(){
			this.yiqipai.visible = true;
			this.mainAssets.addChild(this.yiqipai);
		}

		public hideCards(){
			this.yiqipai.visible = false;
			Log.log(this.cards);
			if(this.cards != null){
				for(var k in this.cards){
					if(this.cards[k].parent != null) this.cards[k].parent.removeChild(this.cards[k]);
				}
				this.cards = [];
			}
		}



		public dispose():void{
			InterfaceVariablesUtil.disposeVariables(this);
		}
	}
}