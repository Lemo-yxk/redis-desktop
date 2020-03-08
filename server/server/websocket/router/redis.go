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

	"server/server/websocket/controller/redis"
	"server/server/websocket/middleware/before"
)

func RedisRouter(server *lemo.WebSocketServerRouter) {
	server.Group("/Redis").Before(before.UUID, before.Sync).Handler(func(handler *lemo.WebSocketServerRouteHandler) {
		handler.Route("/Sync/hello").Handler(redis.Sync.Hello)
	})

	server.Group("/Redis").Before(before.UUID).Handler(func(handler *lemo.WebSocketServerRouteHandler) {
		handler.Route("/Login/login").Handler(redis.Login.Login)
	})
}
