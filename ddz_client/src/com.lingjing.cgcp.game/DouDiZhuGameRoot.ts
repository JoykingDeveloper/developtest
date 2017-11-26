module lj.cgcp.game.doudizhu {
	export class DouDiZhuGameRoot extends ExtGame {

        public gameMain:GamePanel;

		public constructor() {
			super();
		}

		/** 初始化房间 */
        public onInit(room:Room,roles:any){
            DouDiZhuRoleData.saveRoles(roles);
		}
        /** 有玩家加入房间 */
        public onJoinRoom(data: any): void{
            var roles:any = data.roles;
            DouDiZhuRoleData.saveRoles(roles);
            if(this.gameMain != null) this.gameMain.dataParse.onJoinRoom(data);
        }
        /** 有玩家离开房间 */
        public onLeaveRoom(data: any): void{
            if(this.gameMain != null) this.gameMain.dataParse.onLeaveRoom(data);
        }

        /** 玩家返回游戏 */
        public onReturnGame(data: any): void{
            var uid:string = data.sender;
            var roleHead:RoleHead = this.gameMain.roleHeads[this.gameMain.getRoleIndex(uid)];
            roleHead.leaveState.visible = false;
            ColorUtil.clearColor(roleHead.mainAsset);
        }
        /** 玩家离线 */
        public onLeaveGame(data: any): void{
            var uid:string = data.sender;
            var roleHead:RoleHead = this.gameMain.roleHeads[this.gameMain.getRoleIndex(uid)];
            roleHead.leaveState.visible = true;
            ColorUtil.setGray(roleHead.mainAsset);
        }
        /** 解散房间 */
        public onDisbandRoom(data: any): void{
            if(this.gameMain != null) this.gameMain.dataParse.onLeaveRoom(data);
        }
        /** 收到游戏消息 */
        public onGameMessage(data: any): void{
            var tag:string = data.tag;
            if(tag == "initGame"){
                Log.log("initGame");
                var game:DouDiZhuGame = data.game;
                if(data.cardsInfo != null){
                    game.cardsInfo = data.cardsInfo;
                }
                DouDiZhuGameData.putCurrentGame(data.game);
                DouDiZhuGameData.putCards(data.card);
                this.gameMain = new GamePanel();
                this.addChild(this.gameMain);
                //待游戏初始化好了再刷新游戏界面
                if(data.cardsInfo != null){
                    egret.setTimeout(function():void{
                        //重新连接
                        this.pokerPanel.InitListener();
                        if(game.currentState != 0){
                            this.pokerPanel.refreshPoker();
                        }
                        this.updatedizhuPoker();
                    },this.gameMain,100)
                }
                var game:DouDiZhuGame = DouDiZhuGameData.getCurrentGame();
                var room:Room = RoomData.getCurrentRoom();
                var detail = (room.aa?"AA支付,":"房主支付,")+(game.ruleType == 1?"仅三带一":"三带无限制") + game.maxCount +"局,速度来战！";
                Log.log(detail);
		    	WxUtils.customizeShareDesc(null,detail,true);
            }else if(this.gameMain != null){
                var fun:Function = this.gameMain.dataParse.tagEvents[tag];
                if(fun != null) fun.apply(this.gameMain.dataParse,[data]);
            }
        }
        /** 当界面大小变化 触发重新布局的操作 */
        public layout(): void{}
        /** 销毁游戏 */
        public dispose(): void{
            if(this.gameMain != null) this.gameMain.dispose();
        }

	}
}