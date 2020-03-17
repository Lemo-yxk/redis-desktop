class Tree {
	dataTree: any[] = [];
	counter = 0;
	split = "";

	clear() {
		this.dataTree = [];
		this.counter = 0;
	}

	setSplit(split: string) {
		this.split = split;
	}

	checkRead(data: any[]) {
		let res: any[] = [];
		let read = (data: any[]) => {
			for (let i = 0; i < data.length; i++) {
				if (data[i].children) {
					read(data[i].children);
				} else {
					if (!data[i].read) {
						res.push(data[i]);
					} else {
						data[i].read = false;
					}
				}
			}
		};
		read(data);
		return res;
	}

	search(data: any[], key: string): any {
		for (let i = 0; i < data.length; i++) {
			if (data[i].children) {
				let res = this.search(data[i].children, key);
				if (res) return res;
			} else {
				if (data[i].prefix === key) {
					return data[i];
				}
			}
		}
		return null;
	}

	deleteNode(data: any) {
		if (!data.parent) {
			let index = this.dataTree.findIndex((v: any) => v.id === data.id);
			this.dataTree.splice(index, 1);
			return;
		}
		let index = data.parent.children.findIndex((v: any) => v.id === data.id);
		data.parent.children.splice(index, 1);
		if (data.parent.children.length === 0) this.deleteNode(data.parent);
	}

	deleteKey(key: any) {
		var node = this.search(this.dataTree, key);
		if (node) {
			this.countSub(node);
			this.deleteNode(node);
		}
	}

	inArr(arr: any, i: any) {
		for (let index = 0; index < arr.length; index++) {
			if (arr[index]["i"] === i && arr[index].children) return arr[index];
		}
		return false;
	}

	inArr1(arr: any, i: any): any {
		for (let index = 0; index < arr.length; index++) {
			if (arr[index].i === i && !arr[index].children) return { parent: arr, current: arr[index] };
		}
		return false;
	}

	addKey(key: string, isRead?: boolean, isActive?: boolean, isToggled?: boolean) {
		let params = this.split ? key.split(this.split) : [key];
		let temp = this.dataTree;
		var parent = null;
		for (let index = 0; index < params.length; index++) {
			if (params.length === 1) {
				var arr1 = this.inArr1(temp, params[index]);
				if (arr1) {
					arr1.current.read = true;
					return;
				}
			}

			if (params.length !== 1) {
				var arr = this.inArr(temp, params[index]);
				if (arr) {
					if (index !== params.length - 1) {
						parent = arr;
						temp = arr.children;
						continue;
					}
				}

				if (index === params.length - 1) {
					for (let i = 0; i < temp.length; i++) {
						if (temp[i].name === key) {
							temp[i].read = true;
							return;
						}
					}
				}
			}

			let item: any = {
				id: this.counter++,
				name: index === params.length - 1 ? key : params[index],
				isKey: index === params.length - 1,
				i: params[index],
				prefix: params.slice(0, index + 1).join(this.split),
				children: index === params.length - 1 ? null : [],
				read: isRead,
				count: 0,
				parent: parent,
				toggled: isToggled,
				active: isActive
			};

			if (index === params.length - 1) this.countAdd(item);

			parent = item;

			temp.push(item);
			temp = item.children;

			if (index === params.length - 1) return item;
		}
	}

	countAdd(data: any) {
		if (data.parent) {
			data.parent.count++;
			data.parent.name = `${data.parent["i"]} (${data.parent.count})`;
			this.countAdd(data.parent);
		}
	}

	countSub(data: any) {
		if (data.parent) {
			data.parent.count--;
			data.parent.name = `${data.parent["i"]} (${data.parent.count})`;
			this.countSub(data.parent);
		}
	}
}

export default new Tree();
