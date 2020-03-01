/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2019-11-05 19:34
**/

package app

import (
	"github.com/Lemo-yxk/lemo"
)

var App struct {
	socket *lemo.WebSocketServer
	redis  *redisClient
}

func Init() {
	App.socket = newSocket()
	App.redis = newRedis()
}

func Socket() *lemo.WebSocketServer {
	return App.socket
}

func Redis() *redisClient {
	return App.redis
}
