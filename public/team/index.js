import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, hashHistory } from 'react-router'


import Team from "./team";

const app = document.getElementById('app');
ReactDOM.render((
  <Team />
), app);