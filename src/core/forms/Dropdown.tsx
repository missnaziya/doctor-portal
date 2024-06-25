import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";

import React from "react";

enum Color {
  PRIMARY = "primary",
  ERROR = "error",
  SECONDARY = "secondary",
  INFO = "info",
  SUCCESS = "success",
  WARNING = "warning",
}

export const DropDownSelect = (props: { required?: boolean; name?: string; label?: string; value?: string; helperText?: string; error?: boolean; onChange?: {}; options?: Array<{ label: string; value: string }> }) => {
  const required = props.required ?? false;
  const name = props.name ?? "input-name";
  const label = props.label ?? "input-label";
  const options: Array<{ label: string; value: string }> = props.options ?? [];

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
    <FormControl sx={{ width: "100%" }}>
      <InputLabel id={name + "-label"}>{label}</InputLabel>
      <Select labelId={name + "-label"} name={name} error={hasError()} color={getColor()} required fullWidth value={model} onChange={handleChange} sx={{ boxShadow: "none", ".MuiOutlinedInput-notchedOutline": { border: 0 }, ".Mui-focused .MuiOutlinedInput-notchedOutline": { border: 0 } }} onFocus={() => setTouched(true)} label={label}>
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
    </FormControl>
  );
};
