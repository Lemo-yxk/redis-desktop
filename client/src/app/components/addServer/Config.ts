interface config {
	host: string;
	port: string;
	password: string;
	name: string;
	master: string;
}

class Config {
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
