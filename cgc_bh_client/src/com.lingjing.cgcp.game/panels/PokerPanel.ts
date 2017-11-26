module lj.cgcp.game.baohuang {
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

		public static DISTANCE:number = 50;
		public static MaxRow:number = 16;
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
			var gamePoint:egret.Point = this.gamePanel.mainAsset.globalToLocal(e.stageX,e.stageY);
			//碰撞检测
			for(var i=0;i<this.pokerObjs.length;i++){
				var p:PokerPai = this.pokerObjs[i];
				if(PokerUtil.checkHit(gamePoint,{x:p.x,y:p.y},i==this.pokerObjs.length-1 || i==PokerPanel.MaxRow?p.width:PokerPanel.DISTANCE,p.height)){
					this.touchBeginPoint = gamePoint;
				}
			}
		}
		public onTouchMove(e:egret.TouchEvent):void{
			if(this.touchBeginPoint == null){
				return;
			}
			var gamePoint:egret.Point = this.gamePanel.mainAsset.globalToLocal(e.stageX,e.stageY);
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
				if(PokerUtil.checkHit(this.touchBeginPoint,{x:p.x,y:p.y},i==this.pokerObjs.length-1||i==PokerPanel.MaxRow?p.width:PokerPanel.DISTANCE,p.height)){
					startindex = p.index;
				}
				if(PokerUtil.checkHit(this.touchMovePoint,{x:p.x,y:p.y},i==this.pokerObjs.length-1||i==PokerPanel.MaxRow?p.width:PokerPanel.DISTANCE,p.height)){
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
			BHGameData.putChoosePokers(cards);
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
			var gamePoint:egret.Point = this.gamePanel.mainAsset.globalToLocal(e.stageX,e.stageY);
			if(Math.abs(this.touchBeginPoint.x-gamePoint.x)>PokerPanel.DISTANCE){
				return;
			}
			var cards = [];
			//碰撞检测
			for(var i=0;i<this.pokerObjs.length;i++){
				var p:PokerPai = this.pokerObjs[i];
				if(PokerUtil.checkHit(gamePoint,{x:p.x,y:p.y},i==this.pokerObjs.length-1 || i==PokerPanel.MaxRow?p.width:PokerPanel.DISTANCE,p.height)){
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
			BHGameData.putChoosePokers(cards);
				
			this.chooseing = false;
			this.touchBeginPoint = null;
			this.touchMovePoint = null;
		}

		public chooseAdvicePokers(cards:any):void{
			for(var i=0;i<this.pokerObjs.length;i++){
				var p:PokerPai = this.pokerObjs[i];
				p.ischoose = true;
			}
			for(var k in cards){
				for(var i=0;i<this.pokerObjs.length;i++){
					var p:PokerPai = this.pokerObjs[i];
					if(cards[k][0] == p.carddata[0] && cards[k][1] == p.carddata[1] && p.ischoose){
						p.ischoose = false;
						break;
					}
				}
			}
			for(var i=0;i<this.pokerObjs.length;i++){
				var p:PokerPai = this.pokerObjs[i];
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
		public refreshPoker():void{
			if(BHGameData.getCurrentGame().cardsInfo!=null){
				this.pokerdata = BHGameData.getCurrentGame().cardsInfo[RoleData.getRole().uid];
			}else{
				this.pokerdata = [];
			}
			if(this.pokerObjs.length > 0){
				for(var i=0;i<this.pokerObjs.length;i++){
					var p:PokerPai = this.pokerObjs[i];
					this.gamePanel.mainAsset.removeChild(p);
				}
			}
			this.pokerObjs = [];
			var len:number = PokerUtil.getCount(this.pokerdata);
			this.pokerdata = PokerUtil.sortCards(this.pokerdata);
			for(var i=0;i<len;i++){
				var temp = new PokerPai(this.pokerdata[i],i);
				this.pokerObjs.push(temp);
				var total = len-1;
				temp.x = (i>PokerPanel.MaxRow?i-PokerPanel.MaxRow:i)*PokerPanel.DISTANCE + (BHAsset.gameWidth - PokerPanel.DISTANCE*(i>PokerPanel.MaxRow?total-PokerPanel.MaxRow+1:(total>PokerPanel.MaxRow?PokerPanel.MaxRow:total)) - temp.width)/2;
				temp.y = i>PokerPanel.MaxRow?500:414;
				this.gamePanel.mainAsset.addChild(temp);
			}
		
		}

		public showMyPokers():void{
			if(BHGameData.getCurrentGame().cardsInfo!=null){
				this.pokerdata = BHGameData.getCurrentGame().cardsInfo[RoleData.getRole().uid];
			}else{
				this.pokerdata = [];
			}
			//清除
			if(this.pokerObjs.length > 0){
				for(var i=0;i<this.pokerObjs.length;i++){
					var p:PokerPai = this.pokerObjs[i];
					this.gamePanel.mainAsset.removeChild(p);
				}
			}
			this.pokerObjs = [];
			this.timer = new egret.Timer(50,this.pokerdata.length);
			this.timer.addEventListener(egret.TimerEvent.TIMER,this.createPoker,this);
			this.timer.start();
			
		}
		public createPoker(e:egret.TimerEvent):void{
			var card:any;
			if(this.pokerObjs.length < PokerUtil.getCount(this.pokerdata)){
				card = this.pokerdata[this.pokerObjs.length];
			}
			
			var temp = new PokerPai(card,this.pokerObjs.length);
			this.pokerObjs.push(temp);
			var total = (PokerUtil.getCount(this.pokerdata)-1);
			var i = this.pokerObjs.length - 1;
			temp.x = (i>PokerPanel.MaxRow?i-PokerPanel.MaxRow:i)*PokerPanel.DISTANCE + (BHAsset.gameWidth - PokerPanel.DISTANCE*(i>PokerPanel.MaxRow?total-PokerPanel.MaxRow+1:(total>PokerPanel.MaxRow?PokerPanel.MaxRow:total)) - temp.width)/2;
			temp.y = i>PokerPanel.MaxRow?500:414;
			this.gamePanel.mainAsset.addChild(temp);
			if(this.pokerObjs.length == PokerUtil.getCount(this.pokerdata)){
				this.createComplete(null);
			}
			
		}
		public createComplete(e:egret.TimerEvent):void{
			this.timer.stop();
			this.timer.removeEventListener(egret.TimerEvent.TIMER,this.createPoker,this);
			this.timer = null;
			//排序，合牌
			this.pokerdata = PokerUtil.sortCards(this.pokerdata);
			for(var i = 0;i<this.pokerObjs.length;i++){
				(<PokerPai>this.pokerObjs[i]).refreshCardData(this.pokerdata[i]);
			}
			this.gamePanel.dispatchEventWith(PokerPanel.POKERWISHCOMPLETE,true);

		}
		// public show():void{
		// 	this.mainAsset.visible = true;
		// }
		// public hide():void{
		// 	this.mainAsset.visible = false;
		// }

		public dispose():void{
			
			//删除显示对象
			this.pokerdata = [];
			if(this.pokerObjs.length > 0){
				for(var i=0;i<this.pokerObjs.length;i++){
					var p:PokerPai = this.pokerObjs[i];
					this.gamePanel.mainAsset.removeChild(p);
				}
			}
			this.pokerObjs = [];
			if(this.timer != null && this.timer.running){
				this.timer.removeEventListener(egret.TimerEvent.TIMER,this.createPoker,this);
			}
		}
	}
}