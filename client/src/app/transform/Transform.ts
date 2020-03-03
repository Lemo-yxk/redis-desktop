import { notification } from "antd";
import Tools from "../tools/Tools";
import Command from "../services/Command";

class Cmd {
	Cmd(...args: any[]) {}
}

class Transform {
	check(type: string): any {
		switch (type) {
			case "string":
				return new String();
			case "list":
				return new List();
			case "hash":
				return new Hash();
			case "set":
				return new Set();
			case "zset":
				return new ZSet();
			default:
				notification.error({ message: `Unsupported type ${type}` });
				return new Empty();
		}
	}

	select(serverName: string, type: string, key: string) {
		return this.do(serverName, key, this.check(type).select(key));
	}

	update(type: string, key: string) {}
	insert(type: string, key: string) {}
	delete(type: string, key: string) {}

	ttl(key: string) {
		return `TTL ${key}`;
	}

	expire(key: string, seconds: number) {
		return `EXPIRE ${key} ${seconds}`;
	}

	async do(serverName: string, key: string, cmd: string) {
		return await Command.do(serverName, key, cmd);
	}
}

class String {
	select(key: string) {
		return `GET ${key}`;
	}
	update(key: string, value: string) {
		return `SET ${key} ${value}`;
	}
	insert(key: string, value: string) {
		return `SET ${key} ${value}`;
	}
	delete(key: string) {
		return `DEL ${key}`;
	}
}
class List {
	select() {}
}
class Hash {
	select() {}
}
class Set {
	select() {}
}
class ZSet {
	select() {}
}
class Empty {
	select() {}
}

export default new Transform();
