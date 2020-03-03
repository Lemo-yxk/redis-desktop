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
	"strings"

	"github.com/Lemo-yxk/lemo"
	"github.com/Lemo-yxk/lemo/exception"

	"server/app"
)

type register struct{}

var Register *register

func (r *register) Cluster(stream *lemo.Stream) exception.ErrorFunc {
	var name = stream.Form.Get("name").String()
	var cluster = strings.Split(stream.Form.Get("cluster").String(), ",")
	var password = stream.Form.Get("password").String()
	var masterName = stream.Form.Get("master").String()

	client, err := app.Redis().NewCluster(name, masterName, password, cluster)

	if err != nil {
		return stream.JsonFormat("ERROR", 404, err.Error())
	}

	return stream.JsonFormat("SUCCESS", 200, client.ConfigGet("DATABASES").Val())
}

func (r *register) Normal(stream *lemo.Stream) exception.ErrorFunc {

	var name = stream.Form.Get("name").String()
	var host = stream.Form.Get("host").String()
	var port = stream.Form.Get("port").String()
	var password = stream.Form.Get("password").String()

	client, err := app.Redis().New(name, fmt.Sprintf("%s:%s", host, port), password)

	if err != nil {
		return stream.JsonFormat("ERROR", 404, err.Error())
	}

	return stream.JsonFormat("SUCCESS", 200, client.ConfigGet("DATABASES").Val())
}
