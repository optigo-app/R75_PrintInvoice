import React, { useEffect, useState } from 'react';
import style from "../../assets/css/prints/invoicePrint6.module.css";
import {
    FooterComponent,
    HeaderComponent,
    apiCall,
    fixedValues,
    handleImageError,
    isObjectEmpty,
    numberToWord,
    NumberWithCommas,
    taxGenrator,
    handlePrint,
    checkMsg
} from "../../GlobalFunctions";
import Loader from "../../components/Loader";
import { ToWords } from "to-words";
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import style2 from "../../assets/css/headers/header1.module.css";
import { cloneDeep, split } from 'lodash';

const InvoicePrint6 = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [data, setData] = useState({});
    const [header, setHeader] = useState(null);
    const [headerData, setHeaderData] = useState({});
    const [address, setAddress] = useState([]);
    const [footer, setFooter] = useState(null);
    const [extra, setExtra] = useState({
        json1: [],
        json2: [],
    });
    const [mainData, setMainData] = useState({
        resultArr: [],
        findings: [],
        diamonds: [],
        colorStones: [],
        miscs: [],
        otherCharges: [],
        misc2: [],
        labour: {},
        diamondHandling: 0,
    });
    const [totalss, setTotalss] = useState({
        total: 0,
        discount: 0,
        totalPcs: 0,
    });
    const [isImageWorking, setIsImageWorking] = useState(true);
    const toWords = new ToWords();
    const handleImageErrors = () => {
        setIsImageWorking(false);
    };
    const compare = (a, b) => {
        if (a.Rate !== b.Rate) {
            return a.Rate - b.Rate;
        } else {
            if (a.designno < b.designno) {
                return -1;
            } else if (a.designno > b.designno) {
                return 1;
            } else {
                return 0;
            }
        }
    }

    const loadData = (data) => {
        let head = HeaderComponent("1", data?.BillPrint_Json[0]);
        setHeader(head);
        setHeaderData(data?.BillPrint_Json[0]);
        let adr = data?.BillPrint_Json[0]?.Printlable.split(`\r\n`);
        setAddress(adr);
        setFooter(FooterComponent("2", data?.BillPrint_Json[0]));
        let datas = OrganizeDataPrint(
            data?.BillPrint_Json[0],
            data?.BillPrint_Json1,
            data?.BillPrint_Json2
        );
        let resultArr = [];
        let findings = [];
        let diamonds = [];
        let colorStones = [];
        let misc2 = [];
        let labour = { label: "LABOUR", primaryWt: 0, makingAmount: 0, totalAmount: 0, rate: 0, amount: 0 };
        let miscs = [];
        let otherCharges = [];
        let total2 = { ...totalss };
        let diamondTotal = 0;
        let colorStone1Total1 = 0;
        let colorStone2Total2 = 0;
        let misc1Total1 = 0;
        let misc2Total2 = 0;
        let diamondHandling = 0;
        let totalPcss = [];
        let jobWiseLabourCalc = 0;
        let jobWiseMinusFindigWt = 0;
        let labourWt = 0;
        let labourAmt = 0;
        let labourRate = 0
        datas?.resultArray?.map((e, i) => {
            let obj = cloneDeep(e);
            let findingWt = 0;
            let findingsWt = 0;
            let findingsAmount = 0;
            let secondaryMetalAmount = 0;
            let labourFindWt = 0
            obj.primaryMetal = e?.metal?.find((ele, ind) => ele?.IsPrimaryMetal === 1);
            e?.finding?.forEach((ele, ind) => {
                if (ele?.ShapeName !== obj?.primaryMetal?.ShapeName && ele?.QualityName !== obj?.primaryMetal?.QualityName) {
                    let obb = cloneDeep(ele);
                    if (obj?.primaryMetal) {
                        obb.Rate = obj?.primaryMetal?.Rate;
                        obb.Amount = (ele?.Wt * obb?.Rate);
                        findingsAmount += (ele?.Wt * obb?.Rate);
                    }
                    findingsWt += ele?.Wt;
                    findings?.push(obb);
                    total2.total += (obb?.Amount);
                }
                if (ele?.Supplier?.toLowerCase() === "customer") {
                    findingWt += ele?.Wt
                    labourFindWt += ele?.Wt;
                }
            });
            labourWt += (e?.MetalDiaWt - labourFindWt);
            labourAmt += ((e?.MetalDiaWt - labourFindWt) * e?.MaKingCharge_Unit);

            let findPcss = totalPcss?.findIndex((ele, ind) => ele?.GroupJob === e?.GroupJob);
            if (findPcss === -1) {
                totalPcss?.push({ GroupJob: e?.GroupJob, value: e?.Quantity });
            } else {
                if (e?.GroupJob === "") {
                    let findQuantity = totalPcss?.findIndex((ele, ind) => ele?.GroupJob === '');
                    if (findQuantity === -1) {
                        totalPcss?.push({ GroupJob: e?.GroupJob, value: e?.Quantity });
                    } else {
                        totalPcss[findQuantity].value += e?.Quantity;
                    }
                }
            }

            let primaryWt = 0;
            let count = 0;

            let secondaryWt = 0;
            diamondHandling += e?.TotalDiamondHandling;
            e?.metal?.forEach((ele, ind) => {
                count += 1;
                if (ele?.IsPrimaryMetal === 1) {
                    primaryWt += ele?.Wt;
                } else {
                    secondaryMetalAmount += ele?.Amount;
                    secondaryWt += ele?.Wt;
                }
            });
            let netWtFinal = e?.NetWt + e?.LossWt - secondaryWt
            // labour.primaryWt += primaryWt;
            labour.makingAmount += e?.MakingAmount;
            labour.totalAmount += e?.MakingAmount + e?.TotalDiaSetcost + e?.TotalCsSetcost;
            total2.discount += e?.DiscountAmt;
            obj.primaryWt = primaryWt;
            obj.netWtFinal = netWtFinal;
            obj.metalAmountFinal = e?.MetalAmount
            if (count <= 1) {
                primaryWt = e?.NetWt + e?.LossWt;
            }
            if (obj?.primaryMetal) {
                total2.total += (obj?.metalAmountFinal / data?.BillPrint_Json[0]?.CurrencyExchRate);
                let findRecord = resultArr?.findIndex((ele, ind) => ele?.primaryMetal?.ShapeName === obj?.primaryMetal?.ShapeName && ele?.primaryMetal?.QualityName === obj?.primaryMetal?.QualityName && ele?.primaryMetal?.Rate === obj?.primaryMetal?.Rate);
                if (findRecord === -1) {
                    resultArr?.push(obj);
                } else {
                    resultArr[findRecord].grosswt += obj?.grosswt;
                    resultArr[findRecord].NetWt += obj?.NetWt;
                    resultArr[findRecord].LossWt += obj?.LossWt;
                    resultArr[findRecord].primaryWt += obj?.primaryWt;
                    resultArr[findRecord].primaryMetal.Pcs += obj?.primaryMetal.Pcs;
                    resultArr[findRecord].primaryMetal.Wt += obj?.primaryMetal.Wt;
                    resultArr[findRecord].primaryMetal.Amount += obj?.primaryMetal.Amount;
                    resultArr[findRecord].netWtFinal += obj?.netWtFinal;
                    resultArr[findRecord].metalAmountFinal += obj?.metalAmountFinal
                }
            }

            jobWiseLabourCalc += ((e?.MetalDiaWt - findingWt) * e?.MaKingCharge_Unit);
            jobWiseMinusFindigWt += (e?.MetalDiaWt - findingWt);

            e?.diamonds?.forEach((ele, ind) => {
                diamondTotal += (ele?.Amount);
                if (ele?.Rate === 0) {
                    let findDiamond = diamonds?.findIndex((elem, index) => elem?.Rate === 0);
                    if (findDiamond === -1) {
                        diamonds?.push(ele);
                    } else {
                        diamonds[findDiamond].Wt += ele?.Wt;
                        diamonds[findDiamond].Pcs += ele?.Pcs;
                        diamonds[findDiamond].Amount += ele?.Amount;
                        diamonds[findDiamond].RMwt += ele?.RMwt;
                    }
                } else {
                    // let findDiamond = diamonds?.findIndex((elem, index) => elem?.MaterialTypeName === ele?.MaterialTypeName && elem?.ShapeName === ele?.ShapeName &&
                    //   elem?.Colorname === ele?.Colorname && elem?.QualityName === ele?.QualityName && elem?.Rate === ele?.Rate);
                    let findDiamond = diamonds?.findIndex((elem, index) => elem?.MaterialTypeName === ele?.MaterialTypeName &&
                        // elem?.ShapeName === ele?.ShapeName && elem?.Colorname === ele?.Colorname && 
                        elem?.QualityName === ele?.QualityName && elem?.Rate === ele?.Rate);
                    if (findDiamond === -1) {
                        // let findDiamonds = diamonds?.findIndex((elem, index) => elem?.QualityName === ele?.QualityName && elem?.Rate === ele?.Rate && elem?.MaterialTypeName === ele?.MaterialTypeName);
                        // if (findDiamonds === -1) {
                        diamonds?.push(ele);
                        // } else {
                        //   diamonds[findDiamonds].Wt += ele?.Wt;
                        //   diamonds[findDiamonds].Pcs += ele?.Pcs;
                        //   diamonds[findDiamonds].Amount += ele?.Amount;
                        //   diamonds[findDiamonds].RMwt += ele?.RMwt;
                        // }
                    } else {
                        diamonds[findDiamond].Wt += ele?.Wt;
                        diamonds[findDiamond].Pcs += ele?.Pcs;
                        diamonds[findDiamond].Amount += ele?.Amount;
                        diamonds[findDiamond].RMwt += ele?.RMwt;
                    }
                }

            });

            e?.colorstone?.forEach((ele, ind) => {
                // total2.total += (ele?.Amount );
                // let findColorStones = colorStones?.findIndex((elem, index) => elem?.isRateOnPcs === ele?.isRateOnPcs && elem?.MaterialTypeName === ele?.MaterialTypeName && elem?.ShapeName === ele?.ShapeName &&
                //   elem?.Colorname === ele?.Colorname && elem?.QualityName === ele?.QualityName);
                let findColorStones = colorStones?.findIndex((elem, index) => elem?.MaterialTypeName === ele?.MaterialTypeName && elem?.Rate === ele?.Rate);
                if (findColorStones === -1) {
                    colorStones?.push(ele);
                } else {
                    colorStones[findColorStones].Wt += ele?.Wt;
                    colorStones[findColorStones].Pcs += ele?.Pcs;
                    colorStones[findColorStones].Amount += (ele?.Amount);
                }
                if (ele?.isRateOnPcs === 0) {
                    colorStone1Total1 += ele?.Amount
                } else {
                    colorStone2Total2 += ele?.Amount
                }
            });

            e?.misc?.forEach((ele, ind) => {
                if (ele?.isRateOnPcs === 0) {
                    misc1Total1 += ele?.Amount;
                } else {
                    misc2Total2 += ele?.Amount;
                }
                if (ele?.IsHSCOE !== 0) {
                    let findMisc = miscs?.findIndex((elem, index) => elem?.ShapeName === ele?.ShapeName);
                    if (findMisc === -1) {
                        miscs?.push(ele);
                    } else {
                        miscs[findMisc].Wt += ele?.Wt
                        miscs[findMisc].Pcs += ele?.Pcs
                        miscs[findMisc].Amount += (ele?.Amount)
                    }
                    // total2.total += (ele?.Amount);
                }
                else if (ele?.IsHSCOE === 0) {
                    // total2.total += ele?.Amount;
                    let findMisc = misc2?.findIndex((elem, index) => elem?.isRateOnPcs === ele?.isRateOnPcs);
                    if (findMisc === -1) {
                        misc2?.push(ele);
                    } else {
                        misc2[findMisc].Wt += ele?.Wt;
                        misc2[findMisc].Pcs += ele?.Pcs;
                        misc2[findMisc].Amount += (ele?.Amount);
                    }
                }
            });

            e?.other_details?.forEach((ele, ind) => {
                let findOther = otherCharges?.findIndex((elem, index) => elem?.label === ele?.label);
                total2.total += (+ele?.value);
                if (findOther === -1) {
                    otherCharges?.push(ele);
                } else {
                    otherCharges[findOther].value = +otherCharges[findOther]?.value + +ele?.value;
                }
            });

        });
        if (labourWt !== 0) {
            labourRate = Math?.round(labourAmt / labourWt);
        }
        labour.rate = labourRate;
        labour.amount = labourAmt;
        let totalPcs = totalPcss?.reduce((acc, cObj) => acc + cObj?.value, 0);
        // total2.total += labour?.totalAmount
        total2.total += (diamondTotal / data?.BillPrint_Json[0]?.CurrencyExchRate) + (colorStone1Total1 / data?.BillPrint_Json[0]?.CurrencyExchRate) +
            (colorStone2Total2 / data?.BillPrint_Json[0]?.CurrencyExchRate) + (misc1Total1 / data?.BillPrint_Json[0]?.CurrencyExchRate) +
            (misc2Total2 / data?.BillPrint_Json[0]?.CurrencyExchRate) + (labour?.totalAmount / data?.BillPrint_Json[0]?.CurrencyExchRate) + (diamondHandling / data?.BillPrint_Json[0]?.CurrencyExchRate);

        labour.primaryWt = jobWiseMinusFindigWt;
        resultArr.sort((a, b) => {
            const labelA = a.MetalTypePurity.toLowerCase();
            const labelB = b.MetalTypePurity.toLowerCase();

            // Check if labels contain numbers
            const hasNumberA = /\d/.test(labelA);
            const hasNumberB = /\d/.test(labelB);

            if (hasNumberA && !hasNumberB) {
                return -1; // Label with number comes before label without number
            } else if (!hasNumberA && hasNumberB) {
                return 1;
            } else {
                return labelA.localeCompare(labelB);
            }
        });

        diamonds.sort(compare);
        colorStones.sort(compare);
        miscs?.forEach((e, i) => {
            e.label = e?.ShapeName;
            e.value = e?.Amount
        });
        otherCharges = [...otherCharges, ...miscs]?.flat();
        otherCharges?.sort((a, b) => {
            var labelA = a.label.toUpperCase();
            var labelB = b.label.toUpperCase();
            if (labelA < labelB) {
                return -1;
            } else if (labelA > labelB) {
                return 1;
            } else {
                return 0
            }
        });

        setTotalss({ ...totalss, total: total2?.total, discount: total2?.discount, totalPcs: totalPcs, });

        resultArr?.sort((a, b) => {
            var regex = /(\d+)|(\D+)/g;
            var partsA = a.MetalTypePurity.match(regex);
            var partsB = b.MetalTypePurity.match(regex);

            for (var i = 0; i < Math.min(partsA.length, partsB.length); i++) {
                var partA = partsA[i];
                var partB = partsB[i];

                if (!isNaN(partA) && !isNaN(partB)) {
                    var numA = parseInt(partA);
                    var numB = parseInt(partB);
                    if (numA !== numB) {
                        return numA - numB;
                    }
                } else {
                    if (partA !== partB) {
                        return partA.localeCompare(partB);
                    }
                }
            }

            return a.MetalTypePurity.length - b.MetalTypePurity.length;

        })
        setMainData({
            ...mainData, resultArr: resultArr, findings: findings, diamonds: diamonds, colorStones: colorStones,
            miscs: miscs, otherCharges: otherCharges, misc2: misc2, labour: labour, diamondHandling: diamondHandling
        });
        setData(datas);
    };

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return loader ? (
        <Loader />
    ) : msg === "" ? (
        <div className={`container container-fluid max_width_container mt-1 ${style?.invoicePrint6} pad_60_allPrint`} >
            {/* buttons */}
            <div className={`d-flex justify-content-end align-items-center ${style?.print_sec_sum4} mb-4`} >
                <div className="form-check ps-3">
                    <input type="button" className="btn_white blue py-1 mt-2" value="Print" onClick={(e) => handlePrint(e)} style={{ fontSize: "15px" }} />
                </div>
            </div>
            {/* header */}
            <div className={`${style2.headline} headerTitle`}>{headerData?.PrintHeadLabel}</div>
            <div className={`d-flex justify-content-between align-items-center border-bottom mb-2 py-3`}>
                <div className={`${style2.companyhead} p-2`} style={{}}>
                    <div className={style2.lines} style={{ fontWeight: "bold", fontSize: "16px" }}>
                        {headerData?.CompanyFullName}
                    </div>
                    <div className={style2.lines} style={{ fontSize: "12px" }}>{headerData?.CompanyAddress}</div>
                    <div className={style2.lines} style={{ fontSize: "12px" }}>{headerData?.CompanyCity}-{headerData?.CompanyPinCode},{headerData?.CompanyState}({headerData?.CompanyCountry})</div>
                    <div className={style2.lines} style={{ fontSize: "12px" }}>T  {headerData?.CompanyTellNo} | TOLL FREE {headerData?.CompanyTollFreeNo}</div>
                    <div className={style2.lines} style={{ fontSize: "12px" }}>
                        {headerData?.CompanyEmail} | {headerData?.CompanyWebsite}
                    </div>
                </div>
                <div style={{ width: "30%" }} className="d-flex justify-content-end align-item-center h-100">
                    {isImageWorking && (headerData?.PrintLogo !== "" &&
                        <img src={headerData?.PrintLogo} alt=""
                            className='w-100 h-auto ms-auto d-block object-fit-contain'
                            onError={handleImageErrors} height={120} width={150} style={{ maxWidth: "138px" }} />)}
                    {/* <img src={headerData?.PrintLogo} alt="" className={style2.headerImg} /> */}
                </div>
            </div>
            {/* bill no */}
            <div className="d-flex justify-content-end py-1">
                <div className="col-3  border-black border-2">
                    <p style={{ fontSize: "12px", display: "flex" }}>
                        <p className="fw-semibold px-2" style={{ minWidth: "60px" }}>BILL NO </p>{" "}
                        <p>{headerData?.InvoiceNo}</p>
                    </p>
                    <p style={{ fontSize: "12px", display: "flex" }}>
                        <p className="fw-semibold px-2" style={{ minWidth: "60px" }}>DATE </p>{" "}
                        <p>{headerData?.EntryDate}</p>
                    </p>
                    <p style={{ fontSize: "12px", display: "flex" }}>
                        <p className="fw-semibold px-2" style={{ minWidth: "60px" }}>HSN </p>
                        <p>{headerData?.HSN_No}</p>
                    </p>
                </div>
            </div>
            {/* sub header */}
            <div className="d-flex  border-black mb-1 align-items-center border-2">
                <div className="col-8 p-2">
                    <p className="fw-semibold" style={{ fontSize: "16px" }}>To, {headerData?.customerfirmname}</p>
                    <p className='fw-light ps-3' style={{ fontSize: "12px", lineHeight: "140% ", }}>{headerData?.customerstreet}</p>
                    <p className='fw-light ps-3' style={{ fontSize: "12px", lineHeight: "140% ", }}>{headerData?.customerregion}</p>
                    <p className='fw-light ps-3' style={{ fontSize: "12px", lineHeight: "140% ", }}>
                        {headerData?.customercity}
                        {headerData?.customerpincode}
                    </p>
                    <p className='fw-light  ps-3' style={{ fontSize: "12px", lineHeight: "140% ", }}>STATE NAME : {headerData?.customerstate}</p>
                    {/* <p className='fw-light lh-1 ps-3' style={{ fontSize: "12px", lineHeight: "140% ", }}>{headerData?.vat_cst_pan}</p> */}
                </div>
                <div className="col-4 p-2">
                    {headerData?.CustGstNo !== "" && <> <p style={{ fontSize: "12px", display: "flex", }}>
                        <span className="fw-semibold pe-2" style={{ minWidth: "80px" }}>GSTIN : </span>{" "}
                        <span style={{ minWidth: "80px" }}>{headerData?.CustGstNo}</span>
                    </p>
                        <p style={{ fontSize: "12px", display: "flex", }}>
                            <span className="fw-semibold pe-2" style={{ minWidth: "80px" }}>STATE CODE : </span>{" "}
                            <span style={{ minWidth: "80px" }}>{headerData?.Cust_CST_STATE_No}</span>
                        </p></>}
                    <p style={{ fontSize: "12px", display: "flex", }}>
                        <span className="fw-semibold pe-2" style={{ minWidth: "80px" }}>PAN NO : </span>{" "}
                        <span style={{ minWidth: "80px" }}>{headerData?.CustPanno}</span>
                    </p>
                </div>
            </div>
            {/* table header */}
            <div className="d-flex border border-black border-2">
                <div className="col-3 border-end border-black border-2">
                    <p className="fw-bold text-center">DESCRIPTION</p>
                </div>
                <div className="col-9 d-flex">
                    <div className="col-4">
                        <p className="fw-bold pe-1 ps-2">DETAIL</p>
                    </div>
                    <div className="col-8 d-flex">
                        <div className="col-4"><p className="fw-bold text-end px-1">WEIGHT</p></div>
                        <div className="col-4"><p className="fw-bold text-end px-1">RATE</p></div>
                        <div className="col-4"><p className="fw-bold text-end ps-1 pe-2">AMOUNT</p></div>
                    </div>
                </div>
            </div>
            {/* table data */}
            <div className=" d-flex border-start border-end border-bottom border-black border-2">
                <div className="col-3 border-end d-flex justify-content-center  pb-4 border-black border-2 pt-5">
                    <p className="text-center">GOLD BAR</p>
                </div>
                <div className="col-9 pb-1 px-1">
                    <div className="col-4">
                        {/* {
                            data?.resultArray.map((e, i) => {
                                return <p className="px-1" key={i}>{e?.MetalTypePurity}</p>
                            })
                        }
                        <p className={`px-1 ${style?.min_height_24}`} >LABOUR</p>
                        {
                            extra?.json1?.map((e, i) => {
                                return <p className={`px-1 ${style?.min_height_24}`} key={i}>{e?.label}</p>
                            })
                        }
                        {
                            extra?.json2?.map((e, i) => {
                                return <p className={`px-1 ${style?.min_height_24}`} key={i}>{e?.ShapeName}</p>
                            })
                        } */}


                    </div>
                    <div className="col-8 d-flex">
                        <div className="col-4">
                            {/* {
                                data?.resultArray.map((e, i) => {
                                    return <p className="text-end px-1" key={i}>{NumberWithCommas(e?.MetalDiaWt, 3)}</p>
                                })
                            } */}
                        </div>
                        <div className="col-4">
                            {/* {
                                data?.resultArray.map((e, i) => {
                                    return <p className="text-end px-1" key={i}>{NumberWithCommas(e?.metalrate, 2)}</p>
                                })
                            }
                             <p className={`text-end px-1 ${style?.min_height_24}`} >{NumberWithCommas(data?.mainTotal?.total_labour?.labour_rate/data?.mainTotal?.netwt, 2)}</p> */}
                        </div>
                        <div className="col-4">
                            {/* {
                                data?.resultArray.map((e, i) => {
                                    return <p className="text-end px-1" key={i}>{NumberWithCommas(e?.MetalAmount, 2)}</p>
                                })
                            }
                            <p className={`text-end px-1 ${style?.min_height_24}`} >{NumberWithCommas(data?.mainTotal?.total_labour?.labour_amount, 2)}</p>

                            {
                                extra?.json1?.map((e, i) => {
                                    return <p className={`text-end px-1 ${style?.min_height_24}`} key={i}>{NumberWithCommas(+e?.value, 2)}</p>
                                })
                            }
                            {
                                extra?.json2?.map((e, i) => {
                                    return <p className={`text-end px-1 ${style?.min_height_24}`} key={i}>{e?.Amount !== 0 && NumberWithCommas(e?.Amount, 2)}</p>
                                })
                            } */}
                        </div>
                    </div>
                    {
                        mainData?.resultArr?.map((e, i) => {
                            return <div className='d-flex no_break' key={i}>
                                <div className="col-4 px-1">{e?.primaryMetal?.ShapeName} {e?.primaryMetal?.QualityName}</div>
                                <div className="col-8 d-flex">
                                    <div className="col-4 px-1 text-end">{NumberWithCommas(e?.netWtFinal, 3)}</div>
                                    <div className="col-4 px-1 text-end">{e?.netWtFinal !== 0 && NumberWithCommas((e?.metalAmountFinal / headerData?.CurrencyExchRate) / e?.netWtFinal, 2)}</div>
                                    <div className="col-4 px-1 text-end">{NumberWithCommas(e?.metalAmountFinal / headerData?.CurrencyExchRate, 2)}</div>
                                </div>
                            </div>
                        })
                    }
                    <div className='d-flex no_break'>
                        <div className="col-4 px-1"> {mainData?.labour?.label}</div>
                        <div className="col-8 d-flex">
                            <div className="col-4 px-1 text-end"></div>
                            <div className="col-4 px-1 text-end">  {mainData?.labour?.primaryWt !== 0 && NumberWithCommas((mainData?.labour?.rate), 0)}</div>
                            <div className="col-4 px-1 text-end">  {NumberWithCommas(data?.mainTotal?.total_Making_Amount + data?.mainTotal?.diamonds?.SettingAmount +
                                data?.mainTotal?.colorstone?.SettingAmount + data?.mainTotal?.misc?.Amount + data?.mainTotal?.total_diamondHandling, 2)}</div>
                        </div>
                    </div>

                    {mainData?.otherCharges?.map((e, i) => {
                        return <div className="d-flex no_break" key={i}>
                            <div className="col-4 px-1 text-uppercase">{e?.label} </div>
                            <div className="col-8 d-flex">
                                <div className="col-4 px-1 text-end"></div>
                                <div className="col-4 px-1 text-end">  </div>
                                <div className="col-4 px-1 text-end">{+e?.value !== 0 && NumberWithCommas(+e?.value, 2)} </div>
                            </div>
                        </div>
                    })}

                </div>
            </div>
            {/* table total */}
            <div className="no_break d-flex border-start border-end border-bottom mb-1 border-black border-2">
                <div className="col-3 border-end d-flex justify-content-center align-items-center pb-4 border-black border-2">
                    <p className="text-center"></p>
                </div>
                <div className="col-9 d-flex justify-content-between px-1 align-items-center">
                    <p className="px-1 fw-bold">Total</p>
                    <p className="text-end px-1 fw-bold">{NumberWithCommas(data?.mainTotal?.total_unitcost, 2)}</p>
                </div>
            </div>
            {/* taxes */}
            <div className="no_break d-flex my-2 justify-content-end">
                <div className="col-4">
                    <p><span className="fw-bold"> Note:</span> <span dangerouslySetInnerHTML={{ __html: headerData?.PrintRemark }}></span></p>
                </div>
                <div className="col-5 border border-black border-2">
                    <div style={{ minHeight: "126px" }}>
                        {data?.mainTotal?.total_discount_amount !== 0 && <div className="d-flex justify-content-between px-1 pt-1">
                            <p className='ps-1'>Discount	</p>
                            <p className='pe-1'>{NumberWithCommas(data?.mainTotal?.total_discount_amount, 2)}</p>
                        </div>}
                        <div className="d-flex justify-content-between px-1">
                            <p className='fw-bold ps-1'>Total Amount	</p>
                            <p className='fw-bold pe-1'>{NumberWithCommas(data?.mainTotal?.total_amount, 2)}</p>
                        </div>
                        {
                            data?.allTaxes.map((e, i) => {
                                return <div className="d-flex justify-content-between px-1" key={i}>
                                    <p className='ps-1'>{e?.name} @ {e?.per}	</p>
                                    <p className='pe-1'>{NumberWithCommas(+e?.amount * headerData?.CurrencyExchRate, 2)}</p>
                                </div>
                            })
                        }
                        {headerData?.AddLess !== 0 && <div className="d-flex justify-content-between px-1">
                            <p className='ps-1'>{headerData?.AddLess > 0 ? "Add" : "Less"}</p>
                            <p className='pe-1'>{NumberWithCommas(headerData?.AddLess, 2)}</p>
                        </div>}
                    </div>
                    <div className="d-flex justify-content-between px-1 border-top border-black border-2">
                        <p className='fw-bold ps-1'>Grand Total</p>
                        <p className='fw-bold pe-1'>{NumberWithCommas(data?.mainTotal?.total_amount + data?.allTaxes?.reduce((acc, cObj) => acc + +cObj?.amount * headerData?.CurrencyExchRate, 0) + headerData?.AddLess, 2)}</p>
                    </div>
                </div>
            </div>
            {/* in words */}
            <div className="no_break my-2 border p-1 border-black border-2">
                <p className="fw-bold">Rs.{toWords.convert(+fixedValues(data?.mainTotal?.total_amount + data?.allTaxes?.reduce((acc, cObj) => acc + +cObj?.amount * headerData?.CurrencyExchRate, 0) + headerData?.AddLess, 2))} Only.</p>
            </div>
            {/* note */}
            <div className="no_break my-2 border p-1 border-black border-2">
                <p className="fw-bold">NOTE : </p>
                <div dangerouslySetInnerHTML={{ __html: headerData?.Declaration }}></div>
            </div>
            {/* company details */}
            <div className="no_break my-2 border p-1 border-black border-2">
                <p className="fw-bold">COMPANY DETAILS :</p>
                <p>GSTIN. : {headerData?.Company_VAT_GST_No.split("GSTIN-")[1]}</p>
                <p>STATE CODE. : {headerData?.Company_CST_STATE_No}</p>
                <p>PAN NO. : {headerData?.Pannumber}</p>
                <p>Kindly make your payment by the name of "<span className='fw-bold'>{headerData?.accountname}</span>"</p>
                <p>Payable at {headerData?.customercity} ({headerData?.CompanyState}) by cheque or DD</p>
                <p>Bank Detail : Bank Account No <span className='fw-bold'>{headerData?.accountnumber}</span></p>
                <p>Bank Name : {headerData?.bankname}, {headerData?.bankaddress}</p>
                <p>RTGS/NEFT IFSC : {headerData?.rtgs_neft_ifsc}</p>
            </div>
            {/* signs */}
            <div className="no_break my-2 d-flex">
                <div className={`col-6 pe-1`}>
                    <div className={` border border-black border-2 ${style?.min_height_130} p-1 text-center border-end border-black`}><p className='fw-bold'>AUTHORISED, {headerData?.customerfirmname}</p></div>
                </div>
                <div className={`col-6 ps-1`}>
                    <div className={` border border-black border-2 ${style?.min_height_130} p-1 text-center border-end border-black`}><p className='fw-bold'>AUTHORISED, {headerData?.CompanyFullName}</p></div>
                </div>
                {/* <div className={`col-6 border border-black border-2 ${style?.min_height_100} p-1 text-center`}><p className='fw-bold'>AUTHORISED, {headerData?.CompanyFullName}</p></div> */}
            </div>
            {/* footer */}
            {/* <div className="d-flex border mt-1 border-black">
                <div className="col-4 border-end p-2 border-black">
                    <p className="fw-bold">Bank Detail</p>
                    <p>Bank Name: {headerData?.bankname}</p>
                    <p>Branch: {headerData?.bankaddress}</p>
                    <p>Account Name: {headerData?.accountname}</p>
                    <p>Account No. : {headerData?.accountnumber}</p>
                    <p>RTGS/NEFT IFSC: {headerData?.rtgs_neft_ifsc}</p>
                </div>
                <div className="col-4 border-end p-2 d-flex flex-column justify-content-between border-black">
                    <p className="fw-bold">Signature</p>
                    <p>
                        <span className="fw-bold">{headerData?.CustName}</span>
                        <span className={`${style?.sup}`}></span> (With Stamp)
                    </p>
                </div>
                <div className="col-4 p-2 d-flex flex-column justify-content-between">
                    <p className="fw-bold">Signature</p>
                    <p className="fw-bold">{headerData?.CompanyFullName}</p>
                </div>
            </div> */}
        </div>
    ) : (
        <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
            {msg}
        </p>
    );
}

export default InvoicePrint6;

