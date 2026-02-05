import React from 'react'
import Button from '../../GlobalFunctions/Button';
import "./css/invoiceprint1.css"
const InvoicePrint1 = () => {
    let data = [1,2,3,4,5,6,7,8,9];
    let result = {};
  return (
    <div className='d-flex justify-content-center align-items-center'>
        <div className='invp1_ms_container'>
            <div className='d-flex justify-content-end align-items-center my-3 matsal_print_btn_none'>
                    <Button />
            </div>
            <div>
                <div className="pheaddp10">
                    {result?.header?.PrintHeadLabel} TAX INVOICE
                </div>
                <div className='d-flex justify-content-end'>
                    <div className='col-3 border-black border-2'>
                        <div className='d-flex align-items-center w-100'><span className='w-25 fw-bold ps-1'>BILL NO</span><span className='ps-1'> MS/300</span></div>
                        <div className='d-flex align-items-center'><span className='w-25 fw-bold ps-1'>DATE</span> <span className='ps-1'>MS/300</span></div>
                    </div>
                </div>
                <div className='d-flex justify-content-between align-items-center border-2 mt-1 border-black p-1'>
                    <div className='d-flex'>
                        <div className='fw-bold'>To,</div>
                        <div className='ps-1'>
                            <div className='fw-bold'>Dar Be Gold Jewelers</div>
                            <div>405 hari om society, Sai point</div>
                            <div>Dindoli</div>
                            <div>surat-385620</div>
                        </div>
                    </div>
                    <div className='col-3'>
                        <div className='d-flex align-items-center w-100'>
                            <div className='fw-bold w-50'>GSTIN</div><div>24FFFFFBBBB</div>
                        </div>
                        <div className='d-flex align-items-center w-100'>
                            <div className='fw-bold w-50'>STATE CODE</div><div>24</div>
                        </div>
                        <div className='d-flex align-items-center w-100'>
                            <div className='fw-bold w-50'>PAN NO</div><div>DGJIIPF543D</div>
                        </div>
                    </div>
                </div>
                <div className='border-2 border-black mt-1'>
                    <div className='d-flex fw-bold  border-2 border-top-0 border-start-0 border-end-0 border-black'>
                        <div style={{width:'10%'}} className='p-1'>Description</div>
                        <div style={{width:'90%'}} className='d-flex align-items-center'>
                            <div className='col1_invp1_ms'>Description</div>
                            <div className='col2_invp1_ms'>Weight</div>
                            <div className='col3_invp1_ms'>Rate</div>
                            <div className='col4_invp1_ms'>Amount</div>
                            <div className='col5_invp1_ms'>HSN#</div>
                            <div className='col6_invp1_ms'>CGST%</div>
                            <div className='col7_invp1_ms'>CGST</div>
                            <div className='col8_invp1_ms'>SGST%</div>
                            <div className='col9_invp1_ms'>SGST</div>
                            <div className='col10_invp1_ms'>TOTAL AMT</div>
                        </div>
                    </div>
                    <div>
                        {
                            data?.map((e, i) => {
                                return <div key={i} className='d-flex'>
                                    <div style={{width:'10%'}} className='p-1'>{e}&nbsp;</div>
                                    <div style={{width:'90%'}} className='d-flex align-items-center'>
                                        <div className='col1_invp1_ms'>Description</div>
                                        <div className='col2_invp1_ms'>Weight</div>
                                        <div className='col3_invp1_ms'>Rate</div>
                                        <div className='col4_invp1_ms'>Amount</div>
                                        <div className='col5_invp1_ms'>HSN#</div>
                                        <div className='col6_invp1_ms'>CGST%</div>
                                        <div className='col7_invp1_ms'>CGST</div>
                                        <div className='col8_invp1_ms'>SGST%</div>
                                        <div className='col9_invp1_ms'>SGST</div>
                                        <div className='col10_invp1_ms'>TOTAL AMT</div>
                                    </div>
                                </div>
                            })
                        }
                    </div>
                    <div className='d-flex fw-bold'>
                        <div style={{width:'10%'}}>&nbsp;</div>
                        <div style={{width:'90%'}} className='d-flex align-items-center'>
                            <div className='col1_invp1_ms'>Total</div>
                            <div className='col2_invp1_ms'>1.250 gm</div>
                            <div className='col3_invp1_ms'></div>
                            <div className='col4_invp1_ms'>21,992</div>
                            <div className='col5_invp1_ms'></div>
                            <div className='col6_invp1_ms'></div>
                            <div className='col7_invp1_ms'>CGST</div>
                            <div className='col8_invp1_ms'></div>
                            <div className='col9_invp1_ms'>SGST</div>
                            <div className='col10_invp1_ms'>TOTAL AMT</div>
                        </div>
                    </div>
                </div>
                <div className='d-flex justify-content-end'>
                    <div className='border-2 border-black mt-1 col-4' >
                        <div className='w-100'>
                            <div className='d-flex align-items-center justify-content-between px-1'>
                                <div>CGST</div>
                                <div>331.76</div>
                            </div>
                            <div className='d-flex align-items-center justify-content-between px-1'>
                                <div>Less</div>
                                <div>-1.76</div>
                            </div>
                        </div>
                        <div className='px-1 fw-bold border-2 border-black border-bottom-0 border-start-0 border-end-0 d-flex justify-content-between align-items-center'>
                            <div>Grand Total</div>
                            <div>21,956</div>
                        </div>
                    </div>
                </div>
                <div className='mt-1 border-2 border-black p-1'> Rs.Twenty-One Thousand Nine Hundred and Fifty-Six Only. </div>
                <div className='mt-1 border-2 border-black p-1'>                    
                    NOTE : <br />
                    1.I/We hereby certify that my/our registration certificate under the Goods And Service Tax Act 2017. Is in force on the date on which the sale of the goods specified in the tax invoice has been effected by me/us & it shall accounted for in the turnover of sales while filing of return & the due tax.If any payable on the sale has been paid or shall be paids.
                    2.Returns of goods are subject to Terms & Conditions as mentioned in www.orail.com.
                    3.The support is limited to working hours.
                    4.Any case disapprency to jurdisory of state of gujarat.
                </div>
                <div className='p-1 mt-1 border-2 border-black'>
                    <div className='fw-bold'>COMPANY DETAILS :</div>
                    <div>GSTIN : 24AAAAA0000A1Z51</div>
                    <div>STATE CODE : 24</div>
                    <div>PAN NO. : FDGH5564CD</div>
                    <div>Kindly make your payment by the name of "Orail services"</div>
                    <div>Payable at Surat (GJ) by cheque or DD</div>
                    <div>Bank Detail : Bank Account No 147275899632</div>
                    <div>Bank Name : Kotak Mahindra Bank, SHOP NO-1 WTC , UDHNA DARWAJA SURAT-395004</div>
                    <div>RTGS/NEFT IFSC : Kotak00000405</div>
                </div>
                <div className='d-flex justify-content-between'>
                    <div style={{width:'49%'}} className='signInvp_1_ms p-1 mt-1 border-2 border-black'>AUTHORISED, Dar Be Gold Jewelers</div>
                    <div style={{width:'49%'}} className='signInvp_1_ms p-1 mt-1 border-2 border-black'>AUTHORISED, Optigo</div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default InvoicePrint1