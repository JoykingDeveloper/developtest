module lj.cgcp.game.scmj_204 {
	export class EndPanel2 extends BasePanel {
		public constructor() {
			super();
		}

		public init():void{
			var room:Room = RoomData.getCurrentRoom();
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			var players:any = room.players;
			var uid:string;
			var role:Role;
			var itemSpr:starlingswf.SwfSprite;
			var fanNum:number;
			var maxFanNum:number = 0;
			var maxFanIndex:number = -999999;
			var roleHead:RoleHeadImage;
			var countData:any;
			var selfUid:string = RoleData.getRole().uid;
			var resultTexts:string[] = [];
			for(var index:number = 1; index < 5 ; index++){
				uid = players[index];
				role = RoomData.getRole(uid);
				itemSpr = this.mainAsset.getSprite("item" + index);
				itemSpr.getChildByName("fangzhuSpr").visible = uid == room.owner;
				itemSpr.getTextField("nameText").text = role.name;
				if(uid == selfUid){
					itemSpr.getTextField("nameText").textColor = 0x58FE1E;
				}
				itemSpr.getTextField("idText").text = "ID:" + role.uid;

				fanNum = this.getFanNum(uid,game.totalFan);
				itemSpr.getTextField("fenText").text = fanNum.toString();
				if(fanNum >= 0){
					itemSpr.getTextField("fenText").textColor = 0xFFFA7D;
				}
				if(maxFanNum < fanNum){
					maxFanNum = fanNum;
					maxFanIndex = index;
				}
				itemSpr.getSprite("dyztb").visible = false;

				roleHead = new RoleHeadImage(role);
				roleHead.height = roleHead.width = 58;
				roleHead.x = 20.95;
				roleHead.y = 41.5;
				itemSpr.addChildAt(roleHead,itemSpr.getChildIndex(itemSpr.getChildByName("headKuang")));

				countData = game.countData[uid];
				if(countData != null){
					if(countData["1"]) itemSpr.getTextField("num1Text").text = countData["1"];
					else itemSpr.getTextField("num1Text").textColor = 0x39B5A1;
					if(countData["2"]) itemSpr.getTextField("num2Text").text = countData["2"];
					else itemSpr.getTextField("num2Text").textColor = 0x39B5A1;
					if(countData["3"]) itemSpr.getTextField("num3Text").text = countData["3"];
					else itemSpr.getTextField("num3Text").textColor = 0x39B5A1;
					if(countData["4"]) itemSpr.getTextField("num4Text").text = countData["4"];
					else itemSpr.getTextField("num4Text").textColor = 0x39B5A1;
				}else{
					itemSpr.getTextField("num1Text").textColor = 0x39B5A1;
					itemSpr.getTextField("num2Text").textColor = 0x39B5A1;
					itemSpr.getTextField("num3Text").textColor = 0x39B5A1;
					itemSpr.getTextField("num4Text").textColor = 0x39B5A1;
				}

				resultTexts.push(WxUtils.getShareRoleName(role.name) + ":" + fanNum + "分");
			}
			var shareTitle:string = "";
			var resultText:string = "";
			if(maxFanNum > 0){
				shareTitle = room.id + "房大赢家-" + WxUtils.getShareRoleName(RoomData.getRole(players[maxFanIndex]).name) + ":" + maxFanNum + "分";
				this.mainAsset.getSprite("item" + maxFanIndex).getSprite("dyztb").visible = true;
			}else{
				shareTitle = "战绩";
			}
			for(var i:number = 0; i < resultTexts.length;i++){
				if(shareTitle != "战绩" && (i+1) == maxFanIndex) continue;
				resultText += resultTexts[i] + "\n";
			}
			WxUtils.customizeShareDesc(shareTitle,resultText);

			var d = new Date();
			this.mainAsset.getTextField("gameTimeText").text = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
			this.mainAsset.getTextField("roomIdText").text = `房间号:${room.id}`;
			
		}

		public getFanNum(uid:string,fanData:any):number{
			if(fanData == null || fanData[uid] == null){
				return 0;
			}
			return fanData[uid];
		}

		public on_closeBtn2(e:egret.Event):void{
			ExtGameHelper.exitExtGamePanel();
		}

		public on_xuanyaoBtn(e:egret.Event):void{
			ExtGameHelper.showShareTip();
		}

		public mainAssetName(): string{
			return "spr_end2";
		}

		public assetSwf(): starlingswf.Swf{
			return MjGameAsset.mainSwf;
		}
	}
}