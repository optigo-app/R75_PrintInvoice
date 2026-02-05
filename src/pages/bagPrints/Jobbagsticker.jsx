import React from 'react'
import queryString from 'query-string';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import "../../assets/css/bagprint/jobbagsticker.css"
import Loader from '../../components/Loader';
import QRCodeGenerator from '../../components/QRCodeGenerator';
import { GetUniquejob } from '../../GlobalFunctions/GetUniqueJob';
import { handlePrint } from '../../GlobalFunctions/HandlePrint';
import { FetchDatas } from '../../GlobalFunctions/FetchDatas';
const Jobbagsticker = ({ queries, headers }) => {
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
    <div>
        {
          data?.length === 0 ? <Loader /> : <React.Fragment>
            <div className="print_btn"><button className="btn_white blue print_btn" onClick={(e) => handlePrint(e)}>
                    Print
                </button></div>
                <div className='mainjobbagsticker'>
                {Array.from({ length: queries?.pageStart }, (_, index) => (
                        index > 0 && <div key={index} className="container  ml_5 mb_10"></div>
                    ))}
                    {
                      data?.length > 0 && data?.map((e, index) => {
                        return(
                          <React.Fragment key={index}>
                            {
                              e?.additional?.pages?.length > 0 ? e?.additional?.pages?.map((e, i) => {
                                return(
                                  <div className='containerjbsbg' key={i}>
                                { e?.data?.rd?.serialjobno?.length > 0 && <div className='fsjbsbg'>{e?.data?.rd?.serialjobno}</div>}
                                { e?.data?.rd?.Designcode?.length > 0 && <div className='fsjbsbg'>{e?.data?.rd?.Designcode}</div>}
                                { e?.data?.rd?.CustomerCode?.length > 0 && <div className='fsjbsbg'>{e?.data?.rd?.CustomerCode}</div>}
                                { e?.data?.rd?.OrderNo?.length > 0 && <div className='fsjbsbg'>{e?.data?.rd?.OrderNo}</div>}
                                { e?.data?.rd?.promiseDatef?.length > 0 && <div className='fsjbsbg'>{e?.data?.rd?.promiseDatef}</div>}
                                { e?.data?.rd?.mastermanagement_maketypename?.length > 0 && <div className='fsjbsbg'>{e?.data?.rd?.mastermanagement_maketypename}</div>}
                                { e?.data?.rd?.MetalType?.length > 0 && <div className='fsjbsbg'>{e?.data?.rd?.MetalType?.split(" ")[1] + " " +e?.data?.rd?.MetalColorCo}</div>}
                                { e?.data?.rd?.MetalWeight > 0 && <div className='fsjbsbg'>{(+e?.data?.rd?.MetalWeight)?.toFixed(3)}gm</div>}
                                <div className='fsjbsbg'>{(+e?.data?.rd?.MetalWeight)?.toFixed(3)}gm</div>
                                { e?.data?.rd?.Size?.length > 0 && <div className='fsjbsbg'>Size: {e?.data?.rd?.Size}</div>}
                                <div className='d-flex justify-content-start align-items-center'>
                                <QRCodeGenerator
                                  text={e?.data?.rd.serialjobno}
                                />
                                </div>
                              </div>
                                )
                              }) : 
                              
                              <div className='containerjbsbg'>
                                { e?.data?.rd?.serialjobno?.length > 0 && <div className='fsjbsbg'>{e?.data?.rd?.serialjobno}</div>}
                                { e?.data?.rd?.Designcode?.length > 0 && <div className='fsjbsbg'>{e?.data?.rd?.Designcode}</div>}
                                { e?.data?.rd?.CustomerCode?.length > 0 && <div className='fsjbsbg'>{e?.data?.rd?.CustomerCode}</div>}
                                { e?.data?.rd?.OrderNo?.length > 0 && <div className='fsjbsbg'>{e?.data?.rd?.OrderNo}</div>}
                                { e?.data?.rd?.promiseDatef?.length > 0 && <div className='fsjbsbg'>{e?.data?.rd?.promiseDatef}</div>}
                                { e?.data?.rd?.mastermanagement_maketypename?.length > 0 && <div className='fsjbsbg'>{e?.data?.rd?.mastermanagement_maketypename}</div>}
                                { e?.data?.rd?.MetalType?.length > 0 && <div className='fsjbsbg'>{e?.data?.rd?.MetalType?.split(" ")[1] +" " +e?.data?.rd?.MetalColorCo}</div>}
                                { e?.data?.rd?.MetalWeight > 0 && <div className='fsjbsbg'>{(+e?.data?.rd?.MetalWeight)?.toFixed(3)}gm</div>}
                                { e?.data?.rd?.Size?.length > 0 && <div className='fsjbsbg'>Size: {e?.data?.rd?.Size}</div>}
                                <div className='d-flex justify-content-start align-items-center'>
                                <QRCodeGenerator
                                  text={e?.data?.rd.serialjobno}
                                />
                                </div>
                              </div>
                            }
                          </React.Fragment>
                        )
                      })
                    }
                </div>
          </React.Fragment>
        }
    </div>
  )
}

export default Jobbagsticker