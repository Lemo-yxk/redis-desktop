import { config } from "../../interface/config";

class Config {
	getCurrent() {
		return JSON.parse(localStorage.getItem("current") || "{}");
	}

	setCurrent(cfg: config) {
		localStorage.setItem("current", JSON.stringify(cfg));
	}

	all() {
		return JSON.parse(localStorage.getItem("config") || "{}");
	}

	get(name: string): config {
		let cfg = JSON.parse(localStorage.getItem("config") || "{}");
		return cfg[name];
	}

	set(name: string, config: config) {
		let cfg = JSON.parse(localStorage.getItem("config") || "{}");
		cfg[name] = config;
		localStorage.setItem("config", JSON.stringify(cfg));
	}

	delete(name: string) {
		let cfg = JSON.parse(localStorage.getItem("config") || "{}");
		delete cfg[name];
		localStorage.setItem("config", JSON.stringify(cfg));
	}

	clear() {
		localStorage.removeItem("config");
	}
}

export default new Config();
