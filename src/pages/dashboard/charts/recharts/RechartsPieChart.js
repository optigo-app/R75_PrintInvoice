// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Tooltip from '@mui/material/Tooltip';
// ** Third Party Imports
import {  PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

// ** Icon Imports
// import Icon from 'src/@core/components/icon'
import Icon from '../../@core/components/icon'
import { useState } from 'react';
import { fetchDashboardData, formatAmount, formatAmountKWise } from '../../GlobalFunctions';
import { useEffect } from 'react';


const RADIAN = Math.PI / 180

const renderCustomizedLabel = props => {
  // ** Props
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text x={x} y={y}  textAnchor='middle' dominantBaseline='central'>
      {/* {`${(percent * 100).toFixed(0)}%`} */}
      {/* {`${(percent * 100)?.toFixed(0)}`} */}
    </text>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];  // Access data for the hovered segment
    return (
      <div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '5px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <div className='customtooltip'>{name}</div>
        {/* <p>Value: {value}</p> */}
      </div>
    );
  }
  return null;
};

const RechartsPieChart = ({tkn,  fdate, tdate, country, VendorWiseNetWtData}) => {
  console.log('VendorWiseNetWtData: ', VendorWiseNetWtData);
  const [hoveredData, setHoveredData] = useState(null)

  const [apiData, setApiData] = useState([]);

  useEffect(() => {

    const fetchData = async () => {
      try {
        setApiData(VendorWiseNetWtData);
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData(); 
},[VendorWiseNetWtData]);

  const sortedData = VendorWiseNetWtData?.sort((a, b) => {
    const netWtA = a?.NetWt || 0; 
    const netWtB = b?.NetWt || 0;
    return netWtB - netWtA;
  });
  const top10 = sortedData?.slice(0, 5);
  

  const colors = ["#00d4bd", "#ffe700", "#FFA1A1", "#826bf8", "#EA5455","#B9E9CF", "#FF9F43","#A8AAAE","#2196F3","#F50057"]

  const data = top10?.map((item, index) => ({
    name: item?.Vendor,
    value: item?.NetWt || 0,
    color: colors[index] 
  }))


  return (
    <Card className='fs_analytics_l'  style={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)', minHeight:'34.85rem'}}>
      <CardHeader
        title='Top Vendors'
        subheader='Overview of NetWt'
      />
      <CardContent>
        <Box sx={{ height: 350,  position:'relative' }}>
          <ResponsiveContainer>
            <PieChart height={350} style={{ direction: 'ltr' }}>
              <Pie data={data} innerRadius={80} dataKey='value' label={renderCustomizedLabel} labelLine={false}
                  onMouseEnter={(data, index) => {
                    setHoveredData(data)
                  }}
                  onMouseLeave={() => setHoveredData(null)}
                  skipAnimation={false}
                  
              >
                {data?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry?.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {hoveredData && (
            <Box
              sx={{
                position: 'absolute',
                zIndex:9999,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none'
              }}
            >
              <Typography variant='h6' align='center' color='secondary' sx={{fontWeight:'bold'}}>
                {hoveredData?.name} <br /> {((hoveredData?.value ))} gm
              </Typography>
            </Box>
          )}
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 2, mt:1.5, justifyContent: 'center' }}>
            {data?.map((item, index) => (
              <Box
                key={index}
                sx={{
                  mr: 5,
                  display: 'flex',
                  alignItems: 'center',
                  '& svg': { mr: 1, color: item?.color }
                }}
              >
              <Tooltip sx={{
                  '& .MuiTooltip-tooltip': {
                    fontSize: '16px !important', 
                    fontWeight: 'bold !important',
                    backgroundColor: '#1976d2 !important', 
                    color: 'white !important', 
                  },
              }} title={<Typography className='fs_analytics_l'  sx={{color:'white'}}>{`NetWt: ${((item?.value))} gm`}</Typography>} arrow>
                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <Icon icon="mdi:circle" fontSize="0.75rem" />
                  <Typography variant="body2">{item?.name?.toUpperCase()}</Typography>
                </Box>
              </Tooltip>
         </Box>
  ))}
        </Box>
      </CardContent>
    </Card>
  )
}

export default RechartsPieChart
