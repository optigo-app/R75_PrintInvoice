import React from "react";
import "../../assets/css/prints/estimateprintK.css";
import { ToWords } from "to-words";
import { useState } from "react";
import Loader from "../../components/Loader";
import Button from "../../GlobalFunctions/Button";
import { useEffect } from "react";
import {
  apiCall,
  checkMsg,
  formatAmount,
  NumberWithCommas,
  fixedValues,
  isObjectEmpty,
} from "../../GlobalFunctions";
import { cloneDeep } from "lodash";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";
import { deepClone } from "@mui/x-data-grid/utils/utils";

const EstimatePrintK = ({ token, invoiceNo, printName, urls, evn, ApiVer }) => {
  const toWords = new ToWords();
  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const [purityWise, setPurityWise] = useState([]);

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
    setResult(datas);

    let pwise = [];

    datas?.resultArray?.forEach((el) => {
      let obj = deepClone(el);
      let findRec = pwise?.findIndex(
        (a) => a?.MetalTypePurity === obj?.MetalTypePurity
      );
      if (findRec === -1) {
        pwise.push(obj);
      } else {
        pwise[findRec].grosswt += obj?.grosswt;
        pwise[findRec].NetWt += obj?.NetWt;
        pwise[findRec].LossWt += obj?.LossWt;
      }
    });
    pwise.sort((a, b) => {
      const purityA = parseInt(a.MetalTypePurity.match(/\d+/)[0]);
      const purityB = parseInt(b.MetalTypePurity.match(/\d+/)[0]);
      return purityA - purityB;
    });
    setPurityWise(pwise);
  };

  const finalAmount =
    (result?.mainTotal?.TotalAmount + result?.header?.FreightCharges) /
      result?.header?.CurrencyExchRate +
    result?.allTaxesTotal;
  const decimalPart = parseFloat(
    (finalAmount - Math.floor(finalAmount)).toFixed(2)
  );
  let roundedAmount = finalAmount;
  if (decimalPart < 0.5) {
    roundedAmount = finalAmount - decimalPart;
  } else {
    roundedAmount = finalAmount + (1 - decimalPart);
  }
  // console.log("resultdata", result);

  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <>
          {msg === "" ? (
            <>
              <div className="container_jts">
                <div className="d-flex justify-content-end align-items-center d_none_jts">
                  <Button />
                </div>
                <div className="align-items-center">
                  <div className="fs_jts es_mainHead">
                    <div className="es_slFnt brb_jts">
                      <div style={{ marginBottom: "5px" }}>Estimate</div>
                    </div>
                    <div className="fs2_jts">
                      {result?.header?.CompanyFullName}
                    </div>
                    <div>{result?.header?.CompanyAddress}</div>
                    <div>{result?.header?.CompanyAddress2}</div>
                    <div>
                      {result?.header?.CompanyCity}-
                      {result?.header?.CompanyPinCode},{" "}
                      {result?.header?.CompanyState}(
                      {result?.header?.CompanyCountry})
                    </div>
                    <div>T {result?.header?.CompanyTellNo}</div>
                    <div>
                      {result?.header?.CompanyEmail} |{" "}
                      {result?.header?.CompanyWebsite}
                    </div>
                    <div>
                      {result?.header?.Company_VAT_GST_No} |{" "}
                      {result?.header?.Company_CST_STATE}-
                      {result?.header?.Company_CST_STATE_No} | PAN-
                      {result?.header?.Com_pannumber}
                    </div>
                  </div>
                  <div className="es_subHead brt_jts brb_jts es_slbld">
                    <div>
                      <div className="fs2_jts1">
                        Invoice No:{" "}
                        <span>
                          {result?.header?.InvoiceNo}
                        </span>
                      </div>
                      <div className="fs2_jts1">
                        Name:{" "}
                        <span>
                          {result?.header?.customerfirmname}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="fs2_jts1">
                        Date:{" "}
                        <span>
                          {result?.header?.EntryDate}
                        </span>
                      </div>
                      <div className="fs2_jts1">
                        Sales Person:{" "}
                        <span>
                          {result?.header?.SalesRepName}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="es_detHead fs_jts brb_jts es_slbld">
                    <div className="sevotfon spbrWord">Design</div>
                    <div className="sevotfsec">Gr.Wt</div>
                    <div className="sevotfthr spbrWord">St.Wt / D.Wt</div>
                    <div className="sevotffor">Net Wt</div>
                    <div className="sevotffiv">Rate</div>
                    <div className="sevotfsx">Making</div>
                    <div className="sevotfsev spbrWord">Other Charges</div>
                    <div className="sevplsone">Amount</div>
                  </div>
                </div>

                {result?.resultArray?.map((e, i) => {
                  return e?.metal?.map((el, id) => (
                    <div
                      key={`${i}-${id}`}
                      className="es_detBody fs_jts es_slbld"
                      style={{ paddingBottom: "15px" }}
                    >
                      <div className="sevotfon spbrWord">
                        <p>{e?.SrJobno}</p>
                        <p>{e?.designno}</p>
                      </div>
                      <div className="sevotfsec spbrWord">
                        {e?.grosswt?.toFixed(3)}
                      </div>
                      <div className="sevotfthr spbrWord">
                        {e?.totals?.colorstone?.Wt?.toFixed(3)} /{" "}
                        {e?.totals?.diamonds?.Wt?.toFixed(3)}
                      </div>
                      <div className="sevotffor spbrWord">
                        {e?.NetWt?.toFixed(3)}
                      </div>
                      <div className="sevotffiv spbrWord">
                        {NumberWithCommas(el?.Rate, 2)}
                      </div>
                      <div className="sevotfsx spbrWord">
                        {e?.MakingChargeDiscount !== 0
                          ? `${NumberWithCommas(e?.MakingChargeDiscount, 2)} %`
                          : e?.MaKingCharge_Unit === 0
                          ? ""
                          : `${NumberWithCommas(e?.MaKingCharge_Unit, 2)}`}
                      </div>
                      <div className="sevotfsev spbrWord">
                        {NumberWithCommas(e?.OtherCharges, 2)}
                      </div>
                      <div className="sevplsoneDp spbrWord">
                        {formatAmount(e?.TotalAmount + e?.DiscountAmt)}
                      </div>
                    </div>
                  ));
                })}

                <div className="es_detTotal fs_jts brt_jts brb_jts es_slbld">
                  <div className="sevotfon spbrWord">Total</div>
                  <div className="sevotfsec spbrWord">
                    {result?.mainTotal?.grosswt?.toFixed(3)}
                  </div>
                  <div className="sevotfthr spbrWord"></div>
                  <div className="sevotffor spbrWord">
                    {result?.mainTotal?.netwt?.toFixed(3)}
                  </div>
                  <div className="sevotffiv spbrWord"></div>
                  <div className="sevotfsx spbrWord"></div>
                  <div className="sevotfsev spbrWord"></div>
                  <div className="sevplsoneDp spbrWord">
                    {formatAmount(
                      result?.mainTotal?.total_amount +
                        result?.mainTotal?.total_discount_amount
                    )}
                  </div>
                </div>

                <div className="fs_jts es_dsflx es_slbld">
                  <div className="es_mTotal1"></div>
                  <div className="es_mTotal2">
                    {result?.mainTotal?.total_discount_amount !== 0 && (
                      <div className="es_dsflx">
                        <div className="es_mTotal2Sub1">Total Discount</div>{" "}
                        <div className="es_mTotal2Sub2">
                          {formatAmount(
                            result?.mainTotal?.total_discount_amount
                          )}
                        </div>
                      </div>
                    )}
                    {result?.mainTotal?.total_discount_amount !== 0 && (
                      <div className="es_dsflx">
                        <div className="es_mTotal2Sub1">Taxable Value</div>{" "}
                        <div className="es_mTotal2Sub2">
                          {formatAmount(
                            result?.mainTotal?.total_amount /
                              result?.header?.CurrencyExchRate
                          )}
                        </div>
                      </div>
                    )}
                    {result?.allTaxes?.map((e, i) => (
                      <div className="es_dsflx">
                        <div key={i} className="es_mTotal2Sub1 spbrWord">
                          {e?.name} @ {e?.per}
                        </div>
                        <div key={i} className="es_mTotal2Sub2">
                          {formatAmount(e?.amount)}
                        </div>
                      </div>
                    ))}
                    <div className="es_dsflx">
                      <div className="es_mTotal2Sub1">
                        {result?.header?.AddLess < 0 ? "Less" : "Add"}
                      </div>
                      <div className="es_mTotal2Sub2">
                        {formatAmount(result?.header?.AddLess)}
                      </div>
                    </div>
                    {result?.header?.FreightCharges !== 0 && (
                      <div className="es_dsflx">
                        <div className="es_mTotal2Sub1">
                          {result?.header?.ModeOfDel}
                        </div>
                        <div className="es_mTotal2Sub2">
                          {formatAmount(
                            result.header.FreightCharges /
                              result.header.CurrencyExchRate
                          )}
                        </div>
                      </div>
                    )}
                    {/* <div className="es_mTotal2Sub2">
                      {result?.mainTotal?.total_discount_amount !== 0 && (
                        <div>
                          {formatAmount(result?.mainTotal?.total_discount_amount)}
                        </div>
                      )}
                      {result?.mainTotal?.total_discount_amount !== 0 && (
                        <div>
                          {formatAmount(result?.mainTotal?.total_amount / result?.header?.CurrencyExchRate)}
                        </div>
                      )}
                      {result?.allTaxes?.map((e, i) => (
                        <div key={i}>
                          {formatAmount(e?.amount)}
                        </div>
                      ))}
                      <div>{formatAmount(result?.header?.AddLess)}</div>
                      {result?.header?.FreightCharges !== 0 && (<div>{formatAmount(result.header.FreightCharges / result.header.CurrencyExchRate)}</div>)}
                    </div> */}
                  </div>
                </div>

                <div className="fs_jts es_dsflx es_slbld brt_jts brb_jts">
                  <div className="es_mTotal1">
                    {" "}
                    Total Pcs : {result?.resultArray?.length}
                  </div>
                  <div className="es_mTotal2Dp">
                    <div className="es_mTotal2Sub1">Grand Total</div>
                    <div className="es_mTotal2Sub2">
                      {formatAmount(
                        (result?.finalAmount + result.header.FreightCharges) /
                          result?.header?.CurrencyExchRate
                      )}
                    </div>
                  </div>
                </div>

                <div className="fs_jts es_inwrds es_slbld">
                  <div className="spbrWord" style={{ width: "16%" }}>
                    In Words :{" "}
                  </div>
                  <div className="spbrWord" style={{ width: "84%" }}>
                    {toWords.convert(
                      +fixedValues(
                        (result.finalAmount + result.header.FreightCharges) /
                          result.header.CurrencyExchRate,
                        2
                      )
                    )}{" "}
                    Only.
                  </div>
                </div>

                <div className="fs_jts es_dsflx brt_jts brb_jts es_slPad es_slbld">
                  <div className="w33_jts es_sptxCen">E & O.E</div>
                  <div className="w33_jts es_sptxCen"></div>
                  <div className="w33_jts es_sptxCen">SIGN</div>
                </div>
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

export default EstimatePrintK;
