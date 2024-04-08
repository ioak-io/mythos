export type Authorization = {
  isAuth?: boolean;
  access_token?: string;
  refresh_token?: string;
  claims?: {
    email: string;
    user_id: string;
    family_name: string;
    given_name: string;
    name: string;
    nick_name: string;
    permissions: any;
  };
  permissions?: any;
};
