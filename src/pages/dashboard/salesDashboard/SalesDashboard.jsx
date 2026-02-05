import Grid from '@mui/material/Grid'
import KeenSliderWrapper from '../@core/styles/libs/keen-slider'
import ApexChartWrapper from '../@core/styles/libs/react-apexcharts'
import Summary from './Summary';
import OrderTracker from './OrderTracker';
import SalesByLocation from './SalesByLocation';
import CategoryWiseSalesProfitAmount from './CategoryWiseSalesProfitAmount';
import MetalWiseSaleAmount from './MetalWiseSaleAmount';
import RechartsPieChart from '../charts/recharts/RechartsPieChart';
import ApexRadialBarChart from '../charts/apex-charts/ApexRadialBarChart';
import CustWiseSalesProfitAmount from './CustWiseSalesProfitAmount';
import AnalyticsSalesRepWiseSaleAmt from './AnalyticsSalesRepWiseSaleAmt';
import { useEffect, useState } from 'react';
import { Autocomplete, Box, Button, TextField, useTheme } from '@mui/material';
import moment from 'moment';
import DatePicker from 'react-datepicker'
import CustomInput from '../@core/components/pickersComponent/PickersCustomInput';
import "../@core/components/pickersComponent/datepickerc.css";
import { fetchDashboardData, fetchSalesDashboardData } from '../GlobalFunctions';
import axios from 'axios';
import PriceRangeWise from './PriceRangeWise';

