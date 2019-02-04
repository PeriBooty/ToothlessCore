const {owners} = require("../config.json");

module.exports = class modDelQuote {
	constructor(client) {
		this.client = client;
		this.name = "delquote";
		this.permissions = "everyone";
		this.aliases = ["dq", "delq"];
		this.info = {
			category: "Quotes",
			usage: "<tag name> <ID>",
			info: "Removes a quote."
		};
	}
	async command(msg, args) {
		if (!args.length) return msg.channel.send(this.client.cmdInfo.getCommandInfo(this.name));
		let quote = args.split(/ +/);
		let tag = quote.shift();
		let ID = quote.shift();
		try {
			let check = this.client.database.prepare("SELECT * FROM Quotes WHERE tag = ? AND ID = ?").get(tag, ID);
			if (!check) return msg.channel.send(":x: Quote not found");
			if (check.quoter === msg.author.id || owners.indexOf(msg.author.id) !== -1) {
				let query = this.client.database.prepare("DELETE FROM Quotes WHERE tag = ? AND ID = ?").run(tag, ID);
				msg.channel.send(":white_check_mark: Quote deleted.");
				this.client.events.log(`[DEBUG]: Changed ${query.changes} rows.`);
			}
			else if (check.quoter !== msg.author.id || owners.indexOf(msg.author.id) === -1) return msg.channel.send("You didn't quote this, and can therefore not delete it.");
		} catch (err) {
			msg.channel.send(":x: An error occurred...");
			this.client.events.log(err.stack, "error");
		}
	}
};
