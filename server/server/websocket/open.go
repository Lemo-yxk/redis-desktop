/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2019-11-01 15:01
**/

package websocket

import (
	"github.com/Lemo-yxk/lemo"
	"github.com/Lemo-yxk/lemo/console"
)

func Open(conn *lemo.WebSocket) {
	console.Log("conn open", "fd:", conn.FD, "ip:", conn.ClientIP())
}
