import React from "react";
import {
  NumberWithCommas,
  ReceiveInBank,
  apiCall,
  checkMsg,
  fixedValues,
  handleImageError,
  handlePrint,
  isObjectEmpty,
  otherAmountDetail,
  taxGenrator,
} from "../../GlobalFunctions";
import { useState } from "react";
import { useEffect } from "react";
import Loader from "../../components/Loader";
import style from "../../assets/css/prints/estimatePrint1.module.css";
import { ToWords } from "to-words";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";

const EstimatePrint1 = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {
  const toWords = new ToWords();
  const [image, setImage] = useState(false);
  const [loader, setLoader] = useState(true);
  const [msg, setMsg] = useState("");
  const [json0Data, setJson0Data] = useState({});
  const [document, setDocument] = useState([]);
  const [data, setData] = useState([]);
  const [total, settotal] = useState({
    grosswt: 0,
    materialWt: 0,
    NetWt: 0,
    OtherCharges: 0,
    UnitCost: 0,
    TotalAmount: 0,
    discount: 0,
    afterTaxAmount: 0,
    netBalanceAmount: 0,
    netWtlossWt: 0,
    miscWt: 0,
  });
  const [bank, setBank] = useState([]);
  const [tax, setTax] = useState([]);
  const [isImageWorking, setIsImageWorking] = useState(true);
  const handleImageErrors = () => {
    setIsImageWorking(false);
  };
  const loadData = (data) => {
    setJson0Data(data?.BillPrint_Json[0]);
    let documnets = otherAmountDetail(data?.BillPrint_Json[0]?.DocumentDetail);
    setDocument(documnets);
    let totals = { ...total };
    let dataArr = [];
    data?.BillPrint_Json1.forEach((e, i) => {
      totals.grosswt += e?.grosswt;
      totals.NetWt += e?.NetWt;
      totals.OtherCharges +=
        e?.MetalAmount + e?.OtherCharges + e?.TotalDiamondHandling;
      totals.UnitCost += e?.UnitCost;
      totals.TotalAmount += e?.TotalAmount;
      let obj = { ...e };
      let diamonds = [];
      let colorstone = [];
      let misc = [];
      let metals = [];
      let netWtlossWt = 0;
      let count = 0;
      let pureWt = 0;
      let otherChargess = otherAmountDetail(e?.OtherAmtDetail);
      data?.BillPrint_Json2.forEach((ele, ind) => {
        if (ele?.StockBarcode === e?.SrJobno) {
          if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
            metals.push(ele);
            if (ele?.IsPrimaryMetal !== 1) {
              ++count;
            } else {
              pureWt += ele?.Wt;
            }
          } else if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
            totals.materialWt += ele?.Wt;
            totals.OtherCharges += ele?.Amount;
            let findDiamonds = diamonds.findIndex(
              (elem, index) =>
                elem?.ShapeName === ele?.ShapeName && elem?.Rate === ele?.Rate
            );
            if (findDiamonds === -1) {
              diamonds.push(ele);
            } else {
              diamonds[findDiamonds].Wt += ele?.Wt;
              diamonds[findDiamonds].Pcs += ele?.Pcs;
              diamonds[findDiamonds].Amount += ele?.Amount;
            }
          } else if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
            totals.materialWt += ele?.Wt;
            totals.OtherCharges += ele?.Amount;
            let findColorStones = colorstone.findIndex(
              (elem, index) =>
                elem?.ShapeName === ele?.ShapeName &&
                elem?.Rate === ele?.Rate &&
                elem?.IsLess === ele?.IsLess
            );
            if (findColorStones === -1) {
              colorstone.push(ele);
            } else {
              colorstone[findColorStones].Wt += ele?.Wt;
              colorstone[findColorStones].Pcs += ele?.Pcs;
              colorstone[findColorStones].Amount += ele?.Amount;
            }
          } else if (ele?.MasterManagement_DiamondStoneTypeid === 3) {
            // if (ele?.ServWt) {
            //     totals.miscWt += ele?.ServWt;
            // }
            //    if(ele?.IsHSCOE === 0 || ele?.IsHSCOE === 3){
            // if (ele?.Amount !== 0) {
            //     // totals.miscWt += ele?.Wt;
            //     totals.OtherCharges += ele?.Amount;
            //     misc.push(ele);
            // }
            if (ele?.IsHSCOE === 0 || ele?.Amount !== 0) {
              totals.OtherCharges += ele?.Amount;
              misc.push(ele);
              // if(ele?.IsHSCOE === 0){
              totals.miscWt += ele?.Wt + ele?.ServWt;

              // }
            }
            //    }
          }
        }
      });
      if (count === 0) {
        netWtlossWt += e?.NetWt + e?.LossWt;
      } else {
        netWtlossWt += pureWt;
      }
      diamonds.sort((a, b) => {
        let nameA = a?.ShapeName?.toLowerCase();
        let nameB = b?.ShapeName?.toLowerCase();
        if (nameA > nameB) {
          return 1;
        } else if (nameB > nameA) {
          return -1;
        } else {
          return 0;
        }
      });
      colorstone.sort((a, b) => {
        let nameA = a?.ShapeName?.toLowerCase();
        let nameB = b?.ShapeName?.toLowerCase();
        if (nameA > nameB) {
          return 1;
        } else if (nameB > nameA) {
          return -1;
        } else {
          return 0;
        }
      });
      misc.sort((a, b) => {
        let nameA = a?.ShapeName?.toLowerCase();
        let nameB = b?.ShapeName?.toLowerCase();
        if (nameA > nameB) {
          return 1;
        } else if (nameB > nameA) {
          return -1;
        } else {
          return 0;
        }
      });
      obj.diamonds = diamonds;
      obj.colorstone = colorstone;
      obj.misc = misc;
      obj.netWtlossWt = netWtlossWt;
      obj.metals = metals;
      totals.netWtlossWt += netWtlossWt;
      let metalRate = 0;
      let metalcount = 0;
      obj.metals.forEach((ele, ind) => {
        metalRate += ele?.Rate;
        metalcount += 1;
      });
      if (metalcount > 0) {
        metalRate = metalRate / metalcount;
      }
      obj.metalRate = metalRate;
      obj.metalcount = metalcount;
      if (e?.GroupJob !== "") {
        let findData = dataArr.findIndex(
          (ele) => ele?.GroupJob === e?.GroupJob
        );
        if (findData === -1) {
          dataArr.push(obj);
        } else {
          if (obj?.GroupJob === obj?.SrJobno) {
            dataArr[findData].SrJobno = dataArr[findData]?.GroupJob;
            dataArr[findData].SubCategoryname = obj?.SubCategoryname;
            dataArr[findData].Categoryname = obj?.Categoryname;
            dataArr[findData].designno = obj?.designno;
            dataArr[findData].DesignImage = obj?.DesignImage;
            dataArr[findData].MetalTypePurity = obj?.MetalTypePurity;
            dataArr[findData].MetalType = obj?.MetalType;
            dataArr[findData].MetalPurity = obj?.MetalPurity;
          } else {
            obj.SrJobno = obj?.GroupJob;
            obj.SubCategoryname = dataArr[findData]?.SubCategoryname;
            obj.Categoryname = dataArr[findData]?.Categoryname;
            obj.designno = dataArr[findData]?.designno;
            obj.DesignImage = dataArr[findData]?.DesignImage;
            obj.MetalTypePurity = dataArr[findData]?.MetalTypePurity;
            obj.MetalType = dataArr[findData]?.MetalType;
            obj.MetalPurity = dataArr[findData]?.MetalPurity;
          }
          let diamonds = [
            ...obj?.diamonds,
            ...dataArr[findData]?.diamonds,
          ]?.flat();
          let blankDiamonds = [];
          diamonds.forEach((ele, ind) => {
            let findDiamond = blankDiamonds.findIndex(
              (elem, index) =>
                elem?.ShapeName === ele?.ShapeName && elem?.Rate === ele?.Rate
            );
            if (findDiamond === -1) {
              blankDiamonds.push(ele);
            } else {
              blankDiamonds[findDiamond].Wt += ele?.Wt;
              blankDiamonds[findDiamond].Amount += ele?.Amount;
              blankDiamonds[findDiamond].Pcs += ele?.Pcs;
            }
          });
          let blankColorStones = [];
          let colorstones = [
            ...obj?.colorstone,
            ...dataArr[findData]?.colorstone,
          ]?.flat();
          colorstones?.forEach((ele, ind) => {
            let findColorstone = blankColorStones.findIndex(
              (elem, index) =>
                elem?.ShapeName === ele?.ShapeName && elem?.Rate === ele?.Rate
            );
            if (findColorstone === -1) {
              blankColorStones.push(ele);
            } else {
              blankColorStones[findColorstone].Wt += ele?.Wt;
              blankColorStones[findColorstone].Amount += ele?.Amount;
              blankColorStones[findColorstone].Pcs += ele?.Pcs;
            }
          });
          dataArr[findData].diamonds = blankDiamonds;
          dataArr[findData].colorstone = blankColorStones;
          dataArr[findData].UnitCost += obj?.UnitCost;
          dataArr[findData].TotalAmount += obj?.TotalAmount;
          dataArr[findData].misc = [
            ...dataArr[findData].misc,
            ...obj?.misc,
          ]?.flat();
          dataArr[findData].netWtlossWt += obj?.netWtlossWt;
          dataArr[findData].MetalAmount += obj?.MetalAmount;
          dataArr[findData].OtherCharges += obj?.OtherCharges;
          dataArr[findData].TotalDiamondHandling += obj?.TotalDiamondHandling;
          dataArr[findData].DiamondAmount += obj?.DiamondAmount;
          dataArr[findData].grosswt += obj?.grosswt;
          dataArr[findData].MiscAmount += obj?.MiscAmount;
          dataArr[findData].TotalDiaSetcost += obj?.TotalDiaSetcost;
          dataArr[findData].TotalCsSetcost += obj?.TotalCsSetcost;

          let metals = [...dataArr[findData]?.metals, ...obj?.metals]?.flat();
          let blankMetals = [];
          metals?.forEach((ele, ind) => {
            if (ele?.IsPrimaryMetal === 1) {
              if (blankMetals?.length === 0) {
                blankMetals?.push(ele);
              } else {
                if (ele?.StockBarcode === obj?.GroupJob) {
                  blankMetals[0].ShapeName = ele?.ShapeName;
                  blankMetals[0].QualityName = ele?.QualityName;
                }
                blankMetals[0].Pcs += ele?.Pcs;
                blankMetals[0].Wt += ele?.Wt;
                blankMetals[0].Amount += ele?.Amount;
              }
            }
          });
          obj.diamonds = blankDiamonds;
          obj.metals = blankMetals;
          // dataArr.push(obj);
        }
      } else {
        dataArr.push(obj);
      }
    });

    let datass = OrganizeDataPrint(
      data?.BillPrint_Json[0],
      data?.BillPrint_Json1,
      data?.BillPrint_Json2
    );

    let bankDetails = ReceiveInBank(data?.BillPrint_Json[0]?.BankPayDet);
    setBank(bankDetails);

    totals.discount = totals?.UnitCost - totals?.TotalAmount;
    settotal(totals);

    let taxValue = taxGenrator(data?.BillPrint_Json[0], totals?.TotalAmount);
    setTax(taxValue);

    totals.afterTaxAmount =
      taxValue.reduce((acc, currVal) => {
        return (
          acc + +currVal?.amount * data?.BillPrint_Json[0]?.CurrencyExchRate
        );
      }, 0) +
      totals?.TotalAmount / data?.BillPrint_Json[0]?.CurrencyExchRate +
      data?.BillPrint_Json[0]?.AddLess /
        data?.BillPrint_Json[0]?.CurrencyExchRate;

    totals.netBalanceAmount =
      totals.afterTaxAmount -
      data?.BillPrint_Json[0]?.OldGoldAmount -
      data?.BillPrint_Json[0]?.AdvanceAmount -
      data?.BillPrint_Json[0]?.CashReceived -
      data?.BillPrint_Json[0]?.BankReceived;
    dataArr.sort((a, b) => {
      let nameA = a?.designno?.toLowerCase();
      let nameB = b?.designno?.toLowerCase();
      if (nameA > nameB) {
        return 1;
      } else if (nameB > nameA) {
        return -1;
      } else {
        return 0;
      }
    });
    setData(dataArr);
  };

  const handleChange = (e) => {
    image ? setImage(false) : setImage(true);
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
        console.error(error);
      }
    };
    sendData();
  }, []);

  const descLines = json0Data?.OldGoldDesc?.replace(/^<br\s*\/?>/i, "")
    .split(/<br\s*\/?>/i) // Split by <br>
    .map((line) => {
      const [label, value] = line.split(" - ");
      return { label: label.trim(), value: value?.trim() };
    });

  return (
    <>
      {loader ? (
        <Loader />
      ) : msg === "" ? (
        <div
          className={`container max_width_container pad_60_allPrint ${style?.estimate1Container} px-1`}
        >
          {/* print button */}
          <div
            className={`d-flex justify-content-end align-items-center ${style?.print_sec_sum4} pb-4 mt-5 w-100 ${style?.font_16}`}
          >
            <div className="form-check pe-3 mb-0">
              <input
                className="form-check-input border-dark"
                type="checkbox"
                checked={image}
                onChange={(e) => handleChange(e)}
                name="image"
              />
              <label className="form-check-label h6 mb-0 pt-1">
                With Image
              </label>
            </div>
            <div className="form-check ps-3">
              <input
                type="button"
                className="btn_white blue mt-0 py-1"
                value="Print"
                onClick={(e) => handlePrint(e)}
              />
            </div>
          </div>
          {/* gst no  */}
          <div
            className={`d-flex justify-content-center pt-2 ${style?.font_112}`}
          >
            <p>
              {json0Data?.Company_VAT_GST_No} | {json0Data?.Company_CST_STATE}-
              {json0Data?.Company_CST_STATE_No} | PAN-{json0Data?.Pannumber}
            </p>
          </div>
          {/* print name */}
          <div className="border border-2 min_height_label bgGrey text-center estimateprint_top_label">
            <p className="text-uppercase fw-bold text-white">
              {json0Data?.PrintHeadLabel}
            </p>
          </div>
          {/* customer detail */}
          <div className={` border border-black d-flex ${style?.font_112}`}>
            <div className="col-7 p-1 border-end pb-2">
              {json0Data?.CustName && (
                <p className="h-3">
                  Customer Name:{" "}
                  <span className="fw-bold">{json0Data.CustName}</span>
                </p>
              )}

              {json0Data?.customerAddress1 && (
                <p className="h-3">{json0Data.customerAddress1}</p>
              )}

              {json0Data?.customerAddress2 && (
                <p className="h-3">{json0Data.customerAddress2}</p>
              )}

              {(json0Data?.customercity || json0Data?.customerpincode) && (
                <p className="h-3">
                  {json0Data.customercity} {json0Data.customerpincode}
                </p>
              )}

              {json0Data?.customercountry && (
                <p className="h-3">{json0Data.customercountry}</p>
              )}

              {json0Data?.customeremail1 && (
                <p className="h-3">{json0Data.customeremail1}</p>
              )}

              {json0Data?.customermobileno && (
                <p className="h-3">Phno: {json0Data.customermobileno}</p>
              )}

              {json0Data?.aadharno && (
                <p className="h-3">
                  {json0Data.vat_cst_pan}
                  {json0Data.aadharno && ` | Aadhar-${json0Data.aadharno}`}
                </p>
              )}

              {json0Data?.Cust_CST_STATE_No && (
                <p className="h-3">
                  {json0Data?.Cust_CST_STATE_No !== "" &&
                    `${json0Data?.Cust_CST_STATE} -`}
                  {json0Data?.Cust_CST_STATE_No}
                </p>
              )}
            </div>

            <div className="col-5 p-1">
              <div className="d-flex">
                <p className="fw-bold col-6">INVOICE NO </p>
                <p className="col-6">{json0Data?.InvoiceNo}</p>{" "}
              </div>
              <div className="d-flex">
                <p className="fw-bold col-6">DATE </p>
                <p className="col-6">{json0Data?.EntryDate}</p>{" "}
              </div>
              {document.map((e, i) => {
                return (
                  <div key={i} className="d-flex">
                    <p className="fw-bold col-6">{e?.label} </p>
                    <p className="col-6">{e?.value}</p>{" "}
                  </div>
                );
              })}
            </div>
          </div>
          {/* table header */}
          <div className={`border d-flex ${style?.font_12}`}>
            <div className="col-3 d-flex">
              <div className="col-3 p-1 border-end d-flex align-items-center justify-content-center">
                <p className="fw-bold">Sr#</p>
              </div>
              <div className="col-6 p-1 border-end d-flex align-items-center justify-content-center">
                <p className="fw-bold text-center">Product Description</p>
              </div>
              <div className="col-3 p-1 border-end d-flex align-items-center justify-content-center">
                <p className="fw-bold">HSN</p>
              </div>
            </div>
            <div className="col-6">
              <div className="d-grid h-100 w-100 border-end">
                <div className="d-flex align-items-center justify-content-center w-100 border-bottom p-1">
                  <p className="fw-bold">Material Description</p>
                </div>
                <div className="d-flex align-items-center justify-content-center w-100">
                  <div className="col-2 d-flex align-items-center justify-content-center p-1 border-end">
                    <p className="fw-bold">Material</p>
                  </div>
                  <div className="col-2 d-flex align-items-center justify-content-center p-1 border-end">
                    <p className="fw-bold">Carat</p>
                  </div>
                  <div className="col-2 d-flex align-items-center justify-content-center p-1 border-end">
                    <p className="fw-bold">GWT</p>
                  </div>
                  <div className="col-2 d-flex align-items-center justify-content-center p-1 border-end">
                    <p className="fw-bold">LESS WT.</p>
                  </div>
                  <div className="col-2 d-flex align-items-center justify-content-center p-1 border-end">
                    <p className="fw-bold">NWT</p>
                  </div>
                  <div className="col-2 d-flex align-items-center justify-content-center p-1">
                    <p className="fw-bold">Rate</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-3 d-flex">
              <div className="col-3 p-1 border-end d-flex align-items-center justify-content-center">
                <p className="fw-bold">Making</p>
              </div>
              <div className="col-4 p-1 border-end d-flex align-items-center justify-content-center">
                <p className="fw-bold text-center">Material Charges</p>
              </div>
              <div className="col-5 p-1 d-flex align-items-center justify-content-center">
                <p className="fw-bold">Total</p>
              </div>
            </div>
          </div>
          
          {/* table data */}
          {data.map((e, i) => {
            return (
              <div
                className={`border-start border-end d-flex no_break ${style?.word_break} ${style?.font_12}`}
                key={i}
              >
                <div className="col-3 d-flex border-bottom">
                  <div className="col-3 p-1 border-end d-flex align-items-center justify-content-center">
                    <p className="">{i + 1}</p>
                  </div>
                  <div className="col-6 p-1 border-end">
                    <p style={{ wordBreak: "normal" }}>
                      {" "}
                      {e?.SubCategoryname} {e?.Categoryname}
                    </p>
                    <p style={{ wordBreak: "normal" }}>
                      {e?.designno} | {e?.SrJobno}
                    </p>
                    {image && (
                      <img
                        src={e?.DesignImage}
                        alt=""
                        className={`w-100 ${style?.img}`}
                        onError={handleImageError}
                      />
                    )}
                    {e?.HUID !== "" && (
                      <p
                        className="text-center pt-2"
                        style={{ wordBreak: "normal" }}
                      >
                        HUID-{e?.HUID}
                      </p>
                    )}
                  </div>
                  <div className="col-3 p-1 border-end d-flex align-items-center justify-content-center">
                    <p className="">{json0Data?.HSN_No}</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-grid h-100 border-end">
                    <div className="d-flex border-bottom">
                      <div className="col-2 d-flex align-items-center justify-content-center p-1 border-end">
                        <p
                          className="text-center"
                          style={{ wordBreak: "normal" }}
                        >
                          {e?.MetalType}
                        </p>
                      </div>
                      <div className="col-2 d-flex align-items-center justify-content-center p-1 border-end">
                        <p
                          className="text-center"
                          style={{ wordBreak: "normal" }}
                        >
                          {e?.MetalPurity}
                        </p>
                      </div>
                      <div className="col-2 d-flex align-items-center justify-content-center p-1 border-end">
                        <p className="text-center">
                          {NumberWithCommas(e?.grosswt, 3)}{" "}
                        </p>
                      </div>
                      <div className="col-2 d-flex align-items-center justify-content-center p-1 border-end">
                        <p className="text-center"></p>
                      </div>
                      <div className="col-2 d-flex align-items-center justify-content-center p-1 border-end">
                        <p className="text-center">
                          {e?.netWtlossWt !== 0 &&
                            NumberWithCommas(e?.netWtlossWt, 3)}
                        </p>
                      </div>
                      <div className="col-2 d-flex align-items-center justify-content-center p-1">
                        <p className="text-center">
                          {e?.netWtlossWt !== 0 &&
                            NumberWithCommas(
                              e?.MetalAmount /
                                json0Data?.CurrencyExchRate /
                                e?.netWtlossWt /
                                json0Data?.CurrencyExchRate,
                              2
                            )}
                        </p>
                      </div>
                    </div>
                    {e?.diamonds.map((ele, ind) => {
                      return (
                        <div className="d-flex border-bottom" key={ind}>
                          <div className="col-2 d-flex align-items-center justify-content-center p-1 border-end">
                            <p
                              className="text-center"
                              style={{ wordBreak: "normal" }}
                            >
                              {ele?.ShapeName}
                            </p>
                          </div>
                          <div className="col-2 d-flex align-items-center justify-content-center p-1 border-end">
                            <p className="text-center"> </p>
                          </div>
                          <div className="col-2 d-flex align-items-center justify-content-center p-1 border-end">
                            <p className="text-center"></p>
                          </div>
                          <div className="col-2 d-flex align-items-center justify-content-center p-1 border-end">
                            <p className="text-center">
                              {ele?.Wt !== 0 && NumberWithCommas(ele?.Wt, 3)}
                            </p>
                          </div>
                          <div className="col-2 d-flex align-items-center justify-content-center p-1 border-end">
                            <p className="text-center"></p>
                          </div>
                          <div className="col-2 d-flex align-items-center justify-content-center p-1">
                            <p className="text-center"></p>
                          </div>
                        </div>
                      );
                    })}
                    {e?.colorstone.map((ele, ind) => {
                      return (
                        <div className="d-flex border-bottom" key={ind}>
                          <div className="col-2 d-flex align-items-center justify-content-center p-1 border-end">
                            <p
                              className="text-center"
                              style={{ wordBreak: "normal" }}
                            >
                              {ele?.ShapeName}
                            </p>
                          </div>
                          <div className="col-2 d-flex align-items-center justify-content-center p-1 border-end">
                            <p className="text-center"> </p>
                          </div>
                          <div className="col-2 d-flex align-items-center justify-content-center p-1 border-end">
                            <p className="text-center"></p>
                          </div>
                          <div className="col-2 d-flex align-items-center justify-content-center p-1 border-end">
                            <p className="text-center">
                              {ele?.Wt !== 0 && (
                                <>
                                  {ele?.IsLess === 1 && "Less: "}
                                  {NumberWithCommas(ele?.Wt, 3)}
                                </>
                              )}
                            </p>
                          </div>
                          <div className="col-2 d-flex align-items-center justify-content-center p-1 border-end">
                            <p className="text-center"></p>
                          </div>
                          <div className="col-2 d-flex align-items-center justify-content-center p-1">
                            <p className="text-center"></p>
                          </div>
                        </div>
                      );
                    })}
                    {e?.misc.map((ele, ind) => {
                      return (
                        <div className="d-flex border-bottom" key={ind}>
                          <div className="col-2 d-flex align-items-center justify-content-center p-1 border-end">
                            <p
                              className="text-center"
                              style={{ wordBreak: "normal" }}
                            >
                              {ele?.IsHSCOE === 0
                                ? ele?.ShapeName
                                : ele?.ShapeName?.replace("Certification_", "")}
                            </p>
                          </div>
                          <div className="col-2 d-flex align-items-center justify-content-center p-1 border-end">
                            <p className="text-center"> </p>
                          </div>
                          <div className="col-2 d-flex align-items-center justify-content-center p-1 border-end">
                            <p className="text-center"></p>
                          </div>
                          <div className="col-2 d-flex align-items-center justify-content-center p-1 border-end">
                            <p className="text-center">
                              {ele?.Wt !== 0 && (
                                <>
                                  {ele?.IsLess === 1 && "Less: "}
                                  {NumberWithCommas(ele?.Wt, 3)}
                                </>
                              )}
                            </p>
                          </div>
                          <div className="col-2 d-flex align-items-center justify-content-center p-1 border-end">
                            <p className="text-center"></p>
                          </div>
                          <div className="col-2 d-flex align-items-center justify-content-center p-1">
                            <p className="text-center"></p>
                          </div>
                        </div>
                      );
                    })}
                    {e?.OtherCharges + e?.TotalDiamondHandling !== 0 && (
                      <div className="d-flex border-bottom">
                        <div className="col-2 d-flex align-items-center justify-content-center p-1 border-end">
                          <p
                            className="text-center"
                            style={{ wordBreak: "normal" }}
                          >
                            Other Charge{" "}
                          </p>
                        </div>
                        <div className="col-2 d-flex align-items-center justify-content-center p-1 border-end">
                          <p className="text-center"> </p>
                        </div>
                        <div className="col-2 d-flex align-items-center justify-content-center p-1 border-end">
                          <p className="text-center"></p>
                        </div>
                        <div className="col-2 d-flex align-items-center justify-content-center p-1 border-end">
                          <p className="text-center"></p>
                        </div>
                        <div className="col-2 d-flex align-items-center justify-content-center p-1 border-end">
                          <p className="text-center"></p>
                        </div>
                        <div className="col-2 d-flex align-items-center justify-content-center p-1">
                          <p className="text-center"></p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-3 d-flex">
                  <div className="col-3 p-1 border-end d-flex align-items-center justify-content-center border-bottom">
                    <p className="">
                      {NumberWithCommas(e?.MaKingCharge_Unit, 2)}
                    </p>
                  </div>
                  <div className="col-4 border-end d-flex align-items-center justify-content-center">
                    <div className="d-grid h-100 w-100">
                      <div className="d-flex align-items-center justify-content-end p-1 border-bottom">
                        <p className="">
                          {NumberWithCommas(
                            e?.MetalAmount / json0Data?.CurrencyExchRate,
                            2
                          )}
                        </p>{" "}
                      </div>
                      {e?.diamonds.map((ele, ind) => {
                        return (
                          <div
                            className="d-flex align-items-center justify-content-end p-1 border-bottom"
                            key={ind}
                          >
                            <p className="">
                              {ele?.Amount !== 0 ? (
                                NumberWithCommas(
                                  ele?.Amount / json0Data?.CurrencyExchRate,
                                  2
                                )
                              ) : (
                                <>&nbsp;</>
                              )}
                            </p>{" "}
                          </div>
                        );
                      })}
                      {e?.colorstone.map((ele, ind) => {
                        return (
                          <div
                            className="d-flex align-items-center justify-content-end p-1 border-bottom"
                            key={ind}
                          >
                            <p className="">
                              {ele?.Amount !== 0 ? (
                                NumberWithCommas(
                                  ele?.Amount / json0Data?.CurrencyExchRate,
                                  2
                                )
                              ) : (
                                <>&nbsp;</>
                              )}
                            </p>{" "}
                          </div>
                        );
                      })}
                      {e?.misc.map((ele, ind) => {
                        return (
                          <div
                            className="d-flex align-items-center justify-content-end p-1 border-bottom"
                            key={ind}
                          >
                            <p className="">
                              {ele?.IsHSCOE === 0 && (
                                <>
                                  {ele?.Amount !== 0 ? (
                                    NumberWithCommas(
                                      ele?.Amount / json0Data?.CurrencyExchRate,
                                      2
                                    )
                                  ) : (
                                    <>&nbsp;</>
                                  )}
                                </>
                              )}
                              {ele?.IsHSCOE !== 0 && (
                                <>
                                  {ele?.Amount !== 0 ? (
                                    NumberWithCommas(
                                      ele?.Amount / json0Data?.CurrencyExchRate,
                                      2
                                    )
                                  ) : (
                                    <>&nbsp;</>
                                  )}
                                </>
                              )}
                            </p>{" "}
                          </div>
                        );
                      })}
                      {e?.OtherCharges + e?.TotalDiamondHandling !== 0 && (
                        <div className="d-flex align-items-center justify-content-end p-1 border-bottom">
                          <p className="">
                            {NumberWithCommas(
                              (e?.OtherCharges + e?.TotalDiamondHandling) /
                                json0Data?.CurrencyExchRate,
                              2
                            )}
                          </p>{" "}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-5 p-1 d-flex align-items-center justify-content-end border-bottom">
                    <p className="">
                      {NumberWithCommas(
                        e?.UnitCost / json0Data?.CurrencyExchRate,
                        2
                      )}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          {/* table total */}
          <div
            className={`border-start border-bottom border-end d-flex no_break ${style?.word_break} ${style?.font_12}`}
          >
            <div className="col-3 d-flex">
              <div className="col-3 p-1 border-end d-flex align-items-center justify-content-center"></div>
              <div className="col-6 p-1 border-end d-flex align-items-center">
                <p className="fw-bold text-center" style={{ fontSize: "17px" }}>
                  TOTAL
                </p>
              </div>
              <div className="col-3 p-1 border-end d-flex align-items-center justify-content-center"></div>
            </div>
            <div className="col-6 d-flex border-end">
              <div className="col-2 d-flex align-items-center justify-content-center p-1 border-end"></div>
              <div className="col-2 d-flex align-items-center justify-content-center p-1 border-end"></div>
              <div className="col-2 d-flex align-items-center justify-content-center p-1 border-end">
                <p
                  className={`fw-bold text-center ${style?.word_breaks}`}
                  style={{ wordBreak: "break-all" }}
                >
                  {NumberWithCommas(total.grosswt, 3)}
                </p>
              </div>
              <div className="col-2 d-flex align-items-center justify-content-center flex-column text-center p-1 border-end">
                <p
                  className="fw-bold text-center"
                  style={{ wordBreak: "normal" }}
                >
                  {NumberWithCommas(total?.materialWt, 3)} Ctw{" "}
                </p>
                <p
                  className="fw-bold text-center"
                  style={{ wordBreak: "normal" }}
                >
                  {NumberWithCommas(total?.miscWt, 3)} gm{" "}
                </p>
              </div>
              <div className="col-2 d-flex align-items-center justify-content-center p-1 border-end flex-column">
                <p
                  className={`fw-bold text-center ${style?.word_breaks}`}
                  style={{ wordBreak: "break-all" }}
                >
                  {NumberWithCommas(total?.netWtlossWt, 3)}{" "}
                </p>
              </div>
              <div className="col-2 d-flex align-items-center justify-content-center p-1">
                <p className=""></p>
              </div>
            </div>
            <div className="col-3 d-flex">
              <div className="col-3 p-1 border-end d-flex align-items-center justify-content-center"></div>
              <div className="col-4 border-end d-flex align-items-center justify-content-end p-1">
                {" "}
                <p
                  className={`fw-bold text-center ${style?.word_breaks}`}
                  style={{ wordBreak: "break-all" }}
                >
                  {NumberWithCommas(
                    total?.OtherCharges / json0Data?.CurrencyExchRate,
                    2
                  )}{" "}
                </p>{" "}
              </div>
              <div className="col-5 p-1 d-flex align-items-center justify-content-end">
                <p
                  className={`fw-bold text-center ${style?.word_breaks}`}
                  style={{ wordBreak: "break-all" }}
                >
                  {NumberWithCommas(
                    total?.UnitCost / json0Data?.CurrencyExchRate,
                    2
                  )}{" "}
                </p>
              </div>
            </div>
          </div>
          {/* tax */}
          <div
            className={`border-start border-bottom border-end d-flex no_break ${style?.font_12}`}
          >
            <div className="col-9 border-end">
              <div className="w-100 h-100">
                <div className="border-bottom p-1 h-25">
                  <p>
                    Narration / Remark:{" "}
                    <span className="fw-bold">{json0Data?.Remark}</span>
                  </p>
                </div>
                <div className="p-1">
                  <p>Old Gold Purchase Description : </p>
                  {descLines?.map((item, index) => (
                    <p key={index}>
                      <span style={{ fontWeight: "bold" }}>{item.label}:</span>{" "}
                      <span style={{ fontWeight: "bold" }}>{item.value}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-3">
              <div className="d-flex">
                <div className="col-7 border-end">
                  {" "}
                  <p className="px-1 text-end">Discount</p>
                </div>
                <div className="col-5">
                  <p
                    className="px-1 text-end"
                    style={{ wordBreak: "break-all" }}
                  >
                    {NumberWithCommas(total.discount, 2)}
                  </p>
                </div>
              </div>
              <div className="d-flex">
                <div className="col-7 border-end">
                  <p className="px-1 text-end">Total Amt. before Tax</p>
                </div>
                <div className="col-5">
                  <p
                    className="px-1 text-end"
                    style={{ wordBreak: "break-all" }}
                  >
                    {NumberWithCommas(
                      +total?.TotalAmount?.toFixed(2) /
                        json0Data?.CurrencyExchRate,
                      2
                    )}
                  </p>
                </div>
              </div>
              <div className="d-flex">
                <div className="col-7 border-end">
                  {tax.map((e, i) => {
                    return (
                      <p className="px-1 text-end" key={i}>
                        {e?.name} @ {e?.per}
                      </p>
                    );
                  })}
                </div>
                <div className="col-5">
                  {tax.map((e, i) => {
                    return (
                      <p
                        className="px-1 text-end"
                        key={i}
                        style={{ wordBreak: "break-all" }}
                      >
                        {NumberWithCommas(
                          +e?.amount / json0Data?.CurrencyExchRate,
                          2
                        )}
                      </p>
                    );
                  })}
                </div>
              </div>
              {json0Data?.AddLess !== 0 && (
                <div className="d-flex">
                  <div className="col-7 border-end">
                    <p className="px-1 text-end">
                      {json0Data?.AddLess > 0 ? "Add" : "Less"}
                    </p>
                  </div>
                  <div className="col-5">
                    <p
                      className="px-1 text-end"
                      style={{ wordBreak: "break-all" }}
                    >
                      {NumberWithCommas(
                        json0Data?.AddLess / json0Data?.CurrencyExchRate,
                        2
                      )}
                    </p>
                  </div>
                </div>
              )}
              <div className="d-flex">
                <div className="col-7 border-end">
                  <p className="px-1 text-end">Total Amt. after Tax</p>
                </div>
                <div className="col-5">
                  <p
                    className="px-1 text-end"
                    style={{ wordBreak: "break-all" }}
                  >
                    {/* {NumberWithCommas(
                                (total?.TotalAmount / json0Data?.CurrencyExchRate) + (json0Data?.AddLess / json0Data?.CurrencyExchRate)
                                + (tax?.reduce((acc, cObj) => acc + (+cObj?.amount / json0Data?.CurrencyExchRate), 0)), 2)} */}
                    {NumberWithCommas(
                      +(
                        total?.TotalAmount / json0Data?.CurrencyExchRate
                      )?.toFixed(2) +
                        json0Data?.AddLess / json0Data?.CurrencyExchRate +
                        tax?.reduce(
                          (acc, cObj) =>
                            acc +
                            +(
                              +cObj?.amount / json0Data?.CurrencyExchRate
                            )?.toFixed(2),
                          0
                        ),
                      2
                    )}
                  </p>
                </div>
              </div>
              <div className="d-flex">
                <div className="col-7 border-end">
                  <p className="px-1 text-end">Old Gold</p>
                </div>
                <div className="col-5">
                  <p
                    className="px-1 text-end"
                    style={{ wordBreak: "break-all" }}
                  >
                    {NumberWithCommas(json0Data?.OldGoldAmount, 2)}
                  </p>
                </div>
              </div>
              <div className="d-flex">
                <div className="col-7 border-end">
                  <p className="px-1 text-end">Advance</p>
                </div>
                <div className="col-5">
                  <p
                    className="px-1 text-end"
                    style={{ wordBreak: "break-all" }}
                  >
                    {NumberWithCommas(json0Data?.AdvanceAmount, 2)}
                  </p>
                </div>
              </div>
              <div className="d-flex">
                <div className="col-7 border-end">
                  <p className="px-1 text-end">Recv.in Cash</p>
                </div>
                <div className="col-5">
                  <p
                    className="px-1 text-end"
                    style={{ wordBreak: "break-all" }}
                  >
                    {NumberWithCommas(json0Data?.CashReceived, 2)}
                  </p>
                </div>
              </div>
              <div className="d-flex">
                <div className="col-7 border-end">
                  {bank?.map((ele, ind) => {
                    return (
                      <p className="px-1 text-end" key={ind}>
                        Recv.in Bank({ele?.label})
                      </p>
                    );
                  })}
                </div>
                <div className="col-5">
                  {bank?.map((ele, ind) => {
                    return (
                      <p
                        className="px-1 text-end"
                        style={{ wordBreak: "break-all" }}
                        key={ind}
                      >
                        {NumberWithCommas(+ele?.amount, 2)}
                      </p>
                    );
                  })}
                </div>
              </div>
              <div className="d-flex">
                <div className="col-7 border-end">
                  <p className="px-1 text-end">Net Bal. Amount</p>
                </div>
                <div className="col-5">
                  <p
                    className="px-1 text-end"
                    style={{ wordBreak: "break-all" }}
                  >
                    {NumberWithCommas(
                      total?.TotalAmount / json0Data?.CurrencyExchRate +
                        json0Data?.AddLess / json0Data?.CurrencyExchRate +
                        tax?.reduce(
                          (acc, cObj) =>
                            acc + +cObj?.amount / json0Data?.CurrencyExchRate,
                          0
                        ) -
                        bank?.reduce((acc, cObj) => acc + +cObj?.amount, 0) -
                        json0Data?.CashReceived,
                      2
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* grand total */}
          <div
            className={`border-start border-bottom border-end d-flex no_break ${style?.font_12}`}
          >
            <div className="col-9 p-1 border-end">
              <p className="">In Words {json0Data?.Currencyname}</p>

              <p className="fw-bold">
                {toWords.convert(
                  +fixedValues(
                    +(+(
                      total?.TotalAmount / json0Data?.CurrencyExchRate
                    )?.toFixed(2)) +
                      json0Data?.AddLess / json0Data?.CurrencyExchRate +
                      tax?.reduce(
                        (acc, cObj) =>
                          acc +
                          +(
                            +cObj?.amount / json0Data?.CurrencyExchRate
                          )?.toFixed(2),
                        0
                      ),
                    2
                  )
                )}{" "}
                Only
              </p>
            </div>
            <div className="col-3 d-flex">
              <div className="col-7 border-end d-flex align-items-center justify-content-end text-end p-1">
                <p className="fw-bold text-end">GRAND TOTAL </p>
              </div>
              <div className="col-5 d-flex align-items-center justify-content-end text-end p-1">
                <p className="fw-bold" style={{ wordBreak: "break-all" }}>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: json0Data?.Currencysymbol,
                    }}
                  ></span>{" "}
                  {NumberWithCommas(
                    +(
                      total?.TotalAmount / json0Data?.CurrencyExchRate
                    )?.toFixed(2) +
                      json0Data?.AddLess / json0Data?.CurrencyExchRate +
                      tax?.reduce(
                        (acc, cObj) =>
                          acc +
                          +(
                            +cObj?.amount / json0Data?.CurrencyExchRate
                          )?.toFixed(2),
                        0
                      ),
                    2
                  )}
                </p>
              </div>
            </div>
          </div>
          {/* remark */}
          <div
            className={`border-start border-bottom border-end d-flex pt-2 no_break ${style?.remark}`}
          >
            <div
              dangerouslySetInnerHTML={{ __html: json0Data?.Declaration }}
            ></div>
          </div>
          {/* bank detail */}
          <div
            className={`border-start border-bottom border-end d-flex no_break ${style?.font_12}`}
          >
            <div className="col-4 p-1 border-end">
              <p className="fw-bold">Bank Detail</p>
              <p>Bank Name:{json0Data?.bankname}</p>
              <p>Branch: {json0Data?.bankaddress}</p>
              <p>Account Name: {json0Data?.accountname}</p>
              <p>Account No. : {json0Data?.accountnumber}</p>
              <p>RTGS/NEFT IFSC: {json0Data?.rtgs_neft_ifsc}</p>
            </div>
            <div className="col-4 d-flex flex-column justify-content-between p-1 border-end">
              <p>Signature</p>
              <p className="fw-bold">{json0Data?.customerfirmname}</p>
            </div>
            <div className="col-4 d-flex flex-column justify-content-between p-1">
              <p>Signature</p>
              <p className="fw-bold">{json0Data?.CompanyFullName}</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
          {msg}
        </p>
      )}
    </>
  );
};

export default EstimatePrint1;

// customerfirmname
// CompanyFullName
