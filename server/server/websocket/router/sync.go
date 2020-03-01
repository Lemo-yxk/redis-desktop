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

func SyncRouter(server *lemo.WebSocketServerRouter) {
	server.Group("/Redis").Before(before.Sync).Handler(func(handler *lemo.WebSocketServerRouteHandler) {
		handler.Route("/Sync/hello").ForceBefore().Handler(redis.Sync.Hello)
	})

}
