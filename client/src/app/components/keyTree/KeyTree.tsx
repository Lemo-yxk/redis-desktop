import React, { Component } from "react";
import { Rnd } from "react-rnd";
import "./keyTree.scss";
import { Select, Button, message, notification } from "antd";
import Tools from "../../tools/Tools";
import Event from "../../event/Event";
import Config from "../config/Config";
import WebSocket from "../../ws/WebSocket";
import { Treebeard } from "react-treebeard";
import Command from "../../services/Command";
import Layer from "../layer/Layer";

const Option = Select.Option;

export default class KeyTree extends Component {
	state = {
		select: null,
		title: null,
		dataTree: []
	};

	dataTree: any = [];
	serverName = "";
	databases = "";
	db = "请选择DB";
	type = "";

	baseKeys: string[] = [];

	async componentDidMount() {
		Event.add("connect", (type, serverName) => this.connect(type, serverName));
		Event.add("disconnect", serverName => this.disconnect(serverName));
		Event.add("update", serverName => this.update(serverName));
		Event.add("delete", serverName => this.delete(serverName));
		Event.add("deleteKey", key => this.deleteKey(key));
		Event.add("insertKey", key => this.insertKey(key));

		WebSocket.listen("scan", (e: any, v: any) => {
			let keys = v.keys;
			for (let index = 0; index < keys.length; index++) {
				this.baseKeys.push(keys[index]);
				this.addDataTree(keys[index]);
			}

			Event.emit("progress", v.current / v.dbSize);

			this.setState({ dataTree: this.createDataTree() });

			// read done
			if (v.dbSize === v.current) {
				Event.emit("progress", 0);
				this.readDone();
			}
		});

		await this.connect("normal", "127.0.0.1");
		this.selectDB(0);
	}

	insertKey(key: any): void {
		this.addDataTree(key);
		this.setState({ dataTree: this.createDataTree() });
	}

	readDone() {
		message.success("数据加载成功");
		if (this.shouldRefresh) {
			this.checkRead(this.dataTree);
		}
		this.shouldRefresh = false;
	}

	checkRead(data: any[]) {
		for (let i = 0; i < data.length; i++) {
			if (data[i].children) {
				this.checkRead(data[i].children);
			} else {
				if (!data[i].read) {
					this.deleteKey(data[i].name);
				} else {
					data[i].read = false;
				}
			}
		}
	}

	deleteKey(key: any) {
		let params = key.split(":");
		let temp = this.dataTree;
		let k = -1;
		var link = [];
		for (let index = 0; index < params.length; index++) {
			for (let i = 0; i < temp.length; i++) {
				if (temp[i]["i"] === params[index] && temp[i].children) {
					if (index !== params.length - 1) {
						link.unshift(temp);
						temp = temp[i].children;
					} else {
						break;
					}
				}
			}
		}

		for (let i = 0; i < temp.length; i++) {
			if (temp[i].name === key) {
				k = i;
				break;
			}
		}

		temp.splice(k, 1);

		if (temp.length === 0) {
			for (let i = 0; i < link.length; i++) {
				var p = link[i];
				for (let j = 0; j < p.length; j++) {
					const t = p[j];
					if (t.children && t.children.length === 0) {
						link[i].splice(j, 1);
					}
				}
			}
		}

		this.setState({ dataTree: this.createDataTree() });
	}

	componentWillUnmount() {
		Event.remove("connect");
		Event.remove("disconnect");
		Event.remove("update");
		Event.remove("delete");
	}

	async connect(type: string, serverName: any) {
		this.setState({ select: null, dataTree: [], title: null });
		this.serverName = serverName;
		this.dataTree = [];
		this.db = "请选择DB";
		this.type = type;
		let res = await this.login();
		if (!res) return;
		this.databases = res;
		notification.success({ message: "连接成功" });
		Config.setCurrent(Config.get(serverName));
		this.setState({ select: this.createSelect(serverName), title: this.createTitle(serverName, type) });
	}

