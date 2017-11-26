module lj.cgcp.game.baohuang {
	export class BHGameData {

		public static getCurrentGame():BHGame{
			return ExtGameHelper.getRAMData("currentGame");
		}
		
		public static putCurrentGame(game:BHGame):void{
			ExtGameHelper.saveRAMData("currentGame",game);
		}

		public static getCards():any{
			return ExtGameHelper.getRAMData("currentGameCards");
		}

		public static putCards(cards:any):void{
			ExtGameHelper.saveRAMData("currentGameCards",cards);
		}
		public static getMyPokers():any{
			var game:BHGame = this.getCurrentGame();
			if(game == null || game.cardsInfo == null)return null;
			var pokers = this.getCurrentGame().cardsInfo[RoleData.getRole().uid];
			return pokers;
		}
		/**
		 * 出牌信息
		*/
		public static getOutPokers():any{
			var game:BHGame = this.getCurrentGame();
			if(game == null)return null;
			var outCards = this.getCurrentGame().outCards;
			return outCards;
		}
		public static putOutPokers(outCards:any):void{
			var game:BHGame = this.getCurrentGame();
			if(game == null)return ;
			game.outCards = outCards;
			this.putCurrentGame(game);
		}
		/**
		 *是否有人抢皇帝 
		*/
		public static havePlayerZaoFan():boolean{
			var game:BHGame = this.getCurrentGame();
			if(game.zaofan == null || PokerUtil.getCount(game.zaofan) < 4){
				return false;
			}
			for(var k in game.zaofan){
				if(game.zaofan[k] == 1){
					return true;
				}
			}
			return false;
		}	
		/**
		* 选牌信息
		*/
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
	}
}