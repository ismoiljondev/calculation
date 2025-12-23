import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Link from "@fuse/core/Link";
import { useTranslation } from "react-i18next";

/**
 * The sign out page.
 */
function SignOutPage() {
  const { t } = useTranslation("signOutPage");

  return (
    <div className="flex min-w-0 flex-auto flex-col items-center sm:justify-center">
      <Paper className="flex min-h-full w-full items-center rounded-none px-4 py-8 sm:min-h-auto sm:w-auto sm:rounded-xl sm:p-12 sm:shadow-sm">
        <div className="flex flex-col items-center mx-auto w-full max-w-80 sm:mx-0 sm:w-80">
          <img
            className="mx-auto w-12"
            src="/assets/images/logo/logo.svg"
            alt="logo"
          />

          <Typography className="mt-8 text-center text-4xl font-extrabold leading-[1.25] tracking-tight">
            {t("TITLE")}
          </Typography>

          <Typography
            className="mt-8 text-md font-medium"
            color="text.secondary"
          >
            <Link
              className="text-primary-500 ml-1 hover:underline"
              to="/sign-in"
            >
              {t("DESCRIPTION")}
            </Link>
          </Typography>
        </div>
      </Paper>
    </div>
  );
}

export default SignOutPage;
