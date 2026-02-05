import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar, } from '@mui/x-data-grid';
import {  Dialog } from '@mui/material';
import { IoClose } from "react-icons/io5";
import editImg from '../../assets/img/grids/edit.png'
import deleteImg from '../../assets/img/grids/delete.png'
import { IoSearch } from "react-icons/io5";
import styles from '../../assets/css/grids/notificationgrid.module.css';

export default function NotificationGrid() {

  const [open, setOpen] = useState(false);
  const [openDesc, setOpenDesc] = useState(false);
  const [pageName, setPageName] = useState(undefined);
  const [pageId, setPageId] = useState(undefined);
  const [buttonId, setButtonId] = useState(undefined);
  const [whatNotes, setWhatNotes] = useState(undefined);
  const [howNotes, setHowNotes] = useState(undefined);
  const [rows, setRows] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [pageNameEror, setPageNameError] = useState(false);
  const [pageIdEror, setPageIdError] = useState(false);
  const [buttonIdError, setButtonIdError] = useState(false);
  const [whatsNoteError, setWthasNoteError] = useState(false);
  const [howNotesError, setHowsNotesError] = useState(false);
  const [editRowId, setEditRowId] = useState(undefined);
  const [editRowData, setEditRowData] = useState({});


  const [clickedColumnData, setClickedColumnData] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupHeader, setPopupHeader] = useState('');
  const [popupHeaderPageName, setPopupHeaderPageName] = useState('');
  const [selectionModel, setSelectionModel] = useState([]);

  const handleUnderlineClick = (rowData, columnName) => {
    const pageName = rowData.col3;
    setPopupHeaderPageName(pageName);
    setPopupHeader(columnName === 'col6' ? 'What' : 'How');
    setClickedColumnData(columnName === 'col6' ? rowData.col6 : rowData.col7);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };



  const handleOpen = (rowData) => {
    setEditRowId(rowData.id);
    setEditRowData(rowData);
    setOpen(true);
  };

  const handleUpdate = () => {
    const updatedRows = rows.map(row => {
      if (row.id === editRowId) {
        return {
          ...row,
          col3: pageName || editRowData.col3,
          col4: pageId || editRowData.col4,
          col5: buttonId || editRowData.col5,
          col6: whatNotes || editRowData.col6,
          col7: howNotes || editRowData.col7,
        };
      }
      return row;
    });
    localStorage.setItem('gridRows', JSON.stringify(updatedRows));
    setRows(updatedRows);
    setOpen(false);
    setEditRowId(undefined);
    setEditRowData({});
  };

  const columns = [
    { field: 'id', headerName: 'Srno', width: 70, headerClassName: 'topColumnHeader' },
    {
      field: 'edit',
      headerName: 'Edit',
      width: 80,
      renderCell: (params) => (
        <img src={editImg} onClick={() => handleOpen(params.row)} style={{ cursor: 'pointer' }} />
      ),
      headerClassName: 'topColumnHeader'
    },
    { field: 'col3', headerName: 'Page name', width: 130, headerClassName: 'topColumnHeader' },
    { field: 'col4', headerName: 'Page Id', width: 130, headerClassName: 'topColumnHeader' },
    { field: 'col5', headerName: 'Button Id', width: 130, headerClassName: 'topColumnHeader' },
    {
      field: 'col6',
      headerName: 'What',
      width: 130, headerClassName: 'topColumnHeader',
      renderCell: (params) => (
        <div
          className={`${styles.underlinedText}`}
          onClick={() => handleUnderlineClick(params.row, 'col6')}
        >
          {params.row.col6}
        </div>
      ),
    },
    {
      field: 'col7',
      headerName: 'How',
      width: 130, headerClassName: 'topColumnHeader',
      renderCell: (params) => (
        <div
          className={`${styles.underlinedText}`}
          onClick={() => handleUnderlineClick(params.row, 'col7')}
        >
          {params.row.col7}
        </div>
      ),
    },
    {
      field: 'delete',
      headerName: 'Delete',
      width: 70, headerClassName: 'topColumnHeader',
      renderCell: (params) => (
        <img src={deleteImg} style={{ marginLeft: '13px', cursor: 'pointer' }} onClick={() => handleDelete(params.row.id)} />
      ),
    },
  ];

  useEffect(() => {
    setPageName(editRowData.col3 || '');
    setPageId(editRowData.col4 || '');
    setButtonId(editRowData.col5 || '');
    setWhatNotes(editRowData.col6 || '');
    setHowNotes(editRowData.col7 || '');
  }, [editRowData]);

  // const handleOpen = () => {
  //   setOpen(true);
  // };

  const handleClose = () => {
    setOpen(false);
    setPageId('');
    setPageName('');
    setHowNotes('');
    setWhatNotes('');
    setButtonId('');
  };


  const handleDelete = (idToDelete) => {
    const updatedRows = rows.filter((row) => row.id !== idToDelete);
    localStorage.setItem('gridRows', JSON.stringify(updatedRows));

    const updatedRowsWithSrno = updatedRows.map((row, index) => ({
      ...row,
      id: index + 1, // Update the id based on the index + 1
    }));
    localStorage.setItem('gridRows', JSON.stringify(updatedRowsWithSrno));

    setRows(updatedRowsWithSrno);
    // setRows(updatedRows);
  };

  const handleSave = (props) => {


    const isDuplicatePageId = rows.some(row => row.col4 === pageId && row.col5 === buttonId);
    const isDuplicateButtonId = rows.some(row => row.col5 === buttonId);

    if (isDuplicatePageId) {
      alert('Page ID & Button ID already exists');
      return;
    }


    if (pageName === '' || pageName === undefined) {
      setPageNameError(true);
    } else if (pageId === '' || pageId === undefined) {
      setPageIdError(true);
    } else if (buttonId === '' || buttonId === undefined) {
      setButtonIdError(true);
    } else if (whatNotes === '' || whatNotes === undefined) {
      setWthasNoteError(true);
    } else if (howNotes === '' || howNotes === undefined) {
      setHowsNotesError(true);
    } else {
      const newData = {
        id: rows.length + 1,
        col2: 'Edit',
        col3: pageName,
        col4: pageId,
        col5: buttonId,
        col6: whatNotes,
        col7: howNotes,
        col8: 'Delete',
      };

      const updatedRows = [newData, ...rows];
      const updatedRowsWithSrno = updatedRows.map((row, index) => ({
        ...row,
        id: index + 1, // Update the id based on the index + 1
      }));

      localStorage.setItem('gridRows', JSON.stringify(updatedRowsWithSrno));
      setRows(updatedRowsWithSrno);
      setPageId('');
      setPageName('');
      setHowNotes('');
      setWhatNotes('');
      setButtonId('');
      props && setOpen(false);
    }
  };

  useEffect(() => {
    const storedRows = JSON.parse(localStorage.getItem('gridRows') || '[]');
    setRows(storedRows);
  }, []);

  const filterRows = () => {
    return rows.filter(
      (row) =>
        row.col3.toLowerCase().includes(searchText.toLowerCase()) ||
        row.col4.toLowerCase().includes(searchText.toLowerCase()) ||
        row.col5.toLowerCase().includes(searchText.toLowerCase()) ||
        row.col6.toLowerCase().includes(searchText.toLowerCase()) ||
        row.col7.toLowerCase().includes(searchText.toLowerCase())
    );
  };

 
  const handleDeleteSeleted = () => {
    const updatedRows = rows.filter((row) => !selectionModel.includes(row.id));
    
    const updatedRowsWithSrno = updatedRows.map((row, index) => ({
      ...row,
      id: index + 1, // Update the id based on the index + 1
    }));
    localStorage.setItem('gridRows', JSON.stringify(updatedRowsWithSrno));
    setRows(updatedRowsWithSrno);
    window.location.reload(); 
    // localStorage.setItem('gridRows', JSON.stringify(updatedRows));
    // setRows(updatedRows);
    // setSelectionModel([]);
  }
  return (
    <div>
      <Dialog open={showPopup} onClose={handleClosePopup}>
        <div style={{ width: '380px', height: '450px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            boxShadow: ' -1px 1px 11px 3px rgba(0,0,0,0.3)',
            paddingInline: '5px',
            height: '50px',
            alignItems: 'center'
          }}>
            <p style={{ margin: '0px', fontSize: '18px', fontWeight: 600 }}>{`${popupHeader}_${popupHeaderPageName}`}</p>
            <IoClose style={{ height: '30', width: '30px', cursor: 'pointer' }} onClick={handleClosePopup} />
          </div>
          <p style={{ fontSize: '19px', margin: '5px', wordWrap: 'break-word' }}>{clickedColumnData}</p>
          {/* <Button onClick={handleClosePopup}>Close</Button> */}
        </div>
      </Dialog>


      <Dialog open={open} onClose={handleClose}>
        <div className={`${styles.addTopNotifiction}`}>
          <p style={{ margin: '0px', fontSize: '16px', fontWeight: 500 }}>ADD NOTIFICATION</p>
          <IoClose style={{ height: '25', width: '25px', cursor: 'pointer' }} onClick={handleClose} />
        </div>
        <div style={{ width: '300px', padding: '20px 40px 40px 40px' }}>
          <div className={`${styles.addDataMain}`}>
            <p  className={`${styles.addDataTitle}`}><span style={{ color: 'red' }}>*</span>Page Name</p>
            <input type='text' className={`${styles.addDataInp}`} value={pageName}
              onChange={(e) => {
                setPageName(e.target.value);
                setPageNameError(false);
              }}
              style={{ border: pageNameEror && '1px solid red' }}
            />
          </div>
          <div className={`${styles.addDataMain}`}>
            <p  className={`${styles.addDataTitle}`}><span style={{ color: 'red' }}>*</span>Page Id</p>
            <input type='text' className={`${styles.addDataInp}`} value={pageId}
              onChange={(e) => {
                const enteredValue = e.target.value;
                const numbersOnly = /^[0-9\b]+$/;
                if (enteredValue === '' || numbersOnly.test(enteredValue)) {
                  setPageId(enteredValue);
                  setPageIdError(false);
                }
              }}
              style={{ border: pageIdEror && '1px solid red' }}

            />
          </div>
          <div className={`${styles.addDataMain}`}>
            <p  className={`${styles.addDataTitle}`}><span style={{ color: 'red' }}>*</span>Button Id</p>
            <input type='text' className={`${styles.addDataInp}`} value={buttonId}
              onChange={(e) => {
                const enteredValue = e.target.value;
                const numbersOnly = /^[0-9\b]+$/;

                if (enteredValue === '' || numbersOnly.test(enteredValue)) {
                  setButtonId(enteredValue);
                  setButtonIdError(false);
                }
              }}
              style={{ border: buttonIdError && '1px solid red' }}
            />
          </div>
          <div className={`${styles.addDataMain}`}>
            <p  className={`${styles.addDataTitle}`}><span style={{ color: 'red' }}>*</span>What Notes</p>
            <textarea type='text' className={`${styles.addDataTextAre}`} value={whatNotes} onChange={(e) => {
              setWhatNotes(e.target.value);
              setWthasNoteError(false);
            }}
              style={{ border: whatsNoteError && '1px solid red' }}
            />
          </div>
          <div className={`${styles.addDataMain}`}>
            <p  className={`${styles.addDataTitle}`}><span style={{ color: 'red' }}>*</span>How Notes</p>
            <textarea type='text' className={`${styles.addDataTextAre}`} value={howNotes} onChange={(e) => {
              setHowNotes(e.target.value);
              setHowsNotesError(false);
            }}

              style={{ border: howNotesError && '1px solid red' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {editRowId !== undefined || '' ?
              <button onClick={handleUpdate} className={`${styles.addDataSaveBtn}`}> Update </button>
              :
              <>
                <button onClick={() => handleSave(true)} className={`${styles.addDataSaveBtn}`}>Save</button>
                <button onClick={() => handleSave(false)} className={`${styles.addDataSaveBtn}`}>Save & New</button>
              </>
            }
          </div>
        </div>
      </Dialog>


      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ margin: '10px', width: '47%', display: 'flex', justifyContent: 'space-between' }}>
          <div>

            <button variant="outlined" className={`${styles.addDataBtnMain}`} onClick={handleOpen} style={{}}>
              Add Data
            </button>

            <button variant="outlined" className={`${styles.addDataBtnMain}`} onClick={handleDeleteSeleted} style={{}}>
              DeleteAll
            </button>

          </div>
          <div className={`${styles.topSearchBoxDiv}`}>
            <IoSearch />
            <input type='text'
              placeholder='Search..'
              className={`${styles.topSearchBox}`}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  setSearchText(e.target.value);
                }
              }} />
          </div>
        </div>

        <div style={{ height: '90vh', width: '48%' }}>
          <DataGrid
            checkboxSelection={true}
            selectionModel={selectionModel}
            onRowSelectionModelChange={item =>  setSelectionModel(item)}

            rows={searchText ? filterRows() : rows}
            columns={columns.map((column) => ({
              ...column,
              headerClassName: column.hide ?  `${styles.customHeaderCellHide}` : `${styles.customHeaderCell}`, // Apply custom CSS class to header cells
            }))}

            components={{
              Toolbar: GridToolbar,
            }}

          />
        </div>
      </div>
    </div >
  );
}