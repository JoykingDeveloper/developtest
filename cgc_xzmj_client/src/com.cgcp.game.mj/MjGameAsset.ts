module lj.cgcp.game.scmj_204 {
	export class MjGameAsset {


		public static get mainSwf():starlingswf.Swf{
			return RES.getRes("mj_main_swf");
		}

		public static get mjSwf():starlingswf.Swf{
			return RES.getRes("mj_swf");
		}

		public static get effSwf():starlingswf.Swf{
			return RES.getRes("eff_swf");
		}


	}
}