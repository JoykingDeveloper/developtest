module lj.cgcp.game.scmj_204 {
	export class JinGouDiao extends TuidaoHu{
		public checkType(mjList:number[]):string[]{
			if(mjList.length == 2 && mjList[0] == mjList[1]){
				return ["金钩钓","1"];
			}
			return null;
		}
	}
}