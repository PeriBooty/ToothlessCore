module.exports = class modPing {
    constructor(client) {
        this.client = client;
        this.name = "ping";
        this.permissions = "everyone";
        this.info = {
            category: "Utility",
            usage: "",
            info: "Checks the Discord heartbeat and message latency."
        };
    }
	/* eslint-disable no-unused-vars */
	async command(msg, args) {
		const heartbeat = Math.round(this.client.ping);
		const timeThen = Date.now();
		msg.channel.send("Ping!").then(m => {
			m.edit(`Pong!\n**Heartbeat**: ${heartbeat} ms\n**Message latency**: ${Date.now() - timeThen} ms`);
		});
	}
};
