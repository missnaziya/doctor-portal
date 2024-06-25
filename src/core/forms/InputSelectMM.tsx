import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";

import React from "react";
import calender from "../../assets/icons/calender.svg";

enum Color {
  PRIMARY = "primary",
  ERROR = "error",
  SECONDARY = "secondary",
  INFO = "info",
  SUCCESS = "success",
  WARNING = "warning",
}

export const InputSelectMM = (prop: { required: boolean }) => {
  const required = prop.required ?? false;
  const name = "MM";
  const label = "MM";
  const options: Array<{ label: string; value: string }> = [
    { label: "01", value: "01" },
    { label: "02", value: "02" },
    { label: "03", value: "03" },
    { label: "04", value: "04" },
    { label: "05", value: "05" },
    { label: "06", value: "06" },
    { label: "07", value: "07" },
    { label: "08", value: "08" },
    { label: "09", value: "09" },
    { label: "10", value: "10" },
    { label: "11", value: "11" },
    { label: "12", value: "12" },
  ];

  const [model, setModel] = React.useState("");
  const [touched, setTouched] = React.useState(false);

  const handleChange = (event: SelectChangeEvent) => {
    setModel(event.target.value);
  };

  const getColor = () => {
    if (touched) {
      if (required && model.length === 0) {
        return Color.ERROR;
      }

      return Color.SUCCESS;
    }

    return Color.PRIMARY;
  };

  const hasError = () => {
    if (touched) {
      if (required && model.length === 0) {
        return true;
      }
      return false;
    }

    return false;
  };

  return (
    <FormControl className="cc-number-input-mm" sx={{ width: "100%" }}>
      <InputLabel id={name + "-label"}>{label}</InputLabel>
      <Select labelId={name + "-label"} name={name} error={hasError()} color={getColor()} required fullWidth value={model} onChange={handleChange} onFocus={() => setTouched(true)} label={label}>
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {options.map((item: { label: string; value: string }, index) => {
          return (
            <MenuItem key={index} value={item.value}>
              {item.label}
            </MenuItem>
          );
        })}
      </Select>
      {/* <Box className="icon">
        <img src={calender} />
      </Box> */}
    </FormControl>
  );
};
