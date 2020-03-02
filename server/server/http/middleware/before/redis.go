/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2019-12-24 18:06
**/

package before

import (
	"github.com/Lemo-yxk/lemo"
	"github.com/Lemo-yxk/lemo/exception"

	"server/app"
)

func Redis(stream *lemo.Stream) (lemo.Context, exception.ErrorFunc) {

	var name = stream.Form.Get("name").String()

	if name == "" {
		const errMsg = `name is empty`
		return stream.JsonFormat("ERROR", 404, errMsg), exception.New(errMsg)
	}

	var client = app.Redis().Get(name)

	if client == nil {
		const errMsg = `you do not connect`
		return stream.JsonFormat("ERROR", 404, errMsg), exception.New(errMsg)
	}

	return nil, nil
}
