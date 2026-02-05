
import { Box, Button, Grid, useMediaQuery, useTheme, Select, MenuItem, Typography, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton   } from '@mui/material';
import React, {  useEffect, useState } from 'react';
import "./kpianalytics.css"
import SalesNMarketing1 from './components/SalesNMarketing1';
import QualityControl from './components/QualityControl';
import Manufacturing from './components/Manufacturing';
import RawMaterial from './components/RawMaterial';
import { fetchKPIDashboardData } from '../GlobalFunctions';
import ProductDevelopment from './components/ProductDevelopment';
import SalesNMarketing2 from './components/SalesNMarketing2';
import HeaderOfCard from './components/HeaderOfCard';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import SalesNMarketing3 from './components/SalesNMarketing3.js';
import axios from 'axios';
import CustomInput from '../@core/components/pickersComponent/PickersCustomInput';
import CloseIcon from '@mui/icons-material/Close';
import "react-datepicker/dist/react-datepicker.css";
import AccountHr from './components/AccountHr.js';
import { useDispatch, useSelector } from 'react-redux';
import { ProductDevelopmentAPI } from './redux/slices/PD.js';
import { QCAPI } from './redux/slices/QC.js';
import { ITORAPI } from './redux/slices/InventoryRatio.js';
import { QCInwardAPI } from './redux/slices/QcInward.js';
import { AvgCollectionRatioAPI } from './redux/slices/AvgCollectionRatio.js';
import { SaleMarketingTotalSaleApi } from './redux/slices/SaleMarketingTotalSale.js';
import { SaleMarketingOrderAPI } from './redux/slices/SaleMarketingOrder.js';
import { SaleMarketingOrderCompleteApi } from './redux/slices/SaleMarketingOrderComplete.js';
import { SalesMarketing_TotalSaleBusinessClassWiseApi } from './redux/slices/SalesMarketing_TotalSaleBusinessClassWise.js';
import { SalesMarketing_TotalSaleLocationWiseApi } from './redux/slices/SalesMarketing_TotalSaleLocationWise.js';
import { mfgTableApi } from './redux/slices/MFGTable.js';
import { baggingCompletedApi } from './redux/slices/BaggingCompleted.js';
import { RmStockApi } from './redux/slices/RmStock.js';
import { GrossLossApi } from './redux/slices/GrossLoss.js';

