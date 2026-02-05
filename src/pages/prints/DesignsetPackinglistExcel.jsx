// http://localhost:3000/?tkn=OTA2NTQ3MTcwMDUzNTY1MQ==&invn=SlMvODM2LzI1LTI2&evn=c2FsZQ==&pnm=RGVzaWduc2V0IFBhY2tpbmdsaXN0&up=aHR0cDovL256ZW4vam8vYXBpLWxpYi9BcHAvU2FsZUJpbGxfSnNvbg==&ctv=NzE=&ifid=PackingList3&pid=undefined&etp=ZXhjZWw=
import React, { useEffect, useState } from "react";
import {
  apiCall,
  checkMsg,
  formatAmount,
  handleImageError,
  isObjectEmpty,
} from "../../GlobalFunctions";
import Loader from "../../components/Loader";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";
import { cloneDeep } from "lodash";
import sanitizeHtml from "sanitize-html";
import { htmlToText } from "html-to-text";
import { BorderBottom, Visibility, VisibilityOff } from "@mui/icons-material";

const DesignsetPackinglistExcel = ({
  urls,
  token,
  invoiceNo,
  printName,
  evn,
  ApiVer,
}) => {
  const [result, setResult] = useState(null);
  const [responsejson, setResponsejson] = useState("");
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const [isImageWorking, setIsImageWorking] = useState(true);
  const [data, setData] = useState(null);
  // const [diaQlty, setDiaQlty] = useState(false);

  const handleImageErrors = () => {
    setIsImageWorking(false);
  };
  useEffect(() => {
    const sendData = async () => {
      try {
        const data = await apiCall(
          token,
          invoiceNo,
          printName,
          urls,
          evn,
          ApiVer
        );
        if (data?.Status === "200") {
          let isEmpty = isObjectEmpty(data?.Data);
          if (!isEmpty) {
            loadData(data?.Data);
            setResponsejson(data?.Data);
            setLoader(false);
          } else {
            setLoader(false);
            setMsg("Data Not Found");
          }
        } else {
          setLoader(false);
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

  const loadData = (data) => {
    let address = data?.BillPrint_Json[0]?.Printlable?.split("\r\n");
    data.BillPrint_Json[0].address = address;

    const datas = OrganizeDataPrint(
      data?.BillPrint_Json[0],
      data?.BillPrint_Json1,
      data?.BillPrint_Json2
    );

    // Step 1: Sort resultArray by id
    datas?.resultArray?.sort((a, b) => a.SrNo - b.SrNo);

    // Step 2: Enhance each row (discount info)
    let enrichedArray = [];
    datas?.resultArray?.forEach((e) => {
      let obj = { ...e };
      let discountOn = [];

      if (e?.IsCriteriabasedAmount === 1) {
        if (e?.IsMetalAmount === 1) discountOn.push("Metal");
        if (e?.IsDiamondAmount === 1) discountOn.push("Diamond");
        if (e?.IsStoneAmount === 1) discountOn.push("Stone");
        if (e?.IsMiscAmount === 1) discountOn.push("Misc");
        if (e?.IsLabourAmount === 1) discountOn.push("Labour");
        if (e?.IsSolitaireAmount === 1) discountOn.push("Solitaire");
      } else {
        if (e?.Discount !== 0) discountOn.push("Total Amount");
      }

      obj.discountOn = discountOn;
      obj.str_discountOn = discountOn.join(", ") + "Amount";

      enrichedArray.push(obj);
      // console.log("enrichedArray", enrichedArray.length);
      
    });

    // Step 3: Add designSetTotalAmount + DesigSetImage handling
    const finalArr = [];
    let i = 0;

    while (i < enrichedArray.length) {
      const current = enrichedArray[i];
      const { DesignSetGroup, DesignSetNo } = current;

      // 👇 Do not merge if DesignSetGroup === 0
      if (DesignSetGroup === 0) {
        finalArr.push({
          ...current,
          designSetTotalAmount: current.TotalAmount,
          DesigSetImage: "",
        });
        i++;
        continue;
      }

      let total = current.TotalAmount;
      let j = i + 1;
      // let groupSize = 1;

      // Check for consecutive duplicates
      while (
        j < enrichedArray.length &&
        enrichedArray[j].DesignSetGroup === DesignSetGroup &&
        enrichedArray[j].DesignSetNo === DesignSetNo &&
        enrichedArray[j].DesignSetGroup !== 0 // Avoid merging group 0
      ) {
        total += enrichedArray[j].TotalAmount;
        // groupSize++;
        j++;
      }

      const isMerged = j - i > 1;

      finalArr.push({
        ...current,
        designSetTotalAmount: isMerged ? total : current.TotalAmount,
        DesigSetImage: isMerged ? current.DesigSetImage : "",
      });

      for (let k = i + 1; k < j; k++) {
        finalArr.push({
          ...enrichedArray[k],
          designSetTotalAmount: "",
          DesigSetImage: "",
        });
      }

      i = j;
    }

    // Step 4: Update result
    datas.resultArray = finalArr;

    console.log("datas:", datas);
    setResult(datas);
    setData(datas);
    setLoader(false);

    setTimeout(() => {
      const button = document.getElementById("test-table-xls-button");
      button.click();
    }, 500);
  };

  // const groupCounts = {}
  // result?.resultArray?.forEach((obj) => {
  //   if (obj.DesignSetNo === 0 && obj.DesignSetGroup === 0) {
  //     return; 
  //   }
  
  //   const key = `${obj.DesignSetNo}-${obj.DesignSetGroup}`;
    
  //   if (!groupCounts[key]) {
  //     groupCounts[key] = 0;
  //   }
    
  //   groupCounts[key]++;
  // });
  // console.log(groupCounts);

  // Style...
  const txtCen = {
    textAlign: "center",
  };
  const txtTop = {
    verticalAlign: "top",
  };
  const spBrdr= {
    borderCollapse: "collapse",
    backgroundColor: "#ffffff",
  }
  const brRightlgt = {
    borderRight: "1px solid #e8e8e8",
  };
  const brRight = {
    borderRight: "1px solid #989898",
  };
  const brLeft = {
    borderLeft: "1px solid #989898",
  };
  const brTop = {
    borderTop: "1px solid #989898",
  };
  const brBotm = {
    borderBottom: "1px solid #989898",
  };
  const bgColor = {
    backgroundColor: "#F5F5F5",
  };
  const coWdth = {
    width: "80px",
  };
  const spbrWrd = {
    wordBreak: "break-word",
    overflowWrap: "break-word",
    wordWrap: "break-word",
  }
  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <>
          {msg === "" ? (
            <>
              <div>
                <ReactHTMLTableToExcel
                  id="test-table-xls-button"
                  className="download-table-xls-button btn btn-success text-black bg-success px-2 py-1 fs-5 d-none"
                  table="table-to-xls"
                  filename={`DesignSet_PackingList_${result?.header?.InvoiceNo}_${Date.now()}`}
                  sheet="tablexls"
                  buttonText="Download as XLS"
                />
                <table id="table-to-xls" className='d-none'>
                  <tbody>
                    {/** Main Header */}
                    <tr>
                      <td colSpan={11}></td>
                      <td width={60} height={132}>
                        {isImageWorking && result?.header?.PrintLogo !== "" && (
                          <div>
                            <img
                              src={result?.header?.PrintLogo}
                              alt=""
                              onError={handleImageErrors}
                              width={132}
                              height={132}
                            />
                          </div>
                        )}
                      </td>
                      <td colSpan={11}></td>
                    </tr>
                    <tr>
                      <td colSpan={23} style={{ ...txtCen }}>
                        <div>
                          {result?.header?.CompanyAddress}
                          {result?.header?.CompanyAddress2}
                          {result?.header?.CompanyCity} -{" "}
                          {result?.header?.CompanyPinCode}
                        </div>
                        <div>{result?.header?.PrintHeadLabel}</div>
                        {result?.header?.PrintRemark === "" ? (
                            ""
                          ) : (
                            <div>
                              <b dangerouslySetInnerHTML={{__html: result?.header?.PrintRemark?.replace(/<br\s*\/?>/gi," "),}}></b>
                            </div>
                          )}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3}>
                        <div><b>Party:</b> {result?.header?.customerfirmname} </div>
                      </td>
                      <td colSpan={17}></td>
                      <td colSpan={3}>
                        <div>Invoice No: <b>{result?.header?.InvoiceNo}</b></div>
                        <div>Date: <b>{result?.header?.EntryDate}</b></div>
                      </td>
                    </tr>

                    {/* Table Headers */}
                    <tr>
                      <th
                        width={25}
                        style={{...brLeft,...brTop,...bgColor,}}
                      >
                        Sr
                      </th>
                      <th
                        style={{...brLeft,...brTop,...bgColor,}}>
                        Jewelcode
                      </th>
                      <th
                        style={{...brLeft,...brTop,...bgColor,}}
                      >
                        Design Set
                      </th>
                      <th
                        style={{...brLeft,...brTop,...brBotm,...bgColor,}}
                        colSpan={5}
                      >
                        Diamond
                      </th>
                      <th
                        style={{...brLeft,...brTop,...brBotm,...bgColor,}}
                        colSpan={5}
                      >
                        Metal
                      </th>
                      <th
                        style={{...brLeft,...brTop,...brBotm,...bgColor,}}
                        colSpan={4}
                      >
                        Stone
                      </th>
                      <th
                        style={{...brLeft,...brTop,...brBotm,...bgColor,}}
                        colSpan={2}
                      >
                        Labour
                      </th>
                      <th
                        style={{...brLeft,...brTop,...brBotm,...bgColor,}}
                        colSpan={2}
                      >
                        Other Amount
                      </th>
                      <th
                        style={{...brLeft,...brTop,...brRight,...bgColor,}}
                      >
                        Price
                      </th>
                      <th
                        style={{...brLeft,...brTop,...brRight,...bgColor,}}
                      >
                        Amount
                      </th>
                    </tr>
                    <tr>
                      <th
                        width={25}
                        style={{...brLeft,...brBotm,...brRight,...bgColor,}}
                      ></th>
                      <th
                        style={{...coWdth,...brBotm,...brRight,...bgColor,}}
                      ></th>
                      <th
                        style={{...coWdth,...brBotm,...brRight,...bgColor,}}
                      ></th>
                      <th
                        style={{...coWdth,...brBotm,...brRight,...bgColor,}}
                      >
                        Shape
                      </th>
                      <th
                        style={{...coWdth,...brBotm,...brRight,...bgColor,}}
                      >
                        Size
                      </th>
                      <th
                        style={{...coWdth,...brBotm,...brRight,...bgColor,}}
                      >
                        Wt
                      </th>
                      <th
                        style={{...coWdth,...brBotm,...brRight,...bgColor,}}
                      >
                        Rate
                      </th>
                      <th
                        style={{...coWdth,...brBotm,...brRight,...bgColor,}}
                      >
                        Amount
                      </th>
                      <th
                        style={{...coWdth,...brBotm,...brRight,...bgColor,}}
                      >
                        KT
                      </th>
                      <th
                        style={{...coWdth,...brBotm,...brRight,...bgColor,}}
                      >
                        Gr Wt
                      </th>
                      <th
                        style={{...coWdth,...brBotm,...brRight,...bgColor,}}
                      >
                        NetWt
                      </th>
                      <th
                        style={{...coWdth,...brBotm,...brRight,...bgColor,}}
                      >
                        Rate
                      </th>
                      <th
                        style={{...coWdth,...brBotm,...brRight,...bgColor,}}
                      >
                        Amount
                      </th>
                      <th
                        style={{...coWdth,...brBotm,...brRight,...bgColor,}}
                      >
                        Shape
                      </th>
                      <th
                        style={{...coWdth,...brBotm,...brRight,...bgColor,}}
                      >
                        Wt
                      </th>
                      <th
                        style={{...coWdth,...brBotm,...brRight,...bgColor,}}
                      >
                        Rate
                      </th>
                      <th
                        style={{...coWdth,...brBotm,...brRight,...bgColor,}}
                      >
                        Amount
                      </th>
                      <th
                        style={{...coWdth,...brBotm,...brRight,...bgColor,}}
                      >
                        Rate
                      </th>
                      <th
                        style={{...coWdth,...brBotm,...brRight,...bgColor,}}
                      >
                        Amount
                      </th>
                      <th
                        style={{...coWdth,...brBotm,...brRight,...bgColor,}}
                      >
                        Code
                      </th>
                      <th
                        style={{...coWdth,...brBotm,...brRight,...bgColor,}}
                      >
                        Amount
                      </th>
                      <th
                        style={{...coWdth,...brBotm,...brRight,...bgColor,}}
                      >
                      </th>
                      <th
                        style={{...coWdth,...brBotm,...brRight,...bgColor,}}
                      >
                      </th>
                    </tr>
                    
                    {/** Table Info */}
                    {result?.resultArray?.map((e, i) => {
                      const lastElement = i === result.resultArray.length - 1; // It was for border bottom in last Job
                      return ( 
                          <tr key={i}>
                            <td style={{ ...brRight, ...txtTop, ...brBotm, ...spBrdr }} width={25} align="center" rowSpan={e?.IsCriteriabasedAmount === 0 ? 2 : 1}>
                              {i + 1}
                            </td>
                            <td style={{ ...brRight, ...txtTop, ...txtCen, ...brBotm, ...spBrdr }} height={150} width={100} rowSpan={e?.IsCriteriabasedAmount === 0 ? 2 : 1}>
                              <div style={{ textAlign: "left" }}>
                                  {e?.JewelCodePrefix?.slice(0, 2) +
                                  e?.Category_Prefix?.slice(0, 2) +
                                  e?.SrJobno?.split("/")[1]}
                              </div>
                              {/* <div>{`\u00A0`}</div> */}
                              <div>
                                <img
                                  src={`${e?.DesignImage}?resize=95x95`}
                                  alt="img"
                                  width="95"
                                  height="95"
                                  onError={(e) => handleImageError(e)}
                                />
                              </div>
                              {/* <div>{`\u00A0`}</div> */}
                              <div>{e?.SrJobno}</div>
                              {e?.HUID === "" ? ( "" ) : (<div>HUID - {e?.HUID}</div>)}
                              {e?.lineid !== "" ? (<div>{e?.lineid}</div>) : ( "" )}
                            </td>
                            <td style={{ ...brRight, ...txtTop, ...spBrdr, 
                              borderBottom: lastElement ? "1px solid #989898" : "none",
                              borderTop: e?.designSetTotalAmount ? "1px solid #989898" : "none", }} 
                              height={100} width={100} rowSpan={e?.IsCriteriabasedAmount === 0 ? 2 : 1}>
                              {e?.DesigSetImage !== "" ? (
                                <>
                                  <div>{`\u00A0`}</div>
                                  <div>
                                    <img
                                      src={`${e?.DesigSetImage}?resize=95x95`}
                                      alt="img"
                                      width="95"
                                      height="95"
                                      onError={(e) => handleImageError(e)}
                                    />
                                  </div>
                                </>
                              ) : (e?.DesignSetGroup === 0 && e?.DesignSetNo === 0) ? (
                                <>
                                  <div>{`\u00A0`}</div>
                                  <div>
                                    <img
                                      src={`${e?.DesigSetImage}?resize=95x95`}
                                      alt="img"
                                      width="95"
                                      height="95"
                                      onError={(e) => handleImageError(e)}
                                    />
                                  </div>
                                </>
                              ) : null}
                            </td>
                            {/** Diamond */}
                            <td style={{ ...txtTop, ...spbrWrd }}>
                              {e?.diamonds?.map((ele, ind) => {
                                return <div key={ind}>{ele?.ShapeName + " " + ele?.QualityName + " " + ele?.Colorname}</div>
                              })}
                            </td>
                            <td style={{ ...txtTop }}>
                              {e?.diamonds?.map((ele, ind) => {
                                return <div key={ind}>{ele?.SizeName}</div>
                              })}
                            </td>
                            <td style={{ ...txtTop }}>
                              {e?.diamonds?.map((ele, ind) => {
                                return <div key={ind}>{ele?.Wt}</div>
                              })}
                            </td>
                            <td style={{ ...txtTop }}>
                              {e?.diamonds?.map((ele, ind) => {
                                return <div key={ind}>{ele?.Rate}</div>
                              })}
                            </td>
                            <td style={{ ...txtTop, ...brRight }}>
                              {e?.diamonds?.map((ele, ind) => {
                                return <div key={ind}>{formatAmount(ele?.Amount / result?.header?.CurrencyExchRate)}</div>
                              })}
                            </td>
                            {/** Metal */}
                            {e?.JobRemark !== "" ? (
                              <>
                                <td style={{ ...txtTop, ...spbrWrd }}>
                                  {e?.metal?.map((ele, ind) => {
                                    return <div key={ind}>{ele?.ShapeName + " " + ele?.QualityName}</div>
                                  })}
                                  <div>Remark:</div>
                                  <div>{e?.JobRemark} </div>
                                </td>
                                <td style={{ ...txtTop }}>
                                  <div>{e?.grosswt?.toFixed(3)}</div>
                                </td>
                                <td style={{ ...txtTop }}>
                                  <div>{e?.totals?.metal?.IsPrimaryMetal?.toFixed(3)}</div>
                                </td>
                                <td style={{ ...txtTop }}>
                                  {e?.metal?.map((ele, ind) => {
                                    return <div key={ind}>{ele?.Rate?.toFixed(2)}</div>
                                  })}
                                </td>
                                <td style={{ ...brRight, ...txtTop }}>
                                  {e?.metal?.map((ele, ind) => {
                                    return <div key={ind}>{formatAmount(ele?.Amount / result?.header?.CurrencyExchRate)}</div>
                                  })}
                                </td>
                              </>
                            ) : (
                              <>
                                <td style={{ ...txtTop, ...spbrWrd }}>
                                  {e?.metal?.map((ele, ind) => {
                                    return <div key={ind}>{ele?.IsPrimaryMetal === 1 && ele?.ShapeName + " " + ele?.QualityName}</div>
                                  })}
                                </td>
                                <td style={{ ...txtTop }}>
                                  <div>{e?.grosswt?.toFixed(3)}</div>
                                </td>
                                <td style={{ ...txtTop }}>
                                  <div>{e?.totals?.metal?.IsPrimaryMetal?.toFixed(3)}</div>
                                </td>
                                <td style={{ ...txtTop }}>
                                  {e?.metal?.map((ele, ind) => {
                                    return <div key={ind}>{ele?.IsPrimaryMetal === 1 && ele?.Rate !== 0 && ele?.Rate?.toFixed(2)}</div>
                                  })}
                                </td>
                                <td style={{ ...brRight, ...txtTop }}>
                                  {e?.metal?.map((ele, ind) => {
                                    return <div key={ind}>{ele?.IsPrimaryMetal === 1 && ele?.Amount !== 0 && formatAmount(ele?.Amount / result?.header?.CurrencyExchRate)}</div>
                                  })}
                                </td>
                              </>
                            )}
                            {/** ColorStone */}
                              <td style={{ ...txtTop }}>
                                {e?.colorstone?.map((ele, ind) => {
                                  return <div key={ind}>{ele?.ShapeName}</div>
                                })}
                              </td>
                              <td style={{ ...txtTop }}>
                                {e?.colorstone?.map((ele, ind) => {
                                  return <div key={ind}>{ele?.Wt?.toFixed(3)}</div>
                                })}
                              </td>
                              <td style={{ ...txtTop }}>
                                {e?.colorstone?.map((ele, ind) => {
                                  return <div key={ind}>{ele?.Wt?.toFixed(3)}</div>
                                })}
                              </td>
                              <td style={{ ...brRight, ...txtTop }}>
                                {e?.colorstone?.map((ele, ind) => {
                                  return <div key={ind}>{ele?.IsPrimaryMetal === 1 && ele?.Amount !== 0 && formatAmount(ele?.Amount / result?.header?.CurrencyExchRate)}</div>
                                })}
                              </td>
                            {/** Labour */}
                            <td style={{ ...txtTop }}>
                              <div>{e?.MaKingCharge_Unit !== 0? formatAmount(e?.MaKingCharge_Unit): "\u00A0"}</div>
                            </td>
                            <td style={{ ...brRight, ...txtTop }}>
                              <div>
                                {e?.MakingAmount + e?.TotalCsSetcost + e?.TotalDiaSetcost !== 0 &&
                                  formatAmount((e?.MakingAmount + e?.TotalCsSetcost + e?.TotalDiaSetcost) / result?.header?.CurrencyExchRate)}
                              </div>
                            </td>
                            {/** Other */}
                            <td style={{ ...txtTop }}>
                              <div>{e?.totals?.misc?.onlyIsHSCODE0_Amount === 0 ? "" : "Other"}</div>
                              <div>{e?.TotalDiamondHandling === 0 ? "" : "Handling"}</div>
                              {e?.other_details?.map((e, i) => {
                                return ( i < 3 && (
                                  <div key={i}>{e?.label}</div>
                                ));
                              })}
                              {e?.misc?.map((el, i) => {
                                return el?.IsHSCOE === 1 || el?.IsHSCOE === 2 || el?.IsHSCOE === 3 ? (
                                  <div key={i}>{el?.Amount === 0 ? "" : el?.IsHSCOE === 3 ? el?.ShapeName?.split("_")[1] : el?.ShapeName}</div>
                                ) : (
                                  ""
                                );
                              })}
                            </td>
                            <td style={{ ...brRight, ...txtTop }}>
                              <div>
                                {e?.totals?.misc?.onlyIsHSCODE0_Amount === 0 ? "" : 
                                  formatAmount(e?.totals?.misc?.onlyIsHSCODE0_Amount / result?.header?.CurrencyExchRate)}
                              </div>
                              <div>{e?.TotalDiamondHandling === 0 ? "" : formatAmount(e?.TotalDiamondHandling)}</div>
                              {e?.other_details?.map((el, i) => {return i < 3 ? (<div key={i}>{el?.value}</div>) : ( "" );})}
                              {e?.misc?.map((el, i) => {return el?.IsHSCOE === 1 || el?.IsHSCOE === 2 || el?.IsHSCOE === 3 ? (
                                <div key={i}>{el?.Amount === 0 ? "" : 
                                  formatAmount(el?.Amount / result?.header?.CurrencyExchRate)}
                                </div>) : ( "" );
                              })}
                            </td>
                            {/** Price */}
                            <td style={{ ...brRight, ...txtTop, ...spBrdr }}>
                              <div>{formatAmount(e?.UnitCost / result?.header?.CurrencyExchRate)}</div>
                            </td>
                            {/** Amount */}
                            <td style={{ ...brRight, ...txtTop, ...spBrdr,
                                  borderTop: e?.designSetTotalAmount ? "1px solid #989898" : "none",
                                }}
                                rowSpan={e?.designSetTotalAmount ? 2 : e?.DesignSetGroup !== 0 ? 2 : 1}
                                >
                              <div>
                                <b>{e?.designSetTotalAmount
                                  ? (e.designSetTotalAmount / (result?.header?.CurrencyExchRate || 1)).toFixed(2)
                                  : ""}</b>
                              </div>
                            </td>

                            {/** Per Job Total */}
                            <tr>
                              {/* <td style={{ ...brRight, ...brBotm }}/>
                              <td style={{ ...brRight, ...brBotm }}/>
                              <td style={{ ...brRight, ...brBotm }}/> */}
                              <td style={{ ...bgColor, ...brTop, ...brBotm, ...brRightlgt }}/>
                              <td style={{ ...bgColor, ...brTop, ...brBotm, ...brRightlgt }}/>
                              <td style={{ ...bgColor, ...brTop, ...brBotm, ...brRightlgt }}><b>{e?.totals?.diamonds?.Wt?.toFixed(3)}</b></td>
                              <td style={{ ...bgColor, ...brTop, ...brBotm, ...brRightlgt }}/>
                              <td style={{ ...bgColor, ...brRight, ...brTop, ...brBotm }}>
                                <b>{formatAmount(e?.totals?.diamonds?.Amount / result?.header?.CurrencyExchRate)}</b>
                              </td>
                              <td style={{ ...bgColor, ...brTop, ...brBotm, ...brRightlgt }}/>
                              <td style={{ ...bgColor, ...brTop, ...brBotm, ...brRightlgt }}><b>{e?.grosswt?.toFixed(3)}</b></td>
                              <td style={{ ...bgColor, ...brTop, ...brBotm, ...brRightlgt }}><b>{e?.totals?.metal?.IsPrimaryMetal?.toFixed(3)}</b></td>
                              <td style={{ ...bgColor, ...brTop, ...brBotm, ...brRightlgt }}/>
                              <td style={{ ...bgColor, ...brRight, ...brTop, ...brBotm }}>
                                <b>{formatAmount(e?.totals?.metal ?.IsPrimaryMetal_Amount / result?.header?.CurrencyExchRate)}</b>
                              </td>
                              <td style={{ ...bgColor, ...brTop, ...brBotm, ...brRightlgt }}/>
                              <td style={{ ...bgColor, ...brTop, ...brBotm, ...brRightlgt }}>
                                <b>{e?.totals?.colorstone?.Wt === 0 ? ("") : (e?.totals?.colorstone?.Wt?.toFixed(3))}</b>
                              </td>
                              <td style={{ ...bgColor, ...brTop, ...brBotm, ...brRightlgt }}/>
                              <td style={{ ...bgColor, ...brRight, ...brTop, ...brBotm }}>
                                <b>{e?.totals?.colorstone?.Amount === 0 ? ( "" ) : (formatAmount(e?.totals?.colorstone?.Amount / result?.header?.CurrencyExchRate))}</b>
                              </td>
                              <td style={{ ...bgColor, ...brTop, ...brBotm, ...brRightlgt }}>
                                <b>{e?.MaKingCharge_Unit !== 0 ? formatAmount(e?.MaKingCharge_Unit) : ""}</b>
                              </td>
                              <td style={{ ...bgColor, ...brRight, ...brTop, ...brBotm }}>
                                <b>
                                  {e?.MakingAmount + e?.TotalCsSetcost + e?.TotalDiaSetcost === 0 ? ( ""
                                    ) : (
                                      e?.MakingAmount + e?.TotalCsSetcost + e?.TotalDiaSetcost !== 0 &&
                                        formatAmount((e?.MakingAmount + e?.TotalCsSetcost + e?.TotalDiaSetcost) / result?.header?.CurrencyExchRate)
                                  )}
                                </b>
                              </td>
                              <td style={{ ...bgColor, ...brTop, ...brBotm, ...brRightlgt }} />
                              <td style={{ ...bgColor, ...brRight, ...brTop, ...brBotm }}>
                                <b>
                                  {e?.other_details?.length === 0 && e?.misc?.length === 0 && e?.TotalDiamondHandling === 0 && e?.totals?.misc?.onlyIsHSCODE0_Amount === 0 ? 
                                    ( "" ) : 
                                    (formatAmount(e?.other_details_arr_total_amount + e?.totals?.misc?.Amount / result?.header?.CurrencyExchRate + e?.TotalDiamondHandling))}
                                </b>
                              </td>
                              <td style={{ ...bgColor, ...brRight, ...brTop, ...brBotm }}><b>{formatAmount(e?.TotalAmount / result?.header?.CurrencyExchRate)}</b></td>
                              {/* <td style={{ ...brRight }}><div></div></td> */}
                            </tr>
                          </tr>
                        )
                    })}
                    <tr>
                      <td style={{ ...brRight, ...brBotm, ...bgColor, }}/>
                      <td style={{ ...brRight, ...brBotm, ...bgColor, }}><b>TOTAL</b></td>
                      <td style={{ ...brRight, ...brBotm, ...bgColor, }}/>
                      <td style={{ ...bgColor, ...brTop, ...brBotm, ...brRightlgt }}/>
                      <td style={{ ...bgColor, ...brTop, ...brBotm, ...brRightlgt }}/>
                      <td align="right" style={{ ...bgColor, ...brTop, ...brBotm, ...brRightlgt }}>
                        <b>{result?.mainTotal?.diamonds?.Wt !== 0 && result?.mainTotal?.diamonds?.Wt?.toFixed(3)}</b>
                      </td>
                              <td colSpan={2} align="right" style={{ ...bgColor, ...brRight, ...brTop, ...brBotm }}>
                                <b>
                                  {result?.mainTotal?.diamonds?.Amount !== 0 &&
                                    formatAmount(result?.mainTotal?.diamonds?.Amount / result?.header?.CurrencyExchRate)}
                                </b>
                              </td>
                              <td style={{ ...bgColor, ...brTop, ...brBotm, ...brRightlgt }}/>
                              <td align="right" style={{ ...bgColor, ...brTop, ...brBotm, ...brRightlgt }}><b>{result?.mainTotal?.grosswt?.toFixed(3)}</b></td>
                              <td align="right" style={{ ...bgColor, ...brTop, ...brBotm, ...brRightlgt }}><b>{result?.mainTotal?.metal?.IsPrimaryMetal?.toFixed(3)}</b></td>
                              <td colSpan={2} align="right" style={{ ...bgColor, ...brRight, ...brTop, ...brBotm }}>
                                <b>
                                  {result?.mainTotal.metal?.IsPrimaryMetal_Amount !== 0 &&
                                    formatAmount(result?.mainTotal.metal?.IsPrimaryMetal_Amount / result?.header?.CurrencyExchRate)}
                                </b>
                              </td>
                              <td style={{ ...bgColor, ...brTop, ...brBotm, ...brRightlgt }}/>
                              <td align="right" style={{ ...bgColor, ...brTop, ...brBotm, ...brRightlgt }}>
                                <b>{result?.mainTotal?.colorstone?.Wt !== 0 && result?.mainTotal?.colorstone?.Wt?.toFixed(3)}</b>
                              </td>
                              <td colSpan={2} align="right" style={{ ...bgColor, ...brRight, ...brTop, ...brBotm }}>
                                <b>
                                  {result?.mainTotal.colorstone?.Amount !== 0 &&
                                    formatAmount(result?.mainTotal.colorstone?.Amount / result?.header?.CurrencyExchRate)}
                                </b>
                              </td>
                              <td colSpan={2} align="right" style={{ ...bgColor, ...brRight, ...brTop, ...brBotm }}>
                                <b>
                                  {result?.mainTotal?.total_Making_Amount + result?.mainTotal?.total_TotalDiaSetcost + result?.mainTotal?.total_TotalCsSetcost !== 0 &&
                                    formatAmount((result?.mainTotal?.total_Making_Amount + result?.mainTotal?.total_TotalDiaSetcost +
                                       result?.mainTotal?.total_TotalCsSetcost) / result?.header?.CurrencyExchRate)}
                                </b>
                              </td>
                              <td colSpan={2} align="right" style={{ ...bgColor, ...brRight, ...brTop, ...brBotm }}>
                                <b>
                                  {result?.mainTotal?.total_other + result?.mainTotal?.total_diamondHandling + result?.mainTotal?.totalMiscAmount !== 0 &&
                                    formatAmount((result?.mainTotal?.total_other + result?.mainTotal?.total_diamondHandling +
                                      result?.mainTotal?.totalMiscAmount) / result?.header?.CurrencyExchRate)}
                                </b>
                              </td>
                              <td style={{ ...brRight, ...bgColor, ...brBotm }}/>
                              <td align="right" style={{ ...bgColor, ...brRight, ...brTop, ...brBotm }}>
                                <b>{formatAmount(result?.mainTotal?.total_amount / result?.header?.CurrencyExchRate)}</b>
                              </td>
                            </tr>              
                    
                    {/* Last Tax Total */}
                    <tr>
                      <td colSpan={20} style={{ ...brLeft, ...brRight }}></td>
                      <td colSpan={2} style={{ ...brRight }}>Total Discount</td>
                      <td
                        align="right" 
                        style={{ ...brRight }}
                      >
                        {formatAmount(
                          result?.mainTotal?.total_discount_amount /
                          result?.header?.CurrencyExchRate
                        )}
                      </td>
                    </tr>
                    {result?.allTaxes?.map((e, i) => {
                      return (
                        <tr key={i}>
                          <td colSpan={20} style={{ ...brLeft, ...brRight }}></td>
                          <td colSpan={2} style={{ ...brRight }}>
                            {e?.name} @ {e?.per}
                          </td>
                          <td
                            align="right"
                            style={{ ...brRight }}
                          >
                            {formatAmount(
                              +e?.amount * result?.header?.CurrencyExchRate
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {result?.header?.FreightCharges === 0 ? (
                      ""
                    ) : (
                      <tr>
                        <td colSpan={20} style={{ ...brLeft, ...brRight }}></td>
                        <td colSpan={2} style={{ ...brRight }}>{result?.header?.ModeOfDel}</td>
                        <td
                          align="right"
                          style={{ ...brRight }}
                        >
                          {formatAmount(
                            result?.header?.FreightCharges /
                            result?.header?.CurrencyExchRate
                          )}
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td colSpan={20} style={{ ...brLeft, ...brRight }}></td>
                      <td colSpan={2} style={{ ...brRight }}>
                        {result?.header?.AddLess > 0 ? "Add" : "Less"}
                      </td>
                      <td
                        align="right"
                        style={{ ...brRight }}
                      >
                        {formatAmount(result?.header?.AddLess)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={20} style={{ ...brLeft, ...brBotm, ...brRight }}></td>
                      <td colSpan={2} style={{ ...brRight, ...brBotm, }}>
                        Grand Total
                      </td>
                      <td
                        align="right"
                        style={{ ...brRight, ...brBotm, }}
                      >
                        {formatAmount((result?.mainTotal?.total_amount + result?.header?.AddLess) /
                          result?.header?.CurrencyExchRate + result?.allTaxesTotal + result?.header?.FreightCharges / result?.header?.CurrencyExchRate)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
              {msg}
            </p>
          )}
        </>
      )}
    </>
  );
};

export default DesignsetPackinglistExcel;
