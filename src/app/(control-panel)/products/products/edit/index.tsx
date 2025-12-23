import { GlobalStyles } from "@mui/material";
import React from "react";
import Header from "./Header";
import EditProductTypes from "../components/edit";

interface EditProps {}

const Edit: React.FC<EditProps> = ({}) => {
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
        <EditProductTypes />
      </div>
    </>
  );
};

Edit.displayName = "Edit";
export default Edit;
