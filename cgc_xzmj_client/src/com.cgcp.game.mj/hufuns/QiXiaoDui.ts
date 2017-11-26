module lj.cgcp.game.scmj_204 {
	export class QiXiaoDui extends BaseHu {

		/**
		 * 胡牌
		 */
		public hu(mjList:number[]):boolean{
			if(mjList.length != 14){
				return false;
			}
			var countVals:any = MajiangConstant.array_values_count(mjList);
			var duizi:number = 0;
			var count:number;
			for(var mj in countVals){
				count = countVals[mj];
				if(count >= 2){
					duizi++;
				}
				if(count >= 4){
					duizi++;
				}
			}
			if(duizi == 7){
				return true;
			}
			return false;
		}

		/**
		 * 检测牌型
		 */
		public checkType(mjList:number[]):string[]{
			if(mjList.length != 14){
				return null;
			}
			var countVals:any = MajiangConstant.array_values_count(mjList);
			var duizi:number = 0;
			var count:number;
			for(var mj in countVals){
				count = countVals[mj];
				if(count >= 2){
					duizi++;
				}
				if(count >= 4){
					duizi++;
				}
			}
			if(duizi >= 6){
				return ["七小对","2"];
			}
			return null;
		}

		

	}
}