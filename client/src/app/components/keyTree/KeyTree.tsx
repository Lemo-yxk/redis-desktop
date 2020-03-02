import React, { Component } from "react";
import { Rnd } from "react-rnd";
import "./keyTree.scss";
import { Tree, Select, Button } from "antd";
import Tools from "../../tools/Tools";
import Event from "../../event/Event";

const Option = Select.Option;

export default class KeyTree extends Component {
	state = {
		data: [{ title: "hello", key: "world" }],
		select: null
	};

	componentDidMount() {
		Event.add("connect", key => this.connect(key));
		Event.add("disconnect", key => this.disconnect(key));
		Event.add("update", key => this.update(key));
	}

	componentWillUnmount() {
		Event.remove("connect");
		Event.remove("disconnect");
		Event.remove("update");
	}

	connect(key: any) {
		this.setState({ select: this.createSelect(key) });
	}

	disconnect(key: any) {
		this.setState({ select: null });
	}

	update(key: any) {
		console.log("update", key);
	}

	render() {
		return (
			<Rnd
				default={{ height: "100%", width: "20%", x: 0, y: 0 }}
				minWidth={"20%"}
				maxWidth={"40%"}
				bounds=".content"
				enableResizing={{ right: true }}
				disableDragging={true}
				className="key-tree"
			>
				{this.state.select}
				{/* <Tree
					showLine={true}
					showIcon={false}
					blockNode={false}
					defaultExpandedKeys={["0-0-0"]}
					onSelect={value => this.onSelect(value)}
					treeData={this.state.data}
				/> */}
			</Rnd>
		);
	}

	createSelect(key: any) {
		return (
			<div className="select-panel">
				<Select
					defaultValue={"请选择DB"}
					style={{ width: "100%" }}
					listHeight={600}
					onSelect={value => this.selectDB(value)}
				>
					{Tools.Range(0, 16).map(v => (
						<Option key={v} value={v}>
							db({v})
						</Option>
					))}
				</Select>
				<Button type="link" danger>
					{key}
				</Button>
			</div>
		);
	}

	selectDB(value: any): void {
		console.log(value);
	}
}
