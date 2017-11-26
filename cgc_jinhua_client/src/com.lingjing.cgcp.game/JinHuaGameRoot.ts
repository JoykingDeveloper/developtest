module lj.cgcp.game.jinhua {
	export class JinHuaGameRoot extends ExtGame {

        public gameMain:GamePanel;

		public constructor() {
			super();
		}

		/** 初始化房间 */
        public onInit(room:Room,roles:any){
            JinHuaRoleData.saveRoles(roles);
            ExtGameHelper.setBackGroundColor(0x187B59);
		}
        /** 有玩家加入房间 */
        public onJoinRoom(data: any): void{
            var roles:any = data.roles;
            JinHuaRoleData.saveRoles(roles);
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
            if(roleHead){
                roleHead.leaveState.visible = false;
            }
        }
        /** 玩家离线 */
        public onLeaveGame(data: any): void{
            var uid:string = data.sender;
            var roleHead:RoleHead = this.gameMain.roleHeads[this.gameMain.getRoleIndex(uid)];
            if(roleHead){
                  roleHead.leaveState.visible = true;
            }
        }
        /** 解散房间 */
        public onDisbandRoom(data: any): void{}
        /** 收到游戏消息 */
        public onGameMessage(data: any): void{
            var tag:string = data.tag;
            if(tag == "initGame"){
                JinHuaGameData.putCurrentGame(data.game);
                JinHuaGameData.putCards(data.card);
                this.gameMain = new GamePanel();
                this.addChild(this.gameMain);

                var game:JinHuaGame = JinHuaGameData.getCurrentGame();
                var detail = "AA支付," + game.maxCount +"局,速度来战！"
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