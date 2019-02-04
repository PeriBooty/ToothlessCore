module.exports = class modAddQuote {
	constructor(client) {
		this.client = client;
		this.name = "addquote";
		this.permissions = "everyone";
		this.aliases = ["aq", "addq"];
		this.info = {
			category: "Quotes",
			usage: "<tag name> <quote>",
			info: "Adds a quote."
		};
	}
	async command(msg, args) {
		if (!args.length) return msg.channel.send(this.client.cmdInfo.getCommandInfo(this.name));
		let quote = args.split(/ +/);
		let tag = quote.shift();
		let quotes = this.client.database.prepare("SELECT * FROM Quotes WHERE tag = ?").all(tag);
		let highest;
		highest = quotes.length ? quotes[quotes.length -1].ID : 0;
		quote = quote.join(" ");
		try {
			let query = this.client.database.prepare("INSERT INTO Quotes VALUES (?, ?, ?, ?)").run(tag, quote, ++highest, msg.author.id);
			msg.channel.send(this.client.i18n.translate("quote.added") + highest);
			this.client.events.log(`[DEBUG]: Changed ${query.changes} rows.`);
		} catch (err) {
			this.client.i18n.msgTranslate("quote.error");
			this.client.events.log(err.stack, "error");
		}
	}
};
