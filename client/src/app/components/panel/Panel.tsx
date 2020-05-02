import React, { Component } from "react";
import "./panel.scss";
import Event from "../../event/Event";
import String from "./data/String";
import List from "./data/List";
import Hash from "./data/Hash";
import Set from "./data/Set";
import ZSet from "./data/ZSet";

import { Tabs, Tab, Paper } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

export default class Panel extends Component {
	state = { activeKey: "", panes: [] as any[] };
	serverName = "";
	maxPane = 5;

	createComponent(type: string, key: string) {
		let component = null;

		switch (type) {
			case "string":
				component = this.createString(type, key);
				break;
			case "list":
				component = this.createList(type, key);
				break;
			case "hash":
				component = this.createHash(type, key);
				break;
			case "zset":
				component = this.createZSet(type, key);
				break;
			case "set":
				component = this.createSet(type, key);
				break;
		}
		return component;
	}

	createString(type: string, key: string) {
		return <String parent={this} type={type} keys={key}></String>;
	}

	createList(type: string, key: string) {
		return <List parent={this} type={type} keys={key}></List>;
	}

	createHash(type: string, key: string) {
		return <Hash parent={this} type={type} keys={key}></Hash>;
	}

	createSet(type: string, key: string) {
		return <Set parent={this} type={type} keys={key}></Set>;
	}

	createZSet(type: string, key: string) {
		return <ZSet parent={this} type={type} keys={key}></ZSet>;
	}

	reset() {
		this.serverName = "";
		this.setState({ activeKey: "", panes: [] as any[] });
	}

	componentDidMount() {
		Event.add("selectKey", (serverName: string, type: string, key: string) => {
			this.serverName = serverName;

			if (this.state.panes.find((v) => v.key === key)) {
				this.setState({ activeKey: key });
				return;
			}

			const { panes } = this.state;

			let component = this.createComponent(type, key);

			panes.push({ title: key, content: component, key: key });

			if (panes.length > this.maxPane) panes.shift();

			this.setState({ panes: panes, activeKey: key });
		});
		Event.add("resetPanel", () => {
			this.reset();
		});
	}

	componentWillUnmount() {
		Event.remove("selectKey");
		Event.remove("resetPanel");
	}

	onChange = (activeKey: any) => {
		Event.emit("activeKey", activeKey, true);
		this.setState({ activeKey });
	};

	onEdit = (targetKey: any, action: string | number) => {
		if (action === "add") {
			this.add();
		} else {
			this.remove(targetKey);
		}
	};

	update(type: string, oldKey: string, newKey: string) {
		for (let i = 0; i < this.state.panes.length; i++) {
			const element = this.state.panes[i];
			if (element.key === oldKey) {
				element.title = newKey;
				element.key = newKey;
				element.content = this.createComponent(type, newKey);
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
		Event.emit("activeKey", activeKey, !(panes.length === 0));
	};

	a11yProps(index: any) {
		return {
			id: `scrollable-auto-tab-${index}`,
			"aria-controls": `scrollable-auto-tabpanel-${index}`,
		};
	}

	render() {
		return (
			<div className="panel">
				{/* <Tabs
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
				</Tabs> */}

				<Paper style={{ height: "48px", marginBottom: "5px" }}>
					<Tabs
						value={this.state.activeKey}
						indicatorColor="primary"
						textColor="primary"
						onChange={(e: any, activeKey: any) => e.stopPropagation() || this.onChange(activeKey)}
						variant="scrollable"
						scrollButtons="auto"
						style={{ height: "48px" }}
					>
						{this.state.panes.map(
							(
								pane: {
									title: React.ReactNode;
									key: string;
									content: React.ReactNode;
								},
								index: number
							) => (
								<Tab
									style={{ height: "100%" }}
									label={
										<TabTitle
											title={pane.title}
											onClick={(e: any) => e.stopPropagation() || this.remove(pane.key)}
										></TabTitle>
									}
									value={pane.key}
									key={pane.key}
									{...this.a11yProps(index)}
								/>
							)
						)}
					</Tabs>
				</Paper>
				<Paper style={{ height: "calc(100% - 48px - 5px)" }}>
					{this.state.panes.map(
						(
							pane: {
								title: React.ReactNode;
								key: string;
								content: React.ReactNode;
							},
							index: number
						) => (
							<TabPanel
								style={{ height: "100%" }}
								value={pane.key}
								key={pane.key}
								index={index}
								selected={this.state.activeKey}
							>
								{pane.content}
							</TabPanel>
						)
					)}
				</Paper>
			</div>
		);
	}
}

interface TabPanelProps {
	children?: React.ReactNode;
	index: any;
	value: any;
	selected: any;
	style: any;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, selected, style } = props;
	const content = value === selected ? children : null;
	return (
		<div
			role="tabpanel"
			hidden={value !== selected}
			id={`scrollable-auto-tabpanel-${index}`}
			aria-labelledby={`scrollable-auto-tab-${index}`}
			style={style}
		>
			{content}
		</div>
	);
}

function TabTitle(props: any) {
	const { title, onClick } = props;
	return (
		<div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", width: "100%" }}>
			<CloseIcon onClick={onClick} style={{ fontSize: 20, width: 30 }} />
			<div>{title}</div>
		</div>
	);
}
