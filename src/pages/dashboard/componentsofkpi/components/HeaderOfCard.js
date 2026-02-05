import { Card, Typography, useTheme } from '@mui/material';
import React from 'react'

const HeaderOfCard = ({headerName, bgColor, color}) => {
  const theme = useTheme();
  return (
    <>
    <Card className='fs_analytics_l'  style={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)', backgroundColor:bgColor}}>
        <Typography style={{display:'flex', justifyContent:'center'}} sx={{p:1,  color:color}}>{headerName}</Typography>
    </Card>
    </>
  )
}

export default HeaderOfCard;
// import { Card, Typography, useTheme } from '@mui/material';
// import React from 'react'

// const HeaderOfCard = ({headerName, bgColor}) => {
//   const theme = useTheme();
//   return (
//     <>
//     <Card className='fs_analytics_l'  style={{boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)', backgroundColor:bgColor}}>
//         <Typography style={{display:'flex', justifyContent:'center'}} sx={{p:1, fontWeight:'bold', color:'white'}}>{headerName}</Typography>
//     </Card>
//     </>
//   )
// }

// export default HeaderOfCard