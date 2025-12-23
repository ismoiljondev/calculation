import i18next from "i18next";
import { lazy } from "react";
import { FuseRouteItemType } from "@fuse/utils/FuseUtils";
import en from "./i18n/en";
import ru from "./i18n/ru";
import uz from "./i18n/uz";

i18next.addResourceBundle("en", "currency", en);
i18next.addResourceBundle("ru", "currency", ru);
i18next.addResourceBundle("uz", "currency", uz);

const Currency = lazy(() => import("./Currency"));

/**
 * The Loans page route.
 */
const Route: FuseRouteItemType = {
  path: "currency",
  children: [
    {
      path: "",
      element: <Currency />,
    },
  ],
};

export default Route;
