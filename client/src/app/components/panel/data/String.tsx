import React, { Component } from "react";
import Event from "../../../event/Event";
import Transform from "../../../transform/Transform";
import "./string.scss";
import { Input, Button, Select, Modal, Popconfirm, message } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import Panel from "../Panel";
const { TextArea } = Input;

const Option = Select.Option;

type Props = {
	serverName: string;
	type: string;
	keys: string;
	parent: Panel;
};

export default class String extends Component<Props> {
	constructor(props: Props) {
		super(props);
		this.serverName = this.props.serverName;
		this.type = this.props.type;
		this.key = this.props.keys;
		this.parent = this.props.parent;
	}

	componentDidMount() {
		this.select(this.serverName, this.type, this.key);
	}

	componentWillUnmount() {}

	parent: Panel;
	state = { key: "", value: "", rename: false, view: "显示格式" };

	serverName = "";
	type = "";
	value = "";
	key = "";
	ttl = -1;

	async select(serverName: string, type: string, key: string) {
		this.serverName = serverName;
		this.type = type;
		this.key = key;
		let value = await Transform.select(serverName, type, key);
		this.value = value;
		let ttl = await Transform.ttl(serverName, key);
		this.ttl = ttl;
		this.setState({ key: key, value });
	}

	render() {
		return (
			<div className="string">
				<Modal
					visible={this.state.rename}
					maskClosable={false}
					closable={false}
					onOk={() => this.renameKey()}
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
							addonAfter={`TTL: ${this.ttl}`}
							value={this.state.key}
							spellCheck={false}
						/>
						<Button type="default" onClick={() => this.openRename()}>
							重命名
						</Button>
						<Button type="primary" onClick={() => this.select(this.serverName, this.type, this.state.key)}>
							刷新
						</Button>
						<Popconfirm
							title={`确定要删除 ${this.key} 吗?`}
							onConfirm={() => this.deleteKey()}
							okText="确定"
							cancelText="取消"
							icon={<QuestionCircleOutlined style={{ color: "red" }} />}
						>
							<Button type="dashed" danger>
								删除
							</Button>
						</Popconfirm>
					</div>
					<div className="bottom">
						<Select
							value={this.state.view}
							style={{ width: 100 }}
							onSelect={value => this.changeView(value)}
						>
							<Option key="plain/text" value="plain/text">
								plain/text
							</Option>
							<Option key="json" value="json">
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
						<Button type="primary" onClick={() => this.save()}>
							保存
						</Button>
					</div>
					<div className="bottom"></div>
				</div>
			</div>
		);
	}
	async save() {
		let r = await Transform.update(this.serverName, this.type, this.key, this.state.value);
		if (!r) return;
		this.value = this.state.value;
		message.success("保存成功");
	}
	changeView(view: string): void {
		if (view === "json") {
			this.state.value = JSON.stringify(JSON.parse(this.state.value), null, 4);
		}
		this.setState({ view: view, value: this.state.value });
	}

	async insert(serverName: string, type: string, key: string, value: string) {
		return await Transform.insert(serverName, type, key, value);
	}

	async delete(serverName: string, type: string, key: string) {
		return await Transform.delete(serverName, type, key);
	}

	async deleteKey() {
		var r = await Transform.delete(this.serverName, this.type, this.state.key);
		if (!r) return;
		Event.emit("deleteKey", this.key);
		this.parent.remove(this.key);
	}

	async renameKey() {
		let oldKey = this.key;
		let newKey = this.state.key;
		this.key = this.state.key;
		var r = await Transform.rename(this.serverName, oldKey, newKey);
		if (!r) return this.closeRename();
		Event.emit("insertKey", newKey);
		Event.emit("deleteKey", oldKey);
		this.closeRename();
		this.parent.update(this.serverName, this.type, oldKey, newKey);
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
