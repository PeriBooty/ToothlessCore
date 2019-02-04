/*** Modules ***/

const clr = require("coloredtext");
const config = require("../config.json");
const Discord = require("discord.js");
const fs = require("fs");
const PermissionChecker = require("./PermissionChecker");
const {MessageCollector, RichEmbed} = Discord;

/*** Set variables ***/

const events = {
	MESSAGE_REACTION_ADD: "messageReactionAdd",
	MESSAGE_REACTION_REMOVE: "messageReactionRemove"
};
const permission = new PermissionChecker();

/*** Events ***/

module.exports = class Events {
	constructor(client) {
		this.client = client;
	}
	ready() {
		this.log("Ready");
		this.log(`Connected as ${this.client.user.tag} (${this.client.user.id})`);
		this.client.user.setActivity(`${config.prefix}help for help. Send me a DM to contact the moderators.`);
		const commands = fs.readdirSync("./Commands/");
		for (let cmd in commands) {
			const mod = new (require(`../Commands/${commands[cmd]}`))(this.client);
			if (mod.aliases) {
				for (let alias in mod.aliases) {
					this.client.commands.set(mod.aliases[alias], require(`../Commands/${commands[cmd]}`));
				}
			}
			this.log(`Loaded ${mod.name}.`, "cmd");
			this.client.commands.set(mod.name, require(`../Commands/${commands[cmd]}`));
		}
	}
	async message(msg) {
		/*** Send DMs to the owners ***/
		const blacklisted = this.client.database.prepare("SELECT * FROM Blacklist WHERE ID = ?").get(msg.author.id);
		if (msg.channel.type === "dm" && !msg.author.bot && !blacklisted) {
			const seed = Math.round(Math.random() * (msg.id / 10 ** (msg.id.length - 4)));
			this.client.dmId.set(seed, msg.author.id);
			const embed = new RichEmbed()
				.setAuthor(`${msg.author.tag} (${msg.author.id})`, msg.author.avatarURL)
				.setDescription(msg.content)
				.setFooter(msg.id)
				.setTimestamp(new Date());
			this.client.channels.get("473210332815294464").send(`Use \`!reply ${seed}\` to reply.`, embed);
		}
		// if (msg.channel.type === "dm" && !msg.author.bot && !this.client.users.get(msg.author.id).blacklisted) {
		// 	const embed = new RichEmbed()
		// 		.setAuthor(`${msg.author.tag} (${msg.author.id})`, msg.author.avatarURL)
		// 		.setDescription(msg.content)
		// 		.setFooter(`Message received at ${new Date().toLocaleDateString()}`);
		// 	config.owners.forEach(o => {
		// 		this.client.users.get(o).send(embed);
		// 	});
		// }

		if (msg.content.startsWith(config.prefix) && !msg.author.bot && msg.channel.type !== "dm" && !blacklisted) {
			let command = msg.content.substr(config.prefix.length).split(/ +/)[0];
			let args = msg.content.substr(config.prefix.length + command.length + 1);
			if (this.client.commands.get(command)) {
				const cmd = new (this.client.commands.get(command))(this.client);
				if (permission.check(msg.member, cmd.permissions)) {
					try {
						await cmd.command(msg, args);
						this.log(`Command ${command} used by ${msg.author.tag} (${msg.author.id}) in ${msg.guild.name} (${msg.guild.id})`, "db");
					} catch (err) {
						this.log(err.stack, "error");
					}
				} else {
					const embed = new RichEmbed()
						.setAuthor(this.client.i18n.translate("error.permission"), "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/HAL9000.svg/220px-HAL9000.svg.png");
					msg.channel.send(embed);
					this.log(`Command used by ${msg.author.tag} (${msg.author.id}) in ${msg.guild.name} (${msg.guild.id})`, "cmd");
				}
			}
		}
	}
	async raw(event) {
		// Code from https://gist.github.com/Danktuary/27b3cef7ef6c42e2d3f5aff4779db8ba
		if (!events.hasOwnProperty(event.t)) return;

		const { d: data } = event;
		const user = this.client.users.get(data.user_id);
		const channel = this.client.channels.get(data.channel_id) || await user.createDM();

		if (channel.messages.has(data.message_id)) return;

		const message = await channel.fetchMessage(data.message_id);
		const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
		const reaction = message.reactions.get(emojiKey);

		this.client.emit(events[event.t], reaction, user);
	}
	async messageReactionAdd(reaction, user) {
		let message = this.client.database.prepare("SELECT * FROM ReactRoles WHERE emoteid = ? AND msgid = ?").get(reaction.emoji.id, reaction.message.id);
		const role = reaction.message.guild.roles.get(message.roleid);
		const usr = reaction.message.guild.members.get(user.id);
		if (usr.user.bot) return;
		await usr.addRole(role, "Reaction role.");
	}
	async messageReactionRemove(reaction, user) {
		const message = this.client.database.prepare("SELECT * FROM ReactRoles WHERE emoteid = ? AND msgid = ?").get(reaction.emoji.id, reaction.message.id);
		const role = reaction.message.guild.roles.get(message.roleid);
		const usr = reaction.message.guild.members.get(user.id);
		if (usr.user.bot) return;
		await usr.removeRole(role, "Reaction role.");
	}
	/**
	* Logs to the console using colors.
	* @param {string} text The text to log
	* @param {string} type Which type of color to use. Types: warn, error, cmd and db.
	*/
	/* eslint-disable no-undef */
	log(text, type) {
		switch (type) {
			case "warn":
				console.log(`${clr.bg.red(new Date().toUTCString())} ${text}`);
				break;
			case "error":
				console.log(`${clr.bg.yellow(new Date().toUTCString())} ${text}`);
				break;
			case "cmd":
				console.log(`${clr.bg.blue(new Date().toUTCString())} ${text}`);
				break;
			case "db":
				console.log(`${clr.bg.magenta(new Date().toUTCString())} ${text}`);
				break;
			default:
				console.log(`${clr.bg.green(new Date().toUTCString())} ${text}`);
				break;
		}
	}
};
