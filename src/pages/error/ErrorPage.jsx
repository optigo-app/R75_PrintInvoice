// import React from 'react';
// import img from "../../assets/img/error/error.webp";

// const ErrorPage = () => {
//   return (
//     <div style={{background: "#5ce1e7", width: "100%", height: "100%", minHeight: "100vh"}}>
//         <img src={img} alt='error-page' className='object-fit-contain' style={{position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}/>
//         </div>
//   )
// }

// export default ErrorPage


import React from 'react';
import erroricon from '../../assets/img/error/erroricon.png'; 

const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-6 bg-white rounded-lg shadow-lg max-w-md w-full">
        <img 
          src={erroricon} 
          alt="Error icon" 
          className="mx-auto mb-4 h-24 w-24 object-contain"
        />
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-lg text-gray-600 mb-4">Oops! The page you're looking for doesn't exist.</p>
        <p className="text-sm text-gray-500 mb-6">It might have been removed, or the URL might be incorrect.</p>
      
      </div>
    </div>
  );
};

export default ErrorPage;
