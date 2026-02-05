import React, { useEffect, useState } from "react";
import style from "../../assets/css/prints/saleorder.module.css";
import {
  FooterComponent,
  HeaderComponent,
  NumberWithCommas,
  apiCall,
  checkMsg,
  fixedValues,
  handleImageError,
  handlePrint,
  isObjectEmpty,
  taxGenrator,
  taxGenrator2,
} from "../../GlobalFunctions";
import Loader from "../../components/Loader";
import style2 from "../../assets/css/headers/header1.module.css";
import footerStyle from "../../assets/css/footers/footer2.module.css";
import ImageComponent from "../../components/ImageComponent ";
import { cloneDeep } from "lodash";

const SaleOrderSale = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {
  const [loader, setLoader] = useState(true);
  const [msg, setMsg] = useState("");
  const [data, setData] = useState([]);
  const [header, setHeader] = useState(null);
  const [footer, setFooter] = useState(null);
  const [headerData, setHeaderData] = useState({});
  const [summary, setSummary] = useState([]);
  const [summary2, setSummary2] = useState([]);
  const [total, setTotal] = useState({
    TotalAmount: 0,
    afterTax: 0,
    grandTotal: 0,
    UnitCost: 0,
    Quantity: 0
  });
  const [isImageWorking, setIsImageWorking] = useState(true);
  const handleImageErrors = () => {
    setIsImageWorking(false);
  };
  const [tax, settax] = useState([]);
  const [address, setAddress] = useState([]);
  const [evns, setEvns] = useState(atob(evn).toLowerCase());
  const [logoStyle, setlogoStyle] = useState({ maxWidth: "120px", maxHeight: "95px", minHeight: "95px" });

  const loadData = (data) => {
    let head = HeaderComponent("1", data?.BillPrint_Json[0]);
    setHeader(head);
    setHeaderData(data?.BillPrint_Json[0]);
    let subhead = FooterComponent("2", data?.BillPrint_Json[0]);
    setFooter(subhead);
    let resultArr = [];
    let summaryArr = [];
    let summary2Arr = [];
    let totals = { ...total };
    data?.BillPrint_Json1.forEach((e, i) => {
      let diamondWt = 0;
      let colorStoneWt = 0;
      let miscWt = 0;
      totals.Quantity += e?.Quantity
      let findGold24Kt = summaryArr.findIndex(
        (ele) => ele?.label === "GOLD IN 24KT"
      );
      if (findGold24Kt === -1) {
        summaryArr.push({
          label: "GOLD IN 24KT",
          value: e?.convertednetwt * e?.Quantity,
          id: 1,
          suffix: " gm",
          name: "GOLD IN 24KT",
        });
      } else {
        summaryArr[findGold24Kt].value += (e?.convertednetwt * e?.Quantity);
      }

      let findGross = summaryArr.findIndex(
        (ele, ind) => ele?.label === "Gross Wt"
      );
      if (findGross === -1) {
        summaryArr.push({
          label: "Gross Wt",
          value: e?.grosswt * e?.Quantity,
          id: 2,
          suffix: " gm",
          name: "Gross Wt",
        });
      } else {
        summaryArr[findGross].value += (e?.grosswt * e?.Quantity);
      }

      let netWt = summaryArr.findIndex((ele, ind) => ele?.label === "NET WT");
      if (netWt === -1) {
        summaryArr.push({
          label: "NET WT",
          value: e?.NetWt * e?.Quantity,
          id: 4,
          suffix: " gm",
          name: "NET WT",
        });
      } else {
        summaryArr[netWt].value += (e?.NetWt * e?.Quantity);
      }

      let findLabour = summaryArr.findIndex(
        (ele, ind) => ele?.label === "Labour"
      );
      if (findLabour === -1) {
        summaryArr.push({
          label: "Labour",
          value: 0,
          id: 7,
          suffix: "",
          name: "Labour",
          amount: e?.MakingAmount,
        });
      } else {
        summaryArr[findLabour].amount += e?.MakingAmount;
      }

      let labourAmount = summary2Arr.findIndex(
        (ele) => ele?.label === "LABOUR"
      );
      if (labourAmount === -1) {
        summary2Arr.push({
          label: "LABOUR",
          value: 0,
          id: 5,
          suffix: "",
          name: "LABOUR",
          amount: (e?.MakingAmount) * e?.Quantity,
        });
      } else {
        summary2Arr[labourAmount].amount += (e?.MakingAmount) * e?.Quantity;
      }
      // pending setting amount add in labour

      let otherAmount = summary2Arr.findIndex((ele) => ele?.label === "OTHER");
      if (otherAmount === -1) {
        summary2Arr.push({
          label: "OTHER",
          value: 0,
          id: 6,
          suffix: "",
          name: "OTHER",
          amount: ((e?.OtherCharges + e?.TotalDiamondHandling)) * e?.Quantity,
        });
      } else {
        summary2Arr[otherAmount].amount +=
          ((e?.OtherCharges + e?.TotalDiamondHandling)) * e?.Quantity;
      }

      data?.BillPrint_Json2.forEach((ele, index) => {
        if (ele?.StockBarcode === e?.SrJobno) {
          let findlabo = summary2Arr.findIndex(
            (ele) => ele?.label === "LABOUR"
          );
          if (findlabo !== -1) {
            summary2Arr[findlabo].amount += ele?.SettingAmount * e?.Quantity;
          }
          let findMaterial = summaryArr.findIndex(
            (elem, index) =>
              elem?.label === ele?.MasterManagement_DiamondStoneTypeName &&
              ele?.MasterManagement_DiamondStoneTypeid !== 5
          );
          if (findMaterial !== -1) {
            summaryArr[findMaterial].value += ele?.Wt * e?.Quantity;
            summaryArr[findMaterial].amount += ele?.Amount * e?.Quantity;
            summaryArr[findMaterial].Pcs += ele?.Pcs * e?.Quantity;
          }
          if (ele?.MasterManagement_DiamondStoneTypeid === 1) {
            diamondWt += ele?.Wt;
            if (findMaterial === -1) {
              summaryArr.push({
                label: "DIAMOND",
                value: ele?.Wt * e?.Quantity,
                id: 5,
                suffix: " Cts",
                name: "Dia Wt",
                amount: ele?.Amount * e?.Quantity,
                Pcs: ele?.Pcs * e?.Quantity,
              });
            }

            let diaAmount = summary2Arr.findIndex(
              (ele) => ele?.label === "DIAMOND"
            );
            if (diaAmount === -1) {
              summary2Arr.push({
                label: "DIAMOND",
                value: 0,
                id: 2,
                suffix: "",
                name: "DIAMOND",
                amount: (ele?.Amount) * e?.Quantity,
                Pcs: ele?.Pcs,
              });
            } else {
              summary2Arr[diaAmount].amount += (ele?.Amount) * e?.Quantity;
              summary2Arr[diaAmount].Pcs += ele?.Pcs;
            }
          } else if (ele?.MasterManagement_DiamondStoneTypeid === 2) {
            colorStoneWt += ele?.Wt;
            if (findMaterial === -1) {
              summaryArr.push({
                label: "COLOR STONE",
                value: ele?.Wt * e?.Quantity,
                id: 6,
                suffix: " Cts",
                name: "Cs Wt",
                amount: ele?.Amount * e?.Quantity,
                Pcs: ele?.Pcs * e?.Quantity,
              });
            }

            let cstAmount = summary2Arr.findIndex(
              (ele) => ele?.label === "CST"
            );
            if (cstAmount === -1) {
              summary2Arr.push({
                label: "CST",
                value: 0,
                id: 3,
                suffix: "",
                name: "CST",
                amount: (ele?.Amount) * e?.Quantity,
                Pcs: ele?.Pcs,
              });
            } else {
              summary2Arr[cstAmount].amount += (ele?.Amount) * e?.Quantity;
              summary2Arr[cstAmount].Pcs += ele?.Pcs;
            }
          } else if (ele?.MasterManagement_DiamondStoneTypeid === 3) {
            miscWt += ele?.Wt;
            if (findMaterial === -1) {
              summaryArr.push({
                label: "MISC",
                value: ele?.Wt * e?.Quantity,
                id: 7,
                suffix: " gms",
                name: "Misc Wt",
                amount: ele?.Amount * e?.Quantity,
                Pcs: ele?.Pcs * e?.Quantity,
              });
            }

            let miscAmount = summary2Arr.findIndex(
              (ele) => ele?.label === "MISC"
            );
            if (miscAmount === -1) {
              summary2Arr.push({
                label: "MISC",
                value: 0,
                id: 4,
                suffix: "",
                name: "MISC",
                amount: (ele?.Amount) * e?.Quantity,
              });
            } else {
              summary2Arr[miscAmount].amount += (ele?.Amount) * e?.Quantity;
            }
          } else if (ele?.MasterManagement_DiamondStoneTypeid === 4) {
            let goldAmount = summary2Arr.findIndex(
              (ele) => ele?.label === "GOLD"
            );
            if (goldAmount === -1) {
              summary2Arr.push({
                label: "GOLD",
                value: 0,
                id: 1,
                suffix: "",
                name: "GOLD",
                amount: (ele?.Amount) * e?.Quantity,
              });
            } else {
              summary2Arr[goldAmount].amount += ((ele?.Amount) * e?.Quantity);
            }
          } else if (ele?.MasterManagement_DiamondStoneTypeid === 5) {
            let goldAmount = summary2Arr.findIndex(
              (ele) => ele?.label === "GOLD"
            );
            if (goldAmount === -1) {
              summary2Arr.push({
                label: "GOLD",
                value: 0,
                id: 1,
                suffix: "",
                name: "GOLD",
                amount: ((ele?.Amount) * e?.Quantity),
              });
            } else {
              summary2Arr[goldAmount].amount += ((ele?.Amount) * e?.Quantity);
            }
          }
        }
      });
      let obj = { ...e };
      obj.TotalAmount =
        e?.TotalAmount;
      obj.UnitCost = e?.UnitCost / data?.BillPrint_Json[0]?.CurrencyExchRate;
      totals.TotalAmount +=
        obj?.TotalAmount / data?.BillPrint_Json[0]?.CurrencyExchRate;
      totals.UnitCost += obj?.UnitCost / obj.Quantity;
      obj.diamondWt = diamondWt;
      obj.colorStoneWt = colorStoneWt;
      obj.miscWt = miscWt;
      resultArr.push(obj);
    });

    // let mdWtt = summaryArr.findIndex((ele, ind) => ele?.label === "(M+D) WT");
    // if (mdWtt === -1) {
    //   summaryArr.push({
    //     label: "(M+D) WT",
    //     value: 0,
    //     id: 1,
    //     suffix: " gm",
    //     name: "(M+D) WT",
    //   });
    // } else {
    //   if (findDiamond !== -1) {
    //     summaryArr[mdWtt].value += summaryArr[findDiamond].value / 5;
    //   }
    // }

    let findDiamond = summaryArr.findIndex( (elem, index) => elem?.label === "DIAMOND" );
    let findNetWt = summaryArr.findIndex((ele, ind) => ele?.label === "NET WT");
    if (findNetWt !== -1) {
      summaryArr.push({
        label: "(M+D) WT",
        value: (findDiamond !== -1 ? (+fixedValues(summaryArr[findDiamond]?.value, 3) / 5) : 0 ) + summaryArr[findNetWt]?.value,
        id: 3,
        suffix: " gm",
        name: "(M+D) WT",
      });
    }
    summaryArr.sort((a, b) => {
      return a.id - b.id
    })

    let taxValue = taxGenrator2(data?.BillPrint_Json[0], totals?.TotalAmount);
    settax(taxValue);

    totals.afterTax =
      taxValue.reduce((acc, cobj) => {
        return acc + +cobj?.amount;
      }, 0) + totals?.TotalAmount;

    totals.grandTotal = totals.afterTax + data?.BillPrint_Json[0]?.AddLess ;
    let frightcharge = (data?.BillPrint_Json[0]?.FreightCharges / data?.BillPrint_Json[0]?.CurrencyExchRate);
    totals.grandTotal = totals.grandTotal + frightcharge;
      
    setTotal(totals);
    setData(resultArr);






  //   let resultArr2 = cloneDeep(resultArr);

  //   let finalArr = [];

  //   resultArr2?.forEach((a) => {
  //     if(a?.GroupJob === ''){
  //       finalArr.push(a);
  //   }else{
  //     let b = cloneDeep(a);
  //     let find_record = finalArr.findIndex((el) => el?.GroupJob === b?.GroupJob);
  //     if(find_record === -1){
  //       finalArr.push(b);
  //     }else{
  //       if(finalArr[find_record]?.GroupJob !== finalArr[find_record]?.SrJobno){
  //           finalArr[find_record].designno = b?.designno;
  //           finalArr[find_record].HUID = b?.HUID; 
  //       }
  //       finalArr[find_record].grosswt += b?.grosswt;
  //       finalArr[find_record].NetWt += b?.NetWt;
  //       finalArr[find_record].LossWt += b?.LossWt;
  //       finalArr[find_record].TotalAmount += b?.TotalAmount;
  //       finalArr[find_record].DiscountAmt += b?.DiscountAmt;
  //       finalArr[find_record].UnitCost += b?.UnitCost;
  //       finalArr[find_record].MakingAmount += b?.MakingAmount;
  //       finalArr[find_record].OtherCharges += b?.OtherCharges;
  //       finalArr[find_record].TotalDiamondHandling += b?.TotalDiamondHandling;
  //       finalArr[find_record].Quantity += b?.Quantity;
  //       finalArr[find_record].Wastage += b?.Wastage;
  //       finalArr[find_record].diamondWt += b?.diamondWt;
  //       // finalArr[find_record].totals.metal.IsPrimaryMetal += b?.totals?.metal?.IsPrimaryMetal;
  //       // finalArr[find_record].totals.diamonds.Wt += b?.totals?.diamonds?.Wt;
  //       // finalArr[find_record].diamonds_d = [...finalArr[find_record]?.diamonds ,...b?.diamonds]?.flat();
  //       // finalArr[find_record].diamonds = [...finalArr[find_record]?.diamonds, ...b?.diamonds]?.flat();
  //       // finalArr[find_record].colorstone_d = [...finalArr[find_record]?.colorstone ,...b?.colorstone]?.flat();
  //       // finalArr[find_record].colorstone = [...finalArr[find_record]?.colorstone, ...b?.colorstone]?.flat();
  //       // finalArr[find_record].metal_d = [...finalArr[find_record]?.metal ,...b?.metal]?.flat();
  //       // finalArr[find_record].metal = [...finalArr[find_record]?.metal, ...b?.metal]?.flat();
  //       // finalArr[find_record].misc = [...finalArr[find_record]?.misc ,...b?.misc]?.flat();
  //       // finalArr[find_record].totals.diamonds.Wt += b?.totals?.diamonds?.Wt;
  //       // finalArr[find_record].totals.diamonds.Pcs += b?.totals?.diamonds?.Pcs;
  //       // finalArr[find_record].totals.diamonds.Amount += b?.totals?.diamonds?.Amount;
  //       // finalArr[find_record].totals.colorstone.Wt += b?.totals?.colorstone?.Wt;
  //       // finalArr[find_record].totals.colorstone.Pcs += b?.totals?.colorstone?.Pcs;
  //       // finalArr[find_record].totals.colorstone.Amount += b?.totals?.colorstone?.Amount;
  //       // finalArr[find_record].totals.misc.Wt += b?.totals?.misc?.Wt;
  //       // finalArr[find_record].totals.misc.allservwt += b?.totals?.misc?.allservwt;
  //       // finalArr[find_record].totals.misc.Pcs += b?.totals?.misc?.Pcs;
  //       // finalArr[find_record].totals.misc.Amount += b?.totals?.misc?.Amount;
  //       // finalArr[find_record].totals.metal.Amount += b?.totals?.metal?.Amount;
  //       // finalArr[find_record].totals.metal.IsPrimaryMetal += b?.totals?.metal?.IsPrimaryMetal;
  //       // finalArr[find_record].totals.metal.IsPrimaryMetal_Amount += b?.totals?.metal?.IsPrimaryMetal_Amount;
  //       // finalArr[find_record].totals.misc.withouthscode1_2_pcs += b?.totals?.misc?.withouthscode1_2_pcs;
  //       // finalArr[find_record].totals.misc.withouthscode1_2_wt += b?.totals?.misc?.withouthscode1_2_wt;
  //       // finalArr[find_record].totals.misc.onlyHSCODE3_amt += b?.totals?.misc?.onlyHSCODE3_amt;
  //       // finalArr[find_record].misc_d = [...finalArr[find_record]?.misc ,...b?.misc]?.flat();
  //     }
  //   }
  //   })

  //   resultArr2 = finalArr;
    


  // const sortedArr = resultArr?.sort((a, b) => a?.GroupJob - b?.GroupJob)
  // const sortedArr = resultArr?.sort((a, b) => (`${b?.GroupJob}_${b?.SrJobno}`)?.localeCompare(`${a?.GroupJob}_${a?.SrJobno}`));


      function sortJobs(arr) {
        const primaryJobs = arr?.filter(job => job?.SrJobno === job?.GroupJob);
        const otherJobs = arr?.filter(job => job?.SrJobno !== job?.GroupJob);
      
        primaryJobs?.sort((a, b) => a?.SrJobno?.localeCompare(b?.SrJobno));
      
        const sortedJobs = [];
        primaryJobs?.forEach(primary => {
          sortedJobs?.push(primary);
          otherJobs?.forEach(job => {
            if (job?.GroupJob === primary?.SrJobno) {
              sortedJobs?.push(job);
            }
          });
        });
      
        // Add remaining jobs that do not have a primary reference
        const remainingJobs = otherJobs?.filter(job => !primaryJobs?.some(primary => job?.GroupJob === primary?.SrJobno));
        sortedJobs?.push(...remainingJobs);
      
        return sortedJobs;
      }
      
      const sortedArray = sortJobs(resultArr);

      setData(sortedArray);






    summary2Arr.sort((a, b) => {
      return a.id - b.id;
    });

    setSummary2(summary2Arr);
    setSummary(summaryArr);

    let adr = data?.BillPrint_Json[0]?.Printlable.split("\n");
    setAddress(adr);
  };

  useEffect(() => {
    const sendData = async () => {
      try {
        const data = await apiCall(token, invoiceNo, printName, urls, evn, ApiVer);
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

  return loader ? (
    <Loader />
  ) : msg === "" ? (
    <div
      className={`container max_width_container pad_60_allPrint ${style?.containerJewellery} jewelleryinvoiceContain mt-1`}
    >
      {/* print button */}
      <div
        className={`d-flex justify-content-end align-items-center ${style?.print_sec_sum4} mb-4`}
      >
        <div className="form-check ps-3">
          <input
            type="button"
            className="btn_white blue py-1"
            value="Print"
            onClick={(e) => handlePrint(e)}
          />
        </div>
      </div>
      {/* header  */}
      <div className={`${style2.headline} headerTitle`}>
        {headerData?.PrintHeadLabel}
      </div>
      <div className={style2.companyDetails}>
        <div className={`${style2.companyhead} p-2`}>
          <span className={style2.lines} style={{ fontWeight: "bold" }}>
            {headerData?.CompanyFullName}
          </span>
          <span className={style2.lines}>{headerData?.CompanyAddress}</span>
          <span className={style2.lines}>{headerData?.CompanyAddress2}</span>
          <span className={style2.lines}>
            {headerData?.CompanyCity}-{headerData?.CompanyPinCode},
            {headerData?.CompanyState}({headerData?.CompanyCountry})
          </span>
          <span className={style2.lines}>
            Tell No: {headerData?.CompanyTellNo}
          </span>
          <span className={style2.lines}>
            {headerData?.CompanyEmail} | {headerData?.CompanyWebsite}
          </span>
          <span className={style2.lines}>
            {/* {headerData?.Company_VAT_GST_No} | {headerData?.Company_CST_STATE}-{headerData?.Company_CST_STATE_No} | PAN-{headerData?.Pannumber} */}
            {headerData?.Company_VAT_GST_No} | {headerData?.Company_CST_STATE}-{headerData?.Company_CST_STATE_No} | PAN-{headerData?.Pannumber}
          </span>
        </div>
        <div
          style={{ width: "30%" }}
          className="d-flex justify-content-end align-item-center h-100"
        >
          <ImageComponent imageUrl={headerData?.PrintLogo} styles={logoStyle} />
        </div>
      </div>
      {/* customer details */}
      <div className="border-top border-start border-end d-flex">
        <div className="col-4 p-2 border-end">
          <p> To,</p>
          <p className="fw-bold">{headerData?.customerfirmname}</p>
          <p>{headerData?.customerAddress1}</p>
          <p>{headerData?.customerAddress2}</p>
          <p>{headerData?.customercity}</p>
          <p>
            {headerData?.customerstate} , {headerData?.customercountry}{" "}
            {headerData?.customerpincode}
          </p>
          <p>Tel : {headerData?.customermobileno}</p>
          <p>{headerData?.customeremail1}</p>
          <p>{headerData?.CustGstNo === '' ? 'VAT : ' : 'GST : '} {headerData?.CustGstNo === '' ? headerData?.Cust_VAT_GST_No : headerData?.CustGstNo}</p>
          <p>{headerData?.CustPanno === '' ? '' : 'Panno : '}{headerData?.CustPanno === '' ? '' : headerData?.CustPanno}</p>
        </div>
        <div className="col-4 p-2">
          <p>Ship To,</p>
          <p className="fw-bold">{headerData?.customerfirmname}</p>
          {/* <div
            dangerouslySetInnerHTML={{ __html: headerData?.Printlable }}
          ></div> */}
          {address?.map((e, i) => {
            return <p key={i}> {e}</p>;
          })}
        </div>
        <div className="col-4 d-flex justify-content-end p-2">
          <div className="col-9 d-flex flex-column justify-content-center">
            <p>
              DATE:{" "}
              <span className="ps-1 fw-bold">{headerData?.EntryDate}</span>
            </p>
            <p>
              {evns === "orders" && "ORDER"}{evns === "quote" && "QUOTATION"}#:{" "}
              <span className="ps-1 fw-bold">{headerData?.InvoiceNo}</span>{" "}
            </p>
            {data[0]?.PO !== "" && (
              <p>
                PO#: <span className="ps-1 fw-bold">{data[0]?.PO}</span>{" "}
              </p>
            )}
        
          </div>
        </div>
      </div>
      <div className="">
        {/* table header */}
        <table className="table w-100 table-border mb-0">
          <thead>
            <tr>
              <th className={`${style?.srNo} p-1 text-center lightGrey_table  border `} style={{ wordBreak: "normal" }}>SR NO</th>
              <th className={`${style?.image} p-1 text-center lightGrey_table  border`}>IMAGE</th>
              <th className={`${style?.itemCode} p-1 text-center lightGrey_table  border`}>ITEM CODE</th>
              <th className={`${style?.description} p-1 text-center lightGrey_table  border`}>DESCRIPTION</th>
              <th className={`${style?.quantity} p-1 text-center lightGrey_table  border`}>QTY</th>
              <th className={`${style?.unitPrice} p-1 text-center lightGrey_table  border`}>UNIT PRICE</th>
              <th className={`${style?.amount} p-1 text-center lightGrey_table border`} style={{ wordBreak: "normal" }}>AMOUNT ({headerData?.CurrencyCode})</th>
            </tr>
          </thead>
          {/* table data */}
          <tbody>
            {data.map((e, i) => {
              return (
                <tr className="no_break" key={i} >
                  <td className={`${style?.srNo} p-1 border-end border-start border-bottom`}>
                    <p className=" text-center">{i + 1}</p>
                  </td>
                  <td className={`${style?.image} p-1  border-end border-start border-bottom`}>
                    <img
                      src={e?.DesignImage}
                      alt=""
                      onError={handleImageError}
                      className={`w-100 imgWidth`}
                    />
                  </td>
                  <td className={`${style?.itemCode} p-1  border-end border-start border-bottom`}>
                    <p className="d-flex justify-content-between align-items-center px-1 w-100 text-break flex-wrap">
                      <span className="fw-bold">{e?.designno}</span>
                      <span className="fw-bold">{e?.SrJobno}</span>
                    </p>
                    <p className="d-flex justify-content-between align-items-center px-1 w-100 text-break flex-wrap">
                      { e?.CertificateNo === '' ? '' : <span className="fw-bold text-break">Cert no : {e?.CertificateNo} </span>}
                    </p>
                  </td>
                  <td className={`${style?.description} p-1 border-end border-start border-bottom `}>
                    <p>
                      <span className="fw-bold">{e?.MetalType}: </span> {e?.MetalPurity} {e?.MetalColor}
                    </p>
                    <p>
                      {e?.NetWt !== 0 &&
                        <><span className="fw-bold">NET WT: </span>{`${NumberWithCommas(e?.NetWt, 3)} gms NW`}</>}
                    </p>
                    <p>
                      {e?.diamondWt !== 0 &&
                        <><span className="fw-bold">DIA WT: </span>{`${NumberWithCommas(e?.diamondWt, 3)} Cts`}</>}
                    </p>
                    <p>
                      {e?.colorStoneWt !== 0 &&
                        <><span className="fw-bold">CS: </span>{`${NumberWithCommas(e?.colorStoneWt, 3)} Cts`}</>}
                    </p>
                    <p>
                      {e?.miscWt !== 0 &&
                        <><span className="fw-bold">MISC: </span>{`${NumberWithCommas(e?.miscWt, 3)} gms`}</>}
                    </p>
                    <p>
                      {e?.grosswt !== 0 &&
                        <><span className="fw-bold">GROSS WT: </span>{`${NumberWithCommas(e?.grosswt, 3)} gms GW`}</>}
                    </p>
                    {e?.Size !== "" && <p className="pt-1"><span className="fw-bold">SIZE: </span> {e?.Size}</p>}
                    {(e?.Collectionname !== "" ||
                      e?.Categoryname !== "" ||
                      e?.SubCategoryname !== "") && (
                        <p className="pt-2">
                          <span className="fw-bold"> PRODUCT: </span> {e?.Collectionname}, {e?.Categoryname},{" "}
                          {e?.SubCategoryname}
                        </p>
                      )}
                    {e?.JobRemark !== "" && (
                      <p className="pt-1">
                        <span className="fw-bold">REMARKS:</span> {e?.JobRemark}
                      </p>
                    )}
                  </td>
                  <td className={`${style?.quantity} p-1 border-end border-start border-bottom `}>
                    <p className="text-end"> {e?.Quantity}</p>
                  </td>
                  <td className={`${style?.unitPrice} p-1 border-end border-start border-bottom text-end`}>
                    <p>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: headerData?.Currencysymbol,
                        }}
                      ></span>{" "}
                      {/* {NumberWithCommas(e?.UnitCost / (e?.Quantity * headerData?.CurrencyExchRate), 2)} */}
                      {NumberWithCommas(e?.UnitCost / e?.Quantity, 2)}
                    </p>
                  </td>
                  <td className={`${style?.amount} p-1  text-end border-start border-bottom border-end`}>
                    <p>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: headerData?.Currencysymbol,
                        }}
                      ></span>{" "}
                      {NumberWithCommas(e?.TotalAmount / headerData?.CurrencyExchRate, 2)}
                    </p>
                  </td>
                </tr>
              );
            })}
            {/* table total */}
            <tr className="no_break"  >
              <td className={`${style?.srNo} p-1 border-end border-start border-bottom lightGrey_table`}> </td>
              <td className={`${style?.image} p-1  border-start border-bottom lightGrey_table`}> <p className="fw-bold">TOTAL</p> </td>
              <td className={`${style?.itemCode} p-1   border-start border-bottom lightGrey_table`}> </td>
              <td className={`${style?.description} p-1  border-start border-bottom lightGrey_table `}> </td>
              <td className={`${style?.quantity} p-1 border-end border-start border-bottom lightGrey_table`}> <p className="text-end fw-bold"> {NumberWithCommas(total?.Quantity, 0)}</p> </td>
              <td className={`${style?.unitPrice} p-1 border-end border-start border-bottom lightGrey_table text-end`}> <p className="fw-bold"> <span dangerouslySetInnerHTML={{ __html: headerData?.Currencysymbol }} ></span>{" "} {NumberWithCommas(total?.UnitCost, 2)} </p> </td>
              <td className={`${style?.amount} p-1  text-end border-start border-bottom lightGrey_table border-end`}> <p className="fw-bold"> <span dangerouslySetInnerHTML={{ __html: headerData?.Currencysymbol }} ></span> {NumberWithCommas(total?.TotalAmount, 2)} </p> </td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* taxes */}
      <div className="border-start border-end border-bottom d-flex no_break">
        <div className={`${style?.gold18k} border-end`}>
          <p className="fw-semibold text-center border-bottom py-1 lightGrey">
            SUMMARY
          </p>
          <div className="d-flex h-100">
            <div className="col-6 border-end p-1 ">
              {summary?.map((e, i) => {
                return (
                  e?.value !== 0 && (
                    <div className="d-flex justify-content-between" key={i}>
                      <p className="fw-bold">{(e?.name).toUpperCase()}</p>
                      <p>
                        {e?.Pcs && `${NumberWithCommas(e?.Pcs, 0)} / `}
                        {NumberWithCommas(+e?.value, 3)} {e?.suffix}
                      </p>
                    </div>
                  )
                );
              })}
            </div>
            <div className="col-6 p-1 ">
              {summary2?.map((e, i) => {
                return (
                  e?.amount !== 0 && (
                    <div className="d-flex justify-content-between" key={i}>
                      <p className="fw-bold">{e?.name}</p>
                      <p>{NumberWithCommas(e?.amount / headerData?.CurrencyExchRate, 2)}</p>
                    </div>
                  )
                );
              })}
            </div>
          </div>
        </div>
        <div className={`${style?.remarks} p-1 border-end`}>
          <p className="fw-bold text-decoration-underline fw-bold">REMARKS: </p>
          <p dangerouslySetInnerHTML={{ __html: headerData?.PrintRemark }}></p>
          {/* <p>{headerData?.PrintRemark}</p> */}
        </div>
        <div className={`${style?.grandTotal} p-1 border-end`}>
          {tax?.map((e, i) => {
            return (
              <p key={i} className="text-end">
                {e?.name} @ {e?.per}
              </p>
            );
          })}
          <p className="text-end"> TOTAL </p>
          <p className="text-end"> Courier & Other Charges  </p>
          {headerData?.AddLess !== 0 && (
            <p className="text-end">{headerData?.AddLess > 0 ? "ADD" : "LESS"}</p>
          )}
        </div>
        <div className={`${style?.amount} p-1 text-end fw-bold`}>
          {tax.map((e, i) => {
            return (
              <p key={i}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: headerData?.Currencysymbol,
                  }}
                ></span>{" "}
                {e?.amount}
              </p>
            );
          })}
          <p>
            <span
              dangerouslySetInnerHTML={{ __html: headerData?.Currencysymbol }}
            ></span>{" "}
            {NumberWithCommas(total?.afterTax, 2)}
          </p>
          <p>
            <span dangerouslySetInnerHTML={{ __html: headerData?.Currencysymbol }} ></span>
            {NumberWithCommas(((headerData?.FreightCharges)/headerData?.CurrencyExchRate), 2)}
          </p>
          {headerData?.AddLess !== 0 && (
            <p>
              <span
                dangerouslySetInnerHTML={{ __html: headerData?.Currencysymbol }}
              ></span>{" "}
              {NumberWithCommas(headerData?.AddLess, 2)}
            </p>
          )}
        </div>
      </div>
      {/* grand total */}
      <div className="border-start border-end border-bottom d-flex lightGrey no_break">
        <div className={`${style?.gold18k} p-1 border-end d-flex`}>
          <div className="col-6 border-end"></div>
          <div className="col-6 d-flex justify-content-between">
            <p className="fw-bold">TOTAL</p>
            <p className="fw-bold">
              {" "}
              <span
                dangerouslySetInnerHTML={{ __html: headerData?.Currencysymbol }}
              ></span>{" "}
              {/* {NumberWithCommas(total?.UnitCost, 2)} */}
              {NumberWithCommas(total?.grandTotal, 2)}
            </p>
          </div>
        </div>
        <div className={`${style?.remarks} p-1 fw-bold border-end`}></div>
        <div className={`${style?.grandTotal} p-1 border-end`}>
          <p className="fw-bold text-end"> GRAND TOTAL</p>
        </div>
        <div className={`${style?.amount} p-1 text-end fw-bold`}>
          <p>
            {" "}
            <span
              dangerouslySetInnerHTML={{ __html: headerData?.Currencysymbol }}
            ></span>{" "}
            {NumberWithCommas((total?.grandTotal), 2)}
          </p>
        </div>
      </div>
      <div className="py-1 no_break">
        <p className="computerGenerated">
          ** THIS IS A COMPUTER GENERATED INVOICE AND KINDLY NOTIFY US
          IMMEDIATELY IN CASE YOU FIND ANY DISCREPANCY IN THE DETAILS OF
          TRANSACTIONS
        </p>
      </div>
      <div className="border-start border-end border-top p-2 no_break">
        <div
          dangerouslySetInnerHTML={{ __html: headerData?.Declaration }}
        ></div>
      </div>
      {/* {footer} */}
      <div className={`d-flex border no_break`}>
        <div className={`col-4 border-end p-1`}  >
          <div className={footerStyle.linesf3} style={{ fontWeight: "bold" }}>Bank Detail</div>
          <div className={footerStyle.linesf3}>Bank Name: {headerData?.bankname}</div>
          <div className={footerStyle.linesf3}>Branch: {headerData?.bankaddress}</div>
          <div className={footerStyle.linesf3}>Account Name: {headerData?.accountname}</div>
          <div className={footerStyle.linesf3}>Account No. : {headerData?.accountnumber}</div>
          <div className={footerStyle.linesf3}>RTGS/NEFT IFSC: {headerData?.rtgs_neft_ifsc}</div>
        </div>
        <div className={`col-4 border-end p-1 d-flex justify-content-between flex-column`} >
          <div className={footerStyle.linesf3}>Signature</div>
          <div className={`fw-bold`}>{headerData?.customerfirmname}</div>
        </div>
        <div className="p-1 d-flex justify-content-between flex-column">
          <div className={footerStyle.linesf3}>Signature</div>
          <div className={`fw-bold`}>{headerData?.CompanyFullName}</div>
        </div>
      </div>
    </div>
  ) : (
    <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
      {msg}
    </p>
  );
};

export default SaleOrderSale;
