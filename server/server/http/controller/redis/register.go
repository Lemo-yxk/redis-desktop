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
	"time"

	"github.com/Lemo-yxk/lemo"
	"github.com/Lemo-yxk/lemo/exception"
	"github.com/go-redis/redis/v7"

	"server/app"
)

type register struct{}

var Register *register

func (r *register) Cluster(stream *lemo.Stream) exception.ErrorFunc {
	var name = stream.Form.Get("name").String()
	var cluster = stream.Form.GetAll("cluster")
	var password = stream.Form.Get("password").String()
	var masterName = stream.Form.Get("master").String()
	var connectTimeout = stream.Form.Get("connectTimeout").Int()
	var execTimeout = stream.Form.Get("execTimeout").Int()

	client, err := app.Redis().NewCluster(name, &redis.FailoverOptions{
		MasterName:    masterName,
		SentinelAddrs: cluster,
		Password:      password,
		DialTimeout:   time.Millisecond * time.Duration(connectTimeout),
		ReadTimeout:   time.Millisecond * time.Duration(execTimeout),
		WriteTimeout:  time.Millisecond * time.Duration(execTimeout),
	})

	if err != nil {
		return stream.JsonFormat("ERROR", 404, err.Error())
	}

	// task.Watch(client)

	return stream.JsonFormat("SUCCESS", 200, client.ConfigGet("databases").Val())
}

func (r *register) Normal(stream *lemo.Stream) exception.ErrorFunc {

	var name = stream.Form.Get("name").String()
	var host = stream.Form.Get("host").String()
	var port = stream.Form.Get("port").String()
	var password = stream.Form.Get("password").String()
	var connectTimeout = stream.Form.Get("connectTimeout").Int()
	var execTimeout = stream.Form.Get("execTimeout").Int()

	client, err := app.Redis().New(name, &redis.Options{
		Addr:         host + ":" + port,
		Password:     password,
		DialTimeout:  time.Millisecond * time.Duration(connectTimeout),
		ReadTimeout:  time.Millisecond * time.Duration(execTimeout),
		WriteTimeout: time.Millisecond * time.Duration(execTimeout),
	})

	if err != nil {
		return stream.JsonFormat("ERROR", 404, err.Error())
	}

	// task.Watch(client)

	return stream.JsonFormat("SUCCESS", 200, client.ConfigGet("databases").Val())
}
