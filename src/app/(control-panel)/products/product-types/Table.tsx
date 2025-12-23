import React, { useMemo } from "react";
import { type MRT_ColumnDef } from "material-react-table";
import DataTable from "src/components/data-table/DataTable";
import FuseLoading from "@fuse/core/FuseLoading";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
} from "@mui/material";
import _ from "lodash";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { closeDialog, openDialog } from "@fuse/core/FuseDialog/fuseDialogSlice";
import { useTranslation } from "react-i18next";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { queryClient } from "@/app/App";
import { useHasPermission } from "@/utils/permissionUtils";
import MainHeader from "@/components/Header";
import {
  getProductTypeControllerFindAllQueryKey,
  useProductTypeControllerFindAll,
  useProductTypeControllerRemove,
} from "@/api/api";
import { CreateProductTypeDto } from "@/api/api.schemas";

function Table() {
  const { mutateAsync } = useProductTypeControllerRemove();
  const { data, isLoading } = useProductTypeControllerFindAll();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation("products");
  const hasPermission = useHasPermission();
  function handleDelete(id: number) {
    mutateAsync({ id })
      .then(() => {
        dispatch(
          showMessage({
            message: t("successfully_deleted", { ns: "general" }),
            variant: "success",
          })
        );
      })
      .catch(() =>
        dispatch(
          showMessage({
            message: t("error_deletion", { ns: "general" }),
            variant: "error",
          })
        )
      )
      .finally(() => {
        queryClient.invalidateQueries({
          queryKey: getProductTypeControllerFindAllQueryKey(),
        });
        dispatch(closeDialog());
      });
  }

  function handleDispatch(id: number) {
    dispatch(
      openDialog({
        children: (
          <React.Fragment>
            <DialogTitle id="alert-dialog-title">
              {t("delete_modal_title", { ns: "general" })}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {t("delete_description", { ns: "general" })}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleDelete(id)} color="error">
                {t("delete_request_yes", { ns: "general" })}
              </Button>
              <Button
                onClick={() => dispatch(closeDialog())}
                color="primary"
                autoFocus
              >
                {t("delete_request_no", { ns: "general" })}
              </Button>
            </DialogActions>
          </React.Fragment>
        ),
      })
    );
  }

  const columns = useMemo<MRT_ColumnDef<CreateProductTypeDto>[]>(
    () => [
      {
        accessorKey: "ID",
        header: t("ID", { ns: "general" }) as string,
        size: 80, // 🔹 width in pixels
        Cell: ({ row }) => (
          <div
            className="truncate"
            style={{ maxWidth: 70 }}
            dangerouslySetInnerHTML={{ __html: `${+row.id + 1}` }}
          ></div>
        ),
        enableColumnDragging: false,
        enableSorting: false,
        enableColumnFilter: false,
        enableColumnActions: false,
        muiTableHeadCellProps: {
          align: "left",
          style: {
            width: 80, // 🔹 shrink head cell
            maxWidth: 80,
            minWidth: 50,
          },
        },
        muiTableBodyCellProps: {
          align: "left",
          style: {
            width: 80,
            maxWidth: 80,
            minWidth: 50,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          },
        },
        muiTableFooterCellProps: {
          align: "left",
        },
      },
      {
        accessorKey: "name",
        header: t("product_type_name") as string,
        Cell: ({ row }) => row.original.name,
        enableColumnDragging: false,
        enableSorting: false,
        enableColumnActions: false,
      },
      {
        header: t("table_actions", { ns: "general" }) as string,
        Cell: ({ row }) => (
          <div className="flex gap-4">
            <FuseSvgIcon
              onClick={() => navigate(`/product-types/${row.original.id}`)}
              className="cursor-pointer hover:text-gray-400"
            >
              heroicons-outline:pencil
            </FuseSvgIcon>
            <FuseSvgIcon
              onClick={() => handleDispatch(row.original.id)}
              className="cursor-pointer hover:text-gray-400"
            >
              heroicons-outline:trash
            </FuseSvgIcon>
          </div>
        ),
        enableColumnDragging: false,
        enableSorting: false,
        enableColumnActions: false,
        muiTableHeadCellProps: {
          align: "right",
        },
        muiTableBodyCellProps: {
          align: "right",
        },
        muiTableFooterCellProps: {
          align: "right",
        },
      },
    ],
    []
  );

  if (isLoading) {
    return <FuseLoading />;
  }

  return (
    <>
      <MainHeader
        t_type="navigation"
        t={t}
        title="product-types"
        total={data?.data?.length}
        add_button={"ADD"}
      />
      <Paper
        className="flex flex-col flex-auto shadow-1 rounded-t-lg overflow-hidden rounded-b-none w-full h-full"
        elevation={0}
      >
        <DataTable
          data={data?.data || []}
          enableRowSelection={false}
          enableRowActions={false}
          columns={columns}
          layoutMode="grid"
          enableTopToolbar={false}
        />
      </Paper>
    </>
  );
}

export default Table;
