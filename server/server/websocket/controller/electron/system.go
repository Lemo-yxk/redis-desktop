/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2019-11-22 13:17
**/

package electron

import (
	"time"

	"github.com/Lemo-yxk/lemo"
	"github.com/Lemo-yxk/lemo/console"
	"github.com/Lemo-yxk/lemo/exception"
	"github.com/Lemo-yxk/lemo/utils"

	"server/app"
)

type system struct{}

var System *system

func (l *system) Login(conn *lemo.WebSocket, receive *lemo.Receive) exception.Error {

	var message = utils.Json.Bytes(receive.Body.Message)

	var dir = message.Get("dir").String()

	app.Electron().SetDir(dir)

	app.Electron().SetConnection(conn)

	console.Log("electron", conn.FD, "login at", time.Now())

	return conn.Server.JsonFormat(conn.FD, lemo.JsonPackage{Event: receive.Body.Event, Message: lemo.JsonFormat{
		Status: "SUCCESS",
		Code:   200,
		Msg:    nil,
	}})
}

func (l *system) Restart(conn *lemo.WebSocket, receive *lemo.Receive) exception.Error {
	var electron = app.Electron().GetConnection()
	if electron == nil {
		return nil
	}
	return exception.New(electron.Push(receive.Body.MessageType, receive.Body.Raw))
}

func (l *system) Command(conn *lemo.WebSocket, receive *lemo.Receive) exception.Error {
	var electron = app.Electron().GetConnection()
	if electron == nil {
		return nil
	}
	return exception.New(electron.Push(receive.Body.MessageType, receive.Body.Raw))
}

func (l *system) Update(conn *lemo.WebSocket, receive *lemo.Receive) exception.Error {

	app.Electron().Update()

	return nil
}
