import Event from "../event/Event";
import {ModalConfig} from "../interface/modal";

class Tools {
    QueryString(data: { [key: string]: string }) {
        let s = "";
        for (const key in data) {
            s += `${key}=${data[key]}&`;
        }
        return s.slice(0, -1);
    }

    Range(begin: number, end: number): number[] {
        let res = [];
        for (let index = begin; index < end; index++) {
            res.push(index);
        }
        return res;
    }

    Notification(response: any, success?: any, error?: any) {
        if (response.isAxiosError) {
            let error = response.toJSON();
            console.log(error);
            this.Message.Error(error.message);
            this.Message.Close()
            this.Loading.Hide()
            throw error;
        }
        success = success || response.data.msg;
        error = error || response.data.msg;
        if (response.data.code === 200) {
            console.log(response.data);
            this.Message.Success(success);
            return true;
        } else {
            this.Message.Error(error);
            return false;
        }
    }

    IsNumber(v: any) {
        let reg = /^[0-9]+\.?[0-9]*$/;
        if (reg.test(v)) {
            return true;
        }
        return false;
    }

    Modal = {
        Show(config: ModalConfig) {
            Event.emit("openModal", config)
        }
    }

    Loading = {
        Show() {
            Event.emit("loading", true);
        },
        Hide() {
            Event.emit("loading", false);
        }
    }

    Message = {
        Show(message: string, duration?: number) {
            Event.emit("message", 'default', message);
        },
        Success(message: string, duration?: number) {
            Event.emit("message", 'success', message);
        },
        Error(message: string, duration?: number) {
            Event.emit("message", 'error', message);
        },
        Warning(message: string, duration?: number) {
            Event.emit("message", 'warning', message);
        },
        Info(message: string, duration?: number) {
            Event.emit("message", 'info', message);
        },
        Wait(message: any) {
            Event.emit('message', 'wait', message);
        },
        Close() {
            Event.emit("message", 'close');
        }
    }
}

export default new Tools();
