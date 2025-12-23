import * as React from "react";
import { GlobalStyles } from "@mui/material";
import Header from "./Header";
import CurrencyTable from "./Table";

export default function Currency() {
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
        <Header />
        <CurrencyTable />
      </div>
    </>
  );
}
