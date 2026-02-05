import React, { useEffect, useState } from 'react'
import { ToWords } from 'to-words';
import {
    apiCall,
    isObjectEmpty,
    NumberWithCommas,
    handlePrint,
    ReceiveInBank,
    checkMsg
} from "../../GlobalFunctions";

import style from '../../assets/css/prints/summary8.module.css';
import Loader from "../../components/Loader";
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import style2 from "../../assets/css/headers/header1.module.css";
import footerStyle from "../../assets/css/footers/footer2.module.css";
import { cloneDeep } from 'lodash';
import { CurrencyExchange } from '@mui/icons-material';

const Summary8 = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [data, setData] = useState({});
    const [summary, setSummary] = useState([]);
    const [bank, setBank] = useState([]);
    const [headerData, setHeaderData] = useState({});
    const toWords = new ToWords();
    const [isImageWorking, setIsImageWorking] = useState(true);
    const handleImageErrors = () => {
        setIsImageWorking(false);
    };
    const loadData = (data) => {
        setHeaderData(data?.BillPrint_Json[0]);
        let datas = OrganizeDataPrint(
            data?.BillPrint_Json[0],
            data?.BillPrint_Json1,
            data?.BillPrint_Json2
        );
        let resultArray = [];
        let summaries = [];

        datas?.resultArray.map((e, i) => {
            let metalRate = e?.metal.find((elem, index) => elem?.IsPrimaryMetal === 1);
            let findRecord = resultArray.findIndex((ele, ind) => e?.MetalTypePurity === ele?.MetalTypePurity &&
                metalRate?.Rate === ele?.metalRate &&
                e?.Categoryname === ele?.Categoryname &&
                e?.MaKingCharge_Unit === ele?.MaKingCharge_Unit);
            // let netWts = e?.metal?.reduce((acc, cObj) => cObj?.IsPrimaryMetal === 1 ? acc + cObj?.Wt : acc, 0) + e?.LossWt;
            let pureNet = e?.metal?.reduce((acc, cObj) => cObj?.IsPrimaryMetal === 1 ? acc + cObj?.Wt : acc, 0);
            let netWts = e?.NetWt;
            if (findRecord === -1) {
                let obj = cloneDeep(e);
                obj.netWts = netWts;
                obj.metalRate = metalRate?.Rate;
                obj.pureNet = pureNet;
                resultArray.push(obj);
            } else {
                resultArray[findRecord].totals.metal.Pcs += e.totals.metal.Pcs;
                resultArray[findRecord].grosswt += e.grosswt;
                resultArray[findRecord].NetWt += e.NetWt;
                resultArray[findRecord].netWts += netWts;
                resultArray[findRecord].TotalAmount += e.TotalAmount;
                resultArray[findRecord].Quantity += e.Quantity;
                resultArray[findRecord].pureNet += pureNet;
            }
            let findSummary = summaries.findIndex(ele => ele?.MetalTypePurity === e?.MetalTypePurity);
            if (findSummary === -1) {
                summaries.push({ MetalTypePurity: e?.MetalTypePurity, grosswt: e?.grosswt, netWts: netWts });
            } else {
                summaries[findSummary].grosswt += e?.grosswt;
                summaries[findSummary].netWts += netWts;
            }
        });

        summaries?.sort((a, b) => {
            return a?.MetalTypePurity.localeCompare(b?.MetalTypePurity);
        })
        setSummary(summaries);
        datas.resultArray = resultArray;
        datas?.resultArray.sort((acc, cobj) => acc.Categoryname.localeCompare(cobj.Categoryname));
        setData(datas);
   

        let bankDetail = ReceiveInBank(data?.BillPrint_Json[0]?.InvPayDet);
      
        let blankBank = [];
        bankDetail?.forEach((ele, ind) => {
            let obj = cloneDeep(ele);
            if(ele?.BankName?.toLowerCase() === "discount"){
                if(obj?.label === ""){
                    obj.BankName = "Cash ()";
                }else{
                    obj.BankName = "Cheque";
                }
            }
            blankBank?.push(obj);
        });
        setBank(blankBank);
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
    }, []);

    return loader ? (
        <Loader />
    ) : msg === "" ? (
        <div
            className={`container container-fluid max_width_container mt-1 ${style?.summary8} pad_60_allPrint`}
        >
            {/* buttons */}
            <div className={`d-flex justify-content-end align-items-center ${style?.print_sec_sum4} mb-4`} >
                <div className={`form-check ps-3 ${style?.printBtn}`}>
                    <input
                        type="button"
                        className="btn_white blue py-2 mt-2"
                        value="Print"
                        onClick={(e) => handlePrint(e)}
                    />
                </div>
            </div>
            {/* header */}
            <div className={`${style2.headline} headerTitle`}>{headerData?.PrintHeadLabel}</div>
            <div className={`${style2.companyDetails} pb-3`}>
                <div className="d-flex align-item-center h-100">

                    {/* <img src={headerData?.PrintLogo} alt="" className={style2.headerImg} style={{ maxWidth: "145px" }} /> */}
                    {isImageWorking && (headerData?.PrintLogo !== "" &&
                        <img src={headerData?.PrintLogo} alt=""
                            className={style2.headerImg}
                            style={{ maxWidth: "115px", minWidth: "115px" }}
                            onError={handleImageErrors} />)}

                </div>
                <div className={`p-2`}>
                    <div className={style2.lines} style={{ fontWeight: "bold", fontSize: "16px" }}>
                        {headerData?.CompanyFullName}
                    </div>
                    <div className={`${style2.lines} ${style?.lines}`}>{headerData?.CompanyAddress}</div>
                    <div className={`${style2.lines} ${style?.lines}`}>{headerData?.CompanyAddress2}</div>
                    <div className={`${style2.lines} ${style?.lines}`}>{headerData?.CompanyCity}-{headerData?.CompanyPinCode},{headerData?.CompanyState}({headerData?.CompanyCountry})</div>
                    {/* <div className={`${style2.lines} ${style?.lines}`}>Tell No: {headerData?.CompanyTellNo}</div> */}
                    <div className={`${style2.lines} ${style?.lines}`}>T:  {headerData?.CompanyTellNo}
                        {/* | TOLL FREE {headerData?.CompanyTollFreeNo} | TOLL FREE {headerData?.CompanyTollFreeNo} */}
                    </div>
                    <div className={`${style2.lines} ${style?.lines}`}>
                        {headerData?.CompanyEmail} | {headerData?.CompanyWebsite}
                    </div>
                    <div className={`${style2.lines} ${style?.lines}`}>
                        {/* {headerData?.Company_VAT_GST_No} | {headerData?.Company_CST_STATE}-{headerData?.Company_CST_STATE_No} | PAN-{headerData?.Pannumber} */}
                        {headerData?.Company_VAT_GST_No} | {headerData?.Company_CST_STATE}-{headerData?.Company_CST_STATE_No} | PAN-{headerData?.Pannumber}             </div>
                    <div className={`${style2.lines} ${style?.lines}`}>
                    </div>
                </div>
            </div>
            {/* title */}
            <div className="lightGrey p-1 text-center border border-black">
                <p className="fw-bold" style={{ fontSize: "21px" }}>{headerData?.PrintHeadLabel}</p>
            </div>
            {/* customer details */}
            <div className={`py-1 ${style?.font_13}`}>
                <div className="d-flex justify-content-between">
                    <div className="col-6 px-1">
                        <p>
                            {/* {headerData?.lblBillTo} */}
                            To,
                            </p>
                        <p className={`fw-bold ${style?.font_14}`}>{headerData?.customerfirmname}</p>
                        <p>{headerData?.customerAddress1}</p>
                        <p>{headerData?.customerAddress2}</p>
                        <p>{headerData?.customerAddress3}</p>
                        <p>{headerData?.customercity} - {headerData?.PinCode}</p>
                        <p>Tel : {headerData?.customermobileno}</p>
                        <p>{headerData?.customeremail1}</p>
                        <p>STATE NAME : {headerData?.State}{headerData?.Cust_CST_STATE_No !== "" && `, STATE CODE-${headerData?.Cust_CST_STATE_No}`}</p>
                        <p>{headerData?.CustGstNo !== "" && headerData?.CustGstNo} {headerData?.CustPanno !== "" && `| PAN-${headerData?.CustPanno}`}</p>
                    </div>
                    <div className="col-3 px-1">
                        <p>Date :<span className="fw-bold"> {headerData?.EntryDate}</span></p>
                        <p>Invoice No :<span className="fw-bold"> {headerData?.InvoiceNo}</span></p>
                        <p>Due Date:<span className="fw-bold"> {headerData?.DueDate}</span></p>
                    </div>
                </div>
            </div>
            {/* table header */}
            <div className={`d-flex border border-black lightGrey ${style?.font_13}`}>
                <div className={`${style?.Category} p-1 fw-bold text-center border-black border-end`}><p>Category</p></div>
                <div className={`${style?.Metal} p-1 fw-bold text-center border-black border-end`}><p>Metal</p></div>
                <div className={`${style?.Hsn} p-1 fw-bold text-center border-black border-end`}><p>HSN</p></div>
                <div className={`${style?.Pcs} p-1 fw-bold text-center border-black border-end`}><p>Pcs</p></div>
                <div className={`${style?.Gross} p-1 fw-bold text-center border-black border-end`}><p>Gross</p></div>
                <div className={`${style?.Net} p-1 fw-bold text-center border-black border-end`}><p>Net Wt</p></div>
                <div className={`${style?.Rate} p-1 fw-bold text-center border-black border-end`}><p>Rate</p></div>
                <div className={`${style?.Making} p-1 fw-bold text-center border-black border-end`}><p>Making Rate</p></div>
                <div className={`${style?.Total} p-1 fw-bold text-center`}><p>Total Amount</p></div>
            </div>
            {/* table data */}
            {data?.resultArray.map((e, i) => {
                return <div className={`d-flex border-start border-end border-bottom border-black no_break ${style?.font_13}`}>
                    <div className={`${style?.Category} p-1 border-black border-end`}><p>{e?.Categoryname}</p></div>
                    <div className={`${style?.Metal} p-1 border-black border-end`}><p>{e?.MetalTypePurity}</p></div>
                    <div className={`${style?.Hsn} p-1 border-black border-end`}><p>{headerData?.HSN_No}</p></div>
                    <div className={`${style?.Pcs} p-1 text-end border-black border-end`}><p>{NumberWithCommas(e?.Quantity, 0)}</p></div>
                    <div className={`${style?.Gross} p-1 text-end border-black border-end`}><p>{NumberWithCommas(e?.grosswt, 3)}</p></div>
                    <div className={`${style?.Net} p-1 text-end border-black border-end`}><p>{NumberWithCommas(e?.pureNet, 3)}</p></div>
                    <div className={`${style?.Rate} p-1 text-end border-black border-end`}><p>{NumberWithCommas(e?.metalRate, 2)}</p></div>
                    <div className={`${style?.Making} p-1 text-end border-black border-end`}><p>{NumberWithCommas(e?.MaKingCharge_Unit, 2)}</p></div>
                    <div className={`${style?.Total} p-1 text-end`}><p>{NumberWithCommas(e?.TotalAmount, 2)}</p></div>
                </div>
            })
            }
            {/* table total */}
            <div className={`d-flex border border-black my-1 lightGrey no_break ${style?.font_13}`}>
                <div className={`${style?.Category} p-1 border-black border-end fw-bold`}><p>TOTAL</p></div>
                <div className={`${style?.Metal} p-1 border-black border-end`}><p></p></div>
                <div className={`${style?.Hsn} p-1 border-black border-end`}><p></p></div>
                <div className={`${style?.Pcs} p-1 text-end border-black border-end fw-bold`}><p>{NumberWithCommas(data?.mainTotal?.total_Quantity, 0)}</p></div>
                <div className={`${style?.Gross} p-1 text-end border-black border-end fw-bold`}><p>{NumberWithCommas(data?.mainTotal?.grosswt, 3)}</p></div>
                <div className={`${style?.Net} p-1 text-end border-black border-end fw-bold`}><p>{NumberWithCommas(data?.mainTotal?.metal?.IsPrimaryMetal, 3)}</p></div>
                <div className={`${style?.Rate} p-1 text-end border-black border-end`}><p></p></div>
                <div className={`${style?.Making} p-1 text-end border-black border-end`}><p></p></div>
                <div className={`${style?.Total} p-1 text-end fw-bold`}><p>{NumberWithCommas(data?.mainTotal?.total_amount, 2)}</p></div>
            </div>
            {/* table taxes */}
            <div className={`border border-black my-1 lightGrey no_break ${style?.font_13}`}>
                {data?.allTaxes?.map((e, i) => {
                    return <div className="d-flex border-black border-bottom" key={i}>
                        <div className={`${style?.tax} p-1 border-black border-end fw-semibold text-end`}><p>{e?.name} @ {e?.per} </p></div>
                        <div className={`${style?.Total} p-1 text-end fw-semibold`}><p>{NumberWithCommas(+e?.amount * headerData?.CurrencyExchRate, 2)}</p></div>
                    </div>
                })}

                {headerData?.AddLess !== 0 && <div className="d-flex border-black border-bottom">
                    <div className={`${style?.tax} p-1 border-black border-end fw-semibold text-end`}><p>ADD/LESS </p></div>
                    <div className={`${style?.Total} p-1 text-end fw-semibold`}><p>{NumberWithCommas(headerData?.AddLess, 2)}</p></div>
                </div>}
                <div className="d-flex">
                    <div className={`${style?.tax} p-1 border-black border-end fw-semibold text-end`}><p>GRAND TOTAL </p></div>
                    <div className={`${style?.Total} p-1 text-end fw-semibold`}><p>{NumberWithCommas(data?.mainTotal?.total_amount + data?.allTaxes?.reduce((acc, cObj) => acc + (+cObj?.amount * headerData?.CurrencyExchRate), 0) + headerData?.AddLess, 2)}</p></div>
                </div>
            </div>
            {/* bank details */}
            <div className={`d-flex no_break border-black p-0 no_break h-100 py-0 align-items-start mb-0 border position-relative ${style?.font_13}`}>
                <div className={`col-4 border-black p-2`} style={{ width: "33.33%" }} >
                    <div className={`${footerStyle.linesf3} fw-bold`}>Payment Details</div>
                    {/* <div className="d-flex pt-1">
                        <p className='lh-1'>Cash:</p>
                        <p className='ps-1 fw-bold lh-1'>{headerData?.CashReceived}</p>
                    </div> */}
                    {
                        bank?.map((ele, ind) => {
                            return <div className="d-flex">
                                <p className='lh-1'>{ele?.BankName}</p>
                                <p className='lh-1'>{ele?.label && `(${ele?.label})`}</p>
                                <p className='pe-1 lh-1'> : </p>
                                <p className='fw-bold lh-1'>{NumberWithCommas(ele?.amount, 2)}</p>
                            </div>
                        })
                    }
                </div>
                <div className={`col-4 border-black`} style={{ width: "33.33%" }}>
                    {summary?.map((e, i) => {
                        return <div className="d-flex w-100 px-2" key={i}>
                            <div className="col-6 fw-normal">{e?.MetalTypePurity}</div>
                            <div className="col-6 fw-normal">{NumberWithCommas(e?.netWts, 3)} gm</div>
                        </div>
                    })}
                    <div className="w-100 px-2" >
                        <div className="d-flex">
                            <div className="col-6 fw-normal">Gross Wt:</div>
                            <div className="col-6 fw-normal">{NumberWithCommas(data?.mainTotal?.grosswt, 3)} gm</div>
                        </div>
                    </div>
                    <div className="w-100 px-2" >
                        <div className="d-flex">
                            <div className="col-6 fw-normal">Net Wt:</div>
                            <div className="col-6 fw-normal">{NumberWithCommas(data?.mainTotal?.netwt, 3)} gm</div>
                        </div>
                    </div>
                </div>
                <div className={`col-4`} style={{ width: "33.33%", borderRight: "1px solid #e8e8e8" }} >
                    <div className={`${footerStyle.linesf3} px-2 pt-1`} style={{ fontWeight: "bold" }}>Bank Detail</div>
                    <div className={`${footerStyle.linesf3} px-2`}>Bank Name: {headerData?.bankname}</div>
                    <div className={`${footerStyle.linesf3} px-2`}>Branch: {headerData?.bankaddress}</div>
                    <div className={`${footerStyle.linesf3} px-2`}>Account Name: {headerData?.accountname}</div>
                    <div className={`${footerStyle.linesf3} px-2`}>Account No. : {headerData?.accountnumber}</div>
                    <div className={`${footerStyle.linesf3} px-2 pb-1`}>RTGS/NEFT IFSC: {headerData?.rtgs_neft_ifsc}</div>
                </div>
                <div className="position-absolute h-100" style={{ width: "1px", background: "#000", top: "0", left: "33.33%" }}></div>
                <div className="position-absolute h-100" style={{ width: "1px", background: "#000", top: "0", right: "33.33%" }}></div>
            </div>
            {/* footer */}
            <div className={`my-1 border border-black d-flex no_break ${style?.font_13}`}>
                <div className="col-6 d-flex flex-column justify-content-between p-2 border-end border-black" style={{ minHeight: "200px" }}>
                    <p> Signature</p>
                    <p className='fw-bold'>{headerData?.customerfirmname}</p>
                </div>
                <div className="col-6 d-flex flex-column justify-content-between p-2" style={{ minHeight: "200px" }}>
                    <p> Signature</p>
                    <p className='fw-bold'>{headerData?.CompanyFullName}</p>
                </div>
            </div>
        </div>
    ) : (
        <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
            {msg}
        </p>
    );
}

export default Summary8;