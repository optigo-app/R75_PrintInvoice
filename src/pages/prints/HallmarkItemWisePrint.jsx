import React, { useState, useEffect } from "react";
import "../../assets/css/prints/itemwiseprint.css";
import "../../assets/css/prints/hallmarkItemWisePrint.css"
import { apiCall, handlePrint, taxGenrator, isObjectEmpty, handleImageError, NumberWithCommas, fixedValues, numberToWord, checkMsg } from "../../GlobalFunctions";
import { usePDF } from "react-to-pdf";
import Loader from "../../components/Loader";
import style from "../../assets/css/prints/hallmarkItemwisePrint1.module.css"

const HallmarkItemWisePrint = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {

    const [styles, setStyles] = useState({
        metaltype: "",
        category: "",
        pkg: "",
        count: "",
        dpcs: "",
        gwt: "",
        amount: "",
    });
    const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });
    const [loader, setLoader] = useState(true);
    const [evtName, setEvtName] = useState(atob(evn).toLowerCase());
    const [json0Data, setjson0Data] = useState({});
    const [msg, setMsg] = useState("");
    const [data, setData] = useState([]);
    const [total, setTotal] = useState({
        count: 0,
        gwt: 0,
        nwt: 0,
        mamt: 0,
        labourAmt: 0,
        fineAmt: 0,
        totalAmt: 0,
        igst: 0,
        numberToWords: "",
        cgst: 0,
        sgst: 0,
        less: 0,
        dPcs: 0,
        dWt: 0,
        dAmt: 0,
        cPcs: 0,
        cWt: 0,
        cAmt: 0,
        pkgWt: 0,
        TotalAmount: 0
    });
    const [isImageWorking, setIsImageWorking] = useState(true);
  const handleImageErrors = () => {
    setIsImageWorking(false);
  };
    const [taxes, setTaxes] = useState([]);
    const loadData = (data) => {
        setjson0Data(data?.BillPrint_Json[0]);
        let totals = { ...total };
        let arr = [];
        data?.BillPrint_Json1.forEach((e, i) => {
            let findIndex = arr.findIndex((ele, ind) => e?.SubCategoryname === ele?.SubCategoryname && e?.MetalType === ele?.MetalType && e?.MetalPurity === ele?.MetalPurity,);
            if (findIndex === -1) {
                let count = 1;
                let obj = { ...e };
                obj.diamondPcs = 0;
                obj.diamondWt = 0;
                obj.diamondAmt = 0;
                obj.diamondRate = 0;
                obj.colorStonePcs = 0;
                obj.colorStoneWt = 0;
                obj.colorStoneAmt = 0;
                obj.colorStoneRate = 0;
                obj.metalPcs = 0;
                obj.metalWt = 0;
                obj.metalAmt = 0;
                obj.metalRate = 0;
                obj.count = count;
                let srJobArr = [];
                srJobArr.push(e?.SrJobno);
                obj.srJobArr = srJobArr;
                arr.push(obj);
            } else {
                arr[findIndex].count += 1;
                arr[findIndex].grosswt += e?.grosswt;
                arr[findIndex].NetWt += e?.NetWt;
                arr[findIndex].MakingAmount += e?.MakingAmount;
                arr[findIndex].OtherCharges += e?.OtherCharges;
                arr[findIndex].TotalAmount += e?.TotalAmount;
                arr[findIndex].MetalAmount += e?.MetalAmount;
                arr[findIndex].PackageWt += e?.PackageWt;
                arr[findIndex].srJobArr.push(e?.SrJobno);
            }
        });
        let resultArr = [];
        arr.forEach((e, i) => {
            let obj = { ...e };
            obj.FineWt = 0;
            obj.OtherAmount = 0;
            data?.BillPrint_Json2.forEach((ele, ind) => {
                obj.srJobArr.map((elem, index) => {
                    if (elem === ele?.StockBarcode) {
                        if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
                            obj.metalPcs += ele?.Pcs;
                            obj.metalWt += ele?.Wt;
                            obj.metalAmt += ele?.Amount;
                            obj.FineWt += ele?.FineWt;
                            // metal
                        } else if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
                            // color stone
                            obj.colorStonePcs += ele?.Pcs;
                            totals.cPcs += ele?.Pcs;
                            totals.cWt += ele?.Wt;
                            totals.cAmt += ele?.Amount;
                            obj.colorStoneWt += ele?.Wt;
                            obj.colorStoneAmt += ele?.Amount;
                        } else if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
                            // diamond
                            obj.diamondPcs += ele?.Pcs;
                            totals.dPcs += ele?.Pcs;
                            totals.dWt += ele?.Wt;
                            totals.dAmt += ele?.Amount;
                            obj.diamondWt += ele?.Wt;
                            obj.diamondAmt += ele?.Amount;
                        }
                    }
                })
            });
            totals.pkgWt += e?.PackageWt;
            totals.TotalAmount += e?.TotalAmount;
            resultArr.push(obj);
        });
        resultArr.sort((a, b) => {
            const nameA = a.Collectionname.toLowerCase();
            const nameB = b.Collectionname.toLowerCase();
            if (nameA < nameB) {
                return -1;
            }

            if (nameA > nameB) {
                return 1;
            }

            return 0; // names are equal
        });

        resultArr.forEach((e, i) => {
            totals.count += e?.count;
            totals.gwt += e?.grosswt;
            totals.nwt += e?.NetWt;
            totals.mamt += e?.MetalAmount;
            totals.labourAmt += e?.MakingAmount;
            totals.fineAmt += e?.FineWt;
            totals.totalAmt += e?.TotalAmount;
        });
        totals.igst = (totals.totalAmt * data?.BillPrint_Json[0]?.IGST) / 100;
        totals.cgst = (totals.totalAmt * data?.BillPrint_Json[0]?.CGST) / 100;
        totals.sgst = (totals.totalAmt * data?.BillPrint_Json[0]?.SGST) / 100;
        totals.less = data?.BillPrint_Json[0]?.AddLess;
        // totals.totalAmt = totals.totalAmt + totals.cgst + totals.sgst + totals.less;
        // tax
        let taxValue = taxGenrator(data?.BillPrint_Json[0], totals.totalAmt);
        setTaxes(taxValue);
        taxValue.length > 0 && taxValue.forEach((e, i) => {
            totals.totalAmt += +(e?.amount);
        });
        totals.numberToWords = numberToWord(totals.totalAmt);

        // tax end
        totals.totalAmt += totals.less;
        totals.totalAmt = (totals.totalAmt)?.toFixed(2);
        setTotal(totals);
        setData(resultArr);
    };

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
        };
        sendData();
        let obj = { ...styles };
        if (atob(evn).toLowerCase() === "memo") {
            obj.metaltype = style?.metaltypeItemWisePrintHallmark1;
            obj.category = style?.categoryItemWisePrintHallmark1;
            obj.pkg = style?.pkgItemWisePrintHallmark1;
            obj.count = style?.countItemWisePrintHallmark1;
            obj.dpcs = style?.dpcsItemWisePrintHallmark1;
            obj.gwt = style?.gwtItemWisePrintHallmark1;
            obj.amount = style?.amountItemWisePrintHallmark1;
            setStyles(obj);
            // } else if (atob(evn).toLowerCase() === "hallmark") {
        } else {
            obj.metaltype = style?.metaltypeItemWisePrintHallmark;
            obj.category = style?.categoryItemWisePrintHallmark;
            obj.pkg = style?.pkgItemWisePrintHallmark;
            obj.count = style?.countItemWisePrintHallmark;
            obj.dpcs = style?.dpcsItemWisePrintHallmark;
            obj.gwt = style?.gwtItemWisePrintHallmark;
            obj.amount = style?.amountItemWisePrintHallmark;
            setStyles(obj);
        }
    }, []);

    return (<>
        {loader ? <Loader /> : msg === "" ? <div className={`container ${style?.hallmarkContainer} mt-2 pad_60_allPrint`}>
            {/* Print Button */}
            <div className="d-flex justify-content-end align-items-center print_sec_sum4 pt-4 pb-4">
                <div className="form-check">
                    <input
                        type="button"
                        className="btn_white blue me-0"
                        value="Print"
                        onClick={(e) => handlePrint(e)}
                    />
                </div>
            </div>
            <div>
                {/* Heading */}
                <div className={`bgLightPink p-2 border mb-2 ${style?.min_height_30}`}>
                    <p className="fw-bold fs-4">{json0Data?.PrintHeadLabel}</p>
                </div>
                {/* company with logo detail  */}
                <div className="headerDetailp11 border-start border-end border-top border-2 d-flex justify-content-between align-items-center mx-auto">
                    <div className='px-1 py-2'>
                        <p className="fw-bold">{json0Data?.CompanyFullName}</p>
                        <p>{json0Data?.CompanyAddress}</p>
                        <p>{json0Data?.CompanyAddress2}</p>
                        <p>{json0Data?.CompanyCity} {json0Data?.CompanyPinCode} {json0Data?.CompanyState} {json0Data?.CompanyCountry}</p>
                        <p>{json0Data?.CompanyEmail} | {json0Data?.CompanyWebsite}</p>
                        <p>{json0Data?.Company_VAT_GST_No} | {json0Data?.Cust_CST_STATE}-{json0Data?.Company_CST_STATE_No} | PAN-{json0Data?.Pannumber}</p>
                    </div>
                    <div className='px-1 py-2 position-relative'>
                    {isImageWorking && (json0Data?.PrintLogo !== "" && 
                      <img src={json0Data?.PrintLogo} alt="" 
                      className='w-25 h-auto ms-auto d-block object-fit-contain'
                      onError={handleImageErrors} height={120} width={150} />)}
                        {/* <img src={json0Data?.PrintLogo} alt="" className={`w-25 h-auto ms-auto d-block ${style?.logoImage}`}  /> */}
                    </div>
                </div>
                {/* address */}
                <div className="d-flex border-start border-end  border-bottom recordDetailPrint1 border-top">
                    <div className="col-4 border-end  p-1">
                        {/* <p className='lhDetailPrint1 fw-bold'>{json0Data?.lblBillTo}</p> */}
                        <p className='lhDetailPrint1 '>Issue To, </p>
                        <p className='lhDetailPrint1 fw-bold'>{json0Data?.customerfirmname}</p>
                        <p className='lhDetailPrint1'>{json0Data?.customerAddress2}</p>
                        <p className='lhDetailPrint1'>{json0Data?.customerAddress1}</p>
                        <p className='lhDetailPrint1'>{json0Data?.customerAddress3}</p>
                        <p className='lhDetailPrint1'>{json0Data?.customercity}-{json0Data?.customerpincode}</p>
                        <p className='lhDetailPrint1'>{json0Data?.customeremail1}</p>
                        <p className='lhDetailPrint1'>{json0Data?.vat_cst_pan}</p>
                        <p className='lhDetailPrint1'>{json0Data?.Cust_CST_STATE}-{json0Data?.Cust_CST_STATE_No}</p>
                    </div>
                    <div className="col-4 border-end  p-1">
                        <p className='lhDetailPrint1'>Ship To,</p>
                        <p className='lhDetailPrint1 fw-bold'>{json0Data?.customerfirmname}</p>
                        <p className='lhDetailPrint1'>{json0Data?.CustName}</p>
                        <p className='lhDetailPrint1'>{json0Data?.customerstreet}</p>
                        <p className='lhDetailPrint1'>{json0Data?.customercity1}, {json0Data?.State}</p>
                        <p className='lhDetailPrint1'>{json0Data?.CompanyCountry}-{json0Data?.PinCode}</p>
                        <p className='lhDetailPrint1'>Mobile No : {json0Data?.customermobileno}</p>
                    </div>
                    <div className="col-4 p-1">
                        <div className="d-flex">
                            <p className='fw-bold col-3 me-2'>{atob(evn).toLowerCase() === "memo" ? "VOUCHER NO" : "BILL NO"}</p>
                            <p className='col-9'>{json0Data?.InvoiceNo}</p>
                        </div>
                        <div className="d-flex">
                            <p className='fw-bold col-3 me-2'>DATE </p>
                            <p className='col-9'>{json0Data?.EntryDate}</p>
                        </div>
                        <div className="d-flex">
                            <p className='fw-bold col-3 me-2'>HSN </p>
                            <p className='col-9'>{json0Data?.HSN_No}</p>
                        </div>
                    </div>
                </div>
                {/* Address */}
                {/* Table Heading */}
                <div className="bgLightPink d-flex border-start border-end border-bottom main_pad_item_wise_print">
                    <div className={`${styles?.metaltype} border-end`}>
                        <p className="fw-bold p-1">METAL TYPE</p>
                    </div>
                    <div className={`${styles?.category} border-end`}>
                        <p className="fw-bold p-1">SUB CATEGORY</p>
                    </div>
                    <div className={`${styles?.pkg} border-end`}>
                        <p className="fw-bold p-1">PKG WT</p>
                    </div>
                    <div className={`${styles?.count} border-end`}>
                        <p className="fw-bold p-1">COUNT</p>
                    </div>
                    <div className={`${styles?.dpcs} border-end`}>
                        <p className="fw-bold p-1">DPCS</p>
                    </div>
                    <div className={`${styles?.dpcs} border-end`}>
                        <p className="fw-bold p-1">DWT</p>
                    </div>
                    <div className={`${styles?.dpcs} border-end`}>
                        <p className="fw-bold p-1">CPCS</p>
                    </div>
                    <div className={`${styles?.dpcs} border-end`}>
                        <p className="fw-bold p-1">CWT</p>
                    </div>
                    <div className={`${styles?.gwt} border-end`}>
                        <p className="fw-bold p-1">GWT</p>
                    </div>
                    <div className={`${styles?.gwt} ${evtName === "memo" && `border-end`}`}>
                        <p className="fw-bold p-1">NWT</p>
                    </div>
                    {evtName === "memo" && <div className={`${styles?.amount}`}>
                        <p className="fw-bold p-1">Amount</p>
                    </div>}
                </div>
                {/* Data */}
                {data.length > 0 &&
                    data.map((e, i) => {
                        return (
                            <div className={`d-flex border-start border-end border-bottom main_pad_item_wise_print_row`} key={i}>
                                <div className={`${styles?.metaltype} border-end`}>
                                    <p className="p-1">
                                        {e?.MetalType} {e?.MetalPurity}
                                    </p>
                                </div>
                                <div className={`${styles?.category} border-end`}>
                                    <p className="p-1">
                                        {e?.SubCategoryname}
                                    </p>
                                </div>
                                <div className={`${styles?.pkg} border-end`}>
                                    <p className="text-end p-1">{e?.PackageWt !== 0 && fixedValues(e?.PackageWt, 3)}</p>
                                </div>
                                <div className={`${styles?.count} border-end`}>
                                    <p className="text-end p-1">{e?.count !== 0 && NumberWithCommas(e?.count, 0)}</p>
                                </div>
                                <div className={`${styles?.dpcs} border-end`}>
                                    <p className="text-end p-1">
                                        {e?.diamondPcs !== 0 && NumberWithCommas(e?.diamondPcs, 0)}
                                    </p>
                                </div>
                                <div className={`${styles?.dpcs} border-end`}>
                                    <p className="text-end p-1">
                                        {e?.diamondWt !== 0 && fixedValues(e?.diamondWt, 3)}
                                    </p>
                                </div>
                                <div className={`${styles?.dpcs} border-end`}>
                                    <p className="text-end p-1">
                                        {e?.colorStonePcs !== 0 && NumberWithCommas(e?.colorStonePcs, 0)}
                                    </p>
                                </div>
                                <div className={`${styles?.dpcs} border-end`}>
                                    <p className="text-end p-1">
                                        {e?.colorStoneWt !== 0 && fixedValues(e?.colorStoneWt, 3)}
                                    </p>
                                </div>
                                <div className={`${styles?.gwt} border-end`}>
                                    <p className="text-end p-1">
                                        {e?.grosswt !== 0 && fixedValues(e?.grosswt, 3)}
                                    </p>
                                </div>
                                <div className={`${styles?.gwt} ${evtName === "memo" && `border-end`}`}>
                                    <p className="text-end p-1">
                                        {e?.NetWt !== 0 && fixedValues(e?.NetWt, 3)}
                                    </p>
                                </div>
                                {evtName === "memo" && <div className={`${styles?.amount} `}>
                                    <p className="text-end p-1">
                                        {e?.NetWt !== 0 && NumberWithCommas(e?.TotalAmount, 2)}
                                    </p>
                                </div>}
                            </div>
                        );
                    })}
                {/* Tax */}
                {/* Total */}
                <div className={`d-flex border-start border-end border-bottom main_pad_item_wise_print_row bgLightPink `}>
                    <div className={`${styles?.metaltype} border-end d-flex justify-content-center align-items-center`}>
                        <p className="fw-bold p-1">Total</p>
                    </div>
                    <div className={`${styles?.category} border-end`}>
                        <p className="p-1"></p>
                    </div>
                    <div className={`${styles?.pkg} border-end`}>
                        <p className="fw-bold text-end p-1">{total?.pkgWt !== 0 && fixedValues(total?.pkgWt, 3)}</p>
                    </div>
                    <div className={`${styles?.count} border-end`}>
                        <p className="fw-bold text-end p-1">{total.count !== 0 && NumberWithCommas(total.count, 0)}</p>
                    </div>
                    <div className={`${styles?.dpcs} border-end`}>
                        <p className="fw-bold text-end p-1">{total?.dPcs !== 0 && NumberWithCommas(total?.dPcs, 0)}</p>
                    </div>
                    <div className={`${styles?.dpcs} border-end`}>
                        <p className="fw-bold text-end p-1">{total?.dWt !== 0 && fixedValues(total?.dWt, 3)}</p>
                    </div>
                    <div className={`${styles?.dpcs} border-end`}>
                        <p className="fw-bold text-end p-1">{total?.cPcs !== 0 && NumberWithCommas(total?.cPcs, 0)}</p>
                    </div>
                    <div className={`${styles?.dpcs} border-end`}>
                        <p className="fw-bold text-end p-1">{total?.cWt !== 0 && fixedValues(total?.cWt, 3)}</p>
                    </div>
                    <div className={`${styles?.gwt} border-end`}>
                        <p className="fw-bold text-end p-1">{total?.gwt !== 0 && fixedValues(total?.gwt, 3)}</p>
                    </div>
                    <div className={`${styles?.gwt} ${evtName === "memo" && `border-end`}`}>
                        <p className="fw-bold text-end p-1">{total?.nwt !== 0 && fixedValues(total?.nwt, 3)}</p>
                    </div>
                    {evtName === "memo" && <div className={`${styles?.amount} `}>
                        <p className="fw-bold text-end p-1">{total?.nwt !== 0 && NumberWithCommas(total?.TotalAmount, 2)}</p>
                    </div>}
                </div>
                {/* Notes */}
                <div className="d-flex border-start border-end border-bottom p-2">
                    <p className="pb-2"><span className="fw-bold">NOTE :</span> Jewellery mentioned above is sent for Hallmark purpose and not for Sale.</p>
                </div>
                {/* signs */}
                <div className="d-flex border-start border-end border-bottom">
                    <div className="col-6 p-1 border-end">
                        <p className="pt-5 text-center">Authorised, <span className="fw-bold">{json0Data?.companyname}</span></p>
                    </div>
                    <div className="col-6 p-1">
                        <p className="pt-5 text-center"><span className="fw-bold">Authorised, {json0Data?.customerfirmname}</span></p>
                    </div>
                </div>
            </div>
        </div> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>}
    </>
    );
};

export default HallmarkItemWisePrint;
