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

	electron "server/server/websocket/controller/electron"
	"server/server/websocket/controller/redis"
	"server/server/websocket/middleware/before"
)

func RedisRouter(server *lemo.WebSocketServerRouter) {

	server.Group("/Redis").Before(before.UUID).Handler(func(handler *lemo.WebSocketServerRouteHandler) {
		handler.Route("/Login/login").Handler(redis.Login.Login)
	})

	server.Group("/Electron").Handler(func(handler *lemo.WebSocketServerRouteHandler) {
		handler.Route("/System/restart").Handler(electron.System.Restart)
		handler.Route("/System/command").Handler(electron.System.Command)
	})

}
