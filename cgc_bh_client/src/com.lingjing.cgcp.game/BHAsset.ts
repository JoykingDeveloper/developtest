module lj.cgcp.game.baohuang {

	export class BHAsset {

		public static gameWidth:number = 1136;
		public static gameHeight:number = 640;

		public static mainSwf():starlingswf.Swf{
			return RES.getRes("baohuang_main_swf");
		}

		public static paiSwf():starlingswf.Swf{
			return RES.getRes("pai_swf");
		}
		public static effSwf():starlingswf.Swf{
			return RES.getRes("eff_swf");
		}

	}

}