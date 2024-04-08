import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getSessionValue,
  removeSessionValue,
  setSessionValue,
} from "./lib/SessionUtils";
import { httpPost } from "./lib/RestTemplate";
import { AuthorizationState } from "./store/AuthorizationStore";

const appRealm = process.env.NEXT_PUBLIC_AUTHLITE_REALM_ID || "";

// This function can be marked `async` if using `await` inside
export const middleware = (request: NextRequest) => {
  //   if (request.nextUrl.pathname.startsWith("/assessment")) {
  //     return NextResponse.rewrite(new URL("/assessments", request.url));
  //   }
  // return NextResponse.rewrite(new URL("/assessments", request.url));
  if (!isUserLoggedIn()) {
    // return NextResponse.rewrite(new URL("/login", request.url));
  }
};

export const config = {
  matcher: ["/assessments-abcd"],
};

const isUserLoggedIn = () => {
  console.log(1);
  let outcome = AuthorizationState.value;
  AuthorizationState.subscribe((message) => {
    console.log("-", message);
  });
  console.log("--", outcome);
  //   return outcome;
  return true;
};

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
        return false;
      });
  } else {
    return false;
  }
  return true;
};
