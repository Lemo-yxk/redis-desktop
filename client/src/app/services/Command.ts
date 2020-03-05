import { config } from "../interface/config";
import Axios from "axios";
import Qs from "querystring";
import Tools from "../tools/Tools";

class Command {
	async register(type: string, config: config) {
		return await Axios.post(`/redis/register/${type}`, Qs.stringify(config as any));
	}

	async disconnect(serverName: string) {
		return await Axios.post(`/redis/db/disconnect`, Qs.stringify({ name: serverName }));
	}

	async selectDB(serverName: string, db: any) {
		return await Axios.post(`/redis/db/select`, Qs.stringify({ name: serverName, db }));
	}

	async scan(serverName: string) {
		let response = await Axios.post(`/redis/db/scan`, Qs.stringify({ name: serverName }));
		return response.data.msg;
	}

	async type(serverName: string, key: string) {
		let response = await Axios.post(`/redis/key/type`, Qs.stringify({ name: serverName, key: key }));
		return response.data.msg;
	}

	async do(serverName: string, key: string, ...args: any[]) {
		let response = await Axios.post(
			`/redis/key/do`,
			Qs.stringify({
				name: serverName,
				key: key,
				args: args.join(" ")
			})
		);

		if (response.data.code !== 200) {
			return Tools.Notification(response);
		}

		return response.data.msg;
	}

	async doPipe(serverName: string, key: string, ...args: any[]) {
		let response = await Axios.post(
			`/redis/key/do`,
			Qs.stringify({
				name: serverName,
				key: key,
				args: JSON.stringify(args)
			})
		);

		if (response.data.code !== 200) {
			return Tools.Notification(response);
		}

		return response.data.msg;
	}
}

export default new Command();
