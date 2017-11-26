module lj.cgcp.game.scmj_204 {
	export class SoundConstant {
		private static _mancount:any = {"1":3,"2":2,"3":3,"4":2,"5":2,"6":1,"7":1,"8":2,"9":2,
									  "10":3,"11":3,"12":1,"13":2,"14":1,"15":2,"16":1,"17":3,"18":1,
									  "19":3,"20":2,"21":2,"22":3,"23":1,"24":1,"25":1,"26":1,"27":2,
									  "gang":3,"hu":2,"peng":3};
		private static _womancount:any = {"1":4,"2":2,"3":3,"4":3,"5":3,"6":1,"7":1,"8":2,"9":3,
									  "10":4,"11":4,"12":1,"13":2,"14":1,"15":2,"16":1,"17":4,"18":2,
									  "19":3,"20":2,"21":2,"22":3,"23":1,"24":1,"25":1,"26":1,"27":2,
									  "gang":3,"hu":2,"peng":4};
		
		public static playSound(sex:number,soundName:string):void{
			if(sex == 1){
				soundName += ("_"+Math.ceil(Math.random()*this._mancount[soundName])) ;
			}else if(sex == 0){
				soundName += ("_"+Math.ceil(Math.random()*this._womancount[soundName])) ;
			}else{
				return;
			}
			SoundManager.playGameSound(`${sex}/${soundName}.mp3`);
		}
		public static playGangSound(sex:number,gangType:number){
			SoundManager.playGameSound(`${sex}/gang_${gangType}.mp3`);
			SoundManager.playGameSound(`windy_rainy.mp3`);
		}
	}
}