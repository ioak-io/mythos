"use client";
import { AuthorizationState } from "@/store/AuthorizationStore";
import { Authorization } from "@/types/Authorization";
import React, { useEffect, useState } from "react";
import { exportData } from "./service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { IconButton, Button } from "basicui";
import "./style.css";
// import { Select, MenuItem, ListItemIcon,InboxIcon,ListItemText } from "@mui/material";

const ExportDropdown = ({ suiteId }) => {
  const [authorization, setAuthorization] = useState<Authorization>({});
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    AuthorizationState.subscribe((message) => {
      setAuthorization(message);
    });
  }, []);


  const convertToJSONFile = (data) => {
    if (data) {
      const jsonData = JSON.stringify(data);
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "data.json");
      document.body.appendChild(link);
      link.click();
    }
  };

  const convertToCSVFile = (data) => {
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();
  };

  const downloadData = (type) => {
    exportData(authorization, suiteId, type).then((response: any) => {
      if (type === "CSV") {
        convertToCSVFile(response);
      } else if (type === "JSON") {
        convertToJSONFile(response);
      }
      toggleDropdown();
    });
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="export_option">
      <IconButton circle={true} onClick={toggleDropdown}>
        <FontAwesomeIcon icon={faDownload} size="1x" />
      </IconButton>

      {isOpen && (
        <div className="dropdown-content">
          <Button onClick={() => downloadData("CSV")}>CSV</Button>
          <Button onClick={() => downloadData("JSON")}>JSON</Button>
        </div>
      )}
    </div>
  );
};

export default ExportDropdown;
