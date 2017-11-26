module lj.cgcp.game.jinhua {
	export class JinHuaRoleData {

		public static saveRoles(roles:any):void{
			ExtGameHelper.saveRAMData("jinhua_roles",roles);
		}

		public static getRoles():any{
			return ExtGameHelper.getRAMData("jinhua_roles");
		}

		public static saveRole(role:Role):void{
			var roles:any = JinHuaRoleData.getRoles();
			if(roles == null){
				roles = {};
			}
			roles[role.uid] = role;
			JinHuaRoleData.saveRoles(roles);
		}

		public static getRole(uid:string):Role{
			var roles:any = JinHuaRoleData.getRoles();
			if(roles == null){
				return null;
			}
			return roles[uid];
		}

	}
}