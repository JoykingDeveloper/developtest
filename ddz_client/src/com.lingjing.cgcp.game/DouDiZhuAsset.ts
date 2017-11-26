module lj.cgcp.game.doudizhu {

	export class DouDiZhuAsset {

		public static gameWidth:number = 640;
		public static gameHeight:number = 1136;

		public static mainSwf():starlingswf.Swf{
			return RES.getRes("doudizhu_main_swf");
		}

		public static paiSwf():starlingswf.Swf{
			return RES.getRes("pai_swf");
		}
		public static pai1Swf():starlingswf.Swf{
			return RES.getRes("pai1_swf");
		}
		public static effSwf():starlingswf.Swf{
			return RES.getRes("eff_swf");
		}

	}

}