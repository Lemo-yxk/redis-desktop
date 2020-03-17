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

type update struct{}

var Update *update

func (l *update) EndCheck(conn *lemo.WebSocket, receive *lemo.Receive) exception.ErrorFunc {
	for c := range app.Connection().Range() {
		if c.Key != "redis-desktop-server" {
			_ = c.Value.Push(receive.Body.MessageType, receive.Body.Raw)
		}
	}

	return nil
}

func (l *update) EndUpdate(conn *lemo.WebSocket, receive *lemo.Receive) exception.ErrorFunc {
	for c := range app.Connection().Range() {
		if c.Key != "redis-desktop-server" {
			_ = c.Value.Push(receive.Body.MessageType, receive.Body.Raw)
		}
	}

	return nil
}

func (l *update) ProgressUpdate(conn *lemo.WebSocket, receive *lemo.Receive) exception.ErrorFunc {
	for c := range app.Connection().Range() {
		if c.Key != "redis-desktop-server" {
			_ = c.Value.Push(receive.Body.MessageType, receive.Body.Raw)
		}
	}

	return nil
}
