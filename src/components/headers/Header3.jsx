import React from "react";
import style from "../../assets/css/headers/header3.module.css";
import QrCodeForPrint from "../QrCodeForPrint";
import { handleGlobalImgError } from "../../GlobalFunctions";
import img from "../../assets/img/E_invoice_QR.png";
const Header3 = ({ data }) => {
  return (
    <div className={style.header3}>

      <div className={style.headline}>
        <div className={style.headline2}>{data?.PrintHeadLabel}</div>
        <div className={style.headline2}>{data?.E_HeadLabel}</div>
      </div>
      <div
        className={`${style.companyDetails} d-flex justify-content-between align-items-center w-100 `}
      >
        <div className="" style={{width:"60%"}}>
          <div>
            <img src={data?.PrintLogo} alt="home" className="mb-2" style={{ width: "116px" }} />
          </div>
          <div className={`fw-bold  ${style.linesmain}`}>{data?.CompanyFullName}</div>
          <div className={style.lines}>{data?.CompanyAddress}</div>
          <div className={style.lines}>{data?.CompanyCity} {data?.CompanyAddress2}</div>
          <div className={style.lines}>{data?.CompanyCity} - {data?.CompanyPinCode} {data?.CompanyState} ({data?.CompanyCountry})</div>
          <div className={`${style.lines} flex-wrap`}>T {data?.CompanyTellNo} {data?.CompanyTollFreeNo !== "" && ` | TOLL FREE ${data?.CompanyTollFreeNo} | TOLL FREE ${data?.CompanyTollFreeNo}`} </div>
          <div className={style.lines}>
            {data?.CompanyEmail} | {data?.CompanyWebsite}
          </div>
          <div className={style.lines}>
            {data?.Company_VAT_GST_No} {(data?.Company_CST_STATE_No !== "" && data?.Company_CST_STATE !== "") && `| ${data?.Company_CST_STATE} - ${data?.Company_CST_STATE_No}`} 
            {data?.Com_pannumber !== "" && ` | PAN-${data?.Com_pannumber}`}
          </div>
        </div>
        <div className="" style={{width:"40%"}}>
          <div className={style.qrcodeupperdivh3}>
            {/* <QrCodeForPrint text="hellosdkjnksdfbnkjbsfkjbbdasfklnenfsdeflkhnresglkjgklkndfkgjngkjngklnasdfkjndfdglkndfgknkdfgjnkjadekjsdnkj" /> */}
            <img src={data?.E_Qr} alt="" className={`${style?.max_min_h3}`} onError={handleGlobalImgError} />
            {/* <img src={img} alt="" className={`${style?.max_min_h3}`}  onError={handleGlobalImgError} /> */}
          </div>
          <div className={`w-100 text-end fw-bold pe-2 lh-1 ${style?.taxInvfs}`}>
            {data?.InvoiceBillType}
          </div>
        </div>
      </div>
      <div className={style.tranDetails}>
        <div className={style.einvdetails}>1.e-Invoice Details</div>
        <div className={style.einvoiceDetails}>
          <div className="d-flex">
            <div className={`fw-bold ${style.fshead3comp}`}>IRN : </div>
            <div className={style.fshead3comp}> {data?.E_IRN}</div>
          </div>
          <div className="d-flex">
            <div className={`fw-bold ${style.fshead3comp}`}>Ack No.</div>
            <div className={style.fshead3comp}> {data?.E_AckNo}</div>
          </div>
          <div className="d-flex">
            <div className={`fw-bold ${style.fshead3comp}`}>Ack. Date :</div>
            <div className={style.fshead3comp}> {data?.E_AckDt}</div>
          </div>
        </div>
      </div>
      <div className={style.tranDetails}>
        <div className={style.einvdetails}>2.Transaction Details</div>
        <div className={style.einvoiceDetails}>
          <div className={style.commonwidthh3}>
            <div><b>Category : </b> {data?.E_Category}</div>
            <div><b>Invoice Type : </b> Tax Invoice</div>
          </div>
          <div className={style.commonwidthh3}>
            <div><b>Invoice No : </b> {data?.InvoiceNo}</div>
            <div><b>Invoice Date : </b> {data?.EntryDate}</div>
          </div>
          <div className={style.commonwidthh3}>
            <div><b>IGST on INTRA : </b> {data?.E_INTRA}</div>
            <div><b>Description : </b> {data?.E_Desc}</div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Header3;
