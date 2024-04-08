// withAuthValidation.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";
import {
  getSessionValue,
  removeSessionValue,
  setSessionValue,
} from "@/lib/SessionUtils";
import { httpPost } from "@/lib/RestTemplate";
import {
  AuthorizationState,
  isAuthenticated,
} from "@/store/AuthorizationStore";

const appRealm = process.env.NEXT_PUBLIC_AUTHLITE_REALM_ID || "";

const withAuthValidation = <P extends {}>(
  WrappedComponent: React.ComponentType<P>
) => {
  const AuthValidationWrapper: React.FC<P> = (props) => {
    const router = useRouter();

    useEffect(() => {
      const validateAuth = async () => {
        if (!isAuthenticated()) {
          const accessToken = getSessionValue(`testgenie-access_token`);
          const refreshToken = getSessionValue(`testgenie-refresh_token`);
          if (accessToken && refreshToken) {
            httpPost(
              `/${appRealm}/user/auth/token`,
              { grant_type: "refresh_token", refresh_token: refreshToken },
              null,
              process.env.NEXT_PUBLIC_AUTHLITE_API_URL
            )
              .then((response: any) => {
                if (response.status === 200) {
                  let newAccessToken = accessToken;
                  if (response.data?.access_token) {
                    newAccessToken = response.data.access_token;
                    setSessionValue(`testgenie-access_token`, newAccessToken);
                  }
                  AuthorizationState.next({
                    isAuth: true,
                    claims: response.data.claims,
                    access_token: newAccessToken,
                    refresh_token: refreshToken,
                  });
                  return true;
                }
              })
              .catch((error: any) => {
                removeSessionValue(`testgenie-access_token`);
                removeSessionValue(`testgenie-refresh_token`);
                router.push(`/login`);
              });
          }
        }
      };

      validateAuth();
    }, []);

    return <WrappedComponent {...props} />;
  };

  return AuthValidationWrapper;
};

export default withAuthValidation;
