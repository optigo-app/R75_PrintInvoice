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

const DetailPrint12Quote = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {
  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const [imgFlag, setImgFlag] = useState(true);
  const [priceFlag, setPriceFlag] = useState(true);
  const [isImageWorking, setIsImageWorking] = useState(true);


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
    // datas?.resultArray?.forEach((e) => {
    //   let arr = [];
    //   arr = e?.misc?.filter((a) => a?.Amount !== 0);
    //   e.misc = arr;
    // })

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
        e?.misc?.length;
      e.counts = counts;
    });

    setResult(datas);
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
  const handleImageErrors = () => {
    setIsImageWorking(false);
  };


  return (
    <>
      {loader ? (
        <Loader />
      ) : msg === "" ? (
        <div className="containerdp12 pb-5 mb-5">
          {/* image show flag */}
          <div className="d-flex justify-content-end align-items-center my-5 fsgdp12 hidebtn">
            <input type="checkbox" checked={priceFlag} id="showPrice" onChange={handlePriceShow} className="mx-2" />
            <label htmlFor="showPrice" className="me-2 user-select-none"> {" "} With Price{" "} </label>
            <input type="checkbox" checked={imgFlag} id="showImg" onChange={handleImgShow} className="mx-2" />
            <label htmlFor="showImg" className="me-2 user-select-none"> {" "} With Image{" "} </label>
            <button className="btn_white blue m-0 " onClick={(e) => handlePrint(e)} > {" "} Print{" "} </button>
          </div>
          {/* table header */}
          <div>
            {result?.header?.PrintHeadLabel ? ( "PRODUCT DETAIL SHEET" ) : ( <div className="pheaddp12 w-100"> PRODUCT DETAIL SHEET {result?.header?.PrintHeadLabel}{" "} </div> )}
            {/* <div className="d-flex justify-content-between align-items-center p-1 ">
          <div className="w-75 fsgdp12">
            <div className="fw-bold fsgdp12_ lhdp12"> {result?.header?.CompanyFullName} </div>
            <div className="fsgdp12 lhdp12">
              {result?.header?.CompanyAddress} <br />
              {result?.header?.CompanyAddress2}
            </div>
            <div className="fsgdp12 lhdp12">
              {result?.header?.CompanyCity}-
              {result?.header?.CompanyPinCode},
              {result?.header?.CompanyState}(
              {result?.header?.CompanyCountry})
            </div>
            <div className="fsgdp12 lhdp12">
              T {result?.header?.CompanyTellNo} | TOLL FREE{" "}
              {result?.header?.CompanyTollFreeNo} | TOLL FREE{" "}
              {result?.header?.CompanyTollFreeNo}
            </div>
            <div className="fsgdp12 lhdp12">
              {result?.header?.CompanyEmail} |{" "}
              {result?.header?.CompanyWebsite}
            </div>
            <div className="fsgdp12 lhdp12">
              {result?.header?.Company_VAT_GST_No} |{" "}
              {result?.header?.Company_CST_STATE} -{" "}
              {result?.header?.Company_CST_STATE_No} | PAN- {result?.header?.Pannumber}{" "}
            </div>
          </div>
          <div className="d-flex justify-content-end w-25 fsgdp12 pe-2">
          
            {isImageWorking && result?.header?.PrintLogo !== "" && (
              <img src={result?.header?.PrintLogo} alt="" className="w-100 h-auto ms-auto d-block object-fit-contain headimgdp12" style={{ minHeight: "75px", maxHeight: "75px", minWidth: "115px", maxWidth: "117px", }} onError={handleImageErrors} height={120} width={150} />
            )}
          </div>
        </div> */}
          </div>

          {/* sub header */}
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
              <div className="w-100 text-center"> To,</div>
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
                
            </div>
          </div>


       
          <div className="tabledp12 fsgdp12">
            <div className="theaddp12 hcompdp12 bordersdp12">
              <div className="col1dp12 dp12cen">SR#</div>
              <div className="col2dp12 dp12cen text-break ps-1">DESIGN DESCRIPTION</div>
              <div style={{ width: "36%" }} className="brdp12 d-flex">
                <div className="       w-25 h-100">&nbsp;</div>
                <div className="brdp12 w-25 h-100">&nbsp;</div>
                <div className="brdp12 w-25 h-100 text-break text-center">
                  METAL / MAKING RATE
                </div>
                <div className="       w-25 h-100 text-break text-center">
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
                  <div className="d-flex brbdp12 hcompdp12 bordersdp12 " key={i}>
                    <div className="rcol1dp12 dp12cen1 border_top_dp12">{i + 1}</div>
                    <div className="rcol2dp12 d-flex flex-column  justify-content-center  align-items-start p-1 border_top_dp12">
                      <div className="d-flex justify-content-between align-items-start w-100">
                        <div>{e?.designno}</div>
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
                      className="rcol4dp12 d-flex flex-column justify-content-between border_top_dp12"
                      style={{ width: "36%" }}
                    >
                      <div>
                        <div className="d-flex brbdp12 w-100">
                          <div className="w-50 brdp12 ps-1 d-flex">
                            <div className="w-50 brdp12 ps-1">KT/COL</div>
                            <div className="w-50 end_dp12 pe-1 text-break center_dp12">
                              {e?.MetalPurity} {e?.MetalColor}
                            </div>
                          </div>
                          <div className="w-50 ps-1 d-flex">
                            <div className="w-50 brdp12 ps-1"></div>
                            <div className="w-50 end_dp12 pe-1"></div>
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
                            <div className="w-50 brdp12 ps-1"></div>
                            <div className="w-50 center_dp12 pe-1"></div>
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
                            <div className="w-50 brdp12 pe-1 center_dp12">
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
                            <div className="w-50 center_dp12 pe-1">
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
                            <div className="w-50 brdp12 ps-1 text-break">MAKING RATE</div>
                            <div className="w-50 center_dp12 pe-1">
                              {" "}
                              {(e?.NetWt + e?.LossWt)?.toFixed(3)}{" "}
                            </div>
                          </div>
                          <div className="w-50 ps-1 d-flex">
                            <div className="w-50 brdp12 pe-1 center_dp12">
                              &nbsp;
                              {e?.MaKingCharge_Unit === 0
                                ? ""
                                : priceFlag &&
                                  formatAmount(e?.MaKingCharge_Unit)}
                            </div>
                            <div className="w-50 center_dp12 pe-1">
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
                        <div className="d-flex  brtdp12 w-100 fw-bold">
                          <div className="w-50 brdp12 ps-1">&nbsp;</div>
                          <div className="w-50 pe-1 d-flex end_dp12">
                            <div className="w-50 brdp12">&nbsp;</div>
                            <div className="w-50 center_dp12 pe-1">
                              {e?.MakingAmount === 0
                                ? ""
                                : priceFlag &&
                                  formatAmount(
                                    e?.MakingAmount + e?.MetalAmount
                                  )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div
                      style={{ width: "" }}
                      className=" col7dp12 d-flex flex-column justify-content-between"
                    >
                    
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
                                      className="w_subcoldp12 dp12cen2"
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
                                  {el?.MaterialTypeName}
                                </div>
                                <div
                                  className="w_subcoldp12 dp12cen2 brdp12 center_dp12"
                                  style={{ width: "10%" }}
                                >
                                  {el?.Pcs}
                                </div>
                                <div className="w_subcoldp12 dp12cen2 brdp12 center_dp12">
                                  {el?.IsHSCOE === 0
                                    ? el?.Wt?.toFixed(3)
                                    : el?.ServWt?.toFixed(3)}{" "}
                     
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
                        e?.totals?.misc?.Wt +
                        e?.totals?.metal?.WithOutPrimaryMetal ===
                        0 &&
                      e?.totals?.diamonds?.Amount +
                        e?.totals?.colorstone?.Amount +
                        e?.totals?.misc?.Amount ===
                        0 ? (
                        ""
                      ) : (
                        <div className="d-flex brtdp12  fw-bold">
                          <div
                            className="w_subcoldp12 dp12cen1 brdp12 center_dp12"
                            style={{ wordBreak: "break-word", width: "25%" }}
                          >
                            {" "}
                          </div>
                          <div
                            className="w_subcoldp12 dp12cen2 brdp12 pe-1 center_dp12"
                            style={{ width: "10%" }}
                          ></div>
                          <div className="w_subcoldp12 dp12cen2 brdp12 pe-1 center_dp12">
                            {(
                              e?.totals?.diamonds?.Wt +
                              e?.totals?.colorstone?.Wt +
                              e?.totals?.misc?.Wt +
                              e?.totals?.metal?.WithOutPrimaryMetal
                            )?.toFixed(3)}
                          </div>
                          <div className="w_subcoldp12 dp12cen2 brdp12"></div>
                          <div className="w_subcoldp12 dp12cen2 pe-1 center_dp12" style={{ width: "25%" }} >
                            {priceFlag &&
                              formatAmount(
                                e?.totals?.diamonds?.Amount +
                                  e?.totals?.colorstone?.Amount +
                                  e?.totals?.misc?.Amount
                              )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="rcol13dp12 dp12cen2 border-end-0 border_top_dp12 center_dp12">
                      {
                        formatAmount(
                          e?.TotalAmount / result?.header?.CurrencyExchRate
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        
        {/* table row all total */}
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
            <div style={{width:'11%'}} className=" d-flex justify-content-center align-items-center pe-1 fsgdp12 ">{formatAmount((result?.mainTotal?.total_amount/ result?.header?.CurrencyExchRate))}</div>
          </div>

          {/* table total */}
          { (
            <div className="w-100 brtdp12 dp12cen2 bradp12 fsgdp12 ">
              {result?.mainTotal?.total_amount !== 0 &&
                formatAmount(
                  result?.mainTotal?.total_amount /
                    result?.header?.CurrencyExchRate
                )}
            </div>
          )}

   
          {/* taxes */}
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
                  <div className="taxdp12d3 dp12cen2 border-end-0">
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
                Rounded Off{" "}
              </div>
              <div className="taxdp12d3 dp12cen2 border-end-0">
                {" "}
                {formatAmount(
                  result?.header?.AddLess / result?.header?.CurrencyExchRate
                )}{" "}
              </div>
            </div>
          )}

          {/* grand total */}
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
                      (
                        
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
            <b>REMARKS</b> : <span dangerouslySetInnerHTML={{ __html: result?.header?.PrintRemark }} className="text-break"></span> 
          </div>
       
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

export default DetailPrint12Quote;
