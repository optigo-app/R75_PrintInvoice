// // ** React Imports
// import { useState } from 'react'

// // ** MUI Components
// import Drawer from '@mui/material/Drawer'
// import List from '@mui/material/List'
// import ListItem from '@mui/material/ListItem'
// import ListItemIcon from '@mui/material/ListItemIcon'
// import ListItemText from '@mui/material/ListItemText'
// import Divider from '@mui/material/Divider'
// import IconButton from '@mui/material/IconButton'
// import MenuIcon from '@mui/icons-material/Menu'

// // ** Icons
// import HomeIcon from '@mui/icons-material/Home'
// import BarChartIcon from '@mui/icons-material/BarChart'
// import SettingsIcon from '@mui/icons-material/Settings'
// import AccountCircleIcon from '@mui/icons-material/AccountCircle'
// import { Card, CardHeader, Typography } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// const Sidebar = ({ isOpen, toggleDrawer, selectedData }) => {
//     console.log(selectedData);
//   // State to toggle drawer
// //   const [isOpen, setIsOpen] = useState(false)

//   // Function to toggle sidebar
// //   const toggleDrawer = (open) => () => {
// //     setIsOpen(open)
// //   }

//   // List of items for the sidebar
//   const menuItems = [
//     { text: 'Home', icon: <HomeIcon />, path: '/' },
//     { text: 'Analytics', icon: <BarChartIcon />, path: '/analytics' },
//     { text: 'Profile', icon: <AccountCircleIcon />, path: '/profile' },
//     { text: 'Settings', icon: <SettingsIcon />, path: '/settings' }
//   ]

//   return (
//     <div>
//       {/* Button to open sidebar */}
//       {/* <IconButton onClick={toggleDrawer(true)} edge="start" color="inherit">
//         <MenuIcon />
//       </IconButton> */}

//       {/* Sidebar Drawer */}
//       <Drawer anchor="left" open={isOpen} onClose={toggleDrawer(false)}>
//             {/* <div style={{display:'flex', justifyContent:'flex-end', padding:'5px', cursor:'pointer'}} ><CloseIcon onClick={() => toggleDrawer(false)} /></div> */}
//         <Card style={{width:'300px', boxShadow:'none', boxSizing:'border-box'}} sx={{p:2}}>
//             {/* <CardHeader> */}
//                 <Typography className='fs_analytics_l' sx={{py:3}} variant='h2'>Ticket No : {selectedData?.Ticket}</Typography>
//             {/* </CardHeader> */}
            
//             <Typography className='fs_analytics_l' sx={{py:1}}>Time : <b>{selectedData?.Time} hours</b></Typography>
//             <Typography className='fs_analytics_l' sx={{py:1}}>Date : <b>{selectedData?.Date} </b></Typography>
//             <Typography className='fs_analytics_l' sx={{py:1}}>Training Mode : <b>{selectedData?.TrainingMode}</b></Typography>
//             <Typography className='fs_analytics_l' sx={{py:1}}>Training Type : <b>{selectedData?.TrainingType}</b></Typography>
//             <Typography className='fs_analytics_l' style={{wordBreak:'break-word'}}>Remarks : <br></br>&nbsp;&nbsp;{selectedData?.Details}</Typography>
//         </Card>
//         {/* <List sx={{ width: 250 }}>
//           {menuItems?.map((item, index) => (
//             <ListItem button key={index}>
//               <ListItemIcon>{item.icon}</ListItemIcon>
//               <ListItemText primary={item.text} />
//             </ListItem>
//           ))}
//           <Divider />
//         </List> */}
//       </Drawer>
//     </div>
//   )
// }

// export default Sidebar;


