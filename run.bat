start mongod
pushd server
start node server.js
popd
pushd public
pushd team
start webpack --watch
::start webpack-dev-server --inline --hot --port 8001 --content-base
popd

::start node server/server.js
