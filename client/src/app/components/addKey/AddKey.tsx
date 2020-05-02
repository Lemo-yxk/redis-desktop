import React, {Component} from "react";
import Event from "../../event/Event";
import "./addKey.scss";
import Transform from "../../transform/Transform";
import Config from "../config/Config";
import {config} from "../../interface/config";
import {Button, Dialog, DialogActions, DialogContent, FormControlLabel, Radio, RadioGroup, TextField,} from "@material-ui/core";
import Tools from "../../tools/Tools";

export default class AddKey extends Component {
    state = {visible: false, keyType: "string", key: "", k: "", v: ""};

    onClose() {
        this.setState({visible: false, key: "", k: "", v: ""});
    }

    onOpen() {
        this.config = Config.getCurrent();
        if (!this.config.name) {
            Tools.Message.Error("请连接服务器!");
            return this.onClose();
        }
        this.setState({visible: true});
    }

    componentDidMount() {
        Event.add("addKey", () => this.onOpen());
    }

    componentWillUnmount() {
        Event.remove("addKey");
    }

    config: config = {} as config;

    createNormal() {
        return (
            <div className="input-box-2">
                <div className="top">
                    <TextField
                        fullWidth
                        label="key"
                        value={this.state.key}
                        onChange={(value) => this.setState({key: value.target.value})}
                    />
                </div>
                <div className="bottom">
                    <TextField
                        fullWidth
                        label="value"
                        value={this.state.v}
                        onChange={(value) => this.setState({v: value.target.value})}
                    />
                </div>
            </div>
        );
    }

    createSpecial(a: string, b: string) {
        return (
            <div className="input-box-3">
                <div className="top">
                    <TextField
                        fullWidth
                        label="key"
                        value={this.state.key}
                        onChange={(value) => this.setState({key: value.target.value})}
                    />
                </div>
                <div className="bottom">
                    <TextField
                        style={{width: "49%"}}
                        label={a}
                        value={this.state.k}
                        onChange={(value) => {
                            var k = value.target.value;
                            if (this.state.keyType === "zset") {
                                this.setState({k: k});
                            } else {
                                this.setState({k: k});
                            }
                        }}
                    />

                    <TextField
                        style={{width: "49%"}}
                        label={b}
                        value={this.state.v}
                        onChange={(value) => this.setState({v: value.target.value})}
                    />
                </div>
            </div>
        );
    }

    createComponent() {
        switch (this.state.keyType) {
            case "string":
            case "list":
            case "set":
                return this.createNormal();
            case "hash":
                return this.createSpecial("key", "value");
            case "zset":
                return this.createSpecial("score", "value");
            default:
                return;
        }
    }

    render() {
        return (
            <Dialog
                open={this.state.visible}
                onClose={() => this.onClose()}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className="add-key"
            >
                {/* <DialogTitle id="alert-dialog-title">添加KEY</DialogTitle> */}
                <DialogContent style={{width: 500}}>
                    <div className="select-box">
                        <RadioGroup
                            row
                            aria-label="position"
                            name="position"
                            value={this.state.keyType}
                            onChange={(value) => this.setState({keyType: value.target.value})}
                        >
                            <FormControlLabel
                                value="string"
                                control={<Radio color="primary"/>}
                                label="string"
                                labelPlacement="top"
                            />
                            <FormControlLabel
                                value="list"
                                control={<Radio color="primary"/>}
                                label="list"
                                labelPlacement="top"
                            />
                            <FormControlLabel
                                value="set"
                                control={<Radio color="primary"/>}
                                label="set"
                                labelPlacement="top"
                            />
                            <FormControlLabel
                                value="hash"
                                control={<Radio color="primary"/>}
                                label="hash"
                                labelPlacement="top"
                            />
                            <FormControlLabel
                                value="zset"
                                control={<Radio color="primary"/>}
                                label="zset"
                                labelPlacement="top"
                            />
                        </RadioGroup>
                    </div>

                    {this.createComponent()}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => this.onClose()} color="primary">
                        取消
                    </Button>
                    <Button onClick={() => this.add()} color="primary" autoFocus>
                        确定
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    async add() {
        if (this.state.key === "") return Tools.Message.Error("请填写完整!");

        if (this.state.v === "") return Tools.Message.Error("请填写完整!");

        switch (this.state.keyType) {
            case "string":
            case "list":
            case "set":
                let n = await Transform.insert(this.state.keyType, this.state.key, this.state.v);
                if (!n) return;
                Tools.Message.Success("添加成功!");
                break;
            case "hash":
            case "zset":
                if (this.state.k === "") return Tools.Message.Error("请填写完整!");
                let s = await Transform.insert(this.state.keyType, this.state.key, this.state.k, this.state.v);
                if (!s) return;
                Tools.Message.Success("添加成功!");
                break;
            default:
                return Tools.Message.Error("不支持的类型!");
        }

        Event.emit("insertKey", this.state.key);

        this.onClose();
    }
}
