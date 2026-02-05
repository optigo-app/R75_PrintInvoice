import React, { useEffect, useState } from "react";
import './index.css';
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ErrorIcon from "@mui/icons-material/Error";
import CircularProgress from "@mui/material/CircularProgress";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";
import dayjs from "dayjs";
import axios from 'axios';

const QcReport = () => {
  const [jobIdDisabled, setJobIdDisabled] = useState(false);
  const [ischecked, setIschecked] = useState(false);
  const [myData, setMyData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerms, setSearchTerms] = useState({
    roleId: "",
    fromDate: "",
    toDate: "",
    status: "",
    question: "",
  });
  const [loading, setLoading] = useState(true); 

  const handleJobIdToggle = () => {
    setJobIdDisabled(prev => !prev);
    setIschecked(prev => !prev);
  };

  const handleSearchChange = (field) => (event) => {
    setSearchTerms(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleClearSearch = (field) => () => {
    setSearchTerms(prev => ({
      ...prev,
      [field]: "",
    }));
  };

  const formatDate = (date) => dayjs(date).format("DD-MMM-YYYY");

  const filteredRows = myData.filter((row) => {
    const jobIdMatch = searchTerms.roleId
      ? row.jobId.toLowerCase().includes(searchTerms.roleId.toLowerCase())
      : true;

    const fromDate = searchTerms.fromDate ? dayjs(searchTerms.fromDate) : null;
    const toDate = searchTerms.toDate ? dayjs(searchTerms.toDate) : null;
    const qcDate = dayjs(row.Entrydate, "DD-MMM-YYYY");

    const dateMatch =
      (!fromDate || qcDate.isAfter(fromDate.subtract(1, "day"))) &&
      (!toDate || qcDate.isBefore(toDate.add(1, "day")));

    const statusMatch = searchTerms.status
      ? row.StatusName.toLowerCase().includes(searchTerms.status.toLowerCase())
      : true;

    return jobIdMatch && dateMatch && statusMatch;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          Authorization: '',
          YearCode: 'e3t6ZW59fXt7MjB9fXt7b3JhaWwyNH19e3tvcmFpbDI0fX0=',
          version: 'v4',
          'Content-Type': 'application/json',
        };

        const data = {
          con: "{\"id\":\"\",\"mode\":\"QCAnalysis\",\"appuserid\":\"admin@hs.com\"}",
          p: 'eyJTZXJpYWxKb2JubyI6IjAwMDAwMDkyMjIiLCJjdXN0b21lcmlkIjoiMjMiLCJCYWdQcmludE5hbWUiOiIifQ==',
          f: 'm-test2.orail.co.in (BAGPRINT1)',
        };

        const response = await axios.post('http://zen/api/M.asmx/Optigo', data, { headers });

        const parsedResponse = JSON.parse(response.data.d);

        const organizedData = organizeDataByJobId(parsedResponse.rd);
        const uniqueQuestions = Array.from(new Set(
          parsedResponse.rd
            .map(item => item.QCQuetionvalue)
            .filter(value => value !== null && value !== undefined && value !== "")
        ));

        const jobIdArray = [];
        let serialNumber = 1;

        organizedData.forEach(job => {
          job.Statuses.forEach(status => {
            const jobData = {
              id: serialNumber++,
              jobId: job.stockbarcode,
              StatusName: status,
              Entrydate: job.Entrydate,
              ...uniqueQuestions.reduce((acc, question) => {
                acc[question] = job.Questions[question] || "-";
                return acc;
              }, {})
            };
            jobIdArray.push(jobData);
          });

          if (job.Statuses.length === 0) {
            const jobData = {
              id: serialNumber++,
              jobId: job.stockbarcode,
              StatusName: "",
              Entrydate: job.Entrydate,
              ...uniqueQuestions.reduce((acc, question) => {
                acc[question] = job.Questions[question] || "-";
                return acc;
              }, {})
            };
            jobIdArray.push(jobData);
          }
        });

        const dateWiseArray = getDateWiseData(jobIdArray);
     
        if (ischecked) {
          setMyData(jobIdArray);
        } else {
          setMyData(dateWiseArray);
        }

        setFilteredData(ischecked ? jobIdArray : dateWiseArray);
        setLoading(false);

      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false); 
      }
    };

    fetchData();
  }, [ischecked]);

  const organizeDataByJobId = (data) => {
    const organizedData = [];

    data.forEach((item) => {
      const jobId = item.stockbarcode;
      const question = item.QCQuetionvalue;
      const statusName = item.StatusName || "-";

      let existingJob = organizedData.find(d => d.stockbarcode === jobId);

      if (!existingJob) {
        existingJob = {
          srNo: organizedData.length + 1,
          Entrydate: formatDate(item.Entrydate),
          stockbarcode: jobId,
          Statuses: [],
          Questions: {},
        };
        organizedData.push(existingJob);
      }

      existingJob.Questions[question] = item.asoptionvalue || "-";

      if (statusName !== "-" && statusName !== "") {
        existingJob.Statuses.push(statusName);
      }
    });

    return organizedData;
  };

  return (
    <div className="p-4 bg-[#F3F2F5]">
      <div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <Card>
            <CardContent>
              <Typography variant="h6" component="div">
                <CheckCircleIcon color="success" /> Total Approved
              </Typography>
              <Typography variant="h5" component="div">
                {filteredRows.filter(row => row.StatusName === "Approved").length}
              </Typography>
            </CardContent>
          </Card>
 
          <Card>
            <CardContent>
              <Typography variant="h6" component="div">
                <CancelIcon color="error" /> Total Rejected
              </Typography>
              <Typography variant="h5" component="div">
                {filteredRows.filter(row => row.StatusName === "Rejected").length}
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" component="div">
                <CancelIcon color="error" /> Total No
              </Typography>
              <Typography variant="h5" component="div">
                {filteredRows.filter(row => row.StatusName === "No").length}
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" component="div">
                <ErrorIcon color="disabled" /> Total Other
              </Typography>
              <Typography variant="h5" component="div">
                {filteredRows.length - (filteredRows.filter(row => row.StatusName === "Approved").length + filteredRows.filter(row => row.StatusName === "Rejected").length + filteredRows.filter(row => row.StatusName === "No").length)}
              </Typography>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block mb-1 text-gray-700">Search by Job ID</label>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerms.roleId}
              onChange={handleSearchChange("roleId")}
              className="w-full p-2 pl-10 border border-gray-300 ps-10 rounded-lg"
            />
            {searchTerms.roleId && (
              <ClearIcon
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400"
                onClick={handleClearSearch("roleId")}
              />
            )}
          </div>
        </div>
        <div>
          <label className="block mb-1 text-gray-700">From Date</label>
          <input
            type="date"
            value={searchTerms.fromDate}
            onChange={handleSearchChange("fromDate")}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-700">To Date</label>
          <input
            type="date"
            value={searchTerms.toDate}
            onChange={handleSearchChange("toDate")}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-700">Status</label>
          <input
            type="text"
            value={searchTerms.status}
            onChange={handleSearchChange("status")}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="toggleJobId"
          checked={ischecked}
          onChange={handleJobIdToggle}
        />
        <label htmlFor="toggleJobId" className="ml-2 text-gray-700">Toggle View</label>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <CircularProgress />
        </div>
      ) : (
        <div style={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 25]}
            disableSelectionOnClick
          />
        </div>
      )}
    </div>
  );
};

export default QcReport;
// 