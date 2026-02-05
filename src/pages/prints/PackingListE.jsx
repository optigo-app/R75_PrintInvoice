import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { apiCall, checkMsg,  formatAmount,  handleImageError, isObjectEmpty } from '../../GlobalFunctions';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import Loader from '../../components/Loader';
import "../../assets/css/prints/packingliste.css";
import Button from './../../GlobalFunctions/Button';
import { OrganizeInvoicePrintData } from '../../GlobalFunctions/OrganizeInvoicePrintData';
import { cloneDeep } from 'lodash';
import { MetalShapeNameWiseArr } from '../../GlobalFunctions/MetalShapeNameWiseArr';

const PackingListE = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {

  const [priceFlag, setPriceFlag] = useState(true);

  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const [imgFlag, setImgFlag] = useState(true);
  const [isImageWorking, setIsImageWorking] = useState(true);

  const [diaGroupFlag, setDiaGroupFlag] = useState(false);

  const [diamondArr, setDiamondArr] = useState([]);
  const [MetShpWise, setMetShpWise] = useState([]);
  const [notGoldMetalTotal, setNotGoldMetalTotal] = useState(0);
  const [notGoldMetalWtTotal, setNotGoldMetalWtTotal] = useState(0);
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
        console.error(error);
      }
    };
    sendData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diaGroupFlag]);

  const loadData = (data) => {

      let address = data?.BillPrint_Json[0]?.Printlable?.split("\r\n");
      data.BillPrint_Json[0].address = address;
 
      const datas = OrganizeInvoicePrintData(
        data?.BillPrint_Json[0],
        data?.BillPrint_Json1,
        data?.BillPrint_Json2
      );


      datas.header.PrintRemark = (datas.header.PrintRemark)?.replace(/<br\s*\/?>/gi, "");
      

      let finalArr = [];

      datas?.resultArray?.forEach((a) => {
        if(a?.GroupJob === ''){
          finalArr.push(a);
      }else{
        let b = cloneDeep(a);
        let find_record = finalArr.findIndex((el) => el?.GroupJob === b?.GroupJob);
        if(find_record === -1){
          finalArr.push(b);
        }else{
          if(finalArr[find_record]?.GroupJob !== finalArr[find_record]?.SrJobno){
              finalArr[find_record].designno = b?.designno;
              finalArr[find_record].HUID = b?.HUID; 
          }

          finalArr[find_record].grosswt += b?.grosswt;
          finalArr[find_record].NetWt += b?.NetWt;
          finalArr[find_record].LossWt += b?.LossWt;
          finalArr[find_record].TotalAmount += b?.TotalAmount;
          finalArr[find_record].DiscountAmt += b?.DiscountAmt;
          finalArr[find_record].UnitCost += b?.UnitCost;
          finalArr[find_record].MakingAmount += b?.MakingAmount;
          finalArr[find_record].OtherCharges += b?.OtherCharges;
          finalArr[find_record].TotalDiamondHandling += b?.TotalDiamondHandling;
          finalArr[find_record].Quantity += b?.Quantity;
          finalArr[find_record].Wastage += b?.Wastage;

          finalArr[find_record].diamonds = [...finalArr[find_record]?.diamonds, ...b?.diamonds]?.flat();
          finalArr[find_record].colorstone = [...finalArr[find_record]?.colorstone, ...b?.colorstone]?.flat();
          finalArr[find_record].metal = [...finalArr[find_record]?.metal, ...b?.metal]?.flat();
          finalArr[find_record].misc = [...finalArr[find_record]?.misc ,...b?.misc]?.flat();
          finalArr[find_record].misc_0List = [...finalArr[find_record]?.misc_0List ,...b?.misc_0List]?.flat();
          finalArr[find_record].finding = [...finalArr[find_record]?.finding ,...b?.finding]?.flat();
          finalArr[find_record].other_details_array = [...finalArr[find_record]?.other_details_array ,...b?.other_details_array]?.flat();

          finalArr[find_record].other_details_array_amount += b?.other_details_array_amount;

          finalArr[find_record].totals.diamonds.Wt += b?.totals?.diamonds?.Wt;
          finalArr[find_record].totals.diamonds.Pcs += b?.totals?.diamonds?.Pcs;
          finalArr[find_record].totals.diamonds.Amount += b?.totals?.diamonds?.Amount;
          finalArr[find_record].totals.diamonds.SettingAmount += b?.totals?.diamonds?.SettingAmount;

          finalArr[find_record].totals.finding.Wt += b?.totals?.finding?.Wt;
          finalArr[find_record].totals.finding.Rate = b?.totals?.finding?.Rate;
          finalArr[find_record].totals.finding.Pcs += b?.totals?.finding?.Pcs;
          finalArr[find_record].totals.finding.Amount += b?.totals?.finding?.Amount;
          finalArr[find_record].totals.finding.SettingAmount += b?.totals?.finding?.SettingAmount;
          finalArr[find_record].totals.finding.FineWt += b?.totals?.finding?.FineWt;

          finalArr[find_record].totals.colorstone.Wt += b?.totals?.colorstone?.Wt;
          finalArr[find_record].totals.colorstone.Pcs += b?.totals?.colorstone?.Pcs;
          finalArr[find_record].totals.colorstone.Amount += b?.totals?.colorstone?.Amount;
          finalArr[find_record].totals.colorstone.SettingAmount += b?.totals?.colorstone?.SettingAmount;

          finalArr[find_record].totals.misc.Wt += b?.totals?.misc?.Wt;
          finalArr[find_record].totals.misc.Pcs += b?.totals?.misc?.Pcs;
          finalArr[find_record].totals.misc.Amount += b?.totals?.misc?.Amount;
          finalArr[find_record].totals.misc.SettingAmount += b?.totals?.misc?.SettingAmount;

          finalArr[find_record].totals.misc.IsHSCODE_0_amount += b?.totals?.misc?.IsHSCODE_0_amount;
          finalArr[find_record].totals.misc.IsHSCODE_0_pcs += b?.totals?.misc?.IsHSCODE_0_pcs;
          finalArr[find_record].totals.misc.IsHSCODE_0_wt += b?.totals?.misc?.IsHSCODE_0_wt;

          finalArr[find_record].totals.metal.Amount += b?.totals?.metal?.Amount;
          finalArr[find_record].totals.metal.Wt += b?.totals?.metal?.Wt;
          finalArr[find_record].totals.metal.Pcs += b?.totals?.metal?.Pcs;
          // finalArr[find_record].totals.metal.FineWt += b?.totals?.metal?.FineWt;

          finalArr[find_record].totals.metal.IsNotPrimaryMetalAmount += b?.totals?.metal?.IsNotPrimaryMetalAmount;
          finalArr[find_record].totals.metal.IsNotPrimaryMetalPcs += b?.totals?.metal?.IsNotPrimaryMetalPcs;
          finalArr[find_record].totals.metal.IsNotPrimaryMetalSettingAmount += b?.totals?.metal?.IsNotPrimaryMetalSettingAmount;
          finalArr[find_record].totals.metal.IsNotPrimaryMetalWt += b?.totals?.metal?.IsNotPrimaryMetalWt;

          finalArr[find_record].totals.metal.IsPrimaryMetalAmount += b?.totals?.metal?.IsPrimaryMetalAmount;
          finalArr[find_record].totals.metal.IsPrimaryMetalPcs += b?.totals?.metal?.IsPrimaryMetalPcs;
          finalArr[find_record].totals.metal.IsPrimaryMetalSettingAmount += b?.totals?.metal?.IsPrimaryMetalSettingAmount;
          finalArr[find_record].totals.metal.IsPrimaryMetalWt += b?.totals?.metal?.IsPrimaryMetalWt;

        }
      }
      })
  
      datas.resultArray = finalArr;

        let darr = [];
        let darr2 = [];
        let darr3 = [];
        let darr4 = [];

      datas?.resultArray?.forEach((e) => {
        let met2 = [];
        e?.metal?.forEach((a) => {
          if(e?.GroupJob !== ''){
            let obj = {...a};
            obj.GroupJob = e?.GroupJob;
            met2?.push(obj);
          }
        })
        
        let met3 = [];
        met2?.forEach((a) => {
          let findrec = met3?.findIndex((el) => (el?.StockBarcode === el?.GroupJob))
          if(findrec === -1){
            met3?.push(a);
          }else{
            met3[findrec].Wt += a?.Wt;
          }
        })

        if(e?.GroupJob === ''){
          return 
        }else{
          e.metal = met3;
        }

        

  

      });


      datas?.json2?.forEach((el) => {
        if(el?.MasterManagement_DiamondStoneTypeid === 1){

            if((el?.ShapeName?.toLowerCase() === 'rnd')){
                darr.push(el)
            }else{
                darr2.push(el);
            }
        }
      })


      setResult(datas);

      darr?.forEach((a) => {
        let aobj = cloneDeep(a);
        let findrec = darr3?.findIndex((al) => al?.ShapeName === aobj?.ShapeName && al?.Colorname === aobj?.Colorname && al?.QualityName === aobj?.QualityName)
        if(findrec === -1){
            darr3.push(aobj);
        }else{
            darr3[findrec].Wt += a?.Wt;
            darr3[findrec].Pcs += a?.Pcs;
        }
      });


      let obj_ = {
        ShapeName : 'OTHERS',
        QualityName : '',
        Colorname : '',
        Wt:0,
        Pcs:0,
      }
      darr2?.forEach((a) => {
        obj_.Wt += a?.Wt;
        obj_.Pcs += a?.Pcs;
      })
      darr4 = [...darr3, obj_];

      setDiamondArr(darr4);

      let met_shp_arr = MetalShapeNameWiseArr(datas?.json2);
      
      setMetShpWise(met_shp_arr);
      let tot_met = 0;
      let tot_met_wt = 0;
      met_shp_arr?.forEach((e, i) => {
        tot_met += e?.Amount;
        tot_met_wt += e?.metalfinewt;
      })    
      setNotGoldMetalTotal(tot_met);
      setNotGoldMetalWtTotal(tot_met_wt);


      if(diaGroupFlag){ 
      datas?.resultArray?.forEach((e) => {
        let dia2 = [];
        let dia1_ = [];
        let dia2_ = [];
        e?.diamonds?.forEach((el) => {
            if(el?.GroupName === ''){
              dia1_.push(el);
            }else{
              dia2_.push(el);
            }
        })
        let dia1_g = [];
        dia1_?.forEach((ell) => {
          let bll = cloneDeep(ell);
            let findrec = dia1_g.findIndex((a) => a?.ShapeName === bll?.ShapeName  && a?.SizeName === bll?.SizeName)
            if(findrec === -1){
              dia1_g.push(bll);
            }else{
                dia1_g[findrec].Wt += bll?.Wt;
                dia1_g[findrec].Pcs += bll?.Pcs;
                dia1_g[findrec].Amount += bll?.Amount;
              
            }
        });
        let dia2_g = [];
        dia2_?.forEach((ell) => {
          let bll = cloneDeep(ell);
            let findrec = dia2_g.findIndex((a) => a?.ShapeName === bll?.ShapeName  && a?.GroupName === bll?.GroupName)
            if(findrec === -1){
              dia2_g.push(bll);
            }else{
                dia2_g[findrec].Wt += bll?.Wt;
                dia2_g[findrec].Pcs += bll?.Pcs;
                dia2_g[findrec].Amount += bll?.Amount;
                
            }
        });
        let dia2_g_ = [];
        dia2_g?.forEach((e) => {
          e.SizeName = e?.GroupName;
          dia2_g_.push(e);
        })
        dia2 = [...dia1_g, ...dia2_g_];

        e.diamonds = dia2;
      })
    }


  }

  const handleImgShow = (e) => {
    if (imgFlag) setImgFlag(false);
    else {
      setImgFlag(true);
    }
  };
  const handlePriceShow = (e) => {
    if (priceFlag) setPriceFlag(false);
    else {
      setPriceFlag(true);
    }
  };
  const handleDiaGroupShow = (e) => {
    if (diaGroupFlag) setDiaGroupFlag(false);
    else {
      setDiaGroupFlag(true);
    }
  };

  const handleImageErrors = () => {
    setIsImageWorking(false);
  };
  return (
    <>
    { loader ? <Loader /> : msg === '' ? <div>
        <div className='container_pcls'>
            {/* print btn and flag */}
            <div className=' d-flex align-items-center justify-content-end my-5 whole_none_pcl3'>
                <div className='px-2'>
                    <input type="checkbox" onChange={handleDiaGroupShow} value={diaGroupFlag} checked={diaGroupFlag} id='diaGroupShow' />
                    <label htmlFor="diaGroupShow" className='user-select-none mx-1'>With Diamond Groupwise</label>
                </div>
                <div className='px-2'>
                    <input type="checkbox" onChange={handlePriceShow} value={priceFlag} checked={priceFlag} id='priceShow' />
                    <label htmlFor="priceShow" className='user-select-none mx-1'>With Price</label>
                </div>
                <div className='px-2'>
                    <input type="checkbox" onChange={handleImgShow} value={imgFlag} checked={imgFlag} id='imgshow' />
                    <label htmlFor="imgshow" className='user-select-none mx-1'>With Image</label>
                </div>
                <div>
                    <Button />
                </div>
            </div>
            {/* print head text */}
            <div className='headText_pcls'>
                 {result?.header?.PrintHeadLabel ?? 'PACKING LIST'} 
            </div>
            {/* comapny header */}
            <div className='d-flex justify-content-between align-items-center px-1 com_fs_pcl3'>
                <div>
                    {/* <div className='fs_16_pcls fw-bold py-1'>{result?.header?.CompanyFullName}</div> */}
                    <div>{result?.header?.CompanyAddress}</div>
                    <div>{result?.header?.CompanyAddress2}</div>
                    <div>{result?.header?.CompanyCity}-{result?.header?.CompanyPinCode},{result?.header?.CompanyState}({result?.header?.CompanyCountry})</div>
                    <span className='d-flex align-items-center'>{ result?.header?.CompanyTellNo && <div>M {result?.header?.CompanyTellNo}</div>} &nbsp;|&nbsp; {result?.header?.CompanyTollFreeNo && <div>T {result?.header?.CompanyTollFreeNo}</div>}</span>
                    <div>{result?.header?.CompanyEmail} | {result?.header?.CompanyWebsite}</div>
                </div>
                <div>
                    { isImageWorking && <img src={result?.header?.PrintLogo} alt="#companylogo" className='companylogo_pcls' onError={handleImageErrors} />}
                </div>
            </div>
            {/* customer header */}
            <div className='d-flex  mt-1 brall_pcls brall_pcls '>
                <div className='bright_pcls p-1 com_fs_pcl3' style={{width:'35%'}}>
                    <div>{result?.header?.lblBillTo}</div>
                    <div className='fs_14_pcls fw-bold'>{result?.header?.customerfirmname}</div>
                    <div>{result?.header?.customerAddress2}</div>
                    <div>{result?.header?.customerAddress1}</div>
                    <div>{result?.header?.customercity1}{result?.header?.customerpincode}</div>
                    <div>{result?.header?.customeremail1}</div>
                    <div>{result?.header?.vat_cst_pan}</div>
                    <div>{result?.header?.Cust_CST_STATE}-{result?.header?.Cust_CST_STATE_No}</div>
                </div>
                <div className='bright_pcls p-1 com_fs_pcl3' style={{width:'35%'}}>
                    <div>Ship To,</div>
                    <div className='fs_14_pcls fw-bold'>{result?.header?.customerfirmname}</div>
                    {
                      result?.header?.address?.map((e, i) => {
                        return <div key={i}>{e}</div>
                      })
                    }
                </div>
                <div className='p-1 com_fs_pcl3 d-flex flex-column justify-content-between' style={{width:'30%'}}>
                    <div>
                        <div className='d-flex align-items-center'><div className='fw-bold billbox_pcls fs_head'>BILL NO </div><div className='fs_head fw-bold text-decoration-underline'>{result?.header?.InvoiceNo}</div></div>
                        <div className='d-flex align-items-center'><div className='fw-bold billbox_pcls fs_head'>DATE </div><div className='fs_head'>{result?.header?.EntryDate}</div></div>
                    </div>
                    <div className='fw-bold pb-2'>
                        Gold 24K Rate : {formatAmount(result?.header?.MetalRate24K)}
                    </div>
                </div>
            </div>
            {/* table */}
            <div className='mt-1 '>
                {/* table head */}
                <div className='d-flex thead_pcls bbottom_pcls tb_fs_pcls' style={{borderTop:'1px solid black', borderLeft:'1px solid black', borderRight:'1px solid black'}}>
                    <div className='col1_pcls centerall_pcls bright_pcls'>Sr</div>
                    <div className='col2_pcls centerall_pcls bright_pcls'>Design</div>
                    <div className='col4_pcls bright_pcls'>
                        <div className='w-100 centerall_pcls bbottom_pcls'>Metal</div>
                        <div className='d-flex w-100'>
                            <div className='mcol1_pcls centerall_pcls bright_pcls'>Quality</div>
                            <div className='mcol1_pcls centerall_pcls bright_pcls'>Gwt</div>
                            <div className='mcol1_pcls centerall_pcls bright_pcls'>NetWt</div>
                            <div className='mcol1_pcls centerall_pcls bright_pcls'>FineWt</div>
                            <div className='mcol1_pcls centerall_pcls bright_pcls'>Rate</div>
                            <div className='mcol1_pcls centerall_pcls '>Amount</div>
                        </div>
                    </div>
                    <div className='col3_pcls bright_pcls'>
                        <div className='w-100 centerall_pcls bbottom_pcls'>Diamond</div>
                        <div className='d-flex w-100'>
                            <div className='dcol1_pcls centerall_pcls bright_pcls'>Code</div>
                            <div className='dcol2_pcls centerall_pcls bright_pcls'>Size</div>
                            <div className='dcol3_pcls centerall_pcls bright_pcls'>Pcs</div>
                            <div className='dcol4_pcls centerall_pcls bright_pcls'>Wt</div>
                            <div className='dcol5_pcls centerall_pcls bright_pcls'>Rate</div>
                            <div className='dcol6_pcls centerall_pcls'>Amount</div>
                        </div>
                    </div>

                    <div className='col5_pcls bright_pcls'>
                        <div className='w-100 centerall_pcls bbottom_pcls'>Stone & Misc</div>
                        <div className='d-flex w-100'>
                            <div className='dcol1_pcls centerall_pcls bright_pcls'>Code</div>
                            <div className='dcol2_pcls centerall_pcls bright_pcls'>Size</div>
                            <div className='dcol3_pcls centerall_pcls bright_pcls'>Pcs</div>
                            <div className='dcol4_pcls centerall_pcls bright_pcls'>Wt</div>
                            <div className='dcol5_pcls centerall_pcls bright_pcls'>Rate</div>
                            <div className='dcol6_pcls centerall_pcls'>Amount</div>
                        </div>
                    </div>
                    <div className='col6_pcls bright_pcls'>
                        <div className='centerall_pcls w-100 bbottom_pcls'>Labour & Other Charges</div>
                        <div className='d-flex w-100'>
                            <div className='lcol1_pcls centerall_pcls bright_pcls'>Charges</div>
                            <div className='lcol1_pcls centerall_pcls bright_pcls'>Rate</div>
                            <div className='lcol1_pcls centerall_pcls'>Amount</div>
                        </div>
                    </div>
                    <div className='col7_pcls centerall_pcls'>Total Amount</div>
                </div>
                {/* table rows */}
                {
                    result?.resultArray?.map((e, i) => {
                        return (
                            <div className='d-flex tbody_pcls bbottom_pcls tb_fs_pcls pbia_pcl3 border-top' style={{borderLeft:'1px solid black', borderRight:'1px solid black'}} key={i}>
                                <div className='col1_pcls d-flex justify-content-center align-items-start bright_pcls pt-1'>{i+1}</div>
                                <div className='col2_pcls start_top_pcls flex-column bright_pcls pt-1'>
                                    <div className='d-flex flex-wrap justify-content-between align-items-center w-100 text-break pdl_pcls pdr_pcls'>
                                        <div>{e?.designno}</div>
                                        <div className='fw-bold text-decoration-underline'>{e?.SrJobno}</div>
                                    </div>
                                    {imgFlag ? (
                                    <div>
                                        <img src={e?.DesignImage} onError={(e) => handleImageError(e)} alt="design" className='designimg_pcls' />
                                    </div>
                                    ) : (
                                    ""
                                    )}
                                    {/* {(e?.MetalPurity || e?.MetalColor) !== '' && <div className='centerall_pcls text-break w-100 fw-bold'>{e?.MetalPurity}&nbsp;{e?.MetalColor}</div>} */}
                                    { e?.CertificateNo !== '' && <div className='centerall_pcls text-break w-100'>Certificate# : <span className='fw-bold'>{e?.CertificateNo}</span></div>}
                                    { e?.HUID !== '' && <div className='centerall_pcls w-100 text-break'>HUID : <span className='fw-bold'>{e?.HUID}</span></div>}
                                    <div className='d-flex align-items-center w-100  btop_pcls' style={{backgroundColor:'#F5F5F5'}}>
                                    { e?.PO !== '' && <div className='centerall_pcls w-100 fw-bold text-break'>Ur Ref : {e?.PO}</div>}&nbsp;
                                    { e?.Size !== '' && <div className='centerall_pcls w-100 text-break'><span className=''>Size : {e?.Size}</span></div>}
                                    </div>
                                    {/* { e?.lineid !== '' && <div className='centerall_pcls w-100 text-break'>{e?.lineid}</div>} */}
                                    
                                </div>

                                <div className='col4_pcls  d-flex flex-column justify-content-between bright_pcls'>
                                  <div>
                                  {
                                    e?.metal?.map((el, ind) => {
                                        return (
                                            <div className='d-flex w-100' key={ind}>
                                                <div className='mcol1_pcls start_center_pcls pdl_pcls text-break'>{ el?.ShapeName} </div>
                                                <div className='mcol1_pcls pcle_center  pdr_pcls'>{ el?.IsPrimaryMetal === 1 && e?.grosswt?.toFixed(3)}</div>
                                                <div className='mcol1_pcls pcle_center pdr_pcls'>{ el?.IsPrimaryMetal === 1 ? ((e?.NetWt - e?.finding_customer_wt) + e?.LossWt )?.toFixed(3) : el?.Wt?.toFixed(3)}</div>
                                                <div className='mcol1_pcls pcle_center pdr_pcls'>{ el?.IsPrimaryMetal === 1 && (e?.PureNetWt)?.toFixed(3)}</div>
                                                <div className='mcol1_pcls pcle_center pdr_pcls'>{ priceFlag && <>{ el?.Rate !==0 && Math.round(el?.Rate)}</>}</div>
                                                <div className='mcol1_pcls end_pcls pdr_pcls fw-bold'>
                                                  
                                                  { el?.IsPrimaryMetal === 1 ? <> { priceFlag && 
                                                    Math.round(   
                                                      el?.Rate * ((e?.NetWt - e?.finding_customer_wt) + e?.LossWt)    
                                                    )
                                                  }</> :  priceFlag && formatAmount((el?.Wt * el?.Rate))}
                                                </div>
                                            </div>
                                        )
                                    })
                                  }
                                  <div>{e?.MetalPurity} {e?.MetalColor}</div>

                                            { e?.JobRemark !== '' && <div className=' w-100 pt-2'>
                                                <div className='ps-1 start_center_pcls '>Remark :</div>
                                                <div className='ps-1 fw-bold start_center_pcls '>{e?.JobRemark}</div>
                                            </div>}
                                    </div>
                                          
                                            <div className='d-flex w-100 btop_pcls bg_pcls fw-bold'>
                                                <div className='mcol1_pcls '>&nbsp;</div>
                                                <div className='mcol1_pcls pcle_center pdr_pcls'>{ e?.grosswt !== 0 && e?.grosswt?.toFixed(3)}</div>
                                                <div className='mcol1_pcls pcle_center pdr_pcls'>{ (e?.NetWt + e?.LossWt) !== 0 && (e?.NetWt + e?.LossWt)?.toFixed(3)}</div>
                                                <div className='mcol1_pcls pcle_center pdr_pcls'>{ (e?.PureNetWt )?.toFixed(3)}</div>
                                                <div className='mcol1_pcls end_pcls pdr_pcls' style={{width:'33.33%'}}>{ priceFlag && ( e?.LossAmt + e?.totals?.metal?.Amount + e?.totals?.finding?.Amount) !== 0 && Math.round(((e?.totals?.metal?.Amount + e?.totals?.finding?.Amount + e?.LossAmt) / result?.header?.CurrencyExchRate))}</div>
                                            </div>
                                </div>

                                <div className='col3_pcls d-flex flex-column justify-content-between bright_pcls'>
                                    <div>
                                    {
                                        e?.diamonds?.map((el, ind) => {
                                            return (
                                                <div className='d-flex w-100' key={ind}>
                                                    <div className='dcol1_pcls start_center_pcls pdl_pcls'>{el?.ShapeName }</div>
                                                    <div className='dcol2_pcls start_center_pcls pdl_pcls'>{el?.SizeName}</div>
                                                    <div className='dcol3_pcls pcle_center pdr_pcls'>{el?.Pcs}</div>
                                                    <div className='dcol4_pcls pcle_center pdr_pcls'>{el?.Wt?.toFixed(3)}</div>
                                                    <div className='dcol5_pcls pcle_center pdr_pcls'>{ priceFlag && (el?.Rate)}</div>
                                                    <div className='dcol6_pcls end_pcls pdr_pcls fw-bold'>{ priceFlag && <>{ el?.Amount !== 0 && Math.round((el?.Amount / result?.header?.CurrencyExchRate))}</>}</div>
                                                </div>
                                            )
                                        })
                                    }
                                    </div>
                                                <div className='d-flex w-100 btop_pcls bg_pcls fw-bold'>
                                                    <div className='dcol1_pcls'>&nbsp;</div>
                                                    <div className='dcol2_pcls'></div>
                                                    <div className='dcol3_pcls pcle_center pdr_pcls'>{e?.totals?.diamonds?.Pcs !== 0 && e?.totals?.diamonds?.Pcs}</div>
                                                    <div className='dcol4_pcls pcle_center pdr_pcls'>{ e?.totals?.diamonds?.Wt !== 0 && e?.totals?.diamonds?.Wt?.toFixed(3)}</div>
                                                    <div className='end_pcls pdr_pcls' style={{width:'37%'}}>{ priceFlag && <>{ e?.totals?.diamonds?.Amount !== 0 && Math.round((e?.totals?.diamonds?.Amount / result?.header?.CurrencyExchRate))}</>}</div>
                                                </div>
                                </div>



                                <div className='col5_pcls  d-flex flex-column justify-content-between bright_pcls'>
                                   <div>
                                        {
                                            e?.colorstone?.map((el, ind) => {
                                                return (
                                                    <div className='d-flex w-100' key={ind}>
                                                        <div className='dcol1_pcls start_center_pcls pdl_pcls'>{el?.ShapeName}</div>
                                                        <div className='dcol2_pcls pcle_center pdl_pcls'>{el?.SizeName}</div>
                                                        <div className='dcol3_pcls pcle_center pdr_pcls'>{el?.Pcs}</div>
                                                        <div className='dcol4_pcls pcle_center pdr_pcls'>{el?.Wt?.toFixed(3)}</div>
                                                        <div className='dcol5_pcls pcle_center pdr_pcls'>{ priceFlag && (el?.Rate)}</div>
                                                        <div className='dcol6_pcls end_pcls pdr_pcls fw-bold'>{ priceFlag && <>{ el?.Amount !== 0 && Math.round((el?.Amount / result?.header?.CurrencyExchRate))}</>}</div>
                                                    </div>
                                                )
                                            })
                                        }
                                        {
                                            e?.misc_0List?.map((el, ind) => {
                                                    return (
                                                        <div className='d-flex w-100' key={ind}>
                                                            <div className='dcol1_pcls start_center_pcls pdl_pcls'>{el?.ShapeName?.length !== 0 && 'M : '}{el?.ShapeName}</div>
                                                            <div className='dcol2_pcls pcle_center pdl_pcls'>{el?.SizeName}</div>
                                                            <div className='dcol3_pcls pcle_center pdr_pcls'>{el?.Pcs}</div>
                                                            <div className='dcol4_pcls pcle_center pdr_pcls'>{el?.Wt?.toFixed(3)}</div>
                                                            <div className='dcol5_pcls pcle_center pdr_pcls'>{ priceFlag && (el?.Rate)}</div>
                                                            <div className='dcol6_pcls end_pcls pdr_pcls fw-bold'>{ priceFlag && <>{ el?.Amount !== 0 && Math.round((el?.Amount / result?.header?.CurrencyExchRate))}</>}</div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                                <div className='d-flex w-100 btop_pcls bg_pcls fw-bold'>
                                                    <div className='dcol1_pcls'>&nbsp;</div>
                                                    <div className='dcol2_pcls'></div>
                                                    <div className='dcol3_pcls pcle_center pdr_pcls'>{( e?.totals?.misc?.IsHSCODE_0_pcs + e?.totals?.colorstone?.Pcs) !== 0 &&  ( e?.totals?.misc?.IsHSCODE_0_pcs + e?.totals?.colorstone?.Pcs)}</div>
                                                    <div className='dcol4_pcls pcle_center pdr_pcls'>{ ( e?.totals?.misc?.IsHSCODE_0_wt + e?.totals?.colorstone?.Wt) !== 0 && (e?.totals?.colorstone?.Wt + e?.totals?.misc?.IsHSCODE_0_wt)?.toFixed(3)}</div>
                                                    <div className='end_pcls pdr_pcls' style={{width:'37%'}}>{ priceFlag && <>{ ( e?.totals?.misc?.IsHSCODE_0_amount + e?.totals?.colorstone?.Amount) !== 0 && ( Math.round( (e?.totals?.misc?.IsHSCODE_0_amount + e?.totals?.colorstone?.Amount) / result?.header?.CurrencyExchRate))}</>}</div>
                                                </div>
                                </div>

                                <div className='col6_pcls  d-flex flex-column justify-content-between bright_pcls'>
                                    <div>
                                        { (e?.MaKingCharge_Unit !== 0) && <div className='d-flex w-100'>
                                            <div className='lcol1_pcls start_center_pcls pdl_pcls'>Labour</div>
                                            <div className='lcol1_pcls pcle_center pdr_pcls'>{ priceFlag && (e?.MaKingCharge_Unit)}</div>
                                            <div className='lcol1_pcls end_pcls pdr_pcls'>{ priceFlag && <>{ e?.MakingAmount !== 0 && Math.round((e?.MakingAmount / result?.header?.CurrencyExchRate))}</>}</div>
                                        </div>}
                                        
                                        {
                                            e?.other_details_array?.map((ele, inds) => {
                                                return(
                                                    <div className='d-flex w-100' key={inds}>
                                                        <div className='w-75 start_center_pcls pdl_pcls text-break'>{ele?.label}</div>
                                                        <div className='w-25 end_pcls pdr_pcls'>{ priceFlag && Math.round(ele?.amtval)}</div>
                                                    </div>
                                                )
                                            })
                                        }
                                        {
                                            e?.misc_1List?.map((ele, inds) => {
                                                return(
                                                    <>
                                                    { ele?.Amount !== 0 && <div className='d-flex w-100' key={inds}>
                                                        <div className='w-50 start_center_pcls pdl_pcls text-break'>{ele?.ShapeName}</div>
                                                        <div className='w-50 end_pcls pdr_pcls'> { priceFlag && <>{ ele?.Amount !== 0 &&((ele?.Amount / result?.header?.CurrencyExchRate))}</>}</div>
                                                    </div>}
                                                    </>
                                                )
                                            })
                                        }
                                        {
                                            e?.misc_2List?.map((ele, inds) => {
                                                return(
                                                    <>
                                                    { ele?.Amount !== 0 && <div className='d-flex w-100' key={inds}>
                                                        <div className='w-50 start_center_pcls pdl_pcls text-break'>{ele?.ShapeName}</div>
                                                        <div className='w-50 end_pcls pdr_pcls'>{ priceFlag && <>{ ele?.Amount !== 0 && Math.round((ele?.Amount / result?.header?.CurrencyExchRate))}</>}</div>
                                                    </div>}
                                                    </>
                                                )
                                            })
                                        }
                                        {
                                            e?.misc_3List?.map((ele, inds) => {
                                                return(
                                                    <>
                                                    { ele?.Amount !== 0 && <div className='d-flex w-100' key={inds}>
                                                        <div className='w-50 start_center_pcls pdl_pcls text-break'>{ele?.ShapeName}</div>
                                                        <div className='w-50 end_pcls pdr_pcls'>{ priceFlag && <>{ ele?.Amount !== 0 && Math.round((ele?.Amount / result?.header?.CurrencyExchRate))}</>}</div>
                                                    </div>}
                                                    </>
                                                )
                                            })
                                        }
                                                    { (e?.totals?.diamonds?.SettingAmount + e?.totals?.colorstone?.SettingAmount) !== 0 && <div className='d-flex w-100'>
                                                        <div className='w-50 start_center_pcls pdl_pcls text-break'>Setting</div>
                                                        <div className='w-50 end_pcls pdr_pcls'>{ priceFlag && <>{ ((((e?.totals?.diamonds?.SettingAmount + e?.totals?.colorstone?.SettingAmount) / result?.header?.CurrencyExchRate))) !== 0 && Math.round((((e?.totals?.diamonds?.SettingAmount + e?.totals?.colorstone?.SettingAmount) / result?.header?.CurrencyExchRate)))}</>}</div>
                                                    </div>}
                                                    { (e?.totals?.finding?.SettingAmount) !== 0 && <div className='d-flex w-100'>
                                                        <div className='lcol1_pcls start_center_pcls pdl_pcls text-break'>Labour</div>
                                                        <div className='lcol1_pcls pcle_center pdr_pcls text-break'>{ priceFlag && (e?.totals?.finding?.SettingRate)}</div>
                                                        <div className='lcol1_pcls end_pcls pdr_pcls'>{ priceFlag && <>{ (e?.totals?.finding?.SettingAmount / result?.header?.CurrencyExchRate) !== 0 && Math.round(((e?.totals?.finding?.SettingAmount / result?.header?.CurrencyExchRate)))}</>}</div>
                                                    </div>}

                                        { (e?.TotalDiamondHandling !== 0) && <div className='d-flex w-100'>
                                                <div className='lcol1_pcls start_center_pcls pdl_pcls'>Handling</div>
                                                <div className='lcol1_pcls pcle_center pdr_pcls'>{ priceFlag && Math.round((e?.TotalDiamondHandling/e?.totals?.diamonds?.Wt))}</div>
                                                <div className='lcol1_pcls end_pcls pdr_pcls'>{ priceFlag && <>{ (e?.TotalDiamondHandling / result?.header?.CurrencyExchRate) !== 0 && Math.round((e?.TotalDiamondHandling / result?.header?.CurrencyExchRate))}</>}</div>
                                            </div>
                                        }
                                    </div>
                                        <div className='d-flex w-100 btop_pcls bg_pcls fw-bold'>
                                            <div className='w-100 end_pcls pdr_pcls'>&nbsp;
                                            { priceFlag && <>{
                                            (
                                                (e?.OtherCharges + e?.TotalDiamondHandling + 
                                                e?.totals?.misc?.IsHSCODE_1_amount + 
                                                e?.totals?.misc?.IsHSCODE_2_amount + 
                                                e?.totals?.misc?.IsHSCODE_3_amount + 
                                                e?.totals?.diamonds?.SettingAmount + e?.totals?.colorstone?.SettingAmount + e?.totals?.finding?.SettingAmount + e?.MakingAmount)) !== 0 && Math.round(((e?.OtherCharges + e?.TotalDiamondHandling + 
                                                    e?.totals?.misc?.IsHSCODE_1_amount + 
                                                    e?.totals?.misc?.IsHSCODE_2_amount + 
                                                    e?.totals?.misc?.IsHSCODE_3_amount + 
                                                    e?.totals?.diamonds?.SettingAmount + e?.totals?.colorstone?.SettingAmount + e?.totals?.finding?.SettingAmount + e?.MakingAmount) / result?.header?.CurrencyExchRate))
                                          }</>}
                                          </div>
                                        </div>
                                </div>

                                <div className='col7_pcls   d-flex flex-column justify-content-between'>
                                    <div className='start_pcls pdr_pcls fw-bold'>{ priceFlag && Math.round((e?.TotalAmount / result?.header?.CurrencyExchRate))}</div>
                                    <div className='start_pcls btop_pcls bg_pcls pdr_pcls fw-bold'>&nbsp;{ priceFlag && <>{Math.round((e?.TotalAmount / result?.header?.CurrencyExchRate))}</>}</div>
                                </div>

                            </div>
                        )
                    })
                }
                {/* main total */}
                <div className='d-flex thead_pcls bbottom_pcls tb_fs_pcls total_row_pcle' style={{borderBottom:'1px solid black', borderLeft:'1px solid black', borderRight:'1px solid black'}}>
                    <div className='col1_pcls bright_pcls'></div>
                    <div className='col2_pcls centerall_pcls  bright_pcls'>Total</div>
                    <div className='col4_pcls bright_pcls d-flex'>
                        <div className='d-flex w-100'>
                            <div className='mcol1_pcls  '></div>    
                            <div className='mcol1_pcls pcle_center pdr_pcls '>{result?.mainTotal?.grosswt?.toFixed(3)}</div>
                            <div className='mcol1_pcls pcle_center pdr_pcls '>{(result?.mainTotal?.NetWt + result?.mainTotal?.LossWt)?.toFixed(3)}</div>
                            <div className='mcol1_pcls pcle_center pdr_pcls '>{(result?.mainTotal?.PureNetWt)?.toFixed(3)}</div>
                            <div className='mcol1_pcls end_pcls pdr_pcls' style={{width:'33.33%'}}>{ priceFlag && Math.round(((result?.mainTotal?.metal?.Amount + result?.mainTotal?.finding?.Amount + result?.mainTotal?.LossAmt ) / result?.header?.CurrencyExchRate))}</div>
                        </div>
                    </div>
                    <div className='col3_pcls bright_pcls d-flex'>
                        <div className='d-flex w-100'>
                            <div className='dcol1_pcls centerall_pcls '></div>
                            <div className='dcol2_pcls centerall_pcls '></div>
                            <div className='dcol3_pcls pcle_center pdr_pcls '>{result?.mainTotal?.diamonds?.Pcs}</div>
                            <div className='dcol4_pcls pcle_center pdr_pcls '>{result?.mainTotal?.diamonds?.Wt?.toFixed(3)}</div>
                            <div className='dcol6_pcls end_pcls pdr_pcls' style={{width:'37%'}}>{ priceFlag && Math.round((result?.mainTotal?.diamonds?.Amount / result?.header?.CurrencyExchRate))}</div>
                        </div>
                    </div>
                 
                    <div className='col5_pcls bright_pcls d-flex'>
                        <div className='d-flex w-100'>
                            <div className='dcol1_pcls centerall_pcls '></div>
                            <div className='dcol2_pcls centerall_pcls '></div>
                            <div className='dcol3_pcls pcle_center pdr_pcls '>{(result?.mainTotal?.colorstone?.Pcs + result?.mainTotal?.misc?.IsHSCODE_0_pcs)}</div>
                            <div className='dcol4_pcls pcle_center pdr_pcls '>{(result?.mainTotal?.colorstone?.Wt + result?.mainTotal?.misc?.IsHSCODE_0_wt)?.toFixed(3)}</div>
                            <div className=' end_pcls pdr_pcls' style={{width:'37%'}}>{ priceFlag && Math.round(((  result?.mainTotal?.misc?.IsHSCODE_0_amount + result?.mainTotal?.colorstone?.Amount) / result?.header?.CurrencyExchRate))}</div>
                        </div>
                    </div>
                    <div className='col6_pcls bright_pcls d-flex'>
                        <div className='d-flex w-100'>
                            <div className='w-100 end_pcls pdr_pcls'>{ priceFlag && Math.round((((
                                result?.mainTotal?.OtherCharges + 
                                result?.mainTotal?.TotalDiamondHandling + 
                                result?.mainTotal?.diamonds?.SettingAmount + 
                                result?.mainTotal?.colorstone?.SettingAmount + 
                                result?.mainTotal?.finding?.SettingAmount + 
                                result?.mainTotal?.MakingAmount + 
                                result?.mainTotal?.misc?.IsHSCODE_1_amount + 
                                result?.mainTotal?.misc?.IsHSCODE_2_amount + 
                                result?.mainTotal?.misc?.IsHSCODE_3_amount)) / result?.header?.CurrencyExchRate))}</div>
                        </div>
                    </div>
                    <div className='col7_pcls end_pcls pdr_pcls'>{ priceFlag && Math.round(((result?.mainTotal?.TotalAmount + result?.mainTotal?.DiscountAmt) / result?.header?.CurrencyExchRate))}</div>
                </div>
                {/* taxes and grand total */}
                {/* <div className='d-flex tb_fs_pcls justify-content-end align-items-center' style={{borderBottom:'1px solid black', borderLeft:'1px solid black', borderRight:'1px solid black'}}>
                    <div style={{width:'14%'}}>
                        { result?.mainTotal?.DiscountAmt !== 0 && <div className='w-100 d-flex align-items-center tb_fs_pcls'>
                            <div style={{width:'50%'}} className='end_pcls pdr_pcls'>Total Discount</div>
                            <div style={{width:'50%'}} className='end_pcls pdr_pcls'>{Math.round((result?.mainTotal?.DiscountAmt / result?.header?.CurrencyExchRate))}</div>
                        </div>}
                        <div className='w-100 d-flex align-items-center tb_fs_pcls'>
                            <div style={{width:'50%'}} className='end_pcls pdr_pcls'>Total Amount</div>
                            <div style={{width:'50%'}} className='end_pcls pdr_pcls'>{Math.round((result?.mainTotal?.TotalAmount / result?.header?.CurrencyExchRate))}</div>
                        </div>
                        { result?.allTaxes?.map((e, i) => {
                            return <div className='w-100 d-flex align-items-center tb_fs_pcls' key={i}>
                            <div style={{width:'50%'}} className='end_pcls pdr_pcls'>{e?.name} @ {e?.per}</div>
                            <div style={{width:'50%'}} className='end_pcls pdr_pcls'>{Math.round((e?.amountInNumber ))}</div>
                        </div>
                        }) }
                          <div className='w-100 d-flex align-items-center tb_fs_pcls'>
                            <div style={{width:'50%'}} className='end_pcls pdr_pcls'>{result?.header?.AddLess >= 0 ? 'Add' : 'Less'}</div>
                            <div style={{width:'50%'}} className='end_pcls pdr_pcls'>{Math.round((result?.header?.AddLess / result?.header?.CurrencyExchRate))}</div>
                        </div>
                        { result?.header?.FreightCharges !== 0 && <div className='w-100 d-flex align-items-center tb_fs_pcls'>
                            <div style={{width:'50%'}} className='end_pcls pdr_pcls'>{result?.header?.ModeOfDel}</div>
                            <div style={{width:'50%'}} className='end_pcls pdr_pcls'>{Math.round((result?.header?.FreightCharges / result?.header?.CurrencyExchRate))}</div>
                        </div>}
                        <div className='w-100 d-flex align-items-center tb_fs_pcls fw-bold'>
                            <div style={{width:'50%'}} className='end_pcls pdr_pcls'>Final Amount</div>
                            <div style={{width:'50%'}} className='end_pcls pdr_pcls'>{(Math.round( (((result?.mainTotal?.TotalAmount + result?.header?.AddLess + result?.header?.FreightCharges)/ result?.header?.CurrencyExchRate) + result?.allTaxesTotal)))}</div>
                        </div>
                    </div>
                </div> */}
                {/* footer & summary */}
            </div>
               
                <div className="d-flex justify-content-between tb_fs_pcls mt-1 summarydp10">
                    <div className="d-flex flex-column sumdp10 minH_sum_pcl3">
                      <div className="fw-bold bg_dp10 w-100 centerdp10  ball_dp10">
                        SUMMARY
                      </div>
                      <div className="d-flex w-100 fsgdp10">
                        <div className="w-50 bright_dp10  bl_dp10">
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">GOLD IN 24KT</div>
                            <div className="w-50 end_dp10 pe-1">
                            {(result?.mainTotal?.PureNetWt)?.toFixed(3)} gm
                            </div>
                          </div>
                        
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold tb_fs_pcls">GROSS WT</div>
                            <div className="w-50 end_dp10 pe-1 tb_fs_pcls">
                              {result?.mainTotal?.grosswt?.toFixed(3)} gm
                            </div>
                          </div>
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold tb_fs_pcls">NET WT</div>
                            <div className="w-50 end_dp10 pe-1 tb_fs_pcls">
                            {(result?.mainTotal?.NetWt + result?.mainTotal?.LossWt) ?.toFixed(3)} gm
                            </div>
                          </div>
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold tb_fs_pcls">LOSS WT</div>
                            <div className="w-50 end_dp10 pe-1 tb_fs_pcls">
                            {(result?.mainTotal?.LossWt) ?.toFixed(3)} gm
                            </div>
                          </div>
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">DIAMOND WT</div>
                            <div className="w-50 end_dp10 pe-1">
                              {result?.mainTotal?.diamonds?.Pcs} /{" "}
                              {result?.mainTotal?.diamonds?.Wt?.toFixed(3)} cts
                            </div>
                          </div>
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">STONE WT</div>
                            <div className="w-50 end_dp10 pe-1">
                              {result?.mainTotal?.colorstone?.Pcs} /{" "}
                              {result?.mainTotal?.colorstone?.Wt?.toFixed(3)}{" "}
                              cts
                            </div>
                          </div>
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">MISC WT</div>
                            <div className="w-50 end_dp10 pe-1">
                              {result?.mainTotal?.misc?.IsHSCODE_0_pcs} /{" "}
                              {result?.mainTotal?.misc?.IsHSCODE_0_wt?.toFixed(3)}{" "}
                              gm
                            </div>
                          </div>
                        </div>
                        <div className="w-50 bright_dp10 tb_fs_pcls">
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">GOLD</div>
                            <div className="w-50 end_dp10">
                            { priceFlag && Math.round(((result?.mainTotal?.metal?.Amount) / result?.header?.CurrencyExchRate))}
                            </div>
                          </div>
                      
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">DIAMOND</div>
                            <div className="w-50 end_dp10">
                              { priceFlag && Math.round( result?.mainTotal?.diamonds?.Amount )}
                            </div>
                          </div>
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">CST</div>
                            <div className="w-50 end_dp10">
                            { priceFlag && Math.round((result?.mainTotal?.colorstone?.Amount / result?.header?.CurrencyExchRate))}
                            </div>
                          </div>
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">MISC</div>
                            <div className="w-50 end_dp10">
                            { priceFlag && Math.round((result?.mainTotal?.misc?.IsHSCODE_0_amount / result?.header?.CurrencyExchRate))}
                            </div>
                          </div>
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">MAKING </div>
                            <div className="w-50 end_dp10">
                            { priceFlag && Math.round(((result?.mainTotal?.MakingAmount + result?.mainTotal?.diamonds?.SettingAmount + result?.mainTotal?.colorstone?.SettingAmount) / result?.header?.CurrencyExchRate))}
                            </div>
                          </div>
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">OTHER </div>
                            <div className="w-50 end_dp10">
                            { priceFlag && Math.round(((result?.mainTotal?.OtherCharges + result?.mainTotal?.TotalDiamondHandling)))}
                            </div>
                          </div>
                          <div className="d-flex justify-content-between px-1">
                            <div className="w-50 fw-bold">
                              {result?.header?.AddLess >= 0 ? "ADD" : "LESS"}
                            </div>
                            <div className="w-50 end_dp10">
                              { priceFlag && Math.round(result?.header?.AddLess)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg_dp10 h_bd10 ball_dp10 d-flex fsgdp10 tb_fs_pcls ">
                        <div className="w-50 h-100"></div>
                        <div className="w-50 h-100 d-flex align-items-center bl_dp10">
                          <div className="fw-bold w-50 px-1">&nbsp;</div>
                          <div className="w-50 end_dp10 px-1">
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* <div className="oth_sum_dp10 fsgdp10">
                      <div className="h_bd10 centerdp10 bg_dp10 fw-bold ball_dp10 tb_fs_pcls">
                        OTHER DETAILS
                      </div>
                      <div className="d-flex flex-column justify-content-between w-100 px-1 ball_dp10 border-top-0 p-1">
                        <div className="d-flex">
                          <div className="w-50 fw-bold start_dp10 fsgdp10 tb_fs_pcls">
                            RATE IN 24KT
                          </div>
                          <div className="w-50 end_dp10 fsgdp10 tb_fs_pcls">
                            {result?.header?.MetalRate24K?.toFixed(2)}
                          </div>
                        </div>
                        <div>
                          {result?.header?.BrokerageDetails?.map((e, i) => {
                            return (
                              <div className="d-flex fsgdp10" key={i}>
                                <div className="w-50 fw-bold start_dp10">
                                  {e?.label}
                                </div>
                                <div className="w-50 end_dp10">{Math.round(e?.value)}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div> */}
                     {
                      result?.header?.PrintRemark === '' ? <div style={{width:'15%'}}></div> : 
                      <div className="remark_sum_dp10 fsgdp10">
                      <div className="h_bd10 centerdp10 bg_dp10 fw-bold ball_dp10">
                        Remark
                      </div>
                       <div className="p-1 bright_pcls bbottom_pcls bleft_pcls text-break" dangerouslySetInnerHTML={{ __html: result?.header?.PrintRemark }} ></div>
                    </div>
                     } 
                     <div className="dia_sum_dp10e d-flex flex-column justify-content-between  fsgdp10 H_sum_pcl3 minH_sum_pcl3">
                   
                    </div>
                    <div className="check_dp10 ball_dp10 d-flex justify-content-center align-items-end pb-1 fsgdp10 tb_fs_pcls H_sum_pcl3">
                      <i>Created By</i>
                    </div>
                    <div className="check_dp10 ball_dp10 d-flex justify-content-center align-items-end pb-1 fsgdp10 tb_fs_pcls H_sum_pcl3">
                      <i>Checked By</i>
                    </div>
                  </div>
        </div>
    </div> : <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto"> {msg} </p> }
    </>
  )
}

export default PackingListE;