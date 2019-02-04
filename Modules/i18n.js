const Constants = require("./Constants");

module.exports = class i18n {
	constructor(client) {
		this.client = client;
		this.pattern = /({(\w+(\.?\w+?){0,})})/g;
		this.lang;
	}

	setLang(code) {
		this.lang = code;
	}

	translate(ctx, str) {
		let lang = this.client.database.prepare("SELECT langCode FROM Language WHERE guildID = ?").get(ctx.guild.id);
		if (!lang) lang = Constants.DEFAULT_LANG;
		this.setLang(lang);
		const langFile = require(`../Languages/${this.lang}.json`);
		if (!langFile[str]) return ":x: ERROR: String not found.";
		if (this.pattern.test(langFile[str])) {
			return this.parse(ctx, langFile[str]);
		}
		return langFile[str];
	}

	parse(ctx, str, ...args) {
		let tr = str.match(this.pattern);
		console.log(args);
		if (!tr) return str;
		for (let m of tr) {
			let f = m.match(/(\w+(\.?\w+?){0,})/)[0];
			let func = eval(f);
			str = str.replace(m, func);
		}
		return str;
	}

	_parse(ctx, str) {
		console.log(str.match(this.pattern));
		let tr = str.match(this.pattern)[0];
		let replace = this.findReplace(ctx, tr);
		let final = str.replace(this.pattern, replace);
		if (this.pattern.test(str)) {console.log(final); this.parse(ctx, final);}
		else return final;
	}

	msgTranslate(ctx, str) {
		return ctx.channel.send(this.translate(ctx, str));
	}

	findReplace(ctx, tr) {
		switch (true) {
			case tr.startsWith("{user"):
				return ctx.author[tr.substring(6, tr.length - 1)];
			case tr.startsWith("{guild"):
				return ctx.guild[tr.substring(7, tr.length - 1)];
			case tr.startsWith("{channel"):
				return ctx.channel[tr.substring(9, tr.length - 1)];
			default:
				return tr;
		}
	}

}