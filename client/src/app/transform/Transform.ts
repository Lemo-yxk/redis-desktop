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

	update(serverName: string, type: string, key: string, value: string) {
		return this.do(serverName, key, this.check(type).update(key, value));
	}

	insert(serverName: string, type: string, key: string, value: string) {
		return this.do(serverName, key, this.check(type).insert(key, value));
	}

	delete(serverName: string, type: string, key: string) {
		return this.do(serverName, key, this.check(type).delete(key));
	}

	ttl(serverName: string, key: string) {
		return this.do(serverName, key, `TTL ${key}`);
	}

	rename(serverName: string, key: string, newKey: string) {
		return this.do(serverName, key, `RENAME ${key} ${newKey}`);
	}

	expire(serverName: string, key: string, seconds: number) {
		return this.do(serverName, key, `EXPIRE ${key} ${seconds}`);
	}

	async doPipe(serverName: string, key: string, ...cmd: string[]) {
		return await Command.doPipe(serverName, key, ...cmd);
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
