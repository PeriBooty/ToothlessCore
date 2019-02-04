module.exports = class modTestI18n {
	constructor(client) {
		this.client = client;
		this.name = "i18n";
		this.permissions = "owner";
		this.info = {
			category: "Debug",
			usage: "<phrase to test>",
			info: "Test the i18n feature."
		};
	}
	async command(msg, args) {
		if (!args.length) return msg.channel.send(this.client.cmdInfo.getCommandInfo(this.name));
		try {
			const translated = this.client.i18n.translate(msg, args);
			msg.channel.send(translated);
		} catch (e) {
			msg.channel.send("```js\n" + e.stack + "```");
		}
	}
};