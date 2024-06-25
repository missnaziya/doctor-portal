import { FormArray, FormControl as FormControlType, FormGroup } from "react-reactive-form";
import { FormControl, TextField } from "@mui/material";

enum Color {
  PRIMARY = "primary",
  ERROR = "error",
  SECONDARY = "secondary",
  INFO = "info",
  SUCCESS = "success",
  WARNING = "warning",
}

export const InputText =  ({ handler, touched, hasError, meta }: FormArray | FormControlType | FormGroup) => {

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

    if(typeof meta.required != 'undefined' && meta.required === false) {
      return false;
    }

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
    <FormControl className="form-input" sx={{ width: "100%" }}>
      <TextField required={isRequired()} label={meta.label} fullWidth color={getColor()} helperText={getError() && meta.helperText} error={getError()} {...inputElem} />
    </FormControl>
  );
};
