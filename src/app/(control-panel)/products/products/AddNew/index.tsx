import { GlobalStyles } from "@mui/material";
import React from "react";
import Header from "./Header";
import AddNewProductTypes from "../components/add";

interface AddNewProps {}

const AddNew: React.FC<AddNewProps> = ({}) => {
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
        <AddNewProductTypes />
      </div>
    </>
  );
};

AddNew.displayName = "AddNew";
export default AddNew;
