module lj.cgcp.game.scmj_204 {
	export class MjGameApi {

		/**
		 * 准备
		 */
		public static ready():void{
			var par:any = {};
			par['tag'] = 'ready';
			ExtGameHelper.sendGameMessage(par);
		}

		/**
		 * 出牌
		 */
		public static chupai(mjVal:any,ting:any = null):void{
			var par:any = {};
			par['tag'] = 'chupai';
			par['mjVal'] = mjVal;
			if(ting != null){
				par['ting'] = ting;
			}
			ExtGameHelper.sendGameMessage(par);
		}
		/**
		 * 换牌
		*/
		public static changethree(threeMj:any):void{
			var par:any = {};
			par['tag'] = 'changethree';
			par['threeMj'] = threeMj;
			ExtGameHelper.sendGameMessage(par);
		}
		/**
		 * 定缺
		*/
		public static lacking(lacktype:number):void{
			var par:any = {};
			par['tag'] = 'lacking';
			par['lackType'] = lacktype;
			ExtGameHelper.sendGameMessage(par);
		}
		/**
		 * 操作 0-过 1-吃 2-碰 3-杠 4-胡
		 */
		public static operating(type:number,chiMjs:number[] = null):void{
			var par:any = {};
			par['tag'] = 'operating';
			par['operatingType'] = type;
			if(chiMjs != null){
				par['chiMjs'] = chiMjs;
			}
			ExtGameHelper.sendGameMessage(par);
		}
		public static qiangganghu(type:number):void{
			var par:any = {};
			par['tag'] = 'qiangganghu';
			par['type'] = type;
			ExtGameHelper.sendGameMessage(par);
		}
		/**
		 * 自摸
		 */
		public static zimo():void{
			var par:any = {};
			par['tag'] = 'zimo';
			ExtGameHelper.sendGameMessage(par);
		}

		/**
		 * 调用杠牌api 杠自己的牌调用
		 */
		public static callGangApi(mjVal:number):void{
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			var countVal = MajiangConstant.array_values_count(MajiangGameData.getMjs());
			if(countVal[mjVal] == 4 ){//暗杠
				MjGameApi.anGang(mjVal);
			}else{
				MjGameApi.gangSelf(mjVal);
			}
		}

		/**
		 * 杠自己的牌
		 */
		public static gangSelf(mjVal:number):void{
			var par:any = {};
			par['tag'] = 'gangSelf';
			par['mjVal'] = mjVal;
			ExtGameHelper.sendGameMessage(par);
		}

		/**
		 * 暗杠
		 */
		public static anGang(mjVal:number):void{
			var par:any = {};
			par['tag'] = 'anGang';
			par['mjVal'] = mjVal;
			ExtGameHelper.sendGameMessage(par);
		}

		/**
		 * 听牌
		 * @param remove	出哪张牌
		 * @param tingVal	用哪些牌来听牌
		 * @param tingTarget	听哪张牌
		 */
		public static ting(remove:number,tingVal:number[],tingTarget:number):void{
			var par:any = {};
			par['tag'] = 'ting';
			par['remove'] = remove;
			par['tingVal'] = tingVal;
			par['tingTarget'] = tingTarget;
			ExtGameHelper.sendGameMessage(par);
		}


	}
}