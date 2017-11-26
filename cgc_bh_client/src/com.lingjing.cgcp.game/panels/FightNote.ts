module lj.cgcp.game.baohuang {
	export class FightNote extends ExtGameScorePanel{
		public mainAsset:starlingswf.SwfSprite;
		public scroll:egret.ScrollView;
		public content:starlingswf.SwfSprite;
		public constructor() {
			super();
			this.mainAsset = BHAsset.mainSwf().createSprite("spr_fightnote");
			this.addChild(this.mainAsset);
			InterfaceVariablesUtil.initVariables(this,this.mainAsset);
			this.scroll = new egret.ScrollView();
			this.content = new starlingswf.SwfSprite();
			this.scroll.width = 520;
    		this.scroll.height = 635;
			this.scroll.x = 32;
			this.scroll.y = 75;
        	this.scroll.setContent(this.content);
			this.mainAsset.addChildAt(this.scroll,2);
		}

		public init(data:any):void{
			var obj:FightNote = this;
			egret.setTimeout(function():void{
				obj.initUI(data);
			},this,10);
		}

		public initUI(data:any):void{
			if(data.zhanji == null)return;
			var _dataList:any[] = data.zhanji;
			var len:number = _dataList.length;
			for(var i=0;i<len;i++){
				var item:starlingswf.SwfSprite = this.createItem(_dataList[i]);
				if(item != null){
					item.y = 294*i;
					this.content.addChild(item);
				}else{
					_dataList.splice(i,1);
					len--;
					i--;
				}
			}
		}

		public createItem(itemdata:any):starlingswf.SwfSprite{
			if(itemdata == null || itemdata.zhanji == null)return null;
			var item:starlingswf.SwfSprite = BHAsset.mainSwf().createSprite("spr_noteitems");
			InterfaceVariablesUtil.initVariables(this,item);
			item.getTextField("roomidText").text = itemdata["fanghao"];
			item.getTextField("timeText").text = itemdata["time"];
			var index:number = 0;
			for(var name in itemdata.zhanji){
				index++;
				item.getTextField("name"+index).text = name;
				// item.getTextField("name"+index).textColor = 0x90C4F3;
				item.getTextField("score"+index).text = itemdata.zhanji[name];
				item.getTextField("score"+index).textColor = parseInt(itemdata.zhanji[name])>0? 0xF6C86C:0xAFB6F4;
			}
			item.getImage("win").visible = RoleData.getRole().uid == itemdata["winnerUid"];
			item.getImage("lose").visible = RoleData.getRole().uid != itemdata["winnerUid"];
			return item;

		}
		public on_backBtn(e:egret.Event):void{
			this.parent.removeChild(this);
		}
		public dispose():void{
			InterfaceVariablesUtil.disposeVariables(this);
		}
	}
}