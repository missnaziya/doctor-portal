import { FormArray, FormControl as FormControlType, FormGroup } from "react-reactive-form";
import { FormControl, TextField } from "@mui/material";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Meta } from "../../../interfaces/meta";
import React from "react";

enum Color {
  PRIMARY = "primary",
  ERROR = "error",
  SECONDARY = "secondary",
  INFO = "info",
  SUCCESS = "success",
  WARNING = "warning",
}

export const InputCalender =  ({ handler, touched, hasError, meta }: FormArray | FormControlType | FormGroup) => {
    const [value, setValue] = React.useState<Dayjs | null>(null);

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
  <DatePicker
    label="Basic example"
    value={value}
    onChange={(newValue) => {
      setValue(newValue);
    }}
    // renderInput={(params) => <TextField {...params} />}
  />
</LocalizationProvider>
   {/* <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <Stack spacing={3}>
                                    <DatePicker
                                      views={["day"]}
                                      label="Just date"
                                      value={value}
                                      onChange={(newValue) => {
                                        setValue(newValue);
                                      }}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          helperText={null}
                                        />
                                      )}
                                    />
                                  </Stack>
                                </LocalizationProvider> */}
    
    </>
      
  
  );
};
