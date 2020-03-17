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
import { config } from "../../interface/config";

const Option = Select.Option;

export default class KeyTree extends Component {
	state = {
		databases: [] as any[],
		dataTree: [] as any[],
		db: "请选择DB" as any
	};

	serverName = "";
	connectType = "";
	dbSize = 0;
	selectedNode: any = null;
	shouldRefresh = false;
	config: config = {} as config;

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
		Event.add("connect", (serverName, connectType, fn) => this.connect(serverName, connectType, fn));
		Event.add("selectDB", (db, fn) => this.selectDB(db, fn));
		Event.add("disconnect", serverName => this.disconnect(serverName));
		Event.add("update", serverName => this.update(serverName));
		Event.add("delete", serverName => this.delete(serverName));
		Event.add("deleteKey", (key, fn) => this.deleteKey(key, fn));
		Event.add("insertKey", (key, isActive, fn) => this.insertKey(key, isActive, fn));
		Event.add("activeKey", (key, isActive) => this.activeKey(key, isActive));

		WebSocket.listen("scan", (e: any, v: any) => {
			let keys = v.keys || [];

			Event.emit("progress", (v.current / v.dbSize) * 100);

			for (let index = 0; index < keys.length; index++) {
				DataTree.addKey(keys[index], this.shouldRefresh);
			}

			this.dbSize = v.dbSize;

			// read done
			if (v.done) {
				Event.emit("progress", 0);
				this.readDone();
			}
			// render tree
			this.updateTree();

			// render databases
			this.updateDatabases();
		});
	}

	activeKey(key: string, isActive: boolean) {
		var node = DataTree.search(DataTree.dataTree, key);

		if (!node) return;
		this.selectedNode.active = false;

		this.selectedNode = node;
		this.selectedNode.active = isActive;
		if (isActive) {
			var temp = node;
			while (1) {
				if (!temp.parent) break;
				temp.parent.toggled = true;
				temp.parent.active = false;
				temp = temp.parent;
			}
		}
		this.updateTree();
	}

	deleteKey(key: string, fn: any) {
		DataTree.deleteKey(key);
		this.dbSize--;
		fn && fn();
		this.updateDatabases();
		this.updateTree();
	}

	insertKey(key: string, isActive: boolean, fn: any) {
		DataTree.addKey(key, this.shouldRefresh, isActive);
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
		Layer.close();
	}

	componentWillUnmount() {
		Event.remove("connect");
		Event.remove("selectDB");
		Event.remove("disconnect");
		Event.remove("update");
		Event.remove("delete");
		Event.remove("deleteKey");
		Event.remove("insertKey");
		Event.remove("activeKey");
		WebSocket.remove("scan");
		DataTree.clear();
	}

	async connect(serverName: any, connectType: string, fn?: any) {
		if (this.serverName === serverName) {
			return;
		}

		this.reset();

		this.config = Config.getConfig(serverName);
		this.connectType = connectType;
		this.serverName = serverName;
		DataTree.setSplit(this.config.defaultSplit);
		let res = await this.login();
		if (!res) return this.reset();

		Config.setServerName(serverName);

		for (let i = 0; i < parseInt(res); i++) {
			this.state.databases.push({ title: `db-${i}`, key: i, size: 0 });
		}

		message.success("连接成功");

		Config.setCurrent(this.config);

		this.updateDatabases();

		fn && fn();

		if (this.config.defaultDB) this.selectDB(parseInt(this.config.defaultDB));
	}

	reset() {
		DataTree.clear();
		this.config = {} as config;
		this.serverName = "";
		this.connectType = "";
		this.dbSize = 0;
		this.selectedNode = null;
		this.shouldRefresh = false;
		this.setState({ databases: [], dataTree: [], db: "请选择DB" });
		Config.delDB();
		Config.delServerName();
		Config.delCurrent();
		Event.emit("resetPanel");
	}

	disconnect(serverName: any) {
		if (this.serverName === serverName) {
			this.reset();
		}
	}

	update(serverName: any) {}

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
					{this.state.dataTree.length > 0 ? (
						<div>
							<div>
								{this.serverName} {this.connectType}
							</div>
							<Button type="link" danger onClick={() => this.refresh()}>
								刷新
							</Button>
						</div>
					) : null}
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
		if (this.selectedNode) {
			this.selectedNode.active = false;
		}

		this.selectedNode = node;

		this.selectedNode.active = true;

		if (this.selectedNode.children) {
			this.selectedNode.toggled = toggled;
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
		let response = await Command.register(this.connectType, this.config);
		Layer.close();
		if (response.data.code !== 200) {
			Tools.Notification(response);
			return false;
		}
		return response.data.msg[1];
	}

	async selectDB(db: any, fn?: any) {
		if (this.state.db !== db) DataTree.clear();
		Layer.load();
		this.state.db = db;
		let response = await Command.selectDB(this.serverName, db);
		if (response.data.code !== 200) return Tools.Notification(response);
		Config.setDB(db);
		await Command.scan(this.config.defaultFilter);
		fn && fn();
	}
}
