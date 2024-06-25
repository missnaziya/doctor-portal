import { FormArray, FormControl as FormControlType, FormGroup } from "react-reactive-form";
import { FormControl, TextField } from "@mui/material";

import { Color } from "../../../interfaces/Color";

const EmailInput = ({ handler, touched, hasError, meta }: FormArray | FormControlType | FormGroup) => {

  const inputElem = handler();
  inputElem.value = meta.value ?? '';

  const getColor = () => {
    if (touched) {
      if (hasError("required") || hasError("email")) {
        return Color.ERROR;
      }
      return Color.SUCCESS;
    }
    return Color.PRIMARY;
  };

  const getHelperText = () => {
    if (touched && hasError("required")) {
      return "Email is required";
    } else if (touched && hasError("email")) {
      return "Invaild Email";
    }
    return "";
  };

  const getError = () => {
    return touched && (hasError("required") || hasError("email"));
  };

  return (
    <FormControl className="form-input" sx={{ width: "100%" }}>
      <TextField label={meta.label} fullWidth color={getColor()} required helperText={getHelperText()} error={getError()} {...inputElem} autoComplete="off" />
    </FormControl>
  );
};

export default EmailInput;
