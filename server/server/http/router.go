/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2019-11-01 14:59
**/

package http

import (
	"github.com/Lemo-yxk/lemo"

	"server/server/http/router"
)

func Router(server *lemo.HttpServerRouter) {
	router.RedisRouter(server)
}
