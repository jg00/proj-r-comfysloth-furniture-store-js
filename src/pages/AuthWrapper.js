import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import styled from "styled-components";

const AuthWrapper = ({ children }) => {
  const { isLoading, error } = useAuth0();

  if (isLoading) {
    return (
      <Wrapper>
        <h1>Loading...</h1>
      </Wrapper>
    );
  }

  if (error) {
    return (
      <Wrapper>
        <h1>{error.message}</h1>
      </Wrapper>
    );
  }

  return <>{children}</>;
};

const Wrapper = styled.section`
  min-height: 100vh;
  display: grid;
  place-items: center;
`;

export default AuthWrapper;

/* AuthWrapper component with Auth0
  AuthWrapper component will wrap all of our Routes to make sure and allow us
  to have Auth0 authentication first.  We then have ability to check
  Auth0 properties isLoading, error. 

  Having an AuthWrapper gives our app in our PrivateRoute time to check for the user
  and fixes issue where we get directed to the home page even though we are logged 
  in when we manually navigate to /checkout via the address bar.
*/
