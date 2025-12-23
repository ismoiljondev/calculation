import { GlobalStyles } from "@mui/material";
import React from "react";
import Header from "./Header";
import EditContact from "./Form";

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
        <EditContact />
      </div>
    </>
  );
};

Edit.displayName = "Edit";
export default Edit;
