import {config} from "../interface/config";
import Axios from "axios";
import Qs from "querystring";
import Tools from "../tools/Tools";
import Config from "../components/config/Config";

class Command {
    serverNameAndDB(): any {
        let name = Config.getServerName();
        let db = Config.getDB();
        if (name === null) return Tools.Message.Error("请连接服务!");
        if (db === null) return Tools.Message.Error("请选择DB!");
        return {name, db};
    }


    async export(fileName: string, data: any) {
        return Axios({
            url: `${Axios.defaults.baseURL}/redis/export/file?fileName=${fileName}&data=${data}`,
            method: "GET",
            responseType: "blob" // important
        }).then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
        });
    }

    async register(type: string, cfg: config) {
        return await Axios.post(`/redis/register/${type}`, Qs.stringify({...cfg}));
    }

    async disconnect(serverName: string) {
        return await Axios.post(`/redis/db/disconnect`, Qs.stringify({name: serverName}));
    }

    async selectDB(serverName: string, db: any) {
        return await Axios.post(`/redis/db/select`, Qs.stringify({name: serverName, db}));
    }

    async scan(filter: string) {
        let response = await Axios.post(
            `/redis/db/scan`,
            Qs.stringify({filter: filter, ...this.serverNameAndDB()})
        );
        return response.data.msg;
    }

    async type(key: string) {
        let response = await Axios.post(
            `/redis/key/type`,
            Qs.stringify({...this.serverNameAndDB(), key: key})
        );
        return response.data.msg;
    }

    async do(key: string, args: any[]) {
        let response = await Axios.post(
            `/redis/key/do`,
            Qs.stringify({
                ...this.serverNameAndDB(),
                key: key,
                args: JSON.stringify(args)
            })
        );

        if (response.data.code !== 200) {
            return Tools.Notification(response);
        }

        return response.data.msg;
    }

    async doPipe(key: string, args: any[][]) {
        let response = await Axios.post(
            `/redis/key/do`,
            Qs.stringify({
                ...this.serverNameAndDB(),
                key: key,
                args: JSON.stringify(args)
            })
        );

        if (response.data.code !== 200) {
            return Tools.Notification(response);
        }

        return response.data.msg;
    }
}

export default new Command();
