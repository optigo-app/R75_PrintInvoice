import React from "react";
import HomePage from "./components/homepage/HomePage";
// import { ThemeProvider } from "@emotion/react";
import customTheme from "../dashboard/@core/theme/theme";
import { ThemeProvider } from "@mui/material";
import "./branchroot.css";
function BranchSearchRoot() {

  const queryString = window.location.search;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const queryParams = new URLSearchParams(queryString);

  const token = queryParams.get("tkn");
  const Token = atob(token);

  return (
    <div>
      <ThemeProvider theme={customTheme}>
        <HomePage Token={Token} />
      </ThemeProvider>
    </div>
  );
}
export default BranchSearchRoot;