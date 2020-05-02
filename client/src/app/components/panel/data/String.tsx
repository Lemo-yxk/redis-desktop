import React, {Component} from "react";
import Event from "../../../event/Event";
import Transform from "../../../transform/Transform";
import "./string.scss";
import Panel from "../Panel";

import {Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Paper, Select, TextField,} from "@material-ui/core";
import Tools from "../../../tools/Tools";


type Props = {
    type: string;
    keys: string;
    parent: Panel;
};

export default class String extends Component<Props> {
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
    state = {key: "", showValue: "", rename: false, view: "Text"};

    type = "";
    key = "";
    ttl = -1;

    async select(type: string, key: string) {
        this.type = type;
        this.key = key;
        let value = await Transform.select(type, key);
        let ttl = await Transform.ttl(key);
        this.ttl = ttl;
        this.setState({key: key, showValue: value});
    }

    render() {
        return (
            <div className="string">
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
                <Paper className="content">
					<textarea
                        spellCheck={false}
                        value={this.state.showValue}
                        onChange={(value) => this.onChange(value.target.value)}
                    />
                </Paper>
                <Paper className="bottom">
                    <div className="top">
                        <div className="left"></div>
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
                </Paper>
            </div>
        );
    }

    async save() {
        let r = await Transform.update(this.type, this.key, this.state.showValue);
        if (!r) return;
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
        var r = await Transform.delete(this.type, this.key);
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

    onChange(value: string): void {
        this.setState({showValue: value});
    }
}
