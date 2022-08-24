import React from "react";
import { Navigate } from "react-router-dom"; // v6.
import { useAuth0 } from "@auth0/auth0-react";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth0();

  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
};
export default PrivateRoute;

/* react-router-dom v5
import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const PrivateRoute = ({ children, ...rest }) => {
  const { user } = useAuth0();

  return (
    <Route
      {...rest}
      render={() => {
        return user ? children : <Redirect to="/" />;
      }}
    ></Route>
  );
};
export default PrivateRoute;

*/

/* Before refactor to use useAuth0 directly instead of useUserContext()
  We still created a user Provider to keep code consistent.

  import React from "react";
  import { Route, Redirect } from "react-router-dom";
  import { useAuth0 } from "@auth0/auth0-react";

  import { useUserContext } from "../context/user_context";

  const PrivateRoute = ({ children, ...rest }) => {
    const { myUser } = useUserContext();
    return (
      <Route
        {...rest}
        render={() => {
          return myUser ? children : <Redirect to="/" />;
        }}
      ></Route>
    );
  };
  export default PrivateRoute;
*/
