import React, {Component} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import Event from "../../event/Event";
import {ModalConfig} from "../../interface/modal";

export default class Modal extends Component {

    state = {
        visible: false
    }

    close() {
        this.config = {} as ModalConfig
        this.setState({visible: false})
    }

    config = {} as ModalConfig

    open(config: ModalConfig) {
        this.config = config
        this.setState({visible: true})
    }

    componentDidMount() {
        Event.add("openModal", (config) => this.open(config));
    }

    componentWillUnmount() {
        Event.remove("openModal");
    }

    render() {
        return <Dialog
            open={this.state.visible}
            onClose={() => this.close()}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >

            {this.config.Title ? <DialogTitle id="alert-dialog-title">{this.config.Title}</DialogTitle> : null}

            <DialogContent style={{width: 500}}>
                {this.config.Content}
            </DialogContent>
            {this.config.Action ? this.config.Action : <DialogActions>
                <Button onClick={() => this.close()} color="primary">
                    取消
                </Button>
                <Button onClick={() => {
                    this.config.Ok()
                    this.close()
                }} color="primary" autoFocus>
                    确定
                </Button>
            </DialogActions>}
        </Dialog>
    }

}