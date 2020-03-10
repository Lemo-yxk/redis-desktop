/**
* @program: center-server-go
*
* @description:
*
* @author: lemo
*
* @create: 2019-11-21 14:29
**/

package app

import (
	"sync"

	"github.com/go-redis/redis/v7"
)

type redisClient struct {
	data map[string]*redis.Client
	mux  sync.Mutex
}

func newRedis() *redisClient {
	return &redisClient{data: make(map[string]*redis.Client)}
}

func (r *redisClient) NewCluster(name string, option *redis.FailoverOptions) (*redis.Client, error) {

	r.mux.Lock()
	defer r.mux.Unlock()

	if client, ok := r.data[name]; ok {
		_ = client.Close()
		delete(r.data, name)
	}

	var client = redis.NewFailoverClient(option)
	err := client.Ping().Err()
	if err != nil {
		return nil, err
	}

	r.data[name] = client

	return client, nil
}

func (r *redisClient) New(name string, option *redis.Options) (*redis.Client, error) {

	r.mux.Lock()
	defer r.mux.Unlock()

	if client, ok := r.data[name]; ok {
		_ = client.Close()
		delete(r.data, name)
	}

	var client = redis.NewClient(option)
	err := client.Ping().Err()
	if err != nil {
		return nil, err
	}

	r.data[name] = client

	return client, err
}

func (r *redisClient) Close(name string) {
	r.mux.Lock()
	defer r.mux.Unlock()
	_ = r.data[name].Close()
	delete(r.data, name)
}

func (r *redisClient) Get(name string) *redis.Client {
	r.mux.Lock()
	defer r.mux.Unlock()
	if client, ok := r.data[name]; ok {
		return client
	}
	return nil
}
