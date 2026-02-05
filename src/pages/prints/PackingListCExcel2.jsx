import React, { useEffect, useState } from 'react'
import { apiCall, checkMsg, formatAmount, handleGlobalImgError, isObjectEmpty } from '../../GlobalFunctions';
import Loader from '../../components/Loader';
import  ReactHTMLTableToExcel  from 'react-html-table-to-excel';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import { cloneDeep } from 'lodash';
import { deepClone } from '@mui/x-data-grid/utils/utils';

const TaxInvoiceExcel = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
    const [result, setResult] = useState(null);
    const [result2, setResult2] = useState(null);
    const [result3, setResult3] = useState(null);
    const [diamondWise, setDiamondWise] = useState([]);
    const [rowWise, setRowWise] = useState([]);
    const [msg, setMsg] = useState("");
    const [loader, setLoader] = useState(true);
    const [isImageWorking, setIsImageWorking] = useState(true);
    const [mainTotal, setMainTotal] = useState(null);
    const handleImageErrors = () => {
      setIsImageWorking(false);
    };

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
          
        let diaObj = {
            ShapeName: "OTHERS",
            wtWt: 0,
            wtWts: 0,
            pcPcs: 0,
            pcPcss: 0,
            rRate: 0,
            rRates: 0,
            amtAmount: 0,
            amtAmounts: 0,
            QualityName:'',
            Colorname:''
          };
      
          // let diaonlyrndarr1 = [];
          // let diaonlyrndarr2 = [];
          // let diaonlyrndarr3 = [];
          // let diaonlyrndarr4 = [];
          // let diarndotherarr5 = [];
          // let diaonlyrndarr6 = [];
          // datas?.json2?.forEach((e) => {
          //   if (e?.MasterManagement_DiamondStoneTypeid === 1) {
          //     if (e.ShapeName?.toLowerCase() === "rnd") {
          //       diaonlyrndarr1.push(e);
          //     } else {
          //       diaonlyrndarr2.push(e);
          //     }
          //   }
          // });
      
          // diaonlyrndarr1.forEach((e) => {
          //   let findRecord = diaonlyrndarr3.findIndex(
          //     (a) =>
          //       e?.StockBarcode === a?.StockBarcode &&
          //       e?.ShapeName === a?.ShapeName &&
          //       e?.QualityName === a?.QualityName &&
          //       e?.Colorname === a?.Colorname
          //   );
      
          //   if (findRecord === -1) {
          //     let obj = { ...e };
          //     obj.wtWt = e?.Wt;
          //     obj.pcPcs = e?.Pcs;
          //     obj.rRate = e?.Rate;
          //     obj.amtAmount = e?.Amount;
          //     diaonlyrndarr3.push(obj);
          //   } else {
          //     diaonlyrndarr3[findRecord].wtWt += e?.Wt;
          //     diaonlyrndarr3[findRecord].pcPcs += e?.Pcs;
          //     diaonlyrndarr3[findRecord].rRate += e?.Rate;
          //     diaonlyrndarr3[findRecord].amtAmount += e?.Amount;
          //   }
          // });
      
          // diaonlyrndarr2.forEach((e) => {
          //   let findRecord = diaonlyrndarr4.findIndex(
          //     (a) =>
          //       e?.StockBarcode === a?.StockBarcode &&
          //       e?.ShapeName === a?.ShapeName &&
          //       e?.QualityName === a?.QualityName &&
          //       e?.Colorname === a?.Colorname
          //   );
      
          //   if (findRecord === -1) {
          //     let obj = { ...e };
          //     obj.wtWt = e?.Wt;
          //     obj.wtWts = e?.Wt;
          //     obj.pcPcs = e?.Pcs;
          //     obj.pcPcss = e?.Pcs;
          //     obj.rRate = e?.Rate;
          //     obj.rRates = e?.Rate;
          //     obj.amtAmount = e?.Amount;
          //     obj.amtAmounts = e?.Amount;
          //     diaonlyrndarr4.push(obj);
          //   } else {
          //     diaonlyrndarr4[findRecord].wtWt += e?.Wt;
          //     diaonlyrndarr4[findRecord].wtWts += e?.Wt;
          //     diaonlyrndarr4[findRecord].pcPcs += e?.Pcs;
          //     diaonlyrndarr4[findRecord].pcPcss += e?.Pcs;
          //     diaonlyrndarr4[findRecord].rRate += e?.Rate;
          //     diaonlyrndarr4[findRecord].rRates += e?.Rate;
          //     diaonlyrndarr4[findRecord].amtAmount += e?.Amount;
          //     diaonlyrndarr4[findRecord].amtAmounts += e?.Amount;
          //   }
          // });
      
          // diaonlyrndarr4.forEach((e) => {
          //   diaObj.wtWt += e?.wtWt;
          //   diaObj.wtWts += e?.wtWts;
          //   diaObj.pcPcs += e?.pcPcs;
          //   diaObj.pcPcss += e?.pcPcss;
          //   diaObj.rRate += e?.rRate;
          //   diaObj.rRates += e?.rRates;
          //   diaObj.amtAmount += e?.amtAmount;
          //   diaObj.amtAmounts += e?.amtAmounts;
          // });
          
          // diaonlyrndarr3?.forEach((e) => {
          //   let find_record = diaonlyrndarr6?.findIndex(
          //     (a) =>
          //       e?.ShapeName === a?.ShapeName &&
          //       e?.QualityName === a?.QualityName &&
          //       e?.Colorname === a?.Colorname
          //   );
          //   if (find_record === -1) {
          //     let obj = { ...e };
          //     obj.wtWts = e?.wtWt;
          //     obj.pcPcss = e?.pcPcs;
          //     obj.rRates = e?.rRate;
          //     obj.amtAmounts = e?.amtAmount;
          //     diaonlyrndarr6.push(obj);
          //   }else{
          //     diaonlyrndarr6[find_record].wtWts += e?.wtWt;
          //     diaonlyrndarr6[find_record].pcPcss += e?.pcPcs;
          //     diaonlyrndarr6[find_record].rRates += e?.rRate;
          //     diaonlyrndarr6[find_record].amtAmounts += e?.amtAmount;
          //   }
          // });
      
          // diarndotherarr5 = [...diaonlyrndarr6, diaObj];
          // setDiamondWise(diarndotherarr5);
        // datas?.resultArray?.forEach((el) => {
        //     let dia = [];
        //     el?.diamonds?.forEach((a) => {
        //         let obj = cloneDeep(a);
        //         let findrec = dia?.findIndex((ele) => ele?.ShapeName === obj?.ShapeName && ele?.QualityName === obj?.QualityName && ele?.Colorname === obj?.Colorname && ele?.SizeName === obj?.SizeName && ele?.Rate === obj?.Rate)
        //         if(findrec === -1){
        //             dia.push(obj);
        //         }else{
        //             dia[findrec].Wt += obj?.Wt;
        //             dia[findrec].Pcs += obj?.Pcs;
        //             dia[findrec].Rate = obj?.Rate;
        //             dia[findrec].Amount += obj?.Amount;
        //         }
        //     })
        //     el.diamonds = dia;

        //     let clr = [];
        //     el?.colorstone?.forEach((a) => {
        //         let obj = cloneDeep(a);
        //         let findrec = clr?.findIndex((ele) => ele?.ShapeName === obj?.ShapeName && ele?.QualityName === obj?.QualityName && ele?.Colorname === obj?.Colorname && ele?.isRateOnPcs === obj?.isRateOnPcs && ele?.SizeName === obj?.SizeName && ele?.Rate === obj?.Rate)
        //         if(findrec === -1){
        //             clr.push(obj);
        //         }else{
        //             clr[findrec].Wt += obj?.Wt;
        //             clr[findrec].Pcs += obj?.Pcs;
        //             clr[findrec].Rate = obj?.Rate;
        //             clr[findrec].Amount += obj?.Amount;
        //         }
        //     })
        //     el.colorstone = clr;
        // })
        // datas?.resultArray?.forEach((a) => {
        //     let dia1 = [];
            
        //     a?.diamonds?.forEach((al) => {
        //         al?.diamonds?.forEach((el) => {
        //             let findrec = dia1?.findIndex((aa) => aa?.ShapeName === el?.ShapeName && aa?.QualityName === el?.QualityName)
        //             if(findrec === -1){
        //                 dia1.push(el)
        //             }else{
        //                 dia1[findrec].Wt += el?.Wt;
        //                 dia1[findrec].Pcs += el?.Pcs;
        //             }
        //         })
        //     })
        //     a.diamonds = dia1;

        // })
        let obj = {
            dia_rnd_pcs : 0,
            dia_rnd_wt : 0,
            dia_bug_pcs : 0,
            dia_bug_wt : 0,
            dia_prs_pcs : 0,
            dia_prs_wt : 0,
            dia_amt:0
        }
        datas?.resultArray?.forEach((a) => {
            let dia1 = [];
            let dia2 = [];
            let dia3 = [];
            let obj2 = {
              dia_rnd_pcs : 0,
              dia_rnd_wt : 0,
              dia_bug_pcs : 0,
              dia_bug_wt : 0,
              dia_prs_pcs : 0,
              dia_prs_wt : 0,
              dia_amt:0
          }
            a?.diamonds?.forEach((al) => {
                if(al?.ShapeName?.toLowerCase() === 'rnd'){


                    dia1.push(al);

                    obj.dia_rnd_pcs += al?.Pcs;
                    obj.dia_rnd_wt += al?.Wt;
                    obj.dia_amt += al?.Amount;

                    obj2.dia_rnd_pcs += al?.Pcs;
                    obj2.dia_rnd_wt += al?.Wt;
                    obj2.dia_amt += al?.Amount;
                }
                if(al?.ShapeName?.toLowerCase() === 'bug'){
                    dia2.push(al);
                    obj.dia_bug_pcs += al?.Pcs;
                    obj.dia_bug_wt += al?.Wt;
                    obj.dia_amt += al?.Amount;
                    obj2.dia_bug_pcs += al?.Pcs;
                    obj2.dia_bug_wt += al?.Wt;
                    obj2.dia_amt += al?.Amount;
                }
                if(al?.ShapeName?.toLowerCase() === 'prs'){
                    dia3.push(al);
                    obj.dia_prs_pcs += al?.Pcs;
                    obj.dia_prs_wt += al?.Wt;
                    obj.dia_amt += al?.Amount;
                    obj2.dia_prs_pcs += al?.Pcs;
                    obj2.dia_prs_wt += al?.Wt;
                    obj2.dia_amt += al?.Amount;
                }
            })
            let dia4 = [...dia1, ...dia2, ...dia3];
            a.diamonds = dia4;
            
        })

        datas?.resultArray?.forEach((a) => {
          let dia_qul = [];

          a?.diamonds?.forEach((al) => {
            let b = cloneDeep(al);
            let findrec = dia_qul?.findIndex((el) => el?.ShapeName === b?.ShapeName && el?.QualityName === b?.QualityName)
            if(findrec === -1){
              dia_qul.push(b);
            }else{
              dia_qul[findrec].Wt += b?.Wt;
              dia_qul[findrec].Pcs += b?.Pcs;
            }
          })
        });
       setMainTotal(obj);
        
        
       let jobWiseData = {};

       datas?.resultArray?.forEach((a) => {
           // Extract job number
           const jobNumber = a?.SrJobno;
           
           // Initialize job if not exists
           if (!jobWiseData[jobNumber]) {
               jobWiseData[jobNumber] = {
                   SrJobno: jobNumber,
                   diamonds: [],
               };
           }
           
           // Initialize qualityShapeData object
           let qualityShapeData = {};
           
           a?.diamonds?.forEach((diamond) => {
               const quality = diamond?.QualityName?.toUpperCase();
               const shape = diamond?.ShapeName?.toLowerCase();
               
               // Initialize quality if not exists
               if (!qualityShapeData[quality]) {
                   qualityShapeData[quality] = {
                       D_QUL: quality, // Include quality in the object
                       D_RND_PCS: 0,
                       D_RND_WT: 0,
                       D_BUG_PCS: 0,
                       D_BUG_WT: 0,
                       D_PRS_PCS: 0,
                       D_PRS_WT: 0
                   };
               }
               
               // Accumulate counts and weights based on shape
               qualityShapeData[quality][`D_${shape.toUpperCase()}_PCS`] += diamond?.Pcs || 0;
               qualityShapeData[quality][`D_${shape.toUpperCase()}_WT`] += diamond?.Wt || 0;
           });
       
           // Push each qualityShapeData object into the diamonds array of the current job
           Object.values(qualityShapeData).forEach((qualityObj) => {
               jobWiseData[jobNumber].diamonds.push(qualityObj);
           });
       });
       
       
       let jobWiseDataArray = Object.values(jobWiseData);
       

       let finalArr3 = [];
       datas?.resultArray?.forEach((a) => {
        let b = deepClone(a);
        b = {...a};
        jobWiseDataArray?.forEach((el) => {
          if(b?.SrJobno === el?.SrJobno){
            b.diamonds_qly = el?.diamonds
          }
        })
        finalArr3.push(b);
       })
       datas.resultArray = finalArr3;

       



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

            let findMetal = e?.metal?.find((ele, ind) => ele?.IsPrimaryMetal === 1)
            let obj = {};
            obj.sr = i+1;
            obj.srflag = true;
            obj.srRowSpan = len;
            obj.SrJobno = `${e?.SrJobno}`;
            obj.designno = e?.designno;
            obj.grosswt= e?.grosswt;
            obj.Categoryname= e?.Categoryname;
            obj.NetWt= e?.NetWt + e?.LossWt;
            obj.metal_rate = e?.metal_rate;
            obj.Size = e?.Size;
            obj.lineid = e?.lineid;
            obj.diamond_Amt = e?.totals?.diamonds?.Amount;
            // obj.diaShp = e?.diamonds[0]?.ShapeName;
            // obj.diaQly = e?.diamonds[0]?.QualityName;

            obj.diaQly2 = e?.diamonds_qly[0]?.D_QUL;
            obj.dia_rnd_pcs = e?.diamonds_qly[0]?.D_RND_PCS;
            obj.dia_rnd_wt = e?.diamonds_qly[0]?.D_RND_WT;
            obj.dia_bug_pcs = e?.diamonds_qly[0]?.D_BUG_PCS;
            obj.dia_bug_wt = e?.diamonds_qly[0]?.D_BUG_WT;
            obj.dia_prs_pcs = e?.diamonds_qly[0]?.D_PRS_PCS;
            obj.dia_prs_wt = e?.diamonds_qly[0]?.D_PRS_WT;

            // obj.dia_code = e?.diamonds[0] ? (e?.diamonds[0]?.ShapeName + " " + e?.diamonds[0]?.QualityName + " " + e?.diamonds[0]?.Colorname) : '';
            // obj.dia_size = e?.diamonds[0] ? e?.diamonds[0]?.SizeName : '';
            // obj.dia_pcs = e?.diamonds[0] ? e?.diamonds[0]?.Pcs : '';
            // obj.dia_wt = e?.diamonds[0] ? (+((e?.diamonds[0]?.Wt)?.toFixed(3))) : '';
            // // obj.dia_rate = e?.diamonds[0] ? (Math.round(((e?.diamonds[0]?.Amount / result?.header?.CurrencyExchRate) / (e?.diamonds[0]?.Wt === 0 ? 1 : e?.diamonds[0]?.Wt)))) : '';
            // obj.dia_rate = e?.diamonds[0] ? (Math.round(((e?.diamonds[0]?.Amount / datas?.header?.CurrencyExchRate) / (e?.diamonds[0]?.Wt === 0 ? 1 : e?.diamonds[0]?.Wt)))) : '';
            // obj.dia_amt = e?.diamonds[0] ? (e?.diamonds[0]?.Amount) : '';


            obj.met_quality = '';
            obj.met_wt = 0;
            obj.met_rate = 0;
            obj.met_amt = 0;
            
                obj.met_wt = e?.NetWt;
                // obj.met_rate = findMetal ? (Math.round(((findMetal?.Amount / datas?.header?.CurrencyExchRate)) / e?.NetWt)) : '';
                obj.met_rate = findMetal ? (Math.round((findMetal?.Rate) )) : '';
                obj.met_amt = findMetal ? (formatAmount(findMetal?.Amount)) : '';
                obj.met_quality = findMetal ? (findMetal?.ShapeName + " " + findMetal?.QualityName) : '';
            

            
            obj.cls_code = e?.colorstone[0] ? (e?.colorstone[0]?.ShapeName + " " + e?.colorstone[0]?.QualityName + " " + e?.colorstone[0]?.Colorname) : '';
            obj.cls_size = e?.colorstone[0] ? (e?.colorstone[0]?.SizeName) : '';
            obj.cls_pcs = e?.colorstone[0] ? (e?.colorstone[0]?.Pcs) : '';
            obj.cls_wt = e?.colorstone[0] ? ((e?.colorstone[0]?.Wt)?.toFixed(3)) : '';
            // obj.cls_rate = e?.colorstone[0] ? (Math.round(((e?.colorstone[0]?.Amount / result?.header?.CurrencyExchRate)) / ( e?.colorstone[0]?.isRateOnPcs === 1 ? (e?.colorstone[0]?.Pcs === 0 ? 1 : e?.colorstone[0]?.Pcs) :  (e?.colorstone[0]?.Wt === 0 ? 1 : e?.colorstone[0]?.Wt)))) : '';
            obj.cls_rate = e?.colorstone[0] ? (Math.round(((e?.colorstone[0]?.Amount / datas?.header?.CurrencyExchRate)) / ( e?.colorstone[0]?.isRateOnPcs === 1 ? (e?.colorstone[0]?.Pcs === 0 ? 1 : e?.colorstone[0]?.Pcs) :  (e?.colorstone[0]?.Wt === 0 ? 1 : e?.colorstone[0]?.Wt)))) : '';
            obj.cls_amt = e?.colorstone[0] ? (formatAmount(e?.colorstone[0]?.Amount)) : '';


            obj.oth_amt = ( e?.OtherCharges + e?.TotalDiamondHandling + e?.MiscAmount);
            obj.labour_rate = e?.MaKingCharge_Unit;
            obj.labour_amt = (e?.MakingAmount + e?.totals?.diamonds?.SettingAmount + e?.totals?.colorstone?.SettingAmount);
            obj.total_amount = e?.TotalAmount;
            
         
            Array?.from({length : len})?.map((el, ind) => {
                let obj = {};
          
                obj.srflag = false
                obj.img = e?.DesignImage;
                obj.imgflag = false;
                if(ind === 0){
                    obj.imgflag = true;
                }
                obj.tunch = ((e?.Tunch)?.toFixed(3));
                obj.tunchflag = false;
                if(ind === 4){
                    obj.tunchflag = false;
                }

                obj.grosswt = ((e?.grosswt)?.toFixed(3));
                obj.grosswetflag = false;
                if(ind === 5){
                    obj.grosswetflag = false;
                }

                //diamond
                // obj.dia_code = '';
                // obj.dia_size = '';
                // obj.dia_pcs = 0;
                // obj.dia_wt = 0;
                // obj.dia_rate = 0;
                // obj.dia_amt = 0;
                // obj.diaflag = false;
                // if(e?.diamonds[ind+1]){
                //     obj.diaflag = true;
                //     obj.diaShp = e?.diamonds[ind + 1]?.ShapeName;
                //     obj.diaQly = e?.diamonds[ind + 1]?.QualityName;
                //     obj.dia_code = (e?.diamonds[ind + 1]?.ShapeName + " " + e?.diamonds[ind + 1]?.QualityName + " " + e?.diamonds[ind + 1]?.Colorname);
                //     obj.dia_size = e?.diamonds[ind + 1]?.SizeName;
                //     obj.dia_pcs = e?.diamonds[ind + 1]?.Pcs;
                //     obj.dia_wt = ((e?.diamonds[ind + 1]?.Wt)?.toFixed(3));
                //     // obj.dia_rate = (Math.round((e?.diamonds[ind + 1]?.Amount / result?.header?.CurrencyExchRate) / (e?.diamonds[ind + 1]?.Wt === 0 ? 1 : e?.diamonds[ind + 1]?.Wt)));
                //     obj.dia_rate = (Math.round((e?.diamonds[ind + 1]?.Amount / datas?.header?.CurrencyExchRate) / (e?.diamonds[ind + 1]?.Wt === 0 ? 1 : e?.diamonds[ind + 1]?.Wt)));
                //     obj.dia_amt = (formatAmount(e?.diamonds[ind + 1]?.Amount));

                

                // }

                //dia_qyl
                obj.diaQly2 = '';
                obj.dia_prs_pcs = 0;
                obj.dia_prs_wt = 0;
                obj.dia_bug_pcs = 0;
                obj.dia_bug_wt = 0;
                obj.dia_rnd_pcs = 0;
                obj.dia_rnd_wt = 0;

                if(e?.diamonds_qly[ind+1]){
                  obj.diaflag = true;
                  obj.diaQly2 = e?.diamonds_qly[ind+1]?.D_QUL;
                  obj.dia_rnd_pcs = e?.diamonds_qly[ind+1]?.D_RND_PCS;
                  obj.dia_rnd_wt = e?.diamonds_qly[ind+1]?.D_RND_WT;
                  obj.dia_bug_pcs = e?.diamonds_qly[ind+1]?.D_BUG_PCS;
                  obj.dia_bug_wt = e?.diamonds_qly[ind+1]?.D_BUG_WT;
                  obj.dia_prs_pcs = e?.diamonds_qly[ind+1]?.D_PRS_PCS;
                  obj.dia_prs_wt = e?.diamonds_qly[ind+1]?.D_PRS_WT;
                }


                // colorstone
                obj.cls_code = '';
                obj.cls_size = '';
                obj.cls_pcs = 0;
                obj.cls_wt = 0;
                obj.cls_rate = 0;
                obj.cls_amt = 0;
                obj.clsflag = false;
                if(e?.colorstone[ind+1]){
                    obj.clsflag = true;
                    obj.cls_code = e?.colorstone[ind + 1]?.ShapeName + " " + e?.colorstone[ind + 1]?.QualityName + " " + e?.colorstone[ind + 1]?.Colorname;
                    obj.cls_size = e?.colorstone[ind + 1]?.SizeName;
                    obj.cls_pcs = e?.colorstone[ind + 1]?.Pcs;
                    obj.cls_wt = ((e?.colorstone[ind + 1]?.Wt)?.toFixed(3));
                    // obj.cls_rate = (Math.round(((e?.colorstone[ind + 1]?.Amount / result?.header?.CurrencyExchRate)) / (e?.colorstone[ind + 1]?.Wt === 0 ? 1 : e?.colorstone[ind + 1]?.Wt)));
                    obj.cls_rate = (Math.round(((e?.colorstone[ind + 1]?.Amount / datas?.header?.CurrencyExchRate)) / (e?.colorstone[ind + 1]?.Wt === 0 ? 1 : e?.colorstone[ind + 1]?.Wt)));
                    obj.cls_amt = (formatAmount(e?.colorstone[ind + 1]?.Amount));
                }

                obj.JobRemark = e?.JobRemark;
                obj.jobRemarkflag = false;
                if(ind === 1 && e?.JobRemark !== ''){
                    obj.jobRemarkflag = false;
                }

                arr.push(obj);

            })

            obj.matrialArr = arr;
            obj.values = e;

            finalArr.push(obj);
        })
        setResult2(finalArr);
        setResult(datas);

         setTimeout(() => {
            const button = document.getElementById('test-table-xls-button');
            button.click();
          }, 500);


        //loadData end
    }



    //styles and css
    const tableCellStyle = {
        height: '40px',
        backgroundColor: '#939292',
        color: 'white',
        fontSize:'20px',
        fontWeight:'bold'
    };
    

    
   
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
                    filename={`Packing_List_C_${result?.header?.InvoiceNo}_${Date.now()}`}
                    sheet="tablexls"
                    buttonText="Download as XLS"
                 />
                <table id='table-to-xls'>
                    <tbody>
                        

                        {/* table */}
                        
                        <tr>
                            <th style={{borderLeft:'1px solid black', borderBottom:'1px solid black', borderRight:'1px solid black',  backgroundColor:'#F5F5F5'}} width={90}>SR NO</th>
                            <th style={{borderBottom:'1px solid black', borderRight:'1px solid black',  backgroundColor:'#F5F5F5'}} colSpan={1}  width={100}>MFG DESIGN NO.</th>
                            <th style={{borderBottom:'1px solid black', borderRight:'1px solid black',  backgroundColor:'#F5F5F5'}} colSpan={1} width={100}>JOB NO</th>
                            <th style={{borderBottom:'1px solid black', borderRight:'1px solid black',  backgroundColor:'#F5F5F5'}} colSpan={1} width={150}>DESIGN NO.</th>
                            <th style={{borderBottom:'1px solid black', borderRight:'1px solid black',  backgroundColor:'#F5F5F5'}} colSpan={1} width={150}>IMAGES</th>
                            <th style={{borderBottom:'1px solid black', borderRight:'1px solid black',  backgroundColor:'#F5F5F5'}} colSpan={1} width={150}>CATEGORY</th>
                            <th style={{borderBottom:'1px solid black', borderRight:'1px solid black',  backgroundColor:'#F5F5F5'}} colSpan={1} width={100}>GROSS WT</th>
                            <th style={{borderBottom:'1px solid black', borderRight:'1px solid black',  backgroundColor:'#F5F5F5'}} colSpan={1} width={100}>NET WT</th>
                            <th style={{borderBottom:'1px solid black', borderRight:'1px solid black',  backgroundColor:'#F5F5F5'}} colSpan={1} width={100}>MOP & ENAMEL</th>
                            <th style={{borderBottom:'1px solid black', borderRight:'1px solid black',  backgroundColor:'#F5F5F5'}} colSpan={1} width={100}>GOLD RATE</th>
                            <th style={{borderBottom:'1px solid black', borderRight:'1px solid black',  backgroundColor:'#F5F5F5'}} colSpan={1} width={100}>GOLD AMOUNT</th>
                            <th style={{borderBottom:'1px solid black', borderRight:'1px solid black',  backgroundColor:'#F5F5F5'}} colSpan={1} width={100}>TOTAL PCS</th>
                            <th style={{borderBottom:'1px solid black', borderRight:'1px solid black',  backgroundColor:'#F5F5F5'}} colSpan={1} width={100}>TOTAL CTS</th>
                            <th style={{borderBottom:'1px solid black', borderRight:'1px solid black',  backgroundColor:'#F5F5F5'}} width={100}>QUALITY</th>
                            <th style={{borderBottom:'1px solid black', borderRight:'1px solid black',  backgroundColor:'#F5F5F5'}} width={100}>D RND PCS</th>
                            <th style={{borderBottom:'1px solid black', borderRight:'1px solid black',  backgroundColor:'#F5F5F5'}} width={100}>D RND WT</th>
                            <th style={{borderBottom:'1px solid black', borderRight:'1px solid black',  backgroundColor:'#F5F5F5'}} width={100}>D BUG PCS</th>
                            <th style={{borderBottom:'1px solid black', borderRight:'1px solid black',  backgroundColor:'#F5F5F5'}} width={100}>D BUG WT</th>
                            <th style={{borderBottom:'1px solid black', borderRight:'1px solid black',  backgroundColor:'#F5F5F5'}} width={100}>D PRS PCS</th>
                            <th style={{borderBottom:'1px solid black', borderRight:'1px solid black',  backgroundColor:'#F5F5F5'}} width={100}>D PRS WT</th>

                            <th style={{borderBottom:'1px solid black', borderRight:'1px solid black',  backgroundColor:'#F5F5F5'}} width={100}>D.RATE(-2 DIA) </th>
                            <th style={{borderBottom:'1px solid black', borderRight:'1px solid black',  backgroundColor:'#F5F5F5'}} width={100}>D.RATE +2-11 </th>
                            <th style={{borderBottom:'1px solid black', borderRight:'1px solid black',  backgroundColor:'#F5F5F5'}} width={100}>D.RATE +11 </th>
                            <th style={{borderBottom:'1px solid black', borderRight:'1px solid black',  backgroundColor:'#F5F5F5'}} width={100}>D.RATE-BG </th>
                            <th style={{borderBottom:'1px solid black', borderRight:'1px solid black',  backgroundColor:'#F5F5F5'}} width={100}>D.PR RATE </th>
                            <th style={{borderBottom:'1px solid black', borderRight:'1px solid black',  backgroundColor:'#F5F5F5'}} width={100}>D.AMT </th>

                            <th style={{borderBottom:'1px solid black', borderRight:'1px solid black',  backgroundColor:'#F5F5F5'}} colSpan={1} width={150}>SIZE</th>
                            <th style={{borderBottom:'1px solid black', borderRight:'1px solid black',  backgroundColor:'#F5F5F5'}} width={150}>REMARK</th>
                        </tr>
                        {
                            result2?.map((e, i) => {
                                return (<React.Fragment key={i}>
                                    <tr>
                                    { e?.srflag && <td width={90} style={{borderRight:'1px solid black', borderTop:'1px solid black'}} align='center' rowSpan={e?.srRowSpan + 1} >{e?.sr}</td>}
                                        { e?.srflag && <td width={120} style={{wordBreak:'break-word', borderRight:'1px solid black', borderTop:'1px solid black'}} rowSpan={e?.srRowSpan + 1}  >&nbsp;{e?.MFG_DesignNo}</td>}
                                        { e?.srflag && <td width={120} align='center' style={{borderRight:'1px solid black', wordBreak:'break-word', borderTop:'1px solid black', paddingRight:'5px'}} rowSpan={e?.srRowSpan + 1}>&nbsp;{e?.SrJobno}&nbsp;</td>}
                                        { e?.srflag && <td width={120} align='center' style={{borderRight:'1px solid black', wordBreak:'break-word', paddingRight:'5px', borderTop:'1px solid black'}} rowSpan={e?.srRowSpan + 1} >&nbsp;{e?.designno}&nbsp;</td>}
                                        <td width={120} align='center' style={{borderRight:'1px solid black', wordBreak:'break-word', paddingRight:'5px', borderTop:'1px solid black'}}>&nbsp;{e?.designImage}&nbsp;</td>
                                        { e?.srflag && <td width={120} align='center' style={{borderRight:'1px solid black', wordBreak:'break-word', paddingRight:'5px', borderTop:'1px solid black'}} rowSpan={e?.srRowSpan + 1} >&nbsp;{e?.Categoryname}&nbsp;</td>}
                                        { e?.srflag && <td width={120} align='center' style={{borderRight:'1px solid black', wordBreak:'break-word', paddingRight:'5px', borderTop:'1px solid black'}} rowSpan={e?.srRowSpan + 1} >{+((e?.grosswt))}</td>}
                                        { e?.srflag && <td width={120} align='center' style={{borderRight:'1px solid black', wordBreak:'break-word', paddingRight:'5px', borderTop:'1px solid black'}} rowSpan={e?.srRowSpan + 1} >{((e?.NetWt?.toFixed(3)))}</td>}
                                        { e?.srflag && <td width={120} align='center' style={{borderRight:'1px solid black', wordBreak:'break-word', paddingRight:'5px', borderTop:'1px solid black'}} rowSpan={e?.srRowSpan + 1} >{(e?.values?.totals?.colorstone?.Wt)?.toFixed(3)}</td>}
                                        { e?.srflag && <td width={120} align='center' style={{borderRight:'1px solid black', wordBreak:'break-word', paddingRight:'5px', borderTop:'1px solid black'}} rowSpan={e?.srRowSpan + 1} >{formatAmount(e?.metal_rate)}</td>}
                                        { e?.srflag && <td width={120} align='center' style={{borderRight:'1px solid black', wordBreak:'break-word', paddingRight:'5px', borderTop:'1px solid black'}} rowSpan={e?.srRowSpan + 1} >{formatAmount(e?.values?.totals?.metal?.Amount)}</td>}
                                        { e?.srflag && <td width={120} align='center' style={{borderRight:'1px solid black', wordBreak:'break-word', paddingRight:'5px', borderTop:'1px solid black'}} rowSpan={e?.srRowSpan + 1} >{+(e?.values?.totals?.diamonds?.Pcs)}</td>}
                                        { e?.srflag && <td width={120} align='center' style={{borderRight:'1px solid black', wordBreak:'break-word', paddingRight:'5px', borderTop:'1px solid black'}} rowSpan={e?.srRowSpan + 1} >{e?.values?.totals?.diamonds?.Wt?.toFixed(3)}</td>}

                                        {/* <td width={140} align='left' style={{borderRight:'1px solid #989898'}} >&nbsp;{(e?.diaShp?.toLowerCase() === 'rnd' || e?.diaShp?.toLowerCase() === 'bug' || e?.diaShp?.toLowerCase() === 'prs' ) && e?.diaQly}</td> */}
                                        <td width={140} align='center' style={{borderRight:'1px solid black', borderTop:'1px solid black'}} >{e?.diaQly2}</td>

                                        {/* <td width={140} align='center' style={{borderRight:'1px solid black'}} >&nbsp;{e?.diaShp?.toLowerCase() === 'rnd' ? e?.dia_pcs : ''}</td> */}
                                        <td width={140} align='center' style={{borderRight:'1px solid black', borderTop:'1px solid black'}} >{e?.dia_rnd_pcs}</td>
                                        <td width={140} align='center' style={{borderRight:'1px solid black', borderTop:'1px solid black'}} >{e?.dia_rnd_wt?.toFixed(3)}</td>
                                        <td width={140} align='center' style={{borderRight:'1px solid black', borderTop:'1px solid black'}} >{e?.dia_bug_pcs}</td>
                                        <td width={140} align='center' style={{borderRight:'1px solid black', borderTop:'1px solid black'}} >{e?.dia_bug_wt?.toFixed(3)}</td>
                                        <td width={140} align='center' style={{borderRight:'1px solid black', borderTop:'1px solid black'}} >{e?.dia_prs_pcs}</td>
                                        <td width={140} align='center' style={{borderRight:'1px solid black', borderTop:'1px solid black'}} >{e?.dia_prs_wt?.toFixed(3)}</td>
                                        {/* <td width={140} align='left' style={{borderRight:'1px solid #989898'}}>&nbsp;{e?.diaShp?.toLowerCase() === 'rnd' && e?.dia_wt}</td> */}
                                        {/* <td width={90} align='left' style={{borderRight:'1px solid #989898'}}>&nbsp;{e?.diaShp?.toLowerCase() === 'bug' && e?.dia_pcs}</td>
                                        <td width={90} align='left' style={{borderRight:'1px solid #989898'}}>&nbsp;{( e?.dia_wt === '' ? '' : (e?.diaShp?.toLowerCase() === 'bug' && (+(e?.dia_wt?.toFixed(3)))))}</td>
                                        
                                        <td width={90} align='left' style={{borderRight:'1px solid #989898'}}>&nbsp;{e?.diaShp?.toLowerCase() === 'prs' && e?.dia_pcs}</td>
                                        <th align='left' width={90} style={{borderRight:'1px solid black'}}>&nbsp;{e?.diaShp?.toLowerCase() === 'prs' && e?.dia_wt}</th> */}
                                        
                                        { e?.srflag && <td width={90} align='center' style={{borderRight:'1px solid black', borderTop:'1px solid black'}} rowSpan={e?.srRowSpan + 1} >&nbsp;</td>}
                                        { e?.srflag && <td width={90} align='center' style={{borderRight:'1px solid black', borderTop:'1px solid black'}} rowSpan={e?.srRowSpan + 1} >&nbsp;</td>}
                                        { e?.srflag && <td width={90} align='center' style={{borderRight:'1px solid black', borderTop:'1px solid black'}} rowSpan={e?.srRowSpan + 1} >&nbsp;</td>}
                                        { e?.srflag && <td width={90} align='center' style={{borderRight:'1px solid black', borderTop:'1px solid black'}} rowSpan={e?.srRowSpan + 1} >&nbsp;</td>}
                                        { e?.srflag && <td width={90} align='center' style={{borderRight:'1px solid black', borderTop:'1px solid black'}} rowSpan={e?.srRowSpan + 1} >&nbsp;</td>}
                                        { e?.srflag && <td width={90} align='center' style={{borderRight:'1px solid black', borderTop:'1px solid black'}} rowSpan={e?.srRowSpan + 1} >{e?.diamond_Amt === '' ? '' : formatAmount(e?.diamond_Amt)}</td>}

                                        { e?.srflag && <td width={90} align='center' style={{borderRight:'1px solid black', borderTop:'1px solid black'}} colSpan={1} rowSpan={e?.srRowSpan + 1} >&nbsp;{e?.Size}</td>}
                                        
                                        { e?.srflag && <th align='center' width={90} style={{borderRight:'1px solid black', borderTop:'1px solid black'}} rowSpan={e?.srRowSpan + 1} >&nbsp;{e?.lineid}</th>}

                                    </tr>
                                    {/* dia clr materail */}
                                    
                                    {
                                        e?.matrialArr?.map((val, ind) => {
                                            return <tr key={ind}>
                                                {/* <td width={90} align='left' style={{borderRight:'1px solid black'}} colSpan={1}>&nbsp;</td> */}
                                                {/* <td width={90} align='left' style={{borderRight:'1px solid black'}} colSpan={1}>&nbsp;</td> */}
                                                {/* <td width={90} align='left' style={{borderRight:'1px solid black'}}>&nbsp;</td> */}
                                                
                                                <td  colSpan={1} style={{borderRight:'1px solid black', verticalAlign:'center'}} align='center'>
                                                    <span style={{textAlign:'center'}}>{val?.imgflag && <img src={val?.img} alt=""  onError={eve => handleGlobalImgError(eve, result?.header?.DefImage)} width={140}  style={{ paddingLeft: "10px", objectFit: "contain", verticalAlign:'center' }} />}</span>
                                                </td>
                                                {/* <td width={90} align='left' style={{borderRight:'1px solid black'}}>&nbsp;</td> */}
                                                {/* <td width={90} align='left' style={{borderRight:'1px solid black'}}>&nbsp;</td> */}
                                                {/* <td width={90} align='left' style={{borderRight:'1px solid black'}}>&nbsp;</td> */}
                                                {/* <td width={90} align='left' style={{borderRight:'1px solid black'}}>&nbsp;</td> */}
                                                {/* <td width={90} align='left' style={{borderRight:'1px solid black'}}>&nbsp;</td> */}
                                                {/* <td width={90} align='left' style={{borderRight:'1px solid black'}}>&nbsp;</td> */}
                                                {/* <td width={90} align='left' style={{borderRight:'1px solid black'}}>&nbsp;</td> */}
                                                {/* <td width={90} align='left' style={{borderRight:'1px solid black'}}>&nbsp;</td> */}
                                                {/* <td width={90} align='left' style={{borderLeft:'1px solid black', borderRight:'1px solid #989898'}}>&nbsp;{ val?.diaflag && `${(val?.diaShp?.toLowerCase() === 'rnd' || val?.diaShp?.toLowerCase() === 'bug' || val?.diaShp?.toLowerCase() === 'prs' ) && val?.diaQly}`}</td> */}
                                                <td width={90} align='center' style={{borderLeft:'1px solid black', borderRight:'1px solid black'}}>
                                                  &nbsp;{ val?.diaflag && `${val?.diaQly2}`}</td>

                                                <td width={140} align='center' style={{borderRight:'1px solid black'}} >{val?.diaflag && val?.dia_rnd_pcs}</td>
                                                <td width={140} align='center' style={{borderRight:'1px solid black'}} >{val?.diaflag && val?.dia_rnd_wt?.toFixed(3)}</td>
                                                <td width={140} align='center' style={{borderRight:'1px solid black'}} >{val?.diaflag && val?.dia_bug_pcs}</td>
                                                <td width={140} align='center' style={{borderRight:'1px solid black'}} >{val?.diaflag && val?.dia_bug_wt?.toFixed(3)}</td>
                                                <td width={140} align='center' style={{borderRight:'1px solid black'}} >{val?.diaflag && val?.dia_prs_pcs}</td>
                                                <td width={140} align='center' style={{borderRight:'1px solid black'}} >{val?.diaflag && val?.dia_prs_wt?.toFixed(3)}</td>

                                                {/* <td width={90} align='left' style={{borderRight:'1px solid #989898'}}>&nbsp;{ val?.diaflag && `${val?.diaShp?.toLowerCase() === 'rnd' ? val?.dia_pcs : ''}`}</td>
                                                <td width={90} align='left' style={{borderRight:'1px solid #989898'}}>&nbsp;{val?.diaflag && `${val?.diaShp?.toLowerCase() === 'rnd' ? val?.dia_wt : ''}`}</td>
                                                <td width={90} align='left' style={{borderRight:'1px solid #989898'}}>&nbsp;{val?.diaflag && val?.diaShp?.toLowerCase() === 'bug' && val?.dia_pcs}</td>
                                                <td width={90} align='left' style={{borderRight:'1px solid #989898'}}>&nbsp;{val?.diaflag && val?.diaShp?.toLowerCase() === 'bug' && val?.dia_wt}</td>
                                                
                                                <td width={90} align='left' style={{borderRight:'1px solid #989898'}}>&nbsp;{val?.diaflag && val?.diaShp?.toLowerCase() === 'prs' && val?.dia_pcs}</td>

                                                <th width={90} style={{borderRight:'1px solid black'}} align='left'>&nbsp;{val?.diaflag && (val?.diaShp?.toLowerCase() === 'prs' && val?.dia_wt)}</th> */}
                                                {/* <td width={90} style={{borderRight:'1px solid black'}}></td>
                                                <td width={90} style={{borderRight:'1px solid black'}}></td>
                                                <td width={90} style={{borderRight:'1px solid black'}}></td>
                                                <td width={90} style={{borderRight:'1px solid black'}}></td>
                                                <td width={90} style={{borderRight:'1px solid black'}}></td> */}
                                                {/* <td width={90} style={{borderRight:'1px solid black'}}></td>
                                                <td width={90} style={{borderRight:'1px solid black'}} colSpan={1}></td>
                                                <td width={90} style={{borderRight:'1px solid black'}}></td> */}
                                            </tr>
                                        })
                                    }
                                    {/* job wise total */}
                                    
                                    </React.Fragment>
                                )
                            })
                        }
        
                        {/* main total */}
                        <tr>
                                <th align='left' style={{borderRight:'1px solid black', borderBottom:'1px solid black', borderTop:'1px solid black', borderLeft:'1px solid black', }} ></th>
                                <th align='left' style={{borderRight:'1px solid black', borderBottom:'1px solid black', borderTop:'1px solid black', borderLeft:'1px solid black', }} ></th>
                                <th align='left' style={{borderRight:'1px solid black', borderBottom:'1px solid black', borderTop:'1px solid black', borderLeft:'1px solid black', }} ></th>
                                <th style={{ borderBottom:'1px solid black', borderTop:'1px solid black'}}></th>
                                <th style={{borderTop:'1px solid black', borderBottom:'1px solid black', borderLeft:'1px solid black', borderRight:'1px solid black'}} align='center' colSpan={2}>TOTAL</th>
                                <th style={{borderTop:'1px solid black', borderBottom:'1px solid black', borderRight:'1px solid black'}} align='center'>&nbsp;{result?.mainTotal?.grosswt?.toFixed(3)}</th>
                                <th style={{borderTop:'1px solid black', borderBottom:'1px solid black', borderRight:'1px solid black'}} align='center'>&nbsp;{(result?.mainTotal?.netwt + result?.mainTotal?.lossWt)?.toFixed(3)}</th>
                                <th style={{borderTop:'1px solid black', borderBottom:'1px solid black', borderRight:'1px solid black'}} align='center'>&nbsp;{`${((result?.mainTotal?.colorstone?.Wt)?.toFixed(3))}`}</th>
                                <th style={{borderTop:'1px solid black', borderBottom:'1px solid black', borderRight:'1px solid black'}}></th>
                                <th style={{borderTop:'1px solid black', borderBottom:'1px solid black', borderRight:'1px solid black'}} align='center'>&nbsp;{formatAmount(result?.mainTotal?.metal?.Amount)}</th>
                                <th style={{borderTop:'1px solid black', borderBottom:'1px solid black', borderRight:'1px solid black'}} align='center'>&nbsp;{result?.mainTotal?.diamonds?.Pcs}</th>
                                <th style={{borderTop:'1px solid black', borderBottom:'1px solid black', borderRight:'1px solid black'}} align='center'>&nbsp;{result?.mainTotal?.diamonds?.Wt?.toFixed(3)}</th>
                                <td style={{borderTop:'1px solid black', borderLeft:'1px solid black', borderBottom:'1px solid black'}}></td>
                                <th style={{ borderTop:'1px solid black', borderBottom:'1px solid black', borderLeft:'1px solid black'}} align='center'>&nbsp;{mainTotal?.dia_rnd_pcs}</th>
                                <th style={{ borderTop:'1px solid black', borderBottom:'1px solid black', borderLeft:'1px solid black'}} align='center'>&nbsp;{mainTotal?.dia_rnd_wt?.toFixed(3)}</th>
                                <th style={{ borderTop:'1px solid black', borderBottom:'1px solid black', borderLeft:'1px solid black'}} align='center'>&nbsp;{mainTotal?.dia_bug_pcs}</th>
                                <th style={{ borderTop:'1px solid black', borderBottom:'1px solid black', borderLeft:'1px solid black'}} align='center'>&nbsp;{mainTotal?.dia_bug_wt?.toFixed(3)}</th>
                                <th style={{ borderTop:'1px solid black', borderBottom:'1px solid black', borderLeft:'1px solid black'}} align='center'>{mainTotal?.dia_prs_pcs}</th>
                                <th style={{borderRight:'1px solid black', borderTop:'1px solid black',  borderBottom:'1px solid black', borderLeft:'1px solid black'}} align='center'>&nbsp;{mainTotal?.dia_prs_wt?.toFixed(3)}</th>
                                
                                <td style={{ borderTop:'1px solid black', borderBottom:'1px solid black', borderRight:'1px solid black'}}></td>
                                <td style={{ borderTop:'1px solid black', borderBottom:'1px solid black', borderRight:'1px solid black'}}></td>
                                <td style={{ borderTop:'1px solid black', borderBottom:'1px solid black', borderRight:'1px solid black'}}></td>
                                <td style={{ borderTop:'1px solid black', borderBottom:'1px solid black', borderRight:'1px solid black'}}></td>
                                <td style={{ borderTop:'1px solid black', borderBottom:'1px solid black', borderRight:'1px solid black'}}></td>
                                <th style={{ borderTop:'1px solid black', borderBottom:'1px solid black', borderRight:'1px solid black'}} align='center'>&nbsp;{formatAmount(result?.mainTotal?.diamonds?.Amount)}</th>
                                {/* <th style={{borderRight:'1px solid black', borderTop:'1px solid black',  borderBottom:'1px solid black'}} colSpan={1} align='center'>&nbsp;{ (result?.mainTotal?.total_Making_Amount + result?.mainTotal?.diamonds?.SettingAmount + result?.mainTotal?.colorstone?.SettingAmount) === 0 ? '' : formatAmount((result?.mainTotal?.total_Making_Amount + result?.mainTotal?.diamonds?.SettingAmount + result?.mainTotal?.colorstone?.SettingAmount))}</th> */}
                                <th style={{borderRight:'1px solid black', borderTop:'1px solid black',  borderBottom:'1px solid black'}} colSpan={1} align='center'>&nbsp;</th>
                                {/* <th style={{borderRight:'1px solid black', borderTop:'1px solid black',  borderBottom:'1px solid black'}} align='center'>&nbsp;{ (result?.mainTotal.total_amount + result?.header?.AddLess + (result?.allTaxesTotal * result?.header?.CurrencyExchRate)) === 0 ? '' :  formatAmount((result?.mainTotal.total_amount + result?.header?.AddLess + (result?.allTaxesTotal * result?.header?.CurrencyExchRate)))}</th> */}
                                <th style={{borderRight:'1px solid black', borderTop:'1px solid black',  borderBottom:'1px solid black'}} align='center'>&nbsp;</th>
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

export default TaxInvoiceExcel;