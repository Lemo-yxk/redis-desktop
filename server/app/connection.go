/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2020-03-08 01:37
**/

package app

import (
	"sync"

	"github.com/Lemo-yxk/lemo"
)

type connection struct {
	mux  sync.Mutex
	data map[string]*lemo.WebSocket
}

type Info struct {
	Key   string
	Value *lemo.WebSocket
}

func newConnection() *connection {
	return &connection{data: make(map[string]*lemo.WebSocket)}
}

func (c *connection) Add(key string, conn *lemo.WebSocket) {
	c.mux.Lock()
	defer c.mux.Unlock()
	c.data[key] = conn
}

func (c *connection) Del(key string) {
	c.mux.Lock()
	defer c.mux.Unlock()
	delete(c.data, key)
}

func (c *connection) Get(key string) *lemo.WebSocket {
	c.mux.Lock()
	defer c.mux.Unlock()
	if conn, ok := c.data[key]; ok {
		return conn
	}
	return nil
}

func (c *connection) Range() chan Info {
	var ch = make(chan Info, 1)
	go func() {
		for s, i := range c.data {
			var info = Info{Key: s, Value: i}
			ch <- info
		}
		close(ch)
	}()
	return ch
}
