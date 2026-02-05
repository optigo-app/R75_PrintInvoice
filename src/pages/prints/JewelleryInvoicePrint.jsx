import React, { useState, useEffect } from "react";
import "../../assets/css/prints/jewellaryinvoiceprint.css";
import {
  apiCall,
  CapitalizeWords,
  isObjectEmpty,
  formatAmount,
  taxGenrator,
  checkMsg,
} from "../../GlobalFunctions";
import convertor from "number-to-words";
import Button from "./../../GlobalFunctions/Button";
import Loader from "../../components/Loader";
import { OrganizeDataPrint } from './../../GlobalFunctions/OrganizeDataPrint';
import { deepClone } from "@mui/x-data-grid/utils/utils";
import { ToWords } from "to-words";

const JewelleryInvoicePrint = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
  const [headerData, setHeaderData] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [dynamicList1, setDynamicList1] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [dynamicList2, setDynamicList2] = useState([]);
  const [resultArray, setResultArray] = useState([]);
  const [result, setResult] = useState();
  const [mainTotal, setMainTotal] = useState({});
  const [grandTot, setGrandTot] = useState(0);
  const [taxTotal, setTaxTotal] = useState([]);
  const [inWords, setInWords] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [groupedArr, setGroupedArr] = useState([]);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const [isImageWorking, setIsImageWorking] = useState(true);

  const toWords = new ToWords();

  const handleImageErrors = () => {
    setIsImageWorking(false);
  };
  async function loadData(data) {
    try {

      let address = data?.BillPrint_Json[0]?.Printlable?.split("\r\n");
      data.BillPrint_Json[0].address = address;
      setHeaderData(data?.BillPrint_Json[0]);
      setDynamicList1(data?.BillPrint_Json1);
      setDynamicList2(data?.BillPrint_Json2);
      // organizeData(
      //   data?.BillPrint_Json[0],
      //   data?.BillPrint_Json1,
      //   data?.BillPrint_Json2
      // );
      const datas = OrganizeDataPrint( data?.BillPrint_Json[0],
        data?.BillPrint_Json1,
        data?.BillPrint_Json2 );
        

        datas?.resultArray?.forEach((e) => {
          let diamondsgrp = [];
          e?.diamonds?.forEach((el) => {
            let obj = deepClone(el);
              // let findrec = diamondsgrp?.findIndex((a) => a?.ShapeName === el?.ShapeName && a?.QualityName === el?.QualityName && a?.Colorname === el?.Colorname && a?.SizeName === el?.SizeName)
              let findrec = diamondsgrp?.findIndex((a) => a?.ShapeName === el?.ShapeName && a?.QualityName === el?.QualityName && a?.Colorname === el?.Colorname)
              if(findrec === -1){
                diamondsgrp.push(obj);
              }else{
                diamondsgrp[findrec].Pcs += el?.Pcs;
                diamondsgrp[findrec].Wt += el?.Wt;
                diamondsgrp[findrec].Rate += el?.Rate;
                diamondsgrp[findrec].Amount += el?.Amount;
              }
          })
          e.diamonds = diamondsgrp;
          let colorstonegrp = [];
          e?.colorstone?.forEach((el) => {
            let obj = deepClone(el);
              // let findrec = colorstonegrp?.findIndex((a) => a?.ShapeName === el?.ShapeName && a?.QualityName === el?.QualityName && a?.Colorname === el?.Colorname && a?.SizeName === el?.SizeName)
              let findrec = colorstonegrp?.findIndex((a) => a?.ShapeName === el?.ShapeName && a?.QualityName === el?.QualityName && a?.Colorname === el?.Colorname )
              if(findrec === -1){
                colorstonegrp.push(obj);
              }else{
                colorstonegrp[findrec].Pcs += el?.Pcs;
                colorstonegrp[findrec].Wt += el?.Wt;
                colorstonegrp[findrec].Rate += el?.Rate;
                colorstonegrp[findrec].Amount += el?.Amount;
              }
          })
          e.colorstone = colorstonegrp;
        })

            
        datas?.resultArray?.sort((a, b) => a?.Categoryname?.localeCompare(b?.Categoryname));
        setResult(datas);

      setLoader(false);
    } catch (error) {
      console.log(error);
    }
  }
  // const organizeData = (arr, arr1, arr2) => {
  //   let totamt = 0;
  //   let FineArr = [];

  //   // eslint-disable-next-line array-callback-return
  //   arr1?.map((e, i) => {
  //     // eslint-disable-next-line array-callback-return
  //     arr2?.map((el, i) => {
  //       if (e?.SrJobno === el?.StockBarcode) {
  //         if (e?.MetalPurity === el?.QualityName) {
  //           FineArr.push(el);
  //         }
  //       }
  //     });
  //   });
  //   let blankArr = [];

  //   // eslint-disable-next-line array-callback-return
  //   arr1.map((e) => {
  //     let obj = { ...e };
  //     obj.FineWt = 0;
  //     obj.MRate = 0;
  //     // eslint-disable-next-line array-callback-return
  //     FineArr?.map((el) => {
  //       if (e?.SrJobno === el?.StockBarcode) {
  //         obj.FineWt += el?.FineWt;
  //         obj.MRate += el?.Rate;
  //       }
  //     });
  //     blankArr.push(obj);
  //   });
  //   let mainTotal = {
  //     diamonds: {
  //       Wt: 0,
  //       Pcs: 0,
  //       Rate: 0,
  //       Amount: 0,
  //     },
  //     colorstone: {
  //       Wt: 0,
  //       Pcs: 0,
  //       Rate: 0,
  //       Amount: 0,
  //     },
  //     metal: {
  //       Wt: 0,
  //       Pcs: 0,
  //       Rate: 0,
  //       Amount: 0,
  //     },
  //     misc: {
  //       Wt: 0,
  //       Pcs: 0,
  //       Rate: 0,
  //       Amount: 0,
  //     },
  //     finding: {
  //       Wt: 0,
  //       Pcs: 0,
  //       Rate: 0,
  //       Amount: 0,
  //     },
  //     totalnetwt: {
  //       netwt: 0,
  //     },
  //     totalgrosswt: {
  //       grosswt: 0,
  //     },
  //     totallabourAmount: 0,
  //     totalOtherAmount: 0,
  //     totalunitCost: 0,
  //   };

  //   let resultArr = [];

  //   // eslint-disable-next-line array-callback-return
  //   arr1.map((e, i) => {
  //     let diamonds = [];
  //     let colorstone = [];
  //     let metal = [];
  //     let misc = [];
  //     let finding = [];
  //     let totals = {
  //       diamonds: {
  //         Wt: 0,
  //         Pcs: 0,
  //         Rate: 0,
  //         Amount: 0,
  //       },
  //       colorstone: {
  //         Wt: 0,
  //         Pcs: 0,
  //         Rate: 0,
  //         Amount: 0,
  //       },
  //       metal: {
  //         Wt: 0,
  //         Pcs: 0,
  //         Rate: 0,
  //         Amount: 0,
  //       },
  //       misc: {
  //         Wt: 0,
  //         Pcs: 0,
  //         Rate: 0,
  //         Amount: 0,
  //       },
  //       finding: {
  //         Wt: 0,
  //         Pcs: 0,
  //         Rate: 0,
  //         Amount: 0,
  //       },
  //       labourAmount: 0,
  //       OtherAmount: 0,
  //     };

  //     totals.OtherAmount += +e?.OtherCharges + e?.MiscAmount;

  //     totals.labourAmount += e?.MakingAmount;

  //     totamt += e?.TotalAmount;

  //     mainTotal.totalunitCost += e?.TotalAmount;

  //     mainTotal.totalgrosswt.grosswt += e?.grosswt;

  //     mainTotal.totalnetwt.netwt += +e?.NetWt + +e?.LossWt;

  //     mainTotal.totalOtherAmount =
  //       mainTotal.totalOtherAmount + e?.OtherCharges + e?.MiscAmount;

  //     mainTotal.totallabourAmount =
  //       mainTotal.totallabourAmount + e?.MakingAmount;

  //     arr2.map((ele, ind) => {
  //       if (e.SrJobno === ele?.StockBarcode) {
  //         if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
  //           ele.finewt = ele?.FineWt;
  //           diamonds.push(ele);
  //           totals.diamonds.Wt += ele?.Wt;
  //           totals.diamonds.Pcs += ele?.Pcs;
  //           totals.diamonds.Rate += ele?.Rate;
  //           totals.diamonds.Amount += ele?.Amount;
  //           mainTotal.diamonds.Wt += ele?.Wt;
  //           mainTotal.diamonds.Pcs += ele?.Pcs;
  //           mainTotal.diamonds.Rate += ele?.Rate;
  //           mainTotal.diamonds.Amount += ele?.Amount;
  //         }
  //         if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
  //           colorstone.push(ele);
  //           totals.colorstone.Wt += ele?.Wt;
  //           totals.colorstone.Pcs += ele?.Pcs;
  //           totals.colorstone.Rate += ele?.Rate;
  //           totals.colorstone.Amount += ele?.Amount;
  //           mainTotal.colorstone.Wt += ele?.Wt;
  //           mainTotal.colorstone.Pcs += ele?.Pcs;
  //           mainTotal.colorstone.Rate += ele?.Rate;
  //           mainTotal.colorstone.Amount += ele?.Amount;
  //         }
  //         if (ele?.MasterManagement_DiamondStoneTypeid === 3) {
  //           misc.push(ele);
  //           totals.misc.Wt += ele?.Wt;
  //           totals.misc.Pcs += ele?.Pcs;
  //           totals.misc.Rate += ele?.Rate;
  //           totals.misc.Amount += ele?.Amount;
  //           mainTotal.misc.Wt += ele?.Wt;
  //           mainTotal.misc.Pcs += ele?.Pcs;
  //           mainTotal.misc.Rate += ele?.Rate;
  //           mainTotal.misc.Amount += ele?.Amount;
  //         }
  //         if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
  //           metal.push(ele);
  //           totals.metal.Wt += ele?.Wt;
  //           totals.metal.Pcs += ele?.Pcs;
  //           totals.metal.Rate += ele?.Rate;
  //           totals.metal.Amount += ele?.Amount;
  //           mainTotal.metal.Wt += ele?.Wt;
  //           mainTotal.metal.Pcs += ele?.Pcs;
  //           mainTotal.metal.Rate += ele?.Rate;
  //           mainTotal.metal.Amount += ele?.Amount;
  //         }
  //         if (ele?.MasterManagement_DiamondStoneTypeid === 5) {
  //           finding.push(ele);
  //           totals.finding.Wt += ele?.Wt;
  //           totals.finding.Pcs += ele?.Pcs;
  //           totals.finding.Rate += ele?.Rate;
  //           totals.finding.Amount += ele?.Amount;
  //           mainTotal.finding.Wt += ele?.Wt;
  //           mainTotal.finding.Pcs += ele?.Pcs;
  //           mainTotal.finding.Rate += ele?.Rate;
  //           mainTotal.finding.Amount += ele?.Amount;
  //         }
  //       }
  //     });
  //     let obj = { ...e };
  //     // let separte = separatedOthAmt(obj);
  //     // obj.OtherAmountInfo = separte;

  //     obj.diamonds = diamonds;
  //     obj.colorstone = colorstone;
  //     obj.metal = metal;
  //     obj.misc = misc;
  //     obj.finding = finding;
  //     obj.totals = totals;
  //     let sumoflbr = e?.MakingAmount;
  //     obj.LabourAmountSum = sumoflbr;
  //     let sumofOth = e?.OtherCharges + e?.MiscAmount;
  //     obj.OtherChargeAmountSum = sumofOth;
  //     resultArr.push(obj);
  //   });

  //   let blankArray = [];

  //   arr1.forEach((e, i) => {
  //     let obj = { ...e };
  //     let diamonds = [];
  //     let colorStones = [];
  //     let metal = [];
  //     arr2.forEach((ele, ind) => {
  //       if (e?.SrJobno === ele?.StockBarcode) {
  //         if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
  //           metal.push(ele);
  //         }
  //         if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
  //           let findIndex = colorStones.findIndex(
  //             (elem) =>
  //               elem?.ShapeName === ele?.ShapeName &&
  //               elem?.Colorname === ele?.Colorname &&
  //               elem?.QualityName === ele?.QualityName
  //           );
  //           if (findIndex === -1) {
  //             colorStones.push(ele);
  //           } else {
  //             colorStones[findIndex].Pcs += ele?.Pcs;
  //             colorStones[findIndex].Wt += ele?.Wt;
  //           }
  //         }
  //         if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
  //           let findIndex = diamonds.findIndex(
  //             (elem) =>
  //               elem?.ShapeName === ele?.ShapeName &&
  //               elem?.Colorname === ele?.Colorname &&
  //               elem?.QualityName === ele?.QualityName
  //           );
  //           if (findIndex === -1) {
  //             diamonds.push(ele);
  //           } else {
  //             diamonds[findIndex].Pcs += ele?.Pcs;
  //             diamonds[findIndex].Wt += ele?.Wt;
  //           }
  //         }
  //       }
  //     });
  //     obj.diamonds = diamonds;
  //     obj.colorStones = colorStones;
  //     obj.metal = metal;
  //     blankArray.push(obj);
  //   });

  //   setResultArray(blankArray);
  //   setMainTotal(mainTotal);

  //   const groupedObjects = {};
  //   arr2.forEach((item) => {
  //     if (arr1.some((srItem) => srItem.SrJobno === item.StockBarcode)) {
  //       if (!groupedObjects[item.StockBarcode]) {
  //         groupedObjects[item.StockBarcode] = [];
  //       }
  //       groupedObjects[item.StockBarcode].push(item);
  //     }
  //   });
  //   const resultArray = Object.keys(groupedObjects).map((key) => ({
  //     SrjobNo: key,
  //     data: groupedObjects[key],
  //   }));

  //   let arrResult = [];
  //   resultArray.forEach((e, i) => {
  //     const mergedArray = e.data.reduce((result, current) => {
  //       const existingItem = result.find(
  //         (item) =>
  //           item.Rate === current.Rate && item.ShapeName === current.ShapeName
  //       );
  //       if (existingItem) {
  //         existingItem.gwt += current.gwt;
  //         existingItem.cst += current.cst;
  //         existingItem.Rate += current.Rate;
  //         existingItem.Amount += current.Amount;
  //       } else {
  //         result.push({ ...current });
  //       }

  //       return result;
  //     }, []);
  //     arrResult.push({ jobNo: e.SrjobNo, data: mergedArray });
  //   });
  //   setGroupedArr(resultArray);

  //   let grandTot = totamt + arr?.AddLess;
  //   let allTax = taxGenrator(arr, grandTot);

  //   setTaxTotal(allTax);
  //   allTax?.forEach((el, i) => {
  //     totamt = totamt + +el?.amount;
  //   });
  //   setGrandTot(totamt);
  //   let words = CapitalizeWords(convertor.toWords(Math.round(totamt)));
  //   setInWords(words);
  // };
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <>
          {msg === "" ? (
            <>
              <div className="containerJL pad_60_allPrint fs_jip">
                <div className="btnpcl mb-4">
                  <Button />
                </div>
                <div className="printJL">
                  <div className="headlineJL">
                    <b style={{ fontSize: "20px" }}>
                      {headerData?.PrintHeadLabel}
                    </b>
                  </div>
                  <div className="headJL">
                    <div className="headJLContent fs_jip">
                      <div className="fslhJL">
                        <div className="jip_26">
                          <b style={{ fontSize: "13px", color: "black" }}>
                            {headerData?.CompanyFullName}
                          </b>
                        </div>
                      </div>
                      <div className=" fs_jip">{headerData?.CompanyAddress}</div>
                      <div className=" fs_jip">
                        {headerData?.CompanyAddress2}
                      </div>
                      <div className="fs_jip">
                        {headerData?.CompanyCity}-{headerData?.CompanyPinCode},{" "}
                        {headerData?.CompanyState}({headerData?.CompanyCountry})
                      </div>
                      <div className="fs_jip">
                        Tell No: {headerData?.CompanyTellNo}
                      </div>
                      <div className="fs_jip">
                        {headerData?.CompanyEmail} |{" "}
                        {headerData?.CompanyWebsite}
                      </div>
                      <div className="fs_jip">
                        {result?.header?.Company_VAT_GST_No} | {result?.header?.Company_CST_STATE} - {result?.header?.Company_CST_STATE_No} | PAN - {result?.header?.Com_pannumber}
                      </div>
                    </div>
                    <div className="headJLImg">
                    {isImageWorking && (headerData?.PrintLogo !== "" && 
                      <img src={headerData?.PrintLogo} alt="" 
                      className='w-100 h-auto ms-auto d-block object-fit-contain'
                      onError={handleImageErrors} height={120} width={150} style={{maxWidth: "116px"}} />)}
                     
                    </div>
                  </div>
                  <div className="dynamicHeadJLmain fs_jip" >
                    <div className="dynamicHeadJL1 p-1">
                      <div className="fs_jip">{headerData?.lblBillTo}</div>
                      <div className="fs_jip">
                        <b className="JL13 ">{headerData?.customerfirmname}</b>
                      </div>
                      {headerData?.customerAddress1?.length > 0 ? ( <div className="fs_jip"> {headerData?.customerAddress1} </div> ) : ( "" )}
                      {headerData?.customerAddress2?.length > 0 ? ( <div className="fs_jip"> {headerData?.customerAddress2} </div> ) : ( "" )}
                      {headerData?.customerAddress3?.length > 0 ? ( <div className="fs_jip"> {headerData?.customerAddress3} </div> ) : ( "" )}
                      <div className="fs_jip"> {headerData?.customercity} {headerData?.customerpincode} </div>
                      <div className="fs_jip">{headerData?.customeremail1}</div>
                      <div className="fs_jip">{headerData?.vat_cst_pan}</div>
                      <div className="fs_jip">{headerData?.Cust_CST_STATE} - {headerData?.Cust_CST_STATE_No}</div>
                      
                    </div>
                    <div className="dynamicHeadJL2 fs_jip p-1">
                      <div className="fs_jip">Ship to</div>
                      <div className="fs_jip">
                        <b className="JL13">{headerData?.customerfirmname}</b>
                      </div>
                      <div>
                        {
                          headerData?.address?.length > 0 &&
                          headerData?.address?.map((e, i) => {
                            return(
                              <div className="fs_jip"  key={i}>{e}</div>
                            )
                          })
                        }
                      </div>
                    </div>
                    <div className="dynamicHeadJL3 fs_jip p-1">
                      <div className="billnoJL ">
                        <div className="JLbillnow fslhJL ">
                          <b className="JL13">BILL NO</b>
                        </div>
                        <div className="billno3pdlJL JL13 w-100">
                          {headerData?.InvoiceNo}
                        </div>
                      </div>
                      <div className="billnoJL">
                        <div className="JLbillnow fslhJL">
                          <b className="JL13">DATE</b>
                        </div>
                        <div className="billno3pdlJL JL13 w-100">
                          {headerData?.EntryDate}
                        </div>
                      </div>
                      <div className="billnoJL">
                        <div className="JLbillnow fslhJL">
                          <b className="JL13">HSN</b>
                        </div>
                        <div className="billno3pdlJL JL13 w-100">
                          {headerData?.HSN_No}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="tableJL">
                    <div className="theadJL fw-bold fs_jip">
                      <div className="tc1JL h-100">Sr#</div>
                      <div className="tc2JL h-100 d-flex justify-content-center">Description</div>
                      <div className="tc5JL h-100">
                        <div className="tc5JL1">Gold</div>
                        <div className="tc5JL2">
                          <div className="d-flex justify-content-center align-items-center w-50 h-100 brrJL">
                            Quality
                          </div>
                          <div className="d-flex justify-content-center align-items-center w-50 h-100">
                            Gross/Net.
                          </div>
                        </div>
                      </div>
                      <div className="tc5JL h-100">
                        <div className="tc5JL1">Diamond</div>
                        <div className="tc5JL2">
                          <div className="d-flex justify-content-center align-items-center w-50 h-100 brrJL">
                            Detail
                          </div>
                          <div className="d-flex justify-content-center align-items-center w-50 h-100">
                            Wt.
                          </div>
                        </div>
                      </div>
                      <div className="tc5JL h-100">
                        <div className="tc5JL1">Colorstone</div>
                        <div className="tc5JL2">
                          <div className="d-flex justify-content-center align-items-center w-50 h-100 brrJL">
                            Detail
                          </div>
                          <div className="d-flex justify-content-center align-items-center w-50 h-100">
                            Wt.
                          </div>
                        </div>
                      </div>
                      <div className="tc6JL d-flex justify-content-center h-100">
                        Others
                      </div>
                      <div className="tc7JL d-flex justify-content-center h-100">
                        Labour
                      </div>
                      <div
                        className="tc8JL d-flex justify-content-center h-100"
                        style={{ borderRight: "0px" }}
                      >
                        Total
                      </div>
                    </div>
                    <div className="tbodyJL ">
                      {result?.resultArray.length > 0 &&
                        result?.resultArray?.map((e, i) => {
                          return (
                            <div className="trowJL no_break fs_jip" key={i}>
                              <div className="tc1JL">{i + 1}</div>
                              <div className="tc2JL">
                                <div>{e?.Categoryname}</div>
                                <div className="d-flex">
                                  <div>{e?.designno} | </div>
                                  <div>{e?.SrJobno}</div>
                                </div>
                              </div>
                              <div className="tc3JL">
                                <div className="tc4JL2 h-100">
                                  <div className="d-flex justify-content-start align-items-center w-50 h-100  brrJL ps-1" style={{wordBreak:'break-word'}}>
                                    {/* {e?.MetalPurity} / {e?.MetalType}{" "} */}
                                    {e?.MetalPurity} / &nbsp;
                                    {e?.MetalColor}
                                  </div>
                                  <div className="d-flex justify-content-end align-items-center w-50 h-100  pe-1">
                                    {e?.grosswt?.toFixed(3)}/
                                    {((e?.NetWt + e?.LossWt) - e?.totals?.metal?.WithOutPrimaryMetal)?.toFixed(3)}
                                  </div>
                                </div>
                              </div>
                              <div className="tc4JL">
                                {e?.diamonds?.length > 0 ? (
                                  e?.diamonds?.map((el, i) => {
                                    return (
                                      <div className="tc4JL2 h-100" key={i}>
                                        <div className="d-flex justify-content-start ps-1 align-items-center w-50 h-100 brrJL">
                                          {/* {el?.ShapeName} / {el?.QualityName}{" "} / */}
                                          {el?.ShapeName} / {el?.QualityName}{" "} /
                                          {el?.Colorname}
                                        </div>
                                        <div className="d-flex justify-content-end pe-1 align-items-center h-100 w-50 ">
                                          {el?.Pcs}/{el?.Wt?.toFixed(3)}
                                        </div>
                                      </div>
                                    );
                                  })
                                ) : (
                                  <div className="tc4JL2 h-100" key={i}>
                                    <div className="d-flex justify-content-center align-items-center w-50 h-100 brrJL">
                                      {/* {el?.ShapeName} {el?.QualityName} {el?.Colorname} */}
                                    </div>
                                    <div className="d-flex justify-content-center align-items-center h-100 w-50 ">
                                      {/* {el?.Pcs}/{el?.Wt?.toFixed(3)} */}
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="tc5JL fs_jip">
                                {e?.colorstone?.length > 0 ? (
                                  e?.colorstone?.map((el, i) => {
                                    return (
                                      <div className="tc4JL2 h-100" key={i}>
                                        <div className="d-flex justify-content-start ps-1 align-items-center w-50 h-100 brrJL">
                                          {el?.ShapeName} / {el?.QualityName}{" "} /
                                          {el?.Colorname}
                                        </div>
                                        <div className="d-flex justify-content-end pe-1 align-items-center h-100 w-50 ">
                                          {el?.Pcs}/{el?.Wt?.toFixed(3)}
                                        </div>
                                      </div>
                                    );
                                  })
                                ) : (
                                  <div className="tc4JL2 h-100" key={i}>
                                    <div className="d-flex justify-content-center align-items-center w-50 h-100 brrJL">
                                      {/* {el?.ShapeName} {el?.QualityName} {el?.Colorname} */}
                                    </div>
                                    <div className="d-flex justify-content-center align-items-center h-100 w-50 ">
                                      {/* {el?.Pcs}/{el?.Wt?.toFixed(3)} */}
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="tc6JL">
                                {/* {formatAmount(e?.OtherCharges)} */}
                                {formatAmount(e?.OtherCharges + e?.TotalDiamondHandling + e?.MiscAmount)}
                                
                              </div>
                              <div className="tc7JL">
                                {/* {formatAmount(e?.MakingAmount)} */}
                                {formatAmount((e?.MakingAmount + e?.totals?.diamonds?.SettingAmount + e?.totals?.colorstone?.SettingAmount))}
                              </div>
                              <div
                                className="tc8JL"
                                style={{ borderRight: "0px" }}
                              >
                                {formatAmount(e?.TotalAmount)}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                    <div className="totalrowJL fw-bold fsJL no_break fs_jip" style={{ borderTop: "0px" }} >
                      <div className="tc1JL h-100"></div>
                      <div className="tc2JL fs-6 h-100 ">TOTAL</div>
                      <div className="tc3JL h-100">
                        <div className="tc4JL2 h-100">
                          <div className="d-flex justify-content-center align-items-center w-50 h-100 brrJL"></div>
                          <div className="d-flex justify-content-end pe-1 align-items-center w-50 h-100">
                            {result?.mainTotal?.grosswt?.toFixed(3)}/{result?.mainTotal?.metal?.IsPrimaryMetal?.toFixed(3)}
                          </div>
                        </div>
                      </div>
                      <div className="tc4JL h-100">
                        <div className="tc4JL2 h-100">
                          <div className="d-flex justify-content-center align-items-center w-50 h-100 brrJL"></div>
                          <div className="d-flex justify-content-end pe-1 align-items-center w-50 h-100">
                            {result?.mainTotal?.diamonds?.Pcs}/
                            {result?.mainTotal?.diamonds?.Wt?.toFixed(3)}
                          </div>
                        </div>
                      </div>
                      <div className="tc5JL h-100">
                        <div className="tc5JL2 h-100">
                          <div className="d-flex justify-content-center align-items-center w-50 h-100 brrJL"></div>
                          <div className="d-flex justify-content-end pe-1 align-items-center w-50 h-100">
                            {result?.mainTotal?.colorstone?.Pcs}/
                            {result?.mainTotal?.colorstone?.Wt?.toFixed(3)}
                          </div>
                        </div>
                      </div>
                      <div className="tc6JL d-flex justify-content-end pe-1 h-100">
                        {/* {mainTotal?.totalOtherAmount?.toFixed(2)} */}
                        {/* {formatAmount(result?.mainTotal?.total_other)} */}
                        {formatAmount(result?.mainTotal?.total_otherCharge_Diamond_Handling)}
                      </div>
                      <div className="tc7JL d-flex justify-content-end pe-1 h-100">
                        {/* {mainTotal?.totallabourAmount?.toFixed(2)} */}
                        {formatAmount(((
                          (result?.mainTotal?.total_Making_Amount + result?.mainTotal?.diamonds?.SettingAmount + result?.mainTotal?.colorstone?.SettingAmount)/(result?.header?.CurrencyExchRate)
                          )))}
                      </div>
                      <div className="tc8JL d-flex justify-content-end pe-1 h-100" style={{ borderRight: "0px" }} >
                        {/* {mainTotal?.totalunitCost?.toFixed(2)} */}
                        {formatAmount(result?.mainTotal?.total_amount)}
                      </div>
                    </div>
                    <div className="footerJL fsJL d-flex justify-content-between align-items-end no_break fs_jip">
                      <div className="inWordsJL">
                        <div className=" py-1 px-1">
                          In Words Indian Rupees
                        </div>
                        {/* <div className="fw-bold py-2 px-1">{inWords}</div> */}
                        <div className="fw-bold py-2 px-1">
                        { toWords?.convert(+((((result?.mainTotal?.total_amount)/(result?.header?.CurrencyExchRate)) +  result?.header?.AddLess + result?.allTaxesTotal)?.toFixed(2)))} Only
                        </div>
                      </div>
                      <div className="footerTotJL">
                        <div className="brJL">
                          <div className="d-flex flex-column justify-content-between px-1">
                            {result?.allTaxes?.map((e, i) => {
                              return (
                                <div className="d-flex justify-content-between px-1" key={i} >
                                  <div className="w-50 d-flex justify-content-end align-items-center pe-1 brrJL" style={{lineHeight:'19px'}}>
                                    {e?.name} {e?.per}
                                  </div>
                                  <div className="w-50 d-flex justify-content-end align-items-center " style={{lineHeight:'19px'}}>
                                    {formatAmount(e?.amount)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="d-flex justify-content-between px-1 pb-1 fs_jip">
                            <div className="w-50 d-flex justify-content-end align-items-center pe-1 brrJL">
                              { result?.header?.AddLess > 0 ? 'Add' : 'Less' }
                            </div>
                            <div className="w-50 d-flex justify-content-end align-items-center pe-1 ">
                              {formatAmount(result?.header?.AddLess)}
                            </div>
                          </div>
                        </div>
                        <div className="d-flex justify-content-between px-1 grandTotalJL">
                          <div className="fw-bold w-50 d-flex align-items-center justify-content-end  pe-1 brrJL tot_jip" > Grand Total </div>
                          <div className="fw-bold w-50 d-flex align-items-center justify-content-end pe-1 tot_jip" >
                             {formatAmount(((result?.mainTotal?.total_amount/result?.header?.CurrencyExchRate) + result?.allTaxesTotal + result?.header?.AddLess))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="noteJL fw-bold p-1 no_break"
                      
                      dangerouslySetInnerHTML={{
                        __html: headerData?.Declaration,
                      }}
                    ></div>
                    <div className="border mt-1 fs_jip d-flex align-items-start position-relative">
                      <div style={{width:'33.33%'}} className="p-1 ">
                        <div className="fw-bold">Bank Detail</div>
                        <div>Bank Name : {result?.header?.bankname}</div>
                        <div>Branch : {result?.header?.bankaddress}</div>
                        <div>Account Name : {result?.header?.accountname}</div>
                        <div>Account No : {result?.header?.accountnumber}</div>
                        <div>RTGS/NEFT IFSC : {result?.header?.rtgs_neft_ifsc}</div>
                      </div>
                      <div style={{width:'33.33%', minHeight:'80px'}} className="p-1 d-flex justify-content-between align-items-start flex-column h-100">
                        <div className="mt-1">Signature</div>
                        <div className="fw-bold mb-2">{result?.header?.customerfirmname}</div>
                      </div>
                      <div style={{width:'33.33%', minHeight:'80px'}} className="p-1 d-flex justify-content-between align-items-start flex-column h-100">
                        <div className="mt-1">Signature</div>
                        <div className="fw-bold mb-2">{headerData?.CompanyFullName}</div>
                      </div>

                      <div className="position-absolute top-0 h-100" style={{width: "1px", background: "#DDDD", left: "33.33%"}}></div>
                      <div className="position-absolute top-0 h-100" style={{width: "1px", background: "#DDDD", right: "33.33%"}}></div>
                    </div>
                    {/* <div
                      className="dynamicHeadJLmain no_break"
                      style={{ marginTop:"2px", marginBottom:"2rem" }}
                    >
                      <div className="dynamicHeadJL1">
                        <div className="fslhJL fw-bold">Bank Detail</div>
                        <div className="fslhJL">
                          <b className="JL13 fw-normal">
                            Bank Name : {headerData?.bankname}
                          </b>
                        </div>
                        <div className="fslhJL">
                          BRANCH: {headerData?.bankaddress}
                        </div>
                        <div className="fslhJL">
                          Account Name : {headerData?.accountname}
                        </div>
                        <div className="fslhJL">
                          Account Number : {headerData?.accountnumber}
                        </div>
                        <div className="fslhJL">
                          RTGS/NEFT IFSC:{headerData?.rtgs_neft_ifsc}
                        </div>
                        <div className="fslhJL"></div>
                      </div>
                      <div className="dynamicHeadJL2D">
                        <div className="mt-1">Signature</div>
                        <div className="fw-bold mb-2">{headerData?.customerfirmname}</div>
                      </div>
                      <div className="dynamicHeadJL3D ">
                        <div>Signature</div>
                        <div className="fw-bold">{headerData?.CompanyFullName}</div>
                      </div>
                    </div> */}
                  </div>
                </div>
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

export default JewelleryInvoicePrint;
