import i18next from "i18next";
import { lazy } from "react";
import { FuseRouteItemType } from "@fuse/utils/FuseUtils";
import en from "./i18n/en";
import ru from "./i18n/ru";
import uz from "./i18n/uz";
import Edit from "./edit";

i18next.addResourceBundle("en", "contact", en);
i18next.addResourceBundle("ru", "contact", ru);
i18next.addResourceBundle("uz", "contact", uz);

const Contact = lazy(() => import("./Contact"));
const AddNew = lazy(() => import("./AddNew"));

/**
 * The Loans page route.
 */
const Route: FuseRouteItemType = {
  path: "contact",
  children: [
    {
      path: "",
      element: <Contact />,
    },

    {
      path: "new",
      element: <AddNew />,
    },
    {
      path: ":id",
      element: <Edit />,
    },
  ],
};

export default Route;
