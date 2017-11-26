module lj.cgcp.game.qdmj_705 {
	export class FengYiSe extends BaseHu {

		/**
		 * 胡牌
		 */
		public hu(mjList:number[]):boolean{
			var len:number = mjList.length;
			for(var i:number = 0; i < len ; i++){
				if(mjList[i] < 28){
					return false;
				}
			}
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			if(game == null){
				return true;
			}
			var uid:string = RoleData.getRole().uid;
			var chiList:number[][] = game.chiList[uid];
			if(chiList != null){
				return false;
			}
			var pengList:number[] = game.pengList[uid];
			if(pengList != null){
				len = pengList.length;
				for(var i:number = 0; i < len ; i++){
					if(pengList[i] < 28){
						return false;
					}
				}
			}
			var gangList:number[] = game.gangList[uid];
			if(gangList != null){
				len = gangList.length;
				for(var i:number = 0; i < len ; i++){
					if(gangList[i] < 28){
						return false;
					}
				}
			}
			var angangList:number[] = game.angangList[uid];
			if(angangList != null){
				len = angangList.length;
				for(var i:number = 0; i < len ; i++){
					if(angangList[i] < 28){
						return false;
					}
				}
			}
			return true;
		}

		/**
		 * 检测牌型
		 */
		public checkType(mjList:number[]):boolean{
			var len:number = mjList.length;
			var errorCount:number = 0;
			for(var i:number = 0; i < len ; i++){
				if(mjList[i] < 28){
					errorCount++;
					if(errorCount > 1) return false;
				}
			}
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			if(game == null){
				return true;
			}
			var uid:string = RoleData.getRole().uid;
			var chiList:number[][] = game.chiList[uid];
			if(chiList != null){
				return false;
			}
			var pengList:number[] = game.pengList[uid];
			if(pengList != null){
				len = pengList.length;
				for(var i:number = 0; i < len ; i++){
					if(pengList[i] < 28){
						errorCount++;
						if(errorCount > 1) return false;
					}
				}
			}
			var gangList:number[] = game.gangList[uid];
			if(gangList != null){
				len = gangList.length;
				for(var i:number = 0; i < len ; i++){
					if(gangList[i] < 28){
						errorCount++;
						if(errorCount > 1) return false;
					}
				}
			}
			var angangList:number[] = game.angangList[uid];
			if(angangList != null){
				len = angangList.length;
				for(var i:number = 0; i < len ; i++){
					if(angangList[i] < 28){
						errorCount++;
						if(errorCount > 1) return false;
					}
				}
			}
			return true;
		}

		/**
		 * 找听牌
		 */
		public findTing(mjList:number[]):any[]{
			var len:number = mjList.length;
			var errorNumber:number[] = [];
			for(var i:number = 0; i < len ; i++){
				if(mjList[i] < 28){
					errorNumber.push(mjList[i]);
				}
			}
			if(errorNumber.length > 1) return null;
			if(errorNumber.length == 0) errorNumber.push(mjList[0]);
			return [[[],mjList[0],errorNumber[0]]];
		}

	}
}