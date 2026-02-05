import queryString from 'query-string';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import "../../assets/css/bagprint/bagprint21.css";
import { GetData } from '../../GlobalFunctions/GetData';
import { handleImageError } from '../../GlobalFunctions/HandleImageError';
import { handlePrint } from '../../GlobalFunctions/HandlePrint';
import BarcodeGenerator from '../../components/BarcodeGenerator';
import Loader from '../../components/Loader';
import { organizeData } from '../../GlobalFunctions/OrganizeBagPrintData';
import { GetChunkData } from './../../GlobalFunctions/GetChunkData';
import { GetUniquejob } from '../../GlobalFunctions/GetUniqueJob';
import { checkInstruction } from '../../GlobalFunctions';

function BagPrint21A({ queries, headers }) {
    const [data, setData] = useState([]);
    const location = useLocation();
    const queryParams = queryString.parse(location?.search);
    const resultString = GetUniquejob(queryParams?.str_srjobno);
    const chunkSize17 = 7;
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
                    let total = {
                        ActualPcs: 0,
                        ActualWeight: 0,
                    };
                    // let clr = {
                    //     Shapename: "TOTAL",
                    //     Sizename: "",
                    //     ActualPcs: 0,
                    //     ActualWeight: 0,
                    // };
                    // let dia = {
                    //     Shapename: "TOTAL",
                    //     Sizename: "",
                    //     ActualPcs: 0,
                    //     ActualWeight: 0,
                    // };
                    // let misc = {
                    //     Shapename: "TOTAL",
                    //     Sizename: "",
                    //     ActualPcs: 0,
                    //     ActualWeight: 0,
                    // };
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

                        if (e?.MasterManagement_DiamondStoneTypeid !== 0) {
                            total.ActualPcs = total?.ActualPcs + e?.ActualPcs;
                            total.ActualWeight = total?.ActualWeight + e?.ActualWeight;
                        }
                        if (e?.ConcatedFullShapeQualityColorCode !== "- - - ") {
                            length++;
                        }
                        if (e?.MasterManagement_DiamondStoneTypeid === 5) {
                            FindingList.push(e);
                            f.ActualPcs = f.ActualPcs + e?.ActualPcs;
                            f.ActualWeight = f.ActualWeight + e?.ActualWeight;
                            // DiamondList.push(e);
                            // dia.ActualPcs = dia.ActualPcs + e?.ActualPcs;
                            // dia.ActualWeight = dia.ActualWeight + e?.ActualWeight;
                        } else if (e?.MasterManagement_DiamondStoneTypeid === 4) {
                            // ColorStoneList.push(e);
                            // clr.ActualPcs = clr.ActualPcs + e?.ActualPcs;
                            // clr.ActualWeight = clr.ActualWeight + e?.ActualWeight;
                        } else if (e?.MasterManagement_DiamondStoneTypeid === 3) {
                            // FindingList.push(e);
                            // f.ActualPcs = f.ActualPcs + e?.ActualPcs;
                            // f.ActualWeight = f.ActualWeight + e?.ActualWeight;
                        } else if (e?.MasterManagement_DiamondStoneTypeid === 7) {
                            // MiscList.push(e);
                            // misc.ActualPcs = misc.ActualPcs + e?.ActualPcs;
                            // misc.ActualWeight = misc.ActualWeight + e?.ActualWeight;
                        }
                    });

                    // dia.ActualPcs = +(dia.ActualPcs?.toFixed(3));
                    // dia.ActualWeight = +(dia.ActualWeight?.toFixed(3));
                    // clr.ActualPcs = +(clr.ActualPcs?.toFixed(3));
                    // clr.ActualWeight = +(clr.ActualWeight?.toFixed(3));
                    // misc.ActualPcs = +(misc.ActualPcs?.toFixed(3));
                    // misc.ActualWeight = +(misc.ActualWeight?.toFixed(3));
                    f.ActualPcs = +(f.ActualPcs?.toFixed(3));
                    f.ActualWeight = +(f.ActualWeight?.toFixed(3));
              
                    let arr = [];
                    let mainArr = arr?.concat(DiamondList, ColorStoneList, MiscList, FindingList);
                    let imagePath = queryParams?.imagepath;
                    imagePath = atob(queryParams?.imagepath);
                    let img = imagePath + a?.rd?.ThumbImagePath;
                    let arrofchunk = GetChunkData(chunkSize17, mainArr);
                    responseData.push({ data: a, additional: { length: length, clr: {}, dia: {}, f: f, img: img, misc: {}, total: total, pages: arrofchunk } });
                  })
                setData(responseData);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
