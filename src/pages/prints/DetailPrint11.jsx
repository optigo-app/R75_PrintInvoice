import React, { useEffect, useState } from 'react';
import "../../assets/css/prints/detailPrint11.css";
import { NumberWithCommas, apiCall, checkMsg, fixedValues, handleImageError, handlePrint, isObjectEmpty, taxGenrator } from '../../GlobalFunctions';
import Loader from '../../components/Loader';

const DetailPrint11 = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {

  const [loader, setLoader] = useState(true);
  const [json0Data, setJson0Data] = useState({});
  const [json1Data, setJson1Data] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [diamondSize, setDiamondSize] = useState(true);
  const [image, setImage] = useState(true);
  const [setting, setSetting] = useState(true);
  const [tunch, setTunch] = useState(true);
  const [msg, setMsg] = useState("");
  const [gold, setGold] = useState({
    gold14k: false,
    gold18k: false,
  })
  const [total, setTotal] = useState({
    pcs: 0,
    diaWt: 0,
    diaAmount: 0,
    totalAmount: 0,
    totalGold: 0,
    totalLabour: 0,
    totalJewelleryAmount: 0,
    grandTotal: 0
  });
  const [summary, setSummary] = useState({
    gold14k: 0,
    gold18k: 0,
    diamondWt: 0,
    stoneWt: 0,
    grossWt: 0,
  });

  const [metalList, setMetalList] = useState([]);
  const [isImageWorking, setIsImageWorking] = useState(true);
  const handleImageErrors = () => {
    setIsImageWorking(false);
  };
  const loadData = (data) => {
    let goldRateFind = [];
    let golds = { ...gold };
    setJson0Data(data.BillPrint_Json[0]);
    let resultAr = [];
    let totals = { ...total };
    let summaries = { ...summary };
    let fineWt = 0;
    let goldsArr = [];
    data?.BillPrint_Json1.forEach((e) => {
      let objects = {
        GroupJob: e?.GroupJob,
        netWt: e?.NetWt,
        rate: 0,
        amount: 0
      }
      let elementsArr = [];
      let obj = { ...e };
      obj.metalRateGold = 0;
      obj.metalRateAmount = 0;
      // obj.metalRateGold = (e?.MetalAmount);
      // obj.metalRateGold += (ele?.Rate / data.BillPrint_Json[0]?.CurrencyExchRate);
      obj.metalNetWeightWithLossWt = e?.NetWt + e?.LossWt;
      obj.alloy = 0;
      obj.totalGold = 0;
      let totalCol = {
        pcs: 0,
        diaWt: 0,
        diaAmount: 0,
        settingAmount: 0,
      }
      obj.puregoldWeightWithLoss = obj?.NetWt + obj?.LossWt;
      data?.BillPrint_Json2.forEach((ele) => {
        if (ele?.StockBarcode === e?.SrJobno) {
          // totalCol.settingAmount += (ele?.SettingAmount / data.BillPrint_Json[0]?.CurrencyExchRate);
          totalCol.settingAmount += (ele?.SettingAmount);
          obj.puregoldWeightWithLoss += ele?.FineWt;
          if (ele?.MasterManagement_DiamondStoneTypeid === 1 || ele?.MasterManagement_DiamondStoneTypeid === 2) {
            totalCol.pcs += ele?.Pcs;
            let objects = { ...ele };
            // objects.Amount = ele?.Amount / data?.BillPrint_Json[0]?.CurrencyExchRate;
            // objects.SettingAmount = ele?.SettingAmount / data?.BillPrint_Json[0]?.CurrencyExchRate;
            let findIndex = elementsArr.findIndex((elem) => elem?.ShapeName === ele?.ShapeName &&
              elem?.QualityName === ele?.QualityName && elem?.Colorname === ele?.Colorname && ele?.Rate === elem?.Rate &&
              elem?.SizeName === ele?.SizeName && elem?.MasterManagement_DiamondStoneTypeid === ele?.MasterManagement_DiamondStoneTypeid);
            if (findIndex === -1) {
              elementsArr.push(objects);
            } else {
              // elementsArr[findIndex].Rate = ((elementsArr[findIndex].Amount / elementsArr[findIndex].Wt) + (ele.Amount / ele.Wt)) / 2
              elementsArr[findIndex].Rate = ele?.Rate
              elementsArr[findIndex].Wt += ele?.Wt;
              elementsArr[findIndex].Amount += ele?.Amount;
              elementsArr[findIndex].SettingAmount += ele?.SettingAmount;
              elementsArr[findIndex].Pcs += ele?.Pcs;

              if (elementsArr[findIndex].GroupName !== "") {
                elementsArr[findIndex].SizeName = elementsArr[findIndex].GroupName;
              }
              if (ele.GroupName !== "") {
                elementsArr[findIndex].SizeName = ele.GroupName;
              }

            }
            totals.pcs += ele?.Pcs;
            totals.diaWt += ele?.Wt;
            totals.diaAmount += (ele?.Amount / data.BillPrint_Json[0]?.CurrencyExchRate);
            totals.totalAmount += (ele?.SettingAmount / data.BillPrint_Json[0]?.CurrencyExchRate);
            totalCol.diaWt += ele?.Wt;
            totalCol.diaAmount += (ele?.Amount / data.BillPrint_Json[0]?.CurrencyExchRate);
            if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
              summaries.diamondWt += ele?.Wt;
            } else if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
              summaries.stoneWt += ele?.Wt;
            }
          }
          if (ele?.MasterManagement_DiamondStoneTypeid === 3) {
            obj.alloy += (ele?.Amount / data.BillPrint_Json[0]?.CurrencyExchRate);
            obj.totalGold += (ele?.Amount / data.BillPrint_Json[0]?.CurrencyExchRate);
            totals.totalGold += (ele?.Amount / data.BillPrint_Json[0]?.CurrencyExchRate);
          }
          
          if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
            objects.rate += ele?.Rate;
            objects.amount += ele?.Amount;
            if (ele?.QualityName === "18K") {
              golds.gold18k = true
              summaries.gold18k += ele?.Wt;
            } else if (ele?.QualityName === "14K") {
              golds.gold14k = true
              summaries.gold14k += ele?.Wt;
            }
            let findRecord = goldsArr.findIndex((elem) => elem?.label === ele?.ShapeName + " " + ele?.QualityName);
            if (findRecord === -1) {
              goldsArr.push({ label: ele?.ShapeName + " " + ele?.QualityName, value: ele?.Wt });
            } else {
              goldsArr[findRecord].value += ele?.Wt;
            }
            obj.totalGold += (ele?.Amount / data.BillPrint_Json[0]?.CurrencyExchRate);
            totals.totalGold += (ele?.Amount / data.BillPrint_Json[0]?.CurrencyExchRate);
            // obj.metalRateGold += (ele?.Rate / data.BillPrint_Json[0]?.CurrencyExchRate);
            obj.metalRateGold += ele?.Rate;
            obj.metalRateAmount += ele?.Amount;
            fineWt = ele?.FineWt
          }

          if(ele?.MasterManagement_DiamondStoneTypeid === 5) {
            obj.totalGold += (ele?.Amount / data.BillPrint_Json[0]?.CurrencyExchRate);
            totals.totalGold += (ele?.Amount / data.BillPrint_Json[0]?.CurrencyExchRate);
          }
        }
      });
      summaries.grossWt += e?.grosswt;
      obj.OtherCharges = (e?.OtherCharges / data.BillPrint_Json[0]?.CurrencyExchRate);
      totals.totalLabour += (e?.MakingAmount / data.BillPrint_Json[0]?.CurrencyExchRate);
      obj.MakingAmount = (e?.MakingAmount / data.BillPrint_Json[0]?.CurrencyExchRate);
      totals.totalJewelleryAmount += (e?.TotalAmount / data.BillPrint_Json[0]?.CurrencyExchRate);
      obj.TotalAmount = (e?.TotalAmount / data.BillPrint_Json[0]?.CurrencyExchRate);
      obj.materials = elementsArr;
      obj.totalCol = totalCol;
      obj.fineWt = fineWt;
      resultAr.push(obj);
      if (e?.GroupJob !== "") {
        let findGroup = goldRateFind.findIndex(elem => elem.GroupJob === e?.GroupJob);
        if (findGroup === -1) {
          goldRateFind.push(objects);
        } else {
          goldRateFind[findGroup].netWt += objects?.netWt;
          goldRateFind[findGroup].rate += objects.rate;
          goldRateFind[findGroup].amount += objects.amount;
        }
      }
    });
    let taxValue = taxGenrator(data?.BillPrint_Json[0], totals?.totalJewelleryAmount);
    taxValue.length > 0 && taxValue.forEach((e) => {
      totals.grandTotal += (+e?.amount / data.BillPrint_Json[0]?.CurrencyExchRate);
    });
    totals.grandTotal += data?.BillPrint_Json[0]?.AddLess + totals?.totalJewelleryAmount;
    setTaxes(taxValue);
    setSummary(summaries);
    setTotal(totals);
    // setJson1Data(resultAr);
    setLoader(false);
    setGold(golds);
    setMetalList(goldsArr);
    let newArr = [];
    resultAr.forEach((e, i) => {
      let obj = { ...e };
      let findRecord = newArr.findIndex((ele) => ele?.GroupJobid === e?.GroupJobid && e?.GroupJobid !== 0);
      if (findRecord === -1) {
        newArr.push(obj);
      } else {

        if (newArr[findRecord]?.SrJobno !== newArr[findRecord]?.GroupJob) {
          newArr[findRecord].SrJobno = obj?.SrJobno;
          newArr[findRecord].designno = obj?.designno;
          newArr[findRecord].MetalColor = obj?.MetalColor;
          newArr[findRecord].DesignImage = obj?.DesignImage;
          newArr[findRecord].MetalPurity = obj?.MetalPurity;
          newArr[findRecord].MetalColor = obj?.MetalColor;
        }

        newArr[findRecord].grosswt += obj?.grosswt;
        newArr[findRecord].NetWt += obj?.NetWt;
        newArr[findRecord].metalNetWeightWithLossWt += obj?.metalNetWeightWithLossWt;
        newArr[findRecord].LossPer += obj?.LossPer;
        newArr[findRecord].PureNetWt += obj?.PureNetWt;

        if (newArr[findRecord].metalRateGold !== obj?.metalRateGold) {
          let amountValue = (newArr[findRecord].metalRateAmount + obj?.metalRateAmount) / data.BillPrint_Json[0]?.CurrencyExchRate;
          newArr[findRecord].metalRateGold = amountValue / newArr[findRecord].NetWt;
        }
        
        // newArr[findRecord].metalRateGold = (newArr[findRecord].metalRateGold+obj?.metalRateGold)/(obj.NetWt*data.BillPrint_Json[0]?.CurrencyExchRate);

        // (obj.NetWt*data.BillPrint_Json[0]?.CurrencyExchRate)
        // newArr[findRecord].metalRateGold = (newArr[findRecord].metalRateGold+obj?.metalRateGold)/2;
        newArr[findRecord].alloy += obj?.alloy;
        newArr[findRecord].totalGold += obj?.totalGold;
        newArr[findRecord].OtherCharges += obj?.OtherCharges;
        newArr[findRecord].MakingAmount += obj?.MakingAmount;
        newArr[findRecord].TotalAmount += obj?.TotalAmount;
        newArr[findRecord].totalCol.pcs += obj.totalCol.pcs;
        newArr[findRecord].totalCol.diaWt += obj.totalCol.diaWt;
        newArr[findRecord].totalCol.diaAmount += obj.totalCol.diaAmount;
        newArr[findRecord].totalCol.settingAmount += obj.totalCol.settingAmount;
        let materialArr = [newArr[findRecord].materials, e.materials];
        let materials = [];
        materialArr.forEach((element) => {
          element.forEach((ele) => {
            let findRecords = materials.findIndex((elem) => elem?.ShapeName === ele?.ShapeName &&
              elem?.Colorname === ele?.Colorname && elem?.QualityName === ele?.QualityName && elem?.Rate === ele?.Rate &&
              elem?.MasterManagement_DiamondStoneTypeid === ele?.MasterManagement_DiamondStoneTypeid);

            if (findRecords === -1) {
              materials.push(ele);
            } else {
              materials[findRecords].Pcs += ele?.Pcs;
              materials[findRecords].Wt += ele?.Wt;
              materials[findRecords].Amount += ele?.Amount;
              materials[findRecords].SettingRate = ele?.SettingRate;
              materials[findRecords].SettingAmount += ele?.SettingAmount;
            }
          });
        });
        newArr[findRecord].materials = materials;
      }
    });
    let finalArr = [];
    newArr.forEach((e) => {
      let findRecord = goldRateFind.findIndex(elem => elem?.GroupJob === e?.GroupJob);
      let obj = { ...e };
      if (findRecord === -1) {
        obj.goldPrice = obj?.metalRateGold;
        finalArr.push(obj);
      } else {
        let goldPrice = goldRateFind[findRecord].amount / (data.BillPrint_Json[0]?.CurrencyExchRate * goldRateFind[findRecord].netWt);
        obj.goldPrice = goldPrice;
        finalArr.push(obj);
      }
    })
    setJson1Data(finalArr);
  }
  const onchangeSetting = () => {
    setSetting(!setting);
    setStyles(!setting === true ? "diamondDetail1" : "diamondDetail");
  }

  const [styles, setStyles] = useState(setting ? "diamondDetail1" : "diamondDetail");

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log("json0Data", json0Data);
  console.log("json1Data", json1Data);
  
  return (
    loader ? <Loader /> : msg === "" ? <>
      <div className='container containerDetailP11 mt-5 pad_60_allPrint'>
        {/* buttons */}
        <div className="d-flex justify-content-end align-items-center print_sec_sum4 mb-4">
          <div className="form-check pe-3 pt-2">
            <input className="form-check-input border-dark" type="checkbox" checked={image} onChange={e => setImage(!image)} />
            <label className="form-check-label pt-1">
              With Image
            </label>
          </div>
          <div className="form-check pe-3 pt-2">
            <input className="form-check-input border-dark" type="checkbox" checked={diamondSize} onChange={e => setDiamondSize(!diamondSize)} />
            <label className="form-check-label pt-1">
              Diamond Size
            </label>
          </div>
          <div className="form-check pe-3 pt-2">
            <input className="form-check-input border-dark" type="checkbox" checked={setting} onChange={e => onchangeSetting(e)} />
            <label className="form-check-label pt-1">
              Setting Label and Price
            </label>
          </div>
          <div className="form-check pt-2">
            <input className="form-check-input border-dark" type="checkbox" checked={tunch} onChange={e => setTunch(!tunch)} />
            <label className="form-check-label pt-1">
              Tunch
            </label>
          </div>
          <div className="form-check ps-3">
            <input type="button" className="btn_white blue" value="Print" onClick={(e) => handlePrint(e)} />
          </div>
        </div>
        {/* company with logo detail  */}
        <div className="headerDetailp11 border-start border-end border-top border-2 d-flex justify-content-between align-items-center">
          <div className='px-1 py-2'>
            <p>{json0Data?.CompanyFullName}</p>
            <p>{json0Data?.CompanyAddress}</p>
            <p>{json0Data?.CompanyAddress2}</p>
            <p>{json0Data?.CompanyCity} {json0Data?.CompanyPinCode} {json0Data?.CompanyState} {json0Data?.CompanyCountry}</p>
            <p>{json0Data?.CompanyEmail} | {json0Data?.CompanyWebsite}</p>
            <p>{json0Data?.Company_VAT_GST_No} | {json0Data?.Cust_CST_STATE}-{json0Data?.Company_CST_STATE_No} | PAN-{json0Data?.Pannumber}</p>
          </div>
          <div className='px-1 py-2'>
          {isImageWorking && (json0Data?.PrintLogo !== "" && 
                      <img src={json0Data?.PrintLogo} alt="" 
                      className='w-25 h-auto ms-auto d-block object-fit-contain'
                      onError={handleImageErrors} height={120} width={150} />)}
            {/* <img src={json0Data?.PrintLogo} alt="" className='w-25 h-auto ms-auto d-block' /> */}
          </div>
        </div>
        {/* address */}
        <div className="border px-1 py-2 d-flex justify-content-between border-2">
          <div className="w-50">
            <p> {json0Data?.lblBillTo}</p>
            <p> {json0Data?.customerfirmname}</p>
            <p> {json0Data?.customerAddress1}</p>
            <p> {json0Data?.customerAddress2}</p>
            <p> {json0Data?.customerAddress3}</p>
            <p> {json0Data?.customercity}, {json0Data?.State}-{json0Data?.PinCode}</p>
            <p> Tel: {json0Data?.customermobileno}</p>
            <p> {json0Data?.customeremail1}</p>
          </div>
          <div className="w-50 text-end">
            <p>invoice#:{json0Data?.InvoiceNo}</p>
            <p>GSTIN: {json0Data?.Cust_VAT_GST_No !== "" && (`${json0Data?.Cust_VAT_GST_No} | `)}  {json0Data?.Cust_CST_STATE} {json0Data?.Cust_CST_STATE_No} </p>
            <p>Terms: {json0Data?.DueDays} Days</p>
            <p>Due Date: {json0Data?.DueDate}</p>
          </div>
        </div>
        {/* table heading */}
        <div className="d-flex w-100 border-top border-bottom mt-1 border-start border-end border-2 ">
          <div className="srNoDetailPrint11 border-end p-1 d-flex align-items-center justify-content-center flex-column"><p className='fw-bold'>Sr.</p><p className='fw-bold'>No.</p></div>
          <div className="designDetailPrint11 border-end d-flex align-items-center justify-content-center"><p className='p-1 fw-bold'>Design Detail</p></div>
          <div className="diamondStoneDetailPrint11 d-grid">
            <div className='border-bottom border-end d-flex justify-content-center align-items-center'> <p className='p-1 text-center fw-bold fw-bold'>Diamond & Stone Detail</p> </div>
            <div className='d-flex'>
              <div className={`${styles} border-end d-flex align-items-center justify-content-center`}><p className='p-1 fw-bold'>Shape</p></div>
              <div className={`${styles} border-end d-flex align-items-center justify-content-center p-1 flex-column`}><p className='fw-bold'>Size</p><p className="fw-bold">(mm)</p></div>
              <div className={`${styles} border-end d-flex align-items-center justify-content-center`}><p className='p-1 fw-bold'>Pcs</p></div>
              <div className={`${styles} border-end d-flex align-items-center justify-content-center flex-column`}><p className='p-1 fw-bold'>DIA</p><p className="p-1 fw-bold"> WT.</p></div>
              <div className={`${styles} border-end d-flex align-items-center justify-content-center flex-column`}><p className='p-1 fw-bold'>Price  </p><p className='fw-bold'>/ cts</p></div>
              <div className={`${styles} border-end d-flex align-items-center justify-content-center p-1 flex-column`}><p className='text-center fw-bold'>Dia</p><p className="text-center fw-bold"> Amount</p></div>
              {setting && <div className={`${styles} border-end d-flex align-items-center justify-content-center flex-column p-1`}><p className='text-center fw-bold'>Setting </p><p>Type</p></div>}
              {setting && <div className={`${styles} border-end d-flex align-items-center justify-content-center flex-column p-1`}><p className='text-center fw-bold'>Setting </p><p className="text-center fw-bold">Price</p><p className="text-center fw-bold">(Currency)</p></div>}
              <div className={`${styles} border-end d-flex align-items-center justify-content-center flex-column p-1`}><p className='text-center fw-bold'>Total</p><p className="text-center fw-bold"> Amount</p><p className="text-center fw-bold">(Currency)</p></div>
            </div>
          </div>
          <div className="goldDetailPrint11 border-end d-grid">
            <div className="border-bottom d-flex">
              <p className='p-1 d-flex justify-content-center align-items-center w-100 fw-bold'>Gold</p>
            </div>
          </div>
          <div className="labourDetailPrint11 border-end d-grid">
            <div className="border-bottom d-flex">
              <p className='p-1 d-flex justify-content-center align-items-center w-100 fw-bold'>Labour</p>
            </div>
            <div className='d-flex'>
              <div className='col-6 border-end d-flex align-items-center justify-content-center flex-column p-1'><p className='text-center fw-bold'>Other</p><p className="text-center fw-bold">Charges</p></div>
              <div className='col-6 d-flex align-items-center justify-content-center flex-column p-1'>
                <p className='text-center fw-bold'>Labour</p><p className='text-center fw-bold'>Amount</p>
              </div>
            </div></div>
          <div className="totalAmountJewelleryDetailPrint11 d-flex align-items-center justify-content-center totalAmountDetailPrint11Jewellery p-1 flex-column"><p className='text-center pb-1 fw-bold'>Total </p><p className="text-center pb-1 fw-bold">Jewellery</p><p className="text-center fw-bold">Amount</p></div>
        </div>
        {/* data */}
        {json1Data.length > 0 && json1Data.map((e, i) => {
          return <div className="d-flex w-100 border-bottom border-start border-end border-2 no_break overflow-hidden" key={i}>
            <div className="srNoDetailPrint11 border-end p-1 d-flex align-items-center justify-content-center"><p>{i + 1}</p></div>
            <div className="designDetailPrint11 border-end">
              <div className="d-flex justify-content-between p-1">
                <div><p>{e?.designno}</p></div>
                <div> <p>{ atob(evn) === 'quote' ? '' :  e?.SrJobno}</p> <p>{e?.MetalColor}</p> </div>
              </div>
              {image && <img src={e?.DesignImage} alt="" className='w-100 p-1' onError={handleImageError} />}
              {tunch && <p className='text-center fw-bold'>Tunch: {NumberWithCommas(e?.Tunch, 3)}</p>}
              <p className='text-center fw-bold'>{fixedValues(e?.grosswt, 3)}gm Gross</p>
              {e?.Size.length > 0 && <p className='text-center pb-1'>Size {e?.Size}</p>}
              {e?.HUID !== "" && <p className='text-center pb-1'>HUID: {e?.HUID}</p>}
            </div>
            <div className="diamondStoneDetailPrint11 d-grid pad_bt_20semiTotalDetailPrint11 position-relative">
              {e?.materials?.length > 0 ? e?.materials.map((ele, ind) => {
                
                return <div className='d-flex border-bottom' key={ind}>
                  <div className={`${styles} border-end d-flex align-items-center justify-content-center`}><p className=''>{ele?.ShapeName}</p></div>
                  <div className={`${styles} border-end d-flex align-items-center justify-content-center`}><p className=''>{diamondSize && (ele?.GroupName === "" ? ele?.SizeName : (ele?.MasterManagement_DiamondStoneTypeid !== 2 ? ele?.GroupName : ele?.SizeName))}</p></div>
                  <div className={`${styles} border-end d-flex align-items-center justify-content-center`}><p className=''>{NumberWithCommas(ele?.Pcs, 0)}</p></div>
                  <div className={`${styles} border-end d-flex align-items-center justify-content-center`}><p className=''>{fixedValues(ele?.Wt, 3)}</p></div>
                  {/* <div className={`${styles} border-end d-flex align-items-center justify-content-center flex-column`}><p className=''>{NumberWithCommas(ele?.Rate, 2)}</p></div> */}
                  {/* <div className={`${styles} border-end d-flex align-items-center justify-content-center flex-column`}><p className=''>{NumberWithCommas((ele?.Amount /ele?.Wt), 2)}</p></div> */}
                  <div className={`${styles} border-end d-flex align-items-center justify-content-center flex-column`}><p className=''>{NumberWithCommas((ele?.Rate), 2)}</p></div>
                  <div className={`${styles} border-end d-flex align-items-center justify-content-center flex-column`}><p className='text-center'>{NumberWithCommas((ele?.Amount / json0Data?.CurrencyExchRate ), 2)}</p></div>
                  {setting && <div className={`${styles} border-end d-flex align-items-center justify-content-center flex-column`}><p className='text-center'>{ele?.SettingName}</p></div>}
                  {setting && <div className={`${styles} border-end d-flex align-items-center justify-content-center flex-column`}><p className='text-center'>{NumberWithCommas(ele?.SettingRate, 2)}</p></div>}
                  <div className={`${styles} border-end d-flex align-items-center justify-content-center flex-column`}><p className='text-center'>{NumberWithCommas((ele?.SettingAmount / json0Data?.CurrencyExchRate), 2)}</p></div>
                </div>
              }) : <div className='d-flex border-bottom'>
                <div className={`${styles} border-end d-flex align-items-center justify-content-center`}><p className=''></p></div>
                <div className={`${styles} border-end d-flex align-items-center justify-content-center`}><p className=''></p></div>
                <div className={`${styles} border-end d-flex align-items-center justify-content-center`}><p className=''></p></div>
                <div className={`${styles} border-end d-flex align-items-center justify-content-center`}><p className=''></p></div>
                <div className={`${styles} border-end d-flex align-items-center justify-content-center flex-column`}><p className=''></p></div>
                <div className={`${styles} border-end d-flex align-items-center justify-content-center flex-column`}><p className='text-center'></p></div>
                <div className={`${styles} border-end d-flex align-items-center justify-content-center flex-column`}><p className='text-center'></p></div>
                <div className={`${styles} border-end d-flex align-items-center justify-content-center flex-column`}><p className='text-center'></p></div>
                <div className={`${styles} border-end d-flex align-items-center justify-content-center flex-column`}><p className='text-center'></p></div>
              </div>
              }
              <div className='d-flex position-absolute w-100 bottom-0 totalHeightDetailPrint11 semiTotalDetailPrint11 border-end'>
                <div className={`${styles} border-end d-flex align-items-center justify-content-center`}><p className='fw-bold'>Total</p></div>
                <div className={`${styles} border-end d-flex align-items-center justify-content-center flex-column`}><p className='fw-bold'>No. Of </p><p className="fw-bold">Pieces</p></div>
                <div className={`${styles} border-end d-flex align-items-center justify-content-center`}><p className='fw-bold'>{NumberWithCommas(e?.totalCol?.pcs, 0)}</p></div>
                <div className={`${styles} border-end d-flex align-items-center justify-content-center`}><p className='fw-bold'>{fixedValues(e?.totalCol?.diaWt, 3)}</p></div>
                <div className={`${styles} border-end d-flex align-items-center justify-content-center flex-column`}><p className='fw-bold'>Diamond </p><p className="fw-bold">Total</p></div>
                <div className={`${styles} border-end d-flex align-items-center justify-content-center flex-column`}><p className='text-center fw-bold'>{NumberWithCommas(e?.totalCol?.diaAmount, 2)}</p></div>
                {setting && <div className={`${styles} border-end d-flex align-items-center justify-content-center flex-column`}><p className='text-center fw-bold'></p></div>}
                {setting && <div className={`${styles} border-end d-flex align-items-center justify-content-center flex-column`}><p className='text-center fw-bold'>Setting</p><p>Total</p><p>(Currency)</p></div>}
                <div className={`${styles} d-flex align-items-center justify-content-center flex-column`}><p className='text-center fw-bold'>{NumberWithCommas((e?.totalCol?.settingAmount / json0Data?.CurrencyExchRate), 2)}</p></div>
              </div>
            </div>
            <div className="goldDetailPrint11 border-end d-grid">
              <div className='d-flex border-bottom'>
                <div className='col-7 border-end d-flex align-items-center fw-bold'><p className=''>Quality</p></div>
                <div className='col-5 d-flex align-items-center justify-content-center'><p className=''>{e?.MetalPurity} {e?.MetalColor}</p></div>
              </div>
              <div className='d-flex border-bottom'>
                <div className='col-7 border-end d-flex align-items-center fw-bold'><p className=''>Gross Weight(Gms)</p></div>
                <div className='col-5 d-flex align-items-center justify-content-center'><p className=''>{fixedValues(e?.grosswt, 3)} G</p></div>
              </div>
              <div className='d-flex border-bottom'>
                <div className='col-7 border-end d-flex align-items-center fw-bold'><p className=''>Net Weight</p></div>

                {/* <div className='col-5 d-flex align-items-center justify-content-center'><p className=''>{fixedValues(e?.NetWt, 3)} G</p></div> */}
                <div className='col-5 d-flex align-items-center justify-content-center'><p className=''>{fixedValues(e?.metalNetWeightWithLossWt, 3)} G</p></div>
              </div>
              <div className='d-flex border-bottom'>
                <div className='col-7 border-end d-flex align-items-center fw-bold'><p className=''>Gold Loss</p></div>
                <div className='col-5 d-flex align-items-center justify-content-center'><p>{fixedValues(e?.LossPer, 0)}%</p></div>
              </div>
              <div className='d-flex border-bottom'>
                <div className='col-7 border-end d-flex align-items-start justify-content-center fw-bold flex-column'><p>Pure Gold weight</p><p> with Loss</p></div>
                <div className='col-5 d-flex align-items-center justify-content-center'><p>{fixedValues(e?.PureNetWt, 3)} G </p></div>
              </div>
              <div className='d-flex border-bottom'>
                <div className='col-7 border-end d-flex align-items-center fw-bold'><p className=''>Gold Price</p></div>
                <div className='col-5 d-flex align-items-center justify-content-center'><p>{NumberWithCommas(e?.goldPrice, 2)}</p></div>
                {/* <div className='col-5 d-flex align-items-center justify-content-center'><p>{NumberWithCommas(e?.metalRateGold, 2)}</p></div> */}
              </div>
              <div className='d-flex border-bottom broder-start'>
                <div className='col-7 border-end d-flex align-items-center fw-bold'><p className='p-1'>Alloy</p></div>
                <div className='col-5 d-flex align-items-center justify-content-center'><p>{NumberWithCommas(e?.alloy, 2)}</p></div>
              </div>
              <div className='d-flex'>
                <div className='col-7 border-end d-flex align-items-center fw-bold'><p className='p-1'>Total Gold</p></div>
                <div className='col-5 d-flex align-items-center justify-content-center'><p className='fw-bold'>{NumberWithCommas(e?.totalGold, 2)}</p></div>
              </div>
            </div>
            <div className="labourDetailPrint11 border-end d-grid pad_bt_20DetailPrint11 position-relative">
              <div className='d-flex border-bottom'>
                <div className='col-6 border-end d-flex align-items-center justify-content-end p-1'><p>{NumberWithCommas(e?.OtherCharges, 2)}</p></div>
                <div className='col-6 d-flex align-items-center justify-content-end p-1'>
                  <p>{NumberWithCommas(e?.MakingAmount, 2)}</p>
                </div>
              </div>
              <div className='d-flex position-absolute bottom-0 w-100 min_height_20DetailPrint11'>
                <div className='col-6 border-end d-flex align-items-center justify-content-end p-1'><p className='fw-bold'>{NumberWithCommas(e?.OtherCharges, 2)}</p></div>
                <div className='col-6 d-flex align-items-center justify-content-end p-1'>
                  <p className='fw-bold'>{NumberWithCommas(e?.MakingAmount, 2)}</p>
                </div>
              </div>
            </div>
            <div className="d-grid pad_bt_20DetailPrint11 position-relative totalAmountJewelleryDetailPrint11 ">
              <div className="d-flex align-items-center justify-content-end p-1 totalAmountDetailPrint11Jewellery border-bottom pe-2"><p>{NumberWithCommas(e?.TotalAmount, 2)}</p></div>
              <div className=" d-flex align-items-center justify-content-end p-1 totalAmountDetailPrint11Jewellery position-absolute bottom-0 w-100 min_height_20DetailPrint11 pe-2"><p className='fw-bold'>{NumberWithCommas(e?.TotalAmount, 2)}</p></div>
            </div>
          </div>
        })}
        {/* total */}
        <div className="d-flex w-100 border-bottom border-start border-end border-2  no_break">
          <div className="totalDesignDetailPrint11 border-end d-flex align-items-center justify-content-center">
            <p className='text-center fw-bold'>Total</p>
          </div>
          <div className="diamondStoneDetailPrint11 d-grid diamondStoneDetailPrint11">
            <div className='d-flex'>
              <div className={`${styles} border-end d-flex align-items-center justify-content-center sizeDetailPrint11 flex-column`}><p className='fw-bold'></p></div>
              <div className={`${styles} border-end d-flex align-items-center justify-content-center sizeDetailPrint11 flex-column`}><p className='fw-bold'>No of </p><p className="fw-bold">Pieces</p></div>
              <div className={`${styles} border-end d-flex align-items-center justify-content-center`}><p className='fw-bold'>{NumberWithCommas(total?.pcs, 0)}</p></div>
              <div className={`${styles} border-end d-flex align-items-center justify-content-center`}><p className='fw-bold'>{fixedValues(total?.diaWt, 3)}</p></div>
              <div className={`${styles} border-end d-flex align-items-center justify-content-center flex-column`}><p className='fw-bold text-start'>Diamond </p><p className="fw-bold text-start">total</p>
              </div>
              <div className={`${styles} border-end d-flex align-items-center justify-content-center flex-column`}><p className='text-center fw-bold'>{NumberWithCommas(total?.diaAmount, 2)}</p></div>
              <div className={`${styles} border-end d-flex align-items-center justify-content-center flex-column`}><p className='text-center fw-bold'></p></div>
              {setting && <div className={`${styles} border-end d-flex align-items-center justify-content-center flex-column`}><p className='text-center fw-bold'>Setting </p><p className="text-center fw-bold">Total</p><p className="text-center fw-bold">(Currency)</p></div>}
              {setting && <div className={`${styles} border-end d-flex align-items-center justify-content-center flex-column`}><p className='text-center fw-bold'>{NumberWithCommas(total?.totalAmount, 2)}</p></div>}
            </div>
          </div>
          <div className="goldDetailPrint11 border-end d-grid ">
            <div className='d-flex'>
              <div className='col-7 border-end d-flex align-items-center justify-content-center'><p className='fw-bold'>Total Gold</p></div>
              <div className='col-5 d-flex align-items-center justify-content-center'><p className='fw-bold'>{fixedValues(total?.totalGold, 2)}</p></div>
            </div>
          </div>
          <div className="labourDetailPrint11 border-end d-flex">
            <div className='col-6 border-end d-flex align-items-center flex-column'><p className='fw-bold'>Total </p><p className='fw-bold'>Labour</p></div>
            <div className='col-6 d-flex align-items-center justify-content-end'>
              <p className='fw-bold'>{NumberWithCommas(total?.totalLabour, 2)}</p>
            </div>
          </div>
          <div className=" d-flex align-items-center justify-content-end totalAmountJewelleryDetailPrint11  fw-bold ps-1 pe-2"><p>
            <span dangerouslySetInnerHTML={{ __html: json0Data?.Currencysymbol }}></span>{NumberWithCommas(total?.totalJewelleryAmount, 2)}</p></div>
        </div>
        {/* remark */}
        <div className="d-flex w-100 border-bottom border-start border-end border-2 no_break">
          {/* remarkDetailPrint11 
         blankSpaceDetailPrint11 
         goldDetailsPrints11 
         totalLessDetailPrint11 
         totaljewAmountDetailPrint11 */}
          <div className="col-5 border-end">
            <p className='p-1 fw-bold fs-6'>Remark :</p>
            <div dangerouslySetInnerHTML={{ __html: json0Data?.PrintRemark }} className='p-1 text-break'></div>
          </div>
          <div className="col-2 border-end">
          </div>
          <div className="col-2 border-end">
            {metalList.length > 0 && metalList.map((e, i) => {
              return e?.value !== 0 && <div className="d-flex w-100 justify-content-between p-1" key={i}>
                <div><p>{e?.label}</p></div>
                <div><p>{fixedValues(e?.value, 3)} gm</p></div>
              </div>
            })}
            {/* {gold.gold14k && <div className="d-flex w-100 justify-content-between p-1">
              <div><p>GOLD 14K :</p></div>
              <div><p>{fixedValues(summary?.gold14k, 3)} gm</p></div>
            </div>}
            {gold.gold18k && <div className="d-flex w-100 justify-content-between p-1">
              <div><p>GOLD 18K: </p></div>
              <div><p>{fixedValues(summary?.gold18k, 3)} gm</p></div>
            </div>} */}
            <div className="d-flex w-100 justify-content-between p-1">
              <div><p>Diamond Wt:</p></div>
              <div><p>{fixedValues(summary?.diamondWt, 3)} cts</p></div>
            </div>
            <div className="d-flex w-100 justify-content-between p-1">
              <div><p>Stone Wt:</p></div>
              <div><p>{fixedValues(summary?.stoneWt, 3)} cts</p></div>
            </div>
            <div className="d-flex w-100 justify-content-between p-1">
              <div><p>Gross Wt:</p></div>
              <div><p>{fixedValues(summary?.grossWt, 3)} gm</p></div>
            </div>
          </div>
          <div className="col-2 border-end">
            <div className="d-flex justify-content-between w-100 p-1">
              <p>Total</p>
            </div>
            {taxes.length > 0 && taxes.map((e, i) => {
              return <div className="d-flex justify-content-between w-100 p-1" key={i}>
                <p>{e?.name} per {e?.per}</p>
              </div>
            })}
            {json0Data?.AddLess !== 0 && <div className="d-flex justify-content-between w-100 p-1">
              <p>{json0Data?.AddLess > 0 ? "Add" : "Less"}</p>
            </div>}
          </div>
          <div className="col-1 py-1">
            <p className='text-end py-1 fw-bold pe-2'><span dangerouslySetInnerHTML={{ __html: json0Data?.Currencysymbol }}></span>{NumberWithCommas(total?.totalJewelleryAmount, 2)}</p>
            {taxes.length > 0 && taxes.map((e, i) => {
              return <p className='text-end py-1 fw-bold pe-2' key={i}><span dangerouslySetInnerHTML={{ __html: json0Data?.Currencysymbol }}></span>{NumberWithCommas(+e?.amount / json0Data?.CurrencyExchRate, 2)}</p>
            })}
            {json0Data?.AddLess !== 0 && <p className='text-end py-1 fw-bold pe-2'><span dangerouslySetInnerHTML={{ __html: json0Data?.Currencysymbol }}></span>{json0Data?.AddLess}</p>}
          </div>
        </div>
        {/* Grand total*/}
        <div className="d-flex border-bottom border-start border-end border-2 no_break">
          <div className="col-5"></div>
          <div className="col-2"></div>
          <div className="col-2"></div>
          <div className="col-2 border-end p-1"> <p className='fw-bold text-end'>Grand Total </p></div>
          <div className="col-1 py-1">
            <p className="fw-bold text-end pe-2"><span dangerouslySetInnerHTML={{ __html: json0Data?.Currencysymbol }}></span>{NumberWithCommas(total?.grandTotal, 2)}</p>
          </div>
        </div>
        {/* Bank Detail */}
        <div className="d-flex border-bottom border-start border-end border-2 no_break">
          <div className="col-6 border-end">
            <p className='p-1'>Bank Detail</p>
            <p className='p-1'>Bank Name: {json0Data?.bankname}</p>
            <p className='p-1'>Branch: {json0Data?.bankaddress}</p>
            <p className='p-1'>Account Name: {json0Data?.accountname} </p>
            <p className='p-1'>Account No. : {json0Data?.accountnumber}</p>
            <p className='p-1'>RTGS/NEFT IFSC: {json0Data?.rtgs_neft_ifsc}</p>
          </div>
          <div className="col-3 border-end d-flex flex-column justify-content-between">
            <p className='p-1'>{json0Data?.CompanyFullName}</p>
            <p className='p-1 fw-bold'>Signature</p>
          </div>
          <div className="col-3 d-flex flex-column justify-content-between">
            <p className='p-1'>{json0Data?.customerfirmname}</p>
            <p className='p-1 fw-bold'>Signature</p>
          </div>
        </div>
      </div>
      {/* <SampleDetailPrint11 /> */}
    </> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
  )
}

export default DetailPrint11;