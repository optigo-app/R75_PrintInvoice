import { Alert, Box, Button, Card, Chip, Snackbar, Typography, useTheme } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import "./homepage.css"
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';
import { cloneDeep } from 'lodash';
import { Height } from '@mui/icons-material';
const HomePage = ({Token}) => {
    const theme = useTheme();
    const [viewDetailsFlag, setViewDetailsFlag] = useState(false);
    const [activeButton, setActiveButton] = useState('Design'); 

    const [searchVal, setSearchVal] = useState('');
    const [result, setResult] = useState([]);
    const [totalDesignCount, setTotalDesignCount] = useState();
    const [totalTagDesignCount, setTotalTagDesignCount] = useState();
    const [totalDesignSetCount, setTotalDesignSetCount] = useState();

    const [showFlag, setShowFlag] = useState(false);

    const [loader, setLoader] = useState(false);

    const ref = useRef();
    
    
    const buttonStyles = (buttonName) => ({
        mx: 1,
        py: 1,
        backgroundColor:
          activeButton === buttonName
            ? theme?.palette?.customColors?.btnThemeColor // Active button color
            : theme?.palette?.customColors?.btngrpThemeColor, // Inactive button color
        color:
          activeButton === buttonName
            ? 'white' // Active button text color
            : theme?.palette?.customColors?.btnFontThemeColor, // Inactive button text color
        boxShadow: 'none',
        borderRadius: '12px',
        '&:hover': {
          backgroundColor:
            activeButton === buttonName
              ? theme?.palette?.customColors?.btnThemeColor // Keep the hover effect for active button
              : theme?.palette?.customColors?.btngrpThemeColor, // Hover for inactive button
        },
    });

      const handleSearch = (e) => {
        setSearchVal(e.target.value);
      }

      const handleApply = () => {
        fetchData(searchVal);
        setViewDetailsFlag(true);
      }

      const fetchData = async (val) => {
        try {
          setLoader(true);
          let apiUrl = '';
          if(window.location?.hostname?.toLowerCase() === 'zen' || window.location?.hostname?.toLowerCase() === 'nzen' || window.location?.hostname?.toLowerCase() === 'localhost'){
            apiUrl = "http://nzen/jo/api-lib/App/BranchProductSearch";
          }else{
            apiUrl = "https://view.optigoapps.com/linkedapp/App/BranchProductSearch";
          }

          const body = {
              "Token" : `${Token}`
              ,"ReqData":`[{\"Token\":\"${Token}\",\"Evt\":\"ProductStock\",\"SearchBy\":\"${activeButton}\",\"SearchValue\":\"${val}\"}]`
            }

          const response = await axios.post(apiUrl, body);
          
          if(response?.data?.Status === "200"){
            setLoader(false);
            loadData((response?.data?.Data?.DT || []), (response?.data?.Data?.DT1 || []), (response?.data?.Data?.DT2 || []));
          }else{
            setLoader(false);
          }
        } catch (error) {
          console.log(error);
          setLoader(false);
          setMessage("Some Error Occured!");
          setOpen(true);
        }
      }

      const loadData = (dt, dt1, dt2) => {

        let resultArray = [];

        dt?.forEach((e) => {
          let nestedDetails = [];
          dt1?.forEach((el) => {
            if(e?.BrachName === el?.BrachName){
              nestedDetails.push(el);
            }
          })
          let obj = cloneDeep(e);

          obj.branchDetails = nestedDetails;
          resultArray.push(obj);
        });

        
        
        let result = resultArray?.filter((e) => e?.branchDetails?.length > 0);

        // let finalArray = [];

        // result?.forEach((a, i) => {
        //   let obj = {...a};

        //   obj.excludeDesigns = [];
        //   obj?.branchDetails?.forEach((al) => {
            
        //     if(al?.BrachName === obj?.BrachName){
              
        //         dt2?.forEach((e) => {
                  
        //           if(e?.designno !== al?.designno){
                    
        //             obj.excludeDesigns.push(e?.designno);

        //           }

        //         })

        //       }
        //   })
          
        //   finalArray.push(obj);

        // });

        let finalArray = [];

        result?.forEach((a) => {
          let obj = { ...a };

          obj.excludeDesigns = [];

          // Loop through the available designs (dt2) for each branch
          dt2?.forEach((e) => {
            // Check if this design is not present in the current branch's branchDetails
            const isDesignInBranch = obj?.branchDetails?.some((al) => al?.designno === e?.designno);
            
            // If the design does not exist in branchDetails, add it to excludeDesigns
            if (!isDesignInBranch) {
              obj.excludeDesigns.push(e?.designno);
            }
          });

          finalArray.push(obj);
        });

        let totalDesignCount = 0;
        let obj = {
          totalDesignCount : 0,
          designno : ''
        }
        let obj2 = {
          totalDesignCount : 0,
          designnoArr : []
        }
        finalArray?.forEach((a) => {
          a?.branchDetails?.forEach((al) => {
            if(al?.designno){
              totalDesignCount += 1;
              obj.totalDesignCount += 1;
              obj.designno = al?.designno;
              obj2.totalDesignCount += 1;
              obj2.designnoArr = dt2?.map((e) => e?.designno);
            }
          })
        })
        obj2.designnoArr = [...new Set(obj2?.designnoArr)];
        setTotalDesignCount(totalDesignCount);
        setTotalTagDesignCount(obj);
        setTotalDesignSetCount(obj2);


        if(finalArray?.length > 0){
          setShowFlag(true);
        }

        setResult(finalArray);

        console.log(finalArray);
        

        if(finalArray?.length === 0){
          setMessage("Data Not Present");
          setOpen(true); 
        }

        // result?.forEach((branch) => {
        //   // Initialize excludesDesigns as an empty array
        //   let obj = {...branch};
        //   obj.excludesDesigns = [];
          
        //   obj?.branchDetails?.forEach((a) => {
        //     dt2?.forEach((al) => {
        //       if(a?.designno !== al?.designno && a?.BrachName === obj?.BrachName){
        //         obj.excludesDesigns.push(al?.designno);
        //       }
        //     })
        //   })
        //   finalArray.push(obj);
  
        // });
      

        // let finalArray2 = [];

        // finalArray?.forEach((a) => {
        //   let obj = {...a};

        //   if(a?.excludesDesigns?.length === dt2?.length){
        //     obj.excludesDesigns = [];
        //   }
        //   finalArray2.push(obj);
        // })
        
        // setResult(finalArray2);
        
        
      }

      // const loadData = (dt, dt1, dt2) => {

      //   let resultArray = dt?.map((e) => {
      //     let nestedDetails = dt1?.filter((el) => el?.BrachName === e?.BrachName);
      //     return { ...e, branchDetails: nestedDetails };
      //   }).filter((e) => e?.branchDetails?.length > 0);
      
      //   let finalArray = resultArray?.map((branch) => {
      //     let obj = { ...branch, excludeDesigns: [] };
          
      //     branch?.branchDetails?.forEach((a) => {
      //       dt2?.forEach((al) => {
      //         if ((!al?.designno?.includes(a?.designno)) && a?.BrachName === obj?.BrachName) {
      //           obj.excludeDesigns.push(al?.designno);
      //         }
      //       });
      //     });
      //     return obj;
      //   });
      
      //   let finalArray2 = finalArray?.map((a) => {
      //     if (a?.excludeDesigns?.length === dt2?.length) {
      //       a.excludeDesigns = [];
      //     }
      //     return a;
      //   });
      
      //   setResult(finalArray2);
      //   console.log(finalArray2, dt2);
        
      // };
      
      useEffect(() => {
        setResult([]);
        setSearchVal('');
        setShowFlag(false);

        if(activeButton === "design" || activeButton === "tagno"){
          setViewDetailsFlag(true);
        }else{
          setViewDetailsFlag(false);
        }

        ref.current.focus();

        setTotalDesignCount();
        setTotalDesignSetCount();
        setTotalTagDesignCount();

      },[activeButton]);

      const [open, setOpen] = useState(false);
      const [message, setMessage] = useState('');
    
      // Handle open and close of Snackbar
      const handleClickMSG = (msg) => {
        setMessage(msg);
        setOpen(true);
      };
    
      const handleCloseMSG = () => {
        setOpen(false);
      };

      const handleKeyDown = (e) => {
        if(e?.key?.toLowerCase() === "enter"){
          if(searchVal){
            fetchData(searchVal);
          }
        }
      }

  return (
    <div className='theme_fs_brs hp_container'>
        <Typography align='center'  sx={{color:theme?.palette?.customColors?.btnFontThemeColor, py:1}}>Search your design by designno / tagno / designset</Typography>
      
      <Box sx={{display:'flex', justifyContent:'center', alignItems:'center', }}>
        <Button
          variant="contained"
          sx={buttonStyles('Design')}
          className="theme_fs_brs"
          onClick={() => {
            setActiveButton('Design');
            setViewDetailsFlag(false);  // No effect on viewDetailsFlag for Design
          }}
        >
          Design
        </Button>
        <Button
          variant="contained"
          sx={buttonStyles('TagNo')}
          className="theme_fs_brs"
          onClick={() => {
            setActiveButton('TagNo'); 
            setViewDetailsFlag(false);  // No effect on viewDetailsFlag for TagNo
          }}
        >
          Tag No
        </Button>
        <Button
          variant="contained"
          sx={buttonStyles('DesignSet')}
          className="theme_fs_brs"
          onClick={() => {
            setActiveButton('DesignSet');
            setViewDetailsFlag(false);  // Initially hide the cards for DesignSet
          }}
        >
          Design Set
        </Button>
      </Box>
      <Box style={{display:'flex', justifyContent:'center', alignItems:'center', width:'100%'}} sx={{my:2}}>
        <input type="text" className='input_field_hp' autoFocus ref={ref} 
        placeholder={
          activeButton === "Design" ? "NCKB002" :
          activeButton === "TagNo" ? "1/179" :
          activeButton === "DesignSet" ? "DesSet1" :
          "" // Default placeholder if no conditions are met
        }
        
           value={searchVal} 
           disabled={loader} 
           onChange={(e) => handleSearch(e)}
           onKeyDown={(e) => handleKeyDown(e)}
            /> 
        <Button variant='contained' 
          onClick={() => handleApply()}
          disabled={loader || (searchVal === '')}
          sx={{backgroundColor:theme?.palette?.customColors?.purple, py:1.2, ml:1, borderRadius:'10px'}}
        >Apply</Button>
      </Box>
      { ( showFlag && activeButton === "Design") &&  <Box sx={{display:'flex', justifyContent:'center', alignItems:'center'}}>
          <Typography sx={{color:theme?.palette?.customColors?.btnFontThemeColor, fontWeight:'600', minWidth:'21rem'}} variant='h5'>Total Design Available: {totalDesignCount}</Typography>
        </Box>}
      { (showFlag && activeButton === "TagNo") &&  <Box sx={{display:'flex', justifyContent:'center', alignItems:'center'}}>
          <Typography sx={{color:theme?.palette?.customColors?.btnFontThemeColor, fontWeight:'600', minWidth:'21rem'}} variant='h5'>Total Design Available: {totalTagDesignCount?.totalDesignCount} ({totalTagDesignCount?.designno})</Typography>
        </Box>}
      { ( showFlag && activeButton === "DesignSet") &&  <Box sx={{display:'flex', justifyContent:'center', alignItems:'center'}}>
          <Typography sx={{color:theme?.palette?.customColors?.btnFontThemeColor, fontWeight:'600', minWidth:'21rem'}} variant='h5'>Total Set Available: {totalDesignSetCount?.totalDesignCount} ({totalDesignSetCount?.designnoArr?.join(",")})</Typography></Box>}
      <Box sx={{display:'flex', justifyContent:'center', alignItems:'center', width:'100%'}}>
        <Box my={2} sx={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            {/* { activeButton?.toLowerCase() === "designset" && <Box sx={{display:'flex', justifyContent:'center', alignItems:'center'}} marginRight={12}>
                <Typography sx={{color:theme?.palette?.customColors?.btnFontThemeColor}} variant='h6'>Selected Design</Typography>
                <Button variant='contained' sx={{color:theme?.palette?.customColors?.btnFontThemeColor, backgroundColor:theme?.palette?.customColors?.btngrpThemeColor, mx:1}}>LR-125(5)</Button>
                <Button variant='contained' sx={{color:theme?.palette?.customColors?.btnFontThemeColor, backgroundColor:theme?.palette?.customColors?.btngrpThemeColor, mx:1}}>LR-125(5)</Button>
            </Box>} */}
            {/* { activeButton?.toLowerCase() === "designset" && <Button
                variant="contained"
                sx={{
                    color: 'white', // Set the text color to white
                    fontWeight: 'bold', // Make the text bold
                    background: 'linear-gradient(to right, #D26CF3, #9A63FC)', // Apply the gradient
                    mx: 1, // Add horizontal margin
                    '&:hover': {
                    background: 'linear-gradient(to right, #C55DE9, #8C5BEF)', // Optional: Slightly different gradient on hover
                    },
                }}
                onClick={() => setViewDetailsFlag(!viewDetailsFlag)}
                >
                { !viewDetailsFlag ? 'HIDE' : 'VIEW' } DETAILS
            </Button>} */}
        </Box>
      </Box>
      {  <Box sx={{display:'flex', flexWrap:'wrap', justifyContent:"flex-start", alignItems:'flex-start', padding:"0px 15px"}} mt={1} mb={6}>
      {
       result?.map((e, i) => {
            return <Card sx={{boxShadow: '0 4px 20px rgba(0, 0, 0, 0.00)', border:"1px solid #e8e8e8",borderRadius:'16px', width:"30rem", m:1 }} key={i}  >
            <Typography variant='h5' p={1} my={2} mt={1} ml={1}>{e?.BrachName}</Typography>        
            <Box py={2} px={2}>
                <div style={{textWrap:'wrap', wordBreak:'break-word', color:theme?.palette?.customColors?.btnFontThemeColor}}>{e?.CompanyAddress}{e?.CompanyAddress2}</div>
                <div style={{textWrap:'wrap', wordBreak:'break-word', color:theme?.palette?.customColors?.btnFontThemeColor}}>{e?.CompanyCity}, {e?.CompanyPinCode}, { e?.CompanyTellNo === "" ? '' : "T -"} {e?.CompanyTellNo}</div>
            </Box>
            { activeButton === "DesignSet" && <Box sx={{backgroundColor:theme?.palette?.customColors?.cardBgThemeColor, pt:0.5, pb:0.5, px:1}} >
              <Typography variant='h6' sx={{color:theme?.palette?.secondary?.main, fontWeight:'bold'}} pt={2} px={1}>
                 <>SETS AVAILABLE - {e?.branchDetails?.length}</>
              </Typography>
            </Box>}
            { (activeButton === "DesignSet"  && e?.excludeDesigns?.length > 0) && <Box sx={{backgroundColor:theme?.palette?.customColors?.cardBgThemeColor, pt:0, pb:0.5, px:1}} >
              <Typography variant='h6' sx={{color:theme?.palette?.secondary?.main, fontWeight:'bold'}} pt={1} px={1}>
                 <><span style={{color:theme?.palette?.customColors?.purple}}>EXCLUDES&nbsp;&nbsp;-&nbsp;&nbsp;</span><span style={{color:theme?.palette?.warning?.main}}>{e?.excludeDesigns?.join(",")}</span></>
              </Typography>
            </Box>}

            {
              e?.branchDetails?.map((el, ind) => {
                return <Box  sx={{backgroundColor:theme?.palette?.customColors?.cardBgThemeColor}} p={1} key={ind}>
                <Box sx={{backgroundColor:'white', borderRadius:'8px', display:'flex', justifyContent:'space-between', alignItems:'center'}} p={1} m={1}>
                    <div>
                        <div style={{display:'flex', justifyContent:'flex-start', alignItems:'center'}}>
                            <Typography variant='h6' sx={{color:theme?.palette?.primary?.main}} mr={1}>{el?.designno}&nbsp;</Typography>
                            <Typography variant='h6' style={{color:theme?.palette?.customColors?.secondary?.main}}>({el?.TotalDesign})</Typography>
                        </div>
                        <Typography mt={0.5} style={{color:theme?.palette?.customColors?.btnFontThemeColor, marginBottom:'4px', fontWeight:'bolder'}}>
                          {el?.Metal_Purity_Name} {el?.MetalColorName} {el?.Metal_Type_Name} {el?.DQuality + `${el?.DQuality === '' || el?.DColor === '' ? '' :  "-" }` +el?.DColor}</Typography>
                    </div>
                    <div>
                        <div className='custom_chip_hp'>
                          <CheckCircleIcon fontSize='xs' color='success' sx={{mr:1}} />
                          <span style={{color:'grey'}}>SIZE {el?.JewellerySize}</span>&nbsp;-&nbsp; {el?.JewellerySize === '' && ''} AVAILABLE
                        </div>
                    </div>
                </Box>
            </Box>
              })
            }
          </Card>
        })
       } 
      </Box>}

      <Snackbar open={open} autoHideDuration={3000} onClose={handleCloseMSG} 
        anchorOrigin={{
          vertical: 'center',  // Position it at the top of the screen
          horizontal: 'center',  // Align it horizontally to the center
        }}
        sx={{
          position: 'absolute',  // Ensure it's positioned absolutely in relation to the screen
          top: '50%',  // Center vertically
          left: '50%',  // Center horizontally
          transform: 'translate(-50%, -50%)',  // Adjust positioning to perfectly center
          marginBottom:'50%',
          fontWeight:'bold',
        }}
        
        >
        <Alert onClose={handleCloseMSG} severity="error" sx={{ width: '100%', fontSize:'1rem', fontWeight:'bold' }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default HomePage
