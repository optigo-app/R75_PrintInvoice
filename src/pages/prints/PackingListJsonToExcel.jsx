import React, { useEffect, useRef } from 'react'
import { useState } from 'react';
import { ExportToExcel, apiCall, checkMsg, formatAmount, isObjectEmpty } from '../../GlobalFunctions';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import Loader from '../../components/Loader';
import { cloneDeep } from 'lodash';
import  ReactHTMLTableToExcel  from 'react-html-table-to-excel';


const PackingListJsonToExcel = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [result2, setResult2] = useState(null);
    const [isImageWorking, setIsImageWorking] = useState(true);
    const [result, setResult] = useState(null);

    const tableRef = useRef(null);

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
            console.log(error);
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

        let finalArr = [];

        datas?.resultArray?.forEach((e) => {
          let b = cloneDeep(e);

          let misc23 = [];

          b?.misc?.forEach((el) => {
            if(el?.IsHSCOE === 1 || el?.IsHSCOE === 3){
              misc23.push(el);
            }
          })
          let obj = {
            item_group:'OPERATION',
            desc:``,
            PIECES:0,
            // Pcs:0,
            WEIGHT:0,
            Wt:0,
            row_no:4,
            RATE:0,
            MasterManagement_DiamondStoneTypeid : 11
          }
          if(e?.MakingChargeOnid === 1){
            obj.desc = 'Making Charge per Gram';
            // obj.WEIGHT = e?.NetWt;
            obj.Wt = (e?.NetWt + e?.LossWt);

          }else if(e?.MakingChargeOnid === 5 || e?.MakingChargeOnid === 4){
            obj.desc = "Making Charge Per Pieces";
            // obj.WEIGHT = e?.NetWt;
            obj.Wt = (e?.NetWt + e?.LossWt);
          }

          let all = [...b?.metal, ...b?.diamonds, ...b?.colorstone, ...misc23, obj];

          b.material = all;
          
          finalArr.push(b);

        })

        datas.resultArray = finalArr;
        let finalArr2 = [];

        datas?.resultArray?.forEach((e) => {
          let a = cloneDeep(e);
          let arr = [];
          a?.material?.forEach((el) => {
            let obj = {...el};
            if (obj?.MasterManagement_DiamondStoneTypeid === 4) {
              obj.item_name = 'AG';
              obj.item_group = el?.ShapeName;
              obj.desc = `AG-${el?.QualityName}-${el?.Colorname?.charAt(0)}`;
              obj.row_no = 3
              
            } else if (obj?.MasterManagement_DiamondStoneTypeid === 1) {
              let shp = '';
              if(obj?.ShapeName?.toLowerCase() === 'rnd'){
                shp = 'Round';
              }else{
                shp = obj?.ShapeName
              }
              if (obj?.QualityName?.toLowerCase()?.startsWith("c-")) {
                obj.item_name = 'LGD';
                obj.item_group = "LAB GROWN DIAMOND";
                obj.desc = `LGD-${shp}-${el?.QualityName}-${el?.Colorname}-${el?.SizeName} MM`
                obj.row_no = 3
              } else {
                obj.item_name = 'ND';
                obj.item_group = "NATURAL DIAMOND";
                obj.desc = `ND-${shp}-${el?.QualityName}-${el?.Colorname}-${el?.SizeName} MM`
                obj.row_no = 3
              }
            } else if (obj?.MasterManagement_DiamondStoneTypeid === 2) {
              if(obj?.QualityName?.toLowerCase() === 'cer'){
                obj.Wt = (el?.Wt / 5);
              }
              obj.item_name = el?.ShapeName;
              // obj.item_group = "CONSUMABLE";
              obj.desc = el?.QualityName;
              if(el?.QualityName?.toLowerCase()?.includes('cer') || el?.QualityName?.toLowerCase()?.includes('s-onx')){
                obj.item_group = "CONSUMABLE";
              }else{
                obj.item_group = "SEMI PRESIOUS STONE";
              }
              // if(el?.QualityName?.toLowerCase()?.includes('cer')){
              //   obj.desc = `CONSUMABLE-Ceramic`
              // }else if(el?.QualityName?.toLowerCase()?.includes('s-onx')){
              //   obj.desc = `CONSUMABLE-Black Beads`
              // }else{
              //   obj.desc = `CONSUMABLE-Semi Precious `
              // }
              obj.row_no = 3
            } else if (obj?.MasterManagement_DiamondStoneTypeid === 3) {
              obj.item_name = "";
              obj.item_group = "OPERATION";
              if(el?.IsHSCOE === 1){
                obj.desc = `${el?.ShapeName}`
              }else if(el?.IsHSCOE === 3){
                obj.desc = `${el?.ShapeName}`
              }
              obj.row_no = 4
            }
            arr.push(obj);
          });
        
          a.material = arr;

          finalArr2.push(a);

        });

        datas.resultArray = finalArr2;


        let MainArr = [];

        datas?.resultArray?.forEach((e, i) => {
          let arr = [];
          let len = 0;
          if(e?.material?.length > 0){
            len = e?.material?.length;
          }

          let obj = {};

          obj.sr = i+1;
          obj.srFlag = true;
          obj.srRowSpan = len;
          obj.SrJobno = `${e?.SrJobno}`;
          obj.designno = e?.designno;
          obj.item_name = e?.MFG_DesignNo;
          obj.item_group = 'STYLE';
          obj.ROW_NO = 1;
          obj.PO_NO = result?.header?.InvoiceNo;
          obj.PO_DATE = result?.header?.EntryDate;
          obj.STYLE_SIZE = e?.Size;
          obj.HUID = e?.HUID;
          obj.CertificateNo = e?.CertificateNo;
          obj.lineid = e?.lineid;
          obj.TRANS_CATEGORY = 'GEN';
          obj.VENDOR = 'V-101-GJ-SRT-CO447';
          obj.CURRENCY = 'INR';
          obj.STOCK_LOCATION = 'CORPORATE OFFICE';
          obj.DEPARTMENT = '101-81';
          obj.TERMS = result?.header?.DueDays;
          obj.DOC_NO = '';
          obj.REF_TRANS_ITEM_ID = '';
          obj.REF_TRANS_ITEM_BOM_ID = '';
          obj.PIECES = (e?.Categoryname?.toLowerCase() === "earring" ? 2 : 1);
          obj.WEIGHT = parseFloat(e?.grosswt)?.toFixed(3);
          obj.RATE = '';
          obj.desc ='';


          // eslint-disable-next-line array-callback-return
          Array.from({length : len})?.map((el, ind) => {
            let obj = {};
            obj.srflag = false;
            obj.SrJobno = e?.SrJobno;
            obj.item_name = '';
            obj.item_group = '';
            obj.matflag = false;
            obj.PIECES = 0;
            obj.WEIGHT = 0;
            obj.RATE = 0;
            
            if(e?.material[ind]){
              obj.matflag = true;
              obj.item_group = (e?.material[ind]?.item_group);
              obj.item_name = (e?.material[ind]?.item_name);
              obj.PIECES = ( (e?.material[ind]?.MasterManagement_DiamondStoneTypeid === 6 || e?.material[ind]?.MasterManagement_DiamondStoneTypeid === 3) ? '' : e?.material[ind]?.Pcs);
              obj.WEIGHT = ( (e?.material[ind]?.MasterManagement_DiamondStoneTypeid === 6 || e?.material[ind]?.MasterManagement_DiamondStoneTypeid === 3) ? '' : e?.material[ind]?.Wt );
              obj.RATE = ( e?.material[ind]?.MasterManagement_DiamondStoneTypeid === 11 ? (e?.MaKingCharge_Unit) : e?.material[ind]?.Rate);
              obj.desc = (e?.material[ind]?.desc);
              obj.row_no = e?.material[ind]?.row_no;
            }

            arr.push(obj);

          })

          obj.matrialArr = arr;
          obj.values = e;

          MainArr.push(obj);

        })

        // ExportToExcel(, data?.BillPrint_Json[0]?.InvoiceNo);
        setResult2(MainArr);
        setResult(datas);


         // for download excel direct
         setTimeout(() => {
          const button = document?.getElementById('test-table-xls-button');
          button.click();
        }, 0);

      }

  return (
    <>
        {
          loader ? <Loader /> : <>{
            msg === "" ? 
            <div>
                 <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="download-table-xls-button btn btn-success text-black bg-success px-2 py-1 fs-5 d-none"
                    table="table-to-xls"
                    filename={`PackingList_KM_${result?.header?.InvoiceNo}_${Date?.now()}`}
                    sheet="tablexls"
                    buttonText="Download as XLS"
                 />
              {/* <table ref={tableRef} > */}
              <table id='table-to-xls' className='mb-5'>
                <thead>
                    <tr>
                      <th style={{borderBottom:'1px solid black', borderRight:'1px solid black', borderTop:'1px solid black'}} width={120}>Column1</th>
                      <th style={{borderBottom:'1px solid black', borderRight:'1px solid black', borderTop:'1px solid black'}} width={120}>SR_NO</th>
                      <th style={{borderBottom:'1px solid black', borderRight:'1px solid black', borderTop:'1px solid black'}} width={120}>ROW_NO</th>
                      <th style={{borderBottom:'1px solid black', borderRight:'1px solid black', borderTop:'1px solid black'}} width={120}>REF_DOC_NO</th>
                      <th style={{borderBottom:'1px solid black', borderRight:'1px solid black', borderTop:'1px solid black'}} width={120}>PO_NO</th>
                      <th style={{borderBottom:'1px solid black', borderRight:'1px solid black', borderTop:'1px solid black'}} width={120}>PO_DATE</th>
                      <th style={{borderBottom:'1px solid black', borderRight:'1px solid black', borderTop:'1px solid black'}} width={120}>ITEM_GROUP</th>
                      <th style={{borderBottom:'1px solid black', borderRight:'1px solid black', borderTop:'1px solid black'}} width={120}>ITEM_NAME</th>
                      <th style={{borderBottom:'1px solid black', borderRight:'1px solid black', borderTop:'1px solid black'}} width={120}>VARIANT_NAME</th>
                      <th style={{borderBottom:'1px solid black', borderRight:'1px solid black', borderTop:'1px solid black'}} width={120}>STYLE_SIZE</th>
                      <th style={{borderBottom:'1px solid black', borderRight:'1px solid black', borderTop:'1px solid black'}} width={120}>OLD_VARIANT_NAME</th>
                      <th style={{borderBottom:'1px solid black', borderRight:'1px solid black', borderTop:'1px solid black'}} width={120}>PIECES</th>
                      <th style={{borderBottom:'1px solid black', borderRight:'1px solid black', borderTop:'1px solid black'}} width={120}>WEIGHT</th>
                      <th style={{borderBottom:'1px solid black', borderRight:'1px solid black', borderTop:'1px solid black'}} width={120}>RATE</th>
                      <th style={{borderBottom:'1px solid black', borderRight:'1px solid black', borderTop:'1px solid black'}} width={120}>HUID</th>
                      <th style={{borderBottom:'1px solid black', borderRight:'1px solid black', borderTop:'1px solid black'}} width={120}>CERTIFICATE</th>
                      <th style={{borderBottom:'1px solid black', borderRight:'1px solid black', borderTop:'1px solid black'}} width={120}>LINE_NO</th>
                      <th style={{borderBottom:'1px solid black', borderRight:'1px solid black', borderTop:'1px solid black'}} width={120}>TRANS_CATEGORY</th>
                      <th style={{borderBottom:'1px solid black', borderRight:'1px solid black', borderTop:'1px solid black'}} width={120}>VENDOR</th>
                      <th style={{borderBottom:'1px solid black', borderRight:'1px solid black', borderTop:'1px solid black'}} width={120}>CURRENCY</th>
                      <th style={{borderBottom:'1px solid black', borderRight:'1px solid black', borderTop:'1px solid black'}} width={120}>STOCK_LOCATION</th>
                      <th style={{borderBottom:'1px solid black', borderRight:'1px solid black', borderTop:'1px solid black'}} width={120}>DEPARTMENT</th>
                      <th style={{borderBottom:'1px solid black', borderRight:'1px solid black', borderTop:'1px solid black'}} width={120}>TERMS</th>
                      <th style={{borderBottom:'1px solid black', borderRight:'1px solid black', borderTop:'1px solid black'}} width={120}>DOC_NO</th>
                      <th style={{borderBottom:'1px solid black', borderRight:'1px solid black', borderTop:'1px solid black'}} width={120}>REF_TRANS_ITEM_ID</th>
                      <th style={{borderBottom:'1px solid black', borderRight:'1px solid black', borderTop:'1px solid black'}} width={120}>REF_TRANS_ITEM_BOM_ID</th>
                    </tr>
                </thead>
                <tbody>
                    {
                      result2?.map((e, i) => {
                        return <React.Fragment key={i}>
                          <tr key={i} className='border'>
                            <td  width={90}>&nbsp;{e?.SrJobno}</td>
                            <td  width={90}>{i+1}</td>
                            <td  width={120}>{e?.ROW_NO}</td>
                            <td  width={120}></td>
                            <td  width={90}>{result?.header?.InvoiceNo}</td>
                            <td  width={90}>{result?.header?.EntryDate}</td>
                            <td  width={190}>{e?.item_group}</td>
                            <td  width={190}>{e?.item_name}</td>
                            <td  width={190}>{e?.desc}</td>
                            <td  width={190}>{e?.STYLE_SIZE}</td>
                            <td  width={190}>{e?.designno}</td>
                            <td  width={90}>{e?.PIECES}</td>
                            <td  width={90}>{e?.WEIGHT}</td>
                            <td  width={90}>{e?.RATE}</td>
                            <td  width={190}>{e?.HUID}</td>
                            <td  width={190}>{e?.CertificateNo}</td>
                            <td  width={190}>{e?.lineid}</td>
                            <td  width={90}>GEN</td>
                            <td  width={190}>V-101-GJ-SRT-CO447</td>
                            <td  width={190}>INR</td>
                            <td  width={190}>CORPORATE OFFICE</td>
                            <td  width={90}>101-81</td>
                            <td  width={90}>{result?.header?.DueDays}</td>
                            <td  width={190}></td>
                            <td  width={190}></td>
                            <td  width={190}></td>
                          </tr>
                          {
                            e?.matrialArr?.map((ele, ind) => {
                              return <tr key={ind}>
                                <td  width={90}>&nbsp;{ele?.matflag ? e?.SrJobno : ''}</td>
                                <td  width={90}></td>
                                <td  width={120}>{ele?.matflag ? ele?.row_no : ''}</td>
                                <td  width={120}></td>
                                <td  width={90}></td>
                                <td  width={90}></td>
                                <td  width={190}>{ele?.matflag ? ele?.item_group : ''}</td>
                                <td  width={190}>{ele?.matflag ? ele?.item_name : ''}</td>
                                <td  width={190}>{ele?.matflag ? ele?.desc: ''}</td>
                                <td  width={190}></td>
                                <td  width={190}></td>
                                <td  width={90}>{ele?.matflag ? ele?.PIECES : ''}</td>
                                <td  width={90}>{ele?.matflag ? ((ele?.WEIGHT === undefined || ele?.WEIGHT === '') ? '' :  parseFloat(ele?.WEIGHT)?.toFixed(3)) : ''}</td>
                                <td  width={90}>{ele?.matflag ? formatAmount(ele?.RATE) : ''}</td>
                                <td  width={190}></td>
                                <td  width={190}></td>
                                <td  width={190}></td>
                                <td  width={90}></td>
                                <td  width={190}></td>
                                <td  width={190}></td>
                                <td  width={190}></td>
                                <td  width={90}></td>
                                <td  width={90}></td>
                                <td  width={190}></td>
                                <td  width={190}></td>
                                <td  width={190}></td>
                              </tr>
                            })
                          }
                        </React.Fragment>
                      })
                    }
                </tbody>
              </table>
           
 
            </div> : 
            <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
            {" "}
            {msg}{" "}
          </p>
          }</>
        }
    </>
  )
}

