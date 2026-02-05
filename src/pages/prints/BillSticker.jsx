import React from 'react'
import { useState } from 'react';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import { apiCall, checkMsg, isObjectEmpty } from '../../GlobalFunctions';
import { useEffect } from 'react';
import Loader from '../../components/Loader';
import BarcodeGenerator from '../../components/BarcodeGenerator';
import "../../assets/css/prints/billsticker.css";
import Button from './../../GlobalFunctions/Button';

const BillSticker = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {

    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [result, setResult] = useState({});

    useEffect(() => {
        const sendData = async () => {
          try {
            const data = await apiCall( token, invoiceNo, printName, urls, evn, ApiVer );
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
            console.log(error);
          }
        };
        sendData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      async function loadData(data) {
        let address = data?.BillPrint_Json[0]?.Printlable?.split("\r\n");
        data.BillPrint_Json[0].address = address;
  
        const datas = OrganizeDataPrint(
          data?.BillPrint_Json[0],
          data?.BillPrint_Json1,
          data?.BillPrint_Json2
        );

        setResult(datas);
          
      }

  return (
    <>  
    {
        loader ? <Loader /> : <>
        {
            msg === '' ? <>
            <div className='d-flex justify-content-start align-items-center p-2 hide_bs' style={{marginLeft:'12%'}}><Button /></div>
            <div className='container_elv text-break m-2'>
            <div className="barcode_elv"> 
              {result?.resultArray[0]?.PO !== undefined && (
                <BarcodeGenerator data={result?.resultArray[0]?.PO} />
              )}
            </div>
            <div className="num_elv">{result?.resultArray[0]?.PO}</div>
            <div className="row_elv">
                <div className="fs_elv w50_elv">ERPDN : </div>
                <div className="fs_elv end_elv w50_elv">{result?.resultArray[0]?.MFG_DesignNo}</div>
            </div>
            <div className="row_elv">
                <div className="fs_elv w50_elv">PDT : </div>
                <div className="fs_elv end_elv w50_elv">{result?.resultArray[0]?.Categoryname}</div>
            </div>
            <div className="row_elv">
                <div className="fs_elv w50_elv text-break">DESIGN NO : </div>
                <div className="fs_elv end_elv w50_elv text-break">{result?.resultArray[0]?.designno}</div>
            </div>
            <div className="row_elv">
                <div className="fs_elv w50_elv">SIZE : </div>
                <div className="fs_elv end_elv w50_elv text-break">{result?.resultArray[0]?.Size}</div>
            </div>
            <div className="row_elv">
                <div className="fs_elv w50_elv">QTY : </div>
                <div className="fs_elv end_elv w50_elv text-break">{result?.mainTotal?.total_Quantity}</div>
            </div>
            <div className="row_elv">
                <div className="fs_elv w50_elv">GWT : </div>
                <div className="fs_elv end_elv w50_elv text-break">{result?.mainTotal?.grosswt?.toFixed(3)} gm</div>
            </div>
            <div className="row_elv">
                <div className="fs_elv w50_elv">NWT : </div>
                <div className="fs_elv end_elv w50_elv text-break">{(result?.mainTotal?.netwt + result?.mainTotal?.lossWt)?.toFixed(3)} gm</div>
            </div>
            <div className="row_elv">
                <div className="fs_elv w50_elv">CST : </div>
                <div className="fs_elv end_elv w50_elv text-break">{((result?.mainTotal?.colorstone?.Wt) / 5)?.toFixed(3)} gm</div>
            </div>
            <div className="row_elv">
                <div className="fs_elv w50_elv">OTHER : </div>
                <div className="fs_elv end_elv w50_elv text-break">{result?.mainTotal?.misc?.Wt?.toFixed(3)} gm</div>
            </div>
            <div className="row_elv">
                <div className="fs_elv w50_elv">BRANCH : </div>
                <div className="fs_elv end_elv w50_elv text-break">{result?.resultArray[0]?.batchnumber}</div>
            </div>
           
        </div></> :  <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
            {msg}
          </p>
        }
        </>
    }

        
    </>
  )
}

export default BillSticker