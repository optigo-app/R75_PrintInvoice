import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { PolarArea } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { capitalizeFirstLetter, fetchDashboardData, formatAmountKWise } from '../GlobalFunctions';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const AnalyticsSalesRepWiseSaleAmt = props => {
  const theme = useTheme();
  const [apiData, setApiData] = useState([]);
  console.log('apiData: ', apiData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const arr = props?.SalesrepWiseSaleAmount?.sort((a, b) => b?.SaleAmount - a?.SaleAmount)?.slice(0, 5);
        setApiData(arr);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [props?.SalesrepWiseSaleAmount]);


  const {legendColor } = props;

  const SalesRepName = props?.SalesrepWiseSaleAmount?.sort((a, b) => b?.SaleAmount - a?.SaleAmount)?.slice(0, 5)?.map((e) => capitalizeFirstLetter(e?.SalesRep));
  const SaleAmt = props?.SalesrepWiseSaleAmount?.sort((a, b) => b?.SaleAmount - a?.SaleAmount)?.slice(0, 5)?.map((e) => +(((e?.SaleAmount / (+props?.country)))?.toFixed(2)));
  const profitAmt = props?.SalesrepWiseSaleAmount?.sort((a, b) => b?.SaleAmount - a?.SaleAmount)?.slice(0, 5)?.map((e) => (e?.Profit / (+props?.country)));

  console.log('saledjddj',SaleAmt)
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    layout: {
      padding: {
        top: -5,
        bottom: -45
      }
    },
    scales: {
      r: {
        grid: { display: false },
        ticks: { display: false }
      }
    },
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 25,
          boxWidth: 9,
          color: legendColor,
          usePointStyle: true
        }
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const value = tooltipItem.raw;
            return `Sale Amount: ${formatAmountKWise(value)}`;
          }
        }
      }
    }
  };
  
  const data = {
    labels: SalesRepName,
    datasets: [
      {
        borderWidth: 0,
        label: 'Sale Amount',
        data: SaleAmt,
        backgroundColor: [theme?.palette?.customColors?.purple, "#E7D400", theme?.palette?.customColors?.orange, theme?.palette?.customColors?.info, theme?.palette?.customColors?.grey, theme?.palette?.customColors?.green]
      }
    ]
  }
  return (
    <Card className='fs_analytics_l' style={{ boxShadow: '0px 4px 18px 0px rgba(47, 43, 61, 0.1)', minHeight: '34.85rem' }}>
      <CardHeader
        title='Top Sales Representative Wise Sale Amount'
      />
      <CardContent>
        <PolarArea data={data} height={350} options={options} />
      </CardContent>
    </Card>
  )
}

export default AnalyticsSalesRepWiseSaleAmt;