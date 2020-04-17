import React from "react";
import { Switch, Route, } from "react-router-dom";
import ListAttributes from "views/Attributes/ListAttributes";
import EditAttribute from "views/Attributes/EditAttribute";
const Attributes = () => {
  return (
    <Switch>
      <Route exact path="/attributes">
        <ListAttributes />
      </Route>
      <Route exact path="/attributes/:id">
        <EditAttribute />
      </Route>
    </Switch>
  );
};

export default Attributes;
