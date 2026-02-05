import * as React from "react";

import {
  createBrowserRouter,
} from "react-router-dom";
import AllDesign from "../pages/AllDesign";
import QcReport from "../pages/qcreport/QcReport";
import MRPBill from "../pages/MRPBill/MRPBill";

const router = createBrowserRouter([
  {
    path: "/*",
    element: <AllDesign />,
  },
  // {
  //   path: "/qcreport",
  //   element: <QcReport />,
  // },
  // {
  //   path: "/mrpbill",
  //   element: <><MRPBill /></>,
  // },
  // {
  //   path: "/*",
  //   element: <><AllDesign /></>,
  // },
]);

export default router