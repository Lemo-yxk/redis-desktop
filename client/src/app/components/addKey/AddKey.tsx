import React, { Component } from "react";
import { Drawer, Radio, Input, Button, notification, Modal, message } from "antd";
import Event from "../../event/Event";
import "./addKey.scss";
import Command from "../../services/Command";
import Transform from "../../transform/Transform";
import Config from "../config/Config";
import { config } from "../../interface/config";

export default class AddKey extends Component {
	state = { visible: false, keyType: "string", key: "", value: "" };

	onClose() {
		this.setState({ visible: false });
	}

	onOpen() {
		this.config = Config.getCurrent();
		if (this.config.name === "") {
			message.error("请连接服务器!");
			return this.onClose();
		}
		this.setState({ visible: true });
	}

	componentDidMount() {
		Event.add("addKey", () => this.onOpen());
	}

	componentWillUnmount() {
		Event.remove("addKey");
	}

	config: config = {} as config;

	render() {
		return (
			<Modal
				destroyOnClose
				title={`添加KEY`}
				visible={this.state.visible}
				className="add-key"
				closable={false}
				maskClosable={false}
				footer={null}
			>
				<div className="select-box">
					<Radio.Group
						value={this.state.keyType}
						onChange={value => this.setState({ keyType: value.target.value })}
					>
						<Radio.Button value="string">string</Radio.Button>
						<Radio.Button value="list">list</Radio.Button>
						<Radio.Button value="hash">hash</Radio.Button>
						<Radio.Button value="set">set</Radio.Button>
						<Radio.Button value="zset">zset</Radio.Button>
					</Radio.Group>
				</div>

				<div className="input-box">
					<Input
						spellCheck={false}
						addonBefore="KEY"
						placeholder="key"
						value={this.state.key}
						onChange={value => this.setState({ key: value.target.value })}
					/>

					<Input
						spellCheck={false}
						addonBefore="Value"
						placeholder="value"
						value={this.state.value}
						onChange={value => this.setState({ value: value.target.value })}
					/>
				</div>

				<div className="button-box">
					<Button type="primary" onClick={() => this.add()}>
						确定
					</Button>

					<Button type="default" onClick={() => this.onClose()}>
						取消
					</Button>
				</div>
			</Modal>
		);
	}
	async add() {
		if (this.state.key === "") {
			message.error("KEY不能为空!");
			return;
		}

		if (this.state.value === "") {
			message.error("VALUE不能为空!");
			return;
		}

		switch (this.state.keyType) {
			case "string":
				let r = await Transform.insert(this.config.name, this.state.keyType, this.state.key, this.state.value);
				if (!r) return;
				message.success("添加成功!");
				break;
			default:
				message.error("不支持的类型!");
				break;
		}

		Event.emit("insertKey", this.state.key);

		this.onClose();
	}
}
