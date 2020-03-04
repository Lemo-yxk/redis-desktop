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
	"strings"

	"github.com/Lemo-yxk/lemo"
	"github.com/Lemo-yxk/lemo/exception"
	"github.com/Lemo-yxk/lemo/utils"

	"server/app"
)

type key struct{}

var Key *key

func (r *key) Type(stream *lemo.Stream) exception.ErrorFunc {
	var name = stream.Form.Get("name").String()
	var key = stream.Form.Get("key").String()

	var client = app.Redis().Get(name)

	var res = client.Type(key)

	if res.Err() != nil {
		return stream.JsonFormat("ERROR", 404, res.Err())
	}

	return stream.JsonFormat("SUCCESS", 200, res.Val())
}

func (r *key) Do(stream *lemo.Stream) exception.ErrorFunc {
	var name = stream.Form.Get("name").String()
	var args = stream.Form.Get("args").String()
	var arr = strings.Split(args, " ")
	var arrInterface []interface{}
	for i := 0; i < len(arr); i++ {
		arrInterface = append(arrInterface, arr[i])
	}

	var client = app.Redis().Get(name)

	var res = client.Do(arrInterface...)

	if res.Err() != nil {
		return stream.JsonFormat("ERROR", 404, res.Err())
	}

	return stream.JsonFormat("SUCCESS", 200, res.Val())
}

func (r *key) DoPipe(stream *lemo.Stream) exception.ErrorFunc {
	var name = stream.Form.Get("name").String()
	var args = stream.Form.Get("args").String()

	var cmd []string
	utils.Json.Decode([]byte(args), &cmd)

	var client = app.Redis().Get(name)

	var pipe = client.TxPipeline()

	for i := 0; i < len(cmd); i++ {
		var arr = strings.Split(cmd[i], " ")
		var arrInterface []interface{}
		for i := 0; i < len(arr); i++ {
			arrInterface = append(arrInterface, arr[i])
		}
		pipe.Do(arrInterface...)
	}

	var res, err = pipe.Exec()
	if err != nil {
		return stream.JsonFormat("ERROR", 404, err)
	}

	return stream.JsonFormat("SUCCESS", 200, res)
}

// string, list, set, zset, hash and stream.
