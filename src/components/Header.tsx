import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { motion } from "motion/react";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import NavLinkAdapter from "@fuse/core/NavLinkAdapter";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import { useTranslation } from "react-i18next";
import useUser from "@auth/useUser";
import { useHasPermission } from "@/utils/permissionUtils";
import { Paper } from "@mui/material";
import { Badge } from "@/components/Badge";
import PageBreadcrumb from "./PageBreadcrumb";
import { TFunction } from "i18next";

type Props = {
  total: number;
  t: TFunction<string, undefined>;
  title: string;
  add_button?: "ADD";
  t_type: string;
};

function MainHeader({ total, t, title, add_button, t_type }: Props) {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  return (
    <div className="flex flex-col">
      <PageBreadcrumb className="mt-4" />
      <Paper className="flex flex-wrap items-center justify-between gap-4 rounded-xl px-4 py-4 shadow md:flex-nowrap my-4">
        <motion.span
          initial={{ x: -20 }}
          animate={{ x: 0, transition: { delay: 0.2 } }}
        >
          <div>
            <div className="flex items-center gap-2">
              <Typography className="text-4xl font-extrabold leading-none tracking-tight">
                {t(title, { ns: t_type })}{" "}
              </Typography>{" "}
              <Badge className="h-8 rounded-full text-lg p-0 px-2 w-fit border border-blue-600 bg-inherit">
                {total
                  ? `${total} ${t("dona", { ns: "general" })}`
                  : `${t("not_available", { ns: "general" })}`}
              </Badge>
            </div>
          </div>
        </motion.span>
        {add_button === "ADD" && (
          <div className="flex flex-1 items-center justify-end space-x-2">
            <motion.div
              className="flex grow-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
            >
              <Button
                className=""
                variant="contained"
                color="secondary"
                component={NavLinkAdapter}
                to="new"
                size={isMobile ? "small" : "medium"}
              >
                <FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>
                <span className="mx-1 sm:mx-2">
                  {t("new", { ns: "general" })}
                </span>
              </Button>
            </motion.div>
          </div>
        )}
      </Paper>
    </div>
  );
}

export default MainHeader;
