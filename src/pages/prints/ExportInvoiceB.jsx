// my last invoice print Export Invoice B
import React, { useEffect, useState } from "react";
import {
  apiCall,
  formatAmount,
  handlePrint,
  isObjectEmpty,
} from "../../GlobalFunctions";
import "../../assets/css/prints/exportinvoiceb.css";
import { OrganizeInvoicePrintData } from "../../GlobalFunctions/OrganizeInvoicePrintData";
import NumToWord, { convertToUppercase } from "../../GlobalFunctions/NumToWord";
import moment from "moment/moment";
import Loader from "../../components/Loader";
import { cloneDeep } from "lodash";
import { formatAmountRound } from "../dashboard/GlobalFunctions";

const ExportInvoiceB = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {
  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const [po, setPO] = useState("");
  const [metRate, setMetRate] = useState(0);
  const [tunch, setTunch] = useState(0);
  const [metalTypeWise, setMetalTypeWise] = useState([]);
  const [hsnNo, setHSNno] = useState([]);

  const [vesselFlightNo, setVesselFlightNo] = useState("");
  const [preCarraigeBy, setPreCarraigeBy] = useState("");
  const [ifscInput, setIfscInput] = useState("");
  const [prod, setProd] = useState("");

  const [rateOfGold, setRateOfGold] = useState("");
  const [ratePerGram995, setRatePerGram995] = useState("");
  const [ratePerGram76, setRatePerGram76] = useState("");
  const [labourVal, setLabourVal] = useState("");

  const [avgLossPer, setAvgLossPer] = useState(0);

  const [diamondCount, setDiamodCount] = useState("");

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
          setMsg(data?.Message);
        }
      } catch (error) {
        console.error(error);
      }
    };
    sendData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = (data) => {
    let address = data?.BillPrint_Json[0]?.Printlable?.split("\r\n");
    data.BillPrint_Json[0].address = address;

    const datas = OrganizeInvoicePrintData(
      data?.BillPrint_Json[0],
      data?.BillPrint_Json1,
      data?.BillPrint_Json2
    );

    let vfn = datas?.header?.Flight_NO;
    setVesselFlightNo(vfn);
    let transporter = datas?.header?.Name_Of_Transporter;
    setPreCarraigeBy(transporter);
    let ifsc = datas?.header?.rtgs_neft_ifsc;
    setIfscInput(ifsc);
    let prod = "ONE TIN BOX INDIAN MADE" + " " + datas?.header?.Product_Type;
    setProd(prod);

    let metGold = `${formatAmount(
      (datas?.header?.MetalRate24K * 31) / datas?.header?.CurrencyExchRate
    )}  (GJE PC)`;
    setRateOfGold(metGold);
    let metGold2 = `${formatAmount(
      datas?.header?.MetalRate24K / datas?.header?.CurrencyExchRate
    )} (0.995%)`;
    setRatePerGram995(metGold2);
    let metGold3 = `${formatAmount(
      (datas?.header?.MetalRate24K * 31) / datas?.header?.CurrencyExchRate
    )}  (GJE PC)`;
    setRatePerGram76(metGold3);
    let labourval = ` ${formatAmountRound(
      datas?.resultArray[0]?.MaKingCharge_Unit
    )} PG`;
    setLabourVal(labourval);

    let dc = 0;
    try {
      if (datas?.resultArray?.length > 0) {
        let po = datas?.resultArray[0]?.PO;
        setPO(po);
        let met_rate = datas?.resultArray[0]?.metal_rate;
        setMetRate(met_rate);
        let tunch = datas?.resultArray[0]?.Tunch;
        setTunch(tunch);
        let metArr = [];
        datas?.resultArray?.forEach((a) => {
          let obj = cloneDeep(a);
          let findrec = metArr.findIndex(
            (al) => al?.MetalPurity === obj?.MetalPurity
          );
          if (findrec === -1) {
            metArr.push(obj);
          } else {
            metArr[findrec].LossWt += obj?.LossWt;
            metArr[findrec].MakingAmount += obj?.MakingAmount;
            metArr[findrec].MetalAmount += obj?.MetalAmount;
            metArr[findrec].MetalWeight += obj?.MetalWeight;
            metArr[findrec].NetWt += obj?.NetWt;
            metArr[findrec].OtherCharges += obj?.OtherCharges;
            metArr[findrec].PureNetWt += obj?.PureNetWt;
            metArr[findrec].Quantity += obj?.Quantity;
            metArr[findrec].TotalAmount += obj?.TotalAmount;
            metArr[findrec].UnitCost += obj?.UnitCost;
            metArr[findrec].Wastage += obj?.Wastage;
            metArr[findrec].grosswt += obj?.grosswt;
            metArr[findrec].metal_rate += obj?.metal_rate;
            metArr[findrec].totals.diamonds.Amount +=
              obj?.totals?.diamonds?.Amount;
            metArr[findrec].totals.diamonds.Pcs += obj?.totals?.diamonds?.Pcs;
            metArr[findrec].totals.diamonds.Wt += obj?.totals?.diamonds?.Wt;
          }
        });
        setMetalTypeWise(metArr);

        let catWise = [];
        datas?.resultArray?.forEach((a) => {
          if (a?.diamonds?.length > 0) {
            dc += 1;
          }
          let obj = cloneDeep(a);
          let findrec = catWise?.findIndex(
            (e) => e?.Categoryname === obj?.Categoryname
          );
          if (findrec === -1) {
            catWise.push(obj);
          } else {
            catWise[findrec].NetWt += obj?.NetWt;
            catWise[findrec].grosswt += obj?.grosswt;
            catWise[findrec].Quantity += obj?.Quantity;
            catWise[findrec].metal_rate = obj?.metal_rate;
            catWise[findrec].totals.diamonds.Wt += obj?.totals?.diamonds?.Wt;
            catWise[findrec].totals.diamonds.Pcs += obj?.totals?.diamonds?.Pcs;
            catWise[findrec].TotalAmount += obj?.TotalAmount;
            catWise[findrec].MetalAmount += obj?.MetalAmount;
          }
        });

        datas.resultArray = catWise;

        let hsn_no_array = datas?.resultArray?.map((e) => e?.HSNNo);
        setHSNno([...new Set(hsn_no_array)]);

        setDiamodCount(dc);
      }
    } catch (error) {
      console.log(error);
    }

    //  let lossPerAll =  datas?.json1?.map((e) => e?.LossPer)?.reduce((num, acc) => num + acc, 0);
    //  console.log(lossPerAll);
    let lossPerAll = datas?.json1?.map((e) => e?.LossPer)?.filter((x) => x !== undefined)?.reduce((num, acc) => num + acc, 0);

    let avgLossPer = (lossPerAll / datas?.json1?.length);

    // let lossper = ((avgLossPer * datas?.mainTotal?.NetWt) / 100);

    setAvgLossPer(avgLossPer);

     

    setResult(datas);
  };

  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <>
          {msg === "" ? (
            <div className="EIB">
              <div className="fivecm_ebi"></div>
              <div className="d-flex justify-content-end align-items-center pb-3 d_none_eib">
                <input
                  type="button"
                  className="btn_white blue me-0"
                  value="Print"
                  onClick={(e) => handlePrint(e)}
                />
              </div>
              <div className="border border-black page_eib">
                <div className="fs_eib fw-bold border-bottom border-black  w-100 text-center">
                  INVOICE
                </div>
                <div className="fs_eib fw-bold border-bottom border-black w-100 text-center border-top-0 border-bottom-0">
                  SUPPLUMEANT EXPORT UNDER LUT WITHOUT PAYMENT OF IGST
                </div>

                <div className="first_page_eia fs_eib">
                  <div className="d-flex border border-end-0 border-start-0 border-black">
                    <div className="p-0 col-6 border-end border-black">
                      <div className="d-flex justify-content-between">
                        <div className="fw-semibold ps-1 fs_sm_ebi pb-2">
                          EXPORTER
                        </div>
                      </div>
                      <div className="fw-bold ps-3">
                        {result?.header?.CompanyFullName}
                      </div>
                      <div className=" ps-3">
                        {result?.header?.CompanyAddress}
                      </div>
                      <div className=" ps-3">
                        {result?.header?.CompanyAddress2}
                      </div>
                      <div className=" ps-3">
                        {result?.header?.CompanyCity +
                          ", " +
                          result?.header?.CompanyCountry +
                          ", " +
                          result?.header?.CompanyPinCode}
                      </div>
                      <div className=" ps-3">
                        {result?.header?.DefCustFirstname}{" "}
                        {result?.header?.DefCustLastname}
                      </div>
                      <div className=" ps-3">
                        TEL :&nbsp;{result?.header?.CompanyTellNo}
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex border-bottom border-black">
                        <div className="col-7 border-end border-black ps-1">
                          <div className=" text-break">
                            <div className="fw-bold">
                              INVOICE NO. & DATE <br />
                            </div>
                            <div className="fw-normal">
                              {result?.header?.InvoiceNo} &nbsp;{" "}
                              <div className="fw-normal">
                                DT :{" "}
                                {moment(result?.header?.EntryDate).format(
                                  "DD-MM-YYYY"
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-5 d-flex flex-column justify-content-between align-items-center ps-1">
                          <div className="text-uppercase fw-semibold w-100 text-start">
                            Exporter's Reference
                          </div>
                          <div className="text-uppercase fw-semibold text-start w-100">
                            UNDER CHAPTER 4
                          </div>
                        </div>
                      </div>
                      <div className="p-1 minH_buyers_ebi">
                        <div className="">BUYER'S ORDER NO. & DATE</div>
                        <br />
                        {/* <div>{po}</div> */}
                      </div>
                      <div className="d-flex w-100 justify-content-between border-top border-black head_sub_div">
                        <div className="p-1 border-end w-50 border-black">
                          <div className="">OTHER REFERENCE(S)</div>
                          <div className="fw-semibold"></div>
                        </div>
                        <div className="ps-1 w-50 d-flex flex-column justify-content-between">
                          <div className="">
                            I.E.CODE NO:{" "}
                            <span className="fw-bold">
                              {result?.header?.IEC_NO}
                            </span>
                          </div>
                          <div className="">
                            PAN NO:{" "}
                            <span className="fw-bold">
                              {result?.header?.Pannumber}
                            </span>
                          </div>
                          <div className="">
                            GST NO:{" "}
                            <span className="fw-bold">
                              {result?.header?.Company_VAT_GST_No}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex border border-top-0 border-black border-end-0 border-start-0 ">
                    <div className="ps-1  col-6 border-end border-black">
                      <div className="d-flex justify-content-between">
                        <div className="pb-2 fw-semibold fs_sm_ebi">
                          {" "}
                          CONSIGENEE{" "}
                        </div>
                      </div>
                      <div className="headline_fs_eia fw-bold ps-3">
                        {result?.header?.customerfirmname}
                      </div>
                      <div className=" ps-3">
                        {result?.header?.customerAddress1}
                      </div>
                      <div className=" ps-3">
                        {result?.header?.customerAddress2}
                      </div>
                      <div className=" ps-3">
                        {result?.header?.customerAddress3}{" "}
                        {result?.header?.customercity},{" "}
                        {result?.header?.customercountry}
                      </div>
                      <div className=" ps-3">
                        TEL : {result?.header?.CustTelePhone}
                      </div>
                      {console.log(result)}
                    </div>
                    <div className="col-6 ">
                      <div className=" ps-1 border-bottom border-black minH_buyers_ebi d-flex flex-column justify-content-between">
                        <div className="fw-bold">
                          {convertToUppercase(
                            "Buyer (if other than consignee)"
                          )}
                        </div>
                        <div className="fw-bold">
                          LUT NO :
                          {/* <input type="text" /> */}
                          {result?.header?.LUTRAN_NO} 
                        </div>
                      </div>
                      <div className=" col-12">
                        <div className="border-bottom border-black">
                          <div className="ps-1 pb-2 fw-semibold">
                            INSURANCE COVERED BY {result?.header?.insuranceby}
                          </div>

                          <div className="ps-1 fw-bold">
                            {result?.header?.Company_CST_STATE} :{" "}
                            {result?.header?.Company_CST_STATE_No}{" "}
                            {result?.header?.CompanyState} DIST. CODE :
                            <input type="text" className="border_remove_eib" style={{width:'6%', marginRight:'5px',borderRadius:"4px", marginBottom:'2px', border:'1px solid #BDBDBD'}} />
                            ({result?.header?.CompanyCity})
                          </div>
                        </div>
                        <div className="d-flex">
                          <div className="ps-1  border-end border-black w-50">
                            <div className="fw-semibold">
                              COUNTRY OF ORIGIN GOODS
                            </div>{" "}
                            <br />{" "}
                            <div className="text-center fw-bold">
                              {convertToUppercase(
                                result?.header?.CompanyCountry
                              )}
                            </div>
                          </div>

                          <div className="ps-1 w-50">
                            <div className="fw-semibold">
                              COUNTRY OF FINAL DESTINATION
                            </div>{" "}
                            <br />{" "}
                            <div className="text-center fw-bold">
                              {convertToUppercase(
                                result?.header?.customercountry
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex border border-top-0 border-black border-bottom-0 overflow-hidden border-end-0 border-start-0 ">
                    <div className="col-6 border-end border-black">
                      <div className="d-flex border-bottom border-black">
                        <div className="col-6  px-1  border-end border-black">
                          <p className="fw-normal pb-2">PRE-CARRIAGE BY </p>
                          {/* <div className="fw-bold ps-3">{result?.header?.Name_Of_Transporter}</div> */}
                          <div className="fw-bold ps-3">
                            <input
                              type="text"
                              style={{ border: "1px solid #e8e8e8" }}
                              className="border_remove_eib"
                              onChange={(e) => setPreCarraigeBy(e.target.value)}
                              value={preCarraigeBy}
                            />
                          </div>
                        </div>
                        <div className="col-6  px-1 pb-0">
                          <p className="fw-normal">
                            PLACE OF RECEIPT BY PRE-CARRIER{" "}
                          </p>
                          <p>N.A</p>
                        </div>
                      </div>
                      <div className="d-flex border-bottom border-black">
                        <div className="col-6  px-1  border-end border-black">
                          <p className="fw-normal pb-2">VESSEL/FLIGHT NO</p>
                          {/* <div className="fw-bold ps-3">{result?.header?.Flight_NO}</div> */}
                          {/* <div className="fw-bold ps-3" style={{paddingBottom:'1px'}}>AIR FREIGHT &nbsp;<input type="text" style={{border:'1px solid #e8e8e8'}} className="border_remove_eib" onChange={(e) => setVesselFlightNo(e.target.value)} value={vesselFlightNo} /></div> */}
                          <div
                            className="fw-bold ps-3"
                            style={{ paddingBottom: "1px" }}
                          >
                            AIR FREIGHT{" "}
                          </div>
                        </div>
                        <div className="col-6  px-1 ">
                          <p className="fw-normal pb-2">PORT OF LOADING</p>
                          <p className="fw-bold ps-3">
                            {result?.header?.portofloading}
                          </p>
                        </div>
                      </div>
                      <div className="d-flex border-bottom border-black">
                        <div className="col-6 px-1  border-end border-black">
                          <p className="fw-normal pb-2">PORT OF DISCHARGE</p>
                          <p className="fw-bold ps-3">
                            {result?.header?.portofdischarge?.toUpperCase()}
                          </p>
                        </div>
                        <div className="col-6  px-1 ">
                          <p className="fw-normal pb-2">Final Destination</p>
                          <div className="fw-bold ps-3">
                            {result?.header?.customercountry?.toUpperCase()}
                          </div>
                        </div>
                      </div>
                      <div className="d-flex border-bottom border-black">
                        <div className="col-6  px-1  border-end  border-black">
                          <p className="fw-normal pb-2">MARKS OF NOS.</p>
                          <p className="">AS ADDRESS &nbsp;&nbsp;1 PACKAGE</p>
                          <p className="">AS ADDRESS &nbsp;&nbsp;(ONE ONLY)</p>
                        </div>
                        <div className="col-6  px-1  ">
                          <p className="fw-normal d-flex justify-content-between align-items-center">
                            <span className="pb-2">NO & KIND OF PKGS</span>
                            <span className=" ps-3">DESCRIPTION OF GOODS</span>
                          </p>
                          <p className="fw-normal d-flex justify-content-between align-items-center">
                            {/* <span className="pb-0 text-break w-80">ONE TIN BOX INDIAN MADE {result?.header?.Product_Type}</span> */}
                            <span className="pb-0 text-break w-80">
                              <input
                                type="text"
                                style={{
                                  border: "1px solid #e8e8e8",
                                  minWidth: "200px",
                                }}
                                className="minWInp border_remove_eib"
                                onChange={(e) => setProd(e.target.value)}
                                value={prod}
                              />
                            </span>
                            <span className=" ps-3 w-20"></span>
                          </p>
                          <p className="fw-normal d-flex justify-content-between align-items-center">
                            {/* <span>HSN CODE : {hsnNo?.join(",")}</span> */}
                            <span style={{ paddingTop: "1px" }}>
                              HSN CODE :{" "}
                              <input
                                type="text"
                                onChange={(e) => setHSNno(e.target.value)}
                                value={hsnNo?.join(",")}
                                className="border_remove_eib"
                                style={{ border: "1px solid #e8e8e8" }}
                              />
                            </span>
                            <span className=" ps-3"></span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex ">
                        <div className="col-12 ps-1">
                          <div className="fw-semibold pb-2  w-100">
                            <div className="pb-2">
                              TERMS OF DELIVERY AND PAYMENT
                            </div>
                            {result?.header?.DueDays} Days
                          </div>
                          <div className="pb-2 w-100 d-flex justify-content-between align-items-center ">
                            <span>BANK : {result?.header?.bankname}</span>
                            <span className="pe-1">
                              AD CODE :{" "}
                              <input
                                type="text"
                                max={20}
                                maxLength={20}
                                className="border_remove_eib"
                                style={{
                                  width: "80px",
                                  border: "1px solid #e8e8e8",
                                }}
                              />
                            </span>
                          </div>
                          <div className="pb-1  w-100 fw-bold">
                            Bank Account Number :{" "}
                            {result?.header?.accountnumber}
                          </div>
                          <div className="pb-1  w-100">
                            Address : {result?.header?.bankaddress}
                          </div>
                          <div className="ps-5">
                            SWIFT CODE :{" "}
                            <input
                              type="text"
                              max={20}
                              maxLength={20}
                              style={{
                                width: "80px",
                                border: "1px solid #e8e8e8",
                              }}
                              className="border_remove_eib"
                            />
                          </div>
                          <div className="ps-5" style={{ paddingTop: "1px" }}>
                            IFSC CODE :{" "}
                            <input
                              type="text"
                              max={20}
                              maxLength={20}
                              style={{
                                width: "80px",
                                border: "1px solid #e8e8e8",
                              }}
                              onChange={(e) => setIfscInput(e.target.value)}
                              value={ifscInput}
                              className="border_remove_eib"
                            />
                          </div>
                          {/* <div className="ps-5">IFSC CODE : {result?.header?.rtgs_neft_ifsc}</div> */}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div
                      className="border-black border ms-1 mt-1 mr-1 fs_eib "
                    >
                      <div className="d-flex fw-bold ">
                        <div style={{ width: "49%" }} className="ps-4">
                          <div className="px-1">
                            DIAMOND INDIA LIMITED GOLD DETAILS
                          </div>
                          <div className="d-flex justify-content-between align-items-center px-1 w-50">
                            <div className="w-50">INV. NO.</div>
                            <div className="w-50">INV. DT.</div>
                          </div>
                          <div className="d-flex justify-content-between align-items-center px-1 w-50">
                            <div className="w-50">
                              <input
                                type="text"
                                className="border_remove_eib"
                                style={{ border: "1px solid #e8e8e8" }}
                              />
                            </div>
                            <div className="w-50">
                              <input
                                type="text"
                                className="border_remove_eib"
                                style={{ border: "1px solid #e8e8e8" }}
                              />
                            </div>
                          </div>
                          <div className="d-flex justify-content-between align-items-center px-1 w-50">
                            <div className="w-50">PURCHASE QTY.</div>
                            <div className="w-50">
                              <input
                                type="text"
                                className="border_remove_eib"
                                style={{ border: "1px solid #e8e8e8" }}
                              />
                            </div>
                          </div>
                          {/* <div className="d-flex justify-content-between align-items-center px-1 w-50">
                        <div className="w-50">USED GOLD QTY.</div>
                        <div className="w-50"><input type="text" className="border_remove_eib" style={{border:'1px solid #e8e8e8'}} /></div>
                      </div> */}
                          {/* <div className="d-flex justify-content-between align-items-center px-1 w-50">
                        <div className="w-50">BALANCE QTY.</div>
                        <div className="w-50"><input type="text" className="border_remove_eib" style={{border:'1px solid #e8e8e8'}} /></div>
                      </div> */}
                        </div>
                        {/* <div className="col1_eib center_eib ">
                        
                      </div>
                      <div className="col2_eib center_eib ">
                        
                      </div>
                      <div className="col3_eib center_eib ">
                        
                      </div>
                      <div className="col4_eib center_eib ">
                        
                      </div> */}
                        {/* <div className="col5_eib center_eib border-end  border-black"></div>
                        <div className="col6_eib ps-1 start_ebi border-end border-bottom border-black">
                          QUANTITY
                        </div>
                        <div className="col7_eib ps-1 start_ebi border-end border-bottom border-black">
                          RATE
                        </div>
                        <div className="col8_eib ps-1 start_ebi border-bottom border-black">
                          AMOUNT
                        </div> */}
                      </div>
                      <div className="d-flex fw-bold ">
                        <div style={{ width: "49%" }} className="ps-4">
                          <div className="d-flex justify-content-between align-items-center px-1 w-50">
                            <div className="w-50">USED GOLD QTY.</div>
                            <div className="w-50">
                              <input
                                type="text"
                                className="border_remove_eib"
                                style={{ border: "1px solid #e8e8e8" }}
                              />
                            </div>
                          </div>
                        </div>
                        {/* <div className="col1_eib center_eib ">
                        
                      </div>
                      <div className="col2_eib center_eib ">
                        
                      </div>
                      <div className="col3_eib center_eib ">
                        
                      </div>
                      <div className="col4_eib center_eib ">
                        
                      </div> */}
                        {/* <div className="col5_eib center_eib border-end border-black"></div>
                        <div className="col6_eib center_eib border-end  border-bottom border-black">
                          In Pcs
                        </div>
                        <div className="col7_eib center_eib border-end  border-bottom border-black"></div>
                        <div className="col8_eib center_eib border-bottom border-black">
                          {result?.header?.CurrencyCode}
                        </div> */}
                      </div>
                      <div className="d-flex fw-bold border-bottom border-black">
                        <div style={{ width: "49%" }} className="ps-4">
                          <div className="d-flex justify-content-between align-items-center px-1 w-50">
                            <div className="w-50">BALANCE QTY.</div>
                            <div className="w-50">
                              <input
                                type="text"
                                className="border_remove_eib"
                                style={{ border: "1px solid #e8e8e8" }}
                              />
                            </div>
                          </div>
                        </div>
                        {/* <div className="col1_eib center_eib ">
                        
                      </div>
                      <div className="col2_eib center_eib ">
                        
                      </div>
                      <div className="col3_eib center_eib ">
                        
                      </div>
                      <div className="col4_eib center_eib ">
                        
                      </div> */}
                        {/* <div className="col5_eib center_eib border-end border-black"></div>
                        <div className="col6_eib center_eib border-end border-black"></div>
                        <div className="col7_eib center_eib border-end border-black"></div>
                        <div className="col8_eib center_eib ">&nbsp;</div> */}
                      </div>
                      <div className="d-flex fw-bold ">
                        <div className="col1_eib center_eib border-end border-black">
                          Sr. No
                        </div>
                        <div className="col2_eib center_eib border-end border-black">
                          Description
                        </div>
                        {/* <div className="col3_eib center_eib border-end border-black">
                          Stone Pcs
                        </div>
                        <div className="col4_eib center_eib border-end border-black">
                          Stone Wt
                        </div> */}
                        <div className="col5_eib center_eib border-end border-black">
                          Pcs
                        </div>
                        <div className="col6_eib center_eib border-end border-black">
                          Wt. In GMS
                        </div>
                        <div className="col7_eib center_eib border-end border-black">
                          Rate In {result?.header?.CurrencyCode}
                        </div>
                        <div className="col8_eib center_eib ">
                          Total Value {result?.header?.CurrencyCode}
                        </div>
                      </div>
                      {result?.resultArray?.map((e, i) => {
                        return (
                          <div
                            className="d-flex  border-top fs_eib border-black page_eib"
                            key={i}
                          >
                            <div className="col1_eib end_ebi border-end border-black pe-1">
                              {(i + 1)?.toFixed(2)}
                            </div>
                            <div className="col2_eib  border-end border-black ps-1 d-flex justify-content-start align-items-center">
                              {/* <div>{e?.MetalPurity} {e?.MetalColor} {e?.Categoryname} {e?.Size !== '' && `SIZE : ${e?.Size}`} </div> */}
                              <div> {e?.Categoryname} </div>
                              {/* <div>VENDOR STYLE NO : {e?.designno}</div>
                            <div>ITEM NO : {e?.SrJobno}</div> */}
                            </div>
                            {/* <div className="col3_eib d-flex justify-content-center align-items-center pe-1 border-end border-black">
                              {e?.totals?.diamonds?.Pcs}
                            </div>
                            <div className="col4_eib d-flex justify-content-center align-items-center pe-1 border-end border-black">
                              {e?.totals?.diamonds?.Wt?.toFixed(2)}
                            </div> */}
                            <div className="col5_eib d-flex justify-content-center align-items-center pe-1 border-end border-black">
                              {e?.Quantity}
                            </div>
                            <div className="col6_eib d-flex flex-column justify-content-between  border-end border-black">
                              <div className="d-flex justify-content-between">
                                <div>GROSS WT</div>
                                <div>{e?.grosswt?.toFixed(2)}</div>
                              </div>
                              <div className="d-flex justify-content-between">
                                <div>NETWT</div>
                                <div>{e?.NetWt?.toFixed(2)}</div>
                              </div>
                            </div>
                            <div className="col7_eib d-flex justify-content-end align-items-center pe-1 border-end border-black">
                              {formatAmount(
                                e?.metal_rate / result?.header?.CurrencyExchRate
                              )}
                            </div>
                            <div className="col8_eib d-flex justify-content-end align-items-center pe-1">
                              {formatAmount(
                                e?.MetalAmount /
                                  result?.header?.CurrencyExchRate
                              )}
                            </div>
                          </div>
                        );
                      })}
                      <div className="d-flex fw-bold border-top border-black">
                        <div className="col1_eib center_eib border-end border-black"></div>
                        <div className="col2_eib ps-1 border-end border-black">
                          TOTAL
                        </div>
                        {/* <div className="col3_eib center_eib border-end border-black"></div> */}
                        {/* <div className="col4_eib center_eib border-end border-black"></div> */}
                        <div className="col5_eib d-flex justify-content-center align-items-center pe-1 border-end border-black">
                          {result?.mainTotal?.Quantity}
                        </div>
                        <div className="col6_eib center_eib border-end border-black"></div>
                        <div className="col7_eib center_eib border-end border-black"></div>
                        <div className="col8_eib d-flex justify-content-end align-items-center pe-1 ">
                          {formatAmount(
                            result?.mainTotal?.MetalAmount /
                              result?.header?.CurrencyExchRate
                          )}
                        </div>
                      </div>
                    </div>
                    <div
                      className="d-flex p-1 ps-1 page_eib"
                    >
                      <div className="toalDiv_1">
                        <div className="fw-bold fs_eib ">
                          TOTAL GROSS WT. IN GMS{" "}
                          {result?.mainTotal?.grosswt?.toFixed(2)}
                        </div>
                        <div className="fw-bold fs_eib ">
                          TOTAL NET WT. IN GMS{" "}
                          {result?.mainTotal?.NetWt?.toFixed(2)}
                        </div>
                        <div className="fw-bold fs_eib pt-1">
                          ALL RATE & INVOICE ARE IN{" "}
                          {result?.header?.CurrencyCode}
                        </div>
                        {/* <div className="fw-bold fs_eib ">Rate of Gold Per Ounce :  {formatAmount((result?.header?.MetalRate24K * 31) / result?.header?.CurrencyExchRate)} (GJE PC)</div> */}
                        <div
                          className="fw-bold fs_eib "
                          style={{ paddingTop: "1px" }}
                        >
                          Rate of Gold Per Ounce :{" "}
                          <input
                            type="text"
                            style={{ border: "1px solid #e8e8e8" }}
                            className="border_remove_eib"
                            value={rateOfGold}
                            onChange={(e) => setRateOfGold(e.target.value)}
                          />
                        </div>
                        {/* <div className="fw-bold fs_eib ">Rate Per Gram : {formatAmount((result?.header?.MetalRate24K / result?.header?.CurrencyExchRate))} (0.995%)</div> */}
                        <div
                          className="fw-bold fs_eib "
                          style={{ paddingTop: "1px" }}
                        >
                          Rate Per Gram :{" "}
                          <input
                            type="text"
                            style={{ border: "1px solid #e8e8e8" }}
                            className="border_remove_eib"
                            value={ratePerGram995}
                            onChange={(e) => setRatePerGram995(e.target.value)}
                          />
                        </div>
                        {/* <div className="fw-bold fs_eib ">Rate Per Gram : {formatAmount((metRate / result?.header?.CurrencyExchRate))} ({tunch?.toFixed(2)}%)</div> */}
                        <div
                          className="fw-bold fs_eib "
                          style={{ paddingTop: "1px" }}
                        >
                          Rate Per Gram :{" "}
                          <input
                            type="text"
                            style={{ border: "1px solid #e8e8e8" }}
                            className="border_remove_eib"
                            value={ratePerGram76}
                            onChange={(e) => setRatePerGram76(e.target.value)}
                          />
                        </div>
                      </div>
                      {/* <div className="toalDiv_2">Labour <span dangerouslySetInnerHTML={{__html:result?.header?.Currencysymbol}}></span> {formatAmountRound(result?.resultArray[0]?.MaKingCharge_Unit)} PG</div> */}
                      <div className="toalDiv_2">
                        Labour{" "}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: result?.header?.Currencysymbol,
                          }}
                        ></span>
                        <input
                          type="text"
                          style={{ border: "1px solid #e8e8e8" }}
                          value={labourVal}
                          className="border_remove_eib"
                          onChange={(e) => setLabourVal(e.target.value)}
                        />
                      </div>
                      <div className="toalDiv_3 border border-black">
                        {diamondCount > 0 && (
                          <div className="d-flex align-items-center">
                            <div className="w-50 ps-1 ">DIAMOND VALUE</div>
                            <div className="w-50 end_ebi pe-1">
                              {formatAmount(
                                result?.mainTotal?.diamonds?.Amount /
                                  result?.header?.CurrencyExchRate
                              )}
                            </div>
                          </div>
                        )}
                        <div className="d-flex align-items-center">
                          <div className="w-50 ps-1 ">MAKING VALUE</div>
                          <div className="w-50 end_ebi pe-1">
                            {formatAmount(
                              result?.mainTotal?.MakingAmount /
                                result?.header?.CurrencyExchRate
                            )}
                          </div>
                        </div>
                        <div className="d-flex align-items-center">
                          <div className="w-50 ps-1 ">
                            FOB {result?.header?.CurrencyCode}{" "}
                          </div>
                          <div className="w-50 end_ebi pe-1">
                            {formatAmount(
                              result?.mainTotal?.MetalAmount /
                                result?.header?.CurrencyExchRate +
                                result?.mainTotal?.diamonds?.Amount /
                                  result?.header?.CurrencyExchRate +
                                result?.mainTotal?.MakingAmount
                            )}
                          </div>
                        </div>
                        <div className="d-flex align-items-center">
                          <div className="w-50 ps-1 ">AIR FRT & INS</div>
                          <div className="w-50 end_ebi pe-1">
                            {formatAmount(
                              result?.header?.FreightCharges /
                                result?.header?.CurrencyExchRate
                            )}
                          </div>
                        </div>
                        <div className="d-flex align-items-center border-top border-black height_total_eib">
                          <div className="w-50 ps-1 d-flex align-items-center h-100 ">
                            Total {result?.header?.Freight_Terms}
                          </div>
                          <div className="w-50 end_ebi pe-1 h-100">
                            {formatAmount(
                              result?.mainTotal?.MetalAmount /
                                result?.header?.CurrencyExchRate +
                                result?.mainTotal?.diamonds?.Amount /
                                  result?.header?.CurrencyExchRate +
                                result?.mainTotal?.MakingAmount +
                                result?.header?.FreightCharges /
                                  result?.header?.CurrencyExchRate
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-top border-bottom border-black p-1 text-break page_eib">
                    {result?.header?.PrintRemark}
                  </div>

                  <div className=" mt-0 border-black border-bottom p-2 pb-1">
                    <span
                      className="fs_sm_ebi "
                      dangerouslySetInnerHTML={{
                        __html: result?.header?.Declaration,
                      }}
                    ></span>
                  </div>

                  <div className="ps-1">
                    Amount Chargeable {result?.header?.CurrencyCode} :{" "}
                    {NumToWord(
                      result?.header?.FreightCharges /
                        result?.header?.CurrencyExchRate +
                        result?.mainTotal?.MetalAmount /
                          result?.header?.CurrencyExchRate +
                        result?.mainTotal?.MakingAmount +
                        result?.mainTotal?.diamonds?.Amount /
                          result?.header?.CurrencyExchRate
                    )}{" "}
                    (in words)
                  </div>
                  <div className="ps-1">
                    GOLD PURCHASE FROM {result?.header?.Advance_Receipt_No}
                  </div>
                  <div className="d-flex justify-content-start align-items-center px-1">
                    <div className="me-1">
                      Invoice Ref :{" "}
                      <input
                        type="text"
                        className="border_remove_eib"
                        style={{
                          minWidth: "200px",
                          border: "1px solid #e8e8e8",
                        }}
                      />
                    </div>
                    <div className="mx-1">
                      Trade Ref :{" "}
                      <input
                        type="text"
                        className="border_remove_eib"
                        style={{
                          minWidth: "200px",
                          border: "1px solid #e8e8e8",
                        }}
                      />
                    </div>
                    <div className="mx-1">
                      Date :{" "}
                      <input
                        type="text"
                        className="border_remove_eib"
                        style={{
                          minWidth: "200px",
                          border: "1px solid #e8e8e8",
                        }}
                      />
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center px-1">
                    <div style={{ width: "39.33%" }} className="fw-semibold">
                      {" "}
                      {result?.header?.E_Reference_No}
                    </div>
                    <div style={{ width: "30.33%" }} className="fw-semibold">
                      RATE :{" "}
                      {formatAmount(
                        result?.header?.MetalRate24K /
                          result?.header?.CurrencyExchRate
                      )}
                    </div>
                    <div style={{ width: "30.33%" }} className="fw-semibold">
                      PER Toz FOR 0.999 FINE GOLD
                    </div>
                  </div>

                  <div className="page_eib">
                    <div className="d-flex border border-black border-start-0 border-end-0 fw-semibold ">
                      <div className="gcol1_eib center_eib border-end border-black">
                        Gold
                      </div>
                      <div className="gcol2_eib center_eib border-end border-black">
                        Gold
                      </div>
                      <div className="gcol3_eib center_eib border-end border-black">
                        Gold wstg
                      </div>
                      <div className="gcol4_eib center_eib border-end border-black">
                        Total Gold
                      </div>
                      <div className="gcol5_eib center_eib border-end border-black">
                        Gold
                      </div>
                      <div className="gcol6_eib center_eib border-end border-black">
                        Gold
                      </div>
                      <div className="gcol7_eib center_eib border-end border-black">
                        Gold 24K
                      </div>
                      <div className="gcol8_eib center_eib border-end border-black">
                        Net Gold
                      </div>
                      <div className="gcol9_eib center_eib border-end border-black">
                        Wastage
                      </div>
                      <div className="gcol10_eib center_eib border-end border-black">
                        Total
                      </div>
                      <div className="gcol11_eib center_eib border-end border-black">
                        Making
                      </div>
                      <div className="gcol12_eib center_eib border-end border-black">
                        Stone
                      </div>
                      <div className="gcol13_eib center_eib border-end border-black">
                        Kedia
                      </div>
                      <div className="gcol14_eib center_eib border-end border-black">
                        Diamond
                      </div>
                      <div className="gcol15_eib center_eib  border-end border-black">
                        Dia.
                      </div>
                      <div className="gcol16_eib center_eib  ">Diamond</div>
                    </div>

                    <div className="d-flex border border-black border-start-0 border-top-0 border-end-0">
                      <div className="gcol1_eib center_eib border-end border-black">
                        KT
                      </div>
                      <div className="gcol2_eib center_eib border-end border-black">
                        NT WT
                      </div>
                      <div className="gcol3_eib center_eib border-end border-black">
                        {/* 5% */}
                        {(avgLossPer)?.toFixed(2)}%
                      </div>
                      <div className="gcol4_eib center_eib border-end border-black">
                        Wt GMS
                      </div>
                      <div className="gcol5_eib center_eib border-end border-black">
                        Rate IN
                      </div>
                      <div className="gcol6_eib center_eib border-end border-black">
                        Value{" "}
                      </div>
                      <div className="gcol7_eib center_eib border-end border-black">
                        nt+wst Pure
                      </div>
                      <div className="gcol8_eib center_eib border-end border-black">
                        Fine.999
                      </div>
                      <div className="gcol9_eib center_eib border-end border-black">
                        Gold-0.999
                      </div>
                      <div className="gcol10_eib center_eib border-end border-black">
                        Gold 0.999
                      </div>
                      <div className="gcol11_eib center_eib border-end border-black">
                        Chrgs
                      </div>
                      <div className="gcol12_eib center_eib border-end border-black">
                        type
                      </div>
                      <div className="gcol13_eib center_eib border-end border-black">
                        Wt Grms
                      </div>
                      <div className="gcol14_eib center_eib border-end border-black">
                        wt cts
                      </div>
                      <div className="gcol15_eib center_eib border-end border-black">
                        Pcs
                      </div>
                      <div className="gcol16_eib center_eib">Value</div>
                    </div>
                    <div className="d-flex border border-black border-start-0 border-top-0 border-end-0">
                      <div className="gcol1_eib center_eib border-end border-black"></div>
                      <div className="gcol2_eib center_eib border-end border-black">
                        Gms
                      </div>
                      <div className="gcol3_eib center_eib border-end border-black">
                        Gms
                      </div>
                      <div className="gcol4_eib center_eib border-end border-black">
                        nt + wstg
                      </div>
                      <div className="gcol5_eib center_eib border-end border-black">
                        {result?.header?.CurrencyCode}
                      </div>
                      <div className="gcol6_eib center_eib border-end border-black">
                        {result?.header?.CurrencyCode}
                      </div>
                      <div className="gcol7_eib center_eib border-end border-black">
                        Gms
                      </div>
                      <div className="gcol8_eib center_eib border-end border-black">
                        Gms
                      </div>
                      <div className="gcol9_eib center_eib border-end border-black">
                        Gms
                      </div>
                      <div className="gcol10_eib center_eib border-end border-black">
                        NT + wst gms
                      </div>
                      <div className="gcol11_eib center_eib border-end border-black">
                        {result?.header?.CurrencyCode}
                      </div>
                      <div className="gcol12_eib center_eib border-end border-black"></div>
                      <div className="gcol13_eib center_eib border-end border-black"></div>
                      <div className="gcol14_eib center_eib border-end border-black"></div>
                      <div className="gcol15_eib center_eib border-end border-black"></div>
                      <div className="gcol16_eib center_eib">
                        {result?.header?.CurrencyCode}
                      </div>
                    </div>
                    {metalTypeWise?.map((e, i) => {
                      return (
                        <div
                          className="d-flex border border-black border-start-0 border-top-0 border-end-0 page_eib"
                          key={i}
                        >
                          <div className="gcol1_eib border-end border-black ps-1">
                            {e?.MetalPurity}
                          </div>
                          <div className="gcol2_eib end_ebi border-end border-black pe-1">
                            {e?.NetWt?.toFixed(3)}
                          </div>
                          <div className="gcol3_eib end_ebi border-end border-black pe-1">
                            {e?.LossWt?.toFixed(3)}
                            {/* {((avgLossPer * result?.mainTotal?.NetWt) / 100)?.toFixed(3)} */}
                          </div>
                          <div className="gcol4_eib end_ebi border-end border-black pe-1">
                            {(e?.NetWt + e?.LossWt)?.toFixed(3)}
                          </div>
                          <div className="gcol5_eib end_ebi border-end border-black pe-1">
                            {formatAmount(
                              e?.metal_rate / result?.header?.CurrencyExchRate
                            )}
                          </div>
                          <div className="gcol6_eib end_ebi border-end border-black pe-1">
                            {formatAmount(
                              e?.MetalAmount / result?.header?.CurrencyExchRate
                            )}
                          </div>
                          <div className="gcol7_eib end_ebi border-end border-black pe-1">
                            {e?.PureNetWt?.toFixed(3)}
                          </div>
                          <div className="gcol8_eib end_ebi border-end border-black pe-1">
                            {((e?.NetWt / 99.9) * 100)?.toFixed(3)}
                          </div>
                          <div className="gcol8_eib end_ebi border-end border-black pe-1">
                            {((e?.LossWt / 99.9) * 100)?.toFixed(3)}
                          </div>
                          <div className="gcol10_eib end_ebi  border-end border-black pe-1">
                            {(
                              (e?.NetWt / 99.9) * 100 +
                              (e?.LossWt / 99.9) * 100
                            )?.toFixed(3)}
                          </div>
                          <div className="gcol11_eib end_ebi border-end border-black pe-1">
                            {formatAmount(e?.MakingAmount)}
                          </div>
                          <div className="gcol12_eib border-end border-black pe-1">
                            {e?.diamonds?.length > 0 ? "Dia" : ""}
                          </div>
                          <div className="gcol13_eib border-end border-black pe-1"></div>
                          <div className="gcol14_eib end_ebi border-end border-black pe-1">
                            {e?.totals?.diamonds?.Wt?.toFixed(3)}
                          </div>
                          <div className="gcol15_eib end_ebi border-end border-black pe-1">
                            {e?.totals?.diamonds?.Pcs}
                          </div>
                          <div className="gcol16_eib end_ebi pe-1">
                            {formatAmount(
                              e?.totals?.diamonds?.Amount /
                                result?.header?.CurrencyExchRate
                            )}
                          </div>
                        </div>
                      );
                    })}
                    <div className="d-flex border border-black border-start-0 border-top-0 border-end-0">
                      <div className="gcol1_eib center_eib border-end border-black">
                        &nbsp;
                      </div>
                      <div className="gcol2_eib center_eib border-end border-black"></div>
                      <div className="gcol3_eib center_eib border-end border-black"></div>
                      <div className="gcol4_eib center_eib border-end border-black"></div>
                      <div className="gcol5_eib center_eib border-end border-black"></div>
                      <div className="gcol6_eib center_eib border-end border-black"></div>
                      <div className="gcol7_eib center_eib border-end border-black"></div>
                      <div className="gcol8_eib center_eib border-end border-black"></div>
                      <div className="gcol9_eib center_eib border-end border-black"></div>
                      <div className="gcol10_eib center_eib border-end border-black"></div>
                      <div className="gcol11_eib center_eib border-end border-black"></div>
                      <div className="gcol12_eib center_eib border-end border-black"></div>
                      <div className="gcol13_eib center_eib border-end border-black"></div>
                      <div className="gcol14_eib center_eib border-end border-black"></div>
                      <div className="gcol15_eib center_eib border-end border-black"></div>
                      <div className="gcol16_eib center_eib"></div>
                    </div>
                    <div className="d-flex border border-black border-start-0 border-top-0 border-end-0 fw-bold">
                      <div className="gcol1_eib border-end border-black ps-1"></div>
                      <div className="gcol2_eib end_ebi border-end border-black pe-1">
                        {result?.mainTotal?.NetWt?.toFixed(3)}
                      </div>
                      <div className="gcol3_eib end_ebi border-end border-black pe-1">
                        {result?.mainTotal?.LossWt?.toFixed(3)}
                      </div>
                      <div className="gcol4_eib end_ebi border-end border-black pe-1">
                        {(
                          result?.mainTotal?.NetWt + result?.mainTotal?.LossWt
                        )?.toFixed(3)}
                      </div>
                      <div className="gcol5_eib end_ebi border-end border-black pe-1"></div>
                      <div className="gcol6_eib end_ebi border-end border-black pe-1">
                        {formatAmount(
                          result?.mainTotal?.MetalAmount /
                            result?.header?.CurrencyExchRate
                        )}
                      </div>
                      <div className="gcol7_eib end_ebi border-end border-black pe-1">
                        {result?.mainTotal?.PureNetWt?.toFixed(3)}
                      </div>
                      <div className="gcol8_eib end_ebi border-end border-black pe-1">
                        {((result?.mainTotal?.NetWt / 99.9) * 100)?.toFixed(3)}
                      </div>
                      <div className="gcol8_eib end_ebi border-end border-black pe-1">
                        {((result?.mainTotal?.LossWt / 99.9) * 100)?.toFixed(3)}
                      </div>
                      <div className="gcol10_eib end_ebi  border-end border-black pe-1">
                        {(
                          (result?.mainTotal?.NetWt / 99.9) * 100 +
                          (result?.mainTotal?.LossWt / 99.9) * 100
                        )?.toFixed(3)}
                      </div>
                      <div className="gcol11_eib end_ebi border-end border-black pe-1">
                        {formatAmount(result?.mainTotal?.MakingAmount)}
                      </div>
                      <div className="gcol12_eib border-end border-black pe-1"></div>
                      <div className="gcol13_eib border-end border-black pe-1"></div>
                      <div className="gcol14_eib end_ebi border-end border-black pe-1">
                        {result?.mainTotal?.diamonds?.Wt?.toFixed(3)}
                      </div>
                      <div className="gcol15_eib end_ebi border-end border-black pe-1">
                        {result?.mainTotal?.diamonds?.Pcs}
                      </div>
                      <div className="gcol16_eib end_ebi pe-1">
                        {formatAmount(
                          result?.mainTotal?.diamonds?.Amount /
                            result?.header?.CurrencyExchRate
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-start mt-1  page_eib">
                    <div className="w-50 ">
                      <div className="fs_eib ps-4">
                        We Shall file any claim against this invoice under
                        RoDTEP scheme and hipping bill for this <br /> invoice
                        is filed with custom icegate info code as ROOTEPY If
                        applicable as per Notification
                      </div>
                      <br />
                      <div className="fs_eib ps-1">
                        Declaration: <br /> We declare that this invoice shows
                        the actual price of the goods <br /> described and that
                        all particulars are true and correct
                      </div>
                    </div>
                    <div className="w-25 ps-1 fs_eib border-start border-black signBox_eib border-top fw-semibold">
                      Signature & Date
                    </div>
                  </div>
                </div>
              </div>
              <div className="fivecm_ebi2"></div>
            </div>
          ) : (
            <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
              {" "}
              {msg}{" "}
            </p>
          )}
        </>
      )}
    </>
  );
};

export default ExportInvoiceB;
