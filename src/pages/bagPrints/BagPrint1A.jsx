import queryString from "query-string";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../../assets/css/bagprint/print1A.css";
import { GetChunkData } from "../../GlobalFunctions/GetChunkData";
import { GetData } from "../../GlobalFunctions/GetData";
import { GetSeparateData } from "../../GlobalFunctions/GetSeparateData";
import { handleImageError } from "../../GlobalFunctions/HandleImageError";
import { handlePrint } from "../../GlobalFunctions/HandlePrint";
import BarcodeGenerator from "../../components/BarcodeGenerator";
import Loader from "../../components/Loader";
import { organizeData } from "../../GlobalFunctions/OrganizeBagPrintData";
import { GetUniquejob } from "../../GlobalFunctions/GetUniqueJob";
import { checkInstruction } from "../../GlobalFunctions";
function BagPrint1A({ queries, headers }) {
  const [data, setData] = useState([]);
  const location = useLocation();
  const queryParams = queryString?.parse(location.search);
  const resultString = GetUniquejob(queryParams?.str_srjobno);
  const chunkSize11 = 15;
  const imgUrls = [];
  useEffect(() => {
    if (Object.keys(queryParams)?.length !== 0) {
      atob(queryParams?.imagepath);
    }
    const fetchData = async () => {
      try {
        const responseData = [];
        const startTime = performance?.now();

        const objs = {
          jobno: resultString,
          custid: queries.custid,
          printname: queries.printname,
          appuserid: queries.appuserid,
          url: queries.url,
          headers: headers,
        };

        const allDatas = await GetData(objs);
        let datas = organizeData(allDatas?.rd, allDatas?.rd1);

        // eslint-disable-next-line array-callback-return
        datas?.map((a) => {
          imgUrls?.push(a?.rd?.ThumbImagePath);
          let separateData = GetSeparateData(a?.rd1);
          separateData?.diamondArr?.unshift({
            heading: "DIAMOND DETAIL",
            MasterManagement_DiamondStoneTypeid: 3,
          });
          separateData?.colorStoneArr?.unshift({
            heading: "COLOR STONE DETAIL",
            MasterManagement_DiamondStoneTypeid: 4,
          });
          separateData?.findingArr?.unshift({
            heading: "FINDING DETAIL",
            MasterManagement_DiamondStoneTypeid: 5,
          });
          separateData?.miscArr?.unshift({
            heading: "MISC DETAIL",
            MasterManagement_DiamondStoneTypeid: 7,
          });
          // eslint-disable-next-line array-callback-return
          separateData?.diamondArr?.map((e) => {
            if (e?.ActualPcs === 0 && e?.ActualWeight === 0) {
              separateData.diamondArr = [];
            }
          });
          // eslint-disable-next-line array-callback-return
          separateData?.colorStoneArr?.map((e) => {
            if (e?.ActualPcs === 0 && e?.ActualWeight === 0) {
              separateData.colorStoneArr = [];
            }
          });
          // eslint-disable-next-line array-callback-return
          separateData?.miscArr?.map((e) => {
            if (e?.ActualPcs === 0 && e?.ActualWeight === 0) {
              separateData.miscArr = [];
            }
          });
          // eslint-disable-next-line array-callback-return
          separateData?.findingArr?.map((e) => {
            if (e?.ActualPcs === 0 && e?.ActualWeight === 0) {
              separateData.findingArr = [];
            }
          });

          let arr = [];
          let mainArr = arr?.concat(
            separateData?.diamondArr,
            separateData?.colorStoneArr,
            separateData?.miscArr,
            separateData?.findingArr
          );
          let imagePath = queryParams?.imagepath;
          imagePath = atob(queryParams?.imagepath);
          let img = imagePath + a?.rd?.ThumbImagePath;
          let arrofCHunk = GetChunkData(chunkSize11, mainArr);
          responseData.push({
            data: a,
            additional: {
              length: separateData?.length,
              clr: separateData?.clr,
              dia: separateData?.dia,
              f: separateData?.f,
              img: img,
              misc: separateData?.misc,
              pages: arrofCHunk,
            },
          });
          setData(responseData);
        });
        const endTime = performance?.now();
        // eslint-disable-next-line no-unused-vars
        const elapsedTime = (endTime - startTime) / 1000;
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data.length !== 0) {
      setTimeout(() => {
        window.print();
      }, 5000);
    }
  }, [data]);
  return (
    <>
      {data.length === 0 ? (
        <Loader />
      ) : (
        <React.Fragment>
          <div
            className="print_btn"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              margin: "1rem",
              marginRight: "2rem",
            }}
          >
            <button
              className="btn_white blue print_btn"
              onClick={(e) => handlePrint(e)}
            >
              Print
            </button>
          </div>
          <div className="print1A pad_60_allPrint">
            {Array.from(
              { length: queries?.pageStart },
              (_, indexs) =>
                indexs > 0 && (
                  <div
                    key={indexs}
                    className="mainbag1A"
                    style={{ border: "0px" }}
                  ></div>
                )
            )}
            {data.length > 0 &&
              data.map((e, i) => {
                return (
                  <React.Fragment key={i}>
                    {e?.additional?.pages?.length > 0 ? (
                      e?.additional?.pages?.map((ele, index) => {
                        return (
                          <div className="mainbag1A" key={index}>
                            <div className="print1AStartPart">
                              <div className="print1A_header">
                                <div className="print1A_header_bagInfoPart">
                                  <div className="print1A_header_bagInfoPart1">
                                    <div
                                      className="print1AJobNo lh1Ady"
                                      style={{ fontSize: "12px" }}
                                    >
                                      BAG {e?.data?.rd?.serialjobno}
                                    </div>
                                    <div className="print1AJobNo lh1Ady">
                                      {e?.data?.rd?.Designcode?.toUpperCase()}
                                    </div>
                                    <div className="print1AJobNo lh1Ady">
                                      {e?.data?.rd?.MetalType?.toUpperCase() +
                                        " " +
                                        e?.data?.rd?.MetalColorCo?.toUpperCase()}{" "}
                                    </div>
                                  </div>
                                  <div className="print1AMaterial">
                                    <div className="print1AMaterialCG">
                                      <div className="g1A">CUST.</div>
                                      <div className="custHead1A lh1Ady">
                                        {e?.data?.rd?.CustomerCode?.toUpperCase()}
                                      </div>
                                      <div className="custCode1A">
                                        <b>GOLD</b>
                                      </div>
                                      <div className="cst1A">
                                        <b>DIA</b>
                                      </div>
                                      <div
                                        className="cst1A"
                                        style={{ borderRight: "0px" }}
                                      >
                                        <b>CST</b>
                                      </div>
                                    </div>
                                    <div className="print1AMaterialCG">
                                      <div className="g1A">SIZE</div>
                                      <div
                                        className="custHead1A lh1Ady"
                                        style={{ lineHeight: "8px" }}
                                      >
                                        {e?.data?.rd?.Size?.toUpperCase()}
                                      </div>
                                      <div className="custCode1A lh1Ady">
                                        {e?.data?.rd?.MetalWeight?.toFixed(3)}
                                      </div>
                                      <div className="cst1A lh1Ady">
                                        {e?.additional?.dia?.ActualPcs}/
                                        {e?.additional?.dia?.ActualWeight?.toFixed(
                                          2
                                        )}
                                      </div>
                                      <div
                                        className="cst1A lh1Ady"
                                        style={{ borderRight: "0px" }}
                                      >
                                        {e?.additional?.clr?.ActualPcs}/
                                        {e?.additional?.clr?.ActualWeight?.toFixed(
                                          2
                                        )}
                                      </div>
                                    </div>
                                    <div className="print1AMaterialCG">
                                      <div
                                        className="g1A"
                                        style={{ width: "37px" }}
                                      >
                                        PO
                                      </div>
                                      <div
                                        className="custHead1A lh1Ady"
                                        style={{ width: "100px" }}
                                      >
                                        {e?.data?.rd?.PO?.toUpperCase()}
                                      </div>
                                      <div className="cst1A">
                                        <b>BAG DT</b>
                                      </div>
                                      <div
                                        className="cst1A lh1Ady"
                                        style={{
                                          borderRight: "0px",
                                          fontSize: "11.5px",
                                        }}
                                      >
                                        {e?.data?.rd?.orderDatef?.toUpperCase()}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="print1A_header_bagImgPart2">
                                  <img
                                    src={
                                      e?.data?.rd?.DesignImage !== '' 
                                          ? e?.data?.rd?.DesignImage
                                        : require("../../assets/img/default.jpg")
                                    }
                                    id="print1AImg"
                                    alt=""
                                    onError={(e) => handleImageError(e)}
                                    loading="eager"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="print1AtableBarcode">
                              <div className="midpart">
                                <div
                                  className="print1AMiddlePart"
                                  style={{ width: "260px" }}
                                >
                                  <div className="print1AMidHead">
                                    <div
                                      className="print1ARM"
                                      style={{ width: "104px" }}
                                    >
                                      <b>RM CODE</b>
                                    </div>
                                    <div
                                      className="sizename1A"
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        fontSize: "14px",
                                        width: "69px",
                                      }}
                                    >
                                      <b>RM SIZE</b>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center" style={{width:"127px"}}>
                                      <div className="w-50 d-flex flex-column justify-content-start align-items-center" style={{height:"33px", paddingTop:"2px"}}>
                                        <div style={{height:"14.5px", borderBottom:"1px solid black", borderRight:"1px solid black"}} className="w-100 fonts1A d-flex justify-content-center align-items-center">ACTUAL</div>
                                        <div className="w-100 d-flex fonts1A" style={{height:"16.5px"}}><div style={{borderRight:"1px solid black", height:"13px"}} className="w-50 d-flex justify-content-center align-items-center">PCS</div>
                                        <div className="w-50 d-flex justify-content-center align-items-center" style={{borderRight:"1px solid black", height:"13px"}}>WT</div></div>
                                      </div>
                                      <div className="w-50 d-flex flex-column justify-content-start align-items-center" style={{height:"33px"}}>
                                        <div style={{height:"16.5px", borderBottom:"1px solid black"}} className="w-100 fonts1A d-flex justify-content-center align-items-center">ISSUE</div>
                                        <div className="w-100 d-flex fonts1A" style={{height:"16.5px"}}>
                                          <div style={{borderRight:"1px solid black", height:"13px"}} className="w-50 d-flex justify-content-center align-items-center">PCS</div>
                                          <div className="w-50 d-flex justify-content-center align-items-center" style={{height:"13px"}}>WT</div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {ele?.data?.map((e, iabcd) => {
                                    return (
                                      <React.Fragment key={iabcd}>
                                        {e?.heading === "DIAMOND DETAIL" ||
                                        e?.heading === "COLOR STONE DETAIL" ||
                                        e?.heading === "MISC DETAIL" ||
                                        e?.heading === "FINDING DETAIL" ? (
                                          <div
                                            className="print1AMidBody"
                                            style={
                                              iabcd === 0 && e.heading !== ""
                                                ? { display: "" }
                                                : {}
                                            }
                                          >
                                            <div
                                              className="print1ARM"
                                              style={{
                                                width: "300px",
                                                borderRight: "0px",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                fontWeight: "bold",
                                              }}
                                            >
                                              {e?.heading?.toUpperCase()}
                                            </div>
                                          </div>
                                        ) : (
                                          <div>
                                            {e?.Shapename === "TOTAL" ? (
                                              <div className="print1AMidBody">
                                                <div
                                                  className="print1ARM RMW"
                                                  style={{
                                                    fontWeight: "bold",
                                                    fontSize: "10.5px",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                  }}
                                                >
                                                  {e?.Shapename?.toUpperCase()}
                                                </div>
                                                <div
                                                  className="sizename1A"
                                                  style={{ fontSize: "10.5px" }}
                                                >
                                                  {(e?.Sizename &&
                                                    e?.Sizename !== "" &&
                                                    e?.Sizename?.toUpperCase()?.slice(
                                                      0,
                                                      10
                                                    )) ??
                                                    ""}
                                                </div>
                                                <div className="pcswt1A">
                                                  <div className="actualPcsWt">
                                                    <div
                                                      className="pcs1A"
                                                      style={{
                                                        fontWeight: "bold",
                                                        fontSize: "10.5px",
                                                        display: "flex",
                                                        justifyContent:
                                                          "flex-end",
                                                        lineHeight: "7px",
                                                        paddingRight: "2px",
                                                      }}
                                                    >
                                                      {e?.ActualPcs}
                                                    </div>
                                                    <div
                                                      className="pcs1A"
                                                      style={{
                                                        borderRight: "0px",
                                                        width: "38px",
                                                        fontWeight: "bold",
                                                        lineHeight: "8px",
                                                        fontSize: "10.5px",
                                                        display: "flex",
                                                        justifyContent:
                                                          "flex-end",
                                                        paddingRight: "0.5px",
                                                      }}
                                                    >
                                                      {e?.ActualWeight?.toFixed(
                                                        2
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="">
                                                  <div className="">
                                                    <div
                                                      className="    "
                                                      style={{
                                                        border: "",
                                                        borderRight:
                                                          "1px solid rgb(0, 0, 0)",
                                                        width: "33px",
                                                        height: "14px",
                                                      }}
                                                    ></div>
                                                  </div>
                                                </div>
                                              </div>
                                            ) : (
                                              <div>
                                                {e?.MasterManagement_DiamondStoneTypeid ===
                                                5 ? (
                                                  <div>
                                                    <div className="print1AMidBody">
                                                      <div
                                                        className="print1ARM"
                                                        style={{
                                                          fontSize: "10.5px",
                                                          lineHeight: "7px",
                                                          width: "174px",
                                                        }}
                                                      >
                                                        {e?.LimitedShapeQualityColorCode?.toUpperCase() +
                                                          " " +
                                                          e?.Quality?.toUpperCase() +
                                                          " " +
                                                          e?.ColorName?.toUpperCase()}
                                                      </div>

                                                      <div className="pcswt1A">
                                                        <div className="actualPcsWt">
                                                          <div
                                                            className="pcs1A"
                                                            style={{
                                                              fontSize:
                                                                "10.5px",
                                                              justifyContent:
                                                                "flex-end",
                                                              paddingRight:
                                                                "2px",
                                                            }}
                                                          >
                                                            {e?.ActualPcs}
                                                          </div>
                                                          <div
                                                            className="pcs1A"
                                                            style={{
                                                              borderRight:
                                                                "0px",
                                                              width: "38px",
                                                              lineHeight: "8px",
                                                              fontSize:
                                                                "10.5px",
                                                              justifyContent:
                                                                "flex-end",
                                                              paddingRight:
                                                                "2px",
                                                            }}
                                                          >
                                                            {e?.ActualWeight?.toFixed(
                                                              2
                                                            )}
                                                          </div>
                                                        </div>
                                                      </div>
                                                      <div className="">
                                                        <div className="">
                                                          <div
                                                            className="    "
                                                            style={{
                                                              border: "",
                                                              borderRight:
                                                                "1px solid rgb(0, 0, 0)",
                                                              width: "33px",
                                                              height: "14px",
                                                            }}
                                                          ></div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                ) : (
                                                  <div>
                                                    <div className="print1AMidBody">
                                                      <div
                                                        className="print1ARM RMW lh1Ady"
                                                        style={{
                                                          fontSize: "10.5px",
                                                        }}
                                                      >
                                                        {e?.LimitedShapeQualityColorCode?.toUpperCase()}
                                                      </div>
                                                      <div
                                                        className="sizename1A lh1Ady"
                                                        style={{
                                                          fontSize: "10.5px",
                                                          justifyContent:
                                                            "flex-start",
                                                          paddingRight: "2px",
                                                        }}
                                                      >
                                                        {(e?.Sizename &&
                                                          e?.Sizename !== "" &&
                                                          e?.Sizename?.toUpperCase()?.slice(
                                                            0,
                                                            12
                                                          )) ??
                                                          ""}
                                                      </div>
                                                      <div className="pcswt1A">
                                                        <div className="actualPcsWt">
                                                          <div
                                                            className="pcs1A lh1Ady"
                                                            style={{
                                                              fontSize:
                                                                "10.5px",
                                                              justifyContent:
                                                                "flex-end",
                                                              paddingRight:
                                                                "2px",
                                                            }}
                                                          >
                                                            {e?.ActualPcs}
                                                          </div>
                                                          <div
                                                            className="pcs1A lh1Ady"
                                                            style={{
                                                              borderRight:
                                                                "0px",
                                                              width: "38px",
                                                              lineHeight: "8px",
                                                              fontSize:
                                                                "10.5px",
                                                              justifyContent:
                                                                "flex-end",
                                                              paddingRight:
                                                                "0.5px",
                                                            }}
                                                          >
                                                            {e?.ActualWeight?.toFixed(
                                                              2
                                                            )}
                                                          </div>
                                                        </div>
                                                      </div>
                                                      <div className="">
                                                        <div className="">
                                                          <div
                                                            className="    "
                                                            style={{
                                                              border: "",
                                                              borderRight:
                                                                "1px solid rgb(0, 0, 0)",
                                                              width: "33px",
                                                              height: "14px",
                                                            }}
                                                          ></div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </React.Fragment>
                                    );
                                  })}
                                  {Array.from(
                                    { length: ele?.length },
                                    (_, ains) => {
                                      return (
                                        <React.Fragment key={ains}>
                                          {ains !== 0 ? (
                                            <div className="print1AMidBody">
                                              <div className="print1ARM RMW">
                                                {e.Shapename ?? ""}
                                              </div>
                                              <div className="sizename1A">
                                                {e.Sizename ?? ""}
                                              </div>
                                              <div className="pcswt1A">
                                                <div className="actualPcsWt">
                                                  <div className="pcs1A">
                                                    {e?.ActualPcs ?? ""}
                                                  </div>
                                                  <div
                                                    className=""
                                                    style={{
                                                      borderRight: "0px",
                                                      width: "38px",
                                                    }}
                                                  >
                                                    {e?.ActualWeight ?? ""}
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="">
                                                <div className="">
                                                  <div
                                                    className="bordered-div"
                                                    style={{
                                                      width: "33px",
                                                      height: "14px",

                                                      borderRight: "1px solid",
                                                      borderBottom: "0px solid",
                                                      borderTop: "0px",
                                                    }}
                                                  ></div>
                                                  <div className=""></div>
                                                </div>
                                              </div>
                                            </div>
                                          ) : (
                                            <div
                                              className="print1AMidBody"
                                              style={{ display: "none" }}
                                            >
                                              <div className="print1ARM RMW">
                                                {e?.Shapename ?? ""}
                                              </div>
                                              <div className="sizename1A">
                                                {e?.Sizename ?? ""}
                                              </div>
                                              <div className="pcswt1A">
                                                <div className="actualPcsWt">
                                                  <div className="pcs1A">
                                                    {e?.ActualPcs ?? ""}
                                                  </div>
                                                  <div
                                                    className=""
                                                    style={{
                                                      borderRight: "0px",
                                                      width: "30px",
                                                    }}
                                                  >
                                                    {e?.ActualWeight ?? ""}
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="">
                                                <div className="">
                                                  <div
                                                    className="bordered-div"
                                                    style={{
                                                      width: "33px",
                                                      height: "14px",

                                                      borderRight: "1px solid",
                                                      borderBottom: "0px solid",
                                                      borderTop: "0px",
                                                    }}
                                                  ></div>
                                                  <div className=""></div>
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                        </React.Fragment>
                                      );
                                    }
                                  )}
                                </div>
                                <div
                                  style={{
                                    fontSize: "12px",
                                    paddingLeft: "2px",
                                    paddingTop: "2px",
                                    lineHeight: "14px",
                                  }}
                                >
                                  <b>INSTRUCTION:</b>
                                  <span style={{ color: "red" }}>
                                    {" " + checkInstruction(e?.data?.rd?.officeuse) +
                                      " " +
                                      (e?.data?.rd?.ProductInstruction?.length > 0 ? checkInstruction(e?.data?.rd?.ProductInstruction) : checkInstruction(e?.data?.rd?.QuoteRemark))}
                                  </span>
                                </div>
                              </div>
                              <div
                                className="barcodeSetPrint1A"
                                style={{ height: "285px", marginTop: "3px" }}
                              >
                                <div className="barcodeprint1A">
                                  {e?.data?.rd?.length !== 0 &&
                                    e?.data?.rd !== undefined && (
                                      <>
                                        {e?.data?.rd?.serialjobno !==
                                          undefined && (
                                          <BarcodeGenerator
                                            data={e?.data?.rd?.serialjobno}
                                          />
                                        )}
                                      </>
                                    )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="mainbag1A" key={i}>
                        <div className="print1AStartPart">
                          <div className="print1A_header">
                            <div className="print1A_header_bagInfoPart">
                              <div className="print1A_header_bagInfoPart1">
                                <div
                                  className="print1AJobNo"
                                  style={{
                                    fontSize: "12px",
                                    lineHeight: "8px",
                                  }}
                                >
                                  BAG {e?.data?.rd?.serialjobno}
                                </div>
                                <div
                                  className="print1AJobNo"
                                  style={{ lineHeight: "8px" }}
                                >
                                  {e?.data?.rd?.Designcode}
                                </div>
                                <div
                                  className="print1AJobNo"
                                  style={{ lineHeight: "8px" }}
                                >
                                  {e?.data?.rd?.MetalType}
                                </div>
                                <div
                                  className="print1AJobNo"
                                  style={{
                                    paddingRight: "3px",
                                    lineHeight: "8px",
                                  }}
                                >
                                  {e?.data?.rd?.MetalColorCo}
                                </div>
                              </div>

                              <div className="print1AMaterial">
                                <div className="print1AMaterialCG">
                                  <div className="g1A">CUST.</div>
                                  <div className="custHead1A">
                                    {e?.data?.rd?.CustomerCode}
                                  </div>
                                  <div className="custCode1A">
                                    <b>GOLD</b>
                                  </div>
                                  <div className="cst1A">
                                    <b>DIA</b>
                                  </div>
                                  <div
                                    className="cst1A"
                                    style={{ borderRight: "0px" }}
                                  >
                                    <b>CST</b>
                                  </div>
                                </div>
                                <div className="print1AMaterialCG">
                                  <div className="g1A">SIZE</div>
                                  <div className="custHead1A">
                                    {e?.data?.rd?.Size}
                                  </div>
                                  <div className="custCode1A">
                                    {e?.data?.rd?.MetalWeight?.toFixed(3)}
                                  </div>
                                  <div className="cst1A">
                                    {e?.additional?.dia?.ActualPcs}/
                                    {e?.additional?.dia?.ActualWeight?.toFixed(
                                      3
                                    )}
                                  </div>
                                  <div
                                    className="cst1A"
                                    style={{ borderRight: "0px" }}
                                  >
                                    {e?.additional?.clr?.ActualPcs}/
                                    {e?.additional?.clr?.ActualWeight?.toFixed(
                                      3
                                    )}
                                  </div>
                                </div>
                                <div className="print1AMaterialCG">
                                  <div
                                    className="g1A"
                                    style={{ width: "37px" }}
                                  >
                                    PO
                                  </div>
                                  <div
                                    className="custHead1A"
                                    style={{ width: "100px" }}
                                  >
                                    {e?.data?.rd?.PO}
                                  </div>
                                  <div className="cst1A">
                                    <b>BAG DT</b>
                                  </div>
                                  <div
                                    className="cst1A"
                                    style={{ borderRight: "0px" }}
                                  >
                                    {e?.data?.rd?.OrderDate}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="print1A_header_bagImgPart2">
                              <img
                                src={
                                  e?.data?.rd?.DesignImage !== '' 
                                          ? e?.data?.rd?.DesignImage
                                    : require("../../assets/img/default.jpg")
                                }
                                id="print1AImg"
                                alt=""
                                onError={(e) => handleImageError(e)}
                                loading="eager"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="print1AtableBarcode">
                          <div className="midpart">
                            <div className="print1AMiddlePart">
                              <div className="print1AMidHead">
                                <div
                                  className="print1ARM"
                                  style={{ width: "104px" }}
                                >
                                  <b>RM CODE</b>
                                </div>
                                <div
                                  className="sizename1A"
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    fontSize: "14px",
                                    width: "69px",
                                  }}
                                >
                                  <b>RM SIZE</b>
                                </div>
                                <div className="d-flex justify-content-between align-items-center" style={{width:"127px"}}>
                                      <div className="w-50 d-flex flex-column justify-content-start align-items-center" style={{height:"33px", paddingTop:"2px"}}>
                                        <div style={{height:"14.5px", borderBottom:"1px solid black", borderRight:"1px solid black"}} className="w-100 fonts1A d-flex justify-content-center align-items-center">ACTUAL</div>
                                        <div className="w-100 d-flex fonts1A" style={{height:"16.5px"}}><div style={{borderRight:"1px solid black", height:"13px"}} className="w-50 d-flex justify-content-center align-items-center">PCS</div>
                                        <div className="w-50 d-flex justify-content-center align-items-center" style={{borderRight:"1px solid black", height:"13px"}}>WT</div></div>
                                      </div>
                                      <div className="w-50 d-flex flex-column justify-content-start align-items-center" style={{height:"33px"}}>
                                        <div style={{height:"16.5px", borderBottom:"1px solid black"}} className="w-100 fonts1A d-flex justify-content-center align-items-center">ISSUE</div>
                                        <div className="w-100 d-flex fonts1A" style={{height:"16.5px"}}>
                                          <div style={{borderRight:"1px solid black", height:"13px"}} className="w-50 d-flex justify-content-center align-items-center">PCS</div>
                                          <div className="w-50 d-flex justify-content-center align-items-center" style={{height:"13px"}}>WT</div>
                                        </div>
                                      </div>
                                    </div>
                              </div>

                              {Array.from({ length: 15 }, (_, ai) => {
                                return (
                                  <div className="print1AMidBody" key={ai}>
                                    <div className="print1ARM RMW">
                                      {e?.Shapename ?? ""}
                                    </div>
                                    <div className="sizename1A">
                                      {e?.Sizename ?? ""}
                                    </div>
                                    <div className="pcswt1A">
                                      <div className="actualPcsWt">
                                        <div className="pcs1A">
                                          {e?.ActualPcs ?? ""}
                                        </div>
                                        <div
                                          className=""
                                          style={{
                                            borderRight: "0px",
                                            width: "30px",
                                          }}
                                        >
                                          {e?.ActualWeight ?? ""}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="">
                                      <div className="">
                                        <div
                                          className="bordered-div"
                                          style={{
                                            width: "33px",
                                            height: "15px",

                                            borderRight: "1px solid",
                                            borderBottom: "0px solid",
                                            borderTop: "0px",
                                          }}
                                        ></div>
                                        <div className=""></div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            <div
                              style={{
                                fontSize: "14px",
                                borderRight: "1px solid black",
                                height: "34px",
                                width: "19rem",
                              }}
                            >
                              <b>INSTRUCTION:</b>
                              <span style={{ color: "red" }}>
                                {" " + checkInstruction(e?.data?.rd?.officeuse) +
                                  " " +
                                  (e?.data?.rd?.ProductInstruction?.length > 0 ? checkInstruction(e?.data?.rd?.ProductInstruction) : checkInstruction(e?.data?.rd?.QuoteRemark))}
                              </span>
                            </div>
                          </div>
                          <div className="barcodeSetPrint1A">
                            <div className="barcodeprint1A">
                              {e?.data?.rd?.length !== 0 &&
                                e?.data?.rd !== undefined && (
                                  <>
                                    {e?.data?.rd?.serialjobno !== undefined && (
                                      <BarcodeGenerator
                                        data={e?.data?.rd?.serialjobno}
                                      />
                                    )}
                                  </>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
          </div>
        </React.Fragment>
      )}
    </>
  );
}

export default BagPrint1A;
