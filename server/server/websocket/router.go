/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2019-11-01 14:59
**/

package websocket

import (
	"github.com/Lemo-yxk/lemo"

	"server/server/websocket/router"
)

func Router(server *lemo.WebSocketServerRouter) {
	router.RedisRouter(server)
}
