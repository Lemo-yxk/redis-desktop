current=`pwd`
echo $current

cd client && yarn build --aot --prod

cd $current
rm -rf electron/src/dist/*
cp -R client/build/* electron/src/dist
cd server && go build -o bin/server main.go && env GOOS=windows GOARCH=386 go build -o bin/server.exe main.go

cd $current
cp server/bin/server electron/src
cp server/bin/server.exe electron/src

cd electron && yarn make && yarn package --platform win32

