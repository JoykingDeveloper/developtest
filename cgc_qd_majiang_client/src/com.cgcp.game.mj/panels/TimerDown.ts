module lj.cgcp.game.qdmj_705 {
	export class TimerDown {

		public mainAsset:starlingswf.SwfSprite;
		public timeText:egret.BitmapText;
		public arrowMC:starlingswf.SwfMovieClip;

		public timer:egret.Timer;

		public constructor(mainAsset:starlingswf.SwfSprite) {
			this.mainAsset = mainAsset;
			InterfaceVariablesUtil.initVariables(this,this.mainAsset);
			this.timeText = BmTextUtil.replaceTextfield(this.timeText,RES.getRes("mj_daojishi"));
			this.arrowMC.gotoAndPlay("f0");
		}

		public start():void{
			if(this.timer == null){
				this.timer = new egret.Timer(1000,25);
				this.timer.addEventListener(egret.TimerEvent.TIMER,this.onTimer,this);
			}
			this.timer.reset();
			this.timer.start();
		}

		public stop():void{
			if(this.timer != null){
				this.timer.stop();
			}
		}

		public onTimer(e:egret.Event):void{
			this.timeText.text = (25 - this.timer.currentCount).toString();
		}

		public dispose(){
			InterfaceVariablesUtil.disposeVariables(this);
			if(this.timer != null){
				this.timer.stop();
				this.timer.removeEventListener(egret.TimerEvent.TIMER,this.onTimer,this);
			}
		}
	}
}