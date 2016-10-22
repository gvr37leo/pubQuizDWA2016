import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, hashHistory } from 'react-router'


import Quizmaster from "./quizmaster";

const app = document.getElementById('app');
ReactDOM.render((
  <Quizmaster />
), app);