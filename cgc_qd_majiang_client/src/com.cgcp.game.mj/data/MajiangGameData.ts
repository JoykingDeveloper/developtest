module lj.cgcp.game.qdmj_705 {
	export class MajiangGameData {

		/**
		 * 进入游戏之后，是否需要显示操作列表
		 */
		public static needShowOp:boolean = false;
		public static isQiangGang:boolean = false;
		public static getCurrentGame():MajiangGame{
			return ExtGameHelper.getRAMData("currentGame");
		}
		
		public static putCurrentGame(game:MajiangGame):void{
			ExtGameHelper.saveRAMData("currentGame",game);
		}

		public static getMjs():number[]{
			return ExtGameHelper.getRAMData("currentGameMjs");
		}

		public static putMjs(cards:any):void{
			ExtGameHelper.saveRAMData("currentGameMjs",cards);
		}

		public static removeMj(mjVal:number):void{
			var vals:number[] = MajiangGameData.getMjs();
			var index:number = vals.indexOf(mjVal);
			if(index != -1){
				vals.splice(index,1);
			}
			MajiangGameData.putMjs(vals);
		}

		/**
		 * 当前是否已经操作过
		 */
		public static isOp(uid:string):boolean{
			var opList:any = MajiangGameData.getOpList();
			if(opList == null || opList[uid] == null){
				return false;
			}
			return true;
		}
		public static getOpList():any{
			return ExtGameHelper.getRAMData("mjOpList");
		}

		public static setOpList(opList:any):void{
			ExtGameHelper.saveRAMData("mjOpList",opList);
		}

		/**
		 * 保存杠底数据
		 */
		public static setGangDi(vals:number[]):void{
			ExtGameHelper.saveRAMData("mjGangDi",vals);
		}
		
		/**
		 * 获取杠底
		 */
		public static getGangDi():number[]{
			return ExtGameHelper.getRAMData("mjGangDi");
		}

		/**
		 * 获取剩余多少张麻将
		 */
		public static getMjCount():number{
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			var val:number = game.totalMj - game.currentMj - 12;
			return val >= 0 ? val : 0;
		}

	}
}