// ** MUI Import
import Grid from '@mui/material/Grid'

// // ** Demo Component Imports
// import AnalyticsProject from 'src/views/dashboards/analytics/AnalyticsProject'
// import AnalyticsOrderVisits from 'src/views/dashboards/analytics/AnalyticsOrderVisits'
// import AnalyticsTotalEarning from 'src/views/dashboards/analytics/AnalyticsTotalEarning'
// import AnalyticsSourceVisits from 'src/views/dashboards/analytics/AnalyticsSourceVisits'
// import AnalyticsEarningReports from 'src/views/dashboards/analytics/AnalyticsEarningReports'
// import AnalyticsSupportTracker from 'src/views/dashboards/analytics/AnalyticsSupportTracker'
// import AnalyticsSalesByCountries from 'src/views/dashboards/analytics/AnalyticsSalesByCountries'
// import AnalyticsMonthlyCampaignState from 'src/views/dashboards/analytics/AnalyticsMonthlyCampaignState'
// import AnalyticsWebsiteAnalyticsSlider from 'src/views/dashboards/analytics/AnalyticsWebsiteAnalyticsSlider'

// ** Custom Component Import
// import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
// import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
// import CardStatsWithAreaChart from 'src/@core/components/card-statistics/card-stats-with-area-chart'
import KeenSliderWrapper from '../@core/styles/libs/keen-slider'
import ApexChartWrapper from '../@core/styles/libs/react-apexcharts'
import CardStatsWithAreaChart from '../@core/components/card-statistics/card-stats-with-area-chart'


import AnalyticsWebsiteAnalyticsSlider from './AnalyticsWebsiteAnalyticsSlider';
import AnalyticsOrderVisits from './AnalyticsOrderVisits';
import AnalyticsEarningReports from './AnalyticsEarningReports';
import AnalyticsSupportTracker from './AnalyticsSupportTracker';
import AnalyticsSalesByCountries from './AnalyticsSalesByCountries';
import AnalyticsTotalEarning from './AnalyticsTotalEarning';
import AnalyticsMonthlyCampaignState from './AnalyticsMonthlyCampaignState';
import AnalyticsSourceVisits from './AnalyticsSourceVisits';
import AnalyticsProject from './AnalyticsProject';
import RechartsPieChart from '../charts/recharts/RechartsPieChart';
import ApexRadialBarChart from '../charts/apex-charts/ApexRadialBarChart';
import CardStatsVertical from './../@core/components/card-statistics/card-stats-vertical/index';
import AnalyticsCustomerTypeWise from './AnalyticsCustomerTypeWise';
import AnalyticsFilters from './AnalyticsFilters';
import AnalyticsSalesEarningReport from './AnalyticsSalesEarningReport';
import AnalyticsSalesRepWiseSaleAmt from './AnalyticsSalesRepWiseSaleAmt';
import { useEffect, useState } from 'react';
import { Box, Button, useTheme } from '@mui/material';
import moment from 'moment';

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Custom Component Imports
import CustomInput from '../@core/components/pickersComponent/PickersCustomInput';
import "../@core/components/pickersComponent/datepickerc.css";
import { fetchDashboardData } from '../GlobalFunctions';

