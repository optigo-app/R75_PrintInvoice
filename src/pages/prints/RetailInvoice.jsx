import React, { useEffect, useState } from 'react'
import Loader from '../../components/Loader';
import { apiCall, checkMsg, formatAmount, handleImageError, isObjectEmpty } from '../../GlobalFunctions';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import "../../assets/css/prints/retailinvoice.css";
import Button from './../../GlobalFunctions/Button';
import { ToWords } from 'to-words';
const RetailInvoice = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {
    const [result, setResult] = useState(null);
    const [msg, setMsg] = useState("");
    const [loader, setLoader] = useState(true);
    const toWords = new ToWords();
     
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

    let datas = OrganizeDataPrint(
      data?.BillPrint_Json[0],
      data?.BillPrint_Json1,
      data?.BillPrint_Json2
    );
    let finalArr =[];
    datas?.resultArray?.forEach((e) => {
        let obj = {...e};
        let discountOn = [];
        if(e?.IsCriteriabasedAmount === 1){
            if(e?.IsMetalAmount === 1){
                discountOn.push('Metal')
            }
            if(e?.IsDiamondAmount === 1){
                discountOn.push('Diamond')
            }
            if(e?.IsStoneAmount === 1){
                discountOn.push('Stone')
            }
            if(e?.IsMiscAmount === 1){
                discountOn.push('Misc')
            }
            if(e?.IsLabourAmount === 1){
                discountOn.push('Labour')
            }
            if(e?.IsSolitaireAmount === 1){
                discountOn.push('Solitaire')
            }
        }else{
            if(e?.Discount !== 0){
                discountOn.push('Total Amount')
            }
        }
        
        obj.discountOn = discountOn; 
        obj.str_discountOn = discountOn?.join('  ');
        
        finalArr.push(obj);
    })

    datas.resultArray = finalArr;

    let invpaydet = [];

    let abc = datas?.header?.InvPayDet?.split("@-@");
    let newarr = [];
    abc?.forEach((item) => {
        let val = item?.toLowerCase();
        let obj = {};
        let doc_no;
        if(val?.includes("cash") && val?.includes("-##-")){
            let amtby = val?.split("-##-")[0];
            let name = amtby?.split("#")[0];
            obj.name = name;
            let amtby1 = val?.split("-##-")[1];
            let cashamt = amtby1?.split("#")[1];
            obj.amount = Number(cashamt);
            obj.docno = '';
            invpaydet.push(obj);
        }
        if(val?.includes("discount") && val?.includes("-##-")){
            let amtby = val?.split("-##-")[0];
            let name = amtby?.split("#")[0];
            obj.name = name;
            let amtby1 = val?.split("-##-")[1];
            let cashamt = amtby1?.split("#")[1];
            obj.amount = Number(cashamt);
            obj.docno = '';
            invpaydet.push(obj);
        }
        if(val?.includes("cheque") && val?.includes("#-#")){
            let name = val?.split("#-#")[0];
            let docno = val?.split("#-#")[1];
            let amt = val?.split("#-#")[2];
            obj.name = name;
            obj.docno = docno;
            obj.amount = amt;
            doc_no = docno;
            invpaydet.push(obj);
        }
        if(val?.includes("discount")){
            if(val?.includes("-##-")){
                return
            }else{
                newarr.push(val)
            }
        }
        
    })
    let disarr = [];
    newarr?.forEach((e) => {
        let val = e?.toLowerCase();
        let obj = {};
        if(val?.includes("#-#")){
            let name = e?.split("#-#")[0];
            let docno = e?.split("#-#")[1];
            let amount = e?.split("#-#")[2];
            obj.name = name;
            obj.docno = docno;
            obj.amount = amount;
            disarr.push(obj);
        }
    })
    
    let mainarr = [...invpaydet, ...disarr];
    datas.header.mainarr = mainarr;

    let totalAmt = 0;

    mainarr?.forEach((e) => {
        totalAmt += (+e?.amount);
    })

    datas.header.maindistotal = totalAmt;

    setResult(datas);
    
  }



  return (
    <>
        {
            loader ? <Loader /> : <>
            {
                msg === '' ? <div className='container_ri fs_ri'>
                    <div className='my-2 d-none_ri'><Button /></div>
                    <div className='printheadlabel_ri'> {result?.header?.PrintHeadLabel} </div>
                    <div className='d-flex justify-content-between align-items-center p-1 mt-1'>
                        <div className='box1_ri'><div className='fw-bold w-25'>BILL NO :</div><div className='w-75 center_ri'>{result?.header?.InvoiceNo}</div></div>
                        <div className='box1_ri'><div className='fw-bold w-25'>{result?.header?.HSN_No_Label} :</div><div className='w-75 center_ri'>{result?.header?.HSN_No}</div></div>
                        <div className='box1_ri'><div className='fw-bold w-25'>DATE :</div><div className='w-75 center_ri'>{result?.header?.EntryDate}</div></div>
                    </div>
                    <div className='mt-1 border-black border d-flex pbia'>
                        <div className='pe-3 p-1 lh-lg'>TO,</div>
                        <div className='p-1 fs_ri'>
                            <div className='fw-bold lh-lg'>{result?.header?.CustName}</div>
                            <div>{result?.header?.customerstreet}</div>
                            <div>{result?.header?.customerregion}</div>
                            <div>{result?.header?.customercity}{result?.header?.customerpincode}</div>
                        </div>
                    </div>
                    <div className='p-1 border border-black border-top-0 fw-bold'>{result?.header?.RetailInvoiceMsg}</div>

                    <div className='table_ri '>
                        <div className='thead_ri d-flex fs_ri border border-top-0 border-black '>
                            <div className='text-break p-1 col1_ri center_ri'>Variant No/ Product Description</div>
                            <div className='p-1 col2_ri center_ri'>KT</div>
                            <div className='p-1 col3_ri center_ri'>Qty</div>
                            <div className='text-break p-1 col4_ri center_ri'>Gross Wt(gms)</div>
                            <div className='text-break p-1 col5_ri center_ri'>Dia Wt <br />(gms/carat)</div>
                            <div className='text-break p-1 col6_ri center_ri'>Stone Wt <br />(gms/carat)</div>
                            <div className='text-break p-1 col7_ri center_ri'>Net Wt(gms)</div>
                            <div className='text-break p-1 col8_ri center_ri'>Price(Rs)</div>
                            <div className='p-1 col9_ri center_ri'>Image</div>
                            <div className='text-break p-1 col10_ri center_ri'>Scheme <br /> Discount</div>
                            <div className='text-break p-1 col11_ri center_ri'>Scheme <br /> Discount(Rs)</div>
                            <div className='text-break p-1 col12_ri center_ri'>Product <br /> Value(Rs)</div>
                        </div>
                        <div className='tbody_ri fs_ri'>
                            {
                                result?.resultArray?.map((e, i) => {
                                    return <div className='d-flex pbia brb_clr' key={i} style={{borderLeft:'1px solid black', borderRight:'1px solid black'}}>
                                    <div className='text-break p-1 col1_ri start_jus_ri'>{e?.designno + "/  " + e?.SrJobno }<br />{ e?.MetalPurity + " " + e?.Categoryname}</div>
                                    <div className='p-1 col2_ri center_ri'>{e?.MetalPurity}</div>
                                    <div className='p-1 col3_ri center_ri'>{e?.Quantity}</div>
                                    <div className='text-break p-1 col4_ri center_ri'>{e?.grosswt?.toFixed(3)}</div>
                                    <div className='text-break p-1 col5_ri center_ri'>{e?.totals?.diamonds?.Wt?.toFixed(3)}</div>
                                    <div className='text-break p-1 col6_ri center_ri'>{e?.totals?.colorstone?.Wt?.toFixed(3)}</div>
                                    <div className='text-break p-1 col7_ri center_ri'>{((e?.NetWt + e?.LossWt) - e?.totals?.metal?.WithOutPrimaryMetal)?.toFixed(3)}</div>
                                    {/* <div className='text-break p-1 col8_ri center_ri'>{formatAmount((e?.UnitCost - (e?.totals?.finding?.SettingAmount + e?.totals?.metal?.withoutPrimaryMetal_Amount)))}</div> */}
                                    {/* <div className='text-break p-1 col8_ri center_ri'>{formatAmount(((e?.UnitCost + e?.OtherCharges)))}</div> */}
                                    <div className='text-break p-1 col8_ri center_ri'>{formatAmount(((e?.UnitCost )))}</div>
                                    <div className='p-1 col9_ri center_ri'><img src={e?.DesignImage} alt="#jobimg" onError={(e) => handleImageError(e)} className='img_ri' /></div>
                                    {/* <div className='text-break p-1 col10_ri center_ri flex-column'><span>{e?.IsCriteriabasedAmount === 0 ? '-' : `${formatAmount(e?.Discount)} % On `  } </span><span>{e?.discountOn?.map((el, ind) => <div key={ind}>{el}</div>)}</span></div> */}
                                    <div className='text-break p-1 col10_ri center_ri flex-column'>
                                        { e?.Discount === 0 ? '-' : <span className='text-break'>
                                            { `${formatAmount(e?.Discount)} % On ${e?.str_discountOn}` }
                                            {/* {e?.discountOn?.map((el, ind) => <div className='text-break' key={ind}>{`${formatAmount(e?.Discount)} % On ${el}`}</div>)} */}
                                        </span> }
                                    </div>
                                    <div className='text-break p-1 col11_ri center_ri'>{formatAmount(e?.DiscountAmt)}</div>
                                    <div className='text-break p-1 col12_ri center_ri' style={{justifyContent:'flex-end'}}>{formatAmount(e?.TotalAmount)}</div>
                                    </div>
                                })
                            }
                        </div>
                        <div className='thead_ri d-flex fs_ri pbia border border-black'>
                            <div className='text-break p-1 col1_ri start_jus_ri'>Total</div>
                            <div className='p-1 col2_ri center_ri'></div>
                            <div className='p-1 col3_ri center_ri'>{result?.mainTotal?.total_Quantity}</div>
                            <div className='text-break p-1 col4_ri center_ri'>{result?.mainTotal?.grosswt?.toFixed(3)}</div>
                            <div className='text-break p-1 col5_ri center_ri'>{result?.mainTotal?.diamonds?.Wt?.toFixed(3)}</div>
                            <div className='text-break p-1 col6_ri center_ri'>{result?.mainTotal?.colorstone?.Wt?.toFixed(3)}</div>
                            {/* <div className='text-break p-1 col7_ri center_ri'>{((result?.mainTotal?.netwt + result?.mainTotal?.lossWt))?.toFixed(3)}</div> */}
                            <div className='text-break p-1 col7_ri center_ri'>{((result?.mainTotal?.metal?.IsPrimaryMetal))?.toFixed(3)}</div>
                            {/* <div className='text-break p-1 col8_ri center_ri'>{formatAmount(((result?.mainTotal?.total_unitcost + result?.mainTotal?.total_other)))}</div> */}
                            <div className='text-break p-1 col8_ri center_ri'>{formatAmount(((result?.mainTotal?.total_unitcost )))}</div>
                            <div className='p-1 col9_ri center_ri'></div>
                            <div className='text-break p-1 col10_ri center_ri'></div>
                            <div className='text-break p-1 col11_ri center_ri'>{formatAmount(result?.mainTotal?.total_discount_amount)}</div>
                            <div className='text-break p-1 col12_ri center_ri' style={{justifyContent:'flex-end'}}>{formatAmount(result?.mainTotal?.total_amount)}</div>
                        </div>
                        <div className='d-flex justify-content-end align-items-center p-1 border-black border border-top-0 pbia'>
                            <div className='d-flex justify-content-between align-items-center fs_ri' style={{width:'30%'}}>
                                <div>Product Total Value</div>
                                <div>{formatAmount(result?.mainTotal?.total_amount)}</div>
                            </div>
                        </div>
                    </div>
                    <div className='d-flex w-100 border border-black border-top-0 pbia'>
                        <div className='w-50'>
                            <div className='fw-bold p-1'>Product Details</div>
                            <div className='d-flex  border-bottom border-black'>
                                <div className='w-25 p-1'>Payment Mode</div>
                                <div className='w-25 p-1'>Doc No.</div>
                                <div className='w-25 p-1'>Customer Name</div>
                                <div className='w-25 p-1 end_ri'>Amount(Rs)</div>
                            </div>
                            {
                                result?.header?.mainarr?.map((e, ind) => {
                                    return <div className='d-flex  border-bottom border-black' key={ind}>
                                    <div className='w-25 p-1'>{e?.name}</div>
                                    <div className='w-25 p-1'>{e?.docno}</div>
                                    <div className='w-25 p-1'></div>
                                    <div className='w-25 p-1 end_ri'>{formatAmount(e?.amount)}</div>
                                </div>
                                })
                            }
                            <div className='d-flex  border-bottom border-black fw-bold'>
                                <div className='w-25 p-1'>Total Amount Paid</div>
                                <div className='w-25 p-1'></div>
                                <div className='w-25 p-1'></div>
                                <div className='w-25 p-1 end_ri'>{formatAmount(result?.header?.maindistotal)}</div>
                            </div>
                            <div className='d-flex  border-bottom border-black fw-bold'>
                                <div className='w-25 p-1'>Balance Amount</div>
                                <div className='w-25 p-1'></div>
                                <div className='w-25 p-1'></div>
                                <div className='w-25 p-1 end_ri'>{formatAmount(result?.header?.LedgerBal)}</div>
                            </div>
                            <div style={{marginTop:'8rem'}} className='p-1'>
                                <div>For : {result?.header?.CompanyFullName}</div> 
                                <div className='mt-5'>Authorised Signatory</div>
                            </div>
                        </div>
                        <div className='w-50 border-start border-black fs_ri'>
                            <div className='d-flex justify-content-between border-bottom border-black p-1'><div className=''>Total Value</div><div className=''>{formatAmount(result?.mainTotal?.total_amount)}</div></div>
                            <div className='d-flex justify-content-between  border-bottom border-black p-1'><div className=''>Value after Discount</div><div className=''>{formatAmount((result?.mainTotal?.total_amount + result?.header?.AddLess))}</div></div>
                            {
                                result?.allTaxes?.map((e, ins) => {
                                    return <div className='d-flex justify-content-between p-1  border-bottom border-black' key={ins}>
                                            <div className=''>{e?.name} @ {e?.per}</div><div className=''>{formatAmount(((+e?.amount) * result?.header?.CurrencyExchRate))}</div>
                                           </div>
                                })
                            }
                            <div className='d-flex justify-content-between p-1  border-bottom border-black'><div className=''>Less - Other Discount</div><div className=''>{formatAmount(result?.header?.AddLess)}</div></div>
                            <div className='d-flex justify-content-between p-1 border-bottom border-black'><div className=''>Net Invoice Value</div><div className=''>{formatAmount(( result?.mainTotal?.total_amount + (result?.allTaxesTotal * result?.header?.CurrencyExchRate) + result?.header?.AddLess))}</div></div>
                            <div className='d-flex justify-content-between p-1 border-bottom border-black'><div className=''>Total Amount to be paid</div><div className=''>{formatAmount(( result?.mainTotal?.total_amount + (result?.allTaxesTotal * result?.header?.CurrencyExchRate) + result?.header?.AddLess))}</div></div>
                            <div className='d-flex justify-content-between p-1 border-bottom border-black'><div className='text-break'>Value In Words : {toWords.convert(+( result?.mainTotal?.total_amount + (result?.allTaxesTotal * result?.header?.CurrencyExchRate) + result?.header?.AddLess)?.toFixed(2))} Only</div></div>
                            <div style={{marginTop:'8rem'}} className='p-1'>
                                <div>Customer Name : {result?.header?.CustName}</div> 
                                <div className='mt-5'>Customer Signature</div>
                            </div>
                        </div>
                    </div>
                    <div className='fw-bold border border-black p-1 border-top-0 pbia note_ri'>
                        <div>NOTE:</div>
                        <div dangerouslySetInnerHTML={{__html:result?.header?.Declaration}}></div>
                    </div>
                </div> : <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
                {msg}
              </p>
            }
            </>
        }
    </>
  )
}

export default RetailInvoice