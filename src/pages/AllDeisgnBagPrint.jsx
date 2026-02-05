import queryString from 'query-string';
import React from 'react';
import { useLocation } from 'react-router-dom';
import PrintDesign17 from './bagPrints/PrintDesign17';
import PrintDesign16 from './bagPrints/PrintDesign16';
import PrintDesign16A from './bagPrints/PrintDesign16A';
import BagPrint15A from "./bagPrints/BagPrint15A";
import BagPrint14A from './bagPrints/BagPrint14A';
import BagPrint1A from './bagPrints/BagPrint1A';
import BagPrint2A from './bagPrints/BagPrint2A';
import BagPrint3A from './bagPrints/BagPrint3A';
import BagPrint5A from './bagPrints/BagPrint5A';
import BagPrint6A from './bagPrints/BagPrint6A';
import BagPrint10A from './bagPrints/BagPrint10A';
import BagPrint7A from './bagPrints/BagPrint7A';
import BagPrint4A from './bagPrints/BagPrint4A';
import BagPrint11A from './bagPrints/BagPrint11A';
import BagPrint12A from './bagPrints/BagPrint12A';
// import BagPrint16A from './bagPrints/BagPrint16A';
import BagPrint18A from './bagPrints/BagPrint18A';
import BagPrint4B from './bagPrints/BagPrint4B';
import BagPrint4C from './bagPrints/BagPrint4C';
// import BagPrint17A from './bagPrints/BagPrint17A';
// import Bg18 from './bagPrints/Bg18';
import BagPrint20A from './bagPrints/BagPrint20A';
import Jobbagsticker from './bagPrints/Jobbagsticker';
import Jobbagsticker3 from './bagPrints/Jobbagsticker3';
import PrintDesign16M from './bagPrints/PrintDesign16M';
import PrintDesign16A from './bagPrints/PrintDesign16A';
import PrintDesign0 from './bagPrints/PrintDesign0';
// import EngageMat from './bagPrints/jobBagStickers/EngageMat';

const AllDesignBagPrint = () => {
  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const printName = queryParams?.printname?.toLowerCase();
  let queries = {
    YearCode: queryParams.YearCode,
    appuserid: queryParams.appuserid,
    custid: queryParams.custid,
    ifid: queryParams.ifid,
    pid: queryParams.pid,
    printname: queryParams.printname,
    version: queryParams.version,
    url: queryParams.report_api_url,
    pageStart: +(queryParams.start_page)
  };
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': '',
    'YearCode': queries.YearCode,
    'version': queries.version
  };

  return (
    <div>
      {printName === "bagprint1a" && <BagPrint1A queries={queries} headers={headers} />}
      {printName === "bagprint2a" && <BagPrint2A queries={queries} headers={headers} />}
      {printName === "bagprint3a" && <BagPrint3A queries={queries} headers={headers} />}
      {printName === "bagprint4a" && <BagPrint4A queries={queries} headers={headers} />}
      {printName === "bagprint4b" && <BagPrint4B queries={queries} headers={headers} />}
      {printName === "BagPrint4c" && <BagPrint4C queries={queries} headers={headers} />}
      {printName === "bagprint5a" && <BagPrint5A queries={queries} headers={headers} />}
      {printName === "bagprint6a" && <BagPrint6A queries={queries} headers={headers} />}
      {printName === "bagprint7a" && <BagPrint7A queries={queries} headers={headers} />}
      {printName === "bagprint20" && <BagPrint20A queries={queries} headers={headers} />}
      {printName === "bagprint10a" && <BagPrint10A queries={queries} headers={headers} />}
      {printName === "bagprint11a" && <BagPrint11A queries={queries} headers={headers} />}
      {printName === "bagprint12a" && <BagPrint12A queries={queries} headers={headers} />}
      {printName === "bagprint13a" && <BagPrint13A queries={queries} headers={headers} />}
      {printName === "bagprint14a" && <BagPrint14A queries={queries} headers={headers} />}
      {printName === "bagprint15a" && <BagPrint15A queries={queries} headers={headers} />}

      {printName === "bagprint16" && <PrintDesign16 queries={queries} headers={headers} />}
      {printName === "bagprint0" && <PrintDesign0 queries={queries} headers={headers} />}

      {printName === "bagprint16M" && <PrintDesign16M queries={queries} headers={headers} />}
      {printName === "bagprint16A" && <PrintDesign16A queries={queries} headers={headers} />}


      {printName === "bagprint17" && <PrintDesign17 queries={queries} headers={headers} />}
      {/* {printName === "BagPrint16" && <BagPrint16A queries={queries} headers={headers} />} */}
      {/* {printName === "BagPrint17" && <BagPrint17A queries={queries} headers={headers} />} */}
      {printName === "bagprint18" && <BagPrint18A queries={queries} headers={headers} />}
      {/* {printName === "BagPrint16" && <BagPrint16A queries={queries} headers={headers} />} */}
      {/* {printName === "BagPrint16" && <BagPrint16A queries={queries} headers={headers} />} */}
      {printName === "jobbagstickera" && <Jobbagsticker queries={queries} headers={headers} />}
      {/* {printName === "JobbagstickerA" && <EngageMat queries={queries} headers={headers} />} */}
      {printName === "jobbagsticker3" && <Jobbagsticker3 queries={queries} headers={headers} />}
      {/* {printName === "BagPrint18" && <Bg18 queries={queries} headers={headers} />} */}
    </div>
  );
};

export default AllDesignBagPrint;