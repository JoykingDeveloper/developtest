module lj.cgcp.game.jinhua {
	export class JinHuaGameApi {

		/**
		 * 看牌
		 */
		public static seeCard():void{
			var par:any = {};
			par['tag'] = 'seeCard';
			ExtGameHelper.sendGameMessage(par);
		}

		/**
		 * 下注
		 */
		public static useMoney(moneyType:number):void{
			var par:any = {};
			par.tag = 'useMoney';
			par.moneyType = moneyType;
			ExtGameHelper.sendGameMessage(par);
		}

		/**
		 * 开牌
		 */
		public static kaipai(targetUid:string):void{
			var par:any = {};
			par.tag = 'kaipai';
			par.targetUid = targetUid;
			ExtGameHelper.sendGameMessage(par);
		}

		/**
		 * 弃牌
		 */
		public static qipai():void{
			var par:any = {};
			par.tag = 'qipai';
			ExtGameHelper.sendGameMessage(par);
		}

		/**
		 * 准备
		 */
		public static ready():void{
			var par:any = {};
			par.tag = 'ready';
			ExtGameHelper.sendGameMessage(par);
		}



	}
}