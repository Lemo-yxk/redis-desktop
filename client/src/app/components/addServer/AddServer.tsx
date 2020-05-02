import React, {Component} from "react";
import Event from "../../event/Event";
import "./addServer.scss";
import Config from "../config/Config";
import Command from "../../services/Command";
import Tools from "../../tools/Tools";
import {config} from "../../interface/config";
import {Button, Drawer, MenuItem, Select, Tab, Tabs, TextField} from "@material-ui/core";
import {AddCircleOutline, RemoveCircleOutline} from "@material-ui/icons";

export default class AddServer extends Component {
    emptyData = {
        visible: false,
        name: "",
        host: "",
        port: "",
        password: "",
        master: "",
        cluster: [] as string[],
        connectType: "normal",
        defaultSplit: "",
        defaultFilter: "",
        connectTimeout: "",
        execTimeout: "",
        defaultDB: "",
        default: false,
    };

    state = {
        ...JSON.parse(JSON.stringify(this.emptyData)),
        index: 0,
    };

    status = "";

    statusMap: { [key: string]: string } = {add: "添加", update: "修改"};

    onClose() {
        Event.emit("openServerList");
        this.setState(JSON.parse(JSON.stringify(this.emptyData)));
    }

    onOpen(config: config) {
        this.status = "add";
        if (config) this.status = "update";
        this.setState({visible: true, ...config});
    }

    componentDidMount() {
        Event.add("openAddServer", (config: config) => this.onOpen(config));
    }

    componentWillUnmount() {
        Event.remove("openAddServer");
    }

