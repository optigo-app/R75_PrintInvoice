import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid } from '@mui/x-data-grid'
import CustomTextField from '../@core/components/mui/text-field'
import CustomAvatar from '../@core/components/mui/avatar'
import "./chartcss/analyticsproject.css"
import imgIcon from "../images/avatars/1.png"
import { fetchDashboardData, formatAmount, formatAmountKWise } from '../GlobalFunctions';

// ** renders name column
const renderName = row => {
  if (row.avatar) {
    // return <CustomAvatar src={row.avatar} sx={{ mr: 2.5, width: 38, height: 38 }} />
    return <CustomAvatar src={imgIcon} sx={{ mr: 2.5, width: 38, height: 38 }} />
  } else {
    return (
      <>
      </>
    )
  }
}



const MetalWiseSaleAmount = ({ tkn, fdate, tdate, country, MetalTypeColorWiseSaleData, IsEmpLogin }) => {
  // ** State
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [value, setValue] = useState('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })
  const [totalRows, setTotalRows] = useState(0);

  const [apiData, setApiData] = useState([]);

  const columns = [
    {
      flex: 0.1,
      field: 'MetalType',
      minWidth: 220,
      headerName: 'METAL',
      renderCell: ({ row }) => {
        const { MetalType, MetalColor } = row
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderName(row)}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {MetalType}
              </Typography>
              <Typography noWrap variant='body2' sx={{ color: 'text.disabled', textTransform: 'capitalize' }}>
                {MetalColor}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      field: 'Qty',
      minWidth: 80,
      headerName: 'QTY',
      renderCell: ({ row }) => (
        <Typography sx={{ color: 'text.secondary' }}>{row?.Quantity}</Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 105,
      field: 'SaleAmount',
      headerName: 'SALE AMOUNT',
      renderCell: ({ row }) => <Typography sx={{ color: 'text.secondary' }}>{formatAmountKWise((row?.SaleAmount / (+country)))}</Typography>
    },
    {
      flex: 0.1,
      field: 'NetWt',
      minWidth: 120,
      sortable: false,
      headerName: 'NETWT',
      renderCell: ({ row }) => (
        <Typography sx={{ color: 'text.secondary' }}>{(row?.NetWt)?.toFixed(3)}</Typography>
      )
    },
    ...(
      IsEmpLogin === 0 ? [
        {
          flex: 0.1,
          minWidth: 150,
          field: 'ProfitPer',
          headerName: 'PROFIT (%)',
          renderCell: ({ row }) => (
            <>
              <Typography sx={{ color: 'text.secondary' }}>{`${row?.ProfitPer}%`}</Typography>
            </>
          )
        }] : []
    )
  ]

  useEffect(() => {

    const fetchData = async () => {
      try {
        setApiData(MetalTypeColorWiseSaleData);
        setFilteredData(MetalTypeColorWiseSaleData);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [MetalTypeColorWiseSaleData, country]);

  const paginatedData = filteredData?.slice(
    paginationModel.page * paginationModel.pageSize,
    (paginationModel.page + 1) * paginationModel.pageSize
  )


  const handleFilter = val => {
    setPaginationModel({ ...paginationModel, page: 0 });

    setValue(val);

    const filteredData = MetalTypeColorWiseSaleData?.filter((item) => {
      const metalType = item.MetalType?.toLowerCase();
      const metalColor = item.MetalColor?.toLowerCase();
      const saleAmt = ((item.SaleAmount))?.toString()?.toLowerCase();
      const netWt = item.NetWt?.toString()?.toLowerCase();
      const profitPer = item.ProfitPer?.toString()?.toLowerCase();
      const searchVal = val?.toLowerCase();

      return (
        metalType?.includes(searchVal) ||
        saleAmt?.includes(searchVal) ||
        netWt?.includes(searchVal) ||
        profitPer?.includes(searchVal) ||
        metalColor?.includes(searchVal)
      );
    });
    setFilteredData(filteredData);
  };

  return data ? (
    <Card className='fs_analytics_l tableHeight' style={{ boxShadow: '0px 4px 18px 0px rgba(47, 43, 61, 0.1)', minHeight: '36.45rem', }}>
      <CardHeader
        title='Metal Wise Sale Amount'
        titleTypographyProps={{ sx: { mb: [2, 0] } }}
        action={<CustomTextField value={value} placeholder='Search' style={{ boxShadow: 'none', border: '1px solid #e8e8e8' }} onChange={e => handleFilter(e.target.value)} />}
        sx={{
          py: 2.5,
          flexDirection: ['column', 'row'],
          '& .MuiCardHeader-action': { m: 0 },
          alignItems: ['flex-start', 'center']
        }}
      />
      <DataGrid
        rows={filteredData}
        columns={columns}
        disableRowSelectionOnClick
        className="fs_analytics_l kayradashboard"
        rowHeight={71}
        getRowId={(row) => row?.SrNo}
        sx={{
          '& .MuiDataGrid-cell:focus': {
            outline: 'none',
          },
        }}
      />
    </Card>
  ) : null
}

export default MetalWiseSaleAmount