//     useEffect(() => {
//         if (data?.length !== 0) {
//             setTimeout(() => {
//                 window.print();
//             }, 5000);
//         }
// }, [data?.length]);
    return (
        <>
            {
                data.length === 0 ? <Loader /> : <><div className="print_btn"><button className="btn_white blue print_btn" onClick={(e) => handlePrint(e)}>
                    Print
                </button></div>
                    <div className='bag14Aflex pad_60_allPrint '>
                        <div className='straight_print'>
                            {Array.from({ length: queries?.pageStart }, (_, index) => (
                                index > 0 && <div key={index} className="container_1" style={{ border: "0px" }}></div>
                            ))}
                            {
                                data?.length > 0 && data?.map((e, i) => {
                                    return (
                                        <React.Fragment key={i}>
                                            {
                                                e?.additional?.pages?.length > 0 ? 
                                                        e?.additional?.pages?.map((a, index) => {
                                                            return (
                                                                    <div className='container_1' key={index}>
                                                                        <div className='firstpart'>
                                                                            <div className='firstpart_header'>
                                                                                <div className='firstpart_one'>
                                                                                    <div className='firstpart_one_1'><div className='firstpart_one_chunk _color fw-bold'>BAG NO</div><div className='firstpart_one_chunk_val workbreak'>{`${e?.data?.rd?.serialjobno}`}</div></div>
                                                                                    <div className='firstpart_one_1'><div className='firstpart_one_chunk _color fw-bold'>CUSTOMER</div><div className='firstpart_one_chunk_val workbreak'>{`${e?.data?.rd?.CustomerCode}`}</div></div>
                                                                                    <div className='firstpart_one_1'><div className='firstpart_one_chunk _color fw-bold'>ORDER DATE</div><div className='firstpart_one_chunk_val workbreak'>{`${e?.data?.rd?.orderDatef ?? ''}`}</div></div>
                                                                                    <div className='firstpart_one_1'><div className='firstpart_one_chunk _color fw-bold'>DUE DATE</div><div className='firstpart_one_chunk_val workbreak'>{`${e?.data?.rd?.promiseDatef ?? ''}`}</div></div>
                                                                                    <div className='firstpart_one_1'><div className='firstpart_one_chunk _color fw-bold'>ORDER NO</div><div className='firstpart_one_chunk_val workbreak'>{`${e?.data?.rd?.OrderNo}`}</div></div>
                                                                                    <div className='firstpart_one_1'><div className='firstpart_one_chunk _color fw-bold'></div><div className='firstpart_one_chunk_val  workbreak'></div></div>
                                                                                    {/* <div className='firstpart_one_1'><div className='firstpart_one_chunk _color'>ORDER PCS</div><div className='firstpart_one_chunk_val workbreak'>{`${e?.data?.rd?.IsSplits_Quotation_Quantity}`}</div></div> */}
                                                                                    {/* <div className='firstpart_one_1'><div className='firstpart_one_chunk _color' style={{ borderRight: "none" }}></div><div className='firstpart_one_chunk_val workbreak'></div></div> */}
                                                                                </div>
                                                                                <div className='firstpart_two'>
                                                                                    <div className='firstpart_one_1'><div className='firstpart_two_chunk _color fw-bold'>DESIGN NO.</div><div className='firstpart_two_chunk w_bg21 workbreak'>{e?.data?.rd?.Designcode}</div></div>
                                                                                    <div className='firstpart_one_1'><div className='firstpart_two_chunk _color fw-bold'>PO. NO</div><div className='firstpart_two_chunk w_bg21 workbreak'>{`${e?.data?.rd?.PO}`}</div></div>
                                                                                    {/* <div className='firstpart_one_1'><div className='firstpart_two_chunk _color'>SIZE</div><div className='firstpart_two_chunk workbreak'>{`${e?.data?.rd?.Size}`}</div></div> */}
                                                                                    <div className='firstpart_one_1'><div className='firstpart_two_chunk _color fw-bold'>MFG DESIGN</div><div className='firstpart_two_chunk w_bg21 workbreak'>{e?.data?.rd?.mfgdesign}</div></div>
                                                                                    <div className='firstpart_one_1'><div className='firstpart_two_chunk _color fw-bold'>STYLE</div><div className='firstpart_two_chunk w_bg21 workbreak'>{e?.data?.rd?.style}</div></div>
                                                                                    <div className='firstpart_one_1'><div className='firstpart_two_chunk _color fw-bold'>DIMENSIONS</div><div className='firstpart_two_chunk w_bg21 workbreak'>{e?.data?.rd?.Dimension}</div></div>
                                                                                    <div className='firstpart_one_1'><div className='firstpart_two_chunk _color fw-bold'>MAKE TYPE</div><div className='firstpart_two_chunk w_bg21 workbreak'>{`${e?.data?.rd?.mastermanagement_maketypename}`}</div></div>
                                                                                    {/* <div className='firstpart_one_1'><div className='firstpart_two_chunk '>PROPOSED</div><div className='firstpart_two_chunk workbreak'>ISSUE</div></div> */}
                                                                                    {/* <div className='firstpart_one_1'><div className='firstpart_two_chunk _color'>KT</div><div className='firstpart_two_chunk workbreak'>{e?.data?.rd?.MetalType?.split(" ")?.[1]}</div></div> */}
                                                                                    {/* <div className='firstpart_one_1'><div className='firstpart_two_chunk _color'>S.P.</div><div className='firstpart_two_chunk workbreak'>{`${e?.data?.rd?.SalesrepCode}`}</div></div> */}
                                                                                </div>
                                                                            </div>
                                                                            <div className='firstpart_footer'>
                                                                                <div className='footer_one'>
                                                                                    <div className='firstpart_one_1'>
                                                                                        <div className='firstpart_one_chunk_2  _color pe-1 fw-bold'>FINDING NAME</div>
                                                                                        {/* <div className='firstpart_one_chunk_val _color'>RM SIZE</div> */}
                                                                                    </div>
                                                                                    <div className='firstpart_one_2  fw-bold'>
                                                                                        <div className='semi _color pe-1'>PCS</div>
                                                                                        <div className='semi _color pe-1'>WT</div>
                                                                                    </div>
                                                                                    {/* <div className='firstpart_one_1  fw-bold'>
                                                                                        <div className='semi _color pe-1'>PCS</div>
                                                                                        <div className='semi _color pe-1'>WT</div>
                                                                                    </div> */}
                                                                                </div>
                                                                            </div>
                                                                            <div>
                                                                                <div>
                                                                                    {
                                                                                        a?.data?.map((ele, i) => {
                                                                                            return (           
                                                                                                    <div style={{ display: "flex" }} key={i}>
                                                                                                        <div className='firstpart_one_1'>
                                                                                                            {ele?.Shapename === "TOTAL" ? <div className='firstpart_one_chunk_2 workbreak'><b>{ele?.Shapename}</b></div> : <div className='firstpart_one_chunk_2 workbreak'>{ele?.ConcatedFullShapeQualityColorCode}</div>}
                                                                                                            {/* <div className='firstpart_one_chunk_val workbreak'>{ele?.Sizename}</div> */}
                                                                                                        </div>
                                                                                                        <div className='firstpart_one_2'>
                                                                                                            <div className="semi workbreak pe-1" style={{ fontWeight: ele?.Shapename === 'TOTAL' ? 'bold' : 'normal' }}>{ele?.ActualPcs}</div>
                                                                                                            <div className="semi workbreak pe-1" style={{ fontWeight: ele?.Shapename === 'TOTAL' ? 'bold' : 'normal' }}>{ele?.ActualWeight?.toFixed(3)}</div>
                                                                                                        </div>
                                                                                                        {/* <div className='firstpart_one_1'>
                                                                                                            <div className='semi workbreak'></div>
                                                                                                            <div className='semi workbreak'></div>
                                                                                                        </div> */}
                                                                                                    </div>
                                                                                            );
                                                                                        })

                                                                                    }
                                                                                </div>
                                                                                <div>
                                                                                    {
                                                                                        // logic of empty chunks
                                                                                        Array.from({ length: (a?.length) }, (_,i) => {
                                                                                            return (
                                                                                                <div style={{ display: "flex" }} key={i}>
                                                                                                    <div className='firstpart_one_1'>
                                                                                                        <div className='firstpart_one_chunk_2 _color'></div>
                                                                                                        {/* <div className='firstpart_one_chunk_val _color'></div> */}
                                                                                                    </div>
                                                                                                    <div className='firstpart_one_2'>
                                                                                                        <div className="semi _color"></div>
                                                                                                        <div className="semi _color"></div>
                                                                                                    </div>
                                                                                                    {/* <div className='firstpart_one_1'>
                                                                                                        <div className='semi _color'></div>
                                                                                                        <div className='semi _color'></div>
                                                                                                    </div> */}
                                                                                                </div>
                                                                                            );
                                                                                        })
                                                                                    }
                                                                                </div>
                                                                                <div>
                                                                                    <div style={{ display: "flex" }} key={i}>
                                                                                        <div className='firstpart_one_1'>
                                                                                            <div className='firstpart_one_chunk_2 _color border-bottom-0'><b style={{ color: "black" }}>TOTAL</b></div>
                                                                                            {/* <div className='firstpart_one_chunk_val _color border-bottom-0'></div> */}
                                                                                        </div>
                                                                                        <div className='firstpart_one_2'>
                                                                                            <div className="semi _color border-bottom-0 pe-1"><b style={{ color: "black" }}>{e?.additional?.total?.ActualPcs}</b></div>
                                                                                            <div className="semi _color border-bottom-0 pe-1"><b style={{ color: "black" }}>{e?.additional?.total?.ActualWeight?.toFixed(3)}</b></div>
                                                                                        </div>
                                                                                        {/* <div className='firstpart_one_1'>
                                                                                            <div className='semi _color border-bottom-0'></div>
                                                                                            <div className='semi _color border-bottom-0'></div>
                                                                                        </div> */}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className='brt_bg21 brr_bg21 ins_bg21 p-1 fsbg21 text-break'>
                                                                                <div className='fw-bold fsbg21 text-break'>INSTRUCTION : &nbsp;  {" " +(e?.data?.rd?.ProductInstruction?.length > 0 ? checkInstruction( e?.data?.rd?.ProductInstruction ) : checkInstruction( e?.data?.rd?.QuoteRemark))}</div> 
                                                                            </div>
                                                                            {/* <div className='footer_one'>
                                                                                <div className='firstpart_one_1'>
                                                                                    <div className='firstpart_one_chunk workbreak _color'>PARTICLUAR</div>
                                                                                    <div className='firstpart_one_chunk_val workbreak _color'>DATE</div>
                                                                                </div>
                                                                                <div className='firstpart_one_2'>
                                                                                    <div className='semi workbreak _color'>PCS</div>
                                                                                    <div className='semi workbreak _color'>WT</div>
                                                                                </div>
                                                                                <div className='firstpart_one_1'>
                                                                                    <div className='semi workbreak _color'>WORKER</div>
                                                                                    <div className='semi workbreak _color'>WORKER</div>
                                                                                </div>
                                                                            </div> */}
                                                                            {/* <div className='footer_one'>
                                                                                <div className='firstpart_one_1'>
                                                                                    <div className='firstpart_one_chunk workbreak _color'>WT TOLERANCE</div>
                                                                                    <div className='firstpart_one_chunk_val workbreak'></div>
                                                                                </div>
                                                                                <div className='firstpart_one_2'>
                                                                                    <div className='semi workbreak'></div>
                                                                                    <div className='semi workbreak'></div>
                                                                                </div>
                                                                                <div className='firstpart_one_1'>
                                                                                    <div className='semi workbreak'></div>
                                                                                    <div className='semi workbreak'></div>
                                                                                </div>
                                                                            </div> */}
                                                                        </div>
                                                                        <div className='secondpart'>
                                                                            {/* <div className='firstpart_one_1'><div className='firstpart_one_chunk_val _color '>DESIGN NO</div><div className='firstpart_one_chunk workbreak' style={{ borderRight: "none" }}>{`${e?.data?.rd?.Designcode}`}</div></div> */}
                                                                            <div className='imagediv'><img src={e?.data?.rd?.DesignImage !== ''  ? e?.data?.rd?.DesignImage : require("../../assets/img/default.jpg")} id="img15" alt="" onError={e => handleImageError(e)} loading="eager"  /></div>
                                                                            <div className='barcodediv '><div className='barcode14'>
                                                                                {(e?.data?.rd?.length !== 0 && e?.data?.rd !== undefined) && <>{e?.data?.rd?.serialjobno !== undefined && <BarcodeGenerator data={e?.data?.rd?.serialjobno} />}</>}
                                                                            </div></div>
                                                                            {/* <div className='firstpart_one_1'><div className='semi _color'>SPE REM.	:</div><div className='semi_border workbreak flexSPE'>{(e?.data?.rd?.ProductInstruction?.length > 0 ? checkInstruction(e?.data?.rd?.ProductInstruction) : checkInstruction(e?.data?.rd?.QuoteRemark))}</div></div>
                                                                            <div className='info workbreak flex_data' style={{ fontSize: "12px" }}>
                                                                                <div>{e?.data?.rd?.productinfo}</div>
                                                                            </div> */}
                                                                            {/* <div className='secondpart_footer_2'>
                                                                                <div className='fg_info_1 _color font_size'>FG DETAILS</div>
                                                                                <div className='fg_info_2 _color font_size'>RM TRANSACTION</div>
                                                                            </div> */}
                                                                            <div className='secondpart_footer_2'>
                                                                                {/* <div className='fg_info_1'><div className='last_1 _color font_size' style={{ borderRight: "1px solid grey" }}>QTY</div><div className='last_1 _color font_size'>WT</div></div> */}
                                                                                <div className='fg_info_2'>
                                                                                    <div className='last_2 _color font_size fw-bold'>PCS </div>
                                                                                    <div className='last_2 _color font_size fw-bold'> WT </div>
                                                                                    <div className='last_2 _color font_size fw-bold' style={{ borderRight: "none" }}> SIZE </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className='secondpart_footer_2'>
                                                                                {/* <div className='fg_info_1'><div className='last_1 _color font_size' style={{ borderRight: "1px solid grey" }}>QTY</div><div className='last_1 _color font_size fw-bold'>WT</div></div> */}
                                                                                <div className='fg_info_2'>
                                                                                    <div className='last_2 _color font_size'>{e?.data?.rd?.Quantity}</div>
                                                                                    <div className='last_2 _color font_size'>{e?.data?.rd?.ActualGrossweight}</div>
                                                                                    <div className='last_2 _color font_size' style={{ borderRight: "none" }}>{e?.data?.rd?.Size}</div>
                                                                                </div>
                                                                            </div>
                                                                            <div className='secondpart_footer_2 secondpart_footer_2_21'>
                                                                                {/* <div className='fg_info_1'><div className='last_1 _color font_size' style={{ borderRight: "1px solid grey" }}>QTY</div><div className='last_1 _color font_size'>WT</div></div> */}
                                                                                <div className='fg_info_2'>
                                                                                    <div className='last_2 _color font_size fw-bold last_2_21'>TOTAL PCS </div>
                                                                                    <div className='last_2 _color font_size fw-bold last_2_21'> TOTAL WT </div>
                                                                                    <div className='last_2 _color font_size fw-bold last_2_21' style={{ borderRight: "none" }}>NO. OF SETS</div>
                                                                                </div>
                                                                            </div>
                                                                            <div className='secondpart_footer_2 '>
                                                                                {/* <div className='fg_info_1'><div className='last_1 _color font_size' style={{ borderRight: "1px solid grey" }}>QTY</div><div className='last_1 _color font_size'>WT</div></div> */}
                                                                                <div className='fg_info_2 border-bottom-0'>
                                                                                    <div className='last_2 _color font_size fw-bold'> </div>
                                                                                    <div className='last_2 _color font_size fw-bold'>  </div>
                                                                                    <div className='last_2 _color font_size fw-bold' style={{ borderRight: "none" }}>  </div>
                                                                                </div>
                                                                            </div>
                                                                            {/* <div className='secondpart_footer_2'>
                                                                                <div className='fg_info_1'><div className='last_1 workbreak' style={{ borderRight: "1px solid grey" }}></div><div className='last_1 workbreak'></div></div>
                                                                                <div className='fg_info_2'>
                                                                                    <div className='last_2 workbreak' > </div>
                                                                                    <div className='last_2 workbreak'>  </div>
                                                                                    <div className='last_2 workbreak' style={{ borderRight: "none" }}> </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className='secondpart_footer_2'>
                                                                                <div className='fg_info_1'><div className='last_1' style={{ borderRight: "1px solid grey" }}></div><div className='last_1'></div></div>
                                                                                <div className='fg_info_2'>
                                                                                    <div className='last_2' > </div>
                                                                                    <div className='last_2'>  </div>
                                                                                    <div className='last_2' style={{ borderRight: "none" }}> </div>
                                                                                </div>
                                                                            </div> */}
                                                                            {/* <div className='secondpart_footer_2'>
                                                                                <div className='fg_info_1'><div className='last_1' style={{ borderRight: "1px solid grey" }}></div><div className='last_1'></div></div>
                                                                                <div className='fg_info_2'>
                                                                                    <div className='last_2' > </div>
                                                                                    <div className='last_2'>  </div>
                                                                                    <div className='last_2' style={{ borderRight: "none" }}> </div>
                                                                                </div>
                                                                            </div> */}
                                                                            {/* <div className='secondpart_footer_2'>
                                                                                <div className='fg_info_1'><div className='last_1' style={{ borderRight: "1px solid grey" }}></div><div className='last_1'></div></div>
                                                                                <div className='fg_info_2'>
                                                                                    <div className='last_2' > </div>
                                                                                    <div className='last_2'>  </div>
                                                                                    <div className='last_2' style={{ borderRight: "none" }}>  </div>
                                                                                </div>
                                                                            </div> */}
                                                                        </div>
                                                                    </div>
                                                            );
                                                        })
                                                      :
                                                    <div className='container_1'>
                                                        <div className='firstpart'>
                                                            <div className='firstpart_header'>
                                                                <div className='firstpart_one'>
                                                                    <div className='firstpart_one_1'><div className='firstpart_one_chunk _color fw-bold'>BAG NO</div><div className='firstpart_one_chunk_val workbreak'>{`${e?.data?.rd?.serialjobno ?? ''}`}</div></div>
                                                                    <div className='firstpart_one_1'><div className='firstpart_one_chunk _color fw-bold'>CUSTOMER</div><div className='firstpart_one_chunk_val workbreak'>{`${e?.data?.rd?.CustomerCode ?? ''}`}</div></div>
                                                                    <div className='firstpart_one_1'><div className='firstpart_one_chunk _color fw-bold'>ORDER DATE</div><div className='firstpart_one_chunk_val workbreak'>{`${e?.data?.rd?.orderDatef ?? ''}`}</div></div>
                                                                    <div className='firstpart_one_1'><div className='firstpart_one_chunk _color fw-bold'>DUE DATE</div><div className='firstpart_one_chunk_val workbreak'>{`${e?.data?.rd?.promiseDatef ?? ''}`}</div></div>
                                                                    <div className='firstpart_one_1'><div className='firstpart_one_chunk _color fw-bold'>ORDER NO</div><div className='firstpart_one_chunk_val workbreak'>{`${e?.data?.rd?.OrderNo ?? ''}`}</div></div>
                                                                    {/* <div className='firstpart_one_1'><div className='firstpart_one_chunk _color fw-bold'>ORDER PCS</div><div className='firstpart_one_chunk_val workbreak'>{`${e?.data?.rd?.IsSplits_Quotation_Quantity ?? ''}`}</div></div> */}
                                                                    <div className='firstpart_one_1'><div className='firstpart_one_chunk _color fw-bold' style={{ borderRight: "none" }}></div><div className='firstpart_one_chunk_val workbreak'></div></div>
                                                                </div>
                                                                <div className='firstpart_two'>
                                                                    <div className='firstpart_one_1'><div className='firstpart_two_chunk _color fw-bold'>DESIGN NO</div><div className='firstpart_two_chunk w_bg21 workbreak'>{`${e?.data?.rd?.Designcode ?? ''}`}</div></div>
                                                                    <div className='firstpart_one_1'><div className='firstpart_two_chunk _color fw-bold'>PO. NO</div><div className='firstpart_two_chunk w_bg21 workbreak'>{`${e?.data?.rd?.PO ?? ''}`}</div></div>
                                                                    <div className='firstpart_one_1'><div className='firstpart_two_chunk _color fw-bold'>MFG DESIGN</div><div className='firstpart_two_chunk w_bg21 workbreak'>{`${e?.data?.rd?.mfgdesign ?? ''}`}</div></div>
                                                                    <div className='firstpart_one_1'><div className='firstpart_two_chunk _color fw-bold'>STYLE</div><div className='firstpart_two_chunk w_bg21 workbreak'>{e?.data?.rd?.style ?? ''}</div></div>
                                                                    <div className='firstpart_one_1'><div className='firstpart_two_chunk _color fw-bold'>DIMENSIONS</div><div className='firstpart_two_chunk w_bg21 workbreak'>{`${e?.data?.rd?.Dimension ?? ''}`}</div></div>
                                                                    <div className='firstpart_one_1'><div className='firstpart_two_chunk _color fw-bold'>MAKE TYPE</div><div className='firstpart_two_chunk w_bg21 workbreak'>{`${e?.data?.rd?.prioritycode ?? ''}`}</div></div>
                                                                    {/* <div className='firstpart_one_1'><div className='firstpart_two_chunk  fw-bold'>PROPOSED</div><div className='firstpart_two_chunk workbreak'>ISSUE</div></div> */}
                                                                </div>
                                                            </div>
                                                            <div className='firstpart_footer'>
                                                                <div className='footer_one'>
                                                                    <div className='firstpart_one_1'>
                                                                        <div className='firstpart_one_chunk_2 _color  pe-1 fw-bold'>FINDING NAME</div>
                                                               
                                                                    </div>
                                                                    <div className='firstpart_one_2'>
                                                                        <div className='semi _color fw-bold pe-1'>PCS</div>
                                                                        <div className='semi _color fw-bold pe-1'>WT</div>
                                                                    </div>
                                                               
                                                                </div>
                                                            </div>
                                                            <div className='firstpart_footer'>
                                                                <div className='footer_one'>
                                                                    <div className='firstpart_one_1'>
                                                                        <div className='firstpart_one_chunk_2 _color  pe-1 '></div>
                                                                   
                                                                    </div>
                                                                    <div className='firstpart_one_2'>
                                                                        <div className='semi _color'></div>
                                                                        <div className='semi _color'></div>
                                                                    </div>
                                                                   
                                                                </div>
                                                            </div>
                                                            <div className='firstpart_footer'>
                                                                <div className='footer_one'>
                                                                    <div className='firstpart_one_1'>
                                                                        <div className='firstpart_one_chunk_2 _color  pe-1 '></div>
                                                                   
                                                                    </div>
                                                                    <div className='firstpart_one_2'>
                                                                        <div className='semi _color'></div>
                                                                        <div className='semi _color'></div>
                                                                    </div>
                                                                   
                                                                </div>
                                                            </div>
                                                            <div className='firstpart_footer'>
                                                                <div className='footer_one'>
                                                                    <div className='firstpart_one_1'>
                                                                        <div className='firstpart_one_chunk_2 _color  pe-1 '></div>
                                                                   
                                                                    </div>
                                                                    <div className='firstpart_one_2'>
                                                                        <div className='semi _color'></div>
                                                                        <div className='semi _color'></div>
                                                                    </div>
                                                                   
                                                                </div>
                                                            </div>
                                                            <div className='firstpart_footer'>
                                                                <div className='footer_one'>
                                                                    <div className='firstpart_one_1'>
                                                                        <div className='firstpart_one_chunk_2 _color  pe-1 '></div>
                                                                   
                                                                    </div>
                                                                    <div className='firstpart_one_2'>
                                                                        <div className='semi _color'></div>
                                                                        <div className='semi _color'></div>
                                                                    </div>
                                                                   
                                                                </div>
                                                            </div>
                                                            <div className='firstpart_footer'>
                                                                <div className='footer_one'>
                                                                    <div className='firstpart_one_1'>
                                                                        <div className='firstpart_one_chunk_2 _color  pe-1 '></div>
                                                                   
                                                                    </div>
                                                                    <div className='firstpart_one_2'>
                                                                        <div className='semi _color'></div>
                                                                        <div className='semi _color'></div>
                                                                    </div>
                                                                   
                                                                </div>
                                                            </div>
                                                            <div className='firstpart_footer'>
                                                                <div className='footer_one'>
                                                                    <div className='firstpart_one_1'>
                                                                        <div className='firstpart_one_chunk_2 _color  pe-1 '></div>
                                                                   
                                                                    </div>
                                                                    <div className='firstpart_one_2'>
                                                                        <div className='semi _color'></div>
                                                                        <div className='semi _color'></div>
                                                                    </div>
                                                                   
                                                                </div>
                                                            </div>
                                                            <div className='firstpart_footer'>
                                                                <div className='footer_one'>
                                                                    <div className='firstpart_one_1'>
                                                                        <div className='firstpart_one_chunk_2 _color  pe-1 '></div>
                                                                   
                                                                    </div>
                                                                    <div className='firstpart_one_2'>
                                                                        <div className='semi _color'></div>
                                                                        <div className='semi _color'></div>
                                                                    </div>
                                                                   
                                                                </div>
                                                            </div>
                                                            <div className='firstpart_footer'>
                                                                <div className='footer_one'>
                                                                    <div className='firstpart_one_1'>
                                                                        <div className='firstpart_one_chunk_2 _color  pe-1 fw-bold'>TOTAL</div>
                                                                   
                                                                    </div>
                                                                    <div className='firstpart_one_2'>
                                                                        <div className='semi _color'></div>
                                                                        <div className='semi _color'></div>
                                                                    </div>
                                                                   
                                                                </div>
                                                            </div>
                                                            <div className=' brr_bg21 ins_bg21 p-1 fsbg21 text-break'>
                                                                                <div className='fw-bold fsbg21 text-break'>INSTRUCTION : &nbsp;  {" " +(e?.data?.rd?.ProductInstruction?.length > 0 ? checkInstruction( e?.data?.rd?.ProductInstruction ) : checkInstruction( e?.data?.rd?.QuoteRemark))}</div> 
                                                                            </div>
                                               
                                                        </div>
                                                        <div className='secondpart'>
                                                            {/* <div className='firstpart_one_1'><div className='firstpart_one_chunk_val _color'>DESIGN NO</div><div className='firstpart_one_chunk' style={{ borderRight: "none" }}>{`${e?.data?.rd?.Designcode ?? ''}`}</div></div> */}
                                                            <div className='imagediv'><img src={e?.data?.rd?.DesignImage !== '' ? e?.data?.rd?.DesignImage : require("../../assets/img/default.jpg")} id="img15" alt="" onError={e => handleImageError(e)} loading="eager"  /></div>
                                                            <div className='barcodediv'><div className='barcode14'>
                                                                {(e?.data?.rd?.length !== 0 && e?.data?.rd !== undefined) && <>{e?.data?.rd?.serialjobno !== undefined && <BarcodeGenerator data={e?.data?.rd?.serialjobno ?? ''} />}</>}
                                                            </div></div>
                                                            <div className='secondpart_footer_2'>
                                                                                {/* <div className='fg_info_1'><div className='last_1 _color font_size' style={{ borderRight: "1px solid grey" }}>QTY</div><div className='last_1 _color font_size'>WT</div></div> */}
                                                                                <div className='fg_info_2'>
                                                                                    <div className='last_2 _color font_size fw-bold'>PCS </div>
                                                                                    <div className='last_2 _color font_size fw-bold'> WT </div>
                                                                                    <div className='last_2 _color font_size fw-bold' style={{ borderRight: "none" }}> SIZE </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className='secondpart_footer_2'>
                                                                                {/* <div className='fg_info_1'><div className='last_1 _color font_size' style={{ borderRight: "1px solid grey" }}>QTY</div><div className='last_1 _color font_size fw-bold'>WT</div></div> */}
                                                                                <div className='fg_info_2'>
                                                                                    <div className='last_2 _color font_size'>{e?.data?.rd?.Quantity}</div>
                                                                                    <div className='last_2 _color font_size'>{e?.data?.rd?.ActualGrossweight}</div>
                                                                                    <div className='last_2 _color font_size' style={{ borderRight: "none" }}>{e?.data?.rd?.Size}</div>
                                                                                </div>
                                                                            </div>
                                                                            <div className='secondpart_footer_2 secondpart_footer_2_21'>
                                                                                {/* <div className='fg_info_1'><div className='last_1 _color font_size' style={{ borderRight: "1px solid grey" }}>QTY</div><div className='last_1 _color font_size'>WT</div></div> */}
                                                                                <div className='fg_info_2'>
                                                                                    <div className='last_2 _color font_size fw-bold last_2_21'>TOTAL PCS </div>
                                                                                    <div className='last_2 _color font_size fw-bold last_2_21'> TOTAL WT </div>
                                                                                    <div className='last_2 _color font_size fw-bold last_2_21' style={{ borderRight: "none" }}>NO. OF SETS</div>
                                                                                </div>
                                                                            </div>
                                                                            <div className='secondpart_footer_2 '>
                                                                                {/* <div className='fg_info_1'><div className='last_1 _color font_size' style={{ borderRight: "1px solid grey" }}>QTY</div><div className='last_1 _color font_size'>WT</div></div> */}
                                                                                <div className='fg_info_2 border-bottom-0'>
                                                                                    <div className='last_2 _color font_size fw-bold'> </div>
                                                                                    <div className='last_2 _color font_size fw-bold'>  </div>
                                                                                    <div className='last_2 _color font_size fw-bold' style={{ borderRight: "none" }}>  </div>
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
                </>
            }
        </>
    );
}

export default BagPrint21A;






