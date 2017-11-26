module lj.cgcp.game.doudizhu {
	export class DouDiZhuGameApi {

		/**
		 * 准备
		 */
		public static ready():void{
			var par:any = {};
			par.tag = 'ready';
			ExtGameHelper.sendGameMessage(par);
		}

		/**
		 * 叫分
		 */
		public static score(score:number):void{
			var par:any = {};
			par['tag'] = 'score';
			par.score = score;
			ExtGameHelper.sendGameMessage(par);
		}
		/**
		 * 加倍
		 */
		public static jiabei(jiabei:number):void{
			var par:any = {};
			par['tag'] = 'jiabei';
			par.jiabei = jiabei;
			ExtGameHelper.sendGameMessage(par);
		}

		/**
		 * 出牌
		 */
		public static chupai(outCards:any):void{
			var par:any = {};
			par['tag'] = 'chupai';
			par.outCards = outCards;
			ExtGameHelper.sendGameMessage(par);
		}

		/**
		 * 不出
		 */
		public static buchu():void{
			var par:any = {};
			par['tag'] = 'buchu';
			ExtGameHelper.sendGameMessage(par);
		}
	
	}
}