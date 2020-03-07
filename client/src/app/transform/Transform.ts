import { notification } from "antd";
import Command from "../services/Command";

class Transform {
	check(type: string): any {
		switch (type) {
			case "string":
				return new RString();
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

	select(serverName: string, type: string, key: string, ...args: any[]) {
		return this.do(serverName, key, this.check(type).select(key, ...args));
	}

	update(serverName: string, type: string, key: string, value: any, ...args: any[]) {
		return this.do(serverName, key, this.check(type).update(key, value, ...args));
	}

	insert(serverName: string, type: string, key: string, value: any, ...args: any[]) {
		return this.do(serverName, key, this.check(type).insert(key, value, ...args));
	}

	delete(serverName: string, type: string, key: string, ...args: any[]) {
		return this.do(serverName, key, this.check(type).delete(key, ...args));
	}

	call(serverName: string, type: string, key: string, method: string, ...args: any[]) {
		return this.do(serverName, key, this.check(type)[method](key, ...args));
	}

	ttl(serverName: string, key: string) {
		return this.do(serverName, key, ["TTL", key]);
	}

	rename(serverName: string, key: string, newKey: string) {
		return this.do(serverName, key, ["RENAME", key, newKey]);
	}

	expire(serverName: string, key: string, seconds: number) {
		return this.do(serverName, key, ["EXPIRE", key, seconds]);
	}

	async doPipe(serverName: string, key: string, cmd: any[][]) {
		return await Command.doPipe(serverName, key, cmd);
	}

	async do(serverName: string, key: string, cmd: any[]) {
		return await Command.do(serverName, key, cmd);
	}
}

class RString {
	select(key: string) {
		return ["GET", key];
	}
	update(key: string, value: string) {
		return ["SET", key, value];
	}
	insert(key: string, value: string) {
		return ["SET", key, value];
	}
	delete(key: string) {
		return ["DEL", key];
	}
}
class List {
	len(key: string) {
		return ["LLEN", key];
	}

	insert(key: string, value: string) {
		return ["LPUSH", key, value];
	}

	select(key: string, page: number, size: number) {
		let skip = (page - 1) * size;
		return ["LRANGE", key, skip, size * page - 1];
	}

	update(key: string, index: number, value: string) {
		return ["LSET", key, index, value];
	}

	delete(key: string, value: string) {
		return ["LREM", key, 0, value];
	}

	remove(key: string) {
		return ["DEL", key];
	}
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
