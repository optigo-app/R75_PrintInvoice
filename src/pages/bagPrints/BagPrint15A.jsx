import { useLocation } from "react-router-dom";
import queryString from 'query-string';
import React, { useEffect, useState } from "react";
import BarcodeGenerator from '../../components/BarcodeGenerator';
import Loader from '../../components/Loader';
import "../../assets/css/bagprint/print15.css";
import { handlePrint } from "../../GlobalFunctions/HandlePrint";
import { handleImageError } from "../../GlobalFunctions/HandleImageError";
import { organizeData } from './../../GlobalFunctions/OrganizeBagPrintData';
import { GetData } from './../../GlobalFunctions/GetData';
import { GetUniquejob } from "../../GlobalFunctions/GetUniqueJob";
import { checkInstruction } from "../../GlobalFunctions";
const BagPrint15A = ({ queries, headers }) => {
    const location = useLocation();
    const queryParams = queryString.parse(location?.search);
    const resultString = GetUniquejob(queryParams?.str_srjobno);
    const [data, setData] = useState([]);
    useEffect(() => {
        if (Object.keys(queryParams)?.length !== 0) {
            atob(queryParams?.imagepath);
        }
    }, [queryParams]);
    const chunkSize = 7;
    const sizeofChunk = 5;
    useEffect(() => {
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
                    let diamond = [];
                    let colorstone = [];
                    let length = 0;
                    let clr = {
                        clrPcs: 0,
                        clrWt: 0
                    };
                    let dia = {
                        diaPcs: 0,
                        diaWt: 0
                    };
                    let misc = {
                        miscWt: 0
                    };
                    let diaQuaCol = [];
                    let ArrofSevenSize = [];
                    let ArrofFiveSize = [];
                    // eslint-disable-next-line array-callback-return
                    a?.rd1?.map((e, i) => {
                        
                        if (e?.ConcatedFullShapeQualityColorCode !== "- - - ") {
                            length++;
                        }
                        if (e?.MasterManagement_DiamondStoneTypeid === 3) {
                            e.diaclarity = (e?.Quality + " " + e?.ColorName);
                            diaQuaCol.push(e);
                            dia.diaPcs = dia?.diaPcs + e?.ActualPcs;
                            dia.diaWt = dia?.diaWt + e?.ActualWeight;
                        } else if (e?.MasterManagement_DiamondStoneTypeid === 4) {
                            clr.clrPcs +=   e?.ActualPcs;
                            clr.clrWt +=   e?.ActualWeight;
                        } else if (e?.MasterManagement_DiamondStoneTypeid === 7) {
                            misc.miscWt = misc?.miscWt + e?.ActualWeight;
                        }
                        if (e?.MasterManagement_DiamondStoneTypeid === 3) {
                            ArrofSevenSize.push(e);
                        } else if (e?.MasterManagement_DiamondStoneTypeid === 4) {
                            ArrofFiveSize.push(e);
                        } else {
                            return '';
                        }
                    });
                    a.rd.diaclarity = diaQuaCol[0]?.diaclarity;
                    let imagePath = queryParams?.imagepath;
                    imagePath = atob(queryParams?.imagepath);
                    let img = imagePath + a?.rd?.ThumbImagePath;
                    for (let i = 0; i < ArrofSevenSize?.length; i += chunkSize) {
                        const dia_S = ArrofSevenSize?.slice(i, i + chunkSize);
                        let len = 7 - (ArrofSevenSize?.slice(i, i + chunkSize))?.length;
                        diamond?.push({ dia: dia_S, length: len });
                    }
                    for (let i = 0; i < ArrofFiveSize?.length; i += sizeofChunk) {
                        const clr_S = ArrofFiveSize?.slice(i, i + sizeofChunk);
                        let len = 5 - (ArrofFiveSize?.slice(i, i + sizeofChunk))?.length;
                        colorstone?.push({ clr: clr_S, length: len });
                    }
                    let arr1 = [];
                    if (diamond?.length >= colorstone?.length) {
                        // eslint-disable-next-line array-callback-return
                        diamond?.map((e, i) => {
                            let obj = {};
                            obj.diachunk = e;
                            if (colorstone[i] !== undefined) {
                                obj.clrchunk = colorstone[i];
                            }
                            else {
                                obj.clrchunk = { clr: [], length: 5 };
                            }
                            arr1?.push(obj);
                        });
                    }
                    else {
                        // eslint-disable-next-line array-callback-return
                        colorstone?.map((e, i) => {
                            let obj = {};
                            obj.clrchunk = e;
                            if (diamond[i] !== undefined) {
                                obj.diachunk = diamond[i];
                            }
                            else {
                                obj.diachunk = { dia: [], length: 7 };
                            }
                            arr1?.push(obj);
                        });
                    }
                    responseData.push({ data: a, additional: { length: length, clr: clr, dia: dia, img: img, misc: misc, pages: arr1 } });
                    
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
}, [data?.length]);
    return (
        <>
            {
                data.length === 0 ? <Loader /> : 
                <div>
                <div className="print_btn"><button className="btn_white blue print_btn" onClick={(e) => handlePrint(e)}>
                    Print
                </button></div>
                    <div className="p15Awrap pad_60_allPrint">
                        {Array.from({ length: queries?.pageStart }, (_, index) => (
                            index > 0 && <div key={index} className="container15Aold" id="main_container" style={{ border: "0px" }}></div>
                        ))}
                        {data?.length > 0 && data?.map((e, i) => {
                            return (
                            <React.Fragment key={i}>
                                {
                                    e?.additional?.pages?.length > 0 ? e?.additional?.pages?.map((a, index) => {
                                        return (
                                                <div className="container15Aold" id="main_container" key={index}>
                                                    <div className="heading">
                                                        <h1 className="fw-bold" style={{ display: "flex", fontSize: "14px" }}>bag : {e?.data?.rd?.CustomerCode} / {e?.data?.rd?.serialjobno}</h1>
                                                        <div className=" barcode15">
                                                            {(e?.data?.rd1?.length !== 0 && e?.data?.rd1 !== undefined) && <>{e?.data?.rd?.serialjobno !== undefined && <BarcodeGenerator data={e?.data?.rd?.serialjobno} />}</>}
                                                        </div>
                                                    </div>
                                                    <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                                                        <div className="firstCell p-0 d-flex justify-content-start align-items-center ps-1 " > DNS type</div>
                                                        <div className="secondCell text-break"> {e?.data?.rd?.category}</div>
                                                        <div className="thirdCell p-0 d-flex justify-content-start align-items-center ps-1 ">Item count</div>
                                                        <div className="fourthCell"> {e?.data?.rd?.IsSplits_Quotation_Quantity}</div>
                                                    </div>
                                                    <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                                                        <div className="firstCell p-0 d-flex justify-content-start align-items-center ps-1  border-top-0" > DNS Name</div>
                                                        <div className="secondCell" style={{ "borderTop": "0px" }}> {e?.data?.rd?.Designcode}</div>
                                                        <div className="thirdCell p-0 d-flex justify-content-start align-items-center ps-1 border-top-0" > Priority</div>
                                                        <div className="fourthCell" style={{ "borderTop": "0px" }}> {e?.data?.rd?.prioritycode}</div>
                                                    </div>
                                                    <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                                                        <div className="firstCell p-0 d-flex justify-content-start align-items-center ps-1 border-top-0"> DNS size</div>
                                                        <div className="secondCell" style={{ "borderTop": "0px" }}> {e?.data?.rd?.Size}</div>
                                                        <div className="thirdCell p-0 d-flex justify-content-start align-items-center ps-1 border-top-0 border-end-0" style={{ "width": "199.33px" }}> Type: Diamond sieve size</div>
                                                    </div>
                                                    <div style={{ display: "flex" }}>
                                                        <div>
                                                            <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                                                                <div className="firstCell p-0 d-flex justify-content-start align-items-center ps-1  border-top-0"> Raw Metal</div>
                                                                <div className="secondCell border-top-0 text-break"> {e?.data?.rd?.MetalType + " " + e?.data?.rd?.MetalColorCo}</div>
                                                            </div>
                                                            <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                                                                <div className="firstCell p-0 d-flex justify-content-start align-items-center ps-1 border-top-0" > Metal wt</div>
                                                                <div className="secondCell" style={{ "borderTop": "0px" }}> {e?.data?.rd?.MetalWeight?.toFixed(3)}</div>
                                                            </div>
                                                            <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                                                                <div className="firstCell p-0 d-flex justify-content-start align-items-center ps-1  border-top-0"> Dia clarity</div>
                                                                <div className="secondCell" style={{ borderTop: "0px", fontSize: e?.data?.rd?.diaclarity?.length > 16 ? "10px" : "12px" }}>{(e?.data?.rd?.diaclarity ?? 'NA')?.slice(0, 32)}</div>
                                                            </div>
                                                            <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                                                                <div className="firstCell p-0 d-flex justify-content-start align-items-center ps-1  border-top-0" > Dia no / wt</div>
                                                                <div className="secondCell" style={{ "borderTop": "0px" }}> {e?.additional?.dia?.diaPcs}/{e?.additional?.dia?.diaWt.toFixed(3)}</div>
                                                            </div>
                                                            <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                                                                <div className="firstCell p-0 d-flex justify-content-start align-items-center ps-1  border-top-0"  > CLS no / wt</div>
                                                                <div className="secondCell" style={{ "borderTop": "0px" }}> {e?.additional?.clr?.clrPcs}/{e?.additional?.clr?.clrWt.toFixed(3)}</div>
                                                            </div>
                                                            <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                                                                <div className="firstCell p-0 d-flex justify-content-start align-items-center ps-1  border-top-0" > Order date</div>
                                                                <div className="secondCell" style={{ "borderTop": "0px" }}> {e?.data?.rd?.orderDatef}</div>
                                                            </div>
                                                            <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                                                                <div className="firstCell p-0 d-flex justify-content-start align-items-center ps-1  border-top-0" > Due date</div>
                                                                <div className="secondCell" style={{ "borderTop": "0px" }}> {e?.data?.rd?.promiseDatef}</div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div>
                                                                {
                                                                    a?.diachunk?.dia?.map((s, is) => {
                                                                        return (
                                                                            <div style={{ display: "flex" }} key={is}>
                                                                                <div className="subFirstCell">{s?.Sizename ?? ''}</div>
                                                                                <div className="subSecondCell  d-flex justify-content-start align-items-center ps-1">{s?.ActualPcs ?? ''}</div>
                                                                                <div className="subThirdCell  d-flex justify-content-start align-items-center ps-1">{s?.ActualWeight?.toFixed(3) ?? ''}</div>
                                                                            </div>
                                                                        );
                                                                    })
                                                                }
                                                                {a?.diachunk?.dia === undefined && 
                                                                    Array.from({ length: (7) }, (ia) => {
                                                                        return (
                                                                            <div style={{ display: "flex" }} key={ia}>
                                                                                <div className="subFirstCell"></div>
                                                                                <div className="subSecondCell"></div>
                                                                                <div className="subThirdCell"></div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                
                                                            </div>
                                                            <div>
                                                                {
                                                                    // logic of empty chunks
                                                                    Array.from({ length: (a?.diachunk?.length) }, (_,il) => {
                                                                        return (
                                                                            <div style={{ display: "flex" }} key={il}>
                                                                                <div className="subFirstCell"></div>
                                                                                <div className="subSecondCell"></div>
                                                                                <div className="subThirdCell"></div>
                                                                            </div>
                                                                        );
                                                                    })
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="aside">
                                                        <div className="imgSize15"><img src={e?.data?.rd?.DesignImage !== ''  ? e?.data?.rd?.DesignImage : require("../../assets/img/default.jpg")} id="img15" alt="" onError={e => handleImageError(e)} loading="eager"  /></div>
                                                        <div>
                                                            <div className="sub-aside"> Total : {e?.additional?.dia?.diaPcs} pcs</div>
                                                            <div className="sub-aside"> Type : Colorstone sieve size </div>
                                                            <div>
                                                                <div>
                                                                    {
                                                                        a?.clrchunk?.clr?.map((s, i) => {
                                                                            return (
                                                                                <div style={{ display: "flex" }} key={i}>
                                                                                    <div className="subFirstCell">{s?.Sizename}</div>
                                                                                    <div className="subSecondCell  d-flex justify-content-start align-items-center ps-1">{s?.ActualPcs}</div>
                                                                                    <div className="subThirdCell d-flex justify-content-start align-items-center ps-1">{s?.ActualWeight?.toFixed(3)}</div>
                                                                                </div>
                                                                            );
                                                                        })
                                                                    }
                                                                    {a?.diachunk?.dia === undefined && 
                                                                        Array.from({ length: (5) }, (i) => {
                                                                            return (
                                                                                <div style={{ display: "flex" }} key={i}>
                                                                                    <div className="subFirstCell"></div>
                                                                                    <div className="subSecondCell"></div>
                                                                                    <div className="subThirdCell"></div>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                </div>
                                                                <div>
                                                                    {
                                                                        Array.from({ length: (a?.clrchunk?.length) }, (_,iii) => {
                                                                            return (
                                                                                <div style={{ display: "flex" }} key={iii}>
                                                                                    <div className="subFirstCell"></div>
                                                                                    <div className="subSecondCell"></div>
                                                                                    <div className="subThirdCell"></div>
                                                                                </div>
                                                                            );
                                                                        })
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="sub-aside">
                                                                <div > Total : {e?.additional?.clr?.clrPcs} pcs</div>
                                                            </div>
                                                            <div className="sub-aside_15A text-break" style={{ "borderBottom": "none" }}>
                                                                <p style={{ fontSize: "10px", lineHeight: "9px" }}>Ins. <span className="fw-bold text-break"> {( " " + ((e?.data?.rd?.ProductInstruction?.length > 0 ? checkInstruction(e?.data?.rd?.ProductInstruction) : checkInstruction(e?.data?.rd?.QuoteRemark)))?.slice(0, 89))} </span></p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                        );
                                    }) : <div className="container15Aold" id="main_container">
                                        <div className="heading">
                                            <h1 className="fw-bold" style={{ display: "flex", fontSize: "14px" }}>bag : {e?.data?.rd?.CustomerCode} / {e?.data?.rd?.serialjobno}</h1>
                                            <div className=" barcode15">
                                                {(e?.data?.rd?.length !== 0 && e?.data?.rd !== undefined) && <>{e?.data?.rd?.serialjobno !== undefined && <BarcodeGenerator data={e?.data?.rd?.serialjobno} />}</>}
                                            </div>
                                        </div>
                                        <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                                            <div className="firstCell p-0 d-flex justify-content-start align-items-center ps-1 " >DNS type</div>
                                            <div className="secondCell"> {e?.data?.rd?.category}</div>
                                            <div className="thirdCell p-0 d-flex justify-content-start align-items-center ps-1 ">Item count</div>
                                            <div className="fourthCell"> {e?.data?.rd?.IsSplits_Quotation_Quantity}</div>
                                        </div>
                                        <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                                            <div className="firstCell p-0 d-flex justify-content-start align-items-center ps-1 border-top-0" > DNS Name</div>
                                            <div className="secondCell  border-top-0" > {e?.data?.rd?.Designcode}</div>
                                            <div className="thirdCell p-0 d-flex justify-content-start align-items-center ps-1  border-top-0" > Priority</div>
                                            <div className="fourthCell border-top-0" > {e?.data?.rd?.prioritycode}</div>
                                        </div>
                                        <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                                            <div className="firstCell p-0 d-flex justify-content-start align-items-center ps-1 border-top-0" > DNS size</div>
                                            <div className="secondCell" style={{ "borderTop": "0px" }}> {e?.data?.rd?.Size}</div>
                                            <div className="thirdCell p-0 d-flex justify-content-start align-items-center ps-1 border-top-0 border-right-0" style={{ "width": "199.33px" }}>Type: Diamond sieve size</div>
                                        </div>
                                        <div style={{ display: "flex" }}>
                                            <div>
                                                <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                                                    <div className="firstCell p-0 d-flex justify-content-start align-items-center ps-1 border-top-0"  > Raw Metal</div>
                                                    <div className="secondCell text-break border-top-0"> {e?.data?.rd?.MetalType}{e?.data?.rd?.MetalColorCo}</div>
                                                </div>
                                                <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                                                    <div className="firstCell p-0 d-flex justify-content-start align-items-center ps-1 border-top-0"> Metal wt</div>
                                                    <div className="secondCell" style={{ "borderTop": "0px" }}> {e?.data?.rd?.MetalWeight?.toFixed(3)}</div>
                                                </div>
                                                <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                                                    <div className="firstCell p-0 d-flex justify-content-start align-items-center ps-1 border-top-0" > Dia clarity</div>
                                                    <div className="secondCell" style={{ "borderTop": "0px" }}>{e?.data?.rd?.diaclarity ?? 'NA'}</div>
                                                </div>
                                                <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                                                    <div className="firstCell p-0 d-flex justify-content-start align-items-center ps-1  border-top-0" > Dia no / wt</div>
                                                    <div className="secondCell" style={{ "borderTop": "0px" }}> {e?.additional?.dia?.diaPcs}/{e?.additional?.dia?.diaWt?.toFixed(3)}</div>
                                                </div>
                                                <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                                                    <div className="firstCell p-0 d-flex justify-content-start align-items-center ps-1  border-top-0" > CLS no / wt</div>
                                                    <div className="secondCell" style={{ "borderTop": "0px" }}> {e?.additional?.clr?.clrPcs}/{e?.additional?.clr?.clrWt?.toFixed(3)}</div>
                                                </div>
                                                <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                                                    <div className="firstCell p-0 d-flex justify-content-start align-items-center ps-1 border-top-0" > Order date</div>
                                                    <div className="secondCell" style={{ "borderTop": "0px" }}> {e?.data?.rd?.orderDatef}</div>
                                                </div>
                                                <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                                                    <div className="firstCell p-0 d-flex justify-content-start align-items-center ps-1  border-top-0" > Due date</div>
                                                    <div className="secondCell" style={{ "borderTop": "0px" }}> {e?.data?.rd?.promiseDatef}</div>
                                                </div>
                                            </div>
                                            <div>
                                                <div>
                                                    {
                                                        Array.from({ length: (7) }, (_,is) => {
                                                            return (
                                                                <div style={{ display: "flex" }} key={is}>
                                                                    <div className="subFirstCell"></div>
                                                                    <div className="subSecondCell"></div>
                                                                    <div className="subThirdCell"></div>
                                                                </div>
                                                            );
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="aside">
                                            <div className="imgSize15"><img src={e?.data?.rd?.DesignImage !== '' ? e?.data?.rd?.DesignImage : require("../../assets/img/default.jpg")} id="img15" alt="" onError={e => handleImageError(e)} loading="eager"  /></div>
                                            <div>
                                                <div className="sub-aside"> Total : {e?.additional?.dia?.diaPcs} Pcs</div>
                                                <div className="sub-aside"> Type: Colorstone sieve size</div>
                                                <div>
                                                    <div>
                                                        {
                                                            Array.from({ length: (5) }, (_,i5) => {
                                                                return (
                                                                    <div style={{ display: "flex" }} key={i5}>
                                                                        <div className="subFirstCell"></div>
                                                                        <div className="subSecondCell"></div>
                                                                        <div className="subThirdCell"></div>
                                                                    </div>
                                                                );
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                                <div className="sub-aside">
                                                    <div> Total : 0 pcs</div>
                                                </div>
                                                <div className="sub-aside_15A border-bottom-0">
                                                    <div><p style={{ fontSize: "10px", lineHeight: "9px", padding: "1px" }}>Ins.
                                                                <span className="text-break fw-bold">{(" " + checkInstruction(e?.data?.rd?.officeuse) + " " + (e?.data?.rd?.ProductInstruction?.length > 0 ? checkInstruction(e?.data?.rd?.ProductInstruction) : checkInstruction(e?.data?.rd?.QuoteRemark)))?.slice(0, 89)}</span>
                                                    </p></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </React.Fragment>
                            );
                        })
                        }
                    </div>
                </div>
            }
        </>

    );
};
export default BagPrint15A;

