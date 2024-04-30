"use client";
import { AuthorizationState } from "@/store/AuthorizationStore";
import { Authorization } from "@/types/Authorization";
import React, { useEffect, useState } from "react";
import { exportData } from "./service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "basicui";
import "./style.css";

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
    exportData(authorization, suiteId);
  };

  const downloadData = () => {
    
    exportData(authorization, suiteId);
  };



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
    </div>
  );
};

export default ExportDropdown;
