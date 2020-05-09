import {config} from "../../interface/config";

class Config {

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

    getAllConfig() {
        return JSON.parse(localStorage.getItem("config") || "{}");
    }

    setAllConfig(configs: { [key: string]: config }) {
        localStorage.setItem("config", JSON.stringify(configs));
    }

    deleteAllConfig() {
        localStorage.removeItem("config");
    }

    clear() {
        localStorage.clear();
    }
}

export default new Config();
