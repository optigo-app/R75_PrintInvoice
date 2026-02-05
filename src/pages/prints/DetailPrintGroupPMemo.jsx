//http://localhost:3000/?tkn=OTA2NTQ3MTcwMDUzNTY1MQ==&invn=Sk1JLzMzMS8yMDI1&evn=bWVtbw==&pnm=RGV0YWlsIFByaW50IEdyb3VwKFAp&up=aHR0cDovL256ZW4vam8vYXBpLWxpYi9BcHAvU2FsZUJpbGxfSnNvbg==&ctv=NzE=&ifid=DetailPrintGroup(P)&pid=undefined
import React, { useEffect } from "react";
import "../../assets/css/prints/detailPrintGroupPMemo.css";
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

const DetailPrintGroupPMemo = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {
  const [image, setImage] = useState(false);
  const [loader, setLoader] = useState(true);
  const [json0Data, setJson0Data] = useState({});
  const [json1Data, setJson1Data] = useState([]);
  const [json1Data2, setJson1Data2] = useState([]);
  const [MetShpWise, setMetShpWise] = useState([]);
  const [notGoldMetalTotal, setNotGoldMetalTotal] = useState(0);
  const [notGoldMetalWtTotal, setNotGoldMetalWtTotal] = useState(0);
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
  const [checkBox, setCheckBox] = useState({
    image: true,
    brokarage: true,
  });

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

  const loadData = (data) => {
    let label = data?.BillPrint_Json[0]?.Printlable?.split("\r\n");
    setAddress(label);
    setJson0Data(data?.BillPrint_Json[0]);
    setJson1Data2(data?.BillPrint_Json2);
    setLoader(false);
    let datas = OrganizeDataPrint(data?.BillPrint_Json[0], data?.BillPrint_Json1, data?.BillPrint_Json2);

    let met_shp_arr = MetalShapeNameWiseArr(datas?.json2);
      
    setMetShpWise(met_shp_arr);
    let tot_met = 0;
    let tot_met_wt = 0;

    met_shp_arr?.forEach((e) => {
      tot_met += e?.Amount;
      tot_met_wt += e?.metalfinewt;

    })    
    setNotGoldMetalWtTotal(tot_met_wt)
    setNotGoldMetalTotal(tot_met);

    let finalArr = [];
    let totalMetalWt = 0;
    let miscChargesTotals = 0
    datas?.resultArray?.map((e, i) => {
      let primaryMetalWt = 0;
      let otherMisc = e?.OtherCharges + e?.MiscAmount + e?.TotalDiamondHandling;
      let findMetal = e?.metal?.find((ele, ind) => ele?.IsPrimaryMetal === 1);
      if (findMetal !== undefined) {
        primaryMetalWt = findMetal?.Wt;
        totalMetalWt += findMetal?.Wt;
      }
      let obj = cloneDeep(e);
      let miscChargesTotal = e?.OtherCharges+e?.TotalDiamondHandling
      let miscChargesss = 0;
      let miscCharges = data?.BillPrint_Json2?.filter((ele, ind) => {
        if (ele?.MasterManagement_DiamondStoneTypeid === 3) {
          if (ele?.IsHSCOE !== 0 && ele?.StockBarcode === e?.SrJobno) {
            // miscChargesTotal += ele?.Amount;
            miscChargesTotal += ele?.Amount;
            return ele
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
      obj.miscChargesss = miscChargesss
      finalArr.push(obj);
    })
    datas.mainTotal.miscChargesTotals = miscChargesTotals
    settotalMetalWts(totalMetalWt);
    datas.resultArray = finalArr;

    datas?.resultArray?.forEach((item) => {
      let grouped = [];
      item?.diamonds?.forEach((diamond) => {
        let obj = cloneDeep(diamond);
        let findrec = grouped.findIndex((a) =>
          a?.ShapeName === obj?.ShapeName &&
          a?.QualityName === obj?.QualityName &&
          a?.Colorname === obj?.Colorname &&
          a?.SizeName === obj?.SizeName
        );
        if (findrec === -1) {
          grouped.push(obj);
        } else {
          grouped[findrec].Wt += obj?.Wt;
          grouped[findrec].Pcs += obj?.Pcs;
        }
      });
      item.diamonds = grouped;
    });

    setFinalD(datas);
    let brok = brokarageDetail(data?.BillPrint_Json[0]?.Brokerage);
    setBrokarage(brok);
    let diamondDetail = [];
    data?.BillPrint_Json2?.forEach((e, i) => {
      if (e?.MasterManagement_DiamondStoneTypeid === 1) {
        let findDiamond = diamondDetail?.findIndex((ele, ind) => 
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

    if (findRND?.length > 7) {
      let arr = findRND.slice(0, 7);
      let anotherArr = [...findRND.slice(7), remaingDia].flat();
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
      let smallArr = [...remaingDia.slice(0, 7 - findRND?.length)].flat();
      let largeArr = [...remaingDia.slice(7 - findRND?.length)].flat();
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
        const data = await apiCall(token, invoiceNo, printName, urls, evn, ApiVer);
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

  console.log("json0Data", json0Data);
  // console.log("finalD", finalD);
  
  return (
    <>
      {loader ? (
        <Loader />
      ) : msg === "" ? (
        <div className="container containerDetailPrint1 pt-4 ">
          <div className="pad_60_allPrint">
            {/* buttons */}
            <div className="d-flex justify-content-end align-items-center print_sec_sum4 mb-4 pt-4">
              <div className="form-check d-flex align-items-center detailPrint1L_font_13">
                <input
                  className="me-2"
                  type="checkbox"
                  checked={checkBox?.image}
                  onChange={(e) => handleChange(e)}
                  name="image"
                />
                <label className="pt-1">With Image</label>
              </div>
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
            <div className="jewelleryPackingList mb-1 mt-2 recordDetailPrint1">
              <p className={` fw-bold text-white dlpp_headline_fs`} >
                {json0Data?.PrintHeadLabel == '' ? 'JEWELLERY MEMO' : json0Data?.PrintHeadLabel}
              </p>
            </div>

            {/* header */}
            <div className="d-flex align-items-center p-1 spBrdrBtom recordDetailPrint1">
              <div className="col-6">
                <h2 className="fw-bold dlp_p_memo_font16">{json0Data?.CompanyFullName}</h2>
                <p className="lhDetailPrint1 lh_dlp_p_memo">{json0Data?.CompanyAddress}</p>
                <p className="lhDetailPrint1 lh_dlp_p_memo">{json0Data?.CompanyAddress2}</p>
                <p className="lhDetailPrint1 lh_dlp_p_memo">
                  {json0Data?.CompanyCity}-{json0Data?.CompanyPinCode},{" "}
                  {json0Data?.CompanyState}({json0Data?.CompanyCountry})
                </p>
                <p className="lhDetailPrint1 lh_dlp_p_memo">T {json0Data?.CompanyTellNo}</p>
                <p className="lhDetailPrint1 lh_dlp_p_memo" >
                  {json0Data?.CompanyEmail} | {json0Data?.CompanyWebsite}
                </p>
                <p className="lhDetailPrint1 lh_dlp_p_memo">
                  {json0Data?.Company_VAT_GST_No} |{" "}
                  {json0Data?.Company_CST_STATE}-
                  {json0Data?.Company_CST_STATE_No} | PAN-{json0Data?.Pannumber}
                </p>
              </div>
              <div className="col-6">
                {isImageWorking && (json0Data?.PrintLogo !== "" &&
                  <img src={json0Data?.PrintLogo} alt=""
                    className='h-auto ms-auto d-block object-fit-contain spImgCal'
                    onError={handleImageErrors} />)}
                {/* <img
                  src={json0Data?.PrintLogo}
                  alt=""
                  className="w-25 d-block ms-auto"
                /> */}
              </div>
            </div>

            {/* address */}
            <div className="d-flex spBrdrLft spBrdrRigt spBrdrBtom mb-1 recordDetailPrint1">
              <div className="col-4 spBrdrRigt p-1">
                <p className="lhDetailPrint1 lh_dlp_p_memo">{json0Data?.lblBillTo}</p>
                <p className="lhDetailPrint1 dlp_p_memo_font14 fw-bold">
                  {json0Data?.customerfirmname}
                </p>
                <p className="lhDetailPrint1 lh_dlp_p_memo">{json0Data?.customerAddress2}</p>
                <p className="lhDetailPrint1 lh_dlp_p_memo">{json0Data?.customerAddress1}</p>
                <p className="lhDetailPrint1 lh_dlp_p_memo">{json0Data?.customerAddress3}</p>
                <p className="lhDetailPrint1 lh_dlp_p_memo">
                  {json0Data?.customercity1}
                  {json0Data?.customerpincode}
                </p>
                <p className="lhDetailPrint1 lh_dlp_p_memo">{json0Data?.customeremail1}</p>
                <p className="lhDetailPrint1 lh_dlp_p_memo">{json0Data?.vat_cst_pan}</p>
                <p className="lhDetailPrint1 lh_dlp_p_memo">
                  {json0Data?.Cust_CST_STATE}-{json0Data?.Cust_CST_STATE_No}
                </p>
              </div>

              <div className="col-4 spBrdrRigt p-1">
                <p className="lhDetailPrint1 lh_dlp_p_memo">Ship To,</p>
                <p className="lhDetailPrint1 dlp_p_memo_font14 fw-bold lh_dlp_p_memo">
                  {json0Data?.customerfirmname}
                </p>
                <p
                  className="lhDetailPrint1 lh_dlp_p_memo"
                  dangerouslySetInnerHTML={{
                    __html: (json0Data?.Printlable || "").replace(/\n/g, "<br />"),
                  }}
                />
              </div>

              <div className="col-4 p-1 ps-2 ThrdLinHeight">
                <div className="d-flex pb-1 pt-1">
                  <p className="fw-bold col-3 me-2 lh_dlp_p_memo">VOUCHER NO </p>
                  <p className="col-9 lh_dlp_p_memo">{json0Data?.InvoiceNo}</p>
                </div>
                <div className="d-flex pb-1">
                  <p className="fw-bold col-3 me-2 lh_dlp_p_memo">DATE </p>
                  <p className="col-9 lh_dlp_p_memo">{json0Data?.EntryDate}</p>
                </div>
                <div className="d-flex pb-1">
                  <p className="fw-bold col-3 me-2 lh_dlp_p_memo">HSN </p>
                  <p className="col-9 lh_dlp_p_memo">{json0Data?.HSN_No}</p>
                </div>
              </div>
            </div>

            {/* table header*/}
            <div className="d-flex w-100 spBrdrTop  recordDetailPrint1 lightGrey detailPrint1L_font_11">
              <div className="srNoDetailprint11 spBrdrRigt spBrdrLft  spBrdrBtom d-flex justify-content-center align-items-center flex-column">
                <p className="fw-bold">Sr </p>
              </div>
              <div className="designDetalPrint1 spBrdrRigt  p-1 spBrdrBtom d-flex justify-content-center align-items-center">
                <p className="fw-bold p-1">Design</p>
              </div>
              <div className={`diamondDetailPrint1l spBrdrRigt`}>
                <div className="d-grid h-100">
                  <div className="d-flex justify-content-center spBrdrBtom ">
                    <p className="fw-bold p-1">Diamond</p>
                  </div>
                  <div className="d-flex spBrdrBtom ">
                    <p className="fw-bold col-3 d-flex align-items-center justify-content-center spBrdrRigt ">
                      Code
                    </p>
                    <p className="fw-bold col-2 d-flex align-items-center justify-content-center spBrdrRigt ">
                      Size
                    </p>
                    <p className="fw-bold col-1 d-flex align-items-center justify-content-center spBrdrRigt ">
                      Pcs
                    </p>
                    <p className="fw-bold col-2 d-flex align-items-center justify-content-center spBrdrRigt ">
                      Wt
                    </p>
                    <p className="fw-bold col-2 d-flex align-items-center justify-content-center spBrdrRigt ">
                      Rate
                    </p>
                    <p className="fw-bold col-2 d-flex align-items-center justify-content-center text-center">
                      Amount
                    </p>
                  </div>
                </div>
              </div>
              <div className={`metalGoldDetailPrint1l spBrdrRigt `}>
                <div className="d-grid h-100">
                  <div className="d-flex justify-content-center align-items-center spBrdrBtom ">
                    <p className="fw-bold p-1">Metal </p>
                  </div>
                  <div className="d-flex spBrdrBtom ">
                    <p className="fw-bold col-3 spBrdrRigt  d-flex align-items-center justify-content-center">
                      Quality
                    </p>
                    <p className="fw-bold col-2 spBrdrRigt  d-flex align-items-center justify-content-center">
                      *Wt
                    </p>
                    <p className="fw-bold col-2 spBrdrRigt  d-flex align-items-center justify-content-center">
                      N+L
                    </p>
                    <p className="fw-bold col-2 spBrdrRigt  d-flex align-items-center justify-content-center">
                      Rate
                    </p>
                    <p className="fw-bold col-3 d-flex align-items-center justify-content-center">
                      Amount
                    </p>
                  </div>
                </div>
              </div>
              <div className={`stoneDetailsPrint1l spBrdrRigt`}>
                <div className="d-grid h-100">
                  <div className="d-flex justify-content-center spBrdrBtom ">
                    <p className="fw-bold p-1">Stone</p>
                  </div>
                  <div className="d-flex spBrdrBtom ">
                    <p className="fw-bold col-3 spBrdrRigt  d-flex align-items-center justify-content-center">
                      Code
                    </p>
                    <p className="fw-bold col-2 spBrdrRigt  d-flex align-items-center justify-content-center">
                      Size
                    </p>
                    <p className="fw-bold col-1 spBrdrRigt  d-flex align-items-center justify-content-center">
                      Pcs
                    </p>
                    <p className="fw-bold col-2 spBrdrRigt  d-flex align-items-center justify-content-center">
                      Wt
                    </p>
                    <p className="fw-bold col-2 spBrdrRigt  d-flex align-items-center justify-content-center">
                      Rate
                    </p>
                    <p className="fw-bold col-2 d-flex align-items-center justify-content-center text-center">
                      Amount
                    </p>
                  </div>
                </div>
              </div>
              <div className={`otherAmountDetailPrint1l spBrdrRigt spBrdrBtom d-flex align-items-center justify-content-center flex-column`}>
                <p className="fw-bold text-center d-flex align-items-center justify-content-center" style={{wordBreak: "normal"}}>
                  Other Amount
                </p>
              </div>
              <div className="labourAmountDetailPrint1 spBrdrRigt  spBrdrBtom">
                <div className="d-grid h-100">
                  <div className="spBrdrBtom  d-flex align-items-center justify-content-center">
                    <p className="text-center fw-bold">Labour</p>
                  </div>
                  <div className="d-flex">
                    <div className="col-5 spBrdrRigt  d-flex align-items-center justify-content-center">
                      <p className="fw-bold ">Rate</p>
                    </div>
                    <div className="col-7 d-flex align-items-center justify-content-center">
                      <p className="fw-bold text-end ">Amount</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="totalAmountDetailPrint1 spBrdrRigt  spBrdrBtom d-flex align-items-center justify-content-center flex-column">
                <p className="text-center fw-bold ">Total</p>
                <p className="text-center fw-bold ">Amount</p>
              </div>
            </div>

            {/* data */}
            {
              finalD?.resultArray?.map((e, i) => {
                return (
                  <div key={i} className="recordDetailPrint1 detailPrint1L_font_11">
                    <div className="d-flex w-100">
                      <div className="srNoDetailprint11 spBrdrRigt spBrdrLft spBrdrBtom">
                        <p className="p-1 text-center paddingLeftDetailPrint1 paddingRightDetailPrint1">{NumberWithCommas(i + 1, 0)}</p>
                      </div>
                      <div className="designDetalPrint1 spBrdrRigt  p-1 spBrdrBtom paddingLeftDetailPrint1 paddingRightDetailPrint1">
                        <div className="d-flex justify-content-between">
                          <div className="col">
                            <p>{e?.designno}</p>
                          </div>
                          <div className="col d-flex flex-column align-items-end">
                            <p>{e?.SrJobno}</p>
                            {/* <p>{e?.MetalColor}</p> */}
                          </div>
                        </div>
                        <div>
                          {checkBox?.image && (
                            <img
                              src={e?.DesignImage}
                              alt=""
                              className="d-block spImgCalPrdct"
                              onError={handleImageError}
                            />
                          )}
                        </div>
                        <div className={`${!image && "pt-2 "}`}>

                          {/* {e?.HUID !== "" && (
                            <p className="text-center">HUID - {e?.HUID}</p>
                          )} */}
                          {e?.PO !== "" && e?.PO !== "-" && (
                            <p className="text-center fw-bold">PO: {e?.PO}</p>
                          )}
                          {e?.lineid !== "" && (
                            <p className="text-center">
                              {/* Lineid - */}
                              {e?.lineid}</p>
                          )}
                          {e?.Tunch && (
                            <p className="text-center">
                              Tunch :{" "}
                              <span className="fw-bold">
                                {NumberWithCommas(e?.Tunch, 3)}
                              </span>
                            </p>
                          )}
                          {e?.grosswt && (
                            <p className="text-center">
                              <b>{fixedValues(e?.grosswt, 3)} gm</b> Gross
                            </p>
                          )}
                          {e?.Size !== "" && e?.Size !== "-" && (
                            <p className="text-center">Size: {e?.Size}</p>
                          )}
                        </div>
                      </div>
                      <div className={`diamondDetailPrint1l spBrdrRigt position-relative paddingLeftDetailPrint1 paddingRightDetailPrint1`}>
                        <div className="h-100 paddingBottomTotalDetailPrint1">
                          {e?.diamonds.length > 0 &&
                            e?.diamonds.map((ele, ind) => {
                              return (
                                <div
                                  className={`d-flex justify-content-between `}
                                  key={ind}
                                >
                                  <p className="col-3 paddingRightDetailPrint1 text-break">
                                    {ele?.ShapeName} {ele?.QualityName}{" "}
                                    {ele?.Colorname}
                                  </p>
                                  <p className="col-2 text-center  paddingRightDetailPrint1 text-break">
                                    {ele?.GroupName === "" ? ele?.SizeName : ele?.GroupName}
                                  </p>
                                  <p className="col-1 text-end paddingRightDetailPrint1">
                                    {NumberWithCommas(ele?.Pcs, 0)}
                                  </p>
                                  <p className="col-2 text-end paddingRightDetailPrint1">
                                    {fixedValues(ele?.Wt, 3)}
                                  </p>
                                  <p className="col-2 text-end paddingRightDetailPrint1">
                                    {/* {NumberWithCommas(ele?.Rate, 2)} */}
                                    {NumberWithCommas(ele?.Rate, 2)}
                                  </p>
                                  <p
                                    className={`col-2 text-end`}
                                  >
                                    {NumberWithCommas(ele?.Amount, 2)}
                                  </p>
                                </div>
                              );
                            })}
                          <div className="d-flex spBrdrBtom position-absolute bottom-0 w-100 spBrdrTop totalMinHeightDetailPrint1 lightGrey start-0">
                            <p className="col-2 paddingRightDetailPrint1 "></p>
                            <p className="col-2 paddingRightDetailPrint1 "></p>
                            <p className="col-2 paddingRightDetailPrint1 text-end fw-bold d-flex align-items-center justify-content-end">
                              {/* {e?.diamondsTotal?.Pcs === 0 && NumberWithCommas(e?.totals?.diamonds?.Pcs, 0)} */}
                              {e?.totals?.diamonds?.Pcs !== 0 && NumberWithCommas(e?.totals?.diamonds?.Pcs, 0)}
                            </p>
                            <p className="col-2 paddingRightDetailPrint1 text-end fw-bold d-flex align-items-center justify-content-end">
                              {e?.totals?.diamonds?.Wt !== 0 &&
                                fixedValues(e?.totals?.diamonds?.Wt, 3)}
                            </p>
                            {/* <p className="col-2 paddingRightDetailPrint1 text-end fw-bold d-flex align-items-center justify-content-end"></p> */}
                            <p className="col-4  text-end fw-bold d-flex align-items-center justify-content-end  paddingRightDetailPrint1l">
                              {e?.totals?.diamonds?.Amount !== 0 &&
                                NumberWithCommas(e?.totals?.diamonds?.Amount, 2)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className={`metalGoldDetailPrint1l spBrdrRigt position-relative paddingLeftDetailPrint1 paddingRightDetailPrint1`}>
                        <div className="h-100 paddingBottomTotalDetailPrint1">
                          {e?.metal.length > 0 &&
                            e?.metal.map((ele, ind) => {
                              return (
                                <div className={`d-flex`} key={ind}>
                                  <p className="col-3  paddingRightDetailPrint1 text-break">
                                    {ele?.ShapeName + " " + ele?.QualityName} {e?.MetalColor}
                                  </p>
                                  <p className="col-2  text-end paddingRightDetailPrint1 text-break">
                                    {ind === 0 ? NumberWithCommas(e?.NetWt + (e?.totals?.diamonds?.Wt / 5), 3) : NumberWithCommas(ele?.Wt, 3)}
                                  </p>
                                  <p className="col-2  text-end paddingRightDetailPrint1">
                                    {fixedValues(e?.NetWt + e?.LossWt, 3)}
                                  </p>
                                  <p className="col-2  text-end paddingRightDetailPrint1">
                                    {NumberWithCommas(ele?.Rate, 2)}
                                  </p>
                                  <p className={`col-3 text-end ${ind > 0 && "fw-bold"}`}>
                                    {(NumberWithCommas(ele?.Amount, 2))}
                                  </p>
                                </div>
                              );
                            })}
                          {e?.JobRemark !== "" && <div className={``}>
                            <p className="fw-bold">
                              REMARK:
                            </p>
                            <p className="fw-bold">
                              {e?.JobRemark}
                            </p>
                          </div>}
                          <div className="d-flex position-absolute bottom-0 w-100  totalMinHeightDetailPrint1 spBrdrTop spBrdrBtom lightGrey start-0">
                            <p className="col-3 paddingRightDetailPrint1"></p>
                            <p className="col-2 text-end fw-bold d-flex justify-content-end align-items-center paddingRightDetailPrint1">
                              {e?.totals?.metal?.Wt !== 0 &&
                                fixedValues(e?.NetWt + (e?.totals?.diamonds?.Wt / 5), 3)}
                              {/* fixedValues(e?.totals?.metal?.Wt + (e?.totals?.diamonds?.Wt / 5), 3)} */}
                            </p>
                            <p className="col-2 text-end fw-bold d-flex justify-content-end align-items-center paddingRightDetailPrint1">
                              {e?.NetWt !== 0 && (fixedValues(e?.NetWt + e?.LossWt, 3))}
                            </p>
                            <p className="col-2 text-end paddingRightDetailPrint1"></p>
                            <p className="col-3 text-end fw-bold d-flex justify-content-end align-items-center paddingRightDetailPrint1 ">
                              {
                                NumberWithCommas(e?.metal[0].Amount, 2)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className={`stoneDetailsPrint1l spBrdrRigt position-relative paddingLeftDetailPrint1 paddingRightDetailPrint1`}>
                        <div className="h-100 paddingBottomTotalDetailPrint1">
                          {e?.colorstone.length > 0 &&
                            e?.colorstone.map((ele, ind) => {
                              return (
                                <div className={`d-flex`} key={ind}>
                                  <p className="col-3 paddingRightDetailPrint1 text-break">
                                    {ele?.ShapeName} {ele?.QualityName}{" "}
                                    {ele?.Colorname}
                                  </p>
                                  <p className="col-2 text-center paddingRightDetailPrint1 text-break">
                                    {ele?.SizeName}
                                  </p>
                                  <p className="col-1 text-end paddingRightDetailPrint1">
                                    {NumberWithCommas(ele?.Pcs, 0)}
                                  </p>
                                  <p className="col-2 text-end paddingRightDetailPrint1">
                                    {fixedValues(ele?.Wt, 3)}
                                  </p>
                                  <p className="col-2 text-end paddingRightDetailPrint1">
                                    {NumberWithCommas(ele?.Rate, 2)}
                                  </p>
                                  <p className={`col-2 text-end`} >
                                    {NumberWithCommas(ele?.Amount, 2)}
                                  </p>
                                </div>
                              );
                            })}
                          <div className="d-flex spBrdrBtom position-absolute bottom-0 w-100  spBrdrTop totalMinHeightDetailPrint1 lightGrey paddingRightDetailPrint1 paddingLeftDetailPrint1 start-0">
                            <p className=" col-2 paddingRightDetailPrint1"></p>
                            <p className=" col-2 paddingRightDetailPrint1"></p>
                            <p className=" col-2 paddingRightDetailPrint1 text-end fw-bold d-flex align-items-center justify-content-end">
                              {e?.totals?.colorstone?.Pcs !== 0 &&
                                e?.totals?.colorstone?.Pcs}
                            </p>
                            <p className=" col-2 text-end fw-bold d-flex align-items-center justify-content-end paddingRightDetailPrint1">
                              {e?.totals?.colorstone?.Wt !== 0 &&
                                fixedValues(e?.totals?.colorstone?.Wt, 3)}
                            </p>
                            <p className=" col-2 text-end paddingRightDetailPrint1"></p>
                            <p className=" col-2 text-end fw-bold d-flex align-items-center justify-content-end paddingLeftDetailPrint1  ">
                              {e?.totals?.colorstone?.Amount !== 0 &&
                                NumberWithCommas(
                                  e?.totals?.colorstone?.Amount,
                                  2
                                )}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className={`otherAmountDetailPrint1l spBrdrRigt position-relative paddingLeftDetailPrint1 paddingRightDetailPrint1`}>
                        <div className="paddingBottomTotalDetailPrint1">
                        </div>
                        <div className="position-absolute bottom-0 w-100 spBrdrTop spBrdrBtom totalMinHeightDetailPrint1 lightGrey d-flex align-items-center justify-content-end paddingRightDetailPrint1 start-0">
                          <p className="text-end fw-bold">
                            {e?.totalOther !== 0 && NumberWithCommas(e?.OtherCharges + e?.MiscAmount, 2)}
                          </p>
                        </div>
                      </div>
                      <div className="labourAmountDetailPrint1 spBrdrRigt position-relative paddingLeftDetailPrint1 paddingRightDetailPrint1">
                        <div className="d-grid h-100 paddingBottomTotalDetailPrint1">
                          <div className="d-flex ">
                            <div className="col-5 ">
                              <p className="text-center">
                                {e?.MaKingCharge_Unit !== 0 &&
                                  NumberWithCommas(e?.MaKingCharge_Unit, 2)}
                              </p>
                            </div>
                            <div className="col-7">
                              <p className="text-end text-end">
                                {e?.MakingAmount +
                                  e?.TotalCsSetcost +
                                  e?.TotalDiaSetcost !==
                                  0 &&
                                  NumberWithCommas(
                                    e?.MakingAmount +
                                    e?.TotalCsSetcost +
                                    e?.TotalDiaSetcost,
                                    2
                                  )}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="position-absolute bottom-0 w-100 spBrdrBtom spBrdrTop totalMinHeightDetailPrint1 d-flex lightGrey d-flex align-items-center justify-content-end paddingRightDetailPrint1 start-0">
                          <div className="col-5">
                            <p className="text-end fw-bold">
                              {/* {e?.MaKingCharge_Unit !== 0 &&
                                NumberWithCommas(e?.MaKingCharge_Unit, 2)} */}
                            </p>
                          </div>
                          <div className="col-7">
                            <p className="text-end fw-bold  ">
                              {e?.MakingAmount +
                                e?.TotalCsSetcost +
                                e?.TotalDiaSetcost !==
                                0 &&
                                NumberWithCommas(
                                  e?.MakingAmount +
                                  e?.TotalCsSetcost +
                                  e?.TotalDiaSetcost,
                                  2
                                )}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="totalAmountDetailPrint1 spBrdrRigt position-relative paddingLeftDetailPrint1 paddingRightDetailPrint1">
                        <div className="d-grid h-100 paddingBottomTotalDetailPrint1">
                          <div>
                            <p className="text-end fw-bold">
                              {e?.UnitCost !== 0 &&
                                NumberWithCommas(e?.UnitCost, 2)}
                            </p>
                          </div>
                        </div>
                        <div className="position-absolute bottom-0 w-100 spBrdrTop spBrdrBtom totalMinHeightDetailPrint1 lightGrey d-flex align-items-center justify-content-end start-0">
                          <p className="text-end fw-bold paddingRightDetailPrint1 paddingRightDetailPrint1">
                            {e?.UnitCost !== 0 &&
                              NumberWithCommas(e?.UnitCost, 2)}
                          </p>
                        </div>
                      </div>
                    </div>
                    {e?.Discount !== 0 && <div className="d-flex w-100">
                      <div className="srNoDetailprint11 spBrdrRigt spBrdrLft spBrdrBtom">
                        <p className=" p-1"></p>
                      </div>
                      <div className="designDetalPrint1 spBrdrRigt  p-1 spBrdrBtom"></div>
                      <div className={`diamondDetailPrint1l spBrdrRigt position-relative spBrdrBtom lightGrey`}>
                        <div className="d-grid"></div>
                      </div>
                      <div className={`metalGoldDetailPrint1l spBrdrRigt  position-relative spBrdrBtom lightGrey`}></div>
                      <div className={`stoneDetailsPrint1l spBrdrRigt position-relative spBrdrBtom pt-1 lightGrey`}>
                        <div className="d-grid">
                          {e?.Discount !== 0 && (
                            <p className="p-1 text-end fw-bold paddingLeftDetailPrint1 paddingRightDetailPrint1">
                              Discount{" "}
                              {e?.Discount !== 0 &&
                                NumberWithCommas(e?.Discount, 2)}
                              {e?.Discount && "%"} @Total Amount
                            </p>
                          )}
                        </div>
                      </div>
                      <div className={`otherAmountDetailPrint1l spBrdrRigt spBrdrBtom lightGrey`}>
                        <p className="d-flex align-items-center justify-content-end"></p>
                      </div>
                      <div className="labourAmountDetailPrint1 spBrdrRigt lightGrey spBrdrBtom pt-1">
                        <div className="d-grid h-100">
                          <div className="d-flex">
                            <div className="col-5">
                              <p className=" p-1 text-end"></p>
                            </div>
                            <div className="col-7 fw-bold">
                              <p className=" text-end">
                                {e?.DiscountAmt !== 0 &&
                                  NumberWithCommas(e?.DiscountAmt, 2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="totalAmountDetailPrint1 spBrdrRigt spBrdrBtom d-flex align-tems-center justify-content-end lightGrey">
                        <p className="d-flex align-items-center">
                          {<span
                            dangerouslySetInnerHTML={{
                              __html: json0Data?.Currencysymbol,
                            }}
                          ></span>}
                          <span className="fw-bold">
                            {e?.TotalAmount !== 0 &&
                              NumberWithCommas(e?.TotalAmount, 2)}
                          </span>
                        </p>
                      </div>
                    </div>}
                  </div>
                );
              })
            }

            {/* cgst */}
            <div className="d-flex w-100 spBrdrBtom spBrdrLft recordDetailPrint1 detailPrint1L_font_11">
              <div className="cgstDetailPrint1 text-end spBrdrRigt paddingLeftDetailPrint1 paddingRightDetailPrint1 py-1">
                {total?.discountTotalAmount !== 0 && (<p className="">Total Discount</p>)}
                {json0Data?.Privilege_discount !== 0 && (
                  <p className="">Privilege Card Discount</p>
                )}
                {taxes?.length > 0 &&
                  taxes?.map((e, i) => {
                    return (
                      <p key={i} className="">
                        {e?.name} @ {e?.per}
                      </p>
                    );
                  })}
                  <p className="">{json0Data?.AddLess < 0 ? "Less" : "Add"}</p>
              </div>
              <div className="cgstTotalDetailPrint1 text-end spBrdrRigt paddingLeftDetailPrint1 paddingRightDetailPrint1 py-1">
                {total?.discountTotalAmount !== 0 && (<p>{NumberWithCommas(total?.discountTotalAmount,2)}</p>)}
                {json0Data?.Privilege_discount !== 0 && (
                  <p>- {json0Data?.Privilege_discount}</p>
                )}
                {taxes.length > 0 &&
                  taxes.map((e, i) => {
                    return <p key={i}>{NumberWithCommas(e?.amount, 2)}</p>;
                  })}
                <p>{formatAmount(json0Data?.AddLess)}</p>
              </div>
            </div>

            {/* total */}
            <div className="d-flex w-100 recordDetailPrint1 lightGrey detailPrint1L_font_11">
              <div className="designDetalPrint1Total spBrdrRigt spBrdrBtom spBrdrLft d-table">
                <p className="fw-bold text-center d-table-cell align-middle">
                  Total
                </p>
              </div>
              <div className={`diamondDetailPrint1l spBrdrRigt position-relative spBrdrBtom d-flex flex-column justify-content-center paddingLeftDetailPrint1 paddingRightDetailPrint1`}>
                <div className="d-flex">
                  <div className=" col-2">
                    <p className=""></p>
                  </div>
                  <div className=" col-2">
                    <p className=""></p>
                  </div>
                  <div className=" col-2 text-end fw-bold">
                    <p className="">{NumberWithCommas(finalD?.mainTotal?.diamonds?.Pcs, 0)}</p>
                  </div>
                  <div className=" col-2 text-end">
                    <p className="fw-bold">
                      {NumberWithCommas(finalD?.mainTotal?.diamonds?.Wt, 3)}
                    </p>
                  </div>
                  <div className=" col-2 text-end">
                    <p className=""></p>
                  </div>
                  <div className=" col-2 text-end">
                    <p className="fw-bold">
                      {NumberWithCommas(finalD?.mainTotal?.diamonds?.Amount, 2)}
                    </p>
                  </div>
                </div>
              </div>
              <div className={`metalTotalDetailPrint1l spBrdrRigt position-relative spBrdrBtom d-flex flex-column justify-content-center`}>
                <div className="d-flex">
                  <div className="col-3 paddingRightDetailPrint1">
                    <p className=""></p>
                  </div>
                  <div className="col-2 text-end paddingRightDetailPrint1">
                    <p className="fw-bold">{NumberWithCommas(finalD?.mainTotal?.netwt + (finalD?.mainTotal?.diamonds?.Wt / 5), 3)}</p>
                  </div>
                  <div className="col-2 text-end paddingRightDetailPrint1">
                    <p className="fw-bold">
                      {NumberWithCommas(finalD?.mainTotal?.metal?.Wt, 3)}
                      {/* {NumberWithCommas(finalD?.mainTotal?.netwt, 3)} */}
                    </p>
                  </div>
                  <div className="col-2 text-end paddingRightDetailPrint1">
                    <p className=""></p>
                  </div>
                  <div className="col-3 text-end paddingRightDetailPrint1">
                    <p className="fw-bold">
                      {NumberWithCommas(finalD?.mainTotal?.MetalAmount, 2)}
                    </p>
                  </div>
                </div>
              </div>
              <div className={`stoneDetailsPrint1l spBrdrRigt position-relative spBrdrBtom d-flex flex-column justify-content-center paddingLeftDetailPrint1 paddingRightDetailPrint1`}>
                <div className="d-flex">
                  <div className="col-2 paddingRightDetailPrint1">
                    <p className=""></p>
                  </div>
                  <div className="col-2 paddingRightDetailPrint1">
                    <p className=""></p>
                  </div>
                  <div className="col-2 text-end d-flex justify-content-end align-items-center h-100  paddingRightDetailPrint1">
                    <p className="fw-bold">
                      {NumberWithCommas(total?.colorStonePcs, 0)}
                    </p>
                  </div>
                  <div className="col-2 text-end d-flex justify-content-end align-items-center h-100  paddingRightDetailPrint1">
                    <p className="fw-bold">
                      {fixedValues(total?.colorStoneWt, 3)}
                    </p>
                  </div>
                  <div className="col-2 text-end d-flex justify-content-end align-items-center h-100  paddingRightDetailPrint1">
                    <p className="fw-bold"></p>
                  </div>
                  <div className="col-2 text-end d-flex justify-content-end align-items-center h-100 ">
                    <p className="fw-bold">
                      {NumberWithCommas(total?.colorStoneAmount, 2)}
                    </p>
                  </div>
                </div>
              </div>
              <div className={`otherAmountDetailPrint1l spBrdrRigt  spBrdrBtom d-table paddingLeftDetailPrint1 paddingRightDetailPrint1`}>
                <p className="py-1 d-flex align-items-center justify-content-end d-table-cell align-middle fw-bold" >
                  <span>{NumberWithCommas(finalD?.mainTotal?.miscChargesTotals, 2)}</span>
                </p>
              </div>
              <div className="labourAmountDetailPrint1 spBrdrRigt  spBrdrBtom paddingLeftDetailPrint1 paddingRightDetailPrint1">
                <div className="d-grid h-100">
                  <div className="d-flex justify-content-end">
                    <div className="d-table">
                      <p className="d-table-cell align-middle text-end h-100 text-end fw-bold">
                        {NumberWithCommas(total?.labourAmount, 2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="totalAmountDetailPrint1 spBrdrRigt  spBrdrBtom paddingLeftDetailPrint1 paddingRightDetailPrint1">
                <p className="d-flex justify-content-end align-items-center h-100 text-end fw-bold">
                  {<span
                    dangerouslySetInnerHTML={{
                      __html: json0Data?.Currencysymbol,
                    }}
                  ></span>}
                  {(NumberWithCommas(total?.withDiscountTaxAmount, 2))}
                </p>
              </div>
            </div>

            {/* summary */}
            <div className="d-flex w-100 pt-1 recordDetailPrint1 detailPrint1L_font_11">
              <div className="col-4 pe-1">
                <p className="spBrdrLft cmonHeight fw-bold d-flex align-items-center justify-content-center spBrdrBtom w-100 spBrdrRigt fntSizeAtLst spBrdrTop lightGrey">
                  SUMMARY
                </p>
                <div className="d-flex spBrdrRigt ">
                  <div className="spBrdrLft col-6 spBrdrRigt position-relative d-flex flex-column">
                    <div className="d-flex justify-content-between px-1">
                      <p className="fw-bold lh_dlpp_memo_11">GOLD IN 24KT</p>
                      <p className="lh_dlpp_memo_11">
                        {fixedValues(finalD?.mainTotal?.total_purenetwt - notGoldMetalWtTotal,3)} gm
                      </p>
                    </div>
                    {
                      MetShpWise?.map((e, i) => {
                        return <div className="d-flex justify-content-between px-1" key={i}>
                        <p className="fw-bold lh_dlpp_memo_11">{e?.ShapeName}</p>
                        <p className="lh_dlpp_memo_11"> {fixedValues(e?.metalfinewt, 3)} gm </p>
                      </div>
                      })
                    }
                    <div className="d-flex justify-content-between px-1">
                      <p className="fw-bold lh_dlpp_memo_11">GROSS WT</p>
                      <p className="lh_dlpp_memo_11">
                        {" "}
                        {fixedValues(summary?.grossWt, 3)} gm
                      </p>
                    </div>
                    <div className="d-flex justify-content-between px-1">
                      <p className="fw-bold lh_dlpp_memo_11">*(G+D) WT</p>
                      {/* <p classNamxe= pt-1'p-1'> {fixedValues(summary?.gDWt, 3)} gm</p> */}
                      <p className="lh_dlpp_memo_11">
                        {NumberWithCommas(finalD?.mainTotal?.netwt + (finalD?.mainTotal?.diamonds?.Wt / 5), 3)} gm
                      </p>
                    </div>
                    <div className="d-flex justify-content-between px-1">
                      <p className="fw-bold lh_dlpp_memo_11">NET WT</p>
                      <p className="lh_dlpp_memo_11"> {fixedValues(finalD?.mainTotal?.metal?.IsPrimaryMetal, 3)} gm</p>
                    </div>
                    <div className="d-flex justify-content-between px-1">
                      <p className="fw-bold lh_dlpp_memo_11">DIAMOND WT</p>
                      <p className="lh_dlpp_memo_11">
                        {NumberWithCommas(finalD?.mainTotal?.diamonds?.Pcs, 0)} / {NumberWithCommas(finalD?.mainTotal?.diamonds?.Wt, 3)} cts
                        {/* {NumberWithCommas(summary?.diamondpcs, 0)} /{" "} {fixedValues(summary?.diamondWt, 3)} cts */}
                      </p>
                    </div>
                    <div className="d-flex justify-content-between px-1">
                      <p className="fw-bold lh_dlpp_memo_11">STONE WT</p>
                      <p className="lh_dlpp_memo_11">
                        {" "}
                        {NumberWithCommas(summary?.stonePcs, 0)} /{" "}
                        {fixedValues(summary?.stoneWt, 3)} cts
                      </p>
                    </div>
                    {json0Data?.Privilege_discount !== 0 && (
                      <div className="d-flex justify-content-between px-1">
                        <p className="fw-bold lh_dlpp_memo_11">Privilege Discount</p>
                        <p className="lh_dlpp_memo_11">- {json0Data?.Privilege_discount}</p>
                      </div>
                    )}
                    <div className="d-flex justify-content-between spBrdrTop w-100 spBrdrBtom bottom-0 totalLineDetailPrint1 lightGrey">
                      <p className="fw-bold lh_dlpp_memo_11"> </p>
                      <p className="lh_dlpp_memo_11"> </p>
                    </div>
                  </div>
                  <div className="col-6 position-relative d-flex flex-column">
                    <div className="d-flex justify-content-between px-1">
                      <p className="fw-bold lh_dlpp_memo_11">GOLD</p>
                      <p className="lh_dlpp_memo_11">
                        {" "}
                        {NumberWithCommas((finalD?.mainTotal?.MetalAmount - notGoldMetalTotal), 2)}
                      </p>
                    </div>
                      {
                        MetShpWise?.map((e, i) => {
                          return <div className="d-flex justify-content-between px-1">
                           <React.Fragment key={i}><p className="fw-bold lh_dlpp_memo_11">{e?.ShapeName}</p>
                          <p className="lh_dlpp_memo_11">
                            {" "}
                            {NumberWithCommas(e?.Amount, 2)}
                          </p>
                          </React.Fragment>
                      </div>
                        })
                      }
                    <div className="d-flex justify-content-between px-1">
                      <p className="fw-bold lh_dlpp_memo_11">DIAMOND</p>
                      <p className="lh_dlpp_memo_11">
                        {" "}
                        {NumberWithCommas(finalD?.mainTotal?.diamonds?.Amount, 2)}
                      </p>
                    </div>
                    <div className="d-flex justify-content-between px-1">
                      <p className="fw-bold lh_dlpp_memo_11">CST</p>
                      <p className="lh_dlpp_memo_11">
                        {NumberWithCommas(finalD?.mainTotal?.colorstone?.Amount, 2)}
                      </p>
                    </div>
                    <div className="d-flex justify-content-between px-1">
                      <p className="fw-bold lh_dlpp_memo_11">MAKING</p>
                      <p className="lh_dlpp_memo_11">
                        {" "}
                        {/* {NumberWithCommas(summary?.makingAmount, 2)} */}
                        {NumberWithCommas(total?.labourAmount, 2)}
                      </p>
                    </div>
                    <div className="d-flex justify-content-between px-1">
                      <p className="fw-bold lh_dlpp_memo_11">OTHER</p>
                      <p className="lh_dlpp_memo_11">
                        {" "}
                        {NumberWithCommas(finalD?.mainTotal?.miscChargesTotals, 2)}
                      </p>
                    </div>
                    <div className="d-flex justify-content-between px-1">
                      <p className="fw-bold lh_dlpp_memo_11">LESS</p>
                      <p className="lh_dlpp_memo_11">
                        {" "}
                        {NumberWithCommas(summary?.addLess, 2)}
                      </p>
                    </div>
                    <div className="d-flex justify-content-between spBrdrTop position-absolute w-100 spBrdrBtom bottom-0 totalLineDetailPrint1 lightGrey px-1">
                      <p className="fw-bold lh_dlpp_memo_11 d-flex justify-content-center align-items-center">TOTAL</p>
                      <p className="lh_dlpp_memo_11 d-flex justify-content-center align-items-center">
                        {NumberWithCommas(total?.withDiscountTaxAmount, 2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* summaryPadBotDetailPrint1 */}
              <div className="col-2 pe-1">
                <div className={`spBrdrRigt spBrdrLft spBrdrTop ${diamondDetails?.length === 1 && `d-flex flex-column justify-content-between h-100`}`}>
                  <p className="fw-bold d-flex align-items-center justify-content-center cmonHeight spBrdrBtom w-100 lightGrey fntSizeAtLst">
                    Diamond Detail
                  </p>
                  <div className="d-flex flex-column justify-content-start h-100">
                    {diamondDetails?.map((e, i) => {
                      return e?.Wt !== undefined && <React.Fragment key={i}>
                        <div className={`d-flex justify-content-between px-1 align-items-center`}>
                          <p className="fw-bold">{e?.ShapeName === "OTHER" ? e?.ShapeName : <>{e?.ShapeName} {e?.QualityName} {e?.Colorname}</>}</p>
                          <p>
                            {NumberWithCommas(e?.Pcs, 0)}/{NumberWithCommas(e?.Wt, 3)} Cts
                          </p>
                        </div>
                      </React.Fragment>
                    })}
                  </div>
                  <div className="d-flex justify-content-between spBrdrTop cmonHeight w-100 spBrdrBtom lightGrey" />  
                </div>
              </div>
              <div className="col-2 pe-1">
                <div className="spBrdrBtom spBrdrTop">
                  <p className="fw-bold cmonHeight d-flex align-items-center justify-content-center spBrdrLft spBrdrRigt spBrdrBtom w-100 spBrdrLft lightGrey">
                    OTHER DETAILS
                  </p>
                  {checkBox?.brokarage && brokarage.map((e, i) => {
                    return (
                      <div
                        className="d-flex spBrdrLft spBrdrRigt "
                        key={i}
                      >
                        <div className="col-6">
                          <p className="fw-bold p-1">{e?.label}</p>
                        </div>
                        <div className="col-6">
                          <p className="text-end p-1">{e?.value}</p>
                        </div>
                      </div>
                    );
                  })}
                  <div className="d-flex spBrdrLft spBrdrRigt ">
                    <div className="col-6">
                      <p className="fw-bold p-1">RATE IN 24KT</p>
                    </div>
                    <div className="col-6">
                      <p className="text-end p-1">
                        {NumberWithCommas(json0Data?.MetalRate24K, 2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-2 pe-1">
                { json0Data?.PrintRemark !== '' && <div className="spBrdrAll spBrdrTop">
                  <p className="fw-bold text-center spBrdrLft spBrdrBtom w-100 spBrdrLft lightGrey">
                    REMARK
                  </p>
                  <p
                    dangerouslySetInnerHTML={{ __html: json0Data?.PrintRemark }}
                    className="pb-3 pt-1 ps-1 pe-1"
                  ></p>
                </div>}
              </div>
              <div className="col-2">
                <div className="d-flex  spBrdrLft spBrdrRigt spBrdrBtom createdByDetailPrint1 spBrdrTop">
                  <div className="col-6 spBrdrRigt  d-flex align-items-end justify-content-center oneMorLstHeight">
                    <i> Created By</i>
                  </div>
                  <div className="col-6 d-flex align-items-end justify-content-center oneMorLstHeight">
                    <i> Checked By</i>
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
  );
};

export default DetailPrintGroupPMemo;
