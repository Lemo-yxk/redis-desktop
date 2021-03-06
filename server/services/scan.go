/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2020-03-02 15:04
**/

package services

import (
	"github.com/Lemo-yxk/lemo"
	redis2 "github.com/go-redis/redis/v7"

	"server/app"
	"server/pkg/redis"
)

func Scan(client *redis2.Client, uuid string, filter string) {

	var react = app.React().GetConnection()

	if react == nil {
		return
	}

	var dbSize = client.DBSize().Val()

	var res []string

	var counter = 0

	for result := range redis.Scan(client, filter, 1000) {

		res = append(res, result.Result())
		if len(res) == 1000 {
			counter += 1000
			react.JsonFormat(lemo.JsonPackage{
				Event:   "scan",
				Message: lemo.M{"dbSize": dbSize, "current": counter, "keys": res[:1000]},
			})
			res = res[1000:]
		}
	}

	counter += len(res)

	react.JsonFormat(lemo.JsonPackage{
		Event:   "scan",
		Message: lemo.M{"dbSize": dbSize, "current": counter, "keys": res, "done": true},
	})

}
