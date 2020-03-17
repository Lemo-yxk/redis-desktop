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

	react "server/server/websocket/controller/client"
	"server/server/websocket/controller/redis"
	electron "server/server/websocket/controller/server"
	"server/server/websocket/middleware/before"
)

func RedisRouter(server *lemo.WebSocketServerRouter) {

	server.Group("/Redis").Before(before.UUID).Handler(func(handler *lemo.WebSocketServerRouteHandler) {
		handler.Route("/Login/login").Handler(redis.Login.Login)
	})

	server.Group("/Server").Handler(func(handler *lemo.WebSocketServerRouteHandler) {
		handler.Route("/Update/startUpdate").Handler(electron.Update.StartUpdate)
		handler.Route("/Update/startCheck").Handler(electron.Update.StartCheck)
		handler.Route("/System/restart").Handler(electron.System.Restart)
	})

	server.Group("/Client").Handler(func(handler *lemo.WebSocketServerRouteHandler) {
		handler.Route("/Update/EndCheck").Handler(react.Update.EndCheck)
		handler.Route("/Update/EndUpdate").Handler(react.Update.EndUpdate)
		handler.Route("/Update/ProgressUpdate").Handler(react.Update.ProgressUpdate)
	})
}
