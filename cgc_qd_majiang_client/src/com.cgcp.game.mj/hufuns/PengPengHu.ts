module lj.cgcp.game.qdmj_705 {

	/**
	 * 碰碰胡 22 333 444 555 666
	 */
	export class PengPengHu extends BaseHu {

		/**
		 * 胡牌
		 */
		public hu(mjList:number[]):boolean{
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

			if(mjList.length == 2 && mjList[0] == mjList[1] && this.is258(mjList[0])){
				return true;
			}
			return false;

		}

	}
}