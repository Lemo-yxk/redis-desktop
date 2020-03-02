import React, { Component } from "react";
import { Drawer, Button, message, Modal } from "antd";
import Event from "../../event/Event";
import "./serverList.scss";
import Config from "../config/Config";
import confirm from "antd/lib/modal/confirm";

export default class ServerList extends Component {
	state = { visible: false, header: this.createHeader() };

	onClose() {
		this.setState({ visible: false });
	}

	onOpen() {
		this.setState({ visible: true });
	}

	componentDidMount() {
		Event.add("openServerList", () => this.onOpen());
		Event.add("addServer", () => this.setState({ header: this.createHeader() }));
	}

	componentWillUnmount() {
		Event.remove("openServerList");
	}

	createHeader() {
		let data = [];
		let config = Config.all();
		for (const key in config) {
			data.push(
				<div className="db-header" key={key}>
					<div>{key}</div>
					<div className="button">
						<Button type="link" onClick={() => this.connect(key)}>
							连接
						</Button>
						<Button type="link" onClick={() => this.update(key)}>
							修改
						</Button>
						<Button type="link" danger onClick={() => this.disconnect(key)}>
							断开
						</Button>
						<Button type="link" danger onClick={() => this.delete(key)}>
							删除
						</Button>
					</div>
				</div>
			);
		}
		return data;
	}

	update(key: string) {
		Event.emit("update", key);
	}

	connect(key: string) {
		this.onClose();
		Event.emit("connect", key);
	}

	disconnect(key: string) {
		this.onClose();
		Event.emit("disconnect", key);
	}

	delete(key: string) {
		Modal.confirm({
			title: `确定要删除 ${key} 的配置吗`,
			okText: "确认",
			cancelText: "取消",
			onOk: () => {
				Config.delete(key);
				this.setState({ header: this.createHeader() });
				Event.emit("delete", key);
			}
		});
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
			</Drawer>
		);
	}
}
