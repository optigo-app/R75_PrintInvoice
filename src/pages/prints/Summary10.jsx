import React, { useEffect, useState } from "react";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";
import { apiCall, checkMsg, formatAmount, handlePrint, isObjectEmpty, numberToWord } from "../../GlobalFunctions";
import "../../assets/css/prints/summary10.css";
import { cloneDeep } from 'lodash';
import Loader from './../../components/Loader';
import { ToWords } from "to-words";
const Summary10 = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
  const toWords = new ToWords();
  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const [categoryWise, setCategoryWise] = useState([]);

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
  const [isImageWorking, setIsImageWorking] = useState(true);
  const handleImageErrors = () => {
    setIsImageWorking(false);
  };
  const loadData = (data) => {
    let address = data?.BillPrint_Json[0]?.Printlable?.split("\r\n");
    data.BillPrint_Json[0].address = address;

    const datas = OrganizeDataPrint(
      data?.BillPrint_Json[0],
      data?.BillPrint_Json1,
      data?.BillPrint_Json2
    );
    let data_s = cloneDeep(datas);
    let catwise = [];
    data_s?.resultArray?.forEach((a) => {
      let find_record = catwise?.findIndex((al) => (al?.Categoryname === a?.Categoryname) && (al?.SubCategoryname === a?.SubCategoryname));
      if (find_record === -1) {
        let obj = {...a};
        a._Quantity = a?.Quantity;
        catwise.push(a);
      } else {
        catwise[find_record]._Quantity += a?.Quantity;
      }
    })

    datas?.resultArray?.sort((a, b) => a?.designno - b?.designno)
    setCategoryWise(catwise);
    setResult(datas);
    setLoader(false);
  };

  return (
    <>
      {
        loader ? <Loader /> : <>
          {
            msg === '' ? <div className="container_s10">
              <div className="mb-5 mt-5 d-flex justify-content-end align-items-start hideBtn_s10"><button className="btn_white blue py-1" onClick={(e) => handlePrint(e)}>Print</button></div>
              {/* header */}
              <div className="border-bottom">
                <div className="headlalbel_s10 fw-bold ps-2 fs_s10_com">{result?.header?.PrintHeadLabel}</div>
                <div className="d-flex justify-content-between align-items-center p-1">
                  <div className="lh_s10 fs_s10">
                    <div className="fw-bold pb-1 pt-1 fs_s10_com">{result?.header?.CompanyFullName}</div>
                    <div>{result?.header?.CompanyAddress}</div>
                    <div>{result?.header?.CompanyCity}-{result?.header?.CompanyPinCode},{result?.header?.CompanyState}({result?.header?.CompanyCountry})</div>
                    <div>T-{result?.header?.CompanyTellNo} {result?.header?.CompanyTollFreeNo}</div>
                    <div>{result?.header?.CompanyEmail} {result?.header?.CompanyWebsite}</div>
                  </div>
                  <div className="d-flex justify-content-end align-items-center">
                    {/* <img src={result?.header?.PrintLogo} className="plogo_s10" alt="" /> */}
                    {isImageWorking && (result?.header?.PrintLogo !== "" &&
                      <img src={result?.header?.PrintLogo} alt=""
                        className={` plogo_s10`}
                        style={{maxWidth:'116px'}}
                        onError={handleImageErrors} />)}
                  </div>
                </div>
              </div>
              <div className="border mt-1 d-flex justify-content-between align-items-start p-1">
                <div className="d-flex fs_s10_2"><div className="fw-bold">## : </div>&nbsp;{result?.header?.InvoiceNo}</div>
                <div>
                  <div className="d-flex fs_s10_2"><div className="fw-bold">DATE : </div>&nbsp;{result?.header?.EntryDate}</div>
                  <div className="d-flex fs_s10_2"><div className="fw-bold">{result?.header?.HSN_No_Label}&nbsp;&nbsp; : </div>&nbsp;&nbsp;{result?.header?.HSN_No}</div>
                </div>
              </div>
              <div className="p-1 border border-top-0 fs_s10 lh_s10">
                <div className="fw-bold  fs_s10_cust py-2">{result?.header?.customerfirmname}</div>
                <div>{result?.header?.customerstreet}</div>
                <div>{result?.header?.customerAddress2}</div>
                <div>{result?.header?.customercity}</div>
                <div>{result?.header?.customermobileno}</div>
                <div>{result?.header?.vat_cst_pan} | {result?.header?.Cust_CST_STATE}-{result?.header?.Cust_CST_STATE_No}</div>
              </div>

              {/* table */}
              <div>
                {/* table head */}
                <div className="d-flex fw-bold border mt-2 fs_s10 tablehead_S10">
                  <div className="center_s10 col1_s10 border-end">SR#</div>
                  <div className="center_s10 col2_s10 border-end">DESIGNS / CODE</div>
                  <div className="center_s10 col3_s10 border-end">METAL</div>
                  <div className="center_s10 col3_s10 border-end">GWT</div>
                  <div className="center_s10 col3_s10 border-end">NWT</div>
                  <div className="center_s10 col3_s10 border-end">DPCS</div>
                  <div className="center_s10 col3_s10 border-end">DWT</div>
                  <div className="center_s10 col3_s10 border-end">CSPCS</div>
                  <div className="center_s10 col3_s10 border-end">CSWT.</div>
                  <div className="center_s10 col3_s10 border-end">OTHER</div>
                  <div className="center_s10 col4_s10">TOTAL</div>
                </div>
                {/* table body */}
                <div>
                  {
                    result?.resultArray?.map((e, i) => {
                      return (

                        <div className="d-flex border border-top-0 fs_s10 " key={i}>
                          <div className="center_s10 col1_s10 border-end">{i + 1}</div>
                          <div className="center_s10 col2_s10 border-end" style={{wordBreak:'break-word'}}><div className="lh_s10 fs_s10 p-1"><div className=" center_s10 fw-bold" style={{borderBottom:'1px solid black'}}>{e?.designno}</div><div className="center_s10">{e?.SrJobno}</div></div></div>
                          <div className="left_s10 pad_l_s10 col3_s10 border-end" style={{wordBreak:'break-word'}}>{e?.MetalTypePurity}</div>
                          <div className="right_s10 pad_r_s10 col3_s10 border-end">{e?.grosswt?.toFixed(3)}</div>
                          <div className="right_s10 pad_r_s10 col3_s10 border-end">{((e?.NetWt + e?.LossWt) - e?.totals?.metal?.WithOutPrimaryMetal)?.toFixed(3)}</div>
                          <div className="right_s10 pad_r_s10 col3_s10 border-end">{e?.totals?.diamonds?.Pcs}</div>
                          <div className="right_s10 pad_r_s10 col3_s10 border-end">{e?.totals?.diamonds?.Wt?.toFixed(3)}</div>
                          <div className="right_s10 pad_r_s10 col3_s10 border-end">{e?.totals?.colorstone?.Pcs}</div>
                          <div className="right_s10 pad_r_s10 col3_s10 border-end">{e?.totals?.colorstone?.Wt?.toFixed(3)}</div>
                          <div className="right_s10 pad_r_s10 col3_s10 border-end">{formatAmount((e?.OtherCharges + e?.TotalDiamondHandling + e?.MiscAmount))}</div>
                          <div className="right_s10 pad_r_s10 col4_s10"><div dangerouslySetInnerHTML={{ __html: result?.header?.Currencysymbol }}></div>&nbsp;{formatAmount((e?.TotalAmount / result?.header?.CurrencyExchRate))}</div>
                        </div>
                      )
                    })
                  }
                </div>
                {/* table total */}
                <div className="d-flex fw-bold border border-top-0 fs_s10 tablehead_S10">
                  <div className="center_s10 col1_s10 border-end"></div>
                  <div className="center_s10 col2_s10 border-end">TOTAL</div>
                  <div className="center_s10 col3_s10 border-end"></div>
                  <div className="right_s10 pad_r_s10 col3_s10 border-end">{result?.mainTotal?.grosswt?.toFixed(3)}</div>
                  <div className="right_s10 pad_r_s10 col3_s10 border-end">{result?.mainTotal?.metal?.IsPrimaryMetal?.toFixed(3)}</div>
                  <div className="right_s10 pad_r_s10 col3_s10 border-end">{result?.mainTotal?.diamonds?.Pcs}</div>
                  <div className="right_s10 pad_r_s10 col3_s10 border-end">{result?.mainTotal?.diamonds?.Wt?.toFixed(3)}</div>
                  <div className="right_s10 pad_r_s10 col3_s10 border-end">{result?.mainTotal?.colorstone?.Pcs}</div>
                  <div className="right_s10 pad_r_s10 col3_s10 border-end">{result?.mainTotal?.colorstone?.Wt?.toFixed(3)}</div>
                  <div className="right_s10 pad_r_s10 col3_s10 border-end">{formatAmount(result?.mainTotal?.total_otherCharge_Diamond_Handling)}</div>
                  <div className="right_s10 pad_r_s10 col4_s10"><div dangerouslySetInnerHTML={{ __html: result?.header?.Currencysymbol }}></div>&nbsp;{formatAmount((result?.mainTotal?.total_amount / result?.header?.CurrencyExchRate))}</div>
                </div>
                {/* tax total */}
                <div className="d-flex justify-content-end align-items-center border-start border-bottom">
                  <div className="fs_s10 lh_s10 tax_w_s10">
                    {
                      result?.allTaxes?.map((el, i) => {
                        return (
                          <div key={i} className="d-flex lh_s10 fs_s10 p-1 justify-content-between align-items-center border-start border-end w-100" >
                            <div>{el?.name} @ {el?.per}</div>
                            <div>{formatAmount(el?.amount)}</div>
                          </div>
                        )
                      })
                    }
                    <div className="d-flex fs_s10 lh_s10 p-1 fw-bold justify-content-between align-items-center border-start border-end w-100" >
                      <div>{result?.header?.AddLess > 0 ? 'Add' : 'Less'}</div>
                      <div>{result?.header?.AddLess}</div>
                    </div>
                  </div>
                </div>
                {/* grand total */}
                <div className="tablehead_S10 d-flex justify-content-between align-items-center border border-top-0 px-1">
                  {/* <div className="fw-bold fs_s10 left_s10"> {numberToWord(result?.finalAmount)} Only</div> */}
                  <div className="fw-bold fs_s10 left_s10"> {toWords?.convert(+((((result?.mainTotal?.total_amount)/(result?.header?.CurrencyExchRate)) +   (result?.allTaxesTotal) + ((result?.header?.AddLess)/(result?.header?.CurrencyExchRate)))?.toFixed(2)))} Only</div>
                  <div className="d-flex fw-bold fs_s10 h-100  border-start right_s10 tax_w_s10_2">
                    <div>Grand Total : &nbsp;</div><div dangerouslySetInnerHTML={{__html:result?.header?.Currencysymbol}}></div>&nbsp;<div>{formatAmount(((result?.mainTotal?.total_amount / result?.header?.CurrencyExchRate) + (result?.allTaxesTotal) + ((result?.header?.AddLess)/(result?.header?.CurrencyExchRate)) ))} /-</div>
                  </div>
                </div>
              </div>
              {/* summary detail */}
              <div className="mt-2 border fs_s10 lh_s10">
                <div className="fw-bold fs_s10 left_s10 bg_s10 ps-2 p-2">Summary Details</div>
                <div className="d-flex flex-wrap">
                  {
                    categoryWise?.map((a, i) => {
                      return (
                        <div className="d-flex justify-content-between align-items-center w-25 p-1 fs_s10 lh_s10" key={i}>
                          <div className="w1_s10 left_s10 fs_s10" style={{ wordWrap: 'break-word' }}>{a?.Categoryname} | {a?.SubCategoryname}</div><div className="fs_s10 w2_s10 center_s10">:</div><div className="center_s10 fw-bold w2_s10 fs_s10 pe-3">{a?._Quantity}</div>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
              {/* remarks */}
              <div className="fs_s10 lh_s10 p-1">
                <span className="fw-bold">REMARKS IF ANY : </span> <span dangerouslySetInnerHTML={{__html:result?.header?.PrintRemark}}></span> 
              </div>
              <div className="text-secondary fs_s10 lh_s10 pt-2 ">**   THIS IS A COMPUTER GENERATED INVOICE AND KINDLY NOTIFY US IMMEDIATELY IN CASE YOU FIND ANY DISCREPANCY IN THE DETAILS OF TRANSACTIONS</div>
            </div> : <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto"> {msg} </p>
          }
        </>
      }

    </>
  );
};

export default Summary10;