const AnalyticsDashboard = ({tkn}) => {
  const [fdate, setFDate] = useState(null);
  const [tdate, setTDate] = useState(null);
  const [fdatef, setFDatef] = useState("");
  const [tdatef, setTDatef] = useState("");
  const [popperPlacement, setPopperPlacement] = useState('bottom-start');
  const theme = useTheme();

  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState();
  const [salesList, setSalesList] = useState([]);
  const [selectedSales, setSelectedSales] = useState();
  const [officeList, setOfficeList] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState();

  //main api data 
  const [monthWiseSaleApiData, setMonthWiseSaleApiData] = useState([]);
  const [summryApiData, setSummaryApiData] = useState([]);
  const [orderTrackerApiData, setOrderTrackerApiData] = useState([]);
  const [CountryWiseSaleAmount, setCountryWiseSaleAmount] = useState([]);
  const [CustomerWiseSaleAmount, setCustomerWiseSaleAmount] = useState([]);
  const [CategoryWiseSaleAmount, setCategoryWiseSaleAmount] = useState([]);
  const [MetalTypeColorWiseSale, setMetalTypeColorWiseSale] = useState([]);
  const [CustomerTypeWiseSaleAmount, setCustomerTypeWiseSaleAmount] = useState([]);
  const [VendorWiseNetWt, setVendorWiseNetWt] = useState([]);
  const [SalesrepWiseSaleAmount, setSalesrepWiseSaleAmount] = useState([]);


  const countryListHandleChange = (e) => {
    setSelectedCountry(e.target.value);
  }
  const salesmanListHandleChange = (e) => {
    setSelectedSales(e.target.value);
  }
  const officeListHandleChange = (e) => {
    setSelectedOffice(e.target.value);
  }



  // const handleFDateChange = (e) => {
  //   const value = e.target.value;
  //   setFDate(value);
  
  //   // Only format if the value is valid
 
  // };
  
  // const handleTDateChange = (e) => {
  //   const value = e.target.value;
  //   setTDate(value);
  
  //   // Only format if the value is valid
    
  // };

  // const handleApply = () => {
  //   if (fdate) {
  //     const formattedFDate = moment(fdate)?.format('MM/DD/YYYY');  // Convert to MM/DD/YYYY format
  //     console.log('From Date (API Format):', formattedFDate);
  //     setFDatef(formattedFDate);
  //   } else {
  //     console.log('From Date (API Format): Invalid date');
  //   }
  //   if (tdate) {
  //     const formattedTDate = moment(tdate)?.format('MM/DD/YYYY');  // Convert to MM/DD/YYYY format
  //     console.log('To Date (API Format):', formattedTDate);
  //     setTDatef(formattedTDate);
  //   } else {
  //     console.log('To Date (API Format): Invalid date');
  //   }
  // }

  // useEffect(() => {
  //   // Get today's date
  //   const today = moment();

  //   // Financial year start: 1st April of current year
  //   const financialYearStart = moment()?.month(3)?.date(1); // April is 3rd month (0-based index)

  //   // Financial year end: 31st March of the next year
  //   const financialYearEnd = moment(financialYearStart)?.add(1, 'year')?.subtract(1, 'day');

  //   // Set initial values
  //   setFDate(financialYearStart?.toDate());
  //   setTDate(today?.isAfter(financialYearEnd) ? financialYearEnd?.toDate() : today?.toDate());
  //   setFDatef(financialYearStart?.format('MM/DD/YYYY'));
  //   setTDatef(today?.isAfter(financialYearEnd) ? financialYearEnd?.format('MM/DD/YYYY') : today?.format('MM/DD/YYYY'));

  // }, []);

  // const handleApply = () => {
  //   if (fdate) {
  //     const formattedFDate = moment(fdate)?.format('MM/DD/YYYY');
  //     console.log('From Date (API Format):', formattedFDate);
  //     setFDatef(formattedFDate);
  //   }
  //   if (tdate) {
  //     const formattedTDate = moment(tdate)?.format('MM/DD/YYYY');
  //     console.log('To Date (API Format):', formattedTDate);
  //     setTDatef(formattedTDate);
  //   }
  // };


  useEffect(() => {
    // Get today's date
    const today = moment();

    // Financial year start: 1st April of the current year
    // const financialYearStart = moment()?.month(3)?.date(1); // April is 3rd month (0-based index)
    const financialYearStart = moment()?.month(3)?.date(1); // April is 3rd month (0-based index)
    const financialYearEnd = moment(financialYearStart)?.add(1, "year")?.subtract(1, "day");
    // Set initial values
    setFDate(financialYearStart?.toDate());
    setTDate(today?.isAfter(financialYearEnd) ? financialYearEnd?.toDate() : today?.toDate());

    setTimeout(() => {
      handleApply();
    },0);
  
  }, []);

  const handleFDateChange = (date) => {
    // console.log(moment(date).format("MM/DD/YYYY"));
    setFDate(date); // Store the actual date
  };

  const handleTDateChange = (date) => {
    // console.log(moment(date).format("MM/DD/YYYY"));
    setTDate(date);
  };


  // const handleApply = () => {
  //   if (fdate) {
  //     const formattedFDate = moment(fdate)?.format('MM/DD/YYYY');
  //     console.log('From Date (API Format):', formattedFDate);
  //     setFDatef(formattedFDate);
  //   }else{
  //     setFDatef('');
  //   }
  //   if (tdate) {
  //     const formattedTDate = moment(tdate)?.format('MM/DD/YYYY');
  //     console.log('To Date (API Format):', formattedTDate);
  //     setTDatef(formattedTDate);
  //   }else{
  //     setTDatef('');  
  //   }
  // };

  const handleApply = () => {
    // Check if the 'from' and 'to' dates are valid
    if (fdate && tdate) {
      const startDate = moment(fdate);
      const endDate = moment(tdate);
  
      if (!startDate.isValid() || !endDate.isValid()) {
        alert('Please select valid dates.');
        return;
      }
  
      // Check if the end date is before the start date
      if (endDate.isBefore(startDate)) {
        alert('Invalid dates.');
        return;
      }
      // If everything is valid, format the dates and set the state
      const formattedFDate = startDate.format('MM/DD/YYYY');
      const formattedTDate = endDate.format('MM/DD/YYYY');
      console.log('From Date (API Format):', formattedFDate);
      console.log('To Date (API Format):', formattedTDate);
  
      setFDatef(formattedFDate);
      setTDatef(formattedTDate);
    } else {
      // If no dates are selected, reset both date fields
      setFDatef('');
      setTDatef('');
    }
  };


   useEffect(() => {

     const fetchData = async () => {
       try {

         const monthWiseSaleData = await fetchDashboardData(tkn, fdatef, tdatef, "MonthWiseSaleAmount");
         setMonthWiseSaleApiData(monthWiseSaleData);
         console.log(monthWiseSaleData);
         
         const summaryData = await fetchDashboardData(tkn, fdatef, tdatef, "Summary");
         setSummaryApiData(summaryData.length > 0 ? summaryData[0] : {});
         console.log(summaryData);

         const ProgressWiseOrder = await fetchDashboardData(tkn, fdatef, tdatef, "ProgressWiseOrder");
         setOrderTrackerApiData(ProgressWiseOrder);
         console.log(ProgressWiseOrder);

         const CountryWiseSaleAmount = await fetchDashboardData(tkn, fdatef, tdatef, "CountryWiseSaleAmount");
         setCountryWiseSaleAmount(CountryWiseSaleAmount);
         console.log(CountryWiseSaleAmount);
         

        const customerWiseSaleAmount = await fetchDashboardData(tkn,  fdatef, tdatef, "CustomerWiseSaleAmount");
        setCustomerWiseSaleAmount(customerWiseSaleAmount);
        console.log(customerWiseSaleAmount);
        

        const categoryWiseSaleAmount = await fetchDashboardData(tkn,  fdatef, tdatef, "CategoryWiseSaleAmount");
        setCategoryWiseSaleAmount(categoryWiseSaleAmount);
        console.log(categoryWiseSaleAmount);
        

        const metalTypeColorWiseSale = await fetchDashboardData(tkn,  fdatef, tdatef, "MetalTypeColorWiseSale");
        setMetalTypeColorWiseSale(metalTypeColorWiseSale);
        console.log(metalTypeColorWiseSale);
        

        const customerTypeWiseSaleAmount = await fetchDashboardData(tkn,  fdatef, tdatef, "CustomerTypeWiseSaleAmount");
        setCustomerTypeWiseSaleAmount(customerTypeWiseSaleAmount);
        console.log(customerTypeWiseSaleAmount);

        const vendorWiseNetWt = await fetchDashboardData(tkn,  fdatef, tdatef, "VendorWiseNetWt");
        setVendorWiseNetWt(vendorWiseNetWt);
        console.log(vendorWiseNetWt);

        const salesrepWiseSaleAmount = await fetchDashboardData(tkn,  fdatef, tdatef, "SalesrepWiseSaleAmount");
        setSalesrepWiseSaleAmount(salesrepWiseSaleAmount);
        console.log(salesrepWiseSaleAmount);

       } catch (error) {
         console.error("Error fetching data:", error);
       }
     };
  
     fetchData(); 

   },[fdatef, tdatef, selectedCountry, selectedSales, selectedOffice]);


  return (
    <ApexChartWrapper style={{paddingBottom:'2.5rem', paddingTop:'1rem', width:'95%', margin:'0 auto'}}>
   
      <KeenSliderWrapper>
        <Grid container spacing={3}>
          {/* <Grid item xs={12} lg={4} style={{paddingTop:'25px'}}>
            <AnalyticsWebsiteAnalyticsSlider tkn={tkn} />
            <CardStatsVertical
              stats='1.28k'
              chipText='-12.2%'
              chipColor='default'
              avatarColor='error'
              title='Total Profit'
              subtitle='Last week'
              avatarIcon='tabler:currency-dollar'
            />
          </Grid>
          <Grid item xs={12} lg={8} style={{paddingTop:'25px'}}>
            <AnalyticsFilters />
            <AnalyticsWebsiteAnalyticsSlider tkn={tkn} />
            <CardStatsVertical
              stats='1.28k'
              chipText='-12.2%'
              chipColor='default'
              avatarColor='error'
              title='Total Profit'
              subtitle='Last week'
              avatarIcon='tabler:currency-dollar'
            />
          </Grid> */}
          
          {/* <Grid item xs={12} sm={6} lg={3} style={{paddingTop:'53px'}}>
            <AnalyticsOrderVisits tkn={tkn} />
          </Grid> */}
          {/* <Grid item xs={12} sm={6} lg={3} style={{paddingTop:'53px'}}>
            <CardStatsWithAreaChart
              stats='97.5k'
              chartColor='success'
              avatarColor='success'
              title='Revenue Generated'
              className='fs_analytics_l'
              avatarIcon='tabler:credit-card'
              chartSeries={[{ data: [6, 35, 25, 61, 32, 84, 70] }]}
            />
          </Grid> */}

          <Grid item xs={12} md={12} lg={12}>
            <div className='d-flex justify-content-start align-items-end w-100'>
            <Box style={{margin:'5px', width:'22%', display:'flex', alignItems:'flex-end'}}>
              <div style={{display:'flex'}}>
                <div style={{display:'flex', flexDirection:'column'}}>
                  <span className='fs_analytics_l'>From Date</span>
                  <DatePicker
                    // selected={fdate}
                    selected={fdate}
                    id='basic-input'
                    popperPlacement={popperPlacement}
                    // onChange={date => setFDate(date)}
                    onChange={handleFDateChange}
                    // placeholderText='dd/mm/yyyy'
                    dateFormat="dd-MM-yyyy"
                    placeholderText={ "DD-MM-YYYY"}
                    customInput={<CustomInput className='fs_analytics_l' sx={{border:'1px solid #989898', backgroundColor:'white', marginRight:'10px'}}  />}
                    className='fs_analytics_l'
                  />
                </div>
                <div style={{display:'flex',  flexDirection:'column'}}>
                  <span className='fs_analytics_l'>To Date</span>
                  <DatePicker
                    selected={tdate}
                    id='basic-input'
                    popperPlacement={popperPlacement}
                    // onChange={date => setTDate(date)}
                    onChange={handleTDateChange}
                    dateFormat="dd-MM-yyyy"
                    // placeholderText='dd/mm/yyyy'
                    placeholderText={ "DD-MM-YYYY"}
                    customInput={<CustomInput className='fs_analytics_l' sx={{border:'1px solid #989898',  backgroundColor:'white', marginRight:'10px'}}  />}
                    className='fs_analytics_l'
                  />
                </div>
              </div>
              {/* <div style={{display:'flex', flexDirection:'column', marginRight:'10px'}}>
                <label>From Date</label>
                <input type="date" id="fdate" value={fdate} onChange={handleFDateChange} />
              </div>
              <div  style={{display:'flex', flexDirection:'column', marginRight:'10px'}}>
                <label htmlFor='tdate'>To Date</label>
                <input type="date" id="tdate" value={tdate} onChange={handleTDateChange} />
              </div> */}
            </Box>

            <Box className="me-1" style={{minWidth:'200px'}}>
              <label htmlFor="country">Country</label>
              <select className='form-control' value={selectedCountry} name="country" id="country" onChange={(e) => countryListHandleChange(e)}>
                <option value="" disabled selected>select</option>
                <option value="ind">USA</option>
              </select>
            </Box>
            <Box className="me-1" style={{minWidth:'200px'}}>
              <label htmlFor="salesman">Salesman</label>
              <select className='form-control' name="salesman" value={selectedSales} id="salesman" onChange={(e) => salesmanListHandleChange(e)}>
                <option value="" disabled selected>select </option>
              </select>
            </Box>
            <Box className="me-1" style={{minWidth:'200px'}}>
            <label htmlFor="office">Office</label>
              <select className='form-control' name="office" id="office" value={selectedOffice} onChange={(e) => officeListHandleChange(e)}>
                <option value="" disabled selected>select </option>
                <option value="mumbai">mumbai</option>
              </select>
            </Box>
            <div><Button variant='contained' sx={{backgroundColor:theme?.palette?.customColors?.green}} size='large' onClick={() => handleApply()}>Apply</Button></div>

            </div>
          </Grid>
         
          <Grid item xs={12} md={6} lg={9} style={{paddingTop:'25px'}}>
            <AnalyticsEarningReports tkn={tkn} fdate={fdatef} tdate={tdatef} country={selectedCountry} salesman={selectedSales} office={selectedOffice} />
          </Grid>
          <Grid item xs={12} md={6} lg={3} style={{paddingTop:'25px'}}>
            <AnalyticsSupportTracker tkn={tkn} fdate={fdatef} tdate={tdatef} country={selectedCountry} salesman={selectedSales} office={selectedOffice} />
          </Grid>
          {/* <Grid item xs={12} md={4} style={{paddingTop:'25px'}}>
            <AnalyticsSalesRepWiseSaleAmt tkn={tkn} />
          </Grid> */}
          
          <Grid item xs={12} sm={6} md={4} lg={3} style={{paddingTop:'25px'}}>
            <AnalyticsSalesByCountries tkn={tkn} fdate={fdatef} tdate={tdatef} country={selectedCountry} salesman={selectedSales} office={selectedOffice} />
          </Grid>
          
          {/* <Grid item xs={12} md={6} lg={4} style={{paddingTop:'25px'}}>
            <AnalyticsMonthlyCampaignState tkn={tkn} />
          </Grid> */}
          {/* <Grid item xs={12} md={6} lg={4} style={{paddingTop:'25px'}}>
            <AnalyticsSourceVisits tkn={tkn} />
          </Grid> */}
          <Grid item xs={12} sm={6} md={8} lg={9} style={{paddingTop:'25px'}}>
            {/* <AnalyticsCustomerTypeWise tkn={tkn} /> */}
            <AnalyticsSalesEarningReport tkn={tkn} fdate={fdatef} tdate={tdatef} country={selectedCountry} salesman={selectedSales} office={selectedOffice} />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6}  style={{paddingTop:'25px'}}>
            <AnalyticsTotalEarning tkn={tkn} fdate={fdatef} tdate={tdatef} country={selectedCountry} salesman={selectedSales} office={selectedOffice} />
            {/* <AnalyticsSalesEarningReport /> */}
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} style={{paddingTop:'25px'}}>
            <AnalyticsProject tkn={tkn} fdate={fdatef} tdate={tdatef} country={selectedCountry} salesman={selectedSales} office={selectedOffice} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4} style={{paddingTop:'25px'}}>
            <ApexRadialBarChart tkn={tkn} fdate={fdatef} tdate={tdatef} country={selectedCountry} salesman={selectedSales} office={selectedOffice} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4} style={{paddingTop:'25px'}}>
            <RechartsPieChart tkn={tkn} fdate={fdatef} tdate={tdatef} country={selectedCountry} salesman={selectedSales} office={selectedOffice} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4} style={{paddingTop:'25px'}}>
            <AnalyticsSalesRepWiseSaleAmt tkn={tkn} fdate={fdatef} tdate={tdatef} country={selectedCountry} salesman={selectedSales} office={selectedOffice} />
          </Grid>
        </Grid>
      </KeenSliderWrapper>
    </ApexChartWrapper>
  )
}

export default AnalyticsDashboard
