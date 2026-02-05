// import XLSX from 'xlsx';

// const DownloadExcel = ({htmlData}) => {
//   const table = document.createElement('table');
//   table.innerHTML = htmlData;

//   const workbook = XLSX.utils.table_to_book(table);
//   const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

//   const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//   const url = URL.createObjectURL(blob);

//   const a = document.createElement('a');
//   a.href = url;
//   a.download = 'data.xlsx';
//   document.body.appendChild(a);
//   a.click();
//   document.body.removeChild(a);
//   URL.revokeObjectURL(url);
// };

// export default DownloadExcel;
