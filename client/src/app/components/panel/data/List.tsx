import React, {Component} from "react";
import Event from "../../../event/Event";
import Transform from "../../../transform/Transform";
import "./list.scss";
import Panel from "../Panel";
import {AutoSizer, List as VList} from "react-virtualized";
import {Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Paper, Select, TextField,} from "@material-ui/core";
import Tools from "../../../tools/Tools";
import {ArrowLeft, ArrowRight} from "@material-ui/icons";


type Props = {
    type: string;
    keys: string;
    parent: Panel;
};

export default class List extends Component<Props> {
    constructor(props: Props) {
        super(props);
        this.type = this.props.type;
        this.key = this.props.keys;
        this.parent = this.props.parent;
    }

    componentDidMount() {
        this.select(this.type, this.key);
    }

    componentWillUnmount() {
    }

    parent: Panel;
    state = {
        key: "",
        showValue: "",
        list: [] as any[],
        page: 1,
        rename: false,
        addRow: false,
        addRowValue: "",
        view: "Text",
    };

    type = "";
    key = "";
    ttl = -1;
    size = 1000;
    len = 0;

    selectIndex = 0;
    page = 1;
    listIndex = 0;

    async select(type: string, key: string): Promise<void> {
        this.type = type;
        this.key = key;
        let len = await Transform.call(type, key, "len");
        this.len = len;
        let ttl = await Transform.ttl(key);
        this.ttl = ttl;

        this.page = this.state.page;
        let listArray = await Transform.select(type, key, this.state.page, this.size);
        if (listArray === false) return;

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

        let {list} = this.state;
        list = [];
        for (let i = 0; i < listArray.length; i++) {
            list.push({value: listArray[i], select: i === this.selectIndex});
        }

        this.setState({key, list, showValue: listArray[this.selectIndex]}, () => {
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
            value.style = Object.assign({background: "rgb(186, 231, 225)"}, value.style);
        }
        return (
            <div
                key={value.index}
                style={value.style}
                className="list-item"
                onClick={(el) => this.selectItem(el, value)}
            >
                <div className="key">{(this.page - 1) * this.size + value.index + 1}</div>
                <div className="value">{this.state.list[value.index].value}</div>
            </div>
        );
    };

    selectItem(el: React.MouseEvent<HTMLDivElement, MouseEvent>, value: any) {
        let {list} = this.state;
        list[this.selectIndex].select = false;

        this.selectIndex = value.index;
        list[value.index].select = true;

        this.listIndex = (this.page - 1) * this.size + value.index;

        this.setState({list, showValue: list[value.index].value}, () => {
            this.vlist.current?.forceUpdateGrid();
        });
    }

    async delRow() {
        if (this.len === 1) return this.deleteKey();
        let u = await Transform.update(this.type, this.key, this.listIndex, "@--LEMO-YXK--@");
        if (!u) return;
        let d = await Transform.delete(this.type, this.key, "@--LEMO-YXK--@");
        if (!d) return;

        if (this.listIndex === this.len - 1) {
            this.selectIndex--;
            this.listIndex--;
        }

        this.select(this.type, this.key);
        Tools.Message.Success("删除成功!");
    }

    async addRow() {
        let r = await Transform.insert(this.type, this.key, this.state.addRowValue);
        if (!r) return;

        this.state.addRowValue = "";
        this.selectIndex++;
        this.listIndex++;

        this.select(this.type, this.key);
        Tools.Message.Success("添加成功!");
        this.closeAddRow();
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
        if (page === "") return this.setState({page});
        page = parseInt(page) || 1;
        if (page < 1 || page > Math.ceil(this.len / this.size)) return;
        this.setState({page});
    }

    async save() {
        let r = await Transform.update(this.type, this.key, this.listIndex, this.state.showValue);
        if (!r) return;
        let {list} = this.state;
        list[this.selectIndex].value = this.state.showValue;
        this.setState({list}, () => {
            this.vlist.current?.forceUpdateGrid();
        });
        Tools.Message.Success("保存成功");
    }

    changeView(view: string): void {
        switch (view) {
            case "Json":
                try {
                    var v = JSON.parse(this.state.showValue);
                    this.setState({view: view, showValue: JSON.stringify(v, null, 4)});
                } catch (error) {
                    return;
                }
                break;
            case "Text":
                try {
                    var v = JSON.parse(this.state.showValue);
                    this.setState({view: view, showValue: JSON.stringify(v)});
                } catch (error) {
                    return;
                }
                break;
            default:
                break;
        }
    }

    async deleteKey() {
        var r = await Transform.call(this.type, this.key, "remove");
        if (!r) return;
        Event.emit("deleteKey", this.key);
        this.parent.remove(this.key);
    }

    async renameKey() {
        let oldKey = this.key;
        let newKey = this.state.key;

        if (oldKey === newKey) return this.closeRename();

        var r = await Transform.rename(oldKey, newKey);
        if (!r) return this.closeRename();
        Event.emit("insertKey", newKey, true);
        Event.emit("deleteKey", oldKey);
        Event.emit("activeKey", oldKey, false);
        Event.emit("activeKey", newKey, true);
        this.closeRename();
        this.parent.update(this.type, oldKey, newKey);

        this.key = newKey;
    }

    closeRename(): void {
        this.setState({rename: false});
    }

    openRename(): void {
        this.setState({rename: true});
    }

    closeAddRow(): void {
        this.setState({addRow: false});
    }

    openAddRow(): void {
        this.setState({addRow: true});
    }

    onChange(value: string): void {
        this.setState({showValue: value});
    }

    render() {
        return (
            <div className="list">
                <Dialog
                    open={this.state.rename}
                    onClose={() => this.closeRename()}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">重命名</DialogTitle>
                    <DialogContent style={{width: 500}}>
                        <div>{this.key}</div>
                        <div>{this.state.key}</div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.closeRename()} color="primary">
                            取消
                        </Button>
                        <Button onClick={() => this.renameKey()} color="primary" autoFocus>
                            确定
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={this.state.addRow}
                    onClose={() => this.closeAddRow()}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">添加行</DialogTitle>
                    <DialogContent style={{width: 500}}>
                        <TextField
                            fullWidth
                            label="value"
                            value={this.state.addRowValue}
                            onChange={(value) => this.setState({addRowValue: value.target.value})}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.closeAddRow()} color="primary">
                            取消
                        </Button>
                        <Button onClick={() => this.addRow()} color="primary" autoFocus>
                            确定
                        </Button>
                    </DialogActions>
                </Dialog>

                <Paper className="top">
                    <div className="top">
                        <div>
                            <TextField
                                id="standard-full-width"
                                value={this.state.key}
                                style={{margin: "0 5px 0 5px", width: 250}}
                                margin="normal"
                                onChange={(value) => this.setState({key: value.target.value})}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                size="small"
                            />

                            <Chip
                                label={`TYPE: ${this.type.toUpperCase()}`}
                                style={{margin: "0 5px 0 5px"}}
                                size="small"
                            />
                            <Chip label={`TTL: ${this.ttl}`} style={{margin: "0 5px 0 5px"}} size="small"/>
                            <Chip label={`SIZE: ${this.len}`} style={{margin: "0 5px 0 5px"}} size="small"/>
                        </div>

                        <div>
                            <Button
                                variant="contained"
                                onClick={() => this.openRename()}
                                style={{margin: "0 5px 0 5px"}}
                                size="small"
                            >
                                重命名
                            </Button>
                            <Button
                                onClick={() => this.select(this.type, this.state.key)}
                                style={{margin: "0 5px 0 5px"}}
                                variant="contained"
                                color="primary"
                                size="small"
                            >
                                刷新
                            </Button>

                            <Button
                                size="small"
                                variant="contained"
                                color="secondary"
                                style={{margin: "0 5px 0 5px"}}
                                onClick={() => {
                                    Tools.Modal.Show({
                                        Ok: () => this.deleteKey(),
                                        Title: `确定要删除 ${this.key} 吗?`
                                    })
                                }}
                            >
                                删除
                            </Button>

                            <Button
                                style={{margin: "0 5px 0 5px"}}
                                variant="contained"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    Tools.Modal.Show({
                                        Ok: () => this.save(),
                                        Title: `确定要保存吗?`
                                    })
                                }}
                            >
                                保存
                            </Button>
                        </div>
                    </div>
                    {/* <div className="bottom">
						<div className="left"></div>
						<div className="right"></div>
					</div> */}
                </Paper>
                <div className="content">
                    <Paper className="left">
                        {this.state.list.length > 0 ? (
                            <AutoSizer>
                                {({width, height}) => (
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
                    </Paper>
                    <Paper className="right">
						<textarea
                            spellCheck={false}
                            value={this.state.showValue}
                            onChange={(value) => this.onChange(value.target.value)}
                        />
                    </Paper>
                </div>
                <Paper className="bottom">
                    <div className="top">
                        <div className="left">
                            <Button onClick={this.prevPage}>
                                <ArrowLeft/>
                            </Button>
                            <input
                                onBlur={() => this.setPage(this.state.page || this.page)}
                                value={this.state.page}
                                onChange={(value) => this.setPage(value.target.value)}
                                style={{width: 50, textAlign: "center"}}
                            />
                            <Button onClick={this.nextPage}>
                                <ArrowRight/>
                            </Button>

                            <Button onClick={this.go}>GO</Button>
                            <Button
                                variant="outlined"
                                size="small"
                                color="primary"
                                onClick={() => this.openAddRow()}
                                style={{margin: "0 5px 0 5px"}}
                            >
                                添加行
                            </Button>

                            <Button
                                size="small"
                                variant="outlined"
                                color="secondary"
                                style={{margin: "0 5px 0 5px"}}
                                onClick={() => {
                                    Tools.Modal.Show({
                                        Ok: () => this.delRow(),
                                        Title: `确定要删除 ${this.state.showValue} 吗?`
                                    })
                                }}
                            >
                                删除行
                            </Button>
                        </div>
                        <div className="right">
                            <Select
                                value={this.state.view}
                                style={{width: 100, margin: "0 5px 0 5px"}}
                                onChange={(e: any) => this.changeView(e.target.value)}
                            >
                                <MenuItem value={"Text"}>Text</MenuItem>
                                <MenuItem value={"Json"}>Json</MenuItem>
                            </Select>
                        </div>
                    </div>
                    <div className="bottom"></div>
                </Paper>
            </div>
        );
    }
}
