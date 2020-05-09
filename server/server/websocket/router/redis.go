/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2019-11-01 14:39
**/

package router

import (
	"github.com/Lemo-yxk/lemo"

	"server/server/websocket/controller/electron"
	"server/server/websocket/controller/react"
)

func RedisRouter(server *lemo.WebSocketServerRouter) {

	server.Group("/React").Handler(func(handler *lemo.WebSocketServerRouteHandler) {
		handler.Route("/System/login").Handler(react.Login.Login)
	})

	server.Group("/Electron").Handler(func(handler *lemo.WebSocketServerRouteHandler) {
		handler.Route("/System/restart").Handler(electron.System.Restart)
		handler.Route("/System/command").Handler(electron.System.Command)
		handler.Route("/System/login").Handler(electron.System.Login)
		handler.Route("/System/update").Handler(electron.System.Update)
	})

}
