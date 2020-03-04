import React, { Component } from "react";
import Event from "../../../event/Event";
import Transform from "../../../transform/Transform";
import "./string.scss";
import { Input, Button, Select, Modal } from "antd";
const { TextArea } = Input;

const Option = Select.Option;

export default class String extends Component {
	componentDidMount() {
		Event.add("string", (serverName: string, type: string, key: string) => this.select(serverName, type, key));
	}

	componentWillUnmount() {
		Event.remove("string");
	}

	state = { key: "", value: "", rename: false };

	serverName = "";
	type = "";
	value = "";
	key = "";

	async select(serverName: string, type: string, key: string) {
		this.serverName = serverName;
		this.type = type;
		this.key = key;
		let value = await Transform.select(serverName, type, key);
		this.value = value;
		this.setState({ key: key, value });
	}

	render() {
		return (
			<div className="string">
				<Modal
					visible={this.state.rename}
					maskClosable={false}
					closable={false}
					onOk={() => this.rename()}
					onCancel={() => this.closeRename()}
					width={300}
					okText="确定"
					cancelText="取消"
				>
					<Input
						spellCheck={false}
						value={this.state.key}
						onChange={value => this.setState({ key: value.target.value })}
					></Input>
				</Modal>
				<div className="top">
					<div className="top">
						<Input
							addonBefore={this.type.toUpperCase()}
							addonAfter={"TTL:-1"}
							value={this.state.key}
							spellCheck={false}
						/>
						<Button type="default" onClick={() => this.openRename()}>
							重命名
						</Button>
						<Button type="primary" onClick={() => this.select(this.serverName, this.type, this.state.key)}>
							刷新
						</Button>
						<Button type="dashed" danger>
							删除
						</Button>
					</div>
					<div className="bottom">
						<Select defaultValue="显示格式" style={{ width: 100 }}>
							<Option key="plain/text" value="plain/text">
								plain/text
							</Option>
							<Option key="json" value="plain/text">
								json
							</Option>
						</Select>
					</div>
				</div>
				<div className="content">
					<TextArea
						spellCheck={false}
						value={this.state.value}
						onChange={value => this.onChange(value.target.value)}
					/>
				</div>
				<div className="bottom">
					<div className="top">
						<Button type="primary">保存</Button>
					</div>
					<div className="bottom"></div>
				</div>
			</div>
		);
	}

	async insert(serverName: string, type: string, key: string, value: string) {
		return await Transform.insert(serverName, type, key, value);
	}

	async delete(serverName: string, type: string, key: string) {
		return await Transform.delete(serverName, type, key);
	}

	async rename() {
		var r = await Transform.rename(this.serverName, this.key, this.state.key);
		if (!r) return this.closeRename;

		Event.emit("deleteKey", this.key);
		Event.emit("insertKey", this.state.key);

		this.key = this.state.key;
		this.closeRename();
	}

	closeRename(): void {
		this.setState({ rename: false });
	}

	openRename(): void {
		this.setState({ rename: true });
	}

	onChange(value: string): void {
		this.setState({ value: value });
	}
}
