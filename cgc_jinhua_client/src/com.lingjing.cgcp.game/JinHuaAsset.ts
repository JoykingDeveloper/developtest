module lj.cgcp.game.jinhua {

	export class JinHuaAsset {

		public static gameWidth:number = 640;
		public static gameHeight:number = 1136;

		public static mainSwf():starlingswf.Swf{
			return RES.getRes("jinhua_main_swf");
		}

		public static vsEffSwf():starlingswf.Swf{
			return RES.getRes("vs_eff_swf");
		}

		public static paiSwf():starlingswf.Swf{
			return RES.getRes("pai_swf");
		}


	}

}