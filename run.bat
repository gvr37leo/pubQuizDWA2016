pushd client
start webpack-dev-server --inline --hot --content-base src --port 8000
popd
start mongod
start node server/server.js