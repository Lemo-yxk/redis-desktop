/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2019-11-01 14:27
**/

package server

import (
	"server/server/http"
	"server/server/websocket"
)

func Start() {

	go websocket.Init()

	go http.Init()

}
