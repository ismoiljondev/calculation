import { useCallback, useMemo } from "react";
import { User } from "@auth/user";
import useAuth from "@fuse/core/FuseAuthProvider/useAuth";
import _ from "lodash";
import setIn from "@/utils/setIn";
import { JwtAuthContextType } from "./services/jwt/JwtAuthContext";
import useLocalStorage from "@fuse/hooks/useLocalStorage";
import { removeGlobalHeaders } from "@/utils/apiFetch";

type useUser = {
  data: any | null;
  isGuest: boolean;
  updateUser: (updates: Partial<User>) => Promise<User | undefined>;
  updateUserSettings: (
    newSettings: User["settings"]
  ) => Promise<User["settings"] | undefined>;
  signOut: () => void;
};

function useUser(): useUser {
  const { authState, updateUser } = useAuth();
  const user = authState?.user as User;
  const isGuest = useMemo(
    () => !user?.role || user?.role?.length === 0,
    [user]
  );
  const { removeValue: removeTokenStorageValue } =
    useLocalStorage<string>("jwt_access_token");

  /**
   * Update user
   * Uses current auth provider's updateUser method
   */
  async function handleUpdateUser(_data: Partial<User>) {
    const response = await updateUser(_data);

    if (!response.ok) {
      throw new Error("Failed to update user");
    }

    const updatedUser = (await response.json()) as User;

    return updatedUser;
  }

  /**
   * Update user settings
   * Uses current auth provider's updateUser method
   */
  async function handleUpdateUserSettings(newSettings: User["settings"]) {
    const newUser = setIn(user, "settings", newSettings) as User;

    if (_.isEqual(user, newUser)) {
      return undefined;
    }

    const updatedUser = await handleUpdateUser(newUser);

    return updatedUser?.settings;
  }

  /**
   * Sign out
   */
  async function handleSignOut() {
    removeTokenStorageValue();
    window.localStorage.removeItem("jwt_accessToken");
    removeGlobalHeaders(["Authorization"]);
    window.location.reload();
  }

  return {
    data: user,
    isGuest,
    signOut: handleSignOut,
    updateUser: handleUpdateUser,
    updateUserSettings: handleUpdateUserSettings,
  };
}

export default useUser;
