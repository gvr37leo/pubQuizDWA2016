@echo off
start mongod

pushd server
start node server.js
popd

pushd public
pushd team
start webpack --watch
popd

pushd quizmaster
start webpack --watch
popd

pushd scoreboard
start webpack --watch
popd
::start webpack-dev-server --inline --hot --port 8001 --content-base
::start node server/server.js
