import React from 'react';
import Chip from '@mui/material/Chip';

const ChipsInput = ({ labels }) => {
  const labelArray = labels.split(',').map(label => label.trim());

  return (
    <div>
      {labelArray.map((label, index) => (
        <Chip key={index} label={label} style={{ marginRight: 5, marginBottom: 5 }} />
      ))}
    </div>
  );
};

export default ChipsInput;
