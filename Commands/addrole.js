module.exports = class modAddRole {
	constructor(client) {
		this.client = client;
		this.name = "addrole";
		this.permissions = "admin";
		this.info = {
			category: "Admin",
			usage: "<user> <role name>",
			info: "Adds a role to a user."
		};
	}
	async command(msg, args) {
		if (!args.length) return msg.channel.send(this.client.cmdInfo.getCommandInfo(this.name));
		const _args = args.split(/ +/);
		let u = _args[0];
		if (/<@[!]?[0-9]{17,18}>/.test(u)) u = u.replace(/^<@[!]?/, "").replace(/>$/, "");
		const user = msg.guild.members.get(u);
		let __args = "";
		for (let i = 1; i < _args.length; i++) __args += (_args[i] + " ");
		__args = __args.trim();
		const role = msg.guild.roles.find("name", __args);
		if (!role) return msg.channel.send("Invalid role.");
		user.addRole(role, "[AddRole]").then(() => {
			msg.channel.send(`:white_check_mark: Added ${role.name} to ${user.user.username}!`).then(m => {
				m.delete(5000);
				msg.delete(5000);
			});
		}).catch(e => {
			/* eslint-disable no-undef */
			msg.channel.send("An error occurred! This has been logged.");
			console.log(e.stack);
		});
	}
};
