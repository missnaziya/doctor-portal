import { FormArray, FormControl as FormControlType, FormGroup } from "react-reactive-form";
import { FormControl, TextField } from "@mui/material";

import { Color } from "../../../interfaces/Color";

export const InputZipCode =  ({ handler, touched, hasError, meta }: FormArray | FormControlType | FormGroup) => {

  let helperMessage = meta.helperText;

  const inputElem = handler();
  
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

    if (typeof meta.required != 'undefined' && meta.required === false) {
      return false;
    }
    if (touched) {
      if (hasError("required")) {
        return true;
      }   
      else {
        if (inputElem.value !== '') {
          if (!onlyAlphaNumeric()) {
            helperMessage = "Zip code can be alphanumeric or numeric";
            return true;
          }
          else if (inputElem.value.length < 3 || inputElem.value.length > 7) {
            helperMessage = "Zipcode should be of 3 to 7 characters long"
            return true;
          }
          else {
            helperMessage = meta.helperText;
          }
        }
      }
      return false;
    }

    return false;
  };

  const isRequired = () => {
    if (typeof meta.required != 'undefined') {
      return meta.required
    }
    return true;
  }

  const onlyAlphaNumeric = (): boolean => {
    const value = inputElem.value;
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    if (!alphanumericRegex.test(value)) {
      return false;
    }
    return true;    
  }

  return (
    <FormControl className="form-input" sx={{ width: "100%" }}>
      <TextField type="tel" required={isRequired()} label={meta.label} fullWidth color={getColor()} helperText={getError() && helperMessage} error={getError()} {...inputElem} />
    </FormControl>
  );
};
