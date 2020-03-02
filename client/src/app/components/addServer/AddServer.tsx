import React, { Component } from "react";
import { Drawer, Radio, Input, Button, notification } from "antd";
import Event from "../../event/Event";
import "./addServer.scss";
import Axios from "axios";
import Tools from "../../tools/Tools";
import Config from "../config/Config";

export default class AddServer extends Component {
	state = { visible: false, radio: "normal" };
	event!: string;

	onClose() {
		this.setState({ visible: false });
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

	name = "127.0.0.1";
	host = "127.0.0.1";
	port = "6379";
	password = "1354243";
	master = "master";

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
				<Radio.Group value={this.state.radio} onChange={value => this.setState({ radio: value.target.value })}>
					<Radio.Button value="normal">Default</Radio.Button>
					<Radio.Button value="cluster">Cluster</Radio.Button>
				</Radio.Group>
				<div className="normal-form">
					<Input placeholder="name" onChange={value => (this.name = value.target.value)} />
					<Input placeholder="host" onChange={value => (this.host = value.target.value)} />
					<Input placeholder="port" onChange={value => (this.port = value.target.value)} />
					<Input placeholder="password" onChange={value => (this.password = value.target.value)} />
					<div>
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

	async test() {
		var data = {
			name: this.name,
			host: this.host,
			port: this.port,
			password: this.password,
			master: this.master,
			type: this.state.radio
		};

		let response = await Axios.post(`/redis/register/${this.state.radio}`, Tools.QueryString(data));

		if (response.data.code !== 200) {
			return notification.error({ message: response.data.status, description: response.data.msg });
		}

		return notification.success({ message: response.data.status, description: "连接成功" });
	}

	async submit() {
		var data = {
			name: this.name,
			host: this.host,
			port: this.port,
			password: this.password,
			master: this.master,
			type: this.state.radio
		};

		let cfg = Config.get(this.name);
		if (cfg) return notification.error({ message: "ERROR", description: `${this.name} 已经存在!` });

		Config.set(this.name, data);

		this.onClose();

		Event.emit("addServer", this.name);

		return notification.success({ message: "SUCCESS", description: "创建成功" });
	}
}
