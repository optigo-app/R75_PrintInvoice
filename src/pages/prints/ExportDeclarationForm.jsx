import React from 'react';
import "../../assets/css/prints/exportDeclarationForm.css";
import { handlePrint } from '../../GlobalFunctions';

const ExportDeclarationForm = () => {
    return (
        <div className='portrait_container pt-5 exportDeclarationForm pad_60_allPrint'>
            {/* buttons */}
            <div className="d-flex justify-content-end align-items-center print_sec_sum4 mb-4 pt-4">
                <div className="form-check">
                    <input type="button" className="btn_white blue" value="Print" onClick={(e) => handlePrint(e)} />
                </div>
            </div>
            <table>
                <thead>
                    {/* Heading */}
                    <div>
                        <p className='text-center fs-6 fw-bold'>Export Declaration Form</p>
                    </div>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            {/* General Information */}
                            <div className="border border-black p-1">
                                <p className='fw-bold'>1. Generatl Information: </p>
                            </div>
                            {/* Customs Security No */}
                            <div className="border-black border-start border-end border-bottom d-flex">
                                <div className="col-6 border-end border-black">
                                    <p className="fw-bold p-1">Customs Security No.:</p>
                                </div>
                                <div className="col-6 d-flex">
                                    <div className="col-6 border-end border-black">
                                        <p className="p-1">Form No.:</p>
                                    </div>
                                    <div className="col-6">
                                        <p className='p-1'>30/11/2016</p>
                                    </div>
                                </div>
                            </div>
                            {/*  Nature of Cargo: */}
                            <div className="d-flex border-black border-start border-end border-bottom">
                                <div className="col-5 d-flex border-end border-black p-1 flex-wrap">
                                    <p className="fw-bold pe-1">
                                        Nature of Cargo: [ ]
                                    </p>
                                    <p className="fw-bold pe-1">
                                        Government: [ ]
                                    </p>
                                    <p className="fw-bold pe-1">
                                        Non-Government: [ ]
                                    </p>
                                </div>
                                <div className="col-3 border-end border-black p-1">
                                    <p className="fw-bold">
                                        Shipping Bill No. & Date:
                                    </p>
                                    <p>
                                        SE/16-17/0001 30/11/2016
                                    </p>
                                </div>
                                <div className="col-4 p-1">
                                    <p className="fw-bold">Mode of Transport:[ ] Air[ ] Land[ ] Sea[ ] Post/Couriers[ ] Others</p>
                                </div>
                            </div>
                            {/* Category of Exporter: */}
                            <div className="d-flex border-black border-start border-end border-bottom">
                                <div className="col-6 border-end p-1 border-black">
                                    <p className="fw-bold">
                                        Category of Exporter: [ ] Custom (DTA units) [ ]
                                        SEZ [ ] Status holder exporters [ ] 100% EOU [ ]
                                        Warehouse export [ ] others (Specify).......
                                    </p>
                                </div>
                                <div className="col-6">
                                    <p className="fw-bold p-1">
                                        RBI approval no. & date, if any:
                                    </p>
                                </div>
                            </div>
                            {/* IE CODE: */}
                            <div className="d-flex border-black border-start border-end border-bottom">
                                <div className="col-6 border-end p-1 border-black">
                                    <p className="fw-bold">
                                        IE CODE:
                                    </p>
                                    <p>
                                        SE/16-17/0001
                                    </p>
                                </div>
                                <div className="col-6 p-1">
                                    <p className="fw-bold">
                                        AD code:
                                    </p>
                                </div>
                            </div>
                            {/* Exporters Name & Address: */}
                            <div className="d-flex border-black border-start border-end border-bottom">
                                <div className="col-6 border-end border-black p-1">
                                    <p className="fw-bold">
                                        Exporters Name & Address:
                                    </p>
                                    <div>
                                        <p>SIDDHI JEWELS</p>
                                        <p>A/10, Glitz Mall, Vithal Wadi, Kalbadevi, Mumbai.- 400 002(India).</p>
                                        <p>Ph: 022 2240 8822 Fax: </p>
                                        <p>Email : ritesh@siddhijewels.com</p>
                                    </div>
                                </div>
                                <div className="col-6 p-1">
                                    <div className="d-flex flex-column justify-content-between h-100">
                                        <p className="fw-bold">AD Name & Address:</p>
                                        <p>A/C No:</p>
                                    </div>
                                </div>
                            </div>
                            {/* Consignee’s Name & Address: */}
                            <div className="d-flex border-black border-start border-end border-bottom">
                                <div className="col-6 border-end border-black">
                                    <p className="fw-bold p-1 border-bottom pb-5 border-black">
                                        Consignee’s Name & Address:
                                    </p>
                                    <p className="fw-bold pb-5 p-1">
                                        Third Party name & Address ( In case of third Party
                                        Payments for Exports)
                                    </p>
                                </div>
                                <div className="col-6">
                                    <p className="fw-bold p-1">
                                        Mode of Realisation : [ ] L/C [ ] BG [ ] Others
                                    </p>
                                    <p className="fw-bold border-bottom border-black p-1">
                                        (advance payment, etc. including transfer/remittance to bank
                                        account maintained overseas )
                                    </p>
                                    <p className="fw-bold p-1">
                                        Port of Loading / Source Port in case of SEZ :
                                    </p>
                                </div>
                            </div>
                            {/* Name of the Indian bank and AD code, in case of LC/BG */}
                            <div className="d-flex border-black border-start border-end border-bottom">
                                <div className="col-6 p-1 border-end border-black">
                                    <p className="fw-bold">
                                        Name of the Indian bank and AD code, in case of LC/BG
                                    </p>
                                </div>
                                <div className="d-flex flex-wrap col-6">
                                    <div className="col-6 p-1 border-end border-black border-bottom height44ExportDetailForm">
                                        <p className="fw-bold">
                                            Country of Destination:
                                        </p>
                                    </div>
                                    <div className="col-6 p-1 border-black border-bottom height44ExportDetailForm">
                                        <p className="fw-bold">
                                            Port of Discharge:
                                        </p>
                                    </div>
                                    <div className="col-6 p-1 border-end border-black height44ExportDetailForm">
                                        <p className="fw-bold">
                                            Whether payment to be
                                            Received through ACU?
                                            [ ] Yes [ ] No
                                        </p>
                                    </div>
                                    <div className="col-6 p-1 height44ExportDetailForm">
                                        <p className="fw-bold">
                                            Let Export order (LEO) Date:
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {/* General Commodity Description: */}
                            <div className="d-flex border-black border-start border-end border-bottom">
                                <div className="col-6 p-1 border-end border-black height40ExportDetailForm">
                                    <p className="fw-bold">
                                        General Commodity Description:
                                    </p>
                                </div>
                                <div className="col-6 p-1 height40ExportDetailForm">
                                    <p className="fw-bold">
                                        State of Origin of Goods:
                                    </p>
                                </div>
                            </div>
                            {/* Total FOB value in words (INR): */}
                            <div className="d-flex border-black border-start border-end border-bottom">
                                <div className="col-6 border-end p-1 border-black">
                                    <p className="fw-bold">
                                        Total FOB value in words (INR):
                                    </p>
                                    <p>
                                        Rs. Seventy Thousand Two Hundred Ninety one And Fourteen Only
                                    </p>
                                </div>
                                <div className="col-6 p-1">
                                    <p className="fw-bold">
                                        Custom Assessable value (INR)*:
                                    </p>
                                    <p className="fw-bold">
                                        536728.13
                                    </p>
                                </div>
                            </div>
                            {/* 2. Invoice –Wise details of Export Value */}
                            <div className="border-black p-1 border-start border-end border-bottom">
                                <p className="fw-bold ">
                                    2. Invoice –Wise details of Export Value
                                </p>
                                <p className="fw-bold">
                                    ( If more than one invoice for a particular shipping bill , the block 2 will repeat as many times of invoices)
                                </p>
                            </div>
                            {/* Invoice No. */}
                            <div className="d-flex border-black border-start border-end">
                                <div className="col-3 p-1 border-end border-black">
                                    <p className="height35ExportDetailForm">
                                        Invoice No.
                                    </p>
                                    <p className="height35ExportDetailForm">
                                        Invoice Date.
                                    </p>
                                </div>
                                <div className="col-4 p-1 border-end border-black">
                                    <p className="height35ExportDetailForm">
                                        Invoice Currency:
                                    </p>
                                    <p className="height35ExportDetailForm">
                                        Invoice Amount:
                                    </p>
                                </div>
                                <div className="col-5 p-1">
                                    <p>Nature of Contract:</p>
                                    <p>[ ] FOB [ ] CIF [ ] C&F [ ] CI [ ] Others </p>
                                </div>
                            </div>
                            {/* Particulars Table */}
                            <div>
                                <table className="table table-bordered border-black">
                                    <thead>
                                        <tr>
                                            <th>Particulars</th>
                                            <th>Currency</th>
                                            <th>Amount in FC</th>
                                            <th>Exchange Rate </th>
                                            <th>Amount (INR)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr> <td className="p-1">FOB Value</td> <td className="p-1"></td> <td className="p-1"></td> <td className="p-1"></td> <td className="p-1"></td> </tr>
                                        <tr> <td className="p-1">Freight</td> <td className="p-1"></td> <td className="p-1"></td> <td className="p-1"></td> <td className="p-1"></td> </tr>
                                        <tr> <td className="p-1">Insurance</td> <td className="p-1"></td> <td className="p-1"></td> <td className="p-1"></td> <td className="p-1"></td> </tr>
                                        <tr> <td className="p-1">Commission</td> <td className="p-1"></td> <td className="p-1"></td> <td className="p-1"></td> <td className="p-1"></td> </tr>
                                        <tr> <td className="p-1">Discount</td> <td className="p-1"></td> <td className="p-1"></td> <td className="p-1"></td> <td className="p-1"></td> </tr>
                                        <tr> <td className="p-1">Other Deduction</td> <td className="p-1"></td> <td className="p-1"></td> <td className="p-1"></td> <td className="p-1"></td> </tr>
                                        <tr> <td className="p-1">Packing Charges</td> <td className="p-1"></td> <td className="p-1"></td> <td className="p-1"></td> <td className="p-1"></td> </tr>
                                    </tbody>
                                </table>
                            </div>
                            {/* 3. Applicable for Export under FPO/Couriers */}
                            <div className="border border-black mt-4">
                                <p className="fw-bold p-1">3. Applicable for Export under FPO/Couriers</p>
                            </div>
                            {/* Name of the post Office: */}
                            <div className="d-flex border-start border-end border-bottom border-black">
                                <div className="col-6 height150ExportDetailForm">
                                    <div className="d-flex h-100 justify-content-between flex-column p-1 border-end border-black">
                                        <p>Name of the post Office:</p>
                                        <p>Number & date of Parcel receipts :</p>
                                    </div>
                                </div>
                                <div className="col-6 overflow-hidden">
                                    <div className="center_vertically_stamp_export_declaration_form p-1">
                                        <p> Stamp & Signature of Authorised Dealer</p>
                                    </div>
                                </div>
                            </div>
                            {/* 4. Declaration by the Exporters (All types of exports) */}
                            <div className="border-start border-end border-bottom border-black p-1">
                                <p className="fw-bold">
                                    4. Declaration by the Exporters (All types of exports)
                                </p>
                            </div>
                            {/* Note */}
                            <div className="border-start border-end border-bottom border-black p-1">
                                <p className="fw-bold">
                                    I /We hereby declare that I/we @am/are the seller/consignor of the goods in respect of which this declaration is made and that the
                                    particulars given above are true and that the value to be received from the buyer/third party represents the export value contracted
                                    and declared above. I/We undertake that I/we will deliver to the authorised dealer bank named above the foreign exchange
                                    representing the full value of the goods exported as above on or before........................ (i.e. within the period of realisation stipulated
                                    by RBI from time to time ) in the manner specified in the Regulations made under the Foreign Exchange Management Act, 1999.
                                    I/We @ am/are not in the Caution List of the Reserve Bank of India.

                                    Dat Date: (Signature of Exporter)
                                </p>
                            </div>
                            {/*  5. Space for use of the competent authority (i.e. Custom/SEZ) on behalf of Ministry concerned: */}
                            <div className="border-start border-end border-bottom border-black p-1">
                                <p className="fw-bold">
                                    5. Space for use of the competent authority (i.e. Custom/SEZ) on behalf of Ministry concerned:
                                </p>
                            </div>
                            {/* Certified */}
                            <div className="border-start border-end border-bottom border-black p-1">
                                <p className="fw-bold pb-5">
                                    Certified, on the basis of above declaration by the Custom/SEZ unit, that the Goods described above and the export value declared by
                                    the exporter in this form is as per the corresponding invoice/gist of invoices submitted and declared by the Unit.
                                </p>
                                <div className="d-flex pb-3">
                                    <div className="col-6">
                                        <p className="fw-bold">Date:</p>
                                    </div>
                                    <div className="col-6">
                                        <p className='fw-bold'>(Signature of Designated/Authorised officials of Custom /SEZ )</p>
                                    </div>
                                </div>

                            </div>
                            {/* @ Strike out whichever is not applicable. */}
                            <p className="fst-italic ps-5 ms-5">@ Strike out whichever is not applicable.</p>
                            <p className="fst-italic ps-5 ms-5">* Unit declared Value in case of exports affected from SEZs</p>
                        </td>
                    </tr>
                </tbody>
            </table>


        </div>
    )
}

export default ExportDeclarationForm