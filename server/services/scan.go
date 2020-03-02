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

func Scan(client *redis2.Client) {
	var res []string

	for result := range redis.Scan(client, "*", 100) {

		res = append(res, result.Result())
		if len(res) == 100 {
			app.Socket().JsonFormatAll(lemo.JsonPackage{
				Event:   "scan",
				Message: res[:100],
			})
			res = res[100:]
		}
	}

	if len(res) == 0 {
		return
	}

	app.Socket().JsonFormatAll(lemo.JsonPackage{
		Event:   "scan",
		Message: res,
	})
}
