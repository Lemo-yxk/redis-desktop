/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2019-12-23 13:58
**/

package app

import "github.com/Lemo-yxk/lemo"

func newSocket() *lemo.WebSocketServer {
	return new(lemo.WebSocketServer)
}
