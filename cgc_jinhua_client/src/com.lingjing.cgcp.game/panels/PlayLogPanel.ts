module lj.cgcp.game.jinhua {
	export class PlayLogPanel extends ExtGameScorePanel {
		public achivement:starlingswf.SwfSprite;
		public myscrollView:egret.ScrollView
		public content:starlingswf.SwfSprite 
		public lose:egret.DisplayObject;
		public win:egret.DisplayObject;
		public constructor() {
			super();
			this.achivement = JinHuaAsset.mainSwf().createSprite("spr_achivement");
			this.addChild(this.achivement);
			InterfaceVariablesUtil.initVariables(this,this.achivement);
			this.myscrollView = new egret.ScrollView();
			this.content = new starlingswf.SwfSprite();
			this.myscrollView.width = 384;
    		this.myscrollView.height = 390;
			this.myscrollView.x = 36;
			this.myscrollView.y = 100;
        	this.myscrollView.setContent(this.content);
			this.addChild(this.myscrollView);
			
		}
		public init(data:any): void{
			var thisObj:PlayLogPanel = this;
			egret.setTimeout(function() {
				thisObj.init2(data);
			},this,10);
		}

		public init2(data:any):void{
			if(data.zhanji == null)  return;
			var zhanji = data.zhanji;
			var index:number = 0;
			var length:number = zhanji.length;
			for(var i=0; i < length; i++){
				var item:starlingswf.SwfSprite = JinHuaAsset.mainSwf().createSprite("spr_achivement_item");
				InterfaceVariablesUtil.initVariables(this,item);
				item.x = 0;
				item.y = index * 317 + index * 20;
				this.content.addChild(item);
				item.getTextField("fanghao").text = data.zhanji[i]["fanghao"];
				item.getTextField("time").text = data.zhanji[i]["time"];
				var nameArray = [];
				var moneyArray = [];
				for(var name in zhanji[i].zhanji){
					moneyArray.push(zhanji[i].zhanji[name]);
				}
				for(var name in zhanji[i].zhanji){
					nameArray.push(name);
				}
				var nameArrayLength = nameArray.length;
				for(var j=0; j< 6; j ++){
					if(j < nameArrayLength){
						item.getTextField("name"+j).text =  nameArray[j];
						item.getTextField("money"+j).text =  moneyArray[j];
						if(moneyArray[j] < 0){
							item.getTextField("money"+j).textColor = 0xBF1E02;
						}else if(moneyArray[j] > 0){
							item.getTextField("money"+j).textColor = 0xF8C17B;
						}
					}else{
						item.getTextField("name"+j).text =  "空缺位";
						item.getTextField("money"+j).text =  "0";	
					}
					item.getTextField("name"+j).textColor = 0x9F9ABE;
					if(item.getTextField("money"+j).text == "0"){
						item.getTextField("money"+j).textColor = 0x9F9ABE;
					}	
				}
				//是否是赢家
				if(RoleData.getRole().uid == data.zhanji[i]["winnerUid"]){
					this.win.visible = true;
					this.lose.visible = false;
				}else{
					this.win.visible = false;
					this.lose.visible = true;
				}
				
				index++;
			}
		}

		public on_fanhuiBtn(e:egret.Event):void{
			this.parent.removeChild(this);
		}

        public dispose(): void{
			InterfaceVariablesUtil.disposeVariables(this);
		}
	}
}