    render() {
        return (
            <Drawer
                // anchor={this.status === "add" ? "left" : "right"}
                anchor={"right"}
                open={this.state.visible}
                onClose={() => this.onClose()}
                title={`${this.statusMap[this.status]}服务器`}
            >
                <div className="add-server">
                    <Tabs
                        value={this.state.index}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        onChange={(e, value) => this.setState({index: value})}
                    >
                        <Tab label="基本设置" key={0} value={0} {...a11yProps(0)} />
                        <Tab label="高级设置" key={1} value={1} {...a11yProps(1)} />
                    </Tabs>
                    <TabPanel value={this.state.index} index={0}>
                        <div className="normal-form">
                            <Select
                                value={this.state.connectType}
                                style={{width: "100%", height: '48px'}}
                                onChange={(e) => this.setState({connectType: e.target.value})}
                            >
                                <MenuItem key={"normal"} value={"normal"}>
                                    normal
                                </MenuItem>
                                <MenuItem key={"cluster"} value={"cluster"}>
                                    cluster
                                </MenuItem>
                            </Select>

                            <TextField
                                fullWidth
                                label={"Name"}
                                placeholder="127.0.0.1"
                                value={this.state.name}
                                onChange={(value) => this.changeName(value.target.value)}
                            />

                            {this.state.connectType === "normal" ? (
                                <TextField
                                    fullWidth
                                    label={"Host"}
                                    placeholder="127.0.0.1"
                                    value={this.state.host}
                                    onChange={(value) => this.changeHost(value.target.value)}
                                />
                            ) : (
                                <div className="add-input-box">
                                    <div className="add">
                                        <AddCircleOutline onClick={() => this.addCluster()}/>
                                    </div>
                                    <div className="input">
                                        {this.state.cluster.map((v: any, i: number) => (
                                            <div>
                                                <TextField
                                                    style={{width: "80%"}}
                                                    key={i}
                                                    placeholder="127.0.0.1:16379"
                                                    value={this.state.cluster[i]}
                                                    onChange={(value) => this.changeCluster(i, value.target.value)}
                                                />
                                                <RemoveCircleOutline
                                                    style={{width: "20%"}}
                                                    onClick={() => this.removeCluster(i)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {this.state.connectType === "normal" ? (
                                <TextField
                                    fullWidth
                                    label={"Port"}
                                    placeholder="6379"
                                    value={this.state.port}
                                    onChange={(value) => this.changePort(value.target.value)}
                                />
                            ) : (
                                <TextField
                                    fullWidth
                                    label={"Master"}
                                    placeholder="master"
                                    value={this.state.master}
                                    onChange={(value) => this.changeMaster(value.target.value)}
                                />
                            )}

                            <TextField
                                fullWidth
                                label={"Pass"}
                                placeholder="password"
                                value={this.state.password}
                                onChange={(value) => this.changePassword(value.target.value)}
                            />
                        </div>
                    </TabPanel>
                    <TabPanel value={this.state.index} index={1}>
                        <div className="normal-form">
                            <TextField
                                fullWidth
                                label={"默认过滤"}
                                placeholder="*"
                                value={this.state.defaultFilter}
                                onChange={(value) => this.changeDefaultFilter(value.target.value)}
                            />
                            <TextField
                                fullWidth
                                label={"默认分隔"}
                                placeholder=":"
                                value={this.state.defaultSplit}
                                onChange={(value) => this.changeDefaultSplit(value.target.value)}
                            />
                            <TextField
                                fullWidth
                                label={"连接超时"}
                                placeholder="3000"
                                value={this.state.connectTimeout}
                                onChange={(value) => this.changeConnectTime(value.target.value)}
                            />
                            <TextField
                                fullWidth
                                label={"执行超时"}
                                placeholder="3000"
                                value={this.state.execTimeout}
                                onChange={(value) => this.changeExecTimeout(value.target.value)}
                            />
                            <TextField
                                fullWidth
                                label={"默认DB"}
                                placeholder="0"
                                value={this.state.defaultDB}
                                onChange={(value) => this.changeDefaultDB(value.target.value)}
                            />
                        </div>
                    </TabPanel>
                    <div className="button-box">
                        <Button variant="contained" color="primary" onClick={() => this.submit()}>
                            {this.statusMap[this.status]}
                        </Button>
                        <Button variant="contained" onClick={() => this.test()}>
                            测试
                        </Button>
                    </div>
                </div>
            </Drawer>
        );
    }

    changeDefaultDB(value: string): void {
        this.setState({defaultDB: Tools.IsNumber(value) ? value : ""});
    }

    changeExecTimeout(value: string): void {
        this.setState({execTimeout: Tools.IsNumber(value) ? value : ""});
    }

    changeConnectTime(value: string): void {
        this.setState({connectTimeout: Tools.IsNumber(value) ? value : ""});
    }

    changeDefaultSplit(value: string): void {
        console.log(value);
        this.setState({defaultSplit: value});
    }

    changeDefaultFilter(value: string): void {
        this.setState({defaultFilter: value});
    }

    changePassword(value: string): void {
        this.setState({password: value});
    }

    changeMaster(value: string): void {
        this.setState({master: value});
    }

    changePort(value: string): void {
        this.setState({port: Tools.IsNumber(value) ? value : ""});
    }

    changeHost(value: string): void {
        this.setState({host: value});
    }

    changeName(value: string): void {
        this.setState({name: value});
    }

    changeCluster(i: number, value: string) {
        this.state.cluster[i] = value;
        this.setState({cluster: this.state.cluster});
    }

    removeCluster(i: number): void {
        this.state.cluster.splice(i, 1);
        this.setState({cluster: this.state.cluster});
    }

    addCluster(): void {
        this.state.cluster.push("");
        this.setState({cluster: this.state.cluster});
    }

    async test() {
        let data = {
            name: this.state.name,
            host: this.state.host,
            port: this.state.port,
            password: this.state.password,
            master: this.state.master,
            cluster: this.state.cluster.filter((v: string) => v !== ""),
            connectType: this.state.connectType,
            default: this.state.default,
            defaultSplit: this.state.defaultSplit || ":",
            defaultFilter: this.state.defaultFilter || "*",
            connectTimeout: this.state.connectTimeout || "3000",
            execTimeout: this.state.execTimeout || "3000",
            defaultDB: this.state.defaultDB,
        };

        let response = await Command.register(this.state.connectType, data);

        return Tools.Notification(response, "连接成功");
    }

    async submit() {
        var data = {
            name: this.state.name,
            host: this.state.host,
            port: this.state.port,
            password: this.state.password,
            master: this.state.master,
            connectType: this.state.connectType,
            cluster: this.state.cluster.filter((v: string) => v !== ""),
            default: this.state.default,
            defaultSplit: this.status === "add" ? this.state.defaultSplit || ":" : this.state.defaultSplit,
            defaultFilter: this.state.defaultFilter || "*",
            connectTimeout: this.state.connectTimeout || "3000",
            execTimeout: this.state.execTimeout || "3000",
            defaultDB: this.status === "add" ? this.state.defaultDB || "0" : this.state.defaultDB,
        };

        if (this.state.name === "") return Tools.Message.Error(`服务器名不能为空!`);

        let cfg = Config.getConfig(this.state.name);

        if (this.status === "add")
            if (cfg) return Tools.Message.Error(`${this.state.name} 已经存在!`);

        Config.setConfig(this.state.name, data);

        this.onClose();

        Event.emit("addServer", this.state.name);

        return Tools.Message.Success(`${this.statusMap[this.status]}成功`);
    }
}

interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {children}
        </div>
    );
}

function a11yProps(index: any) {
    return {
        id: `full-width-tab-${index}`,
        "aria-controls": `full-width-tabpanel-${index}`,
    };
}
