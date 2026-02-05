// http://localhost:3000/?tkn=OTA2NTQ3MTcwMDUzNTY1MQ==&invn=Yi1ib29rMTIz&evn=c2FsZQ==&pnm=dGF4IGludm9pY2UgYQ==&up=aHR0cDovL256ZW4vam8vYXBpLWxpYi9BcHAvU2FsZUJpbGxfSnNvbg==&ctv=NzE=&ifid=DetailPrintR&pid=undefined
import React, { useEffect } from "react";
import "../../assets/css/prints/TaxInvoiceA.scss";
import { useState } from "react";
import {
  NumberWithCommas,
  apiCall,
  brokarageDetail,
  checkMsg,
  fixedValues,
  formatAmount,
  handleImageError,
  handlePrint,
  isObjectEmpty,
  otherAmountDetail,
  taxGenrator,
} from "../../GlobalFunctions";
import Loader from "../../components/Loader";
import { cloneDeep } from "lodash";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";
import { MetalShapeNameWiseArr } from "../../GlobalFunctions/MetalShapeNameWiseArr";
import watermarkimg from "../../assets/img/watermark.png";
import signatureLogo from "../../assets/img/signatureLogo.png";
import { ToWords } from "to-words";

const TaxInvoiceA = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {
  const [image, setImage] = useState(false);
  const [loader, setLoader] = useState(true);
  const [json0Data, setJson0Data] = useState({});
  const [json1Data, setJson1Data] = useState([]);
  const [json1Data2, setJson1Data2] = useState([]);
  const [MetShpWise, setMetShpWise] = useState([]);
  const toWords = new ToWords();
  const [notGoldMetalTotal, setNotGoldMetalTotal] = useState(0);
  const [notGoldMetalWtTotal, setNotGoldMetalWtTotal] = useState(0);
  const [evtName, setEvtName] = useState(atob(evn).toLowerCase());
  // eslint-disable-next-line no-unused-vars
  const [detailtPrintR, setdetailtPrintR] = useState(
    atob(printName).toLowerCase() === "detail print r" ? true : false
  );
  const [detailtPrintL, setdetailtPrintL] = useState(
    atob(printName).toLowerCase() === "detail print1 (l)" ? true : false
  );

  const [detailtPrintp, setdetailtPrintp] = useState(
    atob(printName).toLowerCase() === "detail print1 (p)" ? true : false
  );

  const [dp1lp, setdp1lp] = useState(
    atob(printName).toLowerCase() === "detail print1 (l)" ||
      atob(printName).toLowerCase() === "detail print1 (p)"
      ? true
      : false
  );
  const [dpp, setdpp] = useState(
    atob(printName).toLowerCase() === "detail print1 (p)" ? true : false
  );

  const [brokarage, setBrokarage] = useState([]);
  const [msg, setMsg] = useState("");
  const [total, setTotal] = useState({
    diamondPcs: 0,
    diamondWt: 0,
    diamondAmount: 0,
    metalWt: 0,
    metalNL: 0,
    metalAmount: 0,
    colorStonePcs: 0,
    colorStoneWt: 0,
    colorStoneAmount: 0,
    totalAmount: 0,
    discountTotalAmount: 0,
    sgstAmount: 0,
    cgstAmount: 0,
    withoutDiscountTotalAmount: 0,
    withDiscountTaxAmount: 0,
    labourAmount: 0,
    netWt: 0,
  });
  const [summary, setSummary] = useState({
    gold24Kt: 0,
    grossWt: 0,
    gDWt: 0,
    netWt: 0,
    diamondWt: 0,
    diamondpcs: 0,
    stoneWt: 0,
    stonePcs: 0,
    metalAmount: 0,
    diamondAmount: 0,
    colorStoneAmount: 0,
    makingAmount: 0,
    otherCharges: 0,
    addLess: 0,
    total: 0,
  });
  const [totalMetalWts, settotalMetalWts] = useState(0);
  const [address, setAddress] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [detailPrintK, setDetailPrintK] = useState(
    atob(printName).toLowerCase() === "detail print k" ? true : false
  );
  const [checkBox, setCheckBox] = useState({
    image: true,
    brokarage: true,
  });
  const [checkBoxNew, setCheckBoxNew] = useState("Triplicate for Supplier");

  const [finalD, setFinalD] = useState({});

  const [diamondDetails, setDiamondDetails] = useState([]);
  const [isImageWorking, setIsImageWorking] = useState(true);
  const handleImageErrors = () => {
    setIsImageWorking(false);
  };

  const handleChange = (e) => {
    const { name, checked } = e?.target;
    setCheckBox({ ...checkBox, [name]: checked });
  };

  const handleChangeNew = (label) => {
    setCheckBoxNew(label);
  };

  const options = [
    "Triplicate for Supplier",
    "Duplicate for Transporter",
    "Original for Recipient",
  ];

  const optionsMemo = [
    "Original for Consignee",
    "Duplicate for Transporter",
    "Triplicate for Consignor",
  ];

  // eslint-disable-next-line no-unused-vars
  const findDiamond = (obj, diamondArr) => {
    let recordIndex = diamondArr.findIndex(
      (e, i) =>
        e?.ShapeName === obj?.ShapeName &&
        e?.QualityName === obj?.QualityName &&
        e?.Colorname === obj?.Colorname
    );
    return recordIndex;
  };

  const loadData = (data) => {
    let label = data?.BillPrint_Json[0]?.Printlable?.split("\r\n");
    setAddress(label);
    setJson0Data(data?.BillPrint_Json[0]);
    setJson1Data2(data?.BillPrint_Json2);
    setLoader(false);
    let address = data?.BillPrint_Json[0]?.Printlable?.split("\r\n");
    data.BillPrint_Json[0].address = address;
    let datas = OrganizeDataPrint(
      data?.BillPrint_Json[0],
      data?.BillPrint_Json1,
      data?.BillPrint_Json2
    );

    let met_shp_arr = MetalShapeNameWiseArr(datas?.json2);

    setMetShpWise(met_shp_arr);
    let tot_met = 0;
    let tot_met_wt = 0;

    met_shp_arr?.forEach((e) => {
      tot_met += e?.Amount;
      tot_met_wt += e?.metalfinewt;
    });
    setNotGoldMetalWtTotal(tot_met_wt);
    setNotGoldMetalTotal(tot_met);

    let finalArr = [];
    let totalMetalWt = 0;
    let miscChargesTotals = 0;
    datas?.resultArray?.map((e, i) => {
      let primaryMetalWt = 0;
      let otherMisc = e?.OtherCharges + e?.MiscAmount + e?.TotalDiamondHandling;
      let findMetal = e?.metal?.find((ele, ind) => ele?.IsPrimaryMetal === 1);
      if (findMetal !== undefined) {
        primaryMetalWt = findMetal?.Wt;
        totalMetalWt += findMetal?.Wt;
      }
      let obj = cloneDeep(e);
      let miscChargesTotal = e?.OtherCharges + e?.TotalDiamondHandling;
      let miscChargesss = 0;
      let miscCharges = data?.BillPrint_Json2?.filter((ele, ind) => {
        if (ele?.MasterManagement_DiamondStoneTypeid === 3) {
          if (ele?.IsHSCOE !== 0 && ele?.StockBarcode === e?.SrJobno) {
            // miscChargesTotal += ele?.Amount;
            miscChargesTotal += ele?.Amount;
            return ele;
          } else if (ele?.IsHSCOE === 0 && ele?.StockBarcode === e?.SrJobno) {
            miscChargesss += ele?.Amount;
            miscChargesTotal += ele?.Amount;
          }
        }
      });

      miscChargesTotals += miscChargesTotal;
      obj.primaryMetalWt = primaryMetalWt;
      obj.otherMisc = otherMisc;
      obj.miscCharges = miscCharges;
      obj.miscChargesTotal = miscChargesTotal;
      obj.miscChargesss = miscChargesss;
      finalArr.push(obj);
    });
    datas.mainTotal.miscChargesTotals = miscChargesTotals;
    settotalMetalWts(totalMetalWt);
    datas.resultArray = finalArr;
    datas?.resultArray?.sort((a, b) => b.id - a.id);
    setFinalD(datas);
    let brok = brokarageDetail(data?.BillPrint_Json[0]?.Brokerage);
    setBrokarage(brok);
    let diamondDetail = [];
    data?.BillPrint_Json2?.forEach((e, i) => {
      if (e?.MasterManagement_DiamondStoneTypeid === 1) {
        let findDiamond = diamondDetail?.findIndex(
          (ele, ind) =>
            ele?.ShapeName === e?.ShapeName &&
            ele?.QualityName === e?.QualityName &&
            ele?.Colorname === e?.Colorname
        );
        if (findDiamond === -1) {
          diamondDetail.push(e);
        } else {
          diamondDetail[findDiamond].Pcs += e?.Pcs;
          diamondDetail[findDiamond].Wt += e?.Wt;
          diamondDetail[findDiamond].Amount += e?.Amount;
        }
      }
    });
    let findRND = [];
    let remaingDia = [];
    diamondDetail?.forEach((ele, ind) => {
      if (ele?.ShapeName === "RND") {
        findRND.push(ele);
      } else {
        remaingDia.push(ele);
      }
    });
    let resultArr = [];
    findRND.sort((a, b) => {
      if (a.ShapeName !== b.ShapeName) {
        return a.ShapeName.localeCompare(b.ShapeName); // Sort by ShapeName
      } else if (a.QualityName !== b.QualityName) {
        return a.QualityName.localeCompare(b.QualityName); // If ShapeName is same, sort by QualityName
      } else {
        return a.Colorname.localeCompare(b.Colorname); // If QualityName is same, sort by Colorname
      }
    });

    remaingDia.sort((a, b) => {
      if (a.ShapeName !== b.ShapeName) {
        return a.ShapeName.localeCompare(b.ShapeName); // Sort by ShapeName
      } else if (a.QualityName !== b.QualityName) {
        return a.QualityName.localeCompare(b.QualityName); // If ShapeName is same, sort by QualityName
      } else {
        return a.Colorname.localeCompare(b.Colorname); // If QualityName is same, sort by Colorname
      }
    });
    if (findRND?.length > 6) {
      let arr = findRND.slice(0, 6);
      let anotherArr = [...findRND.slice(6), remaingDia].flat();
      let obj = { ...anotherArr[0] };
      anotherArr?.reduce((acc, cobj) => {
        obj.Pcs += cobj?.Pcs;
        obj.Wt += cobj?.Wt;
        obj.Amount += cobj?.Amount;
      }, obj);
      obj.ShapeName = "OTHER";
      resultArr = [...arr, obj].flat();
    } else {
      let arr = [...findRND].flat();
      let smallArr = [...remaingDia.slice(0, 6 - findRND?.length)].flat();
      let largeArr = [...remaingDia.slice(6 - findRND?.length)].flat();
      let finalArr = [...arr, ...smallArr].flat();

      let obj = { ...largeArr[0] };
      obj.Pcs = 0;
      obj.Wt = 0;
      obj.Amount = 0;
      largeArr?.reduce((acc, cobj) => {
        obj.Pcs += cobj?.Pcs;
        obj.Wt += cobj?.Wt;
        obj.Amount += cobj?.Amount;
      }, obj);
      obj.ShapeName = "OTHER";
      resultArr = [...finalArr, obj].flat();
    }
    setDiamondDetails(resultArr);
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
            let arr = organizeDataSample(
              data?.Data?.BillPrint_Json[0],
              data?.Data?.BillPrint_Json1,
              data?.Data?.BillPrint_Json2
            );
            setJson1Data(arr);
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

  const organizeDataSample = (hr, ar1, ar2) => {
    let resultArr = [];
    let totals = {
      diamondPcs: 0,
      diamondWt: 0,
      diamondAmount: 0,
      metalWt: 0,
      metalNL: 0,
      metalAmount: 0,
      colorStonePcs: 0,
      colorStoneWt: 0,
      colorStoneAmount: 0,
      totalAmount: 0,
      discountTotalAmount: 0,
      sgstAmount: 0,
      cgstAmount: 0,
      withoutDiscountTotalAmount: 0,
      withDiscountTaxAmount: 0,
      labourAmount: 0,
      netWt: 0,
    };

    let summary = {
      gold24Kt: 0,
      grossWt: 0,
      gDWt: 0,
      netWt: 0,
      diamondWt: 0,
      diamondpcs: 0,
      stoneWt: 0,
      stonePcs: 0,
      metalAmount: 0,
      diamondAmount: 0,
      colorStoneAmount: 0,
      makingAmount: 0,
      otherCharges: 0,
      addLess: 0,
      total: 0,
    };

    // eslint-disable-next-line array-callback-return
    ar1?.map((e) => {
      let metalWt = 0;
      if (detailtPrintR || detailtPrintL || detailtPrintp) {
        summary.gold24Kt = summary.gold24Kt + e?.PureNetWt;
      }
      if (detailPrintK) {
        summary.gold24Kt += e.PureNetWt;
      }
      let totalAmounts = e?.DiscountAmt + e?.TotalAmount;
      let OtherAmountDetail = otherAmountDetail(e?.OtherAmtDetail);
      let totalOther =
        e?.OtherCharges + e?.MiscAmount + e?.TotalDiamondHandling;
      totals.labourAmount +=
        e?.MakingAmount + e?.TotalCsSetcost + e?.TotalDiaSetcost;
      let obj = { ...e };
      obj.OtherAmountDetail = OtherAmountDetail;
      obj.totalOther = totalOther;
      obj.SettingAmount = 0;
      let diamondArr = [];
      let metalArr = [];
      let colorStoneArr = [];
      let otherMisc = e?.OtherCharges + e?.MiscAmount + e?.TotalDiamondHandling;
      let primaryMetalWt = 0;
      let diamondsTotal = {
        Pcs: 0,
        Wt: 0,
        Amount: 0,
        RMwt: 0,
      };
      let metalTotal = {
        Pcs: 0,
        Wt: 0,
        Amount: 0,
      };
      let colorStonesTotal = {
        Pcs: 0,
        Wt: 0,
        Amount: 0,
      };
      let discountTotalAmount = 0;

      // eslint-disable-next-line array-callback-return
      ar2?.map((el) => {
        if (e?.SrJobno === el?.StockBarcode) {
          if (el?.MasterManagement_DiamondStoneTypeid === 1) {
            diamondArr.push(el);
            diamondsTotal.Pcs += el?.Pcs;
            diamondsTotal.Wt += el?.Wt;
            diamondsTotal.Amount += el?.Amount;
            diamondsTotal.RMwt += el?.RMwt;
            totals.diamondPcs += el?.Pcs;
            totals.diamondWt += el?.Wt;
            totals.diamondAmount += el?.Amount;
            summary.diamondWt += el?.Wt;
            summary.diamondpcs += el?.Pcs;
            summary.diamondAmount += el?.Amount;
            metalWt += el?.Wt;
          }
          if (el?.MasterManagement_DiamondStoneTypeid === 4) {
            metalArr.push(el);
            metalTotal.Pcs += el?.Pcs;
            metalTotal.Wt += el?.Wt;
            metalTotal.Amount += el?.Amount;
            if (!detailtPrintR) {
              if (!detailPrintK) {
                summary.gold24Kt += el?.FineWt;
              }
            }
            if (el?.IsPrimaryMetal === 1) {
              primaryMetalWt += el?.Wt;
            }
            // totals.metalWt += el?.Wt;
            totals.metalAmount += el?.Amount;
            summary.metalAmount += el?.Amount;
          }
          if (el?.MasterManagement_DiamondStoneTypeid === 2) {
            colorStoneArr.push(el);
            colorStonesTotal.Pcs += el?.Pcs;
            colorStonesTotal.Wt += el?.Wt;
            colorStonesTotal.Amount += el?.Amount;
            totals.colorStonePcs += el?.Pcs;
            totals.colorStoneWt += el?.Wt;
            totals.colorStoneAmount += el?.Amount;
            summary.stoneWt += el?.Wt;
            summary.stonePcs += el?.Pcs;
            summary.colorStoneAmount += el?.Amount;
          }
          obj.SettingAmount += el?.SettingAmount;
          summary.makingAmount += el?.SettingAmount;
        }
      });

      metalWt = metalWt / 5 + e?.NetWt;
      totals.metalWt += metalWt;
      // totals.metalWt += e?.DiamondCTWwithLoss / 5;
      metalTotal.Wt = metalWt;
      // discountTotalAmount = e?.TotalAmount - e?.DiscountAmt;
      discountTotalAmount = e?.TotalAmount;
      summary.grossWt += e?.grosswt;
      summary.gDWt += e?.MetalDiaWt + e?.DiamondCTWwithLoss / 5;
      summary.netWt += e?.NetWt;
      summary.makingAmount += e?.MakingAmount;
      // summary.otherCharges += e?.OtherCharges;
      summary.otherCharges += totalOther;
      obj.diamonds = diamondArr;
      obj.primaryMetalWt = primaryMetalWt;
      obj.metals = metalArr;
      obj.colorStones = colorStoneArr;
      obj.diamondsTotal = diamondsTotal;
      obj.metalTotal = metalTotal;
      obj.colorStonesTotal = colorStonesTotal;
      obj.discountTotalAmount = discountTotalAmount;
      obj.totalAmounts = totalAmounts;
      obj.otherMisc = otherMisc;
      if (obj.metals[0]) {
        obj.metals[0].Wt = metalWt;
      }
      totals.totalAmount += e?.TotalAmount;
      totals.discountTotalAmount += obj?.DiscountAmt;
      totals.withoutDiscountTotalAmount += e?.TotalAmount;
      totals.netWt += e?.NetWt + e?.LossWt;
      resultArr.push(obj);
      // setDiamondDetails(diamondDetails);
    });
    summary.addLess = hr?.AddLess;
    summary.total =
      summary?.metalAmount +
      summary?.diamondAmount +
      summary?.colorStoneAmount +
      summary?.makingAmount +
      summary?.otherCharges +
      summary?.addLess;
    totals.cgstAmount = (totals?.withoutDiscountTotalAmount * hr?.CGST) / 100;
    totals.sgstAmount = (totals?.withoutDiscountTotalAmount * hr?.SGST) / 100;
    let taxValue = taxGenrator(hr, totals?.totalAmount);
    setTaxes(taxValue);
    taxValue?.length > 0 &&
      taxValue.forEach((e, i) => {
        totals.withDiscountTaxAmount += +e?.amount;
      });
    totals.withDiscountTaxAmount +=
      hr?.AddLess + totals?.totalAmount - hr?.Privilege_discount;
    setSummary(summary);
    setTotal(totals);
    return resultArr;
  };

  const d = json1Data2?.reduce((grouped, ee) => {
    if (
      ee?.MasterManagement_DiamondStoneTypeid === 1 &&
      ee?.ShapeName === "Round"
    ) {
      const key = `${ee?.ShapeName} ${ee?.QualityName} ${ee?.Colorname}`;

      if (!grouped[key]) {
        grouped[key] = [];
      }

      grouped[key].push(ee);
    }
    return grouped;
  }, {});

  const er = json1Data2?.reduce((grouped, ei) => {
    if (
      ei?.MasterManagement_DiamondStoneTypeid === 1 &&
      ei?.ShapeName !== "Round"
    ) {
      const key = `${ei?.ShapeName} ${ei?.QualityName} ${ei?.Colorname}`;

      if (!grouped[key]) {
        grouped[key] = [];
      }

      grouped[key].push(ei);
    }
    return grouped;
  }, {});

  const calculatedData = [];
  const calData = [];

  for (const key in d) {
    if (d.hasOwnProperty(key)) {
      const group = d[key];

      const totalPcs = group?.reduce((sum, item) => sum + item.Pcs, 0);
      const totalWt = group?.reduce((sum, item) => sum + item.Wt, 0);

      calculatedData.push({
        ShapeName: key,
        totalPcs,
        totalWt,
      });
    }
  }
  for (const key in er) {
    if (er.hasOwnProperty(key)) {
      const group = er[key];

      const totalPcs = group.reduce((sum, item) => sum + item.Pcs, 0);
      const totalWt = group.reduce((sum, item) => sum + item.Wt, 0);

      calData.push({
        ShapeName: key,
        totalPcs,
        totalWt,
      });
    }
  }
  let totalPcs1 = 0;
  let totalWt1 = 0;

  for (const obj of calData) {
    totalPcs1 += obj.totalPcs;
    totalWt1 += obj.totalWt;
  }
  let other = {
    ShapeName: "OTHER",
    totalPcs: totalPcs1,
    totalWt: totalWt1,
  };

  calculatedData.push(other);

  // console.log("finalDfinalDfinalD", json0Data, finalD);

  const styles = `
      @media print {
        @page {
          size: A4;

              @bottom-left {
            content: "INVOICE NO. ${json0Data?.InvoiceNo}";
            font-family: Arial, sans-serif;
            font-size: 9pt;
            color: #666;
          }
              @bottom-right {
            content: " PAGE " counter(page) " OF " counter(pages);
            font-family: Arial, sans-serif;
            font-size: 9pt;
            color: #666;
          }
        }
        .no-print {
          display: none !important;
        }

        .footerForThe_print {
          page-break-inside: avoid;
        }
        
      }
    `;

  // const expectedTaxes = ["CGST", "SGST", "IGST"];
  // const taxList = expectedTaxes?.map((taxName) => {
  //   const taxData = finalD?.allTaxes?.find((e) => e.name === taxName);
  //   return {
  //     name: taxName,
  //     per: taxData?.per || "",
  //     amountInNumber: taxData?.amountInNumber || 0,
  //   };
  // });
  // const FinalTotal= (
  //   finalD?.mainTotal?.total_amount /
  //   finalD?.header?.CurrencyExchRate +
  //   finalD?.allTaxesTotal +
  //   finalD?.header?.FreightCharges /
  //   finalD?.header?.CurrencyExchRate)

  const amount = Number(finalD?.finalAmount || 0);
  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);
  const rupeesInWords = toWords.convert(rupees);
  const paiseInWords = paise > 0 ? ` and ${toWords.convert(paise)} Paise` : '';

  // console.log("json0Data", json0Data);
  // console.log("json1Data", json1Data);
  // console.log("json1Data2", json1Data2);
  console.log("finalD", finalD);


  const productsPerPage = 9;
  let totalProducts = finalD?.resultArray?.length;
  totalProducts = totalProducts > 7 ? totalProducts + 2 : totalProducts;
  
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const hasMultiplePages = totalPages > 1;

  const remainingOnLastPage = totalProducts % productsPerPage || productsPerPage;

  const needsSpacer = 
    (totalProducts === 7 || totalProducts === 6 || totalProducts === 5 || totalProducts === 4 || totalProducts === 3) 
    || (hasMultiplePages && remainingOnLastPage <= productsPerPage);

      const spacerClass = 
      totalProducts === 7 ? "spacer-53" :
      totalProducts === 6 ? "spacer-52" :
      totalProducts === 5 ? "spacer-51" :
      totalProducts === 4 ? "spacer-50" :
      totalProducts === 3 ? "spacer-49" :
    remainingOnLastPage <= productsPerPage 
      ? `spacer-${productsPerPage - remainingOnLastPage}`  
      : "";


  return (
    <>
      {loader ? (
        <Loader />
      ) : msg === "" ? (
        <div className="container containerDetailPrint1 pt-4 ">
          <style>{styles}</style>
          <div
            className="tax_invoice_main_allPrint main_bor"
            style={{
              position: "relative",
              // backgroundImage: watermarkimg ? `url(${watermarkimg})` : "none",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="print_watermark_element"></div>
            <div className="d-flex justify-content-end align-items-center print_sec_sum4 mb-4 pt-4">
              {evtName === "sale" &&
                options?.map((labelText, index) => (
                  <div
                    key={index}
                    className="form-check d-flex align-items-center detailPrint1L_font_13"
                  >
                    <input
                      className="border-dark me-2"
                      type="checkbox"
                      checked={checkBoxNew === labelText}
                      onChange={() => handleChangeNew(labelText)}
                    />
                    <label className="pt-1">{labelText}</label>
                  </div>
                ))}

              {evtName === "memo" &&
                optionsMemo?.map((labelText, index) => (
                  <div
                    key={index}
                    className="form-check d-flex align-items-center detailPrint1L_font_13"
                  >
                    <input
                      className="border-dark me-2"
                      type="checkbox"
                      checked={checkBoxNew === labelText}
                      onChange={() => handleChangeNew(labelText)}
                    />
                    <label className="pt-1">{labelText}</label>
                  </div>
                ))}

              <div className="form-check detailPrint1L_font_14">
                <input
                  type="button"
                  className="btn_white blue mt-0"
                  value="Print"
                  onClick={(e) => handlePrint(e)}
                />
              </div>
            </div>

            {/* header line*/}
            <div style={{ position: "relative" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  position: "absolute",
                  right: "20px",
                  top: "-10px",
                }}
              >
                <p>{checkBoxNew}</p>
              </div>
              <div
                className="col-6"
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "13px",
                }}
              >
                {isImageWorking && json0Data?.PrintLogo !== "" && (
                  <img
                    src={json0Data?.PrintLogo}
                    alt=""
                    onError={handleImageErrors}
                    height={120}
                    width={150}
                  />
                )}
              </div>
              <p style={{ textAlign: "center" }}>
                {evtName === "memo" ? (
                  <b> Delivery Challan</b>
                ) : (
                  <b>TAX INVOICE</b>
                )}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 5px 10px 5px",
              }}
            >
              <div style={{ width: "40%" }}>
                <p className="lhDetailPrint1 ">
                  <b>Bill To,</b>
                </p>
                <div className="header_top_content_main_class">
                  <p className="Header_top_title_name">Name </p>
                  <p className="Header_top_title_value_name">
                    {json0Data?.customerfirmname}
                  </p>
                </div>
                <div className="header_top_content_main_class">
                  <p className="Header_top_title_name">Address</p>
                  <p
                    className="Header_top_title_value_name"
                    style={{
                      whiteSpace: "pre-wrap",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    <span>
                      <span>{json0Data?.customerAddress1}</span>
                      {json0Data?.customerAddress2 && (
                        <span>{json0Data.customerAddress2}, </span>
                      )}
                      {/* {json0Data?.customerAddress3 && (
                          <span style={{wordBreak: 'auto-phrase'}}>{json0Data.customerAddress3} </span>
                        )} */}
                      {json0Data?.customercity1 && (
                        <span style={{ wordBreak: "auto-phrase" }}>
                          {json0Data.customercity1},{" "}
                        </span>
                      )}
                      <br />
                      {json0Data?.State && <span>{json0Data.State} </span>}
                      {json0Data?.customerpincode && (
                        <span>{json0Data.customerpincode}</span>
                      )}
                    </span>
                  </p>
                </div>

                <div className="header_top_content_main_class">
                  <p className="Header_top_title_name">State Code </p>
                  <p className="Header_top_title_value_name">
                    {finalD?.header?.Cust_CST_STATE_No}
                  </p>
                </div>
                <div className="header_top_content_main_class">
                  <p className="Header_top_title_name">Contact No. </p>
                  <p className="Header_top_title_value_name">
                    {finalD?.header?.customermobileno1}
                  </p>
                </div>
                <div className="header_top_content_main_class">
                  <p className="Header_top_title_name">Email </p>
                  <p className="Header_top_title_value_name">
                    {finalD?.header?.customeremail1}
                  </p>
                </div>
                <div className="header_top_content_main_class">
                  <p className="Header_top_title_name">PAN No. </p>
                  <p className="Header_top_title_value_name">
                    {finalD?.header?.CustPanno}
                  </p>
                </div>
                <div className="header_top_content_main_class">
                  <p className="Header_top_title_name">GST No. </p>
                  <p className="Header_top_title_value_name">
                    {finalD?.header?.CustGstNo}
                  </p>
                </div>
              </div>

              <div style={{ padding: "0px 5px", width: "35%" }}>
                <div>
                  <p className="lhDetailPrint1">
                    <b>Ship To,</b>
                  </p>
                  {/* <div className="header_top_content_main_class">
                      <p className="Header_top_title_value_name">
                        {json0Data?.CustName}
                      </p>
                    </div> */}
                  {/* <div className="header_top_content_main_class">
                      <p className="Header_top_title_value_name">
                        {json0Data?.customercity} , {json0Data?.customerstate}{" "}
                      </p>
                    </div> */}
                  {/* <div className="header_top_content_main_class">
                      <p className="Header_top_title_value_name">
                        {json0Data?.customerstate}
                      </p>
                    </div>
                    <div className="header_top_content_main_class">
                      <p className="Header_top_title_value_name">
                        {finalD?.header?.CustPanno}
                      </p>
                    </div> */}
                  <div
                    className="header_top_content_main_class"
                    style={{ minHeight: "40px" }}
                  >
                    <p className="Header_top_title_value_name">
                      {finalD?.header?.address?.map((e, i) => {
                        return <div key={i}>{e}</div>;
                      })}
                    </p>
                  </div>
                </div>
              </div>
              <div
                style={{
                  width: "30%",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <div>
                  <div className="header_top_content_main_class">
                    <p className="Header_top_title_name1">Invoice No.</p>
                    <p className="Header_top_title_value_name">
                      <b>{json0Data?.InvoiceNo}</b>
                    </p>
                  </div>
                  <div className="header_top_content_main_class">
                    <p className="Header_top_title_name1">Date </p>
                    <p className="Header_top_title_value_name">
                      {json0Data?.EntryDate}
                    </p>
                  </div>
                  <div className="header_top_content_main_class">
                    <p className="Header_top_title_name1">HSN Code</p>
                    <p className="Header_top_title_value_name">
                      {json0Data?.HSN_No}
                    </p>
                  </div>
                  <div className="header_top_content_main_class">
                    <p className="Header_top_title_name1">Location Code </p>
                    <p className="Header_top_title_value_name">2001</p>
                  </div>
                </div>
              </div>
            </div>

            {/* table header*/}
            <table style={{ width: "100%" }}>
              {/* {finalD?.resultArray?.length > 6 ? ( */}
              <thead>
                {/* <div className="header_top_content_main_class" style={{ width: "100%", justifyContent: "right", borderTop: "1px solid black", }}>
                  <p className="Header_top_title_name1">Invoice No.</p>
                  <p className="Header_top_title_value_name">
                    <b>{json0Data?.InvoiceNo}</b>
                  </p>
                </div> */}
                <div
                  style={{
                    borderTop: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                  className="d-flex w-100 recordDetailPrint1 detailPrint1L_font_11"
                >
                  <div className="designDetalPrint1 d-flex justify-content-center align-items-center flex-column">
                    <p className="fw-bold" style={{ fontSize: "11px" }}>
                      Sr No.
                    </p>
                  </div>
                  <div className="designDetalPrint2 d-flex justify-content-center align-items-center">
                    <p className="fw-bold p-1" style={{ fontSize: "11px" }}>
                      Item Code
                    </p>
                  </div>
                  <div className="designDetalPrint3 d-flex justify-content-center align-items-center">
                    <p className="fw-bold p-1" style={{ fontSize: "11px" }}>
                      Description
                    </p>
                  </div>
                  <div className="designDetalPrint4 d-flex justify-content-center align-items-center">
                    <p className="fw-bold p-1" style={{ fontSize: "11px" }}>
                      Qty
                    </p>
                  </div>
                  <div
                    className="designDetalPrint5 d-flex justify-content-left align-items-center"
                    style={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <p className="fw-bold p-1" style={{ fontSize: "11px" }}>
                      Price/Pcs (INR)
                    </p>
                  </div>
                  <div
                    className="designDetalPrint6  d-flex justify-content-left align-items-center"
                    style={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <p className="fw-bold p-1" style={{ fontSize: "11px" }}>
                      Amount (INR)
                    </p>
                  </div>
                  <div
                    className="designDetalPrint7 d-flex justify-content-left align-items-center"
                    style={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <p className="fw-bold p-1" style={{ fontSize: "11px" }}>
                      Discount (INR)
                    </p>
                  </div>
                  <div
                    className="designDetalPrint8 d-flex justify-content-left align-items-center"
                    style={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <p className="fw-bold p-1" style={{ fontSize: "11px" }}>
                      Total Amount (INR)
                    </p>
                  </div>
                </div>
              </thead>
              {/* ) : (
                  <div
                    style={{
                      borderTop: "1px solid black",
                      borderBottom: "1px solid black",
                    }}
                    className="d-flex w-100 recordDetailPrint1 detailPrint1L_font_11"
                  >
                    <div className="designDetalPrint1 d-flex justify-content-center align-items-center flex-column">
                      <p className="fw-bold">Sr No.</p>
                    </div>
                    <div className="designDetalPrint2 d-flex justify-content-center align-items-center">
                      <p className="fw-bold p-1">Item Code</p>
                    </div>
                    <div className="designDetalPrint3 d-flex justify-content-center align-items-center">
                      <p className="fw-bold p-1">Description</p>
                    </div>
                    <div className="designDetalPrint4 d-flex justify-content-center align-items-center">
                      <p className="fw-bold p-1">Qty</p>
                    </div>
                    <div className="designDetalPrint5 d-flex justify-content-center align-items-center">
                      <p className="fw-bold p-1">Price/Pcs (INR)</p>
                    </div>
                    <div className="designDetalPrint6  d-flex justify-content-center align-items-center">
                      <p className="fw-bold p-1">Amount (INR)</p>
                    </div>
                    <div className="designDetalPrint7 d-flex justify-content-center align-items-center">
                      <p className="fw-bold p-1">Discount (INR)</p>
                    </div>
                    <div className="designDetalPrint8 d-flex justify-content-center align-items-center">
                      <p className="fw-bold p-1">Total Amount (INR)</p>
                    </div>
                  </div>
                )} */}

              {/* data */}
              <div style={{ minHeight: finalD?.resultArray?.length === 1 ? "360px" : finalD?.resultArray?.length === 2 ? "355px" : "300px" }}>
                {finalD?.resultArray?.map((e, i) => {
                  return (
                    <div
                      key={i}
                      className="recordDetailPrint1 detailPrint1L_font_11"
                    >
                      <div className="d-flex w-100">
                        <div className="designDetalPrint1 pt-1" style={{ minHeight:"100px" }}>
                          <p className="text-center">
                            {NumberWithCommas(i + 1, 0)}
                          </p>
                        </div>
                        <div className="designDetalPrint2 min_height p-1">
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <p>{e?.SrJobno}</p>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            {checkBox?.image && (
                              <img
                                src={e?.DesignImage}
                                alt=""
                                onError={handleImageError}
                                style={{
                                  height: "77px",
                                  width: "77px",
                                }}
                              />
                            )}
                          </div>
                        </div>

                        <div className="designDetalPrint3 min_height p-1">
                          <div className="d-flex justify-content-between">
                            <div className="wordbr">
                              <div>{e?.BrandName} {e?.Categoryname} {e?.SubCategoryname}{" "}
                                {e?.MetalPurity} {e?.MetalColor}</div>
                              <div style={{ display: "flex" }}>
                                {(e?.totals?.diamonds?.Wt !== 0 && e?.totals?.colorstone?.Wt !== 0) &&
                                  <div style={{ marginRight: "5px" }}>
                                    TCW: {(
                                      (e?.totals?.diamonds?.Wt ?? 0) +
                                      (e?.totals?.colorstone?.Wt ?? 0)
                                    ).toFixed(3)}
                                  </div>
                                }
                                <div>
                                  {e?.lineid ? `Line ID: ${e.lineid}` : ""}
                                </div>
                              </div>
                              <div>{e?.CertificateNo
                                ? `Certificate No.: ${e.CertificateNo}`
                                : ""}</div>
                            </div>
                          </div>
                        </div>
                        <div className="designDetalPrint4 min_height p-1">
                          <div className="d-flex justify-content-between">
                            <p style={{ width: "100%", textAlign: "center" }}>
                              {e?.Quantity}
                            </p>
                          </div>
                        </div>
                        <div className="designDetalPrint5 min_height p-1">
                          <div className="d-flex justify-content-between">
                            <p style={{ width: "100%", textAlign: "right" }}>
                              {formatAmount(e?.UnitCost)}
                            </p>
                          </div>
                        </div>
                        <div className="designDetalPrint6 min_height p-1">
                          <div className="d-flex justify-content-between">
                            <p style={{ width: "100%", textAlign: "right" }}>
                              {formatAmount(e?.UnitCost)}
                            </p>
                          </div>
                        </div>
                        <div className="designDetalPrint7 min_height p-1">
                          <div className="d-flex justify-content-between">
                            <p style={{ width: "100%", textAlign: "right" }}>
                              {" "}
                              {formatAmount(
                                e?.DiscountAmt /
                                finalD?.header?.CurrencyExchRate
                              )}
                            </p>
                          </div>
                        </div>
                        <div
                          className="designDetalPrint8 min_height"
                          style={{ padding: ".25rem 10px" }}
                        >
                          <div className="d-flex justify-content-between">
                            <p style={{ width: "100%", textAlign: "right" }}>
                              {formatAmount(e?.TotalAmount)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {needsSpacer && ( <div className={`spacer ${spacerClass}`}/> )}

              <div className="myToalaSection">
                <div
                  style={{
                    display: "flex",
                    borderTop: "1px solid green",
                    borderBottom: "1px solid green",
                  }}
                // className={finalD?.resultArray?.length > 3 && "page_break"}
                >
                  <div style={{ width: "30%" }}></div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1px",
                      width: "70%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        borderBottom: "1px solid green",
                        paddingBlock: "5px",
                      }}
                    >
                      <p style={{ width: "18%" }}>Sub Total</p>
                      <div
                        style={{
                          display: "flex",
                          width: "83%",
                          paddingRight: "10px",
                        }}
                      >
                        <p style={{ width: "40%" }}>
                          <b>{finalD?.mainTotal?.total_Quantity}</b>
                        </p>
                        <p style={{ width: "40%" }}>
                          <b>
                            {formatAmount(finalD?.mainTotal?.total_unitcost)}
                          </b>
                        </p>
                        <p
                          style={{
                            width: "20%",
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <b>{formatAmount(finalD?.mainTotal?.total_amount)}</b>
                        </p>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        borderBottom: "1px solid green",
                        justifyContent: "space-between",
                        paddingRight: "10px",
                      }}
                    >
                      <p>Discount</p>
                      <p>
                        <b>
                          {formatAmount(
                            finalD?.mainTotal?.total_discount_amount
                          )}
                        </b>
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        borderBottom: "1px solid green",
                        justifyContent: "space-between",
                        paddingRight: "10px",
                      }}
                    >
                      <p>Taxable Value</p>
                      <p>
                        <b>{formatAmount(finalD?.mainTotal?.total_amount)}</b>
                      </p>
                    </div>
                    {finalD?.allTaxes?.map((e, i) => {
                      return (
                        <div
                          style={{
                            display: "flex",
                            borderBottom: "1px solid green",
                            justifyContent: "space-between",
                            paddingRight: "10px",
                          }}
                          key={i}
                        >
                          <p>
                            {" "}
                            {e?.name} {e?.per}{" "}
                          </p>
                          <p>
                            {" "}
                            <b>{formatAmount(e?.amountInNumber)}</b>{" "}
                          </p>
                        </div>
                      );
                    })}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        paddingRight: "10px",
                      }}
                    >
                      <p>Total</p>
                      <p>
                        <b>
                          {" "}
                          {formatAmount(finalD?.finalAmount)}
                        </b>
                      </p>
                    </div>
                  </div>
                </div>
                <div style={{ width: "100%", borderBottom: "1px solid green", paddingLeft: "4px" }}>
                  Amount In Words : <span style={{ fontWeight: "bold" }}>Rupees {rupeesInWords + paiseInWords} Only</span>
                </div>
                <div className="second_main_box_div" style={{ padding: "4px" }}>
                  <p className="memo1_title_secondBox_bottom_desc">
                    <b>Terms & Conditions :</b>
                  </p>
                  <div
                    className="tax_inoivea_declartion"
                    dangerouslySetInnerHTML={{
                      __html: finalD?.header?.Declaration,
                    }}
                  ></div>
                </div>
                <div
                  style={{
                    borderTop: "1px solid green",
                    borderBottom: "1px solid green",
                    paddingBottom: "5px",
                  }}
                >
                  <div className="col-6 p-1 w-100">
                    <p>
                      <b>Banking & GST information:</b>
                    </p>
                    <div style={{ display: "flex", lineHeight: "11px" }}>
                      <p style={{ minWidth: "120px" }}>Baneficiary Name :</p>
                      <p>{json0Data?.Branch_Description}</p>
                    </div>
                    <div style={{ display: "flex", lineHeight: "11px" }}>
                      <p style={{ minWidth: "120px" }}>Bank Name & Address:</p>
                      <p>
                        {json0Data?.bankname} , {json0Data?.bankaddress}
                      </p>
                    </div>
                    <div style={{ display: "flex", lineHeight: "11px" }}>
                      <p style={{ minWidth: "120px" }}>Account Name :</p>
                      <p>{json0Data?.accountname}</p>
                    </div>
                    <div style={{ display: "flex", lineHeight: "11px" }}>
                      <p style={{ minWidth: "120px" }}>Account Number :</p>
                      <p>{json0Data?.accountnumber}</p>
                    </div>
                    <div style={{ display: "flex", lineHeight: "11px" }}>
                      <p style={{ minWidth: "120px" }}>Bank IFSC Code :</p>
                      <p>{json0Data?.rtgs_neft_ifsc}</p>
                    </div>
                    <div style={{ display: "flex", lineHeight: "11px" }}>
                      <p style={{ minWidth: "120px" }}>Bank MICR Code :</p>
                      <p>{finalD?.header?.micrcode}</p>
                    </div>
                    <div style={{ display: "flex", lineHeight: "11px" }}>
                      <p style={{ minWidth: "120px" }}>Bank SWIFT Code :</p>
                      <p>{finalD?.header?.swiftcode}</p>
                    </div>
                    <div style={{ display: "flex", lineHeight: "11px" }}>
                      <p style={{ minWidth: "120px" }}>GST Number :</p>
                      <p>{json0Data?.Company_VAT_GST_No}</p>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    borderBottom: "1px solid green",
                    minHeight: "80px",
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "5px",
                  }}
                  className="bottomo_section_for_print"
                >
                  <div style={{ display: "flex", alignItems: "flex-end" }}>
                    <p>
                      <b style={{ fontSize: "12px" }}>Buyer`s Signature</b>
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <p>
                      <b style={{ fontSize: "11px" }}>
                        For Aryamond Luxury Products Private Limited
                      </b>
                    </p>
                    <p>
                      <b
                        style={{
                          fontSize: "12px",
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        Authorized Signatory
                      </b>
                    </p>
                  </div>
                </div>
              </div>

              <tfoot>
                <tr>
                  <td>
                    <div
                      className="footerForThe_print"
                      style={{
                        // borderTop: "1px solid black",
                        paddingTop: "10px",
                        position: "relative",
                        minHeight: '50px'
                      }}
                    >
                      <div
                        style={{
                          marginBlock: "5px",
                          width: "60%",
                          margin: "auto",
                        }}
                      >
                        <h2
                          style={{ textAlign: "center" }}
                          className="fw-bold detailPrint1L_font_16"
                        >
                          {json0Data?.CompanyFullName}
                        </h2>
                        <p
                          style={{ textAlign: "center" }}
                          className="lhDetailPrint1"
                        >
                          {json0Data?.CompanyAddress}{" "}
                          {json0Data?.CompanyAddress2} {json0Data?.CompanyCity}-
                          {json0Data?.CompanyPinCode}, {json0Data?.CompanyState}{" "}
                          ({json0Data?.CompanyCountry})
                        </p>
                        <p
                          style={{ textAlign: "center" }}
                          className="lhDetailPrint1"
                        >
                          {json0Data?.CompanyEmail} | T{" "}
                          {json0Data?.CompanyTellNo}
                        </p>
                        <p
                          className="lhDetailPrint1"
                          style={{
                            textAlign: "center",
                          }}
                        >
                          {json0Data?.CompanyWebsite}
                        </p>
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          right: "20px",
                          top: "0px",
                        }}
                      >
                        <img
                          src={signatureLogo}
                          alt="Signature"
                          className="jewel_design_images"
                          style={{ maxWidth: "100px" }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>{" "}
        </div>
      ) : (
        <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
          {msg}
        </p>
      )}
    </>
  );
};

export default TaxInvoiceA;
