import React from 'react';
import { Checkbox } from '@mui/material';
import { Check, RadioButtonUnchecked } from '@mui/icons-material';

const CheckBoxAnim = ({ checked, onChange, streak }) => {
  return (
    <Checkbox
      checked={checked}
      onChange={onChange}
      icon={<RadioButtonUnchecked />}
      checkedIcon={<Check />}
      sx={{
        '& .MuiSvgIcon-root': {
          fontSize: 24,
          transition: 'all 0.3s',
        },
        '&.Mui-checked .MuiSvgIcon-root': {
          transform: 'scale(1.2)',
          color: 'primary.main',
        },
      }}
    />
  );
};

export default CheckBoxAnim;