/**
* @program: server
*
* @description:
*
* @author: lemo
*
* @create: 2019-11-08 14:44
**/

package before

import (
	"github.com/Lemo-yxk/lemo"
	"github.com/Lemo-yxk/lemo/exception"
	"github.com/Lemo-yxk/lemo/utils"
)

func UUID(conn *lemo.WebSocket, receive *lemo.Receive) (lemo.Context, exception.ErrorFunc) {
	var uuid = utils.Json.Bytes(receive.Message.Message).Get("uuid").String()

	if uuid == "" {
		const errMsg = `uuid is empty`
		return conn.JsonFormat(lemo.JsonPackage{
			Event: receive.Message.Event,
			Message: lemo.JsonFormat{
				Status: "ERROR",
				Code:   404,
				Msg:    errMsg,
			},
		}), exception.New(errMsg)
	}

	return nil, nil
}
