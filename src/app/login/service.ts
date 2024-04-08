import { httpPost } from "@/lib/RestTemplate";

const authBaseUrl = process.env.NEXT_PUBLIC_AUTHLITE_API_URL;

export const signin = (email: string, password: string) => {
  return httpPost(
    `/${process.env.NEXT_PUBLIC_AUTHLITE_REALM_ID}/user/auth/signin`,
    {
      response_type: "token",
      email,
      password,
    },
    {},
    authBaseUrl
  )
    .then((response) => {
      if (response.status === 200) {
        return Promise.resolve(response.data);
      }
      return Promise.resolve({});
    })
    .catch((error) => {
      return Promise.resolve({});
    });
};
