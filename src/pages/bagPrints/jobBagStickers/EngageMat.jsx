import queryString from 'query-string';
import React, { useEffect, useState } from 'react'
import "../../../assets/css/bagprint/engagemat.css";
import Loader from '../../../components/Loader';
import { useLocation } from 'react-router-dom';
import { GetUniquejob } from '../../../GlobalFunctions/GetUniqueJob';
import { FetchDatas } from '../../../GlobalFunctions/FetchDatas';
import { handlePrint } from '../../../GlobalFunctions';


const EngageMat = ({queries, headers}) => {
  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const resultString = GetUniquejob(queryParams?.str_srjobno);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const abc = await FetchDatas(queryParams, resultString, queries, headers);
        abc?.length > 0 ? setData(abc) : setData([])
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
    useEffect(() => {
        if (Object.keys(queryParams)?.length !== 0) {
            atob(queryParams?.imagepath);
        }
    }, [queryParams]);
  
  useEffect(() => {
      if (data?.length !== 0) {
          setTimeout(() => {
              window.print();
          }, 4000);
      }
  }, [data]);


  return (
    <div>
      {
        data?.length === 0 ? <Loader /> : <React.Fragment>
          <div className="print_btn"><button className="btn_white blue print_btn" onClick={(e) => handlePrint(e)}>
                    Print
                </button></div>
                <div className='allengageMatjbs'>
                  {
                    data?.length > 0 && data?.map((e, i) => {
                      return(
                        <React.Fragment key={i}>
                          <div className='containerEMJBS'>
                        a
                          </div>
                        </React.Fragment>
                      )
                    })
                  }
                </div>
        </React.Fragment>
      }
    </div>
  )
}

export default EngageMat