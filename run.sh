cd server
nodemon server.js &
cd ../public/team
webpack --watch &
cd ../quizmaster
webpack --watch &
cd ../scoreboard
webpack --watch &
