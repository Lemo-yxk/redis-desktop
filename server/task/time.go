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
	"time"

	"github.com/Lemo-yxk/lemo"
	"github.com/Lemo-yxk/lemo/utils"

	"server/app"
)

func SystemTime() {
	utils.Time.Ticker(time.Second, func() {
		app.Socket().JsonFormatAll(lemo.JsonPackage{
			Event:   "system-time",
			Message: time.Now().Unix(),
		})
	}).Start()
}
