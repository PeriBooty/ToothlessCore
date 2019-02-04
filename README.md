# ToothlessCore [![Build Status](https://travis-ci.com/Immortalizd/ToothlessCore.svg?token=kcNPaLcKjg95hxCfJ9Nz&branch=master)](https://travis-ci.com/Immortalizd/ToothlessCore)

ToothlessCore is a Discord bot core written JavaScript using the discord.js library.

To use this for your own code, clone the repo and edit the `config.template.json` file.

The syntax for the commands are:

```js
module.exports = class modName {
	constructor(client) {
		this.client = client; // Required, don't change.
		this.name = "name"; // The name of the command
		this.permissions = "everyone"; // Limit what people can use the command. Available: everyone, mod, owner. You can change these and add more in Modules/PermissionChecker.js
		this.info = { // For the help command.
			category: "" // Input anything here to categorize the command.
			usage: "" // How to use the command, leave blank if the command is used by itself (like ping)
			info: "" // The info about the command.
		}
	}

	async command(msg, args) {} // This doesn't have to be async unless you're using asynchronous code inside. Also, args can be ommitted if not used.
}
```

# Contributions
If you know of a way to improve the code, feel free to send a PR. You can also look at the [Todo list](../../projects/1) to see if there are any issues you know how to fix.

# Legal info
lol there aren't any. just follow the license lol.