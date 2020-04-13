/*!

=========================================================
* Material Dashboard React - v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
// i18n
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import lang from "./assets/i18n";
// core components
import Admin from "layouts/Admin.js";
import Login from "views/Login/Login.js";

import "assets/css/material-dashboard-react.css?v=1.8.0";

const hist = createBrowserHistory();
i18n.use(initReactI18next).init({
  resources: lang,
  lng: process.env.NODE_ENV === "production" ? "zh" : "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  }
});

ReactDOM.render(
  <Router history={hist}>
    <Switch>
      <Route path="/admin/login" component={Login} />
      <Route path="/admin" component={Admin} />
      <Redirect from="/login" to="/admin/login" />
      <Redirect from="/" to="/admin/dashboard" />
    </Switch>
  </Router>,
  document.getElementById("root")
);
