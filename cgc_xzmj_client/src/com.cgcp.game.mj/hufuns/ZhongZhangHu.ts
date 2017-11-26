module lj.cgcp.game.scmj_204 {
	export class ZhongZhangHu extends TuidaoHu{
		public checkType(mjList:number[]):string[]{
			var mjList:number[] = MajiangConstant.clone_array(mjList);
			var _19Mj = [1,9,10,18,19,27];
			for(var i = 0;i<mjList.length;i++){
				if(_19Mj.indexOf(mjList[i]) != -1){
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
				for(var k in pengList){
					if(_19Mj.indexOf(pengList[k]) != -1){
						return null;
					}
				}
			}
			var gangList:number[] = game.gangList[uid];
			if(gangList){
				for(var k in gangList){
					if(_19Mj.indexOf(gangList[k]) != -1){
						return null;
					}
				}
			}
			var angangList:number[] = game.angangList[uid];
			if(angangList){
				for(var k in angangList){
					if(_19Mj.indexOf(angangList[k]) != -1){
						return null;
					}
				}
			}
			return ["中张胡","1"];
		}
	}
}