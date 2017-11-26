module lj.cgcp.game.scmj_204 {
	export class QingYiSe extends BaseHu{
		public checkType(mjList:number[]):string[]{
			if(mjList == null){
				return null;
			}
			var arr:number[][] = [[1,9],[10,18],[19,27]];
			var mjType:number[] = [];
			for(var index = 0 ; index < 3 ;index ++){
				if(mjList[0]>=arr[index][0] && mjList[0]<=arr[index][1]){
					mjType = arr[index];
					break;
				}
			}
			var len:number = mjList.length;
			for(var i=0;i<len;i++){
				if(mjList[i]<mjType[0] || mjList[i]>mjType[1]){
					return null;
				}
			}
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			if(game == null){
				return null;
			}
			var uid:string = RoleData.getRole().uid;
			var pengList:number[] = game.pengList[uid];
			if(pengList){
				for(var key in pengList){
					if(pengList[key] < mjType[0] || pengList[key] > mjType[1]){
						return null;
					}
				}
			}
			var gangList:number[] = game.gangList[uid];
			if(gangList){
				for(var key in gangList){
					if(gangList[key] < mjType[0] || gangList[key] > mjType[1]){
						return null;
					}
				}
			}
			var angangList:number[] = game.angangList[uid];
			if(angangList){
				for(var key in angangList){
					if(angangList[key] < mjType[0] || angangList[key] > mjType[1]){
						return null;
					}
				}
			}
			return ["清一色","2"];
		}
	}
}