import { Authorization } from "@/types/Authorization";
import { BehaviorSubject } from "rxjs";

export const AuthorizationState = new BehaviorSubject<Authorization>({});

export const isAuthenticated = (): boolean => {
  return !!AuthorizationState.value?.isAuth;
};

export const getPermissions = (): any => {
  return AuthorizationState.value?.claims?.permissions;
};


export const getAuthorization = (): any => {
  return AuthorizationState.value;
};
