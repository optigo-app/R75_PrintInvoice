import React, { useEffect, useState } from 'react'
import style from "../../assets/css/prints/retailInvoicePrint3.module.css";
import { ToWords } from 'to-words';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import { cloneDeep } from 'lodash';
import Loader from '../../components/Loader';
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
    ReceiveInBank,
    checkMsg,
} from "../../GlobalFunctions";

const RetailInvoicePrint3 = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
    const [msg, setMsg] = useState("");
    const [loader, setLoader] = useState(true);
    const toWords = new ToWords();
    const [data, setData] = useState({});
    const [label, setlabel] = useState([]);
    const [headerData, setHeaderData] = useState({});
    const [isImageWorking, setIsImageWorking] = useState(true);
    const [total, setTotal] = useState({
        netWithLossWt: 0,
        netInvoiceValue: 0,
        TotalAmounttobePaid: 0,
        balanceAmount: 0,
    });
    const [bankDetails, setBankDetails] = useState([]);
    const [debitCard, setDebitCard] = useState([]);
    const handleImageErrors = () => {
        setIsImageWorking(false);
    };
    const loadData = (data) => {
        let head = HeaderComponent("1", data?.BillPrint_Json[0]);
        let footers = FooterComponent("2", data?.BillPrint_Json[0]);
        setHeaderData(data?.BillPrint_Json[0]);
        let printArr = data?.BillPrint_Json[0]?.Printlable.split("\r\n");
        setlabel(printArr);
        let datas = OrganizeDataPrint(data?.BillPrint_Json[0], data?.BillPrint_Json1, data?.BillPrint_Json2);

        let resultArr = [];
        let netWithLossWts = 0;
        let netInvoiceValue = data?.BillPrint_Json[0]?.AddLess;
        let secondaryAmounts = 0;
        datas?.resultArray?.forEach((e, i) => {
            let obj = cloneDeep(e);
            let secondaryAmount = 0;
            let netWithLossWt = 0;
            let metalWt = 0;
            let count = 0;
            e?.metal?.forEach((ele, ind) => {
                if (ele?.IsPrimaryMetal === 1) {
                    metalWt += ele?.Wt;
                } else {
                    secondaryAmount += ele?.Amount;
                }
                count++;
            });
            e?.finding?.forEach((ele, ind) => {
                secondaryAmount += ele?.SettingAmount;
            });

            if (count === 1) {
                netWithLossWt = e?.NetWt + e?.LossWt;
            } else {
                netWithLossWt = metalWt;
            }
            obj.netWithLossWt = netWithLossWt;
            netWithLossWts += netWithLossWt;
            obj.secondaryAmount = e?.UnitCost - secondaryAmount;
            secondaryAmounts += obj.secondaryAmount;
            resultArr?.push(obj);
            netInvoiceValue += e?.TotalAmount;
        });
        datas.mainTotal.secondaryAmounts = secondaryAmounts;
        datas?.allTaxes?.forEach((e, i) => {
            netInvoiceValue += +e?.amount
        });

        let debitCardinfo = ReceiveInBank(data?.BillPrint_Json[0]?.BankPayDet);
        let debitInfo = debitCardinfo.reduce((acc, current) => {
            acc += +(current.amount);
            return acc;
        }, 0);
        setDebitCard(debitCardinfo);

        let bankDetails = ReceiveInBank(data?.BillPrint_Json[0]?.InvPayDet);
        setBankDetails(bankDetails);

        let balanceAmount = netInvoiceValue - debitInfo;

        setTotal({ ...total, netWithLossWt: netWithLossWts, netInvoiceValue: netInvoiceValue, TotalAmounttobePaid: debitInfo + data?.BillPrint_Json[0]?.CashReceived, balanceAmount: balanceAmount });
        datas.resultArray = resultArr;
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
        loader ? <Loader /> : msg === "" ? <>
            <div className={`container max_width_container  ${style?.retailInvoicePrint3} pad_60_allPrint px-1 mt-5 pt-5`}>
                {/* buttons */}
                <div className="d-flex justify-content-end align-items-center print_sec_sum4 mb-4 mt-4">
                    <div className="form-check ps-3">
                        <input type="button" className="btn_white blue" value="Print" onClick={(e) => handlePrint(e)} />
                    </div>
                </div>
                {/* header */}
                <div className="bgGrey p-2">
                    <p className="fs-5 text-white fw-bold">{headerData?.PrintHeadLabel}</p>
                </div>
                <div className='px-2 pb-2 border-bottom'>
                    <p className="fw-bold pt-1" style={{ fontSize: "19px" }}>{headerData?.CompanyFullName}</p>
                    <p className={`${style?.font_13}`}>{headerData?.CompanyAddress}</p>
                    <p className={`${style?.font_13}`}>{headerData?.CompanyCity}-{headerData?.CompanyPinCode}, {headerData?.CompanyState}({headerData?.CompanyCountry})</p>
                    <p className={`${style?.font_13}`}>T {headerData?.CompanyTellNo} | TOLL FREE {headerData?.CompanyTollFreeNo}</p>
                    <p className={`${style?.font_13}`}>{headerData?.CompanyEmail} | {headerData?.CompanyWebsite}</p>
                </div>
                <div className={`py-2 d-flex justify-content-between ${style?.font_13}`}>
                    <div className="col-3 px-2">
                        <div className="d-flex border-black border px-2">
                            <div className="col-6 fw-bold"><p>BILL NO :</p></div>
                            <div className="col-6"><p>{headerData?.InvoiceNo}</p></div>
                        </div>
                    </div>
                    <div className="col-3 px-2">
                        <div className="d-flex border-black border px-2">
                            <div className="col-6 fw-bold"><p>{headerData?.HSN_No_Label} :</p></div>
                            <div className="col-6"><p>{headerData?.HSN_No}</p></div>
                        </div>
                    </div>
                    <div className="col-3 px-2">
                        <div className="d-flex border-black border px-2">
                            <div className="col-6 fw-bold"><p>Date :</p></div>
                            <div className="col-6"><p>{headerData?.EntryDate}</p></div>
                        </div>
                    </div>
                </div>
                <div className="border border-black d-flex">
                    <div className='px-2'> <p className="fw-bold">TO,</p>	</div>
                    <div className='px-2'>
                        <p className="fw-bold">{headerData?.CustName}	</p>
                        <p>{headerData?.customerAddress2} {headerData?.customerAddress1} {headerData?.customerAddress3}</p>
                        <p>{headerData?.customerregion}</p>
                        <p>{headerData?.customercity}-{headerData?.PinCode}</p>
                    </div>
                </div>
                <div className="border-start border-end border-bottom border-black d-flex px-2">
                    <p className="fw-bold">{headerData?.RetailInvoiceMsg}</p>
                </div>
                <div className="oveflow-hidden border-start border-end border-bottom  border-black">
                    <div className={`px-1 border-bottom d-flex ${style?.font_13}`}>
                        <div className={`${style?.Variant}`} style={{ wordBreak: "normal" }}> <p className='' style={{ wordBreak: "normal" }}>Variant No/ Product Description </p></div>
                        <div className={`${style?.KT}`}> <p className='text-center'>KT </p></div>
                        <div className={`${style?.Qty}`}> <p className='text-center'>Qty </p></div>
                        <div className={`${style?.Gross}`}> <p className='text-center'>Gross Wt(gms) </p></div>
                        <div className={`${style?.Dia}`}> <p className='text-center'>Dia Wt  (ctw.) </p></div>
                        <div className={`${style?.Stone}`}> <p className='text-center'>Stone Wt  (ctw.) </p></div>
                        <div className={`${style?.Misc}`}> <p className='text-center'>Misc Wt(gms) </p></div>
                        <div className={`${style?.Net}`}> <p className='text-center'>Net Wt(gms) </p></div>
                        <div className={`${style?.Price}`}> <p className='text-center'>Price(Rs) </p></div>
                        <div className={`${style?.Discount}`}> <p className='text-center'>Discount(Rs) </p></div>
                        <div className={`${style?.Product}`}> <p className='text-end'>Product Amount(Rs) </p></div>
                    </div>
                    {
                        data?.resultArray?.map((e, i) => {
                            return <div className={`d-flex px-1 border-bottom no_break ${style?.font_13}`} key={i}>
                                <div className={`${style?.Variant}`}> <p className='' style={{ wordBreak: "normal" }}>{e?.designno} / {e?.SrJobno}</p><p> {e?.MetalPurity} {e?.Categoryname}</p></div>
                                <div className={`${style?.KT}`}> <p className='text-center'>{e?.MetalPurity} </p></div>
                                <div className={`${style?.Qty}`}> <p className='text-center'>{e?.Quantity} </p></div>
                                <div className={`${style?.Gross}`}> <p className='text-center'>{NumberWithCommas(e?.grosswt, 3)} </p></div>
                                <div className={`${style?.Dia}`}> <p className='text-center'>{NumberWithCommas(e?.totals?.diamonds?.Wt, 3)}</p></div>
                                <div className={`${style?.Stone}`}> <p className='text-center'>{NumberWithCommas(e?.totals?.colorstone?.Wt, 3)} </p></div>
                                <div className={`${style?.Misc}`}> <p className='text-center'>{NumberWithCommas(e?.totals?.misc?.Wt, 3)} </p></div>
                                <div className={`${style?.Net}`}> <p className='text-center'>{NumberWithCommas(e?.netWithLossWt, 3)}</p></div>
                                <div className={`${style?.Price}`}> <p className='text-center'>{NumberWithCommas(e?.secondaryAmount, 2)}</p></div>
                                <div className={`${style?.Discount}`}> <p className='text-center'>{NumberWithCommas(e?.DiscountAmt, 2)}</p></div>
                                <div className={`${style?.Product}`}> <p className='text-end'>{NumberWithCommas(e?.TotalAmount, 2)}</p></div>
                            </div>
                        })
                    }
                    <div className={`d-flex border-bottom border-black px-1 no_break ${style?.font_13}`}>
                        <div className={`${style?.Variant}`}> <p className='' style={{ wordBreak: "normal" }}>Total</p></div>
                        <div className={`${style?.KT}`}> <p className='text-center'> </p></div>
                        <div className={`${style?.Qty}`}> <p className='text-center'>{NumberWithCommas(data?.mainTotal?.total_Quantity, 0)} </p></div>
                        <div className={`${style?.Gross}`}> <p className='text-center'>{NumberWithCommas(data?.mainTotal?.grosswt, 3)}</p></div>
                        <div className={`${style?.Dia}`}> <p className='text-center'>{NumberWithCommas(data?.mainTotal?.diamonds?.Wt, 3)}</p></div>
                        <div className={`${style?.Stone}`}> <p className='text-center'>{NumberWithCommas(data?.mainTotal?.colorstone?.Wt, 3)} </p></div>
                        <div className={`${style?.Misc}`}> <p className='text-center'>{NumberWithCommas(data?.mainTotal?.misc?.Wt, 3)}</p></div>
                        <div className={`${style?.Net}`}> <p className='text-center'>{NumberWithCommas(total?.netWithLossWt, 3)}</p></div>
                        <div className={`${style?.Price}`}> <p className='text-center'>{NumberWithCommas(data?.mainTotal?.secondaryAmounts, 2)}</p></div>
                        <div className={`${style?.Discount}`}> <p className='text-center'>{NumberWithCommas(data?.mainTotal?.total_discount_amount, 2)}</p></div>
                        <div className={`${style?.Product}`}> <p className='text-end'>{NumberWithCommas(data?.mainTotal?.total_amount, 2)}</p></div>
                    </div>
                    <div className={`border-black no_break d-flex justify-content-end px-1 ${style?.font_13}`}>
                        <div className="col-4 d-flex justify-content-between">
                            <div><p>Product Total Value</p></div>
                            <div><p>{NumberWithCommas(data?.mainTotal?.total_amount, 2)}</p></div>
                        </div>
                    </div>
                </div>
                <div className={`oveflow-hidden d-flex no_break border-black border-start border-end border-bottom ${style?.font_13}`}>
                    <div className="col-6 border-end border-black position-relative">
                        <p className="fw-bold px-1">Payment Details  </p>
                        <div className="d-flex justify-content-between border-bottom px-1 border-black">
                            <p className="col-4">Payment Mode</p>
                            <p className="col-3">Doc No.</p>
                            <p className="col-3">Customer Name</p>
                            <p className="col-2 text-end" >Amount(Rs)</p>
                        </div>
                        {(headerData?.CashReceived === 0 && debitCard.length === 0) && <div className="d-flex justify-content-between px-1 border-bottom border-black">
                            <div className="col-4"><p>NA</p></div>
                            <div className="col-3"><p>{ }</p></div>
                            <div className="col-3"><p></p></div>
                            <div className="col-2 text-end"><p>NA</p></div>
                        </div>}
                        {
                            bankDetails?.map((ele, ind) => {
                                return <div className="d-flex justify-content-between px-1 border-bottom border-black" key={ind}>
                                    <div className="col-4"><p>{ele?.BankName}</p></div>
                                    <div className="col-3"><p>{ele?.label}</p></div>
                                    <div className="col-3"><p></p></div>
                                    <div className="col-2 text-end"><p className='text-break'>{NumberWithCommas(ele?.amount, 2)}</p></div>
                                </div>
                            })
                        }
                        <div className="d-flex justify-content-between px-1 border-bottom border-black">
                            <p className='fw-bold'>Total Amount Paid</p>
                            <p className='fw-bold text-break'>{NumberWithCommas(bankDetails?.reduce((acc, cObj) => acc + cObj?.amount, 0), 2)}</p>
                        </div>
                        <div className="d-flex justify-content-between px-1 border-bottom border-black">
                            <p className='fw-bold'>Balance Amount</p>
                            {/* <p className='fw-bold'>Rs.{NumberWithCommas(total?.balanceAmount, 2)}</p> */}
                            <p className='fw-bold text-break'>Rs.{NumberWithCommas(headerData?.LedgerBal, 0)}</p>
                        </div>
                        <div className="pt-5 px-1 position-absolute bottom-0 left-0">
                            <p className=''> Customer Name : {headerData?.CustName}</p>
                            <p className='pt-5'>  Customer Signature</p>
                        </div>
                    </div>
                    <div className="col-6 ">
                        <div className="d-flex justify-content-between border-bottom border-black px-1">
                            <p>Total Value</p>
                            <p>{NumberWithCommas(data?.mainTotal?.total_amount, 2)}</p>
                        </div>
                        {
                            data?.allTaxes?.map((e, i) => {
                                return <div className="d-flex justify-content-between border-bottom border-black px-1" key={i}>
                                    <p>{e?.name} @ {e?.per}</p>
                                    <p>{NumberWithCommas(e?.amount * headerData?.CurrencyExchRate, 2)}</p>
                                </div>
                            })
                        }
                        {headerData?.AddLess !== 0 && <div className="d-flex justify-content-between border-bottom border-black px-1">
                            <p>{headerData?.AddLess > 0 ? "Add" : "Less"}:- Other Discount</p>
                            <p>{NumberWithCommas(Math.abs(headerData?.AddLess), 2)}</p>
                        </div>}
                        <div className="d-flex justify-content-between border-bottom border-black px-1">
                            <p>Value after Discount </p>
                            <p>{NumberWithCommas(data?.mainTotal?.total_amount + headerData?.AddLess, 2)}</p>
                        </div>
                        <div className="d-flex justify-content-between border-bottom border-black px-1">
                            <p>Net Invoice Value</p>
                            <p>{NumberWithCommas(data?.mainTotal?.total_amount + headerData?.AddLess + data?.allTaxes?.reduce((acc, cObj) => acc + (+cObj?.amount * headerData?.CurrencyExchRate), 0), 2)}</p>
                        </div>
                        <div className="d-flex justify-content-between border-bottom border-black px-1">
                            <p>Total Amount to be paid</p>
                            <p><span className='pe-1'>Rs.</span> Rs.{NumberWithCommas(headerData?.LedgerBal, 0)}</p>
                        </div>
                        <div className=" border-bottom border-black px-1">
                            <p style={{ wordBreak: "normal" }}> Value In Words :- {toWords?.convert(+fixedValues(data?.mainTotal?.total_amount + headerData?.AddLess + data?.allTaxes?.reduce((acc, cObj) => acc + (+cObj?.amount * headerData?.CurrencyExchRate), 0), 2))} Only</p>
                        </div>
                        <div className="pt-5 px-1">
                            <p className='pt-5'>For {headerData?.CompanyFullName}</p>
                            <p className='pt-5'>Authorised Signatory</p>
                        </div>
                    </div>
                </div>
                <div className="px-1 no_break border-black border-start border-end border-bottom">
                    <p className={`fw-bold py-1 ${style?.font_13}`}>NOTE:-</p>
                    <div dangerouslySetInnerHTML={{ __html: headerData?.Declaration }}></div>
                </div>

            </div>
            {/* <SampleDetailPrint11 /> */}
        </> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
    )
}

export default RetailInvoicePrint3
