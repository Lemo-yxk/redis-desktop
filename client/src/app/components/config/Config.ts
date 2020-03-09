import { config } from "../../interface/config";

class Config {
	getCurrent() {
		return JSON.parse(localStorage.getItem("current") || "{}");
	}

	setCurrent(cfg: config) {
		localStorage.setItem("current", JSON.stringify(cfg));
	}

	delCurrent() {
		localStorage.removeItem("current");
	}

	setServerName(setServerName: string) {
		localStorage.setItem("serverName", setServerName);
	}

	getServerName() {
		return localStorage.getItem("serverName");
	}

	delServerName() {
		localStorage.removeItem("serverName");
	}

	setDB(db: number) {
		localStorage.setItem("db", `${db}`);
	}

	getDB() {
		let db = localStorage.getItem("db");
		if (!db) return null;
		return parseInt(db);
	}

	delDB() {
		localStorage.removeItem("db");
	}

	setStatus(status: any) {
		localStorage.setItem("status", status);
	}

	getStatus() {
		return localStorage.getItem("status");
	}

	delStatus() {
		localStorage.removeItem("status");
	}

	createUUID() {
		localStorage.setItem(
			"uuid",
			Math.random()
				.toString(16)
				.slice(2)
		);
	}

	getUUID() {
		return localStorage.getItem("uuid");
	}

	allConfig() {
		return JSON.parse(localStorage.getItem("config") || "{}");
	}

	getConfig(name: string): config {
		let cfg = JSON.parse(localStorage.getItem("config") || "{}");
		return cfg[name];
	}

	setConfig(name: string, config: config) {
		let cfg = JSON.parse(localStorage.getItem("config") || "{}");
		cfg[name] = config;
		localStorage.setItem("config", JSON.stringify(cfg));
	}

	deleteConfig(name: string) {
		let cfg = JSON.parse(localStorage.getItem("config") || "{}");
		delete cfg[name];
		localStorage.setItem("config", JSON.stringify(cfg));
	}

	deleteAllConfig() {
		localStorage.removeItem("config");
	}

	clear() {
		localStorage.clear();
	}
}

export default new Config();
