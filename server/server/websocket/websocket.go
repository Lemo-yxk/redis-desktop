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

func Init() {

	var server = app.Socket()

	server.Host = "0.0.0.0"

	server.Port = 12389

	server.Path = "/"

	server.OnOpen = Open

	server.OnClose = Close

	server.OnError = Error

	server.OnMessage = func(conn *lemo.WebSocket, messageType int, msg []byte) {
		if len(msg) == 0 {
			return
		}

		console.Log(string(msg))
	}

	var router = new(lemo.WebSocketServerRouter)

	router.IgnoreCase = true

	Router(router)

	server.SetRouter(router).Start()
}
