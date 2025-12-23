import { FuseAuthUser } from "@fuse/core/FuseAuthProvider/types/FuseAuthUser";

/**
 * The type definition for a user object.
 */
export type User = FuseAuthUser & {
  sub: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
  loginRedirectUrl?: string;
  role: string[] | string | null;
};
