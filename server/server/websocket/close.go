/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2019-11-01 15:01
**/

package websocket

import (
	"github.com/Lemo-yxk/lemo"
	"github.com/Lemo-yxk/lemo/console"

	"server/app"
)

func Close(conn *lemo.WebSocket) {

	for v := range app.Connection().Range() {
		if v.Value.FD == conn.FD {
			app.Connection().Del(v.Key)
			console.Log("delete", v.Key, v.Value.FD)
		}
	}

	console.Log(conn.FD, "close")
}
