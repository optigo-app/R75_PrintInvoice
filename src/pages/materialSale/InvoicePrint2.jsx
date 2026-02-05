import React from 'react'
import "./css/invoiceprint2.css"
import Button from '../../GlobalFunctions/Button';
const InvoicePrint2 = () => {
    let result = {};
    let data = [1,2,3,4,5,6,7,8,9]
  return (
    <div className='d-flex justify-content-center align-items-center'>
        <div className='invp_2_ms_container'>
            <div className='d-flex justify-content-end align-items-center my-3 matsal_print_btn_none'>
                <Button />
            </div>
            <div className="pheaddp10">
                {result?.header?.PrintHeadLabel} TAX INVOICE
            </div>
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
                      <div className="w-25 fw-bold">BILL NO</div>
                      <div className="w-25">{result?.header?.InvoiceNo}</div>
                    </div>
                    <div className="d-flex justify-content-start px-1">
                      <div className="w-25 fw-bold">DATE</div>
                      <div className="w-25">{result?.header?.EntryDate}</div>
                    </div>
                    <div className="d-flex justify-content-start px-1">
                      <div className="w-25 fw-bold">
                        {result?.header?.HSN_No_Label}
                      </div>
                      <div className="w-25">{result?.header?.HSN_No}</div>
                    </div>
                  </div>
            </div>

            <div>
                <div className='d-flex fw-bold bradp7 mt-1 fsgdp7'>
                    <div className='colt1_invp2_ms center_invp2_ms brdp7 py-1'>Sr#</div>
                    <div className='colt2_invp2_ms center_invp2_ms brdp7'>Description</div>
                    <div className='colt3_invp2_ms center_invp2_ms brdp7'>Shape</div>
                    <div className='colt4_invp2_ms center_invp2_ms brdp7'>Quality</div>
                    <div className='colt5_invp2_ms center_invp2_ms brdp7'>Color</div>
                    <div className='colt6_invp2_ms center_invp2_ms brdp7'>Size</div>
                    <div className='colt7_invp2_ms center_invp2_ms brdp7'>Weight</div>
                    <div className='colt8_invp2_ms center_invp2_ms brdp7'>Rate</div>
                    <div className='colt9_invp2_ms center_invp2_ms '>Amount</div>
                </div>
                <div>
                    {data?.map((e, i) => {
                        return <div className='d-flex bradp7 fsgdp7' key={i}>
                                    <div className='colt1_invp2_ms center_invp2_ms brdp7 py-1'>{e}</div>
                                    <div className='colt2_invp2_ms center_invp2_ms brdp7 start_invp2_ms ps_invp2_ms'>Description</div>
                                    <div className='colt3_invp2_ms center_invp2_ms brdp7 start_invp2_ms ps_invp2_ms'>Shape</div>
                                    <div className='colt4_invp2_ms center_invp2_ms brdp7 start_invp2_ms ps_invp2_ms'>Quality</div>
                                    <div className='colt5_invp2_ms center_invp2_ms brdp7 start_invp2_ms ps_invp2_ms'>Color</div>
                                    <div className='colt6_invp2_ms center_invp2_ms brdp7 start_invp2_ms ps_invp2_ms'>Size</div>
                                    <div className='colt7_invp2_ms center_invp2_ms brdp7 end_invp2_ms pe_invp2_ms'>Weight</div>
                                    <div className='colt8_invp2_ms center_invp2_ms brdp7 end_invp2_ms pe_invp2_ms'>Rate</div>
                                    <div className='colt9_invp2_ms center_invp2_ms  end_invp2_ms pe_invp2_ms'>Amount</div>
                                </div>
                    })}
                </div>
                <div className='d-flex fw-bold bradp7  border-top-0 fsgdp7'>
                    <div className='colt1_invp2_ms center_invp2_ms brdp7 py-1'></div>
                    <div className='colt2_invp2_ms center_invp2_ms brdp7'></div>
                    <div className='colt3_invp2_ms center_invp2_ms brdp7'></div>
                    <div className='colt4_invp2_ms center_invp2_ms brdp7'></div>
                    <div className='colt5_invp2_ms center_invp2_ms brdp7'></div>
                    <div className='colt6_invp2_ms center_invp2_ms brdp7'></div>
                    <div className='colt7_invp2_ms center_invp2_ms brdp7 end_invp2_ms pe_invp2_ms'>1.256</div>
                    <div className='colt8_invp2_ms center_invp2_ms brdp7'></div>
                    <div className='colt9_invp2_ms center_invp2_ms  end_invp2_ms pe_invp2_ms'>21,978</div>
                </div>
            </div>
                    
            <div className='d-flex justify-content-between align-items-center fw-bold brbdp7 bldp7'>
                <div style={{width:'71.62%'}} className=' brdp7 p-1'>
                    <div className='fw-normal '>In Words Indian Rupees</div>
                    <div>Twenty-One Thousand Nine Hundred and Fifty-Six Only</div>
                </div>
                <div style={{width:'28.38%'}} className=' brdp7 '>
                    <div>
                        <div className='d-flex align-items-center'><div style={{width:'63%'}} className='end_invp2_ms pe_invp2_ms'>Less</div><div style={{width:'37%'}} className='end_invp2_ms bldp7 pe_invp2_ms'>1</div></div>
                        <div className='d-flex align-items-center brtdp7'><div style={{width:'63%'}} className='end_invp2_ms pe_invp2_ms p-1'>GRAND TOTAL</div><div style={{width:'37%'}} className='end_invp2_ms bldp7 pe_invp2_ms'>₹ 21,956.00</div></div>
                    </div>
                </div>
            </div>

            {/* <div>
                <div className='d-flex fw-bold bradp7 mt-1 fsgdp7'>
                    <div className='col1_invp2_ms center_invp2_ms brdp7 py-1'>Sr#</div>
                    <div className='col2_invp2_ms center_invp2_ms brdp7'>Description</div>
                    <div className='col3_invp2_ms center_invp2_ms brdp7'>Shape</div>
                    <div className='col4_invp2_ms center_invp2_ms brdp7'>Quality</div>
                    <div className='col5_invp2_ms center_invp2_ms brdp7'>Color</div>
                    <div className='col6_invp2_ms center_invp2_ms brdp7'>Size</div>
                    <div className='col7_invp2_ms center_invp2_ms brdp7'>Weight</div>
                    <div className='col8_invp2_ms center_invp2_ms brdp7'>Pieces</div>
                    <div className='col9_invp2_ms center_invp2_ms brdp7'>Rate</div>
                    <div className='col10_invp2_ms center_invp2_ms brdp7'>Amount</div>
                    <div className='col11_invp2_ms center_invp2_ms brdp7'>HSN#</div>
                    <div className='col12_invp2_ms center_invp2_ms brdp7'>CGST(%)</div>
                    <div className='col13_invp2_ms center_invp2_ms brdp7'>CSGT</div>
                    <div className='col14_invp2_ms center_invp2_ms brdp7'>SGST(%)</div>
                    <div className='col15_invp2_ms center_invp2_ms brdp7'>SGST</div>
                    <div className='col16_invp2_ms center_invp2_ms'>TOTAL AMT</div>
                </div>
                <div>
                    {data?.map((e, i) => {
                        return <div className='d-flex bradp7 fsgdp7' key={i}>
                                    <div className='col1_invp2_ms center_invp2_ms brdp7 py-1'>{e}</div>
                                    <div className='col2_invp2_ms center_invp2_ms brdp7 start_invp2_ms ps_invp2_ms'>Description</div>
                                    <div className='col3_invp2_ms center_invp2_ms brdp7 start_invp2_ms ps_invp2_ms'>Shape</div>
                                    <div className='col4_invp2_ms center_invp2_ms brdp7 start_invp2_ms ps_invp2_ms'>Quality</div>
                                    <div className='col5_invp2_ms center_invp2_ms brdp7 start_invp2_ms ps_invp2_ms'>Color</div>
                                    <div className='col6_invp2_ms center_invp2_ms brdp7 start_invp2_ms ps_invp2_ms'>Size</div>
                                    <div className='col7_invp2_ms center_invp2_ms brdp7 end_invp2_ms pe_invp2_ms'>Weight</div>
                                    <div className='col8_invp2_ms center_invp2_ms brdp7 end_invp2_ms pe_invp2_ms'>Pieces</div>
                                    <div className='col9_invp2_ms center_invp2_ms brdp7 end_invp2_ms pe_invp2_ms'>Rate</div>
                                    <div className='col10_invp2_ms center_invp2_ms brdp7 end_invp2_ms pe_invp2_ms'>Amount</div>
                                    <div className='col11_invp2_ms center_invp2_ms brdp7 end_invp2_ms pe_invp2_ms'>HSN#</div>
                                    <div className='col12_invp2_ms center_invp2_ms brdp7 end_invp2_ms pe_invp2_ms'>CGST(%)</div>
                                    <div className='col13_invp2_ms center_invp2_ms brdp7 end_invp2_ms pe_invp2_ms'>CSGT</div>
                                    <div className='col14_invp2_ms center_invp2_ms brdp7 end_invp2_ms pe_invp2_ms'>SGST(%)</div>
                                    <div className='col15_invp2_ms center_invp2_ms brdp7 end_invp2_ms pe_invp2_ms'>SGST</div>
                                    <div className='col16_invp2_ms center_invp2_ms end_invp2_ms pe_invp2_ms'>TOTAL AMT</div>
                                </div>
                    })}
                </div>
                <div className='d-flex fw-bold bradp7  border-top-0 fsgdp7'>
                    <div className='col1_invp2_ms center_invp2_ms brdp7 py-1'></div>
                    <div className='col2_invp2_ms center_invp2_ms brdp7'></div>
                    <div className='col3_invp2_ms center_invp2_ms brdp7'></div>
                    <div className='col4_invp2_ms center_invp2_ms brdp7'></div>
                    <div className='col5_invp2_ms center_invp2_ms brdp7'></div>
                    <div className='col6_invp2_ms center_invp2_ms brdp7'></div>
                    <div className='col7_invp2_ms center_invp2_ms brdp7 end_invp2_ms pe_invp2_ms'>1.256</div>
                    <div className='col8_invp2_ms center_invp2_ms brdp7 end_invp2_ms pe_invp2_ms'>2</div>
                    <div className='col9_invp2_ms center_invp2_ms brdp7'></div>
                    <div className='col10_invp2_ms center_invp2_ms brdp7 end_invp2_ms pe_invp2_ms'>21,978</div>
                    <div className='col11_invp2_ms center_invp2_ms brdp7'></div>
                    <div className='col12_invp2_ms center_invp2_ms brdp7'></div>
                    <div className='col13_invp2_ms center_invp2_ms brdp7 end_invp2_ms pe_invp2_ms'>113</div>
                    <div className='col14_invp2_ms center_invp2_ms brdp7'></div>
                    <div className='col15_invp2_ms center_invp2_ms brdp7 end_invp2_ms pe_invp2_ms'>112</div>
                    <div className='col16_invp2_ms center_invp2_ms end_invp2_ms pe_invp2_ms'>100000</div>
                </div>
            </div>
                    
            <div className='d-flex justify-content-end align-items-center fw-bold brbdp7 bldp7'>
                <div style={{width:'28.38%'}} className='bldp7 brdp7 '>
                    <div className='d-flex align-items-center'><div style={{width:'63%'}} className='end_invp2_ms pe_invp2_ms'>CGST</div><div style={{width:'37%'}} className='end_invp2_ms bldp7 pe_invp2_ms'>133</div></div>
                </div>
            </div>
            <div className='d-flex justify-content-between align-items-center fw-bold brbdp7 bldp7'>
                <div style={{width:'71.62%'}} className=' brdp7 p-1'>
                    <div className='fw-normal '>In Words Indian Rupees</div>
                    <div>Twenty-One Thousand Nine Hundred and Fifty-Six Only</div>
                </div>
                <div style={{width:'28.38%'}} className=' brdp7 '>
                    <div>
                        <div className='d-flex align-items-center'><div style={{width:'63%'}} className='end_invp2_ms pe_invp2_ms'>Less</div><div style={{width:'37%'}} className='end_invp2_ms bldp7 pe_invp2_ms'>1</div></div>
                        <div className='d-flex align-items-center brtdp7'><div style={{width:'63%'}} className='end_invp2_ms pe_invp2_ms p-1'>GRAND TOTAL</div><div style={{width:'37%'}} className='end_invp2_ms bldp7 pe_invp2_ms'>₹ 21,956.00</div></div>
                    </div>
                </div>
            </div> */}

            <div
                  className="mt-1 bradp7 p-1 hcompdp7 fsgdp7"
                  dangerouslySetInnerHTML={{
                    __html: result?.header?.Declaration,
                  }}
                >
                  {}
            </div>

            <div className="d-flex footer_bank hcompdp7 fsgdp7">
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
  )
}

export default InvoicePrint2