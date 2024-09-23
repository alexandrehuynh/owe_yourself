import React from 'react';
import { Checkbox } from '@mui/material';
import { styled } from '@mui/material/styles';

const AnimatedCheckbox = styled(Checkbox)(({ theme }) => ({
  '& .MuiSvgIcon-root': {
    transition: 'transform 0.3s ease-in-out, color 0.3s ease-in-out',
  },
  '&.Mui-checked .MuiSvgIcon-root': {
    transform: 'scale(1.2)',
    color: theme.palette.primary.main,
  },
}));

const CheckBoxAnim = ({ checked, onChange }) => {
  return (
    <AnimatedCheckbox
      checked={checked}
      onChange={onChange}
      color="default"
    />
  );
};

export default CheckBoxAnim;