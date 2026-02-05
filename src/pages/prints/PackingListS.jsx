import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { apiCall, checkMsg, formatAmount, handleImageError, isObjectEmpty } from '../../GlobalFunctions';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import Loader from '../../components/Loader';
import "../../assets/css/prints/packinglists.css";
import Button from './../../GlobalFunctions/Button';
import { OrganizeInvoicePrintData } from '../../GlobalFunctions/OrganizeInvoicePrintData';
import { cloneDeep } from 'lodash';
import { MetalShapeNameWiseArr } from '../../GlobalFunctions/MetalShapeNameWiseArr';

const PackingListS = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {

  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const [diamondArr, setDiamondArr] = useState([]);
  const [isImageWorking, setIsImageWorking] = useState(true);

  const [imgFlag, setImgFlag] = useState(true);
  const [unitFlag, setUnitFlag] = useState(true);
  const [headFlag, setHeadFlag] = useState(true);
  const [tunchFlag, setTunchFlag] = useState(true);

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
  }, []);

  const loadData = (data) => {

      let address = data?.BillPrint_Json[0]?.Printlable?.split("\r\n");
      data.BillPrint_Json[0].address = address;
 
      const datas = OrganizeInvoicePrintData(
        data?.BillPrint_Json[0],
        data?.BillPrint_Json1,
        data?.BillPrint_Json2
      );

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
  }

  const handleImgShow = (args) => {
    if(args === 'unit'){
        if (unitFlag) setUnitFlag(false);
        else {
            setUnitFlag(true);
        }
    }
    if(args === 'tunch'){
        if (tunchFlag) setTunchFlag(false);
        else {
            setTunchFlag(true);
        }
    }
    if(args === 'head'){
        if (headFlag) setHeadFlag(false);
        else {
            setHeadFlag(true);
        }
    }
    if(args === 'img'){
        if (imgFlag) setImgFlag(false);
        else {
        setImgFlag(true);
        }
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
            <div className=' d-flex align-items-center justify-content-end my-5 d_none_pcl_s'>
                <div className='px-2'>
                    <input type="checkbox" onChange={() => handleImgShow('unit')} value={unitFlag} checked={unitFlag} id='unitShow' />
                    <label htmlFor="unitShow" className='user-select-none mx-1'>With Unit</label>
                </div>
                <div className='px-2'>
                    <input type="checkbox" onChange={() => handleImgShow('tunch')} value={tunchFlag} checked={tunchFlag} id='tunchShow' />
                    <label htmlFor="tunchShow" className='user-select-none mx-1'>With Tunch</label>
                </div>
                <div className='px-2'>
                    <input type="checkbox" onChange={() => handleImgShow('head')} value={headFlag} checked={headFlag} id='headShow' />
                    <label htmlFor="headShow" className='user-select-none mx-1'>With Header</label>
                </div>
                <div className='px-2'>
                    <input type="checkbox" onChange={() => handleImgShow('img')} value={imgFlag} checked={imgFlag} id='imgshow' />
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
            { !headFlag && <div className='d-flex justify-content-between align-items-center px-1 fs_header_pcls'>
                <div>
                    <div className='fs_16_pcls fw-bold py-1'>{result?.header?.CompanyFullName}</div>
                    <div>{result?.header?.CompanyAddress}</div>
                    <div>{result?.header?.CompanyAddress2}</div>
                    <div>{result?.header?.CompanyCity}-{result?.header?.CompanyPinCode},{result?.header?.CompanyState}({result?.header?.CompanyCountry})</div>
                    <div>T {result?.header?.CompanyTellNo}</div>
                    <div>{result?.header?.CompanyEmail} | {result?.header?.CompanyWebsite}</div>
                    <div>{result?.header?.Company_VAT_GST_No} | {result?.header?.Company_CST_STATE} - {result?.header?.Company_CST_STATE_No} | PAN - {result?.header?.Com_pannumber}</div>
                </div>
                <div>
                    { isImageWorking && <img src={result?.header?.PrintLogo} alt="#companylogo" className='companylogo_pcls' onError={handleImageErrors} />}
                </div>
            </div>}
            {/* customer header */}
            { !headFlag && <div className='d-flex  mt-1 brall_pcls brall_pcls fs_header_pcls'>
                <div className='bright_pcls p-1' style={{width:'35%'}}>
                    <div>Bill To,</div>
                    <div className='fs_14_pcls fw-bold'>{result?.header?.customerfirmname}</div>
                    <div>{result?.header?.customerAddress2}</div>
                    <div>{result?.header?.customerAddress1}</div>
                    <div>{result?.header?.customercity1}{result?.header?.customerpincode}</div>
                    <div>{result?.header?.customeremail1}</div>
                    <div>{result?.header?.vat_cst_pan}</div>
                    <div>{result?.header?.Cust_CST_STATE}-{result?.header?.Cust_CST_STATE_No}</div>
                </div>
                <div className='bright_pcls p-1' style={{width:'35%'}}>
                    <div>Ship To,</div>
                    <div className='fs_14_pcls fw-bold'>{result?.header?.customerfirmname}</div>
                    <div>{result?.header?.CustName}</div>
                    <div>{result?.header?.customercity}</div>
                    <div>{result?.header?.customercountry}{result?.header?.customerpincode}</div>
                    <div>Mobile No : {result?.header?.customermobileno}</div>
                </div>
                <div className='p-1' style={{width:'30%'}}>
                    <div className='d-flex align-items-center'><div className='fw-bold billbox_pcls'>BILL NO </div><div>{result?.header?.InvoiceNo}</div></div>
                    <div className='d-flex align-items-center'><div className='fw-bold billbox_pcls'>DATE </div><div>{result?.header?.EntryDate}</div></div>
                    <div className='d-flex align-items-center'><div className='fw-bold billbox_pcls'>{result?.header?.HSN_No_Label} </div><div>{result?.header?.HSN_No}</div></div>
                </div>
            </div>}
            {
                headFlag && 
                <div className='d-flex justify-content-between align-items-center p-2'>
                    <div className='p-2'>
                        <div className='h_head_pcls fs_h_head2 p-1'>To,</div>
                        <div className='fw-bold fs_h_head2 p-1'>{result?.header?.CustName?.toUpperCase()}</div>
                    </div>
                    <div>
                        <div className='d-flex align-items-center p-1'>
                            <div className='h_head_pcls w_h_head'>Invoice#</div>
                            <div className='fw-bold fs_h_head2'>: &nbsp;&nbsp;{result?.header?.InvoiceNo}</div>
                        </div>
                        <div className='d-flex align-items-center p-1'>
                            <div className='h_head_pcls w_h_head'>Date</div>
                            <div className='fw-bold fs_h_head2'>: &nbsp;&nbsp;{result?.header?.EntryDate}</div>
                        </div>
                        <div className='d-flex align-items-center p-1'>
                            <div className='h_head_pcls w_h_head'>{result?.header?.HSN_No_Label}</div>
                            <div className='fw-bold fs_h_head2'>: &nbsp;&nbsp;{result?.header?.HSN_No}</div>
                        </div>
                    </div>
                </div>
            }
            {/* table */}
            <div className='mt-1 '>
                {/* table head */}
                <div className='d-flex thead_pcls bbottom_pcls tb_fs_pcls' style={{borderTop:'1px solid black', borderLeft:'1px solid black', borderRight:'1px solid black'}}>
                    <div className='col1_pcls centerall_pcls bright_pcls'>Sr</div>
                    <div className='col2_pcls centerall_pcls bright_pcls'>Design</div>
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
                    <div className='col4_pcls bright_pcls'>
                        <div className='w-100 centerall_pcls bbottom_pcls'>Metal</div>
                        <div className='d-flex w-100'>
                            <div className='mcol1_pcls centerall_pcls bright_pcls'>Quality</div>
                            <div className='mcol2_pcls centerall_pcls bright_pcls'>Gwt</div>
                            <div className='mcol3_pcls centerall_pcls bright_pcls'>N + L</div>
                            <div className='mcol4_pcls centerall_pcls bright_pcls'>Rate</div>
                            <div className='mcol5_pcls centerall_pcls '>Amount</div>
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
                            <div className='d-flex tbody_pcls bbottom_pcls tb_fs_pcls pbia_s border-top' style={{borderLeft:'1px solid black', borderRight:'1px solid black'}}>
                                <div className='col1_pcls centerall_pcls bright_pcls'>{i+1}</div>
                                <div className='col2_pcls start_top_pcls flex-column bright_pcls pt-1'>
                                    <div className='d-flex flex-wrap justify-content-between align-items-center w-100 text-break pdl_pcls pdr_pcls'>
                                        <div>{e?.designno}</div>
                                        <div>{e?.SrJobno}</div>
                                    </div>
                                    <div className='d-flex flex-wrap justify-content-end w-100 text-break pdr_pcls'>{e?.MetalColor}</div>
                                    {imgFlag ? (
                                    <div>
                                        <img src={e?.DesignImage} onError={(e) => handleImageError(e)} alt="design" className='designimg_pcls' />
                                    </div>
                                    ) : (
                                    ""
                                    )}
                                    { e?.CertificateNo !== '' && <div className='centerall_pcls text-break w-100'>Certificate# : {e?.CertificateNo}</div>}
                                    { e?.HUID !== '' && <div className='centerall_pcls w-100 text-break'>HUID : <span className='fw-bold'>{e?.HUID}</span></div>}
                                    { e?.PO !== '' && <div className='centerall_pcls w-100 fw-bold text-break'>PO : {e?.PO}</div>}
                                    { e?.lineid !== '' && <div className='centerall_pcls w-100 text-break'>{e?.lineid}</div>}
                                    { tunchFlag && <> { e?.Tunch !== '' && <div className='centerall_pcls w-100 text-break'>Tunch : <span className='fw-bold'>{e?.Tunch?.toFixed(3)}</span></div>} </>}
                                    { e?.Size !== '' && <div className='centerall_pcls w-100 text-break'><span className='fw-bold'>Size : {e?.Size}</span></div>}
                                </div>

                                <div className='col3_pcls d-flex flex-column justify-content-between bright_pcls'>
                                    <div>
                                    {
                                        e?.diamonds?.map((el, ind) => {
                                            return (
                                                <div className='d-flex w-100' key={ind}>
                                                    <div className='dcol1_pcls start_center_pcls pdl_pcls'>{el?.ShapeName}</div>
                                                    <div className='dcol2_pcls start_center_pcls pdl_pcls'>{el?.SizeName}</div>
                                                    <div className='dcol3_pcls end_pcls pdr_pcls'>{el?.Pcs}</div>
                                                    <div className='dcol4_pcls end_pcls pdr_pcls text-break'>{el?.Wt?.toFixed(3)} { unitFlag && <> {el?.Wt !== 0 && 'ctw'} </>}</div>
                                                    <div className='dcol5_pcls end_pcls pdr_pcls'>{formatAmount(el?.Rate)}</div>
                                                    <div className='dcol6_pcls end_pcls pdr_pcls fw-bold'>{formatAmount((el?.Amount / result?.header?.CurrencyExchRate))}</div>
                                                </div>
                                            )
                                        })
                                    }
                                    </div>
                                                <div className='d-flex w-100 btop_pcls bg_pcls fw-bold'>
                                                    <div className='dcol1_pcls'>&nbsp;</div>
                                                    <div className='dcol2_pcls'></div>
                                                    <div className='dcol3_pcls end_pcls pdr_pcls'>{e?.totals?.diamonds?.Pcs !== 0 && e?.totals?.diamonds?.Pcs}</div>
                                                    <div className='dcol4_pcls end_pcls pdr_pcls'>{ e?.totals?.diamonds?.Wt !== 0 && e?.totals?.diamonds?.Wt?.toFixed(3)}</div>
                                                    <div className='end_pcls pdr_pcls' style={{width:'37%'}}>{ e?.totals?.diamonds?.Amount !== 0 && formatAmount((e?.totals?.diamonds?.Amount / result?.header?.CurrencyExchRate))}</div>
                                                </div>
                                </div>

                                <div className='col4_pcls  d-flex flex-column justify-content-between bright_pcls'>
                                  <div>
                                  {
                                    e?.metal?.map((el, ind) => {
                                        return (
                                            <div className='d-flex w-100' key={ind}>
                                                <div className='mcol1_pcls start_center_pcls pdl_pcls text-break'>{ el?.ShapeName +" "+ el?.QualityName}</div>
                                                <div className='mcol2_pcls end_pcls pdr_pcls text-break'>{e?.grosswt?.toFixed(3)} { unitFlag && <> {e?.grosswt !== 0 && 'gm'} </>}</div>
                                                <div className='mcol3_pcls end_pcls pdr_pcls text-break'>{(e?.NetWt - e?.totals?.finding?.Wt)?.toFixed(3)} { unitFlag && <>{(e?.NetWt - e?.totals?.finding?.Wt) !== 0 && 'gm'}</>}</div>
                                                <div className='mcol4_pcls end_pcls pdr_pcls'>{formatAmount(el?.Rate)}</div>
                                                <div className='mcol5_pcls end_pcls pdr_pcls fw-bold'>{formatAmount((((el?.Amount - ((e?.totals?.finding?.Wt * e?.metal_rate) + e?.LossAmt))) / result?.header?.CurrencyExchRate))}</div>
                                            </div>
                                        )
                                    })
                                   }
                                  {
                                        e?.totals?.finding?.Wt !== 0 &&
                                            <div className='d-flex w-100 text-break' >
                                                <div className='mcol1_pcls start_center_pcls pdl_pcls text-break' style={{width:'39%'}}>FINDING ACESSORIES</div>
                                                <div className='mcol3_pcls end_pcls pdr_pcls text-break'>{e?.totals?.finding?.Wt?.toFixed(3)} { unitFlag && <> {e?.totals?.finding?.Wt !== 0 && 'gm'} </>}</div>
                                                <div className='mcol4_pcls end_pcls pdr_pcls'>{formatAmount(e?.metal_rate)}</div>
                                                <div className='mcol5_pcls end_pcls pdr_pcls fw-bold'>{formatAmount(((e?.totals?.finding?.Wt * e?.metal_rate) / result?.header?.CurrencyExchRate))}</div>
                                            </div>
                                 
                                   }
                                            { e?.LossWt !== 0 && <div className='d-flex w-100 pt-1'>
                                                <div className='mcol1_pcls start_center_pcls pdl_pcls'>Loss</div>
                                                <div className='mcol2_pcls end_pcls pdr_pcls'>{(e?.LossPer)?.toFixed(3)} %</div>
                                                <div className='mcol3_pcls end_pcls pdr_pcls text-break'>{e?.LossWt?.toFixed(3)} { unitFlag && <>{e?.LossWt !== 0 && 'gm'}</>}</div>
                                                <div className='mcol4_pcls end_pcls pdr_pcls'>{formatAmount(e?.metal_rate)}</div>
                                                <div className='mcol5_pcls end_pcls pdr_pcls fw-bold'>{formatAmount((e?.LossAmt / result?.header?.CurrencyExchRate))}</div>
                                            </div>}
                                            { e?.JobRemark !== '' && <div className=' w-100 pt-2'>
                                                <div className='ps-1 start_center_pcls '>Remark :</div>
                                                <div className='ps-1 fw-bold start_center_pcls '>{e?.JobRemark}</div>
                                            </div>}
                                  </div>
                                            <div className='d-flex w-100 btop_pcls bg_pcls fw-bold'>
                                                <div className='mcol1_pcls '>&nbsp;</div>
                                                <div className='mcol2_pcls end_pcls pdr_pcls'>{ e?.grosswt !== 0 && e?.grosswt?.toFixed(3)}</div>
                                                <div className='mcol3_pcls end_pcls pdr_pcls'>{ (e?.NetWt + e?.LossWt) !== 0 && (e?.NetWt + e?.LossWt)?.toFixed(3)}</div>
                                                <div className='end_pcls pdr_pcls' style={{width:'45%'}}>{ e?.totals?.metal?.Amount !== 0 && formatAmount((e?.totals?.metal?.Amount / result?.header?.CurrencyExchRate))}</div>
                                            </div>
                                </div>

                                <div className='col5_pcls  d-flex flex-column justify-content-between bright_pcls'>
                                   <div>
                                   {
                                        e?.colorstone?.map((el, ind) => {
                                            return (
                                                <div className='d-flex w-100' key={ind}>
                                                    <div className='dcol1_pcls start_center_pcls pdl_pcls'>{el?.ShapeName}</div>
                                                    <div className='dcol2_pcls start_center_pcls pdl_pcls'>{el?.SizeName}</div>
                                                    <div className='dcol3_pcls end_pcls pdr_pcls'>{el?.Pcs}</div>
                                                    <div className='dcol4_pcls end_pcls pdr_pcls text-break'>{el?.Wt?.toFixed(3)} { unitFlag && <> {el?.Wt !== 0 && 'ctw'} </>}</div>
                                                    <div className='dcol5_pcls end_pcls pdr_pcls'>{formatAmount(el?.Rate)}</div>
                                                    <div className='dcol6_pcls end_pcls pdr_pcls fw-bold'>{formatAmount((el?.Amount / result?.header?.CurrencyExchRate))}</div>
                                                </div>
                                            )
                                        })
                                    }
                                   {
                                        e?.misc_0List?.map((el, ind) => {
                                            return (
                                                <div className='d-flex w-100' key={ind}>
                                                    <div className='dcol1_pcls start_center_pcls pdl_pcls'>{el?.ShapeName}</div>
                                                    <div className='dcol2_pcls start_center_pcls pdl_pcls'>{el?.SizeName}</div>
                                                    <div className='dcol3_pcls end_pcls pdr_pcls'>{el?.Pcs}</div>
                                                    <div className='dcol4_pcls end_pcls pdr_pcls text-break'>{el?.Wt?.toFixed(3)} { unitFlag && <>{el?.Wt !== 0 && 'gm'}</>}</div>
                                                    <div className='dcol5_pcls end_pcls pdr_pcls'>{formatAmount(el?.Rate)}</div>
                                                    <div className='dcol6_pcls end_pcls pdr_pcls fw-bold'>{formatAmount((el?.Amount / result?.header?.CurrencyExchRate))}</div>
                                                </div>
                                            )
                                        })
                                    }
                                   </div>
                                                <div className='d-flex w-100 btop_pcls bg_pcls fw-bold'>
                                                    <div className='dcol1_pcls'>&nbsp;</div>
                                                    <div className='dcol2_pcls'></div>
                                                    <div className='dcol3_pcls end_pcls pdr_pcls'>{( e?.totals?.misc?.IsHSCODE_0_pcs + e?.totals?.colorstone?.Pcs) !== 0 &&  ( e?.totals?.misc?.IsHSCODE_0_pcs + e?.totals?.colorstone?.Pcs)}</div>
                                                    <div className='dcol4_pcls end_pcls pdr_pcls'>{ ( e?.totals?.misc?.IsHSCODE_0_wt + e?.totals?.colorstone?.Wt) !== 0 && (e?.totals?.colorstone?.Wt + e?.totals?.misc?.IsHSCODE_0_wt)?.toFixed(3)}</div>
                                                    <div className='end_pcls pdr_pcls' style={{width:'37%'}}>{ ( e?.totals?.misc?.IsHSCODE_0_amount + e?.totals?.colorstone?.Amount) !== 0 && formatAmount( ( (e?.totals?.misc?.IsHSCODE_0_amount + e?.totals?.colorstone?.Amount) / result?.header?.CurrencyExchRate))}</div>
                                                </div>
                                </div>

                                <div className='col6_pcls  d-flex flex-column justify-content-between bright_pcls'>
                                    <div>
                                        { (e?.MaKingCharge_Unit !== 0) && <div className='d-flex w-100'>
                                            <div className='lcol1_pcls start_center_pcls pdl_pcls'>Labour</div>
                                            <div className='lcol1_pcls end_pcls pdr_pcls'>{formatAmount(e?.MaKingCharge_Unit)}</div>
                                            <div className='lcol1_pcls end_pcls pdr_pcls'>{formatAmount((e?.MakingAmount / result?.header?.CurrencyExchRate))}</div>
                                        </div>}
                                        
                                        {
                                            e?.other_details_array?.map((ele, inds) => {
                                                return(
                                                    <div className='d-flex w-100' key={inds}>
                                                        <div className='w-75 start_center_pcls pdl_pcls text-break'>{ele?.label}</div>
                                                        <div className='w-25 end_pcls pdr_pcls'>{ele?.value}</div>
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
                                                        <div className='w-50 end_pcls pdr_pcls'>{formatAmount((ele?.Amount / result?.header?.CurrencyExchRate))}</div>
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
                                                        <div className='w-50 end_pcls pdr_pcls'>{formatAmount((ele?.Amount / result?.header?.CurrencyExchRate))}</div>
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
                                                        <div className='w-50 end_pcls pdr_pcls'>{formatAmount((ele?.Amount / result?.header?.CurrencyExchRate))}</div>
                                                    </div>}
                                                    </>
                                                )
                                            })
                                        }
                                                    { (e?.totals?.diamonds?.SettingAmount + e?.totals?.colorstone?.SettingAmount) !== 0 && <div className='d-flex w-100'>
                                                        <div className='w-50 start_center_pcls pdl_pcls text-break'>Setting</div>
                                                        <div className='w-50 end_pcls pdr_pcls'>{(formatAmount(((e?.totals?.diamonds?.SettingAmount + e?.totals?.colorstone?.SettingAmount) / result?.header?.CurrencyExchRate)))}</div>
                                                    </div>}
                                                    { (e?.totals?.finding?.SettingAmount) !== 0 && <div className='d-flex w-100'>
                                                        <div className='lcol1_pcls start_center_pcls pdl_pcls text-break'>Labour</div>
                                                        <div className='lcol1_pcls end_pcls pdr_pcls text-break'>{formatAmount(e?.totals?.finding?.SettingRate)}</div>
                                                        <div className='lcol1_pcls end_pcls pdr_pcls'>{(formatAmount((e?.totals?.finding?.SettingAmount / result?.header?.CurrencyExchRate)))}</div>
                                                    </div>}

                                        { (e?.TotalDiamondHandling !== 0) && <div className='d-flex w-100'>
                                                <div className='w-50 start_center_pcls pdl_pcls'>Handling</div>
                                                <div className='w-50 end_pcls pdr_pcls'>{formatAmount((e?.TotalDiamondHandling / result?.header?.CurrencyExchRate))}</div>
                                            </div>
                                        }
                                    </div>
                                        <div className='d-flex w-100 btop_pcls bg_pcls fw-bold'>
                                            <div className='w-100 end_pcls pdr_pcls'>&nbsp;{ (
                                                (e?.OtherCharges + e?.TotalDiamondHandling + 
                                                e?.totals?.misc?.IsHSCODE_1_amount + 
                                                e?.totals?.misc?.IsHSCODE_2_amount + 
                                                e?.totals?.misc?.IsHSCODE_3_amount + 
                                                e?.totals?.diamonds?.SettingAmount + e?.totals?.colorstone?.SettingAmount + e?.totals?.finding?.SettingAmount + e?.MakingAmount)) !== 0 && formatAmount(((e?.OtherCharges + e?.TotalDiamondHandling + 
                                                    e?.totals?.misc?.IsHSCODE_1_amount + 
                                                    e?.totals?.misc?.IsHSCODE_2_amount + 
                                                    e?.totals?.misc?.IsHSCODE_3_amount + 
                                                    e?.totals?.diamonds?.SettingAmount + e?.totals?.colorstone?.SettingAmount + e?.totals?.finding?.SettingAmount + e?.MakingAmount) / result?.header?.CurrencyExchRate))}</div>
                                        </div>
                                </div>

                                <div className='col7_pcls   d-flex flex-column justify-content-between'>
                                    <div className='start_pcls pdr_pcls fw-bold'>{formatAmount((e?.TotalAmount / result?.header?.CurrencyExchRate))}</div>
                                    <div className='start_pcls btop_pcls bg_pcls pdr_pcls fw-bold'>&nbsp;{formatAmount((e?.TotalAmount / result?.header?.CurrencyExchRate))}</div>
                                </div>

                            </div>
                        )
                    })
                }
                {/* main total */}
                <div className='d-flex thead_pcls bbottom_pcls tb_fs_pcls' style={{borderBottom:'1px solid black', borderLeft:'1px solid black', borderRight:'1px solid black'}}>
                    <div className='col1_pcls bright_pcls'></div>
                    <div className='col2_pcls centerall_pcls  bright_pcls'>Total</div>
                    <div className='col3_pcls bright_pcls'>
                        <div className='d-flex w-100'>
                            <div className='dcol1_pcls centerall_pcls '></div>
                            <div className='dcol2_pcls centerall_pcls '></div>
                            <div className='dcol3_pcls end_pcls pdr_pcls '>{result?.mainTotal?.diamonds?.Pcs}</div>
                            <div className='dcol4_pcls end_pcls pdr_pcls '>{result?.mainTotal?.diamonds?.Wt?.toFixed(3)}</div>
                            <div className='dcol6_pcls end_pcls pdr_pcls' style={{width:'37%'}}>{formatAmount((result?.mainTotal?.diamonds?.Amount / result?.header?.CurrencyExchRate))}</div>
                        </div>
                    </div>
                    <div className='col4_pcls bright_pcls'>
                        <div className='d-flex w-100'>
                            <div className='mcol1_pcls  '></div>
                            <div className='mcol2_pcls end_pcls pdr_pcls '>{result?.mainTotal?.grosswt?.toFixed(3)}</div>
                            <div className='mcol3_pcls end_pcls pdr_pcls '>{(result?.mainTotal?.NetWt + result?.mainTotal?.LossWt)?.toFixed(3)}</div>
                            <div className='end_pcls pdr_pcls' style={{width:'45%'}}>{formatAmount((result?.mainTotal?.metal?.Amount / result?.header?.CurrencyExchRate))}</div>
                        </div>
                    </div>
                    <div className='col5_pcls bright_pcls'>
                        <div className='d-flex w-100'>
                            <div className='dcol1_pcls centerall_pcls '></div>
                            <div className='dcol2_pcls centerall_pcls '></div>
                            <div className='dcol3_pcls end_pcls pdr_pcls '>{(result?.mainTotal?.colorstone?.Pcs + result?.mainTotal?.misc?.IsHSCODE_0_pcs)}</div>
                            <div className='dcol4_pcls end_pcls pdr_pcls '>{(result?.mainTotal?.colorstone?.Wt + result?.mainTotal?.misc?.IsHSCODE_0_wt)?.toFixed(3)}</div>
                            <div className=' end_pcls pdr_pcls' style={{width:'37%'}}>{formatAmount(((  result?.mainTotal?.misc?.IsHSCODE_0_amount + result?.mainTotal?.colorstone?.Amount) / result?.header?.CurrencyExchRate))}</div>
                        </div>
                    </div>
                    <div className='col6_pcls bright_pcls'>
                        <div className='d-flex w-100'>
                            <div className='w-100 end_pcls pdr_pcls'>{formatAmount((((
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
                    <div className='col7_pcls end_pcls pdr_pcls'>{formatAmount(((result?.mainTotal?.TotalAmount + result?.mainTotal?.DiscountAmt) / result?.header?.CurrencyExchRate))}</div>
                </div>
                {/* taxes and grand total */}
                <div className='d-flex justify-content-end align-items-center' style={{borderBottom:'1px solid black', borderLeft:'1px solid black', borderRight:'1px solid black'}}>
                    <div style={{width:'14%'}}>
                        <div className='w-100 d-flex align-items-center tb_fs_pcls'>
                            <div style={{width:'50%'}} className='end_pcls pdr_pcls'>Total Discount</div>
                            <div style={{width:'50%'}} className='end_pcls pdr_pcls'>{formatAmount((result?.mainTotal?.DiscountAmt / result?.header?.CurrencyExchRate))}</div>
                        </div>
                        <div className='w-100 d-flex align-items-center tb_fs_pcls'>
                            <div style={{width:'50%'}} className='end_pcls pdr_pcls'>Total Amount</div>
                            <div style={{width:'50%'}} className='end_pcls pdr_pcls'>{formatAmount((result?.mainTotal?.TotalAmount / result?.header?.CurrencyExchRate))}</div>
                        </div>
                        { result?.allTaxes?.map((e, i) => {
                            return <div className='w-100 d-flex align-items-center tb_fs_pcls' key={i}>
                            <div style={{width:'50%'}} className='end_pcls pdr_pcls'>{e?.name} @ {e?.per}</div>
                            <div style={{width:'50%'}} className='end_pcls pdr_pcls'>{formatAmount((e?.amount ))}</div>
                        </div>
                        }) }
                        <div className='w-100 d-flex align-items-center tb_fs_pcls'>
                            <div style={{width:'50%'}} className='end_pcls pdr_pcls'>{result?.header?.AddLess > 0 ? 'Add' : 'Less'}</div>
                            <div style={{width:'50%'}} className='end_pcls pdr_pcls'>{formatAmount((result?.header?.AddLess / result?.header?.CurrencyExchRate))}</div>
                        </div>
                        <div className='w-100 d-flex align-items-center tb_fs_pcls'>
                            <div style={{width:'50%'}} className='end_pcls pdr_pcls'>{result?.header?.ModeOfDel}</div>
                            <div style={{width:'50%'}} className='end_pcls pdr_pcls'>{formatAmount((result?.header?.FreightCharges / result?.header?.CurrencyExchRate))}</div>
                        </div>
                        <div className='w-100 d-flex align-items-center tb_fs_pcls fw-bold'>
                            <div style={{width:'50%'}} className='end_pcls pdr_pcls'>Final Amount</div>
                            <div style={{width:'50%'}} className='end_pcls pdr_pcls'>{formatAmount(( (((result?.mainTotal?.TotalAmount + result?.header?.AddLess + result?.header?.FreightCharges)/ result?.header?.CurrencyExchRate) + result?.allTaxesTotal)))}</div>
                        </div>
                    </div>
                </div>
                {/* footer & summary */}
            </div>
                <div className='d-flex w-100 mt-1 border-top'>
                    <div className='col1_s_pcls '>
                        <div className='fw-bold centerall_pcls bg_c_pcls bright_pcls bbottom_pcls bleft_pcls'>SUMMARY</div>
                        <div className='d-flex align-items-center w-100'>
                            <div className='w-50 tb_fs_pcls bright_pcls bbottom_pcls bleft_pcls'>
                                <div className='d-flex align-items-center text-break'>
                                    <div className='w-50 ps-1 fw-bold'>GOLD IN 24KT</div>
                                    <div className='w-50 pe-1 end_pcls'>{(result?.mainTotal?.PureNetWt - notGoldMetalWtTotal)?.toFixed(3)} gm</div>
                                </div>
                                {
                                MetShpWise?.map((e, i) => {
                                    return <div className='d-flex align-items-center text-break' key={i}>
                                        <div className='w-50 ps-1 fw-bold'>{e?.ShapeName}</div>
                                        <div className='w-50 pe-1 end_pcls'>{((e?.metalfinewt)?.toFixed(3))} gm</div>
                                    </div>
                                    })
                                }    
                                <div className='d-flex align-items-center text-break'>
                                    <div className='w-50 ps-1 fw-bold'>GROSS WT</div>
                                    <div className='w-50 pe-1 end_pcls'>{result?.mainTotal?.grosswt?.toFixed(3)} gm</div>
                                </div>    
                                <div className='d-flex align-items-center text-break'>
                                    <div className='w-50 ps-1 fw-bold'>NET WT</div>
                                    <div className='w-50 pe-1 end_pcls'>{(result?.mainTotal?.NetWt + result?.mainTotal?.LossWt) ?.toFixed(3)} gm</div>
                                </div>    
                                <div className='d-flex align-items-center text-break'>
                                    <div className='w-50 ps-1 fw-bold'>LOSS WT</div>
                                    <div className='w-50 pe-1 end_pcls'>{result?.mainTotal?.LossWt?.toFixed(3)} gm</div>
                                </div>    
                                <div className='d-flex align-items-center text-break'>
                                    <div className='w-50 ps-1 fw-bold'>DIAMOND WT</div>
                                    <div className='w-50 pe-1 end_pcls'>{result?.mainTotal?.diamonds?.Pcs} / {result?.mainTotal?.diamonds?.Wt?.toFixed(3)} cts</div>
                                </div>    
                                <div className='d-flex align-items-center text-break'>
                                    <div className='w-50 ps-1 fw-bold'>STONE WT</div>
                                    <div className='w-50 pe-1 end_pcls'>{result?.mainTotal?.colorstone?.Pcs} / {result?.mainTotal?.colorstone?.Wt?.toFixed(3)} cts</div>
                                </div>    
                                <div className='d-flex align-items-center text-break'>
                                    <div className='w-50 ps-1 fw-bold'>MISC WT</div>
                                    <div className='w-50 pe-1 end_pcls'>{result?.mainTotal?.misc?.IsHSCODE_0_pcs} / {result?.mainTotal?.misc?.Wt?.toFixed(3)} gm</div>
                                </div>    
                                <div className='d-flex align-items-center btop_pcls text-break bg_c_pcls'>
                                    <div className='w-50 ps-1 fw-bold'>&nbsp;</div>
                                    <div className='w-50 pe-1 end_pcls'></div>
                                </div>    
                            </div>
                            <div className='w-50 tb_fs_pcls bright_pcls bbottom_pcls'>
                                <div className='d-flex align-items-center text-break'>
                                    <div className='w-50 ps-1 fw-bold'>GOLD</div>
                                    <div className='w-50 pe-1 end_pcls'>{formatAmount(((result?.mainTotal?.metal?.Amount - notGoldMetalTotal) / result?.header?.CurrencyExchRate))}</div>
                                </div>
                                {
                                    MetShpWise?.map((e, i) => {
                                        return <div className='d-flex align-items-center text-break' key={i}>
                                        <div className='w-50 ps-1 fw-bold'>{e?.ShapeName}</div>
                                        <div className='w-50 pe-1 end_pcls'>{formatAmount((e?.Amount / result?.header?.CurrencyExchRate))}</div>
                                    </div>
                                    })
                                }    
                                <div className='d-flex align-items-center text-break'>
                                    <div className='w-50 ps-1 fw-bold'>DIAMOND</div>
                                    <div className='w-50 pe-1 end_pcls'>{formatAmount((result?.mainTotal?.diamonds?.Amount / result?.header?.CurrencyExchRate))}</div>
                                </div>    
                                <div className='d-flex align-items-center text-break'>
                                    <div className='w-50 ps-1 fw-bold'>CST</div>
                                    <div className='w-50 pe-1 end_pcls'>{formatAmount((result?.mainTotal?.colorstone?.Amount / result?.header?.CurrencyExchRate))}</div>
                                </div>    
                                <div className='d-flex align-items-center text-break'>
                                    <div className='w-50 ps-1 fw-bold'>MISC</div>
                                    <div className='w-50 pe-1 end_pcls'>{formatAmount((result?.mainTotal?.misc?.IsHSCODE_0_amount / result?.header?.CurrencyExchRate))}</div>
                                </div>    
                                <div className='d-flex align-items-center text-break'>
                                    <div className='w-50 ps-1 fw-bold'>MAKING</div>
                                    <div className='w-50 pe-1 end_pcls'>{formatAmount(((result?.mainTotal?.MakingAmount + result?.mainTotal?.diamonds?.SettingAmount + result?.mainTotal?.colorstone?.SettingAmount) / result?.header?.CurrencyExchRate))}</div>
                                </div>    
                                <div className='d-flex align-items-center text-break'>
                                    <div className='w-50 ps-1 fw-bold'>OTHER</div>
                                    <div className='w-50 pe-1 end_pcls'>{formatAmount(((result?.mainTotal?.OtherCharges)))}</div>
                                </div>    
                                <div className='d-flex align-items-center text-break'>
                                    <div className='w-50 ps-1 fw-bold'>{result?.header?.AddLess > 0 ? 'ADD' : 'LESS'}</div>
                                    <div className='w-50 pe-1 end_pcls'>{formatAmount((result?.header?.AddLess / result?.header?.CurrencyExchRate))}</div>
                                </div>    
                                <div className='d-flex align-items-center text-break btop_pcls bg_c_pcls'>
                                    <div className='w-50 ps-1 fw-bold'>TOTAL</div>
                                    <div className='w-50 pe-1 end_pcls'>{formatAmount(( (((result?.mainTotal?.TotalAmount + result?.header?.AddLess + result?.header?.FreightCharges)/ result?.header?.CurrencyExchRate) + result?.allTaxesTotal)))}</div>
                                </div>    
                            </div>
                        </div>
                    </div>
                    <div className='col2_s_pcls'>
                        <div className='fw-bold centerall_pcls bg_c_pcls bright_pcls bbottom_pcls bleft_pcls'>DIAMOND DETAILS</div>
                        <div className='bbottom_pcls'>
                            {
                                diamondArr?.map((e, i) => {
                                    return(
                                        <div className='w-100 d-flex align-items-center bright_pcls bleft_pcls ' key={i}>
                                        <div className='w-50 start_center_pcls pdl_pcls fw-bold ps-2'>{e?.ShapeName + " " + e?.QualityName + " " + e?.Colorname}</div>
                                        <div className='w-50 end_pcls pdr_pcls pe-2'>{e?.Pcs} / {e?.Wt?.toFixed(3)} cts</div>
                                    </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className='col3_s_pcls'>
                        <div className='fw-bold centerall_pcls bg_c_pcls bright_pcls bbottom_pcls bleft_pcls'>OTHER DETAILS</div>
                        <div className='w-100 d-flex align-items-center bright_pcls bleft_pcls bbottom_pcls'>
                            <div className='w-50 start_center_pcls pdl_pcls fw-bold ps-2'>RATE IN 24KT</div>
                            <div className='w-50 end_pcls pdr_pcls'>500.00</div>
                        </div>
                    </div>
                    <div className='col4_s_pcls'>
                    <div className='fw-bold centerall_pcls bg_c_pcls bright_pcls bbottom_pcls bleft_pcls'>REMARK</div>
                        <div className='p-1 bright_pcls bbottom_pcls bleft_pcls' dangerouslySetInnerHTML={{__html:result?.header?.PrintRemark}}></div>
                    </div>
                    <div className='col5_s_pcls d-flex justify-content-center align-items-end bbottom_pcls bleft_pcls bright_pcls'>Created By</div>
                    <div className='col6_s_pcls d-flex justify-content-center align-items-end bbottom_pcls bleft_pcls bright_pcls'>Checked By</div>
                </div>
        </div>
    </div> : <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto"> {msg} </p> }
    </>
  )
}

export default PackingListS;