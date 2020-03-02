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
}

export default new Tools();
