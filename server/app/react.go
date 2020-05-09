/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2020-05-03 22:15
**/

package app

import (
	"github.com/Lemo-yxk/lemo"
)

func newReact() *react {
	return &react{}
}

type react struct {
	conn *lemo.WebSocket
}

func (r *react) SetConnection(conn *lemo.WebSocket) {
	r.conn = conn
}

func (r *react) GetConnection() *lemo.WebSocket {
	return r.conn
}

func (r *react) Destroy() {
	r.conn = nil
}
