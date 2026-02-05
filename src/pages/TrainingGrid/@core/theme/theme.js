import { createTheme } from '@mui/material/styles';

import typography from "./typography/index"
import paletteFile from "./palette/index"
let mode = 'light'
const whiteColor = '#FFF'
const lightColor = '#2F2B3D'
const darkColor = '#D0D4F1'
const darkPaperBgColor = '#2F3349'
const mainColor = mode === 'light' ? lightColor : darkColor;
const customTheme = createTheme({
  palette: {
    ...paletteFile,
    customColors: {
      dark: darkColor,
      main: mainColor,
      light: lightColor,
      lightPaperBg: whiteColor,
      darkPaperBg: darkPaperBgColor,
      bodyBg: mode === 'light' ? '#F8F7FA' : '#25293C',
      trackBg: mode === 'light' ? '#F1F0F2' : '#363B54',
      avatarBg: mode === 'light' ? '#DBDADE' : '#4A5072',
      tableHeaderBg: mode === 'light' ? '#F6F6F7' : '#4A5072',
      purple:'#7367F0',
      info:'#00CFE8',
      green:'#2CC872',
      grey:'#A8AAAE',
      red:'#EA5455',
      orange:'#FF9F43',
      lightBgOrange:'#FFF0E1',
      lightBgGrey:'#F1F1F2',
      littlelightBgGrey:'#F1F1F2',
      lightBgGreen:'#DCF6E8',
      lightBgInfo:'#D6F7FB',
      lightBgPurple:'#E8E7FD',
      littlelightBgPurple:'#A49CF5',
      lightBgRed:'#FCE4E4',


    },

  },
  typography: {
    ...typography
  },
 
  
  // Add more custom theme settings here
});

export default customTheme;