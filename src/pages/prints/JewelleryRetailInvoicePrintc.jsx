import React, { useState, useEffect } from "react";
import "../../assets/css/prints/jewellaryinvoiceprint.css";
import style from "../../assets/css/prints/jewelleryRetailinvoicePrint3.module.css";
import {
  apiCall,
  CapitalizeWords,
  checkMsg,
  fixedValues,
  formatAmount,
  GovernMentDocuments,
  handleImageError,
  isObjectEmpty,
  NumberWithCommas,
  ReceiveInBank,
  taxGenrator,
} from "../../GlobalFunctions";
import Button from "../../GlobalFunctions/Button";
import Loader from "../../components/Loader";
import { ToWords } from 'to-words';
import { cloneDeep } from "lodash";
import { OrganizeInvoicePrintData } from './../../GlobalFunctions/OrganizeInvoicePrintData';

const JewelleryRetailInvoicePrintc = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
  const [headerData, setHeaderData] = useState({});
  const [data, setdata] = useState([]);
  const [data2, setdata2] = useState([]);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const toWords = new ToWords();
  const [image, setImage] = useState(true);
  const [isImageWorking, setIsImageWorking] = useState(true);
  const handleImageErrors = () => {
    setIsImageWorking(false);
  };
  const [total, setTotal] = useState({
    gwt: 0,
    stoneWt: 0,
    diaColorWt: 0,
    nwt: 0,
    metalMaking: 0,
    others: 0,
    total: 0,
    discount: 0,
    afterTax: 0,
    netBalAmount: 0
  });
  const [documents, setDocuments] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [bank, setBank] = useState([]);
  const [metRate, setMetRate] = useState([]);

  async function loadData(data) {
    try {
      setHeaderData(data?.BillPrint_Json[0]);
      let blankArr = [];
      let totals = { ...total };

      //diamond grouping start
      let diaArr = [];
      // data?.BillPrint_Json1?.forEach((e) => {
      //   data?.BillPrint_Json2?.forEach((el) => {
      //     let b = cloneDeep(el);
      //     if(e?.SrJobno === b?.StockBarcode){
      //       if(el?.MasterManagement_DiamondStoneTypeid === 1){
      //         console.log(el);
      //          let findrec =  diaArr?.findIndex((a) => a?.ShapeName === b?.ShapeName)
      //          if(findrec === -1){
      //           diaArr.push(b);
      //          }else{
      //           diaArr[findrec].Wt += b?.Wt;
      //           diaArr[findrec].Amount += b?.Amount;
      //           diaArr[findrec].Pcs += b?.Pcs;
      //          }
      //       }
      //     }
      //   })
      // });

      //  let bj2 = data?.BillPrint_Json2?.filter((e) => e?.MasterManagement_DiamondStoneTypeid !== 1);
      //  const mainBJ = [...bj2, ...diaArr];
      // console.log(diaArr);
      //  data.BillPrint_Json2 = mainBJ;


       //diamond grouping over

      data?.BillPrint_Json1.forEach((e, i) => {
        let obj = { ...e };
        totals.gwt += e?.grosswt;
        // totals.nwt += e?.NetWt;
        totals.nwt += e?.MetalDiaWt;
        totals.others += e?.OtherCharges;
        totals.total += e?.TotalAmount;
        totals.discount += e?.DiscountAmt;
        let materials = [];
        let metalMaking = obj?.MetalAmount + obj?.MakingAmount;

        // data?.BillPrint_Json2.forEach((ele, ind) => {
        //   if (e?.SrJobno === ele?.StockBarcode) {
        //     if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
        //       materials.unshift(ele);
        //     };
        //     if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
        //       totals.diaColorWt += ele?.Wt;
        //       let findIndex = materials.findIndex(elem => elem?.MasterManagement_DiamondStoneTypeid === 1);
        //       // if (findIndex === -1) {
        //         materials.push(ele);
        //       // } else {
        //       //   materials[findIndex].Wt += ele?.Wt;
        //       // }
        //     }
        //     if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
        //       totals.diaColorWt += ele?.Wt;
        //       let findIndex = materials.findIndex(elem => elem?.MasterManagement_DiamondStoneTypeid === 2);
        //       if (findIndex === -1) {
        //         materials.push(ele);
        //       } else {
        //         materials[findIndex].Wt += ele?.Wt;
        //       }
        //     }
        //     if (ele?.MasterManagement_DiamondStoneTypeid === 3) {
        //       totals.stoneWt += ele?.Wt;
        //       let findIndex = materials.findIndex(elem => elem?.MasterManagement_DiamondStoneTypeid === 3);
        //       if (findIndex === -1) {
        //         materials.push(ele);
        //       } else {
        //         materials[findIndex].Wt += ele?.Wt;
        //       }
        //     }
        //   }
        // });
        obj.materials = materials;
        obj.metalMaking = metalMaking;
        blankArr.push(obj);
      });
      let taxValue = taxGenrator(data?.BillPrint_Json[0], totals?.total);
      taxValue.forEach((e, i) => {
        totals.afterTax += +e?.amount;
      });
      totals.afterTax += totals?.total + data?.BillPrint_Json[0]?.AddLess;
      let debitCardinfo = ReceiveInBank(data?.BillPrint_Json[0]?.BankPayDet);
      setBank(debitCardinfo);
      totals.netBalAmount = totals.afterTax - data?.BillPrint_Json[0]?.OldGoldAmount - data?.BillPrint_Json[0]?.CashReceived - data?.BillPrint_Json[0]?.AdvanceAmount;
      debitCardinfo.length > 0 && debitCardinfo.forEach((e, i) => {
        totals.netBalAmount -= e.amount;
      });
      setTaxes(taxValue);
      setTotal(totals);
      // let resultArr = [];
      // // blankArr.forEach((e, i) => {
      // //   if (e?.GroupJob !== "") {
      // //     let findIndex = resultArr.findIndex(ele => ele?.GroupJob === e?.GroupJob);
      // //     if (findIndex === -1) {
      // //       resultArr.push(e);
      // //     } else {
      // //       resultArr[findIndex].MakingAmount += e?.MakingAmount;
      // //       resultArr[findIndex].MetalAmount += e?.MetalAmount;
      // //       resultArr[findIndex].OtherCharges += e?.OtherCharges;
      // //       resultArr[findIndex].TotalAmount += e?.TotalAmount;
      // //       resultArr[findIndex].grosswt += e?.grosswt;
      // //       resultArr[findIndex].NetWt += e?.NetWt;
      // //       let arr = [resultArr[findIndex], e];
      // //       let findRecord = arr.find(elem => elem?.SrJobno === e?.GroupJob);
      // //       resultArr[findIndex].SubCategoryname = findRecord?.SubCategoryname;
      // //       resultArr[findIndex].Collectionname = findRecord?.Collectionname;
      // //       resultArr[findIndex].designno = findRecord?.designno;
      // //       resultArr[findIndex].SrJobno = findRecord?.SrJobno;
      // //       resultArr[findIndex].DesignImage = findRecord?.DesignImage;
      // //       e?.materials.forEach((ele, ind) => {
      // //         let arr = [1, 2, 3];
      // //         arr.forEach((element, index) => {
      // //           if (ele?.MasterManagement_DiamondStoneTypeid === element) {
      // //             let findindexs = resultArr[findIndex].materials.findIndex((elem, index) => elem?.MasterManagement_DiamondStoneTypeid === element);
      // //             if (findindexs === -1) {
      // //               resultArr[findIndex].materials.push(ele);
      // //             } else {
      // //               resultArr[findIndex].materials[findindexs].Wt += ele?.Wt;
      // //             }
      // //           }
      // //         });
      // //         if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
      // //           let findIndexss = resultArr[findIndex].materials.findIndex((elem, index) => elem?.MasterManagement_DiamondStoneTypeid === 4);
      // //           let findShapenameIndex = findRecord.materials.findIndex(elements => elements?.MasterManagement_DiamondStoneTypeid === 4)
      // //           resultArr[findIndex].materials[findIndexss].ShapeName = findRecord?.materials[findShapenameIndex].ShapeName;
      // //           resultArr[findIndex].materials[findIndexss].QualityName = findRecord?.materials[findShapenameIndex].QualityName;
      // //         }
      // //       });

      // //     }
      // //   } else {
      // //     resultArr.push(e);
      // //   }
      // // });
      // setdata(resultArr);
      let document = GovernMentDocuments(data?.BillPrint_Json[0]?.DocumentDetail);
      setDocuments(document);
      setLoader(false);


      //metal grouping start
      let metrate = [];
      data?.BillPrint_Json2?.forEach((a) => {
        const e = cloneDeep(a);

        if(e?.MasterManagement_DiamondStoneTypeid === 4){
          let findrec = metrate?.findIndex((al) => al?.QualityName === e?.QualityName );
          if(findrec === -1){
            metrate.push(e);
          }
        }

      })
      setMetRate(metrate);

      //metal grouping over

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const sendData = async () => {
      try {
        const data = await apiCall(token, invoiceNo, printName, urls, evn, ApiVer);
        if (data?.Status === "200") {
          let isEmpty = isObjectEmpty(data?.Data);
          if (!isEmpty) {
            loadData(data?.Data);
            loadData2(data?.Data);
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
  }, []);

  const handleChangeImage = (e) => {
    image ? setImage(false) : setImage(true);
  }

  function loadData2(data){
    const datas2 = OrganizeInvoicePrintData(
      data?.BillPrint_Json[0],
      data?.BillPrint_Json1,
      data?.BillPrint_Json2
    );
    const datas_clone = cloneDeep(datas2);

    let finalArr = [];

    datas_clone?.resultArray?.forEach((a) => {
        if(a?.GroupJob === ''){
          finalArr.push(a);
      }else{
        let b = cloneDeep(a);
        let find_record = finalArr.findIndex((el) => el?.GroupJob === b?.GroupJob);
        if(find_record === -1){
          finalArr.push(b);
        }else{
          if(finalArr[find_record]?.GroupJob !== finalArr[find_record]?.SrJobno){
              finalArr[find_record].designno = b?.designno;
              finalArr[find_record].HUID = b?.HUID; 
          }

          finalArr[find_record].grosswt += b?.grosswt;
          finalArr[find_record].NetWt += b?.NetWt;
          finalArr[find_record].LossWt += b?.LossWt;
          finalArr[find_record].TotalAmount += b?.TotalAmount;
          finalArr[find_record].DiscountAmt += b?.DiscountAmt;
          finalArr[find_record].UnitCost += b?.UnitCost;
          finalArr[find_record].MakingAmount += b?.MakingAmount;
          finalArr[find_record].OtherCharges += b?.OtherCharges;
          finalArr[find_record].TotalDiamondHandling += b?.TotalDiamondHandling;
          finalArr[find_record].Quantity += b?.Quantity;
          finalArr[find_record].Wastage += b?.Wastage;

          finalArr[find_record].diamonds = [...finalArr[find_record]?.diamonds, ...b?.diamonds]?.flat();
          finalArr[find_record].colorstone = [...finalArr[find_record]?.colorstone, ...b?.colorstone]?.flat();
          finalArr[find_record].metal = [...finalArr[find_record]?.metal, ...b?.metal]?.flat();
          finalArr[find_record].misc = [...finalArr[find_record]?.misc ,...b?.misc]?.flat();
          finalArr[find_record].misc_0List = [...finalArr[find_record]?.misc_0List ,...b?.misc_0List]?.flat();
          finalArr[find_record].finding = [...finalArr[find_record]?.finding ,...b?.finding]?.flat();
          finalArr[find_record].other_details_array = [...finalArr[find_record]?.other_details_array ,...b?.other_details_array]?.flat();

          finalArr[find_record].other_details_array_amount += b?.other_details_array_amount;

          finalArr[find_record].totals.diamonds.Wt += b?.totals?.diamonds?.Wt;
          finalArr[find_record].totals.diamonds.Pcs += b?.totals?.diamonds?.Pcs;
          finalArr[find_record].totals.diamonds.Amount += b?.totals?.diamonds?.Amount;
          finalArr[find_record].totals.diamonds.SettingAmount += b?.totals?.diamonds?.SettingAmount;

          finalArr[find_record].totals.finding.Wt += b?.totals?.finding?.Wt;
          finalArr[find_record].totals.finding.Rate = b?.totals?.finding?.Rate;
          finalArr[find_record].totals.finding.Pcs += b?.totals?.finding?.Pcs;
          finalArr[find_record].totals.finding.Amount += b?.totals?.finding?.Amount;
          finalArr[find_record].totals.finding.SettingAmount += b?.totals?.finding?.SettingAmount;

          finalArr[find_record].totals.colorstone.Wt += b?.totals?.colorstone?.Wt;
          finalArr[find_record].totals.colorstone.Pcs += b?.totals?.colorstone?.Pcs;
          finalArr[find_record].totals.colorstone.Amount += b?.totals?.colorstone?.Amount;
          finalArr[find_record].totals.colorstone.SettingAmount += b?.totals?.colorstone?.SettingAmount;

          finalArr[find_record].totals.misc.Wt += b?.totals?.misc?.Wt;
          finalArr[find_record].totals.misc.Pcs += b?.totals?.misc?.Pcs;
          finalArr[find_record].totals.misc.Amount += b?.totals?.misc?.Amount;
          finalArr[find_record].totals.misc.SettingAmount += b?.totals?.misc?.SettingAmount;

          finalArr[find_record].totals.misc.IsHSCODE_0_amount += b?.totals?.misc?.IsHSCODE_0_amount;
          finalArr[find_record].totals.misc.IsHSCODE_0_pcs += b?.totals?.misc?.IsHSCODE_0_pcs;
          finalArr[find_record].totals.misc.IsHSCODE_0_wt += b?.totals?.misc?.IsHSCODE_0_wt;

          finalArr[find_record].totals.metal.Amount += b?.totals?.metal?.Amount;
          finalArr[find_record].totals.metal.Wt += b?.totals?.metal?.Wt;
          finalArr[find_record].totals.metal.Pcs += b?.totals?.metal?.Pcs;

          finalArr[find_record].totals.metal.IsNotPrimaryMetalAmount += b?.totals?.metal?.IsNotPrimaryMetalAmount;
          finalArr[find_record].totals.metal.IsNotPrimaryMetalPcs += b?.totals?.metal?.IsNotPrimaryMetalPcs;
          finalArr[find_record].totals.metal.IsNotPrimaryMetalSettingAmount += b?.totals?.metal?.IsNotPrimaryMetalSettingAmount;
          finalArr[find_record].totals.metal.IsNotPrimaryMetalWt += b?.totals?.metal?.IsNotPrimaryMetalWt;

          finalArr[find_record].totals.metal.IsPrimaryMetalAmount += b?.totals?.metal?.IsPrimaryMetalAmount;
          finalArr[find_record].totals.metal.IsPrimaryMetalPcs += b?.totals?.metal?.IsPrimaryMetalPcs;
          finalArr[find_record].totals.metal.IsPrimaryMetalSettingAmount += b?.totals?.metal?.IsPrimaryMetalSettingAmount;
          finalArr[find_record].totals.metal.IsPrimaryMetalWt += b?.totals?.metal?.IsPrimaryMetalWt;

        }
      }
      })
  
      datas_clone.resultArray = finalArr;


      datas_clone?.resultArray?.forEach((a) => {
        let dia = [];
        
        a?.diamonds?.forEach((el) => {
          let obj = cloneDeep(el);
          let findrec = dia?.findIndex((al) => al?.ShapeName === obj?.ShapeName)
          if(findrec === -1){
            dia.push(obj)
          }else{
            dia[findrec].Wt += obj?.Wt;
            dia[findrec].Pcs += obj?.Pcs;
            dia[findrec].Amount += obj?.Amount;
          }
        })
        a.diamonds = dia;

      })

      setdata2(datas_clone);

  }

  // console.log("data2", data2);
  // console.log("headerData", headerData);
  
  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <>
          {msg === "" ? (
            <> <div className={`container-fluid ${style?.jewelelryRetailInvoiceContainer} pad_60_allPrint position-relative`}>
              <div className={`btnpcl align-items-baseline position-absolute right-0 top-0 m-0 ${style?.right_jewelleryinvoicePrintc} d-flex`}>
                <div className="form-check pe-3">
                  <input className="form-check-input" type="checkbox" checked={image} onChange={handleChangeImage} />
                  <label className="form-check-label pt-1" htmlFor="flexCheckDefault">
                    With Image
                  </label>
                </div>
                <Button />
              </div>
              <div className="pt-2 d-flex flex-column">
                <div className="headlineJL w-100 p-2"> <b style={{ fontSize: "15px" }}> {headerData?.PrintHeadLabel} </b> </div>
                <div className="d-flex w-100">
                  <div className="col-10 p-2">
                    <div className="fslhJL">
                      <h5> <b style={{ fontSize: "13px", color: "black" }}> {headerData?.CompanyFullName} </b> </h5>
                    </div>
                    <div className="fslhJL">{headerData?.CompanyAddress}</div>
                    <div className="fslhJL">
                      {headerData?.CompanyAddress2}
                    </div>
                    <div className="fslhJL">
                      {headerData?.CompanyCity}-{headerData?.CompanyPinCode},
                      {headerData?.CompanyState}({headerData?.CompanyCountry})
                    </div>
                    <div className="fslhJL">
                      T {headerData?.CompanyTellNo} | TOLL FREE {headerData?.CompanyTollFreeNo}
                    </div>
                    <div className="fslhJL">
                      {headerData?.CompanyEmail} |
                      {headerData?.CompanyWebsite}
                    </div>
                    {/* <div className='fslhpcl3'>{headerData?.Company_VAT_GST_No} | {headerData?.Cust_CST_STATE}-{headerData?.Company_CST_STATE_No} | PAN-EDJHF236D</div> */}
                    <div className="fslhJL">
                      {headerData?.Company_VAT_GST_No} |
                      {headerData?.Cust_CST_STATE}-{headerData?.Company_CST_STATE_No} | PAN-{headerData?.Pannumber}
                    </div>
                  </div>
                  <div className="col-2 d-flex align-items-center justify-content-center">
                  {isImageWorking && (headerData?.PrintLogo !== "" && 
                      <img src={headerData?.PrintLogo} alt="" 
                      className='w-100 h-auto ms-auto d-block object-fit-contain'
                      onError={handleImageErrors}  style={{maxWidth: "150px", maxHeight: "115px"}} />)}
                    {/* <img
                      src={headerData?.PrintLogo}
                      alt="#"
                      className={`w-100 d-block ms-auto ${style?.imgJewelleryRetailinovicePrint3}`}
                    /> */}
                  </div>
                </div>
                {/* header data */}
                <div className="d-flex border w-100 no_break">
                  <div className="col-8 p-2 b border-end">
                    <div className="fslhJL">To,</div>
                    <div className="fslhJL">
                      <b className="JL13">{headerData?.CustName}</b>
                    </div>
                    {headerData?.customerAddress1?.length > 0 ? (
                      <div className="fslhJL">
                        {headerData?.customerAddress1}
                      </div>
                    ) : (
                      ""
                    )}
                    {headerData?.customerAddress2?.length > 0 ? (
                      <div className="fslhJL">
                        {headerData?.customerAddress2}
                      </div>
                    ) : (
                      ""
                    )}
                    {headerData?.customerAddress3?.length > 0 ? (
                      <div className="fslhJL">
                        {headerData?.customercity}-{headerData?.PinCode}
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="fslhJL">
                      {headerData?.CompanyCountry}
                    </div>
                    <div className="fslhJL">{headerData?.customeremail1}</div>
                    <div className="fslhJL">Phno: {headerData?.customermobileno}</div>
                    {headerData?.CustGstNo !== "" && <div className="fslhJL">{`GSTIN-${headerData?.CustGstNo}`}</div> }
                    {headerData?.CustPanno !== "" && <div className="fslhJL">{`PAN-${headerData?.CustPanno}`}</div> }
                    {headerData?.aadharno !== "" && <div className="fslhJL">{`AADHAR-${headerData?.aadharno}`}</div> }
                    <div className="fslhJL">{headerData?.Cust_CST_STATE}-{headerData?.Cust_CST_STATE_No}</div>
                  </div>
                  <div className="col-4 p-2 position-relative pb-1">
                    <div className="d-flex">
                      <div className="col-5">
                        <b className="JL13">INVOICE NO : </b>
                      </div>
                      <div className="col-7">
                        {headerData?.InvoiceNo}
                      </div>
                    </div>
                    <div className="d-flex">
                      <div className="col-5">
                        <b className="JL13">DATE : </b>
                      </div>
                      <div className="col-7">
                        {headerData?.EntryDate}
                      </div>
                    </div>
                    <div className="d-flex">
                      <div className="col-5">
                        <b className="JL13">HSN : </b>
                      </div>
                      <div className="col-7">
                        {headerData?.HSN_No}
                      </div>
                    </div>
                    {documents?.length > 0 && documents?.map((e, i) => {
                      return <div className="d-flex" key={i}>
                      <div className="col-5">
                        <b className="JL13">{e?.label} : </b>
                      </div>
                      <div className="col-7">
                        {e?.value}
                      </div>
                    </div>
                    })}
                    {/* <div className="d-flex  position-absolute w-100 pb-2 bottom-0"> */}
                    <div className="pb-2 mt-2">
                      {
                        metRate?.map((e, i) => {
                          return(
                            <>
                            { e?.Rate !== 0 && <div className="d-flex" key={i}>
                              <b className={`JL13  pe-2  JL13 w_20_jrtic`} style={{width:'40%'}}>{e?.QualityName}</b>
                              <b className={"  JL13 w_40_jrtic"} style={{width:'40%'}}>Rate: {NumberWithCommas(e?.Rate, 2)}</b>
                            </div>}
                            </>
                          )
                        })
                      }
                    </div>
                  </div>
                </div>
                {/* Table Heading */}
                <div className="pt-1 no_break">
                  <div className="border d-flex">
                    <div className={`${style?.srNoJewerryRetailInvoicePrint} border-end p-1 d-flex align-items-center justify-content-center`}><p className="fw-bold">Sr#</p></div>
                    <div className={`${style?.productJewerryRetailInvoicePrint} border-end p-1 fw-bold d-flex align-items-center justify-content-center`}><p className="fw-bold">Product Description</p></div>
                    <div className={`${style?.materialJewerryRetailInvoicePrint} border-end`}
                    >
                      <div className="border-bottom">
                        <p className="fw-bold p-1 text-center">Material Description</p>
                      </div>
                      <div className="d-flex">
                        <div className={`${style?.w_20JewerryRetailInvoicePrint} d-flex align-items-center justify-content-center border-end`}><p className="fw-bold p-1">Material</p></div>
                        <div className={`${style?.w_20JewerryRetailInvoicePrint} d-flex align-items-center justify-content-center border-end`}><p className="fw-bold p-1">Carat</p></div>
                        <div className={`${style?.w_20JewerryRetailInvoicePrint} d-flex align-items-center justify-content-center border-end`}><p className="fw-bold p-1">GWT</p></div>
                        <div className={`${style?.w_20JewerryRetailInvoicePrint} d-flex align-items-center justify-content-center border-end`}><p className="fw-bold p-1">NWT</p></div>
                        <div className={`${style?.w_20JewerryRetailInvoicePrint} d-flex align-items-center justify-content-center border-end p-1 flex-column`}><p className="fw-bold">STONE/</p><p className="fw-bold">DIA Wt.</p></div>
                        <div className={`${style?.w_20JewerryRetailInvoicePrint} d-flex align-items-center justify-content-center`}><p className="fw-bold p-1">Amount</p></div>
                      </div>
                    </div>
                    <div className={`${style?.metalMakingJewerryRetailInvoicePrint} border-end d-flex align-items-center justify-content-center flex-column`}>
                      <p className="fw-bold"> Making</p>
                    </div>
                    <div className={`${style?.othersJewerryRetailInvoicePrint} border-end d-flex align-items-center justify-content-center`}><p className="fw-bold">Others</p></div>
                    <div className={`${style?.totalJewerryRetailInvoicePrint} d-flex align-items-center justify-content-center`}><p className="fw-bold">Total</p></div>
                  </div>
                </div>
                {/* data */}
                {/* {data?.resultArray?.length > 0 && data?.resultArray?.map((e, i) => { */}
                {data2?.resultArray?.length > 0 && data2?.resultArray?.map((e, i) => {
                  return <div className="border-start border-end border-bottom d-flex no_break" key={i}>
                    <div className={`${style?.srNoJewerryRetailInvoicePrint} border-end p-1 d-flex align-items-center justify-content-center`}><p className="">{i + 1}</p></div>
                    <div className={`${style?.productJewerryRetailInvoicePrint} border-end p-1 `}>
                      <p className="">{e?.SubCategoryname} {e?.Categoryname}</p>
                      <p className="">{e?.designno} | {e?.SrJobno}</p>
                      {image && <img src={e?.DesignImage} alt="" onError={handleImageError} lazy='eagar' className={`w-75 p-1 ${style?.imageJewelleryC}`} />}
                      {e?.HUID !== "" && <p className={`text-center ${!image && 'pt-3'}`}>HUID-{e?.HUID}</p>}
                      { e?.CertificateNo !== '' && <p className="">Certificate : {e?.CertificateNo}</p>}
                    </div>
                      {/* <p className="">Certificate : {e?.CertificateNo}</p> */}
                    <div className={`${style?.materialJewerryRetailInvoicePrint} border-end`}>
                      <div className="d-grid h-100">
                        {
                          e?.metal?.length > 0 && e?.metal?.map((ele, ind) => {
                            return(
                              <div className={`d-flex ${ind === 0 && 'border-bottom'}`} key={ind}>
                                <div className={`${style?.w_20JewerryRetailInvoicePrint} border-end d-flex align-items-center`}>
                                  <p className="p-1 lh-1 text-break">{ele?.MasterManagement_DiamondStoneTypeid === 4 ? ele?.ShapeName : ele?.MasterManagement_DiamondStoneTypeName}</p>
                                </div>
                                <div className={`${style?.w_20JewerryRetailInvoicePrint} border-end d-flex align-items-center`}>
                                    <p className=" p-1 lh-1 text-break">
                                      {ele?.MasterManagement_DiamondStoneTypeid === 4 ? ele?.QualityName : (ele?.MasterManagement_DiamondStoneTypeid === 1 ? ele?.ShapeName : '')}
                                    </p>
                                </div>
                                <div className={`${style?.w_20JewerryRetailInvoicePrint} border-end d-flex align-items-center justify-content-end`}>
                                  <p className=" p-1 text-end lh-1">{ele?.MasterManagement_DiamondStoneTypeid === 4 && fixedValues(e?.grosswt, 3)}</p>
                                </div>
                                <div className={`${style?.w_20JewerryRetailInvoicePrint} border-end d-flex align-items-center justify-content-end`}>
                                  <p className=" p-1 text-end lh-1">{ele?.MasterManagement_DiamondStoneTypeid === 4 && fixedValues(e?.MetalDiaWt, 3)}</p>
                                </div>
                                <div className={`${style?.w_20JewerryRetailInvoicePrint} border-end p-1 d-flex align-items-center justify-content-end text-break`}>
                                    <p className=" text-end lh-1">{ele?.MasterManagement_DiamondStoneTypeid !== 4 && fixedValues(ele?.Wt, 3)}</p></div>
                                <div className={`${style?.w_20JewerryRetailInvoicePrint} d-flex align-items-center justify-content-end`}>
                                  <p className=" p-1 text-end lh-1">{formatAmount(ele?.Amount)}</p>
                                </div>
                              </div>
                            )
                          })
                        }
                        {
                          e?.diamonds?.length > 0 && e?.diamonds?.map((ele, ind) => {
                            return(
                              <div className={`d-flex ${ind !== e?.materials?.length - 1 && 'border-bottom'}`} key={ind}>
                                <div className={`${style?.w_20JewerryRetailInvoicePrint} border-end d-flex align-items-center`}>
                                  <p className="p-1 lh-1 text-break">DIAMOND</p>
                                </div>
                                <div className={`${style?.w_20JewerryRetailInvoicePrint} border-end d-flex align-items-center`}>
                                  <p className=" p-1 lh-1 text-break">{ele?.ShapeName}</p>
                                </div>
                                <div className={`${style?.w_20JewerryRetailInvoicePrint} border-end d-flex align-items-center justify-content-end`}>
                                  <p className=" p-1 text-end lh-1"></p>
                                </div>
                                <div className={`${style?.w_20JewerryRetailInvoicePrint} border-end d-flex align-items-center justify-content-end`}><p className=" p-1 text-end lh-1"></p></div>
                                <div className={`${style?.w_20JewerryRetailInvoicePrint} border-end p-1 d-flex align-items-center justify-content-end text-break`}>
                                  <p className=" text-end lh-1">{fixedValues(ele?.Wt, 3)}</p>
                                </div>
                                <div className={`${style?.w_20JewerryRetailInvoicePrint} d-flex align-items-center justify-content-end`}>
                                  <p className=" p-1 text-end lh-1">{formatAmount(ele?.Amount)}</p>
                                </div>
                              </div>
                            )
                          })
                        }
                        {
                          (e?.totals?.colorstone?.Wt !== 0 && e?.totals?.colorstone?.Amount !== 0) &&  
                            <div className={`d-flex `}>
                              <div className={`${style?.w_20JewerryRetailInvoicePrint} border-end d-flex align-items-center`}>
                                <p className="p-1 lh-1 text-break">COLORSTONE</p>
                              </div>
                              <div className={`${style?.w_20JewerryRetailInvoicePrint} border-end d-flex align-items-center`}>
                                <p className=" p-1 lh-1 text-break"></p>
                              </div>
                              <div className={`${style?.w_20JewerryRetailInvoicePrint} border-end d-flex align-items-center justify-content-end`}>
                                <p className=" p-1 text-end lh-1"></p>
                              </div>
                              <div className={`${style?.w_20JewerryRetailInvoicePrint} border-end d-flex align-items-center justify-content-end`}><p className=" p-1 text-end lh-1"></p></div>
                              <div className={`${style?.w_20JewerryRetailInvoicePrint} border-end p-1 d-flex align-items-center justify-content-end text-break`}>
                                  <p className=" text-end lh-1">{fixedValues(e?.totals?.colorstone?.Wt, 3)}</p>
                              </div>
                              <div className={`${style?.w_20JewerryRetailInvoicePrint} d-flex align-items-center justify-content-end`}>
                                <p className=" p-1 text-end lh-1">{formatAmount(e?.totals?.colorstone?.Amount)}</p>
                              </div>
                            </div>
                        }
                        {
                          (e?.totals?.misc?.IsHSCODE_0_wt !== 0 && e?.totals?.misc?.IsHSCODE_0_amount !== 0) &&  
                            <div className={`d-flex border-top`}>
                              <div className={`${style?.w_20JewerryRetailInvoicePrint} border-end d-flex align-items-center`}>
                                <p className="p-1 lh-1 text-break">MISC</p>
                              </div>
                              <div className={`${style?.w_20JewerryRetailInvoicePrint} border-end d-flex align-items-center`}>
                                <p className=" p-1 lh-1 text-break"></p>
                              </div>
                              <div className={`${style?.w_20JewerryRetailInvoicePrint} border-end d-flex align-items-center justify-content-end`}>
                                <p className=" p-1 text-end lh-1"></p>
                              </div>
                              <div className={`${style?.w_20JewerryRetailInvoicePrint} border-end d-flex align-items-center justify-content-end`}>
                                <p className=" p-1 text-end lh-1"></p>
                              </div>
                              <div className={`${style?.w_20JewerryRetailInvoicePrint} border-end p-1 d-flex align-items-center justify-content-end text-break`}>
                                  <p className=" text-end lh-1">{fixedValues(e?.totals?.misc?.IsHSCODE_0_wt, 3)}</p>
                              </div>
                              <div className={`${style?.w_20JewerryRetailInvoicePrint} d-flex align-items-center justify-content-end`}>
                                <p className=" p-1 text-end lh-1">{formatAmount(e?.totals?.misc?.IsHSCODE_0_amount)}</p>
                              </div>
                            </div>
                        }
                        {(e?.metal?.length + e?.diamonds?.length + e?.colorstone?.length + e?.misc?.length ) === 0 && 
                          <div className="d-flex">
                            <div className={`${style?.w_20JewerryRetailInvoicePrint} border-end`}><p className=" p-1 lh-1"></p></div>
                            <div className={`${style?.w_20JewerryRetailInvoicePrint} border-end`}><p className=" p-1 lh-1"></p></div>
                            <div className={`${style?.w_20JewerryRetailInvoicePrint} border-end`}><p className=" p-1 text-end lh-1"></p></div>
                            <div className={`${style?.w_20JewerryRetailInvoicePrint} border-end`}><p className=" p-1 text-end lh-1"></p></div>
                            <div className={`${style?.w_20JewerryRetailInvoicePrint} border-end p-1 `}><p className=" text-end lh-1"></p></div>
                            <div className={`${style?.w_20JewerryRetailInvoicePrint} `}><p className=" p-1 text-end lh-1"></p></div>
                          </div>
                        }
                      </div>
                    </div>
                    <div className={`${style?.metalMakingJewerryRetailInvoicePrint} border-end align-items-center d-flex justify-content-end`}>
                      <p className="text-end p-1">{NumberWithCommas((e?.MakingAmount), 2)}</p>
                    </div>
                    <div className={`${style?.othersJewerryRetailInvoicePrint} border-end align-items-center d-flex justify-content-end`}><p className=" text-end p-1">{NumberWithCommas(e?.OtherCharges, 2)}</p></div>
                    <div className={`${style?.totalJewerryRetailInvoicePrint} align-items-center d-flex justify-content-end`}><p className=" text-end p-1">{NumberWithCommas(e?.TotalAmount, 2)}</p></div>
                    </div>
                })}

                {/* total */}
                <div className={`${style?.minHeight20RetailinvoicePrint3} border-start border-end border-bottom d-flex no_break`}>
                  <div className={`${style?.srNoJewerryRetailInvoicePrint} border-end p-1`}>
                    <p className="fw-bold"></p>
                  </div>
                  <div className={`${style?.productJewerryRetailInvoicePrint} border-end p-1 fw-bold d-flex align-items-center`}>
                    <p className="fw-bold fs-6">TOTAL</p>
                  </div>
                  <div className={`${style?.materialJewerryRetailInvoicePrint} border-end d-flex`}>
                    <div className={`${style?.w_20JewerryRetailInvoicePrint} border-end d-flex align-items-center justify-content-end`}>
                      <p className="fw-bold p-1 lh-1"></p>
                    </div>
                    <div className={`${style?.w_20JewerryRetailInvoicePrint} border-end d-flex align-items-center justify-content-end`}></div>
                    <div className={`${style?.w_20JewerryRetailInvoicePrint} border-end d-flex align-items-center justify-content-end`}> 
                      <p className="fw-bold p-1 lh-1 text-end">{fixedValues(data2?.mainTotal?.grosswt, 3)} gm</p>
                    </div>
                    <div className={`${style?.w_20JewerryRetailInvoicePrint} border-end d-flex align-items-center justify-content-end`}>
                      <p className="fw-bold p-1 text-end lh-1">{fixedValues((data2?.mainTotal?.NetWt + data2?.mainTotal?.LossWt), 3)} gm</p>
                    </div>
                    <div className={`${style?.w_20JewerryRetailInvoicePrint} border-end p-1 flex-column d-flex align-items-end justify-content-center`}>
                      <p className="fw-bold pb-1 text-end lh-1">{fixedValues((data2?.mainTotal?.diamonds?.Wt + data2?.mainTotal?.colorstone?.Wt), 3)} Ctw</p>
                      <p className="fw-bold text-end lh-1">{fixedValues(data2?.mainTotal?.misc?.IsHSCODE_0_wt, 3)} gm</p>
                    </div>
                    <div className={`${style?.w_20JewerryRetailInvoicePrint} d-flex align-items-center justify-content-end`}> 
                      <p className="fw-bold p-1 lh-1 text-end">
                        {formatAmount((data2?.mainTotal?.diamonds?.Amount + data2?.mainTotal?.colorstone?.Amount + data2?.mainTotal?.metal?.Amount))}
                      </p> 
                    </div>
                  </div>
                  <div className={`${style?.metalMakingJewerryRetailInvoicePrint} border-end flex-column d-flex align-items-end justify-content-center`}>
                    <p className="fw-bold text-end d-flex align-items-center justify-content-center pe-1">{formatAmount((data2?.mainTotal?.MakingAmount))}</p>
                  </div>
                  <div className={`${style?.othersJewerryRetailInvoicePrint} border-end d-flex align-items-center justify-content-end`}>
                    <p className="fw-bold text-end p-1">{formatAmount((data2?.mainTotal?.OtherCharges))}</p>
                  </div>
                  <div className={`${style?.totalJewerryRetailInvoicePrint} d-flex align-items-center justify-content-end`}>
                    <p className="fw-bold text-end pe-1">{NumberWithCommas(data2?.mainTotal?.TotalAmount, 2)}</p>
                  </div>
                </div>
                {/* tax */}
                <div className="d-flex border-start border-end border-bottom w-100 no_break">
                  <div className={`d-flex justify-content-between flex-column border-end ${style?.wordsJewellry}`}>
                    <div className={`${style?.wordsJewerryRetailInvoicePrint}p-2 d-flex align-items-center pt-5`}>
                      <div className="p-2 pt-4">
                        <p>In Words Indian Rupees</p>
                        <p className="fw-bold">{toWords.convert(+fixedValues(total?.afterTax, 2))} Only</p>
                      </div>
                    </div>
                    <div className={`${style?.RemarkJewelleryInvoicePrintC} p-2`}>
                      <div>Description: <div dangerouslySetInnerHTML={{ __html: headerData?.Remark }} className="fw-bold"></div></div>
                    </div>
                  </div>
                  <div className={`${style?.discountJewerryRetailInvoicePrint} d-flex`}>
                    <div className="col-7 border-end">
                      <p className="p-1 text-end">Discount</p>
                      <p className="p-1 text-end">Total Amt before Tax</p>
                      {taxes.length > 0 && taxes.map((e, i) => {
                        return <p className="p-1 text-end" key={i}>{e?.name} @ {e?.per}</p>
                      })}
                      <p className="p-1 text-end">{headerData?.AddLess >= 0 ? "Add" : "Less"}</p>
                      <p className="p-1 text-end">Total Amt after Tax</p>
                      <p className="p-1 text-end">Old Gold</p>
                      <p className="p-1 text-end">Advance</p>
                      <p className="p-1 text-end">Recv. in Cash</p>
                      {bank.length > 0 && bank.map((e, i) => {
                        return <p className="p-1 text-end" key={i}>Recv. in Bank ({e?.label})</p>
                      })}
                      {/* <p className="p-1">Recv. in Bank</p> */}
                      <p className="p-1 text-end">Net Bal. Amount</p>
                      <p className="fw-bold p-1 border-top text-end">GRAND TOTAL</p>
                    </div>
                    <div className="col-5">
                      <p className="text-end p-1">{NumberWithCommas(total?.discount, 2)}</p>
                      <p className="text-end p-1">{NumberWithCommas(total?.total, 2)}</p>
                      {taxes.length > 0 && taxes.map((e, i) => {
                        return <p className="p-1 text-end" key={i}>{NumberWithCommas(+e?.amount, 2)}</p>
                      })}
                      <p className="p-1 text-end">{NumberWithCommas(headerData?.AddLess, 2)}</p>
                      <p className="p-1 text-end">{NumberWithCommas(total?.afterTax, 2)}</p>
                      <p className="p-1 text-end">{NumberWithCommas(headerData?.OldGoldAmount, 2)}</p>
                      <p className="p-1 text-end">{NumberWithCommas(headerData?.AdvanceAmount, 2)}</p>
                      <p className="p-1 text-end">{NumberWithCommas(headerData?.CashReceived, 2)}</p>
                      {bank.length > 0 && bank.map((e, i) => {
                        return <p className="p-1 text-end" key={i}>{NumberWithCommas(e?.amount, 2)}</p>
                      })}
                      <p className="p-1 text-end">{NumberWithCommas(+fixedValues(total?.netBalAmount, 2), 2)}</p>
                      <p className="fw-bold text-end p-1 border-top"><span dangerouslySetInnerHTML={{ __html: headerData?.Currencysymbol }}></span>{NumberWithCommas(total?.afterTax, 2)}</p>
                    </div>
                  </div>
                </div>
                {/* remark */}
                <div className="border-start border-end border-bottom p-2 no_break pb-3">
                  <div dangerouslySetInnerHTML={{ __html: headerData?.Declaration }} className={`${style?.declarationUlJewelleryRetailInvoicePrntc}`}></div>
                </div>
                {/* bank detail */}
                <div className="border-start border-end border-bottom d-flex no_break">
                  <div className="col-4 p-2 border-end">
                    <p className="fw-bold">Bank Detail</p>
                    <p>Bank name: {headerData?.bankname}</p>
                    <p>Branch: {headerData?.bankaddress}</p>
                    <p>{headerData?.PinCode}</p>
                    <p>Account Name: {headerData?.accountname}</p>
                    <p>Account No: {headerData?.accountnumber}</p>
                    <p>RTGS NEFT IFSC: {headerData?.rtgs_neft_ifsc}</p>
                  </div>
                  <div className="col-4 p-2 border-end d-flex justify-content-between flex-column">
                    <p>Signature</p>
                    <p className="fw-bold">{headerData?.CustName}</p>
                  </div>
                  <div className="col-4 p-2 d-flex justify-content-between flex-column">
                    <p>Signature</p>
                    <p className="fw-bold">{headerData?.accountname}</p>
                  </div>
                </div>
              </div>
            </div>
            </>
          ) : (
            <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
              {msg}
            </p>
          )}
        </>
      )}
    </>
  );
};

export default JewelleryRetailInvoicePrintc;
