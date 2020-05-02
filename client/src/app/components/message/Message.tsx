import React, {Component} from "react";
import {ProviderContext, SnackbarOrigin, VariantType, withSnackbar} from 'notistack';
import Event from "../../event/Event";
import {CircularProgress} from "@material-ui/core";


class Message extends Component<ProviderContext, any> {

    state = {
        visible: false
    }

    componentDidMount() {
        Event.add("message", (type, message, duration?, persist?, preventDuplicate?, anchorOrigin?) => {
            if (type === 'close') return this.close()
            if (type === 'wait') return this.wait(message)
            this.show(type, message, duration, persist, preventDuplicate, anchorOrigin)
        })

    }

    componentWillUnmount() {
        Event.remove("message");
    }

    show(type: VariantType, message: string, duration = 3000, persist = false, preventDuplicate = false, anchorOrigin = {
        vertical: 'bottom',
        horizontal: 'left',
    }) {
        this.props.enqueueSnackbar(message, {
            variant: type,
            autoHideDuration: duration,
            persist: persist,
            preventDuplicate: preventDuplicate,
            anchorOrigin: anchorOrigin as SnackbarOrigin,

        });
    }

    close() {
        this.props.closeSnackbar(this.key)
    }

    render() {
        return null
    }

    key: any

    wait(message: string) {
        this.key = this.props.enqueueSnackbar(
            <div style={{display: "flex", justifyContent: 'space-around', alignItems: 'center'}}>
                <CircularProgress color="secondary" style={{width: 20, height: 20, marginRight: 20}}/>
                <div>{message}</div>
            </div>
            , {
                variant: 'default',
                autoHideDuration: 3000,
                persist: true,
                preventDuplicate: true,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
            })
    }
}

export default withSnackbar(Message)