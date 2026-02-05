import React, { useEffect, useState } from "react";
import "../../assets/css/prints/invoiceprint3.css";
import { apiCall, checkMsg, formatAmount, isObjectEmpty, numberToWord, NumberWithCommas } from "../../GlobalFunctions";
import { taxGenrator } from "./../../GlobalFunctions";
import Loader from "../../components/Loader";
import Button from "../../GlobalFunctions/Button";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";
import { NumToWord } from './../../GlobalFunctions/NumToWord';
import { cloneDeep } from "lodash";

const InvoicePrint3 = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
  const [headerData, setHeaderData] = useState();
  // eslint-disable-next-line no-unused-vars
  const [json1, setJson1] = useState();
  // eslint-disable-next-line no-unused-vars
  const [json2, setJson2] = useState();
  // eslint-disable-next-line no-unused-vars
  const [resultArray, setResultArray] = useState();
  const [result, setResult] = useState();
  const [grandTotal, setGrandTotal] = useState(0);
  const [totDiscount, setTotDiscount] = useState(0);
  const [inWords, setInWords] = useState("");
  const [mainTotal, setMainTotal] = useState({});
  const [groupedArr, setGroupedArr] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [groupedArrAmountTotal, setGroupedArrAmountTotal] = useState(0);
  const [LOM, setLOM] = useState([]);
  const [descArr, setDescArr] = useState("");
  const [taxTotal, setTaxTotal] = useState([]);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const [isImageWorking, setIsImageWorking] = useState(true);
  const [total_makingcharge_unit, setTotalMakingChargeUnit] = useState(0);
  const [diamond_s, setDiamond_s] = useState([]);
  const [colorstone_s, setColorStone_s] = useState([]);
  const [metal_s, setMetal_s] = useState([]);

  const handleImageErrors = () => {
    setIsImageWorking(false);
  };
  const organizeData = (json, json1, json2) => {
    let resultArr = [];
    // eslint-disable-next-line no-unused-vars
    let totAmt = 0;
    let totdis = 0;
    let groupedAmtTotal = 0;
    let totOthAmt = 0;
    let totLbrAmt = 0;
    let totmiscAmt = 0;
    let mainTotal = {
      diamonds: {
        Wt: 0,
        Pcs: 0,
        Rate: 0,
        Amount: 0,
      },
      colorstone: {
        Wt: 0,
        Pcs: 0,
        Rate: 0,
        Amount: 0,
      },
      metal: {
        Wt: 0,
        Pcs: 0,
        Rate: 0,
        Amount: 0,
      },
      misc: {
        Wt: 0,
        Pcs: 0,
        Rate: 0,
        Amount: 0,
      },
      finding: {
        Wt: 0,
        Pcs: 0,
        Rate: 0,
        Amount: 0,
      },
      totalnetwt: {
        netwt: 0,
      },
      totalgrosswt: {
        grosswt: 0,
      },
      totAmount: {
        TotalAmount: 0,
      },
      totlbrAmt: {
        Amount: 0,
      },
      totOthAmt: {
        Amount: 0,
      },
    };
    
    let aa = 0;

    groupedAmtTotal = groupedAmtTotal + totLbrAmt + totOthAmt;
    let obj1 = {
      ShapeName: "OTHER",
      QualityName: "",
      Amount: totOthAmt,
    };
    let obj2 = {
      ShapeName: "LABOUR",
      QualityName: "",
      Amount: totLbrAmt,
    };
    // eslint-disable-next-line no-unused-vars
    let obj3 = {
      ShapeName: "MISC",
      QualityName: "",
      Amount: totmiscAmt,
    };
    let LOM = [];
    // LOM.push(obj3, obj2, obj1);
    LOM.push(obj2, obj1);
    setLOM(LOM);
    setGroupedArrAmountTotal(groupedAmtTotal);

    // setGroupedArr(arr);

    setMainTotal(mainTotal);

    let ab = (+aa?.toFixed(2));
    let words = numberToWord(ab) + " Only";
    setTotDiscount(totdis);

  };
  async function loadData(data) {
    try {
      setHeaderData(data?.BillPrint_Json[0]);
      setJson1(data?.BillPrint_Json1);
      setJson2(data?.BillPrint_Json2);
      organizeData(
        data?.BillPrint_Json[0],
        data?.BillPrint_Json1,
        data?.BillPrint_Json2
      );
      let address = data?.BillPrint_Json[0]?.Printlable?.split("\r\n");
      data.BillPrint_Json[0].address = address;
 
      const datas = OrganizeDataPrint(
        data?.BillPrint_Json[0],
        data?.BillPrint_Json1,
        data?.BillPrint_Json2
      );
      const datas2 = OrganizeDataPrint(
        data?.BillPrint_Json[0],
        data?.BillPrint_Json1,
        data?.BillPrint_Json2
      );

      const datas_clone = cloneDeep(datas2);
      

      loadData2( datas_clone)

      let sen = '';
      let metal = datas?.json2?.filter((e) => e?.MasterManagement_DiamondStoneTypeid === 4)
      if(metal.length > 0){
        sen = 'GOLD';
      }
      let sen2 = '';
      let diamond = datas?.json2?.filter((e) => e?.MasterManagement_DiamondStoneTypeid === 1)
      if(diamond.length > 0){
        sen2 = 'DIAMOND'
      }
      let sen3 = '';
      let colorstone = datas?.json2?.filter((e) => e?.MasterManagement_DiamondStoneTypeid === 2)
      if(colorstone.length > 0){
        sen3 = 'COLORSTONE'
      }
      let sen4 = '';
      let misc = datas?.json2?.filter((e) => e?.MasterManagement_DiamondStoneTypeid === 3)
      if(misc.length > 0){
        sen4 = 'CZ STUDDED'
      }
      let result1 = [(sen === '' ? 'GOLD' : 'GOLD'), sen2, sen3, sen4]?.join(", ");
      setDescArr(result1);

      
      
      let diamonds = [];
      let colorstones = [];
      let metals = [];
      datas?.resultArray?.forEach((e) => {
        // let dia = [];
        e?.diamonds?.forEach((el) => {
          let findRecord = diamonds?.findIndex((a) => a?.QualityName === el?.QualityName && a?.Colorname === el?.Colorname  && a?.ShapeName === el?.ShapeName && a?.Rate === el?.Rate)
          if(findRecord === -1){
            let obj = {...el};
            obj.wt = obj?.Wt;
            obj.rate = obj?.Rate;
            obj.amount = obj?.Amount;
            diamonds.push(obj);
          }else{
            diamonds[findRecord].wt += el?.Wt;
            diamonds[findRecord].rate += el?.Rate;
            diamonds[findRecord].amount += el?.Amount;
          }
        })


        
        // e.diamonds = dia;
        // diamonds = dia;

        // let cls = [];
        e?.colorstone?.forEach((el) => {
          // let findRecord = colorstones?.findIndex((a) => a?.ShapeName === el?.ShapeName && a?.Colorname === el?.Colorname && a?.QualityName === el?.QualityName && a?.isRateOnPcs === el?.isRateOnPcs && a?.Rate === el?.Rate)
          // let findRecord = colorstones?.findIndex((a) => a?.ShapeName === el?.ShapeName && a?.Colorname === el?.Colorname && a?.QualityName === el?.QualityName && a?.SizeName === el?.SizeName && a?.isRateOnPcs === el?.isRateOnPcs)
          let findRecord = colorstones?.findIndex((a) => a?.Rate === el?.Rate)
          if(findRecord === -1){
            let obj = {...el};
            obj.wt = obj?.Wt;
            obj.pcs = obj?.Pcs;
            obj.rate = obj?.Rate;
            obj.amount = obj?.Amount;
            colorstones.push(obj);
          }else{
            colorstones[findRecord].wt += el?.Wt;
            colorstones[findRecord].rate = el?.Rate;
            colorstones[findRecord].amount += el?.Amount;
            colorstones[findRecord].pcs += el?.Pcs;
          }
        })
        
        // e.colorstone = cls;

        // let miscs = [];
        // e?.misc?.forEach((el) => {
        //   let findRecord = cls?.findIndex((a) => a?.ShapeName === el?.ShapeName && a?.QualityName === el?.QualityName)
        //   if(findRecord === -1){
        //     let obj = {...el};
        //     obj.wt = obj?.Wt;
        //     obj.rate = obj?.Rate;
        //     obj.amount = obj?.Amount;
        //     miscs.push(obj);
        //   }else{
        //     miscs[findRecord].wt += el?.Wt;
        //     miscs[findRecord].rate += el?.Rate;
        //     miscs[findRecord].amount += el?.Amount;
        //   }
        // })

        // e.misc = miscs;

        // let met = [];
        // e?.metal?.forEach((el) => {
        //   if(el?.IsPrimaryMetal === 1){

        //     // let findRecord = metals?.findIndex((a) => a?.QualityName === el?.QualityName && a?.ShapeName === el?.ShapeName  && a?.Rate === el?.Rate)

        //     let findRecord = metals?.findIndex((a) => a?.QualityName === el?.QualityName && a?.ShapeName === el?.ShapeName && a?.Rate === el?.Rate)
            
        //     let obj = {...el};
        //     if(findRecord === -1){
        //       obj.wt = obj?.Wt;
        //       obj.rate = obj?.Rate;
        //       obj.amt = obj?.Amount;
        //       metals.push(obj);
        //     }else{
        //       metals[findRecord].wt += obj?.Wt;
        //       metals[findRecord].rate += obj?.Rate;
        //       metals[findRecord].amt += obj?.Amount;
        //     }
        //   }

        // })
        
        // e.metal = met;

      })
      

      // setMetal_s(met3);

      // diamonds?.sort((a, b) => 
      //     ( 
      //       (
      //         (a?.amount / a?.wt) / result?.header?.CurrencyExchRate
      //       )
      //     ) 
      //     - 
      //     (
      //       (
      //         (b?.amount / b?.wt) / result?.header?.CurrencyExchRate
      //       )
      //     )
      //   )

        let dList = [];
        diamonds?.forEach((a) => {
          let obj = {...a};

          obj._rate_ = ((a?.amount / a?.wt) / (result?.header?.CurrencyExchRate))

          dList.push(obj);

        })
        diamonds = dList;
      // colorstones?.sort((a, b) => (((a?.amount / a?.wt) / result?.header?.CurrencyExchRate)) - ((b?.amount / b?.wt) / result?.header?.CurrencyExchRate))
      colorstones?.sort((a, b) => a?.Rate - b?.Rate)
      // diamonds?.sort((a, b) => a?.rate - b?.rate)
      diamonds?.sort((a, b) => 
          ( 
            (
              (a?.amount / a?.wt) / result?.header?.CurrencyExchRate
            )
          ) 
          - 
          (
            (
              (b?.amount / b?.wt) / result?.header?.CurrencyExchRate
            )
          )
        )
      // metals?.sort((a, b) => {
      //   const qualityA = a?.QualityName?.toUpperCase();
      //   const qualityB = b?.QualityName?.toUpperCase();
    
      //   // Extract the karat value from the QualityName
      //   const karatA = parseInt(qualityA?.split(' ')[1]); // Extracts the numeric part from "GOLD 10K"
      //   const karatB = parseInt(qualityB?.split(' ')[1]); // Extracts the numeric part from "GOLD 18K"
      //   // If both are numbers (i.e., metal types), compare them numerically
      //   if (!isNaN(karatA) && !isNaN(karatB)) {
      //       return karatA - karatB;
      //   }
    
      //   // If one of them is not a number (i.e., metal type and "TITANIUM High"), sort the metal type first
      //   if (!isNaN(karatA)) {
      //       return -1; // Place metal type before "TITANIUM High"
      //   } else if (!isNaN(karatB)) {
      //       return 1; // Place "TITANIUM High" after metal types
      //   }
    
      //   // If both are not numbers, sort them alphabetically
      //   if (qualityA < qualityB) return -1;
      //   if (qualityA > qualityB) return 1;
      //   return 0;
      // });

      let dia1 =[];
      let dia2 = [];

        dia1 = diamonds?.filter((e) => e?.Amount === 0 && e?.Rate === 0)
        dia2 = diamonds?.filter((e) => e?.Amount !== 0 && e?.Rate !== 0)

        let totwtdia = 0;
        dia1?.forEach((a) => totwtdia += a?.wt)

        let obj_dia = {
          MasterManagement_DiamondStoneTypeName : 'DIAMOND',
          MaterialTypeName:'',
          Wt : totwtdia,
          wt: totwtdia,
          Rate : 0,
          Amount : 0,
          amount : 0
        }

        dia2?.splice(0, 0, obj_dia);

        diamonds = dia2;
    
      setDiamond_s(diamonds);
      setColorStone_s(colorstones);      
      setResult(datas);
      setLoader(false);
      let resultArr = [];
      datas?.resultArray?.forEach((e) => {
        let obj = cloneDeep(e);
        obj.primaryMetal = e?.metal?.find((ele, ind) => ele?.IsPrimaryMetal === 1);
        
        let primaryWt = 0;
        let count = 0;
        let secondaryMetalAmount = 0;
        let secondaryWt = 0;
        e?.metal?.forEach((ele, ind) => {
          count += 1;
          if (ele?.IsPrimaryMetal === 1) {
            primaryWt += ele?.Wt;
          } else {
            secondaryMetalAmount += ele?.Amount;
            secondaryWt += ele?.Wt;
          }
        });
        let netWtFinal = e?.NetWt + e?.LossWt - secondaryWt
        obj.primaryWt = primaryWt;
        obj.netWtFinal = netWtFinal;
        obj.metalAmountFinal = e?.MetalAmount;
        if (count <= 1) {
          primaryWt = e?.NetWt + e?.LossWt;
      }
        if (obj?.primaryMetal) {
          // total2.total += (obj?.metalAmountFinal / data?.BillPrint_Json[0]?.CurrencyExchRate);
          let findRecord = resultArr?.findIndex((ele, ind) => ele?.primaryMetal?.ShapeName === obj?.primaryMetal?.ShapeName && ele?.primaryMetal?.QualityName === obj?.primaryMetal?.QualityName && ele?.primaryMetal?.Rate === obj?.primaryMetal?.Rate);
          if (findRecord === -1) {
              resultArr?.push(obj);
          } else {
              resultArr[findRecord].primaryWt += obj?.primaryWt;
              resultArr[findRecord].primaryMetal.Pcs += obj?.primaryMetal.Pcs;
              resultArr[findRecord].primaryMetal.Wt += obj?.primaryMetal.Wt;
              resultArr[findRecord].primaryMetal.Amount += obj?.primaryMetal.Amount;
              resultArr[findRecord].netWtFinal += obj?.netWtFinal;
              resultArr[findRecord].metalAmountFinal += obj?.metalAmountFinal;
          }
      }
      })

      resultArr?.sort((a, b) => {
        const qualityA = a?.MetalTypePurity?.toUpperCase();
        const qualityB = b?.MetalTypePurity?.toUpperCase();
    
        // Extract the karat value from the QualityName
        const karatA = parseInt(qualityA?.split(' ')[1]); // Extracts the numeric part from "GOLD 10K"
        const karatB = parseInt(qualityB?.split(' ')[1]); // Extracts the numeric part from "GOLD 18K"
        // If both are numbers (i.e., metal types), compare them numerically
        if (!isNaN(karatA) && !isNaN(karatB)) {
            return karatA - karatB;
        }
    
        // If one of them is not a number (i.e., metal type and "TITANIUM High"), sort the metal type first
        if (!isNaN(karatA)) {
            return -1; // Place metal type before "TITANIUM High"
        } else if (!isNaN(karatB)) {
            return 1; // Place "TITANIUM High" after metal types
        }
    
        // If both are not numbers, sort them alphabetically
        if (qualityA < qualityB) return -1;
        if (qualityA > qualityB) return 1;
        return 0;
      });

      setMetal_s(resultArr)


    } catch (error) {
      console.log(error);
    }
  }

  async function loadData2(data){
    let datas = data;

    let finalArr = [];

    datas?.resultArray?.forEach((a) => {
      let findingwt = 0;
      datas?.json2?.forEach((el) => {
        if(a?.SrJobno === el?.StockBarcode){
          if(el?.MasterManagement_DiamondStoneTypeid === 5){
            if(el?.Supplier === 'customer' || el?.supplier === 'Customer'){
              findingwt += el?.Wt;
            }
          }
        }
      })
      let obj = {...a};
      obj.findingwt = findingwt;
      finalArr.push(obj);
    })

    let finalArr2 = [];
    finalArr?.forEach((e) => {
      let obj = {...e};
      let lbr_wt = 0;
      // let lbr_wt = ((obj?.MetalDiaWt - obj?.findingwt) * obj?.MaKingCharge_Unit);
       lbr_wt = ((obj?.MetalDiaWt - obj?.findingwt));
      
      obj.lbr_wt = lbr_wt;
      finalArr2.push(obj);
    })
    let finalArr3 = [];
    finalArr2?.forEach((a) => {
      let obj = {...a};
      let lbr_amt = 0;
        lbr_amt = ((obj?.MetalDiaWt - obj?.findingwt) * obj?.MaKingCharge_Unit);
        obj.lbr_amt = lbr_amt;
        finalArr3.push(obj);
    })

    let tot_lbr_wt =0;
    let tot_lbr_amt =0;

    finalArr3.forEach((a) => {
      tot_lbr_wt += a?.lbr_wt;
      tot_lbr_amt += a?.lbr_amt;
    })


    let finalArr4 = [];
    finalArr4?.forEach((a) => {
      let obj = {...a};
      let lbr_rate = 0;
      lbr_rate = ((obj?.lbr_amt) / (obj?.lbr_wt));
      obj.lbr_rate = lbr_rate;
      finalArr4.push(obj);
    })
    datas.resultArray = finalArr4;
    // let totlbrrate = 0;
    // datas?.resultArray?.forEach((a) => {
    //     totlbrrate += a?.lbr_rate;
    // })
    let lbr_rate_total = 0;

    lbr_rate_total = (tot_lbr_amt / (tot_lbr_wt === 0 ? 1 : tot_lbr_wt))
    let rounduplabour =  Math.round(lbr_rate_total)
    setTotalMakingChargeUnit(rounduplabour);

  }

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


  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <>
          {msg === "" ? (
            <>
              <div className="container max_width_container px-2 print_sec_sum4">
                <Button />
              </div>
              <div className="containerinvp3 pad_60_allPrint" id="divToPrint">
                <div className="headinvp3">
                  <div className="headerinvp3">
                    <div className="head1invp3"> <p className="fw-bold fsinvp3 w-50">BILL NO</p> <p className="fsinvp3 w-50 text-end">{headerData?.InvoiceNo}</p> </div>
                    <div className="head1invp3"> <p className="fw-bold fsinvp3">DATE</p> <p className="fsinvp3">{headerData?.EntryDate}</p> </div>
                    <div className="head1invp3"> <p className="fw-bold fsinvp3">HSN</p> <p className="fsinvp3">{headerData?.HSN_No}</p> </div>
                  </div>
                </div>
                <div className="header2invp3">
                  <div>
                    <p className="fw-bold fs-6"> {result?.header?.customerfirmname} </p>
                    <p className="fsinvp3">{result?.header?.customerstreet}</p>
                    <p className="fsinvp3">{result?.header?.customerregion}</p>
                    <p className="fsinvp3"> {result?.header?.customercity} {result?.header?.customerpincode} </p>
                    <p className="fsinvp3"> Mobile : {result?.header?.customermobileno} </p>
                  </div>
                  <div className="w-25 fsinvp3">
                      <div className="d-flex justify-content-start align-items-center w-100">
                        <div className="fw-bold d-flex justify-content-start align-items-center w1_invp3" >{result?.header?.CustGstNo === '' ? 'VAT' : 'GSTIN' } : </div>
                        <div className="d-flex justify-content-start align-items-center w2_invp3"  >{(result?.header?.CustGstNo === '' ? result?.header?.Cust_VAT_GST_No : result?.header?.CustGstNo)}</div>
                      </div>
                      <div className="d-flex justify-content-start align-items-center w-100"><div className="fw-bold d-flex justify-content-start align-items-center w1_invp3" >{result?.header?.Cust_CST_STATE} : </div><div className="w-50" style={{width:'67%'}}>{result?.header?.Cust_CST_STATE_No}</div></div>
                      <div className="d-flex justify-content-start align-items-center w-100"><div className="fw-bold d-flex justify-content-start align-items-center w1_invp3" >PAN NO : </div><div className="w-50" style={{width:'67%'}}>{result?.header?.CustPanno}</div></div>
                  </div>
                </div>
                <div>
                  {/* <div className="w-50 d-flex flex-column justify-content-between position-relative d-flex"> <div className="w-100 h-100 position-relative"> <div className="discHeadinvp3">DESCRIPTION</div> <div className="w-100 descriptioninovicePrint3 px-2">{descArr} JEWELLERY.</div> </div> <div className="empdivinvp3"></div> </div> */}
                 <div className="d-flex w-100 fw-bold mt-1" style={{border:'2px solid #d8d7d7'}}>
                  <div style={{width:'40%', borderRight:'2px solid #d8d7d7'}} className="d-flex justify-content-center">DESCRIPTION</div>
                  <div style={{width:'30%'}} className="ps-2">DETAIL</div>
                  <div style={{width:'10%'}}>WEIGHT</div>
                  <div style={{width:'10%'}}>RATE</div>
                  <div style={{width:'10%'}}>AMOUNT</div>
                 </div>
                 <div className="w-100" style={{borderBottom:'2px solid #d8d7d7'}}>
                
                  {
                    metal_s?.map((e, i) => {
                      return(
                        <div key={i} className="d-flex w-100  fsinvp3" style={{borderLeft:'2px solid #d8d7d7', borderRight:'2px solid #d8d7d7'}}>
                        <div style={{width:'40%', borderRight:'2px solid #d8d7d7'}} className="d-flex justify-content-center"></div>
                        <div style={{width:'30%'}} className="ps-2">{e?.primaryMetal?.ShapeName} {e?.primaryMetal?.QualityName} </div>
                        <div style={{width:'10%'}}>{e?.netWtFinal?.toFixed(3)}</div>
                        <div style={{width:'10%'}}>{formatAmount((((e?.metalAmountFinal)/((e?.netWtFinal === 0 ? 1 : e?.netWtFinal))) / result?.header?.CurrencyExchRate))}</div>
                        <div style={{width:'10%'}}>{formatAmount(((e?.metalAmountFinal) / (result?.header?.CurrencyExchRate)))}</div>
                        </div>
                      )
                    })
                  }
                  {
                    diamond_s?.map((e, i) => {
                      return(
                        <div key={i} className="d-flex w-100  fsinvp3" style={{borderLeft:'2px solid #d8d7d7', borderRight:'2px solid #d8d7d7'}}>
                        <div style={{width:'40%', borderRight:'2px solid #d8d7d7'}} className="d-flex justify-content-center  text-break px-2">{
                          i === 0 ? `${descArr} JEWELLERY` : ''
                        }</div>
                        <div style={{width:'30%'}} className="ps-2">{e?.MasterManagement_DiamondStoneTypeName}</div>
                        <div style={{width:'10%'}}>{e?.wt?.toFixed(3)}</div>
                        <div style={{width:'10%'}}>{(Math.round(((e?.amount)/((e?.wt === 0 ? 1 : e?.wt)) / result?.header?.CurrencyExchRate)) === 0 ? '' : Math.round(((e?.amount)/((e?.wt === 0 ? 1 : e?.wt)) / result?.header?.CurrencyExchRate)))}</div>
                        <div style={{width:'10%'}}>{ e?.amount === 0 ? '' : formatAmount(e?.amount)}</div>
                        </div>
                      )
                    })
                  }
                  {
                    colorstone_s?.map((e, i) => {
                      return(
                        <div key={i} className="d-flex w-100  fsinvp3" style={{borderLeft:'2px solid #d8d7d7', borderRight:'2px solid #d8d7d7'}}>
                        <div style={{width:'40%', borderRight:'2px solid #d8d7d7'}} className="d-flex justify-content-center"></div>
                        <div style={{width:'30%'}} className="ps-2">{e?.MasterManagement_DiamondStoneTypeName}</div>
                        <div style={{width:'10%'}}>{e?.wt?.toFixed(3)}</div>
                        <div style={{width:'10%'}}>{Math.round(( (e?.amount) / (( e?.isRateOnPcs === 1 ? (e?.pcs === 0 ? 1 : e?.pcs) : (e?.wt === 0 ? 1 : e?.wt))) ) / result?.header?.CurrencyExchRate)}</div>
                        {/* <div style={{width:'10%'}}>{Math.round(( (e?.amount / e?.pcs) /  result?.header?.CurrencyExchRate))}</div> */}
                        <div style={{width:'10%'}}>{formatAmount(((e?.amount)))}</div>
                        </div>
                      )
                    })
                  }
                   <div className="d-flex w-100  fsinvp3" style={{borderLeft:'2px solid #d8d7d7', borderRight:'2px solid #d8d7d7'}}>
                        <div style={{width:'40%', borderRight:'2px solid #d8d7d7'}} className="d-flex justify-content-center"></div>
                        <div style={{width:'30%'}} className="ps-2">MISC</div>
                        <div style={{width:'10%'}}></div>
                        <div style={{width:'10%'}}></div>
                        <div style={{width:'10%'}}>{formatAmount(((result?.mainTotal?.totalMiscAmount - result?.mainTotal?.misc?.isHSCODE123_amt)))}</div>
                        </div>
                        <div className="d-flex w-100  fsinvp3" style={{borderLeft:'2px solid #d8d7d7', borderRight:'2px solid #d8d7d7'}}>
                        <div style={{width:'40%', borderRight:'2px solid #d8d7d7'}} className="d-flex justify-content-center"></div>
                        <div style={{width:'30%'}} className="ps-2">LABOUR</div>
                        <div style={{width:'10%'}}></div>
                        <div style={{width:'10%'}}>{Math.round(total_makingcharge_unit)}</div>
                        <div style={{width:'10%'}}>{formatAmount((result?.mainTotal?.total_Making_Amount + result?.mainTotal?.total_TotalCsSetcost + result?.mainTotal?.total_TotalDiaSetcost + result?.mainTotal?.total_diamondHandling))}</div>
                        </div>
                        <div className="d-flex w-100  fsinvp3" style={{borderLeft:'2px solid #d8d7d7', borderRight:'2px solid #d8d7d7'}}>
                        <div style={{width:'40%', borderRight:'2px solid #d8d7d7'}} className="d-flex justify-content-center"></div>
                        <div style={{width:'30%'}} className="ps-2">OTHER</div>
                        <div style={{width:'10%'}}></div>
                        <div style={{width:'10%'}}></div>
                        <div style={{width:'10%'}}>{formatAmount(((result?.mainTotal?.total_other + result?.mainTotal?.misc?.isHSCODE123_amt)))}</div>
                        </div>
                 </div>
                 <div className="d-flex w-100 fw-bold border-top-0" style={{border:'2px solid #d8d7d7', fontSize:'14px'}}>
                  <div style={{width:'40%', borderRight:'2px solid #d8d7d7'}} className="d-flex justify-content-center"></div>
                  <div style={{width:'30%'}} className="ps-2">TOTAL</div>
                  <div style={{width:'10%'}}></div>
                  <div style={{width:'10%'}}></div>
                  <div style={{width:'10%'}}>{formatAmount(result?.mainTotal?.total_unitcost)}</div>
                 </div>
                </div>
                <div className="summaryinvp3">
                  <div className="totalinvp3">
                    {result?.mainTotal?.total_discount_amount !== 0 && <div className="d-flex justify-content-between px-1">
                      <p className="w-50 text-start fsinvp3">Discount</p>
                      <p className="w-50 text-end fsinvp3">
                        {formatAmount(result?.mainTotal?.total_discount_amount)}
                        {/* {formatAmount(totDiscount)} */}
                      </p>
                    </div>}
                    <div className="d-flex justify-content-between px-1 fw-bold">
                      <p className="fsinvp3">Total Amount</p>
                      <p className="w-50 text-end fsinvp3">
                        {formatAmount(result?.mainTotal?.total_amount)}
                      </p>
                    </div>
                    {result?.allTaxes?.length > 0 &&
                      result?.allTaxes?.map((e, i) => {
                        return (
                          <div className="d-flex justify-content-between px-1" key={i} >
                            <div className="fsinvp3"> {e?.name} {e?.per} </div>
                            <div className="fsinvp3">{formatAmount((e?.amountInNumber * result?.header?.CurrencyExchRate))}</div>
                          </div>
                        );
                      })}

                    {result?.header?.AddLess !== 0 && <div className="d-flex justify-content-between px-1">
                      <p className="fsinvp3"> {result?.header?.AddLess > 0 ? "Add" : "Less"} </p>
                      <p className="w-50 text-end fsinvp3"> {formatAmount(result?.header?.AddLess)} </p>
                    </div>}
                    <div className="d-flex justify-content-between px-1 mt-1" style={{ borderTop: "2.5px solid #e8e8e8" }} >
                      <p className="fw-bold fsinvp3">Grand Total</p>
                      <p className="fw-bold w-50 text-end fsinvp3"> {formatAmount((result?.mainTotal?.total_amount + result?.header?.AddLess + (result?.allTaxesTotal * result?.header?.CurrencyExchRate)))} </p> </div> </div>
                      {/* <div className="wordsinvp3 fsinvp3 px-1 fw-bold"> Rs. {inWords} */}
                      <div className="wordsinvp3 fsinvp3 px-1 fw-bold"> Rs. {NumToWord((result?.mainTotal?.total_amount + result?.header?.AddLess + (result?.allTaxesTotal * result?.header?.CurrencyExchRate)))}
                  </div>
                  <div className="wordsinvp3 fsinvp3">
                    <p className="fw-bold px-2">NOTE:</p>
                    <p className="fsinvp3 text-break" dangerouslySetInnerHTML={{ __html: result?.header?.PrintRemark }} ></p>
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

export default InvoicePrint3;
