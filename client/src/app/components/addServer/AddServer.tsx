import React, { Component } from "react";
import { Drawer, Radio, Input, Button, notification, Select, Divider, Tabs } from "antd";
import Event from "../../event/Event";
import "./addServer.scss";
import Config from "../config/Config";
import Command from "../../services/Command";
import { MinusCircleOutlined } from "@ant-design/icons";
import Tools from "../../tools/Tools";
import { config } from "../../interface/config";
const { Option } = Select;
const { TabPane } = Tabs;

export default class AddServer extends Component {
	emptyData = {
		visible: false,
		name: "",
		host: "",
		port: "",
		password: "",
		master: "",
		cluster: [] as string[],
		connectType: "normal",
		defaultSplit: "",
		defaultFilter: "",
		connectTimeout: "",
		execTimeout: "",
		defaultDB: "",
		default: false
	};

	state = JSON.parse(JSON.stringify(this.emptyData));

	status = "";

	statusMap: { [key: string]: string } = { add: "添加", update: "修改" };

	onClose() {
		Event.emit("openServerList");
		this.setState(JSON.parse(JSON.stringify(this.emptyData)));
	}

	onOpen(config: config) {
		this.status = "add";
		if (config) this.status = "update";
		this.setState({ visible: true, ...config });
	}

	componentDidMount() {
		Event.add("openAddServer", (config: config) => this.onOpen(config));
	}

	componentWillUnmount() {
		Event.remove("openAddServer");
	}

	render() {
		return (
			<Drawer
				title={`${this.statusMap[this.status]}服务器`}
				placement={this.status === "add" ? "left" : "right"}
				closable={false}
				onClose={() => this.onClose()}
				visible={this.state.visible}
				getContainer={false}
				width={"400px"}
				destroyOnClose
				className="add-server"
			>
				<Tabs defaultActiveKey="1">
					<TabPane tab="基本设置" key="1">
						<div className="normal-form">
							<Select
								value={this.state.connectType}
								style={{ width: "100%" }}
								onChange={value => this.setState({ connectType: value })}
							>
								<Option value="normal">Normal</Option>
								<Option value="cluster">Cluster</Option>
							</Select>
							<Input
								spellCheck={false}
								addonBefore="Name"
								placeholder="127.0.0.1"
								value={this.state.name}
								onChange={value => this.changeName(value.target.value)}
							/>

							{this.state.connectType === "normal" ? (
								<Input
									spellCheck={false}
									addonBefore="Host"
									placeholder="127.0.0.1"
									value={this.state.host}
									onChange={value => this.changeHost(value.target.value)}
								/>
							) : (
								<div className="add-input-box">
									<div className="add">
										<Button type="dashed" onClick={() => this.addCluster()}>
											HOST
										</Button>
									</div>
									<div className="input">
										{this.state.cluster.map((v: any, i: number) => (
											<Input
												spellCheck={false}
												key={i}
												addonAfter={
													<MinusCircleOutlined onClick={() => this.removeCluster(i)} />
												}
												className="package-input"
												placeholder="127.0.0.1:16379"
												value={this.state.cluster[i]}
												onChange={value => this.changeCluster(i, value.target.value)}
											/>
										))}
									</div>
								</div>
							)}
							{this.state.connectType === "normal" ? (
								<Input
									spellCheck={false}
									addonBefore="Port"
									placeholder="6379"
									value={this.state.port}
									onChange={value => this.changePort(value.target.value)}
								/>
							) : (
								<Input
									spellCheck={false}
									addonBefore="Master"
									placeholder="master"
									value={this.state.master}
									onChange={value => this.changeMaster(value.target.value)}
								/>
							)}
							<Input
								spellCheck={false}
								addonBefore="Pass"
								placeholder="password"
								value={this.state.password}
								onChange={value => this.changePassword(value.target.value)}
							/>
						</div>
					</TabPane>
					<TabPane tab="高级设置" key="2">
						<div className="normal-form">
							<Input
								spellCheck={false}
								addonBefore="默认过滤"
								placeholder="*"
								value={this.state.defaultFilter}
								onChange={value => this.changeDefaultFilter(value.target.value)}
							/>
							<Input
								spellCheck={false}
								addonBefore="默认分隔"
								placeholder=":"
								value={this.state.defaultSplit}
								onChange={value => this.changeDefaultSplit(value.target.value)}
							/>
							<Input
								spellCheck={false}
								addonBefore="连接超时"
								placeholder="3000"
								value={this.state.connectTimeout}
								onChange={value => this.changeConnectTime(value.target.value)}
							/>
							<Input
								spellCheck={false}
								addonBefore="执行超时"
								placeholder="3000"
								value={this.state.execTimeout}
								onChange={value => this.changeExecTimeout(value.target.value)}
							/>
							<Input
								spellCheck={false}
								addonBefore="默认DB"
								placeholder="0"
								value={this.state.defaultDB}
								onChange={value => this.changeDefaultDB(value.target.value)}
							/>
						</div>
					</TabPane>
				</Tabs>
				<div className="button-box">
					<Button type="primary" onClick={() => this.submit()}>
						{this.statusMap[this.status]}
					</Button>
					<Button type="primary" onClick={() => this.test()}>
						测试
					</Button>
				</div>
			</Drawer>
		);
	}

