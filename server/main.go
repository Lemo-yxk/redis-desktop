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

	"github.com/Lemo-yxk/lemo/console"
	"github.com/Lemo-yxk/lemo/exception"
	"github.com/Lemo-yxk/lemo/utils"

	"server/app"
	"server/server"
	"server/task"
)

func main() {

	exception.Assert(os.Setenv("TZ", "Asia/Shanghai"))

	app.Init()

	task.Start()

	server.Start()

	console.Log("Start Success")

	utils.Signal.ListenKill().Done(func(sig os.Signal) {
		console.Log("get sig:", sig)
	})
}
