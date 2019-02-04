const {inspect} = require("util");


module.exports = class modEval {
	constructor(client) {
		this.client = client;
		this.name = "eval";
		this.permissions = "owner";
		this.info = {
			category: "Hidden",
			usage: "<code>",
			info: "Evaluates JavaScript code."
		};
	}
	async command(msg, args) {
		if (!args.length) return msg.channel.send(":x: There is nothing to eval!");
		try {
			let ev = await eval(args);
			ev = inspect(ev);
			if (ev.length >= 1800) ev = ev.substring(0, 1800) + "\n[Rest of message cut out due to limitations]";
			msg.channel.send(`:inbox_tray: **Input**: \`\`\`js\n${args}\`\`\`\n:outbox_tray: **Output**\`\`\`js\n${ev}\`\`\``);
		} catch (err) {
			msg.channel.send(`:x: **ERROR**\`\`\`js\n${err.stack}\`\`\``);
		}
	}
};