	changeDefaultDB(value: string): void {
		this.setState({ defaultDB: Tools.IsNumber(value) ? value : "" });
	}
	changeExecTimeout(value: string): void {
		this.setState({ execTimeout: Tools.IsNumber(value) ? value : "" });
	}
	changeConnectTime(value: string): void {
		this.setState({ connectTimeout: Tools.IsNumber(value) ? value : "" });
	}
	changeDefaultSplit(value: string): void {
		console.log(value);
		this.setState({ defaultSplit: value });
	}
	changeDefaultFilter(value: string): void {
		this.setState({ defaultFilter: value });
	}
	changePassword(value: string): void {
		this.setState({ password: value });
	}
	changeMaster(value: string): void {
		this.setState({ master: value });
	}
	changePort(value: string): void {
		this.setState({ port: Tools.IsNumber(value) ? value : "" });
	}
	changeHost(value: string): void {
		this.setState({ host: value });
	}
	changeName(value: string): void {
		this.setState({ name: value });
	}

	changeCluster(i: number, value: string) {
		this.state.cluster[i] = value;
		this.setState({ cluster: this.state.cluster });
	}

	removeCluster(i: number): void {
		this.state.cluster.splice(i, 1);
		this.setState({ cluster: this.state.cluster });
	}

	addCluster(): void {
		this.state.cluster.push("");
		this.setState({ cluster: this.state.cluster });
	}

	async test() {
		let data = {
			name: this.state.name,
			host: this.state.host,
			port: this.state.port,
			password: this.state.password,
			master: this.state.master,
			cluster: this.state.cluster.filter((v: string) => v !== ""),
			connectType: this.state.connectType,
			default: this.state.default,
			defaultSplit: this.state.defaultSplit || ":",
			defaultFilter: this.state.defaultFilter || "*",
			connectTimeout: this.state.connectTimeout || "3000",
			execTimeout: this.state.execTimeout || "3000",
			defaultDB: this.state.defaultDB
		};

		let response = await Command.register(this.state.connectType, data);

		return Tools.Notification(response, "连接成功");
	}

	async submit() {
		var data = {
			name: this.state.name,
			host: this.state.host,
			port: this.state.port,
			password: this.state.password,
			master: this.state.master,
			connectType: this.state.connectType,
			cluster: this.state.cluster.filter((v: string) => v !== ""),
			default: this.state.default,
			defaultSplit: this.status === "add" ? this.state.defaultSplit || ":" : this.state.defaultSplit,
			defaultFilter: this.state.defaultFilter || "*",
			connectTimeout: this.state.connectTimeout || "3000",
			execTimeout: this.state.execTimeout || "3000",
			defaultDB: this.status === "add" ? this.state.defaultDB || "0" : this.state.defaultDB
		};

		if (this.state.name === "") return notification.error({ message: `服务器名不能为空!` });

		let cfg = Config.getConfig(this.state.name);

		if (this.status === "add")
			if (cfg) return notification.error({ message: "ERROR", description: `${this.state.name} 已经存在!` });

		Config.setConfig(this.state.name, data);

		this.onClose();

		Event.emit("addServer", this.state.name);

		return notification.success({ message: "SUCCESS", description: `${this.statusMap[this.status]}成功` });
	}
}
