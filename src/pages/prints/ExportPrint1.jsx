import React, { useEffect, useState } from 'react';
import style from "../../assets/css/prints/exportPrint1.module.css";
import { NumberWithCommas, apiCall, checkMsg, fixedValues, handlePrint, isObjectEmpty, numberToWord } from '../../GlobalFunctions';
import Loader from '../../components/Loader';
import { ToWords } from "to-words";

const ExportPrint1 = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
    const [loader, setLoader] = useState(true);
    const [data, setData] = useState([]);
    const [json0Data, setJson0Data] = useState({});
    const [msg, setMsg] = useState("");
    const [metalArr, setMetalArr] = useState([]);
    const [grossWt, setGrossWt] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [unitCost, setUnitCost] = useState(0);
    const [isImageWorking, setIsImageWorking] = useState(true);
    const toWords = new ToWords();
    const handleImageErrors = () => {
        setIsImageWorking(false);
    };
    const loadData = (data) => {
        let arr = [];
        let metalArrs = [];
        let gross = 0;
        let totalAmt = 0;
        let unitcosts = 0;
        data?.BillPrint_Json1.forEach((e, i) => {
            let PrimaryWt = 0;
            let findingWt = 0;
            data?.BillPrint_Json2?.forEach((ele, ind) => {
                if (ele?.StockBarcode === e?.SrJobno) {
                    if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
                        if (ele?.IsPrimaryMetal === 1) {
                            PrimaryWt += ele?.Wt;
                        }
                    } else if (ele?.MasterManagement_DiamondStoneTypeid === 5) {
                        findingWt += ele?.Wt;
                    }
                }
            });
            let pureWt = (e?.NetWt - findingWt) * e?.Tunch / 100;
            unitcosts += e?.UnitCost;
            let findIndex = arr.findIndex((ele, ind) => ele?.designno === e?.designno);
            gross += e?.grosswt;
            totalAmt += e?.TotalAmount
            if (findIndex === -1) {
                let obj = { ...e };
                obj.PrimaryWt = PrimaryWt;
                obj.findingWt = findingWt;
                obj.pureWt = pureWt;
                obj.quantityPcs = 1;
                arr.push(obj);
            } else {
                arr[findIndex].grosswt += e?.grosswt;
                arr[findIndex].TotalAmount += e?.TotalAmount;
                arr[findIndex].quantityPcs += 1;
            }
            let findRecord = metalArrs.findIndex(ele => ele?.MetalPurity === e?.MetalPurity && ele?.LossPer === e?.LossPer);
            if (findRecord === -1) {
                let obj = { ...e };
                obj.PrimaryWt = e?.NetWt;
                obj.findingWt = findingWt;
                obj.pureWt = pureWt;
                obj.LossWt = ((e?.NetWt - findingWt) * e?.LossPer) / 100
                metalArrs.push(obj);
                // obj.pureWt =  e?.NetWt*e?.Tunch/100;
                // obj.PrimaryWt
                obj.metalTotalWt = obj?.pureWt + e?.LossWt;
            } else {
                // let pureWt = e?.NetWt * e?.Tunch / 100;
                metalArrs[findRecord].NetWt += e?.NetWt;
                metalArrs[findRecord].LossWt += ((e?.NetWt - findingWt) * e?.LossPer) / 100;
                // metalArrs[findRecord].metalTotalWt += pureWt + e?.LossWt;
                metalArrs[findRecord].pureWt += pureWt;
                // metalArrs[findRecord].PureNetWt += e?.PureNetWt;
                metalArrs[findRecord].PrimaryWt += e?.NetWt;
                metalArrs[findRecord].findingWt += findingWt;
            }
        });
        arr.sort((a, b) => {
            // First sort by Categoryname
            if (a.Categoryname < b.Categoryname) return -1;
            if (a.Categoryname > b.Categoryname) return 1;

            // If Categoryname is the same, then sort by MetalPurity
            if (a.MetalPurity < b.MetalPurity) return -1;
            if (a.MetalPurity > b.MetalPurity) return 1;

            // If designno is the same, then sort by MetalPurity
            if (a.designno < b.designno) return -1;
            if (a.designno > b.designno) return 1;

            return 0; // If both are equal
        });
        setUnitCost(unitcosts);
        setData(arr);
        setJson0Data(data?.BillPrint_Json[0]);
        setMetalArr(metalArrs);
        setGrossWt(gross);
        setTotalAmount(totalAmt);
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
        loader ? <Loader /> : msg === "" ? <div className={`container max_width_container pad_60_allPrint mt-2 ${style?.containerExportPrint1}`}>
            {/* print button */}
            <div className={`d-flex justify-content-end mb-4 align-items-center ${style?.print_sec_sum4} pt-4 pb-4`}>
                <div className="form-check ps-3 mt-2">
                    <input
                        type="button"
                        className="btn_white blue"
                        value="Print"
                        onClick={(e) => handlePrint(e)}
                    />
                </div>
            </div>
            {/* company address */}
            <div className="d-flex border border-black">
                <div className="col-6  border-black border-end p-1">
                    <p className='pb-1'>{json0Data?.CompanyFullName}</p>
                    <p className='pb-1'>{json0Data?.CompanyAddress}</p>
                    <p className='pb-1'>{json0Data?.CompanyAddress2},{json0Data?.CompanyCity}-{json0Data?.CompanyPinCode}</p>
                    <p className='pb-1'>T {json0Data?.CompanyTellNo}</p>
                </div>
                <div className="col-6 overflow-hidden">
                    <div className=" border-black border-bottom p-1">
                        <p>Invoice No :- {json0Data?.InvoiceNo}</p>
                        <p>Date :- {json0Data?.EntryDate}</p>
                    </div>
                    <div className="d-flex h-100">
                        <div className="col-6 p-1  border-black border-end">
                            <p className='lh-1 pb-1'>Country of origin of goods </p>
                            <p className='lh-1'>(Company's Country)</p>
                        </div>
                        <div className="col-6 p-1">
                            <p className='lh-1 pb-1'>Country of Final Destination </p>
                            <p className='lh-1'>(Customer's Country)</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* customer address */}
            <div className={`d-flex  border-black border-start border-end border-bottom`}>
                <div className={`col-6 p-1  border-black border-end ${style?.font_12}`}>
                    <p className='lh-1'>To,</p>
                    <p className={`fw-bold lh-1 ${style?.font_14}`}>{json0Data?.customerfirmname}</p>
                    <p className='lh-1'>{json0Data?.customerAddress1}</p>
                    <p className='lh-1'>{json0Data?.customerAddress2}</p>
                    <p className='lh-1'>{json0Data?.customercity}{json0Data?.customerpincode}</p>
                    <p className='lh-1'>{json0Data?.customeremail1}</p>
                    <p className='lh-1'>{json0Data?.vat_cst_pan}</p>
                    <p className='lh-1'>{json0Data?.Cust_CST_STATE}-{json0Data?.Cust_CST_STATE_No}</p>
                </div>
                <div className="col-6 p-1">
                    <p className='lh-1'>Other Refernce(s)</p>
                    <p className='lh-1'>Attn:-</p>
                    <p className='lh-1'>Buyer's Order No.& Date</p>
                </div>
            </div>
            {/* title */}
            <div className="border-black border-start border-end border-bottom p-1">
                <p className="fw-bold text-center fs-6">GOLD STUDDED JEWELLERY</p>
            </div>
            {/* table heading */}
            <div className={`d-flex  border-black border-bottom border-start border-end ${style.rowExport1}`}>
                <div className={`${style.srNoExport1}  border-black border-end`}><p className='text-center fw-bold'>Sr#</p></div>
                <div className={`${style.discriptionExport1}  border-black border-end`}><p className='text-center fw-bold'>Description</p></div>
                <div className={`${style.designExport1}  border-black border-end`}><p className='text-center fw-bold'>Design#</p></div>
                <div className={`${style.QuantityPcsExport1}  border-black border-end`}><p className='text-center fw-bold'>Quantity Pcs</p></div>
                <div className={`${style.HSNCODEExport1}  border-black border-end`}><p className='text-center fw-bold'>HSN CODE</p></div>
                <div className={`${style.GrossWtExport1}  border-black border-end`}><p className='text-center fw-bold'>Gross Wt</p></div>
                <div className={`${style.RateExport1}  border-black border-end`}><p className='text-center fw-bold'>Rate</p></div>
                <div className={`${style.AmountExport1} `}><p className='text-center fw-bold'>Amount</p></div>
            </div>
            {/* data */}
            {data && data.map((e, i) => {
                return <div className={`d-flex no_break border-black border-bottom border-start border-end ${style.rowExport1}`} key={i}>
                    <div className={`${style.srNoExport1}  border-black border-end`}><p className='text-center '>{NumberWithCommas(i + 1, 0)}</p></div>
                    <div className={`${style.discriptionExport1}  border-black border-end`}><p className=''>{e?.Categoryname} ({e?.MetalPurity})</p></div>
                    <div className={`${style.designExport1}  border-black border-end`}><p className=''>{e?.designno}</p></div>
                    <div className={`${style.QuantityPcsExport1}  border-black border-end`}><p className=''>{e?.quantityPcs} Pcs</p></div>
                    <div className={`${style.HSNCODEExport1}  border-black border-end`}><p className=''>{json0Data?.HSN_No}</p></div>
                    <div className={`${style.GrossWtExport1}  border-black border-end`}><p className='text-end '>{NumberWithCommas(e?.grosswt, 3)}</p></div>
                    <div className={`${style.RateExport1}  border-black border-end`}><p className='text-end '>{NumberWithCommas(e?.TotalAmount / e?.quantityPcs, 2)}</p></div>
                    <div className={`${style.AmountExport1} `}><p className='text-end'>{NumberWithCommas(e?.TotalAmount, 2)}</p></div>
                </div>
            })}
            {/* RMk */}
            <div className="d-flex justify-content-between pb-2 pt-2  border-black border-start border-end px-2 no_break">
                <div className="col-7 pe-4">
                    <div className=" border-black border d-flex">
                        <div className="col-2 p-1 text-center border-black border-end fw-bold">RM K</div>
                        <div className="col-2 p-1 text-center border-black border-end fw-bold">NetWt</div>
                        <div className="col-2 p-1 text-center border-black border-end fw-bold">PureWt</div>
                        <div className="col-2 p-1 text-center border-black border-end fw-bold">Loss%</div>
                        <div className="col-2 p-1 text-center border-black border-end fw-bold">LossWt</div>
                        <div className="col-2 p-1 fw-bold">Total</div>
                    </div>
                    {metalArr.length > 0 && metalArr.map((e, i) => {
                        return <div className=" border-black border-start border-end border-bottom d-flex" key={i}>
                            <div className="col-2 p-1 border-black border-end">{e?.MetalPurity}</div>
                            <div className="col-2 p-1 text-end border-black border-end">{NumberWithCommas(e?.PrimaryWt - e?.findingWt, 3)}</div>
                            <div className="col-2 p-1 text-end border-black border-end">{NumberWithCommas(e?.pureWt, 3)}</div>
                            <div className="col-2 p-1 text-end border-black border-end">{NumberWithCommas(e?.LossPer, 2)}%</div>
                            <div className="col-2 p-1 text-end border-black border-end">{NumberWithCommas(e?.LossWt, 3)}	</div>
                            <div className="col-2 p-1 text-end">{NumberWithCommas(e?.pureWt + e?.LossWt, 3)}</div>
                        </div>
                    })}
                </div>
                <div className="col-5 d-flex align-items-end">
                    <div className="w-100 border-black border d-flex">
                        <div className="col-4 d-flex align-items-center justify-content-center p-1  border-black border-end">
                            <p>{NumberWithCommas(grossWt, 3)}</p>
                        </div>
                        <div className="col-8">
                            <div className={`d-flex  border-black border-bottom ${style?.minHeight_24_8ExportPrint1}`}>
                                <div className="col-6 p-1  border-black border-end fw-bold"><p>FOB</p></div>
                                <div className="col-6 p-1 text-end"><p className='fw-bold'>{NumberWithCommas(totalAmount, 0)}</p></div>
                            </div>
                            <div className={`d-flex fw-bold border-black border-bottom ${style?.minHeight_24_8ExportPrint1}`}>
                                <div className="col-6 p-1 border-black border-end"><p>{json0Data?.ModeOfDel}</p></div>
                                <div className="col-6 p-1 text-end"><p>{NumberWithCommas(json0Data?.FreightCharges / json0Data?.CurrencyExchRate, 2)}</p></div>
                            </div>
                            <div className={`d-flex ${style?.minHeight_24_8ExportPrint1}`}>
                                <div className="col-6 p-1  border-black border-end fw-bold"><p>CFR</p></div>
                                <div className="col-6 p-1 text-end fw-bold"><p>{NumberWithCommas(totalAmount + (json0Data?.FreightCharges / json0Data?.CurrencyExchRate), 0)}</p></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* FOB */}
            <p className=' border-black border-bottom border-start border-end p-2 no_break'>FOB IN Word:  {toWords?.convert(+fixedValues(totalAmount + (json0Data?.FreightCharges / json0Data?.CurrencyExchRate), 0))}</p>
            {/* I/we hereby certify */}
            <div dangerouslySetInnerHTML={{ __html: json0Data?.Declaration }} className={`border-black border-bottom border-start border-end p-2 no_break ${style?.Declaration}`}></div>
            <div className="d-flex  border-black border-start border-end border-bottom no_break">
                {/* Bank Detail */}
                <div className="col-9 p-2  border-black border-end">
                    <p className='fw-bold'>Bank Detail</p>
                    <p>Bank Name: {json0Data?.bankname}</p>
                    <p>Branch: {json0Data?.bankaddress}</p>
                    <p>Account Name: {json0Data?.accountname}</p>
                    <p>Account No. : {json0Data?.accountnumber}</p>
                    <p>RTGS/NEFT IFSC: {json0Data?.rtgs_neft_ifsc}</p>
                    <p>Enquiry No.</p>
                    <p>(E & OE)</p>
                </div>
                {/* ORAIL SERVICE */}
                <div className="col-3 p-2">
                    <div className="d-flex h-100 justify-content-between align-items-center flex-column">
                        <p className='fw-bold'>{json0Data?.CompanyFullName}</p>
                        <p>Authorised Signature</p>
                    </div>
                </div>
            </div>
        </div> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
    )
}

export default ExportPrint1;