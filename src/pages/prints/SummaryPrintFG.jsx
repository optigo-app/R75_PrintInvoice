import React, { useState, useEffect } from "react";
import "../../assets/css/prints/summaryprintFG.css";
import { apiCall, handlePrint, taxGenrator, isObjectEmpty, NumberWithCommas, fixedValues, checkMsg } from "../../GlobalFunctions";
import { usePDF } from "react-to-pdf";
import { ToWords } from 'to-words';
import Loader from "../../components/Loader";
import { cloneDeep } from "lodash";

const SummaryPrintFG = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {
  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });
  const [loader, setLoader] = useState(true);
  const toWords = new ToWords();
  const [json0Data, setjson0Data] = useState({});
  const [msg, setMsg] = useState("");
  const [data, setData] = useState([]);
  const [total, setTotal] = useState({
    count: 0,
    gwt: 0,
    nwt: 0,
    mamt: 0,
    labourAmt: 0,
    fineAmt: 0,
    totalAmt: 0,
    igst: 0,
    numberToWords: "",
    cgst: 0,
    sgst: 0,
    less: 0,
    dPcs: 0,
    dWt: 0,
    dAmt: 0,
    cPcs: 0,
    cWt: 0,
    cAmt: 0,
    fineWts: 0
  });
  const [finalTotal, setFinalTotal] = useState({
    otherAmt: 0,
    pkgWt: 0,
  })
  const [taxes, setTaxes] = useState([]);
  const [disocunt, setDiscount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const loadData = (data) => {

    setjson0Data(data?.BillPrint_Json[0]);
    let totals = { ...total };
    let arr = [];
    let discountAmount = 0;
    let otherAmounts = 0;
    let pkgWt = 0;
    let allArr = [];
    let metals = [];
    data?.BillPrint_Json1.forEach((e, i) => {
      let obj = cloneDeep(e);
      obj.metalRates = data?.BillPrint_Json2?.find((ele, ind) => ele?.MasterManagement_DiamondStoneTypeid === 4 && ele?.IsPrimaryMetal === 1 && ele?.StockBarcode === e?.SrJobno)?.Rate || 0;
      obj.counts = 1;
      let findings = {
        Wt: 0,
        SizeName: 0
      };
      let sizeWt =0
      data?.BillPrint_Json2?.forEach((ele, ind) => {
        if (ele?.MasterManagement_DiamondStoneTypeid === 5 && ele?.StockBarcode === e?.SrJobno) {
          findings.Wt += ele?.Wt 
          findings.SizeName += +ele?.SizeName;
          sizeWt += (+ele?.SizeName* ele?.Wt);
        }
      });
      let fineWtss = (((e?.NetWt-findings?.Wt)*e?.Tunch)/100) + ((sizeWt)/100);

      obj.fineWtss = fineWtss;
      totals.fineWts += fineWtss;
      allArr?.push(obj);
    });
    allArr.forEach((e, i) => {
      // totals.fineWts += (e?.NetWt * (e?.Tunch)) / 100;
      pkgWt += e?.PackageWt;
      discountAmount += e?.DiscountAmt;
      let findIndex = arr.findIndex(
        (ele, ind) =>
          ele?.Categoryname === e?.Categoryname &&
          ele?.Collectionname === e?.Collectionname &&
          ele?.Wastage === e?.Wastage && ele?.MetalPurity === e?.MetalPurity
      );
      otherAmounts += e?.TotalDiamondHandling + e?.OtherCharges + e?.MiscAmount;
      if (findIndex === -1) {
        let count = 1;
        let obj = cloneDeep(e);
        obj.fineWts = (e?.NetWt * e?.Tunch) / 100;
        obj.diamondPcs = 0;
        obj.diamondWt = 0;
        obj.diamondAmt = 0;
        obj.diamondSettingAmt = 0;
        obj.colorStoneSettingAmt = 0;
        obj.diamondRate = 0;
        obj.colorStonePcs = 0;
        obj.colorStoneWt = 0;
        obj.colorStoneAmt = 0;
        obj.colorStoneRate = 0;
        obj.metalPcs = 0;
        obj.metalWt = 0;
        obj.metalAmt = 0;
        obj.metalRate = 0;
        data?.BillPrint_Json2?.forEach((ele, ind) => {
          if (ele?.StockBarcode === e?.SrJobno) {
            if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
              obj.diamondSettingAmt += ele?.SettingAmount;

            } else if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
              obj.colorStoneSettingAmt += ele?.SettingAmount;
            }
          }
        })

        if (atob(printName).toLowerCase() === "item wise print1" || atob(printName).toLowerCase() === "item wise print2") {
          let makingAmount = e?.MaKingCharge_Unit?.toString()?.split(".");
          if (makingAmount?.length === 1) {
            makingAmount = +(makingAmount + "000")
          } else {
            makingAmount = +(makingAmount[0] + "000" + makingAmount[1])
          }
          obj.MaKingCharge_Unit = makingAmount;
        }
        obj.count = count;
        obj.otherAmt = e?.TotalDiamondHandling + e?.OtherCharges + e?.MiscAmount;
        let srJobArr = [];
        srJobArr.push(e?.SrJobno);
        obj.srJobArr = srJobArr;
        arr.push(obj);
      } else {
        if (e?.GroupJob === "") {
          arr[findIndex].count += 1;
        }
        let diamondSettingAmt = 0;
        let colorStoneSettingAmt = 0;

        data?.BillPrint_Json2?.forEach((ele, ind) => {
          if (ele?.StockBarcode === e?.SrJobno) {
            if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
              diamondSettingAmt += ele?.SettingAmount;

            } else if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
              colorStoneSettingAmt += ele?.SettingAmount;
            }
          }
        })
        arr[findIndex].fineWts += (e?.NetWt * (e?.Tunch + e?.Wastage)) / 100;
        arr[findIndex].diamondSettingAmt += diamondSettingAmt;
        arr[findIndex].Tunch += e?.Tunch;
        // arr[findIndex].Wastage += e?.Wastage;
        arr[findIndex].colorStoneSettingAmt += colorStoneSettingAmt;
        arr[findIndex].grosswt += e?.grosswt;
        arr[findIndex].NetWt += e?.NetWt;
        arr[findIndex].MakingAmount += e?.MakingAmount;
        arr[findIndex].OtherCharges += e?.OtherCharges;
        arr[findIndex].DiscountAmt += e?.DiscountAmt;
        arr[findIndex].TotalAmount += e?.TotalAmount;
        arr[findIndex].UnitCost += e?.UnitCost;
        arr[findIndex].MetalAmount += e?.MetalAmount;
        arr[findIndex].otherAmt += e?.TotalDiamondHandling + e?.OtherCharges + e?.MiscAmount;
        arr[findIndex].metalRates += e?.metalRates;
        arr[findIndex].counts += e?.counts;
        arr[findIndex].fineWtss += e?.fineWtss;
        arr[findIndex].srJobArr.push(e?.SrJobno);
      }
    });
    setFinalTotal({ ...finalTotal, otherAmt: otherAmounts, pkgWt: pkgWt })
    setDiscount(discountAmount);
    let resultArr = [];
    let totalAmounts = 0
    arr.forEach((e, i) => {
      let obj = { ...e };
      // obj.FineWt = 0;
      totalAmounts += e?.TotalAmount;
      obj.OtherAmount = 0;
      data?.BillPrint_Json2.forEach((ele, ind) => {
        obj.srJobArr.map((elem, index) => {
          // if (obj?.id === ele?.Hid) {
          // obj.OtherAmount
          if (elem === ele?.StockBarcode) {
            if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
              obj.metalPcs += ele?.Pcs;
              obj.metalWt += ele?.Wt;
              obj.metalAmt += ele?.Amount;
              // obj.FineWt += ele?.FineWt;
              // metal
            } else if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
              // color stone
              obj.colorStonePcs += ele?.Pcs;
              totals.cPcs += ele?.Pcs;
              totals.cWt += ele?.Wt;
              totals.cAmt += ele?.Amount;
              obj.colorStoneWt += ele?.Wt;
              obj.colorStoneAmt += ele?.Amount;
            } else if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
              // diamond
              obj.diamondPcs += ele?.Pcs;
              totals.dPcs += ele?.Pcs;
              totals.dWt += ele?.Wt;
              totals.dAmt += ele?.Amount;
              obj.diamondWt += ele?.Wt;
              obj.diamondAmt += ele?.Amount;
            }
          }
        })
      });
      resultArr.push(obj);
    });
    setTotalAmount(totalAmounts);
    resultArr.sort((a, b) => {
      const nameA = a.Collectionname.toLowerCase();
      const nameB = b.Collectionname.toLowerCase();

      if (nameA < nameB) {
        return -1;
      }

      if (nameA > nameB) {
        return 1;
      }

      return 0; // names are equal
    });

    resultArr.forEach((e, i) => {
      totals.count += e?.count;
      totals.gwt += e?.grosswt;
      totals.nwt += e?.NetWt;
      totals.mamt += e?.MetalAmount;
      totals.labourAmt += e?.MakingAmount + e?.diamondSettingAmt + e?.colorStoneSettingAmt;
      totals.fineAmt += e?.FineWt;
      totals.totalAmt += e?.TotalAmount;
    });
    totals.igst = (totals.totalAmt * data?.BillPrint_Json[0]?.IGST) / 100;
    totals.cgst = (totals.totalAmt * data?.BillPrint_Json[0]?.CGST) / 100;
    totals.sgst = (totals.totalAmt * data?.BillPrint_Json[0]?.SGST) / 100;
    totals.less = data?.BillPrint_Json[0]?.AddLess;
    // totals.totalAmt = totals.totalAmt + totals.cgst + totals.sgst + totals.less;
    // tax
    let taxValue = taxGenrator(data?.BillPrint_Json[0], totals.totalAmt);
    setTaxes(taxValue);
    taxValue.length > 0 && taxValue.forEach((e, i) => {
      totals.totalAmt += +(e?.amount);
    });
    totals.numberToWords = toWords.convert(totals.totalAmt);
    // tax end
    totals.totalAmt += totals.less;
    totals.totalAmt = (totals.totalAmt)?.toFixed(2);
    // resultArr?.forEach((e, i) => {
    //   e.fineWts = (e?.NetWt * (e?.Tunch + e?.Wastage)) / 100;
    //   totals.fineWts +=  (e?.NetWt * (e?.Tunch + e?.Wastage)) / 100;
    // })

    resultArr.sort((a, b) => {
      const keyA = a?.MetalType + a?.MetalPurity;
      const keyB = b?.MetalType + b?.MetalPurity;

      // Compare the name values directly
      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
    });
    setTotal(totals);
    setData(resultArr);
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
        console.error(error);
      }
    };
    sendData();
  }, []);

  console.log("json0Data", json0Data);
  console.log("data", data);

  return (<>
    {loader ? <Loader /> : msg === "" ? <div className={`itemWisePrintfont pad_60_allPrint ${(atob(printName).toLowerCase() === "item wise print") && 'itemWisePrintfont1_'}`}>
      {/* Print Button */}
      <div className="d-flex justify-content-end align-items-center print_sec_sum4 mb-4 pt-4  max_width_container px-1 mx-auto">
        <div className="form-check printLeftitemWise">
          <input
            type="button"
            className="btn_white blue"
            value="Print"
            onClick={(e) => handlePrint(e)}
            style={{ fontSize: "14px" }}
          />
        </div>
      </div>

      <div ref={targetRef} className={`max_width_container itemWisePrintContainer mt-2 mx-auto px-1`}>
        <div className={`itemWisePrintHead itemWisePrint1Font_tab_15 `}>
          {/* Heading */}
          <div className={`p-1 d-flex`}>
            <div className="margnRight">Bill Statement of : <span className="fw-bold padngLft">{json0Data?.customerfirmname}</span></div>
            <div className="margnRight">Date : <span className="fw-bold padngLft">{json0Data?.EntryDate}</span></div>
            <div className="margnRight">Invoice No : <span className="fw-bold padngLft">{json0Data?.InvoiceNo}</span></div>
            <div className="margnRight">HSN : <span className="fw-bold padngLft">{json0Data?.HSN_No}</span></div>
          </div>
        </div>

        {/* Table Heading */}
        <div className={`bgLightPink d-flex brderevrWher main_pad_item_wise_print itemWisePrintHead`}>
          <div className={`brderRigt commnWdth1`}>
            <p className="fw-bold" style={{ wordBreak: "normal" }}>Category</p>
          </div>

          <div className={`brderRigt commnWdth2`}>
            <p className="fw-bold" style={{ wordBreak: "normal" }}>Pcs</p>
          </div>

          <div className={`brderRigt commnWdth`}>
            <p className="fw-bold" style={{ wordBreak: "normal" }}>LB</p>
          </div>

          <div className={`brderRigt commnWdth`}>
            <p className="fw-bold" style={{ wordBreak: "normal" }}>Rate<br />Gm/Ct</p>
          </div>

          <div className={`brderRigt commnWdth`}>
            <p className="fw-bold" style={{ wordBreak: "normal" }}>Per</p>
          </div>

          <div className={`brderRigt commnWdth1`}>
            <p className="fw-bold" style={{ wordBreak: "normal" }}>TAX(%)</p>
          </div>

          <div className={`brderRigt commnWdth`}>
            <p className="fw-bold" style={{ wordBreak: "normal" }}>Gross</p>
          </div>

          <div className={`brderRigt commnWdth`}>
            <p className="fw-bold" style={{ wordBreak: "normal" }}>Black<br />Beads</p>
          </div>

          <div className={`brderRigt commnWdth`}>
            <p className="fw-bold" style={{ wordBreak: "normal" }}>Stone</p>
          </div>

          <div className={`brderRigt commnWdth`}>
            <p className="fw-bold" style={{ wordBreak: "normal" }}>Kundan</p>
          </div>

          <div className={`brderRigt commnWdth`}>
            <p className="fw-bold" style={{ wordBreak: "normal" }}>Net Wt</p>
          </div>
          <div className={`brderRigt commnWdth`}>
            <p className="fw-bold" style={{ wordBreak: "normal" }}>Final Wt</p>
          </div>
          <div className={`brderRigt commnWdth`}>
            <p className="fw-bold" style={{ wordBreak: "normal" }}>%</p>
          </div>
          <div className={`brderRigt commnWdth`}>
            <p className="fw-bold" style={{ wordBreak: "normal" }}>Wastage</p>
          </div>
          <div className={`fw-bold commnWdth1`}>
              <div className="w-100 brderBtom">Final</div>
              <div className="d-flex">
                <div className="w-50 brderRigt">Fine</div>
                <div className="w-50">Cash</div>
              </div>
          </div>
        </div>
        {/* Data */}
        {data.length > 0 &&
          data.map((e, i) => {
            return (
              <div className={`no_break d-flex brderLft brderRigt brderBtom itemWisePrintHead`} key={i}>
                <div className={`brderRigt align-content-center commnWdth1 breakNormalItemWIse`} >
                  <p className={`itemWisePrintCategory padngLft2 spBrkWord`}>{e?.BrandName}</p>
                </div>

                <div className={`brderRigt align-content-center commnWdth2`}>
                  <p className="text-end padngRight" style={{ wordBreak: "normal" }}>{e?.metalPcs}</p>
                </div>

                <div className={`brderRigt align-content-center commnWdth`}>
                  <p className="text-end padngRight">{NumberWithCommas(e?.MaKingCharge_Unit, 2)}</p>
                </div>

                <div className={`brderRigt align-content-center commnWdth`}>
                  <p className="text-end padngRight">{NumberWithCommas(json0Data?.MetalRate24K, 2)}</p>
                </div>

                <div className={`brderRigt align-content-center commnWdth`}>
                  <p className="text-end padngRight"></p>
                </div>

                <div className={`brderRigt align-content-center commnWdth1`}>
                  {taxes.length > 0 && taxes.map((e) => {
                    return<p className="text-start padngLft2 spBrkWord">
                      {e?.name} @ {e?.per}
                    </p>
                  })}
                </div>

                <div className={`brderRigt align-content-center commnWdth`}>
                  <p className="text-end padngRight">
                    {e?.grosswt !== 0 && NumberWithCommas(e?.grosswt, 3)}
                  </p>
                </div>

                <div className={`brderRigt align-content-center commnWdth`}>
                  <p className="text-end padngRight">
                    {e?.MetalAmount !== 0 && NumberWithCommas(e?.MiscAmount, 3)}
                  </p>
                </div>

                <div className={`brderRigt align-content-center commnWdth`}>
                  <p className="text-end padngRight">
                    {e?.otherAmt !== 0 && NumberWithCommas(e?.colorStoneAmt, 3)}
                  </p>
                </div>

                <div className={`brderRigt align-content-center commnWdth`}>
                  <p className="text-end padngRight"></p>
                </div>

                <div className={`brderRigt align-content-center commnWdth`}>
                  <p className="text-end padngRight">{NumberWithCommas(e?.NetWt, 3)}</p>
                </div>

                <div className={`brderRigt align-content-center commnWdth`}>
                  <p className="text-end padngRight"></p>
                </div>

                <div className={`brderRigt align-content-center commnWdth`}>
                  <p className="text-end padngRight">
                    {e?.MetalPriceRatio !== 0 && NumberWithCommas(e?.MetalPriceRatio, 3)}
                  </p>
                </div>

                <div className={`brderRigt align-content-center commnWdth`}>
                  <p className="text-end padngRight">
                    {NumberWithCommas(e?.DiamondCTWwithLoss, 3)}
                  </p>
                </div>

                <div className={`brderRigt align-content-center`} style={{ width: "4.125%" }}>
                  <p className="text-end padngRight">
                    {e?.PureNetWt !== 0 && (fixedValues(e?.PureNetWt, 3))}
                  </p>
                </div>

                <div className={`align-content-center`} style={{ width: "4.125%" }}>
                  <p className="text-end padngRight">
                    {e?.TotalAmount !== 0 && (NumberWithCommas(e?.TotalAmount + e?.DiscountAmt, 2))}
                  </p>
                </div>
              </div>
            );
          })}

        {/* Total */}
        <div className={`no_break d-flex brderLft brderRigt brderBtom lightGrey itemWisePrintHead`}>
          <div className={`brderRigt d-flex commnWdth1`}>
            <p className="fw-bold text-start padngLft2 minHeigt" style={{ fontSize: "13px" }}>Total</p>
          </div>

          <div className={`brderRigt minHeigt commnWdth2`}>
            <p className="fw-bold padngLft2"></p>
          </div>

          <div className={`brderRigt minHeigt commnWdth`}>
            <p className="fw-bold padngRight text-end">{finalTotal?.pkgWt !== 0 && NumberWithCommas(finalTotal?.pkgWt, 3)}</p>
          </div>

          <div className={`brderRigt minHeigt commnWdth`}>
            <p className="fw-bold padngRight text-end">{total.count}</p>
          </div>

          <div className={`brderRigt minHeigt commnWdth`}>
            <p className="fw-bold padngRight text-end">{NumberWithCommas(total?.gwt, 3)}</p>
          </div>

          <div className={`brderRigt minHeigt commnWdth1`}>
            <p className="fw-bold padngRight text-end">{NumberWithCommas(total?.nwt, 3)}</p>
          </div>

          <div className={`brderRigt minHeigt commnWdth`}>
            <p className="fw-bold padngRight text-end"></p>
          </div>

          <div className={`brderRigt minHeigt commnWdth`}>
            <p className="fw-bold padngRight text-end">{NumberWithCommas(total?.mamt, 2)}</p>
          </div>

          <div className={`brderRigt minHeigt commnWdth`}>
            <p className="fw-bold padngRight text-end">{NumberWithCommas(finalTotal?.otherAmt, 2)}</p>
          </div>

          <div className={`brderRigt minHeigt commnWdth`}>
            <p className="fw-bold padngRight text-end"></p>
          </div>

          <div className={`brderRigt minHeigt commnWdth`}>
            <p className="fw-bold padngRight text-end"></p>
          </div>

          <div className={`brderRigt minHeigt commnWdth`}>
            <p className="fw-bold padngRight text-end"></p>
          </div>

          <div className={`brderRigt minHeigt commnWdth`}>
            <p className="fw-bold padngRight text-end">{NumberWithCommas(total?.labourAmt, 2)}</p>
          </div>

          <div className={`brderRigt minHeigt commnWdth`}>
            <p className="fw-bold padngRight text-end">{NumberWithCommas(total?.fineWts, 3)}</p>
          </div>

          <div className="minHeigt brderRigt" style={{ width: "4.125%" }}>
            <p className="fw-bold padngRight text-end">{NumberWithCommas(totalAmount, 2)}</p>
          </div>

          <div className="minHeigt" style={{ width: "4.125%" }}>
            <p className="fw-bold padngRight text-end">{NumberWithCommas(totalAmount, 2)}</p>
          </div>
        </div>

        {/* Tax */}
        <div className={`no_break bgLightPink d-flex brderLft brderRigt brderBtom itemWisePrintHead`}>
          <div className={`brderRigt commnWdth1`}>
            {/* <p className="fw-bold text-start brderBtom align-items-center minHeigt padngLft2">TOTAL DISOCUNT</p> */}
            {taxes.length > 0 && taxes.map((e, i) => {
              return <p className={`fw-bold text-start padngLft2 align-items-center minHeigt brderBtom`}key={i}> {e?.name} @ {e?.per} </p>
            })}
            {json0Data?.AddLess !== 0 && <p className="fw-bold text-start minHeigt align-items-center brderBtom padngLft2">{json0Data?.AddLess > 0 ? "ADD" : "LESS"} </p>}
            <p className="fw-bold text-start align-items-center padngLft2 minHeigt">GRAND TOTAL</p>
          </div>

          <div className="commnWdth3 brderRigt" />
          
          <div className={`py-0 px-0`} style={{ width: "4.125%"}}>
            {/* <p className="fw-bold text-end brderBtom padngRight minHeigt padngRight">{NumberWithCommas(disocunt, 2)}</p> */}
            {taxes.length > 0 && taxes.map((e, i) => {
              return <p className={`fw-bold text-end padngRight padngRight minHeigt brderBtom`} key={i}>{e?.amount}</p>
            })}
            {json0Data?.AddLess !== 0 && <p className="fw-bold text-end brderBtom minHeigt padngRight padngRight">{NumberWithCommas(json0Data?.AddLess, 2)}</p>}
            <p className="fw-bold text-end padngRight minHeigt padngRight">{NumberWithCommas(total?.totalAmt, 2)}</p>
          </div>
        </div>
      </div>
    </div> : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>}
  </>
  );
};

export default SummaryPrintFG;
