/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "../../assets/css/prints/summary1.css";
import {
  apiCall,
  CapitalizeWords,
  checkMsg,
  FooterComponent,
  formatAmount,
  handleImageError,
  HeaderComponent,
  isObjectEmpty,
  NumberWithCommas,
  SubheaderComponent,
  taxGenrator,
} from "../../GlobalFunctions";
import convertor, { toWords } from "number-to-words";
import Button from "../../GlobalFunctions/Button";
import Loader from "../../components/Loader";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";
import { ToWords } from "to-words";
import { NumToWord } from './../../GlobalFunctions/NumToWord';

const Summary1 = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
  const toWords = new ToWords();
  const [headerData, setHeaderData] = useState({});
  const [subHeaderData, setSubHeaderData] = useState({});
  const [footerComponent, setFooterComponent] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [dynamicList1, setDynamicList1] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [dynamicList2, setDynamicList2] = useState([]);
  const [mainTotal, setMainTotal] = useState({});
  const [resultArray, setAesultArray] = useState([]);
  const [totalgrosswt, setTotalgrosswt] = useState(0);
  const [totalnetlosswt, setTotalnetlosswt] = useState(0);
  const [totalLabourAmount, setTotalLabourAmount] = useState(0);
  const [totalOtherAmount, setTotalOtherAmount] = useState(0);
  const [TotalAmount, setTotalAmount] = useState(0);
  const [inWords, setInWords] = useState("");
  const [summaryDetail, setSummaryDetail] = useState({});
  const [mainObj, setMainObj] = useState("");
  const [taxTotal, setTaxTotal] = useState([]);
  const [finalAmount, setFinalAmount] = useState(0);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const [headerComp, setHeaderComp] = useState(null);
  const [isImageWorking, setIsImageWorking] = useState(true);
  const [result, setResult] = useState(null);
  const handleImageErrors = () => {
    setIsImageWorking(false);
  };
  const organizeData = (headerDatas, arr1, arr2) => {
    let totgrosswt = 0;
    let totnetlosswt = 0;
    let totallbrAmt = 0;
    let totalOtherAmt = 0;
    let totAmount = 0;
    let mainTotal = {
      diamonds: {
        Wt: 0,
        Pcs: 0,
        Rate: 0,
        Amount: 0,
      },
      colorstone: {
        Wt: 0,
        Pcs: 0,
        Rate: 0,
        Amount: 0,
      },
      metal: {
        Wt: 0,
        Pcs: 0,
        Rate: 0,
        Amount: 0,
      },
      misc: {
        Wt: 0,
        Pcs: 0,
        Rate: 0,
        Amount: 0,
      },
      finding: {
        Wt: 0,
        Pcs: 0,
        Rate: 0,
        Amount: 0,
      },
      totalnetwt: {
        netwt: 0,
      },
      totalgrosswt: {
        grosswt: 0,
      },
    };
    let resultArr = [];
    // eslint-disable-next-line array-callback-return
    arr1?.map((e, i) => {
      let diamonds = [];
      let colorstone = [];
      let metal = [];
      let misc = [];
      let finding = [];
      let totals = {
        diamonds: {
          Wt: 0,
          Pcs: 0,
          Rate: 0,
          Amount: 0,
        },

        colorstone: {
          Wt: 0,
          Pcs: 0,
          Rate: 0,
          Amount: 0,
        },

        metal: {
          Wt: 0,
          Pcs: 0,
          Rate: 0,
          Amount: 0,
        },

        misc: {
          Wt: 0,
          Pcs: 0,
          Rate: 0,
          Amount: 0,
        },

        finding: {
          Wt: 0,
          Pcs: 0,
          Rate: 0,
          Amount: 0,
        },

        labour: {
          labourAmount: 0,
        },

        OtherCh: {
          OtherAmount: 0,
        },
      };

      totgrosswt += e?.grosswt;

      totnetlosswt = totnetlosswt + +e?.NetWt + +e?.LossWt;
      totals.labour.labourAmount = totals.labour.labourAmount + e?.MakingAmount;
      totals.OtherCh.OtherAmount =
        totals.OtherCh.OtherAmount + e?.OtherCharges + e?.MiscAmount;

      totallbrAmt += e?.MakingAmount;
      totalOtherAmt += e?.OtherCharges + e?.MiscAmount;

      totAmount += e?.TotalAmount;

      // eslint-disable-next-line array-callback-return
      arr2?.map((ele, ind) => {
        if (e.SrJobno === ele?.StockBarcode) {
          if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
            diamonds.push(ele);
            totals.diamonds.Wt += ele?.Wt;
            totals.diamonds.Pcs += ele?.Pcs;
            totals.diamonds.Rate += ele?.Rate;
            totals.diamonds.Amount += ele?.Amount;
            mainTotal.diamonds.Wt += ele?.Wt;
            mainTotal.diamonds.Pcs += ele?.Pcs;
            mainTotal.diamonds.Rate += ele?.Rate;
            mainTotal.diamonds.Amount += ele?.Amount;
          }
          if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
            colorstone.push(ele);
            totals.colorstone.Wt += ele?.Wt;
            totals.colorstone.Pcs += ele?.Pcs;
            totals.colorstone.Rate += ele?.Rate;
            totals.colorstone.Amount += ele?.Amount;
            mainTotal.colorstone.Wt += ele?.Wt;
            mainTotal.colorstone.Pcs += ele?.Pcs;
            mainTotal.colorstone.Rate += ele?.Rate;
            mainTotal.colorstone.Amount += ele?.Amount;
          }
          if (ele?.MasterManagement_DiamondStoneTypeid === 3) {
            misc.push(ele);
            totals.misc.Wt += ele?.Wt;
            totals.misc.Pcs += ele?.Pcs;
            totals.misc.Rate += ele?.Rate;
            totals.misc.Amount += ele?.Amount;
            mainTotal.misc.Wt += ele?.Wt;
            mainTotal.misc.Pcs += ele?.Pcs;
            mainTotal.misc.Rate += ele?.Rate;
            mainTotal.misc.Amount += ele?.Amount;
          }
          if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
            metal.push(ele);
            totals.metal.Wt += ele?.Wt;
            totals.metal.Pcs += ele?.Pcs;
            totals.metal.Rate += ele?.Rate;
            totals.metal.Amount += ele?.Amount;
            mainTotal.metal.Wt += ele?.Wt;
            mainTotal.metal.Pcs += ele?.Pcs;
            mainTotal.metal.Rate += ele?.Rate;
            mainTotal.metal.Amount += ele?.Amount;
          }
          if (ele?.MasterManagement_DiamondStoneTypeid === 5) {
            finding.push(ele);
            totals.finding.Wt += ele?.Wt;
            totals.finding.Pcs += ele?.Pcs;
            totals.finding.Rate += ele?.Rate;
            totals.finding.Amount += ele?.Amount;
            mainTotal.finding.Wt += ele?.Wt;
            mainTotal.finding.Pcs += ele?.Pcs;
            mainTotal.finding.Rate += ele?.Rate;
            mainTotal.finding.Amount += ele?.Amount;
          }
        }
      });

      let obj = { ...e };
      obj.otherMisc = e?.OtherCharges + e?.MiscAmount;
      obj.diamonds = diamonds;
      obj.colorstone = colorstone;
      obj.metal = metal;
      obj.misc = misc;
      obj.finding = finding;
      obj.totals = totals;
      let sumoflbr = e?.MakingAmount;
      obj.LabourAmountSum = sumoflbr;
      let sumofOth = e?.OtherCharges + e?.MiscAmount;
      obj.OtherChargeAmountSum = sumofOth;
      resultArr?.push(obj);

      let head = HeaderComponent(headerDatas?.HeaderNo, headerDatas);
      setHeaderComp(head);

      let subhead = SubheaderComponent(headerDatas?.HeaderNo, headerDatas);
      setSubHeaderData(subhead);

      let footerComp = FooterComponent(headerDatas?.HeaderNo, headerDatas);
      setFooterComponent(footerComp);
    });

    let allTax = taxGenrator(headerDatas, totAmount);

    allTax?.length > 0 &&
      allTax?.forEach((e) => {
        totAmount += +e?.amount;
      });
    totAmount += headerDatas?.AddLess;

    setFinalAmount(totAmount);
    setTaxTotal(allTax);

    let words = CapitalizeWords(convertor?.toWords(Math?.round(totAmount)));
    setInWords(words);
    setTotalAmount(totAmount);
    setAesultArray(resultArr);
    setMainTotal(mainTotal);
    setTotalgrosswt(totgrosswt);
    setTotalnetlosswt(totnetlosswt);
    setTotalLabourAmount(totallbrAmt);
    setTotalOtherAmount(totalOtherAmt);

    const array1 = resultArr?.slice(0, 12);
    const array2 = resultArr?.slice(12);
    let newObj = {
      first: array1,
      second: array2,
      mainTotal: mainTotal,
    };

    setMainObj(newObj);
  };

  async function loadData(data) {
    try {
      setHeaderData(data?.BillPrint_Json[0]);
      setDynamicList1(data?.BillPrint_Json1);
      setDynamicList2(data?.BillPrint_Json2);
      organizeData(
        data?.BillPrint_Json[0],
        data?.BillPrint_Json1,
        data?.BillPrint_Json2
      );

      let address = data?.BillPrint_Json[0]?.Printlable?.split("\r\n");
      data.BillPrint_Json[0].address = address;

      const datas = OrganizeDataPrint(
        data?.BillPrint_Json[0],
        data?.BillPrint_Json1,
        data?.BillPrint_Json2
      );
      setResult(datas);
      let suminfo = [];
      datas?.resultArray?.forEach((e, i) => {
        let findrec = suminfo?.findIndex(
          (el) =>
            el?.Categoryname === e?.Categoryname &&
            el?.SubCategoryname === e?.SubCategoryname
        );
        if (findrec === -1) {
          let obj = { ...e };
          obj.count = e?.Quantity;
          suminfo.push(obj);
        } else {
          suminfo[findrec].count += e?.Quantity;
        }
      });

      setSummaryDetail(suminfo);

      // countCategorySubCategory(data?.BillPrint_Json1);
      setLoader(false);
    } catch (error) {
      console.log(error);
    }
  }

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

  const findKeyValuePair = (array, firstName, secondName) => {
    const counts = {};
    array?.forEach((item) => {
      const key = `${item[firstName]} | ${item[secondName]}`;
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  };

  // const countCategorySubCategory = (data) => {
  //   let countArr = findKeyValuePair(data, "Categoryname", "SubCategoryname");
  //   Object?.keys(countArr)?.forEach((key) => {
  //     const [category, subcategory] = key.split("|");
  //     if (!subcategory) {
  //       delete countArr[category];
  //     }
  //   });

  //   const countsArray = Object?.entries(countArr)
  //     .filter(([key, value]) => key?.includes("|")) // Filter out single category entries
  //     .map(([key, value]) => ({ name: key, value }));

  //   setSummaryDetail(countsArray);

  //   let arr1 = countsArray?.slice(0, 3);
  //   let arr2 = countsArray?.slice(3, 6);
  //   let arr3 = countsArray?.slice(6, 9);
  //   let arr4 = countsArray?.slice(9, 12);
  //   let obj = {
  //     firstArr: arr1,
  //     secondArr: arr2,
  //     thirdArr: arr3,
  //     fourthArr: arr4,
  //   };
  //   setSummaryDetail(obj);
  // };

  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <>
          {msg === "" ? (
            <>
              <div className="summary1PrintSum1 pad_60_allPrint mt-4">
                <div className="summary1allf container_summary1">
                  <div className="btnpcl pb-5">
                    <Button />
                  </div>
                  <div>
                    <table className="w-100">
                      <thead>
                        <tr>
                          <td className="w-100">
                            <div className="headlinerti">
                              {result?.header?.PrintHeadLabel}
                            </div>
                            <div className="headrti border-bottom fsrtis1">
                              <div>
                                <div className="fw-bold custss1fs">
                                  {result?.header?.CompanyFullName}
                                </div>
                                <div>
                                  { result?.header?.CompanyAddress?.split( "," )[0] }
                                </div>
                                <div>
                                  {result?.header?.CompanyCity} -{" "}
                                  {result?.header?.CompanyPinCode},{" "}
                                  {result?.header?.CompanyState} (
                                  {result?.header?.CompanyCountry})
                                </div>
                                <div> T {result?.header?.CompanyTellNo} | TOLL FREE{" "} {result?.header?.CompanyTollFreeNo} </div>
                                <div>
                                  {result?.header?.CompanyEmail} |{" "}
                                  {result?.header?.CompanyWebsite}
                                </div>
                              </div>
                              <div className="pe-4">
                                {" "}
                                {isImageWorking &&
                                  result?.header?.PrintLogo !== "" && (
                                    <img
                                      src={result?.header?.PrintLogo}
                                      alt=""
                                      className="w-100 h-auto my-0 mx-auto d-block object-fit-contain"
                                      style={{ minHeight: "75px", minWidth: "115px", maxWidth: "117px", maxHeight: "75px", }}
                                      onError={handleImageErrors}
                                      height={120}
                                      width={150}
                                    />
                                  )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                          <div className="border mt-1 d-flex justify-content-between px-1">
                      <div className="w-75 custss1fs2">
                        <div className="d-flex ">
                          <div className="fw-bold">INVOICE# : </div>
                          <div>&nbsp; {result?.header?.InvoiceNo}</div>
                        </div>
                      </div>
                      <div className="w-25 custss1fs2">
                        <div className="w-100">
                          <div className="d-flex align-items-center w-100">
                            <div className="w-50 fw-bold d-flex justify-content-end align-items-center pe-2">
                              DATE :{" "}
                            </div>
                            <div className="w-50">
                              {result?.header?.EntryDate}
                            </div>
                          </div>
                          <div className="d-flex align-items-center w-100">
                            <div className="w-50 fw-bold d-flex justify-content-end align-items-center pe-2">
                              {result?.header?.HSN_No_Label} :{" "}
                            </div>
                            <div className="w-50">{result?.header?.HSN_No}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                          <div className="border border-top-0 p-1 fsrtis1">
                      <div className="fw-bold custss1fs">
                        {result?.header?.customerfirmname}
                      </div>
                      <div className="">{result?.header?.customerstreet}</div>
                      <div className="">{result?.header?.customerregion}</div>
                      <div className="">{result?.header?.customercity}</div>
                      <div className="">{result?.header?.customermobileno}</div>
                      <div className="">
                        { result?.header?.CustGstNo === '' ? 'VAT' : 'GSTIN' } - { result?.header?.Cust_VAT_GST_No === '' ?  result?.header?.Cust_VAT_GST_No : result?.header?.Cust_VAT_GST_No} |{" "}
                        {result?.header?.Cust_CST_STATE} -{" "}
                        {result?.header?.Cust_CST_STATE_No} | PAN - {" "} {result?.header?.CustPanno}
                      </div>
                    </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                          <div className="subheadrti pt-3 fsrti">
                      {/* <div className='subheadrti1 fsrti'>
                <div className='d-flex'><div className='w-50 fw-bold'>BILL NO</div><div className='w-50'>{result?.header?.InvoiceNo}</div></div>
                <div className='d-flex'><div className='w-50 fw-bold'>DATE</div><div className='w-50'>{result?.header?.EntryDate}</div></div>
                <div className='d-flex'><div className='w-50 fw-bold'>{result?.header?.HSN_No_Label}</div><div className='w-50'>{result?.header?.HSN_No}</div></div>
              </div> */}
                    </div>
                          </td>
                        </tr>
                        <tr><td>
                        <div className="tableSectionSum1">
                    <div className="theadsum1 fsrtis1">
                      <div className="wthsum1 srwsum1">SR#</div>
                      <div className="wthsum1 designwsum1">DESIGNS / CODE</div>
                      <div className="wthsum1">METAL</div>
                      <div className="wthsum1">GWT</div>
                      <div className="wthsum1">NWT</div>
                      <div className="wthsum1">DPCS</div>
                      <div className="wthsum1">DWT</div>
                      <div className="wthsum1">CSPCS</div>
                      <div className="wthsum1">CSWT.</div>
                      <div className="wthsum1">OTHER</div>
                      <div className="wthsum1 brightsum1">TOTAL</div>
                    </div>
                    {result?.resultArray?.map((e, i) => {
                      return (
                        <div key={i} className="pgbia">
                          <div className="tbodysum1 fsrtis1 ">
                            <div className="wtbsum1 srwsum1" style={{ fontSize: "11px" }} >
                              {i + 1}
                            </div>
                            <div className="wtbsum1 designwsum1 d-flex justify-content-around p-1">
                              <div>
                                <img src={e?.DesignImage} alt="#summary1" id="imgDySum1" onError={handleImageError} />
                              </div>
                              <div className="designContentsum1">
                                <p className="brbdesignsum1 fsrtis1 text-break" style={{ fontWeight: "bold", textAlign: "center", paddingBottom: "4px", lineHeight: "8px", fontSize: "11px", }} >
                                  {e?.designno}
                                </p>
                                <p className="brbdesignsum1 brbs1 fsrtis1" style={{ fontSize: "11px" }} >
                                  {e?.SrJobno}
                                </p>
                              </div>
                            </div>
                            <div className="wtbsum1 alignleftsum1  ps-1">
                              {e?.MetalTypePurity}
                            </div>
                            <div className="wtbsum1 alignrightsum1 pe-1">
                              {e?.grosswt?.toFixed(3)}
                            </div>
                            <div className="wtbsum1 alignrightsum1 pe-1">
                              {(e?.totals?.metal?.IsPrimaryMetal)?.toFixed(3)}
                              {/* {(e?.NetWt + e?.LossWt)?.toFixed(3)} */}
                            </div>
                            <div className="wtbsum1 alignrightsum1 pe-1">
                              {e?.totals?.diamonds?.Pcs}
                            </div>
                            <div className="wtbsum1 alignrightsum1 pe-1">
                              {e?.totals?.diamonds?.Wt?.toFixed(3)}
                            </div>
                            <div className="wtbsum1 alignrightsum1 pe-1">
                              {e?.totals?.colorstone?.Pcs}
                            </div>
                            <div className="wtbsum1 alignrightsum1 pe-1">
                              {e?.totals?.colorstone?.Wt?.toFixed(3)}
                            </div>
                            <div className="wtbsum1 alignrightsum1 pe-1">
                              {/* {NumberWithCommas(e?.otherMisc, 2)} */}
                              {e?.OtherCharges + e?.TotalDiamondHandling + e?.MiscAmount === 0.0 ? "" : 
                              formatAmount( ((e?.OtherCharges + e?.TotalDiamondHandling + e?.MiscAmount)/(result?.header?.CurrencyExchRate)) )}
                            </div>
                            <div className="wtbsum1 brightsum1 alignrightsum1 pe-1 fsrtis1">
                              <p className="fsrtis1" dangerouslySetInnerHTML={{ __html: headerData?.Currencysymbol, }} ></p>
                              {/* {NumberWithCommas(e?.TotalAmount, 2)} */}
                              {formatAmount((e?.TotalAmount/(result?.header?.CurrencyExchRate)))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                      </div></td></tr>
                  <tr>
                    <td>
                    <div className="secondheadsum1 ">
                    <div className="secondtbodysum1"></div>
                    <div>
                      <div className="tbodysum1second">
                        <div className="wtbsum1 wtotalsum1 htotalrowsum1">
                          <b className="totrowfssum1 fsrtis1">TOTAL</b>
                        </div>
                        <div className="wtbsum1 htotalrowsum1 alignrightsum1">
                          <b className="totrowfssum1 pe-1 fsrtis1">
                            {result?.mainTotal?.grosswt?.toFixed(3)}
                          </b>
                        </div>
                        <div className="wtbsum1 htotalrowsum1 alignrightsum1">
                          <b className="totrowfssum1 pe-1 fsrtis1">
                            {/* {totalnetlosswt?.toFixed(3)} */}
                            {/* {(formatAmount(result?.mainTotal?.metal?.IsPrimaryMetal + result?.mainTotal?.lossWt))} */}
                            {/* {( result?.mainTotal?.netwt + result?.mainTotal?.lossWt )?.toFixed(3)} */}
                            {((result?.mainTotal?.metal?.IsPrimaryMetal )?.toFixed(3))}
                          </b>
                        </div>
                        <div className="wtbsum1 htotalrowsum1 alignrightsum1">
                          <b className="totrowfssum1 pe-1 fsrtis1">
                            {result?.mainTotal?.diamonds?.Pcs}
                          </b>
                        </div>
                        <div className="wtbsum1 htotalrowsum1 alignrightsum1">
                          <b className="totrowfssum1 pe-1 fsrtis1">
                            {result?.mainTotal?.diamonds?.Wt?.toFixed(3)}
                          </b>
                        </div>
                        <div className="wtbsum1 htotalrowsum1 alignrightsum1">
                          <b className="totrowfssum1 pe-1 fsrtis1">
                            {result?.mainTotal?.colorstone?.Pcs}
                          </b>
                        </div>
                        <div className="wtbsum1 htotalrowsum1 alignrightsum1">
                          <b className="totrowfssum1 pe-1 fsrtis1">
                            {result?.mainTotal?.colorstone?.Wt?.toFixed(3)}
                          </b>
                        </div>
                        <div className="wtbsum1 htotalrowsum1 alignrightsum1">
                          <b className="totrowfssum1 pe-1 fsrtis1">
                            {/* {NumberWithCommas(totalOtherAmount, 2)} */}
                            {formatAmount(
                              ((result?.mainTotal?.total_other +
                                result?.mainTotal?.total_diamondHandling +
                                result?.mainTotal?.totalMiscAmount)/(result?.header?.CurrencyExchRate))
                            )}
                          </b>
                        </div>
                        <div className="wtbsum1 brightsum1 htotalrowsum1 alignrightsum1">
                          <b className="totrowfssum1 d-flex align-items-center pe-1 fsrtis1">
                            <p
                              dangerouslySetInnerHTML={{
                                __html: headerData?.Currencysymbol,
                              }}
                            ></p>
                            {/* {NumberWithCommas(TotalAmount, 2)} */}
                            &nbsp;
                            {formatAmount(((result?.mainTotal?.total_amount)/(result?.header?.CurrencyExchRate)))}
                          </b>
                        </div>
                      </div>
                      <div className="totaldesignsum1">
                        {result?.allTaxes?.length > 0 &&
                          result?.allTaxes?.map((e, i) => {
                            return (
                              <div className="d-flex justify-content-between fsrtis1" style={{ width: "27%" }} key={i} >
                                <div className="w-50 d-flex justify-content-end " style={{ borderLeft: "1px solid #e8e8e8" }} >
                                  {e?.name} {e?.per}
                                </div>
                                <div className="w-50 d-flex justify-content-end  pe-1">
                                  {/* {NumberWithCommas(e?.amount, 2)} */}
                                  {formatAmount(e?.amount)}
                                </div>
                              </div>
                            );
                          })}

                        <div className="d-flex justify-content-between wtotsum1 fsrtis1">
                          <p className="totgstsum1 gsttotsum1 fw-bold fsrtis1">
                            {result?.header?.AddLess > 0 ? "ADD" : "Less"}
                          </p>
                          <p className="totgstsum1 fw-bold pb-1 pe-1 fsrtis1">
                            {(result?.header?.AddLess/(result?.header?.CurrencyExchRate))?.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="grandtotalsum1">
                        {/* <div className="amtwordssum1 px-2">{inWords}</div> */}
                        <div className="amtwordssum1 px-2 fsrtis1">
                          {NumToWord(((result?.mainTotal?.total_amount/(result?.header?.CurrencyExchRate)) +
                              result?.allTaxesTotal +
                              result?.header?.AddLess))}
                          {/* {toWords?.convert(
                            +(
                              (result?.mainTotal?.total_amount/(result?.header?.CurrencyExchRate)) +
                              result?.allTaxesTotal +
                              result?.header?.AddLess
                            )?.toFixed(2)
                          )} */}
                        </div>
                        <div className="amtwordssum1 wtotsum1 d-flex align-items-center justify-content-end wgtsum1">
                          <div className="d-flex justify-content-end w-50 fsrtis1 text-break">
                            Grand Total :
                          </div>
                          <div className="d-flex justify-content-end w-50  pe-1 fsrtis1">
                            <p
                              dangerouslySetInnerHTML={{
                                __html: result?.header?.Currencysymbol,
                              }}
                            ></p>
                            {/* {NumberWithCommas(finalAmount, 2)} */}
                            {formatAmount(
                              (result?.mainTotal?.total_amount/(result?.header?.CurrencyExchRate)) +
                                result?.allTaxesTotal +
                                result?.header?.AddLess
                            )} /-
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="summarysum1 pgbia">
                      <div className="summarysum1fs fw-bold fsrtis1 ps-2">
                        Summary Detail
                      </div>
                      <div className="summaryDetailsum1">
                        {/* <div className="wsummarySum1 d-flex flex-wrap"> */}
                        <div className=" d-flex flex-wrap p-1">
                          {summaryDetail?.map((e, i) => {
                            return (
                              // <div key={i} className="d-flex arrSum1">
                              <div key={i} className="d-flex arrSum1 w-25 pe-2">
                                <div
                                  className="summwsum1 fs13sum1 fw-normal fsrtis1 text-break"
                                  style={{ width: "70%", lineHeight: "9px" }}
                                >
                                  {e?.Categoryname} | {e?.SubCategoryname}
                                </div>
                                <div
                                  className="summwsum1 fs13sum1 fsrtis1"
                                  style={{ width: "10%" }}
                                >
                                  :
                                </div>
                                <div
                                  className="summwsum1 fs13sum1 fsrtis1"
                                  style={{ width: "20%" }}
                                >
                                  {e?.count}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {/* <div className="wsummarySum1">
                          {summaryDetail?.secondArr?.map((e, i) => {
                            return (
                              <div className="d-flex arrSum1" key={i}>
                                <div className="summwsum1 fs13sum1" style={{ width: "60%" }} >
                                  {e?.name}
                                </div>
                                <div className="summwsum1 fs13sum1" style={{ width: "20%" }} >
                                  :
                                </div>
                                <div className="summwsum1 fs13sum1" style={{ width: "20%" }} >
                                  {e?.value}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="wsummarySum1">
                          {summaryDetail?.thirdArr?.map((e, i) => {
                            return (
                              <div className="d-flex arrSum1" key={i}>
                                <div className="summwsum1 fs13sum1" style={{ width: "60%" }} >
                                  {e?.name}
                                </div>
                                <div className="summwsum1 fs13sum1" style={{ width: "20%" }} >
                                  :
                                </div>
                                <div className="summwsum1 fs13sum1" style={{ width: "20%" }} > {e?.value} </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="wsummarySum1">
                          {summaryDetail?.fourthArr?.map((e, i) => {
                            return (
                              <div className="d-flex arrSum1" key={i}>
                                <div className="summwsum1 fs13sum1" style={{ width: "60%" }} >
                                  {e?.name}
                                </div>
                                <div className="summwsum1 fs13sum1" style={{ width: "20%" }} >
                                  :
                                </div>
                                <div className="summwsum1 fs13sum1" style={{ width: "20%" }} >
                                  {e?.value}
                                </div>
                              </div>
                            );
                          })}
                        </div> */}
                      </div>
                    </div>
                    <div className="notessum1 p-1 fsrtis1 pgbia">
                      <div className="noteSum1 fsrtis1">NOTE :</div>
                      <div
                        className="noteDemosum1 fsrtis1"
                        dangerouslySetInnerHTML={{
                          __html: headerData?.Declaration,
                        }}
                      ></div>
                    </div>
                    <div className="remarkSum1 fsrtis1">
                      REMARKS IF ANY :
                      <p
                        className="remarkValSum1 fsrtis1"
                        dangerouslySetInnerHTML={{
                          __html: headerData?.PrintRemark,
                        }}
                      ></p>{" "}
                    </div>
                  </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                    <div className="w-100 border mt-1 fw-bold d-flex fsrtis1 pgbia">
                    {/* {footerComponent} */}
                    <div className="w-50 border-end minhs1 d-flex justify-content-center align-items-end">
                      {" "}
                      RECEIVER's NAME & SIGNATURE
                    </div>
                    <div className="w-50 d-flex justify-content-center align-items-end">
                      for, {result?.header?.CompanyFullName}
                    </div>
                  </div>
                    </td>
                  </tr>
                      </tbody>
                    </table>
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

export default Summary1;
