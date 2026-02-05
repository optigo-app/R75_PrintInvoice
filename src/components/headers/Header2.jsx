import React from "react";
import header2 from "../../assets/css/headers/header2.module.css";

const Header2 = ({ data }) => {
  
  return (
    <div>
      <div className={header2.headline}>{data?.PrintHeadLabel}</div>
      <div className={header2.companyDetails}>
      <div
          style={{ width: "30%" }}
          className="d-flex justify-content-center align-item-center h-100"
        >
          <img src={data?.PrintLogo} alt="" className={header2.headerImg} />
        </div>
        <div className={header2.companyhead}>
          <span className={header2.lines} style={{ fontWeight: "bold" }}>
            {data?.CompanyFullName}
          </span>
          <span className={header2.lines}>{data?.CompanyAddress}</span>
          <span className={header2.lines}>{data?.CompanyAddress2}</span>
          <span className={header2.lines}>
            {data?.CompanyCity}-{data?.CompanyPinCode},{data?.CompanyState}(
            {data?.CompanyCountry})
          </span>
          <span className={header2.lines}>Tell No: {data?.CompanyTellNo}</span>
          <span className={header2.lines}>
            {data?.CompanyEmail} | {data?.CompanyWebsite}
          </span>
          <span className={header2.lines}>
            {data?.Company_VAT_GST_No} | {data?.Company_CST_STATE}-{data?.Company_CST_STATE_No}
            {/* -GSTIN-25GJERDR202314 */}
          </span>
        </div>
      </div>

      {/* <div className={header2.custBlock}>
        <div className={header2.custDetails}>
          <span className={header2.lines}>Bill To,</span>
          <span className={header2.lines} header2={{ fontWeight: "bold" }}>
            {data?.customerfirmname}
          </span>
          <span className={header2.lines}>{data?.customerAddress2}</span>
          <span className={header2.lines}>{data?.customerAddress1}</span>
          <span className={header2.lines}>{data?.customerAddress3}</span>
          <span className={header2.lines}>
            {data?.customercity} {data?.customerpincode}
          </span>
          <span className={header2.lines}>{data?.customeremail1}</span>
          <span className={header2.lines}>GSTIN-25GJERDR202314</span>
          <span className={header2.lines}></span>
          <span className={header2.lines}></span>
        </div>
        <div className={header2.custDetails}>
          <span className={header2.lines}>Ship to</span>
          <span className={header2.lines} header2={{ fontWeight: "bold" }}>
            {data?.customerfirmname}
          </span>
          <span className={header2.lines}>{data?.CustName}</span>
          <span className={header2.lines}>{data?.customerstreet}</span>
          <span className={header2.lines}>
            {data?.customercity}, {data?.State}
          </span>
          <span className={header2.lines}>India-{data?.customerpincode}</span>
          <span className={header2.lines}>
            Mobile No : {data?.customermobileno}
          </span>
          <span className={header2.lines}></span>
          <span className={header2.lines}></span>
          <span className={header2.lines}></span>
        </div>
        <div className={header2.custDetails}>
          <span className={header2.invoice}>
            <span className={header2.lines}>BILL NO</span>
            <span className={header2.lines}>{data?.InvoiceNo}</span>
          </span>
          <span className={header2.invoice}>
            <span className={header2.lines}>DATE</span>
            <span className={header2.lines}>{data?.EntryDate}</span>
          </span>
          <span className={header2.invoice}>
            <span className={header2.lines}>HSN</span>
            <span className={header2.lines}>{data?.HSN_No}</span>
          </span>
          <span className={header2.lines}></span>
          <span className={header2.lines}></span>
          <span className={header2.lines}></span>
          <span className={header2.lines}></span>
          <span className={header2.lines}></span>
          <span className={header2.lines}></span>
          <span className={header2.lines}></span>
        </div>
        <div className={header2.custDetails}>
          <span className={header2.lines}>E Way Bill</span>
          <span
            className={header2.lines}
            header2={{ fontWeight: "bold" }}
          ></span>
          <span className={header2.lines}></span>
          <span className={header2.lines}></span>
          <span className={header2.lines}></span>
          <span className={header2.lines}></span>
          <span className={header2.lines}></span>
          <span className={header2.lines}></span>
          <span className={header2.lines}></span>
          <span className={header2.lines}></span>
        </div>
      </div> */}
    </div>
  );
};

export default Header2;
