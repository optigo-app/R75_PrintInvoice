import React from 'react'
import "./css/matpurchasereturn.css";
import Button from './../../GlobalFunctions/Button';
const MatPurchaseReturn = () => {
    let result = {};
    let data = [1,2,3,4,5];
  return (
    <>
        <div className='center_col_g'>
            <div className='container_mpr'>
                  <div className='d-flex justify-content-end align-items-center my-3 matsal_print_btn_none'>
                    <Button />
                    </div>
                    <div className='headLabel_ms'>MATERIAL SALE</div>
                    <div className='bradp7 mt-2 d-flex align-items-center p-1'>
                        <div className='fw-bold custName_ms' style={{width:'70%'}}>
                            To, Hiral444
                        </div>
                        <div style={{width:'30%'}}>
                            <div className='d-flex align-items-center'><div className='fw-bold' style={{width:'30%'}}>BILL NO</div><div>MS/300</div></div>
                            <div className='d-flex align-items-center'><div className='fw-bold' style={{width:'30%'}}>DATE</div><div>22 Oct 2024</div></div>
                            <div className='d-flex align-items-center'><div className='fw-bold' style={{width:'30%'}}>CODE</div><div className='fw-bold'>Hiral444</div></div>
                        </div>
                    </div>
                    <div>
                        <div className='fw-bold d-flex bradp7 mt-1'>
                            <div className='col1_mpr_ms brdp7 center_g p-1'>SR#</div>
                            <div className='col2_mpr_ms brdp7 center_g p-1'>DESCRIPTION</div>
                            <div className='col3_mpr_ms brdp7 start_g'>REMARK</div>
                            <div className='col4_mpr_ms brdp7 end_g pe_g'>PCS</div>
                            <div className='col5_mpr_ms brdp7 end_g pe_g'>WEIGHT</div>
                            <div className='col6_mpr_ms brdp7 end_g pe_g'>RATE</div>
                            <div className='col7_mpr_ms brdp7 end_g pe_g'>AMOUNT</div>
                            <div className='col8_mpr_ms brdp7 end_g pe_g'>HSN#</div>
                            <div className='col9_mpr_ms brdp7 end_g pe_g'>CGST(%)</div>
                            <div className='col10_mpr_ms brdp7 end_g pe_g'>CGST</div>
                            <div className='col11_mpr_ms brdp7 end_g pe_g'>SGST(%)</div>
                            <div className='col12_mpr_ms brdp7 end_g pe_g'>SGST</div>
                            <div className='col13_mpr_ms end_g pe_g'>TOTAL <br /> AMOUNT</div>
                        </div>
                        <div>
                        {
                            data?.map((e, i) => {
                                return (
                                    <div className=' d-flex bradp7 border-top-0' key={i}>
                                        <div className='col1_mpr_ms brdp7 center_g p-1'>{e}</div>
                                        <div className='col2_mpr_ms brdp7 start_g p-1 ps_g'>DESCRIPTION</div>
                                        <div className='col3_mpr_ms brdp7 start_g ps_g'>REMARK</div>
                                        <div className='col4_mpr_ms brdp7 end_g pe_g'>PCS</div>
                                        <div className='col5_mpr_ms brdp7 end_g pe_g'>WEIGHT</div>
                                        <div className='col6_mpr_ms brdp7 end_g pe_g'>RATE</div>
                                        <div className='col7_mpr_ms brdp7 end_g pe_g'>AMOUNT</div>
                                        <div className='col8_mpr_ms brdp7 end_g pe_g'>HSN#</div>
                                        <div className='col9_mpr_ms brdp7 end_g pe_g'>CGST(%)</div>
                                        <div className='col10_mpr_ms brdp7 end_g pe_g'>CGST</div>
                                        <div className='col11_mpr_ms brdp7 end_g pe_g'>SGST(%)</div>
                                        <div className='col12_mpr_ms brdp7 end_g pe_g'>SGST</div>
                                        <div className='col13_mpr_ms end_g pe_g'>TOTAL <br /> AMOUNT</div>
                                    </div>
                                )
                            })
                        }
                        </div>
                        <div className='fw-bold d-flex bradp7 border-top-0'>
                            <div className='brdp7 start_g ps_g py-2' style={{width:'28%'}}>TOTAL</div>
                            <div className='col4_mpr_ms brdp7 end_g pe_g'>PCS</div>
                            <div className='col5_mpr_ms brdp7 end_g pe_g'>WEIGHT</div>
                            <div className='col6_mpr_ms brdp7 end_g pe_g'></div>
                            <div className='col7_mpr_ms brdp7 end_g pe_g'>AMOUNT</div>
                            <div className='col8_mpr_ms brdp7 end_g pe_g'></div>
                            <div className='col9_mpr_ms brdp7 end_g pe_g'></div>
                            <div className='col10_mpr_ms brdp7 end_g pe_g'>CGST</div>
                            <div className='col11_mpr_ms brdp7 end_g pe_g'></div>
                            <div className='col12_mpr_ms brdp7 end_g pe_g'>SGST</div>
                            <div className='col13_mpr_ms end_g pe_g'>TOTAL <br /> AMOUNT</div>
                        </div>
                        <div className=' d-flex justify-content-end mt-1'>
                            <div className='d-flex justify-content-between px-1 align-items-center  border-2  col-2'>
                                <div>Grand Total</div>
                                <div>12345</div>
                            </div>
                        </div>
                        <div className=' p-1 mt-1 bradp7'>
                            <span className='fw-bold p-1'>Indian Rupees</span> Zero Only
                        </div>
                        <div className='p-1 bradp7 my-2'> **We hereby confirm that we have received the above goods in good condition and order. </div>
                        <div className='d-flex brtdp7 mt-2 justify-content-between'>
                            <div style={{width:'50%'}} className='sign_box_cr_ms bradp7 border-top-0 border-end-0'>
                            Authorised, &nbsp;<span className='fw-bold'>rigel1</span>
                            </div>
                            <div style={{width:'50%'}} className='sign_box_cr_ms bradp7 border-top-0 '>
                            Authorised, &nbsp;<span className='fw-bold'>rigel1</span>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
    </>
  )
}

export default MatPurchaseReturn