export default PackingListJsonToExcel


// import React from 'react'
// import { useState } from 'react';
// import Loader from '../../components/Loader';
// import { useEffect } from 'react';
// import { ExportToExcel, NumberWithCommas, apiCall, fixedValues, isObjectEmpty } from '../../GlobalFunctions';
// import { exportToExcel } from 'react-json-to-excel';
// import { cloneDeep } from 'lodash';

// const PackingListJsonToExcel = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {

//     const [loader, setLoader] = useState(true);
//     const [msg, setMsg] = useState("");
//     const [isImageWorking, setIsImageWorking] = useState(true);
//   const handleImageErrors = () => {
//     setIsImageWorking(false);
//   };
//     const loadData = (data) => {
//         let json0Data = data?.BillPrint_Json[0];
//         let json1Data = data?.BillPrint_Json1;
//         let json2Data = data?.BillPrint_Json2;
//         let blankArr = [];
//         json1Data.forEach((e, i) => {
//             let obj = { ...e };
//             let materials = [];
//             json2Data.forEach((ele, ind) => {
//                 if (ele?.StockBarcode === e?.SrJobno) {
//                     if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
//                       materials.push(ele);
//                         // let findIndexs = materials.findIndex((elem, index) => elem?.Rate === ele?.Rate && elem?.GroupName === ele?.GroupName &&
//                         //     elem?.MasterManagement_DiamondStoneTypeid === 1);
//                         // if (findIndexs === -1) {
//                         //     materials.push(ele);
//                         // } else {
//                         //     materials[findIndexs].Wt += ele?.Wt;
//                         //     materials[findIndexs].Amount += ele?.Amount;
//                         //     materials[findIndexs].Pcs += ele?.Pcs;
//                         // }
//                     } else if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
//                             materials.push(ele)
//                         // let findIndex = materials.findIndex((elem, index) => elem?.Rate === ele?.Rate
//                         //     && elem?.MasterManagement_DiamondStoneTypeid === ele?.MasterManagement_DiamondStoneTypeid);
//                         // if (findIndex === -1) {
//                         //     materials.push(ele);
//                         // } else {
//                         //     materials[findIndex].Wt += ele?.Wt;
//                         //     materials[findIndex].Amount += ele?.Amount;
//                         //     materials[findIndex].Pcs += ele?.Pcs;
//                         // }
//                     }
//                 }
//             });
//             let diamonds = materials.filter(ele => ele?.MasterManagement_DiamondStoneTypeid === 1);
//             let colorStones = materials.filter(ele => ele?.MasterManagement_DiamondStoneTypeid === 2);
//             let metals = materials.filter(ele => ele?.MasterManagement_DiamondStoneTypeid === 4);
//             let blankDiamonds = [];
//             let blankColorStones = [];


            
//             diamonds.forEach((elem, ind) => {
//                 let findRecord = blankDiamonds.findIndex((elee, indd) => elee?.ShapeName === elem?.ShapeName &&
//                     elee?.Colorname === elem?.Colorname && elee?.QualityName === elem?.QualityName && elee?.Rate === elem?.Rate);
//                 if (findRecord === -1) {
//                     blankDiamonds.push(elem);
//                 } else {
//                     blankDiamonds[findRecord].SizeName += elem?.GroupName;
//                     blankDiamonds[findRecord].Wt += elem?.Wt;
//                     blankDiamonds[findRecord].Pcs += elem?.Pcs;
//                     blankDiamonds[findRecord].Amount += elem?.Amount;
//                 }
//             });
//             colorStones.forEach((ele, ind) => {
//                 let findIndex = blankColorStones.findIndex((elem, index) => elem?.ShapeName === ele?.ShapeName &&
//                     elem?.QualityName === ele?.QualityName && elem?.Colorname === ele?.Colorname
//                     && elem?.Rate === ele?.Rate);
//                 if (findIndex === -1) {
//                     blankColorStones.push(ele);
//                 } else {
//                     blankColorStones[findIndex].SizeName = ele?.GroupName;
//                     blankColorStones[findIndex].Wt += ele?.Wt;
//                     blankColorStones[findIndex].Amount += ele?.Amount;
//                     blankColorStones[findIndex].Pcs += ele?.Pcs;
//                 }
//             });

