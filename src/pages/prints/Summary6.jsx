import React, { useEffect, useState } from 'react';
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
import style from '../../assets/css/prints/summary6.module.css';
import Loader from "../../components/Loader";
import { ToWords } from "to-words";
import headerStyle from "../../assets/css/headers/header1.module.css";
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import { cloneDeep } from 'lodash';

const Summary6 = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [data, setData] = useState({});
    const [header, setHeader] = useState(null);
    const [headerData, setHeaderData] = useState({});
    const [address, setAddress] = useState([]);
    const [footer, setFooter] = useState(null);
    const [summary, setSummary] = useState([]);
    const toWords = new ToWords();
    const [isImageWorking, setIsImageWorking] = useState(true);
    const handleImageErrors = () => {
        setIsImageWorking(false);
    };
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
        setData(datas);
        let summaryItems = [];
        let resultArray = [];
        let metalNetWts = 0;
        datas?.resultArray?.forEach((e, i) => {
            let findRecord = summaryItems.findIndex((ele, ind) => ele?.Categoryname === e?.Categoryname && ele?.SubCategoryname === e?.SubCategoryname);
            if (findRecord === -1) {
                summaryItems.push({ Categoryname: e?.Categoryname, SubCategoryname: e?.SubCategoryname, Quantity: e?.Quantity });
            } else {
                summaryItems[findRecord].Quantity += e?.Quantity;
            }
            let obj = cloneDeep(e);
            let metalNetWt = obj?.metal?.reduce((acc, cObj) => cObj?.IsPrimaryMetal === 1 ? acc + cObj?.Wt : acc, 0);
            obj.metalNetWt = metalNetWt;
            metalNetWts += metalNetWt;
            resultArray?.push(obj);
        });
        datas.mainTotal.metalNetWt = metalNetWts;
        datas.resultArray = resultArray;
     
        setSummary(summaryItems);
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
        <div className='border-collapse p-2'>
            <table className={`container container-fluid max_width_container mt-1 ${style?.summary6} pad_60_allPrint table`} >
                <thead>
                    <tr>
                        <th className='d-flex flex-wrap pe-0 pb-0 ps-0 pt-2'>
                            <div className={`${headerStyle.headline} headerTitle w-100 ${style?.font_16} ps-2 py-3`}>{headerData?.PrintHeadLabel}</div>
                            <div className="d-flex justify-content-between w-100 align-items-center">
                                <div className={`${headerStyle.companyDetails} col-6`} style={{ minHeight: "unset" }}>
                                    <div className={`${headerStyle.companyhead} p-2`}>
                                        <div className={`${headerStyle.lines} fs-5 ${style?.font_size_19}`} style={{ fontWeight: "bold", }}>
                                            {headerData?.CompanyFullName}
                                        </div>
                                        <div className={`${headerStyle.lines} fw-normal ${style?.font_size_12_5}`}>{headerData?.CompanyAddress}</div>
                                        <div className={`${headerStyle.lines} fw-normal ${style?.font_size_12_5}`}>{headerData?.CompanyCity}-{headerData?.CompanyPinCode},{headerData?.CompanyState}({headerData?.CompanyCountry})</div>
                                        <div className={`${headerStyle.lines} fw-normal ${style?.font_size_12_5}`}>T {headerData?.CompanyTellNo} {headerData?.CompanyTollFreeNo}</div>
                                        <div className={`${headerStyle.lines} fw-normal ${style?.font_size_12_5}`}>
                                            {headerData?.CompanyEmail} | {headerData?.CompanyWebsite}
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-end align-item-center col-6">
                                    {/* <img src={headerData?.PrintLogo} alt="" className={`${headerStyle.headerImg} w-100 object-fit-contain`} style={{ maxWidth: "153.11px", maxHeight: "100px" }} /> */}
                                    {isImageWorking && (headerData?.PrintLogo !== "" &&
                                        <img src={headerData?.PrintLogo} alt=""
                                            className={`${headerStyle.headerImg} w-100 object-fit-contain`}
                                            style={{ maxWidth: "116px", maxHeight: "100px" }}
                                            onError={handleImageErrors} />)}
                                </div>
                            </div>
                        </th>
                    </tr>
                    <tr></tr>
                </thead>
                <tbody>
                    <tr>
                        <td className='border-0 pb-0'>
                            <div className={`d-flex justify-content-end align-items-center ${style?.print_sec_sum4} mb-4`} >
                                <div className="form-check ps-3">
                                    <input type="button" className="btn_white blue py-2 mt-2" value="Print" onClick={(e) => handlePrint(e)} />
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td className='pt-0 ps-0 pe-0'>
                            {/* bill info */}
                            <div className={`border d-flex justify-content-between ${style?.font_size_18}`}>
                                <div className="col-6">
                                    <p><span className="fw-bold px-2">##: </span>{headerData?.InvoiceNo}</p>
                                </div>
                                <div className="col-3 px-2">
                                    <p> <span className="fw-bold">DATE : </span> 	{headerData?.EntryDate}  </p>
                                    <p> <span className="fw-bold pe-4"> {headerData?.HSN_No_Label} :</span>	{headerData?.HSN_No}  </p>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td className='pt-0 ps-0 pe-0'>
                            {/* customer details */}
                            <div className="border-start border-end border-bottom d-flex px-2 pb-2 pt-1">
                                <div className="col-6">
                                    <p className="fw-bold fs-5">{headerData?.customerfirmname} </p>
                                    <p className={`${style?.font_size_13}`}>{headerData?.customerstreet}</p>
                                    <p className={`${style?.font_size_13}`}>{headerData?.customerregion}</p>
                                    <p className={`${style?.font_size_13}`}>{headerData?.customercity} </p>
                                    <p className={`${style?.font_size_13}`}>{headerData?.customermobileno}</p>
                                    <p className={`${style?.font_size_13}`}>{headerData?.CustGstNo !== "" && `GSTIN-${headerData?.CustGstNo}`}
                                        {(headerData?.CustGstNo === "" && headerData?.Cust_VAT_GST_No !== "") && `VAT-${headerData?.Cust_VAT_GST_No}`}
                                        {headerData?.Cust_CST_STATE_No !== "" && ` | ${headerData?.Cust_CST_STATE}: ${headerData?.Cust_CST_STATE_No}`}
                                        {headerData?.CustPanno !== "" && ` | PAN- ${headerData?.CustPanno}`}</p>
                                    <div className="col-6"></div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    {/* table header */}
                    <tr>
                        <td className={`p-0 border ${style?.wordBreak}`}>
                            <div className="d-flex">
                                <div className={`${style?.sr} border-end fw-bold text-uppercase text-center p-1`}>sr#
                                </div>
                                <div className={`${style?.design} border-end fw-bold text-uppercase text-center p-1`}>designs / code
                                </div>
                                <div className={`${style?.metal} border-end fw-bold text-uppercase text-center p-1`}>metal
                                </div>
                                <div className={`${style?.gwt} border-end fw-bold text-uppercase text-center p-1`}>gwt
                                </div>
                                <div className={`${style?.nwt} border-end fw-bold text-uppercase text-center p-1`}>nwt
                                </div>
                                <div className={`${style?.dpcs} border-end fw-bold text-uppercase text-center p-1`}>dpcs
                                </div>
                                <div className={`${style?.dwt} border-end fw-bold text-uppercase text-center p-1`}>dwt
                                </div>
                                <div className={`${style?.cspcs} border-end fw-bold text-uppercase text-center p-1`}>cspcs
                                </div>
                                <div className={`${style?.cswt} border-end fw-bold text-uppercase text-center p-1`}>cswt
                                </div>
                                <div className={`${style?.order} border-end fw-bold text-uppercase text-center p-1`}>other
                                </div>
                                <div className={`${style?.total} fw-bold text-uppercase text-center p-1`}>total
                                </div>
                            </div>
                        </td>
                    </tr>
                    {/* table data */}
                    {
                        data?.resultArray.map((e, i) => {
                            return <tr key={i} className={`${style?.font_size_10} ${style?.wordBreak}`}>
                                <td className='p-0 border'>
                                    <div className="d-flex " key={i}>
                                        <div className={`${style?.sr} border-end d-flex align-items-center justify-content-center`}>{i + 1}
                                        </div>
                                        <div className={`${style?.design} border-end d-flex justify-content-between p-1  align-items-center`}>
                                            <div>
                                                <img src={e?.DesignImage} alt="" className='imgWidth2' onError={handleImageError} />
                                            </div>
                                            <div className='text-center'>
                                                <p className='fw-bold'>{e?.designno}</p>
                                                <p className={`border-top ${style?.bottomLine}`}>{e?.SrJobno}</p>
                                            </div>
                                        </div>
                                        <div className={`${style?.metal} border-end d-flex align-items-center p-1`}>{e?.MetalTypePurity}
                                        </div>
                                        <div className={`${style?.gwt} border-end p-1 d-flex align-items-center justify-content-end`}>{NumberWithCommas(e?.grosswt, 3)}
                                        </div>
                                        <div className={`${style?.nwt} border-end p-1 d-flex align-items-center justify-content-end`}>{NumberWithCommas(e?.metalNetWt, 3)}
                                        </div>
                                        <div className={`${style?.dpcs} border-end p-1 d-flex align-items-center justify-content-end`}>{NumberWithCommas(e?.totals?.diamonds?.Pcs, 0)}
                                        </div>
                                        <div className={`${style?.dwt} border-end p-1 d-flex align-items-center justify-content-end`}>{NumberWithCommas(e?.totals?.diamonds?.Wt, 3)}
                                        </div>
                                        <div className={`${style?.cspcs} border-end p-1 d-flex align-items-center justify-content-end`}>{NumberWithCommas(e?.totals?.colorstone?.Pcs, 0)}
                                        </div>
                                        <div className={`${style?.cswt} border-end p-1 d-flex align-items-center justify-content-end`}>{NumberWithCommas(e?.totals?.colorstone?.Wt, 3)}
                                        </div>
                                        <div className={`${style?.order} border-end p-1 d-flex align-items-center justify-content-end`}>{NumberWithCommas((e?.OtherCharges + e?.MiscAmount + e?.TotalDiamondHandling) / headerData?.CurrencyExchRate, 2)}
                                        </div>
                                        <div className={`${style?.total} p-1 d-flex align-items-center justify-content-end`}><span dangerouslySetInnerHTML={{ __html: headerData?.Currencysymbol }}></span> {NumberWithCommas(e?.TotalAmount / headerData?.CurrencyExchRate, 2)}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        })
                    }
                    {/* table total */}

                    <tr>
                        <td className={`p-0 border ${style?.font_size_13} ${style?.wordBreak}`}>
                            <div className="d-flex">
                                <div className={`${style?.sr} text-center`}>
                                </div>
                                <div className={`${style?.design} p-1 d-flex justify-content-center align-items-center`}>
                                    <p className="text-center fw-bold">Total</p>
                                </div>
                                <div className={`${style?.metal} border-end d-flex align-items-center p-1`}>
                                </div>
                                <div className={`${style?.gwt} border-end p-1 text-end fw-bold`}>{NumberWithCommas(data?.mainTotal?.grosswt, 3)}
                                </div>
                                <div className={`${style?.nwt} border-end p-1 text-end fw-bold`}>{NumberWithCommas(data?.mainTotal?.metalNetWt, 3)}
                                </div>
                                <div className={`${style?.dpcs} border-end p-1 text-end fw-bold`}>{NumberWithCommas(data?.mainTotal?.diamonds?.Pcs, 0)}
                                </div>
                                <div className={`${style?.dwt} border-end p-1 text-end fw-bold`}>{NumberWithCommas(data?.mainTotal?.diamonds?.Wt, 3)}
                                </div>
                                <div className={`${style?.cspcs} border-end p-1 text-end fw-bold`}>{NumberWithCommas(data?.mainTotal?.colorstone?.Pcs, 3)}
                                </div>
                                <div className={`${style?.cswt} border-end p-1 text-end fw-bold`}>{NumberWithCommas(data?.mainTotal?.colorstone?.Wt, 3)}
                                </div>
                                <div className={`${style?.order} border-end p-1 text-end fw-bold`}>{NumberWithCommas(data?.mainTotal?.total_otherCharge_Diamond_Handling / headerData?.CurrencyExchRate, 2)}
                                </div>
                                <div className={`${style?.total} p-1 text-end fw-bold`}><span dangerouslySetInnerHTML={{ __html: headerData?.Currencysymbol }}></span> {NumberWithCommas(data?.mainTotal?.total_amount / headerData?.CurrencyExchRate, 2)}
                                </div>
                            </div>
                        </td>
                    </tr>
                    {/* taxes */}
                    <tr>
                        <td className='p-0 border'>
                            <div className="">
                                <div className={`d-flex border-bottom p-1 ${style?.font_size_13}`}>
                                    <div className={`${style?.taxWords} text-center border-end`}>
                                    </div>
                                    <div className={`${style?.tax} p-1`}>
                                        {data?.allTaxes.map((e, i) => {
                                            return <div className="d-flex justify-content-between" key={i}>
                                                <p>{e?.name} @ {e?.per}</p>
                                                <p>{NumberWithCommas(e?.amount, 2)}</p>
                                            </div>
                                        })}
                                        {
                                            headerData?.AddLess !== 0 && <div className="d-flex justify-content-between fw-bold">
                                                <p className='fw-bold'>{headerData?.AddLess > 0 ? "Add" : "Less"}</p>
                                                <p className='fw-bold'>{NumberWithCommas(headerData?.AddLess, 2)}</p>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className="d-flex p-1">
                                    <div className={`${style?.taxWords} border-end d-flex align-items-center fw-bold ${style?.font_size_12}`}>
                                        <p className='fw-bold'>  {toWords.convert(+fixedValues((data?.mainTotal?.total_amount / headerData?.CurrencyExchRate) + data?.allTaxes?.reduce((acc, cObj) => acc + +cObj?.amount, 0) + headerData?.AddLess, 2))} Only	</p>
                                    </div>
                                    <div className={`${style?.tax} p-1 ${style?.font_size_14}`}>
                                        <div className="d-flex justify-content-end fw-bold">
                                            <p className='fw-bold'>Grand Total :</p>
                                            <p className='fw-bold'> <span dangerouslySetInnerHTML={{ __html: headerData?.Currencysymbol }}></span> {NumberWithCommas((data?.mainTotal?.total_amount / headerData?.CurrencyExchRate) + data?.allTaxes?.reduce((acc, cObj) => acc + +cObj?.amount, 0) + headerData?.AddLess, 2)}/-  </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    {/* Summary Detail */}
                    <tr>
                        <td className='p-0 border my-1'>
                            <div>
                                <p className={`lightGrey fw-bold p-1 border-bottom ${style?.font_size_15}`}> Summary Detail </p>
                                <div className={`${style?.d_grid} flex-wrap p-1 d-grid`}>

                                    {summary.map((e, i) => {
                                        return <div className={`d-flex ${style?.font_size_12_5}`} key={i}>
                                            <div className="col-7">{e?.Categoryname} | {e?.SubCategoryname}</div>
                                            <div className="col-1">:</div>
                                            <div className="col-4 fw-bold">{e?.Quantity}</div>
                                        </div>
                                    })}
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr className=''>
                        <td className='p-0 pt-1 border-0'>
                            {headerData?.PrintRemark !== "" && <p className={`${style?.font_size_14}`}><span className="fw-bold">REMARKS IF ANY :</span> <span dangerouslySetInnerHTML={{__html:headerData?.PrintRemark}}></span></p>}
                            <p className={`preText pt-1 border-0 ${style?.font_size_12}`} style={{ letterSpacing: "0px" }}><span className='pe-2'>** </span> THIS IS A COMPUTER GENERATED INVOICE AND KINDLY NOTIFY US IMMEDIATELY IN CASE YOU FIND ANY DISCREPANCY IN THE DETAILS OF TRANSACTIONS</p>
                        </td>
                    </tr>
                </tbody>
            </table >
        </div>
    ) : (
        <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
            {msg}
        </p>
    );
}

export default Summary6;