import { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'

// import CustomTextField from '../@core/components/mui/text-field'
import CustomTextField from '../@core/mui/text-field'

import axios from 'axios'
// import CustomAvatar from '../@core/components/mui/avatar'
import { Button, CardContent, Grid, Tooltip, Typography, useTheme } from '@mui/material';
import * as XLSX from 'xlsx';
import Sidebar from './Sidebar';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import MenuItem from '@mui/material/MenuItem';
import DatePicker from 'react-datepicker'
import "./trainingdatagrid.css";
import { DataGrid } from '@mui/x-data-grid'
import CustomInput from "../@core/PickersComponent";
import "../@core/date-pickers.css";
import "react-datepicker/dist/react-datepicker.css";
import { checkWord } from './global';
import { parse } from 'date-fns';
import { cloneDeep } from 'lodash'
import moment from 'moment'

const renderName = row => {
  // if (row.avatar) {
  //   // return <CustomAvatar src={row.avatar} sx={{ mr: 2.5, width: 38, height: 38 }} />
  //   return ''
  // } else {
  //   return (
  //     <>
  //     </>
  //   )
  // }
  
}


const TrainingTypeArr = [
  {
    id:1,
    field:'newtraining',
    label:'New Training'
  },
  {
    id:2,
    field:'retraining',
    label:'Re Training'
  },
  {
    id:3,
    field:'ignite',
    label:'Ignite'
  },
];
const TrainingModeArr = [
  {
    id:1,
    field:'online',
    label:'Online'
  },
  {
    id:2,
    field:'onsite',
    label:'OnSite'
  },
  
];



const TrainingDataGrid = ({ex_url, tkn, sv, report_api_url}) => {

  const [date, setDate] = useState(new Date())

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  // ** State
  const [apiData, setApiData] = useState([]);
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [value, setValue] = useState('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })
  const [selectedData, setSelectedData] = useState([]);

  const [startDateRange, setStartDateRange] = useState(null);
  const [endDateRange, setEndDateRange] = useState(null);

  const [trainingType, setTrainingType] = useState();
  const [trainingMode, setTrainingMode] = useState();

  const [summaryData, setSummaryData] = useState(null);

  // const handleOnChangeRange = (dates) => {
  //   const [start, end] = dates;
  //   setStartDateRange(start);
  //   setEndDateRange(end);
  // };


  const theme = useTheme();
  const toggleDrawer = (open) => () => {
    setIsSidebarOpen(open)
  }

  const columns = [   
    {
      flex: 0.1,
      minWidth: 105,
      field: 'Date',
      headerName: 'DATE',
      // renderCell: ({ row }) => <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'centera' }}><Typography className='fs_analytics_l' sx={{ color: 'text.secondary' }}>{checkWord(row?.Date)}</Typography></Box>
      renderCell: ({ row }) => <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'centera' }}>
          <Typography className='fs_analytics_l' sx={{ color: 'text.secondary' }}>{(row?.date)}</Typography>
        </Box>
    },
    {
      flex: 0.1,
      field: 'Ticket',
      minWidth: 150,
      headerName: 'TICKET',
      renderCell: ({ row }) => {
        const {  Ticket, Date } = row
  
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderName(row)}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap className='fs_analytics_l' sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {checkWord(Ticket)}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    // {
    //   flex: 0.1,
    //   minWidth: 105,
    //   field: 'TrainingMode',
    //   headerName: 'TRAINING MODE',
    //   renderCell: ({ row }) => <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'centera' }}>
    //     <Typography className='fs_analytics_l' sx={{ color: 'text.secondary' }}>{checkWord(row?.TrainingMode)}</Typography></Box>
    // },
    {
      flex: 0.1,
      minWidth: 105,
      field: 'TrainingMode',
      headerName: 'TRAINING MODE',
      renderCell: ({ row }) => {
        // Standardize the TrainingMode for display
        let displayValue = row?.TrainingMode?.toLowerCase();
        if (['on-site', 'on site', 'onsite'].includes(displayValue)) {
          displayValue = 'OnSite';
        } else if (['on-line', 'on line', 'online'].includes(displayValue)) {
          displayValue = 'Online';
        } else {
          displayValue = row?.TrainingMode; // Fallback to original value if no match
        }
  
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography className="fs_analytics_l" sx={{ color: 'text.secondary' }}>
              {displayValue}
            </Typography>
          </Box>
        );
      },
    },
    // {
    //   flex: 0.1,
    //   field: 'TrainingType',
    //   minWidth: 120,
    //   sortable: false,
    //   headerName: 'TRAINING TYPE',
    //   renderCell: ({ row }) => (
    //     <>
    //     <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'centera' }}>
    //       <Typography className='fs_analytics_l' sx={{ color: 'text.secondary' }}>{checkWord(row?.TrainingType)}</Typography>
    //     </Box>
    //     </>
    //   )
    // },
    {
      flex: 0.1,
      field: 'TrainingType',
      minWidth: 120,
      sortable: false,
      headerName: 'TRAINING TYPE',
      renderCell: ({ row }) => {
        // Standardize the TrainingType for display
        let displayValue = row?.TrainingType?.toLowerCase();
        if (['retraining', 're-training', 're training'].includes(displayValue)) {
          displayValue = 'Re Training';
        } else if (['newtraining', 'new-training', 'new training'].includes(displayValue)) {
          displayValue = 'New Training';
        } else {
          displayValue = row?.TrainingType; // Fallback to original value if no match
        }
    
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography className="fs_analytics_l" sx={{ color: 'text.secondary' }}>
              {displayValue}
            </Typography>
          </Box>
        );
      },
    },
    
    {
      flex: 0.1,
      minWidth: 50,
      field: 'Time',
      headerName: 'TIME',
      renderCell: ({ row }) => (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'centera' }}>
            <Typography className='fs_analytics_l' sx={{ color: 'text.secondary', display:'flex', flexWrap:'wrap' }}>{`${checkWord(row?.Time)}`}</Typography>
          </Box>
        </>
      )
    },
    {
      flex: 0.1,
      minWidth: 50,
      field: 'TrainingBy',
      headerName: 'TrainingBy',
      renderCell: ({ row }) => (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'centera' }}>
            <Typography className='fs_analytics_l' sx={{ color: 'text.secondary', display:'flex', flexWrap:'wrap' }}>{`${checkWord(row?.TrainingBy)}`}</Typography>
          </Box>
        </>
      )
    },
    {
      flex: 0.1,
      minWidth: 50,
      field: 'Attandees',
      headerName: 'Attandees',
      renderCell: ({ row }) => (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'centera' }}>
            <Typography className='fs_analytics_l' sx={{ color: 'text.secondary', display:'flex', flexWrap:'wrap' }}>{`${checkWord(row?.Attandees)}`}</Typography>
          </Box>
        </>
      )
    },
    {
      flex: 0.1,
      minWidth: 100,
      sortable: false,
      field: 'Details',
      headerName: 'DETAILS',
      align: 'center', // Center the cell content
      headerAlign: 'center',
      renderCell: ({row}) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

        <VisibilityIcon style={{cursor:'pointer'}}  onClick={() => {
          setSelectedData(row); // Store the row data
          setIsSidebarOpen(true); // Open the sidebar
        }} />
        </Box>
      )
    }
  ]

  useEffect(() => {
    handleFilter(); // Apply filter when criteria changes
  }, [value, trainingType, trainingMode, startDateRange, endDateRange]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        
        
        let url = '';
        
        // if(window.location.protocol === "http"){
        //   url = 'http://zen/R50B3/UFS/websitedetailsexcel/training.xlsx';
        // }
        // if(window.location.protocol === "http"){
        //   url = 'https://cdnfs.optigoapps.com/content-global3/test_traininggrid/training.xlsx';
        // }
        // url = "https://cdnfs.optigoapps.com/content-global3/test_traininggrid/training.xlsx";
        // url = `http://api.optigoapps.com/ALL/exceltojson.aspx?tkn=${tkn}&sv=${sv}`;
        // url = `http://api.optigoapps.com/ALL/exceltojson.aspx?tkn=${tkn}&sv=${sv}`;


        const replacedUrl = (report_api_url)?.replace("M.asmx/Optigo", "exceltojson.aspx");
        
        const response = await axios.get(`${replacedUrl}?tkn=${tkn}&sv=${sv}`);

        // const response = await axios.get(`http://api.optigoapps.com/ALL/exceltojson.aspx?tkn=ODQ1NjUxMDgwNzU2OTk5MA==&sv=MQ==`);
        
        if(response?.data?.Status === "200"){
          if(response?.data?.Data?.length > 0){
            let arr = [];
            response?.data?.Data?.forEach((e, i) => {
              let obj = {...e};
              obj.id = i + 1;
              obj.date = obj?.Date?.split(" ")[0];
              if(obj?.TrainingMode?.toLowerCase() === 'on-site' || obj?.TrainingMode?.toLowerCase() === 'on site' || obj?.TrainingMode?.toLowerCase() === 'onsite'){
                obj.TrainingMode = 'onsite';
              }
              if(obj?.TrainingMode?.toLowerCase() === 'on-line' || obj?.TrainingMode?.toLowerCase() === 'on line' || obj?.TrainingMode?.toLowerCase() === 'online'){
                obj.TrainingMode = 'online';
              }
              if(obj?.TrainingType?.toLowerCase() === 're-training' || obj?.TrainingType?.toLowerCase() === 're training' || obj?.TrainingType?.toLowerCase() === 'retraining'){
                obj.TrainingType = 'retraining';
              }
              if(obj?.TrainingType?.toLowerCase() === 'new-training' || obj?.TrainingType?.toLowerCase() === 'new training' || obj?.TrainingType?.toLowerCase() === 'newtraining'){
                obj.TrainingType = 'newtraining';
              }
              // obj.Date = moment(obj?.Date)?.format("DD/MM/YYYY");
              arr.push(obj);
            });
            
            setApiData(arr);
            setFilteredData(arr);
          }
          
          // const data = new Uint8Array(response?.data);
          // const workbook = XLSX.read(data, { type: 'array' });
          // const sheetName = workbook?.SheetNames[0];
          // const sheet = workbook?.Sheets[sheetName];
          // const jsonData = XLSX?.utils?.sheet_to_json(sheet);
   
          
          // // const formattedData = jsonData?.map((row) => {
          // //   console.log(row);
            
          // //   if (row?.Date) {
          // //     const parts = row?.Date?.split('-'); // Split the date '25-10-2024'
          // //     const parsedDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`); // Rearrange to 'YYYY-MM-DD'
          // //     row.Date = parsedDate.toLocaleDateString(); // Format as 'MM/DD/YYYY'
          // //   }
          // //   return row;
          // // });

          //           // Convert any Excel serial date numbers manually if necessary
          //           const formattedData = jsonData?.map((row) => {
          //             // Check if any column is a date serial number and convert it to date object
          //             for (let key in row) {
          //               if (row[key] instanceof Date && !isNaN(row[key].getTime())) {
          //                 // Convert Excel date serial to JavaScript Date if it's a valid date serial number
          //                 row[key] = row[key].toLocaleDateString(); // Or any other format
          //               }
          //             }
          //             return row;
          //           });
          //           console.log(formattedData);
                    

          
          // const arr = jsonData?.sort((a, b) => a?.sr - b?.sr);
          // const arr2 = cloneDeep(arr);

          // setApiData(response);
   

        }else{
          console.log(response?.statusText);
        }
      } catch (error) {
        console.error('Error fetching or processing data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setData(apiData);
    setFilteredData(apiData);
  },[apiData]);

  useEffect(() => {
    
    let obj = {
      newTrainig:0,
      newTrainigTime:0,
      reTraining:0,
      reTrainingTime:0,
      Ignite:0,
      IgniteTime:0 
    }

    filteredData?.forEach((e) => {
      
      if(e?.TrainingType?.toLowerCase() === "newtraining"){
        obj.newTrainig += 1;
        obj.newTrainigTime += (+e?.Time);
      }
      if(e?.TrainingType?.toLowerCase() === "retraining" || e?.TrainingType?.toLowerCase() === "re-training"){
        obj.reTraining += 1;
        obj.reTrainingTime += (+e?.Time);
      }
      if(e?.TrainingType?.toLowerCase() === "ignite"){
        obj.Ignite += 1;
        obj.IgniteTime += (+e?.Time);
      }
    })

    setSummaryData(obj);

    

  },[filteredData])


  // const handleFilter = val => {
  //   setValue(val);

  //   setPaginationModel({ ...paginationModel, page: 0 }); // Reset to first page on filter change

  //   setValue(val);

  //   const filteredData = data?.filter((item) => {
  //     const trainingMode = item?.TrainingMode?.toLowerCase();  // Make sure both values are lowercase for case-insensitive comparison
  //     const ticket = item?.Ticket?.toLowerCase();  // Make sure both values are lowercase for case-insensitive comparison
  //     const trainingType = item?.TrainingType?.toLowerCase();
  //     const time = item?.Time?.toString()?.toLowerCase();
  //     const id = item?.id?.toString()?.toLowerCase();
  //     const date = item?.Date?.toString()?.toLowerCase();
  //     const searchVal = val?.toLowerCase();
  //     const Attandees = item?.Attandees?.toLowerCase();
  //     const TrainingBy = item?.TrainingBy?.toLowerCase();
  
  //     return (
  //       trainingMode?.includes(searchVal) ||
  //       Attandees?.includes(searchVal) ||
  //       TrainingBy?.includes(searchVal) ||
  //       ticket?.includes(searchVal) ||
  //       trainingType?.includes(searchVal) ||
  //       time?.includes(searchVal) ||
  //       date?.includes(searchVal) ||
  //       id?.includes(searchVal)  // Check if either MetalType or MetalColor includes the search term
  //     );
  //   });
    

  //   setFilteredData(filteredData);

  // }

  const handleOnChangeRange = (dates) => {
    const [start, end] = dates;
    setStartDateRange(start);
    setEndDateRange(end);
    handleFilter(value); // Trigger filter with the current search value
  };

  const handleTTypeChange = (e) => {
    setTrainingType(e.target.value);
    // handleFilter(value); // Trigger filter with the current search value
  };
  
  const handleTModeChange = (e) => {
    setTrainingMode(e.target.value);
    // handleFilter(value); // Trigger filter with the current search value
  };
  
  const handleFilter = () => {
    const searchVal = value.toLowerCase();
    
    const filteredData = data?.filter((item) => {
      // const trainingMode = item?.TrainingMode?.toLowerCase() || '';
      // const trainingType = item?.TrainingType?.toLowerCase() || '';
      // const date = item?.Date ? new Date(item.Date) : null;
      // const date = item?.date ? new Date(item?.date) : null;
      const date = item?.date ? moment(item.date, 'DD/MM/YYYY') : null;
      
      // Search filter
      const isSearchMatch =
        item?.TrainingMode.includes(searchVal) ||
        item?.TrainingType.includes(searchVal) ||
        item?.Ticket?.toLowerCase()?.includes(searchVal) ||
        item?.Time?.toString()?.includes(searchVal) ||
        item?.id?.toString()?.includes(searchVal) ||
        item?.date?.toLowerCase()?.includes(searchVal) ||
        item?.Attandees?.toLowerCase()?.includes(searchVal) ||
        item?.TrainingBy?.toLowerCase()?.includes(searchVal);
      
        const isTrainingTypeMatch =
          !trainingType || trainingType === item?.TrainingType?.toLowerCase();

        const isTrainingModeMatch =
          !trainingMode || trainingMode === item?.TrainingMode?.toLowerCase();
      
          
          const parsedStartDate = startDateRange ? moment(startDateRange, 'DD/MM/YYYY') : null;
          const parsedEndDate = endDateRange ? moment(endDateRange, 'DD/MM/YYYY') : null;
              // Date range filter
    const isDateMatch =
    (!parsedStartDate || (date && date?.isSameOrAfter(parsedStartDate))) &&
    (!parsedEndDate || (date && date?.isSameOrBefore(parsedEndDate)));
          
      // Combine all conditions
      return isSearchMatch && isTrainingTypeMatch && isTrainingModeMatch && isDateMatch;
    });
    
    setFilteredData(filteredData);
  };
  
  const handleFilterAll = () => {
    setTrainingMode('');
    setTrainingType('');
    setValue('');
    setStartDateRange(null);
    setEndDateRange(null);
    setFilteredData(apiData);
  }

  const popperPlacement = 'bottom-start';
  return data ? (
    <>
    <Sidebar isOpen={isSidebarOpen} toggleDrawer={toggleDrawer} selectedData={selectedData} setIsSidebarOpen={setIsSidebarOpen}  />
    <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', overflow:'scroll'}}>
    <Grid container style={{display:'flex', justifyContent:'center'}}>
      <Grid xs={10} sm={8} md={8} xl={8} >

    <Card  className='fs_analytics_l'  style={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)', padding:'15px'}}>
      <Card className="a" sx={{ boxShadow: 'none', paddingTop: '0px',  borderRadius: '0px', borderBottom:'1px solid #e8e8e8' }}>
        <CardHeader
          fullWidth
          className="fs_analytics_l a"
          titleTypographyProps={{ sx: { mb: [2, 0], fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }, p:0 }}
          sx={{p:0}}
          action={
            <Box
              sx={{
                display: 'flex',
                flexDirection: ['column', 'row'],
                gap: 2,
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                padding:'0px'
              }}
            >
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'flex-start', padding:'0px', paddingBottom:'10px' }} >            
          <Card sx={{ boxShadow: 'none', border: '1px solid #e8e8e8', my: 1, p:1, borderRadius: '8px',  }} className='trainingHead'>
            <Typography variant='h5' className="fs_analytics_l">New Training</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1, m:0 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme?.palette?.customColors?.purple }} className="fs_analytics_l" style={{cursor:'pointer'}}><Tooltip title="Count">{summaryData?.newTrainig}</Tooltip></Typography>
              <Typography variant="h4" sx={{color: theme?.palette?.customColors?.purple}}>/</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme?.palette?.customColors?.purple, cursor:'pointer' }}><Tooltip title="Time">{(summaryData?.newTrainigTime)}</Tooltip></Typography>
            </Box>
          </Card>           
          <Card sx={{ boxShadow: 'none', border: '1px solid #e8e8e8', my: 1, p:1, borderRadius: '8px',  }} className='trainingHead'>
            <Typography variant='h5' className="fs_analytics_l">Re Training</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1, m:0 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme?.palette?.customColors?.purple }} style={{cursor:'pointer'}}><Tooltip title="Count">{summaryData?.reTraining}</Tooltip></Typography>
              <Typography variant="h4" sx={{color: theme?.palette?.customColors?.purple}}>/</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme?.palette?.customColors?.purple, cursor:'pointer' }}><Tooltip title="Time">{summaryData?.reTrainingTime}</Tooltip></Typography>
            </Box>
          </Card>
          <Card sx={{ boxShadow: 'none', border: '1px solid #e8e8e8', my: 1, p:1, borderRadius: '8px',  }} className='trainingHead'>
            <Typography variant='h5' className="fs_analytics_l">Ignite</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1, m:0 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme?.palette?.customColors?.purple }} style={{cursor:'pointer'}}><Tooltip title="Count">{summaryData?.Ignite}</Tooltip></Typography>
              <Typography variant="h4" sx={{color: theme?.palette?.customColors?.purple}}>/</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme?.palette?.customColors?.purple, cursor:'pointer' }}><Tooltip title="Time">{summaryData?.IgniteTime}</Tooltip></Typography>
            </Box>
          </Card>
        </Box>
        <Box sx={{my:1}}>
          <Typography variant='h2' sx={{color:'#727272'}} className='fs_analytics_l'>TRAINING DATA</Typography>
        </Box>
      </Box>
        }
        />
      </Card>

        {/* <CardHeader
            title="TRAINING DATA"
            titleTypographyProps={{
              sx: { mb: [2, 0] },
            }}
            
            sx={{
              // py: 1,
              // pt:2,
              pb:1,
              px:0,
              flexDirection: ['column', 'row'], // Stacks vertically on small screens and horizontally on larger screens
              '& .MuiCardHeader-action': { m: 0 },
              alignItems: ['flex-start', 'center'],
            }}
            className="fs_analytics_l"
          /> */}
      <Grid
        container
        spacing={1}
        sx={{
          width: '100%',
          flexDirection: ['column', 'row'], // Stack vertically on small screens and horizontally on larger screens
          padding:'10px 0px 10px 0px',
          justifyContent:'space-between'
        }}
      >
        {/* Search Filter */}
        <Grid item xs={12} sm={6} md={2.4}>
          <CustomTextField
            value={value}
            placeholder="Search"
            label="Search"
            fullWidth
            onChange={(e) => setValue(e.target.value)}
            variant="outlined"
            size="small"
            className='fs_analytics_l '
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2.4} className='cst_d_picker'>
          <DatePicker
            autoComplete='off'
            selectsRange
            monthsShown={2}
            endDate={endDateRange}
            selected={startDateRange}
            startDate={startDateRange}
            shouldCloseOnSelect={false}
            id='date-range-picker-months'
            onChange={handleOnChangeRange}
            className='fs_analytics_l fs_clide_date'
            popperPlacement={popperPlacement}
            customInput={<CustomInput label='Search By Date' end={endDateRange} start={startDateRange} fullWidth className="dateFilter fs_analytics_l fs_clide_date'"  />}
          />
        </Grid>

        {/* <Grid item xs={12} sm={6} md={3} className='cst_d_picker'>
          <DatePicker
            selected={date}
            id='basic-input'
            popperPlacement={popperPlacement}
            onChange={date => setDate(date)}
            dateFormat="dd/mm/yyyy"
            placeholderText='Click to select a date'
            className='fs_analytics_l fs_clide_date'
            customInput={<CustomInput label='Start Date' className='fs_analytics_l fs_clide_date' />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3} className='cst_d_picker'>
            <DatePicker
              selected={date}
              id='basic-input'
              popperPlacement={popperPlacement}
              dateFormat="dd/mm/yyyy"
              onChange={date => setDate(date)}
              placeholderText='Click to select a date'
              className='fs_analytics_l fs_clide_date'
              customInput={<CustomInput label='End Date' className='fs_analytics_l fs_clide_date' />}
            />
        </Grid> */}
        

        <Grid item xs={12} sm={6} md={2.4}>
          <CustomTextField
           key={trainingType} 
            select
            defaultValue=""
            fullWidth
            label="Training Type"
            value={trainingType}
            SelectProps={{
              readOnly: false,
              MenuProps: {
                PaperProps: {
                  sx: {
                    '& .MuiMenuItem-root.Mui-selected': {
                      backgroundColor: theme?.palette?.customColors?.purple,
                      color: 'white',
                      fontWeight: 'bold',
                      '&:hover': {
                        backgroundColor: theme?.palette?.customColors?.purple,
                        color: 'white',
                      },
                    },
                  },
                },
              },
            }}
            className='fs_analytics_l' 
            sx={{
              width: '100%',
            }}
            onChange={(event) => handleTTypeChange(event)}
          >
            <MenuItem className="fs_analytics_l" value="">
              <em>None</em>
            </MenuItem>
            {TrainingTypeArr.map((option) => (
              <MenuItem key={option.id} value={option.field}>
                {option.label}
              </MenuItem>
            ))}
          </CustomTextField>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <CustomTextField
            key={trainingMode} 
            select
            defaultValue=""
            fullWidth
            label="Training Mode"
            value={trainingMode}
            SelectProps={{
              readOnly: false,
              MenuProps: {
                PaperProps: {
                  sx: {
                    '& .MuiMenuItem-root.Mui-selected': {
                      backgroundColor: theme?.palette?.customColors?.purple,
                      color: 'white',
                      fontWeight: 'bold',
                      '&:hover': {
                        backgroundColor: theme?.palette?.customColors?.purple,
                        color: 'white',
                      },
                    },
                  },
                },
              },
            }}
            className='fs_analytics_l' 
            sx={{
              width: '100%',
            }}
            onChange={(event) => handleTModeChange(event)}
          >
            <MenuItem className="fs_analytics_l" value="">
              <em>None</em>
            </MenuItem>
            {TrainingModeArr.map((option) => (
              <MenuItem key={option.id} value={option.field}>
                {option.label}
              </MenuItem>
            ))}
          </CustomTextField>
        </Grid>

        <Grid  item xs={12} sm="auto" md={2.4} sx={{ textAlign: { xs: 'center', sm: 'left' }, display:'flex', justifyContent:'center', alignItems:'flex-end', pb:0.3 }}>
          <Button variant='contained' color="success" onClick={() => handleFilterAll()}>All</Button>
        </Grid>

      </Grid>
      <DataGrid
        className='fs_analytics_l'
        pagination
        rows={filteredData}
        rowHeight={62}
        columns={columns}
        pageSizeOptions={[5, 10]}
        disableRowSelectionOnClick
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        sx={{
          height: '421px',
          overflow:'auto',
          '& .MuiDataGrid-cell:focus': {
            outline: 'none', // Removes the outline when a cell is focused
          },
          '& .MuiDataGrid-cell:focus-visible': {
            outline: 'none', // Ensures no outline when the cell is clicked or focused
          },
          '& .MuiDataGrid-columnHeader:focus': {
            outline: 'none', // Removes the outline from the column header when focused
          },
          '& .MuiDataGrid-columnHeader:focus-visible': {
            outline: 'none', // Ensures no outline when the column header is clicked or focused
          },
          '& .MuiDataGrid-root::-webkit-scrollbar': {
            width: '8px', // Custom scrollbar width (horizontal and vertical)
          },
          '& .MuiDataGrid-root::-webkit-scrollbar-thumb': {
            backgroundColor: '#1976d2', // Custom color for the scrollbar thumb
            borderRadius: '4px', // Optional: make the thumb rounded
          },
          '& .MuiDataGrid-root::-webkit-scrollbar-track': {
            backgroundColor: '#f0f0f0', // Custom background for the scrollbar track
          },
        }}
      />
    </Card>
    </Grid>

    </Grid>
    </div>
  
    </>
  ) : null
}

