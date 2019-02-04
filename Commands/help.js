String.prototype.toTitleCase = function() {
	return this.split(/ +/).map(str => str.replace(/^./, c => c.toUpperCase())).join(" ");
};

const {prefix} = require("../config.json");
const {RichEmbed} = require("discord.js");
const PermissionChecker = require("../Modules/PermissionChecker");
const permissions = new PermissionChecker();


module.exports = class modHelp {
    constructor(client) {
        this.client = client;
        this.name = "help";
        this.permissions = "everyone";
        this.info = {
            category: "Info",
            usage: "[command]",
            info: "Shows help for the different commands."
        };
    }
	async command(msg, args) {
		const hidden = ["Hidden"];
		const admin = ["Admin"];
		const embed = new RichEmbed();
		if (!args.length) {
			let commandsByCategory = Array.from(this.client.commands).reduce((categories, cmdArr) => {
				let [name, command] = cmdArr;
				let {category, usage, info} = (new command(this.client)).info;

				if (!categories[category]) {
					categories[category] = [];
				}
				categories[category].push({name, usage, info});
				return categories;
			}, {});
			Object.keys(commandsByCategory).forEach(key => {
                if (hidden.indexOf(key) !== -1 && !permissions.check(msg.member, "admin")) {
                  return;
                }
				if (admin.indexOf(key) !== -1 && !(permissions.check(msg.member, "admin") || permissions.check(msg.member, "owner"))) {
					return;
				}
                let field = {name: key, commands: []};
                commandsByCategory[key].forEach(({name}) => {
                    field.commands.push(`**\`${name}\`**`);
                });
                embed.addField(field.name, field.commands.join(", "));
            });
			embed.setColor(0xff69b4);
			embed.setAuthor(`${this.client.user.username} – Help`, this.client.user.avatarURL);
			embed.setFooter(`For more info, do ${prefix}${this.name} <command>`);
			msg.channel.send(embed);
		} else {
			const cmd = this.client.cmdInfo.getCommandInfo(args);
			if (!cmd) return msg.channel.send("Command not found.");
			msg.channel.send(cmd);
		}
	}
};
