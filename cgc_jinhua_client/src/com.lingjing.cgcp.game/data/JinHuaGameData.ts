module lj.cgcp.game.jinhua {
	export class JinHuaGameData {

		public static getCurrentGame():JinHuaGame{
			return ExtGameHelper.getRAMData("currentGame");
		}
		
		public static putCurrentGame(game:JinHuaGame):void{
			ExtGameHelper.saveRAMData("currentGame",game);
		}

		public static getCards():any{
			return ExtGameHelper.getRAMData("currentGameCards");
		}

		public static putCards(cards:any):void{
			ExtGameHelper.saveRAMData("currentGameCards",cards);
		}

		/**
		 * 根据投注类型获取 需要多少钱
		 */
		public static getMoneyByMoneyType(moneyType:number):number{
			var moneys:any = {
				1:1,
				2:2,
				3:3,
				4:4,
				5:5
			};
			return moneys[moneyType];
		}

	}
}