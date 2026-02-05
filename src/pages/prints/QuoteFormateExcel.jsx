import React from "react";
import { useState } from "react";
import Loader from "../../components/Loader";
import { useEffect } from "react";
import {
  NumberWitdCommas,
  NumberWithCommas,
  apiCall,
  checkMsg,
  handleGlobalImgError,
  isObjectEmpty,
} from "../../GlobalFunctions";
import ReactdTMLTableToExcel from "react-html-table-to-excel";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";

const QuoteFormateExcel = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
  const [loader, setLoader] = useState(true);
  const [msg, setMsg] = useState("");
  const [header, setdeader] = useState({});
  const [data, setData] = useState([]);
  const [total, setTotal] = useState({
    metalAmount: 0,
    diamondPcs: 0,
    diamondWt: 0,
    diamondAmount: 0,
    miscsPcs: 0,
    miscsWt: 0,
    miscsAmount: 0,
    settingAmount: 0,
    makingAmount: 0,
    otherCharges: 0,
    unitcost: 0,
    qty: 0,
    totalAmount: 0,
  });
  const [isImageWorking, setIsImageWorking] = useState(true);
  const handleImageErrors = () => {
    setIsImageWorking(false);
  };
  const [tax, setTax] = useState([]);

  const loadData = (data) => {
    let Mostly_Calculation = OrganizeDataPrint(
      data?.BillPrint_Json[0],
      data?.BillPrint_Json1,
      data?.BillPrint_Json2
    );
    let totals = { ...total };

    let json0Data = data?.BillPrint_Json[0];
    let resultArr = [];
    Mostly_Calculation?.resultArray?.forEach((e, i) => {
      totals.makingAmount += e?.MakingAmount;
      totals.otherCharges += e?.OtherCharges;
      totals.totalAmount += e?.TotalAmount;
      totals.qty += e?.Quantity;

      let settingDiamonds = [];
      let settingcolorStones = [];
      let diamondWt = 0;
      e?.diamonds.forEach((ele, ind) => {
        diamondWt += ele?.Wt;
        totals.diamondPcs += ele?.Pcs;
        totals.diamondAmount += ele?.Amount;
        totals.diamondWt += ele?.Wt;
        totals.settingAmount += ele?.SettingAmount;
        let findRecord = settingDiamonds.findIndex(
          (elem, index) =>
            elem?.ShapeName === ele?.ShapeName &&
            elem?.Colorname === ele?.Colorname &&
            elem?.QualityName === ele?.QualityName &&
            elem?.SizeName === ele?.SizeName &&
            elem?.SettingName === ele?.SettingName
        );
        if (findRecord === -1) {
          settingDiamonds.push(ele);
        } else {
          settingDiamonds[findRecord].Pcs += ele?.Pcs;
          settingDiamonds[findRecord].Wt += ele?.Wt;
          settingDiamonds[findRecord].Amount += ele?.Amount;
          if (ele?.SettingAmount !== null) {
            settingDiamonds[findRecord].SettingAmount += ele?.SettingAmount;
          }
        }
      });
      e?.colorstone.forEach((ele, ind) => {
        totals.diamondPcs += ele?.Pcs;
        totals.diamondAmount += ele?.Amount;
        totals.diamondWt += ele?.Wt;
        totals.settingAmount += ele?.SettingAmount;
        let findRecord = settingcolorStones.findIndex(
          (elem, index) =>
            elem?.ShapeName === ele?.ShapeName &&
            elem?.Colorname === ele?.Colorname &&
            elem?.QualityName === ele?.QualityName &&
            elem?.SizeName === ele?.SizeName &&
            elem?.SettingName === ele?.SettingName
        );
        if (findRecord === -1) {
          settingcolorStones.push(ele);
        } else {
          settingcolorStones[findRecord].Pcs += ele?.Pcs;
          settingcolorStones[findRecord].Wt += ele?.Wt;
          settingcolorStones[findRecord].Amount += ele?.Amount;
          if (ele?.SettingAmount !== null) {
            settingcolorStones[findRecord].SettingAmount += ele?.SettingAmount;
          }
        }
      });

      let miscs = [];

      e?.misc.forEach((ele, ind) => {
        totals.miscsPcs += ele?.Pcs;
        totals.miscsWt += ele?.Wt;
        totals.miscsAmount += ele?.Amount;
        let findRecord = miscs.findIndex(
          (elem, index) =>
            elem?.ShapeName === ele?.ShapeName &&
            elem?.Colorname === ele?.Colorname &&
            elem?.QualityName === ele?.QualityName &&
            elem?.SizeName === ele?.SizeName &&
            elem?.SettingName === ele?.SettingName
        );
        if (findRecord === -1) {
          miscs.push(ele);
        } else {
          miscs[findRecord].Pcs += ele?.Pcs;
          miscs[findRecord].Wt += ele?.Wt;
          miscs[findRecord].Amount += ele?.Amount;
          if (ele?.SettingAmount !== null) {
            miscs[findRecord].SettingAmount += ele?.SettingAmount;
          }
        }
      });

      settingDiamonds.sort((a, b) => {
        let nameA = a?.ShapeName;
        let nameB = b?.ShapeName;
        if (nameA < nameB) {
          return -1;
        } else {
          return 1;
        }
      });

      settingcolorStones.sort((a, b) => {
        let nameA = a?.ShapeName;
        let nameB = b?.ShapeName;
        if (nameA < nameB) {
          return -1;
        } else {
          return 1;
        }
      });

      miscs.sort((a, b) => {
        let nameA = a?.ShapeName;
        let nameB = b?.ShapeName;
        if (nameA < nameB) {
          return -1;
        } else {
          return 1;
        }
      });

      let metalFinding = [...e?.metal, ...e?.finding].flat();
      let wtmd = 0;
      if (e?.metal[0]) {
        wtmd = e?.metal[0].Wt;
      }
      wtmd += (diamondWt / 5);

      let metalamount = metalFinding.reduce((acc, cobj) => {
        return acc + cobj?.Amount;
      }, 0);

      totals.metalAmount += metalamount;

      let diamondColorStones = [
        ...settingDiamonds,
        ...settingcolorStones,
        // ...miscs,
      ].flat();
      let length = 6;

      if (length < miscs.length) {
        length = miscs.length;
      }

      if (length < metalFinding.length) {
        length = metalFinding.length;
      }

      if (length < diamondColorStones.length) {
        length = diamondColorStones.length;
      }

      Array.from({ length: length }).forEach((elem, index) => {
        let obj = {
          srNo: index === 0 ? i + 1 : 0,
          designNo: index === 4 ? e?.designno : 0,
          category: index === 5 ? e?.Categoryname : 0,
          img: index === 1 ? e?.DesignImage : 0,
          metalQuality: metalFinding[index]
            ? `${metalFinding[index]?.ShapeName} ${metalFinding[index]?.QualityName} ${metalFinding[index]?.FindingTypename} ${metalFinding[index]?.FindingAccessories}`
            : "",
          color: metalFinding[index] ? metalFinding[index]?.Colorname : "",
          wtmd: index === 0 ? wtmd : 0,
          netWt: metalFinding[index] ? metalFinding[index]?.Wt : "",
          grossWt: metalFinding[index] ? e?.grosswt : "",
          metalRate: metalFinding[index] ? metalFinding[index]?.Rate : "",
          metalAmount: metalFinding[index] ? metalFinding[index]?.Amount : "",
          diamondCode: `${diamondColorStones[index]
            ? `${diamondColorStones[index]
              ?.MasterManagement_DiamondStoneTypeid === 1
              ? "D"
              : ""
            } 
          ${diamondColorStones[index]?.MasterManagement_DiamondStoneTypeid === 2
              ? "CS"
              : ""
            } 
          ${diamondColorStones[index]?.ShapeName}
          ${diamondColorStones[index]?.QualityName}
          ${diamondColorStones[index]?.Colorname}`
            : ""
            }`,
          diamondSize: diamondColorStones[index]
            ? diamondColorStones[index]?.SizeName
            : "",
          diamondPcs: diamondColorStones[index] ? diamondColorStones[index]?.Pcs : 0,
          diamondWt: diamondColorStones[index] ? diamondColorStones[index]?.Wt : 0,
          diamondRate: diamondColorStones[index]
            ? diamondColorStones[index]?.Rate
            : 0,
          diamondAmount: diamondColorStones[index]
            ? diamondColorStones[index]?.Amount
            : 0,

          designNoFlag: index === 4 ? true : false,
          categoryFlag: index === 5 ? true : false,
          imgFlag: index === 1 ? true : false,

          miscCode: `${miscs[index]
            ? `M ${miscs[index]?.ShapeName} ${miscs[index]?.QualityName} ${miscs[index]?.Colorname}`
            : ""
            } `,
          miscSize: miscs[index] ? miscs[index]?.SizeName : "",
          miscPcs: miscs[index] ? miscs[index]?.Pcs : 0,
          miscWt: miscs[index] ? miscs[index]?.Wt : 0,
          miscRate: miscs[index] ? miscs[index]?.Rate : 0,
          miscAmount: miscs[index] ? miscs[index]?.Amount : 0,

          settingAmount: diamondColorStones[index]
            ? diamondColorStones[index]?.SettingAmount
            : 0,
          SettingName: diamondColorStones[index]
            ? (diamondColorStones[index]?.SettingName !== "0" ? diamondColorStones[index]?.SettingName : "")
            : "",
          SettingRate: diamondColorStones[index]
            ? diamondColorStones[index]?.SettingRate
            : 0,
          makingRate: index === 0 ? e?.MaKingCharge_Unit : 0,
          makingAmount: index === 0 ? e?.MakingAmount : 0,
          makingHeightRowWise: index === 0 ? length : 0,
          other: index === 0 ? e?.OtherCharges : 0,
          unitCost: index === 0 ? e?.UnitCost : 0,
          qty: index === 0 ? e?.Quantity : 0,
          totalAmount: index === 0 ? e?.TotalAmount : 0,
        };
        resultArr.push(obj);
      });
    });

    if (data?.BillPrint_Json[0]?.AddLess !== 0) {
      Mostly_Calculation?.allTaxes.push({
        name: `${data?.BillPrint_Json[0]?.AddLess > 0 ? "Add" : "Less"}`,
        per: "",
        amount: data?.BillPrint_Json[0]?.AddLess,
      });
    }

    let totalAmount =
      Mostly_Calculation?.allTaxes.reduce((acc, cobj) => {
        return acc + +cobj?.amount;
      }, 0) + totals?.totalAmount;

    totals.totalAmount = totalAmount;

    setTax(Mostly_Calculation?.allTaxes);
    setTotal(totals);
    setData(resultArr);
    setdeader(json0Data);
    setTimeout(() => {
      const button = document.getElementById("test-table-xls-button");
      button.click();
    }, 100);
  };

  useEffect(() => {
    const sendData = async () => {
      try {
        const data = await apiCall(token, invoiceNo, printName, urls, evn, ApiVer);
        if (data?.Status === "200") {
          let isEmpty = isObjectEmpty(data?.Data);
          if (!isEmpty) {
            loadData(data?.Data);
            setLoader(false);
          } else {
            setLoader(false);
            setMsg("Data Not Found");
          }
        } else {
          setLoader(false);
          // setMsg(data?.Message);
          const err = checkMsg(data?.Message);
                    console.log(data?.Message);
                    setMsg(err);
        }
      } catch (error) {
        console.error(error);
      }
    };
    sendData();
  }, []);

  return (
    <>
      {loader ? (
        <Loader />
      ) : msg === "" ? (
        <div className="d-none">
          <ReactdTMLTableToExcel
            id="test-table-xls-button"
            className="download-table-xls-button btn btn-success text-black bg-success px-2 py-1 fs-5 d-none"
            table="table-to-xls"
            filename={`Quote_Format_${header?.InvoiceNo}_${Date.now()}`}
            sheet="tablexls"
            buttonText="Download as XLS"
          />
          <table id="table-to-xls">
            <thead>
              <tr></tr>
              <tr>
                <td width={20}></td>
                <th
                  colSpan={31}
                  align="left"
                  height={40}
                  style={{
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #b5b5b5",
                    padding: "1px",
                    fontWeight: "bold",
                  }}
                >
                  <font size="5">{header?.companyname} </font>
                </th>
              </tr>

              <tr>
                <td></td>
                <td colSpan={26} align="left" style={{ borderLeft: "1px solid #b5b5b5", borderRight: "1px solid #b5b5b5", padding: "1px" }}>
                  <p className="">TO</p>
                </td>
                {/* <td colSpan={19} rowSpan={4}></td> */}
                <td>
                  <p className="fw-normal">Quotation#</p>
                </td>
                <td colSpan={4} align="left" style={{ fontWeight: "bold", borderRight: "1px solid #b5b5b5", padding: "1px" }}>
                  <p className="fw-bold">: {header?.InvoiceNo}</p>
                </td>
              </tr>

              <tr>
                <td></td>
                <td colSpan={26} align="left" style={{ borderLeft: "1px solid #b5b5b5", borderRight: "1px solid #b5b5b5", padding: "1px" }}>
                  <p className="">{header?.customerfirmname}</p>
                </td>
                <td>
                  <p className="fw-normal">Date</p>
                </td>
                <td colSpan={4} align="left" style={{ fontWeight: "bold", borderRight: "1px solid #b5b5b5", padding: "1px" }}>
                  <p className="fw-bold">: {header?.EntryDate}</p>
                </td>
              </tr>

              <tr>
                <td></td>
                <td colSpan={26} align="left" style={{ borderLeft: "1px solid #b5b5b5", borderRight: "1px solid #b5b5b5", padding: "1px" }}>
                  <p className="">{header?.customerstreet}</p>
                </td>
                <td></td>
                <td colSpan={4} style={{ borderRight: "1px solid #b5b5b5", padding: "1px" }}></td>
              </tr>

              <tr>
                <td></td>
                <td colSpan={26} align="left" style={{ borderLeft: "1px solid #b5b5b5", borderRight: "1px solid #b5b5b5", padding: "1px" }}>
                  <p className="">{header?.customercity}</p>
                </td>
                <td>
                  <p> </p>
                </td>
                <td colSpan={4} style={{ borderRight: "1px solid #b5b5b5", padding: "1px" }}>
                  <p> </p>
                </td>
              </tr>

              {/* table header */}
              <tr>
                <td></td>
                <th width={60} rowSpan={2} style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} align="center" >
                  <p>Sr</p>
                </th>

                <th rowSpan={2} width={150} style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} align="center" >
                  <p>Design</p>
                </th>

                <th colSpan={7} style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} align="center" >
                  Metal
                </th>

                <th width={80} colSpan={6} style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} >
                  Diamond & Stones
                </th>

                <th width={80} colSpan={6} style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} >
                  Misc
                </th>

                <th colSpan={3} style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} >
                  Setting Amt
                </th>

                <th width={80} colSpan={2} style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} >
                  Making
                </th>
                <th width={100} style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} rowSpan={2} >
                  Other
                </th>

                <th width={150} style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} rowSpan={2} >
                  Unit Cost
                </th>

                <th width={80} style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} rowSpan={2} >
                  Qty
                </th>

                <th width={150} style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} rowSpan={2}  colSpan={2}>
                  Total Amount
                </th>
              </tr>
              <tr>
                <td></td>
                <th width={160} style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} align="center" >
                  Quality
                </th>
                <th width={80} style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} >
                  Color
                </th>
                <th width={80} style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} >
                  Wt (M+D)
                </th>
                <th width={80} style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} >
                  Net Wt
                </th>
                <th width={80} style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} >
                  Gross Wt
                </th>
                <th width={80} style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} >
                  Rate
                </th>
                <th width={80} style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} >
                  Amt.
                </th>

                <th width={120} style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} >
                  Code
                </th>
                <th width={80} style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} >
                  Size
                </th>
                <th width={80} style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} >
                  Pcs
                </th>
                <th width={80} style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} >
                  Wt
                </th>
                <th width={80} style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} >
                  Rate
                </th>
                <th width={80} style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} >
                  Amt .
                </th>

                <th width={120} style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} >
                  Code
                </th>
                <th width={80} style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} >
                  Size
                </th>
                <th width={80} style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} >
                  Pcs
                </th>
                <th width={80} style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} >
                  Wt
                </th>
                <th width={80} style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} >
                  Rate
                </th>
                <th width={80} style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} >
                  Amt .
                </th>

                <th width={100} style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} >
                  Setting Type
                </th>
                <th width={100} style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} >
                  Setting Rate
                </th>
                <th width={100} style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} >
                  Setting Amt
                </th>

                <th width={100} style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} >
                  Making Rate
                </th>
                <th width={80} style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} colSpan={2}>
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {/* data */}
              {data.map((e, i) => {
                return (
                  <tr key={i}>
                    <td></td>

                    <td style={{ borderBottom: `${data[i + 1]?.srNo !== 0 ? "1px solid #bdbdbd" : ""}`, borderLeft: "1px solid #bdbdbd", borderRight: "1px solid #bdbdbd", padding: "0.5px", }} >
                      {e?.srNo !== 0 && e?.srNo}
                    </td>

                    <td style={{ borderBottom: `${data[i + 1]?.srNo !== 0 ? "1px solid #bdbdbd" : ""}`, borderLeft: "1px solid #bdbdbd", borderRight: "1px solid #bdbdbd", padding: "0.5px", }} >
                      {e?.imgFlag && (
                        <div style={{ height: "21px" }}>
                          <img src={e?.img} alt="" onError={(eve) => handleGlobalImgError(eve, header?.DefImage)} style={{ objectFit: "contain", }} width={60} />
                        </div>
                      )}
                      {e?.categoryFlag && (
                        <p className="fw-bold" align="center">
                          {e?.category}
                        </p>
                      )}
                      {e?.designNoFlag && (
                        <p className="fw-bold" align="center">
                          <font size="3">
                            <b> {e?.designNo}</b>
                          </font>
                        </p>
                      )}
                    </td>

                    <td style={{ borderBottom: `${data[i + 1]?.srNo !== 0 ? "1px solid #bdbdbd" : ""}`, borderLeft: "1px solid #bdbdbd", borderRight: "1px solid #bdbdbd", padding: "0.5px", }}>{e?.metalQuality}</td>

                    <td style={{ borderBottom: `${data[i + 1]?.srNo !== 0 ? "1px solid #bdbdbd" : ""}`, borderLeft: "1px solid #bdbdbd", borderRight: "1px solid #bdbdbd", padding: "0.5px", }}>{e?.color}</td>
                    <td style={{ borderBottom: `${data[i + 1]?.srNo !== 0 ? "1px solid #bdbdbd" : ""}`, borderLeft: "1px solid #bdbdbd", borderRight: "1px solid #bdbdbd", padding: "0.5px", }}>{e?.wtmd !== 0 && NumberWithCommas(e?.wtmd, 3)}</td>
                    <td style={{ borderBottom: `${data[i + 1]?.srNo !== 0 ? "1px solid #bdbdbd" : ""}`, borderLeft: "1px solid #bdbdbd", borderRight: "1px solid #bdbdbd", padding: "0.5px", }}> {e?.netWt !== "" && NumberWithCommas(e?.netWt, 3)}</td>

                    <td style={{ borderBottom: `${data[i + 1]?.srNo !== 0 ? "1px solid #bdbdbd" : ""}`, borderLeft: "1px solid #bdbdbd", borderRight: "1px solid #bdbdbd", padding: "0.5px", }}>
                      {e?.grossWt !== "" && NumberWithCommas(e?.grossWt, 3)}
                    </td>
                    <td style={{ borderBottom: `${data[i + 1]?.srNo !== 0 ? "1px solid #bdbdbd" : ""}`, borderLeft: "1px solid #bdbdbd", borderRight: "1px solid #bdbdbd", padding: "0.5px", }}> {e?.metalRate !== "" && NumberWithCommas(e?.metalRate, 2)} </td>
                    <td style={{ borderBottom: `${data[i + 1]?.srNo !== 0 ? "1px solid #bdbdbd" : ""}`, borderLeft: "1px solid #bdbdbd", borderRight: "1px solid #bdbdbd", padding: "0.5px", }}> {e?.metalAmount !== "" && NumberWithCommas(e?.metalAmount, 2)} </td>

                    <td style={{ borderBottom: `${data[i + 1]?.srNo !== 0 ? "1px solid #bdbdbd" : ""}`, borderLeft: "1px solid #bdbdbd", borderRight: "1px solid #bdbdbd", padding: "0.5px", }}>{e?.diamondCode}</td>
                    <td style={{ borderBottom: `${data[i + 1]?.srNo !== 0 ? "1px solid #bdbdbd" : ""}`, borderLeft: "1px solid #bdbdbd", borderRight: "1px solid #bdbdbd", padding: "0.5px", }}>{e?.diamondSize}</td>
                    <td style={{ borderBottom: `${data[i + 1]?.srNo !== 0 ? "1px solid #bdbdbd" : ""}`, borderLeft: "1px solid #bdbdbd", borderRight: "1px solid #bdbdbd", padding: "0.5px", }}> {e?.diamondPcs !== 0 && NumberWithCommas(e?.diamondPcs, 0)} </td>
                    <td style={{ borderBottom: `${data[i + 1]?.srNo !== 0 ? "1px solid #bdbdbd" : ""}`, borderLeft: "1px solid #bdbdbd", borderRight: "1px solid #bdbdbd", padding: "0.5px", }}> {e?.diamondWt !== 0 && NumberWithCommas(e?.diamondWt, 3)} </td>
                    <td style={{ borderBottom: `${data[i + 1]?.srNo !== 0 ? "1px solid #bdbdbd" : ""}`, borderLeft: "1px solid #bdbdbd", borderRight: "1px solid #bdbdbd", padding: "0.5px", }}> {e?.diamondRate !== 0 && NumberWithCommas(e?.diamondRate, 2)} </td>
                    <td style={{ borderBottom: `${data[i + 1]?.srNo !== 0 ? "1px solid #bdbdbd" : ""}`, borderLeft: "1px solid #bdbdbd", borderRight: "1px solid #bdbdbd", padding: "0.5px", }}> {e?.diamondAmount !== 0 && <b>{NumberWithCommas(e?.diamondAmount, 2)}</b>} </td>

                    <td style={{ borderBottom: `${data[i + 1]?.srNo !== 0 ? "1px solid #bdbdbd" : ""}`, borderLeft: "1px solid #bdbdbd", borderRight: "1px solid #bdbdbd", padding: "0.5px", }}>{e?.miscCode}</td>
                    <td style={{ borderBottom: `${data[i + 1]?.srNo !== 0 ? "1px solid #bdbdbd" : ""}`, borderLeft: "1px solid #bdbdbd", borderRight: "1px solid #bdbdbd", padding: "0.5px", }}>{e?.miscSize}</td>
                    <td style={{ borderBottom: `${data[i + 1]?.srNo !== 0 ? "1px solid #bdbdbd" : ""}`, borderLeft: "1px solid #bdbdbd", borderRight: "1px solid #bdbdbd", padding: "0.5px", }}>
                      {e?.miscPcs !== 0 && NumberWithCommas(e?.miscPcs, 0)}
                    </td>
                    <td style={{ borderBottom: `${data[i + 1]?.srNo !== 0 ? "1px solid #bdbdbd" : ""}`, borderLeft: "1px solid #bdbdbd", borderRight: "1px solid #bdbdbd", padding: "0.5px", }}>{e?.miscWt !== 0 && NumberWithCommas(e?.miscWt, 3)}</td>
                    <td style={{ borderBottom: `${data[i + 1]?.srNo !== 0 ? "1px solid #bdbdbd" : ""}`, borderLeft: "1px solid #bdbdbd", borderRight: "1px solid #bdbdbd", padding: "0.5px", }}>
                      {e?.miscRate !== 0 && NumberWithCommas(e?.miscRate, 2)}
                    </td>
                    <td style={{ borderBottom: `${data[i + 1]?.srNo !== 0 ? "1px solid #bdbdbd" : ""}`, borderLeft: "1px solid #bdbdbd", borderRight: "1px solid #bdbdbd", padding: "0.5px", }}>
                      {e?.miscAmount !== 0 &&
                        NumberWithCommas(e?.miscAmount, 2)}
                    </td>
                    <td style={{ borderBottom: `${data[i + 1]?.srNo !== 0 ? "1px solid #bdbdbd" : ""}`, borderLeft: "1px solid #bdbdbd", borderRight: "1px solid #bdbdbd", padding: "0.5px", }}>
                      {e?.SettingName !== "" ? e?.SettingName : ""}
                    </td>
                    <td style={{ borderBottom: `${data[i + 1]?.srNo !== 0 ? "1px solid #bdbdbd" : ""}`, borderLeft: "1px solid #bdbdbd", borderRight: "1px solid #bdbdbd", padding: "0.5px", }}>
                      {e?.SettingRate !== 0 ?
                        NumberWithCommas(e?.SettingRate, 2) : ""}
                    </td>
                    <td style={{ borderBottom: `${data[i + 1]?.srNo !== 0 ? "1px solid #bdbdbd" : ""}`, borderLeft: "1px solid #bdbdbd", borderRight: "1px solid #bdbdbd", padding: "0.5px", }}>
                      {e?.settingAmount !== 0 &&
                        NumberWithCommas(e?.settingAmount, 2)}
                    </td>
                    {e?.makingHeightRowWise !== 0 && (<td rowSpan={e?.makingHeightRowWise} style={{ borderBottom: "1px solid #bdbdbd", borderLeft: "1px solid #bdbdbd", borderRight: "1px solid #bdbdbd", padding: "0.5px", }}>
                      {e?.makingRate !== 0 &&
                        NumberWithCommas(e?.makingRate, 2)}
                    </td>
                    )}
                    {e?.makingHeightRowWise !== 0 && (<td rowSpan={e?.makingHeightRowWise} style={{ borderBottom: "1px solid #bdbdbd", borderLeft: "1px solid #bdbdbd", borderRight: "1px solid #bdbdbd", padding: "0.5px", }}>
                      {e?.makingAmount !== 0 &&
                        NumberWithCommas(e?.makingAmount, 2)}
                    </td>
                    )}

                    {e?.makingHeightRowWise !== 0 && (<td rowSpan={e?.makingHeightRowWise} style={{ borderBottom: "1px solid #bdbdbd", borderLeft: "1px solid #bdbdbd", borderRight: "1px solid #bdbdbd", padding: "0.5px", }}>
                      {e?.other !== 0 && NumberWithCommas(e?.other, 2)}
                    </td>
                    )}

                    {e?.makingHeightRowWise !== 0 && (<td rowSpan={e?.makingHeightRowWise} style={{ borderBottom: "1px solid #bdbdbd", borderLeft: "1px solid #bdbdbd", borderRight: "1px solid #bdbdbd", padding: "0.5px", }}>
                      {" "}
                      {e?.unitCost !== 0 && NumberWithCommas(e?.unitCost / e?.qty, 2)}
                    </td>
                    )}

                    {e?.makingHeightRowWise !== 0 && (
                      <td rowSpan={e?.makingHeightRowWise} style={{ borderBottom: "1px solid #bdbdbd", borderLeft: "1px solid #bdbdbd", borderRight: "1px solid #bdbdbd", padding: "0.5px", }}>
                        {e?.qty !== 0 && NumberWithCommas(e?.qty, 0)}
                      </td>
                    )}
                    {e?.makingHeightRowWise !== 0 && (
                      <td align="right" rowSpan={e?.makingHeightRowWise} style={{ borderBottom: "1px solid #bdbdbd", borderLeft: "1px solid #bdbdbd", borderRight: "1px solid #bdbdbd", padding: "0.5px", }} colSpan={2}>
                        {e?.totalAmount !== 0 &&
                          NumberWithCommas(e?.totalAmount, 2)}
                      </td>
                    )}
                  </tr>
                );
              })}

              {/* tax */}
              {tax.map((e, i) => {
                return (
                  <tr key={i}>
                    <td></td>
                    <td colSpan={29} style={{ border: "1px solid #bdbdbd", padding: "0.5px", }} align="right" >
                      {e?.name} {e?.per !== "" && "@"} {e?.per}
                    </td>
                    <td style={{ border: "1px solid #bdbdbd", padding: "0.5px", }} align="right" colSpan={2} >
                      {NumberWithCommas(e?.amount, 2)}
                    </td>
                  </tr>
                );
              })}

              {/* total */}
              <tr>
                <th></th>
                <th colSpan={8} style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} ></th>
                <th style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} >
                  {NumberWithCommas(total?.metalAmount, 2)}
                </th>
                <th colSpan={2} style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} ></th>
                <th style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} >
                  {NumberWithCommas(total?.diamondPcs, 0)}
                </th>
                <th style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} >
                  {NumberWithCommas(total?.diamondWt, 3)}
                </th>
                <th style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} ></th>
                <th style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} align="end" >
                  {NumberWithCommas(total?.diamondAmount, 2)}
                </th>

                <th style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} ></th>
                <th style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} ></th>
                <th style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} align="end" >
                  {total?.miscsPcs !== 0 &&
                    NumberWithCommas(total?.miscsPcs, 0)}
                </th>
                <th style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} align="end" >
                  {total?.miscsWt !== 0 && NumberWithCommas(total?.miscsWt, 3)}
                </th>
                <th style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} ></th>
                <th style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} align="end" >
                  {total?.miscsAmount !== 0 &&
                    NumberWithCommas(total?.miscsAmount, 2)}
                </th>

                <th style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} align="end" >
                </th>
                <th style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} align="end" >
                </th>
                <th style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} align="end" >
                  {NumberWithCommas(total?.settingAmount, 2)}
                </th>
                <th style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} ></th>
                <th style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} align="end" >
                  {NumberWithCommas(total?.makingAmount, 2)}
                </th>

                <th style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} align="end" >
                  {NumberWithCommas(total?.otherCharges, 2)}
                </th>

                <th style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} ></th>
                <th style={{ backgroundColor: "#f5f5f5", border: "1px solid #bdbdbd", padding: "0.5px", }} align="end" >
                  {NumberWithCommas(total?.qty, 0)}
                </th>
                <th width="10px" style={{ backgroundColor: "#f5f5f5", borderStart: "1px solid #bdbdbd", borderTop: "1px solid #bdbdbd", borderBottom: "1px solid #bdbdbd", padding: "0.5px", }} align="right" >
                  <span
                    dangerouslySetInnerHTML={{ __html: header?.Currencysymbol }}
                  ></span> 
   
                </th>
                <th width={100} style={{ backgroundColor: "#f5f5f5", borderEnd: "1px solid #bdbdbd", borderTop: "1px solid #bdbdbd", borderBottom: "1px solid #bdbdbd", padding: "0.5px", }} align="right" >
                  {NumberWithCommas(total?.totalAmount, 2)} 
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
          {msg}
        </p>
      )}
    </>
  );
};

export default QuoteFormateExcel;
