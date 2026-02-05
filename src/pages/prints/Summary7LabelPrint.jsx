import React, { useEffect, useState } from 'react'
import Button from "../../GlobalFunctions/Button";
import "../../assets/css/prints/summary7labelprint.css";
import { ToWords } from 'to-words';
import * as lsh from "lodash";
import { apiCall, checkMsg, formatAmount, isObjectEmpty } from '../../GlobalFunctions';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import Loader from '../../components/Loader';
const Summary7LabelPrint = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
    const toWords = new ToWords();
    const [result, setResult] = useState(null);
    const [msg, setMsg] = useState("");
    const [loader, setLoader] = useState(true);
    const [payAbleAmount, setPayAbleAmount] = useState(0);

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
            //   setMsg(data?.Message);
            const err = checkMsg(data?.Message);
                    console.log(data?.Message);
                    setMsg(err);
            }
          } catch (error) {
            console.error(error);
          }
        };
        sendData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

    const loadData = (data) => {
        const copydata = lsh.cloneDeep(data);

        let address = copydata?.BillPrint_Json[0]?.Printlable?.split("\r\n");
        copydata.BillPrint_Json[0].address = address;
    
        const datas = OrganizeDataPrint(
          copydata?.BillPrint_Json[0],
          copydata?.BillPrint_Json1,
          copydata?.BillPrint_Json2
        );

        let finalArr = [];
        let miscHSCODE0_Wt_total = 0;
        datas?.resultArray?.forEach((e) => {
            let obj = {...e};
            let miscHSCODE0_Wt = 0;
            e?.misc?.forEach((a) => {
                miscHSCODE0_Wt += a?.Wt;
                miscHSCODE0_Wt_total += a?.Wt;
            })
            obj.miscHSCODE0_Wt = miscHSCODE0_Wt;
            finalArr.push(obj);
        })
        datas.resultArray = finalArr;
        let obj = {...datas?.mainTotal};
        obj.misc.miscHSCODE0_Wt_total  = miscHSCODE0_Wt_total;
        datas.mainTotal = obj;
        setResult(datas);

        let payableamt = 0;

        let finalAmt = (datas?.mainTotal?.total_amount + (datas?.allTaxesTotal * datas?.header?.CurrencyExchRate) + datas?.header?.AddLess);

        payableamt = finalAmt - (datas?.header?.CashReceived + datas?.header?.BankReceived);

        if(payableamt < 0){
            setPayAbleAmount(0);
        }else{
            setPayAbleAmount(payableamt);
        }

    }

  return (
    <>
       {
        loader ? <Loader /> : <>
        {
            msg === '' ? <>
            <div className='container_s7lp'>
                <div className='pb-5 mb-5 d_none_s7lp'>
                    <Button />
                </div>
                <div>
                    <div className='fw-bold fs_s7lp text-center p-1'>{result?.header?.CompanyFullName}</div>
                    <div className='fs_s7lp_All text-center px-1'>{result?.header?.CompanyAddress}</div>
                    <div className='fs_s7lp_All text-center px-1'>{result?.header?.CompanyCity} - {result?.header?.CompanyPinCode}</div>
                    <div className='fs_s7lp_All text-center px-1'>{result?.header?.Company_VAT_GST_No}</div>
                    <div className='border-black border-top border-bottom py-1 my-1 fw-bold fs_s7lp text-center px-1'>{result?.header?.PrintHeadLabel === '' ? 'TAX INVOICE' : result?.header?.PrintHeadLabel}</div>
                    <div className='d-flex fs_s7lp_All px-1'><div className='w-50'>Invoice No:</div><div className='fw-bold'>{result?.header?.InvoiceNo}</div></div>
                    <div className='d-flex fs_s7lp_All px-1'><div className='w-50'>Date:</div><div className='fw-bold'>{result?.header?.EntryDate}</div></div>
                    <div className='d-flex fs_s7lp_All px-1'><div className='w-50'>{result?.header?.HSN_No_Label}:</div><div className='fw-bold'>{result?.header?.HSN_No}</div></div>
                    <div className='d-flex fs_s7lp_All px-1'><div className='w-50'>Cashier:</div><div className='fw-bold'>{result?.header?.SalPerName?.split(" ")[0]}</div></div>
                    <div className='my-1 fs_s7lp_All border-black border-top py-1 pb-0 d-flex px-1'><div style={{width:'42%'}}>Customer Name:</div><div className='fw-bold'>{result?.header?.customerfirmname}</div></div>
                    <div className='my-1 fs_s7lp_All border-black border-bottom py-1 pt-0 d-flex px-1'><div style={{width:'42%'}}>Customer Mobile:</div><div className='fw-bold'>{result?.header?.customermobileno}</div></div>
                    <div className='table_s7lp'>
                    <div className='thead_s7lp'>
                        <div className='col1_s7lp text-center'>SR#</div>
                        <div className='col2_s7lp text-start'>Job#<br/>Design#<br />Product</div>
                        <div className='col3_s7lp text-end'>NetWt<br/>GrossWt<br />StoneWt</div>
                        <div className='col4_s7lp text-end'>QTY</div>
                        <div className='col5_s7lp text-end'>MRP</div>
                    </div>
                    <div className='tbody_s7lp'>
                        {
                            result?.resultArray?.map((e, i) => {
                                return <div className='d-flex fs_s7lp_All p-1 pgia_s7lp'>
                                <div className='col1_s7lp text-center'>{i+1}</div>
                                <div className='col2_s7lp text-start text-break'>{e?.SrJobno}<br/>{e?.designno}<br />{e?.Categoryname}</div>
                                <div className='col3_s7lp text-end'>{e?.NetWt?.toFixed(3)}<br/>{e?.grosswt?.toFixed(3)}<br />{e?.miscHSCODE0_Wt?.toFixed(3)}</div>
                                <div className='col4_s7lp text-end'>{e?.Quantity}</div>
                                <div className='col5_s7lp text-end'>{formatAmount(e?.TotalAmount)}</div>
                            </div>
                            })
                        }
                        <div className='d-flex my-1 border-black border-top border-bottom p-1'>
                            <div className='col1_s7lp text-center'></div>
                            <div className='col2_s7lp text-start fw-bold'>TOTAL</div>
                            <div className='col3_s7lp text-end'>{result?.mainTotal?.netwt?.toFixed(3)}<br/>{result?.mainTotal?.grosswt?.toFixed(3)}<br />{result?.mainTotal?.misc?.miscHSCODE0_Wt_total?.toFixed(3)}</div>
                            <div className='col4_s7lp text-end'>{result?.mainTotal?.total_Quantity}</div>
                            <div className='col5_s7lp text-end'>{formatAmount(result?.mainTotal?.total_amount)}</div>
                        </div>
                        <div className='w-100 d-flex justify-content-end align-items-center'>
                             <div className='my-1 py-1 w-75 pgia_s7lp'>
                            {
                                result?.allTaxes?.map((e, i) => {
                                    return <div className='d-flex w-100' key={i}>
                                                <div className='w-50 d-flex justify-content-end align-items-center text-break'>{e?.name} @ {e?.per}</div>
                                                <div className='w-50 d-flex justify-content-end align-items-center'>{((+e?.amount) * result?.header?.CurrencyExchRate)}</div>
                                            </div>
                                })
                            }
                                            <div className='d-flex w-100' >
                                                <div className='w-50 d-flex justify-content-end align-items-center'>{result?.header?.AddLess > 0 ? 'Add' : 'Less'}</div>
                                                <div className='w-50 d-flex justify-content-end align-items-center'>{formatAmount(result?.header?.AddLess)}</div>
                                            </div>
                            </div>
                        </div>
                        <div className='pgia_s7lp my-1 py-1 border-black border-top border-bottom w-100 d-flex justify-content-end align-items-center'>
                            <div className='w-75'>
                            <div className='d-flex w-100 fw-bold' >
                                <div className='w-50 d-flex justify-content-end align-items-center'>Final Amount:</div>
                                <div className='w-50 d-flex justify-content-end align-items-center'>Rs. {formatAmount((result?.mainTotal?.total_amount + result?.header?.AddLess + (result?.allTaxesTotal * result?.header?.CurrencyExchRate)))}</div>
                            </div>
                            <div className='d-flex w-100 ' >
                                <div className='w-50 d-flex justify-content-end align-items-center'>Cash:</div>
                                <div className='w-50 d-flex justify-content-end align-items-center'>{formatAmount((result?.header?.CashReceived))}</div>
                            </div>
                            <div className='d-flex w-100 ' >
                                <div className='w-50 d-flex justify-content-end align-items-center'>Cheque:</div>
                                <div className='w-50 d-flex justify-content-end align-items-center'>{formatAmount((result?.header?.BankReceived))}</div>
                            </div>
                            <div className='d-flex w-100 fw-bold' >
                                <div className='w-50 d-flex justify-content-end align-items-center'>Payable Amount:</div>
                                <div className='w-50 d-flex justify-content-end align-items-center'>{formatAmount(payAbleAmount)}</div>
                            </div>
                            </div>
                        </div>
                        <div className='p-1'>
                            <div className='text-break fs_s7lp_All'>In Words: {toWords?.convert(+(payAbleAmount)?.toFixed(2))} Only </div>
                        </div>
                        <div className='border-black border-top p-1 fw-bold pgia_s7lp'>
                            <div>Terms & Conditions :</div>
                            <div className='dec_s7lp' dangerouslySetInnerHTML={{__html:result?.header?.Declaration}}></div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
            </> : <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
              {msg}
            </p>
        }
        </>
       }
    </>
  )
}

export default Summary7LabelPrint