//             let arr = [blankDiamonds, blankColorStones, metals];
//             let largestLength = -1;

//             arr.forEach((ele, i) => {
//                 if (ele.length > largestLength) {
//                     largestLength = ele.length;
//                 }
//             });
//             if (materials.length > 0) {
//                 Array.from({ length: largestLength }).forEach((ele, ind) => {
//                     let diamondQualityname = "";
//                     let diamondColorName = "";
//                     let diamondWt = "";
//                     let diamondRate = "";
//                     let diamondAmount = "";
//                     let diamondGroupname = "";
//                     let diamondShapename = "";
//                     let diamondPcs = "";
//                     if (blankDiamonds[ind]) {
//                         diamondQualityname = blankDiamonds[ind]?.QualityName;
//                         diamondColorName = blankDiamonds[ind]?.Colorname;
//                         diamondWt = NumberWithCommas(blankDiamonds[ind]?.Wt, 3);
//                         diamondRate = NumberWithCommas(blankDiamonds[ind]?.Rate, 2);
//                         diamondAmount = NumberWithCommas(blankDiamonds[ind]?.Amount / json0Data?.CurrencyExchRate, 2);
//                         diamondGroupname = blankDiamonds[ind]?.GroupName;
//                         diamondShapename = blankDiamonds[ind]?.ShapeName;
//                         diamondPcs = NumberWithCommas(blankDiamonds[ind]?.Pcs, 0);
//                     }
//                     let stoneShape = "";
//                     let stonePcs = "";
//                     let stoneWt = "";
//                     let stoneRate = "";
//                     let stoneAmount = "";
//                     let metalRate = "";
//                     let metalrateCopy = 0;

