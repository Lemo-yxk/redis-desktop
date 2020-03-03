import { config } from "../interface/config";
import Axios from "axios";
import Tools from "../tools/Tools";

class Command {
	async register(type: string, config: config) {
		return await Axios.post(`/redis/register/${type}`, Tools.QueryString(config as any));
	}

	async selectDB(serverName: string, db: any) {
		return await Axios.post(`/redis/db/select`, Tools.QueryString({ name: serverName, db }));
	}

	async scan(serverName: string) {
		let response = await Axios.post(`/redis/db/scan`, Tools.QueryString({ name: serverName }));
		return response.data.msg;
	}

	async type(serverName: string, key: string) {
		let response = await Axios.post(`/redis/key/type`, Tools.QueryString({ name: serverName, key: key }));
		return response.data.msg;
	}

	async do(serverName: string, key: string, ...args: any[]) {
		let response = await Axios.post(
			`/redis/key/do`,
			Tools.QueryString({
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
}

export default new Command();
