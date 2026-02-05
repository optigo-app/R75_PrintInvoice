import React, { useEffect } from "react";
import style from "../../assets/css/prints/export.module.css";
import { NumberWithCommas, apiCall, checkMsg, fixedValues, handlePrint, isObjectEmpty } from "../../GlobalFunctions";
import { useState } from "react";
import Loader from "../../components/Loader";
import { cloneDeep } from "lodash";

const Export = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
    const [loader, setLoader] = useState(true);
    const [json0Data, setJson0Data] = useState({});
    const [data, setData] = useState([]);
    const [msg, setMsg] = useState("");
    const [isImageWorking, setIsImageWorking] = useState(true);
    const handleImageErrors = () => {
        setIsImageWorking(false);
    };
    const [total, setTotal] = useState({
        qtyPcsPair: 0,
        grossWt: 0,
        netWt: 0,
        golSilValue: 0,
        diaPcs: 0,
        diaCts: 0,
        diaValue: 0,
        czCsPcs: 0,
        czCsCts: 0,
        czCsValue: 0,
        totalCts: 0,
        totalVal: 0,
        labourVal: 0,
        fobValue: 0,
        counts: 0
    });

    const loadData = (data) => {
        setJson0Data(data?.BillPrint_Json[0]);
        let arr = [];
        data?.BillPrint_Json1.forEach((e, i) => {
            let obj = cloneDeep(e);
            let counts = 1;
            let metal = [];
            let diamonds = [];
            let colorstones = [];
            let primaryWt = 0;
            let goldWt = 0;
            let primaryAmount = 0;
            let findingSetAmount = 0
            data?.BillPrint_Json2.forEach((ele, ind) => {
                if (e?.SrJobno === ele?.StockBarcode) {
                    if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
                        let findDiamond = diamonds?.findIndex((elem, ind) => elem?.ShapeName === ele?.ShapeName &&
                            elem?.QualityName === ele?.QualityName && elem?.Colorname === ele?.Colorname);
                        if (findDiamond === -1) {
                            diamonds.push(ele);
                        } else {
                            diamonds[findDiamond].Pcs += ele?.Pcs;
                            diamonds[findDiamond].Wt += ele?.Wt;
                            diamonds[findDiamond].Amount += ele?.Amount;
                        }
                    }
                    else if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
                        if (colorstones?.length === 0) {
                            colorstones.push(ele);
                        } else {
                            colorstones[0].Wt += ele?.Wt;
                            colorstones[0].Pcs += ele?.Pcs;
                            colorstones[0].Amount += ele?.Amount;
                            colorstones[0].Rate = (colorstones[0].Rate + ele?.Rate) / 2;
                        }
                    }
                    else if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
                        metal.push(ele);
                        if (ele?.IsPrimaryMetal === 1) {
                            primaryWt += ele?.Wt;
                            primaryAmount += ele?.Amount;
                            goldWt += ele?.Wt;

                        }
                    }
                    else if (ele?.MasterManagement_DiamondStoneTypeid === 5) {
                        findingSetAmount += ele?.SettingAmount;
                    }
                }
            });
            obj.metal = metal;
            obj.diamonds = diamonds;
            obj.colorstones = colorstones;
            obj.counts = counts;
            obj.primaryWt = primaryWt;
            obj.goldWt = goldWt;
            obj.primaryAmount = primaryAmount;
            obj.findingSetAmount = findingSetAmount;
            arr.push(obj);
        });
        let blankArr = [];
        arr.forEach((e, i) => {
            // let findIndex = blankArr.findIndex((ele, ind) => ele?.Collectionname === e?.Collectionname && ele?.Categoryname === e?.Categoryname);
            let findIndex = blankArr.findIndex((ele, ind) => ele?.Categoryname === e?.Categoryname && ele?.MetalPurity === e?.MetalPurity);
            if (findIndex === -1) {
                blankArr.push(e);
            } else {
                blankArr[findIndex].grosswt += e?.grosswt;
                blankArr[findIndex].NetWt += e?.NetWt;
                blankArr[findIndex].MetalAmount += e?.MetalAmount;
                blankArr[findIndex].MakingAmount += e?.MakingAmount;
                blankArr[findIndex].MiscAmount += e?.MiscAmount;
                blankArr[findIndex].TotalDiamondHandling += e?.TotalDiamondHandling;
                blankArr[findIndex].TotalAmount += e?.TotalAmount;
                blankArr[findIndex].metal = (blankArr[findIndex]?.metal).concat(e?.metal);
                blankArr[findIndex].goldWt += e?.goldWt;
                blankArr[findIndex].MetalWeight += e?.MetalWeight

                blankArr[findIndex].colorstones = (blankArr[findIndex]?.colorstones).concat(e?.colorstones);
                blankArr[findIndex].counts += 1;
                blankArr[findIndex].primaryWt += e?.primaryWt;
                blankArr[findIndex].primaryAmount += e?.primaryAmount;
                blankArr[findIndex].TotalCsSetcost += e?.TotalCsSetcost;
                blankArr[findIndex].TotalDiaSetcost += e?.TotalDiaSetcost;
                blankArr[findIndex].findingSetAmount += e?.findingSetAmount;

                let diamonds = [...blankArr[findIndex].diamonds, ...e?.diamonds]?.flat();
                let blankDiamonds = [];
                diamonds?.forEach((ele, ind) => {
                    let findDiamond = blankDiamonds?.findIndex((elem, index) => elem?.ShapeName === ele?.ShapeName && elem?.QualityName === ele?.QualityName && elem?.Colorname === ele?.Colorname);
                    if (findDiamond === -1) {
                        blankDiamonds?.push(ele);
                    } else {
                        blankDiamonds[findDiamond].Pcs += ele?.Pcs;
                        blankDiamonds[findDiamond].Wt += ele?.Wt;
                        blankDiamonds[findDiamond].Amount += ele?.Amount;
                    }
                })
                blankArr[findIndex].diamonds = blankDiamonds;

            }
        });
        let totals = { ...total };
        let resultArr = [];
        blankArr.forEach((e, i) => {
            let obj = { ...e };
            obj.totalCts = 0;
            obj.totalVal = 0;
            obj.metalWt = 0;
            obj.metalAmount = 0;
            totals.grossWt += e?.grosswt;
            totals.netWt += e?.NetWt;
            totals.labourVal += e?.MakingAmount + e?.TotalCsSetcost + e?.TotalDiaSetcost;
            totals.fobValue += e?.TotalAmount;
            totals.counts += e?.counts;
            totals.golSilValue += e?.primaryAmount;
            if (e?.diamonds.length > 0) {
                e?.diamonds.forEach((ele, ind) => {
                    obj.totalCts += ele.Wt;
                    obj.totalVal += ele?.Amount;
                    totals.diaPcs += ele?.Pcs;
                    totals.diaCts += +(fixedValues(ele?.Wt, 2));
                    totals.diaValue += ele?.Amount;
                    totals.totalCts += ele.Wt;
                    totals.totalVal += ele.Amount;
                });
            }
            if (e?.colorstones.length > 0) {
                e?.colorstones.forEach((ele, ind) => {
                    obj.totalCts += ele.Wt;
                    obj.totalVal += ele?.Amount;
                    totals.czCsPcs += ele.Pcs;
                    totals.czCsCts += ele.Wt;
                    totals.czCsValue += ele.Amount;
                    totals.totalCts += ele.Wt;
                    totals.totalVal += ele.Amount;
                });
            }
            if (e?.metal.length > 0) {
                e?.metal.forEach((ele, ind) => {
                    obj.metalWt += ele.Wt;
                    obj.metalAmount += ele?.Amount;
                    // totals.golSilValue += ele?.Amount;
                });
            }
            resultArr.push(obj);
        });
        resultArr.sort((a, b) => {
            const nameA = a.Categoryname.toLowerCase();
            const nameB = b.Categoryname.toLowerCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
        });
        setTotal(totals);
        setData(resultArr);
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
        loader ? <Loader /> : msg === "" ? <>
            {/* print button  */}
            <div className="pad_60_allPrint mt-2">
                <div className={`d-flex justify-content-end mb-4 align-items-center ${style?.print_sec_sum4} pt-4 ${style?.exportPrintContainer} max_width_container px-1`}>

                    <div className="form-check ps-3">
                        <input
                            type="button"
                            className={`btn_white blue mt-2 ${style?.btn_white}`}
                            value="Print"
                            onClick={(e) => handlePrint(e)}
                            style={{ padding: "3px 4px" }}
                        />
                    </div>
                </div>
                <div className={`${style?.exportPrintContainer} max_width_container px-1`}>
                    <div className="">
                        {/* company details */}
                        <div className="d-flex border">
                            <div className="d-flex col-7">
                                <div className="col-2 ps-1 py-1 fw-semibold">
                                    <p>CompanyName :  </p>
                                    <p>Inv .# : </p>
                                    <p>Dated : </p>
                                    <p>Party :</p>
                                </div>
                                <div className="col-10 py-1">
                                    <p> {json0Data?.customerfirmname} </p>
                                    <p> {json0Data?.InvoiceNo} </p>
                                    <p> {json0Data?.EntryDate} </p>
                                    <p> {json0Data?.CustName}</p>
                                </div>
                            </div>
                        </div>
                        {/* table heading */}
                        <div className={`d-flex border-start border-end border-bottom fw-semibold`}>
                            <div className={`d-flex justify-content-center align-items-center border-end text-center ${style.srNoExport} ${style.rowExport} ${style?.padx_2}`}>Sr No</div>
                            <div className={`d-flex align-items-center border-end  ${style.itemExport} ${style.rowExport} ${style?.padx_2}`}>Item</div>
                            <div className={`d-flex  align-items-center border-end  ${style.ktColExport} ${style.rowExport} ${style?.padx_2}`}>KT/Col</div>
                            <div className={`d-flex justify-content-end align-items-center border-end text-end ${style.qtyExport} ${style.rowExport} ${style?.padx_2}`}>Qty (PCS & PAIR)</div>
                            <div className={`d-flex justify-content-end align-items-center border-end text-end ${style.grossExport} ${style.rowExport} ${style?.padx_2}`}>Gross Wt</div>
                            <div className={`d-flex justify-content-end align-items-center border-end text-end ${style.netExport} ${style.rowExport} ${style?.padx_2}`}>Net Wt</div>
                            <div className={`d-flex justify-content-end align-items-center border-end text-end ${style.wastageExport} ${style.rowExport} ${style?.padx_2}`}>wastage</div>
                            <div className={`d-flex justify-content-end align-items-center border-end text-end ${style.totalGoldExport} ${style.rowExport} ${style?.padx_2}`}>Total Gold Wt.</div>
                            <div className={`d-flex justify-content-end align-items-center border-end text-end ${style.goldGmExport} ${style.rowExport} ${style?.padx_2}`}>Gold & sil Rate/gms $</div>
                            <div className={`d-flex justify-content-center align-items-end flex-column border-end text-end ${style.goldValueExport} ${style.rowExport} ${style?.padx_2}`}><p>Gold & sil </p><p>Value $</p></div>

                            <div className={`${style?.diamondSec}`}>
                                <div className="d-grid h-100">
                                    <div className="d-flex">
                                        <div className={`d-flex align-items-center border-end  ${style?.padx_2} ${style.diaShapeExport} ${style.rowExport}`}>Dia shape</div>
                                        <div className={`d-flex align-items-center border-end ${style?.padx_2} ${style.diamondColorExport} ${style.rowExport}`}>e	Diamond Color/Clarity</div>
                                        <div className={`d-flex justify-content-end align-items-center border-end text-end ${style?.padx_2} ${style.diaPcsExport} ${style.rowExport}`}>Dia Pcs</div>
                                        <div className={`d-flex justify-content-end align-items-center border-end text-end ${style?.padx_2} ${style.diaCtsExport} ${style.rowExport}`}>Dia Cts	</div>
                                        <div className={`d-flex justify-content-end align-items-center border-end text-end ${style?.padx_2} ${style.diaRateExport} ${style.rowExport}`}>Dia Rate</div>
                                        <div className={`d-flex justify-content-end align-items-center border-end text-end ${style?.padx_2} ${style.diaValueExport} ${style.rowExport}`}>Dia Value</div>
                                    </div>
                                </div>
                            </div>

                            <div className={`${style?.c2CsSec}`}>
                                <div className="d-grid h-100">
                                    <div className="d-flex">
                                        <div className={`d-flex justify-content-end align-items-center border-end text-end ${style?.padx_2} ${style.c2csPcsExport}`}>cz/cs Pcs</div>
                                        <div className={`d-flex justify-content-end align-items-center border-end text-end ${style?.padx_2} ${style.c2csCtsExport}`}>cz/cs Cts</div>
                                        <div className={`d-flex justify-content-end align-items-center border-end text-end ${style?.padx_2} ${style.c2csRateExport}`}>cz/cs Rate</div>
                                        <div className={`d-flex justify-content-end align-items-center border-end text-end ${style?.padx_2} ${style.c2csValueExport}`}>cz/cs Value</div>
                                    </div>
                                </div>
                            </div>

                            <div className={`d-flex justify-content-end align-items-center border-end text-end ${style?.padx_2} ${style.totalCtsExport} ${style.rowExport}`}>Total Cts</div>
                            <div className={`d-flex justify-content-end align-items-center border-end text-end ${style?.padx_2} ${style.totalValExport} ${style.rowExport}`}>Total Val $</div>
                            <div className={`d-flex justify-content-end align-items-center border-end text-end ${style?.padx_2} ${style.enamelWtExport} ${style.rowExport}`}>enamel wt. gms</div>
                            <div className={`d-flex justify-content-end align-items-center border-end text-end ${style?.padx_2} ${style.labourValueExport} ${style.rowExport}`}>VA/Labor Value</div>
                            <div className={`d-flex justify-content-center align-items-end text-end flex-column ${style?.padx_2} ${style.totalFobExport} ${style.rowExport}`}><p>Total FOB </p><p>Value $</p></div>
                        </div>
                        {/* data */}
                        {data && data.map((e, i) => {
                            return <div className={`d-flex border-start border-end border-bottom`} key={i}>
                                <div className={`border-end ${style.srNoExport} d-flex align-items-center justify-content-center ${style.rowExport} text-center ${style?.padx_2}`}>{i + 1}</div>
                                <div className={`border-end ${style.itemExport} d-flex align-items-center ${style.rowExport} ${style?.padx_2}`}>{e?.Categoryname}</div>
                                <div className={`border-end ${style.ktColExport} d-flex align-items-center ${style.rowExport} ${style?.padx_2}`}>{e?.MetalPurity}</div>
                                <div className={`border-end ${style.qtyExport} d-flex align-items-center justify-content-end ${style.rowExport} ${style?.padx_2}`}>{NumberWithCommas(e?.counts, 0)}</div>
                                <div className={`border-end ${style.grossExport} d-flex align-items-center justify-content-end ${style.rowExport} ${style?.padx_2}`}>{fixedValues(e?.grosswt, 3)}</div>
                                <div className={`border-end ${style.netExport} d-flex align-items-center justify-content-end ${style.rowExport} ${style?.padx_2}`}>{fixedValues(e?.NetWt, 3)}</div>
                                <div className={`border-end ${style.wastageExport} d-flex align-items-center justify-content-end ${style.rowExport} ${style?.padx_2}`}></div>
                                <div className={`border-end ${style.totalGoldExport} d-flex align-items-center justify-content-end ${style.rowExport} ${style?.padx_2}`}>{fixedValues(e?.MetalWeight, 3)}</div>
                                <div className={`border-end ${style.goldGmExport} d-flex align-items-center justify-content-end ${style.rowExport} ${style?.padx_2}`}>{e?.NetWt !== 0 && (NumberWithCommas(e?.primaryAmount / e?.primaryWt, 2))}</div>
                                <div className={`border-end ${style.goldValueExport} d-flex align-items-center justify-content-end ${style.rowExport} ${style?.padx_2}`}>{NumberWithCommas(e?.primaryAmount, 2)}</div>
                                <div className={`${style?.diamondSec}`}>
                                    <div className="d-grid h-100">
                                        {e?.diamonds.length > 0 ? e?.diamonds.map((ele, ind) => {
                                            return <div className={`d-flex ${ind !== e?.diamonds.length - 1 && `border-bottom`}`} key={ind}>
                                                <div className={`border-end ${style.diaShapeExport} d-flex align-items-center ${style.rowExport} ${style?.padx_2}`}>{ele?.ShapeName}</div>
                                                <div className={`border-end ${style.diamondColorExport} d-flex align-items-center ${style.rowExport} ${style?.padx_2}`}>
                                                    {/* {ele?.ShapeName}/{ele?.QualityName}-{ele?.Colorname} */}
                                                    {ele?.Colorname}/{ele?.QualityName}
                                                </div>
                                                <div className={`border-end ${style.diaPcsExport} d-flex align-items-center justify-content-end ${style.rowExport} ${style?.padx_2}`}>{NumberWithCommas(ele?.Pcs, 0)}</div>
                                                <div className={`border-end ${style.diaCtsExport} d-flex align-items-center justify-content-end ${style.rowExport} ${style?.padx_2}`}>{NumberWithCommas(Math.round((ele?.Wt + Number.EPSILON) * 100) / 100, 2)}</div>
                                                <div className={`border-end ${style.diaRateExport} d-flex align-items-center justify-content-end ${style.rowExport} ${style?.padx_2}`}>{ele?.Wt !== 0 && NumberWithCommas((Math.round(ele?.Amount * 100) / 100) / (Math.round((ele?.Wt + Number.EPSILON) * 100) / 100), 2)}</div>
                                                <div className={`border-end ${style.diaValueExport} d-flex align-items-center justify-content-end ${style.rowExport} ${style?.padx_2}`}>
                                                    {ele?.Amount !== 0 && NumberWithCommas(Math.round(ele?.Amount * 100) / 100, 2)}
                                                </div>
                                            </div>
                                        }) : <div className={`d-flex`}>
                                            <div className={`border-end ${style.diaShapeExport} d-flex align-items-center ${style.rowExport}`}></div>
                                            <div className={`border-end ${style.diamondColorExport} d-flex align-items-center ${style.rowExport}`}></div>
                                            <div className={`border-end ${style.diaPcsExport} d-flex align-items-center justify-content-end ${style.rowExport}`}></div>
                                            <div className={`border-end ${style.diaCtsExport} d-flex align-items-center justify-content-end ${style.rowExport}`}></div>
                                            <div className={`border-end ${style.diaRateExport} d-flex align-items-center justify-content-end ${style.rowExport}`}></div>
                                            <div className={`border-end ${style.diaValueExport} d-flex align-items-center justify-content-end ${style.rowExport}`}></div>
                                        </div>}
                                    </div>
                                </div>
                                <div className={`${style?.c2CsSec}`}>
                                    <div className="d-grid h-100">
                                        {e?.colorstones.length > 0 ? e?.colorstones.map((ele, ind) => {
                                            return <div className={`d-flex ${ind !== e?.colorstones.length - 1 && `border-bottom`}`} key={ind}>
                                                <div className={`d-flex align-items-center justify-content-end border-end ${style.c2csPcsExport} ${style.rowExport} ${style?.padx_2}`}>{NumberWithCommas(ele?.Pcs, 0)}</div>
                                                <div className={`d-flex align-items-center justify-content-end border-end ${style.c2csCtsExport} ${style.rowExport} ${style?.padx_2}`}>{NumberWithCommas(Math.round((ele?.Wt + Number.EPSILON) * 100) / 100, 3)}</div>
                                                <div className={`d-flex align-items-center justify-content-end border-end ${style.c2csRateExport} ${style.rowExport} ${style?.padx_2}`}>{NumberWithCommas(Math.round(ele?.Amount * 100) / 100 / (Math.round((ele?.Wt + Number.EPSILON) * 100) / 100), 2)}</div>
                                                <div className={`d-flex align-items-center justify-content-end border-end ${style.c2csValueExport} ${style.rowExport} ${style?.padx_2}`}>{NumberWithCommas(Math.round(ele?.Amount * 100) / 100, 2)}</div>
                                            </div>
                                        }) : <div className={`d-flex`}>
                                            <div className={`d-flex align-items-center justify-content-end border-end ${style.c2csPcsExport} ${style.rowExport}`}></div>
                                            <div className={`d-flex align-items-center justify-content-end border-end ${style.c2csCtsExport} ${style.rowExport}`}></div>
                                            <div className={`d-flex align-items-center justify-content-end border-end ${style.c2csRateExport} ${style.rowExport}`}></div>
                                            <div className={`d-flex align-items-center justify-content-end border-end ${style.c2csValueExport} ${style.rowExport}`}></div>
                                        </div>}
                                    </div>
                                </div>
                                <div className={`d-flex align-items-center justify-content-end border-end ${style.totalCtsExport} ${style.rowExport} ${style?.padx_2}`}>{NumberWithCommas(e?.totalCts, 3)}</div>
                                <div className={`d-flex align-items-center justify-content-end border-end ${style.totalValExport} ${style.rowExport} ${style?.padx_2}`}>{NumberWithCommas(e?.totalVal, 2)}</div>
                                <div className={`d-flex align-items-center justify-content-end border-end ${style.enamelWtExport} ${style.rowExport} ${style?.padx_2}`}></div>
                                <div className={`d-flex align-items-center justify-content-end border-end ${style.labourValueExport} ${style.rowExport} ${style?.padx_2}`}>
                                    {(e?.MakingAmount + e?.TotalCsSetcost + e?.TotalDiaSetcost) !== 0 &&
                                        NumberWithCommas(e?.MakingAmount + e?.TotalCsSetcost + e?.TotalDiaSetcost, 2)}
                                </div>
                                <div className={`d-flex align-items-center justify-content-end ${style.totalFobExport} ${style.rowExport} ${style?.padx_2}`}>{NumberWithCommas(e?.TotalAmount, 2)}</div>
                            </div>
                        })}
                        {/* total */}
                        <div className={`d-flex border-start border-end border-bottom`}>
                            <div className={`border-end ${style.srNoExport} d-flex align-items-center justify-content-end ${style.rowExport}`}></div>
                            <div className={`border-end ${style.itemExport} d-flex align-items-center ${style.rowExport}`}></div>
                            <div className={`border-end ${style.ktColExport} d-flex align-items-center ${style.rowExport}`}></div>
                            <div className={`border-end ${style.qtyExport} d-flex align-items-center justify-content-end ${style.rowExport} fw-bold ${style?.padx_2}`}>{total?.counts}</div>
                            <div className={`border-end ${style.grossExport} d-flex align-items-center justify-content-end ${style.rowExport} fw-bold ${style?.padx_2}`}>{NumberWithCommas(total?.grossWt, 3)}</div>
                            <div className={`border-end ${style.netExport} d-flex align-items-center justify-content-end ${style.rowExport} fw-bold ${style?.padx_2}`}>{NumberWithCommas(total?.netWt, 3)}</div>
                            <div className={`border-end ${style.wastageExport} d-flex align-items-center justify-content-end ${style.rowExport} fw-bold`}></div>
                            <div className={`border-end ${style.totalGoldExport} d-flex align-items-center justify-content-end ${style.rowExport} fw-bold`}></div>
                            <div className={`border-end ${style.goldGmExport} d-flex align-items-center justify-content-end ${style.rowExport} fw-bold`}></div>
                            <div className={`border-end ${style.goldValueExport} d-flex align-items-center justify-content-end ${style.rowExport} fw-bold ${style?.padx_2}`}>{NumberWithCommas(total?.golSilValue, 2)}</div>
                            <div className={`d-flex  ${style?.diamondSec}`}>
                                <div className={`border-end ${style.diaShapeExport} d-flex align-items-center ${style.rowExport} fw-bold`}></div>
                                <div className={`border-end ${style.diamondColorExport} d-flex align-items-center ${style.rowExport} fw-bold`}></div>
                                <div className={`border-end ${style.diaPcsExport} d-flex align-items-center justify-content-end ${style.rowExport} fw-bold ${style?.padx_2}`}>{NumberWithCommas(total?.diaPcs, 0)}</div>
                                <div className={`border-end ${style.diaCtsExport} d-flex align-items-center justify-content-end ${style.rowExport} fw-bold ${style?.padx_2}`}>{NumberWithCommas(total?.diaCts, 3)}</div>
                                <div className={`border-end ${style.diaRateExport} d-flex align-items-center justify-content-end ${style.rowExport} fw-bold ${style?.padx_2}`}></div>
                                <div className={`border-end ${style.diaValueExport} d-flex align-items-center justify-content-end ${style.rowExport} fw-bold ${style?.padx_2}`}>{NumberWithCommas(total?.diaValue, 2)}</div>
                            </div>
                            <div className={`d-flex ${style?.c2CsSec}`}>
                                <div className={`d-flex align-items-center justify-content-end border-end ${style.c2csPcsExport} ${style.rowExport} fw-bold ${style?.padx_2}`}>{(NumberWithCommas(total?.czCsPcs, 0))}</div>
                                <div className={`d-flex align-items-center justify-content-end border-end ${style.c2csCtsExport} ${style.rowExport} fw-bold ${style?.padx_2}`}>{NumberWithCommas(total?.czCsCts, 3)}</div>
                                <div className={`d-flex align-items-center justify-content-end border-end ${style.c2csRateExport} ${style.rowExport} fw-bold`}></div>
                                <div className={`d-flex align-items-center justify-content-end border-end ${style.c2csValueExport} ${style.rowExport} fw-bold ${style?.padx_2}`}>{NumberWithCommas(total?.czCsValue, 2)}</div>
                            </div>
                            <div className={`d-flex align-items-center justify-content-end border-end ${style.totalCtsExport} ${style.rowExport} fw-bold ${style?.padx_2}`}>{NumberWithCommas(total?.totalCts, 3)}</div>
                            <div className={`d-flex align-items-center justify-content-end border-end ${style.totalValExport} ${style.rowExport} fw-bold ${style?.padx_2}`}>{NumberWithCommas(total?.totalVal, 2)}</div>
                            <div className={`d-flex align-items-center justify-content-end border-end ${style.enamelWtExport} ${style.rowExport} fw-bold`}></div>
                            <div className={`d-flex align-items-center justify-content-end border-end ${style.labourValueExport} ${style.rowExport} fw-bold ${style?.padx_2}`}>{NumberWithCommas(total?.labourVal, 2)}</div>
                            <div className={`d-flex align-items-center justify-content-end ${style.totalFobExport} ${style.rowExport} fw-bold ${style?.padx_2}`}>{NumberWithCommas(total?.fobValue, 2)}</div>
                        </div>
                    </div>
                </div>
            </div>
        </> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
    );
};

export default Export;
