import { FormArray, FormControl as FormControlType, FormGroup } from "react-reactive-form";
import { FormControl, TextField } from "@mui/material";

import { Color } from "../../interfaces/Color";

export const InputComment =  ({ handler, touched, hasError, meta }: FormArray | FormControlType | FormGroup) => {

  const inputElem = handler();
  // inputElem.value = meta.value ?? '';

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

  const isRequired = () => {
    if(typeof meta.required != 'undefined' ) {
      return meta.required
    }

    return true;
  }


  return (
    <FormControl sx={{ width: "100%" }}>
      <TextField rows={1} color={getColor()} required={isRequired()} error={getError()} helperText={getError() && meta.helperText} fullWidth label={meta.label} {...inputElem} />
    </FormControl>
  );
};
