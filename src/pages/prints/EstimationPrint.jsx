import React, { useEffect, useState } from 'react';
import style from "../../assets/css/prints/estimationPrint.module.css"
import { NumberWithCommas, apiCall, checkMsg, fixedValues, handleImageError, handlePrint, isObjectEmpty } from '../../GlobalFunctions';
import Loader from '../../components/Loader';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import { cloneDeep } from 'lodash';

const EstimationPrint = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [data, setData] = useState({});
    const [headerData, setHeaderData] = useState({});
    const [checkBox, setCheckBox] = useState({
        image: true,
    });
    const [isImageWorking, setIsImageWorking] = useState(true);
    const handleImageErrors = () => {
        setIsImageWorking(false);
    };
    const handleChange = (e) => {
        const { name, checked } = e?.target;
        setCheckBox({ ...checkBox, [name]: checked });
    };

    const loadData = (data) => {
        setHeaderData(data?.BillPrint_Json[0]);
        let datas = OrganizeDataPrint(data?.BillPrint_Json[0], data?.BillPrint_Json1, data?.BillPrint_Json2);
        let organizeDiamonds = [];
        data?.BillPrint_Json2?.forEach((j2, ind) => {
            if (j2?.MasterManagement_DiamondStoneTypeid === 1) {
                let findDiamonds = organizeDiamonds?.findIndex((ele, ind) => ele?.ShapeName === j2?.ShapeName && ele?.QualityName === j2?.QualityName && ele?.Colorname === j2?.Colorname && j2?.ShapeName === "RND");
                if (findDiamonds === -1) {
                    if (j2?.ShapeName === "RND") {
                        let labels = "not";
                        let objj = cloneDeep(j2);
                        objj.labels = labels;
                        objj.shapeColorQuality = objj?.ShapeName + " " + objj?.QualityName + " " + objj?.Colorname
                        organizeDiamonds.push(objj);
                    } else {
                        let findOther = organizeDiamonds?.findIndex((ele, ind) => ele?.labels === "OTHER");
                        if (findOther === -1) {
                            let labels = "OTHER";
                            let objj = cloneDeep(j2);
                            objj.labels = labels;
                            objj.shapeColorQuality = "OTHER";
                            organizeDiamonds.push(objj);
                        } else {
                            organizeDiamonds[findOther].Wt += j2?.Wt;
                            organizeDiamonds[findOther].Pcs += j2?.Pcs;
                            organizeDiamonds[findOther].Amount += j2?.Amount;
                        }
                    }
                } else {
                    organizeDiamonds[findDiamonds].Wt += j2?.Wt;
                    organizeDiamonds[findDiamonds].Pcs += j2?.Pcs;
                    organizeDiamonds[findDiamonds].Amount += j2?.Amount;
                }
            }
        });
        organizeDiamonds?.sort((a, b) => {
            if (a?.shapeColorQuality === "OTHER") {
                return 1
            } if (b?.shapeColorQuality === "OTHER") {
                return -1
            } else {
                return 0
            }
        })
        let blankArr = [];
        let diamondSettingAmounts = 0;
        let colorStoneSettingAmounts = 0;
        let findingSettingAmounts = 0;
        datas?.resultArray?.forEach((e, i) => {
            let diamonds = [];
            let finding = [];
            let colorStone = [];
            let diamondSettingAmount = 0;
            let findingSettingAmount = 0;
            let colorStoneSettingAmount = 0;

            let blankDiamonds = cloneDeep(e?.diamonds);
            blankDiamonds?.forEach((ele, ind) => {
                let findIndex = diamonds?.findIndex((elem, index) => elem?.SettingRate === ele?.SettingRate);
                diamondSettingAmount += ele?.SettingAmount;
                if (findIndex === -1) {
                    diamonds?.push(ele);
                } else {
                    diamonds[findIndex].Amount += ele?.Amount;
                    diamonds[findIndex].Pcs += ele?.Pcs;
                    diamonds[findIndex].Wt += ele?.Wt;
                    diamonds[findIndex].SettingAmount += ele?.SettingAmount;
                }
            });

            let impDiamonds = cloneDeep(e?.diamonds);
            let blankDia = [];
            impDiamonds?.forEach((ele, ind) => {
                let findDia = blankDia?.findIndex((elem, index) => elem?.ShapeName === ele?.ShapeName &&
                    elem?.Colorname === ele?.Colorname && elem?.QualityName === ele?.QualityName &&
                    elem?.SizeName === ele?.SizeName);
                if (findDia === -1) {
                    blankDia?.push(ele);
                } else {
                    blankDia[findDia].Wt += ele?.Wt;
                    blankDia[findDia].Pcs += ele?.Pcs;
                    blankDia[findDia].Amount += ele?.Amount;
                }
            })

            e?.finding?.forEach((ele, ind) => {
                let findFinding = finding?.findIndex((elem, index) => elem?.SettingRate === ele?.SettingRate);
                findingSettingAmount += ele?.SettingAmount;
                if (findFinding === -1) {
                    finding?.push(ele);
                } else {
                    finding[findFinding].Amount += ele?.Amount;
                    finding[findFinding].Pcs += ele?.Pcs;
                    finding[findFinding].Wt += ele?.Wt;
                    finding[findFinding].SettingAmount += ele?.SettingAmount;
                }
            });
            e?.colorstone?.forEach((ele, ind) => {
                let findColorStone = colorStone?.findIndex((elem, index) => elem?.SettingRate === ele?.SettingRate);
                colorStoneSettingAmount += ele?.SettingAmount;
                if (findColorStone === -1) {
                    colorStone?.push(ele);
                } else {
                    colorStone[findColorStone].Amount += ele?.Amount;
                    colorStone[findColorStone].Pcs += ele?.Pcs;
                    colorStone[findColorStone].Wt += ele?.Wt;
                    colorStone[findColorStone].SettingAmount += ele?.SettingAmount;
                }
            });
            diamondSettingAmounts += diamondSettingAmount;
            colorStoneSettingAmounts += colorStoneSettingAmount;
            findingSettingAmounts += findingSettingAmount;
            let obj = cloneDeep(e);
            obj.diamonds = blankDia;
            obj.settingDiamonds = diamonds;
            obj.settingcolorStone = colorStone;
            obj.settingFinding = finding;
            obj.diamondSettingAmount = diamondSettingAmount;
            obj.findingSettingAmount = findingSettingAmount;
            obj.colorStoneSettingAmount = colorStoneSettingAmount;
            blankArr?.push(obj);
        });
        let mainTotal = cloneDeep(datas?.mainTotal);
        mainTotal.diamondSettingAmounts = diamondSettingAmounts;
        mainTotal.colorStoneSettingAmounts = colorStoneSettingAmounts;
        mainTotal.findingSettingAmounts = findingSettingAmounts
        datas.resultArray = blankArr;
        datas.mainTotal = mainTotal;
        datas.organizeDiamonds = organizeDiamonds;
        setData(datas);
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

    }, []);

    return (
        loader ? <Loader /> : msg === "" ? <div className={`container max_width_container pad_60_allPrint mt-2 ${style?.estimationPrint} px-1`}>
            {/* print button */}
            <div className={`d-flex justify-content-end mb-4 align-items-center ${style?.print_sec_sum4} pt-4 pb-4 `}>
                <div className="form-check d-flex align-items-center">
                    <input
                        className="border-dark me-2"
                        type="checkbox"
                        checked={checkBox?.image}
                        onChange={(e) => handleChange(e)}
                        name="image"
                    />
                    <label className="">With Image</label>
                </div>
                <div className="form-check ps-3">
                    <input
                        type="button"
                        className="btn_white blue"
                        value="Print"
                        onClick={(e) => handlePrint(e)}
                    />
                </div>
            </div>
            {/* customer details */}
            <div className="bgGrey px-2 py-1" style={{ minHeight: "38px", }}>
                <p className="fs-5 text-white fw-bold">
                    {headerData?.PrintHeadLabel}
                </p>
            </div>
            <div className="mt-1 d-flex border">
                <div className="col-7 p-2 border-end">
                    <p className='lh-1'> To, </p>
                    <p className="fw-bold lh-1">{headerData?.customerfirmname} <span className='fw-normal'>({headerData?.Customercode})</span> </p>
                </div>
                <div className={`col-5 p-2 ${style?.font_12}`}>
                    <div className="d-flex">
                        <div className="col-3"> <p className='fw-bold pe-2 lh-1'>BILL NO</p></div>
                        <div className="col-6"><p className='BILL lh-1'>{headerData?.InvoiceNo}</p></div>
                    </div>
                    <div className="d-flex">
                        <div className="col-3"> <p className='fw-bold pe-2 lh-1'>DATE</p></div>
                        <div className="col-6"><p className='BILL lh-1'>{headerData?.EntryDate}</p></div>
                    </div>
                    <div className="d-flex">
                        <div className="col-3"> <p className='fw-bold pe-2 lh-1'>{headerData?.HSN_No_Label}</p></div>
                        <div className="col-6"><p className='BILL lh-1'>{headerData?.HSN_No}</p></div>
                    </div>
                </div>
            </div>
            {/* table header */}
            <div className='mt-1 border-top border-start border-end border-black'>
                <div className={`d-flex border-bottom lightGrey ${style?.font_11}`}>
                    <div className={`${style?.Sr} border-end d-flex align-items-center justify-content-center`}><p className='p-1 fw-bold  text-center'>Sr</p></div>
                    <div className={`${style?.Design} border-end d-flex align-items-center justify-content-center`}><p className='p-1 fw-bold  text-center'>Design</p></div>
                    <div className={`${style?.Diamond} border-end`}>
                        <div className="d-grid h-100">
                            <div className="d-flex">
                                <p className='fw-bold text-center w-100 p-1'>Diamond</p>
                            </div>
                            <div className="d-flex border-top">
                                <div className="col-2 border-end"><p className='p-1 fw-bold  text-center'>Code</p></div>
                                <div className="col-2 border-end"><p className='p-1 fw-bold  text-center'>Size</p></div>
                                <div className="col-2 border-end"><p className='p-1 fw-bold  text-center'>Pcs</p></div>
                                <div className="col-2 border-end"><p className='p-1 fw-bold  text-center'>Wt</p></div>
                                <div className="col-2 border-end"><p className='p-1 fw-bold  text-center'>Rate</p></div>
                                <div className="col-2"><p className='p-1 fw-bold  text-center'>Amount</p></div>
                            </div>
                        </div>
                    </div>
                    <div className={`${style?.Making} border-end`}>
                        <div className="d-grid h-100">
                            <div className="d-flex">
                                <p className='fw-bold text-center w-100 p-1'>Making</p>
                            </div>
                            <div className="d-flex border-top">
                                <div className="col-6 border-end"><p className='p-1 fw-bold  text-center'>Rate	</p></div>
                                <div className="col-6"><p className='p-1 fw-bold  text-center'>Amount</p></div>
                            </div>
                        </div>
                    </div>
                    <div className={`${style?.Product} border-end d-flex align-items-center justify-content-center`}><p className='p-1 fw-bold  text-center'>Product Amount</p></div>
                    <div className={`${style?.Discount} border-end d-flex align-items-center justify-content-center`}><p className='p-1 fw-bold  text-center'>Discount</p></div>
                    <div className={`${style?.Total} d-flex align-items-center justify-content-center`}><p className='p-1 fw-bold  text-center'>Total Amount</p></div>
                </div>
            </div>
            {/* table data */}
            {data?.resultArray?.map((e, i) => {
                return <div key={i} className={`border-start border-end border-black no_break ${style?.font_11}`}>
                    <div className={`d-flex border-bottom ${style?.font_11}`}>
                        <div className={`${style?.Sr} border-end d-flex align-items-center justify-content-center`}><p className='p-1  text-center'>{i + 1}</p></div>
                        <div className={`${style?.Design} border-end `}>
                            <div className='d-flex align-items-center justify-content-between flex-wrap'>
                                <p className='p-1 '>{e?.designno}</p>
                                <p className="p-1">{e?.SrJobno}</p>
                            </div>
                            <div>
                                {checkBox?.image && <img src={e?.DesignImage} alt="" onError={eve => handleImageError(eve)} className='imgWidth' />}
                            </div>
                            <p className='text-center'><span className="fw-bold">{NumberWithCommas(e?.grosswt, 3)} gm </span>Gross</p>
                        </div>
                        <div className={`${style?.Diamond} border-end`}>
                            <div className="d-flex flex-column justify-content-between h-100">
                                {e?.diamonds?.map((ele, ind) => {
                                    return <div className="d-flex" key={ind}>
                                        <div className="col-2"><p className='p-1 '>{ele?.ShapeName} {ele?.QualityName} {ele?.Colorname} </p></div>
                                        <div className="col-2"><p className='p-1'>{ele?.SizeName}</p></div>
                                        <div className="col-2"><p className='p-1 text-center'>{NumberWithCommas(ele?.Pcs, 0)}</p></div>
                                        <div className="col-2"><p className='p-1 text-end'>{NumberWithCommas(ele?.Wt, 3)}</p></div>
                                        <div className="col-2"><p className='p-1 text-end'>{ele?.Wt !== 0 && NumberWithCommas(Math.round(ele?.Amount / ele?.Wt, 2), 0)}</p></div>
                                        <div className="col-2"><p className='p-1 text-end fw-bold'>{NumberWithCommas(ele?.Amount, 2)}</p></div>
                                    </div>
                                })}
                                {e?.diamonds?.length === 0 && <div className="d-flex ">
                                    <div className="col-2"><p className='p-1 '></p></div>
                                    <div className="col-2"><p className='p-1'></p></div>
                                    <div className="col-2"><p className='p-1 text-end'></p></div>
                                    <div className="col-2"><p className='p-1 text-end'></p></div>
                                    <div className="col-2"><p className='p-1 text-end'></p></div>
                                    <div className="col-2"><p className='p-1 text-end'></p></div>
                                </div>}
                                <div>
                                    <div className="d-flex lightGrey border-top">
                                        <div className="col-2"><p className='p-1 fw-bold '></p></div>
                                        <div className="col-2"><p className='p-1 fw-bold'></p></div>
                                        <div className="col-2"><p className='p-1 fw-bold text-center'>{e?.totals?.diamonds?.Pcs !== 0 && NumberWithCommas(e?.totals?.diamonds?.Pcs, 0)}</p></div>
                                        <div className="col-2"><p className='p-1 fw-bold text-end'>{NumberWithCommas(e?.totals?.diamonds?.Wt, 3)}</p></div>
                                        <div className="col-2"><p className='p-1 fw-bold text-end'></p></div>
                                        <div className="col-2"><p className='p-1 fw-bold text-end'>{NumberWithCommas(e?.totals?.diamonds?.Amount, 2)}</p></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`${style?.Making} border-end`}>
                            <div className="d-flex flex-column justify-content-between h-100">
                                <div>
                                    <div className="d-flex pt-1">
                                        <div className="col-6"><p className='px-1 lh-1 text-end'>{NumberWithCommas(e?.MaKingCharge_Unit, 2)}	</p></div>
                                        <div className="col-6"><p className='px-1 lh-1 text-end'>{NumberWithCommas(e?.MakingAmount, 2)}</p></div>
                                    </div>
                                    {e?.settingDiamonds?.map((ele, ind) => {
                                        return ele?.SettingRate !== 0 && <div className="d-flex" key={ind}>
                                            <div className="col-6"><p className='px-1 lh-1 text-end'>{NumberWithCommas(ele?.SettingRate, 2)} </p></div>
                                            <div className="col-6"><p className='px-1 lh-1 text-end'>{NumberWithCommas(ele?.SettingAmount, 2)}</p></div>
                                        </div>
                                    })}
                                    {e?.settingcolorStone?.map((ele, ind) => {
                                        return ele?.SettingRate !== 0 && <div className="d-flex" key={ind}>
                                            <div className="col-6"><p className='px-1 lh-1 text-end'>{NumberWithCommas(ele?.SettingRate, 2)} </p></div>
                                            <div className="col-6"><p className='px-1 lh-1 text-end'>{NumberWithCommas(ele?.SettingAmount, 2)}</p></div>
                                        </div>
                                    })}
                                    {e?.settingFinding?.map((ele, ind) => {
                                        return ele?.SettingRate !== 0 && <div className="d-flex" key={ind}>
                                            <div className="col-6"><p className='px-1 lh-1 text-end'>{NumberWithCommas(ele?.SettingRate, 2)} </p></div>
                                            <div className="col-6"><p className='px-1 lh-1 text-end'>{NumberWithCommas(ele?.SettingAmount, 2)}</p></div>
                                        </div>
                                    })}
                                </div>
                                <div className="d-flex lightGrey border-top">
                                    <div className="col-6"><p className='p-1 fw-bold text-end'></p></div>
                                    <div className="col-6"><p className='p-1 fw-bold text-end'>{NumberWithCommas(e?.MakingAmount + e?.diamondSettingAmount + e?.colorStoneSettingAmount, 2)}</p></div>
                                </div>
                            </div>
                        </div>
                        <div className={`${style?.Product} border-end`}>
                            <div className="d-flex justify-content-between h-100 flex-column">
                                <p className='p-1  text-end'>{NumberWithCommas(e?.CsAmount, 2)}	</p>
                                <p className='p-1  text-end lightGrey fw-bold border-top'>{NumberWithCommas(e?.CsAmount, 2)}	</p>
                            </div>
                        </div>
                        <div className={`${style?.Discount} border-end`}>
                            <div className="d-flex justify-content-between h-100 flex-column">
                                <p className='p-1  text-end'>{NumberWithCommas(e?.DiscountAmt, 2)}	</p>
                                <p className='p-1  text-end lightGrey fw-bold border-top'>{NumberWithCommas(e?.DiscountAmt, 2)}	</p>
                            </div>
                        </div>
                        <div className={`${style?.Total}`}>
                            <div className="d-flex justify-content-between h-100 flex-column">
                                <p className='p-1 text-end fw-bold'>{NumberWithCommas(e?.TotalAmount, 2)}</p>
                                <p className='p-1 text-end lightGrey fw-bold border-top'>{NumberWithCommas(e?.TotalAmount, 2)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            })}
            {/* table taxes */}
            <div className='border-start border-end border-black no_break'>
                <div className={`d-flex border-bottom ${style?.font_11}`}>
                    <div className={`${style?.taxes} text-end`}>
                        {data?.allTaxes?.map((ele, ind) => {
                            return <p key={ind} className='px-1'>{ele?.name} @ {ele?.per}</p>
                        })}
                        {headerData?.AddLess !== 0 &&
                            <p className='px-1'>{headerData?.AddLess > 0 ? "ADD" : "LESS"}</p>
                        }
                    </div>
                    <div className={`${style?.Total}`}>
                        {data?.allTaxes?.map((ele, ind) => {
                            return <p key={ind} className='text-end px-1'>{NumberWithCommas(+ele?.amount * headerData?.CurrencyExchRate, 2)}</p>
                        })}
                        {headerData?.AddLess !== 0 &&
                            <p className='text-end px-1'>{NumberWithCommas(headerData?.AddLess, 2)}</p>
                        }
                    </div>
                </div>
            </div>
            {/* table total */}
            <div className={`d-flex no_break border-start border-end border-bottom border-black lightGrey ${style?.font_11}`}>
                <div className={`${style?.total} border-end d-flex align-items-center justify-content-center`}><p className='p-1 fw-bold'>TOTAL</p></div>
                <div className={`${style?.Diamond} border-end d-flex`}>
                    <div className="col-2"><p className='p-1 fw-bold '></p></div>
                    <div className="col-2"><p className='p-1 fw-bold'></p></div>
                    <div className="col-2"><p className='p-1 fw-bold text-center'>{NumberWithCommas(data?.mainTotal?.diamonds?.Pcs, 0)}</p></div>
                    <div className="col-2"><p className='p-1 fw-bold text-end'>{NumberWithCommas(data?.mainTotal?.diamonds?.Wt, 3)}</p></div>
                    <div className="col-2"><p className='p-1 fw-bold text-end'></p></div>
                    <div className="col-2"><p className='p-1 fw-bold text-end'>{NumberWithCommas(data?.mainTotal?.diamonds?.Amount, 2)}</p></div>
                </div>
                <div className={`${style?.Making} border-end d-flex`}>
                    <div className="col-6"><p className='p-1 fw-bold text-end'></p></div>
                    <div className="col-6"><p className='p-1 fw-bold text-end'>{NumberWithCommas(data?.mainTotal?.total_Making_Amount + data?.mainTotal?.diamondSettingAmounts + data?.mainTotal?.colorStoneSettingAmounts, 2)}</p></div>
                </div>
                <div className={`${style?.Product} border-end`}>
                    <p className='p-1  text-end  fw-bold'>{NumberWithCommas(data?.mainTotal?.total_csamount, 2)}</p>
                </div>
                <div className={`${style?.Discount} border-end`}>
                    <p className='p-1  text-end  fw-bold'>{NumberWithCommas(data?.mainTotal?.total_discount_amount, 2)}	</p>
                </div>
                <div className={`${style?.Total}`}>
                    <p className='p-1  text-end  fw-bold'>{NumberWithCommas(data?.mainTotal?.total_amount+data?.allTaxes?.reduce((acc, cObj) => acc+ (+cObj?.amount * headerData?.CurrencyExchRate), 0)+headerData?.AddLess, 2)}</p>
                </div>
            </div>
            {/* summary */}
            <div className={`d-flex no_break ${style?.font_11}`}>
                <div className="col-6 p-1">
                    <div className="border">
                        <p className="fw-bold border-bottom lightGrey text-center">SUMMARY</p>
                        <div className="d-flex">
                            <div className="col-6 border-end d-flex flex-column justify-content-between">
                                <div>
                                    <div className="d-flex justify-content-between px-2">
                                        <p className="fw-bold">GROSS WT</p>
                                        <p>{NumberWithCommas(data?.mainTotal?.grosswt, 3)} gm</p>
                                    </div>
                                    <div className="d-flex justify-content-between px-2">
                                        <p className="fw-bold">DIAMOND WT</p>
                                        <p>{NumberWithCommas(data?.mainTotal?.diamonds?.Pcs, 0)} / {NumberWithCommas(data?.mainTotal?.diamonds?.Wt, 3)} cts</p>
                                    </div>
                                </div>
                                <div>
                                    <div className="d-flex justify-content-between lightGrey border-top px-2" style={{ minHeight: "17.5px" }}>
                                        <p className="fw-bold"></p>
                                        <p></p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 d-flex flex-column justify-content-between">
                                <div>
                                    <div className="d-flex justify-content-between px-2 ">
                                        <p className="fw-bold">DIAMOND</p>
                                        <p>{NumberWithCommas(data?.mainTotal?.diamonds?.Amount, 2)}</p>
                                    </div>
                                    <div className="d-flex justify-content-between  px-2 ">
                                        <p className="fw-bold">MAKING</p>
                                        <p>{NumberWithCommas(data?.mainTotal?.total_Making_Amount + data?.mainTotal?.diamonds?.SettingAmount + data?.mainTotal?.colorstone?.SettingAmount, 2)}</p>
                                    </div>
                                    <div className="d-flex justify-content-between  px-2 ">
                                        <p className="fw-bold">OTHER</p>
                                        <p>{NumberWithCommas(data?.mainTotal?.total_otherCharge_Diamond_Handling, 2)}</p>
                                    </div>
                                    {headerData?.AddLess !== 0 && <div className="d-flex justify-content-between  px-2 ">
                                        <p className="fw-bold">{headerData?.AddLess > 0 ? "ADD" : "LESS"}</p>
                                        <p>{NumberWithCommas(headerData?.AddLess, 2)}</p>
                                    </div>}
                                </div>
                                <div>
                                    <div className="d-flex justify-content-between  px-2  lightGrey border-top">
                                        <p className="fw-bold">TOTAL</p>
                                        <p>{NumberWithCommas(data?.mainTotal?.total_amount+data?.allTaxes?.reduce((acc, cObj) => acc+ (+cObj?.amount * headerData?.CurrencyExchRate), 0)+headerData?.AddLess, 2)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-3 p-1">
                    <div className="border">
                        <p className="fw-bold border-bottom lightGrey text-center">Diamond Detail</p>
                        <div>
                            {data?.organizeDiamonds?.map((ele, ind) => {
                                return <div className="d-flex justify-content-between px-2" key={ind}>
                                    <p className="fw-bold">{ele?.shapeColorQuality}</p>
                                    <p>{NumberWithCommas(ele?.Pcs, 0)} / {NumberWithCommas(ele?.Wt, 3)} cts</p>
                                </div>
                            })}
                        </div>
                        <div>
                            <div className="d-flex justify-content-between lightGrey border-top px-2" style={{ minHeight: "17.5px" }}>
                                <p className="fw-bold"></p>
                                <p></p>
                            </div>
                        </div>
                    </div>
                </div>
                {headerData?.PrintRemark !== "" && <div className="col-2 h-100 p-1">
                    <div className='border'>
                        <p className="fw-bold lightGrey p-1 border-bottom text-center">Remark</p>
                        <p className='p-1' dangerouslySetInnerHTML={{ __html: headerData?.PrintRemark }}></p>
                    </div>
                </div>}
            </div>
            {/* pre generate text */}
            <pre className='preText no_break'>** THIS IS A COMPUTER GENERATED INVOICE AND KINDLY NOTIFY US IMMEDIATELY IN CASE YOU FIND ANY DISCREPANCY IN THE DETAILS OF TRANSACTIONS</pre>

        </div> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
    )
}

export default EstimationPrint
