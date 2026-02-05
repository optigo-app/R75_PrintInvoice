// http://localhost:3000/?tkn=OTA2NTQ3MTcwMDUzNTY1MQ==&invn=Sk1JLzE4LzIwMjU=&evn=bWVtbw==&pnm=QXBwcm92YWwgTWVtbw==&up=aHR0cDovL3plbi9qby9hcGktbGliL0FwcC9TYWxlQmlsbF9Kc29u&ctv=NzE=&ifid=DetailPrint12&pid=undefined
// JMI/18/2025
// 1205 doc.
import React, { useEffect, useState } from "react";
import "../../assets/css/prints/ApprovalMemo.scss";
import { apiCall, isObjectEmpty } from "../../GlobalFunctions";
import { OrganizeInvoicePrintData } from "../../GlobalFunctions/OrganizeInvoicePrintData";
import Loader from "../../components/Loader";

function ApprovalMemo({ token, invoiceNo, printName, urls, evn, ApiVer }) {
  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);

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
    setResult(datas);
  };
  console.log("ress", result);
  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <>
          {msg === "" ? (
            <div className="approval_printMain">
              <div className="App">
                <div style={{ marginTop: "20px" }}>
                  <button
                    className="btn_white blue"
                    id="printbtn"
                    style={{
                      float: "right",
                      marginRight: "60px",
                      display: "block",
                    }}
                    accessKey="p"
                    onClick={() => window.print()}
                  >
                    Print
                  </button>
                </div>
                <div>
                  <p style={{ fontSize: "16px" }}>
                    <b>{result?.header?.CompanyFullName}</b>
                  </p>
                  <p style={{ fontSize: "12px" }}>
                    <b>
                      {result?.header?.CompanyAddress}{" "}
                      {result?.header?.CompanyAddress2}
                      {result?.header?.CompanyCity} -{" "}
                      {result?.header?.CompanyPinCode}
                      {/* 57 Basant lok,opposite to dmart mall Vasant vihar12 , Near park ,
                    main ring road Surat - 605001 */}
                    </b>
                  </p>
                  <p style={{ fontSize: "18px", textDecoration: "underline" }}>
                    <b>{result?.header?.PrintHeadLabel}</b>
                  </p>
                </div>
                <div>
                  <div style={{ marginTop: "10px" }}>
                    <div className="topmainSection_main">
                      <div className="topBox1">
                        <p className="topBox_p">Bill To,</p>
                        <p className="topBox_p" style={{ fontSize: "14px" }}>
                          <b>{result?.header?.customerfirmname}</b>
                        </p>
                        <p className="topBox_p">
                          {result?.header?.customerAddress1}
                        </p>
                        <p className="topBox_p">
                          {result?.header?.customerAddress2}
                        </p>
                        <p className="topBox_p">
                          {result?.header?.customercity} --
                          {result?.header?.PinCode}{" "}
                        </p>
                        <p className="topBox_p">
                          {result?.header?.customeremail1}
                        </p>
                        <p className="topBox_p">
                          {result?.header?.vat_cst_pan}
                        </p>
                        {result?.header?.Cust_CST_STATE_No != "" && <p className="topBox_p">
                          {result?.header?.Cust_CST_STATE}-
                          {result?.header?.Cust_CST_STATE_No}
                        </p>}
                      </div>
                      <div className="topBox2">
                        <p className="topBox_p"> Ship To,</p>
                        <p className="topBox_p" style={{ fontSize: "14px" }}>
                          <b>{result?.header?.customerfirmname}</b>
                        </p>
                        {result?.header?.address?.map((line, index) => (
                          <React.Fragment key={index}>
                            <p className="topBox_p">{line}</p>
                          </React.Fragment>
                        ))}
                      </div>
                      <div className="topBox3">
                        <p className="topBox_p">
                          <b style={{ width: "100px", display: "flex" }}>
                            MEMO NO
                          </b>{" "}
                          : {result?.header?.InvoiceNo}
                        </p>
                        <p className="topBox_p">
                          {" "}
                          <b style={{ width: "100px", display: "flex" }}>
                            DATE{" "}
                          </b>
                          : {result?.header?.EntryDate}
                        </p>
                        <p className="topBox_p">
                          <b style={{ width: "100px", display: "flex" }}>
                            {" "}
                            {result?.header?.HSN_No_Label}{" "}
                          </b>
                          : {result?.header?.HSN_No}
                        </p>
                      </div>
                    </div>
                    <div className="second_main_box_div">
                      <div>
                        <div className="second_box_top_title">
                          <p className="memo1_second_box_top_title_colm1">
                            Sr No
                          </p>
                          <p className="memo1_second_box_top_title_colm2">
                            Style Code
                          </p>
                          <p className="memo1_second_box_top_title_colm3">
                            Jewel Code
                          </p>
                        </div>
                        <div>
                          {/* {Array.from({ length: 5 }, (_, index) => ({
                            id: index + 1,
                            sr: index + 1,
                            StyleCode: `RM-All`,
                            JewelCode: "1/278244",
                          })).map((data) => (
                            <div
                              key={data.id}
                              className="second_box_description_main"
                            >
                              <p className="memo1_second_box_top_title_colm1">
                                {data.sr}
                              </p>
                              <p className="memo1_second_box_top_title_colm2">
                                {data.StyleCode}
                              </p>
                              <p className="memo1_second_box_top_title_colm3">
                                {data.JewelCode}
                              </p>
                            </div>
                          ))} */}

                          {result?.resultArray?.map((data, ind) => {
                            return (
                              <div
                                key={ind}
                                className="second_box_description_main"
                              >
                                <p className="memo1_second_box_top_title_colm1">
                                  {data.SrNo}
                                </p>
                                <p className="memo1_second_box_top_title_colm2">
                                  {data.designno}
                                </p>
                                <p className="memo1_second_box_top_title_colm3">
                                  {data?.Category_Prefix}
                                  {data?.JewelCodePrefix}
                                  {data.SrJobno}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {result?.header?.PrintRemark != "" && (
                      <div
                        className="second_main_box_div"
                        style={{ padding: "5px" }}
                      >
                        <p className="appvol_ramark_title">Remark :</p>
                        <p style={{ display: "flex" }}>
                          {result?.header?.PrintRemark}
                        </p>
                      </div>
                    )}
                    <div
                      className="second_main_box_div"
                      style={{ padding: "4px" }}
                    >
                      <p className="memo1_title_secondBox_bottom_desc">
                        Terms & Conditions :
                      </p>
                      <div
                        className="memo1_secondBox_bottom_desc"
                        dangerouslySetInnerHTML={{
                          __html: result?.header?.Declaration,
                        }}
                      ></div>
                      {/* <p
                          className="memo1_secondBox_bottom_desc"
                          dangerouslySetInnerHTML={{
                            __html: result?.header?.Declaration?.replace()
                              .replace(/<[^>]+>/g, "")
                              .replace(/1\./g, "<br>1.")
                              .replace(/2\./g, "<br>2.")
                              .replace(/3\./g, "<br>3.")
                              .replace(/4\./g, "<br>4."),
                          }}
                        ></p> */}
                    </div>
                    <div className="memo1_bottomSection_main">
                      <div className="memo1_bottomSection_main_Box1">
                        <p style={{ display: "flex", margin: "0px" }}>
                          Signature :
                        </p>
                        <p style={{ display: "flex", margin: "0px" }}>
                          <b>{result?.header?.customerfirmname}</b>
                        </p>
                      </div>
                      <div className="memo1_bottomSection_main_Box2">
                        <p style={{ display: "flex", margin: "0px" }}>
                          Signature :
                        </p>
                        <p style={{ display: "flex", margin: "0px" }}>
                          <b>{result?.header?.CompanyFullName}</b>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
}
export default ApprovalMemo;
