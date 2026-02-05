// misc detail print 1 , misc detail print 2, estimation print
import React from 'react'
import "../../assets/css/salesprint/saleprint13.css";
import { useState } from 'react';
import { useEffect } from 'react';
import { apiCall, checkMsg, formatAmount, handleImageError, isObjectEmpty } from '../../GlobalFunctions';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import Loader from '../../components/Loader';
import Button from '../../GlobalFunctions/Button';

const MiscDetailPrint = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {

  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const [imgFlag, setImgFlag] = useState(true);

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

    setResult(datas);

  }

  const handleCheckbox = () => {
    if (imgFlag) {
      setImgFlag(false);
    } else {
      setImgFlag(true);
    }
  };

  return (
    <div>
        {
            loader ? <Loader /> : <>
            {
                msg === '' ? <div className='container_mdp'>
                    <div className='d-flex justify-content-end align-items-center mt-5 mb-5'>
                        <div><input type="checkbox" id="imghideshow" className="mx-1" checked={imgFlag} onChange={handleCheckbox} />
                             <label htmlFor="imghideshow" className="me-3 user-select-none"> With Image </label>
                        </div>
                        <div><Button /></div>
                    </div>
                    <div className='headline_mdp'>{result?.header?.PrintHeadLabel}</div>
                    <div className='d-flex justify-content-between align-items-center p-1 w-100 fs_11_mdp'>
                        <div style={{width:'70%'}}>
                            <div>To</div>
                            <div>{result?.header?.customerfirmname}</div>
                        </div>
                        <div className='fs_11_mdp' style={{width:'30%'}}>
                            <div className='d-flex w-75'><div className='w-25'>Invoice# :</div><div className='w-50 d-flex justify-content-end fw-bold'>{result?.header?.InvoiceNo}</div></div>
                            <div className='d-flex w-75'><div className='w-25'>Date : </div><div className='w-50 d-flex justify-content-end fw-bold'>{result?.header?.EntryDate}</div></div>
                        </div>
                    </div>
                    <div className='table_mdp'>
                        <div className='d-flex thead_mdp fs_11_mdp'>
                            <div className='col1_mdp center_mdp br_right_mdp'>Sr</div>
                            <div className='col2_mdp center_mdp br_right_mdp'>Design</div>
                            <div className='col3_mdp center_mdp flex-column br_right_mdp'>
                                <div className='w-100 center_mdp br_bottom_mdp'>Metal</div>
                                <div className='w-100 d-flex'>
                                    <div className='col3_1_mdp center_mdp br_right_mdp'>Quality</div>
                                    <div className='col3_2_mdp center_mdp br_right_mdp'>G Wt</div>
                                    <div className='col3_3_mdp center_mdp br_right_mdp'>N + L</div>
                                    <div className='col3_4_mdp center_mdp br_right_mdp'>Rate</div>
                                    <div className='col3_5_mdp center_mdp'>Amount</div>
                                </div>
                            </div>
                            <div className='col4_mdp center_mdp flex-column br_right_mdp'>
                                <div className='w-100 center_mdp br_bottom_mdp'>Misc</div>
                                <div className='d-flex w-100'>
                                    <div className='col4_1_mdp center_mdp br_right_mdp'>Pcs</div>
                                    <div className='col4_2_mdp center_mdp br_right_mdp'>Wt</div>
                                    <div className='col4_3_mdp center_mdp br_right_mdp'>Rate</div>
                                    <div className='col4_4_mdp center_mdp '>Amount</div>
                                </div>
                            </div>
                            <div className='col5_mdp center_mdp flex-column br_right_mdp'>
                                <div className='center_mdp w-100 br_bottom_mdp'>Stone</div>
                                <div className='d-flex w-100'>
                                    <div className='col5_1_mdp center_mdp br_right_mdp'>Type</div>
                                    <div className='col5_2_mdp center_mdp br_right_mdp'>Pcs</div>
                                    <div className='col5_3_mdp center_mdp br_right_mdp'>Wt</div>
                                    <div className='col5_4_mdp center_mdp br_right_mdp'>Rate</div>
                                    <div className='col5_5_mdp center_mdp '>Amount</div>
                                </div>
                            </div>
                            <div className='col6_mdp center_mdp br_right_mdp flex-column'>
                                <span className='w-100 br_bottom_mdp center_mdp'>Other</span>
                                <span className='w-100 center_mdp'>Amount</span>
                            </div>
                            <div className='col7_mdp center_mdp br_right_mdp flex-column'>
                                <div className='w-100 center_mdp br_bottom_mdp'>Labour</div>
                                <div className='d-flex w-100'>
                                    <div style={{width:'40%'}} className='center_mdp br_right_mdp'>Rate</div>
                                    <div style={{width:'60%'}} className='center_mdp'>Amount</div>
                                </div>
                            </div>
                            <div className='col8_mdp flex-column center_mdp text-break'>Total Amount</div>
                        </div>
                        <div>
                            {
                                result?.resultArray?.map((e, i) => {
                                    return <React.Fragment key={i}>
                                    <div className='d-flex fs_11_mdp_2 br_bottom_mdp br_right_mdp_2 br_left_mdp_2'>
                                        <div className='col1_mdp br_right_mdp d-flex justify-content-center align-items-start'>{i+1}</div>
                                        <div className='col2_mdp br_right_mdp'>
                                            <div className='d-flex justify-content-between text-break'>
                                                <div className='ps-1'>{e?.designno}</div>
                                                <div className='pe-1'>{e?.SrJobno}</div>
                                            </div>
                                            <div className='d-flex justify-content-center align-items-center'>
                                                <img src={e?.DesignImage} alt="#" onError={(e) => handleImageError(e)} className='img_mdp' />
                                            </div>
                                            <div className='d-flex justify-content-center align-items-center'>Tunch : <span className='fw-bold'>{e?.Tunch?.toFixed(3)}</span></div>
                                        </div>
                                        <div className='col3_mdp br_right_mdp'>
                                            <div className='w-100 d-flex'>
                                                <div className='col3_1_mdp ps-1'>{e?.MetalTypePurity}</div>
                                                <div className='col3_2_mdp end_mdp pe-1'>{e?.grosswt?.toFixed(3)}</div>
                                                <div className='col3_3_mdp end_mdp pe-1'>{(e?.NetWt + e?.LossWt)?.toFixed(3)}</div>
                                                <div className='col3_4_mdp end_mdp pe-1'>{formatAmount(e?.metal_rate)}</div>
                                                <div className='col3_5_mdp end_mdp pe-1'>{formatAmount(e?.MetalAmount)}</div>
                                            </div>
                                            {
                                                e?.JobRemark === '' ? '' : <div className='br_top_mdp mt-4 p-1'>
                                                    <div>Remark:</div>
                                                    <div className='fw-bold'>{e?.JobRemark}</div>
                                                </div>
                                            }
                                        </div>
                                        <div className='col4_mdp br_right_mdp'>
                                            {
                                                e?.misc?.map((e, i) => {
                                                    return <div className='d-flex w-100' key={i}>
                                                    <div className='col4_1_mdp end_mdp pe-1'>{e?.Pcs}</div>
                                                    <div className='col4_2_mdp end_mdp pe-1'>{e?.Wt?.toFixed(3)}</div>
                                                    <div className='col4_3_mdp end_mdp pe-1'>{formatAmount(e?.Rate)}</div>
                                                    <div className='col4_4_mdp end_mdp pe-1'>{formatAmount(e?.Amount)}</div>
                                                </div>
                                                })
                                            }
                                        </div>
                                        <div className='col5_mdp br_right_mdp'>
                                            {
                                                e?.colorstone?.map((e, i) => {
                                                    return <div className='d-flex w-100' key={i}>
                                                    <div className='col5_1_mdp'>{e?.ShapeName}</div>
                                                    <div className='col5_2_mdp end_mdp pe-1'>{e?.Pcs}</div>
                                                    <div className='col5_3_mdp end_mdp pe-1'>{e?.Wt?.toFixed(3)}</div>
                                                    <div className='col5_4_mdp end_mdp pe-1'>{formatAmount(e?.Rate)}</div>
                                                    <div className='col5_5_mdp end_mdp pe-1'>{formatAmount(e?.Amount)}</div>
                                                </div>
                                                })
                                            }
                                        </div>
                                        <div className='col6_mdp br_right_mdp end_mdp_2 pe-1'>{formatAmount((e?.OtherCharges + e?.TotalDiamondHandling))}</div>
                                        <div className='col7_mdp br_right_mdp'>
                                            <div className='d-flex w-100'>
                                                <div style={{width:'40%'}} className='pe-1 end_mdp'>{formatAmount(e?.MaKingCharge_Unit)}</div>
                                                <div style={{width:'60%'}} className='pe-1 end_mdp'>{formatAmount(e?.MakingAmount)}</div>
                                            </div>
                                        </div>
                                        <div className='col8_mdp end_mdp_2 pe-1'>
                                            {formatAmount(e?.TotalAmount)}
                                        </div>
                                    </div>
                                    <div className='d-flex fs_11_mdp_2 br_bottom_mdp br_right_mdp_2 br_left_mdp_2 fw-bold'>
                                        <div className='col1_mdp br_right_mdp'></div>
                                        <div className='col2_mdp br_right_mdp'></div>
                                        <div className='col3_mdp br_right_mdp bg_clr'>
                                            <div className='w-100 d-flex'>
                                                <div className='col3_1_mdp'></div>
                                                <div className='col3_2_mdp end_mdp pe-1'>{e?.grosswt?.toFixed(3)}</div>
                                                <div className='col3_3_mdp end_mdp pe-1'>{(e?.NetWt + e?.LossWt)?.toFixed(3)}</div>
                                                <div className='col3_4_mdp'></div>
                                                <div className='col3_5_mdp end_mdp pe-1'>{formatAmount(e?.MetalAmount)}</div>
                                            </div>
                                        </div>
                                        <div className='col4_mdp br_right_mdp bg_clr'>
                                            <div className='d-flex w-100'>
                                                <div className='col4_1_mdp end_mdp pe-1'>{e?.totals?.misc?.Pcs === 0 ? '' : e?.totals?.misc?.Pcs}</div> 
                                                <div className='col4_2_mdp end_mdp pe-1'>{e?.totals?.misc?.Wt === 0 ? '' : e?.totals?.misc?.Wt?.toFixed(3)}</div>
                                                <div className='col4_3_mdp'></div>
                                                <div className='col4_4_mdp end_mdp pe-1'>{e?.totals?.misc?.Amount === 0 ? '' : formatAmount(e?.totals?.misc?.Amount)}</div>
                                            </div>
                                        </div>
                                    <div className='col5_mdp br_right_mdp bg_clr'>
                                        <div className='d-flex w-100'>
                                            <div className='col5_1_mdp'></div>
                                            <div className='col5_2_mdp end_mdp pe-1'>{e?.totals?.colorstone?.Pcs === 0 ? '' : e?.totals?.colorstone?.Pcs}</div>
                                            <div className='col5_3_mdp end_mdp pe-1'>{e?.totals?.colorstone?.Wt === 0 ? '' : e?.totals?.colorstone?.Wt?.toFixed(3)}</div>
                                            <div className='col5_4_mdp end_mdp pe-1'></div>
                                            <div className='col5_5_mdp end_mdp pe-1'>{e?.totals?.colorstone?.Amount === 0 ? '' : formatAmount(e?.totals?.colorstone?.Amount)}</div>
                                        </div>
                                    </div>
                                    <div className='col6_mdp br_right_mdp bg_clr end_mdp pe-1'>{(formatAmount(e?.OtherCharges + e?.TotalDiamondHandling))}</div>
                                    <div className='col7_mdp br_right_mdp bg_clr'>
                                        <div className='d-flex w-100'>
                                            <div style={{width:'40%'}} className='end_mdp pe-1'>{formatAmount(e?.MaKingCharge_Unit)}</div>
                                            <div style={{width:'60%'}} className='end_mdp pe-1'>{formatAmount(e?.MakingAmount)}</div>
                                        </div>
                                    </div>
                                    <div className='col8_mdp bg_clr end_mdp pe-1'>
                                            {formatAmount(e?.TotalAmount)}
                                    </div>
                                    </div>
                                    </React.Fragment>
                                })
                            }
    
                            <div className='d-flex flex-column align-items-end fs_11_mdp pe-1 br_right_mdp_2  br_left_mdp_2 w-100'>
                                {
                                    result?.allTaxes?.map((e, i) => {
                                        return <div className='d-flex' style={{width:'19%'}} key={i}><div className='w-50 end_mdp pe-1'>{e?.name} @ {e?.per}</div><div className='w-50 end_mdp'>{e?.amount}</div></div>
                                    })
                                }
                                <div className='d-flex' style={{width:'19%'}} ><div className='w-50 end_mdp pe-1'>{result?.header?.AddLess > 0 ? 'Add' : 'Less'}</div><div className='w-50 end_mdp'>{formatAmount(result?.header?.AddLess)}</div></div>
                            </div>
                            <div className='d-flex fs_11_mdp br_bottom_mdp br_right_mdp_2 br_top_mdp br_left_mdp_2 fw-bold' style={{borderBottom:'1px solid black'}}>
                                <div className='col1_mdp br_right_mdp bg_clr'></div>
                                <div className='col2_mdp center_mdp br_right_mdp bg_clr'>Total</div>
                                <div className='col3_mdp br_right_mdp bg_clr'>
                                    <div className='w-100 d-flex'>
                                        {/* <div className='col3_1_mdp'></div> */}
                                        <div className='col3_2_mdp end_mdp pe-1' style={{width:'40%'}}>{result?.mainTotal?.grosswt?.toFixed(3)}</div>
                                        <div className='col3_3_mdp d-flex ps-1' style={{width:'30%'}}>{(result?.mainTotal?.netwt + result?.mainTotal?.lossWt)?.toFixed(3)}</div>
                                        {/* <div className='col3_4_mdp'></div> */}
                                        <div className='col3_5_mdp end_mdp pe-1'>{formatAmount(result?.mainTotal?.metal?.IsPrimaryMetal_Amount)}</div>
                                    </div>
                                </div>
                                <div className='col4_mdp br_right_mdp bg_clr'>
                                        <div className='d-flex w-100'>
                                            <div className='col4_1_mdp end_mdp pe-1'>{result?.mainTotal?.misc?.Pcs}</div>
                                            <div className='col4_2_mdp end_mdp pe-1'>{result?.mainTotal?.misc?.Wt?.toFixed(3)}</div>
                                            <div className='col4_3_mdp'></div>
                                            <div className='col4_4_mdp end_mdp pe-1'>{formatAmount(result?.mainTotal?.misc?.Amount)}</div>
                                        </div>
                                </div>
                                <div className='col5_mdp br_right_mdp bg_clr'>
                                    <div className='d-flex w-100'>
                                        <div className='col5_1_mdp'></div>
                                        <div className='col5_2_mdp end_mdp pe-1'>{result?.mainTotal?.colorstone?.Pcs}</div>
                                        <div className='col5_3_mdp end_mdp pe-1'>{result?.mainTotal?.colorstone?.Wt?.toFixed(3)}</div>
                                        <div className='col5_4_mdp end_mdp pe-1'></div>
                                        <div className='col5_5_mdp end_mdp pe-1'>{formatAmount(result?.mainTotal?.colorstone?.Amount)}</div>
                                    </div>
                                </div>
                                <div className='col6_mdp br_right_mdp bg_clr end_mdp pe-1'>{formatAmount((result?.mainTotal?.total_other + result?.mainTotal?.total_diamondHandling))}</div>
                                <div className='col7_mdp br_right_mdp bg_clr'>
                                    <div className='d-flex w-100'>
                                        {/* <div style={{width:'40%'}} className='end_mdp pe-1'></div> */}
                                        <div style={{width:'100%'}} className='end_mdp pe-1'>{formatAmount((result?.mainTotal?.total_Making_Amount + result?.mainTotal?.diamonds?.SettingAmount + result?.mainTotal?.colorstone?.SettingAmount))}</div>
                                    </div>
                                </div>
                                <div className='col8_mdp bg_clr end_mdp pe-1'>{formatAmount(result?.mainTotal?.total_amount)}</div>
                            </div>
                            <div className='d-flex fs_11_mdp'>
                                <div className='col1_s_mdp center_mdp br_right_mdp br_bottom_mdp br_left_mdp bg_clr fw-bold'>SUMMARY</div>
                                <div className='col1_o_mdp center_mdp br_right_mdp br_bottom_mdp bg_clr fw-bold'>OTHER DETAILS</div>
                                <div className='col1_r_mdp center_mdp br_right_mdp br_bottom_mdp bg_clr fw-bold'>REMARK</div>
                                <div className=' center_mdp br_right_mdp   fw-bold ' style={{width:'12.5%'}}>&nbsp;</div>
                                <div className=' center_mdp br_right_mdp   fw-bold ' style={{width:'12.5%'}}>&nbsp;</div>
                            </div>
                           <div className='d-flex w-100'>
                                <div className='col1_s_mdp fs_11_mdp d-flex'>
                                    <div className='w-50'>
                                        <div className='d-flex w-100 br_left_mdp br_right_mdp'>
                                            <div className='w-50 ps-1'>GOLD IN 24KT</div>
                                            <div className='w-50 end_mdp pe-1'>0.000 gm</div>
                                        </div>  
                                        <div className='d-flex w-100 br_left_mdp br_right_mdp'>
                                            <div className='w-50'>GROSS WT</div>
                                            <div className='w-50  end_mdp pe-1'>{result?.mainTotal?.grosswt?.toFixed(3)} gm</div>
                                        </div>  
                                        <div className='d-flex w-100 br_left_mdp br_right_mdp'>
                                            <div className='w-50'>NET WT</div>
                                            <div className='w-50  end_mdp pe-1'>{result?.mainTotal?.netwt?.toFixed(3)} gm</div>
                                        </div>  
                                        <div className='d-flex w-100 br_left_mdp br_right_mdp'>
                                            <div className='w-50'>MISC WT</div>
                                            <div className='w-50  end_mdp pe-1'>{result?.mainTotal?.misc?.Pcs} / {result?.mainTotal?.misc?.Wt?.toFixed(3)} gm</div>
                                        </div>  
                                        <div className='d-flex w-100 br_left_mdp br_right_mdp'>
                                            <div className='w-50'>STONE WT</div>
                                            <div className='w-50  end_mdp pe-1'>{result?.mainTotal?.colorstone?.Pcs} / {result?.mainTotal?.colorstone?.Wt?.toFixed(3)} gm</div>
                                        </div>    
                                        <div className='d-flex w-100 br_left_mdp br_right_mdp'>
                                            <div className='w-50'>&nbsp;</div>
                                            <div className='w-50  end_mdp pe-1'></div>
                                        </div>  
                                        <div className='d-flex w-100 br_left_mdp br_right_mdp br_top_mdp br_bottom_mdp bg_clr'>
                                            <div className='w-50'>&nbsp;</div>
                                            <div className='w-50  end_mdp pe-1'></div>
                                        </div>  
                                    </div>
                                    <div className='w-50'>
                                        <div className='d-flex w-100 br_left_mdp br_right_mdp'>
                                            <div className='w-50 ps-1'>GOLD </div>
                                            <div className='w-50 end_mdp pe-1'>{formatAmount(result?.mainTotal?.metal?.IsPrimaryMetal_Amount)} </div>
                                        </div>  
                                        <div className='d-flex w-100 br_left_mdp br_right_mdp'>
                                            <div className='w-50 ps-1'>MISC</div>
                                            <div className='w-50  end_mdp pe-1'>{formatAmount(result?.mainTotal?.misc?.Amount)} </div>
                                        </div>  
                                        <div className='d-flex w-100 br_left_mdp br_right_mdp'>
                                            <div className='w-50  ps-1'>CST</div>
                                            <div className='w-50  end_mdp pe-1'>{formatAmount(result?.mainTotal?.colorstone?.Amount)}</div>
                                        </div>  
                                        <div className='d-flex w-100 br_left_mdp br_right_mdp'>
                                            <div className='w-50 ps-1'>MAKING</div>
                                            <div className='w-50  end_mdp pe-1'>{formatAmount((result?.mainTotal?.total_Making_Amount + result?.mainTotal?.diamonds?.SettingAmount + result?.mainTotal?.colorstone?.SettingAmount))} </div>
                                        </div>  
                                        <div className='d-flex w-100 br_left_mdp br_right_mdp'>
                                            <div className='w-50 ps-1'>OTHER</div>
                                            <div className='w-50  end_mdp pe-1'>{formatAmount((result?.mainTotal?.total_other + result?.mainTotal?.total_diamondHandling))} </div>
                                        </div>  
                                        <div className='d-flex w-100 br_left_mdp br_right_mdp'>
                                            <div className='w-50 ps-1'>Less</div>
                                            <div className='w-50  end_mdp pe-1'>{formatAmount((result?.header?.AddLess))} </div>
                                        </div>  
                                        <div className='d-flex w-100 br_left_mdp br_right_mdp br_bottom_mdp br_top_mdp bg_clr'>
                                            <div className='w-50 ps-1'>TOTAL </div>
                                            <div className='w-50  end_mdp pe-1'>{formatAmount((result?.mainTotal?.total_amount))} </div>
                                        </div>  
                                    </div>
                                </div>
                                <div className='col1_o_mdp fs_11_mdp d-flex flex-column'>
                                {
                                    result?.header?.BrokerageDetails?.map((e, i) => {
                                        return <div key={i} className='d-flex w-100'><div className='w-50 ps-1 fw-bold'>{e?.label}</div><div className='w-50 end_mdp pe-1 br_right_mdp'>{e?.value}</div></div>
                                    })
                                }
                                <div className='d-flex w-100 br_bottom_mdp'><div className='ps-1 w-50 fw-bold'>RATE IN 24KT</div><div className='pe-1 w-50 end_mdp br_right_mdp'>{result?.header?.MetalRate24K}</div></div>
                                </div>
                                <div className='col1_r_mdp fs_11_mdp'>
                                    <div className=' br_bottom_mdp  w-100 px-1' dangerouslySetInnerHTML={{__html:result?.header?.PrintRemark}}>
                                    </div>
                                </div>
                                <div style={{width:'12.5%'}} className=' br_right_mdp br_bottom_mdp br_left_mdp '>
                                    <div className='w-100 box1_mdp'>Created By</div>
                                </div>
                                <div style={{width:'12.5%'}} className=' br_right_mdp br_bottom_mdp  '>
                                <div className='w-100 box1_mdp'>Created By</div>
                                </div>
                           </div>
                           <div className='fs_11_mdp mt-2' style={{color:'grey'}}>**   THIS IS A COMPUTER GENERATED INVOICE AND KINDLY NOTIFY US IMMEDIATELY IN CASE YOU FIND ANY DISCREPANCY IN THE DETAILS OF TRANSACTIONS</div>
                        </div>
                        
                    </div>
                </div> : <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
                {msg}
              </p>
            }
            </>
        }
    </div>
  )
}

export default MiscDetailPrint