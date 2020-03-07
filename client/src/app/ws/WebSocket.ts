import Socket from "lows";

class WebSocket {
	ws: Socket;
	isStart = false;

	constructor() {
		this.ws = new Socket();

		this.ws.config = {
			host: "http://127.0.0.1",
			port: "12389"
		};

		this.ws.onOpen = () => {
			console.log("on open");
			localStorage.setItem("status", "ready");
			window.location.hash = "#/index";
		};

		this.ws.onError = (err: any) => {
			console.log("on error", err);
		};

		this.ws.onClose = () => {
			localStorage.removeItem("status");
			window.location.hash = "#/login";
			console.log("on close");
		};
	}

	start() {
		!this.isStart && this.ws.start();
		this.isStart = true;
	}

	close() {
		this.isStart && this.ws.close();
		this.isStart = false;
	}

	listen(...args: any[]) {
		this.ws.addListener(...args);
	}

	remove(...args: any[]) {
		this.ws.removeListener(...args);
	}
}

export default new WebSocket();
