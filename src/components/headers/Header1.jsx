import React, { useState } from "react";
import style from "../../assets/css/headers/header1.module.css";
import ImageComponent from "../ImageComponent ";
const Header1 = ({ data }) => {
  const [logoStyle, setlogoStyle] = useState({ maxWidth: "120px", maxHeight: "95px", minHeight: "95px" });
  return (
    <>

      <div className={`${style.headline} headerTitle target_header`}>{data?.PrintHeadLabel}</div>
      <div className={`${style.companyDetails} target_header`}>
        <div className={`${style.companyhead} p-2`}>
          <div className={style.lines} style={{ fontWeight: "bold" }}>
            {data?.CompanyFullName}
          </div>
          <div className={style.lines}>{data?.CompanyAddress}</div>
          <div className={style.lines}>{data?.CompanyAddress2}</div>
          <div className={style.lines}>{data?.CompanyCity}-{data?.CompanyPinCode},{data?.CompanyState}({data?.CompanyCountry})</div>
          {/* <div className={style.lines}>Tell No: {data?.CompanyTellNo}</div> */}
          {/* <div className={style.lines}>Tell No:  {data?.CompanyTellNo}</div> */}
          <div className={style.lines}>
            {data?.CompanyEmail} | {data?.CompanyWebsite}
          </div>
          <div className={style.lines}>
            {/* {data?.Company_VAT_GST_No} | {data?.Company_CST_STATE}-{data?.Company_CST_STATE_No} | PAN-{data?.Pannumber} */}
            {data?.Company_VAT_GST_No} | {data?.Company_CST_STATE}-{data?.Company_CST_STATE_No} | PAN-{data?.Pannumber}
          </div>
          <div className={style.lines}>Tell No:  {data?.CompanyTellNo}</div>
        </div>
        <div style={{ width: "30%" }} className="d-flex justify-content-end align-item-center h-100">
          <ImageComponent imageUrl={data?.PrintLogo} styles={logoStyle} />
        </div>
      </div>
          {/* <img src={data?.PrintLogo} alt="" className={style.headerImg} /> */}


      {/* <div className={style.custBlock}>
        <div className={style.custDetails}>
          <div className={style.lines}>Bill To,</div>
          <span className={style.lines} style={{ fontWeight: "bold" }}>
            {data?.customerfirmname}
          </span>
          <span className={style.lines}>{data?.customerAddress2}</span>
          <span className={style.lines}>{data?.customerAddress1}</span>
          <span className={style.lines}>{data?.customerAddress3}</span>
          <span className={style.lines}>{data?.customercity} {data?.customerpincode}</span>
          <span className={style.lines}>{data?.customeremail1}</span>
          <span className={style.lines}>GSTIN-25GJERDR202314</span>
          <span className={style.lines}></span>
          <span className={style.lines}></span>
        </div>
        <div className={style.custDetails}>
          <span className={style.lines}>Ship to</span>
          <span className={style.lines} style={{ fontWeight: "bold" }}>
            {data?.customerfirmname}
          </span>
          <span className={style.lines}>{data?.CustName}</span>
          <span className={style.lines}>{data?.customerstreet}</span>
          <span className={style.lines}>{data?.customercity}, {data?.State}</span>
          <span className={style.lines}>India-{data?.customerpincode}</span>
          <span className={style.lines}>Mobile No : {data?.customermobileno}</span>
          <span className={style.lines}></span>
          <span className={style.lines}></span>
          <span className={style.lines}></span>
        </div>
        <div className={style.custDetails}>
          <span className={style.invoice}>
            <span className={style.lines}>BILL NO</span>
            <span className={style.lines}>{data?.InvoiceNo}</span>
          </span>
          <span className={style.invoice}>
            <span className={style.lines}>DATE</span>
            <span className={style.lines}>{data?.EntryDate}</span>
          </span>
          <span className={style.invoice}>
            <span className={style.lines}>HSN</span>
            <span className={style.lines}>{data?.HSN_No}</span>
          </span>
          <span className={style.lines}></span>
          <span className={style.lines}></span>
          <span className={style.lines}></span>
          <span className={style.lines}></span>
          <span className={style.lines}></span>
          <span className={style.lines}></span>
          <span className={style.lines}></span>
        </div>
        <div className={style.custDetails}>
          <span className={style.lines}>E Way Bill</span>
          <span className={style.lines} style={{ fontWeight: "bold" }}>
            
          </span>
          <span className={style.lines}></span>
          <span className={style.lines}></span>
          <span className={style.lines}></span>
          <span className={style.lines}></span>
          <span className={style.lines}></span>
          <span className={style.lines}></span>
          <span className={style.lines}></span>
          <span className={style.lines}></span>
        </div>
      </div> */}
    </>
  );
};

export default Header1;
