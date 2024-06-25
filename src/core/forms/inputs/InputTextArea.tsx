import { FormArray, FormControl as FormControlType, FormGroup } from "react-reactive-form";
import { FormControl, TextField } from "@mui/material";

import { Color } from "../../../interfaces/Color";

export const InputTextArea =  ({ handler, touched, hasError, meta }: FormArray | FormControlType | FormGroup) => {
  const inputElem = handler();
  inputElem.value = meta.value ?? '';
  
  const getColor = () => {
    if (touched) {
      if (hasError("required")) {
        return Color.ERROR;
      }
      return Color.SUCCESS;
    }
    return Color.PRIMARY;
  };

  const getError = () => {
    if (touched) {
      if (hasError("required")) {
        return true;
      }
      return false;
    }

    return false;
  };
  return (
    <FormControl sx={{ width: "100%" }}>
      <TextField multiline rows={1} color={getColor()} error={getError()} helperText={getError() && meta.helperText} required fullWidth label={meta.label} {...inputElem} />
    </FormControl>
  );
};
