const config = require("../config.json");


module.exports = class PermissionChecker {
	constructor() {}
	check(member, commandLevel) {
		let userAllowed = false;
		switch (commandLevel) {
			case "everyone":
				userAllowed = true;
				break;
			case "admin":
				member.roles.map(role => {
					if (role.name.startsWith("Admin") || role.hasPermission(402661526) || role.hasPermission(8))
						userAllowed = true;
				});
				break;
			case "owner":
				config.owners.map(o => {
					if (member.id === o) userAllowed = true;
				});
				break;
			default:
				userAllowed = false;
				break;
		}
		if (typeof commandLevel === Number) {
			member.roles.map(role => {
				if (role.hasPermission(commandLevel) || role.hasPermission(8))
					userAllowed = true;
			});
		}
		return userAllowed;
	}
};
