//http://localhost:3000/?tkn=OTA2NTQ3MTcwMDUzNTY1MQ==&invn=TVMvNDk0LzIwMjQ=&evn=TWF0ZXJpYWwgU2FsZQ==&pnm=UHJpbnQx&up=aHR0cDovL256ZW4vam8vYXBpLWxpYi9BcHAvTWF0ZXJpYWxCaWxsX0pzb24=&ctv=NzE=&ifid=TaxInvoiceA&pid=undefined
import React, { useEffect,useMemo } from "react";
 
import "../../assets/css/prints/print1MaterialSale.css";
import { useState } from "react";
import {
  NumberWithCommas,
  apiCall,
  checkMsg,
  fixedValues,
  formatAmount,
  handlePrint,
  isObjectEmpty,
} from "../../GlobalFunctions";
import Loader from "../../components/Loader";

const Print1Material = ({
  token,
  invoiceNo,
  printName,
  urls,
  evn,
  ApiVer,
}) => {

  
  const [loader, setLoader] = useState(true);
  const [json0Data, setJson0Data] = useState({});
  const [msg, setMsg] = useState("");
  const [finalD, setFinalD] = useState({});
  const [custAddress, setCustAddress] = useState([]);
  const [taxAmont , setTaxAmount] = useState();
  const [extraTaxAmont , setExtraTaxAmount] = useState();
  const [headFlag, setHeadFlag] = useState(true);
  const [isImageWorking, setIsImageWorking] = useState(true);

 
  
  useEffect(() => {
    const sendData = async () => {
      try {
        const data = await apiCall(
          token,
          invoiceNo,
          printName,
          urls,
          evn,
          ApiVer
        );
        if (data?.Status === "200") {
          let isEmpty = isObjectEmpty(data?.Data);
          if (!isEmpty) {
            let address =
              data?.Data?.MaterialBill_Json[0]?.Printlable?.split("\r\n");
            setCustAddress(address);
            console.log("data", data);
            
            setJson0Data(data?.Data?.MaterialBill_Json[0]);
            const sortedItems = [...(data?.Data?.MaterialBill_Json1 || [])].sort(
              (a, b) => parseFloat(a?.ItemId || 0) - parseFloat(b?.ItemId || 0)
            );
            setFinalD(sortedItems);
            setTaxAmount(data?.Data?.MaterialBill_Json2[0]);
            setExtraTaxAmount(data?.Data?.MaterialBill_Json3);
            
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

  

  const totalMiscWeight = (Array.isArray(finalD) ? finalD : []).reduce((sum, item) => {
    const weight = parseFloat(item?.Weight);
    if (item?.ItemName === 'MISC') {
      return sum + (isNaN(weight) ? 0 : weight);
    }
    return sum;
  }, 0);

  const totalMetalWeight = (Array.isArray(finalD) ? finalD : []).reduce((sum, item) => {
    const weight = parseFloat(item?.Weight);
    if (item?.ItemName === 'METAL') {
      return sum + (isNaN(weight) ? 0 : weight);
    }
    return sum;
  }, 0);

  const ShapeWiseTotalWeight = (Array.isArray(finalD) ? finalD : []).reduce(
    (acc, item) => {
      if (item?.ItemName !== "METAL") return acc;
  
      const shape = item?.shape || "UNKNOWN";
      const weight = parseFloat(item?.Weight) || 0;
      const pureWeight = parseFloat(item?.PureWeight) || 0;
  
      // Total weight
      acc.totalWeight += weight;
      acc.totalPureWeight += pureWeight;
  
      // Shape-wise aggregation
      if (!acc.shapeWise[shape]) {
        acc.shapeWise[shape] = {
          shape,
          totalWeight: 0,
          totalPureWeight: 0,
        };
      }
  
      acc.shapeWise[shape].totalWeight += weight;
      acc.shapeWise[shape].totalPureWeight += pureWeight;
  
      return acc;
    },
    {
      totalWeight: 0,
      totalPureWeight: 0,
      shapeWise: {},
    }
  );
  const handleImageErrors = () => {
    setIsImageWorking(false);
  };

  const toProperCase = (str) =>
    str?.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
  

  const metalAndMiscWeight = totalMetalWeight + totalMiscWeight;
  
  const remainingWeight = (Array.isArray(finalD) ? finalD : []).reduce((sum, item) => {
    const weight = parseFloat(item?.Weight);
    if (item?.ItemName !== 'DIAMOND' && item?.ItemName !== 'COLOR STONE') {
      return sum + (isNaN(weight) ? 0 : weight);
    }
    return sum;
  }, 0);

  const WeightDiaCS = (Array.isArray(finalD) ? finalD : []).reduce((sum, item) => {
    const weight = parseFloat(item?.Weight);
    if (item?.ItemName == 'DIAMOND' || item?.ItemName == 'COLOR STONE') {
      return sum + (isNaN(weight) ? 0 : weight);
    }
    return sum;
  }, 0);

  
   

  // const remainingWeight = (Array.isArray(finalD) ? finalD : []).reduce((sum, item) => {
  //   const weight = parseFloat(item?.Weight);
  //   if (item?.ItemName ==='COLOR STONE' || item?.ItemName === 'DIAMOND') {
  //     return sum + (isNaN(weight) ? 0 : weight);
  //   }
  //   return sum;
  // }, 0);

  const totalPieces = (Array.isArray(finalD) ? finalD : []).reduce((sum, item) => {
    const pieces = parseFloat(item?.pieces);
    return sum + (isNaN(pieces) ? 0 : pieces);
  }, 0);  

  const totalAmount = (Array.isArray(finalD) ? finalD : []).reduce((sum, item) => {
    const Amount = parseFloat(item?.Amount);
    return sum + (isNaN(Amount) ? 0 : Amount);
  }, 0);

  const totalEtraTaxAmount = (Array.isArray(extraTaxAmont) ? extraTaxAmont : []).reduce((sum, item) => {
    const amount = parseFloat(item?.totaltaxAmount);
    
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0); 
   
 

  const GrandTotal =
    (totalAmount || 0) +
    (totalEtraTaxAmount || 0) +
    (taxAmont?.tax1Amount || 0) +
    (taxAmont?.tax2Amount || 0) +
    (taxAmont?.tax4Amount || 0) +
    (taxAmont?.tax5Amount || 0) +
    (taxAmont?.tax3Amount || 0);

    
  


    const groupedData = React.useMemo(() => {
      if (!Array.isArray(finalD)) return [];
    
      return Object.values(
        finalD.reduce((acc, item) => {
          const key = [
            item.ItemName,
            item.shape,
            item.quality,
            item.color,
            item.size,
            item.Rate
          ].join("|");
    
          if (!acc[key]) {
            acc[key] = { ...item };
          } else {
            acc[key].pieces =
              (Number(acc[key].pieces) || 0) + (Number(item.pieces) || 0);
    
            acc[key].Weight =
              (Number(acc[key].Weight) || 0) + (Number(item.Weight) || 0);
    
            acc[key].Amount =
              (Number(acc[key].Amount) || 0) + (Number(item.Amount) || 0);
          }
    
          return acc;
        }, {})
      );
    }, [finalD]);
    
    const getItemDisplay = (e) => {
      switch (e?.ItemName) {
        case "FINDING":
          return `${e?.FindingType}(${e?.FindingAccessories})`;
    
        case "MOUNT":
          return e?.MountCategory;
    
        default:
          return "";
      }
    };

    // const parts = [
    //   e?.shape,
    //   e?.quality,
    //   e?.color,
    //   e?.size,
    //   e?.Tunch > 0 ? formatAmount(e?.Tunch, 3) : null
    // ].filter(Boolean);
    
    // `FINDING:${parts.join('/')}`
    

  // console.log("taxAmont", taxAmont);
  // console.log("extraTaxAmont", extraTaxAmont);
  // console.log("finalD", finalD);
  // console.log("json0Data", json0Data);

  return (
    <>
      {loader ? (
        <Loader />
      ) : msg === "" ? (
        <>
          <div className="w-full flex">
            <div className="w-full flex items-center justify-end spfnthead head_Chkbx">
              <input
                type="checkbox"
                id="Finding"
                className="mx-1"
                checked={headFlag}
                onChange={() => setHeadFlag(!headFlag)}
              />
              <label htmlFor="Finding" className="me-3 user-select-none">With Header</label>
            </div>
            <div className="prnt_btn">
              <input
                type="button"
                className="btn_white blue mt-0"
                value="Print"
                onClick={(e) => handlePrint(e)}
              />
            </div>
          </div>
          <div className="w-full flex items-center justify-center">
            <div className="container_inv2">
              {/** Header */}
              {headFlag && (
                <div className="headlineJL w-100 p-2">
                  <b style={{ fontSize: "20px" }}>
                    {json0Data?.PrintHeadLbl}
                  </b>
                </div>
              )}
              <div className="disflx justify-content-between" style={{ marginBottom: "10px" }}>
                  <div className="spfnthead" style={{ paddingLeft: "5px" }}>
                    {json0Data?.CompanyFullName !== "" && ( <div className="spfntBld" style={{ fontSize: "15px" }}>{json0Data?.CompanyFullName}</div> )}
                    {json0Data?.CompanyAddress !== "" && (<div className="">{json0Data?.CompanyAddress}</div>)}
                    <div className="">{json0Data?.CompanyAddress2}</div>
                    <div className="">{json0Data?.CompanyCity} {json0Data?.CompanyCity && json0Data?.CompanyPinCode !== "" && ("-")} {json0Data?.CompanyPinCode !== "" && (`${json0Data?.CompanyPinCode},`)} {json0Data?.CompanyState}{json0Data?.CompanyCountry !== "" && (`(${json0Data?.CompanyCountry})`)}</div>
                    {json0Data?.CompanyTellNo !== "" && (<div className="">T {json0Data?.CompanyTellNo} {json0Data?.CompanyTollFreeNo ?` | TOLL FREE ${json0Data?.CompanyTollFreeNo}`:""}</div>)}
                    <div className="">{json0Data?.CompanyEmail} {json0Data?.CompanyWebsite && json0Data?.CompanyEmail !== "" && ("|")} {json0Data?.CompanyWebsite}</div>
                    <div className="">{json0Data?.Company_VAT_GST_No !== "" && (`${json0Data?.Company_VAT_GST}-${json0Data?.Company_VAT_GST_No}`)} {json0Data?.Company_VAT_GST_No && json0Data?.Company_CST_STATE_No !== "" && ("|")} {json0Data?.Company_CST_STATE_No !== "" && (`${json0Data?.Company_CST_STATE}-${json0Data?.Company_CST_STATE_No}`)} {json0Data?.Company_CST_STATE_No && json0Data?.ComPanCard !== "" && ("|")} {json0Data?.ComPanCard !== "" && ( `PAN-${json0Data?.ComPanCard} `)}</div>
                  </div>

                  {typeof json0Data?.PrintLogo === 'string' && json0Data.PrintLogo.trim() !== '' && (
                    <div>
                      <img 
                        src={json0Data.PrintLogo} 
                        alt="#companylogo"  
                        className="cmpnyLogo" 
                        width={85}
                        height={85}
                        onError={handleImageErrors}
                      />
                    </div>
                  )}

                </div>
              <div className="disflx brbxAll">
                <div className="w1_inv2 spTpMrgHD spfnthead disflx">
                  <div className="spfntBld">To,</div>
                  <div className="spfntsZ spfntBld" style={{ paddingLeft: "4px" }}>{json0Data?.Customercode}</div>
                </div>
                <div className="w2_inv2">
                </div>
                <div className="w30_inv2 spTpMrgHD spfnthead">
                  <div className="disflx">
                    <div className="wdthHd spfntBld">BILL NO</div>
                    <div className="wdthHd1">{json0Data?.InvoiceNo}</div>
                  </div>
                  <div className="disflx">
                    <div className="wdthHd spfntBld">DATE</div>
                    <div className="wdthHd1">{json0Data?.EntryDate}</div>
                  </div>
                  <div className="disflx">
                    <div className="wdthHd spfntBld">CODE</div>
                    <div className="wdthHd1 spfntBld">{json0Data?.Customercode}</div>
                  </div>
                </div>
              </div>

              {/** Table Header */}
              <div className="disflx brbxAll spfntbH" style={{ marginTop: "2px"}}>
                <div className="col1_inv2 spfntBld spbrRht spfntCen">SR#</div>
                <div className="col2_inv2 spfntBld spbrRht">DESCRIPTION</div>
                <div className="col4_inv2 spfntBld spbrRht">TAG NO</div>
                <div className="col3_inv2 spfntBld spbrRht">REMARKS</div>
                <div className="col6_inv2 spfntBld spbrRht spfnted">PCS</div>
                <div className="col7_inv2 spbrRht spfntBld spfnted">WEIGHT</div>
                <div className="col8_inv2 spfntBld spbrRht spfnted">RATE</div>
                <div className="col9_inv2 spfntBld spfnted">AMOUNT</div>
              </div>

              {/** table Body */}
              {/* {finalD?.map((e, i) => { */}
              {groupedData?.map((e, i) => {

                return (
                  <div key={i} className="disflx spbrlFt brBtom spfntbH">
                    <div className="Sucol1_inv2 spbrRht spfntCen">{i + 1}</div>
                    <div className="Sucol2_inv2 spbrRht">
                      
                    {e?.ItemName === "DIAMOND" 
                      ? `DIAMOND:${e?.shape}${e?.shape ? '/' : ''}${e?.quality}${e?.quality ? '/' : ''}${e?.color}${e?.color ? '/' : ''}${e?.size}`
                      : e?.ItemName === "COLOR STONE" 
                        ? `CS:${e?.shape}${e?.shape ? '/' : ''}${e?.quality}${e?.quality ? '/' : ''}${e?.color}${e?.color ? '/' : ''}${e?.size}` 
                        : e?.ItemName === "METAL" 
                          ? `METAL:${e?.shape}${e?.shape ? '/' : ''}${e?.quality}${e?.quality ? '/' : ''}${e?.color}${e?.color ? '/' : ''}${formatAmount(e?.Tunch,3)}`
                          : e?.ItemName === "MISC" 
                            ? `MISC:${e?.LotNo}${e?.LotNo ? '/' : ''}${e?.shape}${e?.shape ? '/' : ''}${e?.quality}${e?.quality ? '/' : ''}${e?.color}${e?.color ? '/' : ''}${e?.size}`
                            : e?.ItemName === "FINDING" 
                              ? `FINDING:${e?.shape}${e?.shape ? '/' : ''}${e?.quality}${e?.quality ? '/' : ''}${e?.color}${e?.color ? '/' : ''}${e?.size}${e?.size ? '/' : ''}${e?.Tunch>0?formatAmount(e?.Tunch,3):""}`
                              : e?.ItemName === "ALLOY" 
                                ? `ALLOY:${e?.shape}${e?.shape ? '/' : ''}${e?.quality}${e?.quality ? '/' : ''}${e?.color}${e?.color ? '/' : ''}${e?.size}${e?.size ? '/' : ''}${e?.Tunch>0?formatAmount(e?.Tunch,3):""}`
                                : e?.ItemName === "MOUNT" 
                                  ? `MOUNT:${e?.shape}${e?.shape ? '/' : ''}${e?.quality}${e?.quality ? '/' : ''}${e?.color}${e?.color ? '/' : ''}${e?.size}${e?.size ? '/' : ''}${e?.Tunch>0?formatAmount(e?.Tunch,3):""}`
                                  : ""
                    }
                    </div>
                    <div className="Sucol4_inv2 spbrRht">{e?.RfBag}</div>
                    <div className="Sucol3_inv2 spbrRht">{getItemDisplay(e)}</div> {/** Remarks */}
                    <div className="Sucol6_inv2 spbrRht spfnted">{e?.pieces === "" ? "-" : e?.pieces}</div>
                    <div className="Sucol7_inv2 spbrRht spfnted">{fixedValues(e?.Weight === "" ? "-" : e?.Weight,3)}</div>
                    <div className="Sucol8_inv2 spfnted spbrRht">{formatAmount(e?.Rate === "" ? "-" : e?.Rate,2)}</div>
                    <div className="Sucol9_inv2 spfnted spbrRht">{formatAmount(e?.Amount === "" ? "-" : e?.Amount,2)}</div>
                  </div>
                )
              })}

              {/** Table Total */}
              <div className="disflx spbrlFt brBtom spfntbH">
                <div className="SeSucol1_inv2 spbrRht spfntBld"><b>TOTAL</b></div>
                <div className="SeSucol6_inv2 spbrRht spfnted spfntBld"><b>{totalPieces}</b></div>
                <div className="SeSucol7_inv2 spfnted spfntBld spbrRht spbrWord"><b>{fixedValues(WeightDiaCS,3)} ctw <br />  {remainingWeight ?fixedValues(remainingWeight,3)+" gm":""} </b></div>
                <div className="SeSucol8_inv2 spfnted spbrRht"></div>
                <div className="SeSucol9_inv2 spfnted spfntBld spbrRht"><b>{formatAmount(totalAmount,2)}</b></div>
              </div>
              
              {/** Total */}
              <div className="sprmrk disflx spbgClr brbxAll" style={{alignItems:"flex-start"}}>
                {/* <div className="sptxtVcen">Gold In 24K : <b>{fixedValues(totalMetalWeight,3)}</b></div> */}
                <div>
                {
                  
                  Object.values(ShapeWiseTotalWeight.shapeWise).map(item => (
                    <div key={item.shape} className="sptxtVcen" style={{marginBottom: "4px"}}>
                     <b> {toProperCase(item.shape)} Pure Weight: {fixedValues(item.totalPureWeight, 3)}</b>
                    </div>
                  ))
                }
                </div>
               
                {/* <div className="sptxtVcen">Gold In 24K : <b>{fixedValues(totalMetalWeight,3)}</b></div> */}
                <div className="spfntBld sptxtVcen">TOTAL  : {NumberWithCommas(GrandTotal,2)}</div>
              </div>
              <div className="sprmrk brbxAll spfnted">
                <div className="spfntBld">TOTAL :  {NumberWithCommas(GrandTotal,2)}</div>
              </div>
              
              {/** Instuction */} 
              <div className="brbxAll spinst">
                **We hereby confirm that we have received the above goods in good condition and order.
              </div>
              
              {/** Signature */}
              <div className="disflx brbxAll spfntCen spfntbH" style={{ marginTop: "24px" }}>
                <div className="spbnkdtl1 spbrRht">
                  <div className="disflx w-100 align-items-center text-center">
                  <div className="w-100 text-center">Authorised,&nbsp;<b>{json0Data?.customerfirmname}</b></div>
                  </div>
                </div>
                <div className="spbnkdtl1">
                  <div className="disflx w-100">
                    <div className="w-100 text-center">Authorised,&nbsp;<b>{json0Data?.CompanyFullName}</b></div>
                  </div>
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
  );
};

export default Print1Material;
