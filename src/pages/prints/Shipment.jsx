import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { apiCall, checkMsg, isObjectEmpty } from '../../GlobalFunctions';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import Loader from '../../components/Loader';
import "../../assets/css/prints/shipment.css";
import QRCodeGenerator from '../../components/QRCodeGenerator';
import Button from './../../GlobalFunctions/Button';
import { deepClone } from '@mui/x-data-grid/utils/utils';

const Shipment = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {
  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const [arr1, setArr1] = useState([]);
 
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = (data) => {

      let address = data?.BillPrint_Json[0]?.Printlable?.split("\r\n");
      data.BillPrint_Json[0].address = address;
 
      const datas = OrganizeDataPrint(
        data?.BillPrint_Json[0],
        data?.BillPrint_Json1,
        data?.BillPrint_Json2
      );

      let pur_catwise = [];
        datas?.resultArray?.forEach((a) => {
          let obj = deepClone(a);
          obj.count = 1;
          let findrec = pur_catwise?.findIndex((al) => al?.MetalPurity === obj?.MetalPurity && al?.Categoryname === obj?.Categoryname)
          if(findrec  === -1){
            pur_catwise.push(obj);
          }else{
            pur_catwise[findrec].count += 1;
          }
        })
      

        let cateWise = [];
        let cateWiseOther = [];

        pur_catwise?.forEach((e, i) => {
          let obj = deepClone(e);
            if(i < 2){
              cateWise?.push(obj)
            }else{
              cateWiseOther.push(obj);
            }
        })
        setArr1(cateWise);

      setResult(datas);
  }


  return (
    <>
    { loader ? <Loader /> : msg === '' ? <>
      <div className='print_btn_shp d_none_shp'><Button /></div>
      <div className='container_shp'>
      <div className='d-flex justify-content-between align-items-start border-black border-bottom' >
        <div className='w33_shp '>
          <div className='pad_s_shp fs_shp text-break '>TO</div>
          {/* <div className='pad_s_shp fs_shp text-break fw-bold'>{result?.header?.CompanyFullName}</div> */}
          <div className='pad_s_shp fs_shp text-break fw-bold'>{result?.header?.CustName}</div>
          <div className='pad_s_shp fs_shp text-break'>{result?.header?.customercity}, {result?.header?.customerstate}</div>
          <div className='pad_s_shp fs_shp text-break'>{result?.header?.customercountry}{result?.header?.customerpincode}</div>
          <div className='pad_s_shp fs_shp text-break'>Mobile No :{result?.header?.customermobileno}</div>
        </div>
        <div className='w33_shp '>
          <div className='pad_s_shp fs_shp text-break '>FROM</div>
          <div className='pad_s_shp fs_shp text-break fw-bold'>Orail Services</div>
          <div className='pad_s_shp fs_shp text-break'>ITC Building</div>
          <div className='pad_s_shp fs_shp text-break'>Surat - 394210</div>
          
        </div>
        <div className='w33_shp2 d-flex justify-content-center align-items-center h_fix_shp'><QRCodeGenerator  /></div>
      </div>
      <div className='d-flex'>
        <div className=' border-black border-end ' style={{width:'45%'}}>
          <div className='d-flex w-100 border-black border-bottom'>
            <div className='w-50 fw-bold border-black border-end fs_shp pad_s_shp'>Voucher : </div>
            <div className='w-50 fs_shp pad_s_shp'>{result?.header?.InvoiceNo}</div>
          </div>
          <div className='d-flex w-100 border-black border-bottom'>
            <div className='w-50 fw-bold border-black border-end fs_shp pad_s_shp'>G WT : </div>
            <div className='w-50 fs_shp pad_s_shp'>{result?.mainTotal?.grosswt?.toFixed(3)}</div>
          </div>
          <div className='d-flex w-100 border-black border-bottom'>
            <div className='w-50 fw-bold border-black border-end fs_shp pad_s_shp'>N WT : </div>
            <div className='w-50 fs_shp pad_s_shp'>{(result?.mainTotal?.netwt + result?.mainTotal?.lossWt)?.toFixed(3)}</div>
          </div>
          <div className='d-flex w-100 border-black border-bottom'>
            <div className='w-50 fw-bold border-black border-end fs_shp pad_s_shp'>DIA :</div>
            <div className='w-50 fs_shp pad_s_shp'> {result?.mainTotal?.diamonds?.Pcs} / {result?.mainTotal?.diamonds?.Wt?.toFixed(3)} cts</div>
          </div>
          <div className='d-flex w-100 border-black border-bottom'>
            <div className='w-50 fw-bold border-black border-end fs_shp pad_s_shp'>CS :</div>
            <div className='w-50 fs_shp pad_s_shp'> {result?.mainTotal?.colorstone?.Pcs} / {result?.mainTotal?.colorstone?.Wt?.toFixed(3)} cts</div>
          </div>
          <div className='d-flex w-100 border-black border-bottom'>
            <div className='w-50 fw-bold border-black border-end fs_shp pad_s_shp'>Start Date :</div>
            <div className='w-50 fs_shp pad_s_shp'></div>
          </div>
          <div className='d-flex w-100 '>
            <div className='w-50 fw-bold border-black border-end fs_shp pad_s_shp'>Delivery Date :</div>
            <div className='w-50 fs_shp pad_s_shp'></div>
          </div>
        </div>
        <div  style={{width:'55%'}}>
          <div className='d-flex border-black border-bottom'>
            <div className='w-50 border-black border-end fs_shp d_flex_shp text-break fw-bold'>Category</div>
            <div className='w-25 border-black border-end fs_shp d_flex_shp text-break fw-bold'>{arr1[0]?.MetalPurity}</div>
            <div className='w-25 border-black border-end fs_shp d_flex_shp text-break fw-bold'>{arr1[1]?.MetalPurity}</div>
            <div className='w-25 fs_shp d_flex_shp text-break fw-bold'>Other</div>
          </div>
          <div className='d-flex border-black border-bottom'>
            <div className='w-50 border-black border-end fs_shp pad_s_shp text-break'>{arr1[0]?.Categoryname}</div>
            <div className='w-25 border-black border-end fs_shp pad_e_shp d_flex_end_shp'>A</div>
            <div className='w-25 border-black border-end fs_shp pad_e_shp d_flex_end_shp'>B</div>
            <div className='w-25 fs_shp pad_e_shp d_flex_end_shp'>C</div>
          </div>
          <div className='d-flex border-black border-bottom'>
            <div className='w-50 border-black border-end fs_shp pad_s_shp text-break'>{arr1[1]?.Categoryname}</div>
            <div className='w-25 border-black border-end fs_shp pad_e_shp d_flex_end_shp'>D</div>
            <div className='w-25 border-black border-end fs_shp pad_e_shp d_flex_end_shp'>E</div>
            <div className='w-25 fs_shp pad_e_shp d_flex_end_shp'>F</div>
          </div>
          <div className='d-flex border-black border-bottom'>
            <div className='w-50 border-black border-end fs_shp pad_s_shp text-break'>Other</div>
            <div className='w-25 border-black border-end fs_shp pad_e_shp d_flex_end_shp'>G</div>
            <div className='w-25 border-black border-end fs_shp pad_e_shp d_flex_end_shp'>H</div>
            <div className='w-25 fs_shp pad_e_shp d_flex_end_shp'>I</div>
          </div>
          <div className='d-flex border-black border-bottom'>
            <div className='w-50 border-black border-end fs_shp'>&nbsp;</div>
            <div className='w-25 border-black border-end fs_shp'></div>
            <div className='w-25 border-black border-end fs_shp'></div>
            <div className='w-25 fs_shp'></div>
          </div>
          <div className='fw-bold p-1 fs_shp2 text-break d-flex justify-content-center align-items-center'>
            Your Order Delievered within 7 Days
          </div>
        </div>
      </div>
    </div>
    {/* <div className='container_shp'></div>
    <div className='container_shp'></div>
    <div className='container_shp'></div> */}
    </> : <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto"> {msg} </p> }
    </>
  )
}

export default Shipment