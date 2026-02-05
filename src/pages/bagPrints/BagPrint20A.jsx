import queryString from "query-string";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../../assets/css/bagprint/print20A.css";
import BarcodeGenerator from "../../components/BarcodeGenerator";
import Loader from "../../components/Loader";
import { GetData } from "../../GlobalFunctions/GetData";
import { GetUniquejob } from "../../GlobalFunctions/GetUniqueJob";
import { handleImageError } from "../../GlobalFunctions/HandleImageError";
import { handlePrint } from "../../GlobalFunctions/HandlePrint";
import { organizeData } from "../../GlobalFunctions/OrganizeBagPrintData";
import { GetChunkData } from "../../GlobalFunctions/GetChunkData";
import { checkArr, checkInstruction } from "../../GlobalFunctions";

const BagPrint20A = ({ queries, headers }) => {
  const [data, setData] = useState([]);
  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const resultString = GetUniquejob(queryParams?.str_srjobno);
  const chunkSize10 = 10;
  useEffect(() => {
    if (Object.keys(queryParams)?.length !== 0) {
      atob(queryParams?.imagepath);
    }

    const fetchData = async () => {
      try {
        const responseData = [];
        const objs = {
          jobno: resultString,
          custid: queries?.custid,
          printname: queries?.printname,
          appuserid: queries?.appuserid,
          url: queries?.url,
          headers: headers,
        };

        const allDatas = await GetData(objs);
        let datas = organizeData(allDatas?.rd, allDatas?.rd1);
        // eslint-disable-next-line array-callback-return
        datas?.map((a) => {
          
          let length = 0;
          let clr = {
            Shapename: "TOTAL",
            Sizename: "C TOTAL",
            ActualPcs: 0,
            ActualWeight: 0,
            MasterManagement_DiamondStoneTypeid: 4,
          };
          let dia = {
            Shapename: "TOTAL",
            Sizename: "D TOTAL",
            ActualPcs: 0,
            ActualWeight: 0,
            MasterManagement_DiamondStoneTypeid: 3,
          };
          let misc = {
            Shapename: "MISC TOTAL",
            Sizename: "MISC TOTAL",
            ActualPcs: 0,
            ActualWeight: 0,
            MasterManagement_DiamondStoneTypeid: 7,
          };
          let f = {
            Shapename: "TOTAL",
            Sizename: "F TOTAL",
            ActualPcs: 0,
            ActualWeight: 0,
            MasterManagement_DiamondStoneTypeid: 5,
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
          DiamondList?.push(dia);
          ColorStoneList?.push(clr);
          MiscList?.push(misc);
          FindingList?.push(f);
          
          let newDia = {
            Shapename: "",
            Sizename: "Diamond Detail",
            ActualPcs: "",
            ActualWeight: "",
            MasterManagement_DiamondStoneTypeid: 3,
          };
          let newCS = {
            Shapename: "",
            Sizename: "Colorstone Detail",
            ActualPcs: "",
            ActualWeight: "",
            MasterManagement_DiamondStoneTypeid: 4,
          };
          let newMisc = {
            Shapename: "",
            Sizename: "Misc Detail",
            ActualPcs: "",
            ActualWeight: "",
            MasterManagement_DiamondStoneTypeid: 7,
          };
          let newfind = {
            Shapename: "",
            Sizename: "Finding Detail",
            ActualPcs: "",
            ActualWeight: "",
            MasterManagement_DiamondStoneTypeid: 5,
          };

          DiamondList?.unshift(newDia);
          ColorStoneList?.unshift(newCS);
          MiscList?.unshift(newMisc);
          FindingList?.unshift(newfind);
          
          let mainArr = checkArr(
            DiamondList,
            ColorStoneList,
            MiscList,
            []
            // ArrofFSize
          );

          let imagePath = queryParams?.imagepath;
          imagePath = atob(queryParams?.imagepath);

          let img = imagePath + a?.rd?.ThumbImagePath;

          const arr =  GetChunkData(chunkSize10, mainArr);
            
          responseData.push({
            data: a,
            additional: {
              length: length,
              clr: clr,
              dia: dia,
              f: f,
              img: img,
              misc: misc,
              pages: arr,
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
    if (data?.length !== 0) {
      setTimeout(() => {
        window.print();
      }, 5000);
    }
  }, [data?.length]);
  return (
    <>
      {data?.length === 0 ? (
        <Loader />
      ) : (
        <>
          <div className="d-flex justify-content-end align-items-center mt-3 me-5">
            <button
              className="btn_white blue print_btn"
              onClick={(e) => handlePrint(e)}
            >
              Print
            </button>
          </div>
          <div className="d-flex flex-wrap mb-5 pad_60_allPrint">
            {Array.from(
              { length: queries?.pageStart },
              (_, index) =>
                index > 0 && (
                  <div
                    key={index}
                    className="container7Acopy"
                    style={{ border: "0px" }}
                  ></div>
                )
            )}
            {data?.length > 0 &&
              data?.map((e, i) => {
                return (
                  <React.Fragment key={i}>
                    {e?.additional?.pages?.length > 0 ? (
                      e?.additional?.pages?.map((el, index) => {
                        return (
                          <React.Fragment key={index}>
                            <div className="container7Acopy ">
                              <div className="head7Acopy">
                                <div className="headerdesc7Acopy">
                                  <div className="headW7Acopy">
                                    <div className="jobno7Acopy">
                                      <div className="h-100 d-flex justify-content-center align-items-center">
                                        <span className="fs20A fw-bold pe-1">
                                          Odr Dt:
                                        </span>
                                        <span className="lh20A fs20A">
                                          {e?.data?.rd?.orderDatef}
                                        </span>
                                      </div>
                                      <div className="h-100 d-flex justify-content-center align-items-center">
                                        <span className="fs20A fw-bold pe-1">
                                          Due Dt:
                                        </span>
                                        <span className="lh20A fs20A">
                                          {e?.data?.rd?.promiseDatef}
                                        </span>
                                      </div>
                                      <div className="h-100 d-flex justify-content-center align-items-center">
                                        <span className="fs20A fw-bold pe-1">
                                          Party:
                                        </span>
                                        <span className="lh20A fs20A">
                                          {e?.data?.rd?.CustomerCode?.slice(
                                            0,
                                            12
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="barcodebag7Acopy">
                                      <div style={{ width: "45%" }}>
                                        <div className="h7Acopy fs7Acopy d-flex justify-content-between align-items-center w-100">
                                          <span
                                            className="fs20A fw-bold h-100 d-flex justify-content-center align-items-center "
                                            style={{
                                              fontSize: "10px",
                                              width: "38.5px",
                                            }}
                                          >
                                            Bag No :
                                          </span>
                                          <span
                                            className="lh20A h-100 d-flex justify-content-center align-items-center fw-bold "
                                            style={{ width: "64px", fontSize:"11px" }}
                                          >
                                            {e?.data?.rd?.serialjobno?.slice(
                                              0,
                                              9
                                            )}
                                          </span>
                                        </div>
                                        <div className="fs20A fs7Acopy d-flex justify-content-between align-items-center w-100">
                                          <span
                                            className="fs7Acopy fw-bold h-100 d-flex justify-content-center align-items-center fw-bold"
                                            style={{
                                              fontSize: "10px",
                                              width: "38.5px",
                                            }}
                                          >
                                            Dgn No :
                                          </span>
                                          <span
                                            className="fs20A lh20A h-100 d-flex justify-content-center align-items-center ps-1 fw-bold"
                                            style={{
                                              fontSize: "11px",
                                              width: "65px",
                                              lineHeight:"8.5px"
                                            }}
                                          >
                                            {e?.data?.rd?.Designcode?.slice(
                                              0,
                                              20
                                            )}
                                          </span>
                                        </div>
                                      </div>
                                      <div
                                        className="barcodeGenerator7Acopy"
                                        style={{ width: "55%" }}
                                      >
                                        <BarcodeGenerator
                                          data={e?.data?.rd?.serialjobno}
                                        />
                                      </div>
                                    </div>
                                    <div className="remark7Acopy">
                                      <div
                                        style={{
                                          width: "38.45mm",
                                          paddingLeft: "2px",
                                          paddingTop: "1px",
                                          maxHeight: "60px",
                                          overflow: "hidden",
                                        }}
                                      >
                                        <span className="fs20A fw-bold">
                                          Remark:
                                        </span>
                                        <span className="text-danger lh20A p-1" style={{fontSize:"8.6px"}}>
                                          
                                          {" " +
                                            (e?.data?.rd?.ProductInstruction?.length > 0 ? checkInstruction(e?.data?.rd?.ProductInstruction) : checkInstruction(e?.data?.rd?.QuoteRemark))}
                                        </span>
                                      </div>
                                      <div className="matinfo7Acopy">
                                        <div className="h327Acopy d-flex flex-column justify-content-between ">
                                          <span
                                            className="fs20A h-100 d-flex justify-content-start align-items-center w-100"
                                            style={{ fontSize: "7.5px" }}
                                          >
                                            KT/CLR:
                                          </span>
                                          <span
                                            className="fs20A h-100 d-flex justify-content-end align-items-center w-100 lh20A fw-bold"
                                            style={{
                                              fontSize: "10.5px",
                                              paddingRight: "2px",
                                            }}
                                          >
                                            {e?.data?.rd?.MetalType}{" "}
                                            {e?.data?.rd?.MetalColorCo}
                                          </span>
                                        </div>
                                        <div className="h327Acopy d-flex flex-column justify-content-between ">
                                          <span
                                            className="fs20A h-100 d-flex justify-content-start align-items-center w-100"
                                            style={{ fontSize: "7.5px" }}
                                          >
                                            Size:
                                          </span>
                                          <span
                                            className="fs20A h-100 d-flex justify-content-end align-items-center w-100 lh20A fw-bold"
                                            style={{
                                              fontSize: "10.5px",
                                              paddingRight: "2px",
                                            }}
                                          >
                                            {e?.data?.rd?.Size}
                                          </span>
                                        </div>
                                        <div
                                          className="h327Acopy d-flex flex-column justify-content-between"
                                          style={{ borderBottom: "0px" }}
                                        >
                                          <span
                                            className="fs20A h-100 d-flex justify-content-start align-items-center w-100"
                                            style={{ fontSize: "7.5px" }}
                                          >
                                            Est Wt:
                                          </span>
                                          <span
                                            className="fs20A h-100 d-flex justify-content-end align-items-center w-100 lh20A fw-bold"
                                            style={{
                                              fontSize: "10.5px",
                                              paddingRight: "5px",
                                            }}
                                          >
                                            {e?.data?.rd?.ActualGrossweight?.toFixed(
                                              3
                                            )}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="img7Acopy">
                                  {" "}
                                  <img
                                    src={
                                      e?.data?.rd?.DesignImage !== '' 
                                          ? e?.data?.rd?.DesignImage
                                        : require("../../assets/img/default.jpg")
                                    }
                                    id="img7Acopy"
                                    alt=""
                                    onError={(e) => handleImageError(e)}
                                    loading="eager"
                                  />
                                </div>
                              </div>
                              <div className="emptyTable7Acopy">
                                <div className="thead7Acopy">
                                  <div
                                    style={{
                                      width: "9.86mm",
                                      minWidth: "9.86mm",
                                    }}
                                    className="headCol7Acopy border-start border-top border_color border_top_left_print7Acopy"
                                  >
                                    Dept.
                                  </div>
                                  <div
                                    style={{
                                      width: "12.16mm",
                                      minWidth: "12.16mm",
                                    }}
                                    className="headCol7Acopy border-top border_color"
                                  >
                                    Worker
                                  </div>
                                  <div
                                    style={{
                                      width: "15.30mm",
                                      minWidth: "15.30mm",
                                    }}
                                    className="headCol7Acopy border-top border_color"
                                  >
                                    Metal In.
                                  </div>
                                  <div
                                    style={{
                                      width: "18.94mm",
                                      minWidth: "18.94mm",
                                    }}
                                    className="headCol7Acopy border-top border_color"
                                  >
                                    Ext. less.
                                  </div>
                                  <div
                                    style={{
                                      width: "15.07mm",
                                      minWidth: "15.07mm",
                                    }}
                                    className="headCol7Acopy border-top border_color"
                                  >
                                    Metal Out.
                                  </div>
                                  <div
                                    style={{
                                      width: "11.34mm",
                                      minWidth: "11.34mm",
                                    }}
                                    className="headCol7Acopy border-top border_color"
                                  >
                                    Diff
                                  </div>
                                  <div
                                    style={{
                                      width: "9.89mm",
                                      borderRight: "0px",
                                    }}
                                    className="headCol7Acopy border-top border_color border_top_right_print7Acopy border-end"
                                  >
                                    Entry
                                  </div>
                                </div>
                                <div className="d-flex">
                                  <div>
                                    <div className="wheadsep7Acopy border-start border_color fw-bold">
                                      Grind
                                    </div>
                                    <div className="wheadsep7Acopy border-start border_color fw-bold">
                                      Filli
                                    </div>
                                    <div className="wheadsep7Acopy border-start border_color fw-bold">
                                      Buff.
                                    </div>
                                    <div className="wheadsep7Acopy border-start border_color fw-bold">
                                      Filli.
                                    </div>
                                    <div className="wheadsep7Acopy border-start border_color fw-bold">
                                      PPOL
                                    </div>
                                    <div className="wheadsep7Acopy border-start border_color fw-bold">
                                      Sett.
                                    </div>
                                    <div className="wheadsep7Acopy border-start border_color fw-bold">
                                      M FN
                                    </div>
                                    <div className="wheadsep7Acopy border-start border_color fw-bold">
                                      F POL
                                    </div>
                                    <div className="wheadsep7Acopy border-start border_color fw-bold">
                                      Mina
                                    </div>
                                    <div className="wheadsep7Acopy border_color border-start border_bottom_left_print7Acopy fw-bold">
                                      Other
                                    </div>
                                  </div>
                                  <div>
                                    <div className="wheadsep7Acopy worker7Acopy"></div>
                                    <div className="wheadsep7Acopy worker7Acopy"></div>
                                    <div className="wheadsep7Acopy worker7Acopy"></div>
                                    <div className="wheadsep7Acopy worker7Acopy"></div>
                                    <div className="wheadsep7Acopy worker7Acopy"></div>
                                    <div className="wheadsep7Acopy worker7Acopy"></div>
                                    <div className="wheadsep7Acopy worker7Acopy"></div>
                                    <div className="wheadsep7Acopy worker7Acopy"></div>
                                    <div className="wheadsep7Acopy worker7Acopy"></div>
                                    <div className="wheadsep7Acopy worker7Acopy"></div>
                                  </div>
                                  <div>
                                    <div className="wheadsep7Acopy metal7Acopy"></div>
                                    <div className="wheadsep7Acopy metal7Acopy"></div>
                                    <div className="wheadsep7Acopy metal7Acopy"></div>
                                    <div className="wheadsep7Acopy metal7Acopy"></div>
                                    <div className="wheadsep7Acopy metal7Acopy"></div>
                                    <div className="wheadsep7Acopy metal7Acopy"></div>
                                    <div className="wheadsep7Acopy metal7Acopy"></div>
                                    <div className="wheadsep7Acopy metal7Acopy"></div>
                                    <div className="wheadsep7Acopy metal7Acopy"></div>
                                    <div className="wheadsep7Acopy metal7Acopy"></div>
                                  </div>
                                  <div>
                                    <div className="wheadsep7Acopy ext7Acopy"></div>
                                    <div className="wheadsep7Acopy ext7Acopy"></div>
                                    <div className="wheadsep7Acopy ext7Acopy"></div>
                                    <div className="wheadsep7Acopy ext7Acopy"></div>
                                    <div className="wheadsep7Acopy ext7Acopy"></div>
                                    <div className="wheadsep7Acopy ext7Acopy"></div>
                                    <div className="wheadsep7Acopy ext7Acopy"></div>
                                    <div className="wheadsep7Acopy ext7Acopy"></div>
                                    <div className="wheadsep7Acopy ext7Acopy"></div>
                                    <div className="wheadsep7Acopy ext7Acopy"></div>
                                  </div>
                                  <div>
                                    <div className="wheadsep7Acopy mo7Acopy"></div>
                                    <div className="wheadsep7Acopy mo7Acopy"></div>
                                    <div className="wheadsep7Acopy mo7Acopy"></div>
                                    <div className="wheadsep7Acopy mo7Acopy"></div>
                                    <div className="wheadsep7Acopy mo7Acopy"></div>
                                    <div className="wheadsep7Acopy mo7Acopy"></div>
                                    <div className="wheadsep7Acopy mo7Acopy"></div>
                                    <div className="wheadsep7Acopy mo7Acopy"></div>
                                    <div className="wheadsep7Acopy mo7Acopy"></div>
                                    <div className="wheadsep7Acopy mo7Acopy"></div>
                                  </div>
                                  <div>
                                    <div className="wheadsep7Acopy diff7Acopy"></div>
                                    <div className="wheadsep7Acopy diff7Acopy"></div>
                                    <div className="wheadsep7Acopy diff7Acopy"></div>
                                    <div className="wheadsep7Acopy diff7Acopy"></div>
                                    <div className="wheadsep7Acopy diff7Acopy"></div>
                                    <div className="wheadsep7Acopy diff7Acopy"></div>
                                    <div className="wheadsep7Acopy diff7Acopy"></div>
                                    <div className="wheadsep7Acopy diff7Acopy"></div>
                                    <div className="wheadsep7Acopy diff7Acopy"></div>
                                    <div className="wheadsep7Acopy diff7Acopy"></div>
                                  </div>
                                  <div>
                                    <div
                                      className="wheadsep7Acopy enbrb7Acopy border-end border_color"
                                      style={{ minWidth: "9.5mm !important" }}
                                    ></div>

                                    <div className="wheadsep7Acopy enbrb7Acopy border-end border_color"></div>
                                    <div className="wheadsep7Acopy enbrb7Acopy border-end border_color"></div>
                                    <div className="wheadsep7Acopy enbrb7Acopy border-end border_color"></div>
                                    <div className="wheadsep7Acopy enbrb7Acopy border-end border_color"></div>
                                    <div className="wheadsep7Acopy enbrb7Acopy border-end border_color"></div>
                                    <div className="wheadsep7Acopy enbrb7Acopy border-end border_color"></div>
                                    <div className="wheadsep7Acopy enbrb7Acopy border-end border_color"></div>
                                    <div className="wheadsep7Acopy enbrb7Acopy border-end border_color"></div>
                                    <div className="wheadsep7Acopy enbrb7Acopy border_bottom_right_print7Acopy border-end border_color"></div>
                                  </div>
                                </div>
                              </div>
                              <div className="footerEntry7Acopy">
                                <div className="entry7Acopy">
                                  <div className="entryCol7Acopy">Cast 1:</div>
                                  <div className="entryCol7Acopy">Cast 2:</div>
                                  <div className="entryCol7Acopy">Lock:</div>
                                  <div className="entryCol7Acopy">PTCK:</div>
                                  <div className="entryCol7Acopy">Chain:</div>
                                  <div
                                    className="entryCol7Acopy"
                                    style={{ borderBottom: "0px" }}
                                  >
                                    Ex Mtl:
                                  </div>
                                </div>
                                <div className="diacsentry7Acopy">
                                  <div className="fw-bold ps-1">
                                    {el?.data?.length > 0 &&
                                      el?.data?.map((s, si) => {
                                        return (
                                          <div key={si}>
                                            {" "}
                                            {s?.Sizename === "Diamond Detail" ||
                                            s?.Sizename ===
                                              "Colorstone Detail" ||
                                            s?.Sizename === "Misc Detail" ? (
                                              <div
                                                className="fs20A"
                                                style={{
                                                  paddingTop: "1px",
                                                  paddingBottom: "1px",
                                                }}
                                              >
                                                {s?.Sizename + " : "}
                                              </div>
                                            ) : (
                                              <React.Fragment>
                                                {s?.Sizename === "C TOTAL" ||
                                                s?.Sizename === "D TOTAL" ||
                                                s?.Sizename === "MISC TOTAL" ? (
                                                  <div
                                                    className="fw-normal fs20A fw-bold"
                                                    style={{ fontSize: "9px" }}
                                                  >
                                                    {s?.Sizename + " "} :{" "}
                                                    {s?.ActualPcs + " "}
                                                  </div>
                                                ) : (
                                                  <div
                                                    className="fw-normal fs20A"
                                                    style={{ fontSize: "9px" }}
                                                  >
                                                    {s?.Sizename + " "} /{" "}
                                                    {s?.ActualPcs + " "}
                                                  </div>
                                                )}
                                              </React.Fragment>
                                            )}
                                          </div>
                                        );
                                      })}
                                  </div>
                                </div>
                                <div className="emptybox7Acopy"></div>
                              </div>
                              <div className="footercss7Acopy">
                                <div className="footer7Acopy">
                                  <div
                                    className="footerCol7Acopyall"
                                    style={{ width: "16.10mm" }}
                                  >
                                    Gross Wt.
                                  </div>
                                  <div
                                    className="footerCol7Acopyall"
                                    style={{ width: "18.00mm" }}
                                  >
                                    Diamond
                                  </div>
                                  <div
                                    className="footerCol7Acopyall"
                                    style={{ width: "18.00mm" }}
                                  >
                                    Color Stone
                                  </div>
                                  <div
                                    className="footerCol7Acopyall"
                                    style={{ width: "12.00mm" }}
                                  >
                                    Misc
                                  </div>
                                  <div
                                    className="footerCol7Acopyall"
                                    style={{ width: "12.00mm" }}
                                  >
                                    Mina
                                  </div>
                                  <div
                                    className="footerCol7Acopyall"
                                    style={{
                                      width: "16.10mm",
                                      borderRight: "0px",
                                    }}
                                  >
                                    Net Wt.
                                  </div>
                                </div>

                                <div className="footer7Acopy brbnone7Acopy brl7Acopy1">
                                  <div
                                    className="footerCol7Acopyall"
                                    style={{ width: "16.10mm" }}
                                  ></div>
                                  <div
                                    className="footerCol7Acopyall"
                                    style={{ width: "18.00mm" }}
                                  ></div>
                                  <div
                                    className="footerCol7Acopyall"
                                    style={{ width: "18.00mm" }}
                                  ></div>
                                  <div
                                    className="footerCol7Acopyall"
                                    style={{ width: "12.00mm" }}
                                  ></div>
                                  <div
                                    className="footerCol7Acopyall"
                                    style={{ width: "12.00mm" }}
                                  ></div>
                                  <div
                                    className="footerCol7Acopyall"
                                    style={{
                                      width: "16.10mm",
                                      borderRight: "0px",
                                    }}
                                  ></div>
                                </div>
                                <div
                                  className="footer7Acopy brbnone7Acopy brl7Acopy2"
                                  style={{ borderTop: "1px dashed #989898" }}
                                >
                                  {" "}
                                  <div
                                    className="footerCol7Acopyall"
                                    style={{ width: "16.10mm" }}
                                  ></div>
                                  <div
                                    className="footerCol7Acopyall"
                                    style={{ width: "18.00mm" }}
                                  ></div>
                                  <div
                                    className="footerCol7Acopyall"
                                    style={{ width: "18.00mm" }}
                                  ></div>
                                  <div
                                    className="footerCol7Acopyall"
                                    style={{ width: "12.00mm" }}
                                  ></div>
                                  <div
                                    className="footerCol7Acopyall"
                                    style={{ width: "12.00mm" }}
                                  ></div>
                                  <div
                                    className="footerCol7Acopyall"
                                    style={{
                                      width: "16.10mm",
                                      borderRight: "0px",
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </React.Fragment>
                        );
                      })
                    ) : (
                      <div className="container7Acopy">
                        <div className="head7Acopy">
                          <div className="headerdesc7Acopy">
                            <div className="headW7Acopy">
                              <div className="jobno7Acopy">
                                <div>
                                  <span className="fs7Acopy fw-bold pe-1">
                                    Odr Dt:
                                  </span>
                                  <span className="lh20A fs20A">
                                    {e?.data?.rd?.orderDatef}
                                  </span>
                                </div>
                                <div>
                                  <span className="fs7Acopy fw-bold pe-1">
                                    Due Dt:
                                  </span>
                                  <span className="lh20A fs20A">
                                    {e?.data?.rd?.promiseDatef}
                                  </span>
                                </div>
                                <div className="fs7Acopy">
                                  <span className="fw-bold pe-1">Party:</span>
                                  <span className="lh20A fs20A">
                                    {e?.data?.rd?.CustomerCode?.slice(0, 12)}
                                  </span>
                                </div>
                              </div>
                              <div className="barcodebag7Acopy">
                                <div style={{ width: "45%" }}>
                                  <div className="h7Acopy fs7Acopy d-flex">
                                    <span
                                      className=" fw-bold h-100 d-flex justify-content-center align-items-center"
                                      style={{ width: "38.5px", fontSize:"10px" }}
                                    >
                                      Bag No:
                                    </span>
                                    <span
                                      className="fs7Acopy h-100 d-flex justify-content-center align-items-center fw-bold"
                                      style={{
                                        width: "64px",
                                        fontSize: "11px",
                                      }}
                                    >
                                      {e?.data?.rd?.serialjobno?.slice(0, 9)}
                                    </span>
                                  </div>
                                  <div className="h7Acopy fs7Acopy d-flex">
                                    <span
                                      className=" fw-bold h-100 d-flex justify-content-center align-items-center fw-bold"
                                      style={{
                                        width: "38.5px",
                                        fontSize: "10px",
                                      }}
                                    >
                                      Dgn No:
                                    </span>
                                    <span
                                      className=" h-100 d-flex justify-content-center align-items-center ps-1 fw-bold"
                                      style={{
                                        width: "64px",
                                        fontSize: "11px",
                                        lineHeight:"8.5px"
                                      }}
                                    >
                                      {e?.data?.rd?.Designcode?.slice(0, 21)}
                                    </span>
                                  </div>
                                </div>
                                <div className="barcodeGenerator7Acopy">
                                  <BarcodeGenerator
                                    data={e?.data?.rd?.serialjobno}
                                  />
                                </div>
                              </div>
                              <div className="remark7Acopy">
                                <div
                                  style={{
                                    width: "38.45mm",
                                    paddingLeft: "2px",
                                    paddingTop: "1px",
                                  }}
                                >
                                  <span className="fw-bold fs20A" style={{fontSize:"8.6px"}}>
                                    {" "}
                                    Remark:{" "}
                                    {" " +
                                      (e?.data?.rd?.ProductInstruction?.length > 0 ? checkInstruction(e?.data?.rd?.ProductInstruction) : checkInstruction(e?.data?.rd?.QuoteRemark))}
                                  </span>{" "}
                                  <span>{e?.data?.rd?.remark}</span>
                                </div>
                                <div className="matinfo7Acopy">
                                  <div className="h327Acopy d-flex flex-column justify-content-between ">
                                    <span
                                      className="fs20A h-100 d-flex justify-content-start align-items-center w-100"
                                      style={{ fontSize: "7.5px" }}
                                    >
                                      KT/CLR:
                                    </span>
                                    <span
                                      className="fs20A h-100 d-flex justify-content-end align-items-center w-100 lh20A fw-bold"
                                      style={{
                                        fontSize: "10.5px",
                                        paddingRight: "2px",
                                      }}
                                    >
                                      {e?.data?.rd?.MetalType}{" "}
                                      {e?.data?.rd?.MetalColorCo}
                                    </span>
                                  </div>
                                  <div className="h327Acopy d-flex flex-column justify-content-between ">
                                    <span
                                      className="fs20A h-100 d-flex justify-content-start align-items-center w-100"
                                      style={{ fontSize: "7.5px" }}
                                    >
                                      Size:
                                    </span>
                                    <span
                                      className="fs20A h-100 d-flex justify-content-end align-items-center w-100 lh20A fw-bold"
                                      style={{
                                        fontSize: "10.5px",
                                        paddingRight: "2px",
                                      }}
                                    >
                                      {e?.data?.rd?.Size}
                                    </span>
                                  </div>
                                  <div
                                    className="h327Acopy d-flex flex-column justify-content-between"
                                    style={{ borderBottom: "0px" }}
                                  >
                                    <span
                                      className="fs20A h-100 d-flex justify-content-start align-items-center w-100"
                                      style={{ fontSize: "7.5px" }}
                                    >
                                      Est Wt:
                                    </span>
                                    <span
                                      className="fs20A h-100 d-flex justify-content-end align-items-center w-100 lh20A fw-bold"
                                      style={{
                                        fontSize: "10.5px",
                                        paddingRight: "5px",
                                      }}
                                    >
                                      {e?.data?.rd?.ActualGrossweight?.toFixed(
                                        3
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="img7Acopy">
                            {" "}
                            <img
                              src={
                                e?.data?.rd?.DesignImage !== '' 
                                          ? e?.data?.rd?.DesignImage
                                  : require("../../assets/img/default.jpg")
                              }
                              id="img7Acopy"
                              alt=""
                              onError={(e) => handleImageError(e)}
                              loading="eager"
                            />
                          </div>
                        </div>
                        <div className="emptyTable7Acopy">
                          <div className="thead7Acopy">
                            <div
                              style={{
                                width: "9.86mm",
                                minWidth: "9.86mm",
                              }}
                              className="headCol7Acopy border-start border-top border_color border_top_left_print7Acopy"
                            >
                              Dept.
                            </div>
                            <div
                              style={{
                                width: "12.16mm",
                                minWidth: "12.16mm",
                              }}
                              className="headCol7Acopy border-top border_color"
                            >
                              Worker
                            </div>
                            <div
                              style={{
                                width: "15.30mm",
                                minWidth: "15.30mm",
                              }}
                              className="headCol7Acopy border-top border_color"
                            >
                              Metal In.
                            </div>
                            <div
                              style={{
                                width: "18.94mm",
                                minWidth: "18.94mm",
                              }}
                              className="headCol7Acopy border-top border_color"
                            >
                              Ext. less.
                            </div>
                            <div
                              style={{
                                width: "15.07mm",
                                minWidth: "15.07mm",
                              }}
                              className="headCol7Acopy border-top border_color"
                            >
                              Metal Out.
                            </div>
                            <div
                              style={{
                                width: "11.34mm",
                                minWidth: "11.34mm",
                              }}
                              className="headCol7Acopy border-top border_color"
                            >
                              Diff
                            </div>
                            <div
                              style={{
                                width: "9.89mm",
                                borderRight: "0px",
                              }}
                              className="headCol7Acopy border-top border_color border_top_right_print7Acopy border-end"
                            >
                              Entry
                            </div>
                          </div>
                          <div className="d-flex">
                            <div>
                              <div className="wheadsep7Acopy border-start border_color fw-bold">
                                Grind
                              </div>
                              <div className="wheadsep7Acopy border-start border_color fw-bold">
                                Filli
                              </div>
                              <div className="wheadsep7Acopy border-start border_color fw-bold">
                                Buff.
                              </div>
                              <div className="wheadsep7Acopy border-start border_color fw-bold">
                                Filli.
                              </div>
                              <div className="wheadsep7Acopy border-start border_color fw-bold">
                                PPOL
                              </div>
                              <div className="wheadsep7Acopy border-start border_color fw-bold">
                                Sett.
                              </div>
                              <div className="wheadsep7Acopy border-start border_color fw-bold">
                                M FN
                              </div>
                              <div className="wheadsep7Acopy border-start border_color fw-bold">
                                F POL
                              </div>
                              <div className="wheadsep7Acopy border-start border_color fw-bold">
                                Mina
                              </div>
                              <div className="wheadsep7Acopy border_color border-start border_bottom_left_print7Acopy fw-bold ">
                                Other
                              </div>
                            </div>
                            <div>
                              <div className="wheadsep7Acopy worker7Acopy"></div>
                              <div className="wheadsep7Acopy worker7Acopy"></div>
                              <div className="wheadsep7Acopy worker7Acopy"></div>
                              <div className="wheadsep7Acopy worker7Acopy"></div>
                              <div className="wheadsep7Acopy worker7Acopy"></div>
                              <div className="wheadsep7Acopy worker7Acopy"></div>
                              <div className="wheadsep7Acopy worker7Acopy"></div>
                              <div className="wheadsep7Acopy worker7Acopy"></div>
                              <div className="wheadsep7Acopy worker7Acopy"></div>
                              <div className="wheadsep7Acopy worker7Acopy"></div>
                            </div>
                            <div>
                              <div className="wheadsep7Acopy metal7Acopy"></div>
                              <div className="wheadsep7Acopy metal7Acopy"></div>
                              <div className="wheadsep7Acopy metal7Acopy"></div>
                              <div className="wheadsep7Acopy metal7Acopy"></div>
                              <div className="wheadsep7Acopy metal7Acopy"></div>
                              <div className="wheadsep7Acopy metal7Acopy"></div>
                              <div className="wheadsep7Acopy metal7Acopy"></div>
                              <div className="wheadsep7Acopy metal7Acopy"></div>
                              <div className="wheadsep7Acopy metal7Acopy"></div>
                              <div className="wheadsep7Acopy metal7Acopy"></div>
                            </div>
                            <div>
                              <div className="wheadsep7Acopy ext7Acopy"></div>
                              <div className="wheadsep7Acopy ext7Acopy"></div>
                              <div className="wheadsep7Acopy ext7Acopy"></div>
                              <div className="wheadsep7Acopy ext7Acopy"></div>
                              <div className="wheadsep7Acopy ext7Acopy"></div>
                              <div className="wheadsep7Acopy ext7Acopy"></div>
                              <div className="wheadsep7Acopy ext7Acopy"></div>
                              <div className="wheadsep7Acopy ext7Acopy"></div>
                              <div className="wheadsep7Acopy ext7Acopy"></div>
                              <div className="wheadsep7Acopy ext7Acopy"></div>
                            </div>
                            <div>
                              <div className="wheadsep7Acopy mo7Acopy"></div>
                              <div className="wheadsep7Acopy mo7Acopy"></div>
                              <div className="wheadsep7Acopy mo7Acopy"></div>
                              <div className="wheadsep7Acopy mo7Acopy"></div>
                              <div className="wheadsep7Acopy mo7Acopy"></div>
                              <div className="wheadsep7Acopy mo7Acopy"></div>
                              <div className="wheadsep7Acopy mo7Acopy"></div>
                              <div className="wheadsep7Acopy mo7Acopy"></div>
                              <div className="wheadsep7Acopy mo7Acopy"></div>
                              <div className="wheadsep7Acopy mo7Acopy"></div>
                            </div>
                            <div>
                              <div className="wheadsep7Acopy diff7Acopy"></div>
                              <div className="wheadsep7Acopy diff7Acopy"></div>
                              <div className="wheadsep7Acopy diff7Acopy"></div>
                              <div className="wheadsep7Acopy diff7Acopy"></div>
                              <div className="wheadsep7Acopy diff7Acopy"></div>
                              <div className="wheadsep7Acopy diff7Acopy"></div>
                              <div className="wheadsep7Acopy diff7Acopy"></div>
                              <div className="wheadsep7Acopy diff7Acopy"></div>
                              <div className="wheadsep7Acopy diff7Acopy"></div>
                              <div className="wheadsep7Acopy diff7Acopy"></div>
                            </div>
                            <div>
                              <div
                                className="wheadsep7Acopy enbrb7Acopy border-end border_color"
                                style={{ minWidth: "9.5mm !important" }}
                              ></div>

                              
                              <div className="wheadsep7Acopy enbrb7Acopy border-end border_color"></div>
                              <div className="wheadsep7Acopy enbrb7Acopy border-end border_color"></div>
                              <div className="wheadsep7Acopy enbrb7Acopy border-end border_color"></div>
                              <div className="wheadsep7Acopy enbrb7Acopy border-end border_color"></div>
                              <div className="wheadsep7Acopy enbrb7Acopy border-end border_color"></div>
                              <div className="wheadsep7Acopy enbrb7Acopy border-end border_color"></div>
                              <div className="wheadsep7Acopy enbrb7Acopy border-end border_color"></div>
                              <div className="wheadsep7Acopy enbrb7Acopy border-end border_color"></div>
                              <div className="wheadsep7Acopy enbrb7Acopy border_bottom_right_print7Acopy border-end border_color"></div>
                            </div>
                          </div>
                        </div>
                        <div className="footerEntry7Acopy">
                          <div className="entry7Acopy">
                            <div className="entryCol7Acopy">Cast 1:</div>
                            <div className="entryCol7Acopy">Cast 2:</div>
                            <div className="entryCol7Acopy">Lock:</div>
                            <div className="entryCol7Acopy">PTCK:</div>
                            <div className="entryCol7Acopy">Chain:</div>
                            <div
                              className="entryCol7Acopy"
                              style={{ borderBottom: "0px" }}
                            >
                              Ex Mtl:
                            </div>
                          </div>
                          <div className="diacsentry7Acopy">
                            <div className="fw-bold pt-1 ps-1">
                              CS/ Dia Detail:
                            </div>
                          </div>
                          <div className="emptybox7Acopy"></div>
                        </div>

                        <div className="footercss7Acopy">
                          <div className="footer7Acopy">
                            <div
                              className="footerCol7Acopyall"
                              style={{ width: "16.10mm" }}
                            >
                              Gross Wt.
                            </div>
                            <div
                              className="footerCol7Acopyall"
                              style={{ width: "18.00mm" }}
                            >
                              Diamond
                            </div>
                            <div
                              className="footerCol7Acopyall"
                              style={{ width: "18.00mm" }}
                            >
                              Color Stone
                            </div>
                            <div
                              className="footerCol7Acopyall"
                              style={{ width: "12.00mm" }}
                            >
                              Misc
                            </div>
                            <div
                              className="footerCol7Acopyall"
                              style={{ width: "12.00mm" }}
                            >
                              Mina
                            </div>
                            <div
                              className="footerCol7Acopyall"
                              style={{
                                width: "16.10mm",
                                borderRight: "0px",
                              }}
                            >
                              Net Wt.
                            </div>
                          </div>

                          <div className="footer7Acopy brbnone7Acopy brl7Acopy1">
                            <div
                              className="footerCol7Acopyall"
                              style={{ width: "16.10mm" }}
                            ></div>
                            <div
                              className="footerCol7Acopyall"
                              style={{ width: "18.00mm" }}
                            ></div>
                            <div
                              className="footerCol7Acopyall"
                              style={{ width: "18.00mm" }}
                            ></div>
                            <div
                              className="footerCol7Acopyall"
                              style={{ width: "12.00mm" }}
                            ></div>
                            <div
                              className="footerCol7Acopyall"
                              style={{ width: "12.00mm" }}
                            ></div>
                            <div
                              className="footerCol7Acopyall"
                              style={{
                                width: "16.10mm",
                                borderRight: "0px",
                              }}
                            ></div>
                          </div>
                          <div
                            className="footer7Acopy brbnone7Acopy brl7Acopy2"
                            style={{ borderTop: "1px dashed #989898" }}
                          >
                            {" "}
                            <div
                              className="footerCol7Acopyall"
                              style={{ width: "16.10mm" }}
                            ></div>
                            <div
                              className="footerCol7Acopyall"
                              style={{ width: "18.00mm" }}
                            ></div>
                            <div
                              className="footerCol7Acopyall"
                              style={{ width: "18.00mm" }}
                            ></div>
                            <div
                              className="footerCol7Acopyall"
                              style={{ width: "12.00mm" }}
                            ></div>
                            <div
                              className="footerCol7Acopyall"
                              style={{ width: "12.00mm" }}
                            ></div>
                            <div
                              className="footerCol7Acopyall"
                              style={{
                                width: "16.10mm",
                                borderRight: "0px",
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
          </div>
        </>
      )}
    </>
  );
};

export default BagPrint20A;
