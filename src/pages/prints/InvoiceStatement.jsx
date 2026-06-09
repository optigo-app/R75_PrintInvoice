import React, { useEffect, useState } from 'react';
import style from "../../assets/css/prints/InvoiceStatement.css"
import { NumberWithCommas, apiCall, checkMsg, handlePrint, isObjectEmpty } from '../../GlobalFunctions';
import Loader from '../../components/Loader';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import { cloneDeep } from 'lodash';

const InvoiceStatement = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {
    const [loader, setLoader] = useState(true);
    const [result, setResult] = useState(null);
    const [msg, setMsg] = useState("");
    const [data, setData] = useState({});
    const [headerData, setHeaderData] = useState({});
    const [category, setCategory] = useState([]);
    const [categoryWise, setCategoryWise] = useState([]);
    const [catcount, setCatCount] = useState(0);
  const [fineWtTotal, setFineWtTotal] = useState(0);
    const loadData = (data) => {
        let categories = [];
        let datas = OrganizeDataPrint(data?.BillPrint_Json[0], data?.BillPrint_Json1, data?.BillPrint_Json2);
        setHeaderData(data?.BillPrint_Json[0]);
        let resultArr = [];
        datas?.resultArray?.forEach((e, i) => {
            let obj = cloneDeep(e);
            let findBrandName = -1;
            if (findBrandName === -1) {
                resultArr.push(obj);
            } else {
                if (obj?.MaKingCharge_Unit !== resultArr[findBrandName]?.MaKingCharge_Unit) {
                    resultArr[findBrandName].MaKingCharge_Unit = "MIX";
                } else {
                    // resultArr[findBrandName].MaKingCharge_Unit += obj?.MaKingCharge_Unit;
                }
                if (obj?.Tunch === resultArr[findBrandName]?.Tunch) {
                    resultArr[findBrandName].Tunch = "MIX";
                }
                resultArr[findBrandName].Quantity += obj?.Quantity;
                resultArr[findBrandName].Wastage += obj?.Wastage;
                resultArr[findBrandName].totals.colorstone.Wt += obj?.totals.colorstone.Wt;

            }
            let cgwise = [];
            let cat_Count = 0;
            datas?.resultArray?.forEach((e) => {
                let findIndex = cgwise?.findIndex(
                    (el) =>
                        el?.Categoryname === e?.Categoryname && el?.Wastage === e?.Wastage
                );
                if (findIndex === -1) {
                    let obj = { ...e };
                    obj.cg_netwt =
                        e?.NetWt + e?.LossWt - e?.totals?.metal?.WithOutPrimaryMetal;
                    obj.cg_grosswt = e?.grosswt;
                    obj.cg_quantity = e?.Quantity;
                    obj.cg_wastage = e?.Wastage;
                    obj.cg_tunch = e?.Tunch;
                    // obj.cg_finewt = (e?.NetWt * e?.Tunch) / 100;
                    obj.cg_finewt = e?.PureNetWt;
                    obj.cat_count = 1;
                    cgwise.push(obj);
                } else {
                    cgwise[findIndex].cg_netwt +=
                        e?.NetWt + e?.LossWt - e?.totals?.metal?.WithOutPrimaryMetal;
                    cgwise[findIndex].cg_grosswt += e?.grosswt;
                    cgwise[findIndex].cg_wastage += e?.Wastage;
                    cgwise[findIndex].cg_quantity += e?.Quantity;
                    cgwise[findIndex].cg_tunch += e?.Tunch;
                    cgwise[findIndex].cg_wastage += e?.Wastage;
                    cgwise[findIndex].cat_count += 1;
                    // cgwise[findIndex].cg_finewt += (e?.NetWt * e?.Tunch) / 100;
                    cgwise[findIndex].cg_finewt += e?.PureNetWt;
                }
            });
            cgwise.forEach((e) => {
                cat_Count = cat_Count + e?.cat_count;
            });
             setCatCount(cat_Count);

            cgwise.sort((a, b) => a.Categoryname.localeCompare(b.Categoryname));
            setCategoryWise(cgwise);


            let finewt_ = 0;
            datas?.resultArray?.forEach((e) => {
              finewt_ += e?.PureNetWt;
            });
            setFineWtTotal(finewt_);
      




        });

        // const categoryMap = {};

        // data?.BillPrint_Json1?.forEach((e) => {
        //     const key = e?.Categoryname;

        //     if (!categoryMap[key]) {
        //         categoryMap[key] = {
        //             Categoryname: key,
        //             pcs: 0,
        //             grosswt: 0,
        //             netwt: 0,
        //             wastage: 0,
        //             fine: 0,
        //         };
        //     }

        //     categoryMap[key].pcs += 1;
        //     categoryMap[key].grosswt += e?.grosswt || 0;
        //     categoryMap[key].netwt += e?.NetWt || 0;
        //     categoryMap[key].wastage += e?.Wastage || 0;
        //     categoryMap[key].fine += e?.MetalAmount==0 ?  e?.PureNetWt: 0;
        // });

        // // convert object → array
        // const finalCategories = Object.values(categoryMap);

        const categoryMap = {};

        data?.BillPrint_Json1?.forEach((e) => {
            const key = e?.Categoryname;

            if (!categoryMap[key]) {
                categoryMap[key] = {
                    Categoryname: key,
                    pcs: 0,
                    grosswt: 0,
                    netwt: 0,
                    wastageSet: new Set(),
                    fine: 0,
                };
            }

            categoryMap[key].pcs += 1;
            categoryMap[key].grosswt += e?.grosswt || 0;
            categoryMap[key].netwt += e?.NetWt || 0;
            categoryMap[key].fine += e?.PureNetWt;
            //   categoryMap[key].fine += e?.MetalAmount == 0 ? e?.PureNetWt : 0;

            // Track wastage values
            categoryMap[key].wastageSet.add(e?.Wastage || 0);
        });

        // convert object → array
        const finalCategories = Object.values(categoryMap).map((item) => ({
            ...item,
            wastage:
                item.wastageSet.size > 1
                    ? "Mix"
                    : [...item.wastageSet][0],
        }));

        // ✅ calculate total
        const totalObj = finalCategories.reduce(
            (acc, cur) => {
                acc.pcs += cur.pcs;
                acc.grosswt += cur.grosswt;
                acc.netwt += cur.netwt;
                acc.wastage += cur.wastage;
                acc.fine += cur.fine;
                return acc;
            },
            {
                Categoryname: "Total",
                pcs: 0,
                grosswt: 0,
                netwt: 0,
                wastage: 0,
                fine: 0,
            }
        );

        // ✅ push total row
        finalCategories.push(totalObj);

        // set state
        setCategory(finalCategories);



        setResult(datas);
        datas.resultArray = resultArr;
        setData(datas);
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


    const thStyle = {
        border: "1px solid black",
        padding: "6px",
        fontWeight: "bold",
    };

    const tdStyle = {
        border: "1px solid black",
        padding: "6px",
    };
    const th = {
        border: "1px solid black",
        padding: "6px",
        fontWeight: "bold",
        textAlign: "center",
    };

    const td = {
        border: "1px solid black",
        padding: "6px",
        textAlign: "center",
    };

    const subText = {
        fontSize: "10px",

    };

    // const groupBySubCategory = (data) => {
    //     const map = {};

    //     data?.forEach((e) => {
    //         console.log("TCL: groupBySubCategory ->ee ", e)
    //         const key = e?.SubCategoryname || "Unknown";

    //         if (!map[key]) {
    //             map[key] = {
    //                 SubCategoryname: key,
    //                 items: [],
    //                 pcs: 0,
    //                 grosswt: 0,
    //                 netwt: 0,
    //                 stonewt: 0,
    //                 fine: 0,
    //                 cash: 0,
    //                 purity: 0,
    //                 Wastage: 0,
    //             };
    //         }


    //         const stoneWt =
    //             (e?.totals?.misc?.Wt || 0);

    //         map[key].items.push(e);
    //         map[key].pcs += e?.Quantity || 0;
    //         map[key].grosswt += e?.grosswt || 0;
    //         map[key].netwt += e?.NetWt || 0;
    //         map[key].stonewt += stoneWt;
    //         map[key].fine += e?.MetalAmount == 0 ? e?.PureNetWt || 0 : 0 ;
    //         map[key].cash += e?.TotalAmount || 0;
    //         map[key].purity = e?.MetalPriceRatio || 0; // or avg if needed
    //         map[key].Wastage += e?.Wastage || 0; // or avg if needed
    //     });

    //     return Object.values(map);
    // };

    // const groupBySubCategory = (data) => {
    //     const map = {};

    //     data?.forEach((e) => {
    //       const key = e?.SubCategoryname || "Unknown";

    //       if (!map[key]) {
    //         map[key] = {
    //           SubCategoryname: key,
    //           items: [],
    //           pcs: 0,
    //           grosswt: 0,
    //           netwt: 0,
    //           stonewt: 0,
    //           fine: 0,
    //           cash: 0,
    //           puritySet: new Set(),
    //           purity: "",
    //           Wastage: 0,
    //         };
    //       }

    //       const stoneWt = e?.totals?.misc?.Wt || 0;

    //       map[key].items.push(e);
    //       map[key].pcs += e?.Quantity || 0;
    //       map[key].grosswt += e?.grosswt || 0;
    //       map[key].netwt += e?.NetWt || 0;
    //       map[key].stonewt += stoneWt;
    //       map[key].fine += e?.MetalAmount == 0 ? e?.PureNetWt || 0 : 0;
    //       map[key].cash += e?.TotalAmount || 0;
    //       map[key].Wastage += e?.Wastage || 0;

    //       // Track purity values
    //       map[key].puritySet.add(e?.MetalPriceRatio || 0);
    //     });

    //     return Object.values(map).map((group) => ({
    //       ...group,
    //       purity:
    //         group.puritySet.size > 1
    //           ? "Mix"
    //           : [...group.puritySet][0],
    //     }));
    //   };

    const groupBySubCategory = (data) => {
        const map = {};

        data?.forEach((e) => {
            const key = e?.SubCategoryname || "Unknown";

            if (!map[key]) {
                map[key] = {
                    SubCategoryname: key,
                    items: [],
                    pcs: 0,
                    grosswt: 0,
                    netwt: 0,
                    stonewt: 0,
                    fine: 0,
                    cash: 0,
                    puritySet: new Set(),
                    wastageSet: new Set(),
                    purity: "",
                    Wastage: "",
                };
            }

            const stoneWt = e?.totals?.misc?.Wt || 0;

            map[key].items.push(e);
            map[key].pcs += e?.Quantity || 0;
            map[key].grosswt += e?.grosswt || 0;
            map[key].netwt += e?.NetWt || 0;
            map[key].stonewt += stoneWt;
            map[key].fine += e?.MetalAmount == 0 ? e?.PureNetWt || 0 : 0;
            map[key].cash += e?.TotalAmount || 0;

            // Track purity values
            map[key].puritySet.add(e?.MetalPriceRatio || 0);

            // Track wastage values
            map[key].wastageSet.add(e?.Wastage || 0);
        });

        return Object.values(map).map((group) => ({
            ...group,
            purity:
                group.puritySet.size > 1
                    ? "Mix"
                    : [...group.puritySet][0],

            Wastage:
                group.wastageSet.size > 1
                    ? "Mix"
                    : [...group.wastageSet][0],
        }));
    };

    const groupedData = groupBySubCategory(data?.resultArray || []);


    const grandTotal = groupedData.reduce(
        (acc, cur) => {
            acc.pcs += cur.pcs;
            acc.grosswt += cur.grosswt;
            acc.stonewt += cur.stonewt;
            acc.netwt += cur.netwt;
            acc.wastage += cur.wastage;
            acc.fine += cur.fine;
            acc.cash += cur.cash;
            acc.Wastage += cur.Wastage;
            return acc;
        },
        {
            pcs: 0,
            grosswt: 0,
            stonewt: 0,
            netwt: 0,
            wastage: 0,
            fine: 0,
            cash: 0,
            Wastage: 0,
        }
    );







    const voucher = headerData?.CashPayDet
        ? headerData.CashPayDet.split("|").map((item) => {
            const [voucher_lable, voucher_amount] = item.split("-");

            return {
                voucher_lable,
                voucher_amount: Number(voucher_amount),
            };
        })
        : [];

    const total_voucher = voucher.reduce(
        (sum, item) => sum + item.voucher_amount,
        0
    );


    return (
        loader ? <Loader /> : msg === "" ? <div className={`containerInvoiceStatement    pad_60_allPrint mt-2   px-1`}>
            {/* print button */}
            <div className={`d-flex justify-content-center mb-4 align-items-center  pt-4 pb-4 print-dis-none`}>
                <div className="form-check ps-3 mt-2">
                    <input
                        type="button"
                        className="btn_white blue"
                        value="Print"
                        onClick={(e) => handlePrint(e)}
                    />
                </div>
            </div>
            {/* customer details */}
            <div style={{ border: "1px solid #bdbdbd", padding: "12px" }}>
                <div className="d-flex" style={{ fontSize: "13px", marginBottom: "6px" }}>
                    <p>Bill Statement of:<span className='ps-3 fw-bold pe-4'>{headerData?.Customercode}</span></p>
                    <p>Date: <span className="ps-3 fw-bold">{headerData?.EntryDate}</span></p>
                </div>

                <table style={{ borderCollapse: "collapse", width: "100%", fontSize: "12px" }}>
                    <thead>
                        <tr style={{ backgroundColor: "#f1f1f1d6" }}>
                            <th style={th} rowSpan={2}>Bill#</th>
                            <th style={th} rowSpan={2}>
                                Item <br />

                            </th>
                            <th style={th} rowSpan={2}>Pcs</th>
                            <th style={th} rowSpan={2}>Gross Wt</th>
                            <th style={th} rowSpan={2}>
                                Stone Wt
                            </th>
                            <th style={th} rowSpan={2}>
                                net/CT wt
                            </th>
                            <th style={th} rowSpan={2}>Purity</th>
                            <th style={th} rowSpan={2}>Wastage</th>
                            <th style={th} colSpan="2">Final</th>
                        </tr>

                        <tr style={{ backgroundColor: "#f1f1f1d6" }}>
                            <th style={th}>Fine</th>
                            <th style={th}>Cash</th>
                        </tr>
                    </thead>

                    <tbody>
                        {/* Row group 1 */}
                        {groupedData?.map((group, i) => (

                            <tr key={i}>
                                {/* Bill# only once */}
                                {i === 0 && (
                                    <td rowSpan={groupedData.length} style={{ ...tdStyle }}>
                                        {`${headerData?.InvoiceNo}`}
                                    </td>
                                )}

                                {/* Subcategory */}
                                <td style={tdStyle}>
                                    {group.SubCategoryname}
                                </td>

                                <td style={tdStyle} align="right">{group?.pcs}</td>
                                <td style={tdStyle} align="right">{group?.grosswt?.toFixed(3)}</td>

                                {/* Stone wt */}
                                <td style={tdStyle} align="right">
                                    {(
                                        (group?.stonewt || 0)
                                    ).toFixed(3)}
                                </td>

                                {/* Net wt */}
                                <td style={tdStyle} align="right">{group?.netwt?.toFixed(3)}</td>

                                {/* Purity */}
                                <td style={tdStyle} align={group?.purity == "Mix" ? "center" : "right"}>{group?.purity}</td>

                                {/* Wastage */}
                                <td style={tdStyle} align={group?.Wastage == "Mix" ? "center" : "right"}>{group?.Wastage == "Mix" ? "Mix" : group?.Wastage?.toFixed(3)}</td>

                                {/* Fine */}
                                <td style={tdStyle} align="right"> {group?.fine?.toFixed(3)}</td>

                                {/* Cash */}
                                <td style={tdStyle} align="right">
                                    {group?.cash?.toFixed(2)}
                                </td>
                            </tr>

                        ))}

                        {/* Cash Receive rows */}
                        {voucher?.map((v, i) => (
                            <tr>
                                <td style={td}>{v?.voucher_lable}<br /><span style={subText}>Cash Receive</span></td>
                                <td style={td}></td>
                                <td style={td}></td>
                                <td style={td}></td>
                                <td style={td}></td>
                                <td style={td}></td>
                                <td style={td}></td>
                                <td style={td}></td>
                                <td style={td}></td>
                                <td style={{ ...td, textAlign: "right" }}>-{v?.voucher_amount?.toFixed(2)}</td>
                            </tr>
                        ))}



                        {/* Total Row */}
                        <tr style={{ backgroundColor: "#f1f1f1d6" }}>
                            <td style={{ ...td, fontWeight: "bold" }}>Total</td>
                            <td style={td}></td>
                            <td style={{ ...td, textAlign: "right" }} align="right">{grandTotal?.pcs}</td>
                            <td style={{ ...td, textAlign: "right" }} align="right">{grandTotal?.grosswt?.toFixed(3)}</td>
                            <td style={{ ...td, textAlign: "right" }} align="right">{grandTotal?.stonewt?.toFixed(3)}</td>
                            <td style={{ ...td, textAlign: "right" }} align="right">{grandTotal?.netwt?.toFixed(3)}</td>
                            <td style={{ ...td, textAlign: "right" }} align="right"></td>
                            {/* <td style={{ ...td, textAlign: "right" }} align="right">{grandTotal?.Wastage?.toFixed(2)}</td> */}
                            <td style={{ ...td, textAlign: "right" }} align="right"> </td>
                            <td style={{ ...td, textAlign: "right" }} align="right">
                                {grandTotal?.fine?.toFixed(3)}
                            </td>
                            <td style={{ ...td, textAlign: "right" }}>{(grandTotal?.cash - total_voucher)?.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>

                {headerData?.Remark && (
                    <div style={{
                        border: "1px solid black",
                        paddingLeft: "10px",
                        paddingBottom: "10px",
                        marginTop: "3px",
                        fontSize: "12px",
                    }}>
                        <div> <b>Remarks :</b> <span>{headerData?.Remark}</span></div>
                    </div>
                )}

                {/* summary */}
                <table style={{ borderCollapse: "collapse", width: "64.5%", textAlign: "center", marginTop: "3px" }}>
                    <thead>
                        <tr style={{ backgroundColor: "#f1f1f1d6" }}>
                            <th colSpan="6" style={{ border: "1px solid black", padding: "6px" }}>
                                PRODUCT SUMMARY
                            </th>
                        </tr>
                        <tr style={{ backgroundColor: "#f1f1f1d6" }}>
                            <th style={thStyle}>CATEGORY</th>
                            <th style={thStyle}>PIECES</th>
                            <th style={thStyle}>GORSS WT</th>
                            <th style={thStyle}>NET WT</th>
                            <th style={thStyle}>WASTAGE</th>
                            <th style={thStyle}>FINE</th>
                        </tr>
                    </thead>

                    <tbody>
                        {categoryWise?.map((item, ind) => (
                            <tr key={ind} style={{ backgroundColor: item?.Categoryname === "Total" ? "#f1f1f1d6" : "" }}>
                                <td style={{
                                    ...tdStyle,
                                    fontWeight: item?.Categoryname === "Total" ? "bold" : "normal",
                                }}>{item?.Categoryname == "Total" ? "Total" : item?.Categoryname}</td>
                                <td style={tdStyle}>{item?.cat_count}</td>
                                <td style={tdStyle}>{item?.cg_grosswt?.toFixed(3)}</td>
                                <td style={tdStyle}>{item?.cg_netwt?.toFixed(3)}</td>
                                <td style={tdStyle}>{item?.Wastage?.toFixed(3)}</td>
                                <td style={tdStyle}>{item?.cg_finewt?.toFixed(3)}</td>
                            </tr>
                        ))}

                        <tr   style={{ backgroundColor: "#f1f1f1d6" }}>
                            <td style={{
                                ...tdStyle,
                                fontWeight:   "bold"  ,
                            }}>Total</td>
                            <td style={tdStyle}>  {catcount}</td>
                            <td style={tdStyle}> {result?.mainTotal?.grosswt !== 0 &&
                          result?.mainTotal?.grosswt?.toFixed(3)}</td>
                            <td style={tdStyle}>{result?.mainTotal?.metal?.IsPrimaryMetal?.toFixed(3)}</td>
                            <td style={tdStyle}> </td>
                            <td style={tdStyle}>  {fineWtTotal === 0 ? 0 : fineWtTotal?.toFixed(3)}</td>
                        </tr>





                    </tbody>
                </table>
            </div>

        </div> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>
    )
}

export default InvoiceStatement
