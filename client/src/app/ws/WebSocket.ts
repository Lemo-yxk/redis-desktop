import Socket from "lows";
import Event from "../event/Event";

class WebSocket {
    ws: Socket;
    isStart = false;

    constructor() {
        this.ws = new Socket({
            host: "http://127.0.0.1",
            port: "12389",
        });

        this.ws.Global = {};

        this.ws.OnOpen = () => {
            console.log("on open");
            this.ws.Emit("/react/system/login", {});
        };

        this.ws.AddListener("/react/system/login", (e: any, data: any) => {
            Event.emit("ready", true)
        });

        this.ws.OnError = (err: any) => {
            console.log("on error", err);
        };

        this.ws.OnClose = () => {
            Event.emit("ready", false)
            console.log("on close");
        };
    }

    start(fn?: any) {
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
