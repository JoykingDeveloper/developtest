module lj.cgcp.game.doudizhu {
	export class DouDiZhuRoleData {

		public static saveRoles(roles:any):void{
			ExtGameHelper.saveRAMData("doudizhu_roles",roles);
		}
		
		public static getRoles():any{
			return ExtGameHelper.getRAMData("doudizhu_roles");
		}

		public static saveRole(role:Role):void{
			var roles:any = DouDiZhuRoleData.getRoles();
			if(roles == null){
				roles = {};
			}
			roles[role.uid] = role;
			DouDiZhuRoleData.saveRoles(roles);
		}

		public static getRole(uid:string):Role{
			var roles:any = DouDiZhuRoleData.getRoles();
			if(roles == null){
				return null;
			}
			return roles[uid];
		}

	}
}