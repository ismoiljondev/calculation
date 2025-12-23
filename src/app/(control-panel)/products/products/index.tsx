import * as React from "react";
import { GlobalStyles } from "@mui/material";
import Table from "./Table";

export default function OrganizationSection() {
  return (
    <>
      <GlobalStyles
        styles={() => ({
          "#root": {
            maxHeight: "100vh",
          },
        })}
      />
      <div className="w-full h-full flex flex-col px-4">
        <Table />
      </div>
    </>
  );
}
