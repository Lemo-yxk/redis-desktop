import React, { Component } from "react";
import { Rnd } from "react-rnd";
import "./keyTree.scss";
import { Select, Button, message } from "antd";
import Tools from "../../tools/Tools";
import Event from "../../event/Event";
import Config from "../config/Config";
import WebSocket from "../../ws/WebSocket";
import { Treebeard } from "react-treebeard-ts";
import Command from "../../services/Command";
import Layer from "../layer/Layer";
import DataTree from "./Tree";

const Option = Select.Option;

export default class KeyTree extends Component {
	state = {
		databases: [] as any[],
		dataTree: [] as any[],
		db: "请选择DB" as any
	};

	serverName = "";
	type = "";
	dbSize = 0;
	prev: any = null;
	shouldRefresh = false;

	// constructor(props: any) {
	// 	super(props);
	// }

	updateTree() {
		this.setState({ dataTree: DataTree.dataTree });
	}

	updateDatabases() {
		let { databases } = this.state;
		for (let i = 0; i < databases.length; i++) {
			if (databases[i].key === this.state.db) {
				databases[i].size = this.dbSize;
			}
		}
		this.setState({ databases: databases });
	}

	async componentDidMount() {
		Event.add("connect", (type, serverName) => this.connect(type, serverName));
		Event.add("disconnect", serverName => this.disconnect(serverName));
		Event.add("update", serverName => this.update(serverName));
		Event.add("delete", serverName => this.delete(serverName));
		Event.add("deleteKey", (key, fn) => this.deleteKey(key, fn));
		Event.add("insertKey", (key, fn) => this.insertKey(key, this.shouldRefresh, fn));

		WebSocket.listen("scan", (e: any, v: any) => {
			let keys = v.keys || [];

			Event.emit("progress", (v.current / v.dbSize) * 100);

			for (let index = 0; index < keys.length; index++) {
				DataTree.addKey(keys[index], this.shouldRefresh);
			}

			this.dbSize = v.dbSize;

			// read done
			if (v.dbSize === v.current) {
				Event.emit("progress", 0);
				this.readDone();
			}
			// render tree
			this.updateTree();

			// render databases
			this.updateDatabases();
		});

		// await this.connect("normal", "127.0.0.1");
		// this.selectDB(0);
	}

	deleteKey(key: string, fn: any) {
		DataTree.deleteKey(key);
		this.dbSize--;
		fn && fn();
		this.updateDatabases();
		this.updateTree();
	}

	insertKey(key: string, isRead: boolean, fn: any) {
		DataTree.addKey(key, this.shouldRefresh);
		this.dbSize++;
		fn && fn();
		this.updateDatabases();
		this.updateTree();
	}

	readDone() {
		message.info("数据加载成功");
		if (this.shouldRefresh) {
			var notRead = DataTree.checkRead(DataTree.dataTree);
			for (let i = 0; i < notRead.length; i++) {
				DataTree.deleteKey(notRead[i].name);
			}
		}
		this.shouldRefresh = false;
	}

	componentWillUnmount() {
		Event.remove("connect");
		Event.remove("disconnect");
		Event.remove("update");
		Event.remove("delete");
		Event.remove("deleteKey");
		Event.remove("insertKey");
		WebSocket.remove("scan");
		DataTree.dataTree = [];
	}

	async connect(type: string, serverName: any) {
		this.reset();
		this.type = type;
		this.serverName = serverName;
		let res = await this.login();
		if (!res) return;

		Config.setServerName(serverName);

		for (let i = 0; i < parseInt(res); i++) {
			this.state.databases.push({ title: `db-${i}`, key: i, size: 0 });
		}

		message.success("连接成功");

		Config.setCurrent(Config.get(serverName));

		this.updateDatabases();
	}

	reset() {
		DataTree.dataTree = [];
		this.serverName = "";
		this.type = "";
		this.dbSize = 0;
		this.prev = null;
		this.shouldRefresh = false;
		this.setState({ databases: [], dataTree: [], db: "请选择DB" });
		Config.delDB();
		Config.delServerName();
		Config.delCurrent();
	}

	disconnect(serverName: any) {
		if (this.serverName === serverName) {
			this.reset();
		}
	}

	update(serverName: any) {
		Event.emit("openUpdateServer", serverName);
	}

	delete(serverName: any) {
		if (this.serverName === serverName) {
			this.reset();
		}
	}

	render() {
		return (
			<Rnd
				default={{ height: "100%", width: "250px", x: 0, y: 0 }}
				minWidth={250}
				maxWidth={500}
				bounds=".content"
				enableResizing={{ right: true }}
				disableDragging={true}
				className="key-tree"
			>
				<div className="select-panel">
					{this.state.databases.length > 0 ? (
						<Select
							value={this.state.db}
							style={{ width: "100%" }}
							listHeight={600}
							onSelect={value => this.selectDB(value)}
						>
							{this.state.databases.map(v => (
								<Option key={v.key} value={v.key}>
									{v.title} {v.size ? `(${v.size})` : ""}
								</Option>
							))}
						</Select>
					) : null}
				</div>
				<div className="data-tree">
					{this.state.dataTree.length > 0 ? (
						<Treebeard
							data={this.state.dataTree}
							onToggle={(node, toggled) => this.onToggle(node, toggled)}
							style={this.style}
							animations={false}
						/>
					) : null}
				</div>
				<div className="title">
					<div>
						<div>
							{this.serverName} {this.type}
						</div>
						<Button type="link" danger onClick={() => this.refresh()}>
							刷新
						</Button>
					</div>
				</div>
			</Rnd>
		);
	}

	refresh(): void {
		this.shouldRefresh = true;
		this.selectDB(this.state.db);
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

	onToggle(node: import("react-treebeard-ts").TreeNode, toggled: boolean): void {
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

		this.updateTree();
	}

	async onSelect(key: string) {
		let type = await Command.type(key);
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
		if (this.state.db !== db) DataTree.dataTree = [];
		this.state.db = db;
		let response = await Command.selectDB(this.serverName, db);
		if (response.data.code !== 200) return Tools.Notification(response);
		Config.setDB(db);
		await Command.scan();
	}
}
