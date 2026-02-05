// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { checkNullUndefined } from './global';
import {  formatAmountRound } from '../../GlobalFunctions'


const AccountNHR = ({ data, bgColor}) => {
  // ** Hook
  const theme = useTheme()

  return (
    <Card  className='fs_analytics_l'  style={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)', minHeight:'115px'}}>
      <CardContent>
        <Box sx={{ gap: 2, display: 'flex', alignItems: 'stretch', justifyContent: 'space-between' }}>
          <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <Typography variant='h6' sx={{ mb: 0.75, color:bgColor,  }}>
                {data?.heading}
              </Typography>
            </div>
            <div>
              <Typography variant='h5' sx={{ mb: 0.75, color:theme?.palette?.grey[700], fontWeight:'bolder' }}>
                { 
                 data?.heading === "Revenue Per Employees" || data?.heading === "Avg. Due Debtors" ? 
                `₹ ${formatAmountRound(checkNullUndefined(data?.totalValue))}` 
                  :
                 (  data?.heading === "Labour vs Exp"
                  ? 
                  `${parseFloat(checkNullUndefined(data?.totalValue))?.toFixed(2)} %` : 
                  ( (data?.heading === "Avg. Collection Period" || data?.heading === "Avg. Overdue Deb. Days") ? 
                    `${Math.round(parseFloat(checkNullUndefined(data?.totalValue)))} Days` 
                    : 
                    ( (data?.heading?.toLowerCase() === 'fix asset laverage ratio' || data?.heading?.toLowerCase() === 'inventory turn over ratio')
                     ? ( (data?.heading?.toLowerCase() === 'fix asset laverage ratio' || data?.heading?.toLowerCase() === 'inventory turn over ratio') ?  `${Math.round(checkNullUndefined(data?.totalValue))} Times` : Math.round(checkNullUndefined(data?.totalValue))) :
                      parseFloat(checkNullUndefined(data?.totalValue))?.toFixed(2))) )
                 }
              </Typography>
    
            </div>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default AccountNHR