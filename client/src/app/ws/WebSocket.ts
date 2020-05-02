import Socket from "lows";
import Config from "../components/config/Config";

class WebSocket {
    ws: Socket;
    isStart = false;

    constructor() {
        this.ws = new Socket({
            host: "http://127.0.0.1",
            port: "12389"
        });

        this.ws.Global = {uuid: Config.getUUID()};

        this.ws.OnOpen = () => {
            console.log("on open");
            this.ws.Emit("/redis/login/login", {});
        };

        this.ws.AddListener("/redis/login/login", (e: any, data: any) => {
            Config.setStatus("ready");
            window.location.hash = "#/index";
        });

        this.ws.OnError = (err: any) => {
            console.log("on error", err);
        };

        this.ws.OnClose = () => {
            Config.delStatus();
            window.location.hash = "#/login";
            console.log("on close");
        };
    }

    start(fn: any) {
        !this.isStart && this.ws.Start(fn);
        this.isStart = true;
    }

    close() {
        this.isStart && this.ws.Close();
        this.isStart = false;
    }

    listen(...args: any[]) {
        this.ws.AddListener(...args);
    }

    remove(...args: any[]) {
        this.ws.RemoveListener(...args);
    }
}

export default new WebSocket();
