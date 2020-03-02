import { notification } from "antd";

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

	Notification(response: any, message: any = { success: response.data.msg, error: response.data.msg }) {
		if (response.data.code === 200) {
			notification.success({ message: message.success });
		} else {
			notification.error({ message: message.error });
		}
	}
}

export default new Tools();
