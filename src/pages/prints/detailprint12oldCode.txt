import React, { useEffect } from 'react';
import "../../assets/css/prints/detailPrint1.css";
import "../../assets/css/prints/detailPrint12.css";
import { useState } from 'react';
import { NumberWithCommas, apiCall, fixedValues, handleImageError, handlePrint, isObjectEmpty, taxGenrator } from '../../GlobalFunctions';
import Loader from '../../components/Loader';

const DetailPrint12 = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {
  const [image, setImage] = useState(false);
  const [loader, setLoader] = useState(true);
  const [json0Data, setJson0Data] = useState({});
  const [json1Data, setJson1Data] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [msg, setMsg] = useState("");
  const [total, setTotal] = useState({
    diamondPcs: 0,
    diamondWt: 0,
    diamondAmount: 0,
    metalWt: 0,
    metalNL: 0,
    metalAmount: 0,
    colorStonePcs: 0,
    colorStoneWt: 0,
    colorStoneAmount: 0,
    totalAmount: 0,
    discountTotalAmount: 0,
    sgstAmount: 0,
    cgstAmount: 0,
    withoutDiscountTotalAmount: 0,
    withDiscountTaxAmount: 0
  });
  const [summary, setSummary] = useState({
    gold24Kt: 0,
    grossWt: 0,
    gDWt: 0,
    netWt: 0,
    diamondWt: 0,
    diamondpcs: 0,
    stoneWt: 0,
    stonePcs: 0,
    metalAmount: 0,
    diamondAmount: 0,
    colorStoneAmount: 0,
    makingAmount: 0,
    otherCharges: 0,
    addLess: 0,
    total: 0
  });
  const [diamondDetails, setDiamondDetails] = useState([]);

  const handleChange = (e) => {
    image ? setImage(false) : setImage(true);
  }

  const findDiamond = (obj, diamondArr) => {
    let recordIndex = diamondArr.findIndex((e, i) => e?.ShapeName === obj?.ShapeName && e?.QualityName === obj?.QualityName && e?.Colorname === obj?.Colorname);
    return recordIndex;
  }

  const findMaterials = (json1, json2, json0) => {
    let resultArr = [];
    let totals = { ...total };
    let summaries = { ...summary };
    let diamondDetails = [];
    json1.forEach((e, i) => {
      let obj = { ...e };
      obj.SettingAmount = 0;
      let diamondArr = [];
      let metalArr = [];
      let colorStoneArr = [];
      let diamondsTotal = {
        Pcs: 0,
        Wt: 0,
        Amount: 0
      }
      let metalTotal = {
        Pcs: 0,
        Wt: 0,
        Amount: 0
      }
      let colorStonesTotal = {
        Pcs: 0,
        Wt: 0,
        Amount: 0
      }
      let discountTotalAmount = 0;
      json2.forEach((ele, ind) => {
        if (e?.SrJobno === ele?.StockBarcode) {
          if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
            diamondArr.push(ele);
            diamondsTotal.Pcs += ele?.Pcs;
            diamondsTotal.Wt += ele?.Wt;
            diamondsTotal.Amount += ele?.Amount;
            totals.diamondPcs += ele?.Pcs;
            totals.diamondWt += ele?.Wt;
            totals.diamondAmount += ele?.Amount;
            summaries.diamondWt += ele?.Wt;
            summaries.diamondpcs += ele?.Pcs;
            summaries.diamondAmount += ele?.Amount;
            if (diamondDetails.length === 0) {
              diamondDetails.push(ele);
            } else {
              let recordIndex = findDiamond(ele, diamondDetails);
              if (recordIndex !== -1) {
                diamondDetails[recordIndex].Pcs += ele?.Pcs;
                diamondDetails[recordIndex].Wt += ele?.Wt;
              } else {
                if (diamondDetails.length === 6 || diamondDetails.length === 7) {
                  let findIndex = diamondDetails.findIndex((e, i) => e.name === "Others");
                  if (findIndex !== -1) {
                    diamondDetails[findIndex].Pcs += ele?.Pcs;
                    diamondDetails[findIndex].Wt += ele?.Wt;
                  } else {
                    let obj = { ...ele };
                    obj.name = "Others";
                    diamondDetails.push(obj);
                  }
                } else {
                  diamondDetails.push(ele);
                }
              }
            }
          }
          if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
            metalArr.push(ele);
            metalTotal.Pcs += ele?.Pcs;
            metalTotal.Wt += ele?.Wt;
            metalTotal.Amount += ele?.Amount;
            summaries.gold24Kt += ele?.FineWt;
            totals.metalWt += ele?.Wt;
            totals.metalAmount += ele?.Amount;
            summaries.metalAmount += ele?.Amount;
          }
          if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
            colorStoneArr.push(ele);
            colorStonesTotal.Pcs += ele?.Pcs;
            colorStonesTotal.Wt += ele?.Wt;
            colorStonesTotal.Amount += ele?.Amount;
            totals.colorStonePcs += ele?.Pcs;
            totals.colorStoneWt += ele?.Wt;
            totals.colorStoneAmount += ele?.Amount;
            summaries.stoneWt += ele?.Wt;
            summaries.stonePcs += ele?.Pcs;
            summaries.colorStoneAmount += ele?.Amount;
          }
          obj.SettingAmount += ele?.SettingAmount;
          summaries.makingAmount += ele?.SettingAmount;
        }
      });
      discountTotalAmount = e?.TotalAmount - e?.DiscountAmt;
      summaries.grossWt += e?.grosswt;
      summaries.gDWt += e?.MetalDiaWt;
      summaries.netWt += e?.NetWt;
      summaries.makingAmount += e?.MakingAmount;
      summaries.otherCharges += e?.OtherCharges;
      obj.diamonds = diamondArr;
      obj.metals = metalArr;
      obj.colorStones = colorStoneArr;
      obj.diamondsTotal = diamondsTotal;
      obj.metalTotal = metalTotal;
      obj.colorStonesTotal = colorStonesTotal;
      obj.discountTotalAmount = discountTotalAmount;
      totals.totalAmount += e?.TotalAmount;
      totals.discountTotalAmount += obj?.DiscountAmt;
      totals.withoutDiscountTotalAmount += e?.TotalAmount;
      resultArr.push(obj);
    });
    setDiamondDetails(diamondDetails);
    summaries.addLess = json0?.AddLess;
    summaries.total = summaries?.metalAmount + summaries?.diamondAmount + summaries?.colorStoneAmount + summaries?.makingAmount + summaries?.otherCharges + summaries?.addLess;
    totals.cgstAmount = (totals?.withoutDiscountTotalAmount * json0?.CGST) / 100;
    totals.sgstAmount = (totals?.withoutDiscountTotalAmount * json0?.SGST) / 100;
    // totals.withDiscountTaxAmount = totals?.totalAmount + totals?.cgstAmount + totals?.sgstAmount - totals?.discountTotalAmount + json0?.AddLess;
    let taxValue = taxGenrator(json0, totals?.totalAmount);
    taxValue.length > 0 && taxValue.forEach((e, i) => {
      totals.withDiscountTaxAmount += +(e?.amount);
    });
    totals.withDiscountTaxAmount += totals?.totalAmount + json0?.AddLess - totals?.discountTotalAmount;
    totals.withDiscountTaxAmount = (totals.withDiscountTaxAmount).toFixed(2);
    setTaxes(taxValue);
    setSummary(summaries);
    setTotal(totals);
    return resultArr;
  }

  const loadData = (data) => {
    let findMaterilasList = findMaterials(data?.BillPrint_Json1, data?.BillPrint_Json2, data?.BillPrint_Json[0]);
    // let findDiamondDetail =  findDiamonds(data?.BillPrint_Json1, data?.BillPrint_Json2);
    setJson0Data(data?.BillPrint_Json[0]);
    setJson1Data(findMaterilasList);
    setLoader(false);
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
          setMsg(data?.Message);
        }
      } catch (error) {
        console.error(error);
      }
    }
    sendData();
  }, []);
  const [isImageWorking, setIsImageWorking] = useState(true);
  const handleImageErrors = () => {
    setIsImageWorking(false);
  };
  return (
    <>{loader ? <Loader /> : msg === "" ? <div className="container containerDetailPrint1 containerDetailPrint12 pt-4 pad_60_allPrint">
      {/* buttons */}
      <div className="d-flex justify-content-end align-items-center print_sec_sum4 mb-4 pt-4">
        <div className="form-check d-flex align-items-center">
          <input className="border-dark me-2" type="checkbox" checked={image} onChange={e => handleChange(e)} />
          <label className="">
            With Image
          </label>
        </div>
        <div className="form-check">
          <input type="button" className="btn_white blue" value="Print" onClick={(e) => handlePrint(e)} />
        </div>
      </div>
      {/* header line*/}
      <div className="jewelleryPackingList mb-2 mt-2 recordDetailPrint1">
        <h1 className='fs-4 p-2 fw-bold text-white'>{json0Data?.PrintHeadLabel}</h1>
      </div>
      {/* header */}
      <div className="d-flex align-items-center pb-2 border-bottom border-2 recordDetailPrint1">
        <div className="col-6">
          <h2 className='fw-bold fs-5'>{json0Data?.CompanyFullName}</h2>
          <p className='lhDetailPrint1'>{json0Data?.CompanyAddress}</p>
          <p className='lhDetailPrint1'>{json0Data?.CompanyAddress2}</p>
          <p className='lhDetailPrint1'>{json0Data?.CompanyCity}-{json0Data?.CompanyPinCode}, {json0Data?.CompanyState}({json0Data?.CompanyCountry})</p>
          <p className='lhDetailPrint1'>T {json0Data?.CompanyTellNo}</p>
          <p className='lhDetailPrint1'>{json0Data?.CompanyEmail} | {json0Data?.CompanyWebsite}</p>
          <p className='lhDetailPrint1'>{json0Data?.Company_VAT_GST_No} | {json0Data?.Cust_CST_STATE}-{json0Data?.Cust_CST_STATE_No} | PAN-{json0Data?.Pannumber}</p>
        </div>
        <div className="col-6">
                    {isImageWorking && (json0Data?.PrintLogo !== "" && 
                      <img src={json0Data?.PrintLogo} alt="" 
                      className='w-25 h-auto ms-auto d-block object-fit-contain'
                      onError={handleImageErrors} height={120} width={150} />)}
          {/* <img src={json0Data?.PrintLogo} alt="" className='w-25 d-block ms-auto' /> */}
        </div>
      </div>
      {/* address */}
      <div className="d-flex border-start border-end border-2 border-bottom mb-2 recordDetailPrint1">
        <div className="col-4 border-end border-2 p-1">
          <p className='lhDetailPrint1'>{json0Data?.lblBillTo}</p>
          <p className='lhDetailPrint1 fw-bold'>{json0Data?.lblBillTo}</p>
          <p className='lhDetailPrint1'>{json0Data?.customerAddress2}</p>
          <p className='lhDetailPrint1'>{json0Data?.customerAddress1}</p>
          <p className='lhDetailPrint1'>{json0Data?.customerAddress3}</p>
          <p className='lhDetailPrint1'>{json0Data?.customercity}-{json0Data?.customerpincode}</p>
          <p className='lhDetailPrint1'>{json0Data?.customeremail1}</p>
          <p className='lhDetailPrint1'>{json0Data?.vat_cst_pan}</p>
          <p className='lhDetailPrint1'>{json0Data?.Cust_CST_STATE}-{json0Data?.Cust_CST_STATE_No}</p>
        </div>
        <div className="col-4 border-end border-2 p-1">
          <p className='lhDetailPrint1'>Ship To,</p>
          <p className='lhDetailPrint1 fw-bold'>{json0Data?.customerfirmname}</p>
          <p className='lhDetailPrint1'>{json0Data?.CustName}</p>
          <p className='lhDetailPrint1'>{json0Data?.customerstreet}</p>
          <p className='lhDetailPrint1'>{json0Data?.customercity1}, {json0Data?.State}</p>
          <p className='lhDetailPrint1'>{json0Data?.CompanyCountry}-{json0Data?.PinCode}</p>
          <p className='lhDetailPrint1'>Mobile No : {json0Data?.customermobileno}</p>
        </div>
        <div className="col-4 p-1">
          <div className="d-flex">
            <p className='fw-bold col-2 me-2'>BILL NO </p>
            <p className='col-10'>{json0Data?.InvoiceNo}</p>
          </div>
          <div className="d-flex">
            <p className='fw-bold col-2 me-2'>DATE </p>
            <p className='col-10'>{json0Data?.EntryDate}</p>
          </div>
          <div className="d-flex">
            <p className='fw-bold col-2 me-2'>HSN </p>
            <p className='col-10'>{json0Data?.HSN_No}</p>
          </div>
        </div>
      </div>
      {/* table header*/}
      <div className="d-flex w-100 border-top border-2 recordDetailPrint1">
        <div className="srNoDetailprint11 border-end border-start border-2 border-bottom d-flex justify-content-center align-items-center flex-column">
          <p className='fw-bold'>Sr. </p>
          <p className='fw-bold'>No. </p>
        </div>
        <div className="designDetalPrint12 border-end border-2 p-1 border-bottom d-flex justify-content-center align-items-center">
          <p className='fw-bold p-1'>Design</p>
        </div>
        <div className="diamondDetailPrint12 border-end border-2">
          <div className="d-grid h-100">
            <div className='d-flex justify-content-center border-bottom border-2'>
              <p className='fw-bold p-1'>Diamond</p>
            </div>
            <div className='d-flex border-bottom border-2'>
              <p className='fw-bold col-3 d-flex align-items-center justify-content-center border-end border-2'>Code</p>
              <p className='fw-bold col-2 d-flex align-items-center justify-content-center border-end border-2'>Size</p>
              {/* <p className='fw-bold col-2 d-flex align-items-center justify-content-center border-end border-2'>Pcs</p> */}
              <p className='fw-bold col-2 d-flex align-items-center justify-content-center border-end border-2'>Wt</p>
              <p className='fw-bold col-2 d-flex align-items-center justify-content-center border-end border-2'>Rate</p>
              <p className='fw-bold col-3 d-flex align-items-center justify-content-center text-center'>Amount</p>
            </div>
          </div>
        </div>
        <div className="metalGoldDetailPrint12 border-end border-2">
          <div className="d-grid h-100">
            <div className='d-flex justify-content-center align-items-center border-bottom border-2'>
              <p className='fw-bold p-1'>Metal  </p>
            </div>
            <div className='d-flex border-bottom border-2'>
              <p className='fw-bold col-3 border-end border-2 d-flex align-items-center justify-content-center'>Quality</p>
              <p className='fw-bold col-2 border-end border-2 d-flex align-items-center justify-content-center'>*Wt</p>
              <p className='fw-bold col-2 border-end border-2 d-flex align-items-center justify-content-center'>N+L</p>
              <p className='fw-bold col-2 border-end border-2 d-flex align-items-center justify-content-center'>Rate</p>
              <p className='fw-bold col-3 d-flex align-items-center justify-content-center'>Amount</p>
            </div>
          </div>
        </div>
        <div className="stoneDetailPrint12 border-end border-2">
          <div className="d-grid h-100">
            <div className='d-flex justify-content-center border-bottom border-2'>
              <p className='fw-bold p-1'>Stone</p>
            </div>
            <div className='d-flex border-bottom border-2'>
              {/* <p className='fw-bold col-2 border-end border-2 d-flex align-items-center justify-content-center'>Code</p>
              <p className='fw-bold col-2 border-end border-2 d-flex align-items-center justify-content-center'>Size</p>
              <p className='fw-bold col-2 border-end border-2 d-flex align-items-center justify-content-center'>Pcs</p> */}
              <p className='fw-bold col-4 border-end border-2 d-flex align-items-center justify-content-center'>Wt</p>
              <p className='fw-bold col-4 border-end border-2 d-flex align-items-center justify-content-center'>Rate</p>
              <p className='fw-bold col-4 d-flex align-items-center justify-content-center text-center'>Amount</p>
            </div>
          </div>
        </div>
        <div className="otherAmountDetailPrint12 border-end border-2 border-bottom d-flex align-items-center justify-content-center flex-column">
          <p className='fw-bold text-center d-flex align-items-center justify-content-center'>Other </p>
          <p className='fw-bold text-center d-flex align-items-center justify-content-center'>Amount </p>

        </div>
        <div className="labourAmountDetailPrint12 border-end border-2 border-bottom">
          <div className="d-grid h-100">
            <div className='border-bottom border-2 d-flex align-items-center justify-content-center'><p className='text-center fw-bold'>Labour</p></div>
            <div className='d-flex'>
              <div className="col-5 border-end border-2 d-flex align-items-center justify-content-center"><p className='fw-bold '>Rate</p></div>
              <div className="col-7 d-flex align-items-center justify-content-center"><p className='fw-bold text-end '>Amount</p></div>
            </div>
          </div>
        </div>
        <div className="totalAmountDetailPrint1 border-end border-2 border-bottom d-flex align-items-center justify-content-center flex-column totalAmountDetailPrint12">
          <p className='text-center fw-bold '>Total</p>
          <p className='text-center fw-bold '>Amount</p>
        </div>
      </div>
      {/* data */}
      {json1Data.length > 0 && json1Data.map((e, i) => {
        return <div key={i} className='recordDetailPrint1'>
          <div className="d-flex w-100">
            <div className="srNoDetailprint11 border-end border-start border-2 border-bottom">
              <p className='p-1'>{e?.SrNo}</p>
            </div>
            <div className="designDetalPrint12 border-end border-2 p-1 border-bottom">
              <div className="d-flex">
                <div className='col'>
                  <p>{e?.designno}</p>
                </div>
                <div className='col'>
                  <p>{e?.SrJobno}</p>
                  <p>{e?.MetalColor}</p>
                </div>
              </div>
              <div>
                {image && <img src={e?.DesignImage} alt="" className='w-100 d-block' onError={handleImageError} />}
              </div>
              <div className={`${!image && 'pt-2'}`}>
                <p className='text-center'>HUID - {e?.HUID}</p>
                <p className='text-center'>PO: {e?.PO}</p>
                <p className='text-center'>{e?.lineid}</p>
                <p className='text-center'>Tunch : {NumberWithCommas(e?.Tunch, 3)}</p>
                <p className='text-center'>4.033 gm </p>
                <p className='text-center'>Gross Size: {fixedValues(e?.grosswt, 3)}</p>
              </div>
            </div>
            <div className="diamondDetailPrint12 border-end border-2 position-relative">
              <div className="h-100 paddingBottomTotalDetailPrint1">
                {e?.diamonds.length > 0 && e?.diamonds.map((ele, ind) => {
                  return <div className={`d-flex justify-content-between `} key={ind}>
                    <p className='col-3  border-2'>{ele?.ShapeName} {ele?.QualityName} {ele?.Colorname}</p>
                    <p className='col-2 text-center border-2'>{ele?.SizeName}</p>
                    {/* <p className='col-1  border-2 text-end'>{ele?.Pcs}</p> */}
                    <p className='col-2  border-2 text-end'>{fixedValues(ele?.Wt, 3)}</p>
                    <p className='col-2  border-2 text-end'>{NumberWithCommas(ele?.Rate, 2)}</p>
                    <p className='col-3 text-end'>{NumberWithCommas(ele?.Amount, 2)}</p>
                  </div>
                })}
                <div className='d-flex border-bottom position-absolute bottom-0 w-100 border-2 border-top totalMinHeightDetailPrint1'>
                  <p className='col-2 border-2'></p>
                  <p className='col-2 border-2'></p>
                  <p className='col-2 border-2 text-end'></p>
                  <p className='col-2 border-2 text-end'>{fixedValues(e?.diamondsTotal?.Wt, 3)}</p>
                  <p className='col-2 border-2 text-end'></p>
                  <p className='col-2 text-end'>{NumberWithCommas(e?.diamondsTotal?.Amount, 2)}</p>
                </div>
              </div>
            </div>
            <div className="metalGoldDetailPrint12 border-end border-2 position-relative">
              <div className="h-100 paddingBottomTotalDetailPrint1">
                {e?.metals.length > 0 && e?.metals.map((ele, ind) => {
                  return <div className={`d-flex`} key={ind}>
                    <p className=' col-3 p-1 border-2'>{ele?.QualityName}</p>
                    <p className=' col-2 p-1 border-2'>{fixedValues(ele?.Wt, 3)}</p>
                    <p className=' col-2 p-1 border-2 text-end'>{fixedValues(e?.NetWt, 3)}</p>
                    <p className=' col-2 p-1 border-2 text-end'>{NumberWithCommas(ele?.Rate, 2)}</p>
                    <p className=' col-3 p-1 text-end'>{NumberWithCommas(ele?.Amount, 2)}</p>
                  </div>
                })}
                <div className='d-flex position-absolute bottom-0 w-100 border-2 totalMinHeightDetailPrint1 border-top border-bottom'>
                  <p className='col-3 border-2'></p>
                  <p className='col-2 border-2'>{fixedValues(e?.metalTotal?.Wt, 3)}</p>
                  <p className='col-2 border-2 text-end'>{fixedValues(e?.NetWt, 3)}</p>
                  <p className='col-2 border-2 text-end'></p>
                  <p className='col-3 text-end'>{NumberWithCommas(e?.metalTotal.Amount, 2)}</p>
                </div>
              </div>
            </div>
            <div className="stoneDetailPrint12 border-end border-2 position-relative">
              <div className="h-100 paddingBottomTotalDetailPrint1">
                {e?.colorStones.length > 0 && e?.colorStones.map((ele, ind) => {
                  return <div className={`d-flex`} key={ind}>
                    {/* <p className='col-3 border-2'>{ele?.ShapeName} {ele?.QualityName} {ele?.Colorname}</p>
                    <p className='col-2 text-center border-2'>{ele?.SizeName}</p>
                    <p className='col-1 border-2 text-end'>{ele?.Pcs}</p> */}
                    <p className='col-4 border-2 text-end'>{fixedValues(ele?.Wt, 3)}</p>
                    <p className='col-4 border-2 text-end'>{NumberWithCommas(ele?.Rate, 2)}</p>
                    <p className='col-4 text-end'>{NumberWithCommas(ele?.Amount, 2)}</p>
                  </div>
                })}
                <div className='d-flex border-bottom position-absolute bottom-0 w-100 border-2 border-top totalMinHeightDetailPrint1'>
                  <p className=' col-2 border-2'></p>
                  <p className=' col-2 border-2'></p>
                  <p className=' col-2 border-2 text-end'></p>
                  <p className=' col-2 border-2 text-end'>{fixedValues(e?.colorStonesTotal?.Wt, 3)}</p>
                  <p className=' col-2 border-2 text-end'></p>
                  <p className=' col-2 text-end'>{NumberWithCommas(e?.colorStonesTotal?.Amount, 2)}</p>
                </div>
              </div>
            </div>
            <div className="otherAmountDetailPrint12 border-end border-2 position-relative">
              <div className="paddingBottomTotalDetailPrint1">
                <div>
                  <p className=' text-end'>{NumberWithCommas(e?.OtherCharges, 2)}</p>
                </div>
              </div>
              <div className="position-absolute bottom-0 w-100 border-top border-bottom border-2 totalMinHeightDetailPrint1">
                <p className='text-end '>{NumberWithCommas(e?.OtherCharges, 2)}</p>
              </div>
            </div>
            <div className="labourAmountDetailPrint12 border-end border-2 position-relative">
              <div className="d-grid h-100 paddingBottomTotalDetailPrint1">
                <div className='d-flex '>
                  <div className="col-5 "><p className='text-end'>{NumberWithCommas(e?.MaKingCharge_Unit, 2)}</p></div>
                  <div className="col-7"><p className='text-end text-end'>{NumberWithCommas(e?.MakingAmount, 2)}</p></div>
                </div>
              </div>
              <div className="position-absolute bottom-0 w-100 border-bottom border-2 border-top totalMinHeightDetailPrint1 d-flex">
                <div className="col-5"><p className='text-end'>{NumberWithCommas(e?.MaKingCharge_Unit, 2)}</p></div>
                <div className="col-7"><p className='text-end'>{NumberWithCommas(e?.MakingAmount, 2)}</p></div>
              </div>
            </div>
            <div className="totalAmountDetailPrint1 border-end border-2 position-relative totalAmountDetailPrint12">
              <div className="d-grid h-100 paddingBottomTotalDetailPrint1">
                <div>
                  <p className='text-end'>{NumberWithCommas(e?.discountTotalAmount, 2)}</p>
                </div>
              </div>
              <div className="position-absolute bottom-0 w-100 border-top border-bottom border-2 totalMinHeightDetailPrint1">
                <p className='text-end'>{NumberWithCommas(e?.TotalAmount, 2)}</p>
              </div>
            </div>
          </div>
          <div className="d-flex w-100">
            <div className="srNoDetailprint11 border-end border-start border-2 border-bottom">
              <p className=' p-1'></p>
            </div>
            <div className="designDetalPrint12 border-end border-2 p-1 border-bottom">
            </div>
            <div className="diamondDetailPrint12 border-end border-2 position-relative border-bottom">
              <div className="d-grid">
              </div>
            </div>
            <div className="metalGoldDetailPrint12 border-end border-2 position-relative border-bottom">
              <div className="d-grid pb-4">
              </div>
            </div>
            <div className="stoneDetailPrint12 border-end border-2 position-relative border-bottom">
              <div className="d-grid">
                <p className='p-1 border-2 text-end'>Discount {(e?.Discount).toFixed(2)}% @Total Amount</p>
              </div>
            </div>
            <div className="otherAmountDetailPrint12 border-end border-2 border-bottom">
              <p className='d-flex align-items-center justify-content-end'></p>
            </div>
            <div className="labourAmountDetailPrint12 border-end border-2 border-bottom">
              <div className="d-grid h-100">
                <div className='d-flex'>
                  <div className="col-5 "><p className=' p-1 text-end'></p></div>
                  <div className="col-7"><p className=' text-end'>{NumberWithCommas(e?.DiscountAmt, 2)}</p></div>
                </div>
              </div>
            </div>
            <div className="totalAmountDetailPrint1 border-end border-2 border-bottom  totalAmountDetailPrint12">
              <p className='text-end'><span dangerouslySetInnerHTML={{ __html: json0Data?.Currencysymbol }}></span>{NumberWithCommas(e?.discountTotalAmount, 2)}</p>
            </div>
          </div>
        </div>
      })}
      {/* cgst */}
      <div className="d-flex w-100 border-bottom border-2 border-start recordDetailPrint1">
        <div className="cgstDetailPrint1 text-end border-end border-2 ">
          <p>Total Discount</p>
          {taxes.length > 0 && taxes.map((e, i) => {
            return <p key={i}>{e?.name} @ {e?.per}</p>
          })}
          <p>Less</p>
        </div>
        <div className="cgstTotalDetailPrint1 text-end border-end border-2 ">
          <p>{(total?.discountTotalAmount).toFixed(2)}</p>
          {taxes.length > 0 && taxes.map((e, i) => {
            return <p key={i}>{e?.amount}</p>
          })}
          <p>-0.17</p>
        </div>
      </div>
      {/* total */}
      <div className="d-flex w-100 recordDetailPrint1">
        <div className="designDetalPrint12Total border-end border-2 border-bottom border-start">
          <p className='fw-bold text-center'>Total</p>
        </div>
        <div className="diamondDetailPrint12 border-end border-2 position-relative border-bottom">
          <div className='d-flex'>
            <p className=' col-3 p-1 border-2'></p>
            <p className=' col-2 p-1 border-2'></p>
            {/* <p className=' col-2 p-1 border-2 text-end'>{total?.diamondPcs}</p> */}
            <p className=' col-2 p-1 border-2 text-end'>{fixedValues(total?.diamondWt, 3)}</p>
            <p className=' col-2 p-1 border-2 text-end'></p>
            <p className=' col-3 p-1 text-end'>{NumberWithCommas(total?.diamondAmount, 2)}</p>
          </div>
        </div>
        <div className="metalGoldDetailPrint12 border-end border-2 position-relative border-bottom">
          <div className='d-flex'>
            <p className='col-3 p-1 border-2'></p>
            <p className='col-2 p-1 border-2'>{fixedValues(total?.metalWt, 3)}</p>
            <p className='col-2 p-1 border-2 text-end'>0.452</p>
            <p className='col-2 p-1 border-2 text-end'></p>
            <p className='col-3 p-1 text-end'>{NumberWithCommas(total?.metalAmount, 2)}</p>
          </div>
        </div>
        <div className="stoneDetailPrint12 border-end border-2 position-relative border-bottom">
          <div className='d-flex'>
            {/* <p className='col-2 border-2'></p>
            <p className='col-2 border-2'></p>
            <p className='col-2 border-2 text-end'>{total?.colorStonePcs}</p> */}
            <p className='col-4 border-2 text-end'>{fixedValues(total?.colorStoneWt, 3)}</p>
            <p className='col-4 border-2 text-end'></p>
            <p className='col-4 text-end'>{NumberWithCommas(total?.colorStoneAmount, 2)}</p>
          </div>
        </div>
        <div className="otherAmountDetailPrint12 border-end border-2 border-bottom">
          <p className='p-1 d-flex align-items-center justify-content-end'></p>
        </div>
        <div className="labourAmountDetailPrint12 border-end border-2 border-bottom">
          <div className="d-grid h-100">
            <div className='d-flex justify-content-end'>
              <div className=""><p className=' text-end'>{NumberWithCommas(total?.discountTotalAmount, 2)}</p></div>
            </div>
          </div>
        </div>
        <div className="totalAmountDetailPrint1 border-end border-2 border-bottom  totalAmountDetailPrint12">
          <p className=' text-end'><span dangerouslySetInnerHTML={{ __html: json0Data?.Currencysymbol }}></span>{NumberWithCommas(total?.withDiscountTaxAmount, 2)}</p>
        </div>
      </div>
      {/* summary */}
      <div className="d-flex w-100 pt-1 recordDetailPrint1">
        <div className="col-4 pe-1">
          <p className='border-start border-2 fw-bold text-center border-bottom border-2 w-100 border-end border-top'>SUMMARY</p>
          <div className="d-flex border-end border-2">
            <div className="border-start col-6 border-end border-2 position-relative summaryPadBotDetailPrint1 d-flex flex-column">
              <div className="d-flex justify-content-between">
                <p className='fw-bold p-1'>GOLD IN 24KT</p>
                <p className='p-1'> {fixedValues(summary?.gold24Kt, 3)} gm</p>
              </div>
              <div className="d-flex justify-content-between">
                <p className='fw-bold p-1'>GROSS WT</p>
                <p className='p-1'> {fixedValues(summary?.grossWt, 3)} gm</p>
              </div>
              <div className="d-flex justify-content-between">
                <p className='fw-bold p-1'>*(G+D) WT</p>
                <p className='p-1'> {fixedValues(summary?.gDWt, 3)} gm</p>
              </div>
              <div className="d-flex justify-content-between">
                <p className='fw-bold p-1'>NET WT</p>
                <p className='p-1'> {fixedValues(summary?.netWt, 3)} gm</p>
              </div>
              <div className="d-flex justify-content-between">
                <p className='fw-bold p-1'>DIAMOND WT</p>
                <p className='p-1'> {NumberWithCommas(summary?.diamondpcs, 0)} / {NumberWithCommas(summary?.diamondWt, 3)} cts</p>
              </div>
              <div className="d-flex justify-content-between">
                <p className='fw-bold p-1'>STONE WT</p>
                <p className='p-1'> {NumberWithCommas(summary?.stonePcs, 0)} / {fixedValues(summary?.stoneWt)} cts</p>
              </div>
              <div className="d-flex justify-content-between border-top border-2 position-absolute w-100 border-bottom bottom-0 totalLineDetailPrint1">
                <p className='fw-bold p-1'></p>
                <p className='p-1'></p>
              </div>
            </div>
            <div className="col-6 position-relative summaryPadBotDetailPrint1 border-2 d-flex flex-column">
              <div className="d-flex justify-content-between">
                <p className='fw-bold p-1'>GOLD</p>
                <p className='p-1'> {NumberWithCommas(summary?.metalAmount, 2)}</p>
              </div>
              <div className="d-flex justify-content-between">
                <p className='fw-bold p-1'>DIAMOND</p>
                <p className='p-1'> {NumberWithCommas(summary?.diamondAmount, 2)}</p>
              </div>
              <div className="d-flex justify-content-between">
                <p className='fw-bold p-1'>CST</p>
                <p className='p-1'>{NumberWithCommas(summary?.colorStoneAmount, 2)}</p>
              </div>
              <div className="d-flex justify-content-between">
                <p className='fw-bold p-1'>MAKING</p>
                <p className='p-1'> {NumberWithCommas(summary?.makingAmount, 2)}</p>
              </div>
              <div className="d-flex justify-content-between">
                <p className='fw-bold p-1'>OTHER</p>
                <p className='p-1'> {NumberWithCommas(summary?.otherCharges, 2)}</p>
              </div>
              <div className="d-flex justify-content-between">
                <p className='fw-bold p-1'>LESS</p>
                <p className='p-1'> {NumberWithCommas(summary?.addLess, 2)}</p>
              </div>
              <div className="d-flex justify-content-between border-top border-2 position-absolute w-100 border-bottom  bottom-0 totalLineDetailPrint1">
                <p className='fw-bold p-1'>TOTAL</p>
                <p className='p-1'>{NumberWithCommas(total?.withDiscountTaxAmount, 2)}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-2  summaryPadBotDetailPrint1 pe-1">
          <div className='border-end border-2 border-start border-top'>
            <p className='fw-bold text-center border-bottom border-2 w-100'>Diamond Detail</p>
            {diamondDetails.length > 0 && diamondDetails.map((e, i) => {
              return e?.name ? <div className="d-flex" key={i}>
                <div className="col-6"> <p className='p-1'>{e?.name}</p> </div>
                <div className="col-6 text-end"> <p className='p-1'>{NumberWithCommas(e?.Pcs, 0)} / {fixedValues(e?.Wt, 3)} cts</p> </div>
              </div> : <div className="d-flex" key={i}>
                <div className="col-6"> <p className='p-1'>{e?.ShapeName} {e?.QualityName} {e?.Colorname}</p> </div>
                <div className="col-6 text-end"> <p className='p-1'>{NumberWithCommas(e?.Pcs, 0)} / {fixedValues(e?.Wt, 3)} cts</p> </div>
              </div>
            })}
            <div className="d-flex justify-content-between border-top border-2 w-100 border-bottom totalLineDetailPrint1">
              <p className='fw-bold p-1'></p>
              <p className='p-1'></p>
            </div>
          </div>
        </div>
        <div className="col-2 pe-1">
          <div className="border-bottom border-2 border-top">
            <p className='fw-bold text-center border-start border-end border-bottom border-2 w-100 border-start'>OTHER DETAILS</p>
            <div className="d-flex border-start border-end border-2">
              <div className="col-6"><p className='fw-bold p-1'>RATE IN 24KT</p></div>
              <div className="col-6"><p className="fw-bold text-end p-1">{NumberWithCommas(json0Data?.MetalRate24K, 2)}</p></div>
            </div>
          </div>
        </div>
        <div className="col-4">
          <div className="d-flex border-2 border-start border-end border-bottom createdByDetailPrint1 border-top">
            <div className="col-6 border-end border-2 d-flex align-items-end justify-content-center">Created By</div>
            <div className="col-6 d-flex align-items-end justify-content-center">Checked By</div>
          </div>
        </div>
      </div>
    </div> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>}

    </>
  )
}

export default DetailPrint12