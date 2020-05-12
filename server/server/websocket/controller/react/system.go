/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2020-03-08 11:49
**/

package react

import (
	"time"

	"github.com/Lemo-yxk/lemo"
	"github.com/Lemo-yxk/lemo/console"
	"github.com/Lemo-yxk/lemo/exception"

	"server/app"
)

type login struct{}

var Login *login

func (l *login) Login(conn *lemo.WebSocket, receive *lemo.Receive) exception.Error {

	app.React().SetConnection(conn)

	console.Log("react", conn.FD, "login at", time.Now())

	return conn.Server.JsonFormat(conn.FD, lemo.JsonPackage{Event: receive.Body.Event, Message: lemo.JsonFormat{
		Status: "SUCCESS",
		Code:   200,
		Msg:    nil,
	}})
}
