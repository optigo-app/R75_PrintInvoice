import React, { useEffect, useState } from "react";
import { apiCall, checkMsg, formatAmount, handlePrint, isObjectEmpty } from "../../GlobalFunctions";
import * as lsh from "lodash";
import { OrganizeDataPrint } from "../../GlobalFunctions/OrganizeDataPrint";
import Loader from "../../components/Loader";
import "../../assets/css/prints/summary7s.css";
import { ToWords } from "to-words";
const Summary7 = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {

  const toWords = new ToWords();

  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState("");
  const [loader, setLoader] = useState(true);
  const [isImageWorking, setIsImageWorking] = useState(true);
  const handleImageErrors = () => {
    setIsImageWorking(false);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function loadData(data) {
    const copydata = lsh.cloneDeep(data);

    let address = copydata?.BillPrint_Json[0]?.Printlable?.split("\r\n");
    copydata.BillPrint_Json[0].address = address;

    const datas = OrganizeDataPrint(
      copydata?.BillPrint_Json[0],
      copydata?.BillPrint_Json1,
      copydata?.BillPrint_Json2
    );

    setResult(datas);
  }

  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <>
          {msg === "" ? (
            <div>
              <div className="container7s mb-5 pb-5">
                <div className="mt-5 mb-3 d-flex justify-content-end align-items-center HSDivs7"><button className="btn_white blue" onClick={() => handlePrint()}>Print</button></div>
                <div className="d-flex justify-content-end ">
                  {/* header */}
                  <div>
                    <div className="fw-bold d-flex justify-content-end">
                      {result?.header?.CompanyFullName}
                    </div>
                    <div className="d-flex justify-content-end">
                      {result?.header?.CompanyAddress}
                    </div>
                    <div className="d-flex justify-content-end">
                      {result?.header?.CompanyCity}-
                      {result?.header?.CompanyPinCode}
                    </div>
                    <div className="d-flex justify-content-end">
                      {result?.header?.Company_VAT_GST_No}
                    </div>
                  </div>
                </div>
                {/* head line */}
                <div className="border-top border-bottom border-black text-center fw-bold fs-5">
                  TAX INVOICE
                </div>
                {/* invoice details */}
                <div className="border-bottom border-black py-1">
                  <div className="d-flex">
                    <div className="w-50">Invoice No : </div>
                    <div className="w-50 fw-bold">
                      {result?.header?.InvoiceNo}
                    </div>
                  </div>
                  <div className="d-flex">
                    <div className="w-50">Date : </div>
                    <div className="w-50 fw-bold">
                      {result?.header?.EntryDate}
                    </div>
                  </div>
                  <div className="d-flex">
                    <div className="w-50">HSN Code : </div>
                    <div className="w-50 fw-bold">{result?.header?.HSN_No}</div>
                  </div>
                  <div className="d-flex">
                    <div className="w-50">Cashier : </div>
                    <div className="w-50 fw-bold">
                      {result?.header?.SalPerName?.split(" ")[0]}
                    </div>
                  </div>
                </div>
                {/* cust details */}
                <div className="border-bottom border-black">
                  <div className="d-flex">
                    <div className="w-50">Customer Name:</div>
                    <div className="fw-bold w-50">
                      {result?.header?.customerfirmname}
                    </div>
                  </div>
                  <div className="d-flex">
                    <div className="w-50">Customer Mobile:</div>
                    <div className="fw-bold w-50">
                      {result?.header?.customermobileno}
                    </div>
                  </div>
                </div>
                {/* table */}
                <div>
                  {/* table body */}
                  <div className="fw-bold d-flex">
                    <div className="col1s7">Sr#</div>
                    <div className="col2s7">
                      <div>Job#</div>
                      <div>Design#</div>
                      <div>Product</div>
                    </div>
                    <div className="col3s7">
                      <div>Net Wt</div>
                      <div>GrossWt</div>
                      <div>StoneWt</div>
                    </div>
                    <div className="col4s7">Qty</div>
                    <div className="col5s7 d-flex justify-content-end pe-2">
                      MRP
                    </div>
                  </div>
                  {/* table head */}
                  <div>
                    {result?.resultArray?.map((e, i) => {
                      return (
                        <div className="d-flex py-2 pbias7" key={i}>
                          <div className="col1s7">{e?.SrNo}</div>
                          <div className="col2s7">
                            <div>{e?.SrJobno}</div>
                            <div>{e?.designno}</div>
                            <div style={{ wordBreak: "break-word" }}>
                              {e?.Categoryname}
                            </div>
                          </div>
                          <div className="col3s7">
                            <div>{e?.NetWt?.toFixed(3)}</div>
                            <div>{e?.grosswt?.toFixed(3)}</div>
                            <div>{e?.totals?.misc?.Wt?.toFixed(3)}</div>
                          </div>
                          <div className="col4s7">{e?.Quantity}</div>
                          <div className="col5s7 d-flex justify-content-end pe-2">
                            {formatAmount(e?.TotalAmount)}
                          </div>
                        </div>
                      );
                    })}
                    <div className="d-flex border-black border-top border-bottom">
                      <div className="col1s7"></div>
                      <div className="col2s7 fw-bold">TOTAL</div>
                      <div className="col3s7">
                        <div>{result?.mainTotal?.netwt?.toFixed(3)}</div>
                        <div>{result?.mainTotal?.grosswt?.toFixed(3)}</div>
                        <div>{result?.mainTotal?.misc?.Wt?.toFixed(3)}</div>
                      </div>
                      <div className="col4s7">
                        {result?.mainTotal?.total_Quantity}
                      </div>
                      <div className="col5s7 d-flex justify-content-end pe-2">
                        {formatAmount(result?.mainTotal?.total_amount)}
                      </div>
                    </div>
                    <div className="border-bottom border-black pbias7">
                      <div className="d-flex justify-content-end">
                        <div style={{ width: "70%" }}>
                          {result?.allTaxes?.map((e, i) => {
                            return (
                              <div className="d-flex" key={i}>
                                <div className="w-50 d-flex justify-content-end">
                                  {e?.name} @ {e?.per}
                                </div>
                                <div className="w-50 d-flex justify-content-end">
                                  {e?.amount}
                                </div>
                              </div>
                            );
                          })}
                          <div className="d-flex">
                            <div className="w-50 d-flex justify-content-end">
                              {result?.header?.AddLess > 0 ? "Add" : "Less"}
                            </div>
                            <div className="w-50 d-flex justify-content-end">
                              {result?.header?.AddLess}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="fw-bold border-black border-bottom pbias7">
                      <div className="d-flex justify-content-end">
                        Final Amount:Rs.{formatAmount(((result?.finalAmount )))}
                      </div>
                      <div className="d-flex justify-content-end">
                        Payable Amount:Rs.{formatAmount(((result?.finalAmount )))}
                      </div>
                      <div className="fw-normal" style={{wordBreak:"break-word"}}>
                        In Words : {toWords.convert((result?.finalAmount ) )} Only
                      </div>
                    </div>
                    <div className="fw-bold pbias7">
                      <div>Terms & Conditions :</div>
                      <div style={{wordBreak:"break-word"}}
                        dangerouslySetInnerHTML={{
                          __html: result?.header?.Declaration,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

export default Summary7;
