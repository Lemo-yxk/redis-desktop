/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2019-11-01 14:38
**/

package http

import (
	"time"

	"github.com/Lemo-yxk/lemo"
	"github.com/Lemo-yxk/lemo/console"
	"github.com/Lemo-yxk/lemo/utils"
)

func Init() {

	var server = new(lemo.HttpServer)

	server.OnError = OnError

	server.Host = "0.0.0.0"

	server.Port = 12388

	server.Use(func(next lemo.HttpServerMiddle) lemo.HttpServerMiddle {
		return func(stream *lemo.Stream) {
			stream.Response.Header().Set("Access-Control-Allow-Origin", "*")
			stream.AutoParse()
			next(stream)
			var startTime = time.Now()
			console.Customize(
				console.FgMagenta,
				"LOG",
				"[%s][%s][%dms][host:%s][path:%s][%s]\n",
				utils.Time.New().Format("2006-01-02 15:04:05"),
				stream.Request.Method,
				time.Now().Sub(startTime).Milliseconds(),
				stream.Host(),
				stream.Request.URL.Path,
				stream.String(),
			)
		}
	})

	var router = new(lemo.HttpServerRouter)

	router.IgnoreCase = true

	Router(router)

	server.SetRouter(router).Start()

}
