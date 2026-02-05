
import React from "react";
import footer2 from "../../assets/css/footers/footer2.module.css";
const Footer2 = ({data}) => {
  return (
    <div className={`${footer2.container} no_break target_footer`}>
      <div
        className={footer2.block1f3}
        style={{ width: "33.33%", borderRight: "1px solid #e8e8e8" }}
      >
        <div className={footer2.linesf3} style={{fontWeight:"bold"}}>Bank Detail</div>
        <div className={footer2.linesf3}>Bank Name: {data?.bankname}</div>
        <div className={footer2.linesf3}>Branch: {data?.bankaddress}</div>
        <div className={footer2.linesf3}>Account Name: {data?.accountname}</div>
        <div className={footer2.linesf3}>Account No. : {data?.accountnumber}</div>
        <div className={footer2.linesf3}>RTGS/NEFT IFSC: {data?.rtgs_neft_ifsc}</div>
      </div>
      <div
        className={footer2.block2f3}
        style={{ width: "33.33%", borderRight: "1px solid #e8e8e8" }}
      >
        <div className={footer2.linesf3}>Signature</div>
        <div className={footer2.linesf3}>{data?.customerfirmname}</div>
      </div>
      <div className={footer2.block2f3} style={{ width: "33.33%" }}>
        <div className={footer2.linesf3}>Signature</div>
        <div className={footer2.linesf3}>{data?.CompanyFullName}</div>
      </div>
    </div>
  );
};

export default Footer2;
