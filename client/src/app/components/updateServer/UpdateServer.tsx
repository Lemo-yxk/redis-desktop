import React, { Component } from "react";
import Modal from "antd/lib/modal/Modal";
import Event from "../../event/Event";
import { Radio, Input, Button, notification, message } from "antd";
import Config from "../config/Config";
import { config } from "../../interface/config";
import "./updateServer.scss";
import Command from "../../services/Command";
import { MinusCircleOutlined } from "@ant-design/icons";
import Tools from "../../tools/Tools";

export default class UpdateServer extends Component {
	state = { visible: false, config: {} as config, type: "normal", clusterHostInput: null };

	onOpen() {
		this.setState({ visible: true });
	}

	onClose() {
		this.setState({ visible: false, clusterHostInput: null });
	}

	serverName = "";

	constructor(props: any) {
		super(props);
	}

	componentDidMount() {
		Event.add("openUpdateServer", serverName => {
			this.serverName = serverName;
			let config = Config.get(serverName);
			if (!config.cluster) config.cluster = [];
			this.setState({ config: config }, () => this.setState({ clusterHostInput: this.createCluster() }));
			this.onOpen();
		});
	}

	componentWillUnmount() {
		Event.remove("openUpdateServer");
	}

	onChange(type: string, value: string) {
		(this.state.config as any)[type] = value;
		this.setState({ config: this.state.config, clusterHostInput: this.createCluster() });
	}

	render() {
		return (
			<Modal
				destroyOnClose
				title={`修改 ${this.state.config.name} 配置`}
				visible={this.state.visible}
				className="update-server"
				closable={false}
				maskClosable={false}
				footer={null}
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
						value={this.state.config.name}
						onChange={value => this.onChange("name", value.target.value)}
					/>
					{this.state.type === "normal" ? (
						<Input
							spellCheck={false}
							addonBefore="Host"
							placeholder="127.0.0.1"
							value={this.state.config.host}
							onChange={value => this.onChange("host", value.target.value)}
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
							value={this.state.config.port}
							onChange={value => this.onChange("port", value.target.value)}
						/>
					) : (
						<Input
							spellCheck={false}
							addonBefore="Master"
							placeholder="master"
							value={this.state.config.master}
							onChange={value => this.onChange("master", value.target.value)}
						/>
					)}
					<Input
						spellCheck={false}
						addonBefore="Pass"
						placeholder="password"
						value={this.state.config.password}
						onChange={value => this.onChange("password", value.target.value)}
					/>

					<div className="button-box">
						<Button type="primary" onClick={() => this.submit()}>
							修改
						</Button>
						<Button type="primary" onClick={() => this.test()}>
							测试
						</Button>
						<Button type="default" onClick={() => this.onClose()}>
							取消
						</Button>
					</div>
				</div>
			</Modal>
		);
	}

	createCluster() {
		let cluster = this.state.config.cluster.map((v, i) => (
			<Input
				spellCheck={false}
				key={i}
				addonAfter={<MinusCircleOutlined onClick={() => this.removeHost(i)} />}
				className="package-input"
				placeholder="127.0.0.1:16379"
				value={this.state.config.cluster[i]}
				onChange={value => {
					this.state.config.cluster[i] = value.target.value;
					this.setState({ config: this.state.config, clusterHostInput: this.createCluster() });
				}}
			/>
		));
		return cluster;
	}

	removeHost(i: number): void {
		this.state.config.cluster.splice(i, 1);
		this.setState({ clusterHostInput: this.createCluster() });
	}

	addHost(): void {
		this.state.config.cluster.push("");
		this.setState({ clusterHostInput: this.createCluster() });
	}

	async test() {
		this.state.config.cluster = this.state.config.cluster.filter(v => v !== "");
		message.loading({ content: `正在连接 ${this.state.config.name} ...`, duration: 0 });
		let response = await Command.register(this.state.type, this.state.config);
		message.destroy();
		return Tools.Notification(response, "连接成功");
	}

	submit() {
		Config.delete(this.serverName);
		this.state.config.cluster = this.state.config.cluster.filter(v => v !== "");
		Config.set(this.state.config.name, this.state.config);
		message.success("修改成功");
		this.onClose();
		Event.emit("updateServer");
	}
}
