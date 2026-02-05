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
import style from "../../assets/css/prints/TaxInvoicePrint4.module.css";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";
import { ToWords } from "to-words";
import style2 from "../../assets/css/headers/header1.module.css";
import footerStyle from "../../assets/css/footers/footer2.module.css";
import { cloneDeep } from "lodash";

const TaxInvoicePrint4 = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {
  const [loader, setLoader] = useState(true);
  const [msg, setMsg] = useState("");
  const [data, setData] = useState([]);
  const [header, setHeader] = useState(null);
  const [footer, setFooter] = useState(null);
  const [address, setAddress] = useState([]);
  const [headerData, setHeaderData] = useState({});
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
    datas.mainTotal.diaRmWt = 0;
    datas?.resultArray?.forEach((e, i) => {
      e.diaRmWt = e?.diamonds?.reduce((acc, cObj) => acc + cObj?.RMwt, 0);
      datas.mainTotal.diaRmWt += e?.diaRmWt;
      e.csRmWt = e?.colorstone?.reduce((acc, cObj) => acc + cObj?.RMwt, 0);
      datas.mainTotal.csRmWt += e?.csRmWt;
    });
    datas?.resultArray.sort((a, b) => {
      var nameA = a.designno.toUpperCase(); // Convert names to uppercase for case-insensitive comparison
      var nameB = b.designno.toUpperCase();

      if (nameA < nameB) {
        return -1; // A should come before B
      }
      if (nameA > nameB) {
        return 1; // A should come after B
      }
      return 0; // Names are equal
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

  return loader ? (
    <Loader />
  ) : msg === "" ? (
    <div
      className={`container container-fluid max_width_container mt-1 ${style?.taxinvoiceprint4} pad_60_allPrint`}
    >
      {/* buttons */}
      <div
        className={`d-flex justify-content-end align-items-center ${style?.print_sec_sum4} mb-4`}
      >
        <div className="form-check ps-3">
          <input
            type="button"
            className="btn_white blue  mt-2"
            value="Print"
            onClick={(e) => handlePrint(e)}
          />
        </div>
      </div>
      {/* header */}
      <div className={`${style2.headline} headerTitle`}>{headerData?.PrintHeadLabel}</div>
      <div className={style2.companyDetails}>
        <div className={`${style2.companyhead} p-2`}>
          <div className={`${style2.lines} ${style?.font_16}`} style={{ fontWeight: "bold" }}>
            {headerData?.CompanyFullName}
          </div>
          <div className={style2.lines}>{headerData?.CompanyAddress}</div>
          <div className={style2.lines}>{headerData?.CompanyAddress2}</div>
          <div className={style2.lines}>{headerData?.CompanyCity}-{headerData?.CompanyPinCode},{headerData?.CompanyState}({headerData?.CompanyCountry})</div>
          {/* <div className={style2.lines}>Tell No: {headerData?.CompanyTellNo}</div> */}
          <div className={style2.lines}>T:  {headerData?.CompanyTellNo} | TOLL FREE {headerData?.CompanyTollFreeNo} </div>
          <div className={style2.lines}>
            {headerData?.CompanyEmail} | {headerData?.CompanyWebsite}
          </div>
          <div className={style2.lines}>
            {/* {headerData?.Company_VAT_GST_No} | {headerData?.Company_CST_STATE}-{headerData?.Company_CST_STATE_No} | PAN-{headerData?.Pannumber} */}
            {headerData?.Company_VAT_GST_No} | {headerData?.Company_CST_STATE}-{headerData?.Company_CST_STATE_No} | PAN-{headerData?.Pannumber}
          </div>
          <div className={style2.lines}>
            CIN-{headerData?.Com_CINNO}
          </div>
          <div className={style2.lines}>
            {headerData?.Com_GoldDealershipRefNo}
          </div>
        </div>
        <div style={{ width: "30%" }} className="d-flex justify-content-end align-item-center h-100">

          {isImageWorking && (headerData?.PrintLogo !== "" &&
            <img src={headerData?.PrintLogo} alt=""
              className={`${style2.headerImg}`}
              onError={handleImageErrors} />)}
          {/* <img src={headerData?.PrintLogo} alt="" /> */}
        </div>
      </div>
      {/* sub header */}
      <div className="d-flex border mb-1">
        <div className="col-8 p-2">
          <p>{headerData?.lblBillTo}</p>
          <p className={`fw-semibold ${style?.font_14}`}>{headerData?.customerfirmname}</p>
          <p>{headerData?.customerAddress1}</p>
          <p>{headerData?.customerAddress2}</p>
          {/* <p>{headerData?.customerAddress3}</p> */}
          <p>
            {headerData?.customercity1}
            {headerData?.customerpincode}
          </p>
          <p>{headerData?.customeremail1}</p>
          {/* <p>GSTIN-{headerData?.CustGstNo}</p> */}
          <p>{headerData?.vat_cst_pan}</p>
          {headerData?.Cust_CST_STATE_No !== "" && (
            <p>{headerData?.Cust_CST_STATE_No_}</p>
          )}
        </div>

        <div className="col-4 p-2">
          <p className="d-flex">
            <p className="fw-semibold pe-2 col-5">BILL NO </p>{" "}
            <p className="col-7">:{headerData?.InvoiceNo}</p>
          </p>
          <p className="d-flex">
            <p className="fw-semibold pe-2 col-5">DATE </p>{" "}
            <p className="col-7">:{headerData?.EntryDate}</p>
          </p>
          <p className="d-flex">
            <p className="fw-semibold pe-2 col-5">{headerData?.HSN_No_Label} </p>
            <p className="col-7">:{headerData?.HSN_No}</p>
          </p>
          <p className="d-flex">
            <p className="fw-semibold pe-2 col-5">Reverse Charge	 </p>
            <p className="col-7">:{headerData?.RevChar}</p>
          </p>

        </div>
      </div>
      {/* table Header */}
      <div className="d-flex mt-1 border">
        <div
          className={`${style?.Sr} border-end d-flex justify-content-center align-items-center`}
        >
          <p className="text-center fw-bold">Sr# </p>
        </div>
        <div
          className={`${style?.Description} border-end d-flex justify-content-center align-items-center`}
        >
          <p className="text-center fw-bold">Description</p>
        </div>

        <div
          className={`${style?.Purity} border-end d-flex justify-content-center align-items-center`}
        >
          <p className="text-center fw-bold">Purity </p>
        </div>

        <div
          className={`${style?.Gr} border-end d-flex justify-content-center align-items-center`}
        >
          <p className="text-center fw-bold">Gr wt </p>
        </div>

        <div
          className={`${style?.DWt} border-end d-flex justify-content-center align-items-center`}
        >
          <p className="text-center fw-bold">D.Wt </p>
        </div>

        <div
          className={`${style?.DRate} border-end d-flex justify-content-center align-items-center`}
        >
          <p className="text-center fw-bold">D.Rate </p>
        </div>

        <div
          className={`${style?.StWt} border-end d-flex justify-content-center align-items-center`}
        >
          <p className="text-center fw-bold">St.Wt </p>
        </div>
        <div
          className={`${style?.StRate} border-end d-flex justify-content-center align-items-center`}
        >
          <p className="text-center fw-bold">St.Rate </p>
        </div>
        <div
          className={`${style?.NetWt} border-end d-flex justify-content-center align-items-center`}
        >
          <p className="text-center fw-bold">Net Wt </p>
        </div>
        <div
          className={`${style?.Wastage} border-end d-flex justify-content-center align-items-center`}
        >
          <p className="text-center fw-bold">Wastage </p>
        </div>
        <div
          className={`${style?.Rate} border-end d-flex justify-content-center align-items-center`}
        >
          <p className="text-center fw-bold">Rate </p>
        </div>
        <div
          className={`${style?.Amount} d-flex justify-content-center align-items-center`}
        >
          <p className="text-center fw-bold">Amount</p>
        </div>
      </div>
      {/* table data */}
      {data?.resultArray.map((e, i) => {
        return (
          <div
            className="d-flex border-start border-end border-bottom no_break"
            key={i}
          >
            <div className={`${style?.Sr} border-end p-1`}>
              <p className="">{i + 1}</p>
            </div>
            <div className={`${style?.Description} border-end p-1`}>
              <p className="">{e?.Categoryname}</p>
            </div>
            <div className={`${style?.Purity} border-end p-1`}>
              <p className="">{e?.MetalTypePurity}</p>
            </div>
            <div className={`${style?.Gr} border-end p-1 text-end`}>
              <p className="">{NumberWithCommas(e?.grosswt, 3)}</p>
            </div>
            <div className={`${style?.DWt} border-end p-1 text-end`}>
              {/* <p className="">{NumberWithCommas(e?.totals?.diamonds?.Wt, 3)}</p> */}
              <p className="">{NumberWithCommas(e?.diaRmWt, 3)}</p>
            </div>
            <div className={`${style?.DRate} border-end p-1 text-end`}>
              <p className="">
                {e?.totals?.diamonds?.Wt !== 0 ? NumberWithCommas(e?.totals?.diamonds?.Amount / e?.diaRmWt, 2) : "0.00"}
              </p>
            </div>
            <div className={`${style?.StWt} border-end p-1 text-end`}>
              <p className="">
                {NumberWithCommas(e?.totals?.colorstone?.Wt, 3)}
              </p>
            </div>
            <div className={`${style?.StRate} border-end p-1 text-end`}>
              <p className="">
                {/* {e?.colorstone?.length !== 0 ? NumberWithCommas(e?.colorstone?.reduce((acc, cObj) => acc + cObj?.Rate, 0) / e?.colorstone?.length, 2) : "0.00"} */}
                {e?.colorstone?.length !== 0 ? NumberWithCommas(e?.totals?.colorstone?.Amount / e?.csRmWt, 2) : "0.00"}
              </p>
            </div>
            <div className={`${style?.NetWt} border-end p-1 text-end`}>
              <p className="">{NumberWithCommas(e?.NetWt, 3)}</p>
            </div>
            <div className={`${style?.Wastage} border-end p-1 text-end`}>
              <p className="">{NumberWithCommas(e?.LossWt, 3)}</p>
            </div>
            <div className={`${style?.Rate} border-end p-1 text-end`}>
              <p className="">
                {/* {NumberWithCommas(e?.MaKingCharge_Unit + e?.MetalAmount / e?.NetWt, 2)} */}
                {NumberWithCommas((e?.totals?.metal?.Amount + (e?.MaKingCharge_Unit * e?.NetWt)) / e?.NetWt, 2)}
              </p>
            </div>
            <div className={`${style?.Amount} p-1 text-end`}>
              <p className="">{NumberWithCommas(e?.UnitCost, 2)}</p>
            </div>
          </div>
        );
      })}
      {/* table total */}
      <div className="d-flex border-start border-end border-bottom no_break">
        <div className={`${style?.Sr} border-end p-1`}>
          <p className=""></p>
        </div>
        <div className={`${style?.Description} border-end p-1`}>
          <p className="fw-bold">TOTAL</p>
        </div>
        <div className={`${style?.Purity} border-end p-1`}>
          <p className=""></p>
        </div>
        <div className={`${style?.Gr} border-end p-1 text-end`}>
          <p className="fw-bold">
            {NumberWithCommas(data?.mainTotal?.grosswt, 3)}
          </p>
        </div>
        <div className={`${style?.DWt} border-end p-1 text-end`}>
          <p className="fw-bold">
            {NumberWithCommas(data?.mainTotal?.diaRmWt, 3)}
          </p>
        </div>
        <div className={`${style?.DRate} border-end p-1 text-end`}>
          <p className=""></p>
        </div>
        <div className={`${style?.StWt} border-end p-1 text-end`}>
          <p className="fw-bold">
            {NumberWithCommas(data?.mainTotal?.colorstone?.Wt, 3)}
          </p>
        </div>
        <div className={`${style?.StRate} border-end p-1 text-end`}>
          <p className=""></p>
        </div>
        <div className={`${style?.NetWt} border-end p-1 text-end`}>
          <p className="fw-bold">
            {NumberWithCommas(data?.mainTotal?.netwt, 3)}
          </p>
        </div>
        <div className={`${style?.Wastage} border-end p-1 text-end`}>
          <p className=""></p>
        </div>
        <div className={`${style?.Rate} border-end p-1 text-end`}>
          <p className=""></p>
        </div>
        <div className={`${style?.Amount} p-1 text-end`}>
          <p className="fw-bold">
            {NumberWithCommas(data?.mainTotal?.total_unitcost, 2)}
          </p>
        </div>
      </div>
      {/* In Words */}
      <div className="d-flex border-start border-end border-bottom no_break">
        <div
          className={`${style?.words} border-end p-1 d-flex justify-content-end flex-column`}
        >
          <p>In Words {headerData?.Currencyname}</p>
          <p className="fw-bold">
            {toWords.convert(+fixedValues(data?.mainTotal?.total_amount + data?.allTaxes?.reduce((acc, cObj) => acc + +((+cObj?.amount * headerData?.CurrencyExchRate)?.toFixed(2)), 0) + headerData?.AddLess, 2))} Only
          </p>
        </div>
        <div className={`${style?.grandTotal}`}>
          <div className="d-flex">
            <div className={`${style?.Values} text-end border-end p-1`}>
              {/* <p>Discount</p> */}
              <p className="fw-bold">Total Amount</p>
              {data?.allTaxes.map((e, i) => {
                return (
                  <p key={i}>
                    {e?.name} @ {e?.per}
                  </p>
                );
              })}
              {headerData?.AddLess !== 0 && (
                <p>{headerData?.AddLess > 0 ? "Add" : "Less"}</p>
              )}
            </div>
            <div className={`${style?.amounts} p-1 text-end`}>
              {/* <p>{NumberWithCommas(data?.mainTotal?.total_discount_amount, 2)}</p> */}
              <p className="fw-bold">{NumberWithCommas(data?.mainTotal?.total_amount, 2)}</p>
              {data?.allTaxes.map((e, i) => {
                return <p key={i}>{NumberWithCommas(+e?.amount * headerData?.CurrencyExchRate, 2)}</p>;
              })}
              {headerData?.AddLess !== 0 && (
                <p>{NumberWithCommas(headerData?.AddLess, 2)}</p>
              )}
            </div>
          </div>
          <div className="d-flex border-top">
            <div className={`${style?.Values} text-end border-end p-1`}>
              <p className="fw-bold">GRAND TOTAL</p>
            </div>
            <div className={`${style?.amounts} p-1 text-end`}>
              <p className="fw-bold">
                {NumberWithCommas(data?.mainTotal?.total_amount + data?.allTaxes?.reduce((acc, cObj) => acc + +((+cObj?.amount * headerData?.CurrencyExchRate)?.toFixed(2)), 0) + headerData?.AddLess, 2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* remarks */}
      <div className="d-flex border-start border-end border-bottom p-2 no_break">
        <div>
          <p className="fw-bold text-decoration-underline">Remark : </p>
          <p>{headerData?.PrintRemark}</p>
        </div>
      </div>

      {/* declaration */}
      <div
        className="border p-2 mt-1"
        dangerouslySetInnerHTML={{ __html: headerData?.Declaration }}
      ></div>

      {/* {footer} */}
      <div className={`${footerStyle.container} no_break mt-1`}>
        <div
          className={footerStyle.block1f3}
          style={{ width: "33.33%", borderRight: "1px solid #e8e8e8" }}
        >
          <div className={`${footerStyle.linesf3} fw-normal`}><span className="fw-bold">Sales Person Name :</span> {headerData?.SalPerName}</div>
          <div className={`${footerStyle.linesf3} fw-normal `}><span className="fw-bold pe-2">Transaction Id:</span> <span dangerouslySetInnerHTML={{ __html: headerData?.TransactionId }}></span></div>
        </div>
        <div
          className={footerStyle.block2f3}
          style={{ width: "33.33%", borderRight: "1px solid #e8e8e8" }}
        >
          <div className={`${footerStyle.linesf3} fw-normal`}>Customer Signature</div>
          <div className={footerStyle.linesf3}>{headerData?.customerfirmname}</div>
        </div>
        <div className={footerStyle.block2f3} style={{ width: "33.33%" }}>
          <div className={`${footerStyle.linesf3} fw-normal`}>Auth. Signatory</div>
          <div className={footerStyle.linesf3}>{headerData?.CompanyFullName}</div>
        </div>
      </div>
    </div>
  ) : (
    <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
      {msg}
    </p>
  );
};

export default TaxInvoicePrint4;
