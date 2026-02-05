import React, { useEffect, useState } from 'react'
import { apiCall, checkMsg, formatAmount, handleGlobalImgError, isObjectEmpty } from '../../GlobalFunctions';
import { cloneDeep } from 'lodash';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import Loader from '../../components/Loader';
import  ReactHTMLTableToExcel  from 'react-html-table-to-excel';

const ColorIndia = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {

    const [result, setResult] = useState(null);
    const [result2, setResult2] = useState(null);
    const [msg, setMsg] = useState("");
    const [loader, setLoader] = useState(true);
    const [mainTotal, setMainTotal] = useState(null);

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
            console.log(error);
          }
        }
        sendData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadData = (data) => {
        const copydata = cloneDeep(data);

        let address = copydata?.BillPrint_Json[0]?.Printlable?.split("\r\n");
        copydata.BillPrint_Json[0].address = address;
    
        const datas = OrganizeDataPrint(
          copydata?.BillPrint_Json[0],
          copydata?.BillPrint_Json1,
          copydata?.BillPrint_Json2
        );

        datas?.resultArray?.forEach((a) => {
          let dia = [];
          a?.diamonds?.forEach((el) => {
            let findrec = dia?.findIndex((e) => e?.ShapeName === el?.ShapeName && e?.QualityName === el?.QualityName && e?.Colorname === el?.Colorname)
            if(findrec === -1){
              dia.push(el);
            }else{
              dia[findrec].Wt += el?.Wt;
              dia[findrec].Pcs += el?.Pcs;
              dia[findrec].Amount += el?.Amount;
            }
          })

          a.diamonds = dia;

          let clr = [];
          a?.colorstone?.forEach((el) => {
            let findrec = clr?.findIndex((e) => e?.ShapeName === el?.ShapeName && e?.QualityName === el?.QualityName && e?.Colorname === el?.Colorname && e?.isRateOnPcs === el?.isRateOnPcs)
            if(findrec === -1){
              clr.push(el);
            }else{
              clr[findrec].Wt += el?.Wt;
              clr[findrec].Pcs += el?.Pcs;
              clr[findrec].Amount += el?.Amount;
            }
          })

          a.colorstone = clr;

          // let miscs = [];
          // a?.misc?.forEach((el) => {
          //   let findrec = miscs?.findIndex((e) => e?.ShapeName === el?.ShapeName && e?.QualityName === el?.QualityName && e?.Colorname === el?.Colorname && e?.isRateOnPcs === el?.isRateOnPcs)
          //   if(findrec === -1){
          //     miscs.push(el);
          //   }else{
          //     miscs[findrec].Wt += el?.Wt;
          //     miscs[findrec].Pcs += el?.Pcs;
          //     miscs[findrec].Amount += el?.Amount;
          //   }
          // })

          // a.misc = miscs;

        })

        


        let finalArr = [];

        datas?.resultArray?.forEach((e, i) => {
            let arr = [];
            let len = 7;
            if(e?.diamonds?.length > e?.colorstone?.length){
                        if(e?.diamonds?.length > 7){
                            len = e?.diamonds?.length;
                        }
                    }else if(e?.diamonds?.length < e?.colorstone?.length){
                            if(e?.colorstone?.length > 7){
                            len = e?.colorstone?.length;
                        }
                    }
            let obj = {};
            obj.sr = i+1;
            obj.srflag = true;
            obj.srRowSpan = len;
            // obj.designImage = e?.DesignImage;
            obj.designno = e?.designno;
            obj.MetalPurity = e?.MetalPurity;
            obj.color = e?.MetalColor;
            obj.quantity = e?.Quantity;
            obj.grosswt = e?.grosswt;
            obj.netwt = (e?.NetWt + e?.LossWt);
            obj.metal_rate = (e?.metal_rate);
            obj.dia_Code = e?.diamonds[0]?.ShapeName;
            obj.dia_Pcs = e?.diamonds[0]?.Pcs;
            obj.dia_Cts = e?.diamonds[0]?.Wt;
            obj.dia_rate = e?.diamonds[0]?.Rate;
            obj.cls_Code = e?.colorstone[0]?.ShapeName;
            obj.cls_Pcs = e?.colorstone[0]?.Pcs;
            obj.cls_Cts = e?.colorstone[0]?.Wt;
            obj.cls_rate = e?.colorstone[0]?.Rate;
            obj.finalvalue = e?.TotalAmount;

            Array?.from({length : len})?.map((el, ind) => { 

                let obj = {};
          
                    obj.srflag = false
                    obj.img = e?.DesignImage;
                    obj.imgflag = false;
                    if(ind === 0){
                        obj.imgflag = true;
                    }

                    if(e?.diamonds[ind + 1]){

                        obj.diaflag = true;
                        obj.dia_Code = e?.diamonds[ind + 1]?.ShapeName;
                        obj.dia_Pcs = e?.diamonds[ind + 1]?.Pcs;
                        obj.dia_Cts = e?.diamonds[ind + 1]?.Wt;    
                        obj.dia_rate = e?.diamonds[ind + 1]?.Rate;    

                    }
                    if(e?.colorstone[ind + 1]){

                        obj.clsflag = true;
                        obj.cls_Code = e?.colorstone[ind + 1]?.ShapeName;
                        obj.cls_Pcs = e?.colorstone[ind + 1]?.Pcs;
                        obj.cls_Cts = e?.colorstone[ind + 1]?.Wt;    
                        obj.cls_rate = e?.colorstone[ind + 1]?.Rate;    

                    }
                    
                    
                    arr.push(obj);
                })

                obj.matrialArr = arr;

            finalArr.push(obj);

        })

        // datas?.resultArray?.forEach((e, i) => {

        //     let arr = [];
        //     let len = 7;
        //     if(e?.diamonds?.length > e?.colorstone?.length){
        //         if(e?.diamonds?.length > 7){
        //             len = e?.diamonds?.length;
        //         }
        //     }else if(e?.diamonds?.length < e?.colorstone?.length){
        //             if(e?.colorstone?.length > 7){
        //             len = e?.colorstone?.length;
        //         }
        //     }

        //     let findMetal = e?.metal?.find((ele, ind) => ele?.IsPrimaryMetal === 1)
        //     let obj = {};
        //     obj.sr = i+1;
        //     obj.srflag = true;
        //     obj.srRowSpan = len;
        //     obj.SrJobno = `${e?.SrJobno}`;
        //     obj.designno = e?.designno;
        //     obj.grosswt= e?.grosswt;
        //     obj.Categoryname= e?.Categoryname;
        //     obj.NetWt= e?.NetWt + e?.LossWt;
        //     obj.metal_rate = e?.metal_rate;
        //     obj.Size = e?.Size;
        //     obj.lineid = e?.lineid;
        //     obj.diamond_Amt = e?.totals?.diamonds?.Amount;
        //     // obj.diaShp = e?.diamonds[0]?.ShapeName;
        //     // obj.diaQly = e?.diamonds[0]?.QualityName;

        //     obj.diaQly2 =   '';
        //     obj.dia_rnd_pcs =   '';
        //     obj.dia_rnd_wt =   '';
        //     obj.dia_bug_pcs =   '';
        //     obj.dia_bug_wt =   '';
        //     obj.dia_prs_pcs =   '';
        //     obj.dia_prs_wt =   '';

        //     // obj.dia_code = e?.diamonds[0] ? (e?.diamonds[0]?.ShapeName + " " + e?.diamonds[0]?.QualityName + " " + e?.diamonds[0]?.Colorname) : '';
        //     // obj.dia_size = e?.diamonds[0] ? e?.diamonds[0]?.SizeName : '';
        //     // obj.dia_pcs = e?.diamonds[0] ? e?.diamonds[0]?.Pcs : '';
        //     // obj.dia_wt = e?.diamonds[0] ? (+((e?.diamonds[0]?.Wt)?.toFixed(3))) : '';
        //     // // obj.dia_rate = e?.diamonds[0] ? (Math.round(((e?.diamonds[0]?.Amount / result?.header?.CurrencyExchRate) / (e?.diamonds[0]?.Wt === 0 ? 1 : e?.diamonds[0]?.Wt)))) : '';
        //     // obj.dia_rate = e?.diamonds[0] ? (Math.round(((e?.diamonds[0]?.Amount / datas?.header?.CurrencyExchRate) / (e?.diamonds[0]?.Wt === 0 ? 1 : e?.diamonds[0]?.Wt)))) : '';
        //     // obj.dia_amt = e?.diamonds[0] ? (e?.diamonds[0]?.Amount) : '';


        //     obj.met_quality = '';
        //     obj.met_wt = 0;
        //     obj.met_rate = 0;
        //     obj.met_amt = 0;
            
        //         obj.met_wt = e?.NetWt;
        //         // obj.met_rate = findMetal ? (Math.round(((findMetal?.Amount / datas?.header?.CurrencyExchRate)) / e?.NetWt)) : '';
        //         obj.met_rate = findMetal ? (Math.round((findMetal?.Rate) )) : '';
        //         obj.met_amt = findMetal ? (formatAmount(findMetal?.Amount)) : '';
        //         obj.met_quality = findMetal ? (findMetal?.ShapeName + " " + findMetal?.QualityName) : '';
            

            
        //     // obj.cls_code = e?.colorstone[0] ? (e?.colorstone[0]?.ShapeName + " " + e?.colorstone[0]?.QualityName + " " + e?.colorstone[0]?.Colorname) : '';
        //     // obj.cls_size = e?.colorstone[0] ? (e?.colorstone[0]?.SizeName) : '';
        //     // obj.cls_pcs = e?.colorstone[0] ? (e?.colorstone[0]?.Pcs) : '';
        //     // obj.cls_wt = e?.colorstone[0] ? ((e?.colorstone[0]?.Wt)?.toFixed(3)) : '';
        //     // // obj.cls_rate = e?.colorstone[0] ? (Math.round(((e?.colorstone[0]?.Amount / result?.header?.CurrencyExchRate)) / ( e?.colorstone[0]?.isRateOnPcs === 1 ? (e?.colorstone[0]?.Pcs === 0 ? 1 : e?.colorstone[0]?.Pcs) :  (e?.colorstone[0]?.Wt === 0 ? 1 : e?.colorstone[0]?.Wt)))) : '';
        //     // obj.cls_rate = e?.colorstone[0] ? (Math.round(((e?.colorstone[0]?.Amount / datas?.header?.CurrencyExchRate)) / ( e?.colorstone[0]?.isRateOnPcs === 1 ? (e?.colorstone[0]?.Pcs === 0 ? 1 : e?.colorstone[0]?.Pcs) :  (e?.colorstone[0]?.Wt === 0 ? 1 : e?.colorstone[0]?.Wt)))) : '';
        //     // obj.cls_amt = e?.colorstone[0] ? (formatAmount(e?.colorstone[0]?.Amount)) : '';


        //     obj.oth_amt = ( e?.OtherCharges + e?.TotalDiamondHandling + e?.MiscAmount);
        //     obj.labour_rate = e?.MaKingCharge_Unit;
        //     obj.labour_amt = (e?.MakingAmount + e?.totals?.diamonds?.SettingAmount + e?.totals?.colorstone?.SettingAmount);
        //     obj.total_amount = e?.TotalAmount;
            
         
        //     Array?.from({length : len})?.map((el, ind) => {
        //         let obj = {};
          
        //         obj.srflag = false
        //         obj.img = e?.DesignImage;
        //         obj.imgflag = false;
        //         if(ind === 0){
        //             obj.imgflag = true;
        //         }
        //         obj.tunch = ((e?.Tunch)?.toFixed(3));
        //         obj.tunchflag = false;
        //         if(ind === 4){
        //             obj.tunchflag = false;
        //         }

        //         obj.grosswt = ((e?.grosswt)?.toFixed(3));
        //         obj.grosswetflag = false;
        //         if(ind === 5){
        //             obj.grosswetflag = false;
        //         }

        //         //diamond
        //         // obj.dia_code = '';
        //         // obj.dia_size = '';
        //         // obj.dia_pcs = 0;
        //         // obj.dia_wt = 0;
        //         // obj.dia_rate = 0;
        //         // obj.dia_amt = 0;
        //         // obj.diaflag = false;
        //         // if(e?.diamonds[ind+1]){
        //         //     obj.diaflag = true;
        //         //     obj.diaShp = e?.diamonds[ind + 1]?.ShapeName;
        //         //     obj.diaQly = e?.diamonds[ind + 1]?.QualityName;
        //         //     obj.dia_code = (e?.diamonds[ind + 1]?.ShapeName + " " + e?.diamonds[ind + 1]?.QualityName + " " + e?.diamonds[ind + 1]?.Colorname);
        //         //     obj.dia_size = e?.diamonds[ind + 1]?.SizeName;
        //         //     obj.dia_pcs = e?.diamonds[ind + 1]?.Pcs;
        //         //     obj.dia_wt = ((e?.diamonds[ind + 1]?.Wt)?.toFixed(3));
        //         //     // obj.dia_rate = (Math.round((e?.diamonds[ind + 1]?.Amount / result?.header?.CurrencyExchRate) / (e?.diamonds[ind + 1]?.Wt === 0 ? 1 : e?.diamonds[ind + 1]?.Wt)));
        //         //     obj.dia_rate = (Math.round((e?.diamonds[ind + 1]?.Amount / datas?.header?.CurrencyExchRate) / (e?.diamonds[ind + 1]?.Wt === 0 ? 1 : e?.diamonds[ind + 1]?.Wt)));
        //         //     obj.dia_amt = (formatAmount(e?.diamonds[ind + 1]?.Amount));

                

        //         // }

        //         //dia_qyl
        //         obj.diaQly2 = '';
        //         obj.dia_prs_pcs = 0;
        //         obj.dia_prs_wt = 0;
        //         obj.dia_bug_pcs = 0;
        //         obj.dia_bug_wt = 0;
        //         obj.dia_rnd_pcs = 0;
        //         obj.dia_rnd_wt = 0;

        //         if(e?.diamonds_qly[ind+1]){
        //           obj.diaflag = true;
        //           obj.diaQly2 = e?.diamonds_qly[ind+1]?.D_QUL;
        //           obj.dia_rnd_pcs = e?.diamonds_qly[ind+1]?.D_RND_PCS;
        //           obj.dia_rnd_wt = e?.diamonds_qly[ind+1]?.D_RND_WT;
        //           obj.dia_bug_pcs = e?.diamonds_qly[ind+1]?.D_BUG_PCS;
        //           obj.dia_bug_wt = e?.diamonds_qly[ind+1]?.D_BUG_WT;
        //           obj.dia_prs_pcs = e?.diamonds_qly[ind+1]?.D_PRS_PCS;
        //           obj.dia_prs_wt = e?.diamonds_qly[ind+1]?.D_PRS_WT;
        //         }


        //         // colorstone
        //         obj.cls_code = '';
        //         obj.cls_size = '';
        //         obj.cls_pcs = 0;
        //         obj.cls_wt = 0;
        //         obj.cls_rate = 0;
        //         obj.cls_amt = 0;
        //         obj.clsflag = false;
        //         // if(e?.colorstone[ind+1]){
        //         //     obj.clsflag = true;
        //         //     obj.cls_code = e?.colorstone[ind + 1]?.ShapeName + " " + e?.colorstone[ind + 1]?.QualityName + " " + e?.colorstone[ind + 1]?.Colorname;
        //         //     obj.cls_size = e?.colorstone[ind + 1]?.SizeName;
        //         //     obj.cls_pcs = e?.colorstone[ind + 1]?.Pcs;
        //         //     obj.cls_wt = ((e?.colorstone[ind + 1]?.Wt)?.toFixed(3));
        //         //     // obj.cls_rate = (Math.round(((e?.colorstone[ind + 1]?.Amount / result?.header?.CurrencyExchRate)) / (e?.colorstone[ind + 1]?.Wt === 0 ? 1 : e?.colorstone[ind + 1]?.Wt)));
        //         //     obj.cls_rate = (Math.round(((e?.colorstone[ind + 1]?.Amount / datas?.header?.CurrencyExchRate)) / (e?.colorstone[ind + 1]?.Wt === 0 ? 1 : e?.colorstone[ind + 1]?.Wt)));
        //         //     obj.cls_amt = (formatAmount(e?.colorstone[ind + 1]?.Amount));
        //         // }

        //         obj.JobRemark = e?.JobRemark;
        //         obj.jobRemarkflag = false;
        //         if(ind === 1 && e?.JobRemark !== ''){
        //             obj.jobRemarkflag = false;
        //         }

        //         arr.push(obj);

        //     })

        //     obj.matrialArr = arr;
        //     obj.values = e;

        //     finalArr.push(obj);
        // })
        setResult2(finalArr);
        setResult(datas);

        setTimeout(() => {
            const button = document.getElementById('test-table-xls-button');
            button.click();
          }, 500);

    }
