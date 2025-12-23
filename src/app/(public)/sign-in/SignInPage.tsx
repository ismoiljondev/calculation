import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import CardContent from "@mui/material/CardContent";
import _ from "lodash";
import JwtLoginTab from "./tabs/JwtSignInTab";
import { useTranslation } from "react-i18next";

/**
 * The sign in page.
 */
function SignInPage() {
  const { t } = useTranslation("general")
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center sm:flex-row sm:justify-center md:items-start md:justify-start">
      <Paper className="h-full w-full px-4 py-2 ltr:border-r-1 rtl:border-l-1 sm:h-auto sm:w-auto sm:rounded-xl sm:p-12 sm:shadow-sm md:flex md:h-full md:w-1/2 md:items-center md:justify-end md:rounded-none md:p-16 md:shadow-none">
        <CardContent className="mx-auto w-full max-w-80 sm:mx-0 sm:w-80">
          <Typography className="mt-8 text-4xl font-extrabold leading-[1.25] tracking-tight">
            {t("welcome")}
          </Typography>

          <JwtLoginTab />
        </CardContent>
      </Paper>

      <Box
        className="relative hidden h-full flex-auto items-center justify-center overflow-hidden p-16 md:flex lg:px-28"
        sx={{ backgroundColor: "primary.dark", color: "primary.contrastText" }}
      >
        <div className="relative z-10 w-full max-w-4xl">
          <img src="/assets/images/etc/logo.png" alt="logo" />
        </div>
      </Box>
    </div>
  );
}

export default SignInPage;
