// http://localhost:3001/?tkn=OTA2NTQ3MTcwMDUzNTY1MQ==&invn=U1A4MzE3&evn=RkcgUHVyY2hhc2U=&pnm=RGV0YWlsIFByaW50&up=aHR0cDovL256ZW4vam8vYXBpLWxpYi9BcHAvU2FsZUJpbGxfSnNvbg==&ctv=NzE=&ifid=ItemWisePrint&pid=undefined
import React, { useEffect, useState } from "react";
import "../../assets/css/prints/detailprintFG.css";
import {
  FooterComponent,
  HeaderComponent,
  NumberWithCommas,
  apiCall,
  checkMsg,
  fixedValues,
  formatAmount,
  handleImageError,
  handlePrint,
  isObjectEmpty,
} from "../../GlobalFunctions";
import Loader from "../../components/Loader";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";
import { ToWords } from "to-words";
import { cloneDeep } from "lodash"

const DetailPrintFG = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {
  const [loader, setLoader] = useState(true);
  const [msg, setMsg] = useState("");
  const [data, setData] = useState([]);
  const [header, setHeader] = useState(null);
  const [footer, setFooter] = useState(null);
  const [address, setAddress] = useState([]);
  const [headerData, setHeaderData] = useState({});
  const [image, setImage] = useState(true);
  const [pnm, setPnm] = useState(atob(printName).toLowerCase());
  const toWords = new ToWords();
  const [isImageWorking, setIsImageWorking] = useState(true);
  const handleImageErrors = () => {
    setIsImageWorking(false);
  };
  const loadData = (data) => {
    let head = HeaderComponent("1", data?.BillPrint_Json[0]);
    setHeader(head);
    setHeaderData(data?.BillPrint_Json[0]);
    let adr = data?.BillPrint_Json[0]?.Printlable.split(`\r\n`);
    setAddress(adr);
    setFooter(FooterComponent("2", data?.BillPrint_Json[0]));
    let datas = OrganizeDataPrint(
      data?.BillPrint_Json[0],
      data?.BillPrint_Json1,
      data?.BillPrint_Json2
    );
    let resultArr = [];
    let primaryWts = 0;
    datas?.resultArray.forEach((e, i) => {
      if (e?.GroupJob === "") {
        let obj = cloneDeep(e);
        obj.primaryWt = 0;
        if (obj?.metal?.length <= 1) {
          obj.primaryWt = e?.NetWt + e?.LossWt;
        } else {
          obj.primaryWt = e?.metal?.reduce((acc, cObj) => cObj?.IsPrimaryMetal === 1 ? acc + cObj?.Wt : acc, 0);
        }
        primaryWts += obj?.primaryWt;
        obj.srjobno = e?.SrJobno.split("/");
        resultArr.push(obj);
      } else {
        let findRecord = resultArr.findIndex(
          (elem, index) =>
            elem?.GroupJob === e?.GroupJob && elem?.GroupJob !== ""
        );
        if (findRecord === -1) {
          let obj = cloneDeep(e);
          obj.srjobno = e?.SrJobno.split("/");
          obj.primaryWt = 0;
          if (obj?.metal?.length <= 1) {
            obj.primaryWt = e?.NetWt + e?.LossWt;
          } else {
            obj.primaryWt = e?.metal?.reduce((acc, cObj) => cObj?.IsPrimaryMetal === 1 ? acc + cObj?.Wt : acc, 0);
          }
          primaryWts += obj?.primaryWt;
          resultArr.push(obj);
        } else {
          let obj = cloneDeep(e);
          obj.primaryWt = 0;
          if (obj?.metal?.length <= 1) {
            obj.primaryWt = e?.NetWt + e?.LossWt;
          } else {
            obj.primaryWt = e?.metal?.reduce((acc, cObj) => cObj?.IsPrimaryMetal === 1 ? acc + cObj?.Wt : acc, 0);
          }
          if (e?.GroupJob === e?.SrJobno) {
            resultArr[findRecord].MetalPurity = e?.MetalPurity;
            resultArr[findRecord].JewelCodePrefix = e?.JewelCodePrefix;
            resultArr[findRecord].designno = e?.designno;
            resultArr[findRecord].SrJobno = e?.SrJobno;
          }
          resultArr[findRecord].primaryWt += obj.primaryWt;
          primaryWts += obj?.primaryWt;
          resultArr[findRecord].grosswt += e?.grosswt;
          resultArr[findRecord].NetWt += e?.NetWt;
          resultArr[findRecord].totals.diamonds.Wt += e?.totals?.diamonds?.Wt;
          resultArr[findRecord].totals.colorstone.Wt +=
            e?.totals?.colorstone?.Wt;
          resultArr[findRecord].TotalAmount += e?.TotalAmount;
        }
      }
    });
    datas.mainTotal.primaryWts = primaryWts;
    datas.resultArray = resultArr;
    datas?.resultArray.sort((a, b) => {
      var nameA = a?.JewelCodePrefix?.toUpperCase() + a?.Category_Prefix.toUpperCase() + a?.srjobno[1]?.toUpperCase();
      var nameB = b?.JewelCodePrefix?.toUpperCase() + b?.Category_Prefix.toUpperCase() + b?.srjobno[1]?.toUpperCase();

      const prefixA = nameA?.match(/[A-Za-z]+/)?.[0];
      const prefixB = nameB?.match(/[A-Za-z]+/)?.[0];
      const numericA = parseInt(nameA?.match(/\d+/)[0]);
      const numericB = parseInt(nameB?.match(/\d+/)[0]);

      // Compare prefixes first
      if (prefixA < prefixB) return -1;
      if (prefixA > prefixB) return 1;

      // If prefixes are the same, compare numeric parts
      return numericA - numericB;
    });
    setData(datas);
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


  const categoryCounts = Array.isArray(data?.resultArray)
  ? Object.values(
      data.resultArray.reduce((acc, curr) => {
        const cat = curr?.Categoryname;
        if (cat) {
          acc[cat] = acc[cat]
            ? { Categoryname: cat, count: acc[cat].count + 1 }
            : { Categoryname: cat, count: 1 };
        }
        return acc;
      }, {})
    )
  : [];

  console.log("data", data);

  return (
    <>
      {loader ? (
        <Loader />
      ) : msg === "" ? (
        <div className="container containerEstimate pad_60_allPrint">
          {/* print button */}
          <div className="d-flex justify-content-end align-items-center print_sec_sum4 pb-4 mt-5 w-100">
            <div className="form-check ps-3">
              <input
                type="button"
                className="btn_white blue mt-0"
                value="Print"
                onClick={(e) => handlePrint(e)}
              />
            </div>
          </div>
          {/* print name */}
          <div
            className={`border p-1 mt-1 border-2 min_height_label lightGrey border_color_estimate`}
          >
            <p className="text-uppercase spBold estimatePrintFont_14">
              {headerData?.PrintHeadLabel === ""
                ? "Detail Print"
                : headerData?.PrintHeadLabel}
            </p>
          </div>
          {/* customer detail */}
          <div className="py-2 d-flex justify-content-between px-1">
            <div>
              <p className="estimatePrintFont_14">To,</p>
              <p className="spBold estimatePrintFont_14">
                {headerData?.Customercode}
              </p>
            </div>
            <div className="d-flex justify-content-end flex-column">
              <div className="d-flex justify-conetnt-between">
                <p className="mainDetailEstimate text-end pe-3">Invoice# : </p>
                <p className="spBold">{headerData?.InvoiceNo}</p>
              </div>
              <div className="d-flex justify-conetnt-between">
                <p className="mainDetailEstimate text-end pe-3">Date : </p>
                <p className="spBold">{headerData?.EntryDate}</p>
              </div>
              <div className="d-flex justify-conetnt-between">
                <p className="mainDetailEstimate text-end pe-3">
                  HSN :{" "}
                </p>
                <p className="spBold">{headerData?.HSN_No}</p>
              </div>
              {/* <div className="d-flex justify-conetnt-between">
                <p className="mainDetailEstimate text-end pe-3">Mobile No : </p>
                <p className="spBold">{headerData?.SalesRepMobileNo}</p>
              </div> */}
            </div>
          </div>
          <div className="my-2 w-100">
            {/* heading */}
            <div className="spBrdrLftBlk spBrdrTopBlk spBrdrRigtBlk d-flex spBrdrBtomBlk recordEstimatePrintHead overflow-hidden lightGrey">
              <div className="srNoEstimatePrint spBrdrRigt d-flex align-items-center justify-content-center">
                <p className="spBold">Sr</p>
              </div>
              <div className="designEstimatePrint spBrdrRigt d-flex align-items-center justify-content-center">
                <p className="spBold">Design</p>
              </div>
              <div className="diamondEstimatePrint spBrdrRigt ">
                <div className="text-center spBrdrBtom spSpceBtom">
                  <p className="spBold">Diamond / Solitaire</p>
                </div>
                <div className="d-flex h-100">
                  <div className="width20EstimatePrint spBrdrRigt spSpceBtom">
                    <p className="text-center spBold">Code</p>
                  </div>
                  <div className="width20EstimatePrint spBrdrRigt spSpceBtom">
                    <p className="text-center spBold">Size</p>
                  </div>
                  <div className="width20EstimatePrint spBrdrRigt spSpceBtom" style={{ width: "10%", minWidth: "10%" }}>
                    <p className="text-center spBold">Pcs</p>
                  </div>
                  <div className="width20EstimatePrint spBrdrRigt spSpceBtom">
                    <p className="text-center spBold">Wt</p>
                  </div>
                  <div className="width20EstimatePrint spBrdrRigt spSpceBtom">
                    <p className="text-center spBold">Supp</p>
                  </div>
                  <div className="width20EstimatePrint spBrdrRigt spSpceBtom">
                    <p className="text-center spBold">Rate</p>
                  </div>
                  <div className="width20EstimatePrint spSpceBtom" style={{ width: "16.67%", minWidth: "16.67%" }}>
                    <p className="text-center spBold">Amount</p>
                  </div>
                </div>
              </div>
              <div className="metalEstimatePrint spBrdrRigt">
                <div className="text-center spBrdrBtom spSpceBtom">
                  <p className="spBold">Metal / Mount</p>
                </div>
                <div className="d-flex h-100">
                  <div className="width_40_estimatePrint spBrdrRigt spSpceBtom">
                    <p className="text-center spBold">Quality</p>
                  </div>
                  <div className="width_40_estimatePrint spBrdrRigt spSpceBtom">
                    <p className="text-center spBold">*Wt</p>
                  </div>
                  <div className="width_40_estimatePrint spBrdrRigt spSpceBtom">
                    <p className="text-center spBold">Net Wt</p>
                  </div>
                  <div className="width_40_estimatePrint spBrdrRigt spSpceBtom" style={{ width: "14%", minWidth: "14%" }}>
                    <p className="text-center spBold">Supp</p>
                  </div>
                  <div className="width_40_estimatePrint spBrdrRigt spSpceBtom">
                    <p className="text-center spBold">Rate</p>
                  </div>
                  <div className="width_40_estimatePrint spSpceBtom" style={{ width: "19.32%", minWidth: "19.32%" }}>
                    <p className="text-center spBold">Amount</p>
                  </div>
                </div>
              </div>
              <div className="stoneEstimatePrint spBrdrRigt">
                <div className="text-center spBrdrBtom spSpceBtom">
                  <p className="spBold">Stone</p>
                </div>
                <div className="d-flex h-100">
                  <div className="width20EstimatePrint spBrdrRigt spSpceBtom">
                    <p className="text-center spBold">Code</p>
                  </div>
                  <div className="width20EstimatePrint spBrdrRigt spSpceBtom">
                    <p className="text-center spBold">Size</p>
                  </div>
                  <div className="width20EstimatePrint spBrdrRigt spSpceBtom" style={{ width: "10%", minWidth: "10%" }}>
                    <p className="text-center spBold">Pcs</p>
                  </div>
                  <div className="width20EstimatePrint spBrdrRigt spSpceBtom">
                    <p className="text-center spBold">Wt</p>
                  </div>
                  <div className="width20EstimatePrint spBrdrRigt spSpceBtom">
                    <p className="text-center spBold">Supp</p>
                  </div>
                  <div className="width20EstimatePrint spBrdrRigt spSpceBtom">
                    <p className="text-center spBold">Rate</p>
                  </div>
                  <div className="width20EstimatePrint spSpceBtom" style={{ width: "16.67%", minWidth: "16.67%" }}>
                    <p className="text-center spBold">Amount</p>
                  </div>
                </div>
              </div>
              <div className="OtherAmountEstimatePrint spBrdrRigt d-flex align-items-center justify-content-center flex-wrap">
                <p className="text-center spBold">Other &nbsp;</p>
                <p className="text-center spBold">Amount </p>
              </div>
              <div className="labourEstimatePrint spBrdrRigt">
                <div className="text-center spBrdrBtom spSpceBtom">
                  <p className="spBold">Labour</p>
                </div>
                <div className="d-flex h-100">
                  <div className="col spBrdrRigt text-center spSpceBtom">
                    <p className="spBold">Rate</p>
                  </div>
                  <div className="col text-center spSpceBtom">
                    <p className="spBold">Amount</p>
                  </div>
                </div>
              </div>
              <div className="totalAmountEstimatePrint d-flex align-items-center justify-content-center flex-wrap">
                <p className="text-center spBold">Amount </p>
              </div>
            </div>
            {/* data */}
            <div>
              {Array.isArray(data?.resultArray) && data.resultArray.length > 0 &&
                data.resultArray.map((item, index) => (
                  <div key={index} className="d-flex spBrdrBtom recordEstimatePrint overflow-hidden word_break_estimatePrint" style={{ borderLeft: "1px solid black", borderRight: "1px solid black" }}>
                    
                    <div className="srNoEstimatePrint spBrdrRigt p_1Estimate ">
                      <p className="text-center">{index + 1}</p>
                    </div>
                    
                    {/* Design Info */}
                    <div className="designEstimatePrint spBrdrRigt   d-flex justify-content-between flex-column">
                        <div className="d-flex justify-content-between p_1Estimate">
                          <div>{item?.designno}</div>
                          <div className="text-end">{item?.SrJobno}</div>
                        </div>
                        {/* <div
                          style={{ textAlign: "center", fontWeight: "bold" }}
                        >
                          {item?.Categoryname}
                        </div> */}
                        <div className="pb-2 p_1Estimate">
                          {image && (
                            <>
                              {/* {imageLoading && <Loader2 />} */}
                              {
                                <img
                                src={item?.DesignImage}
                                alt=""
                                className="estimate_img mx-auto d-block text-center"
                                onError={handleImageError}
                                />
                              }
                            </>
                          )}
                        </div>
                        {item?.Tunch !== 0 && 
                          <div
                            style={{ textAlign: "center" }}
                          >
                            Tunch: {fixedValues(item?.Tunch,3)}
                          </div>
                        }
                        <div className="spBrdrTop ">
                          <p
                            className="w-100 spBold"
                            style={{ padding: "1px 0px 1px 5px", textAlign: "center" }}
                          >
                            {item?.grosswt} gm Gross
                          </p>
                          {/* {item?.Size !== "" && (
                            <p className="w-100 ps-1 spBold">
                              Size : {item?.Size}
                            </p>
                          )}
                          {item?.PromiseDate !== "" && item?.PromiseDate !== null && (
                            <p className="w-100 ps-1 spBold">
                              PR Date : {item?.PromiseDate}
                            </p>
                          )} */}
                        </div>
                    </div>

                    {/* Diamond */}
                    <div className="diamondEstimatePrint spBrdrRigt position-relative ">
                        <div className="pad_bot_29_estimatePrint">
                          {item?.diamonds.length > 0 &&
                            item?.diamonds.map((ele, ind) => {
                              return (
                                <div className="d-flex " key={ind}>
                                  <div className="width20EstimatePrint p_1Estimate">
                                    <p className="spbrWord">
                                      {ele?.ShapeName} {ele?.QualityName}{" "}
                                      {ele?.Colorname}
                                    </p>
                                  </div>
                                  <div className="width20EstimatePrint p_1Estimate">
                                    <p className="">{ele?.SizeName}</p>
                                  </div>
                                  <div className="width20EstimatePrint p_1Estimate" style={{ width: "10%", minWidth: "10%" }}>
                                    <p className="text-end">
                                      {NumberWithCommas(ele?.Pcs, 0)}
                                    </p>
                                  </div>
                                  <div className="width20EstimatePrint p_1Estimate">
                                    <p className="text-end">
                                      {fixedValues(ele?.Wt, 3)}
                                    </p>
                                  </div>
                                  <div className="width20EstimatePrint p_1Estimate">
                                    <p className="text-end">
                                      {ele?.Supplier.slice(0,4)}
                                    </p>
                                  </div>
                                  <div className="width20EstimatePrint p_1Estimate">
                                    <p className="text-end">
                                      {NumberWithCommas(ele?.Rate, 2)}
                                    </p>
                                  </div>
                                  <div className="width20EstimatePrint p_1Estimate" style={{ width: "16.67%", minWidth: "16.67%" }}>
                                    <p className="spBold text-end">
                                      {NumberWithCommas(ele?.Amount, 2)}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                        <div
                          className={`d-flex totalBgEstimatePrint position-absolute bottom-0 height_28_5_estimatePrint w-100 spBrdrTop  
                            spBrdrTop height_28_5_estimatePrint `}
                        >
                          <div className="width20EstimatePrint p_1Estimate">
                            <p className="spBold"></p>
                          </div>
                          <div className="width20EstimatePrint p_1Estimate">
                            <p className="spBold"></p>
                          </div>
                          <div className="width20EstimatePrint p_1Estimate d-flex align-items-center justify-content-end" style={{ width: "10%", minWidth: "10%" }}>
                            <p className="text-end spBold">
                              {item?.totals?.diamonds?.Pcs !== 0 && (
                                <>{NumberWithCommas(item?.totals?.diamonds?.Pcs, 0)}</>
                              )}
                            </p>
                          </div>
                          <div className="width20EstimatePrint p_1Estimate d-flex align-items-center justify-content-end">
                            <p className="text-end spBold">
                              {item?.totals?.diamonds?.Wt !== 0 && (
                                <>{fixedValues(item?.totals?.diamonds?.Wt, 3)}</>
                              )}
                            </p>
                          </div>
                          <div className="width20EstimatePrint p_1Estimate d-flex align-items-center justify-content-end">
                            <p className="text-end spBold"></p>
                          </div>
                          <div className="width20EstimatePrint p_1Estimate d-flex align-items-center justify-content-end">
                            <p className="text-end spBold"></p>
                          </div>
                          <div className="width20EstimatePrint p_1Estimate d-flex align-items-center justify-content-end" style={{ width: "16.67%", minWidth: "16.67%" }}>
                            <p className="text-end spBold">
                                  {NumberWithCommas(item?.totals?.diamonds?.Amount, 2)}
                            </p>
                          </div>
                        </div>
                    </div>

                    {/* Metal */}    
                    <div className="metalEstimatePrint spBrdrRigt position-relative ">
                      <div className="pad_bot_29_estimatePrint">
                        {item?.metal?.length > 0 &&
                          item.metal.map((ele, ind) => (
                            <div className="d-flex" key={ind}>
                              <div className="width_40_estimatePrint spbrWord p_1Estimate">
                                {ele?.IsPrimaryMetal === 1 && (
                                  <p>{ele?.ShapeName} {ele?.QualityName} ({ele?.MetalColorCode})</p>
                                )}
                              </div>
                              <div className="width_40_estimatePrint p_1Estimate">
                                <p className="text-end">
                                  
                                </p>
                              </div>
                              <div className="width_40_estimatePrint p_1Estimate">
                                <p className="text-end">
                                  {fixedValues(item?.totals?.metal?.Wt, 3)}
                                </p>
                              </div>
                              <div className="width_40_estimatePrint p_1Estimate" style={{ width: "14%", minWidth: "14%" }}>
                                <p className="text-end">
                                  {ele?.Supplier.slice(0,4)}
                                </p>
                              </div>
                              <div className="width_40_estimatePrint p_1Estimate">
                                <p className="text-end">{NumberWithCommas(ele?.Rate, 2)}</p>
                              </div>
                              <div className="width_40_estimatePrint p_1Estimate" style={{ width: "19.32%", minWidth: "19.32%" }}>
                                <p className="text-end spBold">{NumberWithCommas(ele?.Amount, 2)}</p>
                              </div>
                            </div>
                          ))}
                        
                        {/* Finding */}
                        {item?.finding?.length > 0 &&
                          item.finding.map((ele, ind) => (
                            <div className="d-flex" key={ind}>
                              <div className="width_40_estimatePrint p_1Estimate">
                                {ele?.IsPrimaryMetal === 1 && (
                                  <p>{ele?.FindingAccessories}</p>
                                )}
                              </div>
                              <div className="width_40_estimatePrint p_1Estimate">
                                <p className="text-end">{fixedValues(ele?.Wt, 3)}</p>
                              </div>
                              <div className="width_40_estimatePrint p_1Estimate">
                                <p className="text-end">{fixedValues(ele?.Wt, 3)}</p>
                              </div>
                              <div className="width_40_estimatePrint p_1Estimate">
                                <p className="text-end">{NumberWithCommas(ele?.Rate, 2)}</p>
                              </div>
                              <div className="width_40_estimatePrint p_1Estimate">
                                <p className="text-end spBold">{NumberWithCommas(ele?.Amount, 2)}</p>
                              </div>
                            </div>
                          ))}

                        {item?.JobRemark && (
                          <div className="pt-2 px-1">
                            <p>Remark:</p>
                            <p className="spBold">{item.JobRemark}</p>
                          </div>
                        )}
                      </div>

                      <div className="d-flex totalBgEstimatePrint position-absolute bottom-0 height_28_5_estimatePrint w-100 spBrdrTop ">
                        <div className="width200EstimatePrint p_1Estimate" />
                        <div className="width200EstimatePrint p_1Estimate d-flex align-items-center justify-content-end">
                          <p className="text-end spBold">{fixedValues(item?.totals?.metal?.Wt + item?.totals?.finding?.Wt, 3)}</p>
                        </div>
                        <div className="width200EstimatePrint p_1Estimate d-flex align-items-center justify-content-end">
                          <p className="text-end spBold">{fixedValues(item?.NetWt + item?.LossWt, 3)}</p>
                        </div>
                        <div
                          className="width200EstimatePrint p_1Estimate d-flex align-items-center justify-content-end"
                          style={{ minWidth: "40%", width: "40%" }}
                        >
                          <p className="text-end spBold">{NumberWithCommas(item?.totals?.metal?.Amount + item?.totals?.finding?.Amount, 2)}</p>
                        </div>
                      </div>
                    </div>

                    {/* ColorStone */}
                    <div className="stoneEstimatePrint spBrdrRigt position-relative ">
                      <div className="pad_bot_29_estimatePrint">
                        {item?.colorstone?.length > 0 &&
                          item.colorstone.map((ele, ind) => (
                            <div className="d-flex" key={ind}>
                              <div className="width20EstimatePrint spbrWord p_1Estimate">
                                <p>{ele?.ShapeName} {ele?.QualityName} {ele?.Colorname}</p>
                              </div>
                              <div className="width20EstimatePrint p_1Estimate">
                                <p>{ele?.SizeName}</p>
                              </div>
                              <div className="width20EstimatePrint p_1Estimate" style={{ width: "10%", minWidth: "10%" }}>
                                <p className="text-end">{ele?.Pcs > 0 && NumberWithCommas(ele?.Pcs, 0)}</p>
                              </div>
                              <div className="width20EstimatePrint p_1Estimate">
                                <p className="text-end">{ele?.Wt > 0 && fixedValues(ele?.Wt, 3)}</p>
                              </div>
                              <div className="width20EstimatePrint p_1Estimate">
                                <p className="text-end">{ele?.Supplier.slice(0,4)}</p>
                              </div>
                              <div className="width20EstimatePrint p_1Estimate">
                                <p className="text-end">{NumberWithCommas(ele?.Rate, 2)}</p>
                              </div>
                              <div className="width20EstimatePrint p_1Estimate" style={{ width: "16.67%", minWidth: "16.67%" }}>
                                <p className="spBold text-end">{NumberWithCommas(ele?.Amount, 2)}</p>
                              </div>
                            </div>
                          ))}

                        {/* {item?.misc?.length > 0 &&
                          item.misc.map((ele, ind) => (
                            <div className="d-flex" key={ind}>
                              <div className="width20EstimatePrint p_1Estimate">
                                <p>M: {ele?.ShapeName} {ele?.QualityName}</p>
                              </div>
                              <div className="width20EstimatePrint p_1Estimate">
                                <p>{ele?.SizeName}</p>
                              </div>
                              <div className="width20EstimatePrint p_1Estimate" style={{ width: "10%", minWidth: "10%" }}>
                                <p className="text-end">{ele?.Pcs > 0 && NumberWithCommas(ele?.Pcs, 0)}</p>
                              </div>
                              <div className="width20EstimatePrint p_1Estimate">
                                <p className="text-end">{ele?.Wt > 0 && fixedValues(ele?.Wt, 3)}</p>
                              </div>
                              <div className="width20EstimatePrint p_1Estimate">
                                <p className="text-end">{ele?.Supplier.slice(0,4)}</p>
                              </div>
                              <div className="width20EstimatePrint p_1Estimate">
                                <p className="text-end">{NumberWithCommas(ele?.Rate, 2)}</p>
                              </div>
                              <div className="width20EstimatePrint p_1Estimate" style={{ width: "16.67%", minWidth: "16.67%" }}>
                                <p className="spBold text-end">{NumberWithCommas(ele?.Amount, 2)}</p>
                              </div>
                            </div>
                          ))} */}
                      </div>

                      <div className="d-flex totalBgEstimatePrint position-absolute bottom-0 height_28_5_estimatePrint w-100 spBrdrTop ">
                        <div className="width20EstimatePrint p_1Estimate" />
                        <div className="width20EstimatePrint p_1Estimate" />
                        <div className="width20EstimatePrint p_1Estimate d-flex align-items-center justify-content-end" style={{ width: "10%", minWidth: "10%" }}>
                          <p className="text-end spBold">
                            {(item?.totals?.colorstone?.length > 0 
                              // || item?.totals?.misc?.length > 0
                            ) &&
                              NumberWithCommas(item?.totals?.colorstone?.Pcs
                              //  + item?.totals?.misc?.Pcs
                               , 0)}
                          </p>
                        </div>
                        <div className="width20EstimatePrint p_1Estimate d-flex align-items-center justify-content-end">
                          <p className="text-end spBold">
                            {(item?.totals?.colorstone?.length > 0 
                              // || item?.totals?.misc?.length > 0 
                            ) &&
                              fixedValues(item?.totals?.colorstone?.Wt
                                //  + item?.totals?.misc?.Wt
                                , 3)}
                          </p>
                        </div>
                        <div className="width20EstimatePrint p_1Estimate" />
                        <div className="width20EstimatePrint p_1Estimate" />
                        <div className="width20EstimatePrint p_1Estimate d-flex align-items-center justify-content-end" style={{ width: "16.67%", minWidth: "16.67%" }}>
                          <p className="text-end spBold">
                            {NumberWithCommas(item?.totals?.colorstone?.Amount
                              //  + item?.totals?.misc?.Amount
                              , 2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Other Charges */}
                    <div className="OtherAmountEstimatePrint spBrdrRigt position-relative ">
                      <div className="h-100 d-grid pad_bot_29_estimatePrint">
                        <div className="p_1Estimate ">
                          <div className="w-100 d-flex align-items-center justify-content-end spBold">
                            {NumberWithCommas(item?.OtherCharges, 2)}
                          </div>
                        </div>
                      </div>
                      <div
                        className="totalBgEstimatePrint position-absolute bottom-0 height_28_5_estimatePrint w-100 d-flex align-items-center justify-content-end spBrdrTop "
                        style={{ height: "14.5px" }}
                      >
                        <div className="text-end p_1Estimate">
                          <div className="spBold">{NumberWithCommas(item?.OtherCharges, 2)}</div>
                        </div>
                      </div>
                    </div>

                    {/* Labour */}
                    <div className="labourEstimatePrint spBrdrRigt position-relative ">
                      <div className="h-100 d-grid pad_bot_29_estimatePrint">
                        <div className="d-flex ">
                          {item?.MakingAmount !== 0 && (
                            <>
                              <div className="w-50 p_1Estimate">
                                <p>{NumberWithCommas(item?.MaKingCharge_Unit, 2)}</p>
                                {/* <p>Labour</p> */}
                                {/* {item?.settingAmount !== 0 && <p>Labour</p>} */}
                              </div>
                              <div className="w-50 text-end p_1Estimate spBold">
                                <p>{NumberWithCommas(item?.MakingAmount, 2)}</p>
                                {/* {item?.settingAmount !== 0 && <p>{NumberWithCommas(item?.settingAmount, 2)}</p>} */}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <div
                        className="totalBgEstimatePrint position-absolute bottom-0 height_28_5_estimatePrint w-100 d-flex align-items-center justify-content-end spBrdrTop "
                        style={{ height: "14.5px" }}
                      >
                        <div className="text-end p_1Estimate spBold">
                          {NumberWithCommas(item?.totals?.makingAmount_settingAmount, 2)}
                        </div>
                      </div>
                    </div>

                    {/* Final Total */}
                    <div className="totalAmountEstimatePrint position-relative">
                      <div className="h-100 d-grid pad_bot_29_estimatePrint spBold">
                        <div className=" spBold">
                          <div className="text-end p_1Estimate pe-1 spBold">
                            {NumberWithCommas(item?.TotalAmount, 2)}
                          </div>
                        </div>
                      </div>
                      <div className="totalBgEstimatePrint spBold position-absolute bottom-0 height_28_5_estimatePrint w-100 d-flex align-items-center justify-content-end pe-1 spBrdrTop ">
                        <div className="text-end p_1Estimate spBold">
                          <div className="spBold">
                            {/* <span
                              dangerouslySetInnerHTML={{
                                __html: json1Data?.Currencysymbol,
                              }}
                            ></span> */}
                            {NumberWithCommas(item?.TotalAmount, 2)}
                          </div>
                        </div>
                      </div>
                    </div>


                    <div className="totalAmountEstimatePrint position-relative">
                      <div className="text-end p_1Estimate pe-1 spBold">
                        {NumberWithCommas(item?.TotalAmount, 2)}
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>

            {/* Tax & Add/Less*/}
            <div className="d-flex recordEstimatePrint justify-content-end align-items-center brb_dp10 tbrowdp10 pt-1" 
              style={{ borderLeft: "1px solid black", borderRight: "1px solid black" }}>
                    <div style={{ width: "13%" }}>
                      <div>
                        {data?.allTaxes?.map((e, i) => {
                          return (
                            <div
                              className="d-flex justify-content-between"
                              key={i}
                            >
                              <div className="w-50 text-end">
                                {e?.name} {e?.per}
                              </div>
                              <div className="w-50 text-end pr_dp10 p_1Estimate">
                                {formatAmount(e?.amountInNumber)}
                              </div>
                            </div>
                          );
                        })}
                        <div className="d-flex justify-content-between">
                          <div className="w-50 text-end">
                            {data?.header?.AddLess > 0 ? "Add" : data?.header?.AddLess === 0 ? "" : "Less"}
                          </div>
                          <div className="w-50 text-end pr_dp10 p_1Estimate">
                            {data?.header?.AddLess !== 0 && data?.header?.AddLess}
                          </div>
                        </div>
                      </div>
                    </div>
            </div>

            {/* Final Total */}
              <div className="d-flex recordEstimatePrint overflow-hidden spBrdrRigtBlk spBrdrTopBlk spBrdrLftBlk spBrdrBtomBlk totalBgEstimatePrint">
                    <div className="totalEstimatePrint spBrdrRigt totalBgEstimatePrint ">
                      <p className="text-center spBold h-100">Total</p>
                    </div>
                    <div className="diamondEstimatePrint spBrdrRigt ">
                      <div className="d-flex w-100">
                        <div className="width20EstimatePrint p_1Estimate h-100">
                          <p></p>
                        </div>
                        <div className="width20EstimatePrint p_1Estimate h-100">
                          <p></p>
                        </div>
                        <div className="width20EstimatePrint p_1Estimate h-100" style={{ width: "10%", minWidth: "10%" }}>
                          <p className="text-end spBold">
                            {data?.mainTotal?.diamonds?.Pcs > 0 && NumberWithCommas(data?.mainTotal?.diamonds?.Pcs, 0)}
                          </p>
                        </div>
                        <div className="width20EstimatePrint p_1Estimate h-100">
                          <p className="text-end spBold">
                            {data?.mainTotal?.diamonds?.Wt > 0 && NumberWithCommas(data?.mainTotal?.diamonds?.Wt, 3)}
                          </p>
                        </div>
                        <div className="width20EstimatePrint p_1Estimate h-100"></div>
                        <div className="width20EstimatePrint p_1Estimate h-100"></div>
                        <div className="width20EstimatePrint p_1Estimate h-100" style={{ width: "16.67%", minWidth: "16.67%" }}>
                          <p className="text-end spBold">
                            {NumberWithCommas(data?.mainTotal?.diamonds?.Amount, 2)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="metalEstimatePrint spBrdrRigt ">
                      <div className="d-flex totalBgEstimatePrint bottom-0 w-100">
                        <div className="width200EstimatePrint p_1Estimate h-100">
                          <p className="spBold"></p>
                        </div>
                        <div className="width200EstimatePrint p_1Estimate h-100">
                          <p className="spBold text-end">
                            {/* {data?.weightWithDiamondLoss !== 0 && fixedValues(data.weightWithDiamondLoss, 3)} */}
                          </p>
                        </div>
                        <div className="width200EstimatePrint p_1Estimate h-100">
                          <p className="spBold text-end">
                            {(data?.mainTotal?.metal?.Wt !== 0 || data?.mainTotal?.metal?.Wt !== 0) && 
                              fixedValues(data?.mainTotal?.metal?.Wt + data?.mainTotal?.finding?.Wt, 3)}
                          </p>
                        </div>
                        <div
                          className="width200EstimatePrint p_1Estimate h-100"
                          style={{ minWidth: "40%", width: "40%" }}
                        >
                          <p className="spBold text-end">
                            {NumberWithCommas(data?.mainTotal?.metal?.Amount + data?.mainTotal?.finding?.Amount, 2)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="stoneEstimatePrint spBrdrRigt ">
                      <div className="d-flex totalBgEstimatePrint bottom-0 w-100">
                        <div className="width20EstimatePrint p_1Estimate h-100">
                          <p className="spBold"></p>
                        </div>
                        <div className="width20EstimatePrint p_1Estimate h-100">
                          <p className="spBold"></p>
                        </div>
                        <div className="width20EstimatePrint p_1Estimate h-100" style={{ width: "10%", minWidth: "10%" }}>
                          <p className="text-end spBold">
                            {(data?.mainTotal?.colorstone?.Pcs !== 0 || data?.mainTotal?.misc?.Pcs !== 0) &&
                              (data?.mainTotal?.colorstone?.Pcs + data?.mainTotal?.misc?.Pcs)}
                          </p>
                        </div>
                        <div className="width20EstimatePrint p_1Estimate h-100">
                          <p className="text-end spBold">
                            {(data?.mainTotal?.colorstone?.Wt !== 0 || data?.mainTotal?.misc?.Wt !== 0) && 
                              fixedValues(data?.mainTotal?.colorstone.Wt + data?.mainTotal?.misc?.Wt, 3)}
                          </p>
                        </div>
                        <div className="width20EstimatePrint p_1Estimate h-100"></div>
                        <div className="width20EstimatePrint p_1Estimate h-100"></div>
                        <div className="width20EstimatePrint p_1Estimate h-100" style={{ width: "16.67%", minWidth: "16.67%" }}>
                          <p className="text-end spBold">
                            {NumberWithCommas(data?.mainTotal?.colorstone?.Amount + data?.mainTotal?.misc?.Amount, 2)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="OtherAmountEstimatePrint spBrdrRigt ">
                      <div className="totalBgEstimatePrint bottom-0 w-100 h-100">
                        <div className="h-100 text-end p_1Estimate">
                          <p className="spBold">
                            {NumberWithCommas(data?.mainTotal?.total_other_charges, 2)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="labourEstimatePrint spBrdrRigt ">
                      <div className="d-flex w-100 h-100 justify-content-end">
                        <div className="p_1Estimate spBold">
                          <p>
                            {NumberWithCommas(data?.mainTotal?.total_Making_Amount, 2)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="totalAmountEstimatePrint d-flex">
                      <div className="totalBgEstimatePrint w-100 h-100">
                        <div className="text-end p_1Estimate">
                          <p className="spBold">
                            <span
                              dangerouslySetInnerHTML={{
                                __html: headerData?.Currencysymbol,
                              }}
                            ></span>
                            {data?.finalAmount !== 0 && NumberWithCommas(data.finalAmount, 2)}
                          </p>
                        </div>
                      </div>
                    </div>
              </div>

              <div className="d-flex w-100 recordEstimatePrint overflow-hidden align-items-start " style={{ gap: "3px"}}>
                {/* Summary Section */}
                <div className="min_height_100EstimatePrint spBrdrLft spBrdrRigt spBrdrBtom position-relative col-2 ">
                        <div className="totalBgEstimatePrint text-center spBrdrBtom ">
                          <p className="spBold p-1">SUMMARY</p>
                        </div>

                        <div className="d-flex h-100 pb-3">
                          <div className="d-flex w-100 justify-content-between">
                            {/* LEFT COLUMN */}
                            <div className="w-100 h-100 pb-2 ">
                              <div className="d-flex justify-content-between px-1">
                                <p className="spBold">GOLD IN 24KT</p>
                                <p>{fixedValues(data?.header?.MetalRate24K, 3)} gm</p>
                              </div>
                              <div className="d-flex justify-content-between px-1">
                                <p className="spBold">GROSS WT</p>
                                <p>{fixedValues(data?.mainTotal?.grosswt, 3)} gm</p>
                              </div>
                              <div className="d-flex justify-content-between px-1">
                                <p className="spBold">*WT</p>
                                <p>{fixedValues()} gm</p>
                              </div>
                              <div className="d-flex justify-content-between px-1">
                                <p className="spBold">NET WT</p>
                                <p>{fixedValues(data?.mainTotal?.netwt, 2)} gm</p>
                              </div>
                              <div className="d-flex justify-content-between px-1">
                                <p className="spBold">DIAMOND WT</p>
                                <p>
                                  {NumberWithCommas(data?.mainTotal?.diamonds?.Pcs, 0)} /{" "}
                                  {NumberWithCommas(data?.mainTotal?.diamonds?.Wt, 3)} cts
                                </p>
                              </div>
                              <div className="d-flex justify-content-between px-1">
                                <p className="spBold">STONE WT</p>
                                <p>
                                  {NumberWithCommas(data?.mainTotal?.colorstone?.Pcs, 0)} /{" "}
                                  {fixedValues(data?.mainTotal?.colorstone?.Wt, 3)} cts
                                </p>
                              </div>
                              <div className="d-flex justify-content-between px-1">
                                <p className="spBold">MISC WT</p>
                                <p>
                                  {NumberWithCommas(data?.mainTotal?.misc?.Pcs, 0)} /{" "}
                                  {fixedValues(data?.mainTotal?.misc?.Wt, 3)} gm
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Row */}
                        <div className="d-flex totalBgEstimatePrint position-absolute bottom-0 w-100 spBrdrTop ">
                          <div className="px-1 min_height_24_estimatePrint w-50">
                            <div className="d-flex justify-content-between align-items-center h-100">
                              <div className="spBold"></div>
                            </div>
                          </div>
                        </div>
                </div>
                      
                {/* Diamond Detail */}
                <div className="min_height_100EstimatePrint spBrdrLft spBrdrRigt spBrdrBtom position-relative col-2 ">
                  <div className="totalBgEstimatePrint text-center spBrdrBtom ">
                          <p className="spBold p-1">Diamond Detail</p>
                        </div>

                        <div className="d-flex h-100 pb-3">
                          <div className="d-flex w-100 justify-content-between">
                            {/* LEFT COLUMN */}
                            <div className="w-100 h-100 pb-2 ">
                              <div className="d-flex flex-column px-1">
                                {data?.resultArray?.flatMap((e) =>
                                  e?.diamonds?.map((el, i) => (
                                    <div key={i} className="d-flex justify-content-between">
                                      <p className="col-6 spBold spbrWord m-0">
                                        {el?.ShapeName + " " + el?.Colorname + " " + el?.SizeName}
                                      </p>
                                      <p className="col-4 spbrWord m-0 text-end">
                                        {el?.Pcs} / {fixedValues(el?.Wt, 3)} cts
                                      </p>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="d-flex totalBgEstimatePrint position-absolute bottom-0 w-100 spBrdrTop ">
                          <div className="px-1 min_height_24_estimatePrint w-50">
                            <div className="d-flex justify-content-between align-items-center h-100">
                              <div className="spBold"></div>
                            </div>
                          </div>
                        </div>
                </div>
                      
                {/* Category Wise Summary */}      
                <div className="min_height_100EstimatePrint spBrdrLft spBrdrRigt spBrdrBtom position-relative col-2 ">
                  <div className="totalBgEstimatePrint text-center spBrdrBtom ">
                    <p className="spBold p-1">Summary</p>
                  </div>

                  <div className="d-flex h-100 pb-3">
                    <div className="d-flex w-100 justify-content-between">
                      <div className="w-100 h-100 pb-2 ">
                      <div className="d-flex flex-column px-1">
                                {categoryCounts?.map((el) =>
                                    <div className="d-flex justify-content-between">
                                      <p className="col-6 spBold spbrWord m-0">
                                        {el?.Categoryname}
                                      </p>
                                      <p className="col-4 spbrWord m-0 text-end">
                                        {el?.count}
                                      </p>
                                    </div>
                                )}
                              </div>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex totalBgEstimatePrint position-absolute bottom-0 w-100 spBrdrTop ">
                    <div className="px-1 min_height_24_estimatePrint w-50">
                      <div className="d-flex justify-content-between align-items-center h-100">
                        <div className="spBold"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="spWdthLst"></div>

                {/* Checked By Section */}
                <div className="col-1 min_height_100EstimatePrint d-flex align-items-end justify-content-center spBrdrLft spBrdrRigt spBrdrBtom ">
                  <div className="d-flex h-100 w-100">
                    <div className="position-relative d-flex justify-content-center align-items-end w-100">
                      <i className="w-100 text-center">Checked By</i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      ) : (
        <p className="text-danger fs-2 spBold mt-5 text-center w-50 mx-auto">
          {msg}
        </p>
      )}
    </>
  );
};

export default DetailPrintFG;
