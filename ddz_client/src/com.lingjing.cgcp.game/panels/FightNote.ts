module lj.cgcp.game.doudizhu {
	export class FightNote extends ExtGameScorePanel{
		public mainAsset:starlingswf.SwfSprite;
		public scroll:egret.ScrollView;
		public content:starlingswf.SwfSprite;
		public constructor() {
			super();
			this.mainAsset = DouDiZhuAsset.mainSwf().createSprite("spr_fightnote");
			this.addChild(this.mainAsset);
			InterfaceVariablesUtil.initVariables(this,this.mainAsset);
			this.scroll = new egret.ScrollView();
			this.content = new starlingswf.SwfSprite();
			this.scroll.width = 510;
    		this.scroll.height = 630;
			this.scroll.x = 42;
			this.scroll.y = 80;
        	this.scroll.setContent(this.content);
			this.addChild(this.scroll);
		}

		public init(data:any):void{
			var obj:FightNote = this;
			egret.setTimeout(function():void{
				obj.initUI(data);
			},this,10);
		}

		public initUI(data:any):void{
			if(data.zhanji == null)return;
			var len:number = data.zhanji.length;
			for(var i=0;i<len;i++){
				var item:starlingswf.SwfSprite = this.createItem(data.zhanji[i]);
				item.y = 210*i;
				this.content.addChild(item);
			}
		}

		public createItem(itemdata:any):starlingswf.SwfSprite{
			if(itemdata == null || itemdata.zhanji == null)return;
			var item:starlingswf.SwfSprite = DouDiZhuAsset.mainSwf().createSprite("spr_noteitem");
			InterfaceVariablesUtil.initVariables(this,item);
			item.getTextField("roomidText").text = itemdata["fanghao"];
			item.getTextField("timeText").text = itemdata["time"];
			var index:number = 0;
			for(var name in itemdata.zhanji){
				index++;
				item.getTextField("name"+index).text = name;
				item.getTextField("name"+index).textColor = 0x90C4F3;
				item.getTextField("score"+index).text = itemdata.zhanji[name];
				item.getTextField("score"+index).textColor = parseInt(itemdata.zhanji[name])>=0? 0xFEE31A:0xFF5959;
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