const KPIAnalytics = ({tkn, sv, url, hostName}) => {
    const theme = useTheme();

    const dispatch = useDispatch();

    

      const isSmallScreen = useMediaQuery(theme?.breakpoints?.down('sm'));
      const isMaxWidth11410px = useMediaQuery('(max-width:1410px)');
      const isMaxWidth1700px = useMediaQuery('(max-width:1700px)');
      const isMaxWidth900px = useMediaQuery('(max-width:899px)');
      const [popperPlacement, setPopperPlacement] = useState('bottom-start');
    
    const [fdate, setFDate] = useState(new Date()); 
    const [tdate, setTDate] = useState(new Date());

    const [fdatef, setFDatef] = useState(moment().format('MM-DD-YYYY'));
    const [tdatef, setTDatef] = useState(moment().format('MM-DD-YYYY'));
    const [dropdownValue, setDropdownValue] = useState('Today');
    const [daysCount, setDaysCount] = useState(1);
    
    const isMaxWidth720px = useMediaQuery('(max-width:720px)');
    
    const [showPopUp, setShowPopUp] = useState(false);



    let apiUrl_kpi = '';

    if(hostName?.toLowerCase() === 'zen' || hostName?.toLowerCase() === 'nzen' || hostName?.toLowerCase() === 'localhost'){
      apiUrl_kpi = 'http://nzen/jo/api-lib/App/KPI_DashBoard';
    }else{
      apiUrl_kpi = 'https://view.optigoapps.com/linkedapp/App/KPI_DashBoard';
    }

        //separate api call 
        const [PrdDev, setPrdDev] = useState([]); //product development
        const [PDLoader, setPDLoader] = useState(false);
        const [QuaC, setQuaC] = useState([]); //quality control
        const [QCLoader, setQCLoader] = useState(false);
        const [saleMTs, setSaleMTs] = useState(); //sale marketing total sale 1
        const [saleMTs2, setSaleMTs2] = useState(); //sale marketing total sale 2
        const [saleMTsLoader, setSaleMTsLoader] = useState(false);
        const [BCwise, setBCwise] = useState([]); //sale marketing total sale business class wise
        const [BCwiseLoader, setBCwiseLoader] = useState(false);
        const [LWise, setLWise] = useState([]); //sale marketing total sale location wise
        const [LWiseLoader, setLWiseLoader] = useState(false);
        const [orderCmplt, setOrderCmplt] = useState([]); //sale marketing order completion
        const [OCLoader, setOCLoader] = useState(false);
        const [SMOrder, setSMOrder] = useState(); // sale marketing order
        const [SMOrderLoader, setSMOrderLoader] = useState(false);
        const [avgCollRatio, setAvgCollRatio] = useState(); // avg. collection period
        const [AvgColPeriod, setAvgColPeriod] = useState();
        const [acrLoader, setACRLoader] = useState(false);
        const [InventoryRatio, setInventoryRatio] = useState(); // inventory turn over ratio
        const [InventoryRatioDT, setInventoryRatioDT] = useState(); // inventory turn over ratio
        const [InventoryRatioDT1, setInventoryRatioDT1] = useState(); // inventory turn over ratio
        const [InventoryRatioDT2, setInventoryRatioDT2] = useState(); // inventory turn over ratio
        const [InventoryRatioDT3, setInventoryRatioDT3] = useState(); // inventory turn over ratio
        const [irLoader, setIRLoader] = useState(false);
    
        const [bgComp, setBgComp] = useState();
        const [bgLoader, setBGLoader] = useState(false);
        const [g_loss, setG_Loss] = useState();
        const [lossLoader, setLossLoader] = useState(false);
        const [rmStock, setRmStock] = useState();
        const [rmStockLoader, setRMStockLoader] = useState(false);
        const [mfgTable, setMfgTable] = useState();
        const [mfgLoader, setMFGLoader] = useState(false);
        const [qcInward, setQcInward] = useState();
        const [inwardLoader, setInwardLoader] = useState(false);

        const [popUpList, setPopUpList] = useState();


    //sales
    const ProductDevelopmentFetch = async() => {
      try {
        setPDLoader(true);
          const response = await fetchKPIDashboardData(
            apiUrl_kpi, tkn, 
            moment(fdate)?.format('MM/DD/YYYY'), 
            moment(tdate)?.format('MM/DD/YYYY'), 
            "ProductDevelopment");
          if(response){
            
            setPrdDev(response[0]);
            setPDLoader(false);
          }else{
            setPDLoader(false);
          }
          
      } catch (error) {
        console.log(error);
        setPDLoader(false);
      }
    }
    const QualityControlFetch = async() => {
      try {
          setQCLoader(true);
          const response = await fetchKPIDashboardData(apiUrl_kpi, tkn, moment(fdate)?.format('MM/DD/YYYY'), moment(tdate)?.format('MM/DD/YYYY'), "QualityControl");
          if(response){
            setQuaC(response[0]);
            setQCLoader(false);
          }else{
            setQCLoader(false);
          }
          
      } catch (error) {
        console.log(error);
        setQCLoader(false);
        
      }
    }
    const SalesMarketing_TotalSaleFetch = async() => {
      try {
          setSaleMTsLoader(true);
          const body2s = JSON.stringify({
            "Token" : `${tkn}`  
            ,"ReqData":`[{\"Token\":\"${tkn}\",\"Evt\":\"SalesMarketing_TotalSale\",\"FDate\":\"${moment(fdate)?.format('MM/DD/YYYY')}\",\"TDate\":\"${moment(tdate)?.format('MM/DD/YYYY')}\"}]`
          });
          const headers2s = {
            "Content-Type":"application/json"
          }
          const response = await axios.post(apiUrl_kpi, body2s, headers2s);
          if (response?.data?.Status === '200') {
            if(response?.data?.Data?.DT?.length > 0){
              setSaleMTs(response?.data?.Data?.DT[0]);
            }else{
              setSaleMTs({});
            }
            if(response?.data?.Data?.DT1?.length > 0){
              setSaleMTs2(response?.data?.Data?.DT1[0]);
            }else{
              setSaleMTs2({});
            }
            setSaleMTsLoader(false);
              // setSaleMTs2(response?.data?.Data?.DT1[0] || []);
              
              
              // return  {DT:response.data.Data.DT, DT1:response.data.Data.DT1} ;
          } else {
              setSaleMTsLoader(false);
              setSaleMTs({});
              setSaleMTs2({});
            // return []; // Empty array if no data or status is not 200
          }          
          // const response = await fetchKPIDashboardData(apiUrl_kpi, tkn, moment(fdate)?.format('MM/DD/YYYY'), moment(tdate)?.format('MM/DD/YYYY'), "SalesMarketing_TotalSale");
          // if(response){
          //   setSaleMTs(response[0]);
          //   setSaleMTsLoader(false);
          // }else{
          //   setSaleMTsLoader(false);
          // }
      } catch (error) {
        console.log(error);
        setSaleMTsLoader(true);
      }
    }
    const SalesMarketing_TotalSaleBusinessClassWiseFetch = async() => {
      try {
        setBCwiseLoader(true);
          const response = await fetchKPIDashboardData(apiUrl_kpi, tkn, moment(fdate)?.format('MM/DD/YYYY'), moment(tdate)?.format('MM/DD/YYYY'), "SalesMarketing_TotalSaleBusinessClassWise");
          if(response){
                setBCwise(response);
                setBCwiseLoader(false);
          }else{
            setBCwiseLoader(false);
          }
      } catch (error) {
        console.log(error);
        setBCwiseLoader(false);
      }
    }
    const SalesMarketing_TotalSaleLocationWiseFetch = async() => {
      try {
        setLWiseLoader(true);
          const response = await fetchKPIDashboardData(apiUrl_kpi, tkn, moment(fdate)?.format('MM/DD/YYYY'), moment(tdate)?.format('MM/DD/YYYY'), "SalesMarketing_TotalSaleLocationWise");
          if(response){
                setLWise(response);
                setLWiseLoader(false);
          }else{
            setSaleMTsLoader(false);
          }
          
      } catch (error) {
        console.log(error);
        setLWiseLoader(false);
      }
    }
    const SalesMarketing_OrderCompletionFetch = async() => {
      try {
        setOCLoader(true);
          const response = await fetchKPIDashboardData(apiUrl_kpi, tkn, moment(fdate)?.format('MM/DD/YYYY'), moment(tdate)?.format('MM/DD/YYYY'), "SalesMarketing_OrderCompletion");
          if(response){
            setOrderCmplt(response[0]);
            setOCLoader(false);
          }else{
            setOCLoader(false);
          }
      } catch (error) {
        console.log(error);
        setOCLoader(false);
      }
    }
    const SalesMarketing_OrderFetch = async() => {
      try {
        setSMOrderLoader(true);
        const body2s = JSON.stringify({
          "Token" : `${tkn}`  
          ,"ReqData":`[{\"Token\":\"${tkn}\",\"Evt\":\"SalesMarketing_Order\",\"FDate\":\"${moment(fdate)?.format('MM/DD/YYYY')}\",\"TDate\":\"${moment(tdate)?.format('MM/DD/YYYY')}\"}]`
        });
        const headers2s = {
          "Content-Type":"application/json"
        }
        const SMO = await axios.post(apiUrl_kpi, body2s, headers2s);
        if(SMO?.data?.Status === '200'){
            if(SMO?.data?.Data){
                setSMOrder(SMO?.data?.Data);
                setPopUpList(SMO?.data?.Data);
                setSMOrderLoader(false);
            }else{
              setSMOrderLoader(false);
            }
        }else{
          setSMOrderLoader(false);
        }
      } catch (error) {
        console.log(error);
        setSMOrderLoader(false);
      }
    }
    const AvgCollectionPeriodFetch = async() => {
      try {
        setACRLoader(true);
          // const response = await fetchKPIDashboardData(apiUrl_kpi, tkn, moment(fdate)?.format('MM/DD/YYYY'), moment(tdate)?.format('MM/DD/YYYY'), "AvgCollectionPeriod");
          // if(response){
          //   setAvgCollRatio(response[0]);
          //   setACRLoader(false);
          // }else{
          //   setACRLoader(false);
          // }
          const body2s = JSON.stringify({
            "Token" : `${tkn}`  
            ,"ReqData":`[{\"Token\":\"${tkn}\",\"Evt\":\"AvgCollectionPeriod\",\"FDate\":\"${moment(fdate)?.format('MM/DD/YYYY')}\",\"TDate\":\"${moment(tdate)?.format('MM/DD/YYYY')}\"}]`
          });
          const headers2s = {
            "Content-Type":"application/json"
          }
          const response = await axios.post(apiUrl_kpi, body2s, headers2s);
          if (response?.data?.Status === '200') {
              setAvgCollRatio(response?.data?.Data?.DT[0]);
              setAvgColPeriod(response?.data?.Data);
              
              setACRLoader(false);
              // return  {DT:response.data.Data.DT, DT1:response.data.Data.DT1} ;
          } else {
              setACRLoader(false);
            // return []; // Empty array if no data or status is not 200
          } 
      } catch (error) {
        console.log(error);
        setACRLoader(false);
      }
    }
    const InventoryTurnOverRatioFetch = async() => {
      try {
        setIRLoader(true);
        const body = JSON.stringify({
          "Token" : `${tkn}`  
          ,"ReqData":`[{\"Token\":\"${tkn}\",\"Evt\":\"InventoryTurnOverRatio\",\"FDate\":\"${moment(fdate)?.format('MM/DD/YYYY')}\",\"TDate\":\"${moment(tdate)?.format('MM/DD/YYYY')}\"}]`
        });
        const headers = {
          "Content-Type":"application/json"
        }
        const ITOR_response = await axios.post(apiUrl_kpi, body, headers);
        
        if(ITOR_response?.data?.Data){
          setInventoryRatio(ITOR_response?.data?.Data);
          if(ITOR_response?.data?.Data?.DT?.length > 0){
            setInventoryRatioDT(ITOR_response?.data?.Data?.DT[0]);
          }
          if(ITOR_response?.data?.Data?.DT1?.length > 0){
            setInventoryRatioDT1(ITOR_response?.data?.Data?.DT1[0]);
          }
          if(ITOR_response?.data?.Data?.DT2?.length > 0){
            setInventoryRatioDT2(ITOR_response?.data?.Data?.DT2[0]);
          }
          if(ITOR_response?.data?.Data?.DT3?.length > 0){
            setInventoryRatioDT3(ITOR_response?.data?.Data?.DT3[0]);
          }
          setIRLoader(false);
        }else{
          setACRLoader(false);
        }
      } catch (error) {
        console.log(error);
        setIRLoader(false);
      }
    }
    //production
    const BaggingCompletedFetch = async() => {
      try {
        setBGLoader(true);
      const replacedUrl = (url)?.replace("M.asmx/Optigo", "report.aspx");
      const body2 = {
        "con":"{\"id\":\"\",\"mode\":\"kpidashboard_baggingcompleted\",\"appuserid\":\"admin@hs.com\"}",
        "p":`{\"fdate\":\"${moment(fdate)?.format('MM/DD/YYYY')}\",\"tdate\":\"${moment(tdate)?.format('MM/DD/YYYY')}\"}`,  
        "f":"m-test2.orail.co.in (ConversionDetail)"
      }

    const headers2 = {
      Authorization:`Bearer ${tkn}`,
      YearCode:"e3t6ZW59fXt7MjB9fXt7b3JhaWwyNX19e3tvcmFpbDI1fX0=",
      version:"v4",
      sv:sv
    }
    // const prdApi = await axios.post("http://zen/api/report.aspx", body2, { headers: headers2 });
    const prdApi = await axios.post(replacedUrl, body2, { headers: headers2 });
      if(prdApi?.data?.Status === '200'){
          if(prdApi?.data?.Data?.rd?.length > 0){
              setBgComp(prdApi?.data?.Data?.rd[0])
              setBGLoader(false);
          }else{
            setBGLoader(false);
          }
      }else{
        setBGLoader(false);
      }
      } catch (error) {
          console.log(error);
          setBGLoader(false);
      }
    }
    const G_LossFetch = async() => {
      try {
        setLossLoader(true);
      const replacedUrl = (url)?.replace("M.asmx/Optigo", "report.aspx");
      const body2 = {
        "con":"{\"id\":\"\",\"mode\":\"kpidashboard_loss\",\"appuserid\":\"admin@hs.com\"}",
        "p":`{\"fdate\":\"${moment(fdate)?.format('MM/DD/YYYY')}\",\"tdate\":\"${moment(tdate)?.format('MM/DD/YYYY')}\"}`,  
        "f":"m-test2.orail.co.in (ConversionDetail)"
      }

    const headers2 = {
      Authorization:`Bearer ${tkn}`,
      YearCode:"e3t6ZW59fXt7MjB9fXt7b3JhaWwyNX19e3tvcmFpbDI1fX0=",
      version:"v4",
      sv:sv
    }
    // const prdApi = await axios.post("http://zen/api/report.aspx", body2, { headers: headers2 });
    const response = await axios.post(replacedUrl, body2, { headers: headers2 });
      if(response?.data?.Status === '200'){
          
          if(response?.data?.Data?.rd?.length > 0){
              setG_Loss(response?.data?.Data?.rd[0]);
              setLossLoader(false);
          }else{
            setLossLoader(false);
          }
      }else{
        setLossLoader(false);
      }
      } catch (error) {
          console.log(error);
          setLossLoader(false);
      }
    }
    const RMStockFetch = async() => {
      try {
        setRMStockLoader(true);
      const replacedUrl = (url)?.replace("M.asmx/Optigo", "report.aspx");
      const body2 = {
        "con":"{\"id\":\"\",\"mode\":\"kpidashboard_rmstock\",\"appuserid\":\"admin@hs.com\"}",
        "p":`{\"fdate\":\"${moment(fdate)?.format('MM/DD/YYYY')}\",\"tdate\":\"${moment(tdate)?.format('MM/DD/YYYY')}\"}`,  
        "f":"m-test2.orail.co.in (ConversionDetail)"
      }

    const headers2 = {
      Authorization:`Bearer ${tkn}`,
      YearCode:"e3t6ZW59fXt7MjB9fXt7b3JhaWwyNX19e3tvcmFpbDI1fX0=",
      version:"v4",
      sv:sv
    }
    // const prdApi = await axios.post("http://zen/api/report.aspx", body2, { headers: headers2 });
    const response = await axios.post(replacedUrl, body2, { headers: headers2 });
      if(response?.data?.Status === '200'){
          if(response?.data?.Data?.rd?.length > 0){
              setRmStock(response?.data?.Data?.rd[0]);
              setRMStockLoader(false);
          }else{
            setRMStockLoader(false);
          }
      }else{
        setRMStockLoader(false);
      }
      } catch (error) {
          console.log(error);
          setRMStockLoader(false);
      }
    }
    const MFGFetch = async() => {
      try {
        setMFGLoader(true);
      const replacedUrl = (url)?.replace("M.asmx/Optigo", "report.aspx");
      const body2 = {
        "con":"{\"id\":\"\",\"mode\":\"kpidashboard_mfg\",\"appuserid\":\"admin@hs.com\"}",
        "p":`{\"fdate\":\"${moment(fdate)?.format('MM/DD/YYYY')}\",\"tdate\":\"${moment(tdate)?.format('MM/DD/YYYY')}\"}`,  
        "f":"m-test2.orail.co.in (ConversionDetail)"
      }

    const headers2 = {
      Authorization:`Bearer ${tkn}`,
      YearCode:"e3t6ZW59fXt7MjB9fXt7b3JhaWwyNX19e3tvcmFpbDI1fX0=",
      version:"v4",
      sv:sv
    }
    // const prdApi = await axios.post("http://zen/api/report.aspx", body2, { headers: headers2 });
    const response = await axios.post(replacedUrl, body2, { headers: headers2 });
      if(response?.data?.Status === '200'){
              
          if(response?.data?.Data?.rd?.length > 0){
              setMfgTable(response?.data?.Data?.rd);
              setMFGLoader(false);
              
          }else{
            setMFGLoader(false);
            setMfgTable([]);
          }
      }else{
        setMFGLoader(false);
        setMfgTable([]);
      }
      } catch (error) {
          console.log(error);
          setMFGLoader(false);
          setMfgTable([]);
      }
    }
    const inwardFetch = async() => {
      try {
      setInwardLoader(true);
      const replacedUrl = (url)?.replace("M.asmx/Optigo", "report.aspx");
      
      const body_kpi_3 = {
          "con":"{\"id\":\"\",\"mode\":\"kpidashboard_qcinward\",\"appuserid\":\"admin@hs.com\"}",
          "p":`{\"fdate\":\"${moment(fdate)?.format('MM/DD/YYYY')}\",\"tdate\":\"${moment(tdate)?.format('MM/DD/YYYY')}\"}`,  
          "f":"m-test2.orail.co.in (ConversionDetail)"
        }

      const headers2_kpi_3 = {
        Authorization:`Bearer ${tkn}`,
        YearCode:"e3t6ZW59fXt7MjB9fXt7b3JhaWwyNX19e3tvcmFpbDI1fX0=",
        version:"v4",
        sv:sv
      }
      
      // const prdApi = await axios.post("http://zen/api/report.aspx", body2, { headers: headers2 });
      const kpidashboard_qcinward = await axios.post(replacedUrl, body_kpi_3, { headers: headers2_kpi_3 });
      const KQC = kpidashboard_qcinward?.data?.Data;
      if(KQC?.rd){
        setQcInward(KQC?.rd[0]);
        setInwardLoader(false);
      }else{
        setInwardLoader(false);
      }
      } catch (error) {
        console.log(error);
        setInwardLoader(false);
      }
    }

  
    useEffect(() => {

      let apiUrl_kpi = '';
      
    if(hostName?.toLowerCase() === 'zen' || hostName?.toLowerCase() === 'localhost'){
      apiUrl_kpi = 'http://zen/jo/api-lib/App/KPI_DashBoard';
    }else{
      apiUrl_kpi = 'https://view.optigoapps.com/linkedapp/App/KPI_DashBoard';
    }

      const obj = {
        apiUrl_kpi:apiUrl_kpi,
        token:tkn,
        fdate:moment(fdate)?.format('MM/DD/YYYY'),
        tdate:moment(tdate)?.format('MM/DD/YYYY'),
      }

      //sales
      // InventoryTurnOverRatioFetch(); //made
      // ProductDevelopmentFetch(); //made
      // AvgCollectionPeriodFetch(); //made
      // SalesMarketing_TotalSaleFetch(); //made
      // QualityControlFetch(); //made
      // SalesMarketing_OrderFetch(); //made
      // SalesMarketing_OrderCompletionFetch(); //made
      // SalesMarketing_TotalSaleBusinessClassWiseFetch(); //made
      // SalesMarketing_TotalSaleLocationWiseFetch(); //made

      // //mfg
      // BaggingCompletedFetch(); //made
      // G_LossFetch(); //made
      // RMStockFetch(); //made
      // MFGFetch(); //made
      // inwardFetch(); //made
      
      //kpi redux store api
      //sales
      dispatch(ProductDevelopmentAPI(obj));
      dispatch(QCAPI(obj));
      dispatch(ITORAPI(obj));
      dispatch(AvgCollectionRatioAPI(obj));
      dispatch(SaleMarketingTotalSaleApi(obj));
      dispatch(SaleMarketingOrderAPI(obj));
      dispatch(SaleMarketingOrderCompleteApi(obj));
      dispatch(SalesMarketing_TotalSaleBusinessClassWiseApi(obj));
      dispatch(SalesMarketing_TotalSaleLocationWiseApi(obj));

      //production
      const obj2 = {
        url : url,
        sv:sv,
        tkn:tkn,
        fdate:moment(fdate)?.format('MM/DD/YYYY'),
        tdate:moment(tdate)?.format('MM/DD/YYYY'),
      }
      
      dispatch(QCInwardAPI(obj2));
      dispatch(mfgTableApi(obj2));
      dispatch(baggingCompletedApi(obj2));
      dispatch(RmStockApi(obj2));
      dispatch(GrossLossApi(obj2));

    }, []);


    const setInitialDateRange = (value) => {
      const today = moment();
      let startDate, endDate;
    
      switch (value) {
        case 'Today':
          startDate = today;
          endDate = today;
          break;
        case 'Yesterday':
          startDate = today.clone().subtract(1, 'day');
          endDate = startDate;
          break;
        case 'Week':
          startDate = today.clone().subtract(6, 'days');
          endDate = today;
          break;
        case 'This Month':
          startDate = today.clone().startOf('month'); 
          endDate = today; 
          break;
        case 'Last Month':
          startDate = today.clone().subtract(1, 'month').startOf('month'); 
          endDate = today.clone().subtract(1, 'month').endOf('month'); 
          break;
        case 'Quarter':
          const startOfQuarter = today.clone().subtract(3, 'months').startOf('month'); 
          startDate = startOfQuarter.clone().startOf('month'); 
          endDate = today; 
          break;
        case 'This 6 Months':
          startDate = today.clone().subtract(6, 'months').startOf('month');
          endDate = today;
          break;
        // case 'This 6 Months':
        // case 'This Year':
        //   const financialYearStart = moment().month(3).date(1); 
        //   startDate = financialYearStart;
        //   endDate = today;
        //   if (value === 'This 6 Months') {
        //     startDate = today.clone().subtract(6, 'months').startOf('month');
        //   }
        //   break;
        // case 'This Year':
        //   // Start of the financial year (April 1st of the current year)
        //   const currentYear = moment().year(); // Get the current year
        //   const financialYearStart = moment().year(currentYear - 1).month(3).date(1); // April 1st of current year
        //   startDate = financialYearStart;
        
        //   // End of the financial year (March 31st of the next year)
        //   const financialYearEnd = moment().year(currentYear).month(2).date(31); // March 31st of the next year
        //   endDate = financialYearEnd;
        //   break;
        case 'This Year':
          // Start of the financial year (April 1st of the current year)
          const currentYear = moment().year(); // Get the current year
          const financialYearStart = moment().year(currentYear - 1).month(3).date(1); // April 1st of the current year
          startDate = financialYearStart;
        
          // If the current date is the same as the start of the financial year, then endDate will be the current date
          const financialYearEnd = moment(); // current date
          endDate = financialYearEnd.isSame(financialYearStart, 'day') ? financialYearStart : financialYearEnd;
          break;
        
        
        
        
        default:
          startDate = today;
          endDate = today;
      }
    
      setFDate(startDate.toDate());
      setTDate(endDate.toDate());
    };
    const handleDropdownChange = (event) => {
      const selectedValue = event.target.value;
      setDropdownValue(selectedValue);
      setInitialDateRange(selectedValue);
    };
    const handleApply = () => {


        const startDate = moment(fdate);
        const endDate = moment(tdate);
        const diffInDays = endDate.diff(startDate, 'days');

          if((dropdownValue === "Today" || dropdownValue === "Yesterday" || dropdownValue === "Week" || dropdownValue === "This Month" || dropdownValue === "Last Month" || dropdownValue === "Quarter") && (diffInDays <= 180)){
            setShowPopUp(false);
          }else if ((dropdownValue === "Today" || dropdownValue === "Yesterday" || dropdownValue === "Week" || dropdownValue === "This Month" || dropdownValue === "Last Month" || dropdownValue === "Quarter") && (diffInDays >= 180)){
            setShowPopUp(true);
            return;
          }else if ((dropdownValue === "Today" || dropdownValue === "Yesterday" || dropdownValue === "Week" || dropdownValue === "This Month" || dropdownValue === "Last Month" || dropdownValue === "Quarter") && (diffInDays >= 180)){
            setShowPopUp(true);
            return;
          }else if ((dropdownValue === "This 6 Months" || dropdownValue === "This Year" ) && (diffInDays >= 180)){
            setShowPopUp(true);
            return;
          }else if ((dropdownValue === "This 6 Months" || dropdownValue === "This Year" ) && (diffInDays <= 180)){
            setShowPopUp(false);
          }else{
            setShowPopUp(false);
          }

        if (fdate && tdate) {
          const startDate = moment(fdate);
          const endDate = moment(tdate);
      
          if (startDate.isAfter(endDate)) {
            alert('Invalid Dates');
            return;
          }
      
          const daysCount = endDate.diff(startDate, 'days') + 1;
          setDaysCount(daysCount);
        }
      
        if (fdate) {
          const formattedFDate = moment(fdate)?.format('MM/DD/YYYY');
          setFDatef(formattedFDate);
        } else {
          setFDatef('');
        }
      
        if (tdate) {
          const formattedTDate = moment(tdate)?.format('MM/DD/YYYY');
          setTDatef(formattedTDate);
        } else {
          setTDatef('');
        }
      
      // //sales
      // InventoryTurnOverRatioFetch();
      // ProductDevelopmentFetch();
      // AvgCollectionPeriodFetch();
      // SalesMarketing_TotalSaleFetch();
      // QualityControlFetch();
      // SalesMarketing_OrderFetch();
      // SalesMarketing_OrderCompletionFetch();
      // SalesMarketing_TotalSaleBusinessClassWiseFetch();
      // SalesMarketing_TotalSaleLocationWiseFetch();

      // //mfg
      // BaggingCompletedFetch();
      // G_LossFetch();
      // RMStockFetch();
      // MFGFetch();
      // inwardFetch();

      let apiUrl_kpi = '';
      
      if(hostName?.toLowerCase() === 'zen' || hostName?.toLowerCase() === 'localhost'){
        apiUrl_kpi = 'http://zen/jo/api-lib/App/KPI_DashBoard';
      }else{
        apiUrl_kpi = 'https://view.optigoapps.com/linkedapp/App/KPI_DashBoard';
      }
  
        const obj = {
          apiUrl_kpi:apiUrl_kpi,
          token:tkn,
          fdate:moment(fdate)?.format('MM/DD/YYYY'),
          tdate:moment(tdate)?.format('MM/DD/YYYY'),
        }
        const obj2 = {
          url : url,
          sv:sv,
          tkn:tkn,
          fdate:moment(fdate)?.format('MM/DD/YYYY'),
          tdate:moment(tdate)?.format('MM/DD/YYYY'),
        }

        dispatch(ProductDevelopmentAPI(obj));
        dispatch(QCAPI(obj));
        dispatch(ITORAPI(obj));
        dispatch(AvgCollectionRatioAPI(obj));
        dispatch(SaleMarketingTotalSaleApi(obj));
        dispatch(SaleMarketingOrderAPI(obj));
        dispatch(SaleMarketingOrderCompleteApi(obj));
        dispatch(SalesMarketing_TotalSaleBusinessClassWiseApi(obj));
        dispatch(SalesMarketing_TotalSaleLocationWiseApi(obj));

        dispatch(QCInwardAPI(obj2));
        dispatch(mfgTableApi(obj2));
        dispatch(baggingCompletedApi(obj2));
        dispatch(RmStockApi(obj2));
        dispatch(GrossLossApi(obj2));

    };
    const handlePopUpConfirm = () => {
        setShowPopUp(false); 

        // //sales
        // InventoryTurnOverRatioFetch();
        // ProductDevelopmentFetch();
        // AvgCollectionPeriodFetch();
        // SalesMarketing_TotalSaleFetch();
        // QualityControlFetch();
        // SalesMarketing_OrderFetch();
        // SalesMarketing_OrderCompletionFetch();
        // SalesMarketing_TotalSaleBusinessClassWiseFetch();
        // SalesMarketing_TotalSaleLocationWiseFetch();

        // //mfg
        // BaggingCompletedFetch();
        // G_LossFetch();
        // RMStockFetch();
        // MFGFetch();
        // inwardFetch();

        let apiUrl_kpi = '';
      
        if(hostName?.toLowerCase() === 'zen' || hostName?.toLowerCase() === 'localhost'){
          apiUrl_kpi = 'http://zen/jo/api-lib/App/KPI_DashBoard';
        }else{
          apiUrl_kpi = 'https://view.optigoapps.com/linkedapp/App/KPI_DashBoard';
        }
    
          const obj = {
            apiUrl_kpi:apiUrl_kpi,
            token:tkn,
            fdate:moment(fdate)?.format('MM/DD/YYYY'),
            tdate:moment(tdate)?.format('MM/DD/YYYY'),
          }
          const obj2 = {
            url : url,
            sv:sv,
            tkn:tkn,
            fdate:moment(fdate)?.format('MM/DD/YYYY'),
            tdate:moment(tdate)?.format('MM/DD/YYYY'),
          }
  
          dispatch(ProductDevelopmentAPI(obj));
          dispatch(QCAPI(obj));
          dispatch(ITORAPI(obj));
          dispatch(AvgCollectionRatioAPI(obj));
          dispatch(SaleMarketingTotalSaleApi(obj));
          dispatch(SaleMarketingOrderAPI(obj));
          dispatch(SaleMarketingOrderCompleteApi(obj));
          dispatch(SalesMarketing_TotalSaleBusinessClassWiseApi(obj));
          dispatch(SalesMarketing_TotalSaleLocationWiseApi(obj));
  
          dispatch(QCInwardAPI(obj2));
          dispatch(mfgTableApi(obj2));
          dispatch(baggingCompletedApi(obj2));
          dispatch(RmStockApi(obj2));
          dispatch(GrossLossApi(obj2));
    };  
    const handlePopUpCancel = () => {
        setShowPopUp(false); 
    };

  const filterOptions = [
    "Today", "Yesterday", "This Month", "Last Month", "Quarter", "This 6 Months", "This Year"
  ];
  
  return (
    <>
    <Grid container spacing={1} sx={{marginBottom:'3rem', padding: isSmallScreen ? '1rem' : '1rem', width:'95%', margin:'2% auto', marginTop:"0px" }}>
      { 0 ? <Box       sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100%',   
        padding: '1rem',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        position: 'fixed', 
        top: 0,
        left: 0, 
        zIndex: 1000, 
      }}
      >
              <CircularProgress sx={{color:'white'}} />
            </Box> : <>
            {
                showPopUp && (
                  <Dialog open={showPopUp} onClose={handlePopUpCancel} className='fs_analytics_l'>
                  <DialogTitle 
                    variant='h5' 
                    sx={{ textAlign: 'center', borderBottom: '1px solid #989898', position: 'relative' }}
                  >
                    Confirm
                    <IconButton
                      title='Close'
                      onClick={handlePopUpCancel}
                      size="small"
                      sx={{
                        position: 'absolute',
                        right: 8,
                        top: 9,
                        color: '#000',
                        '&:hover': {
                          backgroundColor: '#e8e8e8', 
                          color: 'black', 
                        },
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </DialogTitle>
                  <DialogContent>
                    <Typography sx={{pt:2}}>
                      <span style={{fontWeight:'bold', color:'#EA5455'}}>Warning</span> : This Process is <span style={{fontWeight:'bold', color:'#EA5455'}}>heavy loaded</span> which can cause effect in other transactions, or It may take some time to calculate.
                    </Typography>
                    <Typography>Are you sure want to calculate?</Typography>
                  </DialogContent>
                  <DialogActions sx={{display:'flex', alignItems:'center', justifyContent:'center', pb:2}}>
                    <Button onClick={handlePopUpCancel} variant='contained' sx={{backgroundColor:'#EA5455', color:'white', fontWeight:'bold', letterSpacing:'1.2px', boxShadow:0}} size='small' className='fs_analytics_l'>
                      Cancel
                    </Button>
                    <Button onClick={handlePopUpConfirm} variant='contained' sx={{backgroundColor:'#00b953', color:'white', fontWeight:'bold', letterSpacing:'1.2px', boxShadow:0}} size='small' className='fs_analytics_l'>
                      Proceed
                    </Button>
                  </DialogActions>
                  </Dialog>
                )
              }
            { !isMaxWidth720px && <Box className='fs_analytics_l' style={{width:'100%', display:'flex', justifyContent:'flex-end'}}> 
                <Box style={{margin:'5px', width:'50%', display:'flex', alignItems:'flex-end'}} className="media_w_100">
                <Select
                    value={dropdownValue}
                    onChange={handleDropdownChange}
                    style={{ width: '150px' }}
                    size='small'
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'gray', 
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme?.palette?.customColors?.purple,
                      },
                      marginRight:'10px'
                    }}
                    className='fs_analytics_l'
                  >
                  <MenuItem value="" disabled selected>Date Filters</MenuItem>
                  {
                    filterOptions?.map((e, i) => {
                      return <MenuItem value={e} key={i}>{e}</MenuItem>
                    })
                  }
                </Select>
                
              <div style={{display:'flex'}}>
                <div style={{display:'flex', flexDirection:'column'}}>
                  <span className='fs_analytics_l'>From Date</span>
                  <DatePicker
                    selected={fdate}
                    id='basic-input'
                    popperPlacement={popperPlacement}
                    disabled
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
                    disabled
                    dateFormat="dd-MM-yyyy"
                    placeholderText={ "DD-MM-YYYY"}
                    customInput={<CustomInput className='fs_analytics_l' sx={{border:'1px solid #989898',  backgroundColor:'white', marginRight:'10px'}}  />}
                    className='fs_analytics_l'
                  />
                </div>
              </div>
              <div><Button variant='contained' sx={{backgroundColor:theme?.palette?.customColors?.green, padding: "11px 15px"}} size='large' className='fs_analytics_l' onClick={() => handleApply()}>Apply</Button></div>
            </Box>
            </Box>}
            { isMaxWidth720px && <Box className='fs_analytics_l ' style={{width:'100%', display:'flex', justifyContent:'flex-end'}}> 
                <Box style={{margin:'5px', width:'50%', display:'flex', alignItems:'flex-end'}} className="media_w_100">
                <div className='d-flex'>
                  <Select
                      value={dropdownValue}
                      onChange={handleDropdownChange}
                      style={{ width: '150px' }}
                      size='small'
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'gray', 
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme?.palette?.customColors?.purple, 
                        },
                      }}
                      className='fs_analytics_l'
                    >
                  <MenuItem value="" disabled selected>Date Filters</MenuItem>
                  {
                    filterOptions?.map((e, i) => {
                      return <MenuItem value={e} key={i}>{e}</MenuItem>
                    })
                  }
                  </Select>
                </div>
                <div className='d-flex align-items-end'>
              <div style={{display:'flex'}}>
                <div style={{display:'flex', flexDirection:'column'}}>
                  <span className='fs_analytics_l'>From Date</span>
                  <DatePicker
                    selected={fdate}
                    id='basic-input'
                    popperPlacement={popperPlacement}
                    dateFormat="dd-MM-yyyy"
                    disabled
                    placeholderText={ "DD-MM-YYYY"}
                    customInput={<CustomInput className='fs_analytics_l' size="small" sx={{border:'1px solid #989898', backgroundColor:'white', marginRight:'10px', maxWidth:'120px'}}  />}
                    className='fs_analytics_l'
                    size="small"
                  />
                </div>
                <div style={{display:'flex',  flexDirection:'column'}}>
                  <span className='fs_analytics_l'>To Date</span>
                  <DatePicker
                    selected={tdate}
                    id='basic-input'
                    popperPlacement={popperPlacement}
                    dateFormat="dd-MM-yyyy"
                    disabled
                    placeholderText={ "DD-MM-YYYY"}
                    customInput={<CustomInput className='fs_analytics_l' size="small"  sx={{border:'1px solid #989898',  backgroundColor:'white', marginRight:'10px', maxWidth:'120px'}}  />}
                    className='fs_analytics_l'
                    size="small"
                  />
                </div>
              </div>
              <div><Button variant='contained' className='fs_analytics_l' sx={{backgroundColor:theme?.palette?.customColors?.green, padding: "11px 15px"}} size='large' onClick={() => handleApply()}>Apply</Button></div>
              </div>
            </Box>
            </Box>}
        <Grid item xs={12}><HeaderOfCard headerName="ACCOUNT & HR" bgColor={'#7d5ae773'} /></Grid>
                  
        <Grid item xs={12} sm={12} md={12} >
          <AccountHr  InventoryRatio={InventoryRatio} InventoryRatioDT={InventoryRatioDT} InventoryRatioDT1={InventoryRatioDT1} InventoryRatioDT2={InventoryRatioDT2} InventoryRatioDT3={InventoryRatioDT3}  AvgColPeriod={AvgColPeriod} saleMTs={saleMTs} saleMTs2={saleMTs2} PrdDev={PrdDev}   bgColor={theme?.palette?.customColors?.purple} acrLoader={acrLoader} irLoader={irLoader} PDLoader={PDLoader} />
        </Grid>

        { !isMaxWidth11410px && <><Grid item xs={12} md={4} lg={7}><HeaderOfCard headerName="RAW MATERIAL" bgColor={'#7d5ae773'} /></Grid>
        <Grid item xs={12} md={4} lg={3}><HeaderOfCard headerName="QUALTIY CONTROL" bgColor={'#7d5ae773'} /></Grid>
        <Grid item xs={12} md={4} lg={2}><HeaderOfCard headerName="PRODUCT DEVELOPMENT" bgColor={'#7d5ae773'} /></Grid>
        <Grid item xs={12} md={6} lg={7}>
            <RawMaterial  bgColor={theme?.palette?.customColors?.purple}  bgComp={bgComp} g_loss={g_loss} rmStock={rmStock} bgLoader={bgLoader} lossLoader={lossLoader} rmStockLoader={rmStockLoader} />
        </Grid>
        <Grid item xs={12} md={6} lg={3} >
            <QualityControl  bgColor={theme?.palette?.customColors?.purple}  QuaC={QuaC} qcInward={qcInward} inwardLoader={inwardLoader} QCLoader={QCLoader} InventoryRatio={InventoryRatio} />
        </Grid>
        <Grid item xs={12} md={6} lg={2}>
            <ProductDevelopment   bgColor={theme?.palette?.customColors?.purple}   PrdDev={PrdDev} PDLoader={PDLoader} />
        </Grid></>}

        { isMaxWidth11410px && <>
        <Grid item xs={12} ><HeaderOfCard headerName="RAW MATERIAL" bgColor={'#7d5ae773'} /></Grid>
            <Grid item xs={12} md={12} lg={12}>
                <RawMaterial  bgColor={theme?.palette?.customColors?.purple}  bgComp={bgComp} g_loss={g_loss} rmStock={rmStock} bgLoader={bgLoader} lossLoader={lossLoader} rmStockLoader={rmStockLoader} />
            </Grid>
        <Grid item xs={12} md={6} lg={6}><HeaderOfCard headerName="QUALTIY CONTROL" bgColor={'#7d5ae773'} /></Grid>
        { !isMaxWidth900px && <Grid item xs={12} md={6} lg={6}><HeaderOfCard headerName="PRODUCT DEVELOPMENT" bgColor={'#7d5ae773'} /></Grid>}
        
        <Grid item xs={12} md={6} lg={6}>
            <QualityControl  bgColor={theme?.palette?.customColors?.purple}  QuaC={QuaC} qcInward={qcInward} inwardLoader={inwardLoader} QCLoader={QCLoader} InventoryRatio={InventoryRatio} />
        </Grid>
        { isMaxWidth900px && <Grid item xs={12} md={6} lg={6}><HeaderOfCard headerName="PRODUCT DEVELOPMENT" bgColor={'#7d5ae773'} /></Grid>}
        <Grid item xs={12} md={6} lg={6}>
            <ProductDevelopment  bgColor={theme?.palette?.customColors?.purple}  PrdDev={PrdDev} PDLoader={PDLoader} />
        </Grid></>}
        
        { !isMaxWidth1700px && <><Grid item xs={12} md={12} lg={12}><HeaderOfCard headerName="SALES & MARKETING" bgColor={'#7d5ae773'} /></Grid>
        <Grid item xs={12} md={6} lg={3}>
            <SalesNMarketing2   bgColor={theme?.palette?.customColors?.purple}   saleMTs={saleMTs} saleMTs2={saleMTs2} saleMTsLoader={saleMTsLoader} />
        </Grid>
        <Grid item xs={12} md={6} lg={2}>
            <SalesNMarketing3 bgColor={theme?.palette?.customColors?.purple}  BCwise={BCwise} BCwiseLoader={BCwiseLoader}  />
        </Grid>
        <Grid item xs={12} md={6} lg={7}>
            <SalesNMarketing1  bgColor={theme?.palette?.customColors?.purple}  orderCmplt={orderCmplt} saleMTs={saleMTs} saleMTs2={saleMTs2} popUpList={popUpList} SMOrder={SMOrder} OCLoader={OCLoader} SMOrderLoader={SMOrderLoader} />
        </Grid></>}
        
        { isMaxWidth1700px && <><Grid item xs={12} md={12} lg={12}><HeaderOfCard headerName="SALES & MARKETING" bgColor={'#7d5ae773'} /></Grid>
        <Grid item xs={12} md={6} lg={6}>
            <SalesNMarketing2   bgColor={theme?.palette?.customColors?.purple}  saleMTs={saleMTs} saleMTs2={saleMTs2} saleMTsLoader={saleMTsLoader} />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
            <SalesNMarketing3 bgColor={theme?.palette?.customColors?.purple} BCwise={BCwise} BCwiseLoader={BCwiseLoader}  />
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
            <SalesNMarketing1  bgColor={theme?.palette?.customColors?.purple} orderCmplt={orderCmplt} saleMTs={saleMTs} saleMTs2={saleMTs2} popUpList={popUpList} SMOrder={SMOrder} OCLoader={OCLoader}  SMOrderLoader={SMOrderLoader} />
        </Grid></>}
        
        <Grid item xs={12} md={12} lg={12}><HeaderOfCard headerName="MANUFACTURING" bgColor={'#7d5ae773'} /></Grid>
        <Grid item xs={12} md={12} lg={12}>
            <Manufacturing bgColor={theme?.palette?.customColors?.purple}  LWise={LWise} mfgTable={mfgTable} mfgLoader={mfgLoader} LWiseLoader={LWiseLoader} />
        </Grid>
        </>}
    </Grid>
    </>
  )
}
export default KPIAnalytics;