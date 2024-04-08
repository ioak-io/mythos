import { useEffect } from "react";
import {
  getSessionValue,
  removeSessionValue,
  setSessionValue,
} from "./SessionUtils";
import { httpPost } from "./RestTemplate";
import { AuthorizationState } from "@/store/AuthorizationStore";
import { useRouter } from "next/navigation";

const appRealm = process.env.NEXT_PUBLIC_AUTHLITE_REALM_ID || "";

export function useInitialization() {
  const router = useRouter();

  useEffect(() => {
    authorizeFromSession();
  }, []);

  const authorizeFromSession = () => {
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
            return true;
          }
        })
        .catch((error: any) => {
          removeSessionValue(`talentprobe-access_token`);
          removeSessionValue(`talentprobe-refresh_token`);
          router.push(`/login`);
        });
    } else {
        router.push(`/login`);
    }
  };
}
