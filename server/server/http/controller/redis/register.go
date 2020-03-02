/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2020-03-01 20:43
**/

package redis

import (
	"fmt"
	"time"

	"github.com/Lemo-yxk/lemo"
	"github.com/Lemo-yxk/lemo/exception"

	"server/app"
)

type register struct{}

var Register *register

func (r *register) Cluster(stream *lemo.Stream) exception.ErrorFunc {
	return exception.New(stream.End(time.Now().String()))
}

func (r *register) Normal(stream *lemo.Stream) exception.ErrorFunc {

	var name = stream.Form.Get("name").String()
	var host = stream.Form.Get("host").String()
	var port = stream.Form.Get("port").String()
	var password = stream.Form.Get("password").String()

	client, err := app.Redis().New(name, fmt.Sprintf("%s:%s", host, port), password)
	if err != nil {
		return exception.New(stream.JsonFormat("ERROR", 404, err.Error()))
	}

	return exception.New(stream.JsonFormat("SUCCESS", 200, client.ConfigGet("DATABASES").Val()))
}
