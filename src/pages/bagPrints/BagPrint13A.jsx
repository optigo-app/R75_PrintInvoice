import queryString from "query-string";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../../assets/css/bagprint/print13A.css";
import { GetChunkData } from "../../GlobalFunctions/GetChunkData";
import { GetData } from "../../GlobalFunctions/GetData";
import { handleImageError } from "../../GlobalFunctions/HandleImageError";
import { handlePrint } from "../../GlobalFunctions/HandlePrint";
import BarcodeGenerator from "../../components/BarcodeGenerator";
import Loader from "../../components/Loader";
import { organizeData } from "../../GlobalFunctions/OrganizeBagPrintData";
import { GetUniquejob } from "../../GlobalFunctions/GetUniqueJob";
import { checkInstruction } from '../../GlobalFunctions';

const BagPrint13A = ({ queries, headers }) => {
  const [data, setData] = useState([]);
  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const resultString = GetUniquejob(queryParams?.str_srjobno);
  const chunkSize17 = 16;
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
          let DiamondList = [];
          let ColorStoneList = [];
          let MiscList = [];
          let FindingList = [];
          // eslint-disable-next-line array-callback-return
          a?.rd1?.map((e, i) => {
            if (e?.ConcatedFullShapeQualityColorCode !== "- - - ") {
              length++;
            }
            if (e?.MasterManagement_DiamondStoneTypeid === 3) {
              DiamondList.push(e);
              dia.ActualPcs = dia.ActualPcs + e?.ActualPcs;
              dia.ActualWeight = dia.ActualWeight + e?.ActualWeight;
            } else if (e?.MasterManagement_DiamondStoneTypeid === 4) {
              ColorStoneList.push(e);
              clr.ActualPcs = clr.ActualPcs + e?.ActualPcs;
              clr.ActualWeight = clr.ActualWeight + e?.ActualWeight;
            } else if (e?.MasterManagement_DiamondStoneTypeid === 5) {
              FindingList.push(e);
              f.ActualPcs = f.ActualPcs + e?.ActualPcs;
              f.ActualWeight = f.ActualWeight + e?.ActualWeight;
            } else if (e?.MasterManagement_DiamondStoneTypeid === 7) {
              MiscList.push(e);
              misc.ActualPcs = misc.ActualPcs + e?.ActualPcs;
              misc.ActualWeight = misc.ActualWeight + e?.ActualWeight;
            }
          });
          dia.ActualPcs = +dia.ActualPcs?.toFixed(3);
          dia.ActualWeight = +dia.ActualWeight?.toFixed(3);
          clr.ActualPcs = +clr.ActualPcs?.toFixed(3);
          clr.ActualWeight = +clr.ActualWeight?.toFixed(3);
          misc.ActualPcs = +misc.ActualPcs?.toFixed(3);
          misc.ActualWeight = +misc.ActualWeight?.toFixed(3);
          f.ActualPcs = +f.ActualPcs?.toFixed(3);
          f.ActualWeight = +f.ActualWeight?.toFixed(3);
          let arr = [];
          let mainArr = arr?.concat(
            DiamondList,
            ColorStoneList,
            MiscList,
            FindingList
          );
          let imagePath = queryParams?.imagepath;
          imagePath = atob(queryParams?.imagepath);

          let img = imagePath + a?.rd?.ThumbImagePath;
          let arrofchunk = GetChunkData(chunkSize17, mainArr);
          
          responseData.push({
            data: a,
            additional: {
              length: length,
              clr: clr,
              dia: dia,
              f: f,
              img: img,
              misc: misc,
              pages: arrofchunk,
            },
          });
        })
        setData(responseData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data?.length !== 0) {
      setTimeout(() => {
        window.print();
      }, 5000);
    }
  }, [data]);
  return (
    <>
      {data?.length === 0 ? (
        <Loader />
      ) : (
        <>
          <div className="print_btn">
            <button
              className="btn_white blue print_btn"
              onClick={(e) => handlePrint(e)}
            >
              Print
            </button>
          </div>

          <div className="bag13Afinal pad_60_allPrint">
            {Array.from(
              { length: queries.pageStart },
              (_, index) =>
                index > 0 && (
                  <div
                    key={index}
                    className="container13A"
                    style={{ border: "0px" }}
                  ></div>
                )
            )}
            {data?.length > 0 &&
              data?.map((e, i) => {
                
                return (
                  <React.Fragment key={i}>
                    {e?.additional?.pages?.length > 0 ? (
                      e?.additional?.pages.map((ele, index) => {
                        return (
                          <div className="container13A" key={index}>
                            <div className="bag13A">
                              <div className="flex13A">
                                <div className="header13A">
                                  <div className="head13A">
                                    <div className="head13Ajob ">
                                      <div className="lineH13A">
                                        {e?.data?.rd?.serialjobno}
                                      </div>
                                      <div className="lineH13A">
                                        {e?.data?.rd?.Designcode}
                                      </div>
                                      <div className="lineH13A">
                                        {e?.data?.rd?.MetalType}{" "}
                                        {e?.data?.rd?.MetalColorCo}
                                      </div>
                                    </div>
                                    <div className="head13Ainfo ">
                                      <div className="info13Amid">
                                        <p className="f13A diffColor">CUST.</p>
                                        <p className="f13A">
                                          {e?.data?.rd?.CustomerCode}
                                        </p>
                                      </div>
                                      <div className="info13Amid">
                                        <p className="f13A diffColor">
                                          ORD. DT.
                                        </p>
                                        <p className="f13A">
                                          {e?.data?.rd?.orderDatef ?? ""}
                                        </p>
                                      </div>
                                      <div className="info13Aend">
                                        <p className="f13A diffColor">
                                          DEL. DT.
                                        </p>
                                        <p className="f13A">
                                          {/* {e?.data?.rd?.promiseDatef ?? ""} */}
                                        </p>
                                      </div>
                                      <div className="info13Alast">
                                        <p
                                          className="f13A diffColor"
                                          style={{ borderRight: "0px" }}
                                        >
                                          SIZE
                                        </p>
                                        <p
                                          className="f13A"
                                          style={{ borderRight: "0px" }}
                                        >
                                          {e?.data?.rd?.Size}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="section13A">
                                  <div className="seaction13AheadA">
                                    <div className="seaction13AheadCode">
                                      CODE
                                    </div>
                                    <div className="seaction13AheadSize">
                                      SIZE
                                    </div>
                                    <div className="seaction13AheadPcs">
                                      PCS
                                    </div>
                                    <div className="seaction13AheadWT">WT</div>
                                    <div className="seaction13AheadPcs">
                                      PCS
                                    </div>
                                    <div className="seaction13AheadWT">WT</div>
                                  </div>
                                  <div className="seaction13AheadA">
                                    <div
                                      className="seaction13AheadCode"
                                      style={{ fontWeight: "normal" }}
                                    >
                                      {e?.data?.rd?.MetalType}{" "}
                                      {e?.data?.rd?.MetalColorCo}
                                    </div>
                                    <div className="seaction13AheadSize"></div>
                                    <div className="seaction13AheadPcs"></div>
                                    <div className="seaction13AheadWT"></div>
                                    <div className="seaction13AheadPcs"></div>
                                    <div className="seaction13AheadWT"></div>
                                  </div>
                                  {ele?.data.map((a, i) => {
                                    return (
                                      <div key={i}>
                                        {a.MasterManagement_DiamondStoneTypeid ===
                                        5 ? (
                                          <div
                                            className="seaction13Amid"
                                            key={i}
                                          >
                                            <div
                                              className="seaction13Ahead"
                                              style={{ fontWeight: "normal" }}
                                            >
                                              <div
                                                className="seaction13AheadCode truncated-text"
                                                style={{ width: "134px" }}
                                              >
                                                {
                                                  a?.ConcatedFullShapeQualityColorCode
                                                }
                                              </div>
                                              <div className="seaction13AheadPcs">
                                                {a?.ActualPcs}
                                              </div>
                                              <div className="seaction13AheadWT">
                                                {a?.ActualWeight?.toFixed(2)}
                                              </div>
                                              <div className="seaction13AheadPcs"></div>
                                              <div className="seaction13AheadWT"></div>
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="seaction13Amid" key={i} >
                                            <div className="seaction13Ahead" style={{ fontWeight: "normal" }} >
                                              {a?.Shapename === "TOTAL" ? (
                                                <div className="seaction13AheadCode">
                                                  {a?.Shapename}
                                                </div>
                                              ) : (
                                                <div className="seaction13AheadCode truncated-text">
                                                  {
                                                    a?.LimitedShapeQualityColorCode
                                                  }
                                                </div>
                                              )}
                                              <div className="seaction13AheadSize">
                                                {a?.Sizename}
                                              </div>
                                              <div className="seaction13AheadPcs">
                                                {a?.ActualPcs}
                                              </div>
                                              <div className="seaction13AheadWT">
                                                { a?.MasterManagement_DiamondStoneTypeid === 3 ? a?.ActualWeight?.toFixed(3) : a?.ActualWeight?.toFixed(2)}
                                              </div>
                                              <div className="seaction13AheadPcs"></div>
                                              <div className="seaction13AheadWT"></div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                  {Array.from(
                                    { length: ele?.length },
                                    (_, index) => (
                                      <div
                                        className="seaction13Amid"
                                        key={index}
                                      >
                                        <div
                                          className="seaction13Ahead"
                                          style={{ fontWeight: "normal" }}
                                        >
                                          <div className="seaction13AheadCode"></div>
                                          <div className="seaction13AheadSize"></div>
                                          <div className="seaction13AheadPcs"></div>
                                          <div className="seaction13AheadWT"></div>
                                          <div className="seaction13AheadPcs"></div>
                                          <div className="seaction13AheadWT"></div>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                                <div className="footer13A imp13A">
                                  <p className="footer13AIns">
                                    {" "}
                                    <span
                                      className="footer13AIns fw-bold"
                                      style={{
                                        color: "red",
                                        paddingLeft: "2px",
                                        lineHeight: "11px",
                                      }}
                                    >
                                      <span className="text-black fw-normal">CAST INS.</span>
                                      {(" " + checkInstruction(e?.data?.rd?.officeuse) + " " + (e?.data?.rd?.ProductInstruction?.length > 0 ? checkInstruction(e?.data?.rd?.ProductInstruction) : checkInstruction(e?.data?.rd?.QuoteRemark)))?.slice(0, 230)}
                                    </span>
                                  </p>
                                </div>
                              </div>
                              <div className="aside13A">
                                <div className="imgPart13A">
                                  <div className="img13A">
                                    <img
                                      src={
                                        e?.data?.rd?.DesignImage !== '' 
                                          ? e?.data?.rd?.DesignImage
                                          : require("../../assets/img/default.jpg")
                                      }
                                      id="img13A"
                                      alt=""
                                      onError={(e) => handleImageError(e)}
                                      loading="eager"
                                    />
                                  </div>
                                  <div className="barcodeInfo13A">
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <div className="diaInfo13A">
                                        <div className="diaflex13A">
                                          <p className="f13Aval">DIAMOND</p>
                                          <p className="diaVal13A">
                                            {e?.additional?.dia?.ActualPcs}/
                                            {e?.additional?.dia?.ActualWeight.toFixed(
                                              3
                                            )}
                                          </p>{" "}
                                        </div>
                                      </div>
                                      <div className="diaInfo13A">
                                        <div className="diaflex13A">
                                          <p
                                            className="f13Aval"
                                            style={{ height: "33px" }}
                                          ></p>{" "}
                                        </div>
                                      </div>
                                      <div className="diaInfo13A">
                                        <div className="diaflex13A">
                                          <p className="f13Aval">CS</p>
                                          <p className="diaVal13A">
                                            {e?.additional?.clr?.ActualPcs}/
                                            {e?.additional?.clr?.ActualWeight.toFixed(
                                              2
                                            )}
                                          </p>{" "}
                                        </div>
                                      </div>
                                      <div className="diaInfo13A">
                                        <div className="diaflex13A">
                                          <p
                                            className="f13Aval"
                                            style={{ height: "33px" }}
                                          ></p>{" "}
                                        </div>
                                      </div>
                                      <div className="diaInfo13A">
                                        <div className="diaflex13A">
                                          <p className="f13Aval">METAL</p>
                                          <p className="diaVal13A">
                                            {/* {e?.data?.rd?.netwt.toFixed(2)} */}
                                            {e?.data?.rd?.ActualGrossweight?.toFixed(3)}
                                          </p>{" "}
                                        </div>
                                      </div>
                                      <div
                                        style={{
                                          borderRight: "1px solid #989898",
                                          height: "41px",
                                        }}
                                      ></div>
                                    </div>
                                    <div className="barcode13A">
                                      {e?.data?.rd?.length !== 0 &&
                                        e?.data?.rd !== undefined && (
                                          <>
                                            {e?.data?.rd?.serialjobno !==
                                              undefined && (
                                              <BarcodeGenerator
                                                data={
                                                  e?.data?.rd?.serialjobno
                                                }
                                              />
                                            )}
                                          </>
                                        )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="container13A">
                        <div className="bag13A">
                          <div className="flex13A">
                            <div className="header13A">
                              <div className="head13A">
                                <div className="head13Ajob">
                                  <div>{e?.data?.rd?.serialjobno}</div>
                                  <div>{e?.data?.rd?.Designcode}</div>
                                  <div>{e?.data?.rd?.MetalType}</div>
                                  <div>{e?.data?.rd?.MetalColorCo}</div>
                                </div>
                                <div className="head13Ainfo">
                                  <div className="info13Amid">
                                    <p className="f13A diffColor">CUST.</p>
                                    <p className="f13A">
                                      {e?.data?.rd?.CustomerCode}
                                    </p>
                                  </div>
                                  <div className="info13Amid">
                                    <p className="f13A diffColor">ORD. DT.</p>
                                    <p className="f13A">
                                      {e?.data?.rd?.orderDatef ?? ""}
                                    </p>
                                  </div>
                                  <div className="info13Aend">
                                    <p className="f13A diffColor">DEL. DT.</p>
                                    <p className="f13A">
                                      {e?.data?.rd?.promiseDatef ?? ""}
                                    </p>
                                  </div>
                                  <div className="info13Alast">
                                    <p
                                      className="f13A diffColor"
                                      style={{ borderRight: "0px" }}
                                    >
                                      SIZE
                                    </p>
                                    <p
                                      className="f13A"
                                      style={{ borderRight: "0px" }}
                                    >
                                      {e?.data?.rd?.Size}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="section13A">
                              <div className="seaction13AheadA">
                                <div className="seaction13AheadCode">CODE</div>
                                <div className="seaction13AheadSize">SIZE</div>
                                <div className="seaction13AheadPcs">PCS</div>
                                <div className="seaction13AheadWT">WT</div>
                                <div className="seaction13AheadPcs">PCS</div>
                                <div className="seaction13AheadWT">WT</div>
                              </div>
                              {Array.from({ length: 17 }, (_, index) => (
                                <div className="seaction13Amid" key={index}>
                                  <div
                                    className="seaction13Ahead"
                                    style={{ fontWeight: "normal" }}
                                  >
                                    <div className="seaction13AheadCode"></div>
                                    <div className="seaction13AheadSize"></div>
                                    <div className="seaction13AheadPcs"></div>
                                    <div className="seaction13AheadWT"></div>
                                    <div className="seaction13AheadPcs"></div>
                                    <div className="seaction13AheadWT"></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="footer13A imp13A">
                              <p className="footer13AIns">
                                {" "}
                                <span
                                  className="footer13AIns fw-bold"
                                  style={{
                                    color: "red",
                                    paddingLeft: "2px",
                                    lineHeight: "11px",
                                  }}
                                >
                                  <span className="text-center fw-normal">CUST INS.</span>
                                  {(" " + checkInstruction(e?.data?.rd?.officeuse) + " " + (e?.data?.rd?.ProductInstruction?.length > 0 ? checkInstruction(e?.data?.rd?.ProductInstruction) : checkInstruction(e?.data?.rd?.QuoteRemark)))?.slice(0, 230)}
                                </span>
                              </p>
                            </div>
                          </div>
                          <div className="aside13A">
                            <div className="imgPart13A">
                              <div className="img13A">
                                <img
                                  src={
                                    e?.data?.rd?.DesignImage !== '' 
                                          ? e?.data?.rd?.DesignImage
                                      : require("../../assets/img/default.jpg")
                                  }
                                  id="img13A"
                                  alt=""
                                  onError={(e) => handleImageError(e)}
                                  loading="eager"
                                 
                                />
                              </div>
                              <div className="barcodeInfo13A">
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <div className="diaInfo13A">
                                    <div className="diaflex13A">
                                      <p className="f13Aval">DIAMOND</p>
                                      <p className="diaVal13A">
                                        {e?.additional?.dia?.ActualPcs}/
                                        {e?.additional?.dia?.ActualWeight.toFixed(
                                          2
                                        )}
                                      </p>{" "}
                                    </div>
                                  </div>
                                  <div className="diaInfo13A">
                                    <div className="diaflex13A">
                                      <p
                                        className="f13Aval"
                                        style={{ height: "33px" }}
                                      ></p>{" "}
                                    </div>
                                  </div>
                                  <div className="diaInfo13A">
                                    <div className="diaflex13A">
                                      <p className="f13Aval">CS</p>
                                      <p className="diaVal13A">
                                        {e?.additional?.clr.ActualPcs}/
                                        {e.additional.clr.ActualWeight.toFixed(
                                          2
                                        )}
                                      </p>{" "}
                                    </div>
                                  </div>
                                  <div className="diaInfo13A">
                                    <div className="diaflex13A">
                                      <p
                                        className="f13Aval"
                                        style={{ height: "33px" }}
                                      ></p>{" "}
                                    </div>
                                  </div>
                                  <div className="diaInfo13A">
                                    <div className="diaflex13A">
                                      <p className="f13Aval">METAL</p>
                                      <p className="diaVal13A">
                                        {e.additional.misc.ActualPcs}/
                                        {e.additional.misc.ActualWeight.toFixed(
                                          2
                                        )}
                                      </p>{" "}
                                    </div>
                                  </div>
                                  <div
                                    style={{
                                      borderRight: "1px solid #989898",
                                      height: "41px",
                                    }}
                                  ></div>
                                </div>
                                <div className="barcode13A">
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
                        </div>
                      </div>
                    )}

                    <div className="container13A">
                      <div className="header13AD">
                        <div className="sectionHead13A ">
                          <div className="head13AjobD ">
                            <div>{e?.data?.rd?.serialjobno}</div>
                            <div>{e?.data?.rd?.Designcode}</div>
                            <div>
                              {e?.data?.rd?.MetalType}{" "}
                              {e?.data?.rd?.MetalColorCo}
                            </div>
                          </div>
                          <div className="mat13AD">
                            <div
                              className="border13A d-flex align-items-center justify-content-center"
                              style={{
                                color: "#c7c7c7",
                                // textAlign: "center",
                                // paddingTop: "2px",
                              }}
                            >
                              PRIORITY
                            </div>
                            <div
                              className="border13A d-flex align-items-center justify-content-center"
                              style={{
                                color: "#c7c7c7",
                                // textAlign: "center",
                                // paddingTop: "2px",
                              }}
                            >
                              LOC.
                            </div>
                            <div
                              className="border13A d-flex align-items-center justify-content-center"
                              style={{
                                borderRight: "0px",
                                color: "#c7c7c7",
                                // textAlign: "center",
                                // paddingTop: "2px",
                              }}
                            >
                              Q.C.
                            </div>
                          </div>
                          <div className="mat13ADE border-bottom border-black ">
                            <div className="border13A hw13A h-100">
                              <p className="f13ADuplicate">SALES REP.</p>{" "}
                              <p className="f13ADuplicate">
                                {e?.data?.rd?.SalesrepCode}
                              </p>
                            </div>
                            <div className="border13A hw13A h-100">
                              <p className="f13ADuplicate">FROSTING</p>{" "}
                              <p className="f13ADuplicate">
                                {e?.data?.rd?.MetalFrosting}
                              </p>
                            </div>
                            <div
                              className="border13A hw13A h-100"
                              style={{ borderRight: "0px" }}
                            >
                              <p className="f13ADuplicate">ENAMELING</p>
                              <p className="f13ADuplicate">
                                {e?.data?.rd?.Enamelling}
                              </p>
                            </div>
                          </div>
                          <div className="mat13ADE border-bottom border-black ">
                            <div className="border13A hw13A h-100">
                              <p
                                className="f13ADuplicate"
                                style={{ fontSize: "8px", fontWeight: "bold" }}
                              >
                                LAB
                              </p>
                              <p
                                className="f13ADuplicate"
                                style={{ fontSize: "7px", lineHeight:'7px' }}
                              >
                                {e?.data?.rd?.MasterManagement_labname}
                              </p>
                              <p
                                className="f13ADuplicate"
                                style={{ fontSize: "7px", lineHeight:'7px' }}
                              >
                                PO {e?.data?.rd?.PO}
                              </p>
                            </div>
                            <div className="border13A hw13A h-100">
                              <p className="f13ADuplicate">SNAP</p>
                              <p className="f13ADuplicate">
                                {
                                  e?.data?.rd
                                    ?.MasterManagement_ProductImageType
                                }
                              </p>
                            </div>
                            <div
                              className="border13A hw13A h-100"
                              style={{ borderRight: "0px" }}
                            >
                              <p className="f13ADuplicate">MAKETYPE</p>
                              <p className="f13ADuplicate">
                                {e?.data?.rd?.mastermanagement_maketypename}
                              </p>{" "}
                            </div>
                          </div>
                          <div className="mat13AD border-bottom border-black">
                            <div
                              className="border13A d-flex align-items-center justify-content-center"
                              style={{
                                color: "#c7c7c7",
                                // textAlign: "center",
                                // paddingTop: "2px",
                              }}
                            >
                              TR NO.
                            </div>
                            <div
                              className="border13A d-flex align-items-center justify-content-center"
                              style={{
                                color: "#c7c7c7",
                                // textAlign: "center",
                                // paddingTop: "2px",
                              }}
                            >
                              TR NO.
                            </div>
                            <div
                              className="border13A d-flex align-items-center justify-content-center"
                              style={{
                                borderRight: "0px",
                                color: "#c7c7c7",
                                // textAlign: "center",
                                // paddingTop: "2px",
                              }}
                            >
                              TR NO.
                            </div>
                          </div>
                          <div
                            className="mat13AD border-bottom border-black"
                            style={{ borderBottom: "0px" }}
                          >
                            <div
                              className="border13A d-flex align-items-center justify-content-center"
                              style={{
                                color: "#c7c7c7",
                                // textAlign: "center",
                                // paddingTop: "2px",
                              }}
                            >
                              TR WT.
                            </div>
                            <div
                              className="border13A d-flex align-items-center justify-content-center"
                              style={{
                                color: "#c7c7c7",
                                // textAlign: "center",
                                // paddingTop: "2px",
                              }}
                            >
                              TR WT.
                            </div>
                            <div
                              className="border13A d-flex align-items-center justify-content-center"
                              style={{
                                borderRight: "0px",
                                color: "#c7c7c7",
                                // textAlign: "center",
                                // paddingTop: "2px",
                              }}
                            >
                              TR WT.
                            </div>
                          </div>
                        </div>
                        <div className="img13AD">
                          <img
                            src={
                              e?.data?.rd?.DesignImage !== '' 
                                          ? e?.data?.rd?.DesignImage
                                : require("../../assets/img/default.jpg")
                            }
                            id="img13A"
                            alt=""
                            onError={(e) => handleImageError(e)}
                            loading="eager"
                          />
                        </div>
                      </div>
                      <div className="enteryBarcode13AD">
                        <div className="enteryBarcode13ADyn">
                          <div
                            className="entry13AHead  "
                            style={{ fontWeight: "normal", width: "290px" }}
                          >
                            <div className="rmcode13a" style={{ width: "43px" }}>
                              DEPT.{" "}
                            </div>
                            <div className="rmcode13a" style={{ width: "52px" }}>
                              ISSUE
                            </div>
                            <div className="rmcode13a" style={{ width: "52px" }}>
                              RECEIVE
                            </div>
                            <div className="rmcode13a" style={{ width: "52px" }}>
                              SCRAP
                            </div>
                            <div className="rmcode13a" style={{ width: "37px" }}>
                              PCS
                            </div>
                            <div
                              className="rmcode13a"
                              style={{ borderRight: "0px", width: "56px" }}
                            >
                              WORKER
                            </div>
                          </div>
                          <div className="entryheader13A">
                            <div
                              className="entry13AHeadD"
                              style={{ fontWeight: "normal" }}
                            >
                              <div
                                className="rmcode13aD"
                                style={{ width: "46px" }}
                              >
                                GRD.{" "}
                              </div>
                              <div
                                className="rmcode13aD"
                                style={{ width: "46px" }}
                              >
                                FIL.
                              </div>
                              <div
                                className="rmcode13aD"
                                style={{ width: "46px" }}
                              >
                                CNC.
                              </div>
                              <div
                                className="rmcode13aD"
                                style={{ width: "46px" }}
                              >
                                PPL.{" "}
                              </div>
                              <div
                                className="rmcode13aD"
                                style={{ width: "46px" }}
                              >
                                SET.
                              </div>
                              <div
                                className="rmcode13aD"
                                style={{ width: "46px" }}
                              >
                                ASM.
                              </div>
                              <div
                                className="rmcode13aD"
                                style={{ width: "46px" }}
                              >
                                FPL.
                              </div>
                              <div
                                className="rmcode13aD"
                                style={{ width: "46px" }}
                              >
                                PLT.
                              </div>
                              <div
                                className="rmcode13aD"
                                style={{
                                  borderBottom: "1px solid #989898",
                                  width: "46px",
                                }}
                              >
                                ENM.
                              </div>
                            </div>
                            {
                              <div>
                                {Array.from({ length: 9 }, (_, index) => (
                                  <div
                                    className="entry13AHeadEntry"
                                    key={index}
                                    style={{ fontWeight: "normal" }}
                                  >
                                    <div
                                      className="rmcode3aDE"
                                      style={{ width: "52px", borderRight: "1px solid #989898" }}
                                    ></div>
                                    <div
                                      className="rmcode3aDE"
                                      style={{ width: "51px", borderRight: "1px solid #989898" }}
                                    ></div>
                                    <div
                                      className="rmcode3aDE"
                                      style={{ width: "51px", borderRight: "1px solid #989898" }}
                                    ></div>
                                    <div
                                      className="rmcode3aDE"
                                      style={{ width: "37px", borderRight: "1px solid #989898" }}
                                    ></div>
                                    <div
                                      className="rmcode3aDE"
                                      style={{
                                        width: "56px",
                                        borderRight: "0px",
                                      }}
                                    ></div>
                                  </div>
                                ))}
                              </div>
                            }
                          </div>
                          <div className="" >
                            <div className="ins13Afooter ">
                              <div style={{ fontSize: "13px" }}>
                                <div className=" h-100" style={{width:'50px', borderRight:'1px solid #989898'}}>SLS. INS.</div>
                              </div>
                            </div>
                            <div className="ins13Afooter">
                              <div style={{ fontSize: "13px" }}>
                                <div className=" h-100" style={{width:'50px', borderRight:'1px solid #989898'}}>PRD. INS.</div>
                              </div>
                            </div>
                            <div
                              className="ins13Afooter"
                              style={{ borderBottom: "0px" }}
                            >
                              <div style={{ fontSize: "13px" }}>
                                <div className=" h-100" style={{width:'50px', borderRight:'1px solid #989898'}}>QC. INS.</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="barcode13AD ">
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
                  </React.Fragment>
                );
              })}
          </div>
        </>
      )}
    </>
  );
};

export default BagPrint13A;
