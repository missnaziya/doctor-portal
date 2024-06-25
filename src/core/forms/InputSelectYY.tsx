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

export const InputSelectYY = (prop: { required: boolean }) => {
  const required = prop.required ?? false;
  const name = "YYYY";
  const label = "YYYY";
  const options: Array<{ label: string; value: string }> = [
    { label: "2022", value: "2022" },
    { label: "2021", value: "2021" },
    { label: "2020", value: "2020" },
    { label: "2019", value: "2019" },
    { label: "2018", value: "2018" },
    { label: "2017", value: "2017" },
    { label: "2016", value: "2016" },
    { label: "2015", value: "2015" },
    { label: "2014", value: "2014" },
    { label: "2013", value: "2013" },
    { label: "2012", value: "2012" },
    { label: "2011", value: "2011" },
    { label: "2010", value: "2010" },
    { label: "2009", value: "2009" },
    { label: "2008", value: "2008" },
    { label: "2007", value: "2007" },
    { label: "2006", value: "2006" },
    { label: "2005", value: "2005" },
    { label: "2004", value: "2004" },
    { label: "2003", value: "2003" },
    { label: "2002", value: "2002" },
    { label: "2001", value: "2001" },
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
