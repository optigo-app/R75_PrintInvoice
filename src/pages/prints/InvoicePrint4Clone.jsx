import React, { useEffect, useState } from 'react'
import { NumberWithCommas, apiCall, checkMsg, fixedValues, handleImageError, handlePrint, isObjectEmpty, taxGenrator } from '../../GlobalFunctions';
import Loader from '../../components/Loader';
import style from "../../assets/css/prints/invoiceprint4clone.module.css";
import { ToWords } from 'to-words';

const InvoicePrint4Clone = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {

    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [headerData, setHeaderData] = useState({});
    const [datas, setDatas] = useState([]);
    const [discription, setDiscription] = useState("Diamond studded Jewellery");
    const [another, setAnother] = useState({
        labour: 0,
        labourRate: 0,
        other: 0,
    });
    const [total, setTotal] = useState({
        totalAmount: 0,
        grandTotal: 0,
        qtyWeight: 0
    });

    const [taxes, setTaxes] = useState([]);
    const toWords = new ToWords();
    const [isImageWorking, setIsImageWorking] = useState(true);
  const handleImageErrors = () => {
    setIsImageWorking(false);
  };
    const resultAray = (arr, record) => {
        let findIndex = arr.findIndex(ele => ele?.QualityName === record?.QualityName && ele?.MasterManagement_DiamondStoneTypeid === record?.MasterManagement_DiamondStoneTypeid);
        if (findIndex === -1) {
            record.Rates = record?.Rate;
            arr.push(record);
        } else {
            if (record.amount !== 0) {
                arr[findIndex].Wt += record?.Wt;
                arr[findIndex].Amount += record?.Amount;
                if (arr[findIndex].Amount !== 0 && arr[findIndex].Wt !== 0) {
                    arr[findIndex].Rates = arr[findIndex].Amount / arr[findIndex].Wt;
                }
                else {
                    arr[findIndex].Rates = 0;
                }
            }
        }
        return arr;
    }

    const loadData = (data) => {
        setHeaderData(data?.BillPrint_Json[0]);
        let arr = [];
        let totals = { ...total };
        let metalWeight = 0;
        let diamondJewellery = false;
        let miscAmount = 0;
        data?.BillPrint_Json2.forEach((e, i) => {
            if (e?.MasterManagement_DiamondStoneTypeid === 4) {
                metalWeight += e?.Wt;
                totals.qtyWeight += e?.Wt;
                let findIndex = arr.findIndex(ele => ele?.ShapeName === e?.ShapeName && ele?.QualityName === e?.QualityName && ele?.Rate === e?.Rate && ele?.MasterManagement_DiamondStoneTypeid === e?.MasterManagement_DiamondStoneTypeid);
                if (findIndex === -1) {
                    let obj = { ...e };
                    obj.Rates = obj?.Rate;
                    arr.push(obj);
                } else {
                    arr[findIndex].Wt += e?.Wt;
                    arr[findIndex].Amount += e?.Amount;
                    if (arr[findIndex].Amount !== 0 && arr[findIndex].Wt !== 0) {
                        arr[findIndex].Rates = arr[findIndex].Amount / arr[findIndex].Wt;
                    }
                }
            } else if (e?.MasterManagement_DiamondStoneTypeid === 2 || e?.MasterManagement_DiamondStoneTypeid === 1) {
                diamondJewellery = true;
                totals.qtyWeight += e?.Wt / 5;
                let resultArr = resultAray(arr, e);
                arr = [...resultArr];
            }
            if (e?.MasterManagement_DiamondStoneTypeid === 3) {
                miscAmount += e?.Amount;
            }
        });
        !diamondJewellery && setDiscription("Gold Jewellery");
        arr.sort((a, b) => {
            if (a.MasterManagement_DiamondStoneTypeName < b.MasterManagement_DiamondStoneTypeName) {
                return 1; // a should come before b
            }
            if (a.MasterManagement_DiamondStoneTypeName > b.MasterManagement_DiamondStoneTypeName) {
                return -1; // a should come after b
            }
            return 0; // a and b are equivalent with respect to sorting
        });

        // arr.sort((a, b) => a.MasterManagement_DiamondStoneTypeName - b.MasterManagement_DiamondStoneTypeName);
        arr.forEach((e, i) => {
            if (e?.MasterManagement_DiamondStoneTypeid !== 4) {
                e.Amount = e.Amount / data?.BillPrint_Json[0]?.CurrencyExchRate
            }
        })

        setDatas(arr);
        const result = data?.BillPrint_Json1.reduce((accumulator, currentValue) => {
            return {
                MakingAmount: accumulator.MakingAmount + currentValue.MakingAmount,
                OtherCharges: accumulator.OtherCharges + currentValue.OtherCharges,
                TotalAmount: accumulator.TotalAmount + currentValue.TotalAmount
            };
        }, { MakingAmount: 0, OtherCharges: 0, TotalAmount: 0 });
        const diamondHandling = data?.BillPrint_Json1.reduce((total, element) => {
            return total + element?.TotalDiamondHandling;
        }, 0);
        let obj = {
            labour: result?.MakingAmount + miscAmount + diamondHandling,
            other: result?.OtherCharges,
            labourRate: (result?.MakingAmount / data?.BillPrint_Json[0]?.CurrencyExchRate) / metalWeight
        }

        let taxValue = taxGenrator(data?.BillPrint_Json[0], result.TotalAmount);
        const sum = taxValue.reduce((total, item) => total + +(item.amount), 0);
        let grandTotal = result.TotalAmount + sum + data?.BillPrint_Json[0]?.AddLess;
        totals.totalAmount = result.TotalAmount;
        totals.grandTotal = grandTotal;
        setTotal(totals);

        setTaxes(taxValue);
        setAnother(obj);
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
                        // setMsg("Data Not Found");
                        const err = checkMsg(data?.Message);
                        console.log(data?.Message);
                        setMsg(err);
                    }
                } else {
                    setLoader(false);
                    setMsg(data?.Message);
                }
            } catch (error) {
                console.error(error);
            }
        }
        sendData();
    }, []);

    const handleChangeDiscription = (e) => {
        setDiscription(e?.target?.value);
    }

    return (
        loader ? <Loader /> : msg === "" ? <>
            {/* print button  */}
            <div className={`d-flex justify-content-end mb-4 align-items-center pt-4 container-fluid max_width_container print_sec_sum4 ${style?.print_sec_sum4}`}>
                <div className="form-check ps-3 mt-2">
                    <input
                        type="button"
                        className="btn_white blue"
                        value="Print"
                        onClick={(e) => handlePrint(e)}
                    />
                </div>
            </div>
            <div className={`container-fluid max_width_container ${style?.invoicePrint4CloneContainer} pad_60_allPrint ${style?.pad_60_allPrint} pt-2`}>
                {/* Print Label */}
                <p className="fs-2 fw-bold text-center pb-4">{headerData?.PrintHeadLabel}</p>
                {/* Company Address */}
                <div className="d-flex">
                    <div className="col-9 px-2">
                        <p className=" pb-1"><span className='fs-4 fw-bold'>{headerData?.CompanyFullName}</span> </p>
                        <p className='pb-1'>{headerData?.CompanyAddress}, {headerData?.CompanyAddress2} {headerData?.CompanyCity} {headerData?.CompanyPinCode} {headerData?.CompanyCountry}</p>
                        <p className="pb-1"> Phone +91 {headerData?.CompanyTellNo}</p>
                        {/* <p className="pb-1">{headerData?.CompanyCity}</p> */}
                        <p className="pb-1">{headerData?.CompanyEmail}</p>
                        <p className="pb-1">{headerData?.Company_VAT_GST_No}</p>
                        {headerData?.CINNO.length !== 0 && <p className="pb-1">CIN: {headerData?.CINNO}</p>}
                    </div>
                    <div className="col-3 p-2 text-end">
                    {isImageWorking && (headerData?.PrintLogo !== "" && 
                      <img src={headerData?.PrintLogo} alt="" 
                      className='w-100 h-auto ms-auto mt-3 d-block object-fit-contain'
                      style={{maxWidth:'116px'}}
                      onError={handleImageErrors} height={120} width={150} />)}
                        {/* <img src={headerData?.PrintLogo} alt="" className={`w-100 ${style?.imageLogoInovicePrint4} d-block ms-auto`} /> */}
                    </div>
                </div>
                {/* Customer Address */}
                <div className="border d-flex mt-2">
                    <div className="col-6 p-2">
                        <p className="">{headerData?.lblBillTo}</p>
                        <p className="pb-1" style={{    fontSize: "19px"}}>{headerData?.CustName}</p>
                        <p className="">{headerData?.customerAddress1}</p>
                        {/* <p className="">{headerData?.customerAddress2}</p> */}
                        <p className="">{headerData?.customercity} {headerData?.customerpincode}</p>
                        <p className="">Phone +91 {headerData?.customermobileno.replaceAll("-", '')}</p>
                        {/* <p className="">PAN No - {headerData?.Pannumber}</p> */}
                        <p>{headerData?.vat_cst_pan}</p>
                    </div>
                    <div className="col-6 p-2">
                        <div className="col-12 ms-auto">
                            <div className="d-flex justify-content-end"><div className="fw-bold">INVOICE NO </div><div className="ps-4">{headerData?.InvoiceNo}</div></div>
                            <div className="d-flex justify-content-end"><div className="fw-bold">DATE </div><div className="ps-4">{headerData?.EntryDate}</div></div>
                        </div>

                    </div>
                </div>
                {/* Table */}
                    {/* Table Header */}
                    <div className="d-flex border mt-2">
                        <div className="col-4 p-2 border-end">
                            <p className="fs-5 fw-bold text-center">DESCRIPTION</p>
                        </div>
                        <div className="col-8 d-flex">
                            <div className="col-3 d-flex align-items-center p-2 fw-bold">DETAIL</div>
                            <div className="col-3 d-flex align-items-center justify-content-center p-2 fw-bold text-center">QTY/WEIGHT</div>
                            <div className="col-3 d-flex align-items-center justify-content-center p-2 fw-bold text-center">RATE</div>
                            <div className="col-3 d-flex align-items-center justify-content-end p-2 fw-bold text-end">AMOUNT</div>
                        </div>
                    </div>
                    {/* Table Data */}
                    <div className={`d-flex border ${style?.min_height}`}>
                        {/* <div className="col-4 p-2 border-end"> */}
                        <div className="col-4 p-2 border-end d-flex justify-content-center align-items-center flex-column">
                            <input type="text" value={discription} onChange={handleChangeDiscription} className={`${style?.invoicePrint4Input} text-center ${style?.discriptionInput}`} />
                            <p className={`pt-2 ${style?.discription}`}>{discription}</p>
                            <p className='pt-2'>HSN CODE {headerData?.HSN_No}</p>
                            {/* <p className="fs-5 text-center"> GOLD ORNAMENTS </p>
                            <p className="fs-5 text-center"> HSN CODE 7113 </p> */}
                        </div>
                        <div className="col-8">
                            <div className="d-gird h-100 pt-2">
                                {datas?.map((e, i) => {
                                    return <div className="d-flex pb-1" key={i}>
                                        <div className="col-3 px-2">{e?.MasterManagement_DiamondStoneTypeid === 4 ? `${e?.ShapeName} ${e?.QualityName}` : e?.MasterManagement_DiamondStoneTypeName}</div>
                                        <div className="col-3 px-2 text-center">{fixedValues(e?.Wt, 3)}  {e?.MasterManagement_DiamondStoneTypeid === 4 ? 'gm' : 'ctw'}</div>
                                        <div className="col-3 px-2 text-center">{e?.Rates !== 0 && NumberWithCommas(e?.Rates, 2)}</div>
                                        <div className="col-3 px-2 text-end">{e?.Amount !== 0 && NumberWithCommas(e?.Amount, 2)}</div>
                                    </div>
                                })}
                                <div className="d-flex pb-1">
                                    <div className="col-3 px-2">LABOUR</div>
                                    <div className="col-3 px-2 text-center"></div>
                                    <div className="col-3 px-2 text-center">{another?.labourRate !== 0 && NumberWithCommas(another?.labourRate, 2)}</div>
                                    <div className="col-3 px-2 text-end">{another?.labour !== 0 && NumberWithCommas(another?.labour, 2)}</div>
                                </div>
                                <div className="d-flex pb-1">
                                    <div className="col-3 px-2">OTHER</div>
                                    <div className="col-3 px-2 text-center"></div>
                                    <div className="col-3 px-2 text-center"></div>
                                    <div className="col-3 px-2 text-end">{another?.other !== 0 && NumberWithCommas(another?.other, 2)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Total */}
                    <div className="d-flex border-start border-end border-bottom">
                        <div className="col-4 p-2 border-end">
                            <p className="fs-5 text-center"> </p>
                        </div>
                        <div className="col-8">
                            <div className="d-flex pb-1">
                                <div className="col-3 p-2 fw-bold">TOTAL</div>
                                <div className="col-3 p-2 text-center">{total?.qtyWeight !== 0 && fixedValues(total?.qtyWeight, 3)}  gm</div>
                                <div className="col-3 p-2 text-center"></div>
                                <div className="col-3 p-2 text-end fw-bold">{total?.totalAmount !== 0 && NumberWithCommas(total?.totalAmount, 2)}</div>
                            </div>
                        </div>
                    </div>
                    {/* Tax Amount */}
                    <div className="d-flex border-start border-end border-bottom">
                        <div className="col-8 p-2 border-end">
                            <p className="fw-bold">Remark:</p>
                            <div className='text-break' dangerouslySetInnerHTML={{ __html: headerData?.Remark }}></div>
                        </div>
                        <div className="col-4">
                            {taxes.length > 0 && taxes.map((e, i) => {
                                return <div className="d-flex" key={i}>
                                    <div className="col-6 p-1 border-end text-end">{e?.name} @ {e?.per}</div>
                                    <div className="col-6 p-1 text-end">{+e?.amount !== 0 && e?.amount}</div>
                                </div>
                            })}
                            {headerData?.AddLess !== 0 && <div className="d-flex">
                                <div className="col-6 p-1 border-end text-end">{headerData?.AddLess < 0 ? "Less" : "Add"}</div>
                                <div className="col-6 p-1 text-end">{headerData?.AddLess}</div>
                            </div>}
                            <div className="d-flex border-top">
                                <div className="col-6 p-1 border-end text-end fw-bold">GRAND TOTAL</div>
                                <div className="col-6 p-1 text-end fw-bold">{NumberWithCommas(total?.grandTotal, 2)}</div>
                            </div>
                        </div>
                    </div>
                    {/* numbers to words */}
                    <div className="border-start border-end border-bottom p-2">
                        <p className='pb-1'>Amount Chargeable In Words</p>
                        <p className="fw-bold">Rs {toWords.convert(+fixedValues(total?.grandTotal, 2))}</p>
                    </div>
                    {/* Bank Detail */}
                    <div className='no_break'>
                        <div className={`d-flex border-start border-end border-bottom w-100`}>
                            <div className="col-4 p-2 border-end">
                                <p className="fw-bold pb-1">Bank Detail</p>
                                <p className="pb-1">Account Name: {headerData?.accountname}</p>
                                <p className="pb-1">Bank Name: {headerData?.bankname}</p>
                                <p className="pb-1">Branch: {headerData?.bankaddress}</p>
                                <p className="pb-1">Account No.: {headerData?.accountnumber}</p>
                                <p>RTGS/NEFT IFSC: {headerData?.rtgs_neft_ifsc}</p>
                            </div>
                            <div className="col-4 p-2 border-end d-flex justify-content-between flex-column">
                                <p style={{fontSize: "12px"}}>Signature</p>
                                <p className='fw-bold' style={{fontSize: "12px"}}>{headerData?.CustName}</p>
                            </div>
                            <div className="col-4 p-2 d-flex justify-content-between flex-column">
                                <p className="fw-bold" style={{fontSize: "12px"}}>For</p>
                                <p className="fw-bold" style={{fontSize: "12px"}}>{headerData?.CompanyFullName}</p>
                            </div>
                        </div>
                    </div>
            </div>


        </> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
    )
}

export default InvoicePrint4Clone