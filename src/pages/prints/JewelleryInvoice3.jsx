import React from 'react'
import Button from "../../GlobalFunctions/Button";
import "../../assets/css/prints/jewelleryinvoice3.css";
import { apiCall, checkMsg, formatAmount, isObjectEmpty } from '../../GlobalFunctions';
import { useEffect } from 'react';
import { useState } from 'react';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import Loader from './../../components/LoaderBag';
import { cloneDeep } from 'lodash';
import { findIndex } from 'lodash';
import { value } from './ExportDeclarationForm';
const JewelleryInvoice3 = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
    const [result, setResult] = useState(null);
    const [msg, setMsg] = useState("");
    const [loader, setLoader] = useState(true);
    const [othDetails, setOthDetails] = useState([]);
    
  useEffect(() => {
    const sendData = async () => {
      try {
        const data = await apiCall(token, invoiceNo, printName, urls, evn, ApiVer);
        if (data?.Status === "200") {
          let isEmpty = isObjectEmpty(data?.Data);
          if (!isEmpty) {
            loadData(data?.Data);
            setLoader(false);
          } else {
            setLoader(false);
            setMsg("Data Not Found");
          }
        } else {
          setLoader(false);
        //   setMsg(data?.Message);
        const err = checkMsg(data?.Message);
                    console.log(data?.Message);
                    setMsg(err);
        }
      } catch (error) {
        console.log(error);
      }
    };
    sendData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = (data) => {
    let address = data?.BillPrint_Json[0]?.Printlable?.split("\r\n");
    data.BillPrint_Json[0].address = address;

    const datas = OrganizeDataPrint(
      data?.BillPrint_Json[0],
      data?.BillPrint_Json1,
      data?.BillPrint_Json2
    );

    // let obj = cloneDeep(datas);
    let oth2 = [];

    datas?.resultArray?.forEach((e, i) => {
        e?.other_details?.forEach((a) => {
            let findrec =  oth2?.findIndex((el) => el?.label === a?.label)
            if(findrec === -1){
                oth2.push(a);
            }else{
                oth2[findrec].amtval += (a?.amtval);
            }
        })
    })

        setOthDetails(oth2);

    setResult(datas);
  }
// http://nzen/R50B3/UFS/ufs2/orail228FT0OWNGEI6DC3BVS/companylogo/preview_logo/projectlogo.png?ts=638499827768597590 
  return (
    <>
        {
            loader ? <Loader /> : <>
            {
                msg === '' ? <>
                <div className='containerji3'>
                    <div className='d-flex w-100 mt-5 mb-5 end_ji3 d_none_ji3'><Button /></div>
                    <div className='p-1 d-flex justify-content-between align-items-center'>
                        <div>                    
                            <div className='my-3'>*ESTIMATE[SILVER]*</div>
                            <div className='fs_ji3'>JEWELLERY INVOICE</div>
                            <div>{result?.header?.PrintHeadLabel}</div>
                        </div>
                        <div className='img_ji3'><img src={result?.header?.PrintLogo} alt="#clogo" className='clogo_ji3' /></div>
                    </div>
                    <div className='mt-1 brall_ji3  d-flex justify-content-between align-items-start w-100 '>
                        <div className='fs_ji3 fw-bold p-1 w-75'>To, {result?.header?.customerfirmname}</div>
                        <div className='brleft_ji3 w-25'>
                            <div className='fs_ji3 p-1 py-2 brbottom_ji3'>BillNo : <span className='fw-bold '>{result?.header?.InvoiceNo}</span> / No : <span className='fw-bold'>1</span></div>
                            <div className='fs_ji3 p-1 py-2'>Date : <span className='fw-bold'>{result?.header?.DueDate}</span></div>
                        </div>
                    </div>
                    <div>
                        <div className='thead_ji3 brall_ji3 border-top-0 fw-bold fs_ji3'>
                            <div className='col1_ji3 brright_ji3 center_ji3'>Sr</div>
                            <div className='col2_ji3 brright_ji3 center_ji3'>SKU</div>
                            <div className='col3_ji3 brright_ji3 center_ji3'>Gross Weight</div>
                            <div className='col4_ji3 brright_ji3 center_ji3'>Net Weight</div>
                            <div className='col5_ji3 brright_ji3 center_ji3 flex-column'>
                                <div className='center_ji3 brbottom_ji3 w-100'>Diamond/AD</div>
                                <div className='d-flex justify-content-between w-100'>
                                    <div className='brright_ji3 w-50 end_ji3 pe-1'>Pcs</div>
                                    <div className='w-50 end_ji3 pe-1'>Wt</div>
                                </div>
                            </div>
                            <div className='col6_ji3 brright_ji3 center_ji3 flex-column'>
                                <div className='center_ji3 brbottom_ji3 w-100'>Colorstone</div>
                                <div className='d-flex justify-content-between w-100'>
                                    <div className='brright_ji3 w-50 end_ji3 pe-1'>Pcs</div>
                                    <div className='w-50 end_ji3 pe-1'>Wt</div>
                                </div>
                            </div>
                            <div className='col7_ji3  center_ji3 flex-column'>
                                <div className='center_ji3 brbottom_ji3 w-100'>Purity</div>
                                <div className='d-flex justify-content-between w-100'>
                                    <div className='brright_ji3 w-50 start_ji3 ps-1'>Metal</div>
                                    <div className='w-50 start_ji3 ps-1'>Dia.</div>
                                </div>
                            </div>
                        </div>
                        <div className='tbody_ji3'>
                            {
                                result?.resultArray?.map((e, i) => {
                                    return (
                                        <div className='d-flex brright_ji3 brleft_ji3 brbottom_ji3 fs_ji3'>
                                            <div className='col1t_ji3 brright_ji3 center_ji3'>{i+1}</div>
                                            <div className='col2t_ji3 brright_ji3 start_ji3 ps-1'>{e?.designno}</div>
                                            <div className='col3t_ji3 brright_ji3 end_ji3 pe-1'>{e?.grosswt?.toFixed(3)}</div>
                                            <div className='col4t_ji3 brright_ji3 end_ji3 pe-1'>{e?.NetWt?.toFixed(3)}</div>
                                            <div className='col5t_ji3 brright_ji3 center_ji3'>Pcs</div>
                                            <div className='col6t_ji3 brright_ji3 center_ji3'>Wt</div>
                                            <div className='col7t_ji3 brright_ji3 center_ji3'>Pcs</div>
                                            <div className='col8t_ji3 brright_ji3 center_ji3'>Wt</div>
                                            <div className='col9t_ji3 brright_ji3 center_ji3'>Metal</div>
                                            <div className='col10t_ji3  center_ji3'>Dia.</div>
                                        </div>
                                    )
                                })
                            }
                                        <div className='d-flex brright_ji3 brleft_ji3 brbottom_ji3 fw-bold fs_ji3'>
                                            <div className='col1t_ji3 brright_ji3 center_ji3 fw-bold ps-1'>TOTAL</div>
                                            <div className='col2t_ji3 brright_ji3 '></div>
                                            <div className='col3t_ji3 brright_ji3 end_ji3 pe-1'>{result?.mainTotal?.grosswt?.toFixed(3)}</div>
                                            <div className='col4t_ji3 brright_ji3 end_ji3 pe-1'>{result?.mainTotal?.netwt?.toFixed(3)}</div>
                                            <div className='col5t_ji3 brright_ji3 end_ji3 pe-1'>{result?.mainTotal?.diamonds?.Pcs}</div>
                                            <div className='col6t_ji3 brright_ji3 end_ji3 pe-1'>{result?.mainTotal?.diamonds?.Wt?.toFixed(3)}</div>
                                            <div className='col7t_ji3 brright_ji3 end_ji3 pe-1'>{(result?.mainTotal?.colorstone?.Pcs + result?.mainTotal?.misc?.Pcs)}</div>
                                            <div className='col8t_ji3 brright_ji3 end_ji3 pe-1'>{(result?.mainTotal?.colorstone?.Wt + result?.mainTotal?.misc?.Wt)?.toFixed(3)}</div>
                                            <div className='col9t_ji3 brright_ji3 '></div>
                                            <div className='col10t_ji3 '></div>
                                        </div>
                        </div>
                    </div>
                    <div className='mt-3 d-flex justify-content-end '>
                        <div className='w-50 brtop_ji3'>

                            <div className='d-flex brright_ji3 brleft_ji3 brbottom_ji3 fs_ji3 pbia_ji3'>
                                <div className='col1acc_ji3 brright_ji3 start_ji3'>Labour Charge</div>
                                <div className='col2acc_ji3 brright_ji3 end_ji3 pe-1'>2000</div>
                                <div className='col3acc_ji3 brright_ji3 end_ji3 pe-1'>1000</div>
                                <div className='col4acc_ji3 end_ji3 pe-1'>1000</div>
                            </div>
                            {
                                othDetails?.map((e, i) => {
                                    return  <div className='d-flex brright_ji3 brleft_ji3 brbottom_ji3 fs_ji3 pbia_ji3' key={i}>
                                            <div className='col1acc_ji3 brright_ji3'></div>
                                            <div className='col2acc_ji3 brright_ji3 pe-1 end_ji3 '>{e?.label}</div>
                                            <div className='col3acc_ji3 brright_ji3 pe-1 end_ji3 '>{e?.amtval}</div>
                                            <div className='col4acc_ji3 p-1 end_ji3 pe-1'>{e?.amtval}</div>
                                        </div>
                                        })
                            }
                            {
                                result?.resultArray?.map((e, i) => {
                                    return (
                                        <React.Fragment key={i}>
                                        {
                                            e?.diamonds?.map((a, ind) => {
                                                return  <div className='d-flex brright_ji3 brleft_ji3 brbottom_ji3 fs_ji3 pbia_ji3' key={ind}>
                                                    <div className='col1acc_ji3 brright_ji3'></div>
                                                    <div className='col2acc_ji3 brright_ji3 pe-1 end_ji3 '>{a?.Rate}</div>
                                                    <div className='col3acc_ji3 brright_ji3 pe-1 end_ji3 '>{a?.Wt?.toFixed(3)} (ctw)</div>
                                                    <div className='col4acc_ji3 p-1 end_ji3 pe-1'>{a?.Amount}</div>
                                                </div>
                                            })
                                        }
                                        </React.Fragment>
                                    )
                                    
                                        })
                            }
                            {
                                result?.resultArray?.map((e, i2) => {
                                    return (
                                        <React.Fragment key={i2}>
                                        {
                                            e?.colorstone?.map((a, ind) => {
                                                return  <div className='d-flex brright_ji3 brleft_ji3 brbottom_ji3 fs_ji3 pbia_ji3' key={ind}>
                                                    <div className='col1acc_ji3 brright_ji3'></div>
                                                    <div className='col2acc_ji3 brright_ji3 pe-1 end_ji3 '>{a?.Rate}</div>
                                                    <div className='col3acc_ji3 brright_ji3 pe-1 end_ji3 '>{a?.Wt?.toFixed(3)} (ctw)zzzzzz</div>
                                                    <div className='col4acc_ji3 p-1 end_ji3 pe-1'>{a?.Amount}</div>
                                                </div>
                                            })
                                        }
                                        </React.Fragment>
                                    )
                                    
                                        })
                            }
                                {
                                result?.resultArray?.map((e, i2) => {
                                    return (
                                        <React.Fragment key={i2}>
                                        {
                                            e?.misc?.map((a, ind) => {
                                                return  <div className='d-flex brright_ji3 brleft_ji3 brbottom_ji3 fs_ji3 pbia_ji3' key={ind}>
                                                    <div className='col1acc_ji3 brright_ji3'></div>
                                                    <div className='col2acc_ji3 brright_ji3 pe-1 end_ji3 '>{a?.Rate}</div>
                                                    <div className='col3acc_ji3 brright_ji3 pe-1 end_ji3 '>{a?.Wt?.toFixed(3)} (ctw)zzzzzz</div>
                                                    <div className='col4acc_ji3 p-1 end_ji3 pe-1'>{a?.Amount}</div>
                                                </div>
                                            })
                                        }
                                        </React.Fragment>
                                    )
                                    
                                        })
                             }
                                {
                                result?.resultArray?.map((e, i2) => {
                                    return (
                                        <React.Fragment key={i2}>
                                        {
                                            e?.finding?.map((a, ind) => {
                                                return  <div className='d-flex brright_ji3 brleft_ji3 brbottom_ji3 fs_ji3 pbia_ji3' key={ind}>
                                                    <div className='col1acc_ji3 brright_ji3'></div>
                                                    <div className='col2acc_ji3 brright_ji3 pe-1 end_ji3 '>{a?.Rate}</div>
                                                    <div className='col3acc_ji3 brright_ji3 pe-1 end_ji3 '>{a?.Wt?.toFixed(3)} (ctw)</div>
                                                    <div className='col4acc_ji3 p-1 end_ji3 pe-1'>{a?.Amount}</div>
                                                </div>
                                            })
                                        }
                                        </React.Fragment>
                                    )
                                    
                                        })
                                }
                                                <div className='d-flex brright_ji3 brleft_ji3 brbottom_ji3 fs_ji3'>
                                                    <div className='col1acc_ji3 brright_ji3 start_ji3 ps-1'>Discount :</div>
                                                    <div className='col2acc_ji3 brright_ji3 pe-1 end_ji3 '></div>
                                                    <div className='col3acc_ji3 brright_ji3 pe-1 end_ji3 '></div>
                                                    <div className='col4acc_ji3 p-1 end_ji3 pe-1'>{formatAmount(result?.mainTotal?.total_discount_amount)}</div>
                                                </div>
                                                {
                                                    result?.allTaxes?.map((e, i) => {
                                                        return <div className='d-flex brright_ji3 brleft_ji3 brbottom_ji3 fs_ji3'>
                                                        <div className='col1acc_ji3 brright_ji3 start_ji3 ps-1'>{e?.name} @ {e?.per}</div>
                                                        <div className='col2acc_ji3 brright_ji3 pe-1 end_ji3 '></div>
                                                        <div className='col3acc_ji3 brright_ji3 pe-1 end_ji3 '></div>
                                                        <div className='col4acc_ji3 p-1 end_ji3 pe-1'>{formatAmount(e?.amount)}</div>
                                                    </div>
                                                    })
                                                }
                                                <div className='d-flex brright_ji3 brleft_ji3 brbottom_ji3 fs_ji3'>
                                                    <div className='col1acc_ji3 brright_ji3 start_ji3 ps-1'>{result?.header?.AddLess > 0 ? 'Add' : 'Less'}</div>
                                                    <div className='col2acc_ji3 brright_ji3 pe-1 end_ji3 '></div>
                                                    <div className='col3acc_ji3 brright_ji3 pe-1 end_ji3 '></div>
                                                    <div className='col4acc_ji3 p-1 end_ji3 pe-1'>{formatAmount(result?.header?.AddLess)}</div>
                                                </div>
                                                <div className='d-flex brright_ji3 brleft_ji3 brbottom_ji3 fs_ji3'>
                                                    <div className='col1acc_ji3 brright_ji3 start_ji3 ps-1'>Total</div>
                                                    <div className='col2acc_ji3 brright_ji3 pe-1 end_ji3 '></div>
                                                    <div className='col3acc_ji3 brright_ji3 pe-1 end_ji3 '></div>
                                                    <div className='col4acc_ji3 p-1 end_ji3 pe-1'>{formatAmount(result?.mainTotal?.total_amount)}</div>
                                                </div>
                           
                        </div>
                    </div>
                    <div className='mt-2 p-1 brall_ji3 fs_ji3 d-flex align-items-center pbia_ji3'>
                        <div className='fw-bold text-decoration-underline'>Remark :</div>
                        <div className='px-2' dangerouslySetInnerHTML={{__html:result?.header?.PrintRemark}}></div>
                    </div>
                    <div className='d-flex mt-2 fs_ji3 justify-content-between align-items-center pbia_ji3'>
                        <div className='d-flex w-50'><div>Receiver's Signature : </div><div className='w-25 border-black border-bottom'></div></div>
                        <div className='d-flex justify-content-end w-50'><div>Sign:</div><div className='w-25 border-bottom border-black'></div></div>
                    </div>
                </div>
                </> :  <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
                {msg}
              </p>
            }
            </>
        }
    </>
  )
}

export default JewelleryInvoice3