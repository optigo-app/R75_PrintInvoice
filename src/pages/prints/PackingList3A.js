// http://localhost:3000/?tkn=OTA2NTQ3MTcwMDUzNTY1MQ==&invn=U0sxOTk5MjAyNA==&evn=c2FsZSByZXR1cm4=&pnm=cGFja2luZyBsaXN0IDNh&up=aHR0cDovL3plbi9qby9hcGktbGliL0FwcC9TYWxlQmlsbF9Kc29u&ctv=NzE=&ifid=PackingList3&pid=undefined
import React, { useEffect, useState } from "react";
import "../../assets/css/prints/PackingList3A.scss";
import {
  apiCall,
  formatAmount,
  handleImageError,
  isObjectEmpty,
  NumberWithCommas,
} from "../../GlobalFunctions";
import { OrganizeInvoicePrintData } from "../../GlobalFunctions/OrganizeInvoicePrintData";
import Loader from "../../components/Loader";
import { cloneDeep } from "lodash";
import { MetalShapeNameWiseArr } from "../../GlobalFunctions/MetalShapeNameWiseArr";

function PackingList3A({ token, invoiceNo, printName, urls, evn, ApiVer }) {
  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const [isImageWorking, setIsImageWorking] = useState(true);
  const [total, setTotal] = useState([]);
  const [headerData, setHeaderData] = useState({});
  const [brokarage, setBrokarage] = useState([]);
  const [discount, setDiscount] = useState(0);
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
          setMsg(data?.Message);
        }
      } catch (error) {
        console.error(error);
      }
    };
    sendData();
  }, []);

  const loadData = (data) => {
    setHeaderData(data?.BillPrint_Json[0]);

    let Discount = data?.BillPrint_Json1.reduce(
      (sum, item) => sum + item.DiscountAmt,
      0
    );
    setDiscount(Discount);

    let address = data?.BillPrint_Json[0]?.Printlable?.split("\r\n");
    data.BillPrint_Json[0].address = address;

    const datas = OrganizeInvoicePrintData(
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

    datas.header.PrintRemark = datas.header.PrintRemark?.replace(
      /<br\s*\/?>/gi,
      ""
    );

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

          finalArr[find_record].diamonds = [
            ...finalArr[find_record]?.diamonds,
            ...b?.diamonds,
          ]?.flat();
          finalArr[find_record].colorstone = [
            ...finalArr[find_record]?.colorstone,
            ...b?.colorstone,
          ]?.flat();
          finalArr[find_record].metal = [
            ...finalArr[find_record]?.metal,
            ...b?.metal,
          ]?.flat();
          finalArr[find_record].misc = [
            ...finalArr[find_record]?.misc,
            ...b?.misc,
          ]?.flat();
          finalArr[find_record].misc_0List = [
            ...finalArr[find_record]?.misc_0List,
            ...b?.misc_0List,
          ]?.flat();
          finalArr[find_record].finding = [
            ...finalArr[find_record]?.finding,
            ...b?.finding,
          ]?.flat();
          finalArr[find_record].other_details_array = [
            ...finalArr[find_record]?.other_details_array,
            ...b?.other_details_array,
          ]?.flat();

          finalArr[find_record].other_details_array_amount +=
            b?.other_details_array_amount;

          finalArr[find_record].totals.diamonds.Wt += b?.totals?.diamonds?.Wt;
          finalArr[find_record].totals.diamonds.Pcs += b?.totals?.diamonds?.Pcs;
          finalArr[find_record].totals.diamonds.Amount +=
            b?.totals?.diamonds?.Amount;
          finalArr[find_record].totals.diamonds.SettingAmount +=
            b?.totals?.diamonds?.SettingAmount;

          finalArr[find_record].totals.finding.Wt += b?.totals?.finding?.Wt;
          finalArr[find_record].totals.finding.Rate = b?.totals?.finding?.Rate;
          finalArr[find_record].totals.finding.Pcs += b?.totals?.finding?.Pcs;
          finalArr[find_record].totals.finding.Amount +=
            b?.totals?.finding?.Amount;
          finalArr[find_record].totals.finding.SettingAmount +=
            b?.totals?.finding?.SettingAmount;

          finalArr[find_record].totals.colorstone.Wt +=
            b?.totals?.colorstone?.Wt;
          finalArr[find_record].totals.colorstone.Pcs +=
            b?.totals?.colorstone?.Pcs;
          finalArr[find_record].totals.colorstone.Amount +=
            b?.totals?.colorstone?.Amount;
          finalArr[find_record].totals.colorstone.SettingAmount +=
            b?.totals?.colorstone?.SettingAmount;

          finalArr[find_record].totals.misc.Wt += b?.totals?.misc?.Wt;
          finalArr[find_record].totals.misc.Pcs += b?.totals?.misc?.Pcs;
          finalArr[find_record].totals.misc.Amount += b?.totals?.misc?.Amount;
          finalArr[find_record].totals.misc.SettingAmount +=
            b?.totals?.misc?.SettingAmount;

          finalArr[find_record].totals.misc.IsHSCODE_0_amount +=
            b?.totals?.misc?.IsHSCODE_0_amount;
          finalArr[find_record].totals.misc.IsHSCODE_0_pcs +=
            b?.totals?.misc?.IsHSCODE_0_pcs;
          finalArr[find_record].totals.misc.IsHSCODE_0_wt +=
            b?.totals?.misc?.IsHSCODE_0_wt;

          finalArr[find_record].totals.metal.Amount += b?.totals?.metal?.Amount;
          finalArr[find_record].totals.metal.Wt += b?.totals?.metal?.Wt;
          finalArr[find_record].totals.metal.Pcs += b?.totals?.metal?.Pcs;

          finalArr[find_record].totals.metal.IsNotPrimaryMetalAmount +=
            b?.totals?.metal?.IsNotPrimaryMetalAmount;
          finalArr[find_record].totals.metal.IsNotPrimaryMetalPcs +=
            b?.totals?.metal?.IsNotPrimaryMetalPcs;
          finalArr[find_record].totals.metal.IsNotPrimaryMetalSettingAmount +=
            b?.totals?.metal?.IsNotPrimaryMetalSettingAmount;
          finalArr[find_record].totals.metal.IsNotPrimaryMetalWt +=
            b?.totals?.metal?.IsNotPrimaryMetalWt;

          finalArr[find_record].totals.metal.IsPrimaryMetalAmount +=
            b?.totals?.metal?.IsPrimaryMetalAmount;
          finalArr[find_record].totals.metal.IsPrimaryMetalPcs +=
            b?.totals?.metal?.IsPrimaryMetalPcs;
          finalArr[find_record].totals.metal.IsPrimaryMetalSettingAmount +=
            b?.totals?.metal?.IsPrimaryMetalSettingAmount;
          finalArr[find_record].totals.metal.IsPrimaryMetalWt +=
            b?.totals?.metal?.IsPrimaryMetalWt;
        }
      }
    });

    datas.resultArray = finalArr;

    let darr = [];
    let darr2 = [];
    let darr3 = [];
    let darr4 = [];

    //after groupjob
    datas?.resultArray?.forEach((e) => {
      let dia2 = [];

      e?.diamonds?.forEach((el) => {
        let findrec = dia2?.findIndex(
          (a) =>
            a?.ShapeName === el?.ShapeName &&
            a?.QualityName === el?.QualityName &&
            a?.Colorname === el?.Colorname &&
            a?.SizeName === el?.SizeName &&
            a?.Rate === el?.Rate
        );
        let ell = cloneDeep(el);
        if (findrec === -1) {
          dia2.push(ell);
        } else {
          dia2[findrec].Wt += ell?.Wt;
          dia2[findrec].Pcs += ell?.Pcs;
          dia2[findrec].Amount += ell?.Amount;
          dia2[findrec].Rate += ell?.Rate;
        }
      });
      e.diamonds = dia2;

      //diamond
      let clr2 = [];

      e?.colorstone?.forEach((el) => {
        let findrec = clr2?.findIndex(
          (a) =>
            a?.ShapeName === el?.ShapeName &&
            a?.QualityName === el?.QualityName &&
            a?.Colorname === el?.Colorname &&
            a?.SizeName === el?.SizeName &&
            a?.Rate === el?.Rate &&
            a?.isRateOnPcs === el?.isRateOnPcs
        );
        let ell = cloneDeep(el);
        if (findrec === -1) {
          clr2.push(ell);
        } else {
          clr2[findrec].Wt += ell?.Wt;
          clr2[findrec].Pcs += ell?.Pcs;
          clr2[findrec].Amount += ell?.Amount;
          clr2[findrec].Rate += ell?.Rate;
        }
      });
      e.colorstone = clr2;

      //misc
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

    // datas?.resultArray?.forEach((e) => {
    //   let met2 = [];
    //   e?.metal?.forEach((a) => {
    //     if (e?.GroupJob !== "") {
    //       let obj = { ...a };
    //       obj.GroupJob = e?.GroupJob;
    //       met2?.push(obj);
    //     }
    //   });

    //   let met3 = [];
    //   met2?.forEach((a) => {
    //     let findrec = met3?.findIndex(
    //       (el) => el?.StockBarcode === el?.GroupJob
    //     );
    //     if (findrec === -1) {
    //       met3?.push(a);
    //     } else {
    //       met3[findrec].Wt += a?.Wt;
    //     }
    //   });

    //   if (e?.GroupJob === "") {
    //     return;
    //   } else {
    //     e.metal = met3;
    //   }
    // });

    datas?.json2?.forEach((el) => {
      if (el?.MasterManagement_DiamondStoneTypeid === 1) {
        if (el?.ShapeName?.toLowerCase() === "rnd") {
          darr.push(el);
        } else {
          darr2.push(el);
        }
      }
    });

    setResult(datas);
    darr?.forEach((a) => {
      let aobj = cloneDeep(a);
      let findrec = darr3?.findIndex(
        (al) =>
          al?.ShapeName === aobj?.ShapeName &&
          al?.Colorname === aobj?.Colorname &&
          al?.QualityName === aobj?.QualityName
      );
      if (findrec === -1) {
        darr3.push(aobj);
      } else {
        darr3[findrec].Wt += a?.Wt;
        darr3[findrec].Pcs += a?.Pcs;
      }
    });

    let obj_ = {
      ShapeName: "OTHERS",
      QualityName: "",
      Colorname: "",
      Wt: 0,
      Pcs: 0,
    };
    darr2?.forEach((a) => {
      obj_.Wt += a?.Wt;
      obj_.Pcs += a?.Pcs;
    });
    darr4 = [...darr3, obj_];

    // setDiamondArr(darr4);

    // let met_shp_arr = MetalShapeNameWiseArr(datas?.json2);
    // setMetShpWise(met_shp_arr);
    // let tot_met = 0;
    // let tot_met_wt = 0;
    // met_shp_arr?.forEach((e, i) => {
    //   tot_met += e?.Amount;
    //   tot_met_wt += e?.metalfinewt;
    // });
    // setNotGoldMetalTotal(tot_met);
    // setNotGoldMetalWtTotal(tot_met_wt);

    let brokr = data?.BillPrint_Json[0]?.Brokerage.split("@-@");
    brokr = brokr.map((ele) => ele?.split("#-#"));
    setBrokarage(brokr);
  };

  const handleImageErrors = () => {
    setIsImageWorking(false);
  };

  console.log("result", result);
  return (
    <div className="packList_3a_main">
      {loader ? (
        <Loader />
      ) : (
        <>
          {msg === "" ? (
            <div className="packingListDemo_main_App">
              <div
                className="paking_top_button_none"
                style={{
                  marginBlock: "20px",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  className="btn_white blue"
                  id="printbtn"
                  accessKey="p"
                  onClick={() => window.print()}
                >
                  Print
                </button>
              </div>

              <div className="packing_list7_main_header">
                <p style={{ margin: "0px", color: "white" }}>
                  {result?.header?.PrintHeadLabel == ""
                    ? "PRODUCT DETAIL SHEET"
                    : result?.header?.PrintHeadLabel}
                </p>
              </div>

              <div className="paking_list3_header_main">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <p
                      className="topBox_px_B"
                      style={{
                        display: "flex",
                        paddingBlock: "2px",
                        fontSize: "16px",
                      }}
                    >
                      <b>{result?.header?.CompanyFullName}</b>
                    </p>
                    <p style={{ display: "flex" }}>
                      {result?.header?.CompanyAddress}
                    </p>
                    <p style={{ display: "flex" }}>
                      {result?.header?.CompanyAddress2}
                    </p>
                    <p style={{ display: "flex" }}>
                      {result?.header?.customercity1}-
                      {result?.header?.CompanyPinCode},
                      {result?.header?.CompanyState}(
                      {result?.header?.CompanyCountry})
                    </p>
                    <p style={{ display: "flex" }}>
                      T {result?.header?.CompanyTellNo}
                    </p>
                    <p style={{ display: "flex" }}>
                      {result?.header?.CompanyEmail} |{" "}
                      {result?.header?.CompanyWebsite}
                    </p>
                    <p style={{ display: "flex" }}>
                      {result?.header?.Company_VAT_GST_No &&
                        `${result?.header?.Company_VAT_GST_No} | `}
                      {result?.header?.Company_CST_STATE_No &&
                        `${result?.header?.Company_CST_STATE_No} - `}
                      {result?.header?.Com_pannumber &&
                        `PAN- ${result?.header?.Com_pannumber}`}
                    </p>
                  </div>
                  <div>
                    {isImageWorking && (
                      <img
                        src={result?.header?.PrintLogo}
                        style={{
                          width: "100%",
                          maxWidth: "120px",
                          objectFit: "contain",
                        }}
                        onError={handleImageErrors}
                      />
                    )}
                  </div>
                </div>

                <div
                  className="paking_3a_top_addressbox"
                  style={{ marginTop: "10px" }}
                >
                  <div className="paking3a_topBox1">
                    <p className="topBox_p">Bill To,</p>
                    <p className="topBox_p topBox_px_B">
                      <b>{result?.header?.customerfirmname}</b>
                    </p>
                    <p className="topBox_p">
                      {" "}
                      {result?.header?.customerAddress1}{" "}
                    </p>
                    <p className="topBox_p">
                      {" "}
                      {result?.header?.customerAddress2}{" "}
                    </p>
                    <p className="topBox_p">
                      {result?.header?.customerAddress3}
                    </p>
                    {/* <p className="topBox_p">
                      {result?.header?.customerAddress2}
                    </p> */}
                    <p className="topBox_p">
                      {result?.header?.customercity}-{result?.header?.PinCode}
                    </p>
                    <p className="topBox_p">{result?.header?.customeremail1}</p>
                    <p className="topBox_p">{result?.header?.vat_cst_pan}</p>
                    <p className="topBox_p">
                      {result?.header?.Cust_CST_STATE}-
                      {result?.header?.Cust_CST_STATE_No}
                    </p>
                  </div>
                  <div className="paking3a_topBox2">
                    <p className="topBox_p"> Ship To,</p>
                    <p className="topBox_p topBox_px_B">
                      <b>{result?.header?.customerfirmname}</b>
                    </p>
                    {result?.header?.address?.map((line, index) => (
                      <React.Fragment key={index}>
                        <p className="topBox_p">{line}</p>
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="paking3a_topBox3">
                    <p className="topBox_p">
                      <b style={{ width: "100px", display: "flex" }}>BILL NO</b>{" "}
                      {result?.header?.InvoiceNo}
                    </p>
                    <p className="topBox_p">
                      {" "}
                      <b style={{ width: "100px", display: "flex" }}>DATE </b>
                      {result?.header?.EntryDate}
                    </p>
                    <p className="topBox_p">
                      <b style={{ width: "100px", display: "flex" }}>
                        {" "}
                        {result?.header?.HSN_No_Label}{" "}
                      </b>
                      {result?.header?.HSN_No}
                    </p>
                  </div>
                </div>
              </div>

              <div className="paking3a_TableView_main_div">
                <div className="paking3a_second_box_top_title">
                  <div className="paking3a_col1">
                    <p className="paking3a_second_box_Title">Sr</p>
                  </div>
                  <div className="paking3a_col2">
                    <p className="paking3a_second_box_Title">Design</p>
                  </div>
                  <div className="paking3a_col3">
                    <div>
                      <p className="paking3a_second_box_Title_withSub">
                        Diamond
                      </p>
                    </div>
                    <div className="paking3a_col3_sub_div">
                      <p className="paking3a_col3_sub_div_more_sub1"> Code</p>
                      <p className="paking3a_col3_sub_div_more_sub2">Size</p>
                      <p className="paking3a_col3_sub_div_more_sub3">Pcs</p>
                      <p className="paking3a_col3_sub_div_more_sub4">Wt</p>
                      <p className="paking3a_col3_sub_div_more_sub5">Rate</p>
                      <p className="paking3a_col3_sub_div_more_sub6">Amount</p>
                    </div>
                  </div>
                  <div className="paking3a_col4">
                    <div>
                      <p className="paking3a_second_box_Title_withSub">Metal</p>
                    </div>
                    <div className="paking3a_col4_sub_div">
                      <p className="paking3a_col4_sub_div_p"> Quality</p>
                      <p className="paking3a_col4_sub_div_p">Gwt</p>
                      <p className="paking3a_col4_sub_div_p">Net Wt</p>
                      <p className="paking3a_col4_sub_div_p">Rate</p>
                      <p className="paking3a_col4_sub_div_p_last">Amount</p>
                    </div>
                  </div>
                  <div className="paking3a_col5">
                    <div>
                      <p className="paking3a_second_box_Title_withSub">
                        Stone & Misc
                      </p>
                    </div>
                    <div className="paking3a_col3_sub_div">
                      <p className="paking3a_col3_sub_div_more_sub1"> Code</p>
                      <p className="paking3a_col3_sub_div_more_sub2">Size</p>
                      <p className="paking3a_col3_sub_div_more_sub3">Pcs</p>
                      <p className="paking3a_col3_sub_div_more_sub4">Wt</p>
                      <p className="paking3a_col3_sub_div_more_sub5">Rate</p>
                      <p className="paking3a_col3_sub_div_more_sub6">Amount</p>
                    </div>
                  </div>
                  <div className="paking3a_col6">
                    <div>
                      <p className="paking3a_second_box_Title_withSub">
                        Labour & Other Charges
                      </p>
                    </div>
                    <div className="paking3a_col6_sub_div">
                      <p className="paking3a_col6_sub_div_p">Charges</p>
                      <p className="paking3a_col6_sub_div_p">Rate</p>
                      <p className="paking3a_col6_sub_div_p_last">Amount</p>
                    </div>
                  </div>
                  <div className="paking3a_col7">
                    <p className="paking3a_second_box_Title">Total Amount</p>
                  </div>
                </div>

                <div>
                  {result?.resultArray?.map((data, ind) => {
                    return (
                      <div className="paking3a_table_Data_box">
                        <div className="paking3a_tabledata_col1">
                          <p className="paking3a_second_box_Title">{ind + 1}</p>
                        </div>
                        <div className="paking3a_tabledata_col2">
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              width: "100%",
                            }}
                          >
                            <div>{data?.designno}</div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <p>
                                {data?.GroupJob != ""
                                  ? data?.GroupJob
                                  : data?.SrJobno}
                              </p>
                              <p>{data?.MetalColor}</p>
                            </div>
                          </div>
                          <div>
                            <img
                              src={data?.DesignImage}
                              style={{
                                height: "75px",
                                width: "75px",
                                objectFit: "contain",
                              }}
                              onError={handleImageError}
                              className="paking3a_design_img"
                            />
                          </div>
                          <div>
                            {data?.CertificateNo && (
                              <>
                                Certificate# : <b>{data?.CertificateNo}</b>
                              </>
                            )}
                          </div>
                          <div>
                            HUID : <b>{data?.HUID}</b>
                            <br />
                            <b> PO:- {data?.PO}</b>
                            <br />
                            Tunch: <b>{data?.Tunch?.toFixed(3)}</b>
                            <br />
                            <b> {data?.grosswt?.toFixed(3)} gm</b> Gross
                          </div>
                          <div>
                            {data?.Size && (
                              <>
                                Size# : <b>{data?.Size}</b>
                              </>
                            )}
                          </div>
                        </div>
                        <div
                          className="paking3a_tabledata_col3"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                          }}
                        >
                          <div>
                            {data?.diamonds?.map((e, i) => {
                              return (
                                <div className="paking3a_col3_sub_div" key={i}>
                                  <p
                                    className="paking3a_col3_sub_div_more_sub1"
                                    style={{ lineHeight: "11px" }}
                                  >
                                    {e?.ShapeName} {e?.QualityName}{" "}
                                    {e?.Colorname}
                                  </p>
                                  <p
                                    className="paking3a_col3_sub_div_more_sub2"
                                    style={{
                                      display: "flex",
                                      justifyContent: "flex-start",
                                    }}
                                  >
                                    {e?.SizeName}
                                  </p>
                                  <p
                                    className="paking3a_col3_sub_div_more_sub3"
                                    style={{
                                      display: "flex",
                                      justifyContent: "flex-end",
                                    }}
                                  >
                                    {e?.Pcs}
                                  </p>
                                  <p className="paking3a_col3_sub_div_more_sub4">
                                    {e?.Wt?.toFixed(3)}
                                  </p>
                                  <p className="paking3a_col3_sub_div_more_sub5">
                                    {e?.Rate?.toFixed(2)}
                                  </p>
                                  <p
                                    className="paking3a_col3_sub_div_more_sub6"
                                    style={{
                                      display: "flex",
                                      justifyContent: "flex-end",
                                    }}
                                  >
                                    <b>
                                      {(
                                        e?.Amount /
                                        result?.header?.CurrencyExchRate
                                      )?.toFixed(2)}
                                    </b>
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                          <div
                            className="paking3a_col3_sub_div_totalValue"
                            style={{
                              borderTop: "1px solid #bdbdbd",
                              paddingInline: "2px",
                            }}
                          >
                            <p className="paking3a_col3_sub_div_more_sub1"></p>
                            <p className="paking3a_col3_sub_div_more_sub2"></p>
                            <p
                              className="paking3a_col3_sub_div_more_sub3"
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                              }}
                            >
                              <b>{data?.totals?.diamonds?.Pcs}</b>
                            </p>
                            <p
                              className="paking3a_col3_sub_div_more_sub4"
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                width: "18%",
                              }}
                            >
                              <b> {data?.totals?.diamonds?.Wt?.toFixed(3)}</b>
                            </p>
                            <p
                              className="paking3a_col3_sub_div_more_sub6"
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                              }}
                            >
                              <b>
                                {(
                                  data?.totals?.diamonds?.Amount /
                                  result?.header?.CurrencyExchRate
                                )?.toFixed(2)}
                              </b>
                            </p>
                          </div>
                        </div>
                        <div className="paking3a_tabledata_col4">
                          {/* <div className="paking3a_col4_sub_div">
                            <p className="paking3a_col4_sub_div_finalValus" style={{display: 'flex', justifyContent: 'flex-start'}}>
                              {data?.MetalType}
                              {" "}
                              {data?.MetalPurity}
                            </p>
                            <p className="paking3a_col4_sub_div_finalValus">
                              {(data?.grosswt)?.toFixed(3)}
                            </p>
                            <p className="paking3a_col4_sub_div_finalValus">
                              {(data?.NetWt)?.toFixed(3)}
                            </p>
                            <p className="paking3a_col4_sub_div_finalValus">
                              {(data?.metal_rate)?.toFixed(2)}
                            </p>
                            <p className="paking3a_col4_sub_div_finalValus_amount" style={{width: '20%', display: 'flex', justifyContent: 'flex-end'}}>
                              <b> {data?.MetalAmount}</b>
                            </p>
                          </div> */}
                          <div
                            style={{
                              width: "100%",
                            }}
                          >
                            {data?.metal?.map((data2, index) => {
                              return (
                                <div
                                  className="paking3a_col4_sub_div"
                                  key={index}
                                >
                                  <p
                                    className="paking3a_col4_sub_div_finalValus"
                                    style={{
                                      display: "flex",
                                      justifyContent: "flex-start",
                                      textAlign: "left",
                                    }}
                                  >
                                    {" "}
                                    {data2?.ShapeName} {data2?.QualityName}
                                  </p>
                                  <p className="paking3a_col4_sub_div_finalValus">
                                    {index == 0 && data?.grosswt?.toFixed(2)}
                                  </p>
                                  <p className="paking3a_col4_sub_div_finalValus">
                                    {/* {(data2?.Wt + data?.LossWt)?.toFixed(3)} */}
                                    {data2?.Wt?.toFixed(3)}
                                  </p>
                                  <p className="paking3a_col4_sub_div_finalValus">
                                    {data2?.Rate?.toFixed(2)}
                                  </p>
                                  <p
                                    className="paking3a_col4_sub_div_finalValus_amount"
                                    style={{
                                      display: "flex",
                                      justifyContent: "flex-end",
                                      width: "19%",
                                    }}
                                  >
                                    <b> {data2?.Amount?.toFixed(2)}</b>
                                  </p>
                                </div>
                              );
                            })}

                            {/* <div className="paking3a_col4_sub_div">
                              <p
                                className="paking3a_col4_sub_div_finalValus"
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-start",
                                }}
                              >
                                Loss
                              </p>
                              <p className="paking3a_col4_sub_div_finalValus">
                                {data?.LossPer?.toFixed(3)} %
                              </p>
                              <p className="paking3a_col4_sub_div_finalValus">
                                {data?.LossWt?.toFixed(3)}
                              </p>
                              <p className="paking3a_col4_sub_div_finalValus">
                                {data?.metal_rate}
                              </p>
                              <p
                                className="paking3a_col4_sub_div_finalValus_amount"
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                  width: "19%",
                                }}
                              >
                                <b>{data?.LossAmt?.toFixed(2)}</b>
                              </p>
                            </div> */}

                            {data?.JobRemark !== "" && (
                              <div
                                className=""
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "flex-start",
                                  marginTop: "20px",
                                }}
                              >
                                <p>Remark:</p>
                                <p className="fw-bold">{data?.JobRemark}</p>
                              </div>
                            )}
                          </div>
                          <div
                            className="paking3a_col4_sub_div_value"
                            style={{ borderTop: "1px solid #bdbdbd" }}
                          >
                            <p className="paking3a_col4_sub_div_finalValus_total1"></p>
                            <p
                              className="paking3a_col4_sub_div_finalValus_total2"
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                              }}
                            >
                              <b>{data?.grosswt?.toFixed(3)}</b>
                            </p>
                            <p
                              className="paking3a_col4_sub_div_finalValus_total3"
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                              }}
                            >
                              <b>{(data?.NetWt + data?.LossWt)?.toFixed(3)}</b>
                            </p>
                            <p
                              className="paking3a_col4_sub_div_finalValus_total4"
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                              }}
                            >
                              <b>{formatAmount(data?.totals?.metal?.Amount)}</b>
                            </p>
                          </div>
                        </div>
                        <div
                          className="paking3a_tabledata_col5"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                          }}
                        >
                          <div>
                            {data?.colorstone?.map((e, i) => {
                              return (
                                <div className="paking3a_col5_sub_div" key={i}>
                                  <p
                                    className="paking3a_col5_sub_div_finalValus"
                                    style={{
                                      display: "flex",
                                      justifyContent: "flex-start",
                                      textAlign: "left",
                                    }}
                                  >
                                    {e?.ShapeName +
                                      " " +
                                      e?.QualityName +
                                      " " +
                                      e?.Colorname}
                                  </p>
                                  <p className="paking3a_col5_sub_div_finalValus">
                                    {e?.SizeName}
                                  </p>
                                  <p className="paking3a_col5_sub_div_finalValus">
                                    {e?.Pcs}
                                  </p>
                                  <p className="paking3a_col5_sub_div_finalValus">
                                    {(e?.Wt / 5)?.toFixed(3)}
                                  </p>
                                  <p className="paking3a_col5_sub_div_finalValus">
                                    {e?.Rate?.toFixed(2)}
                                  </p>
                                  <p
                                    className="paking3a_col5_sub_div_finalValus"
                                    style={{
                                      display: "flex",
                                      justifyContent: "flex-end",
                                    }}
                                  >
                                    <b>
                                      {(
                                        e?.Amount /
                                        result?.header?.CurrencyExchRate
                                      )?.toFixed(2)}
                                    </b>
                                  </p>
                                </div>
                              );
                            })}
                            {data?.misc?.map((e, i) => {
                              return (
                                <div className="paking3a_col5_sub_div" key={i}>
                                  <p
                                    className="paking3a_col5_sub_div_finalValus"
                                    style={{
                                      display: "flex",
                                      justifyContent: "flex-start",
                                    }}
                                  >
                                    M:{e?.ShapeName}
                                  </p>
                                  <p className="paking3a_col5_sub_div_finalValus">
                                    {e?.SizeName}
                                  </p>
                                  <p className="paking3a_col5_sub_div_finalValus">
                                    {e?.Pcs}
                                  </p>
                                  <p className="paking3a_col5_sub_div_finalValus">
                                    {e?.Wt.toFixed(3)}
                                  </p>
                                  <p className="paking3a_col5_sub_div_finalValus">
                                    {e?.Rate?.toFixed(2)}
                                  </p>
                                  <p
                                    className="paking3a_col5_sub_div_finalValus"
                                    style={{
                                      display: "flex",
                                      justifyContent: "flex-end",
                                    }}
                                  >
                                    <b>
                                      {(
                                        e?.Amount /
                                        result?.header?.CurrencyExchRate
                                      )?.toFixed(2)}
                                    </b>
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                          <div
                            className="paking3a_col5_sub_div"
                            style={{
                              backgroundColor: "#f5f5f5",
                              borderTop: "1px solid #bdbdbd",
                            }}
                          >
                            <p
                              className="paking3a_col5_sub_div_finalValus"
                              style={{ width: "20%" }}
                            ></p>
                            <p
                              className="paking3a_col5_sub_div_finalValus"
                              style={{ width: "17%" }}
                            ></p>
                            <p
                              className="paking3a_col5_sub_div_finalValus"
                              style={{
                                width: "12%",
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <b>
                                {data?.totals?.colorstone?.Pcs +
                                  data?.totals?.misc?.Pcs}
                              </b>
                            </p>
                            <p
                              className="paking3a_col5_sub_div_finalValus"
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                width: "14%",
                              }}
                            >
                              <b>
                                {" "}
                                {/* {(
                                  data?.totals?.colorstone?.Wt +
                                  data?.totals?.misc?.Wt
                                )?.toFixed(3)} */}
                                {data?.totals?.misc?.IsHSCODE_0_wt +
                                  data?.totals?.colorstone?.Wt !==
                                  0 &&
                                  (
                                    data?.totals?.colorstone?.Wt +
                                    data?.totals?.misc?.IsHSCODE_0_wt
                                  )?.toFixed(3)}
                              </b>
                            </p>
                            <p
                              className="paking3a_col5_sub_div_finalValus"
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                width: "37%",
                              }}
                            >
                              <b>
                                {(
                                  (data?.totals?.colorstone?.Amount +
                                    data?.totals?.misc?.Amount) /
                                  result?.header?.CurrencyExchRate
                                )?.toFixed(2)}
                              </b>
                            </p>
                          </div>
                        </div>
                        <div
                          className="paking3a_tabledata_col6"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                          }}
                        >
                          <div>
                            <div className="paking3a_col6_sub_div">
                              <div className="d-flex justify-content-between w-100">
                                <p className="paking3a_col6_sub_div_finalValus text-left">
                                  Labour
                                </p>
                                <p className="paking3a_col6_sub_div_finalValus text-right">
                                  {data?.MaKingCharge_Unit?.toFixed(2)}
                                </p>
                                <p className="paking3a_col6_sub_div_finalValus text-right">
                                  {data?.MakingAmount?.toFixed(2)}
                                </p>
                              </div>
                            </div>

                            <div className="paking3a_col6_sub_div_otherDetails">
                              {(() => {
                                const mergedData =
                                  data?.other_details_array?.reduce(
                                    (acc, ele) => {
                                      const existing = acc.find(
                                        (item) => item.label === ele.label
                                      );

                                      if (existing) {
                                        existing.value = (
                                          parseFloat(existing.value) +
                                          parseFloat(ele.value)
                                        ).toFixed(2); // Merge values
                                      } else {
                                        acc.push({
                                          ...ele,
                                          value: parseFloat(ele.value).toFixed(
                                            2
                                          ),
                                        }); // Ensure numeric format
                                      }

                                      return acc;
                                    },
                                    []
                                  );

                                return mergedData?.map((ele, ind) => (
                                  <div
                                    className="d-flex justify-content-between"
                                    key={ind}
                                  >
                                    <p className="pe-1 col-8 text-start">
                                      {ele?.label}
                                    </p>
                                    <p
                                      style={{ wordBreak: "break-all" }}
                                      className="col-4 text-end"
                                    >
                                      {NumberWithCommas(+ele?.value, 2)}
                                    </p>
                                  </div>
                                ));
                              })()}
                              <div className="d-flex justify-between">
                                <p>Setting</p>
                                <p>
                                  {formatAmount(
                                    (data?.totals?.diamonds?.SettingAmount +
                                      data?.totals?.colorstone?.SettingAmount) /
                                      result?.header?.CurrencyExchRate
                                  )}
                                </p>
                              </div>
                              {data?.TotalDiamondHandling != 0 && (
                                <div className="d-flex justify-between">
                                  <p>Handling</p>
                                  <p>{data?.TotalDiamondHandling}</p>
                                </div>
                              )}
                            </div>
                          </div>
                          <div
                            className="paking3a_col6_sub_div"
                            style={{
                              backgroundColor: "#f5f5f5",
                              borderTop: "1px solid #bdbdbd",
                            }}
                          >
                            <p className="paking3a_col6_totalData"></p>
                            <p className="paking3a_col6_totalData"></p>
                            <p
                              className="paking3a_col6_totalData"
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                              }}
                            >
                              {formatAmount(
                                data?.MakingAmount +
                                  data?.other_details_array_amount +
                                  data?.TotalDiamondHandling +
                                  data?.totals?.diamonds?.SettingAmount +
                                  data?.totals?.colorstone?.SettingAmount
                              )}
                            </p>
                          </div>
                        </div>
                        <div
                          className="paking3a_tabledata_col7"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                          }}
                        >
                          <p className="paking3a_second_box_Title paking3a_end">
                            {formatAmount(
                              data?.TotalAmount /
                                result?.header?.CurrencyExchRate
                            )}
                          </p>

                          <p
                            className="paking3a_second_box_Title paking3a_end"
                            style={{
                              backgroundColor: "#f5f5f5",
                              width: "100%",
                              borderTop: "1px solid #bdbdbd",
                            }}
                          >
                            {formatAmount(
                              data?.TotalAmount /
                                result?.header?.CurrencyExchRate
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div
                    className="paking3a_table_Data_box"
                    style={{ backgroundColor: "#f5f5f5" }}
                  >
                    <div className="paking3a_tabledata_col1"></div>
                    <div className="paking3a_tabledata_col2">
                      <b>Total</b>
                    </div>
                    <div className="paking3a_tabledata_col3">
                      <div className="paking3a_col3_sub_div_mainTotal">
                        <p className="paking3a_col3_sub_div_mainTotal_sub1"></p>
                        <p className="paking3a_col3_sub_div_mainTotal_sub2"></p>
                        <p
                          className="paking3a_col3_sub_div_mainTotal_sub3"
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <b>{result?.mainTotal?.diamonds?.Pcs}</b>
                        </p>
                        <p className="paking3a_col3_sub_div_mainTotal_sub4">
                          {" "}
                          <b> {result?.mainTotal?.diamonds?.Wt?.toFixed(3)}</b>
                        </p>
                        <p
                          className="paking3a_col3_sub_div_mainTotal_sub6"
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <b>
                            {" "}
                            {(
                              result?.mainTotal?.diamonds?.Amount /
                              result?.header?.CurrencyExchRate
                            )?.toFixed(2)}
                          </b>
                        </p>
                      </div>
                    </div>
                    <div className="paking3a_tabledata_col4">
                      <div className="paking3a_col4_sub_div">
                        <p className="paking3a_col4_sub_div_finalValus_total1"></p>
                        <p
                          className="paking3a_col4_sub_div_finalValus_total2"
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <b>{result?.mainTotal?.grosswt?.toFixed(3)}</b>
                        </p>
                        <p
                          className="paking3a_col4_sub_div_finalValus_total3"
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <b>
                            {(
                              result?.mainTotal?.NetWt +
                              result?.mainTotal?.LossWt
                            )?.toFixed(3)}
                          </b>
                        </p>
                        <p
                          className="paking3a_col4_sub_div_finalValus_total4"
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <b>
                            {" "}
                            {formatAmount(
                              result?.mainTotal?.metal?.Amount /
                                result?.header?.CurrencyExchRate
                            )}
                          </b>
                        </p>
                      </div>
                    </div>
                    <div className="paking3a_tabledata_col5">
                      <div className="paking3a_col5_sub_div">
                        <p
                          className="paking3a_col3_sub_div_more_sub1"
                          style={{ width: "20%" }}
                        ></p>
                        <p
                          className="paking3a_col3_sub_div_more_sub2"
                          style={{ width: "17%" }}
                        ></p>
                        <p
                          className="paking3a_col3_sub_div_more_sub3"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            width: "12%",
                          }}
                        >
                          <b>
                            {result?.mainTotal?.colorstone?.Pcs +
                              result?.mainTotal?.misc?.Pcs}
                          </b>
                        </p>
                        <p
                          className="paking3a_col3_sub_div_more_sub4"
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            width: "14%",
                          }}
                        >
                          <b>
                            {" "}
                            {result?.mainTotal?.colorstone?.Wt?.toFixed(3)}
                          </b>
                        </p>
                        <p
                          className="paking3a_col3_sub_div_more_sub6"
                          style={{
                            width: "37%",
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <b>
                            {" "}
                            {(
                              (result?.mainTotal?.colorstone?.Amount +
                                result?.mainTotal?.misc?.Amount) /
                              result?.header?.CurrencyExchRate
                            )?.toFixed(2)}
                          </b>
                        </p>
                      </div>
                    </div>
                    <div className="paking3a_col6">
                      <div className="paking3a_col6_sub_div">
                        {/* <p className="paking3a_col6_sub_div_p"></p>
                              <p className="paking3a_col6_sub_div_p"></p> */}
                        <p
                          className="paking3a_col6_sub_div_p_last"
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          {formatAmount(
                            result?.mainTotal?.MakingAmount /
                              result?.header?.CurrencyExchRate
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="paking3a_col7">
                      <p className="paking3a_second_box_Title paking3a_end">
                        {formatAmount(
                          (result?.mainTotal?.TotalAmount + discount) /
                            result?.header?.CurrencyExchRate
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                  className="paking3a_total_avoid"
                >
                  <div>
                    {discount !== 0 && (
                      <div className="paking3a_total_div">
                        <p>Total Discount</p>
                        {formatAmount(discount)}
                      </div>
                    )}
                    <div className="paking3a_total_div">
                      <p>Total Amount</p>
                      {formatAmount(
                        result?.mainTotal?.TotalAmount /
                          result?.header?.CurrencyExchRate
                      )}
                    </div>
                    {result?.allTaxes?.map((data, index) => {
                      return (
                        <>
                          {data?.amountInNumber !== 0 && (
                            <div className="paking3a_total_div" key={index}>
                              <p>
                                {data?.name} @ {data?.per}
                              </p>
                              {data?.amountInNumber?.toFixed(2)}
                            </div>
                          )}
                        </>
                      );
                    })}
                    <div className="paking3a_total_div">
                      <p>{result?.header?.AddLess >= 0 ? "Add" : "Less"}</p>
                      {formatAmount(result?.header?.AddLess)}
                    </div>
                    <div className="paking3a_total_div">
                      <p>{result?.header?.ModeOfDel}</p>
                      {result?.header?.FreightCharges?.toFixed(2)}
                    </div>
                    <div className="paking3a_total_div">
                      <p>
                        <b>Final Amount</b>
                      </p>
                      <b>
                        {" "}
                        {formatAmount(
                          (result?.mainTotal?.TotalAmount +
                            result?.header?.AddLess +
                            result?.header?.FreightCharges +
                            result?.allTaxesTotal) /
                            result?.header?.CurrencyExchRate
                        )}
                      </b>
                    </div>
                  </div>
                </div>
              </div>

              <div className="paking3a__bottomSection_main">
                <div className="paking3a__bottomSection_Box1">
                  <div className="paking3a__bottomSection_Box1_subBox1">
                    <div>
                      <p
                        style={{
                          backgroundColor: "#f1f1f1",
                          borderBottom: "1px solid #bdbdbd",
                        }}
                      >
                        <b>SUMMARY</b>
                      </p>
                    </div>
                    <div style={{ display: "flex" }}>
                      <div
                        style={{
                          width: "50%",
                          borderRight: "1px solid #bdbdbd",
                          padding: "3px",
                        }}
                      >
                        <div className="paking3a__bottomSection_Box1_subBox1_summury">
                          <p>
                            <b>GOLD IN 24KT </b>
                          </p>
                          <p>{result?.mainTotal?.PureNetWt} gm</p>
                        </div>
                        <div className="paking3a__bottomSection_Box1_subBox1_summury">
                          <p>
                            <b>SILVER</b>
                          </p>
                          <p>
                            {/* {result?.resultArray?.map((j1, i) => {
                                            return (
                                                <div>{(j1?.NetWt + j1?.LossWt).toFixed(3)}</div>
                                            )
                                        })} */}
                            {result?.mainTotal?.PureNetWt} gm
                          </p>
                        </div>
                        <div className="paking3a__bottomSection_Box1_subBox1_summury">
                          <p>
                            <b>GROSS WT</b>
                          </p>
                          <p>{result?.mainTotal?.grosswt?.toFixed(3)} gm</p>
                        </div>
                        <div className="paking3a__bottomSection_Box1_subBox1_summury">
                          <p>
                            <b>NET WT</b>
                          </p>
                          <p>
                            {(
                              result?.mainTotal?.NetWt +
                              result?.mainTotal?.LossWt
                            )?.toFixed(3)}{" "}
                            gm
                          </p>
                        </div>
                        <div className="paking3a__bottomSection_Box1_subBox1_summury">
                          <p>
                            <b>LOSSS WT</b>
                          </p>
                          <p>{result?.mainTotal?.LossWt?.toFixed(3)} gm</p>
                        </div>
                        <div className="paking3a__bottomSection_Box1_subBox1_summury">
                          <p>
                            <b>DIAMOND WT</b>
                          </p>
                          <p>
                            {result?.mainTotal?.diamonds?.Pcs} /{" "}
                            {result?.mainTotal?.diamonds?.Wt?.toFixed(3)} cts
                          </p>
                        </div>
                        <div className="paking3a__bottomSection_Box1_subBox1_summury">
                          <p>
                            <b>STONE WT</b>
                          </p>
                          <p>
                            {result?.mainTotal?.colorstone?.Pcs} /{" "}
                            {result?.mainTotal?.colorstone?.Wt?.toFixed(3)} gm
                          </p>
                        </div>
                        <div className="paking3a__bottomSection_Box1_subBox1_summury">
                          <p>
                            <b>MISC WT</b>
                          </p>
                          <p>
                            {result?.mainTotal?.misc?.IsHSCODE_0_pcs} /{" "}
                            {result?.mainTotal?.misc?.Wt?.toFixed(3)} gm
                          </p>
                        </div>
                      </div>

                      <div
                        style={{
                          width: "50%",
                          padding: "3px",
                        }}
                      >
                        <div className="paking3a__bottomSection_Box1_subBox1_summury">
                          <p>
                            <b>GOLD </b>
                          </p>
                          <p>
                            {formatAmount(
                              result?.mainTotal?.MetalAmount /
                                result?.header?.CurrencyExchRate
                            )}
                          </p>
                        </div>
                        <div className="paking3a__bottomSection_Box1_subBox1_summury">
                          <p>
                            <b>SILVER</b>
                          </p>
                          <p>{total[1]?.amount?.toFixed(2)}</p>
                        </div>
                        <div className="paking3a__bottomSection_Box1_subBox1_summury">
                          <p>
                            <b>DIAMOND</b>
                          </p>
                          <p>
                            {" "}
                            {formatAmount(
                              result?.mainTotal?.diamonds?.Amount /
                                result?.header?.CurrencyExchRate
                            )}
                          </p>
                        </div>
                        <div className="paking3a__bottomSection_Box1_subBox1_summury">
                          <p>
                            <b>CST</b>
                          </p>
                          <p>
                            {formatAmount(
                              result?.mainTotal?.colorstone?.Amount /
                                result?.header?.CurrencyExchRate
                            )}
                          </p>
                        </div>
                        <div className="paking3a__bottomSection_Box1_subBox1_summury">
                          <p>
                            <b>MISC</b>
                          </p>
                          <p>
                            {formatAmount(
                              result?.mainTotal?.misc?.IsHSCODE_0_amount /
                                result?.header?.CurrencyExchRate
                            )}
                          </p>
                        </div>
                        <div className="paking3a__bottomSection_Box1_subBox1_summury">
                          <p>
                            <b>MAKING</b>
                          </p>
                          <p>
                            {formatAmount(
                              (result?.mainTotal?.MakingAmount +
                                result?.mainTotal?.diamonds?.SettingAmount +
                                result?.mainTotal?.colorstone?.SettingAmount) /
                                result?.header?.CurrencyExchRate
                            )}
                          </p>
                        </div>
                        <div className="paking3a__bottomSection_Box1_subBox1_summury">
                          <p>
                            <b>OTHER</b>
                          </p>
                          <p>
                            {formatAmount(
                              result?.mainTotal?.misc?.IsHSCODE_3_amount
                            )}
                          </p>
                          {/* <p>{formatAmount(result?.mainTotal?.OtherCharges)}</p> */}
                        </div>
                        <div className="paking3a__bottomSection_Box1_subBox1_summury">
                          <p>
                            <b>
                              {result?.header?.AddLess >= 0 ? "ADD" : "LESS"}
                            </b>
                          </p>
                          <p>{formatAmount(result?.header?.AddLess)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="paking3a__bottomSection_Box1_subBox2">
                    <div>
                      <p
                        style={{
                          backgroundColor: "#f1f1f1",
                          borderBottom: "1px solid #bdbdbd",
                        }}
                      >
                        <b> Diamond Detail</b>
                      </p>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "2px",
                        }}
                      >
                        <p>OTHERS</p>
                        <p>
                          {result?.mainTotal?.diamonds?.Pcs} /{" "}
                          {result?.mainTotal?.diamonds?.Wt?.toFixed(3)} cts
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="paking3a__bottomSection_Box2">
                  <div className="paking3a__bottomSection_Box2_subBox1">
                    <p
                      style={{
                        backgroundColor: "#f1f1f1",
                        borderBottom: "1px solid #bdbdbd",
                      }}
                    >
                      <b>OTHER DETAILS</b>
                    </p>
                    <div>
                      {brokarage.map((e, i) => {
                        return (
                          <div
                            className="d-flex justify-content-between px-1"
                            key={i}
                          >
                            <p className="fw-bold">{e[0]} </p>
                            <p>{e[1] && NumberWithCommas(e[1], 2)}</p>
                          </div>
                        );
                      })}
                      <div className="d-flex justify-content-between px-1">
                        <p className="fw-bold">RATE IN 24KT </p>
                        <p>{NumberWithCommas(headerData?.MetalRate24K, 2)}</p>
                      </div>
                    </div>
                    {/* <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "2px",
                      }}
                    >
                      <p>RATE IN 24KT</p>
                      <p>7800.00</p>
                    </div> */}
                  </div>
                  <div className="paking3a__bottomSection_Box2_subBox2">
                    <p
                      style={{
                        backgroundColor: "#f1f1f1",
                        borderBottom: "1px solid #bdbdbd",
                      }}
                    >
                      <b>Remark</b>
                    </p>
                    <div
                      style={{
                        display: "flex",
                        padding: "2px",
                      }}
                    >
                      <p>{result?.header?.PrintRemark}</p>
                    </div>
                  </div>
                  <div className="paking3a__bottomSection_Box2_subBox3">
                    <div className="paking3a__bottomSection_Box2_subBox3_1">
                      <p style={{ display: "flex", margin: "0px" }}>
                        Created By
                      </p>
                    </div>
                    <div className="paking3a__bottomSection_Box2_subBox3_2">
                      <p style={{ display: "flex", margin: "0px" }}>
                        Created By
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
              {" "}
              {msg}{" "}
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default PackingList3A;
