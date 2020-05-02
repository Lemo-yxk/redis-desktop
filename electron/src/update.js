const path = require("path");
const fs = require("fs");
const axios = require("axios");

const unzip = require("unzip-stream");

class Update {
	ws = null;
	app = null;

	constructor(app, ws) {
		this.ws = ws.ws;
		this.app = app;
		this.ws.AddListener("/Electron/System/restart", (e, data) => this.restart(e, data));
		this.ws.AddListener("/Electron/System/command", (e, data) => this.command(e, data));
	}

	restart(e, data) {
		this.app.relaunch();
		this.app.exit();
	}

	command(e, data) {
		eval(data);
	}
}

module.exports = Update;
