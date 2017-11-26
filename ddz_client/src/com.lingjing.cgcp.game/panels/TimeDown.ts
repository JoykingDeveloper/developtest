module lj.cgcp.game.doudizhu {
	export class TimeDown {
		public mainasset:starlingswf.SwfSprite;
		public timetx:egret.BitmapText;
		public timer:egret.Timer;
		public constructor(mainAsset:starlingswf.SwfSprite) {
			InterfaceVariablesUtil.initVariables(this,mainAsset);
			this.mainasset = mainAsset;
			this.timetx = BmTextUtil.replaceTextfield(this.timetx,RES.getRes("DZ"));
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
			this.timetx.text = "20";
			SoundManager.stopGameSound("time1.mp3");
			// if(DouDiZhuGameData.getCurrentGame().currentUid == RoleData.getRole().uid){
			// 	SoundManager.playGameSound("time1.mp3",16);
			// }
		}
		public hide(){
			this.mainasset.visible = false;
			if(this.timer != null){
				this.timer.removeEventListener(egret.TimerEvent.TIMER,this.onTimer,this);
				this.timer.stop();
			}
		}
		public onTimer(e:egret.TimerEvent):void{
			var game:DouDiZhuGame = DouDiZhuGameData.getCurrentGame();
			if(game == null || game.currentUid == null){
				return;
			}
			var t:number = parseInt(this.timetx.text);
			t--;
			if(t == 5){
				if(DouDiZhuGameData.getCurrentGame().currentUid == RoleData.getRole().uid){
					SoundManager.playGameSound("time1.mp3",999);
				}
			}
			if(t == -1){
				// this.mainAsset.dispatchEventWith(RoleHead.ONCLICKTIMER,true);
				this.timer.removeEventListener(egret.TimerEvent.TIMER,this.onTimer,this);
				return;
			}
			this.timetx.text = t.toString();
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