//                     if (colorStones[ind]) {
//                         stoneShape = colorStones[ind]?.ShapeName;
//                         stonePcs = NumberWithCommas(colorStones[ind]?.Pcs, 0);
//                         stoneWt = NumberWithCommas(colorStones[ind]?.Wt, 3);
//                         stoneRate = NumberWithCommas(colorStones[ind]?.Rate, 2);
//                         stoneAmount = NumberWithCommas(colorStones[ind]?.Amount / json0Data?.CurrencyExchRate, 2);
//                     }
//                     if (metals[ind]) {

//                         metalRate = NumberWithCommas(metals[ind]?.Rate, 2);
//                         metalrateCopy = +(fixedValues(metals[ind]?.Rate, 2));
//                     }
//                     let goldValue = ind === 0 ? NumberWithCommas((e?.MetalAmount - e?.LossAmt) / json0Data?.CurrencyExchRate, 2) : "";
//                     // let goldValue = ind === 0 ? NumberWithCommas((e?.NetWt*metalrateCopy) , 2) : "";
//                     if (goldValue === 0) {
//                         goldValue = ""
//                     }
          
//                     let companyFullName = ind === 0 ? json0Data?.CompanyFullName : "";
//                     let categoryname = ind === 0 ? e?.Categoryname : "";
             
