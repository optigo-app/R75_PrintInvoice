import React, { useEffect, useState } from "react";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import "../../assets/css/bagprint/bg18.css";
import Button from "../../GlobalFunctions/Button";
import { GetChunkData } from "../../GlobalFunctions/GetChunkData";
import { GetData } from "../../GlobalFunctions/GetData";
import Loader from "../../components/Loader";
import { GetUniquejob } from "../../GlobalFunctions/GetUniqueJob";
import { organizeData } from "../../GlobalFunctions/OrganizeBagPrintData";
const Bg18 = ({ queries, headers }) => {
  const [data, setData] = useState([]);
  const location = useLocation();
  const queryParams = queryString.parse(location?.search);
  const resultString = GetUniquejob(queryParams?.str_srjobno);
  const chunkSize11 = 13;
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
        let allDatas = await GetData(objs);
        let datas = organizeData(allDatas?.rd, allDatas?.rd1);
        // eslint-disable-next-line array-callback-return
        datas?.map((a) => {
          let diamondArr = [];
          let colorStoneArr = [];
          let miscArr = [];
          let findingDetailArr = [];
          a?.rd1?.forEach((e, i) => {
            if (e?.MasterManagement_DiamondStoneTypeid === 3) {
              diamondArr.push(e);
            }
            if (e?.MasterManagement_DiamondStoneTypeid === 4) {
              colorStoneArr.push(e);
            }
            if (e?.MasterManagement_DiamondStoneTypeid === 5) {
              findingDetailArr.push(e);
            }
            if (e?.MasterManagement_DiamondStoneTypeid === 7) {
              miscArr.push(e);
            }
          });
          let length = 0;
          let clr = {
            ActualPcs: 0,
            ActualWeight: 0,
            MasterManagement_DiamondStoneTypeid: 4,
          };
          let dia = {
            ActualPcs: 0,
            ActualWeight: 0,
            MasterManagement_DiamondStoneTypeid: 3,
          };
          let misc = {
            ActualPcs: 0,
            ActualWeight: 0,
            MasterManagement_DiamondStoneTypeid: 7,
          };
          let f = {
            ActualPcs: 0,
            ActualWeight: 0,
            MasterManagement_DiamondStoneTypeid: 5,
          };
          let ArrofSevenSize = [];
          let ArrofFiveSize = [];
          let ArrofMISize = [];
          let ArrofFSize = [];
          // eslint-disable-next-line array-callback-return
          a?.rd1?.map((e, i) => {
            if (e?.ConcatedFullShapeQualityColorCode !== "- - - ") {
              length++;
            }
            if (e?.MasterManagement_DiamondStoneTypeid === 3) {
              ArrofSevenSize.push(e);
              dia.ActualPcs = dia?.ActualPcs + e?.ActualPcs;
              dia.ActualWeight = dia?.ActualWeight + e?.ActualWeight;
            } else if (e?.MasterManagement_DiamondStoneTypeid === 4) {
              ArrofFiveSize.push(e);
              clr.ActualPcs = clr?.ActualPcs + e?.ActualPcs;
              clr.ActualWeight = clr?.ActualWeight + e?.ActualWeight;
            } else if (e?.MasterManagement_DiamondStoneTypeid === 5) {
              ArrofFSize.push(e);
              f.ActualPcs = f?.ActualPcs + e?.ActualPcs;
              f.ActualWeight = f?.ActualWeight + e?.ActualWeight;
            } else if (e?.MasterManagement_DiamondStoneTypeid === 7) {
              ArrofMISize.push(e);
              misc.ActualPcs = misc?.ActualPcs + e?.ActualPcs;
              misc.ActualWeight = misc?.ActualWeight + e?.ActualWeight;
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
            ArrofSevenSize,
            ArrofFiveSize,
            ArrofMISize,
            ArrofFSize
          );
          let imagePath = queryParams?.imagepath;
          imagePath = atob(queryParams?.imagepath);
          let img = imagePath + a?.rd?.ThumbImagePath;
          let arrofchunk = GetChunkData(chunkSize11, mainArr);
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
      }, 10000);
    }
  }, [data]);

  return (
    <>
      {data.length === 0 ? (
        <Loader />
      ) : (
        <>
          <div className="printBg18">
            <div className="btnpcl">
              <Button />
            </div>
            {Array.from(
              { length: queries?.pageStart },
              (_, index) =>
                index > 0 && (
                  <div
                    key={index}
                    className="bg18A"
                    style={{ border: "0px" }}
                  ></div>
                )
            )}
            {data?.length > 0 &&
              data?.map((e, i) => {
                return (
                  <React.Fragment key={i}>
                    {e?.additional?.pages?.length > 0 &&
                      e?.additional?.pages?.map((e, ins) => {
                        return (
                          <React.Fragment key={ins}>
                            <div className="containerBg18">
                              <div className="headBg18">
                                <div className="h2Bg18">
                                  <div>Date</div>
                                  <div>Job No:</div>
                                  <div>Bag No:</div>
                                  <div>:</div>
                                </div>
                                <div className="h2Bg18">
                                  <div>STYLE NO:</div>
                                  <div>METAL:</div>
                                  <div></div>
                                </div>
                                <div className="h2Bg18">
                                  <div>KT/COLOUR</div>
                                  <div>GROSS WT:</div>
                                  <div></div>
                                </div>
                                <div className="h2Bg18">
                                  <div className="d-flex">
                                    <div>FINDING NAME :</div>
                                    <div> Total Qty.</div>
                                  </div>
                                  <div>NET WT:</div>
                                </div>
                              </div>
                              <div className="tableBg18">
                                <div className="theadBg18">
                                  <div
                                    className="fw-bold wc1Bg18"
                                    style={{ width: "112px" }}
                                  >
                                    REQUIRED ITEM
                                  </div>
                                  <div
                                    className="hBg18"
                                    style={{ borderLeft: "1px solid black" }}
                                  >
                                    <div className="fw-bold wc1Bg18 bbBg18">
                                      ISSUED
                                    </div>
                                    <div className="d-flex wc1Bg18 d-flex justify-content-between align-items-center">
                                      <div className="fw-bold w-50 d-flex justify-content-center align-items-center h-100 brBg18">
                                        PCS.
                                      </div>
                                      <div className="fw-bold w-50 d-flex justify-content-center align-items-center h-100">
                                        WT.
                                      </div>
                                    </div>
                                  </div>
                                  <div className="hBg18">
                                    <div className="fw-bold wc1Bg18 bbBg18">
                                      RECEIVED
                                    </div>
                                    <div className="d-flex wc1Bg18 d-flex justify-content-between align-items-center">
                                      <div className="fw-bold w-50 d-flex justify-content-center align-items-center h-100 brBg18">
                                        PCS.
                                      </div>
                                      <div className="fw-bold w-50 d-flex justify-content-center align-items-center h-100">
                                        WT.
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    className="hBg18"
                                    style={{ borderRight: "0px solid" }}
                                  >
                                    <div className="fw-bold wc1Bg18 bbBg18">
                                      SCRAP.
                                    </div>
                                    <div className="d-flex wc1Bg18 d-flex justify-content-between align-items-center">
                                      <div className="fw-bold w-50 d-flex justify-content-center align-items-center h-100 brBg18">
                                        PCS.
                                      </div>
                                      <div className="fw-bold w-50 d-flex justify-content-center align-items-center h-100">
                                        WT.
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="tbodyBg18">
                                  {Array.from({ length: 11 }, (_, index) => (
                                    <div className="tbodyrBg18" key={index}>
                                      <div
                                        className="d-flex justify-content-center align-items-center h-100 brBg18"
                                        style={{ width: "113px" }}
                                      ></div>
                                      <div className="d-flex justify-content-center align-items-center h-100 wc1Bg18 brBg18">
                                        <div className="w-50 d-flex justify-content-center align-items-center h-100 brBg18 fontall">
                                          000000
                                        </div>
                                        <div className="w-50 d-flex justify-content-center align-items-center h-100 fontall">
                                          0000.000
                                        </div>
                                      </div>
                                      <div className="d-flex justify-content-center align-items-center h-100 wc1Bg18 brBg18">
                                        <div className="w-50 d-flex justify-content-center align-items-center h-100 brBg18"></div>
                                        <div className="w-50 d-flex justify-content-center align-items-center h-100"></div>
                                      </div>
                                      <div className="d-flex justify-content-center align-items-center h-100 wc1Bg18">
                                        <div className="w-50 d-flex justify-content-center align-items-center h-100 brBg18"></div>
                                        <div className="w-50 d-flex justify-content-center align-items-center h-100"></div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </React.Fragment>
                        );
                      })}
                  </React.Fragment>
                );
              })}
          </div>
        </>
      )}
    </>
  );
};

export default Bg18;
