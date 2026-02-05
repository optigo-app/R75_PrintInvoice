import queryString from "query-string";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../../assets/css/bagprint/print6A.css";
import { GetChunkData } from "../../GlobalFunctions/GetChunkData";
import { GetData } from "../../GlobalFunctions/GetData";
import { handlePrint } from "../../GlobalFunctions/HandlePrint";
import { handleImageError } from "../../GlobalFunctions/HandleImageError";
import QRCodeGenerator from "../../components/QRCodeGenerator";
import Loader from "../../components/Loader";
import { organizeData } from "../../GlobalFunctions/OrganizeBagPrintData";
import { GetUniquejob } from "../../GlobalFunctions/GetUniqueJob";
import { checkInstruction } from "../../GlobalFunctions";

const BagPrint6A = ({ queries, headers }) => {
  const [data, setData] = useState([]);
  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const resultString = GetUniquejob(queryParams?.str_srjobno);
  const chunkSize7 = 12;
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
          
            
          // if (a?.rd?.ProductType !== null && a?.rd?.ProductType !== undefined && a?.rd?.ProductType !== "") {
          //   if (
          //     a?.rd?.ProductType?.length > 0 &&
          //     a?.rd?.ProductType?.length < 18
          //   ) {
          //     a.rd.PType = a?.rd?.ProductType;
          //   } else {
          //     let splited = a?.rd?.ProductType?.split(" ");
          //     a.rd.PType = splited[0];
          //   }
          // }

          let length = 0;
          let clr = {
            Sizename: "",
            ActualPcs: 0,
            ActualWeight: 0,
          };
          let dia = {
            Sizename: "",
            ActualPcs: 0,
            ActualWeight: 0,
          };
          let misc = {
            Sizename: "",
            ActualPcs: 0,
            ActualWeight: 0,
          };
          let f = {
            Sizename: "",
            ActualPcs: 0,
            ActualWeight: 0,
          };
          let tc = {
            ConcatedFullShapeQualityColorCode : '',
          }
          let ArrofSevenSize = [];
          let ArrofFiveSize = [];
          let ArrofMISize = [];
          let ArrofFSize = [];

          a?.rd1?.forEach((e, i) => {
            if (e?.ConcatedFullShapeQualityColorCode !== "- - - ") {
              length++;
            }
            if (e?.MasterManagement_DiamondStoneTypeid === 3) {
              ArrofSevenSize.push(e);
              dia.ActualPcs = dia.ActualPcs + e?.ActualPcs;
              dia.ActualWeight = dia.ActualWeight + e?.ActualWeight;
            } else if (e?.MasterManagement_DiamondStoneTypeid === 4) {
              ArrofFiveSize.push(e);
              clr.ActualPcs = clr.ActualPcs + e?.ActualPcs;
              clr.ActualWeight = clr.ActualWeight + e?.ActualWeight;
            } else if (e?.MasterManagement_DiamondStoneTypeid === 5) {
              ArrofFSize.push(e);
              f.ActualPcs = f.ActualPcs + e?.ActualPcs;
              f.ActualWeight = f.ActualWeight + e?.ActualWeight;
            } else if (e?.MasterManagement_DiamondStoneTypeid === 7) {
              ArrofMISize.push(e);
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
          let mainArr = arr.concat(
            ArrofSevenSize,
            ArrofFiveSize,
            ArrofMISize,
            ArrofFSize
          );
          let imagePath = queryParams?.imagepath;
          imagePath = atob(queryParams?.imagepath);
            
            
          let img = imagePath + a?.rd?.ThumbImagePath;
          tc.ConcatedFullShapeQualityColorCode = (a?.rd?.MetalType == null ? 'NA' : a?.rd?.MetalType) + " " + (a?.rd?.MetalColorCo == null ? 'NA' : a?.rd?.MetalColorCo);
          mainArr.unshift(tc);
          let arrofchunk = GetChunkData(chunkSize7, mainArr);
          
          const date = new Date(); // Current date and time

          const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true // To use AM/PM format
          };

        const formattedDate = date.toLocaleString('en-US', options);
        a.rd.showingDateTimeByJob = formattedDate;
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
  }, [data]);
  return (
    <>
      {data.length === 0 ? (
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

          <div className="print6Aflex pad_60_allPrint">
            {Array.from(
              { length: queries?.pageStart },
              (_, index) =>
                index > 0 && (
     
                  <div className="containerWD6A" key={index} style={{border:"0px"}}>
                    <div className="container6A" style={{border:"0px"}}></div>
                  </div>
                )
            )}
            {data?.length > 0 &&
              data?.map((e, inx) => {
                return (
                  <React.Fragment key={inx}>
                    {e?.additional?.pages?.length > 0 ? (
                      e?.additional?.pages?.map((ele, i) => {
                        return (
                          <div className="containerWD6A" key={i}>
                            <div className="container6A">
                              <div className="jobInfo6A">
                                <div className="jobInfo6Aheader">
                                  <div
                                    className="jobName6AD h6A"
                                    style={{ fontWeight: "bold" }}
                                  >
                                    <div>{e?.data?.rd?.serialjobno}</div>
                                    <div>{e?.data?.rd?.Designcode}</div>
                                    <div className="text-danger">
                                      {(e?.data?.rd?.MetalType == null ? 'NA' : e?.data?.rd?.MetalType) + " " + (e?.data?.rd?.MetalColorCo == null ? 'NA' : e?.data?.rd?.MetalColorCo)}
                                    </div>
                                  </div>
                                  <div className="jobName6A">
                                    <div className="job6Ahww text-secondary">
                                      TR NO.
                                    </div>
                                    <div className="job6Ahww text-secondary">
                                      TR NO.
                                    </div>
                                    <div className="job6Ahww text-secondary">
                                      TR NO.
                                    </div>
                                    <div className="job6Ahww borderRight6A" style={{width:"50.5px"}}>
                                      {e?.data?.rd?.OrderNo}
                                    </div>
                                  </div>
                                  <div className="jobName6A">
                                    <div className="job6Ahww" style={{fontSize:`${e?.data?.rd?.ProductType?.length > 18 ? '8.5px' : '9.5px'}`}}>
                                      {e?.data?.rd?.ProductType}
                                    </div>
                                    <div className="job6Ahww">
                                      {e?.data?.rd?.Size}
                                    </div>
                                    <div className="job6Ahww">
                                      {e?.data?.rd?.CustomerCode}
                                    </div>
                                    <div className="job6Ahww borderRight6A" style={{width:"50.5px"}}>
                                      {e?.data.rd?.PO}
                                    </div>
                                  </div>
                                  <div className="jobName6A">
                                    <div className="job6Ahww">CS WT/PC</div>
                                    <div className="job6Ahww">DIA WT/PC</div>
                                    <div className="job6Ahww">Nt Wt/Gr Wt</div>
                                    <div className="job6Ahww borderRight6A" style={{backgroundColor:`${e?.data?.rd?.prioritycolorcode}`, width:"50.5px"}} >
                                      {e?.data?.rd?.prioritycode}
                                    </div>
                                  </div>
                                  <div
                                    className="jobName6A"
                                    style={{ borderBottom: "0px" }}
                                  >
                                    <div className="job6Ahww">
                                      {e?.additional?.clr?.ActualWeight?.toFixed(
                                        3
                                      )}
                                      /{e?.additional?.clr?.ActualPcs}
                                    </div>
                                    <div className="job6Ahww">
                                      {e?.additional?.dia?.ActualWeight?.toFixed(
                                        3
                                      )}
                                      /{e?.additional?.dia?.ActualPcs}
                                    </div>
                                    <div className="job6Ahww">
                                      {e?.data?.rd?.MetalWeight?.toFixed(3)}/
                                      {e?.data?.rd?.ActualGrossweight?.toFixed(3)}
                                    </div>
                                    <div className="job6Ahww borderRight6A" style={{width:"50.5px"}}>
                                      {e?.data?.rd?.promiseDatef ?? ""}
                                    </div>
                                  </div>
                                </div>
                                <div className="imgSize6A">
                                  {" "}
                                  <img
                                    src={
                                      e?.data?.rd?.DesignImage !== '' 
                                          ? e?.data?.rd?.DesignImage
                                        : require("../../assets/img/default.jpg")
                                    }
                                    id="img6A"
                                    alt=""
                                    
                                    onError={(e) => handleImageError(e)}
                                    loading="eager"
                                  />
                                </div>
                              </div>
                              <div className="main6A">
                                <div className="required6A">
                                  <div className="lbh6A d-flex justify-content-between align-items-center"><div style={{width:"282px", borderRight:"1px solid #989898"}} className="d-flex justify-content-center align-items-center">Required Material</div><div style={{width:"64px", lineHeight:"9px", fontSize:"11px"}} className="d-flex justify-content-center align-items-center">Issue Material</div></div>
                                  <div
                                    className="main6Ahead"
                                    style={{ height: "16px" }}
                                  >
                                    <div className="right6Aa code6A" style={{width:"120px"}}>CODE</div>
                                    <div className="right6Ab code6A" style={{width:"90px"}}>SIZE</div>
                                    <div className="right6Ac code6A" style={{width:"31px"}}>PCS</div>
                                    <div className="right6Ad code6A" style={{width:"40px"}}>WT</div>
                                    <div className="right6Ac code6A" style={{width:"33px", borderLeft:"1px solid #989898"}}>PCS</div>
                                    <div className="right6Ad code6A" style={{width:"32px"}}>WT</div>
                                  </div>
                                  {ele?.data?.map((a, i) => {
                                    return (
                                      <div className="main6Ahead" key={i}>
                                        <div className="right6Aa" style={{width:"120px", fontSize: (a?.ConcatedFullShapeQualityColorCode?.length > 44 ? '9px' : '10px')  }}>
                                          {a?.ConcatedFullShapeQualityColorCode == null ? 'NA' : a?.ConcatedFullShapeQualityColorCode}
                                        </div>
                                        <div className="right6Ab" style={{width:"90px"}}>
                                          {a?.Sizename}
                                        </div>
                                        <div className="right6Ac" style={{width:"31px"}}>
                                          {a?.ActualPcs}
                                        </div>
                                        <div className="right6Ad" style={{width:"40px"}}>
                                          {a?.ActualWeight?.toFixed(3)}
                                        </div>
                                        <div className="right6Ac" style={{borderLeft:"1px solid #989898", width:"33px"}}>
                                        {a?.IssuePcs === 0 ? '' : a?.IssuePcs}
                                        {/* {a?.IssuePcs} */}
                                        </div>
                                        <div className="right6Ad" style={{width:"32px"}}>
                                        {a?.IssueWeight === 0 ? '' : a?.IssueWeight?.toFixed(3)}
                                        </div>
                                      </div>
                                    );
                                  })}
                                  {Array.from(
                                    { length: ele?.length },
                                    (_, index) => (
                                      <div className="main6Ahead" key={index}>
                                        <div className="right6Aa" style={{width:"120px"}}></div>
                                        <div className="right6Ab" style={{width:"90px"}}></div>
                                        <div className="right6Ac" style={{width:"31px"}}></div>
                                        <div className="right6Ad" style={{width:"40px"}}></div>
                                        <div className="right6Ac" style={{width:"33px", borderLeft:"1px solid #989898"}}></div>
                                        <div className="right6Ad" style={{width:"32px"}}></div>
                                      </div>
                                    )
                                  )}
                                </div>
                                
                              </div>
                              <div className="job6Afooter">
                                <div
                                  className="job6AfooterDesc"
                                  style={{ borderTop: "0px", height:"81px" }}
                                >
                                  <div className="cust6A">
                                    <p className="f6A">
                                      CUST. INS.
                                      <span className="f6A ">
                                      {" " + (e?.data?.rd?.ProductInstruction?.length > 0 ? checkInstruction(e?.data?.rd?.ProductInstruction) : checkInstruction(e?.data?.rd?.QuoteRemark))}
                                      </span>
                                    </p>
                                  </div>
                                  <div className="cust6A">
                                    <p className="f6A">
                                      PRD. INS.
                                      <span className="f6A ">
                                      {" " + checkInstruction(e?.data?.rd?.officeuse)}
                                      </span>
                                    </p>
                                  </div>
                                  <div
                                    className="cust6A"
                                    style={{ borderBottom: "0px" }}
                                  >
                                    <p className="f6A">
                                      STM. INS.
                                      <span className="f6A ">
                                        {" " + checkInstruction(e?.data?.rd?.stamping)}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                                <div className="qrcodebg6A">
                                  <QRCodeGenerator
                                    text={e?.data?.rd.serialjobno}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="d-flex justify-content-start ps-5" style={{fontSize:"9px"}}>{e?.data?.rd?.showingDateTimeByJob + " " +e?.data?.rd?.Certifiacte}</div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="containerWD6A">
                        <div className="container6A" key={inx}>
                          <div className="jobInfo6A">
                            <div className="jobInfo6Aheader">
                              <div
                                className="jobName6AD h6A"
                                style={{ fontWeight: "bold" }}
                              >
                                <div>{e?.data?.rd?.serialjobno}</div>
                                <div>{e?.data?.rd?.Designcode}</div>
                                <div className="pe-1" style={{color:"red"}}>{(e?.data?.rd?.MetalType == null ? 'NA' : e?.data?.rd?.MetalType) + " " + (e?.data?.rd?.MetalColorCo == null ? 'NA' : e?.data?.rd?.MetalColorCo)}</div>
                              </div>
                              <div className="jobName6A">
                                <div className="job6Ahww">TR NO.</div>
                                <div className="job6Ahww">TR NO.</div>
                                <div className="job6Ahww">TR NO.</div>
                                <div className="job6Ahww borderRight6A" style={{width:"50.5px"}}>
                                  {e?.data?.rd?.OrderNo}
                                </div>
                              </div>
                              <div className="jobName6A">
                                <div className="job6Ahww" style={{fontSize:`${e?.data?.rd?.ProductType?.length > 18 ? '8.5px' : '9.5px'}`}}>
                                  {e?.data?.rd?.ProductType}
                                </div>
                                <div className="job6Ahww">
                                  {e?.data?.rd?.Size}
                                </div>
                                <div className="job6Ahww">
                                  {e?.data?.rd?.CustomerCode}
                                </div>
                                <div className="job6Ahww borderRight6A" style={{width:"50.5px"}}>
                                  {e?.data.rd?.PO}
                                </div>
                              </div>
                              <div className="jobName6A">
                                <div className="job6Ahww">CS WT/PC</div>
                                <div className="job6Ahww">DIA WT/PC</div>
                                <div className="job6Ahww">Nt Wt/Gr Wt</div>
                                <div className="job6Ahww borderRight6A" style={{backgroundColor:`${e?.data?.rd?.prioritycolorcode}`, width:"50.5px"}}>
                                  {e?.data?.rd?.prioritycode}
                                </div>
                              </div>
                              <div
                                className="jobName6A"
                                style={{ borderBottom: "0px" }}
                              >
                                <div className="job6Ahww">
                                  {e?.additional?.clr?.ActualWeight?.toFixed(3)}/
                                  {e?.additional?.clr?.ActualPcs}
                                </div>
                                <div className="job6Ahww">
                                  {e?.additional?.dia?.ActualWeight?.toFixed(3)}/
                                  {e?.additional?.dia?.ActualPcs}
                                </div>
                                <div className="job6Ahww">
                                  {e?.data?.rd?.ActualGrossweight?.toFixed(3)}/
                                  {e?.data?.rd?.MetalWeight?.toFixed(3)}
                                </div>
                                <div className="job6Ahww borderRight6A" style={{width:"50.5px"}}>
                                  {e?.data?.rd?.promiseDatef ?? ""}
                                </div>
                              </div>
                            </div>
                            <div className="imgSize6A">
                              {" "}
                              <img
                                src={
                                  e?.data?.rd?.DesignImage !== '' 
                                          ? e?.data?.rd?.DesignImage
                                    : require("../../assets/img/default.jpg")
                                }
                                id="img6A"
                                alt=""
                                onError={(e) => handleImageError(e)}
                                loading="eager"
                              />
                            </div>
                          </div>
                          <div className="main6A" style={{width:"345px"}}>
                            <div className="required6A" style={{width:"275.57px"}}>
                              <div className="lbh6A">Required Material</div>
                              <div className="main6Ahead">
                                <div className="right6Aa" style={{width:"120px"}}>CODE</div>
                                <div className="right6Ab" style={{width:"90px"}}>SIZE</div>
                                <div className="right6Ac" style={{width:"31px"}}>PCS</div>
                                <div className="right6Ad" style={{width:"40px"}}>WT</div>
                              </div>
                              <div className="main6Ahead" style={{height:"18px"}}>
                                  <div className="right6Aa" style={{width:"120px"}}>{(e?.data?.rd?.MetalType == null ? 'NA' : e?.data?.rd?.MetalType) + " " + (e?.data?.rd?.MetalColorCo == null ? 'NA' : e?.data?.rd?.MetalColorCo)}</div>
                                  <div className="right6Ab" style={{width:"90px"}}></div>
                                  <div className="right6Ac" style={{width:"31px"}}></div>
                                  <div className="right6Ad" style={{width:"40px"}}></div>
                                </div>
                              {Array.from({ length: 11 }, (_, ind) => (
                                <div className="main6Ahead" key={ind} style={{height:"20px"}}>
                                  <div className="right6Aa"style={{width:"120px"}}></div>
                                  <div className="right6Ab"style={{width:"90px"}}></div>
                                  <div className="right6Ac"style={{width:"31px"}}></div>
                                  <div className="right6Ad"style={{width:"40px"}}></div>
                                </div>
                              ))}
                            </div>
                            <div className="issue6A" style={{width:"70px"}}>
                              <div className="lbh6A">
                                <p style={{ borderRight: "0px" }}>
                                  Issue Material
                                </p>
                                
                              </div>
                              <div className="aside6A" style={{width:"70px"}}>
                                <div className="right6Ac w-50">PCS</div>
                                <div className="right6Ad w-50">WT</div>
                              </div>
                              <div className="aside6A" style={{height:"18px"}}>
                                  <div className="right6Ac w-50"></div>
                                  <div className="right6Ad w-50"></div>
                                </div>
                              {Array.from({ length: 11 }, (_, i) => (
                                <div className="aside6A" key={i} style={{height:"20px", width:"70px"}}>
                                  <div className="right6Ac w-50"></div>
                                  <div className="right6Ad w-50"></div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="job6Afooter">
                            <div
                              className="job6AfooterDesc"
                              style={{ borderTop: "0px", height:"81px" }}
                            >
                              <div className="cust6A">
                                <p className="f6A " style={{fontSize:"11px"}}>
                                  CUST. INS.<span className="f6A pt-1" style={{color:"red"}}>
                                  {" " + (e?.data?.rd?.ProductInstruction?.length > 0 ? checkInstruction(e?.data?.rd?.ProductInstruction) : checkInstruction(e?.data?.rd?.QuoteRemark))}
                                  </span>
                                </p>
                              </div>
                              <div className="cust6A">
                                <p className="f6A" style={{fontSize:"11px"}}>
                                  PRD. INS.<span className="f6A pt-1" style={{color:"red"}}>
                                  { " " + checkInstruction(e?.data?.rd?.officeuse)}
                                  </span>
                                </p>
                              </div>
                              <div
                                className="cust6A"
                                style={{ borderBottom: "0px" }}
                              >
                                <p className="f6A" style={{fontSize:"11px"}}>
                                  STM. INS.<span className="f6A pt-1" style={{color:"red"}}>
                                  {" " + checkInstruction(e?.data?.rd?.stamping)}
                                  </span>
                                </p>
                              </div>
                            </div>
                            <div className="qrcodebg6A">
                              <QRCodeGenerator text={e?.data?.rd?.serialjobno} />
                            </div>
                          </div>
                        </div>
                        <div  className="d-flex justify-content-start ps-5" style={{fontSize:"9px"}}>{e?.data?.rd?.showingDateTimeByJob}</div>
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

export default BagPrint6A;
