const Discord = require("discord.js");
const events = require("./Modules/Events");
const i18n = require("./Modules/i18n");
const CommandInfo = require("./Modules/CommandInfo");
const {token} = require("./config.json");
const Database = require("better-sqlite3");


/* eslint-disable no-undef */
new class Client extends Discord.Client {
    constructor() {
        super({disableEveryone: true});

		this.commands = new Map();
		this.dmId = new Map();
		this.cmdInfo = new CommandInfo(this);
        this.i18n = new i18n(this);
		this.database = new Database("Toothless.sqlite");
        this.events = new events(this);
        this.on("ready", () => {
            this.events.ready();
        });
        this.on("message", msg => {
            this.events.message(msg);
        });
		this.on("raw", raw => {
			this.events.raw(raw);
		});
		this.on("messageReactionAdd", (reaction, user) => {
			this.events.messageReactionAdd(reaction, user);
		});
		this.on("messageReactionRemove", (reaction, user) => {
			this.events.messageReactionRemove(reaction, user);
		});
        this.on("error", err => {
            console.error(err);
        });
        this.on("warn", warn => {
            console.warn(warn);
        });
        this.login(token);
    }
};

process.on("unhandledRejection", err => console.error(err));
