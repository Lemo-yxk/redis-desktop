import React, { Component } from "react";
import { Radio, Input, Button, Modal, message } from "antd";
import Event from "../../event/Event";
import "./addKey.scss";
import Transform from "../../transform/Transform";
import Config from "../config/Config";
import { config } from "../../interface/config";
import Tools from "../../tools/Tools";

export default class AddKey extends Component {
	state = { visible: false, keyType: "string", key: "", k: "", v: "" };

	onClose() {
		this.setState({ visible: false, key: "", k: "", v: "" });
	}

	onOpen() {
		this.config = Config.getCurrent();
		if (!this.config.name) {
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

	createNormal() {
		return (
			<div className="input-box-2">
				<div className="top">
					<Input
						spellCheck={false}
						addonBefore="KEY"
						placeholder="key"
						value={this.state.key}
						onChange={value => this.setState({ key: value.target.value })}
					/>
				</div>
				<div className="bottom">
					<Input
						spellCheck={false}
						addonBefore="VALUE"
						placeholder="value"
						value={this.state.v}
						onChange={value => this.setState({ v: value.target.value })}
					/>
				</div>
			</div>
		);
	}

	createSpecial() {
		return (
			<div className="input-box-3">
				<div className="top">
					<Input
						spellCheck={false}
						addonBefore="KEY"
						placeholder="key"
						value={this.state.key}
						onChange={value => this.setState({ key: value.target.value })}
					/>
				</div>
				<div className="bottom">
					<Input
						spellCheck={false}
						placeholder="k"
						value={this.state.k}
						onChange={value => {
							var k = value.target.value;
							if (this.state.keyType === "zset") {
								Tools.IsFloat(k) && this.setState({ k: k });
							} else {
								this.setState({ k: k });
							}
						}}
					/>
					<Input
						spellCheck={false}
						placeholder="v"
						value={this.state.v}
						onChange={value => this.setState({ v: value.target.value })}
					/>
				</div>
			</div>
		);
	}

	createComponent() {
		switch (this.state.keyType) {
			case "string":
			case "list":
			case "set":
				return this.createNormal();
			case "hash":
			case "zset":
				return this.createSpecial();
			default:
				return;
		}
	}

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
						<Radio.Button value="set">set</Radio.Button>
						<Radio.Button value="hash">hash</Radio.Button>
						<Radio.Button value="zset">zset</Radio.Button>
					</Radio.Group>
				</div>

				{this.createComponent()}

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
		if (this.state.key === "") return message.error("请填写完整!");

		if (this.state.v === "") return message.error("请填写完整!");

		switch (this.state.keyType) {
			case "string":
			case "list":
			case "set":
				let n = await Transform.insert(this.state.keyType, this.state.key, this.state.v);
				if (!n) return;
				message.success("添加成功!");
				break;
			case "hash":
			case "zset":
				if (this.state.k === "") return message.error("请填写完整!");
				let s = await Transform.insert(this.state.keyType, this.state.key, this.state.k, this.state.v);
				if (!s) return;
				message.success("添加成功!");
				break;
			default:
				return message.error("不支持的类型!");
		}

		Event.emit("insertKey", this.state.key);

		this.onClose();
	}
}
