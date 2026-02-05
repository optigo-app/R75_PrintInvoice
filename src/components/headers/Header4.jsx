import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import style from "../../assets/css/headers/header4.module.css";
import QrCodeForPrint from "../QrCodeForPrint";
const Header4 = ({ data }) => {
  const [headerData, setHeaderData] = useState([]);

  useEffect(() => {
    setHeaderData(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="p-2">
      <div className={style.headlineh4}>{headerData?.PrintHeadLabel}</div>
      <div className={style.qrcodeheadh4}>
        <div>Government of india e-Invoice System</div>
        <div className={style.qrcodeheadimgh4}><QrCodeForPrint text="hellosdkjnksdfbnkjbsfkjbbdasfklnenfsdeflkhnresglkjgklkndfkgjngkjngklnasdfkjndfdglkndfgknkdfgjnkjadekjsdnkj" /></div>
      </div>
      <div className={style.detailparth4}>
        <div className={style.invDetailsh4}>1. e-Invoice Details</div>
        <div className={style.ackh4}>
          <div>
            <b>IRN :</b> 65987569873598797477sdfhbsd2357587wefuh47f87y82130
          </div>
          <div>
            <b>Ack No :</b> 16231585858856738
          </div>
          <div>
            <b>Ack. Date :</b> 2023-12-28 15:38:00
          </div>
        </div>
      </div>
      <div className={style.transDetailParth4}>
        <div className={style.invDetailsh4}>2. Transaction Details</div>
        <div className="d-flex justify-content-between align-items-start p-1">
          <div className={style.subtranparth4}>
            <div><b>Category :</b> B2B</div>
            <div><b>Invoice Type :</b> Tax Invoice</div>
          </div>
          <div className={style.subtranparth4}>
            <div><b>Invoice No :</b> LVJ236273</div>
            <div><b>Invoice Date :</b> 28 Dec 2023</div>
          </div>
          <div className={style.subtranparth4}>
            <div><b>IGST on INTRA: </b> NA</div>
          </div>
        </div>
      </div>
      <div className={style.companydetailh4}>
            <div className="d-flex justify-content-center align-items-center"><img src={headerData?.PrintLogo} className={style.printlogoimgh4} alt="companylogo" /></div>
            <div>
              <div className={`${style.companyInfoCenterh4} fw-bold`}>{headerData?.CompanyFullName}</div>
              <div className={style.companyInfoCenterh4}>3rd & 4th floor, Hall No. 303 To 304, Pramukh Darshan,</div>
              <div className={style.companyInfoCenterh4}>Opp. Community Hall, Katargam</div>
              <div className={style.companyInfoCenterh4}>Surat-{headerData?.CompanyPinCode}, {headerData?.CompanyState}({headerData?.CompanyCountry})</div>
              <div className={style.companyInfoCenterh4}>T {headerData?.CompanyTellNo}</div>
              <div className={style.companyInfoCenterh4}>{headerData?.Company_VAT_GST_No} | {headerData?.Company_CST_STATE} - {headerData?.Company_CST_STATE_No}</div>
              <div className={`${style.companyInfoCenterh4} fw-bold`}>{headerData?.InvoiceBillType}</div>
            </div>
      </div>
    </div>
  );
};

export default Header4;
