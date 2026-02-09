// http://localhost:3000/?tkn=OTA2NTQ3MTcwMDUzNTY1MQ==&fdate=MjAyOC0wMS0wMQ==&tdate=MjAyOC0wMS0zMQ==&evn=U2FsZXM=&pnm=c2FsZSBleGNlbCAx&up=aHR0cDovL256ZW4vam8vYXBpLWxpYi9BcHAvT3JkZXJTYWxlX0pzb24=&etp=ZXhjZWw=&ctv=NzE=

import React, { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { apiCall, checkMsg, fixedValues, formatAmount, handleImageError, isObjectEmpty, NumberWithCommas, saleTallyApiCall } from '../../GlobalFunctions';
import Loader from '../../components/Loader';

const SaleExcel1 = ({ urls, token, printName, evn, ApiVer, fdate, tdate }) => {
    const [result, setResult] = useState(null);
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");

    const hasDownloadedRef = useRef(false);
    useEffect(() => {
        if (!loader && result && !hasDownloadedRef.current) {
            const btn = document.getElementById('test-table-xls-button');
            if (btn) {
                hasDownloadedRef.current = true;
                btn.click();
            }
        }
    }, [loader, result]);

    useEffect(() => {
        const sendData = async () => {
            try {
                const data = await saleTallyApiCall(
                    urls,
                    token,
                    printName,
                    evn,
                    ApiVer,
                    fdate,
                    tdate
                );

                if (data?.Status === "200") {
                    if (data?.Status === "200") {
                        const isEmpty = isObjectEmpty(data?.Data);
                        if (!isEmpty) {
                            loadData(data?.Data);
                        } else {
                            loadData({
                                ...data?.Data,
                                BillPrint_Json: []
                            });
                        }
                        setLoader(false);
                    } else {
                        setLoader(false);
                        const err = checkMsg(data?.Message);
                        setMsg(err);
                    }
                } else {
                    loadData({
                        ...data?.Data,
                        BillPrint_Json: []
                    });
                    setLoader(false);
                    const err = checkMsg(data?.Message);
                    setMsg(err);
                }

            } catch (error) {
                console.log(error);
            }
        };
        sendData();
    }, []);

    function loadData(data) {
        setResult(data || { BillPrint_Json: [] });
        // setTimeout(() => {
        //     const button = document.getElementById('test-table-xls-button');
        //     if (button) button.click();
        // }, 300);
    }


    const FntStyl = {
        fontFamily: "calibri, sans-serif",
    }
    const txtCenter = {
        textAlign: "center",
        verticalAlign: "middle",
    };
    const brRight = {
        borderRight: "0.5px solid #000000",
    };
    const brBotm = {
        borderBottom: "0.5px solid #000000",
    };
    const brBotmThick = {
        borderBottom: "1px solid #000000",
    };
    const hdSty = {
        color: "black"
    };
    const decodedValue = atob(printName);
    const shouldHide = decodedValue !== "Invoice Excel V1";

    const isLastOfInvoice = (currentIndex) => {
        if (!result?.BillPrint_Json) return false;
        const currentInvoice = result.BillPrint_Json[currentIndex]?.InvoiceNo;
        const nextInvoice = result.BillPrint_Json[currentIndex + 1]?.InvoiceNo;
        return currentInvoice !== nextInvoice;
    };

    const getRowSpan = (currentIndex) => {
        if (!result?.BillPrint_Json) return 1;
        const currentInvoice = result.BillPrint_Json[currentIndex]?.InvoiceNo;
        let count = 1;
        for (let i = currentIndex + 1; i < result.BillPrint_Json.length; i++) {
            if (result.BillPrint_Json[i]?.InvoiceNo === currentInvoice) {
                count++;
            } else {
                break;
            }
        }
        return count;
    };

    return (
        <>
            {/* {loader ? <Loader /> : msg === "" ?
                <> */}
                 <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="download-table-xls-button btn btn-success text-black bg-success px-2 py-1 fs-5 d-none"
                    table="table-to-xls"
                    filename={shouldHide ? (`SaleExcel1${result?.header?.InvoiceNo}_${Date.now()}`) : (`SaleExcel1${result?.header?.InvoiceNo}_${Date.now()}`)}
                    sheet="tablexls"
                    buttonText="Download as XLS" />
                    {/* <table id="table-to-xls"> */}
                    <table id="table-to-xls" className='d-none'>
                        <tbody>
                            <tr>
                                <th width={80} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, ...txtCenter }}>SR NO</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, ...txtCenter }}>Invoice#</th>
                                <th width={140} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, ...txtCenter }}>Invoice Date</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, ...txtCenter }}>Customer Name</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, ...txtCenter }}>mobile no</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, ...txtCenter }}>Billing Company address</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, ...txtCenter }}>Shipping Company address</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, ...txtCenter }}>PAN CARD NO</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, ...txtCenter }}>GST NO</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, ...txtCenter }}>HSN CODE </th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, ...txtCenter }}>GROSS WEIGHT</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, ...txtCenter }}>LESS WEIGHT</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, ...txtCenter }}>NET WEIGHT</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, ...txtCenter }}>Karat Type</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, ...txtCenter }}>Net Amount</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, ...txtCenter }}>SGST</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, ...txtCenter }}>CGST</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, ...txtCenter }}>Total Amount</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, ...txtCenter }}>AMOUNT IN BANK</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, ...txtCenter }}>DATE</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, ...txtCenter }}>AMOUNT IN CASH</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, ...txtCenter }}>DATE</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, ...txtCenter }}>OLD GOLD WEIGHT</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, ...txtCenter }}>OLD SILVER WEIGHT</th>
                                <th width={100} style={{ ...hdSty, ...brRight, ...brBotm, ...FntStyl, ...txtCenter }}>OLD METAL AMOUNT</th>
                            </tr>
                            {result?.BillPrint_Json?.map((e, i) => {
                                const prevInvoiceNo = result?.BillPrint_Json[i - 1]?.InvoiceNo;
                                const isSameInvoice = prevInvoiceNo === e?.InvoiceNo;
                                const isLastRow = isLastOfInvoice(i);
                                const rowSpan = getRowSpan(i);
                                const mergedCellStyle = {
                                    ...brRight,
                                    ...brBotmThick,
                                    ...txtCenter,
                                };
                                const itemCellStyle = {
                                    ...brRight,
                                    ...txtCenter,
                                    ...(isLastRow ? brBotmThick : {})
                                };

                                return (
                                    <tr key={i}>
                                        {!isSameInvoice && (
                                            <>
                                                <td rowSpan={rowSpan} style={mergedCellStyle}>{i + 1}</td>
                                                <td rowSpan={rowSpan} style={mergedCellStyle}>{e?.InvoiceNo}</td>
                                                <td rowSpan={rowSpan} style={mergedCellStyle}>{e?.EntryDate}</td>
                                                <td rowSpan={rowSpan} style={mergedCellStyle}>{e?.CustName}</td>
                                                <td rowSpan={rowSpan} style={mergedCellStyle}>{e?.customermobileno}</td>
                                                <td rowSpan={rowSpan} style={mergedCellStyle}>{e?.CompanyCity}</td>
                                                <td rowSpan={rowSpan} style={mergedCellStyle}>{e?.customercity}</td>
                                                <td rowSpan={rowSpan} style={mergedCellStyle}>{e?.CustPanno}</td>
                                                <td rowSpan={rowSpan} style={mergedCellStyle}>{e?.CustGstNo}</td>
                                            </>
                                        )}
                                        <td style={itemCellStyle}>{e?.HSNNo}</td>
                                        <td style={itemCellStyle}>{e?.grosswt}</td>
                                        <td style={itemCellStyle}>
                                            {/* {`${(e?.diawt + e?.cswt) > 0 ? (e?.diawt + e?.cswt) + " Ct + " : ""}${e?.miscwt || 0}`} */}
                                            {(() => {
                                                const diawt = Number(e?.diawt || 0);
                                                const cswt = Number(e?.cswt || 0);
                                                const miscwt = Number(e?.miscwt || 0);

                                                const totalCt = Math.round((diawt + cswt) * 1000) / 1000;

                                                return totalCt > 0
                                                    ? `${totalCt} Ct + ${miscwt}`
                                                    : miscwt;
                                            })()}
                                        </td>

                                        <td style={itemCellStyle}>{e?.NetWt}</td>
                                        <td style={itemCellStyle}>{e?.MetalTypePurity}</td>
                                        <td style={itemCellStyle}>{e?.TotalAmount}</td>
                                        {!isSameInvoice && (
                                            <>
                                                <td rowSpan={rowSpan} style={mergedCellStyle}>{e?.TotalSGSTAmount}</td>
                                                <td rowSpan={rowSpan} style={mergedCellStyle}>{e?.TotalCGSTAmount}</td>
                                                <td rowSpan={rowSpan} style={mergedCellStyle}>{e?.FinalTotalAmount}</td>
                                                <td rowSpan={rowSpan} style={mergedCellStyle}>{e?.BankReceived}</td>
                                                <td rowSpan={rowSpan} style={mergedCellStyle}>{e?.BankReceived == 0 ? "" : e?.EntryDate}</td>
                                                <td rowSpan={rowSpan} style={mergedCellStyle}>{e?.CashReceived}</td>
                                                <td rowSpan={rowSpan} style={mergedCellStyle}>{e?.CashReceived == 0 ? "" : e?.EntryDate}</td>
                                                <td rowSpan={rowSpan} style={mergedCellStyle}>{e?.oggoldwt}</td>
                                                <td rowSpan={rowSpan} style={mergedCellStyle}>{e?.ogsilverwt}</td>
                                                <td rowSpan={rowSpan} style={mergedCellStyle}>{e?.OldGoldAmount}</td>
                                            </>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                {/* </>
                : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>} */}
        </>
    )
}

export default SaleExcel1;