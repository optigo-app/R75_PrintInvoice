// ** Next Import
// import dynamic from 'next/dynamic'
import React from 'react';

// ! To avoid 'Window is not defined' error
// const ReactApexcharts = dynamic(() => import('react-apexcharts'), { ssr: false })
const ReactApexcharts = React.lazy(() => import('react-apexcharts'))

export default ReactApexcharts
