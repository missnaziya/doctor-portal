import { FormArray, FormControl as FormControlType, FormGroup } from "react-reactive-form";
import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";

export const RadioInput =  ({ handler, touched, hasError, meta }: FormArray | FormControlType | FormGroup) => {

  const inputElem = handler('radio');
  inputElem.value = meta.value ?? '';
  
  return (
    <FormControl className="form-input" sx={{ width: "100%" }}>
      <RadioGroup  {...inputElem} row value={meta.defaultValue}>
        { meta.options && meta.options.map((opt: {label: string, value: string}, index: number) => {
            return (<FormControlLabel key={index} value={opt.value} control={<Radio />} label={opt.label} />)
          })
        }
      </RadioGroup >
    </FormControl>
  );
};
