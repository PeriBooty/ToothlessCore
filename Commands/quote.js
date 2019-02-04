module.exports = class modQuote {
	constructor(client) {
		this.client = client;
		this.name = "quote";
		this.permissions = "everyone";
		this.aliases = ["q"];
		this.info = {
			category: "Quotes",
			usage: "<tag name> [ID]",
			info: "Checks a quote."
		};
	}
	async command(msg, args) {
		if (!args.length) return msg.channel.send(this.client.cmdInfo.getCommandInfo(this.name));
		let idarr = args.split(/ +/);
		let tag = idarr.shift();
		let id;
		let rowWithID;
		if (idarr) id = parseInt(idarr.join(" "));
		if (id) {
			try {
				rowWithID = this.client.database.prepare("SELECT * FROM Quotes WHERE tag = ? AND ID = ?").get(tag, id);
				if (rowWithID === undefined) return msg.channel.send(":x: Tag or ID not found.");
				return msg.channel.send(`**Quote ID: ${rowWithID.ID}**\n${rowWithID.quote}`);
			} catch (e) {
				this.client.events.log(e.stack, "error");
				return msg.channel.send(":x: An error occurred..");
			}
		} else {
			try {
				const row = this.client.database.prepare("SELECT * FROM Quotes WHERE tag = ?").all(tag);
				let final = [];
				for (let i in row) {
					if (row[i] != undefined) final.push(row[i]);
				}
				if (!final.length) return msg.channel.send(":x: Tag not found");
				const rnd = Math.floor(Math.random() * final.length);
				return msg.channel.send(`**Quote ID: ${final[rnd].ID}**\n${final[rnd].quote}`);
			} catch (e) {
				this.client.events.log(e.stack, "error");
				return msg.channel.send(":x: An error occurred...");
			}
		}
	}
};
