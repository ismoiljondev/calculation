import i18next from "i18next";
import { lazy } from "react";
import { FuseRouteItemType } from "@fuse/utils/FuseUtils";
import en from "./i18n/en";
import ru from "./i18n/ru";
import uz from "./i18n/uz";

i18next.addResourceBundle("en", "products", en);
i18next.addResourceBundle("ru", "products", ru);
i18next.addResourceBundle("uz", "products", uz);

// organization section
const Products = lazy(() => import("./products"));
const AddNewProducts = lazy(() => import("./products/AddNew"));
const EditProducts = lazy(() => import("./products/edit"));

// ProductTypes
const ProductTypes = lazy(() => import("./product-types"));
const AddNewProductTypes = lazy(() => import("./product-types/AddNew"));
const EditProductTypes = lazy(() => import("./product-types/edit"));

/**
 * The ProductTypess page route.
 */
const Route: FuseRouteItemType = {
  path: "",
  children: [
    {
      path: "product-types",
      children: [
        {
          path: "",
          element: <ProductTypes />,
        },
        {
          path: "new",
          element: <AddNewProductTypes />,
        },
        {
          path: ":id",
          element: <EditProductTypes />,
        },
      ],
    },
    {
      path: "products",
      children: [
        {
          path: "",
          element: <Products />,
        },
        {
          path: "new",
          element: <AddNewProducts />,
        },
        {
          path: ":id",
          element: <EditProducts />,
        },
      ],
    },
  ],
};

export default Route;
