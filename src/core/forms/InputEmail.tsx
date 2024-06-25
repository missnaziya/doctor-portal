import { FormArray, FormControl as FormControlType, FormGroup } from "react-reactive-form";
import { FormControl, TextField } from "@mui/material";

import { Color } from "../../interfaces/Color";

export const InputEmail =  ({ handler, touched, hasError, meta }: FormArray | FormControlType | FormGroup) => {

  const inputElem = handler();

  const getColor = () => {
    if (touched) {
      if (hasError("required") || (meta.name && hasError(meta.name))) {
        return Color.ERROR;
      }
      return Color.SUCCESS;
    }
    return Color.PRIMARY;
  };

  const getHelperText = () => {
    if (touched && hasError("required")) {
      return "Email is required";
    } else if (touched && (meta.name && hasError(meta.name))) {
      return "Invaild Email";
    }
    return "";
  };

  const getError = () => {
    if(touched && (hasError("required") || (meta.name && hasError(meta.name)))) {
      return true;
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
    <FormControl className="form-input" sx={{ width: "100%" }}>
      <TextField label={meta.label} fullWidth color={getColor()} required={isRequired()} helperText={getHelperText()} error={getError()} {...inputElem} />
    </FormControl>
  );
};
