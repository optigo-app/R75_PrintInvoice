import React, { useState } from 'react'
import "./css/invoiceprint.css"
import Button from '../../GlobalFunctions/Button';
const InvoicePrint = () => {
    const result = {};
    const [isImageWorking, setIsImageWorking] = useState(true);
    const handleImageErrors = () => {
        setIsImageWorking(false);
      };
      const data = [1,2,3,4,5,6];
  return (
    <>
    <div className='main_ip_ms'>
        <div className='container_ip_ms'>
                <div className='d-flex justify-content-end align-items-center my-3 matsal_print_btn_none'>
                    <Button />
                </div>
                {/* header */}
                <div>
                  <div className="pheaddp10">
                    {result?.header?.PrintHeadLabel} TAX INVOICE
                  </div>
                  <div className="d-flex justify-content-between">
                    <div className="p-1 fs_invp_ms">
                      <div className="fw-bold fs-6 py-2">
                        {result?.header?.CompanyFullName}
                      </div>
                      <div>{result?.header?.CompanyAddress}</div>
                      <div>{result?.header?.CompanyAddress2}</div>
                      <div>{result?.header?.CompanyCity}</div>
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
                        {result?.header?.Pannumber}
                      </div>
                    </div>
                    <div className="d-flex justify-content-end pe-2 pt-2">
                    {isImageWorking && (result?.header?.PrintLogo !== "" && 
                      <img src={result?.header?.PrintLogo} alt="" 
                      className='w-100 h-auto ms-auto d-block object-fit-contain'
                      onError={handleImageErrors} height={120} width={150} style={{maxWidth: "116px"}} />)}
                      {/* <img
                        src={result?.header?.PrintLogo}
                        alt="#companylogo"
                        className="imgHWdp10"
                      /> */}
                    </div>
                  </div>
                </div>
                {/* subheader */}
                <div className="subheaderdp10">
                  <div className="subdiv1dp10 border-end fsgdp10 border-start ">
                    <div className="px-1">{result?.header?.lblBillTo}</div>
                    <div className="px-1 fw-bold">
                      {result?.header?.customerfirmname}
                    </div>
                    <div className="px-1">
                      {result?.header?.customerAddress2}
                    </div>
                    <div className="px-1">
                      {result?.header?.customerAddress1}
                    </div>
                    <div className="px-1">
                      {result?.header?.customerAddress3}
                    </div>
                    <div className="px-1">
                      {result?.header?.customercity1}-{result?.header?.PinCode}
                    </div>
                    <div className="px-1">{result?.header?.customeremail1}</div>
                    <div className="px-1">{result?.header?.vat_cst_pan}</div>
                    <div className="px-1">
                      {result?.header?.Cust_CST_STATE}-
                      {result?.header?.Cust_CST_STATE_No}
                    </div>
                  </div>
                  <div className="subdiv2dp10 border-end fsgdp10">
                    <div className="px-1">Ship To,</div>
                    <div className="px-1 fw-bold">
                      {result?.header?.customerfirmname}
                    </div>
                    {result?.header?.address?.map((e, i) => {
                      return (
                        <div className="px-1" key={i}>
                          {e}
                        </div>
                      );
                    })}
                  </div>
                  <div className="subdiv3dp10 fsgdp10 border-end">
                    <div className="d-flex justify-content-start px-1">
                      <div className="w-25 fw-bold fs2_ip_ms">BILL NO</div>
                      <div className="w-25">{result?.header?.InvoiceNo}</div>
                    </div>
                    <div className="d-flex justify-content-start px-1">
                      <div className="w-25 fw-bold fs2_ip_ms">DATE</div>
                      <div className="w-25">{result?.header?.EntryDate}</div>
                    </div>
                    <div className="d-flex justify-content-start px-1">
                      <div className="w-25 fw-bold fs2_ip_ms">
                        {result?.header?.HSN_No_Label}
                      </div>
                      <div className="w-25">{result?.header?.HSN_No}</div>
                    </div>
                    
                  </div>
                </div>
                {/* table */}
                <div>
                    <div className='d-flex fw-bold border_start_ip_ms border_bottom_ip_ms'>
                        <div className=' centerdp10 border_end_ip_ms col1_ip_ms'>Sr#</div>
                        <div className=' centerdp10 border_end_ip_ms col2_ip_ms'>Description</div>
                        <div className=' centerdp10 border_end_ip_ms col3_ip_ms'>HSN#</div>
                        <div className=' centerdp10 border_end_ip_ms col4_ip_ms'>Shape</div>
                        <div className=' centerdp10 border_end_ip_ms col5_ip_ms'>Quality</div>
                        <div className=' centerdp10 border_end_ip_ms col6_ip_ms'>Color</div>
                        <div className=' centerdp10 border_end_ip_ms col7_ip_ms'>Size</div>	
                        <div className=' centerdp10 border_end_ip_ms col8_ip_ms'>Weight</div>
                        <div className=' centerdp10 border_end_ip_ms col9_ip_ms'>Pure Wt</div>
                        <div className=' centerdp10 border_end_ip_ms col10_ip_ms'>Pieces</div>
                        <div className=' centerdp10 border_end_ip_ms col11_ip_ms'>Rate</div>
                        <div className=' centerdp10 border_end_ip_ms col12_ip_ms'>Amount</div>
                        <div className=' centerdp10 border_end_ip_ms col13_ip_ms'>Lab. <br /> Rate</div>
                        <div className=' centerdp10 border_end_ip_ms col14_ip_ms'>Lab. <br /> Amount</div>
                        <div className=' centerdp10 border_end_ip_ms col15_ip_ms'>Taxable <br /> Amount</div>
                    </div>
                    <div>
                    {
                        data?.map((e, i) => {
                            return <div className='d-flex border_start_ip_ms border_bottom_ip_ms' key={i}>
                            <div className='border_end_ip_ms col1_ip_ms ps_ip_ms centerdp10'>{i+1}</div>
                            <div className='border_end_ip_ms col2_ip_ms ps_ip_ms'>Description</div>
                            <div className='border_end_ip_ms col3_ip_ms ps_ip_ms'>HSN#</div>
                            <div className='border_end_ip_ms col4_ip_ms ps_ip_ms'>Shape</div>
                            <div className='border_end_ip_ms col5_ip_ms ps_ip_ms'>Quality</div>
                            <div className='border_end_ip_ms col6_ip_ms ps_ip_ms'>Color</div>
                            <div className='border_end_ip_ms col7_ip_ms ps_ip_ms'>Size</div>	
                            <div className='border_end_ip_ms col8_ip_ms end_dp10 pe_ip_ms'>Weight</div>
                            <div className='border_end_ip_ms col9_ip_ms end_dp10 pe_ip_ms'>Pure Wt</div>
                            <div className='border_end_ip_ms col10_ip_ms end_dp10 pe_ip_ms'>Pieces</div>
                            <div className='border_end_ip_ms col11_ip_ms end_dp10 pe_ip_ms'>Rate</div>
                            <div className='border_end_ip_ms col12_ip_ms end_dp10 pe_ip_ms'>Amount</div>
                            <div className='border_end_ip_ms col13_ip_ms end_dp10 pe_ip_ms'> Rate</div>
                            <div className='border_end_ip_ms col14_ip_ms end_dp10 pe_ip_ms'> Amount</div>
                            <div className='border_end_ip_ms col15_ip_ms end_dp10 pe_ip_ms'> Amount</div>
                        </div>
                        })
                    }
                    </div>
                    <div className='d-flex fw-bold border_start_ip_ms border_bottom_ip_ms'>
                        <div className='border_end_ip_ms col1_ip_ms ps_ip_ms'></div>
                        <div className='border_end_ip_ms col2_ip_ms ps_ip_ms'></div>
                        <div className='border_end_ip_ms col3_ip_ms ps_ip_ms'></div>
                        <div className='border_end_ip_ms col4_ip_ms ps_ip_ms'></div>
                        <div className='border_end_ip_ms col5_ip_ms ps_ip_ms'></div>
                        <div className='border_end_ip_ms col6_ip_ms ps_ip_ms'></div>
                        <div className='border_end_ip_ms col7_ip_ms ps_ip_ms'></div>	
                        <div className='border_end_ip_ms col8_ip_ms end_dp10 pe_ip_ms'>Weight</div>
                        <div className='border_end_ip_ms col9_ip_ms end_dp10 pe_ip_ms'>Pure Wt</div>
                        <div className='border_end_ip_ms col10_ip_ms end_dp10 pe_ip_ms'>Pieces</div>
                        <div className='border_end_ip_ms col11_ip_ms end_dp10 pe_ip_ms'>Rate</div>
                        <div className='border_end_ip_ms col12_ip_ms end_dp10 pe_ip_ms'>Amount</div>
                        <div className='border_end_ip_ms col13_ip_ms end_dp10 pe_ip_ms'> Rate</div>
                        <div className='border_end_ip_ms col14_ip_ms end_dp10 pe_ip_ms'> Amount</div>
                        <div className='border_end_ip_ms col15_ip_ms end_dp10 pe_ip_ms'> Amount</div>
                    </div>
                </div>
                {/* taxes */}
                <div className='d-flex justify-content-between'>
                    <div style={{width:'77%'}}>space</div>
                    <div style={{width:'23%'}} className='border_start_ip_ms d-flex fw-bold  border_end_ip_ms'>
                        <div className='pe_ip_ms end_dp10' style={{width:'60%'}}>CGST</div>
                        <div className='end_dp10 border_start_ip_ms pe_ip_ms' style={{width:'40%'}}>328</div>
                    </div>
                </div>

                <div className='d-flex justify-content-between border_end_ip_ms  border_top_ip_ms border_bottom_ip_ms border_start_ip_ms ps_ip_ms'>
                    <div style={{width:'77%'}} className='d-flex flex-col justify-content-end'>
                        <div>In Words Indian Rupees</div>
                        <div className='fw-bold'>Twenty-One Thousand Nine Hundred and Fifty-Six Only</div>
                    </div>
                    <div style={{width:'23%'}} className=' d-flex flex-col fw-bold border_start_ip_ms '>
                        <div className='fw-bold d-flex w-100 border_bottom_ip_ms '><div style={{width:'60%'}} className=' end_dp10 pe_ip_ms'>Less</div><div className='pe_ip_ms end_dp10 border_start_ip_ms'  style={{width:'40%'}}>0.05</div></div>
                        <div className='fw-bold d-flex w-100'><div style={{width:'60%'}} className='ps_ip_ms end_dp10 pe_ip_ms py-2'>GRAND TOTAL</div><div className='pe_ip_ms end_dp10 border_start_ip_ms py-2'  style={{width:'40%'}}>0.05</div></div>
                    </div>
                </div>
                
                {/* Declaration */}
                <div
                  className="mt-1 bradp7 p-1 hcompdp7 fsgdp7"
                  dangerouslySetInnerHTML={{
                    __html: result?.header?.Declaration,
                  }}
                >
                
                </div>

                {/* footer */}
                <div className="d-flex footer_bank hcompdp7 fsgdp7 mt-1">
                  <div className="subheaddiv_1">
                    <div className="fw-bold">Bank Detail</div>
                    <div>Bank Name: {result?.header?.bankname}</div>
                    <div>Branch: {result?.header?.bankaddress}</div>
                    <div>Account Name: {result?.header?.accountname}</div>
                    <div>Account No. : {result?.header?.accountnumber}</div>
                    <div>RTGS/NEFT IFSC: {result?.header?.rtgs_neft_ifsc}</div>
                    <div>Enquiry No. (E & OE)</div>
                  </div>
                  <div className="subheaddiv_1 d-flex flex-column justify-content-between align-items-start">
                    <div>Signature</div>
                    <div className="fw-bold mb-2">
                      {result?.header?.customerfirmname}
                    </div>
                  </div>
                  <div className="subheaddiv_1 d-flex flex-column justify-content-between align-items-start border-end-0">
                    <div>Signature</div>
                    <div className="fw-bold mb-2">
                      {result?.header?.CompanyFullName}
                    </div>
                  </div>
                </div>
        </div>
    </div>
    </>
  )
}

export default InvoicePrint