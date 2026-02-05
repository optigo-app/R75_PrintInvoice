import React from 'react'
import "./css/matpurchase.css"
import Button from '../../GlobalFunctions/Button';

const MatPurchase = () => {
  let data = [1,2,3,4,5];
  let result = {};
  return (
    <>
        <div className='center_col_g'>
            <div className='mat_purchase_container'>
              
              <div className='d-flex justify-content-end align-items-center my-3 matsal_print_btn_none'>
                  <Button />
              </div>
              <div className='headLabel_ms'>MATERIAL PURCHASE</div>
              <div className='mt-3 d-flex justify-content-between bradp7 p-1'>
                  <div className='fw-bold'>From, Kinjal123</div>
                  <div className='col-4 p-1'>
                    <div className='d-flex justify-content-between'>
                        <div className='fw-bold'>VOUCHER</div>
                        <div className='col-7'>MP/618/2024</div>
                    </div>
                    <div className='d-flex justify-content-between'>
                        <div className='fw-bold'>DATE</div>
                        <div  className='col-7'>25 Oct 2024</div>
                    </div>
                    <div className='d-flex justify-content-between'>
                        <div className='fw-bold'>CODE</div>
                        <div className='fw-bold col-7'>Dhanji</div>
                    </div>
                  </div>
              </div>

              <div className='mt-1'>
                <div className='d-flex fw-bold brtdp7 brbdp7 brdp7 bldp7'>
                  <div className='col1_mp_ms  p-1 brdp7'>SR#</div>
                  <div className='col2_mp_ms  p-1 brdp7'>DESCRIPTION</div>
                  <div className='col3_mp_ms  p-1 brdp7'>REMARKS</div>
                  <div className='col4_mp_ms end_g p-1 brdp7'>PCS</div>
                  <div className='col5_mp_ms end_g p-1 brdp7'>WEIGHT</div>
                  <div className='col6_mp_ms end_g p-1 brdp7'>RATE</div>
                  <div className='col7_mp_ms end_g p-1'>AMOUNT</div>
                </div>
                <div>
                  {
                    data?.map((e, i) => {
                      return (
                        <div className='d-flex brdp7 bldp7 brbdp7' key={i}>
                          <div className='col1_mp_ms  p-1 brdp7'>{e}</div>
                          <div className='col2_mp_ms  p-1 brdp7'>DESCRIPTION</div>
                          <div className='col3_mp_ms  p-1 brdp7'>REMARKS</div>
                          <div className='col4_mp_ms end_g p-1 brdp7'>PCS</div>
                          <div className='col5_mp_ms end_g p-1 brdp7'>WEIGHT</div>
                          <div className='col6_mp_ms end_g p-1 brdp7'>RATE</div>
                          <div className='col7_mp_ms end_g p-1'>AMOUNT</div>
                        </div>
                      )
                    })
                  }
                </div>
                <div className='d-flex fw-bold brbdp7 brdp7 bldp7'>
                  <div className='  py-2 ps-2 brdp7' style={{width:'68%'}}>TOTAL</div>
                  <div className='col4_mp_ms end_g p-1 brdp7'>PCS</div>
                  <div className='col5_mp_ms end_g p-1 brdp7'>WEIGHT</div>
                  <div className='col6_mp_ms end_g p-1 brdp7'></div>
                  <div className='col7_mp_ms end_g p-1'>AMOUNT</div>
                </div>
              </div>

              <div className='d-flex justify-content-between bldp7 brbdp7 brdp7 p-1'>
                <div >
                  <div>Fine Wt : 22.564gm</div>
                </div>
                <div>
                  <div className='d-flex justify-content-end'>CGST&nbsp;:&nbsp;445.84</div>
                  <div className='d-flex justify-content-end'>Less&nbsp;:&nbsp;0.01</div>
                  <div className='d-flex justify-content-end'><span className='gtotal_mp_ms'>Grand Total</span>&nbsp;:&nbsp;<span className='gtotal_mp_ms fw-normal'>32,981</span></div>
                </div>
              </div>

              <div className='p-1 bradp7 border-top-0'> **We hereby confirm that we have received the above goods in good condition and order. </div>
              <div className='d-flex justify-content-between'>
                <div style={{width:'50%'}} className='sign_box_cr_ms bradp7 border-top-0 border-end-0'>
                Authorised, &nbsp;<span className='fw-bold'>rigel1</span>
                </div>
                <div style={{width:'50%'}} className='sign_box_cr_ms bradp7 border-top-0 '>
                Authorised, &nbsp;<span className='fw-bold'>rigel1</span>
                </div>
              </div>

            </div>
        </div>
    </>
  )
}

export default MatPurchase