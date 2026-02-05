// http://localhost:3000/?tkn=OTA2NTQ3MTcwMDUzNTY1MQ==&invn=UVVPVEUvMzA1ODE=&evn=UXVvdGU=&pnm=ZXhjZWwgMQ==&up=aHR0cDovL256ZW4vam8vYXBpLWxpYi9BcHAvU2FsZUJpbGxfSnNvbg==&ctv=NzE=&ifid=PackingList3&pid=undefined&etp=ZXhjZWw=
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { apiCall, checkMsg, fixedValues, formatAmount, isObjectEmpty, NumberWithCommas } from '../../GlobalFunctions';
import Loader from '../../components/Loader';
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import { MetalShapeNameWiseArr } from '../../GlobalFunctions/MetalShapeNameWiseArr';
import { cloneDeep } from "lodash";

const Excel1Quote = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
  const [result, setResult] = useState(null);
  console.log('result: ', result);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const [MetShpWise, setMetShpWise] = useState([]);
  const [notGoldMetalTotal, setNotGoldMetalTotal] = useState(0);
  const [notGoldMetalWtTotal, setNotGoldMetalWtTotal] = useState(0);
  const [diamondDetails, setDiamondDetails] = useState([]);

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
    // console.log("datadata", data);

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

    //grouping of jobs and isGroupJob is 1

    let finalArr = [];
    datas?.resultArray?.forEach((a) => {
      if (a?.GroupJob === "") {
        finalArr.push(a);
      } else {
        let b = cloneDeep(a);
        let find_record = finalArr.findIndex(
          (el) => el?.GroupJob === b?.GroupJob
        );
        if (find_record === -1) {
          finalArr.push(b);
        } else {
          if (
            finalArr[find_record]?.GroupJob !== finalArr[find_record]?.SrJobno
          ) {
            finalArr[find_record].designno = b?.designno;
            finalArr[find_record].HUID = b?.HUID;
          }
          finalArr[find_record].grosswt += b?.grosswt;
          finalArr[find_record].NetWt += b?.NetWt;
          finalArr[find_record].LossWt += b?.LossWt;
          finalArr[find_record].TotalAmount += b?.TotalAmount;
          finalArr[find_record].DiscountAmt += b?.DiscountAmt;
          finalArr[find_record].UnitCost += b?.UnitCost;
          finalArr[find_record].MakingAmount += b?.MakingAmount;
          finalArr[find_record].OtherCharges += b?.OtherCharges;
          finalArr[find_record].TotalDiamondHandling += b?.TotalDiamondHandling;
          finalArr[find_record].Quantity += b?.Quantity;
          finalArr[find_record].Wastage += b?.Wastage;
          finalArr[find_record].totals.metal.IsPrimaryMetal +=
            b?.totals?.metal?.IsPrimaryMetal;
          finalArr[find_record].totals.metal.Wt += b?.totals?.metal?.Wt;
          finalArr[find_record].totals.diamonds.Wt += b?.totals?.diamonds?.Wt;
          // finalArr[find_record].diamonds_d = [...finalArr[find_record]?.diamonds ,...b?.diamonds]?.flat();
          finalArr[find_record].diamonds = [
            ...finalArr[find_record]?.diamonds,
            ...b?.diamonds,
          ]?.flat();
          // finalArr[find_record].colorstone_d = [...finalArr[find_record]?.colorstone ,...b?.colorstone]?.flat();
          finalArr[find_record].colorstone = [
            ...finalArr[find_record]?.colorstone,
            ...b?.colorstone,
          ]?.flat();
          // finalArr[find_record].metal_d = [...finalArr[find_record]?.metal ,...b?.metal]?.flat();
          finalArr[find_record].metal = [
            ...finalArr[find_record]?.metal,
            ...b?.metal,
          ]?.flat();
          finalArr[find_record].misc = [
            ...finalArr[find_record]?.misc,
            ...b?.misc,
          ]?.flat();
          finalArr[find_record].finding = [
            ...finalArr[find_record]?.finding,
            ...b?.finding,
          ]?.flat();

          finalArr[find_record].totals.finding.Wt += b?.totals?.finding?.Wt;
          finalArr[find_record].totals.finding.Pcs += b?.totals?.finding?.Pcs;
          finalArr[find_record].totals.finding.Amount +=
            b?.totals?.finding?.Amount;

          // finalArr[find_record].totals.diamonds.Wt += b?.totals?.diamonds?.Wt;
          finalArr[find_record].totals.diamonds.Pcs += b?.totals?.diamonds?.Pcs;
          finalArr[find_record].totals.diamonds.Amount +=
            b?.totals?.diamonds?.Amount;

          finalArr[find_record].totals.colorstone.Wt +=
            b?.totals?.colorstone?.Wt;
          finalArr[find_record].totals.colorstone.Pcs +=
            b?.totals?.colorstone?.Pcs;
          finalArr[find_record].totals.colorstone.Amount +=
            b?.totals?.colorstone?.Amount;

          finalArr[find_record].totals.misc.Wt += b?.totals?.misc?.Wt;
          finalArr[find_record].totals.misc.allservwt +=
            b?.totals?.misc?.allservwt;
          finalArr[find_record].totals.misc.Pcs += b?.totals?.misc?.Pcs;
          finalArr[find_record].totals.misc.Amount += b?.totals?.misc?.Amount;

          finalArr[find_record].totals.metal.Amount += b?.totals?.metal?.Amount;
          finalArr[find_record].totals.metal.IsPrimaryMetal +=
            b?.totals?.metal?.IsPrimaryMetal;
          finalArr[find_record].totals.metal.IsPrimaryMetal_Amount +=
            b?.totals?.metal?.IsPrimaryMetal_Amount;

          finalArr[find_record].totals.misc.withouthscode1_2_pcs +=
            b?.totals?.misc?.withouthscode1_2_pcs;
          finalArr[find_record].totals.misc.withouthscode1_2_wt +=
            b?.totals?.misc?.withouthscode1_2_wt;
          finalArr[find_record].totals.misc.onlyHSCODE3_amt +=
            b?.totals?.misc?.onlyHSCODE3_amt;
          finalArr[find_record].totals.misc.onlyIsHSCODE0_Wt +=
            b?.totals?.misc?.onlyIsHSCODE0_Wt;
          finalArr[find_record].totals.misc.onlyIsHSCODE0_Pcs +=
            b?.totals?.misc?.onlyIsHSCODE0_Pcs;
          finalArr[find_record].totals.misc.onlyIsHSCODE0_Amount +=
            b?.totals?.misc?.onlyIsHSCODE0_Amount;
          // finalArr[find_record].misc_d = [...finalArr[find_record]?.misc ,...b?.misc]?.flat();
        }
      }
    });

    datas.resultArray = finalArr;

    //after groupjob
    datas?.resultArray?.forEach((e) => {
      //diamond
      let dia2 = [];
      let dia1_ = [];
      let dia2_ = [];
      e?.diamonds?.forEach((el) => {
        if (el?.GroupName === "") {
          dia1_.push(el);
        } else {
          dia2_.push(el);
        }
      });
      let dia1_g = [];
      dia1_?.forEach((ell) => {
        let bll = cloneDeep(ell);
        let findrec = dia1_g.findIndex(
          (a) =>
            a?.ShapeName === bll?.ShapeName &&
            a?.QualityName === bll?.QualityName &&
            a?.Colorname === bll?.Colorname &&
            a?.SizeName === bll?.SizeName &&
            a?.MaterialTypeName === bll?.MaterialTypeName
        );
        if (findrec === -1) {
          dia1_g.push(bll);
        } else {
          dia1_g[findrec].Wt += bll?.Wt;
          dia1_g[findrec].Pcs += bll?.Pcs;
          dia1_g[findrec].Amount += bll?.Amount;
        }
      });
      let dia2_g = [];
      dia2_?.forEach((ell) => {
        let bll = cloneDeep(ell);
        let findrec = dia2_g.findIndex(
          (a) =>
            a?.ShapeName === bll?.ShapeName &&
            a?.QualityName === bll?.QualityName &&
            a?.Colorname === bll?.Colorname &&
            a?.GroupName === bll?.GroupName &&
            a?.MaterialTypeName === bll?.MaterialTypeName
        );
        if (findrec === -1) {
          dia2_g.push(bll);
        } else {
          dia2_g[findrec].Wt += bll?.Wt;
          dia2_g[findrec].Pcs += bll?.Pcs;
          dia2_g[findrec].Amount += bll?.Amount;
        }
      });
      let dia2_g_ = [];
      dia2_g?.forEach((e) => {
        e.SizeName = e?.GroupName;
        dia2_g_.push(e);
      });
      dia2 = [...dia1_g, ...dia2_g_];

      e.diamonds = dia2;

      let groupedcolorstone = [];

      e.colorstone.forEach((clr) => {
        let found = groupedcolorstone.findIndex(
          (d) =>
            d?.ShapeName === clr?.ShapeName &&
            d?.QualityName === clr?.QualityName &&
            d?.Colorname === clr?.Colorname &&
            d?.Colorname === clr?.Colorname
        );

        if (found === -1) {
          groupedcolorstone.push({ ...clr, count: 1, });
        } else {
          groupedcolorstone[found].Wt += clr?.Wt;
          groupedcolorstone[found].Pcs += clr?.Pcs;
          groupedcolorstone[found].Amount += clr?.Amount;
        }
      });

      e.colorstone = groupedcolorstone;

      let misc0 = [];
      e?.misc?.forEach((el) => {
        if (el?.IsHSCOE === 0) {
          misc0?.push(el);
        }
      });

      e.misc = misc0;

      let met2 = [];
      e?.metal?.forEach((a) => {
        if (e?.GroupJob !== "") {
          let obj = { ...a };
          obj.GroupJob = e?.GroupJob;
          met2?.push(obj);
        }
      });

      let met3 = [];
      met2?.forEach((a) => {
        let findrec = met3?.findIndex(
          (el) => el?.StockBarcode === el?.GroupJob
        );
        if (findrec === -1) {
          met3?.push(a);
        } else {
          met3[findrec].Wt += a?.Wt;
        }
      });
      if (e?.GroupJob === "") {
        return;
      } else {
        e.metal = met3;
      }
    });

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
    datas?.json2?.forEach((e) => {
      if (e?.MasterManagement_DiamondStoneTypeid === 1) {
        if (e.ShapeName?.toLowerCase() === "rnd") {
          diaonlyrndarr1.push(e);
        } else {
          diaonlyrndarr2.push(e);
        }
      }
    });

    diaonlyrndarr1?.forEach((e) => {
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

    diaonlyrndarr2?.forEach((e) => {
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

    diaonlyrndarr4?.forEach((e) => {
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

    let diamondDetail = [];
    data?.BillPrint_Json2?.forEach((e, i) => {
      if (e?.MasterManagement_DiamondStoneTypeid === 1) {
        let findDiamond = diamondDetail?.findIndex(
          (ele, ind) =>
            ele?.ShapeName === e?.ShapeName &&
            ele?.QualityName === e?.QualityName &&
            ele?.Colorname === e?.Colorname
        );
        if (findDiamond === -1) {
          diamondDetail.push(e);
        } else {
          diamondDetail[findDiamond].Pcs += e?.Pcs;
          diamondDetail[findDiamond].Wt += e?.Wt;
          diamondDetail[findDiamond].Amount += e?.Amount;
        }
      }
    });
    let findRND = [];
    let remaingDia = [];
    diamondDetail?.forEach((ele, ind) => {
      if (ele?.ShapeName === "RND") {
        findRND.push(ele);
      } else {
        remaingDia.push(ele);
      }
    });

    let resultArr = [];
    findRND.sort((a, b) => {
      if (a.ShapeName !== b.ShapeName) {
        return a.ShapeName.localeCompare(b.ShapeName); // Sort by ShapeName
      } else if (a.QualityName !== b.QualityName) {
        return a.QualityName.localeCompare(b.QualityName); // If ShapeName is same, sort by QualityName
      } else {
        return a.Colorname.localeCompare(b.Colorname); // If QualityName is same, sort by Colorname
      }
    });

    remaingDia.sort((a, b) => {
      if (a.ShapeName !== b.ShapeName) {
        return a.ShapeName.localeCompare(b.ShapeName); // Sort by ShapeName
      } else if (a.QualityName !== b.QualityName) {
        return a.QualityName.localeCompare(b.QualityName); // If ShapeName is same, sort by QualityName
      } else {
        return a.Colorname.localeCompare(b.Colorname); // If QualityName is same, sort by Colorname
      }
    });
    if (findRND?.length > 6) {
      let arr = findRND.slice(0, 6);
      let anotherArr = [...findRND.slice(6), remaingDia].flat();
      let obj = { ...anotherArr[0] };
      anotherArr?.reduce((acc, cobj) => {
        obj.Pcs += cobj?.Pcs;
        obj.Wt += cobj?.Wt;
        obj.Amount += cobj?.Amount;
      }, obj);
      obj.ShapeName = "OTHER";
      resultArr = [...arr, obj].flat();
    } else {
      let arr = [...findRND].flat();
      let smallArr = [...remaingDia.slice(0, 6 - findRND?.length)].flat();
      let largeArr = [...remaingDia.slice(6 - findRND?.length)].flat();
      let finalArr = [...arr, ...smallArr].flat();

      let obj = { ...largeArr[0] };
      obj.Pcs = 0;
      obj.Wt = 0;
      obj.Amount = 0;
      largeArr?.reduce((acc, cobj) => {
        obj.Pcs += cobj?.Pcs;
        obj.Wt += cobj?.Wt;
        obj.Amount += cobj?.Amount;
      }, obj);
      obj.ShapeName = "OTHER";
      resultArr = [...finalArr, obj].flat();
    }

    setDiamondDetails(resultArr);
    setResult(datas);
    // console.log("datas", datas);
    setTimeout(() => {
      const button = document.getElementById('test-table-xls-button');
      button.click();
    }, 500);
  }

  // console.log("result", result);

  // Style...
  const txtAtSta = {
    textAlign: "left",
  }
  const fntSize = {
    fontSize: "14px"
  }

  const getMetalColors = (ghid, json2 = []) => {
    const metals = json2.filter(
      item =>
        item.GHid === ghid &&
        item.MasterManagement_DiamondStoneTypeid === 4
    );

    // sort: primary metal first
    metals.sort((a, b) => (b.IsPrimaryMetal || 0) - (a.IsPrimaryMetal || 0));

    const colors = metals
      .map(item => item.Colorname || item.MetalColorCode)
      .filter(Boolean);

    // remove duplicates while preserving order
    return [...new Set(colors)].join(", ");
  };

  const getMetalPurity = (ghid, json2 = []) => {
    const metals = json2.filter(
      item =>
        item.GHid === ghid &&
        item.MasterManagement_DiamondStoneTypeid === 4
    );
    metals.sort(
      (a, b) => (b.IsPrimaryMetal ?? 0) - (a.IsPrimaryMetal ?? 0)
    );
    const purities = metals
      .map(item => item.QualityName) // <-- JSON correct field
      .filter(Boolean);
    return [...new Set(purities)].join(", ");
  };


  return (
    <>
      {loader ? <Loader /> : msg === "" ?
        <> <ReactHTMLTableToExcel
          id="test-table-xls-button"
          className="download-table-xls-button btn btn-success text-black bg-success px-2 py-1 fs-5 d-none"
          table="table-to-xls"
          filename={`Excel1_${result?.header?.InvoiceNo}_${Date.now()}`}
          sheet="tablexls"
          buttonText="Download as XLS" />
          <table id="table-to-xls" className='d-none'>
            <tbody>
              <tr>
                <td width={900} height={25} style={{ ...fntSize }}>Handle</td>
                <td width={900} style={{ ...fntSize }}>Title</td>
                <td width={1500} style={{ ...fntSize }}>Body (HTML)</td>
                <td width={250} style={{ ...fntSize }}>Vendor</td>
                <td width={400} style={{ ...fntSize }}>Product Category</td>
                <td width={350} style={{ ...fntSize }}>Type</td>
                <td width={1500} style={{ ...fntSize }}>Tags</td>
                <td width={100} style={{ ...fntSize }}>Published</td>
                <td width={250} style={{ ...fntSize }}>Option1 Name</td>
                <td width={200} style={{ ...fntSize }}>Option1 Value</td>
                <td width={300} style={{ ...fntSize }}>Option1 Linked TO</td>
                <td width={250} style={{ ...fntSize }}>Option2 Name</td>
                <td width={200} style={{ ...fntSize }}>Option2 Value</td>
                <td width={300} style={{ ...fntSize }}>Option2 Linked To</td>
                <td width={150} style={{ ...fntSize }}>Option3 Name</td>
                <td width={150} style={{ ...fntSize }}>Option3 Value</td>
                <td width={200} style={{ ...fntSize }}>Option3 Linked To</td>
                <td width={300} style={{ ...fntSize }}>Variant SKU</td>
                <td width={200} style={{ ...fntSize }}>Variant Grams</td>
                <td width={250} style={{ ...fntSize }}>Variant Inventory Tracker</td>
                <td width={250} style={{ ...fntSize }}>Variant Inventory Qty</td>
                <td width={250} style={{ ...fntSize }}>Variant Inventory Policy</td>
                <td width={300} style={{ ...fntSize }}>Variant Fulfillment Service</td>
                <td width={150} style={{ ...fntSize }}>Variant Price</td>
                <td width={250} style={{ ...fntSize }}>Variant Compare At Price</td>
                <td width={300} style={{ ...fntSize }}>Variant Requires Shipping</td>
                <td width={200} style={{ ...fntSize }}>Variant Taxable</td>
                <td width={300} style={{ ...fntSize }}>Unit Price Total Measure</td>
                <td width={300} style={{ ...fntSize }}>Unit Price Total Measure Unit</td>
                <td width={300} style={{ ...fntSize }}>Unit Price Base Measure</td>
                <td width={300} style={{ ...fntSize }}>Unit Price Base Measure Unit</td>
                <td width={200} style={{ ...fntSize }}>Variant Barcode</td>
                <td width={900} style={{ ...fntSize }}>Image Src</td>
                <td width={200} style={{ ...fntSize }}>Image Position</td>
                <td width={200} style={{ ...fntSize }}>Image Alt Text</td>
                <td width={120} style={{ ...fntSize }}>Gift Card</td>
                <td width={650} style={{ ...fntSize }}>SEO Title</td>
                <td width={1500} style={{ ...fntSize }}>SEO Description</td>
                <td width={550} style={{ ...fntSize }}>Google Shopping / Google Product Category</td>
                <td width={300} style={{ ...fntSize }}>Google Shopping / Gender</td>
                <td width={350} style={{ ...fntSize }}>Google Shopping / Age Group</td>
                <td width={300} style={{ ...fntSize }}>Google Shopping / MPN</td>
                <td width={300} style={{ ...fntSize }}>Google Shopping / Condition</td>
                <td width={350} style={{ ...fntSize }}>Google Shopping / Custom Product</td>
                <td width={350} style={{ ...fntSize }}>Google Shopping / Custom Label 0</td>
                <td width={350} style={{ ...fntSize }}>Google Shopping / Custom Label 1</td>
                <td width={350} style={{ ...fntSize }}>Google Shopping / Custom Label 2</td>
                <td width={350} style={{ ...fntSize }}>Google Shopping / Custom Label 3</td>
                <td width={350} style={{ ...fntSize }}>Google Shopping / Custom Label 4</td>
                <td width={800} style={{ ...fntSize }}>Actual Metal Color (Catawiki) (product.metafields.custom.actual_metal_color_catawiki)</td>
                <td width={800} style={{ ...fntSize }}>Band Color Rings Etsy (product.metafields.custom.band_color_rings_etsy)</td>
                <td width={600} style={{ ...fntSize }}>Bracelets width (product.metafields.custom.bracelets_width)</td>
                <td width={650} style={{ ...fntSize }}>Bracelet Length (product.metafields.custom.bracelet_length)</td>
                <td width={900} style={{ ...fntSize }}>Can be personalised Etsy (product.metafields.custom.can_be_personalised_etsy)</td>
                <td width={800} style={{ ...fntSize }}>Catawiki Price (Euro) (product.metafields.custom.catawiki_price_euro1)</td>
                <td width={550} style={{ ...fntSize }}>Chain Style (product.metafields.custom.chain_style)</td>
                <td width={650} style={{ ...fntSize }}>Closure Bracelet, Necklace (product.metafields.custom.closure_)</td>
                <td width={650} style={{ ...fntSize }}>Closure Earrings (product.metafields.custom.closure_earrings)</td>
                <td width={850} style={{ ...fntSize }}>Cutting type of surrounding stone (product.metafields.custom.cutting_type_of_surrounding_stone)</td>
                <td width={850} style={{ ...fntSize }}>Cut Type Etsy/ Main Sone Cut (product.metafields.custom.cut_type_etsy_main_sone_cut)</td>
                <td width={850} style={{ ...fntSize }}>Diamond Clarity of Main Stone (product.metafields.custom.diamond_clarity_of_main_stone)</td>
                <td width={850} style={{ ...fntSize }}>Diamond clarity of surrounding stone (product.metafields.custom.diamond_clarity_of_surrounding_stone1)</td>
                <td width={850} style={{ ...fntSize }}>Diamond colour grade of main stone (product.metafields.custom.diamond_colour_grade_of_main_stone)</td>
                <td width={950} style={{ ...fntSize }}>Diamond colour grade of surrounding stones (product.metafields.custom.diamond_colour_grade_of_surrounding_stones)</td>
                <td width={450} style={{ ...fntSize }}>Drop Length (product.metafields.custom.drop_length)</td>
                <td width={500} style={{ ...fntSize }}>Etsy Category (product.metafields.custom.etsy_category)</td>
                <td width={1800} style={{ ...fntSize }}>Etsy Description (product.metafields.custom.etsy_description)</td>
                <td width={800} style={{ ...fntSize }}>Etsy Meta Tittle (product.metafields.custom.etsy_meta_tittle)</td>
                <td width={700} style={{ ...fntSize }}>Gemstone / MainStone (product.metafields.custom.gemstone_mainstone1)</td>
                <td width={550} style={{ ...fntSize }}>Gem Color Etsy (product.metafields.custom.gem_color_etsy)</td>
                <td width={700} style={{ ...fntSize }}>Gem Color / Main Stone Color (product.metafields.custom.gem_color_main_stone_color)</td>
                <td width={650} style={{ ...fntSize }}>Gold Purity (9,10,14,18) S4 (product.metafields.custom.gold_purity_9_10_14_18_s4)</td>
                <td width={500} style={{ ...fntSize }}>Gold Solidity (product.metafields.custom.gold_solidity)</td>
                <td width={600} style={{ ...fntSize }}>Gross Weight (Catawiki) (product.metafields.custom.gross_weight_catawiki1)</td>
                <td width={650} style={{ ...fntSize }}>Highlights Etsy Description (product.metafields.custom.highlights_etsy_description)</td>
                <td width={700} style={{ ...fntSize }}>Is there more then 2 stones (product.metafields.custom.is_there_more_then_2_stones)</td>
                <td width={500} style={{ ...fntSize }}>Jewelry Style (product.metafields.custom.jewelry_style)</td>
                <td width={650} style={{ ...fntSize }}>Laboratory Report Catawiki (product.metafields.custom.laboratory_report_catawiki)</td>
                <td width={650} style={{ ...fntSize }}>Laboratory Report Number (product.metafields.custom.laboratory_report_number)</td>
                <td width={500} style={{ ...fntSize }}>Length (product.metafields.custom.length)</td>
                <td width={550} style={{ ...fntSize }}>Location (product.metafields.custom.location)</td>
                <td width={600} style={{ ...fntSize }}>Material (Select 3) (product.metafields.custom.material_select_3)</td>
                <td width={600} style={{ ...fntSize }}>Necklace length (product.metafields.custom.necklace_length)</td>
                <td width={800} style={{ ...fntSize }}>Number of Diamond Main stone (product.metafields.custom.number_of_diamond_main_stone)</td>
                <td width={850} style={{ ...fntSize }}>Number of Diamond Surrounding Stone (product.metafields.custom.number_of_diamond_surrounding_stone)</td>
                <td width={600} style={{ ...fntSize }}>Number of Strands (product.metafields.custom.number_of_strands)</td>
                <td width={600} style={{ ...fntSize }}>Object Catawiki (C) (product.metafields.custom.object_catawiki_c)</td>
                <td width={650} style={{ ...fntSize }}>Occasion Etsy Description (product.metafields.custom.occasion_etsy_description)</td>
                <td width={600} style={{ ...fntSize }}>Pendant Height (product.metafields.custom.pendant_height)</td>
                <td width={600} style={{ ...fntSize }}>Pendant Width (product.metafields.custom.pendant_width)</td>
                <td width={600} style={{ ...fntSize }}>Primary Colour  (product.metafields.custom.primary_colour)</td>
                <td width={600} style={{ ...fntSize }}>Product badge (product.metafields.custom.product_badge)</td>
                <td width={700} style={{ ...fntSize }}>Recipient Etsy / Gender (product.metafields.custom.recipient_etsy_gender)</td>
                <td width={700} style={{ ...fntSize }}>Secondary Stone Catawiki (product.metafields.custom.secondary_stone_catawiki)</td>
                <td width={700} style={{ ...fntSize }}>Setting Etsy (Select 3) (product.metafields.custom.setting_etsy_select_3)</td>
                <td width={600} style={{ ...fntSize }}>Shank Type Etsy (product.metafields.custom.shank_type_etsy)</td>
                <td width={500} style={{ ...fntSize }}>Shape Etsy (product.metafields.custom.shape_etsy)</td>
                <td width={700} style={{ ...fntSize }}>Shape of mainstone (catawiki) (product.metafields.custom.shape_of_mainstone_catawiki)</td>
                <td width={700} style={{ ...fntSize }}>Shape of surrounding stone (product.metafields.custom.shape_of_surrounding_stone1)</td>
                <td width={600} style={{ ...fntSize }}>Shop Section Etsy (product.metafields.custom.shop_section_etsy)</td>
                <td width={550} style={{ ...fntSize }}>Stone 3 Carat (product.metafields.custom.stone_3_carat)</td>
                <td width={550} style={{ ...fntSize }}>Stone 3 Clarity (product.metafields.custom.stone_3_clarity)</td>
                <td width={550} style={{ ...fntSize }}>Stone 3 Color (product.metafields.custom.stone_3_color)</td>
                <td width={550} style={{ ...fntSize }}>Stone 3 Shape (product.metafields.custom.stone_3_shape)</td>
                <td width={600} style={{ ...fntSize }}>Stone 3 Type of stone (product.metafields.custom.stone_3_type_of_stone)</td>
                <td width={550} style={{ ...fntSize }}>Stone 4 Carat (product.metafields.custom.stone_4_carat)</td>
                <td width={550} style={{ ...fntSize }}>Stone 4 Clarity (product.metafields.custom.stone_4_clarity)</td>
                <td width={550} style={{ ...fntSize }}>Stone 4 Color (product.metafields.custom.stone_4_color)</td>
                <td width={550} style={{ ...fntSize }}>Stone 4 Shape (product.metafields.custom.stone_4_shape)</td>
                <td width={600} style={{ ...fntSize }}>Stone 4 Type of Stone (product.metafields.custom.stone_4_type_of_stone)</td>
                <td width={550} style={{ ...fntSize }}>Stone 5 Carat (product.metafields.custom.stone_5_carat)</td>
                <td width={550} style={{ ...fntSize }}>Stone 5 Clarity (product.metafields.custom.stone_5_clarity)</td>
                <td width={550} style={{ ...fntSize }}>Stone 5 Color (product.metafields.custom.stone_5_color)</td>
                <td width={550} style={{ ...fntSize }}>Stone 5 Shape (product.metafields.custom.stone_5_shape)</td>
                <td width={600} style={{ ...fntSize }}>Stone 5 Type of stone (product.metafields.custom.stone_5_type_of_stone)</td>
                <td width={550} style={{ ...fntSize }}>Stone 6 Carat (product.metafields.custom.stone_6_carat)</td>
                <td width={550} style={{ ...fntSize }}>Stone 6 Clarity (product.metafields.custom.stone_6_clarity)</td>
                <td width={550} style={{ ...fntSize }}>Stone 6 Color (product.metafields.custom.stone_6_color)</td>
                <td width={550} style={{ ...fntSize }}>Stone 6 Shape (product.metafields.custom.stone_6_shape)</td>
                <td width={600} style={{ ...fntSize }}>Stone 6 Type of Stone (product.metafields.custom.stone_6_type_of_stone)</td>
                <td width={550} style={{ ...fntSize }}>Stone Source Etsy (product.metafields.custom.stone_source_etsy)</td>
                <td width={500} style={{ ...fntSize }}>Style Esty (product.metafields.custom.style_esty)</td>
                <td width={550} style={{ ...fntSize }}>Tag for Etsy 1 (product.metafields.custom.tag_for_etsy_1)</td>
                <td width={550} style={{ ...fntSize }}>Tag for Etsy 10 (product.metafields.custom.tag_for_etsy_10)</td>
                <td width={550} style={{ ...fntSize }}>Tag for Etsy 11 (product.metafields.custom.tag_for_etsy_11)</td>
                <td width={550} style={{ ...fntSize }}>Tag for Etsy 12 (product.metafields.custom.tag_for_etsy_12)</td>
                <td width={550} style={{ ...fntSize }}>Tag for Etsy 13 (product.metafields.custom.tag_for_etsy_13)</td>
                <td width={550} style={{ ...fntSize }}>Tag for Etsy 2 (product.metafields.custom.tag_for_etsy_2)</td>
                <td width={550} style={{ ...fntSize }}>Tag for Etsy 3 (product.metafields.custom.tag_for_etsy_3)</td>
                <td width={550} style={{ ...fntSize }}>Tag for Etsy 4 (product.metafields.custom.tag_for_etsy_4)</td>
                <td width={550} style={{ ...fntSize }}>Tag for Etsy 5 (product.metafields.custom.tag_for_etsy_5)</td>
                <td width={550} style={{ ...fntSize }}>Tag for Etsy 6 (product.metafields.custom.tag_for_etsy_6)</td>
                <td width={550} style={{ ...fntSize }}>Tag for Etsy 7 (product.metafields.custom.tag_for_etsy_7)</td>
                <td width={550} style={{ ...fntSize }}>Tag for Etsy 8 (product.metafields.custom.tag_for_etsy_8)</td>
                <td width={550} style={{ ...fntSize }}>Tag for Etsy 9 (product.metafields.custom.tag_for_etsy_9)</td>
                <td width={500} style={{ ...fntSize }}>Theme Etsy (product.metafields.custom.theme_etsy)</td>
                <td width={750} style={{ ...fntSize }}>Total carat weight of all stone (product.metafields.custom.total_carat_weight_of_all_stone1)</td>
                <td width={750} style={{ ...fntSize }}>Total Carat Weight of main stone (product.metafields.custom.total_carat_weight_of_main_stone)</td>
                <td width={900} style={{ ...fntSize }}>Total Carat Weight of Surrounding stone (product.metafields.custom.total_carat_weight_of_surrounding_stone)</td>
                <td width={900} style={{ ...fntSize }}>Transparency of main stone (catawiki) (product.metafields.custom.transparency_of_main_stone_catawiki)</td>
                <td width={850} style={{ ...fntSize }}>Transparency of surrounding stone (product.metafields.custom.transparency_of_surrounding_stone)</td>
                <td width={700} style={{ ...fntSize }}>Treatment of mainstone (product.metafields.custom.treatment_of_mainstone)</td>
                <td width={750} style={{ ...fntSize }}>Treatment of surrounding stones (product.metafields.custom.treatment_of_surrounding_stones)</td>
                <td width={500} style={{ ...fntSize }}>v360_url (product.metafields.custom.v360_url)</td>
                <td width={550} style={{ ...fntSize }}>Wedding theme (product.metafields.custom.wedding_theme)</td>
                <td width={700} style={{ ...fntSize }}>Why Us Etsy Descriptions (product.metafields.custom.why_us_etsy_descriptions)</td>
                <td width={450} style={{ ...fntSize }}>Width (product.metafields.custom.width)</td>
                <td width={650} style={{ ...fntSize }}>EComposer product countdown end at (product.metafields.ecomposer.countdown)</td>
                <td width={750} style={{ ...fntSize }}>EComposer product countdown start at (product.metafields.ecomposer.countdown_from)</td>
                <td width={650} style={{ ...fntSize }}>Google: Custom Product (product.metafields.mm-google-shopping.custom_product)</td>
                <td width={500} style={{ ...fntSize }}>Age group (product.metafields.shopify.age-group)</td>
                <td width={550} style={{ ...fntSize }}>Bracelet design (product.metafields.shopify.bracelet-design)</td>
                <td width={500} style={{ ...fntSize }}>Color (product.metafields.shopify.color-pattern)</td>
                <td width={550} style={{ ...fntSize }}>Earring design (product.metafields.shopify.earring-design)</td>
                <td width={1200} style={{ ...fntSize }}>Jewelry material (product.metafields.shopify.jewelry-material)</td>
                <td width={600} style={{ ...fntSize }}>Jewelry type (product.metafields.shopify.jewelry-type)</td>
                <td width={600} style={{ ...fntSize }}>Necklace design (product.metafields.shopify.necklace-design)</td>
                <td width={600} style={{ ...fntSize }}>Ring design (product.metafields.shopify.ring-design)</td>
                <td width={550} style={{ ...fntSize }}>Ring size (product.metafields.shopify.ring-size)</td>
                <td width={550} style={{ ...fntSize }}>Target gender (product.metafields.shopify.target-gender)</td>
                <td width={1400} style={{ ...fntSize }}>Complementary products (product.metafields.shopify--discovery--product_recommendation.complementary_products)</td>
                <td width={1400} style={{ ...fntSize }}>Related products (product.metafields.shopify--discovery--product_recommendation.related_products)</td>
                <td width={950} style={{ ...fntSize }}>Related products settings (product.metafields.shopify--discovery--product_recommendation.related_products_display)</td>
                <td width={800} style={{ ...fntSize }}>Search product boosts (product.metafields.shopify--discovery--product_search_boost.queries)</td>
                <td width={700} style={{ ...fntSize }}>Variant Image</td>
                <td width={200} style={{ ...fntSize }}>Variant Weight Unit</td>
                <td width={150} style={{ ...fntSize }}>Variant Tax Code</td>
                <td width={150} style={{ ...fntSize }}>Cost per item</td>
                <td width={100} style={{ ...fntSize }}>Status</td>
                <td width={250} style={{ ...fntSize }}>total diamond amount</td>
                <td width={250} style={{ ...fntSize }}>total colorstone amount</td>
                <td width={150} style={{ ...fntSize }}>making amount</td>
                <td width={150} style={{ ...fntSize }}>other amount</td>
                <td width={150} style={{ ...fntSize }}>metal amount</td>
              </tr>

              {result?.resultArray?.map((e, i) => {
                // Colorstones & Diamonds Count
                let colorstones = e?.colorstone || [];
                let diamonds = e?.diamonds || [];

                const totalItems = colorstones.length + diamonds.length;

                if (totalItems > 6) {
                  if (colorstones.length <= 6) {
                    diamonds = diamonds.slice(0, 6 - colorstones.length);
                  } else {
                    colorstones = colorstones.slice(0, 6);
                    diamonds = [];
                  }
                }

                const allItems = [...colorstones, ...diamonds];
                const emptyCells = Array(6 - allItems.length).fill({
                  ShapeName: "",
                  QualityName: "",
                  Colorname: "",
                  Pcs: 0,
                  Wt: 0
                });
                const finalItems = [...allItems, ...emptyCells];
                const totalWeight = finalItems.reduce((acc, item) => acc + item.Wt, 0);
                // console.log(totalWeight);
                const totalW = e?.totals?.diamonds?.Wt + e?.totals?.colorstone?.Wt

                // Calculate other amounts
                const hallmarkAmounts = e?.stone_misc?.filter(el => el?.ShapeName === "Hallmark")
                  .map((el) => el?.Amount || 0);

                const settingAmount = e?.totals?.finding?.SettingAmount || 0;
                const otherDetailsAmount = e?.other_details?.reduce((sum, el) => sum + (el?.amtval || 0), 0);
                const diamondSettingAmount = e?.totals?.diamonds?.SettingAmount || 0;
                const colorstoneSettingAmount = e?.totals?.colorstone?.SettingAmount || 0;
                const totalDiamondHandling = e?.TotalDiamondHandling || 0;
                const miscAmount = e?.miscList_IsHSCODE123?.filter(el => el?.IsHSCOE === 3)
                  .reduce((sum, el) => sum + (el?.Amount || 0), 0);
                const eleWiseOthrAmt = hallmarkAmounts.reduce((sum, amount) => sum + amount, 0) + settingAmount + otherDetailsAmount + diamondSettingAmount + colorstoneSettingAmount + totalDiamondHandling + miscAmount;

                const metalColors = getMetalColors(e.GHid, result?.json2);
                const metalPurity = getMetalPurity(e.GHid, result?.json2);
                return (
                  <tr key={i}>
                    <td height={25}></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{`Apparel & Accessories > Jewelry > ${e?.Categoryname}`}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{e?.designno}</td>
                    <td></td>
                    <td></td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{e?.designcount}</td>
                    <td></td>
                    <td></td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{formatAmount(e?.TotalAmount, 2)}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{metalColors}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{finalItems.map((em, i) => i === 0 ? em?.MasterManagement_DiamondStoneTypeid === 2 ? "" : em?.QualityName : "")}</td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{finalItems.map((em, i) => i === 1 && em?.MasterManagement_DiamondStoneTypeid !== 2 ? em?.QualityName : "")}</td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{finalItems.map((em, i) => i === 0 ? em?.Colorname : "")}</td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{finalItems.map((em, i) => i === 1 ? em?.Colorname : "")}</td>
                    <td></td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{e?.SubCategoryname}</td>
                    <td></td>
                    <td></td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{finalItems.map((em, i) => i === 0 ? em?.MasterManagement_DiamondStoneTypeid === 2 ? em?.QualityName : em?.MasterManagement_DiamondStoneTypeid === 1 && em?.MaterialTypeName === "" ? "Diamond" : em?.MaterialTypeName : "")}</td>
                    <td></td>
                    <td></td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{metalPurity}</td>
                    <td></td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{fixedValues(e?.grosswt, 3)}g</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{finalItems.map((em, i) => i === 0 ? em?.Pcs : "")}</td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{finalItems.map((em, i) => i === 1 ? em?.Pcs : "")}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{metalColors}</td>
                    <td></td>
                    <td></td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{finalItems.map((em, i) => i === 1 ? em?.MasterManagement_DiamondStoneTypeid === 2 ? em?.QualityName : em?.MasterManagement_DiamondStoneTypeid === 1 && em?.MaterialTypeName === "" ? "Diamond" : em?.MaterialTypeName : "")}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{finalItems.map((em, i) => i === 0 ? em?.ShapeName : "")}</td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{finalItems.map((em, i) => i === 1 ? em?.ShapeName : "")}</td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{e?.Collectionname}</td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{finalItems.map((em, i) => i === 2 && em?.Wt !== 0 ? `${fixedValues(em?.Wt, 2)} ct` : "")}</td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{finalItems.map((em, i) => i === 2 && em?.MasterManagement_DiamondStoneTypeid !== 2 ? em?.QualityName : "")}</td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{finalItems.map((em, i) => i === 2 ? em?.Colorname : "")}</td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{finalItems.map((em, i) => i === 2 ? em?.ShapeName : "")}</td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{finalItems.map((em, i) => i === 2 ? em?.MasterManagement_DiamondStoneTypeid === 2 ? em?.QualityName : em?.MasterManagement_DiamondStoneTypeid === 1 && em?.MaterialTypeName === "" ? "Diamond" : em?.MaterialTypeName : "")}</td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{finalItems.map((em, i) => i === 3 && em?.Wt !== 0 ? `${fixedValues(em?.Wt, 2)} ct` : "")}</td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{finalItems.map((em, i) => i === 3 && em?.MasterManagement_DiamondStoneTypeid !== 2 ? em?.QualityName : "")}</td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{finalItems.map((em, i) => i === 3 ? em?.Colorname : "")}</td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{finalItems.map((em, i) => i === 3 ? em?.ShapeName : "")}</td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{finalItems.map((em, i) => i === 3 ? em?.MasterManagement_DiamondStoneTypeid === 2 ? em?.QualityName : em?.MasterManagement_DiamondStoneTypeid === 1 && em?.MaterialTypeName === "" ? "Diamond" : em?.MaterialTypeName : "")}</td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{finalItems.map((em, i) => i === 4 && em?.Wt !== 0 ? `${fixedValues(em?.Wt, 2)} ct` : "")}</td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{finalItems.map((em, i) => i === 4 && em?.MasterManagement_DiamondStoneTypeid !== 2 ? em?.QualityName : "")}</td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{finalItems.map((em, i) => i === 4 ? em?.Colorname : "")}</td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{finalItems.map((em, i) => i === 4 ? em?.ShapeName : "")}</td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{finalItems.map((em, i) => i === 4 ? em?.MasterManagement_DiamondStoneTypeid === 2 ? em?.QualityName : em?.MasterManagement_DiamondStoneTypeid === 1 && em?.MaterialTypeName === "" ? "Diamond" : em?.MaterialTypeName : "")}</td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{finalItems.map((em, i) => i === 5 && em?.Wt !== 0 ? `${fixedValues(em?.Wt, 2)} ct` : "")}</td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{finalItems.map((em, i) => i === 5 && em?.MasterManagement_DiamondStoneTypeid !== 2 ? em?.QualityName : "")}</td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{finalItems.map((em, i) => i === 5 ? em?.Colorname : "")}</td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{finalItems.map((em, i) => i === 5 ? em?.ShapeName : "")}</td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{finalItems.map((em, i) => i === 5 ? em?.MasterManagement_DiamondStoneTypeid === 2 ? em?.QualityName : em?.MasterManagement_DiamondStoneTypeid === 1 && em?.MaterialTypeName === "" ? "Diamond" : em?.MaterialTypeName : "")}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{totalW !== 0 ? `${fixedValues(totalW, 2)} ct` : ""}</td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{finalItems.map((em, i) => i === 0 && em?.Wt !== 0 ? `${fixedValues(em?.Wt, 2)} ct` : "")}</td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{finalItems.map((em, i) => i === 1 && em?.Wt !== 0 ? `${fixedValues(em?.Wt, 2)} ct` : "")}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{e?.totals?.diamonds?.Amount !== 0 ? `${formatAmount(e?.totals?.diamonds?.Amount, 2)}` : "0"}</td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{e?.totals?.colorstone?.Amount !== 0 ? `${formatAmount(e?.totals?.colorstone?.Amount, 2)}` : "0"}</td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{e?.MakingAmount !== 0 ? `${formatAmount(e?.MakingAmount, 2)}` : "0"}</td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{eleWiseOthrAmt !== 0 ? `${formatAmount(eleWiseOthrAmt, 2)}` : "0"}</td>
                    <td style={{ ...txtAtSta, ...fntSize }}>{e?.totals?.metal?.Amount !== 0 ? `${formatAmount(e?.totals?.metal?.Amount, 2)}` : "0"}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </>
        : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>}
    </>
  )
}

export default Excel1Quote;