	disconnect(serverName: any) {
		if (this.serverName === serverName) {
			this.setState({ select: null, dataTree: [], title: null });
		}
	}

	update(serverName: any) {
		Event.emit("openUpdateServer", serverName);
	}

	delete(serverName: any) {
		if (this.serverName === serverName) {
			this.setState({ select: null, dataTree: [], title: null });
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

	addDataTree(key: string) {
		let params = key.split(":");
		let temp = this.dataTree;
		for (let index = 0; index < params.length; index++) {
			if (params.length === 1) {
				var arr = this.inArr1(temp, params[index]);
				if (arr.parent) {
					arr.current.read = true;
					return;
				}
			}

			if (params.length !== 1) {
				var arr = this.inArr(temp, params[index]);
				if (arr) {
					if (index !== params.length - 1) {
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

			let item = {
				id: Math.random().toString(16),
				name: index === params.length - 1 ? key : params[index],
				i: params[index],
				children: index === params.length - 1 ? null : [],
				read: this.shouldRefresh
			};

			temp.push(item);
			temp = item.children;
		}
	}

	render() {
		return (
			<Rnd
				default={{ height: "100%", width: "20%", x: 0, y: 0 }}
				minWidth={"20%"}
				maxWidth={"40%"}
				bounds=".content"
				enableResizing={{ right: true }}
				disableDragging={true}
				className="key-tree"
			>
				<div className="select-panel">{this.state.select}</div>
				<div className="data-tree">{this.state.dataTree}</div>
				<div className="title">{this.state.title}</div>
			</Rnd>
		);
	}

	createTitle(serverName: string, type: string) {
		return (
			<div>
				<div>
					{serverName}({this.type})
				</div>
				<Button type="link" danger onClick={() => this.refresh()}>
					刷新
				</Button>
			</div>
		);
	}

	shouldRefresh = false;
	refresh(): void {
		this.shouldRefresh = true;
		this.selectDB(this.db);
	}

	createSelect(key: any) {
		return (
			<Select value={this.db} style={{ width: "100%" }} listHeight={600} onSelect={value => this.selectDB(value)}>
				{Tools.Range(0, parseInt(this.databases)).map(v => (
					<Option key={v} value={v}>
						db({v})
					</Option>
				))}
			</Select>
		);
	}

	style: any = {
		tree: {
			base: {
				fontSize: "12px",
				whiteSpace: "pre-wrap",
				backgroundColor: "#ffffff",
				height: "100%",
				padding: "5px"
			},
			node: { base: { color: "red" }, activeLink: { backgroundColor: "#bae7ff" } }
		}
	};

	createDataTree() {
		return (
			<Treebeard
				data={this.dataTree}
				onToggle={(node, toggled) => this.onToggle(node, toggled)}
				style={this.style}
				animations={false}
			/>
		);
	}

	prev: any;

	onToggle(node: import("react-treebeard").TreeNode, toggled: boolean): void {
		if (this.prev) {
			this.prev.active = false;
		}

		this.prev = node;

		node.active = true;

		if (node.children) {
			node.toggled = toggled;
		} else {
			this.onSelect(node.name);
		}

		this.setState(() => ({ dataTree: this.createDataTree() }));
	}

	async onSelect(key: string) {
		let type = await Command.type(this.serverName, key);
		Event.emit("selectKey", this.serverName, type, key);
	}

	async login() {
		Layer.load();
		let cfg = Config.get(this.serverName);
		let response = await Command.register(this.type, cfg);
		Layer.close();
		if (response.data.code !== 200) {
			Tools.Notification(response);
			return false;
		}
		return response.data.msg[1];
	}

	async selectDB(db: any) {
		this.db = db;
		let response = await Command.selectDB(this.serverName, db);
		if (response.data.code !== 200) return Tools.Notification(response);
		this.setState({ select: this.createSelect(this.serverName) });
		await Command.scan(this.serverName);
	}
}
