import React, { useState, useEffect, memo } from 'react';
import { Card, CardHeader, styled, useTheme } from '@mui/material';
import ReactApexcharts from '../@core/components/react-apexcharts';

const PriceRangeWise = ({ jobWisePriceRangeData, country }) => {
  const theme = useTheme();
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (jobWisePriceRangeData?.DT1?.length) {
      const sortedData = jobWisePriceRangeData.DT1;

      const series = [
        {
          name: 'Job Count',
          data: sortedData.map(e => (typeof e.JobCnt === 'number' ? e.JobCnt : 0))
        }
      ];
      const arr = [];
      sortedData?.forEach((e) => {
        let obj = {...e};
        obj.PriceFrom = (obj?.PriceFrom / (+country));
        obj.PriceTo = (obj?.PriceTo / (+country));
        arr.push(obj);
      })
      const categories = arr.map(e => 
        e.PriceFrom && e.PriceTo ? `${(e.PriceFrom)?.toFixed(0)}-${(e.PriceTo)?.toFixed(0)}` : ''
      );
      
      
      setChartData({ series, categories });
    } else {
      setChartData({
        series: [{ name: 'Job Count', data: [0] }],
        categories: ['']
      });
    }
    
  }, [jobWisePriceRangeData?.DT1, country]);


  const options = {
    chart: {
      type: 'line',
      zoom: { enabled: false },
      toolbar: { show: false }
    },
    colors: ['#5470C6'],
    stroke: {
      curve: 'smooth',
      width: 2
    },
    dataLabels: { enabled: true },
    markers: {
      size: 5,
      colors: ['#5470C6'],
      strokeColors: '#fff',
      strokeWidth: 2
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 4,
      padding: { top: 10, left: 0, right: 0 }
    },
    tooltip: {
      theme: 'light',
      custom({ series, seriesIndex, dataPointIndex }) {
        const value = series[seriesIndex]?.[dataPointIndex] ?? 'N/A';
        return `<div class="apexcharts-tooltip">
          <strong>Job Count:</strong> ${value}
        </div>`;
      }
    },
    xaxis: {
      categories: chartData?.categories || [],
      labels: { style: { colors: theme.palette.text.disabled } },
      axisBorder: { show: true },
      axisTicks: { show: true, color: theme.palette.divider },
      title: {
        text: "Amount",
        style:{
            fontSize:"13px",
            fontWeight:'normal'
        }
      },
    },
    yaxis: {
      labels: { style: { colors: theme.palette.text.disabled } },
      title: {
        text: "Jobs",
        style:{
            fontSize:"13px",
            fontWeight:'normal'
        }
      },
    },
        
  };

  if (!chartData) {
    return <div>Loading chart...</div>;
  }
  

  return (  
    <Card
      className="fs_analytics_l tableHeight"
      style={{ boxShadow: '0px 4px 18px 0px rgba(47, 43, 61, 0.1)', minHeight: '400px' }}
    >
      <CardHeader
        title="Price Ranges With Job Count"
        titleTypographyProps={{ sx: { mb: [2, 0] } }}
        sx={{
          py: 2.5,
          flexDirection: ['column', 'row'],
          '& .MuiCardHeader-action': { m: 0 },
          alignItems: ['flex-start', 'center']
        }}
      />
     <ReactApexcharts
        key={JSON.stringify(chartData?.series)} // Force re-render if series changes
        type="line"
        height={300}
        options={options}
        series={chartData?.series}
      />
    </Card>
  );
};

export default React.memo(PriceRangeWise);
