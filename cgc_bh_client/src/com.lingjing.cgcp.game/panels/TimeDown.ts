module lj.cgcp.game.baohuang {
	export class TimeDown {
		public mainasset:starlingswf.SwfSprite;
		public timeText:egret.BitmapText;
		public timer:egret.Timer;
		public constructor(mainAsset:starlingswf.SwfSprite) {
			InterfaceVariablesUtil.initVariables(this,mainAsset);
			this.mainasset = mainAsset;
			this.timeText = BmTextUtil.replaceTextfield(this.timeText,RES.getRes("wenzi"));
		}
		public show(){
			this.mainasset.visible = true;
			//开始倒计时
			if(this.timer == null){
				this.timer = new egret.Timer(1000,20);
			}
			this.timer.addEventListener(egret.TimerEvent.TIMER,this.onTimer,this);
			this.timer.stop();
			this.timer.reset();
			this.timer.start();
			this.timeText.text = "20";
			SoundManager.stopGameSound("time1.mp3");
			// if(BHGameData.getCurrentGame().currentUid == RoleData.getRole().uid){
			// 	SoundManager.playGameSound("time1.mp3",16);
			// }
		}
		public hide(){
			this.mainasset.visible = false;
			if(this.timer != null){
				this.timer.removeEventListener(egret.TimerEvent.TIMER,this.onTimer,this);
				this.timer.stop();
			}
			SoundManager.stopGameSound("time1.mp3");
		}
		public onTimer(e:egret.TimerEvent):void{
			var game:BHGame = BHGameData.getCurrentGame();
			if(game == null || game.currentUid == null){
				return;
			}
			var t:number = parseInt(this.timeText.text);
			t--;
			if(t == 5){
				if(BHGameData.getCurrentGame().currentUid == RoleData.getRole().uid){
					SoundManager.playGameSound("time1.mp3",999);
				}
			}
			if(t == -1){
				// this.mainAsset.dispatchEventWith(RoleHead.ONCLICKTIMER,true);
				this.timer.removeEventListener(egret.TimerEvent.TIMER,this.onTimer,this);
				return;
			}
			this.timeText.text = t.toString();
		}
		public dispose(){
			if(this.timer != null){
				this.timer.stop();
				this.timer.removeEventListener(egret.TimerEvent.TIMER,this.onTimer,this);
			}
			SoundManager.stopGameSound("time1.mp3");
		}
	}
}