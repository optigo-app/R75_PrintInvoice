import React, { useEffect, useState } from 'react'
import style from "../../assets/css/prints/RetailPrint3.module.css";
import { ToWords } from 'to-words';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import { cloneDeep } from 'lodash';
import Loader from '../../components/Loader';
import "../../assets/css/prints/retailprint3.css";
import {
    HeaderComponent,
    NumberWithCommas,
    apiCall,
    handleImageError,
    handlePrint,
    isObjectEmpty,
    taxGenrator,
    FooterComponent,
    fixedValues,
    formatAmount,
    checkMsg,
} from "../../GlobalFunctions";

const RetailPrint3 = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
    const [msg, setMsg] = useState("");
    const [loader, setLoader] = useState(true);
    const toWords = new ToWords();
    const [data, setData] = useState({});
    const [label, setlabel] = useState([]);
    const [headerData, setHeaderData] = useState({});
    const [result, setResult] = useState(null);
    const [header, setHeader] = useState(null);
    const [footer, setFooter] = useState(null);
    const [misctotPcs, setMisctotPcs] = useState(null);
    const [gmwt, setGmwt] = useState(null);
    const [ctwwt, setCtwwt] = useState(null);
    const [totPcs, setTotPcs] = useState(0);
    const [totWt, setTotWt] = useState(0);
    const [document, setDocument] = useState({
        aadharcard: "",
        nri: "",
        passport: "",
    });
    const [isImageWorking, setIsImageWorking] = useState(true);
        const handleImageErrors = () => {
            setIsImageWorking(false);
        };
    // const loadData = (data) => {
    //     let head = HeaderComponent("1", data?.BillPrint_Json[0]);
    //     setHeader(head);
    //     let footers = FooterComponent("2", data?.BillPrint_Json[0]);
    //     setFooter(footers);
    //     setHeaderData(data?.BillPrint_Json[0]);
    //     let printArr = data?.BillPrint_Json[0]?.Printlable.split("\r\n");
    //     setlabel(printArr);
    //     let datas = OrganizeDataPrint(data?.BillPrint_Json[0], data?.BillPrint_Json1, data?.BillPrint_Json2);
    //     let resultArray = [];
    //     datas?.resultArray?.forEach((e, i) => {
    //         let obj = cloneDeep(e);
    //         let diamonds = [];
    //         obj?.diamonds?.forEach((ele, ind) => {
    //             let findDiamond = diamonds?.findIndex((elem, index) => elem?.QualityName === ele?.QualityName);
    //             if (findDiamond === -1) {
    //                 diamonds.push(ele);
    //             } else {
    //                 diamonds[findDiamond].Pcs += ele?.Pcs;
    //                 diamonds[findDiamond].Wt += ele?.Wt;
    //                 diamonds[findDiamond].Amount += ele?.Amount;
    //             }
    //         });
    //         obj.quaDia = diamonds;
    //         resultArray.push(obj);
    //     });
    //     datas.resultArray = resultArray;
    //     setData(datas);
    //     let documentDetails = data?.BillPrint_Json[0]?.DocumentDetail.split("#@#");
    //     let documents = {
    //         aadharcard: "",
    //         nri: "",
    //         passport: "",
    //     };
    //     documentDetails?.forEach((e, i) => {
    //         let data = e?.split("#-#");
    //         if (data[0] === "Aadhar Card") {
    //             documents.aadharcard = data[1];
    //         } else if (data[0] === "NRI ID") {
    //             documents.nri = data[1];
    //         } else if (data[0] === "FOREIGN PASSPORT") {
    //             documents.passport = data[1];
    //         }
    //     });
    //     setDocument(documents);
    // }
    const loadData = (data) => {
        const copydata = cloneDeep(data);

        let address = copydata?.BillPrint_Json[0]?.Printlable?.split("\r\n");
        copydata.BillPrint_Json[0].address = address;
        
        let datass = OrganizeDataPrint(
          copydata?.BillPrint_Json[0],
          copydata?.BillPrint_Json1,
          copydata?.BillPrint_Json2
        );
        const datas = cloneDeep(datass);
        let finalArr = [];

        datas?.resultArray?.forEach((a) => {
          if(a?.GroupJob === ''){
            finalArr.push(a);
        }else{
          let b = cloneDeep(a);
          
          let find_record = finalArr.findIndex((el) => el?.GroupJob === b?.GroupJob);
          if(find_record === -1){
            b.count = 1;
            finalArr.push(b);
          }else{
            if(finalArr[find_record]?.GroupJob !== finalArr[find_record]?.SrJobno){
                finalArr[find_record].designno = b?.designno;
                finalArr[find_record].HUID = b?.HUID; 
            }
            finalArr[find_record].count +=  1;
            finalArr[find_record].grosswt += b?.grosswt;
            finalArr[find_record].NetWt += b?.NetWt;
            finalArr[find_record].LossWt += b?.LossWt;
            finalArr[find_record].TotalAmount += b?.TotalAmount;
            finalArr[find_record].DiscountAmt += b?.DiscountAmt;
            finalArr[find_record].UnitCost += b?.UnitCost;
            finalArr[find_record].MakingAmount += b?.MakingAmount;
            finalArr[find_record].OtherCharges += b?.OtherCharges;
            finalArr[find_record].Quantity += b?.Quantity;
            finalArr[find_record].Wastage += b?.Wastage;
            finalArr[find_record].totals.metal.IsPrimaryMetal += b?.totals?.metal?.IsPrimaryMetal;
            finalArr[find_record].totals.diamonds.Wt += b?.totals?.diamonds?.Wt;
            // finalArr[find_record].diamonds_d = [...finalArr[find_record]?.diamonds ,...b?.diamonds]?.flat();
            finalArr[find_record].diamonds = [...finalArr[find_record]?.diamonds ,...b?.diamonds]?.flat();
            // finalArr[find_record].colorstone_d = [...finalArr[find_record]?.colorstone ,...b?.colorstone]?.flat();
            finalArr[find_record].colorstone = [...finalArr[find_record]?.colorstone ,...b?.colorstone]?.flat();
            // finalArr[find_record].metal_d = [...finalArr[find_record]?.metal ,...b?.metal]?.flat();
            finalArr[find_record].metal = [...finalArr[find_record]?.metal ,...b?.metal]?.flat();
            finalArr[find_record].misc = [...finalArr[find_record]?.misc ,...b?.misc]?.flat();
            finalArr[find_record].finding = [...finalArr[find_record]?.finding ,...b?.finding]?.flat();
            finalArr[find_record].totals.diamonds.Wt += b?.totals?.diamonds?.Wt;
            finalArr[find_record].totals.diamonds.Pcs += b?.totals?.diamonds?.Pcs;
            finalArr[find_record].totals.diamonds.Amount += b?.totals?.diamonds?.Amount;
            finalArr[find_record].totals.colorstone.Wt += b?.totals?.colorstone?.Wt;
            finalArr[find_record].totals.colorstone.Pcs += b?.totals?.colorstone?.Pcs;
            finalArr[find_record].totals.colorstone.Amount += b?.totals?.colorstone?.Amount;
            finalArr[find_record].totals.misc.Wt += b?.totals?.misc?.Wt;
            finalArr[find_record].totals.misc.Pcs += b?.totals?.misc?.Pcs;
            finalArr[find_record].totals.misc.Amount += b?.totals?.misc?.Amount;
            // finalArr[find_record].misc_d = [...finalArr[find_record]?.misc ,...b?.misc]?.flat();
          }
        }
        })
    
        datas.resultArray = finalArr;

        datas?.resultArray?.forEach((e) => {
            let dia = [];
            e?.diamonds?.forEach((el) => {
                
                let findrec = dia?.findIndex((a) => a?.ShapeName === el?.ShapeName && a?.QualityName === el?.QualityName && a?.Colorname === el?.Colorname);
                if(findrec === -1){
                    let obj = {...el};
                    obj.dwt = el?.Wt;
                    obj.dpcs = el?.Pcs;
                    obj.Rate = el?.Rate;
                    obj.drate = el?.Rate;
                    obj.damt = el?.Amount;
                    dia.push(obj);
                }else{
                    dia[findrec].dwt += el?.Wt;
                    dia[findrec].dpcs += el?.Pcs;
                    dia[findrec].drate += el?.Rate;
                    dia[findrec].Rate += el?.Rate;
                    dia[findrec].damt += el?.Amount;
                }
            })
            e.diamonds = dia;

            let clr = [];
            e?.colorstone?.forEach((el) => {
                
                let findrec = clr?.findIndex((a) => a?.ShapeName === el?.ShapeName && a?.QualityName === el?.QualityName && a?.Colorname === el?.Colorname);
                if(findrec === -1){
                    let obj = {...el};
                    obj.cswt = el?.Wt;
                    obj.cspcs = el?.Pcs;
                    obj.Rate = el?.Rate;
                    obj.csrate = el?.Rate;
                    obj.csamt = el?.Amount;
                    clr.push(obj);
                }else{
                    clr[findrec].cswt += el?.Wt;
                    clr[findrec].cspcs += el?.Pcs;
                    clr[findrec].csrate += el?.Rate;
                    clr[findrec].Rate += el?.Rate;
                    clr[findrec].csamt += el?.Amount;
                }
            })
            e.colorstone = clr;

            let a = e?.misc?.filter((el) => el?.IsHSCOE === 0);
            e.misc = a;

            let miscarr = [];
            e?.misc?.forEach((el) => {
                let findrec = miscarr?.findIndex((a) => a?.ShapeName === el?.ShapeName && a?.isRateOnPcs === el?.isRateOnPcs)
                if(findrec === -1){
                    let obj = {...el};
                    obj.miscwt = el?.Wt;
                    obj.miscpcs = el?.Pcs;
                    obj.miscrate = el?.Rate;
                    obj.Rate = el?.Rate;
                    obj.miscamt = el?.Amount;
                    miscarr.push(obj);
                }else{
                    miscarr[findrec].miscwt += el?.Wt;
                    miscarr[findrec].miscpcs += el?.Pcs;
                    miscarr[findrec].miscrate += el?.Rate;
                    miscarr[findrec].Rate = el?.Rate;
                    miscarr[findrec].miscamt += el?.Amount;
                }
            })
            e.misc = miscarr;
        })

        let totmiscwt = 0;
        let gmwt = 0;
        let ctwwt = 0;
        datas?.resultArray?.forEach((e) => {
            e?.misc?.forEach((el) => {
                totmiscwt += el?.Wt;
                gmwt += el?.Wt;
            })
            e?.finding?.forEach((el) => {
                gmwt += el?.Wt;
            })
            e?.metal?.forEach((el) => {
                    gmwt += el?.Wt;
            })
            e?.diamonds?.forEach((el) => {
                ctwwt += el?.dwt;
            })
            e?.colorstone?.forEach((el) => {
                ctwwt += el?.cswt;
            })
        })
        setCtwwt(ctwwt)
        setGmwt(gmwt)
        setMisctotPcs(totmiscwt)

        datas?.resultArray?.sort((a,b) => a?.designno - b?.designno)

        let tot_pcs2 = 0;
        let tot_wt2 = 0;
        datas?.resultArray?.forEach((e) => {
                e?.diamonds?.forEach((el) => {
                    tot_pcs2 += el?.dpcs;
                    tot_wt2 += el?.dwt;
                })
               
        })
        datas?.resultArray?.forEach((e) => {
                e?.colorstone?.forEach((el) => {
                    tot_pcs2 += el?.cspcs;
                    tot_wt2 += el?.cswt;
                })
               
        })
        setTotPcs(tot_pcs2)
        setTotWt(tot_wt2)
        setResult(datas);
    }
    useEffect(() => {
        const sendData = async () => {
            try {
                const data = await apiCall(token, invoiceNo, printName, urls, evn, ApiVer);
                if (data?.Status === '200') {
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
                    // setMsg(data?.Message);
                    const err = checkMsg(data?.Message);
                    console.log(data?.Message);
                    setMsg(err);
                }
            } catch (error) {
                console.error(error);
            }
        }
        sendData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        loader ? <Loader /> : msg === "" ? <>
            <div className={`container max_width_container ${style?.RetailPrint3} pad_60_allPrint px-1 mt-1 RetailPrint3`}>
                {/* buttons */}
                <div className="d-flex justify-content-end align-items-center print_sec_sum4 mb-4 mt-4">
                    <div className="form-check ps-3">
                        <input type="button" className="btn_white blue" value="Print" onClick={(e) => handlePrint(e)} />
                    </div>
                </div>
                {/* header line */}
                <div className="bgGrey px-2 py-1 text-white">
                    <p className="text-white fs-5 fw-bold">{result?.header?.PrintHeadLabel}</p>
                </div>
                {/* header */}
                <div className="my-1 border d-flex w-100">
                    <div className=" p-2" style={{width:'70%'}}>
                        <p className='fs_rp_2'>{result?.header?.lblBillTo}</p>
                        <p className='fw-bold'>{result?.header?.customerfirmname}</p>
                        <p>Address: {result?.header?.customerAddress1}</p>
                        <p>{result?.header?.customerAddress2}</p>
                        <p>{result?.header?.customercity1}-{result?.header?.PinCode}</p>
                        <p>{result?.header?.customeremail1}</p>
                    </div>
                    <div className=" p-2 " style={{width:'30%'}}>
                        <div className="d-flex w-100">
                            <p className='fw-bold fs_rp_2 w_h2_rp'>Tax Invoice No:</p>
                            <p  className='fs_rp_2 w_h2_rp_2'>: {result?.header?.InvoiceNo}</p>
                        </div>
                        <div className="d-flex w-100">
                            <p className='fw-bold fs_rp_2 w_h2_rp' >Date	:</p>
                            <p  className='fs_rp_2 w_h2_rp_2'>: {result?.header?.EntryDate}</p>
                        </div>
                        <div className="d-flex w-100">
                            <p className='fw-bold fs_rp_2 w_h2_rp' >{result?.header?.HSN_No_Label}/SAC</p>
                            <p  className='fs_rp_2 w_h2_rp_2'>:  {result?.header?.HSN_No}</p>
                        </div>
                        { result?.header?.CustGstNo === '' ? <p className='fw-bold fs_rp_2  d-flex w-100'><span>GSTIN -</span>&nbsp;&nbsp; <span>{result?.header?.Cust_VAT_GST_No}</span></p> : <p className='fw-bold fs_rp_2 w_h2_rp'><span>GSTIN - </span><span>{result?.header?.CustGstNo}</span></p>}
                        
                        <p className='fw-bold fs_rp_2 w_h2_rp'>{result?.header?.Cust_CST_STATE} - {result?.header?.Cust_CST_STATE_No}</p>
                        <p className='fw-bold fs_rp_2 w_h2_rp'>PAN - {result?.header?.CustPanno}</p>
                        <p> </p>
                    </div>
                </div>
                {/* table header */}
                {/* <div className="d-flex border">
                    <div className={`d-flex justify-content-center align-items-center ${style?.Sr} border-end`}><p className="fw-bold text-center p-1"> Sr#	</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.Product} border-end`}><p className="fw-bold text-center p-1"> Product Description	</p></div>
                    <div className={`${style?.Material}`}>
                        <div className="d-grid h-100">
                            <div className="d-flex border-bottom"><p className="fw-bold w-100 text-center p-1">Material Description</p></div>
                            <div className="d-flex">
                                <p className={`fw-bold w-100 text-center border-end p-1 ${style?.material}`}>Material</p>
                                <p className={`fw-bold w-100 text-center border-end p-1 ${style?.qty}`}>Qty</p>
                                <p className={`fw-bold w-100 text-center border-end p-1 ${style?.color}`}>Color</p>
                                <p className={`fw-bold w-100 text-center border-end p-1 ${style?.pcs}`}>Pcs</p>
                                <p className={`fw-bold w-100 text-center border-end p-1 ${style?.gWt}`}>GWt.</p>
                                <p className={`fw-bold w-100 text-center border-end p-1 ${style?.nWt}`}>NWt.</p>
                                <p className={`fw-bold w-100 text-center border-end p-1 ${style?.rate}`}>Rate</p>
                                <p className={`fw-bold w-100 text-center border-end p-1 ${style?.amount}`}>Amount</p>
                                <p className={`fw-bold w-100 text-center border-end p-1 ${style?.making}`}>Making</p>
                                <p className={`fw-bold w-100 text-center border-end p-1 ${style?.discount}`}>Discount</p>
                                <p className={`fw-bold w-100 text-center p-1 ${style?.total}`}>Total</p>
                            </div>
                        </div>
                    </div>
                </div> */}
                {/* table body */}
                <table className='w-100'>
                    <tbody>
                        <tr className="d-flex border">
                            <td className={`d-flex justify-content-center align-items-center ${style?.Sr} border-end p-0`}><p className="fw-bold text-center p-1 fs_rp_2"> Sr#	</p></td>
                            <td className={`d-flex justify-content-center align-items-center ${style?.Product} border-end p-0`}><p className="fw-bold text-center fs_rp_2 p-1"> Product Description	</p></td>
                            <td className={`${style?.Material} p-0`}>
                            <div className="d-flex border-bottom"><p className="fw-bold w-100 text-center p-1 fs_rp_2">Material Description</p></div>
                                <table className='w-100 p-0'>
                                    <tbody>
                                        <tr>
                                                    <td className={`p-0 fw-bold text-center border-end p-1 fs_rp_2 ${style?.material}`}>Material</td>
                                                    <td className={`p-0 fw-bold text-center border-end p-1 fs_rp_2 ${style?.qty}`}>Qty</td>
                                                    <td className={`p-0 fw-bold text-center border-end p-1 fs_rp_2 ${style?.color}`}>Color</td>
                                                    <td className={`p-0 fw-bold text-center border-end p-1 fs_rp_2 ${style?.pcs}`}>Pcs</td>
                                                    <td className={`p-0 fw-bold text-center border-end p-1 fs_rp_2 ${style?.gWt}`}>GWt.</td>
                                                    <td className={`p-0 fw-bold text-center border-end p-1 fs_rp_2 ${style?.nWt}`}>NWt.</td>
                                                    <td className={`p-0 fw-bold text-center border-end p-1 fs_rp_2 ${style?.rate}`}>Rate</td>
                                                    <td className={`p-0 fw-bold text-center border-end p-1 fs_rp_2 ${style?.amount}`}>Amount</td>
                                                    <td className={`p-0 fw-bold text-center border-end p-1 fs_rp_2 ${style?.making}`}>Making</td>
                                                    <td className={`p-0 fw-bold text-center border-end p-1 fs_rp_2 ${style?.discount}`}>Discount</td>
                                                    <td className={`p-0 fw-bold text-center fs_rp_2 p-1 ${style?.total}`}>Total</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        {
                            result?.resultArray?.map((e, i) => {
                                return <tr className="d-flex border-start border-end border-bottom tablerow_rp fs_rp_2" key={i}>
                                    <td className={`d-flex justify-content-center align-items-center ${style?.Sr} border-end`}><p className="fw-bold text-center p-1 fs_rp_2"> {i + 1} </p></td>
                                    <td className={`${style?.Product} border-end minw_rp2`}>
                                        <p className="text-center p-1 fs_rp_2" style={{wordBreak:'break-word'}}>{e?.SubCategoryname} {e?.Categoryname}  </p>
                                        <p className="fw-bold text-center p-1 fs_rp_2" style={{wordBreak:'break-word'}}> {e?.designno} | {e?.SrJobno} </p>
                                        <img src={e?.DesignImage} alt="#job_img" className='imgWidth' onError={handleImageError} />
                                    </td>
                                    <td className={`${style?.Material} p-0`}>
                                        <table className='w-100 h-100'>
                                            <tbody>
                                                {/* <tr>
                                                    <td className={`border-end border-bottom ${style?.material}`}>
                                                        <p className='p-1'>{e?.MetalType}</p>
                                                    </td>
                                                    <td className={`border-end border-bottom ${style?.qty}`}>
                                                        <p className='p-1'>{e?.MetalPurity}</p>
                                                    </td>
                                                    <td className={`border-end border-bottom ${style?.color}`}>
                                                        <p className='p-1'></p>
                                                    </td>
                                                    <td className={`border-end border-bottom ${style?.pcs}`}>
                                                        <p className=' p-1'></p>
                                                    </td>
                                                    <td className={`border-end ${style?.gWt}`} rowSpan={2}>
                                                        <p className='p-1'>{e?.grosswt?.toFixed(3)}</p>
                                                    </td>
                                                    <td className={`border-end border-bottom ${style?.nWt}`}>
                                                        <p className='p-1'>{(e?.NetWt + e?.LossWt)?.toFixed(3)}</p>
                                                    </td>
                                                    <td className={` text-center border-end border-bottom ${style?.rate}`}>
                                                        <p className='p-1 '>5700.00</p>
                                                    </td>
                                                    <td className={`text-center border-end border-bottom p-1 ${style?.amount}`}>
                                                        <p>57478.80</p>
                                                    </td>
                                                    <td className={`text-center border-end p-1 ${style?.making}`} rowSpan={2}><p>{formatAmount((((e?.MakingAmount + e?.totals?.diamonds?.SettingAmount + e?.totals?.colorstone?.SettingAmount)/(result?.header?.CurrencyExchRate))))}</p></td>
                                                    <td className={`text-center border-end p-1 ${style?.discount}`} rowSpan={2}><p>{formatAmount(e?.DiscountAmt)}</p></td>
                                                    <td className={`text-center p-1 ${style?.total}`} rowSpan={2}><p>{formatAmount(e?.TotalAmount)}</p></td>
                                                </tr> */}
                                                {/* <tr>
                                                    <td className={` border-end ${style?.material}`}>
                                                        <p className='p-1'>{e?.MetalType}</p>
                                                    </td>
                                                    <td className={` border-end ${style?.qty}`}>
                                                        <p className='p-1'>{e?.MetalPurity}</p>
                                                    </td>
                                                    <td className={` border-end ${style?.color}`}>
                                                        <p className='p-1'></p>
                                                    </td>
                                                    <td className={` border-end ${style?.pcs}`}>
                                                        <p className='d-flex justify-content-end align-items-center  p-1'></p>
                                                    </td>
                                                    <td className={`text-end border-end   ${style?.nWt}`}>
                                                        <p className='p-1'>{NumberWithCommas(e?.NetWt, 3)}</p>
                                                    </td>
                                                    <td className={` border-end ${style?.rate}`}>
                                                        <p className='p-1 '>5700.00</p>
                                                    </td>
                                                    <td className={`text-center border-end p-1 ${style?.amount}`}>
                                                        <p>57478.80</p>
                                                    </td>
                                                </tr> */}
                                                {
                                                    e?.metal?.map((el, ind) => {
                                                        return         <tr className='border-bottom' key={ind}>
                                                        <td className={`border-end border-bottom ${style?.material}`}>
                                                            <p className='p-1 fs_rp_2'>{ el?.IsPrimaryMetal === 1 ? el?.ShapeName : ''}</p>
                                                        </td>
                                                        <td className={`border-end border-bottom ${style?.qty}`}>
                                                            <p className='p-1 fs_rp_2'>{el?.QualityName}</p>
                                                        </td>
                                                        <td className={`border-end border-bottom ${style?.color}`}>
                                                            <p className='p-1 fs_rp_2'>{el?.IsPrimaryMetal === 1 ? '' : el?.Colorname}</p>
                                                        </td>
                                                        <td className={`border-end border-bottom ${style?.pcs}`}>
                                                            <p className=' p-1 text-end fs_rp_2'>{el?.IsPrimaryMetal === 1 ? '' : el?.Pcs}</p>
                                                        </td>
                                                      {ind === 0 &&  <td className={`border-end ${style?.gWt}`} rowSpan={e?.metal?.length + e?.diamonds?.length + e?.colorstone?.length + e?.misc?.length + e?.finding?.length + e?.other_details?.length}>
                                                            <p className='p-1 text-end fs_rp_2'>{e?.grosswt?.toFixed(3)}</p>
                                                        </td>}
                                                        <td className={`border-end border-bottom ${style?.nWt}`}>
                                                            {/* <p className='p-1 text-end fs_rp_2'>{(e?.NetWt + e?.LossWt)?.toFixed(3)}</p> */}
                                                            <p className='p-1 text-end fs_rp_2'>{(el?.Wt )?.toFixed(3)}</p>
                                                        </td>
                                                        <td className={` text-center border-end border-bottom ${style?.rate}`}>
                                                            {/* <p className='p-1 text-end fs_rp_2'>{formatAmount(el?.Amount / ((e?.NetWt + e?.LossWt) === 0 ? 1 : (e?.NetWt + e?.LossWt)))}</p> */}
                                                            <p className='p-1 text-end fs_rp_2'>{formatAmount(el?.Amount / ((el?.Wt) === 0 ? 1 : (el?.Wt)))}</p>
                                                        </td>
                                                        <td className={`text-center border-end border-bottom p-1 ${style?.amount}`}>
                                                            <p className='text-end fs_rp_2'>{formatAmount(el?.Amount)}</p>
                                                        </td>
                                                       {ind === 0 && <td className={`text-center fs_rp_2 border-end p-1 ${style?.making}`} rowSpan={e?.metal?.length + e?.diamonds?.length + e?.colorstone?.length + e?.misc?.length + e?.finding?.length + e?.other_details?.length}><p className='text-end fs_rp_2'>{formatAmount((((e?.MakingAmount + e?.totals?.diamonds?.SettingAmount + e?.totals?.colorstone?.SettingAmount)/(result?.header?.CurrencyExchRate))))}</p></td>}
                                                        {ind === 0 && <td className={`text-center fs_rp_2 border-end p-1 ${style?.discount}`} rowSpan={e?.metal?.length + e?.diamonds?.length + e?.colorstone?.length + e?.misc?.length + e?.finding?.length + e?.other_details?.length}><p className='text-end fs_rp_2'>{formatAmount(e?.DiscountAmt)}</p></td>}
                                                        {ind === 0 && <td className={`text-center fs_rp_2 p-1 ${style?.total}`} rowSpan={e?.metal?.length + e?.diamonds?.length + e?.colorstone?.length + e?.misc?.length + e?.finding?.length + e?.other_details?.length}><p className='text-end fs_rp_2'>{formatAmount(e?.TotalAmount)}</p></td>}
                                                    </tr>
                                                    })
                                                }
                                                {/* {
                                                    e?.metal?.map((el, ind) => {
                                                        return(
                                                            <tr className='border-bottom' key={ind}>
                                                        <td className={` border-end ${style?.material}`}>
                                                            <p className='p-1 fs_rp_2'>{el?.ShapeName}</p>
                                                        </td>
                                                        <td className={` border-end ${style?.qty}`}>
                                                            <p className='p-1 fs_rp_2'>{el?.QualityName}</p>
                                                        </td>
                                                        <td className={` border-end ${style?.color}`}>
                                                            <p className='p-1 fs_rp_2'>{el?.Colorname}</p>
                                                        </td>
                                                        <td className={` border-end ${style?.pcs}`}>
                                                            <p className='d-flex justify-content-end align-items-center text-end  p-1 fs_rp_2'></p>
                                                        </td>
                                                        <td className={`text-end border-end   ${style?.nWt}`}>
                                                            <p className='p-1 text-end fs_rp_2'>{el?.Wt?.toFixed(3)}</p>
                                                        </td>
                                                        <td className={` border-end ${style?.rate}`}>
                                                            <p className='p-1 text-end fs_rp_2'>{formatAmount((el?.Amount / (el?.isRateOnPcs === 1 ? (el?.Pcs === 0 ? 1 : el?.Pcs) : (el?.Wt === 0 ? 1 : el?.Wt))))}</p>
                                                        </td>
                                                        <td className={`text-center border-end p-1 ${style?.amount}`}>
                                                            <p className='text-end fs_rp_2'>{formatAmount(el?.Amount)}</p>
                                                        </td>
                                                    </tr>
                                                        )
                                                    })
                                                } */}
                                                {
                                                    e?.diamonds?.map((el, ind) => {
                                                        return <tr className='border-bottom' key={ind}>
                                                        <td className={` border-end ${style?.material}`}>
                                                            <p className='p-1 fs_rp_2'>{el?.MasterManagement_DiamondStoneTypeName}</p>
                                                        </td>
                                                        <td className={` border-end ${style?.qty}`}>
                                                            <p className='p-1 fs_rp_2'>{el?.QualityName}</p>
                                                        </td>
                                                        <td className={` border-end ${style?.color}`}>
                                                            <p className='p-1 fs_rp_2'>{el?.Colorname}</p>
                                                        </td>
                                                        <td className={` border-end ${style?.pcs}`}>
                                                            <p className='d-flex justify-content-end align-items-center text-end  p-1 fs_rp_2'>{el?.dpcs}</p>
                                                        </td>
                                                        <td className={`text-end border-end   ${style?.nWt}`}>
                                                            <p className='p-1 text-end fs_rp_2'>{el?.dwt?.toFixed(3)}</p>
                                                        </td>
                                                        <td className={` border-end ${style?.rate}`}>
                                                            <p className='p-1 text-end fs_rp_2'>{formatAmount((el?.damt / (el?.isRateOnPcs === 1 ? (el?.dpcs === 0 ? 1 : el?.dpcs) : (el?.dwt === 0 ? 1 : el?.dwt))))}</p>
                                                        </td>
                                                        <td className={`text-center border-end p-1 ${style?.amount}`}>
                                                            <p className='text-end fs_rp_2'>{formatAmount(el?.damt)}</p>
                                                        </td>
                                                    </tr>
                                                    })
                                                }
                                                    {
                                                    e?.colorstone?.map((el, ind) => {
                                                        return <tr className='border-bottom' key={ind}>
                                                        <td className={` border-end ${style?.material}`}>
                                                            <p className='fs_rp_2 p-1'>{el?.MasterManagement_DiamondStoneTypeName}</p>
                                                        </td>
                                                        <td className={` border-end ${style?.qty}`}>
                                                            <p className='fs_rp_2 p-1'>{el?.QualityName}</p>
                                                        </td>
                                                        <td className={` border-end ${style?.color}`}>
                                                            <p className='fs_rp_2 p-1'>{el?.Colorname}</p>
                                                        </td>
                                                        <td className={` border-end ${style?.pcs}`}>
                                                            <p className='fs_rp_2 d-flex justify-content-end align-items-center text-end   p-1'>{el?.cspcs}</p>
                                                        </td>
                                                        <td className={`text-end border-end   ${style?.nWt}`}>
                                                            <p className='p-1 text-end fs_rp_2'>{el?.cswt?.toFixed(3)}</p>
                                                        </td>
                                                        <td className={` border-end ${style?.rate}`}>
                                                            <p className='p-1 text-end fs_rp_2'>{formatAmount((el?.csamt / (el?.isRateOnPcs === 1 ? (el?.cspcs === 0 ? 1 : el?.cspcs) : (el?.cswt === 0 ? 1 : el?.cswt))))}</p>
                                                        </td>
                                                        <td className={`text-center border-end p-1 ${style?.amount}`}>
                                                            <p className='text-end fs_rp_2'>{formatAmount(el?.csamt)}</p>
                                                        </td>
                                                    </tr>
                                                    })
                                                }
                                                 {
                                                    e?.misc?.map((el, ind) => {
                                                        return <tr className='border-bottom' key={ind}>
                                                        <td className={` border-end ${style?.material}`}>
                                                            <p className='fs_rp_2 p-1'>{el?.MasterManagement_DiamondStoneTypeName}</p>
                                                        </td>
                                                        <td className={` border-end ${style?.qty}`}>
                                                            <p className='fs_rp_2 p-1'>{el?.QualityName}</p>
                                                        </td>
                                                        <td className={` border-end ${style?.color}`}>
                                                            <p className='fs_rp_2 p-1'>{el?.Colorname}</p>
                                                        </td>
                                                        <td className={` border-end ${style?.pcs}`}>
                                                            <p className='text-end fs_rp_2 d-flex justify-content-end align-items-center  p-1'>{el?.miscpcs}</p>
                                                        </td>
                                                        <td className={`text-end border-end   ${style?.nWt}`}>
                                                            <p className='p-1 text-end fs_rp_2'>{el?.miscwt?.toFixed(3)}</p>
                                                        </td>
                                                        <td className={` border-end ${style?.rate}`}>
                                                            <p className='p-1 text-end fs_rp_2'>{ el?.miscamt === 0 ? '' : formatAmount((el?.miscamt / (el?.isRateOnPcs === 1 ? (el?.miscpcs === 0 ? 1 : el?.miscpcs ) : (el?.miscwt === 0 ? 1 : el?.miscwt))))}</p>
                                                            {/* <p className='p-1 text-end fs_rp_2'>{ el?.miscamt === 0 ? '' : formatAmount((el?.miscamt/(e?.count ?? 1)))}</p> */}
                                                        </td>
                                                        <td className={`text-center border-end p-1 ${style?.amount}`}>
                                                            <p className='text-end fs_rp_2'>{el?.miscamt === 0 ? '' : formatAmount((el?.miscamt))}</p>
                                                        </td>
                                                    </tr>
                                                    })
                                                }
                                                 {
                                                    e?.finding?.map((el, ind) => {
                                                        return <tr className='border-bottom' key={ind}>
                                                        <td className={` border-end ${style?.material}`}>
                                                            <p className='fs_rp_2 p-1'></p>
                                                        </td>
                                                        <td className={` border-end ${style?.qty}`}>
                                                            <p className='fs_rp_2 p-1'>{el?.QualityName}</p>
                                                        </td>
                                                        <td className={` border-end ${style?.color}`}>
                                                            <p className='fs_rp_2 p-1'>{el?.Colorname}</p>
                                                        </td>
                                                        <td className={` border-end ${style?.pcs}`}>
                                                            <p className='d-flex justify-content-end align-items-center  text-end fs_rp_2 p-1'>{el?.Pcs}</p>
                                                        </td>
                                                        <td className={`text-end border-end   ${style?.nWt}`}>
                                                            <p className='p-1 text-end fs_rp_2'>{el?.Wt?.toFixed(3)}</p>
                                                        </td>
                                                        <td className={` border-end ${style?.rate}`}>
                                                            <p className='p-1 text-end fs_rp_2'></p>
                                                        </td>
                                                        <td className={`text-center border-end p-1 ${style?.amount}`}>
                                                            <p className='text-end '></p>
                                                        </td>
                                                    </tr>
                                                    })
                                                }
                                                 {
                                                    e?.other_details?.map((el, ind) => {
                                                        return <tr className='border-bottom' key={ind}>
                                                        <td className={` border-end ${style?.material}`}>
                                                            <p className='p-1 fs_rp_2'>{el?.label}</p>
                                                        </td>
                                                        <td className={` border-end ${style?.qty}`}>
                                                            <p className='p-1'></p>
                                                        </td>
                                                        <td className={` border-end ${style?.color}`}>
                                                            <p className='p-1'></p>
                                                        </td>
                                                        <td className={` border-end ${style?.pcs}`}>
                                                            <p className='d-flex justify-content-end align-items-center  p-1'></p>
                                                        </td>
                                                        <td className={`text-end border-end   ${style?.nWt}`}>
                                                            <p className='p-1'></p>
                                                        </td>
                                                        <td className={` border-end ${style?.rate}`}>
                                                            <p className='p-1 '></p>
                                                        </td>
                                                        <td className={`text-center border-end p-1 ${style?.amount}`}>
                                                            <p className='text-end fs_rp_2'>{el?.value}</p>
                                                        </td>
                                                    </tr>
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
                {/* {
                    data?.resultArray?.map((e, i) => {
                        return <div className="d-flex border-start border-end border-bottom" key={i}>
                            <div className={`d-flex justify-content-center align-items-center ${style?.Sr} border-end`}><p className="fw-bold text-center p-1"> {i + 1} </p></div>
                            <div className={`${style?.Product} border-end`}>
                                <p className="text-center p-1">{e?.SubCategoryname} {e?.Categoryname}  </p>
                                <p className="fw-bold text-center p-1"> {e?.designno} | {e?.SrJobno} </p>
                                <img src={e?.DesignImage} alt="" className='imgWidth' onError={handleImageError} />
                            </div>
                            <div className={`${style?.Material}`}>
                                <div className="d-grid h-100">
                                    <div className="d-flex">
                                        <div className={`d-flex align-items-center w-100 text-center border-end border-bottom ${style?.material}`}>
                                            <p className='p-1'>{e?.MetalType}</p>
                                        </div>
                                        <div className={`d-flex align-items-center w-100 text-center border-end border-bottom ${style?.qty}`}>
                                            <p className='p-1'>{e?.MetalPurity}</p>
                                        </div>
                                        <div className={`d-flex align-items-center w-100 text-center border-end border-bottom ${style?.color}`}>
                                            <p className='p-1'></p>
                                        </div>
                                        <div className={`w-100 text-center border-end border-bottom ${style?.pcs}`}>
                                            <p className='d-flex justify-content-end align-items-center  p-1'></p>
                                        </div>
                                        <div className={`d-flex justify-content-end align-items-center w-100 text-center border-end border-bottom ${style?.gWt}`}><p className='p-1'>{NumberWithCommas(e?.grosswt, 3)}</p></div>
                                        <div className={`w-100 text-end border-end border-bottom d-flex justify-content-end align-items-center  ${style?.nWt}`}>
                                            <p className='p-1'>{NumberWithCommas(e?.NetWt, 3)}</p>
                                        </div>
                                        <div className={`d-flex align-items-center justify-content-end w-100 text-center border-end border-bottom ${style?.rate}`}>
                                            <p className='p-1 '>5700.00</p>
                                        </div>
                                        <div className={`d-flex justify-content-end align-items-center w-100 text-center border-end p-1 ${style?.amount}`}>
                                            <p>57478.80</p>
                                        </div>
                                        <div className={`d-flex justify-content-end align-items-center w-100 text-center border-end p-1 ${style?.making}`}><p>1996.80</p></div>
                                        <div className={`d-flex justify-content-end align-items-center w-100 text-center border-end p-1 ${style?.discount}`}><p>0.00</p></div>
                                        <div className={`d-flex justify-content-end align-items-center w-100 text-center p-1 ${style?.total}`}><p>59605.60</p></div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    })
                } */}

                {/* <tr>
                    <td rowspan="8">1
                    </td>
                    <td rowspan="8">
                        <table border="0" cellpadding="0" cellspacing="0">
                            <tbody><tr>
                                <td class="tddesignNo">kiaan_subcat&nbsp;&nbsp;kiaan_cat<b>IMPORT111 | 1/14896</b>
                                </td>
                            </tr>
                                <tr>
                                    <td colspan="2">
                                        <img class="isImgHide" src="http://zen/lib/jo/28/images/default.jpg" alt="IMPORT111" />
                                    </td>
                                </tr>
                            </tbody></table>
                    </td>
                    <td class="cls-tbl-detail">GOLD</td>
                    <td class="cls-tbl-detail style=">18K</td>
                    <td class="cls-tbl-detail"></td>
                    <td></td>
                    <td></td>
                    <td class="cls-tbl-detail" >5.000</td>
                    <td class="cls-tbl-detail" >5558.07</td>
                    <td class="cls-tbl-detail" >33348.42</td>
                    <td rowspan="8" >3000.00</td>
                    <td rowspan="8" >0.00</td>
                    <td rowspan="8" >111562.92</td>
                </tr> */}

                {/* table total */}
                <div className="d-flex border-start border-end border-bottom">
                    <div className={`d-flex justify-content-center align-items-center ${style?.Sr} border-end`}><p className="fw-bold text-center p-1"> </p></div>
                    <div className={`${style?.Product} border-end`}>
                        <p className="fw-bold text-center p-1 fs_rp_2"> TOTAL </p>
                    </div>
                    <div className={`${style?.Material}`}>
                        <div className="d-grid h-100">
                            <div className="d-flex h-100">
                                <div className={`fw-bold w-100 text-center border-end  ${style?.material}`}>
                                    <p className='d-flex p-1 fs_rp_2'></p>
                                </div>
                                <div className={`fw-bold w-100 text-center border-end  ${style?.qty}`}>
                                    <p className='d-flex p-1 fs_rp_2'></p>
                                </div>
                                <div className={`fw-bold w-100 text-center border-end  ${style?.color}`}>
                                    <p className='d-flex p-1'></p>
                                </div>
                                <div className={`fw-bold w-100 text-end border-end  ${style?.pcs}`}>
                                    {/* <p className='p-1 w-100 d-flex justify-content-end align-items-center h-100 fs_rp_2_bold fs_rp_2'>{result?.mainTotal?.diamonds?.Pcs + result?.mainTotal?.colorstone?.Pcs + misctotPcs + result?.mainTotal?.metal?.Pcs}</p> */}
                                    {/* <p className='p-1 w-100 d-flex justify-content-end align-items-center h-100 fs_rp_2_bold fs_rp_2'>{result?.mainTotal?.diamonds?.Pcs + misctotPcs }</p> */}
                                    <p className='p-1 w-100 d-flex justify-content-end align-items-center h-100 fs_rp_2_bold fs_rp_2'>{totPcs + misctotPcs  }</p>
                                </div>
                                <div className={`d-flex justify-content-end align-items-center fw-bold w-100 text-end border-end fs_rp_2 ${style?.gWt}`}><p className='p-1 fs_rp_2'>{result?.mainTotal?.grosswt?.toFixed(3)}</p></div>
                                <div className={`fw-bold w-100 text-end border-end  ${style?.nWt}`}>
                                    {/* <p className='d-flex p-1 justify-content-end fs_rp_2_bold fs_rp_2' >{ gmwt?.toFixed(3)} gms <br /> {ctwwt?.toFixed(3)} ctw</p> */}
                                    <p className='d-flex p-1 justify-content-end fs_rp_2_bold fs_rp_2' >{ gmwt?.toFixed(3)} gms <br /> {totWt?.toFixed(3)} ctw</p>
                                </div>
                                <div className={`fw-bold w-100 text-end border-end  ${style?.rate}`}>
                                    <p className='d-flex p-1 justify-content-end'></p>
                                </div>
                                <div className={`d-flex justify-content-end align-items-center fw-bold w-100 text-center border-end p-1 ${style?.amount}`}>
                                    {/* <p className='fs_rp_2_bold fs_rp_2'>{formatAmount((result?.mainTotal?.metal?.Amount + result?.mainTotal?.diamonds?.Amount + result?.mainTotal?.colorstone?.Amount + (result?.mainTotal?.misc?.Amount) + result?.mainTotal?.finding?.Amount ))}</p> */}
                                    <p className='fs_rp_2_bold fs_rp_2'>{formatAmount((result?.mainTotal?.metal?.Amount + result?.mainTotal?.diamonds?.Amount + result?.mainTotal?.colorstone?.Amount + (result?.mainTotal?.misc?.Amount)  ))}</p>
                                </div>
                                <div className={`d-flex justify-content-end align-items-center fw-bold w-100 text-center p-1 border-end ${style?.making}`}><p className='fs_rp_2_bold fs_rp_2'>{formatAmount((((result?.mainTotal?.total_Making_Amount + result?.mainTotal?.diamonds?.SettingAmount + result?.mainTotal?.colorstone?.SettingAmount)/(result?.header?.CurrencyExchRate))))}</p></div>
                                <div className={`d-flex justify-content-end align-items-center fw-bold w-100 text-center p-1 border-end ${style?.discount}`}><p className='fs_rp_2_bold fs_rp_2'>{formatAmount(result?.mainTotal?.total_discount_amount)}</p></div>
                                <div className={`d-flex justify-content-end align-items-center fw-bold w-100 text-center p-1 ${style?.total}`}><p className='fs_rp_2_bold fs_rp_2'>{formatAmount(result?.mainTotal?.total_amount)}</p></div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* table amount */}
                <div className="d-flex border-start border-end border-bottom">
                    <div className={`${style?.inWords} border-end p-1`}>
                        <p className='fs_rp_2'>In Words Indian Rupees</p>
                        <p className='fw-bold fs_rp_2'>{toWords?.convert(+(result?.mainTotal?.total_amount + result?.allTaxesTotal + result?.header?.AddLess)?.toFixed(2))}</p>
                    </div>
                    <div style={{width:'23.5%'}}>
                        <div className='d-flex w-100'>
                            <div className='text-end border-end pe-1 fs_rp_2' style={{width:'67%'}}>Discount</div>
                            <div className='text-end pe-1 fs_rp_2' style={{width:'33%'}}>{formatAmount(result?.mainTotal?.total_discount_amount)}</div>
                        </div>
                        {
                            result?.allTaxes?.map((e, i) => {
                                return(
                                    <div className='d-flex w-100' key={i}>
                                        <div className='text-end border-end pe-1 fs_rp_2' style={{width:'67%'}}>{e?.name} @ {e?.per}</div>
                                        <div className='text-end pe-1 fs_rp_2' style={{width:'33%'}}>{formatAmount(e?.amount)}</div>
                                    </div>
                                )
                            })
                        }
                        <div className='d-flex w-100'>
                            <div className='text-end border-end pe-1 fs_rp_2' style={{width:'67%'}}>{result?.header?.AddLess > 0 ? 'Add' : 'Less'}</div>
                            <div className='text-end pe-1 fs_rp_2' style={{width:'33%'}}>{formatAmount(result?.header?.AddLess)}</div>
                        </div>
                        <div className='border-top w-100 d-flex'>
                            <div className='fw-bold text-end pe-1 border-end fs_rp_2' style={{width:'67%'}}>GRAND TOTAL</div>
                            <div className='fw-bold text-end pe-1 fs_rp_2' style={{width:'33%'}}>{formatAmount((result?.mainTotal?.total_amount + result?.allTaxesTotal + result?.header?.AddLess))}</div>
                        </div>
                        <div className='w-100 d-flex'>
                            <div className=' text-end pe-1 border-end fs_rp_2' style={{width:'67%'}}>RECEIPTS</div>
                            <div className=' text-end pe-1 fs_rp_2' style={{width:'33%'}}>{formatAmount()}</div>
                        </div>
                        <div className='w-100 d-flex'>
                            <div className='fw-bold text-end pe-1 border-end fs_rp_2' style={{width:'67%'}}>BALANCE</div>
                            <div className='fw-bold text-end pe-1 fs_rp_2' style={{width:'33%'}}>{formatAmount((result?.mainTotal?.total_amount + result?.allTaxesTotal + result?.header?.AddLess))}</div>
                        </div>
                    </div>
                    {/* <div className={`${style?.inNumbers} border-end pt-1`}>
                        <p className='text-end px-1'>Discount</p>
                        <p className='text-end border-bottom px-1 pb-1'>IGST @ 0.25</p>
                        <p className="fw-bold text-end px-1 pt-1">GRAND TOTAL</p>
                        <p className="text-end px-1 pt-1">RECEIPTS</p>
                        <p className="text-end px-1 pt-1">OLD GOLD</p>
                        <p className="fw-bold text-end px-1 pt-1">BALANCE</p>
                    </div>
                    <div className={` ${style?.totalInNumbers} py-1`}>
                        <p className='text-end px-1'>{formatAmount(result?.mainTotal?.total_discount_amount)}</p>
                        <p className='text-end px-1 pb-1 border-bottom'>836.72 </p>
                        <p className="fw-bold text-end px-1 pt-1">335525.48</p>
                        <p className="text-end px-1 pt-1">0.00</p>
                        <p className="text-end px-1 pt-1">0.00</p>
                        <p className="fw-bold text-end px-1 pt-1">335525.48</p>
                    </div> */}
                </div>
                {/* declaration */}
                <div className="my-1 border p-1 fs_rp_2">
                    <div className='fs_rp_2 danger_rp' dangerouslySetInnerHTML={{__html:result?.header?.Declaration}}>                        
                    </div>
                </div>
                <div className="my-1 border">
                    <div className="p-1"><span className="fs_rp_2 fw-bold  text-decoration-underline">Remark:</span>{" "} <span className='fs_rp_2' dangerouslySetInnerHTML={{__html:result?.header?.PrintRemark}}></span></div>
                </div>
                <div className="my-1 border p-1 d-flex">
                    <div className="col-4 border-end">
                        <p className="fw-bold fs_rp_2">Bank Details :</p>
                        <p className='fs_rp_2'>Bank Name: {result?.header?.bankname}</p>
                        <p className='fs_rp_2'>Branch: {result?.header?.bankaddress}</p>
                        <p className='fs_rp_2'>Account Name: {result?.header?.accountname}</p>
                        <p className='fs_rp_2'>Account No. : {result?.header?.accountnumber}</p>
                        <p className='fs_rp_2'>RTGS/NEFT IFSC: {result?.header?.rtgs_neft_ifsc}</p>
                        <p className='fs_rp_2'>{result?.header?.Company_VAT_GST_No}</p>
                        <p className='fs_rp_2'>PAN NO: {result?.header?.Com_pannumber}</p>
                        <p className='fs_rp_2'>TELL NO: {result?.header?.CompanyTellNo}</p>
                    </div>
                    <div className="col-4 border-end d-flex justify-content-between p-1 flex-column">
                        <p className='fs_rp_2'>Signature</p>
                        <p className='fw-bold pb-1 fs_rp_2'>{result?.header?.customerfirmname}</p>
                    </div>
                    <div className="col-4 d-flex justify-content-between p-1 flex-column">
                        <p className='fs_rp_2'>Signature</p>
                        <p className='fw-bold pb-1 fs_rp_2'>{result?.header?.CompanyFullName}</p>
                    </div>
                </div>
            </div>
            {/* <SampleDetailPrint11 /> */}
        </> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
    )
}

export default RetailPrint3;
