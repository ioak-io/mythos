import React from "react";
import Chip from "@mui/material/Chip";

const ChipsInput = ({ labels }) => {
  return (
    <div>
      {labels
        ?.split(",")
        .map((label) => label.trim())
        .map((label, index) => (
          <Chip
            key={index}
            label={label}
            style={{ marginRight: 5, marginBottom: 5 }}
          />
        ))}
    </div>
  );
};

export default ChipsInput;
