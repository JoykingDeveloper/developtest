module lj.cgcp.game.scmj_204 {
	export class EndDetail extends BasePanel {
		public fanInfos:any;
		public constructor(fanInfos:any) {
			super();
			this.fanInfos = fanInfos;
			this.Init1();
		}
		public Init1():void{
			for(var i=0;i<4;i++){
				var detail:egret.TextField = this.mainAsset.getTextField("detailText"+i);
				if(detail != null){
					if(i == 0){
						detail.text = this.createDetailStr0(this.fanInfos[i]);
					}else{
						detail.text = this.createDetailStr(this.fanInfos[i]);
					}
				}
				detail.stroke = 1;
				detail.strokeColor = 0x000000;
			}
		}
		public createDetailStr0(data:number[][]):string{
			if(data == null||data.length<1){
				return "";
			}
			var detail:string = "";
			for(var index in data){
				var num:number = data[index][0];
				detail+=(num>0?"+"+num:num.toString());
			}
			return detail;
		}
		public createDetailStr(data:number[]):string{
			if(data == null||data.length<1){
				return "";
			}
			var detail:string = "";
			for(var index in data){
				var num:number = data[index];
				detail+=(num>0?"+"+num:num.toString());
			}
			return detail;
		}
		public mainAssetName(): string{
			return "spr_end_detail";
		}

		public assetSwf(): starlingswf.Swf{
			return MjGameAsset.mainSwf;
		}
	}

}