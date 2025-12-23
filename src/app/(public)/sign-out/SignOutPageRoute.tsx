import { FuseRouteItemType } from "@fuse/utils/FuseUtils";
import SignOutPage from "./SignOutPage";
import uz from "./i18n/uz";
import ru from "./i18n/uz";
import en from "./i18n/en";
import i18next from "i18next";

i18next.addResourceBundle("uz", "signOutPage", uz);
i18next.addResourceBundle("ru", "signOutPage", ru);
i18next.addResourceBundle("en", "signOutPage", en);

const SignOutPageRoute: FuseRouteItemType = {
  path: "sign-out",
  element: <SignOutPage />,
  settings: {
    layout: {
      config: {
        navbar: {
          display: false,
        },
        toolbar: {
          display: false,
        },
        footer: {
          display: false,
        },
        leftSidePanel: {
          display: false,
        },
        rightSidePanel: {
          display: false,
        },
      },
    },
  },
  auth: null,
};

export default SignOutPageRoute;
