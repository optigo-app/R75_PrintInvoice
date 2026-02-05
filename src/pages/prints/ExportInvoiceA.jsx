import React, { useEffect, useState } from 'react'
import "../../assets/css/prints/exportinvoicea.css";
import { apiCall, checkMsg, formatAmount, handlePrint, isObjectEmpty, numberToWord } from '../../GlobalFunctions';
import { OrganizeInvoicePrintData } from '../../GlobalFunctions/OrganizeInvoicePrintData';
import Loader from '../../components/Loader';
import { cloneDeep } from 'lodash';
const ExportInvoiceA = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {

  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const [metalValue, setMetalValue] = useState({
    ShapeName:'',
    QualityName:''
  });
  const [silverValue, setSilverValue] = useState({
    ShapeName:'',
    QualityName:''
  });
  const [metCatWiseData, setMetCatWiseData] = useState([]);

  const [metalGoldPurityWise, setMetalGoldPurityWise] = useState([]);
  const [metalGoldPurityWiseTotal, setMetalGoldPurityWiseTotal] = useState(null);

  const [metalWithoutGoldPurityWise, setMetalWithoutGoldPurityWise] = useState([]);
  const [metalWithoutGoldPurityWiseTotal, setMetalWithoutGoldPurityWiseTotal] = useState(null);

  const [findingArr, setFindingArr] = useState([]);
  const [findingArrTotal, setFindingArrTotal] = useState(null);

  

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
    
    let address = data?.BillPrint_Json[0]?.Printlable?.split("\r\n");
    data.BillPrint_Json[0].address = address;

    const datas = OrganizeInvoicePrintData(
      data?.BillPrint_Json[0],
      data?.BillPrint_Json1,
      data?.BillPrint_Json2
    );

    let grpArr = [];
    console.log(datas?.resultArray);
    
    datas?.resultArray?.forEach((e) => {
      console.log(e);
      
      let obj = cloneDeep(e);
      let find_record = grpArr?.findIndex((el) =>  el?.MetalTypePurity === obj?.MetalTypePurity && el?.Categoryname === obj?.Categoryname);
      if(find_record === -1){
        grpArr.push(obj);
      }else{
        grpArr[find_record].Quantity += obj?.Quantity;
        grpArr[find_record].grosswt += obj?.grosswt;
        grpArr[find_record].NetWt += obj?.NetWt;
        grpArr[find_record].LossWt += obj?.LossWt;
        grpArr[find_record].TotalAmount += obj?.TotalAmount;
        grpArr[find_record].totals.diamonds.Wt += obj?.totals?.diamonds?.Wt;
        grpArr[find_record].totals.colorstone.Wt += obj?.totals?.colorstone?.Wt;
      }
    });
    
    setMetCatWiseData(grpArr);

    let arr = [];
    let arr2 = [];

    datas?.json2?.forEach((e, i) => {
      if(e?.MasterManagement_DiamondStoneTypeid === 4){
          if(e?.ShapeName?.toLowerCase() === 'gold'){
              arr.push(e);
          }
          if(e?.ShapeName?.toLowerCase() === 'silver'){
              arr2.push(e);
          }
      }
    });

    setMetalValue({
      ShapeName:arr[0]?.ShapeName,
      QualityName:arr[0]?.QualityName
    })
    setSilverValue({
      ShapeName:arr2[0]?.ShapeName,
      QualityName:arr2[0]?.QualityName
    });

    let met_arr_gold = [];
    let met_arr = [];
    let met_arr2_withoutgold = [];
    let met_arr2 = [];

    datas?.resultArray?.forEach((e) => {
      if(e?.MetalType?.toLowerCase() === 'gold'){
        met_arr_gold.push(e)
      }
      if(e?.MetalType?.toLowerCase() !== 'gold'){
        met_arr2_withoutgold.push(e)
      }
    })

    met_arr_gold?.forEach((a) => {
      let obj = cloneDeep(a);
      let findrec = met_arr.findIndex((e) => e?.MetalTypePurity === obj?.MetalTypePurity);
      if(findrec === -1){
        met_arr.push(obj);
      }else{
        met_arr[findrec].grosswt += obj?.grosswt;
        met_arr[findrec].NetWt += obj?.NetWt;
        met_arr[findrec].LossWt += obj?.LossWt;
        // met_arr[findrec].LossPer += obj?.LossPer;
        met_arr[findrec].PureNetWt += obj?.PureNetWt;

      }
    });


    
    met_arr2_withoutgold?.forEach((a) => {
      let obj = cloneDeep(a);
      let findrec = met_arr2.findIndex((e) => e?.MetalTypePurity === obj?.MetalTypePurity);
      if(findrec === -1){
        met_arr2.push(obj);
      }else{
        met_arr2[findrec].grosswt += obj?.grosswt;
        met_arr2[findrec].NetWt += obj?.NetWt;
        met_arr2[findrec].LossWt += obj?.LossWt;
        met_arr2[findrec].PureNetWt += obj?.PureNetWt;

      }
    });

    
    


    
    let fin_arr = [];
    datas?.json2?.forEach((a) => {

      if(a?.MasterManagement_DiamondStoneTypeid === 5){

        
        // a?.finding?.forEach((al) => {

        let obj = cloneDeep(a);
        let findrec = fin_arr?.findIndex((el) => el?.FindingAccessories === obj?.FindingAccessories);
        if(findrec === -1){
          fin_arr.push(obj);
        }else{
          fin_arr[findrec].Wt += obj?.Wt;
        }

      // });
      
      // a.finding = fin_arr;

      }

    });





    setResult(datas);

    datas.header.PrintRemark = (datas.header.PrintRemark)?.replace(/<br\s*\/?>/gi, "");



    
    let g_Arr_total = {
      ShapeName:'Total',
      NetWt:0,
      PureNetWt:0,
      LossWt:0,
      pureLossWt:0 ,
    }
    met_arr?.forEach((a) => {
      g_Arr_total.NetWt += a?.NetWt;
      g_Arr_total.PureNetWt += ((a?.NetWt + a?.LossWt) * a?.Tunch) / 99.5;
      g_Arr_total.LossWt += a?.LossWt;
      // g_Arr_total.pureLossWt += ((a?.LossWt * a?.Tunch) / 100);
      g_Arr_total.pureLossWt += ((a?.LossWt * a?.Tunch) / 99.5);
    })
    setMetalGoldPurityWiseTotal(g_Arr_total);
    setMetalGoldPurityWise(met_arr);


    let wg_Arr_total = {
      ShapeName:'Total',
      NetWt:0,
      PureNetWt:0,
      LossWt:0, 
      pureLossWt:0,
    }
    met_arr2?.forEach((a) => {
      
      wg_Arr_total.NetWt += a?.NetWt;
      wg_Arr_total.PureNetWt += ((a?.NetWt + a?.LossWt) * a?.Tunch) / 99.5;
      wg_Arr_total.LossWt += a?.LossWt;
      // wg_Arr_total.pureLossWt += ((a?.pureLossWt * a?.Tunch) / 100);
      wg_Arr_total.pureLossWt += ((a?.LossWt * a?.Tunch) / 99.5);
      
    })
    
    setMetalWithoutGoldPurityWiseTotal(wg_Arr_total);
    setMetalWithoutGoldPurityWise(met_arr2);


    

    let find_Arr_total = {
      ShapeName:'Total',
      Wt:0
    }
    fin_arr?.forEach((a) => {
      find_Arr_total.Wt += a?.Wt;
    })
    setFindingArrTotal(find_Arr_total);
    setFindingArr(fin_arr);

  }
  return (
    <>
    {
      loader ? <Loader /> : <>{msg === '' ? <div className='export_print_a_container '>
                <div className='my-2 d_none_eia w-100 d-flex justify-content-end'>           
                    <input type="button" className="btn_white blue me-0" value="Print" onClick={(e) => handlePrint(e)} />
                </div>
                  <div className='first_page_eia'>
                    <div className="d-flex border border-black">
                      <div className='p-2 col-6 border-end border-black'>
                          <div className="d-flex justify-content-between">
                              <p className="text-decoration-underline fw-semibold">  </p>
                              {/* <p className="text-decoration-underline"> Ref. Person Details </p> */}
                          </div>
                          <p className='headline_fs_eia fw-bold py-1'>{result?.header?.CompanyFullName}</p>
                          <p className='fw-semibold'>{result?.header?.CompanyAddress}</p>
                          <p className='fw-semibold'>{result?.header?.CompanyAddress2}</p>
                          <p className='fw-semibold'>{result?.header?.CompanyCity + ", " +result?.header?.CompanyCountry}</p>
                          <p className='fw-semibold'>Telephone No :&nbsp;{result?.header?.CompanyTellNo}</p>
                          <p className='fw-semibold'>Email Id :&nbsp;{result?.header?.CompanyEmail}</p>
                      </div>
                      <div className='col-6'>
                          <div className='d-flex border-bottom border-black'>
                              <div className="col-7 border-end border-black p-2">
                                  <div className=" text-break">
                                      <div className='fw-bold'>Invoice No. & Date :&nbsp; {result?.header?.EntryDate}</div>
                                      <div className='fw-normal'>{result?.header?.InvoiceNo} &nbsp; </div>
                                  </div>
                                  {/* <div className="d-flex">
                                      <p className='pe-2 fw-semibold'>Invoice Dt :</p>
                                      <p className='fw-bold'>{result?.header?.EntryDate}</p>
                                  </div> */}
                                  {/* <div className="d-flex">
                                      <p className='pe-2 fw-semibold'>EDF No. :</p>
                                      <p className='fw-bold'></p>
                                  </div> */}
                              </div>
                              <div className="col-5 d-flex flex-column justify-content-between align-items-center p-2">
                                  <p className='text-uppercase fw-semibold w-100 text-start'>Exporter's Ref.</p>
                                  <p className='text-uppercase fw-semibold'></p>
                              </div>
                          </div>
                          <div className='p-1 d-flex'>
                              <p className="">Buyer's Order No. & Date</p>
                          </div>
                          <div className='p-1 border-top border-black'>
                              <p className="fw-bold">Other Reference(s)</p>
                              <p className="fw-semibold">EDF No. </p>
                          </div>
                      </div>
                  </div>
                  <div className="d-flex border border-top-0 border-black ">
                      <div className='p-2 col-6 border-end border-black'>
                          <div className="d-flex justify-content-between">
                              <p className=" fw-semibold"> Bill To, </p>
                              {/* <p className="text-decoration-underline fw-semibold"> Ref. Person Details </p> */}
                          </div>
                          <p className='headline_fs_eia fw-bold py-1'>{result?.header?.customerfirmname}</p>
                          <p className='fw-semibold'>{result?.header?.customerAddress1}</p>
                          <p className='fw-semibold'>{result?.header?.customerAddress2}</p>
                          <p className='fw-semibold'>{result?.header?.customerAddress3} {result?.header?.customercity}, {result?.header?.customercountry}</p>
                          <p className='fw-semibold'>Telephone No : {result?.header?.customermobileno}</p>
                          <p className='fw-semibold'>Email Id :{result?.header?.customeremail1}</p>
                      </div>
                      <div className='col-6 minHeight_eia'>
                          <div className='p-2'>
                              <p className="fw-bold">Buyer (if other than consignee)</p>
                          </div>
                          <div className='p-2 col-12'>
                          <div className="d-flex justify-content-between">
                              <p className=" fw-semibold pb-2"> Ship To, </p>
                          </div>

                          {
                            result?.header?.address?.map((e, i) => {
                              return <p className='fw-semibold' key={i}>{e}</p>
                            })
                          }
                      </div>
                      </div>
                      <div></div>
                </div>
                <div className="d-flex border border-top-0 border-black overflow-hidden ">
                      <div className='col-6 border-end border-black'>
                          <div className="d-flex border-bottom border-black">
                              <div className="col-6 pt-1 px-1 pb-4 border-end border-black">
                                  <p className="fw-normal">Pre-Carriage By </p>
                              </div>
                              <div className="col-6 pt-1 px-1 pb-4">
                                  <p className="fw-normal">Place of Receipt by Pre-carrier N.A. </p>
                              </div>
                          </div>
                          <div className="d-flex border-bottom border-black">
                              <div className="col-6 pt-1 px-1 pb-4 border-end border-black">
                                  <p className="fw-normal">Vessel/Flight No.</p>
                                  <p className="">{result?.header?.Flight_NO}</p>
                              </div>
                              <div className="col-6 pt-1 px-1 pb-4">
                                  <p className="fw-normal">Port of Loading</p>
                                  <p className="">{result?.header?.portofloading}</p>
                              </div>
                          </div>
                          <div className="d-flex ">
                              <div className="col-6 pt-1 px-1 pb-2 border-end border-black">
                                  <p className="fw-normal">Port of Discharge</p>
                                  <p className="">{result?.header?.portofdischarge}</p>
                              </div>
                              <div className="col-6 pt-1 px-1 pb-2">
                                  <p className="fw-normal">Final Destination</p>
                                  <span>{result?.header?.customercountry}</span>
                              </div>
                          </div>
                          {/* <div className={`d-flex  h-100`}>
                              <div className="col-4 border-end border-black p-1 text-center">
                                  <p className="fw-semibold">Marks & Nos. AS ADDRESS</p>
                              </div>
                              <div className="col-4 border-end border-black p-1 text-center">
                                  <p className="fw-semibold">No & KIND OF PKGS</p>
                              </div>
                              <div className="col-4 p-1 text-center">
                                  <p className="fw-semibold">QUANTITY 2</p>
                              </div>
                          </div> */}
                      </div>
                      <div className='col-6'>
                          <div className="d-flex border-black border-bottom">
                              <div className="col-6 p-2 border-black border-end d-flex">
                                  <p className="fw-semibold text-center">Country of Origin of Goods : </p>
                                  <p className="fw-bold text-center">&nbsp;{result?.header?.CompanyCountry}</p>
                              </div>
                              <div className="col-6 py-2">
                                  <p className="fw-semibold text-center">Country of Final Destination : {result?.header?.customercountry}</p>
                              </div>
                          </div>
                          <div className="d-flex border-black border-bottom">
                              <div className="col-6 p-2">
                                  <p className="fw-semibold"> Terms of Delivery and payment : {result?.header?.DueDays} Days</p>
                                  {/* <p className="fw-semibold"> Bank Name : {result?.header?.bankname} </p>
                                  <p className={`fw-semibold `}> Bank Add : {result?.header?.bankaddress}</p> */}
                              </div>
                              <div className="col-6 p-2">
                                  {/* <div className="d-flex">
                                      <div className="col-6">
                                          <p className="fw-semibold text-end"> Payment Terms : </p>
                                          <p className="fw-semibold text-end"> A/C No. : </p>
                                      </div>
                                      <div className="col-6">
                                          <p className="fw-semibold ps-2" style={{ minHeight: '15.36px' }}> </p>
                                          <p className="fw-semibold ps-2"> {result?.header?.accountnumber}</p>
                                      </div>
                                  </div> */}
                              </div>
                          </div>
                          {/* <div className="">
                              <p className="px-2 pt-1  fw-semibold"> Description of Goods </p>
                              <p className="px-2    fw-semibold">{result?.header?.HSN_No}</p>
                          </div> */}
                      </div>
                </div>
                <div className={` w-100  h-100`}>
                                          <div className=" border border-top-0 border-black p-1 text-start">
                                              <p className="fw-normal"><span className='fw-bold'>Marks & Nos. Container </span>&nbsp;&nbsp;&nbsp; No & KIND OF PKGS : 1 (ONE) TIN BOX</p>
                                          </div>
                                          <div className=" border border-top-0 border-black p-1 text-start">
                                              <p className="fw-normal"><span className='fw-bold'>AS ADD </span> {metalValue?.QualityName} Branded {metalValue?.ShapeName} & {silverValue?.QualityName} {silverValue?.ShapeName} Plain Jewellery</p>
                                          </div>
                                          {/* <div className=" p-1 text-center">
                                              <p className="fw-semibold">QUANTITY 2</p>
                                          </div> */}
                </div>
    <div>
      <div className='d-flex fw-bold border border-black mt-1'>
        <div className='col_1_eia fw-normal p-1'>SR No</div>
        <div className='col_2_eia p-1'>Product</div>
        <div className='col_3_eia p-1'>HSN Code</div>
        <div className='col_4_eia p-1'>Dia Wt <br /> (Cts)</div>
        <div className='col_5_eia p-1'>CS Wt <br /> (Cts)</div>
        <div className='col_6_eia border-end border-black p-1'>Gross Wt <br /> (Gms)</div>
        <div className='col_7_eia border-end border-black p-1'>Quantity <br /> PCS/PRS</div>
        <div className='col_8_eia border-end border-black p-1'>Rate</div>
        <div className='col_9_eia p-1'>Amount <br /> {result?.header?.CurrencyCode}</div>
      </div>
      {
        metCatWiseData?.map((e, i) => {
          return (
            <div className='d-flex fw-normal border border-top-0 border-black ' key={i}>
              <div className='col_1_eia fw-normal p-1'>{i + 1}</div>
              <div className='col_2_eia p-1'>{ e?.Categoryname + " "+ e?.MetalTypePurity }</div>
              <div className='col_3_eia p-1'>{result?.header?.HSN_No}</div>
              <div className='col_4_eia p-1'>{e?.totals?.diamonds?.Wt?.toFixed(3)}</div>
              <div className='col_5_eia p-1'>{e?.totals?.colorstone?.Wt?.toFixed(3)} </div>
              <div className='col_6_eia border-end border-black p-1'>{e?.grosswt?.toFixed(3)} </div>
              <div className='col_7_eia border-end border-black p-1'>{e?.Quantity} </div>
              <div className='col_8_eia border-end border-black p-1'>{formatAmount((((e?.TotalAmount / result?.header?.CurrencyExchRate) / e?.Quantity)))}</div>
              <div className='col_9_eia p-1'>{formatAmount((e?.TotalAmount / result?.header?.CurrencyExchRate))} </div>
            </div>
          )
        })
      }
    </div>
    <div className='d-flex border border-black border-top-0 minHeight_sign_eia'>
      <div className='w-75 d-flex flex-column align-items-start ps-2 justify-content-center border-end border-black'>
        <div>Declaration : </div>
        <div className='text-break'>We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct</div>
      </div>
      <div className='w-25 ps-2 d-flex flex-column justify-content-between align-items-start fw-bold'>
        <div>{result?.header?.CompanyFullName}</div>
        <div>Authorized Signatory</div>
      </div>
    </div>
    </div>
    <div className='fw-bold ps-1 mt-1'>INVOICE</div>
    <div className="d-flex border border-black">
                      <div className='p-2 col-6 border-end border-black'>
                          <div className="d-flex justify-content-between">
                              <p className="text-decoration-underline fw-semibold"> Exporter: </p>
                              {/* <p className="text-decoration-underline"> Ref. Person Details </p> */}
                          </div>
                          <p className='headline_fs_eia fw-bold py-1'>{result?.header?.CompanyFullName}</p>
                          <p className='fw-semibold'>{result?.header?.CompanyAddress}</p>
                          <p className='fw-semibold'>{result?.header?.CompanyAddress2}</p>
                          <p className='fw-semibold'>{result?.header?.CompanyCity +", "+ result?.header?.CompanyCountry}</p>
                          <p className='fw-semibold'>Telephone No :&nbsp;{result?.header?.CompanyTellNo}</p>
                          <p className='fw-semibold'>Email Id :&nbsp;{result?.header?.CompanyEmail}</p>
                      </div>
                      <div className='col-6'>
                          <div className='d-flex border-bottom border-black'>
                              <div className="col-6 border-end border-black p-2">
                                  <div className="">
                                      <div className='pe-2 fw-semibold'>Invoice No. & Date : {result?.header?.EntryDate}</div>
                                      <div className='fw-normal'>{result?.header?.InvoiceNo} </div>
                                  </div>
                                  {/* <div className="d-flex">
                                      <p className='pe-2 fw-semibold'>Invoice Dt :</p>
                                      <p className='fw-bold'>{result?.header?.EntryDate}</p>
                                  </div> */}
                                  {/* <div className="d-flex">
                                      <p className='pe-2 fw-semibold'>EDF No. :</p>
                                      <p className='fw-bold'></p>
                                  </div> */}
                              </div>
                              <div className="col-6 d-flex flex-column justify-content-between align-items-center p-2">
                                  <p className='text-uppercase fw-semibold w-100'>Exporter's Ref.</p>
                                  <p className='text-uppercase fw-semibold'></p>
                              </div>
                          </div>
                          <div className='p-1 d-flex'>
                              <p className="fw-normal">Buyer's Order No. & Date</p>
                          </div>
                          <div className='p-1 border-top border-black'>
                              <p className="fw-bold">Other Reference</p>
                              <p className="fw-normal">EDF No. </p>
                          </div>
                      </div>
                </div>
                <div className={` w-100  h-100 mt-3`}>
                              <div className=" border border-top border-black p-1 text-start">
                                  <p className="fw-normal"><span className='fw-bold'>Marks & Nos. Container </span>&nbsp;&nbsp;&nbsp; No & KIND OF PKGS : 1 (ONE) TIN BOX</p>
                              </div>
                              <div className=" border border-top-0 border-black p-1 text-start">
                                  <p className="fw-normal"><span className='fw-bold'>AS ADD </span>&nbsp;&nbsp;&nbsp; {metalValue?.QualityName} Branded {metalValue?.ShapeName} & {silverValue?.QualityName} {silverValue?.ShapeName} Plain Jewellery</p>
                              </div>
                              {/* <div className=" p-1 text-center">
                                  <p className="fw-semibold">QUANTITY 2</p>
                              </div> */}
    </div>
    <div className='mt-3'>
        <div className='d-flex border border-black fw-semibold'>
            <div className='col_t2_1_eia p-1 '>RM KT</div>
            <div className='col_t2_2_eia p-1 '>Loss %</div>
            <div className='col_t2_3_eia p-1 '>Met Wt</div>
            <div className='col_t2_4_eia p-1 '>Pure MetWt</div>
            <div className='col_t2_5_eia p-1 '>LossWt</div>
            <div className='col_t2_6_eia p-1 '>PureLossWt</div>
            <div className='col_t2_7_eia p-1 '>TotWt</div>
            <div className='col_t2_8_eia p-1'>PureTotWt</div>
        </div>


        { metalGoldPurityWise?.length > 0 && <div className='d-flex border border-black border-top-0 fw-semibold'>
            <div className='col_t2_1_eia p-1 fw-bold'>Gold</div>
            <div className='col_t2_2_eia p-1 '></div>
            <div className='col_t2_3_eia p-1 '></div>
            <div className='col_t2_4_eia p-1 '></div>
            <div className='col_t2_5_eia p-1 '></div>
            <div className='col_t2_6_eia p-1 '></div>
            <div className='col_t2_7_eia p-1 '></div>
            <div className='col_t2_8_eia p-1'></div>
        </div>}
        
        {
          metalGoldPurityWise?.map((e, i) => {
            return (
              
              <div className='d-flex border-start border-black border-start border-end fw-semibold' key={i}>
                <div className='col_t2_1_eia p-1 '>{e?.MetalTypePurity}</div>
                <div className='col_t2_2_eia p-1 '>{e?.LossPer}%</div>
                <div className='col_t2_3_eia p-1 '>{e?.NetWt?.toFixed(3)}</div>
                {/* <div className='col_t2_4_eia p-1 '>{((e?.PureNetWt) - ((e?.LossWt * e?.Tunch)/99.5))?.toFixed(3)}</div> */}
                <div className='col_t2_4_eia p-1 '>{( (( e?.NetWt * e?.Tunch)/99.5))?.toFixed(3)}</div>
                <div className='col_t2_5_eia p-1 '>{e?.LossWt?.toFixed(3)}</div>
                <div className='col_t2_6_eia p-1 '>{((e?.LossWt * e?.Tunch)/99.5)?.toFixed(3)}</div>
                <div className='col_t2_7_eia p-1 '>{(e?.NetWt + e?.LossWt)?.toFixed(3)}</div>
                <div className='col_t2_8_eia p-1'>{(((e?.NetWt + e?.LossWt) * e?.Tunch) / 99.5 )?.toFixed(3)}</div>
            </div> 
            
            )
          })
        }
        { metalGoldPurityWise?.length > 0 && <div className='d-flex border border-black border-top-0 fw-semibold'>
            <div className='col_t2_1_eia p-1 fw-bold'>{metalGoldPurityWiseTotal?.ShapeName}</div>
            <div className='col_t2_2_eia p-1 '></div>
            <div className='col_t2_3_eia p-1 fw-bold'>{metalGoldPurityWiseTotal?.NetWt?.toFixed(3)}</div>
            <div className='col_t2_4_eia p-1 fw-bold'>{(metalGoldPurityWiseTotal?.PureNetWt - metalGoldPurityWiseTotal?.pureLossWt)?.toFixed(3)}</div>
            <div className='col_t2_5_eia p-1 fw-bold'>{metalGoldPurityWiseTotal?.LossWt?.toFixed(3)}</div>
            <div className='col_t2_6_eia p-1 fw-bold'>{metalGoldPurityWiseTotal?.pureLossWt?.toFixed(3)}</div>
            <div className='col_t2_7_eia p-1 fw-bold'>{(metalGoldPurityWiseTotal?.LossWt + metalGoldPurityWiseTotal?.NetWt)?.toFixed(3)}</div>
            <div className='col_t2_8_eia p-1 fw-bold'>{((metalGoldPurityWiseTotal?.PureNetWt))?.toFixed(3)}</div>
        </div>}


        { metalWithoutGoldPurityWise?.length > 0 && <div className='d-flex border border-black border-top-0 fw-semibold'>
            <div className='col_t2_1_eia p-1 fw-bold'>{metalWithoutGoldPurityWise[0]?.MetalType}</div>
            <div className='col_t2_2_eia p-1 '></div>
            <div className='col_t2_3_eia p-1 '></div>
            <div className='col_t2_4_eia p-1 '></div>
            <div className='col_t2_5_eia p-1 '></div>
            <div className='col_t2_6_eia p-1 '></div>
            <div className='col_t2_7_eia p-1 '></div>
            <div className='col_t2_8_eia p-1'></div>
        </div>}
        {
          metalWithoutGoldPurityWise?.map((e, i) => {
            return (
              
              <div className='d-flex border-start border-black border-start border-end fw-semibold' key={i}>
                <div className='col_t2_1_eia p-1 '>{e?.MetalTypePurity}</div>
                <div className='col_t2_2_eia p-1 '>{e?.LossPer}%</div>
                <div className='col_t2_3_eia p-1 '>{e?.NetWt?.toFixed(3)}</div>
                <div className='col_t2_4_eia p-1 '>{(e?.PureNetWt - ((e?.LossWt * e?.Tunch)/99.5))?.toFixed(3)}</div>
                <div className='col_t2_5_eia p-1 '>{e?.LossWt?.toFixed(3)}</div>
                <div className='col_t2_6_eia p-1 '>{((e?.LossWt * e?.Tunch)/99.5)?.toFixed(3)}</div>
                <div className='col_t2_7_eia p-1 '>{(e?.NetWt + e?.LossWt)?.toFixed(3)}</div>
                <div className='col_t2_8_eia p-1'>{(((e?.NetWt + e?.LossWt) * e?.Tunch)/99.5)?.toFixed(3)}</div>
            </div> 
            
            )
          })
        }
        { metalWithoutGoldPurityWise?.length > 0 && <div className='d-flex border border-black border-top-0 fw-semibold'>
            <div className='col_t2_1_eia p-1 fw-bold'>{metalWithoutGoldPurityWiseTotal?.ShapeName}</div>
            <div className='col_t2_2_eia p-1 '></div>
            <div className='col_t2_3_eia p-1 fw-bold'>{metalWithoutGoldPurityWiseTotal?.NetWt?.toFixed(3)}</div>
            <div className='col_t2_4_eia p-1 fw-bold'>{(metalWithoutGoldPurityWiseTotal?.PureNetWt - metalWithoutGoldPurityWiseTotal?.pureLossWt)?.toFixed(3)}</div>
            <div className='col_t2_5_eia p-1 fw-bold'>{metalWithoutGoldPurityWiseTotal?.LossWt?.toFixed(3)}</div>
            <div className='col_t2_6_eia p-1 fw-bold'>{metalWithoutGoldPurityWiseTotal?.pureLossWt?.toFixed(3)}</div>
            <div className='col_t2_7_eia p-1 fw-bold'>{(metalWithoutGoldPurityWiseTotal?.NetWt + metalWithoutGoldPurityWiseTotal?.LossWt)?.toFixed(3)}</div>
            <div className='col_t2_8_eia p-1 fw-bold'>{metalWithoutGoldPurityWiseTotal?.PureNetWt?.toFixed(3)}</div>
        </div>}


        
         { findingArr?.length > 0 && <div className='d-flex border border-black border-top-0 fw-semibold'>
            <div className='col_t2_1_eia p-1 fw-bold'>Accessories</div>
            <div className='col_t2_2_eia p-1 '></div>
            <div className='col_t2_3_eia p-1 '></div>
            <div className='col_t2_4_eia p-1 '></div>
            <div className='col_t2_5_eia p-1 '></div>
            <div className='col_t2_6_eia p-1 '></div>
            <div className='col_t2_7_eia p-1 '></div>
            <div className='col_t2_8_eia p-1'></div>
        </div>}

                    {
                      findingArr?.map((a, ind) => {
                        return (
                          <div className='d-flex border-start border-black  border-start border-end fw-semibold' key={ind}>
                            <div className='col_t2_1_eia p-1 '>{a?.FindingAccessories}</div>
                            <div className='col_t2_2_eia p-1 '></div>
                            <div className='col_t2_3_eia p-1 '>{a?.Wt?.toFixed(3)}</div>
                            <div className='col_t2_4_eia p-1 '></div>
                            <div className='col_t2_5_eia p-1 '></div>
                            <div className='col_t2_6_eia p-1 '></div>
                            <div className='col_t2_7_eia p-1 '></div>
                            <div className='col_t2_8_eia p-1'></div>
                          </div> 
                        )
                      })
                    }
                    { findingArr?.length > 0 && <div className='d-flex border border-black border-top-0 fw-semibold'>
                        <div className='col_t2_1_eia p-1 fw-bold'>Total</div>
                        <div className='col_t2_2_eia p-1 '></div>
                        <div className='col_t2_3_eia p-1 fw-bold'>{findingArrTotal?.Wt?.toFixed(3)}</div>
                        <div className='col_t2_4_eia p-1 '></div>
                        <div className='col_t2_5_eia p-1 '></div>
                        <div className='col_t2_6_eia p-1 '></div>
                        <div className='col_t2_7_eia p-1 '></div>
                        <div className='col_t2_8_eia p-1'></div>
                    </div>}
              
        

    </div>
    <div>
      <div className='border border-black mt-3 px-1'>Note: Insurance By :- {result?.header?.insuranceby}</div>

      <div className='d-flex border border-top-0  border-black fw-semibold'>
        <div className='col_t3_1_eia'></div>
        <div className='col_t3_2_eia fw-bold'></div>
        <div className='col_t3_3_eia'>
          <div>PCS</div>
          {/* <div>PRS</div> */}
        </div>
        <div className='col_t3_4_eia'>
          <div>{result?.mainTotal?.Quantity}</div>
          {/* <div>4.000</div> */}
        </div>
        <div className='col_t3_5_eia'>FOB</div>
        <div className='col_t3_6_eia'>{formatAmount((result?.mainTotal?.TotalAmount / result?.header?.CurrencyExchRate))}</div>
      </div>

      <div className='d-flex border border-top-0  border-black fw-semibold'>
        <div className='col_t3_1_eia ps-1'>Freight</div>
        <div className='col_t3_2_eia fw-bold'></div>
        <div className='col_t3_3_eia'>
          {/* <div>PCS</div>
          <div>PRS</div> */}
        </div>
        <div className='col_t3_4_eia'>
          {/* <div>7.000</div>
          <div>4.000</div> */}
        </div>
        <div className='col_t3_5_eia'>FRI</div>
        <div className='col_t3_6_eia'>{formatAmount((result?.header?.FreightCharges / result?.header?.CurrencyExchRate))}</div>
      </div>

      <div className='d-flex border border-top-0  border-black fw-semibold'>
        <div className='col_t3_1_eia ps-1'>Insurance</div>
        <div className='col_t3_2_eia fw-bold'></div>
        <div className='col_t3_3_eia'>
          {/* <div>PCS</div>
          <div>PRS</div> */}
        </div>
        <div className='col_t3_4_eia'>
          {/* <div>7.000</div>
          <div>4.000</div> */}
        </div>
        <div className='col_t3_5_eia'>INS</div>
        <div className='col_t3_6_eia'></div>
      </div>

      <div className='d-flex border border-top-0  border-black fw-semibold'>
        <div className='col_t3_1_eia ps-1'>Convt. Rt {result?.header?.CurrencyExchRate} Value in Rs. </div>
        <div className='col_t3_2_eia fw-bold'></div>
        <div className='col_t3_3_eia'>
          {/* <div>PCS</div>
          <div>PRS</div> */}
        </div>
        <div className='col_t3_4_eia'>
          {/* <div>7.000</div>
          <div>4.000</div> */}
        </div>
        <div className='col_t3_5_eia'>Total CIF</div>
        <div className='col_t3_6_eia'>{formatAmount(((result?.mainTotal?.TotalAmount / result?.header?.CurrencyExchRate) + (result?.header?.FreightCharges / result?.header?.CurrencyExchRate)))}</div>
      </div>
    </div>
    <div className='border border-black mt-3 p-1 text-break fw-semibold'>
      
      Amount Chargeable : {numberToWord(((+(result?.mainTotal?.TotalAmount + result?.header?.FreightCharges)?.toFixed(2))))}
    </div>
    <div className='mt-1'>Declaration : <span dangerouslySetInnerHTML={{__html:result?.header?.Declaration}} className='decl_eia'></span></div>
    <div>
      {/* <div>Declaration : </div>
      <div className='text-break'>We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</div> */}
    </div>
    <div className='d-flex minHeight_sign_eia border border-black'>
      <div className='w-75 border-end border-black d-flex justify-content-end ps-1 align-items-start flex-column'>
        <div>Declaration : </div>
        <div className='text-break'>We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</div>
      </div>
      <div className='w-25 ps-2 d-flex flex-column justify-content-between align-items-start fw-bold'>
        <div>{result?.header?.CompanyFullName}</div>
        <div>Authorized Signatory</div>
      </div>
    </div>
  </div> : <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto"> {msg} </p>}</>
    }
    </>
  )
}

