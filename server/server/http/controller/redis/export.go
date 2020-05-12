/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2020-03-09 21:29
**/

package redis

import (
	"github.com/Lemo-yxk/lemo"
	"github.com/Lemo-yxk/lemo/exception"
)

type export struct{}

var Export *export

func (r *export) File(stream *lemo.Stream) exception.Error {
	var fileName = stream.Query.Get("fileName").String()
	var data = stream.Query.Get("data").String()

	if fileName == "" {
		return stream.JsonFormat("ERROR", 404, "file name is empty")
	}

	return exception.New(stream.EndFile(fileName, data))
}
