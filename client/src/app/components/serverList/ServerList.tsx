import React, { Component } from "react";
import { Drawer, Button, Modal } from "antd";
import Event from "../../event/Event";
import "./serverList.scss";
import Config from "../config/Config";
import Command from "../../services/Command";

export default class ServerList extends Component {
	state = { visible: false, modal: false, header: this.createHeader() };

	onClose() {
		this.setState({ visible: false });
	}

	onOpen() {
		this.setState({ visible: true });
	}

	componentDidMount() {
		Event.add("openServerList", () => this.onOpen());
		Event.add("addServer", () => this.setState({ header: this.createHeader() }));
		Event.add("updateServer", () => this.setState({ header: this.createHeader() }));
	}

	componentWillUnmount() {
		Event.remove("openServerList");
	}

	createHeader() {
		let data = [];
		let config = Config.all();
		for (const serverName in config) {
			data.push(
				<div className="db-header" key={serverName}>
					<div>{serverName}</div>
					<div className="button">
						<Button type="link" onClick={() => this.connect(serverName)}>
							连接
						</Button>
						<Button type="link" onClick={() => this.update(serverName)}>
							修改
						</Button>
						<Button type="link" danger onClick={() => this.disconnect(serverName)}>
							断开
						</Button>
						<Button type="link" danger onClick={() => this.delete(serverName)}>
							删除
						</Button>
					</div>
				</div>
			);
		}
		return data;
	}

	update(serverName: string) {
		Event.emit("update", serverName);
	}

	serverName = "";
	connect(serverName: string) {
		this.serverName = serverName;
		this.onChooseOpen();
	}

	disconnect(serverName: string) {
		this.onClose();
		Event.emit("disconnect", serverName);
		Command.disconnect(serverName);
	}

	delete(serverName: string) {
		Modal.confirm({
			title: `确定要删除 ${serverName} 的配置吗`,
			okText: "确认",
			cancelText: "取消",
			onOk: () => {
				Config.delete(serverName);
				this.setState({ header: this.createHeader() });
				Event.emit("delete", serverName);
				Command.disconnect(serverName);
			}
		});
	}

	onChooseClose() {
		this.setState({ modal: false });
	}

	onChooseOpen() {
		this.setState({ modal: true });
	}

	render() {
		return (
			<Drawer
				title="服务器列表"
				placement="right"
				closable={false}
				onClose={() => this.onClose()}
				visible={this.state.visible}
				getContainer={false}
				width={"30%"}
				className="server-list"
				destroyOnClose
			>
				{this.state.header}
				<Modal
					destroyOnClose
					title={`选择连接方式`}
					visible={this.state.modal}
					className="choose-server"
					onCancel={() => this.onChooseClose()}
					closable={true}
					maskClosable={true}
					footer={null}
				>
					<Button type="dashed" onClick={() => this.choose("normal")}>
						Normal
					</Button>
					<Button type="dashed" onClick={() => this.choose("cluster")}>
						Cluster
					</Button>
				</Modal>
			</Drawer>
		);
	}

	choose(type: string): void {
		Event.emit("connect", type, this.serverName);
		this.onChooseClose();
		this.onClose();
	}
}
