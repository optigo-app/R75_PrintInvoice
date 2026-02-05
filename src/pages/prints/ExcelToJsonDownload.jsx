import React from "react";
import { useState } from "react";
import Loader from "../../components/Loader";
import { useEffect } from "react";
import {
  ExportToExcel,
  NumberWithCommas,
  apiCall,
  checkMsg,
  fixedValues,
  isObjectEmpty,
} from "../../GlobalFunctions";

const ExcelToJsonDownload = ({
  urls,
  token,
  invoiceNo,
  printName,
  evn,
  ApiVer,
}) => {
  const [loader, setLoader] = useState(true);
  const [msg, setMsg] = useState("");
  const [isImageWorking, setIsImageWorking] = useState(true);
  const handleImageErrors = () => {
    setIsImageWorking(false);
  };
  const loadData = (data) => {
    let json0Data = data?.BillPrint_Json[0];
    let json1Data = data?.BillPrint_Json1;
    let json2Data = data?.BillPrint_Json2;
    let blankArr = [];
    json1Data.forEach((e, i) => {
      let obj = { ...e };
      let materials = [];
      json2Data.forEach((ele, ind) => {
        if (ele?.StockBarcode === e?.SrJobno) {
          if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
            let findIndexs = materials.findIndex(
              (elem, index) =>
                elem?.Rate === ele?.Rate &&
                elem?.GroupName === ele?.GroupName &&
                elem?.MasterManagement_DiamondStoneTypeid === 1
            );
            if (findIndexs === -1) {
              materials.push(ele);
            } else {
              materials[findIndexs].Wt += ele?.Wt;
              materials[findIndexs].Amount += ele?.Amount;
              materials[findIndexs].Pcs += ele?.Pcs;
            }
          } else {
            let findIndex = materials.findIndex(
              (elem, index) =>
                elem?.Rate === ele?.Rate &&
                elem?.MasterManagement_DiamondStoneTypeid ===
                  ele?.MasterManagement_DiamondStoneTypeid
            );
            if (findIndex === -1) {
              materials.push(ele);
            } else {
              materials[findIndex].Wt += ele?.Wt;
              materials[findIndex].Amount += ele?.Amount;
              materials[findIndex].Pcs += ele?.Pcs;
            }
          }
        }
      });
      let diamonds = materials.filter(
        (ele) => ele?.MasterManagement_DiamondStoneTypeid === 1
      );
      let colorStones = materials.filter(
        (ele) => ele?.MasterManagement_DiamondStoneTypeid === 2
      );
      let metals = materials.filter(
        (ele) => ele?.MasterManagement_DiamondStoneTypeid === 4
      );
      let blankDiamonds = [];
      let blankColorStones = [];
      diamonds.forEach((elem, ind) => {
        let findRecord = blankDiamonds.findIndex(
          (elee, indd) =>
            elee?.ShapeName === elem?.ShapeName &&
            elee?.Colorname === elem?.Colorname &&
            elee?.QualityName === elem?.QualityName &&
            elee?.Rate === elem?.Rate
        );
        if (findRecord === -1) {
          blankDiamonds.push(elem);
        } else {
          blankDiamonds[findRecord].SizeName += elem?.GroupName;
          blankDiamonds[findRecord].Wt += elem?.Wt;
          blankDiamonds[findRecord].Pcs += elem?.Pcs;
          blankDiamonds[findRecord].Amount += elem?.Amount;
        }
      });
      colorStones.forEach((ele, ind) => {
        let findIndex = blankColorStones.findIndex(
          (elem, index) =>
            elem?.ShapeName === ele?.ShapeName &&
            elem?.QualityName === ele?.QualityName &&
            elem?.Colorname === ele?.Colorname &&
            elem?.Rate === ele?.Rate
        );
        if (findIndex === -1) {
          blankColorStones.push(ele);
        } else {
          blankColorStones[findIndex].SizeName = ele?.GroupName;
          blankColorStones[findIndex].Wt += ele?.Wt;
          blankColorStones[findIndex].Amount += ele?.Amount;
          blankColorStones[findIndex].Pcs += ele?.Pcs;
        }
      });

      let arr = [blankDiamonds, blankColorStones, metals];
      let largestLength = -1;

      arr.forEach((ele, i) => {
        if (ele.length > largestLength) {
          largestLength = ele.length;
        }
      });
      if (materials.length > 0) {
        Array.from({ length: largestLength }).forEach((ele, ind) => {
          let diamondQualityname = "";
          let diamondColorName = "";
          let diamondWt = "";
          let diamondRate = "";
          let diamondAmount = "";
          let diamondGroupname = "";
          let diamondShapename = "";
          let diamondPcs = "";
          if (blankDiamonds[ind]) {
            diamondQualityname = blankDiamonds[ind]?.QualityName;
            diamondColorName = blankDiamonds[ind]?.Colorname;
            diamondWt = NumberWithCommas(blankDiamonds[ind]?.Wt, 3);
            diamondRate = NumberWithCommas(blankDiamonds[ind]?.Rate, 2);
            diamondAmount = NumberWithCommas(
              blankDiamonds[ind]?.Amount / json0Data?.CurrencyExchRate,
              2
            );
            diamondGroupname = blankDiamonds[ind]?.GroupName;
            diamondShapename = blankDiamonds[ind]?.ShapeName;
            diamondPcs = NumberWithCommas(blankDiamonds[ind]?.Pcs, 0);
          }
          let stoneShape = "";
          let stonePcs = "";
          let stoneWt = "";
          let stoneRate = "";
          let stoneAmount = "";
          let metalRate = "";
          let metalrateCopy = 0;

          if (colorStones[ind]) {
            stoneShape = colorStones[ind]?.ShapeName;
            stonePcs = NumberWithCommas(colorStones[ind]?.Pcs, 0);
            stoneWt = NumberWithCommas(colorStones[ind]?.Wt, 3);
            stoneRate = NumberWithCommas(colorStones[ind]?.Rate, 2);
            stoneAmount = NumberWithCommas(
              colorStones[ind]?.Amount / json0Data?.CurrencyExchRate,
              2
            );
          }
          if (metals[ind]) {
            metalRate = NumberWithCommas(metals[ind]?.Rate, 2);
            metalrateCopy = +fixedValues(metals[ind]?.Rate, 2);
          }
          let goldValue =
            ind === 0
              ? NumberWithCommas(
                  (e?.MetalAmount - e?.LossAmt) / json0Data?.CurrencyExchRate,
                  2
                )
              : "";
          // let goldValue = ind === 0 ? NumberWithCommas((e?.NetWt*metalrateCopy) , 2) : "";
          if (goldValue === 0) {
            goldValue = "";
          }
          let srJobno = ind === 0 ? e?.SrJobno : "";
          let designno = ind === 0 ? e?.designno : "";
          let companyFullName = ind === 0 ? json0Data?.CompanyFullName : "";
          let categoryname = ind === 0 ? e?.Categoryname : "";
          let otherAmtDetail = ind === 0 ? e?.OtherAmtDetail : "";
          let certification =
            ind === 0
              ? `${NumberWithCommas(
                  e?.OtherCharges / json0Data?.CurrencyExchRate,
                  2
                )}`
              : "";
          let certificateNo = ind === 0 ? e?.CertificateNo : "";
          // let lossAmt = ind === 0 ? NumberWithCommas((e?.LossAmt * metalrateCopy) / json0Data?.CurrencyExchRate, 2) : "";
          let lossAmt =
            ind === 0
              ? NumberWithCommas(
                  (e?.LossWt * metalrateCopy) / json0Data?.CurrencyExchRate,
                  2
                )
              : "";
          // LossWt
          let LossWt = ind === 0 ? NumberWithCommas(e?.LossWt, 3) : "";
          let metalAmount =
            ind === 0
              ? NumberWithCommas(
                  e?.MetalAmount / json0Data?.CurrencyExchRate,
                  2
                )
              : "";
          let makingAmount =
            ind === 0
              ? NumberWithCommas(
                  e?.MakingAmount / json0Data?.CurrencyExchRate,
                  2
                )
              : "";
          let totalAmount =
            ind === 0
              ? NumberWithCommas(
                  e?.TotalAmount / json0Data?.CurrencyExchRate,
                  2
                )
              : "";
          let qty = ind === 0 ? 1 : "";
          let subCategory = ind === 0 ? "OPEN SETTING" : "";
          let rateType = ind === 0 ? "GMS" : "";
          let certifiedby = ind === 0 ? "IGI" : "";
          let diamondTotalAmount =
            ind === 0
              ? NumberWithCommas(
                  e?.DiamondAmount / json0Data?.CurrencyExchRate,
                  2
                )
              : "";
          let metalPurity = ind === 0 ? e?.MetalPurity : "";
          let metalColor = ind === 0 ? e?.MetalColor : "";
          let grosswt = ind === 0 ? NumberWithCommas(e?.grosswt, 3) : "";
          let NetWt = ind === 0 ? NumberWithCommas(e?.NetWt, 3) : "";

          let makeObj = createObj(
            srJobno,
            "",
            designno,
            companyFullName,
            "",
            qty,
            "",
            categoryname,
            subCategory,
            "",
            "",
            "",
            diamondQualityname,
            diamondColorName,
            diamondGroupname,
            "",
            diamondShapename,
            diamondPcs,
            diamondWt,
            diamondRate,
            diamondAmount,
            diamondTotalAmount,
            stoneShape,
            stonePcs,
            stoneWt,
            stoneRate,
            stoneAmount,
            "",
            grosswt,
            NetWt,
            LossWt,
            metalPurity,
            metalColor,
            rateType,
            metalRate,
            goldValue,
            lossAmt,
            metalAmount,
            makingAmount,
            totalAmount,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            certification,
            certifiedby,
            certificateNo
          );
          blankArr.push(makeObj);
        });
      }
    });
    ExportToExcel(blankArr, data?.BillPrint_Json[0]?.InvoiceNo);
  };

  const createObj = (
    srJobno,
    discription,
    designno,
    CompanyFullName,
    Div,
    Qty,
    Type,
    Categoryname,
    SubCategory,
    Brand,
    Country,
    DiaDiv,
    diamondQualityname,
    diamondColorName,
    diamondGroupname,
    Sieve,
    diamondShapename,
    diamondPcs,
    diamondWt,
    diamondRate,
    diamond_Amount,
    diamondAmount,
    stoneShape,
    stonePcs,
    stoneWt,
    stoneRate,
    stoneAmount,
    MetalDivision,
    grosswt,
    NetWt,
    LossWt,
    metalPurity,
    metalColor,
    rateType,
    metalRate,
    goldValue,
    LossAmt,
    MetalAmount,
    MakingAmount,
    TotalAmount,
    TagPrice1,
    TagPrice2,
    tagline1,
    tagline2,
    tagline3,
    tagline4,
    tagline5,
    costCode,
    certification,
    certifiedby,
    CertificateNo
  ) => {
    let obj = {
      "Stock Code/Prefix": srJobno,
      Description: discription,
      "Design No.": designno,
      "Supplier Ref": CompanyFullName,
      Div: Div,
      Qty: Qty,
      Type: Type,
      Category: Categoryname,
      "Sub Category": SubCategory,
      Brand: Brand,
      Country: Country,
      "Dia Div": DiaDiv,
      Clarity: diamondQualityname,
      "Dia Color": diamondColorName,
      "Dia Size": diamondGroupname,
      Sieve: Sieve,
      Shape: diamondShapename,
      "No. Of Dia": diamondPcs,
      "Dia Carat": diamondWt,
      "Dia Amt per ct": diamondRate,
      "Dia value": diamond_Amount,
      "total dia amount": diamondAmount,
      "Stone Shape": stoneShape,
      "No. Of St.": stonePcs,
      "Stone Ct": stoneWt,
      "St Amt per Ct": stoneRate,
      "Stone Value": stoneAmount,
      "Metal Division": MetalDivision,
      "GROSS WT": grosswt,
      "NET WT/GOLD WT": NetWt,
      "gold loss wt": LossWt,
      Karat: metalPurity,
      "Gold Colour": metalColor,
      "Rate Type": rateType,
      Rate: metalRate,
      "Gold Value": goldValue,
      "Gold Loss Value": LossAmt,
      "Total Gold Value": MetalAmount,
      MAKING: MakingAmount,
      Cost: TotalAmount,
      "Tag Price 1": TagPrice1,
      "Tag Price 2": TagPrice2,
      tagline1: tagline1,
      tagline2: tagline2,
      tagline3: tagline3,
      tagline4: tagline4,
      tagline5: tagline5,
      "Cost Code": costCode,
      CERTIFICATION: certification,
      "CERTIFIED BY": certifiedby,
      "CERTIFICATE NUMBER": CertificateNo,
    };
    return obj;
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

  return (
    <>
      {loader ? (
        <Loader />
      ) : msg === "" ? (
        ""
      ) : (
        <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
          {msg}
        </p>
      )}
    </>
  );
};

export default ExcelToJsonDownload;
