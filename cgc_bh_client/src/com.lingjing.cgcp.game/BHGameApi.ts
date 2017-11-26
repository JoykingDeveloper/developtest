module lj.cgcp.game.baohuang {
	export class BHGameApi {

		/**
		 * 准备
		 */
		public static ready():void{
			var par:any = {};
			par.tag = 'ready';
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
		 * 登基
		 */
		public static dengji(param:any):void{
			var par:any = {};
			par['tag'] = 'dengji';
			par.isdengji = param;
			ExtGameHelper.sendGameMessage(par);
		}
		/**
		 * 明保
		 */
		public static mingbao(param:any):void{
			var par:any = {};
			par['tag'] = 'mingbao';
			par.ismingbao = param;
			ExtGameHelper.sendGameMessage(par);
		}
		/**
		 * 抢独
		 * 
		 */
		public static qiangdu(param:any):void{
			var par:any = {};
			par['tag'] = 'qiangdu';
			par.isqiangdu = param;
			ExtGameHelper.sendGameMessage(par);
		}
		/**
		 * 抢独
		 * 
		 */
		public static zaofan(param:any):void{
			var par:any = {};
			par['tag'] = 'zaofan';
			par.iszaofan = param;
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