export default ExportInvoiceA
// import React, { useEffect, useState } from 'react'
// import "../../assets/css/prints/exportinvoicea.css";
// import { apiCall, checkMsg, formatAmount, handlePrint, isObjectEmpty, numberToWord } from '../../GlobalFunctions';
// import { OrganizeInvoicePrintData } from '../../GlobalFunctions/OrganizeInvoicePrintData';
// import Loader from '../../components/Loader';
// import { cloneDeep } from 'lodash';
// const ExportInvoiceA = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {

//   const [result, setResult] = useState(null);
//   const [msg, setMsg] = useState("");
//   const [loader, setLoader] = useState(true);
//   const [metalValue, setMetalValue] = useState({
//     ShapeName:'',
//     QualityName:''
//   });
//   const [silverValue, setSilverValue] = useState({
//     ShapeName:'',
//     QualityName:''
//   });
//   const [metCatWiseData, setMetCatWiseData] = useState([]);

//   const [metalGoldPurityWise, setMetalGoldPurityWise] = useState([]);
//   const [metalGoldPurityWiseTotal, setMetalGoldPurityWiseTotal] = useState(null);

//   const [metalWithoutGoldPurityWise, setMetalWithoutGoldPurityWise] = useState([]);
//   const [metalWithoutGoldPurityWiseTotal, setMetalWithoutGoldPurityWiseTotal] = useState(null);

