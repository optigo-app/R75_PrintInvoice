import React from 'react'

const Button = () => {
    const handlePrint = (e) => {
        e.preventDefault();
        window.print();
    }
  return (
    <div className='d-flex justify-content-end align-items-center mt-1'><button className="btn_white blue" value="Print" onClick={(e) => handlePrint(e)}>Print</button></div>
  )
}

export default Button