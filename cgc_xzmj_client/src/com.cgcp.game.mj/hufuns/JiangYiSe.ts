module lj.cgcp.game.scmj_204 {
	export class JiangYiSe extends TuidaoHu {

		/**
		 * 检测牌型
		 */
		public checkType(mjList:number[]):string[]{
			var len:number = mjList.length;
			var errorCount:number = 0;
			for(var i:number = 0; i < len ; i++){
				if(!this.is258(mjList[i])){
					errorCount++;
					if(errorCount > 1) return null;
				}
			}
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			if(game == null){
				return null;
			}
			var uid:string = RoleData.getRole().uid;
			
			var pengList:number[] = game.pengList[uid];
			if(pengList != null){
				len = pengList.length;
				for(var i:number = 0; i < len ; i++){
					if(!this.is258(pengList[i])){
						errorCount++;
						if(errorCount > 1) return null;
					}
				}
			}
			var gangList:number[] = game.gangList[uid];
			if(gangList != null){
				len = gangList.length;
				for(var i:number = 0; i < len ; i++){
					if(!this.is258(gangList[i])){
						errorCount++;
						if(errorCount > 1) return null;
					}
				}
			}
			var angangList:number[] = game.angangList[uid];
			if(angangList != null){
				len = angangList.length;
				for(var i:number = 0; i < len ; i++){
					if(!this.is258(angangList[i])){
						errorCount++;
						if(errorCount > 1) return null;
					}
				}
			}
			return ["将对","1"];
		}

		
			

	}
}