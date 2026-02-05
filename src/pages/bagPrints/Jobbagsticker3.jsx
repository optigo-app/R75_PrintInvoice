import React, { useEffect, useState } from 'react';
import "../../assets/css/bagprint/jobbagsticker3.css"
import queryString from 'query-string';
import Loader from '../../components/Loader';
import BarcodeStickerGen from './BarcodeStickerGen';
import { useLocation } from 'react-router-dom';
import { GetUniquejob } from '../../GlobalFunctions/GetUniqueJob';
import { handleImageError } from '../../GlobalFunctions/HandleImageError';
import { handlePrint } from '../../GlobalFunctions/HandlePrint';
import { checkInstruction } from '../../GlobalFunctions';
import { FetchDatas } from '../../GlobalFunctions/FetchDatas';

function Jobbagsticker3({ queries, headers }) {
    const location = useLocation();
    const queryParams = queryString.parse(location.search);
    const resultString = GetUniquejob(queryParams?.str_srjobno);
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const abc = await FetchDatas(queryParams, resultString, queries, headers);
            abc?.length > 0 ? setData(abc) : setData([])
          } catch (error) {
            console.error(error);
          }
        };
      
        fetchData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

    useEffect(() => {
        if (Object.keys(queryParams)?.length !== 0) {
            atob(queryParams?.imagepath);
        }
    }, [queryParams]);
    
    useEffect(() => {
        if (data?.length !== 0) {
            setTimeout(() => {
                window.print();
            }, 4000);
        }
}, [data]);

    return (
        <>
            {
                data.length === 0 ? <Loader /> : <><div className="print_btn"><button className="btn_white blue print_btn" onClick={(e) => handlePrint(e)}>
                    Print
                </button></div>
                <div className='pad_60_allPrint'>

                
                    {Array.from({ length: queries?.pageStart }, (_, index) => (
                        index > 0 && <div key={index} className="container  ml_5 mb_10"></div>
                    ))}
                    {
                        data?.length > 0 ? 
                            <div className='container_job_bag_sticker_3'>
                                {
                                    data?.map((e, i) => {
                                        return (
                                            <div className='bag_space' key={i}>
                                                <div className="heading_job_3">
                                                    <div className='img_aside_3'>
                                                        <div className='img_job3'>
                                                            <img 
                                                            // src={e?.additional?.img !== "" ? e?.additional?.img : require("../../assets/img/default.jpg")} 
                                                            src={
                                                                e?.data?.rd?.DesignImage !== '' 
                                                                    ? e?.data?.rd?.DesignImage
                                                                  : require("../../assets/img/default.jpg")
                                                              }
                                                            alt="" onError={e => handleImageError(e)} loading="eager" id='jobsticker3' />
                                                        </div>
                                                        <div className='ins_3' >
                                                            <h1 className='h1_3' style={{ lineHeight: "28px" }}>{(" " + (e?.data?.rd?.ProductInstruction?.length > 0 ? checkInstruction(e?.data?.rd?.ProductInstruction) : checkInstruction(e?.data?.rd?.QuoteRemark)))?.slice(0, 62) }</h1>
                                                        </div>
                                                    </div>
                                                    <div className='databarcode_3' style={{position:"relative"}}>
                                                        <div className='data_center_3'>
                                                            <h1 className='h1_3'> {e?.data?.rd?.serialjobno}</h1>
                                                            <h1 className='h1_3'> {e?.data?.rd?.Designcode}</h1>
                                                            <h1 className='h1_3'> {e?.data?.rd?.MetalType}</h1>
                                                            <h1 className='h1_3'> {e?.data?.rd?.MetalColorCo}</h1>
                                                            <h1 className='h1_3'> {e?.data?.rd?.category}</h1>
                                                            <h1 className='h1_3'> {e?.data?.rd?.CustomerCode}</h1>
                                                        </div>
                                                        <div style={{ position: "absolute", right: "-13px" }}>
                                                            {(e?.data?.rd?.length !== 0 && e?.data?.rd !== undefined) && <>{e?.data?.rd?.serialjobno !== undefined && <BarcodeStickerGen data={e?.data?.rd?.serialjobno} />}</>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                         : 'Data Not Found!'
                    }
                    </div>
                </>
            }
        </>
    );
}

export default Jobbagsticker3;