module lj.cgcp.game.scmj_204 {

	/**
	 * 碰碰胡 22 333 444 555 666
	 */
	export class PengPengHu extends TuidaoHu {

		/**
		 * 胡牌
		 */
		public checkType(mjList:number[]):string[]{
			mjList = MajiangConstant.clone_array(mjList);
			MajiangConstant.sortMjList(mjList,0);

			var countVals:any = MajiangConstant.array_values_count(mjList);
			var count:number;
			var index:number;
			for(var mj in countVals){
				count = countVals[mj];
				if(count == 3 || count == 4){
					index = mjList.indexOf(parseInt(mj));
					mjList.splice(index,count);
				}
			}

			if(mjList.length == 2 && mjList[0] == mjList[1]){
				return ["大对胡","1"];
			}
			return null;

		}

	}
}