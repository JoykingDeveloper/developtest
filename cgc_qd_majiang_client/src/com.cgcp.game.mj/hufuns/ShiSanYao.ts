module lj.cgcp.game.qdmj_705 {
	export class ShiSanYao extends BaseHu {

		/**
		 * 胡牌
		 */
		public hu(mjList:number[]):boolean{
			if(mjList.length != 14){
				return false;
			}
			mjList = MajiangConstant.clone_array(mjList);
			var removes:number[] = [1,9,10,18,19,27,28,29,30,31,32,33,24];
			var len:number = removes.length;
			var val:number;
			var index:number;
			for(var i:number = 0; i < len ;i++){
				val = removes[i];
				index = mjList.indexOf(val);
				if(index != -1){
					mjList.splice(index,1);
				}
			}

			if(mjList.length > 1){
				return false;
			}
			if(removes.indexOf(mjList[0]) == -1){
				return false;
			}
			return true;
		}

		/**
		 * 检测牌型
		 */
		public checkType(mjList:number[]):boolean{
			if(mjList.length != 14){
				return false;
			}
			mjList = MajiangConstant.clone_array(mjList);
			var removes:number[] = [1,9,10,18,19,27,28,29,30,31,32,33,24];
			var len:number = removes.length;
			var val:number;
			var index:number;
			for(var i:number = 0; i < len ;i++){
				val = removes[i];
				index = mjList.indexOf(val);
				if(index != -1){
					mjList.splice(index,1);
				}
			}
			if(mjList.length == 1){
				return true;
			}
			return false;
		}

		/**
		 * 找听牌
		 */
		public findTing(mjList:number[]):any[]{
			mjList = MajiangConstant.clone_array(mjList);
			var removes:number[] = [1,9,10,18,19,27,28,29,30,31,32,33,24];
			var len:number = removes.length;
			var val:number;
			var index:number;
			for(var i:number = 0; i < len ;i++){
				val = removes[i];
				index = mjList.indexOf(val);
				if(index != -1){
					mjList.splice(index,1);
				}
			}
			return [[[],1,mjList[0]]]
		}

	}
}