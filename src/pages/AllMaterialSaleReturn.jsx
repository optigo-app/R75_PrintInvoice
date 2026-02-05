import queryString from "query-string";
import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
// import EngageMat from './bagPrints/jobBagStickers/EngageMat';

const AllMaterialSaleReturn = () => {
  
  const location = useLocation();
  const [importedComponent, setImportedComponent] = useState(null);
  const queryParams = queryString?.parse(location.search);
  const printName = queryParams?.matreturn;
  
  const queries = {
    YearCode: queryParams.YearCode,
    appuserid: queryParams.appuserid,
    custid: queryParams.custid,
    ifid: queryParams.ifid,
    pid: queryParams.pid,
    printname: queryParams.printname,
    version: queryParams.version,
    url: queryParams.report_api_url,
    pageStart: +queryParams.start_page,
  };
  const headers = {
    "Content-Type": "application/json",
    Authorization: "",
    YearCode: queries.YearCode,
    version: queries.version,
  };
  const ImportComponent = async (name) => {
    try {
      // const module = await import(`./bagPrints/${name}`);
      const module = await import(`./materialSaleReturn/InvoicePrint2`);
      const AnotherComponent = module?.default;
      return <AnotherComponent queries={queries} headers={headers} />;
    } catch (error) {
      console.log(error);
    }
  };

  const takeMatSaleReturnPrints = async () => {
    
    let module = await import("../GlobalFunctions/materialSaleReturnConditions");
    let conditions = module?.materialSaleReturnConditions;
    let findPrint = conditions?.find((e) => e?.printName?.toLowerCase() === (atob(printName))?.toLowerCase());
    if (findPrint) {
      const component = await ImportComponent(findPrint?.componentName);
      setImportedComponent(component);
    }
  };
  useEffect(() => {
    takeMatSaleReturnPrints();
  }, []);
  return <div>{importedComponent}</div>;
};


export default AllMaterialSaleReturn;