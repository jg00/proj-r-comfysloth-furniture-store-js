import React, { useContext, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const UserContext = React.createContext();

export const UserProvider = ({ children }) => {
  const { loginWithRedirect, logout, user } = useAuth0();
  // const { isAuthenticated, loginWithRedirect, logout, user, isloading } = useAuth0();

  const [myUser, setMyUser] = useState(null);

  useEffect(() => {
    setMyUser(user);
  }, [user]);

  /*
    useEffect(() => {
      if (isAuthenticated) {
        setMyUser(user);
      } else {
        setMyUser(false);
      }
    }, [isAuthenticated]);
  */

  return (
    <UserContext.Provider value={{ loginWithRedirect, logout, myUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};

/* authWrapper component purpose with Auth0
  After we added PrivateRoute we still have an issue where the scenario is
  1 we are logged in
  2 but when we manually access /checkout via address bar we get redirected to the 
  home page instead of the /checkout page.
  We get directed back to the home page because it takes longer for us to get the user
  from our context than it normally would be from the auth0.
*/
