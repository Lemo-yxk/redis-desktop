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
		};

		this.ws.onError = (err: any) => {
			console.log("on error", err);
		};

		this.ws.onClose = () => {
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
}

export default new WebSocket();
