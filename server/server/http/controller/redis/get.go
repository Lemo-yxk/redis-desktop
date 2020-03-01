/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2019-11-20 14:02
**/

package redis

import (
	"time"

	"github.com/Lemo-yxk/lemo"
	"github.com/Lemo-yxk/lemo/exception"
)

type get struct{}

var Get *get

func (r *get) All(stream *lemo.Stream) exception.ErrorFunc {
	return exception.New(stream.End(time.Now().String()))
}
