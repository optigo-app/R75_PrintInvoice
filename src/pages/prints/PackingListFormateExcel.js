// real 4 - http://localhost:3000/?tkn=OTA2NTQ3MTcwMDUzNTY1MQ==&invn=U0syMTA0MjAyNA==&evn=c2FsZQ==&pnm=cGFja2luZyBsaXN0&up=aHR0cDovL3plbi9qby9hcGktbGliL0FwcC9TYWxlQmlsbF9Kc29u&ctv=NzE=&ifid=PackingList3&pid=undefined&etp=ZXhjZWw=

import React, { useEffect, useState } from "react";
import {
  apiCall,
  checkMsg,
  formatAmount,
  handleGlobalImgError,
  isObjectEmpty,
} from "../../GlobalFunctions";
import Loader from "../../components/Loader";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";
import { cloneDeep } from "lodash";
import sanitizeHtml from "sanitize-html";
import { htmlToText } from "html-to-text";
import * as XLSX from "xlsx";

const PackingListFormateExcel = ({
  urls,
  token,
  invoiceNo,
  printName,
  evn,
  ApiVer,
}) => {
  const [result, setResult] = useState(null);
  const [result2, setResult2] = useState(null);
  const [result3, setResult3] = useState(null);
  const [diamondWise, setDiamondWise] = useState([]);
  const [rowWise, setRowWise] = useState([]);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
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
      QualityName: "",
      Colorname: "",
    };

    let diaonlyrndarr1 = [];
    let diaonlyrndarr2 = [];
    let diaonlyrndarr3 = [];
    let diaonlyrndarr4 = [];
    let diarndotherarr5 = [];
    let diaonlyrndarr6 = [];
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
    datas?.resultArray?.forEach((el) => {
      let dia = [];
      el?.diamonds?.forEach((a) => {
        let obj = cloneDeep(a);
        let findrec = dia?.findIndex(
          (ele) =>
            ele?.ShapeName === obj?.ShapeName &&
            ele?.QualityName === obj?.QualityName &&
            ele?.Colorname === obj?.Colorname &&
            ele?.SizeName === obj?.SizeName &&
            ele?.Rate === obj?.Rate
        );
        if (findrec === -1) {
          dia.push(obj);
        } else {
          dia[findrec].Wt += obj?.Wt;
          dia[findrec].Pcs += obj?.Pcs;
          dia[findrec].Rate = obj?.Rate;
          dia[findrec].Amount += obj?.Amount;
        }
      });
      el.diamonds = dia;

      let clr = [];
      el?.colorstone?.forEach((a) => {
        let obj = cloneDeep(a);
        let findrec = clr?.findIndex(
          (ele) =>
            ele?.ShapeName === obj?.ShapeName &&
            ele?.QualityName === obj?.QualityName &&
            ele?.Colorname === obj?.Colorname &&
            ele?.isRateOnPcs === obj?.isRateOnPcs &&
            ele?.SizeName === obj?.SizeName &&
            ele?.Rate === obj?.Rate
        );
        if (findrec === -1) {
          clr.push(obj);
        } else {
          clr[findrec].Wt += obj?.Wt;
          clr[findrec].Pcs += obj?.Pcs;
          clr[findrec].Rate = obj?.Rate;
          clr[findrec].Amount += obj?.Amount;
        }
      });
      el.colorstone = clr;

      let miscAr = [];
      el?.misc?.forEach((a) => {
        let obj = cloneDeep(a);
        let findrec = miscAr?.findIndex(
          (ele) =>
            ele?.ShapeName === obj?.ShapeName &&
            ele?.QualityName === obj?.QualityName &&
            ele?.Colorname === obj?.Colorname &&
            ele?.isRateOnPcs === obj?.isRateOnPcs &&
            ele?.SizeName === obj?.SizeName &&
            ele?.Rate === obj?.Rate
        );
        if (findrec === -1) {
          miscAr.push(obj);
        } else {
          miscAr[findrec].Wt += obj?.Wt;
          miscAr[findrec].Pcs += obj?.Pcs;
          miscAr[findrec].Rate = obj?.Rate;
          miscAr[findrec].Amount += obj?.Amount;
        }
      });
      el.misc = miscAr;

      let misc2arr = el?.misc?.filter((e) => e?.IsHSCOE === 0);

      el.misc = misc2arr;

      let clr_misc_ar = [...el?.colorstone, ...el?.misc];

      el.colorstone = clr_misc_ar;
    });

    let finalArr = [];

    datas?.resultArray?.forEach((e, i) => {
      let arr = [];

      let len = 7;

      if (e?.diamonds?.length > e?.colorstone?.length) {
        if (e?.diamonds?.length > 7) {
          len = e?.diamonds?.length;
        }
      } else if (e?.diamonds?.length < e?.colorstone?.length) {
        if (e?.colorstone?.length > 7) {
          len = e?.colorstone?.length;
        }
      }

      let findMetal = e?.metal?.find((ele, ind) => ele?.IsPrimaryMetal === 1);
      let obj = {};
      obj.sr = i + 1;
      obj.srflag = true;
      obj.srRowSpan = len;
      obj.SrJobno = `${e?.SrJobno}`;
      obj.designno = e?.designno;

      obj.dia_code = e?.diamonds[0]
        ? e?.diamonds[0]?.ShapeName +
        " " +
        e?.diamonds[0]?.QualityName +
        " " +
        e?.diamonds[0]?.Colorname
        : "";
      obj.dia_size = e?.diamonds[0] ? e?.diamonds[0]?.SizeName : "";
      obj.dia_pcs = e?.diamonds[0] ? e?.diamonds[0]?.Pcs : "";
      obj.dia_wt = e?.diamonds[0] ? e?.diamonds[0]?.Wt?.toFixed(3) : "";
      obj.dia_rate = e?.diamonds[0]
        ? Math.round(
          e?.diamonds[0]?.Amount /
          datas?.header?.CurrencyExchRate /
          (e?.diamonds[0]?.Wt === 0 ? 1 : e?.diamonds[0]?.Wt)
        )
        : "";
      obj.dia_amt = e?.diamonds[0] ? e?.diamonds[0]?.Amount : "";
      // obj.dia_rate = e?.diamonds[0] ? (Math.round(((e?.diamonds[0]?.Amount / result?.header?.CurrencyExchRate) / (e?.diamonds[0]?.Wt === 0 ? 1 : e?.diamonds[0]?.Wt)))) : '';

      obj.met_quality = "";
      obj.met_wt = 0;
      obj.met_rate = 0;
      obj.met_amt = 0;

      obj.met_wt = e?.NetWt;
      // obj.met_rate = findMetal ? (Math.round(((findMetal?.Amount / datas?.header?.CurrencyExchRate)) / e?.NetWt)) : '';
      obj.met_rate = findMetal ? Math.round(findMetal?.Rate) : "";
      obj.met_amt = findMetal ? findMetal?.Amount : "";
      obj.met_quality = findMetal
        ? findMetal?.ShapeName + " " + findMetal?.QualityName
        : "";

      obj.cls_code = e?.colorstone[0]
        ? ` ${e?.colorstone[0]?.MasterManagement_DiamondStoneTypeid === 3
          ? "M:"
          : ""
        } ${e?.colorstone[0]?.ShapeName}` +
        " " +
        e?.colorstone[0]?.QualityName +
        " " +
        e?.colorstone[0]?.Colorname
        : "";
      obj.cls_size = e?.colorstone[0] ? e?.colorstone[0]?.SizeName : "";
      obj.cls_pcs = e?.colorstone[0] ? e?.colorstone[0]?.Pcs : "";
      obj.cls_wt = e?.colorstone[0] ? e?.colorstone[0]?.Wt?.toFixed(3) : "";
      // obj.cls_rate = e?.colorstone[0] ? (Math.round(((e?.colorstone[0]?.Amount / result?.header?.CurrencyExchRate)) / ( e?.colorstone[0]?.isRateOnPcs === 1 ? (e?.colorstone[0]?.Pcs === 0 ? 1 : e?.colorstone[0]?.Pcs) :  (e?.colorstone[0]?.Wt === 0 ? 1 : e?.colorstone[0]?.Wt)))) : '';
      obj.cls_rate = e?.colorstone[0]
        ? Math.round(
          e?.colorstone[0]?.Amount /
          datas?.header?.CurrencyExchRate /
          (e?.colorstone[0]?.isRateOnPcs === 1
            ? e?.colorstone[0]?.Pcs === 0
              ? 1
              : e?.colorstone[0]?.Pcs
            : e?.colorstone[0]?.Wt === 0
              ? 1
              : e?.colorstone[0]?.Wt)
        )
        : "";
      obj.cls_amt = e?.colorstone[0] ? e?.colorstone[0]?.Amount : "";

      obj.oth_amt = e?.OtherCharges + e?.TotalDiamondHandling + e?.MiscAmount;
      obj.labour_rate = e?.MaKingCharge_Unit;
      obj.labour_amt =
        e?.MakingAmount +
        e?.totals?.diamonds?.SettingAmount +
        e?.totals?.colorstone?.SettingAmount;
      obj.total_amount = e?.TotalAmount;

      Array?.from({ length: len })?.map((el, ind) => {
        let obj = {};

        obj.srflag = false;
        obj.img = e?.DesignImage;
        obj.imgflag = false;
        if (ind === 0) {
          obj.imgflag = true;
        }
        obj.tunch = e?.Tunch?.toFixed(3);

        obj.tunchflag = false;
        if (ind === 4) {
          obj.tunchflag = true;
        }

        obj.grosswt = e?.grosswt?.toFixed(3);

        obj.grosswetflag = false;
        if (ind === 5) {
          obj.grosswetflag = true;
        }

        //diamond
        obj.dia_code = "";
        obj.dia_size = "";
        obj.dia_pcs = 0;
        obj.dia_wt = 0;
        obj.dia_rate = 0;
        obj.dia_amt = 0;
        obj.diaflag = false;

        if (e?.diamonds[ind + 1]) {
          obj.diaflag = true;
          obj.dia_code =
            e?.diamonds[ind + 1]?.ShapeName +
            " " +
            e?.diamonds[ind + 1]?.QualityName +
            " " +
            e?.diamonds[ind + 1]?.Colorname;
          obj.dia_size = e?.diamonds[ind + 1]?.SizeName;
          obj.dia_pcs = e?.diamonds[ind + 1]?.Pcs;
          obj.dia_wt = e?.diamonds[ind + 1]?.Wt?.toFixed(3);
          // obj.dia_rate = (Math.round((e?.diamonds[ind + 1]?.Amount / result?.header?.CurrencyExchRate) / (e?.diamonds[ind + 1]?.Wt === 0 ? 1 : e?.diamonds[ind + 1]?.Wt)));
          obj.dia_rate = Math.round(
            e?.diamonds[ind + 1]?.Amount /
            datas?.header?.CurrencyExchRate /
            (e?.diamonds[ind + 1]?.Wt === 0 ? 1 : e?.diamonds[ind + 1]?.Wt)
          );
          obj.dia_amt = e?.diamonds[ind + 1]?.Amount;
        }

        // colorstone
        obj.cls_code = "";
        obj.cls_size = "";
        obj.cls_pcs = 0;
        obj.cls_wt = 0;
        obj.cls_rate = 0;
        obj.cls_amt = 0;
        obj.clsflag = false;

        if (e?.colorstone[ind + 1]) {
          obj.clsflag = true;
          obj.cls_code =
            `${e?.colorstone[ind + 1]?.MasterManagement_DiamondStoneTypeid === 3
              ? "M:"
              : ""
            }  ${e?.colorstone[ind + 1]?.ShapeName}` +
            " " +
            e?.colorstone[ind + 1]?.QualityName +
            " " +
            e?.colorstone[ind + 1]?.Colorname;
          obj.cls_size = e?.colorstone[ind + 1]?.SizeName;
          obj.cls_pcs = e?.colorstone[ind + 1]?.Pcs;
          obj.cls_wt = e?.colorstone[ind + 1]?.Wt?.toFixed(3);
          // obj.cls_rate = (Math.round(((e?.colorstone[ind + 1]?.Amount / result?.header?.CurrencyExchRate)) / (e?.colorstone[ind + 1]?.Wt === 0 ? 1 : e?.colorstone[ind + 1]?.Wt)));
          obj.cls_rate = Math.round(
            e?.colorstone[ind + 1]?.Amount /
            datas?.header?.CurrencyExchRate /
            (e?.colorstone[ind + 1]?.Wt === 0
              ? 1
              : e?.colorstone[ind + 1]?.Wt)
          );
          obj.cls_amt = e?.colorstone[ind + 1]?.Amount;
        }

        obj.JobRemark = e?.JobRemark;
        obj.jobRemarkflag = false;
        if (ind === 1 && e?.JobRemark !== "") {
          obj.jobRemarkflag = true;
        }

        arr.push(obj);
      });

      obj.matrialArr = arr;
      obj.values = e;

      finalArr.push(obj);
    });

    setResult2(finalArr);
    setResult(datas);

    let catewise = [];

    datas?.resultArray?.forEach((e, i) => {
      let obj = cloneDeep(e);
      let findrec = catewise?.findIndex(
        (a) => a?.Categoryname === obj?.Categoryname
      );
      if (findrec === -1) {
        catewise.push(obj);
      } else {
        catewise[findrec].Quantity += obj?.Quantity;
      }
    });

    catewise.sort((a, b) => a.Categoryname.localeCompare(b.Categoryname));

    setResult3(catewise);

    let rowArr = [];

    let rowObj = {};
    rowObj.grosswt_name = "GROSS WT";
    rowObj.grosswt_value = datas?.mainTotal?.grosswt?.toFixed(3);
    rowObj.name = "GOLD";
    rowObj.value = formatAmount(datas?.mainTotal?.MetalAmount);
    rowObj.dia_info_name =
      diarndotherarr5[0] !== undefined
        ? diarndotherarr5[0]?.ShapeName +
        " " +
        diarndotherarr5[0]?.QualityName +
        " " +
        diarndotherarr5[0]?.Colorname
        : "";
    rowObj.dia_info_value =
      diarndotherarr5[0] !== undefined
        ? diarndotherarr5[0]?.pcPcss +
        " / " +
        diarndotherarr5[0]?.wtWts?.toFixed(3)
        : "";
    rowObj.sum_info_name =
      catewise[0] === undefined ? "" : catewise[0]?.Categoryname;
    rowObj.sum_info_value =
      catewise[0] === undefined ? "" : catewise[0]?.Quantity;
    rowObj.remark = datas?.header?.PrintRemark;
    rowArr.push(rowObj);

    let rowObj1 = {};
    rowObj1.grosswt_name = "WT";
    rowObj1.grosswt_value = datas?.mainTotal?.netwt?.toFixed(3);
    rowObj1.name = "DIAMOND";
    rowObj1.value = formatAmount(datas?.mainTotal?.diamonds?.Amount);
    rowObj1.dia_info_name =
      diarndotherarr5[1] === undefined
        ? ""
        : diarndotherarr5[1]?.ShapeName +
        " " +
        diarndotherarr5[1]?.QualityName +
        " " +
        diarndotherarr5[1]?.Colorname;
    rowObj1.dia_info_value =
      diarndotherarr5[1] === undefined
        ? ""
        : diarndotherarr5[1]?.pcPcss +
        " / " +
        diarndotherarr5[1]?.wtWts?.toFixed(3);
    // rowObj1.dia_info_name = ((diarndotherarr5[1]?.ShapeName !== undefined ? diarndotherarr5[1]?.ShapeName : "") + " " +
    // ((diarndotherarr5[1]?.QualityName) === undefined ? '' : diarndotherarr5[1]?.QualityName) + " " + (diarndotherarr5[1]?.Colorname === undefined) ? '' : diarndotherarr5[1]?.Colorname)
    // rowObj1.dia_info_value = ((diarndotherarr5[1]?.pcPcss === undefined ? '' : diarndotherarr5[1]?.Colorname ) + " / " + ( diarndotherarr5[1]?.wtWts === undefined ? '' : (diarndotherarr5[1]?.wtWts)?.toFixed(3)))
    rowObj1.sum_info_name =
      catewise[1] === undefined ? "" : catewise[1]?.Categoryname;
    rowObj1.sum_info_value =
      catewise[1] === undefined ? "" : catewise[1]?.Quantity;
    rowObj1.remark = "";
    rowArr.push(rowObj1);

    let rowObj2 = {};
    rowObj2.grosswt_name = "DIAMOND WT";
    rowObj2.grosswt_value = `${datas?.mainTotal?.diamonds?.Pcs
      } / ${datas?.mainTotal?.diamonds?.Wt?.toFixed(3)}`;
    rowObj2.name = "CST";
    rowObj2.value = formatAmount(
      datas?.mainTotal?.colorstone?.Amount +
      datas?.mainTotal?.misc?.onlyIsHSCODE0_Amount
    );
    rowObj2.dia_info_name =
      diarndotherarr5[2] === undefined
        ? ""
        : diarndotherarr5[2]?.ShapeName +
        " " +
        diarndotherarr5[2]?.QualityName +
        " " +
        diarndotherarr5[2]?.Colorname;
    rowObj2.dia_info_value =
      diarndotherarr5[2] === undefined
        ? ""
        : diarndotherarr5[2]?.pcPcss +
        " / " +
        diarndotherarr5[2]?.wtWts?.toFixed(3);
    rowObj2.sum_info_name =
      catewise[2] === undefined ? "" : catewise[2]?.Categoryname;
    rowObj2.sum_info_value =
      catewise[2] === undefined ? "" : catewise[2]?.Quantity;
    rowObj2.remark = "";
    rowArr.push(rowObj2);

    let rowObj3 = {};
    rowObj3.grosswt_name = "STONE WT";
    rowObj3.grosswt_value = `${datas?.mainTotal?.colorstone?.Pcs
      } / ${datas?.mainTotal?.colorstone?.Wt?.toFixed(3)}`;
    rowObj3.name = "MAKING";
    rowObj3.value = formatAmount(
      datas?.mainTotal?.total_Making_Amount +
      datas?.mainTotal?.diamonds?.SettingAmount +
      datas?.mainTotal?.colorstone?.SettingAmount
    );
    rowObj3.dia_info_name =
      diarndotherarr5[3] === undefined
        ? ""
        : diarndotherarr5[3]?.ShapeName +
        " " +
        diarndotherarr5[3]?.QualityName +
        " " +
        diarndotherarr5[3]?.Colorname;
    rowObj3.dia_info_value =
      diarndotherarr5[3] === undefined
        ? ""
        : diarndotherarr5[3]?.pcPcss +
        " / " +
        diarndotherarr5[3]?.wtWts?.toFixed(3);
    rowObj3.sum_info_name =
      catewise[3] === undefined ? "" : catewise[3]?.Categoryname;
    rowObj3.sum_info_value =
      catewise[3] === undefined ? "" : catewise[3]?.Quantity;
    rowObj3.remark = "";
    rowArr.push(rowObj3);

    let rowObj4 = {};
    rowObj4.grosswt_name = "";
    rowObj4.grosswt_value = "";
    rowObj4.name = "OTHER";
    rowObj4.value = formatAmount(
      datas?.mainTotal?.total_other +
      datas?.mainTotal?.totalMiscAmount +
      datas?.mainTotal?.total_diamondHandling
    );
    rowObj4.dia_info_name =
      diarndotherarr5[4] === undefined
        ? ""
        : diarndotherarr5[4]?.ShapeName +
        " " +
        diarndotherarr5[4]?.QualityName +
        " " +
        diarndotherarr5[4]?.Colorname;
    rowObj4.dia_info_value =
      diarndotherarr5[4] === undefined
        ? ""
        : diarndotherarr5[4]?.pcPcss +
        " / " +
        diarndotherarr5[4]?.wtWts?.toFixed(3);
    rowObj4.sum_info_name =
      catewise[4] === undefined ? "" : catewise[4]?.Categoryname;
    rowObj4.sum_info_value =
      catewise[4] === undefined ? "" : catewise[4]?.Quantity;
    rowObj4.remark = "";
    rowArr.push(rowObj4);

    let rowObj5 = {};
    rowObj5.grosswt_name = "";
    rowObj5.grosswt_value = "";
    rowObj5.name = "TAX";
    rowObj5.value = formatAmount(
      +datas?.allTaxesTotal * datas?.header?.CurrencyExchRate
    );
    rowObj5.dia_info_name =
      diarndotherarr5[5] === undefined
        ? ""
        : diarndotherarr5[5]?.ShapeName +
        " " +
        diarndotherarr5[5]?.QualityName +
        " " +
        diarndotherarr5[5]?.Colorname;
    rowObj5.dia_info_value =
      diarndotherarr5[5] === undefined
        ? ""
        : diarndotherarr5[5]?.pcPcss +
        " / " +
        diarndotherarr5[5]?.wtWts?.toFixed(3);
    rowObj5.sum_info_name =
      catewise[5] === undefined ? "" : catewise[5]?.Categoryname;
    rowObj5.sum_info_value =
      catewise[5] === undefined ? "" : catewise[5]?.Quantity;
    rowObj5.remark = "";
    rowArr.push(rowObj5);

    let rowObj6 = {};
    rowObj6.grosswt_name = "";
    rowObj6.grosswt_value = "";
    rowObj6.name = "LESS";
    rowObj6.value = formatAmount(datas?.header?.AddLess);
    rowObj6.dia_info_name =
      diarndotherarr5[6] === undefined
        ? ""
        : diarndotherarr5[6]?.ShapeName +
        " " +
        diarndotherarr5[6]?.QualityName +
        " " +
        diarndotherarr5[6]?.Colorname;
    rowObj6.dia_info_value =
      diarndotherarr5[6] === undefined
        ? ""
        : diarndotherarr5[6]?.pcPcss +
        " / " +
        diarndotherarr5[6]?.wtWts?.toFixed(3);
    rowObj6.sum_info_name =
      catewise[6] === undefined ? "" : catewise[6]?.Categoryname;
    rowObj6.sum_info_value =
      catewise[6] === undefined ? "" : catewise[6]?.Quantity;
    rowObj6.remark = "";
    rowArr.push(rowObj6);

    let rowObj7 = {};
    rowObj7.grosswt_name = "";
    rowObj7.grosswt_value = "";
    rowObj7.name = "TOTAL";
    rowObj7.value = formatAmount(
      datas?.mainTotal.total_amount +
      datas?.header?.AddLess +
      datas?.allTaxesTotal * datas?.header?.CurrencyExchRate
    );
    rowObj7.dia_info_name =
      diarndotherarr5[7] === undefined
        ? ""
        : diarndotherarr5[7]?.ShapeName +
        " " +
        diarndotherarr5[7]?.QualityName +
        " " +
        diarndotherarr5[7]?.Colorname;
    rowObj7.dia_info_value =
      diarndotherarr5[7] === undefined
        ? ""
        : diarndotherarr5[7]?.pcPcss +
        " / " +
        diarndotherarr5[7]?.wtWts?.toFixed(3);
    rowObj7.sum_info_name =
      catewise[7] === undefined ? "" : catewise[7]?.Categoryname;
    rowObj7.sum_info_value =
      catewise[7] === undefined ? "" : catewise[7]?.Quantity;
    rowObj7.remark = "";
    rowArr.push(rowObj7);

    let len2 = 8;
    if (catewise?.length > 8 || diarndotherarr5?.length > 8) {
      if (catewise?.length > diarndotherarr5?.length) {
        len2 = catewise?.length;
      }
      if (catewise?.length < diarndotherarr5?.length) {
        len2 = diarndotherarr5?.length;
      }
    }

    Array.from({ length: len2 })?.map((e, i) => {
      if (i > 7) {
        let rowObjs = {};
        rowObjs.grosswt_name = "";
        rowObjs.grosswt_value = "";
        rowObjs.name = "";
        rowObjs.value = "";
        rowObjs.dia_info_name =
          diarndotherarr5[i] !== undefined
            ? diarndotherarr5[i]?.ShapeName +
            " " +
            diarndotherarr5[i]?.QualityName +
            " " +
            diarndotherarr5[i]?.Colorname
            : "";
        rowObjs.dia_info_value =
          diarndotherarr5[i] === undefined
            ? ""
            : diarndotherarr5[i]?.pcPcss +
            " / " +
            diarndotherarr5[i]?.wtWts?.toFixed(3);
        rowObjs.sum_info_name =
          catewise[i] !== undefined ? catewise[i]?.Categoryname : "";
        rowObjs.sum_info_value =
          catewise[i] !== undefined ? catewise[i]?.Quantity : "";
        rowObjs.remark = "";
        rowArr.push(rowObjs);
      }
    });

    //   setTimeout(() => {
    //     const button = document.getElementById('test-table-xls-button');
    //     button.click();
    // }, 0);

    setRowWise(rowArr);
    // for download excel direct

    // // Remove <blockquote> element
    // let modifiedContent = datas?.header?.Declaration?.replace(/<blockquote[^>]*>[\s\S]*?<\/blockquote>/g, '');

    // // Wrap each item in <br> tags
    // let modifiedContent1 = modifiedContent?.replace(/<u><i><b><\span><\font><\div>/g, '<br>');
    // let modifiedContent2 = modifiedContent1?.replace(/<\/u><\/i><\/b><\/span><\/font><\/div>/g, '</br>');

    // console.log(modifiedContent2);

    //   const sanitizedHtml = sanitizeHtml(datas?.header?.Declaration, {
    //     allowedTags: ['b', 'i', 'u', 'span', 'font'], // Allow only basic formatting tags
    //     allowedAttributes: {
    //       'span': ['style'],
    //       'font': ['face']
    //     },
    //     textFilter: text => text.replace(/\n/g, ' ') // Replace newlines with spaces
    //   });

    //   // Convert sanitized HTML to plain text or simplified HTML
    //   const plainText = htmlToText(sanitizedHtml, {
    //     wordwrap: false, // Disable word wrapping
    //     singleNewLineParagraphs: true // Single new line between paragraphs
    //   });

    //   // datas.header.Declaration = plainText;

    // const sentences = plainText.replace(/\['1.','2.','3.','4.','5.']/g, '<br />');

    // Filter out empty strings and trim whitespace
    // const filteredSentences = sentences.filter(sentence => sentence.trim() !== '');

    // console.log(sentences);

    //loadData end
  };

  console.log("result", result);

  //styles and css
  const tableCellStyle = {
    height: "40px",
    backgroundColor: "#939292",
    color: "white",
    fontSize: "20px",
    fontWeight: "bold",
  };

  const handleDownloadExcel = () => {
    const excelData = result?.resultArray.map((item) => {
      const mdc = item.all_m_d_c_m?.[0] || {};
      console.log("item", item.finding?.Wt, item?.finding);
      return {
        SrNo: item.SrNo || "",
        Itemno: item.Categoryname || "",
        LineId: item?.lineid,
        Tag: item?.SrJobno,
        Pcs: item?.Quantity,
        GrWt: item?.grosswt,
        NtWt: item?.NetWt || "",
        Fine: item.designno || "",
        FineWt: item.PureNetWt || "",
        GoldAmt: item.MetalAmount || "",
        STONEAMT: item.CsAmount || 0,
        McRate: item.MaKingCharge_Unit || "",
        McAmt: item.MakingAmount || "",
        Total: item?.TotalAmount,
        HUIDNO: item?.HUID,
        CertificateRemarks: item?.CertificateNo,
        FindingWT1: item.finding[0]?.Wt,
        FindingMacRATE1: item.finding[0]?.SettingRate || "",
        FindingMacAMT1: item?.finding[0]?.SettingAmount || "",
        FindingWT2: mdc.Size || "",
        FindingMacRATE2: mdc.Setting || "",
        FindingMacAMT2: item.Pcs || "",
      };
    });

    const totalRow = {
      SrNo: "",
      Itemno: "Total",
      LineId: "",
      Tag: "",
      Pcs: excelData.reduce((sum, row) => sum + row.Pcs, 0),
      GrWt: excelData.reduce((sum, row) => sum + row.GrWt, 0),
      NtWt: excelData.reduce((sum, row) => sum + row.NtWt, 0),
      FineWt: excelData.reduce((sum, row) => sum + row.FineWt, 0),
      GoldAmt: excelData.reduce((sum, row) => sum + row.GoldAmt, 0),
      STONEAMT: excelData.reduce((sum, row) => sum + row.STONEAMT, 0),
      McRate: excelData.reduce((sum, row) => sum + row.MaKingCharge_Unit, 0),
      McAmt: excelData.reduce((sum, row) => sum + row.McAmt, 0),
      Total: excelData.reduce((sum, row) => sum + row.Total, 0),
      HUIDNO: "",
      CertificateRemarks: "",
      FindingWT1: excelData.reduce((sum, row) => sum + row.FindingWT1, 0),
      FindingMacRATE1: "", // Usually, rates are not summed.
      FindingMacAMT1: excelData.reduce(
        (sum, row) => sum + row.FindingMacAMT1,
        0
      ),
      FindingWT2: excelData.reduce((sum, row) => sum + row.FindingWT2, 0),
      FindingMacRATE2: "", // Rates are not summed.
      FindingMacAMT2: excelData.reduce(
        (sum, row) => sum + row.FindingMacAMT2,
        0
      ),
    };
    excelData.push(totalRow);

    // const worksheet = XLSX.utils.json_to_sheet(excelData);
    // const workbook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    // XLSX.writeFile(workbook, "sale_cs_grup_format.xlsx");
  };

  if (result) {
    // handleDownloadExcel();
    // const button = document.getElementById('test-table-xls-button');
    // button.click();
  }

  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <>
          {msg === "" ? (
            <>
              <div style={{ paddingBottom: "5rem" }}>
                <ReactHTMLTableToExcel
                  id="test-table-xls-button"
                  className="download-table-xls-button btn btn-success text-black bg-success px-2 py-1 fs-5 d-none"
                  table="table-to-xls"
                  filename={`TaxInvoice_${result?.header?.InvoiceNo
                    }_${Date.now()}`}
                  sheet="tablexls"
                  buttonText="Download as XLS"
                />
                <table id="table-to-xls">
                  {/* <button onClick={handleDownloadExcel}>
                    Click Packing print
                  </button> */}
                  {/* 39 colums */}
                  <tr>
                    <td colSpan={18}>Bill To</td>
                    <td colSpan={16}>Ship To,</td>
                    <td colSpan={2}>LOT NO:</td>
                    <td colSpan={3}>{result?.header?.customerfirmname}</td>
                  </tr>

                  <tr>
                    <td colSpan={18}>{result?.header?.customerfirmname}</td>
                    <td colSpan={16}>{result?.header?.customerfirmname}</td>
                    <td colSpan={2}>Invoice NO:</td>
                    <td colSpan={3}>{result?.header?.customerfirmname}</td>
                  </tr>
                  <tr>
                    <td colSpan={18}>{result?.header?.customerAddress1}</td>
                    <td colSpan={16}>{result?.header?.Printlable}</td>
                    <td colSpan={2}>Date:</td>
                    <td colSpan={3}>{result?.header?.customerfirmname}</td>
                  </tr>
                  <tr>
                    <td colSpan={18}>{result?.header?.customerAddress2}</td>
                    <td colSpan={16}></td>
                    <td colSpan={2}></td>
                    <td colSpan={3}></td>
                  </tr>
                  <tr>
                    <td colSpan={18}>
                      {result?.header?.customercity}-{result?.header?.PinCode}
                    </td>
                    <td colSpan={16}></td>
                    <td colSpan={2}></td>
                    <td colSpan={3}></td>
                  </tr>
                  <tr>
                    <td colSpan={18}>{result?.header?.customeremail1}</td>
                    <td colSpan={16}></td>
                    <td colSpan={2}></td>
                    <td colSpan={3}></td>
                  </tr>
                  <tr>
                    <td colSpan={18}>{result?.header?.vat_cst_pan}</td>
                    <td colSpan={16}></td>
                    <td colSpan={2}></td>
                    <td colSpan={3}></td>
                  </tr>
                  <tr>
                    <td colSpan={18}>
                      {result?.header?.Cust_CST_STATE}-
                      {result?.header?.Cust_CST_STATE_No}
                    </td>
                    <td colSpan={16}></td>
                    <td colSpan={2}></td>
                    <td colSpan={3}></td>
                  </tr>
                  <tr></tr>
                  <tr>
                    <td colSpan={6}>Product Description </td>
                    <td colSpan={9}>Gold (gm)</td>
                    <td colSpan={9}>Diamond (cts)</td>
                    <td colSpan={9}>Colour Stone (cts)</td>
                    <td rowSpan={2}>Studdying Value</td>
                    <td rowSpan={2}>Labour Rate</td>
                    <td rowSpan={2}>Labour Value</td>
                    <td rowSpan={2}>Total Value</td>
                    <td rowSpan={2}>Other Amt</td>
                    <td rowSpan={2}>Grand Value</td>
                  </tr>
                  <tr>
                    <td>Sr No. </td>
                    <td>Product</td>
                    <td>Job No.</td>
                    <td>Design Code</td>
                    <td>GoFibo Sku</td>
                    <td>Purchase Order No</td>
                    <td>Qty</td>
                    <td>Karat</td>
                    <td>Colour</td>
                    <td>Gross Wt</td>
                    <td>Net Wt</td>
                    <td>Rate</td>
                    <td>Amount</td>
                    <td>Gold Loss Wt</td>
                    <td>Gold Loss Amount</td>
                    <td>Shape</td>
                    <td>Quality</td>
                    <td>Size</td>
                    <td>Pcs</td>
                    <td>Weight</td>
                    <td>Rate</td>
                    <td>Amount</td>
                    <td>Total Wt.</td>
                    <td>Total Amt.</td>
                    <td>Shape</td>
                    <td>Quality</td>
                    <td>Size</td>
                    <td>Pcs</td>
                    <td>Weight</td>
                    <td>Rate</td>
                    <td>Amount</td>
                    <td>Total Wt.</td>
                    <td>Total Amt.</td>
                  </tr>
                  {result?.resultArray?.map((data, index) => {

                    console.log('data?.diamondsdata?.diamonds', data?.diamonds);

                    return (
                      <tr key={index}>
                        <td>{data?.SrNo}</td>
                        <td>{data?.Categoryname}</td>
                        <td>{data?.SrJobno}</td>
                        <td>{data?.designno}</td>
                        <td></td>
                        <td>{data?.PO}</td>
                        <td>{data?.Quantity}</td>
                        <td>{data?.MetalPurity}</td>
                        <td>{data?.MetalColor}</td>
                        <td>{data?.grosswt}</td>
                        <td>{data?.NetWt}</td>
                        <td>{data?.metal_rate}</td>
                        <td>{data?.Categoryname}</td>
                        <td>{data?.Categoryname}</td>
                        <td>{data?.Categoryname}</td>

                        {/* <td>{data?.diamonds?.ShapeName}</td>
                        <td>{data?.diamonds?.QualityName}</td>
                        <td>{data?.diamonds?.SizeName}</td>
                        <td>{data?.diamonds?.Pcs}</td>
                        <td>{data?.diamonds?.Wt}</td>
                        <td>{data?.diamonds?.Rate}</td>
                        <td>{data?.diamonds?.Amount}</td>
                        <td>{data?.totals?.diamonds?.Wt}</td> */}
                        {data?.diamonds?.map((diam, diamIn) => {
                          return (
                            <>
                              <td>{diam?.ShapeName}</td>
                              <td>{diam?.QualityName}</td>
                              <td>{diam?.SizeName}</td>
                              <td>{diam?.Pcs}</td>
                              <td>{diam?.Wt}</td>
                              <td>{diam?.Rate}</td>
                              <td>{diam?.Amount}</td>
                              <td>{data?.totals?.diamonds?.Wt}</td>
                            </>
                          );
                        })}
                        <td>{data?.diamonds?.Wt}</td>
                        <td>{data?.Categoryname}</td>
                        <td>{data?.Categoryname}</td>
                        <td>{data?.Categoryname}</td>
                        <td>{data?.Categoryname}</td>
                        <td>{data?.Categoryname}</td>
                        <td>{data?.Categoryname}</td>
                        <td>{data?.Categoryname}</td>
                        <td>{data?.Categoryname}</td>
                        <td>{data?.Categoryname}</td>
                        <td>{data?.Categoryname}</td>
                        <td>{data?.Categoryname}</td>
                        <td>{data?.Categoryname}</td>
                        <td>{data?.Categoryname}</td>
                        <td>{data?.Categoryname}</td>
                        <td>{data?.Categoryname}</td>
                      </tr>
                    );
                  })}
                </table>
              </div>
            </>
          ) : (
            <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
              {msg}
            </p>
          )}
        </>
      )}
    </>
  );
};

export default PackingListFormateExcel;
