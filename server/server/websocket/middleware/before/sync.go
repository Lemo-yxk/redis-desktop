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
)

func Sync(conn *lemo.WebSocket, receive *lemo.Receive) (lemo.Context, exception.ErrorFunc) {
	return nil, nil
}
