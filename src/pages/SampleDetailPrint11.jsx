import React from 'react';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

const SampleDetailPrint11 = () => {
    return (
        <>
            <ReactHTMLTableToExcel
                id="test-table-xls-button"
                className="download-table-xls-button"
                table="table-to-xls"
                filename="tablexls"
                sheet="tablexls"
                buttonText="Download as XLS" />
            <table className='container my-5 containerDetailP11' id='table-to-xls'>
                <tbody>
                    {/* company info */}
                    <tr>
                        <td className='border-start border-top p-2 w-100' width={100}>
                            <p>ORAIL SERVICE</p>
                            <p>Shangai-La Plaza Mall</p>
                            <p>Nagpur</p>
                            <p>Nagpur 605001 Maharashtra India</p>
                            <p>darren@orail.co.in | www.optigoapps.com</p>
                            <p>GSTIN-22AAAAA0000A1Z5 | STATE CODE-22 | PAN-EDJHF236D</p>
                        </td>
                        <td className='border-start border-end p-2 w-100' width={250}>
                                <img src="http://zen/R50B3/UFS/ufs2/orail228FT0OWNGEI6DC3BVS/companylogo/projectlogo.png" alt="" className='w-25 d-block ms-auto' width={250} height={75} />
                        </td>
                    </tr>
                    <tr className='d-flex'>
                        <td className="col-6 border-start p-2 border-bottom">
                            <p>Bill To,</p>
                            <p>Kamlesh Patil pvt ltd</p>
                            <p>Majura Gate</p>
                            <p>Surat, Gujarat-425405</p>
                            <p>Tel: 951-021-3588</p>
                            <p>darren@orail.co.in</p>
                        </td>
                        <td className="col-6 border-end p-2 border-bottom">
                            <p className='text-end'>invoice#:SK12622022</p>
                            <p className='text-end'>GSTIN-22AAAAA0000A1Z5 | STATE CODE: 22</p>
                            <p className='text-end'>Terms: 0 Days</p>
                            <p className='text-end'>Due Date: 26 Aug 2023</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </>

    )
}

export default SampleDetailPrint11