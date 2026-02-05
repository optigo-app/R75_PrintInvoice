//Invoice print 2 - material sale return
import "./css/invoiceprint2.css";

function InvoicePrint2() {
  return (
    <div className="printMain">
      <div className="App">
        <div>
          <div className="main_header">
            <p style={{ margin: "0px" }}>TAX INVOICE</p>
          </div>
          <div style={{ marginTop: "10px" }}>
            <div className="topmainSection_main">
              <div className="topBox1">
                <p className="topBox_p">Bill To,</p>
                <p className="topBox_p">
                  <b>Kiran gems</b>
                </p>
                <p className="topBox_p"> -395002 </p>
                <p className="topBox_p">support@optigo.com</p>
              </div>
              <div className="topBox2">
                <p className="topBox_p"> Ship To,</p>
                <p className="topBox_p">
                  <b> Kiran gems</b>
                </p>
                <p className="topBox_p"> kiran patel </p>
                <p className="topBox_p"> Gujarat</p>
                <p className="topBox_p"> India-395002 </p>
                <p className="topBox_p"> Mobile No : 951-021-3588</p>
              </div>
              <div className="topBox3">
                <p className="topBox_p">
                  <b style={{ width: "100px", display: "flex" }}> BILL NO</b>{" "}
                  MSR130
                </p>
                <p className="topBox_p">
                  {" "}
                  <b style={{ width: "100px", display: "flex" }}>DATE </b>15 Jan
                  2025
                </p>
                <p className="topBox_p">
                  <b style={{ width: "100px", display: "flex" }}> DUE DATE </b>
                  15 Jan 2025
                </p>
              </div>
            </div>
            <div className="second_main_box_div">
              <div>
                <div className="second_box_top_title">
                  <p className="second_box_top_title_colm1">Sr#</p>
                  <p className="second_box_top_title_colm2">Description</p>
                  <p className="second_box_top_title_colm3">Shape</p>
                  <p className="second_box_top_title_colm4">Quality</p>
                  <p className="second_box_top_title_colm5">Color</p>
                  <p className="second_box_top_title_colm6">Size</p>
                  <p className="second_box_top_title_colm7">Weight</p>
                  <p className="second_box_top_title_colm8">Rate</p>
                  <p className="second_box_top_title_colm9">Amount ₹</p>
                </div>
                <div>
                  {Array.from({ length: 5 }, (_, index) => ({
                    id: index + 1,
                    sr: index + 1,
                    description: `GOLD ${index + 1}`,
                    shape: index % 2 === 0 ? "Round" : "-",
                    quality: index % 2 === 0 ? "22K" : "14K",
                    color: index % 2 === 0 ? "prime master" : "White",
                    size: `${5 + index}mm`,
                    weight: `${(index + 5) * 2}`,
                    rate: `${(index + 1) * 50}`,
                    amount: `${(index + 1) * 30}`,
                  })).map((data) => (
                    <div key={data.id} className="second_box_description_main">
                      <p className="second_box_top_title_colm1">{data.sr}</p>
                      <p
                        className="second_box_top_title_colm2"
                        style={{ textAlign: "left" }}
                      >
                        {data.description}
                      </p>
                      <p
                        className="second_box_top_title_colm3"
                        style={{ textAlign: "left" }}
                      >
                        {data.shape}
                      </p>
                      <p className="second_box_top_title_colm4">
                        {data.quality}
                      </p>
                      <p
                        className="second_box_top_title_colm5"
                        style={{ textAlign: "left" }}
                      >
                        {data.color}
                      </p>
                      <p
                        className="second_box_top_title_colm6"
                        style={{ textAlign: "left" }}
                      >
                        {data.size}
                      </p>
                      <p
                        className="second_box_top_title_colm7"
                        style={{ textAlign: "right" }}
                      >
                        {data.weight}
                      </p>
                      <p
                        className="second_box_top_title_colm8"
                        style={{ textAlign: "right" }}
                      >
                        {data.rate}
                      </p>
                      <p
                        className="second_box_top_title_colm9"
                        style={{ textAlign: "right" }}
                      >
                        {data.amount}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{padding: '4px'}}>
                <p className="secondBox_bottom_desc">
                  1.I/We hereby certify that my/our registration certificate
                  under the Goods And Service Tax Act 2017. Is in force on the
                  date on which the sale of the goods specified in the tax
                  invoice has been effected by me/us & it shall accounted for in
                  the turnover of sales while filing of return & the due tax.If
                  any payable on the sale has been paid or shall be paids.
                </p>
                <p className="secondBox_bottom_desc">
                  2.Returns of goods are subject to Terms & Conditions as
                  mentioned in www.orail.com.
                </p>
                <p className="secondBox_bottom_desc">
                  {" "}
                  3.The support is limited to working hours.{" "}
                </p>
                <p className="secondBox_bottom_desc">
                  {" "}
                  4.Any case disapprency to jurdisory of state of gujarat.
                </p>
              </div>
            </div>
            <div className="bottomSection_main">
              <div className="bottomSection_main_Box1">
                <p className="bottom_box_one_p">Bank Detail </p>
                <p className="bottom_box_one_p">
                  Bank Name:Kotak Mahindra Bank
                </p>
                <p className="bottom_box_one_p">
                  {" "}
                  Branch:SHOP NO-1 WTC , UDHNA DARWAJA SURAT-395004{" "}
                </p>
                <p className="bottom_box_one_p">
                  {" "}
                  Account Name:Orail services
                </p>{" "}
                <p className="bottom_box_one_p">
                  {" "}
                  Account No:147275899632
                </p>{" "}
                <p className="bottom_box_one_p">
                  {" "}
                  RTGS/NEFT IFSC:Kotak00000405
                </p>
              </div>
              <div className="bottomSection_main_Box2">
                <p style={{display: 'flex', margin: '0px'}}>Signature</p>
                <p style={{display: 'flex', margin: '0px'}}><b>Kiran gems</b></p>
              </div>
              <div className="bottomSection_main_Box3">
                <p style={{display: 'flex', margin: '0px'}}>Signature</p>
                <p style={{display: 'flex', margin: '0px'}}><b>Optigo</b></p>
              </div>
            </div>
          </div>
        </div>
        <button onClick={() => window.print()} style={{ marginTop: "80px" }}>
          Print
        </button>
      </div>
    </div>
  );
}
export default InvoicePrint2;