import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, hashHistory } from 'react-router'


import Scoreboard from "./scoreboard";

const app = document.getElementById('app');
ReactDOM.render((
  <Scoreboard />
), app);