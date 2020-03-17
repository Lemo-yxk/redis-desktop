/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2020-03-08 11:49
**/

package redis

import (
	"github.com/Lemo-yxk/lemo"
	"github.com/Lemo-yxk/lemo/console"
	"github.com/Lemo-yxk/lemo/exception"
	"github.com/Lemo-yxk/lemo/utils"

	"server/app"
)

type login struct{}

var Login *login

func (l *login) Login(conn *lemo.WebSocket, receive *lemo.Receive) exception.ErrorFunc {

	var message = utils.Json.Bytes(receive.Body.Message)

	var uuid = message.Get("uuid").String()

	app.Connection().Add(uuid, conn)

	console.Log("add", uuid, conn.FD)

	return conn.Server.JsonFormat(conn.FD, lemo.JsonPackage{Event: receive.Body.Event, Message: lemo.JsonFormat{
		Status: "SUCCESS",
		Code:   200,
		Msg:    nil,
	}})
}
