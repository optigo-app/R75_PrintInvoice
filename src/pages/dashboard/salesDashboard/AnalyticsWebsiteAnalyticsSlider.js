// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Badge from '@mui/material/Badge'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

// ** Third Party Components
import clsx from 'clsx'
import { useKeenSlider } from 'keen-slider/react'

// ** Custom Components Imports
// import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomAvatar from '../@core/components/mui/avatar'
// import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { hexToRGBA } from '../@core/utils/hex-to-rgba';

import "./chartcss/analytics.css";

// import imgIcon from "../../src/images/cards/graphic-illustration-1.png" 
import imgIcon from "../images/cards/graphic-illustration-1.png" 

const data = [
  {
    title: 'Traffic',
    img: '/images/cards/graphic-illustration-1.png',
    details: {
      Sessions: '28%',
      'Page Views': '3.1k',
      Leads: '1.2k',
      Conversions: '12%'
    }
  },
  {
    title: 'Spending',
    img: '/images/cards/graphic-illustration-2.png',
    details: {
      Spend: '12h',
      Orders: '18',
      Order: '127',
      Items: '2.3k'
    }
  },
  {
    title: 'Revenue Sources',
    img: '/images/cards/graphic-illustration-3.png',
    details: {
      Direct: '268',
      Organic: '890',
      Referral: '62',
      Campaign: '1.2k'
    }
  }
]

const Slides = ({ theme }) => {

  return (
    <>
      {data.map((slide, index) => {
        return (
          <Box
            key={index}
            className='keen-slider__slide'
            sx={{ p: 2, '& .MuiTypography-root': { color: 'common.white' }, width:'100% !important' }}
          >
            <Typography variant='h4' className='fs_analytics_l' sx={{ mb: 0 }}>
              Website Analytics
            </Typography>
            <Typography variant='body2' sx={{ pb: 2 }} className='fs_analytics_l'>
              Total 28.5% Conversion Rate
            </Typography>
            <Grid container>
              <Grid item xs={12} sm={8} sx={{ order: [2, 1] }}>
                <Typography variant='h5' sx={{ pb: 3 }} className='fs_analytics_l'>
                  {slide.title}
                </Typography>
                <Grid container spacing={3.5}>
                  {Object.keys(slide.details).map((key, index) => {
                    return (
                      <Grid item key={index} xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CustomAvatar
                            color='primary'
                            variant='rounded'
                            sx={{
                              mr: 2,
                              width: 48,
                              height: 30,
                              fontWeight: 500,
                              color: 'common.white',
                              // backgroundColor: 'primary.dark'
                              backgroundColor: '#655BD3'
                            }}
                            className='fs_analytics_l'
                          >
                            {slide.details[key]}
                          </CustomAvatar>
                          <Typography noWrap className='fs_analytics_l'>{key}</Typography>
                        </Box>
                      </Grid>
                    )
                  })}
                </Grid>
              </Grid>
              <Grid
                item
                xs={12}
                sm={4}
                sx={{
                  order: [1, 2],
                  textAlign: 'center',
                  objectFit:'contain'
                  // position: 'relative', // Change to relative
                  // '& img': {
                  //   height: '160px !important',
                  //   width: 'auto !important', // Avoid setting max-width to 'none'
                  // }
                }}
              >
                <img src={slide.img} style={{width:'50%', objectFit:'contain'}} alt={slide.title} />
                {/* <img src={imgIcon} style={{width:'50%', objectFit:'contain'}} alt={slide.title} /> */}
              </Grid>
              {/* <Grid
                item
                xs={12}
                sm={4}
                sx={{
                  order: [1, 2],
                  textAlign: 'center',
                  '& img': {
                    height: '160px !important',
                    maxWidth: 'none !important',
                    [theme.breakpoints.up('sm')]: {
                      top: '50%',
                      position: 'absolute',
                      right: theme.spacing(10),
                      transform: 'translateY(-50%)'
                    }
                  }
                }}
              >
                <img src={slide.img} alt={slide.title} />
              </Grid> */}
            </Grid>
          </Box>
        )
      })}
    </>
  )
}

const AnalyticsWebsiteAnalyticsSlider = () => {
  // ** States
  const [loaded, setLoaded] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  // ** Hook
  const theme = useTheme()

  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: true,
      initial: 0,
      rtl: theme.direction === 'rtl',
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel)
      },
      created() {
        setLoaded(true)
      }
    },
    [
      slider => {
        let mouseOver = false
        let timeout

        const clearNextTimeout = () => {
          clearTimeout(timeout)
        }

        const nextTimeout = () => {
          clearTimeout(timeout)
          if (mouseOver) return
          timeout = setTimeout(() => {
            slider.next()
          }, 4000)
        }
        slider.on('created', () => {
          slider.container.addEventListener('mouseover', () => {
            mouseOver = true
            clearNextTimeout()
          })
          slider.container.addEventListener('mouseout', () => {
            mouseOver = false
            nextTimeout()
          })
          nextTimeout()
        })
        slider.on('dragStarted', clearNextTimeout)
        slider.on('animationEnded', nextTimeout)
        slider.on('updated', nextTimeout)
      }
    ]
  )
  return (
    // <Card sx={{ position: 'relative', backgroundColor: 'primary.main' }}>
    <Card sx={{ position: 'relative', backgroundColor: '#7367F0', boxShadow:'0px 4px 18px 0px rgba(47, 43, 61, 0.1)',}}>
      {loaded && instanceRef.current && (
        <Box className='swiper-dots' sx={{ top: 4, right: 6, position: 'absolute' }}>
          {[...Array(instanceRef.current.track.details.slides.length).keys()].map(idx => {
            return (
              <Badge
                key={idx}
                variant='dot'
                component='div'
                className={clsx({ active: currentSlide === idx })}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                sx={{
                  mr: `${theme.spacing(3.5)} !important`,
                  '& .MuiBadge-dot': {
                    width: '8px !important',
                    height: '8px !important',
                    // backgroundColor: `${hexToRGBA(theme.palette.common.white, 0.4)} !important`
                    backgroundColor: `${(theme.palette.common.white)} !important`
                  },
                  '&.active .MuiBadge-dot': {
                    backgroundColor: `${theme.palette.common.white} !important`
                  }
                }}
              />
            )
          })}
        </Box>
      )}
      {/* <Box ref={sliderRef} className='keen-slider'> */}
      <Box ref={sliderRef} className='keen-slider'>
        <Slides theme={theme} />
      </Box>
    </Card>
  )
}

export default AnalyticsWebsiteAnalyticsSlider
