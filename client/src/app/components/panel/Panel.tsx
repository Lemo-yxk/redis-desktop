import React, { Component } from "react";
import "./panel.scss";
import Event from "../../event/Event";
import String from "./data/String";
import List from "./data/List";
import { Tabs } from "antd";
const { TabPane } = Tabs;
export default class Panel extends Component {
	state = { activeKey: "", panes: [] as any[] };

	constructor(props: any) {
		super(props);
		Event.add("selectKey", (serverName: string, type: string, key: string) => {
			if (this.state.panes.find(v => v.key === key)) {
				this.setState({ activeKey: key });
				return;
			}
			let component = null;

			switch (type) {
				case "string":
					component = this.createString(serverName, type, key);
					break;
				case "list":
					component = <List></List>;
					break;
				case "hash":
					break;
				case "zset":
					break;
				case "set":
					break;
			}

			const { panes } = this.state;

			panes.push({ title: key, content: component, key: key });

			if (panes.length > 3) panes.shift();

			this.setState({ panes: panes, activeKey: key });
		});
	}

	createString(serverName: string, type: string, key: string) {
		return <String parent={this} serverName={serverName} type={type} keys={key}></String>;
	}

	componentDidMount() {}

	componentWillUnmount() {
		Event.remove("selectKey");
	}

	onChange = (activeKey: any) => {
		console.log(activeKey);
		this.setState({ activeKey });
	};

	onEdit = (targetKey: any, action: string | number) => {
		if (action === "add") {
			this.add();
		} else {
			this.remove(targetKey);
		}
	};

	update(serverName: string, type: string, oldKey: string, newKey: string) {
		for (let i = 0; i < this.state.panes.length; i++) {
			const element = this.state.panes[i];
			if (element.key === oldKey) {
				element.title = newKey;
				element.key = newKey;
				element.content = this.createString(serverName, type, newKey);
			}
		}
		this.setState({ panes: this.state.panes, activeKey: newKey });
	}

	add = () => {};

	remove = (targetKey: string) => {
		let activeKey = this.state.activeKey;
		let lastIndex: any;
		this.state.panes.forEach((pane: { key: string }, i: number) => {
			if (pane.key === targetKey) {
				lastIndex = i - 1;
			}
		});
		const panes = this.state.panes.filter((pane: { key: string }) => pane.key !== targetKey);
		if (panes.length && activeKey === targetKey) {
			if (lastIndex >= 0) {
				activeKey = panes[lastIndex].key;
			} else {
				activeKey = panes[0].key;
			}
		}
		this.setState({ panes, activeKey });
	};

	render() {
		return (
			<div className="panel">
				<Tabs
					onChange={this.onChange}
					activeKey={this.state.activeKey}
					type="editable-card"
					onEdit={this.onEdit}
					hideAdd
					style={{ height: "100%", width: "100%" }}
					tabBarStyle={{ margin: 0, minWidth: "200px" }}
					destroyInactiveTabPane={true}
					animated={false}
					tabBarGutter={0}
				>
					{this.state.panes.map(
						(pane: {
							title: React.ReactNode;
							key: string | undefined;
							closable: boolean | undefined;
							content: React.ReactNode;
						}) => (
							<TabPane
								style={{ height: "100%", width: "100%", position: "relative" }}
								tab={pane.title}
								key={pane.key}
								closable={pane.closable}
							>
								{pane.content}
							</TabPane>
						)
					)}
				</Tabs>
			</div>
		);
	}
}
