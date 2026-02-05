import React, { useEffect, useState } from "react";
import "../../assets/css/bagprint/print4A.css";
import BarcodeGenerator from "../../components/BarcodeGenerator";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import Loader from "../../components/Loader";
import { GetData } from "../../GlobalFunctions/GetData";
import { handlePrint } from "../../GlobalFunctions/HandlePrint";
import { handleImageError } from "../../GlobalFunctions/HandleImageError";
import { organizeData } from "../../GlobalFunctions/OrganizeBagPrintData";
import "../../assets/css/bagprint/print4b.css";
import { NumberWithCommas, checkInstruction, fixedValues, notZero } from "../../GlobalFunctions";
import { GetUniquejob } from "../../GlobalFunctions/GetUniqueJob";
const BagPrint4B = ({ queries, headers }) => {
  const [data, setData] = useState([]);
  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const resultString = GetUniquejob(queryParams?.str_srjobno);
  useEffect(() => {
    if (Object.keys(queryParams)?.length !== 0) {
      atob(queryParams?.imagepath);
    }
    const fetchData = async () => {
      try {
        const responseData = [];
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
          let chunkData = [];
          let chunkSize = 14;
          let length = 0;
          let clr = {
            Shapename: "TOTAL",
            Sizename: "",
            ActualPcs: 0,
            ActualWeight: 0,
          };
          let dia = {
            Shapename: "TOTAL",
            Sizename: "",
            ActualPcs: 0,
            ActualWeight: 0,
          };
          let misc = {
            Shapename: "TOTAL",
            Sizename: "",
            ActualPcs: 0,
            ActualWeight: 0,
          };
          let f = {
            Shapename: "TOTAL",
            Sizename: "",
            ActualPcs: 0,
            ActualWeight: 0,
          };
          // eslint-disable-next-line array-callback-return
          a?.rd1?.map((e, i) => {
            if (e?.ConcatedFullShapeQualityColorCode !== "- - - ") {
              length++;
            }
            if (e?.MasterManagement_DiamondStoneTypeid === 3) {
              dia.ActualPcs = dia.ActualPcs + e.ActualPcs;
              dia.ActualWeight = dia.ActualWeight + e.ActualWeight;
            } else if (e?.MasterManagement_DiamondStoneTypeid === 4) {
              clr.ActualPcs = clr.ActualPcs + e.ActualPcs;
              clr.ActualWeight = clr.ActualWeight + e.ActualWeight;
            } else if (e?.MasterManagement_DiamondStoneTypeid === 5) {
              f.ActualPcs = f.ActualPcs + e.ActualPcs;
              f.ActualWeight = f.ActualWeight + e.ActualWeight;
            } else if (e?.MasterManagement_DiamondStoneTypeid === 7) {
              misc.ActualPcs = misc.ActualPcs + e.ActualPcs;
              misc.ActualWeight = misc.ActualWeight + e.ActualWeight;
            }
          });
          let blankArr = a?.rd1?.filter((e, i) => e?.MasterManagement_DiamondStoneTypeid !== 0);
          a.rd1 = blankArr;
          let obj = { ...a };
          if (obj?.rd?.length > 0) {
            obj.rd.instructionData = (
              a?.rd["officeuse"] +
              a?.rd["custInstruction"]+
              a?.rd["ProductInstruction"]
            )?.substring(0, 113);
          }
          let imagePath = queryParams?.imagepath;
          imagePath = atob(queryParams?.imagepath);
          let img = imagePath + a?.rd?.ThumbImagePath;
          for (let i = 0; i < a?.rd1?.length; i += chunkSize) {
            const chunks = a?.rd1?.slice(i, i + chunkSize);
            let len = 14 - a?.rd1?.slice(i, i + chunkSize)?.length;
            chunkData.push({ data: chunks, length: len });
          }
          responseData.push({
            data: obj.rd,
            additional: {
              length: length,
              clr: clr,
              dia: dia,
              f: f,
              img: img,
              misc: misc,
              pages: chunkData,
            },
          });
        });
        setData(responseData);
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
        <>
          <div className="print_btn ">
            <button
              className="btn_white blue print_btn"
              onClick={(e) => handlePrint(e)}
            >
              Print
            </button>
          </div>
          <section className="print4A pad_60_allPrint">
            {Array.from(
              { length: queries?.pageStart },
              (_, index) =>
                index > 0 && (
                  <div
                  key={index}
                  className="container4A container4B"
                  style={{ border: "0px" }}
                >
                  <div className="print4Apart_1 print4bpart_1" style={{border:"0px"}}></div>
                </div>
                )
            )}
            {data?.length > 0 &&
              data?.map((e, i) => {
                return (
                  <React.Fragment key={i}>
                    {
                    e?.additional?.pages?.length > 0 ? <> 
                    {
                      (
                        e?.additional?.pages?.map
                        ((ele, ind) => 
                        {
                            console.log(e)
                            return (
                                <div className="container4A container4B" key={ind}>
                              <div className="print4Apart_1 print4bpart_1">
                                <div className="part_1_4A">
                                  <div className="title4A jobDiaGold4A border_bottom4A">
                                    <div className="jobDiaGoldText4A ps-1">
                                      {e?.data?.serialjobno}
                                    </div>
                                    <div className="jobDiaGoldText4A">
                                      {e?.data?.Designcode}
                                    </div>
                                    <div className="jobDiaGoldText4A border_right4A pe-1" style={{ paddingRight: "2px" }}>
                                      {e?.data?.MetalType} {e?.data?.MetalColorCo}
                                    </div>
                                  </div>
                                  <div className="height_border_31_4A border_bottom4A">
                                    <div className="cust4A border_right4A">
                                      <div
                                        className="custText4A"
                                        style={{ paddingTop: "3px" }}
                                      >
                                        CUST
                                      </div>
                                      <div className="custTextRes4A ">
                                        {e?.data?.CustomerCode}
                                      </div>
                                    </div>
                                    <div className="ordDt4A border_right4A">
                                      <div
                                        className="custText4A"
                                        style={{ paddingTop: "3px" }}
                                      >
                                        ORD.DT.
                                      </div>
                                      <div className="custTextRes4A" style={{fontSize:`${e?.data?.orderDatef?.length > 7 ? '7.5pt' : '9pt'}`}}>
                                        {e?.data?.orderDatef ?? ""}
                                      </div>
                                    </div>
                                    <div className="delDt4A border_right4A">
                                      <div
                                        className="custText4A"
                                        style={{ paddingTop: "3px" }}
                                      >
                                        DEL.DT.
                                      </div>
                                      <div className="custTextRes4A" style={{fontSize:`${e?.data?.promiseDatef?.length > 7 ? '7.5pt' : '9pt'}`, lineHeight:"6px"}}>
                                        {e?.data?.promiseDatef ?? ""}
                                      </div>
                                    </div>
                                    <div className="size4AB border_right4A">
                                      <div
                                        className="custText4A"
                                        style={{ paddingTop: "1px", paddingLeft: "1px" }}
                                      >
                                        SIZE
                                      </div>
                                      <div className="custTextRes4A">
                                        {e?.data?.Size}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="title4A border_bottom4A d_flex4A">
                                    <div className="code4A border_right4A code4A_text d-flex align-items-center">
                                      CODE
                                    </div>
                                    <div className="size4AS border_right4A code4A_text d-flex align-items-center">
                                      SIZE
                                    </div>
                                    <div className="pcs4A border_right4A code4A_text d-flex align-items-center">
                                      PCS
                                    </div>
                                    <div className="wt4A border_right4A code4A_text d-flex align-items-center">
                                      WT
                                    </div>
                                    <div className="pcs4A border_right4A code4A_text d-flex align-items-center">
                                      PCS
                                    </div>
                                    <div className="wt4A border_right4A code4A_text d-flex align-items-center">
                                      WT
                                    </div>
                                  </div>
                                  <div className="height_23_4A border_bottom4A d_flex4A">
                                    <div
                                      className="code4A border_right4A code4A_text"
                                      style={{ width: "94pt" }}
                                    >
                                      <div className="code_4A_change  height_23_4A code4A_text height_11_Print4a" style={{width:"89.99pt"}}>
                                        {e?.data?.MetalType} {e?.data?.MetalColorCo}
                                      </div>
                                    </div>
                                    <div className="pcs4A border_right4A code4A_text"></div>
                                    <div className="wt4A border_right4A code4A_text"></div>
                                    <div className="pcs4A border_right4A code4A_text"></div>
                                    <div className="wt4A border_right4A code4A_text"></div>
                                  </div>
                                  <div className="record_line_1">
                                    {ele?.data.map((elem, index) => {
                                      return elem?.MasterManagement_DiamondStoneTypeid ===
                                        5 ? (
                                        <div className="record_line_4A border_bottom4A" key={index} >
                                          <div className="code4A border_right4A code4A_text" style={{ width: "94pt", lineHeight: "8px", }} >
                                            <div className="finding height_23_4A"> {elem?.Shapename} {elem?.Quality} {elem?.ColorName} </div>
                                          </div>
                                          <div className="pcs4A border_right4A code4A_text">{NumberWithCommas(elem?.ActualPcs, 0)}</div>
                                          <div className="wt4A border_right4A code4A_text">{fixedValues(elem?.ActualWeight, 3)}</div>
                                          <div className="pcs4A border_right4A code4A_text">{notZero(elem?.IssuePcs) !== "" && NumberWithCommas(notZero(elem?.IssuePcs), 0)}</div>
                                          <div className="wt4A border_right4A code4A_text">{notZero(elem?.IssuePcs) !== "" && fixedValues(notZero(elem?.IssueWeight), 3)}</div>
                                        </div>
                                      ) : (
                                        <div
                                          className="record_line_4A border_bottom4A"
                                          key={index}
                                        >
                                          <div className="code4A border_right4A code4A_text">
                                            {elem?.LimitedShapeQualityColorCode}
                                          </div>
                                          <div className="size4AS border_right4A code4A_text">
                                            {elem?.Sizename}
                                          </div>
                                          <div className="pcs4A border_right4A code4A_text"> {NumberWithCommas(elem?.ActualPcs, 0)} </div>
                                          <div className="wt4A border_right4A code4A_text"> {fixedValues(elem?.ActualWeight, 3)} </div>
                                          <div className="pcs4A border_right4A code4A_text">{notZero(elem?.IssuePcs) !== "" && NumberWithCommas(notZero(elem?.IssuePcs), 0)} </div>
                                          <div className="wt4A border_right4A code4A_text">{notZero(elem?.IssuePcs) !== "" && fixedValues(notZero(elem?.IssueWeight), 3)}</div>
                                        </div>
                                      );
                                    })}
                                    {ele?.length !== 0 &&
                                      Array.from(
                                        { length: ele?.length },
                                        (_, index) => (
                                          <div
                                            className="record_line_4A border_bottom4A"
                                            key={index}
                                          >
                                            <div className="code4A border_right4A code4A_text"></div>
                                            <div className="size4AS border_right4A code4A_text"></div>
                                            <div className="pcs4A border_right4A code4A_text"></div>
                                            <div className="wt4A border_right4A code4A_text"></div>
                                            <div className="pcs4A border_right4A code4A_text"></div>
                                            <div className="wt4A border_right4A code4A_text"></div>
                                          </div>
                                        )
                                      )}
                                  </div>
                                </div>
                                <div className="part_2_4B">
                                  <div className="img_sec_4A border-bottom border-black">
                                    <img
                                      src={
                                        e?.data?.DesignImage !== '' 
                                                ? e?.data?.DesignImage
                                          : require("../../assets/img/default.jpg")
                                      }
                                      alt=""
                                      onError={(e) => handleImageError(e)}
                                      loading="eager"
                                      id="img4B"
                                    />
                                  </div>
                                  <div className="barcode_sticker_4AB border-black">
                                    <div className="barcodeText4AB">
                                      <div className="BARCODE_TEXT_4A border_right4A">
                                        <div className="diamond_4A border_bottom4A diamond_text_4A dflex4Ak">
                                          DIAMOND
                                        </div>
                                        <div className="diamond_4A border_bottom4A diamond_text_4A dflex4Ak">
                                          {e?.additional?.dia?.ActualPcs}/
                                          {e?.additional?.dia?.ActualWeight?.toFixed(3)}
                                        </div>
                                        <div className="diamond_custom_4B border_bottom4A"></div>
                                      </div>
                                      <div className="BARCODE_TEXT_4A border_right4A">
                                        <div className="diamond_4A border_bottom4A diamond_text_4A dflex4Ak">
                                          CS
                                        </div>
                                        <div className="diamond_4A border_bottom4A diamond_text_4A dflex4Ak">
                                          {e?.additional?.clr?.ActualPcs}/
                                          {fixedValues(e?.additional?.clr?.ActualWeight, 2)}
                                        </div>
                                        <div className="diamond_custom_4B border_bottom4A"></div>
                                      </div>
                                      <div className="BARCODE_TEXT_4A border_right4A">
                                        <div className="diamond_4A border_bottom4A diamond_text_4A dflex4Ak">
                                          METAL
                                        </div>
                                        <div className="diamond_4A border_bottom4A diamond_text_4A dflex4Ak">
                                          {fixedValues(e?.data?.ActualGrossweight, 3)}
                                        </div>
                                        <div className="diamond_custom_4B "></div>
                                      </div>
                                    </div>
                                    <div className="barcode_img_4A barcode_img_4B">
                                      <BarcodeGenerator
                                        data={e?.data?.serialjobno}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="part_3_4A">
                                  <div className="cast_ins">
                                    CAST INS.:
                                    <span className="red_4A line_height_123">
                                      {checkInstruction(e?.data?.officeuse)}
                                      {(e?.data?.ProductInstruction?.length > 0 ? checkInstruction(e?.data?.ProductInstruction) : checkInstruction(e?.data?.QuoteRemark))}
                                    </span>
                                  </div>
                                </div>
                              </div>
                                </div>
                            );
                          }
                        )
                      )
                    } 
                    </> : (<>
                      <div className="container4A container4B" >
                              <div className="print4Apart_1 print4bpart_1">
                                <div className="part_1_4A">
                                  <div className="title4A jobDiaGold4A border_bottom4A">
                                    <div className="jobDiaGoldText4A ps-1">
                                      {e?.data?.serialjobno}
                                    </div>
                                    <div className="jobDiaGoldText4A">
                                      {e?.data?.Designcode}
                                    </div>
                                    <div className="jobDiaGoldText4A border_right4A pe-1" style={{ paddingRight: "2px" }}>
                                      {e?.data?.MetalType} {e?.data?.MetalColorCo}
                                    </div>
                                  </div>
                                  <div className="height_border_31_4A border_bottom4A">
                                    <div className="cust4A border_right4A">
                                      <div
                                        className="custText4A"
                                        style={{ paddingTop: "1px", height:"12px" }}
                                      >
                                        CUST
                                      </div>
                                      <div className="custTextRes4A ">
                                        {e?.data?.CustomerCode}
                                      </div>
                                    </div>
                                    <div className="ordDt4A border_right4A">
                                      <div
                                        className="custText4A"
                                        style={{ paddingTop: "1px", height:"12px" }}
                                      >
                                        ORD.DT.
                                      </div>
                                      <div className="custTextRes4A" style={{fontSize:`${e?.data?.orderDatef?.length > 7 ? '7.5pt' : '9pt'}`}}>
                                        {e?.data?.orderDatef ?? ""}
                                      </div>
                                    </div>
                                    <div className="delDt4A border_right4A">
                                      <div
                                        className="custText4A"
                                        style={{ paddingTop: "3px" }}
                                      >
                                        DEL.DT.
                                      </div>
                                      <div className="custTextRes4A" style={{fontSize:`${e?.data?.promiseDatef?.length > 7 ? '7.5pt' : '9pt'}`, lineHeight:"6px"}}>
                                        {e?.data?.promiseDatef ?? ""}
                                      </div>
                                    </div>
                                    <div className="size4AB border_right4A">
                                      <div
                                        className="custText4A"
                                        style={{ paddingTop: "1px", paddingLeft: "1px" }}
                                      >
                                        SIZE
                                      </div>
                                      <div className="custTextRes4A">
                                        {e?.data?.Size}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="title4A border_bottom4A d_flex4A">
                                    <div className="code4A border_right4A code4A_text d-flex align-items-center">
                                      CODE
                                    </div>
                                    <div className="size4AS border_right4A code4A_text d-flex align-items-center">
                                      SIZE
                                    </div>
                                    <div className="pcs4A border_right4A code4A_text d-flex align-items-center">
                                      PCS
                                    </div>
                                    <div className="wt4A border_right4A code4A_text d-flex align-items-center">
                                      WT
                                    </div>
                                    <div className="pcs4A border_right4A code4A_text d-flex align-items-center">
                                      PCS
                                    </div>
                                    <div className="wt4A border_right4A code4A_text d-flex align-items-center">
                                      WT
                                    </div>
                                  </div>
                                  <div className="height_23_4A border_bottom4A d_flex4A">
                                    <div
                                      className="code4A border_right4A code4A_text"
                                      style={{ width: "94pt" }}
                                    >
                                      <div className="code_4A_change height_23_4A code4A_text height_11_Print4a" style={{width:"90.6pt"}}>
                                        {e?.data?.MetalType} {e?.data?.MetalColorCo}
                                      </div>
                                    </div>
                                    <div className="pcs4A border_right4A code4A_text"></div>
                                    <div className="wt4A border_right4A code4A_text"></div>
                                    <div className="pcs4A border_right4A code4A_text"></div>
                                    <div className="wt4A border_right4A code4A_text"></div>
                                  </div>
                                  <div className="record_line_1">
                                    {/* {ele?.data.map((elem, index) => {
                                      return elem?.MasterManagement_DiamondStoneTypeid ===
                                        5 ? (
                                        <div className="record_line_4A border_bottom4A" key={index} >
                                          <div className="code4A border_right4A code4A_text" style={{ width: "94pt", lineHeight: "8px", }} >
                                            <div className="finding height_23_4A"> {elem?.Shapename} {elem?.Quality} {elem?.ColorName} </div>
                                          </div>
                                          <div className="pcs4A border_right4A code4A_text">{NumberWithCommas(elem?.ActualPcs, 0)}</div>
                                          <div className="wt4A border_right4A code4A_text">{fixedValues(elem?.ActualWeight, 3)}</div>
                                          <div className="pcs4A border_right4A code4A_text">{notZero(elem?.IssuePcs) !== "" && NumberWithCommas(notZero(elem?.IssuePcs), 0)}</div>
                                          <div className="wt4A border_right4A code4A_text">{notZero(elem?.IssuePcs) !== "" && fixedValues(notZero(elem?.IssueWeight), 3)}</div>
                                        </div>
                                      ) : (
                                        <div
                                          className="record_line_4A border_bottom4A"
                                          key={index}
                                        >
                                          <div className="code4A border_right4A code4A_text">
                                            {elem?.LimitedShapeQualityColorCode}
                                          </div>
                                          <div className="size4AS border_right4A code4A_text">
                                            {elem?.Sizename}
                                          </div>
                                          <div className="pcs4A border_right4A code4A_text"> {NumberWithCommas(elem?.ActualPcs, 0)} </div>
                                          <div className="wt4A border_right4A code4A_text"> {fixedValues(elem?.ActualWeight, 3)} </div>
                                          <div className="pcs4A border_right4A code4A_text">{notZero(elem?.IssuePcs) !== "" && NumberWithCommas(notZero(elem?.IssuePcs), 0)} </div>
                                          <div className="wt4A border_right4A code4A_text">{notZero(elem?.IssuePcs) !== "" && fixedValues(notZero(elem?.IssueWeight), 3)}</div>
                                        </div>
                                      );
                                      <div className="barcode_img_4A barcode_img_4B">
                                    })} */}
                                    {
                                      Array.from(
                                        { length: 14 },
                                        (_, index) => (
                                          <div
                                            className="record_line_4A border_bottom4A"
                                            key={index}
                                          >
                                            <div className="code4A border_right4A code4A_text"></div>
                                            <div className="size4AS border_right4A code4A_text"></div>
                                            <div className="pcs4A border_right4A code4A_text"></div>
                                            <div className="wt4A border_right4A code4A_text"></div>
                                            <div className="pcs4A border_right4A code4A_text"></div>
                                            <div className="wt4A border_right4A code4A_text"></div>
                                          </div>
                                        )
                                      )}
                                  </div>
                                </div>
                                <div className="part_2_4B">
                                  <div className="img_sec_4A border-bottom border-black">
                                    <img
                                      src={
                                        e?.data?.DesignImage !== '' 
                                                ? e?.data?.DesignImage
                                          : require("../../assets/img/default.jpg")
                                      }
                                      alt=""
                                      onError={(e) => handleImageError(e)}
                                      loading="eager"
                                      id="img4B"
                                    />
                                  </div>
                                  <div className="barcode_sticker_4AB border-black">
                                    <div className="barcodeText4AB">
                                      <div className="BARCODE_TEXT_4A border_right4A">
                                        <div className="diamond_4A border_bottom4A diamond_text_4A dflex4Ak">
                                          DIAMOND
                                        </div>
                                        <div className="diamond_4A border_bottom4A diamond_text_4A dflex4Ak">
                                          {e?.additional?.dia?.ActualPcs}/
                                          {e?.additional?.dia?.ActualWeight?.toFixed(3)}
                                        </div>
                                        <div className="diamond_custom_4B border_bottom4A"></div>
                                      </div>
                                      <div className="BARCODE_TEXT_4A border_right4A">
                                        <div className="diamond_4A border_bottom4A diamond_text_4A dflex4Ak">
                                          CS
                                        </div>
                                        <div className="diamond_4A border_bottom4A diamond_text_4A dflex4Ak">
                                          {e?.additional?.clr?.ActualPcs}/
                                          {fixedValues(e?.additional?.clr?.ActualWeight, 2)}
                                        </div>
                                        <div className="diamond_custom_4B border_bottom4A"></div>
                                      </div>
                                      <div className="BARCODE_TEXT_4A border_right4A">
                                        <div className="diamond_4A border_bottom4A diamond_text_4A dflex4Ak">
                                          METAL
                                        </div>
                                        <div className="diamond_4A border_bottom4A diamond_text_4A dflex4Ak">
                                          {fixedValues(e?.data?.ActualGrossweight, 3)}
                                        </div>
                                        <div className="diamond_custom_4B "></div>
                                      </div>
                                    </div>
                                    
                                    <div className=" barcode_img_4B">
                                      <BarcodeGenerator
                                        data={e?.data?.serialjobno}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="part_3_4A">
                                  <div className="cast_ins">
                                    CAST INS.:
                                    <span className="red_4A line_height_123">
                                      {checkInstruction(e?.data?.officeuse)}
                                      {(e?.data?.ProductInstruction?.length > 0 ? checkInstruction(e?.data?.ProductInstruction) : checkInstruction(e?.data?.QuoteRemark))}
                                    </span>
                                  </div>
                                </div>
                              </div>
                                </div>
                    </>)
                    }
                    <div className="container4A container4B" key={i + "a"}>
                        <div className="print4Apart_1 print4bpart_1">
                          <div className="part_1_container_4A container_print4bpart_1">
                            <div className="title4A jobDiaGold4A border_bottom4A">
                              <div className="jobDiaGoldText4A ps-1">
                                {e?.data?.serialjobno}
                              </div>
                              <div className="jobDiaGoldText4A">
                                {e?.data?.Designcode}
                              </div>
                              <div className="jobDiaGoldText4A border_right4A pe-1">
                                {e?.data?.MetalType} {e?.data?.MetalColorCo}
                              </div>
                            </div>
                            <div className="priority4b border_bottom4A">
                              <div className="border_right4A priority_text_4A priority_sec_4A ">
                                PRIORITY
                              </div>
                              <div className="border_right4A priority_text_4A loc4A ">
                                LOC
                              </div>
                              <div className="border_right4A priority_text_4A qc4A ">
                                Q.C.
                              </div>
                            </div>
                            <div className="sales_rep_4A border_bottom4A">
                              <div className="priority_sec_4A border_right4A">
                                <div
                                  className="sales_Rep_text_4A"
                                  style={{ paddingTop: "3px" }}
                                >
                                  SALES REP.
                                </div>
                                <div className="sales_Rep_letter_4A">
                                  {e?.data?.SalesrepCode}
                                </div>
                              </div>
                              <div className=" border_right4A  loc4A ">
                                <div
                                  className="sales_Rep_text_4A"
                                  style={{ paddingTop: "3px" }}
                                >
                                  FROSTING
                                </div>
                                <div className="sales_Rep_letter_4A">
                                  {e?.data?.MetalFrosting}
                                </div>
                              </div>
                              <div className=" border_right4A  qc4A ">
                                <div
                                  className="sales_Rep_text_4A"
                                  style={{ paddingTop: "3px" }}
                                >
                                  ENAMELING
                                </div>
                                <div className="sales_Rep_letter_4A">
                                  {e?.data?.Enamelling}
                                </div>
                              </div>
                            </div>
                            <div className="lab_self_4b border_bottom4A">
                              <div className="priority_sec_4A border_right4A d_flex_4a">
                                <div className="sales_Rep_text_4A">
                                  LAB {e?.data?.MasterManagement_labname}
                                </div>
                                <div className="sales_Rep_letter_4A">
                                  PO {e?.data?.PO}
                                </div>
                              </div>
                              <div className=" border_right4A  loc4A d_flex_4a ">
                                <div className="sales_Rep_text_4A">
                                  SNAP
                                </div>
                                <div className="sales_Rep_letter_4A">
                                  {
                                    e?.data
                                      ?.MasterManagement_ProductImageType
                                  }
                                </div>
                              </div>
                              <div className=" border_right4A  qc4A d_flex_4a ">
                                <div className="sales_Rep_text_4A">
                                  MAKETYPE
                                </div>
                                <div className="sales_Rep_letter_4A">
                                  {e?.data?.mastermanagement_maketypename}
                                </div>
                              </div>
                            </div>
                            <div className="priority4b border_bottom4A">
                              <div className="border_right4A priority_text_4A priority_sec_4A ">
                                TR NO.
                              </div>
                              <div className="border_right4A priority_text_4A loc4A ">
                                TR NO.
                              </div>
                              <div className="border_right4A priority_text_4A qc4A ">
                                TR NO.
                              </div>
                            </div>
                            <div className="priority4b border_bottom4A">
                              <div className="border_right4A priority_text_4A priority_sec_4A ">
                                TR WT
                              </div>
                              <div className="border_right4A priority_text_4A loc4A ">
                                TR WT
                              </div>
                              <div className="border_right4A priority_text_4A qc4A ">
                                TR WT
                              </div>
                            </div>
                          </div>
                          <div className="part_2_container_4A container_print4bpart_1">
                            <div className="img_sec_container_4b border-bottom border-black">
                              <img
                                src={
                                  e?.data?.DesignImage !== '' 
                                          ? e?.data?.DesignImage
                                    : require("../../assets/img/default.jpg")
                                }
                                alt=""
                                onError={(e) => handleImageError(e)}
                                loading="eager"
                                id="img4b"
                              />
                            </div>
                          </div>
                          <div className="part_3_container_4b">
                            <div className="part_3_container_4A_sec">
                              <div className="part_3_container_4A_record border_bottom4A part_3_container_4b_record">
                                <div className="dept_4A border_right4A d-flex align-items-center justify-content-center">
                                  DEPT
                                </div>
                                <div className="issue_4A border_right4A d-flex align-items-center justify-content-center">
                                  ISSUE
                                </div>
                                <div className="receive_4A border_right4A d-flex align-items-center justify-content-center">
                                  RECEIVE
                                </div>
                                <div className="scrap_4A border_right4A d-flex align-items-center justify-content-center">
                                  QC.Sign
                                </div>
                                <div className="pcs_4A border_right4A d-flex align-items-center justify-content-center">
                                  PCS
                                </div>
                                <div className="worker_4A border_right_4A d-flex align-items-center justify-content-center">
                                  WORKER
                                </div>
                              </div>
                              
                              <div className="part_3_container_4A_record border_bottom4A part_3_container_4b_record">
                                <div className="dept_4A border_right4A d-flex align-items-center px-1">
                                  FIL.
                                </div>
                                <div className="issue_4A border_right4A"></div>
                                <div className="receive_4A border_right4A"></div>
                                <div className="scrap_4A border_right4A"></div>
                                <div className="pcs_4A border_right4A"></div>
                                <div className="worker_4A border_right_4A"></div>
                              </div>
                              <div className="part_3_container_4A_record border_bottom4A part_3_container_4b_record">
                                <div className="dept_4A border_right4A d-flex align-items-center px-1">
                                  PPL.
                                </div>
                                <div className="issue_4A border_right4A"></div>
                                <div className="receive_4A border_right4A"></div>
                                <div className="scrap_4A border_right4A"></div>
                                <div className="pcs_4A border_right4A"></div>
                                <div className="worker_4A border_right_4A"></div>
                              </div>
                              <div className="part_3_container_4A_record border_bottom4A part_3_container_4b_record">
                                <div className=" dept_4A border_right4A d-flex align-items-center px-1">
                                  SET.
                                </div>
                                <div className="issue_4A border_right4A"></div>
                                <div className="receive_4A border_right4A"></div>
                                <div className="scrap_4A border_right4A"></div>
                                <div className="pcs_4A border_right4A"></div>
                                <div className="worker_4A border_right_4A"></div>
                              </div>
                              <div className="part_3_container_4A_record border_bottom4A part_3_container_4b_record">
                                <div className=" dept_4A border_right4A d-flex align-items-center px-1">
                                  CUT.
                                </div>
                                <div className="issue_4A border_right4A"></div>
                                <div className="receive_4A border_right4A"></div>
                                <div className="scrap_4A border_right4A"></div>
                                <div className="pcs_4A border_right4A"></div>
                                <div className="worker_4A border_right_4A"></div>
                              </div>
                              <div className="part_3_container_4A_record border_bottom4A part_3_container_4b_record">
                                <div className=" dept_4A border_right4A d-flex align-items-center px-1">
                                  Fin.W
                                </div>
                                <div className="issue_4A border_right4A"></div>
                                <div className="receive_4A border_right4A"></div>
                                <div className="scrap_4A border_right4A"></div>
                                <div className="pcs_4A border_right4A"></div>
                                <div className="worker_4A border_right_4A"></div>
                              </div>
                              <div className="part_3_container_4A_record border_bottom4A part_3_container_4b_record">
                                <div className=" dept_4A border_right4A d-flex align-items-center px-1">
                                  F.PoI.
                                </div>
                                <div className="issue_4A border_right4A"></div>
                                <div className="receive_4A border_right4A"></div>
                                <div className="scrap_4A border_right4A"></div>
                                <div className="pcs_4A border_right4A"></div>
                                <div className="worker_4A border_right_4A"></div>
                              </div>
                              <div className="part_3_container_4A_record border_bottom4A part_3_container_4b_record">
                                <div className=" dept_4A border_right4A d-flex align-items-center px-1">
                                  Fit.
                                </div>
                                <div className="issue_4A border_right4A"></div>
                                <div className="receive_4A border_right4A"></div>
                                <div className="scrap_4A border_right4A"></div>
                                <div className="pcs_4A border_right4A"></div>
                                <div className="worker_4A border_right_4A"></div>
                              </div>
                              <div className="part_3_container_4A_record border_bottom4A part_3_container_4b_record">
                                <div className=" dept_4A border_right4A d-flex align-items-center px-1">
                                  FP.
                                </div>
                                <div className="issue_4A border_right4A"></div>
                                <div className="receive_4A border_right4A"></div>
                                <div className="scrap_4A border_right4A"></div>
                                <div className="pcs_4A border_right4A"></div>
                                <div className="worker_4A border_right_4A"></div>
                              </div>
                              <div className="part_3_container_4A_record border_bottom4A part_3_container_4b_record">
                                <div className=" dept_4A border_right4A d-flex align-items-center">

                                </div>
                                <div className="issue_4A border_right4A"></div>
                                <div className="receive_4A border_right4A"></div>
                                <div className="scrap_4A border_right4A"></div>
                                <div className="pcs_4A border_right4A"></div>
                                <div className="worker_4A border_right_4A"></div>
                              </div>
                              <div className="part_3_container_4A_record border_bottom4A part_3_container_4b_record">
                                <div className=" dept_4A border_right4A d-flex align-items-center">

                                </div>
                                <div className="issue_4A border_right4A"></div>
                                <div className="receive_4A border_right4A"></div>
                                <div className="scrap_4A border_right4A"></div>
                                <div className="pcs_4A border_right4A"></div>
                                <div className="worker_4A border_right_4A"></div>
                              </div>
                              <div className="part_3_container_4A_record border_bottom4A part_3_container_4b_record">
                                <div className=" dept_4A border_right4A d-flex align-items-center">

                                </div>
                                <div className="issue_4A border_right4A"></div>
                                <div className="receive_4A border_right4A"></div>
                                <div className="scrap_4A border_right4A"></div>
                                <div className="pcs_4A border_right4A"></div>
                                <div className="worker_4A border_right_4A"></div>
                              </div>
                              <div className="part_3_container_4A_record border_bottom4A part_3_container_4b_record">
                                <div className=" dept_4A border_right4A d-flex align-items-center ">
                                </div>
                                <div className="issue_4A border_right4A"></div>
                                <div className="receive_4A border_right4A"></div>
                                <div className="scrap_4A border_right4A"></div>
                                <div className="pcs_4A border_right4A"></div>
                                <div className="worker_4A border_right_4A"></div>
                              </div>
                              <div className="part_3_container_4A_record border_bottom4A part_3_container_4b_record">
                                <div className=" dept_4A border_right4A d-flex align-items-center">
                                </div>
                                <div className="issue_4A border_right4A"></div>
                                <div className="receive_4A border_right4A"></div>
                                <div className="scrap_4A border_right4A"></div>
                                <div className="pcs_4A border_right4A"></div>
                                <div className="worker_4A border_right_4A"></div>
                              </div>

                            </div>
                            <div className="barcode_img_container_4B">
                              <BarcodeGenerator
                                data={e?.data?.serialjobno}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                  </React.Fragment>
                );
              })
            }
          </section>
        </>
      )}
    </>
  );
};

export default BagPrint4B;
