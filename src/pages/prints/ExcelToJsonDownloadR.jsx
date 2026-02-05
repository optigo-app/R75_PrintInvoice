import React from 'react';
import { useState } from 'react';
import Loader from '../../components/Loader';
import { useEffect } from 'react';
import { NumberWithCommas, apiCall, checkMsg, isObjectEmpty, shapeColorQuality } from '../../GlobalFunctions';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import style from "../../assets/css/prints/exporttojsondownloadR.module.css";
import { OrganizeDataPrint } from "./../../GlobalFunctions/OrganizeDataPrint";
import lodash from 'lodash';

const ExcelToJsonDownloadR = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [header, setHeader] = useState({});
    const [data, setData] = useState([]);
    const [botTable, setBotTable] = useState([]);
    const [isImageWorking, setIsImageWorking] = useState(true);
  const handleImageErrors = () => {
    setIsImageWorking(false);
  };
    const loadData = (data) => {
        let arr = [];
        data?.BillPrint_Json1?.forEach((e) => {
            data?.BillPrint_Json3?.forEach((a) => {
                if(e?.SrJobno === a?.StockBarcode){

                    let obj = {...e};

                    obj.ReceivedGrossWt = a?.grosswt;
                    obj.ReceivedNetWt = a?.netwt;
                    obj.ReceivedDiaWt = a?.TotalODiamondWt;
                    obj.ReceivedCSWt = a?.TotalOColorStoneWt;
                    obj.ReceivedMiscWt = a?.TotalOMiscWt;

                    obj.RepairedGrossWt = a?.Ret_RepairGrossWeightDiff;
                    obj.RepairedNetWt = a?.RepairNetWeightDiff;
                    obj.RepairedDiaWt = a?.RepairDiaWtAdded;
                    obj.RepairedCSWt = a?.RepairCSWtAdded;
                    obj.RepairedMiscWt = a?.RepairMiscWtAdded;

                    obj.DetachNetWt = a?.DetachNetWeight;
                    obj.DetachDiaWt = a?.DetachDiaWeight;
                    obj.DetachCSWt = a?.DetachCSWeight;
                    obj.DetachMiscWt = a?.DetachMiscWeight;
                    
                    arr.push(obj);
                }
            })
        })
        data.BillPrint_Json1 = arr;
        let datas = OrganizeDataPrint(
            data?.BillPrint_Json[0],
            data?.BillPrint_Json1,
            data?.BillPrint_Json2,
            data?.BillPrint_Json3,
        );
        setHeader(datas?.header);
        let resultArr = [];
        datas?.resultArray?.forEach((e, i) => {
            
            let obj = { ...e };
            let diaClr = [...obj?.diamonds, ...obj?.colorstone].flat();
            let findMetal = obj?.metal.findIndex(ele => ele?.IsPrimaryMetal);
            let metalrate = 0;
            let checkIsImage = obj?.DesignImage !== "" ? true : false;
            if (findMetal !== -1) {
                metalrate = obj?.metal[findMetal]?.Rate;
            }
            let miscCeramic = obj?.misc?.reduce((acc, cobj) => { if (cobj?.ShapeName === "CERAMIC") { return acc + cobj?.Wt } return acc; }, 0);
            let borderBottom = diaClr.length > 4 ? diaClr.length - 1 : 0;
            diaClr.forEach((ele, ind) => {
                let objectType = {
                    src: ind === 1 ? obj?.DesignImage : "",
                    image: ind === 1 ? (obj?.DesignImage !== "" ? true : false) : false,
                    consumableAdd: ind === 0 ? obj?.totals?.colorstone?.Wt : 0,
                    blankLines: false,
                    SrJobno: ind === 0 ? obj?.SrJobno : "",
                    id: ind === 0 ? i + 1 : 0,
                    mtpyColName: ind === 0 ? obj?.MetalPurity + " " + obj?.MetalColor : "",
                    Quantity: ind === 0 ? obj?.Quantity : 0,
                    metalRate: ind === 0 ? metalrate : 0,
                    diamondHandlingChanges: ind === 0 ? obj?.TotalDiamondHandling : 0,
                    labourPerGm: ind === 0 ? obj?.MaKingCharge_Unit : 0,
                    diaclrquality: ele?.QualityName,
                    diaclrsize: ele?.SizeName,
                    diaclrPcs: ele?.Pcs,
                    diaclrWt: ele?.Wt,
                    diaclrRate: ele?.Rate,
                    diaAmount: ele?.Amount,
                    miscCeramic: ind === 0 ? miscCeramic : 0,
                    metalLabour: ind === 0 ? obj?.MakingAmount : 0,
                    findAmount: ind === 0 ? obj?.totals?.finding?.Amount : 0,
                    metalAmount: ind === 0 ? obj?.totals?.metal?.Amount : 0,
                    eneaml: (ind === 0 && obj?.totals?.colorstone?.Amount !== 0) ? obj?.totals?.colorstone?.Amount : 0,
                    otherCharges: ind === 0 ? obj?.OtherCharges : 0,
                    TotalAmount: ind === 0 ? obj?.TotalAmount : 0,
                    borderBottom: (checkIsImage ? ((ind === borderBottom && borderBottom !== 0) ? true : false) : ((ind === diaClr.length - 1) ? true : false)),

                    issueWeight : ind === 0 ? obj?.ReceivedGrossWt : 0,
                    AfterRepair : ind === 0 ? obj?.RepairedGrossWt : 0,
                    RepairWeightLoss : ind === 0 ? obj?.DetachNetWt : 0,
                    RepairGoldAddInProduct : ind === 0 ? obj?.NeWt : 0,
                    ReturnGoldToCaratlaneWeight : ind === 0 ? obj?.DetachNetWt : 0,
                    CertificateNo: ind === 0 ? obj?.CertificateNo : '' , 
                    Length : ind === 0 ? obj?.Size : ''

                };
                resultArr.push(objectType);
            });

            if (diaClr?.length === 0) {
                let objectType = {
                    src: "",
                    image: false,
                    blankLines: false,
                    consumableAdd: obj?.totals?.colorstone?.Wt,
                    id: i + 1,
                    SrJobno: obj?.SrJobno,
                    mtpyColName: obj?.MetalPurity + " " + obj?.MetalColor,
                    Quantity: obj?.Quantity,
                    metalRate: metalrate,
                    diamondHandlingChanges: obj?.TotalDiamondHandling,
                    labourPerGm: obj?.MaKingCharge_Unit,
                    diaclrquality: "",
                    diaclrsize: "",
                    diaclrPcs: 0,
                    diaclrWt: 0,
                    diaclrRate: 0,
                    diaAmount: 0,
                    miscCeramic: miscCeramic,
                    metalLabour: obj?.MakingAmount,
                    findAmount: obj?.totals?.finding?.Amount,
                    metalAmount: obj?.totals?.metal?.Amount,
                    eneaml: (obj?.totals?.colorstone?.Amount !== 0) ? obj?.totals?.colorstone?.Amount : 0,
                    otherCharges: obj?.OtherCharges,
                    TotalAmount: obj?.TotalAmount,
                    borderBottom: false,

                    issueWeight :  obj?.ReceivedGrossWt ,
                    AfterRepair :  obj?.RepairedGrossWt ,
                    RepairWeightLoss :  obj?.DetachNetWt ,
                    RepairGoldAddInProduct :  obj?.NetWt ,
                    ReturnGoldToCaratlaneWeight :  obj?.DetachNetWt ,
                    CertificateNo:  obj?.CertificateNo,
                    Length :  obj?.Size,

                };
                resultArr.push(objectType);
                let objectTypes = {
                    blankLines: false,
                    image: obj?.DesignImage !== "" ? true : false,
                    src: obj?.DesignImage,
                    id: 0,
                    mtpyColName: "",
                    SrJobno: "",
                    consumableAdd: 0,
                    Quantity: 0,
                    metalRate: 0,
                    diamondHandlingChanges: 0,
                    labourPerGm: 0,
                    diaclrquality: "",
                    diaclrsize: "",
                    diaclrPcs: 0,
                    diaclrWt: 0,
                    diaclrRate: 0,
                    diaAmount: 0,
                    miscCeramic: 0,
                    metalLabour: 0,
                    findAmount: 0,
                    metalAmount: 0,
                    eneaml: 0,
                    otherCharges: 0,
                    TotalAmount: 0,
                    borderBottom: checkIsImage ? false : true,

                    issueWeight :  0 ,
                    AfterRepair :  0 ,
                    RepairWeightLoss :  0 ,
                    RepairGoldAddInProduct :  0 ,
                    ReturnGoldToCaratlaneWeight :  0 ,
                    CertificateNo:  '',
                    Length :  ''

                };
                resultArr.push(objectTypes);
            }

            if (checkIsImage) {
                if (diaClr?.length < 5) {
                    Array.from({ length: 5 - diaClr?.length }).forEach((ele, index) => {
                        let objectTypes = {
                            blankLines: true,
                            borderBottom: index === (4 - diaClr?.length) ? true : false
                        };
                        resultArr.push(objectTypes);
                    })
                }
            }
        });


        let datass = lodash.cloneDeep(datas);
        



        datass.resultArray = resultArr;
        setData(datass);
        let shapeColQualityArr = shapeColorQuality(data?.BillPrint_Json2);
        let diamonds = shapeColQualityArr?.withoutRate?.diamonds;
        let taxArr = [];
        // datass?.allTaxes
        let discountFinalAmountCount = datass?.total_discount_amount > 0 ? 2 : 1;
        let len = ((datass?.allTaxes?.length + discountFinalAmountCount) > shapeColQualityArr?.withoutRate?.diamonds?.length ? datass?.allTaxes?.length : shapeColQualityArr?.withoutRate?.diamonds?.length);

        if (datass?.total_discount_amount > 0) {
            taxArr.push({ name: "Discount%", amount: datass?.mainTotal?.total_discount_amount, per: "" });
        }
        datass?.allTaxes.forEach((ele, ind) => {
            taxArr.push(ele);
        });
        taxArr.push({ name: "Final Amount", amount: datass?.finalAmount, per: "" });
        let bottomTable = [];
        bottomTable.push({
            title1: "Stone",
            shape: "Shape",
            quality: "Quality",
            color: "Grade",
            title2: "",
            amount: 0,
        });
        Array.from({ length: len - 1 }).forEach((ele, ind) => { 
            let obj = {
                title1: diamonds[ind] ? "Diamond" : "",
                shape: diamonds[ind] ? diamonds[ind]?.ShapeName : "",
                quality: diamonds[ind] ? diamonds[ind]?.QualityName : "",
                color: diamonds[ind] ? diamonds[ind]?.Colorname : "",
                title2: taxArr[ind] ? (taxArr[ind]?.name + " " + taxArr[ind]?.per) : "",
                amount: taxArr[ind] ? (+taxArr[ind]?.amount) : 0,
            }
            bottomTable.push(obj);
        });
        setBotTable(bottomTable);
        setTimeout(() => {
            const button = document.getElementById('test-table-xls-button');
            if (button !== null) {
                button.click();
            }
        }, 0);
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
    }, []);
    return (
        <>{loader ? <Loader /> : msg === "" ?
            <div className='d-none'>
                <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="download-table-xls-button btn btn-success text-black bg-success px-2 py-1 fs-5 d-none"
                    table="table-to-xls"
                    // filename={`Sale_Format_R_${header?.InvoiceNo}_${Date.now()}`}
                    filename={`Repair_Packing_List_${header?.InvoiceNo}_${Date.now()}`}
                    sheet="tablexls"
                    buttonText="Download as XLS" />
                <table id='table-to-xls' className={`${style?.excelToJsonDownloadATable}`}>
                    <thead>
                        <tr>
                            <th width={80} style={{ border: "0.5px solid #000", padding: "1px" }}>#</th>
                            <th width={200} style={{ border: "0.5px solid #000", padding: "1px" }}>Barcode Number</th>
                            <th width={100} style={{ border: "0.5px solid #000", padding: "1px" }}>SKU No.</th>
                            <th width={80} style={{ border: "0.5px solid #000", padding: "1px" }}>Length </th>
                            <th width={160} style={{ border: "0.5px solid #000", padding: "1px" }}>Kt/Clr </th>
                            <th width={80} style={{ border: "0.5px solid #000", padding: "1px" }}>Pcs </th>
                            <th width={120} style={{ border: "0.5px solid #000", padding: "1px" }}>Metal Rate</th>
                            <th width={120} style={{ border: "0.5px solid #000", padding: "1px" }}>Issue Weight</th>
                            <th width={120} style={{ border: "0.5px solid #000", padding: "1px" }}>After Repair Weight</th>
                            <th width={120} style={{ border: "0.5px solid #000", padding: "1px" }}>Repair Weight Loss</th>
                            <th width={120} style={{ border: "0.5px solid #000", padding: "1px" }}>Repair Gold Add in product</th>
                            <th width={120} style={{ border: "0.5px solid #000", padding: "1px" }}>Return Gold to Caratlane Weight</th>
                            <th width={120} style={{ border: "0.5px solid #000", padding: "1px" }}>Consumable Add</th>
                            <th width={120} style={{ border: "0.5px solid #000", padding: "1px" }}>Consumable  Loss</th>
                            <th width={80} style={{ border: "0.5px solid #000", padding: "1px" }}>Quality</th>
                            <th width={80} style={{ border: "0.5px solid #000", padding: "1px" }}>Sieve Size</th>
                            <th width={80} style={{ border: "0.5px solid #000", padding: "1px" }}>Pcs</th>
                            <th width={80} style={{ border: "0.5px solid #000", padding: "1px" }}>Wt.</th>
                            <th width={80} style={{ border: "0.5px solid #000", padding: "1px" }}>Rate </th>
                            <th width={80} style={{ border: "0.5px solid #000", padding: "1px" }}>Amount</th>
                            <th width={120} style={{ border: "0.5px solid #000", padding: "1px" }}>Certificate No</th>
                            <th width={80} style={{ border: "0.5px solid #000", padding: "1px" }}>Fnd Amt</th>
                            <th width={80} style={{ border: "0.5px solid #000", padding: "1px" }}>Metal Amt.</th>
                            <th width={120} style={{ border: "0.5px solid #000", padding: "1px" }}>GS Handling Charges</th>
                            <th width={80} style={{ border: "0.5px solid #000", padding: "1px" }}>Labour Per Gm</th>
                            <th width={80} style={{ border: "0.5px solid #000", padding: "1px" }}>Enemal</th>
                            <th width={80} style={{ border: "0.5px solid #000", padding: "1px" }}>Sandblast</th>
                            <th width={80} style={{ border: "0.5px solid #000", padding: "1px" }}>Metal Labour</th>
                            <th width={120} style={{ border: "0.5px solid #000", padding: "1px" }}>Cert/HallMark. Charges</th>
                            <th width={80} style={{ border: "0.5px solid #000", padding: "1px" }}>Total Amount</th>
                            <th width={80} style={{ border: "0.5px solid #000", padding: "1px" }}>REMARK</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.resultArray?.map((e, i) => {
                            console.log(e);
                            
                            return (e?.blankLines ?
                                <tr key={i}>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }}></td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }}></td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }}></td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }}> </td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }}>  </td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }}> </td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }}></td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }}></td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }}></td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }}></td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }}></td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }}></td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }}></td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }}></td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }}></td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }}></td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }}></td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }}></td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }}></td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }}></td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }}></td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }}></td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }}></td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }}></td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }}></td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }}></td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }}> </td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }}></td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }}></td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }}></td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }}></td>
                                </tr> :
                                <tr key={i}>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }}>{e?.id !== 0 && NumberWithCommas(e?.id, 0)}</td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }}>
                                        {e?.image && <img src={e?.src} alt="" width={275} height={75} />}
                                        {e?.SrJobno !== "" && e?.SrJobno}
                                    </td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }}></td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }} align='left'>{e?.Length}</td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }} align='left'>{e?.mtpyColName}  </td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }} align='right'>&nbsp;{e?.Quantity !== 0 && NumberWithCommas(e?.Quantity, 0)} </td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }} align='right'>&nbsp;{e?.metalRate !== 0 && NumberWithCommas(e?.metalRate, 2)}</td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }} align='right'>{e?.issueWeight !== 0 && NumberWithCommas(e?.issueWeight, 3)}</td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }} align='right'>&nbsp;{e?.AfterRepair !== 0 && NumberWithCommas(e?.AfterRepair, 3)}</td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }} align='right'>&nbsp;{e?.RepairWeightLoss !== 0 && NumberWithCommas(e?.RepairWeightLoss, 3)}</td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }} align='right'>{e?.RepairGoldAddInProduct !== 0 && NumberWithCommas(e?.RepairGoldAddInProduct, 3)}</td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }} align='right'>{e?.ReturnGoldToCaratlaneWeight !== 0 && NumberWithCommas(e?.ReturnGoldToCaratlaneWeight, 3)}</td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }} align='right'>&nbsp;{e?.consumableAdd !== 0 && NumberWithCommas(e?.consumableAdd, 3)}</td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }} align='right'>&nbsp;{e?.eneaml !== 0 && NumberWithCommas(e?.eneaml, 2)} </td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }} align='left'>{e?.diaclrquality}</td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }} align='left'>{e?.diaclrsize}</td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }} align='right'>&nbsp;{e?.diaclrPcs !== 0 && NumberWithCommas(e?.diaclrPcs, 0)}</td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }} align='right'>&nbsp;{e?.diaclrWt !== 0 && NumberWithCommas(e?.diaclrWt, 3)}</td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }} align='right'>&nbsp;{e?.diaclrRate !== 0 && NumberWithCommas(e?.diaclrRate, 2)}</td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }} align='right'>&nbsp;{e?.diaAmount !== 0 && NumberWithCommas(e?.diaAmount, 2)}</td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }} align='left'>{e?.CertificateNo !== '' && e?.CertificateNo}</td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }} align='right'>&nbsp;{e?.findAmount !== 0 && NumberWithCommas(e?.findAmount, 2)}</td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }} align='right'>&nbsp;{e?.metalAmount !== 0 && NumberWithCommas(e?.metalAmount, 2)}</td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }} align='right'>&nbsp;{e?.diamondHandlingChanges !== 0 && NumberWithCommas(e?.diamondHandlingChanges, 2)}</td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }} align='right'>&nbsp;{e?.labourPerGm !== 0 && NumberWithCommas(e?.labourPerGm, 3)}</td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }} align='right'>&nbsp;{e?.miscCeramic !== 0 && NumberWithCommas(e?.miscCeramic, 3)}</td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }}> </td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }} align='right'>&nbsp;{e?.metalLabour !== 0 && NumberWithCommas(e?.metalLabour, 2)}</td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }} align='right'>&nbsp;{e?.otherCharges !== 0 && NumberWithCommas(e?.otherCharges, 2)}</td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }} align='right'>&nbsp;{e?.TotalAmount !== 0 && NumberWithCommas(e?.TotalAmount, 2)}</td>
                                    <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${e?.borderBottom && "0.5px solid #000"}`, padding: "1px" }}></td>
                                </tr>)
                        })
                        }
                        {/* total */}
                        <tr>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: "0.5px solid #000", padding: "1px" }} rowSpan={2} colSpan={5} align="center"><b>SubTotal :</b></td>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: "0.5px solid #000", padding: "1px" }} rowSpan={2} align="right">&nbsp;{NumberWithCommas(data?.mainTotal?.total_Quantity, 0)}</td>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: "0.5px solid #000", padding: "1px" }} rowSpan={2} ></td>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}></td>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}></td>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}></td>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}></td>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}></td>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }} ></td>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }} ></td>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }} colSpan={2}>DI </td>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }} align="right">&nbsp;{NumberWithCommas(data?.mainTotal?.diamonds?.Pcs, 0)}</td>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }} align="right">&nbsp;{NumberWithCommas(data?.mainTotal?.diamonds?.Wt, 3)}</td>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}></td>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }} align="right">&nbsp;{NumberWithCommas(data?.mainTotal?.diamonds?.Amount, 2)}</td>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}></td>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}></td>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }} align="right">&nbsp;{NumberWithCommas(data?.mainTotal?.MetalAmount, 2)}</td>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}></td>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}></td>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}></td>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}></td>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }} align="right">&nbsp;{NumberWithCommas(data?.mainTotal?.total_Making_Amount, 2)}</td>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }} align="right">&nbsp;{NumberWithCommas(data?.mainTotal?.total_otherChargesMiscHallStamp, 2)}</td>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }} align="right">&nbsp;{NumberWithCommas(data?.mainTotal?.total_amount, 2)}</td>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", padding: "1px" }}></td>
                        </tr>
                        <tr>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: "0.5px solid #000", padding: "1px" }}></td>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: "0.5px solid #000", padding: "1px" }}></td>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: "0.5px solid #000", padding: "1px" }}></td>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: "0.5px solid #000", padding: "1px" }}></td>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: "0.5px solid #000", padding: "1px" }}></td>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: "0.5px solid #000", padding: "1px" }} ></td>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: "0.5px solid #000", padding: "1px" }} ></td>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: "0.5px solid #000", padding: "1px" }} colSpan={2}>cs </td>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: "0.5px solid #000", padding: "1px" }} align="right">&nbsp;{NumberWithCommas(data?.mainTotal?.diamonds?.Pcs, 0)}</td>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: "0.5px solid #000", padding: "1px" }} align="right">&nbsp;{NumberWithCommas(data?.mainTotal?.diamonds?.Wt, 3)}</td>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: "0.5px solid #000", padding: "1px" }}></td>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: "0.5px solid #000", padding: "1px" }} align="right">&nbsp;{NumberWithCommas(data?.mainTotal?.diamonds?.Amount, 2)}</td>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: "0.5px solid #000", padding: "1px" }}></td>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: "0.5px solid #000", padding: "1px" }}></td>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: "0.5px solid #000", padding: "1px" }}></td>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: "0.5px solid #000", padding: "1px" }}></td>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: "0.5px solid #000", padding: "1px" }}></td>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: "0.5px solid #000", padding: "1px" }}></td>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: "0.5px solid #000", padding: "1px" }}></td>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: "0.5px solid #000", padding: "1px" }}></td>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: "0.5px solid #000", padding: "1px" }}></td>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: "0.5px solid #000", padding: "1px" }}></td>
                            <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: "0.5px solid #000", padding: "1px" }}></td>
                        </tr>
                        {/* bottom table */}
                        {botTable.map((e, i) => {
                            return <tr key={i}>
                                {i === 0 && <td rowSpan={botTable?.length} style={{borderBottom: "0.5px solid #000"}}></td>}
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${i === botTable.length-1 && `0.5px solid #000`}`, padding: "1px" }} align="left">{i === 0 ? <b>{e?.title1}</b> : e?.title1}</td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${i === botTable.length-1 && `0.5px solid #000`}`, padding: "1px" }} align="left">{i === 0 ? <b>{e?.shape}</b> : e?.shape}</td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${i === botTable.length-1 && `0.5px solid #000`}`, padding: "1px" }} align="left">{i === 0 ? <b>{e?.quality}</b> : e?.quality}</td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${i === botTable.length-1 && `0.5px solid #000`}`, padding: "1px" }} align="left">{i === 0 ? <b>{e?.color}</b> : e?.color}</td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${i === botTable.length-1 && `0.5px solid #000`}`, padding: "1px" }} ></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${i === botTable.length-1 && `0.5px solid #000`}`, padding: "1px" }} ></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${i === botTable.length-1 && `0.5px solid #000`}`, padding: "1px" }}> </td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${i === botTable.length-1 && `0.5px solid #000`}`, padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${i === botTable.length-1 && `0.5px solid #000`}`, padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${i === botTable.length-1 && `0.5px solid #000`}`, padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${i === botTable.length-1 && `0.5px solid #000`}`, padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${i === botTable.length-1 && `0.5px solid #000`}`, padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${i === botTable.length-1 && `0.5px solid #000`}`, padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${i === botTable.length-1 && `0.5px solid #000`}`, padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${i === botTable.length-1 && `0.5px solid #000`}`, padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${i === botTable.length-1 && `0.5px solid #000`}`, padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${i === botTable.length-1 && `0.5px solid #000`}`, padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${i === botTable.length-1 && `0.5px solid #000`}`, padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${i === botTable.length-1 && `0.5px solid #000`}`, padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${i === botTable.length-1 && `0.5px solid #000`}`, padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${i === botTable.length-1 && `0.5px solid #000`}`, padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${i === botTable.length-1 && `0.5px solid #000`}`, padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${i === botTable.length-1 && `0.5px solid #000`}`, padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${i === botTable.length-1 && `0.5px solid #000`}`, padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${i === botTable.length-1 && `0.5px solid #000`}`, padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${i === botTable.length-1 && `0.5px solid #000`}`, padding: "1px" }} colSpan={2} align='left'><b>{e?.title2}</b></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${i === botTable.length-1 && `0.5px solid #000`}`, padding: "1px" }}></td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${i === botTable.length-1 && `0.5px solid #000`}`, padding: "1px" }} align='right'>&nbsp;{e?.amount !== 0 && (NumberWithCommas(e?.amount, 2))}</td>
                                <td style={{ borderLeft: "0.5px solid #000", borderRight: "0.5px solid #000", borderBottom: `${i === botTable.length-1 && `0.5px solid #000`}`, padding: "1px" }}></td>
                            </tr>
                        })}

                    </tbody>
                </table>
            </div> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>}</>
    )
}

export default ExcelToJsonDownloadR