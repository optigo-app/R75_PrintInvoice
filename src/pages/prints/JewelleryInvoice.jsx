import React, { useEffect, useState } from 'react';
import "../../assets/css/prints/jewellery_invoice.css";
import html2pdf from 'html2pdf.js';
import { apiCall, handleImageError, handlePrint, CapitalizeWords, taxGenrator, isObjectEmpty, NumberWithCommas, checkMsg } from '../../GlobalFunctions';
import Loader from '../../components/Loader';
import numberToWords from 'number-to-words';
import { ToWords } from 'to-words';

const JewelleryInvoice = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
  const [loader, setLoader] = useState(true);
  const [json0Data, setJson0Data] = useState({});
  const [data, setData] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [msg, setMsg] = useState("");
  const toWords = new ToWords();
  const [isImageWorking, setIsImageWorking] = useState(true);
  const handleImageErrors = () => {
    setIsImageWorking(false);
  };
  const [total, setTotal] = useState({
    grossWt: 0,
    netWt: 0,
    diamondPcs: 0,
    diamondWt: 0,
    colorStonePcs: 0,
    colorStoneWt: 0,
    metalPcs: 0,
    metalWt: 0,
    others: 0,
    labour: 0,
    total: 0,
    cgst: 0,
    sgst: 0,
    afterGst: 0,
    numberInWords: ""
  });
  const pdfGenerator = () => {
    generatePdf();
  }

  const generatePdf = () => {
    const content = document.getElementById('pdf-content'); // Replace with the ID of your content div
    if (content) {
      html2pdf(content);
    }
  };

  const loadData = (data) => {
    setJson0Data(data?.BillPrint_Json?.[0]);
    let resultArr = [];
    let totals = { ...total };
    data?.BillPrint_Json1.map((e, i) => {
      let obj = { ...e };
      let primaryWt = 0;
      let count = 0;
      let metal = [];
      let colorStone = [];
      let misc = [];
      let diamond = [];
      obj.otherAmt = e?.OtherCharges + e?.MiscAmount + e?.TotalDiamondHandling;
      obj.setting_making = e?.MakingAmount;
      data?.BillPrint_Json2.map((ele, ind) => {
        if (e?.SrJobno === ele?.StockBarcode) {
          if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
            let findDiamonds = diamond?.findIndex((elem, index) => elem?.ShapeName === ele?.ShapeName && elem?.QualityName === ele?.QualityName && elem?.Colorname === ele?.Colorname);
            if (findDiamonds === -1) {
              diamond.push(ele);
            } else {
              diamond[findDiamonds].Wt += ele?.Wt;
              diamond[findDiamonds].Pcs += ele?.Pcs;
              diamond[findDiamonds].Amount += ele?.Amount;
            }
            totals.diamondPcs += ele?.Pcs;
            totals.diamondWt += ele?.Wt;
            obj.setting_making += ele?.SettingAmount;
          }
          else if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
            colorStone.push(ele);
            totals.colorStonePcs += ele?.Pcs;
            totals.colorStoneWt += ele?.Wt;
            obj.setting_making += ele?.SettingAmount;
          }
          else if (ele?.MasterManagement_DiamondStoneTypeid === 3) {
            misc.push(ele);
          }
          else if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
            metal.push(ele);
            totals.metalPcs += ele?.Pcs;
            totals.metalWt += ele?.Wt;
            count += 1;
            if (ele?.IsPrimaryMetal === 1) {
              primaryWt += ele?.Wt
            }
          }
        }
      });
      if (count === 0) {
        primaryWt = e?.NetWt + e?.LossWt;
      }
      obj.primaryWt = primaryWt;
      obj.metal = metal;
      obj.colorStone = colorStone;
      obj.misc = misc;
      obj.diamond = diamond;
      totals.grossWt += e?.grosswt;
      totals.netWt += primaryWt;
      totals.others += obj.otherAmt;
      totals.labour += obj.setting_making;
      totals.total += e?.TotalAmount;
      resultArr.push(obj);
    });
    totals.total = (totals.total).toFixed(2);

    // tax

    let taxValue = taxGenrator(data?.BillPrint_Json[0], +totals.total);
    setTaxes(taxValue);
    taxValue.forEach((e, i) => {
      totals.afterGst += +(e?.amount) * data?.BillPrint_Json[0]?.CurrencyExchRate;
    });
    totals.afterGst += +(totals.total) + data?.BillPrint_Json[0]?.AddLess;
    totals.numberInWords = toWords.convert(totals.afterGst);

    resultArr.sort((a, b) => {
      const designNoA = a.designno;
      const designNoB = b.designno;

      // If both designnos are numbers, compare them numerically
      if (!isNaN(designNoA) && !isNaN(designNoB)) {
        return Number(designNoA) - Number(designNoB);
      }

      // If one of the designnos is a number, it should come before the alphanumeric one
      if (!isNaN(designNoA)) {
        return -1;
      }
      if (!isNaN(designNoB)) {
        return 1;
      }

      // Both designnos are alphanumeric, compare them as strings
      return designNoA.localeCompare(designNoB);
    });

    // tax end
    setTotal(totals);
    setData(resultArr);
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
      {/* Print Button */}
      <div className="d-flex justify-content-end align-items-center print_sec_sum4  portrait_container pt-4 pb-2 jewellery_invoice_container px-1">
        <div className="form-check ps-3">
          {/* <input type="button" className="btn_white blue me-3" value="Pdf" onClick={() => pdfGenerator()} /> */}
          <input type="button" className="btn_white blue" value="Print" onClick={(e) => handlePrint(e)} />
        </div>
      </div>
      <div className='portrait_container jewellery_invoice_container pt-2 pad_60_allPrint px-1' id='pdf-content'>
        {/* Main Heading */}
        <div className="w-100 bgGrey px-1 py-2">
          {/* <p className='fs-5 fw-bold text-white'>RETAIL INVOICE</p> */}
          <p className='fs-5 fw-bold text-white'>{json0Data?.PrintHeadLabel}</p>
        </div>
        {/* Address */}
        <div className="d-flex justify-content-between">
          <div className="col-6 pt-2 pb-2">
            <p className="fw-bold fs-6 pb-1">{json0Data?.CompanyFullName}</p>
            <p>{json0Data?.CompanyAddress}</p>
            <p>{json0Data?.CompanyAddress2}</p>
            <p>{json0Data?.CompanyCity}-{json0Data?.CompanyPinCode}, {json0Data?.CompanyState}({json0Data?.CompanyCountry})</p>
            <p>T {json0Data?.CompanyTellNo}</p>
            <p>{json0Data?.CompanyEmail} | {json0Data?.CompanyWebsite}</p>
            <p>{json0Data?.Company_VAT_GST_No !== "" && json0Data?.Company_VAT_GST_No} {(json0Data?.Company_CST_STATE !== "" && json0Data?.Company_CST_STATE_No !== "")
              && ` | ${json0Data?.Company_CST_STATE}-${json0Data?.Company_CST_STATE_No} `}| PAN-{json0Data?.Com_pannumber}</p>
          </div>
          <div className="col-3 pt-2 pb-2">
            {isImageWorking && (json0Data?.PrintLogo !== "" &&
              <img src={json0Data?.PrintLogo} alt=""
                className='w-100 h-auto ms-auto d-block object-fit-contain'
                onError={handleImageErrors} height={120} width={150} style={{ maxWidth: "116px" }} />)}
            {/* <img src={json0Data?.PrintLogo} alt="logo" className="w-75 d-block ms-auto " /> */}
          </div>
        </div>
        <div className="d-flex border mb-2">
          <div className="col-4 p-1 border-end">
            <p>Bill To,</p>
            <p className={`jewelleryInvoiceFont_14 fw-bold`}>{json0Data?.customerfirmname}</p>
            <p>{json0Data?.customerAddress1}</p>
            <p>{json0Data?.customerAddress2}</p>
            {/* <p>{json0Data?.customerAddress3}</p> */}
            <p>{json0Data?.customercity}{json0Data?.customerpincode}</p>
            <p>{json0Data?.customeremail1}</p>
            <p>{json0Data?.vat_cst_pan}</p>
            <p>{json0Data?.Cust_CST_STATE}-{json0Data?.Cust_CST_STATE_No}</p>
          </div>
          <div className="col-4 p-1 border-end">
            <p>Ship To,</p>
            <p className='jewelleryInvoiceFont_14 fw-bold'>{json0Data?.customerfirmname}</p>
            <p>{json0Data?.CustName}</p>
            <p>{json0Data?.customercity}, {json0Data?.State}</p>
            <p>{json0Data?.CompanyCountry}-{json0Data?.PinCode}</p>
            <p>Mobile No : {json0Data?.customermobileno}</p>
          </div>
          <div className="col-4 p-1">
            <div className="d-flex">
              <div className="col-3">
                <p className="fw-bold">BILL NO</p>
              </div>
              <div className="col-9">
                <p>{json0Data?.InvoiceNo}</p>
              </div>
            </div>
            <div className="d-flex">
              <div className="col-3">
                <p className="fw-bold">DATE</p>
              </div>
              <div className="col-9">
                <p>{json0Data?.EntryDate}</p>
              </div>
            </div>
            <div className="d-flex">
              <div className="col-3">
                <p className="fw-bold">
                  HSN
                </p>
              </div>
              <div className="col-9">
                <p>
                  {json0Data?.HSN_No}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Table Header */}
        <div className='d-flex'>
          <div className="srNoJewelleryinvoice border-top border-start border-end border-bottom p-1 d-flex justify-content-center align-items-center">
            <p className="fw-bold">
              Sr#
            </p>
          </div>
          <div className="designJewelleryInvoice border-top border-end border-bottom p-1 d-flex justify-content-center align-items-center">
            <p className="fw-bold">
              Description
            </p>
          </div>
          <div className='goldJewellryInvoice'>
            <div className="d-grid h-100">
              <div className="w-100 border-top border-end border-bottom px-1 py-2 d-flex justify-content-center align-items-center">
                <p className="fw-bold">
                  Gold
                </p>
              </div>
              <div className='d-flex'>
                <div className='col-5 border-end border-bottom px-1 py-2 d-flex justify-content-center align-items-center'>
                  <p className="fw-bold">
                    Quality
                  </p>
                </div>
                <div className='col-7 border-end border-bottom px-1 py-2 d-flex justify-content-center align-items-center'>
                  <p className="fw-bold">
                    Gross/Net
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className='goldJewellryInvoice'>
            <div className="d-grid h-100">
              <div className="w-100 border-top border-end border-bottom px-1 py-2 d-flex justify-content-center align-items-center">
                <p className="fw-bold">
                  Diamond
                </p>
              </div>
              <div className='d-flex'>
                <div className='col-6 border-end border-bottom px-1 py-2 d-flex justify-content-center align-items-center'>
                  <p className="fw-bold">
                    Detail
                  </p>
                </div>
                <div className='col-6 border-end border-bottom px-1 py-2 d-flex justify-content-center align-items-center'>
                  <p className="fw-bold">
                    Wt.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className='goldJewellryInvoice'>
            <div className="d-grid h-100">
              <div className="w-100 border-top border-end border-bottom px-1 py-2 d-flex justify-content-center align-items-center">
                <p className="fw-bold">
                  ColorStone
                </p>
              </div>
              <div className='d-flex'>
                <div className='col-7 border-end border-bottom px-1 py-2 d-flex justify-content-center align-items-center'>
                  <p className="fw-bold">
                    Detail
                  </p>
                </div>
                <div className='col-5 border-end border-bottom px-1 py-2 d-flex justify-content-center align-items-center'>
                  <p className="fw-bold">
                    Wt.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className='othersJewelleryinvoice p-1 d-flex justify-content-center align-items-center border-top border-end border-bottom '>
            <p className="fw-bold">Others</p>
          </div>
          <div className='othersJewelleryinvoice p-1 d-flex justify-content-center align-items-center border-top border-end border-bottom'>
            <p className="fw-bold">Labour</p>
          </div>
          <div className='totalJewelleryinvoice p-1 d-flex justify-content-center align-items-center border-top border-end border-bottom'>
            <p className="fw-bold">Total</p>
          </div>
        </div>
        {/* data */}
        {data.length > 0 && data.map((e, i) => {
          return <div className='d-flex no_break' key={i}>
            <div className="srNoJewelleryinvoice border-start border-end border-bottom p-1 d-flex justify-content-center align-items-center">
              <p>
                {NumberWithCommas(i + 1, 0)}
              </p>
            </div>
            <div className="designJewelleryInvoice border-end border-bottom p-1 d-flex flex-column justify-content-center">
              <p> {e?.Categoryname} </p>
              <p> {e?.designno} | {e?.SrJobno}</p>
            </div>
            <div className='goldJewellryInvoice'>
              <div className="d-grid h-100">
                <div className="d-flex">
                  <div className='col-5 border-end border-bottom p-1 d-flex justify-content-center flex-column'>
                    {e?.metal.length > 0 && e?.metal.map((ele, ind) => {
                      return ele?.IsPrimaryMetal === 1 && <p key={ind}>
                        {ele?.QualityName}/{ele?.Colorname}
                      </p>
                    })}
                  </div>
                  <div className='col-7 border-end border-bottom p-1 d-flex justify-content-center align-items-end flex-column'>
                    <p>
                      {NumberWithCommas(e?.grosswt, 3)}/{NumberWithCommas(e?.primaryWt, 3)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className='goldJewellryInvoice'>
              <div className="d-grid h-100">
                <div className='d-flex'>
                  <div className='col-6 border-end border-bottom p-1 d-flex justify-content-center flex-column'>
                    {e?.diamond.length > 0 && e?.diamond.map((ele, ind) => {
                      return <p key={ind}>{ele?.ShapeName}/{ele?.QualityName}/{ele?.Colorname}</p>
                    })}
                    {
                      e?.diamond?.length === 0 && <p>-</p>
                    }
                  </div>
                  <div className='col-6 border-end border-bottom p-1 d-flex justify-content-center align-items-end flex-column'>
                    {e?.diamond.length > 0 && e?.diamond.map((ele, ind) => {
                      return <p key={ind}>{NumberWithCommas(ele?.Pcs, 0)}/{NumberWithCommas(ele?.Wt, 3)} </p>
                    })}
                    {
                      e?.diamond?.length === 0 && <p>-</p>
                    }
                  </div>
                </div>
              </div>
            </div>
            <div className='goldJewellryInvoice'>
              <div className="d-grid h-100">
                <div className='d-flex'>
                  <div className='col-7 border-end border-bottom p-1 d-flex justify-content-center flex-column'>
                    {e?.colorStone.length > 0 && e?.colorStone.map((ele, ind) => {
                      return <p key={ind}>{ele?.ShapeName}/{ele?.QualityName}/{ele?.Colorname}</p>
                    })}
                    {
                      e?.colorStone?.length === 0 && <p>-</p>
                    }
                  </div>
                  <div className='col-5 border-end border-bottom p-1 d-flex justify-content-center align-items-end flex-column'>
                    {e?.colorStone.length > 0 && e?.colorStone.map((ele, ind) => {
                      return <p key={ind}>{NumberWithCommas(ele?.Pcs, 0)}/{NumberWithCommas(ele?.Wt, 3)}</p>
                    })}
                    {
                      e?.colorStone?.length === 0 && <p>-</p>
                    }
                  </div>
                </div>
              </div>
            </div>
            <div className='othersJewelleryinvoice p-1 d-flex justify-content-end align-items-center border-end border-bottom '>
              <p>{NumberWithCommas(e?.otherAmt, 2)}	</p>
            </div>
            <div className='othersJewelleryinvoice p-1 d-flex justify-content-end align-items-center border-end border-bottom'>
              <p>{NumberWithCommas(e?.setting_making, 2)}	</p>
            </div>
            <div className='totalJewelleryinvoice p-1 d-flex justify-content-end align-items-center border-end border-bottom'>
              <p>{NumberWithCommas(e?.TotalAmount, 2)} </p>
            </div>
          </div>
        })}
        {/* total */}
        <div className='d-flex no_break'>
          <div className="srNoJewelleryinvoice border-start border-end border-bottom p-1 d-flex justify-content-center align-items-center">
          </div>
          <div className="designJewelleryInvoice border-end border-bottom p-1 d-flex align-items-center">
            <p className='fw-bold text-uppercase' style={{ fontSize: "17px" }}>Total</p>
          </div>
          <div className='goldJewellryInvoice'>
            <div className="d-grid h-100">
              <div className="d-flex">
                <div className='col-5 border-end border-bottom p-1'>
                </div>
                <div className='col-7 border-end border-bottom p-1 d-flex justify-content-end align-items-center'>
                  <p className='fw-bold'>
                    {NumberWithCommas(total?.grossWt, 3)}/{NumberWithCommas(total?.netWt, 3)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className='goldJewellryInvoice'>
            <div className="d-grid h-100">
              <div className='d-flex'>
                <div className='col-6 border-end border-bottom p-1 d-flex align-items-center'>
                </div>
                <div className='col-6 border-end border-bottom p-1 d-flex justify-content-end align-items-center'>
                  <p className="fw-bold">
                    {NumberWithCommas(total?.diamondPcs, 0)}/{NumberWithCommas(total?.diamondWt, 3)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className='goldJewellryInvoice'>
            <div className="d-grid h-100">
              <div className='d-flex'>
                <div className='col-7 border-end border-bottom p-1 d-flex align-items-center'>
                </div>
                <div className='col-5 border-end border-bottom p-1 d-flex justify-content-end align-items-center'>
                  <p className='fw-bold'>  {NumberWithCommas(total?.colorStonePcs, 0)}/{NumberWithCommas(total?.colorStoneWt, 3)}</p>
                </div>
              </div>
            </div>
          </div>
          <div className='othersJewelleryinvoice p-1 d-flex justify-content-end align-items-center border-end border-bottom '>
            <p className='fw-bold'>{NumberWithCommas(total?.others, 2)}</p>
          </div>
          <div className='othersJewelleryinvoice p-1 d-flex justify-content-end align-items-center border-end border-bottom'>
            <p className='fw-bold'>{NumberWithCommas(total?.labour, 2)}</p>
          </div>
          <div className='totalJewelleryinvoice p-1 d-flex justify-content-end align-items-center border-end border-bottom'>
            <p className='fw-bold'>{NumberWithCommas(total?.total, 2)}</p>
          </div>
        </div>
        {/* gst */}
        <div className="d-flex border-start border-end borer-bottom no_break">
          <div className="inWordsJewelleryinvoice border-end p-1 d-flex justify-content-end flex-column border-bottom">
            <p className="fw-bold"> In Words {json0Data?.Currencyname} </p>
            <p className="fw-bold">{toWords?.convert(+(((+total?.total + taxes?.reduce((acc, cObj) => acc + (+cObj?.amount), 0) + json0Data?.AddLess))?.toFixed(2)))} </p>
          </div>
          <div className='grandTotalRupeesJewelleryInvoice border-end border-bottom'>
            <div className="border-bottom p-1 text-end">
              {taxes.length > 0 && taxes.map((e, i) => {
                return <p key={i}>{e?.name} @ {e?.per}</p>
              })}
              {json0Data?.AddLess !== 0 && <p>{json0Data?.AddLess > 0 ? "Add" : "Less"}</p>}
              {/* <p>CGST @ {json0Data?.CGST}%</p> */}
              {/* <p>SGST @ {json0Data?.SGST}%</p> */}
            </div>
            <div className='p-1 text-end'>
              <p className='fw-bold'>GRAND TOTAL</p>
            </div>
          </div>
          <div className='grandTotaltaxJewelleryInvoice'>
            <div className='border-bottom p-1 text-end'>
              {taxes.length > 0 && taxes.map((e, i) => {
                return <p key={i}>{NumberWithCommas(+e?.amount, 2)}</p>
              })}
              {json0Data?.AddLess !== 0 && <p>{NumberWithCommas(json0Data?.AddLess, 2)}</p>}
            </div>
            <div className='p-1 text-end border-bottom'>
              <p className='fw-bold'>{NumberWithCommas((+total?.total + taxes?.reduce((acc, cObj) => acc + (+cObj?.amount), 0) + json0Data?.AddLess), 2)}</p>
            </div>
          </div>
        </div>
        {/* Remark */}
        <div className="border-bottom border-start border-end p-1 no_break">
          <div dangerouslySetInnerHTML={{ __html: json0Data?.Declaration }} className='pb-2'></div>
        </div>
        {/* Bank Address */}
        <div className="d-flex border-bottom border-start border-end mb-2 no_break">
          <div className="col-4 p-1 border-end">
            <p className='fw-bold'>Bank Detail</p>
            <p>Bank Name: {json0Data?.bankname}</p>
            <p>{json0Data?.bankaddress}</p>
            <p>Account Name: {json0Data?.accountname}</p>
            <p>Account No. :{json0Data?.accountnumber}</p>
            <p>RTGS/NEFT IFSC:{json0Data?.rtgs_neft_ifsc}</p>
          </div>
          <div className="col-4 p-1 border-end d-flex justify-content-between flex-column">
            <p>Signature</p>
            <p className="fw-bold">{json0Data?.customerfirmname}</p>
          </div>
          <div className="col-4 p-1 d-flex justify-content-between flex-column">
            <p>Signature</p>
            <p className="fw-bold">{json0Data?.CompanyFullName}</p>
          </div>
        </div>
      </div>
    </> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
  )
}

export default JewelleryInvoice