import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { createBrowserHistory } from "history";
import { signIn } from "redux/actions";
import AuthService from "services/Auth";
import Admin from "layouts/Admin.js";
import Login from "views/Login/Login.js";
const history = createBrowserHistory();
const Root = props => {
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    setIsAuthorized(props.isAuthorized);
  }, [props.isAuthorized]);

  useEffect(() => {
    if (AuthService.isLoggedIn()) {
      props.signIn();
    }
  }, [props]);

  return isAuthorized ? (
    <Router history={history} basename="/duocun-backoffice">
      <Switch>
        <Route path="/" component={Admin} />
      </Switch>
    </Router>
  ) : (
    <Router history={history} basename="/duocun-backoffice">
      <Switch>
        <Route path="/login" component={Login} />
        <Redirect from="/" to="/login" />
      </Switch>
    </Router>
  );
};

Root.propTypes = {
  isAuthorized: PropTypes.bool,
  signIn: PropTypes.func
};

const mapStateToProps = ({ authReducer }) => {
  return {
    isAuthorized: authReducer.isAuthorized
  };
};

const mapDispatchToProps = dispatch => ({
  signIn: () => dispatch(signIn())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Root);
