import React, { useEffect, useState } from 'react';
import style from "../../assets/css/prints/DetailPrint2.module.css";
import { NumberWithCommas, apiCall, checkMsg, handleImageError, handlePrint, isObjectEmpty } from '../../GlobalFunctions';
import Loader from '../../components/Loader';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import { cloneDeep } from 'lodash';
import { MetalShapeNameWiseArr } from '../../GlobalFunctions/MetalShapeNameWiseArr';

const DetailPrint2 = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [headerData, setHeaderData] = useState({});
    const [data, setData] = useState({});
    const [checkBox, setCheckbox] = useState({
        image: true,
    });
    const [isImageWorking, setIsImageWorking] = useState(true);
    const handleImageErrors = () => {
        setIsImageWorking(false);
    };
    const [MetShpWise, setMetShpWise] = useState([]);
    const [notGoldMetalTotal, setNotGoldMetalTotal] = useState(0);
    const [notGoldMetalWtTotal, setNotGoldMetalWtTotal] = useState(0);


    const loadData = (data) => {
        setHeaderData(data?.BillPrint_Json[0]);
        let datas = OrganizeDataPrint(data?.BillPrint_Json[0], data?.BillPrint_Json1, data?.BillPrint_Json2);

        let met_shp_arr = MetalShapeNameWiseArr(datas?.json2);
      
        setMetShpWise(met_shp_arr);
        let tot_met = 0;
        let tot_met_wt = 0;
        met_shp_arr?.forEach((e) => {
          tot_met += e?.Amount;
          tot_met_wt += e?.metalfinewt;
        })    
        setNotGoldMetalTotal(tot_met);
        setNotGoldMetalWtTotal(tot_met_wt);

        let resultArr = [];
        let PrimaryMetalWts = 0;
        let PrimaryMetalAmounts = 0;
        datas?.resultArray?.forEach((e) => {
            let obj = cloneDeep(e);
            let diamonds = [];
            let PrimaryMetalWt = 0
            let PrimaryMetalAmount = 0
            // elem?.ShapeName === ele?.ShapeName && ele?.Colorname === elem?.Colorname && 
            obj?.diamonds?.forEach((ele) => {
                let findDiamond = diamonds?.findIndex((elem) => ele?.QualityName === elem?.QualityName);
                if (findDiamond === -1) {
                    diamonds.push(ele);
                } else {
                    diamonds[findDiamond].Wt += ele?.Wt;
                    diamonds[findDiamond].Pcs += ele?.Pcs;
                    diamonds[findDiamond].Amount += ele?.Amount;
                }
            });
            // PrimaryMetalWt += e?.metal?.reduce((acc, cObj) => cObj?.IsPrimaryMetal === 1 ? acc+ cObj?.Wt : acc, 0);
            e?.metal?.forEach((ele) => {
                if (ele?.IsPrimaryMetal === 1) {
                    PrimaryMetalWt += ele?.Wt;
                    PrimaryMetalAmount += ele?.Amount
                }
            })
            PrimaryMetalWts += PrimaryMetalWt;
            PrimaryMetalAmounts += PrimaryMetalAmount;
            obj.diamonds = diamonds;
            obj.JobRemark = e?.JobRemark;
            obj.PrimaryMetalWt = PrimaryMetalWt;
            obj.PrimaryMetalAmount = PrimaryMetalAmount;
            resultArr?.push(obj);
        })
        datas.mainTotal.PrimaryMetalWts = PrimaryMetalWts;
        datas.mainTotal.PrimaryMetalAmounts = PrimaryMetalAmounts;
        datas.resultArray = resultArr;
        setData(datas);
    }

    const handleCheck = (eve) => {
        const { name, checked } = eve?.target;
        setCheckbox({ ...checkBox, [name]: checked });
    }

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
                    // setMsg(data?.Message);
                    const err = checkMsg(data?.Message);
                    console.log(data?.Message);
                    setMsg(err);
                }
            } catch (error) {
                console.error(error);
            }
        };
        sendData();
    }, []);

    return loader ? (
        <Loader />
    ) : msg === "" ? (
        <>

            <div className={`container max_width_container pad_60_allPrint ${style?.detailPrint2} pt-2 px-2`} >
                {/* buttons */}
                <div className={`d-flex justify-content-end align-items-center ${style?.print_sec_sum4} mb-4 mt-4  w-100`} >
                    <div className="px-1">
                        <input
                            type="checkbox"
                            checked={checkBox?.image}
                            id="netwts2"
                            name="image"
                            value="netwts2"
                            className="mx-1"
                            onChange={handleCheck}
                        />
                        <label htmlFor="netwts2">With Image</label>
                    </div>
                    <div className="form-check ps-3">
                        <input
                            type="button"
                            value="Print"
                            className="btn_white blue py-1"
                            onClick={(e) => handlePrint(e)}
                        />
                    </div>
                </div>
                <h4 className='lightGrey min_height_label px-2 fw-bold d-flex align-items-center border border-black' style={{ fontSize: "14px" }}>{headerData?.PrintHeadLabel}</h4>
                <div className="d-flex pt-2 justify-content-between">
                    <div className='col-6'>
                        <p style={{ fontSize: "11px" }}>To</p>
                        <p style={{ fontSize: "14px" }} className="fw-semibold">{headerData?.Customercode}</p>
                    </div>
                    <div className='col-4'>
                        <div className="d-flex">
                            <div className="col-6">
                                <p className='text-end'>Invoice# :</p>
                            </div>
                            <div className="col-6">
                                <p className="fw-semibold ps-4"> {headerData?.InvoiceNo}</p>
                            </div>
                        </div>
                        <div className="d-flex">
                            <div className="col-6">
                                <p className='text-end'>Date :</p>
                            </div>
                            <div className="col-6">
                                <p className="fw-semibold ps-4"> {headerData?.EntryDate}</p>
                            </div>
                        </div>
                        <div className="d-flex">
                            <div className="col-6">
                                <p className='text-end'>{headerData?.HSN_No_Label}:</p>
                            </div>
                            <div className="col-6">
                                <p className="fw-semibold ps-4"> {headerData?.HSN_No}</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* table header */}
                <div className={`d-flex border-start border-end border-top border-black ${style?.pad_1} lightGrey`}>
                    <div className={`${style?.sr} border-bottom text-center fw-bold border-end d-flex justify-content-center align-items-center`}><p>Sr</p></div>
                    <div className={`${style?.design} border-bottom text-center fw-bold border-end d-flex justify-content-center align-items-center`}><p>Design</p></div>
                    <div className={`${style?.diamond} border-bottom text-center fw-bold border-end`}>
                        <p className='border-bottom'>Diamond</p>
                        <div className="d-flex">
                            <div className='col-3'><p className='text-center fw-bold border-end'>Code</p></div>
                            <div className='col-3'><p className='text-center fw-bold border-end'>Wt</p></div>
                            <div className='col-3'><p className='text-center fw-bold border-end'>Rate</p></div>
                            <div className='col-3'><p className='text-center fw-bold'>Amount</p></div>
                        </div>
                    </div>
                    <div className={`${style?.metal} border-bottom text-center fw-bold border-end`}>
                        <p className='border-bottom'>Metal</p>
                        <div className="d-flex">
                            <div className='' style={{ width: "25%" }}><p className='text-center fw-bold border-end'>Quality</p></div>
                            <div className='' style={{ width: "23%" }}><p className='text-center fw-bold border-end'>Wt(M+D)</p></div>
                            <div className='' style={{ width: "23%" }}><p className='text-center fw-bold border-end'>N+L</p></div>
                            <div className='' style={{ width: "31%" }}><p className='text-center fw-bold'>Amount</p></div>
                        </div>
                    </div>
                    <div className={`${style?.stone} border-bottom text-center fw-bold border-end`}>
                        <p className='border-bottom'>Stone</p>
                        <div className="d-flex">
                            <div className='col-6'><p className='text-center fw-bold border-end'>Code</p></div>
                            <div className='col-6'><p className='text-center fw-bold '>Amount</p></div>
                        </div>
                    </div>
                    <div className={`${style?.other} border-bottom text-center fw-bold border-end d-flex justify-content-center align-items-center`}><p>Other Amount</p></div>
                    <div className={`${style?.labour} border-bottom text-center fw-bold border-end d-flex justify-content-center align-items-center`}><p>Labour Amount</p></div>
                    <div className={`${style?.total} border-bottom text-center fw-bold d-flex justify-content-center align-items-center`}><p>Total Amount</p></div>
                </div>
                {/* table data */}
                {data?.resultArray?.map((e, i) => {
                    return <div className={`border-start border-end border-black no_break ${style?.pad_1} ${style?.data} ${style?.word_break}`} key={i}>
                        <div className="d-flex border-top">
                            <div className={`${style?.sr} border-bottom text-center border-end d-flex justify-content-center align-items-center`}><p>{NumberWithCommas(i + 1, 0)}</p></div>
                            <div className={`${style?.design} border-bottom border-end`}>
                                <div className="d-flex flex-column justify-content-between h-100">
                                    <div>
                                        <div className="d-flex justify-content-between">
                                            <p>{e?.designno}</p>
                                            <p>{e?.SrJobno}</p>
                                        </div>
                                        <img src={e?.DesignImage} alt="" width={75} height={75} className={`mx-auto d-block ${!checkBox?.image && 'd-none'}`} onError={handleImageError} />
                                        {e?.HUID !== "" && <p className="text-center">HUID-{e?.HUID}</p>}
                                    </div>
                                    <div className="border-top" style={{ minHeight: "13.5px" }}>
                                        <p className="fw-bold text-center">{NumberWithCommas(e?.grosswt, 3)} gm Gross</p>
                                    </div>
                                </div>
                            </div>
                            <div className={`${style?.diamond} border-bottom  border-end`}>
                                <div className="d-flex h-100 flex-column justify-content-between">
                                    <div>
                                        {e?.diamonds?.map((ele, ind) => {
                                            return <div className="d-flex" key={ind}>
                                                <div className='col-3'><p className=''>{ele?.QualityName}</p></div>
                                                <div className='col-3 text-end'><p className='text-end'>{NumberWithCommas(ele?.Wt, 3)}</p></div>
                                                <div className='col-3 text-end'><p className='text-end'>{NumberWithCommas(ele?.Amount / ele?.Wt, 2)}</p></div>
                                                <div className='col-3 text-end fw-semibold'><p className='text-end'>{NumberWithCommas(ele?.Amount, 2)}</p></div>
                                            </div>
                                        })}
                                    </div>
                                    <div className="border-top d-flex lightGrey" style={{ minHeight: "13.5px" }}>
                                        <p className="text-center col-3 fw-semibold"></p>
                                        <p className="text-end col-3 fw-semibold">{e?.totals?.diamonds?.Wt !== 0 && NumberWithCommas(e?.totals?.diamonds?.Wt, 3)}</p>
                                        <p className="text-end col-3 fw-semibold"></p>
                                        <p className="text-end col-3 fw-semibold">{e?.diamonds?.length > 0 ? NumberWithCommas(e?.totals?.diamonds?.Amount, 2) : <>&nbsp;</>}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={`${style?.metal} border-bottom  border-end`}>
                                <div className="d-flex h-100 flex-column justify-content-between">
                                    <div>
                                        {e?.metal?.map((ele, ind) => {
                                            return ele?.IsPrimaryMetal === 1 && <div className="d-flex border-bottom" key={ind}>
                                                <div className='' style={{ width: "25%" }}><p className=' ' style={{ minHeight: "14.5px", wordBreak: "normal" }}>{ele?.ShapeName} {ele?.QualityName}</p></div>
                                                <div className='' style={{ width: "23%" }}><p className='  text-end' style={{ minHeight: "14.5px" }}>{ind === 0 && NumberWithCommas((e?.NetWt + (e?.totals?.diamonds?.Wt / 5)), 3)}</p></div>
                                                <div className='' style={{ width: "23%" }}><p className='  text-end' style={{ minHeight: "14.5px" }}>{NumberWithCommas(ele?.Wt, 3)}</p></div>
                                                <div className='' style={{ width: "31%" }}><p className='  text-end fw-semibold' style={{ minHeight: "14.5px" }}>{NumberWithCommas(ele?.Amount, 2)}</p></div>
                                            </div>
                                        })}
                                        {e?.JobRemark !== "" && <div className=''>
                                            <p className='lh-1 pb-0'>Remark:</p>
                                            <p className='fw-bold'>{e?.JobRemark}</p>
                                        </div>}
                                    </div>
                                    <div className="border-top d-flex lightGrey" >
                                        <div style={{ width: "25%" }} className=''><p className='fw-semibold'></p></div>
                                        <div style={{ width: "23%" }} className=''><p className='fw-semibold text-end'>{NumberWithCommas((e?.NetWt + (e?.totals?.diamonds?.Wt / 5)), 3)}</p></div>
                                        <div style={{ width: "23%" }} className=''><p className='fw-semibold text-end'>{NumberWithCommas(e?.PrimaryMetalWt, 3)}</p></div>
                                        <div style={{ width: "31%" }} className=''><p className='fw-semibold text-end'>{NumberWithCommas(e?.PrimaryMetalAmount, 2)}</p></div>
                                    </div>
                                </div>
                            </div>
                            <div className={`${style?.stone} border-bottom  border-end`}>
                                <div className="d-flex h-100 flex-column justify-content-between">
                                    <div>
                                        {e?.colorstone?.map((ele, ind) => {
                                            return <div className="d-flex" key={ind}>
                                                <div className='col-6'><p className=''>COLOR STONE	</p></div>
                                                <div className='col-6'><p className='text-end fw-bold'>{NumberWithCommas(ele?.Amount, 2)}</p></div>
                                            </div>
                                        })}
                                    </div>
                                    <div className="border-top lightGrey">
                                        <p className='text-end fw-semibold' style={{ minHeight: "13.5px" }}>{e?.colorstone?.length > 0 ? NumberWithCommas(e?.totals?.colorstone?.Amount, 2) : <>&nbsp;</>}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={`${style?.other} border-bottom  border-end text-end`}>
                                <div className="d-flex h-100 flex-column justify-content-between">
                                    <div>
                                        <p className='text-end'>{NumberWithCommas(e?.OtherCharges + e?.MiscAmount + e?.TotalDiamondHandling, 2)}</p>
                                    </div>
                                    <div className='border-top lightGrey'>
                                        <p className='text-end fw-semibold'> {NumberWithCommas(e?.OtherCharges + e?.MiscAmount + e?.TotalDiamondHandling, 2)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={`${style?.labour} border-bottom  border-end text-end`}>
                                <div className="d-flex h-100 flex-column justify-content-between">
                                    <div>
                                        <p className='text-end'>{NumberWithCommas(e?.MakingAmount + e?.TotalDiaSetcost + e?.TotalCsSetcost, 2)}</p>
                                    </div>
                                    <div className='border-top lightGrey'>
                                        <p className='text-end fw-semibold'> {NumberWithCommas(e?.MakingAmount + e?.TotalDiaSetcost + e?.TotalCsSetcost, 2)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={`${style?.total} border-bottom  text-end`}>
                                <div className="d-flex h-100 flex-column justify-content-between">
                                    <div>
                                        <p className='text-end fw-semibold'>{NumberWithCommas(e?.TotalAmount, 2)}</p>
                                    </div>
                                    <div className='border-top lightGrey'>
                                        <p className='text-end fw-semibold'> {NumberWithCommas(e?.TotalAmount, 2)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                })}
                <div className='no_break'>
                    {/* taxes */}
                    <div className={`border-start border-end border-black d-flex no_break ${style?.pad_1}`}>
                        <div className={`${style?.cgst} text-end`}>
                            {data?.allTaxes?.map((e, i) => {
                                return <p key={i}>{e?.name} @ {e?.per}</p>
                            })}
                            {headerData?.AddLess !== 0 && <p>Add/Less</p>}
                        </div>
                        <div className={`${style?.cgstNumber} text-end`}>
                            {data?.allTaxes?.map((e, i) => {
                                return <p key={i}>{NumberWithCommas(+e?.amount * headerData?.CurrencyExchRate, 2)}</p>
                            })}
                            {headerData?.AddLess !== 0 && <p>{headerData?.AddLess}</p>}
                        </div>
                    </div>
                    {/* table total */}
                    <div className={`border-start border-end border-black lightGrey border-bottom no_break ${style?.pad_1} ${style?.data} ${style?.word_break}`}>
                        <div className="d-flex border-top">
                            <div className={`${style?.totalWord}  border-end`}>
                                <p className="fw-bold text-center  fw-semibold">TOTAL</p>
                            </div>
                            <div className={`${style?.diamond} border-end d-flex`}>
                                <div className='col-3'><p className=' fw-semibold'></p></div>
                                <div className='col-3 text-end'><p className='text-end fw-semibold'>{NumberWithCommas(data?.mainTotal?.diamonds?.Wt, 3)}</p></div>
                                <div className='col-3 text-end'><p className='text-end fw-semibold'></p></div>
                                <div className='col-3 text-end'><p className='text-end fw-semibold'>{NumberWithCommas(data?.mainTotal?.diamonds?.Amount, 2)}</p></div>
                            </div>
                            <div className={`${style?.metal}  border-end d-flex`}>
                                <div className='' style={{ width: "25%" }}><p className=' fw-semibold'></p></div>
                                <div className='' style={{ width: "23%" }}><p className=' text-end fw-semibold'>{NumberWithCommas((data?.mainTotal?.diamonds?.Wt / 5) + data?.mainTotal?.netwt, 3)}</p></div>
                                <div className='' style={{ width: "23%" }}><p className=' text-end fw-semibold'>{NumberWithCommas(data?.mainTotal?.PrimaryMetalWts, 3)}</p></div>
                                <div className='' style={{ width: "31%" }}><p className=' text-end fw-semibold'>{NumberWithCommas(data?.mainTotal?.PrimaryMetalAmounts, 2)}</p></div>
                            </div>
                            <div className={`${style?.stone}   border-end `}>
                                <p className='text-end fw-semibold'>{NumberWithCommas(data?.mainTotal?.colorstone?.Amount, 2)}</p>
                            </div>
                            <div className={`${style?.other}   border-end text-end`}>
                                <p className='text-end fw-semibold'> {NumberWithCommas(data?.mainTotal?.total_otherCharge_Diamond_Handling, 2)}</p>
                            </div>
                            <div className={`${style?.labour}   border-end text-end`}>
                                <p className='text-end fw-semibold'> {NumberWithCommas(data?.mainTotal?.total_Making_Amount + data?.mainTotal?.diamonds?.SettingAmount + data?.mainTotal?.colorstone?.SettingAmount, 2)}</p>
                            </div>
                            <div className={`${style?.total}   text-end`}>
                                <p className='text-end fw-semibold'> {NumberWithCommas(data?.mainTotal?.total_amount + headerData?.AddLess + data?.allTaxes?.reduce((acc, cObj) => acc + (+cObj?.amount * headerData?.CurrencyExchRate), 0), 2)}</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* table summary */}
                <div className={`d-flex no_break ${style?.pad_1} ${style?.data} pt-1`}>
                    <div className={`${style?.summary} col-5 border h-100`}>
                        <p className="fw-bold lightGrey text-center border-bottom">Summary</p>
                        <div className='d-flex'>
                            <div className="col-6 border-end position-relative" style={{ paddingBottom: "22.3px" }} >
                                <div className="d-flex px-1 justify-content-between">
                                    <p className='fw-bold'>GOLD IN 24KT	</p>
                                    <p>{NumberWithCommas((data?.mainTotal?.total_purenetwt - notGoldMetalWtTotal), 3)} gm	</p>
                                </div>
                                { MetShpWise?.map((e, i) => {
                                    return <div className="d-flex px-1 justify-content-between" key={i}>
                                        <p className='fw-bold'>{e?.ShapeName}</p>
                                        <p>{NumberWithCommas(e?.metalfinewt, 3)} gm</p>
                                    </div>
                                    }) 
                                }
                                <div className="d-flex px-1 justify-content-between">
                                    <p className='fw-bold'>GROSS WT	</p>
                                    <p>{NumberWithCommas(data?.mainTotal?.grosswt, 3)} gm	</p>
                                </div>
                                <div className="d-flex px-1 justify-content-between">
                                    <p className='fw-bold'>G+D WT</p>
                                    <p>{NumberWithCommas((data?.mainTotal?.diamonds?.Wt / 5) + data?.mainTotal?.netwt, 3)} gm	</p>
                                </div>
                                <div className="d-flex px-1 justify-content-between">
                                    <p className='fw-bold'>NET WT</p>
                                    <p>{NumberWithCommas(data?.mainTotal?.PrimaryMetalWts, 3)} gm	</p>
                                </div>
                                <div className="d-flex px-1 justify-content-between">
                                    <p className='fw-bold'>DIAMOND WT</p>
                                    <p>{NumberWithCommas(data?.mainTotal?.diamonds?.Wt, 3)} cts	</p>
                                </div>
                                <div className="d-flex px-1 justify-content-between">
                                    <p className='fw-bold'>STONE WT</p>
                                    <p>{NumberWithCommas(data?.mainTotal?.colorstone?.Wt, 3)} cts	</p>
                                </div>
                                <div className="d-flex justify-content-between border-top lightGrey px-1 position-absolute w-100 start-0 bottom-0" style={{ minHeight: "20.3px" }}>
                                    <p className='fw-bold'></p>
                                    <p>	</p>
                                </div>
                            </div>
                            <div className="col-6 position-relative" style={{ paddingBottom: "22.3px" }} >
                                <div className="d-flex px-1 justify-content-between">
                                    <p className='fw-bold'>GOLD</p>
                                    <p>{NumberWithCommas((data?.mainTotal?.MetalAmount - notGoldMetalTotal), 2)} 	</p>
                                </div>
                                { MetShpWise?.map((e, i) => {
                                    return <div className="d-flex px-1 justify-content-between" key={i}>
                                        <p className='fw-bold'>{e?.ShapeName}</p>
                                        <p>{NumberWithCommas(e?.Amount, 2)} 	</p>
                                    </div>
                                    }) 
                                    }
                                <div className="d-flex px-1 justify-content-between">
                                    <p className='fw-bold'>DIAMOND</p>
                                    <p>{NumberWithCommas(data?.mainTotal?.diamonds?.Amount, 2)} 	</p>
                                </div>
                                <div className="d-flex px-1 justify-content-between">
                                    <p className='fw-bold'>CST</p>
                                    <p>{NumberWithCommas(data?.mainTotal?.colorstone?.Amount, 2)} 	</p>
                                </div>
                                <div className="d-flex px-1 justify-content-between">
                                    <p className='fw-bold'>MAKING</p>
                                    <p>{NumberWithCommas(data?.mainTotal?.total_Making_Amount + data?.mainTotal?.diamonds?.SettingAmount + data?.mainTotal?.colorstone?.SettingAmount, 2)} 	</p>
                                </div>
                                <div className="d-flex px-1 justify-content-between">
                                    <p className='fw-bold'>OTHER</p>
                                    <p>{NumberWithCommas(data?.mainTotal?.totalMiscAmount + data?.mainTotal?.total_other + data?.mainTotal?.total_diamondHandling, 2)} 	</p>
                                </div>
                                {headerData?.AddLess !== 0 && <div className="d-flex px-1 justify-content-between">
                                    <p className='fw-bold'>ADD / LESS	</p>
                                    <p>{NumberWithCommas(headerData?.AddLess, 2)} 	</p>
                                </div>}
                                <div className="d-flex justify-content-between border-top lightGrey px-1 position-absolute w-100 start-0 bottom-0">
                                    <p className='fw-bold'>TOTAL</p>
                                    <p>{NumberWithCommas(data?.mainTotal?.total_amount + headerData?.AddLess + data?.allTaxes?.reduce((acc, cObj) => acc + (+cObj?.amount * headerData?.CurrencyExchRate), 0), 2)} 	</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`${style?.remark} col-3 border h-100 border-top`}>
                        <p className="fw-bold lightGrey text-center border-bottom">Remark</p>
                        <p style={{ minHeight: "24px" }} className='px-1 text-break' dangerouslySetInnerHTML={{ __html: headerData?.PrintRemark }}></p>
                    </div>
                    <div className={`${style?.blank} col-2`}></div>
                    <div className={`${style?.checkedBy} col-2 d-flex justify-content-center align-items-end border-start border-end border-bottom border-top`} style={{ minHeight: "150px" }}>
                        <p><i>Checked by</i></p>
                    </div>
                </div>
                {/* pre msg */}
                <p className="pre pt-3 w-100 " style={{overflow: "unset", letterSpacing: "0.55px"}}>**   THIS IS A COMPUTER GENERATED INVOICE AND KINDLY NOTIFY US IMMEDIATELY IN CASE YOU FIND ANY DISCREPANCY IN THE DETAILS OF TRANSACTIONS </p>
            </div>
        </>
    ) : (
        <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
            {msg}
        </p>
    );
}

export default DetailPrint2;