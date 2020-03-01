/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2020-03-01 16:37
**/

package main

import (
	"os"
	"time"

	"github.com/Lemo-yxk/lemo"
	"github.com/Lemo-yxk/lemo/console"
	"github.com/Lemo-yxk/lemo/exception"
	"github.com/Lemo-yxk/lemo/utils"
)

func main() {

	var webSocketServer = &lemo.WebSocketServer{Host: "0.0.0.0", Port: 12389, Path: "/", AutoBind: true}

	var webSocketServerRouter = &lemo.WebSocketServerRouter{}

	webSocketServerRouter.Group("/hello").Handler(func(handler *lemo.WebSocketServerRouteHandler) {
		handler.Route("/world").Handler(func(conn *lemo.WebSocket, receive *lemo.Receive) exception.ErrorFunc {
			return conn.JsonFormat(lemo.JsonPackage{
				Event: receive.Message.Event,
				Message: &lemo.JsonFormat{
					Status: "SUCCESS",
					Code:   200,
					Msg:    "welcome to redis desktop",
				},
			})
		})
	})

	go webSocketServer.SetRouter(webSocketServerRouter).Start()

	utils.Time.Ticker(time.Second, func() {
		webSocketServer.JsonFormatAll(lemo.JsonPackage{
			Event: "system-time",
			Message: &lemo.JsonFormat{
				Status: "SUCCESS",
				Code:   200,
				Msg:    time.Now().Unix(),
			},
		})
	}).Start()

	var httpServer = lemo.HttpServer{Host: "0.0.0.0", Port: 12388, AutoBind: true}

	var httpServerRouter = &lemo.HttpServerRouter{}

	httpServerRouter.Group("/hello").Handler(func(handler *lemo.HttpServerRouteHandler) {
		handler.Get("/world").Handler(func(t *lemo.Stream) exception.ErrorFunc {
			return t.JsonFormat("SUCCESS", 200, "welcome to redis desktop")
		})
	})

	go httpServer.SetRouter(httpServerRouter).Start()

	utils.Signal.ListenKill().Done(func(sig os.Signal) {
		console.Log("get sig:", sig)
	})
}
