module lj.cgcp.game.doudizhu {
	/**
	 * 显示自己的牌，此处做事件监听
	*/
	export class PokerPanel  {
		public static POKERWISHCOMPLETE:string = "pokerwishcomplete";

		public gamePanel:GamePanel;
		public timer:egret.Timer;
		//poker牌显示对象
		public pokerObjs = [];
		//poker牌数据信息
		public pokerdata = [];

		public static DISTANCE:number = 58;
		
		public constructor(gamepanel:GamePanel) {
			this.gamePanel = gamepanel;
		}

		public InitPoker():void{
			this.showMyPokers();
			this.InitListener();
		}
		public InitListener(){
			//创建事件监听
			this.gamePanel.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onTouchBegin,this);
			this.gamePanel.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.onTouchMove,this);
			this.gamePanel.stage.addEventListener(egret.TouchEvent.TOUCH_END,this.onTouchEnd,this);
			this.gamePanel.stage.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouchTap,this);
		}
		private chooseing:boolean = false;
		private touchBeginPoint:any = null;
		private touchMovePoint:any = null;
		public onTouchBegin(e:egret.TouchEvent):void{
			var gamePoint:egret.Point = this.gamePanel.mainAsset.getChildByName("pokerpanel").globalToLocal(e.stageX,e.stageY);
			//碰撞检测
			for(var i=0;i<this.pokerObjs.length;i++){
				var p:PokerPai = this.pokerObjs[i];
				if(PokerUtil.checkHit(gamePoint,{x:p.x,y:p.y},i==this.pokerObjs.length-1 || i==9?p.width:PokerPanel.DISTANCE,p.height)){
					this.touchBeginPoint = gamePoint;
				}
			}
		}
		public onTouchMove(e:egret.TouchEvent):void{
			if(this.touchBeginPoint == null){
				return;
			}
			var gamePoint:egret.Point = this.gamePanel.mainAsset.getChildByName("pokerpanel").globalToLocal(e.stageX,e.stageY);
			this.touchMovePoint = gamePoint;
			if(Math.abs(this.touchMovePoint.x-this.touchBeginPoint.x)<15 && Math.abs(this.touchMovePoint.y - this.touchBeginPoint.y) < 15){
				this.touchMovePoint = {};
				return;
			}
			this.chooseing = true;
			var startindex:number = -1;
			var endindex:number = -1;
			//碰撞检测
			for(var i=0;i<this.pokerObjs.length;i++){
				var p:PokerPai = this.pokerObjs[i];
				if(PokerUtil.checkHit(this.touchBeginPoint,{x:p.x,y:p.y},i==this.pokerObjs.length-1||i==9?p.width:PokerPanel.DISTANCE,p.height)){
					startindex = p.index;
				}
				if(PokerUtil.checkHit(this.touchMovePoint,{x:p.x,y:p.y},i==this.pokerObjs.length-1||i==9?p.width:PokerPanel.DISTANCE,p.height)){
					endindex = p.index;
				}
			}
			if(endindex == -1){
				return;
			}
			if(startindex<endindex){
				var temp = startindex;
				startindex = endindex;
				endindex = temp;
			}
			for(var i=0;i<this.pokerObjs.length;i++){
				var p:PokerPai = this.pokerObjs[i];
				if(p.index<=startindex && p.index>=endindex){
					p.setMask(true);
				}else{
					p.setMask(false);
				}
			}
		}
		public onTouchEnd(e:egret.TouchEvent):void{
			if(!this.chooseing){
				return;
			}
			var cards = [];
			//处理所有标记,取出所有选中
			for(var i=0;i<this.pokerObjs.length;i++){
				var p:PokerPai = this.pokerObjs[i];
				if(p._ismask){
					p.setMask(false);
					p.setChoose();
				}
				if(p.ischoose){
					cards.push(p.carddata);
				}
			}
			//缓存选中Poker
			DouDiZhuGameData.putChoosePokers(cards);
			this.touchBeginPoint = null;
			this.touchMovePoint = null;
		}
		public onTouchTap(e:egret.TouchEvent):void{
			if(this.chooseing){//在此结束滑动监听，不然会导致滑动选牌最后一张无法选中
				this.chooseing = false;
				return;
			}
			if(this.touchBeginPoint == null){
				return;
			}
			var gamePoint:egret.Point = this.gamePanel.mainAsset.getChildByName("pokerpanel").globalToLocal(e.stageX,e.stageY);
			if(Math.abs(this.touchBeginPoint.x-gamePoint.x)>PokerPanel.DISTANCE){
				return;
			}
			var cards = [];
			//碰撞检测
			for(var i=0;i<this.pokerObjs.length;i++){
				var p:PokerPai = this.pokerObjs[i];
				if(PokerUtil.checkHit(gamePoint,{x:p.x,y:p.y},i==this.pokerObjs.length-1 || i==9?p.width:PokerPanel.DISTANCE,p.height)){
					cards.push(p);
				}
			}
			if(cards != null && cards.length > 0){
				var p:PokerPai = (<PokerPai>cards[cards.length - 1]);
				p.setChoose();
			}
			cards = [];
			for(var k in this.pokerObjs){
				var p:PokerPai = this.pokerObjs[k];
				if(p.ischoose){
					cards.push(p.carddata);
				}
			}
			//缓存选中Poker
			DouDiZhuGameData.putChoosePokers(cards);
				
			this.chooseing = false;
			this.touchBeginPoint = null;
			this.touchMovePoint = null;
		}

		public chooseAdvicePokers(cards:any):void{
			for(var i=0;i<this.pokerObjs.length;i++){
				var p:PokerPai = this.pokerObjs[i];
				p.ischoose = true;
				for(var k in cards){
					if(cards[k][0] == p.carddata[0] && cards[k][1] == p.carddata[1]){
						p.ischoose = false;
					}
				}
				p.setChoose();
			}
		}
		public addPoker(pokers:any):void{

		}
		public removePoker(poker:any):void{

		}
		/**
		 * 根据自己剩余的牌重新布局
		*/
		public refreshPoker(showTween:boolean = false):void{
			var game:DouDiZhuGame = DouDiZhuGameData.getCurrentGame();
			if(game.cardsInfo!=null){
				this.pokerdata = game.cardsInfo[RoleData.getRole().uid];
			}else{
				this.pokerdata = [];
			}
			this.gamePanel.mainAsset.getSprite("pokerpanel").removeChildren();
			this.pokerObjs = [];
			var len:number = PokerUtil.getCardsCount(this.pokerdata);
			this.pokerdata = PokerUtil.sortCards(this.pokerdata);
			var dizhu = game.cardsInfo.dizhuCards;
			for(var i=0;i<len;i++){
				var temp = new PokerPai(this.pokerdata[i],i);
				if(i == len - 1 && RoleData.getRole().uid == game.dizhuUid){
					temp.showDizhuLogo();
				}
				this.pokerObjs.push(temp);
				var total = len-1;
				temp.x = (i>9?i-9:i)*PokerPanel.DISTANCE + (DouDiZhuAsset.gameWidth - PokerPanel.DISTANCE*(i>9?total-8:(total>9?9:total)) - temp.width)/2;
				temp.y = i>9?595:510;
				if(showTween && PokerUtil.pokerIndexOf(dizhu,this.pokerdata[i]) != -1){
					temp.showTweenDizhuCard();
				}
				this.gamePanel.mainAsset.getSprite("pokerpanel").addChild(temp);
			}
		
		}

		public showMyPokers():void{
			if(DouDiZhuGameData.getCurrentGame().cardsInfo!=null){
				this.pokerdata = DouDiZhuGameData.getCurrentGame().cardsInfo[RoleData.getRole().uid];
			}else{
				this.pokerdata = [];
			}

			this.gamePanel.mainAsset.getSprite("pokerpanel").removeChildren();
		
			if(this.timer == null){
				this.timer = new egret.Timer(1100 / 17,17);
			}
			this.timer.addEventListener(egret.TimerEvent.TIMER,this.createPoker,this);
			this.timer.reset();
			this.timer.start();
			this.pokerObjs = [];
		}
		public createPoker(e:egret.TimerEvent):void{
			var card:any;
			if(this.pokerObjs.length < PokerUtil.getCardsCount(this.pokerdata)){
				card = this.pokerdata[this.pokerObjs.length];
			}
			
			var temp = new PokerPai(card,this.pokerObjs.length);
			this.pokerObjs.push(temp);
			var total = (PokerUtil.getCardsCount(this.pokerdata)-1);
			var i = this.pokerObjs.length - 1;
			temp.x = i*30 + 60;
			temp.y = 595;
			this.gamePanel.mainAsset.getSprite("pokerpanel").addChild(temp);
			if(this.pokerObjs.length == PokerUtil.getCardsCount(this.pokerdata)){
				this.createComplete();
			}
			if( i < 17){
				for(var k in this.gamePanel.roleHeads){
					var rolehead:RoleHead = (<RoleHead>this.gamePanel.roleHeads[k]);
					if(rolehead.uid != this.gamePanel.selfUid){
						rolehead.selfCardsText.text = (i+1).toString();
					}
				}
			}
			
		}
		public createComplete():void{
			this.timer.removeEventListener(egret.TimerEvent.TIMER,this.createPoker,this);
			this.showTween();
			this.timer.stop();
			this.gamePanel.dispatchEventWith(PokerPanel.POKERWISHCOMPLETE,true);

		}
		/** 理牌缓动动画 */
		public showTween(){
			//集中
			for(var i = 0;i<this.pokerObjs.length;i++){
				egret.Tween.get(this.pokerObjs[i]).to({x:(DouDiZhuAsset.gameWidth - 90)/2,y:595},300);
			}
			egret.setTimeout(function():void{
				//排序，合牌，展开
				this.pokerdata = PokerUtil.sortCards(this.pokerdata);
				for(var i = 0;i<this.pokerObjs.length;i++){
					var pokerObj:PokerPai = <PokerPai>this.pokerObjs[i];
					if(!pokerObj || !this.pokerdata[i]){
						continue;
					}
					pokerObj.refreshCardData(this.pokerdata[i]);
					var x:number = (i>9?i-9:i)*PokerPanel.DISTANCE + (DouDiZhuAsset.gameWidth - PokerPanel.DISTANCE*(i>9?8:9) - 120)/2;
					var y:number = i>9?595:510;
					egret.Tween.get(pokerObj).to({x:x,y:y},500);
				}
			},this,400);
		}

		public dispose():void{
			
			//删除显示对象
			this.pokerdata = [];
			if(this.pokerObjs.length > 0){
				for(var i=0;i<this.pokerObjs.length;i++){
					var p:PokerPai = this.pokerObjs[i];
					this.gamePanel.mainAsset.getSprite("pokerpanel").removeChild(p);
				}
			}
			this.pokerObjs = [];
			if(this.timer != null && this.timer.running){
				this.timer.removeEventListener(egret.TimerEvent.TIMER,this.createPoker,this);
			}
		}
	}
}