import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import {
  apiCall,
  checkMsg,
  formatAmount,
  handleImageError,
  handlePrint,
  isObjectEmpty,
} from "../../GlobalFunctions";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";
import Loader from "../../components/Loader";
import { ToWords } from "to-words";
import "../../assets/css/prints/detailPrint12.css";
import { NumToWord } from "./../../GlobalFunctions/NumToWord";
import { cloneDeep } from "lodash";

const DetailPrint12 = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {
  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const [imgFlag, setImgFlag] = useState(true);
  const [priceFlag, setPriceFlag] = useState(true);
  const [summaryFlag, setSummaryFlag] = useState(true);
  const [isImageWorking, setIsImageWorking] = useState(true);

  const [categoryWise, setCategoryWise] = useState([]);
  const [miscWise, setMiscWise] = useState([]);
  const [fineWtTotal, setFineWtTotal] = useState(0);
  const [catcount, setCatCount] = useState(0);
  const [miscWise_total, setMiscWise_total] = useState({
    Pcs: 0,
    pcPcs: 0,
    wtWeight_Ctw: 0,
    wtWeight_gm: 0,
    AmtAmount: 0,
    Wt: 0,
    Wt_Ctw: 0,
    dia_Wt_gm: 0,
    Wt_gm: 0,
    Amount: 0,
  });

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
        console.log(error);
      }
    };
    sendData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = (data) => {
    let address = data?.BillPrint_Json[0]?.Printlable?.split("\r\n");
    data.BillPrint_Json[0].address = address;

    const datas = OrganizeDataPrint(
      data?.BillPrint_Json[0],
      data?.BillPrint_Json1,
      data?.BillPrint_Json2
    );

    let mainArr =   datas?.resultArray?.map((e) => {
      let obj = cloneDeep(e);
      let findings = {
        Wt: 0,
        SizeName: 0
      };
    let sizeWt =0
    datas?.json2?.forEach((ele, ind) => {
      if (ele?.MasterManagement_DiamondStoneTypeid === 5 && ele?.StockBarcode === e?.SrJobno) {
        findings.Wt += ele?.Wt 
        findings.SizeName += +ele?.SizeName;
        sizeWt += (+ele?.SizeName* ele?.Wt);
      }
    });
    let fineWtss = (((e?.NetWt-findings?.Wt)*e?.Tunch)/100) + ((sizeWt)/100);
    obj.fineWtss = fineWtss;
    return obj
    // totals.fineWts += fineWtss;
  })
  datas.resultArray = mainArr;

    let cgwise = [];
    let cat_Count = 0;
    datas?.resultArray?.forEach((e) => {
      let findIndex = cgwise?.findIndex(
        (el) =>
          el?.Categoryname === e?.Categoryname && el?.Wastage === e?.Wastage
      );
      if (findIndex === -1) {
        let obj = { ...e };
        obj.cg_netwt = (e?.NetWt + e?.LossWt - e?.totals?.metal?.WithOutPrimaryMetal);
        obj.cg_grosswt = e?.grosswt;
        obj.cg_quantity = e?.Quantity;
        obj.cg_wastage = e?.Wastage;
        obj.cg_tunch = e?.Tunch;
        obj.cg_finewt = e?.fineWtss;
        obj.cat_count = 1;
        cgwise.push(obj);
      } else {
        cgwise[findIndex].cg_netwt +=
          e?.NetWt + e?.LossWt - e?.totals?.metal?.WithOutPrimaryMetal;
        cgwise[findIndex].cg_grosswt += e?.grosswt;
        cgwise[findIndex].cg_wastage += e?.Wastage;
        cgwise[findIndex].cg_quantity += e?.Quantity;
        cgwise[findIndex].cg_tunch += e?.Tunch;
        cgwise[findIndex].cg_wastage += e?.Wastage;
        cgwise[findIndex].cat_count += 1;
        cgwise[findIndex].cg_finewt += e?.fineWtss;
      }
    });
    cgwise.forEach((e) => {
      cat_Count = cat_Count + e?.cat_count
    });
    setCatCount(cat_Count)
    cgwise.sort((a, b) => a.Categoryname.localeCompare(b.Categoryname));
    setCategoryWise(cgwise);

    datas?.resultArray?.forEach((e) => {
      let arr = [];
      e?.misc?.forEach((a) => {
        if (a?.IsHSCOE === 0 || a?.IsHSCOE === 3) {
          arr?.push(a);
        }
      });
      if (arr?.length === 1) {
        if (arr[0]?.IsHSCOE === 3) {
          // arr = [];
        }
      }
      e.misc = arr;
    });
    datas?.resultArray?.forEach((e) => {
      if (
        e?.misc?.length === 1 &&
        e?.misc[0]?.IsHSCOE === 3 &&
        e?.misc[0]?.Rate === 0
      ) {
        // e.misc = [];
      }
    });

    datas?.resultArray?.forEach((e, i) => {
      let counts =
        e?.metal?.reduce(
          (acc, cObj) => (cObj?.IsPrimaryMetal === 0 ? acc + 1 : acc),
          0
        ) +
        e?.diamonds?.length +
        e?.colorstone?.length +
        e?.misc?.length + 
        (e?.OtherCharges === 0 ? 0 : 1);

      e.counts = counts;
    });

    setResult(datas);

    let finewt_ = 0;
    datas?.resultArray?.forEach((e) => {
      // finewt_ += (e?.NetWt * e?.Tunch) / 100;
      finewt_ += e?.fineWtss;
    });
    setFineWtTotal(finewt_);

    let misc_wise = [];
    datas?.json2?.forEach((e, i) => {
      let obj = cloneDeep(e);
      if(obj?.MasterManagement_DiamondStoneTypeid === 1 || obj?.MasterManagement_DiamondStoneTypeid === 2 || obj?.MasterManagement_DiamondStoneTypeid === 3){
        misc_wise.push(obj);
      }
    })

    let misc_wise2 = [];
    misc_wise?.forEach((e, i) => {
      let obj = cloneDeep(e);
      if(obj?.MasterManagement_DiamondStoneTypeid === 3 && obj?.IsHSCOE !== 1 && obj?.IsHSCOE !== 2){
          misc_wise2.push(obj);
      }else if(obj?.MasterManagement_DiamondStoneTypeid !== 3 && (obj?.MasterManagement_DiamondStoneTypeid === 1 || obj?.MasterManagement_DiamondStoneTypeid === 2)){
        misc_wise2.push(obj);
      }
    })

    let misc_wise3 = [];
    misc_wise2?.forEach((e, i) => {
      let obj = cloneDeep(e);
      let findrec = misc_wise3?.findIndex((el) => el?.ShapeName === obj?.ShapeName && el?.Rate === obj?.Rate);
      if(findrec === -1){
        misc_wise3.push(obj);
      }else{
        misc_wise3[findrec].Wt += obj?.Wt;
        misc_wise3[findrec].Pcs += obj?.Pcs;
        misc_wise3[findrec].Amount += obj?.Amount;
        misc_wise3[findrec].ServWt += obj?.ServWt;
      }
    })

    let misc_wise4 = [];
    misc_wise2?.forEach((e, i) => {
      if(e?.IsHSCOE !== 3){
        misc_wise4.push(e);
      }
    })


    let misc_sum_total = {
      Pcs: 0,
      pcPcs: 0,
      wtWeight_Ctw: 0,
      wtWeight_gm: 0,
      Wt_Ctw: 0,
      dia_Wt_gm: 0,
      Wt_gm: 0,
      Wt_ServWt:0,
      Amount: 0,
      AmtAmount: 0,
      Wt: 0,
    };

    misc_wise4?.forEach((e) => {

      misc_sum_total.Wt += e?.Wt;
      misc_sum_total.Pcs += e?.Pcs;
      misc_sum_total.Amount += e?.Amount;

      if (e?.MasterManagement_DiamondStoneTypeid === 1 || e?.MasterManagement_DiamondStoneTypeid === 2) {
        misc_sum_total.wtWeight_Ctw += e?.Wt;
      } else {
        misc_sum_total.wtWeight_gm += e?.Wt;
        misc_sum_total.Wt_ServWt += e?.ServWt;
      }
      // misc_sum_total.pcPcs += e?.pcPcs;
      // misc_sum_total.AmtAmount += e?.AmtAmount;
    });

    misc_wise4.sort((a, b) => a.ShapeName.localeCompare(b.ShapeName));

    setMiscWise(misc_wise4);
    setMiscWise_total(misc_sum_total);

    console.log(misc_wise4);
  };


  const handleImgShow = (e) => {
    if (imgFlag) setImgFlag(false);
    else {
      setImgFlag(true);
    }
  };
  const handlePriceShow = (e) => {
    if (priceFlag) setPriceFlag(false);
    else {
      setPriceFlag(true);
    }
  };  
  const handleSummaryShow = (e) => {
    if (summaryFlag) setSummaryFlag(false);
    else {
      setSummaryFlag(true);
    }
  };  
  const handleImageErrors = () => {
    setIsImageWorking(false);
  };

  return (
    <>
      {loader ? (
        <Loader />
      ) : msg === "" ? (
        <div className="containerdp12 pb-5 mb-5">
          
          <div className="d-flex justify-content-end align-items-center my-5 fsgdp12 hidebtn">
            <input type="checkbox" checked={summaryFlag} id="showSummary" onChange={handleSummaryShow} className="mx-2" />
            <label htmlFor="showSummary" className="me-2 user-select-none"> {" "} With Summary{" "} </label>
            <input type="checkbox" checked={priceFlag} id="showPrice" onChange={handlePriceShow} className="mx-2" />
            <label htmlFor="showPrice" className="me-2 user-select-none"> {" "} With Price{" "} </label>
            <input type="checkbox" checked={imgFlag} id="showImg" onChange={handleImgShow} className="mx-2" />
            <label htmlFor="showImg" className="me-2 user-select-none"> {" "} With Image{" "} </label>
            <button className="btn_white blue m-0 " onClick={(e) => handlePrint(e)} > {" "} Print{" "} </button>
          </div>
          
          <div>
            {result?.header?.PrintHeadLabel ? ( "PRODUCT DETAIL SHEET" ) : ( <div className="pheaddp12 w-100"> PRODUCT DETAIL SHEET {result?.header?.PrintHeadLabel}{" "} </div> )}
         
          </div>

          {/* table sub header */}
          <div className="w-100 d-flex border_start_dp12 border_end_dp12 border_bottom_dp12">
            <div style={{width:'33.33%'}} className="border_end_dp12 p-1 fsgdp12">
              <div className="fw-bold px-2 _fsgdp12_ w-100 text-center pb-2">{result?.header?.CompanyFullName}</div>  
              <div className="d-flex justify-content-center">
                {isImageWorking && (result?.header?.PrintLogo !== "" && 
                      <img src={result?.header?.PrintLogo} alt="" 
                      className='w-100 h-auto  d-block object-fit-contain headimgdp12'
                      onError={handleImageErrors} height={120} width={150} style={{maxWidth: "116px"}} />)}
              </div>
            </div>
            <div style={{width:'33.33%'}} className="border_end_dp12 p-1 fsgdp12">
              <div className="w-100 text-center">Bill To,</div>
              <div className="fw-bold _fsgdp12_ w-100 text-center">{result?.header?.customerfirmname}</div>
            </div>
            <div style={{width:'33.33%'}} className="p-1 fsgdp12">
                <div className="d-flex justify-content-center align-items-center">
                  <div className="fw-bold w-50">SHEET NO</div>
                  <div className="w-50">{result?.header?.InvoiceNo}</div>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  <div className="fw-bold w-50">DATE</div>
                  <div className="w-50">{result?.header?.EntryDate}</div>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  <div className="fw-bold w-50">Sales Person</div>
                  <div className="w-50">{result?.header?.SalPerName}</div>
                </div>
            </div>
          </div>
          {/* <div className="d-flex justify-content-between align-items-start w-100 border_start_dp12 border_end_dp12 border_bottom_dp12">
            <div style={{ width: "40%" }} className="h_127_dp12" >
              <div className="d-flex w-100 h_127_dp12">
                <div className="w-50 d-flex flex-column border_end_dp12 h_127_dp12">
                  <div className="fw-bold w-100 _fsgdp12_  pt-3 px-1">
                    {result?.header?.CompanyFullName}
                  </div>
                  <div className="w-100 d-flex flex-column align-items-center fsgdp12 px-1 h_127_dp12">
       
                  </div>
                </div>
                <div className="w-50 px-1 h_127_dp12 border_end_dp12">
                  <div className=" _fsgdp12_ ">
                    <div className="_fsgdp12_">Bill To, </div>
                    <div className="fw-bold _fsgdp12_">{result?.header?.customerfirmname}</div>
                  </div>
    
                </div>
              </div>
            </div>

            <div style={{ width: "20%" }} className="d-flex justify-content-center align-items-center border_end_dp12  h_127_dp12" >
              <img src={result?.header?.PrintLogo} alt="#companylogo" className="w-100 h-auto  d-block object-fit-contain headimgdp12" style={{ minHeight: "120px", maxHeight: "120px", minWidth: "120px", maxWidth: "120px", }} />
            </div>
            <div style={{ width: "40%"}} className="pad_left_dp12">
              <div className="w-100 d-flex align-items-center fsgdp12">
                <div className="fw-bold w-50">SHEET NO</div>
                <div className="w-50">{result?.header?.InvoiceNo}</div>
              </div>
              <div className="w-100 d-flex align-items-center fsgdp12">
                <div className="fw-bold w-50">DATE</div>
                <div className="w-50">{result?.header?.EntryDate}</div>
              </div>
              <div className="w-100 d-flex align-items-center fsgdp12">
                <div className="fw-bold w-50">Delivery Mode</div>
                <div className="w-50">{result?.header?.ModeOfDel}</div>
              </div>
              <div className="w-100 d-flex align-items-center fsgdp12">
                <div className="fw-bold w-50">Due Date</div>
                <div className="w-50">{result?.header?.DueDate}</div>
              </div>
              <div className="w-100 d-flex align-items-center fsgdp12">
                <div className="fw-bold w-50">Terms</div>
                <div className="w-50">{result?.header?.DueDays}</div>
              </div>
              <div className="w-100 d-flex align-items-center fsgdp12">
                <div className="fw-bold w-50">{result?.header?.HSN_No_Label}</div>
                <div className="w-50">{result?.header?.HSN_No}</div>
              </div>
              <div className="w-100 d-flex align-items-center fsgdp12">
                <div className="fw-bold w-50">Sales Person</div>
                <div className="w-50">{result?.header?.SalPerName}</div>
              </div>
            </div>
          </div> */}
        


          <div className="tabledp12 fsgdp12">
            <div className="theaddp12 hcompdp12 bordersdp12">
              <div className="col1dp12 dp12cen">SR#</div>
              <div className="col2dp12 dp12cen text-break ps-1">DESIGN DESCRIPTION</div>
              <div style={{ width: "36%" }} className="brdp12 d-flex">
                <div className="       w-25 h-100">&nbsp;</div>
                <div className="brdp12 w-25 h-100">&nbsp;</div>
                <div className="brdp12  h-100 text-break text-center" style={{width:'24.5%'}}>
                  METAL / MAKING RATE
                </div>
                <div className="        h-100 text-break text-center" style={{width:'25.5%'}}>
                  METAL / MAKING AMOUNT
                </div>

              </div>

              <div className="col7dp12 d-flex flex-column ">
                <div className="dp12cen brbdp12 h-50">
                  POLKI DIAMOND STONE DESCRIPTION{" "}
                </div>
                <div className="d-flex subcoldp12 h-50">
                  <div
                    className="dp12cen w_subcoldp12 brdp12"
                    style={{ width: "25%" }}
                  >
                    {" "}
                    MIS TYPE{" "}
                  </div>
                  <div
                    className="dp12cen w_subcoldp12 brdp12"
                    style={{ width: "10%" }}
                  >
                    {" "}
                    PCS{" "}
                  </div>
                  <div className="dp12cen w_subcoldp12 brdp12">WT</div>
                  <div className="dp12cen w_subcoldp12 brdp12">RATE</div>
                  <div
                    className="dp12cen w_subcoldp12 brdp12"
                    style={{ width: "25%" }}
                  >
                    {" "}
                    AMOUNT{" "}
                  </div>
                </div>
              </div>

              <div className="col9dp12 dp12cen border-end-0">TOTAL AMOUNT</div>
            </div>
            <div className="tbodydp12">
              {result?.resultArray?.map((e, i) => {
                return (
                  <div className="d-flex brbdp12 hcompdp12 bordersdp12 border_top_dp12" key={i}>
                    <div className="rcol1dp12 dp12cen1">{i + 1}</div>
                    <div className="rcol2dp12 d-flex flex-column  justify-content-center  align-items-start p-1">
                      <div className="d-flex justify-content-between align-items-start w-100">
                        <div>{e?.designno}</div>
                        <div>{e?.SrJobno}</div>
                      </div>
                      {imgFlag ? (
                        <div className="w-100 d-flex justify-content-center align-items-start">
                          {" "}
                          <img
                            src={e?.DesignImage}
                            onError={(e) => handleImageError(e)}
                            alt="design"
                            className="rowimgdp12"
                          />{" "}
                        </div>
                      ) : (
                        ""
                      )}

                      <div className="w-100 d-flex justify-content-center align-items-start">
                        {" "}
                        {e?.HUID === "" ? "" : `HUID - ${e?.HUID}`}{" "}
                      </div>
                    </div>

                    <div
                      className="rcol4dp12 d-flex flex-column justify-content-between"
                      style={{ width: "36%" }}
                    >
                      <div>
                        <div className="d-flex brbdp12 w-100">
                          <div className="w-50 brdp12 ps-1 d-flex">
                            <div className="w-50 brdp12 ps-1">KT/COL</div>
                            <div className="w-50 center_dp12 pe-1 text-break">
                              {e?.MetalPurity} {e?.MetalColor}
                            </div>
                          </div>
                          <div className="w-50 ps-1 d-flex">
                            <div className="brdp12 ps-1" style={{width:'48%'}}></div>
                            <div className="end_dp12 pe-1" style={{width:'52%'}}></div>
                          </div>

                          
                        </div>
                        <div className="d-flex brbdp12 w-100">
                          <div className="w-50 brdp12 ps-1 d-flex">
                            <div className="w-50 brdp12 ps-1">GROSS</div>
                            <div className="w-50 center_dp12 pe-1">
                              {e?.grosswt?.toFixed(3)}
                            </div>
                          </div>
                          <div className="w-50 ps-1 d-flex">
                            <div className="brdp12 ps-1" style={{width:'48%'}}></div>
                            <div className="end_dp12 pe-1" style={{width:'52%'}}></div>
                          </div>
                          
                        </div>
                        <div className="d-flex brbdp12 w-100">
                          <div className="w-50 brdp12 ps-1 d-flex">
                            <div className="w-50 brdp12 ps-1">NETWT</div>
                            <div className="w-50 center_dp12 pe-1">
                              {(
                                e?.NetWt +
                                e?.LossWt -
                                e?.totals?.metal?.WithOutPrimaryMetal
                              )?.toFixed(3)}
                            </div>
                          </div>
                          <div className="w-50 ps-1 d-flex">
                            <div className=" brdp12 pe-1 center_dp12" style={{width:'48%'}}>
                              {e?.MetalAmount === 0
                                ? ""
                                : priceFlag &&
                                  formatAmount(
                                    e?.MetalAmount /
                                      result?.header?.CurrencyExchRate /
                                      (e?.NetWt +
                                        e?.LossWt -
                                        e?.totals?.metal
                                          ?.WithOutPrimaryMetal ===
                                      0
                                        ? 1
                                        : e?.NetWt +
                                          e?.LossWt -
                                          e?.totals?.metal?.WithOutPrimaryMetal)
                                  )}
                            </div>
                            <div className=" center_dp12 pe-1" style={{width:'52%'}}>
                              &nbsp;
                              {e?.MetalAmount === 0
                                ? ""
                                : priceFlag &&
                                  formatAmount(
                                    e?.MetalAmount /
                                      result?.header?.CurrencyExchRate
                                  )}
                            </div>
                          </div>

                        </div>
                        <div className="d-flex brbdp12 w-100">
                          <div className="w-50 brdp12 ps-1 d-flex">
                            <div className="w-50 brdp12 ps-1 text-break">MAKING CHARGE</div>
                            <div className="w-50 center_dp12 pe-1">
                              {" "}
                              {(e?.NetWt + e?.LossWt)?.toFixed(3)}{" "}
                            </div>
                          </div>
                          <div className="w-50 ps-1 d-flex">
                            <div className=" brdp12 pe-1 center_dp12" style={{width:'48%'}}>
                              &nbsp;
                              {e?.MaKingCharge_Unit === 0
                                ? ""
                                : priceFlag &&
                                  formatAmount(e?.MaKingCharge_Unit)}
                            </div>
                            <div className=" center_dp12 pe-1" style={{width:'52%'}}>
                              &nbsp;
                              {e?.MakingAmount === 0
                                ? ""
                                : priceFlag &&
                                  formatAmount(
                                    e?.MakingAmount /
                                      result?.header?.CurrencyExchRate
                                  )}
                            </div>
                          </div>
                          
                        </div>
                      </div>
                      <div>
                        <div className="d-flex brbdp12 brtdp12 w-100 fw-bold">
                          <div className="w-50 brdp12 ps-1">&nbsp;</div>
                          <div className="w-50 pe-1 d-flex end_dp12 center_dp12">
                            <div className="w-50 brdp12">&nbsp;</div>
                            <div className="w-50 end_dp12 pe-1 center_dp12">
                              {e?.MakingAmount === 0
                                ? ""
                                : priceFlag &&
                                  formatAmount(
                                    ((e?.MakingAmount + e?.MetalAmount) / result?.header?.CurrencyExchRate)
                                  )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  
                    <div style={{ width: "" }} className=" col7dp12 d-flex flex-column justify-content-between" >
                      
                      <div className="d-grid h-100">
                        {e?.metal?.length > 0 &&
                          e?.metal?.map((el, ind) => {
                            return (
                              el?.IsPrimaryMetal === 0 && (
                                <React.Fragment key={ind}>
                                  <div className="d-flex brtdp12" key={ind}>
                                    <div
                                      className="w_subcoldp12 dp12cen1 brdp12 center_dp12"
                                      style={{ width: "25%" }}
                                    >
                                      {el?.ShapeName}
                                    </div>
                                    <div
                                      className="w_subcoldp12 dp12cen2 brdp12 center_dp12"
                                      style={{ width: "10%" }}
                                    >
                              
                                      {el?.Pcs}
                                    </div>
                                    <div className="w_subcoldp12 dp12cen2 brdp12 center_dp12">
                                      {el?.Wt?.toFixed(3)}
                              
                                    </div>
                                    <div className="w_subcoldp12 dp12cen2 brdp12 center_dp12">
                                      
                                    </div>
                                    <div
                                      className="w_subcoldp12 dp12cen2 center_dp12"
                                      style={{ width: "25%" }}
                                    >
              
                                    </div>
                                  </div>
                                </React.Fragment>
                              )
                            );
                          })}
                        {e?.diamonds?.length > 0 &&
                          e?.diamonds?.map((el, ind) => {
                            return (
                              <div className="d-flex brtdp12" key={ind}>
                                <div
                                  className="w_subcoldp12 dp12cen1 brdp12 center_dp12"
                                  style={{ width: "25%" }}
                                >
                                  {" "}
                                  {el?.MaterialTypeName === ""
                                    ? el?.ShapeName
                                    : el?.MaterialTypeName}{" "}
                                </div>
                                <div
                                  className="w_subcoldp12 dp12cen2 brdp12 center_dp12"
                                  style={{ width: "10%" }}
                                >
                                  {" "}
                                   {el?.Pcs}{" "}
                                </div>
                                <div className="w_subcoldp12 dp12cen2 brdp12 center_dp12">
                                  {el?.Wt?.toFixed(3)}
    
                                </div>
                                <div className="w_subcoldp12 dp12cen2 brdp12 center_dp12">
                                  {priceFlag && formatAmount(el?.Rate)}
                
                                </div>
                                <div
                                  className="w_subcoldp12 dp12cen2 center_dp12"
                                  style={{ width: "25%" }}
                                >
                      
                                  {priceFlag &&
                                    formatAmount(
                                      el?.Amount /
                                        result?.header?.CurrencyExchRate
                                    )}
                                </div>
                              </div>
                            );
                          })}
                        {e?.colorstone?.length > 0 &&
                          e?.colorstone?.map((el, ind) => {
                            return (
                              <div className="d-flex brtdp12" key={ind}>
                                <div
                                  className="w_subcoldp12 dp12cen1 brdp12 center_dp12"
                                  style={{ width: "25%" }}
                                >
                                  {el?.MaterialTypeName === ""
                                    ? el?.ShapeName
                                    : el?.MaterialTypeName}
                                </div>
                                <div
                                  className="w_subcoldp12 dp12cen2 brdp12 center_dp12"
                                  style={{ width: "10%" }}
                                >
                          
                                  {el?.Pcs}
                                </div>
                                <div className="w_subcoldp12 dp12cen2 brdp12 center_dp12">
                                  {el?.Wt?.toFixed(3)}

                                </div>
                                <div className="w_subcoldp12 dp12cen2 brdp12 center_dp12">
                                  {priceFlag && formatAmount(el?.Rate)}
                      
                                </div>
                                <div
                                  className="w_subcoldp12 dp12cen2 center_dp12"
                                  style={{ width: "25%" }}
                                >
       
                                  {priceFlag &&
                                    formatAmount(
                                      el?.Amount /
                                        result?.header?.CurrencyExchRate
                                    )}
                                </div>
                              </div>
                            );
                          })}
                        {e?.misc?.length > 0 &&
                          e?.misc?.map((el, ind) => {
                            return (
                              <div className="d-flex brtdp12" key={ind}>
                                <div
                                  className="w_subcoldp12 dp12cen1 brdp12 center_dp12"
                                  style={{
                                    wordBreak: "break-word",
                                    width: "25%",
                                  }}
                                >
                                  {el?.MaterialTypeName === '' ? el?.ShapeName : el?.MaterialTypeName}
                                </div>
                                <div
                                  className="w_subcoldp12 dp12cen2 brdp12"
                                  style={{ width: "10%" }}
                                >
                         
                                  {el?.Pcs}
                                </div>
                                <div className="w_subcoldp12 dp12cen2 center_dp12 brdp12">
                                  {el?.IsHSCOE === 0
                                    ? el?.Wt?.toFixed(3)
                                    : el?.ServWt?.toFixed(3)}{" "}
                         
                                </div>
                                <div className="w_subcoldp12 dp12cen2 center_dp12 brdp12">
                                  {priceFlag && formatAmount(el?.Rate)}
                            
                                </div>
                                <div
                                  className="w_subcoldp12 dp12cen2 center_dp12"
                                  style={{ width: "25%" }}
                                >
                           
                                  {priceFlag &&
                                    formatAmount(
                                      el?.Amount /
                                        result?.header?.CurrencyExchRate
                                    )}
                                </div>
                              </div>
                            );
                          })}
                          {
                            e?.OtherCharges === 0 ? '' : 
                            <div className="d-flex brtdp12">
                                <div
                                  className="w_subcoldp12 dp12cen1 brdp12 center_dp12"
                                  style={{
                                    wordBreak: "break-word",
                                    width: "25%",
                                  }}
                                >
                                  {/* {el?.MaterialTypeName === '' ? el?.ShapeName : el?.MaterialTypeName} */}
                                  OTHER CHARGES
                                </div>
                                <div
                                  className="w_subcoldp12 dp12cen2 brdp12"
                                  style={{ width: "10%" }}
                                >
                         
                                  {/* {el?.Pcs} */}
                                </div>
                                <div className="w_subcoldp12 dp12cen2 center_dp12 brdp12">
                                  {/* {el?.IsHSCOE === 0
                                    ? el?.Wt?.toFixed(3)
                                    : el?.ServWt?.toFixed(3)}{" "} */}
                         
                                </div>
                                <div className="w_subcoldp12 dp12cen2 center_dp12 brdp12">
                                  {/* {priceFlag && formatAmount(el?.Rate)} */}
                            
                                </div>
                                <div
                                  className="w_subcoldp12 dp12cen2 center_dp12"
                                  style={{ width: "25%" }}
                                >
                           
                                  {priceFlag &&
                                    formatAmount(
                                      e?.OtherCharges /
                                        result?.header?.CurrencyExchRate
                                    )}
                                </div>
                          </div>
                          }
                        {e?.counts === 0 && (
                          <div className="d-flex brtdp12">
                            <div
                              className="w_subcoldp12 dp12cen1 brdp12"
                              style={{ wordBreak: "break-word", width: "25%" }}
                            >
                              {" "}
                            </div>
                            <div
                              className="w_subcoldp12 dp12cen2 brdp12"
                              style={{ width: "10%" }}
                            >
                              {" "}
                            </div>
                            <div className="w_subcoldp12 dp12cen2 brdp12">
                              {" "}
                            </div>
                            <div className="w_subcoldp12 dp12cen2 brdp12">
                              {" "}
                            </div>
                            <div
                              className="w_subcoldp12 dp12cen2"
                              style={{ width: "25%" }}
                            >
                              {" "}
                            </div>
                          </div>
                        )}
                      </div>
                      {e?.totals?.diamonds?.Wt +
                        e?.totals?.colorstone?.Wt +
                        e?.totals?.misc?.Wt + e?.OtherCharges +
                        e?.totals?.metal?.WithOutPrimaryMetal ===
                        0 &&
                      e?.totals?.diamonds?.Amount +
                        e?.totals?.colorstone?.Amount + e?.OtherCharges +
                        e?.totals?.misc?.Amount ===
                        0 ? (
                        ""
                      ) : (
                        <div className="d-flex brtdp12  fw-bold">
                          <div
                            className="w_subcoldp12 dp12cen1 brdp12"
                            style={{ wordBreak: "break-word", width: "25%" }}
                          >
                            {" "}
                          </div>
                          <div
                            className="w_subcoldp12 dp12cen2 brdp12 pe-1"
                            style={{ width: "10%" }}
                          ></div>
                          <div className="w_subcoldp12 dp12cen2 brdp12 center_dp12 pe-1">
                            {(
                              e?.totals?.diamonds?.Wt +
                              e?.totals?.colorstone?.Wt +
                              e?.totals?.misc?.Wt +
                              e?.totals?.metal?.WithOutPrimaryMetal
                            )?.toFixed(3)}
                          </div>
                          <div className="w_subcoldp12 dp12cen2 brdp12"></div>
                          <div className="w_subcoldp12 dp12cen2 center_dp12 pe-1" style={{ width: "25%" }} >
                            {priceFlag &&
                              formatAmount(
                                (e?.totals?.diamonds?.Amount / result?.header?.CurrencyExchRate) +
                                  (e?.totals?.colorstone?.Amount / result?.header?.CurrencyExchRate) +
                                  (e?.totals?.misc?.Amount / result?.header?.CurrencyExchRate) + (e?.OtherCharges / result?.header?.CurrencyExchRate)
                              )}
                          </div>
                        </div>
                      )}
                    </div>
       
                    <div className="rcol13dp12 dp12cen2 border-end-0 center_dp12">
                      {
                        formatAmount(
                          (e?.TotalAmount / result?.header?.CurrencyExchRate)
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

       

          <div className="d-flex fw-bold totaldp12 w-100 brtdp12 border-top-0 border_start_dp12 border_end_dp12 fsgdp12">
            <div style={{width:'15%'}} className="brdp12">&nbsp;</div>
            <div style={{width:'17.9%'}} className="brdp12">&nbsp;</div>
            <div style={{width:'8.85%'}} className="brdp12">&nbsp;</div>
            <div style={{width:'9.25%'}} className=" d-flex justify-content-center align-items-center pe-1 center_dp12 fsgdp12 brdp12">
            {priceFlag &&
                formatAmount(
                  result?.mainTotal?.total_Making_Amount /
                    result?.header?.CurrencyExchRate +
                    result?.mainTotal?.metal?.Amount /
                      result?.header?.CurrencyExchRate
                )}{" "}
            </div>
            <div style={{width:'9.5%'}} className="brdp12">&nbsp;</div>
            <div style={{width:'3.75%'}} className="brdp12">&nbsp;</div>
            <div style={{width:'7.55%'}} className=" d-flex justify-content-center align-items-center pe-1 fsgdp12 center_dp12 brdp12"> 
                {(
                  result?.mainTotal?.diamonds?.Wt +
                  result?.mainTotal?.colorstone?.Wt +
                  result?.mainTotal?.misc?.Wt +
                  result?.mainTotal?.metal?.withOutPrimaryMetal
                )?.toFixed(3)}
            </div>
            <div style={{width:'7.65%'}} className=" d-flex justify-content-end align-items-center pe-1 fsgdp12 brdp12">&nbsp;</div>
            <div style={{width:'9.55%'}} className=" d-flex justify-content-center align-items-center pe-1 fsgdp12 brdp12 center_dp12">
            {result?.mainTotal?.total_diamond_colorstone_misc_amount !== 0 &&
                priceFlag &&
                formatAmount(
                  (result?.mainTotal?.total_diamond_colorstone_misc_amount + result?.mainTotal?.total_other) /
                    result?.header?.CurrencyExchRate
                )}
            </div>
            <div style={{width:'11%'}} className=" d-flex justify-content-center align-items-center pe-1 fsgdp12 brdp12">{formatAmount((result?.mainTotal?.total_amount/ result?.header?.CurrencyExchRate))}</div>
          </div>

          { (
            <div className="w-100 brtdp12 dp12cen2 bradp12 fsgdp12 brdp12 ">
              {result?.mainTotal?.total_amount !== 0 &&
                formatAmount(
                  result?.mainTotal?.total_amount /
                    result?.header?.CurrencyExchRate
                )}
            </div>
          )}


          {priceFlag && (
            <div className="w-100 d-flex border border-top-0 fsgdp12">
              <div style={{ width: "69.9%" }}></div>
              <div style={{ width: "30.1%" }} className="d-flex">
                <div
                  style={{ width: "63%" }}
                  className="border_end_dp12 border_start_dp12 px-1  dp12cen2  "
                >
                  {" "}
                  {result?.header?.ModeOfDel} :{" "}
                </div>
                <div style={{ width: "37%" }} className="px-1  dp12cen2  ">
                  {" "}
                  {formatAmount(
                    result?.header?.FreightCharges /
                      result?.header?.CurrencyExchRate
                  )}{" "}
                </div>
              </div>
            </div>
          )}


          {priceFlag &&
            result?.allTaxes?.map((e, i) => {
              return (
                <div
                  className="w-100 bradp12 border-bottom-0 border-top-0 taxdp12 fsgdp12"
                  key={i}
                >
                  <div className="taxdp12d1">{e?.amountInWords}</div>
                  <div className="taxdp12d2 dp12cen2">
                    {" "}
                    {e?.name} @ {e?.per}{" "}
                  </div>
                  <div className="taxdp12d3 dp12cen2">
                    {" "}
                    {formatAmount(e?.amount)}{" "}
                  </div>
                </div>
              );
            })}
          {priceFlag && (
            <div className="w-100 bradp12 border-top-0 taxdp12 fsgdp12 ">
              <div className="taxdp12d4"></div>
              <div className="taxdp12d2 dp12cen2 bldp12 border_start_dp12">
                {" "}
                Sales Rounded Off{" "}
              </div>
              <div className="taxdp12d3 dp12cen2">
                {" "}
                {formatAmount(
                  result?.header?.AddLess / result?.header?.CurrencyExchRate
                )}{" "}
              </div>
            </div>
          )}


          {priceFlag && (
            <div className="w-100 bradp12 border-top-0 taxdp12 finalAmt_h_dp12 fsgdp12">
              <div
                className="taxdp12d1 fw-bold ps-1 h-100 dp12cen1"
                style={{ width: "70.5%" }}
              >
                Total
              </div>
              <div
                className="taxdp12d2 dp12cen2 bldp12 h-100 border-0 "
                style={{ width: "19%" }}
              ></div>
              <div
                className="taxdp12d3 dp12cen2 fw-bold pe-2 h-100 border-end-0 bldp12"
                style={{ width: "11.2%" }}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: result?.header?.Currencysymbol,
                  }}
                ></div>
                <div className="ps-1">
                  {result?.finalAmount + result?.header?.FreightCharges !== 0 &&
                    formatAmount(
                      result?.mainTotal?.total_amount /
                        result?.header?.CurrencyExchRate +
                        result?.allTaxesTotal +
                        result?.header?.FreightCharges /
                          result?.header?.CurrencyExchRate +
                        result?.header?.AddLess /
                          result?.header?.CurrencyExchRate
                    )}
                </div>
              </div>
            </div>
          )}
          {priceFlag && (
            <div className="w-100 d-flex brbdp12 brdp12 bldp12 fsgdp12">
              <div
                className="brdp12 fw-bold ps-1"
                style={{ width: "3%" }}
                dangerouslySetInnerHTML={{
                  __html: result?.header?.Currencysymbol,
                }}
              ></div>
              <div className="ps-2 fw-bold" style={{ width: "97%" }}>
                {result?.finalAmount !== 0 &&
                  NumToWord(
                    result?.mainTotal?.total_amount /
                      result?.header?.CurrencyExchRate +
                      (result?.header?.FreightCharges /
                        result?.header?.CurrencyExchRate +
                        result?.allTaxesTotal +
                        result?.header?.AddLess /
                          result?.header?.CurrencyExchRate)
                  )}
              </div>
            </div>
          )}

      
        
          <div
            className={` bradp12  ps-1 fsgdp12 ${
              priceFlag
                ? "border-top-0 border_bottom_dp12"
                : "border-top border_bottom_dp12"
            }`}
          >
            <b>REMARKS</b> : <span className="text-break" dangerouslySetInnerHTML={{ __html: result?.header?.PrintRemark }}></span>
          </div>
           {/* summary */}
            
{ summaryFlag && <div className="summary_container_dp12  fsgdp12">
<div className="summary_container_dp7_product_table hcompdp7">
  <div className="summary_container_dp7_product_title">
    PRODUCT SUMMARY
  </div>
  <div className="summary_container_dp7_product_head">
    <div className="sum_prod_head_col_1 d-flex justify-content-center align-items-center">CATEGORY</div>
    <div className="sum_prod_head_col_2 d-flex justify-content-center align-items-center">PIECES</div>
    <div className="sum_prod_head_col_3 d-flex justify-content-center align-items-center">GROSS WT</div>
    <div className="sum_prod_head_col_4 d-flex justify-content-center align-items-center">NET WT</div>
    <div className="sum_prod_head_col_5 d-flex justify-content-center align-items-center">WASTAGE</div>
    <div className="sum_prod_head_col_6 d-flex justify-content-center align-items-center">FINE</div>
  </div>
  {categoryWise?.length > 0 &&
    categoryWise?.map((e, i) => {
      return (
        <div
          className="summary_container_dp7_product_body fsgdp12 hcompdp7"
          key={i}
        >
          <div className="sum_prod_head_col_1 d-flex justify-content-start align-items-center ps-1">
            {e?.Categoryname}
          </div>
          <div className="sum_prod_head_col_2 d-flex justify-content-end align-items-center pe-1">
            {e?.cat_count}
          </div>
          <div className="sum_prod_head_col_3 d-flex justify-content-end align-items-center pe-1">
            {e?.cg_grosswt?.toFixed(3)}
          </div>
          <div className="sum_prod_head_col_4 d-flex justify-content-end align-items-center pe-1">
            {e?.cg_netwt?.toFixed(3)}
          </div>
          <div className="sum_prod_head_col_5 d-flex justify-content-end align-items-center pe-1">
            {e?.Wastage?.toFixed(3)}
          </div>
          <div className="sum_prod_head_col_6 d-flex justify-content-end align-items-center pe-1">
            {/* {e?.fineWtBYNetWtCal?.toFixed(3)} */}
            {/* {((e?.NetWt * e?.Tunch)/100)?.toFixed(3)} */}
            {/* {((e?.cg_netwt * e?.Tunch)/100)?.toFixed(3)} */}
            {e?.cg_finewt?.toFixed(3)}
            {/* {e?.LossWt === 0 ? e?.PureNetWt : ((
            (((e?.NetWt - e?.totals?.finding?.Wt) * (e?.Tunch))/100)
             + (e?.totals?.finding?.FineWt))?.toFixed(3))} */}
          </div>
        </div>
      );
    })}
  <div className="summary_container_dp7_product_total fw-bold fsgdp12">
    <div className="sum_prod_head_col_1 d-flex justify-content-start align-items-center ps-1">Total</div>
    <div className="sum_prod_head_col_2 d-flex justify-content-end align-items-center pe-1">
      {/* {result?.mainTotal?.total_Quantity !== 0 &&
        result?.mainTotal?.total_Quantity} */}
        {catcount}
    </div>
    <div className="sum_prod_head_col_3 d-flex justify-content-end align-items-center pe-1">
      {result?.mainTotal?.grosswt !== 0 &&
        result?.mainTotal?.grosswt?.toFixed(3)}
    </div>
    <div className="sum_prod_head_col_4 d-flex justify-content-end align-items-center pe-1">
      {/* {result?.mainTotal?.netwtWithLossWt !== 0 && result?.mainTotal?.netwtWithLossWt?.toFixed(3)} */}
      {result?.mainTotal?.metal?.IsPrimaryMetal?.toFixed(3)}
    </div>
    <div className="sum_prod_head_col_5 d-flex justify-content-end align-items-center pe-1"></div>
    <div className="sum_prod_head_col_6 d-flex justify-content-end align-items-center pe-1">
      {/* {result?.mainTotal?.total_fineWtByMetalWtCalculation !== 0 && result?.mainTotal?.total_fineWtByMetalWtCalculation?.toFixed(3)} */}
      {fineWtTotal === 0 ? 0 : fineWtTotal?.toFixed(3)}
    </div>
  </div>
</div>
<div style={{ height: "16px" }}></div>
<div className="summary_container_dp7_misc_table  fsgdp7">
  <div className="summary_container_dp7_misc_title">
    STUDDED SUMMARY
  </div>

  <div className="summary_container_dp7_misc_head w-100 fw-bold fsgdp12">
    <div className="summary_container_dp7_misc_head_col_1 d-flex justify-content-center align-items-center">
      TYPE
    </div>
    <div className="summary_container_dp7_misc_head_col_2 d-flex justify-content-center align-items-center">
      PIECES
    </div>
    <div className="summary_container_dp7_misc_head_col_3 d-flex justify-content-center align-items-center">
      RATE
    </div>
    <div className="summary_container_dp7_misc_head_col_4 d-flex justify-content-center align-items-center">
      WT
    </div>
    <div className="summary_container_dp7_misc_head_col_5 d-flex justify-content-center align-items-center border-end-0">
      AMOUNT
    </div>
  </div>
  {miscWise?.length > 0 &&
    miscWise?.map((e, i) => {
      return (
        <div className="summary_container_dp7_misc_body  hcompdp7" key={i} >
          <div className="summary_container_dp7_misc_head_col_1 d-flex justify-content-start align-items-center fsgdp12 text-break ps-1">
            {e?.MaterialTypeName === '' ? e?.ShapeName : e?.MaterialTypeName}
          </div>
          <div className="summary_container_dp7_misc_head_col_2 d-flex justify-content-end align-items-center fsgdp12 pe-1">
            {e?.Pcs}
          </div>
          <div className="summary_container_dp7_misc_head_col_3 d-flex justify-content-end align-items-center fsgdp12 pe-1">
            {e?.Rate?.toFixed(2)}
          </div>
          <div className="summary_container_dp7_misc_head_col_4 d-flex justify-content-end align-items-center fsgdp12 pe-1">
            {/* {e?.MasterManagement_DiamondStoneTypeid === 2
              ? `${e?.Wt?.toFixed(3)} Ctw`
              : `${(e?.Wt_ServWt)?.toFixed(3)} gm`} */}
              {
                (e?.MasterManagement_DiamondStoneTypeid === 1 || e?.MasterManagement_DiamondStoneTypeid === 2) ? `${e?.Wt?.toFixed(3)} Ctw` :
                `${(e?.ServWt + e?.Wt)?.toFixed(3)} gm`
              }
          </div>
          <div className="summary_container_dp7_misc_head_col_5 d-flex justify-content-end align-items-center border-end-0 fsgdp12 pe-1">
            {formatAmount(e?.Amount)}
          </div>
        </div>
      );
    })}

  <div className="summary_container_dp7_misc_total fw-bold">
    <div className="summary_container_dp7_misc_head_col_1 d-flex justify-content-start align-items-center ps-1 fsgdp12">
      Total
    </div>
    <div className="summary_container_dp7_misc_head_col_2 d-flex justify-content-end align-items-center pe-1 fsgdp12">
      {miscWise_total?.Pcs}
    </div>
    <div className="summary_container_dp7_misc_head_col_3 dp7cen1"></div>
    <div className="summary_container_dp7_misc_head_col_4 d-flex justify-content-end align-items-center pe-1 d-flex flex-column fsgdp12">
      {miscWise_total?.wtWeight_Ctw === 0 ? ( "" ) : (
        <div className="w-100 d-flex justify-content-end align-items-center pe-1 fsgdp12">
          {miscWise_total?.wtWeight_Ctw?.toFixed(3)} Ctw
        </div>
      )}
      {miscWise_total?.wtWeight_gm === 0 ? ( "" ) : (
        <div className="w-100 d-flex justify-content-end align-items-center pe-1 fsgdp12"> {" "} {(miscWise_total?.wtWeight_gm + miscWise_total?.Wt_ServWt)?.toFixed(3)} Gm </div>
      )}
    </div>
    <div className="summary_container_dp7_misc_head_col_5 d-flex justify-content-end align-items-center pe-1 border-end-0 fsgdp12"> {formatAmount( miscWise_total?.Amount  / result?.header?.CurrencyExchRate )}
    </div>
  </div>
</div>
</div>}


        </div>
      ) : (
        <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
          {" "}
          {msg}{" "}
        </p>
      )}
    </>
  );
};

export default DetailPrint12;

// <div className="summary_container_dp12  fsgdp12">
// <div className="summary_container_dp7_product_table hcompdp7">
//   <div className="summary_container_dp7_product_title">
//     PRODUCT SUMMARY
//   </div>
//   <div className="summary_container_dp7_product_head">
//     <div className="sum_prod_head_col_1 d-flex justify-content-center align-items-center">CATEGORY</div>
//     <div className="sum_prod_head_col_2 d-flex justify-content-center align-items-center">PIECES</div>
//     <div className="sum_prod_head_col_3 d-flex justify-content-center align-items-center">GROSS WT</div>
//     <div className="sum_prod_head_col_4 d-flex justify-content-center align-items-center">NET WT</div>
//     <div className="sum_prod_head_col_5 d-flex justify-content-center align-items-center">WASTAGE</div>
//     <div className="sum_prod_head_col_6 d-flex justify-content-center align-items-center">FINE</div>
//   </div>
//   {categoryWise?.length > 0 &&
//     categoryWise?.map((e, i) => {
//       return (
//         <div
//           className="summary_container_dp7_product_body fsgdp12 hcompdp7"
//           key={i}
//         >
//           <div className="sum_prod_head_col_1 d-flex justify-content-start align-items-center ps-1">
//             {e?.Categoryname}
//           </div>
//           <div className="sum_prod_head_col_2 d-flex justify-content-end align-items-center pe-1">
//             {e?.cat_count}
//           </div>
//           <div className="sum_prod_head_col_3 d-flex justify-content-end align-items-center pe-1">
//             {e?.cg_grosswt?.toFixed(3)}
//           </div>
//           <div className="sum_prod_head_col_4 d-flex justify-content-end align-items-center pe-1">
//             {e?.cg_netwt?.toFixed(3)}
//           </div>
//           <div className="sum_prod_head_col_5 d-flex justify-content-end align-items-center pe-1">
//             {e?.Wastage?.toFixed(3)}
//           </div>
//           <div className="sum_prod_head_col_6 d-flex justify-content-end align-items-center pe-1">
//             {/* {e?.fineWtBYNetWtCal?.toFixed(3)} */}
//             {/* {((e?.NetWt * e?.Tunch)/100)?.toFixed(3)} */}
//             {/* {((e?.cg_netwt * e?.Tunch)/100)?.toFixed(3)} */}
//             {e?.cg_finewt?.toFixed(3)}
//             {/* {e?.LossWt === 0 ? e?.PureNetWt : ((
//             (((e?.NetWt - e?.totals?.finding?.Wt) * (e?.Tunch))/100)
//              + (e?.totals?.finding?.FineWt))?.toFixed(3))} */}
//           </div>
//         </div>
//       );
//     })}
//   <div className="summary_container_dp7_product_total fw-bold fsgdp12">
//     <div className="sum_prod_head_col_1 d-flex justify-content-start align-items-center ps-1">Total</div>
//     <div className="sum_prod_head_col_2 d-flex justify-content-end align-items-center pe-1">
//       {/* {result?.mainTotal?.total_Quantity !== 0 &&
//         result?.mainTotal?.total_Quantity} */}
//         {catcount}
//     </div>
//     <div className="sum_prod_head_col_3 d-flex justify-content-end align-items-center pe-1">
//       {result?.mainTotal?.grosswt !== 0 &&
//         result?.mainTotal?.grosswt?.toFixed(3)}
//     </div>
//     <div className="sum_prod_head_col_4 d-flex justify-content-end align-items-center pe-1">
//       {/* {result?.mainTotal?.netwtWithLossWt !== 0 && result?.mainTotal?.netwtWithLossWt?.toFixed(3)} */}
//       {result?.mainTotal?.metal?.IsPrimaryMetal?.toFixed(3)}
//     </div>
//     <div className="sum_prod_head_col_5 d-flex justify-content-end align-items-center pe-1"></div>
//     <div className="sum_prod_head_col_6 d-flex justify-content-end align-items-center pe-1">
//       {/* {result?.mainTotal?.total_fineWtByMetalWtCalculation !== 0 && result?.mainTotal?.total_fineWtByMetalWtCalculation?.toFixed(3)} */}
//       {fineWtTotal === 0 ? 0 : fineWtTotal?.toFixed(3)}
//     </div>
//   </div>
// </div>
// <div style={{ height: "16px" }}></div>
// <div className="summary_container_dp7_misc_table  fsgdp7">
//   <div className="summary_container_dp7_misc_title">
//     MATERIAL SUMMARY
//   </div>

//   <div className="summary_container_dp7_misc_head w-100 fw-bold fsgdp12">
//     <div className="summary_container_dp7_misc_head_col_1 d-flex justify-content-center align-items-center">
//       TYPE
//     </div>
//     <div className="summary_container_dp7_misc_head_col_2 d-flex justify-content-center align-items-center">
//       PIECES
//     </div>
//     <div className="summary_container_dp7_misc_head_col_3 d-flex justify-content-center align-items-center">
//       RATE
//     </div>
//     <div className="summary_container_dp7_misc_head_col_4 d-flex justify-content-center align-items-center">
//       WT
//     </div>
//     <div className="summary_container_dp7_misc_head_col_5 d-flex justify-content-center align-items-center border-end-0">
//       AMOUNT
//     </div>
//   </div>
//   {miscWise?.length > 0 &&
//     miscWise?.map((e, i) => {
//       return (
//         <div className="summary_container_dp7_misc_body  hcompdp7" key={i} >
//           <div className="summary_container_dp7_misc_head_col_1 d-flex justify-content-start align-items-center fsgdp12 text-break ps-1">
//             {e?.ShapeName}
//           </div>
//           <div className="summary_container_dp7_misc_head_col_2 d-flex justify-content-end align-items-center fsgdp12 pe-1">
//             {e?.Pcs}
//           </div>
//           <div className="summary_container_dp7_misc_head_col_3 d-flex justify-content-end align-items-center fsgdp12 pe-1">
//             {e?.Rate?.toFixed(2)}
//           </div>
//           <div className="summary_container_dp7_misc_head_col_4 d-flex justify-content-end align-items-center fsgdp12 pe-1">
//             {/* {e?.MasterManagement_DiamondStoneTypeid === 2
//               ? `${e?.Wt?.toFixed(3)} Ctw`
//               : `${(e?.Wt_ServWt)?.toFixed(3)} gm`} */}
//               {
//                 (e?.MasterManagement_DiamondStoneTypeid === 1 || e?.MasterManagement_DiamondStoneTypeid === 2) ? `${e?.Wt?.toFixed(3)} Ctw` :
//                 `${(e?.ServWt + e?.Wt)?.toFixed(3)} gm`
//               }
//           </div>
//           <div className="summary_container_dp7_misc_head_col_5 d-flex justify-content-end align-items-center border-end-0 fsgdp12 pe-1">
//             {formatAmount(e?.Amount)}
//           </div>
//         </div>
//       );
//     })}

//   <div className="summary_container_dp7_misc_total fw-bold">
//     <div className="summary_container_dp7_misc_head_col_1 d-flex justify-content-start align-items-center ps-1 fsgdp12">
//       Total
//     </div>
//     <div className="summary_container_dp7_misc_head_col_2 d-flex justify-content-end align-items-center pe-1 fsgdp12">
//       {miscWise_total?.Pcs}
//     </div>
//     <div className="summary_container_dp7_misc_head_col_3 dp7cen1"></div>
//     <div className="summary_container_dp7_misc_head_col_4 d-flex justify-content-end align-items-center pe-1 d-flex flex-column fsgdp12">
//       {miscWise_total?.wtWeight_Ctw === 0 ? ( "" ) : (
//         <div className="w-100 d-flex justify-content-end align-items-center pe-1 fsgdp12">
//           {miscWise_total?.wtWeight_Ctw?.toFixed(3)} Ctw
//         </div>
//       )}
//       {miscWise_total?.wtWeight_gm === 0 ? ( "" ) : (
//         <div className="w-100 d-flex justify-content-end align-items-center pe-1 fsgdp12"> {" "} {(miscWise_total?.wtWeight_gm + miscWise_total?.Wt_ServWt)?.toFixed(3)} Gm </div>
//       )}
//     </div>
//     <div className="summary_container_dp7_misc_head_col_5 d-flex justify-content-end align-items-center pe-1 border-end-0 fsgdp12"> {formatAmount( miscWise_total?.Amount  / result?.header?.CurrencyExchRate )}
//     </div>
//   </div>
// </div>
// </div>