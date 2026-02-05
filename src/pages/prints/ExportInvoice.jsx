import React, { useEffect, useState } from 'react'
import { NumberWithCommas, apiCall, fixedValues, handlePrint, isObjectEmpty, taxGenrator, FooterComponent, checkMsg, } from '../../GlobalFunctions';
import Loader from '../../components/Loader';
import style from "../../assets/css/prints/ExportInvoice.module.css";
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import { cloneDeep } from 'lodash';
import { ToWords } from "to-words";
import footer1 from "../../assets/css/footers/footer1.module.css";

const ExportInvoice = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
    const toWords = new ToWords();
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [data, setData] = useState({});
    const [headerData, setHeaderData] = useState({});
    const [footer, setFooter] = useState(null);
    const [category, setCategory] = useState({
        data: [],
        Quantity: 0
    });
    const [table1Total, setTable1Total] = useState({
        Quantity: 0,
        grosswt: 0,
        NetWt: 0,
        metalAmounts: 0,
        totalTax: 0,
        IgstAmount: 0,
        metalWeight: 0,
        taxInPer: 0
    });
    const loadData = (data) => {
        setHeaderData(data?.BillPrint_Json[0]);
        let footers = FooterComponent("1", data?.BillPrint_Json[0]);
        setFooter(footers);
        let datas = OrganizeDataPrint(data?.BillPrint_Json[0], data?.BillPrint_Json1, data?.BillPrint_Json2);
        let resultArr = [];
        let table1Totals = { ...table1Total };
        let categories = [];
        let quantities = 0;
        datas?.resultArray?.forEach((e, i) => {
            if (e?.MetalType === "GOLD") {
                let findGold = e?.metal?.find((ele, ind) => ele?.IsPrimaryMetal === 1);
                let findobj = resultArr?.findIndex((ele, ind) => ele?.metalRate === findGold?.Rate);
                table1Totals.grosswt += e?.grosswt;
                if (findobj === -1) {
                    let obj = cloneDeep(e);
                    if (findGold !== undefined) {
                        obj.metalRate = findGold?.Rate;
                        obj.metalAmounts = findGold?.Amount;
                        obj.metalPcs = findGold?.Pcs;
                        obj.metalWeight = findGold?.Wt;
                        table1Totals.metalAmounts += findGold?.Amount;
                        table1Totals.metalWeight += findGold?.Wt;
                    }
                    table1Totals.Quantity += e?.Quantity;
                    // table1Totals.grosswt += e?.grosswt;
                    table1Totals.NetWt += e?.NetWt;
                    resultArr.push(obj);
                } else {
                    resultArr[findobj].NetWt += e?.NetWt;
                    resultArr[findobj].grosswt += e?.grosswt;
                    resultArr[findobj].TotalAmount += e?.TotalAmount;
                    table1Totals.Quantity += e?.Quantity;
                    // table1Totals.grosswt += e?.grosswt;
                    table1Totals.NetWt += e?.NetWt;
                    resultArr[findobj].totals.metal.Amount += e?.totals?.metal?.Amount;
                    resultArr[findobj].totals.metal.Amount += e?.totals?.metal?.Amount;
                    if (findGold !== undefined) {
                        resultArr[findobj].metalAmounts += findGold?.Amount;
                        resultArr[findobj].metalPcs += findGold?.Pcs;
                        resultArr[findobj].metalWeight += findGold?.Wt;
                        resultArr[findobj].PureNetWt += e?.PureNetWt;
                        resultArr[findobj].Quantity += e?.Quantity;
                        table1Totals.metalAmounts += findGold?.Amount;
                        table1Totals.metalWeight += findGold?.Wt;
                        resultArr[findobj].totals.diamonds.Wt += e?.totals?.diamonds?.Wt;
                        resultArr[findobj].totals.diamonds.Pcs += e?.totals?.diamonds?.Pcs;
                        resultArr[findobj].totals.diamonds.Amount += e?.totals?.diamonds?.Amount;
                        resultArr[findobj].totals.colorstone.Wt += e?.totals?.colorstone?.Wt;
                        resultArr[findobj].totals.colorstone.Pcs += e?.totals?.colorstone?.Pcs;
                        resultArr[findobj].totals.colorstone.Amount += e?.totals?.colorstone?.Amount;
                        if (resultArr[findobj].MaKingCharge_Unit !== e?.MaKingCharge_Unit) {
                            resultArr[findobj].MaKingCharge_Unit = (resultArr[findobj]?.MaKingCharge_Unit + e?.MaKingCharge_Unit) / 2;
                        }
                    }

                }
                let findCategory = categories?.findIndex((ele, ind) => ele?.Categoryname === e?.Categoryname && ele?.MetalPurity === e?.MetalPurity);
                if (findCategory === -1) {
                    categories.push(e);
                } else {
                    categories[findCategory].Quantity += e?.Quantity;
                }
                quantities += e?.Quantity
            }
        });
        setCategory({ ...category, data: categories, Quantity: quantities });
        table1Totals.totalTax = datas?.allTaxes?.reduce((acc, cobj) => acc + +cobj?.amount, 0);
        table1Totals.IgstAmount = datas?.mainTotal?.total_amount * 0.03;
        setTable1Total(table1Totals);
        datas.finalArr = resultArr;
        datas.resultArray = resultArr;
        setData(datas);
    };
    const [isImageWorking, setIsImageWorking] = useState(true);
    const handleImageErrors = () => {
        setIsImageWorking(false);
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
    }, []);

    return (<>
        {loader ? <Loader /> : msg === "" ? <div className={`container max_width_container ${style?.exportInvoice} mt-1 pad_60_allPrint px-1 exportInvoice`}>
            {/* Print Button */}
            <div className={`d-flex justify-content-end align-items-center ${style?.print_sec_sum4} pt-4 pb-4`}>
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
                <div className="bgGrey p-1">
                    <p className="fs-5 text-uppercase text-white p-1 text-center fw-bold text-decoration-underline lh-1">{headerData?.PrintHeadLabel}</p>
                    <p className="fs-6 text-uppercase text-white p-1 text-center text-decoration-underline lh-1 fw-semibold">Supply meant for export on payment of integrated tax</p>
                </div>
                <div className='border-black border'>
                    {/* company details */}
                    <div className="d-flex border-top border-bottom border-black ">
                        <div className='p-2 col-6 border-end border-black'>
                            <div className="d-flex justify-content-between">
                                <p className="text-decoration-underline fw-semibold"> Exporter </p>
                                {/* <p className="text-decoration-underline"> Ref. Person Details </p> */}
                            </div>
                            <p className='fs-5 fw-bold py-1'>{headerData?.CompanyFullName}</p>
                            <p className='fw-semibold'>{headerData?.CompanyAddress}</p>
                            <p className='fw-semibold'>{headerData?.CompanyAddress2}</p>
                            <p className='fw-semibold'>{headerData?.CompanyCity}, {headerData?.CompanyCountry}</p>
                            <p className='fw-semibold'>Telephone No :{headerData?.CompanyTellNo}</p>
                            <p className='fw-semibold'>Email Id :{headerData?.CompanyEmail}</p>
                        </div>
                        <div className='col-6'>
                            <div className='d-flex border-bottom border-black'>
                                <div className="col-6 border-end border-black p-2">
                                    <div className="d-flex">
                                        <p className='pe-2 fw-semibold'>Invoice No :</p>
                                        <p className='fw-bold'>{headerData?.InvoiceNo}</p>
                                    </div>
                                    <div className="d-flex">
                                        <p className='pe-2 fw-semibold'>Invoice Dt :</p>
                                        <p className='fw-bold'>{headerData?.EntryDate}</p>
                                    </div>
                                    <div className="d-flex">
                                        <p className='pe-2 fw-semibold'>EDF No. :</p>
                                        <p className='fw-bold'></p>
                                    </div>
                                </div>
                                <div className="col-6 d-flex flex-column justify-content-between align-items-center p-2">
                                    <p className='text-uppercase fw-semibold'>Exporter's reference</p>
                                    <p className='text-uppercase fw-semibold'>under Chapter 4</p>
                                </div>
                            </div>
                            <div className='p-2'>
                                <p className="fw-bold">Buyer's Order No. & Date</p>
                                <p className="fw-semibold">Performa inv. No :</p>
                            </div>
                        </div>
                    </div>
                    {/* customner details */}
                    <div className="d-flex border-bottom border-black ">
                        <div className='p-2 col-6 border-end border-black'>
                            <div className="d-flex justify-content-between">
                                <p className="text-decoration-underline fw-semibold"> Consignee </p>
                                <p className="text-decoration-underline fw-semibold"> Ref. Person Details </p>
                            </div>
                            <p className='fs-5 fw-bold py-1'>{headerData?.customerfirmname}</p>
                            <p className='fw-semibold'>{headerData?.customerAddress1}</p>
                            <p className='fw-semibold'>{headerData?.customerAddress2}</p>
                            <p className='fw-semibold'>{headerData?.customerAddress3} {headerData?.customercity}, {headerData?.customercountry}</p>
                            <p className='fw-semibold'>Telephone No : {headerData?.customermobileno}</p>
                            <p className='fw-semibold'>Email Id :{headerData?.customeremail1}</p>
                        </div>
                        <div className='col-6'>
                            <div className='d-flex border-bottom border-black'>
                                <div className="col-6 border-end border-black p-2">
                                    <div className="d-flex">
                                        <p className='pe-2 fw-semibold'>Other Reference(s) :</p>
                                        <p className='fw-bold'>PAN-{headerData?.CustPanno}</p>
                                    </div>
                                </div>
                                <div className="col-6 p-2">
                                    <div className="d-flex">
                                        <p className='pe-2 fw-semibold'>IEC No. :</p>
                                        {/* <p className='fw-bold'>5214006365</p> */}
                                    </div>
                                    <p className='pe-2 fw-semibold'>GSTIN-{headerData?.Cust_VAT_GST_No}</p>
                                </div>
                            </div>
                            <div className='p-2'>
                                <p className="fw-bold">Buyer (if other than consignee)</p>
                            </div>
                        </div>
                    </div>
                    {/* pre-carriage by */}
                    <div className="d-flex border-bottom border-black overflow-hidden ">
                        <div className='col-6 border-end border-black'>
                            <div className="d-flex border-bottom border-black">
                                <div className="col-6 pt-1 px-1 pb-4 border-end border-black">
                                    <p className="fw-semibold">Pre-Carriage By </p>
                                </div>
                                <div className="col-6 pt-1 px-1 pb-4">
                                    <p className="fw-semibold">Place of Receipt by Pre-carrier N.A. </p>
                                </div>
                            </div>
                            <div className="d-flex border-bottom border-black">
                                <div className="col-6 pt-1 px-1 pb-4 border-end border-black">
                                    <p className="fw-semibold">Vessel/Flight No.</p>
                                    <p className="">{headerData?.Flight_NO}</p>
                                </div>
                                <div className="col-6 pt-1 px-1 pb-4">
                                    <p className="fw-semibold">Port of Loading</p>
                                    <p className="">{headerData?.portofloading}</p>
                                </div>
                            </div>
                            <div className="d-flex border-bottom border-black">
                                <div className="col-6 pt-1 px-1 pb-4 border-end border-black">
                                    <p className="fw-semibold">Port of Discharge</p>
                                    <p className="">{headerData?.portofdischarge}</p>
                                </div>
                                <div className="col-6 pt-1 px-1 pb-4">
                                    <p className="fw-semibold">Final Destination</p>
                                </div>
                            </div>
                            <div className={`d-flex ${style?.min_height41_59} h-100`}>
                                <div className="col-4 border-end border-black p-1 text-center">
                                    <p className="fw-semibold">Marks & Nos. AS ADDRESS</p>
                                </div>
                                <div className="col-4 border-end border-black p-1 text-center">
                                    <p className="fw-semibold">No & KIND OF PKGS</p>
                                </div>
                                <div className="col-4 p-1 text-center">
                                    <p className="fw-semibold">QUANTITY 2</p>
                                </div>
                            </div>
                        </div>
                        <div className='col-6'>
                            <div className="d-flex border-black border-bottom">
                                <div className="col-6 p-2 border-black border-end">
                                    <p className="fw-semibold text-center">Country of Origin of Goods </p>
                                    <p className="fw-bold text-center pt-1">{headerData?.customercountry}</p>
                                </div>
                                <div className="col-6 py-2">
                                    <p className="fw-semibold text-center">Country of Final Destination</p>
                                </div>
                            </div>
                            <div className="d-flex border-black border-bottom">
                                <div className="col-6 p-2">
                                    <p className="fw-semibold"> Terms of Delivery and payment </p>
                                    <p className="fw-semibold"> Bank Name : {headerData?.bankname} </p>
                                    <p className={`fw-semibold ${style?.min_height34}`}> Bank Add : {headerData?.bankaddress}</p>
                                </div>
                                <div className="col-6 p-2">
                                    <div className="d-flex">
                                        <div className="col-6">
                                            <p className="fw-semibold text-end"> Payment Terms : </p>
                                            <p className="fw-semibold text-end"> A/C No. : </p>
                                        </div>
                                        <div className="col-6">
                                            <p className="fw-semibold ps-2" style={{ minHeight: '15.36px' }}> </p>
                                            <p className="fw-semibold ps-2"> {headerData?.accountnumber}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="">
                                <p className="px-2 pt-1  fw-semibold"> Description of Goods </p>
                                <p className="px-2    fw-semibold">{headerData?.HSN_No}</p>
                            </div>
                        </div>
                    </div>
                    {/* Blank-Line */}
                    <div className="d-flex border-bottom border-black pb-4"></div>
                    {/* table header */}
                    <div className={`d-flex border-bottom border-black no_break`}>
                        <div className={`${style?.rtgs} p-1 text-center border-end border-black`}><p className='fw-semibold h-100'>RITC (IIS) Code</p></div>
                        <div className={`${style?.srNo} p-1 text-center border-end border-black`}><p className='fw-semibold h-100'></p></div>
                        <div className={`${style?.goods} p-1 text-center`}><p className='fw-semibold'>Description of Goods</p></div>
                        <div className={`${style?.kt} p-1 text-center border-end border-black border-start`}><p className='fw-semibold h-100'>KT</p></div>
                        <div className={`${style?.pcs} p-1 text-center border-end border-black`} style={{ minWidth: "7.1%", }}><p className='fw-semibold h-100'>Pcs</p></div>
                        <div className={`${style?.grossWt} p-1 text-center border-end border-black`}><p className='fw-semibold h-100'>Gross Wt</p></div>
                        <div className={`${style?.NetWt} p-1 text-center`} style={{ minWidth: "9.9%", width: "9.9%" }}><p className='fw-semibold h-100'>Net Wt</p></div>
                        <div className={`${style?.Rate} text-center border-end border-black`}><p className='fw-semibold border-start border-black p-1 h-100'>Rate ($)</p></div>
                        <div className={`${style?.value} p-1 text-center`}><p className='fw-semibold h-100'>Value ({headerData?.CurrencyCode})</p></div>
                    </div>
                    {/* table data */}
                    {data?.finalArr?.map((e, i) => {
                        return <div className={`d-flex border-black border_left no_break ${style?.exportPrinttable}`} key={i}>
                            <div className={`${style?.rtgs} text-center`} style={{ borderRight: "1px solid #ffffff00 !important" }}><p className='fw-semibold p-1'>{headerData?.HSN_No}</p></div>
                            <div className={`${style?.srNo} text-center`} style={{ borderRight: "1px solid #ffffff00 !important" }}><p className='fw-semibold p-1'>{`${i + 1})`}</p></div>
                            <div className={`${style?.goods} text-center`}><p className='fw-semibold p-1'>{e?.MetalPurity} plain Gold Jewellery</p></div>
                            <div className={`${style?.kt} text-center border-end border-black border-start`}><p className='fw-semibold p-1'>{e?.MetalPurity}</p></div>
                            <div className={`${style?.pcs} text-center border-end border-black`}><p className='fw-semibold p-1'>{NumberWithCommas(e?.Quantity, 0)}</p></div>
                            <div className={`${style?.grossWt} text-center border-end border-black`}><p className='fw-semibold p-1'>{NumberWithCommas(e?.grosswt, 3)}</p></div>
                            <div className={`${style?.NetWt} text-center`}><p className='fw-semibold p-1'>{NumberWithCommas(e?.NetWt, 3)}</p></div>
                            <div className={`${style?.Rate} text-center border-end border-black`}><p className='fw-semibold border-start border-black p-1 h-100'>{NumberWithCommas(e?.metalRate, 2)}</p></div>
                            <div className={`${style?.value} text-center border-black`}><p className='fw-semibold p-1'>{NumberWithCommas(e?.metalAmounts / headerData?.CurrencyExchRate, 2)}</p></div>
                        </div>
                    })}
                    {/* table total */}
                    <div className={`d-flex border_left ${style?.exportPrinttable}`}>
                        <div className={`${style?.small}`}>
                            {/* <div className="d-flex pb-4  no_break">
                                <div className="col-5 border-black border-top h-100">
                                    <p className="fw-semibold border-start border-bottom border-black px-2 py-1">Item</p>
                                    {
                                        category?.data?.map((e, i) => {
                                            return <p className="fw-semibold border-start border-black px-2 py-1" key={i}>{e?.Categoryname}</p>
                                        })
                                    }
                                    <p className="fw-semibold border-start border-bottom border-black border-top px-2 py-1">Total</p>
                                </div>
                                <div className="col-3 border-black border-top">
                                    <p className="fw-semibold border-bottom border-start border-end border-black px-2 py-1">KT</p>
                                    {
                                        category?.data?.map((e, i) => {
                                            return <p className="fw-semibold border-start border-end border-black px-2 py-1" key={i}>{e?.MetalPurity}</p>
                                        })
                                    }
                                    <p className="fw-semibold border-bottom border-start border-end border-black border-top px-2 py-1" style={{ minHeight: "24.36px" }}></p>
                                </div>
                                <div className="col-3 border-black  border-top">
                                    <p className="fw-semibold border-end border-bottom border-black px-2 py-1">QTY</p>
                                    {
                                        category?.data?.map((e, i) => {
                                            return <p className="fw-semibold border-end border-black px-2 py-1" key={i}>{NumberWithCommas(e?.Quantity, 0)}</p>
                                        })
                                    }
                                    <p className="fw-semibold border-end border-bottom border-black border-top px-2 py-1" style={{ maxHeight: "24.36px" }}>{NumberWithCommas(category?.Quantity, 0)}</p>
                                </div>
                            </div> */}
                            <div className='pb-4 pe-2 pt-1'>
                            <table className='w-100'>
                                <tbody>
                                <tr className=" no_break">
                                    <td className='col-5 border-black border-top h-100 fw-semibold border-start border-bottom px-2 py-1'>Item</td>
                                    <td className='col-3 border-black border-top h-100 fw-semibold border-start border-bottom px-2 py-1'>KT</td>
                                    <td className='col-3 border-black border h-100 fw-semibold  px-2 py-1'>QTY</td>
                                </tr>
                                {category?.data?.map((e, i) => {
                                    return <tr className="no_break" key={i}>
                                    <td className='col-5 border-black h-100 fw-semibold border-start border-bottom px-2 py-1'>{e?.Categoryname}</td>
                                    <td className='col-3 border-black h-100 fw-semibold border-start border-bottom px-2 py-1'>{e?.MetalPurity}</td>
                                    <td className='col-3 border-black h-100 fw-semibold border-start border-bottom border-end px-2 py-1'>{NumberWithCommas(e?.Quantity, 0)}</td>
                                </tr>
                                })}
                                </tbody>
                            </table>
                            </div>
                            <div className="d-flex border border-black  no_break">
                                <div className={`${style?.w_20} border-end border-black d-flex justify-content-center align-items-center`}><p className="fw-semibold text-center p-1">Total {headerData?.CurrencyCode}</p></div>
                                <div className={`${style?.w_20} border-end border-black d-flex justify-content-center align-items-center`}><p className="fw-semibold text-center p-1">RBI  Exch. Rate</p></div>
                                <div className={`${style?.w_20} border-end border-black d-flex justify-content-center align-items-center`}><p className="fw-semibold text-center p-1">Taxable Val {headerData?.CurrencyCode}</p></div>
                                <div className={`${style?.w_20} border-end border-black d-flex justify-content-center align-items-center`}><p className="fw-semibold text-center p-1">IGST</p></div>
                                <div className={`${style?.w_20} d-flex justify-content-center align-items-center`}><p className="fw-semibold text-center p-1">IGST  {headerData?.CurrencyCode}</p></div>
                            </div>
                            <div className="d-flex border-start border-end border-bottom border-black no_break">
                                <div className={`${style?.w_20} border-end border-black d-flex justify-content-center align-items-center`}><p className="fw-semibold text-center p-1">{NumberWithCommas(data?.mainTotal?.total_amount / headerData?.CurrencyExchRate, 2)}</p></div>
                                <div className={`${style?.w_20} border-end border-black d-flex justify-content-center align-items-center`}><p className="fw-semibold text-center p-1">{headerData?.CurrencyExchRate}</p></div>
                                <div className={`${style?.w_20} border-end border-black d-flex justify-content-center align-items-center`}><p className="fw-semibold text-center p-1">{NumberWithCommas(table1Total.totalTax / headerData?.CurrencyExchRate, 2)}</p></div>
                                <div className={`${style?.w_20} border-end border-black d-flex justify-content-center align-items-center`}><p className="fw-semibold text-center p-1">3%</p></div>
                                <div className={`${style?.w_20} d-flex justify-content-center align-items-center`}><p className="fw-semibold text-center p-1">{NumberWithCommas(table1Total?.IgstAmount / headerData?.CurrencyExchRate, 2)}</p></div>
                            </div>
                            <div className="py-2 no_break">
                                <div className="d-flex border border-black">
                                    <div className='col-4 border-end border-black'>
                                        <p className="fw-semibold p-1 border-bottom border-black">
                                            Gold Purchased from
                                        </p>
                                        <p className="fw-semibold p-1">
                                            Invoice No. & Date
                                        </p>
                                    </div>
                                    <div className='col-8'></div>
                                </div>
                            </div>
                        </div>
                        <div className={`${style?.kt} border-black border-start border-end h-100 border-top`}>
                            <p className='fw-semibold text-center border-black border-bottom p-1'>Total</p>
                        </div>
                        <div className={`${style?.pcs} border-black border-end h-100 border-top`}
                        // style={{ width: "6.99%", minWidth: "6.99%", }}
                        >
                            <p className='fw-semibold text-center border-black border-bottom p-1'>{NumberWithCommas(table1Total?.Quantity, 0)}</p>
                        </div>
                        <div className={`${style?.grossWt} border-black border-end h-100 `}
                            style={{ width: "10.01%", minWidth: "10.01%", }}
                        >
                            <p className='fw-semibold text-center border-black border-bottom p-1 border-top'>{NumberWithCommas(table1Total?.grosswt, 3)}</p>
                        </div>
                        <div className={`${style?.NetWt} border-black h-100 `}
                        //  style={{ width: "9.99%", minWidth: "9.99%", }}
                        >
                            <p className='fw-semibold text-center border-black border-bottom p-1 border-top'>{NumberWithCommas(table1Total?.NetWt, 3)}</p>
                        </div>
                        <div className={`${style?.Rate} border-black border-end h-100 `}
                        // style={{ width: "16.9%", minWidth: "16.9%", }}
                        >
                            <p className='fw-semibold p-1 text-center border-black border-bottom border-start text-uppercase border-top'>GOLD VALUE</p>
                            <p className='fw-semibold p-1 text-center border-black border-bottom border-start text-uppercase'>Studding Value</p>
                            <p className='fw-semibold p-1 text-center border-black border-bottom border-start text-uppercase'>making value</p>
                            <p className='fw-semibold p-1 text-center border-black border-bottom border-start text-uppercase'>fob {headerData?.CurrencyCode}</p>
                            <p className='fw-semibold p-1 text-center border-black border-bottom border-start text-uppercase'>freight</p>
                            <p className='fw-semibold p-1 text-center border-black border-bottom border-start text-uppercase'>cif  {headerData?.CurrencyCode}</p>
                        </div>
                        <div className={`${style?.value} border-black h-100 `}
                        // style={{ width: "10.2%", minWidth: "10.2%", }}
                        >
                            <p className='fw-semibold text-center border-black border-bottom p-1 border-top'>{NumberWithCommas(table1Total?.metalAmounts / headerData?.CurrencyExchRate, 2)}</p>
                            <p className='fw-semibold text-center border-black border-bottom p-1'>{NumberWithCommas((data?.mainTotal?.diamonds?.Amount + data?.mainTotal?.colorstone?.Amount + data?.mainTotal?.misc?.Amount) / headerData?.CurrencyExchRate, 2)}</p>
                            <p className='fw-semibold text-center border-black border-bottom p-1'>{NumberWithCommas(data?.mainTotal?.total_Making_Amount / headerData?.CurrencyExchRate, 2)}</p>
                            <p className='fw-semibold text-center border-black border-bottom p-1'>{NumberWithCommas(data?.mainTotal?.total_amount / headerData?.CurrencyExchRate, 2)}</p>
                            <p className='fw-semibold text-center border-black border-bottom p-1'>{NumberWithCommas(headerData?.FreightCharges / headerData?.CurrencyExchRate, 2)}</p>
                            <p className='fw-semibold text-center border-black border-bottom p-1'>{NumberWithCommas((headerData?.FreightCharges + data?.mainTotal?.total_amount) / headerData?.CurrencyExchRate, 2)}</p>
                        </div>
                    </div>
                    {/* Amount chargable */}
                    <p className="fw-semibold px-2 no_break"> Amount Chargable : </p>
                    <p className="fw-medium px-2 text-uppercase no_break"> CIF  {headerData?.CurrencyCode}:-
                        {/* FOUR HUNDRED TWENTY EIGHT AND EIGHTY Cent   */}
                        {toWords?.convert(+fixedValues((headerData?.FreightCharges + data?.mainTotal?.total_amount) / headerData?.CurrencyExchRate, 2))} ONLY</p>
                    <div className="d-flex justify-content-between pb-3 pt-2 no_break">
                        <p className='fw-semibold px-2'>GJEPC CERT.NO.</p>
                        <p className='fw-semibold px-2'>DATE: {headerData?.EntryDate}</p>
                        <p className='fw-semibold px-2'>RATE  {headerData?.CurrencyCode} : {NumberWithCommas(headerData?.MetalRate24K, 2)}</p>
                        <p className='fw-semibold px-2'>PER Toz FOR 0.9999 FINE GOLD</p>
                    </div>
                    {/* table header */}
                    <div className={`border-top border-bottom d-flex border-black no_break`}>
                        <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">Gold KT</p></div>
                        <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">Gold Gr Wt Gms</p></div>
                        <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">Gold Nt Wt Gms</p></div>
                        <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">Total Gold Wt Gms</p></div>
                        <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">Gold Rate in  {headerData?.CurrencyCode}</p></div>
                        <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">Gold Value  {headerData?.CurrencyCode}</p></div>
                        <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">Net Gold Fine 999 Gms</p></div>
                        <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">Total Gold 999 Gms</p></div>
                        <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">VA %</p></div>
                        <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">Making Charges  {headerData?.CurrencyCode}</p></div>
                        <div className={`${style?.smallstudding} border-end border-black`}>
                            <div className="d-grid h-100">
                                <div className="d-flex border-black border-bottom d-flex justify-content-center align-items-center">
                                    <p className="fw-semibold  text-center">Studding Value {headerData?.Currencysymbol}</p>
                                </div>
                                <div className="d-flex">
                                    <div className="col-4 d-flex justify-content-center align-items-center border-end border-black"><p className="fw-semibold text-center">Type</p></div>
                                    <div className="col-4 d-flex justify-content-center align-items-center border-end border-black"><p className="fw-semibold text-center">Wt cts</p></div>
                                    <div className="col-4 d-flex justify-content-center align-items-center"><p className="fw-semibold text-center">Value  {headerData?.CurrencyCode}</p></div>
                                </div>
                            </div>
                        </div>
                        <div className={`${style?.smallgold} d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">Total FOB  {headerData?.CurrencyCode}</p></div>
                    </div>
                    {/* table data */}
                    {data?.finalArr?.map((e, i) => {
                        return <div className={`border-bottom d-flex border-black no_break ${style?.exportPrinttable}`} key={i}>
                            <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">{e?.MetalPurity}</p></div>
                            <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">{NumberWithCommas(e?.grosswt, 3)}</p></div>
                            <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">{NumberWithCommas(e?.NetWt, 3)}</p></div>
                            <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">{NumberWithCommas(e?.metalWeight, 3)}</p></div>
                            <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">{NumberWithCommas(e?.metalRate, 2)}</p></div>
                            <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">{NumberWithCommas(e?.metalAmounts, 2)}</p></div>
                            <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">{NumberWithCommas(e?.PureNetWt, 3)}</p></div>
                            <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">{NumberWithCommas(e?.PureNetWt, 3)}</p></div>
                            <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center"></p></div>
                            <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">{NumberWithCommas(e?.MaKingCharge_Unit, 2)}</p></div>
                            <div className={`${style?.smallstudding} border-end border-black`}>
                                <div className="d-grid h-100">
                                    <div className="d-flex">
                                        <div className="col-4 border-end border-black">
                                            <p className="fw-semibold text-center border-bottom border-black">Dia</p>
                                            <p className="fw-semibold text-center">CS</p>
                                        </div>
                                        <div className="col-4 border-end border-black">
                                            <p className="fw-semibold text-center border-bottom border-black">{NumberWithCommas(e?.totals?.diamonds?.Wt, 3)}</p>
                                            <p className="fw-semibold text-center">{NumberWithCommas(e?.totals?.colorstone?.Wt, 3)}</p>
                                        </div>
                                        <div className="col-4">
                                            <p className="fw-semibold text-center border-bottom border-black">{NumberWithCommas(e?.totals?.diamonds?.Amount / headerData?.CurrencyExchRate, 2)}</p>
                                            <p className="fw-semibold text-center">{NumberWithCommas(e?.totals?.colorstone?.Amount / headerData?.CurrencyExchRate, 2)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={`${style?.smallgold} d-flex align-items-center justify-content-center`}><p className="fw-semibold text-center">{NumberWithCommas(e?.TotalAmount / headerData?.CurrencyExchRate, 2)}</p></div>
                        </div>
                    })
                    }
                    {/* table total */}
                    <div className={`border-bottom d-flex border-black no_break ${style?.exportPrinttable}`}>
                        <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-bold text-center">Total</p></div>
                        <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-bold text-center">{NumberWithCommas(table1Total?.grosswt, 3)}</p></div>
                        <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-bold text-center">{NumberWithCommas(table1Total?.NetWt, 3)}</p></div>
                        <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-bold text-center">{NumberWithCommas(table1Total?.metalWeight, 3)}</p></div>
                        <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-bold text-center"></p></div>
                        <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-bold text-center">{NumberWithCommas(table1Total?.metalAmounts, 2)}</p></div>
                        <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-bold text-center">{NumberWithCommas(data?.mainTotal?.total_purenetwt, 3)}</p></div>
                        <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-bold text-center">{NumberWithCommas(data?.mainTotal?.total_purenetwt, 3)}</p></div>
                        <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-bold text-center"></p></div>
                        <div className={`${style?.smallgold} border-end border-black d-flex align-items-center justify-content-center`}><p className="fw-bold text-center"></p></div>
                        <div className={`${style?.smallstudding} border-end border-black`}>
                            <div className="d-grid h-100">
                                <div className="d-flex">
                                    <div className="col-4 border-end border-black">
                                        <p className="fw-bold text-center border-bottom border-black">Dia</p>
                                        <p className="fw-bold text-center">CS</p>
                                    </div>
                                    <div className="col-4  border-end border-black">
                                        <p className="fw-bold text-center border-bottom border-black">{NumberWithCommas(data?.mainTotal?.diamonds?.Wt, 3)}</p>
                                        <p className="fw-bold text-center">{NumberWithCommas(data?.mainTotal?.colorstone?.Wt, 3)}</p>
                                    </div>
                                    <div className="col-4 ">
                                        <p className="fw-bold text-center border-bottom border-black">{NumberWithCommas(data?.mainTotal?.diamonds?.Amount / headerData?.CurrencyExchRate, 2)}</p>
                                        <p className="fw-bold text-center">{NumberWithCommas(data?.mainTotal?.colorstone?.Amount / headerData?.CurrencyExchRate, 2)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`${style?.smallgold} d-flex align-items-center justify-content-center`}><p className="fw-bold text-center">{NumberWithCommas(data?.mainTotal?.total_amount / headerData?.CurrencyExchRate, 2)}</p></div>
                    </div>
                    {/* signature */}
                    <div className="pt-2 no_break">
                        {/* <p className="fw-medium text-uppercase text-center px-2">
                            door to door insurance covered by <span className='text-lowercase'>bmc vama</span>
                        </p> */}
                        <div className="p-2">
                            <div className="border border-black p-2">
                                <p className="fw-bold pb-1">Declaration : </p>
                                <div className="fw-medium" dangerouslySetInnerHTML={{ __html: headerData?.Declaration }}>
                                </div>
                            </div>
                        </div>
                        <div className='p-2'>
                            <div className={`${footer1.footer1Info} no_break footerTarget`}>
                                <div className={`w-50 d-flex justify-content-center align-items-end ${footer1.borderRightF1} h-100`}>RECEIVER's NAME & SIGNATURE</div>
                                <div className="w-50 d-flex justify-content-center align-items-end h-100">for, {headerData?.customerfirmname}</div>
                            </div>
                        </div>

                        {/* <div className="border-start border-top border-black d-flex p-2" style={{ minHeight: "65px" }}>
                                <div className="col-4 d-flex flex-column justify-content-between">
                                    <p className="fw-semibold">Signature & Date</p>
                                    <p className="fw-semibold">Authorised Sign</p>
                                </div>
                                <div className="col-4">
                                    <p className="fw-semibold"> 28-06-19</p>
                                </div>
                            </div> */}
                    </div>
                </div>
            </div>
        </div> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>}
    </>
    );
}

export default ExportInvoice
