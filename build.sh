current=`pwd`
echo $current

cd client && yarn build --aot --prod

cd $current
rm -rf electron/src/dist/*
cp -R client/build/* electron/src/dist
cd server && go build -o bin/server main.go

cd $current
cp server/bin/server electron/src

cd electron && yarn make