export default TrainingDataGrid;
const datas = [
  {
      "id": 1,
      "status": 38,
      "leader": "Eileen",
      "name": "Website SEO",
      "date": "10 may 2021",
      "avatarColor": "success",
      "avatarGroup": [
          "/images/avatars/1.png",
          "/images/avatars/4.png",
          "/images/avatars/3.png",
          "/images/avatars/2.png"
      ]
  },
  {
      "id": 2,
      "status": 45,
      "leader": "Owen",
      "date": "03 Jan 2021",
      "name": "Social Banners",
      "avatar": "/images/icons/project-icons/social-label.png",
      "avatarGroup": [
          "/images/avatars/5.png",
          "/images/avatars/6.png"
      ]
  },
  {
      "id": 3,
      "status": 92,
      "leader": "Keith",
      "date": "12 Aug 2021",
      "name": "Logo Designs",
      "avatar": "/images/icons/project-icons/sketch-label.png",
      "avatarGroup": [
          "/images/avatars/2.png",
          "/images/avatars/1.png",
          "/images/avatars/7.png",
          "/images/avatars/8.png"
      ]
  },
  {
      "id": 4,
      "status": 56,
      "leader": "Merline",
      "date": "19 Apr 2021",
      "name": "IOS App Design",
      "avatar": "/images/icons/project-icons/sketch-label.png",
      "avatarGroup": [
          "/images/avatars/5.png",
          "/images/avatars/3.png",
          "/images/avatars/6.png",
          "/images/avatars/7.png"
      ]
  },
  {
      "id": 5,
      "status": 25,
      "leader": "Harmonia",
      "date": "08 Apr 2021",
      "name": "Figma Dashboards",
      "avatar": "/images/icons/project-icons/figma-label.png",
      "avatarGroup": [
          "/images/avatars/7.png",
          "/images/avatars/6.png",
          "/images/avatars/8.png"
      ]
  },
  {
      "id": 6,
      "status": 36,
      "leader": "Allyson",
      "date": "29 Sept 2021",
      "name": "Crypto Admin",
      "avatar": "/images/icons/project-icons/html-label.png",
      "avatarGroup": [
          "/images/avatars/2.png",
          "/images/avatars/5.png"
      ]
  },
  {
      "id": 7,
      "status": 72,
      "leader": "Georgie",
      "date": "20 Mar 2021",
      "name": "Create Website",
      "avatar": "/images/icons/project-icons/react-label.png",
      "avatarGroup": [
          "/images/avatars/3.png",
          "/images/avatars/1.png",
          "/images/avatars/6.png"
      ]
  },
  {
      "id": 8,
      "status": 89,
      "leader": "Fred",
      "date": "09 Feb 2021",
      "name": "App Design",
      "avatar": "/images/icons/project-icons/xd-label.png",
      "avatarGroup": [
          "/images/avatars/7.png",
          "/images/avatars/6.png"
      ]
  },
  {
      "id": 9,
      "status": 77,
      "leader": "Richardo",
      "date": "17 June 2021",
      "name": "Angular APIs",
      "avatar": "/images/icons/project-icons/figma-label.png",
      "avatarGroup": [
          "/images/avatars/5.png",
          "/images/avatars/8.png",
          "/images/avatars/1.png"
      ]
  },
  {
      "id": 10,
      "status": 100,
      "leader": "Genevra",
      "date": "06 Oct 2021",
      "name": "Admin Template",
      "avatar": "/images/icons/project-icons/vue-label.png",
      "avatarGroup": [
          "/images/avatars/2.png",
          "/images/avatars/3.png",
          "/images/avatars/4.png",
          "/images/avatars/5.png"
      ]
  }
]