import React, { Component } from "react";
import { Drawer, Radio, Input, Button, notification } from "antd";
import Event from "../../event/Event";
import "./addServer.scss";
import Config from "../config/Config";
import Command from "../../services/Command";
import { MinusCircleOutlined } from "@ant-design/icons";
import Tools from "../../tools/Tools";

export default class AddServer extends Component {
	state = { visible: false, type: "normal", clusterHostInput: null };
	event!: string;

	onClose() {
		this.setState({ visible: false, clusterHostInput: null });
	}

	onOpen() {
		this.setState({ visible: true });
	}

	componentDidMount() {
		this.event = Event.add("openAddServer", () => this.onOpen());
	}

	componentWillUnmount() {
		Event.remove(this.event);
	}

	name = "";
	host = "";
	port = "";
	password = "";
	master = "";
	cluster = new Array();

	render() {
		return (
			<Drawer
				title="添加服务器"
				placement="right"
				closable={false}
				onClose={() => this.onClose()}
				visible={this.state.visible}
				getContainer={false}
				width={"30%"}
				destroyOnClose
				className="add-server"
			>
				<Radio.Group value={this.state.type} onChange={value => this.setState({ type: value.target.value })}>
					<Radio.Button value="normal">Default</Radio.Button>
					<Radio.Button value="cluster">Cluster</Radio.Button>
				</Radio.Group>
				<div className="normal-form">
					<Input
						spellCheck={false}
						addonBefore="Name"
						placeholder="127.0.0.1"
						onChange={value => (this.name = value.target.value)}
					/>
					{this.state.type === "normal" ? (
						<Input
							spellCheck={false}
							addonBefore="Host"
							placeholder="127.0.0.1"
							onChange={value => (this.host = value.target.value)}
						/>
					) : (
						<div className="add-input-box">
							<div className="add">
								<Button type="dashed" onClick={() => this.addHost()}>
									HOST
								</Button>
							</div>
							<div className="input">{this.state.clusterHostInput}</div>
						</div>
					)}
					{this.state.type === "normal" ? (
						<Input
							spellCheck={false}
							addonBefore="Port"
							placeholder="6379"
							onChange={value => (this.port = value.target.value)}
						/>
					) : (
						<Input
							spellCheck={false}
							addonBefore="Master"
							placeholder="master"
							onChange={value => (this.master = value.target.value)}
						/>
					)}
					<Input
						spellCheck={false}
						addonBefore="Pass"
						placeholder="password"
						onChange={value => (this.password = value.target.value)}
					/>
					<div className="button-box">
						<Button type="primary" onClick={() => this.submit()}>
							创建
						</Button>
						<Button type="primary" onClick={() => this.test()}>
							测试
						</Button>
					</div>
				</div>
			</Drawer>
		);
	}

	createCluster() {
		let cluster = this.cluster.map((v, i) => (
			<Input
				spellCheck={false}
				key={i}
				addonAfter={<MinusCircleOutlined onClick={() => this.removeHost(i)} />}
				className="package-input"
				placeholder="127.0.0.1:16379"
				onChange={value => {
					this.cluster[i] = value.target.value;
				}}
			/>
		));
		return cluster;
	}

	removeHost(i: number): void {
		this.cluster.splice(i, 1);
		this.setState({ clusterHostInput: this.createCluster() });
	}

	addHost(): void {
		this.cluster.push("");
		this.setState({ clusterHostInput: this.createCluster() });
	}

	async test() {
		let data = {
			name: this.name,
			host: this.host,
			port: this.port,
			password: this.password,
			master: this.master,
			cluster: this.cluster.filter(v => v !== "")
		};

		// console.log(data);

		let response = await Command.register(this.state.type, data);

		return Tools.Notification(response, "连接成功");
	}

	async submit() {
		var data = {
			name: this.name,
			host: this.host,
			port: this.port,
			password: this.password,
			master: this.master,
			cluster: this.cluster.filter(v => v !== "")
		};

		if (this.name === "") return notification.error({ message: `服务器名不能为空!` });

		let cfg = Config.get(this.name);
		if (cfg) return notification.error({ message: "ERROR", description: `${this.name} 已经存在!` });

		Config.set(this.name, data);

		this.onClose();

		Event.emit("addServer", this.name);

		return notification.success({ message: "SUCCESS", description: "创建成功" });
	}
}
