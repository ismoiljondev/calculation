import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useImperativeHandle,
} from "react";
import {
  FuseAuthProviderComponentProps,
  FuseAuthProviderState,
} from "@fuse/core/FuseAuthProvider/types/FuseAuthTypes";
import useLocalStorage from "@fuse/hooks/useLocalStorage";
import {
  // authRefreshToken,
  authSignIn,
  authSignInWithToken,
  getUser,
} from "@auth/authApi";
import { User } from "../../user";
import { removeGlobalHeaders, setGlobalHeaders } from "@/utils/apiFetch";
import { isTokenValid } from "./utils/jwtUtils";
import JwtAuthContext from "@auth/services/jwt/JwtAuthContext";
import { JwtAuthContextType } from "@auth/services/jwt/JwtAuthContext";

export type JwtSignInPayload = {
  username: string;
  password: string;
  // client_id: string;
  // grant_type: string;
  // client_secret: string;
  // scope: string;
};

export type JwtSignUpPayload = {
  displayName: string;
  email: string;
  password: string;
};

export interface IAuthResponse {
  accessToken
  : string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  id_token: string;
  "not-before-policy": number;
  session_state: string;
  scope: string;
  role: string
}

function JwtAuthProvider(props: FuseAuthProviderComponentProps) {
  const { ref, children, onAuthStateChanged } = props;

  const {
    value: tokenStorageValue,
    setValue: setTokenStorageValue,
    removeValue: removeTokenStorageValue,
  } = useLocalStorage<string>("jwt_accessToken");

  /**
   * Fuse Auth Provider State
   */
  const [authState, setAuthState] = useState<FuseAuthProviderState<User>>({
    authStatus: "configuring",
    isAuthenticated: false,
    user: null,
  });

  /**
   * Watch for changes in the auth state
   * and pass them to the FuseAuthProvider
   */
  useEffect(() => {
    if (onAuthStateChanged) {
      onAuthStateChanged(authState);
    }
  }, [authState, onAuthStateChanged]);

  /**
   * Attempt to auto login with the stored token
   */
  useEffect(() => {
    const attemptAutoLogin = async () => {
      const accessToken = tokenStorageValue;

      if (isTokenValid(accessToken)) {
        try {
          /**
           * Sign in with the token
           */
          const response = await authSignInWithToken(accessToken);

          return { ...response, role: [response?.role] };
        } catch {
          return false;
        }
      }

      return false;
    };

    if (!authState.isAuthenticated) {
      attemptAutoLogin().then((userData) => {
        if (userData) {
          setGlobalHeaders({ Authorization: `Bearer ${tokenStorageValue}` });
          setAuthState({
            authStatus: "authenticated",
            isAuthenticated: true,
            user: userData as unknown as User,
          });
        } else {
          removeTokenStorageValue();
          removeGlobalHeaders(["Authorization"]);
          setAuthState({
            authStatus: "unauthenticated",
            isAuthenticated: false,
            user: null,
          });
        }
      });
    }
    // eslint-disable-next-line
  }, [authState.isAuthenticated]);

  /**
   * Sign in
   */
  const signIn: JwtAuthContextType["signIn"] = useCallback(
    async (credentials) => {
      const session = await authSignIn<IAuthResponse>(credentials);
      if (session) {
        setTokenStorageValue(session.accessToken);
        setGlobalHeaders({
          Authorization: `Bearer ${session.accessToken}`
        });
        const user: any = await getUser();



        setAuthState({
          authStatus: "authenticated",
          isAuthenticated: true,
          user: { ...user, role: [user?.role] },
        });
      }

      return session;
    },
    [setTokenStorageValue]
  );

  /**
   * Sign out
   */
  const signOut: JwtAuthContextType["signOut"] = useCallback(() => {
    removeTokenStorageValue();
    removeGlobalHeaders(["Authorization"]);
    setAuthState({
      authStatus: "unauthenticated",
      isAuthenticated: false,
      user: null,
    });
  }, [removeTokenStorageValue]);

  /**
   * Refresh access token
   */
  // const refreshToken: JwtAuthContextType["refreshToken"] =
  //   useCallback(async () => {
  //     const response = await authRefreshToken();

  //     if (!response.ok)
  //       throw new Error(`HTTP error! status: ${response.status}`);

  //     return response;
  //   }, []);

  /**
   * Auth Context Value
   */
  const authContextValue = useMemo(
    () =>
      ({
        ...authState,
        signIn,
        signOut,
        // refreshToken,
      }) as JwtAuthContextType,
    [authState, signIn, signOut]
  );

  /**
   * Intercept fetch requests to refresh the access token
   */
  const interceptFetch = useCallback(() => {
    const { fetch: originalFetch } = window;

    window.fetch = async (...args) => {
      const [resource, config] = args;
      const response = await originalFetch(resource, config);
      const newAccessToken = response.headers.get("New-Access-Token");

      if (newAccessToken) {
        setGlobalHeaders({ Authorization: `Bearer ${newAccessToken}` });
        setTokenStorageValue(newAccessToken);
      }

      if (response.status === 401) {
        signOut();

        console.error("Unauthorized request. User was signed out.");
      }

      return response;
    };
  }, [setTokenStorageValue, signOut]);

  useEffect(() => {
    if (authState.isAuthenticated) {
      interceptFetch();
    }
  }, [authState.isAuthenticated, interceptFetch]);

  return <JwtAuthContext value={authContextValue}>{children}</JwtAuthContext>;
}

export default JwtAuthProvider;
