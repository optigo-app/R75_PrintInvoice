import React, { useEffect, useState } from "react";
import {
  FooterComponent,
  HeaderComponent,
  NumberWithCommas,
  apiCall,
  checkMsg,
  fixedValues,
  handlePrint,
  isObjectEmpty,
} from "../../GlobalFunctions";
import Loader from "../../components/Loader";
import style from "../../assets/css/prints/TaxInvoice5.module.css";
import "../../assets/css/prints/taxinvoice5a.css";
import  style3 from "../../assets/css/prints/taxinvoice5a.module.css";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";
import { ToWords } from "to-words";
import style2 from "../../assets/css/headers/header1.module.css";
import { cloneDeep } from "lodash";

const TaxInvoice5A = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {
  const [loader, setLoader] = useState(true);
  const [msg, setMsg] = useState("");
  const [data, setData] = useState([]);
  const [header, setHeader] = useState(null);
  const [footer, setFooter] = useState(null);
  const [address, setAddress] = useState([]);
  const [headerData, setHeaderData] = useState({});
  const [image, setImage] = useState(true);
  const [pnm, setPnm] = useState(atob(printName).toLowerCase());
  const toWords = new ToWords();
  const [isImageWorking, setIsImageWorking] = useState(true);
  const handleImageErrors = () => {
    setIsImageWorking(false);
  };
  const loadData = (data) => {
    let head = HeaderComponent("1", data?.BillPrint_Json[0]);
    setHeader(head);
    setHeaderData(data?.BillPrint_Json[0]);
    let adr = data?.BillPrint_Json[0]?.Printlable.split(`\r\n`);
    setAddress(adr);
    setFooter(FooterComponent("2", data?.BillPrint_Json[0]));
    let datas = OrganizeDataPrint(
      data?.BillPrint_Json[0],
      data?.BillPrint_Json1,
      data?.BillPrint_Json2
    );
    let resultArr = [];
    let primaryWts = 0;
    datas?.resultArray.forEach((e, i) => {
      if (e?.GroupJob === "") {
        let obj = cloneDeep(e);
        obj.primaryWt = 0;
        if (obj?.metal?.length <= 1) {
          obj.primaryWt = e?.NetWt + e?.LossWt;
        } else {
          obj.primaryWt = e?.metal?.reduce((acc, cObj) => cObj?.IsPrimaryMetal === 1 ? acc + cObj?.Wt : acc, 0);
        }
        primaryWts += obj?.primaryWt;
        obj.srjobno = e?.SrJobno?.split("/");
        resultArr.push(obj);
      } else {
        let findRecord = resultArr.findIndex(
          (elem, index) =>
            elem?.GroupJob === e?.GroupJob && elem?.GroupJob !== ""
        );
        if (findRecord === -1) {
          let obj = cloneDeep(e);
          obj.srjobno = e?.SrJobno?.split("/");
          obj.primaryWt = 0;
          if (obj?.metal?.length <= 1) {
            obj.primaryWt = e?.NetWt + e?.LossWt;
          } else {
            obj.primaryWt = e?.metal?.reduce((acc, cObj) => cObj?.IsPrimaryMetal === 1 ? acc + cObj?.Wt : acc, 0);
          }
          primaryWts += obj?.primaryWt;
          resultArr.push(obj);
        } else {
          let obj = cloneDeep(e);
          obj.primaryWt = 0;
          if (obj?.metal?.length <= 1) {
            obj.primaryWt = e?.NetWt + e?.LossWt;
          } else {
            obj.primaryWt = e?.metal?.reduce((acc, cObj) => cObj?.IsPrimaryMetal === 1 ? acc + cObj?.Wt : acc, 0);
          }
          if (e?.GroupJob === e?.SrJobno) {
            resultArr[findRecord].MetalPurity = e?.MetalPurity;
            resultArr[findRecord].JewelCodePrefix = e?.JewelCodePrefix;
            resultArr[findRecord].designno = e?.designno;
            resultArr[findRecord].SrJobno = e?.SrJobno;
          }
          resultArr[findRecord].primaryWt += obj.primaryWt;
          primaryWts += obj?.primaryWt;
          resultArr[findRecord].grosswt += e?.grosswt;
          resultArr[findRecord].NetWt += e?.NetWt;
          resultArr[findRecord].totals.diamonds.Wt += e?.totals?.diamonds?.Wt;
          resultArr[findRecord].totals.colorstone.Wt +=
            e?.totals?.colorstone?.Wt;
          resultArr[findRecord].TotalAmount += e?.TotalAmount;
        }
      }
    });
    datas.mainTotal.primaryWts = primaryWts;
    datas.resultArray = resultArr;
    // datas?.resultArray?.sort((a, b) => {
      
    //   var nameA = a?.JewelCodePrefix?.toUpperCase() + a?.Category_Prefix?.toUpperCase() + a?.srjobno[1]?.toUpperCase();
    //   var nameB = b?.JewelCodePrefix?.toUpperCase() + b?.Category_Prefix?.toUpperCase() + b?.srjobno[1]?.toUpperCase();
      
    //   const prefixA = nameA?.match(/[A-Za-z]+/)[0];
    //   const prefixB = nameB?.match(/[A-Za-z]+/)[0];
    //   const numericA = parseInt(nameA?.match(/\d+/)[0]);
    //   const numericB = parseInt(nameB?.match(/\d+/)[0]);

    //   // Compare prefixes first
    //   if (prefixA < prefixB) return -1;
    //   if (prefixA > prefixB) return 1;

    //   // If prefixes are the same, compare numeric parts
    //   return numericA - numericB;
    // });
    datas?.resultArray?.sort((a, b) => {
      // Safely access the values, ensuring they exist
      var nameA = a?.JewelCodePrefix?.toUpperCase() + a?.Category_Prefix?.toUpperCase() + (a?.srjobno[1]?.toUpperCase() || '');
      var nameB = b?.JewelCodePrefix?.toUpperCase() + b?.Category_Prefix?.toUpperCase() + (b?.srjobno[1]?.toUpperCase() || '');
    
      // Safely match the prefixes
      const prefixA = nameA?.match(/[A-Za-z]+/)?.[0] || ''; // Provide a default value if no match
      const prefixB = nameB?.match(/[A-Za-z]+/)?.[0] || ''; // Provide a default value if no match
    
      // Safely extract numeric parts
      const numericA = parseInt(nameA?.match(/\d+/)?.[0] || 0); // Provide 0 if no match
      const numericB = parseInt(nameB?.match(/\d+/)?.[0] || 0); // Provide 0 if no match
    
      // Compare prefixes first
      if (prefixA < prefixB) return -1;
      if (prefixA > prefixB) return 1;
    
      // If prefixes are the same, compare numeric parts
      return numericA - numericB;
    });
    
    setData(datas);
  };

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
  }, []);

  // console.log("address", address);
  console.log("headerData", headerData);
  
  return loader ? (
    <Loader />
  ) : msg === "" ? (
    <div
      className={`container container-fluid  mt-1 taxInv5A pad_60_allPrint`}
    >
      {/* buttons */}
      <div
        className={`d-flex justify-content-end align-items-center ${style?.print_sec_sum4} mb-4`}
      >
        <div className="form-check ps-3">
          <input
            type="button"
            className="btn_white blue py-2 mt-2"
            value="Print"
            onClick={(e) => handlePrint(e)}
          />
        </div>
      </div>
      {/* header */}
      <div className={`px-2 pb-1 d-flex justify-content-center ti5aheadline`} style={{  fontWeight: "700", textDecoration: "underline #000 3px" }}>{headerData?.PrintHeadLabel}</div>
      <div className={`h1tinvp5a  `}>
        <div className={`companyheadtinvp5a  p-2 d-flex justify-content-center`}>
          <div className={` d-flex justify-content-center companyNametp5a lh_ti5a`} style={{ fontWeight: "bold" }}>
            {headerData?.CompanyFullName}
          </div>
          <div className={` d-flex justify-content-center`}> <span className="fw-bold">Address : &nbsp;</span> {headerData?.CompanyAddress + " " + headerData?.CompanyAddress2}</div>
          <div className={` d-flex justify-content-center`}>{headerData?.CompanyCity}-{headerData?.CompanyPinCode},{headerData?.CompanyState}({headerData?.CompanyCountry})</div>
          <div className={`px-1 fw-bold d-flex justify-content-center`} >
            {headerData?.Company_VAT_GST_No} | {headerData?.Company_CST_STATE}-{headerData?.Company_CST_STATE_No} | PAN-{headerData?.Pannumber}
          </div>
        </div>
      </div>
      {/* sub header */}
      <div className="d-flex border border-black ">
        <div className="col-5 border-end border-black p-2">
          <p className=" companyNametp5a2">{headerData?.lblBillTo}</p>
          <p className={`fw-semibold companyNametp5a`}>{headerData?.CustName}</p>
          <p className=" companyNametp5a2">{headerData?.customerAddress1}</p>
          <p className=" companyNametp5a2">{headerData?.customerAddress2}</p>
          <p className=" companyNametp5a2">
            {headerData?.customercity1}
            {headerData?.customerpincode}
          </p>
          <p className=" companyNametp5a2">{headerData?.Cust_CST_STATE_No_?.replaceAll(",", " | ")}</p>
          <p className=" companyNametp5a2">{headerData?.vat_cst_pan}</p>
        </div>
        <div className="col-4 border-end border-black p-2">
          <p className="companyNametp5a2">Ship To,</p>
          <p className={`fw-semibold companyNametp5a`}>{headerData?.CustName}</p>
          <p className="companyNametp5a2" dangerouslySetInnerHTML={{ __html: headerData?.Printlable?.replace(/\n/g, '<br />') }} />
        </div>
        <div className="col-3 p-2">
          <p className="d-flex">
            <span className="col-6 fw-semibold companyNametp5a2 pe-2">INVOICE NO	 </span>{" "}
            <span className="col-6 companyNametp5a2">: {headerData?.InvoiceNo}</span>
          </p>
          <p className="d-flex">
            <span className="col-6 companyNametp5a2 fw-semibold pe-2">DATE </span>{" "}
            <span className="col-6 companyNametp5a2">: {headerData?.EntryDate}</span>
          </p>
          <p className="d-flex">
            <span className="col-6 companyNametp5a2 fw-semibold pe-2">{headerData?.HSN_No_Label} </span>
            <span className="col-6 companyNametp5a2">: {headerData?.HSN_No}</span>
          </p>
          <p className="d-flex">
            <span className="col-6 companyNametp5a2 fw-semibold pe-2">TERMS </span>
            <span className="col-6 companyNametp5a2">: {headerData?.DueDays} Days</span>
          </p>
        </div>
      </div>
      {/* table Header */}
      <div className="d-flex  border border-top-0 border-black">
        <div className={`${style3?.Sr}  py-1 border-end border-black`}>
          <p className="text-center fw-bold companyNametp5a2 text-break">Sr. No. </p>
        </div>
        <div className={`${style3?.Jewel}  py-1 border-end border-black`}>
          <p className="text-center fw-bold companyNametp5a2 text-break">Jewel Code </p>
        </div>
        <div className={`${style3?.KT}  py-1 border-end border-black`}>
          <p className="text-center fw-bold companyNametp5a2">KT </p>
        </div>
        {pnm === "tax invoice 6" && (
          <div className={`${style3?.Diamond}  py-1 border-end border-black`}>
            <p className="text-center fw-bold companyNametp5a2">HSN </p>
          </div>
        )}
        <div className={`${style3?.Gross}  py-1 border-end border-black`}>
          <p className="text-center fw-bold companyNametp5a2 text-break">Gross Wt <br /> <span className="fw-normal companyNametp5a2">(in gm)</span> </p>
        </div>
        <div className={`${style3?.Net}  py-1 border-end border-black`}>
          <p className="text-center fw-bold companyNametp5a2">Net Wt <br /> <span className="fw-normal companyNametp5a2">(in gm)</span> </p>
        </div>
        {pnm !== "tax invoice 6" && (
          <div className={`${style3?.Diamond}  py-1 border-end border-black`}>
            <p className="text-center fw-bold companyNametp5a2">Diamond <br /> <span className="fw-normal companyNametp5a2">(in ct)</span> </p>
          </div>
        )}
        <div className={`${style3?.Stone}  py-1 border-end border-black`}>
          <p className="text-center fw-bold companyNametp5a2">Stone <br /> <span className="fw-normal companyNametp5a2">(in ct)</span> </p>
        </div>
        <div className={`${style3?.Discount} py-1 border-end border-black`}>
          <p className="text-center fw-bold companyNametp5a2">Discount</p>
        </div>
        <div className={`${style3?.Price} py-1 `}>
          <p className="text-center fw-bold companyNametp5a2">Price</p>
        </div>
      </div>
      {/* table data */}
      {data?.resultArray?.map((e, i) => {
        return (
          <div className="d-flex border-start border-end border-bottom border-black no_break" key={i}>
            <div className={`${style3?.Sr} border-black border-end`}>
              <p className="text-center p-1 companyNametp5a2">{i + 1}</p>
            </div>
            <div className={`${style3?.Jewel} border-end border-black ${style?.word_break}`}>
              <p className="p-1 companyNametp5a2">
                
                {e?.JewelCodePrefix}
                {e?.Category_Prefix?.slice(0, 2)}
                {e?.srjobno[1]}
              </p>
            </div>
            <div className={`${style3?.KT} border-end border-black text-center`}>
              <p className="p-1 companyNametp5a2">{e?.MetalType?.toLowerCase() !== "gold" && e?.MetalType} {e?.MetalPurity} </p>
            </div>
            {pnm === "tax invoice 6" && (
              <div className={`${style3?.Diamond} border-end border-black`}>
                <p className="p-1 companyNametp5a2">{headerData?.HSN_No}</p>
              </div>
            )}
            <div className={`${style3?.Gross} border-end border-black`}>
              <p className="text-end p-1 companyNametp5a2">{NumberWithCommas(e?.grosswt, 3)}</p>
            </div>
            <div className={`${style3?.Net} border-end border-black`}>
              <p className="text-end p-1 companyNametp5a2">
                {NumberWithCommas(e?.primaryWt, 3)}
              </p>
            </div>
            {pnm !== "tax invoice 6" && (
              <div className={`${style3?.Diamond} border-end border-black`}>
                <p className="text-end p-1 companyNametp5a2">
                  {NumberWithCommas(e?.totals?.diamonds?.Wt, 3)}
                </p>
              </div>
            )}
            <div className={`${style3?.Stone} border-end border-black`}>
              <p className="text-end p-1 companyNametp5a2">
                {NumberWithCommas(e?.totals?.colorstone?.Wt, 3)}{" "}
              </p>
            </div>
            <div className={`${style3?.Discount} border-end border-black`}>
              <div className="text-end p-1 companyNametp5a2">
                { e?.DiamondDiscountAmount !== 0 && <div>Dia : {NumberWithCommas(e?.DiamondDiscountAmount / headerData?.CurrencyExchRate, 2)}</div>}
                { e?.StoneDiscountAmount !== 0 && <div>Cs : {NumberWithCommas(e?.StoneDiscountAmount / headerData?.CurrencyExchRate, 2)}{" "}</div>}
              </div>
            </div>
            <div className={`${style3?.Price}`}>
              <p className="text-end p-1 companyNametp5a2">
                {NumberWithCommas(e?.TotalAmount / headerData?.CurrencyExchRate, 2)}{" "}
              </p>
            </div>
          </div>
        );
      })}
      {/* table total */}
      <div className="d-flex border-start border-end border-bottom no_break border-black">
        <div className={`${style3?.Sr} border-end border-black`}>
          <p className="text-center p-1"></p>
        </div>
        <div className={`${style3?.Jewel} border-end border-black`}>
          <p className="p-1 fw-bold companyNametp5a2">TOTAL</p>
        </div>
        <div className={`${style3?.KT} border-end border-black`}>
          <p className="p-1"> </p>
        </div>
        {pnm === "tax invoice 6" && (
          <div className={`${style3?.Diamond} border-end border-black`}>
            <p className="text-end p-1"></p>
          </div>
        )}
        <div className={`${style3?.Gross} border-end border-black`}>
          <p className="text-end p-1 fw-bold companyNametp5a2">
            {NumberWithCommas(data?.mainTotal?.grosswt, 3)}
          </p>
        </div>
        <div className={`${style3?.Net} border-end border-black`}>
          <p className="text-end p-1 fw-bold companyNametp5a2">
            {NumberWithCommas(data?.mainTotal?.primaryWts, 3)}
          </p>
        </div>
        {pnm !== "tax invoice 6" && <div className={`${style3?.Diamond} border-end border-black`}>
          <p className="text-end p-1 fw-bold companyNametp5a2">
            {NumberWithCommas(data?.mainTotal?.diamonds?.Wt, 3)}
          </p>
        </div>}
        <div className={`${style3?.Stone} border-end border-black`}>
          <p className="text-end p-1 fw-bold companyNametp5a2">
            {NumberWithCommas(data?.mainTotal?.colorstone?.Wt, 3)}
          </p>
        </div>
        <div className={`${style3?.Discount} border-end border-black`}>
          <p className="text-end p-1 fw-bold companyNametp5a2">
            {NumberWithCommas(data?.mainTotal?.total_discount_amount / headerData?.CurrencyExchRate, 2)}
          </p>
        </div>
        <div className={`${style3?.Price}`}>
          <p className="text-end p-1 fw-bold companyNametp5a2">
            {NumberWithCommas(data?.mainTotal?.total_amount / headerData?.CurrencyExchRate, 2)}
          </p>
        </div>
      </div>
      {/* In Words */}
      <div className="d-flex border-start border-end border-bottom border-black no_break">
        <div className={`${style?.words} border-end p-1 d-flex justify-content-end flex-column border-black companyNametp5a2`} >
          <p className="companyNametp5a2">In Words (Indian Rupees)</p>
          <p className="fw-bold companyNametp5a2 text-break">
            {toWords.convert(+fixedValues((data?.mainTotal?.total_amount / headerData?.CurrencyExchRate) + data?.allTaxes?.reduce((acc, cObj) => acc + +cObj?.amount, 0) + (headerData?.FreightCharges / headerData?.CurrencyExchRate) + (headerData?.AddLess/ headerData?.CurrencyExchRate), 2))} Only
          </p>
        </div>
        <div className={`${style?.grandTotal}`}>
          <div className="d-flex">
            <div className={`${style?.grandTotalWord} text-end border-end border-black p-1`}>
              {data?.allTaxes?.map((e, i) => {
                return ( <p key={i} className={`companyNametp5a2`}> {e?.name} @ {e?.per} </p> );
              })}
              {headerData?.ModeOfDel !== '' && (
                <p className={`companyNametp5a2`}>{headerData?.ModeOfDel}</p>
              )}
              {headerData?.AddLess !== 0 && (
                <p className={`companyNametp5a2`}>{headerData?.AddLess > 0 ? "Add" : "Less"}</p>
              )}
            </div>
            <div className={`${style?.grandTotalValue} p-1 text-end`}>
              {data?.allTaxes.map((e, i) => {
                return <p key={i} className={`companyNametp5a2`}>{NumberWithCommas(e?.amount, 2)}</p>;
              })}
              {headerData?.FreightCharges !== 0 && (
                <p className={`companyNametp5a2`}>{NumberWithCommas(headerData?.FreightCharges / headerData?.CurrencyExchRate, 2)}</p>
              )}
              {headerData?.AddLess !== 0 && (
                <p className={`companyNametp5a2`}>{NumberWithCommas(headerData?.AddLess / headerData?.CurrencyExchRate, 2)}</p>
              )}
            </div>
          </div>
          <div className="d-flex border-top border-black">
            <div className={`${style?.grandTotalWord} text-end border-end companyNametp5a2 border-black p-1`}>
              <p className="fw-bold companyNametp5a2">GRAND TOTAL</p>
            </div>
            <div className={`${style?.grandTotalValue} p-1 companyNametp5a2 text-end`}>
              <p className="fw-bold companyNametp5a2">{NumberWithCommas((data?.mainTotal?.total_amount / headerData?.CurrencyExchRate) + (headerData?.FreightCharges / headerData?.CurrencyExchRate) + data?.allTaxes?.reduce((acc, cObj) => acc + +cObj?.amount, 0) + (headerData?.AddLess/ headerData?.CurrencyExchRate), 2)}</p>
            </div>
          </div>
        </div>
      </div>
      {/* remarks */}
      <div className="border-start border-end border-bottom p-2 no_break border-black">
        <p className="fw-bold companyNametp5a2">REMARKS : </p>
        <p className="companyNametp5a2" dangerouslySetInnerHTML={{__html:headerData?.PrintRemark}}></p>
      </div>
      
      {/* declaration */}
      <div className={`border-start border-end border-bottom border-black p-2 no_break ${style?.declti}`} dangerouslySetInnerHTML={{ __html: headerData?.Declaration }}></div>

      {/* footer */}
      <div className="d-flex border-start border-end border-bottom no_break border-black">
        <div style={{ width: "30%" }} className="border-end p-2 d-flex flex-column justify-content-between border-black">
          <p className="companyNametp5a2">Signature</p>
          <p>
            <span className="fw-bold companyNametp5a2">{headerData?.CustName}</span>
            <span className={`${style?.sup} companyNametp5a2`}></span> (With Stamp)
          </p>
        </div>
        <div style={{ width: "40%" }} className="border-end border-black p-2 ">
          <p className="fw-bold companyNametp5a2">Bank Detail</p>
          <div className="d-flex">
            <p className="col-4 companyNametp5a2">Account Name</p>
            <p className="col-8 companyNametp5a2">: {headerData?.accountname}</p>
          </div>
          <div className="d-flex">
            <p className="col-4 companyNametp5a2">Bank Name</p>
            <p className="col-8 companyNametp5a2">: {headerData?.bankname}</p>
          </div>
          <div className="d-flex">
            <p className="col-4 companyNametp5a2">Branch </p>
            <p className="col-8 companyNametp5a2">: {headerData?.bankaddress}</p>
          </div>
          <div className="d-flex">
            <p className="col-4 companyNametp5a2">Account No.  </p>
            <p className="col-8 companyNametp5a2">: {headerData?.accountnumber}</p>
          </div>
          <div className="d-flex">
            <p className="col-4 companyNametp5a2">RTGS/NEFT IFSC</p>
            <p className="col-8 companyNametp5a2">: {headerData?.rtgs_neft_ifsc}</p>
          </div>
        </div>
        <div style={{ width: "30%" }} className="p-2 d-flex flex-column justify-content-between border-black">
          <p className="companyNametp5a2">Signature</p>
          <p className="fw-bold companyNametp5a2">{headerData?.CompanyFullName}</p>
        </div>
      </div>
      
    </div>
  ) : (
    <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
      {msg}
    </p>
  );
};

export default TaxInvoice5A;

