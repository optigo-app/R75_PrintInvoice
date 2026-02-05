import React from "react";
import style from "../subhead2/subhead2.module.css";
const Subhead2 = ({ data }) => {
  let address = data?.Printlable?.split("\r\n");
  data.address = address;
  return (
    <div>
      <div className={style.custBlock}>
        <div className={style.custDetails}>
          <span className={style.lines}>Bill To,</span>
          <span className={style.lines} style={{ fontWeight: "bold" }}>
            {data?.customerfirmname}
          </span>
          <span className={style.lines}>{data?.customerAddress2}</span>
          <span className={style.lines}>{data?.customerAddress1}</span>
          <span className={style.lines}>{data?.customerAddress3}</span>
          <span className={style.lines}>
            {data?.customercity} {data?.customerpincode}
          </span>
          <span className={style.lines}>{data?.customeremail1}</span>
          <span className={style.lines}>GSTIN-{data?.Cust_VAT_GST_No}</span>
          
        </div>
        <div className={style.custDetails}>
          <span className={style.lines}>Ship to</span>
          <span className={style.lines} style={{ fontWeight: "bold" }}>
            {data?.customerfirmname}
          </span>
          {
            data?.address?.length > 0 &&
            data?.address?.map((e, i) => {
              return(
                <span className={style.lines} key={i}>{e}</span>
              )
            })
          }
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

        </div>
        <div className={style.custDetails}>
          <span className={style.lines}>E Way Bill</span>
          <span className={style.lines} style={{ fontWeight: "bold" }}></span>
          
        </div>
      </div>
    </div>
  );
};

export default Subhead2;
