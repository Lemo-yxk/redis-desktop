/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2019-12-31 13:07
**/

package router

import (
	"github.com/Lemo-yxk/lemo"

	"server/server/http/controller/redis"
	"server/server/http/middleware/before"
)

func RedisRouter(server *lemo.HttpServerRouter) {
	server.Group("/Redis").Before(before.UUID,before.Redis).Handler(func(handler *lemo.HttpServerRouteHandler) {
		handler.Post("/DB/scan").Handler(redis.DB.Scan)
		handler.Post("/DB/select").Handler(redis.DB.Select)
		handler.Post("/DB/disconnect").Handler(redis.DB.Disconnect)
	})

	server.Group("/Redis").Before(before.UUID,before.Redis, before.Key).Handler(func(handler *lemo.HttpServerRouteHandler) {
		handler.Post("/Key/type").Handler(redis.Key.Type)
		handler.Post("/Key/do").Handler(redis.Key.Do)
		handler.Post("/Key/doPipe").Handler(redis.Key.DoPipe)
	})

	server.Group("/Redis").Before(before.UUID).Handler(func(handler *lemo.HttpServerRouteHandler) {
		handler.Post("/Register/cluster").Handler(redis.Register.Cluster)
		handler.Post("/Register/normal").Handler(redis.Register.Normal)
	})

	server.Group("/Redis").Handler(func(handler *lemo.HttpServerRouteHandler) {
		handler.Get("/Export/file").Handler(redis.Export.File)
	})
}
