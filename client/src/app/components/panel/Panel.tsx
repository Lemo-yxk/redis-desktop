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

			const { panes } = this.state;

			let component = this.createComponent(serverName, type, key);

			panes.push({ title: key, content: component, key: key });

			if (panes.length > 3) panes.shift();

			this.setState({ panes: panes, activeKey: key });
		});
	}

	createComponent(serverName: string, type: string, key: string) {
		let component = null;

		switch (type) {
			case "string":
				component = this.createString(serverName, type, key);
				break;
			case "list":
				component = this.createList(serverName, type, key);
				break;
			case "hash":
				break;
			case "zset":
				break;
			case "set":
				break;
		}
		return component;
	}

	createString(serverName: string, type: string, key: string) {
		return <String parent={this} serverName={serverName} type={type} keys={key}></String>;
	}

	createList(serverName: string, type: string, key: string) {
		return <List parent={this} serverName={serverName} type={type} keys={key}></List>;
	}

	componentDidMount() {}

	componentWillUnmount() {
		Event.remove("selectKey");
	}

	onChange = (activeKey: any) => {
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
				element.content = this.createComponent(serverName, type, newKey);
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
