// CONTAIN DATA OF Detail Print 10, Detail Print 5, Estimate Print, Tax Invoice
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import {
  NumberWithCommas,
  apiCall,
  checkMsg,
  fixedValues,
  formatAmount,
  handleImageError,
  handlePrint,
  isObjectEmpty,
} from "../../GlobalFunctions";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";
import "../../assets/css/salesprint/saleprint1.css";
import Loader from "../../components/Loader";
import { OrganizeInvoicePrintData } from "../../GlobalFunctions/OrganizeInvoicePrintData";
import { MetalShapeNameWiseArr } from "../../GlobalFunctions/MetalShapeNameWiseArr";
import { cloneDeep } from "lodash";
import { checkFlag } from "../../GlobalFunctions/checkFlag";

const SalePrint1 = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {
  const [apiData, setApiData] = useState(null);
  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const [diamondWise, setDiamondWise] = useState([]);
  const [imgFlag, setImgFlag] = useState(true);
  const [isImageWorking, setIsImageWorking] = useState(true);

  
  const [MetShpWise, setMetShpWise] = useState([]);
  const [notGoldMetalTotal, setNotGoldMetalTotal] = useState(0);
  const [notGoldMetalWtTotal, setNotGoldMetalWtTotal] = useState(0);
  const [CatWiseArr, setCatWiseArr] = useState([])

  const [shortHeaderFlag, setShortHeaderFlag] = useState(true);
  const [withoutShipToAddressFlag, setWithoutShipToAddressFlag] = useState(true);
  const [gold24KRateFlag, setGold24KRateFlag] = useState(true);
  const [catCountFlag, setCatCountFlag] = useState(true);
  const [jobWiseTotalFlag, setJobWiseTotalFlag] = useState(true);
  const [tncFlag, setTncFlag] = useState(true);
  const [groupJobEffectFlag, setGroupJobEffectFlag] = useState(true);

  const checkboxes = [
    { id: 'headerHideShow', label: 'With Short Header', flag: shortHeaderFlag, setter: setShortHeaderFlag },
    { id: 'shipAddressHS', label: 'Without Ship To Address', flag: withoutShipToAddressFlag, setter: setWithoutShipToAddressFlag },
    { id: 'gold24KrateHS', label: 'With Gold 24K Rate', flag: gold24KRateFlag, setter: setGold24KRateFlag },
    { id: 'catCountHS', label: 'With Category Count Summary', flag: catCountFlag, setter: setCatCountFlag },
    { id: 'totalHS', label: 'With Job Wise Total', flag: jobWiseTotalFlag, setter: setJobWiseTotalFlag },
    { id: 'tncFlag', label: 'With Terms & Conditions', flag: tncFlag, setter: setTncFlag },
    { id: 'groupJobEffect', label: 'With Group Job Effect', flag: groupJobEffectFlag, setter: setGroupJobEffectFlag }
  ];

  useEffect(() => {
    const sendData = async () => {
      try {
        const data = await apiCall(token, invoiceNo, printName, urls, evn, ApiVer);

        if (data?.Status === "200") {
          let isEmpty = isObjectEmpty(data?.Data);
          if (!isEmpty) {
            loadData(data?.Data);
            setApiData(data?.Data);
            checkFlag(atob(invoiceNo), atob(printName), atob(evn));
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
        console.log(error);
      }
    };
    sendData();

    let printNameEvWise = (atob(printName))?.toLowerCase();
    if(printNameEvWise){
      console.log(atob(printName));
      if(printNameEvWise === 'detail print 10'){
          setShortHeaderFlag(false);
          setWithoutShipToAddressFlag(true);
          setGold24KRateFlag(true);
          setCatCountFlag(false);
          setJobWiseTotalFlag(false);
          setTncFlag(false);
          setGroupJobEffectFlag(false);
      }
      if(printNameEvWise === 'detail print 5'){
          setShortHeaderFlag(false);
          setWithoutShipToAddressFlag(true);
          setGold24KRateFlag(false);
          setCatCountFlag(false);
          setJobWiseTotalFlag(true);
          setTncFlag(false);
          setGroupJobEffectFlag(false);
      }
      if(printNameEvWise === 'estimate print'){
          setShortHeaderFlag(true);
          setWithoutShipToAddressFlag(true);
          setGold24KRateFlag(false);
          setCatCountFlag(false);
          setJobWiseTotalFlag(true);
          setTncFlag(false);
          setGroupJobEffectFlag(true);
      }
      if(printNameEvWise === 'tax invoice'){
          setShortHeaderFlag(false);
          setWithoutShipToAddressFlag(true);
          setGold24KRateFlag(false);
          setCatCountFlag(true);
          setJobWiseTotalFlag(true);
          setTncFlag(true);
          setGroupJobEffectFlag(true);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function loadData(data) {
    let address = data?.BillPrint_Json[0]?.Printlable?.split("\r\n");
    data.BillPrint_Json[0].address = address;
    const datas = OrganizeDataPrint(
      data?.BillPrint_Json[0],
      data?.BillPrint_Json1,
      data?.BillPrint_Json2,
    );

    let met_shp_arr = MetalShapeNameWiseArr(datas?.json2);
      
    setMetShpWise(met_shp_arr);

    let tot_met = 0;
    let tot_met_wt = 0;
    met_shp_arr?.forEach((e, i) => {
      tot_met += e?.Amount;
      tot_met_wt += e?.metalfinewt;
    })    
    setNotGoldMetalTotal(tot_met);
    setNotGoldMetalWtTotal(tot_met_wt);

    let diaObj = {
      ShapeName: "OTHERS",
      wtWt: 0,
      wtWts: 0,
      pcPcs: 0,
      pcPcss: 0,
      rRate: 0,
      rRates: 0,
      amtAmount: 0,
      amtAmounts: 0,
    };

    let diaonlyrndarr1 = [];
    let diaonlyrndarr2 = [];
    let diaonlyrndarr3 = [];
    let diaonlyrndarr4 = [];
    let diarndotherarr5 = [];
    let diaonlyrndarr6 = [];
    datas?.json2?.forEach((e) => {
      if (e?.MasterManagement_DiamondStoneTypeid === 1) {
        if (e.ShapeName?.toLowerCase() === "rnd") {
          diaonlyrndarr1.push(e);
        } else {
          diaonlyrndarr2.push(e);
        }
      }
    });

    diaonlyrndarr1.forEach((e) => {
      let findRecord = diaonlyrndarr3.findIndex(
        (a) =>
          e?.StockBarcode === a?.StockBarcode &&
          e?.ShapeName === a?.ShapeName &&
          e?.QualityName === a?.QualityName &&
          e?.Colorname === a?.Colorname
      );

      if (findRecord === -1) {
        let obj = { ...e };
        obj.wtWt = e?.Wt;
        obj.pcPcs = e?.Pcs;
        obj.rRate = e?.Rate;
        obj.amtAmount = e?.Amount;
        diaonlyrndarr3.push(obj);
      } else {
        diaonlyrndarr3[findRecord].wtWt += e?.Wt;
        diaonlyrndarr3[findRecord].pcPcs += e?.Pcs;
        diaonlyrndarr3[findRecord].rRate += e?.Rate;
        diaonlyrndarr3[findRecord].amtAmount += e?.Amount;
      }
    });

    diaonlyrndarr2.forEach((e) => {
      let findRecord = diaonlyrndarr4.findIndex(
        (a) =>
          e?.StockBarcode === a?.StockBarcode &&
          e?.ShapeName === a?.ShapeName &&
          e?.QualityName === a?.QualityName &&
          e?.Colorname === a?.Colorname
      );

      if (findRecord === -1) {
        let obj = { ...e };
        obj.wtWt = e?.Wt;
        obj.wtWts = e?.Wt;
        obj.pcPcs = e?.Pcs;
        obj.pcPcss = e?.Pcs;
        obj.rRate = e?.Rate;
        obj.rRates = e?.Rate;
        obj.amtAmount = e?.Amount;
        obj.amtAmounts = e?.Amount;
        diaonlyrndarr4.push(obj);
      } else {
        diaonlyrndarr4[findRecord].wtWt += e?.Wt;
        diaonlyrndarr4[findRecord].wtWts += e?.Wt;
        diaonlyrndarr4[findRecord].pcPcs += e?.Pcs;
        diaonlyrndarr4[findRecord].pcPcss += e?.Pcs;
        diaonlyrndarr4[findRecord].rRate += e?.Rate;
        diaonlyrndarr4[findRecord].rRates += e?.Rate;
        diaonlyrndarr4[findRecord].amtAmount += e?.Amount;
        diaonlyrndarr4[findRecord].amtAmounts += e?.Amount;
      }
    });

    diaonlyrndarr4.forEach((e) => {
      diaObj.wtWt += e?.wtWt;
      diaObj.wtWts += e?.wtWts;
      diaObj.pcPcs += e?.pcPcs;
      diaObj.pcPcss += e?.pcPcss;
      diaObj.rRate += e?.rRate;
      diaObj.rRates += e?.rRates;
      diaObj.amtAmount += e?.amtAmount;
      diaObj.amtAmounts += e?.amtAmounts;
    });
    
    diaonlyrndarr3?.forEach((e) => {
      let find_record = diaonlyrndarr6?.findIndex(
        (a) =>
          e?.ShapeName === a?.ShapeName &&
          e?.QualityName === a?.QualityName &&
          e?.Colorname === a?.Colorname
      );
      if (find_record === -1) {
        let obj = { ...e };
        obj.wtWts = e?.wtWt;
        obj.pcPcss = e?.pcPcs;
        obj.rRates = e?.rRate;
        obj.amtAmounts = e?.amtAmount;
        diaonlyrndarr6.push(obj);
      }else{
        diaonlyrndarr6[find_record].wtWts += e?.wtWt;
        diaonlyrndarr6[find_record].pcPcss += e?.pcPcs;
        diaonlyrndarr6[find_record].rRates += e?.rRate;
        diaonlyrndarr6[find_record].amtAmounts += e?.amtAmount;
      }
    });

    diarndotherarr5 = [...diaonlyrndarr6, diaObj];

    let catwise = [];
    datas?.resultArray?.forEach((a) => {
      let find_record = catwise?.findIndex((al) => (al?.Categoryname === a?.Categoryname));
      if (find_record === -1) {
        let obj = {...a};
        obj._Quantity = a?.Quantity;
        catwise.push(obj);
      } else {
        catwise[find_record]._Quantity += a?.Quantity;
      }
    })

    //groupjob effect
    let finalArr = [];
    if(groupJobEffectFlag){
      datas?.resultArray?.forEach((a) => {
        if(a?.GroupJob === ''){
          finalArr.push(a);
      }else{
        let b = cloneDeep(a);
        let find_record = finalArr.findIndex((el) => el?.GroupJob === b?.GroupJob);
        if(find_record === -1){
          finalArr.push(b);
        }else{
          if(finalArr[find_record]?.GroupJob !== finalArr[find_record]?.SrJobno){
              finalArr[find_record].designno = b?.designno;
              finalArr[find_record].HUID = b?.HUID; 
          }
          finalArr[find_record].grosswt += b?.grosswt;
          finalArr[find_record].NetWt += b?.NetWt;
          finalArr[find_record].LossWt += b?.LossWt;
          finalArr[find_record].TotalAmount += b?.TotalAmount;
          finalArr[find_record].DiscountAmt += b?.DiscountAmt;
          finalArr[find_record].UnitCost += b?.UnitCost;
          finalArr[find_record].MakingAmount += b?.MakingAmount;
          finalArr[find_record].OtherCharges += b?.OtherCharges;
          finalArr[find_record].TotalDiamondHandling += b?.TotalDiamondHandling;
          finalArr[find_record].Quantity += b?.Quantity;
          finalArr[find_record].Wastage += b?.Wastage;
          finalArr[find_record].totals.metal.IsPrimaryMetal += b?.totals?.metal?.IsPrimaryMetal;
          finalArr[find_record].totals.diamonds.Wt += b?.totals?.diamonds?.Wt;
          // finalArr[find_record].diamonds_d = [...finalArr[find_record]?.diamonds ,...b?.diamonds]?.flat();
          finalArr[find_record].diamonds = [...finalArr[find_record]?.diamonds, ...b?.diamonds]?.flat();
          // finalArr[find_record].colorstone_d = [...finalArr[find_record]?.colorstone ,...b?.colorstone]?.flat();
          finalArr[find_record].colorstone = [...finalArr[find_record]?.colorstone, ...b?.colorstone]?.flat();
          // finalArr[find_record].metal_d = [...finalArr[find_record]?.metal ,...b?.metal]?.flat();
          finalArr[find_record].metal = [...finalArr[find_record]?.metal, ...b?.metal]?.flat();
          finalArr[find_record].misc = [...finalArr[find_record]?.misc ,...b?.misc]?.flat();
          finalArr[find_record].totals.diamonds.Wt += b?.totals?.diamonds?.Wt;
          finalArr[find_record].totals.diamonds.Pcs += b?.totals?.diamonds?.Pcs;
          finalArr[find_record].totals.diamonds.Amount += b?.totals?.diamonds?.Amount;
          finalArr[find_record].totals.colorstone.Wt += b?.totals?.colorstone?.Wt;
          finalArr[find_record].totals.colorstone.Pcs += b?.totals?.colorstone?.Pcs;
          finalArr[find_record].totals.colorstone.Amount += b?.totals?.colorstone?.Amount;
          finalArr[find_record].totals.misc.Wt += b?.totals?.misc?.Wt;
          finalArr[find_record].totals.misc.allservwt += b?.totals?.misc?.allservwt;
          finalArr[find_record].totals.misc.Pcs += b?.totals?.misc?.Pcs;
          finalArr[find_record].totals.misc.Amount += b?.totals?.misc?.Amount;
          finalArr[find_record].totals.metal.Amount += b?.totals?.metal?.Amount;
          finalArr[find_record].totals.metal.IsPrimaryMetal += b?.totals?.metal?.IsPrimaryMetal;
          finalArr[find_record].totals.metal.IsPrimaryMetal_Amount += b?.totals?.metal?.IsPrimaryMetal_Amount;
          finalArr[find_record].totals.misc.withouthscode1_2_pcs += b?.totals?.misc?.withouthscode1_2_pcs;
          finalArr[find_record].totals.misc.withouthscode1_2_wt += b?.totals?.misc?.withouthscode1_2_wt;
          finalArr[find_record].totals.misc.onlyHSCODE3_amt += b?.totals?.misc?.onlyHSCODE3_amt;
          // finalArr[find_record].misc_d = [...finalArr[find_record]?.misc ,...b?.misc]?.flat();
        }
      }
      })
      datas.resultArray = finalArr;
    }


    setCatWiseArr(catwise);
    setDiamondWise(diarndotherarr5);
    setResult(datas);
  }

  const handleCheckbox = () => {
    if (imgFlag) {
      setImgFlag(false);
    } else {
      setImgFlag(true);
    }
  };

  const handleImageErrors = () => {
    setIsImageWorking(false);
  };


// Reusable toggle handler
const toggleFlag = (setter, flag) => {
  setter(!flag);
};

  useEffect(() => {
    if (apiData) {
      loadData(apiData); // Re-process the data when groupJobEffectFlag changes
    }
  }, [groupJobEffectFlag]);

  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <>
          {msg === "" ? (
            <>
              <div className="containerdp10 pab60_dp10">
                <div className="d-flex justify-content-end align-items-center hidebtndp10 mb-4">

                      <div className="d-flex align-items-center">
                        {checkboxes?.map(({ id, label, flag, setter }) => (
                          <div className="d-flex align-items-center" key={id}>
                            {/* <input
                              type="checkbox"
                              id={id}
                              className="mx-1"
                              checked={flag}
                              onChange={() => toggleFlag(setter, flag)}
                            />
                            <label htmlFor={id} className="me-3 user-select-none">
                              {label}
                            </label> */}
                          </div>
                        ))}
                      </div>
                  <input
                    type="checkbox"
                    id="imghideshow"
                    className="mx-1"
                    checked={imgFlag}
                    onChange={handleCheckbox}
                  />
                  <label htmlFor="imghideshow" className="me-3 user-select-none">
                    With Image
                  </label>
                  <button
                    className="btn_white blue mb-0 hidedp10 m-0 p-2"
                    onClick={(e) => handlePrint(e)}
                  >
                    Print
                  </button>
                </div>
                {/* header */}
                <div>
                  <div className="pheaddp10">
                    {result?.header?.PrintHeadLabel}
                  </div>
                  { !shortHeaderFlag && <div className="d-flex justify-content-between">
                    <div className="p-1 fsgdp10">
                      <div className="fw-bold fs-6 py-2">
                        {result?.header?.CompanyFullName}
                      </div>
                      <div>{result?.header?.CompanyAddress}</div>
                      <div>{result?.header?.CompanyAddress2}</div>
                      <div>{result?.header?.CompanyCity}</div>
                      <div>
                        {result?.header?.CompanyCity}-
                        {result?.header?.CompanyPinCode},{" "}
                        {result?.header?.CompanyState}(
                        {result?.header?.CompanyCountry})
                      </div>
                       <div>T {result?.header?.CompanyTellNo}</div>
                      <div>
                        {result?.header?.CompanyEmail} |{" "}
                        {result?.header?.CompanyWebsite}
                      </div>
                      <div>
                        {result?.header?.Company_VAT_GST_No} |{" "}
                        {result?.header?.Company_CST_STATE}-
                        {result?.header?.Company_CST_STATE_No} | PAN- {result?.header?.Pannumber}
                      </div>
                    </div>
                    <div className="d-flex justify-content-end pe-2 pt-2">
                        {isImageWorking && (result?.header?.PrintLogo !== "" && 
                          <img src={result?.header?.PrintLogo} alt="" 
                          className='w-100 h-auto ms-auto d-block object-fit-contain'
                          onError={handleImageErrors} height={120} width={150} style={{maxWidth: "116px"}} />)}
                    </div>
                  </div>}
                </div>
                {/* subheader */}
                { !shortHeaderFlag && <div className="subheaderdp10">
                  <div className="subdiv1dp10 border-end fsgdp10 border-start ">
                    <div className="px-1">{result?.header?.lblBillTo}</div>
                    <div className="px-1 fw-bold">
                      {result?.header?.customerfirmname}
                    </div>
                    <div className="px-1">
                      {result?.header?.customerAddress2}
                    </div>
                    <div className="px-1">
                      {result?.header?.customerAddress1}
                    </div>
                    <div className="px-1">
                      {result?.header?.customerAddress3}
                    </div>
                    <div className="px-1">
                      {result?.header?.customercity1}-{result?.header?.PinCode}
                    </div>
                    <div className="px-1">{result?.header?.customeremail1}</div>
                    <div className="px-1">{result?.header?.vat_cst_pan}</div>
                    <div className="px-1"> {result?.header?.Cust_CST_STATE}- {result?.header?.Cust_CST_STATE_No} </div>
                  </div>
                  <div className="subdiv2dp10 border-end fsgdp10">
                    { withoutShipToAddressFlag && <>
                    <div className="px-1">Ship To,</div>
                    <div className="px-1 fw-bold">
                      {result?.header?.customerfirmname}
                    </div>
                    {result?.header?.address?.map((e, i) => {
                      return (
                        <div className="px-1" key={i}>
                          {e}
                        </div>
                      );
                    })}
                    </>}
                  </div>
                  <div className="subdiv3dp10 fsgdp10 border-end">
                    <div className="d-flex justify-content-start px-1">
                      <div className="w-25 fw-bold">BILL NO</div>
                      <div className="w-25">{result?.header?.InvoiceNo}</div>
                    </div>
                    <div className="d-flex justify-content-start px-1">
                      <div className="w-25 fw-bold">DATE</div>
                      <div className="w-25">{result?.header?.EntryDate}</div>
                    </div>
                    <div className="d-flex justify-content-start px-1">
                      <div className="w-25 fw-bold">
                        {result?.header?.HSN_No_Label}
                      </div>
                      <div className="w-25">{result?.header?.HSN_No}</div>
                    </div>
                    { gold24KRateFlag && <div className="d-flex justify-content-end mt-5 px-2 fw-bold">
                      Gold Rate {result?.header?.MetalRate24K?.toFixed(2)} Per
                      Gram
                    </div>}
                  </div>
                </div>}

                {/* short header */}
                {
                  shortHeaderFlag && <div className="d-flex justify-content-between align-items-center fsgdp10 ps-1">
                    <div className="fsgdp10">
                        <div>To,</div>
                        <div className="fw-bold  fs-6 py-2">{result?.header?.customerfirmname}</div>
                    </div>
                    <div className="fsgdp10" style={{width:'15%'}}>
                      <div className="d-flex align-items-center py-1">
                        <div className="w-25 d-flex justify-content-end">Invoice#:</div>
                        <div className="fw-bold w-75 ps-2">{result?.header?.InvoiceNo}</div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="w-25 d-flex justify-content-end">Date:</div>
                        <div className="fw-bold ps-2 w-75">{result?.header?.EntryDate}</div>
                      </div>
                      <div className="d-flex align-items-center py-1">
                        <div className="w-25 d-flex justify-content-end">{result?.header?.HSN_No_Label}:</div>
                        <div className="fw-bold w-75 ps-2">{result?.header?.HSN_No}</div>
                      </div>
                    </div>
                  </div>
                  
                }
                {/* table */}

                  <div className="tabledp10">
                  {/* tablehead */}
                  <div className="theaddp10 fw-bold fsg2dp10" style={{backgroundColor:'#F5F5F5'}}>
                    <div className="col1dp10 centerdp10 ">Sr</div>
                    <div className="col2dp10 centerdp10  fw-bold">Design</div>
                    <div className="col3dp10">
                      <div className="h-50 centerdp10 fw-bold w-100">
                        Diamond
                      </div>
                      <div className="d-flex justify-content-between align-items-center h-50 bt_dp10 w-100">
                        <div className="centerdp10 h-100 bright_dp10 theadsubcol1_dp10">
                          Code
                        </div>
                        <div className="centerdp10 h-100 bright_dp10 theadsubcol1_dp10">
                          Size
                        </div>
                        <div
                          className="centerdp10 h-100 bright_dp10 theadsubcol1_dp10"
                          style={{ width: "14.66%" }}
                        >
                          Pcs
                        </div>
                        <div className="centerdp10 h-100 bright_dp10 theadsubcol1_dp10">
                          Wt
                        </div>
                        <div className="centerdp10 h-100 bright_dp10 theadsubcol1_dp10">
                          Rate
                        </div>
                        <div
                          className="centerdp10 h-100 theadsubcol1_dp10"
                          style={{ width: "18.66%" }}
                        >
                          Amount
                        </div>
                      </div>
                    </div>
                    <div className="col4dp10 ">
                      <div className="h-50 centerdp10 fw-bold w-100">Metal</div>
                      <div className="d-flex justify-content-between align-items-center h-50 bt_dp10 w-100">
                        <div
                          className="theadsubcol2_dp10 bright_dp10 h-100 centerdp10"
                          style={{ width: "30%" }}
                        >
                          Quality
                        </div>
                        <div className="theadsubcol2_dp10 centerdp10 bright_dp10 h-100">
                          N+L
                        </div>
                        <div className="theadsubcol2_dp10 centerdp10 bright_dp10 h-100">
                          Rate
                        </div>
                        <div className="theadsubcol2_dp10 centerdp10 h-100" style={{width:'25%'}}>
                          Amount
                        </div>
                      </div>
                    </div>
                    <div className="col3dp10">
                      <div className="h-50 centerdp10 fw-bold w-100">Stone</div>
                      <div className="d-flex justify-content-between align-items-center h-50 bt_dp10 w-100">
                        <div className="centerdp10 h-100 bright_dp10 theadsubcol1_dp10" style={{width:'21.66%'}}>
                          Code
                        </div>
                        <div className="centerdp10 h-100 bright_dp10 theadsubcol1_dp10 ">
                          Size
                        </div>
                        <div className="centerdp10 h-100 bright_dp10 theadsubcol1_dp10" style={{width:'11.66%'}}>
                          Pcs
                        </div>
                        <div className="centerdp10 h-100 bright_dp10 theadsubcol1_dp10">
                          Wt
                        </div>
                        <div className="centerdp10 h-100 bright_dp10 theadsubcol1_dp10">
                          Rate
                        </div>
                        <div className="centerdp10 h-100 theadsubcol1_dp10">
                          Amount
                        </div>
                      </div>
                    </div>
                    <div className="col6dp10">
                      <div className="d-flex justify-content-center align-items-center h-50 w-100">
                        Other
                      </div>
                      <div className="d-flex justify-content-center align-items-center h-50 w-100">
                        Charges
                      </div>
                    </div>
                    <div className="col7dp10">
                      <div className="h-50 centerdp10 fw-bold w-100">
                        Labour
                      </div>
                      <div className="d-flex justify-content-between align-items-center h-50 bt_dp10  w-100">
                        <div className="w-50 h-100 centerdp10 bright_dp10">
                          Rate
                        </div>
                        <div className="w-50 h-100 centerdp10">Amount</div>
                      </div>
                    </div>
                    <div className="col8dp10">
                      <div className="d-flex justify-content-center align-items-center h-50 border-top w-100">
                        Total
                      </div>
                      <div className="d-flex justify-content-center align-items-center h-50 w-100">
                        Amount
                      </div>
                    </div>
                  </div>
                  {/* table body */}
                  <div className="tbodydp10 fsgdp10 ">
                    {result?.resultArray?.map((e, i) => {
                      return (
                        <>
                        <div className="tbrowdp10 h-100 border-bottom-none border-top" key={i}>
                          <div className="tbcol1dp10 center_sdp10">
                            {/* {e?.SrNo} */}
                            {i + 1}
                          </div>
                          <div className="tbcol2dp10 d-flex flex-column justify-content-between">
                            <div className="d-flex justify-content-between px-1 flex-wrap">
                              <div className="fsgdp10">{e?.designno}</div>
                              <div className="fsgdp10">{e?.SrJobno}</div>
                            </div>
                            <div className="d-flex justify-content-end px-1">
                              {e?.MetalColor}
                            </div>
                            {imgFlag ? (
                              <div
                                className="w-100 d-flex justify-content-center align-items-start fsgdp10"
                                style={{ minHeight: "80px" }}
                              >
                                <img
                                  src={e?.DesignImage}
                                  onError={(e) => handleImageError(e)}
                                  alt="design"
                                  className="imgdp10"
                                />
                              </div>
                            ) : (
                              ""
                            )}

                            <div className="centerdp10 fsgdp10">
                              {e?.batchnumber}
                            </div>
                            {e?.HUID !== "" ? (
                              <div className="centerdp10 fsgdp10">
                                HUID - {e?.HUID}
                              </div>
                            ) : (
                              ""
                            )}
                            <div className="centerdp10 fw-bold fsgdp10">
                              PO: {e?.PO}
                            </div>
                            <div className="centerdp10 fw-bold fsgdp10">
                                {e?.lineid}
                            </div>
                            <div className="centerdp10 fsgdp10">
                              Tunch : &nbsp;
                              <b className="fsgdp10">{e?.Tunch?.toFixed(3)}</b>
                            </div>
                            <div className="centerdp10">
                              <b className="fsgdp10">
                                {e?.grosswt?.toFixed(3)} gm
                              </b>
                              &nbsp; Gross
                            </div>
                            <div className="centerdp10">
                              {" "}
                              {e?.Size === "" ? "" : `Size : ${e?.Size}`}
                            </div>
                          </div>
                          <div className="tbcol3dp10 ">
                            {e?.diamonds?.map((el, idia) => {
                              return (
                                <div className="d-flex" key={idia}>
                                  <div className="theadsubcol1_dp10" style={{wordBreak:'break-word',paddingLeft:'2px'}}>
                                    {el?.ShapeName} {el?.QualityName}&nbsp;
                                    {el?.Colorname}
                                  </div>
                                  <div className="theadsubcol1_dp10 text-center" style={{lineHeight:'8px !important'}}>
                                    {el?.SizeName}
                                  </div>
                                  <div
                                    className="theadsubcol1_dp10 end_dp10"
                                    style={{ width: "8.66%" }}
                                  >
                                    {el?.Pcs}
                                  </div>
                                  <div className="theadsubcol1_dp10 end_dp10">
                                    {el?.Wt?.toFixed(3)}
                                  </div>
                                  <div className="theadsubcol1_dp10 end_dp10" style={{width:'19.66%'}}>
                                    {formatAmount(el?.Rate)}
                                  </div>
                                  <div
                                    className="theadsubcol1_dp10 fw-bold end_dp10 pr_dp10"
                                    style={{ width: "21.66%" }}
                                  >
                                    {formatAmount(el?.Amount)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="tbcol4dp10">
                            {e?.metal?.map((el, imet) => {
                              return (
                                <div className="d-flex w-100" key={imet}>
                                  <div
                                    className="theadsubcol2_dp10 d-flex justify-content-start border-end h-100 ps-1 border-end-0"
                                    style={{ width: "30%", wordBreak:'break-word' }}
                                  >
                                    {el?.ShapeName} {el?.QualityName}
                                  </div>
                                  <div className="theadsubcol2_dp10 centerdp10 border-end h-100 pe-1 border-end-0 end_dp10">
                                    {/* {(e?.NetWt + e?.LossWt)?.toFixed(3)} */}
                                    {el?.Wt?.toFixed(3)}
                                  </div>
                                  <div className="theadsubcol2_dp10 centerdp10 border-end h-100 pe-1 border-end-0 end_dp10">
                                    {el?.Rate?.toFixed(2)}
                                  </div>
                                  <div className={`theadsubcol2_dp10 centerdp10 border-end h-100 pe-1 border-end-0 end_dp10 pr_dp10 ${el?.IsPrimaryMetal === 1 ? '' : 'fw-bold' }`} style={{width:'25%'}}>
                                    {el?.Amount?.toFixed(2)}
                                  </div>
                                </div>
                              );
                            })}
                            <div className="p-2 px-1">
                              {e?.JobRemark !== "" ? (
                                <>
                                  <b className="fsgdp10">Remark : </b>{" "}
                                  {e?.JobRemark}
                                </>
                              ) : (
                                ""
                              )}{" "}
                            </div>
                          </div>
                          <div className="tbcol3dp10">
                            {e?.colorstone?.map((el, ics) => {
                              return (
                                <div className="d-flex" key={ics}>
                                  <div className="theadsubcol1_dp10" style={{wordBreak:'break-word', paddingLeft:'2px', width:'21.66%'}}>
                                    {el?.ShapeName +
                                      " " +
                                      el?.QualityName +
                                      " " +
                                      el?.Colorname}
                                  </div>
                                  <div className="theadsubcol1_dp10 text-center">
                                    {el?.SizeName}
                                  </div>
                                  <div className="theadsubcol1_dp10 end_dp10" style={{width:'11.66%'}}>
                                    {el?.Pcs}
                                  </div>
                                  <div className="theadsubcol1_dp10 end_dp10">
                                    {el?.Wt?.toFixed(3)}
                                  </div>
                                  <div className="theadsubcol1_dp10 end_dp10">
                                    {el?.Rate?.toFixed(2)}
                                  </div>
                                  <div className="theadsubcol1_dp10 end_dp10 fw-bold pr_dp10">
                                    {el?.Amount?.toFixed(2)}
                                  </div>
                                </div>
                              );
                            })}
                            {e?.mics?.length > 0 &&
                            e?.mics?.map((ele, ind) => {
                              return (
                                <div className="d-flex" key={ind}>
                                  <div className="width20EstimatePrint p_1Estimate">
                                    <p>
                                      M: {ele?.ShapeName} {ele?.QualityName}{" "}
                                      {/* {ele?.Colorname} */}
                                    </p>
                                  </div>
                                  <div className="width20EstimatePrint p_1Estimate">
                                    <p className="">{ele?.SizeName}</p>
                                  </div>
                                  <div className="width20EstimatePrint p_1Estimate">
                                    <p className="text-end">
                                      {ele?.Pcs > 0 && NumberWithCommas(ele?.Pcs, 0)}
                                    </p>
                                  </div>
                                  <div className="width20EstimatePrint p_1Estimate">
                                    <p className="text-end">
                                      {ele?.Wt > 0 && fixedValues(ele?.Wt, 3)}
                                    </p>
                                  </div>
                                  <div className="width20EstimatePrint p_1Estimate">
                                    <p className="text-end">
                                      { NumberWithCommas(ele?.Rate, 2)}
                                    </p>
                                  </div>
                                  <div className="width20EstimatePrint p_1Estimate">
                                    <p className="fw-bold text-end">
                                      { NumberWithCommas(ele?.Amount, 2)}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="tbcol6dp10 end_dp10 p-1 pr_dp10">
                            {formatAmount( e?.OtherCharges + e?.MiscAmount + e?.TotalDiamondHandling )}
                          </div>
                          <div className="tbcol7dp10 ">
                            <div className="d-flex">
                              <div className="w-50 end_dp10 pr_dp10">
                                {formatAmount(e?.MaKingCharge_Unit)}
                              </div>
                              <div className="w-50 end_dp10  pr_dp10">
                                {formatAmount( (e?.MakingAmount + e?.TotalDiaSetcost + e?.TotalCsSetcost) )}
                              </div>
                            </div>
                          </div>
                          <div className="tbcol8dp10 end_dp10 fw-bold p-1 pad_top_dp10 pr_dp10">
                            {formatAmount((e?.TotalAmount + e?.DiscountAmt))}
                          </div>
                        </div>
                        { jobWiseTotalFlag && <div className="d-flex  brb_dp10  tbrowdp10 fw-bold" style={{ backgroundColor: "#F5F5F5" }} >
                          <div className="tbcol1dp10"></div>
                          <div className="centerdp10  tbcol2dp10" >  </div>
                          <div className="tbcol3dp10 d-flex align-items-center ">
                            <div className="theadsubcol1_dp10"></div>
                            <div className="theadsubcol1_dp10"></div>
                            <div className="theadsubcol1_dp10 end_dp10">
                              {e?.totals?.diamonds?.Pcs !== 0 && e?.totals?.diamonds?.Pcs}
                            </div>
                            <div className="theadsubcol1_dp10 end_dp10" style={{width:'20%'}}>
                              { e?.totals?.diamonds?.Wt !== 0 && e?.totals?.diamonds?.Wt?.toFixed(3)}
                            </div>
                            <div className="theadsubcol1_dp10 end_dp10 pr_dp10" style={{ width: "48%" }} >
                              { e?.totals?.diamonds?.Amount !== 0 && formatAmount(e?.totals?.diamonds?.Amount)}
                            </div>
                          </div>
                          <div className="tbcol4dp10 d-flex align-items-center ">
                            <div className="theadsubcol2_dp10" style={{ width: "40%" }} ></div>
                            <div className="theadsubcol2_dp10 pr_dp10">
                              {/* { e?.totals?.metal?.IsPrimaryMetal !== 0 && e?.totals?.metal?.IsPrimaryMetal?.toFixed(3)} */}
                              {(e?.NetWt + e?.LossWt) ?.toFixed(3)}
                            </div>
                            <div className="theadsubcol2_dp10 end_dp10 pr_dp10" style={{ width: "40%" }} >
                              { e?.totals?.metal?.IsPrimaryMetal_Amount !== 0 && formatAmount(e?.totals?.metal?.IsPrimaryMetal_Amount)}
                            </div>
                          </div>
                          <div className="tbcol3dp10 d-flex align-items-center ">
                            <div className="theadsubcol1_dp10"></div>
                            <div className="theadsubcol1_dp10"></div>
                            <div className="theadsubcol1_dp10 end_dp10">
                              { e?.totals?.colorstone?.Pcs !==0 && e?.totals?.colorstone?.Pcs}
                            </div>
                            <div className="theadsubcol1_dp10 end_dp10">
                              { e?.totals?.colorstone?.Wt !== 0 && e?.totals?.colorstone?.Wt?.toFixed(3)}
                            </div>
                            {/* <div className="theadsubcol1_dp10"></div> */}
                            <div className="theadsubcol1_dp10 end_dp10 pr_dp10" style={{ width: "33.32%" }} >
                              { e?.totals?.colorstone?.Amount !== 0 && formatAmount(e?.totals?.colorstone?.Amount)}
                            </div>
                          </div>
                          <div className="tbcol6dp10 end_dp10  d-flex align-items-center  pr_dp10" style={{ paddingRight:'1px'}}>
                              { (e?.OtherCharges + e?.MiscAmount + e?.TotalDiamondHandling) !== 0 && formatAmount( e?.OtherCharges + e?.MiscAmount + e?.TotalDiamondHandling )}
                          </div>
                          <div className="tbcol7dp10 end_dp10  d-flex align-items-center  pr_dp10">
                              { (e?.MakingAmount + e?.TotalDiaSetcost + e?.TotalCsSetcost) !== 0 && formatAmount( (e?.MakingAmount + e?.TotalDiaSetcost + e?.TotalCsSetcost) )}
                          </div>
                          <div className="tbcol8dp10 end_dp10  d-flex align-items-center pr_dp10">
                            { e?.TotalAmount !== 0 && formatAmount(e?.TotalAmount)}
                          </div>
                        </div>}
                        </>
                      );
                    })}
                  </div>
                  {/* final total */}
                  <div className="d-flex justify-content-end align-items-center brb_dp10 tbrowdp10 pt-1">
                    <div style={{ width: "13%" }}>
                      <div className="d-flex justify-content-between">
                        <div className="w-50 end_dp10">Net Amount</div>
                        <div className="w-50 end_dp10 pr_dp10">
                          {(
                            +result?.mainTotal?.total_amount?.toFixed(2) +
                            +result?.mainTotal?.total_discount_amount?.toFixed(
                              2
                            )
                          )?.toFixed(2)}
                        </div>
                      </div>
                      <div className="d-flex justify-content-between">
                        <div className="w-50 end_dp10">Total Discount</div>
                        <div className="w-50 end_dp10 pr_dp10">
                          {result?.mainTotal?.total_discount_amount?.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        {result?.allTaxes?.map((e, i) => {
                          return (
                            <div
                              className="d-flex justify-content-between"
                              key={i}
                            >
                              <div className="w-50 end_dp10">
                                {e?.name} {e?.per}
                              </div>
                              <div className="w-50 end_dp10 pr_dp10">
                                {formatAmount(e?.amountInNumber)}
                              </div>
                            </div>
                          );
                        })}
                        <div className="d-flex justify-content-between">
                          <div className="w-50 end_dp10">
                            {result?.header?.AddLess > 0 ? "Add" : "Less"}
                          </div>
                          <div className="w-50 end_dp10 pr_dp10">
                            {result?.header?.AddLess}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* all table row total */}
                  <div className="d-flex grandtotaldp10 brb_dp10 brbb_dp10 tbrowdp10" style={{ backgroundColor: "#F5F5F5" }} >
                    <div className="centerdp10 brR_dp10" style={{ width: "12.5%" }} >
                      Total
                    </div>
                    <div className="col3dp10 d-flex align-items-center brR_dp10">
                      <div className="theadsubcol1_dp10"></div>
                      <div className="theadsubcol1_dp10"></div>
                      <div className="theadsubcol1_dp10 end_dp10">
                        {result?.mainTotal?.diamonds?.Pcs}
                      </div>
                      <div className="theadsubcol1_dp10 end_dp10">
                        {result?.mainTotal?.diamonds?.Wt?.toFixed(3)}
                      </div>
                      {/* <div className="theadsubcol1_dp10"></div> */}
                      <div
                        className="theadsubcol1_dp10 end_dp10 pr_dp10"
                        style={{ width: "33.332%" }}
                      >
                        {formatAmount(result?.mainTotal?.diamonds?.Amount)}
                      </div>
                    </div>
                    <div className="col4dp10 d-flex align-items-center brR_dp10">
                      <div
                        className="theadsubcol2_dp10"
                        style={{ width: "40%" }}
                      ></div>
                      <div className="theadsubcol2_dp10 pr_dp10">
                        {/* {result?.mainTotal?.netwtWithLossWt?.toFixed(3)} */}
                        {result?.mainTotal?.metal?.IsPrimaryMetal?.toFixed(3)}
                      </div>
                      {/* <div className="theadsubcol2_dp10"></div> */}
                      <div
                        className="theadsubcol2_dp10 end_dp10 pr_dp10"
                        style={{ width: "45%" }}
                      >
                        {formatAmount(result?.mainTotal?.metal?.IsPrimaryMetal_Amount)}
                      </div>
                    </div>
                    <div className="col3dp10 d-flex align-items-center brR_dp10">
                      <div className="theadsubcol1_dp10"></div>
                      <div className="theadsubcol1_dp10"></div>
                      <div className="theadsubcol1_dp10 end_dp10">
                        {result?.mainTotal?.colorstone?.Pcs}
                      </div>
                      <div className="theadsubcol1_dp10 end_dp10">
                        {result?.mainTotal?.colorstone?.Wt?.toFixed(3)}
                      </div>
                      {/* <div className="theadsubcol1_dp10"></div> */}
                      <div
                        className="theadsubcol1_dp10 end_dp10 pr_dp10"
                        style={{ width: "33.32%" }}
                      >
                        {formatAmount(result?.mainTotal?.colorstone?.Amount)}
                      </div>
                    </div>
                    <div className="col6dp10 end_dp10  d-flex align-items-center brR_dp10 pr_dp10" style={{width:'5%', paddingRight:'1px'}}>
                      {formatAmount(result?.mainTotal?.total_otherCharge_Diamond_Handling)}
                    </div>
                    <div className="col7dp10 end_dp10  d-flex align-items-center brR_dp10 pr_dp10">
                      {formatAmount( result?.mainTotal?.total_labour?.labour_amount + result?.mainTotal?.total_TotalDiaSetcost + result?.mainTotal?.total_TotalCsSetcost )}
                    </div>
                    <div className="col8dp10 end_dp10  d-flex align-items-center pr_dp10">
                      {formatAmount(result?.finalAmount)}
                    </div>
                  </div>
                  </div>
                  {/* summary */}
                  <div className="d-flex justify-content-between mt-1 summarydp10">
                    <div className="d-flex flex-column sumdp10">
                      <div className="fw-bold bg_dp10 w-100 centerdp10  ball_dp10">
                        SUMMARY
                      </div>
                      <div className="d-flex w-100 fsgdp10">
                        <div className="w-50 bright_dp10  bl_dp10">
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">GOLD IN 24KT</div>
                            <div className="w-50 end_dp10 pe-1">
                              {(result?.mainTotal?.total_purenetwt - notGoldMetalWtTotal)?.toFixed(3)} gm
                            </div>
                          </div>
                          {
                            MetShpWise?.map((e, i) => {
                              return <div className="d-flex justify-content-between px-1" key={i}>
                              <div className="w-50 fw-bold">{e?.ShapeName}</div>
                              <div className="w-50 end_dp10 pe-1">
                                {e?.metalfinewt?.toFixed(3)} gm
                              </div>
                            </div>
                            })
                          }
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">GROSS WT</div>
                            <div className="w-50 end_dp10 pe-1">
                              {result?.mainTotal?.grosswt?.toFixed(3)} gm
                            </div>
                          </div>
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">NET WT</div>
                            <div className="w-50 end_dp10 pe-1">
                            {result?.mainTotal?.metal?.IsPrimaryMetal?.toFixed(3)}
                              gm
                            </div>
                          </div>
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">DIAMOND WT</div>
                            <div className="w-50 end_dp10 pe-1">
                              {result?.mainTotal?.diamonds?.Pcs} /{" "}
                              {result?.mainTotal?.diamonds?.Wt?.toFixed(3)} cts
                            </div>
                          </div>
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">STONE WT</div>
                            <div className="w-50 end_dp10 pe-1">
                              {result?.mainTotal?.colorstone?.Pcs} /{" "}
                              {result?.mainTotal?.colorstone?.Wt?.toFixed(3)}{" "}
                              cts
                            </div>
                          </div>
                        </div>
                        <div className="w-50 bright_dp10 ">
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">GOLD</div>
                            <div className="w-50 end_dp10">
                              {formatAmount((result?.mainTotal?.metal?.IsPrimaryMetal_Amount - notGoldMetalTotal))}
                            </div>
                          </div>
                          {
                            MetShpWise?.map((e, i) => {
                              return <div className="d-flex justify-content-between px-1" key={i}>
                              <div className="w-50 fw-bold">{e?.ShapeName}</div>
                              <div className="w-50 end_dp10">
                                {formatAmount((e?.Amount))}
                              </div>
                            </div>
                            })
                          }
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">DIAMOND</div>
                            <div className="w-50 end_dp10">
                              {formatAmount(
                                result?.mainTotal?.diamonds?.Amount
                              )}
                            </div>
                          </div>
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">CST</div>
                            <div className="w-50 end_dp10">
                              {formatAmount(
                                result?.mainTotal?.colorstone?.Amount
                              )}
                            </div>
                          </div>
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">MAKING </div>
                            <div className="w-50 end_dp10">
                              {formatAmount(
                                 (result?.mainTotal?.total_labour?.labour_amount + result?.mainTotal?.total_TotalDiaSetcost + result?.mainTotal?.total_TotalCsSetcost )
                              )}
                            </div>
                          </div>
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">OTHER </div>
                            <div className="w-50 end_dp10">
                              {formatAmount(result?.mainTotal?.total_otherCharge_Diamond_Handling)}
                            </div>
                          </div>
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">
                              {result?.header?.AddLess > 0 ? "ADD" : "LESS"}
                            </div>
                            <div className="w-50 end_dp10">
                              {result?.header?.AddLess}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg_dp10 h_bd10 ball_dp10 d-flex fsgdp10 ">
                        <div className="w-50 h-100"></div>
                        <div className="w-50 h-100 d-flex align-items-center bl_dp10">
                          <div className="fw-bold w-50 px-1">TOTAL</div>
                          <div className="w-50 end_dp10 px-1">
                            {formatAmount(result?.finalAmount)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="dia_sum_dp10 d-flex flex-column  fsgdp10">
                      <div className="h_bd10 centerdp10 bg_dp10 fw-bold ball_dp10">
                        Diamond Detail
                      </div>
                      {diamondWise?.map((e, i) => {
                        return (
                          <div
                            className="d-flex justify-content-between px-1 ball_dp10 border-top-0 border-bottom-0 fsgdp10"
                            key={i}
                          >
                            <div className="fw-bold w-50">
                              {e?.ShapeName} {e?.QualityName} {e?.Colorname}
                            </div>
                            <div className="w-50 end_dp10">
                              {e?.pcPcss} / {e?.wtWts?.toFixed(3)} cts
                            </div>
                          </div>
                        );
                      })}
                      <div className="d-flex justify-content-between px-1 bg_dp10 h_bd10  ball_dp10">
                        <div className="fw-bold w-50 h14_dp10" ></div>
                        <div className="w-50"></div>
                      </div>
                    </div>
                    <div className="oth_sum_dp10 fsgdp10">
                      <div className="h_bd10 centerdp10 bg_dp10 fw-bold ball_dp10">
                        OTHER DETAILS
                      </div>
                      <div className="d-flex flex-column justify-content-between w-100 px-1 ball_dp10 border-top-0 p-1">
                        <div className="d-flex">
                          <div className="w-50 fw-bold start_dp10 fsgdp10">
                            RATE IN 24KT
                          </div>
                          <div className="w-50 end_dp10 fsgdp10">
                            {result?.header?.MetalRate24K?.toFixed(2)}
                          </div>
                        </div>
                        <div>
                          {result?.header?.BrokerageDetails?.map((e, i) => {
                            return (
                              <div className="d-flex fsgdp10" key={i}>
                                <div className="w-50 fw-bold start_dp10">
                                  {e?.label}
                                </div>
                                <div className="w-50 end_dp10">{formatAmount(e?.value)}</div>
                              </div>
                            );
                          })}
                        </div>
                        <div className={`${catCountFlag && 'border-top'}`}>
                          { catCountFlag && <>{
                            CatWiseArr?.map((e, i) => {
                              return (
                                  <div className="d-flex fsgdp10" key={i}>
                                    <div className="w-50 fw-bold start_dp10">
                                      {e?.Categoryname}
                                    </div>
                                    <div className="w-50 end_dp10">{e?._Quantity}</div>
                                  </div>
                              ) 
                            })
                          }</>}
                          </div>
                      </div>
                    </div>
                     {
                      result?.header?.PrintRemark === '' ? <div style={{width:'15%'}}></div> : <div className="remark_sum_dp10 fsgdp10">
                      <div className="h_bd10 centerdp10 bg_dp10 fw-bold ball_dp10">
                        Remark
                      </div>
                       <div className="ball_dp10 border-top-0 p-1 text-break" dangerouslySetInnerHTML={{ __html: result?.header?.PrintRemark }} >
                      </div>
                    </div>
                     } 
                    <div className="check_dp10 ball_dp10 d-flex justify-content-center align-items-end pb-1 fsgdp10 max_height_box">
                      <i>Created By</i>
                    </div>
                    <div className="check_dp10 ball_dp10 d-flex justify-content-center align-items-end pb-1 fsgdp10 max_height_box">
                      <i>Checked By</i>
                    </div>
                  </div>
                  {/* note */}
                  { tncFlag && <div className={`border my-1 no_break`}>
                    <p className="fw-bold pt-2 px-2" style={{ fontSize: "13px" }}> NOTE :</p>
                    <div className={`px-2 pb-2 declaraionSP1`} dangerouslySetInnerHTML={{ __html: result?.header?.Declaration }}></div>
                  </div>}
                  <div style={{color:'gray'}} className="pt-3" >**   THIS IS A COMPUTER GENERATED INVOICE AND KINDLY NOTIFY US IMMEDIATELY IN CASE YOU FIND ANY DISCREPANCY IN THE DETAILS OF TRANSACTIONS</div>
                
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

export default SalePrint1;
