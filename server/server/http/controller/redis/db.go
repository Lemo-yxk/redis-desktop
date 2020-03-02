/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2019-11-20 14:02
**/

package redis

import (
	"github.com/Lemo-yxk/lemo"
	"github.com/Lemo-yxk/lemo/exception"

	"server/app"
	"server/services"
)

type db struct{}

var DB *db

func (r *db) Select(stream *lemo.Stream) exception.ErrorFunc {
	var name = stream.Form.Get("name").String()
	var db = stream.Form.Get("db").Int()
	var client = app.Redis().Get(name)
	return stream.JsonFormat("SUCCESS", 200, client.Do("SELECT", db).Err())
}

func (r *db) Scan(stream *lemo.Stream) exception.ErrorFunc {
	var name = stream.Form.Get("name").String()
	var client = app.Redis().Get(name)
	services.Scan(client)
	return stream.JsonFormat("SUCCESS", 200, nil)
}