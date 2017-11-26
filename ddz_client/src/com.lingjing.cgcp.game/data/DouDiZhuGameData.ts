module lj.cgcp.game.doudizhu {
	export class DouDiZhuGameData {

		public static getCurrentGame():DouDiZhuGame{
			return ExtGameHelper.getRAMData("currentGame");
		}
		
		public static putCurrentGame(game:DouDiZhuGame):void{
			ExtGameHelper.saveRAMData("currentGame",game);
		}

		public static getCards():any{
			return ExtGameHelper.getRAMData("currentGameCards");
		}

		public static putCards(cards:any):void{
			ExtGameHelper.saveRAMData("currentGameCards",cards);
		}
		public static getMyPokers():any{
			var game:DouDiZhuGame = this.getCurrentGame();
			if(game == null || game.cardsInfo == null)return null;
			var pokers = this.getCurrentGame().cardsInfo[RoleData.getRole().uid];
			return pokers;
		}
		/**
		 * 出牌信息
		*/
		public static getOutPokers():any{
			var game:DouDiZhuGame = this.getCurrentGame();
			if(game == null)return null;
			var outCards = this.getCurrentGame().outCards;
			return outCards;
		}
		public static putOutPokers(outCards:any):void{
			var game:DouDiZhuGame = this.getCurrentGame();
			if(game == null)return ;
			game.outCards = outCards;
			this.putCurrentGame(game);
		}
		// /**
		//  * 选牌信息
		// */
		public static getChoosePokers():any{
			return ExtGameHelper.getRAMData("currentChooseCards");
		}
		public static putChoosePokers(cards:any):void{
			ExtGameHelper.saveRAMData("currentChooseCards",cards);
		}
		public static getAdivcePokers():any{
			return ExtGameHelper.getRAMData("currentAdviceCards");
		}
		public static putAdivcePokers(cards:any):void{
			ExtGameHelper.saveRAMData("currentAdviceCards",cards);
		}
		public static isWarning():any{
			return ExtGameHelper.getRAMData("isWarning");
		}
		public static isWarnned(value:any):void{
			ExtGameHelper.saveRAMData("isWarning",value);
		}
	}
}