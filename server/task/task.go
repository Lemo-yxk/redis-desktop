/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2020-03-01 19:37
**/

package task

import (
	"fmt"
	"time"

	"github.com/Lemo-yxk/lemo"
	"github.com/Lemo-yxk/lemo/console"
	redis2 "github.com/go-redis/redis/v7"

	"server/app"
)

func Start() {
	SystemTime()
	// CreateData()
}

func CreateData() {
	client, err := app.Redis().New("127.0.0.1", &redis2.Options{
		Addr:     "127.0.0.1:6379",
		Password: "1354243",
	})
	if err != nil {
		console.Error(err)
	}

	var value = 0
	for i := 0; i < 20; i++ {
		for j := 0; j < 10; j++ {
			for k := 0; k < 10; k++ {
				value++
				var key = fmt.Sprintf("%d:%d:%d", i, j, k)
				client.Do("SET", key, value)

			}
		}
	}
	// for i := 0; i < 10000; i++ {
	// 	client.LPush("1",i)
	// }
}

func DeleteData() {
	// if regexp.MustCompile(`^\d`).MatchString(result.Result()) {
	// 	client.Del(result.Result())
	// }
}

func Watch(client *redis2.Client) {

	var channel = `__keyevent@*__:*`

	var p = client.PSubscribe(channel)

	client.ConfigSet("notify-keyspace-events", "KEA")

	var receive = false

	go func() {
		for {
			var message, err = p.ReceiveMessage()
			if err != nil {
				console.Log(err)
				break
			}

			console.Log(message.Channel, message.Pattern, message.Payload)

			if message.String() == channel {
				continue
			}

			if receive {
				continue
			}

			receive = true

			time.AfterFunc(time.Second, func() {
				receive = false
				app.Socket().JsonFormatAll(lemo.JsonPackage{
					Event:   "watch",
					Message: nil,
				})
			})
		}
	}()
}
