class Tools {
	QueryString(data: { [key: string]: string }) {
		let s = "";
		for (const key in data) {
			s += `${key}=${data[key]}&`;
		}
		return s.slice(0, -1);
	}
}

export default new Tools();
