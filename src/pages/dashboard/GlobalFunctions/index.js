import axios from "axios";

export function formatAmount(amount, round = false) {
  if (round) {
    return Math.round(amount).toLocaleString('en-IN');
  } else {
    return Number(amount).toFixed(2).toLocaleString('en-IN');
  }
}
  export function formatAmountRound(amount) {
    // Round the amount to the nearest integer
    const roundedAmount = Math.round(+amount);
  
    // Format the rounded amount with commas
    const formattedAmount = roundedAmount.toLocaleString('en-IN');
  
    return formattedAmount;
  }


  export const fetchDashboardData = async (token, hostName, fdate, tdate, event, sales, office, customer, country, LId, IsPower) => {
    try {
      let apiUrl_kayra = '';
  
      if (hostName?.toLowerCase() === 'zen' || hostName?.toLowerCase() === 'nzen' || hostName?.toLowerCase() === 'localhost') {
        apiUrl_kayra = 'http://nzen/jo/api-lib/App/DashBoard';
      } else {
        apiUrl_kayra = 'https://view.optigoapps.com/linkedapp/App/DashBoard';
      }
  
      const requestData = [
        {
          Token: token,
          Evt: event,
          LoginId: LId,
          FDate: fdate,
          TDate: tdate,
          LockerId: office,
          SaleRepId: sales,
          CountryName: country,
          CustomerId: customer,
          IsPower: IsPower,
        },
      ];
  
      const body = {
        Token: token,
        ReqData: JSON.stringify(requestData), // Correctly stringifying the array
      };
  
      const response = await axios.post(apiUrl_kayra, body, {
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response?.data?.Status === '200') {
        return response?.data?.Data?.DT?.length > 0 ? response.data.Data.DT : [];
      } else {
        return []; // Empty array if no data or status is not 200
      }
    } catch (error) {
      console.log('API Error:', error);
      return []; // Return empty array on error
    }
  };

  export const fetchSalesDashboardData = async (token, hostName, fdate, tdate, event, sales, office, customer, country, LId, IsPower ) => {
  try {
    let apiUrl_kayra = '';

    if (hostName?.toLowerCase() === 'nzen' || hostName?.toLowerCase() === 'localhost') {
      apiUrl_kayra = 'http://nzen/jo/api-lib/App/DashBoard';
    } else {
      apiUrl_kayra = 'https://view.optigoapps.com/linkedapp/App/DashBoard';
    }

    const requestData = [
      {
        Token: token,
        Evt: event,
        LoginId: LId,
        FDate: fdate,
        TDate: tdate,
        LockerId: office,
        SaleRepId: sales,
        CountryName: country,
        CustomerId: customer,
        IsPower: IsPower,
      },
    ];

    const body = {
      Token: token,
      ReqData: JSON.stringify(requestData), // Correctly stringifying the array
    };

    const response = await axios.post(apiUrl_kayra, body, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (response?.data?.Status === '200') {
      return response?.data?.Data ? response.data.Data : null;
    } else {
      return []; // Empty array if no data or status is not 200
    }
  } catch (error) {
    console.log('API Error:', error);
    return []; // Return empty array on error
  }
  };

  export const fetchKPIDashboardData = async (apiUrl_kpi, token, fdate, tdate, event) => {
    try {
      // const url = "http://zen/jo/api-lib/App/KPI_DashBoard";
      const url = apiUrl_kpi;
      const body = JSON.stringify({
        "Token" : `${token}`  
        ,"ReqData":`[{\"Token\":\"${token}\",\"Evt\":\"${event}\",\"FDate\":\"${fdate}\",\"TDate\":\"${tdate}\"}]`
      });
      const headers = {
        "Content-Type":"application/json"
      }
      const response = await axios.post(url, body, headers);
      
      if (response?.data?.Status === '200') {
        return response?.data?.Data?.DT;
        // return  {DT:response.data.Data.DT, DT1:response.data.Data.DT1} ;
      } else {
        return []; // Empty array if no data or status is not 200
      }
    } catch (error) {
      console.log("API Error:", error);
      return []; // Return empty array on error
    }
  };

  export const capitalizeFirstLetter = (str) => {
    if (typeof str === 'string' && str.length > 0) {
      return str?.charAt(0)?.toUpperCase() + str?.slice(1)?.toLowerCase();
    }
    return str;
  };

  // export const formatAmountKWise = (amount) => {
  //   // Check if amount is a valid number
  //   if (isNaN(amount) || amount === null) return '0';
  
  //   // Convert the amount to a string for easier processing
  //   let formattedAmount = '';
  
  //   // Logic to handle different magnitudes
  //   if (amount >= 1000000) {
  //     formattedAmount = (amount / 1000000).toFixed(0) + 'M';  // Million (M)
  //   } else if (amount >= 1000) {
  //     formattedAmount = (amount / 1000).toFixed(0) + 'K';  // Thousand (K)
  //   } else {
  //     formattedAmount = amount.toString();  // Below 1000, just return the number as-is
  //   }
  
  //   return formattedAmount;
  // }
  // export const formatAmountKWise = (amount) => {
  //   // Check if amount is a valid number
  //   if (isNaN(amount) || amount === null) return '0';
    
  //   // Save the sign of the amount and work with the absolute value
  //   const isNegative = amount < 0;
  //   amount = Math.abs(amount);
  
  //   // Convert the amount to a string for easier processing
  //   let formattedAmount = '';
  
  //   // Logic to handle different magnitudes
  //   if (amount >= 1000000) {
  //     formattedAmount = (amount / 1000000).toFixed(0) + 'M';  // Million (M)
  //   } else if (amount >= 1000) {
  //     formattedAmount = (amount / 1000).toFixed(0) + 'K';  // Thousand (K)
  //   } else {
  //     formattedAmount = amount.toString();  // Below 1000, just return the number as-is
  //   }
  
  //   // If the amount was negative, add the negative sign back
  //   if (isNegative) {
  //     formattedAmount = '-' + formattedAmount;
  //   }
  
  //   return formattedAmount;
  // }

  export const formatAmountKWise = (amount) => {
    // Check if amount is a valid number
    if (isNaN(amount) || amount === null) return '0';
    
    // Save the sign of the amount and work with the absolute value
    const isNegative = amount < 0;
    amount = Math?.abs(amount);
    
    let formattedAmount = '';
  
    // Logic to handle different magnitudes
    if (amount >= 1000000) {
      formattedAmount = (amount / 1000000)?.toFixed(2);  // Use 2 decimal places for Million (M)
    } else if (amount >= 1000) {
      formattedAmount = (amount / 1000)?.toFixed(2);     // Use 2 decimal places for Thousand (K)
    } else {
      formattedAmount = amount?.toFixed(2)?.toString();  // Below 1000, just return the number as-is
    }
  
    // Remove trailing zeros (optional)
    formattedAmount = parseFloat(formattedAmount)?.toFixed(2)?.toString();
    
    // Append K or M suffix based on magnitude
    if (amount >= 1000000) {
      formattedAmount += 'M';
    } else if (amount >= 1000) {
      formattedAmount += 'K';
    }
  
    // If the amount was negative, add the negative sign back
    if (isNegative) {
      formattedAmount = '-' + formattedAmount;
    }
  
    return formattedAmount;
  };
  
  
// import axios from "axios";

// export function formatAmount(amount) {
//     const formattedAmount = parseFloat(+amount).toLocaleString('en-IN', {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     });
  
//     return formattedAmount;
//   }


//   export const fetchDashboardData = async (token, fdate, tdate, event) => {
//     try {
//       const url = "http://zen/jo/api-lib/App/DashBoard";
//       const body = JSON.stringify({
//         "Token" : `${token}`  
//         ,"ReqData":`[{\"Token\":\"${token}\",\"Evt\":\"${event}\",\"FDate\":\"${fdate}\",\"TDate\":\"${tdate}\"}]`
//       });
  
//       const response = await axios.post(url, body);
//       if (response?.data?.Status === '200') {
//         return response?.data?.Data?.DT?.length > 0 ? response.data.Data.DT : [];
//       } else {
//         return []; // Empty array if no data or status is not 200
//       }
//     } catch (error) {
//       console.log("API Error:", error);
//       return []; // Return empty array on error
//     }
//   };

//   export const capitalizeFirstLetter = (str) => {
//     if (typeof str === 'string' && str.length > 0) {
//       return str?.charAt(0)?.toUpperCase() + str?.slice(1)?.toLowerCase();
//     }
//     return str;
//   };

//   // export const formatAmountKWise = (amount) => {
//   //   // Check if amount is a valid number
//   //   if (isNaN(amount) || amount === null) return '0';
  
//   //   // Convert the amount to a string for easier processing
//   //   let formattedAmount = '';
  
//   //   // Logic to handle different magnitudes
//   //   if (amount >= 1000000) {
//   //     formattedAmount = (amount / 1000000).toFixed(0) + 'M';  // Million (M)
//   //   } else if (amount >= 1000) {
//   //     formattedAmount = (amount / 1000).toFixed(0) + 'K';  // Thousand (K)
//   //   } else {
//   //     formattedAmount = amount.toString();  // Below 1000, just return the number as-is
//   //   }
  
//   //   return formattedAmount;
//   // }
//   // export const formatAmountKWise = (amount) => {
//   //   // Check if amount is a valid number
//   //   if (isNaN(amount) || amount === null) return '0';
    
//   //   // Save the sign of the amount and work with the absolute value
//   //   const isNegative = amount < 0;
//   //   amount = Math.abs(amount);
  
//   //   // Convert the amount to a string for easier processing
//   //   let formattedAmount = '';
  
//   //   // Logic to handle different magnitudes
//   //   if (amount >= 1000000) {
//   //     formattedAmount = (amount / 1000000).toFixed(0) + 'M';  // Million (M)
//   //   } else if (amount >= 1000) {
//   //     formattedAmount = (amount / 1000).toFixed(0) + 'K';  // Thousand (K)
//   //   } else {
//   //     formattedAmount = amount.toString();  // Below 1000, just return the number as-is
//   //   }
  
//   //   // If the amount was negative, add the negative sign back
//   //   if (isNegative) {
//   //     formattedAmount = '-' + formattedAmount;
//   //   }
  
//   //   return formattedAmount;
//   // }

//   export const formatAmountKWise = (amount) => {
//     // Check if amount is a valid number
//     if (isNaN(amount) || amount === null) return '0';
    
//     // Save the sign of the amount and work with the absolute value
//     const isNegative = amount < 0;
//     amount = Math?.abs(amount);
    
//     let formattedAmount = '';
  
//     // Logic to handle different magnitudes
//     if (amount >= 1000000) {
//       formattedAmount = (amount / 1000000)?.toFixed(2);  // Use 2 decimal places for Million (M)
//     } else if (amount >= 1000) {
//       formattedAmount = (amount / 1000)?.toFixed(2);     // Use 2 decimal places for Thousand (K)
//     } else {
//       formattedAmount = amount?.toString();  // Below 1000, just return the number as-is
//     }
  
//     // Remove trailing zeros (optional)
//     formattedAmount = parseFloat(formattedAmount)?.toString();
    
//     // Append K or M suffix based on magnitude
//     if (amount >= 1000000) {
//       formattedAmount += 'M';
//     } else if (amount >= 1000) {
//       formattedAmount += 'K';
//     }
  
//     // If the amount was negative, add the negative sign back
//     if (isNegative) {
//       formattedAmount = '-' + formattedAmount;
//     }
  
//     return formattedAmount;
//   };
  
  