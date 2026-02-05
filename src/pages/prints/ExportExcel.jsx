// http://localhost:3000/?tkn=OTA2NTQ3MTcwMDUzNTY1MQ==&invn=SlMvMTE1NS8yNS0yNg==&evn=c2FsZQ==&pnm=ZXhwb3J0IGV4Y2Vs&up=aHR0cDovL256ZW4vam8vYXBpLWxpYi9BcHAvU2FsZUJpbGxfSnNvbg==&ctv=NzE=&ifid=PackingList3&pid=undefined&etp=ZXhjZWw=
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { apiCall, checkMsg, fixedValues, formatAmount, handleImageError, isObjectEmpty, NumberWithCommas } from '../../GlobalFunctions';
import Loader from '../../components/Loader';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import { MetalShapeNameWiseArr } from '../../GlobalFunctions/MetalShapeNameWiseArr';
import { fontFamily, fontSize } from '@mui/system';

const ExportExcel = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
    const [result, setResult] = useState(null);
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [diamondWise, setDiamondWise] = useState([]);
    const [MetShpWise, setMetShpWise] = useState([]);
    const [notGoldMetalTotal, setNotGoldMetalTotal] = useState(0);
    const [notGoldMetalWtTotal, setNotGoldMetalWtTotal] = useState(0);
    const [isImageWorking, setIsImageWorking] = useState(true);
    const handleImageErrors = () => {
        setIsImageWorking(false);
    };

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
  
    function loadData(data) {
      let address = data?.BillPrint_Json[0]?.Printlable?.split("\r\n");
      data.BillPrint_Json[0].address = address;
  
      const datas = OrganizeDataPrint(
        data?.BillPrint_Json[0],
        data?.BillPrint_Json1,
        data?.BillPrint_Json2
      );
  
      let met_shp_arr = MetalShapeNameWiseArr(datas?.json2);
  
      setMetShpWise(met_shp_arr);
      let tot_met = 0;
      let tot_met_wt = 0;
      met_shp_arr?.forEach((e, i) => {
        tot_met += e?.Amount;
        tot_met_wt += e?.metalfinewt;
      });
      setNotGoldMetalTotal(tot_met);
      setNotGoldMetalWtTotal(tot_met_wt);
  
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
      };
  
      let diaonlyrndarr1 = [];
      let diaonlyrndarr2 = [];
      let diaonlyrndarr3 = [];
      let diaonlyrndarr4 = [];
      let diarndotherarr5 = [];
      let diaonlyrndarr6 = [];
      // Step 1: Track unique MaterialTypeName values
      datas?.resultArray?.forEach((e) => {
        const materialTypes = {}; // Local object to track unique MaterialTypeName values
    
        e?.diamonds?.forEach((diamond) => {
          if (diamond?.MasterManagement_DiamondStoneTypeid === 1) {
            const materialType = diamond?.MaterialTypeName;
            if (materialType && !materialTypes[materialType]) {
              materialTypes[materialType] = materialType;
            }
          }
        });
    
        // Step 2: Add materialTypes to each element in resultArray
        e.materialTypes = materialTypes;
      });

      datas?.json2?.forEach((e) => {
        if (e?.MasterManagement_DiamondStoneTypeid === 1) {
          if (e.ShapeName?.toLowerCase() === "rnd") {
            diaonlyrndarr1.push(e);
          } else {
            diaonlyrndarr2.push(e);
          }
        }
      });
  
      diaonlyrndarr1.forEach((e) => {
        let findRecord = diaonlyrndarr3.findIndex(
          (a) =>
            e?.ShapeName === a?.ShapeName &&
            e?.QualityName === a?.QualityName &&
            e?.Colorname === a?.Colorname
        );
  
        if (findRecord === -1) {
          let obj = { ...e };
          obj.wtWt = e?.Wt;
          obj.pcPcs = e?.Pcs;
          obj.rRate = e?.Rate;
          obj.amtAmount = e?.Amount;
          diaonlyrndarr3.push(obj);
        } else {
          diaonlyrndarr3[findRecord].wtWt += e?.Wt;
          diaonlyrndarr3[findRecord].pcPcs += e?.Pcs;
          diaonlyrndarr3[findRecord].rRate += e?.Rate;
          diaonlyrndarr3[findRecord].amtAmount += e?.Amount;
        }
      });
  
      diaonlyrndarr2.forEach((e) => {
        let findRecord = diaonlyrndarr4.findIndex(
          (a) =>
            e?.ShapeName === a?.ShapeName &&
            e?.QualityName === a?.QualityName &&
            e?.Colorname === a?.Colorname
        );
  
        if (findRecord === -1) {
          let obj = { ...e };
          obj.wtWt = e?.Wt;
          obj.wtWts = e?.Wt;
          obj.pcPcs = e?.Pcs;
          obj.pcPcss = e?.Pcs;
          obj.rRate = e?.Rate;
          obj.rRates = e?.Rate;
          obj.amtAmount = e?.Amount;
          obj.amtAmounts = e?.Amount;
          diaonlyrndarr4.push(obj);
        } else {
          diaonlyrndarr4[findRecord].wtWt += e?.Wt;
          diaonlyrndarr4[findRecord].wtWts += e?.Wt;
          diaonlyrndarr4[findRecord].pcPcs += e?.Pcs;
          diaonlyrndarr4[findRecord].pcPcss += e?.Pcs;
          diaonlyrndarr4[findRecord].rRate += e?.Rate;
          diaonlyrndarr4[findRecord].rRates += e?.Rate;
          diaonlyrndarr4[findRecord].amtAmount += e?.Amount;
          diaonlyrndarr4[findRecord].amtAmounts += e?.Amount;
        }
      });
  
      diaonlyrndarr4.forEach((e) => {
        diaObj.wtWt += e?.wtWt;
        diaObj.wtWts += e?.wtWts;
        diaObj.pcPcs += e?.pcPcs;
        diaObj.pcPcss += e?.pcPcss;
        diaObj.rRate += e?.rRate;
        diaObj.rRates += e?.rRates;
        diaObj.amtAmount += e?.amtAmount;
        diaObj.amtAmounts += e?.amtAmounts;
      });
  
      diaonlyrndarr3?.forEach((e) => {
        let find_record = diaonlyrndarr6?.findIndex(
          (a) =>
            e?.ShapeName === a?.ShapeName &&
            e?.QualityName === a?.QualityName &&
            e?.Colorname === a?.Colorname
        );
        if (find_record === -1) {
          let obj = { ...e };
          obj.wtWts = e?.wtWt;
          obj.pcPcss = e?.pcPcs;
          obj.rRates = e?.rRate;
          obj.amtAmounts = e?.amtAmount;
          diaonlyrndarr6.push(obj);
        } else {
          diaonlyrndarr6[find_record].wtWts += e?.wtWt;
          diaonlyrndarr6[find_record].pcPcss += e?.pcPcs;
          diaonlyrndarr6[find_record].rRates += e?.rRate;
          diaonlyrndarr6[find_record].amtAmounts += e?.amtAmount;
        }
      });
      
        datas.resultArray = datas.resultArray.map((e) => {
            let groupedDiamonds = [];
        
            e.diamonds.forEach((diamond) => {
                let found = groupedDiamonds.findIndex(
                    (d) =>
                        d?.ShapeName === diamond?.ShapeName &&
                        d?.QualityName === diamond?.QualityName &&
                        d?.Colorname === diamond?.Colorname
                );

                if (found === -1) {
                    groupedDiamonds.push({ ...diamond, count: 1, });
                } else {
                    groupedDiamonds[found].Wt += diamond?.Wt;
                    groupedDiamonds[found].Pcs += diamond?.Pcs;
                    // groupedDiamonds[found].Rate += diamond?.Rate;
                    groupedDiamonds[found].Amount += diamond?.Amount;

                    const totalRate = groupedDiamonds[found].Rate + diamond?.Rate;
                    const count = groupedDiamonds[found].count + 1;
                    groupedDiamonds[found].Rate = totalRate / count;
                    groupedDiamonds[found].count += 1;
                }
            });

            e.diamonds = groupedDiamonds; 
            return e;
        });

        datas.resultArray = datas.resultArray.map((e) => {
            let groupedcolorstone = [];
        
            e.colorstone.forEach((clr) => {
                let found = groupedcolorstone.findIndex(
                    (d) =>
                        d?.ShapeName === clr?.ShapeName
                );

                if (found === -1) {
                    groupedcolorstone.push({ ...clr, count: 1, });
                } else {
                    groupedcolorstone[found].Wt += clr?.Wt;
                    groupedcolorstone[found].Pcs += clr?.Pcs;
                    // groupedDiamonds[found].Rate += clr?.Rate;
                    groupedcolorstone[found].Amount += clr?.Amount;

                    const totalRate = groupedcolorstone[found].Rate + clr?.Rate;
                    const count = groupedcolorstone[found].count + 1;
                    groupedcolorstone[found].Rate = totalRate / count;
                    groupedcolorstone[found].count += 1;
                }
            });

            e.colorstone = groupedcolorstone; 
            return e;
        });

      diarndotherarr5 = [...diaonlyrndarr6, diaObj];
      setDiamondWise(diarndotherarr5);
      setResult(datas);
      setTimeout(() => {
        const button = document.getElementById('test-table-xls-button');
        button.click();
      }, 500);
    }

    // console.log("result", result);
    
    // Style...
    const txtTop = {
        verticalAlign: "top",
    };
    const brRight = {
        borderRight: "1px solid #000000",
    };
    const brBotmdrk = {
        borderBottom: "1px solid #000000",
    };
    const styBld = {
        fontWeight: "bold",
    }
    const txtCen = {
        textAlign: "center",
    }
    const fntSize = {
        fontSize: "18px"
    }
    const fntSize1 = {
        fontSize: "16px"
    }

    const totalGrosswt = result?.resultArray?.reduce((acc, obj) => acc + obj.grosswt, 0);
    const totalNetWt = result?.resultArray?.reduce((acc, obj) => acc + obj.NetWt, 0);

    const total_labour_Amount = result?.resultArray?.reduce((acc, e) => {
      return acc + (e?.MaKingCharge_Unit * e?.NetWt);
    }, 0);
    
    return (
        <>
            {loader ? <Loader /> : msg === "" ?
                <> <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="download-table-xls-button btn btn-success text-black bg-success px-2 py-1 fs-5 d-none"
                    table="table-to-xls"
                    filename={`Export_Excel_${result?.header?.InvoiceNo}_${Date.now()}`}
                    sheet="tablexls"
                    buttonText="Download as XLS" />
                    <table id="table-to-xls" className='d-none'>
                        <tbody>
                            <tr>
                                <th width={100} height={45} style={{ ...brRight, ...brBotmdrk, ...fntSize }}>U CODE</th>
                                <th width={100} style={{ ...brRight, ...brBotmdrk, ...fntSize }}>DATE</th>
                                <th width={100} style={{ ...brRight, ...brBotmdrk, ...fntSize }}>BILL NO</th>
                                <th width={80} style={{ ...brRight, ...brBotmdrk, ...fntSize }}>SR NO</th>
                                <th width={100} style={{ ...brRight, ...brBotmdrk, ...fntSize }}>STYLE NO</th>
                                <th width={100} style={{ ...brRight, ...brBotmdrk, ...fntSize }}>SUP STYLE</th>
                                <th width={100} style={{ ...brRight, ...brBotmdrk, ...fntSize }}>ITEM</th>
                                <th width={100} style={{ ...brRight, ...brBotmdrk, ...fntSize }}>G.WT</th>
                                <th width={100} style={{ ...brRight, ...brBotmdrk, ...fntSize }}>N.WT</th>
                                <th width={100} style={{ ...brRight, ...brBotmdrk, ...fntSize }}>PURITY</th>
                                <th width={100} style={{ ...brRight, ...brBotmdrk, ...fntSize }}>G RATE</th>
                                <th width={100} style={{ ...brRight, ...brBotmdrk, ...fntSize }}>G AMT</th>
                                <th width={100} style={{ ...brRight, ...brBotmdrk, ...fntSize }}>SHAPE</th>
                                <th width={100} style={{ ...brRight, ...brBotmdrk, ...fntSize }}>QLTY</th>
                                <th width={100} style={{ ...brRight, ...brBotmdrk, ...fntSize }}>CLR</th>
                                <th width={100} style={{ ...brRight, ...brBotmdrk, ...fntSize }}>PCS</th>
                                <th width={100} style={{ ...brRight, ...brBotmdrk, ...fntSize }}>CTS</th>
                                <th width={100} style={{ ...brRight, ...brBotmdrk, ...fntSize }}>D RATE</th>
                                <th width={100} style={{ ...brRight, ...brBotmdrk, ...fntSize }}>D AMT</th>
                                <th width={100} style={{ ...brRight, ...brBotmdrk, ...fntSize }}>T D PCS</th>
                                <th width={100} style={{ ...brRight, ...brBotmdrk, ...fntSize }}>T D WT</th>
                                <th width={100} style={{ ...brRight, ...brBotmdrk, ...fntSize }}>CS</th>
                                <th width={100} style={{ ...brRight, ...brBotmdrk, ...fntSize }}>CS PCS</th>
                                <th width={100} style={{ ...brRight, ...brBotmdrk, ...fntSize }}>CS WT</th>
                                <th width={100} style={{ ...brRight, ...brBotmdrk, ...fntSize }}>CS RATE</th>
                                <th width={100} style={{ ...brRight, ...brBotmdrk, ...fntSize }}>CS AMT</th>
                                <th width={100} style={{ ...brRight, ...brBotmdrk, ...fntSize }}>T CS PCS</th>
                                <th width={100} style={{ ...brRight, ...brBotmdrk, ...fntSize }}>T CS AMT</th>
                                <th width={100} style={{ ...brRight, ...brBotmdrk, ...fntSize }}>T D AMT</th>
                                <th width={100} style={{ ...brRight, ...brBotmdrk, ...fntSize }}>L RATE</th>
                                <th width={100} style={{ ...brRight, ...brBotmdrk, ...fntSize }}>LBR AMT</th>
                                <th width={100} style={{ ...brRight, ...brBotmdrk, ...styBld, ...fntSize }}>TOTAL US$</th>
                            </tr>

                            <tr>
                                <td width={100} height={35} style={{ ...txtCen, ...styBld, ...fntSize1 }}></td>
                                <td width={100} style={{ ...txtCen, ...styBld, ...fntSize1 }}></td>
                                <td width={100} style={{ ...txtCen, ...styBld, ...fntSize1 }}></td>
                                <td width={80} style={{ ...txtCen, ...styBld, ...fntSize1 }}>Total</td>
                                <td width={100} style={{ ...txtCen, ...styBld, ...fntSize1 }}></td>
                                <td width={100} style={{ ...txtCen, ...styBld, ...fntSize1 }}></td>
                                <td width={100} style={{ ...txtCen, ...styBld, ...fntSize1 }}></td>
                                <td width={100} style={{ ...txtCen, ...styBld, ...fntSize1 }}>
                                    {totalGrosswt?.toFixed(3)}
                                </td>
                                <td width={100} style={{ ...txtCen, ...styBld, ...fntSize1 }}>
                                    {totalNetWt?.toFixed(3)}
                                </td>
                                <td width={100} style={{ ...txtCen, ...styBld, ...fntSize1 }}></td>
                                <td width={100} style={{ ...txtCen, ...styBld, ...fntSize1 }}></td>
                                <td width={100} style={{ ...txtCen, ...styBld, ...fntSize1 }}></td>
                                <td width={100} style={{ ...txtCen, ...styBld, ...fntSize1 }}></td>
                                <td width={100} style={{ ...txtCen, ...styBld, ...fntSize1 }}></td>
                                <td width={100} style={{ ...txtCen, ...styBld, ...fntSize1 }}>
                                    {/* {fixedValues( () + (result?.mainTotal?.colorstone?.Wt),3 )} */}
                                </td>
                                <td width={100} style={{ ...txtCen, ...styBld, ...fntSize1 }}>
                                    {result?.mainTotal?.diamonds?.Pcs}
                                </td>
                                <td width={100} style={{ ...txtCen, ...styBld, ...fntSize1 }}>
                                    {fixedValues(result?.mainTotal?.diamonds?.Wt,3)}
                                </td>
                                <td width={100} style={{ ...txtCen, ...styBld, ...fntSize1 }}></td>
                                <td width={100} style={{ ...txtCen, ...styBld, ...fntSize1 }}>
                                    {formatAmount(result?.mainTotal?.diamonds?.Amount,2)}
                                </td>
                                <td width={100} style={{ ...txtCen, ...styBld, ...fntSize1 }}>
                                    {result?.mainTotal?.diamonds?.Pcs}
                                </td>
                                <td width={100} style={{ ...txtCen, ...styBld, ...fntSize1 }}>
                                    {fixedValues(result?.mainTotal?.diamonds?.Wt,3)}
                                </td>
                                <td width={100} style={{ ...txtCen, ...styBld, ...fntSize1 }}></td>
                                <td width={100} style={{ ...txtCen, ...styBld, ...fntSize1 }}>
                                    {result?.mainTotal?.colorstone?.Pcs}
                                </td>
                                <td width={100} style={{ ...txtCen, ...styBld, ...fntSize1 }}>
                                    {fixedValues(result?.mainTotal?.colorstone?.Wt,3)}
                                </td>
                                <td width={100} style={{ ...txtCen, ...styBld, ...fntSize1 }}></td>
                                <td width={100} style={{ ...txtCen, ...styBld, ...fntSize1 }}>
                                    {formatAmount(result?.mainTotal?.colorstone?.Amount,2)}
                                </td>
                                <td width={100} style={{ ...txtCen, ...styBld, ...fntSize1 }}>
                                    {result?.mainTotal?.colorstone?.Pcs}
                                </td>
                                <td width={100} style={{ ...txtCen, ...styBld, ...fntSize1 }}>
                                    {formatAmount(result?.mainTotal?.colorstone?.Amount,2)}
                                </td>
                                <td width={100} style={{ ...txtCen, ...styBld, ...fntSize1 }}>
                                    {formatAmount(result?.mainTotal?.diamonds?.Amount,2)}
                                </td>
                                <td width={100} style={{ ...txtCen, ...styBld, ...fntSize1 }}></td>
                                <td width={100} style={{ ...txtCen, ...styBld, ...fntSize1 }}>
                                    {formatAmount(total_labour_Amount,2)}
                                </td>
                                <td width={100} style={{ ...txtCen, ...styBld, ...fntSize1 }}>
                                    {formatAmount(result?.mainTotal?.metal?.Amount + result?.mainTotal?.colorstone?.Amount + result?.mainTotal?.diamonds?.Amount + total_labour_Amount,2 )}
                                </td>
                            </tr>

                            {result?.resultArray?.map((e, i) => {
                                return <tr key={i}>
                                    <td width={100} style={{ ...txtTop, ...txtCen, }}></td>

                                    <td width={100} style={{ ...txtTop, ...styBld, ...txtCen, }}>{i === 0 && <div>{result?.header?.EntryDate}</div>}</td>

                                    <td width={100} style={{ ...txtTop, ...txtCen, }}>{i === 0 && <div>{result?.header?.InvoiceNo}</div>}</td>

                                    <td width={80} style={{ ...txtTop, ...txtCen, }}><div>{i + 1}</div></td>

                                    <td width={100} style={{ ...txtTop, ...txtCen, }}>{e?.SrJobno}</td>

                                    <td width={100} style={{ ...txtTop, ...txtCen, }}>
                                        <div>{e?.designno}</div>
                                    </td>

                                    <td width={100} style={{ ...txtTop, ...txtCen, }}>
                                        <div>{e?.Categoryname}</div>
                                    </td>

                                    <td width={100} style={{ ...txtTop, ...txtCen, }}>
                                        <div>{fixedValues(e?.grosswt,3)}</div>
                                    </td>

                                    <td width={100} style={{ ...txtTop, ...txtCen, }}>
                                        {/* <div>{fixedValues(e?.NetWt,3)}</div> */}
                                        {e?.metal?.map((el, id) => (<div key={id}>{fixedValues(el?.Wt,3)}</div>))}
                                    </td>

                                    <td width={100} style={{ ...txtTop, ...txtCen, }}>
                                        {e?.metal?.map((el, id) => (<div key={id}>{el?.QualityName}</div>))}
                                    </td>
                                    
                                    <td width={100} style={{ ...txtTop, ...txtCen, }}>
                                        {e?.metal?.map((el, id) => (<div key={id}>{NumberWithCommas(el?.Rate,2)}</div>))}
                                    </td>

                                    <td width={100} style={{ ...txtTop, ...txtCen, }}>
                                        {e?.metal?.map((el, id) => (<div key={id}>{NumberWithCommas(el?.Amount,2)}</div>))}
                                    </td>

                                    <td width={100} style={{ ...txtTop, ...txtCen, }}>
                                        {e?.diamonds?.map((el, id) => (
                                            <div key={id}>{el?.ShapeName}</div>
                                        ))}
                                    </td> 

                                    <td width={100} style={{ ...txtTop, ...txtCen, }}>
                                        {e?.diamonds?.map((el, id) => (
                                            <div key={id}>{el?.QualityName}</div>
                                        ))}
                                    </td>

                                    <td width={100} style={{ ...txtTop, ...txtCen, }}>
                                        {e?.diamonds?.map((el, id) => (
                                            <div key={id}>{el?.Colorname}</div>
                                        ))}
                                    </td>

                                    <td width={100} style={{ ...txtTop, ...txtCen, }}>
                                        {e?.diamonds?.map((el, id) => (
                                            <div key={id}>{el?.Pcs}</div>
                                        ))}
                                    </td>
                                    
                                    <td width={100} style={{ ...txtTop, ...txtCen, }}>
                                        {e?.diamonds?.map((el, id) => (
                                            <div key={id}>{fixedValues(el?.Wt,3)}</div>
                                        ))}
                                    </td>

                                    <td width={100} style={{ ...txtTop, ...txtCen, }}>
                                        {e?.diamonds?.map((el, id) => (
                                            <div key={id}>{formatAmount(el?.Rate,2)}</div>
                                        ))}
                                    </td>

                                    <td width={100} style={{ ...txtTop, ...txtCen, }}>
                                        {e?.diamonds?.map((el, id) => (
                                            <div key={id}>{formatAmount(el?.Amount,2)}</div>
                                        ))}
                                    </td>

                                    <td width={100} style={{ ...txtTop, ...txtCen, }}>
                                        {e?.totals?.diamonds?.Pcs}
                                    </td>

                                    <td width={100} style={{ ...txtTop, ...txtCen, }}>
                                        {fixedValues(e?.totals?.diamonds?.Wt,3)}
                                    </td>

                                    <td width={100} style={{ ...txtTop, ...txtCen, }}>
                                        {e?.colorstone?.map((el, id) => (
                                            <div key={id}>{el?.ShapeName}</div>
                                        ))}
                                    </td>

                                    <td width={100} style={{ ...txtTop, ...txtCen, }}>
                                        {e?.colorstone?.map((el, id) => (
                                            <div key={id}>{el?.Pcs}</div>
                                        ))}
                                    </td>

                                    <td width={100} style={{ ...txtTop, ...txtCen, }}>
                                        {e?.colorstone?.map((el, id) => (
                                            <div key={id}>{fixedValues(el?.Wt,3)}</div>
                                        ))}    
                                    </td>

                                    <td width={100} style={{ ...txtTop, ...txtCen, }}>
                                        {e?.colorstone?.map((el, id) => (
                                            <div key={id}>{formatAmount(el?.Rate,2)}</div>
                                        ))}
                                    </td>

                                    <td width={100} style={{ ...txtTop, ...txtCen, }}>
                                        {e?.colorstone?.map((el, id) => (
                                            <div key={id}>{formatAmount(el?.Amount,2)}</div>
                                        ))}
                                    </td>

                                    <td width={100} style={{ ...txtTop, ...txtCen, }}>
                                        {e?.totals?.colorstone?.Pcs}
                                    </td>

                                    <td width={100} style={{ ...txtTop, ...txtCen, }}>
                                        {formatAmount(e?.totals?.colorstone?.Amount,2)}
                                    </td>

                                    <td width={100} style={{ ...txtTop, ...txtCen, }}>
                                        {formatAmount(e?.totals?.diamonds?.Amount,2)}
                                    </td>

                                    <td width={100} style={{ ...txtTop, ...txtCen, }}>
                                        <div>{formatAmount(e?.MaKingCharge_Unit,2)}</div>
                                    </td>

                                    <td width={100} style={{ ...txtTop, ...txtCen, }}>
                                        {formatAmount(e?.MaKingCharge_Unit * e?.NetWt,2)}
                                    </td>

                                    <td width={100} style={{ ...txtTop, ...txtCen, }}>
                                        {formatAmount(e?.totals?.metal?.Amount + e?.totals?.colorstone?.Amount + e?.totals?.diamonds?.Amount + e?.MakingAmount,2)}
                                    </td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </> 
            : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>}
        </>
    )
}

export default ExportExcel;