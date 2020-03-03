import React, { Component } from "react";
import Event from "../../../event/Event";
import Transform from "../../../transform/Transform";
import "./string.scss";
import { Input, Button, Select } from "antd";
const { TextArea } = Input;

const Option = Select.Option;

export default class String extends Component {
	componentDidMount() {
		Event.add("string", (serverName: string, type: string, key: string) => this.select(serverName, type, key));
	}

	componentWillUnmount() {
		Event.remove("string");
	}

	state = { key: "", value: "" };

	serverName = "";
	type = "";

	async select(serverName: string, type: string, key: string) {
		this.serverName = serverName;
		this.type = type;

		let value = await Transform.select(serverName, type, key);

		this.setState({ key: key, value });
	}

	render() {
		return (
			<div className="string">
				<div className="top">
					<div className="top">
						<Input
							addonBefore={this.type.toUpperCase()}
							addonAfter={"TTL:-1"}
							value={this.state.key}
							spellCheck={false}
						/>
						<Button type="default">重命名</Button>
						<Button type="primary">刷新</Button>
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

	onChange(value: string): void {
		this.setState({ value: value });
	}
}
