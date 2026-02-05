import React from 'react'
import "./css/custreceive.css"
import Button from '../../GlobalFunctions/Button';
const CustReceive = () => {
  let result = {};
  let data = [1,2,3,4,5,6,7,8,9];
  return (
    <>
        <div className='d-flex justify-content-center'>
          <div className='container_ms_cr'>
              <div className='d-flex justify-content-end align-items-center my-3 matsal_print_btn_none'>
                  <Button />
              </div>
              <div className='headLabel_ms'> CUSTOMER RECEIVE</div>
              <div className='mt-3 d-flex justify-content-between bradp7'>
                  <div className='fw-bold'>From, Kinjal123</div>
                  <div className='col-3 p-1'>
                    <div className='d-flex justify-content-between'>
                        <div className='fw-bold'>VOUCHER</div>
                        <div className='col-7'>CR/773</div>
                    </div>
                    <div className='d-flex justify-content-between'>
                        <div className='fw-bold'>DATE</div>
                        <div  className='col-7'>24 Oct</div>
                    </div>
                    <div className='d-flex justify-content-between'>
                        <div className='fw-bold'>CODE</div>
                        <div className='fw-bold col-7'>kinjal123</div>
                    </div>
                  </div>
              </div>
              <div>
                <div className='d-flex fw-bold bradp7 mt-1'>
                  <div className='col1_cr_ms start_g ps_g  brdp7'>SR#</div>
                  <div className='col2_cr_ms start_g ps_g brdp7'>DESCRIPTION</div>
                  <div className='col3_cr_ms start_g ps_g brdp7'>REMARKS</div>
                  <div className='col4_cr_ms centerdp10 p-1 brdp7'>HSN</div>
                  <div className='col5_cr_ms end_g pe_g brdp7'>PCS</div>
                  <div className='col6_cr_ms end_g pe_g'>WEIGHT</div>
                </div>
                <div>
                  {
                    data?.map((e, i) => {
                      return(
                        <div className='d-flex  bldp7 brbdp7 border-top-0' key={i}>
                          <div className='col1_cr_ms start_g ps_g brdp7'>{e}</div>
                          <div className='col2_cr_ms start_g ps_g brdp7'>DESCRIPTION</div>
                          <div className='col3_cr_ms start_g ps_g brdp7'>REMARKS</div>
                          <div className='col4_cr_ms centerdp10 p-1 brdp7'>HSN</div>
                          <div className='col5_cr_ms end_g pe_g brdp7'>PCS</div>
                          <div className='col6_cr_ms end_g pe_g brdp7'>WEIGHT</div>
                        </div>
                      )
                    })
                  }
                </div>
                <div className='d-flex fw-bold border-top-0 bradp7 '>
                  <div className='col1_cr_ms start_g ps_g brdp7'></div>
                  <div className='col2_cr_ms start_g ps_g brdp7'>TOTAL</div>
                  <div className='col3_cr_ms start_g ps_g brdp7'></div>
                  <div className='col4_cr_ms centerdp10 p-1 brdp7'></div>
                  <div className='col5_cr_ms end_g pe_g brdp7'></div>
                  <div className='col6_cr_ms end_g pe_g p-1'>WEIGHT</div>
                </div>
              </div>
              <div className='end_g pe_g bradp7 border-top-0 fine_box_cr_ms'>
                <div>Fine Wt :99.522gms</div>
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

export default CustReceive;