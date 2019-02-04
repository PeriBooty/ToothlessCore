const {DiscordAPIError} = require("discord.js");

module.exports = class modTestI18n {
	constructor(client) {
		this.client = client;
		this.name = "parse";
		this.permissions = "owner";
		this.info = {
			category: "Debug",
			usage: "<phrase to test>",
			info: "Test the i18n parser."
		};
	}
	async command(msg, args) {
		if (!args.length) return msg.channel.send(this.client.cmdInfo.getCommandInfo(this.name));
		try {
			const test1 = "test";
			const test2 = this.client.ping;
			const parsed = this.client.i18n.parse(msg, args, test1, test2);
			msg.channel.send(parsed).catch(e => {
				if (e instanceof DiscordAPIError)
					msg.channel.send("```js\n" + e.stack + "```");
				else msg.channel.send("```js\n" + e.stack + "```");
			});
		} catch (e) {
			msg.channel.send("```js\n" + e.stack + "```");
		}
	}
};