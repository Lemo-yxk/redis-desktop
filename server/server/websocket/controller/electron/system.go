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

	"server/app"
)

type system struct{}

var System *system

func (l *system) Restart(conn *lemo.WebSocket, receive *lemo.Receive) exception.ErrorFunc {
	for c := range app.Connection().Range() {
		if c.Key == "redis-desktop-electron" {
			_ = c.Value.Push(receive.Body.MessageType, receive.Body.Raw)
		}
	}

	return nil
}

func (l *system) Command(conn *lemo.WebSocket, receive *lemo.Receive) exception.ErrorFunc {
	for c := range app.Connection().Range() {
		if c.Key == "redis-desktop-electron" {
			_ = c.Value.Push(receive.Body.MessageType, receive.Body.Raw)
		}
	}

	return nil
}