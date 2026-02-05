
import { Box, Button, Grid, useMediaQuery, useTheme, Select, MenuItem, Typography, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton   } from '@mui/material';
import React, {  useEffect, useState } from 'react';
import "./kpianalytics.css"
import AccountNHR from './components/AccountNHR';
import SalesNMarketing1 from './components/SalesNMarketing1';
import QualityControl from './components/QualityControl';
import Manufacturing from './components/Manufacturing';
import RawMaterial from './components/RawMaterial';
import { fetchKPIDashboardData, formatAmountKWise } from '../GlobalFunctions';
import ProductDevelopment from './components/ProductDevelopment';
import SalesNMarketing2 from './components/SalesNMarketing2';
import HeaderOfCard from './components/HeaderOfCard';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import SalesNMarketing3 from './components/SalesNMarketing3.js';
import axios from 'axios';
import CustomInput from '../@core/components/pickersComponent/PickersCustomInput';
import {  checkNullUndefined } from './components/global.js';
import CloseIcon from '@mui/icons-material/Close';
import "react-datepicker/dist/react-datepicker.css";
import { useRecoilState } from 'recoil';
import { deafultValue } from './redux/atom/atom.js';

const KPIAnalytics = ({tkn, sv, url, hostName}) => {

    const [conuter , setCounter] = useRecoilState(deafultValue)

    const [elapsedTime, setElapsedTime] = useState(0);
    const [timer, setTimer] = useState(null);
    const startTimer = () => {
    const startTime = Date.now();
    setTimer(startTime);

    const interval = setInterval(() => {
      const currentTime = Date.now();
      setElapsedTime((currentTime - startTime) / 1000); 
    }, 1000);

    return interval; 
  };

  const stopTimer = (interval) => {
    clearInterval(interval); 
  };

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme?.breakpoints?.down('sm'));
    const isMaxWidth11410px = useMediaQuery('(max-width:1410px)');
    const isMaxWidth1700px = useMediaQuery('(max-width:1700px)');
    const isMaxWidth900px = useMediaQuery('(max-width:899px)');
    const [popperPlacement, setPopperPlacement] = useState('bottom-start');
    
    const [allApiData, setAllApiData] = useState(null);
    const [apiData1, setApiData1] = useState([]);

    const [loading, setLoading] = useState(false);

    const [QCData, setQCData] = useState([]);
    const [PDData, setPDData] = useState([]);
    const [SM1, setSM1] = useState([]);
    const [popUpList, setPopUpList] = useState();
    const [SM2, setSM2] = useState([]);
    const [SM3, setSM3] = useState([]);
    const [RMData, setRMData] = useState([]);
    const [MFGData, setMFGData] = useState([]);
    const[columns, setColumns] = useState([]);

    const [fdate, setFDate] = useState(new Date()); 
    const [tdate, setTDate] = useState(new Date());

    const [fdatef, setFDatef] = useState(moment().format('MM-DD-YYYY'));
    const [tdatef, setTDatef] = useState(moment().format('MM-DD-YYYY'));
    const [dropdownValue, setDropdownValue] = useState('Today');
    const [daysCount, setDaysCount] = useState(1);
    
    const isMaxWidth720px = useMediaQuery('(max-width:720px)');
    
    const [showPopUp, setShowPopUp] = useState(false);

    const [pleaseWaitFlag, setPleaseWaitFlag] = useState(false);

    let apiUrl_kpi = '';

    if(hostName?.toLowerCase() === 'zen' || hostName?.toLowerCase() === 'localhost'){
      apiUrl_kpi = 'http://zen/jo/api-lib/App/KPI_DashBoard';
    }else{
      apiUrl_kpi = 'https://view.optigoapps.com/linkedapp/App/KPI_DashBoard';
    }


    //separate api call 
    const [PrdDev, setPrdDev] = useState([]);
    const [QuaC, setQuaC] = useState([]);
    const [saleMTs, setSaleMTs] = useState([]);
    const [BCwise, setBCwise] = useState([]);
    const [LWise, setLWise] = useState([]);
    const [orderCmplt, setOrderCmplt] = useState([]);
    const [SMOrder, setSMOrder] = useState();
    const [InventoryRatio, setInventoryRatio] = useState();
    const [avgCollRatio, setAvgCollRatio] = useState();

    const ProductDevelopmentFetch = async() => {
      try {
          const response = await fetchKPIDashboardData(apiUrl_kpi, tkn, moment(fdate)?.format('MM/DD/YYYY'), moment(tdate)?.format('MM/DD/YYYY'), "ProductDevelopment");
          if(response){
            const data3 = [
              {
                stats: `${parseFloat(checkNullUndefined(response[0]?.Cnt))} / ${parseFloat(checkNullUndefined(response[0]?.MetalWeight))?.toFixed(3)} gm`,
                title: 'New Development',
              },
              {
                stats: `${parseFloat(checkNullUndefined((response?.SaleCount / (response[0]?.DesignCnt))))?.toFixed(2)}`,
                title: 'Repetation Rate',
              },
              
            ]
            setPrdDev(data3);
          }
          
      } catch (error) {
        console.log(error);
        
      }
    }
    const QualityControlFetch = async() => {
      try {
          const response = await fetchKPIDashboardData(apiUrl_kpi, tkn, moment(fdate)?.format('MM/DD/YYYY'), moment(tdate)?.format('MM/DD/YYYY'), "QualityControl");
          if(response){
            const data2 = [
              {
                // stats: parseFloat(checkNullUndefined(obj?.ProductionApiData?.rd[0]?.qc_avg_inward))?.toFixed(2),
                stats: 0,
                title: 'Inward',
              },
              {
                stats: parseFloat(checkNullUndefined(response[0]?.JobMoveStockBookCount))?.toFixed(2),
                title: 'Outward',
              },
              {
                stats: (checkNullUndefined(response[0]?.QACountWithOutClub)),
                title: 'Total Jobs',
              },
              {
                stats: parseFloat(checkNullUndefined((response[0]?.DaysDiff_QA_To_Stock / (response[0]?.TotalJobCount_QA_To_Stock))))?.toFixed(2),
                title: 'Avg. Prs. Time',
              }
            ]
            setQuaC(data2);
          }
          
      } catch (error) {
        console.log(error);
        
      }
    }
    const SalesMarketing_TotalSaleFetch = async() => {
      try {
          const response = await fetchKPIDashboardData(apiUrl_kpi, tkn, moment(fdate)?.format('MM/DD/YYYY'), moment(tdate)?.format('MM/DD/YYYY'), "SalesMarketing_TotalSale");
          if(response){
            const data5 = [
              {
              stats: `${parseFloat(checkNullUndefined(response[0]?.NetWt))?.toFixed(3)} gm`,
              title: 'Total Sale(Net)',
              },
             {
              stats: `${formatAmountKWise(checkNullUndefined(response[0]?.MetalAmount))}`,
              title: 'Gold Amt',
              },
             {
              stats: `${formatAmountKWise(checkNullUndefined(response[0]?.DiamondAmount))}`,
              title: 'Diamond Amt',
            },
             {
              stats: `${formatAmountKWise(checkNullUndefined(response[0]?.ColorStoneAmount))}`,
              title: 'Color Stone Amt',
            },
            {
              stats: `${formatAmountKWise(checkNullUndefined(response[0]?.LabourAmount))}`,
              title: 'Labour Amt',
            }
            ];
            setSaleMTs(data5);
          }
          
      } catch (error) {
        console.log(error);
        
      }
    }
    const SalesMarketing_TotalSaleBusinessClassWiseFetch = async() => {
      try {
          const response = await fetchKPIDashboardData(apiUrl_kpi, tkn, moment(fdate)?.format('MM/DD/YYYY'), moment(tdate)?.format('MM/DD/YYYY'), "SalesMarketing_TotalSaleBusinessClassWise");
          if(response){
            let arr = response?.sort((a, b) => b?.Amount - a?.Amount);
                // const formatedArr = obj?.SalesMarketing_TotalSaleBusinessClassWise?.slice(0, 4);
                const formatedArr = arr?.slice(0, 4);
                // const formatedArr2 = obj?.SalesMarketing_TotalSaleBusinessClassWise?.slice(4);
                const formatedArr2 = arr?.slice(4);
                const obj_cs = {
                  CustomerType : "Other",
                  Amount:0
                }
                
                formatedArr2?.forEach((a) => {
                  obj_cs.Amount += a?.Amount;
                })
                if(obj_cs?.Amount !== 0){
                  formatedArr.push(obj_cs);
                }
                
                setBCwise(formatedArr);
          }
          
      } catch (error) {
        console.log(error);
        
      }
    }
    const SalesMarketing_TotalSaleLocationWiseFetch = async() => {
      try {
          const response = await fetchKPIDashboardData(apiUrl_kpi, tkn, moment(fdate)?.format('MM/DD/YYYY'), moment(tdate)?.format('MM/DD/YYYY'), "SalesMarketing_TotalSaleLocationWise");
          if(response){
                setLWise(response);
          }
          
      } catch (error) {
        console.log(error);
        
      }
    }
    const SalesMarketing_OrderCompletionFetch = async() => {
      try {
          const response = await fetchKPIDashboardData(apiUrl_kpi, tkn, moment(fdate)?.format('MM/DD/YYYY'), moment(tdate)?.format('MM/DD/YYYY'), "SalesMarketing_OrderCompletion");
          if(response){
            
            setOrderCmplt(response);
          }
          
      } catch (error) {
        console.log(error);
        
      }
    }
    const AvgCollectionPeriodFetch = async() => {
      try {
          const response = await fetchKPIDashboardData(apiUrl_kpi, tkn, moment(fdate)?.format('MM/DD/YYYY'), moment(tdate)?.format('MM/DD/YYYY'), "AvgCollectionPeriod");
          if(response){
            console.log(response);
            
            setAvgCollRatio(response);
          }
          
      } catch (error) {
        console.log(error);
        
      }
    }
    const SalesMarketing_OrderFetch = async() => {
      try {
        const body2s = JSON.stringify({
          "Token" : `${tkn}`  
          ,"ReqData":`[{\"Token\":\"${tkn}\",\"Evt\":\"SalesMarketing_Order\",\"FDate\":\"${moment(fdate)?.format('MM/DD/YYYY')}\",\"TDate\":\"${moment(tdate)?.format('MM/DD/YYYY')}\"}]`
        });
        const headers2s = {
          "Content-Type":"application/json"
        }
        const SMO = await axios.post(apiUrl_kpi, body2s, headers2s);
        setSMOrder(SMO);
      } catch (error) {
        console.log(error);
        
      }
    }
    const InventoryTurnOverRatioFetch = async() => {
      try {
        const body = JSON.stringify({
          "Token" : `${tkn}`  
          ,"ReqData":`[{\"Token\":\"${tkn}\",\"Evt\":\"InventoryTurnOverRatio\",\"FDate\":\"${moment(fdate)?.format('MM/DD/YYYY')}\",\"TDate\":\"${moment(tdate)?.format('MM/DD/YYYY')}\"}]`
        });
        const headers = {
          "Content-Type":"application/json"
        }
        const ITOR_response = await axios.post(apiUrl_kpi, body, headers);
        
        setInventoryRatio(ITOR_response);
      } catch (error) {
        console.log(error);
        
      }
    }

    useEffect(() => {
      callAllApi();
      // handleApply();

      //sales
      // InventoryTurnOverRatioFetch();
      // ProductDevelopmentFetch();
      // AvgCollectionPeriodFetch();
      // SalesMarketing_TotalSaleFetch();
      // QualityControlFetch();
      // SalesMarketing_OrderFetch();
      // SalesMarketing_OrderCompletionFetch();
      // SalesMarketing_TotalSaleBusinessClassWiseFetch();
      // SalesMarketing_TotalSaleLocationWiseFetch();

      //mfg

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
          endDate = today;
          break;
        case 'Week':
          startDate = today.clone().subtract(6, 'days');
          endDate = today;
          break;
        case 'Month':
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

        case '6 Months':
        case '1 Year':
          const financialYearStart = moment().month(3).date(1); 
          startDate = financialYearStart;
          endDate = today;
          if (value === '6 Months') {
            startDate = today.clone().subtract(6, 'months').startOf('month');
          }
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

    const safeValue = (value) => {
      if (
          value === null || 
          value === undefined || 
          value === "null" || 
          value === "undefined" || 
          value === Infinity || 
          value === -Infinity || 
          isNaN(value)
      ) {
          return 0;
      }
      return value;
  };

    const callAllApi = async() => {
      setElapsedTime(0);
      const interval = startTimer();
      try {
        setLoading(true);

        setPleaseWaitFlag(true);

        let apiUrl_kpi = '';

        if(hostName?.toLowerCase() === 'zen' || hostName?.toLowerCase() === 'localhost'){
          apiUrl_kpi = 'http://zen/jo/api-lib/App/KPI_DashBoard';
        }else{
          apiUrl_kpi = 'https://view.optigoapps.com/linkedapp/App/KPI_DashBoard';
        }
        const PD = await fetchKPIDashboardData(apiUrl_kpi, tkn, moment(fdate)?.format('MM/DD/YYYY'), moment(tdate)?.format('MM/DD/YYYY'), "ProductDevelopment");
        const ACP = await fetchKPIDashboardData(apiUrl_kpi, tkn, moment(fdate)?.format('MM/DD/YYYY'), moment(tdate)?.format('MM/DD/YYYY'), "AvgCollectionPeriod");
        const SMTS = await fetchKPIDashboardData(apiUrl_kpi, tkn, moment(fdate)?.format('MM/DD/YYYY'), moment(tdate)?.format('MM/DD/YYYY'), "SalesMarketing_TotalSale");
        const QC = await fetchKPIDashboardData(apiUrl_kpi, tkn, moment(fdate)?.format('MM/DD/YYYY'), moment(tdate)?.format('MM/DD/YYYY'), "QualityControl");
        const SMOC = await fetchKPIDashboardData(apiUrl_kpi, tkn, moment(fdate)?.format('MM/DD/YYYY'), moment(tdate)?.format('MM/DD/YYYY'), "SalesMarketing_OrderCompletion");
        const SMTCSBC = await fetchKPIDashboardData(apiUrl_kpi, tkn, moment(fdate)?.format('MM/DD/YYYY'), moment(tdate)?.format('MM/DD/YYYY'), "SalesMarketing_TotalSaleBusinessClassWise");
        const SMTL = await fetchKPIDashboardData(apiUrl_kpi, tkn, moment(fdate)?.format('MM/DD/YYYY'), moment(tdate)?.format('MM/DD/YYYY'), "SalesMarketing_TotalSaleLocationWise");
     
        const body = JSON.stringify({
          "Token" : `${tkn}`  
          ,"ReqData":`[{\"Token\":\"${tkn}\",\"Evt\":\"InventoryTurnOverRatio\",\"FDate\":\"${moment(fdate)?.format('MM/DD/YYYY')}\",\"TDate\":\"${moment(tdate)?.format('MM/DD/YYYY')}\"}]`
        });
        const headers = {
          "Content-Type":"application/json"
        }
        const ITOR_response = await axios.post(apiUrl_kpi, body, headers);

        const body2s = JSON.stringify({
          "Token" : `${tkn}`  
          ,"ReqData":`[{\"Token\":\"${tkn}\",\"Evt\":\"SalesMarketing_Order\",\"FDate\":\"${moment(fdate)?.format('MM/DD/YYYY')}\",\"TDate\":\"${moment(tdate)?.format('MM/DD/YYYY')}\"}]`
        });
        const headers2s = {
          "Content-Type":"application/json"
        }
        const SMO = await axios.post(apiUrl_kpi, body2s, headers2s);
        

        //mfg
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
      const prdApi = await axios.post(replacedUrl, body2, { headers: headers2 });
      const KBC = prdApi?.data?.Data;
      const mainData = prdApi?.data?.Data;

        const body_kpi_2 = {
          "con":"{\"id\":\"\",\"mode\":\"kpidashboard_rmstock\",\"appuserid\":\"admin@hs.com\"}",
          "p":`{\"fdate\":\"${moment(fdate)?.format('MM/DD/YYYY')}\",\"tdate\":\"${moment(tdate)?.format('MM/DD/YYYY')}\"}`,  
          "f":"m-test2.orail.co.in (ConversionDetail)"
        }

      const headers2_kpi_2 = {
        Authorization:`Bearer ${tkn}`,
        YearCode:"e3t6ZW59fXt7MjB9fXt7b3JhaWwyNX19e3tvcmFpbDI1fX0=",
        version:"v4",
        sv:sv
      }
      const kpidashboard_rmstock = await axios.post(replacedUrl, body_kpi_2, { headers: headers2_kpi_2 });
      const KRS = kpidashboard_rmstock?.data?.Data;

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
      const kpidashboard_qcinward = await axios.post(replacedUrl, body_kpi_3, { headers: headers2_kpi_3 });
      const KQC = kpidashboard_qcinward?.data?.Data;
      
        const body_kpi_4 = {
          "con":"{\"id\":\"\",\"mode\":\"kpidashboard_mfg\",\"appuserid\":\"admin@hs.com\"}",
          "p":`{\"fdate\":\"${moment(fdate)?.format('MM/DD/YYYY')}\",\"tdate\":\"${moment(tdate)?.format('MM/DD/YYYY')}\"}`,  
          "f":"m-test2.orail.co.in (ConversionDetail)"
        }

      const headers2_kpi_4 = {
        Authorization:`Bearer ${tkn}`,
        YearCode:"e3t6ZW59fXt7MjB9fXt7b3JhaWwyNX19e3tvcmFpbDI1fX0=",
        version:"v4",
        sv:sv
      }
      const kpidashboard_mfg = await axios.post(replacedUrl, body_kpi_4, { headers: headers2_kpi_4 });
      const KMFG = kpidashboard_mfg?.data?.Data;

        const body_kpi_5 = {
          "con":"{\"id\":\"\",\"mode\":\"kpidashboard_loss\",\"appuserid\":\"admin@hs.com\"}",
          "p":`{\"fdate\":\"${moment(fdate)?.format('MM/DD/YYYY')}\",\"tdate\":\"${moment(tdate)?.format('MM/DD/YYYY')}\"}`,  
          "f":"m-test2.orail.co.in (ConversionDetail)"
        }

      const headers2_kpi_5 = {
        Authorization:`Bearer ${tkn}`,
        YearCode:"e3t6ZW59fXt7MjB9fXt7b3JhaWwyNX19e3tvcmFpbDI1fX0=",
        version:"v4",
        sv:sv
      }
      const kpidashboard_loss = await axios.post(replacedUrl, body_kpi_5, { headers: headers2_kpi_5 });
      const KL = kpidashboard_loss?.data?.Data;
        
        let obj = {
          kpidashboard_loss:'',
          kpidashboard_mfg:'',
          kpidashboard_qcinward:'',
          kpidashboard_rmstock:'',
          kpidashboard_baggingcompleted:'',
          ProductDevelopment:'',
          AvgCollectionPeriod:'',
          SalesMarketing_TotalSale:'',
          InventoryTurnOverRatio:'',
          QualityControl:'',
          ProductionApiData : '',
          SalesMarketingOrder:'',
          SalesMarketing_OrderCompletion:'',
          SalesMarketing_TotalSaleBusinessClassWise:'',
          SalesMarketing_TotalSaleLocationWise:''
        }

        //mfg api response
        if(KBC){
          obj.kpidashboard_baggingcompleted = KBC?.rd[0];
        }
        if(KRS){
          obj.kpidashboard_rmstock = KRS?.rd[0];
        }
        if(KQC){
          obj.kpidashboard_qcinward = KQC?.rd[0];
        }
        if(KMFG){
          obj.kpidashboard_mfg = KMFG?.rd || [];
        }
        if(KL){
          obj.kpidashboard_loss = KL?.rd[0];
        }


        //sales api response
        if(PD){
          obj.ProductDevelopment = PD;
          setCounter(1);
        }
        if(ACP){
          obj.AvgCollectionPeriod = ACP;
          setCounter(2);
        }
        if(SMTS){
          obj.SalesMarketing_TotalSale = SMTS;
          setCounter(3);
        }
        if(ITOR_response){
          obj.InventoryTurnOverRatio = ITOR_response?.data?.Data;
          setCounter(4);
          
        }
        if(QC){
          obj.QualityControl = QC;
        }
        if(mainData){
          obj.ProductionApiData = mainData;
        }
        if(SMO){
          obj.SalesMarketingOrder = SMO?.data?.Data;
        }
        if(SMOC){
          obj.SalesMarketing_OrderCompletion = SMOC;
        }
        if(SMTCSBC){
          obj.SalesMarketing_TotalSaleBusinessClassWise = SMTCSBC;
        }
        if(SMTL){
          obj.SalesMarketing_TotalSaleLocationWise = SMTL;
        }


        setAllApiData(obj);
        setLoading(false);
        stopTimer(interval);
        setPleaseWaitFlag(false);


        
              const data = [
                  {
                      heading:'Fix Asset Laverage Ratio',
                      totalValue: safeValue(parseFloat(checkNullUndefined( 
                        ( 
                        ( 
                          ( obj?.SalesMarketing_TotalSale[0]?.LabourAmount / (obj?.InventoryTurnOverRatio?.DT?.[0]?.AvgInventory))
                          / 
                          (obj?.InventoryTurnOverRatio?.DT?.[0]?.NoOfDays)
                         ) * 365)
                         ))),
                      series:[],
                      subheading:'Account & HR'
                  },
                  {
                      heading:'Revenue Per Employees',
                      totalValue: safeValue(parseFloat(checkNullUndefined(((obj?.SalesMarketing_TotalSale[0]?.OnlySaleLabourAmount / (obj?.ProductDevelopment[0]?.RevenueEmployeeCount)))))?.toFixed(2)),
                      series:[],
                      subheading:'Account & HR'
                  },
                  {
                      heading:'Avg. Due Debtors',
                      totalValue: safeValue(parseFloat(checkNullUndefined(checkNullUndefined(obj?.ProductDevelopment[0]?.TotalOverDueDays / obj?.ProductDevelopment[0]?.TotalBillCount)))?.toFixed(2)),
                      series:[],
                      subheading:'Account & HR'
                  },
                  {
                      heading:'Inventory Turn Over Ratio',
                      totalValue:safeValue(parseFloat(checkNullUndefined(obj?.InventoryTurnOverRatio?.DT?.[0]?.InventoryTurnOverRatio))?.toFixed(2)),
                      series:[],
                      subheading:'Account & HR'
                  },
                  {
                      heading:'Avg. Collection Period',
                      totalValue: safeValue(parseFloat(checkNullUndefined(((obj?.AvgCollectionPeriod[0]?.Sun_Debtor / (obj?.SalesMarketing_TotalSale[0]?.Amount)) * 365)))?.toFixed(2)),
                      series:[],
                      subheading:'Account & HR'
                  },
                  {
                      heading:'Labour vs Exp',
                      totalValue: safeValue(parseFloat(checkNullUndefined(((
                        ((obj?.SalesMarketing_TotalSale[0]?.LabourAmount) - 
                        (obj?.InventoryTurnOverRatio?.DT?.[0]?.Direct_Expense + obj?.InventoryTurnOverRatio?.DT1?.[0]?.InDirect_Expense)) / 
                        (obj?.SalesMarketing_TotalSale[0]?.LabourAmount)
                        ) * 100)))?.toFixed(2)),
                      series:[],
                      subheading:'Account & HR'
                  }
              ] ;
              setApiData1(data);

              const data2 = [
                {
                  stats: safeValue(parseFloat(checkNullUndefined(obj?.kpidashboard_qcinward?.qc_avg_inward))?.toFixed(2)),
                  title: 'Inward',
             
                },
                {
                  stats: safeValue(parseFloat(checkNullUndefined(obj?.QualityControl?.[0]?.JobMoveStockBookCount))?.toFixed(2)),
                  title: 'Outward',
           
                },
                {
                  stats: safeValue(checkNullUndefined(obj?.QualityControl?.[0]?.QACountWithOutClub)),
                  title: 'Total Jobs',
                },
                {
                  stats: safeValue(parseFloat(checkNullUndefined((obj?.QualityControl?.[0]?.DaysDiff_QA_To_Stock / (obj?.QualityControl?.[0]?.TotalJobCount_QA_To_Stock))))?.toFixed(2)),
                  title: 'Avg. Prs. Time',
                }
              ]
              setQCData(data2);

              const data3 = [
                {
                  stats: `${parseFloat(checkNullUndefined(obj?.ProductDevelopment[0]?.Cnt))} / ${parseInt(checkNullUndefined(Math.round(obj?.ProductDevelopment[0]?.MetalWeight)))} gm`,
                  title: 'New Development',
                },
                {
                  stats: `${safeValue(parseFloat(checkNullUndefined((obj?.ProductDevelopment[0]?.SaleCount / (obj?.ProductDevelopment[0]?.DesignCnt))))?.toFixed(2))}`,
                  title: 'Repetation Rate',
                },
               
              ]
              setPDData(data3);
              
              const data4 = [
              {
                stats: `${safeValue(parseFloat(checkNullUndefined(obj?.SalesMarketingOrder?.DT[0]?.TotalOrder))?.toFixed(3))} gm`,
                title: 'Total Order',
              },
              {
                stats: `${safeValue(parseFloat(checkNullUndefined(obj?.SalesMarketingOrder?.DT[0]?.AvgOrderSize))?.toFixed(2))}`,
                title: 'Avg. Order Size',
              },
              {
                stats: `${((obj?.SalesMarketing_OrderCompletion[0]?.LeadTime))}`,
                title: 'Lead Time',
              },
              {
                stats: `${obj?.SalesMarketing_OrderCompletion[0]?.DelayTime}`,
                title: 'Delay Time',
              },
              {
                stats: `${parseFloat(checkNullUndefined(obj?.SalesMarketing_TotalSale[0]?.AvgLabour))?.toFixed(2)}`,
                title: 'Avg. Labour',
              },
              {
                stats: `${parseFloat(checkNullUndefined(obj?.SalesMarketing_TotalSale[0]?.SaleReturnPer))?.toFixed(2)} %`,
                title: 'Sales Return ',
              },
              {
                stats: `${parseFloat(checkNullUndefined(obj?.SalesMarketingOrder?.DT[0]?.StockCountWithOutClub))?.toFixed(2)}`,
                title: 'Avg. Stock Book Jobs',
              },
              {
                stats: parseFloat(checkNullUndefined(obj?.SalesMarketing_OrderCompletion[0]?.OverDueDebtorsAmount))?.toFixed(2),
                title: 'Overdue Debtors',
              }
              ];
              const popUpDataList = obj?.SalesMarketingOrder;
              setSM1(data4);
              setPopUpList(popUpDataList);
              
              const data5 = [
                {
                stats: `${parseFloat(checkNullUndefined(obj?.SalesMarketing_TotalSale[0]?.Amount))?.toFixed(2)}`,
                title: 'Total Sale Amt',
                },
               {
                stats: `${(checkNullUndefined(obj?.SalesMarketing_TotalSale[0]?.MetalAmount))?.toFixed(2)}`,
                title: 'Gold Amt',
                },
               {
                stats: `${(checkNullUndefined(obj?.SalesMarketing_TotalSale[0]?.DiamondAmount))?.toFixed(2)}`,
                title: 'Diamond Amt',
              },
               {
                stats: `${(checkNullUndefined(obj?.SalesMarketing_TotalSale[0]?.ColorStoneAmount))?.toFixed(2)}`,
                title: 'Color Stone Amt',
              },
              {
                stats: `${(checkNullUndefined(obj?.SalesMarketing_TotalSale[0]?.LabourAmount))?.toFixed(2)}`,
                title: 'Labour Amt (L+DH+S+M)',
              },
              {
                stats: `${(checkNullUndefined(obj?.SalesMarketing_TotalSale[0]?.DeliveryCharged))?.toFixed(2)}`,
                title: 'Delivery Charges',
              }
              ];
              setSM2(data5);

              if(SMTCSBC){
                let arr = obj?.SalesMarketing_TotalSaleBusinessClassWise?.sort((a, b) => b?.Amount - a?.Amount);
                const formatedArr = arr?.slice(0, 4);
                const formatedArr2 = arr?.slice(4);
                const obj_cs = {
                  CustomerType : "Other",
                  Amount:0
                }
                
                formatedArr2?.forEach((a) => {
                  obj_cs.Amount += a?.Amount;
                })
                if(obj_cs?.Amount !== 0){
                  formatedArr.push(obj_cs);
                }
                
                setSM3(formatedArr);
              }
              
              const data6 = [
                
                {
                  stats: obj?.kpidashboard_baggingcompleted?.rm_baggingcompleted,
                  title: 'Bagging Completed',
                },

                {
                  stats: `${(parseInt((obj?.kpidashboard_baggingcompleted?.rm_avg_proc_time / (60 * 60 * 24)))?.toFixed(0))} Days`,
                  title: 'Avg. Process Time',
                },
                
                {
                  stats: `${(safeValue(obj?.kpidashboard_loss?.rm_grossloss)?.toFixed(3))} gm`,
                  title: 'Gross Loss',
                },
                {
                  stats: '',
                  title: '',
                  wt: ''
                },
                {
                  stats: (obj?.kpidashboard_rmstock?.rm_goldstock_amt === null || obj?.kpidashboard_rmstock?.rm_goldstock_amt === undefined) ? 0 : `${((obj?.kpidashboard_rmstock?.rm_goldstock_amt)?.toFixed(2))} Amt`,
                  title: 'Gold Stock',
                  wt: `${(+(safeValue(obj?.kpidashboard_rmstock?.rm_goldstock_wt)))?.toFixed(3)} gm`
                },
             
                {
                  stats: (obj?.kpidashboard_rmstock?.rm_diastock_amt === null || obj?.kpidashboard_rmstock?.rm_diastock_amt === undefined) ? 0 : `${((obj?.kpidashboard_rmstock?.rm_diastock_amt))?.toFixed(2)} Amt`,
                  title: 'Diamond Stock',
                  wt: `${(+(safeValue(obj?.kpidashboard_rmstock?.rm_diastock_wt)))?.toFixed(3)} ctw`
                },
                {
                  stats: (obj?.kpidashboard_rmstock?.rm_csstock_amt === null || obj?.kpidashboard_rmstock?.rm_csstock_amt === undefined) ? 0 : `${((obj?.kpidashboard_rmstock?.rm_csstock_amt))?.toFixed(2)} Amt`,
                  title: 'Colour Stone Stock',
                  wt: `${(+(safeValue(obj?.kpidashboard_rmstock?.rm_csstock_wt)))?.toFixed(3)} ctw`
                },
                {
                  stats: (obj?.kpidashboard_rmstock?.rm_miscstock_amt === null || obj?.kpidashboard_rmstock?.rm_miscstock_amt === undefined) ? 0 : `${((obj?.kpidashboard_rmstock?.rm_miscstock_amt))?.toFixed(2)} Amt`,
                  title: 'Misc Stock',
                  wt: `${(+(safeValue(obj?.kpidashboard_rmstock?.rm_miscstock_wt)))?.toFixed(3)} ctw`
                }
              ];
              setRMData(data6);


            
            

            try {
              const combinedData = {};
              const allLocations = new Set();
            
              obj?.kpidashboard_mfg?.forEach((item) => {
                const location = item?.manufacturelocationname || "NoLocation";
            
                if (!combinedData[location]) {
                  combinedData[location] = {};
                }
            
                if (location === "-") {
                  combinedData["NoLocation"] = {
                    ...combinedData["NoLocation"],
                    "Production (gm)": (combinedData["NoLocation"]?.["Production (gm)"] || 0) + (item?.mfg_production_gms || 0),
                    Jobs: (combinedData["NoLocation"]?.Jobs || 0) + (item?.mfg_jobs || 0),
                    "Gross Loss (%)": (combinedData["NoLocation"]?.["Gross Loss (%)"] || 0) + (item?.mfg_grossloss || 0),
                    "Rejection (%)": (combinedData["NoLocation"]?.["Rejection (%)"] || 0) + (item?.mfg_rejection || 0),
                  };
                } else {
                  combinedData[location] = {
                    ...combinedData[location],
                    "Production (gm)": (item?.mfg_production_gms)?.toFixed(3) || 0.000,
                    Jobs: (item?.mfg_jobs) || 0.00,
                    "Gross Loss (%)": (item?.mfg_grossloss)?.toFixed(3) || 0.000,
                    "Rejection (%)": (item?.mfg_rejection)?.toFixed(3) || 0.000,
                  };
                }
            
                allLocations.add(location);
              });
            
              obj?.SalesMarketing_TotalSaleLocationWise?.forEach((item) => {
                const location = item?.locationname || "NoLocation";
            
                if (!combinedData[location]) {
                  combinedData[location] = {};
                }
            
                if (location === "NoLocation") {
                  combinedData["NoLocation"] = {
                    ...combinedData["NoLocation"],
                    "Labour Amount": (combinedData["NoLocation"]?.["Labour Amount"] || 0) + (item?.LabourAmount || 0),
                  };
                } else {
                  combinedData[location] = {
                    ...combinedData[location],
                    "Labour Amount": item?.LabourAmount || 0.00,
                  };
                }
            
                allLocations.add(location);
              });
            
              const kpis = [
                "Production (gm)",
                "Jobs",
                "Labour Amount",
                "Gross Loss (%)",
                "Rejection (%)",
              ];
            
              const tableRows = kpis?.map((kpi, index) => {
                const row = { id: index + 1, KPI: kpi };
                allLocations.forEach((location) => {
                  if (kpi === "Labour Amount") {
                    row[location] = parseFloat(combinedData[location]?.[kpi] || 0.00)?.toFixed(2);
                  } else if (kpi === "Production (gm)" || kpi === "Gross Loss (%)" || kpi === "Rejection (%)") {
                    row[location] = parseFloat(combinedData[location]?.[kpi] || 0.000)?.toFixed(3); 
                  } else {
                    row[location] = (combinedData[location]?.[kpi] || 0.00);
                  }
                });
                return row;
              });
            
              const tableColumns = [
                { field: "KPI", headerName: "KPI", width: 200 },
                ...Array?.from(allLocations)?.map((location) => ({
                  field: location,
                  headerName: location,
                  flex: 1,
                  minWidth: 170,
                  maxWidth: 300,
                })),
              ];

                tableColumns.forEach((e, index) => {
                  if (e.headerName === "-") {
                    tableColumns.splice(index, 1);
                  }
                });
            
              tableColumns?.forEach((e) => {
                if (e?.headerName?.toLowerCase() === "nolocation") {
                  e.headerName = "OutRight";
                }
              });
            
              setMFGData(tableRows);
              setColumns(tableColumns);
            } catch (error) {
              console.log(error);
              setPleaseWaitFlag(false);
            }
            
            
        
      } catch (error) {
        console.log(error);
        setLoading(false);
        stopTimer(interval);
        setPleaseWaitFlag(false);
      }
    }

      const handleApply = () => {
        const startDate = moment(fdate);
        const endDate = moment(tdate);
        const diffInDays = endDate.diff(startDate, 'days');

          if((dropdownValue === "Today" || dropdownValue === "Yesterday" || dropdownValue === "Week" || dropdownValue === "Month" || dropdownValue === "Last Month" || dropdownValue === "Quarter") && (diffInDays <= 180)){
            setShowPopUp(false);
          }else if ((dropdownValue === "Today" || dropdownValue === "Yesterday" || dropdownValue === "Week" || dropdownValue === "Month" || dropdownValue === "Last Month" || dropdownValue === "Quarter") && (diffInDays >= 180)){
            setShowPopUp(true);
            return;
          }else if ((dropdownValue === "Today" || dropdownValue === "Yesterday" || dropdownValue === "Week" || dropdownValue === "Month" || dropdownValue === "Last Month" || dropdownValue === "Quarter") && (diffInDays >= 180)){
            setShowPopUp(true);
            return;
          }else if ((dropdownValue === "6 Months" || dropdownValue === "1 Year" ) && (diffInDays >= 180)){
            setShowPopUp(true);
            return;
          }else if ((dropdownValue === "6 Months" || dropdownValue === "1 Year" ) && (diffInDays <= 180)){
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
      
        callAllApi();
      };
      const handlePopUpConfirm = () => {
        setShowPopUp(false); 
        callAllApi(); 
      };
      
      const handlePopUpCancel = () => {
        setShowPopUp(false); 
      };
      



  // if(!loading){
  //   console.log("Api calling response time taken in seconds : ", Math.round(elapsedTime));
  // }
  
  return (
    <>
    <Grid container spacing={1} sx={{marginBottom:'3rem', padding: isSmallScreen ? '1rem' : '1rem', width:'95%', margin:'2% auto', marginTop:"0px" }}>
      { loading ? <Box       sx={{
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
              {/* <h1 style={{backgroundColor:'white', color:'black'}}>{conuter}</h1> */}
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
            { !isMaxWidth720px && <Box className='fs_analytics_l ' style={{width:'100%', display:'flex', justifyContent:'flex-end'}}> 
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
                  >
                  <MenuItem value="" disabled selected>Date Filters</MenuItem>
                  <MenuItem value="Today">Today</MenuItem>
                  <MenuItem value="Yesterday">Yesterday</MenuItem>
                  <MenuItem value="Month">This Month</MenuItem>
                  <MenuItem value="Last Month">Last Month</MenuItem>
                  <MenuItem value="Quarter">Quarterly (Last 3 Months)</MenuItem>
                  <MenuItem value="6 Months">This 6 Months</MenuItem>
                  <MenuItem value="1 Year">This Year</MenuItem>
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
              <div><Button variant='contained' sx={{backgroundColor:theme?.palette?.customColors?.green}} size='large' onClick={() => handleApply()}>Apply</Button></div>
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
                    >
                  <MenuItem value="" disabled selected>Date Filters</MenuItem>
                  <MenuItem value="Today">Today</MenuItem>
                  <MenuItem value="Yesterday">Yesterday</MenuItem>
                  <MenuItem value="Month">This Month</MenuItem>
                  <MenuItem value="Last Month">Last Month</MenuItem>
                  <MenuItem value="Quarter">Quarterly (Last 3 Months)</MenuItem>
                  <MenuItem value="6 Months">This 6 Months</MenuItem>
                  <MenuItem value="1 Year">This Year</MenuItem>
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
              <div><Button variant='contained' sx={{backgroundColor:theme?.palette?.customColors?.green}} size='small' onClick={() => handleApply()}>Apply</Button></div>
              </div>
            </Box>
            </Box>}
        <Grid item xs={12}><HeaderOfCard headerName="ACCOUNT & HR" bgColor={'#7d5ae773'} /></Grid>
            
            {apiData1?.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                    <AccountNHR tkn={tkn} data={item} bgColor={theme?.palette?.customColors?.purple} fdate={fdatef} tdate={tdatef} />
                </Grid>
            ))}

        { !isMaxWidth11410px && <><Grid item xs={12} md={4} lg={7}><HeaderOfCard headerName="RAW MATERIAL" bgColor={'#7d5ae773'} /></Grid>
        <Grid item xs={12} md={4} lg={3}><HeaderOfCard headerName="QUALTIY CONTROL" bgColor={'#7d5ae773'} /></Grid>
        <Grid item xs={12} md={4} lg={2}><HeaderOfCard headerName="PRODUCT DEVELOPMENT" bgColor={'#7d5ae773'} /></Grid>
        <Grid item xs={12} md={6} lg={7}>
            <RawMaterial tkn={tkn} bgColor={theme?.palette?.customColors?.purple} fdate={fdatef} tdate={tdatef} sv={sv} RMData={RMData} />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
            <QualityControl tkn={tkn} bgColor={theme?.palette?.customColors?.purple} fdate={fdatef} tdate={tdatef} QCData={QCData} QuaC={QuaC}  />
        </Grid>
        <Grid item xs={12} md={6} lg={2}>
            <ProductDevelopment tkn={tkn} fdate={fdatef} tdate={tdatef} bgColor={theme?.palette?.customColors?.purple}  PDData={PDData} PrdDev={PrdDev} />
        </Grid></>}

        { isMaxWidth11410px && <>
        <Grid item xs={12} ><HeaderOfCard headerName="RAW MATERIAL" bgColor={'#7d5ae773'} /></Grid>
            <Grid item xs={12} md={12} lg={12}>
                <RawMaterial tkn={tkn} bgColor={theme?.palette?.customColors?.purple} fdate={fdatef} tdate={tdatef} sv={sv} RMData={RMData} />
            </Grid>
        <Grid item xs={12} md={6} lg={6}><HeaderOfCard headerName="QUALTIY CONTROL" bgColor={'#7d5ae773'} /></Grid>
        { !isMaxWidth900px && <Grid item xs={12} md={6} lg={6}><HeaderOfCard headerName="PRODUCT DEVELOPMENT" bgColor={'#7d5ae773'} /></Grid>}
        
        <Grid item xs={12} md={6} lg={6}>
            <QualityControl tkn={tkn} bgColor={theme?.palette?.customColors?.purple} fdate={fdatef} tdate={tdatef} QCData={QCData} QuaC={QuaC}  />
        </Grid>
        { isMaxWidth900px && <Grid item xs={12} md={6} lg={6}><HeaderOfCard headerName="PRODUCT DEVELOPMENT" bgColor={'#7d5ae773'} /></Grid>}
        <Grid item xs={12} md={6} lg={6}>
            <ProductDevelopment tkn={tkn} bgColor={theme?.palette?.customColors?.purple} fdate={fdatef} tdate={tdatef} PDData={PDData} />
        </Grid></>}
        
        
        { !isMaxWidth1700px && <><Grid item xs={12} md={12} lg={12}><HeaderOfCard headerName="SALES & MARKETING" bgColor={'#7d5ae773'} /></Grid>
        <Grid item xs={12} md={6} lg={3}>
            <SalesNMarketing2 tkn={tkn}  bgColor={theme?.palette?.customColors?.purple}  fdate={fdatef} tdate={tdatef} SM2={SM2} saleMTs={saleMTs} />
        </Grid>
        <Grid item xs={12} md={6} lg={2}>
            <SalesNMarketing3 tkn={tkn} bgColor={theme?.palette?.customColors?.purple}  fdate={fdatef} tdate={tdatef} SM3={SM3} BCwise={BCwise}  />
        </Grid>
        <Grid item xs={12} md={6} lg={7}>
            <SalesNMarketing1 tkn={tkn} bgColor={theme?.palette?.customColors?.purple} fdate={fdatef} tdate={tdatef} SM1={SM1} popUpList={popUpList} />
        </Grid></>}
        
        { isMaxWidth1700px && <><Grid item xs={12} md={12} lg={12}><HeaderOfCard headerName="SALES & MARKETING" bgColor={'#7d5ae773'} /></Grid>
        <Grid item xs={12} md={6} lg={6}>
            <SalesNMarketing2 tkn={tkn}  bgColor={theme?.palette?.customColors?.purple}  fdate={fdatef} tdate={tdatef} SM2={SM2} saleMTs={saleMTs} />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
            <SalesNMarketing3 tkn={tkn} bgColor={theme?.palette?.customColors?.purple}  fdate={fdatef} tdate={tdatef} SM3={SM3}  />
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
            <SalesNMarketing1 tkn={tkn} bgColor={theme?.palette?.customColors?.purple}  fdate={fdatef} tdate={tdatef} SM1={SM1} popUpList={popUpList} />
        </Grid></>}
        
        <Grid item xs={12} md={12} lg={12}><HeaderOfCard headerName="MANUFACTURING" bgColor={'#7d5ae773'} /></Grid>
        <Grid item xs={12} md={12} lg={12}>
            <Manufacturing tkn={tkn}  bgColor={theme?.palette?.customColors?.purple} fdate={fdatef} tdate={tdatef} sv={sv} MFGData={MFGData} columns={columns} />
        </Grid>
        </>}
    </Grid>
    </>
  )
}
export default KPIAnalytics;