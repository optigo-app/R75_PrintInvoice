import React, { useEffect, useState } from 'react'
import style from "../../assets/css/prints/RetailPrint2.module.css";
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
    checkMsg,
} from "../../GlobalFunctions";
import style1 from "../../assets/css/headers/header1.module.css";
import ImageComponent from "../../components/ImageComponent ";

const RetailPrint2 = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
    const [msg, setMsg] = useState("");
    const [loader, setLoader] = useState(true);
    const toWords = new ToWords();
    const [data, setData] = useState({});
    const [label, setlabel] = useState([]);
    const [headerData, setHeaderData] = useState({});
    const [header, setHeader] = useState(null);
    const [footer, setFooter] = useState(null);
    const [document, setDocument] = useState({
        aadharcard: "",
        nri: "",
        passport: "",
    });
    const [isImageWorking, setIsImageWorking] = useState(true);
    const [logoStyle, setlogoStyle] = useState({ maxWidth: "120px", maxHeight: "95px", minHeight: "95px" });
    const handleImageErrors = () => {
        setIsImageWorking(false);
    };
    const loadData = (data) => {
        let head = HeaderComponent("1", data?.BillPrint_Json[0]);
        setHeader(head);
        let footers = FooterComponent("2", data?.BillPrint_Json[0]);
        setFooter(footers);
        setHeaderData(data?.BillPrint_Json[0]);
        let printArr = data?.BillPrint_Json[0]?.Printlable.split("\r\n");
        setlabel(printArr);
        let datas = OrganizeDataPrint(data?.BillPrint_Json[0], data?.BillPrint_Json1, data?.BillPrint_Json2);
        let resultArray = [];
        let discountPercentages = 0
        datas?.resultArray?.map((e, i) => {
            let obj = cloneDeep(e);
            let RMwt = 0;
            let discountPercentage = e?.DiscountAmt * 100 / e?.UnitCost;
            discountPercentages += discountPercentage;
            let diamonds = [];
            obj?.diamonds?.forEach((ele, ind) => {
                RMwt += ele?.RMwt;
                let findDiamond = diamonds?.findIndex((elem, index) => elem?.QualityName === ele?.QualityName);
                if (findDiamond === -1) {
                    diamonds.push(ele);
                } else {
                    diamonds[findDiamond].Pcs += ele?.Pcs;
                    diamonds[findDiamond].Wt += ele?.Wt;
                    diamonds[findDiamond].Amount += ele?.Amount;
                }
            });
            diamonds?.sort((a, b) => {
                const compareLabel1 = a.QualityName.localeCompare(b.QualityName);
                if (compareLabel1 !== 0) {
                    return compareLabel1;
                }

                const getNumber = (str) => parseInt(str.match(/\d+/) || 0);
                const numA = getNumber(a.Colorname);
                const numB = getNumber(b.Colorname);
                if (numA !== numB) {
                    return numA - numB;
                }

                return 0;
            })
            obj.quaDia = diamonds;
            obj.RMwt = RMwt;
            obj.discountPercentage = discountPercentage;
            resultArray.push(obj);
        });
        datas.resultArray = resultArray;
        datas.mainTotal.discountPercentages = discountPercentages;

        setData(datas);
        let documentDetails = data?.BillPrint_Json[0]?.DocumentDetail.split("#@#");
        let documents = {
            aadharcard: "",
            nri: "",
            passport: "",
        };
        documentDetails?.forEach((e, i) => {
            let data = e?.split("#-#");
            if (data[0] === "Aadhar Card") {
                documents.aadharcard = data[1];
            } else if (data[0] === "NRI ID") {
                documents.nri = data[1];
            } else if (data[0] === "FOREIGN PASSPORT") {
                documents.passport = data[1];
            }
        });
        setDocument(documents);
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
            <div className={`container max_width_container ${style?.retailPrint2} pad_60_allPrint px-1 mt-1 retailPrint2`}>
                {/* buttons */}
                <div className="d-flex justify-content-end align-items-center print_sec_sum4 mb-4 mt-4">
                    <div className="form-check ps-3">
                        <input type="button" className="btn_white blue py-2" value="Print" style={{ fontSize: "14px" }} onClick={(e) => handlePrint(e)} />
                    </div>
                </div>
                {/* header */}
                {/* {header} */}
                <div className={`${style1.headline} headerTitle target_header`}>{headerData?.PrintHeadLabel}</div>
                <div className={`${style1.companyDetails} ${style?.target_header}`}>
                    <div className={`${style1.companyhead} p-2 ${style?.headerPara} ${style?.headerPara}`}>
                        <div className={style1.lines} style={{ fontWeight: "bold", fontSize: "16px" }}>
                            {headerData?.CompanyFullName}
                        </div>
                        <div className={style1.lines}>{headerData?.CompanyAddress}</div>
                        <div className={style1.lines}>{headerData?.CompanyAddress2}</div>
                        <div className={style1.lines}>{headerData?.CompanyCity}-{headerData?.CompanyPinCode},{headerData?.CompanyState}({headerData?.CompanyCountry})</div>
                        {/* <div className={style.lines}>Tell No: {headerData?.CompanyTellNo}</div> */}
                        <div className={style1.lines}>T {headerData?.CompanyTellNo} {headerData?.CompanyTollFreeNo !== "" && ` | TOLL FREE ${headerData?.CompanyTollFreeNo}`}</div>
                        <div className={style1.lines}>
                            {headerData?.CompanyEmail}  {headerData?.CompanyWebsite}
                        </div>
                        <div className={style1.lines}>
                            {/* {headerData?.Company_VAT_GST_No} | {headerData?.Company_CST_STATE}-{headerData?.Company_CST_STATE_No} | PAN-{headerData?.Pannumber} */}
                            {headerData?.Company_VAT_GST_No} | {headerData?.Company_CST_STATE}-{headerData?.Company_CST_STATE_No} | PAN-{headerData?.Pannumber}
                        </div>
                        {headerData?.Com_CINNO !== "" && <div className={style1.lines}>
                            CIN-{headerData?.Com_CINNO}
                        </div>}
                        {headerData?.Com_GoldDealershipRefNo !== "" && <div className={style1.lines}>
                            {headerData?.Com_GoldDealershipRefNo}
                        </div>}


                    </div>
                    <div style={{ width: "30%" }} className="d-flex justify-content-end align-item-center h-100">
                        <ImageComponent imageUrl={headerData?.PrintLogo} styles={logoStyle} />
                        {/* <img src={data?.PrintLogo} alt="" className={style.headerImg} /> */}
                    </div>
                </div>
                {/* sub header */}
                <div className={`d-flex border ${style?.subHeader} ${style?.headerPara}`}>
                    <div className="col-4 border-end p-2">
                        <p>
                            {/* {headerData?.lblBillTo}  */}
                            To, {headerData?.customerfirmname}</p>
                        <p>Address: {headerData?.customerAddress1}</p>
                        <p>{headerData?.customerAddress2}</p>
                        <p>{headerData?.customercity}{headerData?.customerpincode}</p>
                        <p>{headerData?.customeremail1}</p>
                        <p>Phno:{headerData?.customermobileno}</p>
                        <p>{headerData?.vat_cst_pan}</p>
                        <p>{headerData?.Cust_CST_STATE_No_}</p>
                    </div>
                    <div className="col-4 border-end p-2">
                        <p>Shipping Address</p>
                        <p>Address: {headerData?.CustName}</p>
                        <p>{headerData?.customerstreet}</p>
                        <p>{headerData?.customercity1}, {headerData?.customerstate}</p>
                        <p>{headerData?.customercountry}{headerData?.customerpincode}</p>
                        <p>Mobile No : {headerData?.customermobileno}</p>
                        <p>Email : {headerData?.customeremail1}</p>
                    </div>
                    <div className="col-4 p-2">
                        <div className="d-flex">
                            <div className="col-6"><p className="fw-bold"> Tax Invoice No:</p></div>
                            <div className="col-6"><p>: {headerData?.InvoiceNo}</p></div>
                        </div>
                        <div className="d-flex">
                            <div className="col-6"><p className="fw-bold">Date	</p></div>
                            <div className="col-6"><p> : {headerData?.EntryDate}</p></div>
                        </div>
                        <div className="d-flex">
                            <div className="col-6"><p className="fw-bold">{headerData?.HSN_No_Label}/SAC</p></div>
                            <div className="col-6"><p>	: {headerData?.HSN_No}</p></div>
                        </div>
                        <div className="d-flex">
                            <div className="col-6"><p className="fw-bold">Due Date</p></div>
                            <div className="col-6"><p>: {headerData?.DueDate}</p></div>
                        </div>
                    </div>
                </div>
                {/* table header  */}
                <div className="d-flex mt-1 border">
                    <div className={`d-flex justify-content-center align-items-center ${style?.Sr} border-end`}><p className='p-1 fw-bold text-center'>Sr#	</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.Item} border-end`}><p className='p-1 fw-bold text-center'>Item Name	</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.Product} border-end`}><p className='p-1 fw-bold text-center'>Product Design	</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.Design} border-end`}><p className='p-1 fw-bold text-center'>Design No	</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.QR} border-end`}><p className='p-1 fw-bold text-center'>QR Code	</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.Certificate} border-end`}><p className='p-1 fw-bold text-center ' style={{ wordBreak: "normal" }}>Certificate No IGI & BIS</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.Metal} border-end`}><p className='p-1 fw-bold text-center'>Metal Details	</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.Gross} border-end`}><p className='p-1 fw-bold text-center'>Gross Wt	</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.Less} border-end`}><p className='p-1 fw-bold text-center'>Less Wt	</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.Net} border-end`}><p className='p-1 fw-bold text-center'>Net Wt	</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.DiaQuality} border-end`}><p className='p-1 fw-bold text-center'>Dia Quality	</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.DiaColor} border-end`}><p className='p-1 fw-bold text-center'>Dia Color	</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.DiaPcs} border-end`}><p className='p-1 fw-bold text-center'>Dia Pcs	</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.DiaWt} border-end`}><p className='p-1 fw-bold text-center'>Dia Wt	</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.MRP} border-end`}><p className='p-1 fw-bold text-center'>MRP		</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.discountPer} border-end`}><p className='p-1 fw-bold text-center'> Dis %		</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.DisAmt} border-end`}><p className='p-1 fw-bold text-center'>Dis Amt	</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.TotalAmount} `}><p className='p-1 fw-bold text-center'>Total Amount</p></div>
                </div>
                {/* table body */}
                {
                    data?.resultArray?.map((e, i) => {
                        return <div className={`d-flex border-start border-end border-bottom no_break ${style?.word_break}`} key={i}>
                            <div className={`d-flex justify-content-center align-items-center ${style?.Sr} border-end`}><p className='p-1 text-center text-break'>{NumberWithCommas(i + 1)}</p></div>
                            <div className={`d-flex justify-content-center align-items-center ${style?.Item} border-end`}><p className='p-1 text-center text-break'>{e?.Categoryname}</p></div>
                            <div className={`d-flex justify-content-center align-items-center ${style?.Product} border-end`}><p className='p-1 text-center'><img className='imgWidth' src={e?.DesignImage} alt="" onError={handleImageError} />	</p></div>
                            <div className={`d-flex justify-content-center align-items-center ${style?.Design} border-end`}><p className='p-1 text-center text-break'>{e?.designno}	</p></div>
                            <div className={`d-flex justify-content-center align-items-center ${style?.QR} border-end`}><p className='p-1 text-center text-break'>{e?.SrJobno}	</p></div>
                            <div className={`d-flex justify-content-center align-items-center ${style?.Certificate} border-end`}><p className='p-1 text-center text-break'>{e?.CertificateNo}	</p></div>
                            <div className={`d-flex justify-content-center align-items-center ${style?.Metal} border-end`}><p className='p-1 text-center text-break'>{e?.MetalTypePurity}</p></div>
                            <div className={`d-flex justify-content-center align-items-center ${style?.Gross} border-end`}><p className='p-1 text-center text-break'>{NumberWithCommas(e?.grosswt, 3)}</p></div>
                            <div className={`d-flex justify-content-center align-items-center ${style?.Less} border-end`}><p className='p-1 text-center text-break'>{NumberWithCommas(e?.totals?.diamonds?.Wt / 5, 3)}</p></div>
                            <div className={`d-flex justify-content-center align-items-center ${style?.Net} border-end`}><p className='p-1 text-center text-break'>{NumberWithCommas(e?.NetWt, 3)}</p></div>
                            <div className={`d-flex justify-content-center align-items-center flex-column ${style?.DiaQuality} border-end`}>
                                {e?.quaDia?.map((ele, ind) => {
                                    return <p className='p-1 text-center' key={ind}>{ele?.QualityName} </p>
                                })}
                            </div>
                            <div className={`d-flex justify-content-center align-items-center flex-column ${style?.DiaColor} border-end`}>
                                {e?.quaDia?.map((ele, ind) => {
                                    return <p className='p-1 text-center' key={ind}>{ele?.Colorname} </p>
                                })}</div>
                            <div className={`d-flex justify-content-center align-items-center ${style?.DiaPcs} border-end`}>
                                <p className='p-1 text-center'>{NumberWithCommas(e?.totals?.diamonds?.Pcs, 0)} </p>
                            </div>
                            <div className={`d-flex justify-content-center align-items-center ${style?.DiaWt} border-end`}><p className='p-1 text-center'>{NumberWithCommas(e?.totals?.diamonds?.Wt, 2)}	</p></div>
                            <div className={`d-flex justify-content-center align-items-center ${style?.MRP} border-end`}><p className='p-1 text-center'>{NumberWithCommas(e?.UnitCost, 2)}</p></div>
                            <div className={`d-flex justify-content-center align-items-center ${style?.discountPer} border-end`}><p className='p-1 text-center'>{NumberWithCommas(e?.discountPercentage, 2)}</p></div>
                            <div className={`d-flex justify-content-center align-items-center ${style?.DisAmt} border-end`}><p className='p-1 text-center'>{NumberWithCommas(e?.DiscountAmt, 2)}</p></div>
                            <div className={`d-flex justify-content-center align-items-center ${style?.TotalAmount} `}><p className='p-1 text-center'>{NumberWithCommas(e?.TotalAmount, 2)}</p></div>
                        </div>
                    })
                }
                {/* table total */}
                <div className={`d-flex border-start border-end border-bottom no_break ${style?.word_break}`}>
                    <div className={`d-flex justify-content-center align-items-center ${style?.Sr} border-end`}><p className='p-1 text-center'>		</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.Item} border-end`}><p className='p-1 text-center fw-bold'>TOTAL		</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.Product} border-end`}><p className='p-1 text-center'></p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.Design} border-end`}><p className='p-1 text-center'>	</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.QR} border-end`}><p className='p-1 text-center'></p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.Certificate} border-end`}><p className='p-1 text-center'>	</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.Metal} border-end`}><p className='p-1 text-center'>	</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.Gross} border-end`}><p className='p-1 text-center fw-bold'>{NumberWithCommas(data?.mainTotal?.grosswt, 3)}</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.Less} border-end`}><p className='p-1 text-center'>	</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.Net} border-end`}><p className='p-1 text-center fw-bold'>{NumberWithCommas(data?.mainTotal?.netwt, 3)}</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.DiaQuality} border-end`}><p className='p-1 text-center'></p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.DiaColor} border-end`}><p className='p-1 text-center'></p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.DiaPcs} border-end`}><p className='p-1 text-center'>	</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.DiaWt} border-end`}><p className='p-1 text-center fw-bold'>{NumberWithCommas(data?.mainTotal?.diamonds?.Wt, 2)}</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.MRP} border-end`}><p className='p-1 text-center fw-bold'>{NumberWithCommas(data?.mainTotal?.total_unitcost, 2)}</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.discountPer} border-end`}><p className='p-1 text-center fw-bold'>{NumberWithCommas(data?.mainTotal?.discountPercentages, 2)}</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.DisAmt} border-end`}><p className='p-1 text-center fw-bold'>{NumberWithCommas(data?.mainTotal?.total_discount_amount, 2)}</p></div>
                    <div className={`d-flex justify-content-center align-items-center ${style?.TotalAmount} `}><p className='p-1 text-center fw-bold'>{NumberWithCommas(data?.mainTotal?.total_amount, 2)}</p></div>
                </div>
                {/* bank details */}
                <div className="my-1 border d-flex no_break">
                    <div className="col-4 border-end p-2">
                        <p>Value in Words:</p>
                        <p className='fw-bold'>{toWords?.convert(+fixedValues(data?.mainTotal?.total_amount +
                            data?.allTaxes?.reduce((acc, cObj) => acc + (+cObj?.amount * headerData?.CurrencyExchRate), 0) + headerData?.AddLess, 2))} only</p>
                    </div>
                    <div className="col-4 border-end p-2">
                        <p className='fw-bold'>Bank Details :</p>
                        <p>Bank Name: {headerData?.bankname}</p>
                        <p>Branch: {headerData?.bankaddress}</p>
                        <p>Account Name:{headerData?.accountname}</p>
                        <p>Account No. :{headerData?.accountnumber}</p>
                        <p>RTGS/NEFT IFSC:{headerData?.rtgs_neft_ifsc}</p>
                    </div>
                    <div className="col-4 p-2">
                        <div className="d-flex justify-content-between flex-column h-100">
                            <div>
                                {
                                    data?.allTaxes?.map((e, i) => {
                                        return <p className='d-flex justify-content-between' key={i}><span>{e?.name} @ {e?.per} </span><span> {NumberWithCommas(+e?.amount * headerData?.CurrencyExchRate, 2)}</span></p>
                                    })
                                }
                                {headerData?.AddLess !== 0 && <p className='d-flex justify-content-between'><span>{headerData?.AddLess > 0 ? "Add" : "Less"} </span><span> {NumberWithCommas(headerData?.AddLess, 2)}</span></p>}
                                <p className='fw-bold d-flex justify-content-between'><span>Bill Amt    </span><span> {NumberWithCommas(data?.mainTotal?.total_amount +
                                    data?.allTaxes?.reduce((acc, cObj) => acc + (+cObj?.amount * headerData?.CurrencyExchRate), 0) + headerData?.AddLess, 2)}</span></p>

                            </div>
                            <div>
                                <p className='fw-bold d-flex justify-content-between'><span>Grand Total </span><span> {NumberWithCommas(data?.mainTotal?.total_amount +
                                    data?.allTaxes?.reduce((acc, cObj) => acc + (+cObj?.amount * headerData?.CurrencyExchRate), 0) + headerData?.AddLess, 2)}</span></p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* signature */}
                <div className="border my-1 d-flex no_break">
                    <div className="col-4 d-flex justify-content-between flex-column p-2 border-end">
                        <p className='pb-4'>Signature-Stamp</p>
                        <p className="fw-bold pt-4">{headerData?.customerfirmname}</p>
                    </div>
                    <div className="col-4 d-flex justify-content-between flex-column p-2 border-end"></div>
                    <div className="col-4 d-flex justify-content-between flex-column p-2">
                        <p className='pb-4'>Signature-Stamp</p>
                        <p className="fw-bold pt-4">{headerData?.CompanyFullName}</p>
                    </div>
                </div>
            </div>
            {/* <SampleDetailPrint11 /> */}
        </> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
    )
}

export default RetailPrint2