//                     let otherAmtDetail = ind === 0 ? e?.OtherAmtDetail : "";
//                     let certification = ind === 0 ? `${NumberWithCommas(e?.OtherCharges / json0Data?.CurrencyExchRate, 2)}` : "";
   
//                     // let lossAmt = ind === 0 ? NumberWithCommas((e?.LossAmt * metalrateCopy) / json0Data?.CurrencyExchRate, 2) : "";
//                     let lossAmt = ind === 0 ? NumberWithCommas((e?.LossWt * metalrateCopy) / json0Data?.CurrencyExchRate, 2) : "";
//                     // LossWt
//                     let LossWt = ind === 0 ? NumberWithCommas(e?.LossWt, 3) : "";
//                     let metalAmount = ind === 0 ? NumberWithCommas(e?.MetalAmount / json0Data?.CurrencyExchRate, 2) : "";
//                     let makingAmount = ind === 0 ? NumberWithCommas(e?.MakingAmount / json0Data?.CurrencyExchRate, 2) : "";
//                     let totalAmount = ind === 0 ? NumberWithCommas(e?.TotalAmount / json0Data?.CurrencyExchRate, 2) : "";
//                     let qty = ind === 0 ? 1 : "";
//                     let subCategory = ind === 0 ? "OPEN SETTING" : "";
//                     let rateType = ind === 0 ? "GMS" : "";
//                     let certifiedby = ind === 0 ? "IGI" : "";

