const {RichEmbed: re} = require("discord.js");
const Constants = require("../Modules/Constants");

module.exports = class modInfo {
	constructor(client) {
		this.client = client;
		this.name = "info";
		this.permissions = "everyone";
		this.info = {
			category: "Info",
			usage: "[username | mention | id]",
			info: "Shows info about a current user, or yourself if used empty."
		};
	}
	command(msg, args) {
		if (!args) return this.getUser(msg, msg, "self");
		let u = args;
		if (/<@[!]?[0-9]{17,18}>/.test(u)) u = u.replace(/^<@[!]?/, "").replace(/>$/, "");
		if (parseInt(u)) {
			const user = msg.guild.members.get(u);
			if (!user) {
				try {
					this.client.fetchUser(u).then(m => {
						this.getUser(msg, m, "out_of_guild");
					}).catch(() => {
						return msg.channel.send(":x: Can't find user.");
					});
				} catch (_) {
					return msg.channel.send(":x: Can't find user.");
				}
			} else this.getUser(msg, user, "in_guild");
		} else {
			const user = msg.guild.members.find(m => m.user.tag.toLowerCase().includes(args.toLowerCase()));
			if (!user) return msg.channel.send(":x: Can't find user.");
			const usr = msg.guild.members.get(user.user.id);
			try {
				this.getUser(msg, usr, "in_guild");
			} catch (_) {
				return msg.channel.send(":x: Can't find user.");
			}
		}
	}
	getUser(msg, user, type) {
		switch (type) {
			case "in_guild": {
				const status = user.user.presence.status.toUpperCase();
				const embed = new re()
					.setTitle(`User info | ${Constants.EMOTES[status]}`)
					.setColor(Constants.COLORS[status])
					.setThumbnail(user.user.avatarURL)
					.addField("Tag", user.user.tag, true)
					.addField("ID", user.user.id, true)
					.addField("Nickname", user.nickname ? user.nickname : "None", true)
					.addField("Joined", user.joinedAt.toLocaleString(), true)
					.addField("Created", user.user.createdAt.toLocaleString(), true);
				if (user.user.presence.game) {
					if (user.user.presence.game.type === 0)
						embed.addField("Game", user.user.presence.game ? user.user.presence.game.name : "None", true);
					if (user.user.presence.game.type === 1)
						embed.addField("Watching", user.user.presence.game.name, true);
					if (user.user.presence.game.type === 2)
						embed.addField("Listening to", user.user.presence.game.name, true);
					if (user.user.presence.game.type === 3)
						embed.addField("Streaming", `[${user.user.presence.game.name}](${user.user.presence.game.url})`);
				}
				msg.channel.send(embed);
				break;
			}
			case "out_of_guild": {
				const embed = new re()
					.setTitle("User info")
					.setThumbnail(user.avatarURL)
					.addField("Tag", user.tag, true)
					.addField("ID", user.id, true);
				msg.channel.send(embed);
				break;
			}
			case "self": {
				const status = user.author.presence.status.toUpperCase();
				const embed = new re()
					.setTitle(`User info | ${Constants.EMOTES[status]}`)
					.setColor(Constants.COLORS[status])
					.setThumbnail(user.author.avatarURL, true)
					.addField("Tag", user.author.tag, true)
					.addField("ID", user.author.id, true)
					.addField("Nickname", user.member.nickname ? user.member.nickname : "None", true)
					.addField("Joined", user.member.joinedAt.toLocaleString(), true)
					.addField("Created", user.author.createdAt.toLocaleString(), true);
				if (user.author.presence.game) {
					if (user.author.presence.game.type === 0)
						embed.addField("Game", user.author.presence.game ? user.author.presence.game.name : "None", true);
					if (user.author.presence.game.type === 1)
						embed.addField("Watching", user.author.presence.game.name, true);
					if (user.author.presence.game.type === 2)
						embed.addField("Listening to", user.author.presence.game.name, true);
					if (user.author.presence.game.type === 3)
						embed.addField("Streaming", `[${user.author.presence.game.name}](${user.author.presence.game.url})`);
				}
				msg.channel.send(embed);
				break;
			}
		}
	}
};
