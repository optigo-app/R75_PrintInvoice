// http://localhost:3000/?tkn=OTA2NTQ3MTcwMDUzNTY1MQ==&invn=SlMvMTYyLzIwLTI1&evn=c2FsZQ==&pnm=UGFja2luZyBMaXN0IDE=&up=aHR0cDovL3plbi9qby9hcGktbGliL0FwcC9TYWxlQmlsbF9Kc29u&ctv=NzE=&ifid=PackingList1&pid=undefined

import React, { useEffect, useState } from "react";
import "../../assets/css/prints/miscPrint1.css";
import {
  apiCall,
  checkMsg,
  fixedValues,
  handleImageError,
  handlePrint,
  isObjectEmpty,
  NumberWithCommas,
  otherAmountDetail,
  taxGenrator,
} from "../../GlobalFunctions";
import Loader from "../../components/Loader";
import style from "../../assets/css/prints/packingList1.module.css";

const PackingList1 = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
  const [loader, setLoader] = useState(true);
  const [msg, setMsg] = useState("");
  const [json0Data, setJson0Data] = useState({});
  const [data, setData] = useState([]);
  const [total, setTotal] = useState({
    diamondTotal: {
      Wt: 0,
      Pcs: 0,
      Amount: 0,
    },
    metalTotal: {
      grossWt: 0,
      Pcs: 0,
      Amount: 0,
      NetWt: 0,
    },
    colorStone: {
      Wt: 0,
      Pcs: 0,
      Amount: 0,
    },
    otherAmount: 0,
    MakingAmount: 0,
    DiscountAmt: 0,
    TotalAmount: 0,
    amountAfterDiscount: 0,
    netWtLoss: 0,
    metalAmount: 0,
    clrStoneSettignAmount: 0,
    DiaSettignAmount: 0,
  });
  const [isImageWorking, setIsImageWorking] = useState(true);
  const handleImageErrors = () => {
    setIsImageWorking(false);
  };
  const [taxes, setTaxes] = useState([]);

  const [diaQlty, setDiaQlty] = useState(false);

  const checkDiaQlty = () => {
    if (diaQlty) {
      setDiaQlty(false);
    } else {
      setDiaQlty(true);
    }
  };

  const loadData = (data) => {
    let exchangerate = data?.BillPrint_Json[0]?.CurrencyExchRate;
    setJson0Data(data?.BillPrint_Json[0]);
    let newArr = [];
    let metalArr = [];
    let diamondTotal = {
      Wt: 0,
      Pcs: 0,
      Amount: 0,
    };
    let metalTotal = {
      grossWt: 0,
      Pcs: 0,
      Amount: 0,
      NetWt: 0,
    };
    let colorStone = {
      Wt: 0,
      Pcs: 0,
      Amount: 0,
    };
    let otherAmount = 0;
    let MakingAmount = 0;
    let DiscountAmt = 0;
    let TotalAmount = 0;
    let netWtLosss = 0;
    let metalAmounts = 0;
    let clrStoneSettignAmount = 0;
    let DiaSettignAmount = 0;
    data?.BillPrint_Json1.forEach((e, i) => {
      let discountElements = [];
      if (e?.IsCriteriabasedAmount === 1) {
        if (e?.IsDiamondAmount === 1) {
          discountElements?.push({ label: "Diamond" });
        }
        if (e?.IsStoneAmount === 1) {
          discountElements?.push({ label: "Stone" });
        }
        if (e?.IsMetalAmount === 1) {
          discountElements?.push({ label: "Metal" });
        }
        if (e?.IsLabourAmount === 1) {
          discountElements?.push({ label: "Labour" });
        }
        if (e?.IsSolitaireAmount === 1) {
          discountElements?.push({ label: "Solitaire" });
        }
        if (e?.IsMiscAmount === 1) {
          discountElements?.push({ label: "Misc" });
        }
      }
      let otherTotals =
        e?.OtherCharges + e?.TotalDiamondHandling + e?.MiscAmount;
      otherAmount += e?.OtherCharges + e?.TotalDiamondHandling + e?.MiscAmount;
      let obj = { ...e };
      let object = {
        groupjob: e?.GroupJob,
        netwt: e?.NetWt,
        grosswt: e?.grosswt,
        rate: 0,
        amount: 0,
      };
      metalAmounts += e?.MetalAmount;
      let srJob = e?.SrJobno?.split("/");
      if (srJob?.length > 1) {
        srJob = srJob[1];
      } else {
        srJob = srJob[0];
      }
      obj.srJob = srJob;
      let otherTotal = [];
      let diamonds = [];
      let colors = [];
      let metals = [];
      let metalRate = 0;
      let metalAmount = 0;
      let otherCharge = otherAmountDetail(e?.OtherAmtDetail);
      let otherChargess = [];
      let rowWiseDiamondTotal = {
        Wt: 0,
        Pcs: 0,
        Amount: 0,
      };
      let rowWiseColorStoneTotal = {
        Wt: 0,
        Pcs: 0,
        Amount: 0,
      };
      let rowWiseMetalTotal = {
        grossWt: e?.grosswt,
        NetWt: e?.NetWt,
        Amount: 0,
      };
      metalTotal.grossWt += e?.grosswt;
      metalTotal.NetWt += e?.NetWt;

      MakingAmount += e?.MakingAmount;
      DiscountAmt += e?.DiscountAmt;
      TotalAmount += e?.TotalAmount;
      let SettingAmount = 0;
      let netWtLoss = 0;
      let count = 0;
      let metalWt = 0;
      let otherMiscAmount = 0;
      data?.BillPrint_Json2.forEach((ele, ind) => {
        if (ele?.StockBarcode === e?.SrJobno) {
          if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
            // if (i === 0) {
            diamondTotal.Wt += ele?.Wt;
            diamondTotal.Pcs += ele?.Pcs;
            diamondTotal.Amount += ele?.Amount;
            netWtLoss += ele?.Wt;
            DiaSettignAmount += ele?.SettingAmount;
            // }
            if (ele?.IsCenterStone === 1) {
              ele.MasterManagement_DiamondStoneTypeName = "CENTER STONE";
            }
            diamonds.push(ele);
            rowWiseDiamondTotal.Wt += ele?.Wt;
            rowWiseDiamondTotal.Pcs += ele?.Pcs;
            rowWiseDiamondTotal.Amount += ele?.Amount;
            SettingAmount += ele?.SettingAmount;
          } else if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
            colors.push(ele);
            rowWiseColorStoneTotal.Wt += ele?.Wt;
            rowWiseColorStoneTotal.Pcs += ele?.Pcs;
            rowWiseColorStoneTotal.Amount += ele?.Amount;
            clrStoneSettignAmount += ele?.SettingAmount;
            // if (i === 0) {
            colorStone.Wt += ele?.Wt;
            colorStone.Pcs += ele?.Pcs;
            colorStone.Amount += ele?.Amount;
            // }
            SettingAmount += ele?.SettingAmount;
          } else if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
            if (ele?.IsPrimaryMetal === 1) {
              metalWt += ele?.Wt;
            }
            count++;
            metals.push(ele);
            metalRate += ele?.Rate;
            object.rate += ele?.Rate;
            object.amount += ele?.Amount;
            metalAmount += ele?.Amount;
            rowWiseMetalTotal.Amount += ele?.Amount;
            if (i === 0) {
              metalTotal.Pcs += ele?.Pcs;
              metalTotal.Amount += ele?.Amount;
            }
          } else if (ele?.MasterManagement_DiamondStoneTypeid === 3) {
            if (ele?.IsHSCOE !== 0) {
              // otherAmount += ele?.Amount;
              let findOther = otherChargess?.findIndex(
                (elem, index) => elem?.ShapeName === ele?.ShapeName
              );
              if (findOther === -1) {
                otherChargess.push(ele);
              } else {
                otherChargess[findOther].Amount += ele?.Amount;
              }
            } else {
              otherMiscAmount += ele?.Amount;
            }
          }
        }
      });
      if (count === 1) {
        netWtLoss = e?.NetWt + e?.LossWt;
      } else if (count > 1) {
        netWtLoss = metalWt;
      }
      netWtLosss += netWtLoss;
      obj.metalRate = metalRate;
      obj.metalAmount = metalAmount;
      obj.diamonds = diamonds;
      obj.colors = colors;
      obj.metals = metals;
      obj.netWtLoss = netWtLoss;
      obj.otherMiscAmount = otherMiscAmount;
      obj.otherTotal = otherTotal;
      obj.otherCharge = otherCharge;
      obj.otherChargess = otherChargess;
      obj.otherTotals = otherTotals;
      obj.discountElements = discountElements;
      obj.OtherCharges += otherChargess.reduce(
        (acc, cObj) => acc + cObj?.Amount,
        0
      );
      obj.rowWiseDiamondTotal = rowWiseDiamondTotal;
      obj.rowWiseColorStoneTotal = rowWiseColorStoneTotal;
      obj.rowWiseMetalTotal = rowWiseMetalTotal;
      obj.SettingAmount = SettingAmount;
      newArr.push(obj);
      if (e?.GroupJob !== "") {
        let findRecord = metalArr.findIndex(
          (elem) => elem.groupjob === e?.GroupJob
        );
        if (findRecord === -1) {
          metalArr.push(object);
        } else {
          metalArr[findRecord].netwt += object.netwt;
          metalArr[findRecord].rate += object.rate;
          metalArr[findRecord].amount += object.amount;
          metalArr[findRecord].grosswt += object.grosswt;
        }
      }
    });
    let taxValue = taxGenrator(data?.BillPrint_Json[0], TotalAmount);
    let taxess =
      taxValue?.reduce(
        (acc, cObj) =>
          acc + +cObj?.amount / data?.BillPrint_Json[0]?.CurrencyExchRate,
        0
      ) +
      data?.BillPrint_Json[0]?.AddLess /
        data?.BillPrint_Json[0]?.CurrencyExchRate;

    setTotal({
      ...total,
      netWtLoss: netWtLosss,
      metalAmount: metalAmounts,
      diamondTotal: diamondTotal,
      colorStone: colorStone,
      metalTotal: metalTotal,
      otherAmount: otherAmount,
      MakingAmount: MakingAmount,
      DiscountAmt: DiscountAmt,
      TotalAmount: TotalAmount,
      amountAfterDiscount:
        TotalAmount / data?.BillPrint_Json[0]?.CurrencyExchRate + taxess,
      DiaSettignAmount: DiaSettignAmount,
      clrStoneSettignAmount: clrStoneSettignAmount,
    });

    // let finalArr = [];
    // newArr.forEach((e, i) => {
    //     let findRecord = finalArr.findIndex((ele, ind) => ele?.GroupJob === e?.GroupJob && e?.GroupJob !== "");
    //     let obj = { ...e };
    //     if (findRecord === -1) {
    //         obj.goldPrice = obj.metalRate;
    //         let obbj = {
    //             kt: obj.MetalTypePurity,
    //             grwt: obj.grosswt,
    //             netwt: obj.NetWt,
    //             rate: obj.goldPrice,
    //             amount: obj.metalAmount
    //         }
    //         obj.metals.forEach((e, i) => {
    //             e.kt = obj.MetalTypePurity;
    //             e.grwt = obj.grosswt;
    //             e.netwt = obj.NetWt;
    //         })
    //         obj.otherTotal = obj.otherCharge;
    //         finalArr.push(obj);
    //     } else {
    //         let obbj = {
    //             kt: "",
    //             grwt: 0,
    //             netwt: 0,
    //             rate: 0,
    //             amount: 0
    //         }
    //         if (finalArr[findRecord]?.GroupJob !== finalArr[findRecord]?.SrJobno) {
    //             finalArr[findRecord].JewelCodePrefix = obj?.JewelCodePrefix;
    //             finalArr[findRecord].designno = obj?.designno;
    //             finalArr[findRecord].SrJobno = obj?.SrJobno;
    //             finalArr[findRecord].DesignImage = obj?.DesignImage;
    //             finalArr[findRecord].MetalTypePurity = obj?.MetalTypePurity;
    //             obbj.kt = finalArr[findRecord].MetalTypePurity;
    //         } else {
    //             obbj.kt = obj.MetalTypePurity;
    //         }
    //         let rowWiseDiamondTotal = {
    //             Wt: 0,
    //             Pcs: 0,
    //             Amount: 0,
    //         }
    //         let rowWiseColorStoneTotal = {
    //             Wt: 0,
    //             Pcs: 0,
    //             Amount: 0,
    //         }
    //         let rowWiseMetalTotal = {
    //             grossWt: 0,
    //             NetWt: 0,
    //             Amount: 0,
    //         }
    //         // metal logic
    //         let findMetalDetails = metalArr.findIndex((elem, indd) => elem.groupjob === finalArr[findRecord]?.GroupJob);
    //         if (findMetalDetails !== 1) {
    //             obbj.grwt = metalArr[findMetalDetails].grosswt;
    //             obbj.netwt = metalArr[findMetalDetails].netwt;
    //             obbj.rate = (metalArr[findMetalDetails].amount) / (obbj.netwt * exchangerate);
    //             obbj.amount = metalArr[findMetalDetails].amount;
    //         }
    //         rowWiseMetalTotal.grossWt = obbj.grwt;
    //         rowWiseMetalTotal.NetWt = obbj.netwt;
    //         rowWiseMetalTotal.Amount = obbj.amount;
    //         let metals = [finalArr[findRecord].metals, obj.metals].flat();
    //         let blankMetals = [];
    //         metals.forEach((ele, ind) => {
    //             let findRec = blankMetals.findIndex(elem => elem?.ShapeName === ele?.ShapeName && elem?.Colorname === ele?.Colorname &&
    //                 elem?.QualityName === ele?.QualityName && elem?.Rate === ele?.Rate);
    //             if (findRec === -1) {
    //                 blankMetals.push(ele)
    //             } else {
    //                 blankMetals[findRec].amount += ele?.Amount;
    //             }
    //         });
    //         blankMetals.forEach((ell, inn) => {
    //             ell.kt = obbj.kt;
    //             ell.grwt = obbj.grwt;
    //             ell.netwt = obbj.netwt;
    //             ell.Rate = obbj.rate;
    //         });
    //         finalArr[findRecord].metals = blankMetals;

    //         // diamond logic
    //         let diamonds = [finalArr[findRecord].diamonds, obj.diamonds].flat();
    //         let blankDiamonds = [];
    //         diamonds.forEach((el, indd) => {
    //             let findRec = blankDiamonds.findIndex(ele => ele?.ShapeName === el?.ShapeName && ele?.Colorname === el?.Colorname &&
    //                 ele?.QualityName === el?.QualityName && ele?.Rate === el?.Rate && el?.SizeName === ele?.SizeName);
    //             if (findRec === -1) {
    //                 blankDiamonds.push(el)
    //             } else {
    //                 blankDiamonds[findRec].Amount += el?.Amount;
    //                 blankDiamonds[findRec].Wt += el?.Wt;
    //                 blankDiamonds[findRec].Pcs += el?.Pcs;
    //                 blankDiamonds[findRec].Rate = (blankDiamonds[findRec].Rate + el?.Rate) / 2;
    //             }
    //             rowWiseDiamondTotal.Wt = el?.Wt;
    //             rowWiseDiamondTotal.Pcs = el?.Pcs;
    //             rowWiseDiamondTotal.Amount = el?.Amount;
    //         });
    //         finalArr[findRecord].diamonds = blankDiamonds;

    //         // colorstone logic
    //         let colorStones = [finalArr[findRecord].colors, obj.colors].flat();
    //         let blankColorstones = [];
    //         colorStones.forEach((el, indd) => {
    //             let findRec = blankColorstones.findIndex(ele => ele?.ShapeName === el?.ShapeName && ele?.Colorname === el?.Colorname &&
    //                 ele?.QualityName === el?.QualityName && ele?.Rate === el?.Rate && el?.SizeName === ele?.SizeName);
    //             if (findRec === -1) {
    //                 blankColorstones.push(el)
    //             } else {
    //                 blankColorstones[findRec].Amount += el?.Amount;
    //                 blankColorstones[findRec].Wt += el?.Wt;
    //                 blankColorstones[findRec].Pcs += el?.Pcs;
    //                 blankColorstones[findRec].Rate = (blankColorstones[findRec].Rate + el?.Rate) / 2;
    //             }
    //             rowWiseColorStoneTotal.Wt = el?.Wt;
    //             rowWiseColorStoneTotal.Pcs = el?.Pcs;
    //             rowWiseColorStoneTotal.Amount = el?.Amount;
    //         });
    //         finalArr[findRecord].colors = blankColorstones;

    //         // other charges logic
    //         let otherTotal = [finalArr[findRecord]?.otherCharge, obj?.otherCharge].flat();
    //         let blankOtherTotal = [];
    //         otherTotal.forEach((el, indd) => {
    //             let findRec = blankOtherTotal.findIndex(ell => ell?.label === el?.label);
    //             if (findRec === -1) {
    //                 blankOtherTotal.push(el);
    //             } else {
    //                 blankOtherTotal[findRec].value = +blankOtherTotal[findRec]?.value + +el?.value;
    //             }
    //         });
    //         finalArr[findRecord].otherTotal = blankOtherTotal;

    //         // rowwise total logic
    //         finalArr[findRecord].rowWiseDiamondTotal = rowWiseDiamondTotal;
    //         finalArr[findRecord].rowWiseColorStoneTotal = rowWiseColorStoneTotal;
    //         finalArr[findRecord].rowWiseMetalTotal = rowWiseMetalTotal;
    //     }
    // });

    setTaxes(taxValue);

    // newArr.sort((a, b) => {
    //     const nameA = (a?.JewelCodePrefix + a?.srJob).toUpperCase();
    //     const nameB = (b?.JewelCodePrefix + b?.srJob).toUpperCase();
    //     if (nameA < nameB) {
    //         return -1;
    //     }
    //     if (nameA > nameB) {
    //         return 1;
    //     }
    //     return 0;
    // });

    newArr?.sort((a, b) => {
      // First, compare based on Categoryname
      if (a.Categoryname < b.Categoryname) return -1;
      if (a.Categoryname > b.Categoryname) return 1;

      // If Categoryname is the same, compare based on SrJobno
      if (a.SrJobno < b.SrJobno) return -1;
      if (a.SrJobno > b.SrJobno) return 1;
      // If both Categoryname and SrJobno are the same, return 0
      return 0;
    });



    const processJewelryData = (newOne) => {
      return newOne.map((obj) => {
        const diamondMap = new Map();
        obj.diamonds.forEach((diamond) => {
          const key = `${diamond.ShapeName}_${diamond.QualityName}_${diamond.Colorname}_${diamond.SizeName}_${diamond.Rate}`;
          if (diamondMap.has(key)) {
            let existingDiamond = diamondMap.get(key);
            existingDiamond.Wt += diamond.Wt; // Merge weight
            existingDiamond.Amount += diamond.Amount; // Merge amount
            existingDiamond.Pcs += diamond.Pcs; // Merge pieces
          } else {
            diamondMap.set(key, { ...diamond });
          }
        });
    
        const colorMap = new Map();
        obj.colors.forEach((color) => {
          const key = `${color.ShapeName}_${color.QualityName}_${color.Colorname}_${color.SizeName}_${color.Rate}`;
          if (colorMap.has(key)) {
            let existingColor = colorMap.get(key);
            existingColor.Wt += color.Wt; // Merge weight
            existingColor.Amount += color.Amount; // Merge amount
            existingColor.Pcs += color.Pcs; // Merge pieces
          } else {
            colorMap.set(key, { ...color });
          }
        });
        
        return { 
          ...obj, 
          diamonds: Array.from(diamondMap.values()), 
          colors: Array.from(colorMap.values()) 
        };
      });
    };
    
    const updatedData = processJewelryData(newArr);
    console.log('Updated Data:', updatedData);
    setData(updatedData);
    // setData(newArr);
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

  const processDiamonds = (diamonds) => {
    if (!Array.isArray(diamonds) || diamonds.length === 0) return [];

    const grouped = diamonds?.reduce((acc, el) => {
      const key = `${el.ShapeName}-${el.QualityName}-${el.Colorname}-${el.SizeName}`;

      if (!acc[key]) {
        acc[key] = { ...el, Wt: el.Wt, Amount: el.Amount, count: 1 };
      } else {
        acc[key].Wt += el.Wt;
        acc[key].Amount += el.Amount;
        acc[key].count += 1;
      }

      return acc;
    }, {});

    return Object.values(grouped).reduce((finalList, item) => {
      if (item.count === 1) {
        // If only one entry, keep as is
        finalList.push(item);
      } else {
        // If merged, push merged entry
        finalList.push({ ...item, count: undefined });
      }
      return finalList;
    }, []);
  };

  return (
    <>
      {loader ? (
        <Loader />
      ) : msg === "" ? (
        <>
          <div
            className={`container max_width_container pad_60_allPrint ${style?.container} px-1`}
          >
            {/* print Button */}
            <div className="printBtn_sec d-flex justify-content-end align-items-center  pt-4 d_none_pcl1">
              <div className="mx-3 d-flex align-items-center">
                <input
                  type="checkbox"
                  value={diaQlty}
                  onChange={() => checkDiaQlty()}
                  id="diaqlty"
                />
                <label
                  htmlFor="diaqlty"
                  className="mx-2 user-select-none fspcl"
                >
                  Diamond Quality
                </label>
              </div>
              <div className={`printBtn_sec text-end  `}>
                <input
                  type="button"
                  className="btn_white blue"
                  style={{ fontSize: "12px" }}
                  value="Print"
                  onClick={(e) => handlePrint(e)}
                />
              </div>
            </div>
            {/* Print Logo */}
            <div className="pt-2">
              {isImageWorking && json0Data?.PrintLogo !== "" && (
                <img
                  src={json0Data?.PrintLogo}
                  alt=""
                  className="w-100 h-auto ms-auto d-block object-fit-contain mx-auto"
                  onError={handleImageErrors}
                  height={120}
                  width={150}
                  style={{ maxWidth: "116px" }}
                />
              )}
              {/* <img src={json0Data?.PrintLogo} alt="" className={`logoimg  d-block mx-auto`} /> */}
              <p
                className={`text-center pt-1 fw-bold ${style?.font_12} ${style?.packinhList1_top_line}`}
              >
                {json0Data?.CompanyAddress} {json0Data?.CompanyAddress2}{" "}
                {json0Data?.CompanyCity} - {json0Data?.CompanyPinCode}
              </p>
              {json0Data?.PrintHeadLabel !== "" && (
                <p
                  className={`fw-bold text-center pt-1 pb-2  `}
                  style={{ fontSize: "18px" }}
                >
                  {json0Data?.PrintHeadLabel}
                </p>
              )}
              {json0Data?.PrintRemark !== "" && (
                <p
                  className={`fw-bold text-center ${style?.font_11}`}
                  dangerouslySetInnerHTML={{ __html: json0Data?.PrintRemark }}
                ></p>
              )}
            </div>
            {/* Party */}
            <div
              className={`pt-4 d-flex justify-content-between align-items-between`}
            >
              <div className={`col-6 ${style?.font_14}`}>
                <p className={``}>
                  <span className="fw-bold">Party:</span>{" "}
                  {json0Data?.customerfirmname}
                </p>
              </div>
              <div
                className={`text-end  ${style?.font_12}`}
                style={{ width: "180px", minWidth: "180px" }}
              >
                <div className="d-flex justify-content-end pb-1">
                  <p style={{ width: "90px" }}>Invoice No :</p>
                  <p className="text-end fw-bold" style={{ width: "60px" }}>
                    {json0Data?.InvoiceNo}
                  </p>
                </div>
                <div className="d-flex justify-content-end pb-2">
                  <p style={{ width: "90px" }}>Date :</p>
                  <p className="text-end fw-bold" style={{ width: "60px" }}>
                    {json0Data?.EntryDate}
                  </p>
                </div>
              </div>
            </div>
            {/* Table Header */}
            <div
              className={`border-black border-start border-end border-top mb-1 no_break ${style?.rowWisePad} ${style?.rowHeader} ${style?.word_break}`}
            >
              <div className={`d-flex border-bottom lightGrey`}>
                <div
                  className={`${style?.pad_1} fw-bold ${style?.srNo} border-end`}
                >
                  <div className="d-grid h-100">
                    <p
                      className="d-flex justify-content-center align-items-center text-center"
                      style={{ wordBreak: "normal" }}
                    >
                      Sr. No.
                    </p>
                  </div>
                </div>
                <div
                  className={`${style?.pad_1} fw-bold ${style?.design} border-end`}
                >
                  <div className="d-grid h-100">
                    <p className="d-flex justify-content-center align-items-center text-center">
                      Jewelcode
                    </p>
                  </div>
                </div>
                <div
                  className={` fw-bold ${style?.diamond} border-end d-flex flex-wrap`}
                >
                  <div className="d-grid h-100 w-100">
                    <p className="d-flex w-100 fw-bold justify-content-center text-center">
                      Diamond
                    </p>
                    <div className="d-flex w-100 border-top">
                      <p className={`col-2 text-center border-end `}>Shape</p>
                      <p className={`col-2  border-end text-center `}>Size</p>
                      <p className={`col-2  border-end text-center `}>Wt</p>
                      <p className={`col-2  border-end text-center `}>Pcs</p>
                      <p className={`col-2  border-end text-center `}>Rate</p>
                      <p className={`col-2 text-center`}>Amount</p>
                    </div>
                  </div>
                </div>
                <div className={` fw-bold ${style?.metal} border-end`}>
                  <div className="d-grid h-100 w-100">
                    <p className="d-flex w-100 fw-bold justify-content-center">
                      Metal
                    </p>
                    <div className="d-flex w-100 border-top">
                      <p className={`${style?.wid_20} text-center border-end`}>
                        Kt
                      </p>
                      <p className={`${style?.wid_20} text-center border-end`}>
                        Gr Wt
                      </p>
                      <p className={`${style?.wid_20} text-center border-end`}>
                        Net Wt
                      </p>
                      <p className={`${style?.wid_20} text-center border-end`}>
                        Rate
                      </p>
                      <p className={`${style?.wid_20} text-center`}>Amount</p>
                    </div>
                  </div>
                </div>
                <div className={` fw-bold ${style?.stone} border-end`}>
                  <div className="d-grid h-100 w-100">
                    <p className="d-flex w-100 fw-bold justify-content-center">
                      Stone
                    </p>
                    <div className="d-flex w-100 border-top">
                      <p className={`${style?.wid_20} text-center border-end`}>
                        Shape
                      </p>
                      <p className={`${style?.wid_20} text-center border-end`}>
                        Wt
                      </p>
                      <p className={`${style?.wid_20} text-center border-end`}>
                        Pcs
                      </p>
                      <p className={`${style?.wid_20} text-center border-end`}>
                        Rate
                      </p>
                      <p className={`${style?.wid_20} text-center`}>Amount</p>
                    </div>
                  </div>
                </div>
                <div className={` fw-bold ${style?.labour} border-end`}>
                  <div className="d-grid h-100 w-100">
                    <p className="d-flex w-100 fw-bold justify-content-center">
                      Labour
                    </p>
                    <div className="d-flex w-100 border-top">
                      <p
                        className={`${style?.pad_1} col-6 text-center border-end`}
                      >
                        Rate
                      </p>
                      <p className={`${style?.pad_1} col-6 text-center`}>
                        Amount
                      </p>
                    </div>
                  </div>
                </div>
                <div className={` fw-bold ${style?.other} border-end`}>
                  <div className="d-grid h-100 w-100">
                    <p className="d-flex w-100 fw-bold justify-content-center">
                      Other
                    </p>
                    <div className="d-flex w-100 border-top">
                      <p
                        className={`${style?.pad_1} col-6 text-center border-end`}
                      >
                        Code
                      </p>
                      <p className={`${style?.pad_1} col-6 text-center`}>
                        Amount
                      </p>
                    </div>
                  </div>
                </div>
                <div className={`${style?.pad_1} fw-bold ${style?.price}`}>
                  <div className="d-grid h-100">
                    <p className="d-flex justify-content-center align-items-center">
                      Price
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Table Data */}
            {data?.length > 0 &&
              data?.map((e, i) => {
                return (
                  <div
                    key={i}
                    className={`border-top no_break ${style?.rowWisePad} ${style?.word_break}`}
                  >
                    <div className="border-start border-end border-black">
                      <div className={`d-flex ${style?.packingListRow}`}>
                        <div
                          className={`${style?.pad_1} ${style?.srNo} border-end text-center`}
                        >
                          <p>{NumberWithCommas(i + 1, 0)}</p>
                        </div>
                        <div
                          className={`${style?.pad_1}  ${style?.design} border-end`}
                        >
                          <div className="d-grid h-100">
                            <p className="d-flex ps-1 align-items-center">
                              {atob(evn)?.toLowerCase() === "quote"
                                ? e?.designno
                                : e?.JewelCodePrefix?.slice(0, 2) +
                                  e?.Category_Prefix?.slice(0, 2) +
                                  e?.SrJobno?.split("/")[1]}
                            </p>
                            <img
                              src={e?.DesignImage}
                              alt=""
                              className={`w-100 ${style?.img} pb-1`}
                              onError={handleImageError}
                            />
                            {e?.HUID !== "" && (
                              <p className="text-center">HUID-{e?.HUID}</p>
                            )}
                          </div>
                        </div>
                        {/* {processDiamonds(data?.diamonds)?.map((el, indd) => (
                          <div
                            key={indd}
                            className={`border-top no_break ${style?.rowWisePad} ${style?.word_break}`}
                          >
                            <div
                              className={` ${style?.diamond} border-end d-flex flex-wrap`}
                            >
                              <div className="d-flex w-100 ">
                                <div
                                  className={`col-2 border-end pb-3 position-relative h-100`}
                                >
                                  <p>
                                    {el?.ShapeName} {diaQlty && el?.QualityName}
                                  </p>
                                </div>
                                <div
                                  className={`col-2 border-end pb-3 position-relative h-100`}
                                >
                                  <p className="text-center">{el?.SizeName}</p>
                                </div>
                                <div
                                  className={`col-2 text-end border-end pb-3 position-relative h-100`}
                                >
                                  <p>{NumberWithCommas(el?.Wt, 3)}</p>
                                </div>
                                <div
                                  className={`col-2 text-end border-end pb-3 position-relative h-100 `}
                                >
                                  <p>{NumberWithCommas(el?.Pcs, 0)}</p>
                                </div>
                                <div
                                  className={`col-2 text-end border-end pb-3 position-relative h-100`}
                                >
                                  <p>{NumberWithCommas(el?.Rate, 2)}</p>
                                </div>
                                <div
                                  className={`col-2 text-end border-end pb-3 position-relative h-100`}
                                >
                                  <p>
                                    {NumberWithCommas(
                                      el?.Amount / json0Data?.CurrencyExchRate,
                                      2
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div> */}
                        {/* ))} */}

                        <div
                          className={` ${style?.diamond} border-end d-flex flex-wrap`}
                        >
                          <div className="d-flex w-100 ">
                            <div
                              className={`col-2 border-end pb-3 position-relative h-100`}
                            >
                              {e?.diamonds.map((el, indd) => {
                                return (
                                  <p key={indd}>
                                    {el?.ShapeName} {diaQlty && el?.QualityName}
                                  </p>
                                );
                              })}
                            </div>
                            <div
                              className={`col-2 border-end pb-3 position-relative h-100`}
                            >
                              {e?.diamonds.map((el, indd) => {
                                return (
                                  <p key={indd} className="text-center">
                                    {el?.SizeName}
                                  </p>
                                );
                              })}
                            </div>
                            <div
                              className={`col-2 text-end border-end pb-3 position-relative h-100`}
                            >
                              {e?.diamonds.map((el, indd) => {
                                return (
                                  <p key={indd}>
                                    {NumberWithCommas(el?.Wt, 3)}
                                  </p>
                                );
                              })}
                            </div>
                            <div
                              className={`col-2 text-end border-end pb-3 position-relative h-100 `}
                            >
                              {e?.diamonds.map((el, indd) => {
                                return (
                                  <p key={indd}>
                                    {NumberWithCommas(el?.Pcs, 0)}
                                  </p>
                                );
                              })}
                            </div>
                            <div
                              className={`col-2 text-end border-end pb-3 position-relative h-100`}
                            >
                              {e?.diamonds.map((el, indd) => {
                                return (
                                  <p key={indd}>
                                    {NumberWithCommas(el?.Rate, 2)}
                                  </p>
                                );
                              })}
                            </div>
                            <div
                              className={`col-2 text-end pb-3 position-relative h-100`}
                            >
                              {e?.diamonds.map((el, indd) => {
                                return (
                                  <p key={indd}>
                                    {NumberWithCommas(
                                      el?.Amount / json0Data?.CurrencyExchRate,
                                      2
                                    )}
                                  </p>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* {e?.diamonds.map((el1, indd) => {
                          <div
                            className={` ${style?.diamond} border-end d-flex flex-wrap`}
                          >
                            <div className="d-flex w-100 ">
                              <div
                                className={`col-2 border-end pb-3 position-relative h-100`}
                              >
                                <p key={indd}>
                                  {el1?.ShapeName} {diaQlty && el1?.QualityName}
                                </p>
                              </div>
                              <div
                                className={`col-2 border-end pb-3 position-relative h-100`}
                              >
                                {e?.diamonds.map((el, indd) => {
                                  return (
                                    <p key={indd} className="text-center">
                                      {el?.SizeName}
                                    </p>
                                  );
                                })}
                              </div>
                              <div
                                className={`col-2 text-end border-end pb-3 position-relative h-100`}
                              >
                                {e?.diamonds.map((el, indd) => {
                                  return (
                                    <p key={indd}>
                                      {NumberWithCommas(el?.Wt, 3)}
                                    </p>
                                  );
                                })}
                              </div>
                              <div
                                className={`col-2 text-end border-end pb-3 position-relative h-100 `}
                              >
                                {e?.diamonds.map((el, indd) => {
                                  return (
                                    <p key={indd}>
                                      {NumberWithCommas(el?.Pcs, 0)}
                                    </p>
                                  );
                                })}
                              </div>
                              <div
                                className={`col-2 text-end border-end pb-3 position-relative h-100`}
                              >
                                {e?.diamonds.map((el, indd) => {
                                  return (
                                    <p key={indd}>
                                      {NumberWithCommas(el?.Rate, 2)}
                                    </p>
                                  );
                                })}
                              </div>
                              <div
                                className={`col-2 text-end pb-3 position-relative h-100`}
                              >
                                {e?.diamonds.map((el, indd) => {
                                  return (
                                    <p key={indd}>
                                      {NumberWithCommas(
                                        el?.Amount /
                                          json0Data?.CurrencyExchRate,
                                        2
                                      )}
                                    </p>
                                  );
                                })}
                              </div>
                            </div>
                          </div>;
                        })} */}
                        <div
                          className={` ${style?.metal} border-end d-flex flex-wrap`}
                        >
                          <div
                            className={`d-flex w-100 ${
                              e?.JobRemark !== "" && "border-bottom"
                            }`}
                          >
                            <div
                              className={`${style?.wid_20} border-end ${style?.no_word_break}`}
                            >
                              {e?.metals.map((el, indd) => {
                                return (
                                  <p key={indd} className={``}>
                                    {indd === 0 && e?.MetalTypePurity}
                                  </p>
                                );
                              })}
                            </div>
                            <div
                              className={`${style?.wid_20} text-end border-end`}
                            >
                              {e?.metals.map((el, indd) => {
                                return (
                                  <p key={indd}>
                                    {indd === 0 &&
                                      NumberWithCommas(e?.grosswt, 3)}
                                  </p>
                                );
                              })}
                            </div>
                            <div
                              className={`${style?.wid_20} text-end border-end`}
                            >
                              {/* {e?.metals.map((el, indd) => {
                                                return <p key={indd}>{indd === 0 && NumberWithCommas(e?.NetWt + e?.LossWt, 3)}</p>
                                            })} */}
                              <p>{NumberWithCommas(e?.netWtLoss, 3)}</p>
                            </div>
                            <div
                              className={`${style?.wid_20} text-end border-end`}
                            >
                              {e?.metals.map((el, indd) => {
                                return (
                                  <p key={indd}>
                                    {indd === 0 &&
                                      NumberWithCommas(el?.Rate, 2)}
                                  </p>
                                );
                              })}
                            </div>
                            <div className={`${style?.wid_20} text-end`}>
                              {e?.metals.map((el, indd) => {
                                return (
                                  <p key={indd}>
                                    {indd === 0 &&
                                      NumberWithCommas(
                                        el?.Amount /
                                          json0Data?.CurrencyExchRate,
                                        2
                                      )}
                                  </p>
                                );
                              })}
                            </div>
                          </div>
                          {e?.JobRemark !== "" && (
                            <div>
                              <p>Remark:</p>
                              <p className="fw-bold">{e?.JobRemark}</p>
                            </div>
                          )}
                        </div>
                        <div
                          className={` ${style?.stone} border-end d-flex flex-wrap`}
                        >
                          <div className="d-flex w-100">
                            <div
                              className={`${style?.wid_20} border-end position-relative h-100 pb-3`}
                            >
                              {e?.colors.map((el, indd) => {
                                return <p key={indd}>{el?.ShapeName}</p>;
                              })}
                            </div>
                            <div
                              className={`${style?.wid_20} text-end border-end position-relative h-100 pb-3`}
                            >
                              {e?.colors.map((el, indd) => {
                                return (
                                  <p key={indd}>
                                    {NumberWithCommas(el?.Wt, 2)}
                                  </p>
                                );
                              })}
                            </div>
                            <div
                              className={`${style?.wid_20} text-end border-end position-relative h-100 pb-3`}
                            >
                              {e?.colors.map((el, indd) => {
                                return (
                                  <p key={indd}>
                                    {NumberWithCommas(el?.Pcs, 0)}
                                  </p>
                                );
                              })}
                            </div>
                            <div
                              className={`${style?.wid_20} text-end border-end position-relative h-100 pb-3`}
                            >
                              {e?.colors.map((el, indd) => {
                                return (
                                  <p key={indd}>
                                    {NumberWithCommas(el?.Rate, 2)}
                                  </p>
                                );
                              })}
                            </div>
                            <div
                              className={`${style?.wid_20} text-end position-relative h-100 pb-3`}
                            >
                              {e?.colors.map((el, indd) => {
                                return (
                                  <p key={indd}>
                                    {NumberWithCommas(
                                      el?.Amount / json0Data?.CurrencyExchRate,
                                      2
                                    )}
                                  </p>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                        <div
                          className={` ${style?.labour} border-end d-flex flex-wrap`}
                        >
                          <div className="d-flex w-100">
                            <div
                              className={`col-6 text-end border-end position-relative h-100 pb-3`}
                            >
                              <p>{NumberWithCommas(e?.MaKingCharge_Unit, 2)}</p>
                            </div>
                            <div
                              className={` col-6 text-end position-relative h-100 pb-3`}
                            >
                              <p>
                                {NumberWithCommas(
                                  (e?.MakingAmount + e?.SettingAmount) /
                                    json0Data?.CurrencyExchRate,
                                  2
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div
                          className={` ${style?.other} border-end d-flex flex-wrap`}
                        >
                          <div className="d-flex w-100">
                            <div
                              className={` col-6 border-end position-relative h-100 pb-3`}
                            >
                              {e?.otherChargess?.map((ele, ind) => {
                                return (
                                  ele?.Amount !== 0 && (
                                    <p
                                      key={ind}
                                      className={`${style?.min_height}`}
                                    >
                                      {ele?.ShapeName}
                                    </p>
                                  )
                                );
                              })}
                              {e?.otherMiscAmount !== 0 && (
                                <p className={`${style?.min_height}`}>Other</p>
                              )}
                              {e?.otherCharge?.map((ele, ind) => {
                                return (
                                  +ele?.value !== 0 &&
                                  ind <= 2 && (
                                    <p
                                      key={ind}
                                      className={`${style?.min_height}`}
                                    >
                                      {ele?.label}
                                    </p>
                                  )
                                );
                              })}

                              {e?.TotalDiamondHandling !== 0 && (
                                <p
                                  className={`${style?.min_height}`}
                                  style={{ wordBreak: "normal" }}
                                >
                                  Charges Handling
                                </p>
                              )}
                            </div>
                            <div
                              className={` col-6 text-end position-relative h-100 pb-3`}
                            >
                              {e?.otherChargess?.map((ele, ind) => {
                                return (
                                  ele?.Amount !== 0 && (
                                    <p
                                      key={ind}
                                      className={`${style?.min_height}`}
                                    >
                                      {NumberWithCommas(
                                        ele?.Amount /
                                          json0Data?.CurrencyExchRate,
                                        2
                                      )}
                                    </p>
                                  )
                                );
                              })}

                              {e?.otherMiscAmount !== 0 && (
                                <p className={`${style?.min_height}`}>
                                  {NumberWithCommas(
                                    e?.otherMiscAmount /
                                      json0Data?.CurrencyExchRate,
                                    2
                                  )}
                                </p>
                              )}
                              {e?.otherCharge?.map((ele, ind) => {
                                return (
                                  +ele?.value !== 0 &&
                                  ind <= 2 && (
                                    <p
                                      key={ind}
                                      className={`${style?.min_height}`}
                                    >
                                      {NumberWithCommas(+ele?.value, 2)}
                                    </p>
                                  )
                                );
                              })}
                              {e?.TotalDiamondHandling !== 0 && (
                                <p className={`${style?.min_height}`}>
                                  {NumberWithCommas(e?.TotalDiamondHandling, 2)}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div
                          className={` fw-bold ${style?.price} d-flex flex-wrap`}
                        >
                          <div className="d-flex w-100">
                            <div
                              className={` position-relative h-100 pb-3 text-end w-100`}
                            >
                              <p>
                                {NumberWithCommas(
                                  e?.UnitCost / json0Data?.CurrencyExchRate,
                                  2
                                )}{" "}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="border-start border-end border-black">
                      <div className={`d-flex  ${style?.packingListRow}`}>
                        <div
                          className={`${style?.pad_1} ${style?.srNo} border-end text-center`}
                        ></div>
                        <div
                          className={` ${style?.pad_1}  ${style?.design} border-end`}
                        >
                          {e?.lineid !== "" && (
                            <p className="text-center">{e?.lineid}</p>
                          )}
                        </div>
                        <div
                          className={` lightGrey ${style?.diamond} border-end d-flex flex-wrap`}
                        >
                          <div className="d-flex w-100 ">
                            <div className={`col-2 border-end `}>
                              <p className={`w-100 border-top  fw-bold`}></p>
                            </div>
                            <div className={`col-2 border-end `}>
                              <p className={`w-100 border-top  fw-bold`}></p>
                            </div>
                            <div className={`col-2 text-end border-end `}>
                              <p className={`w-100 border-top  fw-bold`}>
                                {e?.rowWiseDiamondTotal.Wt !== 0 &&
                                  NumberWithCommas(
                                    e?.rowWiseDiamondTotal.Wt,
                                    3
                                  )}
                              </p>
                            </div>
                            <div className={`col-2 text-end border-end  `}>
                              <p className={`w-100 border-top  fw-bold`}>
                                {e?.rowWiseDiamondTotal.Pcs !== 0 &&
                                  NumberWithCommas(
                                    e?.rowWiseDiamondTotal.Pcs,
                                    0
                                  )}
                              </p>
                            </div>
                            <div className={`col-2 text-end border-end `}>
                              <p className={`w-100 border-top  fw-bold`}></p>
                            </div>
                            <div className={`col-2 text-end `}>
                              <p className={`w-100 border-top  fw-bold`}>
                                {e?.rowWiseDiamondTotal.Amount !== 0 &&
                                  NumberWithCommas(
                                    e?.rowWiseDiamondTotal.Amount /
                                      json0Data?.CurrencyExchRate,
                                    2
                                  )}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div
                          className={` lightGrey ${style?.metal} border-end d-flex flex-wrap`}
                        >
                          <div className="d-flex w-100">
                            <div
                              className={`${style?.wid_20} border-end ${style?.no_word_break}`}
                            >
                              <p className={`fw-bold w-100 border-top  `}></p>
                            </div>
                            <div
                              className={`${style?.wid_20} text-end border-end`}
                            >
                              <p className={`fw-bold w-100 border-top  `}>
                                {e?.rowWiseMetalTotal.grossWt !== 0 &&
                                  NumberWithCommas(
                                    e?.rowWiseMetalTotal.grossWt,
                                    3
                                  )}
                              </p>
                            </div>
                            <div
                              className={`${style?.wid_20} text-end border-end`}
                            >
                              <p className={`fw-bold w-100 border-top  `}>
                                {e?.netWtLoss !== 0 &&
                                  NumberWithCommas(e?.netWtLoss, 3)}
                              </p>
                            </div>
                            <div
                              className={`${style?.wid_20} text-end border-end`}
                            >
                              <p className={`fw-bold w-100 border-top  `}></p>
                            </div>
                            <div className={`${style?.wid_20} text-end`}>
                              <p className={`fw-bold w-100 border-top  `}>
                                {e?.rowWiseMetalTotal.Amount !== 0 &&
                                  NumberWithCommas(
                                    e?.rowWiseMetalTotal.Amount /
                                      json0Data?.CurrencyExchRate,
                                    2
                                  )}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div
                          className={` lightGrey ${style?.stone} border-end d-flex flex-wrap`}
                        >
                          <div className="d-flex w-100">
                            <div className={`${style?.wid_20} border-end`}>
                              <p className={`fw-bold w-100 border-top `}></p>
                            </div>
                            <div
                              className={`${style?.wid_20} text-end border-end `}
                            >
                              <p className={`fw-bold w-100 border-top `}>
                                {e?.rowWiseColorStoneTotal.Wt !== 0 &&
                                  NumberWithCommas(
                                    e?.rowWiseColorStoneTotal.Wt,
                                    2
                                  )}
                              </p>
                            </div>
                            <div
                              className={`${style?.wid_20} text-end border-end `}
                            >
                              <p className={`fw-bold w-100 border-top `}>
                                {e?.rowWiseColorStoneTotal.Pcs !== 0 &&
                                  NumberWithCommas(
                                    e?.rowWiseColorStoneTotal.Pcs,
                                    0
                                  )}
                              </p>
                            </div>
                            <div
                              className={`${style?.wid_20} text-end border-end `}
                            >
                              <p className={`fw-bold w-100 border-top `}></p>
                            </div>
                            <div className={`${style?.wid_20} text-end`}>
                              <p className={`fw-bold w-100 border-top `}>
                                {e?.rowWiseColorStoneTotal.Amount !== 0 &&
                                  NumberWithCommas(
                                    e?.rowWiseColorStoneTotal.Amount /
                                      json0Data?.CurrencyExchRate,
                                    2
                                  )}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div
                          className={` lightGrey ${style?.labour} border-end d-flex flex-wrap`}
                        >
                          <div className="d-flex w-100">
                            <div className={`col-6 text-end border-end `}>
                              <p className={`fw-bold w-100 border-top`}></p>
                            </div>
                            <div className={` col-6 text-end`}>
                              <p className={`fw-bold w-100 border-top`}>
                                {NumberWithCommas(
                                  (e?.MakingAmount + e?.SettingAmount) /
                                    json0Data?.CurrencyExchRate,
                                  2
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div
                          className={` lightGrey ${style?.other} border-end d-flex flex-wrap`}
                        >
                          <div className="d-flex w-100">
                            <div className={` col-6 border-end`}>
                              <p className={`w-100 border-top  fw-bold`}></p>
                            </div>
                            <div className={` col-6 text-end`}>
                              <p
                                className={`w-100 border-top fw-bold  fw-bold`}
                              >
                                {NumberWithCommas(
                                  e?.otherTotals / json0Data?.CurrencyExchRate,
                                  2
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div
                          className={` lightGrey fw-bold ${style?.price} d-flex flex-wrap`}
                        >
                          <div className="d-flex w-100">
                            <div className={`text-end w-100`}>
                              <p className={`w-100 border-top  fw-bold`}>
                                {NumberWithCommas(
                                  e?.UnitCost / json0Data?.CurrencyExchRate,
                                  2
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {e?.DiscountAmt !== 0 && (
                      <div className="border-start border-end border-black">
                        <div className="d-flex border-bottom border-top">
                          <div
                            className={`${style?.pad_1} fw-bold ${style?.srNo} border-end text-center`}
                          >
                            <p></p>
                          </div>
                          <div
                            className={`${style?.pad_1} fw-bold ${style?.design} border-end`}
                          >
                            <div className="d-grid h-100">
                              <p className="d-flex justify-content-center align-items-center"></p>
                            </div>
                          </div>
                          <div
                            className={` ${style?.diamond} border-end d-flex flex-wrap lightGrey`}
                          >
                            <div className="d-flex w-100 ">
                              <div className={`col-2  h-100`}>
                                <p></p>
                              </div>
                              <div className={`col-2  h-100`}>
                                <p></p>
                              </div>
                              <div className={`col-2 text-end  h-100`}>
                                <p></p>
                              </div>
                              <div className={`col-2 text-end  h-100 `}>
                                <p></p>
                              </div>
                              <div
                                className={`col-2 text-end border-end  h-100`}
                              >
                                <p className={``}></p>
                              </div>
                              <div className={`col-2 text-end  h-100`}>
                                <p className={` `}></p>
                              </div>
                            </div>
                          </div>
                          <div
                            className={` ${style?.metal} border-end d-flex flex-wrap lightGrey`}
                          >
                            <div className="d-flex w-100">
                              <div
                                className={`${style?.wid_20} border-end position-relative h-100`}
                              >
                                <p className={` `}></p>
                              </div>
                              <div
                                className={`${style?.wid_20} text-end border-end position-relative h-100`}
                              >
                                <p className={` `}></p>
                              </div>
                              <div
                                className={`${style?.wid_20} text-end border-end position-relative h-100`}
                              >
                                <p className={` `}></p>
                              </div>
                              <div
                                className={`${style?.wid_20} text-end border-end position-relative h-100`}
                              >
                                <p className={` `}></p>
                              </div>
                              <div
                                className={`${style?.wid_20} text-end position-relative h-100`}
                              >
                                <p className={` `}></p>
                              </div>
                            </div>
                          </div>
                          <div
                            className={` ${style?.stone} border-end d-flex flex-wrap lightGrey`}
                          >
                            <div className="d-flex w-100">
                              <div
                                className={`${style?.wid_20} border-end position-relative h-100`}
                              >
                                <p className={` `}></p>
                              </div>
                              <div
                                className={`${style?.wid_20} text-end border-end position-relative h-100`}
                              >
                                <p className={` `}></p>
                              </div>
                              <div
                                className={`${style?.wid_20} text-end border-end position-relative h-100`}
                              >
                                <p className={` `}></p>
                              </div>
                              <div
                                className={`${style?.wid_20} text-end border-end position-relative h-100`}
                              >
                                <p className={` `}></p>
                              </div>
                              <div
                                className={`${style?.wid_20} text-end position-relative h-100`}
                              >
                                <p className={` `}></p>
                              </div>
                            </div>
                          </div>
                          <div
                            className={` ${style?.discounts} border-end d-flex flex-wrap lightGrey text-end w-100`}
                          >
                            {/* <p className={` w-100 fw-bold`}>Discount {e?.Discount}% On Amount</p> */}
                            <p className="fw-bold text-end">
                              Discount {e?.Discount}% @
                              {e?.IsCriteriabasedAmount === 1
                                ? e?.discountElements?.map((ele, ind) => {
                                    return (
                                      <React.Fragment key={ind}>
                                        {ele?.label}{" "}
                                        {ind !== e?.discountElements?.length - 1
                                          ? ","
                                          : ""}
                                      </React.Fragment>
                                    );
                                  })
                                : "Total "}
                              Amount{" "}
                            </p>
                          </div>
                          <div
                            className={` ${style?.discountsAmounts} border-end lightGrey text-end`}
                          >
                            <p className={` fw-bold`}>
                              {NumberWithCommas(
                                e?.DiscountAmt / json0Data?.CurrencyExchRate,
                                2
                              )}
                            </p>
                          </div>
                          <div
                            className={` fw-bold ${style?.price} d-flex flex-wrap lightGrey`}
                          >
                            <div className="d-flex w-100">
                              <div
                                className={`position-relative h-100 text-end w-100`}
                              >
                                <p>
                                  {NumberWithCommas(
                                    e?.TotalAmount /
                                      json0Data?.CurrencyExchRate,
                                    2
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            {/* Total */}
            <div
              className={`border-start border-end border-black no_break ${style?.rowWisePad} ${style?.word_break}`}
            >
              <div className="d-flex  border-bottom border-top  lightGrey">
                <div
                  className={`${style?.pad_1} fw-bold ${style?.total} text-center border-end d-flex align-items-center justify-content-center`}
                >
                  <p className="fw-bold">Total</p>
                </div>
                <div
                  className={` fw-bold ${style?.diamond} border-end d-flex flex-wrap`}
                >
                  <div className="d-flex w-100 ">
                    <div className={`col-2 border-end`}>
                      <p></p>
                    </div>
                    <div className={`col-2 text-end border-end`}>
                      <p></p>
                    </div>
                    <div
                      className={`col-2 text-end border-end d-flex align-items-center justify-content-end`}
                    >
                      <p className="">
                        {NumberWithCommas(total?.diamondTotal?.Wt, 2)}
                      </p>
                    </div>
                    <div
                      className={`col-2 text-end border-end d-flex align-items-center justify-content-end`}
                    >
                      <p className="">
                        {NumberWithCommas(total?.diamondTotal?.Pcs, 0)}
                      </p>
                    </div>
                    <div className={`col-2 text-end border-end`}>
                      <p></p>
                    </div>
                    <div
                      className={`col-2 text-end d-flex align-items-center justify-content-end`}
                    >
                      <p className="">
                        {NumberWithCommas(
                          total?.diamondTotal?.Amount /
                            json0Data?.CurrencyExchRate,
                          2
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className={` fw-bold ${style?.metal} border-end d-flex flex-wrap`}
                >
                  <div className="d-flex w-100">
                    <div className={`${style?.wid_20} border-end`}>
                      <p></p>
                    </div>
                    <div
                      className={`${style?.wid_20} text-end border-end d-flex align-items-center justify-content-end`}
                    >
                      <p>{NumberWithCommas(total?.metalTotal?.grossWt, 3)}</p>
                    </div>
                    <div
                      className={`${style?.wid_20} text-end border-end d-flex align-items-center justify-content-end`}
                    >
                      <p>{NumberWithCommas(total?.netWtLoss, 3)}</p>
                    </div>
                    <div className={`${style?.wid_20} text-end border-end`}>
                      <p></p>
                    </div>
                    <div
                      className={`${style?.wid_20} text-end d-flex align-items-center justify-content-end`}
                    >
                      <p>
                        {NumberWithCommas(
                          total?.metalAmount / json0Data?.CurrencyExchRate,
                          2
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className={` fw-bold ${style?.stone} border-end d-flex flex-wrap`}
                >
                  <div className="d-flex w-100">
                    <div className={`${style?.wid_20} border-end`}>
                      <p></p>
                    </div>
                    <div
                      className={`${style?.wid_20} text-end border-end d-flex align-items-center justify-content-end`}
                    >
                      <p>{NumberWithCommas(total?.colorStone?.Wt, 2)}</p>
                    </div>
                    <div
                      className={`${style?.wid_20} text-end border-end d-flex align-items-center justify-content-end`}
                    >
                      <p>{NumberWithCommas(total?.colorStone?.Pcs, 0)}</p>
                    </div>
                    <div
                      className={`${style?.wid_20} text-end border-end d-flex align-items-center justify-content-end`}
                    >
                      <p></p>
                    </div>
                    <div
                      className={`${style?.wid_20} text-end d-flex align-items-center justify-content-end`}
                    >
                      <p>
                        {NumberWithCommas(
                          total?.colorStone?.Amount /
                            json0Data?.CurrencyExchRate,
                          2
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className={` fw-bold ${style?.labour} border-end d-flex flex-wrap`}
                >
                  <div className="d-flex w-100">
                    <div
                      className={`${style?.pad_1} col-6 text-end border-end`}
                    >
                      <p></p>
                    </div>
                    <div
                      className={`${style?.pad_1} col-6 text-end d-flex align-items-center justify-content-end`}
                    >
                      <p>
                        {NumberWithCommas(
                          (total?.MakingAmount +
                            total?.DiaSettignAmount +
                            total?.clrStoneSettignAmount) /
                            json0Data?.CurrencyExchRate,
                          2
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className={` fw-bold ${style?.other} border-end d-flex flex-wrap`}
                >
                  <div className="d-flex w-100">
                    <div className={`${style?.pad_1} col-6 border-end`}>
                      <p></p>
                    </div>
                    <div
                      className={`${style?.pad_1} col-6 text-end d-flex align-items-center justify-content-end`}
                    >
                      <p>
                        {NumberWithCommas(
                          total?.otherAmount / json0Data?.CurrencyExchRate,
                          2
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className={`${style?.pad_1} fw-bold ${style?.price} d-flex flex-wrap`}
                >
                  <div className="d-flex w-100">
                    <div
                      className={`${style?.pad_1} text-end w-100 d-flex align-items-center justify-content-end`}
                    >
                      <p>
                        {NumberWithCommas(
                          total?.TotalAmount / json0Data?.CurrencyExchRate,
                          2
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Tax */}
            <div
              className={`d-flex border-start border-end border-bottom border-black no_break ${style?.rowWisePad} ${style?.word_break}`}
            >
              <div className={`${style?.pad_1}  ${style?.discount} text-end `}>
                <p className="">Total Discount</p>
                {taxes?.map((e, i) => {
                  return (
                    <p className="" key={i}>
                      {e?.name} @ {e?.per}
                    </p>
                  );
                })}
                {json0Data?.AddLess !== 0 && (
                  <p className="">{json0Data?.AddLess > 0 ? "Add" : "Less"}</p>
                )}
                <p className="">Grand Total </p>
              </div>
              <div
                className={`${style?.pad_1} ${style?.price} d-flex flex-wrap`}
              >
                <div className="d-flex w-100">
                  <div className={`${style?.pad_1} text-end w-100`}>
                    <p>
                      {NumberWithCommas(
                        total?.DiscountAmt / json0Data?.CurrencyExchRate,
                        2
                      )}
                    </p>
                    {taxes?.map((e, i) => {
                      return (
                        <p className="" key={i}>
                          {NumberWithCommas(
                            +e?.amount / json0Data?.CurrencyExchRate,
                            2
                          )}
                        </p>
                      );
                    })}
                    {json0Data?.AddLess !== 0 && (
                      <p className="">
                        {NumberWithCommas(
                          json0Data?.AddLess / json0Data?.CurrencyExchRate,
                          2
                        )}
                      </p>
                    )}
                    <p>{NumberWithCommas(total?.amountAfterDiscount, 2)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
          {msg}
        </p>
      )}
    </>
  );
};

export default PackingList1;
