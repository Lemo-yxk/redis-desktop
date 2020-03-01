/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2019-11-01 14:37
**/

package http

import (
	"github.com/Lemo-yxk/lemo"
	"github.com/Lemo-yxk/lemo/console"
)

func OnError(stream *lemo.Stream) {
	console.Error(stream.LastError())
}
