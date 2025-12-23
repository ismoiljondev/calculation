import useUser from "@auth/useUser";

export function useHasPermission() {
  const { data: user } = useUser();
  const userPermissions = user?.role || [];

  function hasPermission(required?: string | string[]): boolean {
    if (!required) return true;
    if (userPermissions.length === 0) return false;

    if (Array.isArray(required)) {
      return required.some((perm) => userPermissions.includes(perm));
    }

    return userPermissions.includes(required);
  }

  return hasPermission;
}
