import React from 'react';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
// http://localhost:3000/?imagepath=aHR0cDovL3plbi9SNTBCMy9VRlMvdWZzMi9vcmFpbDIyOEZUME9XTkdFSTZEQzNCVlMvRGVzaWduX0ltYWdlLw==&printname=BagPrint4A&str_srjobno=1/14747,1/14746,1/14745,1/14738,1/14737,1/14736,1/14735,1/14732,1/14731,1/14730,1/14729,1/14728,1/14727,1/14715,1/14707,1/14706,1/14705,1/14704,1/14703,1/14702,1/14701,1/14700,1/14699,1/14698,1/14618,1/14604,1/14599,1/14595,1/14594,1/14590,1/14588,1/14587,1/14586,1/14575,1/14574,1/14573,1/14556,1/14555,1/14554,1/14553,1/14552,1/14551,1/14550,1/14549,1/14543,1/14542,1/14541,1/14540,1/14539,1/14538,1/14537,1/14536,1/14535,1/14534,1/14533,1/14532,1/14531,1/14530,1/14529,1/14528,1/14527,1/14526,1/14525,1/14524,1/14523,1/14522,1/14521,1/14520,1/14519,1/14518,1/14517,1/14516,1/14515,1/14514,1/14513,1/14512,1/14511,1/14501,1/14500,1/14499,1/14491&appuserid=uday@admin.co.in&custid=15931&version=v4&YearCode=e3t6ZW59fXt7MjF9fXt7b3JhaWwyNH19e3tvcmFpbDI0fX0=&report_api_url=aHR0cDovL3plbi9hcGkvTS5hc214L09wdGlnbw==&start_page=1&ifid=BagPrint4B&pid=undefined
function ExcelDownload() {
  return (
    <div>
      <table id="table-to-xls">
        <thead>
          <tr>
            <th>Firstname</th>
            <th>Lastname</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Jill</td>
            <td>Smith</td>
            <td>50</td>
          </tr>
          <tr>
            <td>Eve</td>
            <td>Jackson</td>
            <td>94</td>
          </tr>
        </tbody>
      </table>
      <ReactHTMLTableToExcel
        id="test-table-xls-button"
        className="download-table-xls-button"
        table="table-to-xls"
        filename="tablexls"
        sheet="tablexls"
        buttonText="Download as XLS"
      />
    </div>
  );
}

export default ExcelDownload;
