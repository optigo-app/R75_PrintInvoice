import { ThemeProvider, createTheme } from '@mui/material';
import React, { useState } from 'react'
import customTheme from "./@core/theme/theme"
import SalesDashboard from './salesDashboard/SalesDashboard';
import { useLocation } from 'react-router-dom';
import KPIDashboardHome from './componentsofkpi/components/KPIDashboardHome';
import FactoryDashboardHome from './factoryDashboard/FactoryDashboardHome';
const Dashboard = () => {
    let theme = createTheme(customTheme);
    const location = useLocation();
    const queryParam = location?.search;
    const params = new URLSearchParams(queryParam);

    // Extract specific parameters
    const tkn = atob(params.get('tkn'));
    const pid = (params.get('pid'));
    const sv = atob(params.get('sv'));
    const url = atob(params.get('report_api_url'));
    const LId = atob(params.get('LId'));
    const IFB = +(params.get('IFB'));
    const IsEmpLogin = +(params.get('IsEmpLogin'));
    const IsPower = +(params.get('IsPower'));
    const hostName = window.location?.hostname?.toLowerCase();
  return (
    <>
    <ThemeProvider theme={theme}>
        <div style={{
            width:'100%',
            maxWidth:'100vw',
        }}>
            { (pid === '18145' || pid === '18171') && <div style={{
                width:'100%', 
                boxSizing:'border-box',
                backgroundColor:'#F8F7FA',
                padding:'2rem'}}><SalesDashboard tkn={tkn} hostName={hostName} LId={LId} IsEmpLogin={IsEmpLogin} IsPower={IsPower} IFB={IFB} /> 
            </div>}
            { pid === '18146' && <div style={{
                width:'100%', 
                boxSizing:'border-box',
                backgroundColor:'#F8F7FA',
                padding:'2rem', paddingTop:'0px'}}><KPIDashboardHome tkn={tkn} sv={sv} url={url} hostName={hostName}  />
            </div>}
            { (pid === '18147' || pid === '18170') && <div style={{
                width:'100%', 
                boxSizing:'border-box',
                backgroundColor:'#F8F7FA',
                padding:'2rem'}}>
                    <FactoryDashboardHome tkn={tkn} LId={LId} IsEmpLogin={IsEmpLogin} IFB={IFB} />
            </div>}
        </div>
    </ThemeProvider>
    </>
  )
}

export default Dashboard;
