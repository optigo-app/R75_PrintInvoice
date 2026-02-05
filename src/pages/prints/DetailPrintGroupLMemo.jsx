
import React, { useEffect } from "react";
import "../../assets/css/prints/detailPrintGroupLMemo.css";
import { useState } from "react";
import {
  NumberWithCommas,
  apiCall,
  brokarageDetail,
  checkMsg,
  fixedValues,
  handleImageError,
  handlePrint,
  isObjectEmpty,
  otherAmountDetail,
  taxGenrator,
} from "../../GlobalFunctions";
import Loader from "../../components/Loader";
import { cloneDeep } from "lodash";
import { OrganizeInvoicePrintData } from '../../GlobalFunctions/OrganizeInvoicePrintData';

const DetailPrintGroupLMemo = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {
  const [image, setImage] = useState(false);
  const [loader, setLoader] = useState(true);
  const [json0Data, setJson0Data] = useState({});
  const [result, SetResult] = useState(null);
  const [msg, setMsg] = useState("");
  const [checkBox, setCheckBox] = useState({
    image: true,
    brokarage: true,
  });
  const [finalD, setFinalD] = useState({});
  const [isImageWorking, setIsImageWorking] = useState(true);

  const handleImageErrors = () => {
    setIsImageWorking(false);
  };

  const handleChange = (e) => {
    const { name, checked } = e?.target;
    setCheckBox({ ...checkBox, [name]: checked });
  };

  useEffect(() => {
    const sendData = async () => {
      try {
        const data = await apiCall(token, invoiceNo, printName, urls, evn, ApiVer);
        if (data?.Status === "200") {
          let isEmpty = isObjectEmpty(data?.Data);
          if (!isEmpty) {
            // loadData(data?.Data);
            let address = data?.Data?.BillPrint_Json[0]?.Printlable?.split("\r\n");
            data.Data.BillPrint_Json[0].address = address;
            let datas = OrganizeInvoicePrintData(
              data?.Data?.BillPrint_Json[0],
              data?.Data?.BillPrint_Json1,
              data?.Data?.BillPrint_Json2
              );
              setJson0Data(datas?.header);

            datas?.resultArray?.forEach((e) => {
              let dia = [];

              e?.diamonds?.forEach((e, i) => {
                let obj = cloneDeep(e);
                let findrec = dia?.findIndex((a) => a?.ShapeName === obj?.ShapeName && a?.QualityName === obj?.QualityName && a?.Colorname === obj?.Colorname && a?.SizeName === obj?.SizeName);
                if(findrec === -1){
                  dia.push(obj);
                }else{
                  dia[findrec].Wt += obj?.Wt;
                  dia[findrec].Pcs += obj?.Pcs;
                }
              })
              e.diamonds = dia;
              
              let clr = [];
              
              e?.colorstone?.forEach((e) => {
                let obj = cloneDeep(e);
                let findrec = clr?.findIndex((a) => a?.ShapeName === obj?.ShapeName && a?.QualityName === obj?.QualityName && a?.Colorname === obj?.Colorname && a?.SizeName === obj?.SizeName);
                if(findrec === -1){
                  clr.push(obj);
                }else{
                  clr[findrec].Wt += obj?.Wt;
                  clr[findrec].Pcs += obj?.Pcs;
                }
              })
              e.colorstone = clr;
            })

            // setJson1Data(datas);
            SetResult(datas);
            setFinalD(datas)
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

  console.log("finalD", finalD);
  
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
                  className="border-dark me-2"
                  type="checkbox"
                  checked={checkBox?.image}
                  onChange={(e) => handleChange(e)}
                  name="image"
                  id="imgShow"
                />
                <label className="pt-1 user-select-none" htmlFor="imgShow">With Image</label>
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
            <div className="jewelleryPackingList mb-2 mt-2 recordDetailPrint1">
              <p className={`p-2 pb-1 pt-1 fw-bold text-white head_dlpmemo`} >
                {json0Data?.PrintHeadLabel === '' ? 'JEWELLERY MEMO' : json0Data?.PrintHeadLabel}
              </p>
            </div>
            {/* header */}
            <div className="d-flex align-items-center pb-2 pl-2 pr-2 spBrdrBtom spMainHed recordDetailPrint1">
              <div className="col-6">
                <h2 className="fw-bold detailPrint1L_font_16 pb-1">{json0Data?.CompanyFullName}</h2>
                <p className="lhDetailPrint1 pb-1">{json0Data?.CompanyAddress}</p>
                <p className="lhDetailPrint1 pb-1">{json0Data?.CompanyAddress2}</p>
                <p className="lhDetailPrint1 pb-1">
                  {json0Data?.CompanyCity}-{json0Data?.CompanyPinCode},{" "}
                  {json0Data?.CompanyState}({json0Data?.CompanyCountry})
                </p>
                <p className="lhDetailPrint1 pb-1">T {json0Data?.CompanyTellNo}</p>
                <p className="lhDetailPrint1 pb-1" pb-1>
                  {json0Data?.CompanyEmail} | {json0Data?.CompanyWebsite}
                </p>
                <p className="lhDetailPrint1 pb-1">
                  {json0Data?.Company_VAT_GST_No} |{" "}
                  { json0Data?.Company_CST_STATE_No !== '' && <>{json0Data?.Company_CST_STATE}-
                  {json0Data?.Company_CST_STATE_No}</>}
                   | PAN-{json0Data?.Pannumber}
                </p>
              </div>
              <div className="col-6">
                {isImageWorking && (json0Data?.PrintLogo !== "" &&
                  <img src={json0Data?.PrintLogo} alt=""
                    className='h-auto ms-auto d-block object-fit-contain spImgCal'
                    onError={handleImageErrors} />)}

              </div>
            </div>
            {/* address */}
            <div className="d-flex spBrdrLft spBrdrRigt  spBrdrBtom mb-1 recordDetailPrint1">
              <div className="col-4 spBrdrRigt  p-1">
                <p className="lhDetailPrint1 pb-1">{json0Data?.lblBillTo}</p>
                <p className="lhDetailPrint1 fw-bold detailPrint1L_font_14 pb-1">
                  {json0Data?.customerfirmname}
                </p>
                <p className="lhDetailPrint1 pb-1">{json0Data?.customerAddress2}</p>
                <p className="lhDetailPrint1 pb-1">{json0Data?.customerAddress1}</p>
                <p className="lhDetailPrint1 pb-1">{json0Data?.customerAddress3}</p>
                <p className="lhDetailPrint1 pb-1">
                  {json0Data?.customercity}
                  {json0Data?.customerpincode}
                </p>
                <p className="lhDetailPrint1 pb-1">{json0Data?.customeremail1}</p>
                <p className="lhDetailPrint1 pb-1">{json0Data?.vat_cst_pan}</p>
                { json0Data?.Cust_CST_STATE_No !== '' && <p className="lhDetailPrint1 pb-1">
                  {json0Data?.Cust_CST_STATE}-{json0Data?.Cust_CST_STATE_No}
                </p>}
              </div>
              <div className="col-4 spBrdrRigt  p-1">
                <p className="lhDetailPrint1 pb-1">Ship To,</p>
                <p className="lhDetailPrint1 fw-bold detailPrint1L_font_14 pb-1">
                  {json0Data?.customerfirmname}
                </p>
                
                    
                    {json0Data?.address?.map((e, i) => {
                      return <p className="lhDetailPrint1 pb-1" key={i}>{e}</p>
                    })}
                 {/* <><p className="lhDetailPrint1 pb-1">{json0Data?.CustName}</p>
                    <p className="lhDetailPrint1 pb-1">{json0Data?.customerstreet}</p>
                    <p className="lhDetailPrint1 pb-1">
                      {json0Data?.customercity} {json0Data?.State}
                    </p>
                    <p className="lhDetailPrint1 pb-1">
                      {json0Data?.CompanyCountry}-{json0Data?.PinCode}
                    </p>
                    <p className="lhDetailPrint1 pb-1">
                      Mobile No : {json0Data?.customermobileno}
                    </p></> */}
                

              </div>
              <div className="col-4 p-1 ps-2">
                <div className="d-flex ">
                  <p className="fw-bold col-3 me-2">VOUCHER NO </p>
                  <p className="col-9">{json0Data?.InvoiceNo}</p>
                </div>
                <div className="d-flex ">
                  <p className="fw-bold col-3 me-2">DATE </p>
                  <p className="col-9">{json0Data?.EntryDate}</p>
                </div>
                <div className="d-flex ">
                  <p className="fw-bold col-3 me-2">HSN </p>
                  <p className="col-9">{json0Data?.HSN_No}</p>
                </div>
              </div>
            </div>
            {/* table header*/}
            <div className="d-flex w-100 spBrdrTop recordDetailPrint1 lightGrey detailPrint1L_font_13">
              <div className="srnodplmemo spBrdrRigt spBrdrLft spBrdrBtom d-flex justify-content-center align-items-center flex-column">
                <p className="fw-bold">Sr </p>
              </div>
              <div className="designdplmemo spBrdrRigt p-1 spBrdrBtom d-flex justify-content-center align-items-center">
                <p className="fw-bold p-1">Design</p>
              </div>
              <div className={`diamonddplmemo spBrdrRigt `}>
                <div className="d-grid h-100">
                  <div className="d-flex justify-content-center spBrdrBtom">
                    <p className="fw-bold p-1">Diamond</p>
                  </div>
                  <div className="d-flex spBrdrBtom ">
                    <p className="fw-bold spWdths1 d-flex align-items-center justify-content-center spBrdrRigt ">
                      Code
                    </p>
                    <p className="fw-bold spWdths2 d-flex align-items-center justify-content-center spBrdrRigt ">
                      Size
                    </p>
                    <p className="fw-bold spWdths3 d-flex align-items-center justify-content-center spBrdrRigt ">
                      Pcs
                    </p>
                    <p className="fw-bold spWdths4 d-flex align-items-center justify-content-center">
                      Wt
                    </p>
                    {/* <p className="fw-bold col-2 d-flex align-items-center justify-content-center spBrdrRigt ">
                      Rate
                    </p>
                    <p className="fw-bold col-2 d-flex align-items-center justify-content-center text-center">
                      Amount
                    </p> */}
                  </div>
                </div>
              </div>
              <div className={`metaldplmemo spBrdrRigt `}>
                <div className="d-grid h-100">
                  <div className="d-flex justify-content-center align-items-center spBrdrBtom ">
                    <p className="fw-bold p-1">Metal </p>
                  </div>
                  <div className="d-flex spBrdrBtom ">
                    <p className="fw-bold col-5 spBrdrRigt d-flex align-items-center justify-content-center">
                      Quality
                    </p>
                    <p className="fw-bold col-4 spBrdrRigt d-flex align-items-center justify-content-center">
                      Wt(M+D)
                    </p>
                    <p className="fw-bold col-3 d-flex align-items-center justify-content-center">
                      NetWt
                    </p>
                    {/* <p className="fw-bold col-2 spBrdrRigt  d-flex align-items-center justify-content-center">
                      Rate
                    </p>
                    <p className="fw-bold col-3 d-flex align-items-center justify-content-center">
                      Amount
                    </p> */}
                  </div>
                </div>
              </div>
              <div className={`colorstonedplmemo spBrdrRigt `}>
                <div className="d-grid h-100">
                  <div className="d-flex justify-content-center spBrdrBtom ">
                    <p className="fw-bold p-1">Stone</p>
                  </div>
                  <div className="d-flex spBrdrBtom ">
                    <p className="fw-bold spWdths1 spBrdrRigt d-flex align-items-center justify-content-center">
                      Code
                    </p>
                    <p className="fw-bold spWdths2 spBrdrRigt d-flex align-items-center justify-content-center">
                      Size
                    </p>
                    <p className="fw-bold spWdths3 spBrdrRigt d-flex align-items-center justify-content-center">
                      Pcs
                    </p>
                    <p className="fw-bold spWdths4 d-flex align-items-center justify-content-center">
                      Wt
                    </p>
                    {/* <p className="fw-bold col-2 spBrdrRigt  d-flex align-items-center justify-content-center">
                      Rate
                    </p>
                    <p className="fw-bold col-2 d-flex align-items-center justify-content-center text-center">
                      Amount
                    </p> */}
                  </div>
                </div>
              </div>

            </div>
            {/* data */}
            {
              finalD?.resultArray?.map((e, i) => {
                return (
                  <div key={i} className="recordDetailPrint1">
                    <div className="d-flex w-100">
                      <div className="srnodplmemo spBrdrRigt spBrdrLft spBrdrBtom detailPrint1L_font_11">
                        <p className="p-1 text-center paddingLeftDetailPrint1 paddingRightDetailPrint1">{NumberWithCommas(i + 1, 0)}</p>
                      </div>
                      <div className="designdplmemo spBrdrRigt spBrdrBtom paddingLeftDetailPrint1 paddingRightDetailPrint1 detailPrint1L_font_11">
                        <div className="d-flex justify-content-between">
                          <div className="col">
                            <p className="fw-bold">{e?.designno}</p>
                          </div>
                          <div className="col d-flex flex-column align-items-end">
                            <p>{e?.SrJobno}</p>
                          </div>
                        </div>
                        <div className="imgBlock_dplmemo">
                          {checkBox?.image && (
                            <img
                              src={e?.DesignImage}
                              alt=""
                              className="w-100 d-block"
                              onError={handleImageError}
                              style={{maxWidth:'75px'}}
                            />
                          )}
                        </div>
                        <div className={`${!image && "pt-2 "}`}>

                          {e?.uniqueno !== "" && (
                            <p className="text-center fw-bold">{e?.uniqueno}</p>
                          )}
                          {/* {e?.PO !== "" && e?.PO !== "-" && (
                            <p className="text-center fw-bold">PO: {e?.PO}</p>
                          )}
                          {e?.lineid !== "" && (
                            <p className="text-center">
                              {e?.lineid}</p>
                          )}
                          {!detailPrintK && (
                            <p className="text-center">
                              Tunch :{" "}
                              <span className="fw-bold">
                                {NumberWithCommas(e?.Tunch, 3)}
                              </span>
                            </p>
                          )} */}
                          {/*                           
                          {!detailPrintK && (
                            <>
                            {
                              e?.CertificateNo !== '' && <p className="text-center">
                              Cert#{" "}
                              <span className="fw-bold">
                                {e?.CertificateNo}
                              </span>
                            </p>
                            }
                            </>
                          )} */}

                          {/* {dp1lp ? <>
                            <p className="text-center">
                              <span className="fw-bold">
                                {fixedValues(e?.grosswt, 3)} gm
                              </span><span className=""> Gross</span>
                            </p>
                          </> : <>
                            <p className="text-center">
                              Gross Wt:{" "}
                              <span className="fw-bold">
                                {fixedValues(e?.grosswt, 3)}
                              </span>
                            </p>
                          </>}
                          {e?.Size !== "" && e?.Size !== "-" && (
                            <p className="text-center">Size: {e?.Size}</p>
                          )} */}
                        </div>
                      </div>
                      <div className={`diamonddplmemo spBrdrRigt position-relative paddingLeftDetailPrint1 paddingRightDetailPrint1`}>
                        <div className="h-100 paddingBottomTotalDetailPrint1">
                          {e?.diamonds.length > 0 &&
                            e?.diamonds.map((ele, ind) => {
                              return (
                                <div
                                  className={`d-flex justify-content-between detailPrint1L_font_11`}
                                  key={ind}
                                >
                                  <p className="spWdths1 paddingRightDetailPrint1 text-break">
                                    {ele?.ShapeName} {ele?.QualityName} {ele?.Colorname}
                                  </p>
                                  <p className="spWdths2 text-start paddingRightDetailPrint1 text-break">
                                    {ele?.GroupName === "" ? ele?.SizeName : ele?.GroupName}
                                  </p>
                                  <p className="spWdths3 text-center paddingRightDetailPrint1">
                                    {NumberWithCommas(ele?.Pcs, 0)}
                                  </p>
                                  <p className="spWdths4 text-end paddingRightDetailPrint1">
                                    {fixedValues(ele?.Wt, 3)}
                                  </p>
                                  {/* <p className="col-2 text-end paddingRightDetailPrint1">
                                    {NumberWithCommas(ele?.Rate, 2)}
                                  </p>
                                  <p
                                    className={`col-2 text-end ${dp1lp && "fw-bold"} ${detailPrintK && "fw-bold "
                                      }`}
                                  >
                                    {NumberWithCommas(ele?.Amount, 2)}
                                  </p> */}
                                </div>
                              );
                            })}
                          <div className="d-flex spBrdrBtom position-absolute bottom-0 w-100 spBrdrTop detailPrint1L_font_13 totalMinHeightDetailPrint1 lightGrey start-0">
                            <p className="spWdths1 paddingRightDetailPrint1 "></p>
                            <p className="spWdths2 paddingRightDetailPrint1 "></p>
                            <p className="spWdths3 paddingRightDetailPrint1 text-center fw-bold d-flex align-items-center justify-content-center">
                              {/* {e?.diamondsTotal?.Pcs === 0 && NumberWithCommas(e?.totals?.diamonds?.Pcs, 0)} */}
                              {e?.totals?.diamonds?.Pcs !== 0 && NumberWithCommas(e?.totals?.diamonds?.Pcs, 0)}
                            </p>
                            <p className="spWdths4 paddingRightDetailPrint1 text-end fw-bold d-flex align-items-center justify-content-end">
                              {e?.totals?.diamonds?.Wt !== 0 &&
                                fixedValues(e?.totals?.diamonds?.Wt, 3)}
                            </p>
                            {/* <p className="col-2 paddingRightDetailPrint1 text-end fw-bold d-flex align-items-center justify-content-end"></p> */}
                            {/* <p className="col-3  text-end fw-bold d-flex align-items-center justify-content-end  paddingRightDetailPrint1l">
                              {e?.totals?.diamonds?.Amount !== 0 &&
                                NumberWithCommas(e?.totals?.diamonds?.Amount, 2)}
                            </p> */}
                          </div>
                        </div>
                      </div>
                      <div className={`metaldplmemo spBrdrRigt position-relative paddingLeftDetailPrint1 paddingRightDetailPrint1`}>
                        <div className="h-100 paddingBottomTotalDetailPrint1">
                          {e?.metal.length > 0 &&
                            e?.metal.map((ele, ind) => {
                              return (
                                <div className={`d-flex`} key={ind}>
                                  <p className="col-6 paddingRightDetailPrint1 text-break">
                                    {ele?.ShapeName + " " + ele?.QualityName}
                                  </p>
                                  <p className="col-3 text-end paddingRightDetailPrint1 text-break">
                                    {/* {ind === 0 ? NumberWithCommas(e?.NetWt + (e?.totals?.diamonds?.Wt / 5), 3) : NumberWithCommas(ele?.Wt, 3)} */}
                                    {fixedValues(e?.grosswt - (e?.totals?.colorstone?.Wt / 5),3)}
                                  </p>
                                  <p className="col-3 text-end paddingRightDetailPrint1">
                                    {/* {dp1lp ? NumberWithCommas(ele?.Wt, 3) : fixedValues(e?.NetWt + e?.LossWt, 3)} */}
                                    {(e?.NetWt + e?.LossWt)?.toFixed(3)}
                                  </p>
                                  {/* <p className="col-2  text-end paddingRightDetailPrint1">
                                    {NumberWithCommas(ele?.Rate, 2)}
                                  </p>
                                  <p className={`col-3 text-end ${ind > 0 && "fw-bold"}`}>
                                    {(NumberWithCommas(ele?.Amount, 2))}
                                  </p> */}
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
                          <div className="d-flex position-absolute bottom-0 w-100 detailPrint1L_font_13 totalMinHeightDetailPrint1 spBrdrTop spBrdrBtom lightGrey start-0">
                            <p className="col-5  paddingRightDetailPrint1"></p>
                            <p className="col-4 text-end fw-bold d-flex justify-content-end align-items-center paddingRightDetailPrint1">
                              {fixedValues(e?.grosswt - (e?.totals?.colorstone?.Wt / 5),3)}
                              {/* {e?.totals?.metal?.Wt !== 0 &&
                                fixedValues(e?.NetWt + (e?.totals?.diamonds?.Wt / 5), 3)} */}
                              {/* fixedValues(e?.totals?.metal?.Wt + (e?.totals?.diamonds?.Wt / 5), 3)} */}
                            </p>
                            <p className="col-3 text-end fw-bold d-flex justify-content-end align-items-center paddingRightDetailPrint1">
                              {/* {e?.NetWt !== 0 && (dp1lp ? fixedValues(e?.primaryMetalWt, 3) : fixedValues(e?.NetWt + e?.LossWt, 3))} */}
                              {fixedValues(e?.NetWt + e?.LossWt,3)}
                            </p>
                            {/* <p className="col-2 text-end paddingRightDetailPrint1"></p>
                            <p className="col-3 text-end fw-bold d-flex justify-content-end align-items-center  paddingRightDetailPrint1 ">
                              {
                                NumberWithCommas(e?.metal[0].Amount, 2)}
                            </p> */}
                          </div>
                        </div>
                      </div>
                      <div className={`colorstonedplmemo spBrdrRigt position-relative paddingLeftDetailPrint1 paddingRightDetailPrint1`}>
                        <div className="h-100 paddingBottomTotalDetailPrint1">
                          {e?.colorstone.length > 0 &&
                            e?.colorstone.map((ele, ind) => {
                              return (
                                <div className={`d-flex detailPrint1L_font_11`} key={ind}>
                                  <p className="spWdths1 paddingRightDetailPrint1 text-break">
                                    {ele?.ShapeName} {ele?.QualityName} {ele?.Colorname}
                                  </p>
                                  <p className="spWdths2 text-start paddingRightDetailPrint1 text-break">
                                    {ele?.SizeName}
                                  </p>
                                  <p className="spWdths3 text-center paddingRightDetailPrint1">
                                    {NumberWithCommas(ele?.Pcs, 0)}
                                  </p>
                                  <p className="spWdths4 text-end paddingRightDetailPrint1">
                                    {fixedValues(ele?.Wt, 3)}
                                  </p>
                                  {/* <p className="col-2 text-end paddingRightDetailPrint1">
                                    {NumberWithCommas(ele?.Rate, 2)}
                                  </p>
                                  <p
                                    className={`col-2 text-end ${dp1lp && "fw-bold"} ${detailPrintK && "fw-bold paddingRightDetailPrint1"
                                      }`}
                                  >
                                    {NumberWithCommas(ele?.Amount, 2)}
                                  </p> */}
                                </div>
                              );
                            })}
                          <div className="d-flex spBrdrBtom position-absolute bottom-0 w-100 spBrdrTop detailPrint1L_font_13 totalMinHeightDetailPrint1 lightGrey paddingRightDetailPrint1 paddingLeftDetailPrint1 start-0">
                            <p className="spWdths1 paddingRightDetailPrint1"></p>
                            <p className="spWdths2 paddingRightDetailPrint1"></p>
                            <p className="spWdths3 paddingRightDetailPrint1 text-center fw-bold d-flex align-items-center justify-content-center">
                              {e?.totals?.colorstone?.Pcs !== 0 &&
                                e?.totals?.colorstone?.Pcs}
                            </p>
                            <p className="spWdths4 text-end fw-bold d-flex align-items-center justify-content-end paddingRightDetailPrint1">
                              {e?.totals?.colorstone?.Wt !== 0 &&
                                fixedValues(e?.totals?.colorstone?.Wt, 3)}
                            </p>
                            {/* <p className=" col-2 text-end paddingRightDetailPrint1"></p>
                            <p className=" col-2 text-end fw-bold d-flex align-items-center justify-content-end paddingLeftDetailPrint1  ">
                              {e?.totals?.colorstone?.Amount !== 0 &&
                                NumberWithCommas(
                                  e?.totals?.colorstone?.Amount,
                                  2
                                )}
                            </p> */}
                          </div>
                        </div>
                      </div>

                    </div>
                    {/* {e?.Discount !== 0 && <div className="d-flex w-100">
                      <div className="srNoDetailprint11 spBrdrRigt spBrdrLft  spBrdrBtom">
                        <p className=" p-1"></p>
                      </div>
                      <div className="designDetalPrint1 spBrdrRigt  p-1 spBrdrBtom"></div>
                      <div className={`${dpp ? "diamondDetailPrint1p" : "diamondDetailPrint1l"} spBrdrRigt  position-relative spBrdrBtom lightGrey`}>
                        <div className="d-grid"></div>
                      </div>
                      <div className={`${dpp ? "metalGoldDetailPrint1p" : "metalGoldDetailPrint1l"} spBrdrRigt  position-relative spBrdrBtom lightGrey`}></div>
                      <div className={`${dpp ? "stoneDetailsPrint1p" : "stoneDetailsPrint1l"} spBrdrRigt position-relative spBrdrBtom pt-1 lightGrey`}>
                        <div className="d-grid">
                          {e?.Discount !== 0 && (
                            <p className="p-1 text-end fw-bold paddingLeftDetailPrint1 paddingRightDetailPrint1">
                              Discount{" "}
                              {e?.Discount !== 0 &&
                                NumberWithCommas(e?.Discount, 2)}
                              {!detailPrintK && "%"} @Total Amount
                            </p>
                          )}
                        </div>
                      </div>
                      <div className={`${dpp ? "otherAmountDetailPrint1p" : "otherAmountDetailPrint1l"} spBrdrRigt  spBrdrBtom lightGrey`}>
                        <p className="d-flex align-items-center justify-content-end"></p>
                      </div>
                      <div className="labourAmountDetailPrint1 spBrdrRigt  lightGrey spBrdrBtom pt-1 ">
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
                      <div className="totalAmountDetailPrint1 spBrdrRigt  spBrdrBtom d-flex align-tems-center justify-content-end lightGrey">
                        <p className="d-flex align-items-center">
                          {!dp1lp && <span
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
                    </div>} */}
                  </div>
                );
              })
            }
            
            <div className="spBrdrRigt spBrdrLft" style={{ width: "99.99%", height: "15px" }}></div>
            {/* total */}
            <div className="d-flex w-100 recordDetailPrint1 lightGrey detailPrint1L_font_13 spBrdrTop spBrdrLft spBrdrBtom">
              <div className="designdplmemoMerged spBrdrRigt d-table">
                <p className="fw-bold text-center d-table-cell align-middle">
                  Total
                </p>
              </div>
              <div className={`diamonddplmemo position-relative d-flex flex-column justify-content-center paddingLeftDetailPrint1 paddingRightDetailPrint1`}>
                <div className="d-flex">
                  <div className="spWdths1">
                    <p className=""></p>
                  </div>
                  <div className="spWdths2">
                    <p className=""></p>
                  </div>
                  <div className="spWdths3 text-center fw-bold">
                    <p className="">{NumberWithCommas(finalD?.mainTotal?.diamonds?.Pcs, 0)}</p>
                  </div>
                  <div className="spWdths4 text-end">
                    <p className="fw-bold">
                      {NumberWithCommas(finalD?.mainTotal?.diamonds?.Wt, 3)}
                    </p>
                  </div>
                  {/* <div className=" col-2 text-end">
                    <p className=""></p>
                  </div> */}
                  {/* <div className=" col-2 text-end">
                    <p className="fw-bold">
                      {NumberWithCommas(finalD?.mainTotal?.diamonds?.Amount, 2)}
                    </p>
                  </div> */}
                </div>
              </div>
              <div className={`metaldplmemo position-relative d-flex flex-column justify-content-center`}>
                <div className="d-flex">
                  <div className="col-6 paddingRightDetailPrint1">
                    <p className=""></p>
                  </div>
                  <div className="col-3 text-end paddingRightDetailPrint1">
                    {/* <p className="fw-bold">{NumberWithCommas(finalD?.mainTotal?.netwt + (finalD?.mainTotal?.diamonds?.Wt / 5), 3)}</p> */}
                    <p className="fw-bold">{NumberWithCommas(finalD?.mainTotal?.grosswt - (finalD?.mainTotal?.colorstone?.Wt / 5), 3)}</p>
                  </div>
                  <div className="col-3 text-end paddingRightDetailPrint1">
                    <p className="fw-bold">
                      {/* {dp1lp ? NumberWithCommas(totalMetalWts, 3) : NumberWithCommas(finalD?.mainTotal?.metal?.Wt, 3)} */}
                      {NumberWithCommas(finalD?.mainTotal?.metal?.Wt, 3)}
                      {/* {NumberWithCommas(finalD?.mainTotal?.netwt, 3)} */}
                    </p>
                  </div>
                  {/* <div className="col-2 text-end paddingRightDetailPrint1">
                    <p className=""></p>
                  </div>
                  <div className="col-3 text-end paddingRightDetailPrint1">
                    <p className="fw-bold">
                      {NumberWithCommas(finalD?.mainTotal?.MetalAmount, 2)}
                    </p>
                  </div> */}
                </div>
              </div>
              <div className={`colorstonedplmemo spBrdrRigt position-relative d-flex flex-column justify-content-center paddingLeftDetailPrint1 paddingRightDetailPrint1`}>
                <div className="d-flex">
                  <div className="spWdths1 paddingRightDetailPrint1">
                    <p className=""></p>
                  </div>
                  <div className="spWdths2 paddingRightDetailPrint1">
                    <p className=""></p>
                  </div>
                  <div className="spWdths3 text-center d-flex justify-content-center align-items-center h-100 paddingRightDetailPrint1">
                    <p className="fw-bold">
                      {finalD?.mainTotal?.colorstone?.Pcs}
                    </p>
                  </div>
                  <div className="spWdths4 text-end d-flex justify-content-end align-items-center h-100 paddingRightDetailPrint1">
                    <p className="fw-bold">
                      {(finalD?.mainTotal?.colorstone?.Wt)?.toFixed(3)}
                    </p>
                  </div>
                  {/* <div className="col-2 text-end d-flex justify-content-end align-items-center h-100  paddingRightDetailPrint1">
                    <p className="fw-bold"></p>
                  </div>
                  <div className="col-2 text-end d-flex justify-content-end align-items-center h-100 ">
                    <p className="fw-bold">
                      {NumberWithCommas(total?.colorStoneAmount, 2)}
                    </p>
                  </div> */}
                </div>
              </div>
            </div>
                  
            <div className="d-flex justify-content-end w-100">
            <div className="checkedBy_dplmemo">Checked By</div>
            </div>

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

export default DetailPrintGroupLMemo;