//                     let srJobno = ind === 0 ? e?.SrJobno : "";
//                     let designno = ind === 0 ? e?.designno : "";
//                     let InvoiceNo = ind === 0 ? json0Data?.InvoiceNo : "";
//                     let EntryDate = ind === 0 ? json0Data?.EntryDate : "";
//                     let GEN = ind === 0 ? "GEN" : "";
//                     let VENDOR = ind === 0 ? 'V-101-GJ-SRT-CO447' : "";
//                     let INR = ind === 0 ? 'INR' : "";
//                     let STOCK_LOCATION = ind === 0 ? 'CORPORATE OFFICE' : "";
//                     let DEPARTMENT = ind === 0 ? '101-81' : "";
//                     let Size = ind === 0 ? e?.Size : "";
//                     let HUID = ind === 0 ? e?.HUID : "";
//                     let lineid = ind === 0 ? e?.lineid : "";
//                     let DueDays = ind === 0 ? json0Data?.DueDays : "";
//                     let certificateNo = ind === 0 ? e?.CertificateNo : "";


//                     let diamondTotalAmount = ind === 0 ? NumberWithCommas(e?.DiamondAmount / json0Data?.CurrencyExchRate, 2) : "";
//                     let metalPurity = ind === 0 ? e?.MetalPurity : "";
//                     let metalColor = ind === 0 ? e?.MetalColor : "";
//                     let grosswt = ind === 0 ? NumberWithCommas(e?.grosswt, 3) : "";
//                     let NetWt = ind === 0 ? NumberWithCommas(e?.NetWt, 3) : "";

