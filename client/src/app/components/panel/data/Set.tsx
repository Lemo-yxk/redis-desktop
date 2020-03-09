import React, { Component } from "react";
import Event from "../../../event/Event";
import Transform from "../../../transform/Transform";
import "./set.scss";
import { Input, Button, Select, Modal, Popconfirm, message } from "antd";
import { QuestionCircleOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import Panel from "../Panel";
import { List as VList, AutoSizer } from "react-virtualized";

const { TextArea } = Input;

const Option = Select.Option;

type Props = {
	type: string;
	keys: string;
	parent: Panel;
};

export default class Set extends Component<Props> {
	constructor(props: Props) {
		super(props);
		this.type = this.props.type;
		this.key = this.props.keys;
		this.parent = this.props.parent;
	}

	componentDidMount() {
		this.loadAllData(this.type, this.key);
	}

	componentWillUnmount() {}

	parent: Panel;
	state = {
		key: "",
		showValue: "",
		list: [] as any[],
		page: 1,
		rename: false,
		addRow: false,
		addRowValue: "",
		view: "显示格式"
	};

	type = "";
	key = "";
	ttl = -1;
	size = 1000;
	len = 0;

	selectIndex = 0;
	page = 1;
	listIndex = 0;

	allData: any[] = [];

	async loadAllData(type: string, key: string) {
		this.allData = [];
		var cursor = 0;
		var res: any = {};
		while (1) {
			let r = await Transform.select(type, key, cursor);
			if (!r) return;
			cursor = parseInt(r[0]);
			for (let i = 0; i < r[1].length; i++) {
				const value = r[1][i];
				res[value] = value;
			}
			if (cursor === 0) break;
		}

		for (const key in res) {
			this.allData.push(key);
		}

		this.select(type, key);
	}

	async select(type: string, key: string): Promise<void> {
		this.type = type;
		this.key = key;
		let len = await Transform.call(type, key, "len");
		this.len = len;
		let ttl = await Transform.ttl(key);
		this.ttl = ttl;

		this.page = this.state.page;
		let listArray = this.allData.slice((this.page - 1) * this.size, (this.page - 1) * this.size + this.size);
		if (this.selectIndex >= listArray.length - 1) {
			if (listArray.length === 0) {
				if (this.state.page > 1) {
					this.selectIndex = 0;
					this.state.page--;
					return await this.select(type, key);
				}
				return;
			} else {
				this.selectIndex = listArray.length - 1;
			}
		}

		if (this.selectIndex >= listArray.length - 1) this.selectIndex = listArray.length - 1;
		this.listIndex = (this.page - 1) * this.size + this.selectIndex;

		let { list } = this.state;
		list = [];
		for (let i = 0; i < listArray.length; i++) {
			list.push({ value: listArray[i], select: i === this.selectIndex });
		}

		this.setState({ key, list, showValue: listArray[this.selectIndex] }, () => {
			this.vlist.current?.forceUpdateGrid();
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

		this.setState({ list, showValue: list[value.index].value }, () => {
			this.vlist.current?.forceUpdateGrid();
		});
	}

	async delRow() {
		let item = this.state.list[this.selectIndex];
		if (this.len === 1) return this.deleteKey();
		let d = await Transform.delete(this.type, this.key, item.value);
		if (d === false) return;

		this.allData.splice(this.listIndex, 1);

		if (this.listIndex === this.len - 1) {
			this.selectIndex--;
			this.listIndex--;
		}

		this.select(this.type, this.key);
		message.success("删除成功!");
	}

	async addRow() {
		let r = await Transform.insert(this.type, this.key, this.state.addRowValue);
		if (r === false) return;
		if (r === 0) {
			this.filter(this.state.addRowValue);
		}

		this.allData.splice(this.listIndex, 0, this.state.addRowValue);

		this.state.addRowValue = "";
		this.selectIndex++;
		this.listIndex++;

		this.select(this.type, this.key);
		message.success("添加成功!");
		this.closeAddRow();
	}

	filter(value: string) {
		for (let i = 0; i < this.allData.length; i++) {
			const element = this.allData[i];
			if (element === value) {
				this.allData.splice(i, 1);
				break;
			}
		}
	}

	prevPage = () => {
		if (this.state.page <= 1 || !this.state.page) return;
		this.state.page--;
		this.setPage(this.state.page);
		this.go();
	};

	nextPage = () => {
		if (this.state.page >= Math.ceil(this.len / this.size) || !this.state.page) return;
		this.state.page++;
		this.setPage(this.state.page);
		this.go();
	};

	go = () => {
		this.select(this.type, this.key);
	};

	setPage(page: any) {
		if (page === "") return this.setState({ page });
		page = parseInt(page) || 1;
		if (page < 1 || page > Math.ceil(this.len / this.size)) return;
		this.setState({ page });
	}

	async save() {
		let item = this.state.list[this.selectIndex];

		// delete
		let d = await Transform.delete(this.type, this.key, item.value);
		if (d === false) return;

		this.allData.splice(this.listIndex, 1);

		// add
		let r = await Transform.insert(this.type, this.key, this.state.showValue);
		if (r === false) return;
		if (r === 0) {
			this.filter(this.state.showValue);
		}
		this.allData.splice(this.listIndex, 0, this.state.showValue);

		this.select(this.type, this.key);

		message.success("保存成功");
	}

	changeView(view: string): void {
		switch (view) {
			case "json":
				try {
					var v = JSON.parse(this.state.showValue);
					this.setState({ view: view, showValue: JSON.stringify(v, null, 4) });
				} catch (error) {
					return;
				}
				break;
			case "text":
				try {
					var v = JSON.parse(this.state.showValue);
					this.setState({ view: view, showValue: JSON.stringify(v) });
				} catch (error) {
					return;
				}
				break;
			default:
				break;
		}
	}

	async deleteKey() {
		var r = await Transform.call(this.type, this.state.key, "remove");
		if (!r) return;
		Event.emit("deleteKey", this.key);
		this.parent.remove(this.key);
	}

	async renameKey() {
		let oldKey = this.key;
		let newKey = this.state.key;
		this.key = this.state.key;
		var r = await Transform.rename(oldKey, newKey);
		if (!r) return this.closeRename();
		Event.emit("insertKey", newKey, true);
		Event.emit("deleteKey", oldKey);
		this.closeRename();
		this.parent.update(this.type, oldKey, newKey);
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
		this.setState({ showValue: value });
	}

	render() {
		return (
			<div className="set">
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
						<Button type="primary" onClick={() => this.loadAllData(this.type, this.state.key)}>
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
							<Popconfirm
								title={`确定要删除 ${this.state.showValue} 吗?`}
								onConfirm={() => this.delRow()}
								okText="确定"
								cancelText="取消"
								icon={<QuestionCircleOutlined style={{ color: "red" }} />}
							>
								<Button>删除行</Button>
							</Popconfirm>
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
										rowCount={this.state.list.length}
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
							value={this.state.showValue}
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
							<Popconfirm
								title={`确定要保存吗?`}
								onConfirm={() => this.save()}
								okText="确定"
								cancelText="取消"
								icon={<QuestionCircleOutlined style={{ color: "red" }} />}
							>
								<Button type="primary">保存</Button>
							</Popconfirm>
						</div>
					</div>
					<div className="bottom"></div>
				</div>
			</div>
		);
	}
}
