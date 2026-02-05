import queryString from 'query-string';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import "../../assets/css/bagprint/bagprint21.css";
import { GetData } from '../../GlobalFunctions/GetData';
import { handleImageError } from '../../GlobalFunctions/HandleImageError';
import { handlePrint } from '../../GlobalFunctions/HandlePrint';
import Loader from '../../components/Loader';
import { organizeData } from '../../GlobalFunctions/OrganizeBagPrintData';
import { GetChunkData } from './../../GlobalFunctions/GetChunkData';
import { GetUniquejob } from '../../GlobalFunctions/GetUniqueJob';
import { checkArr, checkInstruction } from "../../GlobalFunctions";
import BarcodeGenerator from './../../components/BarcodeGenerator';

function BagPrint21A({ queries, headers }) {
    const [data, setData] = useState([]);
    const location = useLocation();
    const queryParams = queryString.parse(location?.search);
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

                let total_ActualPcs = 0;
                let total_ActualWeight = 0;
              
              let length = 0;

            //   let clr = {
            //     Shapename: "TOTAL",
            //     Sizename: "C TOTAL",
            //     ActualPcs: 0,
            //     ActualWeight: 0,
            //     MasterManagement_DiamondStoneTypeid: 4,
            //   };
            //   let dia = {
            //     Shapename: "TOTAL",
            //     Sizename: "D TOTAL",
            //     ActualPcs: 0,
            //     ActualWeight: 0,
            //     MasterManagement_DiamondStoneTypeid: 3,
            //   };
            //   let misc = {
            //     Shapename: "MISC TOTAL",
            //     Sizename: "MISC TOTAL",
            //     ActualPcs: 0,
            //     ActualWeight: 0,
            //     MasterManagement_DiamondStoneTypeid: 7,
            //   };
            //   let f = {
            //     Shapename: "TOTAL",
            //     Sizename: "F TOTAL",
            //     ActualPcs: 0,
            //     ActualWeight: 0,
            //     MasterManagement_DiamondStoneTypeid: 5,
            //   };
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
                //   dia.ActualPcs = dia.ActualPcs + e?.ActualPcs;
                //   dia.ActualWeight = dia.ActualWeight + e?.ActualWeight;
                  total_ActualPcs = total_ActualPcs + e?.ActualPcs;
                  total_ActualWeight = total_ActualWeight + e?.ActualWeight;  
                } else if (e?.MasterManagement_DiamondStoneTypeid === 4) {
                  ColorStoneList.push(e);
                //   clr.ActualPcs = clr.ActualPcs + e?.ActualPcs;
                //   clr.ActualWeight = clr.ActualWeight + e?.ActualWeight;
                  total_ActualPcs = total_ActualPcs + e?.ActualPcs;
                  total_ActualWeight = total_ActualWeight + e?.ActualWeight;
                } else if (e?.MasterManagement_DiamondStoneTypeid === 5) {
                  FindingList.push(e);
                //   f.ActualPcs = f.ActualPcs + e?.ActualPcs;
                //   f.ActualWeight = f.ActualWeight + e?.ActualWeight;
                  
                } else if (e?.MasterManagement_DiamondStoneTypeid === 7) {
                  MiscList.push(e);
                //   misc.ActualPcs = misc.ActualPcs + e?.ActualPcs;
                //   misc.ActualWeight = misc.ActualWeight + e?.ActualWeight;
                  total_ActualPcs = total_ActualPcs + e?.ActualPcs;
                  total_ActualWeight = total_ActualWeight + e?.ActualWeight;
                }
              });
            //   dia.ActualPcs = +dia.ActualPcs?.toFixed(3);
            //   dia.ActualWeight = +dia.ActualWeight?.toFixed(3);
            //   clr.ActualPcs = +clr.ActualPcs?.toFixed(3);
            //   clr.ActualWeight = +clr.ActualWeight?.toFixed(3);
            //   misc.ActualPcs = +misc.ActualPcs?.toFixed(3);
            //   misc.ActualWeight = +misc.ActualWeight?.toFixed(3);
            //   f.ActualPcs = +f.ActualPcs?.toFixed(3);
            //   f.ActualWeight = +f.ActualWeight?.toFixed(3);
              
            //   DiamondList?.push(dia);
            //   ColorStoneList?.push(clr);
            //   MiscList?.push(misc);
            //   FindingList?.push(f);
              
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
    
            //   DiamondList?.unshift(newDia);
            //   ColorStoneList?.unshift(newCS);
            //   MiscList?.unshift(newMisc);
            //   FindingList?.unshift(newfind);
              
            //   let mainArr = checkArr(
            //     DiamondList,
            //     ColorStoneList,
            //     MiscList,
            //     []
            //     // ArrofFSize
            //   );
                
            let mainArr = [...DiamondList, ...ColorStoneList, ...MiscList]

              let imagePath = queryParams?.imagepath;
              imagePath = atob(queryParams?.imagepath);
    
              let img = imagePath + a?.rd?.ThumbImagePath;
    
              const arr =  GetChunkData(chunkSize10, mainArr);
                
              responseData.push({
                data: a,
                total_ActualPcs : total_ActualPcs,
                total_ActualWeight : total_ActualWeight,
                additional: {
                  length: length,
                //   clr: clr,
                //   dia: dia,
                //   f: f,
                // misc: misc,
                  img: img,
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

      const handleImageError = (e) => {
        e.target.src = require("../../assets/img/default.jpg");
      };
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
                data.length === 0 ? <Loader /> : <><div className="print_btn d_none_bg21"><button className="btn_white blue print_btn" onClick={(e) => handlePrint(e)}>
                    Print
                </button></div>
                    <div className='container_bg21_main_box pad_60_allPrint '>
                        <div className='container_print_bg21'>
                            {Array.from({ length: queries?.pageStart }, (_, index) => (
                                index > 0 && <div key={index} className="container_1" style={{ border: "0px" }}></div>
                            ))}
                            {
                                data?.length > 0 && data?.map((e, i) => {
                                    let val = e?.data?.rd;
                                    return (
                                        <React.Fragment key={i}>
                                            {
                                                e?.additional?.pages?.length > 0 ? 
                                                        e?.additional?.pages?.map((a, index) => {
                                                            let val = e?.data?.rd;
                                                            console.log(val);
                                                            return (
                                                                    <div className='container_bg21' key={index}>
                                                                        <div className='d-flex align-items-center border-bottom border-black fw-bold'>
                                                                            <div className='border-end border-black start_bg21 col1_bg21 pd_s_21'>Bag No</div>
                                                                            <div className='border-end border-black start_bg21 col2_bg21 pd_s_21' style={{width:'54px'}}>{val?.serialjobno}</div>
                                                                            <div className='border-end border-black  col3_bg21 pd_s_21 start_bg21 pd_s_21' style={{width:'90px', fontSize:'12px', color:'#000080'}}>{val?.MetalType +" "+ val?.MetalColorCo}</div>
                                                                            <div className='border-end border-black start_bg21 col4_bg21 pd_s_21' style={{width:'40px'}}>P Code</div>
                                                                            <div className=' col5_bg21 pd_s_21 start_bg21' style={{width:'111px'}}>{val?.CustomerCode}</div>
                                                                        </div>
                                                                        <div className='d-flex'>
                                                                            <div className='d-flex flex-col fw-bold'>
                                                                                <div className='d-flex border-bottom border-black'>
                                                                                    <div className='col1_bg21 border-end border-black start_bg21 pd_s_21'>D. No</div>
                                                                                    <div className='col6_bg21 border-end border-black  pd_s_21 d-flex justify-content-between align-items-center'><span>{val?.Designcode}</span> <span style={{color:'red'}}>{val?.prioritycode}</span></div>
                                                                                </div>
                                                                                <div className='d-flex border-bottom border-black'>
                                                                                    <div className='col1_bg21 border-end border-black start_bg21 pd_s_21'>O.Date</div>
                                                                                    <div className='col2_bg21 border-end border-black center_bg21'>{val?.orderDatef}</div>
                                                                                    <div className='col7_bg21 border-end border-black start_bg21 pd_s_21' style={{color:'red', fontSize:'12px'}}>Del Dt.</div>
                                                                                    <div className='col8_bg21 border-end border-black center_bg21' style={{color:'red', fontSize:'12px'}}>{val?.promiseDatef}</div>
                                                                                </div>
                                                                                <div className='d-flex border-bottom border-black'>
                                                                                    <div className='col1_bg21 border-end border-black start_bg21 pd_s_21'>Mfgcode</div>
                                                                                    <div className='col9_bg21 border-end border-black start_bg21 pd_s_21' style={{width:'200px'}}>{val?.mfgdesign}</div>
                                                                                    {/* <div className='col10_bg21 border-end border-black pd_s_21'></div>
                                                                                    <div className='col7_bg21 border-end border-black pd_s_21'></div> */}
                                                                                </div>
                                                                                <div className='d-flex border-bottom border-black'>
                                                                                    <div className='col1_bg21 border-end border-black pd_s_21 start_bg21'>PO :</div>
                                                                                    <div className='col2_bg21 border-end border-black pd_s_21 start_bg21' style={{width:"125px"}}>{val?.PO}</div>
                                                                                    <div className='col8_bg21 border-end border-black pd_s_21 start_bg21'>BQTY:{val?.Quantity}</div>
                                                                                    {/* <div className='col7_bg21 border-end border-black pd_s_21 start_bg21'></div> */}
                                                                                </div>
                                                                                <div className='d-flex border-bottom border-black'>
                                                                                    <div className='col1_bg21 border-end border-black pd_s_21 start_bg21'>Size :</div>
                                                                                    <div className='col11_bg21 border-end border-black pd_s_21 start_bg21' style={{width:'200px'}}>{val?.Size}</div>
                                                                                    {/* <div className='col7_bg21 border-end border-black pd_s_21 start_bg21'></div> */}
                                                                                </div>
                                                                                <div className='d-flex border-bottom border-black'>
                                                                                    <div className='col1_bg21 border-end border-black pd_s_21 start_bg21'>Or No.</div>
                                                                                    <div className='col12_bg21 border-end border-black pd_s_21 start_bg21' style={{width:'71px'}}>{val?.OrderNo}</div>
                                                                                    <div className='col13_bg21 border-end border-black pd_s_21 start_bg21' style={{width:'71px'}}>Or Wt</div>
                                                                                    <div className='col7_bg21 border-end border-black pd_s_21 start_bg21' style={{width:'58px'}}>{val?.ActualGrossweight?.toFixed(3)}</div>
                                                                                </div>
                                                                            </div>
                                                                            <div className='imgDiv_bg21 border-bottom border-black'>
                                                                                <img src={val?.DesignImage} alt="#designImg" onError={(e) => handleImageError(e)} loading="eager" className='img_bg21' />
                                                                            </div>
                                                                        </div>
                                                                        {/* table */}
                                                                        <div>
                                                                            <div className='d-flex fw-bold border-bottom border-black'>
                                                                                <div className='col1_bg21 border-end border-black pd_s_21 start_bg21'>Shape</div>
                                                                                <div className='col2_bg21 border-end border-black pd_s_21 start_bg21'>Size</div>
                                                                                <div className='col14_bg21 border-end border-black pd_s_21 start_bg21'>Pcs</div>
                                                                                <div className='col13_bg21 border-end border-black pd_s_21 start_bg21' >Cts</div>
                                                                                <div className='col7_bg21 border-end border-black pd_s_21 start_bg21' style={{width:'29px'}}>I Pcs</div>
                                                                                <div className='col15_bg21 border-end border-black pd_s_21 start_bg21' style={{width:'54px'}}>I Cts</div>
                                                                                <div className='col15_bg21 border-end border-black pd_s_21 start_bg21' style={{width:'31px'}}>R Pcs</div>
                                                                                <div className='col15_bg21  pd_s_21 start_bg21' style={{width:'52px'}}>R Cts</div>
                                                                            </div>
                                                                            {
                                                                                a?.data?.map((el, i) => {
                                                                                    return (
                                                                                        <div className='d-flex  border-bottom border-black' key={i}>
                                                                                            <div className='col1_bg21 border-end border-black pd_s_21 start_bg21 text-break'>{el?.Shapename}</div>
                                                                                            <div className='col2_bg21 border-end border-black pd_s_21 start_bg21 text-break'>{el?.Sizename}</div>
                                                                                            <div className='col14_bg21 border-end border-black end_bg21 pd_e_21  text-break'>{el?.ActualPcs}</div>
                                                                                            <div className='col13_bg21 border-end border-black end_bg21 pd_e_21  text-break'>{el?.ActualWeight?.toFixed(3)}</div>
                                                                                            <div className='col7_bg21 border-end border-black pd_s_21' style={{width:'29px'}}></div>
                                                                                            <div className='col15_bg21 border-end border-black pd_s_21' style={{width:'54px'}}></div>
                                                                                            <div className='col15_bg21 border-end border-black pd_s_21' style={{width:'31px'}}></div>
                                                                                            <div className='col15_bg21  pd_s_21' style={{width:'52px'}}></div>
                                                                                        </div>
                                                                                    )
                                                                                })
                                                                            }
                                                                            
                                                                            {       Array.from(
                                                                                        { length: a?.length },
                                                                                        (_, index) => (
                                                                                            <div className='d-flex  border-bottom border-black' key={index}>
                                                                                            <div className='col1_bg21 border-end border-black pd_s_21'></div>
                                                                                            <div className='col2_bg21 border-end border-black pd_s_21'></div>
                                                                                            <div className='col14_bg21 border-end border-black end_bg21 pd_e_21'></div>
                                                                                            <div className='col13_bg21 border-end border-black end_bg21 pd_e_21'></div>
                                                                                            <div className='col7_bg21 border-end border-black pd_s_21' style={{width:'29px'}}></div>
                                                                                            <div className='col15_bg21 border-end border-black pd_s_21' style={{width:'54px'}}></div>
                                                                                            <div className='col15_bg21 border-end border-black pd_s_21' style={{width:'31px'}}></div>
                                                                                            <div className='col15_bg21  pd_s_21' style={{width:'52px'}}></div>
                                                                                        </div>
                                                                                        )
                                                                                    )}
                                                                            <div className='d-flex fw-bold border-bottom border-black'>
                                                                                <div className='col16_bg21 h_bg21 border-end border-black pd_s_21 center_bg21'>Total</div>
                                                                                <div className='col14_bg21 h_bg21 border-end border-black end_bg21  pd_e_21'>{e?.total_ActualPcs}</div>
                                                                                <div className='col13_bg21 h_bg21 border-end border-black end_bg21 pd_e_21'>{e?.total_ActualWeight?.toFixed(3)}</div>
                                                                                <div className='col7_bg21 h_bg21 border-end border-black pd_s_21' style={{width:'29px'}}></div>
                                                                                <div className='col15_bg21 h_bg21 border-end border-black pd_s_21' style={{width:'54px'}}></div>
                                                                                <div className='col15_bg21 h_bg21 border-end border-black pd_s_21' style={{width:'31px'}}></div>
                                                                                <div className='col15_bg21 h_bg21 pd_s_21' style={{width:'52px'}}></div>
                                                                            </div>
                                                                        </div>
                                                                        {/* instruction and barcode */}
                                                                        <div className='d-flex'>
                                                                            <div className='ins_div_bg21 border-end border-black'>
                                                                                <div className='border-bottom h_ins_bg21 border-black d-flex'>
                                                                                    <div className='col1_bg21 start_bg21 h_ins_bg21 fw-bold ps-1 border-end border-black'>Stamping</div>
                                                                                    <div className='h_ins_bg21 text-break d-flex align-items-center flex-wrap ps-1'>{val?.stamping}</div>
                                                                                </div>
                                                                                <div className='border-bottom h_ins_bg21 border-black d-flex'>
                                                                                    <div className='col1_bg21 start_bg21 h_ins_bg21 fw-bold ps-1 border-end border-black'>Cust. Ins.</div>
                                                                                    <div className='h_ins_bg21 text-break d-flex align-items-center flex-wrap ps-1'>{val?.productInfoSeparate?.customer}</div>
                                                                                </div>
                                                                                <div className='border-bottom h_ins_bg21 border-black d-flex'>
                                                                                    <div className='col1_bg21 start_bg21 h_ins_bg21 fw-bold ps-1 border-end border-black'>D.Pro. Ins.</div>
                                                                                    <div className='h_ins_bg21 text-break d-flex align-items-center flex-wrap ps-1'>{val?.productInfoSeparate?.wax}</div>
                                                                                </div>
                                                                                <div className=' h_ins_bg21  d-flex'>
                                                                                    <div className='col1_bg21 start_bg21 h_ins_bg21 fw-bold ps-1 border-end border-black'>Remark</div>
                                                                                    <div className='h_ins_bg21 text-break d-flex align-items-center flex-wrap ps-1'>{val?.productInfoSeparate?.finding}</div>
                                                                                </div>
                                                                                
                                                                            </div>
                                                                            <div className='barcode_div_bg21'>
                                                                                    <BarcodeGenerator
                                                                                        data={val?.serialjobno}
                                                                                    />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                            );
                                                        })
                                                      :
                                                      <div className='container_bg21' >
                                                      <div className='d-flex align-items-center border-bottom border-black fw-bold'>
                                                          <div className='border-end border-black col1_bg21 pd_s_21 start_bg21'>Bag No</div>
                                                          <div className='border-end border-black col2_bg21 pd_s_21 start_bg21 ' style={{width:'54px'}}>{val?.serialjobno}</div>
                                                          <div className='border-end border-black col3_bg21 pd_s_21 start_bg21 pd_s_21' style={{width:'90px', fontSize:'12px', color:'#000080'}}>{val?.MetalType +" "+ val?.MetalColorCo}</div>
                                                          <div className='border-end border-black col4_bg21 pd_s_21 start_bg21' style={{width:'40px'}}>P Code</div>
                                                          <div className=' col5_bg21 pd_s_21 start_bg21' style={{width:'111px'}}>{val?.CustomerCode}</div>
                                                      </div>
                                                      <div className='d-flex'>
                                                          <div className='d-flex flex-col fw-bold'>
                                                              <div className='d-flex border-bottom border-black'>
                                                                  <div className='col1_bg21 border-end border-black pd_s_21 start_bg21 '>D. No</div>
                                                                  <div className='col6_bg21 border-end border-black  pd_s_21 d-flex justify-content-between align-items-center'><span>{val?.Designcode}</span> <span style={{color:'red'}}>{val?.prioritycode}</span></div>
                                                                  {/* <div className='col6_bg21 border-end border-black pd_s_21 start_bg21' >{val?.Designcode}</div> */}
                                                              </div>
                                                              <div className='d-flex border-bottom border-black'>
                                                                  <div className='col1_bg21 border-end border-black pd_s_21 start_bg21'>O.Date</div>
                                                                  <div className='col2_bg21 border-end border-black center_bg21 '>{val?.orderDatef}</div>
                                                                  <div className='col7_bg21 border-end border-black pd_s_21 start_bg21' style={{color:'red', fontSize:'12px'}}>Del Dt.</div>
                                                                  <div className='col8_bg21 border-end border-black center_bg21' style={{color:'red', fontSize:'12px'}}>{val?.promiseDatef}</div>
                                                              </div>
                                                              <div className='d-flex border-bottom border-black'>
                                                                  <div className='col1_bg21 border-end border-black pd_s_21 start_bg21'>Mfgcode</div>
                                                                  <div className='col9_bg21 border-end border-black pd_s_21 start_bg21' style={{width:'200px'}}>{val?.mfgdesign}</div>
                                                                  {/* <div className='col10_bg21 border-end border-black pd_s_21'></div>
                                                                  <div className='col7_bg21 border-end border-black pd_s_21'></div> */}
                                                              </div>
                                                              <div className='d-flex border-bottom border-black'>
                                                                  <div className='col1_bg21 border-end border-black pd_s_21 start_bg21'>PO :</div>
                                                                  <div className='col2_bg21 border-end border-black pd_s_21 start_bg21' style={{width:"125px"}}>{val?.PO}</div>
                                                                  <div className='col8_bg21 border-end border-black pd_s_21 start_bg21'>BQTY:{val?.Quantity}</div>
                                                                  {/* <div className='col7_bg21 border-end border-black pd_s_21 start_bg21'></div> */}
                                                              </div>
                                                              <div className='d-flex border-bottom border-black'>
                                                                  <div className='col1_bg21 border-end border-black pd_s_21 start_bg21'>Size :</div>
                                                                  <div className='col11_bg21 border-end border-black pd_s_21 start_bg21' style={{width:'200px'}}>{val?.Size}</div>
                                                                  {/* <div className='col7_bg21 border-end border-black pd_s_21 start_bg21'></div> */}
                                                              </div>
                                                              <div className='d-flex border-bottom border-black'>
                                                                  <div className='col1_bg21 border-end border-black pd_s_21 start_bg21'>Or No.</div>
                                                                  <div className='col12_bg21 border-end border-black pd_s_21 start_bg21' style={{width:'71px'}}>{val?.OrderNo}</div>
                                                                  <div className='col13_bg21 border-end border-black pd_s_21 start_bg21' style={{width:'71px'}}>Or Wt</div>
                                                                  <div className='col7_bg21 border-end border-black pd_s_21 start_bg21' style={{width:'58px'}}>{val?.ActualGrossweight?.toFixed(3)}</div>
                                                              </div>
                                                          </div>
                                                          <div className='imgDiv_bg21 border-bottom border-black'>
                                                          <img src={val?.DesignImage} alt="#designImg" onError={(e) => handleImageError(e)} loading="eager" className='img_bg21' />
                                                          </div>
                                                      </div>
                                                      {/* table */}
                                                      <div>
                                                          <div className='d-flex fw-bold border-bottom border-black'>
                                                              <div className='col1_bg21 border-end border-black start_bg21 pd_s_21'>Shape</div>
                                                              <div className='col2_bg21 border-end border-black  start_bg21 pd_s_21'>Size</div>
                                                              <div className='col14_bg21 border-end border-black  start_bg21 pd_s_21'>Pcs</div>
                                                              <div className='col13_bg21 border-end border-black  start_bg21 pd_s_21'>Cts</div>
                                                              <div className='col7_bg21 border-end border-black  start_bg21 pd_s_21'>I Pcs</div>
                                                              <div className='col15_bg21 border-end border-black  start_bg21 pd_s_21'>I Cts</div>
                                                              <div className='col15_bg21 border-end border-black  start_bg21 pd_s_21'>R Pcs</div>
                                                              <div className='col15_bg21 start_bg21 pd_s_21'>R Cts</div>
                                                          </div>
                                                          {       Array.from(
                                                                                        { length: 10 },
                                                                                        (_, index) => (
                                                                                            <div className='d-flex  border-bottom border-black' key={index}>
                                                                                            <div className='col1_bg21 border-end border-black pd_s_21'></div>
                                                                                            <div className='col2_bg21 border-end border-black pd_s_21'></div>
                                                                                            <div className='col14_bg21 border-end border-black end_bg21 pd_e_21'></div>
                                                                                            <div className='col13_bg21 border-end border-black end_bg21 pd_e_21'></div>
                                                                                            <div className='col7_bg21 border-end border-black pd_s_21'></div>
                                                                                            <div className='col15_bg21 border-end border-black pd_s_21'></div>
                                                                                            <div className='col15_bg21 border-end border-black pd_s_21'></div>
                                                                                            <div className='col15_bg21  pd_s_21'></div>
                                                                                        </div>
                                                                                        )
                                                                                    )}
                                                          <div className='d-flex fw-bold border-bottom border-black'>
                                                              <div className='col16_bg21 h_bg21 border-end border-black pd_s_21 center_bg21'>Total</div>
                                                              <div className='col14_bg21 h_bg21 border-end border-black end_bg21 pd_e_21'>{e?.total_ActualPcs}</div>
                                                              <div className='col13_bg21 h_bg21 border-end border-black end_bg21 pd_e_21'>{e?.total_ActualWeight}</div>
                                                              <div className='col7_bg21 h_bg21 border-end border-black pd_s_21'></div>
                                                              <div className='col15_bg21 h_bg21 border-end border-black pd_s_21'></div>
                                                              <div className='col15_bg21 h_bg21 border-end border-black pd_s_21'></div>
                                                              <div className='col15_bg21 h_bg21 pd_s_21'></div>
                                                          </div>
                                                      </div>
                                                      {/* instruction and barcode */}
                                                                        <div className='d-flex'>
                                                                            <div className='ins_div_bg21 border-end border-black'>
                                                                                <div className='border-bottom h_ins_bg21 border-black d-flex'>
                                                                                    <div className='col1_bg21 start_bg21 h_ins_bg21 fw-bold ps-1 border-end border-black'>Stamping</div>
                                                                                    <div className='h_ins_bg21 text-break d-flex align-items-center flex-wrap ps-1'>{val?.stamping}</div>
                                                                                </div>
                                                                                <div className='border-bottom h_ins_bg21 border-black d-flex'>
                                                                                    <div className='col1_bg21 start_bg21 h_ins_bg21 fw-bold ps-1 border-end border-black'>Cust. Ins.</div>
                                                                                    <div className='h_ins_bg21 text-break d-flex align-items-center flex-wrap ps-1'>{val?.productInfoSeparate?.customer}</div>
                                                                                </div>
                                                                                <div className='border-bottom h_ins_bg21 border-black d-flex'>
                                                                                    <div className='col1_bg21 start_bg21 h_ins_bg21 fw-bold ps-1 border-end border-black'>D.Pro. Ins.</div>
                                                                                    <div className='h_ins_bg21 text-break d-flex align-items-center flex-wrap ps-1'>{val?.productInfoSeparate?.wax}</div>
                                                                                </div>
                                                                                <div className=' h_ins_bg21  d-flex'>
                                                                                    <div className='col1_bg21 start_bg21 h_ins_bg21 fw-bold ps-1 border-end border-black'>Remark</div>
                                                                                    <div className='h_ins_bg21 text-break d-flex align-items-center flex-wrap ps-1'>{val?.productInfoSeparate?.finding}</div>
                                                                                </div>
                                                                                
                                                                            </div>
                                                          <div className='barcode_div_bg21'>
                                                                  <BarcodeGenerator
                                                                      data={val?.serialjobno}
                                                                  />
                                                          </div>
                                                      </div>
                                                        </div>
                                            }
                                                                    <div className='container_bg21'>
                                                                        <div className='d-flex align-items-center border-bottom border-black fw-bold'>
                                                                            <div className='border-end border-black col1_bg21 pd_s_21 start_bg21'>Bag No</div>
                                                                            <div className='border-end border-black col2_bg21 pd_s_21 start_bg21' style={{width:'54px'}}>{val?.serialjobno}</div>
                                                                            <div className='border-end border-black col3_bg21 pd_s_21 start_bg21 pd_s_21' style={{width:'90px', fontSize:'12px', color:'#000080'}}>{val?.MetalType +" "+ val?.MetalColorCo}</div>
                                                                            <div className='border-end border-black col4_bg21 pd_s_21 start_bg21' style={{width:'40px'}}>P Code</div>
                                                                            <div className=' col5_bg21 pd_s_21 start_bg21' style={{width:'111px'}}>{val?.CustomerCode}</div>
                                                                        </div>
                                                                        <div className='d-flex'>
                                                                            <div className='d-flex flex-col fw-bold'>
                                                                                <div className='d-flex border-bottom border-black'>
                                                                                    <div className='col1_bg21 border-end border-black pd_s_21 start_bg21'>D. No</div>
                                                                                    <div className='col6_bg21 border-end border-black  pd_s_21 d-flex justify-content-between align-items-center'><span>{val?.Designcode}</span> <span style={{color:'red'}}>{val?.prioritycode}</span></div>
                                                                                    {/* <div className='col6_bg21 border-end border-black pd_s_21 start_bg21'>{val?.Designcode}</div> */}
                                                                                </div>
                                                                                <div className='d-flex border-bottom border-black'>
                                                                                    <div className='col1_bg21 border-end border-black pd_s_21 start_bg21'>O.Date</div>
                                                                                    <div className='col2_bg21 border-end border-black center_bg21 '>{val?.orderDatef}</div>
                                                                                    <div className='col7_bg21 border-end border-black pd_s_21 start_bg21' style={{color:'red', fontSize:'12px'}}>Del Dt.</div>
                                                                                    <div className='col8_bg21 border-end border-black center_bg21' style={{color:'red', fontSize:'12px'}}>{val?.promiseDatef}</div>
                                                                                </div>
                                                                                <div className='d-flex border-bottom border-black'>
                                                                                    <div className='col1_bg21 border-end border-black pd_s_21 start_bg21'>Mfgcode</div>
                                                                                    <div className='col9_bg21 border-end border-black pd_s_21 start_bg21' style={{width:'200px'}}>{val?.mfgdesign}</div>
                                                                                    {/* <div className='col10_bg21 border-end border-black pd_s_21'></div>
                                                                                    <div className='col7_bg21 border-end border-black pd_s_21'></div> */}
                                                                                </div>
                                                                                <div className='d-flex border-bottom border-black'>
                                                                                    <div className='col1_bg21 border-end border-black pd_s_21 start_bg21'>PO :</div>
                                                                                    <div className='col2_bg21 border-end border-black pd_s_21 start_bg21' style={{width:"125px"}}>{val?.PO}</div>
                                                                                    <div className='col8_bg21 border-end border-black pd_s_21 start_bg21'>BQTY:{val?.Quantity}</div>
                                                                                    {/* <div className='col7_bg21 border-end border-black pd_s_21 start_bg21'></div> */}
                                                                                </div>
                                                                                <div className='d-flex border-bottom border-black'>
                                                                                    <div className='col1_bg21 border-end border-black pd_s_21 start_bg21'>Size :</div>
                                                                                    <div className='col11_bg21 border-end border-black pd_s_21 start_bg21' style={{width:'200px'}}>{val?.Size}</div>
                                                                                    {/* <div className='col7_bg21 border-end border-black pd_s_21 start_bg21'></div> */}
                                                                                </div>
                                                                                <div className='d-flex border-bottom border-black'>
                                                                                    <div className='col1_bg21 border-end border-black pd_s_21 start_bg21'>Or No.</div>
                                                                                    <div className='col12_bg21 border-end border-black pd_s_21 start_bg21' style={{width:'71px'}}>{val?.OrderNo}</div>
                                                                                    <div className='col13_bg21 border-end border-black pd_s_21 start_bg21' style={{width:'71px'}}>Or Wt</div>
                                                                                    <div className='col7_bg21 border-end border-black pd_s_21 start_bg21' style={{width:'58px'}}>{val?.ActualGrossweight?.toFixed(3)}</div>
                                                                                </div>
                                                                            </div>
                                                                            <div className='imgDiv_bg21 border-bottom border-black'>
                                                                                <img src={val?.DesignImage} alt="#designImg" onError={(e) => handleImageError(e)} loading="eager" className='img_bg21' />
                                                                            </div>
                                                                        </div>
                                                                        {/* table */}
                                                                        <div>
                                                                            <div className='d-flex fw-bold border-bottom border-black'>
                                                                                <div className='col1_bg21 border-end h2_bg21 center_bg21 border-black pd_s_21'>Dept</div>
                                                                                <div className='col2_bg21 border-end h2_bg21 center_bg21 border-black pd_s_21'>IssueGold</div>
                                                                                <div className='col2_bg21 border-end h2_bg21 center_bg21 border-black pd_s_21'>Ret.Gold</div>
                                                                                <div className='col2_bg21 border-end h2_bg21 center_bg21 border-black pd_s_21 center_bg21'>Name</div>
                                                                                <div className='col1_bg21  pd_s_21 h2_bg21 center_bg21'>Sign</div>
                                                                            </div>
                                                                            <div className='d-flex '>
                                                                                <div className='col1_bg21 border-bottom  h2_bg21 border-end border-black pd_s_21 start_bg21 fw-bold'>CAST</div>
                                                                                <div className='col2_bg21 border-bottom h2_bg21 border-end border-black pd_s_21'></div>
                                                                                <div className='col2_bg21 border-bottom h2_bg21 border-end border-black pd_s_21'></div>
                                                                                <div className='col2_bg21 border-end h2_bg21 border-black pd_s_21 center_bg21'></div>
                                                                                <div className='col1_bg21  pd_s_21 h2_bg21 center_bg21'></div>
                                                                            </div>
                                                                            <div className='d-flex '>
                                                                                <div className='col1_bg21 h2_bg21 border-bottom  border-end border-black pd_s_21 start_bg21 fw-bold'>FILL</div>
                                                                                <div className='col2_bg21 h2_bg21 border-bottom border-end border-black pd_s_21'></div>
                                                                                <div className='col2_bg21 h2_bg21 border-bottom border-end border-black pd_s_21'></div>
                                                                                <div className='col2_bg21 h2_bg21 border-end border-black pd_s_21 center_bg21'></div>
                                                                                <div className='col1_bg21 h2_bg21  pd_s_21 center_bg21'></div>
                                                                            </div>
                                                                            <div className='d-flex'>
                                                                                <div className='col1_bg21 h2_bg21 border-bottom  border-end border-black pd_s_21 start_bg21 fw-bold'>PPOL</div>
                                                                                <div className='col2_bg21 h2_bg21 border-bottom border-end border-black pd_s_21'></div>
                                                                                <div className='col2_bg21 h2_bg21 border-bottom border-end border-black pd_s_21'></div>
                                                                                <div className='col2_bg21 h2_bg21 border-end border-black pd_s_21 center_bg21'></div>
                                                                                <div className='col1_bg21 h2_bg21  pd_s_21 center_bg21'></div>
                                                                            </div>
                                                                            <div className='d-flex '>
                                                                                <div className='col1_bg21 h2_bg21 border-bottom  border-end border-black pd_s_21 fw-bold start_bg21'>SET</div>
                                                                                <div className='col2_bg21 h2_bg21 border-bottom border-end border-black pd_s_21'></div>
                                                                                <div className='col2_bg21 h2_bg21 border-bottom border-end border-black pd_s_21'></div>
                                                                                <div className='col2_bg21 h2_bg21 border-end border-black pd_s_21 center_bg21'></div>
                                                                                <div className='col1_bg21 h2_bg21  pd_s_21 center_bg21'></div>
                                                                            </div>
                                                                            <div className='d-flex '>
                                                                                <div className='col1_bg21 h2_bg21 border-bottom border-end border-black pd_s_21 fw-bold start_bg21'>FPOL</div>
                                                                                <div className='col2_bg21 h2_bg21 border-bottom border-end border-black pd_s_21'></div>
                                                                                <div className='col2_bg21 h2_bg21 border-bottom border-end border-black pd_s_21'></div>
                                                                                <div className='col2_bg21 h2_bg21 border-end border-black pd_s_21 center_bg21'></div>
                                                                                <div className='col1_bg21 h2_bg21  pd_s_21 center_bg21'></div>
                                                                            </div>
                                                                            <div className='d-flex '>
                                                                                <div className='col1_bg21 h2_bg21 border-bottom border-end border-black pd_s_21 fw-bold start_bg21'>RHM</div>
                                                                                <div className='col2_bg21 h2_bg21 border-bottom border-end border-black pd_s_21'></div>
                                                                                <div className='col2_bg21 h2_bg21 border-bottom border-end border-black pd_s_21'></div>
                                                                                <div className='col2_bg21 h2_bg21 border-end border-black pd_s_21 center_bg21'></div>
                                                                                <div className='col1_bg21 h2_bg21  pd_s_21 center_bg21'></div>
                                                                            </div>
                                                                            <div className='d-flex '>
                                                                                <div className='col1_bg21 h2_bg21 border-bottom border-end border-black pd_s_21 fw-bold start_bg21'>FG</div>
                                                                                <div className='col2_bg21 h2_bg21 border-bottom border-end border-black pd_s_21'></div>
                                                                                <div className='col2_bg21 h2_bg21 border-bottom border-end border-black pd_s_21'></div>
                                                                                <div className='col2_bg21 h2_bg21 border-bottom border-end border-black pd_s_21 center_bg21'></div>
                                                                                <div className='col1_bg21 h2_bg21 border-bottom border-black pd_s_21 center_bg21'></div>
                                                                            </div>
                                                                        </div>
                                                                        {/* instruction and barcode */}
                                                                        <div className='d-flex'>
                                                                        <div className='ins_div_bg21 border-end border-black'>
                                                                                <div className='border-bottom h_ins_bg21 border-black d-flex'>
                                                                                    <div className='col1_bg21 start_bg21 h_ins_bg21 fw-bold ps-1 border-end border-black'>Stamping</div>
                                                                                    <div className='h_ins_bg21 text-break d-flex align-items-center flex-wrap ps-1'>{val?.stamping}</div>
                                                                                </div>
                                                                                <div className='border-bottom h_ins_bg21 border-black d-flex'>
                                                                                    <div className='col1_bg21 start_bg21 h_ins_bg21 fw-bold ps-1 border-end border-black'>Cust. Ins.</div>
                                                                                    <div className='h_ins_bg21 text-break d-flex align-items-center flex-wrap ps-1'>{val?.productInfoSeparate?.customer}</div>
                                                                                </div>
                                                                                <div className='border-bottom h_ins_bg21 border-black d-flex'>
                                                                                    <div className='col1_bg21 start_bg21 h_ins_bg21 fw-bold ps-1 border-end border-black'>D.Pro. Ins.</div>
                                                                                    <div className='h_ins_bg21 text-break d-flex align-items-center flex-wrap ps-1'>{val?.productInfoSeparate?.wax}</div>
                                                                                </div>
                                                                                <div className=' h_ins_bg21  d-flex'>
                                                                                    <div className='col1_bg21 start_bg21 h_ins_bg21 fw-bold ps-1 border-end border-black'>Remark</div>
                                                                                    <div className='h_ins_bg21 text-break d-flex align-items-center flex-wrap ps-1'>{val?.productInfoSeparate?.finding}</div>
                                                                                </div>
                                                                                
                                                                            </div>
                                                                            <div className='barcode_div_bg21'>
                                                                                    <BarcodeGenerator
                                                                                        data={val?.serialjobno}
                                                                                    />
                                                                            </div>
                                                                        </div>
                                                                    </div>

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







// import queryString from 'query-string';
// import React from 'react';
// import { useEffect } from 'react';
// import { useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import "../../assets/css/bagprint/bagprint21.css";
// import { GetData } from '../../GlobalFunctions/GetData';
// import { handleImageError } from '../../GlobalFunctions/HandleImageError';
// import { handlePrint } from '../../GlobalFunctions/HandlePrint';
// import Loader from '../../components/Loader';
// import { organizeData } from '../../GlobalFunctions/OrganizeBagPrintData';
// import { GetChunkData } from './../../GlobalFunctions/GetChunkData';
// import { GetUniquejob } from '../../GlobalFunctions/GetUniqueJob';
// import { checkArr, checkInstruction } from "../../GlobalFunctions";
// import BarcodeGenerator from './../../components/BarcodeGenerator';

// function BagPrint21A({ queries, headers }) {
//     const [data, setData] = useState([]);
//     const location = useLocation();
//     const queryParams = queryString.parse(location?.search);
//     const resultString = GetUniquejob(queryParams?.str_srjobno);
//     const chunkSize10 = 10;

//     useEffect(() => {
//         if (Object.keys(queryParams)?.length !== 0) {
//           atob(queryParams?.imagepath);
//         }
    
//         const fetchData = async () => {
//           try {
//             const responseData = [];
//             const objs = {
//               jobno: resultString,
//               custid: queries?.custid,
//               printname: queries?.printname,
//               appuserid: queries?.appuserid,
//               url: queries?.url,
//               headers: headers,
//             };
    
//             const allDatas = await GetData(objs);
//             let datas = organizeData(allDatas?.rd, allDatas?.rd1);
            

//             // eslint-disable-next-line array-callback-return
//             datas?.map((a) => {

//                 let total_ActualPcs = 0;
//                 let total_ActualWeight = 0;
              
//               let length = 0;

//             //   let clr = {
//             //     Shapename: "TOTAL",
//             //     Sizename: "C TOTAL",
//             //     ActualPcs: 0,
//             //     ActualWeight: 0,
//             //     MasterManagement_DiamondStoneTypeid: 4,
//             //   };
//             //   let dia = {
//             //     Shapename: "TOTAL",
//             //     Sizename: "D TOTAL",
//             //     ActualPcs: 0,
//             //     ActualWeight: 0,
//             //     MasterManagement_DiamondStoneTypeid: 3,
//             //   };
//             //   let misc = {
//             //     Shapename: "MISC TOTAL",
//             //     Sizename: "MISC TOTAL",
//             //     ActualPcs: 0,
//             //     ActualWeight: 0,
//             //     MasterManagement_DiamondStoneTypeid: 7,
//             //   };
//             //   let f = {
//             //     Shapename: "TOTAL",
//             //     Sizename: "F TOTAL",
//             //     ActualPcs: 0,
//             //     ActualWeight: 0,
//             //     MasterManagement_DiamondStoneTypeid: 5,
//             //   };
//               let DiamondList = [];
//               let ColorStoneList = [];
//               let MiscList = [];
//               let FindingList = [];
    
//               // eslint-disable-next-line array-callback-return
//               a?.rd1?.map((e, i) => {
                
//                 if (e?.ConcatedFullShapeQualityColorCode !== "- - - ") {
//                   length++;
//                 }
//                 if (e?.MasterManagement_DiamondStoneTypeid === 3) {
//                   DiamondList.push(e);
//                 //   dia.ActualPcs = dia.ActualPcs + e?.ActualPcs;
//                 //   dia.ActualWeight = dia.ActualWeight + e?.ActualWeight;
//                   total_ActualPcs = total_ActualPcs + e?.ActualPcs;
//                   total_ActualWeight = total_ActualWeight + e?.ActualWeight;  
//                 } else if (e?.MasterManagement_DiamondStoneTypeid === 4) {
//                   ColorStoneList.push(e);
//                 //   clr.ActualPcs = clr.ActualPcs + e?.ActualPcs;
//                 //   clr.ActualWeight = clr.ActualWeight + e?.ActualWeight;
//                   total_ActualPcs = total_ActualPcs + e?.ActualPcs;
//                   total_ActualWeight = total_ActualWeight + e?.ActualWeight;
//                 } else if (e?.MasterManagement_DiamondStoneTypeid === 5) {
//                   FindingList.push(e);
//                 //   f.ActualPcs = f.ActualPcs + e?.ActualPcs;
//                 //   f.ActualWeight = f.ActualWeight + e?.ActualWeight;
                  
//                 } else if (e?.MasterManagement_DiamondStoneTypeid === 7) {
//                   MiscList.push(e);
//                 //   misc.ActualPcs = misc.ActualPcs + e?.ActualPcs;
//                 //   misc.ActualWeight = misc.ActualWeight + e?.ActualWeight;
//                   total_ActualPcs = total_ActualPcs + e?.ActualPcs;
//                   total_ActualWeight = total_ActualWeight + e?.ActualWeight;
//                 }
//               });
//             //   dia.ActualPcs = +dia.ActualPcs?.toFixed(3);
//             //   dia.ActualWeight = +dia.ActualWeight?.toFixed(3);
//             //   clr.ActualPcs = +clr.ActualPcs?.toFixed(3);
//             //   clr.ActualWeight = +clr.ActualWeight?.toFixed(3);
//             //   misc.ActualPcs = +misc.ActualPcs?.toFixed(3);
//             //   misc.ActualWeight = +misc.ActualWeight?.toFixed(3);
//             //   f.ActualPcs = +f.ActualPcs?.toFixed(3);
//             //   f.ActualWeight = +f.ActualWeight?.toFixed(3);
              
//             //   DiamondList?.push(dia);
//             //   ColorStoneList?.push(clr);
//             //   MiscList?.push(misc);
//             //   FindingList?.push(f);
              
//               let newDia = {
//                 Shapename: "",
//                 Sizename: "Diamond Detail",
//                 ActualPcs: "",
//                 ActualWeight: "",
//                 MasterManagement_DiamondStoneTypeid: 3,
//               };
//               let newCS = {
//                 Shapename: "",
//                 Sizename: "Colorstone Detail",
//                 ActualPcs: "",
//                 ActualWeight: "",
//                 MasterManagement_DiamondStoneTypeid: 4,
//               };
//               let newMisc = {
//                 Shapename: "",
//                 Sizename: "Misc Detail",
//                 ActualPcs: "",
//                 ActualWeight: "",
//                 MasterManagement_DiamondStoneTypeid: 7,
//               };
//               let newfind = {
//                 Shapename: "",
//                 Sizename: "Finding Detail",
//                 ActualPcs: "",
//                 ActualWeight: "",
//                 MasterManagement_DiamondStoneTypeid: 5,
//               };
    
//             //   DiamondList?.unshift(newDia);
//             //   ColorStoneList?.unshift(newCS);
//             //   MiscList?.unshift(newMisc);
//             //   FindingList?.unshift(newfind);
              
//             //   let mainArr = checkArr(
//             //     DiamondList,
//             //     ColorStoneList,
//             //     MiscList,
//             //     []
//             //     // ArrofFSize
//             //   );
                
//             let mainArr = [...DiamondList, ...ColorStoneList, ...MiscList]

//               let imagePath = queryParams?.imagepath;
//               imagePath = atob(queryParams?.imagepath);
    
//               let img = imagePath + a?.rd?.ThumbImagePath;
    
//               const arr =  GetChunkData(chunkSize10, mainArr);
                
//               responseData.push({
//                 data: a,
//                 total_ActualPcs : total_ActualPcs,
//                 total_ActualWeight : total_ActualWeight,
//                 additional: {
//                   length: length,
//                 //   clr: clr,
//                 //   dia: dia,
//                 //   f: f,
//                 // misc: misc,
//                   img: img,
//                   pages: arr,
//                 },
//               });
//             });
//             setData(responseData);
//           } catch (error) {
//             console.log(error);
//           }
//         };
//         fetchData();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//       }, []);

//       const handleImageError = (e) => {
//         e.target.src = require("../../assets/img/default.jpg");
//       };
//     useEffect(() => {
//         if (data?.length !== 0) {
//             setTimeout(() => {
//                 window.print();
//             }, 5000);
//         }
// }, [data?.length]);

//     return (
//         <>
//             {
//                 data.length === 0 ? <Loader /> : <><div className="print_btn d_none_bg21"><button className="btn_white blue print_btn" onClick={(e) => handlePrint(e)}>
//                     Print
//                 </button></div>
//                     <div className='container_bg21_main_box pad_60_allPrint '>
//                         <div className='container_print_bg21'>
//                             {Array.from({ length: queries?.pageStart }, (_, index) => (
//                                 index > 0 && <div key={index} className="container_1" style={{ border: "0px" }}></div>
//                             ))}
//                             {
//                                 data?.length > 0 && data?.map((e, i) => {
//                                     let val = e?.data?.rd;
//                                     return (
//                                         <React.Fragment key={i}>
//                                             {
//                                                 e?.additional?.pages?.length > 0 ? 
//                                                         e?.additional?.pages?.map((a, index) => {
//                                                             let val = e?.data?.rd;
//                                                             return (
//                                                                     <div className='container_bg21' key={index}>
//                                                                         <div className='d-flex align-items-center border-bottom border-black fw-bold'>
//                                                                             <div className='border-end border-black start_bg21 col1_bg21 pd_s_21'>Bag No</div>
//                                                                             <div className='border-end border-black start_bg21 col2_bg21 pd_s_21'>{val?.serialjobno}</div>
//                                                                             <div className='border-end border-black  col3_bg21 pd_s_21 start_bg21 pd_s_21' style={{width:'90px', fontSize:'12px'}}>{val?.MetalType +" "+ val?.MetalColorCo}</div>
//                                                                             <div className='border-end border-black start_bg21 col4_bg21 pd_s_21' style={{width:'40px'}}>P Code</div>
//                                                                             <div className=' col5_bg21 pd_s_21 center_bg21' style={{width:'85px'}}>{val?.CustomerCode}</div>
//                                                                         </div>
//                                                                         <div className='d-flex'>
//                                                                             <div className='d-flex flex-col fw-bold'>
//                                                                                 <div className='d-flex border-bottom border-black'>
//                                                                                     <div className='col1_bg21 border-end border-black start_bg21 pd_s_21'>D. No</div>
//                                                                                     <div className='col6_bg21 border-end border-black start_bg21 pd_s_21'>{val?.Designcode}</div>
//                                                                                 </div>
//                                                                                 <div className='d-flex border-bottom border-black'>
//                                                                                     <div className='col1_bg21 border-end border-black start_bg21 pd_s_21'>O.Date</div>
//                                                                                     <div className='col2_bg21 border-end border-black center_bg21'>{val?.orderDatef}</div>
//                                                                                     <div className='col7_bg21 border-end border-black start_bg21 pd_s_21' style={{backgroundColor:"#83C8E4", fontSize:'12px'}}>Del Dt.</div>
//                                                                                     <div className='col8_bg21 border-end border-black center_bg21' style={{backgroundColor:"#83C8E4", fontSize:'12px'}}>{val?.promiseDatef}</div>
//                                                                                 </div>
//                                                                                 <div className='d-flex border-bottom border-black'>
//                                                                                     <div className='col1_bg21 border-end border-black start_bg21 pd_s_21'>Mfgcode</div>
//                                                                                     <div className='col9_bg21 border-end border-black start_bg21 pd_s_21' style={{width:'200px'}}>{val?.mfgdesign}</div>
//                                                                                     {/* <div className='col10_bg21 border-end border-black pd_s_21'></div>
//                                                                                     <div className='col7_bg21 border-end border-black pd_s_21'></div> */}
//                                                                                 </div>
//                                                                                 <div className='d-flex border-bottom border-black'>
//                                                                                     <div className='col1_bg21 border-end border-black pd_s_21 start_bg21'>PO :</div>
//                                                                                     <div className='col2_bg21 border-end border-black pd_s_21 start_bg21' style={{width:"125px"}}>{val?.PO}</div>
//                                                                                     <div className='col8_bg21 border-end border-black pd_s_21 start_bg21'>BQTY:{val?.Quantity}</div>
//                                                                                     {/* <div className='col7_bg21 border-end border-black pd_s_21 start_bg21'></div> */}
//                                                                                 </div>
//                                                                                 <div className='d-flex border-bottom border-black'>
//                                                                                     <div className='col1_bg21 border-end border-black pd_s_21 start_bg21'>Size :</div>
//                                                                                     <div className='col11_bg21 border-end border-black pd_s_21 start_bg21' style={{width:'200px'}}>{val?.Size}</div>
//                                                                                     {/* <div className='col7_bg21 border-end border-black pd_s_21 start_bg21'></div> */}
//                                                                                 </div>
//                                                                                 <div className='d-flex border-bottom border-black'>
//                                                                                     <div className='col1_bg21 border-end border-black pd_s_21 start_bg21'>Or No.</div>
//                                                                                     <div className='col12_bg21 border-end border-black pd_s_21 start_bg21' style={{width:'71px'}}>{val?.OrderNo}</div>
//                                                                                     <div className='col13_bg21 border-end border-black pd_s_21 start_bg21' style={{width:'71px'}}>Or Wt</div>
//                                                                                     <div className='col7_bg21 border-end border-black pd_s_21 start_bg21' style={{width:'58px'}}>{val?.ActualGrossweight?.toFixed(3)}</div>
//                                                                                 </div>
//                                                                             </div>
//                                                                             <div className='imgDiv_bg21 border-bottom border-black'>
//                                                                                 <img src={val?.DesignImage} alt="#designImg" onError={(e) => handleImageError(e)} loading="eager" className='img_bg21' />
//                                                                             </div>
//                                                                         </div>
//                                                                         {/* table */}
//                                                                         <div>
//                                                                             <div className='d-flex fw-bold border-bottom border-black'>
//                                                                                 <div className='col1_bg21 border-end border-black pd_s_21 start_bg21'>Shape</div>
//                                                                                 <div className='col2_bg21 border-end border-black pd_s_21 start_bg21'>Size</div>
//                                                                                 <div className='col14_bg21 border-end border-black pd_s_21 start_bg21'>Pcs</div>
//                                                                                 <div className='col13_bg21 border-end border-black pd_s_21 start_bg21' >Cts</div>
//                                                                                 <div className='col7_bg21 border-end border-black pd_s_21 start_bg21' style={{width:'29px'}}>I Pcs</div>
//                                                                                 <div className='col15_bg21 border-end border-black pd_s_21 start_bg21' style={{width:'54px'}}>I Cts</div>
//                                                                                 <div className='col15_bg21 border-end border-black pd_s_21 start_bg21' style={{width:'31px'}}>R Pcs</div>
//                                                                                 <div className='col15_bg21  pd_s_21 start_bg21' style={{width:'52px'}}>R Cts</div>
//                                                                             </div>
//                                                                             {
//                                                                                 a?.data?.map((el, i) => {
//                                                                                     return (
//                                                                                         <div className='d-flex  border-bottom border-black' key={i}>
//                                                                                             <div className='col1_bg21 border-end border-black pd_s_21 start_bg21 text-break'>{el?.Shapename}</div>
//                                                                                             <div className='col2_bg21 border-end border-black pd_s_21 start_bg21 text-break'>{el?.Sizename}</div>
//                                                                                             <div className='col14_bg21 border-end border-black end_bg21 pd_e_21  text-break'>{el?.ActualPcs}</div>
//                                                                                             <div className='col13_bg21 border-end border-black end_bg21 pd_e_21  text-break'>{el?.ActualWeight?.toFixed(3)}</div>
//                                                                                             <div className='col7_bg21 border-end border-black pd_s_21' style={{width:'29px'}}></div>
//                                                                                             <div className='col15_bg21 border-end border-black pd_s_21' style={{width:'54px'}}></div>
//                                                                                             <div className='col15_bg21 border-end border-black pd_s_21' style={{width:'31px'}}></div>
//                                                                                             <div className='col15_bg21  pd_s_21' style={{width:'52px'}}></div>
//                                                                                         </div>
//                                                                                     )
//                                                                                 })
//                                                                             }
                                                                            
//                                                                             {       Array.from(
//                                                                                         { length: a?.length },
//                                                                                         (_, index) => (
//                                                                                             <div className='d-flex  border-bottom border-black' key={index}>
//                                                                                             <div className='col1_bg21 border-end border-black pd_s_21'></div>
//                                                                                             <div className='col2_bg21 border-end border-black pd_s_21'></div>
//                                                                                             <div className='col14_bg21 border-end border-black end_bg21 pd_e_21'></div>
//                                                                                             <div className='col13_bg21 border-end border-black end_bg21 pd_e_21'></div>
//                                                                                             <div className='col7_bg21 border-end border-black pd_s_21' style={{width:'29px'}}></div>
//                                                                                             <div className='col15_bg21 border-end border-black pd_s_21' style={{width:'54px'}}></div>
//                                                                                             <div className='col15_bg21 border-end border-black pd_s_21' style={{width:'31px'}}></div>
//                                                                                             <div className='col15_bg21  pd_s_21' style={{width:'52px'}}></div>
//                                                                                         </div>
//                                                                                         )
//                                                                                     )}
//                                                                             <div className='d-flex fw-bold border-bottom border-black'>
//                                                                                 <div className='col16_bg21 h_bg21 border-end border-black pd_s_21 center_bg21'>Total</div>
//                                                                                 <div className='col14_bg21 h_bg21 border-end border-black end_bg21  pd_e_21'>{e?.total_ActualPcs}</div>
//                                                                                 <div className='col13_bg21 h_bg21 border-end border-black end_bg21 pd_e_21'>{e?.total_ActualWeight?.toFixed(3)}</div>
//                                                                                 <div className='col7_bg21 h_bg21 border-end border-black pd_s_21' style={{width:'29px'}}></div>
//                                                                                 <div className='col15_bg21 h_bg21 border-end border-black pd_s_21' style={{width:'54px'}}></div>
//                                                                                 <div className='col15_bg21 h_bg21 border-end border-black pd_s_21' style={{width:'31px'}}></div>
//                                                                                 <div className='col15_bg21 h_bg21 pd_s_21' style={{width:'52px'}}></div>
//                                                                             </div>
//                                                                         </div>
//                                                                         {/* instruction and barcode */}
//                                                                         <div className='d-flex'>
//                                                                             <div className='ins_div_bg21 border-end border-black'>
//                                                                                 <div className='border-bottom h_ins_bg21 border-black d-flex'>
//                                                                                     <div className='col1_bg21 start_bg21 h_ins_bg21 fw-bold ps-1 border-end border-black'>Stamping</div>
//                                                                                     <div className='h_ins_bg21 text-break d-flex align-items-center flex-wrap ps-1'>{val?.stamping}</div>
//                                                                                 </div>
//                                                                                 <div className='border-bottom h_ins_bg21 border-black d-flex'>
//                                                                                     <div className='col1_bg21 start_bg21 h_ins_bg21 fw-bold ps-1 border-end border-black'>Cust. Ins.</div>
//                                                                                     <div className='h_ins_bg21 text-break d-flex align-items-center flex-wrap ps-1'>{val?.productInfoSeparate?.customer}</div>
//                                                                                 </div>
//                                                                                 <div className='border-bottom h_ins_bg21 border-black d-flex'>
//                                                                                     <div className='col1_bg21 start_bg21 h_ins_bg21 fw-bold ps-1 border-end border-black'>D.Pro. Ins.</div>
//                                                                                     <div className='h_ins_bg21 text-break d-flex align-items-center flex-wrap ps-1'>{val?.productInfoSeparate?.wax}</div>
//                                                                                 </div>
//                                                                                 <div className=' h_ins_bg21  d-flex'>
//                                                                                     <div className='col1_bg21 start_bg21 h_ins_bg21 fw-bold ps-1 border-end border-black'>Remark</div>
//                                                                                     <div className='h_ins_bg21 text-break d-flex align-items-center flex-wrap ps-1'>{val?.productInfoSeparate?.finding}</div>
//                                                                                 </div>
                                                                                
//                                                                             </div>
//                                                                             <div className='barcode_div_bg21'>
//                                                                                     <BarcodeGenerator
//                                                                                         data={val?.serialjobno}
//                                                                                     />
//                                                                             </div>
//                                                                         </div>
//                                                                     </div>
//                                                             );
//                                                         })
//                                                       :
//                                                       <div className='container_bg21' >
//                                                       <div className='d-flex align-items-center border-bottom border-black fw-bold'>
//                                                           <div className='border-end border-black col1_bg21 pd_s_21 start_bg21'>Bag No</div>
//                                                           <div className='border-end border-black col2_bg21 pd_s_21 start_bg21'>{val?.serialjobno}</div>
//                                                           <div className='border-end border-black col3_bg21 pd_s_21 start_bg21 pd_s_21' style={{width:'90px', fontSize:'12px'}}>{val?.MetalType +" "+ val?.MetalColorCo}</div>
//                                                           <div className='border-end border-black col4_bg21 pd_s_21 start_bg21' style={{width:'40px'}}>P Code</div>
//                                                           <div className=' col5_bg21 pd_s_21 start_bg21' style={{width:'85px'}}>{val?.CustomerCode}</div>
//                                                       </div>
//                                                       <div className='d-flex'>
//                                                           <div className='d-flex flex-col fw-bold'>
//                                                               <div className='d-flex border-bottom border-black'>
//                                                                   <div className='col1_bg21 border-end border-black pd_s_21 start_bg21 '>D. No</div>
//                                                                   <div className='col6_bg21 border-end border-black pd_s_21 start_bg21' >{val?.Designcode}</div>
//                                                               </div>
//                                                               <div className='d-flex border-bottom border-black'>
//                                                                   <div className='col1_bg21 border-end border-black pd_s_21 start_bg21'>O.Date</div>
//                                                                   <div className='col2_bg21 border-end border-black center_bg21 '>{val?.orderDatef}</div>
//                                                                   <div className='col7_bg21 border-end border-black pd_s_21 start_bg21' style={{backgroundColor:"#83C8E4", fontSize:'12px'}}>Del Dt.</div>
//                                                                   <div className='col8_bg21 border-end border-black center_bg21' style={{backgroundColor:"#83C8E4", fontSize:'12px'}}>{val?.promiseDatef}</div>
//                                                               </div>
//                                                               <div className='d-flex border-bottom border-black'>
//                                                                   <div className='col1_bg21 border-end border-black pd_s_21 start_bg21'>Mfgcode</div>
//                                                                   <div className='col9_bg21 border-end border-black pd_s_21 start_bg21' style={{width:'200px'}}>{val?.mfgdesign}</div>
//                                                                   {/* <div className='col10_bg21 border-end border-black pd_s_21'></div>
//                                                                   <div className='col7_bg21 border-end border-black pd_s_21'></div> */}
//                                                               </div>
//                                                               <div className='d-flex border-bottom border-black'>
//                                                                   <div className='col1_bg21 border-end border-black pd_s_21 start_bg21'>PO :</div>
//                                                                   <div className='col2_bg21 border-end border-black pd_s_21 start_bg21' style={{width:"125px"}}>{val?.PO}</div>
//                                                                   <div className='col8_bg21 border-end border-black pd_s_21 start_bg21'>BQTY:{val?.Quantity}</div>
//                                                                   {/* <div className='col7_bg21 border-end border-black pd_s_21 start_bg21'></div> */}
//                                                               </div>
//                                                               <div className='d-flex border-bottom border-black'>
//                                                                   <div className='col1_bg21 border-end border-black pd_s_21 start_bg21'>Size :</div>
//                                                                   <div className='col11_bg21 border-end border-black pd_s_21 start_bg21' style={{width:'200px'}}>{val?.Size}</div>
//                                                                   {/* <div className='col7_bg21 border-end border-black pd_s_21 start_bg21'></div> */}
//                                                               </div>
//                                                               <div className='d-flex border-bottom border-black'>
//                                                                   <div className='col1_bg21 border-end border-black pd_s_21 start_bg21'>Or No.</div>
//                                                                   <div className='col12_bg21 border-end border-black pd_s_21 start_bg21' style={{width:'71px'}}>{val?.OrderNo}</div>
//                                                                   <div className='col13_bg21 border-end border-black pd_s_21 start_bg21' style={{width:'71px'}}>Or Wt</div>
//                                                                   <div className='col7_bg21 border-end border-black pd_s_21 start_bg21' style={{width:'58px'}}>{val?.ActualGrossweight?.toFixed(3)}</div>
//                                                               </div>
//                                                           </div>
//                                                           <div className='imgDiv_bg21 border-bottom border-black'>
//                                                           <img src={val?.DesignImage} alt="#designImg" onError={(e) => handleImageError(e)} loading="eager" className='img_bg21' />
//                                                           </div>
//                                                       </div>
//                                                       {/* table */}
//                                                       <div>
//                                                           <div className='d-flex fw-bold border-bottom border-black'>
//                                                               <div className='col1_bg21 border-end border-black start_bg21 pd_s_21'>Shape</div>
//                                                               <div className='col2_bg21 border-end border-black  start_bg21 pd_s_21'>Size</div>
//                                                               <div className='col14_bg21 border-end border-black  start_bg21 pd_s_21'>Pcs</div>
//                                                               <div className='col13_bg21 border-end border-black  start_bg21 pd_s_21'>Cts</div>
//                                                               <div className='col7_bg21 border-end border-black  start_bg21 pd_s_21'>I Pcs</div>
//                                                               <div className='col15_bg21 border-end border-black  start_bg21 pd_s_21'>I Cts</div>
//                                                               <div className='col15_bg21 border-end border-black  start_bg21 pd_s_21'>R Pcs</div>
//                                                               <div className='col15_bg21 start_bg21 pd_s_21'>R Cts</div>
//                                                           </div>
//                                                           {       Array.from(
//                                                                                         { length: 10 },
//                                                                                         (_, index) => (
//                                                                                             <div className='d-flex  border-bottom border-black' key={index}>
//                                                                                             <div className='col1_bg21 border-end border-black pd_s_21'></div>
//                                                                                             <div className='col2_bg21 border-end border-black pd_s_21'></div>
//                                                                                             <div className='col14_bg21 border-end border-black end_bg21 pd_e_21'></div>
//                                                                                             <div className='col13_bg21 border-end border-black end_bg21 pd_e_21'></div>
//                                                                                             <div className='col7_bg21 border-end border-black pd_s_21'></div>
//                                                                                             <div className='col15_bg21 border-end border-black pd_s_21'></div>
//                                                                                             <div className='col15_bg21 border-end border-black pd_s_21'></div>
//                                                                                             <div className='col15_bg21  pd_s_21'></div>
//                                                                                         </div>
//                                                                                         )
//                                                                                     )}
//                                                           <div className='d-flex fw-bold border-bottom border-black'>
//                                                               <div className='col16_bg21 h_bg21 border-end border-black pd_s_21 center_bg21'>Total</div>
//                                                               <div className='col14_bg21 h_bg21 border-end border-black end_bg21 pd_e_21'>{e?.total_ActualPcs}</div>
//                                                               <div className='col13_bg21 h_bg21 border-end border-black end_bg21 pd_e_21'>{e?.total_ActualWeight}</div>
//                                                               <div className='col7_bg21 h_bg21 border-end border-black pd_s_21'></div>
//                                                               <div className='col15_bg21 h_bg21 border-end border-black pd_s_21'></div>
//                                                               <div className='col15_bg21 h_bg21 border-end border-black pd_s_21'></div>
//                                                               <div className='col15_bg21 h_bg21 pd_s_21'></div>
//                                                           </div>
//                                                       </div>
//                                                       {/* instruction and barcode */}
//                                                                         <div className='d-flex'>
//                                                                             <div className='ins_div_bg21 border-end border-black'>
//                                                                                 <div className='border-bottom h_ins_bg21 border-black d-flex'>
//                                                                                     <div className='col1_bg21 start_bg21 h_ins_bg21 fw-bold ps-1 border-end border-black'>Stamping</div>
//                                                                                     <div className='h_ins_bg21 text-break d-flex align-items-center flex-wrap ps-1'>{val?.stamping}</div>
//                                                                                 </div>
//                                                                                 <div className='border-bottom h_ins_bg21 border-black d-flex'>
//                                                                                     <div className='col1_bg21 start_bg21 h_ins_bg21 fw-bold ps-1 border-end border-black'>Cust. Ins.</div>
//                                                                                     <div className='h_ins_bg21 text-break d-flex align-items-center flex-wrap ps-1'>{val?.productInfoSeparate?.customer}</div>
//                                                                                 </div>
//                                                                                 <div className='border-bottom h_ins_bg21 border-black d-flex'>
//                                                                                     <div className='col1_bg21 start_bg21 h_ins_bg21 fw-bold ps-1 border-end border-black'>D.Pro. Ins.</div>
//                                                                                     <div className='h_ins_bg21 text-break d-flex align-items-center flex-wrap ps-1'>{val?.productInfoSeparate?.wax}</div>
//                                                                                 </div>
//                                                                                 <div className=' h_ins_bg21  d-flex'>
//                                                                                     <div className='col1_bg21 start_bg21 h_ins_bg21 fw-bold ps-1 border-end border-black'>Remark</div>
//                                                                                     <div className='h_ins_bg21 text-break d-flex align-items-center flex-wrap ps-1'>{val?.productInfoSeparate?.finding}</div>
//                                                                                 </div>
                                                                                
//                                                                             </div>
//                                                           <div className='barcode_div_bg21'>
//                                                                   <BarcodeGenerator
//                                                                       data={val?.serialjobno}
//                                                                   />
//                                                           </div>
//                                                       </div>
//                                                         </div>
//                                             }

//                                                                     <div className='container_bg21'>
//                                                                         <div className='d-flex align-items-center border-bottom border-black fw-bold'>
//                                                                             <div className='border-end border-black col1_bg21 pd_s_21 start_bg21'>Bag No</div>
//                                                                             <div className='border-end border-black col2_bg21 pd_s_21 start_bg21'>{val?.serialjobno}</div>
//                                                                             <div className='border-end border-black col3_bg21 pd_s_21 start_bg21 pd_s_21' style={{width:'90px', fontSize:'12px'}}>{val?.MetalType +" "+ val?.MetalColorCo}</div>
//                                                                             <div className='border-end border-black col4_bg21 pd_s_21 start_bg21' style={{width:'40px'}}>P Code</div>
//                                                                             <div className=' col5_bg21 pd_s_21 start_bg21' style={{width:'85px'}}>{val?.CustomerCode}</div>
//                                                                         </div>
//                                                                         <div className='d-flex'>
//                                                                             <div className='d-flex flex-col fw-bold'>
//                                                                                 <div className='d-flex border-bottom border-black'>
//                                                                                     <div className='col1_bg21 border-end border-black pd_s_21 start_bg21'>D. No</div>
//                                                                                     <div className='col6_bg21 border-end border-black pd_s_21 start_bg21'>{val?.Designcode}</div>
//                                                                                 </div>
//                                                                                 <div className='d-flex border-bottom border-black'>
//                                                                                     <div className='col1_bg21 border-end border-black pd_s_21 start_bg21'>O.Date</div>
//                                                                                     <div className='col2_bg21 border-end border-black center_bg21 '>{val?.orderDatef}</div>
//                                                                                     <div className='col7_bg21 border-end border-black pd_s_21 start_bg21' style={{backgroundColor:"#83C8E4", fontSize:'12px'}}>Del Dt.</div>
//                                                                                     <div className='col8_bg21 border-end border-black center_bg21' style={{backgroundColor:"#83C8E4", fontSize:'12px'}}>{val?.promiseDatef}</div>
//                                                                                 </div>
//                                                                                 <div className='d-flex border-bottom border-black'>
//                                                                                     <div className='col1_bg21 border-end border-black pd_s_21 start_bg21'>Mfgcode</div>
//                                                                                     <div className='col9_bg21 border-end border-black pd_s_21 start_bg21' style={{width:'200px'}}>{val?.mfgdesign}</div>
//                                                                                     {/* <div className='col10_bg21 border-end border-black pd_s_21'></div>
//                                                                                     <div className='col7_bg21 border-end border-black pd_s_21'></div> */}
//                                                                                 </div>
//                                                                                 <div className='d-flex border-bottom border-black'>
//                                                                                     <div className='col1_bg21 border-end border-black pd_s_21 start_bg21'>PO :</div>
//                                                                                     <div className='col2_bg21 border-end border-black pd_s_21 start_bg21' style={{width:"125px"}}>{val?.PO}</div>
//                                                                                     <div className='col8_bg21 border-end border-black pd_s_21 start_bg21'>BQTY:{val?.Quantity}</div>
//                                                                                     {/* <div className='col7_bg21 border-end border-black pd_s_21 start_bg21'></div> */}
//                                                                                 </div>
//                                                                                 <div className='d-flex border-bottom border-black'>
//                                                                                     <div className='col1_bg21 border-end border-black pd_s_21 start_bg21'>Size :</div>
//                                                                                     <div className='col11_bg21 border-end border-black pd_s_21 start_bg21' style={{width:'200px'}}>{val?.Size}</div>
//                                                                                     {/* <div className='col7_bg21 border-end border-black pd_s_21 start_bg21'></div> */}
//                                                                                 </div>
//                                                                                 <div className='d-flex border-bottom border-black'>
//                                                                                     <div className='col1_bg21 border-end border-black pd_s_21 start_bg21'>Or No.</div>
//                                                                                     <div className='col12_bg21 border-end border-black pd_s_21 start_bg21' style={{width:'71px'}}>{val?.OrderNo}</div>
//                                                                                     <div className='col13_bg21 border-end border-black pd_s_21 start_bg21' style={{width:'71px'}}>Or Wt</div>
//                                                                                     <div className='col7_bg21 border-end border-black pd_s_21 start_bg21' style={{width:'58px'}}>{val?.ActualGrossweight?.toFixed(3)}</div>
//                                                                                 </div>
//                                                                             </div>
//                                                                             <div className='imgDiv_bg21 border-bottom border-black'>
//                                                                                 <img src={val?.DesignImage} alt="#designImg" onError={(e) => handleImageError(e)} loading="eager" className='img_bg21' />
//                                                                             </div>
//                                                                         </div>
//                                                                         {/* table */}
//                                                                         <div>
//                                                                             <div className='d-flex fw-bold border-bottom border-black'>
//                                                                                 <div className='col1_bg21 border-end h2_bg21 center_bg21 border-black pd_s_21'>Dept</div>
//                                                                                 <div className='col2_bg21 border-end h2_bg21 center_bg21 border-black pd_s_21'>IssueGold</div>
//                                                                                 <div className='col2_bg21 border-end h2_bg21 center_bg21 border-black pd_s_21'>Ret.Gold</div>
//                                                                                 <div className='col2_bg21 border-end h2_bg21 center_bg21 border-black pd_s_21 center_bg21'>Name</div>
//                                                                                 <div className='col1_bg21  pd_s_21 h2_bg21 center_bg21'>Sign</div>
//                                                                             </div>
//                                                                             <div className='d-flex '>
//                                                                                 <div className='col1_bg21 border-bottom  h2_bg21 border-end border-black pd_s_21 start_bg21 fw-bold'>CAST</div>
//                                                                                 <div className='col2_bg21 border-bottom h2_bg21 border-end border-black pd_s_21'></div>
//                                                                                 <div className='col2_bg21 border-bottom h2_bg21 border-end border-black pd_s_21'></div>
//                                                                                 <div className='col2_bg21 border-end h2_bg21 border-black pd_s_21 center_bg21'></div>
//                                                                                 <div className='col1_bg21  pd_s_21 h2_bg21 center_bg21'></div>
//                                                                             </div>
//                                                                             <div className='d-flex '>
//                                                                                 <div className='col1_bg21 h2_bg21 border-bottom  border-end border-black pd_s_21 start_bg21 fw-bold'>FILL</div>
//                                                                                 <div className='col2_bg21 h2_bg21 border-bottom border-end border-black pd_s_21'></div>
//                                                                                 <div className='col2_bg21 h2_bg21 border-bottom border-end border-black pd_s_21'></div>
//                                                                                 <div className='col2_bg21 h2_bg21 border-end border-black pd_s_21 center_bg21'></div>
//                                                                                 <div className='col1_bg21 h2_bg21  pd_s_21 center_bg21'></div>
//                                                                             </div>
//                                                                             <div className='d-flex'>
//                                                                                 <div className='col1_bg21 h2_bg21 border-bottom  border-end border-black pd_s_21 start_bg21 fw-bold'>PPOL</div>
//                                                                                 <div className='col2_bg21 h2_bg21 border-bottom border-end border-black pd_s_21'></div>
//                                                                                 <div className='col2_bg21 h2_bg21 border-bottom border-end border-black pd_s_21'></div>
//                                                                                 <div className='col2_bg21 h2_bg21 border-end border-black pd_s_21 center_bg21'></div>
//                                                                                 <div className='col1_bg21 h2_bg21  pd_s_21 center_bg21'></div>
//                                                                             </div>
//                                                                             <div className='d-flex '>
//                                                                                 <div className='col1_bg21 h2_bg21 border-bottom  border-end border-black pd_s_21 fw-bold start_bg21'>SET</div>
//                                                                                 <div className='col2_bg21 h2_bg21 border-bottom border-end border-black pd_s_21'></div>
//                                                                                 <div className='col2_bg21 h2_bg21 border-bottom border-end border-black pd_s_21'></div>
//                                                                                 <div className='col2_bg21 h2_bg21 border-end border-black pd_s_21 center_bg21'></div>
//                                                                                 <div className='col1_bg21 h2_bg21  pd_s_21 center_bg21'></div>
//                                                                             </div>
//                                                                             <div className='d-flex '>
//                                                                                 <div className='col1_bg21 h2_bg21 border-bottom border-end border-black pd_s_21 fw-bold start_bg21'>FPOL</div>
//                                                                                 <div className='col2_bg21 h2_bg21 border-bottom border-end border-black pd_s_21'></div>
//                                                                                 <div className='col2_bg21 h2_bg21 border-bottom border-end border-black pd_s_21'></div>
//                                                                                 <div className='col2_bg21 h2_bg21 border-end border-black pd_s_21 center_bg21'></div>
//                                                                                 <div className='col1_bg21 h2_bg21  pd_s_21 center_bg21'></div>
//                                                                             </div>
//                                                                             <div className='d-flex '>
//                                                                                 <div className='col1_bg21 h2_bg21 border-bottom border-end border-black pd_s_21 fw-bold start_bg21'>RHM</div>
//                                                                                 <div className='col2_bg21 h2_bg21 border-bottom border-end border-black pd_s_21'></div>
//                                                                                 <div className='col2_bg21 h2_bg21 border-bottom border-end border-black pd_s_21'></div>
//                                                                                 <div className='col2_bg21 h2_bg21 border-end border-black pd_s_21 center_bg21'></div>
//                                                                                 <div className='col1_bg21 h2_bg21  pd_s_21 center_bg21'></div>
//                                                                             </div>
//                                                                             <div className='d-flex '>
//                                                                                 <div className='col1_bg21 h2_bg21 border-bottom border-end border-black pd_s_21 fw-bold start_bg21'>FG</div>
//                                                                                 <div className='col2_bg21 h2_bg21 border-bottom border-end border-black pd_s_21'></div>
//                                                                                 <div className='col2_bg21 h2_bg21 border-bottom border-end border-black pd_s_21'></div>
//                                                                                 <div className='col2_bg21 h2_bg21 border-bottom border-end border-black pd_s_21 center_bg21'></div>
//                                                                                 <div className='col1_bg21 h2_bg21 border-bottom border-black pd_s_21 center_bg21'></div>
//                                                                             </div>
//                                                                         </div>
//                                                                         {/* instruction and barcode */}
//                                                                         <div className='d-flex'>
//                                                                         <div className='ins_div_bg21 border-end border-black'>
//                                                                                 <div className='border-bottom h_ins_bg21 border-black d-flex'>
//                                                                                     <div className='col1_bg21 start_bg21 h_ins_bg21 fw-bold ps-1 border-end border-black'>Stamping</div>
//                                                                                     <div className='h_ins_bg21 text-break d-flex align-items-center flex-wrap ps-1'>{val?.stamping}</div>
//                                                                                 </div>
//                                                                                 <div className='border-bottom h_ins_bg21 border-black d-flex'>
//                                                                                     <div className='col1_bg21 start_bg21 h_ins_bg21 fw-bold ps-1 border-end border-black'>Cust. Ins.</div>
//                                                                                     <div className='h_ins_bg21 text-break d-flex align-items-center flex-wrap ps-1'>{val?.productInfoSeparate?.customer}</div>
//                                                                                 </div>
//                                                                                 <div className='border-bottom h_ins_bg21 border-black d-flex'>
//                                                                                     <div className='col1_bg21 start_bg21 h_ins_bg21 fw-bold ps-1 border-end border-black'>D.Pro. Ins.</div>
//                                                                                     <div className='h_ins_bg21 text-break d-flex align-items-center flex-wrap ps-1'>{val?.productInfoSeparate?.wax}</div>
//                                                                                 </div>
//                                                                                 <div className=' h_ins_bg21  d-flex'>
//                                                                                     <div className='col1_bg21 start_bg21 h_ins_bg21 fw-bold ps-1 border-end border-black'>Remark</div>
//                                                                                     <div className='h_ins_bg21 text-break d-flex align-items-center flex-wrap ps-1'>{val?.productInfoSeparate?.finding}</div>
//                                                                                 </div>
                                                                                
//                                                                             </div>
//                                                                             <div className='barcode_div_bg21'>
//                                                                                     <BarcodeGenerator
//                                                                                         data={val?.serialjobno}
//                                                                                     />
//                                                                             </div>
//                                                                         </div>
//                                                                     </div>

//                                         </React.Fragment>
//                                     );
//                                 })
//                             }
                                                                    
//                         </div>
//                     </div>
//                 </>
//             }
//         </>
//     );
// }

// export default BagPrint21A;