const SalesDashboard = ({ tkn, hostName, LId, IsEmpLogin, IsPower, IFB }) => {

  const [fdate, setFDate] = useState(null);
  const [tdate, setTDate] = useState(null);
  const [fdatef, setFDatef] = useState("");
  const [tdatef, setTDatef] = useState("");
  const [popperPlacement, setPopperPlacement] = useState('bottom-start');
  const theme = useTheme();
  const [passAsTkn, setPassAsTkn] = useState(tkn);
  const [currencyList, setCurrencyList] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(7.8);
  const [countryCodeSymbol, setCountryCodeSymbol] = useState("$");
  const [salesList, setSalesList] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [selectedSales, setSelectedSales] = useState(0);
  const [officeList, setOfficeList] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState(0);
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");

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
  const [jobWisePriceRangeData, setJobWisePriceRangeData] = useState([]);


  const currencyListHandleChange = (e) => {
    setSelectedCurrency(e.target.value);
    const a = currencyList?.find((el) => el?.CurrencyRate === (+e.target.value));
    setCountryCodeSymbol(a?.Currencysymbol);
  }
  const salesmanListHandleChange = (e) => {
    setSelectedSales(e.target.value);
  }
  const officeListHandleChange = (e) => {
    setSelectedOffice(e.target.value);
  }
  const branchListHandleChange = (e) => {
    setSelectedBranch(e.target.value);
    if (IFB === 1) {
      setPassAsTkn(e.target.value);
    }
  }

  const countryListHandleChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  const customerListHandleChange = (customerId) => {
    if (!customerId) {
      setSelectedCustomer('');
      setSelectedSales('');
      return;
    }
    const customer = customerList?.find((el) => el?.CustomerId === customerId);
    if (!customer) return;

    setSelectedCustomer(customer.CustomerId);
    const matchSalesRep = salesList?.find((el) => el?.SaleRepId === customer?.SaleRepId);
    setSelectedSales(matchSalesRep?.SaleRepId || '');
  };


  useEffect(() => {
    let apiUrl_kayra = '';

    if (hostName?.toLowerCase() === 'zen' || hostName?.toLowerCase() === 'nzen' || hostName?.toLowerCase() === 'localhost') {
      apiUrl_kayra = 'http://nzen/jo/api-lib/App/DashBoard';
    } else {
      apiUrl_kayra = 'https://view.optigoapps.com/linkedapp/App/DashBoard';
    }
    const fetchDropdownData = async () => {
      try {
        const body = {
          "Token": `${passAsTkn}`,
          "ReqData": `[{\"Token\":\"${passAsTkn}\",\"LoginId\":\"${LId}\",\"Evt\":\"Master\",\"IsPower\":\"${IsPower}\"}]`
        };

        const response = await axios.post(apiUrl_kayra, body);

        if (response?.data?.Status === '200' && response?.data?.Data) {
          const data = response.data.Data;
          const lists = {
            Currency: setCurrencyList,
            SalesRep: setSalesList,
            Locker: setOfficeList,
            Country: setCountryList,
            Customer: setCustomerList
          };

          // Iterate over DT, DT1, DT2, DT3, DT4, DT5
          Object?.keys(data)?.forEach((key) => {
            if (data[key]?.length > 0) {
              data[key]?.forEach((item) => {
                if (item?.Master_Name && lists[item.Master_Name]) {
                  lists[item.Master_Name](data[key]);
                }
              });
            }
          });

          // Handling Branch List
          if (data?.DT3?.length > 0) {
            setBranchList(data.DT3);
            data.DT3.forEach((e) => {
              if (e?.IsHeadOffice === 1) {
                setSelectedBranch(e?.dbUniqueKey);
                setPassAsTkn(IFB === 1 ? e?.dbUniqueKey : tkn);
              }
            });
          }
        }

      } catch (error) {
        console.log(error);
      }
    };


    fetchDropdownData();
    const today = moment();
    const financialYearStart = moment()?.month(3)?.date(1);
    const financialYearEnd = moment(financialYearStart)?.add(1, "year")?.subtract(1, "day");
    setFDate(financialYearStart?.toDate());
    setTDate(today?.isAfter(financialYearEnd) ? financialYearEnd?.toDate() : today?.toDate());
    setTDatef(financialYearStart?.toDate());
    setTDatef(today?.isAfter(financialYearEnd) ? financialYearEnd?.toDate() : today?.toDate());
  }, []);

  const handleFDateChange = (date) => {
    setFDate(date);
  };

  const handleTDateChange = (date) => {
    setTDate(date);
  };
  const handleApply = () => {
    const startDate = moment(fdate);
    const endDate = moment(tdate);
    const formattedFDate = startDate?.format("MM/DD/YYYY");
    const formattedTDate = endDate?.format("MM/DD/YYYY");
    setFDatef(formattedFDate);
    setTDatef(formattedTDate);
    fetchData(formattedFDate, formattedTDate, selectedCurrency, selectedSales, selectedOffice, selectedCustomer, selectedCountry);
  };

  const fetchData = async (fdatef, tdatef, currency, sales, office, customer, country) => {
    const today = moment();
    const currentYear = today.year();
    const financialYearStart = today.isBefore(moment(`${currentYear}-04-01`))
      ? moment(`${currentYear - 1}-04-01`)
      : moment(`${currentYear}-04-01`);

    const financialYearEnd = moment(financialYearStart).add(1, "year").subtract(1, "day");
    if (fdatef === "" || fdatef === "Invalid date") {
      fdatef = moment(financialYearStart.toDate()).format("MM/DD/YYYY");
    }
    if (tdatef === "" || tdatef === "Invalid date") {
      tdatef = today.isAfter(financialYearEnd)
        ? moment(financialYearEnd.toDate()).format("MM/DD/YYYY")
        : moment(today.toDate()).format("MM/DD/YYYY");
    }
    const startDate = moment(fdatef, "MM/DD/YYYY");
    const endDate = moment(tdatef, "MM/DD/YYYY");
    if (endDate.isBefore(startDate)) {
      alert("Error: End date cannot be before Start date.");
      return; // Exit the function if validation fails
    }

    try {
      const monthWiseSaleData = await fetchDashboardData(passAsTkn, hostName, fdatef, tdatef, "MonthWiseSaleAmount", sales, office, customer, country, LId, IsPower);
      setMonthWiseSaleApiData(monthWiseSaleData);

      const JobWisePriceRangeData = await fetchSalesDashboardData(passAsTkn, hostName, fdatef, tdatef, "Summary", sales, office, customer, country, LId, IsPower);

      setJobWisePriceRangeData(JobWisePriceRangeData);

      setSummaryApiData((JobWisePriceRangeData?.DT).length > 0 ? JobWisePriceRangeData?.DT?.[0] : {});

      const progressWiseOrder = await fetchDashboardData(passAsTkn, hostName, fdatef, tdatef, "ProgressWiseOrder", sales, 0, customer, country, LId, IsPower);
      setOrderTrackerApiData(progressWiseOrder);

      const countryWiseSaleAmount = await fetchDashboardData(passAsTkn, hostName, fdatef, tdatef, "CountryWiseSaleAmount", sales, office, customer, country, LId, IsPower);
      setCountryWiseSaleAmount(countryWiseSaleAmount);

      const customerWiseSaleAmount = await fetchDashboardData(passAsTkn, hostName, fdatef, tdatef, "CustomerWiseSaleAmount", sales, office, customer, country, LId, IsPower);
      setCustomerWiseSaleAmount(customerWiseSaleAmount);

      const categoryWiseSaleAmount = await fetchDashboardData(passAsTkn, hostName, fdatef, tdatef, "CategoryWiseSaleAmount", sales, office, customer, country, LId, IsPower);
      setCategoryWiseSaleAmount(categoryWiseSaleAmount);

      const metalTypeColorWiseSale = await fetchDashboardData(passAsTkn, hostName, fdatef, tdatef, "MetalTypeColorWiseSale", sales, office, customer, country, LId, IsPower);
      setMetalTypeColorWiseSale(metalTypeColorWiseSale);

      const customerTypeWiseSaleAmount = await fetchDashboardData(passAsTkn, hostName, fdatef, tdatef, "CustomerTypeWiseSaleAmount", sales, office, customer, country, LId, IsPower);
      setCustomerTypeWiseSaleAmount(customerTypeWiseSaleAmount);

      const vendorWiseNetWt = await fetchDashboardData(passAsTkn, hostName, fdatef, tdatef, "VendorWiseNetWt", sales, office, customer, country, LId, IsPower);
      setVendorWiseNetWt(vendorWiseNetWt);

      const salesrepWiseSaleAmount = await fetchDashboardData(passAsTkn, hostName, fdatef, tdatef, "SalesrepWiseSaleAmount", sales, office, customer, country, LId, IsPower);
      setSalesrepWiseSaleAmount(salesrepWiseSaleAmount);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const today = moment();
    const financialYearStart = moment().month(3).date(1); // April 1st
    if (today.isBefore(financialYearStart)) {
      financialYearStart.subtract(1, "year"); // Set start date to the previous year's April 1st
    }
    const financialYearEnd = moment(financialYearStart).add(1, "year").subtract(1, "day");
    const defaultFDate = financialYearStart.toDate();
    const defaultTDate = today.isAfter(financialYearEnd)
      ? financialYearEnd.toDate()
      : today.toDate();

    setFDate(defaultFDate);
    setTDate(financialYearEnd.toDate());
    setFDatef(moment(defaultFDate).format("MM/DD/YYYY"));
    setTDatef(moment(defaultTDate).format("MM/DD/YYYY"));
    handleApply();
  }, []);

  useEffect(() => {
    setSelectedSales((IsEmpLogin) === 0 ? 0 : (LId));
  }, [IsEmpLogin, LId]);


  const inputStyles = {
    width: '100%',
    height: '40px',
    border: '1px solid #989898',
    borderRadius: '5px',
    backgroundColor: 'white',
    color: '#333',
  };

  const AutoCompleteStyles = {
    width: '100%',
    minidth: '200px',
    height: '40px',
    borderRadius: '5px',
    backgroundColor: 'white',
    color: '#333',
  };

  const formatOptions = (list, valueKey, labelKey) =>
    list?.map((e) => ({ value: e[valueKey], label: e[labelKey] })) || [];

  return (
    <ApexChartWrapper style={{ paddingBottom: '2.5rem', paddingTop: '1rem', width: '95%', margin: '0 auto' }}>

      <KeenSliderWrapper>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div className='d-flex justify-content-start align-items-end w-100'>
              <Box style={{ marginRight: '10px', width: '22%', display: 'flex', alignItems: 'flex-end' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label className='fs_analytics_l'>From Date</label>
                    <DatePicker
                      selected={fdate}
                      popperPlacement={popperPlacement}
                      onChange={handleFDateChange}
                      dateFormat='dd-MM-yyyy'
                      placeholderText='DD-MM-YYYY'
                      customInput={<CustomInput sx={inputStyles} />}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label className='fs_analytics_l'>To Date</label>
                    <DatePicker
                      selected={tdate}
                      popperPlacement={popperPlacement}
                      onChange={handleTDateChange}
                      dateFormat='dd-MM-yyyy'
                      placeholderText='DD-MM-YYYY'
                      customInput={<CustomInput sx={inputStyles} />}
                    />
                  </div>
                </div>
              </Box>
              {[{
                label: 'Currency',
                value: selectedCurrency,
                onChange: currencyListHandleChange,
                options: currencyList?.map(e => ({ value: e.CurrencyRate, label: e.Currencycode })),
                disableClearable: true // Hide clear icon for currency only
              }, {
                label: 'Salesman',
                value: selectedSales,
                onChange: salesmanListHandleChange,
                options: salesList?.map(e => ({ value: e.SaleRepId, label: e.CustomerCode })),
                disableClearable: false // Keep clear icon
              }, {
                label: 'Office',
                value: selectedOffice,
                onChange: officeListHandleChange,
                options: officeList?.map(e => ({ value: e.LockerId, label: e.LockerName })),
                disableClearable: false // Keep clear icon
              }, {
                label: 'Country',
                value: selectedCountry,
                onChange: countryListHandleChange,
                options: countryList?.map(e => ({ value: e.CountryName, label: e.CountryName })),
                disableClearable: false // Keep clear icon
              }].map(({ label, value, onChange, options, disableClearable }, index) => (
                <Box key={index} style={{ minWidth: '200px', marginRight: '10px' }}>
                  <label>{label}</label>
                  <Autocomplete
                    size='small'
                    options={options}
                    getOptionLabel={(option) => option.label}
                    value={options.find((opt) => opt.value === value) || null}
                    onChange={(event, newValue) => onChange({ target: { value: newValue?.value || '' } })}
                    renderInput={(params) => <TextField sx={AutoCompleteStyles} {...params} placeholder={`Select ${label}`} variant="outlined" />}
                    disableClearable={disableClearable}
                  />
                </Box>
              ))}

              {IFB === 1 && branchList?.length > 0 && (
                <Box style={{ minWidth: '200px', marginRight: '10px' }}>
                  <label>Branch</label>
                  <Autocomplete
                    size='small'
                    options={formatOptions(branchList, 'dbUniqueKey', 'UFCC')}
                    getOptionLabel={(option) => option.label}
                    value={formatOptions(branchList, 'dbUniqueKey', 'UFCC').find((opt) => opt.value === selectedBranch) || null}
                    onChange={(event, newValue) => branchListHandleChange({ target: { value: newValue?.value || '' } })}
                    renderInput={(params) => <TextField sx={AutoCompleteStyles} {...params} placeholder="Select Branch" variant="outlined" />}
                  />
                </Box>
              )}

              <div style={{ marginBottom: '3px' }}>
                <Button
                  variant='contained'
                  sx={{ backgroundColor: theme?.palette?.customColors?.green, marginLeft: '10px', padding: '9px 0px' }}
                  size='large'
                  onClick={handleApply}
                >
                  Apply
                </Button>
              </div>
            </div>

            <Box className='d-flex justify-start align-items-center mt-2' sx={{ width: '22.2%' }}>
              <label style={{ width: '80%' }}>Search by Customer Code</label>
              <Autocomplete
                size="small"
                sx={{ minWidth: '200px' }}
                options={formatOptions(customerList, 'CustomerId', 'CustomerCode')} // Use CustomerId for value
                getOptionLabel={(option) => option.label}
                value={formatOptions(customerList, 'CustomerId', 'CustomerCode').find((opt) => opt.value === selectedCustomer) || null}
                onChange={(event, newValue) => customerListHandleChange(newValue?.value || '')}
                renderInput={(params) => (
                  <TextField sx={AutoCompleteStyles} {...params} placeholder="Search Customer" variant="outlined" />
                )}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6} lg={9} style={{ paddingTop: '25px' }}>
            <Summary tkn={tkn} fdate={fdatef} tdate={tdatef} country={selectedCurrency} countryCodeSymbol={countryCodeSymbol} salesman={selectedSales} office={selectedOffice} monthWiseSaleData={monthWiseSaleApiData} jobWisePriceRangeData={jobWisePriceRangeData} summaryData={summryApiData} IsEmpLogin={IsEmpLogin} />
          </Grid>
          <Grid item xs={12} md={6} lg={3} style={{ paddingTop: '25px' }}>
            <OrderTracker tkn={tkn} fdate={fdatef} tdate={tdatef} country={selectedCurrency} countryCodeSymbol={countryCodeSymbol} salesman={selectedSales} office={selectedOffice} orderTracker={orderTrackerApiData} IsEmpLogin={IsEmpLogin} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} style={{ paddingTop: '25px' }}>
            <SalesByLocation tkn={tkn} fdate={fdatef} tdate={tdatef} country={selectedCurrency} countryCodeSymbol={countryCodeSymbol} salesman={selectedSales} office={selectedOffice} countryWiseSale={CountryWiseSaleAmount} IsEmpLogin={IsEmpLogin} />
          </Grid>
          <Grid item xs={12} sm={6} md={8} lg={9} style={{ paddingTop: '25px' }}>
            {/* <AnalyticsCustomerTypeWise tkn={tkn} /> */}
            <CustWiseSalesProfitAmount tkn={tkn} fdate={fdatef} tdate={tdatef} country={selectedCurrency} countryCodeSymbol={countryCodeSymbol} salesman={selectedSales} office={selectedOffice} CustomerWiseSaleAmountData={CustomerWiseSaleAmount} IsEmpLogin={IsEmpLogin} />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} style={{ paddingTop: '25px' }}>
            <CategoryWiseSalesProfitAmount tkn={tkn} fdate={fdatef} tdate={tdatef} country={selectedCurrency} countryCodeSymbol={countryCodeSymbol} salesman={selectedSales} office={selectedOffice} CategoryWiseSaleAmountData={CategoryWiseSaleAmount} IsEmpLogin={IsEmpLogin} />
            {/* <AnalyticsSalesEarningReport /> */}
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} style={{ paddingTop: '25px' }}>
            <MetalWiseSaleAmount tkn={tkn} fdate={fdatef} tdate={tdatef} country={selectedCurrency} countryCodeSymbol={countryCodeSymbol} salesman={selectedSales} office={selectedOffice} MetalTypeColorWiseSaleData={MetalTypeColorWiseSale} IsEmpLogin={IsEmpLogin} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4} style={{ paddingTop: '25px' }}>
            <ApexRadialBarChart tkn={tkn} fdate={fdatef} tdate={tdatef} country={selectedCurrency} salesman={selectedSales} countryCodeSymbol={countryCodeSymbol} office={selectedOffice} CustomerTypeWiseSaleAmountData={CustomerTypeWiseSaleAmount} IsEmpLogin={IsEmpLogin} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4} style={{ paddingTop: '25px' }}>
            <RechartsPieChart tkn={tkn} fdate={fdatef} tdate={tdatef} country={selectedCurrency} salesman={selectedSales} countryCodeSymbol={countryCodeSymbol} office={selectedOffice} VendorWiseNetWtData={VendorWiseNetWt} IsEmpLogin={IsEmpLogin} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4} style={{ paddingTop: '25px' }}>
            <AnalyticsSalesRepWiseSaleAmt tkn={tkn} fdate={fdatef} tdate={tdatef} country={selectedCurrency} salesman={selectedSales} countryCodeSymbol={countryCodeSymbol} office={selectedOffice} SalesrepWiseSaleAmount={SalesrepWiseSaleAmount} IsEmpLogin={IsEmpLogin} />
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <PriceRangeWise tkn={tkn} fdate={fdatef} tdate={tdatef} country={selectedCurrency} salesman={selectedSales} countryCodeSymbol={countryCodeSymbol} office={selectedOffice} IsEmpLogin={IsEmpLogin} jobWisePriceRangeData={jobWisePriceRangeData} />
          </Grid>
          {/* <Grid item xs={12} sm={12} md={12}>
              <JobPriceRangeWiseData tkn={tkn} fdate={fdatef} tdate={tdatef} country={selectedCurrency} salesman={selectedSales} countryCodeSymbol={countryCodeSymbol} office={selectedOffice} SalesrepWiseSaleAmount={SalesrepWiseSaleAmount} IsEmpLogin={IsEmpLogin} jobWisePriceRangeData={jobWisePriceRangeData} />
          </Grid> */}
        </Grid>
      </KeenSliderWrapper>
    </ApexChartWrapper>
  )
}

export default SalesDashboard
