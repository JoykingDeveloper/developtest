module lj.cgcp.game.scmj_204 {
	export class MjGameRoot extends ExtGame {

		public gamePanel:GamePanel;

		public constructor() {
			super();
            SoundManager.playBgSound("playingInGame.mp3");
		}

        /** 初始化房间 */
        public onInit(room: Room, roles: any): void{
            ExtGameHelper.setBackGroundColor(0x1A5853);
        }

		/** 有玩家加入房间 */
        public onJoinRoom(data: any): void{
            if(this.gamePanel != null) this.gamePanel.dataParse.onJoinRoom(data);
        }
        /** 有玩家离开房间 */
        public onLeaveRoom(data: any): void{
            if(this.gamePanel != null) this.gamePanel.dataParse.onLeaveRoom(data);
        }

        /** 玩家返回游戏 */
        public onReturnGame(data: any): void{
            var sender:string = data.sender;
            if(this.gamePanel != null){
                var roleHead:RoleHead = this.gamePanel.roleHeads[this.gamePanel.getRoleIndex(sender)];
                roleHead.offLineText.visible = false;
            }
        }

        /** 玩家离线 */
        public onLeaveGame(data: any): void{
            var sender:string = data.sender;
            if(this.gamePanel != null){
                var roleHead:RoleHead = this.gamePanel.roleHeads[this.gamePanel.getRoleIndex(sender)];
                roleHead.offLineText.visible = true;
            }
        }

		/** 收到游戏消息 */
        public onGameMessage(data: any): void{
            var tag:string = data.tag;
            if(tag == "initGame"){
                if(MajiangConstant.getAnyCount( data.game.ready)<4){
                    data.game.fanData = null;
                }

                MajiangGameData.putCurrentGame(data.game);
                MajiangGameData.setGangDi(data.gangdi);
                MajiangGameData.putMjs(data.mjList);
                MajiangGameData.setOpList(data.opList);
                MajiangGameData.setThreeSelect(data.threeSelectList);
                MajiangGameData.needShowOp = data.needShowOp;

				this.gamePanel = new GamePanel();
				this.addChild(this.gamePanel);

                var room:Room = RoomData.getCurrentRoom();
                var des:string = "";
                if(room.aa){
                    des += "AA支付房卡，"
                }else{
                    des += "房主支付房卡，"
                }
                des += MajiangGameData.getCurrentGame().maxCount + "局，速度来战";
                WxUtils.customizeShareDesc(null,des,true);
            }else if(this.gamePanel != null){
                var fun:Function = this.gamePanel.dataParse.tagEvents[tag];
                if(fun != null) fun.apply(this.gamePanel.dataParse,[data]);
            }

        }

        /** 销毁游戏 */
        public dispose(): void{
            if(this.gamePanel != null) this.gamePanel.dispose();
            SoundManager.stopGameSound("playingInGame.mp3");
        }
		
	}
}