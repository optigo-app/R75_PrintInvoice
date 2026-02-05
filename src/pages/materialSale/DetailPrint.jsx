import React from 'react'
import "./css/detailprint.css";
import Button from '../../GlobalFunctions/Button';
const DetailPrint = () => {
  let data = [1,2,3,4,5,6];
  return (
    <div className='detailprint_ms'>
      <div className='container_ms'>
        <div className='d-flex justify-content-end align-items-center my-3 matsal_print_btn_none'>
          <Button />
        </div>
        <div className='headLabel_ms'>MATERIAL SALE</div>
        <div className='border_ms mt-2 d-flex align-items-center p-1'>
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
          <div className='d-flex fw-bold mt-1 border_ms'>
            <div className='col1__dp_ms p-1 border_end_ms'>SR#</div>
            <div className='col2__dp_ms p-1 border_end_ms'>DESCRIPTION</div>
            <div className='col3__dp_ms p-1 border_end_ms'>REMARKS</div>
            <div className='col4__dp_ms p-1 border_end_ms end_dp_ms'>PCS</div>
            <div className='col5__dp_ms p-1 border_end_ms end_dp_ms'>WEIGHT</div>
            <div className='col6__dp_ms p-1 border_end_ms end_dp_ms'>RATE</div>
            <div className='col7__dp_ms p-1 end_dp_ms'>Amount</div>
          </div>
        	<div>
            {
              data?.map((e, i) => {
                return (
                  <div className='d-flex border_ms border-top-0' key={i}>
                    <div className='col1__dp_ms p-1 border_end_ms'>SR#</div>
                    <div className='col2__dp_ms p-1 border_end_ms'>DESCRIPTION</div>
                    <div className='col3__dp_ms p-1 border_end_ms'>REMARKS</div>
                    <div className='col4__dp_ms p-1 border_end_ms end_dp_ms'>PCS</div>
                    <div className='col5__dp_ms p-1 end_dp_ms border_end_ms'>WEIGHT</div>
                    <div className='col6__dp_ms p-1 end_dp_ms border_end_ms'>RATE</div>
                    <div className='col7__dp_ms p-1 end_dp_ms'>Amount</div>
                  </div>
                )
              })
            }
          </div>		
          <div className='d-flex border_ms fw-bold border-top-0'>
                    <div className='col1__dp_ms p-1 border_end_ms'></div>
                    <div className='col2__dp_ms p-1 start_dp_ms border_end_ms'>TOTAL</div>
                    <div className='col3__dp_ms p-1 border_end_ms'></div>
                    <div className='col4__dp_ms p-1 border_end_ms end_dp_ms'>2</div>
                    <div className='col5__dp_ms p-1 end_dp_ms border_end_ms'>1.550 Ctw <br /> 11.500 Gm	</div>
                    <div className='col6__dp_ms p-1 end_dp_ms border_end_ms'></div>
                    <div className='col7__dp_ms p-1 end_dp_ms'>21,292.50</div>
          </div>
          <div className='d-flex justify-content-between align-items-center px-1 mt-1 border_ms' style={{height:'30px', backgroundColor:'#F2F2F2'}}>
            <div>Gold in 24K : <span className='fw-bold'>7.000</span></div>
            <div className='fw-bold'>TOTAL IN HK$ : 21,956.00</div>
          </div>
          <div className='d-flex justify-content-end align-items-center px-1 mt-1 border_ms' style={{height:'30px'}}>
            <div className='fw-bold'>TOTAL IN  :  HKD  21,956.00</div>
          </div>
          <div className='d-flex justify-content-start align-items-center px-1 mt-1 border_ms' style={{height:'30px'}}>
            <div>**We hereby confirm that we have received the above goods in good condition and order.</div>
          </div>
          <div className='mt-4 d-flex'>
            <div className='w-50 border_dp_end signBox_dp_ms d-flex justify-content-center align-items-end fw-bold'>
            Authorised, Dar Be Gold Jewelers
            </div>
            <div className='w-50 signBox_dp_ms d-flex justify-content-center align-items-end fw-bold'>
            Authorised, Optigo
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailPrint;