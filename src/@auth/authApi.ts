import { customFetch } from "@/utils/apiFetch";
import {
  IAuthResponse,
  JwtSignInPayload,
} from "./services/jwt/JwtAuthProvider";

// con= import.meta.env.VITE_KEYCLOACK_REALM_ID;
const baseUrls = import.meta.env.VITE_API_BASE_URL;

/**
 * Refreshes the access token
 */
// export async function authRefreshToken(): Promise<Response> {
//   return customFetch({ url: "/api/mock/auth/refresh", method: "POST" });
// }

/**
 * Sign in with token
 */
export async function authSignInWithToken(
  accessToken: string
): Promise<IAuthResponse> {
  return customFetch({
    url: `/auth`,
    baseURL: baseUrls,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

/**
 * Sign in
 */
export async function authSignIn<T>(credentials: JwtSignInPayload): Promise<T> {
  const urlEncodedBody = new URLSearchParams();
  for (const [key, value] of Object.entries(credentials)) {
    urlEncodedBody.append(key, value);
  }

  return customFetch({
    url: `/auth/login`,
    baseURL: baseUrls,
    method: "POST",
    data: urlEncodedBody.toString(),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
}

export async function getUser(): Promise<any> {
  return customFetch({
    url: `/auth`,
    baseURL: baseUrls,
  });
}
