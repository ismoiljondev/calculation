import React, { useMemo } from "react";
import { type MRT_ColumnDef } from "material-react-table";
import DataTable from "src/components/data-table/DataTable";
import FuseLoading from "@fuse/core/FuseLoading";
import { Paper } from "@mui/material";
import _ from "lodash";
import { useTranslation } from "react-i18next";

import { NumericFormat } from "react-number-format";
import { useExchangeRateControllerFindAll } from "@/api/api";
import { CreateExchangeRateDto } from "@/api/api.schemas";

function IndividualLoanTable() {
  const { data, isLoading } = useExchangeRateControllerFindAll();

  const { t } = useTranslation("currency");
  const columns = useMemo<MRT_ColumnDef<CreateExchangeRateDto>[]>(
    () => [
      {
        accessorKey: "name",
        header: t("bank_name") as string,
        Cell: ({ row }) => row.original?.bank_name,
        enableColumnDragging: false,
        enableSorting: false,
        enableColumnActions: false,
      },
      {
        accessorKey: "exchange_rate",
        header: t("exchange_rate") as string,
        Cell: ({ row }) => (
          <NumericFormat
            value={row.original?.rate}
            displayType="text"
            thousandSeparator=" "
            suffix={` UZS`}
          />
        ),
        enableColumnDragging: false,
        enableSorting: false,
        enableColumnActions: false,
      },
    ],
    []
  );

  if (isLoading) {
    return <FuseLoading />;
  }

  return (
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
  );
}

export default IndividualLoanTable;
