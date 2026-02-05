import React, { useEffect, useState } from 'react';
import "../../assets/css/prints/miscPrint1.css";
import { apiCall, checkMsg, fixedValues, handlePrint, isObjectEmpty, NumberWithCommas } from '../../GlobalFunctions';
import Loader from '../../components/Loader';
import { usePDF } from 'react-to-pdf';
const MiscPrint1 = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
    const { toPDF, targetRef } = usePDF({ filename: 'page.pdf' });
    const [primary, setPrimary] = useState({});
    const [jsonData, setJsonData] = useState([]);
    const [total, setTotal] = useState({});
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [materialNames, setMaterialNames] = useState([]);
    const [totalItems, setTotalItems] = useState([]);
    const [isImageWorking, setIsImageWorking] = useState(true);
  const handleImageErrors = () => {
    setIsImageWorking(false);
  };
    const loadData = (datas) => {
        setPrimary(datas?.BillPrint_Json[0]);
        let resultData = [];
        let total = {
            grsWt: 0,
            netWt: 0,
            Kund: {
                weight: 2.1,
                pcs: 5,
                Rate: 0
            },
            Moti: {
                weight: 0,
                pcs: 0,
                Rate: 0,
            },
            Bmoti: {
                weight: 0,
                pcs: 0,
                Rate: 0,
            },
            MOPs: {
                weight: 0,
                pcs: 0,
                Rate: 0,
            },
            Stone: {
                weight: 0,
                pcs: 0,
                Rate: 0,
            },
            Mina: {
                weight: 0,
                pcs: 0,
                Rate: 0,
            },
            Bandai: {
                weight: 0,
                pcs: 0,
                Rate: 0,
            },
            fineWeight: 0,
            amount: 0,
            MetalPriceRatio: 0,
            Wastage: 0,
            lessWeight: 0,
        }
        let materialName = [];
        datas?.BillPrint_Json1.forEach((e, i) => {
            let fineWeight = 0;
            let lessWeight = 0;
            let amount = 0;
            let netWtWithLossWt = e?.LossWt + e?.NetWt;
            total.grsWt += e?.grosswt;
            total.netWt += e?.NetWt + e?.LossWt;
            total.MetalPriceRatio += e?.MetalPriceRatio;
            total.Wastage += e?.Wastage;
            total.amount += e?.TotalAmount;
            let materialMiscs = [];
            datas?.BillPrint_Json2.forEach((ele, ind) => {
                if (e.SrJobno === ele.StockBarcode) {
                    if (ele?.MasterManagement_DiamondStoneTypeid === 3) {
                        let findIndex = materialMiscs.findIndex((elem => elem.ShapeName === ele.ShapeName));
                        if (findIndex === -1) {
                            materialMiscs.push(ele);
                        } else {
                            materialMiscs[findIndex].Wt += ele?.Wt;
                            materialMiscs[findIndex].Pcs += ele?.Pcs;
                            materialMiscs[findIndex].Rate += ele?.Rate;
                        }
                        if (materialName.length === 0) {
                            materialName.push({ name: ele?.ShapeName });
                        } else {
                            if (materialName.length < 8) {
                                let findName = materialName.findIndex((el => el.name === ele?.ShapeName));
                                if (findName === -1) {
                                    materialName.push({ name: ele?.ShapeName });
                                }
                            }
                        }
                        amount += ele?.Amount;
                        lessWeight += +((ele?.Wt).toFixed(3));
                        total.lessWeight += +((ele?.Wt).toFixed(3));
                    }
                }
            });
            fineWeight += e?.PureNetWt;
            total.fineWeight += e?.PureNetWt;
            let obj = { ...e };
            obj.fineWeight = fineWeight;
            obj.amount = amount;
            obj.lessWeight = lessWeight;
            obj.materialMiscs = materialMiscs;
            obj.netWtWithLossWt = netWtWithLossWt;
            resultData.push(obj);
        });
        let totals = [];
        materialName.forEach((e, i) => {
            totals.push({ name: e?.name, Wt: 0, Pcs: 0, Rate: 0 });
        });
        materialName.forEach((e, i) => {
            resultData.forEach((ele, ind) => {
                ele?.materialMiscs.forEach((elem, index) => {
                    if (e?.name === elem?.ShapeName) {
                        let findIndex = totals.findIndex(elle => elle.name === elem?.ShapeName);
                        totals[findIndex].Wt += elem.Wt;
                        totals[findIndex].Pcs += elem.Pcs;
                        totals[findIndex].Rate += elem.Rate;
                    }
                });
            });
        });
        setTotalItems(totals);
        setMaterialNames(materialName);
        setJsonData(resultData);
        total.lessWeight = (total?.lessWeight).toFixed(3);
        setTotal(total);
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
        <>
            {loader ? <Loader /> : msg === "" ? <>
                <div className="container max_width_container container_Misc_1 pad_60_allPrint">
                    <div className="printBtn_sec text-end pt-4 ">
                        {/* <input type="button" className="btn_white blue me-2" value="Pdf" onClick={() => toPDF()} /> */}
                        <input type="button" className="btn_white blue" value="Print" onClick={(e) => handlePrint(e)} />
                    </div>
                    <div ref={targetRef} className=" pt-4">
                        <div className="header_misc_1 mt-4 border d-flex justify-content-between">
                            <div className='p-2'>
                                Customer Name: <span className='fw-bold'> {primary?.CustName}</span>
                            </div>
                            <div className="p-2 text-end ">
                                <p className=' fw-bold'><span className='fw-normal'>Invoice:</span> {primary?.InvoiceNo}</p>
                                <p className=' fw-bold'><span className='fw-normal'>Date:</span> {primary?.EntryDate}</p>
                            </div>
                        </div>
                        <div className="d-flex border-bottom border-start border-end">
                            <div className="regNoMiscPrint1 border-end p-1 fw-bold d-flex align-items-center justify-content-center">Reg. No.</div>
                            <div className="discriptionMisc1 border-end  fw-bold d-flex align-items-center justify-content-center text-center">Description</div>
                            <div className="grsWtMisc1 border-end p-1 text-end d-flex align-items-center justify-content-center flex-column">
                                <p className='fw-bold'>Grs Wt</p>
                                <p className='fw-bold'>Net Wt</p>
                            </div>
                            <div className="miscDetailsMicsPrint1">
                                <div className="stoneDetailsMisc1 border-bottom p-1 text-center  fw-bold border-end">Stone Details</div>
                                <div className="d-flex height53Misc1">
                                    {materialNames.length > 0 && materialNames.map((e, i) => {
                                        return <div className={`text-end kundMisc1 border-end fw-bold d-flex align-items-center justify-content-center `} key={i}>{e?.name}</div>
                                    })}
                                    {materialNames.length < 8 && Array.from({ length: 8 - materialNames.length }, (_, index) => {
                                        return <div className={`text-end kundMisc1 border-end p-1 fw-bold`} key={index}></div>
                                    })}
                                </div>
                            </div>
                            <div className="lessWtMisc1 border-end p-1 fw-bold text-end d-flex align-items-center justify-content-center">Less Wt.</div>
                            <div className="mperMisc1 border-end p-1 text-center d-flex align-items-center justify-content-center flex-column">
                                <p className='fw-bold text-end'>M%</p>
                                <p className='fw-bold text-end'>w%</p>
                            </div>
                            <div className="fineMisc1 border-end p-1  d-flex align-items-center justify-content-center"><p className='fw-bold'>Fine Wt</p></div>
                            <div className="AmountMiscPrint1 p-1 fw-bold  d-flex align-items-center justify-content-center">Amount</div>
                        </div>
                        {jsonData.length > 0 && jsonData.map((e, i) => {
                            return <div className="d-flex border-bottom border-start border-end" key={i}>
                                <div className="regNoMiscPrint1 p-1 border-end text-end">{e?.SrJobno}</div>
                                <div className="discriptionMisc1 border-end p-1 height53Misc1"><p className=''>{e?.SubCategoryname}</p></div>
                                <div className="grsWtMisc1 border-end p-1 text-end height53Misc1">
                                    <p className=''>{fixedValues(e?.grosswt, 3)}</p>
                                    <p className=''>{fixedValues(e?.netWtWithLossWt, 3)}</p>
                                </div>
                                <div className='miscDetailsMicsPrint1'>
                                    <div className="d-flex height53Misc1">
                                        {materialNames.length > 0 && materialNames.map((ele, i) => {
                                            const findMaterial = e?.materialMiscs.find(elem => ele?.name === elem?.ShapeName);
                                            return findMaterial ? <div className="w-100 text-end kundMisc1 border-end p-1" key={i}>
                                                <p className='lh-1 '>{fixedValues(findMaterial?.Wt, 2)}</p>
                                                <p className='lh-1 '>{NumberWithCommas(findMaterial?.Pcs, 0)}</p>
                                                <p className='lh-1 '>{findMaterial?.Rate !== 0 && NumberWithCommas(findMaterial?.Rate, 2)}</p>
                                            </div> : <div className="w-100 text-end kundMisc1 border-end p-1" key={i}>
                                                <p className='lh-1 '></p>
                                                <p className='lh-1 '></p>
                                                <p className='lh-1 '></p>
                                            </div>
                                        })}
                                        {materialNames.length < 8 && Array.from({ length: 8 - materialNames.length }, (_, index) => {
                                            return <div className="w-100 text-end kundMisc1 border-end p-1" key={index}>
                                                <p className='lh-1 '></p>
                                                <p className='lh-1 '></p>
                                                <p className='lh-1 '></p>
                                            </div>
                                        })}
                                    </div>
                                </div>
                                <div className="lessWtMisc1 border-end p-1 height53Misc1 text-end">{fixedValues(e?.lessWeight, 2)}</div>
                                <div className="mperMisc1 border-end p-1 text-center height53Misc1">
                                    <p className='text-end'>{NumberWithCommas(e?.MetalPriceRatio, 2)}</p>
                                    <p className='text-end'>{NumberWithCommas(e?.Wastage, 2)}</p>
                                </div>
                                <div className="fineMisc1 border-end p-1 text-end height53Misc1 text-end">{fixedValues(e?.fineWeight, 2)}</div>
                                <div className="AmountMiscPrint1 p-1 text-end height53Misc1 text-end">{Math.round(e?.TotalAmount)}</div>
                            </div>
                        })}
                        <div className="d-flex border-bottom border-start border-end">
                            <div className="regNoMiscPrint1 p-1 border-end text-end">{NumberWithCommas(jsonData?.length, 0)}</div>
                            <div className="discriptionMisc1 border-end p-1 fw-bold height53Misc1">TOTAL</div>
                            <div className="grsWtMisc1 border-end p-1 text-end height53Misc1">
                                <p className='fw-bold '>{fixedValues(total?.grsWt, 3)}</p>
                                <p className='fw-bold '>{fixedValues(total?.netWt, 3)}</p>
                            </div>
                            <div className='miscDetailsMicsPrint1'>
                                <div className="d-flex height53Misc1">
                                    {materialNames.length > 0 && materialNames.map((ele, i) => {
                                        const findMaterial = totalItems.find(elem => ele?.name === elem?.name);
                                        return findMaterial ? <div className="w-100 text-end kundMisc1 border-end p-1" key={i}>
                                            <p className='lh-1 '>{fixedValues(findMaterial?.Wt, 2)}</p>
                                            <p className='lh-1 '>{NumberWithCommas(findMaterial?.Pcs, 0)}</p>
                                        </div> : <div className="w-100 text-end kundMisc1 border-end p-1" key={i}>
                                            <p className='lh-1 '></p>
                                            <p className='lh-1 '></p>
                                        </div>
                                    })}
                                    {materialNames.length < 8 && Array.from({ length: 8 - materialNames.length }, (_, index) => {
                                        return <div className="w-100 text-end kundMisc1 border-end p-1" key={index}>
                                            <p className='lh-1 '></p>
                                            <p className='lh-1 '></p>
                                        </div>
                                    })}
                                </div>
                            </div>
                            <div className="lessWtMisc1 border-end p-1 fw-bold height53Misc1 text-end">{fixedValues(total?.lessWeight, 2)}</div>
                            <div className="mperMisc1 border-end p-1 text-center height53Misc1">
                                {/* <p className='fw-bold text-end'>{total?.MetalPriceRatio}</p>
                        <p className='fw-bold text-end'>{total?.Wastage}</p> */}
                                <p className='fw-bold text-end'></p>
                                <p className='fw-bold text-end'></p>
                            </div>
                            <div className="fineMisc1 border-end p-1 text-end height53Misc1"><p className='fw-bold text-end'>{fixedValues(total?.fineWeight, 2)}</p></div>
                            <div className="AmountMiscPrint1 p-1 text-end fw-bold height53Misc1 text-end">{Math.round(total?.amount)}</div>
                        </div>
                    </div>
                </div>
            </> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>}
        </>
    )
}

export default MiscPrint1