import { notification, message } from "antd";
import Layer from "../components/layer/Layer";
class Tools {
	QueryString(data: { [key: string]: string }) {
		let s = "";
		for (const key in data) {
			s += `${key}=${data[key]}&`;
		}
		return s.slice(0, -1);
	}

	Range(begin: number, end: number): number[] {
		let res = [];
		for (let index = begin; index < end; index++) {
			res.push(index);
		}
		return res;
	}

	Notification(response: any, success?: any, error?: any) {
		if (response.isAxiosError) {
			let error = response.toJSON();
			console.log(error);
			notification.error({ message: error.message });
			message.destroy();
			Layer.close();
			throw error;
		}
		success = success || response.data.msg;
		error = error || response.data.msg;
		if (response.data.code === 200) {
			console.log(response.data);
			notification.success({ message: success });
			return true;
		} else {
			notification.error({ message: error });
			return false;
		}
	}

	IsFloat(v: any) {
		var reg = /^[0-9]+\.?[0-9]*$/;
		if (reg.test(v)) {
			return true;
		}
		return false;
	}
}

export default new Tools();
