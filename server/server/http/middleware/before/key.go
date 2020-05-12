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
)

func Key(stream *lemo.Stream) (lemo.Context, exception.Error) {

	var key = stream.Form.Get("key").String()

	if key == "" {
		const errMsg = `key is empty`
		return stream.JsonFormat("ERROR", 404, errMsg), exception.New(errMsg)
	}

	if !stream.Form.Has("db") {
		const errMsg = `db is empty`
		return stream.JsonFormat("ERROR", 404, errMsg), exception.New(errMsg)
	}

	return nil, nil
}
