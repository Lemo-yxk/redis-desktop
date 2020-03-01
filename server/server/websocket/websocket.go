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

	var router = new(lemo.WebSocketServerRouter)

	router.IgnoreCase = true

	Router(router)

	server.SetRouter(router).Start()
}
