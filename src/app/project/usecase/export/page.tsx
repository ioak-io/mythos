"use client";
import { AuthorizationState } from "@/store/AuthorizationStore";
import { Authorization } from "@/types/Authorization";
import React, { useEffect, useState } from "react";
import { exportData } from "./service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { IconButton,Select } from "basicui";
import "./style.css";
// import { Select, MenuItem, ListItemIcon,InboxIcon,ListItemText } from "@mui/material";

const ExportDropdown = ({ suiteId }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [authorization, setAuthorization] = useState<Authorization>({});

  useEffect(() => {
    AuthorizationState.subscribe((message) => {
      setAuthorization(message);
    });
  }, []);

  const handleSelectChange = (e) => {
    const value = e.target.value;
    setSelectedOption(value);
    
  };

  const convertToJSONFile = (data) => {
    if (data) {
      const jsonData = JSON.stringify(data);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'data.json');
      document.body.appendChild(link);
      link.click();
    }
  };

  const convertToCSVFile = (data) =>{
    const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'data.csv');
      document.body.appendChild(link);
      link.click();
  }

  const downloadData = () => {
    
    exportData(authorization, suiteId).then((response: any) => {
      convertToCSVFile(response)
    });
  };

  const triggerSelectClick =()=> {
    console.log("click")
    // Get the select element
     document.getElementById('export')?.click();;
    
    // // Create a new click event
    // const event = new Event('click');
    
    // // Dispatch the click event on the select element
    // select?.dispatchEvent(event);
  }



  return (
    // <select value={selectedOption} onChange={handleSelectChange}>
    //   <option value="">Select Type</option>
    //   <option value="CSV">CSV</option>
    //   <option value="JSON">JSON</option>
    // </select>
    <div className="export_option">
    <IconButton circle={true} onClick={downloadData}>
      <FontAwesomeIcon icon={faDownload} size="1x"  />
    </IconButton>
     {/* <Select value={selectedOption} id="export" onChange={handleSelectChange}>
      <option value="CSV">CSV</option>
      <option value="JSON">JSON</option>
     </Select> */}
    </div>
  );
};

export default ExportDropdown;
