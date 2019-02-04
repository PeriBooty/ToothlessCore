String.prototype.toTitleCase = function() {
	return this.split(/ +/).map(str => str.replace(/^./, c => c.toUpperCase())).join(" ");
};
const {RichEmbed: Embed} = require("discord.js");
const {prefix} = require("../config.json");

module.exports = class CommandInfo {
	constructor(client) {
		this.client = client;
	}
	/**
	  * @returns {RichEmbed || Boolean}
	  */
	getCommandInfo(commandName) {
		let command = this.client.commands.get(commandName);
		let aliases = new command(this.client).aliases;
		if (!command) return false;
		const embed = new Embed();
		const cmd = new command(this.client);
		embed.setTitle(cmd.name.toTitleCase())
			.setColor(0xff69b4)
			.addField("Description", cmd.info.info)
			.addField("Category", cmd.info.category, true)
			.addField("Permission", cmd.permissions.toTitleCase(), true);
		if (aliases) embed.addField("Aliases", aliases.join(", "));
		embed.addField("Usage", `\`\`\`css\n${prefix}${cmd.name} ${cmd.info.usage}\`\`\``);
		return embed;
	}
};
