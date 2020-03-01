/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2019-11-22 13:17
**/

package redis

import (
	"github.com/Lemo-yxk/lemo"
	"github.com/Lemo-yxk/lemo/exception"
)

type sync struct{}

var Sync *sync

func (s *sync) Hello(conn *lemo.WebSocket, receive *lemo.Receive) exception.ErrorFunc {
	return conn.Server.JsonFormat(conn.FD, lemo.JsonPackage{Event: receive.Message.Event, Message: "hello"})
}
