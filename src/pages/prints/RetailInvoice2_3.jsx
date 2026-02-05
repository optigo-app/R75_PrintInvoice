import React, { useEffect, useState } from 'react'
import { apiCall, handlePrint, isObjectEmpty, HeaderComponent, NumberWithCommas, taxGenrator, numberToWord, ReceiveInBank, fixedValues, GovernMentDocuments, checkMsg } from '../../GlobalFunctions';
import Loader from '../../components/Loader';
import style from '../../assets/css/prints/retailInovice2_3.module.css';
import Footer2 from '../../components/footers/Footer2';
import { handleImageError } from '../../GlobalFunctions/HandleImageError';
import { cloneDeep } from 'lodash';
import ImageComponent from '../../components/ImageComponent ';
import style1 from "../../assets/css/headers/header1.module.css";


const RetailInvoice2_3 = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {

    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [headerComp, setHeaderComp] = useState(null);
    const [json0Data, setJson0Data] = useState({});
    const [retailInvoice3, setRetailInvoice3] = useState(atob(printName).toLowerCase() === "retail invoice 3" ? true : false);
    const [data, setData] = useState([]);
    const [total, setTotal] = useState({
        Qty: 0,
        grosswt: 0,
        diaWt: 0,
        csWt: 0,
        miscWt: 0,
        NetWt: 0,
        UnitCost: 0,
        DiscountAmt: 0,
        TotalAmount: 0,
    });
    const [tax, setTax] = useState([]);
    const [amount, setAmount] = useState({
        valueAfterDiscount: 0,
        netInvoiceValue: 0,
        totalAmountPaid: 0,
        balanceAmount: 0
    });
    const [bankDetail, setBankDetail] = useState([]);

    const [balanceReceived, setBalanceReceived] = useState(0);
    const [styles, setStyles] = useState({});
    const [isImageWorking, setIsImageWorking] = useState(true);
    const handleImageErrors = () => {
        setIsImageWorking(false);
    };
    const [debitCard, setDebitCard] = useState([]);
    const [logoStyle, setlogoStyle] = useState({ maxWidth: "120px", maxHeight: "95px", minHeight: "95px" });

    const loadData = (data) => {
        let totals = { ...total };
        let headerData = data?.BillPrint_Json[0];
        setJson0Data(headerData);
        let head = HeaderComponent(headerData?.HeaderNo, headerData);
        setHeaderComp(head);
        let resultArr = [];
        let discountAmt = 0;
        data?.BillPrint_Json1.forEach((e, i) => {
            let diaWt = 0;
            let csWt = 0;
            let miscWt = 0;
            let metalRate = 0;
            let metalQuality = "";
            let Qty = 1;
            let netWtLoss = 0;
            let metalWt = 0;
            let count = 0;
            let secondaryMetalAmt = 0
            discountAmt += e?.DiscountAmt;
            let findingAmount = 0;

            data?.BillPrint_Json2.forEach((ele, ind) => {
                if (e?.SrJobno === ele?.StockBarcode) {
                    if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
                        metalQuality = ele?.QualityName;

                        count++;
                        if (ele?.IsPrimaryMetal === 1) {
                            metalWt += ele?.Wt;
                            metalRate = ele?.Rate;
                        } else {
                            secondaryMetalAmt += ele?.Amount
                        }
                    } else if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
                        diaWt += ele?.Wt;
                    }
                    else if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
                        csWt += ele?.Wt;
                    }
                    else if (ele?.MasterManagement_DiamondStoneTypeid === 3) {
                        miscWt += ele?.Wt;
                    }
                    if (ele?.MasterManagement_DiamondStoneTypeid === 5) {
                        findingAmount += ele?.SettingAmount;
                    }
                }
            });

            let bankDetails = ReceiveInBank(data?.BillPrint_Json[0]?.InvPayDet);
            setBankDetail(bankDetails);
            if (count === 1) {
                netWtLoss = e?.NetWt + e?.LossWt;
            } else {
                netWtLoss = metalWt;
            }
            totals.Qty += e?.Quantity;
            totals.diaWt += diaWt;
            totals.csWt += csWt;
            totals.miscWt += miscWt;
            // totals.NetWt += e?.NetWt;
            totals.NetWt += netWtLoss;
            totals.grosswt += e?.grosswt;
            totals.UnitCost += (e?.UnitCost - secondaryMetalAmt - findingAmount);
            totals.DiscountAmt += e?.DiscountAmt;
            totals.TotalAmount += e?.TotalAmount;

            let obj = { ...e };
            obj.diaWt = diaWt;
            obj.csWt = csWt;
            obj.miscWt = miscWt;
            obj.metalRate = metalRate;
            obj.metalQuality = metalQuality;
            obj.netWtLoss = netWtLoss;
            obj.findingAmount = findingAmount;
            obj.secondaryMetalAmt = secondaryMetalAmt
            obj.Qty = Qty;
            resultArr?.push(obj)
        });
        resultArr?.sort((a, b) => {
            let nameA = a?.designno?.toLowerCase() + a?.SrJobno?.toLowerCase();
            let nameB = b?.designno?.toLowerCase() + b?.SrJobno?.toLowerCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
        })


        setData(resultArr);
        setTotal(totals);
        let taxValue = taxGenrator(headerData, totals?.TotalAmount);
        setTax(taxValue);
        let amounts = taxValue.reduce((acc, current) => {
            acc.tax += +(current.amount);
            return acc;
        }, { tax: 0 });
        let summaryAmounts = { ...amount };
        let valueAfterDiscounts = totals?.TotalAmount + headerData?.AddLess;
        let netInvoiceValue = valueAfterDiscounts + amounts?.tax;
        let debitCardinfo = ReceiveInBank(headerData?.BankPayDet);
        let debitInfo = debitCardinfo.reduce((acc, current) => {
            acc += +(current.amount);
            return acc;
        }, 0);
        let balanRece = data?.BillPrint_Json[0]?.CashReceived + debitCardinfo?.reduce((acc, cObj) => acc + cObj?.amount, 0);
        setBalanceReceived(balanRece);
        summaryAmounts.valueAfterDiscount = valueAfterDiscounts;
        summaryAmounts.netInvoiceValue = netInvoiceValue;
        summaryAmounts.totalAmountPaid = debitInfo;
        summaryAmounts.balanceAmount = netInvoiceValue - debitInfo;
        setAmount(summaryAmounts);
        setDebitCard(debitCardinfo);
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
        let print3 = atob(printName).toLowerCase() === "retail invoice 3";
        let styless = { ...styles };
        styless.discription = print3 ? style?.discription_retailInvoice_2_3_3 : style?.discription_retailInvoice_2_3;
        styless.kt = print3 ? style?.kt_retailInvoice_2_3_3 : style?.kt_retailInvoice_2_3;
        styless.dwt = print3 ? style?.dwt_retailInvoice_2_3_3 : style?.dwt_retailInvoice_2_3;
        styless.gwt = print3 ? style?.gwt_retailInvoice_2_3_3 : style?.gwt_retailInvoice_2_3;
        styless.scheme = print3 ? style?.scheme_retailInvoice_2_3_3 : style?.scheme_retailInvoice_2_3;
        styless.diaWt = print3 ? style?.diaWt_retailInvoice_2_3_3 : style?.diaWt_retailInvoice_2_3;
        // styless.srNo = print3 ? style?.discription_retailInvoice_2_3_3 : style?.discription_retailInvoice_2_3;
        setStyles(styless);
    }, []);

    return (
        loader ? <Loader /> : msg === "" ? <>
            <div className={`container ${style?.containerretailInvoice2} pad_60_allPrint px-1 containerretailInvoice2 pt-1`}>
                {/* Print Button */}
                <div className={`${style?.printBtn_sec} text-end container pt-4 pb-4 px-0`}>
                    <input type="button" className="btn_white blue me-0" value="Print" onClick={(e) => handlePrint(e)} />
                </div>
                {/* Header */}
                <div className={`retailInvoice_2_3`}>
                    {/* {headerComp} */}

                    <div className={`${style1.headline} headerTitle target_header`}>{json0Data?.PrintHeadLabel}</div>
                    <div className={`${style1.companyDetails} target_header`}>
                        <div className={`${style1.companyhead} p-2`}>
                            <div className={style1.lines} style={{ fontWeight: "bold" }}>
                                {json0Data?.CompanyFullName}
                            </div>
                            <div className={style1.lines}>{json0Data?.CompanyAddress}</div>
                            <div className={style1.lines}>{json0Data?.CompanyAddress2}</div>
                            <div className={style1.lines}>{json0Data?.CompanyCity}-{json0Data?.CompanyPinCode},{json0Data?.CompanyState}({json0Data?.CompanyCountry})</div>
                            <div className={style1.lines}>T {json0Data?.CompanyTellNo}{json0Data?.CompanyTollFreeNo !== "" && ` | TOLL FREE ${json0Data?.CompanyTollFreeNo}`}</div>
                            <div className={style1.lines}>
                                {json0Data?.CompanyEmail} | {json0Data?.CompanyWebsite}
                            </div>
                            <div className={style1.lines}>
                                {/* {json0Data?.Company_VAT_GST_No} | {json0Data?.Company_CST_STATE}-{json0Data?.Company_CST_STATE_No} | PAN-{json0Data?.Pannumber} */}
                                {json0Data?.Company_VAT_GST_No} | {json0Data?.Company_CST_STATE}-{json0Data?.Company_CST_STATE_No} | PAN-{json0Data?.Pannumber}
                            </div>
                        </div>
                        <div style={{ width: "30%" }} className="d-flex justify-content-end align-item-center h-100">
                            <ImageComponent imageUrl={json0Data?.PrintLogo} styles={logoStyle} />
                            {/* <img src={data?.PrintLogo} alt="" className={style.headerImg} /> */}
                        </div>
                    </div>                </div>
                <div className={`${style?.containerretailInvoice2_font}`}>
                    {/* Invoice Details */}
                    <div className={`d-flex justify-content-between pt-1 ${style?.font_13_head}`}>
                        <div className="col-3 border-black border py-2 px-1 d-flex">
                            <div className="col-4">
                                <p className="fw-bold mb-0">BILL NO: </p>
                            </div>
                            <div className="col-8">
                                <p className="mb-0">{json0Data?.InvoiceNo}</p>
                            </div>
                        </div>
                        <div className="col-3 border-black border py-2 px-1 d-flex">
                            <div className="col-4">
                                <p className="fw-bold mb-0">HSN: </p>
                            </div>
                            <div className="col-8">
                                <p className="mb-0">{json0Data?.HSN_No}</p>
                            </div>
                        </div>
                        <div className="col-3 border-black border py-2 px-1 d-flex">
                            <div className="col-4">
                                <p className="fw-bold mb-0">Date: </p>
                            </div>
                            <div className="col-8">
                                <p className="mb-0">{json0Data?.EntryDate}</p>
                            </div>
                        </div>
                    </div>
                    {/* Customer Details */}
                    <div className="d-flex pt-2 w-100">
                        <div className="border-black border pt-2 pb-1 px-1 w-100">
                            <div className="d-flex w-100">
                                <div className='pe-4'><p className={`fw-bold mb-0 ${style?.font_13_head}`}>TO, </p></div>
                                <div>
                                    <p className={`fw-bold mb-0 ${style?.font_12_head} pb-1`}>{json0Data?.CustName}</p>
                                    <p className={`mb-0 ${style?.font_13_head}`}>{json0Data?.customerstreet}</p>
                                    <p className={`mb-0 ${style?.font_13_head}`}>{json0Data?.customerAddress2}</p>
                                    <p className={`mb-0 ${style?.font_13_head}`}>{json0Data?.customercity}{json0Data?.customerpincode}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Retailer product Issued */}
                    <div className="d-flex w-100">
                        <div className="border-black border-start border-end border-bottom py-2 px-1 w-100">
                            <p className={`fw-bold mb-0 ${style?.font_13}`}>{json0Data?.RetailInvoiceMsg}</p>
                        </div>
                    </div>
                    {/* table */}
                    <div className="">
                        {/* table header */}
                        <div className={`border-black border-start border-end border-bottom p-1 w-100 d-flex ${style?.font_13}`}>
                            <div className={`${styles?.discription}`} style={{ wordBreak: "normal" }}><p style={{ wordBreak: "normal" }}>Product Description</p></div>
                            <div className={`${styles?.kt}`}><p className='text-center'>KT</p></div>
                            <div className={`${styles?.kt}`}><p className='text-center'>Qty</p></div>
                            <div className={`${styles?.gwt}`}><p className='text-center'>Gross Wt(gms)</p></div>
                            <div className={`${styles?.diaWt}`}><p className='text-center'>Dia Wt</p><p className='text-center'>(gms/carat)</p></div>
                            <div className={`${styles?.dwt}`}><p className='text-center'>Stone Wt</p><p className='text-center'>(carat)</p></div>
                            <div className={`${styles?.dwt}`}><p className='text-center'>Misc Wt</p><p className='text-center'>(gms)</p></div>
                            {!retailInvoice3 && <div className={`${style?.metalRate_retailInvoice_2_3}`}><p className='text-center'>Metal Rate</p></div>}
                            <div className={`${style?.metalRate_retailInvoice_2_3}`}><p className='text-center'>Net Wt(gms)</p></div>
                            <div className={`${style?.metalRate_retailInvoice_2_3}`}><p className='text-center'>Price(Rs)</p></div>
                            {!retailInvoice3 && <div className={`${style?.image_retailInvoice_2_3}`}><p className='text-center'>Image</p></div>}
                            {!retailInvoice3 && <div className={`${styles?.scheme}`}><p className='text-center'>Scheme</p><p className='text-center'>Discount</p></div>}
                            <div className={`${styles?.scheme}`}> {!retailInvoice3 && <p className='text-center'>Scheme</p>}<p className='text-center'>Discount(Rs)</p></div>
                            <div className={`${styles?.scheme}`}><p className='text-end'>Product</p><p className='text-end'> {!retailInvoice3 ? `Value` : `Amount`}(Rs)</p></div>
                        </div>
                        {/* table data */}
                        {data.length > 0 && data.map((e, i) => {
                            return <div className={`border-black border-start border-end p-1 w-100 d-flex ${style?.font_13}`} key={i}>
                                <div className={`${styles?.discription}`}><p style={{ wordBreak: "normal" }}>{e?.designno} {e?.SrJobno}</p><p style={{ wordBreak: "normal" }}>{e?.MetalPurity} {e?.Categoryname}</p></div>
                                <div className={`${styles?.kt}`}><p className='text-center'>{e?.MetalPurity}</p></div>
                                <div className={`${styles?.kt}`}><p className='text-center'>{NumberWithCommas(e?.Quantity, 0)}</p></div>
                                <div className={`${styles?.gwt}`}><p className='text-center'>{NumberWithCommas(e?.grosswt, 3)}</p></div>
                                <div className={`${styles?.diaWt}`}><p className='text-center'>{NumberWithCommas(e?.diaWt, 3)}</p></div>
                                <div className={`${styles?.dwt}`}><p className='text-center'>{NumberWithCommas(e?.csWt, 3)}</p></div>
                                <div className={`${styles?.dwt}`}><p className='text-center'>{NumberWithCommas(e?.miscWt, 3)}</p></div>
                                {!retailInvoice3 && <div className={`${style?.metalRate_retailInvoice_2_3}`}><p className='text-center'>{NumberWithCommas(e?.metalRate, 2)}</p></div>}
                                <div className={`${style?.metalRate_retailInvoice_2_3}`}><p className='text-center'>{NumberWithCommas(e?.netWtLoss, 3)}</p></div>
                                <div className={`${style?.metalRate_retailInvoice_2_3}`}><p className='text-center'>{NumberWithCommas(e?.UnitCost - e?.findingAmount - e?.secondaryMetalAmt, 2)}</p></div>
                                {!retailInvoice3 && <div className={`${style?.image_retailInvoice_2_3} `}><img src={e?.DesignImage} alt="" className={`${style?.img_retailInvoice_2_3} w-100 mx-auto d-block`} style={{maxWidth: "50px", maxHeight: "50px"}} onError={handleImageError} /></div>}
                                {!retailInvoice3 && <div className={`${styles?.scheme}`}><p className='text-center'>{e?.Discount !== 0 ? <> {NumberWithCommas(e?.Discount, 2)}% On Total Amount</> : "-"}</p></div>}
                                <div className={`${styles?.scheme}`}><p className='text-center'>{NumberWithCommas(e?.DiscountAmt, 2)}</p></div>
                                <div className={`${styles?.scheme}`}><p className='text-end'>{NumberWithCommas(e?.TotalAmount, 2)}</p></div>
                            </div>
                        })}
                        <div className={`border-black border-start border-end  p-1 w-100 d-flex border-bottom ${style?.font_13}`}>
                            <div className={`${styles?.discription}`}><p>Total</p></div>
                            <div className={`${styles?.kt}`}><p className=''></p></div>
                            <div className={`${styles?.kt}`}><p className='text-center'>{NumberWithCommas(total?.Qty, 0)}</p></div>
                            <div className={`${styles?.gwt}`}><p className='text-center'>{NumberWithCommas(total?.grosswt, 3)}</p></div>
                            <div className={`${styles?.diaWt}`}><p className='text-center'>{NumberWithCommas(total?.diaWt, 3)}</p></div>
                            <div className={`${styles?.dwt}`}><p className='text-center'>{NumberWithCommas(total?.csWt, 3)}</p></div>
                            <div className={`${styles?.dwt}`}><p className='text-center'>{NumberWithCommas(total?.miscWt, 3)}</p></div>
                            {!retailInvoice3 && <div className={`${style?.metalRate_retailInvoice_2_3}`}><p className='text-center'></p></div>}
                            <div className={`${style?.metalRate_retailInvoice_2_3}`}><p className='text-center'>{NumberWithCommas(total?.NetWt, 3)}</p></div>
                            <div className={`${style?.metalRate_retailInvoice_2_3}`}><p className='text-center'>{NumberWithCommas(total?.UnitCost, 2)}</p></div>
                            <div className={`${style?.image_retailInvoice_2_3}`}></div>
                            <div className={`${styles?.scheme}`}><p className='text-center'></p></div>
                            <div className={`${styles?.scheme}`}><p className='text-center'>{NumberWithCommas(total?.DiscountAmt, 2)}</p></div>
                            <div className={`${styles?.scheme}`}><p className='text-end'>{NumberWithCommas(total?.TotalAmount, 2)}</p></div>
                        </div>
                        <div className={`border-black border-start border-end border-bottom p-1 w-100 d-flex justify-content-end ${style?.font_13_head}`}>
                            <div className={`${style?.pad_end_retail_invoice_2_3}`}><p>Product Total Value</p></div>
                            <div><p>{NumberWithCommas(total?.TotalAmount, 2)}</p></div>
                        </div>
                        <div className={`border-black border-start border-end border-bottom w-100 d-flex ${style?.font_13_head}`}>
                            <div className="col-6 border-black border-end">
                                <p className="fw-bold p-1">Payment Details</p>
                                <div className="d-flex p-1 border-black border-bottom">
                                    <div className="col-4"><p>Payment Mode</p></div>
                                    <div className="col-3"><p>Doc no.</p></div>
                                    <div className="col-3"><p>Customer Name</p></div>
                                    <div className="col-2 text-end"><p>Amount(Rs)</p></div>
                                </div>
                                {(json0Data?.CashReceived === 0 && debitCard.length === 0) && <div className="d-flex justify-content-between px-1 border-bottom border-black">
                                    <div className="col-4"><p>NA</p></div>
                                    <div className="col-3"><p>{ }</p></div>
                                    <div className="col-3"><p></p></div>
                                    <div className="col-2 text-end"><p>NA</p></div>
                                </div>}
                                {
                                    bankDetail?.map((e, i) => {
                                        return <div className="d-flex p-1 border-black border-bottom justify-content-between px-2" key={i}>
                                            <div className="col-4"><p>{e?.BankName}</p></div>
                                            <div className="col-3"><p>{e?.label}</p></div>
                                            <div className="col-3"><p></p></div>
                                            <div className="col-2 text-end text-break" ><p className=''>{NumberWithCommas(e?.amount, 2)}</p></div>
                                        </div>
                                    })
                                }
                                <div className="d-flex p-1 border-black border-bottom justify-content-between">
                                    <div className="col-4"><p className='fw-bold'>Total Amount Paid</p></div>
                                    <div className="col-3"><p className='fw-bold'></p></div>
                                    <div className="col-3"><p className='fw-bold'></p></div>
                                    {/* <div className="col-2 text-end"><p className='fw-bold'>{NumberWithCommas(balanceReceived, 2)}</p></div> */}
                                    <div className="col-2 text-end"><p className='fw-bold'>{NumberWithCommas(bankDetail?.reduce((acc, cObj) => acc + +cObj?.amount, 0), 2)}</p></div>
                                    {/* <div className="col-2 text-end"><p className='fw-bold'>{NumberWithCommas(amount?.totalAmountPaid, 2)}</p></div> */}
                                </div>
                                <div className="d-flex p-1 justify-content-between">
                                    <div className="col-4"><p className='fw-bold'>Balance Amount</p></div>
                                    <div className="col-3"><p className='fw-bold'></p></div>
                                    <div className="col-3"><p className='fw-bold'></p></div>
                                    {/* <div className="col-2 text-end"><p className='fw-bold'>{NumberWithCommas(amount?.balanceAmount, 2)}</p></div> */}
                                    <div className="col-2 text-end"><p className='fw-bold'>{NumberWithCommas(amount?.netInvoiceValue - bankDetail?.reduce((acc, cObj) => acc + +cObj?.amount, 0), 2)}</p></div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="d-flex border-black border-bottom justify-content-between p-1">
                                    <p>Total Value</p>
                                    <p>{NumberWithCommas(total?.TotalAmount, 2)}</p>
                                </div>
                                {tax.length > 0 && tax.map((e, i) => {
                                    return <div className="d-flex border-black border-bottom justify-content-between p-1" key={i}>
                                        <p>{e?.name} @ {e?.per}</p>
                                        <p>{e?.amount}</p>
                                    </div>
                                })}
                                {json0Data?.AddLess !== 0 && <div className="d-flex border-black border-bottom justify-content-between p-1">
                                    <p>{json0Data?.AddLess > 0 ? `Add` : `Less`} :- Other Discount</p>
                                    <p>{NumberWithCommas(Math.abs(json0Data?.AddLess), 2)}</p>
                                </div>}
                                <div className="d-flex border-black border-bottom justify-content-between p-1">
                                    <p>Value after Disocunt</p>
                                    <p>{NumberWithCommas(amount?.valueAfterDiscount, 2)}</p>
                                </div>
                                <div className="d-flex border-black border-bottom justify-content-between p-1">
                                    <p>Net Invoice Value</p>
                                    <p>{NumberWithCommas(amount?.netInvoiceValue, 2)}</p>
                                </div>
                                <div className="d-flex justify-content-between p-1">
                                    <p>Total Amount to be Paid</p>
                                    <p>{NumberWithCommas(amount?.netInvoiceValue, 2)}</p>
                                </div>

                            </div>
                        </div>
                        <div className={`border-black border-bottom border-start w-100 d-flex ${style?.font_13_head}`}>
                            <div className="col-6">
                            </div>
                            <div className="col-6 border-black border-end">
                                <div className="d-flex justify-content-between p-1">
                                    <p style={{ wordBreak: "normal" }}>Value In Words :- Rupees {numberToWord(+fixedValues(amount?.netInvoiceValue, 2))} Only</p>
                                </div>
                            </div>
                        </div>
                        <div className={`border-black border-start border-end border-bottom w-100 p-1  ${style?.terms}`}>
                            <p className={`fw-bold ${style?.font_13_head}`}>TERMS AND CONDITIONS:-</p>
                            <div dangerouslySetInnerHTML={{ __html: json0Data?.Declaration }} className=''></div>
                        </div>
                    </div>
                    <div className='retailInvoice_2_3_footer_Font_12 mt-1'>
                        <Footer2 data={json0Data} className={``} />
                    </div>
                </div>
            </div>
        </> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
    )
}

export default RetailInvoice2_3