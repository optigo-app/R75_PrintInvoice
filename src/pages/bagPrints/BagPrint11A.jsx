import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import "../../assets/css/bagprint/print11A.css";
import BarcodeGenerator from "../../components/BarcodeGenerator";
import Loader from "../../components/Loader";
import { GetData } from "../../GlobalFunctions/GetData";
import { GetChunkData } from "../../GlobalFunctions/GetChunkData";
import { handlePrint } from "../../GlobalFunctions/HandlePrint";
import { handleImageError } from "../../GlobalFunctions/HandleImageError";
import { organizeData } from "../../GlobalFunctions/OrganizeBagPrintData";
import { GetUniquejob } from "../../GlobalFunctions/GetUniqueJob";
const BagPrint11A = ({ queries, headers }) => {
  const [data, setData] = useState([]);
  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const resultString = GetUniquejob(queryParams?.str_srjobno);
  const chunkSize17 = 8;
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
        console.log(allDatas);
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
          datas?.rd1?.map((e, i) => {
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
          
          if(dia.ActualPcs !== 0 && dia.ActualWeight !== 0){
            DiamondList.push(dia);
          }
          if(clr.ActualPcs !== 0 && clr.ActualWeight !== 0){
            ColorStoneList.push(clr);
          }
          if(f.ActualPcs !== 0 && f.ActualWeight !== 0){
            FindingList.push(f);
          }
          if(misc.ActualPcs !== 0 && misc.ActualWeight !== 0){
            MiscList.push(misc);
          }
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

          <div className="print11A pad_60_allPrint">
            {Array.from(
              { length: queries?.pageStart },
              (_, index) =>
                index > 0 && (
                  <div
                    key={index}
                    className="container11A"
                    style={{ border: "0px" }}
                  ></div>
                )
            )}
            {data?.length > 0 &&
              data?.map((e, i) => {
                return (
                  <div className="container11A" key={i}>
                    <div className="header11A">
                      <div className="jobInfo11A">
                        <div className="jobRow11A br_right_11A">
                          <div>
                            <b>{e?.data?.rd?.serialjobno}</b>
                          </div>
                          <div>
                            <b>{e?.data?.rd?.Designcode}</b>
                          </div>
                          <div>
                            <b style={{ paddingRight: "3px" }}>
                              {e?.data?.rd?.MetalType}
                              {e?.data?.rd?.MetalColorCo}
                            </b>
                          </div>
                        </div>
                        <div className="jobHead11A">
                          <div className="border11A c11A">PRIORITY</div>
                          <div className="border11A c11A">LOC.</div>
                          <div className="border11A c11A">Q.C.</div>
                        </div>
                        <div className="infoFlex11A">
                          <div className="info11A">
                            <div className="flex11A">
                              <p className="p11A">SALES REP.</p>
                              <p className="p11A">
                                {e?.data?.rd?.SalesrepCode}
                              </p>
                            </div>
                            <div className="flex11A">
                              <p className="p11A">CUSTOMER</p>
                              <p className="p11A">
                                {e?.data?.rd?.CustomerCode}
                              </p>
                            </div>
                            <div className="flex11A">
                              <p className="p11A">SIZE</p>
                              <p className="p11A">{e?.data?.rd?.Size}</p>
                            </div>
                          </div>
                          <div className="info11A">
                            <div className="flex11A">
                              <p className="p11A">ORDER DATE</p>
                              <p className="p11A">
                                {e?.data?.rd?.orderDatef ?? ""}
                              </p>
                            </div>
                            <div className="flex11A">
                              <p className="p11A">DEL DATE</p>
                              <p className="p11A">
                                {e?.data?.rd?.promiseDatef ?? ""}
                              </p>
                            </div>
                            <div className="flex11A">
                              <p className="p11A">NET WT</p>
                              <p className="p11A">
                                {/* {e?.data?.rd?.netwt?.toFixed(3)} */}
                                {e?.data?.rd?.ActualGrossweight?.toFixed(3)}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="jobHead11A">
                          <div className="border11A c11A">TR NO.</div>
                          <div className="border11A c11A">TR NO.</div>
                          <div className="border11A c11A">TR NO.</div>
                        </div>
                        <div className="jobHead11A">
                          <div className="border11A c11A">TR WT.</div>
                          <div className="border11A c11A">TR WT.</div>
                          <div className="border11A c11A">TR WT.</div>
                        </div>
                      </div>
                      <div className="img11A">
                        <img src={e?.data?.rd?.DesignImage !== '' 
                                          ? e?.data?.rd?.DesignImage : require("../../assets/img/default.jpg") }
                          id="img11A"
                          alt=""
                          onError={(e) => handleImageError(e)}
                          loading="eager"
                        />
                      </div>
                    </div>
                    <div className="main11A">
                      <div className="bar11A">
                        <div className="mainSet11A">
                          <div className="tablehead11A">
                            <div className="tHead11A" style={{ borderBottom: "1px solid #989898" }} >
                              <div className="sideHead11A" style={{ width:"52px"}}>DEPT</div>
                              <div className="sideHead11B" style={{width:"50px"}}>ISSUE</div>
                              <div className="sideHead11B">RECEIVE</div>
                              <div className="sideHead11B">SCRAP</div>
                              <div className="sideHead11C" style={{width:"45px"}}>PCS</div>
                              <div className="sideHead11B">WORKER</div>
                            </div>
                            <div className="tHead11A ">
                              <div className="sideHead11A" style={{width:"52px", justifyContent:"flex-start"}}>MLT.</div>
                              <div className="sideHead11B" style={{width:"50px"}}></div>
                              <div className="sideHead11B"></div>
                              <div className="sideHead11B"></div>
                              <div className="sideHead11C" style={{width:"45px"}}></div>
                              <div className="sideHead11B"></div>
                            </div>
                            <div className="tHead11A">
                              {/* <div className="sideHead11A" style={{width:"45px", justifyContent:"flex-start"}}>TP.</div> */}
                              <div className="sideHead11A" style={{width:"52px", justifyContent:"flex-start"}}>TP.</div>
                              <div className="sideHead11B" style={{width:"50px"}}></div>
                              <div className="sideHead11B"></div>
                              <div className="sideHead11B"></div>
                              <div className="sideHead11C" style={{width:"45px"}}></div>
                              <div className="sideHead11B"></div>
                            </div>
                            <div className="tHead11A">
                              <div className="sideHead11A" style={{width:"52px", justifyContent:"flex-start"}}>FLG.</div>
                              <div className="sideHead11B" style={{width:"50px"}}></div>
                              <div className="sideHead11B"></div>
                              <div className="sideHead11B"></div>
                              <div className="sideHead11C" style={{width:"45px"}}></div>
                              <div className="sideHead11B"></div>
                            </div>
                            <div className="tHead11A">
                              <div className="sideHead11A" style={{width:"52px", justifyContent:"flex-start"}}>CNC.</div>
                              <div className="sideHead11B" style={{width:"50px"}}></div>
                              <div className="sideHead11B"></div>
                              <div className="sideHead11B"></div>
                              <div className="sideHead11C" style={{width:"45px"}}></div>
                              <div className="sideHead11B"></div>
                            </div>
                            <div className="tHead11A">
                              <div className="sideHead11A" style={{width:"52px", justifyContent:"flex-start"}}>FIL.</div>
                              <div className="sideHead11B" style={{width:"50px"}}></div>
                              <div className="sideHead11B"></div>
                              <div className="sideHead11B"></div>
                              <div className="sideHead11C" style={{width:"45px"}}></div>
                              <div className="sideHead11B"></div>
                            </div>
                            <div className="tHead11A">
                              <div className="sideHead11A" style={{width:"52px", justifyContent:"flex-start"}}>HM.</div>
                              <div className="sideHead11B" style={{width:"50px"}}></div>
                              <div className="sideHead11B"></div>
                              <div className="sideHead11B"></div>
                              <div className="sideHead11C" style={{width:"45px"}}></div>
                              <div className="sideHead11B"></div>
                            </div>
                            <div className="tHead11A">
                              <div className="sideHead11A" style={{width:"52px", justifyContent:"flex-start"}}>TNG.</div>
                              <div className="sideHead11B" style={{width:"50px"}}></div>
                              <div className="sideHead11B"></div>
                              <div className="sideHead11B"></div>
                              <div className="sideHead11C" style={{width:"45px"}}></div>
                              <div className="sideHead11B"></div>
                            </div>
                            <div className="tHead11A">
                              <div className="sideHead11A " style={{width:"52px", justifyContent:"flex-start"}}>PLH.</div>
                              <div className="sideHead11B" style={{width:"50px"}}></div>
                              <div className="sideHead11B"></div>
                              <div className="sideHead11B"></div>
                              <div className="sideHead11C" style={{width:"45px"}}></div>
                              <div className="sideHead11B"></div>
                            </div>
                          </div>
                        </div>
                        <div className="barcode11A">
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
                      <div className="ins11A">
                        <div className="ins11A1">
                          <div className="sls11A">SLS. INS.</div>
                          <div className="insVal11A"></div>
                        </div>
                        <div className="ins11A1">
                          <div className="sls11A">PRD. INS.</div>
                          <div className="insVal11A"></div>
                        </div>
                        <div
                          className="ins11A1"
                          style={{ borderBottom: "0px" }}
                        >
                          <div className="sls11A">QC. INS.</div>
                          <div className="insVal11A"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </>
      )}
    </>
  );
};
export default BagPrint11A;
