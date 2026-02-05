import React, { useEffect, useState } from 'react'
import { apiCall, checkMsg, formatAmount, isObjectEmpty } from '../../GlobalFunctions';
import { cloneDeep } from 'lodash';
import Loader from '../../components/Loader';
import  ReactHTMLTableToExcel  from 'react-html-table-to-excel';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
const SaleFormatWt = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
    const [result, setResult] = useState(null);
    const [result2, setResult2] = useState(null);
    const [msg, setMsg] = useState("");
    const [loader, setLoader] = useState(true);

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

    function loadData(data){
        const copydata = cloneDeep(data);

        let address = copydata?.BillPrint_Json[0]?.Printlable?.split("\r\n");
        copydata.BillPrint_Json[0].address = address;
    
        const datas = OrganizeDataPrint(
          copydata?.BillPrint_Json[0],
          copydata?.BillPrint_Json1,
          copydata?.BillPrint_Json2
        );
            
        let finalArr = [];
        
        datas?.resultArray?.forEach((e, i) => {
            let arr = [];

            let len = e?.diamonds?.length;

            let obj = {};

            obj.sr = i + 1;
            obj.srflag = true;
            obj.srRowSpan = len;
            
            obj.designno = e?.designno;
            obj.EntryDate = datas?.header?.EntryDate;
            obj.lineid = e?.lineid;
            obj.MFG_DesignNo = e?.MFG_DesignNo;
            obj.CompanyFullName = datas?.header?.CompanyFullName;
            obj.Categoryname = e?.Categoryname;
            if (e?.MetalType?.toLowerCase() === "gold") {
                obj.MetalType1 = "GOLD LGD STUDDED JEWELLERY";
            } else if (e?.MetalType?.toLowerCase() === "silver") {
                obj.MetalType1 = "SILVER LGD STUDDED JEWELLERY";
            } else {
                obj.MetalType1 = `${e?.MetalType} STUDDED JEWELLERY`;
            }
            if (e?.MetalType?.toLowerCase() === "gold") {
                obj.MetalType2 = `GD${e?.MetalPurity}`;
            } else if (e?.MetalType?.toLowerCase() === "silver") {
                obj.MetalType2 = `SL${e?.MetalPurity}`;
            } else {
                obj.MetalType2 = `${e?.MetalType} ${e?.MetalPurity}`;
            }
            
            obj.Quantity = e?.Quantity;
            obj.Size = e?.Size;
            obj.metalWt = (e?.totals?.metal?.Wt - e?.totals?.finding?.Wt)?.toFixed(3);
            obj.findWt = (e?.totals?.finding?.Wt)?.toFixed(3);
            obj.metal_rate = e?.metal_rate;
            obj.MetalAmount = e?.MetalAmount;
            obj.total_metfindwt = (e?.totals?.metal?.Wt + e?.totals?.finding?.Wt)?.toFixed(3);
            
            
            obj.dia_code = e?.diamonds[0] ? ( e?.diamonds[0]?.MaterialTypeName + " " + e?.diamonds[0]?.ShapeName + "-" + e?.diamonds[0]?.QualityName ) : '';
            obj.dia_size = e?.diamonds[0] ?  ( e?.diamonds[0]?.SecondarySize === '' ? e?.diamonds[0]?.SizeName : e?.diamonds[0]?.SecondarySize) : '';
            obj.dia_SettingName = e?.diamonds[0] ? e?.diamonds[0]?.SettingName : '';
            obj.dia_pcs = e?.diamonds[0] ? e?.diamonds[0]?.Pcs : '';
            obj.dia_wt = e?.diamonds[0] ? ((e?.diamonds[0]?.Wt)?.toFixed(3)) : '';
            obj.dia_rate = e?.diamonds[0] ? (Math.round(((e?.diamonds[0]?.Amount / datas?.header?.CurrencyExchRate) / (e?.diamonds[0]?.Wt === 0 ? 1 : e?.diamonds[0]?.Wt)))) : '';
            obj.dia_amt = e?.diamonds[0] ? (e?.diamonds[0]?.Amount) : '';

            obj.findingWt = e?.finding[0] ? (e?.finding[0]?.Wt) : '';
            obj.findingAmount = e?.finding[0] ? (e?.finding[0]?.SettingAmount) : '';
            obj.findingRate = e?.finding[0] ? (e?.finding[0]?.SettingRate) : '';

            obj.MaKingCharge_Unit = e?.MaKingCharge_Unit;
            obj.MakingAmount = e?.MakingAmount;
            if (e?.totals?.diamonds?.Wt === 0) {
                obj.conditionWiseDH = formatAmount(0 / 1); // Diamond weight is zero, so handle it accordingly
            } else {
                obj.conditionWiseDH = formatAmount(e?.TotalDiamondHandling / e?.totals?.diamonds?.Wt);
            }
            obj.TotalDiamondHandling = e?.TotalDiamondHandling;
            obj.HSNNo = e?.HSNNo;

            obj.showValueFlag = false; // Default to false

            if (e?.SrJobno === e?.GroupJob) {
                // Case 1: SrJobno is equal to GroupJob
                obj.showValueFlag = true;
            } else if (e?.SrJobno !== '' && e?.GroupJob === '') {
                // Case 2: SrJobno is not empty and GroupJob is empty
                obj.showValueFlag = true;
            } else if (e?.SrJobno !== e?.GroupJob && e?.GroupJob !== '') {
                // Case 3: SrJobno is not equal to GroupJob and GroupJob is not empty
                obj.showValueFlag = false;
            } else {
                // Any other cases can default to hide if necessary
                obj.showValueFlag = false;
            }

            Array?.from({length : len})?.map((el, ind) => {

                let obj = {};
                obj.sr2 = ind + 1;
                obj.srflag = false;

                obj.findingWt = '';
                obj.findingFlag = false;
                obj.findingRate = '';
                obj.findingAmount = '';

                                //diamond
                                obj.dia_code = '';
                                obj.dia_size = '';
                                obj.dia_SettingName = '';
                                obj.dia_pcs = '';
                                obj.dia_wt = '';
                                obj.dia_rate = '';
                                obj.dia_amt = '';
                                obj.diaflag = false;
                
                                if(e?.diamonds[ind+1]){
                                    obj.diaflag = true;
                                    obj.dia_code = ( e?.diamonds[ind + 1]?.MaterialTypeName + " " + e?.diamonds[ind + 1]?.ShapeName + "-" + e?.diamonds[ind + 1]?.QualityName);
                                    obj.dia_size = e?.diamonds[ind + 1]?.SecondarySize === '' ? e?.diamonds[ind + 1]?.SizeName : e?.diamonds[ind + 1]?.SecondarySize;
                                    obj.dia_pcs = e?.diamonds[ind + 1]?.Pcs;
                                    obj.dia_wt = ((e?.diamonds[ind + 1]?.Wt)?.toFixed(3));
                                    // obj.dia_rate = (Math.round((e?.diamonds[ind + 1]?.Amount / result?.header?.CurrencyExchRate) / (e?.diamonds[ind + 1]?.Wt === 0 ? 1 : e?.diamonds[ind + 1]?.Wt)));
                                    obj.dia_rate = (Math.round((e?.diamonds[ind + 1]?.Amount / datas?.header?.CurrencyExchRate) / (e?.diamonds[ind + 1]?.Wt === 0 ? 1 : e?.diamonds[ind + 1]?.Wt)));
                                    obj.dia_amt = (formatAmount(e?.diamonds[ind + 1]?.Amount));
                                    obj.dia_SettingName = e?.diamonds[ind + 1]?.SettingName;
                                }

                                if(e?.finding[ind + 1]){
                                    obj.findingFlag = true;
                                    obj.findingWt = (e?.finding[ind + 1]?.Wt);
                                    obj.findingRate = e?.finding[ind + 1]?.SettingRate;
                                    obj.findingAmount = e?.finding[ind + 1]?.SettingAmount;

                                }

                arr.push(obj);

            })

            obj.materialArr = arr;
            obj.totals = e;
            
            finalArr.push(obj);

        })
        

        
        setResult2(finalArr);
        setResult(datas);

        setTimeout(() => {
            const button = document.getElementById('test-table-xls-button');
            button.click();
          }, 500);

    }

  return (
    <>
      {
        loader ? <Loader /> : <>
        {
            msg === '' ? <>
            <div >
                <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="download-table-xls-button btn btn-success text-black bg-success px-2 py-1 fs-5 d-none"
                    table="table-to-xls"
                    filename={`SaleFormatWt_${result?.header?.InvoiceNo}_${Date.now()}`}
                    sheet="tablexls"
                    buttonText="Download as XLS"
                 />
                 <table id='table-to-xls' style={{width:'max-content'}}>
                    <thead>
                        <tr>
                            <th align='center' style={{verticalAlign:'middle'}} width={60}>SrNo</th>
                            <th align='center' style={{verticalAlign:'middle'}} width={120}>Inward Date</th>
                            <th align='center' style={{verticalAlign:'middle'}} width={60}>Sr No</th>
                            <th align='center' style={{verticalAlign:'middle'}} width={120}>Jewel Code</th>
                            <th align='center' style={{verticalAlign:'middle'}} width={120}>Style Code</th>
                            <th align='center' style={{verticalAlign:'middle'}} width={190}>Style Alias Number</th>
                            <th align='center' style={{verticalAlign:'middle'}} width={140}>Manufacturer</th>
                            <th align='center' style={{verticalAlign:'middle'}} width={120}>Category</th>
                            <th align='center' style={{verticalAlign:'middle'}} width={320}>Stock Type</th>
                            <th align='center' style={{verticalAlign:'middle'}} width={120}>Make Type</th>
                            <th align='center' style={{verticalAlign:'middle'}} width={100}>Item Pcs</th>
                            <th align='center' style={{verticalAlign:'middle'}} width={120}>Item Size</th>
                            <th align='center' style={{verticalAlign:'middle'}} width={120}>Item Code</th>
                            <th align='center' style={{verticalAlign:'middle'}} width={120}>Size</th>
                            <th align='center' style={{verticalAlign:'middle'}} width={120}>SetCode</th>
                            <th align='center' style={{verticalAlign:'middle'}} width={60}>Pcs</th>
                            <th align='center' style={{verticalAlign:'middle'}} width={60}>Total Pcs</th>
                            <th align='center' style={{verticalAlign:'middle'}} width={60}>Weight</th>
                            <th align='center' style={{verticalAlign:'middle'}} width={60}>Total Weight</th>
                            <th align='center' style={{verticalAlign:'middle'}} width={120}>Cost Rate</th>
                            <th align='center' style={{verticalAlign:'middle'}} width={120}>Cost Amount</th>
                            <th align='center' style={{verticalAlign:'middle'}} width={120}>MItem Code</th>
                            <th align='center' style={{verticalAlign:'middle'}} width={120}>NetWt</th>
                            <th align='center' style={{verticalAlign:'middle'}} width={120}>MCost Rate</th>
                            <th align='center' style={{verticalAlign:'middle'}} width={120}>MCost Amt</th>
                            <th align='center' style={{verticalAlign:'middle'}} width={120}>Total NetWt</th>
                            <th align='center' style={{verticalAlign:'middle'}} width={120}>CPF Cost Rate</th>
                            <th align='center' style={{verticalAlign:'middle'}} width={120}>CPF Cost Amt</th>
                            <th align='center' style={{verticalAlign:'middle'}} width={120}>Hand Cost Rate</th>
                            <th align='center' style={{verticalAlign:'middle'}} width={120}>Hand Cost Amount</th>
                            <th align='center' style={{verticalAlign:'middle'}} width={120}>Inward QTY</th>
                            <th align='center' style={{verticalAlign:'middle'}} width={120}>HSN Name</th>
                            <th align='center' style={{verticalAlign:'middle'}} width={120}>Location</th>
                            <th align='center' style={{verticalAlign:'middle'}} width={120}>Batch Number</th>
                            <th align='center' style={{verticalAlign:'middle'}}>PurchaseOrderNoSrNoOrBagNo</th>
                            <th align='center' style={{verticalAlign:'middle'}}>IsBaseCollection</th>
                            <th align='center' style={{verticalAlign:'middle'}}>CPF Cost Is Fix</th>
                            <th align='center' style={{verticalAlign:'middle'}}>Making On</th>
                            <th align='center' style={{verticalAlign:'middle'}}>Making Cost On</th>
                            <th align='center' style={{verticalAlign:'middle'}}>Currency</th>
                            <th align='center' style={{verticalAlign:'middle'}}>Currency Value</th>
                            <th align='center' style={{verticalAlign:'middle'}}>Rate Chart Code</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            result2?.map((e, i) => {
                                return <React.Fragment key={i}>
                            <tr>
                                <td width={60} align='center' style={{verticalAlign:'middle'}}>1</td>
                                <td width={120} align='center' style={{verticalAlign:'middle'}}>{ e?.showValueFlag && result?.header?.EntryDate}</td>
                                <td width={60} align='center' style={{verticalAlign:'middle'}}>{i+1}</td>
                                <td width={120} align='center' style={{verticalAlign:'middle'}}>{e?.lineid}</td>
                                <td width={120} align='center' style={{verticalAlign:'middle'}}>{e?.MFG_DesignNo}</td>
                                <td width={190} align='center' style={{verticalAlign:'middle'}}>{ e?.showValueFlag && e?.designno}</td>
                                <td width={140} align='center' style={{verticalAlign:'middle'}}>{e?.showValueFlag && e?.CompanyFullName}</td>
                                <td width={120} align='center' style={{verticalAlign:'middle'}}>{ e?.showValueFlag && e?.Categoryname}</td>
                                <td width={320} align='center' style={{verticalAlign:'middle'}}>{e?.showValueFlag && e?.MetalType1}
                                    {/* {e?.MetalType?.toLowerCase() === "gold" && "GOLD LGD STUDDED JEWELLERY"}
                                    {e?.MetalType?.toLowerCase() === "silver" && "SILVER LGD STUDDED JEWELLERY"}
                                    {(e?.MetalType?.toLowerCase() !== "gold" && e?.MetalType?.toLowerCase() !== "silver" ) 
                                    && `${e?.MetalType} STUDDED JEWELLERY`} */}
                                </td>
                                <td width={120} align='center' style={{verticalAlign:'middle'}} >{ e?.showValueFlag && "CFP"}</td>
                                <td width={100} align='center' style={{verticalAlign:'middle'}}>{e?.Quantity}</td>
                                <td width={120} align='center' style={{verticalAlign:'middle'}}>{e?.Size}</td>
                                <td width={220} align='center' style={{verticalAlign:'middle'}}>
                                    {/* {
                                        e?.diamonds?.map((e, ind) => {
                                            return <tr key={ind}><td>{e?.MaterialTypeName}</td><td>{e?.ShapeName} - {e?.QualityName}</td></tr>
                                        })
                                    } */}
                                    {e?.dia_code}
                                </td>
                                <td width={120} align='center' style={{verticalAlign:'middle'}}>
                                    {/* {
                                        e?.diamonds?.map((e, ind) => {
                                            return <tr key={ind}><td>{e?.SecondarySize === '' ? e?.SizeName : e?.SecondarySize}</td></tr>
                                        })
                                    } */}
                                    {e?.dia_size}
                                </td>
                                <td width={120} align='center' style={{verticalAlign:'middle'}}>
                                    {/* {
                                        e?.diamonds?.map((e, ind) => {
                                            return <tr key={ind}><td>{e?.SettingName}</td></tr>
                                        })
                                    } */}
                                    {e?.dia_SettingName}
                                </td>
                                <td width={60} align='center' style={{verticalAlign:'middle'}}>
                                    {/* {
                                        e?.diamonds?.map((e, ind) => {
                                            return <tr key={ind}><td>{e?.Pcs}</td></tr>
                                        })
                                    } */}
                                    {e?.dia_pcs}
                                </td>
                                
                                <td width={60} align='center' style={{verticalAlign:'middle'}}>{e?.totals?.totals?.diamonds?.Pcs !== 0 && e?.totals?.totals?.diamonds?.Pcs}</td>
                                <td width={60} align='center' style={{verticalAlign:'middle'}}>
                                    {/* {
                                        e?.diamonds?.map((e, ind) => {
                                            return <tr key={ind}><td>{e?.Wt?.toFixed(3)}</td></tr>
                                        })
                                    } */}
                                    {e?.dia_wt}
                                </td>
                                <td width={60} align='center' style={{verticalAlign:'middle'}}>{e?.totals?.totals?.diamonds?.Wt !== 0 && e?.totals?.totals?.diamonds?.Wt?.toFixed(3)}</td>
                                <td width={120} align='center' style={{verticalAlign:'middle'}}>
                                    {/* {
                                        e?.diamonds?.map((e, ind) => {
                                            return <tr key={ind}><td>{formatAmount(e?.Rate)}</td></tr>
                                        })
                                    } */}
                                    {e?.dia_rate}
                                </td>
                                <td width={120} align='center' style={{verticalAlign:'middle'}}>
                                    {/* {
                                        e?.diamonds?.map((e, ind) => {
                                            return <tr key={ind}><td>{formatAmount(e?.Amount)}</td></tr>
                                        })
                                    } */}
                                    {e?.dia_amt}
                                </td>
                                <td width={120} align='center' style={{verticalAlign:'middle'}}>
                                    {e?.MetalType2} <br /> 
                                    {/* {e?.MetalType?.toLowerCase() === "gold" && `GD${e?.MetalPurity}`}
                                    {e?.MetalType?.toLowerCase() === "silver" && `SL${e?.MetalPurity}`}
                                    {(e?.MetalType?.toLowerCase() !== "gold" && e?.MetalType?.toLowerCase() !== "silver" ) 
                                    && `${e?.MetalType} ${e?.MetalPurity}`} */}
                                </td>
                                <td width={120} align='center' style={{verticalAlign:'middle'}}>
                                        { (e?.totals?.totals?.metal?.Wt - e?.totals?.totals?.finding?.Wt) === 0 ? '' : <span>{ (e?.totals?.totals?.metal?.Wt - e?.totals?.totals?.finding?.Wt)?.toFixed(3)}</span>}{ (e?.totals?.totals?.metal?.Wt - e?.totals?.totals?.finding?.Wt) === 0 ? '' : <br />}
                                        {/* { e?.totals?.totals?.finding?.Wt !== 0 && <span>{e?.totals?.totals?.finding?.Wt?.toFixed(3)}</span>} */}
                                        <span>{(e?.findingWt === 0 || e?.findingWt === '') ? '' : ' '} { e?.findingWt}</span>
                                </td>
                                <td width={120} align='center' style={{verticalAlign:'middle'}}>{formatAmount(e?.metal_rate)}</td>
                                <td width={120} align='center' style={{verticalAlign:'middle'}}>{formatAmount(e?.MetalAmount)}</td>
                                <td width={120} align='center' style={{verticalAlign:'middle'}}>{(e?.totals?.totals?.metal?.Wt )?.toFixed(3)}</td>
                                <td width={120} align='center' style={{verticalAlign:'middle'}}>{ (e?.totals?.totals?.metal?.Wt - e?.totals?.totals?.finding?.Wt) === 0 ? '' : formatAmount(e?.MaKingCharge_Unit)} { (e?.totals?.totals?.metal?.Wt - e?.totals?.totals?.finding?.Wt) === 0 ? '' : <br />} <>  {  formatAmount(e?.findingRate)}</></td>
                                <td width={120} align='center' style={{verticalAlign:'middle'}}>{ (e?.totals?.totals?.metal?.Wt - e?.totals?.totals?.finding?.Wt) === 0 ? '' : formatAmount(e?.MakingAmount)} { (e?.totals?.totals?.metal?.Wt - e?.totals?.totals?.finding?.Wt) === 0 ? '' : <br />} {formatAmount(e?.findingAmount)}</td>
                                <td width={120} align='center' style={{verticalAlign:'middle'}}>{formatAmount(( (e?.totals?.totals?.diamonds?.Wt === 0 ? 0 : e?.TotalDiamondHandling) / (e?.totals?.totals?.diamonds?.Wt === 0 ? 1 : e?.totals?.totals?.diamonds?.Wt)))}</td>
                                <td width={120} align='center' style={{verticalAlign:'middle'}}>{formatAmount(e?.TotalDiamondHandling)}</td>
                                <td width={120} align='center' style={{verticalAlign:'middle'}}>{e?.Quantity}</td>
                                <td width={120} align='center' style={{verticalAlign:'middle'}}>{e?.HSNNo}</td>
                                <td width={120}></td>
                                <td width={120}></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            {
                                e?.materialArr?.map((el, ind) => {
                                    const isLastIndex = ind === e?.materialArr?.length - 1;
                                    return <tr key={ind}>
                                    <td width={60} align='center' style={{verticalAlign:'middle'}}>{!isLastIndex && ind + 2}</td>
                                    <td width={120}></td>
                                    <td width={60}></td>
                                    <td width={120}></td>
                                    <td width={120}></td>
                                    <td width={190}></td>
                                    <td width={140}></td>
                                    <td width={120}></td>
                                    <td width={120}></td>
                                    <td width={120}></td>
                                    <td width={100}></td>
                                    <td width={120}></td>
                                    <td width={220} align='center' style={{verticalAlign:'middle'}}>
                                        {el?.dia_code}
                                        {/* {
                                            e?.diamonds?.map((e, ind) => {
                                                return <tr key={ind}><td>{e?.MaterialTypeName}</td><td>{e?.ShapeName} - {e?.QualityName}</td></tr>
                                            })
                                        } */}
                                    </td>
                                    <td width={120} align='center' style={{verticalAlign:'middle'}}>
                                    {el?.dia_size}
                                        {/* {
                                            e?.diamonds?.map((e, ind) => {
                                                return <tr key={ind}><td>{e?.SecondarySize === '' ? e?.SizeName : e?.SecondarySize}</td></tr>
                                            })
                                        } */}
                                    </td>
                                    <td width={120} align='center' style={{verticalAlign:'middle'}}>
                                        {el?.dia_SettingName}
                                        {/* {
                                            e?.diamonds?.map((e, ind) => {
                                                return <tr key={ind}><td>{e?.SettingName}</td></tr>
                                            })
                                        } */}
                                    </td>
                                    <td width={60} align='center' style={{verticalAlign:'middle'}}>
                                        {el?.dia_pcs}
                                        {/* {
                                            e?.diamonds?.map((e, ind) => {
                                                return <tr key={ind}><td>{e?.Pcs}</td></tr>
                                            })
                                        } */}
                                    </td>
                                    <td width={60}></td>
                                    <td width={60} align='center' style={{verticalAlign:'middle'}}>
                                        {el?.dia_wt}
                                        {/* {
                                            e?.diamonds?.map((e, ind) => {
                                                return <tr key={ind}><td>{e?.Wt?.toFixed(3)}</td></tr>
                                            })
                                        } */}
                                    </td>
                                    <td width={60}></td>
                                    <td width={120} align='center' style={{verticalAlign:'middle'}}>
                                        {el?.dia_rate}
                                        {/* {
                                            e?.diamonds?.map((e, ind) => {
                                                return <tr key={ind}><td>{formatAmount(e?.Rate)}</td></tr>
                                            })
                                        } */}
                                    </td>
                                    <td width={120} align='center' style={{verticalAlign:'middle'}}>
                                        {el?.dia_amt}
                                        {/* {
                                            e?.diamonds?.map((e, ind) => {
                                                return <tr key={ind}><td>{formatAmount(e?.Amount)}</td></tr>
                                            })
                                        } */}
                                    </td>
                                    <td width={120} align='center'>
                                        {/* {e?.MetalType?.toLowerCase() === "gold" && `GD${e?.MetalPurity}`}
                                        {e?.MetalType?.toLowerCase() === "silver" && `SL${e?.MetalPurity}`}
                                        {(e?.MetalType?.toLowerCase() !== "gold" && e?.MetalType?.toLowerCase() !== "silver" ) 
                                        && `${e?.MetalType} ${e?.MetalPurity}`} */}
                                    </td>
                                    <td width={120} align='center' style={{verticalAlign:"middle"}}>
                                         {(el?.findingWt === 0 || el?.findingWt === "0" || el?.findingWt === "") ? '' : ''} {(el?.findingWt)}
                                        {/* <tr>
                                            <td>{ (e?.totals?.metal?.Wt - e?.totals?.finding?.Wt)?.toFixed(3)}</td>
                                        </tr>
                                        <tr>
                                            <td>{e?.totals?.finding?.Wt?.toFixed(3)}</td>
                                        </tr> */}
                                    </td>
                                    <td width={120}></td>
                                    <td width={120}></td>
                                    <td width={120}></td>
                                    <td width={120} align='center'>{ el?.findingRate === 0 || el?.findingRate === '' ? '' : formatAmount(el?.findingRate)}</td>
                                    <td width={120} align='center'>{ el?.findingAmount === 0 || el?.findingAmount === '' ? '' : formatAmount(el?.findingAmount)}</td>
                                    <td width={120}></td>
                                    <td width={120}></td>
                                    <td width={120}></td>
                                    <td width={120}></td>
                                    <td width={120}></td>
                                    <td width={120}></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                })
                            }
                                </React.Fragment>
                                
                            })
                        }
                        <tr>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th align='center' style={{verticalAlign:'middle'}}>{result?.mainTotal?.total_Quantity}</th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th align='center' style={{verticalAlign:'middle'}}>{result?.mainTotal?.diamonds?.Pcs}</th>
                            <th></th>
                            <th align='center' style={{verticalAlign:'middle'}}>{result?.mainTotal?.diamonds?.Wt?.toFixed(3)}</th>
                            <th></th>
                            <th align='center' style={{verticalAlign:'middle'}}>{formatAmount(result?.mainTotal?.diamonds?.Amount)}</th>
                            <th></th>
                            <th align='center' style={{verticalAlign:'middle'}}>{result?.mainTotal?.netwt?.toFixed(3)}</th>
                            <th></th>
                            <th align='center' style={{verticalAlign:'middle'}}>{formatAmount(result?.mainTotal?.metal?.Amount)}</th>
                            <th align='center' style={{verticalAlign:'middle'}}>{result?.mainTotal?.netwt?.toFixed(3)}</th>
                            <th></th>
                            <th align='center' style={{verticalAlign:'middle'}}>{formatAmount(result?.mainTotal?.total_Making_Amount)}</th>
                            <th></th>
                            <th align='center' style={{verticalAlign:'middle'}}>{formatAmount(result?.mainTotal?.total_diamondHandling)}</th>
                            <th align='center' style={{verticalAlign:'middle'}}>{(result?.mainTotal?.total_Quantity)}</th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
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

export default SaleFormatWt
