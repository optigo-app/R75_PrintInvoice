import { ToastContainer } from "react-toastify";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import './App.css';
import router from './routes/router';
import { BrowserRouter, Route, RouterProvider, Routes } from 'react-router-dom';
import AllDesign from "./pages/AllDesign";
import QcReport from "./pages/qcreport/QcReport";


function App() {
  
  return (
    <>
       <RouterProvider router={router}  />
       {/* <BrowserRouter>
       <Routes>
       <Routes>
        <Route path={`/`} element={<AllDesign />} />
        <Route path={`/R50B3/RBIP/`} element={<AllDesign />} />
        <Route path={`/R50B3/RBIP/qcreport`} element={<QcReport />} />
        <Route path={`/qcreport`} element={<QcReport />} />
       </Routes>
       </BrowserRouter> */}
       <ToastContainer />
    </>
  );
}

export default App;