console.log(result, result2);
  return (
    <>
    {
        loader ? <Loader /> : <>
        {
            msg === '' ? <>
            <div style={{paddingBottom:'5rem'}}>
                <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="download-table-xls-button btn btn-success text-black bg-success px-2 py-1 fs-5 d-none"
                    table="table-to-xls"
                    filename={`Packing_List_2_${result?.header?.InvoiceNo}_${Date.now()}`}
                    sheet="tablexls"
                    buttonText="Download as XLS"
                 />
                <table id='table-to-xls'>
                    <tbody>
                        

                        {/* table */}
                        <tr>
                            <th style={{borderLeft:'0.5px solid black', borderBottom:'0.5px solid black', borderRight:'0.5px solid black',  borderTop:'0.5px solid black', fontSize:'20px'}} align='center' >TO.</th>
                            <th style={{borderBottom:'0.5px solid black', borderRight:'0.5px solid black',   borderTop:'0.5px solid black', fontSize:'20px'}} colSpan={4} align='center'  >{result?.header?.customerfirmname}</th>
                            <th style={{borderBottom:'0.5px solid black', borderRight:'0.5px solid black',   borderTop:'0.5px solid black', fontSize:'20px'}} align='center' colSpan={12}>PACKING LIST</th>
                            <th style={{borderBottom:'0.5px solid black', borderRight:'0.5px solid black',   borderTop:'0.5px solid black', fontSize:'20px'}} align='center'  colSpan={2}>{result?.header?.EntryDate}</th>
                        </tr>
                        <tr>
                            <th style={{borderBottom:'0.5px solid black', borderRight:'0.5px solid black',  }}  rowSpan={2} >#</th>
                            <th style={{borderBottom:'0.5px solid black', borderRight:'0.5px solid black',  }}  rowSpan={2} colSpan={2} >IMAGE</th>
                            <th style={{borderBottom:'0.5px solid black', borderRight:'0.5px solid black',  }}  rowSpan={2} >DESIGN NO.</th>
                            <th style={{borderBottom:'0.5px solid black', borderRight:'0.5px solid black',  }}  rowSpan={2} >GOLD KT</th>
                            <th style={{borderBottom:'0.5px solid black', borderRight:'0.5px solid black',  }}  rowSpan={2} >COLOR</th>
                            <th style={{borderBottom:'0.5px solid black', borderRight:'0.5px solid black',  }}  rowSpan={2} >QTY</th>
                            <th style={{borderBottom:'0.5px solid black', borderRight:'0.5px solid black',  }}   align='center' colSpan={3} >GOLD DETAILS :-</th>
                            <th style={{borderBottom:'0.5px solid black', borderRight:'0.5px solid black',  }}   colSpan={4} >DIAMOND DETAILS : -</th>
                            <th style={{borderBottom:'0.5px solid black', borderRight:'0.5px solid black',  }}   colSpan={4} >GEM STONE DETAILS : -</th>
                            <th style={{borderBottom:'0.5px solid black', borderRight:'0.5px solid black',  }} rowSpan={2}>FINAL VALUE</th>
                        </tr>
                        <tr>
                            <th style={{borderBottom:'0.5px solid black', borderRight:'0.5px solid black', }} colSpan={1} align='center'>GROSS WEIGHT</th>
                            <th style={{borderBottom:'0.5px solid black', borderRight:'0.5px solid black',  }} colSpan={1} align='center'>NET WEIGHT</th>
                            <th style={{borderBottom:'0.5px solid black', borderRight:'0.5px solid black',  }} colSpan={1} align='center'>METAL RATE</th>
                            <th style={{ borderRight:'0.5px solid black',borderBottom:'0.5px solid black',  }}>TYPE</th>
                            <th style={{ borderRight:'0.5px solid black',borderBottom:'0.5px solid black',  }}>PCS</th>
                            <th style={{ borderRight:'0.5px solid black',borderBottom:'0.5px solid black',  }}>CTS</th>
                            <th style={{ borderRight:'0.5px solid black',borderBottom:'0.5px solid black',  }}>RATE</th>
                            <th style={{ borderRight:'0.5px solid black',borderBottom:'0.5px solid black',  }}>CS</th>
                            <th style={{ borderRight:'0.5px solid black',borderBottom:'0.5px solid black',  }}>PCS</th>
                            <th style={{ borderRight:'0.5px solid black',borderBottom:'0.5px solid black',  }}>CTS</th>
                            <th style={{ borderRight:'0.5px solid black',borderBottom:'0.5px solid black',  }}>RATE</th>
                        </tr>
                        {
                            result2?.map((e, i) => {
                                return (<React.Fragment key={i}>
                                    <tr>
                                        { e?.srflag && <td style={{borderRight:'0.5px solid black', borderBottom:'0.5px solid black', verticalAlign:'middle'}} rowSpan={e?.srRowSpan + 1} align='center'>{e?.sr}</td>}
                                        <td width={1} style={{verticalAlign:'middle'}}></td>
                                        {<td width={150} colSpan={1}  align='center' style={{borderRight:'0.5px solid black', wordBreak:'break-word', paddingRight:'5px', borderTop:'0.5px solid black'}} >&nbsp;{e?.designImage}&nbsp;</td>}
                                        { e?.srflag && <td style={{borderRight:'0.5px solid black', borderBottom:'0.5px solid black', verticalAlign:'middle'}} rowSpan={e?.srRowSpan + 1} align='center'>{e?.designno}</td> }
                                        { e?.srflag && <td style={{borderRight:'0.5px solid black', borderBottom:'0.5px solid black', verticalAlign:'middle'}} rowSpan={e?.srRowSpan + 1} align='center'>{e?.MetalPurity}</td>}
                                        { e?.srflag && <td style={{borderRight:'0.5px solid black', borderBottom:'0.5px solid black', verticalAlign:'middle'}} rowSpan={e?.srRowSpan + 1} align='center'>{e?.color}</td>}
                                        { e?.srflag &&<td style={{borderRight:'0.5px solid black', borderBottom:'0.5px solid black', verticalAlign:'middle'}} rowSpan={e?.srRowSpan + 1} align='right'>{e?.quantity}</td> }
                                        { e?.srflag && <td style={{borderRight:'0.5px solid black', borderBottom:'0.5px solid black', verticalAlign:'middle'}} rowSpan={e?.srRowSpan + 1} align='right'>{e?.grosswt}</td>}
                                        { e?.srflag && <td style={{borderRight:'0.5px solid black', borderBottom:'0.5px solid black', verticalAlign:'middle'}} rowSpan={e?.srRowSpan + 1} align='right'>{e?.netwt}</td>}
                                        { e?.srflag && <td style={{borderRight:'0.5px solid black', borderBottom:'0.5px solid black', verticalAlign:'middle'}} rowSpan={e?.srRowSpan + 1} align='right'>{e?.metal_rate}</td>}
                                        { e?.srflag && <td style={{borderTop:'0.5px solid black'}} align='left' width={90}>{e?.dia_Code}</td>}
                                        { e?.srflag && <td style={{borderTop:'0.5px solid black'}} align='right' width={50}>{e?.dia_Pcs}</td>}
                                        { e?.srflag && <td style={{borderTop:'0.5px solid black'}} align='right' width={50}>{e?.dia_Cts}</td>}
                                        { e?.srflag && <td style={{borderTop:'0.5px solid black', borderRight:'0.5px solid black'}} align='right' width={50}>{e?.dia_rate}</td>}
                                        { e?.srflag && <td style={{borderTop:'0.5px solid black'}} align='left' width={90}>{e?.cls_Code}</td>}
                                        { e?.srflag && <td style={{borderTop:'0.5px solid black'}} align='right' width={50}>{e?.cls_Pcs}</td>}
                                        { e?.srflag && <td style={{borderTop:'0.5px solid black'}} align='right' width={50}>{e?.cls_Cts}</td>}
                                        { e?.srflag && <td style={{borderRight:'0.5px solid black', borderTop:'0.5px solid black'}} align='right' width={50}>{e?.cls_rate}</td>}
                                        { e?.srflag && <td style={{borderRight:'0.5px solid black', borderBottom:'0.5px solid black', verticalAlign:'middle'}} rowSpan={e?.srRowSpan + 1} align='right'>{e?.finalvalue}</td>}
                                    </tr>
                                    {
                                        e?.matrialArr?.map((el, ind) => {
                                            return <tr key={ind}>
                                                <td width={1}></td>
                                                <td colSpan={1} style={{borderRight:'0.5px solid black', verticalAlign:'middle'}}  
                                                align='center'>&nbsp;
                                                    <span style={{textAlign:'center'}}>{el?.imgflag && <img src={el?.img} alt=""
                                                      onError={eve => handleGlobalImgError(eve, result?.header?.DefImage)} width={140} height={130}
                                                    style={{ paddingLeft: "10px", objectFit: "contain", verticalAlign:'center' }} />}</span>&nbsp;
                                                </td>
                                                <td align='left' width={90}>{ el?.diaflag && el?.dia_Code}</td>
                                                <td align='right' width={50}>{ el?.diaflag && el?.dia_Pcs}</td>
                                                <td align='right' width={50}>{ el?.diaflag && el?.dia_Cts}</td>
                                                <td style={{borderRight:'0.5px solid black'}} align='right' width={50}>{ el?.diaflag && el?.dia_rate}</td>
                                                <td align='left' width={90}>{ el?.clsflag && el?.cls_Code}</td>
                                                <td align='right' width={50}>{ el?.clsflag && el?.cls_Pcs}</td>
                                                <td align='right' width={50}>{ el?.clsflag && el?.cls_Cts}</td>
                                                <td style={{borderRight:'0.5px solid black'}} align='right' width={50}>{ el?.clsflag && el?.cls_rate}</td>
                                            </tr>
                                        })
                                    }
                                    </React.Fragment>
                                )
                            })
                        }
        
                        {/* main total */}
                        <tr>
                                <td align='center' style={{borderRight:'0.5px solid black', borderBottom:'0.5px solid black', borderTop:'0.5px solid black', borderLeft:'0.5px solid black'}} colSpan={6} >TOTAL</td>
                                <td colSpan={1} style={{borderRight:'0.5px solid black', borderBottom:'0.5px solid black'}}>{result?.mainTotal?.total_Quantity}</td>
                                <td colSpan={1}  style={{borderRight:'0.5px solid black', borderBottom:'0.5px solid black'}}>{result?.mainTotal?.grosswt}</td>
                                <td  style={{borderRight:'0.5px solid black', borderBottom:'0.5px solid black'}}>{(result?.mainTotal?.netwt + result?.mainTotal?.lossWt)}</td>
                                <td  style={{borderRight:'0.5px solid black', borderBottom:'0.5px solid black'}}></td>
                                <td style={{borderRight:'0.5px solid black', borderBottom:'0.5px solid black', borderTop:'0.5px solid black'}}></td>
                                <td style={{borderRight:'0.5px solid black', borderBottom:'0.5px solid black', borderTop:'0.5px solid black'}}>{result?.mainTotal?.diamonds?.Pcs}</td>
                                <td style={{borderBottom:'0.5px solid black', borderTop:'0.5px solid black'}}>{result?.mainTotal?.diamonds?.Wt}</td>
                                <td style={{borderRight:'0.5px solid black', borderBottom:'0.5px solid black', borderTop:'0.5px solid black'}}></td>
                                <td style={{borderRight:'0.5px solid black', borderBottom:'0.5px solid black', borderTop:'0.5px solid black'}}></td>
                                <td style={{borderRight:'0.5px solid black', borderBottom:'0.5px solid black',borderTop:'0.5px solid black'}}>{result?.mainTotal?.colorstone?.Pcs}</td>
                                <td style={{borderBottom:'0.5px solid black', borderTop:'0.5px solid black'}}>{result?.mainTotal?.colorstone?.Wt}</td>
                                <td style={{borderRight:'0.5px solid black', borderBottom:'0.5px solid black', borderTop:'0.5px solid black'}}></td>
                                <td  style={{borderRight:'0.5px solid black', borderBottom:'0.5px solid black'}}>{result?.mainTotal?.total_amount}</td>
                        </tr>
                        <tr>
                          <td colSpan={15} style={{borderRight:'0.5px solid black'}}></td>
                          <td align='center' colSpan={3} style={{borderRight:'0.5px solid black', borderBottom:'0.5px solid black'}}> TOTAL AMOUNT : -</td>
                          <td align='right' colSpan={1} style={{borderRight:'0.5px solid black', borderBottom:'0.5px solid black'}}>{result?.mainTotal?.total_amount}</td>
                        </tr>
                    </tbody>
                </table> 
            </div>
            </> : <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
            {msg}
          </p>
        }
        </>
    }
    </>
  )
}

export default ColorIndia