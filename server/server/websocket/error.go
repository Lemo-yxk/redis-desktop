/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2019-11-01 15:01
**/

package websocket

import (
	"github.com/Lemo-yxk/lemo/console"
	"github.com/Lemo-yxk/lemo/exception"
)

func Error(err exception.Error) {
	console.Error(err)
}
