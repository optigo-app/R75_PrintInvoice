import React, { useEffect, useState } from "react";
import style from "../../assets/css/prints/InvoicePrint9.module.css";
import Loader from "../../components/Loader";
import { ToWords } from "to-words";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";
import style1 from "../../assets/css/headers/header1.module.css";
import {
  HeaderComponent,
  NumberWithCommas,
  apiCall,
  checkMsg,
  fixedValues,
  handleImageError,
  handlePrint,
  isObjectEmpty,
} from "../../GlobalFunctions";
import footer2 from "../../assets/css/footers/footer2.module.css";
import { cloneDeep, replace } from "lodash";
import ImageComponent from "../../components/ImageComponent ";

const InvoicePrint9 = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
  const toWords = new ToWords();
  const [loader, setLoader] = useState(true);
  const [msg, setMsg] = useState("");
  const [header, setHeader] = useState(null);
  const [headerCheck, setHeaderCheck] = useState(true);
  const [label, setlabel] = useState([]);
  const [headerData, setHeaderData] = useState({});
  const [data, setData] = useState({});
  const [documentDetail, setDocumentDetail] = useState([]);
  const [isImageWorking, setIsImageWorking] = useState(true);
  const [logoStyle, setlogoStyle] = useState({
    maxWidth: "120px",
    maxHeight: "95px",
    minHeight: "95px",
  });
  const handleImageErrors = () => {
    setIsImageWorking(false);
  };
  const loadData = (data) => {
    let head = HeaderComponent("1", data?.BillPrint_Json[0]);
    let docs = data?.BillPrint_Json[0]?.DocumentDetail?.split("#@#");
    let doccs = [];

    if (docs?.length > 1) {
      docs?.forEach((ele, ind) => {
        doccs?.push(ele?.split("#-#"));
      });
    }
    let docArr = [];
    doccs?.forEach((e, i) => {
      docArr?.push({ label: e[0], value: e[1] });
    });
    setDocumentDetail(docArr);
    setHeader(head);
    setHeaderData(data?.BillPrint_Json[0]);
    let printArr = data?.BillPrint_Json[0]?.Printlable.split("\r\n");
    setlabel(printArr);
    let datas = OrganizeDataPrint(
      data?.BillPrint_Json[0],
      data?.BillPrint_Json1,
      data?.BillPrint_Json2
    );
    let resultArr = [];
    let totalAmounts = 0;
    datas?.resultArray?.map((e, i) => {
      let obj = cloneDeep(e);
      if (
        e?.OtherCharges +
          e?.misc?.reduce((acc, cObj) => acc + cObj?.Amount, 0) +
          e?.totals?.diamonds?.SettingAmount +
          e?.totals?.colorstone?.SettingAmount +
          e?.finding?.reduce((acc, cObj) => acc + cObj?.SettingAmount, 0) +
          e?.TotalDiamondHandling >
          0 &&
        e?.totals?.diamonds?.Pcs + e?.totals?.colorstone?.Pcs > 0
      ) {
        totalAmounts +=
          e?.OtherCharges +
          e?.totals?.diamonds?.SettingAmount +
          e?.totals?.colorstone?.SettingAmount +
          e?.finding?.reduce((acc, cObj) => acc + cObj?.SettingAmount, 0) +
          e?.TotalDiamondHandling +
          +e?.totals?.misc?.Amount;
      }
      totalAmounts +=
        e?.MetalAmount +
        e?.MakingAmount +
        e?.totals?.diamonds?.Amount +
        e?.totals?.colorstone?.Amount;
      let findGold = obj?.metal?.find((ele, ind) => ele?.IsPrimaryMetal === 1);
      if (findGold !== undefined) {
        obj.metalRate = findGold?.Rate;
        obj.metalAmount = findGold?.Amount;
        obj.metalPcs = findGold?.Pcs;
      }
      resultArr.push(obj);
    });
    datas.resultArray = resultArr;
    datas?.resultArray?.sort((a, b) => {
      var regex = /(\d+)|(\D+)/g;
      var partsA = a.SrJobno.match(regex);
      var partsB = b.SrJobno.match(regex);
      for (var i = 0; i < Math.min(partsA.length, partsB.length); i++) {
        var partA = partsA[i];
        var partB = partsB[i];
        if (!isNaN(partA) && !isNaN(partB)) {
          var numA = parseInt(partA);
          var numB = parseInt(partB);
          if (numA !== numB) {
            return numA - numB;
          }
        } else {
          if (partA !== partB) {
            return partA.localeCompare(partB);
          }
        }
      }
    });
    datas.mainTotal.totalAmounts = totalAmounts;
    setData(datas);
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

  return loader ? (
    <Loader />
  ) : msg === "" ? (
    <>
      <div
        className={`container max_width_container ${style?.invoiceprint9} pad_60_allPrint px-1 mt-0 invoiceprint9`}
      >
        {/* buttons */}
        <div className="d-flex justify-content-end align-items-center print_sec_sum4 mb-4 mt-4">
          <div className="form-check pe-3 ">
            <input
              className="form-check-input border-dark"
              type="checkbox"
              checked={headerCheck}
              onChange={(e) => setHeaderCheck(!headerCheck)}
            />
            <label className="form-check-label pt-1">With Header</label>
          </div>
          <div className="form-check ps-3">
            <input
              type="button"
              className="btn_white blue py-2"
              value="Print"
              onClick={(e) => handlePrint(e)}
              style={{ fontSize: "14px" }}
            />
          </div>
        </div>
        {/* header */}
        {headerCheck && (
          <div className={`invoiceprint9Header `}>
            {/* {header} */}
            <div className={`${style1.headline} headerTitle target_header `}>
              {headerData?.PrintHeadLabel}
            </div>
            <div className={`${style1.companyDetails} target_header`}>
              <div className={`${style1.companyhead} p-2`}>
                <div className={style1.lines} style={{ fontWeight: "bold" }}>
                  {headerData?.CompanyFullName}
                </div>
                <div className={style1.lines}>{headerData?.CompanyAddress}</div>
                <div className={style1.lines}>
                  {headerData?.CompanyAddress2}
                </div>
                <div className={style1.lines}>
                  {headerData?.CompanyCity}-{headerData?.CompanyPinCode},
                  {headerData?.CompanyState}({headerData?.CompanyCountry})
                </div>
                <div className={style1.lines}>
                  T {headerData?.CompanyTellNo}{" "}
                  {headerData?.CompanyTellNo2 !== "" &&
                    ` | ${headerData?.CompanyTellNo2}`}
                </div>
                <div className={style1.lines}>
                  {headerData?.CompanyEmail} | {headerData?.CompanyWebsite}
                </div>
                <div className={style1.lines}>
                  {headerData?.Company_VAT_GST_No} |{" "}
                  {headerData?.Company_CST_STATE}-
                  {headerData?.Company_CST_STATE_No} | PAN-
                  {headerData?.Pannumber}
                </div>
              </div>
              <div
                style={{ width: "30%" }}
                className="d-flex justify-content-end align-item-center h-100"
              >
                <ImageComponent
                  imageUrl={headerData?.PrintLogo}
                  styles={logoStyle}
                />
              </div>
            </div>
          </div>
        )}
        {/* print heading */}
        <div className={`${style?.space}`}>
          <p className="fs-5 text-center fw-bold border-top">
            {headerData?.PrintHeadLabel}
          </p>
        </div>
        {/* sub header */}
        <div className="border d-flex">
          <div className="col-8 px-1 py-2 border-end">
            <p className="fw-bold">Buyer Details,</p>
            <p className="fw-bold" style={{ fontSize: "14px" }}>
              {headerData?.customerfirmname}
            </p>
            <p>{headerData?.customerAddress1}</p>
            <p>{headerData?.customerAddress2}</p>
            <p>{headerData?.customerAddress3}</p>
            <p>
              {headerData?.customercity1}
              {headerData?.customerpincode}, {headerData?.State}
            </p>
            <p>{headerData?.customeremail1}</p>
            <p>
              {headerData?.Cust_CST_STATE} {headerData?.Cust_CST_STATE_No}
            </p>
          </div>
          <div className="col-4 py-2 px-1">
            <div className="d-flex">
              <p className="fw-bold col-6">BILL NO</p>
              <p className="col-6"> {headerData?.InvoiceNo} </p>
            </div>
            <div className="d-flex">
              <p className="fw-bold col-6">DATE</p>
              <p className="col-6"> {headerData?.EntryDate} </p>
            </div>
            <div className="d-flex">
              <p className="fw-bold col-6">GSTIN</p>
              <p className="col-6"> {headerData?.CustGstNo} </p>
            </div>
            <div className="d-flex">
              <p className="fw-bold col-6">PAN NO</p>
              <p className="col-6"> {headerData?.CustPanno} </p>
            </div>
            <div className="d-flex">
              <p className="fw-bold col-6">AADHAR NO </p>
              <p className="col-6"> {headerData?.aadharno} </p>
            </div>
            <div className="d-flex">
              <p className="fw-bold col-6">FOREIGN PASSPORT</p>
              <p className="col-6">
                {" "}
                {documentDetail?.map((e, i) => {
                  return e?.label === "FOREIGN PASSPORT" && e?.value;
                })}{" "}
              </p>
            </div>
            <div className="d-flex">
              <p className="fw-bold col-6">DRIVING LICENCE </p>
              <p className="col-6"> </p>
            </div>

            <div className="d-flex">
              <p className="fw-bold col-6">MOBILE</p>
              <p className="col-6"> {headerData?.MobNoPrCon} </p>
            </div>
          </div>
        </div>
        {/* table header */}
        <div className="d-flex border py-1 mt-1">
          <div className={`${style?.Image} px-1`}>
            <p className={`${style?.font_15} fw-bold `}>Image </p>
          </div>
          <div className={`${style?.SNo} px-1`}>
            <p
              className={`${style?.font_15} flex-wrap fw-bold text-center d-flex align-items-center justify-content-center`}
            >
              <span>S.</span>
              <span>No</span>{" "}
            </p>
          </div>
          <div className={`${style?.Description} px-1`}>
            <p className={`${style?.font_15} fw-bold `}>Description </p>
          </div>
          <div className={`${style?.HSN} px-1`}>
            <p className={`${style?.font_15} fw-bold `}>HSN </p>
          </div>
          <div className={`${style?.Pcs} px-1`}>
            <p className={`${style?.font_15} fw-bold  text-end`}>Pcs </p>
          </div>
          <div className={`${style?.GGms} px-1`}>
            <p className={`${style?.font_15} fw-bold  text-end`}>G.Gms.Mg </p>
          </div>
          <div className={`${style?.Stone} px-1`}>
            <p className={`${style?.font_15} fw-bold  text-end`}>Stone Wt </p>
          </div>
          <div className={`${style?.NGms} px-1`}>
            <p className={`${style?.font_15} fw-bold  text-end`}>N.Gms.Mg </p>
          </div>
          <div className={`${style?.Rate} px-1`}>
            <p className={`${style?.font_15} fw-bold  text-end`}>Rate </p>
          </div>
          <div className={`${style?.VA} px-1`}>
            <p className={`${style?.font_15} fw-bold  text-end`}>V.A </p>
          </div>
          <div className={`${style?.Amount} px-1`}>
            <p className={`${style?.font_15} fw-bold  text-end`}>Amount</p>
          </div>
        </div>
        {/* table data */}
        {data?.resultArray?.map((e, i) => {
          return (
            <div
              className="d-flex border-start border-end border-bottom no_break"
              key={i}
            >
              <div className={`${style?.Image} px-1 border-end`}>
                <p className={`fw-bold ${style?.font_13}`}>{e?.SrJobno} </p>
                <img
                  src={e?.DesignImage}
                  alt=""
                  className="imgWidth"
                  onError={handleImageError}
                />
                {e?.HUID !== "" && <p className="fw-bold pb-1">HUID:{e?.HUID}</p>}
              </div>
              <div className={`${style?.SNo} px-1 border-end`}>
                <p className={`${style?.font_13} text-center`}>
                  {NumberWithCommas(i + 1, 0)}
                </p>
              </div>
              <div className={`${style?.Description} px-1`}>
                <p className={`fw-bold pb-1 ${style?.font_13}`}>
                  {e?.SubCategoryname}-{e?.MetalPurity}
                </p>
                <p className=" ">{e?.CertificateNo}</p>
                {e?.diamonds?.map((ele, ind) => {
                  return (
                    <p className={`pt-1 ${style?.font_13}`} key={ind}>
                      DIAMONDS {ele?.Colorname} {ele?.QualityName}{" "}
                      {ele?.ShapeName}{" "}
                    </p>
                  );
                })}
                {e?.colorstone?.map((ele, ind) => {
                  return (
                    <p className={`pt-1 ${style?.font_13}`} key={ind}>
                      {" "}
                      {ele?.QualityName} {ele?.ShapeName}{" "}
                    </p>
                  );
                })}
                {e?.OtherCharges +
                  e?.misc?.reduce((acc, cObj) => acc + cObj?.Amount, 0) +
                  e?.totals?.diamonds?.SettingAmount +
                  e?.totals?.colorstone?.SettingAmount +
                  e?.finding?.reduce(
                    (acc, cObj) => acc + cObj?.SettingAmount,
                    0
                  ) +
                  e?.TotalDiamondHandling >
                  0 &&
                  e?.totals?.diamonds?.Pcs + e?.totals?.colorstone?.Pcs > 0 && (
                    <p className={`pt-1 ${style?.font_13}`}> OTHER </p>
                  )}
              </div>
              <div className={`${style?.HSN} px-1`}>
                <p className={`fw-bold ${style?.font_13}`}>
                  {headerData?.HSN_No}
                </p>
              </div>
              <div className={`${style?.Pcs} px-1`}>
                <p className={`fw-bold text-end ${style?.font_13}`}>
                  {NumberWithCommas(e?.Quantity, 0)}
                </p>
                {e?.CertificateNo !== "" && (
                  <p className="invisible">&nbsp;12</p>
                )}
                {e?.diamonds?.map((ele, ind) => {
                  return (
                    <p className={`pt-1 text-end ${style?.font_13}`} key={ind}>
                      {" "}
                      {NumberWithCommas(ele?.Pcs, 0)}{" "}
                    </p>
                  );
                })}
                {e?.colorstone?.map((ele, ind) => {
                  return (
                    <p className={`pt-1 text-end ${style?.font_13}`} key={ind}>
                      {" "}
                      {NumberWithCommas(ele?.Pcs, 0)}{" "}
                    </p>
                  );
                })}
              </div>
              <div className={`${style?.GGms} px-1`}>
                <p className={`fw-bold text-end ${style?.font_13}`}>
                  {NumberWithCommas(e?.grosswt, 3)} g
                </p>  
              </div>

              <div className={`${style?.Stone} px-1`}>
          
                <p className={`fw-bold text-end ${style?.font_13}`}>
                  {NumberWithCommas(
                    (e?.totals?.colorstone?.Wt + e?.totals?.diamonds?.Wt) / 5,
                    3
                  )}{" "}
                  g
                </p>
                {e?.CertificateNo !== "" && (
                  <p className="invisible">&nbsp;12</p>
                )}
                {e?.diamonds?.map((ele, ind) => {
                  return (
                    <p className={`pt-1 text-end ${style?.font_13}`} key={ind}>
                      {" "}
                      {NumberWithCommas(ele?.Wt, 3)}{" "}cts
                    </p>
                  );
                })}
                {e?.colorstone?.map((ele, ind) => {
                  return (
                    <p className={`pt-1 text-end ${style?.font_13}`} key={ind}>
                      {" "}
                      {NumberWithCommas(ele?.Wt, 3)}{" "}cts
                    </p>
                  );
                })}
              </div>
              <div className={`${style?.NGms} px-1`}>
                <p className={`fw-bold text-end ${style?.font_13}`}>
                  {NumberWithCommas(e?.NetWt, 3)} g
                </p>
              </div>
              <div className={`${style?.Rate} px-1`}>
                <p className={`fw-bold text-end ${style?.font_13}`}>
                  {NumberWithCommas(e?.metalRate, 2)}
                </p>
                {e?.CertificateNo !== "" && (
                  <p className="invisible">&nbsp;12</p>
                )}
                {e?.diamonds?.map((ele, ind) => {
                  return (
                    <p className={`pt-1 text-end ${style?.font_13}`} key={ind}>
                      {" "}
                      {NumberWithCommas(ele?.Rate, 2)}{" "}
                    </p>
                  );
                })}
                {e?.colorstone?.map((ele, ind) => {
                  return (
                    <p className={`pt-1 text-end ${style?.font_13}`} key={ind}>
                      {" "}
                      {NumberWithCommas(ele?.Rate, 2)}{" "}
                    </p>
                  );
                })}
              </div>
              <div className={`${style?.VA} px-1`}>
                <p className={`fw-bold text-end ${style?.font_13}`}>
                  {NumberWithCommas(e?.MakingAmount + e?.LossAmt, 2)}
                </p>
              </div>
              <div className={`${style?.Amount} px-1`}>
                {/* <p className={`fw-bold text-end ${style?.font_13}`}>{NumberWithCommas(e?.TotalAmount - e?.OtherCharges - e?.finding?.reduce((acc, cObj) => acc + cObj?.SettingAmount, 0), 2)}</p> */}
                <p className={`fw-bold text-end ${style?.font_13}`}>
                  {NumberWithCommas(e?.MakingAmount + e?.MetalAmount, 2)}
                </p>
                {e?.CertificateNo !== "" && (
                  <p className="invisible">&nbsp;00</p>
                )}
                {e?.diamonds?.map((ele, ind) => {
                  return (
                    <p className={`pt-1 text-end ${style?.font_13}`} key={ind}>
                      {" "}
                      {NumberWithCommas(ele?.Amount, 2)}{" "} 
                    </p>
                  );
                })}
                {e?.colorstone?.map((ele, ind) => {
                  return (
                    <p className={`pt-1 text-end ${style?.font_13}`} key={ind}>
                      {" "}
                      {NumberWithCommas(ele?.Amount, 2)}{" "}
                    </p>
                  );
                })}
                {(e?.OtherCharges +
                  e?.misc?.reduce((acc, cObj) => acc + cObj?.Amount, 0) +
                  e?.totals?.diamonds?.SettingAmount +
                  e?.totals?.colorstone?.SettingAmount +
                  e?.finding?.reduce(
                    (acc, cObj) => acc + cObj?.SettingAmount,
                    0
                  ) +
                  e?.TotalDiamondHandling >
                  0 &&
                  e?.totals?.diamonds?.Pcs + e?.totals?.colorstone?.Pcs > 0) >
                  0 && (
                  <p className={`pt-1 text-end ${style?.font_13}`}>
                    {NumberWithCommas(
                      e?.OtherCharges +
                        e?.misc?.reduce((acc, cObj) => acc + cObj?.Amount, 0) +
                        e?.totals?.diamonds?.SettingAmount +
                        e?.totals?.colorstone?.SettingAmount +
                        e?.finding?.reduce(
                          (acc, cObj) => acc + cObj?.SettingAmount,
                          0
                        ) +
                        e?.TotalDiamondHandling,
                      2
                    )}{" "}
                  </p>
                )}
              </div>
            </div>
          );
        })}
        {/* table total */}
        <div className="d-flex border-start border-end border-bottom py-1 no_break">
          <div className={`${style?.total} px-1`}>
            <p className={`fw-bold text-center ${style?.font_15}`}>Total</p>
          </div>
          {/* <div className={`${style?.HSN} px-1`}><p className={`fw-bold ${style?.font_15}`}></p></div> */}
          <div className={`${style?.Pcs} px-1`}>
            <p className={`fw-bold text-end ${style?.font_15}`}>
              {NumberWithCommas(data?.mainTotal?.total_Quantity, 0)}
            </p>
          </div>
          <div className={`${style?.GGms} px-1`}>
            <p className={`fw-bold text-end ${style?.font_15}`}>
              {NumberWithCommas(data?.mainTotal?.grosswt, 3)}{" "}
            </p>
          </div>
          <div className={`${style?.Stone} px-1`}>
            <p className="fw-bold text-end"></p>
          </div>
          <div className={`${style?.NGms} px-1`}>
            <p className={`fw-bold text-end ${style?.font_15}`}>
              {NumberWithCommas(data?.mainTotal?.netwt, 3)}
            </p>
          </div>
          <div className={`${style?.Rate} px-1`}>
            <p className="fw-bold text-end"></p>
          </div>
          <div className={`${style?.VA} px-1`}>
            <p className="fw-bold text-end"></p>
          </div>
          <div className={`${style?.Amount} px-1`}>
            <p className={`fw-bold text-end ${style?.font_15}`}>
              {/* {NumberWithCommas(data?.mainTotal?.total_amount, 2)}  */}
              {NumberWithCommas(data?.mainTotal?.totalAmounts, 2)}
            </p>
          </div>
        </div>
        {/* table taxes */}
        <div className="d-flex border-start border-end border-bottom no_break">
          <div className="col-8 border-end p-2">
            <div className="d-flex justify-content-between pb-1">
              <p className={`fw-bold ${style?.font_15}`}>
                Advances {headerData?.InvoiceNo}
              </p>
              <p className={`fw-bold ${style?.font_15}`}>
                {NumberWithCommas(headerData?.AdvanceAmount, 2)}
              </p>
            </div>
            <div className="d-flex pb-1">
              <p className={`fw-bold pe-1 ${style?.font_15}`}>Remark : </p>
              <p className={`fw-bold ps-1 ${style?.font_15}`} dangerouslySetInnerHTML={{ __html: headerData?.PrintRemark }}>
              </p>
            </div>
            <div className="d-flex justify-content-between pb-1">
              <p className={`fw-bold ${style?.font_15}`}>Credit : </p>
              <p className={`fw-bold ${style?.font_15}`}>
                {/* {NumberWithCommas(headerData?.BankReceived, 2)} */}
              </p>
            </div>
            <div className="d-flex justify-content-between pb-1">
              <p className={`fw-bold ${style?.font_15}`}>Cash : </p>
              <p className={`fw-bold ${style?.font_15}`}>
                {/* {NumberWithCommas(headerData?.CashReceived, 2)} */}
              </p>
            </div>
          </div>
          <div className="col-4 p-2 d-flex flex-column justify-content-end">
            <div className="d-flex justify-content-between pb-1">
              <p className={` ${style?.font_15}`}>Discount </p>
              <p className={` ${style?.font_15}`}>
                {NumberWithCommas(data?.mainTotal?.total_discount_amount, 2)}
              </p>
            </div>
            <div className="d-flex justify-content-between pb-1">
              <p className={`fw-bold ${style?.font_15}`}>Total Amount</p>
              <p className={`fw-bold ${style?.font_15}`}>
                {NumberWithCommas(
                  (data?.mainTotal?.total_amount + headerData?.FreightCharges) /
                    headerData?.CurrencyExchRate,
                  2
                )}
              </p>
            </div>
            {data?.allTaxes?.map((e, i) => {
              return (
                <div className="d-flex justify-content-between pb-1" key={i}>
                  <p className={` ${style?.font_15}`}>
                    {e?.name} @ {e?.per}
                  </p>
                  <p className={` ${style?.font_15}`}>
                    {NumberWithCommas(+e?.amount, 2)}
                  </p>
                </div>
              );
            })}
            {headerData?.AddLess !== 0 && (
              <div className="d-flex justify-content-between pb-1">
                <p className={` ${style?.font_15}`}>
                  {headerData?.AddLess < 0 ? "Less" : "Add"}{" "}
                </p>
                <p className={` ${style?.font_15}`}>
                  {NumberWithCommas(
                    headerData?.AddLess / headerData?.CurrencyExchRate,
                    2
                  )}
                </p>
              </div>
            )}
            <div className="d-flex justify-content-between pb-1">
              <p className={`fw-bold ${style?.font_15}`}>Grand Total </p>
              <p className={`fw-bold ${style?.font_15}`}>
                {NumberWithCommas(
                  +fixedValues(
                    (data?.mainTotal?.total_amount +
                      headerData?.FreightCharges) /
                      headerData?.CurrencyExchRate,
                    2
                  ) +
                    data?.allTaxes?.reduce(
                      (acc, cObj) => acc + +fixedValues(+cObj?.amount, 2),
                      0
                    ) +
                    +fixedValues(
                      headerData?.AddLess / headerData?.CurrencyExchRate,
                      2
                    ),
                  2
                )}
              </p>
            </div>
          </div>
        </div>
        {/* amount in words */}
        <div className="py-1 px-2 no_break">
          <p className={` ${style?.font_14}`}>
            <span className={`fw-bold ${style?.font_14}`}>{headerData?.Currencyname} :</span>{" "}
            {toWords?.convert(
              +fixedValues(
                +fixedValues(
                  (data?.mainTotal?.total_amount + headerData?.FreightCharges) /
                    headerData?.CurrencyExchRate,
                  2
                ) +
                  data?.allTaxes?.reduce(
                    (acc, cObj) => acc + +fixedValues(+cObj?.amount, 2),
                    0
                  ) +
                  +fixedValues(
                    headerData?.AddLess / headerData?.CurrencyExchRate,
                    2
                  ),
                2
              )
            )}{" "}
            Only.
          </p>
        </div>
        {/* declaration */}
        <p
          className="fw-bold pt-1 px-2 pb-2 no_break"
          dangerouslySetInnerHTML={{ __html: headerData?.Declaration }}
        ></p>
        {/* note */}
        <div
          className={`${style.footerContainer} ${footer2.container} no_break target_footer no_break`}
        >
          <div
            className={footer2.block1f3}
            style={{ width: "33.33%", borderRight: "1px solid #e8e8e8" }}
          >
            <div className={footer2.linesf3} style={{ fontWeight: "bold" }}>
              Bank Detail
            </div>
            <div className={footer2.linesf3} style={{wordBreak: "normal"}}>
              Bank Name: {headerData?.bankname}
            </div>
            <div className={footer2.linesf3} style={{wordBreak: "normal"}}>
              Branch: {headerData?.bankaddress}
            </div>
            <div className={footer2.linesf3} style={{wordBreak: "normal"}}>
              Account Name: {headerData?.accountname}
            </div>
            <div className={footer2.linesf3} style={{wordBreak: "normal"}}>
              Account No. : {headerData?.accountnumber}
            </div>
            <div className={footer2.linesf3} style={{wordBreak: "normal"}}>
              RTGS/NEFT IFSC: {headerData?.rtgs_neft_ifsc}
            </div>
            <div className={footer2.linesf3} style={{wordBreak: "normal"}}>
              Enquiry No.
            </div>
            <div className={footer2.linesf3}>(E & OE)</div>
          </div>
          <div
            className={footer2.block2f3}
            style={{ width: "33.33%", borderRight: "1px solid #e8e8e8" }}
          >
            <div className={footer2.linesf3}>
              {headerData?.customerfirmname}
            </div>
            <div className={`${footer2.linesf3} fw-medium`}>
              Customer's Signature
            </div>
          </div>
          <div className={footer2.block2f3} style={{ width: "33.33%" }}>
            <div className={footer2.linesf3}>{headerData?.CompanyFullName}</div>
            <div className={`${footer2.linesf3} fw-medium`}>
              Authorised Signature
            </div>
          </div>
        </div>
      </div>
      {/* <SampleDetailPrint11 /> */}
    </>
  ) : (
    <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
      {msg}
    </p>
  );
};

export default InvoicePrint9;
