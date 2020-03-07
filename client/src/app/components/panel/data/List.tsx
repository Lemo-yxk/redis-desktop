import React, { Component } from "react";
import Event from "../../../event/Event";
import Transform from "../../../transform/Transform";
import "./list.scss";
import { Input, Button, Select, Modal, Popconfirm, message } from "antd";
import { QuestionCircleOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import Panel from "../Panel";
import { List as VList, AutoSizer } from "react-virtualized";

const { TextArea } = Input;

const Option = Select.Option;

type Props = {
	serverName: string;
	type: string;
	keys: string;
	parent: Panel;
};

export default class List extends Component<Props> {
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
	state = {
		key: "",
		value: "",
		list: [] as any[],
		page: 1,
		rename: false,
		addRow: false,
		addRowValue: "",
		view: "显示格式"
	};

	serverName = "";
	type = "";
	value = "";
	key = "";
	ttl = -1;
	size = 1000;
	len = 0;

	selectIndex = 0;
	page = 1;
	listIndex = 0;

	async select(serverName: string, type: string, key: string) {
		this.serverName = serverName;
		this.type = type;
		this.key = key;
		let len = await Transform.call(serverName, type, key, "len");
		this.len = len;
		let ttl = await Transform.ttl(serverName, key);
		this.ttl = ttl;
		this.page = this.state.page;
		let listArray = await Transform.select(serverName, type, key, this.state.page, this.size);
		var size = this.size;

		this.size = listArray.length;
		let { list } = this.state;
		list = [];
		for (let i = 0; i < listArray.length; i++) {
			list.push({ value: listArray[i], select: i === this.selectIndex });
		}

		this.value = listArray[this.selectIndex];

		this.setState({ key, list, value: this.value }, () => {
			this.vlist.current?.forceUpdateGrid();
			if (listArray.length < size) {
				this.size = size;
			}
		});
	}

	vlist: React.RefObject<VList> = React.createRef();

	onScroll = (value: any) => {
		// console.log(value);
		// clientHeight + scrollTop = scrollHeight
	};

	renderItem = (value: any) => {
		if (value.index > this.state.list.length - 1) return;

		if (this.state.list[value.index].select) {
			value.style = Object.assign({ background: "rgb(186, 231, 225)" }, value.style);
		}
		return (
			<div key={value.index} style={value.style} className="list-item" onClick={el => this.selectItem(el, value)}>
				<div className="key">{(this.page - 1) * this.size + value.index + 1}</div>
				<div className="value">{this.state.list[value.index].value}</div>
			</div>
		);
	};

	selectItem(el: React.MouseEvent<HTMLDivElement, MouseEvent>, value: any) {
		let { list } = this.state;
		list[this.selectIndex].select = false;

		this.selectIndex = value.index;
		list[value.index].select = true;

		this.listIndex = (this.page - 1) * this.size + value.index;

		this.setState({ list, value: list[value.index].value }, () => {
			this.vlist.current?.forceUpdateGrid();
		});
	}

	async delRow() {
		if (this.len === 1) return this.deleteKey();
		let u = await Transform.update(this.serverName, this.type, this.key, this.listIndex, "@--LEMO-YXK--@");
		if (!u) return;
		let d = await Transform.delete(this.serverName, this.type, this.key, "@--LEMO-YXK--@");
		if (!d) return;
		if (this.listIndex === this.len - 1) {
			this.selectIndex--;
			this.listIndex--;
		}

		this.select(this.serverName, this.type, this.key);
		message.success("删除成功!");
	}

	render() {
		return (
			<div className="list">
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

				<Modal
					visible={this.state.addRow}
					maskClosable={false}
					closable={false}
					onOk={() => this.addRow()}
					onCancel={() => this.closeAddRow()}
					width={300}
					okText="确定"
					cancelText="取消"
				>
					<Input
						spellCheck={false}
						value={this.state.addRowValue}
						onChange={value => this.setState({ addRowValue: value.target.value })}
					></Input>
				</Modal>

				<div className="top">
					<div className="top">
						<Input
							addonBefore={this.type.toUpperCase()}
							addonAfter={`TTL: ${this.ttl} SIZE: ${this.len}`}
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
						<div className="left">
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
							<Button onClick={() => this.delRow()}>删除行</Button>
							<Button onClick={() => this.openAddRow()}>添加行</Button>
						</div>

						<div className="right"></div>
					</div>
				</div>
				<div className="content">
					<div className="left">
						{this.state.list.length > 0 ? (
							<AutoSizer>
								{({ width, height }) => (
									<VList
										ref={this.vlist}
										// className={styles.List}
										height={height}
										width={width}
										overscanRowCount={20}
										// noRowsRenderer={this._noRowsRenderer}
										rowCount={this.size}
										rowHeight={height / 20}
										rowRenderer={this.renderItem}
										// scrollToIndex={this.selectIndex}
										scrollToAlignment="end"
										onScroll={this.onScroll}
									/>
								)}
							</AutoSizer>
						) : null}
					</div>
					<div className="right">
						<TextArea
							spellCheck={false}
							value={this.state.value}
							onChange={value => this.onChange(value.target.value)}
						/>
					</div>
				</div>
				<div className="bottom">
					<div className="top">
						<div className="left">
							<Button onClick={this.prevPage}>
								<LeftOutlined />
							</Button>
							<Button onClick={this.nextPage}>
								<RightOutlined />
							</Button>
							<Input
								onBlur={() => this.setPage(this.state.page || this.page)}
								value={this.state.page}
								onChange={value => this.setPage(value.target.value)}
							></Input>
							<Button onClick={this.go}>GO</Button>
						</div>
						<div className="right">
							<Button type="primary" onClick={() => this.save()}>
								保存
							</Button>
						</div>
					</div>
					<div className="bottom"></div>
				</div>
			</div>
		);
	}

	async addRow() {
		let r = await Transform.insert(this.serverName, this.type, this.key, this.state.addRowValue);
		if (!r) return;
		this.select(this.serverName, this.type, this.key);
		message.success("添加成功!");
		this.closeAddRow();
		this.state.addRowValue = "";
		this.selectIndex++;
		this.listIndex++;
	}

	prevPage = () => {
		let { page } = this.state;
		if (page <= 1 || !page) return;
		page--;
		this.setPage(page);
		this.go();
	};

	nextPage = () => {
		let { page } = this.state;
		if (page >= Math.ceil(this.len / this.size) || !page) return;
		page++;
		this.setPage(page);
		this.go();
	};

	go = () => {
		this.select(this.serverName, this.type, this.key);
	};
	setPage(page: any) {
		if (page === "") return this.setState({ page });
		page = parseInt(page) || 1;
		if (page < 1 || page > Math.ceil(this.len / this.size)) return;
		this.setState({ page });
	}

	async save() {
		let r = await Transform.update(this.serverName, this.type, this.key, this.listIndex, this.state.value);
		if (!r) return;
		this.value = this.state.value;
		let { list } = this.state;
		list[this.selectIndex].value = this.value;
		this.setState({ list }, () => {
			this.vlist.current?.forceUpdateGrid();
		});
		message.success("保存成功");
	}

	changeView(view: string): void {
		if (view === "json") {
			this.setState({ view: view, value: JSON.stringify(JSON.parse(this.state.value), null, 4) });
		}
	}

	async deleteKey() {
		var r = await Transform.call(this.serverName, this.type, this.state.key, "remove");
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

	closeAddRow(): void {
		this.setState({ addRow: false });
	}

	openAddRow(): void {
		this.setState({ addRow: true });
	}

	onChange(value: string): void {
		this.setState({ value: value });
	}
}
