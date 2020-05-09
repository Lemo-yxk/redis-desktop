import React, {Component} from "react";
import Event from "../../event/Event";
import "./serverList.scss";
import Config from "../config/Config";
import Command from "../../services/Command";
import {config} from "../../interface/config";
import {Button, Collapse, Drawer, List, ListItem} from "@material-ui/core";
import {Theme, withStyles} from '@material-ui/core/styles';
import {AddOutlined, ArrowDownward, DeleteOutline, ExpandLess, ExpandMore} from '@material-ui/icons'

const useStyles = (theme: Theme) =>
    ({
        root: {
            width: '100%',
            backgroundColor: theme.palette.background.paper,
        },
        nested: {
            paddingLeft: theme.spacing(4),
        },
    })

class ServerList extends Component<any, any> {
    state = {index: -1, visible: false, configs: Config.getAllConfig() as { [key: string]: config }};

    onClose() {
        this.setState({visible: false});
    }

    onOpen() {
        this.setState({visible: true});
    }

    componentDidMount() {
        Event.add("openServerList", () => this.onOpen());
        Event.add("addServer", () => this.setState({configs: Config.getAllConfig()}));
        Event.add("updateServer", () => this.setState({configs: Config.getAllConfig()}));
    }

    componentWillUnmount() {
        Event.remove("openServerList");
        Event.remove("addServer");
        Event.remove("updateServer");
    }

    update(config: config) {
        // Event.emit("update", config.name);
        Event.emit("openAddServer", config);
        this.onClose();
    }

    connect(config: config) {
        Event.emit("connect", config.name, config.connectType);
        this.onClose();
    }

    disconnect(config: config) {
        // this.onClose();
        Event.emit("disconnect", config.name);
        Command.disconnect(config.name);
    }

    delete(config: config) {
        delete this.state.configs[config.name]
        this.setState({configs: this.state.configs});
        Config.setAllConfig(this.state.configs)
        Event.emit("delete", config.name);
        Command.disconnect(config.name);
    }

    setDefault(config: config) {
        for (const key in this.state.configs) {
            if (key === config.name) continue;
            this.state.configs[key].default = false;
        }
        config.default = !config.default;
        this.setState({configs: this.state.configs});
        Config.setAllConfig(this.state.configs)
    }

    addServer() {
        Event.emit("openAddServer");
        this.onClose();
    }


    render() {

        const classes = this.props.classes;

        let configs = Object.values(this.state.configs);

        return (

            <Drawer
                // anchor={this.status === "add" ? "left" : "right"}
                anchor={"right"}
                open={this.state.visible}
                onClose={() => this.onClose()}
            >

                <div className="server-list">
                    <div className="server-list-header">
                        <div className="right">
                            <Button variant="contained" onClick={() => this.addServer()}>
                                <AddOutlined/>
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() =>
                                    Event.emit("openModal", {
                                        Content: "确定导出所有配置?",
                                        Ok: () => {
                                            Command.export("config.json", JSON.stringify(this.state.configs));
                                        }
                                    })
                                }
                            >
                                <ArrowDownward/>
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() =>
                                    Event.emit("openModal", {
                                        Content: "确定清除所有配置?",
                                        Ok: () => {
                                            Config.deleteAllConfig();
                                            this.setState({configs: {}});
                                        }
                                    })
                                }
                            >
                                <DeleteOutline/>
                            </Button>
                        </div>
                    </div>

                    <List className={classes.root}>
                        {configs.map((config, index) => (
                            <div key={index}>
                                <ListItem key={config.name} button onClick={() => this.setState({index: this.state.index === index ? -1 : index})}>

                                    {this.state.index === index ? <ExpandLess/> : <ExpandMore/>}

                                    <div className="panel-title">

                                        <div style={{marginLeft:10}}>{config.default ? `${config.name} (默认)` : config.name}</div>
                                        <div>
                                            <Button
                                                color="primary"
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    this.connect(config);
                                                }}
                                            >
                                                连接
                                            </Button>
                                            <Button
                                                color="secondary"
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    this.disconnect(config);
                                                }}
                                            >
                                                断开
                                            </Button>
                                        </div>
                                    </div>
                                </ListItem>
                                <Collapse in={this.state.index === index} addEndListener={() => {
                                }}>
                                    <List component="div" disablePadding>
                                        <ListItem button className={classes.nested}>
                                            <div className="db-header" key={config.name}>
                                                <div>{config.name}</div>
                                                <div className="button">
                                                    <Button onClick={() => this.setDefault(config)}>
                                                        {config.default ? "取消默认" : "设为默认"}
                                                    </Button>
                                                    <Button onClick={() => this.update(config)}>
                                                        修改
                                                    </Button>


                                                    <Button onClick={() => {
                                                        Event.emit("openModal", {
                                                            Content: `确定要删除 ${config.name} 吗?`,
                                                            Ok: () => this.delete(config)
                                                        })
                                                    }}>
                                                        删除
                                                    </Button>
                                                </div>
                                            </div>
                                        </ListItem>
                                    </List>
                                </Collapse>
                            </div>
                        ))}
                    </List>
                </div>
            </Drawer>
        );
    }
}

export default withStyles(useStyles)(ServerList)