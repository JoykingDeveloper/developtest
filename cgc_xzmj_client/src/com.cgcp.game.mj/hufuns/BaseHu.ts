module lj.cgcp.game.scmj_204 {

	/**
	 * 胡牌顶级类
	 */
	export class BaseHu {

		/** 将牌集合 */
		public _258Vals:number[] = [2,5,8,11,14,17,20,23,26];
		public _258Len:number = 9;
		/**
		 * 胡牌
		 */
		public hu(mjList:number[]):boolean{
			return true;
		}

		/**
		 * 是否有258里面的牌
		 */
		public has258(mjList:number[],continueVal:number = -1):boolean{
			return true;
			// var len:number = mjList.length;
			// var mjVal:number;
			// for(var i:number = 0; i < len ; i++){
			// 	mjVal = mjList[i];
			// 	if(mjVal == continueVal){
			// 		continue;
			// 	}
			// 	if(this._258Vals.indexOf(mjVal) != -1){
			// 		return true;
			// 	}
			// }
			// return false;
		}

		/**
		 * 是否是258牌
		 */
		public is258(mjVal:number):boolean{
			// return true;
			return this._258Vals.indexOf(mjVal) != -1;
		}

		/**
		 * 检测牌型
		 */
		public checkType(mjList:number[]):string[]{
			return null;
		}

		/**
		 * 找听牌
		 */
		public findTing(mjList:number[]):any[]{
			return null;
		}

		

	}
}