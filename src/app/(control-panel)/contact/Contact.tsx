import * as React from "react";
import { GlobalStyles } from "@mui/material";
import Header from "./Header";
import Table from "./Table";

export default function Contact() {
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
        <Table />
      </div>
    </>
  );
}
