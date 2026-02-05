// http://localhost:3000/?tkn=OTA2NTQ3MTcwMDUzNTY1MQ==&invn=U0syMDYyMjAyNA==&evn=c2FsZQ==&pnm=aW52b2ljZSBwcmludCBk&up=aHR0cDovL3plbi9qby9hcGktbGliL0FwcC9TYWxlQmlsbF9Kc29u&ctv=NzE=&ifid=PackingList3&pid=undefined
import React, { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import style from "../../assets/css/prints/InvoicePrint_10_11.module.css";
import {
  FooterComponent,
  HeaderComponent,
  NumberWithCommas,
  apiCall,
  checkMsg,
  fixedValues,
  handlePrint,
  isObjectEmpty,
  taxGenrator,
} from "../../GlobalFunctions";
import { ToWords } from "to-words";
import footerStyle from "../../assets/css/footers/footer2.module.css";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";
import { cloneDeep } from "lodash";
import "../../assets/css/prints/InvoicePrintD.scss";

const InvoicePrintD = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
  const [loader, setLoader] = useState(true);
  const [msg, setMsg] = useState("");
  const [data, setData] = useState([]);
  const [otherMaterial, setOtherMaterial] = useState([]);
  const [header, setHeader] = useState(null);
  const [headerss, setHeaderss] = useState(null);
  const [footer, setFooter] = useState(null);
  const [headerData, setHeaderData] = useState({});
  const [customerAddress, setCustomerAddress] = useState([]);
  const [mainDatas, setMainDatas] = useState({});
  const [total, setTotal] = useState({
    total: 0,
    grandtotal: 0,
    totals: 0,
    discounttotals: 0,
  });
  // const []
  const [isImageWorking, setIsImageWorking] = useState(true);
  const handleImageErrors = () => {
    setIsImageWorking(false);
  };
  const [discount, setDiscount] = useState(0);
  const [taxes, setTaxes] = useState([]);
  const [pnm, setPnm] = useState(atob(printName).toLowerCase());
  const [totalpcsss, setTotalPcsss] = useState(0);
  const toWords = new ToWords();

  const [mainData, setMainData] = useState({
    resultArr: [],
    findings: [],
    diamonds: [],
    colorStones: [],
    miscs: [],
    otherCharges: [],
    misc2: [],
    labour: {},
    diamondHandling: 0,
  });
  const [totalss, setTotalss] = useState({
    total: 0,
    discount: 0,
    totalPcs: 0,
  });

  const loadData = (data) => {
    let head = HeaderComponent("1", data?.BillPrint_Json[0]);
    setHeader(head);
    setHeaderData(data?.BillPrint_Json[0]);
    let footers = FooterComponent("2", data?.BillPrint_Json[0]);
    setFooter(footers);

    let headersss = HeaderComponent("3", data?.BillPrint_Json[0]);
    setHeaderss(headersss);
    let custAddress = data?.BillPrint_Json[0]?.Printlable.split("\n");
    setCustomerAddress(custAddress);
    let datas = OrganizeDataPrint(
      data?.BillPrint_Json[0],
      data?.BillPrint_Json1,
      data?.BillPrint_Json2
    );
    setMainDatas(datas);
    let resultArr = [];
    let findings = [];
    let diamonds = [];
    let colorStones = [];
    let misc2 = [];
    let labour = {
      label: "LABOUR",
      primaryWt: 0,
      makingAmount: 0,
      totalAmount: 0,
    };
    let miscs = [];
    let otherCharges = [];
    let total2 = { ...totalss };
    let diamondTotal = 0;
    let colorStone1Total1 = 0;
    let colorStone2Total2 = 0;
    let misc1Total1 = 0;
    let misc2Total2 = 0;
    let diamondHandling = 0;
    let totalPcss = [];
    let jobWiseLabourCalc = 0;
    let jobWiseMinusFindigWt = 0;

    datas?.resultArray?.map((e, i) => {
      let obj = cloneDeep(e);
      let findingWt = 0;
      let findingsWt = 0;
      let findingsAmount = 0;
      let secondaryMetalAmount = 0;

      obj.primaryMetal = e?.metal?.find(
        (ele, ind) => ele?.IsPrimaryMetal === 1
      );
      e?.finding?.forEach((ele, ind) => {
        if (
          ele?.ShapeName !== obj?.primaryMetal?.ShapeName &&
          ele?.QualityName !== obj?.primaryMetal?.QualityName
        ) {
          let obb = cloneDeep(ele);
          if (obj?.primaryMetal) {
            obb.Rate = obj?.primaryMetal?.Rate;
            obb.Amount = ele?.Wt * obb?.Rate;
            findingsAmount += ele?.Wt * obb?.Rate;
          }
          findingsWt += ele?.Wt;
          findings?.push(obb);
          total2.total += obb?.Amount;
        }
        if (ele?.Supplier?.toLowerCase() === "customer") {
          findingWt += ele?.Wt;
        }
      });

      let findPcss = totalPcss?.findIndex(
        (ele, ind) => ele?.GroupJob === e?.GroupJob
      );
      
      if (findPcss === -1) {
        totalPcss?.push({ GroupJob: e?.GroupJob, value: e?.Quantity });
      } else {
        if (e?.GroupJob === "") {
          let findQuantity = totalPcss?.findIndex(
            (ele, ind) => ele?.GroupJob === ""
          );
          if (findQuantity === -1) {
            totalPcss?.push({ GroupJob: e?.GroupJob, value: e?.Quantity });
          } else {
            totalPcss[findQuantity].value += e?.Quantity;
          }
        }
      }

      let primaryWt = 0;
      let primaryMetalRAte = 0;
      let count = 0;
      let secondMetalWt = 0;
      let netWtFinal = e?.NetWt + e?.LossWt - findingsWt;

      diamondHandling += e?.TotalDiamondHandling;
      e?.metal?.forEach((ele, ind) => {
        count += 1;
        if (ele?.IsPrimaryMetal === 1) {
          primaryWt += ele?.Wt;
          if (primaryMetalRAte === 0) {
            primaryMetalRAte += ele?.Rate;
          }
        } else {
          secondaryMetalAmount += ele?.Amount;
          secondMetalWt += ele?.Wt;
        }
      });
      let latestAmount =
        (e?.MetalDiaWt - findingsWt) * primaryMetalRAte + secondaryMetalAmount;
      total2.total += latestAmount;
      let finalMetalAmount =
        (e?.MetalDiaWt -
          (e?.totals?.finding?.Wt * e?.LossPer) / 100 +
          e?.totals?.finding?.Wt) *
          primaryMetalRAte +
        secondaryMetalAmount;

      // labour.primaryWt += primaryWt;
      labour.makingAmount += e?.MakingAmount;
      labour.totalAmount +=
        e?.MakingAmount + e?.TotalDiaSetcost + e?.TotalCsSetcost;
      total2.discount += e?.DiscountAmt;
      obj.primaryWt = primaryWt;
      obj.netWtFinal = netWtFinal;
      obj.latestAmount = latestAmount;
      obj.secondaryMetalAmount = secondaryMetalAmount;
      obj.secondMetalWt = secondMetalWt;
      obj.finalMetalAmount = finalMetalAmount;
      // obj.metalAmountFinal = e?.MetalAmount - findingsAmount + secondaryMetalAmount;
      obj.metalAmountFinal = e?.totals?.metal?.Amount - findingsAmount;
      if (count <= 1) {
        primaryWt = e?.NetWt + e?.LossWt;
      }
      if (obj?.primaryMetal) {
        // total2.total +=
        //   obj?.metalAmountFinal / data?.BillPrint_Json[0]?.CurrencyExchRate;
        let findRecord = resultArr?.findIndex(
          (ele, ind) =>
            ele?.primaryMetal?.ShapeName === obj?.primaryMetal?.ShapeName &&
            ele?.primaryMetal?.QualityName === obj?.primaryMetal?.QualityName &&
            ele?.primaryMetal?.Rate === obj?.primaryMetal?.Rate
          // &&
          // obj?.GroupJob == " "
        );
        if (findRecord === -1) {
          resultArr?.push(obj);
        } else {
          resultArr[findRecord].grosswt += obj?.grosswt;
          resultArr[findRecord].NetWt += obj?.NetWt;
          resultArr[findRecord].LossWt += obj?.LossWt;
          resultArr[findRecord].primaryWt += obj?.primaryWt;
          resultArr[findRecord].primaryMetal.Pcs += obj?.primaryMetal.Pcs;
          resultArr[findRecord].primaryMetal.Wt += obj?.primaryMetal.Wt;
          resultArr[findRecord].primaryMetal.Amount += obj?.primaryMetal.Amount;
          resultArr[findRecord].netWtFinal += obj?.netWtFinal;
          resultArr[findRecord].metalAmountFinal += obj?.metalAmountFinal;
          resultArr[findRecord].secondaryMetalAmount +=
            obj?.secondaryMetalAmount;
          resultArr[findRecord].latestAmount += latestAmount;
          resultArr[findRecord].finalMetalAmount += obj?.finalMetalAmount;
          resultArr[findRecord].secondMetalWt += obj?.secondMetalWt;
        }
      }

      jobWiseLabourCalc += (e?.MetalDiaWt - findingWt) * e?.MaKingCharge_Unit;
      jobWiseMinusFindigWt += e?.MetalDiaWt - findingWt;

      e?.diamonds?.forEach((ele, ind) => {
        let findDiamond = diamonds?.findIndex(
          (elem, index) => elem?.isRateOnPcs === ele?.isRateOnPcs
        );
        diamondTotal += ele?.Amount;
        if (findDiamond === -1) {
          diamonds?.push(ele);
        } else {
          diamonds[findDiamond].Wt += ele?.Wt;
          diamonds[findDiamond].Pcs += ele?.Pcs;
          diamonds[findDiamond].Amount += ele?.Amount;
        }
      });

      e?.colorstone?.forEach((ele, ind) => {
        // total2.total += (ele?.Amount );
        let findColorStones = colorStones?.findIndex(
          (elem, index) => elem?.isRateOnPcs === ele?.isRateOnPcs
        );
        if (findColorStones === -1) {
          colorStones?.push(ele);
        } else {
          colorStones[findColorStones].Wt += ele?.Wt;
          colorStones[findColorStones].Pcs += ele?.Pcs;
          colorStones[findColorStones].Amount += ele?.Amount;
        }
        if (ele?.isRateOnPcs === 0) {
          colorStone1Total1 += ele?.Amount;
        } else {
          colorStone2Total2 += ele?.Amount;
        }
      });

      e?.misc?.forEach((ele, ind) => {
        if (ele?.isRateOnPcs === 0) {
          misc1Total1 += ele?.Amount;
        } else {
          misc2Total2 += ele?.Amount;
        }
        if (ele?.IsHSCOE !== 0) {
          let findMisc = miscs?.findIndex(
            (elem, index) => elem?.ShapeName === ele?.ShapeName
          );
          if (findMisc === -1) {
            miscs?.push(ele);
          } else {
            miscs[findMisc].Wt += ele?.Wt;
            miscs[findMisc].Pcs += ele?.Pcs;
            miscs[findMisc].Amount += ele?.Amount;
          }
          // total2.total += (ele?.Amount);
        } else if (ele?.IsHSCOE === 0) {
          // total2.total += ele?.Amount;
          let findMisc = misc2?.findIndex(
            (elem, index) => elem?.isRateOnPcs === ele?.isRateOnPcs
          );
          if (findMisc === -1) {
            misc2?.push(ele);
          } else {
            misc2[findMisc].Wt += ele?.Wt;
            misc2[findMisc].Pcs += ele?.Pcs;
            misc2[findMisc].Amount += ele?.Amount;
          }
        }
      });

      e?.other_details?.forEach((ele, ind) => {
        let findOther = otherCharges?.findIndex(
          (elem, index) => elem?.label === ele?.label
        );
        total2.total += +ele?.value;
        if (findOther === -1) {
          otherCharges?.push(ele);
        } else {
          otherCharges[findOther].value =
            +otherCharges[findOther]?.value + +ele?.value;
        }
      });
    });

    

    let finalsArr = [];
    let mainJobs = {};
    
    
    resultArr.forEach((item) => {
      if (item.SrJobno === item.GroupJob && item.GroupJob !== "") {
        mainJobs[item.SrJobno] = { ...item }; 
      }
    });

    resultArr.forEach((e, i) => {
      let finalMetalWt =
        e?.MetalDiaWt -
        (e?.totals?.finding?.Wt * e?.LossPer) / 100 +
        e?.totals?.finding?.Wt +
        e?.secondMetalWt;
      let finalRate = e?.latestAmount / e?.netWtFinal;
      // let finalRate = e?.latestAmount / e?.netWtFinal;
      let obj = cloneDeep(e);
      obj.finalMetalWt = finalMetalWt;
      obj.finalRate = finalRate;

      
      if (e.GroupJob in mainJobs && e.SrJobno !== e.GroupJob) {
        let mainJobIndex = finalsArr.findIndex(
          (job) => job.SrJobno === e.GroupJob
        );
        if (mainJobIndex !== -1) {
          finalsArr[mainJobIndex].grosswt =
            (finalsArr[mainJobIndex].grosswt || 0) + e.grosswt;
        }
        obj.grosswt = "";
      }
      finalsArr.push(obj);
    });
    let totalPcs = totalPcss?.reduce((acc, cObj) => acc + cObj?.value, 0);
    // total2.total += labour?.totalAmount
    total2.total +=
      diamondTotal / data?.BillPrint_Json[0]?.CurrencyExchRate +
      colorStone1Total1 / data?.BillPrint_Json[0]?.CurrencyExchRate +
      colorStone2Total2 / data?.BillPrint_Json[0]?.CurrencyExchRate +
      misc1Total1 / data?.BillPrint_Json[0]?.CurrencyExchRate +
      misc2Total2 / data?.BillPrint_Json[0]?.CurrencyExchRate +
      labour?.totalAmount / data?.BillPrint_Json[0]?.CurrencyExchRate +
      diamondHandling / data?.BillPrint_Json[0]?.CurrencyExchRate;

    labour.primaryWt = jobWiseMinusFindigWt;
    finalsArr.sort((a, b) => {
      const labelA = a.MetalTypePurity.toLowerCase();
      const labelB = b.MetalTypePurity.toLowerCase();

      // Check if labels contain numbers
      const hasNumberA = /\d/.test(labelA);
      const hasNumberB = /\d/.test(labelB);

      if (hasNumberA && !hasNumberB) {
        return -1; // Label with number comes before label without number
      } else if (!hasNumberA && hasNumberB) {
        return 1; // Label without number comes after label with number
      } else {
        // Both labels have numbers or both don't, sort alphabetically
        return labelA.localeCompare(labelB);
      }
    });

    let newArr = [
      {
        label: "HANDLING",
        value: diamondHandling / data?.BillPrint_Json[0]?.CurrencyExchRate,
      },
    ];
    miscs?.forEach((e, i) => {
      let obj = cloneDeep(e);
      obj.label = obj?.ShapeName;
      obj.Amount = obj?.Amount / data?.BillPrint_Json[0]?.CurrencyExchRate;
      newArr?.push(obj);
    });
    
    otherCharges?.forEach((e, i) => {
      let obj = cloneDeep(e);
      obj.value = +obj?.value;
      newArr?.push(obj);
    });

    newArr?.sort((a, b) => {
      var regex = /(\d+)|(\D+)/g;
      var partsA = a.label.match(regex);
      var partsB = b.label.match(regex);

      for (var i = 0; i < Math.min(partsA.length, partsB.length); i++) {
        var partA = partsA[i];
        var partB = partsB[i];

        if (!isNaN(partA) && !isNaN(partB)) {
          var numA = parseInt(partA);
          var numB = parseInt(partB);
          if (numA !== numB) {
            return numA - numB;
          }
        } else {
          if (partA !== partB) {
            return partA.localeCompare(partB);
          }
        }
      }

      return a.label.length - b.label.length;
    });

    setTotalss({
      ...totalss,
      total: total2?.total,
      discount: total2?.discount,
      totalPcs: totalPcs,
    });
    setMainData({
      ...mainData,
      resultArr: finalsArr,
      findings: findings,
      diamonds: diamonds,
      colorStones: colorStones,
      miscs: miscs,
      otherCharges: newArr,
      misc2: misc2,
      labour: labour,
      diamondHandling: diamondHandling,
    });
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
            setLoader(false);
          } else {
            setLoader(false);
            setMsg("Data Not Found");
          }
        } else {
          setLoader(false);
          // setMsg(data?.Message);
          const err = checkMsg(data?.Message);
          setMsg(err);
        }
      } catch (error) {
        console.error(error);
      }
    };
    sendData();
  }, []);

  console.log('mainData ', mainData);
  return (
    <React.Fragment>
      {loader ? (
        <Loader />
      ) : (
        <>
          {msg === "" ? (
            <div className="InvoicePrintD_main">
              <div className="packingListDemo_main_App">
                <div
                  className={`d-flex justify-content-end align-items-center ${style?.print_sec_sum4} mb-4`}
                >
                  <div className={`form-check ps-3 ${style?.printBtn}`}>
                    <input
                      type="button"
                      className="btn_white blue py-2 mt-2"
                      value="Print"
                      onClick={(e) => handlePrint(e)}
                    />
                  </div>
                </div>
                {/* {headerData?.IsEinvoice !== 1 ? (
                  <>
                    <div className={`${style2.headline} headerTitle`}>
                      {headerData?.PrintHeadLabel}
                    </div>
                    <div
                      className={`${style?.font_12} ${style2.companyDetails}`}
                    >
                      <div className={`${style2.companyhead} p-2`}>
                        <div
                          className={`${style2.lines} ${style?.font_16}`}
                          style={{ fontWeight: "bold" }}
                        >
                          {headerData?.CompanyFullName}
                        </div>
                        <div className={style2.lines}>
                          {headerData?.CompanyAddress}
                        </div>
                        <div className={style2.lines}>
                          {headerData?.CompanyAddress2}
                        </div>
                        <div className={style2.lines}>
                          {headerData?.CompanyCity}-{headerData?.CompanyPinCode}
                          ,{headerData?.CompanyState}(
                          {headerData?.CompanyCountry})
                        </div>
                        <div className={style2.lines}>
                          T: {headerData?.CompanyTellNo} | TOLL FREE{" "}
                          {headerData?.CompanyTollFreeNo} | TOLL FREE{" "}
                          {headerData?.CompanyTollFreeNo}
                        </div>
                        <div className={style2.lines}>
                          {headerData?.CompanyEmail} |{" "}
                          {headerData?.CompanyWebsite}
                        </div>
                        <div className={style2.lines}>
                          {headerData?.Company_VAT_GST_No} |{" "}
                          {headerData?.Company_CST_STATE}-
                          {headerData?.Company_CST_STATE_No} | PAN-
                          {headerData?.Pannumber}
                        </div>
                      </div>
                      <div
                        style={{ width: "30%" }}
                        className="d-flex justify-content-end align-item-center h-100"
                      >
                        {isImageWorking && headerData?.PrintLogo !== "" && (
                          <img
                            src={headerData?.PrintLogo}
                            alt=""
                            className="w-100 h-auto ms-auto d-block object-fit-contain"
                            style={{ maxWidth: "116px" }}
                            onError={handleImageErrors}
                            height={120}
                            width={150}
                          />
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  headerss
                )} */}

                <div className="invoice_top_cust_address_main">
                  <div className="col-4 border-end" style={{ margin: "3px" }}>
                    <p>{headerData?.lblBillTo}</p>
                    <p className={`fw-bold pe-2 lh-1 ${style?.font_14}`}>
                      {headerData?.customerfirmname}
                    </p>
                    <p className="lh-1">{headerData?.customerAddress1}</p>
                    <p className="lh-1">{headerData?.customerAddress2}</p>
                    <p className="lh-1">
                      {" "}
                      {headerData?.customercity1}-{headerData?.PinCode}{" "}
                    </p>
                    <p className="lh-1">{headerData?.customeremail1}</p>
                    <p className="lh-1">{headerData?.vat_cst_pan}</p>
                    <p className="lh-1">
                      {headerData?.Cust_CST_STATE &&
                      headerData?.Cust_CST_STATE_No ? (
                        <>
                          {headerData?.Cust_CST_STATE} -{" "}
                          {headerData?.Cust_CST_STATE_No}
                        </>
                      ) : (
                        headerData?.Cust_CST_STATE ||
                        headerData?.Cust_CST_STATE_No ||
                        ""
                      )}
                    </p>
                  </div>
                  <div className="col-4 border-end" style={{ margin: "3px" }}>
                    <p className="lh-1">Ship To,</p>
                    <p className={`fw-bold lh-1 ${style?.font_14}`}>
                      {headerData?.customerfirmname}
                    </p>
                    {customerAddress.map((e, i) => {
                      return (
                        <p key={i} className="lh-1">
                          {e}
                        </p>
                      );
                    })}
                  </div>
                  <div className="col-4" style={{ margin: "3px" }}>
                    <div className="d-flex">
                      <div className="lh-1 fw-bold col-6">BILL NO</div>
                      <div className="lh-1 col-6">{headerData?.InvoiceNo} </div>
                    </div>
                    <div className="d-flex">
                      <div className="lh-1 fw-bold col-6">DATE</div>
                      <div className="lh-1 col-6">{headerData?.EntryDate} </div>
                    </div>

                    <div className="d-flex">
                      <div className="lh-1 fw-bold col-6">
                        {headerData?.HSN_No_Label}
                      </div>
                      <div className="lh-1 col-6">{headerData?.HSN_No} </div>
                    </div>
                    <div className="d-flex">
                      <div className="lh-1 fw-bold col-6">NAME OF GOODS</div>
                      <div className="lh-1 col-6">
                        {headerData?.NameOfGoods}{" "}
                      </div>
                    </div>
                    <div className="d-flex">
                      <div className="lh-1 fw-bold col-6">PLACE OF SUPPLY</div>
                      <div className="lh-1 col-6">
                        {headerData?.customerstate}{" "}
                      </div>
                    </div>
                    <div className="d-flex">
                      <div className="lh-1 fw-bold col-6">TERMS</div>
                      <div className="lh-1 col-6">{headerData?.DueDays} </div>
                    </div>
                  </div>
                </div>

                <div className="invod_data_mainbox">
                  <div className="invod_table_data_top_colum_div">
                    <div className="invod_table_data_top_colum_div_sub1">
                      <div className="invod_table_colum1">
                        <p>
                          <b>DESCRIPTION</b>
                        </p>
                      </div>
                    </div>
                    <div className="invod_table_data_top_colum_div_sub2">
                      <div className="invod_table_colum2">
                        <p>
                          <b>Detail</b>
                        </p>
                      </div>
                      <div className="invod_table_colum3">
                        <p>
                          <b>Gross Wt.</b>
                        </p>{" "}
                      </div>
                      <div className="invod_table_colum4">
                        <p>
                          <b>Net Wt.</b>
                        </p>{" "}
                      </div>
                      <div className="invod_table_colum5">
                        <p>
                          <b>Pcs</b>
                        </p>{" "}
                      </div>
                      <div className="invod_table_colum6">
                        <p>
                          <b>Qty</b>
                        </p>{" "}
                      </div>
                      <div className="invod_table_colum7">
                        <p>
                          <b>Rate</b>
                        </p>{" "}
                      </div>
                      <div className="invod_table_colum8">
                        <p>
                          <b>Amount</b>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="invoid_table_data_main_div">
                    <div className="invoi_table_data_col1">
                      <p className={`w-100 text-center pb-1 ${style?.font_13}`}>
                        {mainDatas?.mainTotal?.diamonds?.Pcs > 0
                          ? "DIAMOND STUDDED"
                          : "GOLD"}{" "}
                        JEWELLERY
                      </p>
                      <p className={`fw-bold ${style?.font_17}`}>
                        Total Pcs : {NumberWithCommas(totalss?.totalPcs, 0)}
                      </p>
                    </div>
                    <div className="invod_table_data_sideBar">
                        {mainData?.resultArr
                          ?.slice() // Create a shallow copy to avoid mutating original
                          ?.sort((a, b) => (b?.netWtFinal || 0) - (a?.netWtFinal || 0))
                          ?.map((e, i) => {
                        return (
                          <div className="invoi_table_data_sub_main" key={i}>
                            <div className="invoi_table_data_col2">
                              <p>
                                {e?.primaryMetal?.ShapeName}{" "}
                                {e?.primaryMetal?.QualityName}
                              </p>
                            </div>
                            <div className="invoi_table_data_col3">
                              <p>
                                {e?.grosswt === ""
                                  ? ""
                                  : `${NumberWithCommas(
                                      e?.grosswt,
                                      3
                                    )} Gms`}{" "}
                              </p>
                            </div>
                            <div className="invoi_table_data_col4">
                              <p>{NumberWithCommas(e?.netWtFinal, 3)} Gms</p>
                            </div>
                            <div className="invoi_table_data_col5">
                              <p></p>
                            </div>
                            <div className="invoi_table_data_col6">
                              <p></p>
                            </div>
                            <div className="invoi_table_data_col7">
                              <p>{NumberWithCommas(e?.finalRate, 2)}</p>
                            </div>
                            <div className="invoi_table_data_col8">
                              <p>{NumberWithCommas(e?.latestAmount, 2)}</p>
                            </div>
                          </div>
                        );
                      })}
                      {mainData?.findings?.map((e, i) => {
                        return (
                          <div className="invoi_table_data_sub_main" key={i}>
                            <div className="invoi_table_data_col2">
                              <p>
                                {e?.ShapeName} {e?.QualityName}
                              </p>
                            </div>
                            <div className="invoi_table_data_col3">
                              <p></p>
                            </div>
                            <div className="invoi_table_data_col4">
                              <p>{NumberWithCommas(e?.Wt, 3)} Gms</p>
                            </div>
                            <div className="invoi_table_data_col5">
                              <p></p>
                            </div>
                            <div className="invoi_table_data_col6">
                              <p></p>
                            </div>
                            <div className="invoi_table_data_col7">
                              <p>{NumberWithCommas(e?.Rate, 2)}</p>
                            </div>
                            <div className="invoi_table_data_col8">
                              <p>{NumberWithCommas(e?.Amount, 2)}</p>
                            </div>
                          </div>
                        );
                      })}
                      {mainData?.diamonds?.map((e, i) => {
                        return (
                          <div className="invoi_table_data_sub_main" key={i}>
                            <div className="invoi_table_data_col2">
                              <p>{e?.MasterManagement_DiamondStoneTypeName}</p>
                            </div>
                            <div className="invoi_table_data_col3">
                              <p></p>
                            </div>
                            <div className="invoi_table_data_col4">
                              <p></p>
                            </div>
                            <div className="invoi_table_data_col5">
                              <p>{NumberWithCommas(e?.Pcs, 0)}</p>
                            </div>
                            <div className="invoi_table_data_col6">
                              <p>{NumberWithCommas(e?.Wt, 3)} Ctw</p>
                            </div>
                            <div className="invoi_table_data_col7">
                              <p>
                                {e?.isRateOnPcs === 0
                                  ? e?.Wt !== 0 && (
                                      <>
                                        {NumberWithCommas(
                                          e?.Amount /
                                            e?.Wt /
                                            headerData?.CurrencyExchRate,
                                          2
                                        )}{" "}
                                        / Wt
                                      </>
                                    )
                                  : e?.Pcs !== 0 && (
                                      <>
                                        {NumberWithCommas(
                                          e?.Amount /
                                            e?.Pcs /
                                            headerData?.CurrencyExchRate,
                                          2
                                        )}{" "}
                                        / Pcs
                                      </>
                                    )}
                              </p>
                            </div>
                            <div className="invoi_table_data_col8">
                              <p>
                                {NumberWithCommas(
                                  e?.Amount / headerData?.CurrencyExchRate,
                                  2
                                )}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      {mainData?.colorStones?.map((e, i) => {
                        return (
                          <div className="invoi_table_data_sub_main" key={i}>
                            <div className="invoi_table_data_col2">
                              <p>{e?.MasterManagement_DiamondStoneTypeName}</p>
                            </div>
                            <div className="invoi_table_data_col3">
                              <p></p>
                            </div>
                            <div className="invoi_table_data_col4">
                              <p></p>
                            </div>
                            <div className="invoi_table_data_col5">
                              <p>{NumberWithCommas(e?.Pcs, 0)}</p>
                            </div>
                            <div className="invoi_table_data_col6">
                              <p>{NumberWithCommas(e?.Wt, 3)} Ctw</p>
                            </div>
                            <div className="invoi_table_data_col7">
                              <p>
                                {e?.isRateOnPcs === 0
                                  ? e?.Wt !== 0 && (
                                      <>
                                        {NumberWithCommas(
                                          e?.Amount /
                                            e?.Wt /
                                            headerData?.CurrencyExchRate,
                                          2
                                        )}{" "}
                                        / Wt
                                      </>
                                    )
                                  : e?.Pcs !== 0 && (
                                      <>
                                        {NumberWithCommas(
                                          e?.Amount /
                                            e?.Pcs /
                                            headerData?.CurrencyExchRate,
                                          2
                                        )}{" "}
                                        / Pcs
                                      </>
                                    )}
                              </p>
                            </div>
                            <div className="invoi_table_data_col8">
                              <p>
                                {NumberWithCommas(
                                  e?.Amount / headerData?.CurrencyExchRate,
                                  2
                                )}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      {mainData?.misc2?.map((e, i) => {
                        return (
                          <div className="invoi_table_data_sub_main" key={i}>
                            <div className="invoi_table_data_col2">
                              <p>OTHER MATERIAL</p>
                            </div>
                            <div className="invoi_table_data_col3">
                              <p></p>
                            </div>
                            <div className="invoi_table_data_col4">
                              <p></p>
                            </div>
                            <div className="invoi_table_data_col5">
                              <p>{NumberWithCommas(e?.Pcs, 0)}</p>
                            </div>
                            <div className="invoi_table_data_col6">
                              <p>{NumberWithCommas(e?.Wt, 3)} Gms</p>
                            </div>
                            <div className="invoi_table_data_col7">
                              <p>
                                {e?.isRateOnPcs === 0
                                  ? e?.Wt !== 0 && (
                                      <>
                                        {NumberWithCommas(
                                          e?.Amount /
                                            e?.Wt /
                                            headerData?.CurrencyExchRate,
                                          2
                                        )}{" "}
                                        / Wt
                                      </>
                                    )
                                  : e?.Pcs !== 0 && (
                                      <>
                                        {NumberWithCommas(
                                          e?.Amount /
                                            e?.Pcs /
                                            headerData?.CurrencyExchRate,
                                          2
                                        )}{" "}
                                        / Pcs
                                      </>
                                    )}
                              </p>
                            </div>
                            <div className="invoi_table_data_col8">
                              <p>
                                {NumberWithCommas(
                                  e?.Amount / headerData?.CurrencyExchRate,
                                  2
                                )}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      <div className="invoi_table_data_sub_main">
                        <div className="invoi_table_data_col2">
                          <p>{mainData?.labour?.label}</p>
                        </div>
                        <div className="invoi_table_data_col3">
                          <p></p>
                        </div>
                        <div className="invoi_table_data_col4">
                          <p></p>
                        </div>
                        <div className="invoi_table_data_col5">
                          <p></p>
                        </div>
                        <div className="invoi_table_data_col6">
                          <p></p>
                        </div>
                        <div className="invoi_table_data_col7">
                          <p>
                            {mainData?.labour?.primaryWt !== 0 &&
                              NumberWithCommas(
                                mainData?.labour?.makingAmount /
                                  mainData?.labour?.primaryWt /
                                  headerData?.CurrencyExchRate,
                                2
                              )}
                          </p>
                        </div>
                        <div className="invoi_table_data_col8">
                          <p>
                            {NumberWithCommas(
                              mainData?.labour?.totalAmount /
                                headerData?.CurrencyExchRate,
                              2
                            )}
                          </p>
                        </div>
                      </div>

                      {mainData?.otherCharges?.map((e, i) => {
                        return (
                          <>
                            {e?.label === "HANDLING" &&
                            (e?.value === 0 || e?.value === "0.00") ? (
                              ""
                            ) : (
                              <div
                                className="invoi_table_data_sub_main"
                                key={i}
                              >
                                <div className="invoi_table_data_col2">
                                  <p>{e?.label}</p>
                                </div>
                                <div className="invoi_table_data_col3">
                                  <p></p>
                                </div>
                                <div className="invoi_table_data_col4">
                                  <p></p>
                                </div>
                                <div className="invoi_table_data_col5">
                                  <p></p>
                                </div>
                                <div className="invoi_table_data_col6">
                                  <p></p>
                                </div>
                                <div className="invoi_table_data_col7">
                                  <p></p>
                                </div>
                                <div className="invoi_table_data_col8">
                                  {e?.label == "Certification_google.com" ? (
                                    <p>{NumberWithCommas(e?.Amount, 2)}</p>
                                  ) : (
                                    <p>{NumberWithCommas(e?.value, 2)}</p>
                                  )}
                                </div>
                              </div>
                            )}
                          </>
                        );
                      })}

                      {/* {mainData?.otherCharges?.map((e, i) => {
                        return (
                          <div className="invoi_table_data_sub_main" key={i}>
                            <div className="invoi_table_data_col2">
                              <p>{e?.label}</p>
                            </div>
                            <div className="invoi_table_data_col3">
                              <p></p>
                            </div>
                            <div className="invoi_table_data_col4">
                              <p></p>
                            </div>
                            <div className="invoi_table_data_col5">
                              <p></p>
                            </div>
                            <div className="invoi_table_data_col6">
                              <p></p>
                            </div>
                            <div className="invoi_table_data_col7">
                              <p></p>
                            </div>
                            <div className="invoi_table_data_col8">
                              <p>{NumberWithCommas(e?.value, 2)}</p>
                            </div>
                          </div>
                        );
                      })} */}
                    </div>
                  </div>
                  {/* total */}
                  <div
                    style={{
                      display: "flex",
                      borderTop: "1px solid #dee2e6",
                      borderRight: "1px solid #dee2e6",
                      borderLeft: "1px solid #dee2e6",
                      height: "25px",
                    }}
                  >
                    <div className="col-3 border-end d-flex align-items-center justify-content-center flex-column"></div>
                    <div className="col-9">
                      <div
                        style={{
                          display: "flex",
                          height: "100%",
                          alignItems: "center",
                        }}
                      >
                        <div className="col-2 px-1">
                          <p className={`${style?.min_height_21} fw-bold`}>
                            Total
                          </p>
                        </div>
                        <div className="col-2 px-1">
                          <p className={`${style?.min_height_21} text-end`}></p>
                        </div>
                        <div className="col-2 px-1">
                          <p className={`${style?.min_height_21} text-end`}></p>
                        </div>
                        <div className="col-1 px-1">
                          <p className={`${style?.min_height_21} text-end`}></p>
                        </div>

                        <div className="col-1 px-1">
                          <p className={`${style?.min_height_21} text-end`}></p>
                        </div>
                        <div className="col-2 px-1">
                          <p className={`${style?.min_height_21} text-end`}></p>
                        </div>
                        <div className="col-2 px-1">
                          <p
                            className={`${style?.min_height_21} text-end fw-bold`}
                          >
                            {NumberWithCommas(totalss?.total, 2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* taxes */}
                  <div className="invoicd_total_summury_main">
                    <div className="col-9 border-end"></div>
                    <div className="col-3 px-1">
                      {totalss?.discount !== 0 && (
                        <>
                          <div className="d-flex justify-content-between">
                            <p>Discount</p>
                            <p>{NumberWithCommas(totalss?.discount, 2)}</p>
                          </div>
                        </>
                      )}
                      <div className="d-flex justify-content-between">
                        <p className="fw-bold"> Total Amount </p>
                        {/* with normal charges */}
                        {/* <p className="fw-bold">
                          {NumberWithCommas(
                            mainDatas?.mainTotal?.total_amount /
                            headerData?.CurrencyExchRate,
                            2
                          )}
                        </p> */}
                        {/* with courior charges */}
                        <p className="fw-bold">
                          {NumberWithCommas(
                            (mainDatas?.mainTotal?.total_amount || 0) /
                              (headerData?.CurrencyExchRate || 1) +
                              (mainDatas?.header?.FreightCharges
                                ? mainDatas?.header?.FreightCharges
                                : 0),
                            2
                          )}
                        </p>
                        {/* <p className="fw-bold"> {NumberWithCommas(totalss?.total-totalss?.discount, 2)}</p> */}
                      </div>
                      {mainDatas?.allTaxes?.map((e, i) => {
                        return (
                          <div
                            className="d-flex justify-content-between"
                            key={i}
                          >
                            <p>
                              {e?.name} @ {e?.per}
                            </p>
                            <p>{NumberWithCommas(+e?.amount, 2)}</p>
                          </div>
                        );
                      })}
                      {headerData?.AddLess !== 0 && (
                        <div className="d-flex justify-content-between">
                          <p>{headerData?.AddLess > 0 ? "Add" : "Less"}</p>
                          <p>
                            {NumberWithCommas(
                              headerData?.AddLess /
                                headerData?.CurrencyExchRate,
                              2
                            )}
                          </p>
                        </div>
                      )}

                      <div className="d-flex justify-content-between">
                        <p>{mainDatas?.header?.ModeOfDel}</p>
                        <p>{mainDatas?.header?.FreightCharges?.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      borderBottom: "1px solid #dee2e6",
                      borderRight: "1px solid #dee2e6",
                      borderLeft: "1px solid #dee2e6",
                    }}
                  >
                    <div className="col-8 border-end px-1">
                      <p className="fw-bold"> IN Words Indian Rupees</p>
                      <p className="invod_total_font_text">
                        {toWords.convert(
                          +fixedValues(
                            mainDatas?.mainTotal?.total_amount /
                              headerData?.CurrencyExchRate +
                              mainDatas?.allTaxes?.reduce(
                                (acc, cObj) =>
                                  acc +
                                  +cObj?.amount * headerData?.CurrencyExchRate,
                                0
                              ) +
                              headerData?.AddLess +
                              headerData?.FreightCharges,
                            2
                          )
                        )}{" "}
                        Only.
                      </p>
                    </div>
                    <div className="col-4 px-1 d-flex justify-content-between align-items-center">
                      <p className="text-end fw-bold">Grand Total </p>
                      <p className="text-end fw-bold">
                        {NumberWithCommas(
                          mainDatas?.mainTotal?.total_amount /
                            headerData?.CurrencyExchRate +
                            mainDatas?.allTaxes?.reduce(
                              (acc, cObj) => acc + +cObj?.amount,
                              0
                            ) +
                            headerData?.AddLess +
                            headerData?.FreightCharges,
                          2
                        )}
                      </p>
                    </div>
                  </div>
                  <div
                    className="invod_support_line_font"
                    dangerouslySetInnerHTML={{
                      __html: headerData?.Declaration,
                    }}
                  ></div>
                  <p className="p-1 no_break">
                    <span className="fw-bold"> REMARKS :</span>{" "}
                    <span
                      dangerouslySetInnerHTML={{
                        __html: headerData?.PrintRemark,
                      }}
                    ></span>
                  </p>
                  {/* {footer} */}
                  <div className="invoicd_footer_main_class">
                    <div
                      style={{
                        width: "40%",
                        borderRight: "1px solid #e8e8e8",
                        margin: "5px",
                      }}
                    >
                      <div className="invoicd_footer_main_class_box1">
                        Bank Detail
                      </div>
                      <div className="invoicd_footer_main_class_box2">
                        Bank Name: {headerData?.bankname}
                      </div>
                      <div className="invoicd_footer_main_class_box2">
                        Branch: {headerData?.bankaddress}
                      </div>
                      <div className="invoicd_footer_main_class_box2">
                        Account Name: {headerData?.accountname}
                      </div>
                      <div className="invoicd_footer_main_class_box2">
                        Account No. : {headerData?.accountnumber}
                      </div>
                      <div className="invoicd_footer_main_class_box2">
                        RTGS/NEFT IFSC: {headerData?.rtgs_neft_ifsc}
                      </div>
                      <div className="invoicd_footer_main_class_box2">
                        Enquiry No.{" "}
                      </div>
                      <div className="invoicd_footer_main_class_box2">
                        {" "}
                        (E & OE)
                      </div>
                    </div>
                    <div
                      className={`${footerStyle.block2f3} ${style?.footers}`}
                      style={{
                        width: "30%",
                        borderRight: "1px solid #e8e8e8",
                      }}
                    >
                      <div className={`${footerStyle.linesf3} fw-normal`}>
                        Signature
                      </div>
                      <div className={footerStyle.linesf3}>
                        <b>{headerData?.customerfirmname}</b>
                      </div>
                    </div>
                    <div
                      className={`${footerStyle.block2f3} ${style?.footers}`}
                      style={{ width: "30%" }}
                    >
                      <div className={`${footerStyle.linesf3} fw-normal`}>
                        Signature
                      </div>
                      <div className={footerStyle.linesf3}>
                        <b>{headerData?.CompanyFullName}</b>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
              {msg}
            </p>
          )}
        </>
      )}
    </React.Fragment>
  );
};

export default InvoicePrintD;

//newwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww
// // http://localhost:3000/?tkn=OTA2NTQ3MTcwMDUzNTY1MQ==&invn=U0syMDYyMjAyNA==&evn=c2FsZQ==&pnm=aW52b2ljZSBwcmludCBk&up=aHR0cDovL3plbi9qby9hcGktbGliL0FwcC9TYWxlQmlsbF9Kc29u&ctv=NzE=&ifid=PackingList3&pid=undefined
// import React, { useEffect, useState } from "react";
// import Loader from "../../components/Loader";
// import style from "../../assets/css/prints/InvoicePrint_10_11.module.css";
// import {
//   FooterComponent,
//   HeaderComponent,
//   NumberWithCommas,
//   apiCall,
//   checkMsg,
//   fixedValues,
//   handlePrint,
//   isObjectEmpty,
//   taxGenrator,
// } from "../../GlobalFunctions";
// import { ToWords } from "to-words";
// import footerStyle from "../../assets/css/footers/footer2.module.css";
// import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";
// import { cloneDeep } from "lodash";
// import "../../assets/css/prints/InvoicePrintD.scss";

// const InvoicePrintD = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
//   const [loader, setLoader] = useState(true);
//   const [msg, setMsg] = useState("");
//   const [data, setData] = useState([]);
//   const [otherMaterial, setOtherMaterial] = useState([]);
//   const [header, setHeader] = useState(null);
//   const [headerss, setHeaderss] = useState(null);
//   const [footer, setFooter] = useState(null);
//   const [headerData, setHeaderData] = useState({});
//   const [customerAddress, setCustomerAddress] = useState([]);
//   const [mainDatas, setMainDatas] = useState({});
//   const [total, setTotal] = useState({
//     total: 0,
//     grandtotal: 0,
//     totals: 0,
//     discounttotals: 0,
//   });
//   // const []
//   const [isImageWorking, setIsImageWorking] = useState(true);
//   const handleImageErrors = () => {
//     setIsImageWorking(false);
//   };
//   const [discount, setDiscount] = useState(0);
//   const [taxes, setTaxes] = useState([]);
//   const [pnm, setPnm] = useState(atob(printName).toLowerCase());
//   const [totalpcsss, setTotalPcsss] = useState(0);
//   const toWords = new ToWords();

//   const [mainData, setMainData] = useState({
//     resultArr: [],
//     findings: [],
//     diamonds: [],
//     colorStones: [],
//     miscs: [],
//     otherCharges: [],
//     misc2: [],
//     labour: {},
//     diamondHandling: 0,
//   });
//   const [totalss, setTotalss] = useState({
//     total: 0,
//     discount: 0,
//     totalPcs: 0,
//   });

//   const loadData = (data) => {
//     let head = HeaderComponent("1", data?.BillPrint_Json[0]);
//     setHeader(head);
//     setHeaderData(data?.BillPrint_Json[0]);
//     let footers = FooterComponent("2", data?.BillPrint_Json[0]);
//     setFooter(footers);

//     let headersss = HeaderComponent("3", data?.BillPrint_Json[0]);
//     setHeaderss(headersss);
//     let custAddress = data?.BillPrint_Json[0]?.Printlable.split("\n");
//     setCustomerAddress(custAddress);
//     let datas = OrganizeDataPrint(
//       data?.BillPrint_Json[0],
//       data?.BillPrint_Json1,
//       data?.BillPrint_Json2
//     );
//     setMainDatas(datas);
//     let resultArr = [];
//     let findings = [];
//     let diamonds = [];
//     let colorStones = [];
//     let misc2 = [];
//     let labour = {
//       label: "LABOUR",
//       primaryWt: 0,
//       makingAmount: 0,
//       totalAmount: 0,
//     };
//     let miscs = [];
//     let otherCharges = [];
//     let total2 = { ...totalss };
//     let diamondTotal = 0;
//     let colorStone1Total1 = 0;
//     let colorStone2Total2 = 0;
//     let misc1Total1 = 0;
//     let misc2Total2 = 0;
//     let diamondHandling = 0;
//     let totalPcss = [];
//     let jobWiseLabourCalc = 0;
//     let jobWiseMinusFindigWt = 0;

//     datas?.resultArray?.map((e, i) => {
//       let obj = cloneDeep(e);
//       let findingWt = 0;
//       let findingsWt = 0;
//       let findingsAmount = 0;
//       let secondaryMetalAmount = 0;

//       obj.primaryMetal = e?.metal?.find(
//         (ele, ind) => ele?.IsPrimaryMetal === 1
//       );
//       e?.finding?.forEach((ele, ind) => {
//         if (
//           ele?.ShapeName !== obj?.primaryMetal?.ShapeName &&
//           ele?.QualityName !== obj?.primaryMetal?.QualityName
//         ) {
//           let obb = cloneDeep(ele);
//           if (obj?.primaryMetal) {
//             obb.Rate = obj?.primaryMetal?.Rate;
//             obb.Amount = ele?.Wt * obb?.Rate;
//             findingsAmount += ele?.Wt * obb?.Rate;
//           }
//           findingsWt += ele?.Wt;
//           findings?.push(obb);
//           total2.total += obb?.Amount;
//         }
//         if (ele?.Supplier?.toLowerCase() === "customer") {
//           findingWt += ele?.Wt;
//         }
//       });

//       let findPcss = totalPcss?.findIndex(
//         (ele, ind) => ele?.GroupJob === e?.GroupJob
//       );

//       if (findPcss === -1) {
//         totalPcss?.push({ GroupJob: e?.GroupJob, value: e?.Quantity });
//       } else {
//         if (e?.GroupJob === "") {
//           let findQuantity = totalPcss?.findIndex(
//             (ele, ind) => ele?.GroupJob === ""
//           );
//           if (findQuantity === -1) {
//             totalPcss?.push({ GroupJob: e?.GroupJob, value: e?.Quantity });
//           } else {
//             totalPcss[findQuantity].value += e?.Quantity;
//           }
//         }
//       }

//       let primaryWt = 0;
//       let primaryMetalRAte = 0;
//       let count = 0;
//       let secondMetalWt = 0;
//       let netWtFinal = e?.NetWt + e?.LossWt - findingsWt;

//       diamondHandling += e?.TotalDiamondHandling;
//       e?.metal?.forEach((ele, ind) => {
//         count += 1;
//         if (ele?.IsPrimaryMetal === 1) {
//           primaryWt += ele?.Wt;
//           if (primaryMetalRAte === 0) {
//             primaryMetalRAte += ele?.Rate;
//           }
//         } else {
//           secondaryMetalAmount += ele?.Amount;
//           secondMetalWt += ele?.Wt;
//         }
//       });
//       let latestAmount =
//         (e?.MetalDiaWt - findingsWt) * primaryMetalRAte + secondaryMetalAmount;
//       total2.total += latestAmount;
//       let finalMetalAmount =
//         (e?.MetalDiaWt -
//           (e?.totals?.finding?.Wt * e?.LossPer) / 100 +
//           e?.totals?.finding?.Wt) *
//           primaryMetalRAte +
//         secondaryMetalAmount;

//       // labour.primaryWt += primaryWt;
//       labour.makingAmount += e?.MakingAmount;
//       labour.totalAmount +=
//         e?.MakingAmount + e?.TotalDiaSetcost + e?.TotalCsSetcost;
//       total2.discount += e?.DiscountAmt;
//       obj.primaryWt = primaryWt;
//       obj.netWtFinal = netWtFinal;
//       obj.latestAmount = latestAmount;
//       obj.secondaryMetalAmount = secondaryMetalAmount;
//       obj.secondMetalWt = secondMetalWt;
//       obj.finalMetalAmount = finalMetalAmount;
//       // obj.metalAmountFinal = e?.MetalAmount - findingsAmount + secondaryMetalAmount;
//       obj.metalAmountFinal = e?.totals?.metal?.Amount - findingsAmount;
//       if (count <= 1) {
//         primaryWt = e?.NetWt + e?.LossWt;
//       }

//       if (obj?.primaryMetal) {
//         // total2.total +=
//         //   obj?.metalAmountFinal / data?.BillPrint_Json[0]?.CurrencyExchRate;
//         let findRecord = resultArr?.findIndex(
//           (ele, ind) =>
//             ele?.primaryMetal?.ShapeName === obj?.primaryMetal?.ShapeName &&
//             ele?.primaryMetal?.QualityName === obj?.primaryMetal?.QualityName &&
//             ele?.primaryMetal?.Rate === obj?.primaryMetal?.Rate
//           // &&
//           // obj?.GroupJob == " "
//         );
//         if (findRecord === -1) {
//           resultArr?.push(obj);
//         } else {
//           resultArr[findRecord].grosswt += obj?.grosswt;
//           resultArr[findRecord].NetWt += obj?.NetWt;
//           resultArr[findRecord].LossWt += obj?.LossWt;
//           resultArr[findRecord].primaryWt += obj?.primaryWt;
//           resultArr[findRecord].primaryMetal.Pcs += obj?.primaryMetal.Pcs;
//           resultArr[findRecord].primaryMetal.Wt += obj?.primaryMetal.Wt;
//           resultArr[findRecord].primaryMetal.Amount += obj?.primaryMetal.Amount;
//           resultArr[findRecord].netWtFinal += obj?.netWtFinal;
//           resultArr[findRecord].metalAmountFinal += obj?.metalAmountFinal;
//           resultArr[findRecord].secondaryMetalAmount +=
//             obj?.secondaryMetalAmount;
//           resultArr[findRecord].latestAmount += latestAmount;
//           resultArr[findRecord].finalMetalAmount += obj?.finalMetalAmount;
//           resultArr[findRecord].secondMetalWt += obj?.secondMetalWt;
//         }
//       }

//       jobWiseLabourCalc += (e?.MetalDiaWt - findingWt) * e?.MaKingCharge_Unit;
//       jobWiseMinusFindigWt += e?.MetalDiaWt - findingWt;

//       e?.diamonds?.forEach((ele, ind) => {
//         let findDiamond = diamonds?.findIndex(
//           (elem, index) => elem?.isRateOnPcs === ele?.isRateOnPcs
//         );
//         diamondTotal += ele?.Amount;
//         if (findDiamond === -1) {
//           diamonds?.push(ele);
//         } else {
//           diamonds[findDiamond].Wt += ele?.Wt;
//           diamonds[findDiamond].Pcs += ele?.Pcs;
//           diamonds[findDiamond].Amount += ele?.Amount;
//         }
//       });

//       e?.colorstone?.forEach((ele, ind) => {
//         // total2.total += (ele?.Amount );
//         let findColorStones = colorStones?.findIndex(
//           (elem, index) => elem?.isRateOnPcs === ele?.isRateOnPcs
//         );
//         if (findColorStones === -1) {
//           colorStones?.push(ele);
//         } else {
//           colorStones[findColorStones].Wt += ele?.Wt;
//           colorStones[findColorStones].Pcs += ele?.Pcs;
//           colorStones[findColorStones].Amount += ele?.Amount;
//         }
//         if (ele?.isRateOnPcs === 0) {
//           colorStone1Total1 += ele?.Amount;
//         } else {
//           colorStone2Total2 += ele?.Amount;
//         }
//       });

//       e?.misc?.forEach((ele, ind) => {
//         if (ele?.isRateOnPcs === 0) {
//           misc1Total1 += ele?.Amount;
//         } else {
//           misc2Total2 += ele?.Amount;
//         }
//         if (ele?.IsHSCOE !== 0) {
//           let findMisc = miscs?.findIndex(
//             (elem, index) => elem?.ShapeName === ele?.ShapeName
//           );
//           if (findMisc === -1) {
//             miscs?.push(ele);
//           } else {
//             miscs[findMisc].Wt += ele?.Wt;
//             miscs[findMisc].Pcs += ele?.Pcs;
//             miscs[findMisc].Amount += ele?.Amount;
//           }
//           // total2.total += (ele?.Amount);
//         } else if (ele?.IsHSCOE === 0) {
//           // total2.total += ele?.Amount;
//           let findMisc = misc2?.findIndex(
//             (elem, index) => elem?.isRateOnPcs === ele?.isRateOnPcs
//           );
//           if (findMisc === -1) {
//             misc2?.push(ele);
//           } else {
//             misc2[findMisc].Wt += ele?.Wt;
//             misc2[findMisc].Pcs += ele?.Pcs;
//             misc2[findMisc].Amount += ele?.Amount;
//           }
//         }
//       });

//       e?.other_details?.forEach((ele, ind) => {
//         let findOther = otherCharges?.findIndex(
//           (elem, index) => elem?.label === ele?.label
//         );
//         total2.total += +ele?.value;
//         if (findOther === -1) {
//           otherCharges?.push(ele);
//         } else {
//           otherCharges[findOther].value =
//             +otherCharges[findOther]?.value + +ele?.value;
//         }
//       });
//     });

//     let finalsArr = [];
//     let mainJobs = {};
    
//     resultArr.forEach((item) => {
//       if (item.SrJobno === item.GroupJob && item.GroupJob !== "") {
//         mainJobs[item.SrJobno] = { ...item }; // Ensure it's a new object
//       }
//     });

//     resultArr.forEach((e, i) => {
//       let finalMetalWt =
//         e?.MetalDiaWt -
//         (e?.totals?.finding?.Wt * e?.LossPer) / 100 +
//         e?.totals?.finding?.Wt +
//         e?.secondMetalWt;
//       let finalRate = e?.latestAmount / e?.netWtFinal;
//       let obj = cloneDeep(e);
//       obj.finalMetalWt = finalMetalWt;
//       obj.finalRate = finalRate;

//       if (e.GroupJob in mainJobs && e.SrJobno !== e.GroupJob) {
//         let mainJobIndex = finalsArr.findIndex(
//           (job) => job.SrJobno === e.GroupJob
//         );

//         if (mainJobIndex !== -1) {
//           finalsArr[mainJobIndex].grosswt =
//             (finalsArr[mainJobIndex].grosswt || 0) + e.grosswt;
//         }

//         obj.grosswt = "";
//       }
//       finalsArr.push(obj);
//     });
//     let totalPcs = totalPcss?.reduce((acc, cObj) => acc + cObj?.value, 0);
//     // total2.total += labour?.totalAmount
//     total2.total +=
//       diamondTotal / data?.BillPrint_Json[0]?.CurrencyExchRate +
//       colorStone1Total1 / data?.BillPrint_Json[0]?.CurrencyExchRate +
//       colorStone2Total2 / data?.BillPrint_Json[0]?.CurrencyExchRate +
//       misc1Total1 / data?.BillPrint_Json[0]?.CurrencyExchRate +
//       misc2Total2 / data?.BillPrint_Json[0]?.CurrencyExchRate +
//       labour?.totalAmount / data?.BillPrint_Json[0]?.CurrencyExchRate +
//       diamondHandling / data?.BillPrint_Json[0]?.CurrencyExchRate;

//     labour.primaryWt = jobWiseMinusFindigWt;
//     finalsArr.sort((a, b) => {
//       const labelA = a.MetalTypePurity.toLowerCase();
//       const labelB = b.MetalTypePurity.toLowerCase();

//       // Check if labels contain numbers
//       const hasNumberA = /\d/.test(labelA);
//       const hasNumberB = /\d/.test(labelB);

//       if (hasNumberA && !hasNumberB) {
//         return -1; // Label with number comes before label without number
//       } else if (!hasNumberA && hasNumberB) {
//         return 1; // Label without number comes after label with number
//       } else {
//         // Both labels have numbers or both don't, sort alphabetically
//         return labelA.localeCompare(labelB);
//       }
//     });

//     let newArr = [
//       {
//         label: "HANDLING",
//         value: diamondHandling / data?.BillPrint_Json[0]?.CurrencyExchRate,
//       },
//     ];
//     miscs?.forEach((e, i) => {
//       let obj = cloneDeep(e);
//       obj.label = obj?.ShapeName;
//       obj.Amount = obj?.Amount / data?.BillPrint_Json[0]?.CurrencyExchRate;
//       newArr?.push(obj);
//     });
//     otherCharges?.forEach((e, i) => {
//       let obj = cloneDeep(e);
//       obj.value = +obj?.value;
//       newArr?.push(obj);
//     });

//     newArr?.sort((a, b) => {
//       var regex = /(\d+)|(\D+)/g;
//       var partsA = a.label.match(regex);
//       var partsB = b.label.match(regex);

//       for (var i = 0; i < Math.min(partsA.length, partsB.length); i++) {
//         var partA = partsA[i];
//         var partB = partsB[i];

//         if (!isNaN(partA) && !isNaN(partB)) {
//           var numA = parseInt(partA);
//           var numB = parseInt(partB);
//           if (numA !== numB) {
//             return numA - numB;
//           }
//         } else {
//           if (partA !== partB) {
//             return partA.localeCompare(partB);
//           }
//         }
//       }

//       return a.label.length - b.label.length;
//     });

//     setTotalss({
//       ...totalss,
//       total: total2?.total,
//       discount: total2?.discount,
//       totalPcs: totalPcs,
//     });
//     setMainData({
//       ...mainData,
//       resultArr: finalsArr,
//       findings: findings,
//       diamonds: diamonds,
//       colorStones: colorStones,
//       miscs: miscs,
//       otherCharges: newArr,
//       misc2: misc2,
//       labour: labour,
//       diamondHandling: diamondHandling,
//     });
//   };

//   useEffect(() => {
//     const sendData = async () => {
//       try {
//         const data = await apiCall(
//           token,
//           invoiceNo,
//           printName,
//           urls,
//           evn,
//           ApiVer
//         );
//         if (data?.Status === "200") {
//           let isEmpty = isObjectEmpty(data?.Data);
//           if (!isEmpty) {
//             loadData(data?.Data);
//             setLoader(false);
//           } else {
//             setLoader(false);
//             setMsg("Data Not Found");
//           }
//         } else {
//           setLoader(false);
//           // setMsg(data?.Message);
//           const err = checkMsg(data?.Message);
//           setMsg(err);
//         }
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     sendData();
//   }, []);
//   return (
//     <React.Fragment>
//       {loader ? (
//         <Loader />
//       ) : (
//         <>
//           {msg === "" ? (
//             <div className="InvoicePrintD_main">
//               <div className="packingListDemo_main_App">
//                 <div
//                   className={`d-flex justify-content-end align-items-center ${style?.print_sec_sum4} mb-4`}
//                 >
//                   <div className={`form-check ps-3 ${style?.printBtn}`}>
//                     <input
//                       type="button"
//                       className="btn_white blue py-2 mt-2"
//                       value="Print"
//                       onClick={(e) => handlePrint(e)}
//                     />
//                   </div>
//                 </div>
//                 {/* {headerData?.IsEinvoice !== 1 ? (
//                   <>
//                     <div className={`${style2.headline} headerTitle`}>
//                       {headerData?.PrintHeadLabel}
//                     </div>
//                     <div
//                       className={`${style?.font_12} ${style2.companyDetails}`}
//                     >
//                       <div className={`${style2.companyhead} p-2`}>
//                         <div
//                           className={`${style2.lines} ${style?.font_16}`}
//                           style={{ fontWeight: "bold" }}
//                         >
//                           {headerData?.CompanyFullName}
//                         </div>
//                         <div className={style2.lines}>
//                           {headerData?.CompanyAddress}
//                         </div>
//                         <div className={style2.lines}>
//                           {headerData?.CompanyAddress2}
//                         </div>
//                         <div className={style2.lines}>
//                           {headerData?.CompanyCity}-{headerData?.CompanyPinCode}
//                           ,{headerData?.CompanyState}(
//                           {headerData?.CompanyCountry})
//                         </div>
//                         <div className={style2.lines}>
//                           T: {headerData?.CompanyTellNo} | TOLL FREE{" "}
//                           {headerData?.CompanyTollFreeNo} | TOLL FREE{" "}
//                           {headerData?.CompanyTollFreeNo}
//                         </div>
//                         <div className={style2.lines}>
//                           {headerData?.CompanyEmail} |{" "}
//                           {headerData?.CompanyWebsite}
//                         </div>
//                         <div className={style2.lines}>
//                           {headerData?.Company_VAT_GST_No} |{" "}
//                           {headerData?.Company_CST_STATE}-
//                           {headerData?.Company_CST_STATE_No} | PAN-
//                           {headerData?.Pannumber}
//                         </div>
//                       </div>
//                       <div
//                         style={{ width: "30%" }}
//                         className="d-flex justify-content-end align-item-center h-100"
//                       >
//                         {isImageWorking && headerData?.PrintLogo !== "" && (
//                           <img
//                             src={headerData?.PrintLogo}
//                             alt=""
//                             className="w-100 h-auto ms-auto d-block object-fit-contain"
//                             style={{ maxWidth: "116px" }}
//                             onError={handleImageErrors}
//                             height={120}
//                             width={150}
//                           />
//                         )}
//                       </div>
//                     </div>
//                   </>
//                 ) : (
//                   headerss
//                 )} */}

//                 <div className="invoice_top_cust_address_main">
//                   <div className="col-4 border-end" style={{ margin: "3px" }}>
//                     <p>{headerData?.lblBillTo}</p>
//                     <p className={`fw-bold pe-2 lh-1 ${style?.font_14}`}>
//                       {headerData?.customerfirmname}
//                     </p>
//                     <p className="lh-1">{headerData?.customerAddress1}</p>
//                     <p className="lh-1">{headerData?.customerAddress2}</p>
//                     <p className="lh-1">
//                       {" "}
//                       {headerData?.customercity1}-{headerData?.PinCode}{" "}
//                     </p>
//                     <p className="lh-1">{headerData?.customeremail1}</p>
//                     <p className="lh-1">{headerData?.vat_cst_pan}</p>
//                     <p className="lh-1">
//                       {headerData?.Cust_CST_STATE &&
//                       headerData?.Cust_CST_STATE_No ? (
//                         <>
//                           {headerData?.Cust_CST_STATE} -{" "}
//                           {headerData?.Cust_CST_STATE_No}
//                         </>
//                       ) : (
//                         headerData?.Cust_CST_STATE ||
//                         headerData?.Cust_CST_STATE_No ||
//                         ""
//                       )}
//                     </p>
//                   </div>
//                   <div className="col-4 border-end" style={{ margin: "3px" }}>
//                     <p className="lh-1">Ship To,</p>
//                     <p className={`fw-bold lh-1 ${style?.font_14}`}>
//                       {headerData?.customerfirmname}
//                     </p>
//                     {customerAddress.map((e, i) => {
//                       return (
//                         <p key={i} className="lh-1">
//                           {e}
//                         </p>
//                       );
//                     })}
//                   </div>
//                   <div className="col-4" style={{ margin: "3px" }}>
//                     <div className="d-flex">
//                       <div className="lh-1 fw-bold col-6">BILL NO</div>
//                       <div className="lh-1 col-6">{headerData?.InvoiceNo} </div>
//                     </div>
//                     <div className="d-flex">
//                       <div className="lh-1 fw-bold col-6">DATE</div>
//                       <div className="lh-1 col-6">{headerData?.EntryDate} </div>
//                     </div>

//                     <div className="d-flex">
//                       <div className="lh-1 fw-bold col-6">
//                         {headerData?.HSN_No_Label}
//                       </div>
//                       <div className="lh-1 col-6">{headerData?.HSN_No} </div>
//                     </div>
//                     <div className="d-flex">
//                       <div className="lh-1 fw-bold col-6">NAME OF GOODS</div>
//                       <div className="lh-1 col-6">
//                         {headerData?.NameOfGoods}{" "}
//                       </div>
//                     </div>
//                     <div className="d-flex">
//                       <div className="lh-1 fw-bold col-6">PLACE OF SUPPLY</div>
//                       <div className="lh-1 col-6">
//                         {headerData?.customerstate}{" "}
//                       </div>
//                     </div>
//                     <div className="d-flex">
//                       <div className="lh-1 fw-bold col-6">TERMS</div>
//                       <div className="lh-1 col-6">{headerData?.DueDays} </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="invod_data_mainbox">
//                   <div className="invod_table_data_top_colum_div">
//                     <div className="invod_table_data_top_colum_div_sub1">
//                       <div className="invod_table_colum1">
//                         <p>
//                           <b>DESCRIPTION</b>
//                         </p>
//                       </div>
//                     </div>
//                     <div className="invod_table_data_top_colum_div_sub2">
//                       <div className="invod_table_colum2">
//                         <p>
//                           <b>Detail</b>
//                         </p>
//                       </div>
//                       <div className="invod_table_colum3">
//                         <p>
//                           <b>Gross Wt.</b>
//                         </p>{" "}
//                       </div>
//                       <div className="invod_table_colum4">
//                         <p>
//                           <b>Net Wt.</b>
//                         </p>{" "}
//                       </div>
//                       <div className="invod_table_colum5">
//                         <p>
//                           <b>Pcs</b>
//                         </p>{" "}
//                       </div>
//                       <div className="invod_table_colum6">
//                         <p>
//                           <b>Qty</b>
//                         </p>{" "}
//                       </div>
//                       <div className="invod_table_colum7">
//                         <p>
//                           <b>Rate</b>
//                         </p>{" "}
//                       </div>
//                       <div className="invod_table_colum8">
//                         <p>
//                           <b>Amount</b>
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="invoid_table_data_main_div">
//                     <div className="invoi_table_data_col1">
//                       <p className={`w-100 text-center pb-1 ${style?.font_13}`}>
//                         {mainDatas?.mainTotal?.diamonds?.Pcs > 0
//                           ? "DIAMOND STUDDED"
//                           : "GOLD"}{" "}
//                         JEWELLERY
//                       </p>
//                       <p className={`fw-bold ${style?.font_17}`}>
//                         Total Pcs : {NumberWithCommas(totalss?.totalPcs, 0)}
//                       </p>
//                     </div>
//                     <div className="invod_table_data_sideBar">
//                       {mainData?.resultArr?.map((e, i) => {
//                         return (
//                           <div className="invoi_table_data_sub_main" key={i}>
//                             <div className="invoi_table_data_col2">
//                               <p>
//                                 {e?.primaryMetal?.ShapeName}{" "}
//                                 {e?.primaryMetal?.QualityName}
//                               </p>
//                             </div>
//                             <div className="invoi_table_data_col3">
//                               <p>
//                                 {e?.grosswt === ""
//                                   ? ""
//                                   : `${NumberWithCommas(
//                                       e?.grosswt,
//                                       3
//                                     )} Gms`}{" "}
//                               </p>
//                             </div>
//                             <div className="invoi_table_data_col4">
//                               <p>{NumberWithCommas(e?.netWtFinal, 3)} Gms</p>
//                             </div>
//                             <div className="invoi_table_data_col5">
//                               <p></p>
//                             </div>
//                             <div className="invoi_table_data_col6">
//                               <p></p>
//                             </div>
//                             <div className="invoi_table_data_col7">
//                               <p>{NumberWithCommas(e?.finalRate, 2)}</p>
//                             </div>
//                             <div className="invoi_table_data_col8">
//                               <p>{NumberWithCommas(e?.latestAmount, 2)}</p>
//                             </div>
//                           </div>
//                         );
//                       })}
//                       {mainData?.findings?.map((e, i) => {
//                         return (
//                           <div className="invoi_table_data_sub_main" key={i}>
//                             <div className="invoi_table_data_col2">
//                               <p>
//                                 {e?.ShapeName} {e?.QualityName}
//                               </p>
//                             </div>
//                             <div className="invoi_table_data_col3">
//                               <p></p>
//                             </div>
//                             <div className="invoi_table_data_col4">
//                               <p>{NumberWithCommas(e?.Wt, 3)} Gms</p>
//                             </div>
//                             <div className="invoi_table_data_col5">
//                               <p></p>
//                             </div>
//                             <div className="invoi_table_data_col6">
//                               <p></p>
//                             </div>
//                             <div className="invoi_table_data_col7">
//                               <p>{NumberWithCommas(e?.Rate, 2)}</p>
//                             </div>
//                             <div className="invoi_table_data_col8">
//                               <p>{NumberWithCommas(e?.Amount, 2)}</p>
//                             </div>
//                           </div>
//                         );
//                       })}
//                       {mainData?.diamonds?.map((e, i) => {
//                         return (
//                           <div className="invoi_table_data_sub_main" key={i}>
//                             <div className="invoi_table_data_col2">
//                               <p>{e?.MasterManagement_DiamondStoneTypeName}</p>
//                             </div>
//                             <div className="invoi_table_data_col3">
//                               <p></p>
//                             </div>
//                             <div className="invoi_table_data_col4">
//                               <p></p>
//                             </div>
//                             <div className="invoi_table_data_col5">
//                               <p>{NumberWithCommas(e?.Pcs, 0)}</p>
//                             </div>
//                             <div className="invoi_table_data_col6">
//                               <p>{NumberWithCommas(e?.Wt, 3)} Ctw</p>
//                             </div>
//                             <div className="invoi_table_data_col7">
//                               <p>
//                                 {e?.isRateOnPcs === 0
//                                   ? e?.Wt !== 0 && (
//                                       <>
//                                         {NumberWithCommas(
//                                           e?.Amount /
//                                             e?.Wt /
//                                             headerData?.CurrencyExchRate,
//                                           2
//                                         )}{" "}
//                                         / Wt
//                                       </>
//                                     )
//                                   : e?.Pcs !== 0 && (
//                                       <>
//                                         {NumberWithCommas(
//                                           e?.Amount /
//                                             e?.Pcs /
//                                             headerData?.CurrencyExchRate,
//                                           2
//                                         )}{" "}
//                                         / Pcs
//                                       </>
//                                     )}
//                               </p>
//                             </div>
//                             <div className="invoi_table_data_col8">
//                               <p>
//                                 {NumberWithCommas(
//                                   e?.Amount / headerData?.CurrencyExchRate,
//                                   2
//                                 )}
//                               </p>
//                             </div>
//                           </div>
//                         );
//                       })}
//                       {mainData?.colorStones?.map((e, i) => {
//                         return (
//                           <div className="invoi_table_data_sub_main" key={i}>
//                             <div className="invoi_table_data_col2">
//                               <p>{e?.MasterManagement_DiamondStoneTypeName}</p>
//                             </div>
//                             <div className="invoi_table_data_col3">
//                               <p></p>
//                             </div>
//                             <div className="invoi_table_data_col4">
//                               <p></p>
//                             </div>
//                             <div className="invoi_table_data_col5">
//                               <p>{NumberWithCommas(e?.Pcs, 0)}</p>
//                             </div>
//                             <div className="invoi_table_data_col6">
//                               <p>{NumberWithCommas(e?.Wt, 3)} Ctw</p>
//                             </div>
//                             <div className="invoi_table_data_col7">
//                               <p>
//                                 {e?.isRateOnPcs === 0
//                                   ? e?.Wt !== 0 && (
//                                       <>
//                                         {NumberWithCommas(
//                                           e?.Amount /
//                                             e?.Wt /
//                                             headerData?.CurrencyExchRate,
//                                           2
//                                         )}{" "}
//                                         / Wt
//                                       </>
//                                     )
//                                   : e?.Pcs !== 0 && (
//                                       <>
//                                         {NumberWithCommas(
//                                           e?.Amount /
//                                             e?.Pcs /
//                                             headerData?.CurrencyExchRate,
//                                           2
//                                         )}{" "}
//                                         / Pcs
//                                       </>
//                                     )}
//                               </p>
//                             </div>
//                             <div className="invoi_table_data_col8">
//                               <p>
//                                 {NumberWithCommas(
//                                   e?.Amount / headerData?.CurrencyExchRate,
//                                   2
//                                 )}
//                               </p>
//                             </div>
//                           </div>
//                         );
//                       })}
//                       {mainData?.misc2?.map((e, i) => {
//                         return (
//                           <div className="invoi_table_data_sub_main" key={i}>
//                             <div className="invoi_table_data_col2">
//                               <p>OTHER MATERIAL</p>
//                             </div>
//                             <div className="invoi_table_data_col3">
//                               <p></p>
//                             </div>
//                             <div className="invoi_table_data_col4">
//                               <p></p>
//                             </div>
//                             <div className="invoi_table_data_col5">
//                               <p>{NumberWithCommas(e?.Pcs, 0)}</p>
//                             </div>
//                             <div className="invoi_table_data_col6">
//                               <p>{NumberWithCommas(e?.Wt, 3)} Gms</p>
//                             </div>
//                             <div className="invoi_table_data_col7">
//                               <p>
//                                 {e?.isRateOnPcs === 0
//                                   ? e?.Wt !== 0 && (
//                                       <>
//                                         {NumberWithCommas(
//                                           e?.Amount /
//                                             e?.Wt /
//                                             headerData?.CurrencyExchRate,
//                                           2
//                                         )}{" "}
//                                         / Wt
//                                       </>
//                                     )
//                                   : e?.Pcs !== 0 && (
//                                       <>
//                                         {NumberWithCommas(
//                                           e?.Amount /
//                                             e?.Pcs /
//                                             headerData?.CurrencyExchRate,
//                                           2
//                                         )}{" "}
//                                         / Pcs
//                                       </>
//                                     )}
//                               </p>
//                             </div>
//                             <div className="invoi_table_data_col8">
//                               <p>
//                                 {NumberWithCommas(
//                                   e?.Amount / headerData?.CurrencyExchRate,
//                                   2
//                                 )}
//                               </p>
//                             </div>
//                           </div>
//                         );
//                       })}
//                       <div className="invoi_table_data_sub_main">
//                         <div className="invoi_table_data_col2">
//                           <p>{mainData?.labour?.label}</p>
//                         </div>
//                         <div className="invoi_table_data_col3">
//                           <p></p>
//                         </div>
//                         <div className="invoi_table_data_col4">
//                           <p></p>
//                         </div>
//                         <div className="invoi_table_data_col5">
//                           <p></p>
//                         </div>
//                         <div className="invoi_table_data_col6">
//                           <p></p>
//                         </div>
//                         <div className="invoi_table_data_col7">
//                           <p>
//                             {mainData?.labour?.primaryWt !== 0 &&
//                               NumberWithCommas(
//                                 mainData?.labour?.makingAmount /
//                                   mainData?.labour?.primaryWt /
//                                   headerData?.CurrencyExchRate,
//                                 2
//                               )}
//                           </p>
//                         </div>
//                         <div className="invoi_table_data_col8">
//                           <p>
//                             {NumberWithCommas(
//                               mainData?.labour?.totalAmount /
//                                 headerData?.CurrencyExchRate,
//                               2
//                             )}
//                           </p>
//                         </div>
//                       </div>

//                       {mainData?.otherCharges?.map((e, i) => {
//                         return (
//                           <>
//                             {e?.label === "HANDLING" &&
//                             (e?.value === 0 || e?.value === "0.00") ? (
//                               ""
//                             ) : (
//                               <div
//                                 className="invoi_table_data_sub_main"
//                                 key={i}
//                               >
//                                 <div className="invoi_table_data_col2">
//                                   <p>{e?.label}</p>
//                                 </div>
//                                 <div className="invoi_table_data_col3">
//                                   <p></p>
//                                 </div>
//                                 <div className="invoi_table_data_col4">
//                                   <p></p>
//                                 </div>
//                                 <div className="invoi_table_data_col5">
//                                   <p></p>
//                                 </div>
//                                 <div className="invoi_table_data_col6">
//                                   <p></p>
//                                 </div>
//                                 <div className="invoi_table_data_col7">
//                                   <p></p>
//                                 </div>
//                                 <div className="invoi_table_data_col8">
//                                   {e?.label == "Certification_google.com" ? (
//                                     <p>{NumberWithCommas(e?.Amount, 2)}</p>
//                                   ) : (
//                                     <p>{NumberWithCommas(e?.value, 2)}</p>
//                                   )}
//                                 </div>
//                               </div>
//                             )}
//                           </>
//                         );
//                       })}

//                       {/* {mainData?.otherCharges?.map((e, i) => {
//                         return (
//                           <div className="invoi_table_data_sub_main" key={i}>
//                             <div className="invoi_table_data_col2">
//                               <p>{e?.label}</p>
//                             </div>
//                             <div className="invoi_table_data_col3">
//                               <p></p>
//                             </div>
//                             <div className="invoi_table_data_col4">
//                               <p></p>
//                             </div>
//                             <div className="invoi_table_data_col5">
//                               <p></p>
//                             </div>
//                             <div className="invoi_table_data_col6">
//                               <p></p>
//                             </div>
//                             <div className="invoi_table_data_col7">
//                               <p></p>
//                             </div>
//                             <div className="invoi_table_data_col8">
//                               <p>{NumberWithCommas(e?.value, 2)}</p>
//                             </div>
//                           </div>
//                         );
//                       })} */}
//                     </div>
//                   </div>
//                   {/* total */}
//                   <div
//                     style={{
//                       display: "flex",
//                       borderTop: "1px solid #dee2e6",
//                       borderRight: "1px solid #dee2e6",
//                       borderLeft: "1px solid #dee2e6",
//                       height: "25px",
//                     }}
//                   >
//                     <div className="col-3 border-end d-flex align-items-center justify-content-center flex-column"></div>
//                     <div className="col-9">
//                       <div
//                         style={{
//                           display: "flex",
//                           height: "100%",
//                           alignItems: "center",
//                         }}
//                       >
//                         <div className="col-2 px-1">
//                           <p className={`${style?.min_height_21} fw-bold`}>
//                             Total
//                           </p>
//                         </div>
//                         <div className="col-2 px-1">
//                           <p className={`${style?.min_height_21} text-end`}></p>
//                         </div>
//                         <div className="col-2 px-1">
//                           <p className={`${style?.min_height_21} text-end`}></p>
//                         </div>
//                         <div className="col-1 px-1">
//                           <p className={`${style?.min_height_21} text-end`}></p>
//                         </div>

//                         <div className="col-1 px-1">
//                           <p className={`${style?.min_height_21} text-end`}></p>
//                         </div>
//                         <div className="col-2 px-1">
//                           <p className={`${style?.min_height_21} text-end`}></p>
//                         </div>
//                         <div className="col-2 px-1">
//                           <p
//                             className={`${style?.min_height_21} text-end fw-bold`}
//                           >
//                             {NumberWithCommas(totalss?.total, 2)}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   {/* taxes */}
//                   <div className="invoicd_total_summury_main">
//                     <div className="col-9 border-end"></div>
//                     <div className="col-3 px-1">
//                       {totalss?.discount !== 0 && (
//                         <>
//                           <div className="d-flex justify-content-between">
//                             <p>Discount</p>
//                             <p>{NumberWithCommas(totalss?.discount, 2)}</p>
//                           </div>
//                         </>
//                       )}
//                       <div className="d-flex justify-content-between">
//                         <p className="fw-bold"> Total Amount </p>
//                         {/* with normal charges */}
//                         {/* <p className="fw-bold">
//                           {NumberWithCommas(
//                             mainDatas?.mainTotal?.total_amount /
//                             headerData?.CurrencyExchRate,
//                             2
//                           )}
//                         </p> */}
//                         {/* with courior charges */}
//                         <p className="fw-bold">
//                           {NumberWithCommas(
//                             (mainDatas?.mainTotal?.total_amount || 0) /
//                               (headerData?.CurrencyExchRate || 1) +
//                               (mainDatas?.header?.FreightCharges
//                                 ? mainDatas?.header?.FreightCharges
//                                 : 0),
//                             2
//                           )}
//                         </p>
//                         {/* <p className="fw-bold"> {NumberWithCommas(totalss?.total-totalss?.discount, 2)}</p> */}
//                       </div>
//                       {mainDatas?.allTaxes?.map((e, i) => {
//                         return (
//                           <div
//                             className="d-flex justify-content-between"
//                             key={i}
//                           >
//                             <p>
//                               {e?.name} @ {e?.per}
//                             </p>
//                             <p>{NumberWithCommas(+e?.amount, 2)}</p>
//                           </div>
//                         );
//                       })}
//                       {headerData?.AddLess !== 0 && (
//                         <div className="d-flex justify-content-between">
//                           <p>{headerData?.AddLess > 0 ? "Add" : "Less"}</p>
//                           <p>
//                             {NumberWithCommas(
//                               headerData?.AddLess /
//                                 headerData?.CurrencyExchRate,
//                               2
//                             )}
//                           </p>
//                         </div>
//                       )}

//                       <div className="d-flex justify-content-between">
//                         <p>{mainDatas?.header?.ModeOfDel}</p>
//                         <p>{mainDatas?.header?.FreightCharges?.toFixed(2)}</p>
//                       </div>
//                     </div>
//                   </div>
//                   <div
//                     style={{
//                       display: "flex",
//                       borderBottom: "1px solid #dee2e6",
//                       borderRight: "1px solid #dee2e6",
//                       borderLeft: "1px solid #dee2e6",
//                     }}
//                   >
//                     <div className="col-8 border-end px-1">
//                       <p className="fw-bold"> IN Words Indian Rupees</p>
//                       <p className="invod_total_font_text">
//                         {toWords.convert(
//                           +fixedValues(
//                             mainDatas?.mainTotal?.total_amount /
//                               headerData?.CurrencyExchRate +
//                               mainDatas?.allTaxes?.reduce(
//                                 (acc, cObj) =>
//                                   acc +
//                                   +cObj?.amount * headerData?.CurrencyExchRate,
//                                 0
//                               ) +
//                               headerData?.AddLess +
//                               headerData?.FreightCharges,
//                             2
//                           )
//                         )}{" "}
//                         Only.
//                       </p>
//                     </div>
//                     <div className="col-4 px-1 d-flex justify-content-between align-items-center">
//                       <p className="text-end fw-bold">Grand Total </p>
//                       <p className="text-end fw-bold">
//                         {NumberWithCommas(
//                           mainDatas?.mainTotal?.total_amount /
//                             headerData?.CurrencyExchRate +
//                             mainDatas?.allTaxes?.reduce(
//                               (acc, cObj) => acc + +cObj?.amount,
//                               0
//                             ) +
//                             headerData?.AddLess +
//                             headerData?.FreightCharges,
//                           2
//                         )}
//                       </p>
//                     </div>
//                   </div>
//                   <div
//                     className="invod_support_line_font"
//                     dangerouslySetInnerHTML={{
//                       __html: headerData?.Declaration,
//                     }}
//                   ></div>
//                   <p className="p-1 no_break">
//                     <span className="fw-bold"> REMARKS :</span>{" "}
//                     <span
//                       dangerouslySetInnerHTML={{
//                         __html: headerData?.PrintRemark,
//                       }}
//                     ></span>
//                   </p>
//                   {/* {footer} */}
//                   <div className="invoicd_footer_main_class">
//                     <div
//                       style={{
//                         width: "40%",
//                         borderRight: "1px solid #e8e8e8",
//                         margin: "5px",
//                       }}
//                     >
//                       <div className="invoicd_footer_main_class_box1">
//                         Bank Detail
//                       </div>
//                       <div className="invoicd_footer_main_class_box2">
//                         Bank Name: {headerData?.bankname}
//                       </div>
//                       <div className="invoicd_footer_main_class_box2">
//                         Branch: {headerData?.bankaddress}
//                       </div>
//                       <div className="invoicd_footer_main_class_box2">
//                         Account Name: {headerData?.accountname}
//                       </div>
//                       <div className="invoicd_footer_main_class_box2">
//                         Account No. : {headerData?.accountnumber}
//                       </div>
//                       <div className="invoicd_footer_main_class_box2">
//                         RTGS/NEFT IFSC: {headerData?.rtgs_neft_ifsc}
//                       </div>
//                       <div className="invoicd_footer_main_class_box2">
//                         Enquiry No.{" "}
//                       </div>
//                       <div className="invoicd_footer_main_class_box2">
//                         {" "}
//                         (E & OE)
//                       </div>
//                     </div>
//                     <div
//                       className={`${footerStyle.block2f3} ${style?.footers}`}
//                       style={{
//                         width: "30%",
//                         borderRight: "1px solid #e8e8e8",
//                       }}
//                     >
//                       <div className={`${footerStyle.linesf3} fw-normal`}>
//                         Signature
//                       </div>
//                       <div className={footerStyle.linesf3}>
//                         <b>{headerData?.customerfirmname}</b>
//                       </div>
//                     </div>
//                     <div
//                       className={`${footerStyle.block2f3} ${style?.footers}`}
//                       style={{ width: "30%" }}
//                     >
//                       <div className={`${footerStyle.linesf3} fw-normal`}>
//                         Signature
//                       </div>
//                       <div className={footerStyle.linesf3}>
//                         <b>{headerData?.CompanyFullName}</b>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
//               {msg}
//             </p>
//           )}
//         </>
//       )}
//     </React.Fragment>
//   );
// };

// export default InvoicePrintD;













//oldddddddddddddddddddddddddddddddddddddddddddddddddddddddd
// // http://localhost:3000/?tkn=OTA2NTQ3MTcwMDUzNTY1MQ==&invn=U0sxOTU3MjAyNA==&evn=c2FsZSByZXR1cm4=&pnm=aW52b2ljZSBwcmludCBk&up=aHR0cDovL3plbi9qby9hcGktbGliL0FwcC9TYWxlQmlsbF9Kc29u&ctv=NzE=&ifid=PackingList3&pid=undefined
// import React, { useEffect, useState } from "react";
// import "../../assets/css/prints/InvoicePrintD.scss";
// import {
//   apiCall,
//   formatAmount,
//   handleImageError,
//   isObjectEmpty,
// } from "../../GlobalFunctions";
// import { OrganizeInvoicePrintData } from "../../GlobalFunctions/OrganizeInvoicePrintData";
// import Loader from "../../components/Loader";

// function InvoicePrintD({ token, invoiceNo, printName, urls, evn, ApiVer }) {
//   const [result, setResult] = useState(null);
//   const [msg, setMsg] = useState("");
//   const [loader, setLoader] = useState(true);
//   const [isImageWorking, setIsImageWorking] = useState(true);

//   useEffect(() => {
//     const sendData = async () => {
//       try {
//         const data = await apiCall(
//           token,
//           invoiceNo,
//           printName,
//           urls,
//           evn,
//           ApiVer
//         );
//         if (data?.Status === "200") {
//           let isEmpty = isObjectEmpty(data?.Data);
//           if (!isEmpty) {
//             loadData(data?.Data);
//             setLoader(false);
//           } else {
//             setLoader(false);
//             setMsg("Data Not Found");
//           }
//         } else {
//           setLoader(false);
//           setMsg(data?.Message);
//         }
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     sendData();
//   }, []);

//   const loadData = (data) => {
//     let address = data?.BillPrint_Json[0]?.Printlable?.split("\r\n");
//     data.BillPrint_Json[0].address = address;
//     const datas = OrganizeInvoicePrintData(
//       data?.BillPrint_Json[0],
//       data?.BillPrint_Json1,
//       data?.BillPrint_Json2
//     );
//     setResult(datas);
//   };

//   const handleImageErrors = () => {
//     setIsImageWorking(false);
//   };
//   console.log("ress", result);
//   return (
//     <div className="InvoicePrintD_main">
//       {loader ? (
//         <Loader />
//       ) : (
//         <>
//           {msg === "" ? (
//             <div className="packingListDemo_main_App">
//               <div style={{ marginBlock: "20px" }}>
//                 <button
//                   className="btn_white blue"
//                   id="printbtn"
//                   accessKey="p"
//                   onClick={() => window.print()}
//                 >
//                   Print
//                 </button>
//               </div>

// <div className="invo_p_d_topmain">
//   <div className="invo_p_d_topmain_box1">
//     <p className="invo_p_d_topmain_box_p">To,</p>
//     <p className="invo_p_d_topmain_box_p">
//       <b>{result?.header?.customerfirmname}</b>
//     </p>
//     <p className="invo_p_d_topmain_box_p">
//       {" "}
//       {result?.header?.customerAddress1}{" "}
//     </p>
//     <p className="invo_p_d_topmain_box_p">
//       {result?.header?.customerAddress2}
//     </p>
//     <p className="invo_p_d_topmain_box_p">
//       {result?.header?.customercity}
//       {result?.header?.PinCode}
//     </p>
//     <p className="invo_p_d_topmain_box_p">
//       {result?.header?.customeremail1}
//     </p>
//     <p className="invo_p_d_topmain_box_p">
//       {result?.header?.vat_cst_pan}
//     </p>
//     <p className="invo_p_d_topmain_box_p">
//       {result?.header?.Cust_CST_STATE}-
//       {result?.header?.Cust_CST_STATE_No}
//     </p>
//   </div>
//   <div className="invo_p_d_topmain_box2">
//     <p className="invo_p_d_topmain_box_p"> Ship To,</p>
//     <p className="invo_p_d_topmain_box_p">
//       <b>{result?.header?.customerfirmname}</b>
//     </p>
//     {result?.header?.address?.map((line, index) => (
//       <React.Fragment key={index}>
//         <p className="invo_p_d_topmain_box_p">{line}</p>
//       </React.Fragment>
//     ))}
//   </div>
//   <div className="invo_p_d_topmain_box3">
//     <p className="invo_p_d_topmain_box_p">
//       <b style={{ width: "100px", display: "flex" }}>BILL NO</b>{" "}
//       {result?.header?.InvoiceNo}
//     </p>
//     <p className="invo_p_d_topmain_box_p">
//       {" "}
//       <b style={{ width: "100px", display: "flex" }}>DATE </b>
//       {result?.header?.EntryDate}
//     </p>
//     <p className="invo_p_d_topmain_box_p">
//       <b style={{ width: "100px", display: "flex" }}>
//         {" "}
//         {result?.header?.HSN_No_Label}{" "}
//       </b>
//       {result?.header?.HSN_No}
//     </p>
//   </div>
// </div>

// <div className="invo_p_d_table_header_main">
//   <div className="invo_p_d__col1">
//     <p className="invo_p_d__col_title">DESCRIPTION</p>
//   </div>
//   <div className="invo_p_d__col2">
//     <p className="invo_p_d__col_title">Detail</p>
//   </div>
//   <div className="invo_p_d__col3">
//     <p className="invo_p_d__col_title">Gross Wt.</p>
//   </div>
//   <div className="invo_p_d__col4">
//     <p className="invo_p_d__col_title">Net Wt. </p>
//   </div>
//   <div className="invo_p_d__col5">
//     <p className="invo_p_d__col_title">Pcs</p>
//   </div>
//   <div className="invo_p_d__col6">
//     <p className="invo_p_d__col_title">Qty</p>
//   </div>
//   <div className="invo_p_d__col7">
//     <p className="invo_p_d__col_title">Rate</p>
//   </div>
//   <div className="invo_p_d__col8">
//     <p className="invo_p_d__col_title">Amount</p>
//   </div>
// </div>

//               <div>
//                 {result?.resultArray?.map((data, ind) => {
//                   return (
//                     <div className="invo_p_d_table_data_main">
//                       <div className="invo_p_d_data_col1">
//                         <p className="paking3_second_box_Title">
//                           DIAMOND STUDDED JEWELLERY
//                         </p>
//                         <b>Total Pcs : {result?.resultArray?.length}</b>
//                       </div>
//                       <div className="invo_p_d_data_col2">
//                         <div>
//                           {data?.designno}
//                           {data?.SrJobno}
//                         </div>
//                         <div>{data?.MetalColorCode}</div>
//                         <div>
//                           <img
//                             src={data?.DesignImage}
//                             style={{
//                               height: "75px",
//                               width: "75px",
//                               objectFit: "contain",
//                             }}
//                             onError={handleImageError}
//                           />
//                         </div>
//                         <div>
//                           {data?.PO}
//                           {data?.lineid}
//                           Tunch:{data?.Tunch}
//                           {data?.grosswt} gm Gross
//                         </div>
//                       </div>
//                       <div className="invo_p_d_data_col3">
//                         <div>
//                           {data?.diamonds?.map((e, i) => {
//                             return (
//                               <div className="paking3_col3_sub_div" key={i}>
//                                 <p className="paking3_col3_sub_div_more_sub1">
//                                   {" "}
//                                   {e?.ShapeName}
//                                 </p>
//                                 <p className="paking3_col3_sub_div_more_sub2">
//                                   {e?.SizeName}
//                                 </p>
//                                 <p className="paking3_col3_sub_div_more_sub3">
//                                   {e?.Pcs}
//                                 </p>
//                                 <p className="paking3_col3_sub_div_more_sub4">
//                                   {e?.Wt}
//                                 </p>
//                                 <p className="paking3_col3_sub_div_more_sub5">
//                                   {e?.Rate}
//                                 </p>
//                                 <p className="paking3_col3_sub_div_more_sub6">
//                                   {e?.Amount / result?.header?.CurrencyExchRate}
//                                 </p>
//                               </div>
//                             );
//                           })}
//                         </div>
//                         <div className="paking3_col3_sub_div_totalValue">
//                           <p className="paking3_col3_sub_div_more_sub1"></p>
//                           <p className="paking3_col3_sub_div_more_sub2"></p>
//                           <p className="paking3_col3_sub_div_more_sub3">
//                             {data?.totals?.diamonds?.Pcs}
//                           </p>
//                           <p className="paking3_col3_sub_div_more_sub4">
//                             {data?.totals?.diamonds?.Wt}
//                           </p>
//                           <p className="paking3_col3_sub_div_more_sub5"></p>
//                           <p className="paking3_col3_sub_div_more_sub6">
//                             {data?.totals?.diamonds?.Amount /
//                               result?.header?.CurrencyExchRate}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="invo_p_d_data_col4">
//                         <div className="paking3_col4_sub_div">
//                           <p className="paking3_col4_sub_div_finalValus">
//                             {" "}
//                             {data?.MetalType}
//                             {data?.MetalPurity}
//                           </p>
//                           <p className="paking3_col4_sub_div_finalValus">
//                             {data?.grosswt}
//                           </p>
//                           <p className="paking3_col4_sub_div_finalValus">
//                             {data?.NetWt + data?.LossWt}
//                           </p>
//                           <p className="paking3_col4_sub_div_finalValus">
//                             {data?.metal_rate}
//                           </p>
//                           <p className="paking3_col4_sub_div_finalValus">
//                             {data?.MetalAmount}
//                           </p>
//                         </div>
//                         <div className="paking3_col4_sub_div_value">
//                           <p className="paking3_col4_sub_div_finalValus"></p>
//                           <p className="paking3_col4_sub_div_finalValus">
//                             {data?.grosswt}
//                           </p>
//                           <p className="paking3_col4_sub_div_finalValus">
//                             {data?.NetWt + data?.LossWt}
//                           </p>
//                           <p className="paking3_col4_sub_div_finalValus"></p>
//                           <p className="paking3_col4_sub_div_finalValus">
//                             {data?.MetalAmount}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="invo_p_d_data_col5">
//                         <div>
//                           {data?.colorstone?.map((e, i) => {
//                             return (
//                               <div className="paking3_col5_sub_div" key={i}>
//                                 <p className="paking3_col5_sub_div_finalValus">
//                                   {e?.ShapeName}
//                                 </p>
//                                 <p className="paking3_col5_sub_div_finalValus">
//                                   {e?.SizeName}
//                                 </p>
//                                 <p className="paking3_col5_sub_div_finalValus">
//                                   {e?.Pcs}
//                                 </p>
//                                 <p className="paking3_col5_sub_div_finalValus">
//                                   {e?.Wt}
//                                 </p>
//                                 <p className="paking3_col5_sub_div_finalValus">
//                                   {e?.Rate}
//                                 </p>
//                                 <p className="paking3_col5_sub_div_finalValus">
//                                   {e?.Amount / result?.header?.CurrencyExchRate}
//                                 </p>
//                               </div>
//                             );
//                           })}
//                           {data?.misc?.map((e, i) => {
//                             return (
//                               <div className="paking3_col5_sub_div" key={i}>
//                                 <p className="paking3_col5_sub_div_finalValus">
//                                   M:{e?.ShapeName}
//                                 </p>
//                                 <p className="paking3_col5_sub_div_finalValus">
//                                   {e?.SizeName}
//                                 </p>
//                                 <p className="paking3_col5_sub_div_finalValus">
//                                   {e?.Pcs}
//                                 </p>
//                                 <p className="paking3_col5_sub_div_finalValus">
//                                   {e?.Wt}
//                                 </p>
//                                 <p className="paking3_col5_sub_div_finalValus">
//                                   {e?.Rate}
//                                 </p>
//                                 <p className="paking3_col5_sub_div_finalValus">
//                                   {e?.Amount / result?.header?.CurrencyExchRate}
//                                 </p>
//                               </div>
//                             );
//                           })}
//                         </div>
//                         <div
//                           className="paking3_col5_sub_div"
//                           style={{ backgroundColor: "#f5f5f5" }}
//                         >
//                           <p className="paking3_col5_sub_div_finalValus"></p>
//                           <p className="paking3_col5_sub_div_more_sub2"></p>
//                           <p className="paking3_col5_sub_div_more_sub3">
//                             {data?.totals?.colorstone?.Pcs +
//                               data?.totals?.misc?.Pcs}
//                           </p>
//                           <p className="paking3_col5_sub_div_more_sub4">
//                             {data?.totals?.colorstone?.Wt +
//                               data?.totals?.misc?.Wt}
//                           </p>
//                           <p className="paking3_col5_sub_div_more_sub5"></p>
//                           <p className="paking3_col5_sub_div_more_sub6">
//                             {(data?.totals?.colorstone?.Amount +
//                               data?.totals?.misc?.Amount) /
//                               result?.header?.CurrencyExchRate}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="invo_p_d_data_col6">
//                         <div className="paking3_col6_sub_div">
//                           <p className="paking3_col6_sub_div_finalValus">
//                             Labour
//                           </p>
//                           <p className="paking3_col6_sub_div_finalValus">
//                             {data?.MaKingCharge_Unit}
//                           </p>
//                           <p className="paking3_col6_sub_div_finalValus">
//                             {data?.MakingAmount}
//                           </p>
//                         </div>
//                         <div
//                           className="paking3_col6_sub_div"
//                           style={{ backgroundColor: "#f5f5f5" }}
//                         >
//                           <p className="paking3_col6_sub_div_p"></p>
//                           <p className="paking3_col6_sub_div_p"></p>
//                           <p className="paking3_col6_sub_div_p_last">
//                             {data?.MakingAmount}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="invo_p_d_data_col7">
//                         <p className="paking3_second_box_Title">
//                           {data?.TotalAmount}
//                         </p>

//                         <p
//                           className="paking3_second_box_Title"
//                           style={{
//                             backgroundColor: "#f5f5f5",
//                             width: "100%",
//                           }}
//                         >
//                           {data?.TotalAmount}
//                         </p>
//                       </div>
//                       <div className="invo_p_d_data_col8">
//                         <p className="paking3_second_box_Title">
//                           {data?.TotalAmount}
//                         </p>

//                         <p
//                           className="paking3_second_box_Title"
//                           style={{
//                             backgroundColor: "#f5f5f5",
//                             width: "100%",
//                           }}
//                         >
//                           {data?.TotalAmount}
//                         </p>
//                       </div>
//                     </div>
//                   );
//                 })}
//                 <div
//                   className="paking3_second_box_top_title"
//                   style={{ backgroundColor: "#f5f5f5" }}
//                 >
//                   <div className="paking3_col1"></div>
//                   <div className="paking3_col2">Total</div>
//                   <div className="paking3_col3">
//                     <div className="paking3_col3_sub_div">
//                       <p className="paking3_col3_sub_div_more_sub1"></p>
//                       <p className="paking3_col3_sub_div_more_sub2"></p>
//                       <p className="paking3_col3_sub_div_more_sub3">
//                         {result?.mainTotal?.diamonds?.Pcs}
//                       </p>
//                       <p className="paking3_col3_sub_div_more_sub4">
//                         {" "}
//                         {result?.mainTotal?.diamonds?.Wt}
//                       </p>
//                       <p className="paking3_col3_sub_div_more_sub5"></p>
//                       <p className="paking3_col3_sub_div_more_sub6">
//                         {result?.mainTotal?.diamonds?.Amount /
//                           result?.header?.CurrencyExchRate}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="paking3_col4">
//                     <div className="paking3_col4_sub_div">
//                       <p className="paking3_col4_sub_div_p"></p>
//                       <p className="paking3_col4_sub_div_p">
//                         {result?.mainTotal?.grosswt}
//                       </p>
//                       <p className="paking3_col4_sub_div_p">
//                         {result?.mainTotal?.NetWt + result?.mainTotal?.LossWt}
//                       </p>
//                       <p
//                         className="paking3_col4_sub_div_p_last"
//                         style={{ width: "40%" }}
//                       >
//                         {result?.mainTotal?.metal?.Amount /
//                           result?.header?.CurrencyExchRate}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="paking3_col5">
//                     <div className="paking3_col3_sub_div">
//                       <p className="paking3_col3_sub_div_more_sub1"></p>
//                       <p className="paking3_col3_sub_div_more_sub2"></p>
//                       <p className="paking3_col3_sub_div_more_sub3">
//                         {result?.mainTotal?.colorstone?.Pcs}
//                       </p>
//                       <p className="paking3_col3_sub_div_more_sub4">
//                         {result?.mainTotal?.colorstone?.Wt}
//                       </p>
//                       <p className="paking3_col3_sub_div_more_sub5"></p>
//                       <p className="paking3_col3_sub_div_more_sub6">
//                         {result?.mainTotal?.colorstone?.Amount /
//                           result?.header?.CurrencyExchRate}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="paking3_col6">
//                     <div className="paking3_col6_sub_div">
//                       {/* <p className="paking3_col6_sub_div_p"></p>
//                               <p className="paking3_col6_sub_div_p"></p> */}
//                       <p
//                         className="paking3_col6_sub_div_p_last"
//                         style={{ width: "100%" }}
//                       >
//                         {formatAmount(result?.mainTotal?.MakingAmount) /
//                           result?.header?.CurrencyExchRate}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="paking3_col7">
//                     <p className="paking3_second_box_Title">
//                       {formatAmount(result?.mainTotal?.TotalAmount) /
//                         result?.header?.CurrencyExchRate}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//               <div
//                 style={{
//                   padding: "4px",
//                   display: "flex",
//                   justifyContent: "flex-end",
//                 }}
//               >
//                 <div>
//                   <div className="paking3_total_div">
//                     <p>Total Amount</p>
//                     {formatAmount(result?.mainTotal?.TotalAmount)}
//                   </div>
//                   {result?.allTaxes?.map((data, index) => {
//                     return (
//                       <div className="paking3_total_div" key={index}>
//                         <p>
//                           {data?.name} @ {data?.per}
//                         </p>
//                         {data?.amountInNumber}
//                       </div>
//                     );
//                   })}
//                   <div className="paking3_total_div">
//                     <p>{result?.header?.AddLess >= 0 ? "Add" : "Less"}</p>
//                     {formatAmount(result?.header?.AddLess)}
//                   </div>
//                   <div className="paking3_total_div">
//                     <p>Final Amount</p>
//                     {formatAmount(
//                       (result?.mainTotal?.TotalAmount +
//                         result?.header?.AddLess +
//                         result?.header?.FreightCharges +
//                         result?.allTaxesTotal) /
//                         result?.header?.CurrencyExchRate
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <div className="paking3__bottomSection_main">
//                 <div className="paking3__bottomSection_Box1">
//                   <div className="paking3__bottomSection_Box1_subBox1">
//                     <div>
//                       <p
//                         style={{
//                           backgroundColor: "#f1f1f1",
//                           borderBottom: "1px solid #bdbdbd",
//                         }}
//                       >
//                         <b>SUMMARY</b>
//                       </p>
//                     </div>
//                     <div style={{ display: "flex" }}>
//                       <div
//                         style={{
//                           width: "50%",
//                           borderRight: "1px solid #bdbdbd",
//                           padding: "3px",
//                         }}
//                       >
//                         <div className="paking3__bottomSection_Box1_subBox1_summury">
//                           <p>
//                             <b>GOLD IN 24KT </b>
//                           </p>
//                           <p>54565 gm</p>
//                         </div>
//                         <div className="paking3__bottomSection_Box1_subBox1_summury">
//                           <p>
//                             <b>GROSS WT</b>
//                           </p>
//                           <p>{result?.mainTotal?.grosswt?.toFixed(3)} gm</p>
//                         </div>
//                         <div className="paking3__bottomSection_Box1_subBox1_summury">
//                           <p>
//                             <b>NET WT</b>
//                           </p>
//                           <p>
//                             {(
//                               result?.mainTotal?.NetWt +
//                               result?.mainTotal?.LossWt
//                             )?.toFixed(3)}{" "}
//                             gm
//                           </p>
//                         </div>
//                         <div className="paking3__bottomSection_Box1_subBox1_summury">
//                           <p>
//                             <b>LOSSS WT</b>
//                           </p>
//                           <p>{result?.mainTotal?.LossWt?.toFixed(3)} gm</p>
//                         </div>
//                         <div className="paking3__bottomSection_Box1_subBox1_summury">
//                           <p>
//                             <b>DIAMOND WT</b>
//                           </p>
//                           <p>
//                             {result?.mainTotal?.diamonds?.Pcs} /{" "}
//                             {result?.mainTotal?.diamonds?.Wt?.toFixed(3)} cts
//                           </p>
//                         </div>
//                         <div className="paking3__bottomSection_Box1_subBox1_summury">
//                           <p>
//                             <b>STONE WT</b>
//                           </p>
//                           <p>
//                             {result?.mainTotal?.colorstone?.Pcs} /{" "}
//                             {result?.mainTotal?.colorstone?.Wt?.toFixed(3)} cts
//                           </p>
//                         </div>
//                       </div>
//                       <div
//                         style={{
//                           width: "50%",
//                           padding: "3px",
//                         }}
//                       >
//                         <div className="paking3__bottomSection_Box1_subBox1_summury">
//                           <p>
//                             <b>GOLD </b>
//                           </p>
//                           <p>54565 gm</p>
//                         </div>
//                         <div className="paking3__bottomSection_Box1_subBox1_summury">
//                           <p>
//                             <b>DIAMOND</b>
//                           </p>
//                           <p>
//                             {" "}
//                             {formatAmount(result?.mainTotal?.diamonds?.Amount) /
//                               result?.header?.CurrencyExchRate}
//                           </p>
//                         </div>
//                         <div className="paking3__bottomSection_Box1_subBox1_summury">
//                           <p>
//                             <b>CST</b>
//                           </p>
//                           <p>
//                             {formatAmount(
//                               result?.mainTotal?.colorstone?.Amount /
//                                 result?.header?.CurrencyExchRate
//                             )}
//                           </p>
//                         </div>
//                         <div className="paking3__bottomSection_Box1_subBox1_summury">
//                           <p>
//                             <b>MISC</b>
//                           </p>
//                           <p>
//                             {formatAmount(
//                               result?.mainTotal?.misc?.IsHSCODE_0_amount /
//                                 result?.header?.CurrencyExchRate
//                             )}
//                           </p>
//                         </div>
//                         <div className="paking3__bottomSection_Box1_subBox1_summury">
//                           <p>
//                             <b>MAKING</b>
//                           </p>
//                           <p>
//                             {formatAmount(
//                               (result?.mainTotal?.MakingAmount +
//                                 result?.mainTotal?.diamonds?.SettingAmount +
//                                 result?.mainTotal?.colorstone?.SettingAmount) /
//                                 result?.header?.CurrencyExchRate
//                             )}
//                           </p>
//                         </div>
//                         <div className="paking3__bottomSection_Box1_subBox1_summury">
//                           <p>
//                             <b>OTHER</b>
//                           </p>
//                           <p>{formatAmount(result?.mainTotal?.OtherCharges)}</p>
//                         </div>
//                         <div className="paking3__bottomSection_Box1_subBox1_summury">
//                           <p>
//                             <b>
//                               {result?.header?.AddLess >= 0 ? "ADD" : "LESS"}
//                             </b>
//                           </p>
//                           <p>{formatAmount(result?.header?.AddLess)}</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="paking3__bottomSection_Box1_subBox2">
//                     <div>
//                       <p
//                         style={{
//                           backgroundColor: "#f1f1f1",
//                           borderBottom: "1px solid #bdbdbd",
//                         }}
//                       >
//                         <b> Diamond Detail</b>
//                       </p>
//                       <div
//                         style={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           padding: "2px",
//                         }}
//                       >
//                         <p>OTHERS</p>
//                         <p>0 / 0.000 cts</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="paking3__bottomSection_Box2">
//                   <div style={{ width: "50%" }}>
//                     <div className="paking3__bottomSection_Box2_subBox1">
//                       <p
//                         style={{
//                           backgroundColor: "#f1f1f1",
//                           borderBottom: "1px solid #bdbdbd",
//                         }}
//                       >
//                         <b>OTHER DETAILS</b>
//                       </p>
//                       <div
//                         style={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           padding: "2px",
//                         }}
//                       >
//                         <p>RATE IN 24KT</p>
//                         <p>7800.00</p>
//                       </div>
//                     </div>
//                   </div>
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       width: "50%",
//                     }}
//                   >
//                     <div className="paking3__bottomSection_Box2_subBox2">
//                       <p style={{ display: "flex", margin: "0px" }}>
//                         Created By
//                       </p>
//                     </div>
//                     <div className="paking3__bottomSection_Box2_subBox3">
//                       <p style={{ display: "flex", margin: "0px" }}>
//                         Created By
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
//               {" "}
//               {msg}{" "}
//             </p>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

// export default InvoicePrintD;