//                     // let makeObj = createObj(srJobno, "", designno, "", InvoiceNo, EntryDate, "", categoryname, subCategory, "", "", "",
//                     //     diamondQualityname, diamondColorName, diamondGroupname, "", diamondShapename, diamondPcs, diamondWt, diamondRate,
//                     //     diamondAmount, diamondTotalAmount, stoneShape, stonePcs, stoneWt, stoneRate, stoneAmount, "", grosswt, NetWt,
//                     //     LossWt, metalPurity, metalColor, rateType, metalRate, goldValue, lossAmt, metalAmount, makingAmount, totalAmount,
//                     //     "", "", "", "", "", "", "", "", certification, certifiedby, certificateNo, Size,  lineid, DueDays, GEN, 
//                     //     VENDOR, INR, STOCK_LOCATION, DEPARTMENT, HUID);
//                     let makeObj = createObj(srJobno, '', '', '',InvoiceNo, EntryDate, '','', '', Size, designno, '', 
//                     diamondQualityname,diamondColorName, HUID, certificateNo, lineid, GEN, VENDOR, INR, STOCK_LOCATION, DEPARTMENT, DueDays, '', '', '');
//                     blankArr.push(makeObj);
//                 });
//             }
//         });
//         // ExportToExcel(blankArr, data?.BillPrint_Json[0]?.InvoiceNo);
//         // exportToExcel(blankArr, `Packing_List_KM_${data?.BillPrint_Json[0]?.InvoiceNo}_${Date.now()}`)
//     }

