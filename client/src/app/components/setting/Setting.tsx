import React, { Component } from "react";
import { Drawer, Button, Modal, message, Tabs } from "antd";
import Event from "../../event/Event";
import "./setting.scss";
import WebSocket from "../../ws/WebSocket";
// import { Terminal } from "xterm";
// import "../../../../node_modules/xterm/css/xterm.css";
// const os = window.require("electron").remote.require("os");
// const process = window.require("electron").remote.require("process");
// const pty = window.require("electron").remote.require("node-pty");
const { TabPane } = Tabs;

export default class Setting extends Component {
	state = { visible: false, loading: false, progress: 0 };

	onClose() {
		this.setState({ visible: false });
	}

	onOpen() {
		this.setState({ visible: true });
	}

	componentDidMount() {
		Event.add("openSetting", () => this.onOpen());

		WebSocket.ws.AddListener("/client/update/endCheck", (e: any, data: any) => this.endCheck(data));

		WebSocket.ws.AddListener("/client/update/endUpdate", (e: any, data: any) => this.endUpdate(data));

		WebSocket.ws.AddListener("/client/update/progressUpdate", (e: any, data: any) => this.progressUpdate(data));
	}

	componentWillUnmount() {
		Event.remove("openSetting");
	}

	startCheck() {
		this.setState({ loading: true });
		WebSocket.ws.Emit("/server/update/startCheck");
	}

	endCheck(data: any) {
		if (data.err) {
			this.setState({ loading: false });
			return message.error(data.err.message);
		}

		if (!data.shouldUpdate) {
			this.setState({ loading: false });
			message.info(`当前已经是最新版本`);
		}

		if (data.shouldUpdate) {
			return this.startUpdate();
		}
	}

	startUpdate() {
		WebSocket.ws.Emit("/server/update/startUpdate");
	}

	endUpdate(data: any) {
		this.setState({ loading: false, progress: 0 });

		if (data.err) {
			return message.error(data.err.code);
		}

		Modal.info({ content: "更新完毕,点击确定重启.", onOk: () => this.restart() });
	}

	progressUpdate(data: any) {
		this.setState({ progress: data.progress });
	}

	restart() {
		WebSocket.ws.Emit("/server/system/restart");
	}

	render() {
		return (
			<Drawer
				title={`系统设置`}
				placement={`top`}
				closable={false}
				onClose={() => this.onClose()}
				visible={this.state.visible}
				getContainer={false}
				width={"100%"}
				height={"80%"}
				destroyOnClose
				className="setting"
			>
				<Tabs defaultActiveKey="1">
					<TabPane tab="基本设置" key="1">
						<div className="setting-form">
							<Button type="default" loading={this.state.loading} onClick={() => this.startCheck()}>
								{this.state.progress ? `正在更新... ${this.state.progress}%` : "检测更新"}
							</Button>
						</div>
						<div className="button-box">
							<Button type="primary">保存</Button>
						</div>
					</TabPane>
				</Tabs>
			</Drawer>
		);
	}
}
