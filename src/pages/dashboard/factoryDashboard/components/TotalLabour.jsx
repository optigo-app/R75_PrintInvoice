import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { useTheme } from '@mui/material/styles';
import ReactApexcharts from '../../@core/components/react-apexcharts';
import { CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { formatAmountKWise } from '../../GlobalFunctions';

const TotalLabour = ({ selectMaterial, selectCurrency }) => {
  const { loading, data } = useSelector(state => state?.Summary_Purchase);
  const [vendorWiseNameList, setVendorWiseNameList] = useState([]);
  const [yAxis, setYAxis] = useState([]);
  const [tooltipData, setTooltipData] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    let Labourdata = data?.DT1;

    if (Labourdata?.length > 0) {
      let sortedByLabourAmount = Labourdata.slice()
        .sort((a, b) => b.TotalLabourAmount - a.TotalLabourAmount)
        .slice(0, 8);

      setVendorWiseNameList(sortedByLabourAmount.map(e => e.Vendor));
      setYAxis(sortedByLabourAmount.map(e => e.TotalLabourAmount));

      // Format tooltip data
      const formattedTooltipData = sortedByLabourAmount.map(e => {
        let additionalLabel1 = "";
        let additionalValue1 = "";
        let additionalLabel2 = "";
        let additionalValue2 = "";

        if (selectMaterial == 1) {
          additionalLabel1 = "Dia Pcs";
          additionalValue1 = `${e.DiaPcs}`;
          additionalLabel2 = "Dia Wt";
          additionalValue2 = `${parseFloat(e.DiaWt)?.toFixed(3)} ctw`;
        } else if (selectMaterial == 2) {
          additionalLabel1 = "CS Pcs";
          additionalValue1 = `${e.CSPcs}`;
          additionalLabel2 = "CS Wt";
          additionalValue2 = `${parseFloat(e.CSWt)?.toFixed(3)} ctw`;
        } else if (selectMaterial == 3) {
          additionalLabel1 = "MISC Pcs";
          additionalValue1 = `${e.MISCPcs}`;
          additionalLabel2 = "MISC Wt";
          additionalValue2 = `${parseFloat(e.MISCWt)?.toFixed(3)} gm`;
        }

        return {
          Vendor: e.Vendor,
          Netwt: e.Netwt,
          TotalJobCnt: e.TotalJobCnt,
          AdditionalLabel1: additionalLabel1,
          AdditionalValue1: additionalValue1,
          AdditionalLabel2: additionalLabel2,
          AdditionalValue2: additionalValue2
        };
      });

      setTooltipData(formattedTooltipData);
    } else {
      setVendorWiseNameList([]);
      setYAxis([]);
      setTooltipData([]);
    }
  }, [selectMaterial, data?.DT1]);

  const colors = Array(8).fill('#FF9F43');

  const options = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        distributed: true,
        columnWidth: '35%',
        startingShape: 'rounded',
        dataLabels: { position: 'top' }
      }
    },
    legend: { show: false },
    tooltip: {
      enabled: true,
      style: {
        fontSize: '14px',
        fontFamily: theme.typography.fontFamily
      },
      y: {
        formatter: val => `${formatAmountKWise(val)}`
      },
      custom: ({ dataPointIndex }) => {
        if (!tooltipData[dataPointIndex]) return '';
        const { Vendor, Netwt, TotalJobCnt, AdditionalLabel1, AdditionalValue1, AdditionalLabel2, AdditionalValue2 } = tooltipData[dataPointIndex];

        return `
          <div style="
            padding: 12px; 
            background: white; 
            color: black; 
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
            font-size: 14px;
            line-height: 1.5;
          ">
            <strong>${Vendor}</strong><br/>
            Netwt: ${formatAmountKWise(Netwt)}<br/>
            Total Jobs: ${TotalJobCnt}<br/>
            ${AdditionalLabel1}: ${AdditionalValue1}<br/>
            ${AdditionalLabel2}: ${AdditionalValue2}
          </div>
        `;
      }
    },
    dataLabels: {
      offsetY: -15,
      formatter: val => `${formatAmountKWise((val) / +selectCurrency)}`,
      style: {
        fontWeight: 500,
        colors: [theme.palette.text.secondary],
        fontSize: theme.typography.body1.fontSize
      }
    },
    colors: Array(8).fill('#FF9F43'),
    states: {
      hover: { filter: { type: 'none' } },
      active: { filter: { type: 'none' } }
    },
    grid: {
      show: false,
      padding: {
        top: 20,
        left: -5,
        right: -4,
        bottom: -12
      }
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { color: theme.palette.divider },
      categories: vendorWiseNameList,
      labels: {
        style: {
          colors: theme.palette.text.disabled,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body2.fontSize
        }
      }
    },
    yaxis: {
      labels: {
        offsetX: -15,
        formatter: val => `${formatAmountKWise(val)}`,
        style: {
          colors: theme.palette.text.disabled,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body2.fontSize
        }
      }
    },
    responsive: [
      {
        breakpoint: theme.breakpoints.values.sm,
        options: {
          plotOptions: {
            bar: { columnWidth: '60%' }
          },
          grid: {
            padding: { right: 20 }
          }
        }
      }
    ]
  };


  return (
    <Card className='factoryDashboard' style={{ boxShadow: '0px 4px 18px rgba(47, 43, 61, 0.1)' }}>
      <CardHeader title='Total Labour' subheader='Labour Wise Details' />
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 394 }}>
          <CircularProgress sx={{ color: 'lightgrey' }} />
        </Box>
      ) : (
        <CardContent>
          <ReactApexcharts type='bar' height={350} options={options} series={[{ data: yAxis }]} />
        </CardContent>
      )}
    </Card>
  );
};

export default TotalLabour;
