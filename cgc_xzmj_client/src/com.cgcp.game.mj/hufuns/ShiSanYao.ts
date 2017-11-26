module lj.cgcp.game.scmj_204 {
	export class ShiSanYao extends TuidaoHu {

		/**
		 * 检测牌型
		 */
		public checkType(mjList:number[]):string[]{
			var mjList:number[] = MajiangConstant.clone_array(mjList);
			var _19Mj = [1,9,10,18,19,27];
			var _456Mj = [4,5,6,13,14,15,22,23,24];
			var _2Mj = [2,11,20];
			var _3Mj = [3,12,21];
			var _7Mj = [7,16,25];
			var _8Mj = [8,17,26];
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			if(game == null){
				return null;
			}
			var uid:string = RoleData.getRole().uid;
			var pengList:number[] = game.pengList[uid];
			if(pengList != null){
				for(var index in pengList){
					if(_19Mj.indexOf(pengList[index]) == -1){
						return null;
					}
				}
			}
			var gangList:number[] = game.gangList[uid];
			if(gangList != null){
				for(var index in gangList){
					if(_19Mj.indexOf(gangList[index]) == -1){
						return null;
					}
				}
			}
			var angangList:number[] = game.angangList[uid];
			if(angangList != null){
				for(var index in angangList){
					if(_19Mj.indexOf(angangList[index]) == -1){
						return null;
					}
				}
			}
			var count_value:any = MajiangConstant.array_values_count(mjList);
			for(var mj in count_value){
				if(_456Mj.indexOf(parseInt(mj)) != -1){
					return null;
				}
			}
			//找出能做将的1、9
			for(var mj in count_value){
				if(_19Mj.indexOf(parseInt(mj)) != -1 && count_value[mj] > 1){
					//此牌做将
					var tempmjList:number[] = MajiangConstant.clone_array(mjList);
					MajiangConstant.sortMjList(tempmjList,0,game.lackTypes[uid]);
					tempmjList.splice(tempmjList.indexOf(parseInt(mj),2));
					var tempcount_value:any = MajiangConstant.array_values_count(tempmjList);
					//遍历每一个2378对应配一个1、9
					var is19 = true;
					for(var mj1 in tempcount_value){
						var mj2:number = parseInt(mj1);
						var count:number = tempcount_value[mj1];
						if(_2Mj.indexOf(mj2) != -1){
							if(tempcount_value[(mj2 - 1).toString()] != count || tempcount_value[(mj2 + 1).toString()] != count ){
								is19 = false;
								break;
							}
						}
						if(_3Mj.indexOf(mj2) != -1){
							if(tempcount_value[(mj2 - 1).toString()] != count || tempcount_value[(mj2 - 2).toString()] != count ){
								is19 = false;
								break;
							}
						}
						if(_7Mj.indexOf(mj2) != -1){
							if(tempcount_value[(mj2 + 1).toString()] != count || tempcount_value[(mj2 + 2).toString()] != count ){
								is19 = false;
								break;
							}
						}
						if(_8Mj.indexOf(mj2) != -1){
							if(tempcount_value[(mj2 - 1).toString()] != count || tempcount_value[(mj2 + 1).toString()] != count ){
								is19 = false;
								break;
							}
						}
					}
					if(is19){
						return ["幺九胡","2"];
					}
				}
			}
			return null;
		}

		

	}
}