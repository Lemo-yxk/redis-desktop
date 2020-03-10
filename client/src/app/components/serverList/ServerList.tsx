import React, { Component } from "react";
import { Drawer, Button, Modal, Popconfirm } from "antd";
import Event from "../../event/Event";
import "./serverList.scss";
import Config from "../config/Config";
import Command from "../../services/Command";
import { QuestionCircleOutlined, DownloadOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Collapse } from "antd";
import { config } from "../../interface/config";
const { Panel } = Collapse;

export default class ServerList extends Component {
	state = { visible: false, configs: Config.allConfig() as { [key: string]: config } };

	onClose() {
		this.setState({ visible: false });
	}

	onOpen() {
		this.setState({ visible: true });
	}

	componentDidMount() {
		Event.add("openServerList", () => this.onOpen());
		Event.add("addServer", () => this.setState({ configs: Config.allConfig() }));
		Event.add("updateServer", () => this.setState({ configs: Config.allConfig() }));
	}

	componentWillUnmount() {
		Event.remove("openServerList");
		Event.remove("addServer");
		Event.remove("updateServer");
	}

	update(config: config) {
		// Event.emit("update", config.name);
		Event.emit("openAddServer", config);
		this.onClose();
	}

	connect(config: config) {
		Event.emit("connect", config.name, config.connectType);
		this.onClose();
	}

	disconnect(config: config) {
		// this.onClose();
		Event.emit("disconnect", config.name);
		Command.disconnect(config.name);
	}

	delete(config: config) {
		Config.deleteConfig(config.name);
		this.setState({ configs: Config.allConfig() });
		Event.emit("delete", config.name);
		Command.disconnect(config.name);
	}

	setDefault(config: config) {
		for (const key in this.state.configs) {
			if (key === config.name) continue;
			this.state.configs[key].default = false;
			Config.setConfig(key, this.state.configs[key]);
		}
		config.default = !config.default;
		Config.setConfig(config.name, config);
		this.setState({ configs: Config.allConfig() });
	}

	addServer() {
		Event.emit("openAddServer");
		this.onClose();
	}

	render() {
		let configs = Object.values(this.state.configs);

		return (
			<Drawer
				title={
					<div className="server-list-header">
						<div className="left">服务器列表</div>
						<div className="right">
							<Button type="primary" onClick={() => this.addServer()}>
								<PlusOutlined />
							</Button>
							<Button
								type="default"
								onClick={() =>
									Modal.confirm({
										content: "确定导出所有配置?",
										okText: "别啰嗦,快点!",
										cancelText: "我再想想.",
										onOk: () => {
											Command.export("config.json", JSON.stringify(Config.allConfig()));
										}
									})
								}
							>
								<DownloadOutlined />
							</Button>
							<Button
								type="danger"
								onClick={() =>
									Modal.confirm({
										content: "确定清除所有配置?",
										okText: "别啰嗦,快点!",
										cancelText: "我再想想.",
										onOk: () => {
											Config.deleteAllConfig();
											this.setState({ configs: {} });
										}
									})
								}
							>
								<DeleteOutlined />
							</Button>
						</div>
					</div>
				}
				placement="right"
				closable={false}
				onClose={() => this.onClose()}
				visible={this.state.visible}
				getContainer={false}
				width={"400px"}
				className="server-list"
				destroyOnClose
			>
				{configs.length > 0 ? (
					<Collapse>
						{configs.map(config => (
							<Panel
								header={
									<div className="panel-title">
										{config.default ? (
											<div>{`${config.name} (默认)`}</div>
										) : (
											<div>{config.name}</div>
										)}

										<div>
											<Button
												type="link"
												onClick={e => {
													e.stopPropagation();
													this.connect(config);
												}}
											>
												连接
											</Button>
											<Button
												type="link"
												danger
												onClick={e => {
													e.stopPropagation();
													this.disconnect(config);
												}}
											>
												断开
											</Button>
										</div>
									</div>
								}
								key={config.name}
							>
								<div className="db-header" key={config.name}>
									<div>{config.name}</div>
									<div className="button">
										<Button type="link" onClick={() => this.setDefault(config)}>
											{config.default ? "取消默认" : "设为默认"}
										</Button>
										<Button type="link" onClick={() => this.update(config)}>
											修改
										</Button>

										<Popconfirm
											title={`确定要删除 ${config.name} 吗?`}
											onConfirm={() => this.delete(config)}
											okText="确定"
											cancelText="取消"
											icon={<QuestionCircleOutlined style={{ color: "red" }} />}
										>
											<Button type="link" danger>
												删除
											</Button>
										</Popconfirm>
									</div>
								</div>
							</Panel>
						))}
					</Collapse>
				) : null}
			</Drawer>
		);
	}
}
