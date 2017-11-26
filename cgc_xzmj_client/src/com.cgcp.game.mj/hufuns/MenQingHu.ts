module lj.cgcp.game.scmj_204 {
	export class MenQingHu extends TuidaoHu{
		public checkType(mjList:number[]):string[]{
			if(mjList.length == 14){
				return ["门清","1"];
			}
			return null;
		}
	}
}