//     // const createObj = (srJobno, discription, designno, CompanyFullName, InvoiceNo, EntryDate, Type, Categoryname, SubCategory, Size, Country, DiaDiv, diamondQualityname,
//     //     diamondColorName, diamondGroupname, Sieve, diamondShapename, diamondPcs, diamondWt, diamondRate, diamond_Amount, diamondAmount, stoneShape,
//     //     stonePcs, stoneWt, stoneRate, stoneAmount, MetalDivision, grosswt, NetWt, LossWt, metalPurity, metalColor, rateType, metalRate, goldValue,
//     //     LossAmt, MetalAmount, MakingAmount, TotalAmount, TagPrice1, TagPrice2, tagline1, tagline2, tagline3, tagline4, tagline5, costCode, certification, certifiedby,
//     //     CertificateNo, lineid, DueDays, GEN, VENDOR, INR, STOCK_LOCATION, DEPARTMENT, HUID) => {
//     const createObj = ( srJobno ,SR_NO, ROW_NO, REF_DOC_NO, invoiceNo, EntryDate, Type,ITEM_NAME, VARIANT_NAME, Size, designno, DiaDiv, 
//             diamondQualityname, diamondColorName, HUID, certificateNo, lineid, GEN, VENDOR, INR, STOCK_LOCATION, DEPARTMENT, DueDays, DOC_NO, REF_TRANS_ITEM_ID, REF_TRANS_ITEM_BOM_ID) => {

//         let obj = {
//             "Column1": srJobno,
//             "SR_NO": '',
//             "ROW_NO": '',
//             "REF_DOC_NO": '',
//             "PO_NO": invoiceNo,
//             "PO_DATE": EntryDate,
//             "ITEM_GROUP": Type,
//             "ITEM_NAME": '',
//             "VARIANT_NAME": '',
//             "STYLE_SIZE": Size,
//             "OLD_VARIANT_NAME": designno,
//             "PIECES": DiaDiv,
//             "WEIGHT": diamondQualityname,
//             "RATE": diamondColorName,
//             "HUID": HUID,
//             "CERTIFICATE": certificateNo,
//             "LINE_NO": lineid,
//             "TRANS_CATEGORY": GEN,
//             "VENDOR": VENDOR,
//             "CURRENCY": INR,
//             "STOCK_LOCATION": STOCK_LOCATION,
//             "DEPARTMENT": DEPARTMENT,
//             "TERMS": DueDays,
//             "DOC_NO": '',
//             "REF_TRANS_ITEM_ID": '',
//             "REF_TRANS_ITEM_BOM_ID": '',

//             // "Stone Value": stoneAmount,
//             // "Metal Division": MetalDivision,
//             // "GROSS WT": grosswt,
//             // "NET WT/GOLD WT": NetWt,
//             // "gold loss wt": LossWt,
//             // "Karat": metalPurity,
//             // "Gold Colour": metalColor,
//             // "Rate Type": rateType,
//             // "Rate": metalRate,
//             // "Gold Value": goldValue,
//             // "Gold Loss Value": LossAmt,
//             // "Total Gold Value": MetalAmount,
//             // "MAKING": MakingAmount,
//             // "Cost": TotalAmount,
//             // "Tag Price 1": TagPrice1,
//             // "Tag Price 2": TagPrice2,
//             // "tagline1": tagline1,
//             // "tagline2": tagline2,
//             // "tagline3": tagline3,
//             // "tagline4": tagline4,
//             // "tagline5": tagline5,
//             // "Cost Code": costCode,
//             // "CERTIFICATION": certification,
//             // "CERTIFIED BY": certifiedby,
//             // "CERTIFICATE NUMBER": CertificateNo
//         }
//         return obj;
//     }


//     useEffect(() => {
//         const sendData = async () => {
//             try {
//                 const data = await apiCall(token, invoiceNo, printName, urls, evn, ApiVer);
//                 if (data?.Status === '200') {
//                     let isEmpty = isObjectEmpty(data?.Data);
//                     if (!isEmpty) {
//                         loadData(data?.Data);
//                         setLoader(false);
//                     } else {
//                         setLoader(false);
//                         setMsg("Data Not Found");
//                     }
//                 } else {
//                     setLoader(false);
//                     setMsg(data?.Message);
//                 }
//             } catch (error) {
//                 console.error(error);
//             }
//         }
//         sendData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);


//     return (
//         <>{loader ? <Loader /> : msg === "" ?
//             "" : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>}</>
//     )
// }

// export default PackingListJsonToExcel