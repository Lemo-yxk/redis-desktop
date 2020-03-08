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

func UUID(stream *lemo.Stream) (lemo.Context, exception.ErrorFunc) {

	var name = stream.Form.Get("uuid").String()

	if name == "" {
		const errMsg = `uuid is empty`
		return stream.JsonFormat("ERROR", 404, errMsg), exception.New(errMsg)
	}

	return nil, nil
}