//   const [findingArr, setFindingArr] = useState([]);
//   const [findingArrTotal, setFindingArrTotal] = useState(null);

//   useEffect(() => {
//     const sendData = async () => {
//       try {
//         const data = await apiCall(token, invoiceNo, printName, urls, evn, ApiVer);
//         if (data?.Status === "200") {
//           let isEmpty = isObjectEmpty(data?.Data);
//           if (!isEmpty) {
//             loadData(data?.Data);
//             setLoader(false);
//           } else {
//             setLoader(false);
//             setMsg("Data Not Found");
//           }
//         } else {
//           setLoader(false);
//         //   setMsg(data?.Message);
//         const err = checkMsg(data?.Message);
//         console.log(data?.Message);
//         setMsg(err);
//         }
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     sendData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const loadData = (data) => {
    
//     let address = data?.BillPrint_Json[0]?.Printlable?.split("\r\n");
//     data.BillPrint_Json[0].address = address;

//     const datas = OrganizeInvoicePrintData(
//       data?.BillPrint_Json[0],
//       data?.BillPrint_Json1,
//       data?.BillPrint_Json2
//     );


//     let arr = [];
//     let arr2 = [];

//     datas?.json2?.forEach((e, i) => {
//       if(e?.MasterManagement_DiamondStoneTypeid === 4){
//           if(e?.ShapeName?.toLowerCase() === 'gold'){
//               arr.push(e);
//           }
//           if(e?.ShapeName?.toLowerCase() === 'silver'){
//               arr2.push(e);
//           }
//       }
//     });

//     setMetalValue({
//       ShapeName:arr[0]?.ShapeName,
//       QualityName:arr[0]?.QualityName
//     })
//     setSilverValue({
//       ShapeName:arr2[0]?.ShapeName,
//       QualityName:arr2[0]?.QualityName
//     });

//     let met_arr_gold = [];
//     let met_arr = [];
//     let met_arr2_withoutgold = [];
//     let met_arr2 = [];

//     datas?.resultArray?.forEach((e) => {
//       if(e?.MetalType?.toLowerCase() === 'gold'){
//         met_arr_gold.push(e)
//       }
//       if(e?.MetalType?.toLowerCase() !== 'gold'){
//         met_arr2_withoutgold.push(e)
//       }
//     })

//     met_arr_gold?.forEach((a) => {
//       let obj = cloneDeep(a);
//       let findrec = met_arr.findIndex((e) => e?.MetalTypePurity === obj?.MetalTypePurity);
//       if(findrec === -1){
//         met_arr.push(obj);
//       }else{
//         met_arr[findrec].grosswt += obj?.grosswt;
//         met_arr[findrec].NetWt += obj?.NetWt;
//         met_arr[findrec].LossWt += obj?.LossWt;
//         // met_arr[findrec].LossPer += obj?.LossPer;
//         met_arr[findrec].PureNetWt += obj?.PureNetWt;

//       }
//     });


    
//     met_arr2_withoutgold?.forEach((a) => {
//       let obj = cloneDeep(a);
//       let findrec = met_arr2.findIndex((e) => e?.MetalTypePurity === obj?.MetalTypePurity);
//       if(findrec === -1){
//         met_arr2.push(obj);
//       }else{
//         met_arr2[findrec].grosswt += obj?.grosswt;
//         met_arr2[findrec].NetWt += obj?.NetWt;
//         met_arr2[findrec].LossWt += obj?.LossWt;
//         met_arr2[findrec].PureNetWt += obj?.PureNetWt;

//       }
//     });
    


    
//     let fin_arr = [];
//     datas?.json2?.forEach((a) => {

//       if(a?.MasterManagement_DiamondStoneTypeid === 5){

        
//         // a?.finding?.forEach((al) => {

//         let obj = cloneDeep(a);
//         let findrec = fin_arr?.findIndex((el) => el?.FindingAccessories === obj?.FindingAccessories);
//         if(findrec === -1){
//           fin_arr.push(obj);
//         }else{
//           fin_arr[findrec].Wt += obj?.Wt;
//         }

//       // });
      
//       // a.finding = fin_arr;

//       }

//     });




//     let grpArr = [];
//     datas?.resultArray?.forEach((e) => {
//       let obj = cloneDeep(e);
//       let find_record = grpArr?.findIndex((el) => obj?.MetalTypePurity === el?.MetalTypePurity && obj?.Categoryname === obj?.Categoryname);
//       if(find_record === -1){
//         grpArr.push(obj);
//       }else{
//         grpArr[find_record].Quantity += obj?.Quantity;
//         grpArr[find_record].grosswt += obj?.grosswt;
//         grpArr[find_record].NetWt += obj?.NetWt;
//         grpArr[find_record].LossWt += obj?.LossWt;
//         grpArr[find_record].TotalAmount += obj?.TotalAmount;
//         grpArr[find_record].totals.diamonds.Wt += obj?.totals?.diamonds?.Wt;
//         grpArr[find_record].totals.colorstone.Wt += obj?.totals?.colorstone?.Wt;
//       }
//     });
//     setMetCatWiseData(grpArr);
//     setResult(datas);

//     datas.header.PrintRemark = (datas.header.PrintRemark)?.replace(/<br\s*\/?>/gi, "");



    
//     let g_Arr_total = {
//       ShapeName:'Total',
//       NetWt:0,
//       PureNetWt:0,
//       LossWt:0,  
//     }
//     met_arr?.forEach((a) => {
//       g_Arr_total.NetWt += a?.NetWt;
//       g_Arr_total.PureNetWt += a?.PureNetWt;
//       g_Arr_total.LossWt += a?.LossWt;
//     })
//     setMetalGoldPurityWiseTotal(g_Arr_total);
//     setMetalGoldPurityWise(met_arr);


//     let wg_Arr_total = {
//       ShapeName:'Total',
//       NetWt:0,
//       PureNetWt:0,
//       LossWt:0, 
//     }
//     met_arr2?.forEach((a) => {
//       wg_Arr_total.NetWt += a?.NetWt;
//       wg_Arr_total.PureNetWt += a?.PureNetWt;
//       wg_Arr_total.LossWt += a?.LossWt;
//     })
//     setMetalWithoutGoldPurityWiseTotal(wg_Arr_total);
//     setMetalWithoutGoldPurityWise(met_arr2);

//     let find_Arr_total = {
//       ShapeName:'Total',
//       Wt:0
//     }
//     fin_arr?.forEach((a) => {
//       find_Arr_total.Wt += a?.Wt;
//     })
//     setFindingArrTotal(find_Arr_total);
//     setFindingArr(fin_arr);

//   }
//   return (
//     <>
//     {
//       loader ? <Loader /> : <>{msg === '' ? <div className='export_print_a_container '>
//                 <div className='my-2 d_none_eia w-100 d-flex justify-content-end'>           
//                     <input type="button" className="btn_white blue me-0" value="Print" onClick={(e) => handlePrint(e)} />
//                 </div>
//                   <div className='first_page_eia'>
//                     <div className="d-flex border border-black">
//                       <div className='p-2 col-6 border-end border-black'>
//                           <div className="d-flex justify-content-between">
//                               <p className="text-decoration-underline fw-semibold">  </p>
//                               {/* <p className="text-decoration-underline"> Ref. Person Details </p> */}
//                           </div>
//                           <p className='headline_fs_eia fw-bold py-1'>{result?.header?.CompanyFullName}</p>
//                           <p className='fw-semibold'>{result?.header?.CompanyAddress}</p>
//                           <p className='fw-semibold'>{result?.header?.CompanyAddress2}</p>
//                           <p className='fw-semibold'>{result?.header?.CompanyCity + ", " +result?.header?.CompanyCountry}</p>
//                           <p className='fw-semibold'>Telephone No :&nbsp;{result?.header?.CompanyTellNo}</p>
//                           <p className='fw-semibold'>Email Id :&nbsp;{result?.header?.CompanyEmail}</p>
//                       </div>
//                       <div className='col-6'>
//                           <div className='d-flex border-bottom border-black'>
//                               <div className="col-7 border-end border-black p-2">
//                                   <div className=" text-break">
//                                       <div className='fw-bold'>Invoice No. & Date :&nbsp; {result?.header?.EntryDate}</div>
//                                       <div className='fw-normal'>{result?.header?.InvoiceNo} &nbsp; </div>
//                                   </div>
//                                   {/* <div className="d-flex">
//                                       <p className='pe-2 fw-semibold'>Invoice Dt :</p>
//                                       <p className='fw-bold'>{result?.header?.EntryDate}</p>
//                                   </div> */}
//                                   {/* <div className="d-flex">
//                                       <p className='pe-2 fw-semibold'>EDF No. :</p>
//                                       <p className='fw-bold'></p>
//                                   </div> */}
//                               </div>
//                               <div className="col-5 d-flex flex-column justify-content-between align-items-center p-2">
//                                   <p className='text-uppercase fw-semibold w-100 text-start'>Exporter's Ref.</p>
//                                   <p className='text-uppercase fw-semibold'></p>
//                               </div>
//                           </div>
//                           <div className='p-1 d-flex'>
//                               <p className="">Buyer's Order No. & Date</p>
//                           </div>
//                           <div className='p-1 border-top border-black'>
//                               <p className="fw-bold">Other Reference(s)</p>
//                               <p className="fw-semibold">EDF No. </p>
//                           </div>
//                       </div>
//                   </div>
//                   <div className="d-flex border border-top-0 border-black ">
//                       <div className='p-2 col-6 border-end border-black'>
//                           <div className="d-flex justify-content-between">
//                               <p className=" fw-semibold"> Consignee </p>
//                               {/* <p className="text-decoration-underline fw-semibold"> Ref. Person Details </p> */}
//                           </div>
//                           <p className='headline_fs_eia fw-bold py-1'>{result?.header?.customerfirmname}</p>
//                           <p className='fw-semibold'>{result?.header?.customerAddress1}</p>
//                           <p className='fw-semibold'>{result?.header?.customerAddress2}</p>
//                           <p className='fw-semibold'>{result?.header?.customerAddress3} {result?.header?.customercity}, {result?.header?.customercountry}</p>
//                           <p className='fw-semibold'>Telephone No : {result?.header?.customermobileno}</p>
//                           <p className='fw-semibold'>Email Id :{result?.header?.customeremail1}</p>
//                       </div>
//                       <div className='col-6 minHeight_eia'>
//                           <div className='p-2'>
//                               <p className="fw-bold">Buyer (if other than consignee)</p>
//                           </div>
//                       </div>
//                       <div></div>
//                 </div>
//                 <div className="d-flex border border-top-0 border-black overflow-hidden ">
//                       <div className='col-6 border-end border-black'>
//                           <div className="d-flex border-bottom border-black">
//                               <div className="col-6 pt-1 px-1 pb-4 border-end border-black">
//                                   <p className="fw-normal">Pre-Carriage By </p>
//                               </div>
//                               <div className="col-6 pt-1 px-1 pb-4">
//                                   <p className="fw-normal">Place of Receipt by Pre-carrier N.A. </p>
//                               </div>
//                           </div>
//                           <div className="d-flex border-bottom border-black">
//                               <div className="col-6 pt-1 px-1 pb-4 border-end border-black">
//                                   <p className="fw-normal">Vessel/Flight No.</p>
//                                   <p className="">{result?.header?.Flight_NO}</p>
//                               </div>
//                               <div className="col-6 pt-1 px-1 pb-4">
//                                   <p className="fw-normal">Port of Loading</p>
//                                   <p className="">{result?.header?.portofloading}</p>
//                               </div>
//                           </div>
//                           <div className="d-flex ">
//                               <div className="col-6 pt-1 px-1 pb-4 border-end border-black">
//                                   <p className="fw-normal">Port of Discharge</p>
//                                   <p className="">{result?.header?.portofdischarge}</p>
//                               </div>
//                               <div className="col-6 pt-1 px-1 pb-4">
//                                   <p className="fw-normal">Final Destination</p>
//                               </div>
//                           </div>
//                           {/* <div className={`d-flex  h-100`}>
//                               <div className="col-4 border-end border-black p-1 text-center">
//                                   <p className="fw-semibold">Marks & Nos. AS ADDRESS</p>
//                               </div>
//                               <div className="col-4 border-end border-black p-1 text-center">
//                                   <p className="fw-semibold">No & KIND OF PKGS</p>
//                               </div>
//                               <div className="col-4 p-1 text-center">
//                                   <p className="fw-semibold">QUANTITY 2</p>
//                               </div>
//                           </div> */}
//                       </div>
//                       <div className='col-6'>
//                           <div className="d-flex border-black border-bottom">
//                               <div className="col-6 p-2 border-black border-end d-flex">
//                                   <p className="fw-semibold text-center">Country of Origin of Goods : </p>
//                                   <p className="fw-bold text-center">&nbsp;{result?.header?.CompanyCountry}</p>
//                               </div>
//                               <div className="col-6 py-2">
//                                   <p className="fw-semibold text-center">Country of Final Destination : {result?.header?.customercountry}</p>
//                               </div>
//                           </div>
//                           <div className="d-flex border-black border-bottom">
//                               <div className="col-6 p-2">
//                                   <p className="fw-semibold"> Terms of Delivery and payment : {result?.header?.DueDays} Days</p>
//                                   {/* <p className="fw-semibold"> Bank Name : {result?.header?.bankname} </p>
//                                   <p className={`fw-semibold `}> Bank Add : {result?.header?.bankaddress}</p> */}
//                               </div>
//                               <div className="col-6 p-2">
//                                   {/* <div className="d-flex">
//                                       <div className="col-6">
//                                           <p className="fw-semibold text-end"> Payment Terms : </p>
//                                           <p className="fw-semibold text-end"> A/C No. : </p>
//                                       </div>
//                                       <div className="col-6">
//                                           <p className="fw-semibold ps-2" style={{ minHeight: '15.36px' }}> </p>
//                                           <p className="fw-semibold ps-2"> {result?.header?.accountnumber}</p>
//                                       </div>
//                                   </div> */}
//                               </div>
//                           </div>
//                           {/* <div className="">
//                               <p className="px-2 pt-1  fw-semibold"> Description of Goods </p>
//                               <p className="px-2    fw-semibold">{result?.header?.HSN_No}</p>
//                           </div> */}
//                       </div>
//                 </div>
//                 <div className={` w-100  h-100`}>
//                                           <div className=" border border-top-0 border-black p-1 text-start">
//                                               <p className="fw-normal"><span className='fw-bold'>Marks & Nos. Container </span>&nbsp;&nbsp;&nbsp; No & KIND OF PKGS : 1 (ONE) TIN BOX</p>
//                                           </div>
//                                           <div className=" border border-top-0 border-black p-1 text-start">
//                                               <p className="fw-normal"><span className='fw-bold'>AS ADD </span> {metalValue?.QualityName} Branded {metalValue?.ShapeName} & {silverValue?.QualityName} {silverValue?.ShapeName} Plain Jewellery</p>
//                                           </div>
//                                           {/* <div className=" p-1 text-center">
//                                               <p className="fw-semibold">QUANTITY 2</p>
//                                           </div> */}
//                 </div>
//     <div>
//       <div className='d-flex fw-bold border border-black mt-1'>
//         <div className='col_1_eia fw-normal p-1'>SR No</div>
//         <div className='col_2_eia p-1'>Product</div>
//         <div className='col_3_eia p-1'>HSV Code</div>
//         <div className='col_4_eia p-1'>Dia Wt <br /> (Cts)</div>
//         <div className='col_5_eia p-1'>CS Wt <br /> (Cts)</div>
//         <div className='col_6_eia border-end border-black p-1'>Gross Wt <br /> (Gms)</div>
//         <div className='col_7_eia border-end border-black p-1'>Quantity <br /> PCS/PRS</div>
//         <div className='col_8_eia border-end border-black p-1'>Rate</div>
//         <div className='col_9_eia p-1'>Amount <br /> {result?.header?.CurrencyCode}</div>
//       </div>
//       {
//         metCatWiseData?.map((e, i) => {
//           return (
//             <div className='d-flex fw-normal border border-top-0 border-black ' key={i}>
//               <div className='col_1_eia fw-normal p-1'>{i + 1}</div>
//               <div className='col_2_eia p-1'>{ e?.Categoryname + " "+ e?.MetalTypePurity }</div>
//               <div className='col_3_eia p-1'>{e?.HUID}</div>
//               <div className='col_4_eia p-1'>{e?.totals?.diamonds?.Wt?.toFixed(3)}</div>
//               <div className='col_5_eia p-1'>{e?.totals?.colorstone?.Wt?.toFixed(3)} </div>
//               <div className='col_6_eia border-end border-black p-1'>{e?.grosswt?.toFixed(3)} </div>
//               <div className='col_7_eia border-end border-black p-1'>{e?.Quantity} </div>
//               <div className='col_8_eia border-end border-black p-1'>{formatAmount((((e?.TotalAmount / result?.header?.CurrencyExchRate) / e?.Quantity)))}</div>
//               <div className='col_9_eia p-1'>{formatAmount((e?.TotalAmount / result?.header?.CurrencyExchRate))} </div>
//             </div>
//           )
//         })
//       }
//     </div>
//     <div className='d-flex border border-black border-top-0 minHeight_sign_eia'>
//       <div className='w-75 d-flex flex-column align-items-start ps-2 justify-content-center border-end border-black'>
//         <div>Declaration : </div>
//         <div className='text-break'>We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct</div>
//       </div>
//       <div  className='w-25 d-flex  align-items-end ps-2 fw-bolder justify-content-start '>Authorized Signatory</div>
//     </div>
//     </div>
//     <div className='fw-bold ps-1 mt-1'>INVOICE</div>
//     <div className="d-flex border border-black">
//                       <div className='p-2 col-6 border-end border-black'>
//                           <div className="d-flex justify-content-between">
//                               <p className="text-decoration-underline fw-semibold"> Exporter: </p>
//                               {/* <p className="text-decoration-underline"> Ref. Person Details </p> */}
//                           </div>
//                           <p className='headline_fs_eia fw-bold py-1'>{result?.header?.CompanyFullName}</p>
//                           <p className='fw-semibold'>{result?.header?.CompanyAddress}</p>
//                           <p className='fw-semibold'>{result?.header?.CompanyAddress2}</p>
//                           <p className='fw-semibold'>{result?.header?.CompanyCity +", "+ result?.header?.CompanyCountry}</p>
//                           <p className='fw-semibold'>Telephone No :&nbsp;{result?.header?.CompanyTellNo}</p>
//                           <p className='fw-semibold'>Email Id :&nbsp;{result?.header?.CompanyEmail}</p>
//                       </div>
//                       <div className='col-6'>
//                           <div className='d-flex border-bottom border-black'>
//                               <div className="col-6 border-end border-black p-2">
//                                   <div className="">
//                                       <div className='pe-2 fw-semibold'>Invoice No. & Date : {result?.header?.EntryDate}</div>
//                                       <div className='fw-normal'>{result?.header?.InvoiceNo} </div>
//                                   </div>
//                                   {/* <div className="d-flex">
//                                       <p className='pe-2 fw-semibold'>Invoice Dt :</p>
//                                       <p className='fw-bold'>{result?.header?.EntryDate}</p>
//                                   </div> */}
//                                   {/* <div className="d-flex">
//                                       <p className='pe-2 fw-semibold'>EDF No. :</p>
//                                       <p className='fw-bold'></p>
//                                   </div> */}
//                               </div>
//                               <div className="col-6 d-flex flex-column justify-content-between align-items-center p-2">
//                                   <p className='text-uppercase fw-semibold w-100'>Exporter's Ref.</p>
//                                   <p className='text-uppercase fw-semibold'></p>
//                               </div>
//                           </div>
//                           <div className='p-1 d-flex'>
//                               <p className="fw-normal">Buyer's Order No. & Date</p>
//                           </div>
//                           <div className='p-1 border-top border-black'>
//                               <p className="fw-bold">Other Reference</p>
//                               <p className="fw-normal">EDF No. </p>
//                           </div>
//                       </div>
//                 </div>
//                 <div className={` w-100  h-100 mt-3`}>
//                               <div className=" border border-top border-black p-1 text-start">
//                                   <p className="fw-normal"><span className='fw-bold'>Marks & Nos. Container </span>&nbsp;&nbsp;&nbsp; No & KIND OF PKGS : 1 (ONE) TIN BOX</p>
//                               </div>
//                               <div className=" border border-top-0 border-black p-1 text-start">
//                                   <p className="fw-normal"><span className='fw-bold'>AS ADD </span>&nbsp;&nbsp;&nbsp; {metalValue?.QualityName} Branded {metalValue?.ShapeName} & {silverValue?.QualityName} {silverValue?.ShapeName} Plain Jewellery</p>
//                               </div>
//                               {/* <div className=" p-1 text-center">
//                                   <p className="fw-semibold">QUANTITY 2</p>
//                               </div> */}
//     </div>
//     <div className='mt-3'>
//         <div className='d-flex border border-black fw-semibold'>
//             <div className='col_t2_1_eia p-1 '>RM KT</div>
//             <div className='col_t2_2_eia p-1 '>Loss %</div>
//             <div className='col_t2_3_eia p-1 '>Met Wt</div>
//             <div className='col_t2_4_eia p-1 '>Pure MetWt</div>
//             <div className='col_t2_5_eia p-1 '>LossWt</div>
//             <div className='col_t2_6_eia p-1 '>PureLossWt</div>
//             <div className='col_t2_7_eia p-1 '>TotWt</div>
//             <div className='col_t2_8_eia p-1'>PureTotWt</div>
//         </div>


//         { metalGoldPurityWise?.length > 0 && <div className='d-flex border border-black border-top-0 fw-semibold'>
//             <div className='col_t2_1_eia p-1 fw-bold'>Gold</div>
//             <div className='col_t2_2_eia p-1 '></div>
//             <div className='col_t2_3_eia p-1 '></div>
//             <div className='col_t2_4_eia p-1 '></div>
//             <div className='col_t2_5_eia p-1 '></div>
//             <div className='col_t2_6_eia p-1 '></div>
//             <div className='col_t2_7_eia p-1 '></div>
//             <div className='col_t2_8_eia p-1'></div>
//         </div>}
//         {
//           metalGoldPurityWise?.map((e, i) => {
//             return (
              
//               <div className='d-flex border-start border-black border-start border-end fw-semibold' key={i}>
//                 <div className='col_t2_1_eia p-1 '>{e?.MetalTypePurity}</div>
//                 <div className='col_t2_2_eia p-1 '>{e?.LossPer}%</div>
//                 <div className='col_t2_3_eia p-1 '>{e?.NetWt?.toFixed(3)}</div>
//                 <div className='col_t2_4_eia p-1 '>{e?.PureNetWt?.toFixed(3)}</div>
//                 <div className='col_t2_5_eia p-1 '>{e?.LossWt?.toFixed(3)}</div>
//                 <div className='col_t2_6_eia p-1 '></div>
//                 <div className='col_t2_7_eia p-1 '>{(e?.NetWt + e?.LossWt)?.toFixed(3)}</div>
//                 <div className='col_t2_8_eia p-1'>{e?.PureNetWt?.toFixed(3)}</div>
//             </div> 
            
//             )
//           })
//         }
//         { metalGoldPurityWise?.length > 0 && <div className='d-flex border border-black border-top-0 fw-semibold'>
//             <div className='col_t2_1_eia p-1 fw-bold'>{metalGoldPurityWiseTotal?.ShapeName}</div>
//             <div className='col_t2_2_eia p-1 '></div>
//             <div className='col_t2_3_eia p-1 fw-bold'>{metalGoldPurityWiseTotal?.NetWt?.toFixed(3)}</div>
//             <div className='col_t2_4_eia p-1 fw-bold'>{metalGoldPurityWiseTotal?.PureNetWt?.toFixed(3)}</div>
//             <div className='col_t2_5_eia p-1 fw-bold'>{metalGoldPurityWiseTotal?.LossWt?.toFixed(3)}</div>
//             <div className='col_t2_6_eia p-1 '></div>
//             <div className='col_t2_7_eia p-1 fw-bold'>{(metalGoldPurityWiseTotal?.LossWt + metalGoldPurityWiseTotal?.NetWt)?.toFixed(3)}</div>
//             <div className='col_t2_8_eia p-1 fw-bold'>{metalGoldPurityWiseTotal?.PureNetWt?.toFixed(3)}</div>
//         </div>}


//         { metalWithoutGoldPurityWise?.length > 0 && <div className='d-flex border border-black border-top-0 fw-semibold'>
//             <div className='col_t2_1_eia p-1 fw-bold'>{metalWithoutGoldPurityWise[0]?.MetalType}</div>
//             <div className='col_t2_2_eia p-1 '></div>
//             <div className='col_t2_3_eia p-1 '></div>
//             <div className='col_t2_4_eia p-1 '></div>
//             <div className='col_t2_5_eia p-1 '></div>
//             <div className='col_t2_6_eia p-1 '></div>
//             <div className='col_t2_7_eia p-1 '></div>
//             <div className='col_t2_8_eia p-1'></div>
//         </div>}
//         {
//           metalWithoutGoldPurityWise?.map((e, i) => {
//             return (
              
//               <div className='d-flex border-start border-black border-start border-end fw-semibold' key={i}>
//                 <div className='col_t2_1_eia p-1 '>{e?.MetalTypePurity}</div>
//                 <div className='col_t2_2_eia p-1 '>{e?.LossPer}%</div>
//                 <div className='col_t2_3_eia p-1 '>{e?.NetWt?.toFixed(3)}</div>
//                 <div className='col_t2_4_eia p-1 '>{e?.PureNetWt?.toFixed(3)}</div>
//                 <div className='col_t2_5_eia p-1 '>{e?.LossWt?.toFixed(3)}</div>
//                 <div className='col_t2_6_eia p-1 '></div>
//                 <div className='col_t2_7_eia p-1 '>{(e?.NetWt + e?.LossWt)?.toFixed(3)}</div>
//                 <div className='col_t2_8_eia p-1'>{e?.PureNetWt?.toFixed(3)}</div>
//             </div> 
            
//             )
//           })
//         }
        
//         { metalWithoutGoldPurityWise?.length > 0 && <div className='d-flex border border-black border-top-0 fw-semibold'>
//             <div className='col_t2_1_eia p-1 fw-bold'>{metalWithoutGoldPurityWiseTotal?.ShapeName}</div>
//             <div className='col_t2_2_eia p-1 '></div>
//             <div className='col_t2_3_eia p-1 fw-bold'>{metalWithoutGoldPurityWiseTotal?.NetWt?.toFixed(3)}</div>
//             <div className='col_t2_4_eia p-1 fw-bold'>{metalWithoutGoldPurityWiseTotal?.PureNetWt?.toFixed(3)}</div>
//             <div className='col_t2_5_eia p-1 fw-bold'>{metalWithoutGoldPurityWiseTotal?.LossWt?.toFixed(3)}</div>
//             <div className='col_t2_6_eia p-1 fw-bold'></div>
//             <div className='col_t2_7_eia p-1 fw-bold'>{(metalWithoutGoldPurityWiseTotal?.NetWt + metalWithoutGoldPurityWiseTotal?.LossWt)?.toFixed(3)}</div>
//             <div className='col_t2_8_eia p-1 fw-bold'>{metalWithoutGoldPurityWiseTotal?.PureNetWt?.toFixed(3)}</div>
//         </div>}


        
//          { findingArr?.length > 0 && <div className='d-flex border border-black border-top-0 fw-semibold'>
//             <div className='col_t2_1_eia p-1 fw-bold'>Accessories</div>
//             <div className='col_t2_2_eia p-1 '></div>
//             <div className='col_t2_3_eia p-1 '></div>
//             <div className='col_t2_4_eia p-1 '></div>
//             <div className='col_t2_5_eia p-1 '></div>
//             <div className='col_t2_6_eia p-1 '></div>
//             <div className='col_t2_7_eia p-1 '></div>
//             <div className='col_t2_8_eia p-1'></div>
//         </div>}

//                     {
//                       findingArr?.map((a, ind) => {
//                         return (
//                           <div className='d-flex border-start border-black  border-start border-end fw-semibold' key={ind}>
//                             <div className='col_t2_1_eia p-1 '>{a?.FindingAccessories}</div>
//                             <div className='col_t2_2_eia p-1 '></div>
//                             <div className='col_t2_3_eia p-1 '>{a?.Wt?.toFixed(3)}</div>
//                             <div className='col_t2_4_eia p-1 '></div>
//                             <div className='col_t2_5_eia p-1 '></div>
//                             <div className='col_t2_6_eia p-1 '></div>
//                             <div className='col_t2_7_eia p-1 '></div>
//                             <div className='col_t2_8_eia p-1'></div>
//                           </div> 
//                         )
//                       })
//                     }
//                     { findingArr?.length > 0 && <div className='d-flex border border-black border-top-0 fw-semibold'>
//                         <div className='col_t2_1_eia p-1 fw-bold'>Total</div>
//                         <div className='col_t2_2_eia p-1 '></div>
//                         <div className='col_t2_3_eia p-1 fw-bold'>{findingArrTotal?.Wt?.toFixed(3)}</div>
//                         <div className='col_t2_4_eia p-1 '></div>
//                         <div className='col_t2_5_eia p-1 '></div>
//                         <div className='col_t2_6_eia p-1 '></div>
//                         <div className='col_t2_7_eia p-1 '></div>
//                         <div className='col_t2_8_eia p-1'></div>
//                     </div>}
              
        

//     </div>
//     <div>
//       <div className='border border-black mt-3 px-1'>Note: Insurance By :- FUTURE GENERALI INSURANCE</div>

//       <div className='d-flex border border-top-0  border-black fw-semibold'>
//         <div className='col_t3_1_eia'></div>
//         <div className='col_t3_2_eia fw-bold'></div>
//         <div className='col_t3_3_eia'>
//           <div>PCS</div>
//           {/* <div>PRS</div> */}
//         </div>
//         <div className='col_t3_4_eia'>
//           <div>{result?.mainTotal?.Quantity}</div>
//           {/* <div>4.000</div> */}
//         </div>
//         <div className='col_t3_5_eia'>FOB</div>
//         <div className='col_t3_6_eia'>{formatAmount(result?.mainTotal?.TotalAmount)}</div>
//       </div>

//       <div className='d-flex border border-top-0  border-black fw-semibold'>
//         <div className='col_t3_1_eia ps-1'>Freight</div>
//         <div className='col_t3_2_eia fw-bold'></div>
//         <div className='col_t3_3_eia'>
//           {/* <div>PCS</div>
//           <div>PRS</div> */}
//         </div>
//         <div className='col_t3_4_eia'>
//           {/* <div>7.000</div>
//           <div>4.000</div> */}
//         </div>
//         <div className='col_t3_5_eia'>FRI</div>
//         <div className='col_t3_6_eia'>{formatAmount(result?.header?.FreightCharges)}</div>
//       </div>

//       <div className='d-flex border border-top-0  border-black fw-semibold'>
//         <div className='col_t3_1_eia ps-1'>Insurance</div>
//         <div className='col_t3_2_eia fw-bold'></div>
//         <div className='col_t3_3_eia'>
//           {/* <div>PCS</div>
//           <div>PRS</div> */}
//         </div>
//         <div className='col_t3_4_eia'>
//           {/* <div>7.000</div>
//           <div>4.000</div> */}
//         </div>
//         <div className='col_t3_5_eia'>INS</div>
//         <div className='col_t3_6_eia'></div>
//       </div>

//       <div className='d-flex border border-top-0  border-black fw-semibold'>
//         <div className='col_t3_1_eia ps-1'>Convt. Rt {result?.header?.CurrencyExchRate} Value in Rs. </div>
//         <div className='col_t3_2_eia fw-bold'></div>
//         <div className='col_t3_3_eia'>
//           {/* <div>PCS</div>
//           <div>PRS</div> */}
//         </div>
//         <div className='col_t3_4_eia'>
//           {/* <div>7.000</div>
//           <div>4.000</div> */}
//         </div>
//         <div className='col_t3_5_eia'>Total CIF</div>
//         <div className='col_t3_6_eia'>{formatAmount((result?.mainTotal?.TotalAmount + result?.header?.FreightCharges))}</div>
//       </div>
//     </div>
//     <div className='border border-black mt-3 p-1 text-break fw-semibold'>
//       Amount Chargeable : {numberToWord((result?.mainTotal?.TotalAmount + result?.header?.FreightCharges))}
//     </div>
//     <div className='mt-1'>Declaration : <span dangerouslySetInnerHTML={{__html:result?.header?.Declaration}} className='decl_eia'></span></div>
//     <div>
//       {/* <div>Declaration : </div>
//       <div className='text-break'>We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</div> */}
//     </div>
//     <div className='d-flex minHeight_sign_eia border border-black'>
//       <div className='w-75 border-end border-black d-flex justify-content-end ps-1 align-items-start flex-column'>
//         <div>Declaration : </div>
//         <div className='text-break'>We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</div>
//       </div>
//       <div className='w-25 ps-2 d-flex justify-content-start align-items-end'>Authorized Signatory</div>
//     </div>
//   </div> : <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto"> {msg} </p>}</>
//     }
//     </>
//   )
// }

// export default ExportInvoiceA