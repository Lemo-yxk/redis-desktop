import React, { Component } from "react";
import { Rnd } from "react-rnd";
import "./keyTree.scss";
import { Tree, Select, Button, notification } from "antd";
import Tools from "../../tools/Tools";
import Event from "../../event/Event";
import Config from "../config/Config";
import Axios from "axios";
import WebSocket from "../../ws/WebSocket";
import { Treebeard, TreeTheme } from "react-treebeard";

const Option = Select.Option;

export default class KeyTree extends Component {
	state = {
		select: null,
		title: null,
		dataTree: []
	};

	serverName = "";
	databases = "";

	componentDidMount() {
		Event.add("connect", key => this.connect(key));
		Event.add("disconnect", key => this.disconnect(key));
		Event.add("update", key => this.update(key));
		Event.add("delete", key => this.delete(key));

		WebSocket.listen("scan", (e: any, v: any) => {
			for (let index = 0; index < v.length; index++) {
				this.addDataTree(v[index]);
			}
			this.setState({ dataTree: this.createDataTree() });
			console.log(this.dataTree);
		});

		this.connect("127.0.0.1");
	}

	componentWillUnmount() {
		Event.remove("connect");
		Event.remove("disconnect");
		Event.remove("update");
		Event.remove("delete");
	}

	async connect(serverName: any) {
		this.serverName = serverName;
		let res = await this.login();
		this.databases = res[1];
		this.setState({ select: this.createSelect(serverName), title: this.createTitle(serverName) });
	}

	disconnect(serverName: any) {
		if (this.serverName === serverName) this.setState({ select: null });
	}

	update(serverName: any) {
		console.log("update", this.serverName, serverName);
	}

	delete(serverName: any) {
		if (this.serverName === serverName) this.setState({ select: null });
	}

	dataTree: any = [];

	inArr(name: string, arr: any) {
		for (let index = 0; index < arr.length; index++) {
			if (arr[index]["name"] === name) {
				return arr[index];
			}
		}
		return false;
	}

	addDataTree(key: string) {
		let params = key.split(":");
		let temp = this.dataTree;
		var k = "";
		for (let index = 0; index < params.length; index++) {
			k += params[index] + ":";
			let arr = this.inArr(params[index], temp);
			if (arr !== false) {
				temp = arr.children;
				continue;
			}
			let item = {
				id: k.slice(0, -1),
				name: index === params.length - 1 ? key : params[index],
				children: []
			};

			if (index === params.length - 1) delete item.children;

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

	createTitle(key: string) {
		return (
			<Button type="link" danger>
				{key}
			</Button>
		);
	}

	createSelect(key: any) {
		return (
			<Select
				defaultValue={"请选择DB"}
				style={{ width: "100%" }}
				listHeight={600}
				onSelect={value => this.selectDB(value)}
			>
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
		let response = await Axios.post(`/redis/key/type`, Tools.QueryString({ name: this.serverName, key: key }));
		console.log(response.data);

		response = await Axios.post(
			`/redis/key/do`,
			Tools.QueryString({
				name: this.serverName,
				key: key,
				args: `lrange ${key} 0 9`
			})
		);

		console.log(response.data);
	}

	async login() {
		let cfg = Config.get(this.serverName);
		let response = await Axios.post(`/redis/register/${cfg.type}`, Tools.QueryString(cfg as any));
		Tools.Notification(response, { success: "连接成功" });
		return response.data.msg;
	}

	async selectDB(value: any) {
		let response = await Axios.post(`/redis/db/select`, Tools.QueryString({ name: this.serverName, db: value }));
		if (response.data.code !== 200) return Tools.Notification(response);
		let res = await Axios.post(`/redis/db/scan`, Tools.QueryString({ name: this.serverName }));
		return res.data.msg;
	}
}
