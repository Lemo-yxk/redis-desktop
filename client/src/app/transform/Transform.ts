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

	select(type: string, key: string, ...args: any[]) {
		return this.do(key, this.check(type).select(key, ...args));
	}

	update(type: string, key: string, value: any, ...args: any[]) {
		return this.do(key, this.check(type).update(key, value, ...args));
	}

	insert(type: string, key: string, value: any, ...args: any[]) {
		return this.do(key, this.check(type).insert(key, value, ...args));
	}

	delete(type: string, key: string, ...args: any[]) {
		return this.do(key, this.check(type).delete(key, ...args));
	}

	call(type: string, key: string, method: string, ...args: any[]) {
		return this.do(key, this.check(type)[method](key, ...args));
	}

	ttl(key: string) {
		return this.do(key, ["TTL", key]);
	}

	rename(key: string, newKey: string) {
		return this.do(key, ["RENAME", key, newKey]);
	}

	expire(key: string, seconds: number) {
		return this.do(key, ["EXPIRE", key, seconds]);
	}

	async doPipe(key: string, cmd: any[][]) {
		return await Command.doPipe(key, cmd);
	}

	async do(key: string, cmd: any[]) {
		return await Command.do(key, cmd);
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
	select(key: string, curser: number) {
		return ["HSCAN", key, curser, "COUNT", 10000];
	}

	len(key: string) {
		return ["HLEN", key];
	}

	update(key: string, k: string, v: string) {
		return ["HSET", key, k, v];
	}

	insert(key: string, k: string, v: string) {
		return ["HSET", key, k, v];
	}

	delete(key: string, k: string) {
		return ["HDEL", key, k];
	}

	remove(key: string) {
		return ["DEL", key];
	}
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
