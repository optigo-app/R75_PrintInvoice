// http://localhost:3000/?tkn=OTA2NTQ3MTcwMDUzNTY1MQ==&invn=Sk1JLzQyMi8yMDI1&evn=bWVtbw==&pnm=TWVtbyBJZ2kgMg==&up=aHR0cDovL256ZW4vam8vYXBpLWxpYi9BcHAvU2FsZUJpbGxfSnNvbg==&ctv=NzE=&ifid=PackingList3&pid=undefined&etp=ZXhjZWw=
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { apiCall, checkMsg, fixedValues, formatAmount, handleImageError, isObjectEmpty, NumberWithCommas } from '../../GlobalFunctions';
import Loader from '../../components/Loader';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import { MetalShapeNameWiseArr } from '../../GlobalFunctions/MetalShapeNameWiseArr';
import { textAlign } from '@mui/system';

const MemoIgi2Excel = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
    const [result, setResult] = useState(null);
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [diamondWise, setDiamondWise] = useState([]);
    const [MetShpWise, setMetShpWise] = useState([]);
    const [notGoldMetalTotal, setNotGoldMetalTotal] = useState(0);
    const [notGoldMetalWtTotal, setNotGoldMetalWtTotal] = useState(0);

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
        let Solitaire = []
        datas?.json2?.forEach((e) => {
            if (e?.MasterManagement_DiamondStoneTypeid === 1) {
                if (e?.IsCenterStone === 1) {
                    Solitaire.push(e);
                }

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
                    e?.StockBarcode === a?.StockBarcode &&
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
                    e?.StockBarcode === a?.StockBarcode &&
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

        diarndotherarr5 = [...diaonlyrndarr6, diaObj];
        setDiamondWise(diarndotherarr5);
        // console.log("datas", datas);
        setResult(datas);

        setTimeout(() => {
            const button = document.getElementById('test-table-xls-button');
            button.click();
        }, 500);
    }

    // console.log("result", result);

    // Style...
    const txtStart = {
        textAlign: "left",
    };
    const brRight = {
        borderRight: "1px solid #000000",
    };
    const brBotm = {
        borderBottom: "1px solid #000000",
    };
    const brTop = {
        borderTop: "1px solid #000000",
    };
    const hdSty = {
        backgroundColor: "#F5F5F5",
    };

    return (
        <>
            {loader ? <Loader /> : msg === "" ?
                <> <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="download-table-xls-button btn btn-success text-black bg-success px-2 py-1 fs-5 d-none"
                    table="table-to-xls"
                    filename={`Memo_IGI_2_${result?.header?.InvoiceNo}_${Date.now()}`}
                    sheet="tablexls"
                    buttonText="Download as XLS" />
                    <table id="table-to-xls" className='d-none'>
                        <tbody>
                            <tr>
                                <th width={130} style={{ ...brRight, ...brTop, ...hdSty, ...brBotm }}>IGI Number</th>
                                <th width={130} style={{ ...brRight, ...brTop, ...hdSty, ...brBotm }}>Job No</th>
                                <th width={130} style={{ ...brRight, ...brTop, ...hdSty, ...brBotm }}>Style Number</th>
                                <th width={130} style={{ ...brRight, ...brTop, ...hdSty, ...brBotm }}>Gross Weight</th>
                                <th width={130} style={{ ...brRight, ...brTop, ...hdSty, ...brBotm }}>Diamond Weight</th>
                                <th width={130} style={{ ...brRight, ...brTop, ...hdSty, ...brBotm }}>No Of Diamonds</th>
                                <th width={130} style={{ ...brRight, ...brTop, ...hdSty, ...brBotm }}>Jewelry Description</th>
                                <th width={130} style={{ ...brRight, ...brTop, ...hdSty, ...brBotm }}>Metal Color</th>
                                <th width={130} style={{ ...brRight, ...brTop, ...hdSty, ...brBotm }}>Metal Type</th>
                                <th width={130} style={{ ...brRight, ...brTop, ...hdSty, ...brBotm }}>Shape</th>
                                <th width={130} style={{ ...brRight, ...brTop, ...hdSty, ...brBotm }}>Color Criteria</th>
                                <th width={130} style={{ ...brRight, ...brTop, ...hdSty, ...brBotm }}>Clarity Criteria</th>
                                <th width={130} style={{ ...brRight, ...brTop, ...hdSty, ...brBotm }}>Finish Criteria</th>
                                <th width={130} style={{ ...brRight, ...brTop, ...hdSty, ...brBotm }}>Hallmark</th>
                                <th width={130} style={{ ...brRight, ...brTop, ...hdSty, ...brBotm }}>Center Stone Shape</th>
                                <th width={130} style={{ ...brRight, ...brTop, ...hdSty, ...brBotm }}>Center Diamond Weight</th>
                                <th width={130} style={{ ...brRight, ...brTop, ...hdSty, ...brBotm }}>Center No Of Diamonds</th>
                                <th width={130} style={{ ...brRight, ...brTop, ...hdSty, ...brBotm }}>Center Color Criteria</th>
                                <th width={130} style={{ ...brRight, ...brTop, ...hdSty, ...brBotm }}>Center Clarity Criteria</th>
                                <th width={130} style={{ ...brRight, ...brTop, ...hdSty, ...brBotm }}>Center Finish Criteria</th>
                                <th width={130} style={{ ...brRight, ...brTop, ...hdSty, ...brBotm }}>Prefix</th>
                                <th width={130} style={{ ...brRight, ...brTop, ...hdSty, ...brBotm }}>Suffix</th>
                                <th width={130} style={{ ...brRight, ...brTop, ...hdSty, ...brBotm }}>Colored Stone</th>
                                <th width={130} style={{ ...brRight, ...brTop, ...hdSty, ...brBotm }}>Enameling</th>
                                <th width={130} style={{ ...brRight, ...brTop, ...hdSty, ...brBotm }}>Report Comments</th>
                                <th width={130} style={{ ...brRight, ...brTop, ...hdSty, ...brBotm }}>Color Stone Shape</th>
                                <th width={130} style={{ ...brRight, ...brTop, ...hdSty, ...brBotm }}>Color Stone Weight</th>
                                <th width={130} style={{ ...brRight, ...brTop, ...hdSty, ...brBotm }}>Inscription</th>
                                <th width={130} style={{ ...brRight, ...brTop, ...hdSty, ...brBotm }}>Stampping</th>
                            </tr>

                            {result?.resultArray?.map((e, i) => {
                                return <tr key={i}>
                                    <td width={130} height={25} style={{ ...brRight, ...brBotm, ...txtStart }}></td>

                                    <td width={130} style={{ ...brRight, ...brBotm, ...txtStart }}>
                                        <div>{`\u00A0 ${e?.SrJobno}`}</div>
                                    </td>

                                    <td width={130} style={{ ...brRight, ...brBotm, ...txtStart }}>
                                        <div>{e?.designno}</div>
                                    </td>

                                    <td width={130} style={{ ...brRight, ...brBotm, ...txtStart }}>
                                        <div>{fixedValues(e?.grosswt, 3)}</div>
                                    </td>

                                    <td width={130} style={{ ...brRight, ...brBotm, ...txtStart }}>
                                        <div>{fixedValues(e?.totals?.diamonds?.Wt,3)}</div>
                                    </td>

                                    <td width={130} style={{ ...brRight, ...brBotm, ...txtStart }}>
                                        <div>{fixedValues(e?.totals?.diamonds?.Pcs,3)}</div>
                                    </td>

                                    <td width={130} style={{ ...brRight, ...brBotm, ...txtStart }}>
                                        <div>{e?.Categoryname}</div>
                                    </td>

                                    <td width={130} style={{ ...brRight, ...brBotm, ...txtStart }}>
                                        <div>{e?.MetalColor} {e?.MetalType}</div>
                                    </td>

                                    <td width={130} style={{ ...brRight, ...brBotm, ...txtStart }}>
                                        <div>{e?.MetalPurity}</div>
                                    </td>

                                    <td width={130} style={{ ...brRight, ...brBotm, ...txtStart }}>
                                        <div>
                                            {[
                                                ...new Set(
                                                e?.diamonds
                                                    .filter(d => d.Shape_Code)
                                                    .map(d => d.Shape_Code)
                                                )
                                            ].join(', ')}
                                        </div>
                                    </td>

                                    <td width={130} style={{ ...brRight, ...brBotm }}></td>
                                    <td width={130} style={{ ...brRight, ...brBotm }}></td>
                                    <td width={130} style={{ ...brRight, ...brBotm }}></td>
                                    <td width={130} style={{ ...brRight, ...brBotm }}></td>
                                    <td width={130} style={{ ...brRight, ...brBotm }}></td>
                                    <td width={130} style={{ ...brRight, ...brBotm }}></td>
                                    <td width={130} style={{ ...brRight, ...brBotm }}></td>
                                    <td width={130} style={{ ...brRight, ...brBotm }}></td>
                                    <td width={130} style={{ ...brRight, ...brBotm }}></td>
                                    <td width={130} style={{ ...brRight, ...brBotm }}></td>
                                    <td width={130} style={{ ...brRight, ...brBotm }}></td>
                                    <td width={130} style={{ ...brRight, ...brBotm }}></td>

                                    <td width={130} style={{ ...brRight, ...brBotm, ...txtStart }}>
                                        <div>
                                            {[
                                                ...new Set(
                                                    e?.colorstone
                                                    .filter(d => d.Quality_Code)
                                                    .map(d => d.Quality_Code)
                                                )
                                            ].join(', ')}
                                        </div>                                           
                                    </td>

                                    <td width={130} style={{ ...brRight, ...brBotm }}></td>
                                    <td width={130} style={{ ...brRight, ...brBotm }}></td>

                                    <td width={130} style={{ ...brRight, ...brBotm, ...txtStart }}>
                                        <div>
                                            {[
                                                ...new Set(
                                                    e?.colorstone
                                                    .filter(d => d.ShapeName)
                                                    .map(d => d.ShapeName)
                                                )
                                            ].join(', ')}
                                        </div>
                                    </td>

                                    <td width={130} style={{ ...brRight, ...brBotm, ...txtStart }}>
                                        <div>{fixedValues(e?.totals?.colorstone?.Wt,3)}</div>
                                    </td>

                                    <td width={130} style={{ ...brRight, ...brBotm }}></td>
                                    <td width={130} style={{ ...brRight, ...brBotm }}></td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </>
                : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>}
        </>
    )
}

export default MemoIgi2Excel;