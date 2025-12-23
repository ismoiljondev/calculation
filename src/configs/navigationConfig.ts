import i18n from "@i18n";
import { FuseNavItemType } from "@fuse/core/FuseNavigation/types/FuseNavItemType";
import uz from "./navigation-i18n/uz";
import en from "./navigation-i18n/en";
import ru from "./navigation-i18n/ru";

i18n.addResourceBundle("en", "navigation", en);
i18n.addResourceBundle("uz", "navigation", uz);
i18n.addResourceBundle("ru", "navigation", ru);

/**
 * The navigationConfig object is an array of navigation items for the Fuse application.
 */
const navigationConfig: FuseNavItemType[] = [
  {
    id: "products-component-group",
    title: "products",
    translate: "products",
    type: "group",
    auth: null,
    children: [
      {
        id: "product-types",
        title: "List",
        translate: "product-types",
        type: "item",
        icon: "heroicons-outline:banknotes",
        url: "/product-types",
      },
      {
        id: "products",
        title: "List",
        translate: "products",
        type: "item",
        icon: "heroicons-outline:banknotes",
        url: "/products",
      },
    ],
  },
  {
    id: "currency-group",
    title: "Currency",
    translate: "CURRENCY",
    type: "group",
    auth: null,
    children: [
      {
        id: "list-currency",
        title: "List",
        translate: "CURRENCY-LIST",
        type: "item",
        icon: "heroicons-outline:currency-dollar",
        url: "/currency",
      },
    ],
  },
  {
    id: "contact-group",
    title: "Contact",
    translate: "CONTACT",
    type: "group",
    auth: null,
    children: [
      {
        id: "list-CONTACT",
        title: "List",
        translate: "CONTACT-LIST",
        type: "item",
        icon: "heroicons-outline:phone-arrow-up-right",
        url: "/contact",
      },
    ],
  },
];

export default navigationConfig;
