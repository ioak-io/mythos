import {
  getSessionValue,
  removeSessionValue,
  setSessionValue,
} from "./SessionUtils";
import { httpPost } from "./RestTemplate";
import {
  AuthorizationState,
  getPermissions,
  isAuthenticated,
} from "@/store/AuthorizationStore";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useState } from "react";

const appRealm = process.env.NEXT_PUBLIC_AUTHLITE_REALM_ID || "";

interface InputProps {
  realm: string;
}

interface OutputProps {
  isRouteAuthorized: boolean;
  hasPermissions: Function;
}

export enum PermissionType {
  USER = "USER",
  ADMIN = "ADMIN",
}

const useRouteAuthorization = (realm: string): OutputProps => {
  const [isRouteAuthorized, setIsRouteAuthorized] = useState(false);
  const router: AppRouterInstance = useRouter();

  const hasPermissions = (permissions: PermissionType[]) => {
    if (!isAuthenticated()) {
      const accessToken = getSessionValue(`talentprobe-access_token`);
      const refreshToken = getSessionValue(`talentprobe-refresh_token`);
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
                setSessionValue(`talentprobe-access_token`, newAccessToken);
              }
              AuthorizationState.next({
                isAuth: true,
                claims: response.data.claims,
                access_token: newAccessToken,
                refresh_token: refreshToken,
              });
              // return true;
              setIsRouteAuthorized(
                validatePermissions(
                  response.data.claims?.permissions,
                  permissions
                )
              );
            } else {
              setIsRouteAuthorized(false);
            }
          })
          .catch((error: any) => {
            removeSessionValue(`talentprobe-access_token`);
            removeSessionValue(`talentprobe-refresh_token`);
            router.push(`/login`);
            setIsRouteAuthorized(false);
          });
      } else {
        router.push(`/login`);
        setIsRouteAuthorized(false);
      }
    } else {
      setIsRouteAuthorized(validatePermissions(getPermissions(), permissions));
    }
  };

  const validatePermissions = (
    userPermissions: any,
    requiredPermissions: PermissionType[]
  ): boolean => {
    let outcome = true;
    requiredPermissions.forEach((permission: PermissionType) => {
      switch (permission) {
        case PermissionType.USER:
          break;
        case PermissionType.ADMIN:
          if (
            !userPermissions ||
            !userPermissions["COMPANY_ADMIN"]?.includes(realm)
          ) {
            outcome = false;
            router.push(`/unauthorized`);
          }
          break;

        default:
          break;
      }
    });
    return outcome;
  };

  return { isRouteAuthorized, hasPermissions } as const;
};

export { useRouteAuthorization };