import Drawer from '@mui/material/Drawer'
import { Card, Typography, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Sidebar = ({ isOpen, toggleDrawer, selectedData, setIsSidebarOpen }) => {
  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Analytics', icon: <BarChartIcon />, path: '/analytics' },
    { text: 'Profile', icon: <AccountCircleIcon />, path: '/profile' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' }
  ];
  const handleDrawerClose = () => {
    toggleDrawer(false); // Close the drawer when the close icon is clicked
    setIsSidebarOpen(false);
  };
  return (
    <div>
      {/* Sidebar Drawer */}
      <Drawer anchor="right" open={isOpen} onClose={toggleDrawer(false)}>
        {/* Close Button */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '10px',
            cursor: 'pointer',
          }}
          onClick={handleDrawerClose}
        >
          <CloseIcon style={{ fontSize: '2rem', color: '#333' }} />
        </div>

        {/* Card with Styling */}
        <Card
          style={{
            width: '500px',
            boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            backgroundColor: '#fafafa',
            padding: '20px',
            maxHeight: '100vh',  // Limit the height of the Card
            overflowY: 'auto', 
          }}
        >
          {/* <Typography
            variant="h5"
            sx={{ py: 2, fontWeight: 'bold', color: '#1976d2' }}
          >
            Ticket No : {selectedData?.Ticket}
          </Typography> */}
           <Typography
        variant="h5"
        sx={{
          py: 2,
          fontWeight: 'bold',
          color: '#1976d2',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          fontSize: '1.25rem',
          borderBottom: '2px solid #1976d2',
          paddingBottom: '10px'
        }}
      >
        Ticket No: {selectedData?.Ticket}
      </Typography>
      <Divider sx={{  backgroundColor: '#1976d2' }} />

          {/* <Typography sx={{ py: 1, fontSize: '1rem' }}>
            Time: <b>{selectedData?.Time} hours</b>
          </Typography>
          <Typography sx={{ py: 1, fontSize: '1rem' }}>
            Date: <b>{selectedData?.Date}</b>
          </Typography>
          <Typography sx={{ py: 1, fontSize: '1rem' }}>
            Training Mode: <b>{selectedData?.TrainingMode}</b>
          </Typography>
          <Typography sx={{ py: 1, fontSize: '1rem' }}>
            Training Type: <b>{selectedData?.TrainingType}</b>
          </Typography> */}
          {/* <Typography sx={{ py: 1, fontSize: '1rem', fontWeight: '500', color: '#555' }}>
          <span style={{ color: '#1976d2' }}>Time:</span> <b>{selectedData?.Time} hours</b>
        </Typography>
        <Typography sx={{ py: 1, fontSize: '1rem', fontWeight: '500', color: '#555' }}>
          <span style={{ color: '#1976d2' }}>Date:</span> <b>{selectedData?.Date}</b>
        </Typography>
        <Typography sx={{ py: 1, fontSize: '1rem', fontWeight: '500', color: '#555' }}>
          <span style={{ color: '#1976d2' }}>Training Mode:</span> <b>{selectedData?.TrainingMode}</b>
        </Typography>
        <Typography sx={{ py: 1, fontSize: '1rem', fontWeight: '500', color: '#555' }}>
          <span style={{ color: '#1976d2' }}>Training Type:</span> <b>{selectedData?.TrainingType}</b>
        </Typography> */}
          <Typography sx={{ py: 1, fontSize: '1rem', wordBreak: 'break-word' }}>
            {/* <span style={{ color: '#1976d2' }}>Remarks:</span>  <br /> */}
            <span style={{ paddingLeft: '20px' }} dangerouslySetInnerHTML={{__html:selectedData?.Details}}>
              {/* {selectedData?.Details} */}
            </span>
          </Typography>
        </Card>

        {/* Side Menu List with Icons */}
        {/* <List sx={{ marginTop: '20px' }}>
          {menuItems.map((item, index) => (
            <ListItem
              button
              key={index}
              sx={{
                padding: '10px',
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: '#1976d2',
                  color: '#fff',
                },
              }}
            >
              <ListItemIcon>
                <div
                  style={{
                    fontSize: '1.5rem',
                    color: '#1976d2',
                  }}
                >
                  {item.icon}
                </div>
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#333',
                }}
              />
            </ListItem>
          ))}
        </List> */}
      </Drawer>
    </div>
  );
};

export default Sidebar;